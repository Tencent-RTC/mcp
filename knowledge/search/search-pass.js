import { attachChunkContent, attachPoolContent } from '../content-loader.js';
import { buildReferences } from '../doc-url-resolver.js';
import { rankSubsetWithIndex, tokenize } from '../bm25.js';
import { getProductsBM25Index } from '../bm25-cache.js';
import { filterPoolHard, filterPoolStrict } from './filter-pool.js';
import { runExactLookup } from './exact-lookup.js';
import { computeGenericAnchorBoosts } from './generic-rerank.js';
import { embedQuery, withQueryInstruction } from '../embedding/embed-model.js';
import { queryVectors } from '../embedding/vector-index.js';
import { DISABLE_VECTOR_CHANNEL, VECTOR_AUGMENT_ALPHA, VECTOR_AUGMENT_BASE_BETA, VECTOR_TOP_K, VECTOR_RRF_K, VECTOR_RERANK_TOP_K, POOL_STRATEGY, } from '../../config.js';
import { applyRankMultipliers, computeApiNameCoverage, computeMissingApiTokens, postProcess, } from './search-core.js';
import { resolveRankProfile } from './rank-profile.js';
function isBestPracticeSource(source) {
    return /\/best-practice\//i.test(source);
}
function extractPrimaryHeading(content) {
    const heading = content.split('\n').find((line) => /^#\s+/.test(line.trim()));
    return heading ? heading.replace(/^#\s+/, '').trim() : '';
}
const DIAGNOSIS_INTENT_RE = /丢消息|消息丢失|message\s*loss|消息可靠性|message\s*reliability|超时|timeout|失败|fail(?:ed|ure)?|排查|诊断|troubleshoot(?:ing)?/i;
const DIAGNOSIS_DOC_RE = /diagnosis|troubleshoot|排查|诊断|丢失|message\s*loss|reliability|可靠性|timeout|fail(?:ed|ure)?/i;
const TUTORIAL_DOC_RE = /audio[\s-]*message|voice[\s-]*message|语音消息|录音|recorder|create[a-z]+message|sendmessage|standard\s*(approach|usage)|标准用法|如何发送|how\s*to\s*send/i;
function isDiagnosisIntent(prompt) {
    return DIAGNOSIS_INTENT_RE.test(prompt);
}
function decidePromptLockPolicy(prompt) {
    const integrationIntent = /集成|接入|指南|步骤|教程|快速开始|初始化|安装|跑通|demo|sample|example/i.test(prompt);
    const productIntent = /配置|限制|上限|规则|权限|计费|套餐|价格|资费|多端登录|错误码|命名|长度|开通|购买/i.test(prompt);
    if (integrationIntent && !productIntent) {
        return {
            enableContentPriority: true,
            enableFullDocumentLock: true,
        };
    }
    return {
        enableContentPriority: false,
        enableFullDocumentLock: false,
    };
}
function buildChunkIntentText(chunk) {
    return [
        chunk.title,
        ...(chunk.key_phrases ?? []),
        extractPrimaryHeading(chunk.content),
    ].filter(Boolean).join(' ');
}
function isDiagnosisStyleChunk(chunk) {
    return DIAGNOSIS_DOC_RE.test(buildChunkIntentText(chunk));
}
function isTutorialStyleChunk(chunk) {
    return TUTORIAL_DOC_RE.test(buildChunkIntentText(chunk));
}
/**
 * 通用门控：诊断/排查类问法下，抑制教程型文档误抢首位。
 * 仅对“教程型且非诊断型”文档施加轻度降权，不做任何单文档特化。
 */
function applyDiagnosisIntentGuard(ranked, chunksById, prompt) {
    if (!isDiagnosisIntent(prompt) || ranked.length < 2)
        return ranked;
    const topChunk = chunksById.get(ranked[0].id);
    const topIsTutorial = topChunk ? isTutorialStyleChunk(topChunk) && !isDiagnosisStyleChunk(topChunk) : false;
    const penalty = topIsTutorial ? 90 : 60;
    let adjusted = false;
    const next = ranked.map((item) => {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            return item;
        if (!isTutorialStyleChunk(chunk) || isDiagnosisStyleChunk(chunk))
            return item;
        adjusted = true;
        return { ...item, score: item.score - penalty };
    });
    return adjusted ? stableSortRanked(next) : ranked;
}
/**
 * A3: best-practice 后处理轻校准（不再做“主通道抢首位”）
 *
 * 目标：
 * - 保留 BP 的可见性优势（在接近相关时可轻微上浮）
 * - 避免强行顶到 Top1 导致“策略叠策略”的排序失真
 *
 * 触发条件（更保守）：
 * - 当前 Top1 不是 best-practice
 * - Top20 内存在 BP 候选
 * - 候选与 Top1 分差不大（gap <= 20%）且具备基础强度
 */
function prioritizeBestPracticeWhenCompetitive(ranked, chunksById, _prompt) {
    if (ranked.length < 2)
        return ranked;
    const top = ranked[0];
    const topChunk = chunksById.get(top.id);
    if (!topChunk || isBestPracticeSource(topChunk.source) || top.score <= 0) {
        return ranked;
    }
    const searchWindow = Math.min(ranked.length, 20);
    let bestPracticeIdx = -1;
    let bestPracticeScore = -Infinity;
    for (let i = 1; i < searchWindow; i += 1) {
        const chunk = chunksById.get(ranked[i].id);
        if (!chunk || !isBestPracticeSource(chunk.source))
            continue;
        if (ranked[i].score > bestPracticeScore) {
            bestPracticeScore = ranked[i].score;
            bestPracticeIdx = i;
        }
    }
    if (bestPracticeIdx < 0)
        return ranked;
    const candidate = ranked[bestPracticeIdx];
    const gapRatio = (top.score - candidate.score) / top.score;
    const competitiveEnough = gapRatio <= 0.2;
    const strengthEnough = candidate.score >= Math.max(14, top.score * 0.3);
    if (!competitiveEnough || !strengthEnough)
        return ranked;
    // 轻量校准：最多只允许轻微越过 top，避免“强提权抢首位”。
    const lift = Math.max(top.score * 0.03, 1.2);
    const boostedScore = Math.min(top.score * 1.01, candidate.score + lift);
    if (boostedScore <= candidate.score)
        return ranked;
    const next = [...ranked];
    next[bestPracticeIdx] = { ...candidate, score: boostedScore };
    return stableSortRanked(next);
}
/**
 * P0-R1/P0-R2：best-practice 单 chunk 收敛（高置信门控版）。
 * 仅当 BP 在跨来源竞争中具备明显优势时，才锁定 preferredSource + fullDocumentMode。
 * 不再因为轻量校准后的微小领先而触发整文锁定。
 */
function pickDominantBestPracticeSource(ranked, chunksById, fullDocumentMaxChars) {
    const top = ranked[0];
    if (!top || top.score <= 0)
        return { fullDocumentMode: false };
    const topChunk = chunksById.get(top.id);
    if (!topChunk || !isBestPracticeSource(topChunk.source)) {
        return { fullDocumentMode: false };
    }
    const source = topChunk.source;
    const topWindow = ranked.slice(0, 12);
    // URL 映射行和 FAQ 语料是导航指针/概览而非内容竞争者：
    // 若计入两者竞争，1.2 倍 dominance 门槛在 best-practice 被命中时永远无法达成。
    const isCrossCompetitor = (item) => {
        const chunk = chunksById.get(item.id);
        if (!chunk || chunk.source === source)
            return false;
        if (chunk.source.includes('/faq/'))
            return false;
        return true;
    };
    const secondCrossSource = ranked.find((item) => isCrossCompetitor(item));
    const secondCrossScore = secondCrossSource?.score ?? 0;
    const strongCrossSourceCount = topWindow
        .filter((item) => isCrossCompetitor(item) && item.score >= top.score * 0.92)
        .length;
    const sourceSections = [...chunksById.values()].filter((chunk) => chunk.source === source);
    const sourceTotalChars = sourceSections.reduce((sum, chunk) => sum + chunk.content.length, 0);
    const scoreStrongEnough = top.score >= 85;
    const dominanceStrongEnough = secondCrossScore === 0
        ? top.score >= 65
        : (top.score / secondCrossScore) >= 1.25;
    const crossSourceNotCompeting = strongCrossSourceCount === 0;
    const withinLengthBudget = sourceTotalChars <= fullDocumentMaxChars;
    if (scoreStrongEnough && dominanceStrongEnough && crossSourceNotCompeting && withinLengthBudget) {
        return {
            preferredSource: source,
            fullDocumentMode: true,
        };
    }
    return { fullDocumentMode: false };
}
function isIntegrationSource(chunk) {
    return (chunk.types ?? []).includes('integration');
}
/**
 * 覆盖度竞争：在 A3 之前执行。
 * 当 integration 的多个 section 被查询广泛命中时，选择 integration 完整文档；
 * 否则返回 null，交由 A3 + BP 收敛处理。
 *
 * 规则：
 * - 按 source 聚合 integration 的 section 命中数，选命中数最多的 source
 * - ≥3 个 section 命中 + integration top 分数 ≥ BP top × 0.6 → 选 integration
 * - BP 分数远高于 integration（>1.2×）→ 直接返回 null
 * - 否则 → 返回 null
 */
function resolveContentPriority(ranked, chunksById, fullDocumentMaxChars) {
    if (ranked.length < 2)
        return null;
    // 找 BP 最高分（在 top-30 范围内）
    let bpTopScore = -1;
    for (let i = 0; i < Math.min(ranked.length, 30); i++) {
        const chunk = chunksById.get(ranked[i].id);
        if (!chunk)
            continue;
        if (isBestPracticeSource(chunk.source) && ranked[i].score > bpTopScore) {
            bpTopScore = ranked[i].score;
        }
    }
    // 按 source 聚合 integration 的 section 命中（在全部 ranked 范围内，但有 minScore 门槛）
    const minScore = bpTopScore > 0 ? Math.max(bpTopScore * 0.3, 5) : 5;
    const intSourceStats = new Map();
    for (const item of ranked) {
        const chunk = chunksById.get(item.id);
        if (!chunk || !isIntegrationSource(chunk))
            continue;
        if (item.score < minScore)
            continue;
        const prev = intSourceStats.get(chunk.source);
        if (!prev) {
            intSourceStats.set(chunk.source, { hitCount: 1, topScore: item.score });
        }
        else {
            intSourceStats.set(chunk.source, {
                hitCount: prev.hitCount + 1,
                topScore: Math.max(prev.topScore, item.score),
            });
        }
    }
    if (intSourceStats.size === 0)
        return null;
    // 选命中数最多的 integration source（同命中数则选分数最高的）
    let bestIntSource = '';
    let bestHitCount = 0;
    let bestIntTopScore = 0;
    for (const [source, stats] of intSourceStats) {
        if (stats.hitCount > bestHitCount
            || (stats.hitCount === bestHitCount && stats.topScore > bestIntTopScore)) {
            bestIntSource = source;
            bestHitCount = stats.hitCount;
            bestIntTopScore = stats.topScore;
        }
    }
    const integrationSourceTotalChars = [...chunksById.values()]
        .filter((chunk) => chunk.source === bestIntSource)
        .reduce((sum, chunk) => sum + chunk.content.length, 0);
    const withinLengthBudget = integrationSourceTotalChars <= fullDocumentMaxChars;
    // 无 BP 候选 → 选 integration（如果有足够 section 命中）
    if (bpTopScore < 0) {
        return bestHitCount >= 2 && withinLengthBudget
            ? { preferredSource: bestIntSource, fullDocumentMode: true }
            : null;
    }
    // BP 分数远高于 integration → 不走 integration 路径
    if (bpTopScore > bestIntTopScore * 1.2)
        return null;
    // 覆盖度判定
    const BREADTH_THRESHOLD = 3;
    if (bestHitCount >= BREADTH_THRESHOLD && bestIntTopScore >= bpTopScore * 0.6 && withinLengthBudget) {
        return { preferredSource: bestIntSource, fullDocumentMode: true };
    }
    return null;
}
function readEnvNumber(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined || raw === '')
        return fallback;
    const val = Number(raw);
    return Number.isFinite(val) ? val : fallback;
}
function stableSortRanked(items) {
    return [...items].sort((a, b) => {
        if (b.score !== a.score)
            return b.score - a.score;
        return a.id.localeCompare(b.id);
    });
}
function inferPreferredIotFeatureDomain(ranked, chunksById) {
    const scoreByDomain = new Map();
    const sampleWindow = Math.min(ranked.length, 80);
    for (let i = 0; i < sampleWindow; i += 1) {
        const item = ranked[i];
        const chunk = chunksById.get(item.id);
        if (!chunk || chunk.product !== 'iot' || !chunk.feature_domain)
            continue;
        const domain = chunk.feature_domain;
        scoreByDomain.set(domain, (scoreByDomain.get(domain) ?? 0) + Math.max(item.score, 0));
    }
    let preferred;
    let best = -1;
    for (const [domain, score] of scoreByDomain.entries()) {
        if (score > best) {
            best = score;
            preferred = domain;
        }
    }
    return preferred;
}
function fuseByRRF(params) {
    const { bm25Ranked, vectorHits, rrfK, baseBeta, alpha, profile, } = params;
    const bmWeight = profile?.bmWeight ?? 1;
    const vecWeight = profile?.vecWeight ?? 1;
    const alphaScale = profile?.alphaScale ?? 1;
    if (!bm25Ranked.length && !vectorHits.length) {
        return { ranked: [], bm25AdjustedCount: 0, vectorOnlyAddedCount: 0 };
    }
    const topBM25 = bm25Ranked[0]?.score ?? baseBeta;
    const bm25ById = new Map(bm25Ranked.map((item) => [item.id, item]));
    const bm25Rank = new Map();
    bm25Ranked.forEach((item, idx) => bm25Rank.set(item.id, idx + 1));
    const vecRank = new Map();
    vectorHits.forEach((hit, idx) => vecRank.set(hit.id, idx + 1));
    const vecMin = vectorHits.length ? Math.min(...vectorHits.map((h) => h.score)) : 0;
    const vecMax = vectorHits.length ? Math.max(...vectorHits.map((h) => h.score)) : 1;
    const vecRange = vecMax - vecMin || 1;
    const vecNorm = new Map();
    for (const hit of vectorHits) {
        vecNorm.set(hit.id, (hit.score - vecMin) / vecRange);
    }
    const unionIds = new Set([
        ...bm25Ranked.map((item) => item.id),
        ...vectorHits.map((item) => item.id),
    ]);
    const rrfRaw = new Map();
    let maxRRF = 0;
    for (const id of unionIds) {
        const bRank = bm25Rank.get(id);
        const vRank = vecRank.get(id);
        const score = (bRank ? bmWeight / (rrfK + bRank) : 0)
            + (vRank ? vecWeight / (rrfK + vRank) : 0);
        rrfRaw.set(id, score);
        if (score > maxRRF)
            maxRRF = score;
    }
    let bm25AdjustedCount = 0;
    let vectorOnlyAddedCount = 0;
    // 类别权重也影响 hybrid 融合权重，避免 rrf 权重与 sim 权重口径分裂。
    const totalWeight = bmWeight + vecWeight || 1;
    const simWeight = vecWeight / totalWeight; // 0..1
    const rrfWeight = 1 - simWeight;
    const fused = [...unionIds].map((id) => {
        const original = bm25ById.get(id);
        const rrfNorm = maxRRF > 0 ? (rrfRaw.get(id) ?? 0) / maxRRF : 0;
        const simNorm = vecNorm.get(id) ?? 0;
        const hybridNorm = rrfWeight * rrfNorm + simWeight * simNorm;
        const effectiveAlpha = alpha * alphaScale;
        if (original) {
            const hasVectorSignal = vecRank.has(id);
            if (hasVectorSignal)
                bm25AdjustedCount += 1;
            const boost = hasVectorSignal ? original.score * effectiveAlpha * 0.25 * hybridNorm : 0;
            return { id, score: original.score + boost };
        }
        vectorOnlyAddedCount += 1;
        return { id, score: topBM25 * baseBeta * (1 + effectiveAlpha * 0.9 * hybridNorm) };
    });
    return {
        ranked: stableSortRanked(fused),
        bm25AdjustedCount,
        vectorOnlyAddedCount,
    };
}
function resolveFusionProfile(prompt, queryApiTokens) {
    const trimmed = prompt.trim();
    if (queryApiTokens.length > 0) {
        return { name: 'api_token', bmWeight: 1.3, vecWeight: 0.8, alphaScale: 0.7 };
    }
    // 长自然语言：字符数或分词粒度足够
    const tokenCount = tokenize(trimmed).filter((t) => t.length >= 2).length;
    const isLongNatural = trimmed.length >= 14 || tokenCount >= 6;
    if (isLongNatural) {
        return { name: 'natural_language', bmWeight: 0.85, vecWeight: 1.2, alphaScale: 1.15 };
    }
    const isShortKeyword = trimmed.length <= 6 && tokenCount <= 2;
    if (isShortKeyword) {
        return { name: 'short_keyword', bmWeight: 1.0, vecWeight: 1.0, alphaScale: 0.9 };
    }
    return { name: 'default', bmWeight: 1.0, vecWeight: 1.0, alphaScale: 1.0 };
}
function normalizeCompactText(input) {
    return input.toLowerCase().replace(/[\s\-_]+/g, '');
}
function hasTitleExactMatch(prompt, title) {
    if (!prompt || !title)
        return false;
    const p = normalizeCompactText(prompt);
    const t = normalizeCompactText(title);
    if (!p || !t)
        return false;
    if (t.length >= 3 && p.includes(t))
        return true;
    if (p.length >= 3 && t.includes(p))
        return true;
    return false;
}
function shouldTriggerLowConfidenceRerank(params) {
    const { ranked, rankProfile } = params;
    if (rankProfile.lowConfidenceRerankTopK <= 0 || ranked.length < 2)
        return false;
    const top = ranked[0]?.score ?? 0;
    const second = ranked[1]?.score ?? 0;
    if (top <= 0)
        return false;
    const ratio = second > 0 ? top / second : Number.POSITIVE_INFINITY;
    return top <= rankProfile.lowConfidenceTopScoreThreshold || ratio <= rankProfile.lowConfidenceGapRatioThreshold;
}
function rerankTopK(params) {
    const { prompt, ranked, chunksById, topK, rankProfile, } = params;
    if (ranked.length < 2 || topK <= 0)
        return { ranked, applied: false };
    const head = ranked.slice(0, topK);
    const tail = ranked.slice(topK);
    const promptTokens = [...new Set(tokenize(prompt).filter((t) => t.length >= 2))];
    if (!promptTokens.length)
        return { ranked, applied: false };
    const topScore = head[0]?.score ?? 0;
    const bumped = head.map((item) => {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            return item;
        const text = [chunk.title, ...(chunk.key_phrases ?? [])].join(' ').toLowerCase();
        const overlap = promptTokens.reduce((acc, token) => (text.includes(token.toLowerCase()) ? acc + 1 : acc), 0);
        if (overlap <= 0 && !hasTitleExactMatch(prompt, chunk.title))
            return item;
        let boost = topScore * 0.002 * overlap;
        if (hasTitleExactMatch(prompt, chunk.title)) {
            boost += Math.max(topScore * 0.015, 1.5) * (rankProfile.titleExactMultiplier - 1);
        }
        boost += rankProfile.titleTokenBoost * overlap;
        return { ...item, score: item.score + boost };
    });
    const rerankedHead = stableSortRanked(bumped);
    const applied = rerankedHead.some((item, idx) => item.id !== head[idx]?.id);
    return { ranked: [...rerankedHead, ...tail], applied };
}
export async function runSearchPass(params) {
    const { allChunks, passNorm, retrievalMode, queryApiTokens, opts, } = params;
    const effectivePassNorm = retrievalMode === 'discovery'
        ? { ...passNorm, types: undefined }
        : passNorm;
    const rankProfile = resolveRankProfile({ product: effectivePassNorm.product });
    // ── 候选池构建 ──
    //
    // framework/types/scenario 不做硬过滤，只在 applyRankMultipliers 做连续降权，
    // 仅 product 保留硬隔离。传错参数只是排名靠后，不会「答案消失」。
    //
    // 实测对照：
    //   hard（仅 product）     hit@1 22.2% / hit@3 37.0% / hit@5 40.7%  ← 当前
    //   strict（Hard+Soft）    hit@1 18.5% / hit@3 33.3% / hit@5 40.7%
    // 严格池中位数 1567 条、宽松池 3541 条，二者都远超排序窗口，不存在「候选不足」场景，
    // 因此无需 strict 回退兜底（曾验证按候选数阈值回退，结果与 strict 完全一致 = 劣化）。
    const hardPool = filterPoolHard(allChunks, effectivePassNorm);
    const pool = POOL_STRATEGY === 'strict'
        ? filterPoolStrict(allChunks, effectivePassNorm)
        : hardPool;
    // 向量通道同样只受 Hard 层约束，保留跨平台/类型的语义自愈能力。
    const hardChunksById = new Map(hardPool.map((chunk) => [chunk.id, chunk]));
    const { boosts, exactHits } = runExactLookup(effectivePassNorm.prompt, pool, effectivePassNorm);
    // B2: API 覆盖不足扩检时，对 api/integration 语料做轻量重排提权
    if (opts?.apiRetry) {
        for (const chunk of pool) {
            if (chunk.types.includes('api') || chunk.types.includes('integration')) {
                boosts[chunk.id] = (boosts[chunk.id] ?? 0) + 40;
            }
        }
    }
    const productIndex = getProductsBM25Index(allChunks, passNorm.product);
    const poolWithContent = attachPoolContent(pool);
    const chunksById = new Map(poolWithContent.map((chunk) => [chunk.id, chunk]));
    // 通用加性 rerank：数据驱动的高 IDF 锚点命中 + 连续短语命中。
    // 纯加性、只加不减、无信号时返回空 map → 排序退化为原始，已有功能零衰减。
    const genericBoosts = computeGenericAnchorBoosts(effectivePassNorm.prompt, poolWithContent, productIndex, tokenize);
    for (const [id, amount] of Object.entries(genericBoosts)) {
        boosts[id] = (boosts[id] ?? 0) + amount;
    }
    const ranked = rankSubsetWithIndex(effectivePassNorm.prompt, pool.map((chunk) => chunk.id), productIndex, boosts);
    // 固定链路：Hybrid（BM25 + Vector）→ RRF 融合 → 轻量重排。
    // 兼容开关：DISABLE_VECTOR_CHANNEL=true 时只关闭向量相关步骤，BM25 主链路保持不变。
    const vectorAugmentDisabled = DISABLE_VECTOR_CHANNEL;
    const alpha = VECTOR_AUGMENT_ALPHA;
    const baseBeta = VECTOR_AUGMENT_BASE_BETA;
    const topK = VECTOR_TOP_K;
    const rrfK = VECTOR_RRF_K;
    const rerankTopKLimit = Math.max(0, rankProfile.rerankTopK || VECTOR_RERANK_TOP_K);
    const fullDocumentMaxChars = Math.max(1000, Math.floor(readEnvNumber('SEARCH_FULL_DOCUMENT_MAX_CHARS', 7000)));
    let rankedFused = ranked;
    // 向量归因埋点采集（终态归因在函数末尾统一构造）：
    // - bm25TopIdSnapshot：向量介入前的 BM25 单路头名（即 ranked[0]，融合前的原始头名）
    // - vectorTopIdSnapshot：向量单路头名（vecHits[0]，经 hardChunksById 过滤后）
    // - vecScoreById：向量单路每个候选的 sim 分，供 final_top1_id 查表得 vector_score_of_final_top1
    // - bm25RankById：向量介入前 BM25 单路的 1-based 名次索引，供 rank_shift 与 promoted_by_vector_count 计算
    const bm25TopIdSnapshot = ranked[0]?.id ?? null;
    const bm25RankById = new Map();
    ranked.forEach((item, idx) => bm25RankById.set(item.id, idx + 1));
    let vectorTopIdSnapshot = null;
    let vecScoreById = new Map();
    if (!vectorAugmentDisabled) {
        try {
            const [qvecInst, qvecRaw] = await Promise.all([
                embedQuery(withQueryInstruction(effectivePassNorm.prompt)),
                embedQuery(effectivePassNorm.prompt),
            ]);
            const [hitsInst, hitsRaw] = await Promise.all([
                queryVectors(passNorm.product, qvecInst, topK),
                queryVectors(passNorm.product, qvecRaw, topK),
            ]);
            const merged = new Map();
            for (const h of hitsInst) {
                merged.set(h.id, Math.max(merged.get(h.id) ?? Number.NEGATIVE_INFINITY, h.score));
            }
            for (const h of hitsRaw) {
                const weighted = h.score * 0.97;
                merged.set(h.id, Math.max(merged.get(h.id) ?? Number.NEGATIVE_INFINITY, weighted));
            }
            const hits = [...merged.entries()]
                .map(([id, score]) => ({ id, score }))
                .sort((a, b) => {
                if (b.score !== a.score)
                    return b.score - a.score;
                return a.id.localeCompare(b.id);
            })
                .slice(0, topK);
            // 分层过滤：向量仅受 Hard 层（product）约束，
            // framework/types/scenario 交给 applyRankMultipliers 做软降权。
            // 向量补召回但不在 BM25 pool 内的 chunk 需要挂到 chunksById，供下游 rerank / multiplier / postProcess 读取。
            const vecHits = hits.filter((h) => hardChunksById.has(h.id));
            for (const hit of vecHits) {
                if (chunksById.has(hit.id))
                    continue;
                const chunk = hardChunksById.get(hit.id);
                if (!chunk)
                    continue;
                chunksById.set(hit.id, attachChunkContent(chunk));
            }
            vectorTopIdSnapshot = vecHits[0]?.id ?? null;
            vecScoreById = new Map(vecHits.map((h) => [h.id, h.score]));
            if (vecHits.length > 0) {
                const fusionProfile = resolveFusionProfile(effectivePassNorm.prompt, queryApiTokens);
                const fused = fuseByRRF({
                    bm25Ranked: ranked,
                    vectorHits: vecHits,
                    rrfK,
                    baseBeta,
                    alpha,
                    profile: fusionProfile,
                });
                const reranked = rerankTopK({
                    prompt: effectivePassNorm.prompt,
                    ranked: fused.ranked,
                    chunksById,
                    topK: rerankTopKLimit,
                    rankProfile,
                });
                rankedFused = reranked.ranked;
            }
        }
        catch {
            // 向量链路失败（embed/query 异常）：保持 rankedFused = ranked，
            // 快照变量维持初始值即可。归因阶段 vector_top1_id 为 null 天然反映降级。
        }
    }
    const preferredIotFeatureDomain = inferPreferredIotFeatureDomain(rankedFused, chunksById);
    const rankedWithMultipliers = applyRankMultipliers(rankedFused, chunksById, {
        product: passNorm.product,
        framework: passNorm.framework,
        frameworks: passNorm.frameworks,
        types: effectivePassNorm.types,
        scenario: effectivePassNorm.scenario,
        preferred_iot_feature_domain: preferredIotFeatureDomain,
        prompt: passNorm.prompt,
        rank_profile: rankProfile.name,
    });
    let rankedAfterIntentGuard = applyDiagnosisIntentGuard(rankedWithMultipliers, chunksById, passNorm.prompt);
    if (shouldTriggerLowConfidenceRerank({ ranked: rankedAfterIntentGuard, rankProfile })) {
        const secondPass = rerankTopK({
            prompt: passNorm.prompt,
            ranked: rankedAfterIntentGuard,
            chunksById,
            topK: rankProfile.lowConfidenceRerankTopK,
            rankProfile,
        });
        if (secondPass.applied) {
            rankedAfterIntentGuard = secondPass.ranked;
        }
    }
    const promptLockPolicy = decidePromptLockPolicy(passNorm.prompt);
    const allowContentPriority = promptLockPolicy.enableContentPriority;
    const allowFullDocumentLock = promptLockPolicy.enableFullDocumentLock;
    // 覆盖度竞争先于 A3 执行（仅在前置策略允许时开启）
    // 若覆盖度竞争未触发，再尝试“导航来源 vs 内容来源”的通用语义仲裁。
    const integrationPriority = allowContentPriority
        ? resolveContentPriority(rankedAfterIntentGuard, chunksById, fullDocumentMaxChars)
        : null;
    let dominantBestPractice;
    let rankedAfterBestPractice;
    if (integrationPriority) {
        // integration 胜出 → 跳过 A3，直接走完整文档路径
        rankedAfterBestPractice = rankedAfterIntentGuard;
        dominantBestPractice = allowFullDocumentLock
            ? integrationPriority
            : { fullDocumentMode: false };
    }
    else {
        // integration 未胜出 → A3 提升 BP → BP 收敛判定
        rankedAfterBestPractice = prioritizeBestPracticeWhenCompetitive(rankedAfterIntentGuard, chunksById, passNorm.prompt);
        dominantBestPractice = allowFullDocumentLock
            ? pickDominantBestPracticeSource(rankedAfterBestPractice, chunksById, fullDocumentMaxChars)
            : { fullDocumentMode: false };
    }
    const fragments = postProcess(rankedAfterBestPractice, chunksById, passNorm.limit, {
        preferredSource: dominantBestPractice.preferredSource,
        fullDocumentMode: dominantBestPractice.fullDocumentMode,
        fullDocumentMaxChars,
        maxPerSource: rankProfile.maxPerSource,
    });
    const references = buildReferences(fragments);
    const apiNameCoverage = computeApiNameCoverage(queryApiTokens, poolWithContent);
    const missingApiTokens = computeMissingApiTokens(queryApiTokens, poolWithContent);
    // === 向量归因（终态构造）===
    // final_top1_id：postProcess 之后 fragments[0] 的 chunk_id（此处快照即最终外部感知的 top1）。
    const finalTop1Id = fragments[0]?.chunk_id ?? null;
    const finalTop1BmRank = finalTop1Id ? (bm25RankById.get(finalTop1Id) ?? null) : null;
    const finalTop1VecScore = finalTop1Id ? (vecScoreById.get(finalTop1Id) ?? null) : null;
    // promoted_by_vector_count：BM25 原始名次 > 3 且经融合/后处理进入 final top3 的 chunk 数量。
    // 只需交集 |{chunk : bm25Rank(chunk) > 3 AND chunk ∈ finalTop3}|；ranked 为空自然记 0。
    const finalTop3Ids = fragments.slice(0, 3).map((f) => f.chunk_id);
    let promotedByVectorCount = 0;
    for (const id of finalTop3Ids) {
        const bmRank = bm25RankById.get(id);
        if (bmRank !== undefined && bmRank > 3)
            promotedByVectorCount += 1;
    }
    const vectorDiagnostics = {
        bm25_top1_id: bm25TopIdSnapshot,
        vector_top1_id: vectorTopIdSnapshot,
        final_top1_id: finalTop1Id,
        rank_shift_from_bm25: finalTop1BmRank,
        vector_score_of_final_top1: finalTop1VecScore,
        promoted_by_vector_count: promotedByVectorCount,
    };
    return {
        pool,
        poolWithContent,
        rankedWithMultipliers: rankedAfterBestPractice,
        fragments,
        exactHits,
        references,
        apiNameCoverage,
        missingApiTokens,
        vectorDiagnostics,
        preferredSource: dominantBestPractice.preferredSource,
        fullDocumentMode: dominantBestPractice.fullDocumentMode,
    };
}

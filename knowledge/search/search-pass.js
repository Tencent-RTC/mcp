import { attachPoolContent } from '../content-loader.js';
import { buildReferences } from '../doc-url-resolver.js';
import { rankSubsetWithIndex, tokenize } from '../bm25.js';
import { getProductsBM25Index } from '../bm25-cache.js';
import { filterPool } from './filter-pool.js';
import { runExactLookup } from './exact-lookup.js';
import { computeGenericAnchorBoosts } from './generic-rerank.js';
import { applyRankMultipliers, computeApiNameCoverage, computeMissingApiTokens, isUrlMappingSource, postProcess, } from './search-core.js';
function isBestPracticeSource(source) {
    return /\/best-practice\//i.test(source);
}
function normalizeTopicText(text) {
    return text
        .toLowerCase()
        .replace(/[（()）【】\[\]{}《》"""'`]/g, '')
        .replace(/[\s/\\,，。:：;；|·\-—_]+/g, '');
}
const TOPIC_EN_NOISE_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with',
    'is', 'are', 'was', 'were', 'be', 'how', 'what', 'why', 'when', 'where',
    'chat', 'message', 'messages', 'api', 'sdk', 'doc', 'docs',
]);
function extractTopicTokens(text) {
    const tokens = new Set();
    for (const match of text.matchAll(/\b\d{2,}\b/g)) {
        tokens.add(match[0]);
    }
    for (const match of text.matchAll(/\b[a-z][a-z0-9_]{1,}\b/gi)) {
        const token = match[0].toLowerCase();
        if (TOPIC_EN_NOISE_WORDS.has(token))
            continue;
        tokens.add(token);
    }
    const cjkSegments = text.match(/[\u4e00-\u9fff]+/g) ?? [];
    for (const seg of cjkSegments) {
        if (seg.length >= 2)
            tokens.add(seg);
        for (let i = 0; i < seg.length - 1; i += 1) {
            tokens.add(seg.slice(i, i + 2));
        }
    }
    return [...tokens].filter((token) => token.length >= 2);
}
function countTopicTokenHits(tokens, normalizedTarget) {
    if (!tokens.length || !normalizedTarget)
        return 0;
    let hits = 0;
    for (const token of tokens) {
        const normalizedToken = normalizeTopicText(token);
        if (normalizedToken.length < 2)
            continue;
        if (normalizedTarget.includes(normalizedToken))
            hits += 1;
    }
    return hits;
}
const TOPIC_GENERIC_GUARD_WORDS = new Set([
    ...TOPIC_EN_NOISE_WORDS,
    'web', 'ios', 'android', 'flutter', 'react', 'vue',
    '直播', '消息', '文档', '教程', '指南', '重要', '保证', '丢失', '聊天',
]);
/**
 * 提取更强区分度的话题锚点（通用策略，不针对任何单 case）：
 * - 英文：长度 >= 4 或包含数字（如 AVChatRoom / trtc123）
 * - 中文：连续 3 字以上片段（避免 2-gram 过宽）
 */
function extractStrongTopicAnchors(text) {
    const anchors = new Set();
    for (const match of text.matchAll(/\b[a-z][a-z0-9_]{3,}\b/gi)) {
        const token = match[0].toLowerCase();
        if (TOPIC_GENERIC_GUARD_WORDS.has(token))
            continue;
        anchors.add(token);
    }
    for (const segment of text.match(/[\u4e00-\u9fff]{3,}/g) ?? []) {
        if (TOPIC_GENERIC_GUARD_WORDS.has(segment))
            continue;
        anchors.add(segment);
    }
    return [...anchors];
}
function extractPrimaryHeading(content) {
    const heading = content.split('\n').find((line) => /^#\s+/.test(line.trim()));
    return heading ? heading.replace(/^#\s+/, '').trim() : '';
}
function buildBestPracticeTopicText(chunk) {
    if (!chunk)
        return '';
    return normalizeTopicText([
        chunk.title,
        ...(chunk.key_phrases ?? []),
        extractPrimaryHeading(chunk.content),
    ].filter(Boolean).join(' '));
}
const DIAGNOSIS_INTENT_RE = /丢消息|消息丢失|message\s*loss|消息可靠性|message\s*reliability|超时|timeout|失败|fail(?:ed|ure)?|排查|诊断|troubleshoot(?:ing)?/i;
const DIAGNOSIS_DOC_RE = /diagnosis|troubleshoot|排查|诊断|丢失|message\s*loss|reliability|可靠性|timeout|fail(?:ed|ure)?/i;
const TUTORIAL_DOC_RE = /audio[\s-]*message|voice[\s-]*message|语音消息|录音|recorder|create[a-z]+message|sendmessage|standard\s*(approach|usage)|标准用法|如何发送|how\s*to\s*send/i;
function isDiagnosisIntent(prompt) {
    return DIAGNOSIS_INTENT_RE.test(prompt);
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
    return adjusted ? next.sort((a, b) => b.score - a.score) : ranked;
}
/**
 * A3: 同 prompt 下 best-practice 优先（仅在分数接近时触发，避免召回退化）
 * 触发条件：
 * - 当前 Top1 不是 best-practice
 * - 存在 best-practice 候选
 * - 该候选分数与 Top1 差距不超过 18%
 */
function prioritizeBestPracticeWhenCompetitive(ranked, chunksById, prompt) {
    if (ranked.length < 2)
        return ranked;
    const top = ranked[0];
    const topChunk = chunksById.get(top.id);
    if (!topChunk || isBestPracticeSource(topChunk.source) || top.score <= 0) {
        return ranked;
    }
    // 收集所有 best-practice 候选，取分数最高者，避免"首个 best-practice 不一定最相关"的偏置。
    let bestPracticeIdx = -1;
    let bestPracticeScore = -Infinity;
    for (let i = 1; i < ranked.length; i += 1) {
        const chunk = chunksById.get(ranked[i].id);
        if (!chunk)
            continue;
        if (!isBestPracticeSource(chunk.source))
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
    // 常规场景：仅在分数接近时提升（避免召回退化）
    const normalCompetitive = gapRatio <= 0.35;
    // URL 映射/FAQ 抢首位场景：只要 best-practice 达到基础相关阈值，也应优先返回可执行内容
    // 这样可避免"只有 URL 映射行或 FAQ 简答，没有本地内容"的体验退化。
    // chat/urls 的 URL 行：需额外校验 BP 和 URL 行是否同一话题，
    // 避免"问地理位置消息，URL 行是地理位置，但 BP 是语音消息"的跨话题 shadow。
    const topIsUrlMapping = Boolean(isUrlMappingSource(topChunk.source));
    const topIsChatUrlRow = topIsUrlMapping && topChunk.source.includes('knowledge/chat/urls/');
    const topIsFaq = topChunk.source.includes('/faq/');
    // chat/urls 话题一致性：收紧为“高精度 + 多信号”
    // 1) prompt 中数字/错误码（高区分信号）
    // 2) prompt 切词与 BP 主题 token 命中
    // 3) URL 行标题切词与 BP 主题 token 命中（跨语言兜底）
    // 4) 通用强锚点（长 token / CJK>=3）需与 BP 主题有交集（若 prompt 存在强锚点）
    let chatUrlRowTopicMatch = true;
    let chatUrlTopicSignalCount = 0;
    if (topIsChatUrlRow) {
        const bpChunk = chunksById.get(candidate.id);
        const bpTopicText = buildBestPracticeTopicText(bpChunk);
        const promptDigits = prompt.match(/\b\d{2,}\b/g) ?? [];
        const digitMatch = promptDigits.some((d) => bpTopicText.includes(d));
        const promptTokens = extractTopicTokens(prompt);
        const promptTokenHitCount = countTopicTokenHits(promptTokens, bpTopicText);
        const promptTokenMatch = promptTokenHitCount >= 1;
        const urlTopicRaw = (topChunk.title ?? '').replace(/[（(].*$/, '').trim();
        const urlTopicTokens = extractTopicTokens(urlTopicRaw);
        const urlTitleHitCount = countTopicTokenHits(urlTopicTokens, bpTopicText);
        const urlTitleMatch = urlTitleHitCount >= 1;
        const strongAnchors = extractStrongTopicAnchors(prompt);
        const strongAnchorHitCount = countTopicTokenHits(strongAnchors, bpTopicText);
        const strongAnchorMatch = strongAnchors.length === 0 || strongAnchorHitCount >= 1;
        chatUrlTopicSignalCount = Number(digitMatch) + Number(promptTokenMatch) + Number(urlTitleMatch);
        const hasHighPrecisionSignal = digitMatch || urlTitleMatch;
        chatUrlRowTopicMatch = hasHighPrecisionSignal
            && chatUrlTopicSignalCount >= 2
            && strongAnchorMatch;
    }
    const bestPracticeStrongEnough = candidate.score >= Math.max(12, top.score * 0.05);
    const urlRatioThreshold = topIsChatUrlRow ? 0.045 : 0.05;
    const urlAbsoluteThreshold = topIsChatUrlRow ? 20 : 16;
    const urlStrongEnough = candidate.score >= Math.max(urlAbsoluteThreshold, top.score * urlRatioThreshold);
    const urlMappingShadowing = topIsUrlMapping
        && urlStrongEnough
        && chatUrlRowTopicMatch;
    const faqShadowing = topIsFaq && bestPracticeStrongEnough;
    // Feature/API 文档抢首位场景：top1 是功能文档（非 integration、非 BP），
    // BP 的精准实践应优先于功能文档的泛匹配。
    // 条件更严格：BP 分数需达到 top 的 40%（避免完全不相关的 BP 被误提）。
    const topIsFeatureDoc = !topIsUrlMapping && !topIsFaq
        && !isBestPracticeSource(topChunk.source)
        && !isIntegrationSource(topChunk.source);
    const featureDocShadowing = topIsFeatureDoc && candidate.score >= top.score * 0.4;
    if (!normalCompetitive && !urlMappingShadowing && !faqShadowing && !featureDocShadowing)
        return ranked;
    const next = [...ranked];
    next[bestPracticeIdx] = { ...candidate, score: top.score + 2 };
    return next.sort((a, b) => b.score - a.score);
}
/**
 * P0-R1/P0-R2：best-practice 单 chunk 直通。
 * 在高置信且无强竞争时，直接锁定 preferredSource + fullDocumentMode。
 * 当 promote 已发生（faqShadowing 触发后 best-practice 排到首位），
 * 即使分数未达 80 也信任 promote 结果执行收敛。
 */
function pickDominantBestPracticeSource(ranked, chunksById) {
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
        if (isUrlMappingSource(chunk.source))
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
    const isPromotedResult = top.score >= 20 && ranked.length >= 2 && (top.score - ranked[1].score) >= 0.05;
    const scoreStrongEnough = top.score >= 80 || isPromotedResult;
    const dominanceStrongEnough = secondCrossScore === 0 || (top.score / secondCrossScore) >= 1.2 || isPromotedResult;
    const crossSourceNotCompeting = strongCrossSourceCount === 0 || isPromotedResult;
    const withinLengthBudget = sourceTotalChars <= 7000;
    if (scoreStrongEnough && dominanceStrongEnough && crossSourceNotCompeting && withinLengthBudget) {
        return {
            preferredSource: source,
            fullDocumentMode: true,
        };
    }
    return { fullDocumentMode: false };
}
function isIntegrationSource(source) {
    return /\/integration\.md$/i.test(source)
        || /\/preset\/.+integration/i.test(source);
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
function resolveContentPriority(ranked, chunksById) {
    if (ranked.length < 2)
        return null;
    // 找 BP 最高分（在 top-30 范围内）
    let bpTopScore = -1;
    for (let i = 0; i < Math.min(ranked.length, 30); i++) {
        const chunk = chunksById.get(ranked[i].id);
        if (!chunk || !isBestPracticeSource(chunk.source))
            continue;
        if (ranked[i].score > bpTopScore) {
            bpTopScore = ranked[i].score;
        }
    }
    // 按 source 聚合 integration 的 section 命中（在全部 ranked 范围内，但有 minScore 门槛）
    const minScore = bpTopScore > 0 ? Math.max(bpTopScore * 0.3, 5) : 5;
    const intSourceStats = new Map();
    for (const item of ranked) {
        const chunk = chunksById.get(item.id);
        if (!chunk || !isIntegrationSource(chunk.source))
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
    // 无 BP 候选 → 选 integration（如果有足够 section 命中）
    if (bpTopScore < 0) {
        return bestHitCount >= 2
            ? { preferredSource: bestIntSource, fullDocumentMode: true }
            : null;
    }
    // BP 分数远高于 integration → 不走 integration 路径
    if (bpTopScore > bestIntTopScore * 1.2)
        return null;
    // 覆盖度判定
    const BREADTH_THRESHOLD = 3;
    if (bestHitCount >= BREADTH_THRESHOLD && bestIntTopScore >= bpTopScore * 0.6) {
        return { preferredSource: bestIntSource, fullDocumentMode: true };
    }
    return null;
}
export function runSearchPass(params) {
    const { allChunks, passNorm, retrievalMode, queryApiTokens, opts, } = params;
    const effectivePassNorm = retrievalMode === 'discovery'
        ? { ...passNorm, types: undefined }
        : passNorm;
    let pool = filterPool(allChunks, effectivePassNorm);
    // types 误传自愈：首轮保留，二次扩检也同样保留该能力
    if (pool.length === 0 && effectivePassNorm.types?.length) {
        pool = filterPool(allChunks, { ...effectivePassNorm, types: undefined });
    }
    const { boosts, exactHits, urlRowHitChunkIds } = runExactLookup(effectivePassNorm.prompt, pool, effectivePassNorm);
    // A2 补充正向路由：UserSig 问法下允许 share 命中且优先于无关 urls 噪声
    if (/usersig|sdkappid|secretkey|鉴权|签名|gentestusersig/i.test(passNorm.prompt)) {
        for (const chunk of pool) {
            if (chunk.product === '*' && chunk.source.includes('knowledge/share/userSig.md')) {
                boosts[chunk.id] = (boosts[chunk.id] ?? 0) + 220;
            }
        }
    }
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
    const rankedWithMultipliers = applyRankMultipliers(ranked, chunksById, {
        product: passNorm.product,
        framework: passNorm.framework,
        frameworks: passNorm.frameworks,
    });
    const rankedAfterIntentGuard = applyDiagnosisIntentGuard(rankedWithMultipliers, chunksById, passNorm.prompt);
    // 覆盖度竞争先于 A3 执行
    const integrationPriority = resolveContentPriority(rankedAfterIntentGuard, chunksById);
    let dominantBestPractice;
    let rankedAfterBestPractice;
    if (integrationPriority) {
        // integration 胜出 → 跳过 A3，直接走完整文档路径
        rankedAfterBestPractice = rankedAfterIntentGuard;
        dominantBestPractice = integrationPriority;
    }
    else {
        // integration 未胜出 → A3 提升 BP → BP 收敛判定
        rankedAfterBestPractice = prioritizeBestPracticeWhenCompetitive(rankedAfterIntentGuard, chunksById, passNorm.prompt);
        dominantBestPractice = pickDominantBestPracticeSource(rankedAfterBestPractice, chunksById);
    }
    const pinnedUrlRowChunkIds = new Set(urlRowHitChunkIds);
    const fragments = postProcess(rankedAfterBestPractice, chunksById, passNorm.limit, {
        pinnedUrlRowChunkIds,
        preferredSource: dominantBestPractice.preferredSource,
        fullDocumentMode: dominantBestPractice.fullDocumentMode,
    });
    const urlMappingSources = [...new Set(fragments.map((f) => f.source).filter((source) => isUrlMappingSource(source)))];
    const references = buildReferences(fragments);
    const apiNameCoverage = computeApiNameCoverage(queryApiTokens, poolWithContent);
    const missingApiTokens = computeMissingApiTokens(queryApiTokens, poolWithContent);
    return {
        pool,
        poolWithContent,
        rankedWithMultipliers: rankedAfterBestPractice,
        fragments,
        exactHits,
        urlMappingSources,
        references,
        apiNameCoverage,
        missingApiTokens,
        urlMapRelaxed: pinnedUrlRowChunkIds.size > 0,
        urlMapExactHitCount: pinnedUrlRowChunkIds.size,
        preferredSource: dominantBestPractice.preferredSource,
        fullDocumentMode: dominantBestPractice.fullDocumentMode,
    };
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { filterPool, normalizeParams } from './filter-pool.js';
import { requiresFramework } from './requires-framework.js';
import { classifyRetrievalMode } from './intent-router.js';
import { rankSubsetWithIndex } from '../bm25.js';
import { getProductsBM25Index } from '../bm25-cache.js';
import { hasExplicitFrameworkMatch } from './framework-fallback.js';
import { assessConfidence, assessNarrativeCompleteness, buildNarrativeDocument, hasNativeClientFramework, hasNativeTrtcApiSignal, hasProductScopeIntent, inferQueryApiTokens, pickNarrativeSource, } from './search-core.js';
import { scoreUrlRow } from './url-row-scorer.js';
import { buildAnswerContract, buildAgentMessage } from './search-message.js';
import { runSearchPass } from './search-pass.js';
import { buildReferences } from '../doc-url-resolver.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cachedManifest = null;
function resolveResourcePath(...segments) {
    return path.resolve(__dirname, '../../resource', ...segments);
}
function loadManifest() {
    if (cachedManifest)
        return cachedManifest;
    const manifestPath = resolveResourcePath('index', 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error('manifest.json not found. Run `npm run build` first.');
    }
    cachedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return cachedManifest;
}
function buildCoverageReport(allChunks, fragments, preferredSource) {
    if (!fragments.length) {
        return {
            files: [],
            allow_pending_confirm: true,
            retry_suggested: false,
        };
    }
    const hitChunkIds = new Set(fragments.map((f) => f.chunk_id));
    const sources = [...new Set(fragments.map((f) => f.source))];
    const files = sources.map((source) => {
        const sourceChunks = allChunks.filter((chunk) => chunk.source === source);
        const fileToken = sourceChunks.reduce((sum, chunk) => sum + Math.max(0, chunk.char_end - chunk.char_start), 0);
        const hitToken = sourceChunks
            .filter((chunk) => hitChunkIds.has(chunk.id))
            .reduce((sum, chunk) => sum + Math.max(0, chunk.char_end - chunk.char_start), 0);
        const completeness = fileToken > 0 ? Number((hitToken / fileToken).toFixed(2)) : 0;
        const missingChunkIds = sourceChunks.filter((chunk) => !hitChunkIds.has(chunk.id)).map((chunk) => chunk.id).slice(0, 12);
        return {
            source,
            hit_token: hitToken,
            file_token: fileToken,
            completeness,
            missing_chunk_ids: missingChunkIds,
        };
    });
    const primarySource = preferredSource ?? fragments[0]?.source;
    const primaryCompleteness = primarySource
        ? files.find((file) => file.source === primarySource)?.completeness ?? 0
        : 0;
    return {
        files,
        allow_pending_confirm: primaryCompleteness < 0.9,
        primary_source: primarySource,
        primary_completeness: primaryCompleteness,
        retry_suggested: primaryCompleteness < 0.6,
    };
}
/**
 * 提取 title 的主题特征 token 集合（跨语言统一）。
 * - CJK 路径: 字符 2-gram 滑动（与 V2 版本 bit-identical，zh 端 0 退化）。
 * - EN 路径: 原子 token + word 2-gram。
 *   - 原子 token: 单词 [a-z0-9]+ 或带连字符的复合词 [a-z0-9]+(?:-[a-z0-9]+)+
 *     关键: `one-to-one` 整体作为一个 token，不拆成 ['one', 'to', 'one']（域语义：C2C 类别标签，
 *     跟 CJK「单聊」等价；拆开会产生 'one one' 这种无意义 2-gram 噪声）。
 *   - word 2-gram: 原子 token 之间的 2-gram 滑动（不跨复合词内部），跟 CJK 2-gram 同构。
 *   - stopword 过滤: the/and/for/with/from/how/use/api/sdk/app/set/get/add/to/of/in/on/by 等功能词。
 *
 * 产品无关: 纯字面特征，不依赖 IDF / 分词词表。
 */
function extractTitleTokens(text) {
    const out = new Set();
    // CJK 路径: 字符 2-gram（与原 extractTitleBigrams bit-identical）
    for (const seg of text.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        for (let i = 0; i < seg.length - 1; i += 1) {
            out.add(seg.slice(i, i + 2));
        }
    }
    // EN 路径: 原子 token（含连字符复合词整体保留）+ 原子间的 2-gram
    // 正则说明: [a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)* — 匹配单词或带连字符的复合词，
    // 一次匹配即可拿到完整 token，不会在复合词内部产生 2-gram。
    const EN_STOPS = new Set([
        'the', 'and', 'for', 'with', 'from', 'how', 'what', 'why', 'when', 'where',
        'use', 'api', 'sdk', 'app', 'set', 'get', 'add', 'to', 'of', 'in', 'on', 'by',
    ]);
    const atomic = (text.toLowerCase().match(/[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*/g) ?? [])
        .filter((w) => w.length >= 3 && !EN_STOPS.has(w));
    for (const w of atomic)
        out.add(w);
    for (let i = 0; i < atomic.length - 1; i += 1) {
        out.add(`${atomic[i]} ${atomic[i + 1]}`);
    }
    return out;
}
/**
 * 单主题截断：基于 scoreUrlRow + 字面 token Jaccard 判定 query 是否有「精确单主题」命中。
 *
 * 设计（V3 跨语言对称版，V2 基础上扩展 EN 路径）：
 * - scoreUrlRow 是「URL row 跟 query 的纯净相关度」（不被 E7 boost 稀释），
 *   500+ 代表覆盖率 + 有效信号占比都达标的语义对齐强信号。
 * - **但 scoreUrlRow 数值相近（615-700）时无法区分「同主题相关 row」和「泛命中 row」**。
 *   例：query「单聊消息发送前回调」+ types=['webhook']：
 *     - top1=单聊消息发送之前回调 (scoreUrlRow=700) ← 真正答案
 *     - top2=单聊消息发送之后回调 (scoreUrlRow=672) ← 时态近义，保留
 *     - top3-6=单聊消息撤回/扩展/编辑/已读 (scoreUrlRow=615) ← 不同动作，应砍
 *     - top7-8=群消息发送之前/之后 (scoreUrlRow=643/615) ← 动作相同时态差异，保留"前"砍"后"
 *   同样例 EN 端: query "One-to-one message send before webhook" 返回 5 个 webhook 切片
 *   （before/after C2C、before/after group、group exception），其中 group 类 3 个应砍。
 * - 解决: 加 **token Jaccard** 作为「是否跟 top1 同主题」的二次过滤——
 *   只保留跟 top1 字面 Jaccard ≥ 0.5 的 row（共享核心动作词/时态词）。
 *   - CJK: 2-gram 字符滑动（与 V2 bit-identical，zh 端 0 退化）
 *   - EN:  原子 token（含连字符复合词 one-to-one 整体保留）+ 原子间 word 2-gram，
 *          跟 CJK 2-gram 同构
 * - 多主题（保留 ≥ 2 个 row）/ 弱信号（top1 < 500）/ 不足 2 个候选 → 保持原 limit。
 *
 * 关键不变量:
 * - 不动 top1（避免误判导致用户拿不到正确答案）
 * - 不减少「真的有第二个相关 row」的场景（如「群消息发送前/之后」同主题）
 * - 截断发生在 narrative 模式之外（narrative 模式本身按 full document 走，不受影响）
 */
const SINGLE_TOPIC_URL_SCORE_THRESHOLD = 500;
const SINGLE_TOPIC_JACCARD_THRESHOLD = 0.5;
function applySingleTopicTrim(fragments, prompt, limit) {
    if (fragments.length < 2)
        return fragments;
    // top1 必须有强 scoreUrlRow 信号（避免弱信号 top1 误判导致砍掉正确答案）
    const top1UrlScore = scoreUrlRow(prompt, fragments[0].title).score;
    if (top1UrlScore < SINGLE_TOPIC_URL_SCORE_THRESHOLD)
        return fragments;
    // 用 top1 标题的 token 集合作为「主题特征」，过滤出字面同主题的 row。
    // CJK 标题走 2-gram 字符路径（与 V2 等价，zh 端 0 退化），
    // EN 标题走原子 token + word 2-gram 路径（与 CJK 2-gram 同构，en 端获得对等的单主题判定）。
    const top1Tokens = extractTitleTokens(fragments[0].title);
    if (top1Tokens.size < 2)
        return fragments; // 标题太短或纯 stopword，不做主题判定
    const related = fragments.filter((f) => {
        const fTokens = extractTitleTokens(f.title);
        if (fTokens.size === 0)
            return false;
        const intersection = [...fTokens].filter((t) => top1Tokens.has(t)).length;
        const union = new Set([...fTokens, ...top1Tokens]).size;
        return intersection / union >= SINGLE_TOPIC_JACCARD_THRESHOLD;
    });
    // 过滤后只剩 1 个 → 单主题精确返回 [top1]
    if (related.length === 1)
        return [related[0]];
    // 多个同主题 row（topN）→ 保留全部（受 limit 约束）
    return related.slice(0, limit);
}
/** 轻量覆盖度：仅算主文件完整度，用于非收敛场景的 allow_pending_confirm 判定，不产出逐文件明细 */
function computePrimaryCompleteness(allChunks, fragments, preferredSource) {
    if (!fragments.length)
        return { primary_completeness: 0 };
    const primarySource = preferredSource ?? fragments[0]?.source;
    if (!primarySource)
        return { primary_completeness: 0 };
    const hitChunkIds = new Set(fragments.map((f) => f.chunk_id));
    const sourceChunks = allChunks.filter((chunk) => chunk.source === primarySource);
    const fileToken = sourceChunks.reduce((sum, chunk) => sum + Math.max(0, chunk.char_end - chunk.char_start), 0);
    const hitToken = sourceChunks
        .filter((chunk) => hitChunkIds.has(chunk.id))
        .reduce((sum, chunk) => sum + Math.max(0, chunk.char_end - chunk.char_start), 0);
    return {
        primary_source: primarySource,
        primary_completeness: fileToken > 0 ? Number((hitToken / fileToken).toFixed(2)) : 0,
    };
}
export function searchKnowledge(params) {
    const norm = normalizeParams(params);
    const retrievalMode = classifyRetrievalMode(norm.prompt);
    if (requiresFramework(norm)) {
        loadManifest();
        return {
            status: 'needs_framework',
            confidence: 'none',
            message: buildAgentMessage('needs_framework', retrievalMode, [], 'none', undefined),
            query: params,
            retrieval_mode: retrievalMode,
            documents: [],
            catalog: [],
            meta: {
                answer_contract: buildAnswerContract('needs_framework', 'none', retrievalMode, { fabricationRisk: false }),
            },
            fragments: [],
        };
    }
    const manifest = loadManifest();
    const allChunks = manifest.chunks;
    const queryApiTokens = inferQueryApiTokens(norm.prompt);
    let pass = runSearchPass({
        allChunks,
        passNorm: norm,
        retrievalMode,
        queryApiTokens,
    });
    // best-practice 懒补充：仅在主 pass 无本地片段（仅 URL 映射行或完全为空）时触发。
    // 典型场景：Agent 传 types=['sdk']，filterPool 把 best-practice（type=faq）硬过滤掉，
    // 只剩 URL 映射行（有 E7 boost 但内容只是一个 URL 链接）。
    // 不侵入 runSearchPass 层，避免每次调用都执行重复检索。
    // 修复 B1 副作用：之前 `types: undefined` 会同时把 chat/preset/{flutter,android,...}/integration.md
    // （types=['integration']）也放进 pool，integration 文档多 section 命中 generic 词会把 URL row 顶掉。
    // 改为 `types: ['faq']` 后：
    //   - best-practice（types=['faq']）走 filterPool 的 bp-bypass 保留
    //   - chat/preset/.../integration.md（types=['integration']）被硬过滤
    //   - URL row（types 与原请求一致）继续保留
    // 合并策略：append BP fragments 到原 pass（不去重 URL row），保留 URL row 在 top。
    const passRetryReasons = [];
    const hasLocalContent = pass.fragments.some((f) => !f.source.includes('/urls/'));
    // 当主 pass 命中一个明确的 URL row（scoreUrlRow ≥ 300 强信号）时，**跳过 B1 补充**，
    // 避免 BP 兜底把无关 BP 文档（message-unread-count、avchatroom-message-loss-diagnosis 等）塞满 fragments。
    // 典型反例：query「im 内网代理」types=['product']，pass 命中「内网代理实现方案」(scoreUrlRow=460)，
    // 旧 B1 会触发 → 拉 8 个无关 BP → fragments 膨胀到 9 个。
    // 进一步保护：当 top1 finalScore < 20（零命中场景，如「im 怎么发火箭」finalScore=16.8），
    // 也不触发 B1——无意义 query 不该被 BP 兜底撑满。
    const top1UrlScore = !hasLocalContent && pass.fragments[0]?.title
        ? scoreUrlRow(norm.prompt, pass.fragments[0].title).score
        : 0;
    const top1FinalScore = pass.fragments[0]?.score ?? 0;
    if (!hasLocalContent && top1UrlScore < 300 && top1FinalScore >= 20 && norm.product?.length && !norm.types?.includes('faq')) {
        const primaryProduct = norm.product[0];
        const bpCandidates = allChunks.filter((chunk) => {
            if (!/\/best-practice\//i.test(chunk.source))
                return false;
            if (chunk.product !== primaryProduct && chunk.product !== '*')
                return false;
            if (norm.frameworks?.length) {
                const explicitMatch = hasExplicitFrameworkMatch(chunk.framework, norm.frameworks);
                const wildcardAllowed = chunk.framework.includes('*');
                if (!explicitMatch && !wildcardAllowed)
                    return false;
            }
            return true;
        });
        if (bpCandidates.length > 0) {
            const bpIndex = getProductsBM25Index(allChunks, [norm.product[0]]);
            const bpRanked = rankSubsetWithIndex(norm.prompt, bpCandidates.map((c) => c.id), bpIndex, {});
            if ((bpRanked[0]?.score ?? 0) >= 6) {
                const bpPass = runSearchPass({
                    allChunks,
                    passNorm: { ...norm, types: ['faq'] },
                    retrievalMode,
                    queryApiTokens,
                });
                if (bpPass.fragments.length > 0) {
                    // 合并：保留原 URL row 在前，追加 BP fragments 去重
                    const existingIds = new Set(pass.fragments.map((f) => f.chunk_id));
                    const newBpFragments = bpPass.fragments.filter((f) => !existingIds.has(f.chunk_id));
                    if (newBpFragments.length > 0) {
                        // 重新编号 rank：原 URL row 保持 1..N，BP 从 N+1 开始
                        const merged = [
                            ...pass.fragments,
                            ...newBpFragments.map((f, i) => ({ ...f, rank: pass.fragments.length + i + 1 })),
                        ];
                        pass = {
                            ...pass,
                            fragments: merged,
                        };
                        passRetryReasons.push('best_practice_supplement');
                    }
                }
            }
        }
    }
    const retryReasons = [...passRetryReasons];
    // B2: API token 覆盖不足时触发一次扩检（去掉 types 约束 + api/integration 轻提权）
    const missingRatio = queryApiTokens.length > 0
        ? Number((pass.missingApiTokens.length / queryApiTokens.length).toFixed(2))
        : 0;
    if (queryApiTokens.length > 0 && (pass.apiNameCoverage === 0 || missingRatio >= 0.3)) {
        const retryPass = runSearchPass({
            allChunks,
            passNorm: { ...norm, types: undefined },
            retrievalMode,
            queryApiTokens,
            opts: { apiRetry: true },
        });
        const retryMissingRatio = queryApiTokens.length > 0
            ? Number((retryPass.missingApiTokens.length / queryApiTokens.length).toFixed(2))
            : 0;
        if (retryPass.apiNameCoverage > pass.apiNameCoverage
            || retryMissingRatio < missingRatio
            || (pass.fragments.length === 0 && retryPass.fragments.length > 0)) {
            pass = retryPass;
            retryReasons.push(`api_gap_retry:coverage=${pass.apiNameCoverage},missing_ratio=${retryMissingRatio}`);
        }
    }
    // B3: 混合“集成 + 产品开通/计费/控制台”问法时，补充 product type，避免仅搜 integration/feature。
    if (norm.types?.length && !norm.types.includes('product') && hasProductScopeIntent(norm.prompt)) {
        const widenedTypes = [...new Set([...norm.types, 'product'])];
        const retryPass = runSearchPass({
            allChunks,
            passNorm: { ...norm, types: widenedTypes },
            retrievalMode,
            queryApiTokens,
        });
        const baseHasProduct = pass.fragments.some((f) => f.types.includes('product'));
        const retryHasProduct = retryPass.fragments.some((f) => f.types.includes('product'));
        if ((retryHasProduct && !baseHasProduct)
            || (pass.fragments.length === 0 && retryPass.fragments.length > 0)
            || (retryPass.fragments[0]?.score ?? 0) > (pass.fragments[0]?.score ?? 0) * 1.08) {
            pass = retryPass;
            retryReasons.push('product_scope_retry:types+=product');
        }
    }
    // B4: 若疑似 Native TRTC API 问法却路由到 live/room/call，自动补扩 native_trtc_sdk 产品重检。
    const shouldRetryNativeProduct = hasNativeClientFramework(norm.frameworks)
        && hasNativeTrtcApiSignal(norm.prompt, queryApiTokens)
        && norm.product?.some((p) => ['live', 'room', 'call'].includes(p))
        && !norm.product?.includes('native_trtc_sdk')
        && queryApiTokens.length > 0
        && pass.apiNameCoverage < 0.5;
    if (shouldRetryNativeProduct) {
        const expandedProducts = [...new Set([...(norm.product ?? []), 'native_trtc_sdk'])];
        const retryPass = runSearchPass({
            allChunks,
            passNorm: { ...norm, product: expandedProducts, types: undefined },
            retrievalMode,
            queryApiTokens,
            opts: { apiRetry: true },
        });
        const retryMissingRatio = queryApiTokens.length > 0
            ? Number((retryPass.missingApiTokens.length / queryApiTokens.length).toFixed(2))
            : 0;
        if (retryPass.apiNameCoverage > pass.apiNameCoverage
            || retryPass.exactHits.length > pass.exactHits.length
            || retryMissingRatio < missingRatio
            || (pass.fragments.length === 0 && retryPass.fragments.length > 0)) {
            pass = retryPass;
            retryReasons.push(`native_product_retry:products=${expandedProducts.join('+')},coverage=${retryPass.apiNameCoverage}`);
        }
    }
    const resolveNarrativeState = (passSnapshot) => {
        const source = retrievalMode === 'narrative'
            ? pickNarrativeSource(passSnapshot.exactHits, passSnapshot.rankedWithMultipliers, passSnapshot.poolWithContent)
            : null;
        const document = source ? buildNarrativeDocument(source, allChunks) : null;
        const quality = assessNarrativeCompleteness(document, norm.prompt);
        return { source, document, quality };
    };
    let narrativeState = resolveNarrativeState(pass);
    // P0: narrative 自动扩检（一次）——当“完整流程”候选文档缺失或完整度不足时，放宽 types 并提高 limit。
    const shouldRetryNarrative = retrievalMode === 'narrative'
        && (narrativeState.document === null || !narrativeState.quality.isComplete);
    if (shouldRetryNarrative) {
        const narrativeRetryNorm = {
            ...norm,
            types: undefined,
            limit: Math.max(norm.limit ?? 8, 12),
        };
        const retryPass = runSearchPass({
            allChunks,
            passNorm: narrativeRetryNorm,
            retrievalMode,
            queryApiTokens,
            opts: { apiRetry: true },
        });
        const retryNarrativeState = resolveNarrativeState(retryPass);
        if (retryNarrativeState.quality.score > narrativeState.quality.score
            || (narrativeState.document === null && retryNarrativeState.document !== null)
            || (retryPass.exactHits.length > pass.exactHits.length && retryNarrativeState.document !== null)) {
            pass = retryPass;
            narrativeState = retryNarrativeState;
            retryReasons.push(`narrative_retry:score=${retryNarrativeState.quality.score}`);
        }
    }
    // 覆盖度深检（全量 files 明细 + 自动扩检）仅在收敛到单一 best-practice 时启用，
    // 避免对普通点查场景做无差别二次检索与全量 coverage_report 外发。
    const shouldDeepCoverageCheck = Boolean(pass.preferredSource || pass.fullDocumentMode) && pass.fragments.length > 0;
    let coverageReport;
    if (shouldDeepCoverageCheck) {
        coverageReport = buildCoverageReport(allChunks, pass.fragments, pass.preferredSource);
        if (coverageReport.retry_suggested) {
            const coverageRetryPass = runSearchPass({
                allChunks,
                passNorm: { ...norm, types: undefined, limit: Math.max(norm.limit ?? 8, 12) },
                retrievalMode,
                queryApiTokens,
                opts: { apiRetry: true },
            });
            const retriedCoverageReport = buildCoverageReport(allChunks, coverageRetryPass.fragments, coverageRetryPass.preferredSource);
            const currentCoverage = coverageReport.primary_completeness ?? 0;
            const retriedCoverage = retriedCoverageReport.primary_completeness ?? 0;
            if (retriedCoverage > currentCoverage || coverageRetryPass.fragments.length > pass.fragments.length) {
                pass = coverageRetryPass;
                coverageReport = retriedCoverageReport;
                retryReasons.push(`coverage_check_retry:primary=${retriedCoverage}`);
            }
        }
        // 单 chunk 文档 completeness 恒为 1，不代表问题被完整覆盖；
        // 仅在 fullDocumentMode 聚合多 chunk（>1）且覆盖度足够时才禁止“待确认”。
        const primaryChunkCount = coverageReport.primary_source
            ? allChunks.filter((chunk) => chunk.source === coverageReport.primary_source).length
            : 0;
        coverageReport = {
            ...coverageReport,
            allow_pending_confirm: !(pass.fullDocumentMode
                && primaryChunkCount > 1
                && (coverageReport.primary_completeness ?? 0) >= 0.9),
        };
    }
    else {
        const primary = computePrimaryCompleteness(allChunks, pass.fragments, pass.preferredSource);
        coverageReport = {
            allow_pending_confirm: true,
            ...(primary.primary_source ? { primary_source: primary.primary_source } : {}),
            primary_completeness: primary.primary_completeness,
            retry_suggested: false,
        };
    }
    narrativeState = resolveNarrativeState(pass);
    // P0 单主题截断：基于 scoreUrlRow（URL row 跟 query 的纯净相关度，不被 E7 boost 污染）
    // + 2-gram 字面 Jaccard 判定 query 是否有「精确单主题」命中。
    // 详见 applySingleTopicTrim 函数注释。
    let passFragments = applySingleTopicTrim(pass.fragments, norm.prompt, norm.limit ?? 8);
    // P1 低置信裁剪：0 命中 query（top1 finalScore < 20）的 fragments 是 BM25 凑出来的
    // 无关内容（如「im 怎么发火箭」top1=audio-message-send finalScore=16.8），
    // 直接裁剪到 1 个 top fragment，避免 BP 凑数撑爆。
    // 适用：first pass 已经拉了 BP 文档但 top1 仍很弱的情况。
    if (passFragments.length > 1 && (passFragments[0]?.score ?? 0) < 20) {
        passFragments = [passFragments[0]];
    }
    if (passFragments !== pass.fragments) {
        // 同步重建 references：V3 applySingleTopicTrim 砍 fragment 时不砍 references 会导致
        // fragments/references 数量错位（实测：5→3 fragment 砍后 references 仍 5 个，LLM 困惑）。
        // 用 trim 后的 fragments 重建 references，保持一致。
        pass = { ...pass, fragments: passFragments, references: buildReferences(passFragments) };
    }
    const { confidence, status } = assessConfidence(pass.fragments, pass.exactHits, pass.apiNameCoverage, queryApiTokens);
    const fabricationRisk = (queryApiTokens.length > 0 && pass.apiNameCoverage < 0.3)
        || (confidence === 'low' && pass.fragments.length < 2);
    // narrative 模式返回完整文档；point/discovery 通过 fragments 提供内容（已含正文）。
    const documents = retrievalMode === 'narrative'
        ? (narrativeState.document ? [narrativeState.document] : [])
        : [];
    let finalStatus = status;
    let finalConfidence = confidence;
    if (retrievalMode === 'narrative' && documents.length > 0) {
        if (narrativeState.quality.isComplete) {
            finalStatus = 'success';
            finalConfidence = 'high';
        }
        else {
            finalStatus = 'low_confidence';
            finalConfidence = 'low';
        }
    }
    if (retrievalMode === 'discovery' && pass.fragments.length > 0) {
        finalStatus = 'success';
        finalConfidence = finalConfidence === 'none' ? 'medium' : finalConfidence;
    }
    const aggregatedFragments = pass.fragments
        .filter((fragment) => fragment.aggregated || fragment.citation?.includes('[aggregated]'))
        .map((fragment) => ({
        chunk_id: fragment.chunk_id,
        source: fragment.source,
        citation: fragment.citation ?? `[Source: ${fragment.chunk_id}][aggregated]`,
    }));
    const fullDocumentRequired = retrievalMode === 'narrative'
        && /完整的?\s*(接入|集成|教程|指南|流程)|完整\s*md|全文|原文|不要总结|含\s*(示例)?代码|全部步骤|完整步骤/i.test(norm.prompt);
    const answerContract = buildAnswerContract(finalStatus, finalConfidence, retrievalMode, {
        fabricationRisk,
        fullDocumentRequired,
        hasAggregatedFragments: aggregatedFragments.length > 0,
    });
    const hasProductScope = hasProductScopeIntent(norm.prompt);
    const hasNativeSignal = hasNativeTrtcApiSignal(norm.prompt, queryApiTokens);
    const hasProductContent = pass.fragments.some((f) => f.types.includes('product') || /\/product\.md$/i.test(f.source) || /\/best-practice\//i.test(f.source));
    const hasIntegrationContent = pass.fragments.some((f) => f.types.includes('integration') || /\/integration\.md$/i.test(f.source) || /\/preset\//i.test(f.source));
    const hasApiQueryTokens = queryApiTokens.length > 0;
    const finalMissingRatio = hasApiQueryTokens
        ? Number((pass.missingApiTokens.length / queryApiTokens.length).toFixed(2))
        : 0;
    const apiGapDetected = hasApiQueryTokens && (pass.apiNameCoverage === 0 || finalMissingRatio >= 0.3);
    const retryApiGapApplied = retryReasons.some((r) => r.startsWith('api_gap_retry:'));
    const retryProductScopeApplied = retryReasons.includes('product_scope_retry:types+=product');
    const retryNativeProductApplied = retryReasons.some((r) => r.startsWith('native_product_retry:'));
    const narrativeConverged = retrievalMode !== 'narrative'
        || (documents.length > 0 && narrativeState.quality.isComplete);
    const convergenceReached = (retrievalMode === 'narrative' && narrativeConverged)
        || (retrievalMode === 'discovery' && pass.fragments.length > 0)
        || (finalStatus === 'success'
            && (finalConfidence === 'high' || finalConfidence === 'medium')
            && (!hasApiQueryTokens || pass.apiNameCoverage >= 0.5)
            && (!hasProductScope || hasProductContent || hasIntegrationContent));
    const retryAdvice = (() => {
        if (finalStatus === 'needs_framework') {
            return { stop_retry: true, next_action: 'ask_framework', reason: 'missing_framework' };
        }
        if (retrievalMode === 'narrative' && !narrativeConverged) {
            return { stop_retry: false, next_action: 'retry_or_clarify', reason: 'narrative_incomplete' };
        }
        if (convergenceReached) {
            return { stop_retry: true, next_action: 'answer', reason: 'converged' };
        }
        if (hasApiQueryTokens && apiGapDetected && !retryApiGapApplied) {
            return { stop_retry: false, next_action: 'retry_widen_types', reason: 'api_coverage_gap' };
        }
        if (hasProductScope && !hasProductContent && !retryProductScopeApplied) {
            return { stop_retry: false, next_action: 'retry_add_product_scope', reason: 'missing_product_scope_content' };
        }
        if (hasNativeSignal && hasNativeClientFramework(norm.frameworks) && !retryNativeProductApplied) {
            return { stop_retry: false, next_action: 'retry_add_native_trtc_sdk', reason: 'possible_native_product_misroute' };
        }
        if (finalStatus === 'empty' || finalConfidence === 'low') {
            return { stop_retry: false, next_action: 'retry_or_clarify', reason: 'insufficient_retrieval_signal' };
        }
        return { stop_retry: true, next_action: 'answer', reason: 'default_stop' };
    })();
    return {
        status: finalStatus,
        confidence: finalConfidence,
        message: buildAgentMessage(finalStatus, retrievalMode, pass.fragments, finalConfidence, pass.references, {
            fabricationRisk,
            hasDocuments: documents.length > 0,
            fullDocumentRequired,
            preferDocuments: pass.fullDocumentMode,
            hasAggregatedFragments: aggregatedFragments.length > 0,
        }),
        // query 保留：l1-enrich 依赖 response.query.frameworks 做限领域回填（内部消费）
        query: params,
        retrieval_mode: retrievalMode,
        documents,
        meta: {
            // 参考文档（AI 输出「参考文档」小节依据）：
            ...(pass.references.length ? { references: pass.references } : {}),
            answer_contract: answerContract,
            // 防幻觉信号（search-message 依赖）：
            fabrication_risk: fabricationRisk,
            // 内部重试决策（供上游判断是否需重搜）：
            retry_advice: retryAdvice,
            // narrative 模式的完整度报告（仅 narrative 模式返回，用于验收/判断完整指南是否完整）
            ...(retrievalMode === 'narrative'
                ? {
                    narrative_completeness: {
                        is_complete: narrativeState.quality.isComplete,
                        score: narrativeState.quality.score,
                        section_count: narrativeState.quality.sectionCount,
                        total_chars: narrativeState.quality.totalChars,
                        reason: narrativeState.quality.reason,
                    },
                }
                : {}),
        },
        fragments: pass.fragments,
    };
}
export { normalizeParams, filterPool };

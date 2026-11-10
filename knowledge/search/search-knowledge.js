import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { filterPool, normalizeParams } from './filter-pool.js';
import { requiresFramework } from './requires-framework.js';
import { classifyRetrievalMode } from './intent-router.js';
import { rankSubsetWithIndex } from '../bm25.js';
import { getProductsBM25Index } from '../bm25-cache.js';
import { hasExplicitFrameworkMatch } from './framework-fallback.js';
import { assessConfidence, assessNarrativeCompleteness, buildDiscoveryCatalog, buildNarrativeDocument, hasNativeClientFramework, hasNativeTrtcApiSignal, hasProductScopeIntent, inferQueryApiTokens, pickNarrativeSource, } from './search-core.js';
import { buildAnswerContract, buildAgentMessage } from './search-message.js';
import { runSearchPass } from './search-pass.js';
import { buildReferences } from '../doc-url-resolver.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cachedManifest = null;
let cachedManifestMtimeMs = 0;
function resolveResourcePath(...segments) {
    return path.resolve(__dirname, '../../resource', ...segments);
}
function loadManifest() {
    const manifestPath = resolveResourcePath('index', 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error('manifest.json not found. Run `npm run build` first.');
    }
    // 进程内缓存 + mtime 校验：常驻服务在资源重建（npm run build / 同步）后，
    // 若不感知 manifest 更新，内存里的旧 manifest 会继续引用已删除/改名的文件，
    // 运行时读源文件 ENOENT。这里按 mtime 失效缓存，manifest 变化即重新加载。
    const mtimeMs = fs.statSync(manifestPath).mtimeMs;
    if (cachedManifest && mtimeMs === cachedManifestMtimeMs)
        return cachedManifest;
    cachedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    cachedManifestMtimeMs = mtimeMs;
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
export async function searchKnowledge(params) {
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
    let pass = await runSearchPass({
        allChunks,
        passNorm: norm,
        retrievalMode,
        queryApiTokens,
    });
    // best-practice 懒补充（收敛版）：仅在主 pass 完全无结果时触发。
    //
    // 设计意图：
    // - BP 从“主通道召回增强”退到“兜底校准器”
    // - 对“仅 URL 行”的场景不再补 BP，避免策略叠加导致的 BP 过召回
    // - 保留 hard-fail 场景的可恢复性（空结果时补一次 faq）
    const passRetryReasons = [];
    const noFragments = pass.fragments.length === 0;
    if (noFragments && norm.product?.length && !norm.types?.includes('faq')) {
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
                const bpPass = await runSearchPass({
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
        const retryPass = await runSearchPass({
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
        const retryPass = await runSearchPass({
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
    // B4: 若疑似 Native TRTC API 问法却路由到 live/room/call，自动补扩 trtc 产品重检。
    // 补扩 trtc 时 frameworks 限定为原生集合（android/ios/c++），避免命中 trtc/web 文档。
    const shouldRetryNativeProduct = hasNativeClientFramework(norm.frameworks)
        && hasNativeTrtcApiSignal(norm.prompt, queryApiTokens)
        && norm.product?.some((p) => ['live', 'room', 'call'].includes(p))
        && !norm.product?.includes('trtc')
        && queryApiTokens.length > 0
        && pass.apiNameCoverage < 0.5;
    if (shouldRetryNativeProduct) {
        const expandedProducts = [...new Set([...(norm.product ?? []), 'trtc'])];
        const nativeFrameworks = (norm.frameworks ?? []).filter((fw) => ['android', 'ios', 'c++'].includes(fw));
        const retryPass = await runSearchPass({
            allChunks,
            passNorm: { ...norm, product: expandedProducts, frameworks: nativeFrameworks, types: undefined },
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
            ? pickNarrativeSource(norm.prompt, passSnapshot.rankedWithMultipliers, passSnapshot.poolWithContent)
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
        const retryPass = await runSearchPass({
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
            const coverageRetryPass = await runSearchPass({
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
    let passFragments = pass.fragments;
    // P1 低置信裁剪：0 命中 query（top1 finalScore < 20）的 fragments 是 BM25 凑出来的
    // 无关内容（如「im 怎么发火箭」top1=audio-message-send finalScore=16.8），
    // 直接裁剪到 1 个 top fragment，避免 BP 凑数撑爆。
    // 适用：first pass 已经拉了 BP 文档但 top1 仍很弱的情况。
    if (passFragments.length > 1 && (passFragments[0]?.score ?? 0) < 20) {
        passFragments = [passFragments[0]];
    }
    if (passFragments !== pass.fragments) {
        // 同步重建 references：P1 裁剪 fragment 后重建 references，保持 fragments/references 数量一致。
        pass = { ...pass, fragments: passFragments, references: buildReferences(passFragments) };
    }
    const { confidence, status } = assessConfidence(pass.fragments, pass.exactHits, pass.apiNameCoverage, queryApiTokens);
    const fabricationRisk = (queryApiTokens.length > 0 && pass.apiNameCoverage < 0.3)
        || (confidence === 'low' && pass.fragments.length < 2);
    // narrative 模式返回完整文档；point/discovery 通过 fragments 提供内容（已含正文）。
    const documents = retrievalMode === 'narrative'
        ? (narrativeState.document ? [narrativeState.document] : [])
        : [];
    const catalog = retrievalMode === 'discovery'
        ? buildDiscoveryCatalog(pass.rankedWithMultipliers, pass.poolWithContent, Math.max(norm.limit ?? 8, 6))
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
    if (retrievalMode === 'discovery' && catalog.length > 0) {
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
        || (retrievalMode === 'discovery' && catalog.length > 0)
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
            return { stop_retry: false, next_action: 'retry_add_trtc', reason: 'possible_native_product_misroute' };
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
        catalog,
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
            vector_retrieval: pass.vectorDiagnostics,
        },
        fragments: pass.fragments,
    };
}
export { normalizeParams, filterPool };

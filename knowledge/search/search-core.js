import { getSourceFileContent } from '../content-loader.js';
import { resolveFragmentDocUrls } from '../doc-url-resolver.js';
import { hasExplicitFrameworkMatch, hasFrameworkFallbackMatch } from './framework-fallback.js';
import { isProductScopePrompt } from './product-scope-intent.js';
const CODE_HINT_PREFIX = '[Code sample - must match target platform]';
const CITATION_PREFIX = '[Source:';
export function postProcess(ranked, chunksById, limit, opts) {
    const buildFragment = (chunk, score, rank, aggregated = false) => {
        const contentWithHint = chunk.contains_code
            ? `${CODE_HINT_PREFIX}\n${chunk.content}`
            : chunk.content;
        return {
            rank,
            score,
            title: chunk.title,
            content: contentWithHint,
            source: chunk.source,
            doc_urls: resolveFragmentDocUrls(chunk.source, chunk.content, getSourceFileContent(chunk.source)),
            product: chunk.product,
            framework: chunk.framework,
            types: chunk.types,
            variant: chunk.variant,
            scope: chunk.scope,
            doc_kind: chunk.doc_kind,
            capability_status: chunk.capability_status,
            api_names: chunk.api_names,
            contains_code: chunk.contains_code,
            citation: `${CITATION_PREFIX} ${chunk.id}]${aggregated ? '[aggregated]' : ''}`,
            ...(aggregated ? { aggregated: true } : {}),
            chunk_id: chunk.id,
        };
    };
    if (opts?.fullDocumentMode && opts.preferredSource) {
        const scoreMap = new Map(ranked.map((item) => [item.id, item.score]));
        const sections = [...chunksById.values()]
            .filter((chunk) => chunk.source === opts.preferredSource)
            .sort((a, b) => a.char_start - b.char_start);
        if (sections.length > 0) {
            return sections.map((section, idx) => buildFragment(section, scoreMap.get(section.id) ?? 0, idx + 1));
        }
    }
    const sourceCount = {};
    const urlMappingSourceCount = {};
    /** 已入选的 push config/android/{vendor} 文件，用于抑制其他厂商噪声 */
    let selectedVendorFile = null;
    const fragments = [];
    for (const item of ranked) {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            continue;
        if (opts?.preferredSource && chunk.source !== opts.preferredSource)
            continue;
        const isUrlMapping = Boolean(isUrlMappingSource(chunk.source));
        const isPinnedUrlRow = isUrlMapping && (opts?.pinnedUrlRowChunkIds?.has(chunk.id) ?? false);
        if (isUrlMapping) {
            const urlCount = urlMappingSourceCount[chunk.source] ?? 0;
            if (!isPinnedUrlRow && urlCount >= 1)
                continue;
            urlMappingSourceCount[chunk.source] = urlCount + 1;
        }
        else {
            const count = sourceCount[chunk.source] ?? 0;
            if (count >= 3)
                continue;
            sourceCount[chunk.source] = count + 1;
        }
        // 当用户明确问某厂商时，抑制同目录下其他厂商文档的噪声
        // 规则：如果已有 config/android/{vendor}.md 入选，
        // 后续其他 config/android/{other}.md 跳过
        const isVendorDoc = chunk.source.match(/^knowledge\/push\/config\/android\/[a-z]+\.md$/);
        if (isVendorDoc) {
            if (!selectedVendorFile) {
                selectedVendorFile = chunk.source;
            }
            else if (chunk.source !== selectedVendorFile) {
                continue; // 跳过其他厂商
            }
        }
        // 当已明确命中了厂商配置页后，后续的 push 通用文件（integration/、其他 config/）不再有意义
        // 只保留同厂商文件（已由 vendor dedup 处理）和 overview 综述，其他 push 通用文档视为噪声
        if (selectedVendorFile && chunk.source.startsWith('knowledge/push/') && !chunk.source.includes('/overview/')) {
            if (chunk.source !== selectedVendorFile)
                continue;
        }
        const firstPush = fragments.length === 0;
        if (firstPush) {
            // 首条不设分数截止，至少保证 1 条返回
        }
        else if (!isPinnedUrlRow) {
            const topScore = fragments[0].score;
            // 方案A：分数断崖截断。
            // 当已有 E7 精确命中行（pinned url-row）时，后续非 pinned 行若跌破 Top1 的 20%，
            // 视为「Top1 已精确命中、后续多为泛匹配噪声」，提前截断，避免凑满 limit 返回冗余。
            // 无 E7 命中时不触发（此时答案依赖 best-practice/本地文档，需完整保留）。
            if (topScore > 0) {
                const pinnedChunkIds = opts?.pinnedUrlRowChunkIds;
                const hasPinnedRow = pinnedChunkIds
                    ? fragments.some((f) => pinnedChunkIds.has(f.chunk_id))
                    : false;
                // 原有：分数衰减到 top 的 5% 以下时停止
                if (item.score < topScore * 0.05)
                    break;
                // 新增：已有 E7 精确命中 + 后续跌破 35% → 断崖截断
                // 阈值取 35%（非 20%）：best-practice 泛匹配分数常在 Top1 的 20%~35% 区间，
                // 用 35% 才能拦住「Top1 精确命中后仍返回一堆无关 best-practice」的冗余。
                if (hasPinnedRow && item.score < topScore * 0.35)
                    break;
            }
        }
        const aggregated = Boolean(chunk.aggregable) && fragments.length > 0 && fragments[0].source === chunk.source;
        fragments.push(buildFragment(chunk, item.score, fragments.length + 1, aggregated));
        if (fragments.length >= limit)
            break;
    }
    return fragments;
}
/** 产品无关的 URL 映射行判定：knowledge/<product>/urls/.../xxx.md */
export function isUrlMappingSource(source) {
    return /knowledge\/[a-z0-9_-]+\/urls\/.+\.md$/i.test(source.replace(/\\/g, '/'));
}
/** 产品无关地提取 URL 映射行的「子文件 kind」（如 sdk/web、error-code）；非映射行返回 null */
export function extractUrlMappingKind(source) {
    const normalized = source.replace(/\\/g, '/');
    const match = normalized.match(/knowledge\/[a-z0-9_-]+\/urls\/(.+\.md)$/);
    if (!match)
        return null;
    return match[1].replace(/\.md$/, '').replace(/\/index$/, '');
}
export function partitionFragments(fragments) {
    const urlMapping = [];
    const localDoc = [];
    for (const fragment of fragments) {
        if (isUrlMappingSource(fragment.source)) {
            urlMapping.push(fragment);
        }
        else {
            localDoc.push(fragment);
        }
    }
    const urlMappingKinds = [...new Set(urlMapping.map((f) => extractUrlMappingKind(f.source)).filter(Boolean))];
    return { urlMapping, localDoc, urlMappingKinds };
}
export function isNarrativeSource(source) {
    const normalized = source.replace(/\\/g, '/');
    return /\/preset\/.+(?:integration\.md|-integration\.md)$/i.test(normalized)
        || /\/integration\.md$/i.test(normalized)
        || /\/guide\.md$/i.test(normalized)
        || /\/getting-started\.md$/i.test(normalized);
}
export function sourceTitle(source) {
    const base = source.split('/').pop()?.replace(/\.md$/i, '') ?? source;
    return base || source;
}
export function pickNarrativeSource(_exactHits, ranked, poolWithContent) {
    const bySource = new Map();
    const chunksById = new Map(poolWithContent.map((chunk) => [chunk.id, chunk]));
    const upsertSource = (source, score, weight) => {
        const prev = bySource.get(source);
        if (!prev) {
            bySource.set(source, {
                hitCount: 1,
                bestScore: score,
                weightedScore: score * weight,
            });
            return;
        }
        bySource.set(source, {
            hitCount: prev.hitCount + 1,
            bestScore: Math.max(prev.bestScore, score),
            weightedScore: prev.weightedScore + score * weight,
        });
    };
    const topScore = ranked[0]?.score ?? 0;
    for (let idx = 0; idx < ranked.length; idx += 1) {
        const item = ranked[idx];
        const chunk = chunksById.get(item.id);
        if (!chunk || !isNarrativeSource(chunk.source))
            continue;
        if (topScore > 0 && idx > 120 && item.score < topScore * 0.03)
            break;
        const weight = idx < 20 ? 1 : idx < 80 ? 0.7 : 0.5;
        upsertSource(chunk.source, item.score, weight);
    }
    const candidates = [...bySource.entries()].sort((a, b) => {
        if (b[1].weightedScore !== a[1].weightedScore)
            return b[1].weightedScore - a[1].weightedScore;
        if (b[1].hitCount !== a[1].hitCount)
            return b[1].hitCount - a[1].hitCount;
        return b[1].bestScore - a[1].bestScore;
    });
    return candidates[0]?.[0] ?? null;
}
export function assessNarrativeCompleteness(document, prompt) {
    if (!document) {
        return {
            isComplete: false,
            score: 0,
            sectionCount: 0,
            totalChars: 0,
            reason: 'no_document',
        };
    }
    const isStepByStepIntent = /从零|完整|全流程|一步一步|step\s*by\s*step|full\s+(guide|tutorial|flow|integration)|complete\s+(guide|tutorial|integration)|getting\s*started|quick\s*start/i.test(prompt);
    const minSections = isStepByStepIntent ? 4 : 3;
    const minChars = isStepByStepIntent ? 1200 : 700;
    const sectionCount = document.section_count;
    const totalChars = document.sections.reduce((acc, section) => acc + section.content.length, 0);
    const hasStepLikeSection = document.sections.some((section) => /步骤|step|准备|安装|初始化|接入|集成|创建|运行|验证|上线|部署/i.test(section.title)
        || /步骤|step|初始化|接入|集成|运行|验证|上线|部署/i.test(section.content.slice(0, 120)));
    const issues = [];
    if (sectionCount < minSections)
        issues.push('section_count_low');
    if (totalChars < minChars)
        issues.push('content_too_short');
    if (isStepByStepIntent && !hasStepLikeSection)
        issues.push('missing_step_sections');
    const score = Number((Math.min(sectionCount / minSections, 1) * 0.45
        + Math.min(totalChars / minChars, 1) * 0.45
        + ((isStepByStepIntent ? hasStepLikeSection : true) ? 0.1 : 0)).toFixed(2));
    return {
        isComplete: issues.length === 0,
        score,
        sectionCount,
        totalChars,
        reason: issues.length ? issues.join(',') : 'ok',
    };
}
export function buildNarrativeDocument(source, allChunks) {
    const chunks = allChunks
        .filter((chunk) => chunk.source === source)
        .sort((a, b) => a.char_start - b.char_start);
    if (!chunks.length)
        return null;
    const full = getSourceFileContent(source);
    const sections = chunks
        .map((chunk, idx) => {
        const content = full.slice(chunk.char_start, chunk.char_end).trim();
        return {
            rank: idx + 1,
            title: chunk.title,
            content,
            char_start: chunk.char_start,
            char_end: chunk.char_end,
            contains_code: chunk.contains_code,
            api_names: chunk.api_names,
            chunk_id: chunk.id,
        };
    })
        .filter((section) => section.content.length > 0);
    if (!sections.length)
        return null;
    const first = chunks[0];
    return {
        source,
        title: first.title === 'full' ? sourceTitle(source) : first.title,
        doc_urls: resolveFragmentDocUrls(source, sections[0].content, full),
        product: first.product,
        framework: first.framework,
        types: first.types,
        section_count: sections.length,
        sections,
    };
}
export function buildDiscoveryCatalog(ranked, poolWithContent, limit) {
    const chunksById = new Map(poolWithContent.map((chunk) => [chunk.id, chunk]));
    const seenSource = new Set();
    const catalog = [];
    for (const item of ranked) {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            continue;
        if (isUrlMappingSource(chunk.source))
            continue;
        if (seenSource.has(chunk.source))
            continue;
        seenSource.add(chunk.source);
        catalog.push({
            rank: catalog.length + 1,
            source: chunk.source,
            title: chunk.title === 'full' ? sourceTitle(chunk.source) : chunk.title,
            doc_urls: resolveFragmentDocUrls(chunk.source, chunk.content, getSourceFileContent(chunk.source)),
            product: chunk.product,
            framework: chunk.framework,
            types: chunk.types,
            score: Number(item.score.toFixed(2)),
        });
        if (catalog.length >= limit)
            break;
    }
    return catalog;
}
export function hasBestPracticeFragment(fragments) {
    return fragments.some((f) => /\/best-practice\//i.test(f.source));
}
export function inferQueryApiTokens(prompt) {
    const tokens = new Set();
    // 仅保留 API 形态 token，剔除产品/平台品牌词，避免把“TRTC Conference Web ...”误判为 API 缺口。
    const upperNoise = new Set([
        'SDK', 'API', 'HTTP', 'HTTPS', 'JSON', 'CALL', 'NAME', 'STATUS',
        'TRTC', 'TENCENT', 'WEB', 'VUE', 'REACT', 'ROOMKIT', 'LIVEKIT', 'CALLKIT',
    ]);
    const platformNoise = new Set([
        'ios', 'android', 'flutter', 'web', 'react', 'vue', 'miniprogram',
        'harmonyos', 'react-native', 'unity', 'unreal', 'unreal-engine', 'donut', 'uni-app',
        'pc', 'h5',
    ]);
    for (const match of prompt.matchAll(/\b([a-z]+[A-Z][A-Za-z0-9_]*)\b/g)) {
        tokens.add(match[1]);
    }
    for (const match of prompt.matchAll(/\b([A-Z][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*)\b/g)) {
        tokens.add(match[1]);
    }
    for (const match of prompt.matchAll(/\b(use[A-Z]\w*)\b/g)) {
        tokens.add(match[1]);
    }
    for (const match of prompt.matchAll(/\b(I[A-Z][A-Za-z0-9_]*)\b/g)) {
        tokens.add(match[1]);
    }
    for (const match of prompt.matchAll(/\b([A-Z][A-Za-z0-9_]*\.[A-Z_][A-Z0-9_]*)\b/g)) {
        tokens.add(match[1]);
    }
    for (const match of prompt.matchAll(/\b([A-Z_]{3,})\b/g)) {
        const token = match[1];
        if (!upperNoise.has(token))
            tokens.add(token);
    }
    return [...tokens].filter((token) => !platformNoise.has(token.toLowerCase()));
}
export function tokenInChunk(token, chunk) {
    if (chunk.api_names?.some((name) => name.toLowerCase() === token.toLowerCase()))
        return true;
    if (chunk.symbols?.some((name) => name.toLowerCase() === token.toLowerCase()))
        return true;
    const low = token.toLowerCase();
    return chunk.title.toLowerCase().includes(low) || chunk.source.toLowerCase().includes(low);
}
export function computeApiNameCoverage(tokens, candidates) {
    if (!tokens.length)
        return 1;
    const hit = tokens.filter((token) => candidates.some((chunk) => tokenInChunk(token, chunk))).length;
    return Number((hit / tokens.length).toFixed(2));
}
export function computeMissingApiTokens(tokens, candidates) {
    if (!tokens.length)
        return [];
    return tokens.filter((token) => !candidates.some((chunk) => tokenInChunk(token, chunk)));
}
export function hasProductScopeIntent(prompt) {
    return isProductScopePrompt(prompt);
}
export function hasNativeTrtcApiSignal(prompt, queryApiTokens) {
    if (/\bTRTCCloud\b|\bTRTCRenderParams\b|\bTXDeviceManager\b|setLocalRenderParams|startLocalPreview|stopLocalPreview/i.test(prompt)) {
        return true;
    }
    return queryApiTokens.some((token) => /^(TRTC|TX)[A-Za-z0-9_]+$/.test(token)
        || /^(set|get|start|stop|enable|disable)[A-Z][A-Za-z0-9_]+$/.test(token));
}
export function hasNativeClientFramework(frameworks) {
    if (!frameworks?.length)
        return false;
    return frameworks.some((fw) => ['android', 'ios', 'flutter', 'c++'].includes(fw));
}
export function applyRankMultipliers(ranked, chunksById, opts) {
    const adjusted = ranked.map((item) => {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            return item;
        let multiplier = 1;
        // A2: 传了 product 时，命中 scope 的通配语料允许召回但降权
        if (opts.product?.length && chunk.product === '*') {
            multiplier *= 0.2;
        }
        // F2: framework 软降权（保留硬过滤，处理 fallback/边界残留）
        if (opts.framework && opts.frameworks?.length && !chunk.framework.includes('*')) {
            const explicitMatch = hasExplicitFrameworkMatch(chunk.framework, opts.frameworks);
            const fallbackMatch = hasFrameworkFallbackMatch(chunk, opts);
            if (!explicitMatch && !fallbackMatch) {
                multiplier *= 0.2;
            }
        }
        return { ...item, score: item.score * multiplier };
    });
    return adjusted.sort((a, b) => b.score - a.score);
}
/**
 * 多因子置信度评估：exact 命中 + 分数梯度 + API 覆盖度。
 */
export function assessConfidence(fragments, exactHits, apiNameCoverage, queryApiTokens) {
    if (fragments.length === 0) {
        return { confidence: 'none', status: 'empty' };
    }
    const top = fragments[0].score;
    const second = fragments[1]?.score ?? 0;
    const ratio = second > 0 ? top / second : Infinity;
    let confidence;
    if (exactHits.length > 0 || top >= 50)
        confidence = 'high';
    else if (top >= 12 && ratio >= 1.25)
        confidence = 'medium';
    else if (top >= 6 && ratio >= 1.12)
        confidence = 'medium';
    else
        confidence = 'low';
    // D2: API 覆盖过低时，confidence 上限降为 low
    if (queryApiTokens.length > 0 && apiNameCoverage < 0.3) {
        confidence = 'low';
    }
    const status = confidence === 'low' ? 'low_confidence' : 'success';
    return { confidence, status };
}

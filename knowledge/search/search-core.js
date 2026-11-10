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
            const fullDocumentMaxChars = Math.max(1000, opts.fullDocumentMaxChars ?? 7000);
            const selectedSections = [];
            let usedChars = 0;
            for (const section of sections) {
                const sectionChars = section.content.length;
                if (selectedSections.length > 0 && usedChars + sectionChars > fullDocumentMaxChars)
                    break;
                selectedSections.push(section);
                usedChars += sectionChars;
            }
            return selectedSections.map((section, idx) => buildFragment(section, scoreMap.get(section.id) ?? 0, idx + 1));
        }
    }
    const sourceCount = {};
    const maxPerSource = Math.max(1, opts?.maxPerSource ?? 3);
    /** 已入选的 push config/android/{vendor} 文件，用于抑制其他厂商噪声 */
    let selectedVendorFile = null;
    const fragments = [];
    for (const item of ranked) {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            continue;
        if (opts?.preferredSource && chunk.source !== opts.preferredSource)
            continue;
        const count = sourceCount[chunk.source] ?? 0;
        if (count >= maxPerSource)
            continue;
        sourceCount[chunk.source] = count + 1;
        // 当用户明确问某厂商时，抑制同目录下其他厂商文档的噪声
        // 规则：如果已有「厂商配置/Android/{vendor}.md」入选，
        // 后续其他「厂商配置/Android/{other}.md」跳过
        const isVendorDoc = chunk.source.match(/^knowledge\/push\/快速接入\/厂商配置\/Android\/[^/]+\.md$/);
        if (isVendorDoc) {
            if (!selectedVendorFile) {
                selectedVendorFile = chunk.source;
            }
            else if (chunk.source !== selectedVendorFile) {
                continue; // 跳过其他厂商
            }
        }
        // 当已明确命中了厂商配置页后，后续的 push 通用文件不再有意义
        // 只保留同厂商文件（已由 vendor dedup 处理）和接入前准备综述，其他 push 通用文档视为噪声
        if (selectedVendorFile && chunk.product === 'push' && !chunk.source.includes('/接入前准备')) {
            if (chunk.source !== selectedVendorFile)
                continue;
        }
        const firstPush = fragments.length === 0;
        if (firstPush) {
            // 首条不设分数截止，至少保证 1 条返回
        }
        else {
            const topScore = fragments[0].score;
            // 分数衰减到 top 的 5% 以下时停止
            if (topScore > 0 && item.score < topScore * 0.05)
                break;
        }
        const aggregated = Boolean(chunk.aggregable) && fragments.length > 0 && fragments[0].source === chunk.source;
        fragments.push(buildFragment(chunk, item.score, fragments.length + 1, aggregated));
        if (fragments.length >= limit)
            break;
    }
    return fragments;
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
function detectH5Intent(prompt) {
    return /(\bh5\b|移动端网页|手机网页|mobile\s*web|web\s*mobile)/i.test(prompt);
}
function hasNativeIntent(prompt) {
    return /(android|ios|flutter|react\s*native|react-native|uni-?app|harmonyos|鸿蒙|原生|小程序|miniprogram)/i.test(prompt);
}
export function pickNarrativeSource(prompt, ranked, poolWithContent) {
    const bySource = new Map();
    const chunksById = new Map(poolWithContent.map((chunk) => [chunk.id, chunk]));
    const h5BoostEnabled = detectH5Intent(prompt) && !hasNativeIntent(prompt);
    const upsertSource = (source, score, weight, platform) => {
        const prev = bySource.get(source);
        if (!prev) {
            bySource.set(source, {
                hitCount: 1,
                bestScore: score,
                weightedScore: score * weight,
                platform,
            });
            return;
        }
        bySource.set(source, {
            hitCount: prev.hitCount + 1,
            bestScore: Math.max(prev.bestScore, score),
            weightedScore: prev.weightedScore + score * weight,
            platform: prev.platform ?? platform,
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
        let weight = idx < 20 ? 1 : idx < 80 ? 0.7 : 0.5;
        if (h5BoostEnabled && chunk.platform === 'mobile') {
            weight *= 1.3;
        }
        upsertSource(chunk.source, item.score, weight, chunk.platform);
    }
    const candidates = [...bySource.entries()].sort((a, b) => {
        if (b[1].weightedScore !== a[1].weightedScore)
            return b[1].weightedScore - a[1].weightedScore;
        if (h5BoostEnabled && a[1].platform !== b[1].platform) {
            if (a[1].platform === 'mobile')
                return 1;
            if (b[1].platform === 'mobile')
                return -1;
        }
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
        // 产品/组件品牌名（PascalCase 形式会误入 API token，如 CallKit/RoomKit/LiveKit）。
        // upperNoise 只覆盖全大写缩写，这里补 PascalCase 的小写形态，避免 E16 把产品名当 API 提权。
        'callkit', 'roomkit', 'livekit', 'tencent', 'trtc',
    ]);
    for (const match of prompt.matchAll(/\b([a-z]+[A-Z][A-Za-z0-9_]*)\b/g)) {
        tokens.add(match[1]);
    }
    // PascalCase（大写开头的驼峰，如 StartAIConversation / TRTCCloud / V2TIMManager / TUICallKit）：
    // 上面的 camelCase 正则只覆盖小写开头，这类大写开头的标识符（含内部大写缩写）会漏掉，
    // 导致 E16 精确标识符硬提权对它们不生效。此正则要求至少一个内部大小写边界（[A-Z][a-z] 或 [a-z][A-Z]），
    // 天然排除「全大写缩写」（SDK/TRTC）与「普通首字母大写单词」（How/The）。
    for (const match of prompt.matchAll(/\b([A-Z][A-Za-z0-9_]*(?:[A-Z][a-z]|[a-z][A-Z])[A-Za-z0-9_]*)\b/g)) {
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
function normalizeCompactText(input) {
    return input.toLowerCase().replace(/[\s\-_]+/g, '');
}
function hasExactTitleMatch(prompt, title) {
    if (!prompt || !title)
        return false;
    const p = normalizeCompactText(prompt);
    const t = normalizeCompactText(title);
    if (!p || !t)
        return false;
    return (t.length >= 3 && p.includes(t)) || (p.length >= 3 && t.includes(p));
}
function tokenizePromptForTitle(prompt) {
    return [...new Set(prompt
            .toLowerCase()
            .split(/[^a-z0-9\u4e00-\u9fff]+/)
            .map((s) => s.trim())
            .filter((s) => s.length >= 2))];
}
export function applyRankMultipliers(ranked, chunksById, opts) {
    const prompt = opts.prompt ?? '';
    const promptTokens = tokenizePromptForTitle(prompt);
    const isIotProfile = opts.rank_profile === 'iot';
    const adjusted = ranked.map((item) => {
        const chunk = chunksById.get(item.id);
        if (!chunk)
            return item;
        let multiplier = 1;
        // A2: 传了 product 时，命中 scope 的通配语料允许召回但降权
        if (opts.product?.length && chunk.product === '*') {
            multiplier *= 0.2;
        }
        // F2: framework 软降权（改造 1：framework 已不做硬过滤，此处是唯一约束点）
        // 0.2 与原硬过滤语义对齐：不匹配的排到匹配项之后，但保留在候选池里可被强信号拉回。
        if (opts.frameworks?.length && !chunk.framework.includes('*')) {
            const explicitMatch = hasExplicitFrameworkMatch(chunk.framework, opts.frameworks);
            const fallbackMatch = hasFrameworkFallbackMatch(chunk, opts);
            if (!explicitMatch && !fallbackMatch) {
                multiplier *= 0.2;
            }
        }
        // F3: types 软降权（改造 1）：原 isSoftAllowed 的 types 硬过滤改为降权。
        // best-practice 免疫（内容不依赖 types 分类），与原软过滤的例外保持一致。
        if (opts.types?.length && !chunk.types.some((t) => opts.types.includes(t))) {
            if (!chunk.source.includes('/best-practice/'))
                multiplier *= 0.35;
        }
        // F4: scenario 软降权（改造 1）：原本是硬过滤，场景不符降权而非删除。
        if (opts.scenario && chunk.scenario && chunk.scenario !== opts.scenario) {
            multiplier *= 0.5;
        }
        // Phase1: title/h2 与 query 精确短语命中增强
        if (prompt && hasExactTitleMatch(prompt, chunk.title)) {
            multiplier *= isIotProfile ? 1.15 : 1.03;
        }
        if (promptTokens.length > 0) {
            const titleText = `${chunk.title} ${(chunk.key_phrases ?? []).join(' ')}`.toLowerCase();
            const overlap = promptTokens.reduce((acc, token) => (titleText.includes(token) ? acc + 1 : acc), 0);
            if (overlap > 0) {
                multiplier *= 1 + Math.min(0.06, overlap * (isIotProfile ? 0.015 : 0.008));
            }
        }
        // Phase2: IoT feature_domain 软回退（IoT 唯一排序信号）
        if (chunk.product === 'iot') {
            if (chunk.feature_domain && opts.preferred_iot_feature_domain) {
                if (chunk.feature_domain === opts.preferred_iot_feature_domain)
                    multiplier *= 1.15;
                else
                    multiplier *= 0.9;
            }
            // 非 demo 意图下，弱化 app_demo/device_demo 对功能问法的抢位
            if (chunk.feature_domain && /demo$/i.test(chunk.feature_domain)) {
                if (!/\bdemo\b|示例|sample|example|演示/i.test(prompt)) {
                    multiplier *= 0.82;
                }
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

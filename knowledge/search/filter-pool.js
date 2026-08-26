import { downgradeToProductType } from './product-scope-intent.js';
import { normalizeQueryPrompt } from './query-normalizer.js';
import { hasExplicitFrameworkMatch, hasFrameworkFallbackMatch } from './framework-fallback.js';
/**
 * MCP framework enum → index 中对应的 framework 值列表。
 * path-meta.ts 已通过 normalizeFrameworkDir 把目录名归一到标准 framework，
 * 所有产品的 framework 均已对齐枚举值，无需额外别名扩展。
 */
const FRAMEWORK_SEARCH_ALIASES = {};
function expandFrameworks(frameworks, _products) {
    if (!frameworks?.length)
        return undefined;
    const expanded = new Set();
    for (const framework of frameworks) {
        for (const alias of FRAMEWORK_SEARCH_ALIASES[framework] ?? [framework]) {
            expanded.add(alias);
        }
    }
    return [...expanded];
}
/**
 * 类型别名：UIKit「组件(component)」与「feature」是同一批文档的两种叫法
 * （chat preset 双标签，roomkit/live/call 仅打 feature），互相放行避免 types 硬过滤误杀。
 */
const TYPE_ALIASES = {
    component: ['component', 'feature'],
    feature: ['feature', 'component'],
};
const LIVE_LIFECYCLE_PROMPT = /开播|创建直播|结束直播|停播|观看直播|退出直播|进房|离房|createLive|endLive|joinLive|leaveLive|host_streaming|audience_streaming/i;
function expandTypeAliases(types) {
    const expanded = new Set();
    for (const t of types) {
        for (const alias of TYPE_ALIASES[t] ?? [t])
            expanded.add(alias);
    }
    return [...expanded];
}
/**
 * Chat FAQ 现已迁移到 best-practice 语料，types=faq 时应保留 faq 过滤，避免退化到全语料噪声。
 */
function resolveTypes(products, types, prompt, frameworks) {
    if (!types?.length)
        return undefined;
    const downgraded = downgradeToProductType(products, types, prompt, frameworks);
    const expanded = expandTypeAliases(downgraded);
    return expanded;
}
/** 单平台产品的隐式 framework 推断：避免对显然唯一的平台再发起询问 */
function inferImplicitFramework(products, frameworks, prompt) {
    if (frameworks?.length)
        return frameworks[0];
    if (products?.length === 1 && products[0] === 'rtcengine')
        return 'web';
    if (products?.includes('call')) {
        if (/小程序|miniprogram/i.test(prompt))
            return 'miniprogram';
        if (/\breact\b/i.test(prompt))
            return 'react';
        if (/\bvue\b/i.test(prompt))
            return 'vue';
        if (/\b(web|h5|pc)\b|Web&H5/i.test(prompt))
            return 'web';
    }
    return undefined;
}
export function normalizeParams(params) {
    const normalizedPrompt = normalizeQueryPrompt(params.prompt);
    const limit = Math.min(Math.max(params.limit ?? 8, 1), 16);
    const effectiveFramework = inferImplicitFramework(params.product, params.frameworks, normalizedPrompt);
    const requestedFrameworks = params.frameworks?.length
        ? params.frameworks
        : effectiveFramework ? [effectiveFramework] : undefined;
    const frameworks = expandFrameworks(requestedFrameworks, params.product);
    const types = resolveTypes(params.product, params.types, normalizedPrompt, requestedFrameworks);
    return {
        prompt: normalizedPrompt,
        product: params.product,
        framework: effectiveFramework,
        frameworks,
        searchIntent: params.types,
        types,
        scenario: params.scenario,
        limit,
    };
}
/**
 * 跨平台类型集合：framework=['*'] 的 chunk 仅在 type 命中这些时才视为合理。
 * - server_api / webhook / product：天然跨平台
 * - faq / error_code：URL 映射页（chat/urls/error-code.md）与 callkit/faq/ 等按平台分 faq 文件，
 *   都标记为 framework=['*']，按 framework 检索时不应被武断排除
 */
const CROSS_PLATFORM_CHUNK_TYPES = new Set([
    'server_api',
    'webhook',
    'product',
    'faq',
    'error_code',
]);
function chunkIsCrossPlatform(chunkTypes) {
    return chunkTypes.some((t) => CROSS_PLATFORM_CHUNK_TYPES.has(t));
}
function normalizeScopeToken(input) {
    return input.toLowerCase().replace(/[\s_\-]+/g, '');
}
function promptMatchesRetrievableScope(prompt, scope) {
    if (!scope)
        return true;
    if (scope === 'always')
        return true;
    if (!scope.length)
        return true;
    const normalizedPrompt = normalizeScopeToken(prompt);
    return scope.some((token) => normalizedPrompt.includes(normalizeScopeToken(token)));
}
export function filterPool(chunks, norm) {
    return chunks.filter((chunk) => {
        if (norm.product && !norm.product.includes(chunk.product) && chunk.product !== '*') {
            return false;
        }
        // A1: 通配语料(share 等)必须命中 retrievable_scope 才能进入检索池
        if (chunk.product === '*' && !promptMatchesRetrievableScope(norm.prompt, chunk.retrievable_scope)) {
            return false;
        }
        if (norm.frameworks?.length) {
            const isWildcardChunk = chunk.framework.includes('*');
            // 收紧：framework=['*'] 仅在该 chunk 明确是跨平台 type（product/server_api/webhook）时放行；
            // 否则要求 chunk.framework 与请求 framework 有交集。
            const wildcardAllowed = isWildcardChunk && chunkIsCrossPlatform(chunk.types);
            const explicitMatch = hasExplicitFrameworkMatch(chunk.framework, norm.frameworks);
            const fallbackMatch = hasFrameworkFallbackMatch(chunk, {
                product: norm.product,
                framework: norm.framework,
                frameworks: norm.frameworks,
            });
            if (!explicitMatch && !wildcardAllowed && !fallbackMatch)
                return false;
        }
        if (norm.scenario && chunk.scenario && chunk.scenario !== norm.scenario) {
            return false;
        }
        // best-practice 文档对 types 过滤免疫：内容不依赖 types 分类，应始终进 pool 靠 BM25 自然排名。
        // 典型场景：Agent 传 types=['api'] 时，types=['faq'] 的 best-practice 不应被过滤掉。
        if (norm.types?.length && !norm.types.some((t) => chunk.types.includes(t))) {
            if (!chunk.source.includes('/best-practice/'))
                return false;
        }
        return true;
    });
}

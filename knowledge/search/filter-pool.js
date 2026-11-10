import { downgradeToProductType } from './product-scope-intent.js';
import { normalizeQueryPrompt } from './query-normalizer.js';
import { hasExplicitFrameworkMatch, hasFrameworkFallbackMatch } from './framework-fallback.js';
/**
 * MCP framework enum → index 中对应的 framework 值列表。
 * path-meta.ts 已通过 normalizeFrameworkDir 把目录名归一到标准 framework，
 * 所有产品的 framework 均已对齐枚举值，无需额外别名扩展。
 */
const FRAMEWORK_SEARCH_ALIASES = {
    miniprogram: ['miniprogram', 'minprogram'],
    minprogram: ['minprogram', 'miniprogram'],
    'react-native': ['react-native', 'rn'],
    rn: ['rn', 'react-native'],
    // uni-app 双向别名：frontmatter/文档里「uniapp」（无连字符）写法常见（如 uniapp-shrink.md），
    // 查询侧枚举是「uni-app」，两侧须互认，否则 framework 硬过滤互相漏召回。
    'uni-app': ['uni-app', 'uniapp'],
    uniapp: ['uniapp', 'uni-app'],
};
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
        // 空数组等价于「未传」，否则 isHardAllowed 会把整库过滤成 empty
        product: params.product?.length ? params.product : undefined,
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
 * - faq / error_code：按平台分 faq 文件时标记为 framework=['*']，按 framework 检索时不应被武断排除
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
/**
 * 硬过滤层（Hard filter）：语义无关的强约束，任何检索通道都必须遵守。
 *
 * 语义：
 *   - product：产品维度物理隔离（不同产品的语料本就不应互相召回）。
 *
 * 使用者：
 *   - BM25 通道：入池前调用
 *   - 向量通道：召回后二次校验，作为索引层 product 分片的兜底
 */
export function filterPoolHard(chunks, norm) {
    return chunks.filter((chunk) => isHardAllowed(chunk, norm));
}
export function isHardAllowed(chunk, norm) {
    if (norm.product && !norm.product.includes(chunk.product) && chunk.product !== '*') {
        return false;
    }
    return true;
}
/**
 * 软过滤层（Soft filter）：语义相关的偏好约束，向量语义召回不应被此层直接砍掉。
 *
 * 语义：
 *   - framework：平台维度偏好（向量语义可跨平台复用，应转为软降权）
 *   - scenario：场景维度偏好（live/voice）
 *   - types：文档类型偏好（Agent 可能传错，向量语义能自愈到正确类型）
 *
 * 使用者：
 *   - BM25 通道：与 Hard 合用（保持现网行为）
 *   - 向量通道：不使用；由 applyRankMultipliers 在融合后做软降权
 */
export function isSoftAllowed(chunk, norm) {
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
    // IoT 端别过滤改为“召回保留 + 排序分层”：
    // Phase2 中 exact/common/conflict 的优先级由 applyRankMultipliers 处理，
    // 这里不做硬过滤，避免因标注偏差误杀有效候选。
    // best-practice 文档对 types 过滤免疫：内容不依赖 types 分类，应始终进 pool 靠 BM25 自然排名。
    // 典型场景：Agent 传 types=['api'] 时，types=['faq'] 的 best-practice 不应被过滤掉。
    if (norm.types?.length && !norm.types.some((t) => chunk.types.includes(t))) {
        if (!chunk.source.includes('/best-practice/'))
            return false;
    }
    return true;
}
/**
 * 完整过滤：**product 硬隔离保留，framework/types/scenario 转软降权**（改造 1）。
 *
 * 生产数据实测（112 条文档级锚点样本）：
 *   - 仅 product 过滤 hit@3 = 58.0%，无过滤 = 55.4%，agent 全参数 = 50.9%
 *   → product 硬隔离是正收益；framework/types 硬过滤是负收益（把正确答案整个删出候选池）。
 *
 * 因此 framework / types / scenario 不再从候选池删除，改由 applyRankMultipliers 做连续降权：
 * 传错只是排名靠后，永远不会"答案消失"。
 *
 * @deprecated 保留导出名以兼容调用方；语义已等价于 filterPoolHard。
 */
export function filterPool(chunks, norm) {
    return filterPoolHard(chunks, norm);
}
/**
 * 严格过滤（Hard + Soft）：改造 1 之后仅用于「回溯校验」。
 *
 * 用途：软降权放开候选池会引入跨平台/跨类型的噪声文档（实测 6/112 条回退，
 * 其中部分 top3 落到错误产品的文档）。检索层可用本函数判断：
 * 「严格过滤下是否本来就有足够候选」——有则优先用严格池的结果，没有才采用放宽后的结果。
 */
export function filterPoolStrict(chunks, norm) {
    return chunks.filter((chunk) => isHardAllowed(chunk, norm) && isSoftAllowed(chunk, norm));
}

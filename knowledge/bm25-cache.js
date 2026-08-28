import { attachPoolContent } from './content-loader.js';
import { buildBM25Index, chunkSearchText } from './bm25.js';
/**
 * 按 product 维度 lazy 构建 BM25 索引并进程内缓存。
 *
 * 设计要点：
 * - cache key = product（未指定时用 '*'，对全 manifest 建索引）
 * - 索引基于该 product 全部 chunks（含 integration corpus），子集 ranking 只看 filteredPool.map(id)
 * - 首次按 product 触发，后续命中缓存零开销；约 8 个 product 自然分摊冷启动成本
 * - 不落盘，纯进程常驻；体积粗估 8~12MB（postings + idf）
 */
const indexCache = new Map();
const GLOBAL_KEY = '*';
function cacheKey(product) {
    return product ?? GLOBAL_KEY;
}
function selectProductChunks(allChunks, product) {
    if (!product)
        return allChunks;
    return allChunks.filter((chunk) => chunk.product === product || chunk.product === '*');
}
/**
 * 获取 product 级 BM25 索引：缓存命中则零开销，否则按 product 切 chunks，
 * attachPoolContent 拉正文后一次性建索引并入缓存。
 *
 * 性能特征：
 * - 命中：O(1)
 * - miss：O(P · avgDocLen) 仅一次，P 为该 product 的 chunk 数
 */
export function getProductBM25Index(allChunks, product) {
    const key = cacheKey(product);
    const cached = indexCache.get(key);
    if (cached)
        return cached;
    const productChunks = selectProductChunks(allChunks, product);
    const withContent = attachPoolContent(productChunks);
    const index = buildBM25Index(withContent.map((chunk) => ({
        id: chunk.id,
        text: chunkSearchText(chunk),
    })));
    indexCache.set(key, index);
    return index;
}
/**
 * 多 product BM25 索引：products 数组中有任一未缓存时，
 * 合并所有指定 product 的 chunks 构建索引并缓存（key = 排序 join）。
 */
export function getProductsBM25Index(allChunks, products) {
    if (!products || products.length === 0)
        return getProductBM25Index(allChunks, undefined);
    if (products.length === 1)
        return getProductBM25Index(allChunks, products[0]);
    const key = [...products].sort().join('|');
    const cached = indexCache.get(key);
    if (cached)
        return cached;
    const productChunks = allChunks.filter((chunk) => products.includes(chunk.product) || chunk.product === '*');
    const withContent = attachPoolContent(productChunks);
    const index = buildBM25Index(withContent.map((chunk) => ({
        id: chunk.id,
        text: chunkSearchText(chunk),
    })));
    indexCache.set(key, index);
    return index;
}
/** 测试用：清空缓存（生产代码不应调用） */
export function clearBM25Cache() {
    indexCache.clear();
}
/** 调试用：返回当前缓存的 product 列表 */
export function listCachedProducts() {
    return [...indexCache.keys()];
}

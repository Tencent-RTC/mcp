import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * 运行期向量库根目录。
 * 编译后本文件位于 dist/knowledge/embedding/，向量产物在 dist/resource/index/vectors/。
 */
function vectorsRoot() {
    return path.resolve(__dirname, '../../resource/index/vectors');
}
/**
 * 单一全局向量索引目录（不再按 product 物理分片）。
 *
 * 背景：vectra LocalIndex.queryItems 本身就是全量线性扫描 + 堆排序取 topK
 * （非 ANN 索引结构），按 product 物理拆分索引文件不会带来性能收益
 * （全库 4173 条 chunk 的线性扫描耗时在毫秒级，远小于 embedQuery 的 ONNX 推理耗时）。
 * 反而在 products 未指定时（恰恰是最需要语义补召回的模糊查询场景），
 * 只能退回体量极小的 '*' 分片，导致向量召回几乎失效——这是不合理的设计。
 *
 * 现改为单一索引 + metadata.product 字段 + queryItems 的 MetadataFilter 过滤：
 * - products 有值 → filter: { product: { $in: products } }
 * - products 为空 → 不传 filter，全库扫描（行为对齐 BM25 的全量兜底语义）
 *
 * 索引直接落在 vectors/ 目录下（index.json 等文件），不再套一层多余的 'all' 子目录。
 */
export function allIndexPath() {
    return vectorsRoot();
}
// 进程内缓存已加载的 LocalIndex，避免每次查询重开。
// 类型用 any：vectra 是 optionalDependency，避免在类型层面强制引入其类型定义。
// 运行时依赖改为动态 import（见 loadIndex），客户未安装 vectra 时在此降级为 null。
let cachedIndex;
async function loadIndex() {
    if (cachedIndex !== undefined)
        return cachedIndex;
    try {
        const { LocalIndex } = await import('vectra');
        const idx = new LocalIndex(allIndexPath());
        const exists = await idx.isIndexCreated();
        cachedIndex = exists ? idx : null;
    }
    catch {
        // 未安装 / 加载失败，等价于"索引不存在"，下游退化为纯 BM25。
        cachedIndex = null;
    }
    return cachedIndex;
}
/**
 * 在全局向量库里查 topK 相似 chunk，按 products 做 metadata 过滤。
 * products 为空/未指定 → 不加过滤条件，全库扫描（不再退化为几乎空的 '*' 分片）。
 * 索引不存在 → 返回空数组（容错，降级为纯 BM25）。
 */
export async function queryVectors(products, queryVec, topK) {
    const idx = await loadIndex();
    if (!idx)
        return [];
    // product 小写归一，与 build-vectors.groupByProduct 一致（容忍数据源大小写不一致）
    const normalized = products && products.length
        ? [...new Set(products.map((p) => p.toLowerCase()))]
        : [];
    const vec = Array.from(queryVec);
    const filter = normalized.length ? { product: { $in: normalized } } : undefined;
    const results = await idx.queryItems(vec, '', topK, filter);
    const best = new Map();
    for (const r of results) {
        const id = String(r.item.metadata.chunk_id);
        const prev = best.get(id);
        if (prev === undefined || prev < r.score)
            best.set(id, r.score);
    }
    return [...best.entries()]
        .map(([id, score]) => ({ id, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

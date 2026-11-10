/**
 * 本地 ONNX 文本编码器。
 *
 * 模型：BGE-small-zh-v1.5（512 维，中文检索优化，体积轻）。
 * 后端：device='cpu'（@huggingface/transformers 4.x 的 Node 端支持 coreml/webgpu/cpu；
 *       'wasm' 仅浏览器可用）。cpu 后端底层走 onnxruntime-node。
 *
 * 依赖加载策略：@huggingface/transformers 是 optionalDependency，
 * 改为首次调用时动态 import，避免客户未安装该包时在模块解析阶段直接抛错，
 * 从而保证纯 BM25 链路在无向量依赖的环境下也能正常启动。
 */
const MODEL_ID = 'Xenova/bge-small-en-v1.5';
let extractorPromise = null;
function getExtractor() {
    if (!extractorPromise) {
        extractorPromise = import('@huggingface/transformers').then(({ pipeline }) => pipeline('feature-extraction', MODEL_ID, {
            device: 'cpu',
            dtype: 'q8',
        }));
    }
    return extractorPromise;
}
/**
 * 编码一批文本 → 归一化向量（余弦相似度可直接点积）。
 * mean pooling + L2 normalize（BGE 官方推荐）。
 */
export async function embedTexts(texts) {
    if (texts.length === 0)
        return [];
    const extractor = await getExtractor();
    const output = await extractor(texts, { pooling: 'mean', normalize: true });
    const rows = output.tolist();
    return rows.map((row) => Float32Array.from(row));
}
/** 单条查询编码（运行期热路径，texts=1） */
export async function embedQuery(text) {
    const [vec] = await embedTexts([text]);
    return vec;
}
/** BGE 建议给查询加指令前缀以提升检索质量 */
export function withQueryInstruction(query) {
    return `Represent this sentence for searching relevant passages: ${query}`;
}

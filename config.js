/**
 * 向量检索通道全局开关（随版本发布固化在源码里，不是运行时环境变量）。
 * - false：构建时生成向量索引，运行时默认走 Hybrid（BM25+向量）检索。
 * - true：构建时跳过向量索引生成，运行时固定走纯 BM25。
 * 修改后需要重新 `npm run build` + 发布新版本才会对客户生效，客户侧零配置。
 */
export const DISABLE_VECTOR_CHANNEL = true;
/**
 * 向量召回融合参数（编译期固化，不再从 process.env 读取）。
 */
export const VECTOR_AUGMENT_ALPHA = 0.15; // RRF 融合中向量路权重
export const VECTOR_AUGMENT_BASE_BETA = 0.3; // RRF 融合基数
export const VECTOR_TOP_K = 30; // 向量召回 topK
export const VECTOR_RRF_K = 60; // RRF 融合的 k
export const VECTOR_RERANK_TOP_K = 20; // 向量融合后轻量重排窗口默认值
/**
 * 检索候选池构建策略（编译期固化，不再从 process.env 读取）。
 * - 'hard'：仅 product 硬隔离（默认，实测召回更优）。
 * - 'strict'：额外叠加 framework/scenario/types 软过滤（实验性，留作回归对比）。
 */
export const POOL_STRATEGY = 'hard';

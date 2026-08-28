/**
 * 通用加性 rerank：数据驱动的高 IDF 锚点命中 + 连续短语命中。
 *
 * 设计约束（零衰减 + 通用）：
 * - 纯加性：只往 boosts 加正数，无 penalty；无信号（无锚点且无短语命中）时返回空 map，
 *   排序数学上完全等于现状 → 已有功能零衰减。
 * - 量纲受控：单 chunk 上限 = W_ANCHOR + W_PHRASE，远低于 exact-lookup 的 +200~+300，
 *   只在 BM25 平局区间起微调，不翻转既有精确命中。
 * - 零硬编码：锚点门槛来自运行时 index.idf 分位、短语来自 query 结构，
 *   不含任何具体词 / product / 文件名 → 对任意产品成立。
 *
 * 治两个诊断确认的真病根：
 * - A（锚点命中）：对抗「CJK unigram 被拆多份 × 高 tf 堆分」——稀有锚点命中给加权，
 *   把靠通用词堆分的长文档区分开。
 * - B（连续短语）：用原始字符串连续匹配抓「组合稀有」（如 WebSocket is not a constructor），
 *   同时天然排除 tokenize 产生的跨词垃圾 bigram（如「错怎」——它在原 query 里虽连续，
 *   但作为连续串在无关文档正文中不命中，不会被误加分）。
 */
// ── 超参（唯一可调项，均可回归验证）──────────────────────────────
/** 锚点门槛：取当前检索子库 IDF 分布的分位阈值，IDF ≥ 此值的 query term 视为锚点 */
const IDF_PERCENTILE = 0.75;
/** 锚点数上限，防止长 query 稀释权重 */
const MAX_ANCHORS = 6;
/** 锚点命中权重（与 BM25 top 分 20~50 同量级，低于 exact-lookup boost 量级） */
const W_ANCHOR = 40;
/** 连续短语命中权重 */
const W_PHRASE = 30;
/**
 * 从 query term 中选出锚点：IDF ≥ 子库分位阈值的 term，按 IDF 降序取 top-K。
 * 门槛完全由 index.idf 的运行时分布决定（数据驱动），不写死任何词。
 */
function selectAnchors(queryTerms, index) {
    const allIdf = Object.values(index.idf);
    if (allIdf.length === 0)
        return [];
    const sorted = [...allIdf].sort((a, b) => a - b);
    const threshold = sorted[Math.floor(sorted.length * IDF_PERCENTILE)] ?? 0;
    const seen = new Set();
    const anchors = [];
    for (const term of queryTerms) {
        if (seen.has(term))
            continue;
        seen.add(term);
        // Object.prototype 污染防护：term 可能是 'constructor' 等原型键。
        if (!Object.hasOwn(index.idf, term))
            continue;
        const idf = index.idf[term];
        if (typeof idf !== 'number' || Number.isNaN(idf) || idf < threshold)
            continue;
        anchors.push({ term, idf });
    }
    anchors.sort((a, b) => b.idf - a.idf);
    return anchors.slice(0, MAX_ANCHORS);
}
/**
 * 从原始 query 抽取连续短语（不经 tokenize，避免分词假象）：
 * - 英文：相邻词对（连续两个 ≥2 长度的英文/数字 token）
 * - 中文：连续 ≥2 字的中文片段（整段，不切分）
 */
function extractPhrases(prompt) {
    const phrases = [];
    const enWords = prompt.toLowerCase().match(/[a-z0-9_]{2,}/g) ?? [];
    for (let i = 0; i < enWords.length - 1; i += 1) {
        phrases.push(`${enWords[i]} ${enWords[i + 1]}`);
    }
    for (const seg of prompt.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        phrases.push(seg);
    }
    return [...new Set(phrases)].filter((p) => p.replace(/\s/g, '').length >= 2);
}
/**
 * 计算通用加性 boost。返回 chunkId -> 正分。
 * 无锚点且无短语时返回空 map（排序退化为原始，零衰减）。
 */
export function computeGenericAnchorBoosts(prompt, pool, index, tokenizeFn) {
    const result = {};
    const anchors = selectAnchors(tokenizeFn(prompt), index);
    const phrases = extractPhrases(prompt);
    // 门槛：既无锚点也无短语 → 直接返回空，排序完全等于原来。
    if (anchors.length === 0 && phrases.length === 0)
        return result;
    const maxIdf = Math.max(1, ...anchors.map((a) => a.idf));
    for (const chunk of pool) {
        // ── 信号 A：命中锚点，按 IDF 归一化累加命中强度 ──
        let anchorStrength = 0;
        let anchorHits = 0;
        for (const { term, idf } of anchors) {
            // Object.prototype 污染防护：term 可能是 'constructor' 等原型键。
            if (!Object.hasOwn(index.postings, term))
                continue;
            const posting = index.postings[term];
            if ((Object.hasOwn(posting, chunk.id) ? posting[chunk.id] : 0) > 0) {
                anchorStrength += idf / maxIdf;
                anchorHits += 1;
            }
        }
        // ── 信号 B：连续短语在 title / key_phrases / 正文原始串命中 ──
        const haystack = [
            chunk.title,
            ...(chunk.key_phrases ?? []),
            chunk.content,
        ].filter(Boolean).join(' ').toLowerCase();
        let phraseHits = 0;
        for (const phrase of phrases) {
            if (haystack.includes(phrase.toLowerCase())) {
                phraseHits += 1;
            }
        }
        // 该 chunk 无任何信号 → 不加分（保持原分）。
        if (anchorHits === 0 && phraseHits === 0)
            continue;
        const boostA = anchors.length > 0
            ? W_ANCHOR * (anchorStrength / anchors.length) // 归一化到 [0, W_ANCHOR]
            : 0;
        const boostB = phrases.length > 0
            ? W_PHRASE * Math.min(1, phraseHits / phrases.length) // [0, W_PHRASE]
            : 0;
        const total = boostA + boostB;
        if (total > 0)
            result[chunk.id] = total;
    }
    return result;
}

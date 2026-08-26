const K1 = 1.5;
const B = 0.75;
/**
 * 中文停用词：高频功能词，参与 BM25 会稀释关键术语权重。
 * 覆盖：疑问代词、助词、人称、连接词、模糊量词、敬辞。
 */
const CN_STOPWORDS = new Set([
    '怎么', '如何', '什么', '哪些', '哪个', '为何', '为啥', '是否',
    '可以', '能够', '需要', '想要', '应该', '请问', '麻烦',
    '一下', '一个', '这个', '那个', '这些', '那些', '里面', '外面',
    '使用', '用法', '用于', '用来', '进行', '实现', '提供', '支持',
    '问题', '情况', '场景', '方式', '方法', '功能', '能力',
    '我们', '你们', '他们', '自己', '大家',
    '以及', '或者', '还是', '但是', '然后', '所以', '因为', '如果',
    '已经', '正在', '马上', '立即', '总是', '一直',
]);
/** 英文停用词：限制在常见 query 噪声词，避免误删技术语义词（如 'use', 'set' 这种命名前缀保留） */
const EN_STOPWORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'and', 'or', 'but', 'if', 'then', 'so', 'as', 'of', 'at', 'by', 'for', 'in', 'on', 'to',
    'do', 'does', 'did', 'have', 'has', 'had',
    'this', 'that', 'these', 'those',
    'how', 'what', 'why', 'when', 'where', 'which', 'who',
    'i', 'we', 'you', 'they', 'it', 'me', 'us', 'them',
    'pls', 'please', 'thanks',
]);
function isStopwordCJK(token) {
    return CN_STOPWORDS.has(token);
}
function isStopwordEN(token) {
    return EN_STOPWORDS.has(token);
}
export function tokenize(text) {
    const tokens = [];
    const lower = text.toLowerCase();
    // 英文/数字 token：跳过停用词；保留长度 ≥ 2 的（避免单字符 'i', 'a' 漏入）
    for (const match of lower.matchAll(/[a-z0-9_]+/g)) {
        const tok = match[0];
        if (tok.length === 1)
            continue;
        if (isStopwordEN(tok))
            continue;
        tokens.push(tok);
    }
    // 中文 token：bigram + unigram 两级
    // - bigram：跳过包含停用词单字的组合（如「怎么调用」的「怎么」）以及任一位是常见停用字
    // - unigram：跳过纯停用单字（用一个收敛的单字停用集合）
    const cjk = text.replace(/[^\u4e00-\u9fff]/g, '');
    for (let i = 0; i < cjk.length - 1; i += 1) {
        const bigram = cjk.slice(i, i + 2);
        if (isStopwordCJK(bigram))
            continue;
        tokens.push(bigram);
    }
    // 单字仅保留有信息量的（中文单字普遍信息量低，全部塞入会拉低 IDF；
    // 简化策略：只在 bigram 路径之外补充长度 ≥ 3 的连续单字组合的首尾，避免噪声爆炸）
    // 实践上保留 unigram 但不参与停用词过滤——让 BM25 的 IDF 自然衰减它们的权重。
    for (let i = 0; i < cjk.length; i += 1) {
        tokens.push(cjk[i]);
    }
    return tokens;
}
export function buildBM25Index(documents) {
    // 用无原型对象，杜绝 term/id 为 'constructor'/'__proto__' 等原型键时的污染。
    const postings = Object.create(null);
    const docLengths = Object.create(null);
    const docFreq = Object.create(null);
    let totalLength = 0;
    for (const doc of documents) {
        const tokens = tokenize(doc.text);
        docLengths[doc.id] = tokens.length;
        totalLength += tokens.length;
        const termFreq = Object.create(null);
        for (const token of tokens) {
            termFreq[token] = (termFreq[token] ?? 0) + 1;
        }
        for (const [term, freq] of Object.entries(termFreq)) {
            if (!postings[term])
                postings[term] = Object.create(null);
            postings[term][doc.id] = freq;
            docFreq[term] = (docFreq[term] ?? 0) + 1;
        }
    }
    const n = documents.length;
    const avgDocLength = n > 0 ? totalLength / n : 0;
    const idf = Object.create(null);
    for (const [term, df] of Object.entries(docFreq)) {
        idf[term] = Math.log(1 + (n - df + 0.5) / (df + 0.5));
    }
    return {
        version: 1,
        avgDocLength,
        docLengths,
        idf,
        postings,
    };
}
export function scoreBM25(query, chunkId, index) {
    const tokens = tokenize(query);
    // Object.prototype 污染防护：postings/idf/docLengths 来自 JSON.parse 的普通对象，
    // term 可能是 'constructor'/'toString'/'__proto__' 等原型键，直接 [] 取值会命中
    // 原型链上的函数（如 Object.prototype.constructor），污染打分为 NaN。用 hasOwn 守卫。
    const docLength = Object.hasOwn(index.docLengths, chunkId) ? index.docLengths[chunkId] : 0;
    if (!docLength || Number.isNaN(docLength))
        return 0;
    let score = 0;
    for (const term of tokens) {
        if (!Object.hasOwn(index.postings, term) || !Object.hasOwn(index.idf, term))
            continue;
        const posting = index.postings[term];
        const tf = Object.hasOwn(posting, chunkId) ? posting[chunkId] : 0;
        if (!tf || Number.isNaN(tf))
            continue;
        const idf = index.idf[term];
        if (Number.isNaN(idf))
            continue;
        const numerator = tf * (K1 + 1);
        const denominator = tf + K1 * (1 - B + B * (docLength / (index.avgDocLength || 1)));
        score += idf * (numerator / denominator);
    }
    return score;
}
export function rankBM25(query, chunkIds, index, boosts = {}) {
    return chunkIds
        .map((id) => ({
        id,
        score: scoreBM25(query, id, index) + (boosts[id] ?? 0),
    }))
        .sort((a, b) => b.score - a.score);
}
/**
 * BM25 检索文本：title 重复 3 次以提权（标题语义浓度远高于正文，按业界惯例 boost）。
 * symbols / error_codes 同样保留以便精确名匹配；正文走原内容。
 */
export function chunkSearchText(parts) {
    const titleBoosted = [parts.title, parts.title, parts.title].filter(Boolean).join(' ');
    return [titleBoosted, parts.content ?? '', ...parts.symbols, ...parts.error_codes].filter(Boolean).join(' ');
}
export function rankPoolBM25(query, pool, boosts = {}) {
    if (pool.length === 0)
        return [];
    const index = buildBM25Index(pool.map((chunk) => ({
        id: chunk.id,
        text: chunkSearchText(chunk),
    })));
    return rankBM25(query, pool.map((chunk) => chunk.id), index, boosts);
}
/**
 * 基于预构建的 BM25 索引对一个 chunk-id 子集打分，跳过 tokenize + IDF 重算。
 * 调用方需保证 chunkIds ⊆ index 已收录的 id 集合，否则未收录的 id 会返回 score=0。
 */
export function rankSubsetWithIndex(query, chunkIds, index, boosts = {}) {
    if (chunkIds.length === 0)
        return [];
    return rankBM25(query, chunkIds, index, boosts);
}

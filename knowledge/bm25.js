import { Jieba } from '@node-rs/jieba';
import { dict } from '@node-rs/jieba/dict.js';
const K1 = 1.5;
/** B：长度归一化强度。经典 0.75 对本库偏差大——大表/长正文 chunk（「业务特性限制」3615 字符，docLength
 *  达均值 9.4 倍）被短片段（327 字符）系统性压制，实测 B=0.4 明显优于 0.75。 */
const B = 0.4;
/**
 * 面包屑开关：目录（nav_path）是否进打分文本。
 * zh 默认 true（中文 nav_path 帮助中文召回）；en 由 sync-code locale patch 翻转为 false
 * （中文 nav_path 对英文 query 是噪音）。
 */
const BREADCRUMB = false;
/** jieba 词典分词实例（进程内单例，加载默认词典） */
const jieba = Jieba.withDict(dict);
/**
 * 技术组合词词典：jieba 默认词典不含这些端侧/功能组合词（会把「应用端」切成「应用」「端」），
 * 切碎后失去组合词区分度（如「录像回放」目标被 API 文档抢占）。加载为自定义词典，
 * 保证端侧词与高频功能词按整词切分。
 * 数据配置，与 taxonomy.yaml 同类，非检索算法。
 */
const TECHNICAL_TERMS = [
    '应用端', '设备端', '客户端', '服务端',
    '录像回放', '动态注册', '云台控制', '语音对讲', '监控拉流',
    '云存', '智能看家', '车牌识别', '物模型',
];
jieba.loadDict(Buffer.from(TECHNICAL_TERMS.map((w) => `${w} 100 n`).join('\n')));
/**
 * 中文停用词：仅保留真正的虚词（疑问代词、助词、人称、连接词、敬辞、模糊量词）。
 * 不再停用「使用/实现/功能/方法」等技术实词——它们在技术文档检索中是有效召回信号。
 */
const CN_STOPWORDS = new Set([
    '怎么', '如何', '什么', '哪些', '哪个', '为何', '为啥', '是否',
    '可以', '能够', '需要', '想要', '应该', '请问', '麻烦',
    '一下', '一个', '这个', '那个', '这些', '那些', '里面', '外面',
    '我们', '你们', '他们', '自己', '大家',
    '以及', '或者', '还是', '但是', '然后', '所以', '因为', '如果',
    '已经', '正在', '马上', '立即', '总是', '一直',
    '的', '了', '吗', '呢', '吧', '啊', '在', '与', '和',
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
/**
 * 标识符子词拆分（改造 2）。
 *
 * 问题：`tokenize` 把 `StartAIConversation` 压成单个小写粘连词 `startaiconversation`，
 * `openim/admin_set_msg_read` 被切成 `openim` + `admin_set_msg_read`。query 里写
 * `StartAIConversation`、文档里写 `StartAIConversation` 能对上；但 query 写
 * `start AI conversation`、或文档把命名拆成 `StartAIConversation` / `startAIConversation`
 * 时，两边都取不到共同 term —— 这正是 22.3% 排序失败与部分召回失败的主因之一。
 *
 * 做法：对 identifier 形态的 token 额外产出子词（camelCase / 下划线 / 路径段），
 * 既能被 query 侧的普通词命中，也能反向命中。
 */
export function identifierSubwords(token) {
    const parts = [];
    // 路径段 / 点号成员访问均为分隔符：`TRTCCloud.enterRoom` → `TRTCCloud` + `enterRoom`
    for (const seg of token.split(/[/\\.-]+/)) {
        if (!seg)
            continue;
        // camelCase / PascalCase 边界：
        //  1) 小写 → 大写：startLocal → start Local
        //  2) 连续大写后接小写：TRTCCloud → TRTC Cloud（末位大写归属后词）
        // 规则 1 刻意只认小写（不含数字）：数字后跟大写多为「缩写内部」而非词边界，
        // 若用 ([a-z0-9])([A-Z]) 会把 V2TIMManager 误断成 v2+tim+manager，导致
        // query「V2TIM」取不到 term。实测语料：V2TIM 类受益 5882 次，
        // 仅「缩写+数字结尾」（VideoDynamicGrid9Seats 类）受影响 226 次，净收益 26:1。
        const camel = seg
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .split(/\s+/);
        for (const piece of camel) {
            for (const sub of piece.split(/_+/)) {
                const t = sub.toLowerCase();
                // 过滤过短碎片（单字母/纯数字），避免污染倒排表
                if (t.length >= 2 && /[a-z]/.test(t))
                    parts.push(t);
            }
        }
    }
    return parts;
}
/** 判断 token 是否值得做子词扩展（含大小写边界、下划线或路径分隔符） */
function isIdentifierLike(token) {
    return /[A-Z]/.test(token) || /[_/\\]/.test(token);
}
/**
 * 从**原始字段文本**抽取标识符形态的片段。
 *
 * 必须在 `tokenize` 之前调用：`tokenize` 首步 `toLowerCase()` 会抹掉大小写边界，
 * 导致 `StartAIConversation` 变成 `startaiconversation`，`isIdentifierLike` 恒为 false，
 * camelCase 子词拆分整体失效（实测全库 11.07 万个标识符中 91.6% 属此类）。
 *
 * 字符类包含 `/` 与 `\`，使 `openim/admin_set_msg_read` 作为整体进入 identifierSubwords，
 * 由其内部按路径段 + 下划线 + camelCase 统一拆分。
 */
function extractIdentifierCandidates(raw) {
    const out = [];
    for (const m of raw.matchAll(/[A-Za-z_][A-Za-z0-9_./\\-]{1,}/g)) {
        const cand = m[0];
        if (isIdentifierLike(cand))
            out.push(cand);
    }
    return out;
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
    // 中文 token：剥离非中文后走 jieba 搜索模式分词（词典分词，词边界正确，无跨词噪声），
    // 再过滤保守停用词（只停虚词，不停「使用/实现/功能/方法」等技术实词）。
    const cjk = text.replace(/[^\u4e00-\u9fff]/g, '');
    if (cjk) {
        for (const word of jieba.cutForSearch(cjk, false)) {
            const w = word.trim();
            if (!w)
                continue;
            if (isStopwordCJK(w))
                continue;
            tokens.push(w);
        }
    }
    return tokens;
}
/**
 * 中文精确模式分词（jieba 最大匹配，不切子词），供 docTitleHit 词级匹配使用。
 * 与 tokenize 的搜索模式（cutForSearch 会同时输出「设备」与「设备端」）不同，
 * 精确模式在自定义词典命中时只输出完整词（「设备端」≠「设备」），
 * 从机制上消除「doc_title 中文是 query 中文的前缀子串」这类误命中。
 */
export function tokenizeExactCJK(text) {
    const cjk = text.replace(/[^\u4e00-\u9fff]/g, '');
    if (!cjk)
        return [];
    return jieba.cut(cjk, false).map((w) => w.trim()).filter(Boolean);
}
const FIELD_SPECS = [
    { name: 'title', get: (c) => c.title ?? '', weight: 1.5, titleLike: true },
    { name: 'doc_title', get: (c) => c.doc_title ?? '', weight: 1.5, titleLike: true },
    { name: 'nav_path', get: (c) => (c.nav_path ?? []).join(' '), weight: BREADCRUMB ? 1 : 0 },
    { name: 'tags', get: (c) => (c.tags ?? []).join(' '), weight: 2 },
    { name: 'content', get: (c) => c.content ?? '', weight: 2 },
    { name: 'symbols', get: (c) => (c.symbols ?? []).join(' '), weight: 1, identifierLike: true },
    { name: 'error_codes', get: (c) => (c.error_codes ?? []).join(' '), weight: 1, identifierLike: true },
    { name: 'key_phrases', get: (c) => (c.key_phrases ?? []).join(' '), weight: 1 },
    { name: 'api_names', get: (c) => (c.api_names ?? []).join(' '), weight: 1, identifierLike: true },
];
/** 参与打分的字段（权重 ≤0 的字段「完全不带」，连 docLength 都不计） */
const ACTIVE_FIELD_SPECS = FIELD_SPECS.filter((f) => f.weight > 0);
/** 标题类字段取值器（titleFieldDf 统计用，与 FIELD_SPECS 的 titleLike 标记保持同源） */
const TITLE_FIELD_SPECS = ACTIVE_FIELD_SPECS.filter((f) => f.titleLike);
export function buildBM25Index(documents) {
    // 用无原型对象，杜绝 term/id 为 'constructor'/'__proto__' 等原型键时的污染。
    const postings = Object.create(null);
    const docLengths = Object.create(null);
    const docFreq = Object.create(null);
    let totalLength = 0;
    // ── 字段级 IDF 衰减（title-scoped IDF）──
    // title/doc_title 字段固定 ×3 的隐含假设是「字段里的词都是区分性主题词」，但实际混入
    // 「限制/教程/接入/说明/Web/Android」等泛化词/平台词——它们出现在大量文档的 doc_title
    // 里（实测 titleDf：android=959 / ios=868 / web=751 / 接入=272 / 说明=117 / 限制=17），
    // ×3 权重让整类文档对带这些词的 query 系统性抢占（如「长度限制/峰值限制」被
    // 「网络访问限制实践教程」的 doc_title 压制）。治理：title/doc_title 字段的 tf 贡献乘以
    // 「该词在 title 集合里的 IDF 归一化因子」——区分词（titleDf 低，如「云台控制」=4）因子
    // ≈0.8 基本保留，泛化词（titleDf 高）按区分度衰减（如 web=751 因子≈0.28）。content
    // 等其他字段不变。
    const titleFieldDf = new Map();
    for (const doc of documents) {
        const seen = new Set();
        for (const spec of TITLE_FIELD_SPECS) {
            for (const t of tokenize(spec.get(doc)))
                seen.add(t);
        }
        for (const t of seen)
            titleFieldDf.set(t, (titleFieldDf.get(t) ?? 0) + 1);
    }
    const titleFieldN = Math.max(documents.length, 1);
    const maxTitleIdf = Math.log(2 * titleFieldN + 2);
    const titleIdfFactor = (term) => {
        const df = titleFieldDf.get(term) ?? 0;
        if (!df)
            return 1;
        // 下限 0.5：泛化词最多衰减一半。过低会伤及「平台叶子 doc_title 召回」路径
        // （如 iot「Linux & RTOS 设备」靠 linux/rtos/设备 词召回），保留基本区分力。
        return Math.max(0.5, Math.log(1 + (titleFieldN - df + 0.5) / (df + 0.5)) / maxTitleIdf);
    };
    for (const doc of documents) {
        const termFreq = Object.create(null);
        let docLength = 0;
        // 分字段分词 + 字段权重加权 tf：title 词 tf×1.5、content 词 tf×2 等。
        // 字段角色（titleLike / identifierLike）与权重均由 FIELD_SPECS 声明，不再依赖数组下标。
        // 权重 ≤0 的字段（NAV_BREADCRUMB=0 时的 nav_path）已在 ACTIVE_FIELD_SPECS 过滤掉，
        // 既不计 tf 也不计 docLength——「完全不带」语义。
        for (const spec of ACTIVE_FIELD_SPECS) {
            const raw = spec.get(doc);
            const tokens = tokenize(raw);
            docLength += tokens.length;
            for (const token of tokens) {
                const fieldWeight = spec.weight * (spec.titleLike ? titleIdfFactor(token) : 1);
                termFreq[token] = (termFreq[token] ?? 0) + fieldWeight;
            }
            // 改造 2：精确名字段追加标识符子词（camelCase/下划线/路径拆分），
            // 让 query 里的「start ai conversation」能召回名字段含 StartAIConversation 的 chunk。
            // 注意：子词必须从 raw（未小写化）抽取——tokenize 已 toLowerCase，大小写边界丢失。
            if (spec.identifierLike) {
                const seen = new Set(tokens);
                for (const cand of extractIdentifierCandidates(raw)) {
                    for (const sub of identifierSubwords(cand)) {
                        if (seen.has(sub))
                            continue; // 与整名 token 重复则不重复计分
                        termFreq[sub] = (termFreq[sub] ?? 0) + spec.weight * 0.6; // 子词精度低于整名，降权
                    }
                }
            }
        }
        docLengths[doc.id] = docLength;
        totalLength += docLength;
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
    return { version: 4, avgDocLength, docLengths, idf, postings };
}
/**
 * 向量嵌入文本（build-vectors 调用；BM25 走 buildBM25Index 分字段加权，不用本函数）。
 * 改单次前缀「目录路径 > chunk 标题：正文」，不重复。
 * 旧文本 title×3 + doc_title×3 + nav_path×2 + tags×2 + content 在 512-token 窗口下
 * 元数据重复占据前部、33.6% 的 chunk 正文尾部被截断，向量退化为标题匹配。
 * - 目录路径：nav_path 优先；无 nav_path（best-practice）时用 doc_title 兜底。
 * - chunk 标题单次、正文原样；key_phrases/api_names/symbols/error_codes 不进向量
 *   （精确名匹配由 BM25 字段承担，512-token 窗口留给正文）。
 */
export function chunkSearchText(parts) {
    // BREADCRUMB=0：前缀去掉目录路径，只剩「chunk 标题：正文」。
    const path = BREADCRUMB
        ? (parts.nav_path?.length ? parts.nav_path.join(' > ') : (parts.doc_title ?? ''))
        : '';
    const head = path ? `${path} > ${parts.title}` : parts.title;
    const prefix = head ? `${head}：` : '';
    return `${prefix}${parts.content ?? ''}`;
}
export function scoreBM25(query, chunkId, index) {
    const tokens = tokenize(query);
    // Object.prototype 污染防护：postings/idf/docLengths 来自 JSON.parse 的普通对象，
    // term 可能是 'constructor'/'toString'/'__proto__' 等原型键，直接 [] 取值会命中原型链。用 hasOwn 守卫。
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
 * 基于预构建的 BM25 索引对一个 chunk-id 子集打分，跳过 tokenize + IDF 重算。
 * 调用方需保证 chunkIds ⊆ index 已收录的 id 集合，否则未收录的 id 会返回 score=0。
 */
export function rankSubsetWithIndex(query, chunkIds, index, boosts = {}) {
    if (chunkIds.length === 0)
        return [];
    return rankBM25(query, chunkIds, index, boosts);
}

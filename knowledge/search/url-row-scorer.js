/**
 * url-row-scorer.ts
 *
 * URL 映射行（chat/urls/...）匹配打分器。
 *
 * 设计目标（重构版）：
 * - **语义词对齐**：按「query 与 title 的高区分度语义特征是否对齐」打分，
 *   而不是「子串/单字」粗匹配。
 * - **IDF 自动降权**：高频泛词（`消息`/`message`/`group`）靠 IDF 自动低权重，
 *   稀有语义词（`消息回应`/`reaction`）高权重，**不依赖枚举词表**。
 * - **中英通吃、产品无关**：同一套特征提取同时处理中文/英文标题。
 * - 保留已验证有效的 REST 端点 / API token 高分路径。
 */
import { idfWeight, isValidBigram, loadIdf } from './url-row-idf.js';
/**
 * 提取 CJK 有效 2-gram（df>0，过滤「送前」「前回」等滑窗噪声）。
 * 口径与旧版 qBigrams / titleBigramArray **bit-identical**。
 */
function extractCjkTokens(text) {
    const tokens = new Set();
    for (const seg of text.toLowerCase().match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        for (let i = 0; i < seg.length - 1; i += 1) {
            const bg = seg.slice(i, i + 2);
            if (isValidBigram(bg))
                tokens.add(bg);
        }
    }
    return tokens;
}
/**
 * 提取 EN 有效词（>=4 字母，形态过滤 web/h5/sdk/api/im/tim/app/pc/mini/v\d+）。
 * 仅在 query **纯 EN**（无 CJK）时启用，避免混合 query 的 EN 翻译
 * （如「单聊」展开成「one-to-one c2c single chat message」后,无对应 title 命中,
 * 会稀释 CJK 主干的 coverage 分母,导致「单聊/群聊」互抢位）。
 */
function extractEnTokens(text) {
    const tokens = new Set();
    for (const m of text.toLowerCase().matchAll(/[a-z][a-z0-9]{2,}/g)) {
        const w = m[0];
        if (w.length < 4)
            continue;
        if (/^(web|h5|sdk|api|im|tim|app|pc|mini|v\d+)$/.test(w))
            continue;
        tokens.add(w);
    }
    return tokens;
}
/**
 * 计算单语言路径的语义打分（coverage + meaningfulRatio + titleCoverage 三维度）。
 * 对纯 CJK 输入，与旧版 4 分支结构 + 公式 **bit-identical**。
 * 对纯 EN 输入，引入 IDF 调节（旧版只走 650+30*N 无 IDF 导致泛词虚高）。
 */
function scoreOneLang(qTokens, tTokens) {
    const queryTokenCount = qTokens.size;
    const titleTokenCount = tTokens.size;
    if (queryTokenCount === 0) {
        return { coverage: 0, titleCoverage: 0, meaningfulRatio: 0, matchedCount: 0, titleTokenCount };
    }
    let matchedCount = 0;
    let meaningfulMatched = 0;
    for (const t of qTokens) {
        if (tTokens.has(t)) {
            matchedCount += 1;
            if (idfWeight(t) > 0.5)
                meaningfulMatched += 1;
        }
    }
    const coverage = matchedCount / queryTokenCount;
    const titleCoverage = titleTokenCount > 0 ? matchedCount / titleTokenCount : 0;
    const meaningfulRatio = meaningfulMatched / queryTokenCount;
    return { coverage, titleCoverage, meaningfulRatio, matchedCount, titleTokenCount };
}
/** REST 端点（v4/xxx）精确匹配 */
function restEndpointHit(query, title) {
    const qe = [...query.matchAll(/v4\/[\w/]+/gi)].map((m) => m[0].toLowerCase());
    const te = [...title.matchAll(/v4\/[\w/]+/gi)].map((m) => m[0].toLowerCase());
    if (!qe.length)
        return 0;
    for (const q of qe) {
        if (te.some((t) => t === q || t.endsWith(q) || q.endsWith(t)))
            return 1000;
    }
    return 0;
}
/**
 * API token（驼峰 / 点号 / useXxx）精确匹配
 *
 * **V2 严格命中（修复 X message row-to-row tie）**：
 * 旧版 `lower.includes(api)` 会把"共享部分 API"也计入命中，导致所有
 * `X message (createXMessage → sendMessage)` 标题因共享 `sendMessage` 都得 940，
 * BM25 决定胜负，倾向"Text message"抢首位（41+ miss）。
 *
 * 新版要求 query 和 title 的 **long API（≥8 字符）集合完全一致**（双向 ⊆）
 * 才算 940。这样：
 * - query "Send message parameter configuration (sendMessage parameters)" → long={sendMessage}
 *   - self title: long={sendMessage} → 940
 *   - "Text message" title: long={createTextMessage, sendMessage} → sizes differ → 0
 *   - 共享 `sendMessage` 但缺独有 API（如 createTextMessage）的 title 拿 0 分
 * - query "Image message (createImageMessage → sendMessage)" → long={createImageMessage, sendMessage}
 *   - self title: long={createImageMessage, sendMessage} → 940
 *   - "Sound message" title: long={createSoundMessage, sendMessage} → 大小同但内容不同 → 0
 *
 * 兼容：
 * - restapi.md 仍命中（query 和 title 的 v4 API 路径互为完整 token 集合）。
 * - sdk/* 的 createXMessage/sendMessage 自匹配：query 和 title 双向 ⊆ → 940。
 */
function apiTokenHit(query, title) {
    // 提取 query/title 的 API token（驼峰 / useXxx / 点号）
    const apiRe = /\b([a-z]+[A-Z][A-Za-z0-9_]*)\b|\b([A-Z][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*)\b|\b(use[A-Z]\w*)\b/g;
    const extract = (text) => {
        const out = new Set();
        for (const m of text.matchAll(apiRe)) {
            const api = (m[1] ?? m[2] ?? m[3]).toLowerCase();
            if (api && api.length >= 4)
                out.add(api);
        }
        return out;
    };
    const queryApis = extract(query);
    const titleApis = extract(title);
    if (queryApis.size === 0)
        return 0;
    // 只看 long API（≥8 字符）的双向 ⊆ 严格命中要求
    const longQuery = new Set([...queryApis].filter((a) => a.length >= 8));
    if (longQuery.size === 0) {
        // 没有 long API 的 query 走 hits 计数（兼容短 token 场景，如 useXxx）
        let hits = 0;
        for (const a of queryApis)
            if (titleApis.has(a))
                hits += 1;
        if (hits >= 2)
            return 900;
        if (hits === 1)
            return 860;
        return 0;
    }
    const longTitle = new Set([...titleApis].filter((a) => a.length >= 8));
    // 严格双向命中：query.long === title.long（Set 视角）
    if (longQuery.size !== longTitle.size)
        return 0;
    for (const a of longQuery)
        if (!longTitle.has(a))
            return 0;
    return 940;
}
/**
 * 语义词对齐打分（双路径版：CJK 路径与 EN 路径独立计算）
 *
 * 设计要点（与旧版兼容性 vs 修复 en 端虚高）：
 * 1. **CJK 路径**：与旧版 4 分支 + 公式 **bit-identical**。
 *    混合 query（query expansion 注入 EN 翻译后）只走 CJK 路径,EN tokens 不参与
 *    分母计算,避免「单聊/群聊」互抢位。
 * 2. **EN 路径**：仅在 query 无 CJK 时启用（即纯 EN query）。
 *    引入 IDF 调节:旧版 enWordHits 路径「650+30*N」无 IDF,导致 en 端 row 虚高抢位;
 *    新版用 coverage+meaningfulRatio 与 CJK 路径同口径打分。
 * 3. **惩罚 1/2**：仅当 score > 0 时生效,纯 EN query 不触发 CJK 整段包含惩罚。
 *
 * 关键修复：「修改单聊历史消息 one-to-one c2c single chat message messages」(扩 query)
 *   旧版: enWordHits=0 → 走 CJK 路径 → 自己 700, 对偶 643
 *   新版: CJK 路径独立 → 自己 700, 对偶 643 (**bit-identical**)
 * 纯 EN query: 新版用 coverage+IDF 替代旧 650+30*N,降权泛词。
 */
function semanticAlign(query, title) {
    const qCjk = extractCjkTokens(query);
    const tCjk = extractCjkTokens(title);
    const qEn = extractEnTokens(query);
    const tEn = extractEnTokens(title);
    let score = 0;
    if (qCjk.size > 0) {
        // CJK 路径:与旧版公式 bit-identical
        const m = scoreOneLang(qCjk, tCjk);
        if (m.coverage >= 0.5 && m.meaningfulRatio >= 0.5) {
            score = 500 + Math.round(m.coverage * 120) + Math.round(m.meaningfulRatio * 80);
        }
        else if (m.titleTokenCount >= 3 && m.titleCoverage >= 0.7) {
            score = 620 + Math.round(m.titleCoverage * 60);
        }
        else if (m.coverage >= 0.3 && m.meaningfulRatio >= 0.3) {
            score = 400;
        }
    }
    else if (qEn.size > 0) {
        // EN 路径:仅纯 EN query,引入 IDF 调节(旧版 650+30*N 无 IDF 致虚高)
        const m = scoreOneLang(qEn, tEn);
        if (m.coverage >= 0.5 && m.meaningfulRatio >= 0.5) {
            score = 500 + Math.round(m.coverage * 120) + Math.round(m.meaningfulRatio * 80);
        }
        else if (m.titleTokenCount >= 3 && m.titleCoverage >= 0.7) {
            score = 620 + Math.round(m.titleCoverage * 60);
        }
        else if (m.coverage >= 0.3) {
            // 弱命中:旧版无此分支,给软基分 300-400
            score = 300 + Math.round(m.coverage * 200);
        }
    }
    if (score === 0)
        return 0;
    // 惩罚1:CJK 路径下,query 有明确 CJK 语义但覆盖双低(coverage<0.5 && titleCoverage<0.7),
    // 封顶 400,避免泛词残留抬分。EN 路径不触发。
    if (qCjk.size > 0) {
        const qHasCjk3 = /[\u4e00-\u9fff]{3,}/.test(query);
        if (qHasCjk3) {
            const m = scoreOneLang(qCjk, tCjk);
            if (m.coverage < 0.5 && m.titleCoverage < 0.7) {
                score = Math.min(score, 400);
            }
        }
    }
    // 惩罚2:query 的完整 CJK 整段(≥4 字)「完全包含于」title,但 title 明显更长
    // (多出 ≥3 字独立主题词),说明 title 主题更窄/偏移 → 降权。
    // 例:query「发送单聊消息」vs title「发送单聊消息已读回执」→ 后者多出「已读回执」。
    if (qCjk.size > 0) {
        const qSegments = query.match(/[\u4e00-\u9fff]{3,}/g) ?? [];
        const titleNorm = title.replace(/\s+/g, '');
        const qFullCjk = qSegments.filter((s) => s.length >= 4 && titleNorm.includes(s));
        if (qFullCjk.length > 0) {
            const titleCjkLen = (title.match(/[\u4e00-\u9fff]/g) ?? []).length;
            const queryCjkLen = (query.match(/[\u4e00-\u9fff]/g) ?? []).length;
            const extraCjk = titleCjkLen - queryCjkLen;
            if (extraCjk >= 3) {
                score = Math.max(360, score - 120 * Math.floor(extraCjk / 2));
            }
        }
    }
    return score;
}
/** 兼容入口：原有 normalize 逻辑保留（供 exact-lookup 调用） */
function normalizeE7Text(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff/]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
export function normalizeUrlRowQuery(query) {
    return normalizeE7Text(query);
}
/**
 * 产品无关的 URL 映射行判定：knowledge/<product>/urls/.../xxx.md
 * 供 exact-lookup / l1-enrich / doc-url-resolver 复用，避免各处硬编码 chat/urls。
 */
export function isUrlMappingSource(source) {
    return /knowledge\/[a-z0-9_-]+\/urls\/.+\.md$/i.test(source.replace(/\\/g, '/'));
}
/**
 * 对 URL 映射行打分。
 * 优先级：REST 端点 > API token > 语义词对齐。
 */
export function scoreUrlRow(query, title) {
    loadIdf();
    const restScore = restEndpointHit(query, title);
    const apiScore = restScore > 0 ? 0 : apiTokenHit(query, title);
    const semanticScore = restScore > 0 || apiScore >= 860 ? 0 : semanticAlign(query, title);
    if (restScore > 0) {
        return { score: restScore, matchedBy: 'rest', debug: { restScore, apiScore, semanticScore } };
    }
    if (apiScore > 0) {
        return { score: apiScore, matchedBy: 'api', debug: { restScore, apiScore, semanticScore } };
    }
    if (semanticScore > 0) {
        return { score: semanticScore, matchedBy: 'semantic', debug: { restScore, apiScore, semanticScore } };
    }
    return {
        score: 0,
        matchedBy: 'none',
        debug: { restScore, apiScore, semanticScore },
    };
}
/** 从 chunk body 中提取开头的分组标题（chunker 会把 urls 行的 `##` 分组写成 `### 分组标题` 前缀） */
export function extractSectionTitle(content) {
    const match = content.match(/^\s*###\s+([^\n]+)/);
    return match ? match[1].trim() : '';
}
/**
 * 计算一组分组标题的「共有词」（出现在全部分组标题中的单字/2-gram，无区分度）。
 * 产品无关：对任意 urls 文件的 `##` 分组自动判定，不依赖枚举。
 */
export function computeCommonSectionTokens(sectionTitles) {
    const n = sectionTitles.length;
    if (n === 0)
        return { chars: new Set(), bigrams: new Set() };
    const charFreq = new Map();
    const bigramFreq = new Map();
    for (const title of sectionTitles) {
        const chars = new Set(title.match(/[\u4e00-\u9fff]/g) ?? []);
        const bigrams = new Set();
        for (const seg of title.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
            for (let i = 0; i < seg.length - 1; i += 1)
                bigrams.add(seg.slice(i, i + 2));
        }
        for (const c of chars)
            charFreq.set(c, (charFreq.get(c) ?? 0) + 1);
        for (const b of bigrams)
            bigramFreq.set(b, (bigramFreq.get(b) ?? 0) + 1);
    }
    return {
        chars: new Set([...charFreq].filter(([, v]) => v === n).map(([k]) => k)),
        bigrams: new Set([...bigramFreq].filter(([, v]) => v === n).map(([k]) => k)),
    };
}
/**
 * 判定 query 是否命中分组标题（通用分组语义粗筛）。
 *
 * 规则（混用单字 + 2-gram，至少 2 个任意词 + 至少 1 个区分词）：
 * - 提取 query 与分组标题的中文单字集、2-gram 集。
 * - 排除「共有词」（该文件所有分组都出现的词，如 webhook 里的「回调/相关」），避免其单独触发命中。
 * - 命中条件：query 与分组标题共享「≥1 个区分词」且「≥2 个任意词（区分+共有）」。
 *
 * 例：query「服务端群消息发送前回调」vs 分组「群组系统相关回调」：
 *   共享单字「群/回/调」，排除共有「回/调」后区分词「群」命中，且任意词 3 个 → 命中。
 *   而「在线状态相关回调」只共享共有词「回/调」→ 不命中。
 *
 * 产品无关：对所有产品的 urls 分组都适用，不依赖具体产品词表。
 */
export function queryMatchesSection(query, sectionTitle, commonTokens) {
    const queryChars = new Set(query.match(/[\u4e00-\u9fff]/g) ?? []);
    const queryBigrams = new Set();
    for (const seg of query.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        for (let i = 0; i < seg.length - 1; i += 1)
            queryBigrams.add(seg.slice(i, i + 2));
    }
    const sectionChars = new Set(sectionTitle.match(/[\u4e00-\u9fff]/g) ?? []);
    const sectionBigrams = new Set();
    for (const seg of sectionTitle.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        for (let i = 0; i < seg.length - 1; i += 1)
            sectionBigrams.add(seg.slice(i, i + 2));
    }
    // 共享单字 + 共享 2-gram（2-gram 命中算 2 个词）
    const sharedChar = [...sectionChars].filter((c) => queryChars.has(c));
    const sharedBigram = [...sectionBigrams].filter((b) => queryBigrams.has(b));
    // 任意词（共享单字按 1 个词、共享 2-gram 按 1 个词计；2-gram 与单字不重复计）
    const anyCount = sharedChar.length + sharedBigram.length;
    // 区分词：共享但不在共有词集合里
    const distinctCount = sharedChar.filter((c) => !commonTokens.chars.has(c)).length
        + sharedBigram.filter((b) => !commonTokens.bigrams.has(b)).length;
    return distinctCount >= 1 && anyCount >= 2;
}

import { extractErrorCodes, extractSymbols } from './extractors.js';
function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section';
}
function sourceSlug(source) {
    return source.replace(/\.md$/, '').replace(/[/\\]/g, '-');
}
function trimSliceOffsets(raw, fileStart) {
    const leading = raw.length - raw.trimStart().length;
    const trailing = raw.length - raw.trimEnd().length;
    const char_start = fileStart + leading;
    const char_end = fileStart + raw.length - trailing;
    return { body: raw.slice(leading, raw.length - trailing), char_start, char_end };
}
/** 大块再切阈值（token 估算）：超过则按块类型再切（表格整表入片、否则按段落）。 */
const OVERSIZED_TOKEN_THRESHOLD = 800;
function lineOffsetsOf(lines) {
    const offsets = [];
    let cur = 0;
    for (const line of lines) {
        offsets.push(cur);
        cur += line.length + 1; // +1 for '\n'
    }
    return offsets;
}
/** 表格按行切：表头（含标题行+表头+分隔行）一段，每个数据行一段。连续区间，符合 manifest 按 offset 读 content 的机制。 */
function splitTableRows(body) {
    const lines = body.split('\n');
    const offsets = lineOffsetsOf(lines);
    let sepIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) {
            sepIdx = i;
            break;
        }
    }
    if (sepIdx < 1)
        return [{ text: body, start: 0, end: body.length }];
    const dataIdx = [];
    let sawData = false;
    for (let i = sepIdx + 1; i < lines.length; i++) {
        if (/^\s*\|/.test(lines[i])) {
            dataIdx.push(i);
            sawData = true;
        }
        else if (sawData && lines[i].trim() !== '')
            break;
    }
    if (dataIdx.length === 0)
        return [{ text: body, start: 0, end: body.length }];
    const slices = [];
    const headerEnd = offsets[sepIdx] + lines[sepIdx].length;
    slices.push({ text: body.slice(0, headerEnd), start: 0, end: headerEnd });
    for (const idx of dataIdx) {
        const start = offsets[idx];
        const end = start + lines[idx].length;
        slices.push({ text: body.slice(start, end), start, end });
    }
    return slices;
}
/** 找出 ``` 代码块区间（不要求闭合：未闭合也把剩余视为代码块），切分时跳过区间内的分隔符，避免切碎函数/可运行示例。 */
function codeFenceRanges(body) {
    const ranges = [];
    const fenceRe = /```[^\n]*\n[\s\S]*?(?:```|$)/g;
    let fm;
    while ((fm = fenceRe.exec(body)) !== null) {
        ranges.push([fm.index, fm.index + fm[0].length]);
    }
    return ranges;
}
function inCodeBlock(pos, ranges) {
    for (const [s, e] of ranges) {
        if (pos >= s && pos < e)
            return true;
    }
    return false;
}
/** 段落切：按空行切，保持段落完整；代码块（```）内部不切分。 */
function splitParagraphs(body) {
    const slices = [];
    const fences = codeFenceRanges(body);
    const sep = /\n\s*\n/g;
    let prev = 0;
    let m;
    const push = (start, end) => {
        const text = body.slice(start, end);
        if (text.trim())
            slices.push({ text, start, end });
    };
    while ((m = sep.exec(body)) !== null) {
        if (inCodeBlock(m.index, fences))
            continue; // 代码块内的空行不切分
        push(prev, m.index);
        prev = sep.lastIndex;
    }
    push(prev, body.length);
    return slices.length > 1 ? slices : [{ text: body, start: 0, end: body.length }];
}
/**
 * 把 body 按「表格区 / 非表格区」切成互不重叠、完整覆盖的片段。
 *
 * 历史缺陷：旧实现只取文中**第一张**表格的行切片，表格之后的正文（示例代码块、
 * 后续 `###` 小节、后续表格）全部落在切片区间之外 → 整段丢失且不报错。
 * 实测「发单聊消息之后回调」2238 字符被丢弃（含 SendMsgResult 字段说明），
 * 导致该字段在任何 chunk 里都搜不到。
 */
function segmentByTable(body) {
    const lines = body.split('\n');
    const offsets = lineOffsetsOf(lines);
    const isSep = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l);
    const isRow = (l) => /^\s*\|/.test(l);
    const slices = [];
    let cursor = 0; // 已处理的字符位置
    for (let i = 0; i < lines.length; i += 1) {
        if (!isSep(lines[i]) || i === 0 || !isRow(lines[i - 1]))
            continue;
        // 表格起点：表头行 i-1（若表头前一行也是数据行，则从连续行的最上方开始）
        let startIdx = i - 1;
        while (startIdx > 0 && isRow(lines[startIdx - 1]))
            startIdx -= 1;
        let endIdx = i;
        while (endIdx + 1 < lines.length && isRow(lines[endIdx + 1]))
            endIdx += 1;
        const tableStart = offsets[startIdx];
        const tableEnd = offsets[endIdx] + lines[endIdx].length;
        if (tableStart < cursor)
            continue; // 已覆盖
        // 表格前的非表格区
        if (tableStart > cursor) {
            slices.push(...splitParagraphs(body.slice(cursor, tableStart)).map((s) => ({
                text: s.text, start: s.start + cursor, end: s.end + cursor,
            })));
        }
        slices.push({ text: body.slice(tableStart, tableEnd), start: tableStart, end: tableEnd });
        cursor = tableEnd;
        i = endIdx;
    }
    if (cursor < body.length) {
        slices.push(...splitParagraphs(body.slice(cursor)).map((s) => ({
            text: s.text, start: s.start + cursor, end: s.end + cursor,
        })));
    }
    return slices.length ? slices : [{ text: body, start: 0, end: body.length }];
}
/**
 * 表格按行切的字符门槛：超过此长度的表格才按行切。
 *
 * 1.8.0 发布前回归已验证「BM25 切得越碎越难召回」：行级 chunk 只有 ~88 字符，
 * 单行缺少表头与上下文，BM25 词项太少、docLength 归一化后噪声占比高，
 * 反而把完整语义段压下去。因此默认整表入片，只有大表（整表会形成超大 chunk、
 * 被长度归一化惩罚）才退化为按行切。
 */
const TABLE_ROW_SPLIT_MIN_CHARS = 2000;
function splitOversized(body, tableSplitMode = 'by_row') {
    if (estimateTextTokens(body) <= OVERSIZED_TOKEN_THRESHOLD)
        return [{ text: body, start: 0, end: body.length }];
    const segments = segmentByTable(body);
    if (segments.length > 1) {
        const slices = [];
        for (const seg of segments) {
            const isTable = /^\s*\|/.test(seg.text);
            if (!isTable) {
                slices.push(seg);
                continue;
            }
            // 整表入片（默认）：保住表头 + 行的完整语义，避免 BM25 碎片化召回退化。
            if (tableSplitMode === 'whole_table' || seg.text.length <= TABLE_ROW_SPLIT_MIN_CHARS) {
                slices.push(seg);
                continue;
            }
            // 大表：整表会形成超大 chunk 被长度归一化压制，退化为按行切（行自带表头前缀语义有限，
            // 但大表本身每行即独立语义项，如错误码表/限制表）。
            const rows = splitTableRows(seg.text);
            if (rows.length <= 1) {
                slices.push(seg);
                continue;
            }
            for (const row of rows) {
                slices.push({ text: row.text, start: row.start + seg.start, end: row.end + seg.start });
            }
        }
        return slices;
    }
    return splitParagraphs(body);
}
/** 子块向量窗口上限（token）：bge-small 输入窗口 512，子块嵌入需 ≤512 才不截断。 */
const CHILD_MAX_TOKENS = 512;
/** 超长段落按行累计切分（到 ~CHILD_MAX_TOKENS 封口），不切断代码块保护、不劈表格行。 */
function splitByLines(body) {
    const lines = body.split('\n');
    const offsets = lineOffsetsOf(lines);
    const slices = [];
    let buf = '';
    let start = 0;
    let end = 0;
    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (!buf)
            start = offsets[i];
        const candidate = buf ? `${buf}\n${line}` : line;
        if (buf && estimateTextTokens(candidate) > CHILD_MAX_TOKENS) {
            // 加入此行会超 512：先封口当前 buf，再以本行开新片段
            slices.push({ text: buf, start, end });
            buf = line;
            start = offsets[i];
        }
        else {
            buf = candidate;
        }
        end = offsets[i] + line.length;
    }
    if (buf)
        slices.push({ text: buf, start, end });
    return slices.length > 1 ? slices : [{ text: body, start: 0, end: body.length }];
}
/**
 * 子块切分：父块正文按段落/表格行组切，单块 ≤512 token，不切断空行边界、代码块、表格行。
 * 供 build-vectors 临时调用（向量构建中间产物，不写 manifest），解决「父块 >512 token 向量只嵌前 512」的截断。
 */
export function splitChildChunks(parentContent, parentId, parentCharStart) {
    if (estimateTextTokens(parentContent) <= CHILD_MAX_TOKENS) {
        return [{ parent_id: parentId, char_start: parentCharStart, char_end: parentCharStart + parentContent.length, text: parentContent }];
    }
    const segments = splitParagraphs(parentContent);
    const flat = [];
    for (const seg of segments) {
        if (estimateTextTokens(seg.text) <= CHILD_MAX_TOKENS) {
            flat.push(seg);
            continue;
        }
        const table = splitTableRows(seg.text);
        if (table.length > 1)
            flat.push(...table);
        else
            flat.push(...splitByLines(seg.text));
    }
    // 累计相邻片段到 ≤512 token，合并过碎的子块
    const merged = [];
    let buf = null;
    for (const seg of flat) {
        if (!buf) {
            buf = { text: seg.text, start: seg.start, end: seg.end };
            continue;
        }
        if (estimateTextTokens(`${buf.text}\n${seg.text}`) <= CHILD_MAX_TOKENS) {
            buf.text = `${buf.text}\n${seg.text}`;
            buf.end = seg.end;
        }
        else {
            merged.push(buf);
            buf = { text: seg.text, start: seg.start, end: seg.end };
        }
    }
    if (buf)
        merged.push(buf);
    return merged.map((seg) => ({
        parent_id: parentId,
        char_start: parentCharStart + seg.start,
        char_end: parentCharStart + seg.end,
        text: seg.text,
    }));
}
function splitByHeading(content, level, prefixTitle) {
    const regex = new RegExp(`^${'#'.repeat(level)}\\s+(.+)$`, 'gm');
    const sections = [];
    const matches = [...content.matchAll(regex)];
    if (matches.length === 0) {
        return [{ title: prefixTitle ?? 'full', raw: content, start: 0, prefix: false }];
    }
    // 保留首个标题之前的内容（根因修复）：此前这段被直接丢弃，导致「答案在正文」检索不到。
    const firstStart = matches[0].index ?? 0;
    if (firstStart > 0 && content.slice(0, firstStart).trim()) {
        sections.push({ title: prefixTitle ?? '前言', raw: content.slice(0, firstStart), start: 0, prefix: true });
    }
    for (let i = 0; i < matches.length; i += 1) {
        const match = matches[i];
        const start = match.index ?? 0;
        const end = i + 1 < matches.length ? (matches[i + 1].index ?? content.length) : content.length;
        sections.push({
            title: match[1].trim(),
            raw: content.slice(start, end),
            start,
            prefix: false,
        });
    }
    return sections;
}
function isFaqLike(source, content) {
    return /faq|error-code|error_code|TXLiteAVCode|unsupported-features/i.test(source)
        || (content.match(/^###\s+/gm) ?? []).length >= 3;
}
function shouldForceSectionSplit(source) {
    return source.endsWith('unsupported-features.md');
}
function isBestPracticeSource(source) {
    return /\/best-practice\//i.test(source.replace(/\\/g, '/'));
}
const BEST_PRACTICE_SINGLE_CHUNK_MAX_TOKENS = 4096;
const LEGACY_SINGLE_CHUNK_CHAR_THRESHOLD = 2048;
function estimateTextTokens(text) {
    // 语言感知估算：英文按词长（WordPiece 平均每 ~3.5 字符 1 token，长词向上取整，至少 1 token）；
    // 中文按字（bge 中文 1 字 1 token）；数字按 0.5 token/字符；空格/标点忽略（合并进相邻词）。
    // 旧「按词数 ×1.3」低估技术文档长词（TRTCCloud 等术语 WordPiece 实际 1 词 2-3 token），
    // 实测 en 总 token 仅 zh 0.63 倍（2.23M vs 3.53M）、en chunk 切分偏少偏大；按词长后 en/zh 每文件 token ≈0.98 对齐。
    let enTokens = 0;
    for (const word of text.match(/[A-Za-z]+/g) ?? []) {
        enTokens += Math.max(1, Math.ceil(word.length / 3.5));
    }
    const cjkCharCount = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
    const digitCount = (text.match(/[0-9]/g) ?? []).length;
    return enTokens + cjkCharCount + digitCount * 0.5;
}
function estimateMarkdownTokens(content) {
    let tokens = 0;
    let cursor = 0;
    const codeBlockRE = /```[\s\S]*?```/g;
    for (const match of content.matchAll(codeBlockRE)) {
        const start = match.index ?? cursor;
        const end = start + match[0].length;
        tokens += estimateTextTokens(content.slice(cursor, start));
        tokens += match[0].length * 1.3;
        cursor = end;
    }
    if (cursor < content.length) {
        tokens += estimateTextTokens(content.slice(cursor));
    }
    return tokens;
}
function containsCodeBlock(body) {
    return /```[\s\S]*?```/.test(body);
}
function extractApiNames(body) {
    const names = new Set();
    const upperNoise = new Set(['SDK', 'API', 'HTTP', 'HTTPS', 'JSON']);
    for (const match of body.matchAll(/`([a-z][A-Za-z0-9_]{2,})`/g)) {
        names.add(match[1]);
    }
    for (const match of body.matchAll(/\b([a-z]+[A-Z][A-Za-z0-9_]*)\b/g)) {
        names.add(match[1]);
    }
    for (const match of body.matchAll(/\b([A-Z][A-Za-z0-9_]*\.[a-zA-Z_][A-Za-z0-9_]*)\b/g)) {
        names.add(match[1]);
    }
    // PascalCase 标识符（含内部大写段）：SendMsgResult / McuLayoutVolume / StartAIConversation。
    // 旧规则只覆盖「小写开头 + 内部大写」，这类以大写开头的字段名/结构名长期抽不到，
    // 导致同名 query 只能靠 BM25 粘连小写词命中。
    for (const match of body.matchAll(/\b([A-Z][a-z0-9]+(?:[A-Z][a-z0-9]*){1,})\b/g)) {
        names.add(match[1]);
    }
    for (const match of body.matchAll(/\b(I[A-Z][A-Za-z0-9_]*)\b/g)) {
        names.add(match[1]);
    }
    for (const match of body.matchAll(/\b([A-Z][A-Za-z0-9_]*\.[A-Z_][A-Z0-9_]*)\b/g)) {
        names.add(match[1]);
    }
    for (const match of body.matchAll(/\b([A-Z_]{3,})\b/g)) {
        const token = match[1];
        if (!upperNoise.has(token))
            names.add(token);
    }
    return [...names].slice(0, 90);
}
function extractKeyPhrases(title, body) {
    const firstParagraph = body
        .replace(/^#{1,6}\s+.+$/gm, '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .find(Boolean) ?? '';
    const phrases = [title, firstParagraph]
        .flatMap((part) => part.split(/[，。；;\n]/))
        .map((s) => s.trim())
        .filter((s) => s.length >= 2)
        .slice(0, 8);
    return [...new Set(phrases)];
}
function buildChunk(meta, source, title, body, id, char_start, char_end, extra) {
    const api_names = extractApiNames(body);
    // 自洽元数据（单片要能识别适用产品/端/版本）：把 framework/platform/variant 注入 key_phrases，
    // 让检索侧能识别「适用端」，命中后无需依赖未召回的上下文也能判断是否适用。
    const metaFrameworks = (meta.framework ?? []).filter((fw) => fw && fw !== '*');
    const metaPlatform = meta.platform;
    const metaVariant = meta.variant;
    const key_phrases = [
        ...extractKeyPhrases(title, body),
        ...metaFrameworks,
        ...(metaPlatform ? [metaPlatform] : []),
        ...(metaVariant ? [metaVariant] : []),
    ];
    return {
        id,
        product: meta.product,
        framework: meta.framework,
        types: meta.types,
        scenario: meta.scenario,
        variant: meta.variant,
        platform: meta.platform,
        scope: meta.scope,
        feature_domain: meta.feature_domain,
        meta_source: meta.meta_source,
        meta_override_fields: meta.meta_override_fields,
        title,
        source,
        content: body,
        symbols: extractSymbols(body),
        error_codes: extractErrorCodes(body),
        ...(api_names.length ? { api_names } : {}),
        ...(containsCodeBlock(body) ? { contains_code: true } : {}),
        ...(key_phrases.length ? { key_phrases } : {}),
        ...(extra ?? {}),
        char_start,
        char_end,
    };
}
export function chunkMarkdown(source, content, meta, options) {
    const chunks = [];
    const baseSlug = sourceSlug(source);
    const baseOffset = options?.baseOffset ?? 0;
    const policyRule = options?.policyRule;
    const forceSectionSplit = shouldForceSectionSplit(source);
    const isBestPractice = isBestPracticeSource(source);
    const estimatedTokenCount = estimateMarkdownTokens(content);
    const defaultSplitThreshold = options?.defaultSplitTokenThreshold ?? LEGACY_SINGLE_CHUNK_CHAR_THRESHOLD;
    const docExtra = {
        doc_title: options?.docTitle,
        ...(options?.navPath?.length ? { nav_path: options.navPath } : {}),
        ...(options?.tags?.length ? { tags: options.tags } : {}),
    };
    const singleChunkMaxTokens = policyRule?.max_tokens
        ?? (isBestPractice ? BEST_PRACTICE_SINGLE_CHUNK_MAX_TOKENS : undefined);
    const shouldSingleChunk = policyRule?.strategy === 'single_chunk_per_file'
        || (isBestPractice && !policyRule?.strategy);
    if (shouldSingleChunk && singleChunkMaxTokens !== undefined && estimatedTokenCount <= singleChunkMaxTokens) {
        const { body, char_start, char_end } = trimSliceOffsets(content, baseOffset);
        if (!body)
            return chunks;
        chunks.push(buildChunk(meta, source, pathBasename(source), body, `${baseSlug}#full`, char_start, char_end, { ...docExtra }));
        return chunks;
    }
    if (!shouldSingleChunk
        && !forceSectionSplit
        && estimatedTokenCount < (policyRule?.split_token_threshold ?? defaultSplitThreshold)) {
        const { body, char_start, char_end } = trimSliceOffsets(content, baseOffset);
        if (!body)
            return chunks;
        chunks.push(buildChunk(meta, source, pathBasename(source), body, `${baseSlug}#full`, char_start, char_end, { ...docExtra }));
        return chunks;
    }
    const fallbackStrategy = policyRule?.split_fallback ?? policyRule?.strategy ?? 'by_h2';
    // isFaqLike 的「H3 ≥ 3」启发式在 API 参考表（客户端API）类文档会误命中（这些文档用 H3 子分类回调接口，
    // 不属于 FAQ）。显式声明 strategy/split_fallback 时优先按用户意图走：by_h2 → level=2，by_h3 → level=3。
    // 仅当 policyRule 缺失/未指定 strategy 时才回退 isFaqLike 启发式。
    const level = forceSectionSplit
        ? 3
        : fallbackStrategy === 'by_h3'
            ? 3
            : fallbackStrategy === 'by_h2'
                ? 2
                : (isFaqLike(source, content) ? 3 : 2);
    const docTitle = options?.docTitle;
    // 错误码表等类型按 policy 走「整表入片」：table_split=whole_table 时不按行切表格。
    const tableSplitMode = (policyRule?.table_split ?? 'by_row');
    const emitSection = (title, raw, start) => {
        const { body, char_start } = trimSliceOffsets(raw, start + baseOffset);
        if (!body)
            return;
        const headingSlug = slugify(title);
        const fallbackMeta = shouldSingleChunk && singleChunkMaxTokens !== undefined && estimatedTokenCount > singleChunkMaxTokens
            ? {
                split_reason: 'exceed_token_threshold',
                original_file_token_count: Math.ceil(estimatedTokenCount),
                aggregable: policyRule?.split_aggregable ?? isBestPractice,
                parent_h2: title,
            }
            : undefined;
        // 大块再切：超过阈值按块类型切（表格按行、否则按段落），子块共享标题作为上下文。
        // 错误码表等按 policy table_split=whole_table 整表入片（不按行切），仍受代码块保护。
        const slices = splitOversized(body, tableSplitMode);
        slices.forEach((slice, i) => {
            const chunkId = slices.length === 1 ? `${baseSlug}#${headingSlug}` : `${baseSlug}#${headingSlug}-${i}`;
            chunks.push(buildChunk(meta, source, title, slice.text, chunkId, char_start + slice.start, char_start + slice.end, { ...fallbackMeta, ...docExtra }));
        });
    };
    const sections = splitByHeading(content, level, docTitle);
    for (const section of sections) {
        // FAQ 类按 H3 切分时，首个 ### 之前通常是 H2 结构（如「业务特性限制」表、多个 ## API 表），
        // 再按 H2 切一刀，既保留前置内容，又避免整段前置塞进一个超大 chunk。
        if (section.prefix && level === 3) {
            for (const sub of splitByHeading(section.raw, 2, docTitle)) {
                emitSection(sub.title, sub.raw, sub.start);
            }
            continue;
        }
        emitSection(section.title, section.raw, section.start);
    }
    // 小块合并：小于约 100 字符的 chunk 合并到相邻同 source chunk
    // （表头 chunk 与单行表格数据行除外——数据行聚合会形成超大 chunk，实测使用限制.md
    //  业务特性限制表 10 行聚成 3615 字符单 chunk，docLength 达均值 9.4 倍，BM25 归一化
    //  后被 698 字符短 chunk 压制；行片化后答案行回到 rank1-3）。
    const merged = mergeSmallChunks(chunks, MIN_CHUNK_CHARS, isTableHeaderChunk);
    return merged.length > 0
        ? merged
        : chunkMarkdown(source, content.slice(0, defaultSplitThreshold), meta, {
            baseOffset,
            policyRule,
            defaultSplitTokenThreshold: defaultSplitThreshold,
        });
}
const MIN_CHUNK_CHARS = 100;
/** 识别「表头 chunk」：含 markdown 表格分隔行 `| --- |` 形式，避免合并时把表头塞进数据行。 */
function isTableHeaderChunk(chunk) {
    return /^\s*\|[\s:|-]+\|\s*$/m.test(chunk.content);
}
/** 识别「单行表格数据行」chunk（splitTableRows 产的行 slice）：`|xxx|yyy|` 整体单行、无换行。
 *  此类 chunk 不参与小块合并——数据行各为独立语义项（一行一个限制项），
 *  聚合反而形成 docLength 虚高的超大 chunk 压制检索。 */
function isTableRowChunk(chunk) {
    const c = chunk.content;
    return !c.includes('\n') && /^\s*\|.*\|\s*$/.test(c) && !/^\s*\|[\s:|-]+\|\s*$/.test(c);
}
/** 合并同 source 的小 chunk 到前一个，保留前一个的 id/title，扩展 char_end 区间。
 * manifest 不存 content（运行时按 char_start/char_end 读 md），扩展 char_end 即可让运行时读到合并内容。 */
function mergeSmallChunks(chunks, minChars, isHeader) {
    if (chunks.length < 2)
        return chunks;
    const result = [];
    for (const chunk of chunks) {
        const last = result[result.length - 1];
        if (last
            && last.source === chunk.source
            && (last.content.length < minChars || chunk.content.length < minChars)
            && !isHeader(last)
            && !isHeader(chunk)
            && !isTableRowChunk(last)
            && !isTableRowChunk(chunk)) {
            // 合并到 last：扩展 char_end，content 追加以便 build 期信息（如 symbols）覆盖合并区间。
            last.char_end = chunk.char_end;
            last.content = `${last.content}\n${chunk.content}`;
        }
        else {
            result.push(chunk);
        }
    }
    return result;
}
export function toManifestChunk(chunk) {
    const { content: _content, ...manifestChunk } = chunk;
    return manifestChunk;
}
function pathBasename(source) {
    const parts = source.split('/');
    const file = parts[parts.length - 1] ?? source;
    return file.replace(/\.md$/, '');
}

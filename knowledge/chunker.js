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
function splitByHeading(content, level) {
    const regex = new RegExp(`^${'#'.repeat(level)}\\s+(.+)$`, 'gm');
    const sections = [];
    const matches = [...content.matchAll(regex)];
    if (matches.length === 0) {
        return [{ title: 'full', raw: content, start: 0 }];
    }
    for (let i = 0; i < matches.length; i += 1) {
        const match = matches[i];
        const start = match.index ?? 0;
        const end = i + 1 < matches.length ? (matches[i + 1].index ?? content.length) : content.length;
        sections.push({
            title: match[1].trim(),
            raw: content.slice(start, end),
            start,
        });
    }
    return sections;
}
function isFaqLike(source, content) {
    return /faq|error-code|error_code|TXLiteAVCode|unsupported-features/i.test(source)
        || (content.match(/^###\s+/gm) ?? []).length >= 3;
}
function shouldForceSectionSplit(source, meta) {
    return source.endsWith('unsupported-features.md') || meta.doc_kind === 'unsupported_summary';
}
function isBestPracticeSource(source) {
    return /\/best-practice\//i.test(source.replace(/\\/g, '/'));
}
const BEST_PRACTICE_SINGLE_CHUNK_MAX_TOKENS = 4096;
const LEGACY_SINGLE_CHUNK_CHAR_THRESHOLD = 2048;
function estimateTextTokens(text) {
    let tokens = 0;
    for (const ch of text) {
        tokens += /[A-Za-z]/.test(ch) ? 0.5 : 1;
    }
    return tokens;
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
function isChatUrlMapping(source) {
    return /knowledge\/chat\/urls\/.+\.md$/i.test(source.replace(/\\/g, '/'));
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
    const key_phrases = extractKeyPhrases(title, body);
    return {
        id,
        corpus: meta.corpus,
        product: meta.product,
        framework: meta.framework,
        types: meta.types,
        scenario: meta.scenario,
        variant: meta.variant,
        scope: meta.scope,
        doc_kind: meta.doc_kind,
        capability_status: meta.capability_status,
        retrievable_scope: meta.retrievable_scope,
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
function parseUrlMappingRows(content, baseOffset) {
    const lines = content.split('\n');
    let sectionTitle = '';
    let offset = baseOffset;
    const rows = [];
    for (const line of lines) {
        const lineStart = offset;
        const lineEnd = offset + line.length;
        const heading = line.match(/^#{2,3}\s+(.+)$/);
        if (heading) {
            sectionTitle = heading[1].trim();
            offset = lineEnd + 1;
            continue;
        }
        const rowMatch = line.match(/^\|\s*([^|]+?)\s*\|\s*`?(https?:\/\/[^|`\s]+)`?\s*\|/);
        if (rowMatch) {
            const label = rowMatch[1].trim();
            if (label && label !== '子问题' && !/^-+$/.test(label)) {
                rows.push({
                    label,
                    url: rowMatch[2],
                    sectionTitle,
                    lineStart,
                    lineEnd,
                });
            }
        }
        offset = lineEnd + 1;
    }
    return rows;
}
function chunkUrlMapping(source, content, meta, baseOffset) {
    const rows = parseUrlMappingRows(content, baseOffset);
    if (rows.length === 0) {
        return [];
    }
    const baseSlug = sourceSlug(source);
    return rows.map((row) => {
        const sectionLine = row.sectionTitle ? `### ${row.sectionTitle}\n\n` : '';
        const body = `${sectionLine}| 子问题 | 目标文档 |\n|--------|---------|\n| ${row.label} | \`${row.url}\` |`;
        const headingSlug = slugify(row.label);
        return buildChunk(meta, source, row.label, body, `${baseSlug}#${headingSlug}`, row.lineStart, row.lineEnd);
    });
}
export function chunkMarkdown(source, content, meta, options) {
    const chunks = [];
    const baseSlug = sourceSlug(source);
    const baseOffset = options?.baseOffset ?? 0;
    const policyRule = options?.policyRule;
    if (isChatUrlMapping(source) || policyRule?.strategy === 'by_row') {
        const urlChunks = chunkUrlMapping(source, content, meta, baseOffset);
        if (urlChunks.length > 0) {
            return urlChunks;
        }
    }
    const forceSectionSplit = shouldForceSectionSplit(source, meta);
    const isBestPractice = isBestPracticeSource(source);
    const estimatedTokenCount = estimateMarkdownTokens(content);
    const defaultSplitThreshold = options?.defaultSplitTokenThreshold ?? LEGACY_SINGLE_CHUNK_CHAR_THRESHOLD;
    const singleChunkMaxTokens = policyRule?.max_tokens
        ?? (isBestPractice ? BEST_PRACTICE_SINGLE_CHUNK_MAX_TOKENS : undefined);
    const shouldSingleChunk = policyRule?.strategy === 'single_chunk_per_file'
        || (isBestPractice && !policyRule?.strategy);
    if (shouldSingleChunk && singleChunkMaxTokens !== undefined && estimatedTokenCount <= singleChunkMaxTokens) {
        const { body, char_start, char_end } = trimSliceOffsets(content, baseOffset);
        if (!body)
            return chunks;
        chunks.push(buildChunk(meta, source, pathBasename(source), body, `${baseSlug}#full`, char_start, char_end));
        return chunks;
    }
    if (!shouldSingleChunk
        && !forceSectionSplit
        && content.length < (policyRule?.split_token_threshold ?? defaultSplitThreshold)) {
        const { body, char_start, char_end } = trimSliceOffsets(content, baseOffset);
        if (!body)
            return chunks;
        chunks.push(buildChunk(meta, source, pathBasename(source), body, `${baseSlug}#full`, char_start, char_end));
        return chunks;
    }
    const fallbackStrategy = policyRule?.split_fallback ?? policyRule?.strategy ?? 'by_h2';
    const level = forceSectionSplit
        ? 3
        : fallbackStrategy === 'by_h3'
            ? 3
            : (isFaqLike(source, content) ? 3 : 2);
    const sections = splitByHeading(content, level);
    for (const section of sections) {
        const { body, char_start, char_end } = trimSliceOffsets(section.raw, section.start + baseOffset);
        if (!body)
            continue;
        const headingSlug = slugify(section.title);
        const fallbackMeta = shouldSingleChunk && singleChunkMaxTokens !== undefined && estimatedTokenCount > singleChunkMaxTokens
            ? {
                split_reason: 'exceed_token_threshold',
                original_file_token_count: Math.ceil(estimatedTokenCount),
                aggregable: policyRule?.split_aggregable ?? isBestPractice,
                parent_h2: section.title,
            }
            : undefined;
        chunks.push(buildChunk(meta, source, section.title, body, `${baseSlug}#${headingSlug}`, char_start, char_end, fallbackMeta));
    }
    return chunks.length > 0
        ? chunks
        : chunkMarkdown(source, content.slice(0, defaultSplitThreshold), meta, {
            baseOffset,
            policyRule,
            defaultSplitTokenThreshold: defaultSplitThreshold,
        });
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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** 控制台/购买页等不适合作为「参考文档」的链接 */
const NOISE_URL_RE = /console\.cloud\.tencent|buy\.cloud\.tencent|account\.renewal|edu\/learning/i;
const PREFERRED_DOC_HOST_RE = /trtc\.io|cloud\.tencent\.com|web\.sdk\.qcloud\.com|github\.com\/Tencent(?:Cloud|RTC)/i;
const LOCALHOST_URL_RE = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\b)/i;
let cachedSourceUrlMap = null;
function loadSourceUrlMap() {
    if (cachedSourceUrlMap)
        return cachedSourceUrlMap;
    const mapPath = path.resolve(__dirname, '../resource/index/doc-source-urls.json');
    if (!fs.existsSync(mapPath)) {
        cachedSourceUrlMap = {};
        return cachedSourceUrlMap;
    }
    cachedSourceUrlMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    return cachedSourceUrlMap;
}
function normalizeUrl(raw) {
    return raw.replace(/[.,;)\]]+$/, '').trim();
}
function isUsefulDocUrl(url) {
    if (!/^https?:\/\//i.test(url))
        return false;
    if (NOISE_URL_RE.test(url))
        return false;
    if (LOCALHOST_URL_RE.test(url))
        return false;
    return true;
}
/** 从 markdown 正文中提取可参考的官网链接（优先 cloud.tencent / web.sdk.qcloud） */
export function extractUrlsFromContent(content, max = 3) {
    const found = [];
    const preferred = [];
    for (const match of content.matchAll(/https?:\/\/[^\s`|)\]"'>]+/g)) {
        const url = normalizeUrl(match[0]);
        if (!isUsefulDocUrl(url))
            continue;
        if (PREFERRED_DOC_HOST_RE.test(url)) {
            if (!preferred.includes(url))
                preferred.push(url);
        }
        else if (!found.includes(url)) {
            found.push(url);
        }
    }
    const merged = [...preferred, ...found];
    return merged.slice(0, max);
}
/** L1 URL 映射 chunk：表格行中的目标文档 URL */
export function extractUrlMappingPrimaryUrl(content) {
    const row = content.match(/\|\s*[^|]+\s*\|\s*`?(https?:\/\/[^|`\s]+)`?\s*\|/);
    return row?.[1] ? normalizeUrl(row[1]) : null;
}
/** 产品无关的 URL 映射行判定：knowledge/<product>/urls/... */
function isUrlMappingSource(source) {
    return /knowledge\/[a-z0-9_-]+\/urls\/.+\.md$/i.test(source.replace(/\\/g, '/'));
}
const RTCENGINE_WEB_API_SOURCE = 'knowledge/rtcengine/web/api.md';
const RTCENGINE_WEB_API_BASE_URL = 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/TRTC.html';
/** api.md 中的非方法标题（示例/成员枚举/类型定义等），不作为锚点生成 */
const RTCENGINE_WEB_API_NON_METHOD_RE = /^(?:Example|Members|Type|Definitions)$/i;
/**
 * rtcengine/web/api.md 的 API 章节 chunk（如 `### TRTC.setCurrentSpeaker` / `### setCurrentSpeaker`）
 * 生成稳定参考链接：`.../TRTC.html#.setCurrentSpeaker`
 * 兼容两种标题格式：静态方法带 `TRTC.` 前缀，实例方法不带前缀。
 */
function resolveRtcengineWebApiUrl(source, content) {
    if (source !== RTCENGINE_WEB_API_SOURCE)
        return null;
    const methodMatch = content.match(/^###\s+(?:TRTC\.)?([A-Za-z0-9_]+)/m);
    if (methodMatch?.[1] && !RTCENGINE_WEB_API_NON_METHOD_RE.test(methodMatch[1])) {
        return `${RTCENGINE_WEB_API_BASE_URL}#.${methodMatch[1]}`;
    }
    // 未解析到具体方法时回退到类文档首页，避免误用整篇正文里无关 URL。
    return RTCENGINE_WEB_API_BASE_URL;
}
/**
 * 为检索 fragment 解析可参考的官网 URL（去重、按优先级）。
 * 1. rtcengine/web/api.md：优先按 API 标题生成锚点 URL（例如 #.setCurrentSpeaker）
 * 2. sync-manifest 落盘的 localPath → 官网 URL（rtcengine 等）
 * 3. L1 URL 映射行内目标 URL
 * 4. 本地文档正文中的官网链接
 */
export function resolveFragmentDocUrls(source, content, fullSourceContent) {
    const normalized = source.replace(/\\/g, '/');
    const rtcengineWebApiUrl = resolveRtcengineWebApiUrl(normalized, content);
    if (rtcengineWebApiUrl) {
        return [rtcengineWebApiUrl];
    }
    const urls = [];
    const canonical = loadSourceUrlMap()[normalized];
    if (canonical)
        urls.push(canonical);
    if (isUrlMappingSource(normalized)) {
        const primary = extractUrlMappingPrimaryUrl(content);
        if (primary && !urls.includes(primary))
            urls.push(primary);
        return urls;
    }
    const collect = (text) => {
        for (const url of extractUrlsFromContent(text)) {
            if (!urls.includes(url))
                urls.push(url);
        }
    };
    collect(content);
    if (urls.length === 0 && fullSourceContent && fullSourceContent !== content) {
        collect(fullSourceContent);
    }
    return urls.slice(0, 3);
}
/** 从 fragments 汇总去重后的参考链接列表（按 fragment 相关度排序）。
 * 规则：每个 fragment 仅取一个参考链接（优先 doc_urls[0]），避免 1 个片段膨胀出多个 references。 */
export function buildReferences(fragments) {
    const refs = [];
    const seen = new Set();
    for (const fragment of fragments) {
        const primaryUrl = fragment.doc_urls.find((u) => isUsefulDocUrl(u));
        if (!primaryUrl)
            continue;
        if (seen.has(primaryUrl))
            continue;
        seen.add(primaryUrl);
        refs.push({
            rank: refs.length + 1,
            title: fragment.title,
            url: primaryUrl,
            source: fragment.source,
        });
    }
    return refs;
}
function coerceHttpUrl(value) {
    if (typeof value !== 'string')
        return null;
    const normalized = value.replace(/\\/g, '/').trim();
    if (!normalized.startsWith('http'))
        return null;
    return normalized;
}
function resolveManifestDocUrl(entry) {
    return coerceHttpUrl(entry.ref) ?? coerceHttpUrl(entry.nodeId);
}
/** build 时从 sync-manifest 生成 localPath → 官网 URL 映射 */
export function buildDocSourceUrlMap(syncManifestPath) {
    if (!fs.existsSync(syncManifestPath))
        return {};
    const manifest = JSON.parse(fs.readFileSync(syncManifestPath, 'utf-8'));
    const map = {};
    const entries = manifest.entries ?? {};
    for (const entry of Object.values(entries)) {
        const url = resolveManifestDocUrl(entry);
        if (url && entry.localPath) {
            map[entry.localPath.replace(/\\/g, '/')] = url;
        }
    }
    for (const [localPath, nodeId] of Object.entries(manifest.byLocalPath ?? {})) {
        const normalized = localPath.replace(/\\/g, '/');
        if (map[normalized])
            continue;
        const url = resolveManifestDocUrl(entries[nodeId] ?? { nodeId });
        if (url)
            map[normalized] = url;
    }
    return map;
}

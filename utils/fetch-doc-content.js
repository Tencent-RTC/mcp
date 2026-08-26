/**
 * fetch-doc-content.ts
 *
 * 在命中 chat/urls L1 URL 映射行时，由 server 内部 fetch 官网目标文档并清洗成
 * markdown 返回给 AI，避免 AI 自行联网抓取（不可靠、拿到的还是整页 HTML）。
 *
 * 设计要点：
 * - 白名单域名：仅允许 fetch 我们自己的 urls 映射里出现的官方域名，防 SSRF。
 * - Node 22 原生 fetch 会自动解 gzip（解决 cloud.tencent.com 返回 gzip 导致乱码的问题）。
 * - 内部分流函数 fetch 按 hostname 选策略：
 *     - trtc.io（en 端 urls 主域名）：`url + '.md'` 直拿 text/markdown，跳过 cheerio 清洗
 *     - 其他：cheerio + turndown 清洗 HTML（cloud.tencent.com / web.sdk.qcloud.com）
 * - 内存缓存 + 超时 + 失败兜底（返回 null，不阻断原有检索）。
 * - 对外函数 fetchDocContent 签名不变（l1-enrich 调用方无感知）。
 * - 缓存 key 始终用原 URL（不带 .md 后缀），避免缓存 key 污染。
 */
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
/**
 * 白名单域名：只允许这些域名的文档页被 fetch。
 * 与 zh/resource/knowledge/chat/urls/ 和 en/resource/knowledge/chat/urls/ 下的映射保持一致。
 */
const ALLOWED_HOSTS = new Set([
    'cloud.tencent.com',
    'web.sdk.qcloud.com',
    'trtc.io',
]);
/**
 * 走"url + '.md' 直拿 markdown"策略的域名。
 * 这类域名提供原生 markdown 视图（content-type=text/markdown），
 * 比 cheerio+turndown 清洗 HTML 更干净、token 更省。
 */
const DIRECT_MD_HOSTS = new Set([
    'trtc.io',
]);
const REQUEST_TIMEOUT_MS = 15000;
/** 默认截断长度（字符），超过则按段落截断 */
const DEFAULT_MAX_CHARS = 50000;
/** 内存缓存：url -> markdown，避免同一咨询/相近请求重复打官网 */
const cache = new Map();
/** 判断 URL 是否命中白名单域名 */
function isAllowedUrl(url) {
    try {
        const { hostname } = new URL(url);
        return ALLOWED_HOSTS.has(hostname);
    }
    catch {
        return false;
    }
}
/**
 * 从 HTML 中提取正文容器（cheerio 按域名选择稳定容器）。
 * 找不到时回退到更宽泛的选择器；仍找不到返回 null，交由调用方退化为整页清洗。
 */
function extractArticleSelector(hostname) {
    if (hostname === 'cloud.tencent.com') {
        // 腾讯云文档：正文在 #docArticleContent 内（SSR 直出），依次回退
        return ['#docArticleContent', '#doc-slate-root', '.J-markdown-box'];
    }
    if (hostname === 'web.sdk.qcloud.com') {
        // JSDoc 静态文档：正文在 #main 的 article 内
        return ['#main article', '#main', 'article'];
    }
    return [];
}
/** 使用 turndown 将选中的 HTML 节点转成 markdown */
function convertToMarkdown(html) {
    const turndown = new TurndownService({
        headingStyle: 'atx', // ## 风格标题
        codeBlockStyle: 'fenced', // ``` 围栏代码块
        bulletListMarker: '-',
    });
    turndown.remove(['script', 'style', 'nav', 'noscript', 'iframe']);
    let md = turndown.turndown(html);
    md = md
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    return md;
}
/** 按段落截断到 maxChars */
function truncateMarkdown(md, maxChars) {
    if (md.length <= maxChars)
        return md;
    const head = md.slice(0, maxChars);
    const lastBreak = head.lastIndexOf('\n\n');
    return `${head.slice(0, lastBreak > 0 ? lastBreak : maxChars)}\n…[已截断]`;
}
/**
 * 公共 fetch helper：带 timeout + 错误吞咽，把 Response 交给 handle 解析。
 * 用 globalThis.fetch 避免与下方内部分流函数 fetch 同名冲突。
 */
async function fetchWithTimeout(url, handle) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        const res = await globalThis.fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
                // 加 text/markdown 偏好，让 trtc.io 等支持 .md 后缀的站点优先返回 markdown
                'Accept': 'text/markdown,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            },
            // Node fetch 自动处理 gzip/deflate/br
            redirect: 'follow',
        });
        if (!res.ok)
            return null;
        return await handle(res);
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
}
/** cheerio+turndown 路径：处理 cloud.tencent.com / web.sdk.qcloud.com 等 HTML 文档 */
async function fetchAndConvert(url, maxChars) {
    return fetchWithTimeout(url, async (res) => {
        const html = await res.text();
        const { hostname } = new URL(url);
        // cheerio 定位正文容器
        const $ = cheerio.load(html);
        const selectors = extractArticleSelector(hostname);
        let article = selectors.map((sel) => $(sel)).find((node) => node.length > 0);
        if (!article || article.length === 0) {
            // 找不到容器时退化为 body 清洗（会偏大，但不丢正文）
            article = $('body');
        }
        const markdown = convertToMarkdown(article.html() ?? '');
        if (!markdown)
            return null;
        const truncated = markdown.length > maxChars;
        const final = truncated ? truncateMarkdown(markdown, maxChars) : markdown;
        return {
            markdown: final,
            truncated,
            htmlBytes: Buffer.byteLength(html, 'utf-8'),
        };
    });
}
/**
 * direct-md 路径：trtc.io 提供 `url + '.md'` 视图，
 * content-type=text/markdown，可直接消费，跳过 cheerio 清洗。
 * 失败时（content-type 不对 / 404）返回 null，让调用方走 fallback 路径。
 */
async function fetchDirectMarkdown(url, maxChars) {
    const mdUrl = `${url}.md`;
    return fetchWithTimeout(mdUrl, async (res) => {
        const ct = res.headers.get('content-type') ?? '';
        if (!/text\/markdown/i.test(ct))
            return null;
        const md = await res.text();
        const truncated = md.length > maxChars;
        return {
            markdown: truncated ? truncateMarkdown(md, maxChars) : md,
            truncated,
            htmlBytes: 0,
        };
    });
}
/**
 * 内部分流 fetch：按 hostname 选择策略。
 * - DIRECT_MD_HOSTS 内的域名走 fetchDirectMarkdown；失败 fallback 到 fetchAndConvert。
 * - 其他域名走 fetchAndConvert（cheerio+turndown）。
 */
async function fetch(url, hostname, maxChars) {
    if (DIRECT_MD_HOSTS.has(hostname)) {
        const direct = await fetchDirectMarkdown(url, maxChars);
        // 防御：.md 视图失败时（如 content-type 不对、404）fallback 到 cheerio 路径
        return direct ?? fetchAndConvert(url, maxChars);
    }
    return fetchAndConvert(url, maxChars);
}
/**
 * fetch 官网文档并清洗为 markdown。
 * 命中白名单才请求；失败/超时/非白名单一律返回 null，不抛错。
 */
export async function fetchDocContent(url, opts) {
    if (!isAllowedUrl(url))
        return null;
    // 缓存 key 用原 URL（不带 .md），让 fetchDocContent 调用方透明
    const cached = cache.get(url);
    if (cached)
        return { markdown: cached, truncated: false, htmlBytes: 0 };
    const { hostname } = new URL(url);
    const maxChars = opts?.maxChars ?? DEFAULT_MAX_CHARS;
    const result = await fetch(url, hostname, maxChars);
    if (result)
        cache.set(url, result.markdown);
    return result;
}
/** 清空内存缓存（测试/热更时用） */
export function clearFetchDocCache() {
    cache.clear();
}

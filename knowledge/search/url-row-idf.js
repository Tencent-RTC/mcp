/**
 * url-row-idf.ts
 *
 * 为 url-row 匹配提供 **IDF（逆文档频率）加权**，用于自动降权高频泛词
 * （`消息`/`message`/`group` 等），而不依赖任何枚举词表。
 *
 * 语言无关：同时支持中文（CJK 切词）与英文（空格切词）。
 * 产品无关：词频统计对当前语料中所有 `urls/` 行的标题构建，未来新增产品自动纳入。
 *
 * 懒加载 + 内存缓存：首次调用时从 manifest 索引统计，之后复用。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cachedIdf = null;
let cachedManifestPath = '';
/** 判断 source 是否 url 映射行（产品无关：knowledge/<product>/urls/） */
function isUrlMappingSource(source) {
    return /knowledge\/[a-z0-9_-]+\/urls\/.+\.md$/i.test(source.replace(/\\/g, '/'));
}
/**
 * 中文连续段切为 2-gram 词片；英文按空白切词。
 * 返回小写 token 列表（未去重，用于统计文档频率）。
 */
function tokenizeTitle(title) {
    const tokens = [];
    const lower = title.toLowerCase();
    // 英文词（>=2 字母）
    for (const match of lower.matchAll(/[a-z][a-z0-9]{1,}/g)) {
        tokens.push(match[0]);
    }
    // 中文连续段 → 2-gram（避免单字「消息」过于泛，同时保留「消息回应」这类相邻组合的贡献）
    for (const seg of lower.match(/[\u4e00-\u9fff]{2,}/g) ?? []) {
        for (let i = 0; i < seg.length - 1; i += 1) {
            tokens.push(seg.slice(i, i + 2));
        }
        // 整段作为复合词也计入（比 2-gram 更有区分度）
        tokens.push(seg);
    }
    return tokens;
}
function resolveManifestPath() {
    return path.resolve(__dirname, '../../resource/index/manifest.json');
}
/** 构建 IDF 索引：统计所有 urls 行标题的文档频率 */
function buildIdfIndex() {
    const manifestPath = resolveManifestPath();
    const df = new Map();
    const seenTitles = new Set();
    let totalDocs = 0;
    if (fs.existsSync(manifestPath)) {
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            for (const chunk of manifest.chunks ?? []) {
                if (!chunk.title)
                    continue;
                if (!isUrlMappingSource(chunk.source))
                    continue;
                if (seenTitles.has(chunk.title))
                    continue;
                seenTitles.add(chunk.title);
                totalDocs += 1;
                const seen = new Set();
                for (const token of tokenizeTitle(chunk.title)) {
                    if (seen.has(token))
                        continue;
                    seen.add(token);
                    df.set(token, (df.get(token) ?? 0) + 1);
                }
            }
        }
        catch {
            // manifest 读取失败时退化为空索引（IDF 全视为高区分度）
        }
    }
    return { df, totalDocs };
}
/**
 * 计算单个 token 的 IDF 权重。
 * - 未出现在统计中（稀有/新词）→ 高权重（IDF 高）
 * - 高频泛词 → 低权重
 * - totalDocs 为 0 时退化为 1（不降权）
 */
export function idfWeight(token) {
    if (!cachedIdf)
        loadIdf();
    const { df, totalDocs } = cachedIdf;
    if (!totalDocs)
        return 1;
    const docFreq = df.get(token.toLowerCase()) ?? 0;
    if (docFreq <= 0)
        return 1;
    // IDF = ln((N - df + 0.5) / (df + 0.5)) + 1，平滑处理避免极端
    const idf = Math.log((totalDocs - docFreq + 0.5) / (docFreq + 0.5)) + 1;
    return Math.max(idf, 0.2);
}
/** 加载（或复用）IDF 索引 */
export function loadIdf() {
    const manifestPath = resolveManifestPath();
    if (cachedIdf && cachedManifestPath === manifestPath)
        return;
    cachedIdf = buildIdfIndex();
    cachedManifestPath = manifestPath;
}
/**
 * 判断 2-gram 是否为「有效词」（在 urls 标题语料中出现过，df>0）。
 * 跨词边界的 2-gram（如「送前」「前回」「端群」）在标题语料中 df=0（从未作为词出现），
 * 属于 N-gram 滑窗产生的噪声，不应参与覆盖率分母。df>0 的才是真实语义词。
 * 产品无关：对所有产品的 urls 标题统计，不依赖枚举词表。
 */
export function isValidBigram(token) {
    if (!cachedIdf)
        loadIdf();
    return (cachedIdf.df.get(token.toLowerCase()) ?? 0) > 0;
}
/** 供测试/热更使用 */
export function resetIdfCache() {
    cachedIdf = null;
}

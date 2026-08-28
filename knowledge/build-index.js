import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chunkMarkdown, toManifestChunk } from './chunker.js';
import { buildDocSourceUrlMap } from './doc-url-resolver.js';
import { mergePathMetaWithFrontmatter, resolveFrontmatterMeta } from './frontmatter-meta.js';
import { inferPathMeta } from './path-meta.js';
import { loadChunkingPolicy, resolveChunkingRule, resolvePolicyFilePath } from './chunking-policy.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 构建期写入索引到 dist/resource/index/：
//   dist/knowledge/ → ../resource/ → dist/resource/
// 必须在 scripts/copy-resource.js 之后执行，否则目标目录不存在。
const RESOURCE_ROOT = path.resolve(__dirname, '../resource');
function walkMarkdownFiles(dir, baseRel) {
    if (!fs.existsSync(dir))
        return [];
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = `${baseRel}/${entry.name}`.replace(/\\/g, '/');
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'native_live')
                continue;
            files.push(...walkMarkdownFiles(abs, rel));
        }
        else if (entry.name.endsWith('.md') && entry.name !== 'workflow.md') {
            files.push(rel);
        }
    }
    return files;
}
function collectComponentSlugs(chunks) {
    const slugs = {};
    for (const chunk of chunks) {
        const componentsMatch = chunk.source.match(/components\/([^/]+)\.md$/);
        const chatFeaturesMatch = chunk.source.match(/^knowledge\/chat\/preset\/(vue|react)\/features\/([^/]+)\.md$/);
        const slug = componentsMatch?.[1] ?? chatFeaturesMatch?.[2];
        if (!slug)
            continue;
        slugs[slug] = [slug, slug.replace(/-/g, ''), slug.replace(/-/g, '_')];
    }
    return slugs;
}
export function buildKnowledgeIndex() {
    const sources = [
        ...walkMarkdownFiles(path.join(RESOURCE_ROOT, 'knowledge'), 'knowledge'),
        ...walkMarkdownFiles(path.join(RESOURCE_ROOT, 'integration'), 'integration'),
    ];
    const chunks = [];
    let frontmatterFileCount = 0;
    let frontmatterMergedCount = 0;
    let frontmatterParseErrorCount = 0;
    const chunkingPolicyPath = resolvePolicyFilePath(__dirname);
    const chunkingPolicy = loadChunkingPolicy(chunkingPolicyPath);
    for (const source of sources) {
        const abs = path.join(RESOURCE_ROOT, source);
        const rawContent = fs.readFileSync(abs, 'utf-8');
        // Phase A（兼容期）：frontmatter 优先，未声明字段继续走路径推断 fallback。
        const pathMeta = inferPathMeta(source);
        const fm = resolveFrontmatterMeta(rawContent);
        const meta = mergePathMetaWithFrontmatter(pathMeta, fm.frontmatterMeta, fm.overrideFields);
        if (fm.hasFrontmatter)
            frontmatterFileCount += 1;
        if (meta.meta_source === 'merged')
            frontmatterMergedCount += 1;
        if (fm.parseError) {
            frontmatterParseErrorCount += 1;
            console.warn(`[build-knowledge-index] frontmatter parse failed: ${source} - ${fm.parseError}`);
        }
        const policyRule = resolveChunkingRule(source, chunkingPolicy);
        chunks.push(...chunkMarkdown(source, fm.content, meta, {
            baseOffset: fm.contentOffset,
            policyRule,
            defaultSplitTokenThreshold: chunkingPolicy.default.split_token_threshold,
        }).map(toManifestChunk));
    }
    const indexDir = path.join(RESOURCE_ROOT, 'index');
    fs.mkdirSync(indexDir, { recursive: true });
    const manifest = {
        version: 1,
        built_at: new Date().toISOString(),
        chunks,
    };
    const componentSlugs = collectComponentSlugs(chunks);
    fs.writeFileSync(path.join(indexDir, 'manifest.json'), JSON.stringify(manifest));
    fs.writeFileSync(path.join(indexDir, 'component-slugs.json'), JSON.stringify(componentSlugs));
    const syncManifestPath = path.resolve(__dirname, '../../sync/sync-manifest.json');
    const docSourceUrls = buildDocSourceUrlMap(syncManifestPath);
    fs.writeFileSync(path.join(indexDir, 'doc-source-urls.json'), JSON.stringify(docSourceUrls));
    const staleSearchIndex = path.join(indexDir, 'search-index.json');
    if (fs.existsSync(staleSearchIndex)) {
        fs.unlinkSync(staleSearchIndex);
    }
    console.warn(`build-knowledge-index: ${chunks.length} chunks (manifest-lite) from ${sources.length} files; `
        + `frontmatter files=${frontmatterFileCount}, merged=${frontmatterMergedCount}, parse_errors=${frontmatterParseErrorCount}`);
}

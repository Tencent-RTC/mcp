import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import { chunkMarkdown, toManifestChunk } from './chunker.js';
import { buildDocSourceUrlMap } from './doc-url-resolver.js';
import { mergePathMetaWithFrontmatter, resolveFrontmatterMeta } from './frontmatter-meta.js';
import { inferPathMeta } from './path-meta.js';
import { DEFAULT_POLICY, resolveChunkingRule } from './chunking-policy.js';
import { classifyTaxonomy, loadTaxonomy, taxonomyFieldsToPathMeta } from './taxonomy.js';
import { PRODUCT_DIRS } from './product-dirs.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 构建期写入索引到 dist/resource/index/：
//   dist/knowledge/ → ../resource/ → dist/resource/
// 必须在 scripts/copy-resource.js 之后执行，否则目标目录不存在。
const RESOURCE_ROOT = path.resolve(__dirname, '../resource');
/**
 * 平台叶子段（段级精确匹配）：nav_path 末段恰好是这些词时，属「平台名」而非文档主题，
 * 真正的主题段在前一段（甚至前两段，见 TYPE_SEGMENTS）。
 * 与 exact-lookup.ts 的 PLATFORM_WORDS / CN_PLATFORM_LEAF 语义一致（平台词非区分性主标题），
 * 但此处用于「修正 doc_title 提取」，把被平台末段遮蔽的主题词捞回来。
 */
const PLATFORM_SEGMENTS = new Set([
    'Android', 'iOS', 'Web', 'H5', 'Flutter', 'React', 'React Native',
    'Vue', 'Vue2', 'Vue3', 'uni-app', 'uniapp', '小程序', '微信小程序',
    'HarmonyOS', '鸿蒙', 'Linux', 'RTOS', 'C++', 'Unity', 'Unreal Engine',
    'Electron', 'Mac', 'macOS', 'Windows', '微信',
]);
/**
 * 纯类型段：只描述文档编写类型、从不作为文档主题的 nav_path 段
 * （快速接入 / 跑通 Demo / 客户端 API 等）。
 * 当去掉平台末段后，最后一段是这些类型词时，主题在前一段，
 * 需把「主题 + 类型」拼接作为 doc_title，以区分同主题下的不同文档
 * （如「视频交友 快速接入」vs「视频交友 跑通 Demo」）。
 */
const TYPE_SEGMENTS = new Set([
    '快速接入', '快速接入（含 UI）', '快速接入（含UI）',
    '跑通 Demo', '跑通Demo', '客户端 API', '客户端API',
    '集成 SDK', '集成SDK', 'SDK 接入', 'SDK接入',
]);
/**
 * 文档主标题提取：
 * 1. nav_path 末段优先；
 * 2. 末段是平台叶子段（Android/Flutter/Web 等）→ 去掉，向前取主题；
 * 3. 去掉平台后末段是纯类型段（快速接入/跑通 Demo 等）→ 拼「主题 类型」，
 *    保留类型维度以区分同主题不同文档；
 * 4. 兜底：无 nav_path 回退文件名；段全被去掉则回退原末段。
 */
function extractDocTitle(navPath, source) {
    if (!navPath || navPath.length === 0) {
        return source.replace(/\.md$/, '').split('/').pop() ?? '';
    }
    const segs = [...navPath];
    if (PLATFORM_SEGMENTS.has(segs[segs.length - 1]))
        segs.pop();
    if (segs.length === 0)
        return navPath[navPath.length - 1];
    const last = segs[segs.length - 1];
    if (TYPE_SEGMENTS.has(last)) {
        return segs.length >= 2 ? `${segs[segs.length - 2]} ${last}` : last;
    }
    return last;
}
function walkMarkdownFiles(dir, baseRel) {
    if (!fs.existsSync(dir))
        return [];
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = `${baseRel}/${entry.name}`.replace(/\\/g, '/');
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkMarkdownFiles(abs, rel));
        }
        else if (entry.name.endsWith('.md')
            && entry.name !== 'workflow.md'
            && entry.name !== 'matrix.json' // package knowledge matrix: structured data consumed by package routing, not chunked/retrieved
        ) {
            files.push(rel);
        }
    }
    return files;
}
/**
 * get 工具引用的固定别名清单（core 工具按 framework 枚举展开）。
 * 构建期校验每个必须在 doc-aliases.yaml 中，删一条被引用的别名 ⇒ build 失败。
 * 注：检索规则（trtc 客户端 API / push 厂商）已改为按 doc_title 定位（exact-lookup.ts），
 *     不再引用别名，故 trtc.* / push.* 别名已从 doc-aliases.yaml 退役。
 */
const CALL_CORE_FRAMEWORKS = ['android', 'ios', 'flutter']; // en 站 call 无 UI 集成无 uni-app（zh 站有）
const LIVE_CORE_FRAMEWORKS = ['android', 'ios', 'flutter', 'react-native']; // en 站 Core SDK 用 React Native（zh 站用 uni-app）
const REFERENCED_ALIASES = [
    ...['make_call', 'answer_call'].flatMap((g) => CALL_CORE_FRAMEWORKS.map((f) => `call.core.${g}.${f}`)),
    ...['android', 'ios', 'flutter'].map((f) => `call.core.offline_push.${f}`),
    ...LIVE_CORE_FRAMEWORKS.flatMap((f) => [
        `live.core.live.host.${f}`,
        `live.core.live.list.${f}`,
        `live.core.voice.host.${f}`,
        `live.core.voice.audience.${f}`,
    ]),
];
/**
 * 生成 doc-registry.json：`byNodeId`（nodeId → localPath，覆盖全部账本条目）与 `aliases`（逻辑名 → nodeId）。
 * 构建期校验（失败即抛错中断）：每个别名的 nodeId 必须存在于 sync-manifest，且其 localPath 文件必须存在；
 * 代码引用的别名必须全部在别名表中。
 * 运行时只读 dist/resource/index/doc-registry.json，不读 sync/。
 */
function buildDocRegistry(syncManifestPath, aliasesPath, resourceRoot) {
    const syncManifest = JSON.parse(fs.readFileSync(syncManifestPath, 'utf-8'));
    const byNodeId = {};
    for (const [nodeId, entry] of Object.entries(syncManifest.entries ?? {})) {
        const e = entry;
        if (e?.localPath)
            byNodeId[String(nodeId)] = e.localPath;
    }
    const aliases = {};
    if (fs.existsSync(aliasesPath)) {
        const parsed = yaml.load(fs.readFileSync(aliasesPath, 'utf-8'));
        for (const [alias, info] of Object.entries(parsed?.aliases ?? {})) {
            const nodeId = info?.nodeId;
            if (typeof nodeId !== 'string' || !nodeId) {
                throw new Error(`doc-registry 校验失败：别名 "${alias}" 缺少有效的 nodeId`);
            }
            if (!byNodeId[nodeId]) {
                throw new Error(`doc-registry 校验失败：别名 "${alias}" 的 nodeId "${nodeId}" 不在 sync-manifest 中`);
            }
            const localPath = byNodeId[nodeId];
            if (!fs.existsSync(path.join(resourceRoot, localPath))) {
                throw new Error(`doc-registry 校验失败：别名 "${alias}" 对应文件 "${localPath}" 不存在`);
            }
            aliases[alias] = nodeId;
        }
    }
    // 校验代码引用的别名全部在别名表中（删一条被引用的别名 ⇒ build 失败）。
    for (const alias of REFERENCED_ALIASES) {
        if (!aliases[alias]) {
            throw new Error(`doc-registry 校验失败：代码引用的别名 "${alias}" 不在 doc-aliases.yaml 中`);
        }
    }
    return { byNodeId, aliases };
}
/**
 * 构建期校验 products.yaml 与 product-dirs.ts 完全一致（键集合 + knowledge_root 值），
 * 不一致即抛错中断构建（方案 5.3：products.yaml 为唯一事实源，TS 侧镜像必须同步）。
 */
function validateProductDirs(productsYamlPath) {
    const parsed = yaml.load(fs.readFileSync(productsYamlPath, 'utf-8'));
    const yamlDirs = {};
    for (const [product, cfg] of Object.entries(parsed ?? {})) {
        if (cfg?.knowledge_root)
            yamlDirs[product] = cfg.knowledge_root;
    }
    const tsKeys = Object.keys(PRODUCT_DIRS).sort();
    const yamlKeys = Object.keys(yamlDirs).sort();
    if (JSON.stringify(tsKeys) !== JSON.stringify(yamlKeys)) {
        throw new Error(`product-dirs 校验失败：products.yaml 键 [${yamlKeys.join(', ')}] 与 product-dirs.ts 键 [${tsKeys.join(', ')}] 不一致`);
    }
    for (const product of tsKeys) {
        if (PRODUCT_DIRS[product] !== yamlDirs[product]) {
            throw new Error(`product-dirs 校验失败：产品 "${product}" 的 knowledge_root 不一致（product-dirs.ts=${PRODUCT_DIRS[product]}，products.yaml=${yamlDirs[product]}）`);
        }
    }
}
export function buildKnowledgeIndex() {
    validateProductDirs(path.resolve(__dirname, '../../resource/_schema/products.yaml'));
    const sources = [
        ...walkMarkdownFiles(path.join(RESOURCE_ROOT, 'knowledge'), 'knowledge'),
        ...walkMarkdownFiles(path.join(RESOURCE_ROOT, 'integration'), 'integration'),
    ];
    const chunks = [];
    let frontmatterFileCount = 0;
    let frontmatterMergedCount = 0;
    let frontmatterParseErrorCount = 0;
    const chunkingPolicy = DEFAULT_POLICY;
    // 检索侧加载 taxonomy，对文档 nav_path 分类（覆盖 path 推断）。
    const taxonomyPath = path.resolve(__dirname, '../../sync/taxonomy.yaml');
    const taxonomy = loadTaxonomy(taxonomyPath);
    for (const source of sources) {
        const abs = path.join(RESOURCE_ROOT, source);
        const rawContent = fs.readFileSync(abs, 'utf-8');
        // Phase A（兼容期）：frontmatter 优先，未声明字段继续走路径推断 fallback。
        const pathMeta = inferPathMeta(source);
        const fm = resolveFrontmatterMeta(rawContent);
        // 对 nav_path 套用 taxonomy 规则，产出 framework/types/feature_domain 等，覆盖 path 推断。
        const navPath = fm.navPath ?? [];
        const taxProduct = fm.frontmatterMeta.product ?? pathMeta.product;
        const classified = classifyTaxonomy(taxonomy, taxProduct, navPath);
        const taxonomyMeta = taxonomyFieldsToPathMeta(classified.fields);
        const taxonomyFields = Object.keys(taxonomyMeta);
        const meta = mergePathMetaWithFrontmatter(pathMeta, { ...fm.frontmatterMeta, ...taxonomyMeta }, [...new Set([...fm.overrideFields, ...taxonomyFields])]);
        if (fm.hasFrontmatter)
            frontmatterFileCount += 1;
        if (meta.meta_source === 'merged')
            frontmatterMergedCount += 1;
        if (fm.parseError) {
            frontmatterParseErrorCount += 1;
            console.warn(`[build-knowledge-index] frontmatter parse failed: ${source} - ${fm.parseError}`);
        }
        const policyRule = resolveChunkingRule(source, chunkingPolicy, {
            meta,
            navPath,
            content: fm.content,
        });
        // 文档主标题 = nav_path 末段；末段为平台叶子段时向前取主题段（见 extractDocTitle）。
        const docTitle = extractDocTitle(navPath, source);
        chunks.push(...chunkMarkdown(source, fm.content, meta, {
            baseOffset: fm.contentOffset,
            policyRule,
            defaultSplitTokenThreshold: chunkingPolicy.default.split_token_threshold,
            docTitle,
            navPath,
            tags: fm.tags,
        }).map(toManifestChunk));
    }
    const indexDir = path.join(RESOURCE_ROOT, 'index');
    fs.mkdirSync(indexDir, { recursive: true });
    const manifest = {
        version: 1,
        built_at: new Date().toISOString(),
        chunks,
    };
    fs.writeFileSync(path.join(indexDir, 'manifest.json'), JSON.stringify(manifest));
    const syncManifestPath = path.resolve(__dirname, '../../sync/sync-manifest.json');
    const docSourceUrls = buildDocSourceUrlMap(syncManifestPath);
    fs.writeFileSync(path.join(indexDir, 'doc-source-urls.json'), JSON.stringify(docSourceUrls));
    const aliasesPath = path.resolve(__dirname, '../../sync/doc-aliases.yaml');
    const docRegistry = buildDocRegistry(syncManifestPath, aliasesPath, RESOURCE_ROOT);
    fs.writeFileSync(path.join(indexDir, 'doc-registry.json'), JSON.stringify(docRegistry, null, 2));
    const staleSearchIndex = path.join(indexDir, 'search-index.json');
    if (fs.existsSync(staleSearchIndex)) {
        fs.unlinkSync(staleSearchIndex);
    }
    console.warn(`build-knowledge-index: ${chunks.length} chunks (manifest-lite) from ${sources.length} files; `
        + `frontmatter files=${frontmatterFileCount}, merged=${frontmatterMergedCount}, parse_errors=${frontmatterParseErrorCount}`);
}

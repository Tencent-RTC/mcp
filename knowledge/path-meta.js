import { PRODUCT_DIRS } from './product-dirs.js';
function uniq(arr) {
    return [...new Set(arr)];
}
function inferTypesFromFilename(fileName, baseTypes) {
    const types = [...baseTypes];
    const lower = fileName.toLowerCase();
    if (/error.?code|txliteavcode/.test(lower))
        types.push('error_code');
    if (lower === 'client-api.md' || lower === 'api.md' || lower === 'index.md')
        types.push('api');
    // api-<变体>.md（如 api-uniapp.md：微信小程序 uni-app 打包 API）同样是 API 文档
    if (/^api-[\w-]+\.mdx?$/.test(lower))
        types.push('api');
    if (lower === 'faq.md')
        types.push('faq');
    if (lower.endsWith('-integration.md'))
        types.push('integration');
    if (/live-.*-interaction|voice-/.test(lower))
        types.push('feature');
    if (lower.includes('plugin') || /^\d+-advanced-/.test(lower))
        types.push('plugin');
    return uniq(types);
}
/**
 * 路径推断兜底（精简版）。
 *
 * 镜像路径已中文化，不再承载检索语义；framework / types / scenario / variant /
 * feature_domain 均由 taxonomy.yaml（对 nav_path 分类）
 * 或 frontmatter 覆盖。此处仅保留最小兜底：
 *   - product：从 `knowledge/` 第二段识别产品 id（taxonomy 的 product 入参 fallback）
 *   - framework：默认 `['*']`（平台无关文档兜底）
 *   - types：文件名推断 + 默认 `faq`
 * 其余字段给缺省值，交由 taxonomy/frontmatter 覆盖。
 *
 * 唯一特例：trtc/web 走 webdoc 链路（nav_path 为空、taxonomy 不分类），其 framework
 * 只能从目录名推断为 `web`；其余 trtc 目录（服务端功能 / AI实时对话 / TRTCSDK 等）
 * 不再按目录名推断 framework（避免中文目录名污染 framework 枚举）。
 */
export function inferPathMeta(relativeSource) {
    const normalized = relativeSource.replace(/\\/g, '/');
    const parts = normalized.split('/');
    const fileName = parts[parts.length - 1] ?? '';
    const product = PRODUCT_DIRS[parts[1]] ?? '*';
    const isTrtcWeb = product === 'trtc' && parts[2] === 'web';
    const framework = isTrtcWeb ? ['web'] : ['*'];
    const types = inferTypesFromFilename(fileName, isTrtcWeb ? ['api', 'faq'] : ['faq']);
    return {
        product,
        framework,
        types: uniq(types),
        scenario: null,
        variant: undefined,
        platform: undefined,
        scope: undefined,
        feature_domain: undefined,
        meta_source: 'path',
        meta_override_fields: [],
    };
}

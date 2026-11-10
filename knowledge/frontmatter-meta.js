import * as yaml from 'js-yaml';
const FRONTMATTER_RE = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
function uniq(arr) {
    return [...new Set(arr)];
}
function normalizeString(value) {
    if (typeof value !== 'string')
        return undefined;
    const normalized = value.trim();
    return normalized ? normalized : undefined;
}
function normalizeStringArray(value) {
    if (Array.isArray(value)) {
        const normalized = value
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter(Boolean);
        return normalized.length ? uniq(normalized) : undefined;
    }
    if (typeof value === 'string') {
        const normalized = value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        return normalized.length ? uniq(normalized) : undefined;
    }
    return undefined;
}
function normalizeScenario(value) {
    if (value === 'live' || value === 'voice')
        return value;
    return undefined;
}
function normalizeVariant(value) {
    if (value === 'core-sdk' || value === 'preset')
        return value;
    return undefined;
}
function normalizeFeatureDomain(value) {
    const allowed = [
        'app',
        'app_demo',
        'app_integration',
        'device',
        'device_demo',
        'device_integration',
        'security-camera',
        'smart-vision',
        'kids-watch',
        'voice-recorder',
        'client_api',
    ];
    return allowed.includes(value)
        ? value
        : undefined;
}
function parseFrontmatterObject(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {};
    }
    return input;
}
export function resolveFrontmatterMeta(rawMarkdown) {
    const match = rawMarkdown.match(FRONTMATTER_RE);
    if (!match) {
        return {
            content: rawMarkdown,
            contentOffset: 0,
            hasFrontmatter: false,
            frontmatterMeta: {},
            overrideFields: [],
            navPath: undefined,
            tags: undefined,
        };
    }
    const rawBlock = match[1] ?? '';
    const contentOffset = match[0].length;
    const content = rawMarkdown.slice(contentOffset);
    let parsed;
    try {
        parsed = yaml.load(rawBlock);
    }
    catch (error) {
        const parseError = error instanceof Error ? error.message : String(error);
        return {
            content,
            contentOffset,
            hasFrontmatter: true,
            parseError,
            frontmatterMeta: {},
            overrideFields: [],
        };
    }
    const fm = parseFrontmatterObject(parsed);
    const frontmatterMeta = {};
    const overrideFields = [];
    const product = normalizeString(fm.product);
    if (product) {
        frontmatterMeta.product = product;
        overrideFields.push('product');
    }
    const framework = normalizeStringArray(fm.frameworks) ?? normalizeStringArray(fm.framework);
    if (framework?.length) {
        frontmatterMeta.framework = framework;
        overrideFields.push('framework');
    }
    const types = normalizeStringArray(fm.types);
    if (types?.length) {
        frontmatterMeta.types = types;
        overrideFields.push('types');
    }
    const scenario = normalizeScenario(fm.scenario);
    if (scenario !== undefined) {
        frontmatterMeta.scenario = scenario;
        overrideFields.push('scenario');
    }
    const variant = normalizeVariant(fm.variant);
    if (variant) {
        frontmatterMeta.variant = variant;
        overrideFields.push('variant');
    }
    const scope = normalizeString(fm.scope);
    if (scope) {
        frontmatterMeta.scope = scope;
        overrideFields.push('scope');
    }
    const featureDomain = normalizeFeatureDomain(fm.feature_domain);
    if (featureDomain) {
        frontmatterMeta.feature_domain = featureDomain;
        overrideFields.push('feature_domain');
    }
    const navPath = normalizeStringArray(fm.nav_path);
    const tags = normalizeStringArray(fm.tags);
    return {
        content,
        contentOffset,
        hasFrontmatter: true,
        frontmatterMeta,
        overrideFields: uniq(overrideFields),
        navPath,
        tags,
    };
}
export function mergePathMetaWithFrontmatter(pathMeta, frontmatterMeta, overrideFields) {
    if (!overrideFields.length) {
        return {
            ...pathMeta,
            meta_source: 'path',
            meta_override_fields: [],
        };
    }
    const merged = {
        ...pathMeta,
        meta_source: 'merged',
        meta_override_fields: uniq(overrideFields),
    };
    for (const field of overrideFields) {
        const value = frontmatterMeta[field];
        if (value === undefined)
            continue;
        // PathMeta 字段由 frontmatter 显式声明时优先；未声明字段保留路径推断兜底。
        merged[field] = value;
    }
    return merged;
}

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
function normalizeDocKind(value) {
    if (value === 'capability_matrix' || value === 'unsupported_summary' || value === 'negative_faq') {
        return value;
    }
    return undefined;
}
function normalizeCapabilityStatus(value) {
    if (value === 'supported' || value === 'unsupported' || value === 'partial' || value === 'version_gated') {
        return value;
    }
    return undefined;
}
function normalizeRetrievableScope(value) {
    if (value === 'always')
        return 'always';
    return normalizeStringArray(value);
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
    const docKind = normalizeDocKind(fm.doc_kind);
    if (docKind) {
        frontmatterMeta.doc_kind = docKind;
        overrideFields.push('doc_kind');
    }
    const capabilityStatus = normalizeCapabilityStatus(fm.capability_status);
    if (capabilityStatus) {
        frontmatterMeta.capability_status = capabilityStatus;
        overrideFields.push('capability_status');
    }
    const retrievableScope = normalizeRetrievableScope(fm.retrievable_scope);
    if (retrievableScope) {
        frontmatterMeta.retrievable_scope = retrievableScope;
        overrideFields.push('retrievable_scope');
    }
    return {
        content,
        contentOffset,
        hasFrontmatter: true,
        frontmatterMeta,
        overrideFields: uniq(overrideFields),
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

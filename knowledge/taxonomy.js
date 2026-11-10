/**
 * taxonomy.ts
 *
 * 检索侧加载 sync/taxonomy.yaml，对文档 frontmatter 的 nav_path（官网路径段）分类，
 * 产出 framework / types / variant / scenario / feature_domain 等元数据字段，
 * 覆盖 path-meta.ts 的落盘路径推断（镜像路径为中文，path 推断已失真）。
 *
 * 规则语义与同步侧 scripts/sync/mirror/taxonomy.js 的 classifyTaxonomy 同源：
 *   - framework 用「最深段」（deepest）语义：从最靠近叶子的路径段往浅遍历，首条命中。
 *   - feature_domain 用「路径前缀」（prefix）语义：对完整路径（段 join '/'）匹配。
 *   - 其余字段（types/variant/scenario 等）用「任意段」（any）语义：任意段 + 规则首条命中。
 *
 * 未命中字段缺省（交由 path-meta.ts 兜底）；加载失败（配置错误）抛错中止。
 */
import fs from 'fs';
import * as yaml from 'js-yaml';
/** taxonomy 可覆盖的字段白名单（与 frontmatter-meta.ts 的 FrontmatterObject 对齐）。 */
export const TAXONOMY_FIELDS = [
    'product',
    'framework',
    'types',
    'scenario',
    'variant',
    'scope',
    'feature_domain',
];
const FIELD_SET = new Set(TAXONOMY_FIELDS);
/** value 里的 $n 替换为捕获组。 */
function applyCaptures(value, m) {
    const replace = (s) => String(s).replace(/\$(\d+)/g, (_, n) => m[Number(n)] ?? '');
    return Array.isArray(value) ? value.map(replace) : replace(value);
}
/** 单条规则编译 + 校验。 */
function parseRule(rule, ctx) {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
        throw new Error(`${ctx} 规则必须是对象 { match, value }`);
    }
    for (const key of Object.keys(rule)) {
        if (key !== 'match' && key !== 'value')
            throw new Error(`${ctx} 规则未知键: ${key}`);
    }
    const { match, value } = rule;
    if (typeof match !== 'string' || !match) {
        throw new Error(`${ctx} 缺 match 或非字符串`);
    }
    let re;
    try {
        re = new RegExp(match);
    }
    catch (error) {
        throw new Error(`${ctx} 非法正则 "${match}": ${error instanceof Error ? error.message : String(error)}`);
    }
    if (typeof value !== 'string' && !Array.isArray(value)) {
        throw new Error(`${ctx} value 必须是字符串或字符串数组`);
    }
    if (typeof value === 'string' && !value) {
        throw new Error(`${ctx} value 不能为空字符串`);
    }
    if (Array.isArray(value) && (!value.length || value.some((v) => typeof v !== 'string' || !v))) {
        throw new Error(`${ctx} value 数组必须非空且元素为字符串`);
    }
    return { re, value, match };
}
/** 规则列表编译 + 校验。 */
function parseRules(rulesVal, ctx) {
    if (!Array.isArray(rulesVal)) {
        throw new Error(`${ctx} 必须是规则列表（数组）`);
    }
    return rulesVal.map((rule, i) => parseRule(rule, `${ctx}[${i}]`));
}
/** 产品字段映射：字段名白名单 + 字符串引用共享词表 / 内联规则。 */
function parseFieldMap(fieldMap, shared, ctx) {
    if (!fieldMap || typeof fieldMap !== 'object' || Array.isArray(fieldMap)) {
        throw new Error(`${ctx} 必须是字段映射对象`);
    }
    const out = {};
    for (const [field, fieldVal] of Object.entries(fieldMap)) {
        if (!FIELD_SET.has(field)) {
            throw new Error(`${ctx} 未知字段名: ${field}（白名单：${TAXONOMY_FIELDS.join(', ')}）`);
        }
        if (typeof fieldVal === 'string') {
            if (!shared[fieldVal]) {
                throw new Error(`${ctx}.${field} 引用不存在的共享词表: ${fieldVal}`);
            }
            out[field] = shared[fieldVal];
        }
        else {
            out[field] = parseRules(fieldVal, `${ctx}.${field}`);
        }
    }
    return out;
}
/** 解析 + 校验 taxonomy 数据（yaml.load 的结果）。 */
export function parseTaxonomy(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('taxonomy 顶层必须是对象');
    }
    const shared = {};
    for (const [topKey, topVal] of Object.entries(data)) {
        if (topKey === 'products')
            continue;
        shared[topKey] = parseRules(topVal, `共享词表 ${topKey}`);
    }
    const rawProducts = data.products ?? {};
    if (!rawProducts || typeof rawProducts !== 'object' || Array.isArray(rawProducts)) {
        throw new Error('taxonomy.products 必须是对象');
    }
    const products = {};
    for (const [product, fieldMap] of Object.entries(rawProducts)) {
        products[product] = parseFieldMap(fieldMap, shared, `产品 ${product}`);
    }
    return { shared, products };
}
/** 读文件 + 解析 + 校验。 */
export function loadTaxonomy(taxonomyPath) {
    const data = yaml.load(fs.readFileSync(taxonomyPath, 'utf8')) ?? {};
    return parseTaxonomy(data);
}
/** 字段规则匹配：返回 { value, match }（$n 已替换）或 undefined。 */
function matchField(rules, pathSegments, strategy) {
    if (strategy === 'deepest') {
        for (let i = pathSegments.length - 1; i >= 0; i--) {
            for (const rule of rules) {
                const m = rule.re.exec(String(pathSegments[i]));
                if (m)
                    return { value: applyCaptures(rule.value, m), match: rule.match };
            }
        }
        return undefined;
    }
    if (strategy === 'prefix') {
        const fullPath = pathSegments.join('/');
        for (const rule of rules) {
            const m = rule.re.exec(fullPath);
            if (m)
                return { value: applyCaptures(rule.value, m), match: rule.match };
        }
        return undefined;
    }
    for (const rule of rules) {
        for (const seg of pathSegments) {
            const m = rule.re.exec(String(seg));
            if (m)
                return { value: applyCaptures(rule.value, m), match: rule.match };
        }
    }
    return undefined;
}
/**
 * 评估器：按产品 + 官网路径段（nav_path）分类。
 * framework「最深段」、feature_domain「路径前缀」、其余「任意段 + 首条命中」。
 */
export function classifyTaxonomy(taxonomy, product, pathSegments) {
    const productRules = taxonomy.products[product];
    if (!productRules) {
        return { fields: {}, unclassified: [], matches: {}, productUnknown: true };
    }
    const fields = {};
    const unclassified = [];
    const matches = {};
    for (const [field, rules] of Object.entries(productRules)) {
        const strategy = field === 'framework'
            ? 'deepest'
            : field === 'feature_domain'
                ? 'prefix'
                : 'any';
        const hit = matchField(rules, pathSegments, strategy);
        if (hit === undefined)
            unclassified.push(field);
        else {
            fields[field] = hit.value;
            matches[field] = hit.match;
        }
    }
    return { fields, unclassified, matches, productUnknown: false };
}
/** 把 taxonomy 分类结果归一化为 Partial<PathMeta>（framework/types 归一为数组）。 */
export function taxonomyFieldsToPathMeta(fields) {
    const out = {};
    for (const [field, value] of Object.entries(fields)) {
        if (field === 'framework' || field === 'types') {
            out[field] = Array.isArray(value) ? value : [value];
        }
        else {
            out[field] = value;
        }
    }
    return out;
}

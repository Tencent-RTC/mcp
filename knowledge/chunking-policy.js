import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
const DEFAULT_POLICY = {
    default: {
        strategy: 'by_h2',
        split_token_threshold: 2048,
    },
    rules: [
        {
            path_prefix: 'knowledge/chat/best-practice/',
            strategy: 'single_chunk_per_file',
            max_tokens: 4096,
            hard_max_tokens: 8192,
            split_fallback: 'by_h2',
            split_aggregable: true,
        },
        {
            path_prefix: 'knowledge/chat/urls/',
            strategy: 'by_row',
        },
    ],
};
function toPolicy(raw) {
    if (!raw || typeof raw !== 'object')
        return DEFAULT_POLICY;
    const root = raw;
    const policyObj = (root.chunking_policy && typeof root.chunking_policy === 'object')
        ? root.chunking_policy
        : null;
    if (!policyObj)
        return DEFAULT_POLICY;
    const rawDefault = (policyObj.default && typeof policyObj.default === 'object')
        ? policyObj.default
        : {};
    const strategy = rawDefault.strategy === 'by_h3' ? 'by_h3' : 'by_h2';
    const splitThreshold = typeof rawDefault.split_token_threshold === 'number'
        ? rawDefault.split_token_threshold
        : 2048;
    const rules = Array.isArray(policyObj.rules)
        ? policyObj.rules
            .map((item) => {
            if (!item || typeof item !== 'object')
                return null;
            const rule = item;
            const pathPrefix = typeof rule.path_prefix === 'string' ? rule.path_prefix.trim() : '';
            const strategyValue = typeof rule.strategy === 'string' ? rule.strategy : '';
            if (!pathPrefix || !['single_chunk_per_file', 'by_h2', 'by_h3', 'by_row'].includes(strategyValue)) {
                return null;
            }
            return {
                path_prefix: pathPrefix,
                strategy: strategyValue,
                max_tokens: typeof rule.max_tokens === 'number' ? rule.max_tokens : undefined,
                hard_max_tokens: typeof rule.hard_max_tokens === 'number' ? rule.hard_max_tokens : undefined,
                split_fallback: rule.split_fallback === 'by_h3' ? 'by_h3' : (rule.split_fallback === 'by_h2' ? 'by_h2' : undefined),
                split_aggregable: typeof rule.split_aggregable === 'boolean' ? rule.split_aggregable : undefined,
                split_token_threshold: typeof rule.split_token_threshold === 'number' ? rule.split_token_threshold : undefined,
            };
        })
            .filter((rule) => Boolean(rule))
        : [];
    return {
        default: {
            strategy,
            split_token_threshold: splitThreshold,
        },
        rules,
    };
}
function extractYamlBlock(markdown) {
    const match = markdown.match(/```ya?ml\n([\s\S]*?)\n```/i);
    return match?.[1] ?? null;
}
export function loadChunkingPolicy(policyFilePath) {
    if (!fs.existsSync(policyFilePath)) {
        return DEFAULT_POLICY;
    }
    try {
        const markdown = fs.readFileSync(policyFilePath, 'utf-8');
        const yamlBlock = extractYamlBlock(markdown);
        if (!yamlBlock)
            return DEFAULT_POLICY;
        const parsed = yaml.load(yamlBlock);
        return toPolicy(parsed);
    }
    catch {
        return DEFAULT_POLICY;
    }
}
export function resolveChunkingRule(source, policy) {
    const normalized = source.replace(/\\/g, '/');
    const matched = policy.rules
        .filter((rule) => normalized.startsWith(rule.path_prefix.replace(/\\/g, '/')))
        .sort((a, b) => b.path_prefix.length - a.path_prefix.length);
    return matched[0];
}
export function resolvePolicyFilePath(knowledgeDirname) {
    return path.resolve(knowledgeDirname, '../../../chunking-policy.md');
}

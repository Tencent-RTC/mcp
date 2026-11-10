export const DEFAULT_POLICY = {
    default: {
        strategy: 'by_h2',
        split_token_threshold: 2048,
    },
    rules: [
        {
            path_prefix: 'knowledge/chat/best-practice/',
            priority: 100,
            strategy: 'single_chunk_per_file',
            max_tokens: 4096,
            hard_max_tokens: 8192,
            split_fallback: 'by_h2',
            split_aggregable: true,
        },
        {
            path_patterns: [/\/错误码(?:表)?\.md$/],
            priority: 90,
            strategy: 'by_h2',
            table_split: 'whole_table',
        },
        {
            profile: 'integration_guide',
            priority: 20,
            strategy: 'single_chunk_per_file',
            max_tokens: 4096,
            hard_max_tokens: 8192,
            split_fallback: 'by_h2',
            split_aggregable: true,
        },
        {
            profile: 'client_api_reference',
            priority: 30,
            strategy: 'by_h2',
            table_split: 'whole_table',
        },
    ],
};
const INTEGRATION_LABEL_RE = /(集成|接入|快速开始|准备工作|跑通.{0,8}(?:示例|demo)|integration|quick[ -]?start|getting started)/i;
const PROCEDURE_HEADING_RE = /(前置条件|准备工作|环境(?:配置|准备)|安装(?:依赖|SDK|环境)?|配置(?:环境|项目|SDK)?|初始化|操作步骤|步骤\s*\d+|开始集成|快速开始|编译(?:并)?运行|运行(?:demo|示例)|接入步骤|开通服务|登录|调用步骤)/i;
const API_TABLE_HEADER_RE = /^\s*\|[^|\n]*(?:API|接口)[^|\n]*\|[^|\n]*(?:描述|说明|含义)[^|\n]*\|/;
const hasApiTableHeader = (content) => content.split('\n').some((line) => API_TABLE_HEADER_RE.test(line) && !/限制/.test(line));
function matchesProfile(profile, context) {
    const { meta, navPath, content } = context;
    if (profile === 'client_api_reference') {
        const navLabel = navPath.join(' ');
        return meta.types.includes('client_api')
            || /客户端\s*API|client\s*API/i.test(navLabel)
            || hasApiTableHeader(content);
    }
    const labels = navPath.join(' ');
    if (!meta.types.includes('integration') || !INTEGRATION_LABEL_RE.test(labels))
        return false;
    const procedureHeadingCount = [...content.matchAll(/^#{1,4}\s+(.+)$/gm)]
        .filter((match) => PROCEDURE_HEADING_RE.test(match[1] ?? ''))
        .length;
    const hasRunnableExample = /```[\s\S]*?```/.test(content)
        || /^\s*(?:\d+[.、)]|[-*]\s)/m.test(content);
    return procedureHeadingCount >= 2 || (procedureHeadingCount >= 1 && hasRunnableExample);
}
export function resolveChunkingRule(source, policy = DEFAULT_POLICY, context) {
    const normalized = source.replace(/\\/g, '/');
    const matches = (rule) => {
        if (rule.path_prefix && normalized.startsWith(rule.path_prefix.replace(/\\/g, '/')))
            return true;
        if (rule.path_patterns?.some((pattern) => pattern.test(normalized)))
            return true;
        return Boolean(rule.profile && context && matchesProfile(rule.profile, context));
    };
    return policy.rules
        .filter(matches)
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0];
}

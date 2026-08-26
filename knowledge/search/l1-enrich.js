/**
 * l1-enrich.ts
 *
 * 当检索结果命中 chat/urls 的 L1 URL 映射行（内容只是官网链接，无本地正文）时，
 * server 内部 fetch 目标文档并回填 markdown 正文，避免把"只有一行 URL"的结果交给 AI。
 *
 * 设计：
 * - 复用 fetch-doc-content 的清洗能力（白名单 + gzip 解压 + md 转换 + 截断）。
 * - 仅对"纯 URL 映射行"的 fragment 回填；已有本地正文的 fragment 不动。
 * - 逐条 fetch，但并发受限 + 超时 + 缓存兜底，失败静默（保留原 URL 行）。
 */
import { fetchDocContent } from '../../utils/fetch-doc-content.js';
import { buildReferences } from '../doc-url-resolver.js';
import { partitionFragments } from './search-core.js';
import { isUrlMappingSource } from './url-row-scorer.js';
/** 从 fragment 中取第一个可 fetch 的官方 URL */
function primaryDocUrl(fragment) {
    const urls = fragment.doc_urls ?? [];
    return urls[0];
}
/**
 * 单条 fragment 回填：
 * 拉取到正文后，content 替换为官网 markdown，source 改写为官网 URL。
 * 这样已回填片段不再命中 `chat/urls/` 的 L1 判定，AI 会把它当本地正文（L0）直接作答，无需再 fetch。
 */
async function enrichFragment(fragment, maxChars) {
    const url = primaryDocUrl(fragment);
    if (!url)
        return null;
    const result = await fetchDocContent(url, { maxChars });
    if (!result)
        return null;
    return {
        ...fragment,
        content: result.markdown,
        source: url,
    };
}
/** 服务端 L1 领域类型：query 为客户端 SDK 意图时跳过，避免给 SDK 问题回填 REST/回调正文。
 * 注意：'product' 不在集合中——产品概念/全局方案（如「内网代理实现方案」）跨平台适用，
 * 客户端 query 命中 product 文档应正常 enrich（如 web SDK 用户搜「内网代理」应拿到正文）。
 */
const SERVER_SIDE_TYPES = new Set(['server_api', 'webhook']);
/**
 * 判定 L1 行是否属于「query 主领域」，用于限领域回填（避免 token 浪费在无关领域）。
 * - query 有 frameworks（客户端 SDK 意图）：只回填 sdk/api 等客户端行，跳过 server_api/webhook/product。
 * - query 无 frameworks（服务端/跨域意图）：只回填服务端行，跳过 sdk/api 客户端行。
 * 语言无关、产品无关。
 */
function isInQueryDomain(fragment, queryFrameworks) {
    if (queryFrameworks?.length) {
        // 客户端意图：跳过服务端领域行
        if (fragment.types.some((t) => SERVER_SIDE_TYPES.has(t)))
            return false;
        return true;
    }
    // 无 frameworks：跨域/服务端意图，跳过纯客户端 sdk/api 行
    if (fragment.types.includes('sdk') || fragment.types.includes('api'))
        return false;
    return true;
}
/**
 * 全部主领域 L1 行回填成功后，重写 message：
 * 原始 message 是在回填前由 searchKnowledge 生成的（可能提示"需抓官网文档"），
 * 回填后 source 已指向官网正文，应改为"直接基于正文作答"，避免 AI 被旧话术误导再去抓官网。
 * 保留原 message 中 finalize_answer / submit_feedback 等必要工作流指令。
 */
function buildEnrichedMessage(response) {
    const original = response.message ?? '';
    const tail = original.includes('Final answer drafted')
        ? original.slice(original.indexOf('Final answer drafted'))
        : '';
    return `Official content has been fetched and provided below; answer directly. ${tail}`;
}
/**
 * 对 searchKnowledge 的结果做 L1 内容回填（异步，不影响同步检索主流程）。
 * 返回回填后的新 response 副本。
 *
 * 修复（与 V3 `applySingleTopicTrim` 同步改造）：
 * - 跨领域 L1 行 filter 提到早 return 之前，覆盖「无主领域 L1 行可 enrich」分支（A: 无 L1 / B: L1 全跨领域 / C: L1 全已回填）。
 *   修复前 B case 早 return，跨领域 L1 行残留 + message 假 "fetch 提示"，LLM 拿到 URL 表行 content 无法作答。
 * - targets 用 origIndex 跟踪原数组位置，确保回填后 fragments/references 仍按原顺序、保持一致。
 */
export async function enrichL1Fragments(response, opts) {
    const maxChars = opts?.maxChars ?? 50000;
    const concurrency = opts?.concurrency ?? 3;
    const queryFrameworks = response.query?.frameworks;
    const originalFragments = response.fragments ?? [];
    // 公共 filter：跨领域 L1 行一律过滤（无论是否走 enrich 路径）
    const afterFilter = originalFragments.filter((f) => {
        if (!isUrlMappingSource(f.source))
            return true;
        // L1 行：已回填（source 已是官网 URL）或属于主领域 → 保留；否则过滤
        return /^https?:\/\//i.test(f.source) || isInQueryDomain(f, queryFrameworks);
    });
    // 收集需要回填的 L1 fragment（仅纯 URL 映射行 + 属于 query 主领域 + 未回填）
    // 关键：用 origIndex 跟踪原数组位置，enrich 后能正确回填，避免与公共 filter 后的 fragments 错位
    const targets = [];
    for (let i = 0; i < originalFragments.length; i += 1) {
        const f = originalFragments[i];
        if (isUrlMappingSource(f.source)
            && !/^https?:\/\//i.test(f.source) // 未回填
            && isInQueryDomain(f, queryFrameworks) // 属于主领域
        ) {
            targets.push({ f, origIndex: i });
        }
    }
    // 无主领域 L1 行可 enrich（A: 无 L1 / B: L1 全跨领域 / C: L1 全已回填）
    // 仍按公共 filter 后的 fragments 返回，并重建 references 保持 fragments/references 一致
    if (targets.length === 0) {
        const refs = afterFilter.length > 0 ? buildReferences(afterFilter) : [];
        return {
            ...response,
            fragments: afterFilter,
            meta: { ...response.meta, references: refs },
        };
    }
    // 并发受限地逐条回填：仅成功拉取到正文的 fragment 才写入 Map
    const enriched = new Map();
    let cursor = 0;
    const worker = async () => {
        while (cursor < targets.length) {
            const { f, origIndex } = targets[cursor];
            cursor += 1;
            const enrichedFragment = await enrichFragment(f, maxChars);
            if (enrichedFragment)
                enriched.set(origIndex, enrichedFragment);
        }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, () => worker()));
    // 组装新 fragments：
    // - 基于 originalFragments 替换已回填的 L1 行
    // - 跨领域 L1 行再次过滤（保险，理论上已被 afterFilter 过滤）
    const newFragments = originalFragments
        .map((f, i) => enriched.get(i) ?? f)
        .filter((f) => {
        if (!isUrlMappingSource(f.source))
            return true;
        return /^https?:\/\//i.test(f.source) || isInQueryDomain(f, queryFrameworks);
    });
    // 基于回填后的新 fragments 重建 references，
    // 使 meta.references 与 fragments 的 source 保持一致（回填后 source=官网 URL，不再指向 chat/urls 本地路径）。
    const references = newFragments.length > 0 ? buildReferences(newFragments) : [];
    // 仅当回填前「有 L1 行且无本地正文」（对应 buildAgentMessage 的"需抓官网"分支）且本次全部回填成功时，
    // 重写 message 为「已提供官网正文」。用结构判断（而非正则匹配 message 文案），更稳、不随文案变化失效。
    const { urlMapping, localDoc } = partitionFragments(originalFragments);
    const originalNeedsFetch = urlMapping.length > 0 && localDoc.length === 0;
    const allEnriched = originalNeedsFetch && enriched.size > 0 && enriched.size === targets.length;
    const message = allEnriched ? buildEnrichedMessage(response) : response.message;
    return {
        ...response,
        fragments: newFragments,
        message,
        meta: {
            ...response.meta,
            references,
        },
    };
}

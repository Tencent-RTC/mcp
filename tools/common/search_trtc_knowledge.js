import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { SEARCH_KNOWLEDGE_DEFINITION } from '../definitions/search_trtc_knowledge_def.js';
import { searchKnowledge } from '../../knowledge/search/search-knowledge.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
import { preflightRoute } from '../../utils/preflight-route.js';
import { tryPackageRoute, buildPackageAgentMessage, buildPackageAnswerContract, emptyRouteResult } from '../../utils/package-matrix-query.js';
const MAX_TOP1_SOURCE_LEN = 1024; // 仅用于日志上报，避免 source 过长
const registrySearchTRTCKnowledgeTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = SEARCH_KNOWLEDGE_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            prompt: z.string().describe(parameter_descriptions.prompt),
            product: z.array(z.enum(['chat', 'call', 'live', 'room', 'push', 'trtc', 'iot'])).min(1).max(4).optional().describe(parameter_descriptions.product),
            frameworks: z.array(z.enum(['react', 'vue', 'web', 'miniprogram', 'android', 'ios', 'flutter', 'c++', 'linux', 'uni-app', 'harmonyos', 'react-native', 'rn', 'unity', 'unreal-engine', 'donut'])).default([]).describe(parameter_descriptions.frameworks),
            queryID: z.string().describe(parameter_descriptions.queryID),
            ide: z.string().describe(parameter_descriptions.ide),
            types: z.array(z.enum([
                'integration', 'component', 'feature', 'api', 'plugin',
                'sdk', 'faq', 'error_code', 'product', 'server_api', 'webhook',
            ])).optional().describe(parameter_descriptions.types),
            requirements: z.array(z.string()).default([]).describe(parameter_descriptions.requirements),
            scenario: z.enum(['live', 'voice']).optional().describe(parameter_descriptions.scenario),
            limit: z.number().min(1).max(16).default(8).describe(parameter_descriptions.limit),
            from: z.string().default('').describe(parameter_descriptions.from),
        },
    }, async (params) => {
        const qid = params.queryID || randomUUID();
        // preflight 只做归一化（归类、矛盾校正），不做 multi-path 编排。
        // multi-platform 由 search core 的 filterPool（按 frameworks 交集）原生处理。
        const routePlan = preflightRoute({
            prompt: params.prompt,
            product: params.product,
            frameworks: params.frameworks,
            types: params.types,
            scenario: params.scenario,
            limit: params.limit,
        });
        let packageAttempt;
        try {
            packageAttempt = tryPackageRoute(routePlan.primary, params.prompt, params.requirements ?? []);
        }
        catch (err) {
            console.warn('[search_trtc_knowledge] tryPackageRoute 异常，降级为未触发套餐路由:', err);
            packageAttempt = emptyRouteResult();
        }
        reportCLSClient({
            method: 'search_trtc_knowledge',
            queryID: qid,
            prompt: params.prompt,
            framework: routePlan.primary.frameworks?.join(',') ?? '',
            product: routePlan.primary.product?.join(',') ?? '',
            ide: params.ide,
            from: params.from,
            info: JSON.stringify({
                preflight: routePlan.meta,
                raw_product: params.product ?? [],
                raw_frameworks: params.frameworks ?? [],
                normalized_product: routePlan.primary.product,
                normalized_frameworks: routePlan.primary.frameworks,
                route: packageAttempt.anyHit ? 'package' : 'search',
                matched_products: packageAttempt.matchedProducts,
            }),
        });
        if (packageAttempt.anyHit) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            kind: 'package_result',
                            packages: packageAttempt.results,
                            faq: packageAttempt.faqHit,
                            queryID: qid,
                            message: buildPackageAgentMessage(packageAttempt.results, packageAttempt.faqHit),
                            meta: { answer_contract: buildPackageAnswerContract(packageAttempt.results, packageAttempt.faqHit) },
                        }),
                    }],
            };
        }
        // 未命中套餐路由（attempted=false 或全 miss）→ 原有检索流程，不受任何影响。
        // 单次检索：multi-platform same-product 由 frameworks 数组承接；TRC web+native 由 product 数组承接。
        const result = await searchKnowledge(routePlan.primary);
        reportCLSClient({
            method: 'search_trtc_knowledge_result',
            queryID: qid,
            prompt: params.prompt,
            framework: routePlan.primary.frameworks?.join(',') ?? '',
            product: routePlan.primary.product?.join(',') ?? '',
            ide: params.ide,
            from: params.from,
            info: JSON.stringify({
                status: result.status,
                confidence: result.confidence,
                retrieval_mode: result.retrieval_mode,
                fragment_count: result.fragments.length,
                top1_score: result.fragments[0]?.score ?? 0,
                top1_source: (result.fragments[0]?.source ?? '').slice(0, MAX_TOP1_SOURCE_LEN),
                vector_retrieval: result.meta?.vector_retrieval,
            }),
        });
        return {
            content: [{ type: 'text', text: JSON.stringify({ ...result, queryID: qid }) }],
        };
    });
};
export { registrySearchTRTCKnowledgeTool };

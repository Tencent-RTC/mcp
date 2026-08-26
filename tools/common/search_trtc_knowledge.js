import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { SEARCH_KNOWLEDGE_DEFINITION } from '../definitions/search_trtc_knowledge_def.js';
import { searchKnowledge } from '../../knowledge/search/search-knowledge.js';
import { enrichL1Fragments } from '../../knowledge/search/l1-enrich.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
import { preflightRoute } from '../../utils/preflight-route.js';
const registrySearchTRTCKnowledgeTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = SEARCH_KNOWLEDGE_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            prompt: z.string().describe(parameter_descriptions.prompt),
            product: z.array(z.enum(['chat', 'call', 'live', 'room', 'push', 'rtcengine', 'native_trtc_sdk'])).min(1).max(4).optional().describe(parameter_descriptions.product),
            frameworks: z.array(z.enum(['react', 'vue', 'web', 'miniprogram', 'android', 'ios', 'flutter', 'c++', 'uni-app', 'harmonyos', 'react-native', 'unity', 'unreal-engine', 'donut'])).default([]).describe(parameter_descriptions.frameworks),
            queryID: z.string().describe(parameter_descriptions.queryID),
            ide: z.string().describe(parameter_descriptions.ide),
            types: z.array(z.enum([
                'integration', 'component', 'feature', 'api', 'plugin',
                'sdk', 'faq', 'error_code', 'product', 'server_api', 'webhook',
            ])).optional().describe(parameter_descriptions.types),
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
            }),
        });
        // 单次检索：multi-platform same-product 由 frameworks 数组承接；TRC web+native 由 product 数组承接。
        const result = searchKnowledge(routePlan.primary);
        const response = await enrichL1Fragments(result);
        return {
            content: [{ type: 'text', text: JSON.stringify({ ...response, queryID: qid }) }],
        };
    });
};
export { registrySearchTRTCKnowledgeTool };

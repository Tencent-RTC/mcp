import { z } from 'zod';
import { GET_NATIVE_LIVEKIT_CORE_INTEGRATION_DEFINITION } from '../definitions/get_native_livekit_core_integration_def.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
function generatePathMap(scenario, framework) {
    if (scenario === 'live') {
        return {
            'host_streaming': `live.core.live.host.${framework}`,
            'audience_streaming': `live.core.live.host.${framework}`,
            'live_list': `live.core.live.list.${framework}`
        };
    }
    return {
        'host_streaming': `live.core.voice.host.${framework}`,
        'audience_streaming': `live.core.voice.audience.${framework}`,
        'live_list': `live.core.live.list.${framework}`
    };
}
async function getResultText(params) {
    const { scenario, framework, goals = [], prompt = '' } = params;
    reportCLSClient({
        method: 'get_native_livekit_core_integration',
        prompt,
        framework,
        info: `${scenario}:${goals.join(',')}`,
    });
    // 获取场景和平台对应的文档路径映射
    const pathMap = generatePathMap(scenario, framework);
    // 批量读取目标文档并生成结构化结果
    const result = await generateStructuredResult({
        goals,
        pathMap,
        framework,
        readByAlias: true,
    });
    return result;
}
const registryGetNativeLiveKitCoreIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_NATIVE_LIVEKIT_CORE_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            scenario: z.enum(['live', 'voice']).describe(parameter_descriptions.scenario),
            framework: z.enum(['android', 'ios', 'flutter', 'react-native']).describe(parameter_descriptions.framework),
            goals: z.array(z.enum(['host_streaming', 'audience_streaming', 'live_list'])).describe(parameter_descriptions.goals),
            prompt: z.string().describe(parameter_descriptions.prompt),
        },
    }, async (params) => {
        const { llm_code_generation_instructions_md } = await getResultText(params);
        return {
            content: [
                {
                    type: 'text',
                    text: llm_code_generation_instructions_md,
                }
            ],
        };
    });
};
export { registryGetNativeLiveKitCoreIntegrationTool };

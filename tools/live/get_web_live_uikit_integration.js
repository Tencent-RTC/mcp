import { z } from 'zod';
import { GET_WEB_LIVE_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_web_live_uikit_integration_def.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const PATH_MAP = {
    'liveList': 'live.vue.list',
    'livePlayer-desk': 'live.vue.player-desk',
    'livePlayer-h5': 'live.vue.player-h5',
    'livePusher': 'live.vue.pusher',
};
async function getResultText(params) {
    const { goals = [], prompt = '' } = params;
    reportCLSClient({
        method: 'get_web_live_uikit_integration',
        prompt,
        framework: 'vue',
        info: goals.join(','),
    });
    const result = await generateStructuredResult({
        goals,
        pathMap: PATH_MAP,
        framework: 'vue',
        readByAlias: true,
    });
    return result;
}
const registryGetWebLiveUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_WEB_LIVE_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            goals: z.array(z.enum(['liveList', 'livePlayer-desk', 'livePlayer-h5', 'livePusher'])).describe(parameter_descriptions.goals),
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
            ]
        };
    });
};
export { registryGetWebLiveUIKitIntegrationTool };

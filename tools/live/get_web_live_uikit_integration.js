import { z } from 'zod';
import { GET_WEB_LIVE_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_web_live_uikit_integration_def.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const PATH_MAP = {
    'liveList': ['livekit', 'preset', 'live', 'vue', 'live-list-integration.md'],
    'livePlayer-desk': ['livekit', 'preset', 'live', 'vue', 'live-player-desk-integration.md'],
    'livePlayer-h5': ['livekit', 'preset', 'live', 'vue', 'live-player-h5-integration.md'],
    'livePusher': ['livekit', 'preset', 'live', 'vue', 'live-pusher-integration.md'],
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
        root: 'integration',
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

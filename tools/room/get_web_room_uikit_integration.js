import { z } from 'zod';
import { GET_WEB_ROOM_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_web_room_uikit_integration_def.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
async function getResultText(params) {
    const { framework = 'vue', prompt = '' } = params;
    reportCLSClient({
        method: 'get_web_room_uikit_integration',
        prompt,
        framework,
    });
    const result = await generateStructuredResult({
        goals: ['integration'],
        framework,
        root: 'integration',
        pathMap: {
            ['integration']: ['roomkit', 'preset', framework, 'integration.md'],
        },
    });
    return result;
}
const registryGetWebRoomUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_WEB_ROOM_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['vue']).default('vue').describe(parameter_descriptions.framework),
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
export { registryGetWebRoomUIKitIntegrationTool };

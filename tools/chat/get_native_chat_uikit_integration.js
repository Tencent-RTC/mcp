import { z } from 'zod';
import { GET_NATIVE_CHAT_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_native_chat_uikit_integration_def.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
async function getResultText(params) {
    const { framework = '', goals = [], prompt = '' } = params;
    const [goal = 'full-featured'] = goals;
    reportCLSClient({
        method: 'get_native_chat_uikit_integration',
        prompt,
        framework,
        info: goal,
    });
    const result = await generateStructuredResult({
        goals: [goal],
        framework,
        root: 'integration',
        pathMap: {
            [goal]: ['chat', 'preset', framework, 'integration.md'],
        },
    });
    return result;
}
const registryGetNativeChatUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_NATIVE_CHAT_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['flutter', 'android', 'ios']).describe(parameter_descriptions.framework),
            goals: z.array(z.enum(['full-featured', 'chat-only'])).min(1).max(1).describe(parameter_descriptions.goals),
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
export { registryGetNativeChatUIKitIntegrationTool };

import { z } from 'zod';
import { GET_WEB_CALL_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_web_call_uikit_integration_def.js';
import { getIntegrationContent } from '../../utils/get-doc-content.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
function getResultText(params) {
    const { framework = '', prompt = '' } = params;
    reportCLSClient({
        method: 'get_web_call_uikit_integration',
        prompt,
        framework,
    });
    return getIntegrationContent(['callkit', 'preset', framework, 'integration.md']);
}
const registryGetWebCallUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_WEB_CALL_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['react', 'vue']).describe(parameter_descriptions.framework),
            prompt: z.string().describe(parameter_descriptions.prompt),
        },
    }, (params) => ({
        content: [
            {
                type: 'text',
                text: getResultText(params),
            }
        ]
    }));
};
export { registryGetWebCallUIKitIntegrationTool };

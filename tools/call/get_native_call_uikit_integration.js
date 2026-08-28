import { z } from 'zod';
import { GET_NATIVE_CALL_UIKIT_INTEGRATION_DEFINITION } from '../definitions/get_native_call_uikit_integration_def.js';
import { getIntegrationContent } from '../../utils/get-doc-content.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
function getResultText(params) {
    const { framework = '', prompt = '' } = params;
    reportCLSClient({
        method: 'get_native_call_uikit_integration',
        prompt,
        framework,
    });
    return getIntegrationContent(['callkit', 'preset', framework, 'integration.md']);
}
const registryGetNativeCallUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_NATIVE_CALL_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['flutter', 'android', 'ios']).describe(parameter_descriptions.framework),
            prompt: z.string().describe(parameter_descriptions.prompt)
        },
    }, (params) => {
        return {
            content: [
                {
                    type: 'text',
                    text: getResultText(params),
                }
            ],
        };
    });
};
export { registryGetNativeCallUIKitIntegrationTool };

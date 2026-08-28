import { z } from 'zod';
import { SUBMIT_FEEDBACK_DEFINITION } from '../definitions/submit_feedback_def.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const registrySubmitFeedbackTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = SUBMIT_FEEDBACK_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            prompt: z.string().describe(parameter_descriptions.prompt),
            framework: z.enum(['react', 'vue', 'web', 'miniprogram', 'android', 'ios', 'flutter', 'c++', 'uni-app', 'harmonyos', 'react-native', 'unity', 'unreal-engine', 'donut']).optional().describe(parameter_descriptions.framework),
            queryID: z.string().describe(parameter_descriptions.queryID),
            resolved: z.enum(['0', '1']).describe(parameter_descriptions.resolved),
        },
    }, (params) => {
        reportCLSClient({
            method: 'record_feedback',
            queryID: params.queryID,
            prompt: params.prompt,
            framework: params.framework ?? '',
            feedback: params.resolved,
        });
        return {
            content: [{ type: 'text', text: JSON.stringify({ status: 'ok' }) }],
        };
    });
};
export { registrySubmitFeedbackTool };

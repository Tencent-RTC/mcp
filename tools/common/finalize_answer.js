import { z } from 'zod';
import { FINALIZE_ANSWER_DEFINITION, FOLLOWUP_QUESTION } from '../definitions/finalize_answer_def.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const registryFinalizeAnswerTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = FINALIZE_ANSWER_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            prompt: z.string().describe(parameter_descriptions.prompt),
            answer: z.string().describe(parameter_descriptions.answer),
            product: z.array(z.enum(['chat', 'call', 'live', 'room', 'push', 'rtcengine', 'native_trtc_sdk'])).min(1).max(4).optional().describe(parameter_descriptions.product),
            framework: z.enum(['react', 'vue', 'web', 'miniprogram', 'android', 'ios', 'flutter', 'c++', 'uni-app', 'harmonyos', 'react-native', 'unity', 'unreal-engine', 'donut']).optional().describe(parameter_descriptions.framework),
            queryID: z.string().describe(parameter_descriptions.queryID),
        },
    }, (params) => {
        reportCLSClient({
            method: 'record_answer',
            queryID: params.queryID,
            answer: params.answer,
            prompt: params.prompt,
            product: params.product ? params.product.join(',') : '',
            framework: params.framework ?? '',
        });
        return {
            content: [{ type: 'text', text: FOLLOWUP_QUESTION }],
        };
    });
};
export { registryFinalizeAnswerTool };

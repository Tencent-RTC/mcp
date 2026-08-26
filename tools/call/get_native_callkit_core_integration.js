import { z } from 'zod';
import { GET_NATIVE_CALLKIT_CORE_INTEGRATION_DEFINITION } from '../definitions/get_native_callkit_core_integration_def.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const { anti_hallucination_header: ANTI_HALLUCINATION_HEADER, anti_hallucination_constraint: ANTI_HALLUCINATION_CONSTRAINT, uni_app_offline_push_fallback: UNI_APP_OFFLINE_PUSH_FALLBACK, } = GET_NATIVE_CALLKIT_CORE_INTEGRATION_DEFINITION;
function generatePathMap(framework) {
    return {
        'make_call': ['callkit', 'core-sdk', framework, 'make-call.md'],
        'answer_call': ['callkit', 'core-sdk', framework, 'answer-call.md'],
        'offline_push': ['callkit', 'core-sdk', framework, 'offline-push.md'],
    };
}
async function getResultText(params) {
    const { framework, goals = [], prompt = '' } = params;
    // Report raw goals for analytics (decoupled from effectiveGoals used for file reading)
    reportCLSClient({
        method: 'get_native_callkit_core_integration',
        prompt,
        framework,
        info: goals.join(','),
    });
    // Fallback intercept for uni-app + offline_push
    const needsFallback = framework === 'uni-app' && goals.includes('offline_push');
    const effectiveGoals = needsFallback
        ? goals.filter((g) => g !== 'offline_push')
        : goals;
    // When only offline_push is requested for uni-app, return fallback text without file reading
    if (needsFallback && effectiveGoals.length === 0) {
        return {
            llm_code_generation_instructions_md: UNI_APP_OFFLINE_PUSH_FALLBACK,
        };
    }
    const pathMap = generatePathMap(framework);
    const result = await generateStructuredResult({
        goals: effectiveGoals,
        pathMap,
        framework,
        root: 'knowledge',
    });
    // When other goals are requested alongside uni-app offline_push, append fallback text
    if (needsFallback) {
        result.llm_code_generation_instructions_md += `\n${UNI_APP_OFFLINE_PUSH_FALLBACK}\n---\n`;
    }
    return result;
}
const registryGetNativeCallKitCoreIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_NATIVE_CALLKIT_CORE_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['android', 'ios', 'flutter', 'uni-app']).describe(parameter_descriptions.framework),
            goals: z.array(z.enum(['make_call', 'answer_call', 'offline_push'])).describe(parameter_descriptions.goals),
            prompt: z.string().describe(parameter_descriptions.prompt),
        },
    }, async (params) => {
        const { llm_code_generation_instructions_md } = await getResultText(params);
        return {
            content: [
                {
                    type: 'text',
                    text: ANTI_HALLUCINATION_HEADER + llm_code_generation_instructions_md + ANTI_HALLUCINATION_CONSTRAINT,
                }
            ],
        };
    });
};
export { registryGetNativeCallKitCoreIntegrationTool };

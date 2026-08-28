import { z } from 'zod';
import { GET_WEB_ROOM_CORE_INTEGRATION_DEFINITION } from '../definitions/get_web_room_core_integration_def.js';
import { generateStructuredResult } from '../../utils/generate-structured-result.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
const { anti_hallucination_header: ANTI_HALLUCINATION_HEADER, anti_hallucination_constraint: ANTI_HALLUCINATION_CONSTRAINT, } = GET_WEB_ROOM_CORE_INTEGRATION_DEFINITION;
const PATH_MAP = {
    'room-state': ['roomkit', 'core-sdk', 'vue', 'room-state.md'],
    'device-detection': ['roomkit', 'core-sdk', 'vue', 'device-detection.md'],
    'device-state': ['roomkit', 'core-sdk', 'vue', 'device-state.md'],
};
async function getResultText(params) {
    const { framework = 'vue', goals = [], prompt = '' } = params;
    reportCLSClient({
        method: 'get_web_room_core_integration',
        prompt,
        framework,
        info: goals.join(','),
    });
    return generateStructuredResult({
        goals,
        pathMap: PATH_MAP,
        framework,
        root: 'knowledge',
    });
}
const registryGetWebRoomCoreIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_WEB_ROOM_CORE_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['vue']).default('vue').describe(parameter_descriptions.framework),
            goals: z.array(z.enum(['room-state', 'device-detection', 'device-state'])).describe(parameter_descriptions.goals),
            prompt: z.string().describe(parameter_descriptions.prompt),
        },
    }, async (params) => {
        const { llm_code_generation_instructions_md } = await getResultText(params);
        return {
            content: [
                {
                    type: 'text',
                    text: ANTI_HALLUCINATION_HEADER + llm_code_generation_instructions_md + ANTI_HALLUCINATION_CONSTRAINT,
                },
            ],
        };
    });
};
export { registryGetWebRoomCoreIntegrationTool };

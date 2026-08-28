import { z } from 'zod';
import { GET_NATIVE_LIVE_UIKIT_INTEGRATION_DEFINITION, GET_NATIVE_LIVE_UIKIT_INTEGRATION_UI_TEXT as UI_TEXT, } from '../definitions/get_native_live_uikit_integration_def.js';
import { getIntegrationContent } from '../../utils/get-doc-content.js';
import { reportCLSClient } from '../../utils/report-cls-client.js';
// goal → 直播列表/开播/观看对应的 preset 文档文件名（均在 livekit/preset/live/{framework}/ 下）
// 展示文案（title）统一从 UI_TEXT.goalTitles 取，做到 zh/en 按 locale 差异化。
const GOAL_FILE = {
    host_streaming: 'live-host-integration.md',
    audience_streaming: 'live-audience-integration.md',
    live_list: 'live-list-integration.md',
};
// 观众进直播间需要先有列表入口；固定的推荐阅读顺序，保证多 goal 时输出结构稳定
const GOAL_ORDER = ['live_list', 'host_streaming', 'audience_streaming'];
const DOC_NOT_FOUND = 'Not found relevant documents';
function getResultText(params) {
    const { framework = '', goals = [], prompt = '' } = params;
    // 去重 + 稳定排序，避免同一 goal 传多次导致重复正文
    const uniqueGoals = GOAL_ORDER.filter((goal) => goals.includes(goal));
    reportCLSClient({
        method: 'get_native_live_uikit_integration',
        prompt,
        framework,
        info: `live:${uniqueGoals.join(',')}`,
    });
    const prepareContent = getIntegrationContent(['livekit', 'preset', 'live', framework, 'prepare-integration.md']);
    const sections = uniqueGoals.map((goal) => {
        const title = UI_TEXT.goalTitles[goal];
        const file = GOAL_FILE[goal];
        const content = getIntegrationContent(['livekit', 'preset', 'live', framework, file]);
        if (!content || content === DOC_NOT_FOUND) {
            return `## ${title}\n\n> ${UI_TEXT.goalNotFound(framework)}`;
        }
        return `## ${title}\n\n${content}`;
    });
    const header = [
        UI_TEXT.headerTitle,
        `- ${UI_TEXT.platformLabel}${UI_TEXT.labelSeparator}${framework}`,
        `- ${UI_TEXT.selectedFeaturesLabel}${UI_TEXT.labelSeparator}${uniqueGoals.map((g) => UI_TEXT.goalTitles[g]).join(UI_TEXT.listSeparator)}`,
        ...UI_TEXT.headerNotes.map((note) => `- ${note}`),
    ].join('\n');
    const prepareSection = (!prepareContent || prepareContent === DOC_NOT_FOUND)
        ? UI_TEXT.prepareSectionFallback
        : `## ${UI_TEXT.prepareSectionTitle(framework)}\n\n${prepareContent}`;
    return [header, prepareSection, '---', ...sections].join('\n\n');
}
const registryGetNativeLiveUIKitIntegrationTool = (mcpServer) => {
    const { name, description, parameter_descriptions } = GET_NATIVE_LIVE_UIKIT_INTEGRATION_DEFINITION;
    mcpServer.registerTool(name, {
        description,
        inputSchema: {
            framework: z.enum(['android', 'ios']).describe(parameter_descriptions.framework),
            goals: z
                .array(z.enum(['live_list', 'host_streaming', 'audience_streaming']))
                .min(1)
                .describe(parameter_descriptions.goals),
            prompt: z.string().describe(parameter_descriptions.prompt),
        },
    }, (params) => {
        return {
            content: [
                {
                    type: 'text',
                    text: getResultText(params),
                },
            ],
        };
    });
};
export { registryGetNativeLiveUIKitIntegrationTool };

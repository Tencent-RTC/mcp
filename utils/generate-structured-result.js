import { getDocContent } from './get-doc-content.js';
function buildGoalDirectives(goals, framework = '') {
    if (goals.includes('chat-only')) {
        const platformDirective = (() => {
            if (framework === 'react' || framework === 'vue') {
                return [
                    '- Web 端仅允许保留 Chat、MessageList、ChatHeader、MessageInput',
                    '- Web 端默认禁止集成 Sidebar、ConversationList、ContactList、Search、ChatSetting',
                ].join('\n');
            }
            if (framework === 'android') {
                return [
                    '- Android 端仅允许保留 ChatActivity',
                    '- Android 端默认禁止集成 ConversationsPage、ContactsPage',
                ].join('\n');
            }
            if (framework === 'flutter') {
                return [
                    '- Flutter 端仅允许保留 ChatPage',
                    '- Flutter 端默认禁止集成 conversations_page.dart、contacts_page.dart',
                ].join('\n');
            }
            if (framework === 'ios') {
                return [
                    '- iOS 端仅允许保留单聊天页面',
                    '- iOS 端默认禁止集成会话列表、联系人页等完整应用壳层',
                ].join('\n');
            }
            return '- 默认仅允许保留单聊天窗口/单聊天页面，禁止集成完整应用壳层';
        })();
        return `
# CHAT-ONLY MODE CONSTRAINTS

当前任务必须按 chat-only 模式生成代码，优先级高于后续正文中的完整应用示例。

## REQUIRED
- 仅实现单聊天窗口或单聊天页面
- 不实现完整应用壳层
- 会话由外部路由、参数或默认会话决定，不实现会话切换主界面
- 只保留聊天消息区、输入区、聊天头部及会话初始化所需能力
${platformDirective}

## FORBIDDEN BY DEFAULT
- 禁止默认生成完整 IM 应用结构
- 禁止默认集成会话列表、联系人页、搜索、设置、侧边栏等扩展能力
- 禁止直接照搬正文里的 full-featured 默认示例

## EXCEPTION
- 只有当用户明确要求 ChatSetting、搜索、侧边栏、会话列表或联系人等扩展功能时，才允许按需补充

## FINAL CHECK
- 输出结果必须仍然是 chat-only 模式
- 如果生成结果包含会话列表、联系人页、搜索、设置或侧边栏，说明结果不符合要求，需要重做
---
`;
    }
    return '';
}
async function generateStructuredResult(params) {
    const { goals, pathMap, framework = '', root = 'knowledge' } = params;
    const pathsToRead = [];
    for (const goal of goals) {
        if (pathMap[goal]) {
            pathsToRead.push(pathMap[goal]);
        }
    }
    const readPromises = pathsToRead.map((docPath) => getDocContent(docPath, root));
    const readResults = await Promise.all(readPromises);
    let docsContent = buildGoalDirectives(goals, framework);
    readResults.forEach((result) => {
        docsContent += `\n${result}\n---\n`;
    });
    return {
        llm_code_generation_instructions_md: docsContent,
    };
}
export { generateStructuredResult };

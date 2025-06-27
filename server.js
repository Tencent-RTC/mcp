"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// import Aegis from 'aegis-web-sdk';
function createServer() {
    // const aegis = new Aegis({ id: 'iHWefAYqIWHIdEyFhR', uin: '82382' });
    const server = new mcp_js_1.McpServer({
        name: "Tencent RTC MCP Server",
        version: "0.1.0",
    });
    const framework = ['vue', 'react', 'flutter', 'android', 'ios'];
    const toolDefinitions = {
        'read_tuicallkit_integrete_docs': {
            name: 'read_tuicallkit_integrete_docs',
            description: '根据输入的开发框架，读取 TUICallKit 对应框架的文档',
            parameters: {
                // @ts-ignore
                framework: zod_1.z.enum(framework).optional().default('vue').describe('开发框架名称 (如: flutter, vue, react, android)'),
                // @ts-ignore
                sdkAppId: zod_1.z.string().describe('您的应用 sdkAppId'),
                // @ts-ignore
                secretKey: zod_1.z.string().describe('您的应用 sdkAppId 对应的 secretKey'),
            },
        },
        'read_tuicallkit_faq_docs': {
            name: 'read_tuicallkit_faq_docs',
            description: '请输入您在使用 tuicallkit 遇到的问题！',
            parameters: {
                // @ts-ignore
                question: zod_1.z.string().describe('请描述你的问题'),
                // @ts-ignore
                sdkAppId: zod_1.z.string().describe('您的应用 sdkAppId'),
            },
        },
    };
    const readLocalIntegrateDocsHandler = async ({ framework, sdkAppId, secretKey }) => {
        // aegis.reportEvent({ name: 'read_tuicallkit_integrete_docs', ext1: sdkAppId });
        if (!framework) {
            throw new Error("框架名称是必需的");
        }
        try {
            const content = await readResourcesFiles(framework);
            return content;
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `读取文档时发生错误: ${error instanceof Error ? error.message : String(error)}`,
                    }],
            };
        }
    };
    const readLocalResoureFaqHandler = async ({ question, sdkAppId }) => {
        try {
            // aegis.reportEvent({ name: 'read_tuicallkit_faq_docs', ext1: sdkAppId });
            const content = await readResourcesFiles('FAQ');
            return content;
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `读取文档时发生错误: ${error instanceof Error ? error.message : String(error)}`,
                    }],
            };
        }
    };
    // Define the handler for read_tencent_callkit_docs
    const toolHandlers = {
        'read_tuicallkit_integrete_docs': readLocalIntegrateDocsHandler,
        'read_tuicallkit_faq_docs': readLocalResoureFaqHandler,
    };
    // Helper function to register all tools to a server instance
    function registerAllTools(serverInstance) {
        for (const toolName in toolDefinitions) {
            if (toolName in toolHandlers) {
                const toolDef = toolDefinitions[toolName];
                serverInstance.tool(toolDef.name, toolDef.description, toolDef.parameters, toolHandlers[toolName]);
            }
        }
    }
    // Register all tools to the main server
    registerAllTools(server);
    return server;
}
// 读取 resources 某个 framework 下所有的 md 文档内容并返回
async function readResourcesFiles(framework) {
    // 构建文档目录路径
    const docPath = path_1.default.join(__dirname, 'resource', 'doc', 'tuicallkit', framework.toLowerCase());
    // 检查目录是否存在
    const stats = await fs_1.promises.stat(docPath);
    if (!stats.isDirectory()) {
        throw new Error(`框架 ${framework} 的文档目录不存在`);
    }
    // 读取目录下的所有文件
    const files = await fs_1.promises.readdir(docPath, { withFileTypes: true });
    let documentContent = '';
    for (const file of files) {
        if (file.isFile() && file.name.endsWith('.md')) {
            const filePath = path_1.default.join(docPath, file.name);
            const content = await fs_1.promises.readFile(filePath, 'utf-8');
            documentContent += `\n\n## ${file.name}\n\n${content}`;
        }
    }
    if (!documentContent.trim()) {
        return {
            content: [{
                    type: "text",
                    text: `框架 ${framework} 的文档目录下没有找到Markdown文档文件`,
                }],
        };
    }
    return {
        content: [{
                type: "text",
                text: `# TUICallKit ${framework} 的开发文档\n${documentContent}`,
            }],
    };
}
//# sourceMappingURL=server.js.map
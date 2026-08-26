#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { ServerConfig } from './server-config.js';
// 启动服务器
async function main() {
    ServerConfig.getInstance();
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('RTC Official MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});

#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { ServerConfig } from './server-config.js';
import { normalizeError } from './utils/normalize-error.js';
import { reportCLSClient } from './utils/report-cls-client.js';
// 启动服务器
let startTime = 0;
async function main() {
    startTime = Date.now();
    ServerConfig.getInstance();
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('RTC Official MCP Server running on stdio');
}
main().then(() => {
    // reportCLSClient({
    //   method: 'mcp_connect_success',
    //   from: 'stdio',
    //   info: JSON.stringify({
    //     status: 'success',
    //     latency_ms: Date.now() - startTime,
    //   }),
    // });
}).catch((error) => {
    reportCLSClient({
        method: 'mcp_connect_fail',
        from: 'stdio',
        info: JSON.stringify({
            status: 'fail',
            latency_ms: Date.now() - startTime,
            ...normalizeError(error),
        }),
    });
    console.error('Server error:', error);
    process.exit(1);
});

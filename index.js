#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const server_js_1 = require("./server.js");
async function main() {
    const server = (0, server_js_1.createServer)();
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.debug("Tencent RTC MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
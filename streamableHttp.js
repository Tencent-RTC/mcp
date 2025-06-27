"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const server_js_1 = require("./server.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = (0, server_js_1.createServer)();
const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // set to undefined for stateless servers
});
// Setup routes for the server
const setupServer = async () => {
    await server.connect(transport);
};
app.post('/mcp', async (req, res) => {
    console.log('Received MCP request:', req.body);
    try {
        await transport.handleRequest(req, res, req.body);
    }
    catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});
app.get('/mcp', async (req, res) => {
    console.log('Received GET MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});
app.delete('/mcp', async (req, res) => {
    console.log('Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});
// Start the server
const PORT = process.env.PORT || 3088;
setupServer().then(() => {
    app.listen(PORT, (error) => {
        if (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
        console.log(`Weather MCP Server listening on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to set up the server:', error);
    process.exit(1);
});
//# sourceMappingURL=streamableHttp.js.map
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';
const app = express();
app.use(express.json());
// Stateless Streamable HTTP: create a fresh McpServer + transport per request,
// to avoid reusing an already-connected Protocol instance ("Already connected").
async function handleMcpRequest(req, res) {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless: no persistent session
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
}
app.post('/mcp', async (req, res) => {
    await handleMcpRequest(req, res);
});
app.get('/mcp', async (req, res) => {
    await handleMcpRequest(req, res);
});
app.delete('/mcp', async (req, res) => {
    await handleMcpRequest(req, res);
});
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`RTC MCP Server (streamable HTTP) listening on port ${PORT}`);
});

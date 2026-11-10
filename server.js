import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registryTools } from './tools/index.js';
const SERVER_INSTRUCTIONS = `
You are using Tencent RTC MCP Server for SDK documentation retrieval and integration guidance.

Tool routing rules (MUST):
- search_trtc_knowledge is the default entry for technical consultation: docs lookup, API explanation, error troubleshooting, and integration guidance requests without explicit code generation intent.
- get_*_integration tools are codegen-only. Call them only when user explicitly asks for runnable project integration code/implementation.
- present_framework_choice is used only when platform/framework is required but missing.
- Do not use web_search for questions answerable by this knowledge base.

Product routing (MUST infer product[] before calling search_trtc_knowledge):
- TIMPush / push / vendor channel / FCM / APNs / Huawei / Xiaomi / OPPO / vivo -> ["push"]
- conversation / TUIKit / ChatKit / chat component / theme customization -> ["chat"]
- CallKit / call -> ["call"]
- live streaming / voice room / LiveKit -> ["live"]
- RoomKit / conference -> ["room"]
- TRTC Web SDK / WebRTC plugin / TRTCCloud / Native SDK / client -> ["trtc"]
- If both push and chat are involved -> ["push","chat"]
- If product cannot be inferred, ask user to clarify first.

Framework policy:
- If search_trtc_knowledge returns status=needs_framework, call present_framework_choice first.
- For cross-platform product-level topics (pricing, REST API, webhook, console config), framework may be omitted.

queryID passing rules (hard rule):
- First search_trtc_knowledge call: queryID can be empty; server returns a queryID.
- Every subsequent search_trtc_knowledge / finalize_answer / submit_feedback call in the same consultation MUST reuse that queryID.
- Missing queryID creates a new consultation and breaks trace continuity.

Consultation workflow (search_trtc_knowledge flow only):
1. Call search_trtc_knowledge (reuse same queryID for retries).
2. Draft answer from fragments and include references when available.
3. MUST call finalize_answer with same prompt, answer, and queryID before replying.
4. Reply with finalized answer only.
5. After the follow-up, do NOT assume the next user message is feedback. Call submit_feedback ONLY when that message is an explicit verdict on the answer just given:
   - Explicit positive verdict (Yes / solved / it works / thanks / OK) -> MUST call submit_feedback(resolved="1") before replying.
   - Explicit negative verdict, i.e. user states the previous answer did NOT solve the problem (No / not solved / your answer did not help) -> MUST call submit_feedback(resolved="0") before replying.
   - Otherwise SKIP submit_feedback entirely (no call at all). A new question, a follow-up question, pasted error logs, or any further problem description is NOT negative feedback — never report resolved="0" for it.
   - resolved="0" is never a default. When the reply is unclear, mixed, or not a verdict, do not call this tool.
   - Never claim feedback is submitted unless submit_feedback was actually called.

Codegen workflow note:
- For get_*_integration codegen flow, do NOT call finalize_answer or submit_feedback.

User-visible output rules (MUST):
- Internal routing/tool decisions are never user-facing text.
- Do not output planning text like "I should call...", "let me search first", or "this is consultation not codegen".
- If a tool call is needed, call it directly and then output final actionable content only.
`.trim();
export function createServer() {
    const server = new McpServer({
        name: 'Tencent RTC MCP Server',
        version: '1.9.0',
    }, {
        instructions: SERVER_INSTRUCTIONS,
    });
    registryTools(server);
    return server;
}

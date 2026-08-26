import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registryTools } from './tools/index.js';
const SERVER_INSTRUCTIONS = `
You are using Tencent RTC MCP Server for SDK documentation retrieval.

- search_trtc_knowledge: Primary tool for searching Tencent RTC / Chat (IM) / Push (TIMPush) documentation.
  Covers: Chat UIKit, CallKit, LiveKit, RoomKit, TRTC Native SDK, WebRTC/rtcEngine, TIMPush.
  Use this tool FIRST for technical docs / FAQ / error codes / integration guide lookups.
  Do NOT use web_search for questions answerable by this knowledge base.

**Product routing (MUST infer product[] before calling search_trtc_knowledge):**
- TIMPush / push / vendor channel / FCM / APNs / Huawei / Xiaomi / OPPO / vivo -> product=["push"] (independent product; do not misroute to chat)
- conversation / TUIKit / ChatKit / Chat component / theme customization -> ["chat"]
- CallKit / call -> ["call"]; live streaming / voice room / LiveKit -> ["live"]; RoomKit / conference -> ["room"]
- TRTC Web SDK / rtcengine / WebRTC plugin -> ["rtcengine"]
- TRTCCloud / Native SDK (client side) -> ["native_trtc_sdk"]
- If both push and Chat are involved -> ["push","chat"]
- If product cannot be uniquely inferred from prompt -> ask user to clarify first; do NOT hard-search with empty product; do NOT use web_search.

**Frameworks:** If status=needs_framework, MUST call present_framework_choice first. See search_trtc_knowledge tool description decision table.
**When in doubt:** still prefer search_trtc_knowledge with best-guess product; if status is empty or low_confidence, then clarify or retry.

**queryID passing rules (hard rule; violation breaks CLS trace continuity):**
- First search_trtc_knowledge call: no queryID required (defaults to empty); response JSON will include server-generated queryID.
- Every subsequent call to search_trtc_knowledge / finalize_answer / submit_feedback: MUST carry the first returned queryID.
- Missing queryID means a brand-new consultation (CLS data cannot be linked).
- For multi-sub-question iterative searches, always reuse the same queryID.

Workflow:
1. Call search_trtc_knowledge. Reuse the same queryID for all retries/searches in this consultation.
2. Draft the complete answer from fragments. Include References from meta.references/doc_urls when available.
3. MUST call finalize_answer with the same prompt, answer, and queryID before replying.
4. Reply with that answer + finalize_answer follow-up text.
5. After finalize_answer follow-up, inspect the next user reply before any normal response. If it means Yes/resolved/thanks/OK, MUST call submit_feedback(resolved="1") before replying. If it means No/unresolved/still not working, MUST call submit_feedback(resolved="0") before replying. Never claim feedback was submitted unless submit_feedback was actually called.

User-visible output rules (MUST):
- Internal routing/tool decisions are NEVER user-facing text.
- Before calling any tool, do NOT output prefacing planning text such as “should call... / call ... first / let me search first / this is a consultation task / not codegen”.
- If a tool call is needed, call it directly and then provide user-visible results only.
`.trim();
export function createServer() {
    const server = new McpServer({
        name: "Tencent RTC MCP Server",
        version: "1.7.3",
    }, {
        instructions: SERVER_INSTRUCTIONS,
    });
    registryTools(server);
    return server;
}

const TOOL_DESCRIPTION = `
Purpose:
Use this tool as the default retrieval entry for Tencent RTC documentation and troubleshooting.

When to call (MUST):
- Technical Q&A: product capability, configuration, best practice, and documentation lookup.
- API lookup: API / component / event / parameter / error code.
- Troubleshooting: error, exception, failure, or compatibility issue.
- Integration reference lookup when user wants guidance/docs but does NOT explicitly ask for runnable code generation.
- Package/pricing/selection/version-price/billing-rule questions (e.g. "how much is the Chat Pro plan" / "which package supports recording" / "is the UI component itself free" / "price difference between CallKit and RoomKit") -> ALSO call THIS tool directly. This tool internally resolves package/pricing facts from a deterministic knowledge matrix when applicable, and otherwise falls back to normal retrieval. Pass "requirements" (capability needs, e.g. ["virtual background","multi-guest"]) when the question is about selecting a package; everything else (version name / budget) is extracted internally from "prompt", do not try to encode them elsewhere.

When NOT to call:
- Non-technical chat/greeting/small talk.
- User explicitly asks to generate or modify runnable integration code in project -> use corresponding get_*_integration tool.

Hard input rule:
- prompt MUST preserve original user question verbatim. Do NOT expand, rewrite, or inject extra assumptions.

Product routing:
- push: TIMPush / push / vendor channel / FCM / APNs / Huawei / Xiaomi / OPPO / vivo
- chat: conversation / TUIKit / ChatKit / IM / theme
- call: CallKit / call
- live: LiveKit / live streaming / voice room
- room: RoomKit / meeting
- trtc: Web TRTC / WebRTC / TRTCCloud / Native SDK / client
- iot: IoT / kids watch / recording card / security camera / smart vision service / IoT client API
- Multi-domain is allowed (e.g. ["push","chat"]).

Framework policy:
- If client platform is required but missing, call present_framework_choice first.
- If status=needs_framework, MUST collect framework first and then re-search.
- Framework is optional for cross-platform topics (pricing, REST, webhook, product-level console config).

Types policy:
- Default: do not pass types.
- Pass types only for clearly scoped cases (REST / webhook / error_code / product-level config).
- For discovery/listing questions (e.g. "what components/APIs are available"), keep types empty to avoid over-filtering.

Few-shot:
- User: "What does TRTC error 10015 mean?" -> CALL search_trtc_knowledge
- User: "What components are configurable in RoomKit?" -> CALL search_trtc_knowledge
- User: "How much is the Chat Pro plan, and what does it support?" -> CALL search_trtc_knowledge (product=["chat"], internally resolved by the deterministic package matrix, kind:"package_result")
- User: "Is the UI component itself a separate charge?" -> CALL search_trtc_knowledge (billing-rule question, internally resolved by the matrix, no product array required)
- User: "Integrate Web Chat UIKit into my React project and provide runnable code" -> Prefer get_*_integration (not this tool first)

Return contract:
- Two possible shapes (both carry message/meta.answer_contract, both require finalize_answer/submit_feedback the same way):
  1. Retrieval branch: status/confidence/fragments/meta.references/queryID/answer_contract.
  2. Package branch (kind:"package_result"): deterministic matrix lookup, NOT a retrieval result — packages[]/faq/queryID/message/meta.answer_contract. Field semantics differ from the retrieval branch (no confidence/fragments/retrieval_mode); render packages[]/faq fields verbatim per meta.answer_contract.
- Before final user reply, MUST call finalize_answer (required for both branches).
- After explicit follow-up feedback, MUST call submit_feedback.
`;
const PARAMETER_DESCRIPTIONS = {
    prompt: 'Original user question, MUST be passed verbatim. Do not rewrite or extend. Use structured fields (product/frameworks/types) for extra constraints.',
    product: 'Product array: chat|call|live|room|push|trtc|iot. Infer and pass when confident. push has priority for TIMPush/push queries.',
    frameworks: 'Framework/platform array: react|vue|web|miniprogram|android|ios|flutter|c++|uni-app|harmonyos|react-native|unity|unreal-engine|donut. If platform is required but missing, call present_framework_choice first.',
    types: 'Optional filter. Allowed: integration|component|feature|api|plugin|sdk|error_code|product|server_api|webhook|faq. Keep empty for discovery/listing queries.',
    requirements: 'Capability requirements for package selection, e.g. ["virtual background","multi-guest"] / ["recording","AI"]. ONLY for package/pricing selection questions; leave empty for technical questions. Version name / budget are extracted internally from prompt, do not encode them here.',
    scenario: 'live|voice, only for live product.',
    queryID: 'First call can be empty string; all subsequent calls in same consultation MUST reuse the returned queryID.',
    ide: 'IDE name: cursor|claude-code|vscode|codebuddy|codex|trae|others.',
    from: 'Optional, default empty string.',
    limit: 'Fragment count, default 8, max 16.',
};
export const SEARCH_KNOWLEDGE_DEFINITION = {
    name: 'search_trtc_knowledge',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

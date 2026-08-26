const TOOL_DESCRIPTION = `
For Tencent RTC documentation lookup (Chat / Call / Live / Room / Push / Web TRTC / Native TRTC): FAQ, error code, API, component, feature, plugin, integration lookup, troubleshooting -> MUST use this tool first. Do not use web_search. If the user explicitly wants integration code written, use the matching get_*_integration tool.

**prompt must preserve the user's original question verbatim**: do NOT expand, paraphrase, rewrite, or append API usage / scenario details. Pass exactly what the user asked. If you want to add semantics (API/events/specific implementation), express it via structured params (types/frameworks/product) or search separately.

**product** (if inferable, MUST pass; if not, ask first):
push: TIMPush / push / vendor channel / FCM / Huawei / Xiaomi / OPPO (not chat) | chat: conversation / TUIKit / IM / theme
call: CallKit | live: LiveKit | room: RoomKit / meeting | rtcengine: Web TRTC | native_trtc_sdk: TRTCCloud | cross-domain: ["push","chat"]

**frameworks** (same decision order as requires-framework.ts):
If provided -> search. If response is needs_framework -> call present_framework_choice, then retry.
chat + error code / ERR_ -> ask platform first | native_trtc_sdk -> MUST include one of android / ios / c++ | rtcengine -> implicit web
push: vendor name alone is not a platform (framework optional); enablement / console / vendor config may omit framework; if android / ios / flutter etc. appear -> MUST pass framework
billing / REST / Webhook / UserSig -> framework optional | if types only contain server_api / webhook / product -> framework optional
console / product capability config (multi-device login, login policy, message storage, console settings) -> types=["product"], not feature; even if Agent passes feature, runtime treats as cross-platform product config
if types include api / component / feature / plugin / sdk / integration -> framework required | API / component / enterRoom / SDK / plugin / troubleshooting usually require framework or a follow-up question

**types**: usually omit. Open default narrow case: ["faq"]. Pass explicit types only for REST / error code / Webhook / console product config questions. Do not proactively narrow to component/api/feature for console settings.
- Discovery / listing questions ("what components are available", "有哪些组件/API") -> MUST omit types (narrowing kills recall).
- component and feature are equivalent (UIKit docs are tagged feature); passing either matches both. RoomKit / LiveKit Web are Vue-based (framework=web already covers vue).

**L0/L1**: For local fragments, answer only from the returned text. For chat/urls/ results, fetch the official URL before stating facts. Never invent content.

**Returns**: status, confidence, fragments(doc_urls), meta.references/exact_hits, top_score/second_score, queryID, message, meta.answer_contract. The answer MUST follow answer_contract (user-actionable, make unconfirmed points explicit); deliver a complete user-visible answer — do not artificially shorten; never output system jargon such as "matched fragments / search results / confidence", but keep a "References" section at the end listing references/doc_urls.

**Post-answer workflow**: After the final answer is drafted, MUST call \`finalize_answer\` with the same prompt + queryID before replying. Append its follow-up text. On explicit follow-up feedback, call \`submit_feedback\`.
`;
const PARAMETER_DESCRIPTIONS = {
    prompt: "The user's original question VERBATIM. MUST pass through as-is; do NOT expand, rewrite, or append API usage/scenarios/follow-ups. If extra semantics are needed, use structured params like types/frameworks instead.",
    product: 'Product array: chat | call | live | room | push | rtcengine | native_trtc_sdk. If inferable, MUST pass it. Push takes priority for TIMPush / push topics and must not be misrouted to chat. Common live keywords: LiveKit / live streaming / voice room / TUILiveKit / AtomicXCore / host streaming / watch live. If uncertain, ask the user first.',
    frameworks: 'Platform array: react | vue | web | miniprogram | android | ios | flutter | c++ | uni-app | harmonyos | react-native | unity | unreal-engine | donut. Multiple platforms can be passed for cross-platform lookup. For CallKit, TUICallKit is best searched separately by react/vue, while TUICallEngine/TUICallEvent still map to web; use miniprogram for Mini Program. harmonyos / react-native / unity / unreal-engine / donut are only valid for push. If frameworks are missing and the question depends on a specific client platform, you MUST call present_framework_choice first, then retry.',
    types: 'Usually omit. Allowed values: integration | component | feature | api | plugin | sdk | faq | error_code | product | server_api | webhook. component and feature are equivalent (match both). Discovery/listing questions ("what components are available") MUST omit types. Console/billing/product-capability config -> product (not feature). Do not proactively over-narrow.',
    scenario: 'live | voice. Only valid for the live product.',
    queryID: "First call: ''. Follow-up calls in the same consultation MUST pass through the original queryID returned by the server.",
    ide: 'IDE name (cursor|claude-code|vscode|codebuddy|codex|trae｜others). Required.',
    from: 'Empty string by default.',
    limit: 'Number of fragments. Default 8, maximum 16.',
};
export const SEARCH_KNOWLEDGE_DEFINITION = {
    name: 'search_trtc_knowledge',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

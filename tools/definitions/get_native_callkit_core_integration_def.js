import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native CallKit Core base-integration docs based on the AtomicXCore SDK for developers who want a custom (no preset UI) call screen, covering make-call, answer-call, and offline-push.

Typical use cases (shared triggers, may also match 'get_native_call_uikit_integration' preset tool):
integrate CallKit, set up CallKit, audio/video call, voice call, video call, 1v1 call, group call, calling feature, make a call, answer a call, incoming call, offline push, VoIP
When any of the shared triggers above match, **ask the user first**: "Do you want to integrate with the default call UI (TUICallKit preset), or build a custom call UI on top of the Core SDK?" If the user picks "custom / Core", call this tool; if the user picks "default / preset", call 'get_native_call_uikit_integration'.

Typical use cases (Core SDK exclusive triggers, only match this tool, no follow-up question needed):
Core SDK, AtomicXCore, no UI, custom UI, custom call UI, build my own call page, not using the default UI, customize call style, CallStore, CallCoreView, DeviceStore

Input:
- framework: android | ios | flutter | uni-app
- goals: feature module list (make_call | answer_call | offline_push)
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- When framework=uni-app, only this tool (Core SDK) is supported; there is no TUICallKit preset path for uni-app. **Do not** ask "default UI vs custom UI" after the user picks uni-app; call this tool directly.
- When framework=uni-app and goals includes offline_push, this tool returns an explanatory fallback message (uni-app Core does not currently ship offline-push integration docs). Guide the user to the Android / iOS offline-push docs and integrate FCM / APNs via uni-app native plugins, or switch to the TUICallKit preset solution.
- This tool covers the core/store-level base-integration main path (CallStore make/answer + offline push). It is not for beauty, virtual background, floating window, or picture-in-picture.
- It returns Core SDK base-integration docs, not a full preset UIKit page template.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: android | ios | flutter | uni-app. Note: uni-app is only supported by this tool (Core SDK); there is no TUICallKit preset path for uni-app, so do not ask "default UI vs custom UI" when the user picks uni-app.',
    goals: 'Feature list. Allowed values: make_call (make a call) | answer_call (answer a call) | offline_push (offline push). Multiple values are allowed, e.g. ["make_call", "answer_call"] for both. Note: when framework=uni-app and goals contains offline_push, this tool returns an explanatory fallback message instead of full docs (uni-app Core does not currently ship an offline-push integration sample).',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
const ANTI_HALLUCINATION_HEADER = `This document is based on the AtomicXCore SDK. Do NOT use UI-kit APIs such as TUILogin or TUICallKit.\n\n`;
const ANTI_HALLUCINATION_CONSTRAINT = `
---
[AI Code Generation Constraints - AtomicXCore]
This document uses the AtomicXCore SDK (no-UI integration). Generate code strictly based on the document content. Do NOT introduce any API not mentioned in the document.

Principle: If an API or class name never appears in this document, do not use it in the generated code.
`;
const UNI_APP_OFFLINE_PUSH_FALLBACK = `
# uni-app Core SDK Does Not Yet Provide Offline Push Integration Samples

## Current Status
AtomicXCore for uni-app has not yet released offline push (FCM / APNs) integration docs or sample code.

## Recommended Approach
- Refer to the Android platform \`callkit/core-sdk/android/offline-push.md\` and integrate FCM Data Messages via the uni-app native Android plugin mechanism.
- Refer to the iOS platform \`callkit/core-sdk/ios/offline-push.md\` and integrate VoIP Push via the uni-app native iOS plugin mechanism.
- If you prefer not to implement native plugins yourself, consider using the \`get_native_call_uikit_integration\` tool to integrate the TUICallKit preset solution, which has built-in offline push support for uni-app.

## Do NOT
- Do not fabricate uni-app Core offline push code — it may be inconsistent with the official SDK behavior.
- Do not paste Android / iOS offline push code directly into a uni-app project — it requires native plugin bridging.
`;
export const GET_NATIVE_CALLKIT_CORE_INTEGRATION_DEFINITION = {
    name: 'get_native_callkit_core_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
    anti_hallucination_header: ANTI_HALLUCINATION_HEADER,
    anti_hallucination_constraint: ANTI_HALLUCINATION_CONSTRAINT,
    uni_app_offline_push_fallback: UNI_APP_OFFLINE_PUSH_FALLBACK,
};

import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native TUICallKit preset integration docs for setting up a complete mobile calling experience with a ready-made call UI.

Typical use cases (shared triggers, may also match 'get_native_callkit_core_integration' Core tool):
integrate CallKit, set up CallKit, audio/video call, voice call, video call, 1v1 call, group call, calling feature, make a call, answer a call, incoming call, offline push, VoIP
When any of the shared triggers above match, **ask the user first**: "Do you want to integrate with the default call UI (TUICallKit preset), or build a custom call UI on top of the Core SDK?" If the user picks "default / preset", call this tool; if the user picks "custom / Core", call 'get_native_callkit_core_integration'.

Typical use cases (preset exclusive triggers, only match this tool, no follow-up question needed):
TUICallKit, Native TUICallKit, Native Call UIKit, preset, preset integration, ready-made UI, default UI, default call UI, out-of-the-box call screen, prebuilt call page, TUICallKit Flutter, TUICallKit Android, TUICallKit iOS

Input:
- framework: flutter | android | ios
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- When framework=uni-app, this tool is not supported (preset has no uni-app build). Call 'get_native_callkit_core_integration' instead.
- When the user has already indicated "custom UI", "Core SDK", "AtomicXCore", "CallStore", or "build my own call page" or similar Core exclusive triggers, call 'get_native_callkit_core_integration' directly and do not route through this tool.
- This tool is for Native CallKit preset integration. It is not for ringtone, virtual background, avatar, floating window, or other single-feature/API settings.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: flutter | android | ios.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_NATIVE_CALL_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_native_call_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

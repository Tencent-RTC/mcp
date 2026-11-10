import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native LiveKit Core base-integration docs based on AtomicXCore SDK for publishing, viewing, and room-list flows in live streaming or voice room apps.

When to call (MUST):
- User explicitly asks for runnable project integration code or concrete implementation steps.

When NOT to call:
- Pure feature Q&A, documentation lookup, API/component explanation, troubleshooting.

Scope details:

Native LiveKit Core, AtomicXCore, no-UI SDK, core SDK, live streaming, voice room, publish, watch, room list, Android, iOS, Flutter, live, voice, set up the base live flow, set up the base voice room flow

Inputs:
- scenario: live | voice
- framework: android | ios | flutter
- goals: feature module list
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Outputs:
- content: [{ type: 'text', text: Documentation body or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- This tool is for AtomicXCore-based live streaming or voice room base integration. It is not for co-guest, PK, member list, beauty, audio effects, barrage, or gifts.
- It returns Core/Store-level integration docs, not a full preset UIKit page template.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    scenario: 'Scenario type. Allowed values: live | voice. Use integration for publishing, viewing, or room list. Use search_trtc_knowledge for co-guest, PK, member list, beauty, audio effects, barrage, or gifts.',
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: android | ios | flutter.',
    goals: 'Feature list. Allowed values: host_streaming (host publish) | audience_streaming (audience watch) | live_list (room list).',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_NATIVE_LIVEKIT_CORE_INTEGRATION_DEFINITION = {
    name: 'get_native_livekit_core_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

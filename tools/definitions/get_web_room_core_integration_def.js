import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Web RoomKit Atomicx Core integration docs for building a custom meeting room without preset UI, covering login, room state, and device capabilities.

When to call (MUST):
- User explicitly asks for runnable project integration code or concrete implementation steps.

When NOT to call:
- Pure feature Q&A, documentation lookup, API/component explanation, troubleshooting.

Scope details (shared triggers, may also match 'get_web_room_uikit_integration' preset tool):
Web RoomKit, TUIRoomKit, Atomicx, Vue, integrate RoomKit, meeting room, room, meeting
When user only hits shared triggers, ask first: "Do you want the preset UI for quick integration (TUIRoomUIKit), or a custom room built on Atomicx APIs?" If user chooses custom/Atomicx/Core, call this tool. If user chooses preset/default UI, call 'get_web_room_uikit_integration'.

Scope details (Core-only triggers, call directly):
Atomicx API, custom meeting room, custom room UI, without preset UI, useRoomState, useDeviceState, useLoginState, room-state, device-state, device-detection

Inputs:
- framework: vue
- goals: room-state | device-detection | device-state
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Outputs:
- content: [{ type: 'text', text: Documentation body or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- This is for Atomicx Core integration only (login + room-state/device modules), not preset UI page templates.
- Screen sharing, virtual background, scheduled meeting, and other advanced modules -> call 'search_trtc_knowledge(types=[feature])'.
- Login constraint: MUST call 'get_usersig' to get a UserSig, then use useLoginState.login; never implement local UserSig generation such as GenerateTestUserSig inside the project.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target framework. The parameter name must be framework. Do not use platform. Fixed value: vue.',
    goals: 'Goal array. Allowed values: room-state | device-detection | device-state.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
const ANTI_HALLUCINATION_HEADER = 'This document is for the Atomicx Core custom implementation path. Do not copy preset TUIRoomUIKit UI components as if they were Core APIs.\\n\\n';
const ANTI_HALLUCINATION_CONSTRAINT = `
---
[AI code generation constraints - Atomicx Core path]
Generate code strictly from the documentation. The login flow MUST call the get_usersig tool to obtain a UserSig, then call useLoginState.login. Never implement GenerateTestUserSig or any local UserSig issuing logic in the project.
---
`;
export const GET_WEB_ROOM_CORE_INTEGRATION_DEFINITION = {
    name: 'get_web_room_core_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
    anti_hallucination_header: ANTI_HALLUCINATION_HEADER,
    anti_hallucination_constraint: ANTI_HALLUCINATION_CONSTRAINT,
};

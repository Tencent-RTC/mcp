import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Web Room UIKit preset integration docs for the main meeting entry page, room page, and default meeting app flow.

Typical use cases:
Web Room UIKit, TUIRoomUIKit, Atomicx, Vue, preset UI, default meeting app, meeting app, home.vue, room.vue, meeting entry page, meeting room page, H5 meeting, PC meeting, integrate Room UIKit

Input:
- framework: vue
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- This tool is for preset UI integration. It is not for Atomicx API details or custom single-feature modules.
- For custom Atomicx room implementation -> call 'get_web_room_core_integration'.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target framework. The parameter name must be framework. Do not use platform. Fixed value: vue.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_WEB_ROOM_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_web_room_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Web TUICallKit preset integration docs for setting up a complete calling experience on PC or H5.

Typical use cases:
Web Call UIKit, Web TUICallKit, TUICallKit, preset integration, React, Vue, PC, H5, audio/video calling, video call, voice call, integrate CallKit, calling flow, answering flow

Input:
- framework: react | vue
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- This tool is for Web CallKit preset integration. It is not for API details or interactive framework selection.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target framework. The parameter name must be framework. Do not use platform. Allowed values: react | vue.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_WEB_CALL_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_web_call_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

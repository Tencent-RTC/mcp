import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Web Chat UIKit integration docs for building either a full chat app or a single chat window.

Typical use cases:
Web Chat UIKit, TUIKit, IM, chat, conversation list, chat window, React, Vue, full-featured, chat-only, customer service chat, consultation chat, message entry

Input:
- framework: react | vue
- goals: [full-featured] | [chat-only]
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- This tool is for full Web Chat UIKit integration. It is not for component-level details or interactive framework selection.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target framework. The parameter name must be framework. Do not use platform. Allowed values: react | vue.',
    goals: 'Goal array. Exactly one value is allowed: full-featured (full app) | chat-only (single chat window).',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_WEB_CHAT_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_web_chat_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

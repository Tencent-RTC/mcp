import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native Chat UIKit integration docs for building either a full IM app or a single chat window on mobile.

Typical use cases:
Native Chat UIKit, TUIKit, IM, chat, conversation list, chat window, Flutter, Android, iOS, full-featured, chat-only, customer service chat, consultation chat

Input:
- framework: flutter | android | ios
- goals: [full-featured] | [chat-only]
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation content or explanatory text }]

Boundaries:
- If the user has not specified a platform or framework, call 'present_framework_choice' first.
- This tool is for full Native Chat UIKit integration (Compose / SwiftUI codegen path). It is not for platform selection or deep single-feature lookup.
- Android View / iOS UIKit integration lookup -> use search_trtc_knowledge instead.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: flutter | android | ios. android/ios are the Compose / SwiftUI codegen path; for View/UIKit integration lookup use search_trtc_knowledge.',
    goals: 'Goal array. Exactly one value is allowed: full-featured (full app) | chat-only (single chat window).',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_NATIVE_CHAT_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_native_chat_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

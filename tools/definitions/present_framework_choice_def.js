const TOOL_DESCRIPTION = `
Purpose:
Guide the user to pick a supported platform or framework when the request does not clearly specify one, before continuing with search_trtc_knowledge or an integration tool.

Typical use cases:
platform choice, framework choice, pick a platform first, pick a framework first, platform not specified, framework not specified, integration guide, setup docs, quick start, API lookup, component lookup, feature lookup, how to configure, Chat UIKit integration, Call UIKit integration, Live UIKit integration, Room UIKit integration, CallKit API, LiveKit API, WebRTC SDK integration, Native TRTC SDK integration, react, vue, web, miniprogram, uni-app, flutter, android, ios, webrtc

Trigger examples:
- Get the Chat UIKit integration guide (React/Vue not specified)
- How do I configure the CallKit ringtone (platform not specified)
- How do I use a Chat UIKit component (Web/Native not specified)
- How do I enable virtual background (product or platform not specified)

Input:
- product: chat | call | live | room | rtcengine | native_trtc_sdk | push

Returns:
- content: [{ type: 'text', text: selectable option list }]

Boundaries:
- This tool only collects the platform or framework choice. It does not return documentation content.
- **Consultation chain (hard rule)**: API / component / feature / client troubleshooting / integration lookup without a platform -> MUST call this tool first, then search_trtc_knowledge with **product + frameworks**; do not skip.
- **Codegen chain (hard rule)**: user wants integration code in a project but platform is unclear -> MUST call this tool first, then the matching get_*_integration tool.
- Cross-platform general questions (billing, server REST, UserSig principles) unrelated to a single client -> search_trtc_knowledge directly without this tool (product still MUST be inferred from the prompt).
`;
const SELECTION_PROMPT_TEXT = `
Show the supported platform or framework options directly to the user, ask them to pick one, and wait for their reply before calling any integration or lookup tool.
`;
export const PRESENT_FRAMEWORK_CHOICE_DEFINITION = {
    name: 'present_framework_choice',
    description: TOOL_DESCRIPTION,
    selectionText: SELECTION_PROMPT_TEXT,
    parameter_descriptions: {
        product: 'Target product. Allowed values: chat | call | live | room | rtcengine | native_trtc_sdk | push.',
    },
};

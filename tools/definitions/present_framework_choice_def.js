const TOOL_DESCRIPTION = `
Purpose:
Collect platform/framework choice from user when the question requires client-side platform context.

When to call (MUST):
- User asks API/component/feature/client troubleshooting/integration guidance but does not specify platform.
- search_trtc_knowledge returns needs_framework.
- User requests explicit codegen/integration but platform is not specified.

When NOT to call:
- Cross-platform product topics: pricing, product package, console-level product config.
- Server-side topics: REST API, webhook, UserSig principle.
- Platform is already explicitly provided by user.

Boundary:
- This tool only collects platform/framework; it does NOT return documentation content.
- After user chooses platform:
  - Q&A / troubleshooting / doc lookup -> call search_trtc_knowledge with product + frameworks.
  - Explicit codegen request -> call corresponding get_*_integration tool.

Few-shot:
- User: "How do I integrate Chat UIKit?" (no React/Vue) -> CALL present_framework_choice
- User: "How to configure CallKit ringtone?" (no platform) -> CALL present_framework_choice
- User: "How do I enable TIMPush vendor channel in console?" -> DO NOT call present_framework_choice
`;
const SELECTION_PROMPT_TEXT = `
Please show available platform/framework options to user first. Continue with search or integration only after user selects one option.
`;
export const PRESENT_FRAMEWORK_CHOICE_DEFINITION = {
    name: 'present_framework_choice',
    description: TOOL_DESCRIPTION,
    selectionText: SELECTION_PROMPT_TEXT,
    parameter_descriptions: {
        product: 'Target product. Allowed: chat | call | live | room | trtc | push.',
    },
};

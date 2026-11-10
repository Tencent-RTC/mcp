/** Shared Phase B boundary suffix for all get_* integration tools */
export const INTEGRATION_BOUNDARY_SUFFIX = `
- **Codegen only (MUST)**: Call this tool only when user explicitly asks for runnable integration/code implementation (for example: "integrate into my project", "write integration code", "give runnable code").
- **When NOT to call**: For pure Q&A, documentation lookup, API/component explanation, error troubleshooting, or "I just want to understand the approach first" requests, call \`search_trtc_knowledge\` instead.
- **Workflow split**: This tool belongs to codegen flow. After responding with integration/code content, do **NOT** call \`finalize_answer\` or \`submit_feedback\`.
- **User-visible output rule (MUST)**: Tool routing decisions are internal. Do not expose process text like "should call", "call this first", "let me search first", or "this is consultation, not codegen". Output only final actionable content.
- **Few-shot boundary**:
  - Positive: "Use Vue to integrate Chat UIKit into my existing project and provide runnable code" -> call corresponding \`get_*_integration\`
  - Negative: "What capabilities/components does Chat UIKit provide?" -> call \`search_trtc_knowledge\`
`;

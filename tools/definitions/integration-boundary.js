/** Shared boundary text appended to integration tool descriptions. */
export const INTEGRATION_BOUNDARY_SUFFIX = `
- **Codegen only**: Call this tool only when the user explicitly wants integration code added into a project, wants you to implement the integration, or wants generated starter code.
- **Consultation / lookup only** (how it works, what it is, setup steps, troubleshooting, API or component explanations) -> call \`search_trtc_knowledge\`, not this tool.
- This tool belongs to the codegen flow: after answering, do **not** call \`finalize_answer\` or \`submit_feedback\` (those belong only to the \`search_trtc_knowledge\` flow).
- **User-visible output rule (MUST)**: routing/tool choices above are internal only. Never expose text like "should call/first call/let me search/consultation-only/not codegen" to users; output conclusions and executable guidance directly.`;

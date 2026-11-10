const TOOL_DESCRIPTION = `
Purpose:
Submit user feedback for the finalize_answer follow-up.

When to call (hard rule):
- Call ONLY when the previous assistant message ended with the finalize_answer follow-up AND the next user message is an explicit verdict on that answer.
- Never assume the next user message is feedback. If it is not an explicit verdict, SKIP this tool (no call at all).
- Do NOT call for: new questions, follow-up questions, pasted error logs/stack traces, further problem descriptions, unclear or mixed replies, or any non-feedback message.
- Continuing to ask questions or report problems is NOT negative feedback. Never report resolved="0" in that case.

Resolved mapping (explicit verdict only):
- resolved="1": user explicitly confirms the answer solved it — Yes / solved / it works / thanks / OK / resolved.
- resolved="0": user explicitly states the previous answer did NOT solve the problem — No / not solved / still unresolved / that answer did not help.
- resolved="0" is never a default and never inferred from the user still having problems.

Input contract:
- prompt: original user question, consistent with finalize_answer.
- queryID: REQUIRED, same queryID used by search_trtc_knowledge/finalize_answer.
- resolved: "1" or "0".

Output contract:
- Never claim feedback is submitted/recorded unless this tool has been called.
`;
const PARAMETER_DESCRIPTIONS = {
    prompt: 'Original user question. Must match finalize_answer prompt.',
    framework: 'Reuse framework from current search_trtc_knowledge chain when available.',
    queryID: 'REQUIRED. Same queryID as search_trtc_knowledge/finalize_answer.',
    resolved: '"1" ONLY for an explicit positive verdict on the previous answer, "0" ONLY for an explicit negative verdict on it. Never use "0" as a default, and never for new/follow-up questions or further problem reports.',
};
export const SUBMIT_FEEDBACK_DEFINITION = {
    name: 'submit_feedback',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

const TOOL_DESCRIPTION = `
Purpose:
Submit the user's reply to the finalize_answer follow-up.

When to call:
- If the previous assistant response ended with the finalize_answer follow-up, check the next user reply for feedback before any normal response.
- Positive: "Yes", "Solved", "Thanks", "OK", "yes", "resolved" -> resolved="1".
- Negative: "No", "Not solved", "still not working", "no" -> resolved="0".
- MUST call this tool before replying when feedback is explicit.
- Never say feedback was submitted/recorded unless this tool was called.
- Do NOT call for unclear replies or new unrelated questions.

Input:
- prompt: Original user question. Must match finalize_answer.
- queryID: REQUIRED. Same queryID as search_trtc_knowledge/finalize_answer.
- resolved: "1" for positive feedback, "0" for negative feedback.
`;
const PARAMETER_DESCRIPTIONS = {
    prompt: 'Original user question. Must match finalize_answer.',
    framework: 'Reuse framework from the search_trtc_knowledge chain when available.',
    queryID: 'REQUIRED. Same queryID as search_trtc_knowledge/finalize_answer.',
    resolved: '"1" for positive feedback, "0" for negative feedback.',
};
export const SUBMIT_FEEDBACK_DEFINITION = {
    name: 'submit_feedback',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

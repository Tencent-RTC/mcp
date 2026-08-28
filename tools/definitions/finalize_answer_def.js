export const FOLLOWUP_QUESTION = 'Did this solve your problem? Please reply with "Yes" or "No" so we can improve answer quality.';
const TOOL_DESCRIPTION = `
Purpose:
Finalize a search_trtc_knowledge answer and return the follow-up text to append.

When to call:
- After all searches/fetches are done and the final answer is drafted, MUST call this tool exactly once before replying to the user.
- Do NOT call it for intermediate searches, partial drafts, or when another search/fetch is still needed.

Input:
- prompt: Original user question. Must match the search_trtc_knowledge prompt.
- answer: Full synthesized answer (same text sent to the user).
- queryID: REQUIRED. Must match the non-empty queryID returned by search_trtc_knowledge.
- product/framework: Reuse the same values from the search_trtc_knowledge chain when available.

Returns:
- Follow-up text. Append it as-is after the answer.
- Do NOT write your own follow-up question.
`;
const PARAMETER_DESCRIPTIONS = {
    prompt: 'Original user question. Must match search_trtc_knowledge.',
    answer: 'Full synthesized answer (same text sent to the user).',
    product: 'Reuse product from the search_trtc_knowledge chain when available.',
    framework: 'Reuse framework from the search_trtc_knowledge chain when available.',
    queryID: 'REQUIRED. Non-empty queryID returned by search_trtc_knowledge.',
};
export const FINALIZE_ANSWER_DEFINITION = {
    name: 'finalize_answer',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

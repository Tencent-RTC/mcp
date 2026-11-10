export function buildAnswerContract(status, confidence, retrievalMode, opts) {
    const uncertaintyRule = 'Do not use speculative wording (e.g., "maybe/probably/should/it seems"). When the user asks for a specific detail (API/method/enum/event/error code) that is not present in the returned fragments, do not invent it; instead, explicitly mark it as "[not found in docs]" or "[to be confirmed]" in the answer so the gap is visible to the user.';
    const riskRule = opts?.fabricationRisk ? 'fabrication_risk=true: do not fill unmatched API details. For every detail that cannot be grounded in the returned fragments, explicitly mark it as "[not found in docs]" or "[to be confirmed]"; the user-facing answer must surface every gap, not omit silently.' : '';
    const aggregatedRule = opts?.hasAggregatedFragments
        ? 'If a field comes from an aggregated fragment, explicitly mark it as "[supplement]" or a footnote to avoid confusion with directly matched fragments.'
        : '';
    const modeRule = retrievalMode === 'narrative'
        ? (opts?.fullDocumentRequired
            ? 'Narrative mode (full-document priority): output the complete body in documents[0].sections order, preserving sample code blocks/commands/key notes; do not compress into a summary.'
            : 'Narrative mode: organize the answer in documents.sections order; do not skip sections.')
        : retrievalMode === 'discovery'
            ? 'Discovery mode: list every candidate from the returned fragments with full identifying detail (name, purpose, platform scope); then give complete selection guidance with trade-offs; do not fabricate nonexistent items.'
            : 'Point mode: synthesize a complete answer derived from the matched fragments, preserving relevant depth and source-faithful detail; do not artificially shorten, the reporting layer enforces any necessary truncation.';
    const structureRule = opts?.fullDocumentRequired
        ? 'If the user explicitly asks for a "full guide/full markdown/full text/include sample code", expand the body in full section order; do not omit steps or code except minimal heading cleanup.'
        : 'Use problem-oriented headings when the answer benefits from sections; otherwise write a continuous synthesized answer (no per-section length constraint).';
    const sectionRule = opts?.fullDocumentRequired
        ? 'Each section may contain complete steps/commands/code; no "1-2 sentence" limit applies.'
        : 'For each section (or in continuous prose): synthesize a complete answer from the matched fragments, including problem analysis, code samples, citations, and examples as relevant. Preserve the source depth. Avoid template wording. The reporting layer enforces truncation, so do not artificially summarize.';
    return [
        '[Output contract — MUST follow]',
        'User-visible answer MUST be complete; never artificially shorten or summarize for brevity.',
        structureRule,
        sectionRule,
        'If details are not covered by fragments, mark them as "[not found in docs]" or "[to be confirmed]" instead of inventing or silently omitting.',
        'Keep a final "References" section with only document titles or URLs; do not show retrieval process/evidence chain/scoring details in the body.',
        'User-visible content MUST NOT include retrieval-system wording (e.g., "matched fragments / retrieval result / confidence / score / recall / rerank").',
        'User-visible content MUST NOT include tool/routing decision wording (e.g., "should call / call first / let me search / consultation task / not codegen / search_trtc_knowledge / finalize_answer / submit_feedback").',
        'Hard constraint: do not introduce API names/field values/enums/events that are absent from fragments.',
        modeRule,
        uncertaintyRule,
        riskRule,
        aggregatedRule,
    ].filter(Boolean).join(' ');
}
/**
 * 强制动作指令尾巴：驱动 LLM 在"答完"之后必须调用 finalize_answer / submit_feedback
 * 的唯一触发来源（不是检索语义的提示语，是通用工具调用协议）。
 * search_trtc_knowledge 的检索分支（buildAgentMessage）与套餐分支
 * （zh/src/utils/package-matrix-query.ts 的 buildPackageAgentMessage）共享同一份常量，
 * 避免协议措辞变更时两处分叉遗漏。
 */
export const MANDATORY_FOLLOWUP_TAIL = 'Output contract is in meta.answer_contract and MUST be followed. User-visible output must answer the question directly; do not start with tool-selection or retrieval-plan narrative. Final answer drafted -> MUST call `finalize_answer` before replying, and `prompt`, `answer`, `queryID` are all required (queryID is from this tool output). Explicit follow-up feedback -> call `submit_feedback`.';
export function buildAgentMessage(status, retrievalMode, fragments, confidence, _references, opts) {
    const riskRule = opts?.fabricationRisk ? 'Current retrieval has hallucination risk (fabrication_risk=true): do not fill unmatched API details.' : '';
    // Keep the output contract in meta.answer_contract only, to avoid duplicated instruction blocks in message.
    const tail = `${riskRule} ${MANDATORY_FOLLOWUP_TAIL}`;
    if (status === 'needs_framework') {
        return '[Hard rule] The question depends on a concrete platform implementation, but frameworks are missing. Cross-platform mixed retrieval is disallowed due to low precision. MUST call `present_framework_choice` first (with product), then call this tool again after user selects web/miniprogram/android/ios/flutter/react/vue/uni-app etc, and MUST include both **product + frameworks**. Do not hard-search with empty frameworks.';
    }
    if (status === 'success' && retrievalMode === 'narrative' && opts?.hasDocuments) {
        if (opts?.fullDocumentRequired) {
            return `This request is narrative (full guide) mode and user explicitly asks for full text: output complete content in documents[0].sections order, preserving sample code and commands; do not summarize. Fragments are for cross-checking only. ${tail}`;
        }
        return `This request is narrative (full guide) mode: prioritize documents.sections order and do not skip sections. Fragments are for cross-checking only. ${tail}`;
    }
    if (status === 'success' && retrievalMode === 'discovery' && fragments.length > 0) {
        return `This request is discovery (catalog/list) mode: list every candidate from the returned fragments with full identifying detail, then give complete selection guidance; do not treat a single fragment as a full workflow, and do not fabricate nonexistent items. ${tail}`;
    }
    if (status === 'success' && retrievalMode === 'point' && opts?.preferDocuments) {
        return `Current results have converged to a single best-practice document: fragments already contain the full document in original section order. Answer in that order, preserve code samples and key notes, and do not compress into a short summary. ${tail}`;
    }
    if (status === 'success' && fragments.length > 0) {
        return `Synthesize the answer strictly from returned fragments; do not run parallel web_search or extra official-doc fetching. ${tail}`;
    }
    if (status === 'low_confidence') {
        return `Provide the most actionable answer from existing fragments; you may guide user to provide component/API/error-code specifics for another retrieval round. Do not run parallel web_search by default. ${tail}`;
    }
    return `No effective fragment was retrieved from the knowledge base. Ask user to verify product/framework; if platform is still missing and the question depends on client-specific implementation, call \`present_framework_choice\` first. ${tail}`;
}

import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Web Live UIKit page-level integration docs for wiring live list, player, publish, and co-guest entry pages.

When to call (MUST):
- User explicitly asks for runnable project integration code or concrete implementation steps.

When NOT to call:
- Pure feature Q&A, documentation lookup, API/component explanation, troubleshooting.

Scope details:

Web Live UIKit, TUILiveUIKit, Vue, page-level integration, wire the live pages, set up the live list page, set up the player page, set up the publish page, liveList, livePlayer-desk, livePlayer-h5, livePusher

Inputs:
- goals: feature list
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Outputs:
- content: [{ type: 'text', text: Documentation body or explanatory text }]

Boundaries:
- This tool is primarily for Web Vue page-level integration. It is not for State API fields/methods or single-component deep dives.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    goals: 'Feature list. Allowed values: liveList | livePlayer-desk | livePlayer-h5 | livePusher.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_WEB_LIVE_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_web_live_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};

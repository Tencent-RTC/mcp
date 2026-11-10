import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native video live streaming integration docs based on TUILiveKit preset UI components for out-of-the-box Android/iOS integration and code generation.

When to call (MUST):
- User explicitly asks for runnable project integration code or concrete implementation steps.

When NOT to call:
- Pure feature Q&A, documentation lookup, API/component explanation, troubleshooting.

Scope details (shared triggers, may also match 'get_native_livekit_core_integration' Core tool):
integrate LiveKit, TUILiveKit, video live streaming, live broadcast, host streaming, audience watching, live list, host page, watch page, live room list, Android, iOS
When shared triggers match, ask user first: "Do you want the default live UI (TUILiveKit preset), or a custom UI on top of Core SDK/AtomicXCore?" If user chooses default/preset, call this tool; if user chooses custom/Core, call 'get_native_livekit_core_integration'.

Scope details (preset-only triggers, match this tool directly):
TUILiveKit, Native TUILiveKit, Native Live UIKit, preset, preset integration, preset UI, preset host page, preset watch page, preset live list, default live streaming UI, out-of-the-box live streaming UI, ready-made streaming page, TUILiveKit Android, TUILiveKit iOS, AnchorPrepareView

Inputs:
- framework: android | ios
- goals: feature module list (results are organized in order: live_list -> host_streaming -> audience_streaming)
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Outputs:
- content: [{ type: 'text', text: Documentation body or explanatory text }]

Boundaries:
- This tool is for video live streaming scenarios only. Voice room scenarios are out of scope and should use 'get_native_livekit_core_integration'.
- framework supports android | ios only. For flutter / uni-app, route to 'get_native_livekit_core_integration' or explain unsupported preset path.
- If the user has not specified a platform, call 'present_framework_choice' first.
- If the user explicitly indicates Core-specific words such as "custom UI", "Core SDK", "AtomicXCore", "LiveCoreView", or "build my own live page", call 'get_native_livekit_core_integration' directly.
- Covers host_streaming / audience_streaming / live_list page integration only. For co-guest, PK, gifts, barrage, beauty, or audio effects, use 'search_trtc_knowledge'.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: android | ios.',
    goals: 'Feature list (multi-select). Allowed values: live_list (live list page, audience entry) | host_streaming (host streaming page) | audience_streaming (audience watching page). A complete mobile live app usually needs all three.',
    prompt: "The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.",
};
export const GET_NATIVE_LIVE_UIKIT_INTEGRATION_DEFINITION = {
    name: 'get_native_live_uikit_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
};
// UI text shown to the AI (headings / sections / not-found hints).
// The tool implementation (get_native_live_uikit_integration.ts) stays byte-identical between
// zh/en and is auto-synced by sync-tools.js; this UI_TEXT block is the only per-locale text
// that must be maintained separately for en.
export const GET_NATIVE_LIVE_UIKIT_INTEGRATION_UI_TEXT = {
    goalTitles: {
        live_list: 'Live List Page (TUILiveKit Preset UI)',
        host_streaming: 'Host Streaming Page (TUILiveKit Preset UI)',
        audience_streaming: 'Audience Watching Page (TUILiveKit Preset UI)',
    },
    headerTitle: '# TUILiveKit Video Live Streaming (Native Preset UI) Integration Guide',
    platformLabel: 'Platform',
    selectedFeaturesLabel: 'Selected Features',
    labelSeparator: ': ',
    listSeparator: ', ',
    headerNotes: [
        'The environment setup and dependency integration steps common to all platforms are given below first, followed by the integration code for each selected feature page.',
        'Strictly follow the class names, package names, and import paths in the documentation when generating code. Do not fabricate APIs.',
    ],
    prepareSectionTitle: (framework) => `Environment Setup and Code Integration (${framework} prerequisites)`,
    prepareSectionFallback: '## Environment Setup and Code Integration\n\n> No preparation documentation found for this platform.',
    goalNotFound: (framework) => `No integration documentation found for this feature on the ${framework} platform. Please confirm whether the goal and platform are supported, or use search_trtc_knowledge instead.`,
};

import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native video live streaming integration docs based on TUILiveKit's preset UI components, for AI to complete out-of-the-box mobile (Android / iOS) video live streaming integration and code generation. Covers the live list page (audience entry), host streaming page, and audience watching page — all preset components with complete interactive UI and business logic (e.g. AnchorPrepareView, live list waterfall view, etc.).

Typical use cases (shared trigger words, may also match the 'get_native_livekit_core_integration' Core tool):
integrate LiveKit, TUILiveKit, video live streaming, live broadcast, host streaming, audience watching, live list, host page, watch page, live room list, Android, iOS
When a shared trigger word is matched, **proactively ask the user first**: "Would you like to quickly integrate with the default live streaming UI (TUILiveKit preset), or build a custom UI on top of Core SDK / AtomicXCore?" Call this tool only after the user chooses "default/preset"; call 'get_native_livekit_core_integration' if they choose "custom/Core".

Typical use cases (preset-only trigger words, match this tool exclusively, call directly without asking):
TUILiveKit, Native TUILiveKit, Native Live UIKit, preset, preset integration, preset UI, preset host page, preset watch page, preset live list, default live streaming UI, out-of-the-box live streaming UI, ready-made streaming page, already have a live streaming UI, TUILiveKit Android, TUILiveKit iOS, AnchorPrepareView

Input:
- framework: android | ios
- goals: feature module list (multi-select; results are organized in the order live_list → host_streaming → audience_streaming)
- prompt: The user's original question in full. Keep the full context. Do not compress it into keywords or a short summary.

Returns:
- content: [{ type: 'text', text: documentation body (common environment setup / dependency integration for all platforms, plus integration steps and code for the selected feature pages) }]

Boundaries:
- This tool is for **video live streaming (live)** scenarios only. Voice room (voice / audio room / seat) is **out of scope** — for that use 'get_native_livekit_core_integration' instead, or inform the user preset UI is not yet supported for voice room
- framework only supports android | ios (TUILiveKit video live streaming preset UI has no flutter / uni-app docs yet — for that use 'get_native_livekit_core_integration' instead, or inform the user it is not supported)
- If the user has not specified a platform, call 'present_framework_choice' first
- If the user has explicitly indicated Core-specific trigger words such as "custom UI", "Core SDK", "AtomicXCore", "LiveCoreView", or "build my own live page", call 'get_native_livekit_core_integration' directly instead of this tool
- Covers full page integration for host streaming / audience watching / live list only. Not responsible for co-guest, PK, gifts, barrage, beauty, or audio effects extensions (use 'search_trtc_knowledge' for those)
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. The parameter name must be framework. Do not use platform. Allowed values: android | ios.',
    goals: 'Feature list (multi-select). Allowed values: live_list (live list page, audience entry) | host_streaming (host streaming page) | audience_streaming (audience watching page). A complete mobile live streaming app usually needs live_list + host_streaming + audience_streaming.',
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

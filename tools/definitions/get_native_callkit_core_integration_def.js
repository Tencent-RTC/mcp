import { INTEGRATION_BOUNDARY_SUFFIX } from './integration-boundary.js';
const TOOL_DESCRIPTION = `
Purpose:
Return Native CallKit Core integration docs for explicit codegen implementation.

When to call (MUST):
- User explicitly asks for runnable project integration code or concrete implementation steps.

When NOT to call:
- Pure feature Q&A, documentation lookup, API/component explanation, troubleshooting.

Scope details:
Returns Native CallKit Core integration documentation based on AtomicXCore SDK, for custom calling UI (no preset UI) including call, answer, and offline push flows.

Common trigger lexicon (may overlap with 'get_native_call_uikit_integration' preset 工具）：
集成 CallKit, 接入 CallKit, 音视频通话, 语音通话, 视频通话, 1v1 通话, 多人通话, 通话功能, 拨打电话, 接听电话, 来电, 离线推送, VoIP
When only common triggers are hit, ask a clarification first: "Do you prefer preset default UI (TUICallKit) or Core SDK custom UI?" Call this tool only after user chooses custom/Core; if user chooses preset/default, call 'get_native_call_uikit_integration'.

Core-SDK-only trigger lexicon (direct call, no clarification needed):
Core SDK, AtomicXCore, 无 UI, 自定义 UI, 自定义通话界面, 自己画通话页面, 不用默认 UI, 修改通话样式, CallStore, CallCoreView, DeviceStore

Inputs:
- framework: android | ios | flutter | uni-app
- goals: Feature module list (make_call | answer_call | offline_push)
- prompt: Original user question. Keep full context; do not compress into keyword summary.

Outputs:
- content: [{ type: 'text', text: Documentation body or explanatory text }]

Boundaries:
- If platform/framework is not specified, call 'present_framework_choice' first.
- For framework=uni-app, only this Core tool is supported (no TUICallKit preset path). Do not ask preset vs custom UI again; call this tool directly.
- If framework=uni-app and goals include offline_push, this tool returns a fallback note (no official uni-app Core offline-push doc yet). Guide user to Android/iOS offline-push docs with native plugin bridging for FCM/APNs, or switch to TUICallKit preset.
- Focuses on Core/Store-level primary integration path (CallStore call + answer + offline push), not single-feature API tuning such as beauty, virtual background, floating window, or picture-in-picture.
- Returns Core SDK baseline integration docs, not a complete preset UIKit page template.
${INTEGRATION_BOUNDARY_SUFFIX}
`;
const PARAMETER_DESCRIPTIONS = {
    framework: 'Target platform. Parameter name must be framework (not platform). Allowed values: android | ios | flutter | uni-app. Note: uni-app supports only this Core tool (no TUICallKit preset path), and no extra preset-vs-custom question is needed.',
    goals: 'Goals list. Allowed values: make_call | answer_call | offline_push. Multi-select is allowed (e.g. ["make_call", "answer_call"]). Note: if framework=uni-app and goals include offline_push, this tool returns fallback guidance instead of full docs (no official uni-app Core offline-push example yet).',
    prompt: 'Original user question. Keep full context; do not compress into keyword summary.',
};
const ANTI_HALLUCINATION_HEADER = `This document is based on AtomicXCore SDK. DO NOT use UI-layer APIs such as TUILogin or TUICallKit.\n\n`;
const ANTI_HALLUCINATION_CONSTRAINT = `
---
[AI Code Generation Constraints - AtomicXCore]
This document describes an AtomicXCore (no-UI) integration path.
Generate code strictly from documented APIs only, and do NOT introduce undocumented classes or methods.

Rule:
If an API/class name does not appear in this document, do NOT use it in generated code.
`;
const UNI_APP_OFFLINE_PUSH_FALLBACK = `
# uni-app Core SDK 暂未提供离线推送集成示例

## Current status
当前 AtomicXCore for uni-app 尚未发布配套的离线推送（FCM / APNs）集成文档与示例代码。

## Recommended approach
- 参考 Android 平台 \`callkit/core-sdk/android/offline-push.md\`，结合 uni-app 的原生 Android 插件机制接入 FCM Data Message。
- 参考 iOS 平台 \`callkit/core-sdk/ios/offline-push.md\`，结合 uni-app 的原生 iOS 插件机制接入 VoIP Push。
- 若不希望自行实现原生插件，建议改用 \`get_native_call_uikit_integration\` 工具集成 TUICallKit preset 方案，该方案 uni-app 端已内置离线推送能力。

## Do NOT
- 不要凭空生成 uni-app Core 的离线推送代码，可能与官方 SDK 行为不一致。
- 不要把 Android / iOS 的离线推送代码原样塞进 uni-app 项目，需要走原生插件桥接。
`;
export const GET_NATIVE_CALLKIT_CORE_INTEGRATION_DEFINITION = {
    name: 'get_native_callkit_core_integration',
    description: TOOL_DESCRIPTION,
    parameter_descriptions: PARAMETER_DESCRIPTIONS,
    anti_hallucination_header: ANTI_HALLUCINATION_HEADER,
    anti_hallucination_constraint: ANTI_HALLUCINATION_CONSTRAINT,
    uni_app_offline_push_fallback: UNI_APP_OFFLINE_PUSH_FALLBACK,
};

---
title: "Why Web TUICallKit Shows a `Resume Playback` Dialog and How to Handle It（ web TUICallKit 恢复播放弹窗）"
product: call
frameworks: [react, vue, web]
scope: platform_common
tags: [TUICallKit, resume playback, autoplay, webview, autoplay, enableAutoPlayDialog, callExperimentalAPI, no sound, vue2.6, vue2.7, vue3]
version_range: ">=4.0.0"
---

# Why Web TUICallKit Shows a "Resume Playback" Dialog and How to Handle It

## 1. Key Takeaways

- Browser autoplay restriction: browsers block media with sound from playing before the user interacts with the page. When Web TUICallKit detects a playback failure, it shows a "Resume Playback" dialog requiring the user to click "Resume."
- This issue occurs most often in webview environments (e.g., H5 pages embedded in native apps).
- Disabling this dialog is not recommended because it may cause no-sound issues. If you must disable it, use `callExperimentalAPI` to set `enableAutoPlayDialog: 0`.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `enableAutoPlayDialog` | Autoplay dialog toggle | `1` enabled (default), `0` disabled |
| `callExperimentalAPI` | Invoke experimental API | Called via the TRTC instance to set `enableAutoPlayDialog` |
| `getTUICallEngineInstance()` | Get the TUICallEngine instance | Obtained from `TUICallKitAPI` to access the underlying engine |
| `getTRTCCloudInstance()` | Get the TRTC instance | Obtained from TUICallEngine to access the TRTC cloud instance |

## 3. Mechanism & Sequence

User enters the call page -> TUICallKit attempts to auto-play audio -> browser blocks autoplay -> playback fails -> TUICallKit shows the "Resume Playback" dialog -> user clicks "Resume" -> audio plays normally.

In webview scenarios, the host app imposes stricter autoplay restrictions, making this issue more likely.

## 4. Standard Usage

Disabling the dialog is not recommended. If your use case requires it:

1. Get the TUICallEngine instance from `TUICallKitAPI`.
2. Get the TRTC cloud instance from TUICallEngine.
3. Call `callExperimentalAPI` on the TRTC instance to set `enableAutoPlayDialog: 0`.

```javascript
// React: @trtc/calls-uikit-react
// Vue 3: @trtc/calls-uikit-vue
// Vue 2.7: @trtc/calls-uikit-vue2
// Vue 2.6: @trtc/calls-uikit-vue2.6  （API 一致，仅包名不同）
import { TUICallKitAPI } from "@trtc/calls-uikit-react";

const trtcCloudInstance = TUICallKitAPI?.getTUICallEngineInstance()?.getTRTCCloudInstance();
const params = {
  api: 'enableAutoPlayDialog',
  params: { enable: 0 },
};
trtcCloudInstance?.callExperimentalAPI(JSON.stringify(params));
```

## 5. Expected Results

- Dialog enabled: a "Resume Playback" prompt appears during calls; audio plays normally after the user clicks it.
- Dialog disabled: no prompt appears during calls; audio auto-plays once the browser allows it (if still blocked, there is no sound).

## 6. Common Pitfalls

- Pitfall 1: Assuming the dialog is a TUICallKit bug (it is actually the browser's autoplay restriction policy).
- Pitfall 2: Disabling the dialog and expecting audio to play correctly in all scenarios (disabling the dialog does not bypass the autoplay restriction; no-sound issues may still occur).
- Pitfall 3: Calling `enableAutoPlayDialog` before TUICallKit initialization (it must be called after obtaining the TRTC instance).

## 7. Problem Definition (retrieval hint)

Web TUICallKit shows a "Resume Playback" dialog during calls, requiring a user click before audio is heard. How to resolve this and whether the dialog can be disabled.

## 8. Alternative Queries (retrieval recall)

- Why is there no sound in TUICallKit calls?
- Why does TUICallKit show a "Resume Playback" prompt?
- How to disable the TUICallKit autoplay dialog?
- How to fix no sound in TUICallKit inside a webview?
- How to configure `enableAutoPlayDialog`?

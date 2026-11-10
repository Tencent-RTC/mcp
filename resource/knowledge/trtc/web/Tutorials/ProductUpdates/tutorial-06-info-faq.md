---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-06-info-faq.md'
nav_path:
  - "Tutorials"
  - "Product Updates"
product: "trtc"
---
## 1. Integration & Environment

### What are the differences between Web SDK v5 and v4?

TRTC Web SDK v5 is a brand-new upgrade for the Web platform, providing a flattened interface, greatly simplified APIs, and reduced integration costs. In multi-person audio/video scenarios, it offers better performance and weak network resistance. For more information, please refer to: [v5 SDK Documentation](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/index.html), [npm address](https://www.npmjs.com/package/trtc-sdk-v5), [Changelog](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-01-info-changelog.html).

> **Note:**
> - v4 is no longer maintained. Please upgrade to v5 as soon as possible. Refer to: [Upgrade Guide](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-00-info-update-guideline.html).
> - v4 materials: [v4 SDK Documentation](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/index.html), [npm address](https://www.npmjs.com/package/trtc-js-sdk), [Changelog](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-01-info-changelog.html).

### How to handle the issue where v2.x and v3.x SDKs cannot work normally on Chrome 96+?

The latest [Chrome 96 has deprecated Plan-B](https://www.chromestatus.com/feature/5823036655665152), which causes TRTC Web SDK v2.x and v3.x to fail. Please upgrade to the latest v5.x as soon as possible. The v5.x interface is incompatible with v2.x/v3.x. Please refer to [Quick Start (Web)](https://www.tencentcloud.com/document/product/647/16863) for the upgrade.

### Which browsers are supported by the Web SDK?

For detailed browser support, please refer to [Browsers Supported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html). For environments not listed, you can open [TRTC Capability Test](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) in the current browser to test WebRTC support.

### Some mobile browsers cannot run TRTC for publishing/subscribing?

For detailed browser support, please refer to [Browsers Supported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html). For environments not listed, you can open [TRTC Capability Test](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) in the current browser to test WebRTC support.

### WeChat built-in browser on iOS cannot publish streams normally?

WeChat built-in browser on iOS 14.3+ can publish streams normally. Please refer to [Browsers Supported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html) for more details.

### Unable to capture camera and microphone in WeChat H5?

This might happen if WeChat data has been cleared or it's a fresh installation. In such cases, the default browser kernel used by WeChat might not support device capture. WeChat will automatically download and install the XWeb kernel that supports capture when connected to Wi-Fi. You can retry after being on Wi-Fi for some time (e.g., half an hour).

### Why does the TRTC Web SDK work fine in local development but fail after deployment?

For security and privacy reasons, browsers restrict device capture to secure environments (e.g., `https`, `localhost`, `file://`). Device capture is prohibited under HTTP protocol.

If it works locally but fails after deployment, check if your page is deployed via HTTP. If so, use HTTPS and ensure you have a valid SSL certificate. For details, see [URL and Protocol Restrictions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html#h2-2).

### Calls fail but work after switching networks?

This is usually caused by firewall restrictions. Please check your firewall configuration. Refer to [Firewall Restrictions](https://www.tencentcloud.com/document/product/647/34399) for details.

### Are TRTC Web, Mini Program, and PC versions interoperable?

Yes, TRTC supports full platform interoperability.

### "Permission denied" error when using TRTC Web SDK in an iframe?

To use WebRTC in an iframe, you need to add the `allow` attribute to the iframe tag:
```javascript
<iframe allow="microphone; camera; display-capture;">
```

### Precautions for using Vue 3?

If you encounter issues using TRTC with Vue 3, we recommend upgrading to the latest SDK version.
```javascript
import { markRaw } from 'vue';
const trtc = markRaw(TRTC.create()); 
```

### Pre-call audio/video device testing?

Please refer to [Check Environment and Device Before Calls](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-23-advanced-support-detection.html).

### How to detect current network quality in real-time?

Please refer to [Detect Network Quality](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-24-advanced-network-quality.html).

### Known issues with WebRTC?

Please refer to [WebRTC Known Issues and Workarounds](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-02-info-webrtc-issues.html).

## 2. Room & User Management

### What is the lifecycle of a TRTC room? Will the room persist indefinitely? Does the room automatically get destroyed when all users leave? Can I create a permanent room?

A room is automatically created when the first user enters. When all users have left the room, the room will be automatically destroyed. TRTC does not support creating permanent rooms; the room lifecycle is managed automatically as users enter and exit. If you need to keep a room "alive", you can keep a bot user in the room.

### How to get TRTC room event callbacks (user enter/leave, room create/destroy)?

Room event callbacks are server-side callbacks. You need to configure them via [Server-side Callbacks](https://cloud.tencent.com/document/product/647/51586). On the client side, you can listen to the `REMOTE_USER_ENTER` / `REMOTE_USER_EXIT` events for remote user enter/exit notifications, but room-level create/destroy events must be obtained via server-side callbacks.

### How to resolve the 70003 "The UserSig in use is illegal" error when entering a room?

The 70003 error indicates UserSig verification failure, please refer to [UserSig Generation](https://trtc.io/document/35166). Common causes:
1. UserSig truncated: Ensure the signature calculation result is fully transmitted
2. sdkAppId mismatch: Ensure the sdkAppId used to generate the UserSig matches the one passed to `enterRoom`
3. Incorrect key: Verify the SDKSecretKey in the console

We recommend using the [Console UserSig Generator](https://console.trtc.io/usersig) to verify your generated UserSig.

### When will the [KICKED_OUT event](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.KICKED_OUT) be triggered?

This event is triggered when a user is removed from the room, for example: another user logs in with the same userID, the [Remove User](https://www.tencentcloud.com/document/product/647/40496) REST API is called, or the [Dissolve Room](https://www.tencentcloud.com/document/product/647/50089) REST API is called.

> **Note:**
> Logging in with the same userID simultaneously is not allowed and may cause call exceptions.

### Can the Web SDK listen for remote users leaving the room?

Yes, use the [REMOTE_USER_EXIT](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_USER_EXIT) event. From v5.15.0+, the `reason` field is added to identify why the remote user left.

### How many concurrent upstream users are supported in a single room?

**Upstream users** . A user becomes an upstream user after successfully publishing a local stream by calling `startLocalVideo`, `startLocalAudio`, or `startScreenShare`.

TRTC limits the number of concurrent upstream users in a single room to **50**. If there are already 50 upstream users in a room, the 51st user will fail to publish. To allow the 51st user to publish, another user must stop publishing first by calling `stopLocalVideo`, `stopLocalAudio`, or `stopScreenShare` to free up a slot.

## 3. Local Media Capture & Publishing

### What do NotFoundError, NotAllowedError, NotReadableError, OverConstrainedError, and AbortError mean?

These are errors triggered when device capture fails. For details, refer to [DEVICE_ERROR](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-ERROR_CODE.html#.DEVICE_ERROR).

### Is setting resolution via width and height applicable to all browsers?

Due to device and browser limitations, the video resolution might not match exactly. Browsers will automatically adjust it to the closest supported resolution. For details, see [profile parameter in trtc.startLocalVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo).

### Which video resolutions are supported?

Web SDK supports 720p, 1080p, 2k, and 4k resolutions. For more settings, see [Video Quality Settings](https://www.tencentcloud.com/document/product/647/74680).

### Why is the captured resolution lower than 1080p even if the camera supports it?

This usually happens when the camera is already occupied by another process with a lower resolution. Solution: Ensure the camera is released when not in use.

### Android: Audio comes from the earpiece instead of the speaker after capturing the mic?

Android devices often have multiple microphones: ['default', 'Speakerphone', 'Headset earpiece']. If you don't specify a mic in `trtc.startLocalAudio`, it might default to 'Headset earpiece'. To use the speaker, specify the mic with the 'Speakerphone' label.

### How to set video resolution?

You can set resolution, frame rate, and bitrate via predefined profiles or custom parameters. For details, see [Setting Camera Profile](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-14-basic-set-video-profile.html).

## 4. Remote Stream Subscription & Rendering

### Video is visible but no audio is heard?

- Due to browser autoplay policies, audio playback might be blocked if there's no user interaction. See [Handle Autoplay Restriction](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-21-advanced-auto-play-policy.html).
- For other issues, check the volume values on both sending and receiving sides via the monitoring dashboard.

### Can the Web SDK get the current volume level?

Yes, use the [AUDIO_VOLUME event](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.AUDIO_VOLUME). For details, see [Detect Audio Volume](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-17-basic-detect-volume.html).

### What types does the `view` parameter of `startRemoteVideo` accept?

The `view` parameter accepts `string | HTMLElement | Array<HTMLElement> | null`:
- **string**: DOM element id (e.g., `'remote-video'`)
- **HTMLElement**: DOM element instance (e.g., `document.getElementById('remote-video')`)
- **null**: Do not render video, but the stream will still be pulled and consume bandwidth

Note: The SDK will create a `<video>` tag **inside** the provided element to play the video. Therefore, you should pass a `<div>` container, not a `<video>` tag itself.

## 5. Screen Sharing

### Is the screen sharing style customizable?

The screen sharing style is controlled by the browser and cannot be modified.

### How to capture system audio during screen sharing?

Please refer to [Screen Sharing](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-16-basic-screencast.html#h2-6).

### Safari: "getDisplayMedia must be called from a user gesture handler" error?

Safari requires `getDisplayMedia` to be called within 1 second of a user click event. We recommend calling screen capture logic immediately in the `onClick` handler. For details, see [Screen Sharing](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-16-basic-screencast.html).

### Mac Chrome: "NotAllowedError" or "NotReadableError" during screen sharing?

This might happen even if screen recording is authorized. [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail). Solution: Go to Settings > Security & Privacy > Privacy > Screen Recording, disable and re-enable Chrome's authorization, then restart Chrome.

## 6. Device Management & Permissions

### How to clear the device list when a camera is unplugged?

Listen to the [DEVICE_CHANGED event](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.DEVICE_CHANGED) and refresh the device list. For details, see [Handle Device Change](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-25-advanced-device-change.html).

### How to switch camera and microphone?

Refer to [Switching Camera/Mic](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-13-basic-switch-camera-mic.html).

### How to check device permission status?

From v5.13.0+, use `TRTC.getPermissions` to check, request, and listen for permission status. For details, see [Check Environment and Device Before Calls](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-23-advanced-support-detection.html).

### How to handle device capture exceptions?

The SDK automatically detects device changes and tries to recover capture. If it fails, an error event is thrown. For details, see [Handle Device Change](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-25-advanced-device-change.html).

## 7. QoS & Network Optimization

### How to handle audio autoplay failure?

Due to browser restrictions, audio might be blocked without user interaction. For details, see [Handle Autoplay Restriction](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-21-advanced-auto-play-policy.html).

### How to detect network quality before a call?

You can create two TRTC instances to test uplink and downlink network quality. For details, see [Detect Network Quality](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-24-advanced-network-quality.html).

### How to handle the [trtc.on('error') event](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.ERROR)?

This event indicates an unrecoverable error. You can try to re-enter the room or refresh the page.

### WebSocket "closed before connection is established" error?

This error can be ignored. The SDK uses multiple racing WebSockets to speed up room entry; slower connections are closed after one succeeds.

## 8. Advanced Features & Plugins

### Support for dual streams (simulcast) and watermarks?

Refer to [Multi-Person Video Calls](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-27-advanced-small-stream.html) and [Enable Watermark Plugin](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-29-advance-water-mark.html).

### How to enable simulcast?

Simulcast allows encoding two video streams (big and small) simultaneously to save downstream bandwidth in multi-person scenarios. For details, see [Multi-Person Video Calls](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-27-advanced-small-stream.html).

### What plugins are supported?

The SDK supports various plugins for beauty filters, virtual background, watermark, audio mixing, AI noise reduction, voice changer, real-time transcription, etc. For details, see [Plugin System Overview](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-31-advanced-plugins-overview.html).

### How to implement custom capture and rendering?

You can pass a custom `MediaStreamTrack` for capture or listen to the `TRACK` event for custom rendering. For details, see [Custom Capturing and Rendering](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-20-advanced-customized-capture-rendering.html).

### If multiple clients in the same room call startPlugin for RealtimeTranscriber, will it create multiple transcription tasks/bots? How is it billed?

Each call to `startPlugin('RealtimeTranscriber', ...)` creates an independent transcription task and returns a `transcriberRobotId`. Multiple clients calling it separately will create multiple transcription tasks.

For billing rules, please refer to [Real-time Speech Transcription Billing](https://trtc.io/document/67832). We recommend that only one client (e.g., the host) in the same room initiates the transcription task, while other clients receive results by listening to the `REALTIME_TRANSCRIBER_MESSAGE` event to avoid duplicate billing.

### Does the TRTC Web SDK support TTS (Text-to-Speech)?

TRTC supports TTS. Please refer to the [TTS Documentation](https://trtc.io/document/68340).

### How to implement cloud recording? Why can't I find StartWebRecord and similar APIs in the Web SDK?

Cloud recording is a **server-side capability** and is not part of the Web SDK. Choose the appropriate document based on the recording type:
- [Implement Cloud Recording](https://trtc.io/document/46960): Record audio/video streams of all users in the room
- [Implement Web Page Recording](https://trtc.io/document/72066): Record web page content

On the Web SDK side, you can use the `userDefineRecordId` parameter (passed when calling `TRTC.create()`) to associate recording files.

## 9. Error Handling & Debugging

### How to enable debug mode?

Add `trtcDebug=1` to the URL (e.g., `www.example.com/?trtcDebug=1`). For details, see [Debug](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-18-basic-debug.html).

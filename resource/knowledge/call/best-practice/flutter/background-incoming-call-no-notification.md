---
title: TUICallKit Flutter — No System Notification, No Answer/Decline Buttons, App Not Launched on Background/Lock-Screen Incoming Calls (Notification / VoIP / Permission Troubleshooting)
product: call
frameworks: [flutter, android, ios]
scope: platform_specific
tags: [TUICallKit, Flutter, Android, iOS, background incoming call, lock screen, TIMPush, VoIP, CallKit, Notification, enableIncomingBanner, overlay permission]
version_range: ">=2.0.0"
---

# TUICallKit Flutter — No System Notification, No Answer/Decline Buttons, App Not Launched on Background/Lock-Screen Incoming Calls (Notification / VoIP / Permission Troubleshooting)

## 1. Key Takeaway

- Android: To fully support **system notification + answer/decline buttons + auto-launch the app** for background/lock-screen incoming calls, you need TIMPush (FCM or vendor push channels) + the `enableIncomingBanner` switch + **overlay permission** and **background launch permission**. Missing any one of these will degrade the experience (e.g., ringtone only without notification/buttons, or app not launched).
- iOS: **TIMPush currently does not support iOS VoIP push** (explicitly stated in the official documentation, updated 2026-08-12). The Flutter iOS side can only use **APNs regular push**. It cannot use the system-level CallKit incoming call UI. Therefore, when the app is killed or the screen is locked, iOS **cannot** auto-launch an answer/decline button screen like Android. It can only receive a regular notification; tapping the notification wakes the app.
- Troubleshooting direction: First determine the platform (Android: permission troubleshooting; iOS: push type capability boundary). The root causes and fixes are entirely different — do not apply the same solution to both.
- If the app is in the **foreground** and receives a call but shows no buttons / does not launch the call UI: This is unrelated to push. Check whether `enableIncomingBanner` is configured or overlay permission is missing (Android), or whether the `onCallReceived` event listener is missing (iOS/Android common).

## 2. Field Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `TIMPush` (`tencent_cloud_chat_push` plugin) | General offline push solution | Android supports VoIP-type push (via FCM or vendor channels); iOS **currently supports APNs only**, not VoIP |
| `TUIOfflinePushInfo.iOSPushType` | Specify iOS push type | Can only be set to `TUICallIOSOfflinePushType.APNs`; setting it to VoIP-related values has no effect under current official capabilities |
| `enableIncomingBanner` | Control callee-side incoming call display mode | `false` (default): directly tries to launch the full-screen call UI; `true`: shows a banner notification first, requires **overlay permission** to display |
| Overlay permission (display over other apps) | Android system permission | Required for showing custom incoming call banners and call floating windows; missing this prevents banners/answer buttons from appearing |
| Background launch permission | Android system permission (strictly enforced by some vendors like vivo) | Required for launching the call UI when the app is in the background; missing this prevents auto-launching the app |
| iOS CallKit / PushKit | iOS native system-level incoming call capability | Flutter TUICallKit **does not provide** official integration docs for this; only the native iOS SDK has related documentation |

## 3. Flow

User symptom: ringtone heard but no system notification, no answer/decline buttons at the top, app not launched -> Determine platform first:

**Android troubleshooting path**: Confirm TIMPush is integrated and push is registered -> Confirm the IM console has the correct FCM certificate uploaded with message type set to "pass-through (data) message" -> Confirm `enableIncomingBanner(true)` has been called -> Confirm the device has granted **overlay permission** and **background launch permission** (permission names vary by vendor; vivo/Redmi may require manual enabling) -> If the UI still does not launch, check whether the main Activity's task root logic (`isTaskRoot()`) is missing, and confirm the Activity launch mode is **not** `singleTask`.

**iOS troubleshooting path**: Confirm expectations are realistic — **iOS currently does not officially support VoIP push**, so system-level incoming call UI (answer/decline buttons, auto-launch when app is killed / screen locked) is not achievable -> For APNs regular push scenarios, verify the certificate is correctly uploaded, `iOSPushType` is set to `APNs`, and `TencentCloudChatPush().registerPush` is correctly called -> If the business absolutely requires the system-level incoming call experience, evaluate implementing a native bridge for PushKit + CallKit (beyond the scope of the official standard solution; requires custom implementation and maintenance).

## 4. Standard Usage

1. Both platforms: Install and register the `tencent_cloud_chat_push` plugin. Immediately call `TencentCloudChatPush().registerPush(...)` after a successful login.

2. **Android**:
   - Integrate FCM (or required vendor) push channels. In the IM console, set the message type to "pass-through (data) message".
   - Call `TUICallKit.instance.enableIncomingBanner(true)` to enable the incoming call banner (if banner + button display is desired).
   - Request overlay and background launch permissions:

     ``` kotlin
     PermissionRequester.newInstance(
         PermissionRequester.FLOAT_PERMISSION,
         PermissionRequester.BG_START_PERMISSION
     ).request()
     ```

   - In the app's default launch Activity (e.g., SplashActivity, and the **launch mode must not be `singleTask`**), add:

     ``` java
     if (!isTaskRoot() && getIntent() != null
         && getIntent().hasCategory(Intent.CATEGORY_LAUNCHER)
         && Intent.ACTION_MAIN.equals(getIntent().getAction())) {
         finish();
         return;
     }
     ```

3. **iOS**:
   - For APNs regular push only: Apply for and upload the APNs certificate. Set `offlinePushInfo.iOSPushType = TUICallIOSOfflinePushType.APNs`.
   - Clearly communicate to the business team: The iOS side **cannot** achieve "auto-launch system-level answer/decline buttons after the app is killed / screen locked" through the official standard solution. Users can only receive a notification and tap it to wake the app and enter the call flow.
   - If this experience is absolutely required, a custom native PushKit + CallKit bridge solution must be developed (not within the official TUICallKit support scope).

4. Both platforms: When receiving a call while in the **foreground**, you can listen for the `onCallReceived` event and use plugins like `flutter_local_notifications` to customize the notification appearance (independent of the offline push pipeline).

## 5. Verification

- Android: App in background / screen locked. After receiving an incoming call, a banner or full-screen UI is displayed with visible answer/decline buttons. Tapping correctly launches/wakes the app.
- iOS: App in background. An APNs notification is received. Tapping the notification wakes the app and enters the call flow. **Do not** expect a system-level answer/decline incoming call screen when the app is killed or the screen is locked (not supported by current official capabilities).
- Both platforms: When receiving a call in the foreground, the call invitation UI or custom notification is displayed correctly.

## 6. Common Mistakes

- Mistake 1: Treating Android and iOS background incoming call issues as the same problem. The root causes are entirely different (Android: permission configuration; iOS: official capability boundary). Applying the same solution (e.g., only checking permissions) will not resolve the iOS issue.
- Mistake 2: Believing that setting `iOSPushType = VoIP` on iOS will enable the system-level incoming call UI. TIMPush currently **does not support** iOS VoIP; setting this value has no effect. Only `APNs` is the currently supported valid value.
- Mistake 3: On Android, only configuring the push certificate without enabling overlay permission and background launch permission. Mistakenly thinking push was not received, when in reality the push was received but insufficient system permissions prevented the UI from launching (check logs first to confirm whether `onCallReceived` was triggered, then troubleshoot permissions).

## 7. Problem Definition (Search Anchor)

Flutter TUICallKit app receives incoming calls in background/lock screen but only hears a ringtone — no system notification, no answer/decline buttons, and app does not auto-launch. What configurations are needed for Android and iOS respectively (Notification, CallKit, VoIP Push, TIMPush).

## 8. Alternative Phrasings (Search Recall)

- Flutter TUICallKit no notification on background incoming call?
- Does TUICallKit Flutter iOS support VoIP incoming calls?
- Flutter incoming call banner not showing answer/decline buttons?
- Android background incoming call not launching the app?

## 9. References (Optional)

- Flutter offline push Notification configuration: `https://cloud.tencent.com/document/product/647/106014`
- Flutter VoIP configuration (official iOS limitation note): `https://cloud.tencent.com/document/product/647/106015`
- Android callee-side incoming call display strategy and permission troubleshooting: `https://cloud.tencent.com/document/product/647/78767`

---
title: TUICallKit Flutter iOS Startup Crash Troubleshooting (Minimum OS Version, Release Symbol Stripping, VoIP PushKit Applicability)
product: call
frameworks: [flutter, ios]
scope: platform_specific
tags: [TUICallKit, Flutter, iOS, crash, startup crash, tencent_calls_uikit, PushKit, CallKit, VoIP, symbol not found, minimum OS version]
version_range: ">=2.0.0"
---

# TUICallKit Flutter iOS Startup Crash Troubleshooting (Minimum OS Version, Release Symbol Stripping, VoIP PushKit Applicability)

## 1. Key Takeaway

- Minimum OS version: The Flutter plugin `tencent_calls_uikit` officially requires iOS **12.0** or later. iOS 16 falls within this range and is natively compatible — no additional adaptation is needed.
- Flutter TUICallKit's **standard offline push solution does not integrate PushKit VoIP**. It only provides APNs regular push (data message). Therefore, the iOS 13+ rule of "app gets killed if a VoIP push is received without reporting to CallKit" **does not apply** to standard integrations that have not been custom-extended.
- The most common real cause of Flutter TUICallKit iOS startup crashes: **Xcode symbol stripping optimization in Release builds incorrectly removes TRTC C symbols**, resulting in `symbol not found`. This is unrelated to VoIP/PushKit/CallKit.
- If developers **additionally integrate PushKit VoIP on their own** (beyond the TUICallKit official standard solution), they must comply with Apple's mandatory rule: "after receiving a VoIP push, `reportNewIncomingCall` / `reportNewIncomingConversation` must be called immediately; otherwise the system will kill the app." This is the responsibility of the custom extension, not a built-in TUICallKit behavior.

## 2. Field Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `tencent_calls_uikit` | Flutter TUICallKit plugin package name | Officially requires iOS 12.0+. This is a different dependency level from `TXLiteAVSDK_Professional` (a separate library with podspec declaring iOS 8.0) — do not confuse the two |
| APNs (remote push) | Official offline push solution for Flutter TUICallKit | Implemented via the `tencent_cloud_chat_push` plugin; iOS side only involves APNs certificate configuration, not PushKit |
| PushKit VoIP | iOS native system-level incoming call push mechanism | Flutter TUICallKit **official documentation does not provide** this approach; only native iOS (Swift/ObjC) integration docs include it (based on `LiveCommunicationKit` / `CallKit`) |
| `reportNewIncomingCall` / `reportNewIncomingConversation` | Mandatory reporting interface after receiving VoIP push | Only required when **PushKit VoIP is registered**; failure to report within 5 seconds causes a system kill. Not applicable to standard Flutter solutions that have not integrated PushKit |
| Deployment Postprocessing / Strip Style | Xcode Build Settings options | Used to prevent Release builds from incorrectly stripping TRTC FFI-related C symbols — this is the known real cause of Flutter TUICallKit crashes |

## 3. Flow

App launches or receives a call-related event -> Crash / fails to launch -> Troubleshooting direction 1: Check if this is a **Release build** without symbol stripping settings configured -> If so, TRTC C symbols were incorrectly removed causing `symbol not found` -> Fix: set `Deployment Postprocessing = Yes` + `Strip Style = Non-Global Symbols` -> Verify: Release build runs normally without crashes.

Troubleshooting direction 2 (only applicable when the project has **additionally self-integrated PushKit VoIP**): VoIP push received -> `reportNewIncomingCall` / `reportNewIncomingConversation` not called within 5 seconds -> System forcefully kills the app -> Fix: report immediately in the `PKPushRegistryDelegate`'s `didReceiveIncomingPushWith` callback.

## 4. Standard Usage

1. Confirm the project's `tencent_calls_uikit` dependency version and target device OS version: iOS 12.0 and above are officially supported. iOS 16 requires no special adaptation.
2. If a `symbol not found` crash occurs when running the iOS Release build, in Xcode's `Build Settings`:
   - Set **Deployment Postprocessing** to **Yes**.
   - Set **Strip Style** (Release configuration) to **Non-Global Symbols**.
3. If the business only needs standard offline incoming call notification capability, integrate the **APNs** solution following the official Flutter `tencent_cloud_chat_push` plugin documentation. There is **no need** to additionally integrate PushKit VoIP (the official Flutter solution does not provide this capability).
4. If the business has a strong requirement to achieve system-level VoIP incoming call experience on Flutter iOS (e.g., system incoming call UI when the screen is locked / process is killed), developers must implement a custom native bridge (`MethodChannel` + native Swift layer referencing the iOS native CallKit/PushKit integration guide) and strictly comply with the "report within 5 seconds" rule to avoid crashes. This is a custom extension, not a built-in TUICallKit Flutter capability.

## 5. Verification

- On iOS 16 (and other versions above 12.0), TUICallKit Flutter starts, logs in, and makes/receives calls normally with no OS compatibility issues.
- No `symbol not found` crash occurs when running the Release build.
- Standard projects that have not additionally integrated PushKit will not be killed by the system due to the "VoIP push not reported" rule (because the standard solution has not registered PushKit VoIP, this rule is not triggered).

## 6. Common Mistakes

- Mistake 1: Confusing the version requirements of the underlying library `TXLiteAVSDK_Professional` with the Flutter plugin `tencent_calls_uikit`. They are different dependency levels and should be verified separately.
- Mistake 2: Believing the most common cause of Flutter TUICallKit iOS startup crashes is "PushKit VoIP not reported to CallKit". The official Flutter standard solution has not integrated PushKit VoIP, so this rule does not apply to standard integrations. The actual most common cause is `symbol not found` due to Release symbol stripping.
- Mistake 3: Thinking you can directly call native iOS `CXProvider.reportNewIncomingCall` or `LiveCommunicationKit` APIs from the Flutter side. These are native Swift/ObjC APIs that cannot be called directly from Flutter — they must be implemented through a native bridge layer (and TUICallKit does not officially provide this bridge).

## 7. Problem Definition (Search Anchor)

Flutter TUICallKit iOS startup crash troubleshooting: minimum OS version requirement, iOS 16 compatibility, and whether PushKit VoIP CallKit reporting rules apply to standard Flutter integrations.

## 8. Alternative Phrasings (Search Recall)

- Flutter TUICallKit iOS won't open / crashes on startup — how to troubleshoot?
- Does tencent_calls_uikit support iOS 16?
- Does TUICallKit Flutter need PushKit VoIP integration?
- Flutter iOS Release build symbol not found — how to fix?

## 9. References (Optional)
- `tencent_calls_uikit` official minimum version requirement (iOS 12.0+): `https://pub.dev/packages/tencent_calls_uikit`

---
title: TUICallKit Flutter iOS — Call Audio Interrupted When App Goes to Background / Screen Locked (Background Modes + AVAudioSession Configuration)
product: call
frameworks: [flutter, ios]
scope: platform_specific
tags: [TUICallKit, Flutter, iOS, VoIP, AVAudioSession, Background Modes, UIBackgroundModes, playAndRecord, keep alive, background, CallKit, MethodChannel]
version_range: ">=2.0.0"
---

# TUICallKit Flutter iOS — Call Audio Interrupted When App Goes to Background / Screen Locked (Background Modes + AVAudioSession Configuration)

## 1. Key Takeaway

- Required: iOS restricts background apps from accessing the microphone/speaker. If not configured correctly, audio capture/playback will be interrupted by the system when the app goes to background or the screen is locked.
- Root cause: Background Modes not declared, or `AVAudioSession` not manually configured to the `.playAndRecord` category. TUICallKit **does not automatically configure** `AVAudioSession`; developers must set it up in the native layer.
- Fix: Enable three Background Modes items in Xcode (this is **not** iOS-version-specific — all versions require this) + configure `AVAudioSession` in the native layer before the call starts via Flutter `MethodChannel`.
- No CallKit integration required: This solution does not depend on the iOS `CallKit` framework. Background audio keep-alive for voice/video calls is achieved purely through Background Modes + `AVAudioSession`.
- Clarification (avoid misuse): Apple's `com.apple.developer.avfoundation.multitasking-camera-access` entitlement is exclusively for **camera background capture in Picture-in-Picture (PiP) scenarios**. It is unrelated to this problem (audio call background keep-alive) — do not confuse the two.

## 2. Field Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `Audio, AirPlay, and Picture in Picture` | Background Modes capability | Maintains background audio capture/playback capability; must be enabled for all iOS versions |
| `Voice over IP` | Background Modes capability | Supports VoIP background execution; must be enabled for **all versions**, not just iOS 18+ |
| `Remote notifications` (optional) | Background Modes capability | For receiving offline push notifications; not required for audio keep-alive |
| `AVAudioSession.Category.playAndRecord` | Audio session category | Supports simultaneous playback and recording; must be set **manually** before the call — the SDK does not configure this automatically |
| `.allowBluetooth` / `.allowBluetoothA2DP` | Audio session options | Enables Bluetooth headset and high-quality Bluetooth audio (A2DP) support |
| `MethodChannel` | Flutter-native communication bridge | `AVAudioSession` configuration must be done in the native Swift/ObjC layer; Flutter triggers it via MethodChannel |

## 3. Flow

App goes to background / screen locked -> iOS restricts background microphone/speaker access -> If not configured, call audio is interrupted (remote participant cannot hear local audio) -> Check: verify Background Modes has `Audio, AirPlay, and Picture in Picture` + `Voice over IP` enabled -> Identify: verify `AVAudioSession.setCategory(.playAndRecord)` and `setActive(true)` are called before the call starts -> Fix: declare Background Modes in Xcode + configure `AVAudioSession` in native layer + trigger via Flutter `MethodChannel` -> Verify: call audio continues after going to background / locking screen; `Info.plist` contains `audio` / `voip` in `UIBackgroundModes`.

## 4. Standard Usage

1. In Xcode, open the project, select `Target` > `Signing & Capabilities` > `+ Capability`, search for and add `Background Modes`. Check `Audio, AirPlay, and Picture in Picture` and `Voice over IP` (`Remote notifications` is optional, for offline push). After configuration, `Info.plist` will automatically contain:

   ``` xml
   <key>UIBackgroundModes</key>
   <array>
       <string>audio</string>
       <string>voip</string>
   </array>
   ```

2. Implement the audio session configuration method in the iOS native layer (Swift). Call it before the call starts (in the call view's `viewDidLoad`, before initiating `calls`, or before accepting `accept`):

   ``` swift
   import AVFoundation

   func setupAudioSessionForCall() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           // .playAndRecord: supports simultaneous playback and recording
           // .allowBluetooth / .allowBluetoothA2DP: supports Bluetooth headset and high-quality Bluetooth audio
           try audioSession.setCategory(.playAndRecord, options: [.allowBluetooth, .allowBluetoothA2DP])
           try audioSession.setActive(true)
       } catch {
           // Audio session configuration failed
       }
   }
   ```

3. Register a `MethodChannel` on the Flutter side. Call the native `setupAudioSessionForCall()` when a call starts (`calls` / `accept` succeeds). When the call ends, you can restore or deactivate `AVAudioSession` to avoid affecting other audio scenarios.

4. You do not need to integrate the iOS `CallKit` framework to achieve the above background audio keep-alive. If you later need system incoming call UI / lock-screen answer capabilities, that requires additional `CallKit` integration (a separate capability, not a prerequisite for background keep-alive).

## 5. Verification

- After going to background or locking the screen, call audio capture/playback is not interrupted; the remote participant can still hear the local audio.
- `Info.plist` correctly contains `audio` and `voip` in `UIBackgroundModes`.
- Background audio keep-alive works correctly even without integrating `CallKit`.

## 6. Common Mistakes

- Mistake 1: Assuming TUICallKit Flutter/iOS SDK has built-in `AVAudioSession` configuration. In reality, the SDK does not configure this automatically; developers must explicitly call `setCategory` / `setActive` in the native layer.
- Mistake 2: Confusing "call audio background keep-alive" with "Picture-in-Picture (PiP) camera background capture". Applying for the `com.apple.developer.avfoundation.multitasking-camera-access` entitlement for a voice/video call — this entitlement is only for **camera video** background capture in PiP scenarios and is unrelated to audio call keep-alive. Regular calls do not need it.
- Mistake 3: Thinking `Voice over IP` only needs to be checked on iOS 18+. In fact, the three Background Modes items are not iOS-version-specific — all versions (iOS 15+) require the same configuration.

## 7. Problem Definition (Search Anchor)

Flutter TUICallKit iOS call audio interrupted when app goes to background or screen is locked. Whether Background Modes and AVAudioSession configuration is required. Whether CallKit integration is needed. Difference from the Picture-in-Picture approach.

## 8. Alternative Phrasings (Search Recall)

- TUICallKit Flutter iOS no sound after going to background?
- Flutter iOS call audio stops when screen is locked?
- Can voice calls stay alive in background without CallKit?
- How to configure AVAudioSession playAndRecord for background audio capture?

## 9. References (Optional)
- Tencent Cloud TRTC iOS Picture-in-Picture documentation (the actual use case for `multitasking-camera-access` entitlement): `https://cloud.tencent.com/document/product/647/128652`

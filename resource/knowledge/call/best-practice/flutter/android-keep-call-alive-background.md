---
title: Keep TUICallKit Flutter Calls Alive When the Android App Goes to Background (Foreground Service Configuration)
product: call
frameworks: [flutter, android]
scope: platform_specific
tags: [TUICallKit, Flutter, Android, foreground service, CallForegroundService, keep alive, background, FOREGROUND_SERVICE_MICROPHONE, FOREGROUND_SERVICE_CAMERA, Android14, foregroundServiceType, MethodChannel]
version_range: ">=2.0.0"
---

# Keep TUICallKit Flutter Calls Alive When the Android App Goes to Background (Foreground Service Configuration)

## 1. Key Takeaway

- Required: Android restricts background apps from accessing the microphone/camera. Without a foreground service to keep the app alive, audio/video capture will be interrupted by the system when the app goes to the background or the screen is locked.
- Root cause: Starting from Android 9 (API 28), accessing the microphone/camera requires declaring foreground service permissions. Starting from Android 14 (API 34), foreground services must explicitly declare `foregroundServiceType`; otherwise, starting a foreground service will throw an exception.
- Fix: TUICallKit Flutter does **not include** a built-in foreground service. You need to implement `CallForegroundService` in the Android native layer and invoke its `start()`/`stop()` from the Flutter side via `MethodChannel` at the appropriate time.
- Version constraint: When `targetSdkVersion >= 34`, if the `<service>` tag does not declare `android:foregroundServiceType="camera|microphone"`, calling `startForegroundService` will throw `MissingForegroundServiceTypeException` and crash.

## 2. Field Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `FOREGROUND_SERVICE` | Base permission to use foreground services | Required since Android 9 (API 28) |
| `FOREGROUND_SERVICE_MICROPHONE` / `FOREGROUND_SERVICE_CAMERA` | Declare microphone/camera usage in foreground services | Required since Android 14 (API 34) |
| `android:foregroundServiceType="camera\|microphone"` | Declare the service type in the `<service>` tag | Must match the above permissions; missing this on API 34+ causes a crash |
| `CallForegroundService` (must be implemented by you) | The foreground service class for keep-alive | Not built into TUICallKit; developers must create it and call `startForeground` |
| `MethodChannel` | Bridge between Flutter and Android native layer | Used to trigger `start()` from the Flutter side when a call starts or the app goes to background |

## 3. Flow

App goes to background / screen locked -> Android reclaims background microphone/camera access -> Call capture interrupted (no audio / black screen) -> Check: verify foreground service permissions and `<service>` declaration -> Identify: missing `CallForegroundService` or `start()` not triggered when going to background -> Fix: declare permissions + implement foreground service class + bridge via `MethodChannel` -> Verify: audio/video capture continues after going to background / locking screen; a persistent notification appears in the notification bar.

## 4. Standard Usage

1. Declare foreground service permissions in `AndroidManifest.xml` and set `foregroundServiceType` for the `<service>`:

   ``` xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

   <application>
       <service
           android:name=".CallForegroundService"
           android:enabled="true"
           android:exported="false"
           android:foregroundServiceType="camera|microphone" />
   </application>
   ```

2. Implement `CallForegroundService` in the Android native layer (extend `Service`, call `startForeground` with a persistent notification in `onCreate`), and provide static `start(context)` / `stop(context)` methods for external invocation.

3. Register a `MethodChannel` on the Flutter side. Call the native `CallForegroundService.start()` when a call starts (`calls` / `accept` succeeds) or the app is about to go to background. Call `stop()` when the call ends (`hangup` / `onCallEnd`) to avoid keeping the service running unnecessarily.

4. On iOS, configure `Background Modes` (check `Audio, AirPlay, and Picture in Picture` and `Voice over IP`) and set up `AVAudioSession` before the call. Use `MethodChannel` to trigger the corresponding background keep-alive logic at the appropriate time.

## 5. Verification

- After going to background or locking the screen, call audio/video capture is not interrupted; the remote participant can still hear/see the local participant.
- A persistent foreground service notification (e.g., "Call in progress") appears in the system notification bar.
- On devices with `targetSdkVersion >= 34`, no crash occurs due to missing `foregroundServiceType` declaration.

## 6. Common Mistakes

- Mistake 1: Assuming TUICallKit Flutter SDK has a built-in foreground service keep-alive capability that requires no manual implementation. In reality, developers must create `CallForegroundService` themselves; the SDK does not handle this automatically.
- Mistake 2: Declaring permissions and `<service>` in `AndroidManifest.xml` but never actually calling `start()` via `MethodChannel` during a call. The service is never started, making the permission declarations useless.
- Mistake 3: After upgrading `targetSdkVersion` to 34+, only declaring the `FOREGROUND_SERVICE` permission while missing `FOREGROUND_SERVICE_CAMERA` / `FOREGROUND_SERVICE_MICROPHONE` and the corresponding `foregroundServiceType`. This causes crashes on Android 14 devices after release.

## 7. Problem Definition (Search Anchor)

How to keep voice/video calls alive in a Flutter TUICallKit Android app when it goes to background or is minimized. Whether a microphone/camera foreground service with a persistent notification is required. Recommended integration approach for Android 14+.

## 8. Alternative Phrasings (Search Recall)

- Does a Flutter TUICallKit Android call drop when the app goes to background?
- How to configure a foreground service for TUICallKit Android?
- How to add FOREGROUND_SERVICE_MICROPHONE for Android 14?
- Flutter call app minimized and microphone/camera stopped working?
- Do I need to implement CallForegroundService myself?

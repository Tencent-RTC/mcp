---
sync_node_id: '89644533957312512'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "Flutter"
product: "trtc"
---
This document describes how to quickly integrate the TRTC Flutter SDK into your project.

> **Note:**
> Currently, screen sharing and device selection are not supported on Windows or macOS.
> 

## Environment Requirements
- Flutter 2.0 or later

- **Developing for Android:**

   - Android Studio 3.5 or later

   - Devices with Android 4.1 or later

- **Developing for iOS and macOS:**

   - Xcode 11.0 or later

   - OS X 10.11 or later

   - A valid developer signature for your project

- **Developing for Windows:**

   - OS: Windows 7 SP1 or later (64-bit based on x86-64)

   - Disk space: At least 1.64 GB of space after the IDE and relevant tools are installed

   - [Visual Studio 2019](https://visualstudio.microsoft.com/zh-hans/downloads/)

## Integrating the SDK

The Flutter SDK has been published on [Pub](https://pub.dev/packages/tencent_trtc_cloud). You can have the SDK downloaded and updated automatically by configuring `pubspec.yaml`.
1. Add the following dependency to `pubspec.yaml` of your project.

   ``` bash
   dependencies:
     tencent_trtc_cloud: latest version number
   ```
2. Obtain **camera** and **mic** permissions to enable the audio and video call features.

   

【iOS】
1. Add requests for camera and mic permissions in `Info.plist`:

``` bash
<key>NSCameraUsageDescription</key>
<string>Video calls are possible only with camera permission.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Audio calls are possible only with mic access.</string>
```
2. Add the field `io.flutter.embedded_views_preview` and set the value to `Yes`.

【macOS】
1. Add requests for camera and mic permissions in `Info.plist`:

``` bash
<key>NSCameraUsageDescription</key>
<string>Video calls are possible only with camera permission.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Audio calls are possible only with mic access.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>The app needs your approval to access your gallery.</string>
```
2. Add `com.apple.security.network.client` and `com.apple.security.network.server` to `macos/Runner/*.entitlements`.

3. Expand **Link Binary With Libraries** and click the **+** icon at the bottom to add dependent libraries.

4. Add the library `libbz2.1.0.tbd`.

【Android】
1. Open `/android/app/src/main/AndroidManifest.xml`.

2. Add `xmlns:tools="http://schemas.android.com/tools"` to `manifest`.

3. Add `tools:replace="android:label"` to `application`.

> **Note:**
> Without the above steps, the [Android Manifest merge failed](https://intl.cloud.tencent.com/document/product/647/39242) error will occur and the compilation will fail.
> 

【Windows】
1. Run `flutter config --enable-windows-desktop`.

2. Run `flutter run -d windows`.

## FAQs
- [What should I do if my iOS project crashes when I build and run it?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if videos show on Android but not on iOS?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if an error occurs when I run CocoaPods for iOS after updating to the latest version of the SDK?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if the "Manifest merge failed" error occurs in Android Studio?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if an error occurs due to the absence of signatures when I debug my project on a real device?](https://intl.cloud.tencent.com/document/product/647/39242)

- [Why can’t I find the corresponding file after deleting/adding content in the swift file of the plugin?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if the error "Info.plist, error: No value at that key path or invalid key path: NSBonjourServices" occurs when I run my project?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if an error occurs when I run `pod install`?](https://intl.cloud.tencent.com/document/product/647/39242)

- [What should I do if a dependency error occurs when I run my iOS project?](https://intl.cloud.tencent.com/document/product/647/39242)

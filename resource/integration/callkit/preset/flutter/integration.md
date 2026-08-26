This document describes how to rapidly integrate the TUICallKit component. You can complete the following key steps within 10 minutes and obtain a complete audio and video call interface.

## Preparations

### **Environmental Requirements**

Flutter 3.24.0, Dart 3.5.0 and above.

### Service Activation

Please . These credentials will be required in the subsequent login step.

## Implementation

### Step 1.Importing Components

Add the [tencent_calls_uikit](https://pub.dev/packages/tencent_calls_uikit) plugin dependency in your project's pubspec.yaml file:
``` bash
flutter pub add tencent_calls_uikit
```

### Step 2.Project Configuration
- Native Project Configuration:

【Android】
1. Configure ProGuard Rules (Code Obfuscation):Since the SDK internally uses Java reflection, certain SDK classes must be added to the non-obfuscation list.

  - **Enable Obfuscation Rules**: In the `android/app/` directory, find the `build.gradle.kts` (or `build.gradle`) file and configure ProGuard rules:

【build.gradle.kts】
``` java
android {
    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

【build.gradle】
``` java
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```
  - **Add Rules:** Create a `proguard-rules.pro` file in the android/app directory (if it doesn't exist) and add the following code:

``` java
-keep class com.tencent.** { *; }
```
2. (Optional) To use CallKit's floating window capability outside the app, you need to enable the system Picture-in-Picture feature.

Set `android:supportsPictureInPicture` to true for `MainActivity` in your App's main project `AndroidManifest.xml`:
``` xml
  <manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <activity
            android:name=".MainActivity"
            android:supportsPictureInPicture="true"
        </activity>
    </application>
</manifest>
```

【iOS】

Grant Camera and Microphone Permissions:Because TUICallKit requires audio and video functionality, you must obtain authorization for the microphone and camera. Add the following two privacy usage descriptions to the top-level `<dict>` directory in your iOS project's `Info.plist` file:
``` java
<key>NSCameraUsageDescription</key>
<string>CallingApp requires access to your camera to display video during calls.</string>
<key>NSMicrophoneUsageDescription</key>
<string>CallingApp requires access to your microphone to capture audio during calls.</string>
```

> **Note:**
> Since tencent_rtc_sdk calls interfaces through Flutter FFI, Xcode's symbol stripping optimization during iOS Release builds may mistakenly remove TRTC's C symbols, causing a `symbol not found` error. The solution is as follows:
>
> 1. In the project's Build Settings, find `deployment postprocessing` and set it to **Yes.**
>
> 2. In the project's Build Settings, find `strip style` and set the Release value to **Non-Global Symbols.**
>

- Flutter Project Configuration:

   To ensure TUICallKit can properly manage page navigation and display multi-language interfaces, configure the following in your Flutter application framework:

  - Add `TUICallKit.navigatorObserver` to `navigatorObservers` to monitor page route changes and manage component lifecycle.

  - Add the localization delegate to `localizationsDelegates` to ensure interface text is displayed correctly according to the system language.

      ``` java
      import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';

       ......

      class XXX extends StatelessWidget {
        const XXX({super.key});

       @override
        Widget build(BuildContext context) {
          return MaterialApp(
            navigatorObservers: [TUICallKit.navigatorObserver],
            localizationsDelegates: const [
              // Your App's other configurations
              AtomicLocalizations.delegate,
            ],
          );
        }
      }
      ```

### Step 3. Login

This step is critical: you can only use the features provided by TUICallKit after successfully logging in by calling the `login` interface.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
import 'package:tencent_calls_uikit/src/debug/generate_test_user_sig.dart';
......

final String userId    = 'xxxxx';  // Replace with the UserId for the current user (required)
final int    sdkAppId  = 0;        // Replace with the SDKAppId obtained in the previous step
final String secretKey = 'xxxx';   // Replace with the UserSig for the current user (required)

void login() async {
    String userSig  = GenerateTestUserSig.genTestSig(userId, sdkAppId, secretKey);
    CompletionHandler result = await TUICallKit.instance.login(sdkAppId, userId, userSig);
    if (result.errorCode == 0) {
      print('Login success');
    } else {
      print('Login failed: ${result.errorCode} ${result.errorMessage}');
    }

}
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|Only allowing a combination of uppercase and lowercase letters (a-z A-Z), numbers (0-9), hyphens, and underscores.|
|sdkAppId|int|The unique identifier SDKAppId of the audio and video application created in the [Tencent Real-Time Communication (TRTC) Console](https://trtc.io/login).|
|secretKey|String|The SDKSecretKey of the audio/video application created in the [Tencent Real-Time Communication (TRTC) Console](https://trtc.io/login).|
|userSig|String|A security protection signature used to authenticate user login, confirm whether the user is genuine, and prevent malicious attackers from misappropriating your cloud service usage rights.|

> **Note：**
> - **Development environment**: If you are in the local development and debugging stage, you can adopt the local `GenerateTestUserSig.genTestSig` function to generate userSig. In this method, the SDKSecretKey is very easy to decompile and reverse engineer. Once your key is leaked, attackers can steal your Tencent Cloud traffic.
> - **Production environment**: If your project is ready to launch, use server-side generation of UserSig.

### Step 4.Set Nickname and Avatar [Optional]

After a successful login, you can call the `setSelfInfo` function to set your nickname and avatar. The set nickname and avatar will be displayed on the caller/callee interface.

【Flutter（Dart）】
``` swift
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart

void _setSelfInfo() {
    String nickname = "jack"
    String avatar = "https:/****/user_avatar.png"
    CompletionHandler result = TUICallKit.instance.setSelfInfo(nickname, avatar);
}
```

|Parameter|Type|Description|
|---------|---------|---------|
|nickname|String|Target user's nickname|
|avatar|String|Target user's avatar|

### Step 5.Initiating a Call

The caller initiates a call by invoking the `calls` function and specifying the media type (voice or video) and the callee's User ID list (userIdList). The calls interface supports both one-to-one and group calls. A one-to-one call is initiated when the userIDList contains only a single User ID; a group call is initiated when it contains multiple User IDs.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void _call() {
    List<String> participantIds = ['vince'];
    CallMediaType mediaType = CallMediaType.audio;
    CallParams callParams = CallParams();
    TUICallKit.instance.calls(participantIds, mediaType, callParams);
}
```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|List<String>|Target user ID list.|
|mediaType|CallMediaType|Media type of the call, such as video call, voice call.|
|params|CallParams|Call extension parameters, such as room number, call invitation timeout, offline push custom content.|

### Step 6.Answering a Call

Once the callee successfully logs in, the caller can initiate a call, and the callee will receive the call invitation, accompanied by a ringtone and vibration.

## More Features

### AI Transcription and Translation

You can enable/disable the AI transcription and translation feature by calling enableAITranscriber.

> **Note:**
> 1. This feature is enabled by default (enable = true). To disable it, call enableAITranscriber(enable: false) before initiating a call.
> 2. AI real-time transcription and translation is a value-added service. The trial version comes with free quota for direct experience. To activate the official version, please purchase a package at the [TRTC Console](https://console.trtc.io/).

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';

void _enableAITranscriber() {
    TUICallKit.instance.enableAITranscriber(true);
}
```

**Details:** Default is true, which displays the AI translation related page on the call interface. Set to false to disable.

### Enabling Floating Window

You can enable/disable the floating window feature by calling `enableFloatWindow`. This feature should be enabled when initializing the TUICallKit component, with the default status being Off (false).

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void _enableFloatWindow() {
    TUICallKit.instance.enableFloatWindow(true);
}
```

**Details:** Default false, the floating window button in the top-left corner of the call interface is hidden. Set to true to display.

### Enabling Banner

You can enable or disable the incoming call banner display by calling `enableIncomingBanner`. By default, this feature is disabled (false). When the callee receives an inbound call, the full-screen call waiting interface is shown first. When the banner is enabled, a notification banner will display initially, switching to the full-screen view as required. Note that displaying the banner requires floating window permission. The exact display behavior depends on permission settings and whether the app is running in the foreground or background.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void _enableFloatWindow() {
    TUICallKit.instance.enableIncomingBanner(true);
}
```

**Details:** Default false. The callee side pops up the full-screen call waiting interface by default when receiving an invitation. When enabled, a banner is displayed first, then the full-screen call interface is pulled up as needed.

### Multi-Person Calling

When the caller uses the `calls` method to initiate a call, if the list of called users exceeds one person, it is automatically recognized as a multi-person call. Other members can then join this multi-person call using the `join` method.
- **Initiating a Multi-person Call:** When the `calls` method is used to initiate a call, if the callee User ID list (userIdList) contains more than one user, it will be automatically deemed a multi-person call.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void _call() {
    List<String> participantIds = ['vince','mike'];
    CallMediaType mediaType = CallMediaType.audio;
    CallParams callParams = CallParams();
    TUICallKit.instance.calls(participantIds, mediaType, callParams);
}
```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|List<String>|Target user ID list.|
|mediaType|CallMediaType|Media type of the call, such as video call, voice call.|
|params|CallParams|Call extension parameters, such as room number, call invitation timeout, offline push custom content.|

- **Joining a Multi-person Call:** You can use the `join` method to enter the specified multi-person call.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';

void join() {
    String callId = "123456";
    TUICallKit.instance.join(callId);
}
```

|Parameter|Type|Description|
|---------|---------|---------|
|callId|String|The unique ID for this call.|

### Language Settings
- **Supported Languages:** We currently support Simplified Chinese, English, and Japanese. The default language is English.

- **Switching Languages:** TUICallKit does not provide a separate language switching API. Its interface language will automatically align with the language setting used by the application's current root component (such as MaterialApp or CupertinoApp).

   > **Note：**
   >
   > If you need to set up other languages, please contact us at **info_rtc@tencent.com** for assistance.
   >

### Ringtone Setting

You can set the default ringtone, and incoming call silent mode in the following ways:
- **Setting Default Ringtone:** If you include TUICallKit component via source code, you can replace the resource file（[ringtone when initiating a call](https://github.com/Tencent-RTC/TUICallKit/blob/main/Flutter/assets/audios/phone_dialing.mp3)、[ringtone when initiating a call](https://github.com/Tencent-RTC/TUICallKit/blob/main/Flutter/assets/audios/phone_ringing.mp3)）to set a custom default ringtone.

- **Incoming call silent mode:** You can set mute mode through `enableMuteMode`.

``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void _setCallingBell() {
    TUICallKit.instance.enableMuteMode(true);
}
```

**Details:** When set to true, incoming call requests will not trigger ringtone playback (silent mode).

## Customizing Your UI

### Replacing Icon Button

You can directly replace the icons under the [assets/images](https://github.com/Tencent-RTC/TUICallKit/tree/main/Flutter/assets/images) folder to ensure the icon color and style remain consistent throughout the entire App. The following list shows basic feature buttons. You can replace the corresponding icons to fit your own business scenario.

Commonly Used Icon File Name List
| Icon | File name | Description |
| --- | --- | --- |
|  | dialing.png | Answer incoming call icon |
|  | hangup.png | Hang Up Call icon |
|  | mute_on.png | Turn off the mic icon |
|  | handsfree.png | Turn off the speaker icon |
|  | camera_off.png | Camera Off icon |
|  | add_user.png | Invite user icon during call |

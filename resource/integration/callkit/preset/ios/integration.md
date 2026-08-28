This document describes how to rapidly integrate the TUICallKit component. You can complete the following key steps within 10 minutes and obtain a complete audio and video call interface.

## Preparations

### Environment Requirements
- **iOS system version requirements:**iOS 13.0 and above.

- **Development tool version requirements:**Xcode 13.0 and above,Xcode 15 and above may encounter Sandbox errors. Please .

- **Dependency management tool requirements:**CocoaPods environment setup

- **Device requirements:** Apple mobile devices such as iPhone and iPad with iOS 13.0 or later (ensure the app can be properly installed and run).

### Service Activation

Please . These credentials will be required in the subsequent Login steps.

## Implementation

### Step 1.Importing Components
1. Add Pod dependency:

【If the project has an existing Podfile file】

Add the `pod 'TUICallKit_Swift'` dependency in your project's `Podfile` file. For example:
``` ruby
  target 'YourProjectTarget' do
    pod 'TUICallKit_Swift'

  end
```

【If the project has no Podfile file】

Enter your `.xcodeproj` directory in the terminal, then execute the `pod init` command to create a `Podfile` file. After creation, add the `pod 'TUICallKit_Swift'` dependency in your `Podfile` file. For example:
``` ruby
// 1 Enter your .xcodeproj directory in the terminal
cd /Users/yourusername/Projects/YourProject

// 2
pod init

// 3 In the generated Podfile file
  target 'YourProjectTarget' do
    pod 'TUICallKit_Swift'

  end
```

2. Install components:

   Enter the directory where the `Podfile` file is located in the terminal, then run the following command to install components.

   ``` bash
   pod install --repo-update
   ```

   > **Tips：**
   >
   > After the installation is complete, open the project using the `YourProjectName.xcworkspace` file.
   >

### Step 2.Project Configuration

To ensure the audio and video features function correctly, your application needs to request access to the microphone and camera. Please add the following two privacy usage descriptions to your project's `Info.plist` file，These descriptions will be displayed to the user when the system initially prompts for permission.
``` swift
<key>NSCameraUsageDescription</key>
<string>TUICallKitApp needs access to your camera, and it can be used for functions such as Video Call, Group Video Call.</string>
<key>NSMicrophoneUsageDescription</key>
<string>TUICallKitApp needs access to your microphone，and it can be used for functions such as Audio Call, Group Audio Call, Video Call, Group Video Call.</string>
```

### Step 3.Login

Add the following code in your project. It enables logging in to the TUI component by calling relevant APIs in TUICore. This step is critical. Only after logging in successfully can you use the features provided by TUICallKit properly.

【iOS (Swift)】
``` swift
import TUICore
import TUICallKit_Swift

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    let userID = "denny"       // Please replace with your UserId
    let sdkAppID: = 0    // Please replace it with the SDKAppID obtained from the console.
    let secretKey = "****"     // Please replace it with the SecretKey obtained from the console.

    let userSig = GenerateTestUserSig.genTestUserSig(userID: userID, sdkAppID: sdkAppID, secretKey: secretKey)

    TUILogin.login(Int32(sdkAppID), userID: userID, userSig: userSig) {
      print("login success")
    } fail: { code, message in
      print("login failed, code: \(code), error: \(message ?? "nil")")
    }

    return true
}
```

【iOS (Objective-C)】
``` objectivec
#import <TUICore/TUILogin.h>
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    NSString *userID = @"denny";     // Please replace with your UserID
    int sdkAppID = 0;                // Please replace it with the SDKAppID obtained from the console.
    NSString *secretKey = @"****";   // Please replace it with the SecretKey obtained from the console.

    NSString *userSig = [GenerateTestUserSig genTestUserSigWithUserID:userID sdkAppID:sdkAppID secretKey:secretKey];

    [TUILogin login:sdkAppID
             userID:userID
            userSig:userSig
               succ:^{
        NSLog(@"login success");
    } fail:^(int code, NSString * _Nullable msg) {
        NSLog(@"login failed, code: %d, error: %@", code, msg);
    }];

    return YES;
}
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|only allow a combination of uppercase and lowercase letters (a-z A-Z), numbers (0-9), underline and hyphen|
|sdkAppId|int|The unique ID assigned to your application when you [Tencent Real-Time Communication (TRTC) Console](https://trtc.io/login).|
|secretKey|String|The SDKSecretKey of the audio and video application created in the [Tencent Real-Time Communication (TRTC) Console](https://trtc.io/login).|
|userSig|String|A security signature used for user login authentication, confirming user authenticity and preventing malicious attacks from stealing your cloud service usage rights.|

> **Note:**
> - **Development environment**: If you are in the local development and debugging stage, you can adopt the local `GenerateTestUserSig.genTestSig` function to generate userSig. In this method, the secretKey is very easy to decompile and reverse. Once your key is leaked, attackers can steal your Tencent Cloud traffic.
> - **Production environment**: If your project is ready to go live, implement server-side generation of UserSig via the server.

### Step 4.Set Nickname and Avatar  [Optional]

After a successful login, you can call the `setSelfInfo` function to set your nickname and avatar. The set nickname and avatar will be displayed on the caller/callee interface.

【iOS (Swift)】
``` swift
import TUICallKit_Swift
import AtomicXCore

TUICallKit.createInstance().setSelfInfo(nickname: "jack", avatar: "https:/****/user_avatar.png", completion: { result in
    switch result {
    case .success:
        // success
    case .failure(let error):
        // fail
    }
})

```

|Parameter|Type|Description|
|---------|---------|---------|
|nickname|String|Target user's nickname|
|avatar|String|Target user's avatar|
|completion|CompletionClosure|Callback for the result of an asynchronous operation|

### Step 5.Initiating a Call

The caller initiates a call by invoking the `calls` function and specifying the media type (voice or video) and the callee's User ID list (userIdList). The calls interface supports both one-to-one and group calls. A one-to-one call is initiated when the userIDList contains only a single User ID; a group call is initiated when it contains multiple User IDs.

> **Note：**
> The `calls` interface cannot be written in the `viewDidLoad` method; it should be called in the button's click event or other user interaction response methods.
>

【iOS (Swift)】
``` swift
import TUICallKit_Swift
import AtomicXCore

// Trigger single-person voice call
TUICallKit.createInstance().calls(userIdList: ["mike"], callMediaType: .audio, params: nil, completion: { result in
    switch result {
    case .success:
      // success
    case .failure(let error):
      // fail
    }
}

```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|[String]|Target user ID list|
|mediaType|[CallMediaType](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype)|Media type of the call, such as video call, voice call|
|params|[CallParams](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams)|Call extension parameters, such as room number, call invitation timeout|
|completion|CompletionClosure|Callback for the result of an asynchronous operation|

### Step 6.Answering a Call

Once the callee successfully logs in, the caller can initiate a call, and the callee will receive the call invitation, accompanied by a ringtone and vibration.

## More Features

### AI Transcription and Translation

You can enable or disable the AI transcription and translation feature by calling enableAITranscriber.

> **Note：**
> 1. This feature is enabled by default (enable = true). To disable it, call enableAITranscriber(enable: false) before initiating a call.
> 2. AI real-time transcription and translation is a value-added service. The trial version comes with free quota for direct experience. To activate the official version, please purchase a package at the [TRTC Console](https://console.trtc.io/).

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().enableAITranscriber(enable: true)
```

【iOS (Objective-C)】
``` objectivec
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>

[[TUICallKit createInstance] enableAITranscriber:YES];
```

Description: When set to true (default), the AI translation UI is displayed on the call interface. Set to false to disable this feature.

### Enabling Floating Window

You can enable/disable the floating window feature by calling `enableFloatWindow`. This feature should be enabled when initializing the TUICallKit component, with the default status being Off (false).

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().enableFloatWindow(enable: true)
```

【iOS (Objective-C)】
``` objectivec
[[TUICallKit createInstance] enableFloatWindow:YES];
```

**Details:** false by default, the floating window button in the top-left corner of the call interface is hidden. Set to true to display the button and enable the feature.

### Enabling Banner

You can enable or disable the incoming call banner functionality by calling the `enableIncomingBanner` API: by default (disabled), the callee will immediately display the full-screen call interface upon receiving an invitation, while enabling it will show a notification banner first, followed by launching the full-screen call interface as required.

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().enableIncomingBanner(enable: true)
```

【iOS (Objective-C)】
``` objectivec
[[TUICallKit createInstance] enableIncomingBanner:YES];
```

**Details:** Default false. When the callee receives an invitation, the full-screen call waiting interface pops up by default. When enabled, a banner is shown first, then the full-screen call interface is pulled up as needed.

### Multi-Person Calling

When the caller uses the `calls` method to initiate a call, if the list of called users exceeds one person, it is automatically recognized as a multi-person call. Other members can then join this multi-person call using the `join` method.
- **Initiating a Multi-person Call:** When the `calls` method is used to initiate a call, if the callee User ID list (userIdList) contains more than one user, it will be automatically deemed a multi-person call.

【iOS (Swift)】
``` swift
import TUICallKit_Swift
import AtomicXCore

TUICallKit.createInstance().calls(userIdList: ["mike", "tate"], callMediaType: .audio, params: nil, completion: { result in
    switch result {
    case .success:
        // success
    case .failure(let error):
        // fail
    }
})

```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|[String]|Target user ID list|
|mediaType|[CallMediaType](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype)|Media type of the call, such as video call, voice call|
|params|[CallParams](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams)|Call extension parameters, such as room number, call invitation timeout|
|completion|CompletionClosure|Callback for the result of an asynchronous operation|

- **Joining a Multi-person Call:** You can use the `join` method to enter the specified multi-person call.

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().join(callId: "")
```

【iOS (Objective-C)】
``` objectivec
[[TUICallKit createInstance] joinWithCallId: @"***"];
```

|Parameter|Type|Description|
|---------|---------|---------|
|callId|String|The unique ID for this call.|

### Language Settings
- **Supported Languages:** We currently support Simplified Chinese, Traditional Chinese, English, Japanese, and Arabic.

- **Switching Languages:** By default, the language of TUICallKit is consistent with the mobile operating system's language setting. To switch the language, you can use the `TUIGlobalization.setPreferredLanguage` method.

【iOS (Swift)】
``` swift
import TUICore

func setLanguage() {
    TUIGlobalization.setPreferredLanguage("en")
}
```
| Parameter | Type | Description |
| --- | --- | --- |
| language | String | - "zh-Hans": Simplified Chinese.<br>- "zh-Hant": Traditional Chinese.<br>- "ja": Japanese<br>- "en": English.<br>- "ar" : Arabic. |

> **Note：**
> If you need to set up other languages, please contact us at **info_rtc@tencent.com** for assistance.
>

### Ringtone Setting

You can configure the default ringtone, incoming call silent mode, and offline push ringtone using the following methods:
- **Method 1:** If you include the TUICallKit component via source code, you can set the default ringtone by replacing the corresponding resource files ([the ringtone played when initiating a call](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/call/TUICallKit_Swift/Resources/AudioFile/phone_dialing.m4a) and [the ringtone played when receiving a call](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/call/TUICallKit_Swift/Resources/AudioFile/phone_ringing.mp3)) .

- **Method 2:** Use the `setCallingBell` interface to set the incoming call ringtone received by the callee.

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().setCallingBell(filePath: "***/callingBell.mp3")
```

【iOS (Objective-C)】
``` objectivec
[[TUICallKit createInstance] setCallingBell:@"***/callingBell.mp3"];
```

**Details:** Only local file paths can be imported here. You must ensure that the file directory is accessible to the application. The ringtone setting is bound to the device; therefore, replacing the user will not affect the ringtone. To restore the default ringtone, simply pass an empty `filePath`.

|Parameter|Type|Description|
|---------|---------|---------|
|filePath|String|Ringtone file path|

- **Incoming call silent mode:** You can set mute mode through [enableMuteMode](https://cloud.tencent.com/document/product/647/78750#enableMuteMode).

【iOS (Swift)】
``` swift
import TUICallKit_Swift

TUICallKit.createInstance().enableMuteMode(enable: true)
```

【iOS (Objective-C)】
``` objectivec
[TUICallKit createInstance] enableMuteMode: YES];
```

**Details:** When turned on, incoming call requests will not trigger ring.

- **Custom offline push ringtone:** By default, the system determines the ringtone for offline push notifications. To use a custom sound, follow the instructions below:

1. **Prepare your file:** Name your custom ringtone file `phone_ringing.mp3`.

2. **Overwrite existing file:** Replace the [current phone_ringing.mp3](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/call/TUICallKit_Swift/Resources/AudioFile/phone_ringing.mp3) file within your project with the new one.

## Customizing Your UI

### Replace Icon Button

You can directly replace the icons under the [Resources/AtomicX.xcassets](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/atomic_x/Resources/AtomicX.xcassets) folder to ensure the icon color and style remain consistent across the entire App. Below lists the basic feature buttons. You can replace the corresponding icons to fit your own business scenario.

Commonly Used Icon File Name List
| Icon | File name | Description |
| --- | --- | --- |
|  | icon_dialing.png | Answer incoming call icon |
|  | icon_hangup.png | Hang Up Call icon |
|  | icon_mute_on.png | Turn off the mic icon |
|  | icon_handsfree.png | Turn off the speaker icon |
|  | icon_camera_off.png | Camera Off icon |
|  | icon_add_user.png | Invite user icon during call |

## FAQs

**Does TUIKit support running in the background?**

If you encounter problems during integration and use, see FAQs.

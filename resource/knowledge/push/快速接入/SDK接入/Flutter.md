---
sync_node_id: '159322878596112384'
nav_path:
  - "推送服务（Push）"
  - "快速接入"
  - "SDK 接入"
  - "Flutter"
product: "push"
---
This document describes how to integrate TIMPush into a Flutter project.

## Prerequisites

Before you start, complete the push prerequisites for your target platforms and prepare the parameters required for registration.

【Android】

Make sure you have enabled Push service, and complete Android manufacturer configuration as needed (Google FCM). On the Flutter Android side, prepare at least the following:

|Resource|Purpose|
|---------|---------|
|`SDKAppID`, client key (Push Key)|Call `registerPush`|
|`timpush-configs.json`|Place in the Android app module `assets`|
|Target manufacturer config files (if any)|Place Google FCM and other manufacturer files in the project as required|
|Project `applicationId`|Must match the package name on the manufacturer platform|
|TIMPush version `VERSION`|Manufacturer channel package dependency version; see Release Notes|

For the full resource list and where to get them, see Android Prerequisites.

【iOS】

Make sure you have enabled Push service and completed iOS manufacturer configuration. On the Flutter iOS side, prepare at least the following:

|Resource|Purpose|
|---------|---------|
|`SDKAppID`, Push Key|Call `registerPush`|
|Certificate ID (`businessID` / `apnsCertificateID`)|Generated after you upload the APNs certificate in the console; pass it via `registerPush`|
|App Group ID (optional)|Required only for reach statistics; pass via `applicationGroupID` in `registerPush`|

For the full resource list, see iOS Prerequisites.

In the examples in this document, `VERSION`, `SDKAppID`, `AppKey`, certificate ID, and App Group ID are placeholders. Do not commit real keys to your code repository.

## AI integration

Use npx to install [@tencent-rtc/trtc-push-skill](https://www.npmjs.com/package/@tencent-rtc/trtc-push-skill/v/1.0.1#timpush-agent-skill) into your local AI IDE to help complete TIMPush offline push integration. After installation, you can ask the AI to “integrate Flutter offline push” and similar requests. The AI will guide you through environment checks, manufacturer channel configuration, credential setup, code integration, and verification based on your project type. For details, see AI Coding.

## Manual integration

### Step 1: Integrate the TIMPush SDK

If you want to integrate manually, complete the following steps in order.

#### Integrate the Flutter plugin

Your Flutter project must first add the push plugin. You can add the dependency in `pubspec.yaml`, or run the following command to install it automatically:
``` bash
flutter pub add tencent_cloud_chat_push
```

#### Configure the native project

After integrating the Flutter plugin, continue with the corresponding native platform configuration.

【Android】

First complete the native project setup by following Android TIMPush common integration and Android manufacturer channel integration.

Differences from native Android are as follows; complete them as described below:
1. **Manufacturer channel packages**: The Flutter plugin already handles TIMPush base dependencies. **Do not** add `com.tencent.timpush:timpush` / `tuicore` again. Only add the target manufacturer channel packages as needed.

2. **Custom Application**: You must extend `TencentCloudChatPushApplication`.

In `android/app/build.gradle` or `android/app/build.gradle.kts`, add the TIMPush channel packages for your target manufacturers as needed. Native push for a manufacturer is enabled only after you add the corresponding package. Get `VERSION` from the Release Notes and replace it with the actual version number.

【Groovy DSL】
``` bash
dependencies {
    implementation 'com.tencent.timpush:fcm:VERSION'
}
```

【Kotlin DSL】
``` bash
dependencies {
    implementation("com.tencent.timpush:fcm:VERSION")
}
```

Create or reuse a custom `Application` class and extend `TencentCloudChatPushApplication`. If your project already has a custom `Application`, change it to extend this class and make sure `onCreate()` calls `super.onCreate()`.
``` java
package com.example.pushdemo

import com.tencent.chat.flutter.push.tencent_cloud_chat_push.application.TencentCloudChatPushApplication

class MyApplication : TencentCloudChatPushApplication() {
    override fun onCreate() {
        super.onCreate()
    }
}
```

Then set `android:name` on the `<application>` tag in `android/app/src/main/AndroidManifest.xml` to point to the custom `Application` class above.
``` bash
<application
    android:name=".MyApplication"
    ...>
</application>
```

【iOS】

The Flutter plugin handles TIMPush-related dependencies. You **do not** need to follow the “integrate into the main App target” steps in the native iOS document. You only need to add TIMPush-related configuration in `ios/Runner/AppDelegate.swift` to return the push certificate ID and App Group ID, and to forward offline push click events. The certificate ID and App Group ID are passed via `registerPush`, then returned to TIMPush through the bridge methods below.
``` swift
import UIKit
import Flutter

// Add these two import lines
import TIMPush
import tencent_cloud_chat_push

// Add `, TIMPushDelegate` to the following line
@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate, TIMPushDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        GeneratedPluginRegistrant.register(with: self)
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    // Add this function
    @objc func businessID() -> Int32 {
        return TencentCloudChatPushFlutterModal.shared.businessID();
    }

    // Add this function
    @objc func applicationGroupID() -> String {
        return TencentCloudChatPushFlutterModal.shared.applicationGroupID()
    }
    
    // Add this function
    @objc func onRemoteNotificationReceived(_ notice: String?) -> Bool {
        TencentCloudChatPushPlugin.shared.tryNotifyDartOnNotificationClickEvent(notice)
        return true
    }
}
```

### Step 2: Register the push service

registerPush registers the current device’s push token with TIMPush. After successful registration, TIMPush creates a push target identifier `registrationID` for the device. The server, Console Access Test, and troubleshooting tools can use this identifier to send offline pushes to the device. If the app also integrates Chat and completes login, you can also use `userID` to send offline pushes to devices that have established a push relationship for that user.

The value of `appKey` affects the registration method and available push identifiers:
- `appKey = Push Key`: Register TIMPush standalone push. Push Key is the client key.

- `appKey = null`: Reuse the Chat login state to register for push. You must call this after a successful Chat `login`.

   Confirm the call order based on your business scenario first:

   > **Note:**
   > 
   > - If the user logs out of the Chat SDK, in scenarios where both Chat SDK and TIMPush are integrated, the established `userID` and `registrationID` push relationships become invalid and must be registered again.
   > - The Chat app secret is only for Chat login and cannot be used as the `appKey` for `registerPush`.

   **Do not call this from the Flutter app entry** `main` **method.** We recommend calling it after the user agrees to the privacy policy, at an appropriate time on the business side.

   

【Register TIMPush on cold start (pass Push Key as appKey)】
``` java
Future<void> registerTIMPush() async {
  final push = TencentCloudChatPush();

  final registerRes = await push.registerPush(
    // TODO: Replace with your SDKAppID.
    sdkAppId: 0,
    // TODO: Replace with the Push client key.
    appKey: '<#YOUR_PUSH_APP_KEY#>',
    // iOS: Replace with the certificate ID generated in the Tencent Cloud console; not required on Android.
    apnsCertificateID: 0,
    // iOS optional: To measure push reach, replace with the App Group ID configured in Apple Developer Center or Xcode; not required on Android.
    // applicationGroupID: 'group.<#YOUR_APP_GROUP_ID#>',
    // The current Flutter API still requires this parameter, but the callback is to be deprecated.
    // Do not handle notification clicks here; use addPushListener instead.
    onNotificationClicked:
        ({required String ext, String? userID, String? groupID}) {},
  );

  if (registerRes.code != 0) {
    debugPrint(
      'registerPush failed: code=${registerRes.code}, '
      'msg=${registerRes.errorMessage}, deviceToken=${registerRes.data}',
    );
    return;
  }

  final ridRes = await push.getRegistrationID();
  debugPrint(
    'registerPush success, registrationID=${ridRes.data}, '
    'code=${ridRes.code}, msg=${ridRes.errorMessage}',
  );
}
```

【Register for push after Chat login (pass null as appKey)】
``` java
Future<void> loginIMAndRegisterPush() async {
  final int sdkAppId = 0; // TODO: Replace with your SDKAppID.
  final String userID = '<#YOUR_USER_ID#>';
  final String userSig = '<#YOUR_USER_SIG#>';

  final initRes = await TencentImSDKPlugin.v2TIMManager.initSDK(
    sdkAppID: sdkAppId,
  );
  if (initRes.code != 0) {
    debugPrint('initSDK failed: code=${initRes.code}, desc=${initRes.desc}');
    return;
  }

  final loginRes = await TencentImSDKPlugin.v2TIMManager.login(
    userID: userID,
    userSig: userSig,
  );
  if (loginRes.code != 0) {
    debugPrint('login failed: code=${loginRes.code}, desc=${loginRes.desc}');
    return;
  }

  final push = TencentCloudChatPush();
  final registerRes = await push.registerPush(
    sdkAppId: sdkAppId,
    // iOS: Replace with the certificate ID generated in the Tencent Cloud console; not required on Android.
    apnsCertificateID: 0,
    // iOS optional: To measure push reach, replace with the App Group ID configured in Apple Developer Center or Xcode; not required on Android.
    // applicationGroupID: 'group.<#YOUR_APP_GROUP_ID#>',
    // The current Flutter API still requires this parameter, but the callback is to be deprecated.
    // Do not handle notification clicks here; later sections introduce the recommended listener approach.
    onNotificationClicked:
        ({required String ext, String? userID, String? groupID}) {},
  );

  if (registerRes.code != 0) {
    debugPrint(
      'registerPush failed: code=${registerRes.code}, '
      'msg=${registerRes.errorMessage}, deviceToken=${registerRes.data}',
    );
    return;
  }

  final ridRes = await push.getRegistrationID();
  debugPrint(
    'registerPush after login success, registrationID=${ridRes.data}, '
    'code=${ridRes.code}, msg=${ridRes.errorMessage}',
  );
}
```

   > **Warning:**
   > 
   > If your business uses only Chat messaging capabilities, do not call `registerPush` before Chat login. Otherwise the SDK may register a Push-type account as in the standalone push scenario and generate corresponding Push DAU. Extra charges may apply if Push DAU exceeds the package quota.
   > 

### Step 3: Configure message reach statistics (optional)

Reach statistics mainly involve manufacturer consoles, receipt URLs, APNs Notification Service Extension, App Group, and other platform-specific configuration. Complete by platform:

【Android】

Follow the reach statistics instructions in the corresponding manufacturer tab under Android manufacturer channel integration. No extra Dart code is required on the Flutter side.

【iOS】

Follow iOS Configure message reach statistics to complete Notification Service Extension, `mutable-content`, App Group, and related configuration.

Additionally confirm these two points on Flutter:
1. Pass `applicationGroupID` when calling `registerPush`.

2. `applicationGroupID()` is implemented in `ios/Runner/AppDelegate.swift`.

### Step 4: Test the push delivery chain

After completing the integration steps above, send a test message to verify that the full path works.

After running the app, filter logs by the `TIMPush` keyword to check registration. After successful registration, call `getRegistrationID()` to get the current device push identifier. When sending a test message from the console or server, you can use this value to target the device.

Before sending a message, confirm:
1. The app has system notification permission (including banner, lock screen, sound, and other switches).

2. The app is in the background or killed (offline push may not trigger while the app is in the foreground).

   You can send a test message in the following ways:

   

【Send from console】

For users who integrate TIMPush only, we recommend using the Console Access Test capability first to verify offline push.

Path: Console > **Push** > **App Push** > **Access Test**. On the Access Test page, you can specify `registrationID` or `userID` to send an offline push test.

【Send via REST API】

To send push from the server, see REST API - All-user/Tag push.

【Send via SDK API】

If your project already integrates the Chat SDK, you can send a message with offline push parameters via the SDK API for verification. Flutter example:
``` dart
Future<void> sendTestPushMessage({
  required String targetUserID,
}) async {
  final createRes = await TencentImSDKPlugin
      .v2TIMManager.v2TIMMessageManager
      .createTextMessage(text: 'Hello TIMPush');

  final message = createRes.data?.messageInfo;
  if (createRes.code != 0 || message == null) {
    debugPrint('createTextMessage failed: code=${createRes.code}');
    return;
  }

  final sendRes = await TencentImSDKPlugin
      .v2TIMManager.v2TIMMessageManager
      .sendMessage(
        message: message,
        receiver: targetUserID,
        groupID: '',
        priority: MessagePriorityEnum.V2TIM_PRIORITY_NORMAL,
        onlineUserOnly: false,
        offlinePushInfo: OfflinePushInfo(
          title: 'Push title',
          desc: 'Push content',
          ext: '{"action":"open_chat","conversationID":"c2c_$targetUserID"}',
        ),
      );

  debugPrint(
    'sendMessage result: code=${sendRes.code}, desc=${sendRes.desc}, '
    'msgID=${sendRes.data?.msgID}',
  );
}
```

   **Verification**: After placing the app in the background, send a test message. The device should receive an offline push notification. If notification bar permission is enabled, an offline push notification banner appears in the notification bar.

### Step 5: Handle notification click redirects

For the full notification click redirect flow, see Android Handle notification click redirects and iOS Handle notification click redirects. Console click-action configuration on Flutter is the same as on native platforms, but note these two additional differences.

#### **Include** redirect info **when sending the push**

If your project already integrates the Chat SDK, you can pass redirect parameters via `OfflinePushInfo.ext` when sending a message. Example:
``` java
Future<void> sendMessageWithPushExt({
  required String targetUserID,
}) async {
  final createRes = await TencentImSDKPlugin
      .v2TIMManager.v2TIMMessageManager
      .createTextMessage(text: 'Hello TIMPush');

  final message = createRes.data?.messageInfo;
  if (createRes.code != 0 || message == null) {
    debugPrint('createTextMessage failed: code=${createRes.code}');
    return;
  }

  final sendRes = await TencentImSDKPlugin
      .v2TIMManager.v2TIMMessageManager
      .sendMessage(
        message: message,
        receiver: targetUserID,
        groupID: '',
        priority: MessagePriorityEnum.V2TIM_PRIORITY_NORMAL,
        onlineUserOnly: false,
        offlinePushInfo: OfflinePushInfo(
          title: 'Push title',
          desc: 'Push content',
          ext: '{"conversationID":"$targetUserID","conversationType":1}',
        ),
      );

  debugPrint(
    'sendMessage result: code=${sendRes.code}, desc=${sendRes.desc}, '
    'msgID=${sendRes.data?.msgID}',
  );
}
```

#### **Register a client listener and parse** redirect info

On the Flutter client, we recommend using `TencentCloudChatPush().addPushListener` to listen for notification click events and parse `ext` in `onNotificationClicked`. Example:
``` java
final TIMPushListener timPushListener = TIMPushListener(
  onRecvPushMessage: (TimPushMessage msg) {
    debugPrint(
      'onRecvPushMessage: title=${msg.title}, desc=${msg.desc}, '
      'ext=${msg.ext}, msgID=${msg.messageID}',
    );
  },
  onRevokePushMessage: (String msgID) {
    debugPrint('onRevokePushMessage: msgID=$msgID');
  },
  onNotificationClicked: (String ext) {
    debugPrint('onNotificationClicked: ext=$ext');

    // 1. Parse ext. The JSON structure is defined by your business and must match the sender.
    Map<String, dynamic>? extJson;
    try {
      extJson = jsonDecode(ext) as Map<String, dynamic>;
    } catch (e) {
      debugPrint('parse ext failed: $e');
      return;
    }

    final String? conversationID = extJson['conversationID'] as String?;
    final int? conversationType = extJson['conversationType'] as int?;

    if (conversationID == null || conversationType == null) {
      return;
    }

    // 2. TODO: Navigate to the target page based on business fields.
    //    If you use Chat / TUIKit, navigate after the user logs in successfully;
    //    for cold start, cache the parameters first and navigate in the login callback.
  },
);

Future<void> addTIMPushListener() async {
  await TencentCloudChatPush().addPushListener(listener: timPushListener);
}

Future<void> removeTIMPushListener() async {
  await TencentCloudChatPush().removePushListener(listener: timPushListener);
}
```

> **Note:**
> - `TencentCloudChatPush().registerPush` still requires the `onNotificationClicked` parameter, but it is to be deprecated. For new integrations, do not handle redirects in `registerPush`’s `onNotificationClicked`; use `addPushListener` instead.
> - `ext` is a business passthrough field written by the sender. We recommend a JSON string, for example `{"conversationID":"user_A","conversationType":1}`.
> - If the app needs to handle click events immediately after a cold start, register the `listener` as early as possible—for example after login completes and before the business home page initializes.

When sending offline push, if you need to set Android manufacturer message category or notification channel ID, configure them via Flutter Chat SDK’s [OfflinePushInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_offlinePushInfo/OfflinePushInfo-class.html); for field meanings and manufacturer rules, see Android manufacturer channel integration.

## Integration troubleshooting

If you still cannot receive push after integration, use [Push Troubleshooting](https://console.trtc.io/app-push/push-troubleshoot) to check the cause. If the issue remains, contact us to submit feedback.

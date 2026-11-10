---
sync_node_id: '95821638488313856'
nav_path:
  - "视频通话 SDK"
  - "离线唤醒"
  - "Android"
product: "call"
---
> **Note：**
> This documentation applies to apps distributed in **international** app stores (such as Google Play).
> 

TUICallKit enables your app to wake callee users via FCM (Firebase Cloud Messaging) push when the app is backgrounded or terminated by the system, ensuring timely incoming call notifications. This guide describes two integration methods: **Basic Push (Free)** and **Paid Push (using the TIMPush plugin)**. Choose the solution that best fits your needs.

## Integration Outcome

After completing the integration steps in this document, your app will be able to wake callee users for incoming calls even if the process is killed or the device is locked:

> **Note：**
> For best call performance, guide users to enable permissions such as "Notifications", "Display over other apps", and "Background UI launch" within your app.
> 

## Solution Selection

|Requirement|Integration Solution|Cost|
|---------|---------|---------|
|Calls only in app foreground, no offline wake-up required.|No push integration necessary; skip this document|Free|
|Receive incoming call ring when app is backgrounded/killed, no additional needs.|Solution 1: Basic Push|Free|
|Require data statistics, marketing push, cross-platform support in addition to call ringing.|Solution 2: Paid Push|Paid, requires Activate TIMPush Service.|

> **Note：**
> - International offline push for calls uses FCM (Firebase Cloud Messaging). You must first create a project and download google-services.json from the Firebase Console.
> - FCM requires devices with GMS (Google Mobile Services). Devices manufactured for Mainland China typically lack GMS; do not rely solely on FCM for domestic scenarios.

After choosing your solution, start with the Prerequisites section to set up your FCM project and certificates, then proceed to the relevant solution section.

## Prerequisites

Before integrating Solution 1 or Solution 2, you must create a Firebase project, upload FCM credentials to the IM Console, and provide the certificate ID returned by the console to the SDK.

### Step 1. Create Firebase Project and Download google-services.json
1. Log in to the [Firebase Console](https://console.firebase.google.com/), click **Add Project** to create a new project (or use an existing one).

2. In your project, select **Add an app > Android**, enter your app's package name (must match your app's `applicationId` exactly).

3. Download the generated `google-services.json` and place it in the root directory of your app module (same level as `build.gradle`).

4. In the Firebase project, go to **Project Settings > Cloud Messaging** and copy the **Server Key** (you'll upload this to the IM Console).

   

   > **Note：**
   > 
   > If you can't locate the Server Key under the **Cloud Messaging** tab in Firebase Console, enable Cloud Messaging API (Legacy) as described in Firebase's official documentation.
   > 

### Step 2. Upload FCM Credentials to IM Console

[Open the Chat Console](https://trtc.io/login) > Select your IM app > **Basic Configuration > Offline Push Certificate Configuration > Go Now**. Under the **Vendor Configuration > Android** tab, click **Add Certificate**, choose **FCM** as the **Push Type**, select **Data (Pass-through) Message** for **Message Type**, upload the Server Key, and enter your app package name.

> **Note：**
> - Select **"Data (Pass-through) Message"** for FCM push type; do not select "Notification Message". Notification messages cannot wake up the process if the app is killed and do not meet offline wake-up requirements for call scenarios.
> - The app package name must match your app's `applicationId`.
> - After a successful upload, you'll receive an **FCM Certificate ID**. You'll reference this when calling `setCertificateID` in the SDK.

## Solution 1: Basic Push

### Step 1. Add FCM Plugin Dependency

Add the following to your app module's `build.gradle`:
``` groovy
dependencies {
    // AtomicXCore dependency
    implementation 'com.tencent.atomicxcore:atomicxcore:latest.release'

    // FCM plugin (do NOT include TIMPush main package)
    implementation 'com.tencent.timpush:fcm:latest.release'
}
```

> **Do Not：**
> 
> Do not add the `com.tencent.timpush:timpush` main package. The main package auto-registers and conflicts with AtomicXCore's built-in push channel. The basic push solution requires only the FCM plugin.
> 
> **Note：**
> The FCM plugin automatically includes `com.google.firebase:firebase-messaging` as a transitive dependency via Gradle; you do not need to add it separately.
> 

### Step 2. Apply google-services Gradle Plugin

Add the following to your project's root `build.gradle`:
``` groovy
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

Apply the plugin at the top of your app module's `build.gradle`:
``` groovy
apply plugin: 'com.google.gms.google-services'
```

> **Note：**
> Ensure `google-services.json` is placed in the root directory of your app module (same level as `build.gradle`), or you'll encounter compilation errors.
> 

### Step 3. Report Certificate ID

In `Application.onCreate`, call `LoginStore.setCertificateID` to report the FCM Certificate ID obtained in Prerequisites:
``` kotlin
import io.trtc.tuikit.atomicxcore.api.login.LoginStore

class App : Application() {
    override fun onCreate() {
        super.onCreate()

        LoginStore.shared.setCertificateID(
            mapOf(
                "fcmCertificateId" to "12345" // Certificate ID
            )
        )
    }
}
```

> **Note：**
> - You can call this before or after login; the SDK will sync the token to the IM backend once the IM login state is ready.
> - Only needs to be called once; after logout/re-login, you **do not need to call it again**—the SDK handles it internally.
> - If your app serves both domestic and international users, you can provide both domestic vendor certificate IDs and FCM certificate ID at once. The SDK will automatically select the channel based on device type.

### Step 4. Initiate a Call

`AtomicXCore`'s `CallStore` automatically attaches offline push parameters when initiating a call; **you do not need to manually set any** `offlinePushInfo` **fields**. Default push content is:

|Field|Default Value|
|---------|---------|
|Push Title|Caller user's ID|
|Push Description|"In the Chinese environment, it is '您有新的来电', and in other languages, it is 'You have a new call'."|
|Ringtone|SDK built-in ringtone|

To **customize the push title or description**, set `offlinePushTitle` and/or `offlinePushDescription` on `CallParams` when making the call. These will override the defaults.
``` kotlin
import io.trtc.tuikit.atomicxcore.api.call.CallStore
import io.trtc.tuikit.atomicxcore.api.call.CallParams
import io.trtc.tuikit.atomicxcore.api.call.CallMediaType

val params = CallParams().apply {
    timeout = 30                              // Timeout (seconds)
    userData = "custom data"                  // Additional info (optional)

    // Optional: customize offline push title and description (defaults will be used if not set)
    offlinePushTitle = "Alice"
    offlinePushDescription = "is calling you"
}

val userIdList = listOf("callee user's userID")

CallStore.shared.calls(
    participantIds = userIdList,
    mediaType = CallMediaType.VIDEO,           // VIDEO for video call, AUDIO for voice call
    params = params
) { result ->
    if (result.isSuccess) {
        // Call initiated successfully, navigate to your own call page
    } else {
        // Handle call failure
    }
}
```

## Solution 2: Paid Push

> **Note：**
> The TIMPush plugin requires activation of the TIMPush service (paid or limited free trial).
> 

### Step 1. Activate the Service

Go to [IM Console > Plugin Marketplace](https://console.cloud.tencent.com/im/plugin/TIMPush), click **Purchase Now** or **Free Trial** (each app gets one free trial, valid for 7 days).

> **Note：**
> After the push plugin trial or purchase expires, push services (including offline push for normal messages, broadcast/tag push, etc.) will automatically stop. To avoid disruption, please [purchase](https://intl.cloud.tencent.com/en/account/login) or [renew](https://www.tencentcloud.com/en/account/login) in advance.
> 

### Step 2. Integrate TIMPush Main Package and FCM Plugin

Add the following to your app module's `build.gradle`:
``` groovy
dependencies {
    implementation 'com.tencent.atomicxcore:atomicxcore:latest.release'

    // TIMPush main package (required)
    implementation 'com.tencent.timpush:timpush:latest.release'

    // FCM plugin
    implementation 'com.tencent.timpush:fcm:latest.release'
}
```

For google-services plugin setup, see Solution 1 > Step 2.

### Step 3. Add timpush-configs.json

Go to [IM Console > Push Management](https://console.cloud.tencent.com/im/plugin/TIMPush), download the `timpush-configs.json` file, and place it in your app module's `assets/` directory.

### Step 4. Implement Auto Login

For Solution 2, when the app is woken by push, TIMPush sends a login notification via the `TUICore` event bus. Listen for this event in your `Application` and implement auto login logic; **if not, the callee will not see the incoming call UI after the app is killed**.
``` java
import com.tencent.qcloud.tuicore.TUIConstants;
import com.tencent.qcloud.tuicore.TUICore;
import com.tencent.qcloud.tuicore.interfaces.ITUINotification;

TUICore.registerEvent(
    TUIConstants.TIMPush.EVENT_IM_LOGIN_AFTER_APP_WAKEUP_KEY,
    TUIConstants.TIMPush.EVENT_IM_LOGIN_AFTER_APP_WAKEUP_SUB_KEY,
    new ITUINotification() {
        @Override
        public void onNotifyEvent(String key, String subKey, Map<String, Object> param) {
            if (TUIConstants.TIMPush.EVENT_IM_LOGIN_AFTER_APP_WAKEUP_KEY.equals(key)
                    && TUIConstants.TIMPush.EVENT_IM_LOGIN_AFTER_APP_WAKEUP_SUB_KEY.equals(subKey)) {
                // Implement your auto login logic (IM login must be completed before displaying the call page)
                autoLogin();
            }
        }
    }
);
```

> **Note：**
> - This event is sent by the TIMPush main package when the user clicks the notification banner to wake the app; it is **only available in Solution 2**.
> - For Solution 1 (Basic Push), **implement IM auto login directly in** `Application.onCreate`**; you do not need to listen for this event**.
> - The TIMPush main package uses the `ServiceInitializer` mechanism for automatic initialization and calls `registerPush` to obtain the token after IM login is successful. **Manual initialization is not required in your code**.

### Step 5. Initiate a Call

The call flow is identical to Solution 1. See Solution 1 > Initiate a Call for details.

## Advanced Features

### Customizing Ringtone

To customize the ringtone, replace the file at `tuicallkit-kt/src/main/res/raw/phone_ringing.mp3`.

> **Note：**
> - Once replaced, the new ringtone will be used in all call scenarios (foreground, background, offline).
> - Other vendor devices receiving the invitation will also use the custom ringtone.

## FAQs

### General Issues

#### Not receiving push notifications. How do I troubleshoot?

Follow these steps:
1. **Check IM Console:** Confirm that the FCM certificate was uploaded successfully, and **"Data (Pass-through) Message"** was selected for message type (do not select "Notification Message").

2. **Check app package name (**`applicationId`**):** Ensure it matches the package name registered in Firebase and the package name entered when uploading the certificate to the IM Console.

3. **Check** `google-services.json`**:** Verify it is in the root directory of the app module and that the `com.google.gms.google-services` plugin is applied.

4. **Check device GMS environment:** FCM requires Google Mobile Services. You can install a test app (such as Google Play Store) to confirm GMS availability.

5. **Check notification permissions:** In system settings, confirm your app has "Notification" permission (Android 13+ requires runtime permission).

6. Filter Logcat for `[PushManager]` and `[ChannelManager]`: Check which FCM channel the SDK is using and review the returned results.

#### Incoming call UI does not appear after app is killed. What should I do?

If **push is received** but **incoming call UI does not appear**, check the following:
1. **Confirm data message reception:** Filter Logcat for `TIMPush` to confirm logs for receiving FCM data messages. If missing, troubleshoot push delivery issues per FAQs: Not receiving push notifications. How do I troubleshoot ?

2. **Confirm app implements auto login:** After receiving push, the SDK attempts to fetch call requests, but this depends on IM login state. If auto login is not implemented after the app is killed, the SDK cannot fetch call requests, and the incoming call UI will not appear. Implement IM auto login logic at the app launch entry or in `Application.onCreate`.

3. **Confirm permissions:** Some device vendors require "Display over other apps" and "Background UI launch" permissions to show incoming call UI when the app is killed. Guide users to enable these in system settings.

#### My app targets both domestic and international users. Do I need to build two separate packages?

**No.** You can include both domestic vendor plugins and the FCM plugin in the same app, and set all certificate IDs at once in `setCertificateID`:
``` kotlin
LoginStore.shared.setCertificateID(
    mapOf(
        // Domestic
        "huaweiCertificateId" to "12345",
        "xiaomiCertificateId" to "12345",
        "xiaomiAppId" to "...",
        "xiaomiAppKey" to "...",
        // ... other domestic vendors

        // International
        "fcmCertificateId" to "12345"
    )
)
```

The SDK will automatically select the appropriate push channel based on the current device brand: domestic devices use domestic vendor channels, international devices use FCM.

### Solution 1 Related Issues

#### After integrating Solution 1, it's not sufficient. How do I upgrade to Solution 2?

Switch as follows:
1. Add `implementation 'com.tencent.timpush:timpush:latest.release'` to `build.gradle` (keep vendor plugin dependencies unchanged).

2. Remove the `LoginStore.shared.setCertificateID(...)` call from your code—TIMPush main package uses `ServiceInitializer` for auto initialization and automatically calls `registerPush` after IM login; no manual initialization required.

3. Listen for the `EVENT_IM_LOGIN_AFTER_APP_WAKEUP_KEY` event as described in Solution 2 > Implement Auto Login to handle auto login after push wake-up.

4. Complete purchase or trial per Solution 2 > Activate the Service.

   > **Note：**
   > 
   > You cannot use both solutions simultaneously. When switching, ensure only one set of depedencies remains in `build.gradle` (either atomicxcore with vendor plugins or timpush main package), and only one set of initialization logic is present in your code.
   > 

### Solution 2 Related Issues

#### How do I confirm the TIMPush push channel is working correctly?

Filter Logcat for `TIMPush` and check for these logs:
- `register success`: FCM channel token registration succeeded

- `setOfflinePushConfig success`: Token successfully reported to the IM backend

- After the caller initiates a call, callee log shows `onReceiveNotificationMessage`: push was received

   If any log segment is missing, troubleshoot per FAQs: Not receiving push notifications. How do I troubleshoot?.

## Communication & Feedback


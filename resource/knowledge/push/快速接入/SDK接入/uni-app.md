---
sync_node_id: '159322861584859136'
nav_path:
  - "推送服务（Push）"
  - "快速接入"
  - "SDK 接入"
  - "uni-app"
product: "push"
---
## Prerequisites

Before you start, complete the push prerequisites for the corresponding native platforms. For iOS and Android, see iOS Prerequisites and Android Prerequisites.

> **Version compatibility:**
> 
> - HBuilderX ([Official download](https://www.dcloud.io/hbuilderx.html)): Recommended versions are 4.36 ~ 4.63 or 4.66 and later. Avoid 4.64 and 4.65 due to known bugs.
> - [TencentCloud-Push plugin](https://ext.dcloud.net.cn/plugin): Use version 1.1.0 or later. Harmony push requires version 1.3.0 or later.
> - uni-app x projects: HBuilderX 4.55 or later is required.

In the examples in this document, `SDKAppID`, `AppKey`, `businessID`, manufacturer AppID, and manufacturer AppKey are placeholders. Replace them with real values and do not commit real secrets to your code repository.

## AI integration

Use npx to install [@tencent-rtc/trtc-push-skill](https://www.npmjs.com/package/@tencent-rtc/trtc-push-skill/v/1.0.1#%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87) into your local AI IDE to help complete TIMPush offline push integration. After installation, you can ask the AI to “integrate uniapp offline push” and similar requests. The AI will guide you through environment checks, manufacturer channel configuration, credential setup, code integration, and verification based on your project type. For details, see AI Coding.

> **Note:**
> Push AI integration is not a fully automated process. Developers still need to configure push-related information manually in vendor consoles, the Tencent Cloud console, and similar backends. For the detailed configuration steps, see the relevant sections below.
> 

## Manual integration

### Step 1: Integrate TencentCloud-Push

If you want to integrate manually, complete the following steps in order: download the plugin and import it into HBuilderX, then configure the offline push files.

#### Download the plugin and import it into HBuilderX
1. After completing manufacturer configuration for the target platform in Prerequisites, open [uni-app Tencent Cloud Push](https://ext.dcloud.net.cn/plugin), click **Download Plugin and Import to HBuilderX**, and import the plugin into your HBuilderX project.

   

2. Select the project to integrate and click **OK**.

   

3. After integration, the result looks like this:

   

#### Configure offline push files

> **Note:**
> - Place push configuration files in the `nativeResources` directory at the same level as `uni_modules`. Create the directory manually if it does not exist.
> - Upgrade HBuilderX and the TencentCloud-Push plugin to the latest versions to avoid compatibility issues with manufacturer channels in older versions (for example, before HBuilderX 4.36).

Expand the tab for your target platform below and place the configuration files as described:

【Android】
1. Create the `nativeResources/android/assets` directory.

2. Place `timpush-configs.json` (download it from [Console > Push > App Push > Push Settings](https://console.trtc.io/app-push/push-setting) ) into the `nativeResources/android/assets/` directory, as shown:

   

   

3. Configure FCM.

【FCM】
1. Add `com.google.gms.google-services` to `project.plugins` in `uni_modules/TencentCloud-Push/utssdk/app-android/config.json`, as shown:

``` json
"project": {
  	"plugins": [
        ...
  		"com.google.gms.google-services"
  	],
  	"dependencies": [
  		"com.huawei.agconnect:agcp:1.9.1.301",
		"com.google.gms:google-services:4.3.15",
		"com.hihonor.mcs:asplugin:2.0.1.300"
  	]
}
```

2. Place the `google-services.json` file under `nativeResources/android/`(important: do not place it under `nativeResources/android/assets`), as shown:

【iOS】
1. Create the `nativeResources/ios/Resources` directory;

2. Create the `timpush-configs.json` file under `nativeResources/ios/Resources`;

3. Add the certificate ID obtained from [Console > Push > App Push > Push Settings](https://console.trtc.io/app-push/push-setting)  to the `timpush-configs.json` file, as shown:

``` json
{
    "businessID":"xxx"
}
```
   

### Step 2: Register the push service

After importing the plugin and configuring offline push files, call `registerPush` to register for push when the app starts and the user agrees to the privacy policy. Register listeners for notification clicks, online push, and other events as needed.

Push registration involves two identifiers, `registrationID` and `userID`. Understanding the difference helps the backend deliver offline pushes correctly:

|**Push identifier**|**Description**|**How to get / set**|
|---------|---------|---------|
|`registrationID`|The unique push identifier assigned by the push service to each device. After `registerPush` succeeds, the backend can deliver offline pushes to the device using `registrationID`.|Obtain it with `getRegistrationID` after registration succeeds.|
|`userID`|The business user identifier linked to Chat login. Use it when you want the backend to push directly to the Chat login `userID` (that is, to receive Chat offline messages).|Call `setRegistrationID(userID)` before `registerPush` to bind it. After binding, `registrationID` equals that `userID`.|

> **Note:**
> - TIMPush only (standalone push): Call `registerPush` directly. The backend can push using the `registrationID` returned by `getRegistrationID`.
> - Integrated with Chat: Call `setRegistrationID(userID)` before `registerPush`, and the `userID` must exactly match the Chat login `userID`. Otherwise, account conflict may kick the other session and push will be lost.

#### Import and register the push service

Replace `SDKAppID` and `appKey` with the app information from [Console > Push > App Push > Overview](https://console.trtc.io/app-push/push-setting), as shown:

``` javascript
// Integrate TencentCloud-Push
import { setRegistrationID, registerPush, getRegistrationID, EVENT, addPushListener } from '@/uni_modules/TencentCloud-Push';
const SDKAppID = 0; // Your SDKAppID
const appKey = ''; // Client AppKey

// If you need to link with the Chat login userID (that is, push messages to this userID), use setRegistrationID
// setRegistrationID(userID, () => {
    // console.log('setRegistrationID ok', userID);
// });

registerPush(SDKAppID, appKey, (data) => {
        console.log('registerPush ok', data);
        getRegistrationID((registrationID) => {
            console.log('getRegistrationID ok', registrationID);
        });
    }, (errCode, errMsg) => {
        console.error('registerPush failed', errCode, errMsg);
    }
);

// Listen for notification bar click events and get push extension info
addPushListener(EVENT.NOTIFICATION_CLICKED, (res) => {
    // res is the push extension info
    console.log('notification clicked', res);
});

// Listen for online push
addPushListener(EVENT.MESSAGE_RECEIVED, (res) => {
    // res is the message content
    console.log('message received', res);
});

// Listen for online push revocation
addPushListener(EVENT.MESSAGE_REVOKED, (res) => {
    // res is the revoked message ID
    console.log('message revoked', res);
});
```

**Verification**: `registerPush` success callback is triggered; open the [troubleshooting tool](https://console.trtc.io/app-push/push-troubleshoot), enter `userID` or `registrationID`, and confirm the token has been uploaded. If the failure callback is triggered, look up `errCode` in Error codes .

> **Warning:**
> If your business only uses Chat messaging, do not call `registerPush` before Chat login. Otherwise, the SDK may register a Push-type account as in a standalone push scenario and generate corresponding Push DAU. Extra fees may apply after Push DAU exceeds the plan quota.
> 

#### Custom registrationID (optional)

To customize the push identifier (for example, using a business-side user ID), call `setRegistrationID` before `registerPush`.
``` javascript
import { setRegistrationID, registerPush } from '@/uni_modules/TencentCloud-Push';

// Call before registerPush. userID should match the Chat login userID
setRegistrationID(userID, () => {
    console.log('setRegistrationID ok', userID);
    registerPush(SDKAppID, appKey, (data) => {
        console.log('registerPush ok', data);
    }, (errCode, errMsg) => {
        console.error('registerPush failed', errCode, errMsg);
    });
});
```

> **Note:**
> In mixed scenarios, the custom `registrationID` must exactly match the Chat login `userID`. Otherwise, account conflict may kick the other session and push will be lost.
> 

### Step 3: Build a custom debug base (Android, iOS)

In HBuilderX, choose**Run** > **Run to Phone or Emulator** > **Make Custom Debug Base**, and use a cloud certificate to build a custom Android or iOS debug base.

**Verification**: The custom base is built successfully and the app installs and runs on a target manufacturer device without crashing. If it crashes on launch, check `config.json` dependency/plugin settings and whether manufacturer config files are in the correct location.

### Step 4: Test the push delivery chain

After completing the integration steps above, send a test message to verify the end-to-end path. Before sending, confirm:
1. Notification permission is allowed on Android 13 and later;

2. The target notification channel is enabled on Android 8.0 and later (including banner, lock screen, and sound switches);

3. The app is running on the custom base and is in the background.

   Before testing push, make sure notifications and the status bar are enabled. Open [Access Test](https://console.trtc.io/app-push/push-check)to send your first push.

   

### Step 5: Handle notification click redirects

Notification click redirects require three coordinated steps: configure the click action in the console, include redirect parameters when sending the push, and register a listener on the client and parse the parameters. If any step is missing, the redirect will not take effect.

#### Configure the console click action

In the console, configure After-click action for the push certificate and select Open a specified in-app page:

Path: Console > **Push** > **App Push** > **Push Settings** > **corresponding manufacturer certificate** > **Edit** > After-click action, select **Open a specified in-app page**, and keep the default filled values unchanged.

#### Include ext when sending the push

When sending an offline push, use the `ext` field to carry the business information needed for the redirect (such as the target page or conversation ID). `ext` is a string whose structure is defined by your business. JSON is recommended for easier client parsing. The examples below use the following structure:
``` json
# conversationType 1 means one-to-one chat (conversationID is the sender userID); 2 means group chat (conversationID is the groupID).
{"conversationID":"user_A","conversationType":1}
```

【Send from console】

When sending a push from [Access Test](https://console.trtc.io/app-push/push-check), enter a JSON string in the `Ext` field.

【Send via REST API】

To send pushes from the server, see REST API - All-member/Tag Push, and set a JSON string in `OfflinePushInfo.Ext` of the request body:
``` json
{
    "MsgBody": [],
    "OfflinePushInfo": {
        "PushFlag": 0,
        "Title": "Offline push title",
        "Desc": "Offline push content",
        "Ext": "{\"conversationID\":\"user_A\",\"conversationType\":1}"
    }
}
```

#### Register a client listener and parse ext

At app startup, call `addPushListener` to register the `EVENT.NOTIFICATION_CLICKED` event. In the callback, `res` is the push extension info carried by the sender via `ext`. After parsing it, navigate to the business page. The sample below only shows the core parsing logic; navigation is marked with `TODO`—complete it for your business:
``` javascript
import { addPushListener, EVENT } from '@/uni_modules/TencentCloud-Push';

addPushListener(EVENT.NOTIFICATION_CLICKED, (res) => {
    console.log('notification clicked', res);

    if (!res) {
        return;
    }

    // 1. Parse ext. res is the push extension info carried by the sender via ext; structure is defined by your business.
    let data = res;
    if (typeof res === 'string') {
        try {
            data = JSON.parse(res);
        } catch (e) {
            console.error('parse ext failed', e);
            return;
        }
    }

    const conversationID = data.conversationID;
    const conversationType = data.conversationType;

    // 2. TODO: Navigate to the target page based on business fields.
    //    If you use Chat / TUIKit, navigate after the user logs in successfully;
    //    On cold start, cache the parameters first and navigate in the login callback.
});
```

**Verification**: After clicking the notification, the `EVENT.NOTIFICATION_CLICKED` callback is invoked and `res` matches the `ext` set when sending. If the callback is not triggered, check whether the console click action is set to “Open a specified in-app page” with default filled values kept, whether the listener is registered at app startup, and whether `ext` was set when sending the message.

### Step 6: Configure message categories

Manufacturer offline channels usually have message category mechanisms. Categories affect delivery timeliness, daily receive limits per device, nighttime display, sound, banners, and manufacturer channel permissions.

> **Note:**
> Only strongly expected, time-sensitive messages such as IM chat, orders, transactions, and account changes should apply for or use high-priority categories. Marketing, ads, campaigns, and news must not abuse high-priority categories, or manufacturers may downgrade, rate-limit, or freeze permissions.
> 

Offline push categories are set by the sender (server REST API or Chat SDK) when sending. The TencentCloud-Push plugin itself does not send messages. When sending offline push, set manufacturer categories via offline push parameters (`OfflinePushInfo` for REST API or `V2TIMOfflinePushInfo` for Chat SDK). API settings usually override the default console certificate configuration. Manufacturer category mechanisms:

|**Manufacturer**|**Category mechanism**|
|---------|---------|
|Google FCM|Set the Android 8.0+ notification channel via `channelID`.|

### Step 7: Check manufacturer push limits

Google FCM limits upstream message frequency. For details, see [manufacturer documentation](https://firebase.google.com/docs/cloud-messaging/scale-fcm#handling-retries).

## Push result callbacks

After Push is enabled, you can forward push results to your app backend by configuring basic callbacks. See:
- Standard push result callback

- All-member push result callback

## Device notification bar settings

Push is shown as a notification bar alert, so like other notifications it is affected by device notification settings, for example:
- “Phone Settings > Notifications > Lock screen notifications > Hide or do not show notifications” affects whether push notifications appear on the lock screen.

- “Phone Settings > Notifications > More notification settings > Show notification icons in the status bar” affects whether push notification icons appear in the status bar.

- “Phone Settings > Notifications > App notification management > Allow notifications” directly controls whether push notifications are shown.

- “Phone Settings > Notifications > App notification management > Notification ringtone” and “Phone Settings > Notifications > App notification management > Silent notifications” affect the push notification sound.

   

## Integration troubleshooting

If you cannot receive push after integration, use the [troubleshooting tool](https://console.trtc.io/app-push/push-troubleshoot) to check the cause. If the issue remains after troubleshooting, please contact us to submit feedback.

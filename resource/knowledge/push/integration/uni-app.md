### Effect Showcase
| Xiaomi 11 Pro (Integrated with <a href="https://ext.dcloud.net.cn/plugin?id=9035">CallKit</a>) | iPhone 13 | Samsung Galaxy A23 Overseas Version (Google FCM Push) |
| --- | --- | --- |

### Integrate TencentCloud-Push

HBuilderX 4.29 has a bug. Please use HBuilderX 4.36 or higher and upgrade [uni-app Tencent Cloud Push Service (Push)](https://ext.dcloud.net.cn/plugin) to version 1.1.0 or higher.

### Step 1: Downloading the plugin and importing it into **HBuilderX**
1. Open [uni-app Tencent Cloud Push Service (Push)](https://ext.dcloud.net.cn/plugin), click **Download the plugin and import it into HBuilderX**, and import the plugin into the HBuilderX project.

2. Select the project you want to integrate and click **OK**.

3. The effect after integration is shown below:

### Step 2. Offline push configuration

> **Note:**
> 1. HBuilderX 4.36 has released non-backward compatible updates. If you are using HBuilderX 4.36 or higher and need vendor push for vivo/Honor, please upgrade the push version to 1.1.0 or higher and refer to the documentation to correctly configure `manifestPlaceholders.json` and `mcs-services.json`.
> 2. You need to configure push notifications in the `nativeResources` directory. If this folder is not yet created in the project root directory, please create a new folder named `nativeResources`.
> 3. Ensure that the `nativeResources` directory exists in the project opened with HBuilderX and is at the same level as the `uni_modules` directory.

【Android】
1. Create the directory `nativeResources/android/assets`.

3. Huawei, HONOR, vivo, FCM.

【FCM】

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

【Huawei】

【HONOR】
1. Edit `uni_modules/TencentCloud-Push/utssdk/app-android/config.json` in `dependencies`, add `"com.tencent.timpush:honor:8.3.6498"`.

``` bash
{
     ...
     "dependencies": [
         ...
         "com.tencent.timpush:honor:8.3.6498"
     ]
}
```
2. Configure the `mcs-services.json` file to the `nativeResources/android` directory (for details on obtaining this file, see Vendor Configuration > uniapp > Honor > Step 3.2: Enter Application Details, Bind Application Package Name, Download mcs-services.json File).

3. Configure `appID` to `nativeResources/android/manifestPlaceholders.json` in `"HONOR_APPID"`.

``` bash
{
     "HONOR_APPID": ""
}
```

【vivo】
1. Edit `uni_modules/TencentCloud-Push/utssdk/app-android/config.json` in `dependencies`, add `"com.tencent.timpush:vivo:8.3.6498"`.

``` bash
{
     ...
     "dependencies": [
         ...
         "com.tencent.timpush:vivo:8.3.6498"
     ]
}
```
2. Configure `appID` and `appKey` to `nativeResources/android/manifestPlaceholders.json` in `VIVO_APPKEY` and `VIVO_APPID`.

``` bash
{
     "VIVO_APPKEY": "",
     "VIVO_APPID": "",
}
```

【iOS】
1. Create the directory `nativeResources/ios/Resources`.

2. Create a `timpush-configs.json` file in `nativeResources/ios/Resources`.

``` json
{
    "businessID":"xxx"
}
```

### Step 3. Introduce and register Tencent Cloud Push Service (Push)

``` javascript
// Integration of TencentCloud-Push
import * as Push from '@/uni_modules/TencentCloud-Push';
const SDKAppID = 0; // Your SDKAppID
const appKey = ''; // Client Key

// If you need to connect with the Chat login userID (i.e., push messages to this userID), please use the setRegistrationID API
// Push.setRegistrationID(userID, () => {
    // console.log('setRegistrationID ok', userID);
// });

Push.registerPush(SDKAppID, appKey, (data) => {
        console.log('registerPush ok', data);
        Push.getRegistrationID((registrationID) => {
            console.log('getRegistrationID ok', registrationID);
        });
    }, (errCode, errMsg) => {
        console.error('registerPush failed', errCode, errMsg);
    }
);

// Listen for notification bar click events to get push extension information
Push.addPushListener(Push.EVENT.NOTIFICATION_CLICKED, (res) => {
    // res is the push extension information
    console.log('notification clicked', res);
});

// Listen for online push
Push.addPushListener(Push.EVENT.MESSAGE_RECEIVED, (res) => {
    // res is the message content
    console.log('message received', res);
});

// Listen for online push recall
Push.addPushListener(Push.EVENT.MESSAGE_REVOKED, (res) => {
    // res is the ID of the recalled message
    console.log('message revoked', res);
});
```

### Step 4. Use cloud certificates to generate custom base

Click **Run** > **Run to mobile device or emulator** > **Create custom debugging base** in HBuilderX to use cloud certificates to create Android or iOS custom debugging base.

### Step 5. Experience your first push

Before testing the push, please make sure to turn on notifications and the status bar. Go to [Push Service Push > Access Test](https://console.trtc.io/chat/push-plugin-push-check) to send your first push.

## Push Result Callback

After enabling the push service, the push results can be forwarded to the App backend by configuring basic callbacks.
- [Normal push result callback](https://www.tencentcloud.com/document/product/1047/67553)

- [All-member push result callback](https://www.tencentcloud.com/document/product/1047/60561)

## Device Notification Bar Settings

The intuitive representation of push is the notification bar reminder, so it is affected by the device notification settings just like other notifications. Taking Huawei as an example:
- "Settings > Notifications > Lock screen notifications > Hide or not show notifications", will affect the display of push notifications when the screen is locked.

- "Settings > Notifications > More notification settings > Show notification icons in the status bar", will affect the display of push notification icons in the status bar.

- "Settings > Notifications > App notification management > Allow notifications", turning it on or off will directly affect the display of push notifications.

- "Settings > Notifications > App notification management > Notification sounds" and "Settings > Notifications > App notification management > Silent notifications", will affect the sound effects of push notifications.

## Vendor's push restrictions
1. All vendors in China have adopted message classification mechanisms, and different push policies are assigned for different types of messages. To make the push timely and reliable, you need to set the push message type of your app as the system message or important message with a high priority based on the vendor's rules. Otherwise, push messages are affected by the vendor's message classification and may vary from your expectations.

2. In addition, some vendors set limits on the daily volumes of app push messages. You can check such limits in the vendor's console. If push messages are not pushed timely or cannot be received occasionally, consider the following:

【Huawei】

Push messages are classified into service and communication messages and information marketing messages with different push effects and policies. In addition, the message classification is also related to the self-help message classification permission:
- If there is no self-help message classification permission, the vendor will perform secondary intelligent message classification on push messages.

- If you have applied for the self-help message classification permission, push messages will be classified based on the custom classification and then pushed. For more information, see [Vendor Description](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835).

【vivo】

Push messages are classified into system messages and operational messages with different push effects and policies. The system messages are further subject to the vendor's intelligent classification for correction. A message that cannot be intelligently identified as a system message will be automatically corrected as an operational message. If the judgment is incorrect, you can provide feedback by email. In addition, the total number of push messages is subject to a daily limit determined based on the app subscription statistics by the vendor. For more information, see [Vendor Description 1](https://dev.vivo.com.cn/documentCenter/doc/359) or [Vendor Description 2](https://dev.vivo.com.cn/documentCenter/doc/156).

【OPPO】

Push messages are categorized into private messages and public messages, each having different effects and strategies. Private messages target users with a certain level of attention who wish to receive information promptly, and access to the private messaging channel requires an application via email. The public messaging channel has a limited push volume. For more details, see [Vendor Description 1](https://open.oppomobile.com/wiki/doc#id=11227) or [Vendor Description 2](https://open.oppomobile.com/wiki/doc#id=11210).

【Mi】

Push messages are divided into urgent messages and regular messages, with different effects and strategies. The urgent message category is limited to instant communication messages, personal attention updates, personal reminders, changes in personal order status, personal financial alerts, personal status updates, personal resource changes, and personal device alerts, which can be requested on the vendor dashboard. The regular message category has a limited push volume. For more details, see [Vendor Description 1](https://dev.mi.com/console/doc/detail) or [Vendor Description 2](https://dev.mi.com/console/doc/detail).

【Meizu】

There is a limit to the number of messages that can be pushed. For more details, see [Vendor Description](http://open.res.flyme.cn/fileserver/upload/file/202201/85079f02ac0841da859c1da0ef351970.pdf).

【FCM】

There is a frequency limit for pushing upstream messages. For more details, see [Vendor Description](https://firebase.google.com/docs/cloud-messaging/scale-fcm#handling-retries).

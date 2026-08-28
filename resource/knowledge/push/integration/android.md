> **Note:**
> If you need to use products such as Chat, CallKit, RoomKit, LiveKit, etc. simultaneously, please refer to [Chat Quick Integration Solution](https://www.tencentcloud.com/document/product/1047/50034).
>

### Step 1: Download and add the configuration file

After completing the console manufacturer push information, download and add the configuration file to the project. Add the downloaded timpush-configs.json file to the assets directory of the application module:

### Step 2: Integrate TIMPush
``` java
// The version number "VERSION" can be obtained from the .
// 1. Integration of the push main package is mandatory
implementation 'com.tencent.timpush:timpush:VERSION'
implementation 'com.tencent.liteav.tuikit:tuicore:VERSION'
// 2. Integrate FCM push package
implementation 'com.tencent.timpush:fcm:VERSION'
// 3. If only the FCM channel is needed, the following packages do not need to be integrated; if you want to prioritize the FCM channel, call the API
implementation 'com.tencent.timpush:huawei:VERSION'
implementation 'com.tencent.timpush:xiaomi:VERSION'
implementation 'com.tencent.timpush:oppo:VERSION'
implementation 'com.tencent.timpush:vivo:VERSION'
implementation 'com.tencent.timpush:honor:VERSION'
implementation 'com.tencent.timpush:meizu:VERSION'
```
- **vivo and HONOR configuration**

   According to vivo and HONOR manufacturer's access guidance, it is necessary to add the APPID and APPKEY to the manifest file, otherwise compilation issues will occur.

【Method 1】
``` java
android {
    ...
    defaultConfig {
        ...
        manifestPlaceholders = [
            "VIVO_APPKEY" : "`APPKEY` of the certificate assigned to your application",
            "VIVO_APPID" : "`APPID` of the certificate assigned to your application",
            "HONOR_APPID" : "`APPID` of the certificate assigned to your application"
        ]
    }
}
```

【Method 2】
``` java
// vivo begin
<meta-data tools:replace="android:value"
    android:name="com.vivo.push.api_key"
    android:value="`APPKEY` of the certificate assigned to your application" />
<meta-data tools:replace="android:value"
    android:name="com.vivo.push.app_id"
    android:value="`APPID` of the certificate assigned to your application" />
// vivo end

// honor begin
<meta-data tools:replace="android:value"
    android:name="com.hihonor.push.app_id"
    android:value="`APPID` of the certificate assigned to your application" />
// honor end
```

- **Huawei, HONOR, and Google FCM Adaptation**

   Follow the vendor method to integrate the corresponding plugin and JSON configuration file.

   > **Note:**
   >
   > The following adaptation for HONOR only requires configuration for version 7.7.5283 and above.
   >

  1. Download the configuration file and place it under the root directory of the project:

【Huawei】

【HONOR】

【Google FCM】

【Operation Path】

  2. Add the following configuration under **buildscript** -> **dependencies** in your project-level `build.gradle` file:

【For Gradle version 7.1 and above】

Add the following configuration under buildscript -> dependencies in your project-level build.gradle file:
``` java
buildscript {
    dependencies {
        ...
        classpath 'com.google.gms:google-services:4.3.15'
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
    }
}
```

 In the project-level settings.gradle file, add the following repository configurations under pluginManagement -> repositories and dependencyResolutionManagement -> repositories:
``` java
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
        // Configure the Maven repository address for HMS Core SDK.
        maven {url 'https://developer.huawei.com/repo/'}
        maven {url 'https://developer.hihonor.com/repo'}
    }
}
dependencyResolutionManagement {
    ...
    repositories {
        mavenCentral()
maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
// Configure the Maven repository address for HMS Core SDK.
maven {url 'https://developer.huawei.com/repo/'}
maven {url 'https://developer.hihonor.com/repo'}
    }
    }
}
```

【Gradle version 7.0】

Add the following configuration under buildscript in your project-level build.gradle file:
``` java
buildscript {
    repositories {
        mavenCentral()
maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
// Configure the Maven repository address for HMS Core SDK.
maven {url 'https://developer.huawei.com/repo/'}
maven {url 'https://developer.hihonor.com/repo'}
    }
    dependencies {
        ...
        classpath 'com.google.gms:google-services:4.3.15'
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
    }
}
```

Add the following repository configurations under dependencyResolutionManagement -> repositories in your project-level settings.gradle file:
``` plaintext
dependencyResolutionManagement {
    ...
    repositories {
        mavenCentral()
maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
// Configure the Maven repository address for HMS Core SDK.
maven {url 'https://developer.huawei.com/repo/'}
maven {url 'https://developer.hihonor.com/repo'}
    }
}
```

【Versions Below Gradle 7.0】

Add the following configuration under buildscript and allprojects in the project-level build.gradle file:
``` java
buildscript {
    repositories {
        mavenCentral()
maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
// Configure the Maven repository address for HMS Core SDK.
maven {url 'https://developer.huawei.com/repo/'}
maven {url 'https://developer.hihonor.com/repo'}
    }
    dependencies {
        ...
        classpath 'com.google.gms:google-services:4.3.15'
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
    }
}

allprojects {
    repositories {
        mavenCentral()
maven { url "https://mirrors.tencent.com/nexus/repository/maven-public/" }
// Configure the Maven repository address for HMS Core SDK.
maven {url 'https://developer.huawei.com/repo/'}
maven {url 'https://developer.hihonor.com/repo'}
    }
}
```

  3. Add the following configuration in the app-level build.gradle file:

      ``` java
      apply plugin: 'com.google.gms.google-services'
      apply plugin: 'com.huawei.agconnect'
      apply plugin: 'com.hihonor.mcs.asplugin'
      ```

### Step 3: Set obfuscation rules

In the proguard-rules.pro file, add TIMPush-related classes to the non-obfuscation list:
``` java
-keep class com.tencent.qcloud.** { *; }
-keep class com.tencent.timpush.** { *; }
```

### Step 4: Register for Push Notifications

After the push registration is successfully called, you can receive offline push notifications.
``` java
TIMPushManager.getInstance().registerPush(context, your sdkAppId, "client key", new TIMPushCallback() {
    @Override
    public void onSuccess(Object data) {

    }

    @Override
    public void onError(int errCode, String errMsg, Object data) {

    }
});
```

### Step 5. Message Delivery Statistics Configuration

If you need to collect data reach statistics, please complete the configuration as follows:

【Huawei】

Receipt Address:

Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/huawei

Korea: https://apikr.im.qcloud.com/v3/offline_push_report/huawei

USA: https://apiusa.im.qcloud.com/v3/offline_push_report/huawei

Germany: https://apiger.im.qcloud.com/v3/offline_push_report/huawei

Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/huawei

China: https://api.im.qcloud.com/v3/offline_push_report/huawei

> **Note:**
> Huawei Push Certificate ID <= 11344, using Huawei Push v2 interface, does not support Reach and Click Receipt, please regenerate and update Certificate ID.
>

【HONOR】

Receipt Address:

Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/honor

Korea: https://apikr.im.qcloud.com/v3/offline_push_report/honor

USA: https://apiusa.im.qcloud.com/v3/offline_push_report/honor

Germany: https://apiger.im.qcloud.com/v3/offline_push_report/honor

Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/honor

China: https://api.im.qcloud.com/v3/offline_push_report/honor

【vivo】
| Callback Address Configuration | Configure Receipt ID in the IM Console |
| --- | --- |
| Receipt Address:<br>Singapore :https://apisgp.im.qcloud.com/v3/offline_push_report/vivo<br>Korea:<br>https://apikr.im.qcloud.com/v3/offline_push_report/vivo<br>USA: https://apiusa.im.qcloud.com/v3/offline_push_report/vivo<br>Germany: https://apiger.im.qcloud.com/v3/offline_push_report/vivo<br>Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/vivo<br>China:<br>https://api.im.qcloud.com/v3/offline_push_report/vivo |  |

【Meizu】

Receipt Address:

Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/meizu

Korea: https://apikr.im.qcloud.com/v3/offline_push_report/meizu

USA: https://apiusa.im.qcloud.com/v3/offline_push_report/meizu

Germany: https://apiger.im.qcloud.com/v3/offline_push_report/meizu

Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/meizu

China: https://api.im.qcloud.com/v3/offline_push_report/meizu

> **Note:**
> After turning on the receipt toggle, please make sure the receipt address is correctly configured. Not configuring it or configuring the wrong address will affect the push notification feature.
>

> **Note:**
> - No configuration for message delivery statistics is required for other supported manufacturers.
> - FCM currently does not support the push notification statistics feature.

### Step 6: **Verify Connection**

Run App, filter the "TIMPush" keyword, and review relevant logs.

If logs similar to the above appear, it indicates that Push has been successfully integrated and you can proceed to the next test.

### Step 7: Send push messages

For detailed interface description, see: [REST API Interface - Initiate All-staff/Tag Push](https://www.tencentcloud.com/document/product/1047/60561).

### Step 8: Customize navigation after tapping offline push

After receiving the push message, clicking the notification bar will trigger the component to callback the click event and pass through the offline message.

【Custom click redirect implementation】

> **Note:**
> 1. It is recommended to place the registration callback timing in the onCreate() function of the application.
> 2. Console configuration follow-up actions are configured as follows, select **Open the specified interface within the app** and do not modify, use the default values.
>

``` java
TIMPushManager.getInstance().addPushListener(new TIMPushListener() {
    @Override
    public void onNotificationClicked(String ext) {
        Log.d(TAG, "onNotificationClicked =" + ext);
        // Getting ext for Definition redirect

    }
});
```

【Custom click redirect implementation (old solution)】

The component will notify the application in the form of a callback or broadcast, and the application can configure the app's page jump in the callback.

> **Note:**
> 1. It is recommended to place the registration callback timing in the onCreate() function of the application.
> 2. Console configuration follow-up actions are configured as follows, select **Open the specified interface within the app** and do not modify, use the default values.
>

1. The callback method is as follows:

``` java
TUICore.registerEvent(TUIConstants.TIMPush.EVENT_NOTIFY, TUIConstants.TIMPush.EVENT_NOTIFY_NOTIFICATION, new ITUINotification() {
        @Override
        public void onNotifyEvent(String key, String subKey, Map<String, Object> param) {
            Log.d(TAG, "onNotifyEvent key = " + key + "subKey = " + subKey);
            if (TUIConstants.TIMPush.EVENT_NOTIFY.equals(key)) {
                if (TUIConstants.TIMPush.EVENT_NOTIFY_NOTIFICATION.equals(subKey)) {
                    if (param != null) {
                        String extString = (String)param.get(TUIConstants.TIMPush.NOTIFICATION_EXT_KEY);
                        // Getting ext for Definition redirect

                    }
                }
            }
        }
    });
```
2. The broadcast method is as follows:

``` java
// Dynamic Broadcast Registration
IntentFilter intentFilter = new IntentFilter();
intentFilter.addAction(TUIConstants.TIMPush.NOTIFICATION_BROADCAST_ACTION);
LocalBroadcastManager.getInstance(context).registerReceiver(localReceiver, intentFilter);

// Broadcast Receiver
public class OfflinePushLocalReceiver extends BroadcastReceiver {
    public static final String TAG = OfflinePushLocalReceiver.class.getSimpleName();

    @Override
    public void onReceive(Context context, Intent intent) {
        DemoLog.d(TAG, "BROADCAST_PUSH_RECEIVER intent = " + intent);
        if (intent != null) {
            String ext = intent.getStringExtra(TUIConstants.TIMPush.NOTIFICATION_EXT_KEY);
            // Getting ext for Definition redirect

        } else {
            Log.e(TAG, "onReceive ext is null");
        }
    }
}
```

### Step 9: Message Category Configuration (Optional)

Vendor offline push channels use a [message categorization mechanism](https://trtc.io/document/60576), with different push strategies for different types.
- If your push requirement is IM-type and you need timely delivery, configure your application to the corresponding push type per vendor rules, so it is classified as a high-priority system message or important message type.

- Otherwise, offline push will be subject to quantity and frequency limits and may not be delivered promptly.

   Congratulations! You have completed the integration of the push plugin. Please be reminded: After the trial period or subscription expires, the push service (including regular message offline push, all-staff/Tag push, etc.) will automatically cease. To avoid affecting the normal use of your services, please make sure to [purchase](https://buy.tencentcloud.com/avc)/[renew](https://buy.tencentcloud.com/avc) in advance.

   > **Note:**
   >
   > 1. If you are unable to receive push notifications after integration, please first use the [Troubleshooting Tool](https://trtc.io/document/60541) to check the specific reasons. To view push indicator data, please use [Statistics](https://trtc.io/document/60540) query.
   > 2. For the All/Tag Push feature, please refer to: [RESTful APIs - Initiate All/Tag Push](https://trtc.io/document/60561).

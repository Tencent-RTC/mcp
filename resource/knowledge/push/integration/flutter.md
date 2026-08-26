## Operation step

### Step 1: Integrate the Message Push Plugin

The package name of this plugin on [pub.dev](https://pub.dev/packages/tencent_cloud_chat_push) is: `tencent_cloud_chat_push`, you can introduce it into the pubspec.yaml dependency directory, or you can execute the following command to install it automatically.
``` bash
flutter pub add tencent_cloud_chat_push
```

### Step 2: Push Parameter Configuration

【iOS】

Please upload the iOS APNs push certificate you obtained in the manufacturer configuration step to the Chat console.

To register for push notifications, you need to pass in this Certificate ID (apnsCertificateID):
``` java
TencentCloudChatPush().registerPush(apnsCertificateID: Your configured Certificate ID);
```

【Android】

After completing the console manufacturer push information, download and add the configuration file to the project. Add the downloaded timpush-configs.json file to the `android/app/src/main/assets` directory of the project. If the directory does not exist, please create it manually.

### Step 3: Client Code Configuration

In this step, you will need to write some native code, such as Swift, Java, XML, etc.

Please do not worry. Just follow the instructions and copy the provided code into the specified file.

【iOS】

You can edit using Xcode, or directly in Visual Studio Code or Android Studio.

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

    // To be deprecated，please use the new field businessID below.
    @objc func offlinePushCertificateID() -> Int32 {
        return TencentCloudChatPushFlutterModal.shared.offlinePushCertificateID();
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

> **Note:**
> 1. For the iOS console, please set the certificate ID to use businessID. The offlinePushCertificateID is deprecated.
> 2. The old field offlinePushCertificateID is still supported, but you need to add the @objc keyword.

【Android】

It is recommended to use Android Studio to complete this part of the editing.

In the android path of your project, create a new Application class file at the same directory level as `MainActivity`, for example, you can name it `MyApplication.java`.

If you have already customized an Application class, you can directly reuse it without creating a new one.

Paste the following code into the file as shown above:
``` java
Replace the package with your own. Generally, Android Studio will generate it automatically;

import com.tencent.chat.flutter.push.tencent_cloud_chat_push.application.TencentCloudChatPushApplication;

public class MyApplication extends TencentCloudChatPushApplication {
    @Override
    public void onCreate() {
        super.onCreate();
    }
}
```

> **Note:**
> If you have already created your own Application for other purposes, directly `extend TencentCloudChatPushApplication` and ensure that the `onCreate()` function calls `super.onCreate();`.
>

### Step 4: Client Manufacturer Configuration

【iOS】

This step is not required for iOS.

【Android】

Open the android/app/build.gradle file and add the dependencies configuration at the end. According to your needs, introduce all or some of the following manufacturer push packages. The native push capability of a manufacturer is enabled only after the corresponding manufacturer’s push package is introduced.
``` java
dependencies {
     // The version number "VERSION" can be obtained from the .
     // Huawei
     implementation 'com.tencent.timpush:huawei:VERSION'
     // XiaoMi
     implementation 'com.tencent.timpush:xiaomi:VERSION'
     // OPPO
     implementation 'com.tencent.timpush:oppo:VERSION'
     // vivo
     implementation 'com.tencent.timpush:vivo:VERSION'
     // Honor
     implementation 'com.tencent.timpush:honor:VERSION'
     // Meizu
     implementation 'com.tencent.timpush:meizu:VERSION'
     // Google Firebase Cloud Messaging (Google FCM)
     implementation 'com.tencent.timpush:fcm:VERSION'
}
```
- **Vivo and Honor compatibility**

- According to Vivo and Honor manufacturer access guidelines, the APPID and APPKEY need to be added to the manifest file.

【Method 1】
``` java
// android/app/build.gradle

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
// android/app/src/main/AndroidManifest.xml

// Vivo begin
<meta-data tools:replace="android:value"
    android:name="com.vivo.push.api_key"
    android:value="`APPKEY` of the certificate assigned to your application" />
<meta-data tools:replace="android:value"
    android:name="com.vivo.push.app_id"
    android:value="`APPID` of the certificate assigned to your application" />
// Vivo end

// Honor begin
<meta-data tools:replace="android:value"
    android:name="com.hihonor.push.app_id"
    android:value="`APPID` of the certificate assigned to your application" />
// Honor end
```
- **Huawei, HONOR, and Google FCM Adaptation**

Follow the vendor method to integrate the corresponding plugin and JSON configuration file.

   > **Note:**
   >
   > The following adaptation for HONOR only requires configuration for version 7.7.5283 and above.
   >

  1. Download the configuration file and place it under the root directory/Android/app of the project.

【Huawei】

【HONOR】

【Google FCM】

【Operation Path】

  2. Add the following configuration under buildscript -> dependencies in your project-level build.gradle file:

【For Gradle version 7.1 and above】

Add the following configuration under buildscript -> dependencies in your project-level build.gradle file:
``` java
buildscript {
    dependencies {
        ...
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

 Add the following repository configuration under buildscript -> repositories and allprojects -> repositories in your project-level settings.gradle file:
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
        classpath 'com.google.gms:google-services:4.2.0'
        classpath 'com.huawei.agconnect:agcp:1.4.1.300'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
    }
}
```

 Add the following repository configuration under allprojects -> repositories in your project-level settings.gradle file:
``` plaintext
allprojects {
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
        classpath 'com.google.gms:google-services:4.2.0'
        classpath 'com.huawei.agconnect:agcp:1.4.1.300'
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

### Step 5: Click Offline Push for Custom Redirect

If you need to customize the parsing of received remote push notifications, you can implement it as follows:

【Custom click redirect implementation】

> **Note:**
> 1. It is recommended to register the callback in the main() function at the program entry.
> 2. For console configuration, click on 'Subsequent Actions' and configure as follows, choose **Open the specified interface within the app**, and the plugin users will by default fill in the jump parameters.
>

``` java
TIMPushListener timPushListener = TIMPushListener(
      onNotificationClicked: (String ext) {
        debugPrint("ext: $ext");
        // Getting ext for Definition redirect

      }
    );
tencentCloudChatPush.addPushListener(listener: timPushListener);
```

【Custom click redirect implementation (old solution)】

Please define a function to receive the push message click callback event.

Define the function with the parameter format `{required String ext, String? userID, String? groupID}`.
- Among them, the ext field carries the complete ext information specified by the sender. If not specified, there is a default value. You can parse this field to navigate to the corresponding page.

- The userID and groupID fields are automatically parsed by the plugin from the ext Json String to get the single chat userID and group chat groupID information. If you do not customize the ext field, the ext field is specified by the SDK or UIKit by default, and you can use this default parsing. If parsing fails, it will be null.

You can define a function to receive this callback and use it to navigate to the corresponding Session Page or your Business Page.

Example below:
``` java
void _onNotificationClicked({required String ext, String? userID, String? groupID}) {
  print("_onNotificationClicked: $ext, userID: $userID, groupID: $groupID");
  if (userID != null || groupID != null) {
    // Redirect to the corresponding Message page based on userID or groupID.
  } else {
    // Based on the ext field, write your own parsing method to redirect to the corresponding page.
  }
}
```

### Step 6: Register the Push Plugin

**Please note, do not call in the main method of the Flutter program entry.**

After successfully calling the  `TencentCloudChatPush().registerPush` method, you can receive offline push notifications.
``` java
TencentCloudChatPush().registerPush(
    onNotificationClicked: _onNotificationClicked,
    sdkAppId: Your sdkAppId,
    appKey: "client key",
    apnsCertificateID: Your configured Certificate ID);
```

### Step 7: Message Push Reach Statistics

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

No configuration needed for other supported manufacturers. FCM currently does not support push notification statistics feature.

### Step 8: **Verify Connection**

Run App, filter the "TIMPush" keyword, and review relevant logs.
- Android

- iOS

   If logs similar to the above appear, it indicates Push integration is successful and you can proceed to the next test.

Congratulations! You have completed the integration of the push plugin. Please be reminded: After the trial period or subscription expires, the push service (including regular message offline push, all-staff/Tag push, etc.) will automatically cease. To avoid affecting the normal use of your services, please make sure to [purchase](https://buy.tencentcloud.com/avc)/[renew](https://buy.tencentcloud.com/avc) in advance.

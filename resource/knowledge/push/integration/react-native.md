### Effect Showcase
| Xiaomi 11 Pro (Integrated with <a href="https://ext.dcloud.net.cn/plugin?id=9035">CallKit</a>) | iPhone 13 | Samsung Galaxy A23 Overseas Version (Google FCM Push) |
| --- | --- | --- |

### Step 1: Create a React Native project (skip this step if you already have one)
``` bash
npx @react-native-community/cli@latest init MyReactNativeApp --version 0.75.0
```

### Step 2: **Entering the MyReactNativeApp Directory**, Integrating @tencentcloud/react-native-push

【npm】
``` bash
npm install @tencentcloud/react-native-push --save
```

【yarn】
``` bash
yarn add @tencentcloud/react-native-push
```

### Step 3:**Register for Push Notifications**

Copy the following code to `App.tsx` and replace `SDKAppID` and `appKey` with your application's information.

> **Note:**
> After successfully registering the push service with `registerPush`, you can obtain the push ID, namely RegistrationID, through `getRegistrationID`. You can push messages to the specified RegistrationID.
>

``` javascript
import Push from '@tencentcloud/react-native-push';

const SDKAppID = 0; // Your SDKAppID
const appKey = ''; // Client Key

if (Push) {
  // If you need to connect with the Chat login userID (i.e., push messages to this userID),
  // please use the setRegistrationID API
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
}
```

### Step 4: Configuring Vendor Push

【Android】

2. Huawei, HONOR, vivo, FCM.

【FCM】

When you need to support FCM push, you must configure the  `google-services.json` file in the `MyReactNativeApp/android/app` directory (**Please note! Not in the** `MyReactNativeApp/android/app/src/main/assets directory`). As shown in the picture:

【Huawei】

【HONOR】

``` bash
......
android {
    ......
    defaultConfig {
        ......
        manifestPlaceholders = [
          "HONOR_APPID" : ""
        ]
    }
}
```

2. Download the `mcs-services.json` file from the [Honor Developer Management Center](https://developer.honor.com/en/), and configure it in the `MyReactNativeApp/android/app` directory (**Please note! Not in the** `MyReactNativeApp/android/app/src/main/assets directory` directory).

【vivo】

``` bash
......
android {
    ......
    defaultConfig {
        ......
        manifestPlaceholders = [
          "VIVO_APPKEY" : "0",
          "VIVO_APPID" : "0",
        ]
    }
}
```

【iOS】

``` javascript
{
  "businessID": "Your Certificate ID"
}
```

### Step 5: **Configuring Native Modules and Dependencies**

【Android】

> **Note:**
> Please ensure the package name in `timpush-configs.json` matches the `applicationId` value in `MyReactNativeApp/android/app/build.gradle`. Inconsistency will result in offline push notifications being unavailable.
>

1. Open the `MyReactNativeApp/android` directory with Android Studio.

2. Modify the project entry file.

【The project entry file is: MainApplication.kt】
``` java
...
import com.tencent.qcloud.rntimpush.TencentCloudPushApplication

// Replace Application with TencentCloudPushApplication
class MainApplication : TencentCloudPushApplication(), ReactApplication {
  ...
  //  add TencentCloudPushPackage to the list of packages returned in ReactNativeHost's getPackages() method
  override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // add(MyReactNativePackage())
    }
}
```

【The project entry file is: MainApplication.java】
``` java
...
import com.tencent.qcloud.rntimpush.TencentCloudPushApplication;

// Replace Application with TencentCloudPushApplication
public class MainApplication extends TencentCloudPushApplication implements ReactApplication {
  ...
  // add TencentCloudPushPackage to the list of packages returned in ReactNativeHost's getPackages() method
  @Override
  protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Packages that cannot be autolinked yet can be added manually here, for example:
    // packages.add(new MyReactNativePackage());
    return packages;
  }
  ...
```
3.  Edit the `android/build.gradle` file to update `repositories`, `dependencies`, and `allprojects`.

``` java
buildscript {
    ...
    repositories {
        ...
        google()
        mavenCentral()
        maven { url 'https://mirrors.tencent.com/nexus/repository/maven-public/' }
        // Configure the Maven repository address for HMS Core SDK.
        maven { url 'https://developer.huawei.com/repo/' }
        maven { url 'https://developer.hihonor.com/repo' }
    }
    dependencies {
        ...
        // If the com.android.tools.build:gradle in your created project does not have a version number, set it to 8.5.0
        // classpath("com.android.tools.build:gradle:8.5.0")
        classpath 'com.google.gms:google-services:4.3.15'
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
        classpath 'com.hihonor.mcs:asplugin:2.0.1.300'
    }
}
allprojects {
    repositories {
        mavenCentral()
        maven { url 'https://mirrors.tencent.com/nexus/repository/maven-public/' }
        // Configure the Maven repository address for HMS Core SDK.
        maven { url 'https://developer.huawei.com/repo/' }
        maven { url 'https://developer.hihonor.com/repo' }
    }
}
...
```
4.  Edit the `android/app/build.gradle` file, configure the vendor's push package as needed, and apply the plugin.

``` javascript
...
// If your APP requires FCM push notifications, uncomment the following line
// apply plugin: 'com.google.gms.google-services'
// If your APP requires Huawei push notifications, uncomment the following line
// apply plugin: 'com.huawei.agconnect'
// If your APP requires HONOR push notifications, uncomment the following line
// apply plugin: 'com.hihonor.mcs.asplugin'
...
android {
    ...
    defaultConfig {
        ...
        manifestPlaceholders = [
            "VIVO_APPKEY" : "0", // If your App requires vivo push notifications, please configure 'VIVO_APPKEY' and 'VIVO_APPID'
            "VIVO_APPID" : "0",
            "HONOR_APPID" : "" // If your APP requires HONOR push notifications, please configure 'HONOR_APPID'
        ]
    }
}

dependencies {
  ...
  // Please import all or part of the following vendor push packages as needed.
  // Only by importing the push package of the corresponding vendor
  // can you enable the native push capability of that vendor.
  implementation 'com.tencent.timpush:huawei:8.3.6498'
  implementation 'com.tencent.timpush:xiaomi:8.3.6498'
  implementation 'com.tencent.timpush:oppo:8.3.6498'
  implementation 'com.tencent.timpush:vivo:8.3.6498'
  implementation 'com.tencent.timpush:honor:8.3.6498'
  implementation 'com.tencent.timpush:meizu:8.3.6498'
  implementation 'com.tencent.timpush:fcm:8.3.6498'
}
```
5. After completing the above steps, select **File > Sync Project with Gradle Files**.

【iOS】
1. Open **MyReactNativeApp/ios/MyReactNativeApp.xcworkspace** with XCode.

2. Go to the `MyReactNativeApp/ios` directory and install TIMPush.

``` bash
pod install
# If you cannot install the latest version, run the following command to update your local CocoaPods repository list
pod repo update
```
3. Enable push notification feature in the app. Open the Xcode project, and select and add **Push Notifications** on the **Project > Target > Capabilities** page.

### Step 6: **Running on a Real Device (Make sure to enable notification permissions on your phone before testing, allowing the app to send notifications.)**

Starting from the project's root directory, run the following command in the command prompt to install and launch your app on the device:

【Android】
``` bash
npm run android
```

【iOS】
``` bash
npm run ios
```

### Step 7: Message Push Reach Statistics

If you need to collect data on delivery, please complete the setup as follows:

【Huawei】

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/huawei

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/huawei

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/huawei

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/huawei

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/huawei

- China: https://api.im.qcloud.com/v3/offline_push_report/huawei

> **Note:**
> Huawei Push Certificate ID <= 11344, using Huawei Push v2 version interface does not support reach and click receipt, please regenerate and update the certificate ID.
>

【HONOR】

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/honor

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/honor

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/honor

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/honor

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/honor

- China: https://api.im.qcloud.com/v3/offline_push_report/honor

【vivo】
| Callback Address Configuration | Receipt ID Configuration in the Chat Console |
| --- | --- |
| <strong>Receipt Address:</strong><br>- Singapore :https://apisgp.im.qcloud.com/v3/offline_push_report/vivo<br>- Korea:https://apikr.im.qcloud.com/v3/offline_push_report/vivo<br>- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/vivo<br>- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/vivo<br>- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/vivo<br>- China: https://api.im.qcloud.com/v3/offline_push_report/vivo |  |

【Meizu】

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/meizu

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/meizu

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/meizu

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/meizu

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/meizu

- China: https://api.im.qcloud.com/v3/offline_push_report/meizu

> **Note:**
> After enabling the Receipt Switch, please make sure the Receipt Address is configured correctly. Failing to configure or configuring the wrong address will affect the push feature.
>

【iOS】

For iOS push reach statistics configuration, see **Statistics of Push Arrival Rate**.

No configuration is needed for other supported manufacturers; FCM does not support the push notification statistics feature.

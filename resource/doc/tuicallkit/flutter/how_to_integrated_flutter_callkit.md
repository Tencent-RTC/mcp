This article will guide you through the process of integrating the TUICallKit component quickly. By following this documentation, you can complete the access work in just 10 minutes and ultimately obtain an application with a complete user interface as well as audio and video calling features.
<table>
<tr>
<td rowspan="1" colSpan="1" >Video Call</td>

<td rowspan="1" colSpan="1" >Group call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/1390039d18d011ef9ff4525400f65c2a.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/4cd1634b18ce11efb8185254005ac0ca.png)</td>
</tr>
</table>


## Environment Preparations

Flutter 3.0 or higher version.

## Step 1. Activate the service

Before using the audio and video services provided by Tencent Cloud, you need to go to the console to activate the audio and video services for your application, and obtain `SDKAppID, SDKSecretKey`. They will be used in [Step 5](https://write.woa.com/document/113558560409751552). For specific steps, please refer to [activate the Service.](https://write.woa.com/document/140196392040579072)

## Step 2. Import the component

Execute the following command in the command line to install the [tencent_calls_uikit](https://pub.dev/packages/tencent_calls_uikit) plugin.
``` bash
flutter pub add tencent_calls_uikit
```

## Step 3. Configure the project



【Android】
1. If you need to compile and run on the Android platform, since the SDK uses Java's reflection feature internally, certain classes in the SDK must be added to the non-aliasing list.

  - First, configure and enable obfuscation rules in the `android/app/build.gradle` file of the project:

``` java
  android {
    ......    
    buildTypes {  
        release {  
            ......
            minifyEnabled true  
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'  
        } 
    }
}
```
  - Create a `proguard-rules.pro` file in the `android/app` directory of the project, and add the following code in the `proguard-rules.pro` file:

``` java
-keep class com.tencent.** { *; }
```
2. Configure to enable Multidex support in the `android/app/build.gradle` file of your project.

``` java
  android {  
    ......
    defaultConfig {
      ......
      multiDexEnabled true
    } 
}
```

【iOS】

Since TUICallKit uses iOS's audio and video features, you need to grant permissions for the use of the microphone and camera.

Authorization Operation Method: In your iOS project's `Info.plist`, under the first-level `<dict>` directory, add the following two items. They correspond to the system's prompt messages when asking for microphone and camera permissions.
``` java
<key>NSCameraUsageDescription</key>
<string>CallingApp needs to access your camera to capture video.</string>
<key>NSMicrophoneUsageDescription</key>
<string>CallingApp needs to access your microphone to capture audio.</string>
```

## Step 4: Set up navigatorObservers
1. In the Flutter application framework, add TUICallKit.navigatorObserver to navigatorObservers. For example, using the MaterialApp framework, the code is as follows:

   ``` java
   import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
   
    ......
   
   class XXX extends StatelessWidget {
     const XXX({super.key});
   
    @override
     Widget build(BuildContext context) {
       return MaterialApp(
         navigatorObservers: [TUICallKit.navigatorObserver],
         ......
       );
     }
   }
   ```

## Step 5: Log in to the TUICallKit Component

Use the [login](https://write.woa.com/document/114033067004104704) interface to complete the log-in. For specific usage, refer to the following code:
``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
import 'package:tencent_calls_uikit/debug/generate_test_user_sig.dart';
......

final String userID    = 'xxxxx'; // Please replace with your UserId
final int    sdkAppID  = 0;       // Please replace with the SDKAppID you got from the console in step 1
final String secretKey = 'xxxx';  // Please replace with the SecretKey you got from the console in step 1

void login() async {
    String userSig  = GenerateTestUserSig.genTestSig(userID, sdkAppID, secretKey);
    TUIResult result = await TUICallKit.instance.login(sdkAppID, userID, userSig);
    if (result.code.isEmpty) {
      print('Login success');
    } else {
      print('Login failed: ${result.code} ${result.message}');
    }
}
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Customers define their own User ID based on their business. You can only include letters (a-z, A-Z), digits (0-9), underscores, and hyphens.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppID</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >The unique identifier of the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >secretKey</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >SDKSecretKey for the audio and video application created in [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >A security protection signature used for user log in authentication to confirm the user's identity and prevent malicious attackers from stealing your cloud service usage rights.</td>
</tr>
</table>


> **Note:**
> 
> - **Development Environment**: If you are in the local development and debugging stage, you can use the local `GenerateTestUserSig.genTestSig` function to generate userSig. In this method, the SDKSecretKey is vulnerable to decompilation and reverse engineering, and once your key is leaked, attackers can steal your Tencent Cloud traffic.
> - **Production Environment**: If your project is going to be launched, please adopt the method of [Server-side Generation of UserSig](https://www.tencentcloud.com/document/product/647/35166?lang=en&pg=#how-do-i-calculate-.60usersig.60-in-a-production-environment.3F).


## Step 6. Make your first phone call

After both the caller and callee have successfully signed in, the caller can initiate an audio or video call by calling the TUICallKit's call method and specifying the call type and the callee's userId. At this point, the callee will receive an incoming call invitation.
``` java

import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void call() {
    List<String> userIdList = ['Android'];
    TUICallKit.instance.calls(userIdList, TUICallMediaType.audio);
}
```
<table>
<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/9a7977f7ec0f11ee896d5254005cb287.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/96d0cc00ec0f11eeb5dc525400aa857d.png)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >Caller</td>

<td rowspan="1" colSpan="1" >Callee</td>
</tr>
</table>


## Additional Features
- [Customize Interface](https://write.woa.com/document/119356800679190528)

- [Offline Push](https://write.woa.com/document/142911918280658944)

- [Group Call](https://write.woa.com/document/140196498678116352)

- [Floating Window](https://write.woa.com/document/140196506800930816)

- [Custom Ringtone](https://write.woa.com/document/140196510742061056)

- [Call Status Monitoring](https://write.woa.com/document/140196527978475520)

- [Cloud Recording](https://write.woa.com/document/95824491274473472)

- [Beauty Effects](https://write.woa.com/document/133965491956793344)


## FAQs

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://write.woa.com/document/121896145600688128).

## Suggestions and Feedback

If you have any suggestions or feedback, please contact info_rtc@tencent.com.

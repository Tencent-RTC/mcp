---
sync_node_id: '151791261335138304'
nav_path:
  - "直播与语聊 SDK"
  - "准备工作"
  - "准备工作（Flutter）"
product: "live"
---
## Feature Overview

**TUILiveKit** is a comprehensive live-streaming component. Once integrated, it allows you to quickly implement the following key functional modules for your Android application:

## **Preparations**

### Activate the Service

Before using **TUILiveKit**, please .

### **Environment Requirements**
- **Flutter** 

   - Flutter 3.27.4 or higher.

   - Dart 3.6.2 or higher.

- **Android**

   - Android 5.0 (SDK API Level 21) or later.

   - Gradle 7.0 or higher.

   - Android 5.0 or higher mobile devices.

   - Kotlin  2.1.0 or higher.

- **iOS**

   - Xcode 15 or later.

   - iOS 14.0 or later.

   - CocoaPods environment is installed. If not installed, [how to install CocoaPods](https://guides.cocoapods.org/using/getting-started.html).

## Code Integration

### **Step 1. Install** TUILiveKit

In the root directory of your project, run the following command to install [tencent_live_uikit](https://pub.dev/packages/tencent_live_uikit):
``` bash
flutter pub add tencent_live_uikit
```

After installation completes, you should see output similar to:
``` bash
Resolving dependencies... 
Downloading packages... 
......
+ tencent_live_uikit x.x.x
......
Changed xx dependencies!
xx packages have newer versions incompatible with dependency constraints.
Try `flutter pub outdated` for more information.
```

### Step 2. Project Configuration

【Android】
1. f you're building for Android, add certain SDK classes to the obfuscation exclusion list because the SDK uses Java reflection internally.

   - Configure and enable obfuscation rules in your project's `android/app/build.gradle` file:

``` java
  android {
    ......
    buildTypes {  
        release {  
            ......
            // configuration and activation obfuscation rule
            minifyEnabled true  
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'  
        } 
    }
}
```
   - Add the following code in the `android/app/proguard-rules.pro` file. If the file does not exist, create a new one:

``` java
-keep class com.tencent.** { *; }
```
2. Configure and enable Multidex support in your project's `android/app/build.gradle` file.

``` java
  android {  
    ......
    defaultConfig {
      ......
      // Enable Multidex support
      multiDexEnabled true
    } 
}
```
3. The system Picture-in-Picture feature needs to be enabled.

In the App main project's `AndroidManifest.xml`, set `MainActivity`'s `android:supportsPictureInPicture` to true:
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

4.Align plugin versions.

In android/app/settings.gradle, configure the plugin versions as follows:
``` json
plugins {
  id "dev.flutter.flutter-plugin-loader" version "1.0.0"
  id "com.android.application" version "8.2.1" apply false
  id "org.jetbrains.kotlin.android" version "2.1.10" apply false
}
```

【iOS】
1. For iOS release builds, configure symbol retention rules. In Xcode, select your app target (usually Runner) in TARGETS, go to **Project** > **Build Settings** > **Deployment**, and set **Strip Style** to `Non-Global Symbols`. This is required to avoid runtime errors and ensure you can enter the room.

2. (**Optional**) If you are debugging on an iOS simulator and your Mac uses an Intel chip, add the following code to your `ios/Podfile`:

``` ruby
target 'xxxx' do
  ......
end
......

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
      config.build_settings['VALID_ARCHS'] = 'arm64 arm64e x86_64'
      config.build_settings['VALID_ARCHS[sdk=iphonesimulator*]'] = 'x86_64'
    end
  end
end
```
3. TUILiveKit requires access to the microphone and camera. Request permissions by adding the following entries under the top-level `<dict>` in your iOS project’s `Info.plist`. These messages appear in the system permission dialogs:

``` java
<key>NSCameraUsageDescription</key>
<string>CallingApp needs camera access. Video recording with picture only after enabling</string>
<key>NSMicrophoneUsageDescription</key>
<string>CallingApp needs mic access. Recorded video will have sound when enabled</string>
```

    After updating `Info.plist`, add these preprocessor definitions in your `ios/Podfile` to enable camera and microphone permissions:
``` ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
      target.build_configurations.each do |config|
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
      '$(inherited)',
      'PERMISSION_MICROPHONE=1',
      'PERMISSION_CAMERA=1',
      ]
    end
  end
end
```
4. Enable Picture-in-Picture in your Xcode project settings:

### Step 3. Configure Navigation and Localization

To enable TUILiveKit to manage page navigation and support multiple languages, update your Flutter app as follows:
- Add `TUILiveKitNavigatorObserver.instance` to `navigatorObservers` to track route changes and manage lifecycle events.

- Add the required localization delegates to `localizationsDelegates` to display UI text in the appropriate system language.

   Take the **MaterialApp** framework as an example, the sample code is as follows:

   ``` java
   import 'package:tencent_live_uikit/tencent_live_uikit.dart';
   import 'package:atomic_x_core/atomicxcore.dart';
   import 'package:tuikit_atomic_x/atomicx.dart';
   
   // Your own APP main class
   
   class MyApp extends StatefulWidget {
     const MyApp({super.key});
   
     @override
     State<MyApp> createState() => _MyAppState();
   }
   
   class _MyAppState extends State<MyApp> {
     late final ThemeState _themeState;
   
     @override
     void initState() {
       super.initState();
       _themeState = ThemeState();
       _themeState.setThemeMode(ThemeType.dark);
     }
   
   
    @override
     Widget build(BuildContext context) {
       return ComponentTheme(
           themeState: _themeState,
           child: MaterialApp(
             // Add TUILiveKit navigator observer to listen for page routing changes and lifecycle management
             navigatorObservers: [TUILiveKitNavigatorObserver.instance],
             // Add localized agent to support multilingual copywriting display
             localizationsDelegates: [
               ...LiveKitLocalizations.localizationsDelegates,
               ...BarrageLocalizations.localizationsDelegates,
               ...GiftLocalizations.localizationsDelegates,
             ],
       
             // Other configuration of your APP
             //......
           ),
         );
     }
   }
   ```

   After configuration, the component will support multilingual and correctly handle page transitions.

## Complete Login

After integrating the code, call `LoginStore.shared.login` to authenticate. **This step is required before you can use any TUILiveKit features**. Make sure all parameters are set correctly.

> **Note:**
> In the example code, the login API is called directly. However, In real-world projects, always call TUILiveKit’s `login` after completing your own user authentication and login logic. This prevents business logic conflicts or data inconsistencies, and ensures TUILiveKit integrates smoothly with your user management and permission system.
> 

``` java
import 'package:atomic_x_core/atomicxcore.dart';
//......

login() async {
  final result = await LoginStore.shared.login(
    sdkAppID: 1400000001,     // replace with the SDKAppID from the open service console
    userID: 'denny',          // replace with your UserID
    userSig: 'xxxxxxxxxxx',   // you can calculate a UserSig in the console and fill it in this location
  );
  if (result.isSuccess) {
    debugPrint('LoginStore login success');
  } else {
    debugPrint('LoginStore login failed. code:${result.errorCode}, message:${result.errorMessage ?? ''}');
  }
}

```

**Login API Parameters**
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Int | Get this from <a href="https://console.trtc.io/app">Tencent RTC Console > My Application</a>. |
| UserID | String | The unique ID for the current user. Must contain only English letters, numbers, hyphens, and underscores. |
| UserSig | String | Authentication credential for TRTC. Please note:<br>- <strong>Development Environment</strong>: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a UserSig or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- <strong>Production Environment</strong>: To prevent key leakage, you must use a server-side method to generate UserSig. For details, see Generating UserSig on the Server.<br>For more information, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Handling Login Exceptions (Optional)

`LoginStore` offers login status callbacks to help you handle exceptions, including "**Kicked Offline**" and "**Signature Expired"**:
- **Kicked Offline**: If a user is kicked offline while logged in, the SDK triggers the onKickedOffline callback. Prompt the user in your UI and call LoginStore.shared.login to re-login.

- **Signature Expired:** If the onUserSigExpired callback is triggered, the user's userSig has expired. If their login state is still valid on your backend, request a new userSig and call LoginStore.shared.login to refresh their login.

   ``` java
   import 'dart:async';
   
   // YourLoginService handles your app's login logic
   
   class YourLoginService {
     late final StreamSubscription<LoginEvent> _loginEventSubscription;
   
     void subscribeLoginStatus() {
       _loginEventSubscription = LoginStore.shared.loginEventStream.listen((loginEvent) {
         switch (loginEvent) {
           case LoginEvent.kickedOffline: // User was kicked offline
             // Handle: prompt user in UI, then re-login
             break;
           case LoginEvent.loginExpired: // UserSig expired
             // Handle: if backend login is valid, request new userSig and re-login
             break;
           default:
             break;
         }
       });
     }
   
     void unsubscribeLoginStatus() {
       _loginEventSubscription.cancel();
     }
   }
   ```

## Next Steps

Congratulations! You have successfully integrated the **TUILiveKit** component and completed the login. You can now implement features such as **host streaming**, **audience viewing**, and **live stream list**. Please
| <strong>Feature</strong> | <strong>Description</strong> | <strong>Integration Guide</strong> |
| --- | --- | --- |
| <strong>Host Streaming</strong> | The complete workflow for a host to start a stream, including pre-stream setup and various in-stream interactions. | Host Streaming |
| <strong>Audience Viewing</strong> | Audience can watch live streaming after entering the anchor's live streaming room, with features like audience mic connection, live room information, online audience, and bullet screen display. | Audience Viewing |
| <strong>Live Stream List</strong> | Display the live stream list interface and features, including the live stream list and room information display. | Live Stream List |

## FAQs

### Repeated Login

You do not need to log in each time you enter a room. Typically, a single call to `LoginStore.shared.login` is sufficient. We recommend aligning `LoginStore.shared.login` and `LoginStore.shared.logout` with your own authentication logic.

### Running or Unable to Enter Room after Packaging in iOS Release?

In Xcode, select your application target (usually Runner) from the TARGETS list, choose **Item** > **Build Settings** > **Deployment**, and set **Strip Style** to `Non-Global Symbols` to preserve the necessary global symbol information. Otherwise, runtime exceptions may prevent you from entering the room.

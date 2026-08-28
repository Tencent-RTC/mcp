## 1. Integrate `tencent_calls_uikit` and `tencent_trtc_cloud` at the same time, or integrate `tencent_calls_uikit` and `live_flutter_plugin` at the same time, and the symbol conflict will occur, how to solve it?

Detials: When introducing flutter ''tencent_calls_uikit'' into our existing project, Android builds APK with the following error:
``` plaintext
Duplicate class com.tencent.liteav.LiveSettingJni found in modules jetified-LiteAVSDK_Professional-10.7.0.13053-runtime
(com.tencent.liteav:LiteAVSDK_Professional:10.7.0.13053) and jetified-LiteAVSDK_TRTC-10.3.0.11225-runtime
(com.tencent.liteav:LiteAVSDK_TRTC:10.3.0.11225)
```

The following error occurs when `pod install` is executed on iOS:
``` plaintext
[!] The 'Pods-Runner' target has frameworks with conflicting names: txsoundtouch.xcframework and txffmpeg.xcframework.
```

The issue arises because you are using  tencent_calls_uikit  and  tencent_trtc_cloud  which depend on the Pro and Lite versions of  TRTC Android SDK , respectively. We have resolved this issue in the latest version. You just need to upgrade  [tencent_calls_uikit](https://pub.dev/packages/tencent_calls_uikit)  and  [tencent_trtc_cloud](https://pub.dev/packages/tencent_trtc_cloud) to the latest version.

## 2. Flutter Android does not add confusion Settings, how to set?

If you need to compile and run on the Android platform, because we use the reflection feature of Java inside the SDK, we need to add some classes in the SDK to the list of non-obviation, so you need to add the following code in the proguard-rules.pro file:
``` plaintext
-keep class com.tencent.** { *; }
```

## 3. How can I fix a compilation error or page failure caused by an upgrade from a version earlier than 1.8.0 to 1.8.0 or later?

If you are upgrading from 1.8.0 or below to 1.8.0 or above, you need to check that the following steps are normal:
1. Add `navigatorObservers` to `MateriaApp`. The purpose is to navigate to the TUICallKit page when you receive a call invitation. Example code is as follows:

   ``` plaintext
   import 'package:tencent_calls_uikit/tuicall_kit.dart';

   MaterialApp（
        navigatorObservers：[TUICallKit.navigatorObserver]，
        ...
   ）
   ```
2. `tencent_calls_engine` Import files in plug-ins are uniformly replaced with new ones.

   ``` plaintext
   import 'package:tencent_calls_engine/tuicall_engine.dart';
   import 'package:tencent_calls_engine/tuicall_observer.dart';
   import 'package:tencent_calls_engine/tuicall_define.dart';
   ```

   The above code block content is replaced with the following:

   ``` plaintext
   import 'package:tencent_calls_engine/tencent_calls_engine.dart';
   ```
3. The login API adjustment is more standardized and no parameters need to be specified.

4. Optimization of offline push parameter construction.

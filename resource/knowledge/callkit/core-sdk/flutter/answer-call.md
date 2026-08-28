This document will guide you through integrating the **AtomicXCore SDK** components: **DeviceStore**, **CallStore**, and the core widget **CallCoreView** to quickly implement call answering functionality.

## Core Features

To build multi-party audio/video call scenarios with **AtomicXCore**, use these three core modules:

|Module|Description|
|---------|---------|
|[CallCoreView](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreView-class.html)|Core call view widget. Automatically listens to CallStore data and renders the call UI, with automatic layout switching for 1-on-1 and group calls.|
|[CallStore](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallStore-class.html)|Manages the call lifecycle, including dialing, answering, rejecting, and hanging up. Provides real-time participant audio/video status, call duration, call history, and other data.|
|[DeviceStore](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_device_device_store/DeviceStore-class.html)|Controls audio/video devices: microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, and real-time device status monitoring.|

## Getting Started

### Step 1: Activate the Service

Visit Activate the Service to obtain either a trial or paid version of the SDK.

### Step 2: Integrate the SDK

**Install the package:** In your project root, run:
``` bash
flutter pub add atomic_x_core
```

### Step 3: Initialization and Login

#### Android Configuration
1. Because the SDK uses Java reflection internally, you must add certain SDK classes to your Proguard keep list.

  - Edit your project's `build.gradle.kts` (or `build.gradle`) in the `android/app/` directory to enable Proguard rules:

      ``` java
      android {
          buildTypes {
              release {
                  isMinifyEnabled = true
                  proguardFiles(
                      getDefaultProguardFile("proguard-android.txt"),
                      "proguard-rules.pro"
                  )
              }
          }
      }
      ```

      ``` java
      android {
          buildTypes {
              release {
                  minifyEnabled true
                  proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
              }
          }
      }
      ```
  - Create a `proguard-rules.pro` file in your `android/app` directory and add:

      ``` java
      -keep class com.tencent.** { *; }
      ```
2. (Optional) To use CallKit's floating window feature outside the app, enable system Picture-in-Picture.

   In your `AndroidManifest.xml`, set `android:supportsPictureInPicture="true"` for `MainActivity`:

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

#### iOS Configuration

Since tencent_rtc_sdk uses Flutter FFI, Xcode's symbol stripping during Release builds may remove TRTC C symbols, causing `symbol not found` errors. To fix:
1. In Xcode Build Settings, set **Deployment Postprocessing** to **Yes**.

2. Set **Strip Style** for Release to **Non-Global Symbols**.

#### Initialize and Log in

To start the call service, initialize `CallStore` and log in the user. On successful login, `CallStore` will sync user info and enter the ready state. See the flowchart and sample code below:

``` java
import 'package:atomic_x_core/atomicxcore.dart';
import 'package:rtc_room_engine/api/call/tui_call_engine.dart';

Future<void> _login() async {
  int sdkAppId = 1400000001;        // Replace with your SDKAppID
  String userId = 'test_001';       // Replace with your UserID
  String userSig = 'xxxxxxxxxxx';   // Replace with your UserSig

  CallStore.shared;
  final result = await LoginStore.shared.login(sdkAppId, userId, userSig);
  TUICallEngine.instance.init(sdkAppId, userId, userSig);
  if (result.isSuccess) {
    // Login successful
    debugPrint('login success');
  } else {
    // Login failed
    debugPrint('login failed, code: ${result.code}, message: ${result.message}');
  }
}
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | Unique ID for the current user. Only letters, numbers, hyphens, and underscores are allowed. To prevent conflicts with multi-device login, avoid using simple IDs like <code>1</code> or <code>123</code>. |
| sdkAppId | int | Obtain from the <a href="https://trtc.io/login?fro=gt&s_url=https%3A%2F%2Fconsole.trtc.io%2F">console</a>. Usually a 10-digit integer starting with 140 or 160. |
| userSig | String | Authentication token for TRTC.<br>- <strong>Development</strong>: Generate userSig locally using <a href="https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/call/example/lib/debug/generate_test_user_sig.dart">GenerateTestUserSig.genTestUserSig</a> or via the <a href="https://console.trtc.io/usersig">UserSig Tool</a> for temporary userSig.<br>- <strong>Production</strong>: Always generate userSig server-side to prevent secret key leakage. See Server-side UserSig Generation.<br>For details, refer to How to calculate and use UserSig. |

## Implement Call Answering

**You must be logged in before you can answer a call.** Follow these six steps to implement the call answering feature.

### Step 1: Create the Call Page

Create a call page that is shown when an incoming call arrives.
1. **Create the call page:** Implement a `StatefulWidget` to host the call page and manage navigation for incoming calls.

2. **Add CallCoreView widget to the call page:** The core call UI requires a controller and automatically listens to **CallStore** data. It will render the UI and adapt layouts for both 1-on-1 and group calls.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   // 1. Create Call Page Widget
   class CallPage extends StatefulWidget {
     const CallPage({super.key});

     @override
     State<CallPage> createState() => _CallPageState();
   }

   class _CallPageState extends State<CallPage> {
     late CallCoreController controller;

     @override
     void initState() {
       super.initState();
       controller = CallCoreController.create();
     }

     @override
     Widget build(BuildContext context) {
       // 2. Add CallCoreView widget to Call Page
       return CallCoreView(controller: controller);
     }
   }
   ```

   **CallCoreView Widget Feature Overview:**

   |Feature|Description|Reference Doc|
   |---------|---------|---------|
   |Set Layout Mode|Supports flexible layout mode switching. If unset, layout automatically adapts based on participant count.|Switch Layout Mode|
   |Set Avatar|Supports custom avatars for specific users via resource path.|Customize Default Avatar|
   |Set Volume Indicator Icon|Supports custom volume indicator icons for different volume levels.|Customize Volume Indicator Icon|
   |Set Network Indicator Icon|Supports real-time network quality indicator icons.|Customize Network Indicator Icon|
   |Set Waiting Animation for Pending Users|In group calls, supports GIF animation for users in waiting state.|Customize Loading Animation|

### Step 2: Add Answer and Reject Buttons

Use the APIs from [DeviceStore](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_device_device_store/DeviceStore-class.html) and [CallStore](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallStore-class.html) to customize your buttons.
- **DeviceStore Overview:** Microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, and real-time device monitoring. Bind method calls to button taps and listen for device state changes to update button UI dynamically.

- **CallStore Overview:** Core call controls (answer, hang up, reject). Bind method calls to button taps and listen for call state changes to sync button display with call status.

- **Icon Resource Download:** Button icons are available on [GitHub](https://github.com/iveshzf/TUIKit_Flutter/tree/main/call/assets/images). These icons are custom-designed for TUICallKit and are free to use.

   |Icons:|||||||||
   |---------|---------|---------|---------|---------|---------|---------|---------|---------|

1. **Add Answer and Reject Buttons:** Create a button bar at the bottom and add "Answer" and "Reject" buttons. Bind their tap events to the [accept](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallStore/accept.html) and [reject](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallStore/reject.html) methods.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   // Answer and Reject Buttons Widget
   class AcceptRejectButtons extends StatelessWidget {
     const AcceptRejectButtons({super.key});

     @override
     Widget build(BuildContext context) {
       return Row(
         children: [
           // Answer Button
           _buildAcceptButton(),
           // Reject Button
           _buildRejectButton(),
         ],
       );
     }

     // Answer Button
     Widget _buildAcceptButton() {
       return GestureDetector(
         onTap: () {
           // Call accept API to answer the call
           CallStore.shared.accept();
         },
         child: Container(
           width: 60,
           height: 60,
           decoration: const BoxDecoration(
             color: Colors.green,
             shape: BoxShape.circle,
           ),
           child: const Icon(
             Icons.call,
             color: Colors.white,
             size: 30,
           ),
         ),
       );
     }

     // Reject Button
     Widget _buildRejectButton() {
       return GestureDetector(
         onTap: () {
           // Call reject API to reject the call
           CallStore.shared.reject();
         },
         child: Container(
           width: 60,
           height: 60,
           decoration: const BoxDecoration(
             color: Colors.red,
             shape: BoxShape.circle,
           ),
           child: const Icon(
             Icons.call_end,
             color: Colors.white,
             size: 30,
           ),
         ),
       );
     }
   }
   ```
2. **Destroy the UI when the caller cancels or the callee rejects:** When the caller cancels the call or the callee rejects, the [onCallEnded](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallEventListener/onCallEnded.html) event fires. Listen for this event and close the call UI when the call ends.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';
   import 'package:flutter/cupertino.dart';

   void addListener() {
     CallEventListener listener = CallEventListener(
       onCallEnded: (callId, mediaType, reason, userId) {
         Navigator.of(context).pop();
       }
     );
     CallStore.shared.addListener(listener);
   }
   ```

   **onCallEnded Event Parameter Details:**

| Parameter | Type | Description |
| --- | --- | --- |
| callId | String | Unique identifier for this call. |
| mediaType | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallMediaType.html">CallMediaType</a> | Type of call, either audio or video.<br>- <code>CallMediaType.video</code>: Video call.<br>- <code>CallMediaType.audio</code>: Audio call. |
| reason | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallEndReason.html">CallEndReason</a> | Reason for call ending.<br>- <code>unknown</code>: Unknown.<br>- <code>hangup</code>: User hung up.<br>- <code>reject</code>: Callee rejected.<br>- <code>noResponse</code>: Callee did not answer in time.<br>- <code>offline</code>: Callee offline.<br>- <code>lineBusy</code>: Callee busy.<br>- <code>canceled</code>: Caller canceled before callee answered.<br>- <code>otherDeviceAccepted</code>: Answered on another device.<br>- <code>otherDeviceReject</code>: Rejected on another device.<br>- <code>endByServer</code>: Ended by server. |
| userId | String | User ID responsible for ending the call. |

### Step 3: Request Microphone and Camera Permissions

Check audio/video permissions before starting a call. If permissions are missing, prompt the user to grant them.
1. **Android Permission Declaration:**

   Declare microphone and camera permissions in your `AndroidManifest.xml`:

   ``` xml
   <manifest xmlns:android="http://schemas.android.com/apk/res/android">
       <!-- Microphone permission -->
       <uses-permission android:name="android.permission.RECORD_AUDIO" />
       <!-- Camera permission -->
       <uses-permission android:name="android.permission.CAMERA" />
   </manifest>
   ```
2. **iOS Permission Declaration:**

   Add these entries to your iOS project's `Info.plist`:

   ``` xml
   <key>NSCameraUsageDescription</key>
   <string>CallingApp needs access to your camera to record video with visuals</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>CallingApp needs access to your microphone to record video with audio</string>
   ```
3. **Request Permissions Dynamically:** We recommend using the `permission_handler` plugin for runtime permission requests.

   ``` bash
   flutter pub add permission_handler
   ```

   ``` java
   import 'package:permission_handler/permission_handler.dart';

   // Request audio/video permissions
   Future<bool> requestCallPermissions() async {
     // Request microphone and camera permissions
     Map<Permission, PermissionStatus> statuses = await [
       Permission.microphone,
       Permission.camera,
     ].request();

     // Check permission status
     bool micGranted = statuses[Permission.microphone]?.isGranted ?? false;
     bool cameraGranted = statuses[Permission.camera]?.isGranted ?? false;

     if (micGranted && cameraGranted) {
       // Permissions granted
       return true;
     } else {
       // Some permissions denied, prompt user to enable
       return false;
     }
   }
   ```

### Step 4: Handle Incoming Call Notifications

Listen to the current user's call status and play a ringtone or vibrate on incoming calls. Stop notifications after the call is answered or hung up.
1. **Data Layer Subscription:** Subscribe to `CallStore.shared.state.selfInfo` to reactively track the logged-in user's info.

2. **Play or Stop Notifications:** If `selfInfo.status` is `CallParticipantStatus.waiting`, play ringtone/vibration; if `CallParticipantStatus.accept`, stop the notification.

   ``` java
   CallStore.shared.state.selfInfo.addListener(() {
     CallParticipantInfo info = CallStore.shared.state.selfInfo.value;
     if (info.status == CallParticipantStatus.accept || info.status == CallParticipantStatus.none) {
       // Stop ringtone
       return;
     }
     if (info.status == CallParticipantStatus.waiting) {
       // Play ringtone
     }
   });
   ```

### Step 5: Open Media Devices for Incoming Calls

When an incoming call arrives, get the media type from [onCallReceived](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallEventListener/onCallReceived.html). For a smoother experience, pre-open relevant media devices when showing the call UI.
1. **Listen to Incoming Call Event:** Subscribe to the `onCallReceived` event.

2. **Open Devices According to Media Type:** For audio calls, open only the microphone; for video calls, open both microphone and camera.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';

   CallEventListener? callListener;

   void initCallListener() {
     // 1. Listen for incoming call event
     callListener = CallEventListener(
       onCallReceived: (callId, mediaType, userData) {
         // 2. Open devices based on media type
         openDeviceForMediaType(mediaType);
       },
     );
     if (callListener != null) {
       CallStore.shared.addListener(callListener!);
     }
   }

   void openDeviceForMediaType(CallMediaType? mediaType) {
     if (mediaType == null) return;
     DeviceStore.shared.openLocalMicrophone();
     if (mediaType == CallMediaType.video) {
       final isFrontCamera = DeviceStore.shared.state.isFrontCamera.value;
       DeviceStore.shared.openLocalCamera(isFrontCamera);
     }
   }
   ```

   **onCallReceived Event Details:**

| Parameter | Type | Description |
| --- | --- | --- |
| callId | String | Unique identifier for this call. |
| mediaType | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallMediaType.html">CallMediaType</a> | Call type: audio or video.<br>- <code>CallMediaType.video</code>: Video call.<br>- <code>CallMediaType.audio</code>: Audio call. |

   **openLocalCamera API Parameter Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| isFront | bool | Yes | Whether to open the front camera:<br>- <code>true</code>: Open front camera.<br>- <code>false</code>: Open rear camera. |
| completion | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_define/CompletionHandler-class.html">CompletionHandler</a> | No | Completion callback for camera open result. Returns error code and message if opening fails. |

   **openLocalMicrophone API Parameter Details:**

   |Parameter Name|Type|Required|Description|
   |---------|---------|---------|---------|
   |completion|[CompletionHandler](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_define/CompletionHandler-class.html)|No|Completion callback for microphone open result. Returns error code and message if opening fails.|

### Step 6: Launch Call UI on Incoming Call

After subscribing to the [onCallReceived](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallEventListener/onCallReceived.html) event, launch the call page:
``` java
import 'package:atomic_x_core/atomicxcore.dart';
import 'package:flutter/material.dart';

CallEventListener? callListener;

void addListener(BuildContext context) {
  callListener = CallEventListener(
    onCallReceived: (callId, mediaType, userData) {
      // Launch call page (using Navigator)
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const CallPage()),
      );
    },
  );
  if (callListener != null) {
    CallStore.shared.addListener(callListener!);
  }
}
```

### Demo Result

Once you complete these six steps, your "answer a call" feature will look like this:

## Integrate Offline Push

To receive call invitations while offline, follow the instructions in Integrate Offline Push.

## Customize the UI

**CallCoreView** supports extensive UI customization. You can freely replace avatar and volume indicator icons. For fast integration, download these icons from [GitHub](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/atomic-x/call_assets). All icons are custom-designed for TUICallKit and are copyright-free.

### Custom Volume Indicator Icons

Use the [volumeIcons](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreView/volumeIcons.html) parameter in **CallCoreView** to set icons for various volume levels.

- **Sample Code:**

   ``` java
   Widget _buildCallCoreView()  {
     Map<VolumeLevel, Image> volumeIcons = {
       VolumeLevel.mute  : Image.asset(''), // Icon for each volume level
     };
     return CallCoreView(
       controller: CallCoreController.create(),
       volumeIcons: volumeIcons,
     );
   }
   ```
- **volumeIcons Parameter Details:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| volumeIcons | Map | No | Maps volume levels to icon resources.<br>VolumeLevel keys:<br>- <code>VolumeLevel.mute</code>: Microphone muted.<br>- <code>VolumeLevel.low</code>: Volume (0-25]<br>- <code>VolumeLevel.medium</code>: Volume (25-50]<br>- <code>VolumeLevel.high</code>: Volume (50-75]<br>- <code>VolumeLevel.peak</code>: Volume (75-100].<br>Image values: Icon for each level. |

- **Volume Indicator Icons:**

   |Icon|Description|
   |---------|---------|
   ||Volume indicator icon.Recommended for `VolumeLevel.low` or `VolumeLevel.medium`. Display when user volume exceeds this level.|
   ||Mute icon.Recommended for `VolumeLevel.mute`. Display when user is muted.|

### Custom Network Indicator Icons

Use the [networkQualityIcons](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreView/networkQualityIcons.html) parameter to set icons for different network states.

- **Sample Code:**

   ``` java
   Widget _buildCallCoreView()  {
     Map<NetworkQuality, Image> networkQualityIcons = {
       NetworkQuality.bad : Image.asset(''), // Icon for each network quality level
     };
     return CallCoreView(
       controller: CallCoreController.create(),
       networkQualityIcons: networkQualityIcons,
     );
   }
   ```
- **networkQualityIcons Parameter Details:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| networkQualityIcons | Map | No | Maps network quality levels to icon resources.<br>NetworkQuality keys:<br>- <code>NetworkQuality.unknown</code>: Unknown.<br>- <code>NetworkQuality.excellent</code>: Excellent.<br>- <code>NetworkQuality.good</code>: Good.<br>- <code>NetworkQuality.poor</code>: Poor.<br>- <code>NetworkQuality.bad</code>: Bad.<br>- <code>NetworkQuality.veryBad</code>: Very bad.<br>- <code>NetworkQuality.down</code>: Disconnected.<br>Image values: Icon for each state. \\| |

- **Poor Network Indicator Icon:**

   |Icon|Description|
   |---------|---------|
   ||Poor network indicator. Recommended for `NetworkQuality.bad`, `NetworkQuality.veryBad`, or `NetworkQuality.down`. Display when connection is poor. |

### Custom Default Avatar

Use the [defaultAvatar](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreView/defaultAvatar.html) parameter to set a default avatar for users. Listen to [allParticipants](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallState/allParticipants.html) for participant avatars. If unavailable or loading fails, show the default avatar.
- **Sample Code:**

   ``` java
   Widget _buildCallCoreView()  {
     Image defaultAvatarImage = Image.asset(''); // Default user avatar image
     return CallCoreView(
       controller: CallCoreController.create(),
       defaultAvatar: defaultAvatarImage,
     );
   }
   ```
- **defaultAvatar Parameter Details:**

   |Parameter|Type|Required|Description|
   |---------|---------|---------|---------|
   |defaultAvatar|Image|No|Default user avatar.|

- **Default Avatar Resource:**

   |Icon|Description|
   |---------|---------|
   ||Default avatar.Recommended when loading fails or no avatar is set.|

### Custom Loading Animation

Use the [loadingAnimation](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreView/loadingAnimation.html) parameter to set a waiting animation for users in pending state.

- **Sample Code:**

   ``` java
   Widget _buildCallCoreView()  {
     Image loading = Image.asset(''); // Default loading animation resource
     return CallCoreView(
       controller: CallCoreController.create(),
       loadingAnimation: loading,
     );
   }
   ```
- **loadingAnimation Parameter Details:**

   |Parameter|Type|Required|Description|
   |---------|---------|---------|---------|
   |loadingAnimation|Image|No|GIF image resource.|

- **Waiting Animation:**

   |Icon|Description|
   |---------|---------|
   ||Waiting animation for users.Recommended for group calls; display when user status is waiting.|

### Add Call Duration Indicator

Call duration updates in real time via [activeCall](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallState/activeCall.html) `duration`. To display call duration:
1. **Subscribe to Data:** Listen to `CallStore.shared.state.activeCall` for the current active call.

2. **Bind Call Duration:** Bind the `activeCall.duration` field to a UI widget. This is reactive and auto-updates the UI—no manual timer needed.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';
   import 'package:flutter/material.dart';

   class TimerWidget extends StatelessWidget {
     final double? fontSize;
     final FontWeight? fontWeight;

     const TimerWidget({
       super.key,
       this.fontSize,
       this.fontWeight,
     });

     @override
     Widget build(BuildContext context) {
       return ValueListenableBuilder(
           valueListenable: CallStore.shared.state.selfInfo,
           builder: (context, info, child) {
             if (info.status == CallParticipantStatus.accept) {
               return ValueListenableBuilder(
                 valueListenable: CallStore.shared.state.activeCall,
                 builder: (context, activeCall, child) {
                   return Text(
                     formatDuration(activeCall.duration.toInt()),
                     style: TextStyle(
                       fontSize: fontSize,
                       fontWeight: fontWeight,
                     ),
                   );
                 },
               );
             } else {
               return Container();
             }
           }
       );
     }

     String formatDuration(int timeCount) {
       int hour = timeCount ~/ 3600;
       int minute = (timeCount % 3600) ~/ 60;
       String minuteShow = minute <= 9 ? "0$minute" : "$minute";
       int second = timeCount % 60;
       String secondShow = second <= 9 ? "0$second" : "$second";

       if (hour > 0) {
         String hourShow = hour <= 9 ? "0$hour" : "$hour";
         return '$hourShow:$minuteShow:$secondShow';
       } else {
         return '$minuteShow:$secondShow';
       }
     }

   }
   ```

   > **Note:**
   >
   > For more reactive call state data, see [CallState](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallState-class.html).
   >

## More Features

### Set Avatar and Nickname

Before the call starts, use [setSelfInfo](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_login_login_store/LoginStore/setSelfInfo.html) to set your nickname and avatar.
- **Sample Code:**

   ``` java
   UserProfile profile = UserProfile(
     userID: "", // Your UserId
     avatarURL: "", // Avatar URL
     nickname: "", // Nickname to set
   );
   CompletionHandler result = await LoginStore.shared.setSelfInfo(userInfo: profile);
   if (result.errorCode == 0) {
     print("setSelfInfo success");
   } else {
     print("setSelfInfo failed");
   }
   ```
- **setSelfInfo API Parameter Details:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| userProfile | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_login_login_store/UserProfile-class.html">UserProfile</a> | Yes | User info struct:<br>- <code>userID</code> (String): User ID.<br>- <code>avatarURL</code> (String): Avatar URL.<br>- <code>nickname</code> (String): Nickname.<br>See <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_login_login_store/UserProfile-class.html">UserProfile</a> for more fields. |
| completion | CompletionHandler | No | Completion callback for result. |

### Switch Layout Modes

Use [setLayoutTemplate](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallCoreController/setLayoutTemplate.html) for flexible layout switching. If unset, **CallCoreView** adapts automatically: 1-on-1 calls use `Float` mode, group calls use `Grid` mode.
| - <strong>Layout:</strong> Full screen self-view while waiting; after connecting, full screen remote view with self-view as a floating window.<br>- <strong>Interaction:</strong> Floating window supports drag and click-to-swap with the main view. | - <strong>Layout:</strong> Grid layout for all participants, suitable for 2+ users. Supports click-to-enlarge.<br>- <strong>Interaction:</strong> Click any participant's view to enlarge. | - <strong>Layout:</strong> 1v1 shows fixed remote view; multi-party uses active speaker strategy with full screen for the current speaker.<br>- <strong>Interaction:</strong> Waiting state shows self-view; after connecting, call duration is displayed. |

- **Sample Code:**

   ``` java
   CallCoreController controller = CallCoreController.create();
   CallLayoutTemplate template = CallLayoutTemplate.float;
   controller.setLayoutTemplate(template);
   ```
- **setLayoutTemplate API Parameter Details:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| template | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_view_call_call_core_view/CallLayoutTemplate.html">CallLayoutTemplate</a> | Yes | Layout mode for CallCoreView:<br>- <code>CallLayoutTemplate.float</code>: Full-screen self-view while waiting, full-screen remote after answering, self-view floating window.<br>- <code>CallLayoutTemplate.grid</code>: Grid layout for all participants, tap to enlarge.<br>- <code>CallLayoutTemplate.pip</code>: 1-on-1 always shows remote; group calls auto-fullscreen active speaker. |

### Set Default Call Timeout

When making a call via [calls](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallStore/calls.html), specify the timeout using [CallParams](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallParams-class.html) `timeout`.
``` java
void startCall(List<String> userIdList, CallMediaType mediaType) {
  CallParams params = CallParams(
    timeout: 30, // Set call waiting timeout
  );

  CallStore.shared.calls(userIdList, mediaType, params);
}
```

**calls API Parameter Details:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| userIdList | List | Yes | List of target user IDs. |
| mediaType | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallMediaType.html">CallMediaType</a> | Yes | Call type: audio or video.<br>- <code>CallMediaType.video</code>: Video call.<br>- <code>CallMediaType.audio</code>: Audio call. |
| params | <a href="https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/flutter/v1.0/en/api_call_call_store/CallParams-class.html">CallParams</a> | No | Call extension parameters:<br>- <code>roomId</code> (String): Room ID (optional, auto-assigned if unset).<br>- <code>timeout</code> (int): Call timeout in seconds.<br>- <code>userData</code> (String): Custom data.<br>- <code>chatGroupId</code> (String): Chat group ID for group calls.<br>- <code>isEphemeralCall</code> (bool): Encrypted call (no call record). |

### Implement In-App Floating Window

If the call UI is covered (e.g., user navigates away), create a draggable floating window in the app. This window should show key call status (such as duration and remote info) and allow users to quickly return to the full call UI, enhancing multitasking.
``` java
_buildPipWindowWidget() {
  final pipWidth = MediaQuery.of(context).size.width;
  final pipHeight = MediaQuery.of(context).size.height;
  final scale = pipWidth / originWidth;
  CallCoreController controller = CallCoreController.create();
  controller.setLayoutTemplate(CallLayoutTemplate.pip);
  return Scaffold(
    body: SizedBox(
      width: pipWidth,
      height: pipHeight,
      child: Container(
        width: pipWidth,
        height: pipHeight,
        decoration: const BoxDecoration(color: Colors.transparent),
        child: MediaQuery(
            data: MediaQuery.of(context).copyWith(
                size: Size(originWidth ?? pipWidth, originHeight ?? pipHeight)
            ),
            child: ClipRect(
              child: Transform.scale(
                scale: scale,
                alignment: Alignment.center,
                child: OverflowBox(
                  maxWidth: originWidth,
                  maxHeight: originHeight,
                  alignment: Alignment.center,
                  child: CallCoreView(
                    controller: controller,
                  ),
                ),
              ),
            ),
        ),
      ),
    ),
  );
}
```

### Implement Android Picture-in-Picture Outside App

Picture-in-Picture requires Android 8.0 (API 26) or later.
1. **MainActivity Configuration**

   Listen for the MainActivity lifecycle. When `enablePictureInPicture` is true, automatically enter PiP when the app goes to background.

   ``` java
   import android.app.PictureInPictureParams
   import android.content.pm.PackageManager
   import android.os.Build
   import android.util.Log
   import android.util.Rational
   import io.flutter.embedding.android.FlutterActivity
   import io.flutter.embedding.engine.FlutterEngine
   import io.flutter.plugin.common.MethodChannel

   class MainActivity : FlutterActivity() {
       companion object {
           private const val TAG = "MainActivity"
           private const val CHANNEL = "atomic_x/pip"
       }

       private var enablePictureInPicture = false

       override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
           super.configureFlutterEngine(flutterEngine)

           MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
               when (call.method) {
                   "enablePictureInPicture" -> {
                       val enable = call.argument<Boolean>("enable") ?: false
                       val success = enablePIP(enable)
                       result.success(success)
                   }
                   "enterPictureInPicture" -> {
                       val success = enterPIP()
                       result.success(success)
                   }
                   else -> result.notImplemented()
               }
           }
       }

       override fun onUserLeaveHint() {
           super.onUserLeaveHint()
           // Automatically enter PiP when user presses Home
           if (enablePictureInPicture) {
               enterPIP()
           }
       }

       private fun enablePIP(enable: Boolean): Boolean {
           Log.i(TAG, "enablePictureInPicture: $enable")
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
               packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)) {
               enablePictureInPicture = enable
               return true
           }
           return false
       }

       private fun enterPIP(): Boolean {
           if (!enablePictureInPicture) return false

           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               try {
                   val aspectRatio = Rational(9, 16)
                   val params = PictureInPictureParams.Builder()
                       .setAspectRatio(aspectRatio)
                       .build()
                   return enterPictureInPictureMode(params)
               } catch (e: Exception) {
                   Log.e(TAG, "enterPIP failed: ${e.message}")
               }
           }
           return false
       }
   }
   ```
2. **AndroidManifest Configuration**

   Add PiP support to MainActivity:

   ``` xml
   <activity
       android:name=".MainActivity"
       android:exported="true"
       android:launchMode="singleTop"
       android:taskAffinity=""
       android:theme="@style/LaunchTheme"
       android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
       android:hardwareAccelerated="true"
       android:windowSoftInputMode="adjustResize"
       android:supportsPictureInPicture="true">
       <meta-data
         android:name="io.flutter.embedding.android.NormalTheme"
         android:resource="@style/NormalTheme"
         />
       <intent-filter>
           <action android:name="android.intent.action.MAIN"/>
           <category android:name="android.intent.category.LAUNCHER"/>
       </intent-filter>
   </activity>
   ```
3. **Dart Layer Configuration**

   ``` java
   import 'package:flutter/services.dart';

   class PipManager {
     static const MethodChannel _channel = MethodChannel('atomic_x/pip');

     /// Enable/disable PiP
     static Future<bool> enablePictureInPicture(bool enable) async {
       try {
         final result = await _channel.invokeMethod<bool>('enablePictureInPicture', {'enable': enable});
         return result ?? false;
       } catch (e) {
         return false;
       }
     }

     /// Enter PiP mode immediately
     static Future<bool> enterPictureInPicture() async {
       try {
         final result = await _channel.invokeMethod<bool>('enterPictureInPicture');
         return result ?? false;
       } catch (e) {
         return false;
       }
     }
   }
   ```

   Enable PiP before the call starts; disable PiP after the call ends.

### Implement iOS Picture-in-Picture Outside App

iOS supports system PiP with the underlying TRTC engine. When the app goes to background, the call view floats above other apps as a PiP window, letting users multitask.

> **Note:**
> Add `Background Modes` in Xcode's `Signing & Capabilities` and check `Audio, AirPlay, and Picture in Picture`.
>
> Requires iOS 15.0 or later.
>

1. **Enable PiP**

   ``` java
   import 'package:tencent_rtc_sdk/trtc_cloud.dart';

   TRTCCloud.sharedInstance().then((trtcCloud) {
     trtcCloud.callExperimentalAPI('''
     {
       "api": "configPictureInPicture",
       "params": {
         "enable": true,
         "cameraBackgroundCapture": true,
         "canvas": {
           "width": 720,
           "height": 1280,
           "backgroundColor": "#111111"
         },
         "regions": [
           {
             "userId": "remoteUserId",
             "userName": "",
             "width": 1.0,
             "height": 1.0,
             "x": 0.0,
             "y": 0.0,
             "fillMode": 0,
             "streamType": "high",
             "backgroundColor": "#111111",
             "backgroundImage": "file:///path/to/avatar.png"
           },
           {
             "userId": "localUserId",
             "userName": "",
             "width": 0.333,
             "height": 0.333,
             "x": 0.65,
             "y": 0.05,
             "fillMode": 0,
             "streamType": "high",
             "backgroundColor": "#111111"
           }
         ]
       }
     }
     ''');
   });
   ```
2. **Disable PiP**

   ``` java
   import 'package:tencent_rtc_sdk/trtc_cloud.dart';

   TRTCCloud.sharedInstance().then((trtcCloud) {
     trtcCloud.callExperimentalAPI('''
     {
       "api": "configPictureInPicture",
       "params": {
         "enable": false
       }
     }
     ''');
   });
   ```

### Enable Background Audio/Video Capture

To ensure your app can capture audio/video while in the background (e.g., screen lock or app switch), configure Android and iOS as follows:

#### Android Configuration
1. **Permissions and Service (**`AndroidManifest.xml`**):** Android 9.0+ requires foreground service permissions; Android 14+ requires explicit service type for microphone/camera.

   ``` java
   <manifest xmlns:android="http://schemas.android.com/apk/res/android">

       <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
       <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
       <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

       <application>
           <service
               android:name=".CallForegroundService"
               android:enabled="true"
               android:exported="false"
               android:foregroundServiceType="camera|microphone" />
       </application>
   </manifest>
   ```
2. **Create Foreground Service Class (**`CallForegroundService`**):**

   ``` java
   import android.app.Notification
   import android.app.NotificationChannel
   import android.app.NotificationManager
   import android.app.Service
   import android.content.Context
   import android.content.Intent
   import android.os.Build
   import android.os.IBinder
   import androidx.core.app.NotificationCompat

   class CallForegroundService : Service() {
       companion object {
           private const val NOTIFICATION_ID = 1001
           private const val CHANNEL_ID = "call_foreground_channel"

           fun start(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                   context.startForegroundService(intent)
               } else {
                   context.startService(intent)
               }
           }

           fun stop(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               context.stopService(intent)
           }
       }

       override fun onCreate() {
           super.onCreate()
           createNotificationChannel()
           // Start foreground notification to ensure background capture permission
           startForeground(NOTIFICATION_ID, createNotification())
       }

       override fun onBind(intent: Intent?): IBinder? = null

       private fun createNotification(): Notification {
           return NotificationCompat.Builder(this, CHANNEL_ID)
               .setContentTitle("In Call")
               .setContentText("App is running in background to maintain call")
               .setSmallIcon(android.R.drawable.ic_menu_call) // Replace with your app icon
               .setPriority(NotificationCompat.PRIORITY_HIGH)
               .build()
       }

       private fun createNotificationChannel() {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               val channel = NotificationChannel(
                   CHANNEL_ID,
                   "Call Keep-Alive Service",
                   NotificationManager.IMPORTANCE_HIGH
               )
               val manager = getSystemService(NotificationManager::class.java)
               manager.createNotificationChannel(channel)
           }
       }
   }
   ```

#### iOS Configuration

**Steps:** In Xcode:
1. Select your project `Target` → `Signing & Capabilities`.

2. Click `+ Capability`.

3. Add `Background Modes`.

4. Check:

  - `Audio, AirPlay, and Picture in Picture` (for audio and PiP)

  - `Voice over IP` (for VoIP)

  - `Remote notifications` (optional, for offline push)

      Your `Info.plist` will automatically include:

      ``` xml
      <key>UIBackgroundModes</key>
      <array>
          <string>audio</string>
          <string>voip</string>
          <string>remote-notification</string>
      </array>
      ```
- **Configure Audio Session (AVAudioSession):**

   Set up the audio session before the call starts—ideally in the call UI's `viewDidLoad`, before dialing, or before answering.

   ``` swift
   import AVFoundation

   /**
    * Configure audio session for background audio capture.
    *
    * Recommended scenarios:
    * 1. In call UI's viewDidLoad
    * 2. Before making a call (calls)
    * 3. Before answering a call (accept)
    */
   private func start() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           // Set audio session category to play and record
           // .allowBluetooth: Supports Bluetooth headset
           // .allowBluetoothA2DP: Supports high-quality Bluetooth audio (A2DP)
           try audioSession.setCategory(.playAndRecord, options: [.allowBluetooth, .allowBluetoothA2DP])

           // Activate audio session
           try audioSession.setActive(true)
       } catch {
           // Audio session configuration failed
       }
   }
   ```

   > **Note:**
   >
   > Call `start()` via MethodChannel at the appropriate time in your app to enable background keep-alive.
   >

## FAQ

### iOS Release Build [symbol not found] Error?

Since tencent_rtc_sdk uses Flutter FFI, Xcode's symbol stripping during Release builds may remove TRTC C symbols and cause `symbol not found` errors. To resolve:
1. In Build Settings, set **Deployment Postprocessing** to **Yes**.

2. Set **Strip Style** for Release to **Non-Global Symbols**.

### If the callee goes offline and then comes online within the call invitation timeout, will they receive the incoming call event?

For single calls, if the callee comes online within the timeout, they will receive the call invitation. For group calls, if the callee comes online within the timeout, up to 20 unprocessed group messages will be pulled; if there is a call invitation, the incoming call event is triggered.

This documentation guides you through using the core component of the AtomicXCore SDK, [LiveCoreWidget](https://tencent-rtc.github.io/TUIKit_Flutter/api_view_live_live_core_widget/api_view_live_live_core_widget-library.html), to quickly build a basic live streaming app with host broadcasting and audience viewing functionality.

## Core Features

**LiveCoreWidget** is a lightweight widget built for live streaming scenarios. As the foundation of your live streaming implementation, it abstracts away the complexities of streaming, co-hosting, and audio and video rendering. Use LiveCoreWidget as the video canvas for your live stream, so you can focus on building your UI and interactive features.

The image below shows how LiveCoreWidget fits into the live streaming interface:

## Preparations

### Step 1: Activate the Service

See Activate the Service to obtain either the trial or paid version of the SDK. Then, go to [the Console](https://console.trtc.io/app) for application management, and get the following:
- `SDKAppID`: Application identifier (required). TRTC uses `SDKAppID` for billing and details.

- `SDKSecretKey`: Application secret key.

### Step 2: Import AtomicXCore into Your Project
1. **Install the SDK**: Add the `atomic_x_core` dependency in your `pubspec.yaml` file and execute `flutter pub get`.

   ``` yaml
   dependencies:
     atomic_x_core: ^4.0.1
   ```
2. **Configure project permissions:** Both Android and iOS projects require configuration.

【Android】

Add camera and microphone permissions to your `android/app/src/main/AndroidManifest.xml` file.
``` xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

【iOS】

Add camera and microphone usage descriptions to your app’s **Podfile** in the `iOS` directory and to the `Info.plist` file in the `ios/Runner` directory.

**Podfile:**
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

**Info.plist:**
``` xml
<key>NSCameraUsageDescription</key>
<string>TUILiveKit needs to access your camera permission. Video recording with picture only after enabling.</string>
<key>NSMicrophoneUsageDescription</key>
<string>TUILiveKit needs to access your mic permission. Recorded video will have sound when enabled.</string>
```

### Step 3: Implement Login Logic

Call `LoginStore.shared.login` in your project to log in. **This is the key premise for using all functions of AtomicXCore.**

> **Important:**
> It is recommended to call `LoginStore.shared.login` after successful log-in to your App's user account to ensure clear and consistent business logic.
>

``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final result = await LoginStore.shared.login(
    sdkAppID: 1400000001,           // replace with your sdkAppID
    userID: "test_001",             // replace with your userID
    userSig: "xxxxxxxxxxx",         // replace with your userSig
  );

  if (result.isSuccess) {
    debugPrint("login success");
  } else {
    debugPrint("login failed code: ${result.errorCode}, message: ${result.errorMessage}");
  }

  runApp(const MyApp());
}
```

**Login API parameters:**
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Note</strong> |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>int</code> | Your application identifier, which can be obtained from <a href="https://console.trtc.io/app">TRTC console</a>. |
| <code>userID</code> | <code>String</code> | - The unique ID for the current user.<br>- Only letters, numbers, hyphens, and underscores are allowed.<br>- To avoid login conflicts across devices, do not use simple IDs like 1, 123, etc. |
| <code>userSig</code> | <code>String</code> | Credential for TRTC authentication. Please note:<br>- In development environment: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a <code>UserSig</code> or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- In production environment: To prevent SecretKey leakage, always generate <code>UserSig</code> on your server. For details, see Generating UserSig on the Server. |

## Building a Basic Live Room

### Step 1: Host Video Streaming Setup

Follow these steps to quickly set up host video streaming:

> **Note:**
> For a complete host streaming implementation, see [live_room_anchor_widget.dart](https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/live/livekit/lib/live_stream/features/live_room_anchor_widget.dart) in the TUILiveKit open-source project.
>

1. **Initialize Host Streaming View**

   On your host page, create a `LiveCoreWidget` instance and control the live stream behavior through `LiveCoreController`.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAnchorPage represents your anchor starts live streaming page
   class YourAnchorPage extends StatefulWidget {
     final String liveId;

     const YourAnchorPage({super.key, required this.liveId});

     @override
     State<YourAnchorPage> createState() => _YourAnchorPageState();
   }

   class _YourAnchorPageState extends State<YourAnchorPage> {
     // 1. Create a LiveCoreController instance
     late final LiveCoreController _controller;

     @override
     void initState() {
       super.initState();
       // 2. Initialize the controller
       _controller = LiveCoreController.create(CoreViewType.pushView);
       // 3. Set up live streaming ID
       _controller.setLiveID(widget.liveId);
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Stack(
           children: [
             // 4. Load the broadcaster stream page to your view
             LiveCoreWidget(controller: _controller),
             // Your other UI components
           ],
         ),
       );
     }
   }
   ```
2. **Turn on the camera and microphone**

   Call `DeviceStore.shared.openLocalCamera` and `DeviceStore.shared.openLocalMicrophone` to enable the camera and microphone. LiveCoreWidget will automatically preview the camera video stream:

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAnchorPage represents your anchor starts live streaming page
   class YourAnchorPage extends StatefulWidget {
     final String liveId;

     const YourAnchorPage({super.key, required this.liveId});

     @override
     State<YourAnchorPage> createState() => _YourAnchorPageState();
   }

   class _YourAnchorPageState extends State<YourAnchorPage> {
     late final LiveCoreController _controller;

     @override
     void initState() {
       super.initState();
       _controller = LiveCoreController.create(CoreViewType.pushView);
       _controller.setLiveID(widget.liveId);
       // Turn on the device
       _openDevices();
     }

     void _openDevices() {
       // 1. Open front camera
       DeviceStore.shared.openLocalCamera(true);
       // 2. Turn on the microphone
       DeviceStore.shared.openLocalMicrophone();
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Stack(
           children: [
             LiveCoreWidget(controller: _controller),
           ],
         ),
       );
     }
   }
   ```
3. **Start live streaming**

   By calling the **LiveListStore** `createLive` API to start video live streaming:

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAnchorPage represents your anchor starts live streaming page
   class YourAnchorPage extends StatefulWidget {
     final String liveId;

     const YourAnchorPage({super.key, required this.liveId});

     @override
     State<YourAnchorPage> createState() => _YourAnchorPageState();
   }

   class _YourAnchorPageState extends State<YourAnchorPage> {
     late final LiveCoreController _controller;

     @override
     void initState() {
       super.initState();
       _controller = LiveCoreController.create(CoreViewType.pushView);
       _controller.setLiveID(widget.liveId);
       _openDevices();
     }

     void _openDevices() {
       DeviceStore.shared.openLocalCamera(true);
       DeviceStore.shared.openLocalMicrophone();
     }

     // Call the go live API to start live streaming
     Future<void> _startLive() async {
       // 1. Prepare the LiveInfo object
       final liveInfo = LiveInfo(
         // Set up live streaming room id
         liveID: widget.liveId,
         // Set up live streaming room name
         liveName: "Atomic Live Demo",
         // Layout mode: VideoDynamicGrid9Seats represents a dynamic 9-grid layout.
         seatTemplate: VideoDynamicGrid9Seats(),
       );

       // 2. Call LiveListStore.shared.createLive to start live streaming
       final result = await LiveListStore.shared.createLive(liveInfo);

       if (result.isSuccess) {
         debugPrint("startLive success");
       } else {
         debugPrint("startLive error: ${result.errorMessage}");
       }
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Stack(
           children: [
             LiveCoreWidget(controller: _controller),
             // Go live button
             Positioned(
               bottom: 50,
               left: 0,
               right: 0,
               child: Center(
                 child: ElevatedButton(
                   onPressed: _startLive,
                   child: const Text('Start live broadcast'),
                 ),
               ),
             ),
           ],
         ),
       );
     }
   }
   ```

   **LiveInfo parameters:**

| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Attribute</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| <code>liveID</code> | <code>String</code> | Required | Unique identifier for the live streaming room. |
| <code>liveName</code> | <code>String</code> | Optional. | Name of the live streaming room. |
| <code>notice</code> | <code>String</code> | Optional. | Announcement information of the live streaming room. |
| <code>isMessageDisable</code> | <code>bool</code> | Optional. | Whether to mute (<code>true</code>: yes, <code>false</code>: no). |
| <code>isPublicVisible</code> | <code>bool</code> | Optional. | Whether the live room is publicly visible (<code>true</code>: yes, <code>false</code>: no). |
| <code>seatMode</code> | <code>TakeSeatMode</code> | Optional. | Seat mode:<br>- <code>TakeSeatMode.free</code>: free seat.<br>- <code>TakeSeatMode.apply</code>: apply for seat. |
| <code>seatTemplate</code> | <code>SeatLayoutTemplate</code> | Required | Seat layout template. |
| <code>coverURL</code> | <code>String</code> | Optional. | Cover image URL of the live streaming room. |
| <code>backgroundURL</code> | <code>String</code> | Optional. | Background image URL of the live streaming room. |
| <code>categoryList</code> | <code>List<int></code> | Optional. | Category tags for the live room. |
| <code>activityStatus</code> | <code>int</code> | Optional. | Live stream status. |
| <code>isGiftEnabled</code> | <code>bool</code> | Optional. | Whether to enable the gift function (<code>true</code>: yes, <code>false</code>: no). |

4. **End live streaming**

   When the live stream ends, call `LiveListStore.shared.endLive` to stop streaming and close the room. The SDK will handle cleanup automatically.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAnchorPage represents your anchor starts live streaming page
   class YourAnchorPage extends StatefulWidget {
     final String liveId;

     const YourAnchorPage({super.key, required this.liveId});

     @override
     State<YourAnchorPage> createState() => _YourAnchorPageState();
   }

   class _YourAnchorPageState extends State<YourAnchorPage> {
     // ... Other code ...

     End live streaming
     Future<void> _stopLive() async {
       final result = await LiveListStore.shared.endLive();

       if (result.isSuccess) {
         debugPrint("endLive success");
       } else {
         debugPrint("endLive error: ${result.errorMessage}");
       }
     }

     // ... Other code ...
   }
   ```

### Step 2: Audience Room Entry and Viewing

Enable audience live viewing with these steps:

> **Note:**
> For a complete audience implementation, see [audience_widget.dart](https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/live/livekit/lib/live_stream/features/audience/audience_widget.dart) in the TUILiveKit open-source project.
>

1. **Audience Streaming Page**

   On your audience page, create a `LiveCoreWidget` instance and control the live stream behavior through `LiveCoreController`.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAudiencePage represents your audience viewing webpage
   class YourAudiencePage extends StatefulWidget {
     final String liveId;

     const YourAudiencePage({super.key, required this.liveId});

     @override
     State<YourAudiencePage> createState() => _YourAudiencePageState();
   }

   class _YourAudiencePageState extends State<YourAudiencePage> {
     // 1. Create a LiveCoreController instance
     late final LiveCoreController _controller;

     @override
     void initState() {
       super.initState();
       // 2. Initialize the controller
       _controller = LiveCoreController.create(CoreViewType.playView);
       // 3. Bind live streaming id
       _controller.setLiveID(widget.liveId);
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Stack(
           children: [
             // 4. Load the audience pull stream page to your view
             LiveCoreWidget(controller: _controller),
           ],
         ),
       );
     }
   }
   ```
2. **Join Live Room**

   Call `LiveListStore.shared.joinLive` to join the live stream. LiveCoreWidget will automatically play the video stream:

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAudiencePage represents your audience viewing webpage
   class YourAudiencePage extends StatefulWidget {
     final String liveId;

     const YourAudiencePage({super.key, required this.liveId});

     @override
     State<YourAudiencePage> createState() => _YourAudiencePageState();
   }

   class _YourAudiencePageState extends State<YourAudiencePage> {
     late final LiveCoreController _controller;

     @override
     void initState() {
       super.initState();
       _controller = LiveCoreController.create(CoreViewType.playView);
       _controller.setLiveID(widget.liveId);
       // Enter live room
       _joinLive();
     }

     Future<void> _joinLive() async {
       // Call LiveListStore.shared.joinLive to enter live room
       // - liveId: same liveId as anchor starts live streaming
       final result = await LiveListStore.shared.joinLive(widget.liveId);

       if (result.isSuccess) {
         debugPrint("joinLive success");
       } else {
         debugPrint("joinLive error: ${result.errorMessage}");
         // Failed to enter the room, must exit the page
         // if (mounted) Navigator.of(context).pop();
       }
     }

     @override
     Widget build(BuildContext context) {
       return Scaffold(
         body: Stack(
           children: [
             LiveCoreWidget(controller: _controller),
           ],
         ),
       );
     }
   }
   ```
3. **Leave Live Room**

   When the audience leaves, call `LiveListStore.shared.leaveLive` to exit. The SDK will stop streaming and leave the room automatically.

   ``` java
   import 'package:flutter/material.dart';
   import 'package:atomic_x_core/atomicxcore.dart';

   /// YourAudiencePage represents your audience viewing webpage
   class YourAudiencePage extends StatefulWidget {
     final String liveId;

     const YourAudiencePage({super.key, required this.liveId});

     @override
     State<YourAudiencePage> createState() => _YourAudiencePageState();
   }

   class _YourAudiencePageState extends State<YourAudiencePage> {
     // ... Other code ...

     End live stream
     Future<void> _leaveLive() async {
       final result = await LiveListStore.shared.leaveLive();

       if (result.isSuccess) {
         debugPrint("leaveLive success");
       } else {
         debugPrint("leaveLive error: ${result.errorMessage}");
       }
     }

     // ... Other code ...
   }
   ```

### Step 3: Listen for Live Events

After the audience enters the live room, you should handle passive events such as the host ending the stream or the audience being kicked out. Without event handling, the audience UI may remain on a black screen, impacting user experience.

Use `LiveListListener` to listen for live events:
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

/// YourAudiencePage represents your audience viewing webpage
class YourAudiencePage extends StatefulWidget {
  final String liveId;

  const YourAudiencePage({super.key, required this.liveId});

  @override
  State<YourAudiencePage> createState() => _YourAudiencePageState();
}

class _YourAudiencePageState extends State<YourAudiencePage> {
  late final LiveCoreController _controller;
  // 1. Define LiveListListener to manage event monitoring
  late final LiveListListener _liveListListener;

  @override
  void initState() {
    super.initState();
    _controller = LiveCoreController.create(CoreViewType.playView);
    _controller.setLiveID(widget.liveId);
    // 2. Listen to Live Event
    _setupLiveEventListener();
    // 3. Enter live room
    _joinLive();
  }

  // 4. Add a method to set up event listening
  void _setupLiveEventListener() {
    _liveListListener = LiveListListener(
      onLiveEnded: (liveID, reason, message) {
        // Listen to live streaming end
        debugPrint("Live ended. liveID: $liveID, reason: ${reason.value}, message: $message");
        // Handle the logic for exiting a live streaming room herein, such as closing current page
        // if (mounted) Navigator.of(context).pop();
      },
      onKickedOutOfLive: (liveID, reason, message) {
        // Listen to being kicked out of live stream
        debugPrint("Kicked out of live. liveID: $liveID, reason: ${reason.value}, message: $message");
        // Handle the logic for exiting a live streaming room herein
        // if (mounted) Navigator.of(context).pop();
      },
    );
    LiveListStore.shared.addLiveListListener(_liveListListener);
  }

  Future<void> _joinLive() async {
    final result = await LiveListStore.shared.joinLive(widget.liveId);
    if (result.isSuccess) {
      debugPrint("joinLive success");
    } else {
      debugPrint("joinLive error: ${result.errorMessage}");
    }
  }

  Future<void> _leaveLive() async {
    final result = await LiveListStore.shared.leaveLive();
    if (result.isSuccess) {
      debugPrint("leaveLive success");
    } else {
      debugPrint("leaveLive error: ${result.errorMessage}");
    }
  }

  @override
  void dispose() {
    // 5. Remove event listening
    LiveListStore.shared.removeLiveListListener(_liveListListener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          LiveCoreWidget(controller: _controller),
        ],
      ),
    );
  }
}
```

### Run and Test

After integrating LiveCoreWidget, you’ll have a clean video rendering view with full live streaming capabilities, but no interactive UI. See the next section, Enrich Live-Streaming Scenarios, to add more features to your live stream.
| Layout | <strong>Dynamic Grid Layout</strong> | <strong>Floating Window Layout</strong> | <strong>Fixed Grid Layout</strong> |
| --- | --- | --- | --- |
| Template ID | 600 | 601 | 800 |
| Description | Default layout; grid size adjusts dynamically based on number of co-hosts. | Co-hosts are displayed as floating windows. | Fixed number of co-hosts; each occupies a fixed grid. |
| Example |  |  |  |

## Enrich Live Streaming Scenarios

Once the basic live streaming functionality is in place,

|**Feature**|**Description**|**Store**|**Implementation Guide**|
|---------|---------|---------|---------|
|**Audience Audio/Video Co-hosting**|Audience can apply to join the host and interact via real-time video.|[CoGuestStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/CoGuestStore-class.html)|Implementation Guide|
|**Host Cross-room PK**|Hosts from different rooms can connect for interaction or PK.|[CoHostStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_host_store/CoHostStore-class.html) / [BattleStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_battle_store/BattleStore-class.html)|Implementation Guide|
|**Live Comments Chat**|Audience can send and receive real-time text messages in the live room.|[BarrageStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_barrage_barrage_store/BarrageStore-class.html)|Implementation Guide|
|**Gift System**|Audience can send virtual gifts to the host, increasing engagement and fun.|[GiftStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_gift_gift_store/GiftStore-class.html)|Implementation Guide|

## API documentation

|**Store/Component**|Feature Description|API Documentation|
|---------|---------|---------|
|**LiveCoreWidget**|Core view for live video display and interaction: handles video rendering and widget management; supports host streaming, audience co-hosting, host cross-room connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_view_live_live_core_widget/LiveCoreWidget-class.html)|
|**LiveCoreController**|Controller for LiveCoreWidget: set live stream ID, control preview, and other operations.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_view_live_live_core_widget/LiveCoreController-class.html)|
|**LiveListStore**|Live room lifecycle management: create, join, leave, destroy room; query room list; update live info (name, announcement, etc.); listen for live status (kicked out, ended).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_live_list_store/LiveListStore-class.html)|
|**DeviceStore**|Audio/video device control: microphone (toggle/volume), camera (toggle/switch camera/video quality), screen sharing, real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_device_device_store/DeviceStore-class.html)|
|**CoGuestStore**|Audience co-host management: co-host application/invitation/accept/reject, member permissions (microphone/camera), status sync.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/CoGuestStore-class.html)|
|**CoHostStore**|Host cross-room connection: supports multiple layouts (dynamic grid, etc.), initiate/accept/reject connection, co-host interaction management.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_host_store/CoHostStore-class.html)|
|**BattleStore**|Host PK battles: initiate PK (set duration/opponent), manage PK status (start/end), sync scores, listen for results.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_battle_store/BattleStore-class.html)|
|**GiftStore**|Gift interaction: get gift list, send/receive gifts, listen for gift events (including sender and gift details).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_gift_gift_store/GiftStore-class.html)|
|**BarrageStore**|Live comments: send text/custom comments, manage comment list, monitor comment status in real time.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_barrage_barrage_store/BarrageStore-class.html)|
|**LikeStore**|Like interaction: send likes, listen for like events, sync total like count.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_like_store/LikeStore-class.html)|
|**LiveAudienceStore**|Audience management: get real-time audience list (ID/name/avatar), count audience, listen for audience enter/leave events.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_live_audience_store/LiveAudienceStore-class.html)|
|**AudioEffectStore**|Audio effects: voice changer (child/male), reverb (KTV, etc.), ear monitoring, real-time effect switching.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_device_audio_effect_store/AudioEffectStore-class.html)|
|**BaseBeautyStore**|Basic beauty filters: adjust smoothing/whitening/rosy (0-100), reset beauty status, sync effect parameters.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_device_base_beauty_store/BaseBeautyStore-class.html)|

## FAQs

### Why is the screen black with no video after the host calls createLive or the audience calls joinLive?
- **Check setLiveID**: Please ensure the correct `liveID` has been set for the `LiveCoreController` instance before calling the live streaming or viewing API.

- **Check device permission**: Please ensure the app has obtained system usage permission for the camera and microphone.

- **Check anchor side**: Whether the Anchor side normally called `DeviceStore.shared.openLocalCamera(true)` to open the camera.

- **Check the network**: Please check whether the device network connection is normal.

### How to Request Permission in a Flutter Project?

You can use the `permission_handler` plug-in to request camera and mic permission:
``` java
import 'package:permission_handler/permission_handler.dart';

Future<void> requestPermissions() async {
  await [
    Permission.camera,
    Permission.microphone,
  ].request();
}
```

### How to Handle Page Lifecycle in Flutter?

It is recommended to clean up resources in the `dispose` method, such as removing event listeners:
``` java
@override
void dispose() {
  LiveListStore.shared.removeLiveListListener(_liveListListener);
  super.dispose();
}
```

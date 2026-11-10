---
sync_node_id: '207623927859675136'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "接入概览"
  - "接入概览（Flutter）"
product: "room"
---
This document provides a comprehensive integration guide for `AtomicXCore`, designed to help developers quickly implement multi-party audio/video conference rooms. The SDK features a pure API architecture, enabling full UI customization so you can focus on business logic and user experience.

## Core Features

To build multi-party audio/video conference rooms with **AtomicXCore**, use the following three core modules:
- `RoomStore`: Manages room operations, including scheduling, creation, joining, and in-room calling.

- `RoomParticipantStore`: Handles participant management within the room, such as assigning administrators, transferring room ownership, removing participants, and device control.

- `RoomParticipantWidget`: Renders participant video streams within the room.

## Preparation

### Step 1: Activate the Service

See Activate the Service to obtain either a trial or paid SDK version.

### Step 2: Environment Setup

|Platform|Version|
|---------|---------|
|Flutter|3.29.3 or higher.|
|Android|Android 5.0 (SDK API Level 21) or above.|
|iOS|iOS 14.0 or higher.|

### Step 3: Integrate the AtomicXCore SDK

Add the [atomic_x_core](https://pub.dev/packages/atomic_x_core) plugin dependency to your `pubspec.yaml` file:
``` yaml
dependencies:   
    atomic_x_core: latest version
```

Install the package:
``` plaintext
flutter pub get
```

### Step 4: Configure Project Settings
1. In **Xcode**, go to **Project** > **Build Settings** > **Deployment** and set **Strip Style** to `Non-Global Symbols` to preserve necessary global symbol information.

2. For audio/video features on iOS, grant microphone and camera permissions. (Android permissions are already handled by the SDK.)

   1. Add the following entries to your app's `Info.plist` (ios/Runner/Info.plist) to provide system prompts for microphone and camera access:

      ``` xml
      <key>NSCameraUsageDescription</key>
      <string>TUIRoomKit requires access to your camera</string>
      <key>NSMicrophoneUsageDescription</key>
      <string>TUIRoomKit requires access to your microphone</string>
      ```
   2. After making these changes, add the following preprocessor definitions to your **ios/Podfile** to enable camera and microphone permissions:

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

### Step 5: Implement Login Logic

Call `LoginStore.shared.login` in your project to complete authentication. **You must log in before using any AtomicXCore features.**

> **Important：**
> We recommend calling `LoginStore.shared.login` only after your app's user account login has succeeded, to ensure clear and consistent authentication flow.
> 

``` java
import 'package:atomic_x_core/atomicxcore.dart';

var loginResult = await LoginStore.shared.login(
    sdkAppID: 'SDKAPPID',    // Replace with your SDKAPPID
    userID: 'userID',        // Replace with your UserID
    userSig: 'userSig',      // Replace with your UserSig
);

if (loginResult.isSuccess) {
  // login success
} else {
  // login error
}
```

Login API Parameter Description:
| Parameter | Type | Description |
| --- | --- | --- |
| sdkAppId | int | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| userID | String | Unique identifier for the current user. Only use letters, numbers, hyphens, and underscores. Avoid simple IDs like <code>1</code>, <code>123</code>, etc., to prevent multi-device login conflicts. |
| userSig | String | Authentication ticket for Tencent Cloud.<br>- For development: Use <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Assistant Tool</a> for a temporary UserSig.<br>- For production: Always generate UserSig server-side to prevent secret key leaks. See Calculating UserSig on the Server.<br>For more details, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Build a Basic Multi-Party Room

### Step 1: Host Creates and Joins a Room

Follow these steps to quickly set up a multi-party conference room.

> **Tip：**
> For business logic reference, see the [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room) open source project, especially the [room_main_widget.dart](https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/room/lib/widget/room_main_widget.dart) file for a complete implementation.
> 

#### Step 1.1: Create and Join Room

##### Implementation Steps
1. **Configure Room Initialization Parameters:** Set up `CreateRoomOptions` with room name and password.

2. **Preset Room Permissions:** Set permissions for all members, such as muting all or disabling all cameras.

3. **Create and Join Room:** Call the `createAndJoinRoom` API from `RoomStore` to handle creation and entry.

##### Sample Code
``` java
import 'package:atomic_x_core/atomicxcore.dart';

// RoomMainPage represents the main room view
class RoomMainPage extends StatefulWidget {
  final String roomID;
  final RoomType roomType;
  const RoomMainPage({super.key, required this.roomID, required this.roomType});

  @override
  State<RoomMainPage> createState() => _RoomMainPageState();
}

class _RoomMainPageState extends State<RoomMainPage> {
  @override
  void initState() {
    super.initState();
    createAndJoinRoom();
  }

  // Create and join a room in one operation
  void createAndJoinRoom() async {
    // 1. Configure room initialization parameters
    final options = CreateRoomOptions(
      roomName: 'My Discussion Meeting',        // Room display name
      password: '',                            // Room entry password (leave blank if not needed)
      // 2. Permission preset: set initial permissions for all members
      isAllCameraDisabled: false,      // Enable/disable cameras for all
      isAllMessageDisabled: false,     // Enable/mute chat for all
      isAllMicrophoneDisabled: false,  // Enable/mute microphones for all
      isAllScreenShareDisabled: false, // Enable/disable screen sharing for all
    );

    // 3. Create and join room
    // If the room doesn't exist, create it first, then join automatically
    final result = await RoomStore.shared.createAndJoinRoom(
      roomID: widget.roomID,
      roomType: widget.roomType,
      options: options,
    );

    if (result.isSuccess) {
      debugPrint('Room created and joined successfully');
    } else {
      debugPrint('Failed to create and join room [Error Code: ${result.errorCode}]: ${result.errorMessage}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(); // Room view content
  }
}
```

**createAndJoinRoom API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier (string).<br>- Limit: 0-48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>standard</code>: Standard room, all members can freely interact via audio/video.<br>- <code>webinar</code>: Large seminar room, distinguishes between guest and audience roles; audience cannot go on stage by default. |
| <code>options</code> | CreateRoomOptions | Yes | Room creation options configuration object. |

**CreateRoomOptions Struct:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional, defaults to empty string).<br>- Limit: 0-60 bytes.<br>- Supports English, Chinese, numbers, special characters. |
| <code>password</code> | String | No | - Room password. Empty string "" means no password.<br>- Limit: 0-32 bytes.<br>- Recommend using 4-8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing plaintext sensitive information. |
| <code>isAllMicrophoneDisabled</code> | bool | No | Disable microphones for all members. When enabled, only host/admin can unmute; regular participants are muted by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllCameraDisabled</code> | bool | No | Disable cameras for all members. When enabled, only host/admin can enable cameras; regular participants are disabled by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllScreenShareDisabled</code> | bool | No | Disable screen sharing for all members. When enabled, only host/admin can share screen.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllMessageDisabled</code> | bool | No | Disable chat messages for all members (mute). When enabled, regular participants cannot send text messages in the room.<br>- true: Disabled.<br>- false: Not disabled (default). |

#### Step 1.2: Enable Camera and Microphone

After entering the room, call `openLocalCamera` and `openLocalMicrophone` from `DeviceStore` to activate local devices.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

/// Enable devices
/// Note: On Android, request camera and microphone permissions before enabling.
/// Use the permission_handler package to request permissions.
void _openDevices() {
  // Enable front camera
  DeviceStore.shared.openLocalCamera(true);
  // Enable microphone
  DeviceStore.shared.openLocalMicrophone();
}
```

**openLocalCamera API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>isFront</code> | bool | Yes | Enable the front camera:<br>- true: Front camera .<br>- false: Rear camera. |

#### Step 1.3: End Room

To end the room, call the `endRoom` API from `RoomStore`. All participants will receive a room ended event ([onRoomEnded](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomListener/onRoomEnded.html)).
``` java
import 'package:atomic_x_core/atomicxcore.dart';

/// End the room
Future<void> endRoom() async {
  // Permanently end current room.
  // Typically restricted to the host (Owner). After execution, all members are removed and audio/video capture stops.
  final result = await RoomStore.shared.endRoom();
  
  if (result.isSuccess) {
    debugPrint('Room ended successfully');
  } else {
    debugPrint('Failed to end room [Error Code: ${result.errorCode}]: ${result.errorMessage}');
  }
}
```

### Step 2: Participants Join a Room

Participants can join a room in a few simple steps for real-time audio/video interaction.

#### Step 2.1: Join a Room

To join a room, call the `joinRoom` API from `RoomStore`. Other participants will receive a participant joined event ([onParticipantJoined](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantListener/onParticipantJoined.html)).
``` java
import 'package:atomic_x_core/atomicxcore.dart';

/// Join an existing room
Future<void> joinRoom() async {
  // RoomStore checks room existence, user ban status, and password correctness
  final result = await RoomStore.shared.joinRoom(
    roomID: targetRoomID,    // Target room ID
    roomType: roomType,      // Target room type
    password: roomPassword,  // Room password, pass empty string if not set
  );

  if (result.isSuccess) {
    print("Joined room successfully");
  } else {
    print("Failed to join room [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**joinRoom API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier (string).<br>- Limit: 0-48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>standard</code>: Standard room, all members can freely interact via audio/video.<br>- <code>webinar</code>: Large seminar room, distinguishes between guest and audience roles; audience cannot go on stage by default. |
| <code>password</code> | String | No | - Room password. Empty string "" means no password.<br>- Limit: 0-32 bytes.<br>- Recommend using 4-8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing plaintext sensitive information. |

#### Step 2.2: Enable Camera and Microphone

See Enable Camera and Microphone for code samples.

#### Step 2.3: Leave a Room

To leave a room, call the `leaveRoom` API from `RoomStore`. Other participants will receive a participant left event ([onParticipantLeft](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantListener/onParticipantLeft.html)).
``` java
import 'package:atomic_x_core/atomicxcore.dart';

/// Leave the current room
Future<void> leaveRoom() async {
  // leaveRoom API lets regular members or the host leave voluntarily.
  // When the host calls leaveRoom, only they leave; room remains active.

  // Stop audio/video streaming and notify server to remove user from room
  final result = await RoomStore.shared.leaveRoom();

  if (result.isSuccess) {
    print("Left room successfully");
  } else {
    print("Failed to leave room [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 3: Bind a Video View

The `RoomParticipantWidget` component in **AtomicXCore SDK** provides a complete solution for video rendering, supporting real-time display of both local and remote participant video streams. Integration is straightforward and efficient.

> **Tip：**
> `RoomParticipantWidget` is the core component for rendering participant video streams in the room. For flexible video layouts, see [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room), particularly [room_widget.dart](https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/room/lib/widget/main/room_widget.dart).
> 

#### Implementation Steps
1. **Subscribe to Participant Data:** Listen to `RoomParticipantStore.state.participantList` for real-time updates.

2. **Automatic State Sync:** The system updates `participantList` when participant status changes.

3. **Initialize Views:** Instantiate `RoomParticipantWidget` using participant data and bind video rendering logic.

4. **Integrate UI:** Complete view hierarchy, layout configuration, and activate rendering.

#### Sample Code
``` java
import 'package:atomic_x_core/atomicxcore.dart';

final _controllers = <String, RoomParticipantController>{};
final _participantStore = RoomParticipantStore.create(roomID);

Widget build(BuildContext context) {
  // Subscribe to participant list state
  return ValueListenableBuilder<List<RoomParticipant>>(
    valueListenable: _participantStore.state.participantList,
    builder: (context, participants, _) {
      return GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
        itemCount: participants.length,
        itemBuilder: (_, index) => _buildParticipantView(participants[index]),
      );
    },
  );
}

Widget _buildParticipantView(RoomParticipant participant) {
  // Initialize RoomParticipantController
  final controller = _controllers.putIfAbsent(
    participant.userID,
    () => RoomParticipantController.create(
      streamType: VideoStreamType.camera,
      participant: participant,
    ),
  )..updateParticipant(participant)
   ..setActive(true);  // Set active to true when visible, false when not

  // Add widget to room UI
  return RoomParticipantWidget(controller: controller);
}
```

**RoomParticipantController Constructor Parameter Details:**
| Parameter Name | Type | Description |
| --- | --- | --- |
| <code>streamType</code> | <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_view_room_room_participant_widget/VideoStreamType.html">VideoStreamType</a> | Type of video stream to render:<br>- <code>camera</code>: Camera stream<br>- <code>screen</code>: Screen sharing stream |
| <code>participant</code> | <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipant-class.html">RoomParticipant</a> | Real-time participant snapshot, including identity, business status, and device permissions. |

**RoomParticipant Struct Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>userID</code> | <code>String</code> | Yes | Unique identifier for the user. |
| <code>userName</code> | <code>String</code> | No | User nickname. |
| <code>avatarURL</code> | <code>String</code> | No | Avatar URL. |
| <code>nameCard</code> | <code>String</code> | No | - User's name card or remark in the room.<br>- Limit: 0-32 bytes.<br>- Supports English, Chinese, numbers, special characters. |
| <code>role</code> | <code>ParticipantRole</code> | No | Participant role in the room.<br>- owner: Host.<br>- admin: Admin.<br>- generalUser: Regular user (default). |
| <code>roomStatus</code> | <code>RoomParticipantStatus</code> | No | Participant status in the room.<br>- scheduled: Scheduled (default).<br>- inCalling: Calling.<br>- callTimeout: Call timeout.<br>- callRejected: Call rejected.<br>- inRoom: In the room. |
| <code>microphoneStatus</code> | <code>DeviceStatus</code> | No | Microphone device status.<br>- off: Off (default).<br>- on: On. |
| <code>cameraStatus</code> | <code>DeviceStatus</code> | No | Camera device status.<br>- off: Off (default).<br>- on: On. |
| <code>screenShareStatus</code> | <code>DeviceStatus</code> | No | Screen sharing status.<br>- off: Off (default).<br>- on: On. |
| <code>isMessageDisabled</code> | <code>bool</code> | No | Whether the participant is muted. If true, cannot send chat messages.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>metaData</code> | <code>Map</code> | No | - Business custom extension data, synchronized with participant state.<br>- Limit: 0-60 bytes. Supports only JSON string. |

### Step 4: Listen to In-Room Events

After entering the room, call `addRoomListener` on `RoomStore` to subscribe to passive room events via `RoomListener`.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

// RoomPage represents the main room view
class RoomPage extends StatefulWidget {
  const RoomPage({super.key});

  @override
  State<RoomPage> createState() => _RoomPageState();
}

class _RoomPageState extends State<RoomPage> {
  // Room event listener
  late final RoomListener _roomListener;

  @override
  void initState() {
    super.initState();
    
    /// Create listener and set event callbacks
    _roomListener = RoomListener(
      onRoomEnded: (roomInfo) {
        print("Room ended: ${roomInfo.roomName}");
        // Navigate back to home here if needed
      },
      // ... handle other RoomListener events ...
    );

    /// Add listener to subscribe to room events
    RoomStore.shared.addRoomListener(_roomListener);
  }

  @override
  void dispose() {
    // Remove listener to avoid memory leaks
    RoomStore.shared.removeRoomListener(_roomListener);
    super.dispose();
  }
}
```

## Demo Effect

After completing these steps, you will have a clean multi-party video rendering room, without UI interactions.

 |

## Advanced Multi-Party Room Features

**AtomicXCore SDK** supports additional features to enrich conference scenarios:

|**Multi-Party Room Feature**|**Feature Description**|**Implementation Guide**|
|---------|---------|---------|
|Update Room Information|Host can update certain room info, such as room name and password.|Room Management|
|In-Meeting Calling|Host or admin can call users who haven't entered the room.|In-Meeting Calling|
|Room Scheduling|Rooms can be scheduled in advance, supporting start time, end time, and adding participants.|Room Scheduling|
|In-Room Participant Management|Host can manage participants: assign admins, remove users, control individual audio/video status.|Participant Management|

## API Documentation

|**Store/Widget**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create & join, join, leave, end room, update/retrieve room info, reservation, call out-of-room members, listen to passive events (room dissolution, info updates, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomStore-class.html)|
|**RoomParticipantStore**|Manage participants: assign admins, transfer host, get participant list, remove from room, control participant devices (close/invite camera/microphone), request device access.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantStore-class.html)|
|**RoomParticipantWidget**|Single participant video display view.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_view_room_room_participant_widget/RoomParticipantWidget-class.html)|
|**RoomParticipantController**|Controller for RoomParticipantWidget: bind/update participant info, change video stream type, set active state, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_view_room_room_participant_widget/RoomParticipantController-class.html)|

## FAQs

### RoomParticipantWidget is bound to participant info and the correct video stream type, but no video is displayed?
- **Check setActive:** Verify that `RoomParticipantWidget` is visible and `setActive: true` is correctly called.

- **Check RoomParticipant:** Make sure the **RoomParticipant** in `RoomParticipantWidget` has `cameraStatus` set to `on`.

- **Check Network:** Ensure the device has a working network connection.

### Unable to enter room on iOS when running or packaging in release mode?

Open your project in Xcode, go to Project > **Build Settings** > **Deployment**, and set Strip Style to Non-Global Symbols to preserve necessary global symbol information.

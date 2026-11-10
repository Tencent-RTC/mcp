---
sync_node_id: '207623927906861056'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "房间管理"
  - "房间管理（Flutter）"
product: "room"
---
`RoomStore` is the central component for managing room operations in `AtomicXCore`. It offers a comprehensive set of APIs for the entire room lifecycle, including room creation, entry, updates, and dissolution. By integrating RoomStore interfaces (such as retrieving or updating room information), you can build a robust room management system for your conference applications.

## Core Features
- **Create and Join Room**: Hosts can use this API to create and immediately enter a new room.

- **Join Room**: Participants can use this API to join an existing room.

- **Leave Room**: Participants can use this API to exit a room they have already joined.

- **End Room**: The host can end the current room using this API. All other participants will receive the `onRoomEnded` event notification.

- **Update Room Information**: Hosts or admins can update room details, such as the room name or password.

- **Get Room Information**: Use this API to fetch detailed information about a specific room.

## Core Concepts

Before integrating RoomStore, review the following core concepts:
| Core Concept | Core Responsibilities and Description |
| --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomInfo-class.html">RoomInfo</a> | The primary data model for room information, encapsulating all room details and supporting state management.<br>Features include:<br>- Management of basic room data (room ID, name, creator) .<br>- Real-time status tracking (participant count, room status, creation time).<br>- Room scheduling (scheduled times, participant list, reminder settings).<br>- Permission controls (password protection, device management, message management) . |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomState-class.html">RoomState</a> | The key data structure for room state, responsible for maintaining user-specific room state.<br>Properties:<br>- <code>scheduledRoomList</code> holds all scheduled room info for the current account.<br>- <code>scheduledRoomListCursor</code> is the pagination cursor for scheduled rooms.<br>- <code>currentRoom</code> tracks the state of the active room. |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomListener-class.html">RoomListener</a> | Handles real-time room events. Events are divided into two main types: scheduled room events and room end events. |
| <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomStore-class.html">RoomStore</a> | The core class for managing the room lifecycle. It supports scheduled room list snapshots, room management operations, and real-time event handling via <code>addRoomListener</code>. |

## Implementation Steps

### Step 1: Integrate Components

Follow the Integration Overview to add the AtomicXCore SDK to your project. Make sure you’ve completed the Login Logic Implementation before proceeding.

### Step 2: Create and Join a Room

#### Implementation Steps:
1. **Configure Room Initialization**: Use `CreateRoomOptions` to set the room name, password, and initial permissions.

2. **Preset Room Permissions**: Define global permissions for members (e.g., mute all, disable video).

3. **Create and Join Room**: Call RoomStore’s `createAndJoinRoom` API.

#### Sample Code:
``` java
import 'package:atomic_x_core/atomicxcore.dart';

void createAndJoinRoom() async {
  // 1. Set up room parameters and permission controls
  final options = CreateRoomOptions(
    roomName: 'My Discussion',        // Display name for the room
    password: '',                     // Room entry password (leave empty if not required)
    isAllCameraDisabled: false,       // Camera enabled/disabled for all members
    isAllMessageDisabled: false,      // Messaging enabled/muted for all members
    isAllMicrophoneDisabled: false,   // Microphone enabled/muted for all members
    isAllScreenShareDisabled: false,  // Screen sharing enabled/disabled for all members
  );

  // 3. Create and join room
  final result = await RoomStore.shared.createAndJoinRoom(
    roomID: widget.roomID,
    roomType: RoomType.standard,
    options: options,
  );

  if (result.isSuccess) {
    debugPrint('Successfully created and joined the room');
  } else {
    debugPrint('Failed to create and join the room [Error Code: ${result.errorCode}]: ${result.errorMessage}');
  }
}
```

**createAndJoinRoom Parameter Details**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Max 48 bytes.<br>- Use numbers, English letters, underscores (_), hyphens (-). Avoid spaces and non-ASCII characters. |
| <code>roomType</code> | <code>String</code> | Yes | Room type:<br>- <code>standard</code>: All members can interact via audio/video.<br>- <code>webinar</code>: Large seminar, audience cannot take a mic seat by default. |
| <code>options</code> | <a href="https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/CreateRoomOptions-class.html">CreateRoomOptions</a> | Yes | Room creation options. |

**CreateRoomOptions Structure**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| roomName | String | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| password | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |
| isAllMicrophoneDisabled | bool | No | Disable microphones for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can unmute; regular participants are muted by default. |
| isAllCameraDisabled | bool | No | Disable cameras for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can enable cameras; regular participants are disabled by default. |
| isAllScreenShareDisabled | bool | No | Disable screen sharing for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can share screens. |
| isAllMessageDisabled | bool | No | Mute all members (disable chat messages).<br>- true: Disabled.<br>- false: Not disabled (default).<br>Regular participants cannot send text messages in the room. |

### Step 3: Join a Room

Participants can join a room using the `joinRoom` API. Other participants will receive an [onParticipantJoined](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantListener/onParticipantJoined.html) event.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> joinRoom() async {
  // Join an existing room; checks room existence, ban status, and password validity
  final result = await RoomStore.shared.joinRoom(
    roomID: targetRoomID,
    roomType: RoomType.standard,
    password: roomPassword, // Use "" or null if no password is set
  );

  if (result.isSuccess) {
    print("Successfully joined the room");
  } else {
    print("Failed to join the room [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**joinRoom Parameter Details**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- standard: All members can freely participate in audio/video interactive.<br>- webinar: Large seminar room; distinguishes guest and audience roles. Audience has no audio/video permissions by default. |
| <code>password</code> | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |

### Step 4: Leave a Room

To exit a room, call the `leaveRoom` API. Other participants will receive an [onParticipantLeft](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_participant_store/RoomParticipantListener/onParticipantLeft.html) event.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> leaveRoom() async {
  // leaveRoom is for both participants and host to voluntarily exit the room.
  // If the host calls leaveRoom, only they leave; the room remains active.

  final result = await RoomStore.shared.leaveRoom();

  if (result.code == 0) {
    print("Successfully left the room");
  } else {
    print("Failed to leave the room [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 5: End a Room

The host can dissolve the room using the `endRoom` API. All participants will receive an [onRoomEnded](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomListener/onRoomEnded.html) event.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> endRoom() async {
  // endRoom permanently dissolves the room. Only the host can perform this operation.
  // All members are forcibly removed after dissolution.

  final result = await RoomStore.shared.endRoom();

  if (result.isSuccess) {
    debugPrint('Room ended successfully');
  } else {
    debugPrint('Failed to end the room [Error Code: ${result.errorCode}]: ${result.errorMessage}');
  }
}
```

### Step 6: Update the Room Information

Hosts can update room details (such as room name or password) using the `updateRoomInfo` API. Room participants will receive a state change notification.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> updateRoomInfo() async {
  // 1. Set room update parameters
  final options = UpdateRoomOptions(
    roomName: "New Conference Room Name",  // New room name
  );

  // 2. Set modification flags
  final modifyFlagList = [
    UpdateRoomOptionsModifyFlag.roomName,  // Update room name
  ];

  // 3. Submit update request
  final result = await RoomStore.shared.updateRoomInfo(
    roomID: "roomID",
    options: options,
    modifyFlagList: modifyFlagList,
  );

  if (result.isSuccess) {
    print("Room information updated successfully");
  } else {
    print("Failed to update room information [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

**updateRoomInfo Parameter Details**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | UpdateRoomOptions | Yes | - Room property update configuration object.<br>- See UpdateRoomOptions struct documentation for details. |
| <code>modifyFlag</code> | UpdateRoomOptionsModifyFlag | Yes | - Room property modification flag. Currently supports updating <strong>room name</strong> and <strong>room password</strong>.<br>- See UpdateRoomOptionsModifyFlag documentation for details. |

**UpdateRoomOptions Structure**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |

**UpdateRoomOptionsModifyFlag**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | int | No | - Flag for modifying room name.<br>- When updating <code>roomName</code> in UpdateRoomOptions, also set the <code>roomName</code> flag in ModifyFlag. |
| <code>password</code> | int | No | - Flag for modifying room password.<br>- When updating <code>password</code> in UpdateRoomOptions, also set the <code>password</code> flag in ModifyFlag. |

### Step 7: Get the Room Information

After entering a room, use the `getRoomInfo` API to retrieve detailed room data.
``` java
import 'package:atomic_x_core/atomicxcore.dart';

Future<void> getRoomInfo() async {
  // getRoomInfo fetches detailed room information, including name, creator, participant count, permissions, and more.
  final result = await RoomStore.shared.getRoomInfo("roomID");

  if (result.code == 0) {
    print("Successfully retrieved room information, roomInfo: ${result.roomInfo}");
  } else {
    print("Failed to retrieve room information [Error Code: ${result.errorCode}]: ${result.errorMessage}");
  }
}
```

### Step 8: Listen to Real-Time Room Events and State Changes

Subscribe to room events using RoomEvent. For example, to listen for room ended events:
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

    // Set up event callbacks
    _roomListener = RoomListener(
      onRoomEnded: (roomInfo) {
        print("Room has ended: ${roomInfo.roomName}");
      },
      // ... handle other RoomListener events ...
    );

    // Subscribe to passive room events
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

To listen for changes in current room information using RoomState:
``` java
ValueListenableBuilder(
  valueListenable: RoomStore.shared.state.currentRoom,
  builder: (context, currentRoom, _) {
    return Container();  // Widget that reacts to room info changes
  },
),
```

## API Documentation

|**Store**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create and join, join, leave, end, update, retrieve room info, schedule rooms, invite members, and listen for room events (such as dissolution, information updates, etc.)|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_room_room_store/RoomStore-class.html)|

## FAQs

### How is the participant count (`participantCount`) in `RoomInfo` updated? What is the timing and frequency?

`participantCount` is not always updated in real time. The update process works as follows:
- **Active Room Entry/Exit**: When a user joins or leaves a room, the participant count change notification is sent immediately. You’ll see this reflected in `participantCount` on `currentRoom` within `RoomState`.

- **Abnormal Disconnection**: If a user disconnects due to network issues or app crashes, a heartbeat mechanism tracks their actual status. If there’s no heartbeat for 90 seconds, the system marks them offline and triggers the participant count change.

- **Update Mechanism and Frequency**:

   - Notifications (instant or delayed) are sent as room messages.

   - Each room is limited to **40 messages per second**.

   - **Important**: In high-traffic scenarios (such as a live comment storm), if the room message rate exceeds 40 per second, participant count change messages may be dropped to prioritize core messages (like live comments).

      **What does this mean for developers?**

      `participantCount` delivers highly accurate, near real-time numbers. However, in extreme high-concurrency cases, you may see brief delays or lost updates. We recommend using it for **UI display** only—not for billing, statistics, or use cases requiring absolute accuracy.

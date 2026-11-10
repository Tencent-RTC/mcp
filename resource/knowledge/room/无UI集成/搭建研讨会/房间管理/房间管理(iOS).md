---
sync_node_id: '208869963624878080'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建研讨会"
  - "房间管理"
  - "房间管理（iOS）"
product: "room"
---
`RoomStore` handles all room-related operations in `AtomicXCore`, offering a comprehensive set of APIs for managing the entire lifecycle of conference rooms—from creation to dissolution. Using `RoomStore`, you can efficiently build a robust room management system with features like retrieving and updating room details.

## Core Features
- **Create and Join Room**: The host can use this API to create a room and join it immediately.

- **Join Room**: Members can use this API to enter an existing room.

- **Leave Room**: Members can use this API to exit a room they have joined.

- **End Room**: The host can use this API to end the current room. All other members will receive the `onRoomEnded` event.

- **Update Room Information**: Hosts or administrators can update room details. Currently, only the room name can be updated.

- **Get Room Information**: Retrieve detailed information about a room.

## Core Concepts

Before integrating RoomStore, review these key concepts:
| <strong>Core Concept</strong> | <strong>Type</strong> | <strong>Core Responsibilities & Description</strong> |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roominfo">RoomInfo</a> | <code>struct</code> | Data model representing room information, including all details and state management.<br>Key features:<br>- Room info management (ID, name, creator).<br>- Real-time status tracking (member count, room status, creation time).<br>- Permission control (device and message management) . |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstate">RoomState</a> | <code>struct</code> | Maintains the user's room-related state.<br>Key property:<br>- <code>currentRoom</code> represents the room state for the current user. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent">RoomEvent</a> | <code>enum</code> | Represents real-time events for room activity. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore">RoomStore</a> | <code>class</code> | Core class for room lifecycle management. Provides APIs for room operations and supports real-time event subscriptions via <code>roomEventPublisher</code>. |

## Implementation Steps

### Step 1: Integrate AtomicXCore SDK

Follow the Integration Overview to add the AtomicXCore SDK to your project. Make sure you have completed the Login Implementation.

### Step 2: Host Creates and Joins a Webinar Room

#### Implementation
1. **Configure Room Initialization**: Set up `CreateRoomOptions` with the room name and other properties.

2. **Set Room Permissions and Member Management**: Specify global member permissions, such as muting all microphones or disabling cameras.

3. **Create and Join Room**: Call RoomStore's `createAndJoinRoom` API to create and enter the room.

   > **Note:**
   > 
   > - We recommend generating the roomID on your backend for global uniqueness and stability.
   > - Prefix webinar room IDs with `webinar_` to distinguish them from standard meeting rooms.

##### Example Code
``` swift
import Foundation
import AtomicXCore

private let roomID = "webinar_123456"
private let roomType = .webinar

func createAndJoinRoom() {
    // 1. Configure room creation parameters
    // CreateRoomOptions defines the room's basic properties and member management settings
    var options = CreateRoomOptions()
    options.roomName = "Team webinar"           // Room display name
    options.password = ""                   // Room password (optional)

    // 2. Set global room permissions
    options.isAllCameraDisabled = false     // Disable all members' cameras
    options.isAllMessageDisabled = false    // Mute all members
    options.isAllMicrophoneDisabled = false // Mute all microphones
    options.isAllScreenShareDisabled = false // Disable screen sharing for all members

    // 3. Create and join room
    // Automatically handles room creation (if needed) and joining logic
    RoomStore.shared.createAndJoinRoom(roomID: roomID, roomType: roomType, options: options) { result in
        switch result {
        case .success():
            print("Successfully created and joined the room")
        case .failure(let error):
            print("Failed to create and join the room [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

> **Note:**
> Member management settings apply only to regular members; hosts and administrators are not restricted. To adjust member settings or manage individual member permissions after room creation, see the Member Management documentation.
> 

##### createAndJoinRoom API Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>- <code>standard</code>: Standard room.<br>- <code>webinar</code>: Large webinar room.<br>Use <code>webinar</code> for webinar scenarios. |
| <code>options</code> | <code>CreateRoomOptions</code> | Yes | - Room creation configuration.<br>- See CreateRoomOptions struct for details. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Callback for room creation/join result. Returns error code and message if unsuccessful. |

##### CreateRoomOptions Struct
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to empty).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- For easy mobile input, use 4–8 digits. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |
| <code>isAllMicrophoneDisabled</code> | <code>Bool</code> | No | Disable microphones for all members (except host/administrators):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllCameraDisabled</code> | <code>Bool</code> | No | Disable cameras for all members (except host/administrators):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllScreenShareDisabled</code> | <code>Bool</code> | No | Disable screen sharing for all members (only host/administrators can share):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllMessageDisabled</code> | <code>Bool</code> | No | Mute all members (disable chat):<br>- true: Disabled.<br>- false: Enabled (default). |

### Step 3: Audience Joins Webinar Room

Audience members join a room by calling RoomStore's `joinRoom` API.
``` swift
import Foundation
import AtomicXCore

private let roomID = "webinar_123456"
private let roomType = .webinar

func joinRoom() {
    // 1. Prepare join parameters
    // joinRoom is used to enter an existing room
    let roomPassword = "" // Room password, empty or nil if not set

    // 2. Call joinRoom API
    // This checks room existence, user ban status, and password correctness
    RoomStore.shared.joinRoom(roomID: roomID, roomType: roomType, password: roomPassword) { result in
        switch result {
        case .success():
            print("Successfully joined the room")
        case .failure(let error):
            print("Failed to join the room [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

> **Note:**
> After entering the room, audience members are in a silent listening state and cannot enable their microphone or camera by default. They can raise their hand to request permission; after host approval, they become a guest and can turn on their microphone. Role changes are handled via `RoomParticipantState`. For details, see Member Management.
> 

##### joinRoom API Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>- <code>standard</code>: Standard room.<br>- <code>webinar</code>: Large webinar room.<br>Use <code>webinar</code> for webinar scenarios. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Use 4–8 digits for easy input. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Callback for join result. Returns error code and message if unsuccessful. |

### Step 4: Leave Room

To leave a room, simply call RoomStore's `leaveRoom` API.
``` swift
import Foundation
import AtomicXCore

func leaveRoom() {
    // 1. Description
    // leaveRoom is for members or host to voluntarily exit the room
    // Unlike endRoom, when the host leaves, only they exit; the room persists

    // 2. Call leaveRoom API
    // Stops audio/video streams and removes the user from the room server-side
    RoomStore.shared.leaveRoom { result in
        switch result {
        case .success():
            print("Successfully left the room")
        case .failure(let error):
            print("Failed to leave the room [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

### Step 5: End Room

The host can dissolve the room by calling RoomStore's `endRoom` API. All members will receive a room ended event.
``` swift
import Foundation
import AtomicXCore

func endRoom() {
    // 1. Description
    // endRoom permanently dissolves the current room
    // Typically called only by the host. All members are removed after dissolution

    // 2. Call endRoom API
    // Sends the dissolve command to the server and notifies all participants
    RoomStore.shared.endRoom { result in
        switch result {
        case .success():
            print("Room ended successfully")
        case .failure(let error):
            print("Failed to end room [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

> **Note:**
> - If the host leaves without calling [endRoom](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore/endroom(completion:)), the room remains until an automatic recycle condition is met (default: 10 minutes, configurable via backend).
> - Webinar rooms do not support host privilege transfer.

### Step 6: Update Room Information

Hosts can update the room name via RoomStore's `updateRoomInfo` API. After the update, all members receive a state change notification.
``` swift
import Foundation
import AtomicXCore

private let roomID = "webinar_123456"

func updateRoomInfo() {
    // 1. Configure update parameters
    // UpdateRoomOptions defines which room properties to update
    var options = UpdateRoomOptions()
    options.roomName = "webinar room"  // New room display name

    // 2. Set modify flags
    // ModifyFlag specifies fields to update
    var modifyFlag: UpdateRoomOptions.ModifyFlag = []
    modifyFlag.insert(.roomName)       // Mark roomName for update

    // 3. Call updateRoomInfo API
    // Sends update request to the server and syncs changes to all members
    RoomStore.shared.updateRoomInfo(roomID: roomID, options: options, modifyFlag: modifyFlag) { result in
        switch result {
        case .success():
            print("Room information updated successfully")
        case .failure(let error):
            print("Failed to update room information [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### updateRoomInfo API Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>UpdateRoomOptions</code> | Yes | - Room property update configuration.<br>- See UpdateRoomOptions struct for details. |
| <code>modifyFlag</code> | <code>UpdateRoomOptions.ModifyFlag</code> | Yes | - Specifies which properties to update. Webinar rooms currently support updating the room name.<br>- See ModifyFlag documentation for usage. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Callback for update result. Returns error code and message if unsuccessful. |

##### UpdateRoomOptions Struct
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to empty).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Use 4–8 digits for easy input. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |

##### UpdateRoomOptions.ModifyFlag
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>UInt</code> | No | - Flag for updating the room name.<br>- When modifying <code>roomName</code>, also set the <code>roomName</code> flag in <code>ModifyFlag</code>. |
| <code>password</code> | <code>UInt</code> | No | - Flag for updating the room password.<br>- When modifying <code>password</code>, also set the <code>password</code> flag in <code>ModifyFlag</code>.<br>Passwords are not supported for webinar rooms. |

### Step 7: Get Room Information

After entering a room, retrieve detailed information using RoomStore's `getRoomInfo` API.
``` swift
import Foundation
import AtomicXCore

private let roomID = "webinar_123456"

func getRoomInfo() {
    // 1. Description
    // getRoomInfo fetches detailed info for a specified room
    // Includes room name, creator, participant count, permissions, etc.

    // 2. Call getRoomInfo API
    // Fetches the latest room state/configuration from the server
    RoomStore.shared.getRoomInfo(roomID: roomID) { result in
        switch result {
        case .success(let roomInfo):
            print("Successfully retrieved room info, roomInfo: \(roomInfo)")
        case .failure(let error):
            print("Failed to retrieve room info [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

### Step 8: Listen for Real-Time Room Events and State Changes

Subscribe to real-time room events. For example, to listen for the room ended event:
``` swift
import Foundation
import AtomicXCore
import Combine

private var cancellableSet = Set<AnyCancellable>()

/// Set up room event listener
private func subscribeRoomEvent() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main) // UI updates on main thread
        .sink { event in
            switch event {
            case .onRoomEnded(let roomInfo):
                print("The current room has ended")
            default: break
            }
        }
        .store(in: &cancellableSet)
}
```

Monitor changes to room state properties, such as updates to the current room information:
``` swift
import Foundation
import AtomicXCore
import Combine

private var cancellableSet = Set<AnyCancellable>()

private func subscribeRoomState() {
    /// Set up current room state listener
    RoomStore.shared.state
        .subscribe(StatePublisherSelector(keyPath: \.currentRoom))
        .receive(on: DispatchQueue.main) // UI updates on main thread
        .sink { roomInfo in
            if let newRoomInfo = roomInfo {
                print("Room info updated. New room info: \(newRoomInfo)")
            }
        }
        .store(in: &cancellableSet)
}
```

## API Documentation

|Store/Component|Feature Description|API Documentation|
|---------|---------|---------|
|`RoomStore`|Complete room lifecycle management: create & join, join, leave, end room, update and get room info, listen for room events (such as dissolution, info updates, etc.)|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore/)|

## FAQ

### Is there an automatic dissolution mechanism for webinar rooms?

Yes, webinar rooms are automatically dissolved under any of these conditions. The auto-dissolution settings and waiting period can be configured per sdkAppId. For adjustments, contact info_rtc@tencent.com.
- If a user joins a webinar room and it remains empty for a set period (default: 30 minutes) with no new entries, the room is dissolved automatically.

- If the host leaves the room and does not re-enter within a set period (default: 10 minutes), the room is dissolved automatically. This interval can be configured (range: 2 minutes to 12 hours).

- If the host is disconnected due to heartbeat timeout and does not resume the heartbeat or rejoin within a set period (default: 10 minutes), the room is dissolved automatically. This interval can be configured (range: 2 minutes to 12 hours).

### Are there charges for rooms with no users that haven't been dissolved?

No. Undissolved rooms with no users only count against your package's room quota and do not incur any usage or additional charges.

### What is the maximum number of webinar rooms that can exist simultaneously?

The maximum number of concurrent webinar rooms depends on your package. See TUILiveKit Package Description for details.

### What is the maximum number of participants supported in a single room?

The participant limit for a webinar room depends on your package. See TUILiveKit Package Description for details.

`RoomStore` manages all aspects of room operations within `AtomicXCore`, providing a complete suite of APIs for room lifecycle control—from creation to dissolution. By leveraging RoomStore's interfaces (such as retrieving or updating room information), you can efficiently build robust room management features for your application.

## Core Features
- **Create and Join a Room**: Room owners can create and immediately join a room using this API.

- **Join a Room**: Participants can join an existing room directly.

- **Leave a Room**: Participants can exit a room they have previously joined.

- **End a Room**: Room owners can end a room. If other participants are present, they will receive the `onRoomEnded` event.

- **Update the Room Information**: Room owners or administrators can update room properties (currently supports updating room name and password).

- **Get the Room Information**: Retrieve detailed information for a specific room.

## Core Concepts

The core concepts about RoomStore is summarized as follows:
| Core Concept | Type | Core Responsibilities & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roominfo">RoomInfo</a> | <code>struct</code> | Main data model for room details, encapsulating full room information and state.<br>Key features:<br>- Manages basic room info (Room ID, name, creator).<br>- Tracks real-time status (participant count, room status, creation time).<br>- Supports scheduling (scheduled time, participant list, reminders).<br>- Controls permissions (password protection, device management, message management). |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstate">RoomState</a> | <code>struct</code> | Core state structure for user-related room information.<br>Key properties:<br>- <code>scheduledRoomList</code>: All scheduled rooms for the current account.<br>- <code>scheduledRoomListCursor</code>: Pagination snapshot for scheduled rooms.<br>- <code>currentRoom</code>: State of the room currently joined. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent">RoomEvent</a> | <code>enum</code> | Defines real-time room events. Main categories: scheduled room events, room end events, room call events. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore">RoomStore</a> | <code>class</code> | Central class for managing room lifecycles. Capabilities include fetching scheduled room snapshots, performing room operations, and subscribing to <code>roomEventPublisher</code> for real-time events. |

## Implementation Steps

### Step 1: Integrate the SDK

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Login Logic Implementation before proceeding.

### Step 2: Create and Join a Room

#### Implementation
1. **Configure Room Initialization Parameters**: Initialize `CreateRoomOptions` with the room name and password.

2. **Preset Room Permissions**: Set permissions for all participants, such as muting, disabling cameras, etc.

3. **Create and Join Room**: Call RoomStore's `createAndJoinRoom` API to handle room creation and entry.

#### Sample Code
``` swift
import Foundation
import AtomicXCore

func createAndJoinRoom() {
    // 1. Configure room creation parameters
    // CreateRoomOptions defines basic room properties and initial permissions
    var options = CreateRoomOptions()
    options.roomName = "Team Meeting Room"           // Room display name
    options.password = ""                            // Room password (optional)

    // 2. Preset room permissions
    options.isAllCameraDisabled = false              // Disable all member cameras
    options.isAllMessageDisabled = false             // Mute all members
    options.isAllMicrophoneDisabled = false          // Mute all microphones
    options.isAllScreenShareDisabled = false         // Disable screen sharing for all members

    // 3. Create and join room
    // Handles creation if room does not exist and joining logic
    RoomStore.shared.createAndJoinRoom(roomID: "roomID", roomType: .standard, options: options) { result in
        switch result {
        case .success():
            print("Room created and joined successfully")
        case .failure(let error):
            print("Failed to create and join room [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### createAndJoinRoom Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type.<br>- <code>standard</code>: All members can freely participate in audio/video interactive.<br>- <code>webinar</code>: Large seminar room; distinguishes guest and audience roles. Audience has no audio/video permissions by default. |
| <code>options</code> | <code>CreateRoomOptions</code> | Yes | - Room creation configuration object.<br>- See CreateRoomOptions struct documentation for details. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns result of room creation/join. If failed, returns error code and message. |

#### CreateRoomOptions Struct Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |
| <code>isAllMicrophoneDisabled</code> | <code>Bool</code> | No | Disable microphones for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can unmute; regular participants are muted by default. |
| <code>isAllCameraDisabled</code> | <code>Bool</code> | No | Disable cameras for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can enable cameras; regular participants are disabled by default. |
| <code>isAllScreenShareDisabled</code> | <code>Bool</code> | No | Disable screen sharing for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can share screens. |
| <code>isAllMessageDisabled</code> | <code>Bool</code> | No | Mute all members (disable chat messages).<br>- true: Disabled.<br>- false: Not disabled (default).<br>Regular participants cannot send text messages in the room. |

### Step 3: Join a Room

To join an existing room, call the `joinRoom` API from RoomStore. Other participants will receive a join event notification.
``` swift
import Foundation
import AtomicXCore

func joinRoom() {
    // 1. Prepare join room parameters
    // joinRoom is used to join a known, ongoing room
    let roomPassword = "" // Room password. Pass empty string or nil if no password.

    // 2. Call RoomStore join room API
    // Verifies room existence, user access, and password correctness
    RoomStore.shared.joinRoom(roomID: "roomID", roomType: .standard, password: roomPassword) { result in
        switch result {
        case .success():
            print("Joined room successfully")
        case .failure(let error):
            print("Failed to join room [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### joinRoom Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>- standard: All members can freely participate in audio/video interactive.<br>- webinar: Large seminar room; distinguishes guest and audience roles. Audience has no audio/video permissions by default. |
| <code>password</code> | <code>String</code> | Yes | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns result of joining the room. If failed, returns error code and message. |

### Step 4: Leave a Room

To exit a room, call RoomStore's `leaveRoom` API. Other participants will receive a leave event notification.
``` swift
import Foundation
import AtomicXCore

func leaveRoom() {
    // 1. Business logic
    // leaveRoom is for regular members or owners to voluntarily exit the room.
    // Unlike endRoom, if the owner calls leaveRoom, only they exit—the room remains active.

    // 2. Call RoomStore leave room API
    // Stops audio/video streams and notifies the server to remove the current user from the room
    RoomStore.shared.leaveRoom { result in
        switch result {
        case .success():
            print("Left room successfully")
        case .failure(let error):
            print("Failed to leave room [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

### Step 5: End a Room

When the room owner wants to dissolve the room, call RoomStore's `endRoom` API. All participants will receive a room ended event.
``` swift
import Foundation
import AtomicXCore

func endRoom() {
    // 1. Business logic
    // endRoom permanently dissolves the current room.
    // Note: This is usually restricted to the owner. After dissolution, all members are forcibly exited.

    // 2. Call RoomStore end room API
    // Sends a dissolution command to the server and notifies all online participants
    RoomStore.shared.endRoom { result in
        switch result {
        case .success():
            print("Room dissolved successfully")
        case .failure(let error):
            print("Failed to dissolve room [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

### Step 6: Update the Room Information

Room owners can update the room name or change the room password using RoomStore's `updateRoomInfo` API. After the update, all participants will receive a room state change notification.
``` swift
import Foundation
import AtomicXCore

func updateRoomInfo() {
    // 1. Configure room update parameters
    // UpdateRoomOptions defines the properties to update
    var options = UpdateRoomOptions()
    options.roomName = "New Meeting Room Name"  // Update room display name

    // 2. Set modification flags
    // ModifyFlag specifies which fields to update
    var modifyFlag: UpdateRoomOptions.ModifyFlag = []
    modifyFlag.insert(.roomName)       // Flag to update room name

    // 3. Call RoomStore update room info API
    // Submits the update request to the server and synchronizes to all room members
    RoomStore.shared.updateRoomInfo(roomID: "roomID", options: options, modifyFlag: modifyFlag) { result in
        switch result {
        case .success():
            print("Room information updated successfully")
        case .failure(let error):
            print("Failed to update room information [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### updateRoomInfo Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>UpdateRoomOptions</code> | Yes | - Room property update configuration object.<br>- See UpdateRoomOptions struct documentation for details. |
| <code>modifyFlag</code> | <code>UpdateRoomOptions.ModifyFlag</code> | Yes | - Room property modification flag. Currently supports updating <strong>room name</strong> and <strong>room password</strong>.<br>- See UpdateRoomOptions.ModifyFlag documentation for details. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns result of updating room information. If failed, returns error code and message. |

**UpdateRoomOptions Struct Details**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |

**UpdateRoomOptions.ModifyFlag Details**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>UInt</code> | No | - Flag for modifying room name.<br>- When updating <code>roomName</code> in UpdateRoomOptions, also set the <code>roomName</code> flag in ModifyFlag. |
| <code>password</code> | <code>UInt</code> | No | - Flag for modifying room password.<br>- When updating <code>password</code> in UpdateRoomOptions, also set the <code>password</code> flag in ModifyFlag. |

### Step 7: Get the Room Information

After joining a room, call RoomStore's `getRoomInfo` API to retrieve detailed information about the room.
``` swift
import Foundation
import AtomicXCore

func getRoomInfo() {
    // 1. Business logic
    // getRoomInfo retrieves detailed information for a specified room,
    // including room name, creator, participant count, permission settings, and more.

    // 2. Call RoomStore get room info API
    // Fetches the latest room status and configuration from the server
    RoomStore.shared.getRoomInfo(roomID: "roomID") { result in
        switch result {
        case .success(let roomInfo):
            print("Room information retrieved successfully, roomInfo: \(roomInfo)")
        case .failure(let error):
            print("Failed to retrieve room information [Error Code: \(error.code)]: \(error.message)")
        }
    }
}
```

### Step 8: Listen to Real-Time Room Events and State Changes

Subscribe to passive room events using RoomEvent. For example, to listen for a room-ended event:
``` swift
import Foundation
import AtomicXCore
import Combine

private var cancellableSet = Set<AnyCancellable>()

// Set up room event listener
private func subscribeRoomEvent() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main) // Ensure UI updates are handled on the main thread
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

Subscribe to RoomState for changes to room properties. For example, to listen for updates to the current room information:
``` swift
import Foundation
import AtomicXCore
import Combine

private var cancellableSet = Set<AnyCancellable>()

private func subscribeRoomState() {
    // Set up current room state listener
    RoomStore.shared.state
        .subscribe(StatePublisherSelector(keyPath: \.currentRoom))
        .receive(on: DispatchQueue.main) // Ensure UI updates are handled on the main thread
        .sink { roomInfo in
            if let newRoomInfo = roomInfo {
                print("Room information updated. New room info: \(newRoomInfo)")
            }
        }
        .store(in: &cancellableSet)
}
```

## API Documentation

|**Store/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Room lifecycle management: create and join / join / leave / end room / update and retrieve room information / room scheduling / call members outside the room / listen to passive room events (such as room dissolution, room information updates, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore)|

## FAQs

### How is the participant count (`participantCount`) in `RoomInfo` updated? What are the timing and frequency?

`participantCount` is not always updated in real time. The update process works as follows:
- **Active Room Entry/Exit**: When a user joins or leaves a room normally, participant count changes are notified immediately. You will see changes reflected in `currentRoom` under `RoomState` almost instantly.

- **Unexpected Disconnections**: If a user disconnects due to network issues or app crashes, the system uses a heartbeat mechanism to determine their status. Only after 90 seconds without a heartbeat will the user be considered offline and the participant count updated.

- **Update Mechanism and Frequency Control**:

  - All participant count updates—whether immediate or delayed—are sent as in-room messages.

  - Each room is limited to 40 messages per second.

  - **Important**: In high-traffic situations (such as a "live comments storm"), if the room exceeds 40 messages per second, participant count update messages may be dropped to prioritize core messages (such as live comments).

      **What does this mean for developers?**

      `participantCount` provides a highly accurate, near real-time estimate. However, during periods of extremely high concurrency, updates may be briefly delayed or lost. We recommend using it for **UI display** purposes only, not for billing, analytics, or other scenarios requiring absolute precision.

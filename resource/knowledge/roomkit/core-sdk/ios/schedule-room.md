`RoomStore` serves as the core room management module within `AtomicXCore`, providing comprehensive support for scheduled rooms. This section is a step-by-step guide to help you efficiently develop and integrate scheduled room features using `RoomStore`.

## Core Features
- **Schedule and Cancel Room Reservations**: Any user can schedule a new room or cancel an existing scheduled room.

- **Update Scheduled Room Information**: Modify scheduled room details such as room name, start time, and end time.

- **Retrieve Scheduled Room List**: Obtain the list of all scheduled rooms associated with the current account.

- **Retrieve Scheduled Room Participant List**: Fetch the participant list for a specific scheduled room.

- **Add or Remove Scheduled Room Participants**: Add or remove users from an existing scheduled room.

## Core Concepts

Core concepts in `RoomStore` are summarized in the table below:
| Core Concept | Type | Core Responsibility & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstatus">RoomStatus</a> | <code>enum</code> | Indicates the current status of a room:<br>- scheduled (scheduled status).<br>- running (in progress). |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/scheduleroomoptions">ScheduleRoomOptions</a> | <code>struct</code> | Defines the main data structure for scheduled rooms, including start time, end time, participant list, and more. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstate">RoomState</a> | <code>struct</code> | Represents the main data structure for managing room state and tracking user-related room information.<br>Key properties:<br>- <code>scheduledRoomList</code>: Stores all scheduled rooms for the current account.<br>- <code>scheduledRoomListCursor</code>: Cursor for paginating the scheduled room list . |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent">RoomEvent</a> | <code>enum</code> | Represents real-time events related to room activity, including those for scheduled rooms. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore">RoomStore</a> | <code>class</code> | Central class for managing the entire room lifecycle. Use it to schedule rooms, retrieve scheduled room lists, and subscribe to real-time scheduled room events via <code>roomEventPublisher</code>. |

## Implementation Steps

### Step 1: Integrate the SDK

Follow the Integration Overview to integrate the **AtomicXCore SDK** into your project. Make sure you have also completed Login Implementation.

### Step 2: Scheduled Room Features

#### 1. Schedule a Room

##### Implementation Workflow
  1. **Configure Scheduled Room Parameters**: Use `ScheduleRoomOptions` to set up the room name, password, start and end times, participant list, and other details.

  2. **Set Room Permissions**: Configure permissions for all members, such as muting all participants or disabling video by default.

  3. **Schedule the Room**: Call `RoomStore`'s `scheduleRoom` method to create the scheduled room.

##### Sample Code
``` swift
import AtomicXCore
import Foundation

// Schedule a room
func scheduleRoom() {
    let startTime = Int(Date().timeIntervalSince1970) + 60 * 15 // Start 15 minutes from now
    let endTime = startTime + 60 * 30 // 30-minute duration
    let reminderSeconds = 60 * 5 // Reminder 5 minutes before start

    // Create scheduled room options
    var options = ScheduleRoomOptions()
    options.roomName = "Room Name"
    options.scheduleStartTime = startTime
    options.scheduleEndTime = endTime
    options.reminderSecondsBeforeStart = reminderSeconds
    options.scheduleAttendees = ["user01", "user02", "user03"] // List of participant user IDs
    options.password = "Room Password" // Optional; "" means no password
    options.isAllMicrophoneDisabled = false // Allow microphones by default
    options.isAllCameraDisabled = false // Allow cameras by default
    options.isAllScreenShareDisabled = false // Allow screen sharing by default
    options.isAllMessageDisabled = false // Allow messaging by default

    RoomStore.shared.scheduleRoom(roomID: "roomID", options: options) { result in
        switch result {
        case .success:
            print("Room scheduled successfully")
        case .failure(let error):
            print("Failed to schedule room: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

##### `scheduleRoom` Method Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique string identifier for the room.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>ScheduleRoomOptions</code> | Yes | Configuration object for the room.<br>See details in ScheduleRoomOptions struct. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Callback that returns the scheduling result. Returns error code and message if scheduling fails. |

##### ScheduleRoomOptions Struct Details
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to "").<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password ("" means no password).<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digit numbers for easier input. If set, users must enter the password to join. Do not store sensitive info in plain text. |
| <code>scheduleStartTime</code> | <code>Int</code> | Yes | - Scheduled start time (Unix timestamp in seconds).<br>- Must be greater than the current time.<br>- We recommend aligning to a future minute. Example: 1736164800 (2025-01-06 20:00:00). |
| <code>scheduleEndTime</code> | <code>Int</code> | Yes | - Scheduled end time (Unix timestamp in seconds).<br>- Must be greater than <code>scheduleStartTime</code>.<br>- Set based on expected duration, e.g., <code>scheduleStartTime</code> + 3600 for one hour. |
| <code>reminderSecondsBeforeStart</code> | <code>Int</code> | No | - Reminder time before the scheduled start (seconds). Used for system-triggered notifications.<br>- Recommended: 300 (5 min) or 900 (15 min) for local app notifications. |
| <code>scheduleAttendees</code> | <code>[String]</code> | No | - List of participant user IDs. The system will send invitations to these users.<br>- . |
| <code>isAllMicrophoneDisabled</code> | <code>Bool</code> | No | Whether to mute all participants by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllCameraDisabled</code> | <code>Bool</code> | No | Whether to disable all participant cameras by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllScreenShareDisabled</code> | <code>Bool</code> | No | Whether to disable screen sharing for all participants.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllMessageDisabled</code> | <code>Bool</code> | No | Whether to mute chat messages for all participants.<br>- true: Disabled.<br>- false: Not disabled (default). |

#### 2. Cancel a Scheduled Room

To cancel a scheduled room, call the `cancelScheduledRoom` method on `RoomStore`:
``` swift
import AtomicXCore
import Foundation

// Cancel scheduled room
func cancelScheduledRoom(roomID: String) {
    RoomStore.shared.cancelScheduledRoom(roomID: roomID) { result in
        switch result {
        case .success:
            print("Room reservation cancelled successfully")
        case .failure(let error):
            print("Failed to cancel room reservation: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

#### 3. Updating a Scheduled Room

To update a scheduled room’s name, start time, or end time, use `updateScheduledRoom` on `RoomStore`:
``` swift
import AtomicXCore
import Foundation

// Update scheduled room
func updateScheduledRoom() {
    let newStartTime = Int(Date().timeIntervalSince1970) + 60 * 30 // New start: 30 min from now
    let newEndTime = newStartTime + 60 * 45 // New end: 45 min after start

    var options = ScheduleRoomOptions()
    options.roomName = "Room Name"
    options.scheduleStartTime = newStartTime
    options.scheduleEndTime = newEndTime

    var modifyFlag: ScheduleRoomOptions.ModifyFlag = []
    modifyFlag.insert(.roomName)
    modifyFlag.insert(.scheduleStartTime)
    modifyFlag.insert(.scheduleEndTime)

    RoomStore.shared.updateScheduledRoom(roomID: "roomID", options: options, modifyFlag: modifyFlag) { result in
        switch result {
        case .success:
            print("Scheduled room updated successfully")
        case .failure(let error):
            print("Failed to update scheduled room: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

##### `updateScheduledRoom` Method Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique string identifier for the room.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>ScheduleRoomOptions</code> | Yes | - Configuration object for the scheduled room.<br>- See details in ScheduleRoomOptions struct. |
| <code>modifyFlag</code> | <code>ScheduleRoomOptions.ModifyFlag</code> | Yes | - Flags indicating which room properties to update. Only supports updating <strong>room name</strong>, <strong>start time</strong>, and <strong>end time</strong>.<br>- See details in ScheduleRoomOptions.ModifyFlag. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Callback that returns the result of the update. Returns error code and message if the update fails. |

**ScheduleRoomOptions.ModifyFlag Details**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>roomName</code> | <code>UInt</code> | - Use this flag when updating the scheduled room name.<br>- You must also set the <code>roomName</code> field in <code>ScheduleRoomOptions</code>. |
| <code>scheduleStartTime</code> | <code>UInt</code> | - Use this flag when updating the scheduled room start time.<br>- You must also set the <code>scheduleStartTime</code> field in <code>ScheduleRoomOptions</code>. |
| <code>scheduleEndTime</code> | <code>UInt</code> | - Use this flag when updating the scheduled room end time.<br>- You must also set the <code>scheduleEndTime</code> field in <code>ScheduleRoomOptions</code>. |

#### 4. Add or Remove Participants

To add or remove participants from a scheduled room, use the `addScheduledAttendees` or `removeScheduledAttendees` methods on `RoomStore`:
``` swift
import AtomicXCore
import Foundation

// Add participants
func addScheduledAttendees(roomID: String, userIDList: [String]) {
    RoomStore.shared.addScheduledAttendees(roomID: roomID, userIDList: userIDList) { result in
        guard let self = self else { return }
        switch result {
        case .success:
            print("Scheduled participants added successfully")
        case .failure(let error):
            print("Failed to add scheduled participants: [Error Code: \(error.code)] \(error.message)")
        }
    }
}

// Remove participants
func removeScheduledAttendees(roomID: String, userIDList: [String]) {
    RoomStore.shared.removeScheduledAttendees(roomID: roomID, userIDList: userIDList) { result in
        switch result {
        case .success:
            print("Scheduled participants removed successfully")
        case .failure(let error):
            print("Failed to remove scheduled participants: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

### Step 3: Retrieving the Scheduled Room List

To obtain all scheduled rooms for the current account, call the `getScheduledRoomList` method. Paging is supported via the `cursor` parameter.
``` swift
import AtomicXCore
import Foundation

// Retrieve scheduled room list
func getScheduledRoomList(cursor: String? = nil) {
    // 'cursor' is a pagination cursor. Pass nil for the first call; use the previous nextCursor for subsequent pages.
    RoomStore.shared.getScheduledRoomList(cursor: cursor) { result in
        switch result {
        case .success(let (roomList, nextCursor)):
            print("Scheduled room list retrieved successfully")
        case .failure(let error):
            print("Failed to retrieve scheduled room list: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

### Step 4: Retrieve Participants for a Scheduled Room

To retrieve the participant list for a specific scheduled room, use the `getScheduledAttendees` method. Paging is supported via the `cursor` parameter.
``` swift
import AtomicXCore
import Foundation

// Retrieve participant list for a scheduled room
func getScheduledAttendees(roomID: String, cursor: String? = nil) {
    // 'cursor' is a pagination cursor. Pass nil for the first call; use the previous nextCursor for subsequent pages.
    RoomStore.shared.getScheduledAttendees(roomID: roomID, cursor: cursor) { result in
        switch result {
        case .success(let (attendees, nextCursor)):
            print("Scheduled room participants retrieved successfully")
        case .failure(let error):
            print("Failed to retrieve scheduled room participants: [Error Code: \(error.code)] \(error.message)")
        }
    }
}
```

### Step 5: Subscribe to Real-Time Scheduled Room Events and State Changes

Subscribe to passive events related to scheduled rooms using `RoomEvent`:
``` swift
import AtomicXCore
import Foundation
import Combine

private var cancellableSet = Set<AnyCancellable>()

/// Subscribe to scheduled room events
private func subscribeScheduledRoomEvents() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main)
        .sink { event in
            switch event {
            case .onAddedToScheduledRoom(let roomInfo):
                print("Added to scheduled room. Room info: \(roomInfo)")
            case .onRemovedFromScheduledRoom(let roomInfo, let operatorUser):
                print("Removed from scheduled room. Room info: \(roomInfo), removed by: \(operatorUser)")
            case .onScheduledRoomCancelled(let roomInfo, let operatorUser):
                print("Scheduled room cancelled. Room info: \(roomInfo), cancelled by: \(operatorUser)")
            case .onScheduledRoomStartingSoon(let roomInfo):
                print("Scheduled room starting soon. Room info: \(roomInfo)")
            default:
                // Handle other non-scheduled room events
                break
            }
        }
        .store(in: &cancellableSet)
}
```

Subscribe to changes in the scheduled room list state using `RoomState`:
``` swift
import AtomicXCore
import Foundation
import Combine

private var cancellableSet = Set<AnyCancellable>()

/// Subscribe to scheduled room list state changes
private func subscribeScheduledRoomListState() {
    RoomStore.shared.state.subscribe(StatePublisherSelector(keyPath: \.scheduledRoomList))
        .receive(on: DispatchQueue.main)
        .sink { scheduledRoomList in
            print("Scheduled room list changed. Room list info: \(scheduledRoomList)")
        }
        .store(in: &cancellableSet)
}
```

## API Documentation

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create & join / join / leave / end room / update & retrieve room info / schedule rooms / invite users outside the room / listen for passive in-room events (such as room deletion, info updates, etc.)|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore)|

## FAQs

### Why am I not receiving the `onScheduledRoomStartingSoon` event from `RoomEvent` after scheduling a room?

If you are not receiving a "room starting soon" notification after scheduling, check the following:
1. **Verify Reminder Parameter (**`reminderSecondsBeforeStart`**)**

  - The `onScheduledRoomStartingSoon` event depends on the `reminderSecondsBeforeStart` property in `ScheduleRoomOptions`.

  - By default, this property is 0, which disables the reminder.

  - To enable reminders, set this parameter explicitly when scheduling the room. The value is in **seconds** and determines how long before the start time the event is triggered.

2. **Check the Scheduling Logic**

  - The event will only be triggered if the following condition is met: scheduled start time (`scheduleStartTime`) - current time > reminder offset (`reminderSecondsBeforeStart`).

  - If the room's start time is too close (e.g., 5 minutes away) and the reminder is set too far in advance (e.g., 10 minutes before), the event will not trigger.

  - Make sure the scheduled start time is at least as far in the future as the reminder value you set.

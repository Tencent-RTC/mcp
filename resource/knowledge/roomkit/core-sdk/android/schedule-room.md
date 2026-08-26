`RoomStore` is the core room management module in `AtomicXCore`, offering comprehensive support for scheduled meeting rooms. This section explains how to efficiently develop and integrate scheduled room features using `RoomStore`.

## Core Features
- **Schedule and Cancel Meeting Rooms**: Any user can schedule or cancel a meeting room.

- **Update Scheduled Room Information**: Update the information of existing scheduled rooms, including the room name, start time, and end time.

- **Retrieve Scheduled Room List**: Retrieve a list of all scheduled rooms for the current account.

- **Retrieve Scheduled Room Participant List**: Get the list of participants for a specific scheduled room.

- **Add or Remove Scheduled Room Participants**: Add or remove participants from an existing scheduled room.

## Core Concepts

Core concepts in `RoomStore` are summarized in the table below:
| Core Concept | Type | Core Responsibilities & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-state/index.html">RoomStatus</a> | <code>enum class</code> | Current status of the room:<br>-  <code>SCHEDULED</code> (scheduled).<br>-  <code>RUNNING</code> (in progress). |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-schedule-room-options/index.html">ScheduleRoomOptions</a> | <code>data class</code> | The data structure for scheduled rooms, including start time, end time, participant list, and more. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-state/index.html">RoomState</a> | <code>data class</code> | Core data structure for room state management. Maintains user-related room state information.<br>Key properties:<br>-  <code>scheduledRoomList</code>: List of all scheduled rooms under the current account.<br>-  <code>scheduledRoomListCursor</code>: Pagination cursor for the scheduled room list. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/index.html">RoomListener</a> | <code>abstract class</code> | Handles real-time events related to room activity, including scheduled room events. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html">RoomStore</a> | <code>abstract class</code> | The class for managing the entire room lifecycle. Use it to schedule rooms, retrieve scheduled room lists, and subscribe to <code>RoomListener</code> for real-time scheduled room events. |

## Implementation Steps

### Step 1: Integrate Components

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Implement Login Logic before proceeding.

### Step 2: Implement Scheduled Room Features

#### 1. Scheduling a Room

**Implementation Steps:**
1. **Set Initialization Parameters:** Create a `ScheduleRoomOptions` object to configure the room name, password, start time, end time, participant list, and other details.

2. **Set Room Permissions:** Define global member permissions, such as mute all, disable all video, and other restrictions.

3. **Schedule the Room:** Call the `scheduleRoom` method on `RoomStore` to complete the scheduling process.

   **Example Code:**

   ``` java
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.room.RoomStore
   import io.trtc.tuikit.atomicxcore.api.room.ScheduleRoomOptions

   // Schedule a room
   fun scheduleRoom() {
       val startTime = (System.currentTimeMillis() / 1000) + 60 * 15 // Start time: now + 15 minutes
       val endTime = startTime + 60 * 30 // End time: start time + 30 minutes
       val reminderSeconds = 60 * 5 // Reminder: 5 minutes before start

       // Create room options
       val options = ScheduleRoomOptions(
           roomName = "Room Name",
           scheduleStartTime = startTime,
           scheduleEndTime = endTime,
           reminderSecondsBeforeStart = reminderSeconds,
           scheduleAttendees = listOf("user01", "user02", "user03"), // Participant user IDs
           password = "Room Password", // Optional, empty string for no password
           isAllMicrophoneDisabled = false, // Default: allow microphones
           isAllCameraDisabled = false, // Default: allow cameras
           isAllScreenShareDisabled = false, // Default: allow screen sharing
           isAllMessageDisabled = false // Default: allow chat messaging
       )

       RoomStore.shared().scheduleRoom("roomID", options, object : CompletionHandler {
           override fun onSuccess() {
               println("Room scheduled successfully")
           }
           override fun onFailure(code: Int, desc: String) {
               println("Failed to schedule room: [Error code: $code] $desc")
           }
       })
   }
   ```

   `scheduleRoom` **Method Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique string identifier for the room.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>ScheduleRoomOptions</code> | Yes | Room configuration object. See ScheduleRoomOptions Struct Details. |
| <code>completion</code> | <code>CompletionHandler</code> | No | Callback for operation completion. Returns result or error code/message if scheduling fails. |

   `ScheduleRoomOptions` **Struct Details**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to "").<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password ("" means no password).<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digit numbers for easier input. If set, users must enter the password to join. Do not store sensitive info in plain text. |
| <code>scheduleStartTime</code> | <code>Long</code> | Yes | - Scheduled start time (Unix timestamp in seconds).<br>- Must be greater than the current time.<br>- We recommend aligning to a future minute. Example: 1736164800 (2025-01-06 20:00:00). |
| <code>scheduleEndTime</code> | <code>Long</code> | Yes | Scheduled end time (Unix timestamp in seconds).<br>- Must be greater than <code>scheduleStartTime</code>.<br>- Set based on expected duration, e.g., <code>scheduleStartTime</code> + 3600 for one hour. |
| <code>reminderSecondsBeforeStart</code> | <code>Int</code> | No | - Reminder time before the scheduled start (seconds). Used for system-triggered notifications.<br>- Recommended: 300 (5 min) or 900 (15 min) for local app notifications. |
| <code>scheduleAttendees</code> | <code>List</code> | No | - List of participant user IDs. The system will send invitations to these users.<br>- . |
| <code>isAllMicrophoneDisabled</code> | <code>Boolean</code> | No | Whether to mute all participants by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllCameraDisabled</code> | <code>Boolean</code> | No | Whether to disable all participant cameras by default.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllScreenShareDisabled</code> | <code>Boolean</code> | No | Whether to disable screen sharing for all participants.<br>- true: Disabled.<br>- false: Not disabled (default). |
| <code>isAllMessageDisabled</code> | <code>Boolean</code> | No | Whether to mute chat messages for all participants.<br>- true: Disabled.<br>- false: Not disabled (default). |

#### 2. Cancel a Scheduled Room

The room scheduler can call `RoomStore.cancelScheduledRoom` to cancel a scheduled room.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

// Cancel a scheduled room
fun cancelScheduledRoom(roomID: String) {
    RoomStore.shared().cancelScheduledRoom(roomID, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Successfully canceled scheduled room")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to cancel scheduled room: [Error code: $code] $desc")
        }
    })
}
```

#### 3. Update a Scheduled Room

The room scheduler can use `RoomStore.updateScheduledRoom` to update the room name, start time, and end time for a scheduled room.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.ScheduleRoomOptions

// Update a scheduled room
fun updateScheduledRoom() {
    val newStartTime = (System.currentTimeMillis() / 1000) + 60 * 30 // Start: now + 30 minutes
    val newEndTime = newStartTime + 60 * 45 // End: start + 45 minutes

    val options = ScheduleRoomOptions(
        roomName = "Room Name",
        scheduleStartTime = newStartTime,
        scheduleEndTime = newEndTime
    )

    val modifyFlagList = listOf(
        ScheduleRoomOptions.ModifyFlag.ROOM_NAME,
        ScheduleRoomOptions.ModifyFlag.SCHEDULE_START_TIME,
        ScheduleRoomOptions.ModifyFlag.SCHEDULE_END_TIME
    )

    RoomStore.shared().updateScheduledRoom("roomID", options, modifyFlagList, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Successfully updated scheduled room")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to update scheduled room: [Error code: $code] $desc")
        }
    })
}
```

`updateScheduledRoom` **Parameters**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique string identifier for the room.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>ScheduleRoomOptions</code> | Yes | Configuration object for the scheduled room.<br>- See details in ScheduleRoomOptions struct. |
| <code>modifyFlagList</code> | <code>List<ScheduleRoomOptions.ModifyFlag></code> | Yes | Flags specifying which room properties to update. Can update room name, start time, and end time. See <code>ModifyFlag</code> documentation. |
| <code>completion</code> | <code>CompletionHandler</code> | No | Callback for completion. Returns result or error code/message if update fails. |

`ScheduleRoomOptions.ModifyFlag` **Details**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>ROOM_NAME</code> | <code>enum</code> | - Use this flag when updating the scheduled room name.<br>- You must also set the <code>roomName</code> field in <code>ScheduleRoomOptions</code>. |
| <code>SCHEDULE_START_TIME</code> | <code>enum</code> | - Use this flag when updating the scheduled room start time.<br>- You must also set the <code>scheduleStartTime</code> field in <code>ScheduleRoomOptions</code>. |
| <code>SCHEDULE_END_TIME</code> | <code>enum</code> | - Use this flag when updating the scheduled room end time.<br>- You must also set the <code>scheduleEndTime</code> field in <code>ScheduleRoomOptions</code>. |

#### 4. Add or Remove Participants

To add or remove participants in a scheduled room, use `RoomStore.addScheduledAttendees` or `RoomStore.removeScheduledAttendees`.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

// Add scheduled participants
fun addScheduledAttendees(roomID: String, userIDList: List<String>) {
    RoomStore.shared().addScheduledAttendees(roomID, userIDList, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Successfully added scheduled participants")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to add scheduled participants: [Error code: $code] $desc")
        }
    })
}

// Remove scheduled participants
fun removeScheduledAttendees(roomID: String, userIDList: List<String>) {
    RoomStore.shared().removeScheduledAttendees(roomID, userIDList, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Successfully removed scheduled participants")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to remove scheduled participants: [Error code: $code] $desc")
        }
    })
}
```

### Step 3: Retrieve the Scheduled Room List

Use `RoomStore.getScheduledRoomList` to get all scheduled rooms for your account.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

// Get scheduled room list
fun getScheduledRoomList(cursor: String? = null) {
    // Use null for the first page; use the previous nextCursor for subsequent pages
    RoomStore.shared().getScheduledRoomList(cursor, object : ListResultCompletionHandler<RoomInfo> {
        override fun onSuccess(result: List<RoomInfo>, cursor: String) {
            Log.d("Room", "Successfully retrieved scheduled room list")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to retrieve scheduled room list: [Error code: $code] $desc")
        }
    })
}
```

### Step 4: Retrieve the Participant List for a Scheduled Room

Use `RoomStore.getScheduledAttendees` to retrieve participants for a specific scheduled room.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

// Get participant list for a scheduled room
fun getScheduledAttendees(roomID: String, cursor: String? = null) {
    // Use null for the first page; use the previous nextCursor for subsequent pages
    RoomStore.shared().getScheduledAttendees(roomID, cursor, object : ListResultCompletionHandler<RoomUser> {
        override fun onSuccess(result: List<RoomUser>, cursor: String) {
            Log.d("Room", "Successfully retrieved scheduled room participant list")
        }
        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to retrieve scheduled room participant list: [Error code: $code] $desc")
        }
    })
}
```

### Step 5: Subscribe to Real-Time Events and State Changes

Subscribe to scheduled room events with `RoomListener`. Example:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

/**
 * Subscribe to scheduled room events
 */
fun subscribeScheduledRoomEvents() {
    val listener = object : RoomListener() {
        override fun onAddedToScheduledRoom(roomInfo: RoomInfo) {
            Log.d("Room", "Added to scheduled room. Room info: $roomInfo")
        }

        override fun onRemovedFromScheduledRoom(roomInfo: RoomInfo, operator: RoomUser) {
            Log.d("Room", "Removed from scheduled room. Room info: $roomInfo, Removed by: $operator")
        }

        override fun onScheduledRoomCancelled(roomInfo: RoomInfo, operator: RoomUser) {
            Log.d("Room", "Scheduled room cancelled. Room info: $roomInfo, Cancelled by: $operator")
        }

        override fun onScheduledRoomStartingSoon(roomInfo: RoomInfo) {
            Log.d("Room", "Scheduled room starting soon. Room info: $roomInfo")
        }

        // Override other event callbacks as needed
    }

    RoomStore.shared().addRoomListener(listener)
}
```

Subscribe to scheduled room list state changes with `RoomState`. Example:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// Subscribe to scheduled room list state changes
private fun subscribeParticipantState() {
    CoroutineScope(Dispatchers.Main).launch {
        RoomStore.shared().state.scheduledRoomList.collect { scheduledRoomList ->
            Log.d("Room", "Scheduled room list changed. Room list info: $scheduledRoomList")
        }
    }
}
```

## API Documentation

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create & join / join / leave / end room / update & retrieve room info / schedule rooms / call out-of-room members / listen for in-room passive events (such as room dissolved, room info updated, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|

## FAQs

### Why am I not receiving the `onScheduledRoomStartingSoon` event from `RoomListener` after scheduling a room?

If you are not receiving the upcoming event notification after scheduling a room, check the following:
1. **Verify Reminder Parameter Configuration (**`reminderSecondsBeforeStart`**)**

  - **Trigger Mechanism:** The `onScheduledRoomStartingSoon` event is triggered based on the `reminderSecondsBeforeStart` property set in `ScheduleRoomOptions`.

  - **Default Value:** The default is 0, which means reminders are disabled.

  - **Solution:** Set this parameter explicitly when scheduling a room. The value is in **seconds** and determines how long before the room starts the notification is sent.

2. **Check Scheduled Time Logic**

  - **Calculation:** The reminder triggers only if: scheduled start time (`scheduleStartTime`) - current time > reminder offset (`reminderSecondsBeforeStart`).

  - **Edge Case:** If the room is scheduled to start very soon (e.g., in 5 minutes) but the reminder is set for 10 minutes before start, the system cannot send the notification, and the event will be missed.

  - **Solution:** Ensure the scheduled start time is sufficiently further in the future than the reminder interval you've set.

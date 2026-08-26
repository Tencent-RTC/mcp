RoomStore is the central API for managing rooms in AtomicXCore, providing a full suite of lifecycle management interfaces—from creating and joining rooms to updating, dissolving, and retrieving room information. By integrating RoomStore’s interfaces, you can build a comprehensive and reliable room management system.

## Core Features
- **Create and Join Room**: Hosts can use this interface to create a room and immediately enter it.

- **Join Room**: Participants can join an existing room using this interface.

- **Leave Room**: Participants can exit a room they’ve joined.

- **End Room**: Hosts can end the current room. If other participants are present, they will receive the `onRoomEnded` event.

- **Update Room Information**: Hosts or administrators can update room details such as the room name or password.

- **Get Room Information**: Retrieve detailed information for any room.

## Core Concepts

Before you begin integration, review these key RoomStore concepts:
| Core Concept | Type | Core Responsibilities & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-info/index.html">RoomInfo</a> | <code>data class</code> | Main data model for room details, encapsulating full room information and state.<br>Key features:<br>- Manages basic room info (Room ID, name, creator).<br>- Tracks real-time status (participant count, room status, creation time).<br>- Supports scheduling (scheduled time, participant list, reminders).<br>- Controls permissions (password protection, device management, message management). |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-state/index.html">RoomState</a> | <code>data class</code> | Core state structure for user-related room information.<br>Key properties:<br>- <code>scheduledRoomList</code>: All scheduled rooms for the current account.<br>- <code>scheduledRoomListCursor</code>: Pagination snapshot for scheduled rooms.<br>- <code>currentRoom</code>: State of the room currently joined. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/index.html">RoomListener</a> | <code>abstract class</code> | Handles real-time events for room dynamics, including room reservation, room end, and room call events. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html">RoomStore</a> | <code>abstract class</code> | Core class for managing the entire room lifecycle. Functions include: retrieving reservation snapshots, executing room operations, and subscribing to <code>RoomListener</code> for real-time events. |

## Implementation Steps

### Step 1: Integrate Components

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Implement Login Logic before proceeding.

### Step 2: Create and Join a Room

#### Implementation
1. **Configure Room Initialization Parameters**: Initialize `CreateRoomOptions` to set the room name and password.

2. **Set Room Permissions**: Configure global member permissions (mute all, disable cameras, etc.).

3. **Create and Join Room**: Use RoomStore’s `createAndJoinRoom` interface to create and enter the room.

##### Sample Code
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

private val roomID = "test_room_001"
private val roomType = RoomType.STANDARD

fun createAndJoinRoom() {
    // 1. Configure room creation parameters
    // CreateRoomOptions defines basic room attributes and initial permissions
    val options = CreateRoomOptions(
        roomName = "Team Meeting Room",           // Room display name
        password = "",                            // Room password (optional)
        // 2. Set initial permission controls
        isAllCameraDisabled = false,              // Allow member cameras
        isAllMessageDisabled = false,             // Allow member chat
        isAllMicrophoneDisabled = false,          // Allow member microphones
        isAllScreenShareDisabled = false          // Allow screen sharing
    )

    // 3. Create and join room
    // Handles creation (if needed) and join logic automatically
    RoomStore.shared().createAndJoinRoom(roomID, roomType, options, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Room created and joined successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to create and join room [Error code: $code]: $desc")
        }
    })
}
```

##### createAndJoinRoom Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>STANDARD</code>: Standard room (default).<br>- <code>WEBINAR</code>: Large webinar room.<br>Use <code>STANDARD</code> for multi-party meetings. |
| <code>options</code> | CreateRoomOptions | Yes | - Room creation configuration object.<br>- See CreateRoomOptions struct documentation. |
| <code>completion</code> | CompletionHandler | No | Completion callback for creation/join result. Returns error code and message if creation fails. |

##### CreateRoomOptions Struct Documentation
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |
| <code>isAllMicrophoneDisabled</code> | Boolean | No | Disable microphones for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can unmute; regular participants are muted by default. |
| <code>isAllCameraDisabled</code> | Boolean | No | Disable cameras for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can enable cameras; regular participants are disabled by default. |
| <code>isAllScreenShareDisabled</code> | Boolean | No | Disable screen sharing for all members.<br>- true: Disabled.<br>- false: Not disabled (default).<br>Only owner/administrator can share screens. |
| <code>isAllMessageDisabled</code> | Boolean | No | Mute all members (disable chat messages).<br>- true: Disabled.<br>- false: Not disabled (default).<br>Regular participants cannot send text messages in the room. |

### Step 3: Join a Room

To join a room, participants call the `joinRoom` interface on RoomStore. All other participants will receive a notification when someone joins.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

private val roomID = "test_room_001"
private val roomType = RoomType.STANDARD

fun joinRoom() {
    // 1. Prepare join parameters
    // joinRoom joins a known, active room
    val roomPassword = "" // Room password; pass empty string or null if not set

    // 2. Join room
    // Checks room existence, user ban status, and password validity
    RoomStore.shared().joinRoom(roomID, roomType, roomPassword, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Joined room successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to join room [Error code: $code]: $desc")
        }
    })
}
```

##### joinRoom Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>STANDARD</code>: Standard room (default).<br>- <code>WEBINAR</code>: Large webinar room.<br>Use <code>STANDARD</code> for large multi-party meetings. |
| <code>password</code> | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |
| <code>completion</code> | CompletionHandler | No | Completion callback for join result. Returns error code and message if joining fails. |

### Step 4: Leave a Room

To leave a room, call RoomStore’s `leaveRoom` interface. All other participants will receive a notification when someone leaves.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

fun leaveRoom() {
    // 1. Business logic
    // leaveRoom is for members or hosts to voluntarily exit
    // If the host leaves, the room remains active

    // 2. Leave room
    // Stops audio/video streams and removes the user from the room server-side
    RoomStore.shared().leaveRoom(object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Left room successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to leave room [Error code: $code]: $desc")
        }
    })
}
```

### Step 5: End a Room

Hosts can end a room using RoomStore’s `endRoom` interface. All participants will receive a room-end event.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

fun endRoom() {
    // 1. Business logic
    // endRoom permanently dissolves the current room
    // Typically restricted to the host; all members are forcibly exited

    // 2. End room
    // Sends dissolve command to server and notifies all online participants
    RoomStore.shared().endRoom(object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Room dissolved successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to dissolve room [Error code: $code]: $desc")
        }
    })
}
```

### Step 6: Update the Room Information

Hosts can update the room name or password with RoomStore’s `updateRoomInfo` interface. All room participants will be notified of the change.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.UpdateRoomOptions
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

private val roomID = "test_room_001"

fun updateRoomInfo() {
    // 1. Configure update parameters
    // UpdateRoomOptions specifies which attributes to update
    val options = UpdateRoomOptions(
        roomName = "New Meeting Room Name"     // Update room display name
    )

    // 2. Set modification flags
    // modifyFlagList specifies fields to update; supports multiple flags
    val modifyFlagList = listOf(UpdateRoomOptions.ModifyFlag.ROOM_NAME)

    // 3. Update room info
    // Submits update to server and syncs to all members
    RoomStore.shared().updateRoomInfo(roomID, options, modifyFlagList, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Room information updated successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to update room information [Error code: $code]: $desc")
        }
    })
}
```

##### updateRoomInfo Interface Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | UpdateRoomOptions | Yes | - Room property update configuration object.<br>- See UpdateRoomOptions struct documentation for details. |
| <code>modifyFlagList</code> | List | Yes | Room property modification flag. Currently supports updating <strong>room name</strong> and <strong>room password</strong>.<br>- See UpdateRoomOptions.ModifyFlag documentation for details. |
| <code>completion</code> | CompletionHandler | No | Completion callback for update result. Returns error code and message if update fails. |

**UpdateRoomOptions Struct Documentation**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional; defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | String | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Recommend 4–8 digits for easy mobile input. If set, other users must enter the password to join. Avoid storing sensitive information in plain text. |

**UpdateRoomOptions.ModifyFlag Documentation**

|Parameter Name|Type|Required|Description|
|---------|---------|---------|---------|
|`ROOM_NAME`|enum|No|Flag for modifying room name. When updating `roomName` in UpdateRoomOptions, set the `ROOM_NAME` flag.|
|`PASSWORD`|enum|No|Flag for modifying room password. When updating `password` in UpdateRoomOptions, set the `PASSWORD` flag.|

### Step 7: Retrieve the Room Information

After entering a room, call RoomStore’s `getRoomInfo` interface to fetch detailed room information.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.GetRoomInfoCompletionHandler

private val roomID = "test_room_001"

fun getRoomInfo() {
    // 1. Business logic
    // getRoomInfo retrieves detailed info for a specified room
    // Get room name, creator, participant count, permissions, and more

    // 2. Retrieve room info
    // Fetches latest room status and configuration from server
    RoomStore.shared().getRoomInfo(roomID, object : GetRoomInfoCompletionHandler {
        override fun onSuccess(roomInfo: RoomInfo) {
            Log.d("Room", "Room information retrieved successfully, roomInfo: $roomInfo")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to retrieve room information [Error code: $code]: $desc")
        }
    })
}
```

### Step 8: Listen for Real-Time Room Events and State Changes

Subscribe to room-level events. For example, to listen for the room end event:
``` java
import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.widget.FrameLayout
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

class RoomMainView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    // Room event listener
    private val roomListener = object : RoomListener() {
        override fun onRoomEnded(roomInfo: RoomInfo) {
            Log.d("Room", "The current room has ended")
            // Recommended: Close the current page and return to the previous screen
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        // Add room event listener
        RoomStore.shared().addRoomListener(roomListener)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        // Remove listener to prevent memory leaks
        RoomStore.shared().removeRoomListener(roomListener)
    }
}
```

Subscribe to RoomState property changes. For example, listen for changes in the current room information:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// Subscribe to current room info updates
private fun subscribeCurrentRoomState() {
    CoroutineScope(Dispatchers.Main).launch {
        RoomStore.shared().state.currentRoom.collect { roomInfo ->
            Log.d("Room", "Room information updated. New room info: $roomInfo")
        }
    }
}
```

## API Documentation

|Store/Component|Feature Description|API Documentation|
|---------|---------|---------|
|RoomStore|Complete room lifecycle management: create and join, join, leave, end room, update and retrieve room information, room reservation, call members outside the room, listen for passive events such as room dissolution and info updates.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|

## FAQs

### How is the participant count (`participantCount`) in `RoomInfo` updated? What are the timing and frequency?

`participantCount` updates are not strictly real-time. The mechanism is:
- **Active entry/exit**: When a user joins or leaves a room, the participant count notification is triggered instantly. You’ll see changes quickly in `currentRoom` under RoomState.

- **Abnormal disconnects**: If a user disconnects due to network issues or app crashes, the system uses a heartbeat check. Only after missing heartbeats for 90 seconds will the user be considered offline and the count updated.

- **Update mechanism and rate control**:

  - All participant count change notifications are sent as messages in the room, whether triggered instantly or delayed.

  - Each room is limited to **40 messages per second**.

  - **Important**: In high-traffic situations (like a "live comments storm"), if message rates exceed 40/sec, participant count change messages may be dropped to prioritize core messages (such as live comments).

        **What does this mean for developers?**

        `participantCount` is a highly accurate, near real-time estimate. In rare cases with extremely high concurrency, brief delays or data loss may occur. We recommend using it for UI display only—not for billing, statistics, or scenarios requiring absolute precision.

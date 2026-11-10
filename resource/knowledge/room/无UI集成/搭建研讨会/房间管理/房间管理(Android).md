---
sync_node_id: '207623896664072192'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建研讨会"
  - "房间管理"
  - "房间管理（Android）"
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
| Core Concept | Type | Core Responsibilities & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-info/index.html">RoomInfo</a> | <code>data class</code> | Data model representing room information, including all details and state management.<br>Key features:<br>- Room info management (ID, name, creator).<br>- Real-time status tracking (member count, room status, creation time).<br>- Permission control (device and message management) . |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-state/index.html">RoomState</a> | <code>data class</code> | Maintains the user's room-related state.<br>Key property:<br>- <code>currentRoom</code> represents the room state for the current user. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/index.html">RoomListener</a> | <code>abstract class</code> | Represents real-time events related to room activity. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html">RoomStore</a> | <code>abstract class</code> | The main class for managing the entire room lifecycle. Supports room management operations and real-time event subscriptions via <code>RoomListener</code>. |

## Implementation Steps

### Step 1: Component Integration

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Implement Login Logic before proceeding.

### Step 2: Host Create and Join Webinar Room

#### Implementation
1. **Configure Room Initialization Parameters**: Initialize `CreateRoomOptions` to set the room name and other attributes.

2. **Set Room Permissions and Member Management**: Define global member permissions, such as muting all members or disabling all cameras.

3. **Create and Join Room**: Call RoomStore's `createAndJoinRoom` API to perform the operation.

   > **Note:**
   > 
   > - We recommend generating the roomID on your backend for global uniqueness and stability.
   > - Prefix webinar room IDs with `webinar_` to distinguish them from standard meeting rooms.

##### Sample Code
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

private val roomID = "webinar_123456"
private val roomType = RoomType.WEBINAR

fun createAndJoinRoom() {
    // 1. Configure room creation parameters
    // CreateRoomOptions defines basic room attributes and member management settings
    val options = CreateRoomOptions(
        roomName = "Team Meeting Room",           // Room display name
        // 2. Set initial room permission controls
        isAllCameraDisabled = false,       // Disable all members' cameras
        isAllMessageDisabled = false,      // Mute all members
        isAllMicrophoneDisabled = false,   // Mute all members
        isAllScreenShareDisabled = false   // Disable screen sharing for all members
    )

    // 3. Call RoomStore to create and join the room
    // This method automatically handles room creation (if it doesn't exist) and joining logic
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

> **Note:**
> Member management settings apply only to regular members; hosts and administrators are not restricted. To adjust member settings or manage individual member permissions after room creation, see the Member Management documentation.
> 

##### createAndJoinRoom API Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>-  <code>STANDARD</code>: Standard room.<br>-  <code>WEBINAR</code>: Large webinar room.<br>For webinar scenarios, use <code>WEBINAR</code>. |
| <code>options</code> | <code>CreateRoomOptions</code> | Yes | - Room creation configuration.<br>- See CreateRoomOptions struct for details. |
| <code>completion</code> | <code>CompletionHandler</code> | No | Completion callback. Returns the result of create and join operation. If failed, returns error code and message. |

##### CreateRoomOptions Struct Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to empty).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- For easy mobile input, use 4–8 digits. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |
| <code>isAllMicrophoneDisabled</code> | <code>Boolean</code> | No | Disable microphones for all members (except host/administrators):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllCameraDisabled</code> | <code>Boolean</code> | No | Disable cameras for all members (except host/administrators):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllScreenShareDisabled</code> | <code>Boolean</code> | No | Disable screen sharing for all members (only host/administrators can share):<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllMessageDisabled</code> | <code>Boolean</code> | No | Mute all members (disable chat):<br>- true: Disabled.<br>- false: Enabled (default). |

### Step 3: Audience Join Webinar Room

Audience members can join a webinar room by calling RoomStore's `joinRoom` API.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

private val roomID = "webinar_123456"
private val roomType = RoomType.WEBINAR

fun joinRoom() {
    // 1. Prepare parameters for joining the room
    // joinRoom is used to join a known and ongoing room

    // 2. Call RoomStore to join the room
    RoomStore.shared().joinRoom(roomID, roomType, completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Joined room successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Room", "Failed to join room [Error code: $code]: $desc")
        }
    })
}
```

> **Note:**
> After entering the room, audience members are in a silent listening state and cannot enable their microphone or camera by default. They can raise their hand to request permission; after host approval, they become a guest and can turn on their microphone. Role changes are handled via `RoomParticipantState`. For details, see Member Management.
> 

##### joinRoom API Parameters
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>-  <code>STANDARD</code>: Standard room.<br>-  <code>WEBINAR</code>: Large webinar room.<br>For webinar scenarios, use <code>WEBINAR</code>. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Use 4–8 digits for easy input. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |
| <code>completion</code> | <code>CompletionHandler</code> | No | Completion callback. Returns the result of join operation. If failed, returns error code and message. |

### Step 4: Leave Room

To leave a room, call RoomStore's `leaveRoom` API.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

fun leaveRoom() {
    // 1. Business logic description
    // leaveRoom is used for regular members or hosts to voluntarily exit the room
    // Unlike endRoom, when the host calls leaveRoom, only they leave; the room remains active

    // 2. Call RoomStore to leave the room
    // This operation stops audio/video streams and notifies the server to remove the current user from the room
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

### Step 5: End Room

When the host wants to dissolve the room, call RoomStore's `endRoom` API. After the room ends, all members receive a room ended event.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

fun endRoom() {
    // 1. Business logic description
    // endRoom is used to permanently dissolve the current room
    // Note: This operation is typically restricted to the host (Owner); after dissolution, all members are forcibly removed

    // 2. Call RoomStore to dissolve the room
    // This method sends a dissolution command to the server and notifies all online members that the room has ended
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

> **Note:**
> - If the host leaves the room without calling [endRoom](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/end-room.html), the room remains active until it meets the auto-recycle condition (default: 10 minutes, configurable via backend).
> - Webinar rooms do not currently support host transfer.

### Step 6: Update Room Information

To update the room name, the host can call RoomStore's `updateRoomInfo` API. All room members will receive a room state change notification after the update.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.UpdateRoomOptions
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

private val roomID = "webinar_123456"

fun updateRoomInfo() {
    // 1. Configure room update parameters
    // UpdateRoomOptions is used to define which room attributes to update
    val options = UpdateRoomOptions(
        roomName = "New Webinar Name"     // Update room display name
    )

    // 2. Set modification flags
    // modifyFlagList specifies which fields to update, supports combining multiple flags
    val modifyFlagList = listOf(UpdateRoomOptions.ModifyFlag.ROOM_NAME)

    // 3. Call RoomStore to update room information
    // This method submits the update request to the server and synchronizes it to all room members
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

##### updateRoomInfo API Parameter Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>options</code> | <code>UpdateRoomOptions</code> | Yes | - Room property update configuration.<br>- See UpdateRoomOptions struct for details. |
| <code>modifyFlagList</code> | <code>List</code> | Yes | - Specifies which properties to update. Webinar rooms currently support updating the room name.<br>- See ModifyFlag documentation for usage. |
| <code>completion</code> | <code>CompletionHandler</code> | No | Completion callback. Returns the result of the update operation. If failed, returns error code and message. |

##### UpdateRoomOptions Struct Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to empty).<br>- Length: 0–60 bytes.<br>- Supports Chinese, English, numbers, and special characters. |
| <code>password</code> | <code>String</code> | No | - Room password. Empty string means no password.<br>- Length: 0–32 bytes.<br>- Use 4–8 digits for easy input. If set, users must enter the password to join. Do not store sensitive info in plain text.<br>Passwords are not supported for webinar rooms; leave empty. |

##### UpdateRoomOptions.ModifyFlag Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>ROOM_NAME</code> | <code>enum</code> | No | - Flag for updating the room name.<br>- When modifying <code>roomName</code>, also set the <code>roomName</code> flag in <code>ModifyFlag</code>. |
| <code>PASSWORD</code> | <code>enum</code> | No | - Flag for updating the room password.<br>- When modifying <code>password</code>, also set the <code>password</code> flag in <code>ModifyFlag</code>.<br>Passwords are not supported for webinar rooms. |

### Step 7: Get Room Information

After joining the room, call RoomStore's `getRoomInfo` API to retrieve detailed room information.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.GetRoomInfoCompletionHandler

private val roomID = "webinar_123456"

fun getRoomInfo() {
    // 1. Business logic description
    // getRoomInfo is used to retrieve detailed information for a specified room
    // You can get the room name, creator, permission settings, and other complete information

    // 2. Call RoomStore to get room information
    // This operation fetches the latest room status and configuration from the server
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

### Step 8: Listen to Real-Time Room Events and State Changes

Subscribe to passive room events. For example, to listen for room ended events:
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
            // Recommended action: Close the current page and return to the previous screen
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

To subscribe to changes in the current room information via RoomState:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// Subscribe to changes in the current room information
private fun subscribeCurrentRoomState() {
    CoroutineScope(Dispatchers.Main).launch {
        RoomStore.shared().state.currentRoom.collect { roomInfo ->
            Log.d("Room", "Room information updated, new room info: $roomInfo")
        }
    }
}
```

## API Documentation

|Store/Component|Description|API Documentation|
|---------|---------|---------|
|RoomStore|Room lifecycle management: create and join / join / leave / end room / update, get room information / listen to passive room events (such as room dissolution, room info updates, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|

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

---
sync_node_id: '207623896772075520'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建研讨会"
  - "成员管理"
  - "成员管理（Android）"
product: "room"
---
`RoomParticipantStore` is a specialized module within `AtomicXCore` designed for managing room participants. It provides essential functionality for conference scenarios, enabling you to build a robust participant management system.

## Feature Overview

The conference participant management module supports comprehensive user information display and permission management within a room:
- **Dual Role List Display:** Dynamically displays both the guest list and audience list, showing nickname, role, and audio status.

- **Role Switching Between Guest and Audience:** Allows hosts or admins to promote audience members to guests with speaking privileges, or demote guests to audience members.

- **Permission Control:** Enables the host or admin to perform actions such as removing participants from the room or muting all members.

- **Hierarchical Management:** Supports differentiated permissions for hosts, admins, guests, and audience members.

## Core Functions
- **Retrieve Guest List:** Fetch the current guest list in the room. Guests can enable their microphones and communicate with other guests via audio.

- **Retrieve Audience List:** Obtain information for current audience members in the room.

- **Search Room Members:** Search for specific users within the room.

- **Promote Audience to Guest:** Promote an audience member to guest status. Promoted users can enable their microphones and communicate with other guests.

- **Demote Guest to Audience:** Demote a guest to audience status. Demoted users lose the ability to interact via audio.

- **Set/Revoke Admin:** Hosts can grant admin privileges to other room members or revoke admin status from existing admins.

- **Remove Member from Room:** Hosts or admins can remove any participant from the room.

## Core Concepts

Key concepts about `RoomParticipantStore` is summarized in the table below:
| Core Concept | Type | Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant/index.html">RoomParticipant</a> | <code>data class</code> | Represents the core data model for guests, encapsulating complete information and state management capabilities, including microphone control.<br>Main functions include: basic guest information management (user ID, user name, avatar, room role), device state management (microphone status, camera status, screen sharing status, message status). |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-state/index.html">RoomParticipantState</a> | <code>data class</code> | Provides the data structure for managing participant states within the room, maintaining relevant status information.<br>Main properties:<br>- <code>participantList</code>: Guest list.<br>- <code>audienceList</code>: Audience list.<br>- <code>adminList</code>: Admin list.<br>- <code>localParticipant</code>: Information about the current user in the room. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-listener/index.html">RoomParticipantListener</a> | <code>abstract class</code> | Handles real-time events related to room members. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-store/index.html">RoomParticipantStore</a> | <code>abstract class</code> | Core class for participant control: manage panelist audio/video, participant roles, subscribe to <code>RoomParticipantListener</code> for real-time events. |

## Implementation Steps

### Step 1: Component Integration

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Implement Login Logic before proceeding.

### Step 2: Retrieve Panelist List

After you join the room, call the `getParticipantList` method of `RoomParticipantStore` to fetch the current panelist list.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipant
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler

fun getParticipantList() {
    // Prerequisite: Join the room and create a RoomParticipantStore instance with the roomID
    val roomID = "webinar_123456"
    val participantStore = RoomParticipantStore.create(roomID)

    // Retrieve panelist list (supports pagination with cursor)
    val initialCursor: String? = null  // null starts from the first page

    participantStore.getParticipantList(initialCursor, object : ListResultCompletionHandler<RoomParticipant> {
        override fun onSuccess(result: List<RoomParticipant>, cursor: String) {
            Log.d("Participant", "Panelist list retrieved, count: ${result.size}")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to retrieve panelist list [Error code: $code]: $desc")
        }
    })
}
```

### Step 3: Retrieve Audience List

After joining the room, use the `getAudienceList` method of `RoomParticipantStore` to get the audience list.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

fun getAudienceList() {
    // Prerequisite: Join the room, and set roomType to WEBINAR
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    // Retrieve audience list (supports pagination with cursor)
    val initialCursor: String? = null

    participantStore.getAudienceList(cursor = initialCursor, completion = object : ListResultCompletionHandler<RoomUser> {
        override fun onSuccess(result: List<RoomUser>, cursor: String) {
            Log.d("Test", "Audience list retrieved, count: ${result.size}")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to retrieve audience list [Error code: $code]: $desc")
        }
    })
}
```

### Step 4: Search Room Members

After you join the room, search for members using the `searchUsers` method of `RoomParticipantStore`.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

fun searchUsers() {
    // Prerequisite: Join the room
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")
    val keyword = "userName"

    participantStore.searchUsers(keyword = keyword, completion = object : ListResultCompletionHandler<RoomUser> {
        override fun onSuccess(result: List<RoomUser>, cursor: String) {
            Log.d("Test", "Room members found, count: ${result.size}")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to search room members [Error code: $code]: $desc")
        }
    })
}
```

### Step 5: Promote Audience to Panelist

As a host or admin, use `promoteAudienceToParticipant` in `RoomParticipantStore` to grant panelist privileges to an audience member.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

fun promoteAudienceToParticipant(userID: String) {
    // Prerequisite: Join the room
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    // Only host/admin can perform this action
    participantStore.promoteAudienceToParticipant(userID = userID, completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Test", "User promoted to panelist successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to promote user to panelist [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to the `onAudiencePromotedToParticipant` event in `RoomParticipantListener` to receive notifications when an audience member is promoted to panelist.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

fun subscribeParticipantEvent() {
    // Prerequisite: Join the room and create a RoomParticipantStore instance
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    val listener = object : RoomParticipantListener() {
        override fun onAudiencePromotedToParticipant(userInfo: RoomUser) {
            Log.d("Test", "Audience promoted to panelist: $userInfo")
        }
    }

    participantStore.addRoomParticipantListener(listener)

    // Remove listener when no longer needed
    // participantStore.removeRoomParticipantListener(listener)
}
```

### Step 6: Demote Panelist to Audience

As a host or admin, use `demoteParticipantToAudience` in `RoomParticipantStore` to move a panelist to the audience role.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

fun demoteParticipantToAudience(userID: String) {
    // Prerequisite: Join the room
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    // Only host/admin can perform this action
    participantStore.demoteParticipantToAudience(userID = userID, completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Test", "User demoted to audience successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to demote user to audience [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to the `onParticipantDemotedToAudience` event in `RoomParticipantListener` to get notified when a panelist is demoted.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

fun subscribeParticipantEvent() {
    // Prerequisite: Join the room and create a RoomParticipantStore instance
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    val listener = object : RoomParticipantListener() {
        override fun onParticipantDemotedToAudience(userInfo: RoomUser) {
            Log.d("Test", "Panelist demoted to audience: $userInfo")
        }
    }

    participantStore.addRoomParticipantListener(listener)

    // Remove listener when no longer needed
    // participantStore.removeRoomParticipantListener(listener)
}
```

### Step 7: Set/Revoke Admin

As the host, use the `setAdmin` method in `RoomParticipantStore` to assign or revoke admin privileges.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

// Assign admin privileges
fun setUserAsAdmin(userID: String) {
    participantStore.setAdmin(userID, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Participant", "User $userID set as admin successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to set admin [Error code: $code]: $desc")
        }
    })
}

// Revoke admin privileges
fun revokeAdmin(userID: String) {
    participantStore.revokeAdmin(userID, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Participant", "Admin privileges revoked for user $userID")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to revoke admin [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to `onAdminSet` and `onAdminRevoked` events in `RoomParticipantListener` to get role change notifications.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onAdminSet(userInfo: RoomUser) {
        Log.d("Participant", "Admin assigned: $userInfo")
    }

    override fun onAdminRevoked(userInfo: RoomUser) {
        Log.d("Participant", "Admin revoked: $userInfo")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 8: Remove Member from Room

As the host or admin, remove a participant by calling `kickUser` on `RoomParticipantStore`.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

fun kickUser(userID: String) {
    // Only host/admin can perform this action; the removed user will exit the room and receive a notification
    participantStore.kickUser(userID, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Participant", "User $userID removed successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to remove user [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to the `onKickedFromRoom` event in `RoomParticipantListener` to handle removal notifications.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.KickedOutOfRoomReason
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onKickedFromRoom(reason: KickedOutOfRoomReason, message: String) {
        Log.d("Participant", "Removed from room: $reason, info: $message")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 9: Close Panelist Media Devices

As the host or admin, use `closeParticipantDevice` in `RoomParticipantStore` to disable a panelist's camera or microphone.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.device.DeviceType
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

fun closeParticipantDevice(userID: String, device: DeviceType) {
    // Only affects panelists; audience members do not have device permissions
    participantStore.closeParticipantDevice(userID, device, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Participant", "Device closed for user $userID, device: $device")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to close device: [Error code: $code]: $desc")
        }
    })
}
```

> **Note:**
> `closeParticipantDevice` is only applicable to guests. Audience members do not have audio/video device permissions and are unaffected by this operation.
> 

Subscribe to the `onParticipantDeviceClosed` event in `RoomParticipantListener` to update UI when a device is disabled.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.device.DeviceType
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onParticipantDeviceClosed(device: DeviceType, operator: RoomUser) {
        Log.d("Participant", "Device $device closed by ${operator.userName}")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 10: Manage In-Meeting Chat Permissions

As the host or admin, mute or unmute a specific user by calling `disableUserMessage` in `RoomParticipantStore`. Muted users are tracked in `messageDisabledUserList`.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

fun disableUserMessage(userID: String, disable: Boolean) {
    // Host/admin can mute/unmute user chat; affected users receive notification
    participantStore.disableUserMessage(userID, disable, object : CompletionHandler {
        override fun onSuccess() {
            val action = if (disable) "Muted" else "Unmuted"
            Log.d("Participant", "$action user $userID successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Participant", "Failed to mute user chat: [Error code: $code]: $desc")
        }
    })
}
```

> **Note:**
> `messageDisabledUserList` is only applicable in conference (Webinar) rooms and maintains the list of individually muted users.
> 

Subscribe to the `onUserMessageDisabled` event in `RoomParticipantListener` to update UI when chat is muted/unmuted.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onUserMessageDisabled(disable: Boolean, operator: RoomUser) {
        val action = if (disable) "Muted" else "Unmuted"
        Log.d("Participant", "Chat $action by ${operator.userName}")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 11: Mute All, Disable All Video

As the host or admin, mute all microphones, disable all cameras, or disable all screen sharing for panelists by calling `disableAllDevices` in `RoomParticipantStore`. When enabled, panelists cannot turn these devices on independently.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.device.DeviceType
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

fun disableAllDevices(device: DeviceType, disable: Boolean) {
    // Host/admin can mute/unmute all devices in the room; all members receive notifications
    participantStore.disableAllDevices(device, disable, object : CompletionHandler {
        override fun onSuccess() {
            val action = if (disable) "Muted" else "Unmuted"
            Log.d("Participant", "${action} all ${device} successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            val action = if (disable) "Muted" else "Unmuted"
            Log.e("Participant", "Failed to ${action} all ${device} [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to the `onAllDevicesDisabled` event in `RoomParticipantListener` to receive mute/unmute status updates.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.device.DeviceType
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onAllDevicesDisabled(device: DeviceType, disable: Boolean, operator: RoomUser) {
        val action = if (disable) "Muted" else "Unmuted"
        Log.d("Participant", "All ${device} ${action} by ${operator.userName}")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 12: Mute All Chat

As the host or admin, mute all chat messages in the room by calling `disableAllMessages` in `RoomParticipantStore`. When enabled, chat is restricted for all participants.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

fun disableAllMessages(disable: Boolean) {
    // Host/admin can mute/unmute chat for all members; notifications sent to all
    participantStore.disableAllMessages(disable, object : CompletionHandler {
        override fun onSuccess() {
            val action = if (disable) "Muted" else "Unmuted"
            Log.d("Participant", "$action chat successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            val action = if (disable) "Muted" else "Unmuted"
            Log.e("Participant", "$action chat failed [Error code: $code]: $desc")
        }
    })
}
```

Subscribe to the `onAllMessagesDisabled` event in `RoomParticipantListener` to update chat mute status.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onAllMessagesDisabled(disable: Boolean, operator: RoomUser) {
        val action = if (disable) "Muted" else "Unmuted"
        Log.d("Participant", "Chat ${action} by ${operator.userName}")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

### Step 13: Listen to Events

Subscribe to `RoomParticipantListener` events. For example, to listen for device requests:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.DeviceRequestInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantListener
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private val participantListener = object : RoomParticipantListener() {
    override fun onDeviceRequestReceived(request: DeviceRequestInfo) {
        Log.d("Participant", "Device request received: ${request.device}, User: ${request.senderUserID}")
    }
}

private fun subscribeParticipantEvents() {
    participantStore.addRoomParticipantListener(participantListener)
}
```

Subscribe to state changes in `RoomParticipantState`, such as monitoring who is currently speaking:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

private val roomID = "webinar_123456"
private val participantStore = RoomParticipantStore.create(roomID)

private fun subscribeParticipantState() {
    CoroutineScope(Dispatchers.Main).launch {
        participantStore.state.speakingUsers.collect { speakingUsers ->
            Log.d("Participant", "Speaking user list updated. Current count: ${speakingUsers.size}")
        }
    }
}
```

## API Documentation

|Store/Component|Feature Description|API Documentation|
|---------|---------|---------|
|**RoomParticipantStore**|In-room participant management: set admin / transfer host / get panelist list / remove from room / panelist device control (e.g., close or invite to open microphone, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-store/index.html)|

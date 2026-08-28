RoomStore is the dedicated module for room management in AtomicXCore, offering seamless integration for in-meeting call features. This guide walks you through developing and integrating in-meeting call functionality using RoomStore.

## Core Features
- **In-Meeting Call**: Any participant in a room can invite users outside the room to join the conference.

- **Retrieve In-Meeting Call User List**: Retrieve the list of users who are currently being called in a specified room.

## Core Concepts

Core concepts in `RoomStore` are summarized in the table below:
| Core Concept | Type | Core Responsibility & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-call-status/index.html">RoomCallStatus</a> | <code>enum class</code> | Indicates the status of an in-meeting call:<br>-  <code>NONE</code> (default)<br>-  <code>CALLING</code> (call in progress)<br>-  <code>TIMEOUT</code> (call timed out)<br>-  <code>REJECTED</code> (call rejected) |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-call-result/index.html">RoomCallResult</a> | <code>enum class</code> | Represents the result of an in-meeting call:<br>-  <code>SUCCESS</code> (call succeeded)<br>-  <code>ALREADY_IN_CALLING</code> (already in a call)<br>-  <code>ALREADY_IN_ROOM</code> (already in the room) |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-call-rejection-reason/index.html">CallRejectionReason</a> | <code>enum class</code> | Specifies the reason for call rejection:<br>-  <code>REJECTED</code> (actively rejected when invited)<br>-  <code>IN_OTHER_ROOM</code> (user is in another room) |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-call/index.html">RoomCall</a> | <code>data class</code> | Core data structure for in-meeting call operations. Stores caller info, callee info, and current call status. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/index.html">RoomListener</a> | <code>abstract class</code> | Handles real-time events for room activity, including in-meeting call events. |
| <a href="https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html">RoomStore</a> | <code>abstract class</code> | Manages the complete room lifecycle. Provides APIs to initiate and respond to in-meeting calls, fetch call lists, and subscribe to RoomListener for real-time call events. |

## Implementation Steps

### Step 1: Integrate the SDK

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have completed the Implement Login Logic before proceeding.

### Step 2: Caller Implementation

#### 1. Initiate a Call

Use `callUserToRoom` in RoomStore to invite multiple users to join a room simultaneously.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.CallUserToRoomCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomCallResult
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private val roomID = "test_room_001"

// Invite users to join the room
fun callUserToRoom(userIDList: List<String>, timeout: Int = 30, extensionInfo: String? = null) {
    RoomStore.shared()
        .callUserToRoom(roomID, userIDList, timeout, extensionInfo, object : CallUserToRoomCompletionHandler {
            override fun onSuccess(result: Map<String, RoomCallResult>) {
                Log.d("Room", "Call request sent successfully")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.d("Room", "Failed to call users: [Error code: $code]: $desc")
            }
        })
}
```

#### 2. Cancel a Call

Use `cancelCall` to revoke ongoing call requests in bulk.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private val roomID = "test_room_001"

// Cancel call requests
fun cancelCall(userIDList: List<String>) {
    RoomStore.shared().cancelCall(roomID, userIDList, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Call cancelled successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to cancel call: [Error code: $code]: $desc")
        }
    })
}
```

#### 3. Retrieve Call List

After entering the room, use `getPendingCalls` to retrieve a paginated list of users currently being called.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.ListResultCompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomCall
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private val roomID = "test_room_001"

// Fetch pending call list
fun getPendingCalls(roomID: String, cursor: String?) {
    RoomStore.shared().getPendingCalls(roomID, cursor, object : ListResultCompletionHandler<RoomCall> {
        override fun onSuccess(result: List<RoomCall>, cursor: String) {
            Log.d("Room", "Call list retrieved: $result, pagination cursor: $cursor")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to retrieve call list: [Error code: $code]: $desc")
        }
    })
}
```

#### 4. Subscribe to In-Meeting Call Events

Subscribe to RoomListener in RoomStore to receive real-time call lifecycle events. Monitor these callbacks to update the UI or handle business logic based on call outcomes.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.CallRejectionReason
import io.trtc.tuikit.atomicxcore.api.room.RoomCall
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

// Subscribe to call-related events
fun subscribeRoomCallEvents() {
    RoomStore.shared().addRoomListener(object : RoomListener() {
        override fun onCallTimeout(roomInfo: RoomInfo, call: RoomCall) {
            Log.d("Room", "Call timed out. Room info: $roomInfo, Caller: ${call.caller}")
        }

        override fun onCallAccepted(roomInfo: RoomInfo, call: RoomCall) {
            Log.d("Room", "Call accepted. Room info: $roomInfo, Callee: ${call.callee}")
        }

        override fun onCallRejected(roomInfo: RoomInfo, call: RoomCall, reason: CallRejectionReason) {
            Log.d("Room", "Call rejected. Room info: $roomInfo, Callee: ${call.callee}, Reason: $reason")
        }

        override fun onCallHandledByOtherDevice(roomInfo: RoomInfo, isAccepted: Boolean) {
            Log.d("Room", "Call handled on another device. Room info: $roomInfo, Result: $isAccepted")
        }
    })
}
```

**Call Event Function Details**

|Event Function|Trigger Timing & Description|
|---------|---------|
|[onCallTimeout](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-timeout.html)|Triggered when the call request receives no response from the callee within the specified timeout period (set in `callUserToRoom`). The call ends automatically, and callers should display a "No answer" prompt.|
|[onCallAccepted](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-accepted.html)|Triggered when the callee clicks "Answer" or "Accept". Both sides have agreed to the call; the caller should enter the room or start streaming immediately.|
|[onCallRejected](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-rejected.html)|Triggered when the callee rejects the call request, or if the callee is in another room. The callback includes the rejection reason (active rejection or in another room).|
|[onCallHandledByOtherDevice](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-handled-by-other-device.html)|Triggered if the user is logged in on multiple devices and the call is handled (accepted/rejected) on one device. The other device receives this event to synchronize UI and dismiss the call interface.|

### Step 3: Callee Implementation

#### 1. Subscribe to In-Meeting Call Events

As the callee, subscribe to RoomListener in RoomStore to monitor call invitations and actions from callers in real time. Use these events to build call notification UI and manage call states.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RoomCall
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

// Subscribe to call-related events
fun subscribeRoomCallEvents() {
    RoomStore.shared().addRoomListener(object : RoomListener() {
        override fun onCallReceived(roomInfo: RoomInfo, call: RoomCall, extensionInfo: String) {
            Log.d("Room", "Received call. Room info: $roomInfo, Caller: ${call.caller}, Extension info: $extensionInfo")
        }

        override fun onCallCancelled(roomInfo: RoomInfo, call: RoomCall) {
            Log.d("Room", "Call cancelled. Room info: $roomInfo, Caller: ${call.caller}")
        }

        override fun onCallRevokedByAdmin(roomInfo: RoomInfo, call: RoomCall, operator: RoomUser) {
            Log.d("Room", "Call revoked by admin. Room info: $roomInfo, Caller: ${call.caller}, Operator: $operator")
        }
    })
}
```

**Event Function Details**

|Event Function|Trigger Timing & Description|
|---------|---------|
|[onCallReceived](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-received.html)|Triggered when you receive a call invitation. Display a "Call Notification" UI with caller and room details, along with "Accept" and "Reject" options.|
|[onCallCancelled](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-cancelled.html)|Triggered when the caller cancels the call request before you respond. Close the call notification UI and show "The caller has cancelled the call" to restore normal flow.|
|[onCallRevokedByAdmin](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-listener/on-call-revoked-by-admin.html)|Triggered when a room admin or backend system forcibly terminates the call (due to permissions, room dissolution, etc). Immediately stop the call process and hide related UI, similar to call cancellation handling.|

#### 2. Accept or Reject a Call

As the callee, use `acceptCall` or `rejectCall` in RoomStore to respond to call invitations.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.CallRejectionReason
import io.trtc.tuikit.atomicxcore.api.room.RoomCall
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

// Subscribe to call-related events
fun subscribeRoomCallEvents() {
    RoomStore.shared().addRoomListener(object : RoomListener() {
        override fun onCallReceived(roomInfo: RoomInfo, call: RoomCall, extensionInfo: String) {
            Log.d("Room", "Received call. Room info: $roomInfo, Caller: ${call.caller}, Extension info: $extensionInfo")
            // Handle accept or reject operation here
        }
    })
}

// Accept call invitation
fun acceptCall(roomID: String) {
    RoomStore.shared().acceptCall(roomID, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Call accepted successfully, Room ID: $roomID")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to accept call: [Error code: $code] $desc")
        }
    })
}

// Reject call invitation
fun rejectCall(roomID: String, reason: CallRejectionReason = CallRejectionReason.REJECTED) {
    RoomStore.shared().rejectCall(roomID, reason, object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Room", "Call rejected successfully, Room ID: $roomID")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.d("Room", "Failed to reject call: [Error code: $code] $desc")
        }
    })
}
```

## API Documentation

|Store/Component|Description|API Documentation|
|---------|---------|---------|
|**RoomStore**|Manages the full room lifecycle: create and join, join, leave, end room, update/retrieve room information, schedule rooms, invite external members, listen for passive room events (such as room dissolution, room info updates, etc).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|

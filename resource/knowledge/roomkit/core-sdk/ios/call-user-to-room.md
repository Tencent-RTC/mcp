`RoomStore` is the dedicated module for room management within `AtomicXCore`, providing seamless integration with in-meeting call functionality. This section offers a comprehensive guide to developing and integrating in-meeting call features using `RoomStore`.

## Core Features
- **In-Meeting Call**: Any participant currently in a room can invite users outside the room to join the meeting.

- **Retrieve In-Meeting Call User List**: Retrieve the list of users currently being called in a specific room.

## Core Concepts

Core concepts in `RoomStore` are summarized in the table below:
| Core Concept | Type | Core Responsibilities & Description |
| --- | --- | --- |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomcallstatus">RoomCallStatus</a> | <code>enum</code> | Indicates the state of an in-meeting call:<br>- <code>none</code> (default).<br>- <code>calling</code> (call in progress).<br>- <code>timeout</code> (call timed out).<br>- <code>rejected</code> (call rejected). |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomcallresult">RoomCallResult</a> | <code>enum</code> | Represents the outcome of an in-meeting call:<br>- <code>success</code> (call succeeded).<br>- <code>alreadyInCalling</code> (user is already being called).<br>- <code>alreadyInRoom</code> (user is already in the room). |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callrejectionreason">CallRejectionReason</a> | <code>enum</code> | Specifies the reason for rejecting a call:<br>- <code>rejected</code> (actively rejected).<br>- <code>inOtherRoom</code> (user is in another room). |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomcall">RoomCall</a> | <code>struct</code> | Core data structure for in-meeting call operations. Stores caller details, callee details, and current call status. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent">RoomEvent</a> | <code>enum</code> | Represents real-time room events, including those related to in-meeting calls. |
| <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore">RoomStore</a> | <code>class</code> | Central class for managing the room lifecycle. Provides functions for initiating and responding to in-meeting calls, retrieving the call list, and subscribing to <code>roomEventPublisher</code> for real-time call events. |

## Implementation Steps

### Step 1: Integrate the Component

Follow the Integration Overview to integrate the AtomicXCore SDK. Make sure you have also completed the Login Logic Implementation.

### Step 2: Caller Implementation

#### 1. Initiate a Call

Use the RoomStore `callUserToRoom` method to invite multiple users to enter the room.
``` swift
import Foundation
import AtomicXCore

// Initiate a call
func callUserToRoom(userIDList: [String], timeout: Int = 30, extensionInfo: String? = nil) {
    RoomStore.shared.callUserToRoom(roomID: "roomID", userIDList: userIDList, timeout: timeout, extensionInfo: extensionInfo) { result in
        switch result {
        case .success(let callResults):
            print("Call request sent successfully")
        case .failure(let error):
            print("Call request failed: [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### 2. Cancel a Call

Use the RoomStore `cancelCall` method to cancel ongoing call requests for multiple users.
``` swift
import Foundation
import AtomicXCore

// Cancel a call
func cancelCall(userIDList: [String]) {
    RoomStore.shared.cancelCall(roomID: "roomID", userIDList: userIDList) { result in
        switch result {
        case .success():
            print("Call cancelled successfully")
        case .failure(let error):
            print("Call cancellation failed: [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### 3. Retrieve Call List Information

After entering the room, use the RoomStore `getPendingCalls` method to fetch the list of users currently being called in the room. This supports pagination.
``` swift
import Foundation
import AtomicXCore

// Retrieve pending call list
func getPendingCalls(roomID: String, cursor: String?) {
    // cursor is used for pagination. Pass nil on the first call to get the initial page; use the previous nextCursor value for subsequent calls.
    RoomStore.shared.getPendingCalls(roomID: roomID, cursor: cursor) { result in
        switch result {
        case .success(let callInfo):
            print("Successfully retrieved call list, list info: \(callInfo.0), pagination cursor: \(callInfo.1)")
        case .failure(let error):
            print("Failed to retrieve call list: [Error code: \(error.code)]: \(error.message)")
        }
    }
}
```

#### 4. Subscribe to In-Meeting Call Events

Subscribe to RoomStore's `roomEventPublisher` to receive real-time call lifecycle events. Listening to these events allows you to track the outcome of calls, update the UI, and trigger further business logic.
``` swift
import Combine
import AtomicXCore
import Foundation

private var cancellableSet = Set<AnyCancellable>()

/// Subscribe to in-meeting call related events
private func subscribeRoomCallEvents() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main)
        .sink { event in
            switch event {
            case .onCallTimeout(let roomInfo, let call):
                print("Call timed out Room info: \(roomInfo), Caller: \(call.caller)")
            case .onCallAccepted(let roomInfo, let call):
                print("Call accepted Room info: \(roomInfo), Callee: \(call.callee)")
            case .onCallRejected(let roomInfo, let call, let reason):
                print("Call rejected Room info: \(roomInfo), Callee: \(call.callee), Rejection reason: \(reason)")
            case .onCallHandledByOtherDevice(let roomInfo, let isAccepted):
                print("Call handled by another device Room info: \(roomInfo) Result: \(isAccepted)")
            default:
                // Handle other non-call related events
                break
            }
        }
        .store(in: &cancellableSet)
}
```

**Call Event Functions**

|Event Function|Trigger Timing & Description|
|---------|---------|
|[onCallTimeout](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncalltimeout(roominfo:call:))|Triggered when the call request receives no response from the callee within the specified timeout period (set in `callUserToRoom`). The call ends automatically, and callers should display a "No answer" prompt.|
|[onCallAccepted](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallaccepted(roominfo:call:))|Triggered when a callee clicks "Answer" or "Accept". Both parties have confirmed the call, and the caller should immediately enter the room or start streaming.|
|[onCallRejected](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallrejected(roominfo:call:reason:))|Triggered when the callee rejects the call or is already in another room, resulting in automatic rejection. Includes the rejection reason (active rejection or in another room).|
|[onCallHandledByOtherDevice](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallhandledbyotherdevice(roominfo:isaccepted:))|Triggered when a user logged in on multiple devices (e.g., phone and tablet) answers or rejects a call on one device. The other device receives this notification to synchronize UI and dismiss the call interface.|

### Step 3: Callee Implementation

#### 1. Subscribe to In-Meeting Call Events

Subscribe to RoomStore's `roomEventPublisher` to listen for call actions from the caller in real time. These events help build the call notification UI and maintain the call chain state.
``` swift
import Combine
import AtomicXCore
import Foundation

private var cancellableSet = Set<AnyCancellable>()

/// Subscribe to in-meeting call related events
private func subscribeRoomCallEvents() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main)
        .sink { [weak self] event in
            guard let self = self else { return }
            switch event {
            case .onCallReceived(let roomInfo, let call, let extensionInfo):
                print("Received room call Room info: \(roomInfo), Caller: \(call.caller), Extension info: \(extensionInfo)")
            case .onCallCancelled(let roomInfo, let call):
                print("Call cancelled Room info: \(roomInfo), Caller: \(call.caller)")
            case .onCallRevokedByAdmin(let roomInfo, let call, let operatorUser):
                print("Call revoked by admin Room info: \(roomInfo), Caller: \(call.caller), Operator: \(operatorUser)")
            default:
                // Handle other non-call related events
                break
            }
        }
        .store(in: &cancellableSet)
}
```

**Event Functions**

|Event Function|Trigger Timing & Description|
|---------|---------|
|[onCallReceived](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallreceived(roominfo:call:extensioninfo:))|Triggered when you receive a call invitation from another user. The callee should immediately show a "Call Notification" interface with caller information, room details, and "Answer" and "Reject" options.|
|[onCallCancelled](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallcancelled(roominfo:call:))|Triggered when the caller cancels the call request before you respond. The callee should promptly close the incoming call UI and display a "Caller cancelled the call" message, returning to normal workflow.|
|[onCallRevokedByAdmin](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomevent/oncallrevokedbyadmin(roominfo:call:operator:))|Triggered when a room administrator or backend forcibly terminates the call due to permission changes, room dissolution, etc. The callee should stop the call process and hide related UI, handling it like a call cancellation.|

#### 2. Accept or Reject a Call

Use the RoomStore `acceptCall` or `rejectCall` methods to respond to call invitations.
``` swift
import Combine
import AtomicXCore
import Foundation

private var cancellableSet = Set<AnyCancellable>()

/// Subscribe to in-meeting call related events
private func subscribeRoomCallEvents() {
    RoomStore.shared.roomEventPublisher
        .receive(on: DispatchQueue.main)
        .sink { event in
            switch event {
            case .onCallReceived(let roomInfo, let call, let extensionInfo):
                print("Received room call Room info: \(roomInfo), Caller: \(call.caller), Extension info: \(extensionInfo)")
                // Accept or reject call invitation operations
            default:
                // Handle other non-call related events
                break
            }
        }
        .store(in: &cancellableSet)
}

// Accept call invitation
func acceptCall(roomID: String) {
    RoomStore.shared.acceptCall(roomID: roomID) { result in
        switch result {
        case .success:
            print("Call accepted successfully, Room ID: \(roomID)")
        case .failure(let error):
            print("Call acceptance failed: [Error code: \(error.code)] \(error.message)")
        }
    }
}

// Reject call invitation
func rejectCall(roomID: String, reason: CallRejectionReason = .rejected) {
    RoomStore.shared.rejectCall(roomID: roomID, reason: reason) { result in
        switch result {
        case .success:
            print("Call rejected successfully, Room ID: \(roomID)")
        case .failure(let error):
            print("Call rejection failed: [Error code: \(error.code)] \(error.message)")
        }
    }
}
```

## API Documentation

|**Store/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Room lifecycle management: create and join, join, leave, end room, update and retrieve room info, reserve room, call users outside the room, listen to passive room events (such as room dissolution, updates, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore)|

## Introduction

Co-guest feature enables real-time interaction between hosts and audience members through a seat-based system. `CoGuestStore` provides a comprehensive set of APIs to manage the entire co-guest lifecycle.

> **Important:**
> Always use the factory method **create(liveID:)** with a valid live room ID to create a `CoGuestStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Co-guest state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates about connected users, invitations and applications.
>

> **Warning:**
> If a co-guest request does not receive a response within the specified timeout, an event with `NoResponseReason.timeout` will be triggered. Always handle timeout scenarios in your UI.
>

## Features
- **Bidirectional Invitation**: Hosts can invite audience members, and audience members can also apply to join.

- **State Management**: Real-time tracking of connected users, invitations and applications.

- **Event-Driven Architecture**: Provides separate event streams for host and guest roles.

- **Timeout Handling**: Built-in timeout mechanism for invitations and applications.

## Subscribable Data

**CoGuestState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|connected|[SeatUserInfo]|List of users already on seats.|
|invitees|[LiveUserInfo]|List of users invited by host.|
|applicants|[LiveUserInfo]|List of users who applied for co-guest received by host.|
|candidates|[LiveUserInfo]|List of candidate users for co-guest.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create object instance.|
|hostEventPublisher|Host-side event publisher.|
|guestEventPublisher|Guest-side event publisher.|
|applyForSeat|Guest applies for co-guest.|
|cancelApplication|Guest cancels application.|
|acceptApplication|Host accepts application.|
|rejectApplication|Host rejects application.|
|inviteToSeat|Host invites guest to co-guest.|
|cancelInvitation|Host cancels invitation.|
|acceptInvitation|Guest accepts invitation.|
|rejectInvitation|Guest rejects invitation.|
|disConnect|End co-guest session.|

### Creating Instance

#### create

Create CoGuestStore instance.
``` swift
public static func create(liveID: String) -> CoGuestStore {
    let store: CoGuestStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
    return store
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|

### Observing State and Events

#### hostEventPublisher

Host-side event publisher.

Host event publisher.

**Data Structures：**HostEvent

#### guestEventPublisher

Guest-side event publisher.

Guest event publisher.

**Data Structures：**GuestEvent

### Guest Operations

#### applyForSeat

Apply to go on seat.
``` swift
public func applyForSeat(seatIndex: Int = -1, timeout: TimeInterval, extraInfo: String?, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

Request to join co-guest session as an audience member.

After calling this method, a co-guest request is sent to all hosts in the live room. The request will remain active until:
• Host accepts via **acceptApplication**
• Host rejects via **rejectApplication**
• Timeout expires
• You cancel via **cancelApplication**.

**Version**

Supported since version 3.5.

**Notes**

> **Note:**
> If no host responds within the timeout, {ref2} event with **NoResponseReason/timeout** will be triggered.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index, -1 means auto-assign seat.|
|timeout|TimeInterval|Timeout (unit: seconds).|
|extraInfo|String?|Extra information.|
|completion|CompletionClosure?|Completion callback.|

#### cancelApplication

Cancel seat application.
``` swift
public func cancelApplication(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

Cancel a previously sent co-guest application. After calling this method, all hosts will be notified of the application cancellation.

**Version**

Supported since version 3.5.

**Notes**

> **Note:**
> If the application has already been processed by a host, the cancellation may have no effect.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### acceptApplication

Accept seat application.
``` swift
public func acceptApplication(userID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### rejectApplication

Reject seat application.
``` swift
public func rejectApplication(userID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

### Host Operations

#### inviteToSeat

Invite audience to seat.
``` swift
public func inviteToSeat(userID: String, seatIndex: Int = -1, timeout: TimeInterval, extraInfo: String?, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|Invited user ID.|
|seatIndex|Int|Seat index, -1 means auto-assign seat.|
|timeout|TimeInterval|Timeout in seconds. Please set a value between 5 and 1800 seconds.|
|extraInfo|String?|Extra information.|
|completion|CompletionClosure?|Completion callback.|

#### cancelInvitation

Cancel seat invitation.
``` swift
public func cancelInvitation(inviteeID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviteeID|String|Invited user ID.|
|completion|CompletionClosure?|Completion callback.|

#### acceptInvitation

Accept seat invitation.
``` swift
public func acceptInvitation(inviterID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String|Inviter user ID.|
|completion|CompletionClosure?|Completion callback.|

#### rejectInvitation

Reject seat invitation.
``` swift
public func rejectInvitation(inviterID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String|Inviter user ID.|
|completion|CompletionClosure?|Completion callback.|

### Connection Control

#### disConnect

Disconnect co-guest.
``` swift
public func disConnect(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

## Data Structures

### NoResponseReason

Reason for no response to co-guest invitation sent by host or co-guest request initiated by audience.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|timeout|0|Request timeout.|
|alreadySeated|1|User already on seat.|

### HostEvent

Callback events received on host side.

|**Enum Value**|**Description**|
|---------|---------|
|onGuestApplicationReceived|This callback is triggered when an audience applies for co-guest.|
|onGuestApplicationCancelled|This callback is triggered when an audience cancels co-guest application.|
|onGuestApplicationProcessedByOtherHost|This callback is triggered when an audience's co-guest application is processed by another host.|
|onHostInvitationResponded|This callback is triggered when a co-guest invitation sent by host receives a response from audience.|
|onHostInvitationNoResponse|This callback is triggered when a co-guest invitation sent by host receives no response.|

### GuestEvent

Callback events received on guest side.

|**Enum Value**|**Description**|
|---------|---------|
|onHostInvitationReceived|This callback is triggered when receiving a co-guest invitation from host.|
|onHostInvitationCancelled|This callback is triggered when host cancels co-guest invitation.|
|onGuestApplicationResponded|This callback is triggered when audience's co-guest application receives a response from host.|
|onGuestApplicationNoResponse|This callback is triggered when audience's co-guest application receives no response.|
|onKickedOffSeat|This callback is triggered when audience is kicked off seat by host.|

### CoGuestState

Co-guest related state data provided externally by CoGuestStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|connected|[SeatUserInfo]|List of users already on seats.|
|invitees|[LiveUserInfo]|List of users invited by host.|
|applicants|[LiveUserInfo]|List of users who applied for co-guest received by host.|
|candidates|[LiveUserInfo]|List of candidate users for co-guest.|

## Usage Example
``` swift
// Create store instance
let store = CoGuestStore.create(liveID: "live_room_123")
// Subscribe to state changes
store.state.subscribe { state in
    print("Connected users: \(state.connected.count)")
    print("Pending applications: \(state.applicants.count)")
}
// Subscribe to host events (for hosts)
store.hostEventPublisher.sink { event in
    switch event {
    case .onGuestApplicationReceived(let guestUser):
        print("Received application from \(guestUser.userName)")
        // Show accept/reject UI
    case .onHostInvitationResponded(let isAccept, let guestUser):
        print("Audience \(guestUser.userName) \(isAccept ? "accepted" : "rejected")")
    default:
        break
    }
}
// Host: Accept application
store.acceptApplication(userID: "user_456") { code, message in
    if code == 0 {
        print("Application accepted successfully")
    }
}
```

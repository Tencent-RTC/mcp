## Introduction

Co-guest feature enables real-time interaction between hosts and audience members through a seat-based system. `CoGuestStore` provides a comprehensive set of APIs to manage the entire co-guest lifecycle.

> **Important:**
> Always use the factory method **CoGuestStore.create** with a valid live room ID to create a `CoGuestStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Co-guest state updates are delivered through the **coGuestState** publisher. Subscribe to it to receive real-time updates about connected users, invitations and applications.
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
|connected|StateFlow<List<SeatUserInfo>>|List of users already on seats.|
|invitees|StateFlow<List<LiveUserInfo>>|List of users invited by host.|
|applicants|StateFlow<List<LiveUserInfo>>|List of users who applied for co-guest received by host.|
|candidates|StateFlow<List<LiveUserInfo>>|List of candidate users for co-guest.|

## API List

|**Function**|**Description**|
|---------|---------|
|CoGuestStore.create|Create object instance.|
|addHostListener|Host-side event callbacks.|
|removeHostListener|Host-side event callbacks.|
|addGuestListener|Guest-side event callbacks.|
|removeGuestListener|Guest-side event callbacks.|
|applyForSeat|Guest applies for co-guest.|
|cancelApplication|Guest cancels application.|
|acceptApplication|Host accepts application.|
|rejectApplication|Host rejects application.|
|inviteToSeat|Host invites guest to co-guest.|
|cancelInvitation|Host cancels invitation.|
|acceptInvitation|Guest accepts invitation.|
|rejectInvitation|Guest rejects invitation.|
|disconnect|End co-guest session.|

### Creating Instance

#### CoGuestStore.create

Create object instance.

### Observing State and Events

#### addHostListener

Add host-side event callback listener.
``` kotlin
abstract fun addHostListener(
    listener: HostListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|HostListener?|Listener.|

#### removeHostListener

Remove host-side event callback listener.
``` kotlin
abstract fun removeHostListener(
    listener: HostListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|HostListener?|Listener.|

#### addGuestListener

Add guest-side event callback listener.
``` kotlin
abstract fun addGuestListener(
    listener: GuestListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|GuestListener?|Listener.|

#### removeGuestListener

Remove guest-side event callback listener.
``` kotlin
abstract fun removeGuestListener(
    listener: GuestListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|GuestListener?|Listener.|

### Guest Operations

#### applyForSeat

Apply to go on seat.
``` kotlin
abstract fun applyForSeat(
    seatIndex: Int,
    timeout: Int,
    extraInfo: String?,
    completion: CompletionHandler?
)
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
> If no host responds within the timeout, {ref2} event with **NoResponseReason.TIMEOUT** will be triggered.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index, -1 means auto-assign seat.|
|timeout|Int|Timeout (unit: seconds).|
|extraInfo|String?|Extra information.|
|completion|CompletionHandler?|Completion callback.|

#### cancelApplication

Cancel seat application.
``` kotlin
abstract fun cancelApplication(
    completion: CompletionHandler?
)
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
|completion|CompletionHandler?|Completion callback.|

#### acceptApplication

Accept seat application.
``` kotlin
abstract fun acceptApplication(
    userID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### rejectApplication

Reject seat application.
``` kotlin
abstract fun rejectApplication(
    userID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|completion|CompletionHandler?|Completion callback.|

### Host Operations

#### inviteToSeat

Invite audience to seat.
``` kotlin
abstract fun inviteToSeat(
    inviteeID: String?,
    seatIndex: Int,
    timeout: Int,
    extraInfo: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviteeID|String?|Invited user ID.|
|seatIndex|Int|Seat index, -1 means auto-assign seat.|
|timeout|Int|Timeout in seconds. Please set a value between 5 and 1800 seconds.|
|extraInfo|String?|Extra information.|
|completion|CompletionHandler?|Completion callback.|

#### cancelInvitation

Cancel seat invitation.
``` kotlin
abstract fun cancelInvitation(
    inviteeID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviteeID|String?|Invited user ID.|
|completion|CompletionHandler?|Completion callback.|

#### acceptInvitation

Accept seat invitation.
``` kotlin
abstract fun acceptInvitation(
    inviterID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String?|Inviter user ID.|
|completion|CompletionHandler?|Completion callback.|

#### rejectInvitation

Reject seat invitation.
``` kotlin
abstract fun rejectInvitation(
    inviterID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String?|Inviter user ID.|
|completion|CompletionHandler?|Completion callback.|

### Connection Control

#### disconnect

End co-guest session.

## Data Structures

### NoResponseReason

Reason for no response to co-guest invitation sent by host or co-guest request initiated by audience.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|TIMEOUT|0|Request timeout.|
|ALREADY_SEATED|1|User already on seat.|

### HostListener

Callback events received on host side.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onGuestApplicationReceived|This callback is triggered when an audience applies for co-guest.|
|onGuestApplicationCancelled|This callback is triggered when an audience cancels co-guest application.|
|onGuestApplicationProcessedByOtherHost|This callback is triggered when an audience's co-guest application is processed by another host.|
|onHostInvitationResponded|This callback is triggered when a co-guest invitation sent by host receives a response from audience.|
|onHostInvitationNoResponse|This callback is triggered when a co-guest invitation sent by host receives no response.|

### GuestListener

Callback events received on guest side.

**Methods**

|**Method**|**Description**|
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
|connected|StateFlow<List<SeatUserInfo>>|List of users already on seats.|
|invitees|StateFlow<List<LiveUserInfo>>|List of users invited by host.|
|applicants|StateFlow<List<LiveUserInfo>>|List of users who applied for co-guest received by host.|
|candidates|StateFlow<List<LiveUserInfo>>|List of candidate users for co-guest.|

## Usage Example
``` kotlin
// Create store instance
val store = CoGuestStore.create("live_room_123")
// Subscribe to state changes
lifecycleScope.launch {
    store.coGuestState.connected.collect { connected ->
        println("Connected users: ${connected.size}")
    }
}
// Add host event listener (for hosts)
store.addHostListener(object : HostListener() {
    override fun onGuestApplicationReceived(guestUser: LiveUserInfo) {
        println("Received application from ${guestUser.userName}")
        // Show accept/reject UI
    }
    override fun onHostInvitationResponded(isAccept: Boolean, guestUser: LiveUserInfo) {
        println("Audience ${guestUser.userName} ${if (isAccept) "accepted" else "rejected"}")
    }
})
// Host: Accept application
store.acceptApplication("user_456") { code, message ->
    if (code == 0) {
        println("Application accepted successfully")
    }
}
```

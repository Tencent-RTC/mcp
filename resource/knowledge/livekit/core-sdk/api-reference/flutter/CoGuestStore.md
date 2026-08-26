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
|connected|ValueListenable<List<SeatUserInfo>>|List of users already on seats.|
|invitees|ValueListenable<List<LiveUserInfo>>|List of users invited by host.|
|applicants|ValueListenable<List<LiveUserInfo>>|List of users who applied for co-guest received by host.|
|candidates|ValueListenable<List<LiveUserInfo>>|List of candidate users for co-guest.|

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
``` dart
void addHostListener(HostListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|HostListener|Listener.|

#### removeHostListener

Remove host-side event callback listener.
``` dart
void removeHostListener(HostListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|HostListener|Listener.|

#### addGuestListener

Add guest-side event callback listener.
``` dart
void addGuestListener(GuestListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|GuestListener|Listener.|

#### removeGuestListener

Remove guest-side event callback listener.
``` dart
void removeGuestListener(GuestListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|GuestListener|Listener.|

### Guest Operations

#### applyForSeat

Apply to go on seat.
``` dart
Future<CompletionHandler> applyForSeat({
    required int seatIndex,
    required int timeout,
    String? extraInfo,
});
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
> If no host responds within the timeout, {ref2} event with **NoResponseReason.timeout** will be triggered.
>

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|int|Seat index, -1 means auto-assign seat.|
|timeout|int|Timeout (unit: seconds).|
|extraInfo|String?|Extra information.|

#### cancelApplication

Cancel seat application.
``` dart
Future<CompletionHandler> cancelApplication();
```

Cancel a previously sent co-guest application. After calling this method, all hosts will be notified of the application cancellation.

**Version**

Supported since version 3.5.

**Notes**

> **Note:**
> If the application has already been processed by a host, the cancellation may have no effect.
>

#### acceptApplication

Accept seat application.
``` dart
Future<CompletionHandler> acceptApplication(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### rejectApplication

Reject seat application.
``` dart
Future<CompletionHandler> rejectApplication(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

### Host Operations

#### inviteToSeat

Invite audience to seat.
``` dart
Future<CompletionHandler> inviteToSeat({
    required String inviteeID,
    required int seatIndex,
    required int timeout,
    String? extraInfo,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviteeID|String|Invited user ID.|
|seatIndex|int|Seat index, -1 means auto-assign seat.|
|timeout|int|Timeout in seconds. Please set a value between 5 and 1800 seconds.|
|extraInfo|String?|Extra information.|

#### cancelInvitation

Cancel seat invitation.
``` dart
Future<CompletionHandler> cancelInvitation(String inviteeID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviteeID|String|Invited user ID.|

#### acceptInvitation

Accept seat invitation.
``` dart
Future<CompletionHandler> acceptInvitation(String inviterID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String|Inviter user ID.|

#### rejectInvitation

Reject seat invitation.
``` dart
Future<CompletionHandler> rejectInvitation(String inviterID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|inviterID|String|Inviter user ID.|

### Connection Control

#### disconnect

End co-guest session.

## Data Structures

### NoResponseReason

Reason for no response to co-guest invitation sent by host or co-guest request initiated by audience.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|timeout|0|Request timeout.|
|alreadySeated|1|User already on seat.|

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
|connected|ValueListenable<List<SeatUserInfo>>|List of users already on seats.|
|invitees|ValueListenable<List<LiveUserInfo>>|List of users invited by host.|
|applicants|ValueListenable<List<LiveUserInfo>>|List of users who applied for co-guest received by host.|
|candidates|ValueListenable<List<LiveUserInfo>>|List of candidate users for co-guest.|

## Usage Example
``` dart
// Create store instance
final store = CoGuestStore.create('live_room_123');
// Define listeners
late final VoidCallback connectedListener = _onConnectedChanged;
late final VoidCallback applicantsListener = _onApplicantsChanged;
void _onConnectedChanged() {
    print('Connected users: ${store.coGuestState.connected.value.length}');
}
void _onApplicantsChanged() {
    print('Pending applications: ${store.coGuestState.applicants.value.length}');
}
// Subscribe to state changes
store.coGuestState.connected.addListener(connectedListener);
store.coGuestState.applicants.addListener(applicantsListener);
// Add host event listener (for hosts)
final hostListener = HostListener(
    onGuestApplicationReceived: (guestUser) {
        print('Received application from ${guestUser.userName}');
        // Show accept/reject UI
    },
    onHostInvitationResponded: (isAccept, guestUser) {
        print('Audience ${guestUser.userName} ${isAccept ? "accepted" : "rejected"}');
    },
);
store.addHostListener(hostListener);
// Host: Accept application
final result = await store.acceptApplication('user_456');
if (result.code == 0) {
    print('Application accepted successfully');
}
// Unsubscribe when done
store.coGuestState.connected.removeListener(connectedListener);
store.coGuestState.applicants.removeListener(applicantsListener);
store.removeHostListener(hostListener);
```

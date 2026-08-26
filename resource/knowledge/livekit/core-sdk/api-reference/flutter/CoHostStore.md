## Introduction

Cross-room connection feature allows hosts from different live rooms to interact in real-time. `CoHostStore` provides a comprehensive set of APIs to manage the entire cross-room connection lifecycle.

> **Important:**
> Always use the factory method **CoHostStore.create** with a valid live room ID to create a `CoHostStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Connection state updates are delivered through the **coHostState** publisher. Subscribe to it to receive real-time updates about connection status, connected hosts, invitations and applications.
>

> **Warning:**
> If a connection request does not receive a response within the specified timeout, the timeout event will be triggered. Always handle timeout scenarios in your UI.
>

## Features
- **Bidirectional Connection**: Hosts can initiate connection requests to other hosts, and also receive connection requests from other hosts.

- **State Management**: Real-time tracking of connection status, connected hosts, invitation list and applicants.

- **Event-Driven Architecture**: Provides connection event stream for monitoring various connection state changes.

- **Layout Templates**: Supports multiple connection layout templates, such as dynamic grid layout and 1-to-6 layout.

## Subscribable Data

**CoHostState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|coHostStatus|ValueListenable<CoHostStatus>|Real-time cross-room connection status.|
|connected|ValueListenable<List<SeatUserInfo>>|List of hosts currently connected with current live room.|
|invitees|ValueListenable<List<SeatUserInfo>>|List of hosts to whom requests have been sent.|
|applicant|ValueListenable<SeatUserInfo?>|Host who initiated connection request to current live room.|
|candidatesCursor|ValueListenable<String>|Recommended user list cursor.|
|candidates|ValueListenable<List<SeatUserInfo>>|Recommended user list.|

## API List

|**Function**|**Description**|
|---------|---------|
|CoHostStore.create|Create object instance.|
|addCoHostListener|Connection event callbacks.|
|removeCoHostListener|Connection event callbacks.|
|requestHostConnection|Initiate connection request.|
|cancelHostConnection|Cancel connection request.|
|acceptHostConnection|Accept connection request.|
|rejectHostConnection|Reject connection request.|
|exitHostConnection|Exit connection.|
|muteRemoteHostAudio|Mute/unmute remote host's audio.|
|getCoHostCandidates|Get recommended host list.|

### Creating Instance

#### CoHostStore.create

Create object instance.

### Observing State and Events

#### addCoHostListener

Add connection callback listener.
``` dart
void addCoHostListener(CoHostListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CoHostListener|Listener.|

#### removeCoHostListener

Remove connection callback listener.
``` dart
void removeCoHostListener(CoHostListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CoHostListener|Listener.|

### Connection Operations

#### requestHostConnection

Initiate host connection request.
``` dart
Future<CompletionHandler> requestHostConnection({
    required String targetHostLiveID,
    required CoHostLayoutTemplate layoutTemplate,
    required int timeout,
    String extraInfo = '',
});
```

Initiate a cross-room connection request to target host.

After calling this method, a connection request is sent to the target host. The request will remain active until:
• Target host accepts via **acceptHostConnection(fromHostLiveID:completion:)**
• Target host rejects via **rejectHostConnection(fromHostLiveID:completion:)**
• Timeout expires
• You cancel via **cancelHostConnection(toHostLiveID:completion:)**.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|targetHostLiveID|String|Target host's live room ID.|
|layoutTemplate|CoHostLayoutTemplate|Connection layout template.|
|timeout|int|Timeout in seconds. The maximum limit is 30 seconds.|
|extraInfo|String?|Extension information.|

#### cancelHostConnection

Cancel host connection request.
``` dart
Future<CompletionHandler> cancelHostConnection(String toHostLiveID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|toHostLiveID|String|Target host's live room ID.|

#### acceptHostConnection

Accept host connection request.
``` dart
Future<CompletionHandler> acceptHostConnection(String fromHostLiveID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String|Live room ID of the host initiating connection request.|

#### rejectHostConnection

Reject host connection request.
``` dart
Future<CompletionHandler> rejectHostConnection(String fromHostLiveID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String|Live room ID of the host initiating connection request.|

#### exitHostConnection

Exit host connection.
``` dart
Future<CompletionHandler> exitHostConnection();
```

**Version**

Supported since version 3.5.

#### muteRemoteHostAudio

Mute or unmute the audio of a remote host.
``` dart
Future<CompletionHandler> muteRemoteHostAudio({
    required String liveID,
    required bool isMuted,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID of the remote host.|
|isMuted|bool|Whether to mute the remote host's audio. `true` means mute, `false` means unmute.|

#### getCoHostCandidates

Get recommended host list that can connect with current host.
``` dart
Future<CompletionHandler> getCoHostCandidates(String cursor);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Cursor.|

## Data Structures

### CoHostStatus

Current user's cross-room connection status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|connected|0|Currently connected with other hosts.|
|disconnected|1|Not connected with other hosts.|

### CoHostLayoutTemplate

Connection layout template.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|hostVoiceConnection|2|Voice chat room connection layout.|
|hostVideoLandscapeFixed2Seats|400|Host video landscape fixed 2 seats layout.|
|hostDynamicGrid|600|Host dynamic grid layout.|
|hostDynamic1v6|601|Host dynamic 1v6 layout.|
|hostVideoLeftFocus9Seats|602|Host video left focus 9 seats layout.|
|hostVideoUniformGrid9Seats|603|Host video uniform grid 9 seats layout.|

### CoHostListener

Connection request callback events.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onCoHostRequestReceived|This callback is triggered when a connection request is received.|
|onCoHostRequestCancelled|This callback is triggered when a connection request is cancelled.|
|onCoHostRequestAccepted|This callback is triggered when a connection request is accepted.|
|onCoHostRequestRejected|This callback is triggered when a connection request is rejected.|
|onCoHostRequestTimeout|This callback is triggered when a connection request times out.|
|onCoHostUserJoined|This callback is triggered when a user joins the connection.|
|onCoHostUserLeft|This callback is triggered when a user leaves the connection.|

### CoHostState

Cross-room connection related state data provided externally by CoHostStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|coHostStatus|ValueListenable<CoHostStatus>|Real-time cross-room connection status.|
|connected|ValueListenable<List<SeatUserInfo>>|List of hosts currently connected with current live room.|
|invitees|ValueListenable<List<SeatUserInfo>>|List of hosts to whom requests have been sent.|
|applicant|ValueListenable<SeatUserInfo?>|Host who initiated connection request to current live room.|
|candidatesCursor|ValueListenable<String>|Recommended user list cursor.|
|candidates|ValueListenable<List<SeatUserInfo>>|Recommended user list.|

## Usage Example
``` dart
// Create store instance
final store = CoHostStore.create('live_room_123');
// Define listeners
late final VoidCallback statusListener = _onStatusChanged;
late final VoidCallback connectedListener = _onConnectedChanged;
void _onStatusChanged() {
    print('Connection status: ${store.coHostState.coHostStatus.value}');
}
void _onConnectedChanged() {
    print('Connected hosts: ${store.coHostState.connected.value.length}');
}
// Subscribe to state changes
store.coHostState.coHostStatus.addListener(statusListener);
store.coHostState.connected.addListener(connectedListener);
// Add connection event listener
final coHostListener = CoHostListener(
    onCoHostRequestReceived: (inviter, extensionInfo) {
        print('Received connection request from ${inviter.userName}');
        // Show accept/reject UI
    },
    onCoHostRequestAccepted: (invitee) {
        print('Connection request accepted by ${invitee.userName}');
    },
    onCoHostUserJoined: (userInfo) {
        print('Host ${userInfo.userName} joined connection');
    },
);
store.addCoHostListener(coHostListener);
// Initiate connection request
final result = await store.requestHostConnection(
    targetHostLiveID: 'target_live_id',
    layoutTemplate: CoHostLayoutTemplate.hostDynamicGrid,
    timeout: 30,
    extraInfo: '',
);
if (result.code == 0) {
    print('Connection request sent successfully');
}
// Unsubscribe when done
store.coHostState.coHostStatus.removeListener(statusListener);
store.coHostState.connected.removeListener(connectedListener);
store.removeCoHostListener(coHostListener);
```

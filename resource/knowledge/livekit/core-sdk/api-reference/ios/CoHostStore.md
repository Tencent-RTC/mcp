## Introduction

Cross-room connection feature allows hosts from different live rooms to interact in real-time. `CoHostStore` provides a comprehensive set of APIs to manage the entire cross-room connection lifecycle.

> **Important:**
> Always use the factory method **create(liveID:)** with a valid live room ID to create a `CoHostStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Connection state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates about connection status, connected hosts, invitations and applications.
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
|coHostStatus|CoHostStatus|Real-time cross-room connection status.|
|connected|[SeatUserInfo]|List of hosts currently connected with current live room.|
|invitees|[SeatUserInfo]|List of hosts to whom requests have been sent.|
|applicant|SeatUserInfo?|Host who initiated connection request to current live room.|
|candidatesCursor|String|Recommended user list cursor.|
|candidates|[SeatUserInfo]|Recommended user list.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create object instance.|
|coHostEventPublisher|Connection event publisher.|
|requestHostConnection|Initiate connection request.|
|cancelHostConnection|Cancel connection request.|
|acceptHostConnection|Accept connection request.|
|rejectHostConnection|Reject connection request.|
|exitHostConnection|Exit connection.|
|muteRemoteHostAudio|Mute/unmute remote host's audio.|
|getCoHostCandidates|Get recommended host list.|

### Creating Instance

#### create

Create CoHostStore instance.
``` swift
public static func create(liveID: String) -> CoHostStore {
    let store: CoHostStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
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

#### coHostEventPublisher

Connection event publisher.

Connection event publisher.

**Data Structures：**CoHostEvent

### Connection Operations

#### requestHostConnection

Initiate host connection request.
``` swift
public func requestHostConnection(targetHost liveId: String,
                                  layoutTemplate: CoHostLayoutTemplate,
                                  timeout: TimeInterval,
                                  extraInfo: String = "",
                                  completion: CompletionClosure?)
{
    fatalError("\(#function) must be overridden by subclass")
}
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
|liveId|String|Target host's live room ID.|
|layoutTemplate|CoHostLayoutTemplate|Connection layout template.|
|timeout|TimeInterval|Timeout in seconds. The maximum limit is 30 seconds.|
|extraInfo|String|Extension information.|
|completion|CompletionClosure?|Callback for successful request initiation.|

#### cancelHostConnection

Cancel host connection request.
``` swift
public func cancelHostConnection(toHostLiveID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|toHostLiveID|String|Target host's live room ID.|
|completion|CompletionClosure?|Callback for successful cancellation.|

#### acceptHostConnection

Accept host connection request.
``` swift
public func acceptHostConnection(fromHostLiveID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String|Live room ID of the host initiating connection request.|
|completion|CompletionClosure?|Callback for successful acceptance.|

#### rejectHostConnection

Reject host connection request.
``` swift
public func rejectHostConnection(fromHostLiveID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String|Live room ID of the host initiating connection request.|
|completion|CompletionClosure?|Callback for successful rejection.|

#### exitHostConnection

Exit host connection.
``` swift
public func exitHostConnection(completion: CompletionClosure? = nil) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Callback for successful exit from connection.|

#### muteRemoteHostAudio

Mute or unmute the audio of a remote host.
``` swift
public func muteRemoteHostAudio(liveID: String,
                                isMuted: Bool,
                                completion: CompletionClosure?)
{
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID of the remote host.|
|isMuted|Bool|Whether to mute the remote host's audio. `true` means mute, `false` means unmute.|
|completion|CompletionClosure?|Callback for the operation result.|

#### getCoHostCandidates

Get recommended host list that can connect with current host.
``` swift
public func getCoHostCandidates(cursor: String,
                          completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Cursor.|
|completion|CompletionClosure?|Completion callback.|

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

### CoHostEvent

Connection request callback events.

|**Enum Value**|**Description**|
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
|coHostStatus|CoHostStatus|Real-time cross-room connection status.|
|connected|[SeatUserInfo]|List of hosts currently connected with current live room.|
|invitees|[SeatUserInfo]|List of hosts to whom requests have been sent.|
|applicant|SeatUserInfo?|Host who initiated connection request to current live room.|
|candidatesCursor|String|Recommended user list cursor.|
|candidates|[SeatUserInfo]|Recommended user list.|

## Usage Example
``` swift
// Create store instance
let store = CoHostStore.create(liveID: "live_room_123")
// Subscribe to state changes
store.state.subscribe { state in
    print("Connection status: \(state.coHostStatus)")
    print("Connected hosts: \(state.connected.count)")
}
// Subscribe to connection events
store.coHostEventPublisher.sink { event in
    switch event {
    case .onCoHostRequestReceived(let inviter, let extensionInfo):
        print("Received connection request from \(inviter.userName)")
        // Show accept/reject UI
    case .onCoHostRequestAccepted(let invitee):
        print("Connection request accepted by \(invitee.userName)")
    case .onCoHostUserJoined(let userInfo):
        print("Host \(userInfo.userName) joined connection")
    default:
        break
    }
}
// Initiate connection request
store.requestHostConnection(
    targetHost: "target_live_id",
    layoutTemplate: .hostDynamicGrid,
    timeout: 30,
    extraInfo: "",
    completion: { code, message in
        if code == 0 {
            print("Connection request sent successfully")
        }
    }
)
```

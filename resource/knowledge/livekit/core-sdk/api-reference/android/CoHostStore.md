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
|coHostStatus|StateFlow<CoHostStatus>|Real-time cross-room connection status.|
|connected|StateFlow<List<SeatUserInfo>>|List of hosts currently connected with current live room.|
|invitees|StateFlow<List<SeatUserInfo>>|List of hosts to whom requests have been sent.|
|applicant|StateFlow<SeatUserInfo?>|Host who initiated connection request to current live room.|
|candidatesCursor|StateFlow<String>|Recommended user list cursor.|
|candidates|StateFlow<List<SeatUserInfo>>|Recommended user list.|

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
``` kotlin
abstract fun addCoHostListener(
    listener: CoHostListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CoHostListener?|Listener.|

#### removeCoHostListener

Remove connection callback listener.
``` kotlin
abstract fun removeCoHostListener(
    listener: CoHostListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|CoHostListener?|Listener.|

### Connection Operations

#### requestHostConnection

Initiate host connection request.
``` kotlin
abstract fun requestHostConnection(
    targetHostLiveID: String?,
    layoutTemplate: CoHostLayoutTemplate,
    timeout: Int,
    extraInfo: String?,
    completion: CompletionHandler?
)
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
|targetHostLiveID|String?|Target host's live room ID.|
|layoutTemplate|CoHostLayoutTemplate|Connection layout template.|
|timeout|Int|Timeout in seconds. The maximum limit is 30 seconds.|
|extraInfo|String?|Extension information.|
|completion|CompletionHandler?|Callback for successful request initiation.|

#### cancelHostConnection

Cancel host connection request.
``` kotlin
abstract fun cancelHostConnection(
    toHostLiveID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|toHostLiveID|String?|Target host's live room ID.|
|completion|CompletionHandler?|Callback for successful cancellation.|

#### acceptHostConnection

Accept host connection request.
``` kotlin
abstract fun acceptHostConnection(
    fromHostLiveID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String?|Live room ID of the host initiating connection request.|
|completion|CompletionHandler?|Callback for successful acceptance.|

#### rejectHostConnection

Reject host connection request.
``` kotlin
abstract fun rejectHostConnection(
    fromHostLiveID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fromHostLiveID|String?|Live room ID of the host initiating connection request.|
|completion|CompletionHandler?|Callback for successful rejection.|

#### exitHostConnection

Exit host connection.
``` kotlin
abstract fun exitHostConnection(
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Callback for successful exit from connection.|

#### muteRemoteHostAudio

Mute or unmute the audio of a remote host.
``` kotlin
abstract fun muteRemoteHostAudio(
    liveID: String,
    isMuted: Boolean,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID of the remote host.|
|isMuted|Boolean|Whether to mute the remote host's audio. `true` means mute, `false` means unmute.|
|completion|CompletionHandler?|Callback for the operation result.|

#### getCoHostCandidates

Get recommended host list that can connect with current host.
``` kotlin
abstract fun getCoHostCandidates(
    cursor: String,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Cursor.|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### CoHostStatus

Current user's cross-room connection status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|CONNECTED|0|Currently connected with other hosts.|
|DISCONNECTED|1|Not connected with other hosts.|

### CoHostLayoutTemplate

Connection layout template.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|HOST_VOICE_CONNECTION|2|Voice chat room connection layout.|
|HOST_VIDEO_LANDSCAPE_FIXED_2_SEATS|400|Host video landscape fixed 2 seats layout.|
|HOST_DYNAMIC_GRID|600|Host dynamic grid layout.|
|HOST_DYNAMIC_1V6|601|Host dynamic 1v6 layout.|
|HOST_VIDEO_LEFT_FOCUS_9_SEATS|602|Host video left focus 9 seats layout.|
|HOST_VIDEO_UNIFORM_GRID_9_SEATS|603|Host video uniform grid 9 seats layout.|

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
|coHostStatus|StateFlow<CoHostStatus>|Real-time cross-room connection status.|
|connected|StateFlow<List<SeatUserInfo>>|List of hosts currently connected with current live room.|
|invitees|StateFlow<List<SeatUserInfo>>|List of hosts to whom requests have been sent.|
|applicant|StateFlow<SeatUserInfo?>|Host who initiated connection request to current live room.|
|candidatesCursor|StateFlow<String>|Recommended user list cursor.|
|candidates|StateFlow<List<SeatUserInfo>>|Recommended user list.|

## Usage Example
``` kotlin
// Create store instance
val store = CoHostStore.create("live_room_123")
// Subscribe to state changes
lifecycleScope.launch {
    store.coHostState.coHostStatus.collect { status ->
        println("Connection status: $status")
    }
}
lifecycleScope.launch {
    store.coHostState.connected.collect { connected ->
        println("Connected hosts: ${connected.size}")
    }
}
// Add connection event listener
store.addCoHostListener(object : CoHostListener() {
    override fun onCoHostRequestReceived(inviter: SeatUserInfo, extensionInfo: String) {
        println("Received connection request from ${inviter.userName}")
        // Show accept/reject UI
    }
    override fun onCoHostRequestAccepted(invitee: SeatUserInfo) {
        println("Connection request accepted by ${invitee.userName}")
    }
    override fun onCoHostUserJoined(userInfo: SeatUserInfo) {
        println("Host ${userInfo.userName} joined connection")
    }
})
// Initiate connection request
store.requestHostConnection(
    targetHostLiveID = "target_live_id",
    layoutTemplate = CoHostLayoutTemplate.HOST_DYNAMIC_GRID,
    timeout = 30,
    extraInfo = "",
    completion = { code, message ->
        if (code == 0) {
            println("Connection request sent successfully")
        }
    }
)
```

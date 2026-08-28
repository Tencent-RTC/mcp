## Introduction

`LiveSeatStore` provides a complete set of seat management APIs, including taking seat, leaving seat, locking seat, unlocking seat, kicking user off seat, remote device control, etc. Through this class, seat management functionality can be implemented in the live room.

> **Important:**
> Use the **LiveSeatStore.create** factory method to create a `LiveSeatStore` instance, passing a valid live room ID.
>

> **Note:**
> Seat state updates are delivered through the **liveSeatState** publisher. Subscribe to it to receive real-time updates of seat data in the room.
>

## Features
- **Seat Management**: Take seat, leave seat, lock seat, unlock seat operations.

- **User Management**: Kick user off seat, move user to specified seat.

- **Featured Host Management**: In templates that support a featured host slot, set a seated user as a featured host or remove a featured host.

- **Device Control**: Remote control of user's camera and microphone.

- **Event Listening**: Listen to seat-related events.

## Subscribable Data

**LiveSeatState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|seatList|StateFlow<List<SeatInfo>>|Seat list.|
|canvas|StateFlow<LiveCanvas>|Canvas information.|
|speakingUsers|StateFlow<MutableMap<String, Int>>|Speaking users.|
|avStatistics|StateFlow<List<AVStatistics>>|Audio and video statistics.|

## API List

|**Function**|**Description**|
|---------|---------|
|LiveSeatStore.create|Create seat management instance.|
|addLiveSeatEventListener|Seat event callbacks.|
|removeLiveSeatEventListener|Seat event callbacks.|
|takeSeat|Take seat.|
|leaveSeat|Leave seat.|
|lockSeat|Lock seat.|
|unlockSeat|Unlock seat.|
|kickUserOutOfSeat|Kick user off seat.|
|moveUserToSeat|Move user.|
|setFeaturedHost|Set a featured host.|
|revokeFeaturedHost|Revoke a featured host.|
|openRemoteCamera|Open remote camera.|
|closeRemoteCamera|Close remote camera.|
|openRemoteMicrophone|Open remote microphone.|
|closeRemoteMicrophone|Close remote microphone.|

### Creating Instance

#### LiveSeatStore.create

Create seat management instance.

### Observing State and Events

#### addLiveSeatEventListener

Add seat event listener.
``` kotlin
abstract fun addLiveSeatEventListener(
    listener: LiveSeatListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveSeatListener?|Listener.|

#### removeLiveSeatEventListener

Remove seat event listener.
``` kotlin
abstract fun removeLiveSeatEventListener(
    listener: LiveSeatListener?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveSeatListener?|Listener.|

### Seat Operations

#### takeSeat

Take seat.
``` kotlin
abstract fun takeSeat(
    seatIndex: Int,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index.|
|completion|CompletionHandler?|Completion callback.|

#### leaveSeat

Leave seat.
``` kotlin
abstract fun leaveSeat(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

#### lockSeat

Lock seat.
``` kotlin
abstract fun lockSeat(
    seatIndex: Int,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index.|
|completion|CompletionHandler?|Completion callback.|

#### unlockSeat

Unlock seat.
``` kotlin
abstract fun unlockSeat(
    seatIndex: Int,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index.|
|completion|CompletionHandler?|Completion callback.|

### User Management

#### kickUserOutOfSeat

Kick user off seat.
``` kotlin
abstract fun kickUserOutOfSeat(
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

#### moveUserToSeat

Move user to seat.
``` kotlin
abstract fun moveUserToSeat(
    userID: String?,
    targetIndex: Int,
    policy: MoveSeatPolicy? = MoveSeatPolicy.ABORT_WHEN_OCCUPIED,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|targetIndex|Int|Target seat index.|
|policy|MoveSeatPolicy?|Move policy.|
|completion|CompletionHandler?|Completion callback.|

### Featured Host Management

#### setFeaturedHost

Set featured host.
``` kotlin
abstract fun setFeaturedHost(
    userID: String,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### revokeFeaturedHost

Revoke featured host.
``` kotlin
abstract fun revokeFeaturedHost(
    userID: String,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

### Remote Device Control

#### openRemoteCamera

Open remote camera.
``` kotlin
abstract fun openRemoteCamera(
    userID: String?,
    policy: DeviceControlPolicy,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|policy|DeviceControlPolicy|Device control policy.|
|completion|CompletionHandler?|Completion callback.|

#### closeRemoteCamera

Close remote camera.
``` kotlin
abstract fun closeRemoteCamera(
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

#### openRemoteMicrophone

Open remote microphone.
``` kotlin
abstract fun openRemoteMicrophone(
    userID: String?,
    policy: DeviceControlPolicy,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|policy|DeviceControlPolicy|Device control policy.|
|completion|CompletionHandler?|Completion callback.|

#### closeRemoteMicrophone

Close remote microphone.
``` kotlin
abstract fun closeRemoteMicrophone(
    userID: String?,
    completion: CompletionHandler?
)
internal val hasAudioStreamUserList: MutableSet<String> = mutableSetOf()
internal val hasVideoStreamUserList: MutableSet<String> = mutableSetOf()
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID.|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### MoveSeatPolicy

Move seat policy.

|**Enum Value**|**Description**|
|---------|---------|
|ABORT_WHEN_OCCUPIED|Abort when occupied.|
|FORCE_REPLACE|Force replace.|
|SWAP_POSITION|Swap position.|

### DeviceControlPolicy

Device control policy.

|**Enum Value**|**Description**|
|---------|---------|
|UNLOCK_ONLY|Unlock only.|

### SuspendStatus

User suspend status.

|**Enum Value**|**Description**|
|---------|---------|
|NONE|Not suspended.|
|IN_BACKGROUND|User suspended in background.|
|IN_CALLING|User is on a phone call.|

### LiveSeatListener

Seat related callback events.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onLocalCameraOpenedByAdmin|Triggered when the local camera is opened by an admin.|
|onLocalCameraClosedByAdmin|Triggered when the local camera is closed by an admin.|
|onLocalMicrophoneOpenedByAdmin|Triggered when the local microphone is opened by an admin.|
|onLocalMicrophoneClosedByAdmin|Triggered when the local microphone is closed by an admin.|

### SeatUserInfo

Seat user information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|userName|String|User name.|
|avatarURL|String|Avatar URL.|
|role|Role|User role.|
|liveID|String|Live room ID.|
|microphoneStatus|DeviceStatus|Microphone status.|
|allowOpenMicrophone|Boolean|Whether microphone can be opened.|
|cameraStatus|DeviceStatus|Camera status.|
|allowOpenCamera|Boolean|Whether camera can be opened.|
|userSuspendStatus|SuspendStatus|User suspend status.|

### RegionInfo

Seat view coordinate information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|x|Int|X coordinate.|
|y|Int|Y coordinate.|
|w|Int|Width.|
|h|Int|Height.|
|zorder|Int|Z-order.|

### AVStatistics

Audio and video statistics information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|videoBitrate|Int|Local video bitrate.|
|videoWidth|Int|Local video width.|
|videoHeight|Int|Local video height.|
|frameRate|Int|Local video frame rate.|
|audioSampleRate|Int|Audio sample rate.|
|audioBitrate|Int|Audio bitrate.|

### SeatInfo

Seat information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|index|Int|Seat index.|
|isLocked|Boolean|Whether locked.|
|userInfo|SeatUserInfo|User information.|
|region|RegionInfo|Region information.|
|isFeaturedHost|Boolean|Whether the user on this seat is currently a featured host. Can only be true in templates that support featured host slots.|

### LiveCanvas

Live canvas.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|w|Int|Width.|
|h|Int|Height.|
|templateID|Int|Template ID.|

### LiveSeatState

Seat state data provided by LiveSeatStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|seatList|StateFlow<List<SeatInfo>>|Seat list.|
|canvas|StateFlow<LiveCanvas>|Canvas information.|
|speakingUsers|StateFlow<MutableMap<String, Int>>|Speaking users.|
|avStatistics|StateFlow<List<AVStatistics>>|Audio and video statistics.|

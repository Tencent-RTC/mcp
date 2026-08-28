## Introduction

`LiveSeatStore` provides a complete set of seat management APIs, including taking seat, leaving seat, locking seat, unlocking seat, kicking user off seat, remote device control, etc. Through this class, seat management functionality can be implemented in the live room.

> **Important:**
> Use the **create(liveID:)** factory method to create a `LiveSeatStore` instance, passing a valid live room ID.
>

> **Note:**
> Seat state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates of seat data in the room.
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
|seatList|[SeatInfo]|Seat list.|
|canvas|LiveCanvas|Canvas information.|
|speakingUsers|[String: Int]|Speaking users.|
|avStatistics|[AVStatistics]|Audio and video statistics.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create seat management instance.|
|liveSeatEventPublisher|Seat event publisher.|
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

#### create

Create LiveSeatStore instance.
``` swift
public static func create(liveID: String) -> LiveSeatStore {
    let store: LiveSeatStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
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

#### liveSeatEventPublisher

Seat event publisher.

### Seat Operations

#### takeSeat

Take seat.
``` swift
public func takeSeat(seatIndex: Int,
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
|seatIndex|Int|Seat index.|
|completion|CompletionClosure?|Completion callback.|

#### leaveSeat

Leave seat.
``` swift
public func leaveSeat(completion: CompletionClosure? = nil) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### lockSeat

Lock seat.
``` swift
public func lockSeat(
    seatIndex: Int,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index.|
|completion|CompletionClosure?|Completion callback.|

#### unlockSeat

Unlock seat.
``` swift
public func unlockSeat(
    seatIndex: Int,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|Int|Seat index.|
|completion|CompletionClosure?|Completion callback.|

### User Management

#### kickUserOutOfSeat

Kick user off seat.
``` swift
public func kickUserOutOfSeat(userID: String,
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
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### moveUserToSeat

Move user to seat.
``` swift
public func moveUserToSeat(
    userID: String,
    targetIndex: Int,
    policy: MoveSeatPolicy?,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|targetIndex|Int|Target seat index.|
|policy|MoveSeatPolicy?|Move policy.|
|completion|CompletionClosure?|Completion callback.|

### Featured Host Management

#### setFeaturedHost

Set featured host.
``` swift
public func setFeaturedHost(
    userID: String,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### revokeFeaturedHost

Revoke featured host.
``` swift
public func revokeFeaturedHost(
    userID: String,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

### Remote Device Control

#### openRemoteCamera

Open remote camera.
``` swift
public func openRemoteCamera(
    userID: String,
    policy: DeviceControlPolicy,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|policy|DeviceControlPolicy|Device control policy.|
|completion|CompletionClosure?|Completion callback.|

#### closeRemoteCamera

Close remote camera.
``` swift
public func closeRemoteCamera(
    userID: String,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### openRemoteMicrophone

Open remote microphone.
``` swift
public func openRemoteMicrophone(
    userID: String,
    policy: DeviceControlPolicy,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|policy|DeviceControlPolicy|Device control policy.|
|completion|CompletionClosure?|Completion callback.|

#### closeRemoteMicrophone

Close remote microphone.
``` swift
public func closeRemoteMicrophone(
    userID: String,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

## Data Structures

### MoveSeatPolicy

Move seat policy.

|**Enum Value**|**Description**|
|---------|---------|
|abortWhenOccupied|Abort when occupied.|
|forceReplace|Force replace.|
|swapPosition|Swap position.|

### DeviceControlPolicy

Device control policy.

|**Enum Value**|**Description**|
|---------|---------|
|unlockOnly|Unlock only.|

### SuspendStatus

User suspend status.

|**Enum Value**|**Description**|
|---------|---------|
|none|Not suspended.|
|inBackground|User suspended in background.|
|inCalling|User is on a phone call.|

### LiveSeatEvent

Seat related callback events.

|**Enum Value**|**Description**|
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
|allowOpenMicrophone|Bool|Whether microphone can be opened.|
|cameraStatus|DeviceStatus|Camera status.|
|allowOpenCamera|Bool|Whether camera can be opened.|
|userSuspendStatus|SuspendStatus|User suspend status.|

### RegionInfo

Seat view coordinate information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|x|CGFloat|X coordinate.|
|y|CGFloat|Y coordinate.|
|w|CGFloat|Width.|
|h|CGFloat|Height.|
|zorder|Int|Z-order.|

### AVStatistics

Audio and video statistics information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|videoBitrate|UInt|Local video bitrate.|
|videoWidth|CGFloat|Local video width.|
|videoHeight|CGFloat|Local video height.|
|frameRate|UInt|Local video frame rate.|
|audioSampleRate|UInt|Audio sample rate.|
|audioBitrate|UInt|Audio bitrate.|

### SeatInfo

Seat information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|index|Int|Seat index.|
|isLocked|Bool|Whether locked.|
|userInfo|SeatUserInfo|User information.|
|region|RegionInfo|Region information.|
|isFeaturedHost|Bool|Whether the user on this seat is currently a featured host. Can only be true in templates that support featured host slots.|

### LiveCanvas

Live canvas.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|w|CGFloat|Width.|
|h|CGFloat|Height.|
|templateID|UInt|Template ID.|

### LiveSeatState

Seat state data provided by LiveSeatStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|seatList|[SeatInfo]|Seat list.|
|canvas|LiveCanvas|Canvas information.|
|speakingUsers|[String: Int]|Speaking users.|
|avStatistics|[AVStatistics]|Audio and video statistics.|

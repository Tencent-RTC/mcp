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
|seatList|ValueListenable<List<SeatInfo>>|Seat list.|
|canvas|ValueListenable<LiveCanvas>|Canvas information.|
|speakingUsers|ValueListenable<Map<String, int>>|Speaking users.|
|avStatistics|ValueListenable<List<AVStatistics>>|Audio and video statistics.|

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
``` dart
void addLiveSeatEventListener(LiveSeatListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveSeatListener|Listener.|

#### removeLiveSeatEventListener

Remove seat event listener.
``` dart
void removeLiveSeatEventListener(LiveSeatListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveSeatListener|Listener.|

### Seat Operations

#### takeSeat

Take seat.
``` dart
Future<CompletionHandler> takeSeat(int seatIndex);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|int|Seat index.|

#### leaveSeat

Leave seat.
``` dart
Future<CompletionHandler> leaveSeat();
```

**Version**

Supported since version 3.5.

#### lockSeat

Lock seat.
``` dart
Future<CompletionHandler> lockSeat(int seatIndex);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|int|Seat index.|

#### unlockSeat

Unlock seat.
``` dart
Future<CompletionHandler> unlockSeat(int seatIndex);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatIndex|int|Seat index.|

### User Management

#### kickUserOutOfSeat

Kick user off seat.
``` dart
Future<CompletionHandler> kickUserOutOfSeat(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### moveUserToSeat

Move user to seat.
``` dart
Future<CompletionHandler> moveUserToSeat({
  required String userID,
  required int targetIndex,
  MoveSeatPolicy policy = MoveSeatPolicy.abortWhenOccupied,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|targetIndex|int|Target seat index.|
|policy|MoveSeatPolicy|Move policy.|

### Featured Host Management

#### setFeaturedHost

Set featured host.
``` dart
Future<CompletionHandler> setFeaturedHost(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### revokeFeaturedHost

Revoke featured host.
``` dart
Future<CompletionHandler> revokeFeaturedHost(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

### Remote Device Control

#### openRemoteCamera

Open remote camera.
``` dart
Future<CompletionHandler> openRemoteCamera({
  required String userID,
  required DeviceControlPolicy policy,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|policy|DeviceControlPolicy|Device control policy.|

#### closeRemoteCamera

Close remote camera.
``` dart
Future<CompletionHandler> closeRemoteCamera(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### openRemoteMicrophone

Open remote microphone.
``` dart
Future<CompletionHandler> openRemoteMicrophone({
  required String userID,
  required DeviceControlPolicy policy,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|policy|DeviceControlPolicy|Device control policy.|

#### closeRemoteMicrophone

Close remote microphone.
``` dart
Future<CompletionHandler> closeRemoteMicrophone(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

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
|allowOpenMicrophone|bool|Whether microphone can be opened.|
|cameraStatus|DeviceStatus|Camera status.|
|allowOpenCamera|bool|Whether camera can be opened.|
|userSuspendStatus|SuspendStatus|User suspend status.|

### RegionInfo

Seat view coordinate information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|x|int|X coordinate.|
|y|int|Y coordinate.|
|w|int|Width.|
|h|int|Height.|
|zorder|int|Z-order.|

### AVStatistics

Audio and video statistics information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|videoBitrate|int|Local video bitrate.|
|videoWidth|int|Local video width.|
|videoHeight|int|Local video height.|
|frameRate|int|Local video frame rate.|
|audioSampleRate|int|Audio sample rate.|
|audioBitrate|int|Audio bitrate.|

### SeatInfo

Seat information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|index|int|Seat index.|
|isLocked|bool|Whether locked.|
|userInfo|SeatUserInfo|User information.|
|region|RegionInfo|Region information.|
|isFeaturedHost|bool|Whether the user on this seat is currently a featured host. Can only be true in templates that support featured host slots.|

### LiveCanvas

Live canvas.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|w|int|Width.|
|h|int|Height.|
|templateID|int|Template ID.|

### LiveSeatState

Seat state data provided by LiveSeatStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|seatList|ValueListenable<List<SeatInfo>>|Seat list.|
|canvas|ValueListenable<LiveCanvas>|Canvas information.|
|speakingUsers|ValueListenable<Map<String, int>>|Speaking users.|
|avStatistics|ValueListenable<List<AVStatistics>>|Audio and video statistics.|

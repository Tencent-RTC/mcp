---
sync_node_id: '215481709645254656'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "HarmonyOS"
  - "RoomStore"
product: "room"
---
## Introduction

Room management provides complete room lifecycle management, including instant rooms and scheduled rooms. `RoomStore` provides a comprehensive set of APIs to manage room-related operations.

> **Note:** 
> Room status updates are delivered through `state` publisher. Subscribe to it to receive real-time updates about current room and scheduled room list.
> 

## Features
- **Instant Room**: Supports creating and joining instant rooms.

- **Scheduled Room**: Supports scheduling rooms, modifying schedules, canceling schedules and other operations.

- **Room Call**: Supports calling users to join rooms, accepting/rejecting calls and other operations.

- **State Management**: Real-time tracking of current room status and scheduled room list.

## Subscribable Data

**RoomState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|scheduledRoomList|[RoomInfo]|Scheduled room list.|
|scheduledRoomListCursor|String|Scheduled room list cursor.|
|currentRoom|RoomInfo?|Current room info.|

## API List

|**Function**|**Description**|
|---------|---------|
|RoomStore.shared|Get singleton object.|
|addRoomListener|Room event callback.|
|removeRoomListener|Room event callback.|
|getScheduledRoomList|Get scheduled room list.|
|getScheduledAttendees|Get scheduled room attendees.|
|scheduleRoom|Schedule a room.|
|updateScheduledRoom|Update scheduled room.|
|addScheduledAttendees|Add scheduled attendees.|
|removeScheduledAttendees|Remove scheduled attendees.|
|cancelScheduledRoom|Cancel scheduled room.|
|createAndJoinRoom|Create and join room.|
|joinRoom|Join room.|
|leaveRoom|Leave room.|
|endRoom|End room.|
|updateRoomInfo|Update room info.|
|getRoomInfo|Get room info.|
|getPendingCalls|Get pending calls list.|
|callUserToRoom|Call user to join room.|
|cancelCall|Cancel call.|
|acceptCall|Accept call.|
|rejectCall|Reject call.|
|startRecording|Start cloud recording.|
|stopRecording|Stop cloud recording.|

### Getting Instance

#### RoomStore.shared

Get singleton object.

### Observing State and Events

#### addRoomListener

Add room event callback listener.
``` ets
abstract addRoomListener(listener: RoomListener): void
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomListener?|Listener.|

#### removeRoomListener

Remove room event callback listener.
``` ets
abstract removeRoomListener(listener: RoomListener): void
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomListener?|Listener.|

### Scheduled Room Operations

#### getScheduledRoomList

Get scheduled room list.
``` ets
abstract getScheduledRoomList(cursor: string | undefined): Promise<ListResult<RoomInfo>>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|

#### getScheduledAttendees

Get scheduled room attendees.
``` ets
abstract getScheduledAttendees(roomID: string, cursor: string | undefined): Promise<ListResult<RoomUser>>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|

#### scheduleRoom

Schedule a room.
``` ets
abstract scheduleRoom(roomID: string, options: ScheduleRoomOptions): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|

#### updateScheduledRoom

Update scheduled room.
``` ets
abstract updateScheduledRoom(
  roomID: string,
  options: ScheduleRoomOptions,
  modifyFlagList: ScheduleRoomOptionsModifyFlag[],
): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|modifyFlagList||Modify flag list.|

#### addScheduledAttendees

Add scheduled attendees.
``` ets
abstract addScheduledAttendees(roomID: string, userIDList: string[]): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|

#### removeScheduledAttendees

Remove scheduled attendees.
``` ets
abstract removeScheduledAttendees(roomID: string, userIDList: string[]): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|

#### cancelScheduledRoom

Cancel scheduled room.
``` ets
abstract cancelScheduledRoom(roomID: string): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

### Instant Room Operations

#### createAndJoinRoom

Create and join room.
``` ets
abstract createAndJoinRoom(
  roomID: string,
  roomType: RoomType,
  options: CreateRoomOptions,
): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|options|CreateRoomOptions|Create options.|

#### joinRoom

Join room.
``` ets
abstract joinRoom(roomID: string, roomType: RoomType, password?: string): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|password|String?|Room password.|

#### leaveRoom

Leave room.
``` ets
abstract leaveRoom(): Promise<void>
```

**Version**

Supported since version 3.5.

#### endRoom

End room.
``` ets
abstract endRoom(): Promise<void>
```

**Version**

Supported since version 3.5.

#### updateRoomInfo

Update room info.
``` ets
abstract updateRoomInfo(
  roomID: string,
  options: UpdateRoomOptions,
  modifyFlagList: UpdateRoomOptionsModifyFlag[],
): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|UpdateRoomOptions|Update options.|
|modifyFlagList||Modify flag list.|

#### getRoomInfo

Get room info.
``` ets
abstract getRoomInfo(roomID: string): Promise<RoomInfo>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

### Room Call Operations

#### getPendingCalls

Get pending calls list.
``` ets
abstract getPendingCalls(roomID: string, cursor: string | undefined): Promise<ListResult<RoomCall>>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|

#### callUserToRoom

Call user to join room.
``` ets
abstract callUserToRoom(
  roomID: string,
  userIDList: string[],
  timeout?: number,
  extensionInfo?: string | undefined,
): Promise<Map<string, RoomCallResult>>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|
|timeout|Int|Timeout (in seconds).|
|extensionInfo|String?|Extension info.|

#### cancelCall

Cancel call.
``` ets
abstract cancelCall(roomID: string, userIDList: string[]): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|

#### acceptCall

Accept call.
``` ets
abstract acceptCall(roomID: string): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

#### rejectCall

Reject call.
``` ets
abstract rejectCall(roomID: string, reason: CallRejectionReason): Promise<void>
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|reason|CallRejectionReason|Rejection reason.|

### Recording Operations

#### startRecording

Start cloud recording.
``` ets
abstract startRecording(options?: StartRecordingOptions): Promise<void>
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|options|StartRecordingOptions|Recording options, reserved for future extensions.|

#### stopRecording

Stop cloud recording.
``` ets
abstract stopRecording(): Promise<void>
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

## Data Structures

### RoomType

Room type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|standard|1|Standard room.|
|webinar|2|Webinar room.|

### RoomStatus

Room status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|scheduled|1|Scheduled.|
|running|2|Running.|

### RoomCallStatus

Room call status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|none|0|No call.|
|calling|1|Calling.|
|timeout|2|Call timeout.|
|rejected|3|Call rejected.|

### RoomCallResult

Call user to room result.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|success|0|Call success.|
|alreadyInCalling|1|User already in calling.|
|alreadyInRoom|2|User already in room.|

### CallRejectionReason

Call rejection reason.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|rejected|0|User actively rejected.|
|inOtherRoom|1|User in another room.|

### RecordingStatus

Recording status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|none|0|Not recording.|
|recording|1|Recording in progress.|

### RecordingStopReason

Recording stop reason.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|stoppedByUser|0|Manually stopped by user.|
|roomDismissed|1|Room dismissed.|
|maxDurationReached|2|Max recording duration reached.|
|storageLimitReached|3|Storage space limit reached.|

### RecordingError

Recording related error codes.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|noError|0|Operation successful.|
|noPermission|1|Caller is not Owner / Admin.|
|featureNotEnabled|2|Cloud recording feature not enabled in console.|
|storageNotConfigured|3|Recording storage (COS / VOD) not configured.|
|serviceUnavailable|4|RoomKit / TRTC recording service temporarily unavailable.|
|unknownError|5|Unknown error.|

### RoomListener

Room event callback.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onAddedToScheduledRoom|Triggered when added to a scheduled room.|
|onRemovedFromScheduledRoom|Triggered when removed from a scheduled room.|
|onScheduledRoomCancelled|Triggered when a scheduled room is cancelled.|
|onScheduledRoomStartingSoon|Triggered when a scheduled room is about to start.|
|onRoomEnded|Triggered when a room ends.|
|onCallReceived|Triggered when a room call is received.|
|onCallCancelled|Triggered when a room call is cancelled.|
|onCallTimeout|Triggered when a room call times out.|
|onCallAccepted|Triggered when a room call is accepted.|
|onCallRejected|Triggered when a room call is rejected.|
|onCallHandledByOtherDevice|Triggered when a room call is handled by another device.|
|onCallRevokedByAdmin|Triggered when a room call is revoked by admin.|
|onRecordingStarted|Triggered when recording starts.|
|onRecordingStopped|Triggered when recording stops.|

### RoomUser

Room user info.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|userName|String|User name.|
|avatarURL|String|User avatar URL.|

### RecordingInfo

Recording info.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|status|RecordingStatus|Recording status.|
|operatorUser|RoomUser|User who started the recording.|
|startTime|Int|Recording start timestamp.|

### RoomInfo

Room info.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomName|String|Room name.|
|roomOwner|RoomUser|Room owner.|
|roomType|RoomType|Room type.|
|participantCount|Int|Participant count.|
|audienceCount|Int|Audience count (for webinar room).|
|createTime|Int|Create time.|
|roomStatus|RoomStatus|Room status.|
|scheduledStartTime|Int|Scheduled start time.|
|scheduledEndTime|Int|Scheduled end time.|
|startReminderInSeconds|Int|Reminder seconds before start.|
|scheduleAttendees|[RoomUser]|Scheduled attendees list.|
|password|String?|Room password.|
|isAllMicrophoneDisabled|Bool|Whether all microphones are disabled.|
|isAllCameraDisabled|Bool|Whether all cameras are disabled.|
|isAllMessageDisabled|Bool|Whether all messages are disabled.|
|isAllScreenShareDisabled|Bool|Whether all screen sharing is disabled.|
|recordingInfo|RecordingInfo|Recording info.|

### ScheduleRoomOptionsModifyFlag

Schedule room options modify flag.

### ScheduleRoomOptions

Schedule room options.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomName|String|Room name.|
|password|String|Room password.|
|scheduleStartTime|Int|Scheduled start time.|
|scheduleEndTime|Int|Scheduled end time.|
|reminderSecondsBeforeStart|Int|Reminder seconds before start.|
|scheduleAttendees|[String]|Scheduled attendee ID list.|
|isAllMicrophoneDisabled|Bool|Whether all microphones are disabled.|
|isAllCameraDisabled|Bool|Whether all cameras are disabled.|
|isAllScreenShareDisabled|Bool|Whether all screen sharing is disabled.|
|isAllMessageDisabled|Bool|Whether all messages are disabled.|

### CreateRoomOptions

Create room options.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomName|String|Room name.|
|password|String|Room password.|
|isAllMicrophoneDisabled|Bool|Whether all microphones are disabled.|
|isAllCameraDisabled|Bool|Whether all cameras are disabled.|
|isAllScreenShareDisabled|Bool|Whether all screen sharing is disabled.|
|isAllMessageDisabled|Bool|Whether all messages are disabled.|

### UpdateRoomOptionsModifyFlag

Update room options modify flag.

### UpdateRoomOptions

Update room options.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomName|String|Room name.|
|password|String|Room password.|

### StartRecordingOptions

Start recording options.

### RoomCall

Room call info.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|caller|RoomUser|Caller info.|
|callee|RoomUser|Callee info.|
|status|RoomCallStatus|Call status.|

### RoomState

Room related state data provided by RoomStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|scheduledRoomList|[RoomInfo]|Scheduled room list.|
|scheduledRoomListCursor|String|Scheduled room list cursor.|
|currentRoom|RoomInfo?|Current room info.|

### CallUserToRoomCompletionHandler

Call user to room completion callback.

**Methods**

**onSuccess**: Success callback.
``` ets
fun onSuccess(result: Map<String, RoomCallResult>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|result|Map<String, RoomCallResult>|Call result map.|

**onFailure**: Failure callback.
``` ets
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

### GetRoomInfoCompletionHandler

Get room info completion callback.

**Methods**

**onSuccess**: Success callback.
``` ets
fun onSuccess(roomInfo: RoomInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomInfo|RoomInfo|Room info.|

**onFailure**: Failure callback.
``` ets
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

---
sync_node_id: '215481719034736640'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "Android"
  - "RoomStore"
product: "room"
---
## Introduction

Room management provides complete room lifecycle management, including instant rooms and scheduled rooms. `RoomStore` provides a comprehensive set of APIs to manage room-related operations.

> **Note:** 
> Room status updates are delivered through **state** publisher. Subscribe to it to receive real-time updates about current room and scheduled room list.
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
|scheduledRoomList|StateFlow<List<RoomInfo>>|Scheduled room list.|
|scheduledRoomListCursor|StateFlow<String>|Scheduled room list cursor.|
|currentRoom|StateFlow<RoomInfo?>|Current room info.|

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
``` kotlin
abstract fun addRoomListener(listener: RoomListener?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomListener?|Listener.|

#### removeRoomListener

Remove room event callback listener.
``` kotlin
abstract fun removeRoomListener(listener: RoomListener?)
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
``` kotlin
abstract fun getScheduledRoomList(cursor: String?, completion: ListResultCompletionHandler<RoomInfo>?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionHandler<RoomInfo>?|Completion callback.|

#### getScheduledAttendees

Get scheduled room attendees.
``` kotlin
abstract fun getScheduledAttendees(
    roomID: String,
    cursor: String?,
    completion: ListResultCompletionHandler<RoomUser>?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionHandler<RoomUser>?|Completion callback.|

#### scheduleRoom

Schedule a room.
``` kotlin
abstract fun scheduleRoom(roomID: String, options: ScheduleRoomOptions, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|completion|CompletionHandler?|Completion callback.|

#### updateScheduledRoom

Update scheduled room.
``` kotlin
abstract fun updateScheduledRoom(
    roomID: String,
    options: ScheduleRoomOptions,
    modifyFlagList: List<ScheduleRoomOptions.ModifyFlag>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|modifyFlagList|List<ScheduleRoomOptions.ModifyFlag>|Modify flag.|
|completion|CompletionHandler?|Completion callback.|

#### addScheduledAttendees

Add scheduled attendees.
``` kotlin
abstract fun addScheduledAttendees(roomID: String, userIDList: List<String>, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|
|completion|CompletionHandler?|Completion callback.|

#### removeScheduledAttendees

Remove scheduled attendees.
``` kotlin
abstract fun removeScheduledAttendees(roomID: String, userIDList: List<String>, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|
|completion|CompletionHandler?|Completion callback.|

#### cancelScheduledRoom

Cancel scheduled room.
``` kotlin
abstract fun cancelScheduledRoom(roomID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|CompletionHandler?|Completion callback.|

### Instant Room Operations

#### createAndJoinRoom

Create and join room.
``` kotlin
abstract fun createAndJoinRoom(roomID: String, roomType: RoomType, options: CreateRoomOptions, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|options|CreateRoomOptions|Create options.|
|completion|CompletionHandler?|Completion callback.|

#### joinRoom

Join room.
``` kotlin
abstract fun joinRoom(roomID: String, roomType: RoomType, password: String? = "", completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|password|String?|Room password.|
|completion|CompletionHandler?|Completion callback.|

#### leaveRoom

Leave room.
``` kotlin
abstract fun leaveRoom(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

#### endRoom

End room.
``` kotlin
abstract fun endRoom(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

#### updateRoomInfo

Update room info.
``` kotlin
abstract fun updateRoomInfo(
    roomID: String,
    options: UpdateRoomOptions,
    modifyFlagList: List<UpdateRoomOptions.ModifyFlag>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|UpdateRoomOptions|Update options.|
|modifyFlagList|List<UpdateRoomOptions.ModifyFlag>|Modify flag.|
|completion|CompletionHandler?|Completion callback.|

#### getRoomInfo

Get room info.
``` kotlin
abstract fun getRoomInfo(roomID: String, completion: GetRoomInfoCompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|GetRoomInfoCompletionHandler?|Completion callback.|

### Room Call Operations

#### getPendingCalls

Get pending calls list.
``` kotlin
abstract fun getPendingCalls(
    roomID: String,
    cursor: String?,
    completion: ListResultCompletionHandler<RoomCall>?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionHandler<RoomCall>?|Completion callback.|

#### callUserToRoom

Call user to join room.
``` kotlin
abstract fun callUserToRoom(
    roomID: String,
    userIDList: List<String>,
    timeout: Int = 0,
    extensionInfo: String? = null,
    completion: CallUserToRoomCompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|
|timeout|Int|Timeout (in seconds).|
|extensionInfo|String?|Extension info.|
|completion|CallUserToRoomCompletionHandler?|Completion callback.|

#### cancelCall

Cancel call.
``` kotlin
abstract fun cancelCall(roomID: String, userIDList: List<String>, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|
|completion|CompletionHandler?|Completion callback.|

#### acceptCall

Accept call.
``` kotlin
abstract fun acceptCall(roomID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|CompletionHandler?|Completion callback.|

#### rejectCall

Reject call.
``` kotlin
abstract fun rejectCall(roomID: String, reason: CallRejectionReason, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|reason|CallRejectionReason|Rejection reason.|
|completion|CompletionHandler?|Completion callback.|

### Recording Operations

#### startRecording

Start cloud recording.
``` kotlin
abstract fun startRecording(options: StartRecordingOptions = StartRecordingOptions(), completion: CompletionHandler?)
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|options|StartRecordingOptions|Recording options, reserved for future extensions.|
|completion|CompletionHandler?|Completion callback.|

#### stopRecording

Stop cloud recording.
``` kotlin
abstract fun stopRecording(completion: CompletionHandler?)
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### RoomType

Room type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|STANDARD|1|Standard room.|
|WEBINAR|2|Webinar room.|

### RoomStatus

Room status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|SCHEDULED|1|Scheduled.|
|RUNNING|2|Running.|

### RoomCallStatus

Room call status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|NONE|0|No call.|
|CALLING|1|Calling.|
|TIMEOUT|2|Call timeout.|
|REJECTED|3|Call rejected.|

### RoomCallResult

Call user to room result.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|SUCCESS|0|Call success.|
|ALREADY_IN_CALLING|1|User already in calling.|
|ALREADY_IN_ROOM|2|User already in room.|

### CallRejectionReason

Call rejection reason.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|REJECTED|0|User actively rejected.|
|IN_OTHER_ROOM|1|User in another room.|

### RecordingStatus

Recording status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|NONE|0|Not recording.|
|RECORDING|1|Recording in progress.|

### RecordingStopReason

Recording stop reason.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|STOPPED_BY_USER|0|Manually stopped by user.|
|ROOM_DISMISSED|1|Room dismissed.|
|MAX_DURATION_REACHED|2|Max recording duration reached.|
|STORAGE_LIMIT_REACHED|3|Storage space limit reached.|

### RecordingError

Recording related error codes.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|NO_ERROR|0|Operation successful.|
|NO_PERMISSION|1|Caller is not Owner / Admin.|
|FEATURE_NOT_ENABLED|2|Cloud recording feature not enabled in console.|
|STORAGE_NOT_CONFIGURED|3|Recording storage (COS / VOD) not configured.|
|SERVICE_UNAVAILABLE|4|RoomKit / TRTC recording service temporarily unavailable.|
|UNKNOWN_ERROR|5|Unknown error.|

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
|startTime|Long|Recording start timestamp.|

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
|createTime|Long|Create time.|
|roomStatus|RoomStatus|Room status.|
|scheduledStartTime|Long|Scheduled start time.|
|scheduledEndTime|Long|Scheduled end time.|
|startReminderInSeconds|Int|Reminder seconds before start.|
|scheduleAttendees|List<RoomUser>|Scheduled attendees list.|
|password|String?|Room password.|
|isAllMicrophoneDisabled|Boolean|Whether all microphones are disabled.|
|isAllCameraDisabled|Boolean|Whether all cameras are disabled.|
|isAllMessageDisabled|Boolean|Whether all messages are disabled.|
|isAllScreenShareDisabled|Boolean|Whether all screen sharing is disabled.|
|recordingInfo|RecordingInfo|Recording info.|

### ScheduleRoomOptions

Schedule room options.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomName|String|Room name.|
|password|String|Room password.|
|scheduleStartTime|Long|Scheduled start time.|
|scheduleEndTime|Long|Scheduled end time.|
|reminderSecondsBeforeStart|Int|Reminder seconds before start.|
|scheduleAttendees|List<String>|Scheduled attendee ID list.|
|isAllMicrophoneDisabled|Boolean|Whether all microphones are disabled.|
|isAllCameraDisabled|Boolean|Whether all cameras are disabled.|
|isAllScreenShareDisabled|Boolean|Whether all screen sharing is disabled.|
|isAllMessageDisabled|Boolean|Whether all messages are disabled.|

### CreateRoomOptions

Create room options.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|roomName|String|Room name.|
|password|String|Room password.|
|isAllMicrophoneDisabled|Boolean|Whether all microphones are disabled.|
|isAllCameraDisabled|Boolean|Whether all cameras are disabled.|
|isAllScreenShareDisabled|Boolean|Whether all screen sharing is disabled.|
|isAllMessageDisabled|Boolean|Whether all messages are disabled.|

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
|scheduledRoomList|StateFlow<List<RoomInfo>>|Scheduled room list.|
|scheduledRoomListCursor|StateFlow<String>|Scheduled room list cursor.|
|currentRoom|StateFlow<RoomInfo?>|Current room info.|

### CallUserToRoomCompletionHandler

Call user to room completion callback.

**Methods**

**onSuccess**: Success callback.
``` kotlin
fun onSuccess(result: Map<String, RoomCallResult>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|result|Map<String, RoomCallResult>|Call result map.|

**onFailure**: Failure callback.
``` kotlin
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
``` kotlin
fun onSuccess(roomInfo: RoomInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomInfo|RoomInfo|Room info.|

**onFailure**: Failure callback.
``` kotlin
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

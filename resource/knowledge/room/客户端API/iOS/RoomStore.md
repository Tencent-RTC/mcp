---
sync_node_id: '215481753126543360'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "iOS"
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
|scheduledRoomList|[RoomInfo]|Scheduled room list.|
|scheduledRoomListCursor|String|Scheduled room list cursor.|
|currentRoom|RoomInfo?|Current room info.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Get singleton object.|
|roomEventPublisher|Room event publisher.|
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

#### shared

Get singleton object.

### Observing State and Events

#### roomEventPublisher

Room event publisher.

**Data Structures：**RoomEvent

### Scheduled Room Operations

#### getScheduledRoomList

Get scheduled room list.
``` swift
public func getScheduledRoomList(cursor: String?, completion: ListResultCompletionClosure<RoomInfo>?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionClosure<RoomInfo>?|Completion callback.|

#### getScheduledAttendees

Get scheduled room attendees.
``` swift
public func getScheduledAttendees(roomID: String, cursor: String?, completion: ListResultCompletionClosure<RoomUser>?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionClosure<RoomUser>?|Completion callback.|

#### scheduleRoom

Schedule a room.
``` swift
public func scheduleRoom(roomID: String, options: ScheduleRoomOptions, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|completion|CompletionClosure?|Completion callback.|

#### updateScheduledRoom

Update scheduled room.
``` swift
public func updateScheduledRoom(roomID: String, options: ScheduleRoomOptions, modifyFlag: ScheduleRoomOptions.ModifyFlag, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|modifyFlag|ScheduleRoomOptions.ModifyFlag|Modify flag.|
|completion|CompletionClosure?|Completion callback.|

#### addScheduledAttendees

Add scheduled attendees.
``` swift
public func addScheduledAttendees(roomID: String, userIDList: [String], completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|
|completion|CompletionClosure?|Completion callback.|

#### removeScheduledAttendees

Remove scheduled attendees.
``` swift
public func removeScheduledAttendees(roomID: String, userIDList: [String], completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|
|completion|CompletionClosure?|Completion callback.|

#### cancelScheduledRoom

Cancel scheduled room.
``` swift
public func cancelScheduledRoom(roomID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|CompletionClosure?|Completion callback.|

### Instant Room Operations

#### createAndJoinRoom

Create and join room.
``` swift
public func createAndJoinRoom(roomID: String, roomType: RoomType, options: CreateRoomOptions, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|options|CreateRoomOptions|Create options.|
|completion|CompletionClosure?|Completion callback.|

#### joinRoom

Join room.
``` swift
public func joinRoom(roomID: String, roomType: RoomType, password: String? = "", completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|roomType|RoomType|Room type (standard or webinar).|
|password|String?|Room password.|
|completion|CompletionClosure?|Completion callback.|

#### leaveRoom

Leave room.
``` swift
public func leaveRoom(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### endRoom

End room.
``` swift
public func endRoom(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### updateRoomInfo

Update room info.
``` swift
public func updateRoomInfo(roomID: String, options: UpdateRoomOptions, modifyFlag: UpdateRoomOptions.ModifyFlag, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|UpdateRoomOptions|Update options.|
|modifyFlag|UpdateRoomOptions.ModifyFlag|Modify flag.|
|completion|CompletionClosure?|Completion callback.|

#### getRoomInfo

Get room info.
``` swift
public func getRoomInfo(roomID: String, completion: GetRoomInfoCompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|GetRoomInfoCompletionClosure?|Completion callback.|

### Room Call Operations

#### getPendingCalls

Get pending calls list.
``` swift
public func getPendingCalls(roomID: String, cursor: String?, completion: ListResultCompletionClosure<RoomCall>?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionClosure<RoomCall>?|Completion callback.|

#### callUserToRoom

Call user to join room.
``` swift
public func callUserToRoom(roomID: String, userIDList: [String], timeout: Int = 0, extensionInfo: String?, completion: CallUserToRoomCompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
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
|completion|CallUserToRoomCompletionClosure?|Completion callback.|

#### cancelCall

Cancel call.
``` swift
public func cancelCall(roomID: String, userIDList: [String], completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|[String]|User ID list.|
|completion|CompletionClosure?|Completion callback.|

#### acceptCall

Accept call.
``` swift
public func acceptCall(roomID: String, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|completion|CompletionClosure?|Completion callback.|

#### rejectCall

Reject call.
``` swift
public func rejectCall(roomID: String, reason: CallRejectionReason, completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|reason|CallRejectionReason|Rejection reason.|
|completion|CompletionClosure?|Completion callback.|

### Recording Operations

#### startRecording

Start cloud recording.
``` swift
public func startRecording(options: StartRecordingOptions = .init(), completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|options|StartRecordingOptions|Recording options, reserved for future extensions.|
|completion|CompletionClosure?|Completion callback.|

#### stopRecording

Stop cloud recording.
``` swift
public func stopRecording(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

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

### RoomEvent

Room event callback.

|**Enum Value**|**Description**|
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
``` swift
fun onSuccess(result: Map<String, RoomCallResult>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|result|Map<String, RoomCallResult>|Call result map.|

**onFailure**: Failure callback.
``` swift
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
``` swift
fun onSuccess(roomInfo: RoomInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomInfo|RoomInfo|Room info.|

**onFailure**: Failure callback.
``` swift
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

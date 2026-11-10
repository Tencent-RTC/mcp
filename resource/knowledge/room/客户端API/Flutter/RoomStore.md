---
sync_node_id: '215481797347041280'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "Flutter"
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

#### shared

Get singleton object.

### Observing State and Events

#### addRoomListener

Add room event callback listener.
``` dart
void addRoomListener(RoomListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomListener?|Listener.|

#### removeRoomListener

Remove room event callback listener.
``` dart
void removeRoomListener(RoomListener listener);
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
``` dart
Future<ListResultCompletionHandler<RoomInfo>> getScheduledRoomList(String? cursor);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|

#### getScheduledAttendees

Get scheduled room attendees.
``` dart
Future<ListResultCompletionHandler<RoomUser>> getScheduledAttendees({
  required String roomID,
  required String? cursor,
});
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
``` dart
Future<CompletionHandler> scheduleRoom({
  required String roomID,
  required ScheduleRoomOptions options,
});
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
``` dart
Future<CompletionHandler> updateScheduledRoom({
  required String roomID,
  required ScheduleRoomOptions options,
  required List<ScheduleRoomOptionsModifyFlag> modifyFlagList,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|ScheduleRoomOptions|Schedule options.|
|modifyFlagList|List<ScheduleRoomOptionsModifyFlag>|Modify flag list.|

#### addScheduledAttendees

Add scheduled attendees.
``` dart
Future<CompletionHandler> addScheduledAttendees({
  required String roomID,
  required List<String> userIDList,
});
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
``` dart
Future<CompletionHandler> removeScheduledAttendees({
  required String roomID,
  required List<String> userIDList,
});
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
``` dart
Future<CompletionHandler> cancelScheduledRoom(String roomID);
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
``` dart
Future<CompletionHandler> createAndJoinRoom({
  required String roomID,
  required RoomType roomType,
  required CreateRoomOptions options,
});
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
``` dart
Future<CompletionHandler> joinRoom({
  required String roomID,
  required RoomType roomType,
  String? password = "",
});
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
``` dart
Future<CompletionHandler> leaveRoom();
```

**Version**

Supported since version 3.5.

#### endRoom

End room.
``` dart
Future<CompletionHandler> endRoom();
```

**Version**

Supported since version 3.5.

#### updateRoomInfo

Update room info.
``` dart
Future<CompletionHandler> updateRoomInfo({
  required String roomID,
  required UpdateRoomOptions options,
  required List<UpdateRoomOptionsModifyFlag> modifyFlagList,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|options|UpdateRoomOptions|Update options.|
|modifyFlagList|List<UpdateRoomOptionsModifyFlag>|Modify flag list.|

#### getRoomInfo

Get room info.
``` dart
Future<GetRoomInfoCompletionHandler> getRoomInfo(String roomID);
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
``` dart
Future<ListResultCompletionHandler<RoomCall>> getPendingCalls({
  required String roomID,
  required String? cursor,
});
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
``` dart
Future<CallUserToRoomCompletionHandler> callUserToRoom({
  required String roomID,
  required List<String> userIDList,
  int timeout = 0,
  String? extensionInfo,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|
|timeout|int|Timeout (in seconds).|
|extensionInfo|String?|Extension info.|

#### cancelCall

Cancel call.
``` dart
Future<CompletionHandler> cancelCall({
  required String roomID,
  required List<String> userIDList,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|
|userIDList|List<String>|User ID list.|

#### acceptCall

Accept call.
``` dart
Future<CompletionHandler> acceptCall(String roomID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

#### rejectCall

Reject call.
``` dart
Future<CompletionHandler> rejectCall({
  required String roomID,
  required CallRejectionReason reason,
});
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
``` dart
Future<CompletionHandler> startRecording({
  StartRecordingOptions? options,
});
```

Only Owner and Admin have permission to call.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|options|StartRecordingOptions?|Recording options, reserved for future extensions.|

#### stopRecording

Stop cloud recording.
``` dart
Future<CompletionHandler> stopRecording();
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

### ListResultCompletionHandler

List result completion callback.

Completion handler for list result operations.

### CallUserToRoomCompletionHandler

Call user to room completion callback.

**Methods**

**onSuccess**: Success callback.
``` dart
fun onSuccess(result: Map<String, RoomCallResult>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|result|Map<String, RoomCallResult>|Call result map.|

**onFailure**: Failure callback.
``` dart
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
``` dart
fun onSuccess(roomInfo: RoomInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomInfo|RoomInfo|Room info.|

**onFailure**: Failure callback.
``` dart
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

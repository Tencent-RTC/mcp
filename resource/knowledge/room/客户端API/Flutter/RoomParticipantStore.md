---
sync_node_id: '215481789872336896'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "Flutter"
  - "RoomParticipantStore"
product: "room"
---
## Introduction

Room participant management provides complete participant lifecycle management, including permission management, device control, message muting and other features. `RoomParticipantStore` provides a comprehensive set of APIs to manage room participant related operations.

> **Note:** 
> Participant status updates are delivered through **state** publisher. Subscribe to it to receive real-time updates about participant list.
> 

## Features
- **Permission Management**: Supports transferring owner, setting/revoking admin, kicking users and other operations.

- **Device Control**: Supports closing participant devices, disabling all devices and other operations.

- **Message Muting**: Supports muting individual users or all users.

- **Device Request/Invitation**: Supports requesting to open device, inviting to open device and other bidirectional interactions.

## Subscribable Data

**RoomParticipantState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|participantList|[RoomParticipant]|Participant list.|
|participantListCursor|String|Participant list cursor.|
|audienceList|[RoomUser]|Audience list (for webinar room).|
|audienceListCursor|String|Audience list cursor.|
|adminList|[RoomUser]|Admin list.|
|messageDisabledUserList|[RoomUser]|Message disabled user list.|
|participantListWithVideo|[RoomParticipant]|Participant list with video.|
|participantWithScreen|RoomParticipant?|Participant sharing screen.|
|pendingDeviceApplications|[DeviceRequestInfo]|Pending device application list.|
|pendingDeviceInvitations|[DeviceRequestInfo]|Pending device invitation list.|
|speakingUsers|[String : Int]|Speaking users and their volume.|
|networkQualities|[String : NetworkInfo]|User network quality info.|
|pendingParticipantList|[RoomParticipant]|Pending participant list.|
|localParticipant|RoomParticipant?|Local participant info.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create object instance.|
|addRoomParticipantListener|Participant event callback.|
|removeRoomParticipantListener|Participant event callback.|
|getParticipantList|Get participant list.|
|getAudienceList|Get audience list (for webinar room).|
|searchUsers|Search users by keyword.|
|promoteAudienceToParticipant|Promote audience to participant (for webinar room).|
|demoteParticipantToAudience|Demote participant to audience (for webinar room).|
|transferOwner|Transfer owner.|
|setAdmin|Set admin.|
|revokeAdmin|Revoke admin.|
|kickUser|Kick user.|
|updateParticipantNameCard|Update participant name card.|
|updateParticipantMetaData|Update participant metadata.|
|muteMicrophone|Mute microphone.|
|unmuteMicrophone|Unmute microphone.|
|closeParticipantDevice|Close participant device.|
|disableUserMessage|Mute user.|
|disableAllDevices|Disable all devices.|
|disableAllMessages|Mute all users.|
|requestToOpenDevice|Request to open device.|
|cancelOpenDeviceRequest|Cancel open device request.|
|approveOpenDeviceRequest|Approve open device request.|
|rejectOpenDeviceRequest|Reject open device request.|
|inviteToOpenDevice|Invite to open device.|
|cancelOpenDeviceInvitation|Cancel open device invitation.|
|acceptOpenDeviceInvitation|Accept open device invitation.|
|declineOpenDeviceInvitation|Decline open device invitation.|

### Creating Instance

#### create

Create RoomParticipantStore instance.
``` dart
static RoomParticipantStore create(String roomID) {
  return StoreFactory.shared.getStore<RoomParticipantStore>(roomID: roomID);
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

### Observing State and Events

#### addRoomParticipantListener

Add participant event callback listener.
``` dart
void addRoomParticipantListener(RoomParticipantListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomParticipantListener?|Listener.|

#### removeRoomParticipantListener

Remove participant event callback listener.
``` dart
void removeRoomParticipantListener(RoomParticipantListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomParticipantListener?|Listener.|

### Participant List

#### getParticipantList

Get participant list.
``` dart
Future<ListResultCompletionHandler<RoomParticipant>> getParticipantList(String? cursor);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|

#### getAudienceList

Get audience list (for webinar room).
``` dart
Future<ListResultCompletionHandler<RoomUser>> getAudienceList(String? cursor);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|

#### searchUsers

Search users by keyword.
``` dart
Future<ListResultCompletionHandler<RoomUser>> searchUsers(String keyword);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keyword|String|Search keyword.|

### Audience/Participant Role Management

#### promoteAudienceToParticipant

Promote audience to participant (for webinar room).
``` dart
Future<CompletionHandler> promoteAudienceToParticipant(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### demoteParticipantToAudience

Demote participant to audience (for webinar room).
``` dart
Future<CompletionHandler> demoteParticipantToAudience(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

### Permission Management

#### transferOwner

Transfer owner.
``` dart
Future<CompletionHandler> transferOwner(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### setAdmin

Set admin.
``` dart
Future<CompletionHandler> setAdmin(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### revokeAdmin

Revoke admin.
``` dart
Future<CompletionHandler> revokeAdmin(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### kickUser

Kick user.
``` dart
Future<CompletionHandler> kickUser(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|

#### updateParticipantNameCard

Update participant name card.
``` dart
Future<CompletionHandler> updateParticipantNameCard({
  required String userID,
  required String nameCard,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nameCard|String|Name card.|

#### updateParticipantMetaData

Update participant metadata.
``` dart
Future<CompletionHandler> updateParticipantMetaData({
  required String userID,
  required Map<String, String> metaData,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|metaData|[String: String]|Metadata.|

### Local Microphone Control

#### muteMicrophone

Mute microphone.
``` dart
void muteMicrophone();
```

**Version**

Supported since version 3.5.

#### unmuteMicrophone

Unmute microphone.
``` dart
Future<CompletionHandler> unmuteMicrophone();
```

**Version**

Supported since version 3.5.

### Device Control

#### closeParticipantDevice

Close participant device.
``` dart
Future<CompletionHandler> closeParticipantDevice({
  required String userID,
  required DeviceType device,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|

#### disableUserMessage

Mute user.
``` dart
Future<CompletionHandler> disableUserMessage({
  required String userID,
  required bool disable,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|disable|Bool|Whether to mute.|

#### disableAllDevices

Disable all devices.
``` dart
Future<CompletionHandler> disableAllDevices({
  required DeviceType device,
  required bool disable,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|disable|Bool|Whether to disable.|

#### disableAllMessages

Mute all users.
``` dart
Future<CompletionHandler> disableAllMessages(bool disable);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|disable|Bool|Whether to mute.|

### Device Request Operations

#### requestToOpenDevice

Request to open device.
``` dart
Future<CompletionHandler> requestToOpenDevice({
  required DeviceType device,
  int timeout = 0,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|

#### cancelOpenDeviceRequest

Cancel open device request.
``` dart
Future<CompletionHandler> cancelOpenDeviceRequest(DeviceType device);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|

#### approveOpenDeviceRequest

Approve open device request.
``` dart
Future<CompletionHandler> approveOpenDeviceRequest({
  required DeviceType device,
  required String userID,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|

#### rejectOpenDeviceRequest

Reject open device request.
``` dart
Future<CompletionHandler> rejectOpenDeviceRequest({
  required DeviceType device,
  required String userID,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|

### Device Invitation Operations

#### inviteToOpenDevice

Invite to open device.
``` dart
Future<CompletionHandler> inviteToOpenDevice({
  required String userID,
  required DeviceType device,
  int timeout = 0,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|

#### cancelOpenDeviceInvitation

Cancel open device invitation.
``` dart
Future<CompletionHandler> cancelOpenDeviceInvitation({
  required String userID,
  required DeviceType device,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|

#### acceptOpenDeviceInvitation

Accept open device invitation.
``` dart
Future<CompletionHandler> acceptOpenDeviceInvitation({
  required String userID,
  required DeviceType device,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|

#### declineOpenDeviceInvitation

Decline open device invitation.
``` dart
Future<CompletionHandler> declineOpenDeviceInvitation({
  required String userID,
  required DeviceType device,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|

## Data Structures

### ParticipantRole

Participant role.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|owner|0|Owner.|
|admin|1|Admin.|
|generalUser|2|General user.|

### RoomParticipantStatus

Participant status.

|**Enum Value**|**Description**|
|---------|---------|
|scheduled|Scheduled.|
|inCalling|In calling.|
|callTimeout|Call timeout.|
|callRejected|Call rejected.|
|inRoom|In room.|

### KickedOutOfRoomReason

Reason for being kicked out of room.

|**Enum Value**|**Description**|
|---------|---------|
|kickedByAdmin|Kicked by admin.|
|replacedByAnotherDevice|Replaced by another device.|
|kickedByServer|Kicked by server.|
|connectionTimeout|Connection timeout.|
|invalidStatusOnReconnect|Invalid status on reconnect.|
|roomLimitExceeded|Room limit exceeded.|

### RoomParticipantListener

Participant event callback.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onParticipantJoined|Triggered when a participant joins the room.|
|onParticipantLeft|Triggered when a participant leaves the room.|
|onAudiencePromotedToParticipant|Triggered when an audience is promoted to participant.|
|onParticipantDemotedToAudience|Triggered when a participant is demoted to audience.|
|onOwnerChanged|Triggered when the owner changes.|
|onAdminSet|Triggered when an admin is set.|
|onAdminRevoked|Triggered when an admin is revoked.|
|onKickedFromRoom|Triggered when kicked from the room.|
|onParticipantDeviceClosed|Triggered when a participant's device is closed.|
|onUserMessageDisabled|Triggered when a user is muted.|
|onAllDevicesDisabled|Triggered when all devices are disabled.|
|onAllMessagesDisabled|Triggered when all users are muted.|
|onDeviceRequestReceived|Triggered when a device request is received.|
|onDeviceRequestCancelled|Triggered when a device request is cancelled.|
|onDeviceRequestTimeout|Triggered when a device request times out.|
|onDeviceRequestApproved|Triggered when a device request is approved.|
|onDeviceRequestRejected|Triggered when a device request is rejected.|
|onDeviceRequestProcessed|Triggered when a device request is processed.|
|onDeviceInvitationReceived|Triggered when a device invitation is received.|
|onDeviceInvitationCancelled|Triggered when a device invitation is cancelled.|
|onDeviceInvitationTimeout|Triggered when a device invitation times out.|
|onDeviceInvitationAccepted|Triggered when a device invitation is accepted.|
|onDeviceInvitationDeclined|Triggered when a device invitation is declined.|

### RoomParticipant

Room participant info.

### DeviceRequestInfo

Device request info.

### RoomParticipantState

Participant related state data provided by RoomParticipantStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|participantList|[RoomParticipant]|Participant list.|
|participantListCursor|String|Participant list cursor.|
|audienceList|[RoomUser]|Audience list (for webinar room).|
|audienceListCursor|String|Audience list cursor.|
|adminList|[RoomUser]|Admin list.|
|messageDisabledUserList|[RoomUser]|Message disabled user list.|
|participantListWithVideo|[RoomParticipant]|Participant list with video.|
|participantWithScreen|RoomParticipant?|Participant sharing screen.|
|pendingDeviceApplications|[DeviceRequestInfo]|Pending device application list.|
|pendingDeviceInvitations|[DeviceRequestInfo]|Pending device invitation list.|
|speakingUsers|[String : Int]|Speaking users and their volume.|
|networkQualities|[String : NetworkInfo]|User network quality info.|
|pendingParticipantList|[RoomParticipant]|Pending participant list.|
|localParticipant|RoomParticipant?|Local participant info.|

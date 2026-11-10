---
sync_node_id: '215481742555848704'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "Android"
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
|participantList|StateFlow<List<RoomParticipant>>|Participant list.|
|participantListCursor|StateFlow<String>|Participant list cursor.|
|audienceList|StateFlow<List<RoomUser>>|Audience list (for webinar room).|
|audienceListCursor|StateFlow<String>|Audience list cursor.|
|adminList|StateFlow<List<RoomUser>>|Admin list.|
|messageDisabledUserList|StateFlow<List<RoomUser>>|Message disabled user list.|
|participantListWithVideo|StateFlow<List<RoomParticipant>>|Participant list with video.|
|participantWithScreen|StateFlow<RoomParticipant?>|Participant sharing screen.|
|pendingDeviceApplications|StateFlow<List<DeviceRequestInfo>>|Pending device application list.|
|pendingDeviceInvitations|StateFlow<List<DeviceRequestInfo>>|Pending device invitation list.|
|speakingUsers|StateFlow<MutableMap<String, Int>>|Speaking users and their volume.|
|networkQualities|StateFlow<MutableMap<String, NetworkInfo>>|User network quality info.|
|pendingParticipantList|StateFlow<List<RoomParticipant>>|Pending participant list.|
|localParticipant|StateFlow<RoomParticipant?>|Local participant info.|

## API List

|**Function**|**Description**|
|---------|---------|
|RoomParticipantStore.create|Create object instance.|
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

#### RoomParticipantStore.create

Create object instance.

### Observing State and Events

#### addRoomParticipantListener

Add participant event callback listener.
``` kotlin
abstract fun addRoomParticipantListener(listener: RoomParticipantListener?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|RoomParticipantListener?|Listener.|

#### removeRoomParticipantListener

Remove participant event callback listener.
``` kotlin
abstract fun removeRoomParticipantListener(listener: RoomParticipantListener?)
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
``` kotlin
abstract fun getParticipantList(cursor: String?, completion: ListResultCompletionHandler<RoomParticipant>?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionHandler<RoomParticipant>?|Completion callback.|

#### getAudienceList

Get audience list (for webinar room).
``` kotlin
abstract fun getAudienceList(cursor: String?, completion: ListResultCompletionHandler<RoomUser>?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionHandler<RoomUser>?|Completion callback.|

#### searchUsers

Search users by keyword.
``` kotlin
abstract fun searchUsers(keyword: String, completion: ListResultCompletionHandler<RoomUser>?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keyword|String|Search keyword.|
|completion|ListResultCompletionHandler<RoomUser>?|Completion callback.|

### Audience/Participant Role Management

#### promoteAudienceToParticipant

Promote audience to participant (for webinar room).
``` kotlin
abstract fun promoteAudienceToParticipant(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### demoteParticipantToAudience

Demote participant to audience (for webinar room).
``` kotlin
abstract fun demoteParticipantToAudience(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

### Permission Management

#### transferOwner

Transfer owner.
``` kotlin
abstract fun transferOwner(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### setAdmin

Set admin.
``` kotlin
abstract fun setAdmin(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### revokeAdmin

Revoke admin.
``` kotlin
abstract fun revokeAdmin(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### kickUser

Kick user.
``` kotlin
abstract fun kickUser(userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### updateParticipantNameCard

Update participant name card.
``` kotlin
abstract fun updateParticipantNameCard(userID: String, nameCard: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nameCard|String|Name card.|
|completion|CompletionHandler?|Completion callback.|

#### updateParticipantMetaData

Update participant metadata.
``` kotlin
abstract fun updateParticipantMetaData(
    userID: String,
    metaData: HashMap<String, String>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|metaData|HashMap<String, String>|Metadata.|
|completion|CompletionHandler?|Completion callback.|

### Local Microphone Control

#### muteMicrophone

Mute microphone.
``` kotlin
abstract fun muteMicrophone()
```

**Version**

Supported since version 3.5.

#### unmuteMicrophone

Unmute microphone.
``` kotlin
abstract fun unmuteMicrophone(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

### Device Control

#### closeParticipantDevice

Close participant device.
``` kotlin
abstract fun closeParticipantDevice(userID: String, device: DeviceType, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionHandler?|Completion callback.|

#### disableUserMessage

Mute user.
``` kotlin
abstract fun disableUserMessage(userID: String, disable: Boolean, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|disable|Boolean|Whether to mute.|
|completion|CompletionHandler?|Completion callback.|

#### disableAllDevices

Disable all devices.
``` kotlin
abstract fun disableAllDevices(device: DeviceType, disable: Boolean, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|disable|Boolean|Whether to disable.|
|completion|CompletionHandler?|Completion callback.|

#### disableAllMessages

Mute all users.
``` kotlin
abstract fun disableAllMessages(disable: Boolean, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|disable|Boolean|Whether to mute.|
|completion|CompletionHandler?|Completion callback.|

### Device Request Operations

#### requestToOpenDevice

Request to open device.
``` kotlin
abstract fun requestToOpenDevice(device: DeviceType, timeout: Int = 0, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|
|completion|CompletionHandler?|Completion callback.|

#### cancelOpenDeviceRequest

Cancel open device request.
``` kotlin
abstract fun cancelOpenDeviceRequest(device: DeviceType, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|completion|CompletionHandler?|Completion callback.|

#### approveOpenDeviceRequest

Approve open device request.
``` kotlin
abstract fun approveOpenDeviceRequest(device: DeviceType, userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

#### rejectOpenDeviceRequest

Reject open device request.
``` kotlin
abstract fun rejectOpenDeviceRequest(device: DeviceType, userID: String, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|
|completion|CompletionHandler?|Completion callback.|

### Device Invitation Operations

#### inviteToOpenDevice

Invite to open device.
``` kotlin
abstract fun inviteToOpenDevice(
    userID: String,
    device: DeviceType,
    timeout: Int = 0,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|
|completion|CompletionHandler?|Completion callback.|

#### cancelOpenDeviceInvitation

Cancel open device invitation.
``` kotlin
abstract fun cancelOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionHandler?|Completion callback.|

#### acceptOpenDeviceInvitation

Accept open device invitation.
``` kotlin
abstract fun acceptOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionHandler?|Completion callback.|

#### declineOpenDeviceInvitation

Decline open device invitation.
``` kotlin
abstract fun declineOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### ParticipantRole

Participant role.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|OWNER|0|Owner.|
|ADMIN|1|Admin.|
|GENERAL_USER|2|General user.|

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
|participantList|StateFlow<List<RoomParticipant>>|Participant list.|
|participantListCursor|StateFlow<String>|Participant list cursor.|
|audienceList|StateFlow<List<RoomUser>>|Audience list (for webinar room).|
|audienceListCursor|StateFlow<String>|Audience list cursor.|
|adminList|StateFlow<List<RoomUser>>|Admin list.|
|messageDisabledUserList|StateFlow<List<RoomUser>>|Message disabled user list.|
|participantListWithVideo|StateFlow<List<RoomParticipant>>|Participant list with video.|
|participantWithScreen|StateFlow<RoomParticipant?>|Participant sharing screen.|
|pendingDeviceApplications|StateFlow<List<DeviceRequestInfo>>|Pending device application list.|
|pendingDeviceInvitations|StateFlow<List<DeviceRequestInfo>>|Pending device invitation list.|
|speakingUsers|StateFlow<MutableMap<String, Int>>|Speaking users and their volume.|
|networkQualities|StateFlow<MutableMap<String, NetworkInfo>>|User network quality info.|
|pendingParticipantList|StateFlow<List<RoomParticipant>>|Pending participant list.|
|localParticipant|StateFlow<RoomParticipant?>|Local participant info.|

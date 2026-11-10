---
sync_node_id: '215481771126509568'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "iOS"
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
|participantEventPublisher|Participant event publisher.|
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
``` swift
public static func create(roomID: String) -> RoomParticipantStore {
    let store: RoomParticipantStoreImpl = StoreFactory.shared.getStore(roomID: roomID)
    return store
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Room ID.|

### Observing State and Events

#### participantEventPublisher

Participant event publisher.

**Data Structures：**RoomParticipantEvent

### Participant List

#### getParticipantList

Get participant list.
``` swift
public func getParticipantList(cursor: String?, completion: ListResultCompletionClosure<RoomParticipant>?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionClosure<RoomParticipant>?|Completion callback.|

#### getAudienceList

Get audience list (for webinar room).
``` swift
public func getAudienceList(cursor: String?, completion: ListResultCompletionClosure<RoomUser>?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Pagination cursor.|
|completion|ListResultCompletionClosure<RoomUser>?|Completion callback.|

#### searchUsers

Search users by keyword.
``` swift
public func searchUsers(keyword: String, completion: ListResultCompletionClosure<RoomUser>?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keyword|String|Search keyword.|
|completion|ListResultCompletionClosure<RoomUser>?|Completion callback.|

### Audience/Participant Role Management

#### promoteAudienceToParticipant

Promote audience to participant (for webinar room).
``` swift
public func promoteAudienceToParticipant(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### demoteParticipantToAudience

Demote participant to audience (for webinar room).
``` swift
public func demoteParticipantToAudience(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

### Permission Management

#### transferOwner

Transfer owner.
``` swift
public func transferOwner(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### setAdmin

Set admin.
``` swift
public func setAdmin(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### revokeAdmin

Revoke admin.
``` swift
public func revokeAdmin(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### kickUser

Kick user.
``` swift
public func kickUser(userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### updateParticipantNameCard

Update participant name card.
``` swift
public func updateParticipantNameCard(userID: String, nameCard: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nameCard|String|Name card.|
|completion|CompletionClosure?|Completion callback.|

#### updateParticipantMetaData

Update participant metadata.
``` swift
public func updateParticipantMetaData(userID: String, metaData: [String: String], completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|metaData|[String: String]|Metadata.|
|completion|CompletionClosure?|Completion callback.|

### Local Microphone Control

#### muteMicrophone

Mute microphone.
``` swift
public func muteMicrophone() { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

#### unmuteMicrophone

Unmute microphone.
``` swift
public func unmuteMicrophone(completion: CompletionClosure?) { fatalError("\(#function) must be overridden by subclass") }
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

### Device Control

#### closeParticipantDevice

Close participant device.
``` swift
public func closeParticipantDevice(userID: String, device: DeviceType, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionClosure?|Completion callback.|

#### disableUserMessage

Mute user.
``` swift
public func disableUserMessage(userID: String, disable: Bool, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|disable|Bool|Whether to mute.|
|completion|CompletionClosure?|Completion callback.|

#### disableAllDevices

Disable all devices.
``` swift
public func disableAllDevices(device: DeviceType, disable: Bool, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|disable|Bool|Whether to disable.|
|completion|CompletionClosure?|Completion callback.|

#### disableAllMessages

Mute all users.
``` swift
public func disableAllMessages(disable: Bool, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|disable|Bool|Whether to mute.|
|completion|CompletionClosure?|Completion callback.|

### Device Request Operations

#### requestToOpenDevice

Request to open device.
``` swift
public func requestToOpenDevice(device: DeviceType, timeout: Int = 0, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|
|completion|CompletionClosure?|Completion callback.|

#### cancelOpenDeviceRequest

Cancel open device request.
``` swift
public func cancelOpenDeviceRequest(device: DeviceType, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|completion|CompletionClosure?|Completion callback.|

#### approveOpenDeviceRequest

Approve open device request.
``` swift
public func approveOpenDeviceRequest(device: DeviceType, userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

#### rejectOpenDeviceRequest

Reject open device request.
``` swift
public func rejectOpenDeviceRequest(device: DeviceType, userID: String, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|device|DeviceType|Device type.|
|userID|String|User ID.|
|completion|CompletionClosure?|Completion callback.|

### Device Invitation Operations

#### inviteToOpenDevice

Invite to open device.
``` swift
public func inviteToOpenDevice(userID: String, device: DeviceType, timeout: Int = 0, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|timeout|Int|Timeout (in seconds).|
|completion|CompletionClosure?|Completion callback.|

#### cancelOpenDeviceInvitation

Cancel open device invitation.
``` swift
public func cancelOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionClosure?|Completion callback.|

#### acceptOpenDeviceInvitation

Accept open device invitation.
``` swift
public func acceptOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionClosure?|Completion callback.|

#### declineOpenDeviceInvitation

Decline open device invitation.
``` swift
public func declineOpenDeviceInvitation(userID: String, device: DeviceType, completion: CompletionClosure?) {fatalError("\(#function) must be overridden by subclass")}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|device|DeviceType|Device type.|
|completion|CompletionClosure?|Completion callback.|

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

### RoomParticipantEvent

Participant event callback.

|**Enum Value**|**Description**|
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

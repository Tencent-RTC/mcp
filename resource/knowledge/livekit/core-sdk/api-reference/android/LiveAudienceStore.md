## Introduction

`LiveAudienceStore` provides a complete set of audience management APIs, including fetching audience list, setting administrators, kicking users, muting, etc. Through this class, you can implement audience management functions in live rooms.

> **Important:**
> Use the **LiveAudienceStore.create** factory method to create a `LiveAudienceStore` instance, which requires a valid live room ID.
>

> **Note:**
> Audience state updates are delivered through the **liveAudienceState** publisher. Subscribe to it to receive real-time updates of audience data in the room.
>

## Features
- **Audience List**: Get and manage the audience list of the current room.

- **Permission Management**: Set and revoke administrator permissions.

- **User Management**: Kick users, mute, and other operations.

- **Event Listening**: Listen for owner, admin, and audience join/leave events.

## Subscribable Data

**LiveAudienceState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|audienceList|StateFlow<List<LiveUserInfo>>|Audience list.|
|audienceCount|StateFlow<Int>|Audience count.|
|adminList|StateFlow<List<LiveUserInfo>>|Administrator list.|
|messageBannedUserList|StateFlow<List<LiveUserInfo>>|List of users banned from sending messages.|

## API List

|**Function**|**Description**|
|---------|---------|
|LiveAudienceStore.create|Create audience management instance.|
|addLiveAudienceListener|Audience event callbacks.|
|removeLiveAudienceListener|Audience event callbacks.|
|fetchAudienceList|Fetch audience list.|
|setAdministrator|Set administrator.|
|revokeAdministrator|Revoke administrator.|
|kickUserOutOfRoom|Kick user.|
|disableSendMessage|Mute/unmute user.|

### Creating Instance

#### LiveAudienceStore.create

Create audience management instance.

### Observing State and Events

#### addLiveAudienceListener

Add audience event listener.
``` kotlin
abstract fun addLiveAudienceListener(listener: LiveAudienceListener)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveAudienceListener|Listener.|

#### removeLiveAudienceListener

Remove audience event listener.
``` kotlin
abstract fun removeLiveAudienceListener(listener: LiveAudienceListener)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveAudienceListener|Listener.|

### Audience Management

#### fetchAudienceList

Fetch audience list.
``` kotlin
abstract fun fetchAudienceList(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

#### setAdministrator

Set administrator.
``` kotlin
abstract fun setAdministrator(userID: String?, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID to be set as administrator.|
|completion|CompletionHandler?|Completion callback.|

#### revokeAdministrator

Revoke administrator.
``` kotlin
abstract fun revokeAdministrator(userID: String?, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID to revoke administrator permission.|
|completion|CompletionHandler?|Completion callback.|

#### kickUserOutOfRoom

Kick user out of room.
``` kotlin
abstract fun kickUserOutOfRoom(userID: String?, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|User ID to be kicked out.|
|completion|CompletionHandler?|Completion callback.|

#### disableSendMessage

Disable/enable user message sending.
``` kotlin
abstract fun disableSendMessage(
    userID: String?,
    isDisable: Boolean,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String?|Target user ID.|
|isDisable|Boolean|true to disable message sending, false to enable.|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### Role

User role.

|**Enum Value**|**Description**|
|---------|---------|
|OWNER|Room owner.|
|ADMIN|Administrator.|
|GENERAL_USER|General user.|

### LiveUserInfo

Live user information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User unique identifier ID.|
|userName|String|User name.|
|avatarURL|String|User avatar URL.|

### LiveAudienceState

Live audience state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|audienceList|StateFlow<List<LiveUserInfo>>|Audience list.|
|audienceCount|StateFlow<Int>|Audience count.|
|adminList|StateFlow<List<LiveUserInfo>>|Administrator list.|
|messageBannedUserList|StateFlow<List<LiveUserInfo>>|List of users banned from sending messages.|

### LiveAudienceListener

Live audience events.

This listener is used to receive dynamic events for all roles (owner, admin, audience) in the live room.

**Methods**

**onOwnerJoined**: Owner joined event.
``` kotlin
open fun onOwnerJoined(owner: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the joined owner.|

**onOwnerLeft**: Owner left event.
``` kotlin
open fun onOwnerLeft(owner: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the left owner.|

**onAdminJoined**: Admin joined event.
``` kotlin
open fun onAdminJoined(admin: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the joined admin.|

**onAdminLeft**: Admin left event.
``` kotlin
open fun onAdminLeft(admin: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the left admin.|

**onAudienceJoined**: Audience joined event.
``` kotlin
open fun onAudienceJoined(audience: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the joined audience.|

**onAudienceLeft**: Audience left event.
``` kotlin
open fun onAudienceLeft(audience: LiveUserInfo) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the left audience.|

**onAudienceMessageDisabled**: Audience message disabled event.
``` kotlin
open fun onAudienceMessageDisabled(audience: LiveUserInfo, isDisable: Boolean) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Audience information.|
|isDisable|Boolean|Whether message sending is disabled.|

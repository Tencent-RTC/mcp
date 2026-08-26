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
|audienceList|ValueListenable<List<LiveUserInfo>>|Audience list.|
|audienceCount|ValueListenable<int>|Audience count.|
|adminList|ValueListenable<List<LiveUserInfo>>|Administrator list.|
|messageBannedUserList|ValueListenable<List<LiveUserInfo>>|List of users banned from sending messages.|

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
``` dart
void addLiveAudienceListener(LiveAudienceListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveAudienceListener|Listener.|

#### removeLiveAudienceListener

Remove audience event listener.
``` dart
void removeLiveAudienceListener(LiveAudienceListener listener);
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
``` dart
Future<CompletionHandler> fetchAudienceList();
```

**Version**

Supported since version 3.5.

#### setAdministrator

Set administrator.
``` dart
Future<CompletionHandler> setAdministrator(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to be set as administrator.|

#### revokeAdministrator

Revoke administrator.
``` dart
Future<CompletionHandler> revokeAdministrator(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to revoke administrator permission.|

#### kickUserOutOfRoom

Kick user out of room.
``` dart
Future<CompletionHandler> kickUserOutOfRoom(String userID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to be kicked out.|

#### disableSendMessage

Disable/enable user message sending.
``` dart
Future<CompletionHandler> disableSendMessage({
  required String userID,
  required bool isDisable,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|Target user ID.|
|isDisable|bool|true to disable message sending, false to enable.|

## Data Structures

### Role

User role.

|**Enum Value**|**Description**|
|---------|---------|
|owner|Room owner.|
|admin|Administrator.|
|generalUser|General user.|

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
|audienceList|ValueListenable<List<LiveUserInfo>>|Audience list.|
|audienceCount|ValueListenable<int>|Audience count.|
|adminList|ValueListenable<List<LiveUserInfo>>|Administrator list.|
|messageBannedUserList|ValueListenable<List<LiveUserInfo>>|List of users banned from sending messages.|

### LiveAudienceListener

Live audience events.

This listener is used to receive dynamic events for all roles (owner, admin, audience) in the live room.

**Methods**

**onOwnerJoined**: Owner joined event.
``` dart
void Function(LiveUserInfo owner)? onOwnerJoined;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the joined owner.|

**onOwnerLeft**: Owner left event.
``` dart
void Function(LiveUserInfo owner)? onOwnerLeft;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the left owner.|

**onAdminJoined**: Admin joined event.
``` dart
void Function(LiveUserInfo admin)? onAdminJoined;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the joined admin.|

**onAdminLeft**: Admin left event.
``` dart
void Function(LiveUserInfo admin)? onAdminLeft;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the left admin.|

**onAudienceJoined**: Audience joined event.
``` dart
void Function(LiveUserInfo audience)? onAudienceJoined;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the joined audience.|

**onAudienceLeft**: Audience left event.
``` dart
void Function(LiveUserInfo audience)? onAudienceLeft;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the left audience.|

**onAudienceMessageDisabled**: Audience message disabled event.
``` dart
void Function(LiveUserInfo audience, bool isDisable)? onAudienceMessageDisabled;
LiveAudienceListener({this.onOwnerJoined, this.onOwnerLeft, this.onAdminJoined, this.onAdminLeft, this.onAudienceJoined, this.onAudienceLeft, this.onAudienceMessageDisabled});
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Audience information.|
|isDisable|bool|Whether message sending is disabled.|

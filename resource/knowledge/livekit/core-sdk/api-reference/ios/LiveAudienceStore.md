## Introduction

`LiveAudienceStore` provides a complete set of audience management APIs, including fetching audience list, setting administrators, kicking users, muting, etc. Through this class, you can implement audience management functions in live rooms.

> **Important:**
> Use the **create(liveID:)** factory method to create a `LiveAudienceStore` instance, which requires a valid live room ID.
>

> **Note:**
> Audience state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates of audience data in the room.
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
|audienceList|[LiveUserInfo]|Audience list.|
|audienceCount|UInt|Audience count.|
|adminList|[LiveUserInfo]|Administrator list.|
|messageBannedUserList|[LiveUserInfo]|List of users banned from sending messages.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create audience management instance.|
|liveAudienceEventPublisher|Audience event publisher.|
|fetchAudienceList|Fetch audience list.|
|setAdministrator|Set administrator.|
|revokeAdministrator|Revoke administrator.|
|kickUserOutOfRoom|Kick user.|
|disableSendMessage|Mute/unmute user.|

### Creating Instance

#### create

Create audience management instance.
``` swift
public static func create(liveID: String) -> LiveAudienceStore {
    let store: LiveAudienceStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
    return store
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|

### Observing State and Events

#### liveAudienceEventPublisher

Audience event publisher.

### Audience Management

#### fetchAudienceList

Fetch audience list.
``` swift
public func fetchAudienceList(
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### setAdministrator

Set administrator.
``` swift
public func setAdministrator(userID: String,
                             completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to be set as administrator.|
|completion|CompletionClosure?|Completion callback.|

#### revokeAdministrator

Revoke administrator.
``` swift
public func revokeAdministrator(userID: String,
                                completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to revoke administrator permission.|
|completion|CompletionClosure?|Completion callback.|

#### kickUserOutOfRoom

Kick user out of room.
``` swift
public func kickUserOutOfRoom(userID: String,
                              completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID to be kicked out.|
|completion|CompletionClosure?|Completion callback.|

#### disableSendMessage

Disable/enable user message sending.
``` swift
public func disableSendMessage(userID: String,
                               isDisable: Bool,
                               completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|Target user ID.|
|isDisable|Bool|true to disable message sending, false to enable.|
|completion|CompletionClosure?|Completion callback.|

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
|audienceList|[LiveUserInfo]|Audience list.|
|audienceCount|UInt|Audience count.|
|adminList|[LiveUserInfo]|Administrator list.|
|messageBannedUserList|[LiveUserInfo]|List of users banned from sending messages.|

### LiveAudienceListener

Live audience events.

This listener is used to receive dynamic events for all roles (owner, admin, audience) in the live room.

**Methods**

**onOwnerJoined**: Owner joined event.
``` swift
case onOwnerJoined(owner: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the joined owner.|

**onOwnerLeft**: Owner left event.
``` swift
case onOwnerLeft(owner: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|owner|LiveUserInfo|Information of the left owner.|

**onAdminJoined**: Admin joined event.
``` swift
case onAdminJoined(admin: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the joined admin.|

**onAdminLeft**: Admin left event.
``` swift
case onAdminLeft(admin: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|admin|LiveUserInfo|Information of the left admin.|

**onAudienceJoined**: Audience joined event.
``` swift
case onAudienceJoined(audience: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the joined audience.|

**onAudienceLeft**: Audience left event.
``` swift
case onAudienceLeft(audience: LiveUserInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Information of the left audience.|

**onAudienceMessageDisabled**: Audience message disabled event.
``` swift
case onAudienceMessageDisabled(audience: LiveUserInfo, isDisable: Bool)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audience|LiveUserInfo|Audience information.|
|isDisable|Bool|Whether message sending is disabled.|

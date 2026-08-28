## Introduction

`LoginStore` provides a complete set of login management APIs, including user login, logout, and personal information settings. Through this class, you can manage user login status and user profiles.

> **Important:**
> Use **shared** singleton object to access the `LoginStore` instance.
>

> **Note:**
> Login status updates are delivered through **state** publisher. Subscribe to it to receive real-time updates about login status.
>

## Features
- **User Login**：Supports login using SDK application ID, user ID and user signature

- **User Logout**：Supports user logout operation

- **Personal Information Settings**：Supports setting user nickname, avatar, gender and other personal information

## Subscribable Data

**LoginState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|loginStatus|LoginStatus|Login status.|
|loginUserInfo|UserProfile?|Logged-in user information.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Singleton object.|
|loginEventPublisher|Login event publisher.|
|login|Login.|
|logout|Logout.|
|setSelfInfo|Set personal information.|

### Getting Instance

#### shared

Singleton object
``` swift
public static let shared: LoginStore = LoginStoreImpl()
```

**Version**

Supported since version 3.5.

### Observing Events

#### loginEventPublisher

Login event publisher

### Login Operations

#### login

Login
``` swift
public func login(sdkAppID: Int32, userID: String, userSig: String, completion: CompletionClosure?) {}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|sdkAppID|Int32|Required|SDK application ID.|
|userID|String|Required|User ID.|
|userSig|String|Required|User signature.|
|completion|CompletionClosure?|Required|Completion callback.|

#### logout

Logout
``` swift
public func logout(completion: CompletionClosure?) {}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|completion|CompletionClosure?|Required|Completion callback.|

#### setSelfInfo

Set personal information
``` swift
public func setSelfInfo(userProfile: UserProfile, completion: CompletionClosure?) {}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|userProfile|UserProfile|Required|User profile.|
|completion|CompletionClosure?|Required|Completion callback.|

## Data Structures

### LoginStatus

Login status.

|**Enum Value**|**Description**|
|---------|---------|
|unlogin|Not logged in.|
|logined|Logged in.|

### AllowType

Friend verification type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|allowAny|0|Allow anyone.|
|needConfirm|1|Need confirmation.|
|denyAny|2|Deny anyone.|

### Gender

Gender.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|unknown|0|Unknown.|
|male|1|Male.|
|female|2|Female.|

### LoginEvent

Login event.

|**Enum Value**|**Description**|
|---------|---------|
|kickedOffline|Current user kicked offline.|
|loginExpired|Login ticket expired.|

### UserProfile

User profile

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nickname|String?|Nickname.|
|avatarURL|String?|Avatar URL.|
|selfSignature|String?|Personal signature.|
|gender|Gender?|Gender.|
|role|UInt32?|Role.|
|level|UInt32?|Level.|
|birthday|UInt32?|Birthday.|
|allowType|AllowType?|Friend verification type.|
|customInfo|[String: Data]?|Custom information.|

### LoginState

Login state

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|loginStatus|LoginStatus|Login status.|
|loginUserInfo|UserProfile?|Logged-in user information.|

## Introduction

`LoginStore` provides a complete set of login management APIs, including user login, logout, and personal information settings. Through this class, you can manage user login status and user profiles.

> **Important:**
> Use **LoginStore.shared** singleton object to access the `LoginStore` instance.
>

> **Note:**
> Login status updates are delivered through **loginState** publisher. Subscribe to it to receive real-time updates about login status.
>

## Features
- **User Login**：Supports login using SDK application ID, user ID and user signature

- **User Logout**：Supports user logout operation

- **Personal Information Settings**：Supports setting user nickname, avatar, gender and other personal information

## Subscribable Data

**LoginState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|loginStatus|StateFlow<LoginStatus>|Login status.|
|loginUserInfo|StateFlow<UserProfile?>|Logged-in user information.|

## API List

|**Function**|**Description**|
|---------|---------|
|LoginStore.shared|Singleton object.|
|addLoginListener|Login event listener.|
|removeLoginListener|Login event listener.|
|login|Login.|
|logout|Logout.|
|setSelfInfo|Set personal information.|

### Getting Instance

#### LoginStore.shared

Singleton object

### Observing Events

#### addLoginListener

Add login listener
``` kotlin
abstract fun addLoginListener(listener: LoginListener)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|listener|LoginListener|Required|Login listener.|

#### removeLoginListener

Remove login listener
``` kotlin
abstract fun removeLoginListener(listener: LoginListener)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|listener|LoginListener|Required|Login listener.|

### Login Operations

#### login

Login
``` kotlin
abstract fun login(
    context: Context,
    sdkAppID: Int,
    userID: String,
    userSig: String,
    completion: CompletionHandler? = null
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|context|Context|Required|Context.|
|sdkAppID|Int|Required|SDK application ID.|
|userID|String|Required|User ID.|
|userSig|String|Required|User signature.|
|completion|CompletionHandler?|Required|Completion callback.|

#### logout

Logout
``` kotlin
abstract fun logout(completion: CompletionHandler? = null)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|completion|CompletionHandler?|Required|Completion callback.|

#### setSelfInfo

Set personal information
``` kotlin
abstract fun setSelfInfo(
    userProfile: UserProfile,
    completion: CompletionHandler? = null
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|userProfile|UserProfile|Required|User profile.|
|completion|CompletionHandler?|Required|Completion callback.|

## Data Structures

### LoginStatus

Login status.

|**Enum Value**|**Description**|
|---------|---------|
|UNLOGIN|Not logged in.|
|LOGINED|Logged in.|

### AllowType

Friend verification type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|ALLOW_ANY|0|Allow anyone.|
|NEED_CONFIRM|1|Need confirmation.|
|DENY_ANY|2|Deny anyone.|

### Gender

Gender.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|UNKNOWN|0|Unknown.|
|MALE|1|Male.|
|FEMALE|2|Female.|

### LoginListener

Login event.

**Methods**

|**Method**|**Description**|
|---------|---------|
|onKickedOffline|Current user kicked offline.|
|onLoginExpired|Login ticket expired.|

### UserProfile

User profile

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nickname|String?|Nickname.|
|avatarURL|String?|Avatar URL.|
|selfSignature|String?|Personal signature.|
|gender|Gender?|Gender.|
|role|Int?|Role.|
|level|Int?|Level.|
|birthday|Long?|Birthday.|
|allowType|AllowType?|Friend verification type.|
|customInfo|Map<String, ByteArray>?|Custom information.|

### LoginState

Login state

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|loginStatus|StateFlow<LoginStatus>|Login status.|
|loginUserInfo|StateFlow<UserProfile?>|Logged-in user information.|

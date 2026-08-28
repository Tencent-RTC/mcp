## Introduction

`LoginStore` provides a complete set of login management APIs, including user login, logout, and personal information settings. Through this class, you can manage user login status and user profiles.

> **Important:**
> Use **shared** singleton object to access the `LoginStore` instance.
>

> **Note:**
> Login status updates are delivered through **loginState** publisher. Subscribe to it to receive real-time updates about login status.
>

## Features
- **User Login**: Supports login using SDK application ID, user ID and user signature.

- **User Logout**: Supports user logout operation.

- **Personal Information Settings**: Supports setting user nickname, avatar, gender and other personal information.

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
|loginEventStream|Login event stream.|
|login|Login.|
|logout|Logout.|
|setSelfInfo|Set personal information.|
|setCertificateID(apnsCertificateID:voipCertificateID:)|Set offline push certificate IDs.|

### Getting Instance

#### shared

Singleton object.
``` dart
static LoginStore get shared => LoginStoreImpl.instance;
```

**Version**

Supported since version 3.5.

### Events Handling

#### loginEventStream

Login event stream.

Login event stream. It is recommended to listen to this stream before calling **login**, so that you can receive login-related events in a timely manner.

**Data Structures：**LoginEvent

### Login Operations

#### login

Login.
``` dart
Future<CompletionHandler> login({
  required int sdkAppID,
  required String userID,
  required String userSig,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|sdkAppID|int|SDK application ID. Get this from **TRTC console**(https://console.trtc.io/app).|
|userID|String|User ID. The recommended length limit is 32 bytes, and only uppercase and lowercase English letters (a-zA-Z), digits (0-9), underscores, and hyphens are allowed.|
|userSig|String|User signature. For the generation of userSig, please .io/document/35166).|

#### logout

Logout.
``` dart
Future<CompletionHandler> logout();
```

**Version**

Supported since version 3.5.

#### setSelfInfo

Set personal information.
``` dart
Future<CompletionHandler> setSelfInfo({required UserProfile userInfo});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|userProfile|UserProfile|User profile.|

### Push Configuration

#### setCertificateID(apnsCertificateID:voipCertificateID:)

Set offline push certificate IDs.

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

User profile.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User ID.|
|nickname|String?|Nickname.|
|avatarURL|String?|Avatar URL.|
|selfSignature|String?|Personal signature.|
|gender|Gender?|Gender.|
|role|int?|Role. This field has no business restrictions, so you can safely use any valid integer value.|
|level|int?|Level. This field has no business restrictions, so you can safely use any valid integer value.|
|birthday|int?|Birthday. This field has no business restrictions, so you can safely use any valid integer value.|
|allowType|AllowType?|Friend verification type.|
|customInfo|Map<String, String>?|Custom information.|

### LoginState

Login state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|loginStatus|LoginStatus|Login status.|
|loginUserInfo|UserProfile?|Logged-in user information.|

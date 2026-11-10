---
sync_node_id: '108053284765868032'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "用户资料"
  - "JavaScript"
product: "chat"
---
## Feature Overview

Users can set and retrieve their own profile information, including nicknames, profile photos, and statuses, as well as view profile information of other users, including non-friends.

## UI Display

## User Profile Management

### Querying a user's own profile

##### **API**

【js】
``` javascript
chat.getMyProfile();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getMyProfile();
promise.then(function(imResponse) {
  console.log(imResponse.data); // Personal profile - profile instance
}).catch(function(imError) {
  console.warn('getMyProfile error:', imError); // Failed to retrieve the user's profile
});
```

### Querying the profile of another user

> **Note:**
> 1. If you haven't configured a custom profile field or have configured it without a value, this API will not return the custom profile content.
> 2. You can query up to 100 users at a time. Exceeding this limit may result in a response failure due to large data volume.

##### **API**

【js】
``` javascript
chat.getUserProfile(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of user accounts, which is an array.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getUserProfile({
   // even if you retrieve the profile of only one user, the value must be of array type
   // for example, userIDList: ['user1']
   userIDList: ['user1', 'user2']
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // Array that stores other users' profiles - [Profile]
}).catch(function(imError) {
  console.warn('getUserProfile error:', imError); // Failed to retrieve the user's profile
});
```

### Updating your personal profile

##### **API**

【js】
``` javascript
chat.updateMyProfile(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| nick | String \\| undefined | Nickname |
| avatar | String \\| undefined | Profile photo URL |
| gender | String \\| undefined | Gender. Valid values:<br>- <code>TencentCloudChat.TYPES.GENDER_UNKNOWN</code> (not set)<br>- <code>TencentCloudChat.TYPES.GENDER_FEMALE</code> (female)<br>- <code>TencentCloudChat.TYPES.GENDER_MALE</code> (male) |
| selfSignature | String \\| undefined | Status |
| allowType | String \\| undefined | When a friend request is received: Valid values:<br>- <code>TencentCloudChat.TYPES.ALLOW_TYPE_ALLOW_ANY</code> (no approval required)<br>- <code>TencentCloudChat.TYPES.ALLOW_TYPE_NEED_CONFIRM</code> (approval required)<br>- <code>TencentCloudChat.TYPES.ALLOW_TYPE_DENY_ANY</code> (reject) |
| birthday | Number \\| undefined | Birth date, such as <code>20000101</code>. |
| location | String \\| undefined | Location. We recommend you define a mapping relationship between numbers and locations locally. Actually, the backend saves four numbers of the <code>uint32_t</code> type. Here, the first <code>uint32_t</code> indicates the country, the second the province, the third the city, and the fourth the district/county. |
| language | Number \\| undefined | Language |
| messageSettings | Number \\| undefined | Message settings. Valid values:<br>- 0 (receive messages)<br>- 1 (don't receive messages) |
| adminForbidType | String \\| undefined | Friending. Valid values:<br>- <code>TencentCloudChat.TYPES.FORBID_TYPE_NONE</code> (allow, which is the default value)<br>- <code>TencentCloudChat.TYPES.FORBID_TYPE_SEND_OUT</code> (disallow) |
| level | Number \\| undefined | Level. We recommend you split it to save the level information of multiple roles. |
| role | Number \\| undefined | Role. We recommend you split it to save the information of multiple roles. |
| profileCustomField | Array \\| undefined | Collection of custom profile key-value pairs, which can be used as needed. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Modify a user's profile
let promise = chat.updateMyProfile({
  nick: 'My nickname',
  avatar: 'http(s)://url/to/image.jpg',
  gender: TencentCloudChat.TYPES.GENDER_MALE,
  selfSignature: 'My status',
  allowType: TencentCloudChat.TYPES.ALLOW_TYPE_ALLOW_ANY
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // Profile updated successfully
}).catch(function(imError) {
  console.warn('updateMyProfile error:', imError); // Failed to update the profile
});
```

【js】
``` javascript
// Modify personal custom profile fields
// Custom profile fields must be configured in the Chat console in advance 
// by clicking the desired app card and choosing Feature Configuration > User Custom Field
let promise = chat.updateMyProfile({
  profileCustomField: [
    {
      key: 'Tag_Profile_Custom_Test1',
      value: 'My custom profile 1'
    }
  ]
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // Profile updated successfully
}).catch(function(imError) {
  console.warn('updateMyProfile error:', imError); // Failed to update the profile
});
```

【js】
``` javascript
// Modify personal standard and custom profile fields
// Custom profile fields must be configured in the Chat console in advance
// by clicking the desired app card and selecting Feature Configuration > User Custom Field.
let promise = chat.updateMyProfile({
  nick: 'My nickname',
  profileCustomField: [
    {
      key: 'Tag_Profile_Custom_Test1',
      value: 'My custom profile 1'
    },
    {
      key: 'Tag_Profile_Custom_Test2',
      value: 'My custom profile 2'
    },
  ]
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // Profile updated successfully
}).catch(function(imError) {
  console.warn('updateMyProfile error:', imError); // Failed to update the profile
});
```

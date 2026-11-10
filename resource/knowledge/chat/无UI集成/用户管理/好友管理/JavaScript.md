---
sync_node_id: '108053283349241856'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "好友管理"
  - "JavaScript"
product: "chat"
---
## Feature Overview

The Chat SDK supports friend management, and users can add and delete friends and set to send messages only to friends.

> **Note:**
> By default, Chat SDK does not check the relationship when sending one-to-one messages. This default setting is generally applied in customer service scenarios, where having to friend a customer service agent before chatting is inefficient.
> 
> To require users to add each other as friends before they can exchange messages, log in to [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Under this section, enable **Stranger Direct Message Restrictions**. When this option is activated, only friends can send messages to each other. If a user tries to send a message to someone who is not their friend, the SDK returns [error code 20009](https://intl.cloud.tencent.com/document/product/1047/34348).
> 

## Getting contacts

Contacts cached in the SDK can be obtained. When the contacts are updated, the SDK will deliver the `TencentCloudChat.EVENT.FRIEND_LIST_UPDATED`event.

##### **API**

【js】
``` javascript
chat.getFriendList();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getFriendList();
promise.then(function(imResponse) {
  const friendList = imResponse.data; // Contacts
}).catch(function(imError) {
  console.warn('getFriendList error:', imError); // Failed to obtain contacts
});
```

## Adding a friend

##### **API**

【js】
``` javascript
chat.addFriend(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| to | String | User ID. |
| source | String | Friend source. It consists of two parts: the prefix and the keyword. The former is <code>AddSource_Type_</code>, and the latter must be a string of up to 8 bytes. We recommend you use an English word or its abbreviation as the keyword. For example, if the keyword is <code>Android</code>, this field will be <code>AddSource_Type_Android</code>. |
| wording | String \\| undefined | Friending remarks, which can contain up to 256 bytes. |
| type | String \\| undefined | Friending method (two-way friending by default). Valid values:<br>- <code>TencentCloudChat.TYPES.SNS_ADD_TYPE_SINGLE</code> (one-way friending, where user B is in the friend list of user A but not vice versa)<br>- <code>TencentCloudChat.TYPES.SNS_ADD_TYPE_BOTH</code> (two-way friending, where user B is in the friend list of user A and vice versa) |
| remark | String \\| undefined | Friend remarks, which can contain up to 96 bytes. |
| groupName | String \\| undefined | List name, which can contain up to 30 bytes. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Add a friend
let promise = chat.addFriend({
  to: 'user1',
  source: 'AddSource_Type_Web',
  remark: 'Jane',
  groupName: 'Friend',
  wording: 'I'm user0',
  type: TencentCloudChat.TYPES.SNS_ADD_TYPE_BOTH,
});
promise.then(function(imResponse) {
  // Sent the friend request successfully
  const { code } = imResponse.data;
  if (code === 30539) {
    // 30539 indicates that user1 has set the friend request processing method
    // to manually accept friend requests received.
    // The SDK will trigger the TencentCloudChat.EVENT.FRIEND_APPLICATION_LIST_UPDATED event.
  } else if (code === 0) {
    // 0 indicates that user1 has set the friend request processing method
    // to automatically accept all friend requests received.
    // The SDK will trigger the TencentCloudChat.EVENT.FRIEND_LIST_UPDATED event.
  }
}).catch(function(imError) {
  console.warn('addFriend error:', imError); // Failed to add the friend
});
```

## Deleting a friend

Delete friends. Both one-way deletion and two-way deletion are supported.

> **Note:**
> We recommend you include up to 100 `userID` values in the `userIDList` at a time, as a large data packet may be rejected by the backend, which requires that a data packet not exceed 1 MB.
> 

##### **API**

【js】
``` javascript
chat.deleteFriend(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| userIDList | Array | List of <code>userID</code> values of the friends to be deleted. The number of <code>userID</code> values cannot exceed 100 per request. |
| type | String \\| undefined | Deletion mode (two-way deletion by default). Valid values:<br>- <code>TencentCloudChat.TYPES.SNS_DELETE_TYPE_SINGLE</code> (one-way deletion, where user B is deleted from the friend list of user A but not vice versa)<br>- <code>TencentCloudChat.TYPES.SNS_DELETE_TYPE_BOTH</code> (two-way deletion, where user B is deleted from the friend list of user A and vice versa) |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.deleteFriend({
  userIDList: ['user1','user2'],
  type: TencentCloudChat.TYPES.SNS_DELETE_TYPE_BOTH
});
promise.then(function(imResponse) {
  const { successUserIDList, failureUserIDList } = imResponse.data;
  // List of successfully deleted `userID` values
  successUserIDList.forEach((item) => {
    const { userID } = item;
  });
  // List of `userID` values failed to be deleted
  failureUserIDList.forEach((item) => {
    const { userID, code, message } = item;
  });
  // If the contacts are updated,
  // the SDK will trigger the TencentCloudChat.EVENT.FRIEND_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('removeFromFriendList error:', imError);
});
```

## Checking the friend relationship

##### **API**

【js】
``` javascript
chat.checkFriend(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| userIDList | Array | List of the <code>userID</code> values to be verified. The number of <code>userID</code> values cannot exceed 1,000 per request. |
| type | String \\| undefined | Verification mode (two-way verification by default). Valid values:<br>- <code>TencentCloudChat.TYPES.SNS_CHECK_TYPE_SINGLE</code> (one-way verification, where the friend list of user A is checked for user B but not vice versa)<br>- <code>TencentCloudChat.TYPES.SNS_CHECK_TYPE_BOTH</code> (two-way verification, where the friend list of user A is checked for user B and vice versa) |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.checkFriend({
  userIDList: ['user0','user1'],
  type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_BOTH,
});
promise.then(function(imResponse) {
  const { successUserIDList, failureUserIDList } = imResponse.data;
  // List of the `userID` values that passed the verification
  successUserIDList.forEach((item) => {
    const { userID, code, relation } = item; // The value of code is always 0.
    // Possible results of one-way friend verification are:
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION
    // B is not on A's friend list, but it cannot determine whether A is on B's friend list.
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_A_WITH_B:
    // B is on A's friend list, but it cannot determine whether A is on B's friend list.
    // Possible results of two-way friend verification are:
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION:
    // A and B are not on each other's friend list
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_A_WITH_B:
    // B is on A's friend list, but A is not on B's friend list
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_B_WITH_A:
    // B is not on A's friend list, but A is on B's friend list
    // - relation: TencentCloudChat.TYPES.SNS_TYPE_BOTH_WAY:
    // A and B are on each other's friend list
  });
  // List of the `userID` values that failed the verification
  failureUserIDList.forEach((item) => {
    const { userID, code, message } = item;
  });
}).catch(function(imError) {
  console.warn('checkFriend error:', imError);
});
```

## Getting the friend profile

Obtain the complete friend data (including standard friend fields and custom friend fields) and the complete profile data (including standard profile fields and custom profile fields) of a specified friend.

##### **API**

【js】
``` javascript
chat.getFriendProfile(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of `userID` values of the friends.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getFriendProfile({
  userIDList: ['user0','user1']
});
promise.then(function(imResponse) {
  const { friendList, failureUserIDList } = imResponse.data;
  friendList.forEach((friend) => {
  });
  failureUserIDList.forEach((item) => {
    const { userID, code, message } = item;
  });
}).catch(function(imError) {
  console.warn('getFriendProfile error:', imError);
});
```

## Updating friends

Update the relationship chain data of a friend, only supporting updates to `remark` and `friendCustomField`.

##### **API**

【js】
``` javascript
chat.updateFriend(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userID|String|`userID` value of a friend|
|remark|String|Friend remarks, which can contain up to 96 bytes.|
|friendCustomField|Array.<Object>|A collection of custom field key-value pairs, which can be used according to the needs of the business side.|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// update friend remark
let promise = chat.updateFriend({
  userID: 'user1',
  remark: 'helloworld'
});
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getFriendProfile error:', imError);
});
```

【js】
``` javascript
let promise = chat.updateFriend({
  userID: 'user1',
  friendCustomField: [
    { key: 'Tag_SNS_Custom_test1', value: 'hello' },
    { key: 'Tag_SNS_Custom_test2', value: 'world' },
  ]
});
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getFriendProfile error:', imError);
});
```

## Getting the friend request list

Get  the friend request list cached by the SDK. When there is an update to the friend request list, the SDK will dispatch the event TencentCloudChat.EVENT.FRIEND_APPLICATION_LIST_UPDATED.

> **Note:**
> If the `allowType` in your profile (obtained through the `getMyProfile` interface) is set to `TencentCloudChat.TYPES.ALLOW_TYPE_ALLOW_ANY` (when being added as a friend: allowing anyone to add oneself as a friend), this interface will not be able to pull the friend request list.
> 

##### **API**

【js】
``` javascript
chat.getFriendApplicationList();
```

##### **Parameters**

None

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// update friend remark
let promise = chat.updateFriend({
  userID: 'user1',
  remark: 'helloworld'
});
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getFriendProfile error:', imError);
});
```

## Accepting a friend request

##### **API**

【js】
``` javascript
chat.acceptFriendApplication(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| userID | String | The <code>userID</code> of the pending friend request. |
| remark | String | Friend remarks, which can contain up to 96 bytes. |
| type | String | - <code>TencentCloudChat.TYPES.SNS_APPLICATION_AGREE</code> - Agree to add as a one-way friend.<br>- <code>TencentCloudChat.TYPES.SNS_APPLICATION_AGREE_AND_ADD</code> - Agree and add as a two-way friend. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.acceptFriendApplication({
  userID: 'user1',
  remark: 'My Customer Service 1',
  type: TencentCloudChat.TYPES.SNS_APPLICATION_AGREE_AND_ADD
});
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('acceptFriendApplication error:', imError);
});
```

## Refusing a friend request

##### **API**

【js】
``` javascript
chat.refuseFriendApplication(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userID|String|The `userID` of the pending friend request.|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.refuseFriendApplication({
  userID: 'user1',
});
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('refuseFriendApplication error:', imError);
});
```

## Deleting a friend request

##### **API**

【js】
``` javascript
chat.deleteFriendApplication(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| userID | String | The <code>userID</code> of the pending friend request. |
| type | String | - <code>TencentCloudChat.TYPES.SNS_APPLICATION_AGREE</code> - Agree to add as a one-way friend.<br>- <code>TencentCloudChat.TYPES.SNS_APPLICATION_AGREE_AND_ADD</code> - Agree and add as a two-way friend. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.refuseFriendApplication({
  userID: 'user1',
});
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('refuseFriendApplication error:', imError);
});
```

## Reporting the friend request has been read

##### **API**

【js】
``` javascript
chat.setFriendApplicationRead();
```

##### **Parameters**

None

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.setFriendApplicationRead();
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('setFriendApplicationRead error:', imError);
});
```

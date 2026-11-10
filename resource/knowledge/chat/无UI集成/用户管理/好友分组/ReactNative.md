---
sync_node_id: '108053281921081344'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "好友分组"
  - "React Native"
product: "chat"
---
## Feature Overview

To group friends into categories such as "Classmates at university" and "Coworkers", call the following APIs.

## Creating a friend group

##### **API**

【js】
``` javascript
chat.createFriendGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|name|String|List name|
|userIDList|Array|List of `userID` values of the friends to be added to the group|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.createFriendGroup({
  name: 'My friend group 1',
  userIDList: ['user0','user1']
});
promise.then(function(imResponse) {
  const { friendGroup,failureUserIDList } = imResponse;
  // friendGroup - Friend list instance
  // failureUserIDList - List of the `userID` values failed to be added
  // When the friend group is successfully created
  // the SDK triggers the TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('getFriendGroupInfo error:', imError); // Failed to obtain the information
});
```

## Deleting a friend group

##### **API**

【js】
``` javascript
chat.deleteFriendGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|name|String|group name|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.deleteFriendGroup({
  name: 'My friend group 1',
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // Friend list instance
  // When the friend group is successfully deleted
  // the SDK triggers the TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('deleteFriendGroup error:', imError); // Failed to obtain the information
});
```

## Renaming a friend group

##### **API**

【js】
``` javascript
chat.renameFriendGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|oldName|String|Old group name|
|newName|String|New group name|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.renameFriendGroup({
  oldName: 'Friends',
  newName: 'Besties'
});
promise.then(function(imResponse) {
  console.log(imResponse.data); // FriendGroup instance
  // When the name of a friend group is changed successfully
  // the SDK triggers the TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('updateMyProfile error:', imError);
});
```

## Getting friend group list

The friend groups cached in the SDK can be obtained. When a friend group is updated, the SDK will deliver the `TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED` event.

##### **API**

【js】
``` javascript
chat.getFriendGroupList();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getFriendGroupList();
promise.then(function(imResponse) {
  const friendGroupList = imResponse.data; // Friend list
}).catch(function(imError) {
  console.warn('getFriendGroupList error:', imError); // Failed to obtain the friend group
});
```

## Adding a friend to a list

##### **API**

【js】
``` javascript
chat.addToFriendGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|name|String|Group name|
|userIDList|Array|List of `userID` values of the friends to be added|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.addToFriendGroup({
  name: 'My friend group 1',
  userIDList: ['user1','user2'],
});
promise.then(function(imResponse) {
  const { friendGroup, failureUserIDList } = imResponse.data;
  // friendGroup - Friend list instance
  // failureUserIDList - List of the `userID` values failed to be added
  // When the friends are successfully added to the friend group,
  // the SDK triggers the TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('addToFriendGroup error:', imError); // Failed to obtain the information
});
```

## Removing a friend from a list

##### **API**

【js】
``` javascript
chat.removeFromFriendGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|name|String|Group name|
|userIDList|Array|List of `userID` values of the friends to be removed|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.removeFromFriendGroup({
  name: 'My friend group 1',
  userIDList: ['user1','user2'],
});
promise.then(function(imResponse) {
  const { friendGroup, failureUserIDList } = imResponse.data;
  // friendGroup - Friend list instance
  // failureUserIDList - List of the `userID` values failed to be added
  // When the friends are successfully removed from the friend group
  // the SDK triggers the TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED event.
}).catch(function(imError) {
  console.warn('addToFriendGroup error:', imError); // Failed to obtain the information
});
```

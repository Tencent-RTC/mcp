---
sync_node_id: '108053285648769024'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "黑名单"
  - "JavaScript"
product: "chat"
---
## Feature Overview

To block a user's messages, add the user to the blocklist.

> **Note:**
> - The maximum limit for the blocklist is 1000, and it cannot be adjusted.
> - If you want to keep users' friend relationships after blocking, you can  log in to the [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Set **Friendship Behavior When Blocking**, and choose **Keep friendship**.

## Blocking a user

By adding a user to the blocklist, you can block all the messages sent by the user. Therefore, this API can be used to block the messages of a specified user.
- If user A and user B are friends, the two-way friend relationship is terminated when either A or B is blocked by the other user.

- If either user A or user B is blocked by the other user, neither user A nor user B can start a conversation with the other user.

- If either user A or user B is blocked by the other user, neither user A nor user B can send a friend request to the other user.

##### **API**

【js】
``` javascript
chat.addToBlacklist(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of `userID` values of the users to be added to the blocklist. The number of `userID` values cannot exceed 1,000 per request.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.addToBlacklist({userIDList: ['user1', 'user2']});
promise.then(function(imResponse) {
  console.log(imResponse.data);
  console.warn('addToBlacklist error:', imError); // Failed to add the user to the blocklist
});
```

## Unblocking a user

After a user is removed from the blocklist, messages from the user can be received.

##### **API**

【js】
``` javascript
chat.removeFromBlacklist(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of `userID` values of the users to be removed from the blocklist. The number of `userID` values cannot exceed 1,000 per request.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.removeFromBlacklist({userIDList: ['user1', 'user2']});
  console.log(imResponse.data);
  console.warn('removeFromBlacklist error:', imError); // Failed to remove the user from the blocklist
});
```

## Getting the blocklist

The blocklist cached in the SDK can be obtained. 

##### **API**

【js】
``` javascript
chat.getBlacklist();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getBlacklist();
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getBlacklist error:', imError); // Failed to obtain the blocklist
});
```

## Notification of a change in the blocklist

When a  blocklist is updated, the SDK will deliver the `TencentCloudChat.EVENT.BLACKLIST_UPDATED` event.

##### Examples
``` javascript
let onBlacklistUpdated = function(event) {
  console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated);
```

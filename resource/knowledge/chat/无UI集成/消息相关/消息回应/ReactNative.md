---
sync_node_id: '128081257741914112'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息回应"
  - "React Native"
product: "chat"
---
## Feature Overview

The Message Response feature refers to interactive responses to a particular message, with Emoji Response being a typical example. Emoji Responses are made using emojis, allowing us to see the number of responders and the list of responders for each emoji.

The common Emoji Response display methods currently include the following two styles:
| Style One |  |
| --- | --- |
| Style Two |  |

Users can paginate and retrieve the profiles of all users who used a specific emoji.

You can implement the Emoji Response Capability based on the SDK API:
- Call the `addMessageReaction` interface to add an emoji to a message. After a successful addition, the emoji will store the information of the user who performed the operation.

- Call the `removeMessageReaction` interface to delete an already added emoji. After successful deletion, the emoji will no longer store the information of the user who performed the operation.

- Call the `getMessageReactions` interface to batch retrieve the emoji list of multiple messages, where each emoji includes the total number of users currently using it and the profiles of the first N (default 10) users.

- Call the `getAllUserListOfMessageReaction` interface to paginate and retrieve the complete list of user profiles for users of a message emoji.

- Listen to the `TencentCloudChat.EVENT.MESSAGE_REACTIONS_UPDATE` event to detect changes in the user information of emoji users. This event will carry the latest user information of the emoji (including the total number of users and the profiles of the top N users).

   > **Note:**
   > 
   > Supported from v3.2.0, this feature is only available to Advanced Customers. After [Purchasing the Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/pricing/chat), it can be used.
   > 

## UI Display

### Add message response

By calling the `addMessageReaction` interface, you can add a message response.

##### **API**

【js】
``` javascript
chat.addMessageReaction(message, reactionID);
```

**Parameters**

|Attribute|Meaning|Description|
|---------|---------|---------|
|message|Message object|The message is sent successfully.|
|reactionID|Message Response ID|In emoji response scenarios, the reactionID is the Emoji ID.|

> **Note:**
> - A single message supports up to 10 Reactions, and a single Reaction supports up to 100 users.
> - If the number of Reactions for a single message exceeds the maximum limit (10), the API call will return Error Code 23005.
> - If the number of users for a single Reaction exceeds the maximum limit (100), the API call will return Error Code 23006.
> - If the Reaction already includes the current user, the API call will return Error Code 23007.

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.addMessageReaction(message, 'smile');
promise.then(function(imResponse) {
  // Message Response Added Successfully
}).catch(function(imError) {
  // Failed to add message response
  console.warn('addMessageReaction error:', imError);
});
```

### Delete message response

Call the `removeMessageReaction`API to delete a message response.

##### **API**

【js】
``` javascript
chat.removeMessageReaction(message, reactionID);
```

**Parameters**

|Attribute|Meaning|Description|
|---------|---------|---------|
|message|Message object|The message is sent successfully.|
|reactionID|Message Response ID|In emoji response scenarios, the reactionID is the Emoji ID.|

> **Note:**
> - If the Reaction does not exist, the API call will return error code 23008.
> - If the Reaction does not include the current user, the API call will return error code 23009.

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.removeMessageReaction(message, 'smile');
promise.then(function(imResponse) {
  // Message response deleted successfully
}).catch(function(imError) {
  // Delete message response failed
  console.warn('removeMessageReaction error:', imError);
});
```

### Batch retrieve multiple message responses

Call `getMessageReactions` interface to batch retrieve multiple message response information.

##### **API**

【js】
``` javascript
chat.getMessageReactions(options);
```

**Parameters**
| Attribute | Meaning | Description |
| --- | --- | --- |
| messageList | Message list | Messages must belong to the same session and must be in a successfully sent state. |
| maxUserCountPerReaction | The maximum number of user profiles returned for each Reaction | Value range [0,10], each Reaction returns the profiles of up to the first 10 users only. For more user profiles,<br>You can call the <code>getAllUserListOfMessageReaction</code> interface as needed for pagination retrieval. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getMessageReactions({
  messageList: [message1, message2],
  maxUserCountPerReaction: 10,
});
promise.then(function(imResponse) {
  // Batch retrieval successful
   const resultList = imResponse.data;
   resultList.forEach((item) => {
     const { messageID, reactionList } = item;
     // The information returned by reactionList is as follows:
     // reactionID - Message Response ID
     // totalUserCount - Total number of users who responded to the same reactionID message
     // partialUserList - A partial list of users with the same reactionID, containing user's userID, nick, avatar information
   });
}).catch(function(imError) {
  // Batch retrieval failed
  console.warn('getMessageReactions error:', imError);
});
```

### Pagination retrieval of the full message response user list

Call `getAllUserListOfMessageReaction` interface for pagination retrieval of the full message response user list.

##### **API**

【js】
``` javascript
chat.getAllUserListOfMessageReaction(options);
```

**Parameters**

|Attribute|Meaning|Description|
|---------|---------|---------|
|message|Message object|The message is sent successfully.|
|reactionID|Message Response ID|In emoji response scenarios, the reactionID is the Emoji ID.|
|nextSeq|Pagination retrieval cursor|For the first transmission, pass 0, then for paging, pass the nextSeq returned by succ.|
|count|Maximum number of items that can be pulled in a single page|Supports up to 100|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getAllUserListOfMessageReaction({
  message: message,
  reactionID: 'smile',
  nextSeq: 0,
  count: 100,
});
promise.then(function(imResponse) {
  // Obtained successfully
  const { userList, nextSeq, isCompleted } = imResponse.data;
  // userList - User Information List, including user's userID, nick, avatar information
  // nextSeq - This parameter must be passed in for the next pull by page
  // isCompleted - Indicates whether all user information has been pulled. When isCompleted is true, nextSeq is 0
}).catch(function(imError) {
  // Failed to obtain
  console.warn('getAllUserListOfMessageReaction error:', imError);
});
```

### Message response information update

When the message response information changes, the SDK will dispatch the `TencentCloudChat.EVENT.MESSAGE_REACTIONS_UPDATED` event. You can obtain the updated message response information in the registered callback.

> **Note:**
> When the totalUserCount field value in the changed Reaction information is 0, it indicates that no users are using that Reaction anymore. You can remove the display of that Reaction from the UI.
> 

##### **Examples**

【js】
``` javascript
let onMessageReactionsUpdated = function(event) {
  const { messageID, reactionList } = event.data;
  // messageID - Message ID
  // reactionList - Message Response Update List
  reactionList.forEach((item) => {
   const { reactionID, totalUserCount, partialUserList } = item;
   // reactionID - Message Response ID
   // totalUserCount - Total number of users who responded to the same reactionID message
   // partialUserList - A partial list of users with the same reactionID
  });
};
chat.on(TencentCloudChat.EVENT.MESSAGE_REACTIONS_UPDATED, onMessageReactionsUpdated);
```

---
sync_node_id: '108053263251185664'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "获取会话"
  - "JavaScript"
product: "chat"
---
## Feature Overview

The Chat SDK provides an API for getting conversations, which can be used to get the `Conversation` object information of one or multiple specified conversations.

## Getting the Conversation List

> **Note:**
> 1. The profile in the conversation list obtained through this API is incomplete (it only includes profile photo, nickname, etc., which is sufficient to render the conversation list). To query detailed conversation profiles, refer to `getConversationProfile`.
> 2. By default, the client can pull 100 recent conversations from the cloud. After upgrading to the Pro edition 、Pro Plus edition or Enterprise edition, up to 500 recent conversations can be pulled from the cloud. The retention period of a conversation is the same as that of the last message, which is 7 days by default. Please see [Pricing](https://trtc.io/pricing/chat).
> 3. The retention period of a conversation is the same as that of the last message, which is 7 days by default.
> 4. The returned data field `isSyncCompleted` of this API is used to indicate whether the synchronization of the conversation list from the cloud has been completed.
> 5. After successful login, the SDK will actively pull the conversation list in a pagination request manner. The return result of this API is the conversation list pulled by the SDK. If the SDK has not yet pulled data from the cloud, calling this API will return an empty array.

##### **API**

【js】
``` javascript
chat.getConversationList(options);
```

##### **Parameters**
| Name | Type | Description |
| --- | --- | --- |
| options | undefined \\| Array \\| Object | Parameter options.<br>- If <code>options</code> are not passed, it means all conversations are retrieved<br>- If a non-empty array parameter is passed in, it indicates to get multiple specified conversations<br>- Passing <code>{ type, markType, groupName, hasUnreadCount, hasGroupAtInfo }</code> in the <code>options</code> means filtering the conversation list according to these conditions. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Get the full conversation list
let promise = chat.getConversationList();
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; 
}).catch(function(imError) {
  console.warn('getConversationList error:', imError); // Failed to obtain the conversation list
});
```

【js】
``` javascript
// Get the list of specified conversations
let promise = chat.getConversationList([conversationID1, conversationID2]);
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
}).catch(function(imError) {
  console.warn('getConversationList error:', imError); // Failed to obtain the conversation list
});
```

``` javascript
// Get all group conversations
let promise = chat.getConversationList({ type: TencentCloudChat.TYPES.CONV_GROUP });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get all "starred" conversations
let promise = chat.getConversationList({ markType: TencentCloudChat.TYPES.CONV_MARK_TYPE_STAR });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get all unmarked conversations
let promise = chat.getConversationList({ markType: 0 });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get all conversations under a specified conversation group
let promise = chat.getConversationList({ groupName: 'Suppliers' });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get all conversations that do not belong to any group
let promise = chat.getConversationList({ groupName: '' });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get all conversations with unread counts
let promise = chat.getConversationList({ hasUnreadCount: true });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

``` javascript
// Get conversations that include group @messages
let promise = chat.getConversationList({ hasGroupAtInfo: true });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList;
});
```

## Getting the Conversation Details

This API can be used to obtain detailed information about a conversation.

##### **API**

【js】
``` javascript
chat.getConversationProfile(conversationID);
```

##### **Parameters**
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID.<br>Conversation ID formation method:<br>- <code>C2C${userID}</code> (Private chat)<br>- <code>GROUP{groupID}</code> (Group Chat)<br>- <code>@TIM#SYSTEM</code> (System Notification Session) |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getConversationProfile(conversationID);
promise.then(function(imResponse) {
  // Obtained successfully
  console.log(imResponse.data.conversation); // Conversation profile
}).catch(function(imError) {
  console.warn('getConversationProfile error:', imError); // Failed to obtain the conversation profile
});
```

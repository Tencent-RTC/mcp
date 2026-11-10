---
sync_node_id: '108053258167689216'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话列表"
  - "React Native"
product: "chat"
---
## Feature Overview
- With conversation lists, users can easily locate target conversations after they log in to the application.

- The conversation list feature includes getting the conversation list and listening for conversation list update events.

- The core data structure is `Conversation`.

## Getting the Conversation List

Call the `getConversationList` API on the access side to get the conversation list.

##### **API**
``` javascript
chat.getConversationList(options);
```

##### Parameters
| Name | Type | Description |
| --- | --- | --- |
| options | undefined \\| Array \\| Object | - If <code>options</code> is <code>undefined</code>, the SDK will return all the conversations.<br>- if <code>options</code> is of the <code>Array</code> type, it shall not be empty, the SDK will return specified conversations.<br>- if <code>options</code> is of the <code>Object</code> type, as <code>{type, markType, groupName}</code>, the SDK will return filtered conversations. |

##### **Return value**

`Promise`

##### **Examples**   

【js】
``` javascript
// Get the full conversation list
let promise = chat.getConversationList();
promise.then(function(imResponse) {
// This full conversation list will overwrite the original conversation list.
  const conversationList = imResponse.data.conversationList;
  // Whether synchronizing the conversation list from the cloud is completed
  const isSyncCompleted = imResponse.data.isSyncCompleted;
}).catch(function(imError){
  console.warn('getConversationList error:', imError); // Error information
});
```

【js】
``` javascript
// Get the list of specified conversations
let promise = chat.getConversationList([conversationID1, conversationID2]);
promise.then(function(imResponse) {
  // List of specified conversations that already exist in the cache
  const conversationList = imResponse.data.conversationList;
}).catch(function(imError){
  console.warn('getConversationList error:', imError); // Error information
});
```

【js】
``` javascript
// Get all group conversations
let promise = chat.getConversationList({ type: TencentCloudChat.TYPES.CONV_GROUP });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

【js】
``` javascript
// Get all conversations that are marked as "favorite"
let promise = chat.getConversationList({ markType: TencentCloudChat.TYPES.CONV_MARK_TYPE_STAR });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

``` javascript
// Get all unmarked conversations (supported from v3.3.0 onwards)
let promise = chat.getConversationList({ markType: 0 });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

【js】
``` javascript
// Get all conversations in a specified conversation group
let promise = chat.getConversationList({ groupName: 'Suppliers' });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

``` javascript
// Get conversations that do not belong to any group (supported from v3.3.0 onwards)
let promise = chat.getConversationList({ groupName: '' });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

``` javascript
// Get conversations with unread counts (supported from v3.3.0 onwards)
let promise = chat.getConversationList({ hasUnreadCount: true });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

``` javascript
// Get conversations with group @ messages (supported from v3.3.0 onwards)
let promise = chat.getConversationList({ hasGroupAtInfo: true });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation List
});
```

## Listening for Conversation List Update Events

Listen for `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` events on the access side to get conversation list update notifications.

**Examples**

【js】
``` javascript
let onConversationListUpdated = function(event) {
  console.log(event.data); // Array that stores Conversation instances
};
chat.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
```

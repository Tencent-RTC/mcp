---
sync_node_id: '108053278714535936'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "清空消息"
  - "React Native"
product: "chat"
---
## Feature Overview

When messages in a conversation are cleared, all the messages in the conversation will be cleared both locally and from the cloud, but the conversation itself will not be deleted.

> **Note:**
> 1. When messages in a conversation are cleared, `unreadCount` will be set to `0`, and the content of `lastMessage` will be cleared as well.
> 2. This API cannot be used to clear messages in a topic.

## UI Display

## Clearing Messages

##### **API**
``` javascript
chat.clearHistoryMessage(conversationID);
```

##### **Parameters**
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, in the format of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP{groupID}</code> (for group chats) |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Clear one-to-one messages locally and from the cloud
let promise = chat.clearHistoryMessage('C2CExample');
promise.then(function(imResponse) {
  // Messages cleared successfully
}).catch(function(imError){
  console.warn('clearHistoryMessage error:', imError); // Message clearing failure information
});
```

``` javascript
// Clear group messages locally and from the cloud
let promise = chat.clearHistoryMessage('GROUPExample');
promise.then(function(imResponse) {
  // Messages cleared successfully
}).catch(function(imError){
  console.warn('clearHistoryMessage error:', imError); // Message clearing failure information
});
```

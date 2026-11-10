---
sync_node_id: '108053262015963136'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "置顶会话"
  - "React Native"
product: "chat"
---
## Feature Overview

Pinning a conversation to the top is to fix a one-to-one or group conversation at the top of the conversation list to facilitate search. The status of a conversation being pinned to the top will be stored on the server and synced to new devices.

After this API is called successfully, the conversation list will be sorted again, and the SDK will distribute the `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` event.

> **Note:**
> The maximum number of conversations that can be pinned to the top is 50, and this limit cannot be increased.
> 

## UI Display

## Pinning/Unpinning a Conversation to/from the Top

##### **API**

【js】
``` javascript
chat.pinConversation(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP{groupID}</code> (for group chats)<br>- <code>@TIM#SYSTEM</code> (system notification conversation)<br>- <code>GROUP${topicID}</code> (topic) |
| isPinned | Boolean | - <code>true</code>, the conversation is pinned to the top<br>- <code>false</code>, the conversation is unpinned from the top |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Pin a conversation to top
let promise = chat.pinConversation({ conversationID: 'C2CExample', isPinned: true });
promise.then(function(imResponse) {
  // The conversation is pinned to top successfully.
  const { conversationID } = imResponse.data; // ID of the conversation pinned to top
}).catch(function(imError){
  console.warn('pinConversation error:', imError); // Error information
});
```

【js】
``` javascript
// Unpin a conversation from top
let promise = chat.pinConversation({ conversationID: 'C2CExample', isPinned: false });
promise.then(function(imResponse) {
  // The conversation is unpinned from top successfully.
  const { conversationID } = imResponse.data; // ID of the conversation unpinned from top
}).catch(function(imError){
  console.warn('pinConversation error:', imError); // Error information
});
```

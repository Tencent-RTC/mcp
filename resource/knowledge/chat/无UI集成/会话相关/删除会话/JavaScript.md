---
sync_node_id: '108053261497966592'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "删除会话"
  - "JavaScript"
product: "chat"
---
## Feature Overview

If a user doesn't want to view the historical one-to-one or group messages after deleting a friend or leaving a group, the user can choose to delete the conversation.

## Deleting a Conversation

> **Note:**
> 1. When deleting a conversation, the default behavior is to clear the conversation history messages. Please be cautious before proceeding. If you need to retain the conversation history messages, please set `clearHistoryMessage` to `false`.
> 2. Multi-client sync is disabled for conversation deletion by default. To enable it, log in to the [Chat Console](https://console.trtc.io/chat/login-message), select **Application Configuration** > **Feature Configuration** > **Login and Message** > **Multi-client Synchronization Settings**, and enable **Sync Conversation Deletion Across Clients**.
> 3. It supports for bulk deletion of conversations (up to 100 conversations at a time), with the option to choose whether to clear the history messages.
> 4. In scenarios such as members leaving the group, the group owner dissolving the group, or members being kicked out of the group, if the user's login state has not expired, the corresponding group conversation will still be retained in the local conversation list. At this time, users can view the cached historical messages, but they cannot send messages.

##### **API**

【js】
``` javascript
chat.deleteConversation(options);
```

##### **Parameters**
| Name | Type | Description |
| --- | --- | --- |
| options | String \\| Object | If the options parameter is of the String type, it's valid values as blow:<br>- <code>C2C${userID}</code> (for a one-to-one chat)<br>- <code>GROUP{groupID}</code> (for a group chat)<br>- <code>@TIM#SYSTEM</code> (for a system notification conversation) |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// delete the specified conversation and clear chat history
let promise = chat.deleteConversation('C2CExample');
promise.then(function(imResponse) {
  // Deleted the conversation successfully
  const { conversationID } = imResponse.data;// ID of the deleted conversation
}).catch(function(imError) {
  console.warn('deleteConversation error:', imError); // Failed to delete the conversation
});
```

``` javascript
// delete the specified conversation and not clear chat history
let promise = chat.deleteConversation({conversationIDList: ['C2CExample'], clearHistoryMessage: false});
promise.then(function(imResponse) {
  // Deleted the conversation successfully
  const { conversationIDList } = imResponse.data; // ID of the deleted conversation
}).catch(function(imError) {
  console.warn('deleteConversation error:', imError); // Failed to delete the conversation
});
```

``` javascript
// delete multiple conversations and clear chat history
let promise = chat.deleteConversation({conversationIDList: ['C2CExample', 'GROUPExample']});
promise.then(function(imResponse) {
  const { conversationIDList } = imResponse.data; // ID list of the deleted conversations
}).catch(function(imError) {
  console.warn('deleteConversation error:', imError); // Failed to delete the conversation
});
```

``` javascript
// delete multiple conversations and clear chat history
let promise = chat.deleteConversation({
  conversationIDList: ['C2CExample', 'GROUPExample'],
  clearHistoryMessage: false
});
promise.then(function(imResponse) {
  const { conversationIDList } = imResponse.data; // ID list of the deleted conversations
}).catch(function(imError) {
  console.warn('deleteConversation error:', imError); // Failed to delete the conversation
});
```

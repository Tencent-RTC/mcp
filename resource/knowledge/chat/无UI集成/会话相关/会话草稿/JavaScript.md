---
sync_node_id: '159395761761185792'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话草稿"
  - "JavaScript"
product: "chat"
---
## Feature Overview

When sending a message, the user may want to switch to another chat window before finishing the message. The unfinished message can be saved through the `setConversationDraft` API, so that the user can get back to it through the `draftText` field of the `Conversation` object and finish it.

> **Note:**
> 1. A conversation draft can contain only text.
> 2. A conversation draft will be stored only in the local database and not on the server. Therefore, it cannot be synced across devices and will not be available after the application is uninstalled and reinstalled.

## UI Display

You can achieve the conversation draft effect shown in the figure below using this feature. Click on that conversation to enter the chat interface, and the draft content will automatically be filled into the input box:

## Setting a Conversation Draft

##### **API**

【js】
``` javascript
chat.setConversationDraft(options);
```

##### **Parameters**
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP{groupID}</code> (for group chats) |
| draftText | String | draft content, passing an empty string <code>''</code> indicates canceling the draft. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.setConversationDraft({
   conversationID: 'GROUPpublic1',
   draftText: '123'
});
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('setConversationDraft error:', imError);
});
```

``` javascript
// Canceling a conversation draft
let promise = chat.setConversationDraft({
   conversationID: 'GROUPpublic1',
   draftText: ''
});
promise.then(function(imResponse) {
}).catch(function(imError) {
  console.warn('setConversationDraft error:', imError);
});
```

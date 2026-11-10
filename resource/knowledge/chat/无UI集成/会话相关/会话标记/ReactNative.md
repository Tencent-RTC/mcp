---
sync_node_id: '161578227601117184'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话标记"
  - "React Native"
product: "chat"
---
## Feature Overview

In some cases, you may need to mark a conversation, for example, as "favorite", "collapsed", "hidden", or "unread", which can be implemented through the following API.

> **Note:**
> To use this feature, you need to [purchase the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/pricing/chat).
> 

## UI Display

## Setting conversation custom data

After successfully calling the API, the SDK will dispatch the event `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED`.

##### **API**

【js】
``` javascript
chat.setConversationCustomData(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationIDList | String | List of conversation IDs |
| customData | String | Custom data, with a maximum length support of 256 bytes.<br>Setting it to <code>''</code> will clear the conversation custom data. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.setConversationCustomData({
  conversationIDList: ['GROUPtest', 'C2Cexample'],
  customData: 'your custom data'
});
promise.then(function(imResponse) {
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  const conversationList = chat.getConversationList(successConversationIDList);
  
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError) {
  console.warn('setConversationCustomData error:', imError);
});
```

``` javascript
// clear the conversation custom data.
let promise = chat.setConversationCustomData({
  conversationIDList: ['GROUPtest', 'C2Cexample'],
  customData: ''
});
promise.then(function(imResponse) {
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  const conversationList = chat.getConversationList(successConversationIDList);
 
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError) {
  console.warn('setConversationCustomData error:', imError);
});
```

## Conversation Mark

Call the `markConversation` API to mark or unmark a conversation.

> **Note:**
> 1. When a user marks a conversation, the SDK simply records the mark value and does not change the underlying logic of the conversation. For example, marking a conversation as `TencentCloud.TYPES.CONV_MARK_TYPE_UNREAD` does not alter the unread count at the underlying layer.
> 2. The SDK provides four default marks ("favorite", "collapsed", "hidden", and "unread"). If they cannot meet your requirements, you can customize extended marks, which must meet the following conditions:
> -  The value of an extended mark cannot be the same as that of an existing one.
> -  Custom mark values must be Math.power(2, n) (32 <= n < 64, meaning n must be greater than or equal to 32 and less than 64), for instance, a custom Math.power(2, 32) mark value represents "iPhone Online".

##### **API**

【js】
``` javascript
chat.markConversation(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationIDList | String | List of conversation IDs |
| markType | Number | Conversation mark type |
| enableMark | Boolean | - <code>true</code>: Mark.<br>- <code>false</code>: Unmark |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Mark a conversation as "favorite"
let promise = chat.markConversation({
  conversationIDList: ['GROUPtest', 'C2Cexample'],
  markType: TencentCloudChat.TYPES.CONV_MARK_TYPE_STAR,
  enableMark: true
});
promise.then(function(imResponse) {
  // Marked the conversation as "favorite" successfully
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  // successConversationIDList - List of conversations that were marked successfully
  // Get the conversation list
  const conversationList = chat.getConversationList(successConversationIDList);

  // failureConversationIDList - List of conversations that failed to be marked as "favorite"
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError){
  console.warn('markConversation error:', imError);
});
```

### Listening for the notification of a conversation mark change

After a conversation is marked or unmarked, the `markList` field in `Conversation` will change. You can listen for such a change notification through the `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` event.

##### **Examples**

【js】
``` javascript
let onConversationListUpdated = function(event) {
  console.log(event.data); // Array that stores Conversation instances
};
chat.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
```

### Pulling a specified marked conversation

Call the `getConversationList` API to pull a specified marked conversation.

##### **Examples**

【js】
``` javascript
// Obtain all conversations that are marked as "favorite"
let promise = chat.getConversationList({ markType: TencentCloudChat.TYPES.CONV_MARK_TYPE_STAR });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

【js】
``` javascript
// Obtain all one-to-one conversations that are marked as "collapsed"
let promise = chat.getConversationList({
  markType: TencentCloudChat.TYPES.CONV_MARK_TYPE_FOLD,
  type: TencentCloudChat.TYPES.CONV_C2C
});
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

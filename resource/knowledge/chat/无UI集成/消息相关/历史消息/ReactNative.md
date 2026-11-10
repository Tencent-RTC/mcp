---
sync_node_id: '108053268371382272'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "历史消息"
  - "React Native"
product: "chat"
---
## Feature Overview

The SDK supports message pull by page, sequence, or time range. Historical messages stored in the cloud are subject to the following time limits:
- Developer edition: The free storage period is 7 days and cannot be extended.

- Standard edition: The free storage period is 7 days and cannot be extended.

- Pro edition :The free storage period is 30 days and cannot be extended.

- Pro Plus edition :The free storage period is 60 days and cannot be extended.

- Enterprise edition: The free storage period is 90 days and cannot be extended.

   > **Note**
   > 
   > - Extending the storage period of historical messages is a Value-Added Service. You can log in to the [Chat Console](https://console.trtc.io/) to modify the relevant configuration. For billing details, see [Pricing](https://trtc.io/pricing/chat). 
   > - Rich media messages (such as images, files, and audios) have the same storage periods as historical messages.

## Pulling a Message List

### getMessageList

This API is used to pull the list of messages in a specified conversation by page. It needs to be called when the message list is rendered for the first time after the user enters the conversation, or when the user pulls down the list to view more messages.

> **Note**
> 1. This interface can be used for "pulling historical messages" (excluding AVChatRoom).
> 2. AVChatRoom does not store historical messages by default. When new users enter the AVChatRoom, they can only see messages sent after they joined. To enhance user engagement and participation in the AVChatRoom, you can update the number of recent messages that new members can view in the Chat console > Application Configuration > Feature Configuration > Group Configuration -> Live Group New Member View Pre-join Message Quantity Configuration. This feature is only available in the Pro edition 、Pro Plus edition or Enterprise edition. New group members can view the latest messages generated within the 24 hours before they joined, up to a maximum of 20 messages.
> 3. If you want to search for local messages, please use `findMessage`. If you want to search for all cloud messages, please use `searchCloudMessages` (this feature is a Value-Added Service, and you need to purchase the cloud search plugin. Please click to [buy](https://console.trtc.io/chat/plugin/TUICloudSearch)).

##### **API**
``` javascript
chat.getMessageList(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP${groupID}</code> (for group chats)<br>- <code>GROUP${topicID}</code> (topic)<br>- <code>@TIM#SYSTEM</code> (system notification conversation) |
| nextReqMessageID | String \\| undefined | Message ID used for the subsequent paged pull. Leave this field empty for the first pull and enter its the value returned by the <code>getMessageList</code> API for the subsequent pull. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Pull the message list for the first time when a conversation is opened
let promise = chat.getMessageList({conversationID: 'C2Ctest'});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // Message list
  // This parameter must be passed in for the next pull by page.
  const nextReqMessageID = imResponse.data.nextReqMessageID;
  // It indicates whether all messages have been pulled.
  const isCompleted = imResponse.data.isCompleted;
});
```

``` javascript
// Pull down the message list to view more messages
let promise = chat.getMessageList({conversationID: 'C2Ctest', nextReqMessageID});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // Message list
  // This parameter must be passed in for the next pull by page.
  const nextReqMessageID = imResponse.data.nextReqMessageID;
  // It indicates whether all messages have been pulled.
  const isCompleted = imResponse.data.isCompleted; 
});
```

### getMessageListHopping

This API is used to pull a message list by specified sequence or time range.

##### **API**
``` javascript
chat.getMessageListHopping(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP${groupID}</code> (for group chats)<br>- <code>GROUP${topicID}</code> (topic). |
| sequence | Number \\| undefined | <code>sequence</code> of the message starting from which to pull roaming group messages |
| time | Number \\| undefined | Server time of the message, starting from which to pull roaming one-to-one messages |
| direction | Number | Message pull direction, which defaults to <code>0</code>.<br>- 0: pull in reverse chronological order  to get older messages;<br>- 1: pull in chronological order to get recent messages |
| count | Number \\| undefined | Number of messages to be pulled. It defaults to 15, which is also the maximum value, indicating that up to 15 messages can be pulled and returned at a time. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Pull roaming group messages by sequence.
// `direction`: 0: pull in reverse chronological order to get older messages
// 1: pull in chronological order to get recent messages
let promise = chat.getMessageListHopping({
  conversationID: 'GROUPtest',
  sequence: 100,
  count: 15,
  direction: 0
});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // Message list
});
```

``` javascript
// Pull roaming one-to-one messages by time range.
// `direction`: 0: pull in reverse chronological order to get older messages
// 1: pull in chronological order to get recent messages
let promise = chat.getMessageListHopping({
  conversationID: 'C2Ctest',
  time: xxx,
  count: 15,
  direction: 0
});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // Message list
});
```

---
sync_node_id: '108053268715315200'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "历史消息"
  - "JavaScript"
product: "chat"
---
## Feature Overview

The SDK supports message Retrieval by page, sequence, or time range. Historical messages stored in the cloud are subject to the following time limits:
- Free Trial: The free storage period is 7 days and cannot be extended.

- Standard edition: The free storage period is 7 days and can be extended.

- Pro edition: The free storage period is 30 days and can be extended.

- Pro Plus edition: The free storage period is 90 days and can be extended.

- Enterprise edition: The free storage period is 90 days and can be extended.

   > **Note**
   > 
   > - Extending the storage period of historical messages is a Value-Added Service. You can log in to the [Chat Console](https://console.trtc.io/) to modify the relevant configuration. For billing details, see [Pricing](https://trtc.io/pricing/chat). 
   > - Rich media messages (such as images, files, and audios) have the same storage periods as historical messages.

## Retrieving a Message List

### getMessageList

This API is used to Retrieve the list of messages in a specified conversation by page. It needs to be called when the message list is rendered for the first time after the user enters the conversation, or when the user pulls down the list to view more messages.

> **Note**
> 1. This API can retrieve message history for all group types **except AVChatRoom**.
> 2. By default, **AVChatRoom** does not store message history. New members can only see messages sent after they join the room. To improve engagement, you can enable message history for new members:
> - Navigate to: **Chat Console > Configuration > Group Configuration > Message History for New Members**
> - Configuration: Set the number of recent messages visible to new members
> - Availability: **Pro edition, Pro Plus edition,** or **Enterprise edition** only
> - Limits: New members can receive up to **50** messages from the **past 24 hours** via `MESSAGE_RECEIVED` event
> 3. If you want to search local messages, use `findMessage`. If you want to search full cloud messages, use `searchCloudMessages` (This is a value-added service requiring the Cloud Search Plugin. [Purchase here](https://console.trtc.io/chat/plugin/TUICloudSearch)).

##### **API**
``` javascript
chat.getMessageList(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP${groupID}</code> (for group chats)<br>- <code>GROUP${topicID}</code> (topic)<br>- <code>@TIM#SYSTEM</code> (system notification conversation) |
| nextReqMessageID | String \\| undefined | Message ID used for the subsequent paged retrieval. Leave this field empty for the first retrieval and enter its the value returned by the <code>getMessageList</code> API for the subsequent retrieval. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Retrieve the message list for the first time when a conversation is opened
let promise = chat.getMessageList({conversationID: 'C2Ctest'});
promise.then(function(imResponse) {
  const messageList = imResponse.data.messageList; // Message list
  // This parameter must be passed in for the next retrieval by page.
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
  // This parameter must be passed in for the next retrieval by page.
  const nextReqMessageID = imResponse.data.nextReqMessageID;
  // It indicates whether all messages have been pulled.
  const isCompleted = imResponse.data.isCompleted; 
});
```

### getMessageListHopping

This API is used to Retrieve a message list by specified sequence or time range.

##### **API**
``` javascript
chat.getMessageListHopping(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID, which consists of:<br>- <code>C2C${userID}</code> (for one-to-one chats)<br>- <code>GROUP${groupID}</code> (for group chats)<br>- <code>GROUP${topicID}</code> (topic). |
| sequence | Number \\| undefined | <code>sequence</code> of the message starting from which to retrieve roaming group messages |
| time | Number \\| undefined | Server time of the message, starting from which to retrieve roaming one-to-one messages |
| direction | Number | Message retrieval direction, which defaults to <code>0</code>.<br>- 0: Retrieve in reverse chronological order to get older messages;<br>- 1: Retrieve in chronological order to get recent messages |
| count | Number \\| undefined | Number of messages to be retrieved. It defaults to 15, which is also the maximum value, indicating that up to 15 messages can be retrieved and returned at a time. |

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Retrieve roaming group messages by sequence.
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
// Retrieve roaming one-to-one messages by time range.
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

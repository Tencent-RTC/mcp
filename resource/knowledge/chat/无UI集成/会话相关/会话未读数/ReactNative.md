---
sync_node_id: '108053259022278656'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话未读数"
  - "React Native"
product: "chat"
---
## Feature Overview

A user's conversation list usually contains multiple conversations. If there is a new message in one of the conversations, a badge needs to be displayed in the list cell to indicate the unread count.

After the user clicks to enter the conversation and goes back to the conversation list, the unread count is cleared, and the badge disappears. In some applications, the total unread count of all the conversations is calculated and displayed at the bottom tab of the conversation list.

## UI Display

## Get the total number of unread messages in all conversations

> **Note:**
> 1. Only applicable to Work/Public/Community/Meeting group. AVChatRoom are not currently supported.
> 2. The total number of unread messages will subtract the unread count of conversations set to Do Not Disturb.
> 3. The total number of unread messages does not include the unread count of system conversations.
> 4. Because this interface relies on the SDK to synchronize the conversation list from the cloud, the total number of unread messages obtained immediately after successful login may be 0. The access side can update the local total number of unread messages in combination with the  `TencentCloud.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED` event.

##### **API**

【js】
``` javascript
chat.getTotalUnreadMessageCount();
```

##### **Return value**

`Number`

##### **Examples**

【js】
``` javascript
// The total number of unread messages in one-to-one and group conversations
let totalUnreadCount = chat.getTotalUnreadMessageCount();
```

## Notification of change in total number of unread messages in all conversations

##### **Examples**

【js】
``` javascript
let onTotalUnreadMessageCountUpdated = function(event) {
  console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, onTotalUnreadMessageCountUpdated);
```

## Clearing the conversation unread count

##### **API**

【js】
``` javascript
chat.setMessageRead(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID. Valid values:<br>- <code>C2C${userID}</code> (for a one-to-one chat)<br>- <code>GROUP{groupID}</code>(for a group chat)<br>- <code>@TIM#SYSTEM</code> (for a system notification conversation)<br>- <code>GROUP${topicID}</code> (for a topic) |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Set all the unread messages in a conversation as read
let promise = chat.setMessageRead({conversationID: 'C2Cexample'});
promise.then(function(imResponse) {
  // Set the unread messages as read successfully.
  // The value of the `unreadCount` attribute of the conversation with the specified ID is set to `0`.
}).catch(function(imError) {
  // Failed to set the unread messages as read
  console.warn('setMessageRead error:', imError);
});
```

## Clearing the unread count of all conversations

##### API

【js】
``` javascript
chat.setAllMessageRead(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| scope | String \\| undefined | Set the scope of message processing. Valid values:<br>- <code>TencentCloudChat.TYPES.READ_ALL_C2C_MSG</code>: set the unread messages of all the one-to-one conversations as read<br>- <code>TencentCloudChat.TYPES.READ_ALL_GROUP_MSG</code>: set the unread messages of all the group conversations as read<br>- <code>TencentCloudChat.TYPES.READ_ALL_MSG</code> (default value): set the unread messages of all the one-to-one and group conversations as read |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Set the unread messages of all the conversations as read
// Same as `chat.setAllMessageRead({scope: TencentCloudChat.TYPES.READ_ALL_MSG})`
let promise = chat.setAllMessageRead();
promise.then(function(imResponse) {
  // Set the unread messages as read successfully.
  // The values of the `unreadCount` attribute of all the conversations are set to `0`.
}).catch(function(imError) {
  // Failed to set the unread messages as read
  console.warn('setAllMessageRead error:', imError);
});
```

【js】
``` javascript
// Set the unread messages of all the one-to-one conversations as read
let promise = chat.setAllMessageRead({scope: TencentCloudChat.TYPES.READ_ALL_C2C_MSG});
promise.then(function(imResponse) {
  // Set the unread messages as read successfully.
  // The values of the `unreadCount` attribute of all the one-to-one conversations are set to `0`.
}).catch(function(imError) {
  // Failed to set the unread messages as read
  console.warn('setAllMessageRead error:', imError);
});
```

【js】
``` javascript
// Set the unread messages of all the group conversations as read
let promise = chat.setAllMessageRead({scope: TencentCloudChat.TYPES.READ_ALL_GROUP_MSG});
promise.then(function(imResponse) {
  // Set the unread messages as read successfully.
  // The values of the `unreadCount` attribute of all the group conversations are set to `0`.
}).catch(function(imError) {
  // Failed to set the unread messages as read
  console.warn('setAllMessageRead error:', imError);
});
```

## Sending a message excluded from the conversation unread count

In normal cases, both one-to-one messages and group messages that are sent will be included in the unread count. The `unreadCount` attribute of the `Conversation` object indicates the unread message count of a conversation.

If you want to send messages that will not be included in the unread count, such as tips or control messages, you can .

##### **Examples**

【js】
``` javascript
chat.sendMessage(message, {
  messageControlInfo: {
    // `unreadCount` of the conversation is not updated (the message is stored on the roaming server).
    excludedFromUnreadCount: true,
    // `lastMessage` of the conversation is not updated (the message is stored on the roaming server). 
    excludedFromLastMessage: true
  }
});
```

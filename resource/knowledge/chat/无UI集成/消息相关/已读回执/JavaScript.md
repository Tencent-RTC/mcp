---
sync_node_id: '108053271498235904'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "已读回执"
  - "JavaScript"
product: "chat"
---
## Feature Overview

If a message sender wants to know who has or has not read the message, the sender needs to enable the message read receipt feature.
After this feature is enabled, the sender can set whether a message requires a read receipt when sending the message; if yes, the sender will receive a receipt after the message is read by the receiver.

> **Note:**
> 1. This feature is only available to Pro edition 、Pro Plus edition or Enterprise edition customers and can be used after [purchasing the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/register).
> 2. Community group and AVChatRoom do not support this feature.

## UI Display

## Message Read Receipt

### Specifying a group type for which to support message read receipts

Log in to the [Chat Console > Configuration > Group Configuration > Read receipts for group messages](https://console.trtc.io/chat/qun-setting).

### Specifying that a message requires a read receipt (by the sender)

The sender creates a message, sets `needReadReceipt` to `true`, and sends the message.

##### Examples
``` javascript
// Create a one-to-one message
let message = chat.createTextMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  payload: {
    text: 'Hello world!'
  },
  // To use it, purchase the Pro edition 、Pro Plus edition or Enterprise edition and set `needReadReceipt` to `true` when creating a message.
  needReadReceipt: true
});
// 2. Send the message.
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Message sent successfully
  console.log(imResponse);
}).catch(function(imError) {
  // Failed to send the message
  console.warn('sendMessage error:', imError);
});
```

【js】
``` javascript
// Create a group message
let message = chat.createTextMessage({
  to: 'test',
  conversationType: TencentCloudChat.TYPES.CONV_GROUP,
  payload: {
    text: 'Hello world!'
  },
  // To use it, purchase the Pro edition 、Pro Plus edition or Enterprise edition and set `needReadReceipt` to `true` when creating a message.
  needReadReceipt: true
});
// Send the message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Message sent successfully
  console.log(imResponse);
}).catch(function(imError) {
  // Failed to send the message
  console.warn('sendMessage error:', imError);
});
```

### Sending a message read receipt (by the receiver)

After receiving the message, the receiver determines whether the message requires a read receipt based on the `needReadReceipt` field in `Message`. If yes, after the user reads the message, the receiver calls the `sendMessageReadReceipt` API to send a read receipt.

> **Note:**
> 1. Messages in the `messageList` must be from the same one-to-one or group conversation.
> 2. After this API is called successfully, the unread count of the conversation will not change, and the sender will receive the `TencentCloudChat.TYPES.MESSAGE_READ_RECEIPT_RECEIVED` callback which contains the latest read information of the message.
> 3. Using this API requires you to purchase the Pro edition 、Pro Plus edition or Enterprise edition.
> 4. Community and  AVChatRoom do not support this feature.
> 5. After successfully calling this API for C2C messages, the `message.readReceiptInfo.isPeerRead` property of the message sender will be updated to `true`. This property can be used for rendering the read receipt status of C2C messages. Calling this API will not update the `isPeerRead` property of the message.

##### **API**

【js】
``` javascript
chat.sendMessageReadReceipt(messageList);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|messageList|Array|List of messages (up to 30) in the same conversation|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Pull the group message list
let messageList = null;
chat.getMessageList({conversationID: 'GROUPtest'}).then(function(imResponse) {
  messageList = imResponse.data.messageList; // Message list
  chat.sendMessageReadReceipt(messageList).then(function() {
    // Read receipt for the group message sent successfully
  }).catch(function(imError) {
    // Failed to send a read receipt for the group message
  });
});
```

【js】
``` javascript
// Pull the one-to-one message list
let messageList = null;
chat.getMessageList({conversationID: 'C2Ctest'}).then(function(imResponse) {
  messageList = imResponse.data.messageList; // Message list
  chat.sendMessageReadReceipt(messageList).then(function() {
    // Read receipt for the one-to-one message sent successfully
  }).catch(function(imError) {
    // Failed to send a read receipt for the one-to-one message
  });
});
```

### Listening for a message read receipt notification (by the sender)

After the receiver sends a message read receipt, the sender can listen for a receipt notification and update the UI based on the notification to display the message as, for example, "Read by two members".

##### **Examples**

【js】
``` javascript
let onMessageReadReceiptReceived = function(event) {
  // event.data - An array that stores message read receipt information
  const readReceiptInfoList = event.data;
  readReceiptInfoList.forEach((item) => {
    const { groupID, userID, messageID, readCount, unreadCount, isPeerRead, timestamp } = item;
    // messageID - Message ID
    // userID - one-to-one message receiver
    // isPeerRead - Whether the one-to-one message is read by the receiver
    // timestamp - one-to-one message peer send read receipt time.
    // groupID - Group ID
    // readCount - Number of members who have read the group message
    // unreadCount - Number of members who have not read the group message
    const message = chat.findMessage(messageID);
    if (message) {
     if (message.conversationType === TencentCloudChat.TYPES.CONV_C2C) {
       if (message.isPeerRead === true) {
         // Read by the receiver
       }
     } else if (message.conversationType === TencentCloudChat.TYPES.CONV_GROUP) {
      if (message.readReceiptInfo.unreadCount === 0) {
        // Read by all
      } else {
        // message.readReceiptInfo.readCount - Latest read count of the message
        // To query which group members have read the message
        // call the [getGroupMessageReadMemberList] API.
      }
     }
    }
  });
}
chat.on(TencentCloudChat.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, onMessageReadReceiptReceived);
```

### Pulling message read receipt information (by the sender)

After entering the message list, the sender pulls historical messages first, and then calls the `getMessageReadReceipt` API to pull the message read receipt information.

> **Note:**
> 1. Messages in the `messageList` must be from the same one-to-one or group conversation.
> 2. Community and AVChatRoom do not support read receipts for group messages.

##### **API**

【js】
``` javascript
chat.getMessageReadReceiptList(messageList);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|messageList|Array|List of messages in the same conversation|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Pull the group message list
let messageList = null;
chat.getMessageList({conversationID: 'GROUPtest'}).then(function(imResponse) {
  messageList = imResponse.data.messageList; // Message list
  chat.getMessageReadReceiptList(messageList).then(function(imResponse) {
    messageList = imResponse.data.messageList; // Message list
    // `getMessageReadReceiptList` is called successfully,
    // `Message.readReceiptInfo` will contain the message read receipt information.
    // Message.readReceiptInfo.readCount - Read count of a message.
    // To query which group members have read the message, call the [getGroupMessageReadMemberList] API.
    // Message.readReceiptInfo.unreadCount - Unread count of a message.
    // `0` indicates that all members have read the message.
  }).catch(function(imError) {
    // Failed to pull the read receipt list
  });
});
```

【js】
``` javascript
// Pull the one-to-one message list
let messageList = null;
chat.getMessageList({conversationID: 'C2Ctest'}).then(function(imResponse) {
  messageList = imResponse.data.messageList; // Message list
  chat.getMessageReadReceiptList(messageList).then(function(imResponse) {
    messageList = imResponse.data.messageList; // Message list
    // After the message list is pulled successfully
    // `Message.readReceiptInfo` will contain the message read receipt information.
    // Message.readReceiptInfo.isPeerRead - Whether the receiver has sent a read receipt
  }).catch(function(imError) {
    // Failed to pull the read receipt list
  });
});
```

### Pulling the list of members who have or have not read a group message (by the sender)

To view the list of members who have or have not read a group message, the sender can call the `getGroupMessageReadMemberList` API to pull the member list by page.

##### **API**

【js】
``` javascript
chat.getGroupMessageReadMemberList(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| message | Message | Message instance |
| cursor | String | Cursor for the paged pull. Pass in <code>''</code> for the first pull. |
| filter | Number | Specifies to pull the list of members who have or have not read the message. Valid values:<br>- 0 - pull the list of members who have read the message<br>- 1 - pull the list of members who have not read the message |
| count | Number | Number of members to be pulled per page. Maximum value: 100. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Pull the list of members who have read the group message
let promise = chat.getGroupMessageReadMemberList({
  message,
  filter: 0,
  cursor: '', // Pass in `''` for the first pull
  count: 30,
});
promise.then(function(imResponse) {
  const { isCompleted, cursor, messageID, readUserIDList } = imResponse.data;
  // isCompleted - true: completed; false: not completed
  // cursor - Used for the subsequent pull when `isCompleted` is `false`
  // messageID - Group message ID
  // readUserIDList - List of `userID` values of members who have read the message
}).catch(function(imError) {
  // Failed to pull the list of members who have read the group message
});
```

【js】
``` javascript
// Pull the list of members who have not read the group message
let promise = chat.getGroupMessageReadMemberList({
  message,
  filter: 1,
  cursor: '', // Pass in `''` for the first pull
  count: 30,
});
promise.then(function(imResponse) {
  const { isCompleted, cursor, messageID, readUserIDList } = imResponse.data;
  // isCompleted - true: completed; false: not completed
  // cursor - Used for the subsequent pull when `isCompleted` is `false`
  // messageID - Group message ID
  // unreadUserIDList - List of `userID` values of members who have not read the group message
}).catch(function(imError) {
  // Failed to pull the list of members who have not read the group message
  // 10062 - The read receipt information for the group message was not found.
});
```

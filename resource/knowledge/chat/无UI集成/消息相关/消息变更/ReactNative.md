---
sync_node_id: '108053276744261632'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息变更"
  - "React Native"
product: "chat"
---
## Feature Overview

This feature enables any member in a conversation to modify a successfully sent message in the conversation. The message will be synced to all the members in the conversation once modified successfully.

## UI Display

## Modifying a Message

This API is used to modify a message. After a user modifies a message successfully, both the user and the receiver (one-to-one) or group members (Group) will receive the `MESSAGE_MODIFIED` event.

> **Note:**
> 1. It does not support modifying online messages or AVChatRoom messages. Do not modify the `random/sequence/time` fields of a message.
> 2. It only supports modifying text, custom, geographical location, and emoji messages.
> 3. If a message is modified by another member during modification, the SDK will return the error code 2480, indicating that a conflict occurred while modifying the message.
> 4. It supports for modifying the `cloudCustomData` field of all types of messages.

##### **API**
``` javascript
chat.modifyMessage(message);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|message|Message|Message instance|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Listen for the `MESSAGE_MODIFIED` event
// which will be delivered by the SDK after a message is modified successfully
let onMessageModified = function(event) {
  // event.data - An array that stores modified Message objects - [Message]
};
chat.on(TencentCloudChat.EVENT.MESSAGE_MODIFIED, onMessageModified);

// Change the text content of `txtMessage` to `Hello Tencent`
txtMessage.payload.text = "Hello Tencent";

let promise = chat.modifyMessage(txtMessage);
promise.then(function(imResponse) {
  const { message } = imResponse.data;
  // Message modified successfully. `message` is the latest message.
}).catch(function(imError) {
  // Failed to modify the message
  const { code, data } = imError;
  if (code === 2480) {
    // A conflict occurred while modifying the message. `data.message` is the latest message.
  } else if (code === 2481) {
    // Audio-video group messages cannot be modified.
  } else if (code === 20026) {
    // The message does not exist.
  }
});
```

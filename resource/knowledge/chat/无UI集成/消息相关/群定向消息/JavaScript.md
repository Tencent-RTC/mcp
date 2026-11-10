---
sync_node_id: '108053280555835392'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "群定向消息"
  - "JavaScript"
product: "chat"
---
## Feature Overview

A targeted group message is a message sent to specified members in a group, which cannot be received by other group members.

> **Note:**
> 1. To use this feature, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition as instructed in [Pricing](https://trtc.io/pricing/chat).
> 2. When creating a group @ message, you cannot specify the list of group members to receive the message (`receiverList`).
> 3. The targeted group message feature is not available for community and audio-video (AVChatRoom) groups.
> 4. By default, targeted group messages are excluded from the unread count of the group conversation.

## UI Display

By using the targeted group message feature, you can achieve the effect shown in the figure below:

## Sending a Targeted Group Message

To send a targeted group message to specified members in a group, follow the instructions below:
- Call the `createXxxMessage` API (here, `Xxx` indicates the message type) to create a message (specify the message recipients via `receiverList`).

- Call the `sendMessage` API to send the message.

##### Examples

【js】
``` javascript
// Create a targeted group message
let message = chat.createTextMessage({
  to: 'test',
  conversationType: TencentCloudChat.TYPES.CONV_GROUP,
  payload: {
    text: 'Hello world!'
  },
  receiverList: ['user0', 'user1']
});

// Send the message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Message sent successfully
  console.log(imResponse);
}).catch(function(imError){
  // The message failed to be sent
  console.warn('sendMessage error:', imError);
});
```

## Receiving a Targeted Group Message

By default, targeted group messages are excluded from the unread count of a group conversation.
A targeted group message can be received in the same way as an ordinary message.

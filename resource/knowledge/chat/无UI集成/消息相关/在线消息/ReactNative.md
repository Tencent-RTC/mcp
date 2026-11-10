---
sync_node_id: '108053270187515904'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "在线消息"
  - "React Native"
product: "chat"
---
## Feature Overview

In certain cases, you might want a message to be received by the receiver only when online; that is, the receiver won't notice the message when offline. You only need to set `onlineUserOnly` to `true` when calling `sendMessage`. A message sent in this way differs from a general one in that:
1. It cannot be stored offline; that is, it cannot be received if the receiver is offline.

2. It cannot be roamed across devices; that is, if it is received on a device, it cannot be received on another, whether it is read or not.

3. It cannot be stored locally; that is, it cannot be pulled from local or cloud historical messages.

## UI Display

## Typing indicators

In one-to-one chats, you can call the `sendMessage` API to send the prompt "Typing...". After receiving the prompt message, the receiver can display "Typing..." on the UI.

##### **Examples**
``` javascript
chat.sendMessage(message, {
  // If the receiver is offline, the message will be neither stored on the roaming server
  // nor pushed offline.
  onlineUserOnly: true
});
```

In fact, to implement a complete "Typing..." prompt, sending online messages using the Chat SDK is just a small part. Further development work is needed, such as:
- User interface monitoring and status update: An event listener is added to the input box for sending messages, to detect when the user starts typing. When typing begins, the client updates the user's status, for example, "typing".

- Sending status to the server: At the appropriate time, the user's input status is sent to the server.

- User interface update: Based on the received input status, a prompt such as "Typing" is displayed on the recipient's user interface. This could be a text prompt, an icon, or an animation.

- Considering throttling: To reduce unnecessary status updates and communication overhead, a time interval can be set. Only one input status update is sent within this interval.

   Our TUIKit library has already implemented the above feature. You just need to integrate the TUIKit component and enable this feature to immediately obtain "Typing...". The actual feature effect is shown as follows:

   For details, refer to the chat interactive document [Typing](https://trtc.io/document/58663).

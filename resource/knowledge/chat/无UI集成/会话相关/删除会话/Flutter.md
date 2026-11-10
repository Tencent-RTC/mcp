---
sync_node_id: '108053261016670208'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "删除会话"
  - "Flutter"
product: "chat"
---
## Feature Description

If a user doesn't want to view the historical one-to-one or group messages after deleting a friend or leaving a group, the user can choose to delete the conversation.

> **Caution: **
> When a conversation is deleted, the historical messages will be deleted from both the client and the server and cannot be recovered.
> 

Multi-client sync is disabled for conversation deletion by default and can be enabled in the [Chat console](https://console.trtc.io/chat).

## Deleting a Conversation

Call the `deleteConversation` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/deleteConversation.html)) to delete a specified conversation.

Sample code:
``` dart
// Delete a specified conversation
conversationManager.deleteConversation(conversationID: "conversationID");
```

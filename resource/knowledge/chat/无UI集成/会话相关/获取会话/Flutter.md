---
sync_node_id: '108053262768840704'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "获取会话"
  - "Flutter"
product: "chat"
---
## Feature Description

The Chat SDK provides an API for getting conversations, which can be used to get the `V2TimConversation` object information of one or multiple specified conversations.

### Getting a specified conversation

Call `getConversation` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversation.html)) to get the information of a conversation, which is a `V2TimConversation` object.

Sample code:
``` dart
V2TimValueCallback<V2TimConversation> conv = await conversationManager.getConversation(conversationID: "conversationID");
```

### Getting specified conversations

Call `getConversationList` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversationList.html)) to get the list of specified conversations that stores `V2TimConversation` objects.

Sample code:
``` dart
V2TimValueCallback<V2TimConversationResult> convList = await conversationManager.getConversationList(nextSeq: '', count: 10);
```

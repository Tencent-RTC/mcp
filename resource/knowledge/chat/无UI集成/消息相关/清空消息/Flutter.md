---
sync_node_id: '108053278552006656'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "清空消息"
  - "Flutter"
product: "chat"
---
## Feature Description

One-to-one messages and group messages can be cleared.
When messages in a conversation are cleared, all the messages in the conversation will be cleared both **locally and from the cloud**, but the conversation itself will not be deleted.

> **Note: **
> **Do not** use this API if you do not want to clear messages from the cloud.
> 

If the last message is deleted, the `lastMessage` in the conversation will become the last but one message.

### Clearing one-to-one messages

Call `clearC2CHistoryMessage` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/clearC2CHistoryMessage.html)) to clear one-to-one messages.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getMessageManager().clearC2CHistoryMessage(userID: "userid");
```

### Clearing group messages

Call `clearGroupHistoryMessage` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/clearGroupHistoryMessage.html)) to clear group messages.

Sample code:
``` dart
 TencentImSDKPlugin.v2TIMManager.getMessageManager().clearGroupHistoryMessage(groupID: "");
```

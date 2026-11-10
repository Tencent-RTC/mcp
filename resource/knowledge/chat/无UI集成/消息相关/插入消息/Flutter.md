---
sync_node_id: '108053272811053056'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "插入消息"
  - "Flutter"
product: "chat"
---
## Feature Description

When a message is inserted, the message will only be inserted into the local database but not be sent to the server.

> **Caution: **
> Inserted messages will be lost if the account is logged in on another mobile device or the application is uninstalled and reinstalled.
> 

This API is used to insert tips into a conversation, such as "You have left the group" and "Keep your information secure. Do not send private information such as account, password, and verification code to the group chat". Such messages need to be displayed in the chat area, but do not need to be sent to others.

### Inserting a local message between one-to-one messages

Call `insertC2CMessageToLocalStorage` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/insertC2CMessageToLocalStorageV2.html)) to insert a local message between one-to-one messages. Currently, the SDK for Flutter only supports inserting custom messages.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getMessageManager().insertC2CMessageToLocalStorage(data: "", userID: "", sender: "");
```

### Inserting a local message between group messages

Call `insertGroupMessageToLocalStorage` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/insertGroupMessageToLocalStorageV2.html)) to insert a local message between group messages.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getMessageManager().insertGroupMessageToLocalStorage(data: "", groupID: "", sender: "");
```

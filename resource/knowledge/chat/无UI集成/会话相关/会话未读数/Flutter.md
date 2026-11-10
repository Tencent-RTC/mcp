---
sync_node_id: '108053258864992256'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话未读数"
  - "Flutter"
product: "chat"
---
## Feature Description

A user's conversation list usually contains multiple conversations. If there is a new message in one of the conversations, a badge needs to be displayed in the list cell to indicate the unread count.
After the user clicks to enter the conversation and goes back to the conversation list, the unread count is cleared, and the badge disappears.
In some applications, the total unread count of all the conversations is calculated and displayed at the bottom tab of the conversation list.

This document describes how to implement the conversation unread count notification feature.

## Getting the Total Unread Count of All the Conversations

In general cases, to get the total unread count of all the conversations, you can traverse the conversation list to get the `V2TimConversation` information of each conversation and add the `unreadCount` values of all the `V2TimConversation` objects to get the final result and display it on the UI.

The Chat SDK provides the `getTotalUnreadMessageCount` API to query the total unread count of all the conversations.
When the total unread count changes, the SDK will notify you of the latest total unread count through the `onTotalUnreadMessageCountChanged` callback.

> **Note: **
>  This feature is supported only by the SDK for Flutter on v3.0.0 or later.
> 

Below are detailed steps.

### Getting the total unread count

Call `getTotalUnreadMessageCount` ([Details](https://pub.dev/documentation/tencent_im_sdk_plugin_platform_interface/latest/im_flutter_plugin_platform_interface/ImFlutterPlatform/getTotalUnreadMessageCount.html)) to get the total unread count of all the conversations and update it on the UI.

Sample code:
``` dart
// Get the total unread count
V2TimValueCallback<int> unread = await conversationManager.getTotalUnreadMessageCount();
```

### Notification of a change in the total unread count

Call `addConversationListener` ([Details](https://pub.dev/documentation/tencent_im_sdk_plugin_platform_interface/latest/im_flutter_plugin_platform_interface/ImFlutterPlatform/addConversationListener.html)) to add a conversation listener to receive notifications of a change in the total unread count.

You can get the changed total unread count in `onTotalUnreadMessageCountChanged` ([Details](https://pub.dev/documentation/tencent_im_sdk_plugin_platform_interface/latest/enum_callbacks/OnTotalUnreadMessageCountChanged.html)) of `V2TIMConversationListener`.

Sample code:
``` dart
conversationManager.addConversationListener(listener: V2TimConversationListener(onTotalUnreadMessageCountChanged: (totalUnreadCount) {
    // Latest unread count
  },));
```

## Clearing the Conversation Unread Count

After the user clicks to enter a conversation and goes back to the conversation list, the unread count needs to be cleared, after which the badge in the conversation list needs to disappear.

You can call cleanConversationUnreadMessageCount ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/cleanConversationUnreadMessageCount.html)) to clear the unread message count of a specified conversation. By passing parameters in a specific format, you can separately clear the unread message count of a specified one-on-one chat conversation, all one-on-one chat conversations, a specified group chat conversation, all group chat conversations, and all conversations. The specific operation steps are as follows.

> **Note: **
>  This feature is supported only by the SDK of the Enhanced edition on v8.0  or later. 
> 

Parameter Description：

|Parameter|Meaning        |Valid in One-on-One Chat|Valid in Group Chat|Remarks|
|---------|---------|---------|---------|---------|
|conversationID|Unique conversation ID|YES|YES|The composition method of a C2C (one-on-one) chat is: "c2c_userID"; the composition method of a group chat is: "group_groupID".|
|cleanTimestamp|Clear timestamp|YES|NO|Specify the timestamp before which the unread message count will be cleared. When 0 is passed in, all unread messages in the corresponding conversation will be cleared, and the unread count of the conversation will be set to 0.|
|<br>cleanSequence|Clear sequence|NO|YES|Specify the sequence before which the unread message count will be cleared. When 0 is passed in, all unread messages in the corresponding conversation will be cleared, and the unread count of the conversation will be set to 0.|

> **Note: **
> - When you want to clear the unread message count of all one-on-one chat conversations, please pass in "c2c" for conversationID, that is, do not specify a specific userID.
> - When you want to clear the unread message count of all group chat conversations, please pass in "group" for conversationID, that is, do not specify a specific groupID.
> - When you want to clear the unread message count of all conversations, please pass in "" for conversationID.
> - After this API call is successful, the SDK will notify you of the latest unread count of the corresponding conversation through the onConversationChanged callback.

### Clear the Unread Count of a Specified One-on-One Chat Conversation

You can clear the unread message count of a specified one-on-one chat conversation by passing in a conversationID with the "c2c_" prefix. You can also clear the unread message count up to a specified timestamp by passing in cleanTimestamp. If the passed-in cleanTimestamp is 0, the unread count of the specified one-on-one chat conversation will be cleared to 0.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(
    conversationID: "c2c_userID",
    cleanTimestamp: 0,
    cleanSequence: 0,);
```

After `cleanConversationUnreadMessageCount` is called successfully:
1. If the caller has called `addConversationListener` to add a conversation listener, it will receive the `onConversationChanged` callback and update the UI.

2. The sender will receive the `onRecvC2CReadReceipt` callback that contains the timestamp when the conversation unread count is cleared.

   Sample code:

   ``` dart
   // Receiver 
   conversationManager.addConversationListener(listener: V2TimConversationListener(,onConversationChanged: (conversationList) {
       // Latest conversation after the change
     },));
   
   // Sender
   TencentImSDKPlugin.v2TIMManager.getMessageManager().addAdvancedMsgListener(listener: V2TimAdvancedMsgListener(onRecvC2CReadReceipt: (receiptList) {
       // The message is read by the receiver.
     },));
   ```

### Clear the Unread Counts of All One-on-One Chat Conversations

You can pass in "c2c" as conversationID, indicating that the unread counts of all one-on-one chat conversations will be cleared to 0. Note that cleanTimestamp will no longer be effective at this time.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(
    conversationID: "c2c",
    cleanTimestamp: 0,
    cleanSequence: 0,);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has called `addConversationListener` to add a conversation listener, it will receive the `onConversationChanged` callback and update the UI.

Sample code:
``` dart
conversationManager.addConversationListener(listener: V2TimConversationListener(,onConversationChanged: (conversationList) {
    // Latest conversation after the change
  },));
```

### Clear the Unread Count of a Specified Group Chat Conversation

You can clear the unread message count of a specified group chat conversation by passing in a conversationID with the "group_" prefix. You can also clear the unread message count up to a specified sequence by passing in cleanSequence. If the passed-in cleanSequence is 0, the unread count of the specified group chat conversation will be cleared to 0.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(
    conversationID: "group_groupID",
    cleanTimestamp: 0,
    cleanSequence: 0,);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has called `addConversationListener` to add a conversation listener,  it will receive the `onConversationChanged` callback and update the UI.

Sample code:
``` dart
conversationManager.addConversationListener(listener: V2TimConversationListener(,onConversationChanged: (conversationList) {
    // Latest conversation after the change
  },));
```

### Clear the Unread Counts of All Group Chat Conversations

You can pass in "group" as conversationID, indicating that the unread counts of all group chat conversations will be cleared to 0. Note that cleanSequence will no longer be effective at this time.。
``` plaintext
TencentImSDKPlugin.v2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(
    conversationID: "group",
    cleanTimestamp: 0,
    cleanSequence: 0,);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has called `addConversationListener` to add a conversation listener,  it will receive the `onConversationChanged` callback and update the UI.

Sample code:
``` dart
conversationManager.addConversationListener(listener: V2TimConversationListener(,onConversationChanged: (conversationList) {
    // Latest conversation after the change
  },));
```

### Clear the Unread Counts of All Conversations

You can pass in an empty string "" as conversationID, indicating that the unread message counts of all conversations will be cleared to 0. Note that both cleanTimestamp and cleanSequence will no longer be effective at this time.

Sample code:
``` dart
TencentImSDKPlugin.v2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(
    conversationID: "",
    cleanTimestamp: 0,
    cleanSequence: 0,);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has called `addConversationListener` to add a conversation listener,  it will receive the `onConversationChanged` callback and update the UI.

Sample code:
``` java
conversationManager.addConversationListener(listener: V2TimConversationListener(,onConversationChanged: (conversationList) {
    // Latest conversation after the change
  },));
```

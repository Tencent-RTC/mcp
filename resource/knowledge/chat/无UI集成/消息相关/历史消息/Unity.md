---
sync_node_id: '108053268543348736'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "历史消息"
  - "Unity"
product: "chat"
---
## Feature Description
- The API for pulling historical messages is `MsgGetMsgList` ([Details](https://comm.qq.com/im/doc/unity/en/api/MessageApi/MsgGetMsgList.html)).

- It supports pulling historical one-to-one and group messages.

- Both local and cloud historical messages can be pulled.

   > **Note: **
   > 
   >  When historical messages are pulled from the cloud and a network exception is detected, the SDK will return the locally stored historical messages.
   > 

   Locally stored historical messages are not subject to time limits, but those stored in the cloud are subject to the following time limits:

- Free Trial: The free storage period is 7 days and cannot be extended.

- Pro edition: The free storage period is 30 days and can be extended.

- Pro Plus edition: The free storage period is 90 days and can be extended.

- Enterprise edition: The free storage period is 90  days and can be extended.

- 

   > **Note: **
   > 
   > - Extending the storage period of historical messages is a value-added service. You can log in to the [IM console](https://console.cloud.tencent.com/im) to modify the relevant configuration. For billing details, see [Pricing](https://intl.cloud.tencent.com/document/product/1047/34350).
   > - Rich media messages (such as images, files, and audios) have the same storage periods as historical messages.

## Pulling Historical One-to-One Messages

Call the `MsgGetMsgList` API ([Details](https://comm.qq.com/im/doc/unity/en/api/MessageApi/MsgGetMsgList.html)) to get historical one-to-one messages.
When the network is normal, the latest cloud data will be pulled; when it is abnormal, the SDK will return the locally stored historical messages.

This API supports pulling by page. For more information, see [Pulling by page](#advance_page).

Sample code:
``` c#
// Pull historical one-to-one messages
// Set `msg_getmsglist_param_last_msg` to `null` for the first pull
// `msg_getmsglist_param_last_msg` can be the last message in the returned message list for the second pull.
var get_message_list_param = new MsgGetMsgListParam
    {
      msg_getmsglist_param_last_msg = LastMessage
    };
TIMResult res = TencentIMSDK.MsgGetMsgList(conv_id, TIMConvType.kTIMConv_C2C, get_message_list_param, (int code, string desc, string user_data) => {
  // Process the callback logic
});
```

## Pulling Historical Group Messages

Call the `MsgGetMsgList` API ([Details](https://comm.qq.com/im/doc/unity/en/api/MessageApi/MsgGetMsgList.html)) to get historical group messages.
When the network is normal, the latest cloud data will be pulled; when it is abnormal, the SDK will return the locally stored historical messages.

This API supports pulling by page. For more information, see [Pulling by page](#advance_page).

> **Caution: **
> - Only the historical messages of meeting groups (Meeting) can be pulled. For more information on group message limits, see [Group System](https://intl.cloud.tencent.com/document/product/1047/33529).
> - This API does not apply to audio-video groups (AVChatRoom), as their messages are not stored on the cloud roaming server or in the local database.

Sample code:
``` c#
// Pull historical group messages
// Set `msg_getmsglist_param_last_msg` to `null` for the first pull
// `msg_getmsglist_param_last_msg` can be the last message in the returned message list for the second pull.
var get_message_list_param = new MsgGetMsgListParam
    {
      msg_getmsglist_param_last_msg = LastMessage
    };
TIMResult res = TencentIMSDK.MsgGetMsgList(conv_id, TIMConvType.kTIMConv_Group, get_message_list_param, (int code, string desc, string user_data) => {
  // Process the callback logic
});
```

### Pulling by page

[Historical one-to-one message pull](#c2c) and [historical group message pull](#group) can all be paged by using `msg_getmsglist_param_last_msg` and `msg_getmsglist_param_count`.
- Pulling by page can be implemented by using `msg_getmsglist_param_last_msg` and `msg_getmsglist_param_count`. For the first pull, `msg_getmsglist_param_last_msg` can be left empty, which indicates that the last message in the returned message list will be used as the `msg_getmsglist_param_last_msg` to pull data of the next page.

- When `msg_getmsglist_param_last_msg` is left empty, the SDK will return historical messages starting from the latest message by default.

- When `msg_getmsglist_param_last_msg` is set, it is not included in the returned message list.

- The returned message list displays messages in reverse chronological order.

   > **Note: **
   > 
   > 1. To avoid affecting the speed of pulling historical messages, we recommend you set `msg_getmsglist_param_count` to `20` for pagination.
   > 2. We recommend you not use `msg_getmsglist_param_last_msg_seq` for the subsequent pull, as the corresponding message will be included in the returned message list.

### Pulling messages after redirecting to the group @ message

After a user receives a group @ message in a group conversation, the user generally needs to click the @ bar to go to the message and pull the neighboring messages for display.
As the group @ message also needs to be displayed, you can set its `sequence` as the `msg_getmsglist_param_last_msg_seq` and use the `MsgGetMsgList` to pull messages.

## FAQs

### 1. What should I do if "total msg_getmsglist_param_count of request cloud message exceed max limit" is displayed in the log when I am pulling historical messages?

Currently, the SDK policy is as described below:
1. When `getType` is set to pull cloud historical messages and the number of messages to be pulled is set to `x`, the SDK will pull `x` messages from the cloud.

2. The SDK will filter out invalid messages, such as deleted messages and those irrelevant to the current user.

3. If there are too many invalid historical messages in the cloud, the SDK will perform multiple paged pulls.
To ensure the system stability and robustness, the SDK will perform up to three automatic paged pulls. After this limit is exceeded, the "total msg_getmsglist_param_count of request cloud message exceed max limit" message will be displayed in the log.

   To minimize the impact of such a limit mechanism on the business layer, you can take the following measures to reduce invalid messages:

- You can use online messages, that is, set `message_is_online_msg` to `YES/true` when sending messages.

- For group messages, you can use targeted group messages to specify the receiver.

### 2. What should I do if messages are "lost" during cloud historical message pull?

When `getType` is set to pull cloud historical messages and the number of messages is `msg_getmsglist_param_count`, the SDK will perform the following operations:
1. Pull `msg_getmsglist_param_count` messages from the local database.

2. Pull `msg_getmsglist_param_count` messages from the cloud and filter out invalid messages such as deleted messages. If the number is smaller than `msg_getmsglist_param_count`, the paged pull will be triggered.

3. Merge local and cloud messages and update information such as the message status.

4. Return `msg_getmsglist_param_count` messages from the merged message list.

   Generally speaking, message loss indicates that too many invalid messages are pulled in step 2, which triggers the [limit mechanism in question 1](#qa1) and leads to an insufficient number of messages actually pulled from the cloud.
We recommend you fix this issue as instructed in [question 1](#qa1). If the issue persists, contact us for assistance.

### 3. What should I do if group member information such as the group name card is not updated in real time when historical messages are pulled?
- When messages are generated, the SDK will update the current group member information such as the group name card and role and store it in the local database.

- When historical group messages are pulled, the SDK will directly return the group member information when the messages were generated and will not update it in real time.

   If you want to get the latest group member information, you can use the `GroupGetMemberInfoList` API ([Details](https://comm.qq.com/im/doc/unity/en/api/GroupApi/GroupGetMemberInfoList.html)).

### 4. What should I do if I get a lag while pulling historical messages?

The SDK has been optimized for message pull. If a lag occurs, you can reduce the number of pulled messages (`msg_getmsglist_param_count`). If the issue persists, contact us for assistance.

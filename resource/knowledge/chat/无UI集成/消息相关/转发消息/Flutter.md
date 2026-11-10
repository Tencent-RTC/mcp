---
sync_node_id: '108053280902914048'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "转发消息"
  - "Flutter"
product: "chat"
---
## Feature Description

You can merge and forward messages as provided by WeChat in the following steps:
1. Create a merged message based on the list of original messages.

2. Send the merged message to the receiver.

3. The receiver receives the merged message and parses the list of original messages.

   |Merge and Forward|Display of Merged Message|Click Merged Message to Download Message List for Display|
   |---------|---------|---------|
   ||||

## Merging and Forwarding Messages

### Creating and sending a merged message

A merged message can be created by setting the message list along with the merged message title and digest. The process is as follows:
1. Call the `createMergerMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createMergerMessage.html)) to create a merged message. The list of original messages as well as the merged message title and digest also need to be set.

   

   |Attribute|Description|Remarks|
   |---------|---------|---------|
   |msgIDList|List of IDs of original messages|List of IDs of original messages to be merged and forwarded|
   |title|Title|Title of the merged message, such as "Chat History of xixiyah and Hello" as shown above|
   |abstractList|Digest list|Digest list of the merged message as shown above. The original message digests need to be displayed for the merged message, which will be unfolded after the user clicks the cell.|
   |compatibleText|Compatibility text message|If the early SDK version does not support the merged message, the user will receive a text message with the content `compatibleText` by default.|

   Sample code for creating and sending a merged message:

   ``` java
   // List of messages to be forwarded, which can contain merged messages but not group tips
   V2TimValueCallback<V2TimMsgCreateInfoResult> createMergerMessageResult =
         await TencentImSDKPlugin.v2TIMManager
             .getMessageManager()
             .createMergerMessage(
               msgIDList: ["msgid1", "msgid2"],
               title: "Chat History of user1 and user2", // Title of the merged message
               abstractList: ["user1:hello", "user2:hello"], // Digest list of the merged message
               compatibleText: "The current version does not support the message", // Compatibility text of the merged message. If the early SDK version does not support the merged message, the user will receive a text message with the content `compatibleText` by default.
             );
     if (createMergerMessageResult.code == 0) {
       TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(
             id: createMergerMessageResult.data.id,
             receiver: "",
             groupID: "",
           );
     }
   ```

### Receiving a merged message

#### Adding a listener

The receiver calls `addAdvancedMsgListener` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/addAdvancedMsgListener.html)) to add the advanced message listener.

We recommend it be called early, such as after the chat page is initialized, to ensure timely message receiving in the application.

Sample code:
``` java
TencentImSDKPlugin.v2TIMManager
      .getMessageManager()
      .addAdvancedMsgListener(listener: listener);
```

#### Parsing a message

After the listener is added, the receiver will receive the merged message `V2TimMessage` in `onRecvNewMessage`.
You can use the merged message element `V2TimMergerElem` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_merger_elem/V2TimMergerElem-class.html)) to get the `title` and `abstractList` for UI display.
Then, when the user clicks the merged message, you can call the `downloadMergerMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/downloadMergerMessage.html)) to download the merged message list for UI display.

Sample code:
``` dart
if(message.elemType == MessageElemType.V2TIM_ELEM_TYPE_MERGER){
        message.mergerElem.abstractList;
        message.mergerElem.isLayersOverLimit;
        message.mergerElem.title;
        V2TimValueCallback<List<V2TimMessage>> download = await TencentImSDKPlugin.v2TIMManager.getMessageManager().downloadMergerMessage(msgID: message.msgID,);
        if(download.code == 0){
         List<V2TimMessage> messageList = download.data;
        }
}
```

## Forwarding Messages One by One

To forward a single message, create a message identical to the original message through the `createForwardMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createForwardMessage.html)) first, and then call the `sendMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

Sample code:
``` dart
// Create a message with the same elements as the original message
V2TimValueCallback<V2TimMsgCreateInfoResult>  createForwardMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().createForwardMessage(msgID: "msgid");
// Send the message to the user `denny`
  if(createForwardMessageRes.code == 0){
    TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(id: createForwardMessageRes.data.id, receiver: "denny", groupID: "");
  }
```

---
sync_node_id: '108053279391916032'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "群 @ 消息"
  - "Flutter"
product: "chat"
---
## Feature Description

The sender listens for the characters in the input box. When the sender enters @, the group member selection UI will pop up. After the target group members are selected, the message will be displayed in the input box in the format of `"@A @B @C......"`, which can be further edited before sent.
In the group chat list of the receiver's conversation UI, the identifier `"someone@me"` or `"@all"` will be displayed to remind the user that the user was mentioned by someone in the group chat.

> **Note: **
>  Currently, only text @ messages are supported.
> 

## Feature Demonstration

Figure 1: When the @ character is detected in the input box on the chat UI, the user is redirected to the group member selection UI to select the target group members.
Figure 2: After selecting the target group members, the user goes back to the chat UI to edit and send the group @ message.
Figure 3: If a user is mentioned, the user receives the conversation update, and the "someone@me" information is displayed in the conversation `Cell`.

## Sending a Group @ Message
1. The sender listens for the text input box on the chat UI and launches the group member selection UI. After group members are selected, the ID and nickname information of the members is called back. The ID is used to create the `V2TimMessage` object, while the nickname is to be displayed in the text box.

2. The sender calls the `createTextAtMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTextAtMessage.html)) to create a text @ message, get the `V2TIMMessage` object, and specify the target group members.

3. The sender calls the `sendMessage` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the created @ message.

   Sample code:

   ``` dart
   // Create a group @ message
   TencentImSDKPlugin.v2TIMManager.getMessageManager().createTextAtMessage(text: "123", atUserList: ['user1','user2','all']);
   // Send the group @ message
    TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(
             id: id,
             receiver: "",
             groupID: "",
   );
   ```

## Receiving a Group @ Message
1. When the conversation is loaded and updated, call the `groupAtInfolist` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_conversation/V2TimConversation/groupAtInfoList.html)) of `V2TimConversation` to get the @ data list of the conversation.

2. Call the `atType` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_at_info/V2TimGroupAtInfo/atType.html)) of the `V2TimGroupAtInfo` object in the list to get the @ data type and update it to the @ information of the conversation.

   Sample code:

   ``` dart
   V2TimValueCallback<V2TimConversationResult> getConversationList = await TencentImSDKPlugin.v2TIMManager.getConversationManager().getConversationList(nextSeq: "", count: 10);
     if(getConversationList.code == 0){
       getConversationList.data.conversationList.forEach((element) {
         element.groupAtInfoList.forEach((element) {
           if(element.atType == 0){
             // @me
           }
           if(element.atType == 1){
             // @all
           }
           if(element.atType == 2){
             // @all and @me 
           }
         });
       });
     }
   ```

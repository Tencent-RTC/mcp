---
sync_node_id: '108053269087559680'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "发送消息"
  - "Flutter"
product: "chat"
---
## Overview
- The method for sending a message is in the core class `TencentImSDKPlugin.v2TIMManager.getMessageManager()`.

- It supports sending text, custom, and rich media messages, and all of which belong to the `V2TimMessage` type.

- `V2TimMessage` can contain different sub-types to indicate different types of messages.

## Key APIs

The `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) API is the core API for sending a message. It supports sending all types of messages.

> **Note: **
>  The advanced message sending API mentioned below refers to `sendMessage`.
> 

The API is detailed as follows:
``` dart
Future<V2TimValueCallback<V2TimMessage>> sendMessage(
{
  required String id,
  required String receiver,
  required String groupID,
  int priority = 0,
  bool onlineUserOnly = false,
  bool needReadReceipt = false,
  bool isExcludedFromUnreadCount = false,
  bool isExcludedFromLastMessage = false,
  Map<String, dynamic>? offlinePushInfo,
  String? cloudCustomData,
  String? localCustomData,
}
)
```

Parameters:

|Parameter      |Definition      |Valid for One-to-One Chat      |Valid for Group Chat   |Description   |
|---------|---------|---------|---------|---------|
|id|ID returned after message creation|YES|YES|Create the message using the `createXxxMessage` API in advance.|
|receiver|`userID` of the one-to-one message receiver.|YES|NO|Just specify `receiver` for sending one-to-one chat messages.|
|groupID|`groupID` of the group chat|NO|YES|Just specify `groupID` for sending group messages.|
|priority|Message priority|NO|YES|Set a higher priority for important messages (such as those for red packets and gifts) and a lower priority for frequent and unimportant messages (such as those for likes).|
|onlineUserOnly|Whether only online users can receive the message.|YES|YES|If it is set to `true`, the message cannot be pulled by a receiver through historical messages. This is often used to implement weak prompts, such as "The other party is typing..." and unimportant prompts in a group.|
|offlinePushInfo|Offline push message|YES|YES|The title and content carried when a message is pushed offline.|
|needReadReceipt|Whether a read receipt is supported for the sent group message|NO|YES|Whether a read receipt is supported for the sent group message|
|isExcludedFromUnreadCount|Whether the sent message is counted as the unread message of the conversation|YES|YES|If it is set to `true`, the sent message is not counted as the unread message of the conversation. It defaults to `false`.|
|isExcludedFromLastMessage|Whether the sent message is included in the `lastMessage` of the conversation|YES|YES|If it is set to `true`, the sent message is not included in the `lastMessage` of the conversation. It defaults to `false`.|
|cloudCustomData|Cloud message data|YES|YES|Extra data of the message that is stored in the cloud and can be accessed by the receiver.|
|localCustomData|Local message data|YES|YES|Extra data of the message that is stored locally. It cannot be accessed by the receiver and will be lost after the application is uninstalled.|

> **Note: **
> If both `groupID` and `receiver` are set, targeted group messages are sent to `receiver`. For more information, see [Targeted Group Message](https://intl.cloud.tencent.com/document/product/1047/48028).
> 

## Sending Text Messages

Text messages include one-to-one messages and group messages, which are different in terms of APIs and parameters.

The ordinary and advanced APIs can be used to send text messages. The latter supports more sending parameters (such as priority and offline push message).
The ordinary API is as described below, while the advanced API is `sendMessage` mentioned above.

### One-to-one text message

#### Advanced API

Take the following two steps to send a one-to-one text message with the advanced API:
1. Call `createTextMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTextMessage.html)) to create a text message.

2. Call `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

   Sample code:

   ``` dart
       // Create a text message
       V2TimValueCallback<V2TimMsgCreateInfoResult> createTextMessageRes =
           await TencentImSDKPlugin.v2TIMManager
               .getMessageManager()
               .createTextMessage(
                 text: "test", // Text message
               );
       if (createTextMessageRes.code == 0) {
         // Text message created successfully
         String? id = createTextMessageRes.data?.id;
         // Send the text message
         // During the call of `sendMessage`: If only `receiver` is entered, the message is sent to the specified recipient as a one-to-one message;
         // if only `groupID` is entered, the message is sent as a group message;
         // if `receiver` and `groupID` are entered, the message is sent to the specified member in the specified group and is displayed in the group chat and visible only to the specified recipient.
         V2TimValueCallback<V2TimMessage> sendMessageRes =
             await TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(
                 id: id!, // ID of the created message
                 receiver: "userID", // ID of the recipient
                 groupID: "groupID", // ID of the receiving group
                 priority: MessagePriorityEnum.V2TIM_PRIORITY_DEFAULT, // Message priority
                 onlineUserOnly:
                     false, // Whether the message can be received only by online users. If this field is set to true, the message cannot be pulled in recipient historical message pulling. This field is often used to implement weak notification features such as "The other party is typing" or unimportant notifications in the group. This field is not supported by audio-video groups (AVChatRoom).
                 isExcludedFromUnreadCount: false, // Whether the sent message is included in the unread message count of the conversation
                 isExcludedFromLastMessage: false, // Whether the sent message is included in the `lastMessage` of the conversation
                 needReadReceipt:
                     false, // Whether the message requires a read receipt (to use this feature, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition on v6.1 or later).
                 offlinePushInfo: OfflinePushInfo(), // Title and content for offline push
                 cloudCustomData: "", // Cloud message data. Extra data of the message that is stored in the cloud and can be accessed by the receiver.
                 localCustomData:
                     "" // Local message data. Extra data of the message that is stored locally. It cannot be accessed by the receiver and will be lost after the application is uninstalled.
                 );
         if (sendMessageRes.code == 0) {
           // Message sent successfully
         }
       }
   ```

### Group text message

#### Advanced API

Take the following two steps to send a group text message with the advanced API:
1. Call `createTextMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTextMessage.html)) to create a text message.

2. Call `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

   Sample code:

   ``` dart
       // Create a text message
       V2TimValueCallback<V2TimMsgCreateInfoResult> createTextMessageRes =
           await TencentImSDKPlugin.v2TIMManager
               .getMessageManager()
               .createTextMessage(
                 text: "test", // Text message
               );
       if (createTextMessageRes.code == 0) {
         // Text message created successfully
         String? id = createTextMessageRes.data?.id;
         // Send the text message
         // During the call of `sendMessage`: If only `receiver` is entered, the message is sent to the specified recipient as a one-to-one message;
         // if only `groupID` is entered, the message is sent as a group message;
         // if `receiver` and `groupID` are entered, the message is sent to the specified member in the specified group and is displayed in the group chat and visible only to the specified recipient.
         V2TimValueCallback<V2TimMessage> sendMessageRes =
             await TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(
                 id: id!, // ID of the created message
                 receiver: "userID", // ID of the recipient
                 groupID: "groupID", // ID of the receiving group
                 priority: MessagePriorityEnum.V2TIM_PRIORITY_DEFAULT, // Message priority
                 onlineUserOnly:
                     false, // Whether the message can be received only by online users. If this field is set to true, the message cannot be pulled in recipient historical message pulling. This field is often used to implement weak notification features such as "The other party is typing" or unimportant notifications in the group. This field is not supported by audio-video groups (AVChatRoom).
                 isExcludedFromUnreadCount: false, // Whether the sent message is included in the unread message count of the conversation
                 isExcludedFromLastMessage: false, // Whether the sent message is included in the `lastMessage` of the conversation
                 needReadReceipt:
                     false, // Whether the message requires a read receipt (to use this feature, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition on v6.1 or later).
                 offlinePushInfo: OfflinePushInfo(), // Title and content for offline push
                 cloudCustomData: "", // Cloud message data. Extra data of the message that is stored in the cloud and can be accessed by the receiver.
                 localCustomData:
                     "" // Local message data. Extra data of the message that is stored locally. It cannot be accessed by the receiver and will be lost after the application is uninstalled.
                 );
         if (sendMessageRes.code == 0) {
           // Message sent successfully
         }
       }
   ```

## Sending Custom Messages

Custom messages include one-to-one messages and group messages, which are different in terms of APIs and parameters. Custom messages can be sent with ordinary and advanced APIs.
The advanced API is `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) mentioned above, which supports more sending parameters (such as priority and offline push message) than the ordinary API.

### Custom one-to-one message

#### Advanced API

Take the following two steps to send a custom one-to-one message with the advanced API:
1. Call `createCustomMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createCustomMessage.html)) to create a custom message.

2. Call `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

   Sample code:

   ``` java
   // Create a custom message
   V2TimValueCallback<V2TimMsgCreateInfoResult> createCustomMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().createCustomMessage(
       data: 'Custom data',
       desc: 'Custom desc',
       extension: 'Custom extension',
     );
     if(createCustomMessageRes.code == 0){
       String id =  createCustomMessageRes.data.id;
       // Send the custom message
       V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(id: id, receiver: "userID", groupID: "");
       if(sendMessageRes.code == 0){
         // Message sent successfully
       }
     }
   ```

### Custom group message

#### Advanced API

Take the following two steps to send a custom group message with the advanced API:
1. Call `createCustomMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createCustomMessage.html)) to create a custom message.

2. Call `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

   Sample code:

   ``` java
   // Create a custom message
   V2TimValueCallback<V2TimMsgCreateInfoResult> createCustomMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().createCustomMessage(
       data: 'Custom data',
       desc: 'Custom desc',
       extension: 'Custom extension',
     );
     if(createCustomMessageRes.code == 0){
       String id =  createCustomMessageRes.data.id;
       // Send the custom message
       V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().sendMessage(id: id, receiver: "", groupID: "groupID");
       if(sendMessageRes.code == 0){
         // Message sent successfully
       }
     }
   ```

## Sending Rich Media Messages

A rich media message can be sent only with the advanced API in the following steps:
1. Call `createXxxMessage` to create a rich media message object of a specified type, where `Xxx` indicates the specific message type.

2. Call `sendMessage` ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)) to send the message.

3. Get the callback for message sending success or failure.

### Image message

To create an image message, you need to get the path of a local image first.
During message sending, the image is uploaded to the server, and the upload progress is called back. The message is sent after the image is uploaded successfully.

If your project requires web support, the image sending mode is different from that on a mobile device. For details, see [the web compatibility description section](#web).

Sample code:
``` dart
V2TimValueCallback<V2TimMsgCreateInfoResult> createImageMessageRes = await TencentImSDKPlugin.v2TIMManager.getMessageManager().createImageMessage(
        imagePath: "Absolute path of the local image",
);
  if (createImageMessageRes.code == 0) {
    String id = createImageMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

### Audio message

To create an audio message, you need to get the path and audio duration of a local audio file first, where the audio duration is for display on the receiver UI.
During message sending, the audio is uploaded to the server, and the upload progress is called back. The message is sent after the audio is uploaded successfully.

Sample code:
``` dart
V2TimValueCallback<V2TimMsgCreateInfoResult> createSoundMessageRes =
      await TencentImSDKPlugin.v2TIMManager.getMessageManager().createSoundMessage(
        soundPath: "Absolute path of the local audio file",
        duration: 10,// Audio duration
      );
  if (createSoundMessageRes.code == 0) {
    String id = createSoundMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

### Video message

To create a video message, you need to get the path, video duration, and video thumbnail of a local video file first, where the video duration and thumbnail are for display on the receiver UI.
During message sending, the video is uploaded to the server, and the upload progress is called back. The message is sent after the video is uploaded successfully.

If your project requires web support, the video sending mode is different from that on a mobile device. For details, see [the web compatibility description section](#web).

Sample code:
``` dart
V2TimValueCallback<V2TimMsgCreateInfoResult> createVideoMessageRes =
      await TencentImSDKPlugin.v2TIMManager
          .getMessageManager()
          .createVideoMessage(
            videoFilePath: "Absolute path of the local video file",
            type: "mp4", // Video type
            duration: 10,// Video duration
            snapshotPath: "Absolute path of the local video thumbnail file",
          );
  if (createVideoMessageRes.code == 0) {
    String id = createVideoMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

### File message

To create a file message, you need to get the path of a local file first.
During message sending, the file is uploaded to the server, and the upload progress is called back. The message is sent after the file is uploaded successfully.

If your project requires web support, the file sending mode is different from that on a mobile device. For details, see [the web compatibility description section](#web).

Sample code:
``` dart
V2TimValueCallback<V2TimMsgCreateInfoResult> createFileMessageRes =
      await TencentImSDKPlugin.v2TIMManager
          .getMessageManager()
          .createFileMessage(
            filePath: "Absolute path of the local file",
            fileName: "File name",
          );
  if (createFileMessageRes.code == 0) {
    String id = createFileMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

### Location message

Latitude and longitude information is sent in a location message, which requires a map control for display.

Sample code:
``` dart
 V2TimValueCallback<V2TimMsgCreateInfoResult> createLocationMessage =
      await TencentImSDKPlugin.v2TIMManager
          .getMessageManager()
          .createLocationMessage(
            desc: "Shennan Boulevard, Nanshan District, Shenzhen",// Location information digest
            longitude: 34,// Longitude
            latitude: 20, // Latitude
          );
  if (createLocationMessage.code == 0) {
    String id = createLocationMessage.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

### Emoji message

To send an emoji message, the corresponding emoji code is sent and then converted into the icon in the receiver.

Sample code:
``` java
V2TimValueCallback<V2TimMsgCreateInfoResult> createFaceMessageRes =
      await TencentImSDKPlugin.v2TIMManager
          .getMessageManager()
          .createFaceMessage(
            index: 0,
            data: "",
          );
  if (createFaceMessageRes.code == 0) {
    String id = createFaceMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
```

## Support for the Flutter for Web

Chat SDK (tencent_cloud_chat_sdk) 4.1.1+2 or later version provides full compatibility with web. The steps for sending a media or file message in the web SDK are different from those of the Android SDK and iOS SDK:

Due to web characteristics, when you create a media or file message, the path cannot be directly passed in to the SDK. You need to get the DOM node for the input based on the element ID and pass in the input DOM after selecting the file.
- For media selection, you are advised to use the [image_picker](https://pub.dev/packages/image_picker) package.

- For file selection, you are advised to use the [file_picker](https://pub.dev/packages/file_picker) package.

- If the value of `getElementById` in the sample code is different from the input ID that you see in the F12 console, the actual value prevails.

### Sending an image
``` dart
final ImagePicker _picker = ImagePicker();

_sendImageFileOnWeb() async {
  final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
  final imageContent = await pickedFile!.readAsBytes();
  fileName = pickedFile.name;
  tempFile = File(pickedFile.path);
  fileContent = imageContent;

  html.Node? inputElem;
  inputElem = html.document
      .getElementById("__image_picker_web-file-input")
      ?.querySelector("input");
  final convID = widget.conversationID;
  final convType =
  widget.conversationType == 1 ? ConvType.c2c : ConvType.group;
  final createImageMessageRes = await TencentImSDKPlugin.v2TIMManager
    .getMessageManager()
    .createImageMessage(inputElement: inputElement);
  if (createImageMessageRes.code == 0) {
    String id = createImageMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
}
```

### Sending a video
``` dart
final ImagePicker _picker = ImagePicker();

_sendVideoFileOnWeb() async {
  final pickedFile = await _picker.pickVideo(source: ImageSource.gallery);
  final videoContent = await pickedFile!.readAsBytes();
  fileName = pickedFile.name ?? "";
  tempFile = File(pickedFile.path);
  fileContent = videoContent;

  if(fileName!.split(".")[fileName!.split(".").length - 1] != "mp4"){
    Toast.showToast("The video message must be in mp4 format.", context);
    return;
  }

  html.Node? inputElem;
  inputElem = html.document
      .getElementById("__image_picker_web-file-input")
      ?.querySelector("input");
  final convID = widget.conversationID;
  final convType =
  widget.conversationType == 1 ? ConvType.c2c : ConvType.group;
  final createVideoMessageRes = await TencentImSDKPlugin.v2TIMManager
    .getMessageManager()
    .createVideoMessage(inputElement: inputElement, videoFilePath: "", type: "", duration: 0, snapshotPath: "");
  if (createVideoMessageRes.code == 0) {
    String id = createVideoMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
}
```

### Sending a file
``` dart
_sendFileOnWeb(){
  final convID = widget.conversationID;
  final convType =
      widget.conversationType == 1 ? ConvType.c2c : ConvType.group;
  FilePickerResult? result = await FilePicker.platform.pickFiles();
  if (result != null && result.files.isNotEmpty) {
    html.Node? inputElem;
    inputElem = html.document
        .getElementById("__file_picker_web-file-input")
        ?.querySelector("input");
    fileName = result.files.single.name;
    final createFileMessageRes = await TencentImSDKPlugin.v2TIMManager
        .getMessageManager()
        .createFileMessage(inputElement: inputElement, filePath: "", fileName: fileName);
    if (createFileMessageRes.code == 0) {
    String id = createFileMessageRes.data.id;
    V2TimValueCallback<V2TimMessage> sendMessageRes = await TencentImSDKPlugin
        .v2TIMManager
        .getMessageManager()
        .sendMessage(id: id, receiver: "userID", groupID: "groupID");
    if (sendMessageRes.code == 0) {
      // Message sent successfully
    }
  }
  }
}
```

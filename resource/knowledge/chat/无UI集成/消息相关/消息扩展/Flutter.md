---
sync_node_id: '108053277418496000'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息扩展"
  - "Flutter"
product: "chat"
---
## Overview

Message extension allows you to configure keys and values for messages to implement polling, group notes, survey and other types of messages.
- For polling, create a custom message using the `createCustomMessage` API ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createCustomMessage.html)), where `data` stores the polling title and options. And store the user ID of the voter and selected option(s) in the `key` and `value` of the message extension, respectively. With the selected options of users, we can calculate the polling percentage in real time.

- For group notices, create a custom message for group notification using the `createCustomMessage` API, where `data` stores the title of the group notice, and then store the user ID and the corresponding info in the `key` and `value` of the message extension, respectively.

- For survey, create a custom message using the `createCustomMessage` API, where `data` stores the title and options of the survey, and then store the user ID and the corresponding info in the `key` and `value` of the message extension, respectively.

   > **Note: **
   > 
   > - To use this feature, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition.
   > - This feature is available only in SDK v4.1.8 or later.
   > - You need to enable this feature via [Chat console](https://console.trtc.io/chat) > **Feature Configuration** > **Login and Message** > **Set message extension**.
   > - This feature is not available for communities and audio/video groups.

### Setting message extension

Call the `setMessageExtensions` API ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/setMessageExtensions.html)) to set the message extension. If an extension already exists, modify its `value` info. Otherwise, add new ones.

The request parameters of the `setMessageExtensions` API are detailed as follows:
| Attribute | Definition | Description |
| --- | --- | --- |
| message | Message object | Three message conditions to meet:<br>Set supportMessageExtension (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_message/V2TimMessage/isSupportMessageExtension.html">Flutter</a>) to `YES` before message sending.<br>The message is sent successfully.<br>The message is not a message of a community/audio-video group. |
| extensions | Extensions | Modify the `value` info of an existing extension, or add new extensions. |

> **Note: **
> The `key` and `value` of an extension can contain up to 100 B and 1 KB, respectively. You can set up to 20 extensions each time and 300 extensions for a message.
> 

1. If multiple users set or delete the `key` of the same extension simultaneously, only the first user can operate successfully, and other users will receive the error code 23001 and the latest extension info in the setting response packet, who can set it again if necessary.

2. We recommend setting unique keys of extensions by different users to avoid conflicts in most cases. For example, the `userID` can be set as the `key` of the extension in polling, group notices and survey.

   Sample code:

   ``` dart
       // Setting message extension
       V2TimValueCallback<List<V2TimMessageExtensionResult>>
           setMessageExtensionsRes = await TencentImSDKPlugin.v2TIMManager
               .getMessageManager()
               .setMessageExtensions(msgID: '', // ID of the message for extension setting
                   extensions: []); // Message extension field
       if (setMessageExtensionsRes.code == 0) {
         // Set message extensions successfully
       }
   ```

### Getting message extensions

Call the `getMessageExtensions` API ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getMessageExtensions.html)) to get the message extension list.

> **Note: **
> If the network is unavailable, the SDK will return the message extension list cached locally.
> 

Sample code:
``` dart
    // Get message extensions
    V2TimValueCallback<List<V2TimMessageExtension>> getMessageExtensionsRes =
        await TencentImSDKPlugin.v2TIMManager
            .getMessageManager()
            .getMessageExtensions(
              msgID: '', // ID of the message whose extension information is to be obtained
            );
    if (getMessageExtensionsRes.code == 0) {
      // Got message extensions successfully
      getMessageExtensionsRes.data?.forEach((element) {
        element.extensionKey; // Key of the extension field modified
        element.extensionValue; // Value of the extension field modified
      });
    }
```

### Deleting message extensions

Call the `deleteMessageExtensions` API ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/deleteMessageExtensions.html)) to delete message extensions. If the value of the `keys` field is set to `null`, all message extensions will be cleared.

Sample code:
``` dart
    // Delete message extensions
    V2TimValueCallback<List<V2TimMessageExtensionResult>>
        deleteMessageExtensionsRes = await TencentImSDKPlugin.v2TIMManager
            .getMessageManager()
            .deleteMessageExtensions(msgID: '', // ID of the message for extension deletion
                keys: []); // List of keys of the extension fields to be deleted
    if (deleteMessageExtensionsRes.code == 0) {
      // Deleted message extensions successfully
      deleteMessageExtensionsRes.data?.forEach((element) {
        element.extension; // Message extension information
        element.resultCode; // Operation result code
        element.resultInfo; // Result description
      });
    }
```

### Updating message extensions

If you have added an event listener for advanced messages by calling `addAdvancedMsgListener`, you will receive the `onRecvMessageExtensionsChanged` callback ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimAdvancedMsgListener/V2TimAdvancedMsgListener/onRecvMessageExtensionsChanged.html)) when message extensions are added or updated, and the `onRecvMessageExtensionsDeleted` callback ([details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimAdvancedMsgListener/V2TimAdvancedMsgListener/onRecvMessageExtensionsDeleted.html)) when message extensions are deleted.

Sample code:
``` dart
    // Create a message listener
    V2TimAdvancedMsgListener listener = V2TimAdvancedMsgListener(
      onRecvMessageExtensionsChanged:
          (String msgID, List<V2TimMessageExtension> extensions) {
        // msgID: ID of the message modified
        // extensions: List of extension fields modified
        for (V2TimMessageExtension element in extensions) {
          element.extensionKey; // Key of the extension field modified
          element.extensionValue; // Value of the extension field modified
        }
      },
      onRecvMessageExtensionsDeleted: (msgID, extensionKeys) {
        // msgID: ID of the message whose extension information is deleted
        // extensionKeys: List of keys whose extension information is deleted
      },
    );
    // Add an event listener for advanced messages
    TencentImSDKPlugin.v2TIMManager
        .getMessageManager()
        .addAdvancedMsgListener(listener: listener);
```

---
sync_node_id: '108053256910446592'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话介绍"
  - "JavaScript"
product: "chat"
---
## Conversation Overview

In the Chat SDK, there are three types of `Conversation`: 
- One-to-one (C2C): A one-to-one conversation between only two users. Its composition method is `C2C${userID}`.

- GROUP: A group conversation among group members. Its composition method is `GROUP${groupID}`.

- `@TIM#SYSTEM` (System Notification Session)

   You can use the conversation class APIs to display/update the conversation list, update the unread count, pin a conversation to the top, and mute message notifications.

## UI Display

## Conversation Storage Policy

By default, the client can pull 100 recent contact conversations from the cloud, and after upgrading to the [Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat), it can be configured to pull up to 500 recent contact conversations. The conversation duration is consistent with the saving time of the last message in the conversation. Messages are saved for 7 days by default, which means the conversation is also saved for 7 days by default. Please refer to the [Pricing](https://trtc.io/pricing/chat).

## Conversation Class
| Attribute | Type | Description |
| --- | --- | --- |
| conversationID | String | Its composition method is:<br>- <code>C2C${userID}</code> - A one-to-one conversation between only two users<br>- <code>GROUP${groupID}</code> - A group conversation among group members<br>- <code>@TIM#SYSTEM</code> - System Notification Session |
| type | String | - <code>TencentCloudChat.TYPES.CONV_C2C</code> -  A one-to-one conversation between only two users<br>- <code>TencentCloudChat.TYPES.CONV_GROUP</code> - A group conversation among group members<br>- <code>TencentCloudChat.TYPES.CONV_SYSTEM</code> - System Notification Session |
| unreadCount | Number | Unread count. Group conversations of type <code>TencentCloudChat.TYPES.GRP_MEETING</code> / <code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code> do not record unread counts, and the value of this field is 0. |
| lastMessage | Object | The latest message in the conversation. Its attributes are described as follows.<br>- <code>nick</code> - String - The nickname of the message sender<br>- <code>nameCard</code> - String - The group name card of the message sender<br>- <code>lastTime</code> - Number - The timestamp of the message, in seconds<br>- <code>lastSequence</code> - Number - The sequence of the message<br>- <code>fromAccount</code> - String - The userID of the message sender<br>- <code>isRevoked</code> - Boolean - Whether the message has been recalled, with <code>true</code> indicating it has been recalled, and the default value is <code>false</code><br>- <code>revoker</code> - String \\| null  - The userID of the message recall initiator<br>- <code>isPeerRead</code> - Boolean - Whether the message in a one-to-one conversation has been read by the other party; after the other party calls <code>setMessageRead</code> to report that it has been read, <code>isPeerRead</code> becomes <code>true</code>. The default is <code>false</code><br>- <code>messageForShow</code> - String - The content of the message, used for display. Possible values: text message content, "[Image]", "[Voice]", "[Location]", "[Emoji]", "[File]", "[Custom Message]". If this field does not meet your needs, you can use the payload to customize rendering.<br>- <code>type</code> - String<br><code>TencentCloudChat.TYPES.MSG_TEXT</code> \\| Text message<br><code>TencentCloudChat.TYPES.MSG_IMAGE</code> \\| Image message<br><code>TencentCloudChat.TYPES.MSG_AUDIO</code> \\| Audio message<br><code>TencentCloudChat.TYPES.MSG_VIDEO</code> \\| Video message<br><code>TencentCloudChat.TYPES.MSG_FILE</code> \\| File message<br><code>TencentCloudChat.TYPES.MSG_LOCATION</code> \\| Geolocation message<br><code>TencentCloudChat.TYPES.MSG_CUSTOM</code> \\| Custom message<br><code>TencentCloudChat.TYPES.MSG_GRP_TIP</code> \\| Group tips message<br><code>TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE</code> \\| Group system notification message.<br>- <code>payload</code> - Object - The content of the message |
| groupProfile | Group | Group profile of the group conversation. |
| userProfile | Profile | User profile of the one-to-one conversation. |
| groupAtInfoList | Array.<GroupAtInfo> | @mentioned info list of the group conversation. The developer can display effects such as [Someone @ me] or [@all] in the conversation list based on this information. |
| remark | String | Friend remark. It has a value only when there is a C2C conversation, the other party is my friend, and I have set a remark for this friend. |
| isPinned | Boolean | Whether the conversation is pinned. |
| messageRemindType | String | Message reminder types, specifically as follows:<br>- <code>TencentCloudChat.TYPES.MSG_REMIND_ACPT_AND_NOTE</code> - Messages will be received when the user is online, and offline push notifications will be received when the user is offline.<br>- <code>TencentCloudChat.TYPES.MSG_REMIND_ACPT_NOT_NOTE</code> - The SDK receives a message and notifies you (by reporting the message receiving event), and you display no notification. This option is usually used to implement message notification muting.<br>- <code>TencentCloudChat.TYPES.MSG_REMIND_DISCARD</code> - The SDK rejects a message.<br>- <code>TencentCloudChat.TYPES.NOT_RECEIVE_OFFLINE_PUSH_EXCEPT_AT</code> - Messages will be received when the user is online, and only group @ mentioned messages will be received when the user is offline. |
| markList | Array | Conversation tag list, specifically as follows:<br>- <code>TencentCloudChat.TYPES.CONV_MARK_TYPE_STAR</code> - Star a conversation<br>- <code>TencentCloudChat.TYPES.CONV_MARK_TYPE_UNREAD</code> - Mark a conversation as unread<br>- <code>TencentCloudChat.TYPES.CONV_MARK_TYPE_FOLD</code> - Collapse a conversation<br>- <code>TencentCloudChat.TYPES.CONV_MARK_TYPE_HIDE</code> - Hide a conversation |
| customData | String | Custom data for the conversation. |
| conversationGroupList | Array | List of conversation groups that the conversation belongs to. |
| draftText | String | Conversation draft. Stored locally only, not in the cloud. |

### GroupAtInfo
| Name | Type | Description |
| --- | --- | --- |
| groupID | String | Group ID. |
| messageSequence | Number | Sequence of messages with @ information. |
| atTypeArray | Array.<Number> | <code>at</code> type array, <code>at</code> enumeration values in group conversations are as follows:<br>- <code>TencentCloudChat.TYPES.CONV_AT_ME</code>- Someone mentioned me.<br>- <code>TencentCloudChat.TYPES.CONV_AT_ALL</code>- Mentioned everyone in the group.<br>- <code>TencentCloudChat.TYPES.CONV_AT_ALL_AT_ME</code>- Mentioned everyone in the group and also mentioned me individually. |

---
sync_node_id: '108053275432493056'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息介绍"
  - "JavaScript"
product: "chat"
---
## Message Class

In the Chat SDK, `Message` indicates the message object that is used to describe the attributes of a message, such as type, content, and conversation ID.
| Attribute | Type | Default Value | Description |
| --- | --- | --- | --- |
| ID | String | - | Message ID. The rule for concatenating the message ID is <code>${senderTinyID}-${clientTime}-${random}</code>, which is the same as that for concatenating the message ID of native Chat. |
| type | String | - | Message type. Valid values:<br>- <code>TencentCloudChat.TYPES.MSG_TEXT</code> - text message<br>- <code>TencentCloudChat.TYPES.MSG_IMAGE</code> - image message<br>- <code>TencentCloudChat.TYPES.MSG_AUDIO</code> - audio message<br>- <code>TencentCloudChat.TYPES.MSG_VIDEO</code> - video message<br>- <code>TencentCloudChat.TYPES.MSG_FILE</code> - file message<br>- <code>TencentCloudChat.TYPES.MSG_CUSTOM</code> - custom message<br>- <code>TencentCloudChat.TYPES.MSG_MERGER</code> - merged message<br>- <code>TencentCloudChat.TYPES.MSG_LOCATION</code> - location message<br>- <code>TencentCloudChat.TYPES.MSG_GRP_TIP</code> - group tip message<br>- <code>TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE</code> - group system notification |
| payload | Object | - | Message content. Valid values:<br>- <code>TextPayload</code><br>- <code>ImagePayload</code><br>- <code>AudioPayload</code><br>- <code>VideoPayload</code><br>- <code>FilePayload</code><br>- <code>CustomPayload</code><br>- <code>MergerPayload</code><br>- <code>LocationPayload</code><br>- <code>FacePayload</code><br>- <code>GroupTipPayload</code><br>- <code>GroupSystemNoticePayload</code> |
| conversationID | String | - | Conversation ID of the message. |
| conversationType | String | - | Conversation type of the message. Valid values:<br>- <code>TencentCloudChat.TYPES.CONV_C2C</code> --- C2C (one-to-one) conversation<br>- <code>TencentCloudChat.TYPES.CONV_GROUP</code> --- group conversation<br>- <code>TencentCloudChat.TYPES.CONV_SYSTEM</code> --- system conversation |
| to | String | - | <code>userID</code> of the receiver. |
| from | String | - | <code>userID</code> of the sender. It is set to the ID of the currently logged-in user by default when a message is sent. |
| flow | String | - | Message flow.<br>- <code>in</code> --- the received message<br>- <code>out</code> --- the sent message |
| time | Number | - | Message timestamp in seconds. |
| status | String | - | Message status.<br>- <code>unSend</code> --- not sent<br>- <code>success</code> --- sent successfully<br>- <code>fail</code> --- failed to send |
| isRevoked | Boolean | false | Whether the message is a recalled message. <code>true</code> indicates yes. |
| priority | String | <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL</code> | Message priority. If messages in a group exceed the frequency limit, the backend will deliver high-priority messages first. Supported enumerated values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| nick | String | - | Nickname of the message sender. This attribute needs to be set by calling the <code>updateMyProfile</code> API in advance. |
| avatar | String | - | Profile photo URL of the message sender. This attribute needs to be set by calling the <code>updateMyProfile</code> API in advance. |
| nameCard | String | - | Group name card of the sender that sends a non-audio-video group message. This attribute also is called the nickname of the message sender in the group and needs to be set by calling the <code>setGroupMemberNameCard</code> API in advance. |
| atUserList | Array | - | This field stores the <code>userID</code> values of the group members who are mentioned in the group message. |
| cloudCustomData | String | '' | Custom message data, which is saved in the cloud, will be sent to the receiver, and can still be pulled after the application is uninstalled and reinstalled. |
| isDeleted | Boolean | false | Whether the message is a deleted message. <code>true</code> indicates yes. |
| isModified | Boolean | false | Whether the message is a modified message. <code>true</code> indicates yes. |
| needReadReceipt | Boolean | false | Whether a read receipt is needed. <code>true</code> indicates yes. To use it, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition package. |
| readReceiptInfo | Object | - | Message read receipt information<br>- <code>readCount</code> - count of the messages that are read, which can be queried by calling <code>getMessageReadReceiptList</code> API; to query the group members who read the message, call the <code>getGroupMessageReadMemberList</code>.<br>- <code>unreadCount</code> - count of the messages that are not read, which can be queried by calling the <code>getMessageReadReceiptList</code> API.<br>- <code>isPeerRead</code> - Whether the peer of C2C message has sent a read receipt, this property will be updated when the message sender receives a read receipt notification or pulls roaming after the message receiver successfully calls <code>sendMessageReadReceipt</code>.<br>- <code>timestamp</code> - Time for the peer of C2C message to send a read receipt, in seconds. This attribute will be updated when the message sender receives a read receipt notification or pulls roaming after the message receiver successfully calls <code>sendMessageReadReceipt</code>. |
| isBroadcastMessage | Boolean | false | Whether the message is a broadcast message. <code>true</code> indicates yes. |
| isSupportExtension | Boolean | false | whether the message supports extensions. <code>true</code> indicates yes. To use it, you need to purchase the Pro edition 、Pro Plus edition or Enterprise edition package. |
| revokerInfo | Object | - | Information of the message recaller. |
| revokeReason | String | - | Reason for the message recall. |
| hasRiskContent | Boolean | - | Whether image, voice, and video messages are marked as having security risks, default is false.<br>If the content of the voice or video message you send is non-compliant, the SDK will trigger a <code>MESSAGE_MODIFIED</code> event after asynchronous cloud review. |

### TextPayload

|Name|Type|Description|
|---------|---------|---------|
|text|String|Text message content|

### ImagePayload
| Name | Type | Description |
| --- | --- | --- |
| uuid | String | Unique identifier of an image |
| imageFormat | Format | Image format type. JPG/JPEG = 1, GIF = 2, PNG = 3, BMP = 4, other = 255 |
| imageInfoArray | Array.<Object> | Image information. Each element contains attributes described as follows:<br>- width - Number<br>- height - Number<br>- url - String - Image address, which can be used for rendering<br>- size - Number - Image size, in bytes<br>- type - Number - 0, Original image; 1, 198p compressed image; 2, 720p compressed image |

### AudioPayload

|Name|Type|Description|
|---------|---------|---------|
|uuid|String|Unique identifier|
|url|String|Audio address, which can be used for playback|
|size|Number|File size, in bytes|
|second|Number|Audio duration, in seconds|

### VideoPayload

|Name|Type|Description|
|---------|---------|---------|
|videoFormat|String|Video file format|
|videoSecond|Number|Video file duration, in seconds and of integer type|
|videoSize|Number|Video file size, in bytes|
|videoUrl|String|Video file address, which can be used for playback|
|videoUUID|String|Unique identifier of a video|
|snapshotWidth|Number|snapshot image width|
|snapshotHeight|Number|snapshot image height|
|snapshotUrl|String|snapshot image address, which can be used rendering(the [tim-upload-plugin](https://www.npmjs.com/package/tim-upload-plugin) is required)|

### FilePayload

|Name|Type|Description|
|---------|---------|---------|
|uuid|String|Unique identifier|
|fileName|String|File name|
|fileUrl|String|File address|
|fileSize|Number|File size, in bytes|

### CustomPayload

|Name|Type|Description|
|---------|---------|---------|
|data|String|"data" field of a custom message|
|description|String|"description" field of a custom message|
|extension|String|"extension" field of a custom message|

### MergerPayload

|Name|Type|Description|
|---------|---------|---------|
|downloadKey|String|Key for downloading a combined message. If a combined message is large in size, the SDK will store it on the cloud, using this key as the unique identifier of the message.|
|messageList|Array.<SimplifiedMessage>|List of messages combined.|
|title|String|Title of the combined message, for example, "Chat History of the Talent Center in the Greater Bay Area".|
|abstractList|String|Digest list. You can set digest information in different formats for different message types, for example: for a text message, the digest can be in the "sender:text" format. For an image message, the digest can be in the "sender:[image]" format. For a file message, the digest can be in the "sender:[file]" format.|
|compatibleText|String|Compatible text. SDKs of early versions do not support combined messages, and they will send a text message with the content `compatibleText` by default.|
|layersOverLimit|Boolean|Whether the number of combination nesting levels exceeds the limit. true: the limit is exceeded, and the message is truncated. Default value: false.|

### GeoPayload

|Name|Type|Description|
|---------|---------|---------|
|description|String|Related description|
|latitude|Number|Latitude|
|longitude|Number|longitude|

### FacePayload

|Name|Type|Description|
|---------|---------|---------|
|index|Number|Emoji index, which is customized by the user|
|data|String|Extra data|

### GroupTipPayload
| Name | Type | Description |
| --- | --- | --- |
| groupJoinType | Number | Group joining type. Supported values are as follows:<br>- 0 - Default value, indicating that the operation is not a group joining operation.<br>- 1 - A user requests to join the group.<br>- 2 - A user is invited to the group. |
| operatorID | String | ID of the user who performs the operation. |
| operatorInfo | Object | User information for executing this operation (supported from v3.4.2 onwards). |
| operationType | Number | Operation type. Supported values are as follows:<br>1 - A member joins the group.<br>2 - A member leaves the group.<br>3 - A group member is removed from the group.<br>4 - A group member is granted the group admin role.<br>5 - The group admin role of a group member is revoked.<br>6 - The group profile is modified.<br>7 - The profile of a group member is modified. For example, a group member is muted.<br>10 - An audio-video group member is banned.<br>11 - An audio-video group member is unbanned. |
| userIDList | Array.<String> | List of relevant userIDs. |
| newGroupProfile | Object | If a group profile is modified, this field stores the new group profile. |
| memberList | Array.<Object> | If a group member is muted, this field stores related information. Each element contains attributes described as follows:<br>- <code>userID</code> - String - Group member userID<br>- <code>muteTime</code> - Number - Muting duration, in seconds<br>- <code>nick</code> - String - Nickname of the group member<br>- <code>avatar</code> - String - Avatar of group members<br>- <code>duration</code> - Number - Ban duration, unit: seconds<br>- <code>reason</code> - String - Reason for ban |

### GroupSystemNoticePayload
| Name | Type | Description |
| --- | --- | --- |
| operatorID | String | ID of the user who performs the operation. |
| operationType | Number | Operation type. Supported values are as follows:<br>1 - A user requests to join the group.<br>2 - The request to join the group is approved.<br>3 - The request to join the group is rejected.<br>4 - A user is removed from the group.<br>5 - The group is deleted.<br>6 - The group is created.<br>7 - A user is invited to the group.<br>8 - A user leaves the group.<br>9 - The admin is modified.<br>10 - The admin is canceled.<br>11 - The group is repossessed.<br>12 - A user receives a group joining invitation, and needs to accept or reject the invitation.<br>13 - A user invites others to join the group, and the invitation is accepted.<br>14 - A user invites others to join the group, and the invitation is rejected.<br>15 - Read report synchronized across multiple terminals.<br>20 - Group message remind type synchronized across multiple terminals.<br>21 - ban an audio-video group member.<br>22 - unban an audio-video group member.<br>23 - a group member invites others to join the group.<br>255 - A custom notification is triggered. |
| groupProfile | Object | Profile of the relevant group. |
| userDefinedField | String | User-defined field. |
| handleMessage | Object | Remarks on the processing. For example, if user1 enters remarks on an application to join group1 that requires approval, the admin of group1 will see this field in the group system message. |
| messageRemindType | String | - <code>TencentCloudChat.TYPES.MSG_REMIND_ACPT_AND_NOTE</code> - the SDK receives a message and throws a MESSAGE_RECEIVED event to notify the access side, which then sends a notification.<br>- <code>TencentCloudChat.TYPES.MSG_REMIND_ACPT_NOT_NOTE</code> - the SDK receives a message and throws a MESSAGE_RECEIVED event to notify the access side, which then does not send a notification.<br>- <code>TencentCloudChat.TYPES.MSG_REMIND_DISCARD</code> - the SDK rejects a message.<br>- <code>TencentCloudChat.TYPES.NOT_RECEIVE_OFFLINE_PUSH_EXCEPT_AT</code> Receive messages online, and only receive push notifications for group @ messages when offline |

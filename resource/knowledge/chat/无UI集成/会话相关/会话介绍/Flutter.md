---
sync_node_id: '108053256391401472'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话介绍"
  - "Flutter"
product: "chat"
---
## Conversation

When a user creates a one-to-one or group chat, a conversation will be created.

In the Tencent Cloud Chat SDK, the conversation class is `TencentImSDKPlugin.v2TIMManager.getConversationManager()`. You can use the conversation management class APIs to display/update the conversation list, update the unread count, pin a conversation to the top, make a conversation draft, and mute message notifications.

## Conversation Class

The conversation class is `V2TIMConversation` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_conversation/V2TimConversation-class.html)), which defines the following content:
| Attribute | Definition | Description |
| --- | --- | --- |
| type | Conversation type | See the definition of <code>V2TIMConversationType</code>, which can be <code>C2C</code> or <code>Group</code>. |
| conversationID | Unique conversation ID | It is in the format of <code>c2c_userID</code> for a one-to-one chat or <code>group_groupID</code> for a group chat. |
| userID | User ID of the message receiver | <code>userID</code> stores the user ID of the message receiver if the conversation type is one-to-one chat; otherwise, it is <code>nil/null</code>. |
| groupID | Group ID | <code>groupID</code> stores the group ID if the conversation type is group chat; otherwise, it is <code>nil/null</code>. |
| groupType | Group type | <code>groupType</code> is the type of the group if the conversation type is group chat; otherwise, it is <code>nil/null</code>. |
| showName | Displayed conversation name | The name of a group conversation is displayed in the following order of priority: group name > group ID;<br>The name of a one-to-one conversation is displayed in the following order of priority: friend remarks of the message receiver > nickname of the message receiver > <code>userID</code> of the message receiver. |
| faceUrl | Displayed conversation profile photo | It is the group profile photo for a group chat or the profile photo of the message receiver for a one-to-one chat. |
| unreadCount | Unread message count of the conversation | For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_conversation/V2TimConversation/unreadCount.html">unreadCount property</a>. It is invalid and defaults to <code>0</code> for an audio-video group (AVChatRoom). |
| recvOpt | Message receiving option | See the definition of <code>V2TIMReceiveMessageOpt</code>. For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_receive_message_opt_enum/ReceiveMsgOptEnum.html">V2TimReceiveMessageOptInfo class</a>. |
| lastMessage | Last message in the conversation | For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversationList.html">getConversationList metho</a>. |
| groupAtInfolist | List of @ information in the group conversation | Generally, it is used to display the notifications of "someone@me" and "@all". |
| draftText | Draft information | The draft information can be set by calling the <code>setConversationDraft</code> API. For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_conversation/V2TimConversation/draftText.html">setConversationDraft method</a>. |
| draftTimestamp | Draft editing time | It is automatically generated when a draft is set. |
| isPinned | Whether to pin the conversation to the top | For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/pinConversation.html">pinConversation method</a>. |
| orderKey | Field for sorting conversations | For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversationList.html">getConversationList method</a>. |
| customData | Conversation's custom data | For detailed directions, see <a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/setConversationCustomData.html">setConversationCustomData method</a> |

## Conversation Storage Policy

There is no limit on the number of locally stored conversations.

Up to 100 conversations can be stored in the cloud. To increase this limit, upgrade to the Pro edition 、Pro Plus edition or Enterprise edition. Then you can set the limit to 500 in the console.

Up to 100 conversations can be stored in the cloud. To increase this limit, upgrade to the Pro edition 、Pro Plus edition or Enterprise edition. Then you can set the limit to 500 in the console:

If the information of a conversation has not been updated for a long time, the conversation can be stored in the cloud for up to seven days. To extend the conversation storage period

Locally stored conversations may not always be consistent with those stored in the cloud. If the user does not call the `deleteConversation` API to delete the local conversations, the conversations will always exist. However, up to 100 conversations can be stored in the cloud, and if the information of a conversation has not been updated for a long time, the conversation can be stored in the cloud for up to seven days. Therefore, local conversations displayed on different terminals may differ.

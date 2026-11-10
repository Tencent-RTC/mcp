---
sync_node_id: '108053256218386432'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话介绍"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

When a user creates a one-to-one or group chat, and a message is sent or received in it, a conversation will be created.
In the Chat SDK, the conversation management class is `V2TIMConversationManager(Java)` or `V2TIMManager(Conversation)(Objective-C)`. You can use the conversation management class APIs to display/update the conversation list, update the unread count, pin a conversation to the top, make a conversation draft, and mute message notifications.

## Conversation Class

The conversation class is `V2TIMConversation` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversation.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMConversation.html) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMConversation.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMConversation.html)), which defines the following content:
| Attribute | Definition | Description |
| --- | --- | --- |
| type | Conversation type | See the definition of <code>V2TIMConversationType</code>, which can be <code>C2C</code> or <code>Group</code>. |
| conversationID | Unique conversation ID | It is in the format of <code>c2c_userID</code> for a one-to-one chat or <code>group_groupID</code> for a group chat. |
| userID | User ID of the message receiver | <code>userID</code> stores the user ID of the message receiver if the conversation type is one-to-one chat; otherwise, it is empty. |
| groupID | Group ID | <code>groupID</code> stores the group ID if the conversation type is group chat; otherwise, it is empty. |
| groupType | Group type | <code>groupType</code> is the type of the group if the conversation type is group chat; otherwise, it is empty. |
| showName | Displayed conversation name | - The name of a group conversation is displayed in the following order of priority: group name > group ID;<br>- The name of a one-to-one conversation is displayed in the following order of priority: friend remarks of the message receiver > nickname of the message receiver > <code>userID</code> of the message receiver. |
| faceUrl | Displayed conversation profile photo | It is the group profile photo for a group chat or the profile photo of the message receiver for a one-to-one chat. |
| unreadCount | Unread message count of the conversation | For detailed directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48320">Conversation Unread Count</a>. It is invalid and defaults to <code>0</code> for an audio-video group (AVChatRoom). |
| recvOpt | Message receiving option | See the definition of <code>V2TIMReceiveMessageOpt</code> and the use directions <a href="https://intl.cloud.tencent.com/document/product/1047/48032">Do not Notify</a>. |
| lastMessage | Last message in the conversation | For detailed directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48326">Conversation List</a>. |
| groupAtInfolist | List of @ information in the group conversation | Generally, it is used to display the notifications of "someone@me" and "@all". |
| draftText | Draft information | The draft information can be set by calling the <code>setConversationDraft</code> API. For detailed directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48311">Conversation Draft</a>. |
| draftTimestamp | Draft editing time | It is automatically generated when a draft is set. |
| isPinned | Whether to pin the conversation to the top | For detailed directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48317">Pinning Conversation to the Top</a>. |
| orderKey | Field for sorting conversations | For detailed directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48326">Conversation List</a>. |
| markList | Conversation mark list | For the use directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48853">Conversation Mark</a>. This attribute is supported from v6.5. |
| customData | Custom conversation data | To set custom data, call the <code>setConversationCustomData</code> API. The custom data will be stored on the cloud. Up to 256 bytes are supported. This attribute is supported from v6.5. |
| conversationGroupList | List of groups to which the conversation belongs | For the use directions, see <a href="https://intl.cloud.tencent.com/document/product/1047/48854">Conversation Group</a>. This attribute is supported from v6.5. |
| c2cReadTimestamp | Timestamp of the latest message which has been read | Valid only for one-to-one chat. Supported from v7.1. |
| groupReadSequence | Sequence of the latest message which has been read | Valid only for group chat. Supported from v7.1. |

## Conversation Storage Policy

There is no limit on the number of locally stored conversations.

Up to 100 conversations can be stored in the cloud. To increase this limit, upgrade to the Pro edition 、Pro Plus edition、Enterprise edition. Then you can set the limit to 500 in the console.

If the information of a conversation has not been updated for a long time, the conversation can be stored in the cloud for up to 7 days.

Locally stored conversations may not always be consistent with those stored in the cloud. If you do not call the `deleteConversation` API to delete the local conversations, these conversations will always exist. However, at most 100 conversations can be stored in the cloud. In addition, if the information of a conversation has not been updated for a long time, this conversation can be stored in the cloud for at most 7 days. Therefore, local conversations displayed on different mobile phones may be inconsistent with each other.

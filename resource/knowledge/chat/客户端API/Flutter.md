---
sync_node_id: '108053211908710400'
nav_path:
  - "客户端 API"
  - "Flutter"
product: "chat"
---
## Initialization and Login APIs

To use the Tencent Cloud Chat service, you need to initialize the SDK and log in.

|API|Description|
|---------|---------|
|[initSDK](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/initSDK.html)|Initializes the SDK.|
|[unInitSDK](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/unInitSDK.html)|Uninitializes the SDK.|
|[login](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/login.html)|Logs in.|
|[logout](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/logout.html)|Logs out.|
|[getLoginUser](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getLoginUser.html)|Gets the UserID of the current login user.|
|[getLoginStatus](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getLoginStatus.html)|Gets the login status.|
|[getServerTime](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getServerTime.html)|Gets the current server time (not supported on web).|
|[getVersion](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getVersion.html)|Gets the version number.|
|[getConversationManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getConversationManager.html)|Conversation feature entry.|
|[getFriendshipManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getFriendshipManager.html)|Contacts feature entry.|
|[getGroupManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getGroupManager.html)|Advanced group feature entry.|
|[getMessageManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getMessageManager.html)|Advanced message feature entry.|
|[getOfflinePushManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getOfflinePushManager.html)|Gets the version number.|
|[getSignalingManager](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getSignalingManager.html)|Signaling entry.|

## Signaling APIs

|API|Description|
|---------|---------|
|[addSignalingListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/addSignalingListener.html)|Adds a signaling listener.|
|[removeSignalingListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/removeSignalingListener.html)|Removes a signaling listener.|
|[invite](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/invite.html)|Invites a user.|
|[inviteInGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/inviteInGroup.html)|Invites certain users in the group.|
|[cancel](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/cancel.html)|The inviter cancels the invitation.|
|[accept](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/accept.html)|The invitee accepts the invitation.|
|[reject](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/reject.html)|The invitee rejects the invitation.|
|[getSignalingInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/getSignalingInfo.html)|Gets signaling information.|
|[addInvitedSignaling](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_signaling_manager/V2TIMSignalingManager/addInvitedSignaling.html)|Creates a signaling request.|

## Message Creation APIs

After a message is created, an `id` field will be returned. You can pass in the `id` field and related information to the message sending API (`sendMessage`) to send the message.

|API|Description|
|---------|---------|
|[createTextMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTextMessage.html)|Creates a text message.|
|[createCustomMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createCustomMessage.html)|Creates a custom message.|
|[createImageMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createImageMessage.html)|Creates an image message.|
|[createSoundMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createSoundMessage.html)|Creates an audio message.|
|[createVideoMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createVideoMessage.html)|Creates a video message.|
|[createTextAtMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTextAtMessage.html)|Creates an @ text message.|
|[createFileMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createFileMessage.html)|Creates a file message.|
|[createLocationMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createLocationMessage.html)|Creates a location message.|
|[createFaceMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createFaceMessage.html)|Creates an emoji message.|
|[createMergerMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createMergerMessage.html)|Creates a combined message.|
|[createForwardMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createForwardMessage.html)|Creates a forward message.|
|[createTargetedGroupMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/createTargetedGroupMessage.html)|Creates a targeted group message.|
|[appendMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/appendMessage.html)|Adds a multi-element message.|

## Message Sending and Receiving APIs

If you need to send or receive rich media messages (such as image, video, and file messages) and use advanced features such as recalling messages, marking messages as read, and querying message history, we recommend the following advanced message APIs. (The original APIs for simple message sending and receiving used by v3.6.0 and earlier versions have been disused. Please use new APIs to create and send messages.)

|API|Description|
|---------|---------|
|[addAdvancedMsgListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/addAdvancedMsgListener.html)|Sets an event listener for advanced messages.|
|[removeAdvancedMsgListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/removeAdvancedMsgListener.html)|Removes the event listener for advanced messages.|
|[getC2CHistoryMessageList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getC2CHistoryMessageList.html)|Gets historical one-to-one (C2C) messages.|
|[getHistoryMessageList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getHistoryMessageList.html)|Gets historical messages (advanced API).|
|[getGroupHistoryMessageList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getGroupHistoryMessageList.html)|Gets historical group messages.|
|[markC2CMessageAsRead](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/markC2CMessageAsRead.html)|Marks one-to-one (C2C) messages as read.|
|[markGroupMessageAsRead](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/markGroupMessageAsRead.html)|Marks group messages as read.|
|[markAllMessageAsRead](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/markAllMessageAsRead.html)|Marks all messages as read.|
|[deleteMessageFromLocalStorage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/deleteMessageFromLocalStorage.html)|Deletes a message from the local storage.|
|[deleteMessages](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/deleteMessages.html)|Deletes local and roaming messages.|
|[insertGroupMessageToLocalStorage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/insertGroupMessageToLocalStorage.html)|Adds a message to the message list of a group chat.|
|[insertC2CMessageToLocalStorage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/insertC2CMessageToLocalStorage.html)|Adds a message to the message list of a one-to-one chat.|
|[clearC2CHistoryMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/clearC2CHistoryMessage.html)|Clears the chat history with a user from local storage and the cloud (without deleting the conversation).|
|[clearGroupHistoryMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/clearGroupHistoryMessage.html)|Clears the chat history of a group from local storage and the cloud (without deleting the conversation).|
|[downloadMergerMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/downloadMergerMessage.html)|Gets the sub messages of a combined message.|
|[setC2CReceiveMessageOpt](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/setC2CReceiveMessageOpt.html)|Sets the one-to-one message receiving option for a user (batch setting supported).|
|[getC2CReceiveMessageOpt](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getC2CReceiveMessageOpt.html)|Queries the one-to-one message receiving option of a user.|
|[setGroupReceiveMessageOpt](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/setGroupReceiveMessageOpt.html)|Modifies the group message receiving option.|
|[setLocalCustomData](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/setLocalCustomData.html)|Sets custom message data (saved locally, will not be sent to the peer end, and will become invalid after the app is uninstalled and reinstalled).|
|[setLocalCustomInt](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/setLocalCustomInt.html)|Sets custom message data and marks whether a voice or video message is played (such a message will be saved locally, not be sent to the peer end, and become invalid after the app is uninstalled and reinstalled).|
|[revokeMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/revokeMessage.html)|Recalls a message. By default, you can recall only messages that are sent within two minutes. You can customize the time limit for message recall via the console (**Feature Configuration** > **Login and Message** > **Message Recall Settings**).|
|[modifyMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/modifyMessage.html)|Modifies a message.|
|[sendMessage](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html)|Sends a message.|
|[searchLocalMessages](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/searchLocalMessages.html)|Searches for local messages.|
|[sendMessageReadReceipts](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessageReadReceipts.html)|Sends group message read receipts.|
|[getMessageReadReceipts](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getMessageReadReceipts.html)|Gets read receipts for messages sent by yourself.|
|[getGroupMessageReadMemberList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getGroupMessageReadMemberList.html)|Gets the list of members who have (or have not) read a message sent by yourself.|

## Group APIs

Tencent Cloud Chat SDK supports five preset group types, each of which pertains to different scenarios.
- Work group (Work): users can join the group only after being invited by group members. This group type is the same as private group (Private) in earlier versions.

- Public group (Public): Users can join a public group through requests, which need to be approved by the group owner or group admin.

- Meeting group (Meeting): used together with [TRTC](https://trtc.io/document) to enable scenarios such as video conferencing and online education. Users can join and leave the group freely and view the message history before they join. Same as chat room (ChatRoom) in earlier versions.

- Community: A user can join and leave a community freely. It is suitable for chat scenarios with a super large number of community members, such as knowledge sharing and game discussion. This feature is supported by a client with the SDK enhanced edition v5.8.1668 or later and the web SDK v2.17.0 or later. To use it, you need to purchase the [Pro edition, Pro Plus edition, Enterprise edition](https://trtc.io/buy/chat), and then log in to [**Console**](https://console.trtc.io/) > Chat > Function Configuration > [Group](https://console.trtc.io/chat/login-message). In the **Group Type Configuration** section, locate **Community** and **Enable community** toggle next to **Community Status** to activate this feature.

- Audio-video group (AVChatRoom): An audio-video group allows users to join and leave freely and is suitable for scenarios such as live streaming and chat rooms with on-screen comments. There is no limit on the number of group members.

   |API|Description|
   |---------|---------|
   |[addGroupListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/addGroupListener.html)|Adds an event listener for groups.|
   |[removeGroupListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/removeGroupListener.html)|Removes an event listener for groups.|
   |[createGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/createGroup.html)|Creates a group (advanced). The group information and the initial group members can be set during group creation.|
   |[joinGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/joinGroup.html)|Joins a group.|
   |[quitGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/quitGroup.html)|Leaves a group.|
   |[dismissGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/dismissGroup.html)|Deletes a group. Only the group owner and group admin can delete the group.|
   |[getJoinedGroupList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getJoinedGroupList.html)|Gets the list of groups the current user has joined, excluding audio-video groups.|
   |[getGroupsInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupsInfo.html)|Gets the profiles of groups.|
   |[setGroupInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupInfo.html)|Modifies the profile of a group.|
   |[initGroupAttributes](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/initGroupAttributes.html)|Initializes group attributes. This will clear the existing group attribute list.|
   |[setGroupAttributes](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupAttributes.html)|Sets group attributes. If the group attributes already exist, their values are updated. Otherwise, the group attributes are added.|
   |[deleteGroupAttributes](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/deleteGroupAttributes.html)|Deletes specified group attributes. Passing in `null` for `keys` means clearing all group attributes.|
   |[getGroupAttributes](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupAttributes.html)|Gets specified group attributes. Passing in `null` for `keys` means getting all group attributes.|
   |[searchGroups](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/searchGroups.html)|Searches for groups.|
   |[getGroupOnlineMemberCount](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupOnlineMemberCount.html)|Gets the number of online users in a group. (This API is currently supported only by audio-video groups.)|
   |[getGroupMemberList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMemberList.html)|Gets the group member list.|
   |[getGroupMembersInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMembersInfo.html)|Gets the profiles of specified group members.|
   |[setGroupMemberInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupMemberInfo.html)|Modifies the profile of a specified group member.|
   |[searchGroupMembers](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/searchGroupMembers.html)|Searches for group members.|
   |[muteGroupMember](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/muteGroupMember.html)|Mutes a group member.|
   |[kickGroupMember](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/kickGroupMember.html)|Removes members from a group.|
   |[setGroupMemberRole](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupMemberRole.html)|Sets a role for a group member.|
   |[transferGroupOwner](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/transferGroupOwner.html)|Transfers the ownership of a group.|
   |[inviteUserToGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/inviteUserToGroup.html)|Invites users to a group.|
   |[getGroupApplicationList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupApplicationList.html)|Gets the list of requests to join a group.|
   |[acceptGroupApplication](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/acceptGroupApplication.html)|Accepts a request to join a group.|
   |[refuseGroupApplication](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/refuseGroupApplication.html)|Rejects a request to join a group.|
   |[setGroupApplicationRead](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupApplicationRead.html)|Marks the request list as read.|
   |[getJoinedCommunityList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getJoinedCommunityList.html)|Gets the list of community groups the current user has joined.|
   |[createTopicInCommunity](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/createTopicInCommunity.html)|Creates a topic.|
   |[deleteTopicFromCommunity](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/deleteTopicFromCommunity.html)|Deletes a topic.|
   |[setTopicInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setTopicInfo.html)|Sets topic attributes.|
   |[getTopicInfoList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getTopicInfoList.html)|Gets the topics of a group.|

## Conversation List APIs

The conversation list is the list a user sees on the first screen after login. It includes elements such as conversation node, conversation name, group name, last message, and unread count.

|API|Description|
|---------|---------|
|[addConversationListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/addConversationListener.html)|Adds a contacts listener.|
|[removeConversationListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/removeConversationListener.html)|Removes a contacts listener.|
|[getConversationList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversationList.html)|Gets the conversation list.|
|getConversationListByConversaionIds|Gets the list of specified conversations by conversation IDs.|
|[pinConversation](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/pinConversation.html)|Pins a conversation to the top.|
|[getTotalUnreadMessageCount](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getTotalUnreadMessageCount.html)|Gets the total unread message count of a conversation.|
|[getConversation](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/getConversation.html)|Gets a specified conversation.|
|[deleteConversation](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/deleteConversation.html)|Deletes a conversation.|
|[setConversationDraft](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/setConversationDraft.html)|Sets a draft for a conversation.|

## User Profile APIs

You can use the following APIs to query user profiles, modify your profile, and block messages from a specified user (that is, adding a specified user to the blocklist).

|API|Description|
|---------|---------|
|[getUsersInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getUsersInfo.html)|Gets user profiles.|
|[getUserStatus](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/getUserStatus.html)|Gets users' online statuses.|
|[setSelfInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/setSelfInfo.html)|Modifies one's own user profile.|
|[setSelfStatus](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/setSelfStatus.html)|Sets the status of the current logged-in user.|
|[addToBlackList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addToBlackList.html)|Blocks messages from a user, which means adding the user to the blocklist.|
|[deleteFromBlackList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFromBlackList.html)|Unblocks messages from a user, which means removing the user from the blocklist.|
|[getBlackList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getBlackList.html)|Gets the blocklist.|

## Offline Push APIs

We recommend you use the offline push service if you want your app to receive Chat service messages in real time when it runs in the background. As there is no unified push service in the Chinese mainland, you need to configure Android offline push for devices of different vendors separately.

|API|Description|
|---------|---------|
|[setAPNSListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/setAPNSListener.html)|Sets the APNs offline push listener.|
|[doBackground](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_offline_push_manager/V2TIMOfflinePushManager/doBackground.html)|Configures offline push.|
|[doForeground](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_offline_push_manager/V2TIMOfflinePushManager/doForeground.html)|Configures offline push.|
|[setOfflinePushConfig](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_offline_push_manager/V2TIMOfflinePushManager/setOfflinePushConfig.html)|Configures offline push.|

## Friend Management APIs

Tencent Cloud Chat SDK does not check friend relationships by default when sending and receiving messages. To achieve the interactive experience of "add friends first, then send messages", you can log in to [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Under this section, enable **Stranger Direct Message Restrictions**. When this option is activated, only friends can send messages to each other. If a user tries to send a message to someone who is not their friend, the SDK returns [error code 20009](https://intl.cloud.tencent.com/document/product/1047/34348).

Use the following API to add or delete friends and manage friend lists.

|API|Description|
|---------|---------|
|[addFriendListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addFriendListener.html)|Adds a contacts listener.|
|[removeFriendListener](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/removeFriendListener.html)|Removes a contacts listener.|
|[getFriendList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getFriendList.html)|Gets the contacts.|
|[getFriendsInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getFriendsInfo.html)|Gets the profiles of specified friends.|
|[setFriendInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/setFriendInfo.html)|Sets the profile of a specified friend.|
|[addFriend](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addFriend.html)|Adds a friend.|
|[deleteFromFriendList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFromFriendList.html)|Deletes friends.|
|[checkFriend](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/checkFriend.html)|Checks your relationship with a specified user.|
|[getFriendApplicationList](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getFriendApplicationList.html)|Gets the list of friend requests.|
|[acceptFriendApplication](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/acceptFriendApplication.html)|Accepts a friend request.|
|[refuseFriendApplication](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/refuseFriendApplication.html)|Rejects a friend request.|
|[deleteFriendApplication](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFriendApplication.html)|Deletes a friend request.|
|[setFriendApplicationRead](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/setFriendApplicationRead.html)|Marks a friend request as read.|
|[createFriendGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/createFriendGroup.html)|Creates a friend list.|
|[getFriendGroups](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getFriendGroups.html)|Gets the information of friend lists.|
|[deleteFriendGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFriendGroup.html)|Deletes a friend list.|
|[renameFriendGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/renameFriendGroup.html)|Modifies the name of a friend list.|
|[addFriendsToFriendGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addFriendsToFriendGroup.html)|Adds friends to a friend list.|
|[deleteFriendsFromFriendGroup](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFriendsFromFriendGroup.html)|Deletes friends from a friend list.|
|[searchFriends](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/searchFriends.html)|Searches for friends.|

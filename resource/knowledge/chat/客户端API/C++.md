---
sync_node_id: '131411589454319616'
nav_path:
  - "客户端 API"
  - "C++"
product: "chat"
---
## Initialization and Login APIs

To use the Tencent Cloud Chat service, you need to initialize the SDK and log in.

|API|Description|
|---------|---------|
|[InitSDK](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aecee922675b671cd979d68604a4be1bb)|Initializes the IM SDK.|
|[UnInitSDK](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6c88218989a1c714b4e989d1696439a0)|Uninstalls the IM SDK.|
|[GetVersion](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a8f5a603b985b2e305e6182db0e31c516)|Gets the version number.|
|[GetServerTime](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#af18ff99404db53f627aa619ac744a08d)|Gets the server time.|
|[Login](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6a9c19be21327ace77ab75657d2944b3)|Logs a user in.|
|[Logout](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#abf4f7e18d22fe8f75b5212fcf82e7113)|Logs a user out.|
|[GetLoginStatus](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad5888b2d240c2fcb076b060d298a2c22)|Gets the login status.|
|[GetLoginUser](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad19e832506181f6ec955d9e0d2035797)|Gets the UserID of the current login user.|

## Simple Message APIs

Use the following APIs for the sending and receiving of text and signaling (custom buffer) messages.

|API|Description|
|---------|---------|
|[AddSimpleMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad039bd93fe1a09cf45034697e1c1328f)|Sets an event listener for simple messages (text messages and custom messages). Do not use it and [AddAdvancedMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a498688ee0f672f114e28d830761dfbf8) at the same time.|
|[RemoveSimpleMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ab4355384fafb97a099d518f40dbc7654)|Removes the event listener for simple messages (text messages and custom messages).|
|[SendC2CTextMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a55ff3770a4267e331cd31fcd9475a6e5)|Sends a one-to-one (C2C) text message.|
|[SendC2CCustomMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a07d2bcf26547adb609f7aef752cd8189)|Sends a one-to-one (C2C) custom (signaling) message.|
|[SendGroupTextMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a3006778f10df146968858a53cc4854ec)|Sends a group text message.|
|[SendGroupCustomMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a9e49af2df4299a8546e19661c2792cad)|Sends a group custom (signaling) message.|

## Signaling APIs

|API|Description|
|---------|---------|
|[AddSignalingListener](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#ad05971845c3daa32b5c3ceac33cd7440)|Adds a signaling listener.|
|[RemoveSignalingListener](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#aee990a20a262f205cfa6d5c8117a64c2)|Removes a signaling listener.|
|[Invite](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#a85e7fab6f656ff007fa1fae5400ff547)|Invites a user.|
|[InviteInGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#a4813ae9206eb27438293054a076e2441)|Invites certain users in the group.|
|[Cancel](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#a2e57c098f73789bf1a6ac0c2b916e6e0)|The inviter cancels the invitation.|
|[Accept](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#a714672da1a57c1006368650842fc5f29)|The invitee accepts the invitation.|
|[Reject](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#abd2c124577c39c0a992a34b54665cb9b)|The invitee rejects the invitation.|
|[GetSignalingInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#afc6d9c1e14e05f87e7ea108711095cb8)|Gets the signaling information.|
|[AddInvitedSignaling](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#adefac3df746100d0afaff911066bcd7f)|Adds invitation signaling (can be used for invitation signaling triggered by offline push messages for group invitations).|
|[ModifyInvitation](https://im.sdk.qcloud.com/doc/en/classV2TIMSignalingManager.html#a2777536d96c746cd4a831672fcbe6afe)|Modifies the invitation signaling.|

## Advanced Message APIs

If you need to send/receive rich media messages (such as image, video, and file messages) and use advanced features such as recalling messages, marking messages as read, and querying message history, use the following set of advanced message APIs. Do not use simple message APIs and advanced message APIs at the same time.

|API|Description|
|---------|---------|
|[AddAdvancedMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a498688ee0f672f114e28d830761dfbf8)|Sets an event listener for advanced messages. Do not use it and [AddSimpleMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad039bd93fe1a09cf45034697e1c1328f) at the same time.|
|[RemoveAdvancedMsgListener](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a7e27cbe3f0cc26e09de0bdee8b192bea)|Removes an event listener for advanced messages.|
|[CreateTextMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab96fac17ae7cb4d1e367dff40aa0694c)|Creates a text message.|
|[CreateTextAtMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#afa39182f419c621fc929eb3929206107)|Creates an @ text message.|
|[CreateCustomMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a580ce76a38da8a0c1a6963b1e7e95cac)|Creates a custom message.|
|[CreateCustomMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3af1cc2c76c41f3e48080134502ac8d5)|Creates a custom message (supports setting offline push information).|
|[CreateImageMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a1f066186491a282c98f9cf7296720775)|Creates an image message.|
|[CreateSoundMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a017a0c2902d045a70a9d5b686154984e)|Creates an audio message.|
|[CreateVideoMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#acdaefbfd8bd4826caa86c94a42d701a4)|Creates a video message.|
|[CreateFileMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a57e965e5e82477446b25253a1ae07110)|Creates a file message.|
|[CreateLocationMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a9bffc91ae3fa7ba6e330a2ffd325665a)|Creates a location message.|
|[CreateFaceMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a72c548e00aed06ef99aca1d55d5895c2)|Creates an emoji message.|
|[CreateMergerMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#afc00a2a85b3d29ccfc472ea6544eccf3)|Creates a combined forward message.|
|[CreateForwardMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aaff05e59893cb1cfe5a806e700e1e270)|Creates a single forward message.|
|[CreateTargetedGroupMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aceeef38fd6308e91154cdd8310c6012f)|Creates a targeted group message.|
|[CreateAtSignedGroupMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#af34abe1b5eac3df820a76e9710bc5fba)|Creates an @ group message.|
|[SendMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)|Sends a message. The message object can be created using a `CreateXXXMessage` API.|
|[SetC2CReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#adf166f08b68a5df8de19d152bcf868b3)|Sets the Mute Notifications option for one-to-one messages.|
|[GetC2CReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a30a4979460e73c897b6130ba40356afa)|Gets the Mute Notifications status for one-to-one messages.|
|[SetGroupReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a866d06c28faf058f253f29be6f5b3fe2)|Sets the Mute Notifications option for group messages.|
|[SetAllReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aa158b82be5ef2fdc24118a28cb232aec)|Sets the global message receiving option (supports setting do-not-disturb times for each day).|
|[SetAllReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#afe5d7d700c6d75cdbbb319f2de390c57)|Sets the global message receiving option.|
|[GetAllReceiveMessageOpt](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#af9db931afa6ad68a077e2169cae1a1a9)|Gets the global message receiving option of a logged-in user.|
|[GetHistoryMessageList](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4bbdbdd063d5dad2d164059e1f5d7851)|Gets message history.|
|[RevokeMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3f271fcb935ada0ef05709367638a1a6)|Recalls a message. The message object can be created using a `createXXXMessage` API.|
|[ModifyMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ae4123dd87276906605d8d4be6a56b5ad)|Modifies a message. The message object can be created using a `createXXXMessage` API.|
|[MarkC2CMessageAsRead](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a024f95bcf2b37a354f11f5b5a4d6920f)|Marks one-to-one (C2C) messages as read. (It is deprecated. Please call API [CleanConversationUnreadMessageCount](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a07c3643440d1ec96ede4a4e67e7b52a9) instead).|
|[MarkGroupMessageAsRead](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#abdf09c92dccfb71b58b8a36f42494b8d)|Marks group messages as read. (It is deprecated. Please call API [CleanConversationUnreadMessageCount](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a07c3643440d1ec96ede4a4e67e7b52a9) instead).|
|[MarkAllMessageAsRead](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a78aa9bd36291eb581a347a2cba96509a)|Marks all messages as read. (It is deprecated. Please call API [CleanConversationUnreadMessageCount](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a07c3643440d1ec96ede4a4e67e7b52a9) instead).|
|[DeleteMessages](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ac340e09d426d983fb4b6cf48d9a7ebca)|Deletes messages from local storage and the cloud.|
|[ClearC2CHistoryMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aade0f8d9a53a87473990714f17a297bc)|Clears chat history with a user from local storage and the cloud.|
|[ClearGroupHistoryMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a1207155633e3deb59616d4deb779d1eb)|Clears chat history of a group from local storage and the cloud.|
|[InsertGroupMessageToLocalStorage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a19813d01f229f5c1a413684b56c54e1b)|Inserts a message in a group chat.|
|[InsertC2CMessageToLocalStorage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#abba2adf81fa2bb457c14fffb9ae0eda4)|Inserts a message in a one-to-one chat.|
|[FindMessages](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ac5531e73378b8b8eadd056ba99e5427e)|Finds local messages by `msgID`.|
|[SearchLocalMessages](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a46be86c0177c868f03fc939c88e2e36d)|Searches for local messages.|
|[SearchCloudMessages](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab01326d278755b0968ca4c0bdb98d137)|Searches for cloud messages.|
|[SendMessageReadReceipts](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ae0a86a41d103c1722017d2f71b475cf2)|Sends message read receipts.|
|[GetMessageReadReceipts](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a73b488bb868db032a060de4282dd2547)|Gets message read receipts.|
|[GetGroupMessageReadMemberList](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a8b6ae2c30d173b6a5a4c99ebb3aecca9)|Gets the list of group members who have read group messages.|
|[setMessageExtensions](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a01d4d98b44f8b1dfdeff3abf1cd71d41)|Sets message extensions.|
|[getMessageExtensions](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a7d0ec9f6d4201d916eb2861b19443605)|Gets message extensions.|
|[deleteMessageExtensions](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a319ceed3323c5005b3630ef1598d5886)|Deletes message extensions.|
|[AddMessageReaction](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3c961027e9f295e472219116a3c8f90e)|Adds message reaction.|
|[RemoveMessageReaction](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4fa45bdf386beefc5544935eb6122649)|Deletes message reaction.|
|[GetMessageReactions](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4535e7faaba45905ec4b5d0a658935cb)|Gets message reactions.|
|[GetAllUserListOfMessageReaction](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3e08aab7b7c8468f7c7f1977e934f730)|Gets all users of message reactions by page.|
|[pinGroupMessage](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ace35ac347c02c608f5f61ce2a76599ad)|Sets group message pinning.|
|[getPinnedGroupMessageList](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a174f9f9595661f8229975f537fd741eb)|Gets pinned group message list.|

## Group APIs

Tencent Cloud Chat SDK supports the following preset group types, each of which pertains to different scenarios.
- Work group (Work): Users can join the group only after being invited by group members. This group is similar to ordinary WeChat groups.

- Public group (Public): Similar to QQ groups, users can join a public group through requests, which need to be approved by the group owner or group admin.

- Meeting group (Meeting): Used together with [TRTC](https://www.tencentcloud.com/products/trtc) to enable scenarios such as video conferencing and online education. Users can join and leave the group freely and view the message history before they join.

- Community: Community supports up to 100,000 members and a user can join and leave a community freely without approval. It is suitable for chat scenarios with a super large number of community members, such as knowledge sharing and game discussion. This feature is supported by a client with the SDK edition V5.8 or later. To use it, you need to purchase the [Pro edition, Pro Plus edition, Enterprise edition](https://trtc.io/buy/chat), and then log in to [**Console**](https://console.trtc.io/) > Chat > Function Configuration > [Group](https://console.trtc.io/chat/login-message). In the **Group Type Configuration** section, locate **Community** and **Enable community** toggle next to **Community Status** to activate this feature.

- Audio-video group (AVChatRoom): An audio-video group allows users to join and leave freely and is suitable for scenarios such as live streaming and chat rooms with on-screen comments. There is no limit on the number of group members.

   |API|Description|
   |---------|---------|
   |[AddGroupListener](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a05af3d083cef4d667cf972e0cf340289)|Adds an event listener for groups.|
   |[RemoveGroupListener](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a60fe2aac014661aeaf3cbbafaea830e3)|Removes an event listener for groups.|
   |[CreateGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a0325514b94a734186be684eb9bb5cc80)|Creates a simple group.|
   |[CreateGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ac28eb2db747a62a12fedc604a2abfbbd)|Creates an advanced group. The group information and the initial group members can be set during group creation.|
   |[JoinGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#adf3dc4604f30fde1d34dceb1990b38fe)|Joins a group.|
   |[QuitGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a43ef277f0eb49d6087d140a09152eced)|Leaves a group.|
   |[DismissGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#abfa30c09968c3b6d07c31d8d5a741502)|Disbands a group. Only the group owner and group admin can disband a group.|
   |[GetJoinedGroupList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a3b740704edfeab9602867e284c2c7ba8)|Gets the list of groups the current user has joined, excluding audio-video groups.|
   |[GetGroupsInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a8c98b92b45c3a2c4e57901e6c4cd3435)|Pulls the profiles of groups.|
   |[SearchGroups](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a63b463ce1a5952adf8d88bc794b32f22)|Search for local group profiles.|
   |[SearchCloudGroups](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#afce316958d6b3e25512b6d2e4e6a19ba)|Search for cloud group profiles.|
   |[SetGroupInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a10785c46e166879250c2c2ba2001b354)|Modifies the profile of a group.|
   |[InitGroupAttributes](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a049a490d04dde4cf925491809a6df6e2)|Initializes group attributes.|
   |[SetGroupAttributes](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a35accef15afd5def586332c7397cee7b)|Sets group attributes.|
   |[DeleteGroupAttributes](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#acdbc438459cfd970bd557a3b252db768)|Deletes group attributes.|
   |[GetGroupAttributes](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7e719bb36c782f56849a6b46bf2afab4)|Gets group attributes.|
   |[GetGroupOnlineMemberCount](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7633181ee22e54741600908ed45b3138)|Gets the number of online group members.|
   |[GetGroupMemberList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ade696bf03f06de9cdfb534570de35254)|Gets the group member list.|
   |[GetGroupMembersInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a6db2fcfd78bbd71003ae31584c88c672)|Gets the profiles of specified group members.|
   |[SearchGroupMembers](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a705a17828623117e51da885da02d8b12)|Search for local group members.|
   |[SearchCloudGroupMembers](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a1b162f6187a846c9ea05636c9135c59c)|Search for cloud group members.|
   |[SetGroupMemberInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#acd0e222e4c3d5997666aaf4126bd974e)|Modifies the profile of a specified group member.|
   |[MuteGroupMember](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ab19d433e5552205fcba61627e54f7569)|Mutes a group member.|
   |[MuteAllGroupMembers](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a746446022f8869942903c5e19d1a4c80)|Mutes all group members. It can be called only by the administrator or group owner.|
   |[KickGroupMember](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ad2e4f74f4e26fb0db455d8e92f774032)|Removes a member from a group.|
   |[KickGroupMember](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aca94e51e879a7fadbca24a0a991727d1))|Removes a member from a group (support setting a duration for prohibiting group joining).|
   |[SetGroupMemberRole](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ab429c1ded6aa3ae27bb0917be6f71dd3)|Sets a role for a group member.|
   |[markGroupMemberList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#abda7d60a02581930b2071cac01d41cfd)|Marks group members.|
   |[TransferGroupOwner](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a2fedff98e2e41e9d30f7a49f5c7adc8f)|Transfers the group ownership.|
   |[InviteUserToGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a46fecb95bf66ccc3023201fb3737c423)|Invites users to a group.|
   |[GetGroupApplicationList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a4609879f4c67fde60a6fa4f707987143)|Gets the list of requests to join a group.|
   |[AcceptGroupApplication](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ae829188e149f59bb5b086825f6c94ab5)|Approves a request to join a group.|
   |[RefuseGroupApplication](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7cf4cdc85fab3794399137726736571b)|Rejects a request to join a group.|
   |[SetGroupApplicationRead](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a25eeb7d946d9f0eec064dc2c4c6b17a6)|Marks the request list as read.|
   |[GetJoinedCommunityList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#af131f5f9aa08f7ba81fd9b5632e60e0d)|Gets the list of communities the current user has joined.|
   |[CreateTopicInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a4461759ad1c51eae318dfe5d478575c9)|Creates a topic.|
   |[DeleteTopicFromCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aadbe5002f65d5202da3b1b4e6180264d)|Deletes a topic.|
   |[SetTopicInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a128f08ef6e675d7c8fc96a5d124e59af)|Modifies topic information.|
   |[GetTopicInfoList](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7b2ffb5e2e526b7d30b2c8741380d0ac)|Gets the list of topics.|
   |[SetGroupCounters](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7d1499e0f99112bacbb8b5e23b25285a)|Sets group counters.|
   |[GetGroupCounters](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a4d627b72fef42e640ece749ea8fa8ccd)|Gets group counters.|
   |[IncreaseGroupCounter](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aad7d2b26a8948368d49405313b07aef9)|Increases the group counter.|
   |[DecreaseGroupCounter](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#acb406ccc5755b5e6fbb687dfc153201f)|Decreases the group counter.|

## Community Topic APIs

Community is used to manage group members. All topics under a community can not only share community members, but also send and receive messages independently without interfering with each other.

|API|Description|
|---------|---------|
|[AddCommunityListener](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a2c49110514485585cc4129862b54c875)|Adds an event listener for communities.|
|[RemoveCommunityListener](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a6c78aacab8178fba84aab218ffdfdf66)|Removes an event listener for communities.|
|[CreateCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a2187c4820a711feecfe20bf4fe141e7f)|Creates a community that supports a topic.|
|[GetJoinedCommunityList](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#af131f5f9aa08f7ba81fd9b5632e60e0d)|Gets the list of communities the current user has joined.|
|[CreateTopicInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a4461759ad1c51eae318dfe5d478575c9)|Creates a topic.|
|[DeleteTopicFromCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#aadbe5002f65d5202da3b1b4e6180264d)|Deletes a topic.|
|[SetTopicInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a128f08ef6e675d7c8fc96a5d124e59af)|Modifies topic information.|
|[GetTopicInfoList](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a7b2ffb5e2e526b7d30b2c8741380d0ac)|Gets the list of topics.|
|[CreatePermissionGroupInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a2707a4f2b24761c6cd48a52157ccf132)|Creates a community permission group.|
|[DeletePermissionGroupFromCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a1fb6abe06fe71cd17186a09926d6e39c)|Deletes a community permission group.|
|[ModifyPermissionGroupInfoInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ac9f666ee2047b02e4e588fe44548926a)|Modifies a community permission group.|
|[GetJoinedPermissionGroupListInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a0718b0a530e32ebef153773a80b81890)|Gets the list of community permission groups a user has joined.|
|[GetPermissionGroupListInCommunity](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a87a69b545b198a147ff7c97a36052989)|Gets a community permission group list.|
|[AddCommunityMembersToPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ad398f5fe6af474dc6a8ae9c5696ee2e7)|Adds members to a community permission group.|
|[RemoveCommunityMembersFromPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a0c47510d2fba0f97a41ce8b52d8e3b0d)|Removes members from a community permission group.|
|[GetCommunityMemberListInPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#aa7802decbbed3ef6efe4d5fff137a557)|Gets the list of community permission group members.|
|[AddTopicPermissionToPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a469f912625330ccf3b0313c5a6d49603)|Adds topic permission to the permission group.|
|[DeleteTopicPermissionFromPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ad03adcfeb7ca4733c00903e048b7b33d)|Deletes topic permission from the permission group.|
|[ModifyTopicPermissionInPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a18b10f54678477153f4737de6579f042)|Modifies the topic permission in the permission group.|
|[GetTopicPermissionInPermissionGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a473a78a20b7025472f6d413dc6d48196)|Gets the topic permission in the permission group.|

## Conversation List APIs

The conversation list is the list a user sees on the first screen after login. It includes elements such as conversation node, conversation name, group name, last message, and unread count.

|API|Description|
|---------|---------|
|[AddConversationListener](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#adb2c20ca824cac69d0703169f3a025a1)|Adds a conversation listener.|
|[RemoveConversationListener](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a0bcc8a8b6adbaaff227c970ccfad2a53)|Removes a conversation listener.|
|[GetConversationList](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#adf840d9f4eb800ff74a2a6852d56fc35)|Gets the conversation list.|
|[GetConversation](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a9891f4b029e7a1fd3d17398cbe1b367c)|Gets a conversation.|
|[GetConversationList](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a05675f2f0c00aedc2af7a2cd6cf2eb6b)|Gets multiple conversations.|
|[GetConversationListByFilter](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ace956492c5ee80187ebd1795e52b0de8)|Gets multiple conversations (support filtering based on conversation type, mark type, group name, etc.).|
|[ getConversationListByFilter](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ace956492c5ee80187ebd1795e52b0de8)|Gets the advanced conversation API to specify the conversation type, mark type, and group name.|
|[DeleteConversation](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a1ada2a3c1c0ae08920bdf16ab994a1ed)|Deletes a conversation.|
|[SetConversationDraft](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a0b84fd526690e21149b9d205512d1b49)|Sets a draft for a conversation.|
|[SetConversationCustomData](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a0b84fd526690e21149b9d205512d1b49)|Sets custom conversation data.|
|[PinConversation](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ab5afaa92ec352f112125f5dcef288f8d)|Pins a conversation to the top.|
|[MarkConversation](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ab8d1930cd9956457cd465bd23aa3bd63)|Marks a conversation.|
|[GetTotalUnreadMessageCount](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a50e0d25b7f47c12c815e610bf5b9a048)|Gets the total unread message count.|
|[CreateConversationGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ab2d52eebca186348cdc6d655e39303b2)|Creates a conversation group.|
|[GetConversationGroupList](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#afd90c81411d1ab6eeaea2eb7bb888954)|Gets the list of conversation groups.|
|[DeleteConversationGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a896e015bc43c459cf8b6d34665f201c6)|Deletes a conversation group.|
|[RenameConversationGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#aec1cf0ea82fc1a3e210d89f83bd06af8)|Renames a conversation group.|
|[AddConversationsToGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a31e93ef7ee2bbe8d665eb3b1f6520ed3)|Adds a conversation to a conversation group.|
|[DeleteConversationsFromGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#ad9b378df06d6b46031262e9712d82d6b)|Deletes a conversation from a conversation group.|
|[GetUnreadMessageCountByFilter](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a5a569ee64dc582e01865cd5ebfc9fbe3)|Gets the total unread message count of conversations by filter.|
|[SubscribeUnreadMessageCountByFilter](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a39feb1af6519c85b0477b0244ec15b25)|Subscribes to notification of total unread message count for conversations specified by filter.|
|[UnsubscribeUnreadMessageCountByFilter](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a8b8bf0ed2575efdc08f0b6a7e04faafa)|Unsubscribes from notification of total unread message count for conversations specified by filter.|

## User Profile APIs

You can use the following APIs to query user profiles, modify your profile, and block messages from a specified user (that is, adding a specified user to the blocklist).

|API|Description|
|---------|---------|
|[GetUsersInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ac7aa404aec07fc0d9823d9da5fd4e443)|Gets user profiles.|
|[SetSelfInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#acb89663576c7f68cc4b9983733835e29)|Modifies one's own user profile.|
|[SubscribeUserInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a211e335c9ea2188db1596347abec825e)|Subscribes to a user's profile.|
|[UnsubscribeUserInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aa9888ebe50dc33f007da9bd40ad6c3df)|Unsubscribes from a user's profile.|
|[GetUserStatus](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a56a7968dcb6f676c8aebd52d0fffbb30)|Queries a user's status.|
|[SetSelfStatus](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aa93c93f1a3ce5d7802febc0e550cf743)|Sets one's own status.|
|[SubscribeUserStatus](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6485ab30f0025998ffeecb78490332f5)|Subscribes to a user's status.|
|[UnsubscribeUserStatus](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a7e62b89e6ad2d164458afa24f379530c)|Unsubscribes from a user's status.|
|[SearchUsers](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6846339829066fec9fc4d6d72e01d5a0)|Search cloud users.|
|[AddToBlackList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a2f49378d21cb0d48b9e1e1814dc2460e)|Blocks messages from a user, which means adding the user to the blocklist.|
|[DeleteFromBlackList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a8bacf997892119e021a8f4aa4db48de3)|Unblocks messages from a user, which means removing the user from the blocklist.|
|[GetBlackList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a8d402bd222d8dcb98516185bd75fc5b2)|Gets the blocklist.|

## Friend Management APIs

Tencent Cloud Chat SDK does not check friend relationships by default when sending and receiving messages. To achieve the interactive experience of "add friends first, then send messages", you can log in to the [Console](https://console.trtc.io/) to modify Relationship Check. When enabled, users can only send messages to their friends. When a user sends a message to a non-friend, SDK will report a 20009 error code. The configuration path is: Applications > Your App > Chat > Configuration > Login and Message > Relationship Check.

Use the following API to add or delete friends and manage friend lists.

|API|Description|
|---------|---------|
|[AddFriendListener](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ac4c542617008471fa1fe7a64ba963fbb)|Adds a contacts listener.|
|[RemoveFriendListener](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae21ca2737c35305ecc1f25e054265ed8)|Removes a contacts listener.|
|[GetFriendList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a11bcb462e073ebec63a2586bad9757cf)|Gets the contacts.|
|[GetFriendsInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9b263f612a1e7e35ee2c745b5f36a1e3)|Gets the profiles of specified friends.|
|[SetFriendInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#abe9169909b008fd0a43044356e3206a0)|Sets the profile of a specified friend.|
|[SearchFriends](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aea84cd163665db3b0f2338d787446f53)|Searches for friends.|
|[AddFriend](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a47ae7c54faf0b4b0f1d0a14fe7ed27d3)|Adds a friend.|
|[DeleteFromFriendList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae46d0b7f89dac1867de915b7fed3b479)|Deletes a friend.|
|[CheckFriend](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a90046f679ca31dedc00bbecff065538f)|Checks relationship with specified users.|
|[GetFriendApplicationList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aad42cc5d8f5c7abf3c2710697c29a9f9)|Gets the list of friend requests.|
|[AcceptFriendApplication](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9cfb992e1c1b958208f3c1b48a6b336d)|Accepts a friend request.|
|[RefuseFriendApplication](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a333de917766b6999e819eafc0513bf6f)|Rejects a friend request.|
|[DeleteFriendApplication](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a1243005c5ff2032c34dc8f3adf22f11d)|Deletes a friend request.|
|[SetFriendApplicationRead](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a91f8045a48c78a8da493f67188078baf)|Marks a friend request as read.|
|[CreateFriendGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a8f4192055ef6b4d85e01983a6369f0d4)|Creates a friend list.|
|[GetFriendGroups](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a3190b203cda3e1cabb947aded25c6354)|Gets the information of friend lists.|
|[DeleteFriendGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aef0784eca4e5c17d5ef12da5788338b6)|Deletes friend lists.|
|[RenameFriendGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a74ada64658763bc5eb7f918993e15649)|Modifies the name of a friend list.|
|[AddFriendsToFriendGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a6bb688a4a82c1bc158a7873eda738c2f)|Adds friends to a friend list.|
|[DeleteFriendsFromFriendGroup](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a0d9d90dc372d82b07a79fe5e843f3ab6)|Deletes friends from a friend list.|

## Official Account APIs

Official accounts can send broadcast messages and one-to-one (C2C) messages to subscribers.

|API|Description|
|---------|---------|
|[SubscribeOfficialAccount](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#acd9d723adfae0b7c5ce970d2bf76231f)|Subscribes to an official account.|
|[UnsubscribeOfficialAccount](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aa186fbc476e0df01780661ec75eef2cf)|Unsubscribes from an official account.|
|[GetOfficialAccountsInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae2e75fc190c4a2eb24e0bced5fe9e576)|Gets a list of official accounts.|

## Follow Feature APIs

The follow feature can help establish and maintain simple connections between users, facilitating interaction and communication among them.

|API|Description|
|---------|---------|
|[FollowUser](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a39f35431406db3697007930b45ea4011)|Follows users.|
|[UnfollowUser](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a2a90ac9b89c3fcaab35693cfdb3dec96)|Unfollows users.|
|[GetMyFollowingList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ad48c98a81a2ecec39ac106bbc8e50f1e)|Gets my following user list.|
|[GetMyFollowersList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aed1be73c9989cb751a884676a6769a78)|Gets my follower list.|
|[GetMutualFollowersList](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aeba0bf5e71b28c6f5ca27d063243fd3a)|Gets my mutual following user list.|
|[GetUserFollowInfo](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#afdf4e500355abbe24c1cdb33147f3b62)|Gets the information of followings/followers/mutual followings of a specified user.|
|[CheckFollowType](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9b401a8e3613a04cfd48f15a5c0f60be)|Checks the follow type of a specified user.|

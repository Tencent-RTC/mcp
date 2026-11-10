---
sync_node_id: '141208633667538944'
nav_path:
  - "客户端 API"
  - "C 接口"
product: "chat"
---
## SDK Initialization APIs

To use the Tencent Cloud Chat service, you need to initialize the SDK and log in.

|API|Description|
|---------|---------|
|`TIMInit`|Initializes the IM SDK.|
|`TIMUninit`|Uninstalls the IM SDK.|
|`TIMGetSDKVersion`|Gets IM SDK version number.|
|`TIMGetServerTime`|Gets the current server time.|
|`TIMSetConfig`|Sets extra user configurations.|

## Login and Logout APIs

|API|Description|
|---------|---------|
|`TIMLogin`|Logs in.|
|`TIMLogout`|Logs out.|
|`TIMGetLoginUserID`|Gets the `userID` of the logged-in user.|
|`TIMGetLoginStatus`|Gets the login status.|

## Message APIs

|API|Description|
|---------|---------|
|`TIMMsgSendMessage`|Sends a new message|
|`TIMMsgCancelSend`|Cancels a message based on the `messageID`.|
|`TIMMsgBatchSend`|Sends a message to multiple users at a time, but not to groups.|
|`TIMMsgDownloadElemToPath`|Downloads message elements (such as the image, video, audio, and file) to a path.|
|`TIMMsgDownloadMergerMessage`|Downloads a merged message.|
|`TIMMsgSetLocalCustomData`|Sets custom message data (saved locally, not sent to the peer, and invalidated upon app reinstallation).|
|`TIMMsgSetC2CReceiveMessageOpt`|Sets the one-to-one message receiving option for a user (batch setting supported).|
|`TIMMsgGetC2CReceiveMessageOpt`|Queries the one-to-one message receiving option for a user.|
|`TIMMsgSetGroupReceiveMessageOpt`|Sets the receiving option for group messages.|
|`TIMMsgSetAllReceiveMessageOpt`|Sets the global message receiving option for a logged-in user (supports setting do-not-disturb times for each day).|
|`TIMMsgSetAllReceiveMessageOpt2`|Sets the global message receiving option for a logged-in user.|
|`TIMMsgGetAllReceiveMessageOpt`|Gets the global message receiving option of a logged-in user.|
|`TIMMsgGetMsgList`|Gets the message list of a conversation.|
|`TIMMsgRevoke`|Recalls a message.|
|`TIMMsgModifyMessage`|Modifies a message.|
|`TIMMsgDelete`|Deletes the messages of a conversation.|
|`TIMMsgListDelete`|Deletes the local and roaming message lists of a conversation.|
|`TIMMsgClearHistoryMessage`|Clears the messages of a conversation.|
|`TIMMsgSaveMsg`|Saves a custom message.|
|`TIMMsgImportMsgList`|Imports a message list to a conversation.|
|`TIMMsgFindMessages`|Queries the list of local messages based on the `messageID`.|
|`TIMMsgFindByMsgLocatorList`|Locates a message of a conversation by using the message locator.|
|`TIMMsgSearchLocalMessages`|Searches for local messages.|
|`TIMMsgSearchCloudMessages`|Searches for cloud messages.|
|`TIMMsgSendMessageReadReceipts`|Sends message read receipts.|
|`TIMMsgGetMessageReadReceipts`|Gets message read receipts.|
|`TIMMsgGetGroupMessageReadMemberList`|Gets the list of group members who have read group messages.|
|`TIMMsgSetMessageExtensions`|Sets message extensions.|
|`TIMMsgGetMessageExtensions`|Gets message extensions.|
|`TIMMsgDeleteMessageExtensions`|Deletes message extensions.|
|`TIMMsgAddMessageReaction`|Adds message reaction.|
|`TIMMsgRemoveMessageReaction`|Deletes message reaction.|
|`TIMMsgGetMessageReactions`|Gets message reactions.|
|`TIMMsgGetAllUserListOfMessageReaction`|Gets the users who respond with the specified message by page.|
|`TIMMsgTranslateText`|Translates a text message.|
|`TIMPinGroupMessage`|Sets group message pinning.|
|`TIMGetPinnedMessageList`|Gets the pinned group message list.|

## Conversation APIs

The conversation list is the list a user sees on the first screen after login. It includes elements such as the conversation node, conversation name, group name, last message, and unread count.

|API|Description|
|---------|---------|
|`TIMConvGetConvList`|Gets the conversation list.|
|`TIMConvGetConvInfo`|Queries a list of conversations.|
|`TIMConvGetConversationListByFilter`|An advanced API for getting the conversation list.|
|`TIMConvDelete`|Deletes a conversation.|
|`TIMConvDeleteConversationList`|Deletes the conversation list.|
|`TIMConvSetDraft`|Sets the draft for a conversation.|
|`TIMConvCancelDraft`|Deletes the draft for a conversation.|
|`TIMConvSetConversationCustomData`|Sets custom conversation data.|
|`TIMConvPinConversation`|Pins a conversation to the top.|
|`TIMConvMarkConversation`|Marks a conversation.|
|`TIMConvGetTotalUnreadMessageCount`|Gets the total unread message count of all conversations.|
|`TIMConvGetUnreadMessageCountByFilter`|Gets the total unread message count by filter.|
|`TIMConvSubscribeUnreadMessageCountByFilter`|Subscribes to notification of total unread message count for conversations specified by filter.|
|`TIMConvUnsubscribeUnreadMessageCountByFilter`|Unsubscribes from notification of total unread message count for conversations specified by filter.|
|`TIMConvCleanConversationUnreadMessageCount`|Cleans up the unread message count of the conversation.|
|`TIMConvCreateConversationGroup`|Creates a conversation group.|
|`TIMConvGetConversationGroupList`|Gets the list of conversation groups.|
|`TIMConvDeleteConversationGroup`|Deletes a conversation group.|
|`TIMConvRenameConversationGroup`|Renames a conversation group.|
|`TIMConvAddConversationsToGroup`|Adds a conversation to a conversation group.|
|`TIMConvDeleteConversationsFromGroup`|Deletes conversations from a group.|

## Group APIs

Tencent Cloud Chat SDK supports five preset group types, each of which pertains to different scenarios.
- Work group (Work): users can join the group only after being invited by group members. This group type is the same as private group (Private) in earlier versions.

- Public group (Public): Users can join a public group through requests, which need to be approved by the group owner or group admin.

- Meeting group (Meeting): used together with [TRTC](https://trtc.io/document) to enable scenarios such as video conferencing and online education. Users can join and leave the group freely and view the message history before they join. Same as chat room (ChatRoom) in earlier versions.

- Community: A user can join and leave a community freely. It is suitable for chat scenarios with a super large number of community members, such as knowledge sharing and game discussion. This feature is supported by a client with the SDK enhanced edition v5.8.1668 or later and the web SDK v2.17.0 or later. To use it, you need to purchase the [Pro edition, Pro Plus edition, Enterprise edition](https://trtc.io/buy/chat), and then log in to [**Console**](https://console.trtc.io/) > Chat > Function Configuration > [Group](https://console.trtc.io/chat/login-message). In the **Group Type Configuration** section, locate **Community** and **Enable community** toggle next to **Community Status** to activate this feature.

- Audio-video group (AVChatRoom): An audio-video group allows users to join and leave freely and is suitable for scenarios such as live streaming and chat rooms with on-screen comments. There is no limit on the number of group members.

   |API|Description|
   |---------|---------|
   |`TIMGroupCreate`|Creates a group.|
   |`TIMGroupDelete`|Deletes or dissolves a group.|
   |`TIMGroupJoin`|Requests to join a group.|
   |`TIMGroupQuit`|Quits a group.|
   |`TIMGroupGetJoinedGroupList`|Gets the list of groups that a user has joined.|
   |`TIMGroupGetGroupInfoList`|Gets group information.|
   |`TIMGroupSearchGroups`|Searches for local groups.|
   |`TIMGroupSearchCloudGroups`|Searches for cloud groups.|
   |`TIMGroupModifyGroupInfo`|Modifies group information.|
   |`TIMGroupInitGroupAttributes`|Initializes the group attributes to clear the existing group attribute list.|
   |`TIMGroupSetGroupAttributes`|Sets group attributes. If a group attribute already exists, its value will be updated; otherwise, it will be added.|
   |`TIMGroupDeleteGroupAttributes`|Deletes group attributes.|
   |`TIMGroupGetGroupAttributes`|Gets a specified group attribute. If `NULL` is passed in for `json_keys`, all the group attributes will be obtained.|
   |`TIMGroupGetOnlineMemberCount`|Gets the number of online members in a group.|
   |`TIMGroupSetGroupCounters`|Sets group counters.|
   |`TIMGroupGetGroupCounters`|Gets group counters.|
   |`TIMGroupIncreaseGroupCounter`|Increases the group counter.|
   |`TIMGroupDecreaseGroupCounter`|Decreases the group counter.|
   |`TIMGroupGetJoinedCommunityList`|Gets the list of communities the current user has joined.|
   |`TIMGroupCreateTopicInCommunity`|Creates a topic.|
   |`TIMGroupDeleteTopicFromCommunity`|Deletes a topic.|
   |`TIMGroupSetTopicInfo`|Modifies topic information.|
   |`TIMGroupGetTopicInfoList`|Gets the list of topics.|
   |`TIMGroupGetMemberInfoList`|Gets group member information.|
   |`TIMGroupSearchGroupMembers`|Searches for local group members.|
   |`TIMGroupSearchCloudGroupMembers`|Searches for cloud group members.|
   |`TIMGroupModifyMemberInfo`|Modifies group member information.|
   |`TIMGroupInviteMember`|Invites someone to join a group.|
   |`TIMGroupDeleteMember`|Removes a member from a group.|
   |`TIMGroupMarkGroupMemberList`|Marks group members.|
   |`TIMGroupGetPendencyList`|Gets the pending group request list.(Pending group requests are those that are not handled, for example, invitations or requests to join a group.)|
   |`TIMGroupHandlePendency`|Handles pending group requests.|
   |`TIMGroupReportPendencyReaded`|Reports that a pending group request is read.|

## Community Topic APIs

|API|Description|
|---------|---------|
|`TIMCommunityCreate`|Creates a community that supports a topic.|
|`TIMCommunityGetJoinedCommunityList`|Gets the list of communities the current user has joined.|
|`TIMCommunityCreateTopicInCommunity` |Creates a topic.|
|`TIMCommunityDeleteTopicFromCommunity`|Deletes a topic.|
|`TIMCommunitySetTopicInfo`|Modifies topic information.|
|`TIMCommunityGetTopicInfoList`|Gets the list of topics.|
|`TIMCommunityCreatePermissionGroupInCommunity`|Creates a community permission group.|
|`TIMCommunityDeletePermissionGroupFromCommunity`|Deletes a community permission group.|
|`TIMCommunityModifyPermissionGroupInfoInCommunity`|Modifies a community permission group.|
|`TIMCommunityGetJoinedPermissionGroupListInCommunity`|Gets the list of community permission groups a user has joined.|
|`TIMCommunityGetPermissionGroupListInCommunity`|Gets a community permission group list.|
|`TIMCommunityAddCommunityMembersToPermissionGroup`|Adds members to a community permission group.|
|`TIMCommunityRemoveCommunityMembersFromPermissionGroup`|Removes members from a community permission group.|
|`TIMCommunityGetCommunityMemberListInPermissionGroup`|Gets the list of community permission group members.|
|`TIMCommunityAddTopicPermissionToPermissionGroup`|Adds topic permission to the permission group.|
|`TIMCommunityDeleteTopicPermissionFromPermissionGroup`|Deletes topic permission from the permission group.|
|`TIMCommunityModifyTopicPermissionInPermissionGroup`|Modifies the topic permission in the permission group.|
|`TIMCommunityGetTopicPermissionInPermissionGroup`|Gets the topic permission in the permission group.|

## User Profile APIs

|API|Description|
|---------|---------|
|`TIMProfileGetUserProfileList`|Gets users' profiles.|
|`TIMProfileModifySelfUserProfile`|Modifies one's own profile.|
|`TIMSubscribeUserInfo`|Subscribes to a stranger's profile.|
|`TIMUnsubscribeUserInfo`|Unsubscribes from a stranger's profile.|
|`TIMSearchUsers`|Search for cloud users|

## User Status APIs

|API|Description|
|---------|---------|
|`TIMGetUserStatus`|Gets user status information.|
|`TIMSetSelfStatus`|Sets one's own status.|
|`TIMSubscribeUserStatus`|Subscribes to a user's status.|
|`TIMUnsubscribeUserStatus`|Unsubscribes from a user's status.|

## Friend Management APIs

Tencent Cloud Chat SDK does not check friend relationships by default when sending and receiving messages. To achieve the interactive experience of "add friends first, then send messages", you can log in to [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Under this section, enable **Stranger Direct Message Restrictions**. When this option is activated, only friends can send messages to each other. If a user tries to send a message to someone who is not their friend, the SDK returns [error code 20009](https://intl.cloud.tencent.com/document/product/1047/34348).

Use the following API to add or delete friends and manage friend lists.

|API|Description|
|---------|---------|
|`TIMFriendshipGetFriendProfileList`|Gets the contacts.|
|`TIMFriendshipGetFriendsInfo`|Gets information of friends.|
|`TIMFriendshipModifyFriendProfile`|Updates the profile of a friend (such as remarks).|
|`TIMFriendshipSearchFriends`|Searches for a friend.|
|`TIMFriendshipAddFriend`|Adds a friend.|
|`TIMFriendshipDeleteFriend`|Deletes a friend.|
|`TIMFriendshipCheckFriendType`|Checks the friend type (one-way or two-way).|
|`TIMFriendshipGetPendencyList`|Gets the pending friend request list.|
|`TIMFriendshipHandleFriendAddRequest`|Handles friend requests.|
|`TIMFriendshipReportPendencyReaded`|Reports that a pending friend request is read.|
|`TIMFriendshipDeletePendency`|Deletes a pending friend request.|
|`TIMFriendshipGetBlackList`|Gets the blocklist.|
|`TIMFriendshipAddToBlackList`|Adds a user to the blocklist.|
|`TIMFriendshipDeleteFromBlackList`|Removes a user from the blocklist.|
|`TIMFriendshipCreateFriendGroup`|Creates a friend group.|
|`TIMFriendshipGetFriendGroupList`|Gets the information of a friend group.|
|`TIMFriendshipDeleteFriendGroup`|Deletes a friend group.|
|`TIMFriendshipModifyFriendGroup`|Modifies a friend group.|

## Official Account APIs

Official accounts can send broadcast messages and one-to-one (C2C) messages to subscribers.

|API|Description|
|---------|---------|
|`TIMSubscribeOfficialAccount`|Subscribes to an official account.|
|`TIMUnsubscribeOfficialAccount`|Unsubscribes from an official account.|
|`TIMGetOfficialAccountsInfo`|Gets a list of official accounts.|

## Follow Feature APIs

The follow feature can help establish and maintain simple connections between users, facilitating interaction and communication among them.

|API|Description|
|---------|---------|
|`TIMFollowUser`|Follows users.|
|`TIMUnfollowUser`|Unfollows users.|
|`TIMGetMyFollowingList`|Gets my following user list.|
|`TIMGetMyFollowersList`|Gets my follower list.|
|`TIMGetMutualFollowersList`|Gets my mutual following user list.|
|`TIMGetUserFollowInfo`|Gets the information of followings/followers/mutual followings of a specified user.|
|`TIMCheckFollowType`|Checks the follow type of a specified user.|

## Offline Push APIs

|API|Description|
|---------|---------|
|`TIMMsgSetOfflinePushToken`|Sets offline push configuration information (for iOS and Android platforms only).|
|`TIMMsgDoBackground`|Specifies the initial unread count on the desktop badge (for iOS and Android platforms only). This API can be called when the app detects that the app switches to the background.|
|`TIMMsgDoForeground`|Called when the app detects that the app switches to the foreground (for iOS and Android platforms only).|

## Signaling APIs

|API|Description|
|---------|---------|
|`TIMSignalingInvite`|Invites a user.|
|`TIMSignalingInviteInGroup`|Invites certain users in the group.|
|`TIMSignalingCancel`|Cancels an invitation.|
|`TIMSignalingAccept`|Accepts an invitation.|
|`TIMSignalingReject`|Rejects an invitation.|
|`TIMGetSignalingInfo`|Gets the signaling information.|
|`TIMSignalingModifyInvitation`|Modifies the invitation signaling.|

## Event Callback APIs

### IM SDK initialization and login callback APIs

|API|Description|
|---------|---------|
|`TIMSetNetworkStatusListenerCallback`|Sets the callback for network connection status.|
|`TIMSetKickedOfflineCallback`|Sets the callback for forced logout.|
|`TIMSetUserSigExpiredCallback`|Sets the callback for user ticket expiration.|
|`TIMSetLogCallback`|Sets the callback for logs.|

### Message callback APIs

|API|Description|
|---------|---------|
|`TIMAddRecvNewMsgCallback`|Adds the callback for receiving new messages.|
|`TIMRemoveRecvNewMsgCallback`|Deletes the callback for receiving new messages.|
|`TIMSetMsgElemUploadProgressCallback`|Sets the callback for the upload progress of message element files.|
|`TIMSetMsgReadedReceiptCallback`|Sets the callback for message read receipts.|
|`TIMSetMsgRevokeCallback`|Sets the callback for message recalls.|
|`TIMSetMsgUpdateCallback`|Sets the callback for message update notifications returned after messages are modified in the cloud.|
|`TIMSetMsgExtensionsChangedCallback`|Sets the callback for message extension changes.|
|`TIMSetMsgExtensionsDeletedCallback`|Sets the callback for message extension deletion.|
|`TIMSetMsgReactionsChangedCallback`|Sets the callback for message reaction changes.|
|`TIMSetMsgAllMessageReceiveOptionCallback`|Sets the callback for the global message receiving option.|

### Conversation callback APIs

|API|Description|
|---------|---------|
|`TIMSetConvEventCallback`|Sets the callback for conversation events.|
|`TIMSetConvTotalUnreadMessageCountChangedCallback`|Sets the callback for changes in the unread message count of a conversation.|
|`TIMSetConvUnreadMessageCountChangedByFilterCallback`|Sets the callback for changes in the unread message count of filtered conversations.|
|`TIMSetConvConversationGroupCreatedCallback`|Sets the callback for conversation group creation.|
|`TIMSetConvConversationGroupDeletedCallback`|Sets the callback for conversation group deletion.|
|`TIMSetConvConversationGroupNameChangedCallback`|Sets the callback for a conversation group name change.|
|`TIMSetConvConversationsAddedToGroupCallback`|Sets the callback for adding a conversation to a conversation group.|
|`TIMSetConvConversationsDeletedFromGroupCallback`|Sets the callback for deleting a conversation from a conversation group.|

### Group callback APIs

|API|Description|
|---------|---------|
|`TIMSetGroupTipsEventCallback`|Sets the callback for group system messages.|
|`TIMSetGroupAttributeChangedCallback`|Sets the callback for a group attribute change.|
|`TIMSetGroupCounterChangedCallback`|Sets the callback for a group counter change.|
|`TIMSetGroupTopicCreatedCallback`|Sets the callback for group topic creation.|
|`TIMSetGroupTopicDeletedCallback`|Sets the callback for group topic deletion.|
|`TIMSetGroupTopicChangedCallback`|Sets the callback for group topic changes.|

### Community topic callback APIs

|API|Description|
|---------|---------|
|`TIMSetCommunityCreateTopicCallback`|Sets the callback for community topic creation.|
|`TIMSetCommunityDeleteTopicCallback`|Sets the callback for community topic deletion.|
|`TIMSetCommunityChangeTopicInfoCallback`|Sets the callback for community topic changes.|
|`TIMSetCommunityReceiveTopicRESTCustomDataCallback`|Sets the callback for the topic custom system messages pushed by REST API.|
|`TIMSetCommunityCreatePermissionGroupCallback`|Sets the callback for permission group creation.|
|`TIMSetCommunityDeletePermissionGroupCallback`|Sets the callback for permission group deletion.|
|`TIMSetCommunityChangePermissionGroupInfoCallback`|Sets the callback for permission group information changes.|
|`TIMSetCommunityAddMembersToPermissionGroupCallback`|Sets the callback for adding a member to the permission group.|
|`TIMSetCommunityRemoveMembersFromPermissionGroupCallback`|Sets the callback for removing a member from the permission group.|
|`TIMSetCommunityAddTopicPermissionCallback`|Sets the callback for adding a topic permission to the permission group.|
|`TIMSetCommunityDeleteTopicPermissionCallback`|Sets the callback for deleting a topic permission from the permission group.|
|`TIMSetCommunityModifyTopicPermissionCallback`|Sets the callback for modifying a topic permission in the permission group.|

### User profile and status callback APIs

|API|Description|
|---------|---------|
|`TIMSetSelfInfoUpdatedCallback`|Sets the callback for one's own profile changes.|
|`TIMSetUserStatusChangedCallback`|Sets the callback for user status changes.|
|`TIMSetUserInfoChangedCallback` |Sets the callback for subscriber profile changes.|

### Friend callback APIs

|API|Description|
|---------|---------|
|`TIMSetOnAddFriendCallback`|Sets the callback for adding friends.|
|`TIMSetOnDeleteFriendCallback`|Sets the callback for deleting friends.|
|`TIMSetUpdateFriendProfileCallback`|Sets the callback for updating friends' profiles.|
|`TIMSetFriendAddRequestCallback`|Sets the callback for friend requests.|
|`TIMSetFriendApplicationListDeletedCallback`|Sets the callback for deleting a friend request.|
|`TIMSetFriendApplicationListReadCallback`|Sets the callback for reading a friend request.|
|`TIMSetFriendBlackListAddedCallback`|Sets the callback for adding a friend to the blocklist.|
|`TIMSetFriendBlackListDeletedCallback`|Sets the callback for removing a friend from the blocklist.|
|`TIMSetFriendGroupCreatedCallback`|Sets the callback for friend group creation.|
|`TIMSetFriendGroupDeletedCallback`|Sets the callback for friend group deletion.|
|`TIMSetFriendGroupNameChangedCallback`|Sets the callback for a friend group name change.|
|`TIMSetFriendsAddedToGroupCallback`|Sets the callback for adding a friend to a friend group.|
|`TIMSetFriendsDeletedFromGroupCallback`|Sets the callback for deleting a friend from a friend group.|

### Official account callback APIs

|API|Description|
|---------|---------|
|`TIMSetOfficialAccountSubscribedCallback`|Sets the callback for subscribing to an official account.|
|`TIMSetOfficialAccountUnsubscribedCallback`|Sets the callback for unsubscribing from an official account.|
|`TIMSetOfficialAccountDeletedCallback`|Sets the callback for deleting an official account.|
|`TIMSetOfficialAccountInfoChangedCallback`|Sets the callback for subscribed official account information changes.|

### Follow feature callback APIs

|API|Description|
|---------|---------|
|`TIMSetMyFollowingListChangedCallback`|Sets the callback for my following list changes.|
|`TIMSetMyFollowersListChangedCallback`|Sets the callback for my followers list changes.|
|`TIMSetMutualFollowersListChangedCallback`|Sets the callback for mutual following list changes.|

### Signaling callback APIs

|API|Description|
|---------|---------|
|`TIMSetSignalingReceiveNewInvitationCallback`|Sets the callback for receiving a new invitation.|
|`TIMSetSignalingInvitationCancelledCallback`|Sets the callback for canceling an invitation.|
|`TIMSetSignalingInviteeAcceptedCallback`|Sets the callback for accepting an invitation by invitees.|
|`TIMSetSignalingInviteeRejectedCallback`|Sets the callback for rejecting an invitation by invitees.|
|`TIMSetSignalingInvitationTimeoutCallback`|Sets the callback for an invitation timeout.|
|`TIMSetSignalingInvitationModifiedCallback`|Sets the callback for modifying an invitation.|

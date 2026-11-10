---
sync_node_id: '108053212138348544'
nav_path:
  - "客户端 API"
  - "React Native"
product: "chat"
---
### TencentCloudChat

`TencentCloudChat` is the namespace of the Chat JavaScript SDK and provides the static method `create()` for creating SDK instances, the event constant `EVENT`, and the type constant `TYPES`, and the signaling constant `TSignaling`.

### **Initialization**

|API|Description|
|---------|---------|
|[create](https://trtc.io/document/47967)|Creates an SDK instance.|

### SDK Instance
| Term | Description |
| --- | --- |
| <a href="https://trtc.io/document/47990?platform=javascript&product=chat&menulabel=sdk">Message</a> | <code>Message</code> indicates the content to be sent and carries multiple attributes which specify whether you are the sender, the sender account, the message generation time, and so on. |
| <a href="https://trtc.io/document/48328?platform=javascript&product=chat&menulabel=sdk">Conversation</a> | Two types of conversation are available:<br>- Client to Client (C2C): A one-to-one chat, involving only two participants.<br>- GROUP: A group chat, involving more than two participants. |
| <code>Profile</code> | <code>Profile</code> describes the basic information of a user, including the nickname, gender, personal signature, and profile photo URL. |
| <code>Friend</code> | <code>Friend</code> describes the basic information of a friend, including the remarks and friend list. |
| <code>FriendApplication</code> | <code>FriendApplication</code> describes the basic information of a friend request, including the friend source and remarks. |
| <code>FriendGroup</code> | <code>FriendGroup</code> describes the basic information of a friend group, including the friend group name and members. |
| <code>Group</code> | <code>Group</code> indicates a communication system for group chatting, including Work Group, Public Group, Meeting Group, Audio-Video Group, and Community Group. |
| <code>GroupMember</code> | <code>GroupMember</code> indicates the basic information of each group member, such as the ID, nickname, role, and the time of joining the group. |
| <code>Group tip</code> | A group tip is generated when an event such as adding or deleting group member occurs. The access side can configure whether to display group tips to group members. |
| <code>Group system message</code> | For example, when a user requests to join a group, the group admin receives a system message. After the admin accepts or rejects the request, the Chat SDK returns the result to the access side, which then displays the result to the user. |
| <code>Message display on screen</code> | The sent messages, including text segments and images, are displayed on the computer or phone screen. |

### Event

|API|Description|
|---------|---------|
|[on](https://trtc.io/document/47967)|Enables event listening.|
|[off](https://trtc.io/document/47967)|Disables event listening.|

### Plugin registration

|API|Description|
|---------|---------|
|[registerPlugin](https://trtc.io/document/34309)|Registers a plugin.|

### Setting log level

|API|Description|
|---------|---------|
|[setLogLevel](https://trtc.io/document/34309)|Sets the log level. Logs below this level will not be printed.|

### SDK instance termination

|API|Description|
|---------|---------|
|[destroy](https://trtc.io/document/47967)|Terminates an SDK instance. The SDK will log out, disconnect the WebSocket persistent connection, and then release resources.|

### Login

|API|Description|
|---------|---------|
|[login](https://trtc.io/document/47970)|Logs in to the Chat SDK using userID and userSig.|
|[logout](https://trtc.io/document/47970)|Logs out to the Chat SDK.|
|[isReady](https://trtc.io/document/47970)|Indicates the SDK enter the ready state or not.|
|[getLoginUser](https://trtc.io/document/47970)|Get the userID of the logged-in user. If the user is not logged in, it returns an empty string ('').|
|[getServerTime](https://trtc.io/document/47970)|Get the server time.|

### Message

|API|Description|
|---------|---------|
|[createTextMessage](https://trtc.io/document/47993)|Creates a text message.|
|[createTextAtMessage](https://trtc.io/document/47993)|Creates a text message with the @ notification feature.|
|[createImageMessage](https://trtc.io/document/47993)|Creates an image message.|
|[createAudioMessage](https://trtc.io/document/47993)|Creates an audio message.|
|[createVideoMessage](https://trtc.io/document/47993)|Creates a video message.|
|[createCustomMessage](https://trtc.io/document/47993)|Creates a custom message.|
|[createFaceMessage](https://trtc.io/document/47993)|Creates an emoji message.|
|[createFileMessage](https://trtc.io/document/47993)|Creates a file message.|
|[createLocationMessage](https://trtc.io/document/47993)|Creates a location message.|
|[createMergerMessage](https://trtc.io/document/47993)|Creates a combined message.|
|[downloadMergerMessage](https://trtc.io/document/47993)|Downloads a combined message.|
|[createForwardMessage](https://trtc.io/document/47993)|Creates a forward message.|
|[sendMessage](https://trtc.io/document/47993)|Sends a message.|
|[revokeMessage](https://trtc.io/document/48015)|Recalls a message.|
|[deleteMessage](https://trtc.io/document/48010)|Deletes a message.|
|[translateText](https://trtc.io/document/55857)|Translates a message.|
|[setMessageExtensions](https://trtc.io/document/54166)|Sets message extensions.|
|[getMessageExtensions](https://trtc.io/document/54166)|Gets message extensions.|
|[deleteMessageExtensions](https://trtc.io/document/54166)|Deletes message extensions.|
|[addMessageReaction](https://trtc.io/document/60749)|Add message reactions. This interface allows for scenarios such as "emoji reactions" to be implemented.|
|[removeMessageReaction](https://trtc.io/document/60749)|Remove message reactions.|
|[getMessageReactions](https://trtc.io/document/60749)|Retrieve information of message reactions.|
|[getAllUserListOfMessageReaction](https://trtc.io/document/60749)|Paginate and retrieve the user list for a specific message reaction.|

### Conversation

|API|Description|
|---------|---------|
|[modifyMessage](https://trtc.io/document/48005)|Modifies a message.|
|[getMessageList](https://trtc.io/document/47999)|Gets the message list.|
|[getMessageListHopping](https://trtc.io/document/47999)|Pulls the conversation message list by specified sequence or time range.|
|[sendMessageReadReceipt](https://trtc.io/document/48021))|Sends message read receipts.|
|[getMessageReadReceiptList](https://trtc.io/document/48021))|Pulls the list of message read receipts.|
|[getGroupMessageReadMemberList](https://trtc.io/document/48021))|Pulls the list of members who have (or have not) read a group message.|
|[findMessage](https://trtc.io/document/48024)|Queries local messages in a specified conversation by `messageID`.|
|[setMessageRead](https://trtc.io/document/48319)|Marks a message as read.|
|[getConversationList](https://trtc.io/document/48325)|Gets the conversation list.|
|[getConversationProfile](https://trtc.io/document/48322)|Gets the conversation information.|
|[deleteConversation](https://trtc.io/document/48313)|Deletes a conversation.|
|[setConversationDraft](https://trtc.io/document/56184)|Set conversation draft.|
|[clearHistoryMessage](https://trtc.io/document/53498)|Clears the chat history with a user from local storage and the cloud (without deleting the conversation).|
|[pinConversation](https://trtc.io/document/48316)|Pins/Unpins a conversation to/from top.|
|[setAllMessageRead](https://trtc.io/document/48319)|Marks the unread messages of all conversations as read.|
|[setMessageRemindType](https://trtc.io/document/48031)|Sets the conversation message notification type. You can use this API to mute notifications or reject messages.|
|[getTotalUnreadMessageCount](https://trtc.io/document/48319)|Gets the total unread message count of conversations.|

### Conversation group

|API|Description|
|---------|---------|
|[setConversationCustomData](https://trtc.io/document/50291)|Sets custom conversation data.|
|[markConversation](https://trtc.io/document/50291)|Marks a conversation.|
|[getConversationGroupList](https://trtc.io/document/50289)|Gets the list of conversation groups.|
|[createConversationGroup](https://trtc.io/document/50289)|Creates a conversation group.|
|[deleteConversationGroup](https://trtc.io/document/50289)|Deletes a conversation group.|
|[renameConversationGroup](https://trtc.io/document/50289)|Renames a conversation group.|
|[addConversationsToGroup](https://trtc.io/document/50289)|Adds a conversation to a conversation group.|
|[deleteConversationsFromGroup](https://trtc.io/document/50289)|Deletes conversations from a conversation group.|

### Search

|API|Description|
|---------|---------|
|searchCloudMessages|Search cloud messages.|
|searchCloudUsers|Search cloud users.|
|searchCloudGroups|Search cloud groups.|
|searchCloudGroupMembers|Search cloud group members.|

### Profile

|API|Description|
|---------|---------|
|[getMyProfile](https://trtc.io/document/48161)|Gets personal profile.|
|[getUserProfile](https://trtc.io/document/48161)|Gets other user’s profile.|
|[updateMyProfile](https://trtc.io/document/48161)|Updates your personal profile.|
|[getBlacklist](https://trtc.io/document/48152)|Gets your blocklist.|
|[addToBlacklist](https://trtc.io/document/48152)|Adds a user to the blocklist.|
|[removeFromBlacklist](https://trtc.io/document/48152)|Removes a user from the blocklist.|

### User status

|API|Description|
|---------|---------|
|[setSelfStatus](https://trtc.io/document/49561)|Sets one's own custom status.|
|[getUserStatus](https://trtc.io/document/49561)|Queries a user's status.|
|[subscribeUserStatus](https://trtc.io/document/49561)|Subscribes to a user's status.|
|[unsubscribeUserStatus](https://trtc.io/document/49561)|Unsubscribes from a user's status.|

### Relationship Chain

|API|Description|
|---------|---------|
|[getFriendList](https://trtc.io/document/48158)|Gets the contacts in the SDK cache.|
|[addFriend](https://trtc.io/document/48158)|Adds friends.|
|[deleteFriend](https://trtc.io/document/48158)|Deletes friends.|
|[checkFriend](https://trtc.io/document/48158)|Verifies friend relationship.|
|[getFriendProfile](https://trtc.io/document/48158)|Gets the friend data and profile data of a specified user.|
|[updateFriend](https://trtc.io/document/48158)|Updates the contacts data of friends.|
|[getFriendApplicationList](https://trtc.io/document/48158)|Gets the friend request list in the SDK cache.|
|[acceptFriendApplication](https://trtc.io/document/48158)|Accepts a friend request.|
|[refuseFriendApplication](https://trtc.io/document/48158)|Rejects a friend request.|
|[deleteFriendApplication](https://trtc.io/document/48158)|Deletes a friend request.|
|[setFriendApplicationRead](https://trtc.io/document/48158)|Set a friend request as reads.|
|[getFriendGroupList](https://trtc.io/document/48155)|Gets list of friend groups in the SDK cache.|
|[createFriendGroup](https://trtc.io/document/48155)|Creates a friend group.|
|[deleteFriendGroup](https://trtc.io/document/48155)|Deletes a friend group.|
|[addToFriendGroup](https://trtc.io/document/48155)|Adds friends to a friend group.|
|[removeFromFriendGroup](https://trtc.io/document/48155)|Removes friends from a friend group.|
|[renameFriendGroup](https://trtc.io/document/48155)|Modifies the name of a friend group.|

### Group

|API|Description|
|---------|---------|
|[getGroupList](https://trtc.io/document/48465)|Gets the group list.|
|[getGroupProfile](https://trtc.io/document/48184)|Gets the group profile.|
|[createGroup](https://trtc.io/document/48465)|Creates a group.|
|[dismissGroup](https://trtc.io/document/48465)|Disbands a group.|
|[updateGroupProfile](https://trtc.io/document/48184)|Modifies the group profile.|
|[joinGroup](https://trtc.io/document/48465)|Requests to join a group.|
|[quitGroup](https://trtc.io/document/48465)|Quits a group.|
|[searchGroupByID](https://trtc.io/document/48465)|Searches for a group.|
|[getGroupOnlineMemberCount](https://trtc.io/document/48180)|Gets the number of online users in an audio-video group.|
|[changeGroupOwner](https://trtc.io/document/48465)|Transfers the group ownership.|
|[getGroupApplicationList](https://trtc.io/document/48465)|Gets the list of requests to join a group.|
|[handleGroupApplication](https://trtc.io/document/48465)-a-group-join-request)|Processes requests to join the group.|
|[initGroupAttributes](https://trtc.io/document/48174)|Initializes group attributes.|
|[setGroupAttributes](https://trtc.io/document/48174)|Sets group attributes.|
|[deleteGroupAttributes](https://trtc.io/document/48174)|Deletes group attributes.|
|[getGroupAttributes](https://trtc.io/document/48174)|Gets group attributes.|
|[setGroupCounters](https://trtc.io/document/56042)|Sets group counters.|
|[increaseGroupCounter](https://trtc.io/document/56042)|Increases the specified group counters.|
|[decreaseGroupCounter](https://trtc.io/document/56042)|Decreases the specified group counters.|
|[getGroupCounters](https://trtc.io/document/56042)|Gets the specified group counters.|

### Group member

|API|Description|
|---------|---------|
|[getGroupMemberList](https://trtc.io/document/48180)|Gets the group member list.|
|[getGroupMemberProfile](https://trtc.io/document/48177)|Gets a group member’s profile.|
|[addGroupMember](https://trtc.io/document/48180)|Adds a group member.|
|[deleteGroupMember](https://trtc.io/document/48180)|Deletes a group member.|
|[setGroupMemberMuteTime](https://trtc.io/document/48180)|Configures the muting period.|
|[setGroupMemberRole](https://trtc.io/document/48180)|Modifies the group member’s role.|
|[setGroupMemberNameCard](https://trtc.io/document/48177)|Sets the name card for a group member.|
|[setGroupMemberCustomField](https://trtc.io/document/48177)|Sets a custom field for a group member.|
|[markGroupMemberList](https://trtc.io/document/48177)|Marks group members.|

### Topic

|API|Description|
|---------|---------|
|[getJoinedCommunityList](https://trtc.io/document/48171)|Gets the list of community groups the current user has joined.|
|[createTopicInCommunity](https://trtc.io/document/48171)|Creates a topic in a community group.|
|[deleteTopicFromCommunity](https://trtc.io/document/48171)|Deletes a topic in a community group.|
|[updateTopicProfile](https://trtc.io/document/48171)|Updates a topic profile in a community group.|
|[getTopicList](https://trtc.io/document/48171)|Gets the topic list in a community group.|

### Signaling

|API|Description|
|---------|---------|
|[addSignalingListener](https://trtc.io/document/66034)|Listens for a signaling event.|
|[removeSignalingListener](https://trtc.io/document/66034)|Removes listener for a signaling event.|
|[invite](https://trtc.io/document/66034)|Invites someone.|
|[inviteInGroup](https://trtc.io/document/66034)|Invites members in a group.|
|[cancel](https://trtc.io/document/66034)|The inviter cancels the invitation.|
|[accept](https://trtc.io/document/66034)|The invitee accepts the invitation.|
|[reject](https://trtc.io/document/66034)|The invitee rejects the invitation.|
|[getSignalingInfo](https://trtc.io/document/66034)|Gets signaling info from a message.|
|[modifyInvitation](https://trtc.io/document/66034)|Modifies a invitation.|

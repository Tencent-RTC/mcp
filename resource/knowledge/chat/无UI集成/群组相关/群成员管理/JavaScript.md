---
sync_node_id: '108053289789595648'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群成员管理"
  - "JavaScript"
product: "chat"
---
## Feature Overview

Group member management includes pulling the member list, muting group members, removing group members, granting permissions, and transferring the group ownership.

## Getting the Group Member List

> **Note:**
> - This API returns the group member information with a `isOnline` field, indicating whether the member is online.
> - This API supports pulling the muting stop timestamp (`muteUntil`) of group members. Based on this value, you can determine if a member is muted and the remaining muting time.
> - This API retrieves group members in pages and cannot be used directly to get the total number of group members. To get the total number of group members (`memberCount`), please use `getGroupProfile`.
> - When the API returns an offset of 0, it means all group members have been retrieved.
> - The Pro edition, Pro Plus edition or Enterprise edition supports fetching the list of designated tagged group members in AVChatRoom based on the `filter` parameter. Please refer to `mark` `GroupMemberList` to tag group members.
> - The following special restrictions are added for AVChatRoom:
> - The Pro edition, Pro Plus edition or Enterprise edition supports pulling up to 1,000 recently joined group members, with new members ranked first. To use this feature, you need to purchase the Pro edition, Pro Plus edition or Enterprise edition package and enable the feature in the [Chat Console](https://console.trtc.io/chat/qun-setting).
> - On the Pro edition, Pro Plus edition or Enterprise edition, the SDK will ignore the count parameter, and a single query will return up to 500 group members by default.
> - On the Pro edition, Pro Plus edition or Enterprise edition, this API can be called up to one time per three seconds. To query the group member list periodically, you are advised to call the API once every ten seconds.
> - The group member profile information only supports the fields `userID`, `nick`, `avatar`, `joinTime` and `role`. To set nick and avatar information, please call: `updateMyProfile`.
> 
> 

To enable the feature of online group member lists in AVChatRoom for the Pro edition, Pro Plus edition or Enterprise edition, please log in to the [Chat Console](https://console.trtc.io) **>** **Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message), select **AVChatRoom**,  modify the relevant configuration. The configuration page is shown below:

##### **API**

【js】
``` javascript
chat.getGroupMemberList(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| groupID | String | Group ID. |
| role | String | Group member roles. By default, the SDK pulls all group members, but you can set this field to pull a list of group members with specified roles. The supported values are as follows:<br>- <code>TencentCloudChat.GRP_MBR_ROLE_OWNER</code> - Group owner;<br>- <code>TencentCloudChat.GRP_MBR_ROLE_ADMIN</code> - Group administrator;<br>- <code>TencentCloudChat.GRP_MBR_ROLE_MEMBER</code> - Ordinary group member. |
| count | Number | The number of entries to be fetched. Default value: 15, Maximum value: 100, to avoid response failure due to large packages. If more than 100 is passed in, only the first 100 will be fetched (the Pro edition, Pro Plus edition or Enterprise edition for AVChatRoom ignores the count parameter when using this API). |
| offset | Number \\| String | Offset, default is to start pulling from 0. When used in Community, this field is of type <code>String</code>. |
| filter | Number | Custom tags for group members, supported only in AVChatRoom. |

##### **Return value**

`Promise` 

##### **Example**
``` javascript
// Pull all administrators of the group
let promise = chat.getGroupMemberList({
  groupID: 'group1',
  role: TencentCloudChat.TYPES.GRP_MBR_ROLE_ADMIN,
  count: 15,
  offset: 0
});
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList);
}).catch(function(imError) {
  console.warn('getGroupMemberList error:', imError);
});
```

【js】
``` javascript
// Pull the muting end timestamp of group members.
let promise = tim.getGroupMemberList({
   groupID: 'group1',
   count: 30,
   offset:0,
 }); // Pull 30 group members starting from 0
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // Group member list
  for (let groupMember of imResponse.data.memberList) {
    if (groupMember.muteUntil * 1000  > Date.now()) {
      console.log(`${groupMember.userID} muted`);
    } else {
      console.log(`${groupMember.userID} not muted`);
    }
  }
}).catch(function(imError) {
    console.warn('getGroupMemberProfile error:', imError);
});
```

【js】
``` javascript
// The Pro edition, Pro Plus edition or Enterprise edition supports retrieving the list of online members in the AVChatRoom
let promise = chat.getGroupMemberList({
   groupID: 'group1',
   filter: 1000,
   offset:0, // Default is to start pulling from 0
 });
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // Group member list
}).catch(function(imError) {
  console.warn('getGroupMemberList error:', imError);
});
```

``` javascript
// filter the list of online members in the AVChatRoom
let promise = chat.getGroupMemberList({ groupID: 'group1', filter: 1000, offset: 0 });
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList);
}).catch(function(imError) {
  console.warn('getGroupMemberList error:', imError);
});
```

## Mute

### Mute specific group members

> **Note:**
> 1. `TencentCloudChat.TYPES.GRP_WORK` type groups do not support this operation.
> 2. `TencentCloudChat.TYPES.GRP_AVCHATROOM` type groups do not support this operation。
> 3. To ban or kick out group members in AVChatRoom, you need to purchase the Pro edition, Pro Plus edition or Enterprise edition and use the `deleteGroup` `Member` interface.
> 4. If you need to mute all members, please refer to `updateGroupProfile`.
> 5. It supports setting a mute duration for community members within topics by passing topicID as groupID.
> 6. Only the group owner and administrators have this permission:
> -  The group owner can mute/unmute administrators and ordinary group members.
> -  Administrators can mute/unmute ordinary group members.
> 
> 

##### **API**

【js】
``` javascript
chat.setGroupMemberMuteTime(options);
```

##### **Parameters**

The options `parameter` is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID or topic ID.|
|userID|String|User ID.|
|muteTime|Number|Mute duration, in seconds. For example, setting it to 1000 means muting the user for 1000 seconds from now; setting it to 0 means unmuting.|

##### **Returned value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.setGroupMemberMuteTime({
  groupID: 'group1',
  userID: 'user1',
  muteTime: 600 // Mute for 10 minutes; set to 0 to unmute
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // New group profile
  console.log(imResponse.data.member); // New member profile
}).catch(function(imError) {
  console.warn('setGroupMemberMuteTime error:', imError); // Error information
});
```

【js】
``` javascript
// Set the period for muting a group member in the topic
let promise = chat.setGroupMemberMuteTime({
  groupID: 'topicID',
  userID: 'user1',
  muteTime: 600 // Mute for 10 minutes; set to 0 to unmute
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // New group profile
  console.log(imResponse.data.member); // New member profile
}).catch(function(imError) {
  console.warn('setGroupMemberMuteTime error:', imError); // Error information
});
```

### Mute the entire group

【js】
``` javascript
// Global Mute
let promise = chat.updateGroupProfile({
  groupID: 'group1',
  muteAllMembers: true, // true: mute all; false: unmute all
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group) // Detailed group profile after modification
}).catch(function(imError) {
  console.warn('updateGroupProfile error:', imError); // Error information
});
```

## Adding Group members

> **Note:**
> - `TencentCloudChat.TYPES.GRP_WORK` (Work): By default, any group member can directly invite others into the group without the need for the invitee's consent, and they are added to the group directly. You can set `inviteOption` to `TencentCloudChat.TYPES.INVITE_OPTIONS_DISABLE_INVITE` to prohibit any group member from inviting others into the group.
> - `TencentCloudChat.TYPES.GRP_PUBLIC` (Public) / `TencentCloudChat.TYPES.GRP_MEETING` (Meeting): By default, group members are not allowed to invite others into the group. You can control the invitation options by setting `inviteOption`.
> - `TencentCloudChat.TYPES.GRP_COMMUNITY` (Community): By default, group members are allowed to invite others into the group.
> - `TencentCloudChat.TYPES.GRP_AVCHATROOM` (AVChatRoom): No one is allowed to invite others into the group (including App administrators).
> - The userID of the member to be added must be a valid user account; otherwise, the API will return 10019.

##### **API**

【js】
``` javascript
chat.addGroupMember(options);
```

##### **Parameters**

The options `parameter` is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID.|
|userIDList|Array.<String>|The array of group member IDs to be added, with a maximum of 20 members per time.|

##### **Returned value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.addGroupMember({groupID: 'group1', userIDList: ['user1','user2','user3']});
promise.then(function(imResponse) {
  console.log(imResponse.data.successUserIDList);
  console.log(imResponse.data.failureUserIDList);
  console.log(imResponse.data.existedUserIDList);
  // A user userX is allowed to join up to N groups. 
  // If userX has already joined N groups, attempting to add userX as a group member again will result in userX being unable to join the group normally.
  // SDK places userX's information into the overLimitUserIDList for processing by the access side.
  console.log(imResponse.data.overLimitUserIDList);
  console.log(imResponse.data.group);
}).catch(function(imError) {
  console.warn('addGroupMember error:', imError);
});
```

## Kick out

> - **Note：**
> - The Pro edition, Pro Plus edition or Enterprise edition supports removing AVChatRoom members. You can achieve the effect of [Ban Group Members] in AVChatRoom by calling this interface.
> - The kick out duration field is supported only by AVChatRoom.
> - After a group member is removed from a AVChatRoom, within the **kick out duration**, if the user wants to rejoin the group, the app admin needs to call the [REST API](https://trtc.io/document/50297) to unban them. **After the kick out duration**, the user can proactively join the live chat group again.

##### **API**

【js】
``` javascript
chat.deleteGroupMember(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID or topic ID.|
|userIDList|Array|List of IDs of the group members to be removed.|
|reason|String|Reason for kicking out.|
|duration|Number|Kick-out duration must be greater than 0 (supported only by AVChatRoom).|

##### **Return value**

`Promise`

##### **Example**

【js】
``` javascript
// Removing group members from non-live groups
let promise = chat.deleteGroupMember({
   groupID: 'group1',
   userIDList:['user1'],
   reason: 'You violated the rules, I am kicking you out!',
 });
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // Group profile after group member removal
  console.log(imResponse.data.userIDList); // List of userID of the removed group member
}).catch(function(imError) {
  console.warn('deleteGroupMember error:', imError); // Error information
});
```

【js】
``` javascript
// Removing group members from AVChatRoom
let promise = chat.deleteGroupMember({
   groupID: 'group1',
   userIDList:['user1'],
   reason: "You violated the rules, I'm kicking you out!",
   duration: 60,
 });
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // Group profile after group member removal
  console.log(imResponse.data.userIDList); // List of userID of the removed group member
}).catch(function(imError) {
  console.warn('deleteGroupMember error:', imError); // Error information
});
```

## Changing the Role of a Group Member

> **Note：**
> 1. `TencentCloudChat.TYPES.GRP_WORK` type groups  do not support this operation.
> 2. `TencentCloudChat.TYPES.GRP_AVCHATROOM` type groups do not support this operation.

##### **API**

【js】
``` javascript
chat.setGroupMemberRole(options);
```

##### **Parameters**

The options `parameter` is of the `Object` type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| groupID | String | Group ID or topic ID. |
| userID | String | User ID. |
| role | String | Valid values:<br>- <code>TencentCloudChat.TYPES.GRP_MBR_ROLE_ADMIN</code> (Group Administrator);<br>- <code>TencentCloudChat.TYPES.GRP_MBR_ROLE_MEMBER</code> (Group Regular Member);<br>- <code>TencentCloudChat.TYPES.GRP_MBR_ROLE_CUSTOM</code> (Custom Group Member Roles, supported only by the Community). |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.setGroupMemberRole({
  groupID: 'group1',
  userID: 'user1',
  role: TencentCloudChat.TYPES.GRP_MBR_ROLE_ADMIN // Set user: user1 as an admin in group ID: group1
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // New group profile
  console.log(imResponse.data.member); // New member profile
}).catch(function(imError) {
  console.warn('setGroupMemberRole error:', imError); // Error information
});
```

## Getting Group Online Users

> **Note：**
> It is recommended to control the frequency of calling this interface to query the number of people in AVChatRoom between 5 to 10 seconds once; for querying the online number of other types of groups, the frequency limit is once every 60 seconds.
> 

##### **API**

【js】
``` javascript
chat.getGroupOnlineMemberCount(groupID);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|

##### **Returned value**

`Promise`

##### **Examples**

【js】
``` javascript
// Querying the Number of Online Users in an AVChatRoom
let promise = chat.getGroupOnlineMemberCount('group1');
promise.then(function(imResponse) {
  console.log(imResponse.data.memberCount);
}).catch(function(imError) {
  console.warn('getGroupOnlineMemberCount error:', imError); // Error information
});
```

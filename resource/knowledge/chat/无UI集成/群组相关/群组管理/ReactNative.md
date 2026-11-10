---
sync_node_id: '108053291277524992'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群组管理"
  - "React Native"
product: "chat"
---
## Feature Overview

The group management feature allows creating a group, joining a group, getting the joined groups, leaving a group, or disbanding a group.

## Group Event Listener

##### **Examples**

【js】
``` javascript
let onGroupListUpdated = function(event) {
   console.log(event.data);// Array that stores Group instances
};
chat.on(TencentCloudChat.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated);
```

## Searching a Group

> **Note:**
> Groups of type `TencentCloudChat.TYPES.GRP_WORK` cannot be searched.
> 

##### **API**

【js】
``` javascript
chat.searchGroupByID(groupID);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|group ID.|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let promise = chat.searchGroupByID('group1');
promise.then(function(imResponse) {
  const group = imResponse.data.group;
}).catch(function(imError) {
  console.warn('searchGroupByID error:', imError);
});
```

## Creating a Group

> **Note:**
> 1. After this API is used to create `TencentCloudChat.TYPES.GRP_AVCHATROOM`, the `joinGroup` API needs to be called to join the group to enable the messaging process.
> 2. This API can create a topic-enabled community.

##### **API**

【js】
``` javascript
chat.createGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| name | String | Group name, which can contain up to 30 bytes. |
| type | String | Group type. Valid values:<br>- <code>TencentCloudChat.TYPES.GRP_WORK</code> (work group, which is the default value)<br>- <code>TencentCloudChat.TYPES.GRP_PUBLIC</code> (public group)<br>- <code>TencentCloudChat.TYPES.GRP_MEETING</code> (meeting group)<br>- <code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code> (audio-video group)<br>- <code>TencentCloudChat.TYPES.GRP_COMMUNITY</code> (community) |
| groupID | String \\| undefined | Group ID. If it is not specified, a unique ID will be automatically created for the group. |
| introduction | String \\| undefined | Group introduction, which can contain up to 240 bytes. |
| notification | String \\| undefined | Group notice, which can contain up to 300 bytes. |
| avatar | String \\| undefined | Group profile photo URL, which can contain up to 100 bytes. |
| maxMemberNum | Number \\| undefined | Maximum number of group members. Default value:<br>- 200 for a work group<br>- 2,000 for a public group<br>- 10,000 for a meeting group<br>- unlimited for an audio-video group |
| joinOption | String | Method to join a group. Valid values:<br>- <code>TencentCloudChat.TYPES.JOIN_OPTIONS_FREE_ACCESS</code><br>- <code>TencentCloudChat.TYPES.JOIN_OPTIONS_NEED_PERMISSION</code> (approval required)<br>- <code>TencentCloudChat.TYPES.JOIN_OPTIONS_DISABLE_APPLY</code> (no group join allowed)<br><strong>Note:</strong><br>It cannot be modified for <code>TencentCloudChat.TYPES.GRP_WORK</code>, <code>TencentCloudChat.TYPES.GRP_MEETING</code>, and <code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code> groups. Work groups cannot be joined on request, and meeting groups and audio-video groups can be joined freely. |
| inviteOption | String \\| undefined | Group inviting option:<br>- <code>TencentCloudChat.TYPES.INVITE_OPTIONS_FREE_ACCESS</code>: allow free group inviting<br>- <code>TencentCloudChat.TYPES.INVITE_OPTIONS_NEED_PERMISSION</code>: require approval for group inviting<br>- <code>TencentCloudChat.TYPES.INVITE_OPTIONS_DISABLE_INVITE</code>: forbid group inviting<br><strong>Note:</strong><br>The property is not supported for groups of type<code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code>, but it is supported for other types of groups. |
| memberList | Array \\| undefined | List of up to 500 existing group members. No group members can be added when an audio-video group is created. The array elements are as structured below:<br>- <code>userID</code> --- String --- <code>userID</code> of the group member, which is required<br>- <code>role</code> --- String --- member role, which can only be <code>Admin</code>, indicating to add and set the group member as the admin<br>- <code>memberCustomField</code> --- Array |
| groupCustomField | Array \\| undefined | Custom group field, which is unavailable by default. For more information on how to enable a custom group field, see <a href="https://console.trtc.io/chat/qun-setting">Custom Group Field</a>. |
| isSupportTopic | Boolean | It is required for creating a topic-enabled community. Valid values: <code>true</code>: create a topic-enabled community; <code>false</code>: create an ordinary community. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Create a work group
let promise = chat.createGroup({
  type: TencentCloudChat.TYPES.GRP_WORK,
  name: 'WebSDK',
  memberList: [{
    userID: 'user1',
    // Group member custom field.
    // By default, this parameter is not available and needs to be enabled.
    // For details, see Custom Fields.
    memberCustomField: [{key: 'group_member_test', value: 'test'}]
  }, {
    userID: 'user2'
  }] // If `memberList` is specified, `userID` must also be specified.
});
promise.then(function(imResponse) { // Created successfully
  console.log(imResponse.data.group); // Profile of the created group
  // A member list is specified during group creation
  // but a certain user has exceeded the limit on the number of groups a single user can join.
  // If you specify userX, who has joined N groups (maximum number of groups userX can join)
  // as a member of the group during group creation, userX cannot join the group properly.
  // The SDK places the information of userX in overLimitUserIDList for the access side to process.
  // List of users who have exceeded the limit on the number of groups a single user can join.
  console.log(imResponse.data.overLimitUserIDList); 
}).catch(function(imError){
  console.warn('createGroup error:', imError); // Failed to create the group
});
```

【js】
``` javascript
// Create a topic-enabled community
let promise = chat.createGroup({
  type: TencentCloudChat.TYPES.GRP_COMMUNITY,
  name: 'WebSDK',
  isSupportTopic: true,
});
promise.then(function(imResponse) { // Created successfully
  console.log(imResponse.data.group); // Profile of the created group
}).catch(function(imError){
  console.warn('createGroup error:', imError); // Failed to create the group
});
```

``` javascript
// Create a group with inviteOption
let promise = chat.createGroup({
  type: TencentCloudChat.TYPES.GRP_PUBLIC,
  name: 'WebSDK',
  inviteOption: TencentCloudChat.TYPES.INVITE_OPTIONS_NEED_PERMISSION,
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group);
}).catch(function(imError) {
  console.warn('createGroup error:', imError);
});
```

## Joining a Group

The method for joining a group may vary by group type as follows:
| Type | Method for Joining a Group |
| --- | --- |
| Work group (Work) | By invitation |
| Public group (Public) | - On request from the user and on approval from the group owner or admin<br>- Inviting to join the group, this feature is not supported by default. You can modify the <code>inviteOption</code> through the <code>updateGroupProfile</code> interface to implement it. |
| Meeting group (Meeting) | - Free to join<br>- Inviting to join the group, this feature is not supported by default. You can modify the <code>inviteOption</code> through the <code>updateGroupProfile</code> interface to implement it. |
| Community (Community) | - Free to join<br>- Inviting to join the group, this feature is not supported by default. You can modify the <code>inviteOption</code> through the <code>updateGroupProfile</code> interface to implement it. |
| Audio-video group (AVChatRoom) | Free to join |

> **Note:**
> 1. Work groups cannot be joined on request, but only through `addGroupMember`.
> 2. A user can join one audio-video group at a time. For example, if a user is already in audio-video group A and attempts to join audio-video group B, the SDK will remove the user from audio-video group A first and then add the user to audio-video group B.
> 3. To obtain the live group's online member list, you need to purchase the [Premium edition](https://trtc.io/pricing/chat). Please refer to `getGroupMemberList.`

##### **API**

【js】
``` javascript
chat.joinGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|applyMessage|String \| undefined|Remarks|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.joinGroup({ groupID: 'group1' });
promise.then(function(imResponse) {
  switch (imResponse.data.status) {
    case TencentCloudChat.TYPES.JOIN_STATUS_WAIT_APPROVAL: // Waiting to be approved by the admin
      break;
    case TencentCloudChat.TYPES.JOIN_STATUS_SUCCESS: // Joined the group successfully
      console.log(imResponse.data.group); // Profile of the group
      break;
    case TencentCloudChat.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // The user is already in the group.
      break;
    default:
      break;
  }
}).catch(function(imError){
  console.warn('joinGroup error:', imError); // Failed to join the group
});
```

## Getting the Joined Groups

> **Note:**
> 1. This interface returns the group list that the SDK has synchronized from the cloud, excluding groups of type `TencentCloudChat.TYPES.GRP_AVCHATROOM` and community groups that support topics.
> 2. The group list returned by the interface only includes the basic information of the group (group type, group name, group avatar, @ information list).
> 3. If you want to obtain detailed information about a group, please use `getGroupProfile`.

##### **API**

【js】
``` javascript
chat.getGroupList();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getGroupList();
promise.then(function(imResponse) {
  console.log(imResponse.data.groupList); // Group list
}).catch(function(imError){
  console.warn('getGroupList error:', imError); // Failed to obtain the group list
});
```

## Leaving a Group

> **Note:**
> 1. A group owner can only leave a work group, after which the work group will have no group owner.
> 2. After leaving the group, if the login state has not expired, the SDK will still retain the corresponding group conversation. If you want to delete the conversation, please use `deleteConversation`.

##### **API**

【js】
``` javascript
chat.quitGroup(groupID);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.quitGroup('group1');
promise.then(function(imResponse) {
  console.log(imResponse.data.groupID); // ID of the group that the user leaves
}).catch(function(imError){
  console.warn('quitGroup error:', imError); // Failed to leave the group
});
```

## Disbanding a Group

> **Note:**
> 1. A work group cannot be disbanded.
> 2. After the group is dissolved, if the login state has not expired, the SDK will still retain the corresponding group conversation. If you want to delete the conversation, please use `deleteConversation`.

##### **API**

【js】
``` javascript
chat.dismissGroup(groupID);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.dismissGroup('group1');
promise.then(function(imResponse) { // Disbanded successfully
  console.log(imResponse.data.groupID); // ID of the disbanded group
}).catch(function(imError){
  console.warn('dismissGroup error:', imError); // Failed to disband the group
});
```

## Transferring a Group

> **Note:**
> 1. Only group owners have the permission to transfer groups. 
> 2. AVChatRoom (`TencentCloudChat.TYPES.GRP_AVCHATROOM`) cannot be transferred.

##### **API**

【js】
``` javascript
chat.changeGroupOwner(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|ID of the group to be transferred|
|newOwnerID|String|ID of the new group owner|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.changeGroupOwner({
  groupID: 'group1',
  newOwnerID: 'user2'
});
promise.then(function(imResponse) { // Transferred successfully
  console.log(imResponse.data.group); // Group profile
}).catch(function(imError) { // Failed to transfer the group
  console.warn('changeGroupOwner error:', imError); // Failed to transfer the group
});
```

## Geting the List of Group Join Requests and Invitations to Join the Group

##### **API**

【js】
``` javascript
chat.getGroupApplicationList();
```

##### **Parameters**

None

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getGroupApplicationList();
promise.then(function(imResponse) {
  const { applicationList } = imResponse.data;
  applicationList.forEach((item) => {
    // item.applicant - Applicant userID
    // item.applicantNick - Applicant nickname
    // item.groupID - group ID
    // item.groupName - group Name
    // item.applicationType - Application type: 0 for group join application, 2 for invitation to join the group
    // item.userID - When applicationType = 2, it is the userID of the invited user.
    // item.note - reamake
    chat.handleGroupApplication({
      handleAction: 'Agree',
      application: {...item},
    });
  });
}).catch(function(imError) {
  console.warn('getGroupApplicationList error:', imError);
});
```

## Processing (Approving or Rejecting) a Group Join Request

> **Note:**
> 1. If there are multiple admins in a group, when a user requests to join the group, all the online admins will receive the system notification of the group join request. If one of the admins processes (approves or rejects) the request, other admins cannot process it again, that is, they cannot modify the processing result.
> 2. If here are multiple admins in a group, when someone invites a user to join the group, all the online group admins will receive a group system notification for the invitation to join the group. If one of the group admins processes this application through the pending list (agree or reject), other admins cannot process it again, that is, they cannot modify the processing result.

##### **API**

【js】
``` javascript
chat.handleGroupApplication(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|handleAction|String|Processing result. Valid values: `Agree`, `Reject`.|
|handleMessage|String \| undefined|Remarks|
|message|Message|Message instance of the group system notification|
|application|Object \| undefined|group application|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.handleGroupApplication({
  handleAction: 'Agree',
  handleMessage: 'Welcome',
  // The message instance of the group system notification for an application to join a group.
  message: message
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // Group profile
}).catch(function(imError){
  console.warn('handleGroupApplication error:', imError); // Error message
});
```

``` javascript
let promise = chat.getGroupApplicationList();
promise.then(function(imResponse) {
  const { applicationList } = imResponse.data;
  applicationList.forEach((item) => {
    if (item.applicationType === 0) {
      chat.handleGroupApplication({
        handleAction: 'Agree',
        application: {...item},
      });
    }
  });
}).catch(function(imError) {
  console.warn('getGroupApplicationList error:', imError);
});
```

``` javascript
let promise = chat.getGroupApplicationList();
promise.then(function(imResponse) {
  const { applicationList } = imResponse.data;
  applicationList.forEach((item) => {
    if (item.applicationType === 2) {
      chat.handleGroupApplication({
        handleAction: 'Agree',
        application: {...item},
      });
    }
  });
}).catch(function(imError) {
  console.warn('getGroupApplicationList error:', imError);
});
```

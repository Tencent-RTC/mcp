---
sync_node_id: '108053290624262144'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群成员资料"
  - "JavaScript"
product: "chat"
---
## Getting the Profile of Group Members

> **Note:**
> 1. `TencentCloudChat.TYPES.GRP_AVCHATROOM` (AVChatRoom) does not support this operation, error code 2687.
> 2. The maximum number of users in each query is 50. If the length of the array passed in is greater than 50, only the first 50 users will be queried, and the rest will be discarded.

##### **API**

【js】
``` javascript
chat.getGroupMemberProfile(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|userIDList|Array|List of IDs of the group members to be queried|
|memberCustomFieldFilter|Array \| undefined|Filtering the custom group member field. This attribute is optional. If it is not specified, all the custom group member fields are queried by default.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getGroupMemberProfile({
  groupID: 'group1',
  // Even if you retrieve the profile of only one group member, the value must be of array type
  // for example, userIDList: ['user1'].
  userIDList: ['user1', 'user2'],
  memberCustomFieldFilter: ['group_member_custom'],
});
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // Group member list
}).catch(function(imError){
  console.warn('getGroupMemberProfile error:', imError);
});
```

## Setting the Name Card of a Group Member

> **Note：**
> 1. `TencentCloudChat.TYPES.GRP_AVCHATROOM` (AVChatRoom) does not support this operation, error code 2687.
> 2. Description of Operation Permissions:
> - Group Owner: Can set the namecard for all group members.
> - Administrator: Can set the namecard for themselves and other ordinary group members.
> - Ordinary Group Member: Can only set their own group namecard.

##### **API**

【js】
``` javascript
chat.setGroupMemberNameCard(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID or topic ID|
|userID|String \| undefined|It is optional. By default, the user's own name card is modified.|
|nameCard|String|Name card of a group member|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.setGroupMemberNameCard({
  groupID: 'group1',
  userID: 'user1',
  nameCard: 'Name card'
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // New group profile
  console.log(imResponse.data.member); // New group member profile
}).catch(function(imError){
  console.warn('setGroupMemberNameCard error:', imError);
});
```

## Setting a Custom Group Member Field

> **Note：**
> 1. `TencentCloudChat.TYPES.GRP_AVCHATROOM` (AVChatRoom) does not support this operation, error code 2687.
> 2. Ordinary group members can only set their own custom fields.

##### **API**

【js】
``` javascript
chat.setGroupMemberCustomField(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| groupID | String | Group ID or topic ID |
| userID | String \\| undefined | Optional. If it is not specified, the user's own custom group member field is modified. |
| memberCustomField | Array | Custom group member field. Its array elements are as structured below:<br>- key --- String --- <code>Key</code> of the custom field<br>- value --- String --- <code>Value</code> of the custom field |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.setGroupMemberCustomField({
  groupID: 'group1',
  memberCustomField: [{key: 'group_member_test', value: 'test'}]
});
promise.then(function(imResponse) {
  console.log(imResponse.data.group); // New group profile
  console.log(imResponse.data.member); // New group member profile
}).catch(function(imError){
  console.warn('setGroupMemberCustomField error:', imError);
});
```

## Marking Group Members

> **Note：**
> 1. Only supports AVChatRoom and only the group owner has the permission to mark other members in the group.
> 2. Using this interface requires you to purchase the [Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/pricing/chat).

##### **API**

【js】
``` javascript
chat.markGroupMemberList(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID or topic ID|
|userIDList|Array.<String>|List of group member userIDs, with a maximum of 500 group members per request.|
|markType|Number|Mark type. Greater than or equal to 1000, you can customize it. A maximum of 10 marks are allowed to be defined in an AVChatRoom.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.markGroupMemberList({
  groupID: 'group1',
  userIDList: ['user1', 'user2'],
  markType: 1000,
  enableMark: true,
});
promise.then(function(imResponse) {
  const { successUserIDList, failureUserIDList } = imResponse.data;
}).catch(function(imError) {
  console.warn('markGroupMemberList error:', imError);
});
```

``` javascript
// Get the list of online members with a specified mark in the AVChatRoom
let promise = chat.getGroupMemberList({ groupID: 'group1', filter: 1000, offset: 0 });
promise.then(function(imResponse) {
  console.log(imResponse.data.memberList); // Group member list
}).catch(function(imError) {
  console.warn('getGroupMemberList error:', imError);
});
```

---
sync_node_id: '108053289275793408'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群成员管理"
  - "Flutter"
product: "chat"
---
## Overview

Group member management includes pulling the member list, muting group members, removing group members, granting permissions, and transferring the group ownership, which can be implemented through the methods in the `TencentImSDKPlugin.v2TIMManager.getGroupManager()` core class.

## Getting the Group Member List

Call [`getGroupMemberList`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMemberList.html) to get the list of members in a specified group. 

When the call is successful, the response returns a list of [V2TimGroupMemberFullInfo](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_member_full_info/V2TimGroupMemberFullInfo-class.html). This object contains profile information for each group member, including the user ID (`userID`), group card (`nameCard`), avatar (`faceUrl`), nickname (`nickName`), join time (`joinTime`), online status (`isOnline`), and additional attributes.

> **Note：**
> The online status field (`isOnline`) is only available with Pro, Pro Plus or Enterprise edition.
> 

Due to the large number of members in AVChatRoom, retrieving the complete member list is not supported. Pro, Pro Plus or Enterprise edition can retrieve up to the most recent 1,000 members who have joined. The backend updates the group member list every 40 seconds.

This feature is disabled by default. To enable it, log in to the [**Chat Console**](https://console.trtc.io) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message), select **AVChatRoom**, then enable **List of Online AVChatRoom Members**.

### Filter (`filter`)

When calling the [`getGroupMemberList`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMemberList.html) API, you can specify `filter` to pull the list of the information of specified roles.

|Filter|Type|
|---------|---------|
|GroupMemberFilterTypeEnum.V2TIM_GROUP_MEMBER_FILTER_ALL|Pull the list of the information of all the group members|
|GroupMemberFilterTypeEnum.V2TIM_GROUP_MEMBER_FILTER_OWNER|Pull the list of the information of the group owner|
|GroupMemberFilterTypeEnum.V2TIM_GROUP_MEMBER_FILTER_ADMIN|Pull the list of the information of the group admin|
|GroupMemberFilterTypeEnum.V2TIM_GROUP_MEMBER_FILTER_COMMON|Pull the information list of ordinary group members|

### Pulling by page (`nextSeq`)

In many cases, only the first page of the group member list, not the information of all the group members, needs to be displayed on the user UI. More group members need to be pulled only when the user clicks **Next Page** or pulls up the list page. In this case, you can use pulling by page.

Directions for pulling by page:
1. When you call `getGroupMemberList` for the first time, set `nextSeq` to `0` (indicating to pull the group member list from the beginning). Up to 50 group member objects can be pulled at a time.

2. After the group member list is pulled successfully for the first time, the `V2TIMGroupMemberInfoResult` callback of `getGroupMemberList` will contain `nextSeq` (field for the next pull):

   - If `nextSeq` is `0`, all the group members have been pulled.

   - If `nextSeq` is greater than `0`, there are more group members that can be pulled. This doesn't mean that the next page of the member list will be pulled immediately. In common communications software, a paged pull is often triggered by a swipe operation.

3. When the user continues to pull up the group member list, if there are more members that can be pulled, you can continue to call the `getGroupMemberList` API and pass in the `nextSeq` parameter (the value is from the `V2TIMGroupMemberInfoResult` object returned by the last pull) for the next pull.

4. Repeat [step 3] until `nextSeq` is `0`.

   Sample code:

   ``` javascript
   {
       ...
       String nextSeq = '0';
       await getGroupMemberList(nextSeq);
       ...
   }
   
   Future<void> getGroupMemberList(String nextSeq) async {
       // Use the `filter` parameter to specify only the profile of the group owner is to be pulled
       final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().getGroupMemberList(
           filter: GroupMemberFilterTypeEnum.V2TIM_GROUP_MEMBER_FILTER_ADMIN,
           nextSeq: currentNextSeq,
           groupID: 'your_group_id'
       );
       
       if (result.data?.nextSeq != '0') {
           // Make another pull
           await getGroupMemberList(result.data?.nextSeq);
       }
   }
   
   ```

## Muting group members

### Muting a specified group member

The group owner or admin can call [`muteGroupMember`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/muteGroupMember.html) and set `muteTime` (in seconds) to mute a group member. If `muteTime` is set to `120`, the member is muted for 120 seconds.

If a group member is muted, message sending will fail, and an error code will be reported. To unmute the member, set `muteTime` to `0`.

The muting timestamp is stored in the [muteUntil](https://pub.dev/documentation/tencent_cloud_chat_sdk/8.9.7540+1/models_v2_tim_group_member_full_info/V2TimGroupMemberFullInfo/muteUntil.html) field of the group member information. Note that `muteUntil` indicates the end time for muting a group member.

After a group member is muted, all the group members (including the muted member) will receive the [`onMemberInfoChanged`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onMemberInfoChanged.html) callback.

> **Note**
> The group owner can mute/unmute the admin and ordinary group members. The admin can mute/unmute ordinary group members.
> 

### Muting the entire group

The group owner or admin can also **call the** [**muteAllGroupMembers**](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/muteAllGroupMembers.html) **API to mute the entire group** by setting the `isMute` field to `true`. The entire group can be muted for an unlimited period of time.

Muting all the group members will trigger the [onAllGroupMembersMuted](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onAllGroupMembersMuted.html) callback.

You can configure **notification of muting all change** in the console. Go to [**Chat Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message) **> Select Group Type** (Work Group/Friend Group/Public Group/Meeting Group/AVChatRoom/Community) **> Notification of Group Profile Change > Notification of muting all changen**, and update the relevant settings.

> **Note:**
> Only the group owner can mute the admin.
> 

Sample code:
``` javascript
// Mute the group member `userB` for 1 minute
final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().muteGroupMember(
    groupID: 'your_group_id',
    userID: 'userB',
    seconds: 60
);

// Mute all members
final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().muteAllGroupMembers(
    groupID: 'your_group_id',
    isMute: true
);

TencentImSDKPlugin.v2TIMManager.addGroupListener(listener: V2TimGroupListener(
    onMemberInfoChanged: (String groupID, List<V2TimGroupMemberChangeInfo> v2TIMGroupMemberChangeInfoList) {
      // Muted group member callback
      for (var memberChangeInfo in v2TIMGroupMemberChangeInfoList) {
        // Muted user ID
        String userID = memberChangeInfo.userID ?? '';
        // Muted time
        int muteTime = memberChangeInfo.muteTime ?? 0;
      }
    },
    
    onAllGroupMembersMuted: (String groupID, bool isMute) {
      // All-member mute callback
    }
));

```

## Removing Group Members

The group owner or admin can call the [`kickGroupMember`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/kickGroupMember.html) API to remove a specified ordinary group member from the group.

After the ordinary group member is removed, all the members (including the removed member) will receive the [`onMemberKicked`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onMemberKicked.html) callback.

As an audio-video group (AVChatRoom) can be joined freely, there is no API for removing a group member from an audio-video group (AVChatRoom). You can use [`muteGroupMember`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/muteGroupMember.html) to mute a specified member to implement similar controls.

> **Note: **
> Only the group owner can remove the admin from the group.
> 

Sample code:
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().kickGroupMember(
    groupID: 'your_group_id',
    memberList: ['target_user_id']
);
```

## Setting an Admin

The group owner can call [`setGroupMemberRole`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupMemberRole.html) to set a group member in a public group (Public) or meeting group (Meeting) as the admin.

An ordinary member set as the admin has the admin permission to perform the following operations:
- Modify the basic group profile.

- Remove an ordinary member from the group

- Mute an ordinary member (prevent the member from speaking during a specified period of time)

- Approve a request to join the group

   For more information, see [Group Member Roles](https://intl.cloud.tencent.com/document/product/1047/33529).

   After an ordinary member is set as the admin, all the members (including the ordinary member) will receive the [`onGrantAdministrator`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onGrantAdministrator.html) callback.

   After the ordinary member is unset as the admin, all the members (including the ordinary member) will receive the [`onRevokeAdministrator`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onRevokeAdministrator.html) callback.

   Sample code:

   ``` javascript
   final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().setGroupMemberRole(
       groupID: 'your_group_id',
       userID: 'target_user_id',
       role: GroupMemberRoleTypeEnum.V2TIM_GROUP_MEMBER_ROLE_ADMIN
   );
   
   // Listen for the role change
   TencentImSDKPlugin.v2TIMManager.addGroupListener(listener: V2TimGroupListener(
     onGrantAdministrator: (String groupID, V2TimGroupMemberInfo info, List<V2TimGroupMemberInfo> infolist){},
     onRevokeAdministrator: (String groupID, V2TimGroupMemberInfo info, List<V2TimGroupMemberInfo> infolist){},
   ));
   ```

## Transferring Group Ownership

The group owner can call [transferGroupOwner](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/transferGroupOwner.html) to transfer the group ownership to a group member.

After the group ownership is transferred, all the group members will receive the [`onGroupInfoChanged`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimGroupListener/V2TimGroupListener/onGroupInfoChanged.html) callback. Here, the `type` of `V2TIMGroupChangeInfo` is `V2TIMGroupChangeInfo.V2TIM_GROUP_INFO_CHANGE_TYPE_OWNER`, and the value is the `UserID` of the new group owner.

Sample code:
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().transferGroupOwner(
    groupID: 'your_group_id',
    userID: 'target_user_id'
);
```

## Getting the Number of Online Group Members

Call [`getGroupOnlineMemberCount`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupOnlineMemberCount.html) to get the number of online group members.

> **Note: **
> - This API is only supported in audio-video groups (AVChatRoom) before SDK 7.3 version.
> - You can call this API for all kinds of groups in SDK 7.3 and later versions.

Sample code:
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager.getGroupManager().getGroupOnlineMemberCount(
    groupID: 'your_group_id'
);
```

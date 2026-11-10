---
sync_node_id: '108053290134577152'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群成员资料"
  - "Flutter"
product: "chat"
---
## Feature Description

The methods to manipulate the group member profile are in the `TencentImSDKPlugin.v2TIMManager.getGroupManager()` core class.

## Getting the Profile of a Group Member

Call `getGroupMembersInfo` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMembersInfo.html)) to get the group member profile. This API supports passing in multiple `userID` values at a time to batch get group member profiles and therefore improve the network transfer efficiency.

Sample code:
``` dart
// Get the group member profile
V2TimValueCallback<List<V2TimGroupMemberFullInfo>> memberInfos = await groupManager.getGroupMembersInfo(groupID: "groupID", memberList: ["id1"]);
```

## Modifying the Profile of a Group Member

The group owner or admin can call the `setGroupMemberInfo` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupMemberInfo.html)) to modify the group name card (`nameCard`), custom field (`customInfo`), and other information of a group member.

Sample code:
``` java
// Set the group member profile
groupManager.setGroupMemberInfo(groupID: "",userID: "",nameCard: "",customInfo: {});
```

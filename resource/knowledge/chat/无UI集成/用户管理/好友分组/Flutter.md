---
sync_node_id: '108053281757503488'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "好友分组"
  - "Flutter"
product: "chat"
---
## Feature Description

To group friends into categories such as "Classmates at university" and "Coworkers", call the following APIs.

## Friend List

### Creating a friend list

Call the `createFriendGroup` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/createFriendGroup.html)) to create a friend list.

Sample code:
``` dart
// Create a friend list and add a friend to the list
V2TimValueCallback<List<V2TimFriendOperationResult>> friendgroups = await friendshipManager.createFriendGroup(groupName: "Friend list 1",userIDList: ['user1']);
```

### Deleting a friend list

Call the `deleteFriendGroup` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFriendGroup.html)) to delete a friend list.

Sample code:
``` dart
// Delete a friend list
V2TimCallback deleteFriendsgroup = await friendshipManager.deleteFriendGroup(groupNameList: ['Friend list 1']);
```

### Renaming a friend list

Call the `renameFriendGroup` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/renameFriendGroup.html)) to rename a friend list.

Sample code:
``` dart
// Rename a friend list
V2TimCallback rename = await friendshipManager.renameFriendGroup(newName: "New friend list 1",oldName: 'Friend list 1');
```

### Getting a friend list

Call the `getFriendGroups` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getFriendGroups.html)) to get a friend list.

Sample code:
``` dart
// Get the information of a friend list by list name
V2TimValueCallback<List<V2TimFriendGroup>> friendGrous = await friendshipManager.getFriendGroups(groupNameList: ['Friend list 1']);
```

### Adding a friend to a list

Call the `addFriendsToFriendGroup` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addFriendsToFriendGroup.html)) to add a friend to a list.

Sample code:
``` dart
// Add a friend to a friend list
V2TimValueCallback<List<V2TimFriendOperationResult>> addToFrindgroups = await friendshipManager.addFriendsToFriendGroup(groupName: "Friend list 1",userIDList: ['user1']);
```

### Removing a friend from a list

Call `deleteFriendsFromFriendGroup` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFriendsFromFriendGroup.html)) to remove a friend from a list.

Sample code:
``` dart
// Remove a friend from a list
V2TimValueCallback<List<V2TimFriendOperationResult>> deletefromFriendsGrousps = await friendshipManager.deleteFriendsFromFriendGroup(groupName: "Friend list 1", userIDList: ['user1']);
```

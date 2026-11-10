---
sync_node_id: '108053285151744000'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "黑名单"
  - "Flutter"
product: "chat"
---
## Feature Description

To block a user's messages, add the user to the blocklist.

## Blocklist

### Blocking a user

Call the `addToBlackList` API ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/addToBlackList.html)) to add a user to the blocklist, that is, block the user.

By default, a blocked user does not know that he/she is "blocked". After the user sends a message, the error code indicating that he/she has been blocked will not be returned.

To have the "**You have been blocked by the user**" error message returned after a blocked user sends a message, you can log in to the [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Set **Blocked User Message Sending Status**. Choose **Show as failed**, when a blocked user sends a message, a failure message appears, and the SDK receives [error code 20007](https://trtc.io/document/34348).
``` dart
// Add a user to the blocklist
V2TimValueCallback<List<V2TimFriendOperationResult>> addBlackList = await friendshipManager.addToBlackList(userIDList: ['user1']);
```

### Unblocking a user

Call `deleteFromBlackList` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/deleteFromBlackList.html)) to remove a user from the blocklist, after which messages from the user can be received.
``` dart

// Remove a user from the blocklist
V2TimValueCallback<List<V2TimFriendOperationResult>> deleteBlackList = await friendshipManager.deleteFromBlackList(userIDList: ['user1']);
```

### Getting the blocklist

Call `getBlackList` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_friendship_manager/V2TIMFriendshipManager/getBlackList.html)) to view how many users have been blocked and manage them.
``` dart
// Get the blocklist
V2TimValueCallback<List<V2TimFriendInfo>> blacklist = await friendshipManager.getBlackList();
```

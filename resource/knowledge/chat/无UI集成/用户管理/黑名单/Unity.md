---
sync_node_id: '108053285486239744'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "黑名单"
  - "Unity"
product: "chat"
---
## Feature Description

To block a user's messages, add the user to the blocklist.

## Blocklist

### Blocking a user

Call the `FriendshipAddToBlackList` API ([Details](https://comm.qq.com/im/doc/unity/en/api/FriendshipApi/FriendshipAddToBlackList.html)) to add a user to the blocklist, that is, block the user.

By default, a blocked user does not know that he/she is "blocked". After the user sends a message, the error code indicating that he/she has been blocked will not be returned.

To have the "**You have been blocked by the user**" error message returned after a blocked user sends a message, you can log in to the [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Set **Blocked User Message Sending Status**. Choose **Show as failed**, when a blocked user sends a message, a failure message appears, and the SDK receives [error code 20007](https://trtc.io/document/34348).
``` c#
// Add a user to the blocklist
List<string> param = new List<string>
  {
    "user_id"
  };
TIMResult res = TencentIMSDK.FriendshipAddToBlackList(param, (int code, string desc, List<FriendResult> result, string user_data)=>{
 // Process the async logic
});
```

### Unblocking a user

Call `FriendshipDeleteFromBlackList` ([Details](https://comm.qq.com/im/doc/unity/en/api/FriendshipApi/FriendshipDeleteFromBlackList.html)) to remove a user from the blocklist, after which messages from the user can be received.
``` c#

// Remove a user from the blocklist
List<string> param = new List<string>
  {
    "user_id"
  };
TIMResult res = TencentIMSDK.FriendshipDeleteFromBlackList(param, (int code, string desc, List<FriendResult> result, string user_data)=>{
 // Process the async logic
});
```

### Getting the blocklist

Call `FriendshipGetBlackList` ([Details](https://comm.qq.com/im/doc/unity/en/api/FriendshipApi/FriendshipGetBlackList.html)) to view how many users have been blocked and manage them.
``` c#
// Get the blocklist
TIMResult res = TencentIMSDK.FriendshipGetBlackList((int code, string desc, List<FriendProfile> result, string user_data)=>{
 // Process the async logic
});
```

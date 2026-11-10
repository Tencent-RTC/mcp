---
sync_node_id: '89644534635741184'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "5. 退出房间"
  - "Web"
product: "trtc"
---
This document describes how to exit the current TRTC room and in which cases a user is forced to exit the room.

## Step 1. Enter a room

Create a trtc instance and enter a room. For detailed directions, see [Entering a Room](https://intl.cloud.tencent.com/document/product/647/48424#step2).

## Step 2. Exit the room

Call the [`trtc.exitRoom()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#exitRoom) method to exit the room and end the audio and video call.
``` javascript
await trtc.exitRoom(); 
// After the exit is successful, if you do not need to use the trtc instance later, you can call the trtc.destroy method to destroy the instance and release related resources in a timely manner. The destroyed trtc instance cannot be used again and a new instance needs to be created.
trtc.destroy();
```

**Handling being kicked out**

In addition to actively exiting the room, users may also be kicked out of the room for the following reasons.
1. `kick`: Two users with the same userId enter the same room, and the user who enters the room first will be kicked out. It is not allowed for users with the same name to enter the same room at the same time, which may cause abnormal audio and video calls between the two parties, so this situation should be avoided.

   `banned`: A user is kicked out of a TRTC room through the server's [RemoveUser](https://www.tencentcloud.com/document/product/647/34268) | [RemoveUserByStrRoomId](https://intl.cloud.tencent.com/document/product/647/39630) interface. The user will receive a kicked event, and the reason is `banned`.

2. `room-disband`: A TRTC room is dissolved through the server's [DismissRoom](https://intl.cloud.tencent.com/document/product/647/34269) | [DismissRoomByStrRoomId](https://intl.cloud.tencent.com/document/product/647/39631) interface. After the room is dissolved, all users in the room will receive a kicked event, and the reason is `room-disband`.

   At this time, the SDK will throw the [KICKED_OUT](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.EVENT.KICKED_OUT) event. There is no need to call `trtc.exitRoom()` to exit the room, and the SDK will automatically enter the exit room state.

   ``` javascript
   trtc.on(TRTC.EVENT.KICKED_OUT, error => {
     console.error(`kicked out, reason:${error.reason}, message:${error.message}`);
     // error.reason has the following situations
     // 'kick' The user with the same userId enters the same room, causing the user who enters the room first to be kicked out.
     // 'banned' The administrator removed the user from the room
     // 'room-disband' The administrator dissolved the room
   });
   ```

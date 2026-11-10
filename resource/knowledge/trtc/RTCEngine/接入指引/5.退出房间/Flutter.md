---
sync_node_id: '134687902149705728'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "5. 退出房间"
  - "Flutter"
product: "trtc"
---
This document describes how to actively exit the current TRTC room and in which cases will a user be forced to exit a room.

## Call Guidelines

### Step 1. Perform prerequisite steps

Kindly refer to the document [Importing the SDK into your project](https://www.tencentcloud.com/document/product/647/35098) for the completion of SDK import and App permission configuration.
Please .

### Step 2. Actively exit the current room

Invoke the exitRoom interface to leave the current room. The SDK will notify you via the onExitRoom(int reason) callback event once the room exit completes.
``` java
// Exit the current room
await trtcCloud.exitRoom();
```

Upon invoking the exitRoom interface, the SDK initiates the room-exit process, which entails two particularly significant tasks:
- **Key Task One: Announce Your Departure**
Notify the other users in the room that you are about to leave. They will receive a **onRemoteUserLeaveRoom** callback from the departing user, otherwise they might mistakenly think that the user has "frozen".

- **Key Task Two: Release Device Permissions**
If the user is streaming audio or video before leaving, the process of leaving requires the shutdown of the camera and microphone, as well as the release of the device's permissions.

   Therefore, if you wish to release the TRTCCloud instance, it is recommended to do so only after receiving the onExitRoom callback.

### Step 3. Be forced to exit the current room

Aside from a user's active departure from a room, there are two other scenarios in which you will receive an onExitRoom (int reason) callback:
- **Scenario One: Being ejected from the current room**
Via the server side's [RemoveUser](https://intl.cloud.tencent.com/document/product/647/34268) | [RemoveUserByStrRoomId](https://intl.cloud.tencent.com/document/product/647/39630) interface, a specific user can be ejected from a particular TRTC room. Following the ejection of this user, they will receive an onExitRoom(1) callback.

- **Scenario Two: The current room is dismissed**
Through the server side's [DismissRoom](https://intl.cloud.tencent.com/document/product/647/34269) | [DismissRoomByStrRoomId](https://intl.cloud.tencent.com/document/product/647/39631) interface, a certain TRTC room can be dismissed, and upon the dissolution of the room, all users within it will receive an onExitRoom(2) callback.

   ``` java
   onRtcListener(type, param) async {
       if (type == TRTCCloudListener.onExitRoom) {
         if (param == 0) {
             log('Exit current room by calling the 'exitRoom' api of sdk ...');
         } else if (param == 1) {
             log('Kicked out of the current room by server through the restful api...');
         } else if (param == 2) {
             log('Current room is dissolved by server through the restful api...');
         }
       }
   }
   ```

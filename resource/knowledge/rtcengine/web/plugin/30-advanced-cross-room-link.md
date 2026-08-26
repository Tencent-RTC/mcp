## Feature Description

By default, audio and video streams in different rooms are isolated, and only users in the same room can communicate via audio and video. The cross-room connection feature allows users in different rooms to communicate via audio and video.

In live streaming scenarios, this feature supports communication between anchors and allows audiences in both rooms to watch the other anchor. This document explains how to use the CrossRoom plugin to implement cross-room connections.

Cross-room connections support two modes:
- **Room-level connection**: Connect with all anchors in the target room.
- **User-level connection**: Connect with a specific anchor in the target room.

> **Note**: Room-level and user-level connections cannot be used simultaneously.

## How It Works

- **Room-level connection**: Push the audio and video streams of all anchors in the current room to the target room, and push the audio and video streams of all anchors in the target room to the current room.
- **User-level connection**: Push your own audio and video streams from the current room to the target room, and push the audio and video streams of the specified anchor in the target room to the current room.

## Steps to Use

> **Note**: Ensure your SDK version is >= v5.8.0

### 1. Start Cross-Room Connection

```js
import { CrossRoom } from 'trtc-sdk-v5/plugins/cross-room';

const trtc = TRTC.create({ plugins: [CrossRoom] });

await trtc.enterRoom({ sdkAppId, userId: 'user1', userSig, roomId: 7777 });

// Connect user1 in room 7777 with user2 in room 8888. The stream of user2 will be pushed to room 7777, and the stream of user1 will be pushed to room 8888.
await trtc.startPlugin('CrossRoom', {
  roomId: 8888,
  // Choose either roomId or strRoomId
  // strRoomId: '8888'
  userId: 'user2' // If not provided, it indicates a room-level cross-room connection
});
```

#### Parameter Description

| Parameter Name | Type     | Required | Description                              |
|----------------|----------|----------|------------------------------------------|
| roomId         | Number   | No       | Target room ID.                          |
| strRoomId      | String   | No       | Target room string-type ID, choose either roomId or strRoomId. |
| userId         | String   | No       | Anchor ID in the target room. If not provided, it indicates a room-level connection. |

---

### 2. Update Mute Status of Cross-Room Anchor

After starting a cross-room connection, the streams of anchors in the target room will be pushed to the current room, and all users in the current room can receive the audio and video streams of the anchor.

You can use the following interface to restrict the upstream capabilities (audio/main video/substream) of the cross-room anchor in the current room, affecting all users in the room.

If a certain upstream capability is disabled, users in the current room will not be able to receive or subscribe to the corresponding audio or video streams.

```js
await trtc.updatePlugin('CrossRoom', {
  updateList: [{
    roomId: 8888,
    // strRoomId: '8888'
    userId: 'user2', // If not provided, it indicates a room-level cross-room connection
    muteAudio: true,
    muteVideo: false,
    muteSubStream: false,
  }]
});
```

#### Parameter Description

| Parameter Name         | Type     | Required | Description                              |
|------------------------|----------|----------|------------------------------------------|
| updateList             | Array    | Yes      | List of cross-room anchors whose mute status needs to be updated. |
| updateList[0].roomId   | Number   | No       | Target room ID.                          |
| updateList[0].strRoomId| String   | No       | Target room string-type ID, choose either roomId or strRoomId. |
| updateList[0].userId   | String   | No       | Anchor ID in the target room. If not provided, it indicates a room-level connection. |
| updateList[0].muteAudio| Boolean  | No       | Whether to stop the audio stream of the cross-room anchor from target room. |
| updateList[0].muteVideo| Boolean  | No       | Whether to stop the main video stream of the cross-room anchor from target room. |
| updateList[0].muteSubStream| Boolean | No    | Whether to stop the substream video of the cross-room anchor from target room. |

---

### 3. Stop Cross-Room Connection

```js
await trtc.stopPlugin('CrossRoom', { roomId: 8888 }); // Stop the cross-room connection with the specified room

await trtc.stopPlugin('CrossRoom'); // Stop all cross-room connections initiated by the current user
```

#### Parameter Description

| Parameter Name | Type     | Required | Description                              |
|----------------|----------|----------|------------------------------------------|
| roomId         | Number   | No       | Target room ID.                          |
| strRoomId      | String   | No       | Target room string-type ID, choose either roomId or strRoomId. |

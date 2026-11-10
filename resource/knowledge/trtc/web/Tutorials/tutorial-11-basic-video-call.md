---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-11-basic-video-call.md'
nav_path:
  - "Tutorials"
product: "trtc"
---

## Run Demo

<div style="margin: 20px 0;">
<details class="trtc-demo-details" style="border-radius: 10px; border: 1px solid #e5e6eb; overflow: hidden; box-shadow: 0 4px 14px rgba(0,82,217,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <summary style="padding: 14px 22px; background: linear-gradient(135deg, #006eff 0%, #0052d9 100%); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; list-style: none; user-select: none; display: flex; align-items: center; gap: 10px; transition: filter 0.2s;">
    <span class="trtc-demo-arrow" style="font-size: 14px; opacity: 0.9;">▶</span>
    <span class="trtc-demo-summary-text">Click to Run Demo</span>
  </summary>
  <div style="padding: 16px; background: #fff;">
<script>
(function(){var t=null;window.addEventListener('message',function(e){if(e.data&&e.data.type==='trtc-demo-resize'){var f=document.querySelector('.trtc-demo-iframe');if(f){f.style.height=e.data.height+'px';clearTimeout(t);t=setTimeout(function(){f.style.height=e.data.height+'px'},200)}}})})();
document.querySelectorAll('.trtc-demo-details').forEach(function(d){d.addEventListener('toggle',function(){var s=d.querySelector('.trtc-demo-summary-text'),a=d.querySelector('.trtc-demo-arrow');if(d.open){s&&(s.textContent='Click to Close Demo');a&&(a.textContent='▼')}else{s&&(s.textContent='Click to Run Demo');a&&(a.textContent='▶')}})});
</script>
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Quick Start Call" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/live-streaming/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Prerequisites

1. [Register a Tencent Cloud account](https://trtc.io/) and [Create an application](https://console.trtc.io/).
2. [Get a temporary userSig](https://trtc.io/document/35166) or [Deploy an userSig issuance service](https://trtc.io/document/35166).
3. To experience the full capabilities of TRTC, it is recommended to use `http://localhost` during development and `https://[domain name]` to access the page in production. Refer to the document [Page Access Protocol Description](tutorial-05-info-browser.md#h2-3).
4. To avoid firewall security policy restrictions on normal TRTC data transmission, refer to the document [Dealing with Firewall Policies](tutorial-05-info-browser.md#h2-4) for settings.
5. To ensure the communication experience, it is recommended to perform device detection and browser compatibility testing before starting the audio and video communication. Refer to the document [Browser Compatibility Information](tutorial-05-info-browser.md#h2-2), {@tutorial 23-advanced-support-detection}.

## SDK Integration

The SDK provides UMD, ES Module type modules, and TypeScript Type Definition files to meet integration in different types of projects.

### NPM Integration

1. You can use [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install [trtc-sdk-v5](https://www.npmjs.com/package/trtc-sdk-v5) in your project.
```
npm install trtc-sdk-v5 --save
```
2. Import the module in your project script.
```javascript
import TRTC from 'trtc-sdk-v5';
```

### Script Integration

1. Add the following code to your web page:
```html
<script src="trtc.js"></script>
```

**Resource Download**
- [trtc.js](https://www.unpkg.com/trtc-sdk-v5@latest/trtc.js)
- [GitHub Repository](https://github.com/LiteAVSDK/TRTC_Web)

## SDK Usage Overview

**Basic Concepts**

When you use the TRTC Web SDK, you will encounter the following concepts:

- {@link TRTC TRTC} class, whose instance represents a local client. The object methods of TRTC provide functions such as joining a call room, previewing a local camera, publishing a local camera and microphone, and playing remote audio and video.

**Implementing the basic logic of audio and video communication**
1. Call the {@link TRTC.create TRTC.create()} method to create the {@link TRTC trtc} object.
2. Call the {@link TRTC#enterRoom trtc.enterRoom()} method to enter the room, then other users will receive the {@link module:EVENT.REMOTE_USER_ENTER TRTC.EVENT.REMOTE_USER_ENTER} event.
3. After entering the room, you can turn on the camera and microphone and publish them to the room.
   - Call the {@link TRTC#startLocalVideo TRTC.startLocalVideo()} method to turn on the camera and publish it to the room.
   - Call the {@link TRTC#startLocalAudio TRTC.startLocalAudio()} method to turn on the microphone and publish it to the room.
4. When a remote user publishes audio and video, the SDK will automatically play the remote audio by default. You need to play the remote video by:
   - Listen for the {@link module:EVENT.REMOTE_VIDEO_AVAILABLE TRTC.EVENT.REMOTE_VIDEO_AVAILABLE} event before entering the room to receive all remote user video publishing events.
   - In the event callback function, call the {@link TRTC#startRemoteVideo trtc.startRemoteVideo()} method to play the remote video.

## Creating a TRTC object

Create a {@link TRTC TRTC} object through the {@link TRTC.create TRTC.create()} method<br>

```javascript
const trtc = TRTC.create();
```

## Entering the room

Call the {@link TRTC#enterRoom trtc.enterRoom()} method to enter the room. Usually called in the click callback of the `Start Call` button.
Key parameters:

- `scene`: Real-time audio and video call mode, set to 'rtc'.
- `sdkAppId`: The sdkAppId of the audio and video application you created on Tencent Cloud.
- `userId`: User ID specified by you.
- `userSig`: User signature, [Get a temporary userSig](https://trtc.io/document/35166) or [Deploy an userSig issuance service](https://trtc.io/document/35166).
- `roomId`: Room ID specified by you, usually a unique room ID.
For more detailed parameter descriptions.enterRoom}.

```javascript
try {
  await trtc.enterRoom({ roomId: 8888, scene:'rtc', sdkAppId, userId, userSig });
  console.log('Entered the room successfully');
} catch (error) {
  console.error('Failed to enter the room ' + error);
}
```

## Turn on the camera and microphone

### Turn on the camera

Use the {@link TRTC#startLocalVideo trtc.startLocalVideo()} method to turn on the camera and publish it to the room.

```javascript
// To preview the camera image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is local-video.
const view = 'local-video';
await trtc.startLocalVideo({ view });
```

### Turn on the microphone

Use the {@link TRTC#startLocalAudio trtc.startLocalAudio()} method to turn on the microphone and publish it to the room.

```javascript
await trtc.startLocalAudio();
```

## Play remote audio and video

### Play remote audio

By default, the SDK will automatically play remote audio, and you do not need to call an API to play remote audio.

- Note: If the user has not interacted with the page before entering the room, automatic audio playback may fail due to [browser autoplay policy restrictions](tutorial-21-advanced-auto-play-policy.md). You need to refer to the [suggested handling of restricted autoplay](tutorial-21-advanced-auto-play-policy.md) for processing.
- If you do not want the SDK to automatically play audio, you can set autoReceiveAudio = false to turn off automatic audio playback when calling {@link TRTC#enterRoom trtc.enterRoom()}.
- Listen for the {@link module:EVENT.REMOTE_AUDIO_AVAILABLE TRTC.EVENT.REMOTE_AUDIO_AVAILABLE} event, record the userId with remote audio, and call the {@link TRTC#muteRemoteAudio trtc.muteRemoteAudio(userId, false)} method when you need to play audio.

### Play remote video

Listen for the {@link module:EVENT.REMOTE_VIDEO_AVAILABLE TRTC.EVENT.REMOTE_VIDEO_AVAILABLE} event before entering the room to receive all remote user video publishing events. Use the {@link TRTC#startRemoteVideo trtc.startRemoteVideo()} method to play the remote video stream when you receive the event.

```javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  // To play the video image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is `${userId}_${streamType}`
  const view = `${userId}_${streamType}`;
  trtc.startRemoteVideo({ userId, streamType, view });
});
```

## Exit the room

Call the {@link TRTC#exitRoom trtc.exitRoom()} method to exit the room and end the audio and video call.

```javascript
await trtc.exitRoom(); 
// After the exit is successful, if you do not need to use the trtc instance later, you can call the trtc.destroy method to destroy the instance and release related resources in a timely manner. The destroyed trtc instance cannot be used again and a new instance needs to be created.
trtc.destroy();
```

**Handling being kicked out**

In addition to actively exiting the room, users may also be kicked out of the room for the following reasons. At this time, the SDK will throw the {@link module:EVENT.KICKED_OUT KICKED_OUT} event. There is no need to call `trtc.exitRoom()` to exit the room, and the SDK will automatically enter the exit room state.

1. `kick`: Two users with the same userId enter the same room, and the user who enters the room first will be kicked out. It is not allowed for users with the same name to enter the same room at the same time, which may cause abnormal audio and video calls between the two parties, so this situation should be avoided.
2. `banned`: A user is kicked out of a TRTC room through the server's [RemoveUser](https://trtc.io/document/34268) | [RemoveUserByStrRoomId](https://trtc.io/document/39630) interface. The user will receive a kicked event, and the reason is `banned`.
3. `room_disband`: A TRTC room is dissolved through the server's [DismissRoom](https://trtc.io/document/34269) | [DismissRoomByStrRoomId](https://trtc.io/document/39631) interface. After the room is dissolved, all users in the room will receive a kicked event, and the reason is `room_disband`.

```javascript
trtc.on(TRTC.EVENT.KICKED_OUT, error => {
  console.error(`kicked out, reason:${error.reason}, message:${error.message}`);
  // error.reason has the following situations
  // 'kick' The user with the same userId enters the same room, causing the user who enters the room first to be kicked out.
  // 'banned' The administrator removed the user from the room
  // 'room_disband' The administrator dissolved the room
});
```

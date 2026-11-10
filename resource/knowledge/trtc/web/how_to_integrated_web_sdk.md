# Tutorial: Quick Start Call

## Prerequisites

1. [Register a Tencent Cloud account](https://trtc.io/) and [Create an application](https://console.trtc.io/).
2. [Get a temporary userSig](https://trtc.io/document/35166?platform=web&product=rtcengine&menulabel=coresdk#console) or [Deploy an userSig issuance service](https://trtc.io/document/35166?platform=web&product=rtcengine&menulabel=coresdk#formal).
3. To experience the full capabilities of TRTC, it is recommended to use `http://localhost` during development and `https://[domain name]` to access the page in production. Refer to the document [Page Access Protocol Description](./tutorial-05-info-browser.html#h2-3).
4. To avoid firewall security policy restrictions on normal TRTC data transmission, refer to the document [Dealing with Firewall Policies](./tutorial-05-info-browser.html#h2-4) for settings.
5. To ensure the communication experience, it is recommended to perform device detection and browser compatibility testing before starting the audio and video communication. Refer to the document [Browser Compatibility Information](./tutorial-05-info-browser.html#h2-2), [Check Environment and Device Before Calls](tutorial-23-advanced-support-detection.html).

## SDK Integration

The SDK provides UMD, ES Module type modules, and TypeScript Type Definition files to meet integration in different types of projects.

### NPM Integration

1. You can use [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install [trtc-sdk-v5](https://www.npmjs.com/package/trtc-sdk-v5) in your project.

```javascript
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

- [TRTC](TRTC.html) class, whose instance represents a local client. The object methods of TRTC provide functions such as joining a call room, previewing a local camera, publishing a local camera and microphone, and playing remote audio and video.

**Implementing the basic logic of audio and video communication**

1. Call the [TRTC.create()](TRTC.html#.create) method to create the [trtc](TRTC.html) object.
2. Call the [trtc.enterRoom()](TRTC.html#enterRoom) method to enter the room, then other users will receive the [TRTC.EVENT.REMOTE_USER_ENTER](module-EVENT.html#.REMOTE_USER_ENTER) event.
3. After entering the room, you can turn on the camera and microphone and publish them to the room.
   - Call the [TRTC.startLocalVideo()](TRTC.html#startLocalVideo) method to turn on the camera and publish it to the room.
   - Call the [TRTC.startLocalAudio()](TRTC.html#startLocalAudio) method to turn on the microphone and publish it to the room.
4. When a remote user publishes audio and video, the SDK will automatically play the remote audio by default. You need to play the remote video by:
   - Listen for the [TRTC.EVENT.REMOTE_VIDEO_AVAILABLE](module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) event before entering the room to receive all remote user video publishing events.
   - In the event callback function, call the [trtc.startRemoteVideo()](TRTC.html#startRemoteVideo) method to play the remote video.

## Creating a TRTC object

Create a [TRTC](TRTC.html) object through the [TRTC.create()](TRTC.html#.create) method

```javascript
const trtc = TRTC.create();
```

## Entering the room

Call the [trtc.enterRoom()](TRTC.html#enterRoom) method to enter the room. Usually called in the click callback of the `Start Call` button.
Key parameters:

- `scene`: Real-time audio and video call mode, set to 'rtc'.
- `sdkAppId`: The sdkAppId of the audio and video application you created on Tencent Cloud.
- `userId`: User ID specified by you.
- `userSig`: User signature, [Get a temporary userSig](https://trtc.io/document/35166?platform=web&product=rtcengine&menulabel=coresdk#console) or [Deploy an userSig issuance service](https://trtc.io/document/35166?platform=web&product=rtcengine&menulabel=coresdk#formal).
- `roomId`: Room ID specified by you, usually a unique room ID.
  For more detailed parameter descriptions, refer to the interface document [trtc.enterRoom()](TRTC.html#enterRoom).

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

Use the [trtc.startLocalVideo()](TRTC.html#startLocalVideo) method to turn on the camera and publish it to the room.

```javascript
// To preview the camera image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is local-video.
const view = 'local-video';
await trtc.startLocalVideo({ view });
```

### Turn on the microphone

Use the [trtc.startLocalAudio()](TRTC.html#startLocalAudio) method to turn on the microphone and publish it to the room.

```javascript
await trtc.startLocalAudio();
```

## Play remote audio and video

### Play remote audio

By default, the SDK will automatically play remote audio, and you do not need to call an API to play remote audio.

- Note: If the user has not interacted with the page before entering the room, automatic audio playback may fail due to [browser autoplay policy restrictions](./tutorial-21-advanced-auto-play-policy.html). You need to refer to the [suggested handling of restricted autoplay](./tutorial-21-advanced-auto-play-policy.html) for processing.
- If you do not want the SDK to automatically play audio, you can set autoReceiveAudio = false to turn off automatic audio playback when calling [trtc.enterRoom()](TRTC.html#enterRoom).
- Listen for the [TRTC.EVENT.REMOTE_AUDIO_AVAILABLE](module-EVENT.html#.REMOTE_AUDIO_AVAILABLE) event, record the userId with remote audio, and call the [trtc.muteRemoteAudio(userId, false)](TRTC.html#muteRemoteAudio) method when you need to play audio.

### Play remote video

Listen for the [TRTC.EVENT.REMOTE_VIDEO_AVAILABLE](module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) event before entering the room to receive all remote user video publishing events. Use the [trtc.startRemoteVideo()](TRTC.html#startRemoteVideo) method to play the remote video stream when you receive the event.

```javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  // To play the video image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is `${userId}_${streamType}`
  const view = `${userId}_${streamType}`;
  trtc.startRemoteVideo({ userId, streamType, view });
});
```

## Exit the room

Call the [trtc.exitRoom()](TRTC.html#exitRoom) method to exit the room and end the audio and video call.

```javascript
await trtc.exitRoom();
// After the exit is successful, if you do not need to use the trtc instance later, you can call the trtc.destroy method to destroy the instance and release related resources in a timely manner. The destroyed trtc instance cannot be used again and a new instance needs to be created.
trtc.destroy();
```

**Handling being kicked out**

In addition to actively exiting the room, users may also be kicked out of the room for the following reasons. At this time, the SDK will throw the [KICKED_OUT](module-EVENT.html#.KICKED_OUT) event. There is no need to call `trtc.exitRoom()` to exit the room, and the SDK will automatically enter the exit room state.

1. `kick`: Two users with the same userId enter the same room, and the user who enters the room first will be kicked out. It is not allowed for users with the same name to enter the same room at the same time, which may cause abnormal audio and video calls between the two parties, so this situation should be avoided.
2. `banned`: A user is kicked out of a TRTC room through the server's [RemoveUser](https://trtc.io/document/34268) | [RemoveUserByStrRoomId](https://trtc.io/document/39630?product=rtcengine&menulabel=serverfeaturesapis) interface. The user will receive a kicked event, and the reason is `banned`.
3. `room_disband`: A TRTC room is dissolved through the server's [DismissRoom](https://trtc.io/document/34269?product=rtcengine&menulabel=serverfeaturesapis) | [DismissRoomByStrRoomId](https://trtc.io/document/39631?product=rtcengine&menulabel=serverfeaturesapis) interface. After the room is dissolved, all users in the room will receive a kicked event, and the reason is `room_disband`.

```javascript
trtc.on(TRTC.EVENT.KICKED_OUT, error => {
  console.error(`kicked out, reason:${error.reason}, message:${error.message}`);
  // error.reason has the following situations
  // 'kick' The user with the same userId enters the same room, causing the user who enters the room first to be kicked out.
  // 'banned' The administrator removed the user from the room
  // 'room_disband' The administrator dissolved the room
});
```

# Tutorial: Switching Camera/Mic

This article mainly introduces how to switch cameras and microphones during audio and video calls.

## Switching Cameras

```javascript
// Open the camera, the default is the first camera in the camera list.
await trtc.startLocalVideo();
const cameraList = await TRTC.getCameraList();
// Switch to the second camera
if (cameraList[1]) {
  await trtc.updateLocalVideo({ option: { cameraId: cameraList[1].deviceId }});
}
// On mobile device.
// switch to front camera.
await trtc.updateLocalVideo({ option: { useFrontCamera: true }});
// switch to rear camera.
await trtc.updateLocalVideo({ option: { useFrontCamera: false }});
```

## Switching Microphones

```javascript
// Open the microphone, the default is the first microphone in the microphone list.
await trtc.startLocalAudio();
const microphoneList = await TRTC.getMicrophoneList();
// Switch to the second microphone
if (microphoneList[1]) {
  await trtc.updateLocalAudio({ option: { microphoneId: microphoneList[1].deviceId }});
}
```

# Tutorial: Screen Sharing

## Function Description

This article mainly introduces how to implement screen sharing function in TRTC Web SDK.

## Implementation Process

### 1. Start Local Screen Sharing

```javascript
const trtcA = TRTC.create();
await trtcA.enterRoom({
  scene: 'rtc',
  sdkAppId: 140000000, // Fill in your sdkAppId
  userId: 'userA', // Fill in your userId
  userSig: 'userA_sig', // Fill in userSig corresponding to userId
  roomId: 6969
})
await trtcA.startScreenShare();
```

### 2. Play Remote Screen Sharing

```javascript
const trtcB = TRTC.create();
trtcB.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  // Main video stream, generally the stream pushed by the camera
  if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
    // 1. Place a div tag with an id of `${userId}_main` on the page to play the main stream in the div tag. The business side can customize the id of the div tag. This is just an example.
    // 2. Play the main video stream
    trtcB.startRemoteVideo({ userId, streamType,  view: `${userId}_main` });
  } else {
    // Sub video stream, generally the stream pushed by screen sharing.
    // 1. Place a div tag with an id of `${userId}_screen` on the page to play the screen sharing in the div tag. The business side can customize the id of the div tag. This is just an example.
    // 2. Play screen sharing
    trtcB.startRemoteVideo({ userId, streamType, view: `${userId}_screen` });
  }
});
await trtcB.enterRoom({
  scene: 'rtc',
  sdkAppId: 140000000, // Fill in your sdkAppId
  userId: 'userB', // Fill in your userId
  userSig: 'userB_sig', // Fill in userSig corresponding to userId
  roomId: 6969
})
```

### 3. Start Camera + Screen Sharing at the Same Time

```javascript
await trtcA.startLocalVideo();
await trtcA.startScreenShare();
```

### 4. Screen Sharing + System Audio

System audio collection is supported by Chrome M74+

- On Windows and Chrome OS, the audio of the entire system can be collected.
- On Linux and Mac, only the audio of a certain page can be collected.
- Other Chrome versions, other systems, and other browsers are not supported.

```javascript
await trtcA.startScreenShare({ option: { systemAudio: true }});
```

Check `Share audio` in the pop-up dialog box, and the system audio will be mixed with the local microphone and published. Other users in the room will receive the TRTC.EVENT.REMOTE_AUDIO_AVALIABLE event.

### 5. Stop Screen Sharing

```javascript
// Stop screen sharing collection and publishing
await trtcA.stopScreenShare();
// Other users in the room will receive the TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE event, and streamType is TRTC.TYPE.STREAM_TYPE_SUB.
trtcB.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, ({ userId, streamType }) => {
   if (streamType === TRTC.TYPE.STREAM_TYPE_SUB) {
   }
})
```

In addition, users may also stop screen sharing through the browser's own button, so the screen sharing stream needs to listen for the screen sharing stop event and respond accordingly.

```javascript
// Listen for screen sharing stop event
trtcA.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
  console.log('screen sharing was stopped');
});
```

## Screen sharing in Electron

> The preferred recommendation is to use the [TRTC Electron SDK](https://trtc.io/document/35078?platform=electron&product=rtcengine&menulabel=coresdk)

Because Electron does not implement the browser-supported WebRTC standard `getDisplayMedia` interface, if a web page contains WebRTC screen share-related logic, it will not be possible to use the [TRTC Web SDK](https://trtc.io/document/41664?platform=web&product=rtcengine&menulabel=coresdk) for screen share in Electron as a normal browser. If you only want to use the [TRTC Web SDK](https://trtc.io/document/41664?platform=web&product=rtcengine&menulabel=coresdk), please refer to the following solution.

To implement screen share, you need to use Electron's API：`desktopCapturer.getSources({ types: ['window', 'screen'] })`

1. The main process `main.js` listens for the page to finish loading, gets the list of screen share sources via `desktopCapturer.getSources`, and sends the list of screen share sources to the rendering process.
2. The rendering process listens to the main process events to get a list of screen share sources.
3. Create screen share streams and push them through the [TRTC Web SDK](https://trtc.io/document/41664?platform=web&product=rtcengine&menulabel=coresdk).
   - Get the screen-sharing `MediaStream` from the system API via `navigator.mediaDevices.getUserMedia()`.
   - Pass the custom captured videoTrack in the `option` parameter of `TRTC.startScreenShare()` to push the screen sharing stream.

```javascript
// 【1】main.js Master process gets list of screen share sources
const { app, BrowserWindow, desktopCapturer, systemPreferences } = require('electron');
function createWindow () {
  const win = new BrowserWindow({
    // ...
  });
  win.loadFile('./src/index.html');
  win.webContents.on('did-finish-load', async () => {
    if (win) {
      const sources = await desktopCapturer.getSources({
        types: ["window", "screen"],
      });
      win.webContents.send("SEND_SCREEN_SHARE_SOURCES", sources);
    }
  });
}
// 【2】Render process listens to main process events to get a list of screen share sources
const { ipcRenderer } = require('electron');
let shareSourceList = [];
ipcRenderer.on('SEND_SCREEN_SHARE_SOURCES', async (event, sources) => {
  const selectContainer = window.document.getElementById('screen-share-select');
  shareSourceList = sources;
  sources.forEach(obj => {
    const optionElement = document.createElement('option');
    optionElement.innerText = `${obj.name}`;
    selectContainer.appendChild(optionElement);
  });
})
// 【3】Rendering process push screen share
async function startScreenShare() {
  const selectContainer = document.getElementById('screen-share-select');
  const selectValue = selectContainer.options[selectContainer.selectedIndex].value;
  const [ source ] = shareSourceList.filter(obj => obj.name === `${selectValue}`);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id, // screen share source id
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    });
    const trtc = TRTC.create();
    await trtc.enterRoom({
      // ...
    });
    await trtc.startScreenShare({
      option: {
        videoTrack: stream.getVideoTracks()[0],
      }
    })
  } catch (error) {
    console.error('start screen share error = ', error)
  }
}
```

## Precautions

1. [What is the main/sub video stream?](module-TYPE.html#.STREAM_TYPE_MAIN)
2. The SDK uses the `1080p` parameter configuration by default to collect screen sharing. For details, refer to the interface: [startScreenShare](TRTC.html#startScreenShare)

## Common Issues

### 1. Safari screen sharing error `getDisplayMedia must be called from a user gesture handler`

This is because Safari restricts the `getDisplayMedia` screen capture interface, which must be called within 1 second of the callback function of the user click event.

Reference: [webkit issue](https://bugs.webkit.org/show_bug.cgi?id=198040).

```javascript
// good
async function onClick() {
  // It is recommended to execute the collection logic first when onClick is executed
  await trtcA.startScreenShare();
  await trtcA.enterRoom({
    roomId: 123123,
    sdkAppId: 140000000, // Fill in your sdkAppId
    userId: 'userA', // Fill in your userId
    userSig: 'userA_sig', // Fill in userSig corresponding to userId
  });
}
// bad
async function onClick() {
  await trtcA.enterRoom({
    roomId: 123123,
    sdkAppId: 140000000, // Fill in your sdkAppId
    userId: 'userA', // Fill in your userId
    userSig: 'userA_sig', // Fill in userSig corresponding to userId
  });
  // Entering the room may take more than 1s, and the collection may fail
  await trtcA.startScreenShare();
}
```

### 2. macOS Monterey(12.2.1), device permissions need to be requested in the master process

```javascript
async function checkAndApplyDeviceAccessPrivilege() {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`
  );
  if (cameraPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('camera');
  }
  const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`
  );
  if (micPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }
  const screenPrivilege = systemPreferences.getMediaAccessStatus('screen');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`
  );
}
```

### 3. Mac Chrome screen sharing fails with the error message "NotAllowedError: Permission denied by system" or "NotReadableError: Could not start video source" when screen recording is already authorized. [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1306876). Solution: Open 【Settings】> Click 【Security & Privacy】> Click 【Privacy】> Click 【Screen Recording】> Turn off Chrome screen recording authorization > Reopen Chrome screen recording authorization > Close Chrome browser > Reopen Chrome browser.

### 4. [WebRTC screen sharing known issues and workarounds](./tutorial-02-info-webrtc-issues.html#h2-9)

# Tutorial: Setting Camera Profile

This article mainly introduces how to set video properties in video calls or interactive live broadcasts. Developers can adjust the clarity and fluency of the video according to specific business needs to obtain a better user experience. Video properties include resolution, frame rate, and bit rate.

## Implementation

Set the video properties through the [startLocalVideo()](TRTC.html#startLocalVideo) or [updateLocalVideo()](TRTC.html#updateLocalVideo) method of the trtc object:

- Specify a predefined Profile, each Profile corresponds to a set of recommended resolution, frame rate, and bit rate.

```javascript
// Specify video properties when starting
await trtc.startLocalVideo({
  option: { profile: '480p' }
});
// Dynamically adjust video properties during the call
await trtc.updateLocalVideo({
  option: { profile: '360p' }
});
```

- Specify custom resolution, frame rate, and bit rate

```javascript
// Specify video properties when starting
await trtc.startLocalVideo({
  option: { profile: { width: 640, height: 480, frameRate: 15, bitrate: 900 /* kpbs */} }
});
// Dynamically adjust video properties during the call
await trtc.updateLocalVideo({
  option: { profile: { width: 640, height: 360, frameRate: 15, bitrate: 800 /* kpbs */} }
});
```

## Video Property Profile List

| Video Profile | Resolution (Width x Height) | Frame Rate (fps) | Bitrate (kbps) | Note |
|---------------|-----------------------------|------------------|----------------|------|
| 120p_2 | 160 x 120 | 15 | 100 | v5.1.1+ |
| 180p | 320 x 180 | 15 | 350 | |
| 180p_2 | 320 x 180 | 15 | 150 | v5.1.1+ |
| 240p | 320 x 240 | 15 | 400 | |
| 240p_2 | 320 x 240 | 15 | 200 | v5.1.1+ |
| 360p | 640 x 360 | 15 | 800 | |
| 360p_2 | 640 x 360 | 15 | 400 | v5.1.1+ |
| 480p | 640 x 480 | 15 | 900 | |
| 480p_2 | 640 x 480 | 15 | 500 | Default value, v5.1.1+ |
| 720p | 1280 x 720 | 15 | 1500 | |
| 1080p | 1920 x 1080 | 15 | 2000 | |
| 1440p | 2560 x 1440 | 30 | 4860 | |
| 4K | 3840 x 2160 | 30 | 9000 | |

- Due to device and browser limitations, the video resolution may not match exactly. In this case, the browser will automatically adjust the resolution to be close to the resolution corresponding to the Profile.

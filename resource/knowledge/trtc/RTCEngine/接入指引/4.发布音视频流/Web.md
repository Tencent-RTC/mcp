---
sync_node_id: '89644534548709376'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "4. 发布音视频流"
  - "Web"
product: "trtc"
---
This document describes how an anchor publishes audio/video streams. "Publishing" refers to turning on the mic and camera to make the audio heard and video seen by other users in the room.

## Step 1. Enter Room

For detailed directions, see [Enter Room](https://www.tencentcloud.com/document/product/647/48424#step2).

## Step 2. Turn on camera

Use the [`trtc.startLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) API to turn on the camera and publish it to the room.
``` javascript
// To preview the camera image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is local-video.
const view = 'local-video';
await trtc.startLocalVideo({ view });
```

## Step 3. Turn on microphone

Use the [`trtc.startLocalAudio()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalAudio) API to turn on the microphone and publish it to the room.
``` javascript
await trtc.startLocalAudio();
```

## Step 4. Turn off camera/microphone

Use the [trtc.stopLocalVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopLocalVideo)[trtc.stopLocalAudio](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopLocalAudio) to turn off camera/microphone.

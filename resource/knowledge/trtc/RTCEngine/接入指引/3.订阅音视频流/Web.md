---
sync_node_id: '89644534456434688'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "3. 订阅音视频流"
  - "Web"
product: "trtc"
---
This document describes how to subscribe to the audio/video streams of another user (remote user) in the room, i.e., how to play the audio/video of a remote user.

## Step 1. Enter Room

For detailed directions, see [Enter Room](https://www.tencentcloud.com/document/product/647/48424#step2).

## Step 2. Play Remote Audio and Video

### Play Remote Audio

By default, the SDK will automatically play remote audio, and you do not need to call any API to play remote audio.

If you do not want the SDK to automatically play remote audio, you can: 

1. Set autoReceiveAudio = false to turn off automatic audio playback by calling [`trtc.enterRoom({ autoReceiveAudio: false })`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom).

2. Listen for the [`TRTC.EVENT.REMOTE_AUDIO_AVAILABLE`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_AUDIO_AVAILABLE) event before entering the room. 

3. Save the userId of remote user when this event fired. 

4. Call [`trtc.muteRemoteAudio(userId, false)`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#muteRemoteAudio)method when you need to play remote audio.

   > **Note：**
   > 
   > If the user has not interacted with the page before entering the room, automatic audio playback may fail due to [Browser's Autoplay Policy](https://developer.chrome.com/blog/autoplay/). You need to refer to the [Handle Autoplay Restriction](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-21-advanced-auto-play-policy.html) for processing.
   > 

### Play Remote Video
1. Listen for the [`TRTC.EVENT.REMOTE_VIDEO_AVAILABLE`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) event before entering the room to receive all remote user video publishing events. 

2. Use the [`trtc.startRemoteVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo) method to play the remote video stream when you receive the event.

   ``` javascript
   trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
     // To play the video image, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is `${userId}_${streamType}`
     const view = `${userId}_${streamType}`;
     trtc.startRemoteVideo({ userId, streamType, view });
   });
   ```

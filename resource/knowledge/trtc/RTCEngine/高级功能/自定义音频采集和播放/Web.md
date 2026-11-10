---
sync_node_id: '89644535317315584'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "自定义音频采集和播放"
  - "Web"
product: "trtc"
---
## Function Description

This article mainly introduces the advanced usage of custom capture and custom rendering.

## Custom Capture

By default, [`trtc.startLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) and [`trtc.startLocalAudio()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalAudio) enable camera and microphone capture.

If you need to customize the capture, you can specify the `option.videoTrack`/`option.audioTrack` parameter of the [`trtc.startLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) / [`trtc.startLocalAudio()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalAudio) method.

There are usually several ways to obtain `audioTrack` and `videoTrack`:
- Use [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) to capture the camera and microphone.

- Use [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) to capture screen sharing.

- Use `videoElement.captureStream` to capture the audio and video being played in the video tag.

- Use `canvas.captureStream` to capture the animation in the canvas.

### Capture the video being played in the video tag
``` javascript
// Check if your current browser supports capturing streams from video elements
if (!HTMLVideoElement.prototype.captureStream) {
  console.log('your browser does not support capturing stream from video element');
  return
}
// Get the video tag that is playing video on your page
const video = document.getElementByID('your-video-element-ID');
// Capture the video stream from the playing video
const stream = video.captureStream();
const audioTrack = stream.getAudioTracks()[0];
const videoTrack = stream.getVideoTracks()[0];

trtc.startLocalVideo({ option:{ videoTrack } });
trtc.startLocalAudio({ option:{ audioTrack } });
```

### Capture the animation in the canvas
``` javascript
// Check if your current browser supports capturing streams from canvas elements
if (!HTMLCanvasElement.prototype.captureStream) {
  console.log('your browser does not support capturing stream from canvas element');
  return
}
// Get your canvas tag
const canvas = document.getElementByID('your-canvas-element-ID');

// Capture a 15 fps video stream from the canvas
const fps = 15;
const stream = canvas.captureStream(fps);
const videoTrack = stream.getVideoTracks()[0];

trtc.startLocalVideo({ option:{ videoTrack } });
```

## Custom Rendering

By default, when calling [`trtc.startLocalVideo(view)`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) or [`trtc.startRemoteVideo(view, streamType, userId)`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo), you need to pass in the `view` parameter. The SDK will create a `video` tag under the specified element tag to play the video.

If you need to customize the rendering, and do not need the SDK to play the video, you can
- Do not fill in the `view` parameter or pass in `null` when calling the `startLocalVideo` or `startRemoteVideo` method.

- Use the [`trtc.getVideoTrack(userId, streamType)`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#getVideoTrack) method to obtain the corresponding `videoTrack`.

- Use your own player for video rendering.

- After using this custom rendering method, the [`EVENT.VIDEO_PLAY_STATE_CHANGED`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.VIDEO_PLAY_STATE_CHANGED) event will not be triggered. You need to listen to the `mute/unmute/ended` events of the video track [`MediaStreamTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) to determine the status of the current video data stream.

- For remote video, you also need to listen to the [`EVENT.REMOTE_VIDEO_AVAILABLE`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) and [`EVENT.REMOTE_VIDEO_UNAVAILABLE`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_VIDEO_UNAVAILABLE) events to handle the lifecycle of remote video.

### Custom rendering of local video
``` javascript
await trtc.startLocalVideo();
const videoTrack = trtc.getVideoTrack();

// Use your own player for video rendering
const videoElement = document.getElementById('video-element');
videoElement.srcObject = new MediaStream([videoTrack]);
videoElement.play();

```

### Custom rendering of remote video
``` javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, async ({ userId, streamType }) => {
  // Only pull the stream, do not play it
  await trtc.startRemoteVideo({ userId, streamType })
  const videoTrack = trtc.getVideoTrack({ userId, streamType });

  // Use your own player for video rendering
  const videoElement = document.getElementById('remote-video-element');
  videoElement.srcObject = new MediaStream([videoTrack]);
  videoElement.play();
});
```

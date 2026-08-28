
## Function Description
This article mainly introduces the advanced usage of custom capture and custom rendering.

## Custom Capture

By default, {@link TRTC#startLocalVideo startLocalVideo()} and {@link TRTC#startLocalAudio startLocalAudio()} will start camera and microphone, {@link TRTC#startScreenShare trtc.startScreenShare()} will start screen sharing.

If you need to customize the capture:

- `trtc.startLocalAudio({ option: { audioTrack }})`
  - After passing this parameter, the SDK will not capture the microphone and use the custom audioTrack to publish the stream.
  - If microphoneId and audioTrack are set at the same time, the capture priority is microphoneId > audioTrack, but it is not recommended to mix them.
- `trtc.startLocalVideo({ option: { videoTrack }})`
  - After passing this parameter, the SDK will not capture the camera, the custom captured videoTrack will be published as main stream.
  - If you set cameraId, useFrontCamera, videoTrack at the same time, the capture priority is cameraId > useFrontCamera > videoTrack, but it is not recommended to mix them.
- `trtc.startScreenShare({ option: { videoTrack }})`
  - After passing this parameter, the SDK will not capture screen share, the custom captured videoTrack will be published as sub stream.

There are usually several ways to obtain audioTrack and videoTrack:

- Use [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) to capture the camera and microphone.
- Use [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) to capture screen sharing.
- Use [videoElement.captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) to capture the audio and video being played in the video tag.
- Use [canvas.captureStream](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) to capture the animation in the canvas.

### Capture the video being played in the video tag

```javascript
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

```javascript
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

By default, when calling {@link TRTC#startLocalVideo startLocalVideo()} or {@link TRTC#startRemoteVideo startRemoteVideo()}, you need to pass in the view parameter. The SDK will create a `video` tag under the specified element tag to play the video.

If you need to customize the rendering, and do not need the SDK to play the video, you can

- Do not fill in the view parameter or pass in null when calling the startLocalVideo or startRemoteVideo method.
- Listen the TRTC.EVENT.TRACK, SDK will fires this event when there has a new MediaStreamTrack, then you can get the MediaStreamTrack for custom rendering.
- Use your own player for video rendering.
- If you using the custom rendering, the {@link module:EVENT.VIDEO_PLAY_STATE_CHANGED VIDEO_PLAY_STATE_CHANGED} event will not be fired. You need to listen to the `mute/unmute/ended` events of the video track [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) to determine the status of the current video data stream.
- For remote video, you also need to listen to the {@link module:EVENT.REMOTE_VIDEO_AVAILABLE REMOTE_VIDEO_AVAILABLE} and {@link module:EVENT.REMOTE_VIDEO_UNAVAILABLE REMOTE_VIDEO_UNAVAILABLE} events to handle the lifecycle of remote video.

### Custom rendering by TRTC.EVENT.TRACK

```javascript
trtc.on(TRTC.EVENT.TRACK, event => {
  const isLocal = event.userId === ''; // userId === '' means event.track is a local track, otherwise it's a remote track
  const isSubStream = event.streamType === TRTC.TYPE.STREAM_TYPE_SUB; // Usually the sub stream is a screen-sharing video stream.
  const mediaStreamTrack = event.track;
  const kind = event.track.kind; // audio or video
})
```

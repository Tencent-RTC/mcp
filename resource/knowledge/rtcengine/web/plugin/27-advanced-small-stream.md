
## Function Description

In the multi-person video call scenario, as the number of streaming users increases, both bandwidth consumption and device performance consumption will rise for users who are subscribing streams. If no optimization is done, the experience on low-end and mid-range devices will be greatly compromised.

This article mainly introduces the best practices for multi-person video scenarios, using the "small streams + only subscribe video streams from the visible area" feature to reduce bandwidth consumption and ensure the best call experience.

## Enable small stream

The small stream refers to encoding two video streams at the same time when the camera is turned on. One is a normal resolution video (referred to as the main stream), and the other is a low-resolution video (referred to as the small stream). At the receiving end, you can choose to receive the main stream or the small stream to save bandwidth.

Applicable scenarios: The small stream is suitable for multi-person audio and video communication scenarios. Generally, in the page layout of multi-person communication scenarios, there will be "a big view and a lot of small view". The video in the big view is the main stream, and the video in the small view is the small stream. This function will increase the upstream bandwidth slightly, but it can greatly save the downstream bandwidth.

### Implementation Steps

#### Enable small streams on the publishing end

When calling [startLocalVideo](TRTC.md#startLocalVideo), set the small parameter to enable small stream encoding. In an environment that does not support enabling small streams, the small parameter will not take effect and will not report an error.

```js
await trtc.startLocalVideo({ option: { small: '120p' }});
```

Since version 5.3.0+, you can turn on/off dynamically the small stream.

```js
await trtc.startLocalVideo();

// turn on small stream
await trtc.updateLocalVideo({ option: { small: '120p' }});

// turn off small stream
await trtc.updateLocalVideo({ option: { small: false }});
```

#### Subscribe the big stream or the small stream on the receiving end

When calling [startRemoteVideo](TRTC.md#startRemoteVideo), set the small parameter to subscribe the small stream. Otherwise, the big stream is subscribed by default. When subscribing the small stream, there is no need to check whether the remote user has published the small stream in advance. If the remote end does not publish the small stream, the SDK will automatically subscribe the big stream.

```js
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  trtc.startRemoteVideo({
    view: '', // Pass in the elementId or element instance object of the video container.
    userId,
    streamType,
    option: { small: true }
  });
})
```

Switch to the specified userId's small stream when filling in the small parameter during updateRemoteVideo. It is commonly used to implement the following functions: when the user clicks the "small view", play remote video on "big view"; when the user clicks the "big view", play remote video on "small view".

```js
// Switch to "big view" playback when the user clicks the "small view".
await trtc.updateRemoteVideo({
  view: '', // Pass in the elementId or element instance object of the "big view" video container.
  userId: '', // Pass in the userId of the remote user.
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  option: { small: false }
})
// Switch to "small view" playback when the user clicks the "big view".
await trtc.updateRemoteVideo({
  view: '', // Pass in the elementId or element instance object of the "small view" video container.
  userId: '', // Pass in the userId of the remote user.
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  option: { small: true }})
```

### Note

1. TRTC's video stream has a main stream and an sub stream. The main stream includes the big stream and the small stream, and the sub stream is generally used for screen sharing.
2. When subscribing the stream, the main stream defaults to subscribe the big stream, and the small parameter can be used to subscribe the small stream.

    Supports subscribe the big stream + sub stream, small stream + sub stream, and does not support subscribe the big stream + small stream at the same time. The big stream and the small stream are played in the same video view.

3. Only when the publishing end enables the small stream, the remote stream will be switched to the small stream when the small parameter is specified. If there is no small stream, the SDK will automatically subscribe the big stream.
4. There is currently no event notification for successful switching between big and small streams.
5. The small stream resolution cannot be larger than the resolution of the big stream. Otherwise, the setting will be invalid and the original small stream resolution (default 120p) will be kept.
6. The actual encoding resolution of the small stream will be modified according to the aspect ratio of the big stream, and the aspect ratio of the big stream and the small stream will be consistent.

## Enable "receiveWhenViewVisible"

In general, in a multi-person video scenario, due to limited page space, the streaming end will not display all videos on the page. Therefore, for those remote videos that do not need to be displayed on the page, they do not need to be streamed. Only when the view is visible should the video stream be pulled. This is to save traffic and reduce performance overhead.

Implementing this feature is not easy. Starting with version 5.4.0, the SDK has built-in support for this feature. You only need to set the `receiveWhenViewVisible` and `viewRoot` parameters when calling [startRemoteVideo](TRTC.md#startRemoteVideo) to enable this feature, which is very convenient and fast. The SDK will automatically check the visibility state of the `view` passed in when startRemoteVideo. Video streaming will start when the `view` is visible and stop when `view` is not visible.

### Sample code

Assuming your DOM structure for playing videos is as follows:

```html
<div id='view-list'>
  <div id='view1_main'></div>
  <div id='view2_main'></div>
  <div id='view3_main'></div>
</div>
```

```js
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  trtc.startRemoteVideo({
    view: 'view1_main',
    userId,
    streamType,
    option: {
      small: true,
      receiveWhenViewVisible: true, // Enable "only subscribe video streams from the visible area"
      viewRoot:  document.getElementById('view-list') // Pass in the first-level parent element of all view list, which is used to calculate the reference relationship between view and viewRoot and check whether the view is visible. The default value is document.body.
    }
  });
})
```

### Add loading effect for better user experience

After enabling this feature, when the user scrolls through the video list:

- When the view changes from visible to invisible, the SDK will stop streaming.
- When the view changes from invisible to visible, the SDK will resume streaming.

Since resuming streaming until the video playback is successful is an asynchronous process, a black screen may appear during this process. To provide a better user experience, we recommend adding a loading effect to the video area during this asynchronous process. You can .

```js
let isLoading = true;

trtc.on(TRTC.EVENT.VIDEO_PLAY_STATE_CHANGED, ({ userId, streamType, state }) => {
  // '' is local video
  if (userId === '') return;

  // set isLoading to false when remote video is playing.
  isLoading = state !== 'PLAYING';

  // You can confirm which remote user's main/sub stream playback state has changed by userId and streamType.
});
await trtc.startRemoteVideo({  });

trtc.stopRemoteVideo()
isLoading = false;
```

## FAQ

1. How does the SDK confirm whether a view is visible?

    When any pixel point of the view appears in the viewRoot area, the view is considered visible; conversely, when all pixel points of the view are not in the viewRoot area, the view is considered invisible.

2. Do I need to consider browser compatibility for big and small streams?

    Although some browsers do not support enabling big and small streams (such as all browsers on iOS systems and Chrome versions below 63), enabling small stream has no side effects. If the environment does not support it, the SDK will only use the main stream, and the call can proceed normally. You do not need to write additional if-else statements.

    You can call {@link TRTC.isSupported TRTC.isSupported} to get checkResult.detail.isSmallStreamSupported to confirm whether the current environment supports enabling small stream.

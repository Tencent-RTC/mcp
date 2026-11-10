---
sync_node_id: '121891908216991744'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "视频画面旋转和缩放"
  - "Web"
product: "trtc"
---
This section mainly introduces how to control the mirror and fill mode of video rendering through TRTC Web SDK

> **Note：**
> This tutorial is based on the 5.x TRTC Web SDK. If you are using the 4.x version SDK, you can refer to the [objectFit attribute of stream.play](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/Stream.html#play).
> 

## Mirror

There are 2 ways to control the rendering mirror effects of local and remote videos, respectively are [trtc.startLocalVideo({ option: { mirror: true } })](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/Stream.html#play) and [trtc.startRemoteVideo({ option: { mirror: true }})](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo).
``` jsx
// Local camera rendering image, the default is true
await trtc.startLocalVideo({ option: { mirror: true }});

// Dynamically updating parameters
await trtc.updateLocalVideo({ option: { mirror: false }});

trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, async ({ userId, streamType }) => {
  await trtc.startRemoteVideo({ 
    userId, 
    streamType, 
    // You need to pre-place the video container in the DOM. 
    // It is recommended to use '${userId}_${streamType}' as the element id.
    view: `${userId}_${streamType}`,
    // Mirror the remote video. The default value is false
    option: { mirror: true }
    });
    
  // Dynamically updating parameters
  await trtc.updateRemoteVideo({ userId, streamType, option: { mirror: false }})
});
```

> **Note：**
> The mirroring effect is only used for rendering, and there is no mirroring effect on the actual encoded or decoded picture. You can use the [custom collection method of canvas](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo) to flip the canvas to achieve the effect of coding mirror.
> 

## Fill

There are 2 ways to control the rendering fill mode of local and remote videos, respectively are  [trtc.startLocalVideo({ option: { fillMode: 'cover' } })](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) and [trtc.startRemoteVideo({ option: { fillMode: 'cover' }})](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo).

Parameters：
- `contain` Keep the aspect ratio and display the full picture in the target container. If the aspect ratio does not match the target container, it will be filled with a black edge. You are advised to use this parameter for screen sharing.

- `cover` A default value, retaining the aspect ratio, is displayed in the target container, and if the aspect ratio does not match the target container, the screen is cropped to fill the entire target container.

- `fill` The aspect ratio is not retained and is displayed in the target container. If the aspect ratio does not match the target container, the screen is stretched to fill the entire template container.

   Refer to: [CSS object-fit ](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

   ``` jsx
   // Local camera fill mode, default is cover
   await trtc.startLocalVideo({ option: { fillMode: 'cover' }});
   
   // Dynamically updating parameters
   await trtc.updateLocalVideo({ option: { fillMode: 'contain' }});
   
   trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, async ({ userId, streamType }) => {
     await trtc.startRemoteVideo({ 
       userId, 
       streamType, 
       // You need to pre-place the video container in the DOM. 
       // It is recommended to use '${userId}_${streamType}' as the element id.
       view: `${userId}_${streamType}`,
       option: { fillMode: 'contain' }
       });
       
     // Dynamically updating parameters
     await trtc.updateRemoteVideo({ userId, streamType, option: { fillMode: 'cover' }})
   });
   ```

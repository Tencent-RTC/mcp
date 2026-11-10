---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-14-basic-set-video-profile.md'
nav_path:
  - "Tutorials"
  - "Video"
product: "trtc"
---

This article mainly introduces how to set video properties in video calls or interactive live broadcasts. Developers can adjust the clarity and fluency of the video according to specific business needs to obtain a better user experience. Video properties include resolution, frame rate, and bit rate.

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Setting Camera Profile" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/set-encoding-profile/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Implementation

Set the video properties through the {@link TRTC#startLocalVideo startLocalVideo()} or {@link TRTC#updateLocalVideo updateLocalVideo()} method of the trtc object:

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
| :---       | :---           | :---      | :---      | :--- |
| 120p_2       | 160 x 120      | 15        | 100        | v5.1.1+ |
| 180p       | 320 x 180      | 15        | 350       ||
| 180p_2       | 320 x 180      | 15        | 150       | v5.1.1+ |
| 240p       | 320 x 240      | 15        | 400       ||
| 240p_2       | 320 x 240      | 15        | 200       | v5.1.1+ |
| 360p       | 640 x 360      | 15        | 800       ||
| 360p_2       | 640 x 360      | 15        | 400       | v5.1.1+ |
| 480p       | 640 x 480      | 15        | 900       ||
| 480p_2       | 640 x 480      | 15        | 500       | Default value, v5.1.1+ |
| 720p       | 1280 x 720     | 15        | 1500      ||
| 1080p      | 1920 x 1080    | 15        | 2000      ||
| 1440p      | 2560 x 1440    | 30        | 4860      ||
| 4K         | 3840 x 2160    | 30        | 9000      ||

- Due to device and browser limitations, the video resolution may not match exactly. In this case, the browser will automatically adjust the resolution to be close to the resolution corresponding to the Profile.

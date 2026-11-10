---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-13-basic-switch-camera-mic.md'
nav_path:
  - "Tutorials"
  - "Device & Environment"
product: "trtc"
---

This article mainly introduces how to switch cameras and microphones during audio and video calls.

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Switching Camera/Mic" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/media-device/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Switching Cameras

```js
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

```js
// Open the microphone, the default is the first microphone in the microphone list.
await trtc.startLocalAudio();

const microphoneList = await TRTC.getMicrophoneList();
// Switch to the second microphone
if (microphoneList[1]) {
  await trtc.updateLocalAudio({ option: { microphoneId: microphoneList[1].deviceId }});
}
```

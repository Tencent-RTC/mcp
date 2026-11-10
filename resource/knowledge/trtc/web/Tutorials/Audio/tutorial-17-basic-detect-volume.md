---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-17-basic-detect-volume.md'
nav_path:
  - "Tutorials"
  - "Audio"
product: "trtc"
---

## Function Description

This article mainly introduces how to detect the volume size.

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Detect Audio Volume" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/audio-volume/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

Volume size judgment is mainly applied to:

- Detect the volume of the local microphone
- Detect the volume of remote users

## Implementation Steps
Listen to the {@link module:EVENT.AUDIO_VOLUME TRTC.EVENT.AUDIO_VOLUME} event, and then call {@link TRTC#enableAudioVolumeEvaluation enableAudioVolumeEvaluation()} to enable the volume callback event.

```javascript
trtc.on(TRTC.EVENT.AUDIO_VOLUME, event => {
    event.result.forEach(({ userId, volume }) => {
        const isMe = userId === ''; // When userId is an empty string, it represents the volume of the local microphone.
        if (isMe) {
            console.log(`my volume: ${volume}`);
        } else {
            console.log(`user: ${userId} volume: ${volume}`);
        }
    })
});

// Enable volume callback and trigger the event every 500ms
trtc.enableAudioVolumeEvaluation(500);
// For performance reasons, when the page switches to the background, the SDK will not throw volume callback events. If you need to receive volume callback events when the page is switched to the background, you can set this parameter to true.
trtc.enableAudioVolumeEvaluation(500, true);

// To turn off the volume callback, pass in an interval value less than or equal to 0
trtc.enableAudioVolumeEvaluation(-1);
```

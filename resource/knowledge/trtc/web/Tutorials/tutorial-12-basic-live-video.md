---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-12-basic-live-video.md'
nav_path:
  - "Tutorials"
product: "trtc"
---
## Function Description

This article mainly introduces how to implement the audio and video call function of the interconnection live broadcast scene.

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Interactive Live Streaming" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/live-streaming/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Anchor

The process of implementing audio and video calls on the anchor side is basically the same as the implementation process of the {@link module:TYPE.SCENE_RTC TRTC.TYPE.SCENE_RTC} scene. Refer to: [Start integrating audio and video calls](tutorial-11-basic-video-call.md).

The main difference is the screne and role parameters set when entering the room.

```js
await trtc.enterRoom({ sdkAppId, userId, userSig, roomId, scene: TRTC.TYPE.SCENE_LIVE, role: TRTC.TYPE.ROLE_ANCHOR });
```

## Audience

### Enter the room as an audience

Set the role parameter to TRTC.TYPE.ROLE_AUDIENCE.

```javascript
await trtc.enterRoom({ roomId, sdkAppId, userId, userSig, scene: TRTC.TYPE.SCENE_LIVE, role: TRTC.TYPE.ROLE_AUDIENCE })
```

### Play remote audio

By default, the SDK will automatically play remote audio, and you do not need to call the API to play remote audio.

- Note: If the user has not interacted with the page before entering the room, automatic audio playback may fail due to the [automatic playback policy restrictions of the browser], and you need to refer to [suggestions for handling restricted automatic playback](tutorial-21-advanced-auto-play-policy.md).
- If you do not want the SDK to automatically play audio, you can set autoReceiveAudio = false to turn off automatic audio playback when {@link TRTC#enterRoom trtc.enterRoom()}.
- Listen to the {@link module:EVENT.REMOTE_AUDIO_AVAILABLE TRTC.EVENT.REMOTE_AUDIO_AVAILABLE} event, record the userId with remote audio, and call the {@link TRTC#muteRemoteAudio trtc.muteRemoteAudio(userId, false)} method when you need to play audio.

### Play remote video

Listen to the {@link module:EVENT.REMOTE_VIDEO_AVAILABLE TRTC.EVENT.REMOTE_VIDEO_AVAILABLE} event before entering the room. When you receive this event, play the remote video stream through {@link TRTC#startRemoteVideo trtc.startRemoteVideo()}.

```javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  // To play the video, you need to place an HTMLElement in the DOM, which can be a div tag, assuming its id is `${userId}_${streamType}`
  const view = `${userId}_${streamType}`;
  trtc.startRemoteVideo({ userId, streamType, view });
});
```

### Connect with the anchor for interaction

The audience role does not have the permission to publish audio and video, so if the audience wants to interact with the anchor, they need to switch to the anchor role using {@link TRTC#switchRole switchRole} and then publish audio and video streams.

```javascript
// Switch to the anchor to go on the air
await trtc.switchRole(TRTC.TYPE.ROLE_ANCHOR);

// Turn on the microphone after going on the air
await trtc.startLocalAudio();
// Turn on the camera after going on the air
await trtc.startLocalVideo();

// After the interaction is over, call exitRoom to exit the room and end the interaction.
await trtc.exitRoom();
```

---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-46-advanced-data-messages.md'
nav_path:
  - "Tutorials"
  - "Others"
product: "trtc"
---
In real-time audio/video calls, besides the media streams, you may also need to send application-level data messages to other users in the room, such as bullet comments, likes, quiz status, game commands, etc. TRTC Web SDK provides two ways to transmit data messages: Custom Message and SEI (Supplemental Enhancement Information) Message.

- **Custom Message**: Sent through an independent data channel, unrelated to audio/video streams. Suitable for transmitting control commands, status synchronization, and other text or binary data with high real-time requirements.
- **SEI Message**: Embedded in the header of video frames and sent along with the video stream. Suitable for information strongly associated with the video image, such as live quiz countdowns, video coordinate annotations, lyrics synchronization, etc. 

## Demo

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Data Messages" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/advance-features/data-messages/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Custom Message
- Supported SDK version: v5.6.0+

- Only [TRTC.TYPE.ROLE_ANCHOR](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-TYPE.html#.ROLE_ANCHOR) can call [trtc.sendCustomMessage](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#sendCustomMessage).

- You should call this api after [TRTC.enterRoom](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom) successfully.

- The custom message will be sent in order and as reliably as possible, but it's possible to loss messages in a very bad network. The receiver will also receive the message in order.

### Send Custom Message
| Name | Type | Description |
| --- | --- | --- |
| cmdId | number | - <code>required</code><br>- message Id. Integer, range [1, 10].<br>- You can set different cmdId for different types of messages to reduce the delay of transferring message. |
| data | ArrayBuffer | - <code>required</code><br>- message data.<br>- Maximum 1KB(Byte) sent in a single call.<br>- Maximum 30 calls per second<br>- Maximum 8KB sent per second. |

``` javascript
const trtc = TRTC.create();
await trtc.enterRoom({ sdkAppId, userId, userSig, roomId: 12345 })
// send custom message
const data = new TextEncoder().encode('hello').buffer;
trtc.sendCustomMessage({ cmdId: 1, data });
```

### Receive Custom Message

Listen for the event [TRTC.EVENT.CUSTOM_MESSAGE](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.CUSTOM_MESSAGE) to receive custom message.
``` javascript
// receive custom message
trtc.on(TRTC.EVENT.CUSTOM_MESSAGE, event => {
   // event.userId: remote userId.
   // event.cmdId: message cmdId.
   // event.seq: message sequence number.
   // event.data: custom message data, type is ArrayBuffer.
   console.log(`received custom msg from ${event.userId}, message: ${new TextDecoder().decode(event.data)}`)
})
```

## SEI Message

The header of a video frame has a header block called supplemental enhancement information (**SEI**). It is additional data inserted into the video bitstream to convey extra information. You can add a lot of information into SEI, such as parameters of the camera or encoder; time; closed captions; lyrics; and copyright info.

### Send SEI Message

You can use [trtc.sendSEIMessage](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#sendSEIMessage) to send SEI message. Because the SEI is inserted to the video stream, you should call it after you started local video.
``` javascript
// 1. enable SEI
const trtc = TRTC.create({ enableSEI: true })
// 2. enter room & start local video
await trtc.enterRoom({ sdkAppId, userId, userSig, roomId: 12345 })
await trtc.startLocalVideo();
// 3. send SEI
const unit8Array = new Uint8Array([1, 2, 3]);
trtc.sendSEIMessage(unit8Array.buffer);
```

> **Note:**
> 1. Supported SDK version: v5.3.0+. Supported browsers: Chrome 86+, Edge 86+, Opera 72+ browsers(Chromium Based Browser M86+).
> 2. Maximum 1KB(Byte) sent in a single call, maximum 30 calls per second, maximum 8KB sent per second.
> 3. Since SEI is sent along with video frames, there is a possibility that video frames may be lost due to poor network, and therefore SEI may be lost as well. The number of times it can be sent can be increased within the frequency limit, and the business side needs to do message de-duplication on the receiving side.
> 4. SEI cannot be sent without [trtc.startLocalVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) and cannot be received without [trtc.startRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo).
> 5. H.264 and H.265 encoders are supported.

### Receive SEI Message

Refer to [TRTC.EVENT.SEI_MESSAGE](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.SEI_MESSAGE)
``` javascript
// 1. enable SEI
const trtc = TRTC.create({ enableSEI: true })
// 2. receive SEI
trtc.on(TRTC.EVENT.SEI_MESSAGE, event => {
 console.log(`received sei message from ${event.userId}, data: ${event.data}, streamType: ${event.streamType}`)
})
```

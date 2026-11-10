---
sync_node_id: '126260442847088640'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "分享系统声音"
  - "Web"
product: "trtc"
---
## Function Description

This article mainly introduces how to share system audio in TRTC Web SDK.

## Implementation Process

To share system audio on the web, you need to use it together with screen sharing. It is not possible to share system audio without screen sharing.

### Example
``` javascript
 await trtcA.startScreenShare({ option: { systemAudio: true }});
```

Check **Share system audio** in the screen sharing selection box and click Share. After publishing to the room, other users in the room will receive the 

[TRTC.EVENT.REMOTE_AUDIO_AVAILABLE](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_AUDIO_AVAILABLE)Event

> **Note:**
> If a microphone is captured while sharing system audio, the system audio will be mixed with the local microphone and published.
> 

### Supported Browsers

Share System Audio only supports browsers based on Chromium version 74+, such as Chrome, Edge, Opera, and so on. Other browsers are not supported at this time, e.g. Safari, Firefox.
- Chrome for Windows & Chrome OS supports sharing system audio + tab audio.

- Chrome for MacOS & Linux only supports sharing the tab audio.

- Chrome for Android & iOS does not support this.

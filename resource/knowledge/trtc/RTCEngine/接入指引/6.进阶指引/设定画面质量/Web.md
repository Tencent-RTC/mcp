---
sync_node_id: '89644535086628864'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "设定画面质量"
  - "Web"
product: "trtc"
---
This article mainly introduces how to set video properties in video calls or interactive live broadcasts. Developers can adjust the clarity and fluency of the video according to specific business needs to obtain a better user experience. Video properties include resolution, frame rate, and bit rate.

## Implementation

Set the video properties through the [`trtc.startLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) or [`trtc.updateLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#updateLocalVideo) method of the trtc object:
- Specify a predefined Profile, each Profile corresponds to a set of recommended resolution, frame rate, and bit rate.

   ``` javascript
   // Specify video properties when starting
   await trtc.startLocalVideo({
     option: { profile: '480p' }
   });
   // Dynamically adjust video properties during the call
   await trtc.updateLocalVideo({
     option: { profile: '360p' }
   });
   ```
- Specify custom resolution, frame rate, and bit rate.

   ``` javascript
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

|Video Profile|Resolution (width x height)|Frame Rate (fps)|Bit Rate (kbps)|
|---------|---------|---------|---------|
|120p|160 x 120|15|200|
|180p|320 x 180|15|350|
|240p|320 x 240|15|400|
|360p|640 x 360|15|800|
|480p|640 x 480|15|900|
|720p|1280 x 720|15|1500|
|1080p|1920 x 1080|15|2000|
|1440p|2560 x 1440|30|4860|
|4K|3840 x 2160|30|9000|

Due to device and browser limitations, the video resolution may not match exactly. In this case, the browser will automatically adjust the resolution to be close to the resolution corresponding to the Profile.

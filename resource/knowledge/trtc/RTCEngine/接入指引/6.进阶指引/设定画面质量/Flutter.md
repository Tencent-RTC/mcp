---
sync_node_id: '134687917300039680'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "设定画面质量"
  - "Flutter"
product: "trtc"
---
## Overview

In TRTCCloud, you can adjust the video quality in the following ways:
- [TRTCCloud.enterRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/enterRoom.html) TRTCAppScene parameter: For selecting your application scenario.

- [TRTCCloud.setVideoEncoderParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setVideoEncoderParam.html): For setting encoding parameters.

- [TRTCCloud.setNetworkQosParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setNetworkQosParam.html): Used for setting up network regulation policies.

## Supported Platforms

|iOS|Android|Mac OS|Windows|Web|Electron|Flutter|
|---------|---------|---------|---------|---------|---------|---------|
|✓|✓|✓|✓|✓|✓|✓|

## Room Scenario
| Scenario Type | Scenario Introduction |
| --- | --- |
| TRTCAppScene.videoCall | Within the context of video calling, 720p and 1080p high-definition image quality is supported. A single room can accommodate up to 300 simultaneous online users, with a maximum of 50 users speaking at the same time. |
| TRTCAppScene.live | In the context of interactive video broadcasting, the mic can be smoothly turned on/off without switching latency, with host latency as low as 300 milliseconds. Supports live streaming for hundreds of thousands of concurrent viewers, with playback delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you need to specify the current user's role using the 'role' field in TRTCParams. |
| TRTCAppScene.audioCall | In the audio call context, it supports 48 kHz duplex audio calls. A single room accommodates up to 300 concurrent online users, with a maximum of 50 people speaking at once. |
| TRTCAppScene.voiceChatRoom | In the context of interactive audio live streaming, microphones can be switched on and off smoothly without delay. The host experiences a low latency of fewer than 300 milliseconds. It accommodates hundreds of thousands concurrent viewer users, with the broadcast delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you need to specify the current user's role using the 'role' field in TRTCParams. |

## TRTCVideoEncParam

### Recommended configuration

|Application Scenario|videoResolution|videoFps|videoBitrate|
|---------|---------|---------|---------|
|Video call (mobile)|640x360|15|550kbps|
|Video conferencing (primary image on macOS or Windows)|1280x720|15|1200kbps|
|Video conferencing (primary image on mobile device)|640x360|15|900kbps|
|Video conferencing (small image)|320x180|15|250kbps|
|Online education (teacher on macOS or Windows)|960x540|15|850kbps|
|Online education (teacher on iPad)|640x360|15|550kbps|
|Online education (student)|320x180|15|250kbps|

### Detailed description of fields
- **(TRTCVideoResolution) videoResolution**

- The encoding resolution (TRTCVideoResolution), for instance, 640 x 360, indicates the width (in pixels) x height (in pixels) of the output image.We have only predefined horizontal (landscape) resolutions in the TRTCVideoResolution enumeration where the width >= height. If you want to use a vertical (portrait) resolution, you need to set resMode to Portrait.

   > **Note:**
   > 
   > Because many hardware codecs only support pixel widths that are divisible by 16, the actual resolution encoded by the SDK may not be exactly the same as configured by the parameter; instead, it will be automatically corrected based on a multiple of 16. For example, the resolution 640 x 360 may be adapted to 640 x 368 inside the SDK.
   > 

- **(TRTCVideoResolutionMode) videoResolutionMode**

- This parameter designates the screen orientation resolution (TRTCVideoResolutionMode). Since TRTCVideoResolution only defines horizontal screen resolution, if you want to use vertical screen resolutions like 360 x 640, you'd need to set resMode as TRTCVideoResolutionModePortrait. Generally, PCs and Macs employ horizontal (Landscape) resolution, while smartphones use vertical (Portrait) resolution.

- **(int) videoFps**
The Frame Rate (FPS) refers to the number of frames to be encoded per second. A recommended setting is 15 FPS, which assures sufficient video fluidity without compromising clarity due to an excessive number of frames per second. If you require higher smoothness, settings of 20 FPS or 25 FPS can be used. However, resist settings above 25 FPS, since the conventional frame rate for movies is 24 FPS.

- **(int) videoBitrate**
Video Bitrate (Bitrate) refers to how much Kbit binary data the encoder outputs per second after encoding. If you set videoBitrate to 800kbps, the encoder will produce 800kbit video data per second. If stored into a file, the size of this file would amount to 800kbit, which is equivalent to 100KB, or 0.1MB.

    A higher video bitrate is not always better; instead, it should be chosen appropriately based on the resolution as shown in the table below.

### Resolution-bitrate reference table

|Resolution Definition|Aspect Ratio|Recommended Bitrate(VideoCall)|Recommended Bitrate(LIVE)|
|---------|---------|---------|---------|
|TRTCVideoResolution.res_120_120|1:1|80kbps|120kbps|
|TRTCVideoResolution.res_160_160|1:1|100kbps|150kbps|
|TRTCVideoResolution.res_270_270|1:1|200kbps|300kbps|
|TRTCVideoResolution.res_480_480|1:1|350kbps|525kbps|
|TRTCVideoResolution.res_160_120|4:3|100kbps|150kbps|
|TRTCVideoResolution.res_240_180|4:3|150kbps|225kbps|
|TRTCVideoResolution.res_280_210|4:3|200kbps|300kbps|
|TRTCVideoResolution.res_320_240|4:3|250kbps|375kbps|
|TRTCVideoResolution.res_400_300|4:3|300kbps|450kbps|
|TRTCVideoResolution.res_480_360|4:3|400kbps|600kbps|
|TRTCVideoResolution.res_640_480|4:3|600kbps|900kbps|
|TRTCVideoResolution.res_960_720|4:3|1000kbps|1500kbps|
|TRTCVideoResolution.res_160_90|16:9|150kbps|250kbps|
|TRTCVideoResolution.res_256_144|16:9|200kbps|300kbps|
|TRTCVideoResolution.res_320_180|16:9|250kbps|400kbps|
|TRTCVideoResolution.res_480_270|16:9|350kbps|550kbps|
|TRTCVideoResolution.res_640_360|16:9|550kbps|900kbps|
|TRTCVideoResolution.res_960_540|16:9|850kbps|1300kbps|
|TRTCVideoResolution.res_1280_720|16:9|1200kbps|1800kbps|
|TRTCVideoResolution.res_1920_1080|16:9|2000kbps|3000kbps|

## TRTCNetworkQosParam

### QosPreference

In an environment where network bandwidth is ample, clarity and fluidity can be balanced. However, when a user's network conditions are not optimal, the decision needs to be made whether to prioritize clarity or fluidity. This designation can be made through the preference parameter within TRTCNetworkQosParam. 
- **Smoothness preferred (TRTCVideoQosPreference.smooth)**
When users experience a weak network, the display could turn blurry and may contain many mosaics, but smoothness can be maintained with minimal or no stutter.

- **Quality preferred (TRTCVideoQosPreference.clear)**

- When users are constrained by a weak network, the image will strive to remain as clear as possible, but stuttering might be a frequent occurrence.

## Common Misconceptions
1. **Is higher resolution always better?**

   A higher resolution requires a higher bitrate for support. If you select 1280 x 720 resolution but set the bitrate to 200kbps, the image will have a large amount of mosaic. Refer to the [Resolution Bitrate Reference Table](#.E5.88.86.E8.BE.A8.E7.8E.87.E7.A0.81.E7.8E.87.E5.8F.82.E7.85.A7.E8.A1.A8) for configuration.

2. **Is higher frame rate always better?**

3. Since camera capture is a complete map of all real objects during exposure, higher frame rates do not always mean smoother visuals, which differs from FPS in gaming. On the contrary, an extremely high frame rate may lower video quality per frame, reduce camera exposure time, and result in worse effects.

4. **Is higher bitrate always better?**

   A higher bitrate also requires a higher resolution to match. For a resolution such as 320 x 240, a bitrate of 1000kbps is excessive. Refer to the [Resolution Bitrate Reference Table](#.E5.88.86.E8.BE.A8.E7.8E.87.E7.A0.81.E7.8E.87.E5.8F.82.E7.85.A7.E8.A1.A8) for configuration.

5. **When using Wi-Fi, you can set a high resolution and bitrate.**

6. The network speed of Wi-Fi is not fixed. If you are far from the wireless router or the router channel is occupied, the speed may be slower than 4G.

7. In this case, the TRTC SDK provides a speed test feature. You can perform a speed test before a video call to determine network quality based on the score.

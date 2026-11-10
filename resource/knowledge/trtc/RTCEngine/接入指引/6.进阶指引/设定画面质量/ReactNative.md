---
sync_node_id: '175916656914612224'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "设定画面质量"
  - "React Native"
product: "trtc"
---
## Content Introduction

In TRTCCloud, you can adjust video quality in the following ways.
- [TRTCCloud.enterRoom](https://liteav.sdk.qcloud.com/doc/api/en/group__TRTCCloud__ios.html#a96152963bf6ac4bc10f1b67155e04f8d) The TRTCAppScene parameter: Used to select your application scenario.

- [TRTCCloud.setVideoEncoderParam](https://liteav.sdk.qcloud.com/doc/api/en/group__TRTCCloud__ios.html#a57938e5b62303d705da2ceecf119d74e): are used to set encoding parameters.

- [TRTCCloud.setNetworkQosParam](https://liteav.sdk.qcloud.com/doc/api/en/group__TRTCCloud__ios.html#ac72a8a85131cb7716b1eec799250aba9): are used to set QoS control policy.

## Supported Platforms

|iOS|Android|Mac OS|Windows|Web|Electron|Flutter|React Native|
|---------|---------|---------|---------|---------|---------|---------|---------|
|✓|✓|✓|✓|✓|✓|✓|✓|

Detailed operations for setting picture quality on the Web, please see [Setting Guidelines](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-14-basic-set-video-profile.html).

## Room Scenario
| Scenario Type | Scenario Introduction |
| --- | --- |
| TRTC_APP_SCENE_VIDEOCALL | In video call scenes, it supports 720p and 1080p high-definition image quality. A single room can hold up to 300 online users simultaneously, with up to 50 people speaking at the same time. |
| TRTC_APP_SCENE_LIVE | In interactive video live streaming scenarios, the microphone can be smoothly turned on/off without waiting for switch, and the host latency is below 300 milliseconds. It supports live streaming for hundreds of thousands of concurrent viewer users, with playback delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you must use the role field in TRTCParams to specify the current user's role. |
| TRTC_APP_SCENE_AUDIOCALL | In audio call scenarios, it supports 48 kHz stereo audio calls. A single room can hold up to 300 online users simultaneously, with up to 50 people speaking at the same time. |
| TRTC_APP_SCENE_VOICE_CHATROOM | In interactive audio live streaming scenarios, the microphone can be smoothly turned on/off without waiting for the switch, and the host latency is below 300 milliseconds. It supports live streaming for hundreds of thousands of concurrent viewers, with playback delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you must use the role field in TRTCParams to specify the current user's role. |

## TRTCVideoEncParam

### Recommended Configuration

|Application Scenario|videoResolution|videoFps|videoBitrate|
|---------|---------|---------|---------|
|Video Call (Mobile Phone)|640x360|15|550kbps|
|Video Conferencing (Main Screen on Mac/Win)|1280x720|15|1200kbps|
|Video Conferencing (Main Screen on Mobile Phone)|640x360|15|900kbps|
|Video Conferencing (Small Picture)|320x180|15|250kbps|
|Online education (teacher on macOS or Windows)|960x540|15|850kbps|
|Online education (teacher on iPad)|640x360|15|550kbps|
|Online education (student)|320x180|15|250kbps|

### Explanation of Each Field
- **(int) videoResolution**

- Encoding resolution (TRTCCloudDef.TRTC_VIDEO_RESOLUTION_), for example, 640 x 360 refers to the width (in pixels) x height (in pixels) of the encoded video. In the TRTCVideoResolution enumeration definition, we only define landscape (Landscape) resolutions where width >= height. If you want to use portrait resolution, you need to set resMode to Portrait.

   > **Notes:**
   > 
   > Since many hardware codecs only support pixel widths divisible by 16, the actual encoding resolution in the SDK may not strictly follow the custom parameters but will automatically apply a divisible correction by 16. For example, a resolution of 640 x 360 might be adjusted to 640 x 368 inside the SDK.
   > 

- **(int) videoResolutionMode**

- Landscape or portrait resolution (TRTCCloudDef.TRTC_VIDEO_RESOLUTION_MODE_), since only landscape resolutions are defined in TRTCVideoResolution. If you wish to use a portrait resolution such as 360 x 640, you need to specify resMode as TRTCVideoResolutionModePortrait. Generally, PCs and Macs use landscape (Landscape) resolutions, while mobile phones use portrait (Portrait) resolutions.

- **(int) videoFps**

- Frame rate (FPS), which is the number of frames to be encoded per second. The recommended setting is 15 FPS, which ensures smoothness without reducing the clarity of individual frames due to too many frames per second. If you have higher requirements for smoothness, you can set it to 20 FPS or 25 FPS. However, do not set a value above 25 FPS, as the normal frame rate for movies is only 24 FPS.

- **(int) videoBitrate**

- Video bitrate (Bitrate), which is the amount of encoded binary data in Kbit output by the encoder per second. If you set videoBitrate to 800kbps, the encoder will generate 800kbit of video data per second. If these data are stored as a file, the file size will be 800kbit, which is 100KB or 0.1M.

    Video bitrate isn't always better when higher. There should be a proper mapping relationship between it and resolution, as shown in the table below.

### Resolution and Bitrate Reference Table

|Definition of Resolution|Aspect Ratio|Suggested Bitrate (VideoCall)|Suggested Bitrate (LIVE)|
|---------|---------|---------|---------|
|TRTC_VIDEO_RESOLUTION_120_120|1:1|80kbps|120kbps|
|TRTC_VIDEO_RESOLUTION_160_160|1:1|100kbps|150kbps|
|TRTC_VIDEO_RESOLUTION_270_270|1:1|200kbps|300kbps|
|TRTC_VIDEO_RESOLUTION_480_480|1:1|350kbps|525kbps|
|TRTC_VIDEO_RESOLUTION_160_120|4:3|100kbps|150kbps|
|TRTC_VIDEO_RESOLUTION_240_180|4:3|150kbps|225kbps|
|TRTC_VIDEO_RESOLUTION_280_210|4:3|200kbps|300kbps|
|TRTC_VIDEO_RESOLUTION_320_240|4:3|250kbps|375kbps|
|TRTC_VIDEO_RESOLUTION_400_300|4:3|300kbps|450kbps|
|TRTC_VIDEO_RESOLUTION_480_360|4:3|400kbps|600kbps|
|TRTC_VIDEO_RESOLUTION_640_480|4:3|600kbps|900kbps|
|TRTC_VIDEO_RESOLUTION_960_720|4:3|1000kbps|1500kbps|
|TRTC_VIDEO_RESOLUTION_160_90|16:9|150kbps|250kbps|
|TRTC_VIDEO_RESOLUTION_256_144|16:9|200kbps|300kbps|
|TRTC_VIDEO_RESOLUTION_320_180|16:9|250kbps|400kbps|
|TRTC_VIDEO_RESOLUTION_480_270|16:9|350kbps|550kbps|
|TRTC_VIDEO_RESOLUTION_640_360|16:9|550kbps|900kbps|
|TRTC_VIDEO_RESOLUTION_960_540|16:9|850kbps|1300kbps|
|TRTC_VIDEO_RESOLUTION_1280_720|16:9|1200kbps|1800kbps|
|TRTC_VIDEO_RESOLUTION_1920_1080|16:9|2000kbps|3000kbps|

## TRTCNetworkQosParam

### Preference

When network bandwidth is relatively sufficient, both clarity and smoothness can be achieved. However, when the user's network is unsatisfactory, should clarity or smoothness be given priority? You can make a choice by specifying the preference parameter in TRTCNetworkQosParam. 
- **Smoothness Preferred (TRTC_VIDEO_QOS_PREFERENCE_SMOOTH)**

- When users encounter a weak network environment, the picture will blur and there will be considerable mosaic, but it can maintain smoothness or have minor stutters.

- **Clarity Priority (TRTC_VIDEO_QOS_PREFERENCE_CLEAR)**

- When users encounter a weak network environment, the picture will try to remain clear, but may more easily experience stutters.

### ControlMode

Set the controlMode parameter to **VIDEO_QOS_CONTROL_SERVER** only. **VIDEO_QOS_CONTROL_CLIENT** is for internal debugging by the Tencent Cloud R&D Team. Do not pay attention to it.

## Common Misunderstandings

**Is a higher resolution better?**

Higher resolutions require higher bitrates for support. If the resolution is set to 1280 x 720 but the bitrate is specified as 200 kbps, there will be a large amount of mosaic in the image. It is recommended to refer to the [resolution and bitrate reference table](https://intl.cloud.tencent.com/document/product/647/35153) for settings.

**Is a higher frame rate better?** 

Since the frames captured by the camera are a complete mapping of all real objects in the exposure stage, a higher frame rate does not necessarily mean smoother perception. This is different from FPS in games. On the contrary, an excessively high frame rate can reduce the video quality of each frame and also decrease the camera's exposure time, potentially resulting in worse effects.

**Is a higher bitrate better?** 

Higher bitrates require higher resolutions to match. For a resolution like 320 x 240, a bitrate of 1000 kbps is a waste. It is recommended to refer to the [resolution and bitrate reference table](https://intl.cloud.tencent.com/document/product/647/35153) for settings.

**When using Wi-Fi, a high resolution and bitrate can be set.**

Wi-Fi speed is not constant. If you are far from the wireless router or the router's channel is occupied, the speed may be lower than 4G.

In this case, the TRTC SDK provides a speed test feature that can perform a speed test before a video call and determine the network quality based on the score.

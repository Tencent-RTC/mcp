---
sync_node_id: '89644531477430272'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "发布音视频流到直播 CDN"
product: "trtc"
---
This document describes how to publish (relay) audio/video streams in TRTC to CDNs so that viewers can watch the streams using standard live streaming players.

## Applicable Scenario

Since TRTC uses User Datagram Protocol (UDP) to transmit audio and video data, while Live Video Broadcasting (LVB) CDN uses Real-Time Messaging Protocol (RTMP), HTTP Live Streaming (HLS), Flash Video (FLV), and other protocols for data transmission, it is necessary to  **relay**  TRTC's audio and video data to the live streaming CDN for viewers to watch through the CDN.

Integrating TRTC with CDN for viewing is typically used to address the following issues:
- **Viewing with ultra-high concurrency** 

   TRTC's low-latency viewing capability supports up to 100,000 participants in a single room. Although CDN viewing has higher latency, it supports more than 100,000 concurrent viewers and offers more affordable prices.

## Relay to CDN Control Solution

TRTC provides several control solutions for publishing audio and video streams to a live streaming CDN (that is, relay to CDN), which include initiating relay using terminal SDK,  initiating relay using RESTful APIs, and automatic relay. The specific solutions are described as follows:

### Solution 1: Initiating Relay Using Terminal SDK

#### Step 1: Publishing the Local User's Stream to CDNs

##### Feature Description

You can use the startPublishMediaStream (for example, IOS) API of TRTCCloud to publish the audio/video streams of local users to live streaming CDNs (known in TRTC as "relay to CDN").
The TRTC server will send the audio/video data directly to the CDN server. Because the data is not transcoded, the cost is relatively low.
However, if there are multiple users publishing audio/video streams in a room, there will be a CDN stream for each user. Multiple players are needed to play the streams, and they may not play in sync.

##### Directions

Follow the steps below to publish the local user's stream to CDNs.
1. Create a `TRTCPublishTarget` object and set `mode` in the object to `TRTCPublishBigStreamToCdn` or `TRTCPublishSubStreamToCdn`. The former is used to publish the user's primary stream (usually the camera), and the latter is used to publish the user's substream (usually the screen).

2. Set `cdnUrlList` in the `TRTCPublishTarget` object to one or multiple CDN addresses (which usually starts with `rtmp://`). If you publish to the Tencent Cloud CDN (can be generated in [CSS console > Address Generator](https://console.tencentcloud.com/live/addrgenerator/addrgenerator)), set `isInternalLine` to `true`; otherwise, set it to `false`.

3. Because the data is not transcoded, leave `TRTCStreamEncoderParam` and `TRTCStreamMixingConfig` empty.

4. Call `startPublishMediaStream`. If the `taskId` parameter returned by the `onStartPublishMediaStream` callback is not empty, the local API call is successful.

5. To stop publishing, call `stopPublishMediaStream`, passing in the `taskId` returned by `onStartPublishMediaStream`.

##### Sample Code

The code below publishes the local user's stream to a live streaming CDN.

【java】
``` java
// Publish the local user's stream to a live streaming CDN.
TRTCCloudDef.TRTCPublishTarget target = new TRTCCloudDef.TRTCPublishTarget();
target.mode = TRTC_PublishBigStream_ToCdn;
TRTCCloudDef.TRTCPublishCdnUrl cdnUrl= new TRTCCloudDef.TRTCPublishCdnUrl();
cdnUrl.rtmpUrl = "rtmp://tencent/live/bestnews";
cdnUrl.isInternalLine = true;
target.cdnUrlList.add(cdnUrl);
mTRTCCloud.startPublishMediaStream(target, null, null);
```

【Objective-C】
``` objectivec
// Publish the local user's stream to a live streaming CDN.
TRTCPublishTarget* target = [[TRTCPublishTarget alloc] init];
target.mode = TRTCPublishBigStreamToCdn;
TRTCPublishCdnUrl* cdnUrl = [[TRTCPublishCdnUrl alloc] init];
cdnUrl.rtmpUrl = @"rtmp://tencent/live/bestnews";
cdnUrl.isInternalLine = YES;
NSMutableArray* cdnUrlList = [NSMutableArray new];
[cdnUrlList addObject:cdnUrl];
target.cdnUrlList = cdnUrlList;
[_trtcCloud startPublishMediaStream:target encoderParam:nil mixingConfig:nil];
```

【C++】
``` cpp
// Publish the local user's stream to a live streaming CDN.
TRTCPublishTarget target;
target.mode = TRTCPublishMode::TRTCPublishBigStreamToCdn;
TRTCPublishCdnUrl* cdn_url_list = new TRTCPublishCdnUrl[1];
cdn_url_list[0].rtmpUrl = "rtmp://tencent/live/bestnews";
cdn_url_list[0].isInternalLine = true;
target.cdnUrlList = cdn_url_list;
target.cdnUrlListSize = 1;
trtc->startPublishMediaStream(&target, nullptr, nullptr);
delete[] cdn_url_list;
```

【Web】
``` javascript
const options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN
  }
}
try {
  await trtc.startPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming start failed', error);
}
```

【Dart】
``` java
TRTCPublishTarget target = TRTCPublishTarget();
target.mode = TRTCPublishMode.TRTCPublishBigStreamToCdn;
TRTCPublishCdnUrl cdnUrlEntity = new TRTCPublishCdnUrl();
cdnUrlEntity.rtmpUrl = "rtmp://tencent/live/bestnews";
cdnUrlEntity.isInternalLine = true;
target.cdnUrlList.add(cdnUrlEntity);

trtcCloud.startPublishMediaStream(target: target);
```

>  **Note:**
> - Web class names differ slightly, but the usage is consistent. For detailed information, refer to [CDNStreaming Plugin](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/tutorial-26-advanced-publish-cdn-stream.html).
> - For relay in the Web 4.x version, refer to [Client.startMixTranscode()](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/Client.html#startMixTranscode). 

#### Step 2: Publishing Mixed Streams to CDNs

##### Feature Description

You can call **startPublishMediaStream** to mix the streams of multiple users in a TRTC room into one stream and publish the stream to a CDN. The `TRTCStreamEncoderParam` and `TRTCStreamMixingConfig` parameters of the API allow you to determine the details of stream mixing and transcoding.

The streams will be decoded on the cloud first, mixed, and then re-encoded according to the stream mixing parameters (`TRTCStreamMixingConfig`) and transcoding parameters (`TRTCStreamEncoderParam`) you specify. Afterward, they will be published to CDNs. In this mode, additional [transcoding fees](https://www.tencentcloud.com/document/product/647/47631#MixTranscoding) are charged.

##### Directions

Follow the steps below to mix the streams of multiple users in a room and publish the mixed stream to CDNs.
1. Create a `TRTCPublishTarget` object and set `mode` in the object to `TRTCPublishMixStreamToCdn`.

2. Set `cdnUrlList` in the `TRTCPublishTarget` object to one or multiple CDN addresses (which usually start with `rtmp://`). If you publish to the Tencent Cloud CDN, set `isInternalLine` to `true`; otherwise, set it to `false`.

3. Set the encoding parameters (`TRTCStreamEncoderParam`):

   - **Video encoding parameters:** Specify the resolution, frame rate (15 fps is recommended), bitrate, and GOP (3 seconds is recommended). Bitrate and resolution work in correlation with each other. The table below lists some recommended resolution and bitrate settings.

      |videoEncodedWidth|videoEncodedHeight|videoEncodedFPS|videoEncodedGOP|videoEncodedKbps|
      |---------|---------|---------|---------|---------|
      |640|360|15|3|800 Kbps|
      |960|540|15|3|1200 Kbps|
      |1280|720|15|3|1500 Kbps|
      |1920|1080|15|3|2500 Kbps|

   - **Audio encoding parameters:** Specify the codec, bitrate, sample rate, and sound channels according to the `AudioQuality` value you pass in when calling `startLocalAudio`.

      |TRTCAudioQuality|audioEncodedSampleRate|audioEncodedChannelNum|audioEncodedKbps|
      |---------|---------|---------|---------|
      |TRTCAudioQualitySpeech|48000|1|50|
      |TRTCAudioQualityDefault|48000|1|50|
      |TRTCAudioQualityMusic|48000|2|60|

4. Set the parameters for audio mixing and video layout (TRTCStreamMixingConfig):

   - **Audio mixing parameters (audioMixUserList)**: You can leave this parameter empty to mix all audios in a room, or you can set it to the IDs of users whose audios you want to mix.

   - **Video layout parameters (videoLayoutList)**: Video layout is determined by an array. Each TRTCVideoLayout element in the array determines the position, dimensions, and background color of a video window. If you specify fixedVideoUser, the window defined by the TRTCVideoLayout element will display the video of a specific user. If you set fixedVideoUser to null, the TRTC server will determine whose video to display in the window.

      > **Example:**
      > 
      > **Example 1: Mix four users' streams and use an image as the background.**
      > 
      > - `layout1` specifies the position (upper half of the canvas) and dimensions (640 x 480) of the camera video of user `jerry`.
      > - Because no user IDs are specified for `layout2`, `layout3`, and `layout4`, TRTC will display the videos of the other three users in the windows based on its own rule.

      > **Example 2: Mix the camera video and screen of one user plus the camera videos of three other users.**
      > 
      > - `layout1` specifies the position (left) and dimensions (1280 x 720) of user `jerry`'s screen. The rendering mode used is aspect fit (`Fit`), and the background color is black.
      > - `layout2` specifies the position (top right) and dimensions (300 x 200) of user `jerry`'s camera video. The rendering mode used is aspect fill (`Fill`).
      > - Because no user IDs are specified for `layout3`, `layout4`, and `layout5`, TRTC will display the videos of the other three users in the windows based on its own rule.

5. Call startPublishMediaStream. If the taskId parameter returned by the onStartPublishMediaStream callback is not empty, the local API call is successful.

6. To change the stream mixing parameters (for example, the video layout), call `updatePublishMediaStream`, passing in the `taskId` returned in step 6 as well as the new `TRTCStreamMixingConfig` parameters. We recommend you do not change `TRTCStreamEncoderParam` during relay because doing so will affect the stability of CDN playback.

7. To stop publishing, call `stopPublishMediaStream`, passing in the `taskId` returned by `onStartPublishMediaStream`.

##### Sample Code

The code below mixes the streams of multiple users in a room and publishes the result to a CDN.

【java】
``` java
// Specify the publishing mode as TRTC_PublishMixedStream_ToCdn.
TRTCCloudDef.TRTCPublishTarget target = new TRTCCloudDef.TRTCPublishTarget();
target.mode = TRTC_PublishMixedStream_ToCdn;
// Specify the CDN address for publishing.
TRTCCloudDef.TRTCPublishCdnUrl cdnUrl= new TRTCCloudDef.TRTCPublishCdnUrl();
cdnUrl.rtmpUrl = "rtmp://tencent/live/bestnews";
cdnUrl.isInternalLine = true;
target.cdnUrlList.add(cdnUrl);
```

【Objective-C】
``` objectivec
// Specify the publishing mode as TRTCPublishMixStreamToCdn.
TRTCPublishTarget* target = [[TRTCPublishTarget alloc] init];
target.mode = TRTCPublishMixStreamToCdn;
// Specify the CDN address for publishing.
TRTCPublishCdnUrl* cdnUrl = [[TRTCPublishCdnUrl alloc] init];
cdnUrl.rtmpUrl = @"rtmp://tencent/live/bestnews";
cdnUrl.isInternalLine = YES;
NSMutableArray* cdnUrlList = [NSMutableArray new];
[cdnUrlList addObject:cdnUrl];
target.cdnUrlList = cdnUrlList;
// Set the secondary encoding parameters for the mixed audio and video streams.
TRTCStreamEncoderParam* encoderParam = [[TRTCStreamEncoderParam alloc] init];
encoderParam.videoEncodedWidth = 1280;
encoderParam.videoEncodedHeight = 720;
encoderParam.videoEncodedFPS = 15;
encoderParam.videoEncodedGOP = 3;
encoderParam.videoEncodedKbps = 1000;
encoderParam.audioEncodedSampleRate = 48000;
encoderParam.audioEncodedChannelNum = 1;
encoderParam.audioEncodedKbps = 50;
encoderParam.audioEncodedCodecType = 0;
// Set the layout parameters for the screen.
TRTCStreamMixingConfig* config = [[TRTCStreamMixingConfig alloc] init];
NSMutableArray* videoLayoutList = [NSMutableArray new];
TRTCVideoLayout* layout1 = [[TRTCVideoLayout alloc] init];
layout1.zOrder = 0;
layout1.rect = CGRectMake(0, 0, 720, 1280);
layout1.fixedVideoStreamType = TRTCVideoStreamTypeSub;
layout1.fixedVideoUser.intRoomId = 1234;
layout1.fixedVideoUser.userId = @"mike";
TRTCVideoLayout* layout2 = [[TRTCVideoLayout alloc] init];
layout2.zOrder = 0;
layout2.rect = CGRectMake(1300, 0, 300, 200);
layout2.fixedVideoStreamType = TRTCVideoStreamTypeBig;
layout2.fixedVideoUser.intRoomId = 1234;
layout2.fixedVideoUser.userId = @"mike";
TRTCVideoLayout* layout3 = [[TRTCVideoLayout alloc] init];
layout3.zOrder = 0;
layout3.rect = CGRectMake(1300, 220, 300, 200);
layout3.fixedVideoStreamType = TRTCVideoStreamTypeSub;
layout3.fixedVideoUser = nil;
[videoLayoutList addObject:layout1];
[videoLayoutList addObject:layout2];
[videoLayoutList addObject:layout3];
config.videoLayoutList = videoLayoutList;
config.audioMixUserList = nil;
// Initiate stream mixing.
[_trtcCloud startPublishMediaStream:target encoderParam:encoderParam mixingConfig:config];
```

【C++】
``` cpp
// Specify the publishing mode as TRTCPublishMixStreamToCdn.
TRTCPublishTarget target;
target.mode = TRTCPublishMode::TRTCPublishMixStreamToCdn;
// Specify the CDN address for publishing.
TRTCPublishCdnUrl* cdn_url = new TRTCPublishCdnUrl[1];
cdn_url[0].rtmpUrl = "rtmp://tencent/live/bestnews";
cdn_url[0].isInternalLine = true;
target.cdnUrlList = cdn_url;
target.cdnUrlListSize = 1;
// Set the secondary encoding parameters for the mixed audio and video streams.
TRTCStreamEncoderParam encoder_param;
encoder_param.videoEncodedWidth = 1280;
encoder_param.videoEncodedHeight = 720;
encoder_param.videoEncodedFPS = 15;
encoder_param.videoEncodedGOP = 3;
encoder_param.videoEncodedKbps = 1000;
encoder_param.audioEncodedSampleRate = 48000;
encoder_param.audioEncodedChannelNum = 1;
encoder_param.audioEncodedKbps = 50;
encoder_param.audioEncodedCodecType = 0;
// Set the layout parameters for the screen.
TRTCStreamMixingConfig config;
TRTCVideoLayout* video_layout_list = new TRTCVideoLayout[3];
TRTCUser* fixedVideoUser0 = new TRTCUser();
fixedVideoUser0->intRoomId = 1234;
fixedVideoUser0->userId = "mike"; 
video_layout_list[0].zOrder = 0;
video_layout_list[0].rect.left = 0;
video_layout_list[0].rect.top = 0;
video_layout_list[0].rect.right = 720;
video_layout_list[0].rect.bottom = 1280;
video_layout_list[0].fixedVideoStreamType =
     TRTCVideoStreamType::TRTCVideoStreamTypeSub;
video_layout_list[0].fixedVideoUser = fixedVideoUser0;
TRTCUser* fixedVideoUser1 = new TRTCUser();
fixedVideoUser1->intRoomId = 1234;
fixedVideoUser1->userId = "mike";
video_layout_list[1].zOrder = 0;
video_layout_list[1].rect.left = 1300;
video_layout_list[1].rect.top = 0;
video_layout_list[1].rect.right = 300;
video_layout_list[1].rect.bottom = 200;
video_layout_list[1].fixedVideoStreamType =
     TRTCVideoStreamType::TRTCVideoStreamTypeBig;
video_layout_list[1].fixedVideoUser = fixedVideoUser1;
video_layout_list[2].zOrder = 0;
video_layout_list[2].rect.left = 1300;
video_layout_list[2].rect.top = 220;
video_layout_list[2].rect.right = 300;
video_layout_list[2].rect.bottom = 200;
video_layout_list[2].fixedVideoStreamType =
     TRTCVideoStreamType::TRTCVideoStreamTypeSub;
video_layout_list[2].fixedVideoUser = nullptr;
config.videoLayoutList = video_layout_list;
config.videoLayoutListSize = 3;
config.audioMixUserList = nullptr;
// Initiate stream mixing.
trtc->startPublishMediaStream(&target, &encoder_param, &config);
delete fixedVideoUser0;
delete fixedVideoUser1;
delete[] video_layout_list;
```

【Dart】
``` java
TRTCPublishTarget target = TRTCPublishTarget();
target.mode = TRTCPublishMode.TRTCPublishMixStreamToCdn;
TRTCPublishCdnUrl cdnUrlEntity = new TRTCPublishCdnUrl();
cdnUrlEntity.rtmpUrl = "rtmp://tencent/live/bestnews";
cdnUrlEntity.isInternalLine = true;
target.cdnUrlList.add(cdnUrlEntity);

TRTCStreamMixingConfig config = TRTCStreamMixingConfig();
TRTCUser selfUser = TRTCUser();
selfUser.userId = localUserId;
selfUser.intRoomId = localRoomId;

TRTCVideoLayout selfVideoLayout = TRTCVideoLayout();
selfVideoLayout.fixedVideoStreamType = TRTCVideoStreamType.TRTCVideoStreamTypeBig;
selfVideoLayout.rect = Rect(originX: 0, originY: 0, sizeWidth: 1080, sizeHeight: 1920);
selfVideoLayout.zOrder = 0;
selfVideoLayout.fixedVideoUser = selfUser;
selfVideoLayout.fillMode = TRTCVideoFillMode.TRTCVideoFillMode_Fit;
config.videoLayoutList.add(selfVideoLayout);TRTCUser remoteUser = TRTCUser();

remoteUser.userId = remoteUserId;
remoteUser.intRoomId = remoteRoomId;
TRTCVideoLayout remoteVideoLayout = TRTCVideoLayout();
remoteVideoLayout.fixedVideoStreamType = TRTCVideoStreamType.TRTCVideoStreamTypeBig;
remoteVideoLayout.rect = Rect(originX: 100, originY: 50, sizeWidth: 216, sizeHeight: 384);
remoteVideoLayout.zOrder = 1;
remoteVideoLayout.fixedVideoUser = remoteUser;
remoteVideoLayout.fillMode = TRTCVideoFillMode.TRTCVideoFillMode_Fit;
config.videoLayoutList.add(remoteVideoLayout);

TRTCStreamEncoderParam param = TRTCStreamEncoderParam();
param.videoEncodedWidth = 1080;
param.videoEncodedHeight = 1920;
param.videoEncodedKbps = 5000;
param.videoEncodedFPS = 30;
param.videoEncodedGOP = 3;
param.audioEncodedSampleRate = 48000;
param.audioEncodedChannelNum = 2;
param.audioEncodedKbps = 128;
param.audioEncodedCodecType = 2;

trtcCloud.startPublishMediaStream(target: target, config: config, params: param);
```

### Solution 2: Initiating Relay Using RESTful APIs

The following describes how to use RESTful APIs to publish (relay) audio and video streams from a TRTC room to a live streaming CDN or push them back to the TRTC room, so that viewers can watch the streams using standard live streaming players.

#### Supported Features

When a relay task is initiated using RESTful APIs, the following features can be achieved:
- Relay a single audio and video stream to both the live streaming CDN and TRTC room.

- Mix multiple audio and video streams into a new single stream and relay it to both the live streaming CDN and TRTC room.

- Support outputting audio only and both audio and video.

- Support custom layouts and dynamic templates.

- Support setting background images, placeholder images, and watermark images.

- Support cropping and scaling input videos and images.

- Support adding supplemental enhancement information (SEI) to mixed audio and video streams.

#### How It Works

Cloud-based stream mixing involves six processes: entering a room, pulling streams, decoding, mixing, encoding, and relay:
-  **Entering a room:**  Utilizing the specified bot information, the microcontroller unit (MCU) creates a companion bot instance to enter the room.

-  **Pulling streams:**  Based on the specified mixing layout parameters, the MCU bot pulls the relevant users' audio and video streams.

-  **Decoding:**  The MCU decodes multiple audio and video streams, including video decoding and audio decoding.

-  **Mixing:**  The MCU combines multiple screens based on the specified mixing layout parameters. Simultaneously, the MCU also performs audio mixing on the decoded multi-channel audio signals.

-  **Encoding:**  The MCU re-encodes the mixed videos and audios according to your configured output encoding parameters, packaging them into a single audio and video stream.

-  **Relay:**  The MCU distributes the encoded and packaged audio and video data to your configured live streaming CDN.

   

#### **Initiating a Relay Task**

Your server can initiate a cloud-based relay task by calling the RESTful API [StartPublishCdnStream](https://trtc.io/document/48247). The method to initiate it is as follows:
1.  **Set basic parameters (required).**

   You need to specify the basic information to initiate the relay task, such as your application ID (sdkappid), main room ID (RoomId), main room type (RoomIdType), and whether to transcode (WithTranscoding). You can determine whether to transcode by setting WithTranscoding. If WithTranscoding is set to  `true` , it will be a mixed-stream relay. If set to  `false` , it will be a relay to CDN.

   |Field Name|Description|Required|
   |---------|---------|---------|
   |SdkAppId|TRTC's SdkAppId.|Yes|
   |RoomId|Main room ID.|Yes|
   |RoomIdType|Main room type.|Yes|
   |WithTranscoding|Whether to transcode.|Yes|

2.  **Set the bot parameters (required).**

   You need to specify the AgentParams parameters for a bot to enter a room. The MCU will create an instance to enter the room based on the parameters you specify.

   |Field Name|Description|Required|
   |---------|---------|---------|
   |AgentParams.UserId|The UserId used by the relay service in a TRTC room. Do not use the same UserId as those used by normal users in the room.|Yes|
   |AgentParams.UserSig|The user signature for the relay service to enter a TRTC room.|Yes|
   |AgentParams.MaxIdleTime|Idle wait time.|No|

3.  **Set audio parameters (required for mixed audio stream output, not required for single-stream relay).**

   To output mixed audio streams, you need to specify the AudioParams parameters. The MCU will output the audio streams in the format you configure in AudioEncode. You can configure SubscribeAudioList to specify which users' audio streams to be mixed.

   |Field Name|Description|Required|
   |---------|---------|---------|
   |AudioParams.AudioEncode|Audio output encoding parameter for stream mixing.|No|
   |AudioParams.SubscribeAudioList|Audio user allowlist for stream mixing.|No|

   For detailed meanings, refer to the parameter description in [McuAudioParams](https://trtc.io/document/36760#McuAudioParams).

4.  **Set video parameters (required for mixed video stream output, not required for single-stream relay).**

   To output mixed video streams, you need to specify the VideoParams parameters. The MCU will output the video streams in the format you configure in VideoEncode.

   - Configure LayoutParams to specify the layout you need.

   - Configure BackGroundColor to specify the canvas background color you need.

   - Configure BackgroundImageUrl to specify the canvas background image you need.

   - Configure WaterMarkList to specify the watermark layout you need.

      |Field Name|Description|Required|
      |---------|---------|---------|
      |VideoParams.VideoEncode|Video output encoding parameter for stream mixing.|No|
      |VideoParams.LayoutParams|Layout parameters for stream mixing.|No|
      |VideoParams.BackGroundColor|Canvas background color for stream mixing.|No|
      |VideoParams.BackgroundImageUrl|Canvas background image URL for stream mixing.|No|
      |VideoParams.WaterMarkList|Watermark parameter for stream mixing.|No|

      For detailed meanings, refer to the parameter description in [McuVideoParams](https://trtc.io/document/36760#McuVideoParams).

      >  **Introduction to stream mixing layout types** **:**
      > 
      > VideoParams.LayoutParams.MixLayoutMode has four layout modes. You can choose one according to your needs.
      > 
      > The layout modes include dynamic layout (1: floating layout, 2: screen sharing layout, 3: nine-grid layout) and static layout (4: custom layout (default)).
      > 
      > -  **Floating layout** 		
      > The video of the first user entering the room will fill the entire screen. The videos of other users will be arranged horizontally from the bottom left corner, displayed as small screens. There can be up to 4 rows, with a maximum of 4 videos per row, and the small screens float above the large screen. Up to 1 large screen and 15 small screens are supported. If a user sends only audio, they will still occupy a screen position.
      > 
      > -  **Screen sharing layout**
      > This layout is suitable for video conferences and online education. The shared screen (or the presenter's camera) always occupies the large screen position on the left side of the screen. The screens of other users are arranged vertically on the right side. You need to specify the main screen content on the left side with the VideoParams.LayoutParams.MaxVideoUser parameter. There can be up to 2 columns, with a maximum of 8 small screens per column. Up to 1 large screen and 15 small screens are supported. If a user sends only audio, they will still occupy a screen position.
      > 
      > -  **Nine-grid layout**
      > All users' screens are of equal size, evenly dividing the entire screen. The more users, the smaller each screen becomes. Up to 16 screens are supported. If a user sends only audio, they will still occupy a screen position.
      > 
      > -  **Custom layout (default)**
      > This layout is suitable for scenarios where you need to customize the layout of each screen. You can use the MixLayoutList parameter (an array) in VideoParams.LayoutParams to preset the position of each screen. You may leave the UserId parameter in MixLayoutList unspecified, and the layout engine will assign users to the positions in the MixLayoutList array according to their order of entering the room.
      > 
      > If any position in the MixLayoutList array is configured with a UserId, the layout engine will reserve the position for the specified user. If a user sends only audio, they will still occupy a screen position.
      > 
      > When the preset positions in the MixLayoutList array are used up, the layout engine will no longer mix other users' videos and audios.
      > 
      > For detailed meanings, refer to the parameter description in [McuAudioParams](https://trtc.io/document/36760#McuAudioParams).
      > 

5.  **Set single-stream relay user information (required for single-stream relay).**

   To configure single-stream relay, you need to set WithTranscoding to false and specify the SingleSubscribeParams parameters. The MCU will distribute the audio and video streams of the specified user to the specified live streaming CDN.

   |Field Name|Description|Required|
   |---------|---------|---------|
   |SingleSubscribeParams.UserMediaStream.UserInfo|TRTC user parameters.|No|
   |SingleSubscribeParams.UserMediaStream.StreamType|Primary stream and substream types.|No|

   For detailed meanings, refer to the parameter description in [McuAudioParams](https://trtc.io/document/36760#McuAudioParams).

6.  **Set parameters for relay to CDN (required for relay to CDN).**

   You need to specify the PublishCdnParams parameters for distributing to CDN. The MCU will relay the encoded audio and video streams to the CDN address you set.

| Field Name | Description | Required |
| --- | --- | --- |
| PublishCdnParams.N.PublishCdnUrl | CDN relay URL. | Yes |
| PublishCdnParams.N.IsTencentCdn | Whether it is a Tencent Cloud CDN. 0: non-Tencent Cloud CDN; 1: Tencent Cloud CDN. If this parameter is not specified, the default value is 1.<br><strong>Note:</strong><br><strong>1. To avoid unintended relay fees, it is recommended to explicitly specify this parameter. Relaying to a non-Tencent Cloud CDN will incur relay fees. .</strong><br><strong>2. By default, the sites in the Chinese mainland only support relaying to a Tencent Cloud CDN. If you need to relay to a third-party CDN, contact Tencent Cloud technical support.</strong> | No |

7.  **Set the TRTC room push-back parameters (required for pushing back to a TRTC room).**

   You need to specify the FeedBackRoomParams parameters for TRTC room push-back. The MCU will relay the encoded audio and video streams to the TRTC room you set.

| Field Name | Description | Required |
| --- | --- | --- |
| FeedBackRoomParams.N.RoomId | RoomId of the room to which streams are pushed back. | Yes |
| FeedBackRoomParams.N.RoomIdType | Type of the room to which streams are pushed back. 0: an integer room number; 1: a string room number. | No |
| FeedBackRoomParams.N.UserId | UserId used by the room to which streams are pushed back.<br><strong>Note:</strong><br><strong>This UserId cannot be the same as other UserIds already used in TRTC or relay services. It is recommended to include the room ID as part of the UserId.</strong> | Yes |
| FeedBackRoomParams.N.UserSig | The user signature corresponding to the UserId of the room. For the specific calculation method. | Yes |

8.  **Set SEI parameters (optional).**

   You need to specify either volume layout SEI or pass-through SEI parameters. The MCU will insert the corresponding SEI information into the output video streams.

   |Field Name|Description|Required|
   |---------|---------|---------|
   |McuSeiParams.LayoutVolume|The SEI for volume layout contains a fixed JSON structure. See the description below for details.|No|
   |McuSeiParams.PassThrough|Pass-through SEI.|No|

   An example of inserted volume layout SEI is as follows, where app_data indicates the pass-through data, canvas indicates the width and height of the output canvas, regions indicates layout information, volume indicates the mixed stream users' volume (from 0 to 100), with larger values indicating higher volume, ts indicates the local server's second-level timestamp, and ver can be ignored.

   ``` plaintext
   {
       "app_data": "test",
       "canvas": {
           "w": 1280,
           "h": 720
       },
       "regions": [
           {
               "uid": "test1",
               "zorder": 1,
               "volume": 60,
               "x": 0,
               "y": 0,
               "w": 640,
               "h": 360
           },
           {
               "uid": "test2",
               "zorder": 1,
               "volume": 80,
               "x": 640,
               "y": 0,
               "w": 640,
               "h": 360
           }
       ],
       "ver": "1.0",
       "ts": 1648544726
   }
   ```

#### Updating a Relay Task

Your server can update a cloud-based relay task by calling the RESTful API [UpdatePublishCdnStream](https://trtc.io/document/48245). You need to use the TaskId returned by StartPublishCdnStream to initiate the relay update. For details on using this API, refer to Start a relay task.

#### Stopping a Relay Task

Your server can stop a cloud-based relay task by calling the RESTful API [StopPublishCdnStream](https://trtc.io/document/48246). You need to use the TaskId returned by StartPublishCdnStream to stop relay.

|Field Name|Description|
|---------|---------|
|SdkAppId|TRTC's SdkAppId.|
|TaskId|The unique string ID of the relay task.|

### Solution 3: Automatic Relay

In addition to manually triggering relay via APIs, TRTC also offers an automatic relay solution. When the automatic relay solution is used, once the host in a TRTC room starts uploading audios and videos, a relay task will automatically be initiated to push the host's single stream to a CDN. Once the host leaves the room, the relay task will automatically end.

#### Prerequisites

Tencent Cloud [CSS](https://console.tencentcloud.com/live) service has been enabled. A playback domain name has been configured for CSS. For specific operations, refer to [Adding Your Own Domain](https://www.tencentcloud.com/document/product/267/35970).
1. Log in to the [CSS console](https://console.tencentcloud.com/live).

2. Select **Domain Management** in the left navigation bar, and you will see a new push domain name added to your domain list, formatted as `xxxxx.livepush.myqcloud.com`, where xxxxx represents a number called bizid.

3. Click **Add Domain**, enter the playback domain name you have registered, select the domain name type as **Playback Domain**, select the acceleration region, and click **Confirm**.

4. After the domain name is added successfully, the system will automatically assign you a CNAME domain name (ending with `.liveplay.myqcloud.com`). The CNAME domain name cannot be accessed directly. You need to complete the CNAME configuration with your domain name service provider. After the configuration takes effect, you can enjoy the CSS service. For detailed instructions, please refer to [CNAME Configuration](https://www.tencentcloud.com/document/product/267/31057).

   

   > **Note:**
   > 
   > **You do not need to add a push domain name**. After enabling the relayed live streaming feature in Step 1, Tencent Cloud will add a push domain name formatted as `xxxxx.livepush.myqcloud.com` to your CSS console by default. This domain name serves as a default push domain name agreed upon between CSS service and TRTC service.
   > 

#### Global Automatic Relay

Once global automatic relay is enabled, the host in a TRTC room will trigger automatic relay as soon as they start uploading audios and videos.

After enabling global automatic relay, you can also specify a stream ID for pushing to the live streaming CDN using the previously mentioned room entry parameters. If not specified, the system will generate a default stream ID based on the following rules:
-  **Fields used to splice a stream ID**

   - SDKAppID: You can find this in the [Console](https://console.trtc.io/app) >  **Application Management**  >  **Application Information**  section.

   - bizid: You can find this in the [Console](https://console.trtc.io/app) >  **Application Management**  >  **Application Information**  section.

   - roomId: Specified by you in  `TRTCParams`  of the  `enterRoom`  function.

   - userId: Specified by you in  `TRTCParams`  of the  `enterRoom`  function.

   - streamType: 'main' is for camera feed, and 'aux' is for screen sharing (WebRTC only supports one upstream at a time, so the stream type for screen sharing on WebRTC is 'main').

-  **Calculation rules for splicing a stream ID**

   |Splicing|Applications created on or after January 9, 2020|Applications created and used before January 9, 2020|
   |---------|---------|---------|
   |Splicing Rules|streamId = urlencode(sdkAppId_roomId_userId_streamType)|streamId = bizid_MD5(roomId_userId_streamType)|
   |Calculation Example|If sdkAppId = 12345678, roomId = 12345, userId = userA, and the user is currently using a camera, then streamId = 12345678_12345_userA_main.|If bizid = 1234, roomId = 12345, userId = userA, and the user is currently using a camera, then streamId = 1234_MD5(12345_userA_main) = 1234_8D0261436C375BB0DEA901D86D7D70E8.|

## Pulling Streams for Playback and Optimization

### Configuring a License for the SDK

The TRTC SDK offers comprehensive and powerful live streaming playback capabilities, and can easily integrate with CSS to enable CDN live streaming. If you are using TRTC SDK version 10.1 or later on mobile devices (iOS and Android) to implement CDN live streaming, you need to configure a license; otherwise, you can skip this step.
1. Get the license:

   - If you have already obtained the license authorization, you need to obtain the license URL and license key in the [CSS console](https://console.tencentcloud.com/live/license).

      

   - If you have not obtained the license authorization, you need to apply for it by referring to [Adding and Renewing a License](https://www.tencentcloud.com/document/product/1071/38546).

2. Before your application calls the SDK feature, make the following settings (it is recommended to do so in  `Application`  /  `- [AppDelegate application:didFinishLaunchingWithOptions:]` ):

   

【Android】
``` java
public class MApplication extends Application {

@Override
public void onCreate() {
    super.onCreate();
    String licenceURL = ""; // Obtained license URL
    String licenceKey = ""; // Obtained license key
    V2TXLivePremier.setLicence(this, licenceURL, licenceKey);
    V2TXLivePremier.setObserver(new V2TXLivePremierObserver() {
            @Override
            public void onLicenceLoaded(int result, String reason) {
                Log.i(TAG, "onLicenceLoaded: result:" + result + ", reason:" + reason);
            }
        });
}

```

【iOS】
``` objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    NSString * const licenceURL = @"<Obtained license URL>";
    NSString * const licenceKey = @"<Obtained license key>";

    // V2TXLivePremier is in the V2TXLivePremier.h header file.
    [V2TXLivePremier setLicence:licenceURL key:licenceKey];
    [V2TXLivePremier setObserver:self];
    NSLog(@"SDK Version = %@", [V2TXLivePremier getSDKVersionStr]);
    return YES;
}

#pragma mark - V2TXLivePremierObserver
- (void)onLicenceLoaded:(int)result Reason:(NSString *)reason {
    NSLog(@"onLicenceLoaded: result:%d reason:%@", result, reason);
}
@end

```

   >  **Note:**
   > 
   > **The packageName/BundleId configured in the license must be consistent with the application itself, otherwise playback will fail.**
   > 

### Obtaining the Playback Address and Connecting for Playback

Once you have completed the stream push operation, you will get the live streaming playback address. The standard format of the playback address is:
``` bash
http://PlaybackDomainName/AppName(default live)/StreamName(StreamID).flv
```

You can check your playback domain name, AppName, and StreamName under Stream Management in the [CSS console](https://console.tencentcloud.com/live/streammanage):

You can get three types of playback addresses:
``` bash
 RTMP protocol playback address: rtmp://example.myhost.com/AppName_example/StreamName_example
 FLV protocol playback address: http://example.myhost.com/AppName_example/StreamName_example.flv
 HLS protocol playback address: http://example.myhost.com/AppName_example/StreamName_example.m3u8
```

### Optimizing Playback Latency

After enabling relayed live streaming, the HTTP-FLV address will have higher latency compared to direct conversation in TRTC rooms due to the propagation and distribution by the live streaming CDN.
According to the current Tencent Cloud's live streaming CDN technology, if the V2TXLivePlayer is used, the latency can meet the standards in the table below:

|Relayed Stream Type|V2TXLivePlayer Playback Mode|Average Latency|Actual Test Result|
|---------|---------|---------|---------|
|Independent screen|Speed mode (recommended)| **2s - 3s**|On the left in the figure below (orange)|
|Mixed screen|Speed mode (recommended)| **4s - 5s**|On the right in the figure below (blue)|

If the latency in your actual test is higher than that in the table above, you can optimize the latency as follows:
-  **Use the TRTC SDK with the built-in V2TXLivePlayer** 
Ordinary ijkplayer or players based on the ffmpeg kernel lack latency regulation capabilities. If you use such players to play using the live streaming address mentioned above, the latency is generally uncontrollable. V2TXLivePlayer has a Tencent-developed playback engine with latency regulation capabilities.

-  **Set the playback mode of V2TXLivePlayer to speed mode.** 
You can set the parameters of V2TXLivePlayer to achieve speed mode. For example, on iOS:

   ``` objectivec
   // Auto mode
   [_txLivePlayer setCacheParams:1 maxTime:5];
   // Speed mode
   [_txLivePlayer setCacheParams:1 maxTime:1];
   // Smooth mode
   [_txLivePlayer setCacheParams:5 maxTime:5];
   
   // Start playback after setting is completed.
   ```

## Related Fees

Using CDN live streaming requires CSS service resources and terminal SDK live streaming capabilities, which may incur the following fees.

### TRTC Fees
- **Mixed stream transcoding fees:** If you use the method of publishing mixed streams to CDNs, mixed stream transcoding fees will be incurred. . If you use the method of publishing the local user's stream to CDNs, these fees will not be incurred.

- **Relay fees:** .

- **Audio and video duration fees** : Audio and video duration fees will be charged based on the actual audio and video usage of users in a room. .

### Other Cloud Service Fees

CDN live streaming requires the use of  **CSS**  resources for live distribution. CSS fees mainly include  **basic service fees and value-added service fees** . Basic service fees are mainly incurred by consumption of live push/playback services; value-added service fees are mainly incurred by consumption of value-added services during live streaming.

>  **Note:**
> The prices in this document are examples and for reference only. Final prices and billing policies are subject to the billing explanation of [CSS](https://www.tencentcloud.com/document/product/267/2819).
> 

-  **Basic service fees:** 
When relaying TRTC content to a CSS CDN for viewing,  **CSS**  will charge for the downstream traffic/bandwidth generated by the audience watching. You can choose the billing method that suits your needs. Traffic-based billing is used by default. For details, see [CSS > LVB > Traffic/Bandwidth Usage](https://www.tencentcloud.com/zh/document/product/267/2818#beb7e2c7-c843-456b-a208-4dcaf1f3b962).

-  **Value-added service fees:** 
If you use CSS features such as transcoding, recording, or Live Video Caster (LVC), additional value-added service fees will be incurred. Value-added services are charged on a pay-as-you-go basis.

### Cost Savings

In a stream mixing solution based on the client-side SDK APIs, to stop an backend mixing task, one of the following conditions must be met:
- The host who initiated the mixing task (by calling  `startPublishMediaStream` ) has exited the room.

- Actively stop mixing by calling  `stopPublishMediaStream`.

   In other situations, TRTC cloud will make every effort to maintain the stream mixing state. Therefore, to avoid unexpected mixing fees, stop the cloud-based mixing using the above methods as soon as you do not need it.

## FAQs

### 1. Can I listen for the status of CDN streams? What should I do if an error occurs?

You can listen for the onCdnStreamStateChanged callback event to get the latest status of a relay to CDN task.

### 2. How do I switch from publishing a single stream to publishing mixed streams? Do I need to stop publishing first and create a new relay task?

To switch from publishing a single stream to publishing mixed streams, just call `updatePublishMediaStream`, passing in the `taskid` of the current task. Note that, in order to ensure the stability of the publishing process, you cannot switch from publishing a single stream to mixing and publishing only audios or only videos. By default, both audio and video data are published when you publish a single stream. If you switch to publishing mixed streams, you must also publish both audios and videos.

### 3. How can I mix only videos (without audio)?

Do not set the audio parameters in `TRTCStreamEncodeParam` and leave `audioMixUserList` of `TRTCStreamMixingConfig` empty.

### 4. Can I add watermarks to mixed streams?

Yes, you can use `watermarkList` of `TRTCStreamMixingConfig` to set watermarks.

### 5. In online learning scenarios, can I mix the screen shared by the teacher?

Yes, you can. We recommend you publish the screen as the substream and mix the teacher's camera video and screen. When specifying the stream mixing parameters, set `fixedVideoStreamType` of `TRTCVideoLayout` to `TRTCVideoStreamTypeSub`.

### 6. When a preset layout is used, how are audios mixed?

When a preset layout is used, TRTC will mix the audios of up to 16 users in the room.

## StructType

|FuncList|DESC|
|---------|---------|
|TRTCParams|Room entry parameters.|
|TRTCVideoEncParam|Video encoding parameters.|
|TRTCNetworkQosParam|Network QoS control parameter set.|
|TRTCRenderParams|Rendering parameters of video image.|
|TRTCQualityInfo|Network quality.|
|TRTCVolumeInfo|Volume.|
|TRTCSpeedTestParams|Network speed testing parameters.|
|TRTCSpeedTestResult|Network speed test result.|
|TRTCTexture|Video texture data.|
|TRTCVideoFrame|Video frame information.|
|TRTCAudioFrame|Audio frame data.|
|TRTCMixUser|Description information of each video image in On-Cloud MixTranscoding.|
|TRTCTranscodingConfig|Layout and transcoding parameters of On-Cloud MixTranscoding.|
|TRTCPublishCDNParam|Push parameters required to be set when publishing audio/video streams to non-Tencent Cloud CDN.|
|TRTCAudioRecordingParams|Local audio file recording parameters.|
|TRTCLocalRecordingParams|Local media file recording parameters.|
|TRTCAudioEffectParam|Sound effect parameter (disused).|
|TRTCSwitchRoomConfig|Room switch parameter.|
|TRTCAudioFrameCallbackFormat|Format parameter of custom audio callback.|
|TRTCUser|The users whose streams to publish.|
|TRTCPublishCdnUrl|The destination URL when you publish to Tencent Cloud or a third-party CDN.|
|TRTCPublishTarget|The publishing destination.|
|TRTCVideoLayout|The video layout of the transcoded stream.|
|TRTCWatermark|The watermark layout.|
|TRTCStreamEncoderParam|The encoding parameters.|
|TRTCStreamMixingConfig|The transcoding parameters.|
|TRTCPayloadPrivateEncryptionConfig|Media Stream Private Encryption Configuration.|
|TRTCAudioVolumeEvaluateParams|Volume evaluation and other related parameter settings.|

## EnumType

|EnumType|DESC|
|---------|---------|
|TRTCVideoResolution|Video resolution.|
|TRTCVideoResolutionMode|Video aspect ratio mode.|
|TRTCVideoStreamType|Video stream type.|
|TRTCVideoFillMode|Video image fill mode.|
|TRTCVideoRotation|Video image rotation direction.|
|TRTCBeautyStyle|Beauty (skin smoothing) filter algorithm.|
|TRTCVideoPixelFormat|Video pixel format.|
|TRTCVideoBufferType|Video data transfer method.|
|TRTCVideoMirrorType|Video mirror type.|
|TRTCSnapshotSourceType|Data source of local video screenshot.|
|TRTCAppScene|Use cases.|
|TRTCRoleType|Role.|
|TRTCQosControlMode|QoS control mode (disused).|
|TRTCVideoQosPreference|Image quality preference.|
|TRTCQuality|Network quality.|
|TRTCAVStatusType|Audio/Video playback status.|
|TRTCAVStatusChangeReason|Reasons for playback status changes.|
|TRTCAudioQuality|Sound quality.|
|TRTCAudioRoute|Audio route (i.e., audio playback mode).|
|TRTCAudioFrameFormat|Audio frame content format.|
|TRTCAudioFrameOperationMode|Audio callback data operation mode.|
|TRTCLogLevel|Log level.|
|TRTCScreenCaptureSourceType|Screen sharing target type (for desktops only).|
|TRTCTranscodingConfigMode|Layout mode of On-Cloud MixTranscoding.|
|TRTCLocalRecordType|Media recording type.|
|TRTCMixInputType|Stream mix input type.|
|TRTCWaterMarkSrcType|Watermark image source type.|
|TRTCAudioRecordingContent|Audio recording content type.|
|TRTCPublishMode|The publishing mode.|
|TRTCEncryptionAlgorithm|Encryption Algorithm.|
|TRTCSpeedTestScene|Speed Test Scene.|
|TRTCGravitySensorAdaptiveMode|Set the adaptation mode of gravity sensing (only applicable to mobile terminals).|

## TRTCVideoResolution

**Video resolution.**

Here, only the landscape resolution (e.g., 640x360) is defined. If the portrait resolution (e.g., 360x640) needs to be used,  `Portrait`  must be selected for TRTCVideoResolutionMode.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoResolution_120_120|1|Aspect ratio: 1:1; resolution: 120x120; recommended bitrate (VideoCall): 80 Kbps; recommended bitrate (LIVE): 120 Kbps.|
|TRTCVideoResolution_160_160|3|Aspect ratio: 1:1; resolution: 160x160; recommended bitrate (VideoCall): 100 Kbps; recommended bitrate (LIVE): 150 Kbps.|
|TRTCVideoResolution_270_270|5|Aspect ratio: 1:1; resolution: 270x270; recommended bitrate (VideoCall): 200 Kbps; recommended bitrate (LIVE): 300 Kbps.|
|TRTCVideoResolution_480_480|7|Aspect ratio: 1:1; resolution: 480x480; recommended bitrate (VideoCall): 350 Kbps; recommended bitrate (LIVE): 500 Kbps.|
|TRTCVideoResolution_160_120|50|Aspect ratio: 4:3; resolution: 160x120; recommended bitrate (VideoCall): 100 Kbps; recommended bitrate (LIVE): 150 Kbps.|
|TRTCVideoResolution_240_180|52|Aspect ratio: 4:3; resolution: 240x180; recommended bitrate (VideoCall): 150 Kbps; recommended bitrate (LIVE): 250 Kbps.|
|TRTCVideoResolution_280_210|54|Aspect ratio: 4:3; resolution: 280x210; recommended bitrate (VideoCall): 200 Kbps; recommended bitrate (LIVE): 300 Kbps.|
|TRTCVideoResolution_320_240|56|Aspect ratio: 4:3; resolution: 320x240; recommended bitrate (VideoCall): 250 Kbps; recommended bitrate (LIVE): 375 Kbps.|
|TRTCVideoResolution_400_300|58|Aspect ratio: 4:3; resolution: 400x300; recommended bitrate (VideoCall): 300 Kbps; recommended bitrate (LIVE): 450 Kbps.|
|TRTCVideoResolution_480_360|60|Aspect ratio: 4:3; resolution: 480x360; recommended bitrate (VideoCall): 400 Kbps; recommended bitrate (LIVE): 600 Kbps.|
|TRTCVideoResolution_640_480|62|Aspect ratio: 4:3; resolution: 640x480; recommended bitrate (VideoCall): 600 Kbps; recommended bitrate (LIVE): 900 Kbps.|
|TRTCVideoResolution_960_720|64|Aspect ratio: 4:3; resolution: 960x720; recommended bitrate (VideoCall): 1000kbps; recommended bitrate (LIVE): 1500kbps。|
|TRTCVideoResolution_160_90|100|Aspect ratio: 16:9; resolution: 160x90; recommended bitrate (VideoCall): 150 Kbps; recommended bitrate (LIVE): 250 Kbps.|
|TRTCVideoResolution_256_144|102|Aspect ratio: 16:9; resolution: 256x144; recommended bitrate (VideoCall): 200 Kbps; recommended bitrate (LIVE): 300 Kbps.|
|TRTCVideoResolution_320_180|104|Aspect ratio: 16:9; resolution: 320x180; recommended bitrate (VideoCall): 250 Kbps; recommended bitrate (LIVE): 400 Kbps.|
|TRTCVideoResolution_480_270|106|Aspect ratio: 16:9; resolution: 480x270; recommended bitrate (VideoCall): 350 Kbps; recommended bitrate (LIVE): 550 Kbps.|
|TRTCVideoResolution_640_360|108|Aspect ratio: 16:9; resolution: 640x360; recommended bitrate (VideoCall): 500 Kbps; recommended bitrate (LIVE): 900 Kbps.|
|TRTCVideoResolution_960_540|110|Aspect ratio: 16:9; resolution: 960x540; recommended bitrate (VideoCall): 850 Kbps; recommended bitrate (LIVE): 1300 Kbps.|
|TRTCVideoResolution_1280_720|112|Aspect ratio: 16:9; resolution: 1280x720; recommended bitrate (VideoCall): 1200 Kbps; recommended bitrate (LIVE): 1800 Kbps.|
|TRTCVideoResolution_1920_1080|114|Aspect ratio: 16:9; resolution: 1920x1080; recommended bitrate (VideoCall): 2000 Kbps; recommended bitrate (LIVE): 3000 Kbps.|

## TRTCVideoResolutionMode

**Video aspect ratio mode.**

Only the landscape resolution (e.g., 640x360) is defined in  `TRTCVideoResolution` . If the portrait resolution (e.g., 360x640) needs to be used,  `Portrait`  must be selected for  `TRTCVideoResolutionMode` .

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoResolutionModeLandscape|0|Landscape resolution, such as  `TRTCVideoResolution_640_360 + TRTCVideoResolutionModeLandscape = 640x360` .|
|TRTCVideoResolutionModePortrait|1|Portrait resolution, such as  `TRTCVideoResolution_640_360 + TRTCVideoResolutionModePortrait = 360x640` .|

## TRTCVideoStreamType

**Video stream type.**

TRTC provides three different video streams, including:
-  HD big image: it is generally used to transfer video data from the camera.

-  Smooth small image: it has the same content as the big image, but with lower resolution and bitrate and thus lower definition.

-  Substream image: it is generally used for screen sharing. Only one user in the room is allowed to publish the substream video image at any time, while other users must wait for this user to close the substream before they can publish their own substream.

> **Note**
> The SDK does not support enabling the smooth small image alone, which must be enabled together with the big image. It will automatically set the resolution and bitrate of the small image.
>

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoStreamTypeBig|0|HD big image: it is generally used to transfer video data from the camera.|
|TRTCVideoStreamTypeSmall|1|Smooth small image: it has the same content as the big image, but with lower resolution and bitrate and thus lower definition.|
|TRTCVideoStreamTypeSub|2|Substream image: it is generally used for screen sharing. Only one user in the room is allowed to publish the substream video image at any time, while other users must wait for this user to close the substream before they can publish their own substream.|

## TRTCVideoFillMode

**Video image fill mode.**

If the aspect ratio of the video display area is not equal to that of the video image, you need to specify the fill mode:

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoFillMode_Fill|0|Fill mode: the video image will be centered and scaled to fill the entire display area, where parts that exceed the area will be cropped. The displayed image may be incomplete in this mode.|
|TRTCVideoFillMode_Fit|1|Fit mode: the video image will be scaled based on its long side to fit the display area, where the short side will be filled with black bars. The displayed image is complete in this mode, but there may be black bars.|
|TRTCVideoFillMode_ScaleFill|2|Scale-to-fill mode: This means that regardless of the aspect ratio of the image, it will be stretched or compressed to completely fill the display area. In this mode, the aspect ratio of the image may be altered, leading to distortion in the rendered image.|

## TRTCVideoRotation

**Video image rotation direction.**

TRTC provides rotation angle setting APIs for local and remote images. The following rotation angles are all clockwise.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoRotation0|0|No rotation|
|TRTCVideoRotation90|1|Clockwise rotation by 90 degrees|
|TRTCVideoRotation180|2|Clockwise rotation by 180 degrees|
|TRTCVideoRotation270|3|Clockwise rotation by 270 degrees|

## TRTCBeautyStyle

**Beauty (skin smoothing) filter algorithm.**

TRTC has multiple built-in skin smoothing algorithms. You can select the one most suitable for your product.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCBeautyStyleSmooth|0|Smooth style, which uses a more radical algorithm for more obvious effect and is suitable for show live streaming.|
|TRTCBeautyStyleNature|1|Natural style, which retains more facial details for more natural effect and is suitable for most live streaming use cases.|

## TRTCVideoPixelFormat

**Video pixel format.**

TRTC provides custom video capturing and rendering features.
-  For the custom capturing feature, you can use the following enumerated values to describe the pixel format of the video you capture.

-  For the custom rendering feature, you can specify the pixel format of the video you expect the SDK to call back.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoPixelFormat_Unknown|0|Undefined format|
|TRTCVideoPixelFormat_I420|1|YUV420P (I420) format|
|TRTCVideoPixelFormat_Texture_2D|2|OpenGL 2D texture format|
|TRTCVideoPixelFormat_BGRA32|3|BGRA32 format|
|TRTCVideoPixelFormat_NV21|4|NV21 format|
|TRTCVideoPixelFormat_RGBA32|5|RGBA format|

## TRTCVideoBufferType

**Video data transfer method.**

For custom capturing and rendering features, you need to use the following enumerated values to specify the method of transferring video data:
-  Method 1. This method uses memory buffer to transfer video data. It is efficient on iOS but inefficient on Android. It is the only method supported on Windows currently.

-  Method 2. This method uses texture to transfer video data. It is efficient on both iOS and Android but is not supported on Windows. To use this method, you should have a general familiarity with OpenGL programming.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoBufferType_Unknown|0|Undefined transfer method|
|TRTCVideoBufferType_Buffer|1|Use memory buffer to transfer video data. iOS:  `PixelBuffer` ; Android:  `Direct Buffer`  for JNI layer; Windows: memory data block.|
|TRTCVideoBufferType_Texture|3|Use OpenGL texture to transfer video data|
|TRTCVideoBufferType_TextureD3D11|4|Use D3D11 texture to transfer video data|

## TRTCVideoMirrorType

**Video mirror type.**

Video mirroring refers to the left-to-right flipping of the video image, especially for the local camera preview image. After mirroring is enabled, it can bring anchors a familiar "look into the mirror" experience.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoMirrorType_Auto|0|Auto mode: mirror the front camera's image but not the rear camera's image (for mobile devices only).|
|TRTCVideoMirrorType_Enable|1|Mirror the images of both the front and rear cameras.|
|TRTCVideoMirrorType_Disable|2|Disable mirroring for both the front and rear cameras.|

## TRTCSnapshotSourceType

**Data source of local video screenshot.**

The SDK can take screenshots from the following two data sources and save them as local files:
-  Video stream: the SDK screencaptures the native video content from the video stream. The screenshots are not controlled by the display of the rendering control.

-  Rendering layer: the SDK screencaptures the displayed video content from the rendering control, which can achieve the effect of WYSIWYG, but if the display area is too small, the screenshots will also be very small.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCSnapshotSourceTypeStream|0|The SDK screencaptures the native video content from the video stream. The screenshots are not controlled by the display of the rendering control.|
|TRTCSnapshotSourceTypeView|1|The SDK screencaptures the displayed video content from the rendering control, which can achieve the effect of WYSIWYG, but if the display area is too small, the screenshots will also be very small.|
|TRTCSnapshotSourceTypeCapture|2|The SDK screencaptures the capture video content from the capture control, which can capture the captured high-definition screenshots.|

## TRTCAppScene

**Use cases.**

TRTC features targeted optimizations for common audio/video application scenarios to meet the differentiated requirements in various verticals. The main scenarios can be divided into the following two categories:
-  Live streaming scenario (LIVE): including  `LIVE`  (audio + video) and  `VoiceChatRoom`  (pure audio).

In the live streaming scenario, users are divided into two roles: "anchor" and "audience". A single room can sustain up to 100,000 concurrent online users. This is suitable for live streaming to a large audience.
-  Real-Time scenario (RTC): including  `VideoCall`  (audio + video) and  `AudioCall`  (pure audio).

In the real-time scenario, there is no role difference between users, but a single room can sustain only up to 300 concurrent online users. This is suitable for small-scale real-time communication.
| Enum | Value | DESC |
| --- | --- | --- |
| TRTCAppSceneVideoCall | 0 | In the video call scenario, 720p and 1080p HD image quality is supported. A single room can sustain up to 300 concurrent online users, and up to 50 of them can speak simultaneously.<br>Use cases: [one-to-one video call], [video conferencing with up to 300 participants], [online medical diagnosis], [small class], [video interview], etc. |
| TRTCAppSceneLIVE | 1 | In the interactive video live streaming scenario, mic can be turned on/off smoothly without waiting for switchover, and the anchor latency is as low as less than 300 ms. Live streaming to hundreds of thousands of concurrent users in the audience role is supported with the playback latency down to 1,000 ms.<br>Use cases: [low-latency interactive live streaming], [big class], [anchor competition], [video dating room], [online interactive classroom], [remote training], [large-scale conferencing], etc.<br><strong>Note</strong><br>In this scenario, you must use the  <code>role</code>  field in  <code>TRTCParams</code>  to specify the role of the current user. |
| TRTCAppSceneAudioCall | 2 | Audio call scenario, where the  <code>SPEECH</code>  sound quality is used by default. A single room can sustain up to 300 concurrent online users, and up to 50 of them can speak simultaneously.<br>Use cases: [one-to-one audio call], [audio conferencing with up to 300 participants], [audio chat], [online Werewolf], etc. |
| TRTCAppSceneVoiceChatRoom | 3 | In the interactive audio live streaming scenario, mic can be turned on/off smoothly without waiting for switchover, and the anchor latency is as low as less than 300 ms. Live streaming to hundreds of thousands of concurrent users in the audience role is supported with the playback latency down to 1,000 ms.<br>Use cases: [audio club], [online karaoke room], [music live room], [FM radio], etc.<br><strong>Note</strong><br>In this scenario, you must use the  <code>role</code>  field in  <code>TRTCParams</code>  to specify the role of the current user. |

## TRTCRoleType

**Role.**

Role is applicable only to live streaming scenarios ( `TRTCAppSceneLIVE`  and  `TRTCAppSceneVoiceChatRoom` ). Users are divided into two roles:
-  Anchor, who can publish their audio/video streams. There is a limit on the number of anchors. Up to 50 anchors are allowed to publish streams at the same time in one room.

-  Audience, who can only listen to or watch audio/video streams of anchors in the room. If they want to publish their streams, they need to switch to the "anchor" role first through switchRole. One room can sustain up to 100,000 concurrent online users in the audience role.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCRoleAnchor|20|An anchor can publish their audio/video streams. There is a limit on the number of anchors. Up to 50 anchors are allowed to publish streams at the same time in one room.|
|TRTCRoleAudience|21|Audience can only listen to or watch audio/video streams of anchors in the room. If they want to publish their streams, they need to switch to the "anchor" role first through switchRole. One room can sustain up to 100,000 concurrent online users in the audience role.|

## TRTCQosControlMode(Deprecated)

**QoS control mode (disused).**

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCQosControlModeClient|0|Client-based control, which is for internal debugging of SDK and shall not be used by users.|
|TRTCQosControlModeServer|1|On-cloud control, which is the default and recommended mode.|

## TRTCVideoQosPreference

**Image quality preference.**

TRTC has two control modes in weak network environments: "ensuring clarity" and "ensuring smoothness". Both modes will give priority to the transfer of audio data.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCVideoQosPreferenceSmooth|1|Ensuring smoothness: in this mode, when the current network is unable to transfer a clear and smooth video image, the smoothness of the image will be given priority, but there will be blurs.|
|TRTCVideoQosPreferenceClear|2|Ensuring clarity (default value): in this mode, when the current network is unable to transfer a clear and smooth video image, the clarity of the image will be given priority, but there will be lags.|

## TRTCQuality

**Network quality.**

TRTC evaluates the current network quality once every two seconds. The evaluation results are divided into six levels:  `Excellent`  indicates the best, and  `Down`  indicates the worst.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCQuality_Unknown|0|Undefined|
|TRTCQuality_Excellent|1|The current network is excellent|
|TRTCQuality_Good|2|The current network is good|
|TRTCQuality_Poor|3|The current network is fair|
|TRTCQuality_Bad|4|The current network is bad|
|TRTCQuality_Vbad|5|The current network is very bad|
|TRTCQuality_Down|6|The current network cannot meet the minimum requirements of TRTC|

## TRTCAVStatusType

**Audio/Video playback status.**

This enumerated type is used in the audio status changed API onRemoteAudioStatusUpdated and the video status changed API onRemoteVideoStatusUpdated to specify the current audio/video status.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAVStatusStopped|0|Stopped|
|TRTCAVStatusPlaying|1|Playing|
|TRTCAVStatusLoading|2|Loading|

## TRTCAVStatusChangeReason

**Reasons for playback status changes.**

This enumerated type is used in the audio status changed API onRemoteAudioStatusUpdated and the video status changed API onRemoteVideoStatusUpdated to specify the reason for the current audio/video status change.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAVStatusChangeReasonInternal|0|Default value|
|TRTCAVStatusChangeReasonBufferingBegin|1|The stream enters the  `Loading`  state due to network congestion|
|TRTCAVStatusChangeReasonBufferingEnd|2|The stream enters the  `Playing`  state after network recovery|
|TRTCAVStatusChangeReasonLocalStarted|3|As a start-related API was directly called locally, the stream enters the  `Playing`  state|
|TRTCAVStatusChangeReasonLocalStopped|4|As a stop-related API was directly called locally, the stream enters the  `Stopped`  state|
|TRTCAVStatusChangeReasonRemoteStarted|5|As the remote user started (or resumed) publishing the audio or video stream, the stream enters the  `Loading`  or  `Playing`  state|
|TRTCAVStatusChangeReasonRemoteStopped|6|As the remote user stopped (or paused) publishing the audio or video stream, the stream enters the "Stopped" state|

## TRTCAudioQuality

**Sound quality.**

TRTC provides three well-tuned modes to meet the differentiated requirements for sound quality in various verticals:
-  Speech mode (Speech): it is suitable for application scenarios that focus on human communication. In this mode, the audio transfer is more resistant, and TRTC uses various voice processing technologies to ensure the optimal smoothness even in weak network environments.

-  Music mode (Music): it is suitable for scenarios with demanding requirements for music. In this mode, the amount of transferred audio data is very large, and TRTC uses various technologies to ensure that the high-fidelity details of music signals can be restored in each frequency band.

-  Default mode (Default): it is between  `Speech`  and  `Music` . In this mode, the reproduction of music is better than that in  `Speech`  mode, and the amount of transferred data is much lower than that in  `Music`  mode; therefore, this mode has good adaptability to various scenarios.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAudioQualitySpeech|1|Speech mode: mono channel; bitrate: 18 Kbps. This mode has the best resistance among all modes and is suitable for audio call scenarios, such as online meeting and audio call.|
|TRTCAudioQualityDefault|2|Default mode: mono channel; bitrate: 50 Kbps. This mode is between the speech mode and the music mode as the default mode in the SDK and is recommended.|
|TRTCAudioQualityMusic|3|Music mode: full-band stereo; bitrate: 128 Kbps. This mode is suitable for scenarios where Hi-Fi music transfer is required, such as online karaoke and music live streaming.|

## TRTCAudioRoute

**Audio route (i.e., audio playback mode).**

"Audio route" determines whether the sound is played back from the speaker or receiver of a mobile device; therefore, this API is applicable only to mobile devices such as phones.

Generally, a phone has two speakers: one is the receiver at the top, and the other is the stereo speaker at the bottom.
-  If the audio route is set to the receiver, the volume is relatively low, and the sound can be heard clearly only when the phone is put near the ear. This mode has a high level of privacy and is suitable for answering calls.

-  If the audio route is set to the speaker, the volume is relatively high, so there is no need to put the phone near the ear. Therefore, this mode can implement the "hands-free" feature.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAudioModeUnknown|-1|Unknown：default router.|
|TRTCAudioModeSpeakerphone|0|Speakerphone: the speaker at the bottom is used for playback (hands-free). With relatively high volume, it is used to play music out loud.|
|TRTCAudioModeEarpiece|1|Earpiece: the receiver at the top is used for playback. With relatively low volume, it is suitable for call scenarios that require privacy.|
|TRTCAudioModeWiredHeadset|2|WiredHeadset：play using wired headphones.|
|TRTCAudioModeBluetoothHeadset|3|BluetoothHeadset：play with bluetooth headphones.|
|TRTCAudioModeSoundCard|4|SoundCard：play using a USB sound card.|

## TRTCAudioFrameFormat

**Audio frame content format.**

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAudioFrameFormatNone|0|None|
|TRTCAudioFrameFormatPCM|Not Defined|Audio data in PCM format|

## TRTCAudioFrameOperationMode

**Audio callback data operation mode.**

TRTC provides two modes of operation for audio callback data.
-  Read-only mode (ReadOnly): Get audio data only from the callback.

-  ReadWrite mode (ReadWrite): You can get and modify the audio data of the callback.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAudioFrameOperationModeReadWrite|0|Read-write mode: You can get and modify the audio data of the callback, the default mode.|
|TRTCAudioFrameOperationModeReadOnly|1|Read-only mode: Get audio data from callback only.|

## TRTCLogLevel

**Log level.**

Different log levels indicate different levels of details and number of logs. We recommend you set the log level to  `TRTCLogLevelInfo`  generally.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCLogLevelVerbose|0|Output logs at all levels|
|TRTCLogLevelDebug|1|Output logs at the DEBUG, INFO, WARNING, ERROR, and FATAL levels|
|TRTCLogLevelInfo|2|Output logs at the INFO, WARNING, ERROR, and FATAL levels|
|TRTCLogLevelWarn|3|Output logs at the WARNING, ERROR, and FATAL levels|
|TRTCLogLevelError|4|Output logs at the ERROR and FATAL levels|
|TRTCLogLevelFatal|5|Output logs at the FATAL level|
|TRTCLogLevelNone|6|Do not output any SDK logs|

## TRTCScreenCaptureSourceType

**Screen sharing target type (for desktops only).**

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCScreenCaptureSourceTypeUnknown|-1|Undefined|
|TRTCScreenCaptureSourceTypeWindow|0|The screen sharing target is the window of an application|
|TRTCScreenCaptureSourceTypeScreen|1|The screen sharing target is the entire screen|
|TRTCScreenCaptureSourceTypeCustom|2|The screen sharing target is a user-defined data source|

## TRTCTranscodingConfigMode

**Layout mode of On-Cloud MixTranscoding.**

TRTC's On-Cloud MixTranscoding service can mix multiple audio/video streams in the room into one stream. Therefore, you need to specify the layout scheme of the video images. The following layout modes are provided:
| Enum | Value | DESC |
| --- | --- | --- |
| TRTCTranscodingConfigMode_Unknown | 0 | Undefined |
| TRTCTranscodingConfigMode_Manual | 1 | Manual layout mode<br>In this mode, you need to specify the precise position of each video image. This mode has the highest degree of freedom, but its ease of use is the worst:<br>-  You need to enter all the parameters in TRTCTranscodingConfig, including the position coordinates of each video image (TRTCMixUser).<br>-  You need to listen on the onUserVideoAvailable and onUserAudioAvailable event callbacks in ITRTCCloudCallback and constantly adjust the  <code>mixUsers</code>  parameter according to the audio/video status of each user with mic on in the current room. |
| TRTCTranscodingConfigMode_Template_PureAudio | 2 | Pure audio mode<br>This mode is suitable for pure audio scenarios such as audio call (AudioCall) and audio chat room (VoiceChatRoom).<br>-  You only need to set it once through the setMixTranscodingConfig API after room entry, and then the SDK will automatically mix the audio of all mic-on users in the room into the current user's live stream.<br>-  You don't need to set the  <code>mixUsers</code>  parameter in TRTCTranscodingConfig; instead, you only need to set the  <code>audioSampleRate</code> ,  <code>audioBitrate</code>  and  <code>audioChannels</code>  parameters. |
| TRTCTranscodingConfigMode_Template_PresetLayout | 3 | Preset layout mode<br>This is the most popular layout mode, because it allows you to set the position of each video image in advance through placeholders, and then the SDK automatically adjusts it dynamically according to the number of video images in the room.<br>In this mode, you still need to set the  <code>mixUsers</code>  parameter, but you can set  <code>userId</code>  as a "placeholder". Placeholder values include:<br>-  "$PLACE_HOLDER_REMOTE$": image of remote user. Multiple images can be set.<br>-  "$PLACE_HOLDER_LOCAL_MAIN$": local camera image. Only one image can be set.<br>-  "$PLACE_HOLDER_LOCAL_SUB$": local screen sharing image. Only one image can be set.<br>In this mode, you don't need to listen on the onUserVideoAvailable and onUserAudioAvailable callbacks in ITRTCCloudCallback to make real-time adjustments.<br>Instead, you only need to call setMixTranscodingConfig once after successful room entry. Then, the SDK will automatically populate the placeholders you set with real  <code>userId</code>  values. |
| TRTCTranscodingConfigMode_Template_ScreenSharing | 4 | Screen sharing mode<br>This mode is suitable for screen sharing-based use cases such as online education and supported only by the SDKs for Windows and macOS.<br>In this mode, the SDK will first build a canvas according to the target resolution you set (through the  <code>videoWidth</code>  and  <code>videoHeight</code>  parameters).<br>-  Before the teacher enables screen sharing, the SDK will scale up the teacher's camera image and draw it onto the canvas.<br>-  After the teacher enables screen sharing, the SDK will draw the video image shared on the screen onto the same canvas.<br>The purpose of this layout mode is to ensure consistency in the output resolution of the mixtranscoding module and avoid problems with blurred screen during course replay and webpage playback (web players don't support adjustable resolution).<br>Meanwhile, the audio of mic-on students will be mixed into the teacher's audio/video stream by default.<br>Video content is primarily the shared screen in teaching mode, and it is a waste of bandwidth to transfer camera image and screen image at the same time.<br>Therefore, the recommended practice is to directly draw the camera image onto the current screen through the setLocalVideoRenderCallback API.<br>In this mode, you don't need to set the  <code>mixUsers</code>  parameter in TRTCTranscodingConfig, and the SDK will not mix students' images so as not to interfere with the screen sharing effect.<br>You can set width x height in TRTCTranscodingConfig to 0 px x 0 px, and the SDK will automatically calculate a suitable resolution based on the aspect ratio of the user's current screen.<br>-  If the teacher's current screen width is less than or equal to 1920 px, the SDK will use the actual resolution of the teacher's current screen.<br>-  If the teacher's current screen width is greater than 1920 px, the SDK will select one of the three resolutions of 1920x1080 (16:9), 1920x1200 (16:10), and 1920x1440 (4:3) according to the current screen aspect ratio. |

## TRTCRecordType

**Media recording type.**

This enumerated type is used in the local media recording API startLocalRecording to specify whether to record audio/video files or pure audio files.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCLocalRecordType_Audio|0|Record audio only|
|TRTCLocalRecordType_Video|1|Record video only|
|TRTCLocalRecordType_Both|2|Record both audio and video|

## TRTCMixInputType

**Stream mix input type.**
| Enum | Value | DESC |
| --- | --- | --- |
| TRTCMixInputTypeUndefined | 0 | Default.<br>Considering the compatibility with older versions, if you specify the inputType as Undefined, the SDK will determine the stream mix input type according to the value of the  <code>pureAudio</code>  parameter |
| TRTCMixInputTypeAudioVideo | 1 | Mix both audio and video |
| TRTCMixInputTypePureVideo | 2 | Mix video only |
| TRTCMixInputTypePureAudio | 3 | Mix audio only |
| TRTCMixInputTypeWatermark | 4 | Mix watermark<br>In this case, you don't need to specify the  <code>userId</code>  parameter, but you need to specify the  <code>image</code>  parameter. It is recommended to use png format. |

## TRTCWaterMarkSrcType

**Watermark image source type.**

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCWaterMarkSrcTypeFile|0|Path of the image file, which can be in BMP, GIF, JPEG, PNG, TIFF, Exif, WMF, or EMF format|
|TRTCWaterMarkSrcTypeBGRA32|1|Memory block in BGRA32 format|
|TRTCWaterMarkSrcTypeRGBA32|2|Memory block in RGBA32 format|

## TRTCAudioRecordingContent

**Audio recording content type.**

This enumerated type is used in the audio recording API startAudioRecording to specify the content of the recorded audio.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCAudioRecordingContentAll|0|Record both local and remote audio|
|TRTCAudioRecordingContentLocal|1|Record local audio only|
|TRTCAudioRecordingContentRemote|2|Record remote audio only|

## TRTCPublishMode

**The publishing mode.**

This enum type is used by the publishing API startPublishMediaStream.

TRTC can mix multiple streams in a room and publish the mixed stream to a CDN or to a TRTC room. It can also publish the stream of the local user to Tencent Cloud or a third-party CDN.

You can specify one of the following publishing modes to use:
| Enum | Value | DESC |
| --- | --- | --- |
| TRTCPublishModeUnknown | 0 | Undefined |
| TRTCPublishBigStreamToCdn | 1 | Use this parameter to publish the primary stream (TRTCVideoStreamTypeBig) in the room to Tencent Cloud or a third-party CDN (only RTMP is supported). |
| TRTCPublishSubStreamToCdn | 2 | Use this parameter to publish the substream (TRTCVideoStreamTypeSub) in the room to Tencent Cloud or a third-party CDN (only RTMP is supported). |
| TRTCPublishMixStreamToCdn | 3 | Use this parameter together with the encoding parameter TRTCStreamEncoderParam and On-Cloud MixTranscoding parameter TRTCStreamMixingConfig to transcode the streams you specify and publish the mixed stream to Tencent Cloud or a third-party CDN (only RTMP is supported). |
| TRTCPublishMixStreamToRoom | 4 | Use this parameter together with the encoding parameter TRTCStreamEncoderParam and On-Cloud MixTranscoding parameter TRTCStreamMixingConfig to transcode the streams you specify and publish the mixed stream to the room you specify.<br>-  Use  <code>TRTCUser</code>  in TRTCPublishTarget to specify the robot that publishes the transcoded stream to a TRTC room. |

## TRTCEncryptionAlgorithm

**Encryption Algorithm.**

This enumeration type is used for media stream private encryption algorithm selection.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCEncryptionAlgorithmAes128Gcm|0|AES GCM 128。|
|TRTCEncryptionAlgorithmAes256Gcm|1|AES GCM 256。|

## TRTCSpeedTestScene

**Speed Test Scene.**

This enumeration type is used for speed test scene selection.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCSpeedTestScene_DelayTesting|1|Delay testing.|
|TRTCSpeedTestScene_DelayAndBandwidthTesting|2|Delay and bandwidth testing.|
|TRTCSpeedTestScene_OnlineChorusTesting|3|Online chorus testing.|

## TRTCGravitySensorAdaptiveMode

**Set the adaptation mode of gravity sensing (only applicable to mobile terminals).**

Begin from v11.7 version，It only takes effect when the camera capture scene inside SDK is used.

|Enum|Value|DESC|
|---------|---------|---------|
|TRTCGravitySensorAdaptiveMode_Disable|0|Turn off the gravity sensor and make a decision based on the current acquisition resolution and the set encoding resolution. If the two are inconsistent, rotate 90 degrees to ensure the maximum frame.|
|TRTCGravitySensorAdaptiveMode_FillByCenterCrop|1|Turn on the gravity sensor to always ensure that the remote screen image is positive. When the intermediate process needs to deal with inconsistent resolutions, use the center cropping mode.|
|TRTCGravitySensorAdaptiveMode_FitWithBlackBorder|2|Turn on the gravity sensor to always ensure that the remote screen image is positive. When the resolution needs to be processed inconsistently in the intermediate process, use the superimposed black border mode.|

## TRTCParams

**Room entry parameters.**

As the room entry parameters in the TRTC SDK, these parameters must be correctly set so that the user can successfully enter the audio/video room specified by  `roomId`  or  `strRoomId` .

For historical reasons, TRTC supports two types of room IDs:  `roomId`  and  `strRoomId` .

Note: do not mix  `roomId`  and  `strRoomId` , because they are not interchangeable. For example, the number  `123`  and the string  `123`  are two completely different rooms in TRTC.
| EnumType | DESC |
| --- | --- |
| businessInfo | Field description: business data, which is optional. This field is needed only by some advanced features.<br>Recommended value: do not set this field on your own. |
| privateMapKey | Field description: permission credential used for permission control, which is optional. If you want only users with the specified  <code>userId</code>  values to enter a room, you need to use  <code>privateMapKey</code>  to restrict the permission.<br>Recommended value: we recommend you use this parameter only if you have high security requirements. For more information, please see <a href="https://www.tencentcloud.com/document/product/647/35157">Enabling Advanced Permission Control</a>. |
| role | Field description: role in the live streaming scenario, which is applicable only to the live streaming scenario (TRTCAppSceneLIVE or TRTCAppSceneVoiceChatRoom) but doesn't take effect in the call scenario.<br>Recommended value: default value: anchor (TRTCRoleAnchor). |
| roomId | Field description: numeric room ID. Users (userId) in the same room can see one another and make audio/video calls.<br>Recommended value: value range: 1–4294967294.<br>@note  <code>roomId</code>  and  <code>strRoomId</code>  are mutually exclusive. If you decide to use  <code>strRoomId</code> , then  <code>roomId</code>  should be entered as 0. If both are entered,  <code>roomId</code>  will be used.<br><strong>Note</strong><br>do not mix  <code>roomId</code>  and  <code>strRoomId</code> , because they are not interchangeable. For example, the number  <code>123</code>  and the string  <code>123</code>  are two completely different rooms in TRTC. |
| sdkAppId | Field description: application ID, which is required. Tencent Cloud generates bills based on  <code>sdkAppId</code> .<br>Recommended value: the ID can be obtained on the account information page in the <a href="https://console.cloud.tencent.com/rav/">TRTC console</a> after the corresponding application is created. |
| strRoomId | Field description: string-type room ID. Users (userId) in the same room can see one another and make audio/video calls.<br>@note  <code>roomId</code>  and  <code>strRoomId</code>  are mutually exclusive. If you decide to use  <code>strRoomId</code> , then  <code>roomId</code>  should be entered as 0. If both are entered,  <code>roomId</code>  will be used.<br><strong>Note</strong><br>do not mix  <code>roomId</code>  and  <code>strRoomId</code> , because they are not interchangeable. For example, the number  <code>123</code>  and the string  <code>123</code>  are two completely different rooms in TRTC.<br>Recommended value: the length limit is 64 bytes. The following 89 characters are supported:<br>-  Uppercase and lowercase letters (a–z and A–Z)<br>-  Digits (0–9)<br>-  Space, "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "\\|", "~", and ",". |
| streamId | Field description: specified  <code>streamId</code>  in Tencent Cloud CSS, which is optional. After setting this field, you can play back the user's audio/video stream on Tencent Cloud CSS CDN through a standard pull scheme (FLV or HLS).<br>Recommended value: this parameter can contain up to 64 bytes and can be left empty. We recommend you use  <code>sdkappid_roomid_userid_main</code>  as the  <code>streamid</code> , which is easier to identify and will not cause conflicts in your multiple applications.<br><strong>Note</strong><br>to use Tencent Cloud CSS CDN, you need to enable the auto-relayed live streaming feature on the "Function Configuration" page in the <a href="https://console.cloud.tencent.com/trtc/">console</a> first.<br>For more information, please see <a href="https://www.tencentcloud.com/document/product/647/47858">Relay to CDN</a>. |
| userDefineRecordId | Field description: on-cloud recording field, which is optional and used to specify whether to record the user's audio/video stream in the cloud.<br>For more information, please see <a href="https://www.tencentcloud.com/document/product/647/45169">On-Cloud Recording</a>.<br>Recommended value: it can contain up to 64 bytes. Letters (a–z and A–Z), digits (0–9), underscores, and hyphens are allowed.<br>Scheme 1. Manual recording<br>1. Enable on-cloud recording in "Application Management" > "On-cloud Recording Configuration" in the <a href="https://console.cloud.tencent.com/trtc">console</a>.<br>2. Set "Recording Mode" to "Manual Recording".<br>3. After manual recording is set, in a TRTC room, only users with the  <code>userDefineRecordId</code>  parameter set will have video recording files in the cloud, while users without this parameter set will not.<br>4. The recording file will be named in the format of "userDefineRecordId_start time_end time" in the cloud.<br>Scheme 2. Auto-recording<br>1. You need to enable on-cloud recording in "Application Management" > "On-cloud Recording Configuration" in the <a href="https://console.cloud.tencent.com/trtc">console</a>.<br>2. Set "Recording Mode" to "Auto-recording".<br>3. After auto-recording is set, any user who upstreams audio/video in a TRTC room will have a video recording file in the cloud.<br>4. The file will be named in the format of "userDefineRecordId_start time_end time". If  <code>userDefineRecordId</code>  is not specified, the file will be named in the format of "streamId_start time_end time". |
| userId | Field description: user ID, which is required. It is the  <code>userId</code>  of the local user in UTF-8 encoding and acts as the username.<br>Recommended value: if the ID of a user in your account system is "mike",  <code>userId</code>  can be set to "mike". |
| userSig | Field description: user signature, which is required. It is the authentication signature corresponding to the current  <code>userId</code>  and acts as the login password for Tencent Cloud services.<br>Recommended value: for the calculation method, please see <a href="https://www.tencentcloud.com/document/product/647/35166">UserSig</a>. |

## TRTCVideoEncParam

**Video encoding parameters.**

These settings determine the quality of image viewed by remote users as well as the image quality of recorded video files in the cloud.
| EnumType | DESC |
| --- | --- |
| enableAdjustRes | Field description: whether to allow dynamic resolution adjustment. Once enabled, this field will affect on-cloud recording.<br>Recommended value: this feature is suitable for scenarios that don't require on-cloud recording. After it is enabled, the SDK will intelligently select a suitable resolution according to the current network conditions to avoid the inefficient encoding mode of "large resolution + small bitrate".<br><strong>Note</strong><br>default value: false. If you need on-cloud recording, please do not enable this feature, because if the video resolution changes, the MP4 file recorded in the cloud cannot be played back normally by common players. |
| minVideoBitrate | Field description: minimum video bitrate. The SDK will reduce the bitrate to as low as the value specified by  <code>minVideoBitrate</code>  to ensure the smoothness only if the network conditions are poor.<br>Note: default value: 0, indicating that a reasonable value of the lowest bitrate will be automatically calculated by the SDK according to the resolution you specify.<br>Recommended value: you can set the  <code>videoBitrate</code>  and  <code>minVideoBitrate</code>  parameters at the same time to restrict the SDK's adjustment range of the video bitrate:<br>-  If you want to "ensure clarity while allowing lag in weak network environments", you can set  <code>minVideoBitrate</code>  to 60% of  <code>videoBitrate</code> .<br>-  If you want to "ensure smoothness while allowing blur in weak network environments", you can set  <code>minVideoBitrate</code>  to a low value, for example, 100 Kbps.<br>-  If you set  <code>videoBitrate</code>  and  <code>minVideoBitrate</code>  to the same value, it is equivalent to disabling the adaptive adjustment capability of the SDK for the video bitrate. |
| resMode | Field description: resolution mode (landscape/portrait)<br>Recommended value: for mobile platforms (iOS and Android),  <code>Portrait</code>  is recommended; for desktop platforms (Windows and macOS),  <code>Landscape</code>  is recommended.<br><strong>Note</strong><br>to use a portrait resolution, please specify  <code>resMode</code>  as  <code>Portrait</code> ; for example, when used together with  <code>Portrait</code> , 640x360 represents 360x640. |
| videoBitrate | Field description: target video bitrate. The SDK encodes streams at the target video bitrate and will actively reduce the bitrate only in weak network environments.<br>Recommended value: please see the optimal bitrate for each specification in  <code>TRTCVideoResolution</code> . You can also slightly increase the optimal bitrate.<br>For example,  <code>TRTCVideoResolution_1280_720</code>  corresponds to the target bitrate of 1,200 Kbps. You can also set the bitrate to 1,500 Kbps for higher definition.<br><strong>Note</strong><br>you can set the  <code>videoBitrate</code>  and  <code>minVideoBitrate</code>  parameters at the same time to restrict the SDK's adjustment range of the video bitrate:<br>-  If you want to "ensure clarity while allowing lag in weak network environments", you can set  <code>minVideoBitrate</code>  to 60% of  <code>videoBitrate</code> .<br>-  If you want to "ensure smoothness while allowing blur in weak network environments", you can set  <code>minVideoBitrate</code>  to a low value, for example, 100 Kbps.<br>-  If you set  <code>videoBitrate</code>  and  <code>minVideoBitrate</code>  to the same value, it is equivalent to disabling the adaptive adjustment capability of the SDK for the video bitrate. |
| videoFps | Field description: video capturing frame rate<br>Recommended value: 15 or 20 fps. If the frame rate is lower than 5 fps, there will be obvious lagging; if lower than 10 fps but higher than 5 fps, there will be slight lagging; if higher than 20 fps, the bandwidth will be wasted (the frame rate of movies is generally 24 fps).<br><strong>Note</strong><br>the front cameras on certain Android phones do not support a capturing frame rate higher than 15 fps. For some Android phones that focus on beautification features, the capturing frame rate of the front cameras may be lower than 10 fps. |
| videoResolution | Field description: video resolution<br>Recommended value<br>-  For mobile video call, we recommend you select a resolution of 360x640 or below and select  <code>Portrait</code>  (portrait resolution) for  <code>resMode</code> .<br>-  For mobile live streaming, we recommend you select a resolution of 540x960 and select  <code>Portrait</code>  (portrait resolution) for  <code>resMode</code> .<br>-  For desktop platforms (Windows and macOS), we recommend you select a resolution of 640x360 or above and select  <code>Landscape</code>  (landscape resolution) for  <code>resMode</code> .<br><strong>Note</strong><br>to use a portrait resolution, please specify  <code>resMode</code>  as  <code>Portrait</code> ; for example, when used together with  <code>Portrait</code> , 640x360 represents 360x640. |

## TRTCNetworkQosParam

**Network QoS control parameter set.**

Network QoS control parameter. The settings determine the QoS control policy of the SDK in weak network conditions (e.g., whether to "ensure clarity" or "ensure smoothness").
| EnumType | DESC |
| --- | --- |
| controlMode | Field description: QoS control mode (disused)<br>Recommended value: on-cloud control<br><strong>Note</strong><br>please set the on-cloud control mode (TRTCQosControlModeServer). |
| preference | Field description: whether to ensure smoothness or clarity<br>Recommended value: ensuring clarity<br><strong>Note</strong><br>this parameter mainly affects the audio/video performance of TRTC in weak network environments:<br>-  Ensuring smoothness: in this mode, when the current network is unable to transfer a clear and smooth video image, the smoothness of the image will be given priority, but there will be blurs. See TRTCVideoQosPreferenceSmooth<br>-  Ensuring clarity (default value): in this mode, when the current network is unable to transfer a clear and smooth video image, the clarity of the image will be given priority, but there will be lags. See TRTCVideoQosPreferenceClear |

## TRTCRenderParams

**Rendering parameters of video image.**

You can use these parameters to control the video image rotation angle, fill mode, and mirror mode.
| EnumType | DESC |
| --- | --- |
| fillMode | Field description: image fill mode<br>Recommended value: fill (the image may be stretched or cropped) or fit (there may be black bars in unmatched areas). Default value: TRTCVideoFillMode_Fill |
| mirrorType | Field description: image mirror mode<br>Recommended value: default value: TRTCVideoMirrorType_Auto |
| rotation | Field description: clockwise image rotation angle<br>Recommended value: rotation angles of 90, 180, and 270 degrees are supported. Default value: TRTCVideoRotation0 |

## TRTCQualityInfo

**Network quality.**

This indicates the quality of the network. You can use it to display the network quality of each user on the UI.

|EnumType|DESC|
|---------|---------|
|quality|Network quality|
|userId|User ID|

## TRTCVolumeInfo

**Volume.**

This indicates the audio volume value. You can use it to display the volume of each user in the UI.
| EnumType | DESC |
| --- | --- |
| pitch | The local user's vocal frequency (unit: Hz), the value range is [0 - 4000]. For remote users, this value is always 0. |
| spectrumData | Audio spectrum data, which divides the sound frequency into 256 frequency domains, spectrumData records the energy value of each frequency domain,<br>The value range of each energy value is [-300, 0] in dBFS.<br><strong>Note</strong><br>The local spectrum is calculated using the audio data before encoding, which will be affected by the capture volume, BGM, etc.; the remote spectrum is calculated using the received audio data, and operations such as adjusting the remote playback volume locally will not affect it. |
| spectrumDataLength | The length of recorded audio spectrum data, which is 256. |
| userId | <code>userId</code>  of the speaker. An empty value indicates the local user. |
| vad | Vad result of the local user. 0: not speech 1: speech. |
| volume | Volume of the speaker. Value range: 0–100. |

## TRTCSpeedTestParams

**Network speed testing parameters.**

You can test the network speed through the startSpeedTest: interface before the user enters the room (this API cannot be called during a call).
| EnumType | DESC |
| --- | --- |
| expectedDownBandwidth | Expected downstream bandwidth (kbps, value range: 10 to 5000, no downlink bandwidth test when it is 0).<br><strong>Note</strong><br>When the parameter  <code>scene</code>  is set to TRTCSpeedTestScene_OnlineChorusTesting, in order to obtain more accurate information such as  <code>rtt / jitter</code> , the value range is limited to [10, 1000]. |
| expectedUpBandwidth | Expected upstream bandwidth (kbps, value range: 10 to 5000, no uplink bandwidth test when it is 0).<br><strong>Note</strong><br>When the parameter  <code>scene</code>  is set to TRTCSpeedTestScene_OnlineChorusTesting, in order to obtain more accurate information such as  <code>rtt / jitter</code> , the value range is limited to [10, 1000]. |
| scene | Speed test scene. |
| sdkAppId | Application identification, please . |
| userId | User identification, please . |
| userSig | User signature, please . |

## TRTCSpeedTestResult

**Network speed test result.**

The startSpeedTest: API can be used to test the network speed before a user enters a room (this API cannot be called during a call).

|EnumType|DESC|
|---------|---------|
|availableDownBandwidth|Downstream bandwidth (in kbps, -1: invalid value).|
|availableUpBandwidth|Upstream bandwidth (in kbps, -1: invalid value).|
|downJitter|Downlink data packet jitter (ms) refers to the stability of data communication in the user's current network environment. The smaller the value, the better. The normal value range is [0, 100]. -1 means that the speed test failed to obtain an effective value. Generally, the Jitter of the WiFi network will be slightly larger than that of the 4G/5G environment.|
|downLostRate|Downstream packet loss rate between 0 and 1.0. For example, 0.2 indicates that 2 data packets may be lost in every 10 packets received from the server.|
|errMsg|Error message for network speed test.|
|ip|Server IP address.|
|quality|Network quality, which is tested and calculated based on the internal evaluation algorithm. For more information, please see TRTCQuality|
|rtt|Delay in milliseconds, which is the round-trip time between the current device and TRTC server. The smaller the value, the better. The normal value range is 10–100 ms.|
|success|Whether the network speed test is successful.|
|upJitter|Uplink data packet jitter (ms) refers to the stability of data communication in the user's current network environment. The smaller the value, the better. The normal value range is [0, 100]. -1 means that the speed test failed to obtain an effective value. Generally, the Jitter of the WiFi network will be slightly larger than that of the 4G/5G environment.|
|upLostRate|Upstream packet loss rate between 0 and 1.0. For example, 0.3 indicates that 3 data packets may be lost in every 10 packets sent to the server.|

## TRTCTexture

**Video texture data.**

|EnumType|DESC|
|---------|---------|
|d3d11TextureId|Field description: The D3D11 texture, which is the pointer of ID3D11Texture2D, only for Windows.|
|glContext|Field description: The OpenGL context to which the texture corresponds, for Windows and Android.|
|glTextureId|Field description: video texture ID|

## TRTCVideoFrame

**Video frame information.**

 `TRTCVideoFrame`  is used to describe the raw data of a frame of the video image, which is the image data before frame encoding or after frame decoding.
| EnumType | DESC |
| --- | --- |
| bufferType | Field description: video data structure type |
| data | Field description: video data when  <code>bufferType</code>  is TRTCVideoBufferType_Buffer, which carries the memory data blocks for the C++ layer. |
| height | Field description: video height<br>Recommended value: please enter the height of the video data passed in. |
| length | Field description: video data length in bytes. For I420, length = width * height * 3 / 2; for BGRA32, length = width * height * 4. |
| rotation | Field description: clockwise rotation angle of video pixels |
| texture | Field description: video data when  <code>bufferType</code>  is TRTCVideoBufferType_Texture, which carries the texture data used for OpenGL rendering. |
| timestamp | Field description: video frame timestamp in milliseconds<br>Recommended value: this parameter can be set to 0 for custom video capturing. In this case, the SDK will automatically set the  <code>timestamp</code>  field. However, please "evenly" set the calling interval of sendCustomVideoData. |
| videoFormat | Field description: video pixel format |
| width | Field description: video width<br>Recommended value: please enter the width of the video data passed in. |

## TRTCAudioFrame

**Audio frame data.**

|EnumType|DESC|
|---------|---------|
|audioFormat|Field description: audio frame format|
|channel|Field description: number of sound channels|
|data|Field description: audio data|
|extraData|Field description: extra data in audio frame, message sent by remote users through onLocalProcessedAudioFrame that add to audio frame will be callback through this field.|
|extraDataLength|Field description: extra data length|
|length|Field description: audio data length|
|sampleRate|Field description: sample rate|
|timestamp|Field description: timestamp in ms|

## TRTCMixUser

**Description information of each video image in On-Cloud MixTranscoding.**

 `TRTCMixUser`  is used to specify the location, size, layer, and stream type of each video image in On-Cloud MixTranscoding.
| EnumType | DESC |
| --- | --- |
| image | Field description: specify the placeholder or watermark image. The placeholder image will be displayed when there is no upstream video.A watermark image is a semi-transparent image posted in the mixed image, and this image will always be overlaid on the mixed image.<br>-  When the  <code>inputType</code>  field is set to TRTCMixInputTypePureAudio, the image is a placeholder image, and you need to specify  <code>userId</code> .<br>-  When the  <code>inputType</code>  field is set to TRTCMixInputTypeWatermark, the image is a watermark image, and you don't need to specify  <code>userId</code> .<br>Recommended value: default value: null, indicating not to set the placeholder or watermark image.<br><strong>Note</strong><br>TRTC's backend service will mix the image specified by the URL address into the final stream.URL link length is limited to 512 bytes. The image size is limited to 10MB.Support png, jpg, jpeg, bmp format. Take effects iff the  <code>inputType</code>  field is set to TRTCMixInputTypePureAudio or TRTCMixInputTypeWatermark. |
| inputType | Field description: specify the mixed content of this stream (audio only, video only, audio and video, or watermark).<br>Recommended value: default value: TRTCMixInputTypeUndefined.<br><strong>Note</strong><br>-  When specifying  <code>inputType</code>  as TRTCMixInputTypeUndefined and specifying  <code>pureAudio</code>  to YES, it is equivalent to setting  <code>inputType</code>  to  <code>TRTCMixInputTypePureAudio</code> .<br>-  When specifying  <code>inputType</code>  as TRTCMixInputTypeUndefined and specifying  <code>pureAudio</code>  to NO, it is equivalent to setting  <code>inputType</code>  to  <code>TRTCMixInputTypeAudioVideo</code> .<br>-  When specifying  <code>inputType</code>  as TRTCMixInputTypeWatermark, you don't need to specify the  <code>userId</code>  field, but you need to specify the  <code>image</code>  field. |
| pureAudio | Field description: specify whether this stream mixes audio only<br>Recommended value: default value: false<br><strong>Note</strong><br>this field has been disused. We recommend you use the new field  <code>inputType</code>  introduced in v8.5. |
| rect | Field description: specify the coordinate area of this video image in px |
| renderMode | Field description: specify the display mode of this stream.<br>Recommended value: default value: 0. 0 is cropping, 1 is zooming, 2 is zooming and displaying black background.<br><strong>Note</strong><br>image doesn't support setting  <code>renderMode</code>  temporarily, the default display mode is forced stretch. |
| roomId | Field description: ID of the room where this audio/video stream is located (an empty value indicates the local room ID) |
| soundLevel | Field description: specify the target volumn level of On-Cloud MixTranscoding. (value range: 0-100)<br>Recommended value: default value: 100. |
| streamType | Field description: specify whether this video image is the primary stream image (TRTCVideoStreamTypeBig) or substream image (TRTCVideoStreamTypeSub). |
| userId | Field description: user ID |
| zOrder | Field description: specify the level of this video image (value range: [1, 15]; the value must be unique) |

## TRTCTranscodingConfig

**Layout and transcoding parameters of On-Cloud MixTranscoding.**

These parameters are used to specify the layout position information of each video image and the encoding parameters of mixtranscoding during On-Cloud MixTranscoding.
| EnumType | DESC |
| --- | --- |
| appId | Field description:  <code>appId</code>  of Tencent Cloud CSS<br>Recommended value: please click  <code>Application Management</code>  >  <code>Application Information</code>  in the <a href="https://console.cloud.tencent.com/trtc">TRTC console</a> and get the  <code>appId</code>  in  <code>Relayed Live Streaming Info</code> .<br><strong>Note</strong><br>applications created on or after January 9, 2020 do not need to fill in this field. |
| audioBitrate | Field description: specify the target audio bitrate of On-Cloud MixTranscoding<br>Recommended value: default value: 64 Kbps. Value range: [32,192]. |
| audioChannels | Field description: specify the number of sound channels of On-Cloud MixTranscoding<br>Recommended value: default value: 1, which means mono channel. Valid values: 1: mono channel; 2: dual channel. |
| audioCodec | Field description: specify the audio encoding type of On-Cloud MixTranscoding<br>Recommended value: default value: 0, which means LC-AAC. Valid values: 0:  LC-AAC; 1: HE-AAC; 2: HE-AACv2.<br><strong>Note</strong><br>-  HE-AAC and HE-AACv2 only support [48000, 44100, 32000, 24000, 16000]  sample rate.<br>-  HE-AACv2  only support dual channel.<br>-  HE-AAC and HE-AACv2 take effects iff the output streamId is specified. |
| audioSampleRate | Field description: specify the target audio sample rate of On-Cloud MixTranscoding<br>Recommended value: default value: 48000 Hz. Valid values: 12000 Hz, 16000 Hz, 22050 Hz, 24000 Hz, 32000 Hz, 44100 Hz, 48000 Hz. |
| backgroundColor | Field description: specify the background color of the mixed video image.<br>Recommended value: default value: 0x000000, which means black and is in the format of hex number; for example: "0x61B9F1" represents the RGB color (97,158,241). |
| backgroundImage | Field description: specify the background image of the mixed video image.<br>**Recommended value: default value: null, indicating not to set the background image.<br><strong>Note</strong><br>TRTC's backend service will mix the image specified by the URL address into the final stream.URL link length is limited to 512 bytes. The image size is limited to 10MB.Support png, jpg, jpeg, bmp format. |
| bizId | Field description:  <code>bizId</code>  of Tencent Cloud CSS<br>Recommended value: please click  <code>Application Management</code>  >  <code>Application Information</code>  in the <a href="https://console.cloud.tencent.com/trtc">TRTC console</a> and get the  <code>bizId</code>  in  <code>Relayed Live Streaming Info</code> .<br><strong>Note</strong><br>applications created on or after January 9, 2020 do not need to fill in this field. |
| mixUsersArray | Field description: specify the position, size, layer, and stream type of each video image in On-Cloud MixTranscoding<br>Recommended value: this field is an array in  <code>TRTCMixUser</code>  type, where each element represents the information of a video image. |
| mixUsersArraySize | Field description: number of elements in the  <code>mixUsersArray</code>  array |
| mode | Field description: layout mode<br>Recommended value: please choose a value according to your business needs. The preset mode has better applicability. |
| streamId | Field description: ID of the live stream output to CDN<br>Recommended value: default value: null, that is, the audio/video streams in the room will be mixed into the audio/video stream of the caller of this API.<br>-  If you don't set this parameter, the SDK will execute the default logic, that is, it will mix the multiple audio/video streams in the room into the audio/video stream of the caller of this API, i.e., A + B => A.<br>-  If you set this parameter, the SDK will mix the audio/video streams in the room into the live stream you specify, i.e., A + B => C (C is the  <code>streamId</code>  you specify). |
| videoBitrate | Field description: specify the target video bitrate (Kbps) of On-Cloud MixTranscoding<br>Recommended value: if you enter 0, TRTC will estimate a reasonable bitrate value based on <code>videoWidth</code> and <code>videoHeight</code> . You can also . |
| videoFramerate | Field description: specify the target video frame rate (fps) of On-Cloud MixTranscoding<br>Recommended value: default value: 15 fps. Value range: (0,30]. |
| videoGOP | Field description: specify the target video keyframe interval (GOP) of On-Cloud MixTranscoding<br>Recommended value: default value: 2 (in seconds). Value range: [1,8]. |
| videoHeight | Field description: specify the target resolution (height) of On-Cloud MixTranscoding<br>Recommended value: 640 px. If you only mix audio streams, please set both  <code>width</code>  and  <code>height</code>  to 0; otherwise, there will be a black background in the live stream after mixtranscoding. |
| videoSeiParams | Field description: SEI parameters. default value: null<br><strong>Note</strong><br>the parameter is passed in the form of a JSON string. Here is an example to use it:<br>The currently supported fields and their meanings are as follows:<br>-  payloadContent: Required. The payload content of the passthrough SEI, which cannot be empty.<br>-  payloadType: Required. The type of the SEI message, with a value range of 5 or an integer within the range of [100, 254] (excluding 244, which is an internally defined timestamp SEI).<br>-  payloadUuid: Required when payloadType is 5, and ignored in other cases. The value must be a 32-digit hexadecimal number.<br>-  interval: Optional, default is 1000. The sending interval of the SEI, in milliseconds.<br>-  followIdr: Optional, default is false. When this value is true, the SEI will be ensured to be carried when sending a key frame, otherwise it is not guaranteed. |
| videoWidth | Field description: specify the target resolution (width) of On-Cloud MixTranscoding<br>Recommended value: 360 px. If you only mix audio streams, please set both  <code>width</code>  and  <code>height</code>  to 0; otherwise, there will be a black background in the live stream after mixtranscoding. |

## TRTCPublishCDNParam

**Push parameters required to be set when publishing audio/video streams to non-Tencent Cloud CDN.**

TRTC's backend service supports publishing audio/video streams to third-party live CDN service providers through the standard RTMP protocol.

If you use the Tencent Cloud CSS CDN service, you don't need to care about this parameter; instead, just use the startPublish API.
| EnumType | DESC |
| --- | --- |
| appId | Field description:  <code>appId</code>  of Tencent Cloud CSS<br>Recommended value: please click  <code>Application Management</code>  >  <code>Application Information</code>  in the <a href="https://console.cloud.tencent.com/trtc">TRTC console</a> and get the  <code>appId</code>  in  <code>Relayed Live Streaming Info</code> . |
| bizId | Field description:  <code>bizId</code>  of Tencent Cloud CSS<br>Recommended value: please click  <code>Application Management</code>  >  <code>Application Information</code>  in the <a href="https://console.cloud.tencent.com/trtc">TRTC console</a> and get the  <code>bizId</code>  in  <code>Relayed Live Streaming Info</code> . |
| streamId | Field description: specify the push address (in RTMP format) of this audio/video stream at the third-party live streaming service provider<br>Recommended value: default value: null,that is, the audio/video streams in the room will be pushed to the target service provider of the caller of this API. |
| url | Field description: specify the push address (in RTMP format) of this audio/video stream at the third-party live streaming service provider<br>Recommended value: the push URL rules vary greatly by service provider. Please enter a valid push URL according to the requirements of the target service provider. TRTC's backend server will push audio/video streams in the standard format to the third-party service provider according to the URL you enter.<br><strong>Note</strong><br>the push URL must be in RTMP format and meet the specifications of your target live streaming service provider; otherwise, the target service provider will reject the push requests from TRTC's backend service. |

## TRTCAudioRecordingParams

**Local audio file recording parameters.**

This parameter is used to specify the recording parameters in the audio recording API startAudioRecording.
| EnumType | DESC |
| --- | --- |
| filePath | Field description: storage path of the audio recording file, which is required.<br><strong>Note</strong><br>this path must be accurate to the file name and extension. The extension determines the format of the audio recording file. Currently, supported formats include PCM, WAV, and AAC.<br>For example, if you specify the path as  <code>mypath/record/audio.aac</code> , it means that you want the SDK to generate an audio recording file in AAC format.Please specify a valid path with read/write permissions; otherwise, the audio recording file cannot be generated. |
| maxDurationPerFile | Field description:  <code>maxDurationPerFile</code>  is the max duration of each recorded file segments, in milliseconds, with a minimum value of 10000. The default value is 0, indicating no segmentation. |
| recordingContent | Field description: Audio recording content type.<br>Note: Record all local and remote audio by default. |

## TRTCLocalRecordingParams

**Local media file recording parameters.**

This parameter is used to specify the recording parameters in the local media file recording API startLocalRecording.

The startLocalRecording API is an enhanced version of the startAudioRecording API. The former can record video files, while the latter can only record audio files.
| EnumType | DESC |
| --- | --- |
| filePath | Field description: address of the recording file, which is required. Please ensure that the path is valid with read/write permissions; otherwise, the recording file cannot be generated.<br><strong>Note</strong><br>this path must be accurate to the file name and extension. The extension determines the format of the recording file. Currently, only the MP4 format is supported.<br>For example, if you specify the path as  <code>mypath/record/test.mp4</code> , it means that you want the SDK to generate a local video file in MP4 format.<br>Please specify a valid path with read/write permissions; otherwise, the recording file cannot be generated. |
| interval | Field description:  <code>interval</code>  is the update frequency of the recording information in milliseconds. Value range: [1000, 10000]. Default value: -1, indicating not to call back |
| maxDurationPerFile | Field description:  <code>maxDurationPerFile</code>  is the max duration of each recorded file segments, in milliseconds, with a minimum value of 10000. The default value is 0, indicating no segmentation. |
| recordType | Field description: media recording type, which is  <code>TRTCRecordTypeBoth</code>  by default, indicating to record both audio and video. |

## TRTCAudioEffectParam(Deprecated)

**Sound effect parameter (disused).**

"Sound effects" in TRTC .

This parameter is used to specify the path and number of playback times of a sound effect file (short audio file) in the sound effect playback API TRTCCloud#playAudioEffect on legacy versions.

After v7.3, the sound effect API has been replaced by a new TXAudioEffectManager#startPlayMusic API.

When you specify the TXAudioMusicParam parameter of  `startPlayMusic` , if  `isShortFile`  is set to  `true` , the file is a "sound effect" file.
| EnumType | DESC |
| --- | --- |
| effectId | Field description: sound effect ID<br>Note: the SDK supports playing multiple sound effects. IDs are used to distinguish different sound effects and control their start, end, volume, etc. |
| loopCount | Field description: number of times the sound effect is looped<br>Valid values: 0 or any positive integer. 0 (default) indicates that the sound effect is played once, 1 twice, and so on. |
| path | Field description: sound effect file path. Supported file formats include AAC, MP3, and M4A. |
| publish | Field description: whether the sound effect is upstreamed<br>Recommended value: true: when the sound effect is played back locally, it will be upstreamed to the cloud and can be heard by remote users. false: the sound effect will not be upstreamed to the cloud and can only be heard locally. Default value: false |
| volume | Field description: sound effect volume<br>Recommended value: value range: 0–100. Default value: 100 |

## TRTCSwitchRoomConfig

**Room switch parameter.**

This parameter is used for the room switch API switchRoom, which can quickly switch a user from one room to another.
| EnumType | DESC |
| --- | --- |
| privateMapKey | Field description: permission credential used for permission control, which is optional. If you want only users with the specified  <code>userId</code>  values to enter a room, you need to use  <code>privateMapKey</code>  to restrict the permission.<br>Recommended value: we recommend you use this parameter only if you have high security requirements. For more information, please see <a href="https://www.tencentcloud.com/document/product/647/35157">Enabling Advanced Permission Control</a>. |
| roomId | Field description: numeric room ID, which is optional. Users in the same room can see one another and make audio/video calls.<br>Recommended value: value range: 1–4294967294.<br><strong>Note</strong><br>either  <code>roomId</code>  or  <code>strRoomId</code>  must be entered. If both are entered,  <code>roomId</code>  will be used. |
| strRoomId | Field description: string-type room ID, which is optional. Users in the same room can see one another and make audio/video calls.<br><strong>Note</strong><br>either  <code>roomId</code>  or  <code>strRoomId</code>  must be entered. If both are entered,  <code>roomId</code>  will be used. |
| userSig | Field description: user signature, which is optional. It is the authentication signature corresponding to the current  <code>userId</code>  and acts as the login password.<br>If you don't specify the newly calculated  <code>userSig</code>  during room switch, the SDK will continue to use the  <code>userSig</code>  you specified during room entry (enterRoom).<br>This requires you to ensure that the old  <code>userSig</code>  is still within the validity period allowed by the signature at the moment of room switch; otherwise, room switch will fail.<br>Recommended value: for the calculation method, please see <a href="https://www.tencentcloud.com/document/product/647/35166">UserSig</a>. |

## TRTCAudioFrameDelegateFormat

**Format parameter of custom audio callback.**

This parameter is used to set the relevant format (including sample rate and number of channels) of the audio data called back by the SDK in the APIs related to custom audio callback.
| EnumType | DESC |
| --- | --- |
| channel | Field description: number of sound channels<br>Recommended value: default value: 1, which means mono channel. Valid values: 1: mono channel; 2: dual channel. |
| mode | Field description: audio callback data operation mode<br>Recommended value: TRTCAudioFrameOperationModeReadOnly, get audio data from callback only. The modes that can be set are TRTCAudioFrameOperationModeReadOnly, TRTCAudioFrameOperationModeReadWrite. |
| sampleRate | Field description: sample rate<br>Recommended value: default value: 48000 Hz. Valid values: 16000, 32000, 44100, 48000. |
| samplesPerCall | Field description: number of sample points<br>Recommended value: the value must be an integer multiple of  <code>sampleRate/100</code> . |

## TRTCUser

**The users whose streams to publish.**

You can use this parameter together with the publishing destination parameter TRTCPublishTarget and On-Cloud MixTranscoding parameter TRTCStreamMixingConfig to transcode the streams you specify and publish the mixed stream to the destination you specify.
| EnumType | DESC |
| --- | --- |
| intRoomId | <strong>Description:</strong> Numeric room ID. The room ID must be of the same type as that in TRTCParams.<br><strong>Value:</strong> Value range: 1-4294967294<br><strong>Note:</strong> You cannot use both  <code>intRoomId</code>  and  <code>strRoomId</code> . If you specify  <code>strRoomId</code> , you need to set  <code>intRoomId</code>  to  <code>0</code> . If you set both, only  <code>intRoomId</code>  will be used. |
| strRoomId | <strong>Description:</strong> String-type room ID. The room ID must be of the same type as that in TRTCParams.<br><strong>Note:</strong> You cannot use both  <code>intRoomId</code>  and  <code>strRoomId</code> . If you specify  <code>roomId</code> , you need to leave  <code>strRoomId</code>  empty. If you set both, only  <code>intRoomId</code>  will be used.<br><strong>Value:</strong> 64 bytes or shorter; supports the following character set (89 characters):<br>-  Uppercase and lowercase letters (a-z and A-Z)<br>-  Numbers (0-9)<br>-  Space, "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "\\|", "~", "," |
| userId | /<strong>Description</strong>: UTF-8-encoded user ID (required)<br><strong>Value:</strong> For example, if the ID of a user in your account system is "mike", set it to  <code>mike</code> . |

## TRTCPublishCdnUrl

**The destination URL when you publish to Tencent Cloud or a third-party CDN.**

This enum type is used by the publishing destination parameter TRTCPublishTarget of the publishing API startPublishMediaStream.
| EnumType | DESC |
| --- | --- |
| isInternalLine | <strong>Description:</strong> Whether to publish to Tencent Cloud<br><strong>Value:</strong> The default value is  <code>true</code> .<br><strong>Note:</strong> If the destination URL you set is provided by Tencent Cloud, set this parameter to  <code>true</code> , and you will not be charged relaying fees. |
| rtmpUrl | <strong>Description:</strong> The destination URL (RTMP) when you publish to Tencent Cloud or a third-party CDN.<br><strong>Value:</strong> The URLs of different CDN providers may vary greatly in format. Please enter a valid URL as required by your service provider. TRTC's backend server will push audio/video streams in the standard format to the URL you provide.<br><strong>Note:</strong> The URL must be in RTMP format. It must also meet the requirements of your service provider, or your service provider may reject push requests from the TRTC backend. |

## TRTCPublishTarget

**The publishing destination.**

This enum type is used by the publishing API startPublishMediaStream.
| EnumType | DESC |
| --- | --- |
| cdnUrlList | <code>Description:</code>  The destination URLs (RTMP) when you publish to Tencent Cloud or third-party CDNs.<br><code>Note:</code>  You don’t need to set this parameter if you set the publishing mode to TRTCPublishMixStreamToRoom. |
| cdnUrlListSize | <code>Description:</code>  The length of the  <code>cdnUrlList</code>  array.<br><code>Note:</code>  You don’t need to set this parameter if you set the publishing mode to TRTCPublishMixStreamToRoom. |
| mixStreamIdentity | <code>Description:</code>  The information of the robot that publishes the transcoded stream to a TRTC room.<br><code>Note:</code>  You need to set this parameter only if you set the publishing mode to TRTCPublishMixStreamToRoom`.<br><code>Note:</code>  After you set this parameter, the stream will be pushed to the room you specify. We recommend you set it to a special user ID to distinguish the robot from the anchor who enters the room via the TRTC SDK.<br><code>Note:</code>  Users whose streams are transcoded cannot subscribe to the transcoded stream.<br><code>Note:</code>  If you set the subscription mode (setDefaultStreamRecvMode) to manual before room entry, you need to manage the streams to receive by yourself (normally, if you receive the transcoded stream, you need to unsubscribe from the streams that are transcoded).<br><code>Note:</code>  If you set the subscription mode (setDefaultStreamRecvMode) to auto before room entry, users whose streams are not transcoded will receive the transcoded stream automatically and will unsubscribe from the users whose streams are transcoded. You call muteRemoteVideoStream and muteRemoteAudio to unsubscribe from the transcoded stream. |
| mode | <code>Description:</code>  The publishing mode.<br><code>Value:</code>  You can relay streams to a CDN, transcode streams, or publish streams to an RTC room. Select the mode that fits your needs.<br><strong>Note</strong><br>If you need to use more than one publishing mode, you can call startPublishMediaStream multiple times and set  <code>TRTCPublishTarget</code>  to a different value each time.You can use one mode each time you call the startPublishMediaStream) API. To modify the configuration, call updatePublishCDNStream. |

## TRTCVideoLayout

**The video layout of the transcoded stream.**

This enum type is used by the On-Cloud MixTranscoding parameter TRTCStreamMixingConfig of the publishing API startPublishMediaStream.

You can use this parameter to specify the position, size, layer, and stream type of each video in the transcoded stream.
| EnumType | DESC |
| --- | --- |
| backgroundColor | <code>Description:</code>  The background color of the mixed stream.<br><code>Value:</code>  The value must be a hex number. For example, "0x61B9F1" represents the RGB color value (97,158,241). Default value: 0x000000 (black). |
| fillMode | <code>Description:</code>  The rendering mode.<br><code>Value:</code>  The rendering mode may be fill (the image may be stretched or cropped) or fit (there may be black bars). Default value: TRTCVideoFillMode_Fill. |
| fixedVideoStreamType | <code>Description:</code>  Whether the video is the primary stream (TRTCVideoStreamTypeBig) or substream (TRTCVideoStreamTypeSub). |
| fixedVideoUser | <code>Description:</code>  The users whose streams are transcoded.<br><strong>Note</strong><br>If you do not specify TRTCUser ( <code>userId</code> ,  <code>intRoomId</code> ,  <code>strRoomId</code> ), the TRTC backend will automatically mix the streams of anchors who are sending audio/video in the room according to the video layout you specify. |
| placeHolderImage | <code>Description:</code>  The URL of the placeholder image. If a user sends only audio, the image specified by the URL will be mixed during On-Cloud MixTranscoding.<br><code>Value:</code>  This parameter is left empty by default, which means no placeholder image will be used.<br><strong>Note</strong><br>-  You need to specify the  <code>userId</code>  parameter in  <code>fixedVideoUser</code> .<br>-  The URL can be 512 bytes long at most, and the image must not exceed 2 MB.<br>-  The image can be in PNG, JPG, JPEG, or BMP format. We recommend you use a semitransparent image in PNG format. |
| rect | <code>Description:</code>  The coordinates (in pixels) of the video. |
| zOrder | <code>Description:</code>  The layer of the video, which must be unique. Value range: 0-15. |

## TRTCWatermark

**The watermark layout.**

This enum type is used by the On-Cloud MixTranscoding parameter TRTCStreamMixingConfig of the publishing API startPublishMediaStream.
| EnumType | DESC |
| --- | --- |
| rect | <code>Description:</code>  The coordinates (in pixels) of the watermark. |
| watermarkUrl | <code>Description:</code>  The URL of the watermark image. The image specified by the URL will be mixed during On-Cloud MixTranscoding.<br><strong>Note</strong><br>-  The URL can be 512 bytes long at most, and the image must not exceed 2 MB.<br>-  The image can be in PNG, JPG, JPEG, or BMP format. We recommend you use a semitransparent image in PNG format. |
| zOrder | <code>Description:</code>  The layer of the watermark, which must be unique. Value range: 0-15. |

## TRTCStreamEncoderParam

**The encoding parameters.**

 `Description:`  This enum type is used by the publishing API startPublishMediaStream.

 `Note:`  This parameter is required if you set the publishing mode to  `TRTCPublish_MixStream_ToCdn`  or  `TRTCPublish_MixStream_ToRoom`  in TRTCPublishTarget.

 `Note:`  If you use the relay to CDN feature (the publishing mode set to  `RTCPublish_BigStream_ToCdn`  or  `TRTCPublish_SubStream_ToCdn` ), to improve the relaying stability and playback compatibility, we also recommend you set this parameter.
| EnumType | DESC |
| --- | --- |
| audioEncodedChannelNum | <code>Description:</code>  The sound channels of the stream to publish.<br><code>Value:</code>  Valid values: 1 (mono channel); 2 (dual-channel). Default: 1. |
| audioEncodedCodecType | <code>Description:</code>  The audio codec of the stream to publish.<br><code>Value:</code>  Valid values: 0 (LC-AAC); 1 (HE-AAC); 2 (HE-AACv2). Default: 0.<br><strong>Note</strong><br>-  The audio sample rates supported by HE-AAC and HE-AACv2 are 48000, 44100, 32000, 24000, and 16000.<br>-  When HE-AACv2 is used, the output stream can only be dual-channel. |
| audioEncodedKbps | <code>Description:</code>  The audio bitrate (Kbps) of the stream to publish.<br><code>Value:</code>  Value range: [32,192]. Default: 50. |
| audioEncodedSampleRate | <code>Description:</code>  The audio sample rate of the stream to publish.<br><code>Value:</code>  Valid values: [48000, 44100, 32000, 24000, 16000, 8000]. Default: 48000 (Hz). |
| videoEncodedCodecType | <code>Description:</code>  The video codec of the stream to publish.<br><code>Value:</code>  Valid values: 0 (H264); 1 (H265). Default: 0. |
| videoEncodedFPS | <code>Description:</code>  The frame rate (fps) of the stream to publish.<br><code>Value:</code>  Value range: (0,30]. Default: 20. |
| videoEncodedGOP | <code>Description:</code>  The keyframe interval (GOP) of the stream to publish.<br><code>Value:</code>  Value range: [1,5]. Default: 3 (seconds). |
| videoEncodedHeight | <code>Description:</code>  The resolution (height) of the stream to publish.<br><code>Value:</code>  Recommended value: 640. If you mix only audio streams, to avoid displaying a black video in the transcoded stream, set both  <code>width</code>  and  <code>height</code>  to  <code>0</code> . |
| videoEncodedKbps | <code>Description:</code> The video bitrate (Kbps) of the stream to publish.<br><code>Value:</code> If you set this parameter to <code>0</code> , TRTC will work out a bitrate based on <code>videoWidth</code> and <code>videoHeight</code> . . |
| videoEncodedWidth | <code>Description:</code>  The resolution (width) of the stream to publish.<br><code>Value:</code>  Recommended value: 368. If you mix only audio streams, to avoid displaying a black video in the transcoded stream, set both  <code>width</code>  and  <code>height</code>  to  <code>0</code> . |
| videoSeiParams | <code>Description:</code>  SEI parameters. Default: null<br><code>Note:</code>  the parameter is passed in the form of a JSON string. Here is an example to use it:<br>`{`<br>`  "payLoadContent":"xxx",`<br>`  "payloadType":5,`<br>`  "payloadUuid":"1234567890abcdef1234567890abcdef",`<br>`  "interval":1000,`<br>`  "followIdr":false`<br>`}`<br>The currently supported fields and their meanings are as follows:<br>-  payloadContent: Required. The payload content of the passthrough SEI, which cannot be empty.<br>-  payloadType: Required. The type of the SEI message, with a value range of 5 or an integer within the range of [100, 254] (excluding 244, which is an internally defined timestamp SEI).<br>-  payloadUuid: Required when payloadType is 5, and ignored in other cases. The value must be a 32-digit hexadecimal number.<br>-  interval: Optional, default is 1000. The sending interval of the SEI, in milliseconds.<br>-  followIdr: Optional, default is false. When this value is true, the SEI will be ensured to be carried when sending a key frame, otherwise it is not guaranteed. |

## TRTCStreamMixingConfig

**The transcoding parameters.**

This enum type is used by the publishing API startPublishMediaStream.

You can use this parameter to specify the video layout and input audio information for On-Cloud MixTranscoding.
| EnumType | DESC |
| --- | --- |
| audioMixUserList | <code>Description:</code>  The information of each audio stream to mix.<br><code>Value:</code>  This parameter is an array. Each  <code>TRTCUser</code>  element in the array indicates the information of an audio stream.<br><strong>Note</strong><br>If you do not specify this array, the TRTC backend will automatically mix all streams of the anchors who are sending audio in the room according to the audio encode param TRTCStreamEncoderParam you specify (currently only supports up to 16 audio and video inputs). |
| audioMixUserListSize | <strong>Description:</strong> The length of the  <code>audioMixUserList</code>  array. |
| backgroundColor | <code>Description:</code>  The background color of the mixed stream.<br><code>Value:</code>  The value must be a hex number. For example, "0x61B9F1" represents the RGB color value (97,158,241). Default value: 0x000000 (black). |
| backgroundImage | <code>Description:</code>  The URL of the background image of the mixed stream. The image specified by the URL will be mixed during On-Cloud MixTranscoding.<br><code>Value:</code>  This parameter is left empty by default, which means no background image will be used.<br><strong>Note</strong><br>-  The URL can be 512 bytes long at most, and the image must not exceed 2 MB.<br>-  The image can be in PNG, JPG, JPEG, or BMP format. We recommend you use a semitransparent image in PNG format. |
| videoLayoutList | <code>Description:</code>  The position, size, layer, and stream type of each video in On-Cloud MixTranscoding.<br><code>Value:</code>  This parameter is an array. Each  <code>TRTCVideoLayout</code>  element in the array indicates the information of a video in On-Cloud MixTranscoding. |
| videoLayoutListSize | <strong>Description:</strong> The length of the  <code>videoLayoutList</code>  array. |
| watermarkList | <code>Description:</code>  The position, size, and layer of each watermark image in On-Cloud MixTranscoding.<br><code>Value:</code>  This parameter is an array. Each  <code>TRTCWatermark</code>  element in the array indicates the information of a watermark. |
| watermarkListSize | <code>Description:</code>  The length of the  <code>watermarkList</code>  array. |

## TRTCPayloadPrivateEncryptionConfig

**Media Stream Private Encryption Configuration.**

This configuration is used to set the algorithm and key for media stream private encryption.
| EnumType | DESC |
| --- | --- |
| encryptionAlgorithm | <code>Description:</code>  Encryption algorithm, the default is TRTCEncryptionAlgorithmAes128Gcm. |
| encryptionKey | <code>Description:</code>  encryption key, string type.<br><code>Value:</code>  If the encryption algorithm is TRTCEncryptionAlgorithmAes128Gcm, the key length must be 16 bytes;<br>if the encryption algorithm is TRTCEncryptionAlgorithmAes256Gcm, the key length must be 32 bytes. |
| encryptionSalt[32] | <code>Description:</code>  Salt, initialization vector for encryption.<br><code>Value:</code>  It is necessary to ensure that the array filled in this parameter is not empty, not all 0 and the data length is 32 bytes. |

## TRTCAudioVolumeEvaluateParams

**Volume evaluation and other related parameter settings.**

This setting is used to enable vocal detection and sound spectrum calculation.
| EnumType | DESC |
| --- | --- |
| enablePitchCalculation | <code>Description:</code>  Whether to enable local vocal frequency calculation. |
| enableSpectrumCalculation | <code>Description:</code>  Whether to enable sound spectrum calculation. |
| enableVadDetection | <code>Description:</code>  Whether to enable local voice detection.<br><strong>Note</strong><br>Call before startLocalAudio. |
| interval | <code>Description:</code>  Set the trigger interval of the onUserVoiceVolume callback, the unit is milliseconds, the minimum interval is 100ms, if it is less than or equal to 0, the callback will be closed.<br><code>Value:</code>  Recommended value: 300, in milliseconds.<br><strong>Note</strong><br>When the interval is greater than 0, the volume prompt will be enabled by default, no additional setting is required. |

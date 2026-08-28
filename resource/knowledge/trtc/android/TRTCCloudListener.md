Copyright (c) 2021 Tencent. All rights reserved.

Module:   TRTCCloudListener @ TXLiteAVSDK

Function: event callback APIs for TRTC’s video call feature

## TRTCVideoRenderListener

|FuncList|DESC|
|---------|---------|
|onRenderVideoFrame|Custom video rendering.|

## TRTCVideoFrameListener

|FuncList|DESC|
|---------|---------|
|onGLContextCreated|An OpenGL context was created in the SDK.|
|onProcessVideoFrame|Video processing by third-party beauty filters.|
|onGLContextDestory|The OpenGL context in the SDK was destroyed.|

## TRTCAudioFrameListener

|FuncList|DESC|
|---------|---------|
|onCapturedAudioFrame|Audio data captured by the local mic and pre-processed by the audio module.|
|onLocalProcessedAudioFrame|Audio data captured by the local mic, pre-processed by the audio module, effect-processed and BGM-mixed.|
|onRemoteUserAudioFrame|Audio data of each remote user before audio mixing.|
|onMixedPlayAudioFrame|Data mixed from each channel before being submitted to the system for playback.|
|onMixedAllAudioFrame|Data mixed from all the captured and to-be-played audio in the SDK.|
|onVoiceEarMonitorAudioFrame|In-ear monitoring data.|

## TRTCLogListener

|FuncList|DESC|
|---------|---------|
|onLog|Printing of local log.|

## TRTCCloudListener

|FuncList|DESC|
|---------|---------|
|onError|Error event callback.|
|onWarning|Warning event callback.|
|onEnterRoom|Whether room entry is successful.|
|onExitRoom|Room exit.|
|onSwitchRole|Role switching.|
|onSwitchRoom|Result of room switching.|
|onConnectOtherRoom|Result of requesting cross-room call.|
|onDisConnectOtherRoom|Result of ending cross-room call.|
|onUpdateOtherRoomForwardMode|Result of changing the upstream capability of the cross-room anchor.|
|onRemoteUserEnterRoom|A user entered the room.|
|onRemoteUserLeaveRoom|A user exited the room.|
|onUserVideoAvailable|A remote user published/unpublished primary stream video.|
|onUserSubStreamAvailable|A remote user published/unpublished substream video.|
|onUserAudioAvailable|A remote user published/unpublished audio.|
|onFirstVideoFrame|The SDK started rendering the first video frame of the local or a remote user.|
|onFirstAudioFrame|The SDK started playing the first audio frame of a remote user.|
|onSendFirstLocalVideoFrame|The first local video frame was published.|
|onSendFirstLocalAudioFrame|The first local audio frame was published.|
|onRemoteVideoStatusUpdated|Change of remote video status.|
|onRemoteAudioStatusUpdated|Change of remote audio status.|
|onUserVideoSizeChanged|Change of remote video size.|
|onNetworkQuality|Real-time network quality statistics.|
|onStatistics|Real-time statistics on technical metrics.|
|onSpeedTestResult|Callback of network speed test.|
|onConnectionLost|The SDK was disconnected from the cloud.|
|onTryToReconnect|The SDK is reconnecting to the cloud.|
|onConnectionRecovery|The SDK is reconnected to the cloud.|
|onCameraDidReady|The camera is ready.|
|onMicDidReady|The mic is ready.|
|onAudioRouteChanged|The audio route changed (for mobile devices only).|
|onUserVoiceVolume|Volume.|
|onRecvCustomCmdMsg|Receipt of custom message.|
|onMissCustomCmdMsg|Loss of custom message.|
|onRecvSEIMsg|Receipt of SEI message.|
|onStartPublishing|Started publishing to Tencent Cloud CSS CDN.|
|onStopPublishing|Stopped publishing to Tencent Cloud CSS CDN.|
|onStartPublishCDNStream|Started publishing to non-Tencent Cloud’s live streaming CDN.|
|onStopPublishCDNStream|Stopped publishing to non-Tencent Cloud’s live streaming CDN.|
|onSetMixTranscodingConfig|Set the layout and transcoding parameters for On-Cloud MixTranscoding.|
|onStartPublishMediaStream|Callback for starting to publish.|
|onUpdatePublishMediaStream|Callback for modifying publishing parameters.|
|onStopPublishMediaStream|Callback for stopping publishing.|
|onCdnStreamStateChanged|Callback for change of RTMP/RTMPS publishing status.|
|onScreenCaptureStarted|Screen sharing started.|
|onScreenCapturePaused|Screen sharing was paused.|
|onScreenCaptureResumed|Screen sharing was resumed.|
|onScreenCaptureStopped|Screen sharing stopped.|
|onLocalRecordBegin|Local recording started.|
|onLocalRecording|Local media is being recorded.|
|onLocalRecordFragment|Record fragment finished.|
|onLocalRecordComplete|Local recording stopped.|
|onSnapshotComplete|Finished taking a local screenshot.|
|onExperimentalEvent|Callback of experimental APIs.|
|onUserEnter|An anchor entered the room (disused).|
|onUserExit|An anchor left the room (disused).|
|onAudioEffectFinished|Audio effects ended (disused).|
|onSpeedTest|Result of server speed testing (disused).|

## onRenderVideoFrame

**Custom video rendering.**

If you have configured the callback of custom rendering for local or remote video, the SDK will return to you via this callback video frames that are otherwise sent to the rendering control, so that you can customize rendering.

|Param|DESC|
|---------|---------|
|frame|Video frames to be rendered|
|streamType|Stream type. The primary stream ( `Main` ) is usually used for camera images, and the substream ( `Sub` ) for screen sharing images.|
|userId| `userId`  of the video source. This parameter can be ignored if the callback is for local video (setLocalVideoRenderDelegate).|

## onGLContextCreated

**An OpenGL context was created in the SDK.**

## onProcessVideoFrame

**Video processing by third-party beauty filters.**

If you use a third-party beauty filter component, you need to configure this callback in  `TRTCCloud`  to have the SDK return to you video frames that are otherwise pre-processed by TRTC.

You can then send the video frames to the third-party beauty filter component for processing. As the data returned can be read and modified, the result of processing can be synced to TRTC for subsequent encoding and publishing.

Case 1: the beauty filter component generates new textures

If the beauty filter component you use generates a frame of new texture (for the processed image) during image processing, please set  `dstFrame.textureId`  to the ID of the new texture in the callback function.
``` java
private final TRTCVideoFrameListener mVideoFrameListener = new TRTCVideoFrameListener() {
    @Override
    public void onGLContextCreated() {
        mFURenderer.onSurfaceCreated();
        mFURenderer.setUseTexAsync(true);
    }
    @Override
    public int onProcessVideoFrame(TRTCVideoFrame srcFrame, TRTCVideoFrame dstFrame) {
        dstFrame.texture.textureId = mFURenderer.onDrawFrameSingleInput(srcFrame.texture.textureId, srcFrame.width, srcFrame.height);
        return 0;
    }
    @Override
    public void onGLContextDestory() {
        mFURenderer.onSurfaceDestroyed();
    }
};
```

Case 2: you need to provide target textures to the beauty filter component

If the third-party beauty filter component you use does not generate new textures and you need to manually set an input texture and an output texture for the component, you can consider the following scheme:
``` java
int onProcessVideoFrame(TRTCCloudDef.TRTCVideoFrame srcFrame, TRTCCloudDef.TRTCVideoFrame dstFrame) {
    thirdparty_process(srcFrame.texture.textureId, srcFrame.width, srcFrame.height, dstFrame.texture.textureId);
    return 0;
}
```

|Param|DESC|
|---------|---------|
|dstFrame|Used to receive video images processed by third-party beauty filters|
|srcFrame|Used to carry images captured by TRTC via the camera|

> **Note**
> Currently, only the OpenGL texture scheme is supported(PC supports TRTCVideoBufferType_Buffer format Only)
>

## onGLContextDestory

**The OpenGL context in the SDK was destroyed.**

## onCapturedAudioFrame

**Audio data captured by the local mic and pre-processed by the audio module.**

After you configure the callback of custom audio processing, the SDK will return via this callback the data captured and pre-processed (ANS, AEC, and AGC) in PCM format.
-  The audio returned is in PCM format and has a fixed frame length (time) of 0.02s.

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The frame length in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|

> **Note**
> 1. Please avoid time-consuming operations in this callback function. The SDK processes an audio frame every 20 ms, so if your operation takes more than 20 ms, it will cause audio exceptions.
>
> 2. The audio data returned via this callback can be read and modified, but please keep the duration of your operation short.
>
> 3. The audio data is returned via this callback after ANS, AEC and AGC, but it **does not include** pre-processing effects like background music, audio effects, or reverb, and therefore has a short delay.
>

## onLocalProcessedAudioFrame

**Audio data captured by the local mic, pre-processed by the audio module, effect-processed and BGM-mixed.**

After you configure the callback of custom audio processing, the SDK will return via this callback the data captured, pre-processed (ANS, AEC, and AGC), effect-processed and BGM-mixed in PCM format, before it is submitted to the network module for encoding.
-  The audio data returned via this callback is in PCM format and has a fixed frame length (time) of 0.02s.

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The frame length in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

Instructions:

You could write data to the  `TRTCAudioFrame.extraData`  filed, in order to achieve the purpose of transmitting signaling.

Because the data block of the audio frame header cannot be too large, we recommend you limit the size of the signaling data to only a few bytes when using this API. If extra data more than 100 bytes, it won't be sent.

Other users in the room can receive the message through the  `TRTCAudioFrame.extraData`  in  `onRemoteUserAudioFrame`  callback in TRTCAudioFrameDelegate.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|

> **Note**
> 1. Please avoid time-consuming operations in this callback function. The SDK processes an audio frame every 20 ms, so if your operation takes more than 20 ms, it will cause audio exceptions.
>
> 2. The audio data returned via this callback can be read and modified, but please keep the duration of your operation short.
>
> 3. Audio data is returned via this callback after ANS, AEC, AGC, effect-processing and BGM-mixing, and therefore the delay is longer than that with onCapturedAudioFrame.
>

## onRemoteUserAudioFrame

**Audio data of each remote user before audio mixing.**

After you configure the callback of custom audio processing, the SDK will return via this callback the raw audio data (PCM format) of each remote user before mixing.
-  The audio data returned via this callback is in PCM format and has a fixed frame length (time) of 0.02s.

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The frame length in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|
|userId|User ID|

> **Note**
> The audio data returned via this callback can be read but not modified.
>

## onMixedPlayAudioFrame

**Data mixed from each channel before being submitted to the system for playback.**

After you configure the callback of custom audio processing, the SDK will return to you via this callback the data (PCM format) mixed from each channel before it is submitted to the system for playback.
-  The audio data returned via this callback is in PCM format and has a fixed frame length (time) of 0.02s.

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The frame length in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|

> **Note**
> 1. Please avoid time-consuming operations in this callback function. The SDK processes an audio frame every 20 ms, so if your operation takes more than 20 ms, it will cause audio exceptions.
>
> 2. The audio data returned via this callback can be read and modified, but please keep the duration of your operation short.
>
> 3. The audio data returned via this callback is the audio data mixed from each channel before it is played. It does not include the in-ear monitoring data.
>

## onMixedAllAudioFrame

**Data mixed from all the captured and to-be-played audio in the SDK.**

After you configure the callback of custom audio processing, the SDK will return via this callback the data (PCM format) mixed from all captured and to-be-played audio in the SDK, so that you can customize recording.
-  The audio data returned via this callback is in PCM format and has a fixed frame length (time) of 0.02s.

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The frame length in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|

> **Note**
> 1. This data returned via this callback is mixed from all audio in the SDK, including local audio after pre-processing (ANS, AEC, and AGC), special effects application, and music mixing, as well as all remote audio, but it does not include the in-ear monitoring data.
>
> 2. The audio data returned via this callback cannot be modified.
>

## onVoiceEarMonitorAudioFrame

**In-ear monitoring data.**

After you configure the callback of custom audio processing, the SDK will return to you via this callback the in-ear monitoring data (PCM format) before it is submitted to the system for playback.
-  The audio returned is in PCM format and has a not-fixed frame length (time).

-  The formula to convert a frame length in seconds to one in bytes is **sample rate * frame length in seconds * number of sound channels * audio bit depth**.

-  Assume that the audio is recorded on a single channel with a sample rate of 48,000 Hz and audio bit depth of 16 bits, which are the default settings of TRTC. The length of 0.02s frame in bytes will be **48000 * 0.02s * 1 * 16 bits = 15360 bits = 1920 bytes**.

|Param|DESC|
|---------|---------|
|frame|Audio frames in PCM format|

> **Note**
> 1. Please avoid time-consuming operations in this callback function, or it will cause audio exceptions.
>
> 2. The audio data returned via this callback can be read and modified, but please keep the duration of your operation short.
>

## onLog

**Printing of local log.**

If you want to capture the local log printing event, you can configure the log callback to have the SDK return to you via this callback all logs that are to be printed.

|Param|DESC|
|---------|---------|
|level|Log level. For more information, please see TRTC_LOG_LEVEL.|
|log|Log content|
|module|Reserved field, which is not defined at the moment and has a fixed value of  `TXLiteAVSDK` .|

## onError

**Error event callback.**

Error event, which indicates that the SDK threw an irrecoverable error such as room entry failure or failure to start device

For more information, see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).

|Param|DESC|
|---------|---------|
|errCode|Error code|
|errMsg|Error message|
|extInfo|Extended field. Certain error codes may carry extra information for troubleshooting.|

## onWarning

**Warning event callback.**

Warning event, which indicates that the SDK threw an error requiring attention, such as video lag or high CPU usage

For more information, see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).

|Param|DESC|
|---------|---------|
|extInfo|Extended field. Certain warning codes may carry extra information for troubleshooting.|
|warningCode|Warning code|
|warningMsg|Warning message|

## onEnterRoom

**Whether room entry is successful.**

After calling the enterRoom API in  `TRTCCloud`  to enter a room, you will receive the  `onEnterRoom(result)`  callback from  `TRTCCloudDelegate` .
-  If room entry succeeded,  `result`  will be a positive number ( `result`  > 0), indicating the time in milliseconds (ms) the room entry takes.

-  If room entry failed,  `result`  will be a negative number (result < 0), indicating the error code for the failure.

For more information on the error codes for room entry failure, see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).

|Param|DESC|
|---------|---------|
|result|If  `result`  is greater than 0, it indicates the time (in ms) the room entry takes; if  `result`  is less than 0, it represents the error code for room entry.|

> **Note**
> 1. In TRTC versions below 6.6, the  `onEnterRoom(result)`  callback is returned only if room entry succeeds, and the onError callback is returned if room entry fails.
>
> 2. In TRTC 6.6 and above, the  `onEnterRoom(result)`  callback is returned regardless of whether room entry succeeds or fails, and the onError callback is also returned if room entry fails.
>

## onExitRoom

**Room exit.**

Calling the exitRoom API in  `TRTCCloud`  will trigger the execution of room exit-related logic, such as releasing resources of audio/video devices and codecs.

After all resources occupied by the SDK are released, the SDK will return the  `onExitRoom()`  callback.

If you need to call enterRoom again or switch to another audio/video SDK, please wait until you receive the  `onExitRoom()`  callback.

Otherwise, you may encounter problems such as the camera or mic being occupied.

|Param|DESC|
|---------|---------|
|reason|Reason for room exit.  `0` : the user called  `exitRoom`  to exit the room;  `1` : the user was removed from the room by the server;  `2` : the room was dismissed;  `3` : the server status was abnormal.|

## onSwitchRole

**Role switching.**

You can call the switchRole API in  `TRTCCloud`  to switch between the anchor and audience roles. This is accompanied by a line switching process.

After the switching, the SDK will return the  `onSwitchRole()`  event callback.

|Param|DESC|
|---------|---------|
|errCode|Error code.  `ERR_NULL`  indicates a successful switch. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onSwitchRoom

**Result of room switching.**

You can call the switchRoom API in  `TRTCCloud`  to switch from one room to another.

After the switching, the SDK will return the  `onSwitchRoom()`  event callback.

|Param|DESC|
|---------|---------|
|errCode|Error code.  `ERR_NULL`  indicates a successful switch. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35124).|
|errMsg|Error message|

## onConnectOtherRoom

**Result of requesting cross-room call.**

You can call the connectOtherRoom API in  `TRTCCloud`  to establish a video call with the anchor of another room. This is the “anchor competition” feature.

The caller will receive the  `onConnectOtherRoom()`  callback, which can be used to determine whether the cross-room call is successful.

|Param|DESC|
|---------|---------|
|errCode|Error code.  `ERR_NULL`  indicates that cross-room connection is established successfully. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|
|userId|The user ID of the anchor (in another room) to be called|

## onDisConnectOtherRoom

**Result of ending cross-room call.**

You can call the disConnectOtherRoom API in  `TRTCCloud`  to end a video call with the anchor of another room. This is the “anchor competition” feature.

The caller will receive the  `onDisconnectOtherRoom()`  callback to determine whether the cross-room call has been successfully disconnected.

|Param|DESC|
|---------|---------|
|errCode|Error code.  `ERR_NULL`  indicates that the cross-room call has been successfully disconnected. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onUpdateOtherRoomForwardMode

**Result of changing the upstream capability of the cross-room anchor.**

You can call the updateOtherRoomForwardMode API in  `TRTCCloud`  to limit the upstream capability of the cross-room anchor in the current room, and prohibit or allow the cross-room anchor to publish audio/video/sub-stream. This behavior will affect all users in the room.

The caller will receive the  `onUpdateOtherRoomForwardMode()`  callback to determine whether the changing upstream capability of the cross-room anchor is successful.

|Param|DESC|
|---------|---------|
|errCode|Error code.  `ERR_NULL`  indicates that upstream capability of the cross-room anchor is changed successfully. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onRemoteUserEnterRoom

**A user entered the room.**

Due to performance concerns, this callback works differently in different scenarios (i.e.,  `AppScene` , which you can specify by setting the second parameter when calling enterRoom).
-  Live streaming scenarios (TRTC_APP_SCENE_LIVE or TRTC_APP_SCENE_VOICE_CHATROOM): in live streaming scenarios, a user is either in the role of an anchor or audience. The callback is returned only when an anchor enters the room.

-  Call scenarios (TRTC_APP_SCENE_VIDEOCALL or TRTC_APP_SCENE_AUDIOCALL): in call scenarios, the concept of roles does not apply (all users can be considered as anchors), and the callback is returned when any user enters the room.

|Param|DESC|
|---------|---------|
|userId|User ID of the remote user|

> **Note**
> 1. The  `onRemoteUserEnterRoom`  callback indicates that a user entered the room, but it does not necessarily mean that the user enabled audio or video.
>
> 2. If you want to know whether a user enabled video, we recommend you use the onUserVideoAvailable callback.
>

## onRemoteUserLeaveRoom

**A user exited the room.**

As with onRemoteUserEnterRoom, this callback works differently in different scenarios (i.e.,  `AppScene` , which you can specify by setting the second parameter when calling enterRoom).
-  Live streaming scenarios (TRTC_APP_SCENE_LIVE or TRTC_APP_SCENE_VOICE_CHATROOM): the callback is triggered only when an anchor exits the room.

-  Call scenarios (TRTC_APP_SCENE_VIDEOCALL or TRTC_APP_SCENE_AUDIOCALL): in call scenarios, the concept of roles does not apply, and the callback is returned when any user exits the room.

|Param|DESC|
|---------|---------|
|reason|Reason for room exit.  `0` : the user exited the room voluntarily;  `1` : the user exited the room due to timeout;  `2` : the user was removed from the room;  `3` : the anchor user exited the room due to switch to audience.|
|userId|User ID of the remote user|

## onUserVideoAvailable

**A remote user published/unpublished primary stream video.**

The primary stream is usually used for camera images. If you receive the  `onUserVideoAvailable(userId, true)`  callback, it indicates that the user has available primary stream video.

You can then call startRemoteView to subscribe to the remote user’s video. If the subscription is successful, you will receive the  `onFirstVideoFrame(userid)`  callback, which indicates that the first video frame of the user is rendered.

If you receive the  `onUserVideoAvailable(userId, false)`  callback, it indicates that the video of the remote user is disabled, which may be because the user called muteLocalVideo or stopLocalPreview.

|Param|DESC|
|---------|---------|
|available|Whether the user published (or unpublished) primary stream video.  `true` : published;  `false` : unpublished|
|userId|User ID of the remote user|

## onUserSubStreamAvailable

**A remote user published/unpublished substream video.**

The substream is usually used for screen sharing images. If you receive the  `onUserSubStreamAvailable(userId, true)`  callback, it indicates that the user has available substream video.

You can then call startRemoteView to subscribe to the remote user’s video. If the subscription is successful, you will receive the  `onFirstVideoFrame(userid)`  callback, which indicates that the first frame of the user is rendered.

|Param|DESC|
|---------|---------|
|available|Whether the user published (or unpublished) substream video.  `true` : published;  `false` : unpublished|
|userId|User ID of the remote user|

> **Note**
> The API used to display substream images is startRemoteView, not startRemoteSubStreamView, startRemoteSubStreamView is deprecated.
>

## onUserAudioAvailable

**A remote user published/unpublished audio.**

If you receive the  `onUserAudioAvailable(userId, true)`  callback, it indicates that the user published audio.
-  In auto-subscription mode, the SDK will play the user’s audio automatically.

-  In manual subscription mode, you can call muteRemoteAudio(userid, false) to play the user’s audio.

|Param|DESC|
|---------|---------|
|available|Whether the user published (or unpublished) audio.  `true` : published;  `false` : unpublished|
|userId|User ID of the remote user|

> **Note**
> The auto-subscription mode is used by default. You can switch to the manual subscription mode by calling setDefaultStreamRecvMode, but it must be called before room entry for the switch to take effect.
>

## onFirstVideoFrame

**The SDK started rendering the first video frame of the local or a remote user.**

The SDK returns this event callback when it starts rendering your first video frame or that of a remote user. The  `userId`  in the callback can help you determine whether the frame is yours or a remote user’s.
-  If  `userId`  is empty, it indicates that the SDK has started rendering your first video frame. The precondition is that you have called startLocalPreview or startScreenCapture.

-  If  `userId`  is not empty, it indicates that the SDK has started rendering the first video frame of a remote user. The precondition is that you have called startRemoteView to subscribe to the user’s video.

|Param|DESC|
|---------|---------|
|height|Video height|
|streamType|Video stream type. The primary stream ( `Main` ) is usually used for camera images, and the substream ( `Sub` ) for screen sharing images.|
|userId|The user ID of the local or a remote user. If it is empty, it indicates that the first local video frame is available; if it is not empty, it indicates that the first video frame of a remote user is available.|
|width|Video width|

> **Note**
> 1. The callback of the first local video frame being rendered is triggered only after you call startLocalPreview or startScreenCapture.
>
> 2. The callback of the first video frame of a remote user being rendered is triggered only after you call startRemoteView or startRemoteSubStreamView.
>

## onFirstAudioFrame

**The SDK started playing the first audio frame of a remote user.**

The SDK returns this callback when it plays the first audio frame of a remote user. The callback is not returned for the playing of the first audio frame of the local user.

|Param|DESC|
|---------|---------|
|userId|User ID of the remote user|

## onSendFirstLocalVideoFrame

**The first local video frame was published.**

After you enter a room and call startLocalPreview or startScreenCapture to enable local video capturing (whichever happens first),

the SDK will start video encoding and publish the local video data via its network module to the cloud.

It returns the  `onSendFirstLocalVideoFrame`  callback after publishing the first local video frame.

|Param|DESC|
|---------|---------|
|streamType|Video stream type. The primary stream ( `Main` ) is usually used for camera images, and the substream ( `Sub` ) for screen sharing images.|

## onSendFirstLocalAudioFrame

**The first local audio frame was published.**

After you enter a room and call startLocalAudio to enable audio capturing (whichever happens first),

the SDK will start audio encoding and publish the local audio data via its network module to the cloud.

The SDK returns the  `onSendFirstLocalAudioFrame`  callback after sending the first local audio frame.

## onRemoteVideoStatusUpdated

**Change of remote video status.**

You can use this callback to get the status ( `Playing` ,  `Loading` , or  `Stopped` ) of the video of each remote user and display it on the UI.

|Param|DESC|
|---------|---------|
|extraInfo|Extra information|
|reason|Reason for the change of status|
|status|Video status, which may be  `Playing` ,  `Loading` , or  `Stopped` |
|streamType|Video stream type. The primary stream ( `Main` ) is usually used for camera images, and the substream ( `Sub` ) for screen sharing images.|
|userId|User ID|

## onRemoteAudioStatusUpdated

**Change of remote audio status.**

You can use this callback to get the status ( `Playing` ,  `Loading` , or  `Stopped` ) of the audio of each remote user and display it on the UI.

|Param|DESC|
|---------|---------|
|extraInfo|Extra information|
|reason|Reason for the change of status|
|status|Audio status, which may be  `Playing` ,  `Loading` , or  `Stopped` |
|userId|User ID|

## onUserVideoSizeChanged

**Change of remote video size.**

If you receive the  `onUserVideoSizeChanged(userId, streamType, newWidth, newHeight)`  callback, it indicates that the user changed the video size. It may be triggered by setVideoEncoderParam or setSubStreamEncoderParam.

|Param|DESC|
|---------|---------|
|newHeight|Video height|
|newWidth|Video width|
|streamType|Video stream type. The primary stream ( `Main` ) is usually used for camera images, and the substream ( `Sub` ) for screen sharing images.|
|userId|User ID|

## onNetworkQuality

**Real-time network quality statistics.**

This callback is returned every 2 seconds and notifies you of the upstream quality of the local user and remote users detected by the SDK.

The SDK uses a built-in proprietary algorithm to assess the current latency, bandwidth, and stability of the network and returns a result.

If the result is  `1`  (excellent), it means that the current network conditions are excellent; if it is  `6`  (down), it means that the current network conditions are too bad to support TRTC calls.

|Param|DESC|
|---------|---------|
|localQuality|Upstream network quality of the local user.|
|remoteQuality|Upstream network quality of remote users.|

## onStatistics

**Real-time statistics on technical metrics.**

This callback is returned every 2 seconds and notifies you of the statistics on technical metrics related to video, audio, and network. The metrics are listed in TRTCStatistics:
-  Video statistics: video resolution ( `resolution` ), frame rate ( `FPS` ), bitrate ( `bitrate` ), etc.

-  Audio statistics: audio sample rate ( `samplerate` ), number of audio channels ( `channel` ), bitrate ( `bitrate` ), etc.

-  Network statistics: the round trip time ( `rtt` ) between the SDK and the cloud (SDK -> Cloud -> SDK), package loss rate ( `loss` ), upstream traffic ( `sentBytes` ), downstream traffic ( `receivedBytes` ), etc.

|Param|DESC|
|---------|---------|
|statistics|Statistics, including local statistics and the statistics of remote users. For details, please see TRTCStatistics.|

> **Note**
> If you want to learn about only the current network quality and do not want to spend much time analyzing the statistics returned by this callback, we recommend you use onNetworkQuality.
>

## onSpeedTestResult

**Callback of network speed test.**

The callback is triggered by startSpeedTest.

|Param|DESC|
|---------|---------|
|result|Speed test data, including loss rates, rtt and bandwidth rates, please .|

## onConnectionLost

**The SDK was disconnected from the cloud.**

The SDK returns this callback when it is disconnected from the cloud, which may be caused by network unavailability or change of network, for example, when the user walks into an elevator.

After returning this callback, the SDK will attempt to reconnect to the cloud, and will return the onTryToReconnect callback. When it is reconnected, it will return the onConnectionRecovery callback.

In other words, the SDK proceeds from one event to the next in the following order:

## onTryToReconnect

**The SDK is reconnecting to the cloud.**

When the SDK is disconnected from the cloud, it returns the onConnectionLost callback. It then attempts to reconnect and returns this callback (onTryToReconnect). After it is reconnected, it returns the onConnectionRecovery callback.

## onConnectionRecovery

**The SDK is reconnected to the cloud.**

When the SDK is disconnected from the cloud, it returns the onConnectionLost callback. It then attempts to reconnect and returns the onTryToReconnect callback. After it is reconnected, it returns this callback (onConnectionRecovery).

## onCameraDidReady

**The camera is ready.**

After you call startLocalPreview, the SDK will try to start the camera and return this callback if the camera is started.

If it fails to start the camera, it’s probably because the application does not have access to the camera or the camera is being used.

You can capture the onError callback to learn about the exception and let users know via UI messages.

## onMicDidReady

**The mic is ready.**

After you call startLocalAudio, the SDK will try to start the mic and return this callback if the mic is started.

If it fails to start the mic, it’s probably because the application does not have access to the mic or the mic is being used.

You can capture the onError callback to learn about the exception and let users know via UI messages.

## onAudioRouteChanged

**The audio route changed (for mobile devices only).**

Audio route is the route (speaker or receiver) through which audio is played.
-  When audio is played through the receiver, the volume is relatively low, and the sound can be heard only when the phone is put near the ear. This mode has a high level of privacy and is suitable for answering calls.

-  When audio is played through the speaker, the volume is relatively high, and there is no need to put the phone near the ear. This mode enables the "hands-free" feature.

-  When audio is played through the wired earphone.

-  When audio is played through the bluetooth earphone.

-  When audio is played through the USB sound card.

|Param|DESC|
|---------|---------|
|fromRoute|The audio route used before the change|
|route|Audio route, i.e., the route (speaker or receiver) through which audio is played|

## onUserVoiceVolume

**Volume.**

The SDK can assess the volume of each channel and return this callback on a regular basis. You can display, for example, a waveform or volume bar on the UI based on the statistics returned.

You need to first call enableAudioVolumeEvaluation to enable the feature and set the interval for the callback.

Note that the SDK returns this callback at the specified interval regardless of whether someone is speaking in the room.

|Param|DESC|
|---------|---------|
|totalVolume|The total volume of all remote users. Value range: [0, 100]|
|userVolumes|An array that represents the volume of all users who are speaking in the room. Value range: [0, 100]|

> **Note**
>  `userVolumes`  is an array. If  `userId`  is empty, the elements in the array represent the volume of the local user’s audio. Otherwise, they represent the volume of a remote user’s audio.
>

## onRecvCustomCmdMsg

**Receipt of custom message.**

When a user in a room uses sendCustomCmdMsg to send a custom message, other users in the room can receive the message through the  `onRecvCustomCmdMsg`  callback.

|Param|DESC|
|---------|---------|
|cmdID|Command ID|
|message|Message data|
|seq|Message serial number|
|userId|User ID|

## onMissCustomCmdMsg

**Loss of custom message.**

When you use sendCustomCmdMsg to send a custom UDP message, even if you enable reliable transfer (by setting  `reliable`  to  `true` ), there is still a chance of message loss. Reliable transfer only helps maintain a low probability of message loss, which meets the reliability requirements in most cases.

If the sender sets  `reliable`  to  `true` , the SDK will use this callback to notify the recipient of the number of custom messages lost during a specified time period (usually 5s) in the past.

|Param|DESC|
|---------|---------|
|cmdID|Command ID|
|errCode|Error code|
|missed|Number of lost messages|
|userId|User ID|

> **Note**
> The recipient receives this callback only if the sender sets  `reliable`  to  `true` .
>

## onRecvSEIMsg

**Receipt of SEI message.**

If a user in the room uses sendSEIMsg to send an SEI message via video frames, other users in the room can receive the message through the  `onRecvSEIMsg`  callback.

|Param|DESC|
|---------|---------|
|message|Data|
|userId|User ID|

## onStartPublishing

**Started publishing to Tencent Cloud CSS CDN.**

When you call startPublishing to publish streams to Tencent Cloud CSS CDN, the SDK will sync the command to the CVM immediately.

The SDK will then receive the execution result from the CVM and return the result to you via this callback.

|Param|DESC|
|---------|---------|
|err| `0` : successful; other values: failed. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onStopPublishing

**Stopped publishing to Tencent Cloud CSS CDN.**

When you call stopPublishing to stop publishing streams to Tencent Cloud CSS CDN, the SDK will sync the command to the CVM immediately.

The SDK will then receive the execution result from the CVM and return the result to you via this callback.

|Param|DESC|
|---------|---------|
|err| `0` : successful; other values: failed. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onStartPublishCDNStream

**Started publishing to non-Tencent Cloud’s live streaming CDN.**

When you call startPublishCDNStream to start publishing streams to a non-Tencent Cloud’s live streaming CDN, the SDK will sync the command to the CVM immediately.

The SDK will then receive the execution result from the CVM and return the result to you via this callback.

|Param|DESC|
|---------|---------|
|err| `0` : successful; other values: failed. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

> **Note**
> If you receive a callback that the command is executed successfully, it only means that your command was sent to Tencent Cloud’s backend server. If the CDN vendor does not accept your streams, the publishing will still fail.
>

## onStopPublishCDNStream

**Stopped publishing to non-Tencent Cloud’s live streaming CDN.**

When you call stopPublishCDNStream to stop publishing to a non-Tencent Cloud’s live streaming CDN, the SDK will sync the command to the CVM immediately.

The SDK will then receive the execution result from the CVM and return the result to you via this callback.

|Param|DESC|
|---------|---------|
|err| `0` : successful; other values: failed. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onSetMixTranscodingConfig

**Set the layout and transcoding parameters for On-Cloud MixTranscoding.**

When you call setMixTranscodingConfig to modify the layout and transcoding parameters for On-Cloud MixTranscoding, the SDK will sync the command to the CVM immediately.

The SDK will then receive the execution result from the CVM and return the result to you via this callback.

|Param|DESC|
|---------|---------|
|err| `0` : successful; other values: failed. For more information, please see [Error Codes](https://intl.cloud.tencent.com/document/product/647/35135).|
|errMsg|Error message|

## onStartPublishMediaStream

**Callback for starting to publish.**

When you call startPublishMediaStream to publish a stream to the TRTC backend, the SDK will immediately update the command to the cloud server.

The SDK will then receive the publishing result from the cloud server and will send the result to you via this callback.
| Param | DESC |
| --- | --- |
| code | :  <code>0</code> : Successful; other values: Failed. For more information, please see <a href="https://intl.cloud.tencent.com/document/product/647/35135">Error Codes</a>. |
| extraInfo | : Additional information. For some error codes, there may be additional information to help you troubleshoot the issues.<br>If the code return value is ERR_SERVER_PROCESS_FAILED, it means the server failed to process your request. You can use "error_code" as the key to retrieve the error code returned by the server. The specific error codes and recommended actions are as follows:<br>-  2000: Parameter error. Check the request parameters.<br>-  2001: Live streaming service is not enabled. Enable it in the Live streaming console.<br>-  2021: Third-party retweet service is not enabled. Contact product support to enable it.<br>-  3000: Internal server error. Retry is recommended.<br>-  4006: Concurrency conflict with the same task. The server is still processing the previous startPublishMediaStream task. Retry after a delay is recommended.<br>-  4007: The same task has already been successfully started using startPublishMediaStream. Use the returned taskId to call the updatePublishMediaStream API to update the task.<br>-  5001: Resource constraints. Retry after a delay is recommended. |
| message | : The callback information. |
| taskId | : If a request is successful, a task ID will be returned via the callback. You need to provide this task ID when you call updatePublishMediaStream to modify publishing parameters or stopPublishMediaStream to stop publishing. |

## onUpdatePublishMediaStream

**Callback for modifying publishing parameters.**

When you call updatePublishMediaStream to modify publishing parameters, the SDK will immediately update the command to the cloud server.

The SDK will then receive the modification result from the cloud server and will send the result to you via this callback.
| Param | DESC |
| --- | --- |
| code | :  <code>0</code> : Successful; other values: Failed. For more information, please see <a href="https://intl.cloud.tencent.com/document/product/647/35135">Error Codes</a>. |
| extraInfo | : Additional information. For some error codes, there may be additional information to help you troubleshoot the issues.<br>If the code return value is ERR_SERVER_PROCESS_FAILED, it means the server failed to process your request. You can use "error_code" as the key to retrieve the error code returned by the server. The specific error codes and recommended solutions are as follows:<br>-  2000: Parameter error. Check the request parameters.<br>-  2001: Live streaming service is not enabled. Enable it in the Live Streaming Console.<br>-  2002: Task not found. Restart the task by calling the startPublishMediaStream API.<br>-  2018: Concurrent requests are out of order. Retry with the latest streaming parameters.<br>-  2021: Third-party retweet service is not enabled. Contact product support to enable it.<br>-  3000: Internal server error. Retry.<br>-  4003: Task is exiting. Stop the task by calling the stopPublishMediaStream API first, then restart it by calling the startPublishMediaStream API. |
| message | : The callback information. |
| taskId | : The task ID you pass in when calling updatePublishMediaStream, which is used to identify a request. |

## onStopPublishMediaStream

**Callback for stopping publishing.**

When you call stopPublishMediaStream to stop publishing, the SDK will immediately update the command to the cloud server.

The SDK will then receive the modification result from the cloud server and will send the result to you via this callback.
| Param | DESC |
| --- | --- |
| code | :  <code>0</code> : Successful; other values: Failed. For more information, please see <a href="https://intl.cloud.tencent.com/document/product/647/35135">Error Codes</a>. |
| extraInfo | : Additional information. For some error codes, there may be additional information to help you troubleshoot the issues.<br>If the code return value is ERR_SERVER_PROCESS_FAILED, it means the server was unable to process your request. You can use "error_code" as the key to retrieve the error code returned by the server. The specific error codes and recommended actions are as follows:<br>-  2000: Parameter error. Please check the request parameters.<br>-  2002: Task not found. No action required.<br>-  3000: Internal server error. Please retry.<br>-  4003: Task is exiting. No action required. |
| message | : The callback information. |
| taskId | : The task ID you pass in when calling stopPublishMediaStream, which is used to identify a request. |

## onCdnStreamStateChanged

**Callback for change of RTMP/RTMPS publishing status.**

When you call startPublishMediaStream to publish a stream to the TRTC backend, the SDK will immediately update the command to the cloud server.

If you set the publishing destination (TRTCPublishTarget) to the URL of Tencent Cloud or a third-party CDN, you will be notified of the RTMP/RTMPS publishing status via this callback.
| Param | DESC |
| --- | --- |
| cdnUrl | : The URL you specify in TRTCPublishTarget when you call startPublishMediaStream. |
| code | : The publishing result.  <code>0</code> : Successful; other values: Failed. For more information, please see <a href="https://intl.cloud.tencent.com/document/product/647/35135">Error Codes</a>. |
| extraInfo | : Additional information. For some error codes, there may be additional information to help you troubleshoot the issues. |
| message | : The publishing information. |
| status | : The publishing status.<br>-  0: The publishing has not started yet or has ended. This value will be returned after you call stopPublishMediaStream.<br>-  1: The TRTC server is connecting to the CDN server. If the first attempt fails, the TRTC backend will retry multiple times and will return this value via the callback (every five seconds). After publishing succeeds, the value  <code>2</code>  will be returned. If a server error occurs or publishing is still unsuccessful after 60 seconds, the value  <code>4</code>  will be returned.<br>-  2: The TRTC server is publishing to the CDN. This value will be returned if the publishing succeeds.<br>-  3: The TRTC server is disconnected from the CDN server and is reconnecting. If a CDN error occurs or publishing is interrupted, the TRTC backend will try to reconnect and resume publishing and will return this value via the callback (every five seconds). After publishing resumes, the value  <code>2</code>  will be returned. If a server error occurs or the attempt to resume publishing is still unsuccessful after 60 seconds, the value  <code>4</code>  will be returned.<br>-  4: The TRTC server is disconnected from the CDN server and failed to reconnect within the timeout period. In this case, the publishing is deemed to have failed. You can call updatePublishMediaStream to try again.<br>-  5: The TRTC server is disconnecting from the CDN server. After you call stopPublishMediaStream, the SDK will return this value first and then the value  <code>0</code> . |

## onScreenCaptureStarted

**Screen sharing started.**

The SDK returns this callback when you call startScreenCapture and other APIs to start screen sharing.

## onScreenCapturePaused

**Screen sharing was paused.**

The SDK returns this callback when you call pauseScreenCapture to pause screen sharing.

## onScreenCaptureResumed

**Screen sharing was resumed.**

The SDK returns this callback when you call resumeScreenCapture to resume screen sharing.

## onScreenCaptureStopped

**Screen sharing stopped.**

The SDK returns this callback when you call stopScreenCapture to stop screen sharing.

|Param|DESC|
|---------|---------|
|reason|Reason.  `0` : the user stopped screen sharing;  `1` : screen sharing stopped because the shared window was closed.|

## onLocalRecordBegin

**Local recording started.**

When you call startLocalRecording to start local recording, the SDK returns this callback to notify you whether recording is started successfully.
| Param | DESC |
| --- | --- |
| errCode | status.<br>-   0: successful.<br>-  -1: failed.<br>-  -2: unsupported format.<br>-  -6: recording has been started. Stop recording first.<br>-  -7: recording file already exists and needs to be deleted.<br>-  -8: recording directory does not have the write permission. Please check the directory permission. |
| storagePath | Storage path of recording file |

## onLocalRecording

**Local media is being recorded.**

The SDK returns this callback regularly after local recording is started successfully via the calling of startLocalRecording.

You can capture this callback to stay up to date with the status of the recording task.

You can set the callback interval when calling startLocalRecording.

|Param|DESC|
|---------|---------|
|duration|Cumulative duration of recording, in milliseconds|
|storagePath|Storage path of recording file|

## onLocalRecordFragment

**Record fragment finished.**

When fragment recording is enabled, this callback will be invoked when each fragment file is finished.

|Param|DESC|
|---------|---------|
|storagePath|Storage path of the fragment.|

## onLocalRecordComplete

**Local recording stopped.**

When you call stopLocalRecording to stop local recording, the SDK returns this callback to notify you of the recording result.
| Param | DESC |
| --- | --- |
| errCode | status<br>-   0: successful.<br>-  -1: failed.<br>-  -2: Switching resolution or horizontal and vertical screen causes the recording to stop.<br>-  -3: recording duration is too short or no video or audio data is received. Check the recording duration or whether audio or video capture is enabled. |
| storagePath | Storage path of recording file |

## onSnapshotComplete

**Finished taking a local screenshot.**

|Param|DESC|
|---------|---------|
|bmp|Screenshot result. If it is  `null` , the screenshot failed to be taken.|
|data|Screenshot data. If it is  `nullptr` , it indicates that the SDK failed to take the screenshot.|
|format|Screenshot data format. Only TRTCVideoPixelFormat_BGRA32 is supported now.|
|height|Screenshot height|
|length|Screenshot data length. In BGRA32 format,  `length = width * height * 4` .|
|type|Video stream type|
|userId|User ID. If it is empty, the screenshot is a local image.|
|width|Screenshot width|

> **Note**
> The parameters of the full-platform C++ interface and the Java interface are different. The C++ interface uses 7 parameters to describe a screenshot, while the Java interface uses only one Bitmap to describe a screenshot.
>

## onExperimentalEvent

**Callback of experimental APIs.**

## onUserEnter

**An anchor entered the room (disused).**

@deprecated This callback is not recommended in the new version. Please use onRemoteUserEnterRoom instead.

## onUserExit

**An anchor left the room (disused).**

@deprecated This callback is not recommended in the new version. Please use onRemoteUserLeaveRoom instead.

## onAudioEffectFinished

**Audio effects ended (disused).**

@deprecated This callback is not recommended in the new version. Please use TXAudioEffectManager instead.

Audio effects and background music can be started using the same API (startPlayMusic) now instead of separate ones.

## onSpeedTest

**Result of server speed testing (disused).**

@deprecated This callback is not recommended in the new version. Please use onSpeedTestResult: instead.

---
sync_node_id: '89644532843724800'
nav_path:
  - "RTC Engine"
  - "API 参考手册"
  - "Flutter"
  - "API 概览"
product: "trtc"
---
## TRTCCloud

### Basic Method

|API|Description|
|---------|---------|
|[sharedInstance](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/sharedInstance.html)|Create a `TRTCCloud` singleton.|
|[destroySharedInstance](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/destroySharedInstance.html)|Destroy the `TRTCCloud` singleton.|
|[registerListener](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/registerListener.html)|Set event listening.|
|[unRegisterListener](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/unRegisterListener.html)|Remove event listening.|

### Room APIs

|API|Description|
|---------|---------|
|[enterRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/enterRoom.html)|Enters a room. If the room does not exist, the system will create one automatically.|
|[exitRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/exitRoom.html)|Leave the room.|
|[switchRole](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/switchRole.html)|Switch roles, applicable only to live streaming scenarios (TRTC_APP_SCENE_LIVE and TRTC_APP_SCENE_VOICE_CHATROOM).|
|[switchRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/switchRoom.html)|Switches rooms.|
|[connectOtherRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/connectOtherRoom.html)|Request cross-room call (host PK).|
|[disconnectOtherRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/disconnectOtherRoom.html)|Exit cross-room call.|
|[setDefaultStreamRecvMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setDefaultStreamRecvMode.html)|Set the audio and video data reception mode, which must be configured before entering the room to take effect.|

### CDN Interface Functions

|API|Description|
|---------|---------|
|[startPublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startPublishMediaStream.html)|Start publishing media stream.|
|[updatePublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/updatePublishMediaStream.html)|Update published media stream.|
|[stopPublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopPublishMediaStream.html)|Stop publishing media stream.|

### Video Interface Functions

|API|Description|
|---------|---------|
|[startLocalPreview](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startLocalPreview.html)|Enable the preview of local video.|
|[updateLocalView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/updateLocalView.html)|Update local video preview screen.|
|[stopLocalPreview](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopLocalPreview.html)|Stop local video capture and preview.|
|[muteLocalVideo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteLocalVideo.html)|Pauses/resumes publishing local video data.|
|[startRemoteView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startRemoteView.html)|Starts playing the video of a remote user.|
|[updateRemoteView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/updateRemoteView.html)|Update the video rendering view of the remote user.|
|[stopRemoteView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopRemoteView.html)|Stops playing and pulling the video of a remote user.|
|[stopAllRemoteView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopAllRemoteView.html)|Stops playing and pulling the videos of all remote users.|
|[muteRemoteVideoStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteRemoteVideoStream.html)|Pauses/Resumes receiving the video of a specified remote user.|
|[muteAllRemoteVideoStreams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteAllRemoteVideoStreams.html)|Pauses/Resumes receiving the videos of all remote users.|
|[setVideoEncoderParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setVideoEncoderParam.html)|Sets video encoder parameters.|
|[setNetworkQosParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setNetworkQosParam.html)|Sets the parameters for network flow control.|
|[setLocalRenderParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setLocalRenderParams.html)|Sets the rendering mode of the local image.|
|[setRemoteRenderParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setRemoteRenderParams.html)|Sets the parameters related to remote images.|
|[enableSmallVideoStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/enableSmallVideoStream.html)|Enables dual-stream encoding mode for large and small screens.|
|[setRemoteVideoStreamType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setRemoteVideoStreamType.html)|Selects the big or small screen for a specified UID.|
|[snapshotVideo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/snapshotVideo.html)|Takes a video screenshot.|
|[setGravitySensorAdaptiveMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setGravitySensorAdaptiveMode.html)|Sets the adaptive mode for gravity sensing.|
|[setVideoMuteImage](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setVideoMuteImage.html)|Set placeholder image during local video pause.|
|[setWatermark](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setWatermark.html)|Add watermark.|
|[setBeautyStyle](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setBeautyStyle.html)|Sets the beauty (skin smoothing) filter algorithm. |

### Audio related interface functions

|API|Description|
|---------|---------|
|[startLocalAudio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startLocalAudio.html)|Enables local audio capturing and publishing.|
|[stopLocalAudio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopLocalAudio.html)|Disables local audio capturing and publishing.|
|[muteLocalAudio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteLocalAudio.html)|Mute/unmute local audio.|
|[muteRemoteAudio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteRemoteAudio.html)|Mute/unmute the sound of a specified remote user.|
|[muteAllRemoteAudio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/muteAllRemoteAudio.html)|Mute/Unmute all user's voices.|
|[setRemoteAudioVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setRemoteAudioVolume.html)|Set the volume of a specific remote user's audio playback.|
|[setAudioCaptureVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setAudioCaptureVolume.html)|Sets the SDK capturing volume.|
|[getAudioCaptureVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getAudioCaptureVolume.html)|Obtains the SDK capture volume.|
|[setAudioPlayoutVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setAudioPlayoutVolume.html)|Sets the SDK playback volume.|
|[getAudioPlayoutVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getAudioPlayoutVolume.html)|Gets the SDK playback volume.|
|[enableAudioVolumeEvaluation](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/enableAudioVolumeEvaluation.html)|Enables volume level prompt.|
|[startLocalRecording](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startLocalRecording.html)|Start local media recording, which includes both audio and video data.|
|[stopLocalRecording](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopLocalRecording.html)|Stop local media recording.|

### Device management interface

|API|Description|
|---------|---------|
|[getDeviceManager](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getDeviceManager.html)|Obtain device management module. For interface details, see [Device Management Interface Documentation](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager-class.html).|

### Music and Vocal Special Effects

|API|Description|
|---------|---------|
|[getAudioEffectManager](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getAudioEffectManager.html)|Obtain TXAudioEffectManager for managing BGM, short sound effects, and vocal special effects. For interface details, see [Sound Effect Management Documentation](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager-class.html)|
|[startSystemAudioLoopback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startSystemAudioLoopback.html)|Enable system audio capture.|
|[stopSystemAudioLoopback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopSystemAudioLoopback.html)|Stop system audio capture.|
|[setSystemAudioLoopbackVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setSystemAudioLoopbackVolume.html)|Set system audio capturing volume.|

### Auxiliary stream related interface functions

|API|Description|
|---------|---------|
|[startScreenCapture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startScreenCapture.html)|Start screen sharing.|
|[stopScreenCapture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopScreenCapture.html)|Stop screen capturing.|
|[pauseScreenCapture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/pauseScreenCapture.html)|Pause screen sharing.|
|[resumeScreenCapture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/resumeScreenCapture.html)|Resumes screen sharing.|
|[getScreenCaptureSources](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getScreenCaptureSources.html)|Enumerate shareable screens and windows (this API is only supported on Windows).|
|[selectScreenCaptureTarget](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/selectScreenCaptureTarget.html)|Select the screen or window to be shared (this API is only supported on Windows).|
|[setSubStreamEncoderParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setSubStreamEncoderParam.html)|Set the screen sharing (i.e., substream) video encoding parameters (supported on both desktop and mobile systems).|

### Custom capturing and custom rendering

|API|Description|
|---------|---------|
|[enableCustomAudioCapture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/enableCustomAudioCapture.html)|Enable/Disable Custom Audio Capture Mode.|
|[sendCustomAudioData](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/sendCustomAudioData.html)|Submit your captured audio data to the SDK.|

### Custom message sending APIs

|API|Description|
|---------|---------|
|[sendCustomCmdMsg](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/sendCustomCmdMsg.html)|Sends a custom message to all users in a room.|
|[sendSEIMsg](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/sendSEIMsg.html)|Embeds small-volume custom data into video frames.|

### Network Testing

|API|Description|
|---------|---------|
|[startSpeedTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/startSpeedTest.html)|Starts network speed testing. This may compromise the quality of video calls and should be avoided during a video call.|
|[stopSpeedTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/stopSpeedTest.html)|Stops server speed measurement.|

### Log Interface Functions

|API|Description|
|---------|---------|
|[getSDKVersion](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/getSDKVersion.html)|Gets the SDK version.|
|[setLogLevel](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setLogLevel.html)|Sets the log output level.|
|[setConsoleEnabled](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setConsoleEnabled.html)|Enables/Disables console log printing.|
|[setLogCompressEnabled](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setLogCompressEnabled.html)|Enables/Disables local log compression.|
|[setLogDirPath](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setLogDirPath.html)|Modifies the log save path.|
|[setLogCallback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/setLogCallback.html)|Sets the log callback.|
|[showDebugView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/showDebugView.html)|Display Debug Information Floating Layer (can show audio and video information and event information).|
|[callExperimentalAPI](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud/callExperimentalAPI.html)|Calls the experimental API.|

## TRTCCloudListener

Event callback interface for Tencent Cloud video call feature.

### Error and warning event callback APIs

|API|Description|
|---------|---------|
|[onError](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onError.html)|Error callback, indicating an irrecoverable error in the SDK. It is essential to listen and provide users with appropriate interface prompts accordingly.|
|[onWarning](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onWarning.html)|Warning callback, designed to inform you of non-critical issues, such as lag or recoverable decoding failure.|

### Room event callback APIs

|API|Description|
|---------|---------|
|[onEnterRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onEnterRoom.html)|Callback for having joined the room.|
|[onExitRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onExitRoom.html)|Event callback for leaving the room.|
|[onSwitchRole](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSwitchRole.html)|Event callback for switching roles.|
|[onSwitchRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSwitchRoom.html)|Result callback for switching rooms (switchRoom).|
|[onConnectOtherRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onConnectOtherRoom.html)|Result callback for requesting cross-room call (Host PK).|
|[onDisconnectOtherRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onDisconnectOtherRoom.html)|Result callback for ending cross-room call (Host PK).|

### Member Event Callback

|API|Description|
|---------|---------|
|[onRemoteUserEnterRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRemoteUserEnterRoom.html)|A user has joined the current room.|
|[onRemoteUserLeaveRoom](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRemoteUserLeaveRoom.html)|A user has left the current room.|
|[onUserVideoAvailable](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUserVideoAvailable.html)|Whether the remote user has a main route view that can be played (generally used for cameras).|
|[onUserSubStreamAvailable](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUserSubStreamAvailable.html)|Whether the remote user has an auxiliary route view that can be played (generally used for screen sharing).|
|[onUserAudioAvailable](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUserAudioAvailable.html)|Whether the remote user has playable audio data.|
|[onFirstVideoFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onFirstVideoFrame.html)|Start rendering the first frame image of a local or remote user.|
|[onFirstAudioFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onFirstAudioFrame.html)|Start playing the first frame audio of a remote user (local sound is not notified for the time being).|
|[onSendFirstLocalVideoFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSendFirstLocalVideoFrame.html)|The first frame of local video data has been sent out.|
|[onSendFirstLocalAudioFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSendFirstLocalAudioFrame.html)|The first frame of local audio data has been sent out.|
|[onRemoteVideoStatusUpdated](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRemoteVideoStatusUpdated.html)|Callback for changes in remote video status.|
|[onRemoteAudioStatusUpdated](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRemoteAudioStatusUpdated.html)|Callback for changes in remote audio status.|
|[onUserVideoSizeChanged](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUserVideoSizeChanged.html)|Callback for changes in user's video size.|

### Callback for local recording and local screenshot events

|API|Description|
|---------|---------|
|[onLocalRecordBegin](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onLocalRecordBegin.html)|When the local recording task has started, the SDK will notify through this callback.|
|[onLocalRecording](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onLocalRecording.html)|While the local recording task is in progress, the SDK will periodically notify users through this callback.|
|[onLocalRecordFragment](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onLocalRecordFragment.html)|When you enable segmented recording, the SDK will notify you through this callback each time a segment is completed.|
|[onLocalRecordComplete](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onLocalRecordComplete.html)|When the local recording task has ended, the SDK will notify you through this callback.|
|[onSnapshotComplete](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSnapshotComplete.html)|Callback for local screenshot completion.|

### Statistics and quality callback

|API|Description|
|---------|---------|
|[onNetworkQuality](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onNetworkQuality.html)|Network quality, this callback is triggered every 2 seconds, providing statistics for the current network's upload and download quality.|
|[onStatistics](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onStatistics.html)|Technical indicators statistics callback.|
|[onSpeedTestResult](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSpeedTestResult.html)|Callback for the result of the network speed test.|

### Server event callback

|API|Description|
|---------|---------|
|[onConnectionLost](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onConnectionLost.html)|The SDK's connection to the server has disconnected.|
|[onTryToReconnect](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onTryToReconnect.html)|The SDK attempts to reconnect to the server.|
|[onConnectionRecovery](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onConnectionRecovery.html)|The SDK's connection to the server has been restored.|

### Hardware Device Event Callback

|API|Description|
|---------|---------|
|[onCameraDidReady](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onCameraDidReady.html)|Camera Ready.|
|[onMicDidReady](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onMicDidReady.html)|Microphone Ready.|
|[onUserVoiceVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUserVoiceVolume.html)|Callback for indicating volume level, including the volume of each userId and the remote master volume.|
|[onAudioDeviceCaptureVolumeChanged](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onAudioDeviceCaptureVolumeChanged.html)|The system capture volume of the current microphone has changed.|
|[onAudioDevicePlayoutVolumeChanged](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onAudioDevicePlayoutVolumeChanged.html)|The playback volume of the current system has changed.|
|[onSystemAudioLoopbackError](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onSystemAudioLoopbackError.html)|Event callback for successful system sound capture (only applicable to desktop systems).|
|[onTestMicVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onTestMicVolume.html)|Microphone test volume callback.|
|[onTestSpeakerVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onTestSpeakerVolume.html)|Speaker test volume callback.|

### Custom message receipt callback

|API|Description|
|---------|---------|
|[onRecvCustomCmdMsg](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRecvCustomCmdMsg.html)|Receipt of a custom message callback.|
|[onMissCustomCmdMsg](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onMissCustomCmdMsg.html)|Custom message loss callback.|
|[onRecvSEIMsg](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onRecvSEIMsg.html)|Received SEI message callback.|

### CDN Bypass Forward Callback

|API|Description|
|---------|---------|
|[onStartPublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onStartPublishMediaStream.html)|Callback for setting On-Cloud MixTranscoding parameters, corresponding to the startPublishMediaStream() interface in [TRTCCloud](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud-class.html#startPublishMediaStream).|
|[onUpdatePublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onUpdatePublishMediaStream.html)|Callback for setting On-Cloud MixTranscoding parameters, corresponding to the updatePublishMediaStream() interface in [TRTCCloud](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud-class.html#updatePublishMediaStream).|
|[onStopPublishMediaStream](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onStopPublishMediaStream.html)|Callback for setting On-Cloud MixTranscoding parameters, corresponding to the stopPublishMediaStream() interface in [TRTCCloud](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud/TRTCCloud-class.html#stopPublishMediaStream).|
|[onCdnStreamStateChanged](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onCdnStreamStateChanged.html)|Callback for changes in RTMP/RTMPS stream pushing status.|

### Screen sharing callback

|API|Description|
|---------|---------|
|[onScreenCaptureStarted](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onScreenCaptureStarted.html)|When screen sharing starts, the SDK will notify through this callback.|
|[onScreenCapturePaused](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onScreenCapturePaused.html)|When the pauseScreenCapture() is called to pause screen sharing, the SDK will notify through this callback.|
|[onScreenCaptureResumed](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onScreenCaptureResumed.html)|When the resumeScreenCapture() is called to resume screen sharing, the SDK will notify through this callback.|
|[onScreenCaptureStopped](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onScreenCaptureStopped.html)|When screen sharing stops, the SDK will notify via this callback.|
|[onScreenCaptureCovered](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCCloudListener/onScreenCaptureCovered.html)|Event callback for when the target window of screen sharing is obscured (applicable only to Windows operating systems).|

## More event callbacks

### TRTC Log Callback

|API|Description|
|---------|---------|
|[onLog](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_listener/TRTCLogCallback/onLog.html)|Local Log print callback.|

### Callback interface for playing background music

|API|Description|
|---------|---------|
|[onStart](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXMusicPlayObserver/onStart.html)|Callback notification for music playback start.|
|[onPlayProgress](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXMusicPlayObserver/onPlayProgress.html)|Callback notification for music playback progress.|
|[onComplete](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXMusicPlayObserver/onComplete.html)|Callback notification for music playback end.|

### Background Music Preload Event Callback

|API|Description|
|---------|---------|
|[onLoadProgress](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXMusicPreloadObserver/onLoadProgress.html)|Background Music Preload Progress.|
|[onLoadError](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXMusicPreloadObserver/onLoadError.html)|Background Music Preload Error.|

### Device Connectivity Status Change Callback

|API|Description|
|---------|---------|
|[onDeviceChanged](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceObserver/onDeviceChanged.html)|The connectivity status of the local device has changed (Desktop systems only).|

## TXAudioEffectManager

|API|Description|
|---------|---------|
|[enableVoiceEarMonitor](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/enableVoiceEarMonitor.html)|Enable ear monitoring, allowing local users to hear their own voice.|
|[setVoiceEarMonitorVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setVoiceEarMonitorVolume.html)|Set ear monitoring volume.|
|[setVoiceReverbType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setVoiceReverbType.html)|Set voice reverb effects (KTV, small room, auditorium, deep, bright, etc.).|
|[setVoiceChangerType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setVoiceChangerType.html)|Set voice changing effects (loli, uncle, heavy metal, punk, etc.).|
|[setVoiceCaptureVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setVoiceCaptureVolume.html)|Set microphone voice volume.|
|[setVoicePitch](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setVoicePitch.html)|Set voice pitch.|
|[setMusicObserver](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicObserver.html)|Set event callback interface for background music.|
|[startPlayMusic](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/startPlayMusic.html)|Start playing background music.|
|[stopPlayMusic](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/stopPlayMusic.html)|Stop playing background music.|
|[pausePlayMusic](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/pausePlayMusic.html)|Pause playing background music.|
|[resumePlayMusic](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/resumePlayMusic.html)|Resumes background music.|
|[setAllMusicVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setAllMusicVolume.html)|Sets global background music volume for local and remote users.|
|[setMusicPublishVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicPublishVolume.html)|Sets the remote volume of background music. The host can use this API to set the volume of background music heard by remote audiences.|
|[setMusicPlayoutVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicPlayoutVolume.html)|Sets the local volume of background music. The host can use this API to set the volume of local background music.|
|[setMusicPitch](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicPitch.html)|Adjusts the pitch of background music.|
|[setMusicSpeedRate](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicSpeedRate.html)|Adjusts the speed of background music.|
|[getMusicCurrentPosInMS](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/getMusicCurrentPosInMS.html)|Gets the current playback progress of the background music (milliseconds).|
|[getMusicDurationInMS](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/getMusicDurationInMS.html)|Gets the total duration of the background music file (milliseconds).|
|[seekMusicToPosInTime](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/seekMusicToPosInTime.html)|Sets the playback progress of the background music (milliseconds).|
|[setMusicScratchSpeedRate](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicScratchSpeedRate.html)|Adjusts the speed effect of the scratch disk.|
|[setPreloadObserver](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setPreloadObserver.html)|Set preload event callback.|
|[preloadMusic](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/preloadMusic.html)|Preload background music.|
|[getMusicTrackCount](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/getMusicTrackCount.html)|Get the number of tracks in background music.|
|[setMusicTrack](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXAudioEffectManager/setMusicTrack.html)|Specify the track to play background music.|

## TXDeviceManager

|API|Description|
|---------|---------|
|[isFrontCamera](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/isFrontCamera.html)|Set whether to use the front camera.|
|[switchCamera](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/switchCamera.html)|Switch camera (front/rear).|
|[getCameraZoomMaxRatio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getCameraZoomMaxRatio.html)|Get the maximum zoom level of the camera.|
|[setCameraZoomRatio](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCameraZoomRatio.html)|Set the camera zoom factor (focal length).|
|[isAutoFocusEnabled](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/isAutoFocusEnabled.html)|Check if the device supports automatic face position recognition.|
|[enableCameraAutoFocus](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/enableCameraAutoFocus.html)|Set whether to enable automatic face position recognition.|
|[setCameraFocusPosition](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCameraFocusPosition.html)|Set the camera focus position.|
|[enableCameraTorch](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/enableCameraTorch.html)|Enable/disable flashlight, also known as torch mode.|
|[setAudioRoute](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setAudioRoute.html)|Set audio routing, i.e., use receiver or speaker.|
|[getDevicesList](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getDevicesList.html)|Get the device list of specified type.|
|[setCurrentDevice](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCurrentDevice.html)|Set the device currently in use.|
|[getCurrentDevice](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getCurrentDevice.html)|Get the device currently in use.|
|[setCurrentDeviceVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCurrentDeviceVolume.html)|Set the volume of the current device.|
|[getCurrentDeviceVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getCurrentDeviceVolume.html)|Get the volume of the current device.|
|[setCurrentDeviceMute](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCurrentDeviceMute.html)|Set the mute state of the current device.|
|[getCurrentDeviceMute](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getCurrentDeviceMute.html)|Query the mute state of the current device.|
|[enableFollowingDefaultAudioDevice](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/enableFollowingDefaultAudioDevice.html)|Set the audio device used by the SDK to follow the system default device (desktop only).|
|[startCameraDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/startCameraDeviceTest.html)|Start camera testing (desktop only).|
|[stopCameraDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/stopCameraDeviceTest.html)|Stop camera testing (desktop only).|
|[startMicDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/startMicDeviceTest.html)|Start mic testing (desktop only).|
|[startMicDeviceTestAndPlayback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/startMicDeviceTestAndPlayback.html)|Start mic testing (desktop only).|
|[stopMicDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/stopMicDeviceTest.html)|Stop mic testing (desktop only).|
|[startSpeakerDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/startSpeakerDeviceTest.html)|Start speaker testing (desktop only).|
|[stopSpeakerDeviceTest](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/stopSpeakerDeviceTest.html)|Stop speaker testing (desktop only).|
|[setApplicationPlayVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setApplicationPlayVolume.html)|Set the volume of the current process in the Windows system volume mixer.|
|[getApplicationPlayVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getApplicationPlayVolume.html)|Get the volume of the current process in the Windows system volume mixer.|
|[setApplicationMuteState](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setApplicationMuteState.html)|Set the mute state of the current process in the Windows system volume mixer.|
|[getApplicationMuteState](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/getApplicationMuteState.html)|Get the mute state of the current process in the Windows system volume mixer.|
|[setCameraCaptureParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setCameraCaptureParam.html)|Set camera capture preferences.|
|[setDeviceObserver](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceManager/setDeviceObserver.html)|Set onDeviceChanged event callback.|

## Enumeration definitions

|Enum Type|Description|
|---------|---------|
|[TRTCAppScene](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAppScene.html)|Application scenario.|
|[TRTCAudioFrameFormat](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioFrameFormat.html)|Audio Frame Content Format.|
|[TRTCAudioFrameOperationMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioFrameOperationMode.html)|Audio Callback Data Operation Mode.|
|[TRTCAudioQuality](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioQuality.html)|Sound Quality.|
|[TRTCAudioRecordingContent](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioRecordingContent.html)|Audio Recording Content Type.|
|[TRTCAVStatusChangeReason](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAVStatusChangeReason.html)|Playback State Change Reason.|
|[TRTCAVStatusType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAVStatusType.html)|Audio and video playback status.|
|[TRTCBeautyStyle](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCBeautyStyle.html)|Media recording type.|
|[TRTCGSensorMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCGSensorMode.html)|Sets the adaptive mode for gravity sensing (only applicable to mobile devices).|
|[TRTCLocalRecordType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCLocalRecordType.html)|Media recording type.|
|[TRTCLogLevel](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCLogLevel.html)|Log level.|
|[TRTCPublishMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCPublishMode.html)|Publishing mode.|
|[TRTCQuality](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCQuality.html)|Network quality.|
|[TRTCRoleType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCRoleType.html)|Roles.|
|[TRTCScreenCaptureSourceType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCScreenCaptureSourceType.html)|Screen sharing target type (desktop only).|
|[TRTCSnapshotSourceType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCSnapshotSourceType.html)|Local video screenshot data source.|
|[TRTCSpeedTestScene](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCSpeedTestScene.html)|Speed test scenario.|
|[TRTCVideoBufferType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoBufferType.html)|Video data shipping method.|
|[TRTCVideoFillMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoFillMode.html)|Video image fill mode.|
|[TRTCVideoMirrorType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoMirrorType.html)|Video mirroring type.|
|[TRTCVideoPixelFormat](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoPixelFormat.html)|Video pixel format.|
|[TRTCVideoQosPreference](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoQosPreference.html)|Image quality preference.|
|[TRTCVideoResolution](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoResolution.html)|Video resolution.|
|[TRTCVideoResolutionMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoResolutionMode.html)|Video aspect ratio mode.|
|[TRTCVideoRotation](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoRotation.html)|Video image rotation direction.|
|[TRTCVideoStreamType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoStreamType.html)|Video stream type.|
|[TRTCWaterMarkSrcType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCWaterMarkSrcType.html)|Watermark image source type.|
|[TXVoiceReverbType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXVoiceReverbType.html)|Reverb special effect.|
|[TXVoiceChangerType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/TXVoiceChangerType.html)|Voice change special effect.|
|[TXAudioRoute](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXAudioRoute.html)|Audio routing (i.e., sound playback mode).|
|[TXMediaDeviceType](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXMediaDeviceType.html)|Device type (desktop platform only).|
|[TXMediaDeviceState](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXMediaDeviceState.html)|Device operation.|
|[TXCameraCaptureMode](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXCameraCaptureMode.html)|Camera capture preferences.|

## Type Definition

|Struct type|Description|
|---------|---------|
|[TRTCAudioFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioFrame-class.html)|Audio frame data.|
|[TRTCAudioFrameCallbackFormat](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioFrameCallbackFormat-class.html)|Format parameters for custom audio callbacks.|
|[TRTCAudioVolumeEvaluateParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCAudioVolumeEvaluateParams-class.html)|Volume evaluation and other related parameter settings.|
|[TRTCImageBuffer](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCImageBuffer-class.html)|Structure for storing window thumbnails and icons.|
|[TRTCLocalRecordingParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCLocalRecordingParams-class.html)|Local media file recording parameters.|
|[TRTCLocalStatistics](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCLocalStatistics-class.html)|Local audio and video metrics.|
|[TRTCNetworkQosParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCNetworkQosParam-class.html)|Network bandwidth limit parameters.|
|[TRTCParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCParams-class.html)|Room entry parameters.|
|[TRTCPublishCdnUrl](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCPublishCdnUrl-class.html)|Target URL for publishing to Tencent Cloud or a third-party CDN.|
|[TRTCPublishTarget](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCPublishTarget-class.html)|Publishing target.|
|[TRTCQualityInfo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCQualityInfo-class.html)|Network quality.|
|[TRTCRemoteStatistics](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCRemoteStatistics-class.html)|Remote audio and video metrics.|
|[TRTCRenderParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCRenderParams-class.html)|Rendering parameters of the video image.|
|[TRTCScreenCaptureProperty](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCScreenCaptureProperty-class.html)|Advanced control parameters for screen sharing.|
|[TRTCScreenCaptureSourceInfo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCScreenCaptureSourceInfo-class.html)|Target information for screen sharing (desktop only).|
|[TRTCScreenCaptureSourceList](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCScreenCaptureSourceList-class.html)|List of screen windows.|
|[TRTCSpeedTestParams](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCSpeedTestParams-class.html)|Network speed test parameters.|
|[TRTCSpeedTestResult](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCSpeedTestResult-class.html)|Network speed test results.|
|[TRTCStatistics](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCStatistics-class.html)|Network and performance metrics.|
|[TRTCStreamEncoderParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCStreamEncoderParam-class.html)|Encoding parameters.|
|[TRTCStreamMixingConfig](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCStreamMixingConfig-class.html)|Transcoding parameters.|
|[TRTCSwitchRoomConfig](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCSwitchRoomConfig-class.html)|Room switch parameters.|
|[TRTCTexture](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCTexture-class.html)|Video texture data.|
|[TRTCUser](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCUser-class.html)|User to publish stream.|
|[TRTCVideoEncParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoEncParam-class.html)|Video codec parameters.|
|[TRTCVideoFrame](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoFrame-class.html)|Video frame information.|
|[TRTCVideoLayout](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVideoLayout-class.html)|Video layout for transcoded stream.|
|[TRTCVolumeInfo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCVolumeInfo-class.html)|Volume.|
|[TRTCWatermark](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_def/TRTCWatermark-class.html)|Watermark layout.|
|[AudioMusicParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_audio_effect_manager/AudioMusicParam-class.html)|Background music playback control information.|
|[TXCameraCaptureParam](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXCameraCaptureParam-class.html)|Camera capture parameters.|
|[TXDeviceInfo](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/tx_device_manager/TXDeviceInfo-class.html)|Information about audio and video devices (desktop platform only).|

## Video rendering component

|API|Description|
|---------|---------|
|[TRTCCloudVideoView](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/v3/en/trtc_cloud_video_view/TRTCCloudVideoView-class.html)|Video view window for displaying local video, remote video, or auxiliary stream.|

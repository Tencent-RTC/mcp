---
sync_node_id: '89644532617232384'
nav_path:
  - "RTC Engine"
  - "API 参考手册"
  - "Android"
  - "API 概览"
product: "trtc"
---
## Create Instance And Event Callback

|FuncList|DESC|
|---------|---------|
|sharedInstance|Create TRTCCloud instance (singleton mode).|
|destroySharedInstance|Terminate TRTCCloud instance (singleton mode).|
|addListener|Add TRTC event callback.|
|removeListener|Remove TRTC event callback.|
|setListenerHandler|Set the queue that drives the TRTCCloudListener event callback.|

## Room APIs

|FuncList|DESC|
|---------|---------|
|enterRoom|Enter room.|
|exitRoom|Exit room.|
|switchRole|Switch role.|
|switchRoom|Switch room.|
|ConnectOtherRoom|Request cross-room call.|
|DisconnectOtherRoom|Exit cross-room call.|
|setDefaultStreamRecvMode|Set subscription mode (which must be set before room entry for it to take effect).|
|createSubCloud|Create room subinstance (for concurrent multi-room listen/watch).|
|destroySubCloud|Terminate room subinstance.|
|updateOtherRoomForwardMode|Change the upstream capability of the cross-room anchor in the current room.|

## CDN APIs

|FuncList|DESC|
|---------|---------|
|startPublishMediaStream|Publish a stream.|
|updatePublishMediaStream|Modify publishing parameters.|
|stopPublishMediaStream|Stop publishing.|

## Video APIs

|FuncList|DESC|
|---------|---------|
|startLocalPreview|Enable the preview image of local camera (mobile).|
|updateLocalView|Update the preview image of local camera.|
|stopLocalPreview|Stop camera preview.|
|muteLocalVideo|Pause/Resume publishing local video stream.|
|setVideoMuteImage|Set placeholder image during local video pause.|
|startRemoteView|Subscribe to remote user's video stream and bind video rendering control.|
|updateRemoteView|Update remote user's video rendering control.|
|stopRemoteView|Stop subscribing to remote user's video stream and release rendering control.|
|stopAllRemoteView|Stop subscribing to all remote users' video streams and release all rendering resources.|
|muteRemoteVideoStream|Pause/Resume subscribing to remote user's video stream.|
|muteAllRemoteVideoStreams|Pause/Resume subscribing to all remote users' video streams.|
|setVideoEncoderParam|Set the encoding parameters of video encoder.|
|setNetworkQosParam|Set network quality control parameters.|
|setLocalRenderParams|Set the rendering parameters of local video image.|
|setRemoteRenderParams|Set the rendering mode of remote video image.|
|enableEncSmallVideoStream|Enable dual-channel encoding mode with big and small images.|
|setRemoteVideoStreamType|Switch the big/small image of specified remote user.|
|snapshotVideo|Screencapture video.|
|setPerspectiveCorrectionPoints|Sets perspective correction coordinate points.|
|setGravitySensorAdaptiveMode|Set the adaptation mode of gravity sensing (version 11.7 and above).|

## Audio APIs

|FuncList|DESC|
|---------|---------|
|startLocalAudio|Enable local audio capturing and publishing.|
|stopLocalAudio|Stop local audio capturing and publishing.|
|muteLocalAudio|Pause/Resume publishing local audio stream.|
|muteRemoteAudio|Pause/Resume playing back remote audio stream.|
|muteAllRemoteAudio|Pause/Resume playing back all remote users' audio streams.|
|setAudioRoute|Set audio route.|
|setRemoteAudioVolume|Set the audio playback volume of remote user.|
|setAudioCaptureVolume|Set the capturing volume of local audio.|
|getAudioCaptureVolume|Get the capturing volume of local audio.|
|setAudioPlayoutVolume|Set the playback volume of remote audio.|
|getAudioPlayoutVolume|Get the playback volume of remote audio.|
|enableAudioVolumeEvaluation|Enable volume reminder.|
|startAudioRecording|Start audio recording.|
|stopAudioRecording|Stop audio recording.|
|startLocalRecording|Start local media recording.|
|stopLocalRecording|Stop local media recording.|
|setRemoteAudioParallelParams|Set the parallel strategy of remote audio streams.|
|enable3DSpatialAudioEffect|Enable 3D spatial effect.|
|updateSelf3DSpatialPosition|Update self position and orientation for 3D spatial effect.|
|updateRemote3DSpatialPosition|Update the specified remote user's position for 3D spatial effect.|
|set3DSpatialReceivingRange|Set the maximum 3D spatial attenuation range for userId's audio stream.|

## Device management APIs

|FuncList|DESC|
|---------|---------|
|getDeviceManager|Get device management class (TXDeviceManager).|

## Beauty filter and watermark APIs

|FuncList|DESC|
|---------|---------|
|getBeautyManager|Get beauty filter management class (TXBeautyManager).|
|setWatermark|Add watermark.|

## Background music and sound effect APIs

|FuncList|DESC|
|---------|---------|
|getAudioEffectManager|Get sound effect management class (TXAudioEffectManager).|
|startSystemAudioLoopback|Enable system audio capturing.|
|stopSystemAudioLoopback|Stop system audio capturing(iOS not supported).|
|setSystemAudioLoopbackVolume|Set the volume of system audio capturing.|

## Real-time Transcription Translation Interface

|FuncList|DESC|
|---------|---------|
|getAITranscriberManager|Get AI transcriber manager (AITranscriberManager).|

## Screen sharing APIs

|FuncList|DESC|
|---------|---------|
|startScreenCapture|Start screen sharing.|
|stopScreenCapture|Stop screen sharing.|
|pauseScreenCapture|Pause screen sharing.|
|resumeScreenCapture|Resume screen sharing.|
|setSubStreamEncoderParam|Set the video encoding parameters of screen sharing (i.e., substream) (for desktop and mobile systems).|

## Custom capturing and rendering APIs

|FuncList|DESC|
|---------|---------|
|enableCustomVideoCapture|Enable/Disable custom video capturing mode.|
|sendCustomVideoData|Deliver captured video frames to SDK.|
|enableCustomAudioCapture|Enable custom audio capturing mode.|
|sendCustomAudioData|Deliver captured audio data to SDK.|
|enableMixExternalAudioFrame|Enable/Disable custom audio track.|
|mixExternalAudioFrame|Mix custom audio track into SDK.|
|setMixExternalAudioVolume|Set the publish volume and playback volume of mixed custom audio track.|
|generateCustomPTS|Generate custom capturing timestamp.|
|setLocalVideoProcessListener|Set video data callback for third-party beauty filters.|
|setLocalVideoRenderListener|Set the callback of custom rendering for local video.|
|setRemoteVideoRenderListener|Set the callback of custom rendering for remote video.|
|setAudioFrameListener|Set custom audio data callback.|
|setCapturedAudioFrameCallbackFormat|Set the callback format of audio frames captured by local mic.|
|setLocalProcessedAudioFrameCallbackFormat|Set the callback format of preprocessed local audio frames.|
|setMixedPlayAudioFrameCallbackFormat|Set the callback format of audio frames to be played back by system.|
|enableCustomAudioRendering|Enabling custom audio playback.|
|getCustomAudioRenderingFrame|Getting playable audio data.|

## Custom message sending APIs

|FuncList|DESC|
|---------|---------|
|sendCustomCmdMsg|Use UDP channel to send custom message to all users in room.|
|sendSEIMsg|Use SEI channel to send custom message to all users in room.|

## Network test APIs

|FuncList|DESC|
|---------|---------|
|startSpeedTest|Start network speed test (used before room entry).|
|stopSpeedTest|Stop network speed test.|

## Debugging APIs

|FuncList|DESC|
|---------|---------|
|getSDKVersion|Get SDK version information.|
|setLogLevel|Set log output level.|
|setConsoleEnabled|Enable/Disable console log printing.|
|setLogCompressEnabled|Enable/Disable local log compression.|
|setLogDirPath|Set local log storage path.|
|setLogListener|Set log callback.|
|showDebugView|Display dashboard.|
|TRTCViewMargin|Set dashboard margin.|
|callExperimentalAPI|Call experimental APIs.|

## Encrypted interface

|FuncList|DESC|
|---------|---------|
|enablePayloadPrivateEncryption|Enable or disable private encryption of media streams.|

## Error and warning events

|FuncList|DESC|
|---------|---------|
|onError|Error event callback.|
|onWarning|Warning event callback.|

## Room event callback

|FuncList|DESC|
|---------|---------|
|onEnterRoom|Whether room entry is successful.|
|onExitRoom|Room exit.|
|onSwitchRole|Role switching.|
|onSwitchRoom|Result of room switching.|
|onConnectOtherRoom|Result of requesting cross-room call.|
|onDisConnectOtherRoom|Result of ending cross-room call.|
|onUpdateOtherRoomForwardMode|Result of changing the upstream capability of the cross-room anchor.|

## User event callback.

|FuncList|DESC|
|---------|---------|
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

## Callback of statistics on network and technical metrics.

|FuncList|DESC|
|---------|---------|
|onNetworkQuality|Real-time network quality statistics.|
|onStatistics|Real-time statistics on technical metrics.|
|onSpeedTestResult|Callback of network speed test.|

## Callback of connection to the cloud

|FuncList|DESC|
|---------|---------|
|onConnectionLost|The SDK was disconnected from the cloud.|
|onTryToReconnect|The SDK is reconnecting to the cloud.|
|onConnectionRecovery|The SDK is reconnected to the cloud.|

## Callback of hardware events

|FuncList|DESC|
|---------|---------|
|onCameraDidReady|The camera is ready.|
|onMicDidReady|The mic is ready.|
|onAudioRouteChanged|The audio route changed (for mobile devices only).|
|onUserVoiceVolume|Volume.|

## Callback of the receipt of a custom message.

|FuncList|DESC|
|---------|---------|
|onRecvCustomCmdMsg|Receipt of custom message.|
|onMissCustomCmdMsg|Loss of custom message.|
|onRecvSEIMsg|Receipt of SEI message.|

## CDN event callback

|FuncList|DESC|
|---------|---------|
|onStartPublishing|Started publishing to Tencent Cloud CSS CDN.|
|onStopPublishing|Stopped publishing to Tencent Cloud CSS CDN.|
|onStartPublishCDNStream|Started publishing to non-Tencent Cloud’s live streaming CDN.|
|onStopPublishCDNStream|Stopped publishing to non-Tencent Cloud’s live streaming CDN.|
|onSetMixTranscodingConfig|Set the layout and transcoding parameters for On-Cloud MixTranscoding.|
|onStartPublishMediaStream|Callback for starting to publish.|
|onUpdatePublishMediaStream|Callback for modifying publishing parameters.|
|onStopPublishMediaStream|Callback for stopping publishing.|
|onCdnStreamStateChanged|Callback for change of RTMP/RTMPS publishing status.|

## Screen sharing event callback

|FuncList|DESC|
|---------|---------|
|onScreenCaptureStarted|Screen sharing started.|
|onScreenCapturePaused|Screen sharing was paused.|
|onScreenCaptureResumed|Screen sharing was resumed.|
|onScreenCaptureStopped|Screen sharing stopped.|

## Callback of local recording and screenshot events

|FuncList|DESC|
|---------|---------|
|onLocalRecordBegin|Local recording started.|
|onLocalRecording|Local media is being recorded.|
|onLocalRecordFragment|Record fragment finished.|
|onLocalRecordComplete|Local recording stopped.|
|onSnapshotComplete|Finished taking a local screenshot.|

## Callback of debugging events

|FuncList|DESC|
|---------|---------|
|onExperimentalEvent|Callback of experimental APIs.|

## Disused callbacks

|FuncList|DESC|
|---------|---------|
|onUserEnter|An anchor entered the room (disused).|
|onUserExit|An anchor left the room (disused).|
|onAudioEffectFinished|Audio effects ended (disused).|
|onSpeedTest|Result of server speed testing (disused).|

## Callback of custom video processing

|FuncList|DESC|
|---------|---------|
|onRenderVideoFrame|Custom video rendering.|
|onGLContextCreated|An OpenGL context was created in the SDK.|
|onProcessVideoFrame|Video processing by third-party beauty filters.|
|onGLContextDestory|The OpenGL context in the SDK was destroyed.|

## Callback of custom audio processing

|FuncList|DESC|
|---------|---------|
|onCapturedAudioFrame|Audio data captured by the local mic and pre-processed by the audio module.|
|onLocalProcessedAudioFrame|Audio data captured by the local mic, pre-processed by the audio module, effect-processed and BGM-mixed.|
|onRemoteUserAudioFrame|Audio data of each remote user before audio mixing.|
|onMixedPlayAudioFrame|Data mixed from each channel before being submitted to the system for playback.|
|onMixedAllAudioFrame|Data mixed from all the captured and to-be-played audio in the SDK.|
|onVoiceEarMonitorAudioFrame|In-ear monitoring data.|

## Other event callbacks

|FuncList|DESC|
|---------|---------|
|onLog|Printing of local log.|

## Background music preload event callback

|FuncList|DESC|
|---------|---------|
|onLoadProgress|Background music preload progress.|
|onLoadError|Background music preload error.|

## Callback of playing background music

|FuncList|DESC|
|---------|---------|
|onStart|Background music started.|
|onPlayProgress|Playback progress of background music.|
|onComplete|Background music ended.|

## Voice effect APIs

|FuncList|DESC|
|---------|---------|
|enableVoiceEarMonitor|Enabling in-ear monitoring.|
|setVoiceEarMonitorVolume|Setting in-ear monitoring volume.|
|setVoiceReverbType|Setting voice reverb effects.|
|setVoiceChangerType|Setting voice changing effects.|
|setVoiceCaptureVolume|Setting speech volume.|
|setVoicePitch|Setting speech pitch.|

## Background music APIs

|FuncList|DESC|
|---------|---------|
|setMusicObserver|Setting the background music callback.|
|startPlayMusic|Starting background music.|
|stopPlayMusic|Stopping background music.|
|pausePlayMusic|Pausing background music.|
|resumePlayMusic|Resuming background music.|
|setAllMusicVolume|Setting the local and remote playback volume of background music.|
|setMusicPublishVolume|Setting the remote playback volume of a specific music track.|
|setMusicPlayoutVolume|Setting the local playback volume of a specific music track.|
|setMusicPitch|Adjusting the pitch of background music.|
|setMusicSpeedRate|Changing the speed of background music.|
|getMusicCurrentPosInMS|Getting the playback progress (ms) of background music.|
|getMusicDurationInMS|Getting the total length (ms) of background music.|
|seekMusicToPosInMS|Setting the playback progress (ms) of background music.|
|setMusicScratchSpeedRate|Adjust the speed change effect of the scratch disc.|
|setPreloadObserver|Setting music preload callback.|
|preloadMusic|Preload background music.|
|getMusicTrackCount|Get the number of tracks of background music.|
|setMusicTrack|Specify the playback track of background music.|

## beauty interface

|FuncList|DESC|
|---------|---------|
|setBeautyStyle|Sets the beauty (skin smoothing) filter algorithm.|
|setBeautyLevel|Sets the strength of the beauty filter.|
|setWhitenessLevel|Sets the strength of the brightening filter.|
|enableSharpnessEnhancement|Enables clarity enhancement.|
|setRuddyLevel|Sets the strength of the rosy skin filter.|
|setFilter|Sets color filter.|
|setFilterStrength|Sets the strength of color filter.|
|setGreenScreenFile|Sets green screen video.|
|setEyeScaleLevel|Sets the strength of the eye enlarging filter.|
|setFaceSlimLevel|Sets the strength of the face slimming filter.|
|setFaceVLevel|Sets the strength of the chin slimming filter.|
|setChinLevel|Sets the strength of the chin lengthening/shortening filter.|
|setFaceShortLevel|Sets the strength of the face shortening filter.|
|setFaceNarrowLevel|Sets the strength of the face narrowing filter.|
|setNoseSlimLevel|Sets the strength of the nose slimming filter.|
|setEyeLightenLevel|Sets the strength of the eye brightening filter.|
|setToothWhitenLevel|Sets the strength of the teeth whitening filter.|
|setWrinkleRemoveLevel|Sets the strength of the wrinkle removal filter.|
|setPounchRemoveLevel|Sets the strength of the eye bag removal filter.|
|setSmileLinesRemoveLevel|Sets the strength of the smile line removal filter.|
|setForeheadLevel|Sets the strength of the hairline adjustment filter.|
|setEyeDistanceLevel|Sets the strength of the eye distance adjustment filter.|
|setEyeAngleLevel|Sets the strength of the eye corner adjustment filter.|
|setMouthShapeLevel|Sets the strength of the mouth shape adjustment filter.|
|setNoseWingLevel|Sets the strength of the nose wing narrowing filter.|
|setNosePositionLevel|Sets the strength of the nose position adjustment filter.|
|setLipsThicknessLevel|Sets the strength of the lip thickness adjustment filter.|
|setFaceBeautyLevel|Sets the strength of the face shape adjustment filter.|
|setMotionTmpl|Selects the AI animated effect pendant.|
|setMotionMute|Sets whether to mute during animated effect playback.|

## Device APIs

|FuncList|DESC|
|---------|---------|
|isFrontCamera|Querying whether the front camera is being used.|
|switchCamera|Switching to the front/rear camera (for mobile OS).|
|getCameraZoomMaxRatio|Getting the maximum zoom ratio of the camera (for mobile OS).|
|setCameraZoomRatio|Setting the camera zoom ratio (for mobile OS).|
|isAutoFocusEnabled|Querying whether automatic face detection is supported (for mobile OS).|
|enableCameraAutoFocus|Enabling auto focus (for mobile OS).|
|setCameraFocusPosition|Adjusting the focus (for mobile OS).|
|enableCameraTorch|Enabling/Disabling flash, i.e., the torch mode (for mobile OS).|
|setAudioRoute|Setting the audio route (for mobile OS).|
|setExposureCompensation|Set the exposure parameters of the camera, ranging from - 1 to 1.|
|setCameraCapturerParam|Set camera acquisition preferences.|

## Disused APIs

|FuncList|DESC|
|---------|---------|
|setSystemVolumeType|Setting the system volume type (for mobile OS).|
|setListener|Set TRTC event callback.|
|setBeautyStyle|Set the strength of beauty, brightening, and rosy skin filters.|
|setEyeScaleLevel|Set the strength of eye enlarging filter.|
|setFaceSlimLevel|Set the strength of face slimming filter.|
|setFaceVLevel|Set the strength of chin slimming filter.|
|setChinLevel|Set the strength of chin lengthening/shortening filter.|
|setFaceShortLevel|Set the strength of face shortening filter.|
|setNoseSlimLevel|Set the strength of nose slimming filter.|
|selectMotionTmpl|Set animated sticker.|
|setMotionMute|Mute animated sticker.|
|setFilter|Set color filter.|
|setFilterConcentration|Set the strength of color filter.|
|setGreenScreenFile|Set green screen video.|
|setReverbType|Set reverb effect.|
|setVoiceChangerType|Set voice changing type.|
|enableAudioEarMonitoring|Enable or disable in-ear monitoring.|
|enableAudioVolumeEvaluation|Enable volume reminder.|
|switchCamera|Switch camera.|
|isCameraZoomSupported|Query whether the current camera supports zoom.|
|setZoom|Set camera zoom ratio (focal length).|
|isCameraTorchSupported|Query whether the device supports flash.|
|enableTorch|Enable/Disable flash.|
|isCameraFocusPositionInPreviewSupported|Query whether the camera supports setting focus.|
|setFocusPosition|Set the focal position of camera.|
|isCameraAutoFocusFaceModeSupported|Query whether the device supports the automatic recognition of face position.|
|setSystemVolumeType|Setting the system volume type (for mobile OS).|
|snapshotVideo|Screencapture video.|
|checkAudioCapabilitySupport|Query whether a certain audio capability is supported (only for Android).|
|startLocalAudio|Set sound quality.|
|startRemoteView|Start displaying remote video image.|
|stopRemoteView|Stop displaying remote video image and pulling the video data stream of remote user.|
|setLocalViewFillMode|Set the rendering mode of local image.|
|setLocalViewRotation|Set the clockwise rotation angle of local image.|
|setLocalViewMirror|Set the mirror mode of local camera's preview image.|
|setRemoteViewFillMode|Set the fill mode of substream image.|
|setRemoteViewRotation|Set the clockwise rotation angle of remote image.|
|startRemoteSubStreamView|Start displaying the substream image of remote user.|
|stopRemoteSubStreamView|Stop displaying the substream image of remote user.|
|setRemoteSubStreamViewFillMode|Set the fill mode of substream image.|
|setRemoteSubStreamViewRotation|Set the clockwise rotation angle of substream image.|
|setAudioQuality|Set sound quality.|
|setPriorRemoteVideoStreamType|Specify whether to view the big or small image.|
|setMicVolumeOnMixing|Set mic volume.|
|playBGM|Start background music.|
|stopBGM|Stop background music.|
|pauseBGM|Stop background music.|
|resumeBGM|Stop background music.|
|getBGMDuration|Get the total length of background music in ms.|
|setBGMPosition|Set background music playback progress.|
|setBGMVolume|Set background music volume.|
|setBGMPlayoutVolume|Set the local playback volume of background music.|
|setBGMPublishVolume|Set the remote playback volume of background music.|
|playAudioEffect|Play sound effect.|
|setAudioEffectVolume|Set sound effect volume.|
|stopAudioEffect|Stop sound effect.|
|stopAllAudioEffects|Stop all sound effects.|
|setAllAudioEffectsVolume|Set the volume of all sound effects.|
|pauseAudioEffect|Pause sound effect.|
|resumeAudioEffect|Pause sound effect.|
|enableCustomVideoCapture|Enable custom video capturing mode.|
|sendCustomVideoData|Deliver captured video data to SDK.|
|muteLocalVideo|Pause/Resume publishing local video stream.|
|muteRemoteVideoStream|Pause/Resume subscribing to remote user's video stream.|
|startSpeedTest|Start network speed test (used before room entry).|
|startScreenCapture|Start screen sharing.|
|setVideoEncoderRotation|Set the direction of image output by video encoder.|
|setVideoEncoderMirror|Set the mirror mode of image output by encoder.|
|setGSensorMode|Set the adaptation mode of G-sensor.|
|startPublishing|Start publishing audio/video streams to Tencent Cloud CSS CDN.|
|stopPublishing|Stop publishing audio/video streams to Tencent Cloud CSS CDN.|
|startPublishCDNStream|Start publishing audio/video streams to non-Tencent Cloud CDN.|
|stopPublishCDNStream|Stop publishing audio/video streams to non-Tencent Cloud CDN.|
|setMixTranscodingConfig|Set the layout and transcoding parameters of On-Cloud MixTranscoding.|

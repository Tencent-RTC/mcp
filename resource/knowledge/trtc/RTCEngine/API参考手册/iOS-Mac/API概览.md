---
sync_node_id: '89644533178220544'
nav_path:
  - "RTC Engine"
  - "API 参考手册"
  - "iOS&Mac"
  - "API 概览"
product: "trtc"
---
## Create Instance And Event Callback

|FuncList|DESC|
|---------|---------|
|sharedInstance|Create TRTCCloud instance (singleton mode).|
|destroySharedInstance|Terminate TRTCCloud instance (singleton mode).|
|addDelegate:|Add TRTC event callback.|
|removeDelegate:|Remove TRTC event callback.|
|delegateQueue|Set the queue that drives the TRTCCloudDelegate event callback.|

## Room APIs

|FuncList|DESC|
|---------|---------|
|enterRoom:appScene:|Enter room.|
|exitRoom|Exit room.|
|switchRole:|Switch role.|
|switchRole:privateMapKey:|Switch role(support permission credential).|
|switchRoom:|Switch room.|
|connectOtherRoom:|Request cross-room call.|
|disconnectOtherRoom|Exit cross-room call.|
|setDefaultStreamRecvMode:video:|Set subscription mode (which must be set before room entry for it to take effect).|
|createSubCloud|Create room subinstance (for concurrent multi-room listen/watch).|
|destroySubCloud:|Terminate room subinstance.|
|updateOtherRoomForwardMode:|Change the upstream capability of the cross-room anchor in the current room.|

## CDN APIs

|FuncList|DESC|
|---------|---------|
|startPublishMediaStream:encoderParam:mixingConfig:|Publish a stream.|
|updatePublishMediaStream:publishTarget:encoderParam:mixingConfig:|Modify publishing parameters.|
|stopPublishMediaStream:|Stop publishing.|

## Video APIs

|FuncList|DESC|
|---------|---------|
|startLocalPreview:view:|Enable the preview image of local camera (mobile).|
|startLocalPreview:|Enable the preview image of local camera (desktop).|
|updateLocalView:|Update the preview image of local camera.|
|stopLocalPreview|Stop camera preview.|
|muteLocalVideo:mute:|Pause/Resume publishing local video stream.|
|setVideoMuteImage:fps:|Set placeholder image during local video pause.|
|startRemoteView:streamType:view:|Subscribe to remote user's video stream and bind video rendering control.|
|updateRemoteView:streamType:forUser:|Update remote user's video rendering control.|
|stopRemoteView:streamType:|Stop subscribing to remote user's video stream and release rendering control.|
|stopAllRemoteView|Stop subscribing to all remote users' video streams and release all rendering resources.|
|muteRemoteVideoStream:streamType:mute:|Pause/Resume subscribing to remote user's video stream.|
|muteAllRemoteVideoStreams:|Pause/Resume subscribing to all remote users' video streams.|
|setVideoEncoderParam:|Set the encoding parameters of video encoder.|
|setNetworkQosParam:|Set network quality control parameters.|
|setLocalRenderParams:|Set the rendering parameters of local video image.|
|setRemoteRenderParams:streamType:params:|Set the rendering mode of remote video image.|
|enableEncSmallVideoStream:withQuality:|Enable dual-channel encoding mode with big and small images.|
|setRemoteVideoStreamType:type:|Switch the big/small image of specified remote user.|
|snapshotVideo:type:sourceType:|Screencapture video.|
|setPerspectiveCorrectionWithUser:srcPoints:dstPoints:|Sets perspective correction coordinate points.|
|setGravitySensorAdaptiveMode:|Set the adaptation mode of gravity sensing (version 11.7 and above).|

## Audio APIs

|FuncList|DESC|
|---------|---------|
|startLocalAudio:|Enable local audio capturing and publishing.|
|stopLocalAudio|Stop local audio capturing and publishing.|
|muteLocalAudio:|Pause/Resume publishing local audio stream.|
|muteRemoteAudio:mute:|Pause/Resume playing back remote audio stream.|
|muteAllRemoteAudio:|Pause/Resume playing back all remote users' audio streams.|
|setAudioRoute:|Set audio route.|
|setRemoteAudioVolume:volume:|Set the audio playback volume of remote user.|
|setAudioCaptureVolume:|Set the capturing volume of local audio.|
|getAudioCaptureVolume|Get the capturing volume of local audio.|
|setAudioPlayoutVolume:|Set the playback volume of remote audio.|
|getAudioPlayoutVolume|Get the playback volume of remote audio.|
|enableAudioVolumeEvaluation:withParams:|Enable volume reminder.|
|startAudioRecording:|Start audio recording.|
|stopAudioRecording|Stop audio recording.|
|startLocalRecording:|Start local media recording.|
|stopLocalRecording|Stop local media recording.|
|setRemoteAudioParallelParams:|Set the parallel strategy of remote audio streams.|
|enable3DSpatialAudioEffect:|Enable 3D spatial effect.|
|updateSelf3DSpatialPosition|Update self position and orientation for 3D spatial effect.|
|updateRemote3DSpatialPosition:|Update the specified remote user's position for 3D spatial effect.|
|set3DSpatialReceivingRange:range:|Set the maximum 3D spatial attenuation range for userId's audio stream.|

## Device management APIs

|FuncList|DESC|
|---------|---------|
|getDeviceManager|Get device management class (TXDeviceManager).|

## Beauty filter and watermark APIs

|FuncList|DESC|
|---------|---------|
|getBeautyManager|Get beauty filter management class (TXBeautyManager).|
|setWatermark:streamType:rect:|Add watermark.|

## Background music and sound effect APIs

|FuncList|DESC|
|---------|---------|
|getAudioEffectManager|Get sound effect management class (TXAudioEffectManager).|
|startSystemAudioLoopback|Enable system audio capturing(iOS not supported).|
|stopSystemAudioLoopback|Stop system audio capturing(iOS not supported).|
|setSystemAudioLoopbackVolume:|Set the volume of system audio capturing.|

## Real-time Transcription Translation Interface

|FuncList|DESC|
|---------|---------|
|getAITranscriberManager|Get AI transcriber manager (AITranscriberManager).|

## Screen sharing APIs

|FuncList|DESC|
|---------|---------|
|startScreenCaptureInApp:encParam:|Start in-app screen sharing (for iOS 13.0 and above only).|
|startScreenCaptureByReplaykit:encParam:appGroup:|Start system-level screen sharing (for iOS 11.0 and above only).|
|startScreenCapture:streamType:encParam:|Start screen sharing.|
|stopScreenCapture|Stop screen sharing.|
|pauseScreenCapture|Pause screen sharing.|
|resumeScreenCapture|Resume screen sharing.|
|getScreenCaptureSourcesWithThumbnailSize:iconSize:|Enumerate shareable screens and windows (for macOS only).|
|selectScreenCaptureTarget:rect:capturesCursor:highlight:|Select the screen or window to share (for macOS only).|
|setSubStreamEncoderParam:|Set the video encoding parameters of screen sharing (i.e., substream) (for desktop and mobile systems).|
|setSubStreamMixVolume:|Set the audio mixing volume of screen sharing (for desktop systems only).|
|addExcludedShareWindow:|Add specified windows to the exclusion list of screen sharing (for desktop systems only).|
|removeExcludedShareWindow:|Remove specified windows from the exclusion list of screen sharing (for desktop systems only).|
|removeAllExcludedShareWindows|Remove all windows from the exclusion list of screen sharing (for desktop systems only).|
|addIncludedShareWindow:|Add specified windows to the inclusion list of screen sharing (for desktop systems only).|
|removeIncludedShareWindow:|Remove specified windows from the inclusion list of screen sharing (for desktop systems only).|
|removeAllIncludedShareWindows|Remove all windows from the inclusion list of screen sharing (for desktop systems only).|

## Custom capturing and rendering APIs

|FuncList|DESC|
|---------|---------|
|enableCustomVideoCapture:enable:|Enable/Disable custom video capturing mode.|
|sendCustomVideoData:frame:|Deliver captured video frames to SDK.|
|enableCustomAudioCapture:|Enable custom audio capturing mode.|
|sendCustomAudioData:|Deliver captured audio data to SDK.|
|enableMixExternalAudioFrame:playout:|Enable/Disable custom audio track.|
|mixExternalAudioFrame:|Mix custom audio track into SDK.|
|setMixExternalAudioVolume:playoutVolume:|Set the publish volume and playback volume of mixed custom audio track.|
|generateCustomPTS|Generate custom capturing timestamp.|
|setLocalVideoProcessDelegete:pixelFormat:bufferType:|Set video data callback for third-party beauty filters.|
|setLocalVideoRenderDelegate:pixelFormat:bufferType:|Set the callback of custom rendering for local video.|
|setRemoteVideoRenderDelegate:delegate:pixelFormat:bufferType:|Set the callback of custom rendering for remote video.|
|setAudioFrameDelegate:|Set custom audio data callback.|
|setCapturedAudioFrameDelegateFormat:|Set the callback format of audio frames captured by local mic.|
|setLocalProcessedAudioFrameDelegateFormat:|Set the callback format of preprocessed local audio frames.|
|setMixedPlayAudioFrameDelegateFormat:|Set the callback format of audio frames to be played back by system.|
|enableCustomAudioRendering:|Enabling custom audio playback.|
|getCustomAudioRenderingFrame:|Getting playable audio data.|

## Custom message sending APIs

|FuncList|DESC|
|---------|---------|
|sendCustomCmdMsg:data:reliable:ordered:|Use UDP channel to send custom message to all users in room.|
|sendSEIMsg:repeatCount:|Use SEI channel to send custom message to all users in room.|

## Network test APIs

|FuncList|DESC|
|---------|---------|
|startSpeedTest:|Start network speed test (used before room entry).|
|stopSpeedTest|Stop network speed test.|

## Debugging APIs

|FuncList|DESC|
|---------|---------|
|getSDKVersion|Get SDK version information.|
|setLogLevel:|Set log output level.|
|setConsoleEnabled:|Enable/Disable console log printing.|
|setLogCompressEnabled:|Enable/Disable local log compression.|
|setLogDirPath:|Set local log storage path.|
|setLogDelegate:|Set log callback.|
|showDebugView:|Display dashboard.|
|setDebugViewMargin:margin:|Set dashboard margin.|
|callExperimentalAPI:|Call experimental APIs.|

## Encrypted interface

|FuncList|DESC|
|---------|---------|
|enablePayloadPrivateEncryption:params:|Enable or disable private encryption of media streams.|

## Error and warning events

|FuncList|DESC|
|---------|---------|
|onError:errMsg:extInfo:|Error event callback.|
|onWarning:warningMsg:extInfo:|Warning event callback.|

## Room event callback

|FuncList|DESC|
|---------|---------|
|onEnterRoom:|Whether room entry is successful.|
|onExitRoom:|Room exit.|
|onSwitchRole:errMsg:|Role switching.|
|onSwitchRoom:errMsg:|Result of room switching.|
|onConnectOtherRoom:errCode:errMsg:|Result of requesting cross-room call.|
|onDisconnectOtherRoom:errMsg:|Result of ending cross-room call.|
|onUpdateOtherRoomForwardMode:errMsg:|Result of changing the upstream capability of the cross-room anchor.|

## User event callback.

|FuncList|DESC|
|---------|---------|
|onRemoteUserEnterRoom:|A user entered the room.|
|onRemoteUserLeaveRoom:reason:|A user exited the room.|
|onUserVideoAvailable:available:|A remote user published/unpublished primary stream video.|
|onUserSubStreamAvailable:available:|A remote user published/unpublished substream video.|
|onUserAudioAvailable:available:|A remote user published/unpublished audio.|
|onFirstVideoFrame:streamType:width:height:|The SDK started rendering the first video frame of the local or a remote user.|
|onFirstAudioFrame:|The SDK started playing the first audio frame of a remote user.|
|onSendFirstLocalVideoFrame:|The first local video frame was published.|
|onSendFirstLocalAudioFrame|The first local audio frame was published.|
|onRemoteVideoStatusUpdated:streamType:streamStatus:reason:extrainfo:|Change of remote video status.|
|onRemoteAudioStatusUpdated:streamStatus:reason:extrainfo:|Change of remote audio status.|
|onUserVideoSizeChanged:streamType:newWidth:newHeight:|Change of remote video size.|

## Callback of statistics on network and technical metrics.

|FuncList|DESC|
|---------|---------|
|onNetworkQuality:remoteQuality:|Real-time network quality statistics.|
|onStatistics:|Real-time statistics on technical metrics.|
|onSpeedTestResult:|Callback of network speed test.|

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
|onAudioRouteChanged:fromRoute:|The audio route changed (for mobile devices only).|
|onUserVoiceVolume:totalVolume:|Volume.|
|onDevice:type:stateChanged:|The status of a local device changed (for desktop OS only).|
|onAudioDeviceCaptureVolumeChanged:muted:|The capturing volume of the mic changed.|
|onAudioDevicePlayoutVolumeChanged:muted:|The playback volume changed.|
|onSystemAudioLoopbackError:|Whether system audio capturing is enabled successfully (for desktop OS only).|

## Callback of the receipt of a custom message.

|FuncList|DESC|
|---------|---------|
|onRecvCustomCmdMsgUserId:cmdID:seq:message:|Receipt of custom message.|
|onMissCustomCmdMsgUserId:cmdID:errCode:missed:|Loss of custom message.|
|onRecvSEIMsg:message:|Receipt of SEI message.|

## CDN event callback

|FuncList|DESC|
|---------|---------|
|onStartPublishing:errMsg:|Started publishing to Tencent Cloud CSS CDN.|
|onStopPublishing:errMsg:|Stopped publishing to Tencent Cloud CSS CDN.|
|onStartPublishCDNStream:errMsg:|Started publishing to non-Tencent Cloud’s live streaming CDN.|
|onStopPublishCDNStream:errMsg:|Stopped publishing to non-Tencent Cloud’s live streaming CDN.|
|onSetMixTranscodingConfig:errMsg:|Set the layout and transcoding parameters for On-Cloud MixTranscoding.|
|onStartPublishMediaStream:code:message:extraInfo:|Callback for starting to publish.|
|onUpdatePublishMediaStream:code:message:extraInfo:|Callback for modifying publishing parameters.|
|onStopPublishMediaStream:code:message:extraInfo:|Callback for stopping publishing.|
|onCdnStreamStateChanged:status:code:msg:extraInfo:|Callback for change of RTMP/RTMPS publishing status.|

## Screen sharing event callback

|FuncList|DESC|
|---------|---------|
|onScreenCaptureStarted|Screen sharing started.|
|onScreenCapturePaused:||
|onScreenCaptureResumed:|Screen sharing was resumed.|
|onScreenCaptureStoped:|Screen sharing stopped.|

## Callback of local recording and screenshot events

|FuncList|DESC|
|---------|---------|
|onLocalRecordBegin:storagePath:|Local recording started.|
|onLocalRecording:storagePath:|Local media is being recorded.|
|onLocalRecordFragment:|Record fragment finished.|
|onLocalRecordComplete:storagePath:|Local recording stopped.|

## Callback of debugging events

|FuncList|DESC|
|---------|---------|
|onExperimentalEvent:params:|Callback of experimental APIs.|

## Disused callbacks

|FuncList|DESC|
|---------|---------|
|onUserEnter:|An anchor entered the room (disused).|
|onUserExit:reason:|An anchor left the room (disused).|
|onAudioEffectFinished:code:|Audio effects ended (disused).|

## Callback of custom video processing

|FuncList|DESC|
|---------|---------|
|onRenderVideoFrame:userId:streamType:|Custom video rendering.|
|onGLContextCreated|An OpenGL context was created in the SDK.|
|onProcessVideoFrame:dstFrame:|Video processing by third-party beauty filters.|
|onGLContextDestory|The OpenGL context in the SDK was destroyed.|

## Callback of custom audio processing

|FuncList|DESC|
|---------|---------|
|onCapturedAudioFrame:|Audio data captured by the local mic and pre-processed by the audio module.|
|onLocalProcessedAudioFrame:|Audio data captured by the local mic, pre-processed by the audio module, effect-processed and BGM-mixed.|
|onRemoteUserAudioFrame:userId:|Audio data of each remote user before audio mixing.|
|onMixedPlayAudioFrame:|Data mixed from each channel before being submitted to the system for playback.|
|onMixedAllAudioFrame:|Data mixed from all the captured and to-be-played audio in the SDK.|
|onVoiceEarMonitorAudioFrame:|In-ear monitoring data.|

## Other event callbacks

|FuncList|DESC|
|---------|---------|
|onLog:LogLevel:WhichModule:|Printing of local log.|

## Voice effect APIs

|FuncList|DESC|
|---------|---------|
|enableVoiceEarMonitor:|Enabling in-ear monitoring.|
|setVoiceEarMonitorVolume:|Setting in-ear monitoring volume.|
|setVoiceReverbType:|Setting voice reverb effects.|
|setVoiceChangerType:|Setting voice changing effects.|
|setVoiceVolume:|Setting speech volume.|
|setVoicePitch:|Setting speech pitch.|

## Background music APIs

|FuncList|DESC|
|---------|---------|
|startPlayMusic:onStart:onProgress:onComplete:|Starting background music.|
|stopPlayMusic:|Stopping background music.|
|pausePlayMusic:|Pausing background music.|
|resumePlayMusic:|Resuming background music.|
|setAllMusicVolume:|Setting the local and remote playback volume of background music.|
|setMusicPublishVolume:volume:|Setting the remote playback volume of a specific music track.|
|setMusicPlayoutVolume:volume:|Setting the local playback volume of a specific music track.|
|setMusicPitch:pitch:|Adjusting the pitch of background music.|
|setMusicSpeedRate:speedRate:|Changing the speed of background music.|
|getMusicCurrentPosInMS:|Getting the playback progress (ms) of background music.|
|getMusicDurationInMS:|Getting the total length (ms) of background music.|
|seekMusicToPosInMS:pts:|Setting the playback progress (ms) of background music.|
|setMusicScratchSpeedRate:speedRate:|Adjust the speed change effect of the scratch disc.|
|preloadMusic:onProgress:onError:|Preload background music.|
|getMusicTrackCount:|Get the number of tracks of background music.|
|setMusicTrack:track:|Specify the playback track of background music.|

## beauty interface

|FuncList|DESC|
|---------|---------|
|setBeautyStyle:|Sets the beauty (skin smoothing) filter algorithm.|
|setBeautyLevel:|Sets the strength of the beauty filter.|
|setWhitenessLevel:|Sets the strength of the brightening filter.|
|enableSharpnessEnhancement:|Enables clarity enhancement.|
|setRuddyLevel:|Sets the strength of the rosy skin filter.|
|setFilter:|Sets color filter.|
|setFilterStrength:|Sets the strength of color filter.|
|setGreenScreenFile:|Sets green screen video.|
|setEyeScaleLevel:|Sets the strength of the eye enlarging filter.|
|setFaceSlimLevel:|Sets the strength of the face slimming filter.|
|setFaceVLevel:|Sets the strength of the chin slimming filter.|
|setChinLevel:|Sets the strength of the chin lengthening/shortening filter.|
|setFaceShortLevel:|Sets the strength of the face shortening filter.|
|setFaceNarrowLevel:|Sets the strength of the face narrowing filter.|
|setNoseSlimLevel:|Sets the strength of the nose slimming filter.|
|setEyeLightenLevel:|Sets the strength of the eye brightening filter.|
|setToothWhitenLevel:|Sets the strength of the teeth whitening filter.|
|setWrinkleRemoveLevel:|Sets the strength of the wrinkle removal filter.|
|setPounchRemoveLevel:|Sets the strength of the eye bag removal filter.|
|setSmileLinesRemoveLevel:|Sets the strength of the smile line removal filter.|
|setForeheadLevel:|Sets the strength of the hairline adjustment filter.|
|setEyeDistanceLevel:|Sets the strength of the eye distance adjustment filter.|
|setEyeAngleLevel:|Sets the strength of the eye corner adjustment filter.|
|setMouthShapeLevel:|Sets the strength of the mouth shape adjustment filter.|
|setNoseWingLevel:|Sets the strength of the nose wing narrowing filter.|
|setNosePositionLevel:|Sets the strength of the nose position adjustment filter.|
|setLipsThicknessLevel:|Sets the strength of the lip thickness adjustment filter.|
|setFaceBeautyLevel:|Sets the strength of the face shape adjustment filter.|
|setMotionTmpl:inDir:|Selects the AI animated effect pendant.|
|setMotionMute:|Sets whether to mute during animated effect playback.|

## Type definitions of audio/video devices

|FuncList|DESC|
|---------|---------|
|onDeviceChanged:type:state:|The status of a local device changed (for desktop OS only).|

## Device APIs

|FuncList|DESC|
|---------|---------|
|isFrontCamera|Querying whether the front camera is being used.|
|switchCamera:|Switching to the front/rear camera (for mobile OS).|
|isCameraZoomSupported|Querying whether the current camera supports zooming (for mobile OS).|
|getCameraZoomMaxRatio|Getting the maximum zoom ratio of the camera (for mobile OS).|
|setCameraZoomRatio:|Setting the camera zoom ratio (for mobile OS).|
|isAutoFocusEnabled|Querying whether automatic face detection is supported (for mobile OS).|
|enableCameraAutoFocus:|Enabling auto focus (for mobile OS).|
|setCameraFocusPosition:|Adjusting the focus (for mobile OS).|
|isCameraTorchSupported|Querying whether flash is supported (for mobile OS).|
|enableCameraTorch:|Enabling/Disabling flash, i.e., the torch mode (for mobile OS).|
|setAudioRoute:|Setting the audio route (for mobile OS).|
|setExposureCompensation:|Set the exposure parameters of the camera, ranging from - 1 to 1.|
|getDevicesList:|Getting the device list (for desktop OS).|
|setCurrentDevice:deviceId:|Setting the device to use (for desktop OS).|
|getCurrentDevice:|Getting the device currently in use (for desktop OS).|
|setCurrentDeviceVolume:deviceType:|Setting the volume of the current device (for desktop OS).|
|getCurrentDeviceVolume:|Getting the volume of the current device (for desktop OS).|
|setCurrentDeviceMute:deviceType:|Muting the current device (for desktop OS).|
|getCurrentDeviceMute:|Querying whether the current device is muted (for desktop OS).|
|enableFollowingDefaultAudioDevice:enable:|Set the audio device used by SDK to follow the system default device (for desktop OS).|
|startCameraDeviceTest:|Starting camera testing (for desktop OS).|
|stopCameraDeviceTest|Ending camera testing (for desktop OS).|
|startMicDeviceTest:|Starting mic testing (for desktop OS).|
|startMicDeviceTest:playback:|Starting mic testing (for desktop OS).|
|stopMicDeviceTest|Ending mic testing (for desktop OS).|
|startSpeakerDeviceTest:|Starting speaker testing (for desktop OS).|
|stopSpeakerDeviceTest|Ending speaker testing (for desktop OS).|
|setObserver:|set onDeviceChanged callback (for Mac).|
|setCameraCapturerParam:|Set camera acquisition preferences.|

## Disused APIs

|FuncList|DESC|
|---------|---------|
|setSystemVolumeType:|Setting the system volume type (for mobile OS).|
|destroySharedIntance|Terminate TRTCCloud instance (singleton mode).|
|delegate|Set TRTC event callback.|
|setBeautyStyle:beautyLevel:whitenessLevel:ruddinessLevel:|Set the strength of beauty, brightening, and rosy skin filters.|
|setEyeScaleLevel:|Set the strength of eye enlarging filter.|
|setFaceScaleLevel:|Set the strength of face slimming filter.|
|setFaceVLevel:|Set the strength of chin slimming filter.|
|setChinLevel:|Set the strength of chin lengthening/shortening filter.|
|setFaceShortLevel:|Set the strength of face shortening filter.|
|setNoseSlimLevel:|Set the strength of nose slimming filter.|
|selectMotionTmpl:|Set animated sticker.|
|setMotionMute:|Mute animated sticker.|
|setFilter:|Set color filter.|
|setFilterConcentration:|Set the strength of color filter.|
|setGreenScreenFile:|Set green screen video.|
|setReverbType:|Set reverb effect.|
|setVoiceChangerType:|Set voice changing type.|
|enableAudioEarMonitoring:|Enable or disable in-ear monitoring.|
|enableAudioVolumeEvaluation:|Enable volume reminder.|
|enableAudioVolumeEvaluation:enable_vad:|Enable volume reminder.|
|switchCamera|Switch camera.|
|isCameraZoomSupported|Query whether the current camera supports zoom.|
|setZoom:|Set camera zoom ratio (focal length).|
|isCameraTorchSupported|Query whether the device supports flash.|
|enbaleTorch:|Enable/Disable flash.|
|isCameraFocusPositionInPreviewSupported|Query whether the camera supports setting focus.|
|setFocusPosition:|Set the focal position of camera.|
|isCameraAutoFocusFaceModeSupported|Query whether the device supports the automatic recognition of face position.|
|enableAutoFaceFoucs:|Enable/Disable face auto focus.|
|setSystemVolumeType:|Setting the system volume type (for mobile OS).|
|snapshotVideo:type:|Screencapture video.|
|startScreenCaptureByReplaykit:appGroup:|Start system-level screen sharing (for iOS 11.0 and above only).|
|startLocalAudio|Set sound quality.|
|startRemoteView:view:|Start displaying remote video image.|
|stopRemoteView:|Stop displaying remote video image and pulling the video data stream of remote user.|
|setLocalViewFillMode:|Set the rendering mode of local image.|
|setLocalViewRotation:|Set the clockwise rotation angle of local image.|
|setLocalViewMirror:|Set the mirror mode of local camera's preview image.|
|setRemoteViewFillMode:mode:|Set the fill mode of substream image.|
|setRemoteViewRotation:rotation:|Set the clockwise rotation angle of remote image.|
|startRemoteSubStreamView:view:|Start displaying the substream image of remote user.|
|stopRemoteSubStreamView:|Stop displaying the substream image of remote user.|
|setRemoteSubStreamViewFillMode:mode:|Set the fill mode of substream image.|
|setRemoteSubStreamViewRotation:rotation:|Set the clockwise rotation angle of substream image.|
|setAudioQuality:|Set sound quality.|
|setPriorRemoteVideoStreamType:|Specify whether to view the big or small image.|
|setMicVolumeOnMixing:|Set mic volume.|
|playBGM:|Start background music.|
|stopBGM|Stop background music.|
|pauseBGM|Stop background music.|
|resumeBGM|Stop background music.|
|getBGMDuration:|Get the total length of background music in ms.|
|setBGMPosition:|Set background music playback progress.|
|setBGMVolume:|Set background music volume.|
|setBGMPlayoutVolume:|Set the local playback volume of background music.|
|setBGMPublishVolume:|Set the remote playback volume of background music.|
|playAudioEffect:|Play sound effect.|
|setAudioEffectVolume:volume:|Set sound effect volume.|
|stopAudioEffect:|Stop sound effect.|
|stopAllAudioEffects|Stop all sound effects.|
|setAllAudioEffectsVolume:|Set the volume of all sound effects.|
|pauseAudioEffect:|Pause sound effect.|
|resumeAudioEffect:|Pause sound effect.|
|enableCustomVideoCapture:|Enable custom video capturing mode.|
|sendCustomVideoData:|Deliver captured video data to SDK.|
|muteLocalVideo:|Pause/Resume publishing local video stream.|
|muteRemoteVideoStream:mute:|Pause/Resume subscribing to remote user's video stream.|
|startSpeedTest:userId:userSig:|Start network speed test (used before room entry).|
|startScreenCapture:|Start screen sharing.|
|getCameraDevicesList|Get the list of cameras.|
|setCurrentCameraDevice:|Set the camera to be used currently.|
|getCurrentCameraDevice|Get the currently used camera.|
|getMicDevicesList|Get the list of mics.|
|getCurrentMicDevice|Get the current mic device.|
|setCurrentMicDevice:|Select the currently used mic.|
|getCurrentMicDeviceVolume|Get the current mic volume.|
|setCurrentMicDeviceVolume:|Set the current mic volume.|
|setCurrentMicDeviceMute:|Set the mute status of the current system mic.|
|getCurrentMicDeviceMute|Get the mute status of the current system mic.|
|getSpeakerDevicesList|Get the list of speakers.|
|getCurrentSpeakerDevice|Get the currently used speaker.|
|setCurrentSpeakerDevice:|Set the speaker to use.|
|getCurrentSpeakerDeviceVolume|Get the current speaker volume.|
|setCurrentSpeakerDeviceVolume:|Set the current speaker volume.|
|getCurrentSpeakerDeviceMute|Get the mute status of the current system speaker.|
|setCurrentSpeakerDeviceMute:|Set whether to mute the current system speaker.|
|startCameraDeviceTestInView:|Start camera test.|
|stopCameraDeviceTest|Start camera test.|
|startMicDeviceTest:|Start mic test.|
|stopMicDeviceTest|Start mic test.|
|startSpeakerDeviceTest:|Start speaker test.|
|stopSpeakerDeviceTest|Stop speaker test.|
|startScreenCaptureInApp:|start in-app screen sharing (for iOS 13.0 and above only).|
|setVideoEncoderRotation:|Set the direction of image output by video encoder.|
|setVideoEncoderMirror:|Set the mirror mode of image output by encoder.|
|setGSensorMode:|Set the adaptation mode of G-sensor.|
|startPublishing:type:|Start publishing audio/video streams to Tencent Cloud CSS CDN.|
|stopPublishing|Stop publishing audio/video streams to Tencent Cloud CSS CDN.|
|startPublishCDNStream:|Start publishing audio/video streams to non-Tencent Cloud CDN.|
|stopPublishCDNStream|Stop publishing audio/video streams to non-Tencent Cloud CDN.|
|setMixTranscodingConfig:|Set the layout and transcoding parameters of On-Cloud MixTranscoding.|

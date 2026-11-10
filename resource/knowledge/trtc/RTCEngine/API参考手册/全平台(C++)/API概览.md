---
sync_node_id: '89644533297758208'
nav_path:
  - "RTC Engine"
  - "API 参考手册"
  - "全平台（C++）"
  - "API 概览"
product: "trtc"
---
## Create Instance And Event Callback

|FuncList|DESC|
|---------|---------|
|getTRTCShareInstance|Create TRTCCloud instance (singleton mode).|
|destroyTRTCShareInstance|Terminate TRTCCloud instance (singleton mode).|
|addCallback|Add TRTC event callback.|
|removeCallback|Remove TRTC event callback.|

## Room APIs

|FuncList|DESC|
|---------|---------|
|enterRoom|Enter room.|
|exitRoom|Exit room.|
|switchRole|Switch role.|
|switchRoom|Switch room.|
|connectOtherRoom|Request cross-room call.|
|disconnectOtherRoom|Exit cross-room call.|
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
|enableSmallVideoStream|Enable dual-channel encoding mode with big and small images.|
|setRemoteVideoStreamType|Switch the big/small image of specified remote user.|
|snapshotVideo|Screencapture video.|
|setGravitySensorAdaptiveMode|Set the adaptation mode of gravity sensing (version 11.7 and above).|

## Audio APIs

|FuncList|DESC|
|---------|---------|
|startLocalAudio|Enable local audio capturing and publishing.|
|stopLocalAudio|Stop local audio capturing and publishing.|
|muteLocalAudio|Pause/Resume publishing local audio stream.|
|muteRemoteAudio|Pause/Resume playing back remote audio stream.|
|muteAllRemoteAudio|Pause/Resume playing back all remote users' audio streams.|
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
|setWaterMark|Add watermark.|

## Background music and sound effect APIs

|FuncList|DESC|
|---------|---------|
|getAudioEffectManager|Get sound effect management class (TXAudioEffectManager).|
|startSystemAudioLoopback|Enable system audio capturing(iOS not supported).|
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
|getScreenCaptureSources|Enumerate shareable screens and windows (for desktop systems only).|
|selectScreenCaptureTarget|Select the screen or window to share (for desktop systems only).|
|setSubStreamEncoderParam|Set the video encoding parameters of screen sharing (i.e., substream) (for desktop and mobile systems).|
|setSubStreamMixVolume|Set the audio mixing volume of screen sharing (for desktop systems only).|
|addExcludedShareWindow|Add specified windows to the exclusion list of screen sharing (for desktop systems only).|
|removeExcludedShareWindow|Remove specified windows from the exclusion list of screen sharing (for desktop systems only).|
|removeAllExcludedShareWindow|Remove all windows from the exclusion list of screen sharing (for desktop systems only).|
|addIncludedShareWindow|Add specified windows to the inclusion list of screen sharing (for desktop systems only).|
|removeIncludedShareWindow|Remove specified windows from the inclusion list of screen sharing (for desktop systems only).|
|removeAllIncludedShareWindow|Remove all windows from the inclusion list of screen sharing (for desktop systems only).|

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
|enableLocalVideoCustomProcess|.1 Enable third-party beauty filters in video.|
|setLocalVideoCustomProcessCallback|.2 Set video data callback for third-party beauty filters.|
|setLocalVideoRenderCallback|Set the callback of custom rendering for local video.|
|setRemoteVideoRenderCallback|Set the callback of custom rendering for remote video.|
|setAudioFrameCallback|Set custom audio data callback.|
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
|setLogCallback|Set log callback.|
|showDebugView|Display dashboard.|
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
|onDisconnectOtherRoom|Result of ending cross-room call.|
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
|onDeviceChange|The status of a local device changed (for desktop OS only).|
|onAudioDeviceCaptureVolumeChanged|The capturing volume of the mic changed.|
|onAudioDevicePlayoutVolumeChanged|The playback volume changed.|
|onSystemAudioLoopbackError|Whether system audio capturing is enabled successfully (for desktop OS only).|
|onTestMicVolume|Volume during mic test.|
|onTestSpeakerVolume|Volume during speaker test.|

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
|onScreenCapturePaused||
|onScreenCaptureResumed|Screen sharing was resumed.|
|onScreenCaptureStoped|Screen sharing stopped.|
|onScreenCaptureCovered|The shared window was covered (for Windows only).|

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
|onPlayBGMBegin|Started playing background music (disused).|
|onPlayBGMProgress|Playback progress of background music (disused).|
|onPlayBGMComplete|Background music stopped (disused).|
|onSpeedTest|Result of server speed testing (disused).|

## Callback of custom video processing

|FuncList|DESC|
|---------|---------|
|onRenderVideoFrame|Custom video rendering.|
|onGLContextCreated|An OpenGL context was created in the SDK.|
|onProcessVideoFrame|Video processing by third-party beauty filters.|
|onGLContextDestroy|The OpenGL context in the SDK was destroyed.|

## Callback of custom audio processing

|FuncList|DESC|
|---------|---------|
|onCapturedAudioFrame|Audio data captured by the local mic and pre-processed by the audio module.|
|onLocalProcessedAudioFrame|Audio data captured by the local mic, pre-processed by the audio module, effect-processed and BGM-mixed.|
|onPlayAudioFrame|Audio data of each remote user before audio mixing.|
|onMixedPlayAudioFrame|Data mixed from each channel before being submitted to the system for playback.|
|onMixedAllAudioFrame|Data mixed from all the captured and to-be-played audio in the SDK.|

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
|seekMusicToPosInTime|Setting the playback progress (ms) of background music.|
|setMusicScratchSpeedRate|Adjust the speed change effect of the scratch disc.|
|setPreloadObserver|Setting music preload callback.|
|preloadMusic|Preload background music.|
|getMusicTrackCount|Get the number of tracks of background music.|
|setMusicTrack|Specify the playback track of background music.|

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
|getDevicesList|Getting the device list (for desktop OS).|
|setCurrentDevice|Setting the device to use (for desktop OS).|
|getCurrentDevice|Getting the device currently in use (for desktop OS).|
|setCurrentDeviceVolume|Setting the volume of the current device (for desktop OS).|
|getCurrentDeviceVolume|Getting the volume of the current device (for desktop OS).|
|setCurrentDeviceMute|Muting the current device (for desktop OS).|
|getCurrentDeviceMute|Querying whether the current device is muted (for desktop OS).|
|enableFollowingDefaultAudioDevice|Set the audio device used by SDK to follow the system default device (for desktop OS).|
|startCameraDeviceTest|Starting camera testing (for desktop OS).|
|stopCameraDeviceTest|Ending camera testing (for desktop OS).|
|startMicDeviceTest|Starting mic testing (for desktop OS).|
|stopMicDeviceTest|Ending mic testing (for desktop OS).|
|startSpeakerDeviceTest|Starting speaker testing (for desktop OS).|
|stopSpeakerDeviceTest|Ending speaker testing (for desktop OS).|
|setApplicationPlayVolume|Setting the volume of the current process in the volume mixer (for Windows).|
|getApplicationPlayVolume|Getting the volume of the current process in the volume mixer (for Windows).|
|setApplicationMuteState|Muting the current process in the volume mixer (for Windows).|
|getApplicationMuteState|Querying whether the current process is muted in the volume mixer (for Windows).|
|setCameraCapturerParam|Set camera acquisition preferences.|
|setDeviceObserver|set onDeviceChanged callback.|

## Disused APIs

|FuncList|DESC|
|---------|---------|
|setSystemVolumeType|Setting the system volume type (for mobile OS).|
|setBeautyStyle|Set the strength of beauty, brightening, and rosy skin filters.|
|enableAudioVolumeEvaluation|Enable volume reminder.|
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
|setLocalVideoProcessCallback|Set video data callback for third-party beauty filters.|
|getCameraDevicesList|Get the list of cameras.|
|setCurrentCameraDevice|Set the camera to be used currently.|
|getCurrentCameraDevice|Get the currently used camera.|
|getMicDevicesList|Get the list of mics.|
|getCurrentMicDevice|Get the current mic device.|
|setCurrentMicDevice|Select the currently used mic.|
|getCurrentMicDeviceVolume|Get the current mic volume.|
|setCurrentMicDeviceVolume|Set the current mic volume.|
|setCurrentMicDeviceMute|Set the mute status of the current system mic.|
|getCurrentMicDeviceMute|Get the mute status of the current system mic.|
|getSpeakerDevicesList|Get the list of speakers.|
|getCurrentSpeakerDevice|Get the currently used speaker.|
|setCurrentSpeakerDevice|Set the speaker to use.|
|getCurrentSpeakerVolume|Get the current speaker volume.|
|setCurrentSpeakerVolume|Set the current speaker volume.|
|getCurrentSpeakerDeviceMute|Get the mute status of the current system speaker.|
|setCurrentSpeakerDeviceMute|Set whether to mute the current system speaker.|
|startCameraDeviceTest|Start camera test.|
|stopCameraDeviceTest|Start camera test.|
|startMicDeviceTest|Start mic test.|
|stopMicDeviceTest|Start mic test.|
|startSpeakerDeviceTest|Start speaker test.|
|stopSpeakerDeviceTest|Stop speaker test.|
|selectScreenCaptureTarget|start in-app screen sharing (for iOS 13.0 and above only).|
|setVideoEncoderRotation|Set the direction of image output by video encoder.|
|setVideoEncoderMirror|Set the mirror mode of image output by encoder.|
|startPublishing|Start publishing audio/video streams to Tencent Cloud CSS CDN.|
|stopPublishing|Stop publishing audio/video streams to Tencent Cloud CSS CDN.|
|startPublishCDNStream|Start publishing audio/video streams to non-Tencent Cloud CDN.|
|stopPublishCDNStream|Stop publishing audio/video streams to non-Tencent Cloud CDN.|
|setMixTranscodingConfig|Set the layout and transcoding parameters of On-Cloud MixTranscoding.|

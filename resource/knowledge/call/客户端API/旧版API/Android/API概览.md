---
sync_node_id: '95824686931853312'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "旧版 API"
  - "Android"
  - "API 概览"
product: "call"
---
## TUICallKit (UI Included)

TUICallKit is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat.

|API|Description|
|---------|---------|
|[createInstance](https://www.tencentcloud.com/document/product/647/51005#createinstance)|Create a TUICallKit instance (singleton mode).|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51005#setselfinfo)|Set user's avatar and nickname.|
|[calls](https://www.tencentcloud.com/document/product/647/51005#calls)|Initiate a one-to-one or multi-person call.|
|[join](https://www.tencentcloud.com/document/product/647/51005#join)|Proactively join a call.|
|[setCallingBell](https://www.tencentcloud.com/document/product/647/51005#setcallingbell)|Set the ringtone.|
|[enableMuteMode](https://www.tencentcloud.com/document/product/647/51005#enablemutemode)|Set whether to turn on the mute mode.|
|[enableFloatWindow](https://www.tencentcloud.com/document/product/647/51005#enablefloatwindow)|Set whether to enable floating windows.|
|[enableIncomingBanner](https://www.tencentcloud.com/document/product/647/51005#enableIncomingBanner)|Sets whether to display incoming banner.|
|disableControlButton|Hide the specified button.|

## TUICallEngine (No UI)

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.

|API|Description|
|---------|---------|
|[createInstance](https://www.tencentcloud.com/document/product/647/51006#createInstance)|Create a `TUICallEngine` instance (singleton).|
|[destroyInstance](https://www.tencentcloud.com/document/product/647/51006#destroyInstance)|Destroy `TUICallEngine` instance (singleton).|
|[init](https://www.tencentcloud.com/document/product/647/51006#init)|Authenticates the basic audio/video call capabilities.|
|[addObserver](https://www.tencentcloud.com/document/product/647/51006#addObserver)|Add listener.|
|[removeObserver](https://www.tencentcloud.com/document/product/647/51006#removeObserver)|Remove listener.|
|[calls](https://www.tencentcloud.com/document/product/647/51006#calls)|Initiate a one-to-one or multi-person call.|
|[join](https://www.tencentcloud.com/document/product/647/51006#join)|Proactively join a call.|
|[accept](https://www.tencentcloud.com/document/product/647/51006#accept)|Accept call.|
|[reject](https://www.tencentcloud.com/document/product/647/51006#reject)|Reject call.|
|[hangup](https://www.tencentcloud.com/document/product/647/51006#hangup)|Hang up call.|
|[ignore](https://www.tencentcloud.com/document/product/647/51006#ignore)|Ignore call.|
|[inviteUser](https://www.tencentcloud.com/document/product/647/51006#inviteUser)|Invite users to the current group call.|
|[switchCallMediaType](https://www.tencentcloud.com/document/product/647/51006#switchCallMediaType)|Switch the call media type, such as from video call to audio call.|
|[startRemoteView](https://www.tencentcloud.com/document/product/647/51006#startRemoteView)|Subscribes to the video stream of a remote user.|
|[stopRemoteView](https://www.tencentcloud.com/document/product/647/51006#stopRemoteView)|Unsubscribes from the video stream of a remote user.|
|[openCamera](https://www.tencentcloud.com/document/product/647/51006#openCamera)|Turns the camera on.|
|[closeCamera](https://www.tencentcloud.com/document/product/647/51006#closeCamera)|Turns the camera off.|
|[switchCamera](https://www.tencentcloud.com/document/product/647/51006#switchCamera)|Switches the camera.|
|[openMicrophone](https://www.tencentcloud.com/document/product/647/51006#openMicrophone)|Enables the mic.|
|[closeMicrophone](https://www.tencentcloud.com/document/product/647/51006#openMicrophone)|Disables the mic.|
|[selectAudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/51006#selectAudioPlaybackDevice)|Selects the audio playback device (Earpiece/Speakerphone).|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51006#setSelfInfo)|Set user's avatar and nickname.|
|[enableMultiDeviceAbility](https://www.tencentcloud.com/document/product/647/51006#enableMultiDeviceAbility)|Sets whether to enable multi-device login for `TUICallEngine` (supported by the [Group Call package](https://trtc.io/document/54632)).|
|[setVideoRenderParams](https://www.tencentcloud.com/document/product/647/51006#setVideoRenderParams)|Set the rendering mode of video.|
|[setVideoEncoderParams](https://www.tencentcloud.com/document/product/647/51006#setVideoEncoderParams)|Set the encoding parameters of video encoder.|
|[getTRTCCloudInstance](https://www.tencentcloud.com/document/product/647/51006#getTRTCCloudInstance)|Advanced features.|
|[setBeautyLevel](https://www.tencentcloud.com/document/product/647/51006#setBeautyLevel)|Set beauty level, support turning off default beauty.|

## TUICallObserver

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

|API|Description|
|---------|---------|
|[onError](https://www.tencentcloud.com/document/product/647/51007#onError)|An error occurred during the call.|
|[onCallReceived](https://www.tencentcloud.com/document/product/647/51007#onCallReceived)|A call was received.|
|[onCallCancelled](https://www.tencentcloud.com/document/product/647/51007#onCallCancelled)|The call was canceled.|
|[onCallBegin](https://www.tencentcloud.com/document/product/647/51007#onCallBegin)|The call was connected.|
|[onCallEnd](https://www.tencentcloud.com/document/product/647/51007#onCallEnd)|The call ended.|
|[onCallMediaTypeChanged](https://www.tencentcloud.com/document/product/647/51007#onCallMediaTypeChanged)|The call type changed.|
|[onUserReject](https://www.tencentcloud.com/document/product/647/51007#onUserReject)|A user declined the call.|
|[onUserNoResponse](https://www.tencentcloud.com/document/product/647/51007#onUserNoResponse)|A user didn't respond.|
|[onUserLineBusy](https://www.tencentcloud.com/document/product/647/51007#onUserLineBusy)|A user was busy.|
|[onUserJoin](https://www.tencentcloud.com/document/product/647/51007#onUserJoin)|A user joined the call.|
|[onUserLeave](https://www.tencentcloud.com/document/product/647/51007#onUserLeave)|A user left the call.|
|[onUserVideoAvailable](https://www.tencentcloud.com/document/product/647/51007#onUserVideoAvailable)|Whether a user has a video stream.|
|[onUserAudioAvailable](https://www.tencentcloud.com/document/product/647/51007#onUserAudioAvailable)|Whether a user has an audio stream.|
|[onUserVoiceVolumeChanged](https://www.tencentcloud.com/document/product/647/51007#onUserVoiceVolumeChanged)|The volume levels of all users.|
|[onUserNetworkQualityChanged](https://www.tencentcloud.com/document/product/647/51007#onUserNetworkQualityChanged)|The network quality of all users.|
|[onKickedOffline](https://www.tencentcloud.com/document/product/647/51007#onKickedOffline)|The current user was kicked offline.|
|[onUserSigExpired](https://www.tencentcloud.com/document/product/647/51007#onUserSigExpired)|The user sig is expired.|

## Definitions of Key Types

|API|Description|
|---------|---------|
|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|Call media type, Enumeration type: Unknown, Video, and Audio.|
|[TUICallDefine.Role](https://www.tencentcloud.com/document/product/647/54900#Role)|Call role, Enumeration type: None, Caller, and Called.|
|[TUICallDefine.Status](https://www.tencentcloud.com/document/product/647/54900#Status)|Call status, Enumeration type: None, Waiting, and Accept.|
|[TUICommonDefine.RoomId](https://www.tencentcloud.com/document/product/647/54900#RoomId)|The room ID, which can be a number or string.|
|[TUICommonDefine.Camera](https://www.tencentcloud.com/document/product/647/54900#Camera)|The camera type. Enumeration type: Front camera and Back camera.|
|[TUICommonDefine.AudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/54900#AudioPlaybackDevice)|The audio playback device type. Enumeration type: Earpiece and Speakerphone.|
|[TUICommonDefine.NetworkQualityInfo](https://www.tencentcloud.com/document/product/647/54900#NetworkQualityInfo)|The current network quality.|

---
sync_node_id: '95824976745676800'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "旧版 API"
  - "iOS"
  - "API 概览"
product: "call"
---
## TUICallKit (UI Included)

TUICallKit is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat.

|API|Description|
|---------|---------|
|[createInstance](https://www.tencentcloud.com/document/product/647/51011#createInstance)|Create a TUICallKit instance (singleton mode).|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51011#setSelfInfo)|Set the user's profile picture and nickname.|
|[calls](https://www.tencentcloud.com/document/product/647/51011#calls)|Initiate a one-to-one or multi-person call|
|[join](https://www.tencentcloud.com/document/product/647/51011#join)|Proactively join a call|
|[setCallingBell](https://www.tencentcloud.com/document/product/647/51011#setCallingBell)|Set the ringtone.|
|[enableMuteMode](https://www.tencentcloud.com/document/product/647/51011#enableMuteMode)|Set whether to turn on the mute mode.|
|[enableFloatWindow](https://www.tencentcloud.com/document/product/647/51011#enableFloatWindow)|Set whether to enable floating windows.|
|[enableIncomingBanner](https://www.tencentcloud.com/document/product/647/51011#enableIncomingBanner)|Set whether to display incoming banner.|

## TUICallEngine (No UI)

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.

|API|Description|
|---------|---------|
|[createInstance](https://www.tencentcloud.com/document/product/647/51012#createInstance)|Create a TUICallEngine instance (singleton).|
|[destroyInstance](https://www.tencentcloud.com/document/product/647/51012#destroyInstance)|Destroy TUICallEngine instance (singleton).|
|[init](https://www.tencentcloud.com/document/product/647/51012#init)|Authenticates the basic audio/video call capabilities.|
|[addObserver](https://www.tencentcloud.com/document/product/647/51012#addObserver)|Add listener.|
|[removeObserver](https://www.tencentcloud.com/document/product/647/51012#removeObserver)|Remove listener.|
|[calls](https://www.tencentcloud.com/document/product/647/51012#calls)|Initiate a one-to-one or multi-person call|
|[join](https://www.tencentcloud.com/document/product/647/51012#join)|Proactively join a call|
|[accept](https://www.tencentcloud.com/document/product/647/51012#accept)|Accept call.|
|[reject](https://www.tencentcloud.com/document/product/647/51012#reject)|Reject call.|
|[hangup](https://www.tencentcloud.com/document/product/647/51012#hangup)|Hang up call.|
|[ignore](https://www.tencentcloud.com/document/product/647/51012#hangup)|Ignore call.|
|[inviteUser](https://www.tencentcloud.com/document/product/647/51012#inviteUser)|Invite users to the current call.|
|[switchCallMediaType](https://www.tencentcloud.com/document/product/647/51012#switchCallMediaType)|Switch the call media type, such as from video call to audio call.|
|[startRemoteView](https://www.tencentcloud.com/document/product/647/51012#startRemoteView)|Subscribe to the video stream of a remote user.|
|[stopRemoteView](https://www.tencentcloud.com/document/product/647/51012#stopRemoteView)|Unsubscribe from the video stream of a remote user.|
|[openCamera](https://www.tencentcloud.com/document/product/647/51012#openCamera)|Turn on the camera.|
|[closeCamera](https://www.tencentcloud.com/document/product/647/51012#closeCamera)|Turn off the camera.|
|[switchCamera](https://www.tencentcloud.com/document/product/647/51012#switchCamera)|Switch camera.|
|[openMicrophone](https://www.tencentcloud.com/document/product/647/51012#openMicrophone)|Enable microphone.|
|[closeMicrophone](https://www.tencentcloud.com/document/product/647/51012#closeMicrophone)|Disable the microphone.|
|[selectAudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/51012#selectAudioPlaybackDevice)|Select the audio playback device (Earpiece/Speakerphone).|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51012#setSelfInfo)|Set the user's profile picture and nickname.|
|[enableMultiDeviceAbility](https://www.tencentcloud.com/document/product/647/51012#enableMultiDeviceAbility)|Sets whether to enable multi-device login for TUICallEngine (supported by the [Group Call package](https://trtc.io/document/54632)).|
|[setVideoRenderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoRenderParams)|Set the rendering mode of video.|
|[setVideoEncoderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoEncoderParams)|Set the encoding parameters of video encoder.|
|[getTRTCCloudInstance](https://www.tencentcloud.com/document/product/647/51012#getTRTCCloudInstance)|Advanced features.|
|[setBeautyLevel](https://www.tencentcloud.com/document/product/647/51012#setBeautyLevel)|Set beauty level, support turning off default beauty.|

### TUICallObserver

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

|API|Description|
|---------|---------|
|[onError](https://www.tencentcloud.com/document/product/647/51013#onError)|An error occurred during the call.|
|[onCallReceived](https://www.tencentcloud.com/document/product/647/51013#onCallReceived)|A call was received.|
|[onCallCancelled](https://www.tencentcloud.com/document/product/647/51013#onCallCancelled)|The call was canceled.|
|[onCallBegin](https://www.tencentcloud.com/document/product/647/51013#onCallBegin)|The call was connected.|
|[onCallEnd](https://www.tencentcloud.com/document/product/647/51013#onCallEnd)|The call ended.|
|[onCallMediaTypeChanged](https://www.tencentcloud.com/document/product/647/51013#onCallMediaTypeChanged)|The call type changed.|
|[onUserReject](https://www.tencentcloud.com/document/product/647/51013#onUserReject)|A user declined the call.|
|[onUserNoResponse](https://www.tencentcloud.com/document/product/647/51013#onUserNoResponse)|A user didn't respond.|
|[onUserLineBusy](https://www.tencentcloud.com/document/product/647/51013#onUserLineBusy)|A user was busy.|
|[onUserJoin](https://www.tencentcloud.com/document/product/647/51013#onUserJoin)|A user joined the call.|
|[onUserLeave](https://www.tencentcloud.com/document/product/647/51013#onUserLeave)|A user left the call.|
|[onUserVideoAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserVideoAvailable)|Whether a user has a video stream.|
|[onUserAudioAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserAudioAvailable)|Whether a user has an audio stream.|
|[onUserVoiceVolumeChanged](https://www.tencentcloud.com/document/product/647/51013#onUserVoiceVolumeChanged)|The volume levels of all users.|
|[onUserNetworkQualityChanged](https://www.tencentcloud.com/document/product/647/51013#onUserNetworkQualityChanged)|The network quality of all users.|
|[onKickedOffline](https://www.tencentcloud.com/document/product/647/51013#onKickedOffline)|The current user was kicked offline.|
|[onUserSigExpired](https://www.tencentcloud.com/document/product/647/51013#onUserSigExpired)|The user sig is expired.|

## Definitions of Key Type

|API|Description|
|---------|---------|
|TUICallMediaType|Call media type, Enumeration type: Unknown, Video, and Audio.|
|TUICallRole|Call role, Enumeration type: None, Call, and Called.|
|TUICallStatus|Call status, Enumeration type: None, Waiting, and Accept.|
|TUIRoomId|The room ID, which can be a number or string.|
|TUICallCamera|The camera type. Enumeration type: Front camera and Back camera.|
|TUIAudioPlaybackDevice|The audio playback device type. Enumeration type: Earpiece and Speakerphone.|
|TUINetworkQualityInfo|The current network quality.|

---
sync_node_id: '162412491425603584'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "React Native"
  - "API 概览"
product: "call"
---
## TUICallKit (including UI Interface)

## TUICallKit APIs

UICallKit API, you can quickly implement a WeChat-like audio and video call scenario through simple interfaces.
| API | Description |
| --- | --- |
| login | Login. |
| logout | Logout. |
| calls | Initiate a one-to-one or multi-person call. |
| call | To make a one-on-one call, supports custom room ID, call timeout, offline push content, and more. |
| groupCall | To make a group call, supports custom room ID, call timeout, offline push content, and more. |
| joinInGroupCall | Join a group call. |
| setCallingBell | Customize user's ringtone. |
| enableMuteMode | Enable/Disable Ringtone. |
| enableVirtualBackground | Enable/disable blurry background feature. |
| setScreenOrientation | Set Screen Orientation. |
| on | Listen to TUICallKit events. |
| off | Cancel listening to TUICallKit events. |

## TUICallEvent

TUICallEvent is the callback event class corresponding to TUICallKit. Through this callback, you can listen to the callback events you are interested in.
| Event | Description |
| --- | --- |
| TUICallEvent.onError | Error Callback during Call. |
| TUICallEvent.onCallReceived | Callback for a Call Request. |
| TUICallEvent.onCallCancelled | Callback for Call Cancellation. |
| TUICallEvent.onCallBegin | Callback for Call Connection. |
| TUICallEvent.onCallEnd | Callback for Call Termination. |
| TUICallEvent.onUserReject | xxxx User declines the call Callback. |
| TUICallEvent.onUserNoResponse | xxxx User Non-response Callback. |
| TUICallEvent.onUserLineBusy | xxxx User Busy Line Callback. |
| TUICallEvent.onUserJoin | xxxx User Joins Call Callback. |
| TUICallEvent.onUserLeave | A user left the call. |
| TUICallEvent.onCallMediaTypeChanged | Callback for a change in the Call's Media Type. |
| TUICallEvent.onKickedOffline | Current user kicked offline. |
| TUICallEvent.onUserSigExpired | Ticket expired while online. |
| TUICallEvent.onUserVideoAvailable | Whether a user has a video stream. |
| TUICallEvent.onUserAudioAvailable | Whether a user has an audio stream. |
| TUICallEvent.onUserVoiceVolumeChanged | The volume levels of all users. |
| TUICallEvent.onUserNetworkQualityChanged | The network quality of all users. |

## TUICallEngine (No UI)

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.
| API | Description |
| --- | --- |
| createInstance | Creates a <code>TUICallEngine</code> instance (singleton mode). |
| destroyInstance | Terminates a <code>TUICallEngine</code> instance (singleton mode). |
| login | Authenticates the basic audio/video call capabilities. |
| on | Registers an event listener. |
| off | Unregisters an event listener. |
| call | Makes a one-to-one call. |
| accept | Accepts a call. |
| reject | Rejects a call. |
| ignore | Ignores a call. |
| hangup | Ends a call. |
| switchCallMediaType | Changes the call type, for example, from video call to audio call. |
| startRemoteView | Subscribes to the video stream of a remote user. |
| stopRemoteView | Unsubscribes from the video stream of a remote user. |
| openCamera | Turns the camera on. |
| switchCamera | Switches between the front and rear cameras. |
| closeCamera | Turns the camera off. |
| openMicrophone | Turns the mic on. |
| closeMicrophone | Turns the mic off. |
| selectAudioPlaybackDevice | Selects the audio playback device (receiver or speaker). |
| setVideoRenderParams | Set the rendering mode of video image. |
| setVideoEncoderParams | Set the encoding parameters of video encoder. |
| setBeautyLevel | Set beauty level, support turning off default beauty. |
| setSelfInfo | Sets the alias and profile photo. |
| enableMultiDeviceAbility | Sets whether to enable multi-device login for <code>TUICallEngine</code> . |

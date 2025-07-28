## TUICallKit (UI Included)

TUICallKit is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat.
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[createInstance](https://www.tencentcloud.com/document/product/647/51011#createInstance)</td>

<td rowspan="1" colSpan="1" >Create a TUICallKit instance (singleton mode).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://www.tencentcloud.com/document/product/647/51011#setSelfInfo)</td>

<td rowspan="1" colSpan="1" >Set the user's profile picture and nickname.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://www.tencentcloud.com/document/product/647/51011#calls)</td>

<td rowspan="1" colSpan="1" >Initiate a one-to-one or multi-person call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://www.tencentcloud.com/document/product/647/51011#join)</td>

<td rowspan="1" colSpan="1" >Proactively join a call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://www.tencentcloud.com/document/product/647/51011#setCallingBell)</td>

<td rowspan="1" colSpan="1" >Set the ringtone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://www.tencentcloud.com/document/product/647/51011#enableMuteMode)</td>

<td rowspan="1" colSpan="1" >Set whether to turn on the mute mode.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://www.tencentcloud.com/document/product/647/51011#enableFloatWindow)</td>

<td rowspan="1" colSpan="1" >Set whether to enable floating windows.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableIncomingBanner](https://www.tencentcloud.com/document/product/647/51011#enableIncomingBanner)</td>

<td rowspan="1" colSpan="1" >Set whether to display incoming banner.</td>
</tr>
</table>


## TUICallEngine (No UI)

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[createInstance](https://www.tencentcloud.com/document/product/647/51012#createInstance)</td>

<td rowspan="1" colSpan="1" >Create a TUICallEngine instance (singleton).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[destroyInstance](https://www.tencentcloud.com/document/product/647/51012#destroyInstance)</td>

<td rowspan="1" colSpan="1" >Destroy TUICallEngine instance (singleton).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[Init](https://www.tencentcloud.com/document/product/647/51012#Init)</td>

<td rowspan="1" colSpan="1" >Authenticates the basic audio/video call capabilities.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[addObserver](https://www.tencentcloud.com/document/product/647/51012#addObserver)</td>

<td rowspan="1" colSpan="1" >Add listener.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[removeObserver](https://www.tencentcloud.com/document/product/647/51012#removeObserver)</td>

<td rowspan="1" colSpan="1" >Remove listener.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://www.tencentcloud.com/document/product/647/51012#calls)</td>

<td rowspan="1" colSpan="1" >Initiate a one-to-one or multi-person call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://www.tencentcloud.com/document/product/647/51012#join)</td>

<td rowspan="1" colSpan="1" >Proactively join a call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[accept](https://www.tencentcloud.com/document/product/647/51012#accept)</td>

<td rowspan="1" colSpan="1" >Accept call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[reject](https://www.tencentcloud.com/document/product/647/51012#reject)</td>

<td rowspan="1" colSpan="1" >Reject call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[hangup](https://www.tencentcloud.com/document/product/647/51012#hangup)</td>

<td rowspan="1" colSpan="1" >Hang up call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[ignore](https://www.tencentcloud.com/document/product/647/51012#hangup)</td>

<td rowspan="1" colSpan="1" >Ignore call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[inviteUser](https://www.tencentcloud.com/document/product/647/51012#inviteUser)</td>

<td rowspan="1" colSpan="1" >Invite users to the current call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[switchCallMediaType](https://www.tencentcloud.com/document/product/647/51012#switchCallMediaType)</td>

<td rowspan="1" colSpan="1" >Switch the call media type, such as from video call to audio call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[startRemoteView](https://www.tencentcloud.com/document/product/647/51012#startRemoteView)</td>

<td rowspan="1" colSpan="1" >Subscribe to the video stream of a remote user.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[stopRemoteView](https://www.tencentcloud.com/document/product/647/51012#stopRemoteView)</td>

<td rowspan="1" colSpan="1" >Unsubscribe from the video stream of a remote user.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[openCamera](https://www.tencentcloud.com/document/product/647/51012#openCamera)</td>

<td rowspan="1" colSpan="1" >Turn on the camera.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[closeCamera](https://www.tencentcloud.com/document/product/647/51012#closeCamera)</td>

<td rowspan="1" colSpan="1" >Turn off the camera.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[switchCamera](https://www.tencentcloud.com/document/product/647/51012#switchCamera)</td>

<td rowspan="1" colSpan="1" >Switch camera.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[openMicrophone](https://www.tencentcloud.com/document/product/647/51012#openMicrophone)</td>

<td rowspan="1" colSpan="1" >Enable microphone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[closeMicrophone](https://www.tencentcloud.com/document/product/647/51012#closeMicrophone)</td>

<td rowspan="1" colSpan="1" >Disable the microphone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[selectAudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/51012#selectAudioPlaybackDevice)</td>

<td rowspan="1" colSpan="1" >Select the audio playback device (Earpiece/Speakerphone).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://www.tencentcloud.com/document/product/647/51012#setSelfInfo)</td>

<td rowspan="1" colSpan="1" >Set the user's profile picture and nickname.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMultiDeviceAbility](https://www.tencentcloud.com/document/product/647/51012#enableMultiDeviceAbility)</td>

<td rowspan="1" colSpan="1" >Sets whether to enable multi-device login for TUICallEngine (supported by the [Group Call package](https://trtc.io/document/54632?platform=ios&product=call&menulabel=web)).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setVideoRenderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoRenderParams)</td>

<td rowspan="1" colSpan="1" >Set the rendering mode of video.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setVideoEncoderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoEncoderParams)</td>

<td rowspan="1" colSpan="1" >Set the encoding parameters of video encoder.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[getTRTCCloudInstance](https://www.tencentcloud.com/document/product/647/51012#getTRTCCloudInstance)</td>

<td rowspan="1" colSpan="1" >Advanced features.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setBeautyLevel](https://www.tencentcloud.com/document/product/647/51012#setBeautyLevel)</td>

<td rowspan="1" colSpan="1" >Set beauty level, support turning off default beauty.</td>
</tr>
</table>


### TUICallObserver

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onError](https://www.tencentcloud.com/document/product/647/51013#onError)</td>

<td rowspan="1" colSpan="1" >An error occurred during the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallReceived](https://www.tencentcloud.com/document/product/647/51013#onCallReceived)</td>

<td rowspan="1" colSpan="1" >A call was received.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallCancelled](https://www.tencentcloud.com/document/product/647/51013#onCallCancelled)</td>

<td rowspan="1" colSpan="1" >The call was canceled.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallBegin](https://www.tencentcloud.com/document/product/647/51013#onCallBegin)</td>

<td rowspan="1" colSpan="1" >The call was connected.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://www.tencentcloud.com/document/product/647/51013#onCallEnd)</td>

<td rowspan="1" colSpan="1" >The call ended.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallMediaTypeChanged](https://www.tencentcloud.com/document/product/647/51013#onCallMediaTypeChanged)</td>

<td rowspan="1" colSpan="1" >The call type changed.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserReject](https://www.tencentcloud.com/document/product/647/51013#onUserReject)</td>

<td rowspan="1" colSpan="1" >A user declined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNoResponse](https://www.tencentcloud.com/document/product/647/51013#onUserNoResponse)</td>

<td rowspan="1" colSpan="1" >A user didn't respond.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLineBusy](https://www.tencentcloud.com/document/product/647/51013#onUserLineBusy)</td>

<td rowspan="1" colSpan="1" >A user was busy.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserJoin](https://www.tencentcloud.com/document/product/647/51013#onUserJoin)</td>

<td rowspan="1" colSpan="1" >A user joined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLeave](https://www.tencentcloud.com/document/product/647/51013#onUserLeave)</td>

<td rowspan="1" colSpan="1" >A user left the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVideoAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserVideoAvailable)</td>

<td rowspan="1" colSpan="1" >Whether a user has a video stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserAudioAvailable)</td>

<td rowspan="1" colSpan="1" >Whether a user has an audio stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVoiceVolumeChanged](https://www.tencentcloud.com/document/product/647/51013#onUserVoiceVolumeChanged)</td>

<td rowspan="1" colSpan="1" >The volume levels of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNetworkQualityChanged](https://www.tencentcloud.com/document/product/647/51013#onUserNetworkQualityChanged)</td>

<td rowspan="1" colSpan="1" >The network quality of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onKickedOffline](https://www.tencentcloud.com/document/product/647/51013#onKickedOffline)</td>

<td rowspan="1" colSpan="1" >The current user was kicked offline.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserSigExpired](https://www.tencentcloud.com/document/product/647/51013#onUserSigExpired)</td>

<td rowspan="1" colSpan="1" >The user sig is expired.</td>
</tr>
</table>


## Definitions of Key Typ
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >Call media type, Enumeration type: Unknown, Video, and Audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallRole](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >Call role, Enumeration type: None, Call, and Called.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallStatus](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >Call status, Enumeration type: None, Waiting, and Accept.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUIRoomId](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >The room ID, which can be a number or string.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallCamera](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >The camera type. Enumeration type: Front camera and Back camera.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUIAudioPlaybackDevice](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >The audio playback device type. Enumeration type: Earpiece and Speakerphone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUINetworkQualityInfo](https://write.woa.com/document/114219413111934976)</td>

<td rowspan="1" colSpan="1" >The current network quality.</td>
</tr>
</table>

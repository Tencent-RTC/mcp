## TUICallKit (including UI Interface)

## TUICallKit APIs

UICallKit API, you can quickly implement a WeChat-like audio and video call scenario through simple interfaces.
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[login](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Login.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[logout](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Logout.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Initiate a one-to-one or multi-person call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[call](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >To make a one-on-one call, supports custom room ID, call timeout, offline push content, and more.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[groupCall](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >To make a group call, supports custom room ID, call timeout, offline push content, and more.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[joinInGroupCall](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Join a group call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Customize user's ringtone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Enable/Disable Ringtone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableVirtualBackground](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Enable/disable blurry background feature.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setScreenOrientation](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Set Screen Orientation.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[on](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Listen to TUICallKit events.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[off](https://write.woa.com/document/162412580951224320)</td>

<td rowspan="1" colSpan="1" >Cancel listening to TUICallKit events.</td>
</tr>
</table>


## TUICallEvent

TUICallEvent is the callback event class corresponding to TUICallKit. Through this callback, you can listen to the callback events you are interested in.
<table>
<tr>
<td rowspan="1" colSpan="1" >Event</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onError](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Error Callback during Call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onCallReceived](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Callback for a Call Request.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onCallCancelled](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Callback for Call Cancellation.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onCallBegin](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Callback for Call Connection.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onCallEnd](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Callback for Call Termination.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserReject](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >xxxx User declines the call Callback.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserNoResponse](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >xxxx User Non-response Callback.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserLineBusy](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >xxxx User Busy Line Callback.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserJoin](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >xxxx User Joins Call Callback.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserLeave](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >A user left the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onCallMediaTypeChanged](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Callback for a change in the Call's Media Type.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onKickedOffline](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Current user kicked offline.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserSigExpired](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Ticket expired while online.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserVideoAvailable](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Whether a user has a video stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserAudioAvailable](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >Whether a user has an audio stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserVoiceVolumeChanged](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >The volume levels of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[TUICallEvent.onUserNetworkQualityChanged](https://write.woa.com/document/162412628639113216)</td>

<td rowspan="1" colSpan="1" >The network quality of all users.</td>
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
<td rowspan="1" colSpan="1" >[createInstance](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Creates a `TUICallEngine` instance (singleton mode).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[destroyInstance](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Terminates a `TUICallEngine` instance (singleton mode).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[login](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Authenticates the basic audio/video call capabilities.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[on](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Registers an event listener.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[off](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Unregisters an event listener.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[call](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Makes a one-to-one call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[accept](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Accepts a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[reject](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Rejects a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[ignore](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Ignores a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[hangup](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Ends a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[switchCallMediaType](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Changes the call type, for example, from video call to audio call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[startRemoteView](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Subscribes to the video stream of a remote user.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[stopRemoteView](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Unsubscribes from the video stream of a remote user.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[openCamera](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Turns the camera on.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[switchCamera](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Switches between the front and rear cameras.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[closeCamera](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Turns the camera off.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[openMicrophone](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Turns the mic on.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[closeMicrophone](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Turns the mic off.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[selectAudioPlaybackDevice](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Selects the audio playback device (receiver or speaker).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setVideoRenderParams](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Set the rendering mode of video image.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setVideoEncoderParams](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Set the encoding parameters of video encoder.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setBeautyLevel](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Set beauty level, support turning off default beauty.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Sets the alias and profile photo.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMultiDeviceAbility](https://write.woa.com/document/165654454250659840)</td>

<td rowspan="1" colSpan="1" >Sets whether to enable multi-device login for `TUICallEngine` .</td>
</tr>
</table>

# TRTC

The TRTC object is created using [TRTC.create()](#create) and provides core real-time audio and video capabilities:

- Enter an audio and video room [enterRoom()](#enterroom)
- Exit the current audio and video room [exitRoom()](#exitroom)
- Preview/publish local video [startLocalVideo()](#startlocalvideo)
- Capture/publish local audio [startLocalAudio()](#startlocalaudio)
- Stop previewing/publishing local video [stopLocalVideo()](#stoplocalvideo)
- Stop capturing/publishing local audio [stopLocalAudio()](#stoplocalaudio)
- Watch remote video [startRemoteVideo()](#startremotevideo)
- Stop watching remote video [stopRemoteVideo()](#stopremotevideo)
- Mute/unmute remote audio [muteRemoteAudio()](#muteremoteaudio)

## Methods

### create()

Create a TRTC object for implementing functions such as entering a room, previewing, publishing, and subscribing streams.

**Note:**
- You must create a TRTC object first and call its methods and listen to its events to implement various functions required by the business.

#### Example

```javascript
// Create a TRTC object
const trtc = TRTC.create();
```

#### Parameters:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `options.plugins` | Array |  | List of registered plugins (optional). |
| `options.enableSEI` | boolean | `false` | Whether to enable SEI sending and receiving function (optional). [Reference document](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#sendSEIMessage) |
| `options.assetsPath` | string |  | The address of the static resource file that the plugin depends on (optional).<br>- Publish the node_modules/trtc-sdk-v5/assets directory to CDN or static resource server.<br>- Set the assetsPath parameter to the CDN address, for example: `TRTC.create({ assetsPath: 'https://xxx/assets' })`, the SDK will load the relevant resource files on demand. |
| `options.userDefineRecordId` | string |  | is used to set the userDefineRecordId of cloud recording (optional).<br>- [Recommended value] The length is limited to 64 bytes, and only uppercase and lowercase English letters (a-zA-Z), numbers (0-9), underscores, and hyphens are allowed.<br>- [Reference document] [Cloud recording](https://trtc.io/document/45169?product=rtcengine&menulabel=serverfeaturesapis). |

#### Returns:
TRTC object

**Type:** [TRTC](#)

### enterRoom(options)

Enter a video call room.

- Entering a room means starting a video call session. Only after entering the room successfully can you make audio and video calls with other users in the room.
- You can publish local audio and video streams through [startLocalVideo()](#startlocalvideo) and [startLocalAudio()](#startlocalaudio) respectively. After successful publishing, other users in the room will receive the [REMOTE_AUDIO_AVAILABLE](../module-EVENT.html#remote_audio_available) and [REMOTE_VIDEO_AVAILABLE](../module-EVENT.html#remote_video_available) event notifications.
- By default, the SDK automatically plays remote audio. You need to call [startRemoteVideo()](#startremotevideo) to play remote video.

#### Example

```javascript
const trtc = TRTC.create();
await trtc.enterRoom({ roomId: 8888, sdkAppId, userId, userSig });
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `options` | object | **required** Enter room parameters |

**Properties:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sdkAppId` | number |  | **required** sdkAppId <br>You can obtain the sdkAppId information in the **Application Information** section after creating a new application by clicking **Application Management** > **Create Application** in the [TRTC Console](https://console.trtc.io/). |
| `userId` | string |  | **required** User ID <br>It is recommended to limit the length to 32 bytes, and only allow uppercase and lowercase English letters (a-zA-Z), numbers (0-9), underscores, and hyphens. |
| `userSig` | string |  | **required** UserSig signature <br>Please refer to [UserSig related](https://trtc.io/document/35166?platform=web&product=rtcengine&menulabel=coresdk) for the calculation method of userSig. |
| `roomId` | number |  | the value must be an integer between 1 and 4294967294<br><font color="red">If you need to use a string type room id, please use the strRoomId parameter. One of roomId and strRoomId must be passed in. If both are passed in, the roomId will be selected first.</font> |
| `strRoomId` | string |  | String type room id, the length is limited to 64 bytes, and only supports the following characters:<br>- Uppercase and lowercase English letters (a-zA-Z)<br>- Numbers (0-9)<br>- Space ! # $ % & ( ) + - : ; < = . > ? @ [ ] ^ _ { } \| ~ ,<br><font color="red">Note: It is recommended to use a numeric type roomId. The string type room id "123" is not the same room as the numeric type room id 123.</font> |
| `scene` | string |  | Application scene, currently supports the following two scenes:<br>- [TRTC.TYPE.SCENE_RTC](../module-TYPE.html#scene_rtc) (default) Real-time call scene, which is suitable for 1-to-1 audio and video calls, or online meetings with up to 300 participants. [Upstream Users Limitation](../tutorial-04-info-uplink-limits.html).<br>- [TRTC.TYPE.SCENE_LIVE](../module-TYPE.html#scene_live) Interactive live streaming scene, which is suitable for online live streaming scenes with up to 100,000 people, but you need to specify the role field in the options parameter introduced next. |
| `role` | string |  | User role, only meaningful in the [TRTC.TYPE.SCENE_LIVE](../module-TYPE.html#scene_live) scene, and the [TRTC.TYPE.SCENE_RTC](../module-TYPE.html#scene_rtc) scene does not need to specify the role. Currently supports two roles:<br>- [TRTC.TYPE.ROLE_ANCHOR](../module-TYPE.html#role_anchor) (default) Anchor<br>- [TRTC.TYPE.ROLE_AUDIENCE](../module-TYPE.html#role_audience) Audience<br>Note: The audience role does not have the permission to publish local audio and video, only the permission to watch remote streams. If the audience wants to interact with the anchor by connecting to the microphone, please switch the role to the anchor through [switchRole()](#switchrole) before publishing local audio and video. |
| `autoReceiveAudio` | boolean | `true` | Whether to automatically receive audio. When a remote user publishes audio, the SDK automatically plays the remote user's audio. |
| `autoReceiveVideo` | boolean | `false` | Whether to automatically receive video. When a remote user publishes video, the SDK automatically subscribes and decodes the remote video. You need to call [startRemoteVideo()](#startremotevideo) to play the remote video.<br>- The default value was changed to `false` since v5.6.0. Refer to [Breaking Changed for v5.6.0](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-00-info-update-guideline.html). |
| `enableAutoPlayDialog` | boolean |  | Whether to enable the SDK's automatic playback failure dialog box, default: true.<br>- Enabled by default. When automatic playback fails, the SDK will pop up a dialog box to guide the user to click the page to restore audio and video playback.<br>- Can be set to false in order to turn off. Refer to [Handle Autoplay Restriction](../tutorial-21-advanced-auto-play-policy.html). |
| `proxy` | string \| [ProxyServer](../global.html#proxyserver) |  | proxy config. Refer to [Handle Firewall Restriction](../tutorial-34-advanced-proxy.html). |
| `privateMapKey` | string |  | Key for entering a room. If permission control is required, please carry this parameter (empty or incorrect value will cause a failure in entering the room).<br>[privateMapKey permission configuration](https://trtc.io/document/35157?product=rtcengine). |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [ENV_NOT_SUPPORTED](../module-ERROR_CODE.html#env_not_supported)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### exitRoom()

Exit the current audio and video call room.

- After exiting the room, the connection with remote users will be closed, and remote audio and video will no longer be received and played, and the publishing of local audio and video will be stopped.
- The capture and preview of the local camera and microphone will not stop. You can call [stopLocalVideo()](#stoplocalvideo) and [stopLocalAudio()](#stoplocalaudio) to stop capturing local microphone and camera.

#### Example

```javascript
await trtc.exitRoom();
```

#### Throws:
[OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### switchRoom(options)

Switch a video call room.

- Switch the video call room that the audience is watching in live scene. It is faster than exit old room and then entering the new room, and can optimize the opening time in live broadcast and other scenarios.

#### Example

```javascript
const trtc = TRTC.create();
await trtc.enterRoom({
   ...
   roomId: 8888,
   scene: TRTC.TYPE.SCENE_LIVE,
   role: TRTC.TYPE.ROLE_AUDIENCE
});
await trtc.switchRoom({
   userSig,
   roomId: 9999
});
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `options` | object | **required** Switch room parameters |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `userSig` | string | **required** UserSig signature <br>Please refer to [UserSig related](https://trtc.io/document/35166) for the calculation method of userSig. <br /> |
| `roomId` | number | the value must be an integer between 1 and 4294967294<br><font color="red">Note: <br>1. The room to be switched and the current room must be of the same room type (both digital rooms or string rooms)<br> 2. Either roomId or strRoomId must be filled in. If both are filled in, roomId is preferred. </font> |
| `strRoomId` | string | String type room id, the length is limited to 64 bytes, and only supports the following characters:<br>- Uppercase and lowercase English letters (a-zA-Z)<br>- Numbers (0-9)<br>- Space ! # $ % & ( ) + - : ; < = . > ? @ [ ] ^ _ { } \| ~ , |
| `privateMapKey` | boolean | Key for entering a room. If permission control is required, please carry this parameter (empty or incorrect value will cause a failure in entering the room).<br>[privateMapKey permission configuration](https://trtc.io/document/35157?product=rtcengine). |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### switchRole(role, option)

Switches the user role, only effective in TRTC.TYPE.SCENE_LIVE interactive live streaming mode.

In interactive live streaming mode, a user may need to switch between "audience" and "anchor".
You can determine the role through the role field in [enterRoom()](#enterroom), or switch roles after entering the room through switchRole.

- Audience switches to anchor, call trtc.switchRole(TRTC.TYPE.ROLE_ANCHOR) to convert the user role to TRTC.TYPE.ROLE_ANCHOR anchor role, and then call [startLocalVideo()](#startlocalvideo) and [startLocalAudio()](#startlocalaudio) to publish local audio and video as needed.
- Anchor switches to audience, call trtc.switchRole(TRTC.TYPE.ROLE_AUDIENCE) to convert the user role to TRTC.TYPE.ROLE_AUDIENCE audience role. If there is already published local audio and video, the SDK will cancel the publishing of local audio and video.

> **Notice：**
> - This interface can only be called after entering the room successfully.
> - After closing the camera and microphone, it is recommended to switch to the audience role in time to avoid the anchor role occupying the resources of 50 upstreams.

#### Examples

```javascript
// After entering the room successfully
// TRTC.TYPE.SCENE_LIVE interactive live streaming mode, audience switches to anchor
await trtc.switchRole(TRTC.TYPE.ROLE_ANCHOR);
// Switch from audience role to anchor role and start streaming
await trtc.startLocalVideo();
// TRTC.TYPE.SCENE_LIVE interactive live streaming mode, anchor switches to audience
await trtc.switchRole(TRTC.TYPE.ROLE_AUDIENCE);
```

```javascript
// Since v5.3.0+
await trtc.switchRole(TRTC.TYPE.ROLE_ANCHOR, { privateMapKey: 'your new privateMapKey' });
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `role` | string | **required** User role<br>- TRTC.TYPE.ROLE_ANCHOR anchor, can publish local audio and video, up to 50 anchors can publish local audio and video in a single room at the same time.<br>- TRTC.TYPE.ROLE_AUDIENCE audience, cannot publish local audio and video, can only watch remote streams, and there is no upper limit on the number of audience members in a single room. |
| `option` | object | Optional parameters |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `privateMapKey` | string | **Since v5.3.0+** <br>The privateMapKey may expire after a timeout, so you can use this parameter to update the privateMapKey. |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [INVALID_OPERATION](../module-ERROR_CODE.html#invalid_operation)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### destroy()

Destroy the TRTC instance

After exiting the room, if the business side no longer needs to use trtc, you need to call this interface to destroy the trtc instance in time and release related resources.

**Note:**
- The trtc instance after destruction cannot be used again.
- If you have entered the room, you need to call the [TRTC.exitRoom](#exitroom) interface to exit the room successfully before calling this interface to destroy trtc.

#### Example

```javascript
// When the call is over
await trtc.exitRoom();
// If the trtc is no longer needed, destroy the trtc and release the reference.
trtc.destroy();
trtc = null;
```

#### Throws:
[OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)

### startLocalAudio(config)

Start collecting audio from the local microphone and publish it to the current room.

- When to call: can be called before or after entering the room, cannot be called repeatedly.
- Only one microphone can be opened for a trtc instance. If you need to open another microphone for testing in the case of already opening one microphone, you can create multiple trtc instances to achieve it.

#### Examples

```javascript
// Collect the default microphone and publish
await trtc.startLocalAudio();
```

```javascript
// The following is a code example for testing microphone volume, which can be used for microphone volume detection.
trtc.enableAudioVolumeEvaluation();
trtc.on(TRTC.EVENT.AUDIO_VOLUME, event => { });
// No need to publish audio for testing microphone
await trtc.startLocalAudio({ publish: false });
// After the test is completed, turn off the microphone
await trtc.stopLocalAudio();
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `config` | object | Configuration item |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `publish` | boolean | Whether to publish local audio to the room, default is true. If you call this interface before entering the room and publish = true, the SDK will automatically publish after entering the room. You can get the publish state by listening this event [PUBLISH_STATE_CHANGED](../module-EVENT.html#publish_state_changed). |
| `mute` | boolean | Whether to mute microphone. Refer to: [Turn On/Off Camera/Mic](../tutorial-15-basic-dynamic-add-video.html). |
| `option` | object | Local audio options |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `microphoneId` | string | Specify which microphone to use |
| `audioTrack` | MediaStreamTrack | Custom audioTrack. [Custom Capturing and Rendering](../tutorial-20-advanced-customized-capture-rendering.html). |
| `captureVolume` | number | Set the capture volume of microphone. The default value is 100. Setting above 100 enlarges the capture volume. Since v5.2.1+. |
| `earMonitorVolume` | number | Set the ear return volume, value range [0, 100], the local microphone is muted by default. |
| `profile` | string | Audio encoding configuration, default [TRTC.TYPE.AUDIO_PROFILE_STANDARD](../module-TYPE.html#audio_profile_standard) |

#### Throws:
- [ENV_NOT_SUPPORTED](../module-ERROR_CODE.html#env_not_supported)
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### updateLocalAudio(config)

Update the configuration of the local microphone.

- When to call: This interface needs to be called after [startLocalAudio()](#startlocalaudio) is successful and can be called multiple times.
- This method uses incremental update: only update the passed parameters, and keep the parameters that are not passed unchanged.

#### Example

```javascript
// Switch microphone
const microphoneList = await TRTC.getMicrophoneList();
if (microphoneList[1]) {
  await trtc.updateLocalAudio({ option: { microphoneId: microphoneList[1].deviceId }});
}
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `config` | object | Configuration item |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `publish` | boolean | Whether to publish local audio to the room. You can get the publish state by listening this event [PUBLISH_STATE_CHANGED](../module-EVENT.html#publish_state_changed). |
| `mute` | boolean | Whether to mute microphone. Refer to: [Turn On/Off Camera/Mic](../tutorial-15-basic-dynamic-add-video.html). |
| `option` | object | Local audio configuration |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `microphoneId` | string | Specify which microphone to use to switch microphones. |
| `audioTrack` | MediaStreamTrack | Custom audioTrack. [Custom Capturing and Rendering](../tutorial-20-advanced-customized-capture-rendering.html). |
| `captureVolume` | number | Set the capture volume of microphone. The default value is 100. Setting above 100 enlarges the capture volume. Since v5.2.1+. |
| `earMonitorVolume` | number | Set the ear return volume, value range [0, 100], the local microphone is muted by default. |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### stopLocalAudio()

Stop collecting and publishing the local microphone.

- If you just want to mute the microphone, please use updateLocalAudio({ mute: true }). Refer to: [Turn On/Off Camera/Mic](../tutorial-15-basic-dynamic-add-video.html).

#### Example

```javascript
await trtc.stopLocalAudio();
```

#### Throws:
[OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### startLocalVideo(config)

Start collecting video from the local camera, play the camera's video on the specified HTMLElement tag, and publish the camera's video to the current room.

- When to call: can be called before or after entering the room, but cannot be called repeatedly.
- Only one camera can be started per TRTC instance. If you need to start another camera for testing while one camera is already started, you can create multiple TRTC instances to achieve this.

#### Examples

```javascript
// Preview and publish the camera
await trtc.startLocalVideo({
  view: document.getElementById('localVideo'), // Preview the video on the element with the DOM elementId of localVideo.
});
```

```javascript
// Preview the camera without publishing. Can be used for camera testing.
const config = {
  view: document.getElementById('localVideo'), // Preview the video on the element with the DOM elementId of localVideo.
  publish: false // Do not publish the camera
}
await trtc.startLocalVideo(config);
// Call updateLocalVideo when you need to publish the video
await trtc.updateLocalVideo({ publish: true });
```

```javascript
// Use a specified camera.
const cameraList = await TRTC.getCameraList();
if (cameraList[0]) {
  await trtc.startLocalVideo({
    view: document.getElementById('localVideo'), // Preview the video on the element with the DOM elementId of localVideo.
    option: {
      cameraId: cameraList[0].deviceId,
    }
  });
}
// Use the front camera on a mobile device.
await trtc.startLocalVideo({ view, option: { useFrontCamera: true }});
// Use the rear camera on a mobile device.
await trtc.startLocalVideo({ view, option: { useFrontCamera: false }});
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `config` | object | Configuration item |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `view` | string \| HTMLElement \| Array.\<HTMLElement> \| null | The HTMLElement instance or ID for local video preview. If not passed or passed as null, the video will not be played. |
| `publish` | boolean | Whether to publish the local video to the room. If you call this interface before entering the room and publish = true, the SDK will automatically publish after entering the room. You can get the publish state by listening to this event [PUBLISH_STATE_CHANGED](../module-EVENT.html#publish_state_changed). |
| `mute` | boolean \| string | Whether to mute the camera. Supports passing in an image URL string, the image will be published instead of the original camera stream. Other users in the room will receive the REMOTE_VIDEO_AVAILABLE event. It does not support calling when the camera is turned off. More information: [Turn On/Off Camera/Mic](../tutorial-15-basic-dynamic-add-video.html). |
| `option` | object | Local video configuration |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `cameraId` | string | Specify which camera to use for switching cameras. |
| `useFrontCamera` | boolean | Whether to use the front camera. |
| `videoTrack` | MediaStreamTrack | Custom videoTrack. [Custom Capturing and Rendering](../tutorial-20-advanced-customized-capture-rendering.html). |
| `mirror` | 'view' \| 'publish' \| 'both' \| boolean | Video mirroring mode, default is 'view'.<br>- 'view': You see yourself as a mirror image, and the other person sees you as a non-mirror image.<br>- 'publish': The other person sees you as a mirror image, and you see yourself as a non-mirror image.<br>- 'both': You see yourself as a mirror image, and the other person sees you as a mirror image.<br>- false: Boolean value, represents no mirroring.<br><font color="orange"> Note: Before version 5.3.2, only boolean can be passed, where true represents local preview mirroring, and false represents no mirroring.</font> |
| `fillMode` | 'contain' \| 'cover' \| 'fill' | Video fill mode. The default is `cover`. Refer to the [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. |
| `profile` | string \| [VideoProfile](../global.html#videoprofile) | Video encoding parameters for the main video. Default value is `480p_2`. |
| `small` | string \| boolean \| [VideoProfile](../global.html#videoprofile) | Video encoding parameters for the small video. Refer to [Multi-Person Video Calls](../tutorial-27-advanced-small-stream.html) |
| `qosPreference` | QOS_PREFERENCE_SMOOTH \| QOS_PREFERENCE_CLEAR | Set the video encoding strategy for weak networks. Smooth first (default) ([QOS_PREFERENCE_SMOOTH](../module-TYPE.html#qos_preference_smooth)) or Clear first ([QOS_PREFERENCE_CLEAR](../module-TYPE.html#qos_preference_clear)). |
| `avoidCropping` | boolean | On PC Chrome and Firefox, capturing low-resolution 16/9 videos like 360p or 180p may result in cropping issues. Setting this parameter to true can avoid cropping. |
| `rotation` | 0 \| 90 \| 180 \| 270 | Set the clockwise rotation angle of the local camera. Since `v5.11.0`. |

#### Throws:
- [ENV_NOT_SUPPORTED](../module-ERROR_CODE.html#env_not_supported)
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### updateLocalVideo(config)

Update the local camera configuration.

- This interface needs to be called after [startLocalVideo()](#startlocalvideo) is successful.
- This interface can be called multiple times.
- This method uses incremental update: only updates the passed-in parameters, and keeps the parameters that are not passed in unchanged.

#### Examples

```javascript
// Switch camera
const cameraList = await TRTC.getCameraList();
if (cameraList[1]) {
  await trtc.updateLocalVideo({ option: { cameraId: cameraList[1].deviceId }});
}
```

```javascript
// Stop publishing video, but keep local preview
await trtc.updateLocalVideo({ publish:false });
```

#### Parameters:

| Name | Type | Description |
|------|------|-------------|
| `config` | object | Configuration item |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `view` | string \| HTMLElement \| Array.\<HTMLElement> \| null | The HTMLElement instance or Id of the preview camera. If not passed in or passed in null, the video will not be rendered, but still pushes the stream and consumes bandwidth. |
| `publish` | boolean | Whether to publish the local video to the room. You can get the publish state by listening this event [PUBLISH_STATE_CHANGED](../module-EVENT.html#publish_state_changed). |
| `mute` | boolean \| string | Whether to mute the camera. Supports passing in image url string, the image will be published instead of origin camera stream, Other users in the room will receive the REMOTE_VIDEO_AVAILABLE event. It does not support calling when the camera is turned off. More information: [Turn On/Off Camera/Mic](../tutorial-15-basic-dynamic-add-video.html). |
| `option` | object | Local video configuration |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `cameraId` | string | Specify which camera to use |
| `useFrontCamera` | boolean | Whether to use the front camera |
| `videoTrack` | MediaStreamTrack | Custom videoTrack. [Custom Capturing and Rendering](../tutorial-20-advanced-customized-capture-rendering.html). |
| `mirror` | 'view' \| 'publish' \| 'both' \| boolean | Video mirroring mode, default is 'view'.<br>- 'view': You see yourself as a mirror image, and the other person sees you as a non-mirror image.<br>- 'publish': The other person sees you as a mirror image, and you see yourself as a non-mirror image.<br>- 'both': You see yourself as a mirror image, and the other person sees you as a mirror image.<br>- false: Boolean value, represents no mirroring. |
| `fillMode` | 'contain' \| 'cover' \| 'fill' | Video fill mode. Refer to the [ CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property |
| `profile` | string \| [VideoProfile](../global.html#videoprofile) | Video encoding parameters for the main stream |
| `small` | string \| boolean \| [VideoProfile](../global.html#videoprofile) | Video encoding parameters for the small video. Refer to [Multi-Person Video Calls](../tutorial-27-advanced-small-stream.html) |
| `qosPreference` | QOS_PREFERENCE_SMOOTH \| QOS_PREFERENCE_CLEAR | Set the video encoding strategy for weak networks. Smooth first ([QOS_PREFERENCE_SMOOTH](../module-TYPE.html#qos_preference_smooth)) or Clear first ([QOS_PREFERENCE_CLEAR](../module-TYPE.html#qos_preference_clear)) |
| `rotation` | 0 \| 90 \| 180 \| 270 | Set the clockwise rotation angle of the local camera. Since `v5.11.0`. |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### stopLocalVideo()

Stop capturing, previewing, and publishing the local camera.

- If you only want to stop publishing video but keep the local camera preview, you can use the [updateLocalVideo({ publish:false })](#updatelocalvideo) method.

#### Example

```javascript
await trtc.stopLocalVideo();
```

#### Throws:
[OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### startScreenShare(config)

Start screen sharing.

- After starting screen sharing, other users in the room will receive the [REMOTE_VIDEO_AVAILABLE](../module-EVENT.html#remote_video_available) event, with streamType as [STREAM_TYPE_SUB](../module-TYPE.html#stream_type_sub), and other users can play screen sharing through [startRemoteVideo](#startremotevideo).

#### Example

```javascript
// Start screen sharing
await trtc.startScreenShare();
```

#### Parameters:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `config` | object |  | Configuration item |

**Properties:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `view` | string \| HTMLElement \| Array.\<HTMLElement> \| null |  | The HTMLElement instance or Id for previewing local screen sharing. If not passed or passed as null, local screen sharing will not be rendered. |
| `publish` | boolean |  | Whether to publish screen sharing to the room. The default is true. If you call this interface before entering the room and publish = true, the SDK will automatically publish after entering the room. You can get the publish state by listening this event [PUBLISH_STATE_CHANGED](../module-EVENT.html#publish_state_changed). |
| `streamType` | TRTC.TYPE.STREAM_TYPE_MAIN \| TRTC.TYPE.STREAM_TYPE_SUB |  | **required** Stream type. A trtc instance can publish one main stream (video+audio) and one auxiliary stream (video). Screen sharing is publish through the sub stream by default.<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](../module-TYPE.html#stream_type_main): Main stream. If set to publish screen sharing as the main stream, the camera cannot be published through the main stream.<br>- [TRTC.TYPE.STREAM_TYPE_SUB](../module-TYPE.html#stream_type_sub): Sub stream (default value). |
| `muteSystemAudio` | boolean | `false` | Whether to mute system audio. Supported since v5.12.0+. |
| `option` | object |  | Screen sharing configuration |

**Properties:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `systemAudio` | boolean |  | Whether to capture system audio. The default is false. |
| `fillMode` | 'contain' \| 'cover' \| 'fill' |  | Video fill mode. The default is `contain`, refer to [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. |
| `profile` | [ScreenShareProfile](../global.html#screenshareprofile) |  | Screen sharing encoding configuration. Default value is `1080p`. |
| `qosPreference` | QOS_PREFERENCE_SMOOTH \| QOS_PREFERENCE_CLEAR |  | Set the video encoding strategy for weak networks. Smooth first ([QOS_PREFERENCE_SMOOTH](../module-TYPE.html#qos_preference_smooth)) or Clear first(default) ([QOS_PREFERENCE_CLEAR](../module-TYPE.html#qos_preference_clear)) |
| `captureElement` | HTMLElement |  | Capture screen from the specified element of current tab. Available on Chrome 104+. |
| `preferDisplaySurface` | 'current-tab' \| 'tab' \| 'window' \| 'monitor' | `'monitor'` | The prefer display surface for screen sharing. Available on Chrome 94+.<br>- The default is monitor, which means that monitor capture will be displayed first in the Screen Sharing Capture pre-checkbox。<br>- If you fill in 'current-tab', the pre-checkbox will only show the current page. |

#### Throws:
- [ENV_NOT_SUPPORTED](../module-ERROR_CODE.html#env_not_supported)
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### updateScreenShare(config)

Update screen sharing configuration

- This interface needs to be called after [startScreenShare()](#startscreenshare) is successful.
- This interface can be called multiple times.
- This method uses incremental update: only update the passed-in parameters, and keep the parameters that are not passed-in unchanged.

#### Example

```javascript
// Stop screen sharing, but keep the local preview of screen sharing
await trtc.updateScreenShare({ publish:false });
```

#### Parameters:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `config` | object |  | Configuration item |

**Properties:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `view` | string \| HTMLElement \| Array.\<HTMLElement> \| null |  | The HTMLElement instance or Id for screen sharing preview. If not passed in or passed in null, the screen sharing will not be rendered. |
| `publish` | boolean | `true` | Whether to publish screen sharing to the room |
| `muteSystemAudio` | boolean | `false` | Whether to mute system audio. Supported since v5.12.0+. |
| `option` | object |  | Screen sharing configuration |

**Properties:**

| Name | Type | Description |
|------|------|-------------|
| `fillMode` | 'contain' \| 'cover' \| 'fill' | Video fill mode. The default is `contain`, refer to [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. |
| `qosPreference` | QOS_PREFERENCE_SMOOTH \| QOS_PREFERENCE_CLEAR | Set the video encoding strategy for weak networks. Smooth first ([QOS_PREFERENCE_SMOOTH](../module-TYPE.html#qos_preference_smooth)) or Clear first ([QOS_PREFERENCE_CLEAR](../module-TYPE.html#qos_preference_clear)) |

#### Throws:
- [INVALID_PARAMETER](../module-ERROR_CODE.html#invalid_parameter)
- [DEVICE_ERROR](../module-ERROR_CODE.html#device_error)
- [OPERATION_FAILED](../module-ERROR_CODE.html#operation_failed)
- [OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)
- [SERVER_ERROR](../module-ERROR_CODE.html#server_error)

### stopScreenShare()

Stop screen sharing.

#### Example

```javascript
await trtc.stopScreenShare();
```

#### Throws:
[OPERATION_ABORT](../module-ERROR_CODE.html#operation_abort)

### startRemoteVideo

**(async)** startRemoteVideo(config)

Play remote video

- When to call: Call after receiving the [TRTC.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE)](module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) event.

#### Example

```javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  // You need to place the video container in the DOM in advance, and it is recommended to use `${userId}_${streamType}` as the element id.
  trtc.startRemoteVideo({ userId, streamType, view: `${userId}_${streamType}` });
})
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config | object | Remote video configuration |

**Properties**

| Name | Type | Description |
|------|------|-------------|
| view | string \| HTMLElement \| Array.\<HTMLElement> \| null | The HTMLElement instance or Id used to play remote video. If not passed or passed null, the video will not be rendered, but the bandwidth will still be consumed. |
| userId | string | **required** Remote user ID |
| streamType | TRTC.TYPE.STREAM_TYPE_MAIN \| TRTC.TYPE.STREAM_TYPE_SUB | **required** Remote stream type<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream (remote user's camera)<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream (remote user's screen sharing) |
| option | object | Remote video configuration |

**Option Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| small | boolean | | Whether to subscribe small streams |
| mirror | boolean | | Whether to enable mirror |
| fillMode | 'contain' \| 'cover' \| 'fill' | | Video fill mode. Refer to the [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. |
| receiveWhenViewVisible | boolean | | Since v5.4.0<br>Subscribe video only when view is visible. Refer to: [Multi-Person Video Calls](tutorial-27-advanced-small-stream.html). |
| viewRoot | HTMLElement | document.body | Since v5.4.0<br>The root element is the parent element of the view and is used to calculate whether the view is visible relative to the root. The default value is document.body, and it is recommended that you use the first-level parent of the video view list. Refer to: [Multi-Person Video Calls](tutorial-27-advanced-small-stream.html). |
| poster | string | | Since v5.10.0<br>The default poster image for the video. Generally no need to concern about this, only a few browsers display their default built-in images, in which case you can customize it through this parameter. Reference: [HTMLVideoElement: poster property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/poster) |

#### Throws

- [INVALID_PARAMETER](module-ERROR_CODE.html#.INVALID_PARAMETER)
- [INVALID_OPERATION](module-ERROR_CODE.html#.INVALID_OPERATION)
- [OPERATION_FAILED](module-ERROR_CODE.html#.OPERATION_FAILED)
- [OPERATION_ABORT](module-ERROR_CODE.html#.OPERATION_ABORT)
- [SERVER_ERROR](module-ERROR_CODE.html#.SERVER_ERROR)

### updateRemoteVideo

**(async)** updateRemoteVideo(config)

Update remote video playback configuration

- This method should be called after [startRemoteVideo](TRTC.html#startRemoteVideo) is successful.
- This method can be called multiple times.
- This method uses incremental updates, so only the configuration items that need to be updated need to be passed in.

#### Example

```javascript
const config = {
 view: document.getElementById(userId), // you can use a new view to update the position of video.
 userId,
 streamType: TRTC.TYPE.STREAM_TYPE_MAIN
}
await trtc.updateRemoteVideo(config);
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config | object | Remote video configuration |

**Properties**

| Name | Type | Description |
|------|------|-------------|
| view | string \| HTMLElement \| Array.\<HTMLElement> \| null | The HTMLElement instance or Id used to play remote video. If not passed or passed null, the video will not be rendered, but the bandwidth will still be consumed. |
| userId | string | **required** Remote user ID |
| streamType | TRTC.TYPE.STREAM_TYPE_MAIN \| TRTC.TYPE.STREAM_TYPE_SUB | **required** Remote stream type<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream (remote user's camera)<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream (remote user's screen sharing) |
| option | object | Remote video configuration |

**Option Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| small | boolean | | Whether to subscribe small streams. Refer to: [Multi-Person Video Calls](tutorial-27-advanced-small-stream.html). |
| mirror | boolean | | Whether to enable mirror |
| fillMode | 'contain' \| 'cover' \| 'fill' | | Video fill mode. Refer to the [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. |
| receiveWhenViewVisible | boolean | | Since v5.4.0<br>Subscribe video only when view is visible. Refer to: [Multi-Person Video Calls](tutorial-27-advanced-small-stream.html). |
| viewRoot | HTMLElement | document.body | Since v5.4.0<br>The root element is the parent element of the view and is used to calculate whether the view is visible relative to the root. The default value is document.body, and it is recommended that you use the first-level parent of the video view list. Refer to: [Multi-Person Video Calls](tutorial-27-advanced-small-stream.html). |

#### Throws

- [INVALID_PARAMETER](module-ERROR_CODE.html#.INVALID_PARAMETER)
- [INVALID_OPERATION](module-ERROR_CODE.html#.INVALID_OPERATION)
- [OPERATION_FAILED](module-ERROR_CODE.html#.OPERATION_FAILED)
- [OPERATION_ABORT](module-ERROR_CODE.html#.OPERATION_ABORT)

### stopRemoteVideo

**(async)** stopRemoteVideo(config)

Used to stop remote video playback.

#### Example

```javascript
// Stop playing all remote users
await trtc.stopRemoteVideo({ userId: '*' });
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config | object | **required** Remote video configuration |

**Properties**

| Name | Type | Description |
|------|------|-------------|
| userId | string | **required** Remote user ID, '*' represents all users. |
| streamType | TRTC.TYPE.STREAM_TYPE_MAIN \| TRTC.TYPE.STREAM_TYPE_SUB | Remote stream type. This field is required when userId is not '*'.<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream (remote user's camera)<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream (remote user's screen sharing) |

#### Throws

[OPERATION_ABORT](module-ERROR_CODE.html#.OPERATION_ABORT)

### muteRemoteAudio

**(async)** muteRemoteAudio(userId, mute)

Mute a remote user and stop subscribing audio data from that user. Only effective for the current user, other users in the room can still hear the muted user's voice.

Note:

- By default, after entering the room, the SDK will automatically play remote audio. You can call this interface to mute or unmute remote users.
- If the parameter autoReceiveAudio = false is passed in when entering the room, remote audio will not be played automatically. When audio playback is required, you need to call this method (mute is passed in false) to play remote audio.
- This interface is effective before or after entering the room (enterRoom), and the mute state will be reset to false after exiting the room (exitRoom).
- If you want to continue subscribing audio data from the user but not play it, you can call setRemoteAudioVolume(userId, 0)

#### Example

```javascript
// Mute all remote users
await trtc.muteRemoteAudio('*', true);
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| userId | string | **required** Remote user ID, '*' represents all users. |
| mute | boolean | **required** Whether to mute |

#### Throws

- [INVALID_PARAMETER](module-ERROR_CODE.html#.INVALID_PARAMETER)
- [INVALID_OPERATION](module-ERROR_CODE.html#.INVALID_OPERATION)
- [OPERATION_FAILED](module-ERROR_CODE.html#.OPERATION_FAILED)
- [OPERATION_ABORT](module-ERROR_CODE.html#.OPERATION_ABORT)

### setRemoteAudioVolume

setRemoteAudioVolume(userId, volume)

Used to control the playback volume of remote audio.

- Starting from version v5.12.1, this setting only needs to be configured once, and there is no need to reset it when remote users rejoin the room. For versions prior to v5.12.1, if a remote user rejoins the room, the volume setting needs to be reconfigured.
- Not supported by iOS Safari

#### Example

```javascript
await trtc.setRemoteAudioVolume('123', 90);
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| userId | string | **required** Remote user ID. '*' represents all remote users. |
| volume | number | **required** Volume, ranging from 0 to 100. The default value is 100.<br>Since `v5.1.3+`, the volume can be set higher than 100. |

### startPlugin

**(async)** startPlugin(plugin, options) → {Promise.\<void>}

start plugin

| pluginName | name | tutorial | param |
|------------|------|----------|-------|
| 'AudioMixer' | Audio Mixer Plugin | [Music and Audio Effects](tutorial-22-advanced-audio-mixer.html) | [AudioMixerOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#AudioMixerOptions) |
| 'AIDenoiser' | AI Denoiser Plugin | [Implement AI noise reduction](tutorial-35-advanced-ai-denoiser.html) | [AIDenoiserOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#AIDenoiserOptions) |
| 'VirtualBackground' | Virtual Background Plugin | [Enable Virtual Background](tutorial-36-advanced-virtual-background.html) | [VirtualBackgroundOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#VirtualBackgroundOptions) |
| 'Watermark' | Watermark Plugin | [Enable Watermark Plugin](tutorial-29-advanced-water-mark.html) | [WatermarkOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#WatermarkOptions) |
| 'SmallStreamAutoSwitcher' | Small Stream Auto Switcher Plugin | [Enable Small Stream Auto Switcher Plugin](tutorial-41-advanced-small-stream-auto-switcher.html) | [SmallStreamAutoSwitcherOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#SmallStreamAutoSwitcherOptions) |
| 'VoiceChanger' | Voice Changer Plugin | [Enable Voice Changer](tutorial-37-advanced-voice-changer.html) | [VoiceChangerStartOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/global.html#VoiceChangerStartOptions) |

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| plugin | [PluginName](global.html#PluginName) | **required** |
| options | AudioMixerOptions \| [AIDenoiserOptions](global.html#AIDenoiserOptions) \| [VirtualBackgroundOptions](global.html#VirtualBackgroundOptions) \| [WatermarkOptions](global.html#WatermarkOptions) \| [SmallStreamAutoSwitcherOptions](global.html#SmallStreamAutoSwitcherOptions) \| [VoiceChangerStartOptions](global.html#VoiceChangerStartOptions) | **required** |

#### Returns

**Type:** Promise.\<void>

### updatePlugin

**(async)** updatePlugin(plugin, options) → {Promise.\<void>}

Update plugin

| pluginName | name | tutorial | param |
|------------|------|----------|-------|
| 'AudioMixer' | Audio Mixer Plugin | [Music and Audio Effects](tutorial-22-advanced-audio-mixer.html) | [UpdateAudioMixerOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#UpdateAudioMixerOptions) |
| 'AIDenoiser' | AI Denoiser Plugin | [Implement AI noise reduction](tutorial-35-advanced-ai-denoiser.html) | [AIDenoiserOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/global.html#AIDenoiserOptions) |
| 'VirtualBackground' | Virtual Background Plugin | [Enable Virtual Background](tutorial-36-advanced-virtual-background.html) | [VirtualBackgroundOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#VirtualBackgroundOptions) |
| 'Watermark' | Watermark Plugin | [Enable Watermark Plugin](tutorial-29-advanced-water-mark.html) | [WatermarkOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/global.html#WatermarkOptions) |
| 'SmallStreamAutoSwitcher' | Small Stream Auto Switcher | [Enable Small Stream Auto Switcher Plugin](tutorial-41-advanced-small-stream-auto-switcher.html) | [SmallStreamAutoSwitcherOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/global.html#SmallStreamAutoSwitcherOptions) |
| 'VoiceChanger' | Voice Changer Plugin | [Enable Voice Changer](tutorial-37-advanced-voice-changer.html) | [VoiceChangerUpdateOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/global.html#VoiceChangerUpdateOptions) |

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| plugin | [PluginName](global.html#PluginName) | **required** |
| options | [UpdateAudioMixerOptions](global.html#UpdateAudioMixerOptions) \| [AIDenoiserOptions](global.html#AIDenoiserOptions) \| [VirtualBackgroundOptions](global.html#VirtualBackgroundOptions) \| [WatermarkOptions](global.html#WatermarkOptions) \| [SmallStreamAutoSwitcherOptions](global.html#SmallStreamAutoSwitcherOptions) \| [VoiceChangerUpdateOptions](global.html#VoiceChangerUpdateOptions) | **required** |

#### Returns

**Type:** Promise.\<void>

### stopPlugin

**(async)** stopPlugin(plugin, options) → {Promise.\<void>}

Stop plugin

| pluginName | name | tutorial | param |
|------------|------|----------|-------|
| 'AudioMixer' | AudioMixer Plugin | [Music and Audio Effects](tutorial-22-advanced-audio-mixer.html) | [StopAudioMixerOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#StopAudioMixerOptions) |
| 'AIDenoiser' | AIdenoiser Plugin | [Implement AI noise reduction](tutorial-35-advanced-ai-denoiser.html) | |
| 'VirtualBackground' | Virtual Background Plugin | [Enable Virtual Background](tutorial-36-advanced-virtual-background.html) | |
| 'Watermark' | Watermark Plugin | [Enable Watermark Plugin](tutorial-29-advanced-water-mark.html) | |
| 'SmallStreamAutoSwitcher' | Small Stream Auto Switcher Plugin | [Enable Small Stream Auto Switcher Plugin](tutorial-41-advanced-small-stream-auto-switcher.html) | |
| 'VoiceChanger' | Voice Changer Plugin | [Enable Voice Changer](tutorial-37-advanced-voice-changer.html) | |

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| plugin | [PluginName](global.html#PluginName) | **required** |
| options | [StopAudioMixerOptions](global.html#StopAudioMixerOptions) | **required** |

#### Returns

**Type:** Promise.\<void>

### enableAudioVolumeEvaluation

enableAudioVolumeEvaluation(interval, enableInBackground)

Enables or disables the volume callback.

- After enabling this function, whether someone is speaking in the room or not, the SDK will regularly throw the [TRTC.on(TRTC.EVENT.AUDIO_VOLUME)](module-EVENT.html#.AUDIO_VOLUME) event, which feedbacks the volume evaluation value of each user.

#### Example

```javascript
trtc.on(TRTC.EVENT.AUDIO_VOLUME, event => {
   event.result.forEach(({ userId, volume }) => {
       const isMe = userId === ''; // When userId is an empty string, it represents the local microphone volume.
       if (isMe) {
           console.log(`my volume: ${volume}`);
       } else {
           console.log(`user: ${userId} volume: ${volume}`);
       }
   })
});
// Enable volume callback and trigger the event every 1000ms
trtc.enableAudioVolumeEvaluation(1000);
// To turn off the volume callback, pass in an interval value less than or equal to 0
trtc.enableAudioVolumeEvaluation(-1);
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| interval | number | 2000 | Used to set the time interval for triggering the volume callback event. The default is 2000(ms), and the minimum value is 100(ms). If set to less than or equal to 0, the volume callback will be turned off. |
| enableInBackground | boolean | false | For performance reasons, when the page switches to the background, the SDK will not throw volume callback events. If you need to receive volume callback events when the page is switched to the background, you can set this parameter to true. |

### on

on(eventName, handler, context)

Listen to TRTC events

For a detailed list of events, please refer to: [TRTC.EVENT](module-EVENT.html)

#### Example

```javascript
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, event => {
  // REMOTE_VIDEO_AVAILABLE event handler
});
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| eventName | string | **required** Event name |
| handler | function | **required** Event callback function |
| context | context | **required** Context |

### off

off(eventName, handler, context)

Remove event listener

#### Example

```javascript
trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, function peerJoinHandler(event) {
  // REMOTE_USER_ENTER event handler
  console.log('remote user enter');
  trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, peerJoinHandler);
});
// Remove all event listeners
trtc.off('*');
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| eventName | string | **required** Event name. Passing in the wildcard '*' will remove all event listeners. |
| handler | function | **required** Event callback function |
| context | context | **required** Context |

### getAudioTrack

getAudioTrack(config) → {(nullable) MediaStreamTrack}

Get audio track

#### Example

```javascript
// Version before v5.4.3
trtc.getAudioTrack(); // Get local microphone audioTrack, captured by trtc.startLocalAudio()
trtc.getAudioTrack('remoteUserId'); // Get remote audioTrack
// Since v5.4.3+, you can get local screen audioTrack by passing the streamType = TRTC.STREAM_TYPE_SUB
trtc.getAudioTrack({ streamType: TRTC.STREAM_TYPE_SUB });
// Since v5.8.2+, you can get the processed audioTrack by passing processed = true
trtc.getAudioTrack({ processed: true });
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config | Object \| string | If not passed, get the local microphone audioTrack |

**Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| userId | string | | If not passed or passed an empty string, get the local audioTrack. Pass the userId of the remote user to get the remote user's audioTrack. |
| streamType | STREAM_TYPE_MAIN \| STREAM_TYPE_SUB | | stream type:<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream (user's microphone)(default)<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream (user's screen sharing audio). Only works for local screen sharing audio because there is only one remote audioTrack, and there is no distinction between Main and Sub for remote audioTrack. |
| processed | boolean | false | Whether to get the processed audioTrack. The processed audioTrack is the audioTrack after the SDK processes the audio frame, such as ai-denose, gain, mix. The default value is false. |

#### Returns

Audio track

**Type:** MediaStreamTrack

### getVideoTrack

getVideoTrack(config) → {MediaStreamTrack|null}

Get video track

#### Example

```javascript
// Get local camera videoTrack
const videoTrack = trtc.getVideoTrack();
// Get local screen sharing videoTrack
const screenVideoTrack = trtc.getVideoTrack({ streamType: TRTC.TYPE.STREAM_TYPE_SUB });
// Get remote user's main stream videoTrack
const remoteMainVideoTrack = trtc.getVideoTrack({ userId: 'test', streamType: TRTC.TYPE.STREAM_TYPE_MAIN });
// Get remote user's sub stream videoTrack
const remoteSubVideoTrack = trtc.getVideoTrack({ userId: 'test', streamType: TRTC.TYPE.STREAM_TYPE_SUB });
// Since v5.8.2+, you can get the processed videoTrack by passing processed = true
const processedVideoTrack = trtc.getVideoTrack({ processed: true });
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config | string | If not passed, get the local camera videoTrack |

**Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| userId | string | | If not passed or passed an empty string, get the local videoTrack. Pass the userId of the remote user to get the remote user's videoTrack. |
| streamType | STREAM_TYPE_MAIN \| STREAM_TYPE_SUB | | stream type:<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream (user's camera)(default)<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream (user's screen sharing) |
| processed | boolean | false | Whether to get the processed videoTrack. The processed videoTrack is the videoTrack after the SDK processes the video frame, such as virtual background, mirror, watermark, rotation. The default value is false. |

#### Returns

Video track

**Type:** MediaStreamTrack | null

### getVideoSnapshot

getVideoSnapshot()

Get video snapshot

Notice: must play the video before it can obtain the snapshot. If there is no playback, an empty string will be returned.

**Since:** 5.4.0

#### Example

```javascript
// get self main stream video frame
trtc.getVideoSnapshot()
// get self sub stream video frame
trtc.getVideoSnapshot({streamType:TRTC.TYPE.STREAM_TYPE_SUB})
// get remote user main stream video frame
trtc.getVideoSnapshot({userId: 'remote userId', streamType:TRTC.TYPE.STREAM_TYPE_MAIN})
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| config.userId | string | **required** Remote user ID |
| config.streamType | TRTC.TYPE.STREAM_TYPE_MAIN \| TRTC.TYPE.STREAM_TYPE_SUB | **required**<br>- [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN): Main stream<br>- [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB): Sub stream |

### sendSEIMessage

sendSEIMessage(buffer, options)

Send SEI Message

> The header of a video frame has a header block called SEI.
> The principle of this interface is to use the SEI to embed the custom data you want to send along with the video frame.
> SEI messages can accompany video frames all the way to the live CDN.

Applicable scenarios: synchronization of lyrics, live answering questions, etc.

When to call: call after [trtc.startLocalVideo](TRTC.html#startLocalVideo) or trtc.startLocalScreen when set 'toSubStream' option to true successfully.

Note:

1. Maximum 1KB(Byte) sent in a single call, maximum 30 calls per second, maximum 8KB sent per second.
2. Supported browsers: Chrome 86+, Edge 86+, Opera 72+, Safari 15.4+, Firefox 117+. Safari and Firefox are supported since v5.8.0.
3. Since SEI is sent along with video frames, there is a possibility that video frames may be lost, and therefore SEI may be lost as well. The number of times it can be sent can be increased within the frequency limit, and the business side needs to do message de-duplication on the receiving side.
4. SEI cannot be sent without trtc.startLocalVideo(or trtc.startLocalScreen when set 'toSubStream' option to true); SEI cannot be received without startRemoteVideo.
5. Only H264 encoder is supported to send SEI.

**Since:** v5.3.0

**See:** [TRTC.EVENT.SEI_MESSAGE](module-EVENT.html#.SEI_MESSAGE)

#### Example

```javascript
// 1. enable SEI
const trtc = TRTC.create({
   enableSEI: true
})
// 2. send SEI
try {
 await trtc.enterRoom({
  userId: 'user_1',
  roomId: 12345,
})
 await trtc.startLocalVideo();
 const unit8Array = new Uint8Array([1, 2, 3]);
 trtc.sendSEIMessage(unit8Array.buffer);
} catch(error) {
 console.warn(error);
}
// 3. receive SEI
trtc.on(TRTC.EVENT.SEI_MESSAGE, event => {
 console.warn(`sei ${event.data} from ${event.userId}`);
})
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| buffer | ArrayBuffer | **required** SEI data to be sent |
| options | Object | SEI options |

**Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| seiPayloadType | Number | | **required** Set the SEI payload type. SDK uses the custom payloadType 243 by default, the business side can use this parameter to set the payloadType to the standard 5. When the business side uses the 5 payloadType, you need to follow the specification to make sure that the first 16 bytes of the `buffer` are the business side's customized uuid. |
| toSubStream | Boolean | false | Send SEI data to substream. Need call trtc.startLocalScreen first. Since v5.7.0+. |

### sendCustomMessage

sendCustomMessage(message)

Send Custom Message to all remote users in the room.

Note:

1. Only [TRTC.TYPE.ROLE_ANCHOR](module-TYPE.html#.ROLE_ANCHOR) can call sendCustomMessage.
2. You should call this api after [TRTC.enterRoom](TRTC.html#enterRoom) successfully.
3. The custom message will be sent in order and as reliably as possible, but it's possible to loss messages in a very bad network. The receiver will also receive the message in order.

**Since:** v5.6.0

**See:** Listen for the event [TRTC.EVENT.CUSTOM_MESSAGE](module-EVENT.html#.CUSTOM_MESSAGE) to receive custom message.

#### Example

```javascript
// send custom message
trtc.sendCustomMessage({
  cmdId: 1,
  data: new TextEncoder().encode('hello').buffer
});
// receive custom message
trtc.on(TRTC.EVENT.CUSTOM_MESSAGE, event => {
   // event.userId: remote userId.
   // event.cmdId: message cmdId.
   // event.seq: message sequence number.
   // event.data: custom message data, type is ArrayBuffer.
   console.log(`received custom msg from ${event.userId}, message: ${new TextDecoder().decode(event.data)}`)
})
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| message | object | **required** Custom message |

**Properties**

| Name | Type | Description |
|------|------|-------------|
| cmdId | number | **required** message Id. Integer, range [1, 10]. You can set different cmdId for different types of messages to reduce the delay of transferring message. |
| data | ArrayBuffer | **required** message content.<br>- Maximum 1KB(Byte) sent in a single call.<br>- Maximum 30 calls per second<br>- Maximum 8KB sent per second. |

### callExperimentalAPI

**(async)** callExperimentalAPI(name, options)

call experimental API

| APIName | name | param |
|---------|------|-------|
| 'enableAudioFrameEvent' | Config the pcm data of Audio Frame Event | [EnableAudioFrameEventOptions](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#EnableAudioFrameEventOptions) |

#### Example

```javascript
// Call back the pcm data of the remote user 'user_A'. The default pcm data is 48kHZ, mono
await trtc.callExperimentalAPI('enableAudioFrameEvent', { enable: true, userId: 'user_A'})
// Call back all remote pcm data and set the pcm data to 16kHZ, stereo
await trtc.callExperimentalAPI('enableAudioFrameEvent', { enable: true, userId: '*', sampleRate: 16000, channelCount: 2 })
// Set the MessagePort for the local microphone pcm data callback
await trtc.callExperimentalAPI('enableAudioFrameEvent', { enable: true, userId: '', port })
// Cancel callback of local microphone pcm data
await trtc.callExperimentalAPI('enableAudioFrameEvent', { enable: false, userId: '' })
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| name | string | **required** |
| options | EnableAudioFrameEventOptions | **required** |

### setLogLevel

**(static)** setLogLevel(level, enableUploadLog)

Set the log output level

It is recommended to set the DEBUG level during development and testing, which includes detailed prompt information.
The default output level is INFO, which includes the log information of the main functions of the SDK.

#### Example

```javascript
// Output log levels above DEBUG
TRTC.setLogLevel(1);
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| level | 0-5 | | Log output level 0: TRACE 1: DEBUG 2: INFO 3: WARN 4: ERROR 5: NONE |

### isSupported

**(static)** isSupported() → {Promise.\<object>}

Check if the TRTC Web SDK is supported by the current browser

- Reference: [Browsers Supported](tutorial-05-info-browser.html).

#### Example

```javascript
TRTC.isSupported().then((checkResult) => {
  if(!checkResult.result) {
     console.log('checkResult', checkResult.result, 'checkDetail', checkResult.detail);
     // The SDK does not support the current browser. Guide the user to use the latest version of Chrome.
  }
  const { isBrowserSupported, isWebRTCSupported, isMediaDevicesSupported, isH264EncodeSupported, isH264DecodeSupported } = checkResult.detail;
  // Different business scenarios may require varying levels of detection granularity, such as only needing pushing or pulling stream.
  // Detect whether the browser supports capturing the camera and microphone for upstreaming.
  const isPushMicrophoneSupported = isBrowserSupported && isWebRTCSupported && isMediaDevicesSupported;
  const isPushCameraSupported = isBrowserSupported && isWebRTCSupported && isMediaDevicesSupported && isH264EncodeSupported;
  // Detect whether the browser supports pulling stream.
  const isPullAudioSupported = isBrowserSupported && isWebRTCSupported;
  const isPullVideoSupported = isBrowserSupported && isWebRTCSupported && isH264DecodeSupported;
});
```

#### Returns

Promise returns the detection result

| Property | Type | Description |
|----------|------|-------------|
| checkResult.result | boolean | If true, it means the current environment supports the basic ability to capture the camera and microphone for streaming. |
| checkResult.detail.isBrowserSupported | boolean | Whether the current browser is supported by the SDK |
| checkResult.detail.isWebRTCSupported | boolean | Whether the current browser supports WebRTC |
| checkResult.detail.isWebCodecsSupported | boolean | Whether the current browser supports WebCodecs |
| checkResult.detail.isMediaDevicesSupported | boolean | Whether the current browser supports accessing media devices and capturing microphone/camera |
| checkResult.detail.isScreenShareSupported | boolean | Whether the current browser supports screen sharing functionality |
| checkResult.detail.isSmallStreamSupported | boolean | Whether the current browser supports small streams |
| checkResult.detail.isH264EncodeSupported | boolean | Whether the current browser supports H264 encoding |
| checkResult.detail.isH264DecodeSupported | boolean | Whether the current browser supports H264 decoding |
| checkResult.detail.isVp8EncodeSupported | boolean | Whether the current browser supports VP8 encoding |
| checkResult.detail.isVp8DecodeSupported | boolean | Whether the current browser supports VP8 decoding |

**Type:** Promise.\<object>

### getPermissions

**(async, static)** getPermissions(option) → {Promise.\<PermissionResult>}

Get the permission state of the camera and microphone.

**Since:** v5.13.0

#### Example

```javascript
const { camera, microphone } = await TRTC.getPermissions({
  request: true, // if true, will request permission to use the camera and microphone.
  types: ['camera', 'microphone']
});
console.log(camera, microphone); // 'granted' | 'denied' | 'prompt' | null. null means the permission is not supported query.
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| option | PermissionOption | **required** Permission options |

**Properties**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| request | boolean | true | Whether to request permission to use the camera and microphone. |
| types | Array.\<string> | ['camera', 'microphone'] | The types of permission to request. |

#### Returns

Promise returns the permission state of the camera and microphone

**Type:** Promise.\<PermissionResult>

### getCameraList

**(static)** getCameraList(requestPermission) → {Promise.\<Array.\<MediaDeviceInfo>>}

Returns the list of camera devices

**Note**

- This interface does not support use under the http protocol, please use the https protocol to deploy your website. [Privacy and security](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Privacy_and_security)
- You can call the browser's native interface [getCapabilities](https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo/getCapabilities) to get the maximum resolutions supported by the camera, frame rate, and distinguish between front and rear cameras on mobile devices, etc. This interface supports Chrome 67+, Edge 79+, Safari 17+, Opera 54+.
  - On Huawei phones, the rear camera may capture the telephoto lens. In this case, you can use this interface to obtain the rear camera with the largest supported resolution. Generally, the main camera of a phone has the largest resolution.

#### Example

```javascript
const cameraList = await TRTC.getCameraList();
if (cameraList[0] && cameraList[0].getCapabilities) {
  const { width, height, frameRate, facingMode } = cameraList[0].getCapabilities();
  console.log(width.max, height.max, frameRate.max);
  if (facingMode) {
    if (facingMode[0] === 'user') {
      // front camera
    } else if (facingMode[0] === 'environment') {
      // rear camera
    }
  }
}
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| requestPermission | boolean | true | **Since v5.6.3**. Whether to request permission to use the camera. If requestPermission is true, calling this method may temporarily open the camera to ensure that the camera list can be normally obtained, and the SDK will automatically stop the camera capture later. |

#### Returns

Promise returns an array of [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo)

**Type:** Promise.\<Array.\<MediaDeviceInfo>>

### getMicrophoneList

**(static)** getMicrophoneList(requestPermission) → {Promise.\<Array.\<MediaDeviceInfo>>}

Returns the list of microphone devices

**Note**

- This interface does not support use under the http protocol, please use the https protocol to deploy your website. [Privacy and security](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Privacy_and_security)
- You can call the browser's native interface [getCapabilities](https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo/getCapabilities) to get information about the microphone's capabilities, e.g. the maximum number of channels supported, etc. This interface supports Chrome 67+, Edge 79+, Safari 17+, Opera 54+.
- On Android, there are usually multiple microphones, and the label list is: ['default', 'Speakerphone', 'Headset earpiece'], if you do not specify the microphone in trtc.startLocalAudio, the browser default microphone may be the Headset earpiece and the sound will come out of the headset. If you need to play out through the speaker, you need to specify the microphone with the label 'Speakerphone'.

#### Example

```javascript
const microphoneList = await TRTC.getMicrophoneList();
if (microphoneList[0] && microphoneList[0].getCapabilities) {
  const { channelCount } = microphoneList[0].getCapabilities();
  console.log(channelCount.max);
}
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| requestPermission | boolean | true | **Since v5.6.3**. Whether to request permission to use the microphone. If requestPermission is true, calling this method may temporarily open the microphone to ensure that the microphone list can be normally obtained, and the SDK will automatically stop the microphone capture later. |

#### Returns

Promise returns an array of [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo)

**Type:** Promise.\<Array.\<MediaDeviceInfo>>

### getSpeakerList

**(static)** getSpeakerList(requestPermission) → {Promise.\<Array.\<MediaDeviceInfo>>}

Returns the list of speaker devices. Only support PC browser, not support mobile browser.

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| requestPermission | boolean | true | **Since v5.6.3**. Whether to request permission to use the microphone. If requestPermission is true, calling this method may temporarily open the microphone to ensure that the microphone list can be normally obtained, and the SDK will automatically stop the microphone capture later. |

#### Returns

Promise returns an array of [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo)

**Type:** Promise.\<Array.\<MediaDeviceInfo>>

### setCurrentSpeaker

**(async, static)** setCurrentSpeaker(speakerId)

Set the current speaker for audio playback

**Note**

- This interface only supports PC and Android devices.
- Android device requirements:
  - SDK version >= 5.9.0
  - Support switching between speaker and headset, i.e. pass in TRTC.TYPE.SPEAKER or TRTC.TYPE.HEADSET
  - Need to call [startLocalAudio()](TRTC.html#startLocalAudio) to collect microphone first

#### Example

```javascript
// For PC
TRTC.setCurrentSpeaker('your_expected_speaker_id');
// For Android（sdk version >= 5.9.0）
TRTC.setCurrentSpeaker(TRTC.TYPE.SPEAKER); // Switch to speaker
TRTC.setCurrentSpeaker(TRTC.TYPE.HEADSET); // Or switch to headset
```

#### Parameters

| Name | Type | Description |
|------|------|-------------|
| speakerId | string \| TRTC.TYPE.SPEAKER \| TRTC.TYPE.HEADSET | **required** Speaker ID, support passing in speaker ID or TRTC.TYPE.SPEAKER or TRTC.TYPE.HEADSET |

## EVENT

**TRTC Event List**

Listen to specific events through [trtc.on(TRTC.EVENT.XXX)](TRTC.html#on). You can use these events to manage the room user list, manage user stream state, and perceive network state. The following is a detailed introduction to the events.

> **Notice：**
> - Events need to be listened to before they are triggered, so that you can receive the corresponding event notifications. Therefore, it is recommended to complete event listening before entering the room, so as to ensure that no event notifications are missed.

### Example

```javascript
// Usage:
trtc.on(TRTC.EVENT.ERROR, () => {});
```

### Members

#### ERROR

**Default Value:** 'error'

**See:** [RtcError](RtcError.html)

Error event, non-API call error, SDK throws when an unrecoverable error occurs during operation.

- Error code (error.code): [ErrorCode.OPERATION_FAILED](module-ERROR_CODE.html#.OPERATION_FAILED)
- Possible extended error codes (error.extraCode): 5501, 5502

##### Example

```javascript
trtc.on(TRTC.EVENT.ERROR, error => {
  console.error('trtc error observed: ' + error);
  const errorCode = error.code;
  const extraCode = error.extraCode;
});
```

#### AUTOPLAY_FAILED

**Default Value:** 'autoplay-failed'

Automatic playback failed, refer to [Handle Autoplay Restriction](tutorial-21-advanced-auto-play-policy.html)

##### Example

```javascript
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, event => {
  // Guide user to click the page, SDK will resume playback automatically when user click the page.
  // Since v5.1.3+, you can get userId on this event.
  console.log(event.userId);
  // Since v5.11.0+, mediaType includes 'audio'|'video'|'screen'.
  console.log(event.mediaType);
  // Since v5.9.0+, you can call the `resume` method to resume playback of the stream corresponding to event.userId when user clicked the page.
  event.resume();
});
```

#### KICKED_OUT

**Default Value:** 'kicked-out'

Kicked out of the room for some reason, including:

- **kick**: The same user with same userId enters same room. The user who enters the room first will be kicked out of the room by the user who enters later.
  - Entering a room with the same userId is not allowed behavior, which may lead to abnormal audio/video calls between the two parties, and should be avoided on the business side.
  - Users with the same userId who enter the same room with the same audience role may not receive this event.
- **banned**: kicked out by the administrator using [Server API - RemoveUser](https://trtc.io/document/34267/34268).
- **room_disband**: kicked out by the administrator using [Server API - DismissRoom](https://trtc.io/document/34267/34269).

##### Example

```javascript
trtc.on(TRTC.EVENT.KICKED_OUT, event => {
  console.log(event.reason)
});
```

#### REMOTE_USER_ENTER

**Default Value:** 'remote-user-enter'

Remote user enters the room event.

- In `rtc` mode, all users will receive the notification of entering and exiting the room of the other user.
- In `live` mode, only the anchor has the notification of entering and exiting the room, and the audience does not have the notification of entering and exiting the room. The audience can receive the notification of entering and exiting the room of the anchor.

##### Example

```javascript
trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, event => {
  const userId = event.userId;
});
```

#### REMOTE_USER_EXIT

**Default Value:** 'remote-user-exit'

Remote user exits the room event.

- In `rtc` mode, all users will receive the notification of entering and exiting the room of the other user.
- In `live` mode, only the anchor has the notification of entering and exiting the room, and the audience does not have the notification of entering and exiting the room. The audience can receive the notification of entering and exiting the room of the anchor.

##### Example

```javascript
trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, event => {
  const userId = event.userId;
});
```

#### REMOTE_AUDIO_AVAILABLE

**Default Value:** 'remote-audio-available'

Remote user publishes audio. You will receive this notification when the remote user turns on the microphone. Refer to: [Turn on/off camera and microphone](./tutorial-15-basic-dynamic-add-video.html)

- By default, the SDK automatically plays remote audio, and you do not need to call the API to play remote audio. You can listen for this event and [REMOTE_AUDIO_UNAVAILABLE](#remote_audio_unavailable) to update the UI icon for "whether the remote microphone is turned on".
- Note: If the user has not interacted with the page before entering the room, automatic audio playback may fail due to the [browser's automatic playback policy restrictions](./tutorial-21-advanced-auto-play-policy.html). You need to refer to the [suggestions for handling automatic playback restrictions](./tutorial-21-advanced-auto-play-policy.html) for processing.
- If you do not want the SDK to automatically play audio, you can set `autoReceiveAudio` to `false` to turn off automatic audio playback when calling [trtc.enterRoom()](TRTC.html#enterRoom).
- Listen for the [TRTC.EVENT.REMOTE_AUDIO_AVAILABLE](#remote_audio_available) event, record the userId with remote audio, and call the [trtc.muteRemoteAudio(userId, false)](TRTC.html#muteRemoteAudio) method when you need to play audio.

##### Example

```javascript
// Listen before entering the room
trtc.on(TRTC.EVENT.REMOTE_AUDIO_AVAILABLE, event => {
  const userId = event.userId;
});
```

#### REMOTE_AUDIO_UNAVAILABLE

**Default Value:** 'remote-audio-unavailable'

Remote user stops publishing audio. You will receive this notification when the remote user turns off the microphone.

##### Example

```javascript
// Listen before entering the room
trtc.on(TRTC.EVENT.REMOTE_AUDIO_UNAVAILABLE, event => {
  const userId = event.userId;
});
```

#### REMOTE_VIDEO_AVAILABLE

**Default Value:** 'remote-video-available'

**See:** [STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN), [STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB)

Remote user publishes video. You will receive this notification when the remote user turns on the camera. Refer to: [Turn on/off camera and microphone](./tutorial-15-basic-dynamic-add-video.html)

- You can listen for this event and [REMOTE_VIDEO_UNAVAILABLE](#remote_video_unavailable) to update the UI icon for "whether the remote camera is turned on".

##### Example

```javascript
// Listen before entering the room
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, event => {
  const userId = event.userId;
  const streamType = event.streamType;
  trtc.startRemoteVideo({userId, streamType, view});
});
```

#### REMOTE_VIDEO_UNAVAILABLE

**Default Value:** 'remote-video-unavailable'

Remote user stops publishing video. You will receive this notification when the remote user turns off the camera.

##### Example

```javascript
// Listen before entering the room
trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, event => {
  const userId = event.userId;
  const streamType = event.streamType;
  // At this point, the SDK will automatically stop playing, and there is no need to call stopRemoteVideo.
});
```

#### AUDIO_VOLUME

**Default Value:** 'audio-volume'

Volume event

After calling the [enableAudioVolumeEvaluation](TRTC.html#enableAudioVolumeEvaluation) interface to enable the volume callback, the SDK will throw this event regularly to notify the volume of each userId.

**Note**

- The callback contains the volume of the local microphone and the volume of the remote user. The callback will be triggered regardless of whether anyone is speaking.
- The event.result will be sorted from large to small according to the volume size.
- When userId is an empty string, it represents the volume of the local microphone.
- `volume` is a positive integer with a value of 0-100.
- `floatVolume` is a float number with a value of 0-1.0. Since v5.11.1+. The floatVolume will be 0 when the microphone exception occurs. If user is not speaking, the floatVolume will be a non-zero float number.

##### Example

```javascript
trtc.on(TRTC.EVENT.AUDIO_VOLUME, event => {
   event.result.forEach(({ userId, volume, floatVolume }) => {
       const isMe = userId === ''; // When userId is an empty string, it represents the volume of the local microphone.
       if (isMe) {
           console.log(`my volume: ${volume}`);
       } else {
           console.log(`user: ${userId} volume: ${volume}`);
       }
   })
});
// Enable volume callback and trigger the event every 1000ms
trtc.enableAudioVolumeEvaluation(1000);
```

#### AUDIO_FRAME

**Since:** v5.8.3

**Default Value:** 'audio-frame'

PCM event of microphone, the pcm data can be used to do ASR. since v5.11.0, support callback of raw pcm data from remote users.

**Note**

- By default, only the microphone data is called back. If you need to subscribe to the remote user's audio, you need to call trtc.callExperimentalAPI('enableAudioFrameEvent', options) to enable the callback. For details, please visit [TRTC#callExperimentalAPI](TRTC.html#callExperimentalAPI)
- After starting the microphone or subscribing to the remote user's audio, this event is triggered every 40ms to obtain pcm data (float32 type).
- PCM data is mono and sampled at 48000Hz. Since v5.11.0, Other sampling rates and channel count can be specified through [TRTC#callExperimentalAPI](TRTC.html#callExperimentalAPI).

##### Example

```javascript
trtc.on(TRTC.EVENT.AUDIO_FRAME, event => {
  console.log(event.data) // pcm data. If it is mono, the data type is float32Array, if it is stereo, the data type is float32Array[].
  console.log(event.userId) // since v5.11.0. If userId is empty string, it means local microphone.
  console.log(event.channelCount) // since v5.11.0. 1 means mono, 2 means stereo.
  console.log(event.sampleRate) // since v5.11.0. The sampling rate of the pcm data.
});
```

#### NETWORK_QUALITY

**Default Value:** 'network-quality'

Network quality statistics data event, which starts to be counted after entering the room and triggers every two seconds. This data reflects the network quality of your local uplink and downlink.

- The uplink network quality (uplinkNetworkQuality) refers to the network situation of uploading local streams (uplink connection network quality from SDK to Tencent Cloud)
- The downlink network quality (downlinkNetworkQuality) refers to the average network situation of downloading all streams (average network quality of all downlink connections from Tencent Cloud to SDK)

The enumeration values and meanings are shown in the following table:

| Value | Meaning |
|-------|---------|
| 0 | Network state is unknown, indicating that the current trtc instance has not established an uplink/downlink connection |
| 1 | Network state is excellent |
| 2 | Network state is good |
| 3 | Network state is average |
| 4 | Network state is poor |
| 5 | Network state is very poor |
| 6 | Network connection is disconnected<br />Note: If the downlink network quality is this value, it means that all downlink connections have been disconnected |

- uplinkRTT, uplinkLoss are the uplink RTT (ms) and uplink packet loss rate.
- downlinkRTT, downlinkLoss are the average RTT (ms) and average packet loss rate of all downlink connections.

**Note**

- If you want to know the uplink and downlink network conditions of the other party, you need to broadcast the other party's network quality through IM.

##### Example

```javascript
trtc.on(TRTC.EVENT.NETWORK_QUALITY, event => {
   console.log(`network-quality, uplinkNetworkQuality:${event.uplinkNetworkQuality}, downlinkNetworkQuality: ${event.downlinkNetworkQuality}`)
   console.log(`uplink rtt:${event.uplinkRTT} loss:${event.uplinkLoss}`)
   console.log(`downlink rtt:${event.downlinkRTT} loss:${event.downlinkLoss}`)
})
```

#### CONNECTION_STATE_CHANGED

**Default Value:** 'connection-state-changed'

SDK and Tencent Cloud connection state change event, you can use this event to listen to the overall connection state of the SDK and Tencent Cloud.

- 'DISCONNECTED': Connection disconnected
- 'CONNECTING': Connecting
- 'CONNECTED': Connected

Meanings of different state changes:

- DISCONNECTED -> CONNECTING: Trying to establish a connection, triggered when calling the enter room interface or when the SDK automatically reconnects.
- CONNECTING -> DISCONNECTED: Connection establishment failed, triggered when calling the exit room interface to interrupt the connection or when the connection fails after SDK retries.
- CONNECTING -> CONNECTED: Connection established successfully, triggered when the connection is successful.
- CONNECTED -> DISCONNECTED: Connection interrupted, triggered when calling the exit room interface or when the connection is disconnected due to network anomalies.

Suggestion: You can listen to this event and display different UIs in different states to remind users of the current connection state.

##### Example

```javascript
trtc.on(TRTC.EVENT.CONNECTION_STATE_CHANGED, event => {
  const prevState = event.prevState;
  const curState = event.state;
});
```

#### AUDIO_PLAY_STATE_CHANGED

**Default Value:** 'audio-play-state-changed'

Audio playback state change event

event.userId When userId is an empty string, it represents the local user, and when it is a non-empty string, it represents a remote user.

event.state The value is as follows:

- 'PLAYING': start playing
  - event.reason is 'playing' or 'unmute'.
- 'PAUSED': pause playback
  - When event.reason is 'pause', it is triggered by the pause event of the <audio> element. The following situations will trigger:
    - Call the HTMLMediaElement.pause interface.
  - When event.reason is 'mute'. See event [MediaStreamTrack.mute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/mute_event)
    - When userId is oneself, this event is triggered, indicating that audio collection is paused, usually caused by device abnormalities, such as being preempted by other applications on the device, at this time, the user needs to be guided to recollect.
    - When userId is others, this event is triggered, indicating that the received audio data is not enough to play. Usually caused by network jitter, no processing is required on the access side. When the received data is sufficient to play, it will automatically resume.
- 'STOPPED': stop playing
  - event.reason is 'ended'.

event.reason The reason for the state change, the value is as follows:

- 'playing': start playing, see event [HTMLMediaElement.playing_event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event)
- 'mute': The audio track cannot provide data temporarily, see event [MediaStreamTrack.mute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/mute_event)
- 'unmute': The audio track resumes providing data, see event [MediaStreamTrack.unmute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/unmute_event)
- 'ended': The audio track has been closed
- 'pause': Playback paused

##### Example

```javascript
trtc.on(TRTC.EVENT.AUDIO_PLAY_STATE_CHANGED, event => {
  console.log(`${event.userId} player is ${event.state} because of ${event.reason}`);
});
```

#### VIDEO_PLAY_STATE_CHANGED

**Default Value:** 'video-play-state-changed'

Video playback state change event

event.userId When userId is an empty string, it represents the local user, and when it is a non-empty string, it represents a remote user.

event.streamType Stream type, value: [TRTC.TYPE.STREAM_TYPE_MAIN](module-TYPE.html#.STREAM_TYPE_MAIN) [TRTC.TYPE.STREAM_TYPE_SUB](module-TYPE.html#.STREAM_TYPE_SUB)

event.state The value is as follows:

- 'PLAYING': start playing
  - event.reason is 'playing' or 'unmute'.
- 'PAUSED': pause playback
  - When event.reason is 'pause', it is triggered by the pause event of the <video> element. The following situations will trigger:
    - Call the HTMLMediaElement.pause interface.
    - After successful playback, the view container for playing the video is removed from the DOM.
  - When event.reason is 'mute'. See event [MediaStreamTrack.mute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/mute_event)
    - When userId is oneself, this event is triggered, indicating that video collection is paused, usually caused by device abnormalities, such as being preempted by other applications on the device, at this time, the user needs to be guided to recollect.
    - When userId is others, this event is triggered, indicating that the received video data is not enough to play. Usually caused by network jitter, no processing is required on the access side. When the received data is sufficient to play, it will automatically resume.
- 'STOPPED': stop playing
  - event.reason is 'ended'.

event.reason The reason for the state change, the value is as follows:

- 'playing': start playing, see event [HTMLMediaElement.playing_event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event)
- 'mute': The video track cannot provide data temporarily, see event [MediaStreamTrack.mute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/mute_event)
- 'unmute': The video track resumes providing data, see event [MediaStreamTrack.unmute_event](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/unmute_event)
- 'ended': The video track has been closed
- 'pause': Playback paused

##### Example

```javascript
trtc.on(TRTC.EVENT.VIDEO_PLAY_STATE_CHANGED, event => {
  console.log(`${event.userId} ${event.streamType} video player is ${event.state} because of ${event.reason}`);
});
```

#### SCREEN_SHARE_STOPPED

**Default Value:** 'screen-share-stopped'

Notification event for local screen sharing stop, only valid for local screen sharing streams.

##### Example

```javascript
trtc.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
  console.log('screen sharing was stopped');
});
```

#### DEVICE_CHANGED

**Default Value:** 'device-changed'

Notification event for device changes such as camera and microphone.

- event.device is a [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) object with properties:
  - deviceId: device ID
  - label: device description information
  - groupId: device group ID
- event.type value: `'camera'|'microphone'|'speaker'`
- event.action value:
  - 'add' device has been added.
  - 'remove' device has been removed.
  - 'active' device has been activated, for example: after startLocalVideo is successful, this event will be triggered.

##### Example

```javascript
trtc.on(TRTC.EVENT.DEVICE_CHANGED, (event) => {
  console.log(`${event.type}(${event.device.label}) ${event.action}`);
});
```

#### PUBLISH_STATE_CHANGED

**Default Value:** 'publish-state-changed'

Publish state change event.

- event.mediaType media type, value: `'audio'|'video'|'screen'`.
- event.state current publish state, value:
  - `'starting'` trying to publish stream
  - `'started'` publish stream succeeded
  - `'stopped'` publish stream stopped, see event.reason field for the reason
- event.prevState the publish state at the last event trigger, with the same type as event.state.
- event.reason the reason for the publish state to become `'stopped'`, value:
  - `'timeout'` publish stream timeout, usually caused by network jitter or firewall interception. The SDK will keep retrying, and the business side can guide the user to check the network or change the network at this time.
  - `'error'` publish stream error, at this time, you can get the specific error information from event.error, usually caused by the browser not supporting H264 encoding.
  - `'api-call'` publish stream stopped due to business side API call, for example, stopLocalVideo was called to stop the publish stream before startLocalVideo was successful, which is a normal behavior and the business side does not need to pay attention to it.
- event.error error information when event.reason is `'error'`.

##### Example

```javascript
trtc.on(TRTC.EVENT.PUBLISH_STATE_CHANGED, (event) => {
  console.log(`${event.mediaType} ${event.state} ${event.reason}`);
});
```

#### TRACK

**Since:** v5.3.0

**Default Value:** 'track'

a new MediaStreamTrack object received.

##### Example

```javascript
trtc.on(TRTC.EVENT.TRACK, event => {
  // userId === '' means event.track is a local track, otherwise it's a remote track
  const isLocal = event.userId === '';
  // Usually the sub stream is a screen-sharing video stream.
  const isSubStream = event.streamType === TRTC.TYPE.STREAM_TYPE_SUB;
  const mediaStreamTrack = event.track;
  const kind = event.track.kind; // audio or video
})
```

#### STATISTICS

**Since:** v5.2.0

**Default Value:** 'statistics'

TRTC statistics.

- SDK will fires this event once every 2s.
- You can get the network quality, statistics of audio and video from this event. For detailed parameter description, please refer to [TRTCStatistics](global.html#TRTCStatistics).

##### Example

```javascript
trtc.on(TRTC.EVENT.STATISTICS, statistics => {
   console.warn(statistics.rtt, statistics.upLoss, statistics.downLoss);
})
```

#### SEI_MESSAGE

**Since:** v5.3.0

**Default Value:** 'sei-message'

SEI message received

##### Example

```javascript
trtc.on(TRTC.EVENT.SEI_MESSAGE, event => {
   console.log(`received sei message from ${event.userId}, data: ${event.data}, streamType: ${event.streamType}`)
})
```

#### CUSTOM_MESSAGE

**Since:** v5.6.0

**Default Value:** 'custom-message'

received a new custom message.

##### Example

```javascript
trtc.on(TRTC.EVENT.CUSTOM_MESSAGE, event => {
   // event.userId: remote userId.
   // event.cmdId: message cmdId.
   // event.seq: message sequence number.
   // event.data: custom message data, type is ArrayBuffer.
})
```

#### FIRST_VIDEO_FRAME

**Since:** v5.9.0

**Default Value:** 'first-video-frame'

started rendering the first video frame of the local or a remote user.

##### Example

```javascript
trtc.on(TRTC.EVENT.FIRST_VIDEO_FRAME, event => {
   // event.height: video height.
   // event.width: video width.
   // event.streamType: video stream type.
   // event.userId: The user ID of the local or a remote user. If it is empty, it indicates that the first local video frame is available; if it is not empty, it indicates that the first video frame of a remote user is available.
})
```

#### PERMISSION_STATE_CHANGE

**Since:** v5.13.0

**Default Value:** 'permission-state-change'

Permission state change event

##### Example

```javascript
trtc.on(TRTC.EVENT.PERMISSION_STATE_CHANGE, event => {
   // event.camera: camera permission state.
   // event.microphone: microphone permission state.
})
```

#### VIDEO_SIZE_CHANGED

**Since:** v5.13.0

**Default Value:** 'video-size-changed'

Video size changed event

##### Example

```javascript
trtc.on(TRTC.EVENT.VIDEO_SIZE_CHANGED, event => {
   // event.newHeight: video height.
   // event.newWidth: video width.
   // event.streamType: video stream type.
   // event.userId: The user ID of the local or a remote user. If it is empty, it indicates that video is the local video and the local user has not entered the room; if it is not empty, it indicates that video is remote video or local user enter room already.
})
```

### Type Definitions

#### EnableAudioFrameEventOptions

**Properties:**

| Name | Type | Attributes | Default | Description |
|------|------|------------|---------|-------------|
| enable | boolean |  |  | Whether to enable callback of audio frame |
| userId | string |  |  | The userId of the monitored user. '' indicates local microphone data, '*' indicates monitoring the audio data of all remote users. |
| sampleRate | number | optional | 48000 | Set the sampling rate of pcm data, the default is 48000. Support 8000, 16000, 32000, 44100, 48000 |
| channelCount | number | optional | 1 | Set the number of channels of pcm data, the default is 1. Support 1, 2 |
| port | MessagePort | optional |  | Set the MessagePort for the pcm callback |

enableAudioFrameEvent Options

## ERROR_CODE

TRTC SDK v5.0 defines 8 types of error codes, and handles them through the RtcError object.

**See:**
- [RtcError](RtcError.html)
- [TRTC.EVENT.ERROR](module-EVENT.html#.ERROR)

### Example

```javascript
// Usage:
// 1. API call error
trtc.startLocalVideo().catch(error => {
 if (error.code === TRTC.ERROR_CODE.DEVICE_ERROR) {}
});
// 2. Non-API call error, the error that the SDK cannot recover after internal retry
trtc.on(TRTC.EVENT.ERROR, (error) => {
   if (error.code === TRTC.ERROR_CODE.OPERATION_FAILED) {}
});
```

### Members

#### INVALID_PARAMETER

**Default Value:** `5000`

**Description:** The parameters passed in when calling the interface do not meet the API requirements.

**Handling suggestion:** Please check whether the passed-in parameters comply with the API specifications, such as whether the parameter type is correct.

| extraCode | Description |
|-----------|-------------|
| 5001 | The required parameter is not passed in |
| 5002 | The parameter type is incorrect |
| 5003 | The parameter is empty |
| 5004 | The parameter instance is incorrect |
| 5005 | The parameter value is out of range |
| 5006 | The parameter value is less than 0 |
| 5007 | The parameter value is less than the minimum value |
| 5008 | The parameter value is greater than the maximum value |
| 5009 | The elementId cannot be found on the page or was not found on the page when searching |
| 5010 | The parameter passed in is not of type HTMLElement |
| 5011 | streamId does not meet the specifications |
| 5012 | The range of the incoming roomId does not comply with the specifications [1, 4294967294] |
| 5013 | The strRoomId type passed in is not a legal string |
| 5014 | When the userId is not '*', a streamType needs to be passed in |
| 5015 | roomId or strRoomId not passed in, one of them must be passed in |
| 5016 | roomId must be a numeric type. Currently, a string type has been passed in. If you need to use a string as the room id, please use strRoomId |
| 5017 | The size of arraybuffer cannot be empty. Thrown from [TRTC.sendSEIMessage](TRTC.html#sendSEIMessage), [TRTC.sendCustomMessage](TRTC.html#sendCustomMessage) |
| 5018 | The arraybuffer is oversize. Thrown from [TRTC.sendSEIMessage](TRTC.html#sendSEIMessage), [TRTC.sendCustomMessage](TRTC.html#sendCustomMessage) |

#### INVALID_OPERATION

**Default Value:** `5100`

**Description:** The prerequisite requirements of the API are not met when calling the interface.

**Handling suggestion:** Please check whether the calling logic complies with the API prerequisite requirements according to the corresponding API document. For example: 1. Switching roles before entering the room successfully, 2. The remote user and stream being played do not exist.

| extraCode | Description |
|-----------|-------------|
| 5101 | The API is called without entering the room, such as startRemoteVideo muteRemoteAudio switchRole and other APIs need to be called after entering the room |
| 5102 | The remote user does not exist, for example, when startRemoteVideo is called, the userId passed in corresponds to a remote user who is not in the room. |
| 5103 | The remote stream type does not exist, for example, when startRemoteVideo is called, streamType = TRTC.TYPE.STREAM_TYPE.SUB is passed in, but the corresponding remote user does not share the screen. |
| 5104 | Repeatedly calling the API, for example, after entering the room successfully, enterRoom interface is called again. |
| 5105 | Calling the API without the camera being enabled. For example, virtual background plugins require the camera to be enabled for use. |
| 5106 | Calling the API without the microphone being enabled. For example, AI noise reduction plugins require the microphone to be enabled for use. |
| 5107 | Role [TRTC.TYPE.ROLE_AUDIENCE](module-TYPE.html#.ROLE_AUDIENCE) cannot call this api. |
| 5108 | You should enable SEI by TRTC.create({ enableSEI: true }) |
| 5109 | You need to publish video before sendSEIMessage |

#### ENV_NOT_SUPPORTED

**Default Value:** `5200`

**Description:** The current environment does not support this function, indicating that the current browser does not support calling the corresponding API.

**Handling suggestion:** Usually, TRTC.isSupported can be used to perceive which capabilities the current browser supports. If the browser does not support it, you need to guide the user to use a browser that supports this capability. Reference: [Check Environment and Device Before Calls](tutorial-23-advanced-support-detection.html)

| extraCode | Description |
|-----------|-------------|
| 5201 | The current page protocol is not HTTPS, and the audio and video capture (pushing, linking) capabilities are not supported |
| 5202 | The current browser does not support WebRTC capabilities, the browser version is too low, or |
| 5203 | The browser does not support H264 encoding capability |
| 5204 | The browser does not support H264 decoding capability |
| 5205 | The browser does not support screen sharing capability |
| 5206 | The browser does not support small stream encoding capability |
| 5207 | The browser does not support SEI receiving and sending capabilities |
| 5208 | The browser does not support WebGL. |
| 5209 | The current version of the browser does not support this feature. Please upgrade to the latest version. |
| 5210 | The current version of the browser does not support this plugin. Please upgrade to the latest version. |

#### DEVICE_ERROR

**Default Value:** `5300`

**Description:** Exception occurred when obtaining device or capturing microphone/camera/screen sharing.

The following API will throw this error code when an exception occurs: [trtc.startLocalAudio](TRTC.html#startLocalAudio) [trtc.startLocalVideo](TRTC.html#startLocalVideo) [trtc.startScreenShare](TRTC.html#startScreenShare)

**Suggestion:** Guide the user to check whether the device has a camera and microphone, whether the system has authorized the browser, and whether the browser has authorized the page. It is recommended to increase the device detection process before entering the room to confirm whether the microphone and camera exist and can be captured normally before proceeding to the next call operation. Usually, this exception can be avoided after the device check. [Check Environment and Device Before Calls](tutorial-23-advanced-support-detection.html)

If you need to distinguish more detailed exception categories, you can process according to the following extraCode:

| extraCode | Description |
|-----------|-------------|
| 5301 | NotFoundError(DOMException) thrown by the browser <br> Reason: The media device type that meets the request parameters cannot be found (including: audio, video, screen sharing). For example: The PC does not have a camera, but the browser is requested to obtain a video stream, which will report this error. <br> Suggestion: It is recommended to guide users to check the camera or microphone and other external devices required for the call before the call. |
| 5302 | NotAllowedError(DOMException) thrown by the browser <br> Reason: <li>The user refused the microphone, camera, and screen sharing requests of the current browser instance.</li><li>The permission of camera/microphone/screen sharing has been denied by system.</li><br> Suggestion: <li>Prompt the user to authorize the camera/microphone access before audio and video calls can be made.</li><li>If the browser permission is denied by the system, rtcError will have rtcError.handler method, which can be called to jump to the System Permission Setting APP, so as to facilitate the user to open the permission.</li> |
| 5303 | NotReadableError(DOMException) thrown by the browser <br> Reason: Although the user has authorized the use of the corresponding device, due to errors that occurred on some hardware, browser, or webpage levels on the operating system, or other applications occupying the device, the device cannot be accessed by the browser.<br> Suggestion: Handle according to the browser's error message, and prompt the user: "Unable to access the camera/microphone temporarily, please ensure that there are no other applications requesting access to the camera/microphone, and try again" |
| 5303 | NotReadableError(DOMException) thrown by the browser <br> Reason: Although the user has authorized the use of the corresponding device, due to errors that occurred on some hardware, browser, or webpage levels on the operating system, or other applications occupying the device, the device cannot be accessed by the browser.<br> Suggestion: 1-If this problem occurs with Windows Camera, the user will be directed to check whether the device is occupied. Only the camera of Windows system will be exclusive, but the microphone will not be exclusive. 2-If this error occurs with the microphone and camera of other systems, the user will be directed to check whether the device is normal or try to restart the browser. |
| 5304 | OverconstrainedError(DOMException) thrown by the browser <br> Reason: The value of the cameraId/microphoneId parameter is invalid <br> Suggestion: Check whether cameraId/microphoneId is the value returned by the device information acquisition interface |
| 5305 | InvalidStateError(DOMException) thrown by the browser <br> Reason: The current page has not generated interaction, and the page is not fully activated <br> Suggestion: It is recommended to turn on the camera and microphone after the user has clicked on the page to generate interaction |
| 5306 | SecurityError(DOMException) thrown by the browser <br> Reason: The system security policy prohibits the use of the device<br> Suggestion: Check whether the system restricts the use of the device, and recommend turning on the camera and microphone after the user clicks on the page to generate interaction |
| 5307 | AbortError(DOMException) thrown by the browser <br> Reason: The device cannot be used due to some unknown reasons <br> Suggestion: It is recommended to replace the device or browser, and recheck whether the device is normal |
| 5308 | Camera capture exception, after SDK retry, the capture cannot be restored. <br> Reason: Camera exception or the user manually closes the capture permission of the browser <br> Suggestion: Prompt the user that the camera capture is abnormal, and guide the user to check whether the camera is normal and whether there is a capture permission |
| 5309 | Microphone capture exception, after SDK retry, the capture cannot be restored. <br> Reason: Microphone exception or the user manually closes the capture permission of the browser <br> Suggestion: Prompt the user that the microphone capture is abnormal, and guide the user to check whether the microphone is normal and whether there is a capture permission |

**Reference:** [getUserMedia exception](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#%E5%BC%82%E5%B8%B8) and [getDisplayMedia exception](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#%E5%BC%82%E5%B8%B8)

##### Example

```javascript
trtc.startLocalVideo(...).catch(function(rtcError) {
 if(rtcError.code == TRTC.ERROR_CODE.DEVICE_ERROR) {
   // Guide the user to check the device
   switch(rtcError.extraCode) {
     case 5301:
       // Can't find a camera or microphone, guide the user to check if the microphone and camera are working.
       break;
     case 5302:
       if (error.handler) {
         // Prompt the user the browser permission(camera/microphone/screen sharing) has been denied by system. The browser will jump to the System Settings APP, please enable the relevant permissions!
       } else {
         // Prompt the user to allow camera, microphone, and screen share capture permissions on the page.
       }
       break;
     // ...
   }
 }
})
```

#### SERVER_ERROR

**Default Value:** `5400`

**Description:** This error code is thrown when abnormal data is returned from the server.

The following interfaces will throw this error code when an exception occurs: `enterRoom`, `startLocalVideo`, `startLocalAudio`, `startScreenShare`, `startRemoteVideo`, `switchRole`

**Handling suggestion:** Server exceptions are usually handled during development. Common exceptions include: expired userSig, Tencent Cloud account arrears, TRTC service not enabled, etc. The server returns abnormal data for the following reasons.

| extraCode | Description |
|-----------|-------------|
| 5401 | The feature requires a purchase of a package. |
| -8 | Incorrect sdkAppId, please check if sdkAppId is correctly filled in |
| -10012 | roomId is not passed in or roomId does not meet the specifications. If you need to use the string type roomId, please use strRoomId instead when calling trtc.enterRoom |
| -10015 | Failed to obtain server node |
| -10016 | Server internal communication timeout, timeout is 3s |
| -10035 | Server switch room failed |
| -10037 | The anchor role does not support switching the room |
| -100006 | Failed to check permissions. After enabling advanced permission control, please check whether the privateMapKey parameter carried by [enterRoom](TRTC.html#enterRoom) is correct. Please see [Enable advanced permission settings](https://trtc.io/document/35157?product=rtcengine) |
| -100013 | Customer service arrears, please log in to the [TRTC Console](https://console.trtc.io/), click the application you created, click [Account Information], and you can confirm the service status in the account information panel |
| -100021 | Server overload, failed to enter the room |
| -100022 | Server allocation failed |
| -100024 | Failed to enter the room due to TRTC service not enabled. Please go to the [IM Console](https://console.intl.cloud.tencent.com/im) to enable TRTC service for your application |
| -102006 | Flow control defined error code (add user failed) |
| -102010 | After enabling advanced permission control, the user does not have the permission to create a room. Please see [Enable advanced permission settings](https://trtc.io/document/35157?product=rtcengine) |
| -102023 | Request parameter error (request parameter error generated by the backend interface service) |
| 70001 | userSig expired, please try to regenerate. If it expires just after generation, please check whether the validity period is too small or mistakenly filled in as 0 |
| 70002 | userSig length is 0, please confirm whether the signature calculation is correct, access sign_src to get the idiotic source code of the calculation signature, check the parameters, and ensure the correctness of the signature calculation |
| 70003 | userSig verification failed, please confirm whether the userSig content is truncated, such as content truncation caused by insufficient buffer length |
| 70004 | userSig verification failed, please confirm whether the userSig content is truncated, such as content truncation caused by insufficient buffer length |
| 70005 | userSig verification failed, use tools to verify whether the generated userSig is correct |
| 70006 | userSig verification failed, use tools to verify whether the generated userSig is correct |
| 70007 | userSig verification failed, use tools to verify whether the generated userSig is correct |
| 70008 | userSig verification failed, use tools to verify whether the generated userSig is correct |
| 70009 | Failed to verify userSig with business public key, please confirm whether the userSig used for generation corresponds to the private key and sdkAppId |
| 70010 | userSig verification failed, use tools to verify whether the generated userSig is correct |
| 70013 | userId in userSig does not match the userId filled in when requesting, please check whether the userId filled in when logging in is consistent with that in userSig |
| 70014 | sdkAppId in userSig does not match the sdkAppId filled in when requesting, please check whether the sdkAppId filled in when logging in is consistent with that in userSig |
| 70015 | No verification method corresponding to the sdkAppId and account type was found. Please confirm whether the account integration operation has been performed |
| 70016 | The length of the pulled public key is 0. Please confirm whether the public key has been uploaded. If the public key is re-uploaded, please try again after ten minutes. |
| 70017 | Internal third-party ticket verification timed out. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70018 | Internal verification of third-party tickets failed. |
| 70019 | The ticket field verified by HTTPS is empty. Please fill in userSig correctly. |
| 70020 | sdkAppId not found. Please confirm whether it has been configured on Tencent Cloud. |
| 70052 | userSig has expired. Please regenerate and try again. |
| 70101 | Request packet information is empty. |
| 70102 | Account type in request packet is incorrect. |
| 70103 | Phone number format is incorrect. |
| 70104 | Email format is incorrect. |
| 70105 | TLS account format is incorrect. |
| 70106 | Illegal account format type. |
| 70107 | userId is not registered. |
| 70113 | Batch quantity is invalid. |
| 70114 | Restricted for security reasons. |
| 70115 | uin is not the developer uin corresponding to sdkAppId. |
| 70140 | sdkAppId and acctype do not match. |
| 70145 | Account type is incorrect. |
| 70169 | Internal error. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70201 | Internal error. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70202 | Internal error. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70203 | Internal error. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70204 | sdkAppId does not have a corresponding acctype. |
| 70205 | Failed to find acctype. Please try again. |
| 70206 | Batch quantity in request is invalid. |
| 70207 | Internal error. Please try again. |
| 70208 | Internal error. Please try again. |
| 70209 | Failed to obtain developer uin flag. |
| 70210 | uin in request is not a developer uin. |
| 70211 | uin in request is illegal. |
| 70212 | Internal error. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70213 | Failed to access internal data. Please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70214 | Failed to verify internal ticket. |
| 70221 | Invalid login status, please re-authenticate with UserSig. |
| 70222 | Internal error, please try again. |
| 70225 | Internal error, please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70231 | Internal error, please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70236 | Failed to verify user signature. |
| 70308 | Internal error, please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70346 | Ticket verification failed. |
| 70347 | Ticket verification failed due to expiration. |
| 70348 | Internal error, please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70362 | Internal timeout, please try again. If multiple retries are unsuccessful, please contact TLS account support, QQ: 3268519604. |
| 70401 | Internal error, please try again. |
| 70402 | Invalid parameter. Please check if the required fields are filled in and if the filling meets the protocol requirements. |
| 70403 | The initiator is not an App administrator and does not have permission to operate. |
| 70050 | Limited due to failure and too many retries. Please check if the ticket is correct and try again in one minute. |
| 70051 | The account has been blacklisted. Please contact TLS account support, QQ: 3268519604. |

#### OPERATION_FAILED

**Default Value:** `5500`

**Description:** The exception that the SDK cannot solve after multiple retries under the condition of meeting the API call requirements, usually caused by browser or network problems.

The following interfaces will throw this error code when an exception occurs: `enterRoom`, `startLocalVideo`, `startLocalAudio`, `startScreenShare`, `startRemoteVideo`, `switchRole`

**Handling suggestions:**
- Confirm whether the domain name and port required for communication meet your network environment requirements, refer to the document [Handle Firewall Restriction](tutorial-34-advanced-proxy.html)

| extraCode | Description |
|-----------|-------------|
| 5501 | Firewall restriction: After multiple retries, the SDK still cannot establish a media connection, which will cause streaming and pulling to fail. <br />Handling suggestions: Refer to the tutorial [Handle Firewall Restriction](tutorial-34-advanced-proxy.html) |
| 5502 | Re-entering the room failed: When the user experiences a network outage of more than 30s, the SDK will try to re-enter the room to restore the call, but the re-entry may fail due to the expiration of userSig, and this error will be thrown.<br />Handling suggestions: When encountering this error, you can use the latest userSig to call [TRTC.enterRoom](TRTC.html#enterRoom) to enter the room again |
| 5503 | Re-entering the room failed: When the user experiences a network outage of more than 30s, the SDK will try to re-enter the room to restore the call, but the re-entry may fail due to the expiration of userSig, and this error will be thrown.<br />Handling suggestions: When encountering this error, you can use the latest userSig to call [TRTC.enterRoom](TRTC.html#enterRoom) to enter the room again |
| 5505 | Video encoding failed. Usually, the device does not support h264 encoding. <br />Solution: Android devices from some manufacturers do not have H264 encoding capabilities (i.e., they cannot push streams). If you want to use the TRTC Web SDK to push streams in the browsers of these devices, please submit [Web SDK User Capability Support Application](https://console.tencentcloud.com/workorder/category) to enable VP8 encoding and decoding capabilities. |
| 5506 | Audio encoding failed. <br />Solution: When encountering this error, you can upgrade to the latest SDK version, or prompt the user to upgrade to the latest system version. |
| 5507 | Video decoding failed. Usually, the device does not support h264 decoding. <br />Solution: . |
| 5508 | Audio decoding failed. <br />Solution: When encountering this error, you can upgrade to the latest SDK version, or prompt the user to upgrade to the latest system version. |

#### OPERATION_ABORT

**Default Value:** `5998`

**Description:** The error code thrown when the API execution is aborted. When the API is called or repeatedly called without meeting the API lifecycle, the API will abort execution to avoid meaningless operations. <br>For example: Call enterRoom, startLocalXxx and other interfaces continuously, and call exitRoom without entering the room.<br>

The following interfaces will throw this error code when an exception occurs: `enterRoom`, `startLocalVideo`, `startLocalAudio`, `startScreenShare`, `startRemoteVideo`, `switchRole`

**Handling suggestions:** Capture and identify this error code, then avoid unnecessary calls in business logic, or you can do nothing, because the SDK has done side-effect-free processing, you only need to identify and ignore this error code when catching it.

#### UNKNOWN_ERROR

**Default Value:** `5999`

**Description:** Unknown error or undefined error

## TYPE

**TRTC Constants**

### Example

```javascript
// Usage:
TRTC.TYPE.SCENE_LIVE
```

### Members

#### SCENE_LIVE

**Default Value:** `'live'`

Live streaming scene

#### SCENE_RTC

**Default Value:** `'rtc'`

RTC scene

#### ROLE_ANCHOR

**Default Value:** `'anchor'`

Anchor role

#### ROLE_AUDIENCE

**Default Value:** `'audience'`

Audience role

#### STREAM_TYPE_MAIN

**Default Value:** `'main'`

Main stream

- TRTC has a main video stream (main stream) and an sub video stream (sub stream)
- The camera is published through the main stream, and the screen sharing is published through the sub stream.
- The main video stream includes: high-definition large picture and low-definition small picture. By default, [TRTC.startRemoteVideo](TRTC.html#startRemoteVideo) plays the high-definition large picture, and the low-definition small picture can be played through the small parameter. Refer to: [Enable small stream function](./tutorial-27-advanced-small-stream.html).

#### STREAM_TYPE_SUB

**Default Value:** `'sub'`

Sub stream

#### AUDIO_PROFILE_STANDARD

**Default Value:** `'standard'`

Standard audio quality

| Audio Profile | Sampling Rate | Channel | Bitrate (kbps) |
|---------------|---------------|---------|----------------|
| TRTC.TYPE.AUDIO_PROFILE_STANDARD | 48000 | Mono | 40 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH | 48000 | Mono | 128 |
| TRTC.TYPE.AUDIO_PROFILE_STANDARD_STEREO | 48000 | Stereo | 64 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH_STEREO | 48000 | Stereo | 192 |

#### AUDIO_PROFILE_STANDARD_STEREO

**Default Value:** `'standard-stereo'`

Standard stereo audio quality

| Audio Profile | Sampling Rate | Channel | Bitrate (kbps) |
|---------------|---------------|---------|----------------|
| TRTC.TYPE.AUDIO_PROFILE_STANDARD | 48000 | Mono | 40 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH | 48000 | Mono | 128 |
| TRTC.TYPE.AUDIO_PROFILE_STANDARD_STEREO | 48000 | Stereo | 64 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH_STEREO | 48000 | Stereo | 192 |

#### AUDIO_PROFILE_HIGH

**Default Value:** `'high'`

High audio quality

| Audio Profile | Sampling Rate | Channel | Bitrate (kbps) |
|---------------|---------------|---------|----------------|
| TRTC.TYPE.AUDIO_PROFILE_STANDARD | 48000 | Mono | 40 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH | 48000 | Mono | 128 |
| TRTC.TYPE.AUDIO_PROFILE_STANDARD_STEREO | 48000 | Stereo | 64 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH_STEREO | 48000 | Stereo | 192 |

#### AUDIO_PROFILE_HIGH_STEREO

**Default Value:** `'high-stereo'`

High-quality stereo audio

| Audio Profile | Sampling Rate | Channel | Bitrate (kbps) |
|---------------|---------------|---------|----------------|
| TRTC.TYPE.AUDIO_PROFILE_STANDARD | 48000 | Mono | 40 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH | 48000 | Mono | 128 |
| TRTC.TYPE.AUDIO_PROFILE_STANDARD_STEREO | 48000 | Stereo | 64 |
| TRTC.TYPE.AUDIO_PROFILE_HIGH_STEREO | 48000 | Stereo | 192 |

#### QOS_PREFERENCE_SMOOTH

**Default Value:** `'smooth'`

When the network is weak, the video encoding strategy takes 'smooth' first, i.e., the priority is to preserve frame rate.

Default 'smooth' first for camera, 'default' clear first for screen sharing

#### QOS_PREFERENCE_CLEAR

**Default Value:** `'clear'`

When the network is weak, the video encoding strategy takes 'clear' first, i.e., the priority is to preserve resolution.

Default 'smooth' first for camera, 'default' clear first for screen sharing

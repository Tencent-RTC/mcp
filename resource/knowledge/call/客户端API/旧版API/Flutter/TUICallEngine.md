---
sync_node_id: '114033055633088512'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "旧版 API"
  - "Flutter"
  - "TUICallEngine"
product: "call"
---
 APIs listed on this page are legacy APIs. If you are a new developer, it is strongly recommended to use the new version API, which provides better performance and enhanced features.

## Overview

|API|Description|
|---------|---------|
|init|Authenticates the basic audio/video call capabilities.|
|||
|[unInit](#unInit)|The destructor function, which releases resources used by TUICallEngine.|
|addObserver|Registers an event listener.|
|removeObserver|Unregisters an event listener.|
|calls|Starts a call.|
|accept|Accepts a call.|
|reject|Rejects a call.|
|hangup|Ends a call.|
|ignore|Ignores a call.|
|inviteUser|Invites others to join the call.|
|join|Joins the call.|
|startRemoteView|Subscribes to the video stream of a remote user.|
|stopRemoteView|Unsubscribes from the video stream of a remote user.|
|openCamera|Turns the camera on.|
|closeCamera|Turns the camera off.|
|switchCamera|Switches between the front and rear cameras.|
|openMicrophone|Turns the mic on.|
|closeMicrophone|Turns the mic off.|
|selectAudioPlaybackDevice|Selects the audio playback device (receiver or speaker).|
|[setSelfInfo](#setSelfInfo)|Sets the alias and profile photo.|
|enableMultiDeviceAbility|Sets whether to enable multi-device login for TUICallEngine (supported by the premium package).|
|setVideoRenderParams|Sets the rendering mode of video image.|
|setVideoEncoderParams|Sets the encoding parameters of video encoder.|
|setBlurBackground|Sets Blurry Video Effect|
|setVirtualBackground|Sets Virtual Background Image|
|setBeautyLevel|Sets beauty level, support turning off default beauty.|

## Details

### init

This API is used to initialize `TUICallEngine`. Call it to authenticate the call service and perform other required actions before you call other APIs.
``` java
Future<TUIResult> init(int sdkAppID, String userId, String userSig)
```

### unInit

The destructor function, which releases resources used by TUICallEngine.
``` java
Future<TUIResult> unInit()
```

### addObserver

This API is used to register an event listener to listen for `TUICallObserver` events.
``` java
Future<void> addObserver(TUICallObserver observer)
```

### removeObserver

This API is used to unregister an event listener.
``` java
Future<void> removeObserver(TUICallObserver observer)
```

### calls

Initiate a call. **Supported by v2.9+.**
``` java
Future<TUIResult> calls(List<String> userIdList, TUICallMediaType mediaType, TUICallParams params)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|List<String>|The target user IDs.|
|callMediaType|TUICallMediaType|The call type, which can be video or audio.|
|params|TUICallParams|An additional parameter. such as roomID, call timeout, offline push info, etc|

### accept

This API is used to accept a call. After receiving the `onCallReceived()` callback, you can call this API to accept the call.
``` java
Future<TUIResult> accept()
```

### reject

This API is used to reject a call. After receiving the `onCallReceived()` callback, you can call this API to reject the call.
``` java
Future<TUIResult> reject()
```

### ignore

This API is used to ignore a call. After receiving the `onCallReceived()`, you can call this API to ignore the call. The caller will receive the `onUserLineBusy` callback.

Note: If your project involves live streaming or conferencing, you can also use this API to implement the “in a meeting” or “on air” feature.
``` java
Future<TUIResult> ignore()
```

### hangup

This API is used to end a call.
``` java
Future<TUIResult> hangup()
```

### inviteUser

This API is used to invite users to the current group call.

This API is called by a participant of a group call to invite new users.
``` java
Future<void> iniviteUser(List<String> userIdList, TUICallParams params, TUIValueCallback callback)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|List<String> |The target user IDs.|
|params|TUICallParams|An additional parameter. such as roomID, call timeout, offline push info, etc.|

### join

Actively join the call. **Supported by v2.9+.**
``` java
Future<void> join(String callId)
```

|Parameter|Type|Description|
|---------|---------|---------|
|callId|String|Unique ID for this call.|

### startRemoteView

This API is used to set the view object to display a remote video.
``` java
Future<void> startRemoteView(String userId, intviewId)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|intviewId|int|The ID of the widget in the video rendering screen|

### stopRemoteView

This API is used to unsubscribe from the video stream of a remote user.
``` java
Future<void> stopRemoteView(String userId)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|

### openCamera

This API is used to turn the camera on.
``` java
Future<TUIResult> openCamera(TUICamera camera, int? viewId)
```

|Parameter|Type|Description|
|---------|---------|---------|
|camera|TUICamera|The front or rear camera.|
|viewId|int|The ID of the widget in the video rendering screen|

### closeCamera

This API is used to turn the camera off.
``` java
Future<void> closeCamera()
```

### switchCamera

This API is used to switch between the front and rear cameras.
``` java
Future<void> switchCamera(TUICamera camera)
```

|Parameter|Type|Description|
|---------|---------|---------|
|camera|TUICamera|The front or rear camera.|

### openMicrophone

This API is used to turn the mic on.
``` java
Future<TUIResult> openMicrophone()
```

### closeMicrophone

This API is used to turn the mic off.
``` java
Future<void> closeMicrophone()
```

### selectAudioPlaybackDevice

This API is used to select the audio playback device (receiver or speaker). In call scenarios, you can use this API to turn on/off hands-free mode.

``` java
Future<void> selectAudioPlaybackDevice(TUIAudioPlaybackDevice device)
```

|Parameter|Type|Description|
|---------|---------|---------|
|device|TUIAudioPlaybackDevice|The speaker or receiver.|

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.
``` java
Future<TUIResult> setSelfInfo(String nickname, String avatar)
```

### enableMultiDeviceAbility

This API is used to set whether to enable multi-device login for `TUICallEngine` (supported by the premium package).
``` java
Future<TUIResult> enableMultiDeviceAbility(bool enable)
```

### setVideoRenderParams

Set the rendering mode of video image.
``` java
Future<TUIResult> setVideoRenderParams(String userId, VideoRenderParams params)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|params|VideoRenderParams|Video render parameters.|

### setVideoEncoderParams

Set the encoding parameters of video encoder.

This setting can determine the quality of image viewed by remote users, which is also the image quality of on-cloud recording files.
``` java
Future<TUIResult> setVideoEncoderParams(VideoEncoderParams params)
```

|Parameter|Type|Description|
|---------|---------|---------|
|params|VideoEncoderParams|Video encoding parameters|

### setBeautyLevel

Set beauty level, support turning off default beauty.
``` java
Future<TUIResult> setBeautyLevel(double level)
```

|Parameter|Type|Description|
|---------|---------|---------|
|level|double|Beauty level, range 0.0 to 9.0.|

### setBlurBackground

Setting Blurry Video Effect.
``` javascript
void setBlurBackground(int level, Function(int code, String message)? errorCallback)
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|level|int|0: Off, 1: Low, 2: Medium, 3: High.|

### setVirtualBackground

Setting Virtual Background Image.
``` javascript
void setVirtualBackground(String imagePath, Function(int code, String message)? errorCallback)
```

|Parameter|Type|Meaning|
|---------|---------|---------|
|imagePath|String|Image Filename. The file needs to be added to the assets of the main project.|

## Deprecated interfaces

### call

This API is used to make a (one-to-one) call.

> **Note：**
> This interface has been deprecated in v2.9+. It is recommended to use the calls interface instead.
> 

``` java
Future<TUIResult> call(String userId, TUICallMediaType mediaType, TUICallParams params)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|mediaType|TUICallMediaType|The call type, which can be video or audio.|
|params|TUICallParams|An additional parameter, such as roomID, call timeout, offline push info, etc.|

### groupCall

This API is used to make a group call. 

Before making a group call, you need to create an IM group first.

> **Note：**
> This interface has been deprecated in v2.9+. It is recommended to use the calls interface instead.
> 

``` java
Future<TUIResult> groupCall(String groupId, List<String> userIdList, TUICallMediaType mediaType, TUICallParams params)
```

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|String|The group ID.|
|userIdList|List<String> |The target user IDs.|
|mediaType|TUICallMediaType|The call type, which can be video or audio.|
|params|TUICallParams|An additional parameter. such as roomID, call timeout, offline push info, etc.|

### joinInGroupCall

This API is used to join a group call.

This API is called by a group member to join the group’s call.

> **Note：**
> This interface has been deprecated in v2.9+. It is recommended to use the join interface instead.
> 

``` java
Future<TUIResult> joinInGroupCall(TUIRoomId roomId, String groupId, TUICallMediaType mediaType)
```

|Parameter|Type|Description|
|---------|---------|---------|
|roomId|TUIRoomId|The room ID. |
|groupId|String|The group ID.|
|mediaType|TUICallMediaType|The call type, which can be video or audio.|

### switchCallMediaType

This API is used to change the call type.
``` java
Future<void> switchCallMediaType(TUICallMediaType mediaType)
```

|Parameter|Type|Description|
|---------|---------|---------|
|mediaType|TUICallMediaType|The call type, which can be video or audio.|

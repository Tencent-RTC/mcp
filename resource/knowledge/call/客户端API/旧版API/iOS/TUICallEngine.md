---
sync_node_id: '95825005164183552'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "旧版 API"
  - "iOS"
  - "TUICallEngine"
product: "call"
---
## TUICallEngine APIs

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.

## Overview

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
|[ignore](https://www.tencentcloud.com/document/product/647/51012#ignore)|Ignore call.|
|[inviteUser](https://www.tencentcloud.com/document/product/647/51012#inviteUser)|Invite users to the current call.|
|[startRemoteView](https://www.tencentcloud.com/document/product/647/51012#startRemoteView)|Subscribe to the video stream of a remote user.|
|[stopRemoteView](https://www.tencentcloud.com/document/product/647/51012#stopRemoteView)|Unsubscribe from the video stream of a remote user.|
|[openCamera](https://www.tencentcloud.com/document/product/647/51012#openCamera)|Turn on the camera.|
|[closeCamera](https://www.tencentcloud.com/document/product/647/51012#closeCamera)|Turn off the camera.|
|[switchCamera](https://www.tencentcloud.com/document/product/647/51012#switchCamera)|Switch camera.|
|[openMicrophone](https://www.tencentcloud.com/document/product/647/51012#openMicrophone)|Enable microphone.|
|[closeMicrophone](https://www.tencentcloud.com/document/product/647/51012#closeMicrophone)|Disable the microphone.|
|[selectAudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/51012#selectAudioPlaybackDevice)|Select the audio playback device (Earpiece/Speakerphone).|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51012#setSelfInfo)|Set the user's profile picture and nickname.|
|[enableMultiDeviceAbility](https://www.tencentcloud.com/document/product/647/51012#enableMultiDeviceAbility)|Sets whether to enable multi-device login for TUICallEngine (supported by the [Group Call package](https://trtc.io/document/54632)).|
|[setVideoRenderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoRenderParams)|Set the rendering mode of video.|
|[setVideoEncoderParams](https://www.tencentcloud.com/document/product/647/51012#setVideoEncoderParams)|Set the encoding parameters of video encoder.|
|[getTRTCCloudInstance](https://www.tencentcloud.com/document/product/647/51012#getTRTCCloudInstance)|Advanced features.|
|[setBeautyLevel](https://www.tencentcloud.com/document/product/647/51012#setBeautyLevel)|Set beauty level, support turning off default beauty.|

## Details

### createInstance

This API is used to create a `TUICallEngine` singleton.
``` objectivec
- (TUICallEngine *)createInstance;
```

### destroyInstance

This API is used to Destroy `TUICallEngine` singleton.
``` objectivec
- (void)destroyInstance;
```

### init

This API is used to initialize `TUICallEngine`. Call it to authenticate the call service and perform other required actions before you call other APIs.
``` objectivec
- (void)init:(NSString *)sdkAppID userId:(NSString *)userId userSig:(NSString *)userSig succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|sdkAppID|NSString|You can view `SDKAppID` in [Application Management](https://console.cloud.tencent.com/trtc/app) > **Application Info** of the TRTC console.|
|userId|NSString|The ID of the current user, which is a string that can contain only letters (a-z and A-Z), digits (0-9), hyphens (-), and underscores (_).|
|userSig|NSString|Tencent Cloud's proprietary security signature. For how to calculate and use it, see [UserSig](https://www.tencentcloud.com/document/product/647/35166).|

### addObserver

This API is used to register an event listener to listen for [TUICallObserver](https://www.tencentcloud.com/document/product/647/51013) events.
``` objectivec
- (void)addObserver:(id<TUICallObserver>)observer;
```

### removeObserver

This API is used to unregister an event listener.
``` objectivec
- (void)removeObserver:(id<TUICallObserver>)observer;
```

### calls

Initiate a call. 
``` objectivec

- (void)calls:(NSArray<NSString *> *)userIdList callMediaType:(TUICallMediaType)callMediaType params:(TUICallParams *)params succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userIdList| NSArray|List of target users' userId|
|callMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|Media type of the call, such as video call or voice call|
|params|[TUICallParams](https://www.tencentcloud.com/document/product/647/54902#TUICallParams)|Call extension parameters, such as room number, call invitation timeout, offline push content, etc|

### join

Proactively join a call. 
``` objectivec
- (void)join:(NSString *)callId succ:(TUICallSucc)succ fail:(TUICallFail)fail
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|callId|NSString|Unique ID for this call|

### accept

This API is used to accept a call. After receiving the `onCallReceived()` callback, you can call this API to accept the call.
``` objectivec
- (void)accept:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### reject

This API is used to reject a call. After receiving the `onCallReceived()` callback, you can call this API to reject the call.
``` objectivec
- (void)reject:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### ignore

This API is used to ignore a call. After receiving the `onCallReceived()`, you can call this API to ignore the call. The caller will receive the `onUserLineBusy` callback.

Note: If your project involves live streaming or conferencing, you can also use this API to implement the “in a meeting” or “on air” feature.
``` objectivec
- (void)ignore:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### hangup

This API is used to end a call.
``` objectivec
- (void)hangup:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### inviteUser

This API is used to invite users to the current call.

This API is called by a participant of a call to invite new users.
``` objectivec
- (void)inviteUser:(NSArray<NSString *> *)userIdList params:(TUICallParams *)params succ:(void(^)(NSArray <NSString *> *userIdList))succ fail:(TUICallFail)fail
```

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|NSArray|The target user IDs.|
|params|[TUICallParams](https://www.tencentcloud.com/document/product/647/54902#TUICallParams)|An additional parameter. such as roomID, call timeout, offline push info, etc|

> **Note：**
> In this case, the custom RoomId is invalid. The SDK will invite others to join the room where the inviter is currently located.
> 

### startRemoteView

This API is used to set the view object to display a remote video.
``` objectivec
- (void)startRemoteView:(NSString *)userId videoView:(TUIVideoView *)videoView onPlaying:(void(^)(NSString *userId))onPlaying onLoading:(void(^)(NSString *userId))onLoading onError:(void(^)(NSString *userId, int code, NSString *errMsg))onError;
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The target user ID.|
|videoView|TUIVideoView|The view to be rendered.|

### stopRemoteView

This API is used to unsubscribe from the video stream of a remote user.
``` objectivec
- (void)stopRemoteView:(NSString *)userId;
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The target user ID.|

### openCamera

This API is used to turn the camera on.
``` objectivec
- (void)openCamera:(TUICamera)camera videoView:(TUIVideoView *)videoView succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|camera|[TUICamera](https://www.tencentcloud.com/document/product/647/54902#TUICamera)|The front or rear camera.|
|videoView|TUIVideoView|The view to be rendered.|

### closeCamera

This API is used to turn the camera off.
``` objectivec
- (void)closeCamera;
```

### switchCamera

This API is used to switch between the front and rear cameras.
``` objectivec
- (void)switchCamera:(TUICamera)camera;
```

|Parameter|Type|Description|
|---------|---------|---------|
|camera|[TUICamera](https://www.tencentcloud.com/document/product/647/54902#TUICamera)|The front or rear camera.|

### openMicrophone

This API is used to turn the microphone on.
``` objectivec
- (void)openMicrophone:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### closeMicrophone

This API is used to turn the microphone off.
``` objectivec
- (void)closeMicrophone;
```

### selectAudioPlaybackDevice

This API is used to select the audio playback device ( Earpiece and Speakerphone). In call scenarios, you can use this API to turn on/off hands-free mode.
``` objectivec
- (void)selectAudioPlaybackDevice:(TUIAudioPlaybackDevice)device;
```

|Parameter|Type|Description|
|---------|---------|---------|
|device|[TUIAudioPlaybackDevice](https://www.tencentcloud.com/document/product/647/54902#TUIAudioPlaybackDevice)|The Earpiece and Speakerphone.|

### setSelfInfo

This API is used to set the nickname and profile picture. The nickname cannot exceed 500 bytes, and the profile picture is specified by a URL.
``` objectivec
- (void)setSelfInfo:(NSString * _Nullable)nickName avatar:(NSString * _Nullable)avatar succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### enableMultiDeviceAbility

This API is used to set whether to enable multi-device login for `TUICallEngine`  (supported by the [Group Call package](https://trtc.io/document/54632)).
``` objectivec
- (void)enableMultiDeviceAbility:(BOOL)enable succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

### setVideoRenderParams

Set the rendering mode of video image.
``` objectivec
- (void)setVideoRenderParams:(NSString *)userId params:(TUIVideoRenderParams *)params succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The target user ID.|
|params|[TUIVideoRenderParams](https://www.tencentcloud.com/document/product/647/54902#TUIVideoRenderParams)|Video render parameters.|

### setVideoEncoderParams

Set the encoding parameters of video encoder.

This setting can determine the quality of image viewed by remote users, which is also the image quality of on-cloud recording files.
``` objectivec
- (void)setVideoEncoderParams:(TUIVideoEncoderParams *)params succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|params|[TUIVideoEncoderParams](https://www.tencentcloud.com/document/product/647/54902#TUIVideoEncoderParams)|Video encoding parameters|

### getTRTCCloudInstance

Advanced features.
``` objectivec
- (TRTCCloud *)getTRTCCloudInstance;
```

### setBeautyLevel

Set beauty level, support turning off default beauty.
``` objectivec

- (void)setBeautyLevel:(CGFloat)level succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|level|CGFloat|Beauty level，range: 0 - 9；<br>0 means turning off the effect, 9 means the most obvious effect.|

## Deprecated Interface

### call

This API is used to make a (one-to-one) call. **Note:  it is recommended to use the calls API.**
``` objectivec
- (void)call:(NSString *)userId callMediaType:(TUICallMediaType)callMediaType params:(TUICallParams *)params succ:(TUICallSucc)succ fail:(TUICallFail)fail
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The target user ID.|
|callMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
|params|[TUICallParams](https://www.tencentcloud.com/document/product/647/54902#TUICallParams)|An additional parameter, such as roomID, call timeout, offline push info, etc|

### groupCall

This API is used to make a group call.  **Note:  it is recommended to use the calls API.**
``` objectivec
- (void)groupCall:(NSString *)groupId userIdList:(NSArray <NSString *> *)userIdList callMediaType:(TUICallMediaType)callMediaType params:(TUICallParams *)params succ:(TUICallSucc)succ fail:(TUICallFail)fail
```

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|NSString|The group ID.|
|userIdList|NSArray|The target user IDs.|
|callMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
|params|[TUICallParams](https://www.tencentcloud.com/document/product/647/54902#TUICallParams)|An additional parameter. such as roomID, call timeout, offline push info, etc|

### joinInGroupCall

This API is used to join a group call.

This API is called by a group member to join the group’s call. **Note:  it is recommended to use the join API.**
``` objectivec
- (void)joinInGroupCall:(TUIRoomId *)roomId groupId:(NSString *)groupId callMediaType:(TUICallMediaType)callMediaType succ:(TUICallSucc)succ fail:(TUICallFail)fail;
```

|Parameter|Type|Description|
|---------|---------|---------|
|roomId|[TUIRoomId](https://www.tencentcloud.com/document/product/647/54902#TUIRoomId)|The room ID. |
|groupId|NSString|The group ID.|
|callMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|

### switchCallMediaType

This API is used to change the call type.
``` objectivec
- (void)switchCallMediaType:(TUICallMediaType)newType;
```

|Parameter|Type|Description|
|---------|---------|---------|
|callMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|

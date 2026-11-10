---
sync_node_id: '95825013653016576'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "旧版 API"
  - "iOS"
  - "TUICallObserver"
product: "call"
---
## TUICallObserver APIs

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

## Overview

|API|Description|
|---------|---------|
|[onError](https://www.tencentcloud.com/document/product/647/51013#onError)|An error occurred during the call.|
|[onCallReceived](https://www.tencentcloud.com/document/product/647/51013#onCallReceived)|A call was received.|
|[onCallBegin](https://www.tencentcloud.com/document/product/647/51013#onCallBegin)|The call was connected.|
|[onCallEnd](https://www.tencentcloud.com/document/product/647/51013#onCallEnd)|The call ended.|
|[onCallNotConnected](https://www.tencentcloud.com/document/product/647/51013#onCallNotConnected)|The call not connected.|
|[onUserReject](https://www.tencentcloud.com/document/product/647/51013#onUserReject)|A user declined the call.|
|[onUserNoResponse](https://www.tencentcloud.com/document/product/647/51013#onUserNoResponse)|A user didn't respond.|
|[onUserLineBusy](https://www.tencentcloud.com/document/product/647/51013#onUserLineBusy)|A user was busy.|
|[onUserInviting](https://www.tencentcloud.com/document/product/647/51013#onUserInviting)|A user is invited to join a call.|
|[onUserJoin](https://www.tencentcloud.com/document/product/647/51013#onUserJoin)|A user joined the call.|
|[onUserLeave](https://www.tencentcloud.com/document/product/647/51013#onUserLeave)|A user left the call.|
|[onUserVideoAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserVideoAvailable)|Whether a user had a video stream.|
|[onUserAudioAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserAudioAvailable)|Whether a user had an audio stream.|
|[onUserVoiceVolumeChanged](https://www.tencentcloud.com/document/product/647/51013#onUserVoiceVolumeChanged)|The volume levels of all users.|
|[onUserNetworkQualityChanged](https://www.tencentcloud.com/document/product/647/51013#onUserNetworkQualityChanged)|The network quality of all users.|
|[onKickedOffline](https://www.tencentcloud.com/document/product/647/51013#onKickedOffline)|The current user was kicked offline.|
|[onUserSigExpired](https://www.tencentcloud.com/document/product/647/51013#onUserSigExpired)|The user sig is expired.|

## Details

### onError

An error occurred.

> **Note:**
> This callback indicates that the SDK encountered an unrecoverable error. Such errors must be listened for, and UI reminders should be sent to users if necessary.
> 

``` objc
- (void)onError:(int)code message:(NSString * _Nullable)message;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|code|int|The error code.|
|message|NSString|The error message.|

### onCallReceived

A call invitation was received. This callback is received by an invitee. You can listen for this event to determine whether to display the incoming call view.
``` objc
- (void)onCallReceived:(NSString *)callId callerId:(NSString *)callerId calleeIdList:(NSArray<NSString *> *)calleeIdList mediaType:(TUICallMediaType)mediaType info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|callId|NSString|Unique ID of this call|
|callerId|NSString|Caller ID |
|calleeIdList|NSArray|Callee ID List|
|mediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
|info|[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#TUICallObserverExtraInfo)|Extended information|

### onCallBegin

The call was connected. This callback is received by both the inviter and invitees. You can listen for this event to determine whether to start on-cloud recording, content moderation, or other tasks.
``` swift
- (void)onCallBegin:(NSString *)callId mediaType:(TUICallMediaType)mediaType info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|callId|NSString|Unique ID of this call|
|mediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
|info|[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#TUICallObserverExtraInfo)|Extended information|

### onCallEnd

The call ended. This callback is received by both the inviter and invitees. You can listen for this event to determine when to display call information such as call duration and call type, or stop on-cloud recording.
``` swift
- (void)onCallEnd:(NSString *)callId mediaType:(TUICallMediaType)mediaType reason:(TUICallEndReason)reason userId:(NSString *)userId totalTime:(float)totalTime info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|callId|NSString|Unique ID of this call|
|mediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
|reason|[TUICallEndReason](https://www.tencentcloud.com/document/product/647/54902#TUICallEndReason)|Call end reason|
|userId|NSString|​​Ended by user ID|
|totalTime|float|The call duration.|
|info|[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#TUICallObserverExtraInfo)|Extended information|

> **Note:**
> Client-side callbacks are often lost when errors occur, for example, when the process is closed. If you need to measure the duration of a call for billing or other purposes, we recommend you use the RESTful API.
> 

### onCallNotConnected

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: The caller will simultaneously receive the [onUserNoResponse](#onUserNoResponse) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](#onUserReject) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](#onUserLineBusy) and onCallNotConnected callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` objc
   - (void)onCallNotConnected:(NSString *)callId mediaType:(TUICallMediaType)mediaType reason:(TUICallEndReason)reaso userId:(NSString *)userId info:(TUICallObserverExtraInfo *)info
   ```

   The parameters are described below:

   |Parameter|Type|Description|
   |---------|---------|---------|
   |callId|NSString|Unique ID of this call|
   |mediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type, which can be video or audio.|
   |reason|[TUICallEndReason](https://www.tencentcloud.com/document/product/647/54902#TUICallEndReason)|Call not connected reason|
   |userId|NSString|​​Not connected by user ID|
   |info|[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#TUICallObserverExtraInfo)|Extended information|

### onUserReject

The call was rejected. In a one-to-one call, only the inviter will receive this callback. In a group call, all invitees will receive this callback.
``` swift
- (void)onUserReject:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID of the invitee who rejected the call.|

### onUserNoResponse

A user did not respond.
``` swift
- (void)onUserNoResponse:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID of the invitee who did not answer.|

### onUserLineBusy

A user is busy.
``` swift
- (void)onUserLineBusy:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID of the invitee who is busy.|

### onUserInviting

A user is invited to join a call.
``` objectivec
- (void)onUserInviting:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID of the invite.|

### onUserJoin

A user joined the call.
``` swift
- (void)onUserJoin:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The ID of the user who joined the call.|

### onUserLeave

A user left the call.
``` swift
- (void)onUserLeave:(NSString *)userId;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The ID of the user who left the call.|

### onUserVideoAvailable

Whether a user is sending video.
``` swift
- (void)onUserVideoAvailable:(NSString *)userId isVideoAvailable:(BOOL)isVideoAvailable;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID.|
|isVideoAvailable|BOOL|Whether the user has video.|

### onUserAudioAvailable

Whether a user is sending audio.
``` swift
- (void)onUserAudioAvailable:(NSString *)userId isAudioAvailable:(BOOL)isAudioAvailable;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|NSString|The user ID.|
|isAudioAvailable|BOOL|Whether the user has audio.|

### onUserVoiceVolumeChanged

The volumes of all users.
``` swift
- (void)onUserVoiceVolumeChanged:(NSDictionary <NSString *, NSNumber *> *)volumeMap;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|volumeMap|NSDictionary|The volume table, which includes the volume of each user (`userId`). Value range: 0-100.|

### onUserNetworkQualityChanged

The network quality of all users.
``` swift
- (void)onUserNetworkQualityChanged:(NSArray<TUINetworkQualityInfo *> *)networkQualityList;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|networkQualityList|NSArray|The current network conditions for all users (`userId`).|

### onKickedOffline

The current user was kicked offline：At this time, you can prompt the user with a UI message and then invoke `init` again.
``` objectivec
- (void)onKickedOffline;
```

### onUserSigExpired

The userSig is expired：At this time, you need to generate a new `userSig`, and then invoke `init` again.
``` objectivec
- (void)onUserSigExpired;
```

## Deprecated Interface

### onCallCancelled

The call was canceled by the inviter or timed out. This callback is received by an invitee. You can listen for this event to determine whether to show a missed call message.

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](#onUserNoResponse) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](#onUserReject) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](#onUserLineBusy) and onCallCancelled callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` objc
   - (void)onCallCancelled:(NSString *)callerId;
   ```

   The parameters are described below:

   |Parameter|Type|Description|
   |---------|---------|---------|
   |callerId|NSString|The user ID of the inviter.|

### onCallMediaTypeChanged

The call type changed.
``` swift
- (void)onCallMediaTypeChanged:(TUICallMediaType)oldCallMediaType newCallMediaType:(TUICallMediaType)newCallMediaType;
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|oldCallMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type before the change.|
|newCallMediaType|[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#TUICallMediaType)|The call type after the change.|

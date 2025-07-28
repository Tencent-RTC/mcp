## TUICallObserver APIs

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

## Overview
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
<td rowspan="1" colSpan="1" >[onCallBegin](https://www.tencentcloud.com/document/product/647/51013#onCallBegin)</td>

<td rowspan="1" colSpan="1" >The call was connected.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://www.tencentcloud.com/document/product/647/51013#onCallEnd)</td>

<td rowspan="1" colSpan="1" >The call ended.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallNotConnected](https://www.tencentcloud.com/document/product/647/51013#onCallNotConnected)</td>

<td rowspan="1" colSpan="1" >The call not connected.</td>
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
<td rowspan="1" colSpan="1" >[onUserInviting](https://www.tencentcloud.com/document/product/647/51013#onUserInviting)</td>

<td rowspan="1" colSpan="1" >A user is invited to join a call.</td>
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

<td rowspan="1" colSpan="1" >Whether a user had a video stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://www.tencentcloud.com/document/product/647/51013#onUserAudioAvailable)</td>

<td rowspan="1" colSpan="1" >Whether a user had an audio stream.</td>
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


## Details

### onError

An error occurred.

> **Note:**
> 

> This callback indicates that the SDK encountered an unrecoverable error. Such errors must be listened for, and UI reminders should be sent to users if necessary.
> 

``` objc
- (void)onError:(int)code message:(NSString * _Nullable)message;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >code</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >The error code.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >message</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The error message.</td>
</tr>
</table>


### onCallReceived

A call invitation was received. This callback is received by an invitee. You can listen for this event to determine whether to display the incoming call view.
``` objc
- (void)onCallReceived:(NSString *)callId callerId:(NSString *)callerId calleeIdList:(NSArray<NSString *> *)calleeIdList mediaType:(TUICallMediaType)mediaType info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callerId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >Caller ID </td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >calleeIdList</td>

<td rowspan="1" colSpan="1" >NSArray</td>

<td rowspan="1" colSpan="1" >Callee ID List</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#ObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallBegin

The call was connected. This callback is received by both the inviter and invitees. You can listen for this event to determine whether to start on-cloud recording, content moderation, or other tasks.
``` swift
- (void)onCallBegin:(NSString *)callId mediaType:(TUICallMediaType)mediaType info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#ObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallEnd

The call ended. This callback is received by both the inviter and invitees. You can listen for this event to determine when to display call information such as call duration and call type, or stop on-cloud recording.
``` swift
- (void)onCallEnd:(NSString *)callId mediaType:(TUICallMediaType)mediaType reason:(TUICallEndReason)reason userId:(NSString *)userId totalTime:(float)totalTime info:(TUICallObserverExtraInfo *)info;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallEndReason](https://www.tencentcloud.com/document/product/647/54902#EndReason)</td>

<td rowspan="1" colSpan="1" >Call end reason</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >​​Ended by user ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >float</td>

<td rowspan="1" colSpan="1" >The call duration.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#ObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


> **Note:**
> 

> Client-side callbacks are often lost when errors occur, for example, when the process is closed. If you need to measure the duration of a call for billing or other purposes, we recommend you use the RESTful API.
> 


### onCallNotConnected

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](https://www.tencentcloud.com/document/product/647/54902#onUserNoResponse) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](https://www.tencentcloud.com/document/product/647/54902#onUserReject) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](https://www.tencentcloud.com/document/product/647/54902#onUserLineBusy) and onCallNotConnected callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` objc
   - (void)onCallNotConnected:(NSString *)callId mediaType:(TUICallMediaType)mediaType reason:(TUICallEndReason)reaso userId:(NSString *)userId info:(TUICallObserverExtraInfo *)info
   ```

   The parameters are described below:

<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallEndReason](https://www.tencentcloud.com/document/product/647/54902#TUICallEndReason)</td>

<td rowspan="1" colSpan="1" >Call not connected reason</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >​​Not connected by user ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallObserverExtraInfo](https://www.tencentcloud.com/document/product/647/54902#CallObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onUserReject

The call was rejected. In a one-to-one call, only the inviter will receive this callback. In a group call, all invitees will receive this callback.
``` swift
- (void)onUserReject:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who rejected the call.</td>
</tr>
</table>


### onUserNoResponse

A user did not respond.
``` swift
- (void)onUserNoResponse:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who did not answer.</td>
</tr>
</table>


### onUserLineBusy

A user is busy.
``` swift
- (void)onUserLineBusy:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who is busy.</td>
</tr>
</table>


### onUserInviting

A user is invited to join a call.
``` objectivec
- (void)onUserInviting:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID of the invite.</td>
</tr>
</table>


### onUserJoin

A user joined the call.
``` swift
- (void)onUserJoin:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The ID of the user who joined the call.</td>
</tr>
</table>


### onUserLeave

A user left the call.
``` swift
- (void)onUserLeave:(NSString *)userId;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The ID of the user who left the call.</td>
</tr>
</table>


### onUserVideoAvailable

Whether a user is sending video.
``` swift
- (void)onUserVideoAvailable:(NSString *)userId isVideoAvailable:(BOOL)isVideoAvailable;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isVideoAvailable</td>

<td rowspan="1" colSpan="1" >BOOL</td>

<td rowspan="1" colSpan="1" >Whether the user has video.</td>
</tr>
</table>


### onUserAudioAvailable

Whether a user is sending audio.
``` swift
- (void)onUserAudioAvailable:(NSString *)userId isAudioAvailable:(BOOL)isAudioAvailable;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isAudioAvailable</td>

<td rowspan="1" colSpan="1" >BOOL</td>

<td rowspan="1" colSpan="1" >Whether the user has audio.</td>
</tr>
</table>


### onUserVoiceVolumeChanged

The volumes of all users.
``` swift
- (void)onUserVoiceVolumeChanged:(NSDictionary <NSString *, NSNumber *> *)volumeMap;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >volumeMap</td>

<td rowspan="1" colSpan="1" >NSDictionary</td>

<td rowspan="1" colSpan="1" >The volume table, which includes the volume of each user (`userId`). Value range: 0-100.</td>
</tr>
</table>


### onUserNetworkQualityChanged

The network quality of all users.
``` swift
- (void)onUserNetworkQualityChanged:(NSArray<TUINetworkQualityInfo *> *)networkQualityList;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >networkQualityList</td>

<td rowspan="1" colSpan="1" >NSArray</td>

<td rowspan="1" colSpan="1" >The current network conditions for all users (`userId`).</td>
</tr>
</table>


### onKickedOffline

The current user was kicked offline：At this time, you can prompt the user with a UI message and then invoke `init` again.
``` objectivec
- (void)onKickedOffline;
```

### onUserSigExpired

The user sig is expired：At this time, you need to generate a new `userSig`, and then invoke `init` again.
``` objectivec
- (void)onUserSigExpired;
```

## Deprecated Interface

### onCallCancelled

The call was canceled by the inviter or timed out. This callback is received by an invitee. You can listen for this event to determine whether to show a missed call message.

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](https://www.tencentcloud.com/document/product/647/51013#onUserNoResponse) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](https://www.tencentcloud.com/document/product/647/51013#onUserReject) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](https://www.tencentcloud.com/document/product/647/51013#onUserLineBusy) and onCallCancelled callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` objc
   - (void)onCallCancelled:(NSString *)callerId;
   ```

   The parameters are described below:

<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callerId</td>

<td rowspan="1" colSpan="1" >NSString</td>

<td rowspan="1" colSpan="1" >The user ID of the inviter.</td>
</tr>
</table>


### onCallMediaTypeChanged

The call type changed.
``` swift
- (void)onCallMediaTypeChanged:(TUICallMediaType)oldCallMediaType newCallMediaType:(TUICallMediaType)newCallMediaType;
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >oldCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type before the change.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >newCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://www.tencentcloud.com/document/product/647/54902#MediaType)</td>

<td rowspan="1" colSpan="1" >The call type after the change.</td>
</tr>
</table>

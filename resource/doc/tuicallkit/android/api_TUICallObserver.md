## TUICallObserver APIs

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

## Overview
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onError](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A call occurred during the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallReceived](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A call invitation was received.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallBegin](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The call was connected.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The call ended.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallNotConnected](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The call not connected.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserReject](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user declined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNoResponse](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user didn't respond.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLineBusy](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user was busy.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserInviting](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user is invited to join a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserJoin](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user joined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLeave](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >A user left the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVideoAvailable](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >Whether a user had a video stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >Whether a user had an audio stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVoiceVolumeChanged](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The volume levels of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNetworkQualityChanged](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The network quality of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onKickedOffline](https://write.woa.com/document/95824769596342272)</td>

<td rowspan="1" colSpan="1" >The current user was kicked offline.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserSigExpired](https://write.woa.com/document/95824769596342272)</td>

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

``` java
void onError(int code, String message);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The error message.</td>
</tr>
</table>


### onCallReceived

A call invitation was received. This callback is received by an invitee. You can listen for this event to determine whether to display the incoming call view.
``` java
void onCallReceived(String callId, String callerId, List<String> calleeIdList, 
                    TUICallDefine.MediaType mediaType, TUICallDefine.CallObserverExtraInfo info);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callerId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Caller ID </td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >calleeIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >Callee ID List</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallBegin

The call was connected. This callback is received by both the inviter and invitees. You can listen for this event to determine whether to start on-cloud recording, content moderation, or other tasks.
``` java
void onCallBegin(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallObserverExtraInfo info);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallEnd

The call ended. This callback is received by both the inviter and invitees. You can listen for this event to determine when to display call information such as call duration and call type, or stop on-cloud recording.
``` java
void onCallEnd(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallEndReason reason, 
               String userId, long totalTime, TUICallDefine.CallObserverExtraInfo info);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallEndReason](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Call end reason</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >​​Ended by user ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >long</td>

<td rowspan="1" colSpan="1" >The call duration.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


> **Note:**
> 

> Client-side callbacks are often lost when errors occur, for example, when the process is closed. If you need to measure the duration of a call for billing or other purposes, we recommend you use the RESTful API.
> 


### onCallNotConnected

The call was canceled by the inviter or timed out. This callback is received by an invitee. You can listen for this event to determine whether to show a missed call message.

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](https://write.woa.com/document/95824769596342272) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](https://write.woa.com/document/95824769596342272) and onCallNotConnected callbacks (userId is his own ID); the callee receives the onCallNotConnected callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](https://write.woa.com/document/95824769596342272) and onCallNotConnected callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` java
   void onCallNotConnected(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallEndReason reason, 
                           String userId, TUICallDefine.CallObserverExtraInfo info);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallEndReason](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Call end reason</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >​​Not connected by user ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onUserReject

The call was rejected. In a one-to-one call, only the inviter will receive this callback. In a group call, all invitees will receive this callback.
``` java
void onUserReject(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who rejected the call.</td>
</tr>
</table>


### onUserNoResponse

A user did not respond.
``` java
void onUserNoResponse(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who did not answer.</td>
</tr>
</table>


### onUserInviting

A user is invited to join a call.
``` java
void onUserInviting(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the invite.</td>
</tr>
</table>


### onUserLineBusy

A user is busy.
``` java
void onUserLineBusy(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who is busy.</td>
</tr>
</table>


### onUserJoin

A user joined the call.
``` java
void onUserJoin(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The ID of the user who joined the call.</td>
</tr>
</table>


### onUserLeave

A user left the call.
``` java
void onUserLeave(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The ID of the user who left the call.</td>
</tr>
</table>


### onUserVideoAvailable

Whether a user is sending video.
``` java
void onUserVideoAvailable(String userId, boolean isVideoAvailable);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isVideoAvailable</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >Whether the user has video.</td>
</tr>
</table>


### onUserAudioAvailable

Whether a user is sending audio.
``` java
void onUserAudioAvailable(String userId, boolean isAudioAvailable);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isAudioAvailable</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >Whether the user has audio.</td>
</tr>
</table>


### onUserVoiceVolumeChanged

The volumes of all users.
``` java
void onUserVoiceVolumeChanged(Map<String, Integer> volumeMap);
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

<td rowspan="1" colSpan="1" >Map</td>

<td rowspan="1" colSpan="1" >The volume table, which includes the volume of each user (`userId`). Value range: 0-100.</td>
</tr>
</table>


### onUserNetworkQualityChanged

The network quality of all users.
``` java
void onUserNetworkQualityChanged(List<TUICallDefine.NetworkQualityInfo> networkQualityList);
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

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >The current network conditions for all users (`userId`).</td>
</tr>
</table>


### onKickedOffline

The current user was kicked offline: At this time, you can prompt the user with a UI message and then invoke `init` again.
``` java
void onKickedOffline();
```

### onUserSigExpired

The user sig is expired: At this time, you need to generate a new `userSig`, and then invoke `init` again.
``` java
void onUserSigExpired();
```

## Deprecated Interface

### onCallCancelled

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) 

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](https://write.woa.com/document/95824769596342272) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee rejection: The caller will simultaneously receive the [onUserReject](https://write.woa.com/document/95824769596342272) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) 

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](https://write.woa.com/document/95824769596342272) and onCallCancelled callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` java
   void onCallCancelled(String userId);
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

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the inviter.</td>
</tr>
</table>


### onCallMediaTypeChanged

The call type changed.
``` java
void onCallMediaTypeChanged(TUICallDefine.MediaType oldCallMediaType,TUICallDefine.MediaType newCallMediaType);
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

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type before the change.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >newCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type after the change.</td>
</tr>
</table>

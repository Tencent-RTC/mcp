## TUICallObserver API

`TUICallObserver` is the callback class of `TUICallEngine`. You can use it to listen for events.

## Overview
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onError](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A call occurred during the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserInviting](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >Callback when a user is invited to join a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallReceived](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A call invitation was received.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallNotConnected](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >Callback for call cancellation</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallBegin](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The call was connected.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The call ended.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallMediaTypeChanged](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The call type changed.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserReject](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A user declined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNoResponse](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A user didn't respond.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLineBusy](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A user was busy.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserJoin](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A user joined the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLeave](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >A user left the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVideoAvailable](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >Whether a user had a video stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >Whether a user had an audio stream.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVoiceVolumeChanged](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The volume levels of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNetworkQualityChanged](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The network quality of all users.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onKickedOffline](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The current user was kicked offline.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserSigExpired](https://write.woa.com/document/114033041802629120)</td>

<td rowspan="1" colSpan="1" >The user sig is expired.</td>
</tr>
</table>


## Details

Listen to the events thrown by the Flutter plugin through addObserver.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onError: (int code, String message) { 
     
    },onCallCancelled: (String callerId) {  
     
    }, onCallBegin: (TUIRoomId roomId, TUICallMediaType callMediaType, TUICallRole callRole) {
       
    }, onCallEnd: (TUIRoomId roomId, TUICallMediaType callMediaType, TUICallRole callRole, double totalTime) {  
     
    }, onCallMediaTypeChanged: (TUICallMediaType oldCallMediaType, TUICallMediaType newCallMediaType) { 
    
    }, onUserReject: (String userId) {  
  
    }, onUserNoResponse: (String userId) { 
    
    }, onUserLineBusy: (String onUserLineBusy) { 
   
    }, onUserJoin: (String userId) {
  
    }, onUserLeave: (String userId) { 
      
    }, onUserVideoAvailable: (String userId, bool isVideoAvailable) { 
         
    }, onUserAudioAvailable: (String userId, bool isAudioAvailable) {  
       
    }, onUserNetworkQualityChanged: (List<TUINetworkQualityInfo> networkQualityList) {
  
    }, onCallReceived: (String callerId, List<String> calleeIdList, String groupId, TUICallMediaType callMediaType) {
  
    }, onUserVoiceVolumeChanged: (Map<String, int> volumeMap) {  
  
    }, onKickedOffline: () { 
   
    }, onUserSigExpired: () {  
   
    }  
));
```

### onError

An error occurred.

> **Note:**
> 

> This callback indicates that the SDK encountered an unrecoverable error. Such errors must be listened for, and UI reminders should be sent to users if necessary.
> 

``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onError: (int code, String message) {
    }
));
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


### onUserInviting

Callback when a user is invited to join a call.
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserInviting: (String userId) {
      // TODO
    }
));
```

The parameters are listed in the table below.
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >ID of the invited user</td>
</tr>
</table>


### onCallReceived

Received a new incoming call request callback, the callee will receive it. You can listen to this event to determine whether to display the call answering interface.
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallReceived: (String callId, String callerId, List<String> calleeIdList, TUICallMediaType mediaType, CallObserverExtraInfo info) {
      // TODO
    }
));
```

The parameters are listed in the table below.
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callerId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Calling ID (inviter)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >calleeIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >Called ID list (invitees)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Media type of the call. For example: `TUICallMediaType.video` or `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallNotConnected

Callback for call cancellation.
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
  onCallNotConnected: (String callId, TUICallMediaType mediaType, CallEndReason reason,
    String userId, CallObserverExtraInfo info) {
    // TODO
  }
));
```

The parameters are listed in the table below.
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Media type of the call. For example: `TUICallMediaType.video` or `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[CallEndReason](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The causes for call termination</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >User ID ending the call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallBegin

Indicates that the call is connected, and both the caller and callee can receive it. You can listen to this event to start processes such as cloud recording and content review.
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallBegin: (String callId, TUICallMediaType mediaType, CallObserverExtraInfo info) {
    // TODO
  }
));
```

The parameters are listed in the table below.
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Media type of the call. For example: `TUICallMediaType.video` or `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


### onCallEnd

Indicates that the call is connected, and both the caller and callee can receive it. You can listen to this event to display information such as call duration and call type, or to stop the cloud recording process.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallEnd: (String callId, TUICallMediaType mediaType, CallEndReason reason,
        String userId, double totalTime, CallObserverExtraInfo info) {
    // TODO
  }
));
```

The parameters are listed in the table below.
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID of this call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Media type of the call. For example: `TUICallMediaType.video` or `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[CallEndReason](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The causes for call termination</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >User ID ending the call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >double</td>

<td rowspan="1" colSpan="1" >Duration of this call, unit ms</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Extended information</td>
</tr>
</table>


> **Note:**
> 

> Events on the client side are generally lost due to exceptions such as process termination. If you need to complete billing logic by monitoring call duration, it is recommended to use REST API to complete such processes.
> 


### onCallMediaTypeChanged

The call type changed.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallMediaTypeChanged: (TUICallMediaType oldCallMediaType, TUICallMediaType newCallMediaType) {  
    }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The call type before the change. </td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >newCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The call type after the change. </td>
</tr>
</table>


### onUserReject

The call was rejected. In a one-to-one call, only the inviter will receive this callback. In a group call, all invitees will receive this callback.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserReject: (String userId) {    
    }
));
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >res.userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The user ID of the invitee who rejected the call.</td>
</tr>
</table>


### onUserNoResponse

A user did not respond.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserNoResponse: (String userId) { 
    }
));
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


### onUserLineBusy

A user is busy.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserLineBusy: (String onUserLineBusy) {   
    },
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserJoin: (String userId) {  
    }
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserLeave: (String userId) {     
    }
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserVideoAvailable: (String userId, bool isVideoAvailable) {   
    }
));
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

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >Whether the user has video.</td>
</tr>
</table>


### onUserAudioAvailable

Whether a user is sending audio.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserAudioAvailable: (String userId, bool isAudioAvailable) {       
    }
));
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

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >Whether the user has audio.</td>
</tr>
</table>


### onUserVoiceVolumeChanged

The volumes of all users.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserVoiceVolumeChanged: (Map<String, int> volumeMap) {  
    }
));
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

<td rowspan="1" colSpan="1" >Map<String, int></td>

<td rowspan="1" colSpan="1" >The volume table, which includes the volume of each user (userId). Value range: 0-100.</td>
</tr>
</table>


### onUserNetworkQualityChanged

The network quality of all users.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserNetworkQualityChanged: (List<TUINetworkQualityInfo> networkQualityList) {
    }
));

class TUINetworkQualityInfo {    
    String userId;  
    TUINetworkQuality quality;  
    TUINetworkQualityInfo({required this.userId, required this.quality});
}

enum TUINetworkQuality {  
  unknown,  
  excellent,
  good,  
  poor,  
  bad,  
  vBad,  
  down
}
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

<td rowspan="1" colSpan="1" >List<[TUINetworkQualityInfo](https://write.woa.com/document/114033029832187904)></td>

<td rowspan="1" colSpan="1" >The current network conditions for all users (userId).</td>
</tr>
</table>


### onKickedOffline

The current user was kicked offline：At this time, you can prompt the user with a UI message and then invoke `init`again.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onKickedOffline: () { 
    }
));
```

### onUserSigExpired

The user sig is expired：At this time, you need to generate a new `userSig`, and then invoke `init`again.
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserSigExpired: () {    
    }  
));
```

## Deprecated interfaces

### onCallCancelled

The call was canceled by the inviter or timed out. This callback is received by an invitee. You can listen for this event to determine whether to show a missed call message.

This indicates that the call was canceled by the caller, timed out by the callee, rejected by the callee, or the callee was busy. There are multiple scenarios involved. You can listen to this event to achieve UI logic such as missed calls and resetting UI status. 
- Call cancellation by the caller: The caller receives the callback (userId is himself); the callee receives the callback (userId is the ID of the caller) .

- Callee timeout: the caller will simultaneously receive the [onUserNoResponse](https://write.woa.com/document/114033041802629120) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) .

- Callee rejection: The caller will simultaneously receive the [onUserReject](https://write.woa.com/document/114033041802629120) and onCallCancelled callbacks (userId is his own ID); the callee receives the onCallCancelled callback (userId is his own ID) .

- Callee busy: The caller will simultaneously receive the [onUserLineBusy](https://write.woa.com/document/114033041802629120) and onCallCancelled callbacks (userId is his own ID); 

- Abnormal interruption: The callee failed to receive the call ，he receives this callback (userId is his own ID).

   ``` cpp
   TUICallEngine.instance.addObserver(TUICallObserver(
       onCallCancelled: (String userId) {    
       }
   ));
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

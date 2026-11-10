---
sync_node_id: '162412628639113216'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "React Native"
  - "TUICallEvent"
product: "call"
---
## TUICallEvent APIs

TUICallEvent API is the **Event Interface** of the Audio and Video Call Components.
| Event | Description |
| --- | --- |
| TUICallEvent.onError | Error Callback during Call |
| TUICallEvent.onCallReceived | Callback for a Call Request |
| TUICallEvent.onCallCancelled | Callback for Call Cancellation |
| TUICallEvent.onCallBegin | Callback for Call Connection |
| TUICallEvent.onCallEnd | Callback for Call Termination |
| TUICallEvent.onUserReject | xxxx User declines the call Callback |
| TUICallEvent.onUserNoResponse | xxxx User Non-response Callback |
| TUICallEvent.onUserLineBusy | xxxx User Busy Line Callback |
| TUICallEvent.onUserJoin | xxxx User Joins Call Callback |
| TUICallEvent.onUserLeave | A user left the call. |
| TUICallEvent.onCallMediaTypeChanged | Callback for a change in the Call's Media Type |
| TUICallEvent.onKickedOffline | Current user kicked offline |
| TUICallEvent.onUserSigExpired | Ticket expired while online |
| TUICallEvent.onUserVideoAvailable | Whether a user has a video stream. |
| TUICallEvent.onUserAudioAvailable | Whether a user has an audio stream. |
| TUICallEvent.onUserVoiceVolumeChanged | The volume levels of all users. |
| TUICallEvent.onUserNetworkQualityChanged | The network quality of all users. |

### TUICallEvent details

### onError

Error callback.
``` tsx
TUICallKit.on(TUICallEvent.onError, (res: any) => {
  console.log('onError code=' + res.code + ',message=' + res.message);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| code | Number | Error Code |
| message | String | Error message |

### onCallReceived

Received a callback for a new incoming call request.
``` tsx
TUICallKit.on(TUICallEvent.onCallReceived, (res: any) => {
  console.log('onCallReceived callerId=' + res.callerId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| callerId | String | Caller ID (inviter) |
| calleeIdList | Array<String> | List of called IDs (invitees) |
| groupId | String | Group Call ID |
| callMediaType | Number | The media type of the call, such as video call, voice call.<br>- params.callMediaType = 0 : Voice Call.<br>- params.callMediaType = 1 : Video Call. |
| userData | String | User-added extension fields. |

### onCallCancelled

Indicates the call was canceled by the caller, missed by the callee, rejected, etc., covering multiple scenarios.
- Caller Cancellation: The caller receives this callback (callerId is oneself); the callee receives this callback (callerId is **the caller's ID**)

- Callee Timeout: The caller receives both onUserNoResponse and onCallCancelled callbacks (callerId is their own ID); the callee receives the onCallCancelled callback (callerId is their own ID)

- Call rejected: The caller will receive both onUserReject and onCallCancelled callbacks (callerId is your own ID); the callee receives the onCallCancelled callback (callerId is your own ID)

- Call busy: The caller will receive both onUserLineBusy and onCallCancelled callbacks (callerId is your own ID)

- Unexpected interruption: The callee fails to receive the call and gets this callback (callerId is your own ID)

   ``` tsx
   TUICallKit.on(TUICallEvent.onCallCancelled, (res: any) => {
     console.log('onCallCancelled userId=' + res.callerId);
   });
   ```
| Parameter | Type | Description |
| --- | --- | --- |
| callerId | String | Caller ID (inviter) |

### onCallBegin

Indicates call connection. Both caller and called can receive it. You can start cloud recording, content review, etc., by listening to this event.
``` tsx
TUICallKit.on(TUICallEvent.onCallBegin, (res: any) => {
  console.log('onCallBegin strRoomId=' + res.roomId.strRoomId + ', callMediaType=' + res.callMediaType + ',callRole=' + res.callRole);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| roomId | RoomId | - roomId.intRoomId: The audio and video room ID for this call (int type)<br>- roomId.strRoomId: The audio and video room ID for this call (String type) |
| callMediaType | Number | Media Type of the call, Video Call, Voice Call<br>- params.callMediaType = 0：Voice Call<br>- params.callMediaType = 1：Video Call |
| callRole | Number | Role, Enum Type: Caller, Called.<br>- params.callRole = 0: Unknown Type.<br>- params.callRole = 1: Caller (inviter).<br>- params.callRole = 2: Called (invitee). |

### onCallEnd

Indicates call disconnection. Both the caller and the called can receive it. You can listen to this event to display call duration, call type, etc., or to stop the cloud recording process.
``` tsx
TUICallKit.on(TUICallEvent.onCallEnd, (res: any) => {
  console.log('onCallEnd strRoomId=' + res.roomId.strRoomId 
  + ',callMediaType=' + res.callMediaType 
  + ',callRole=' + res.callRole
  + ',totalTime=' + res.totalTime);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| roomId | RoomId | - roomId.intRoomId: The audio and video room ID for this call (int type)<br>- roomId.strRoomId: The audio and video room ID for this call (String type) |
| callMediaType | Number | Media Type of the call, Video Call, Voice Call<br>- params.callMediaType = 0: Voice Call<br>- params.callMediaType = 1: Video Call |
| callRole | Number | role, Enumeration Type: Caller, Called<br>- params.callRole = 0: Unknown Type.<br>- params.callRole = 1: Caller (inviter).<br>- params.callRole = 2: Called (invitee). |
| totalTime | Number | The duration of this call, Unit: second |

### onUserReject

Callback for call rejection, in 1v1 calls, only the caller will receive the rejection callback; in group calls, all invitees can receive this callback.
``` tsx
TUICallKit.on(TUICallEvent.onUserReject, (res: any) => {
  console.log('onUserReject userId=' + res.userId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | ID of rejecting user |

### onUserNoResponse

Callback for no response from the other party.
``` tsx
TUICallKit.on(TUICallEvent.onUserNoResponse, (res: any) => {
  console.log('onUserNoResponse userId=' + res.userId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | User ID with no response |

### onUserLineBusy

Callback for call busy.
``` tsx
TUICallKit.on(TUICallEvent.onUserLineBusy, (res: any) => {
  console.log('onUserLineBusy userId=' + res.userId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | ID of rejecting user |

### onUserJoin

Callback for a user joining this call.
``` tsx
TUICallKit.on(TUICallEvent.onUserJoin, (res: any) => {
  console.log('onUserJoin userId=' + res.userId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | User ID joining the current call |

### onUserLeave

A user left the call.
``` tsx
TUICallKit.on(TUICallEvent.onUserLeave, (res: any) => {
  console.log('onUserLeave userId=' + res.userId);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | The target userId |

### onCallMediaTypeChanged

Indicates a change in the call's media type.
``` tsx
TUICallKit.on(TUICallEvent.onCallMediaTypeChanged, (res: any) => {
  console.log('onCallMediaTypeChanged oldCallMediaType=' + res.oldCallMediaType + ',newCallMediaType=' + res.newCallMediaType);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| oldCallMediaType | MediaType | Previous call type |
| newCallMediaType | MediaType | New call type |

### onKickedOffline

Current user kicked offline: You can notify the user on the UI and reinitialize.
``` tsx
TUICallKit.on(TUICallEvent.onKickedOffline, (res: any) => {
  console.log('onKickedOffline');
});
```

### onUserSigExpired

Ticket expires when online: You need to generate a new userSig and reinitialize.
``` tsx
TUICallKit.on(TUICallEvent.onUserSigExpired, (res: any) => {
  console.log('onUserSigExpired');
});
```

### onUserVideoAvailable

Whether a user is sending video.
``` tsx
TUICallKit.on(TUICallEvent.onUserVideoAvailable, (res: any) => {
  console.log('onUserVideoAvailable userId=' + res.userId + 'isVideoAvailable=' + res.isVideoAvailable);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | The user ID. |
| isVideoAvailable | boolean | Whether the user has video. |

### onUserAudioAvailable

Whether a user is sending audio.
``` tsx
TUICallKit.on(TUICallEvent.onUserAudioAvailable, (res: any) => {
  console.log('onUserAudioAvailable userId=' + res.userId + 'isAudioAvailable=' + res.isAudioAvailable);
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | String | The user ID. |
| isAudioAvailable | boolean | Whether the user has audio. |

### onUserVoiceVolumeChanged

The volume levels of all users.
``` tsx
TUICallKit.on(TUICallEvent.onUserVoiceVolumeChanged, (res: any) => {
  console.log('onUserVoiceVolumeChanged', res)
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| volumeMap | any | The volume table, which includes the volume of each user (userId). Value range: 0-100. |

### onUserNetworkQualityChanged

The network quality of all users.
``` tsx
TUICallKit.on(TUICallEvent.onUserNetworkQualityChanged, (networkQuality: any) => {
 for (const [key, value] of networkQuality) {
    console.log(`onUserNetworkQualityChanged userId: ${key}, network quality: ${value}`);
  }
});
```
| Parameter | Type | Description |
| --- | --- | --- |
| networkQuality | any | The key represents the userId, and the value represents the network quality of the user.<br>- value = Unknown<br>- value = Excellent<br>- value = Good<br>- value = Poor<br>- value = Bad<br>- value = Vbad<br>- value = Down |

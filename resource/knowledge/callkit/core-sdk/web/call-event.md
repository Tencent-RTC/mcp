## TUICallEvent API Introduction

TUICallEvent API is the **Event Interface** of the Audio and Video Call Components.

## Event List

|EVENT|Description|
|---------|---------|
|TUICallEvent.ERROR|An error occurred during the call.|
|TUICallEvent.KICKED_OUT|Receiving this event after a duplicate sign-in indicates that the user has been removed from the room|
|TUICallEvent.USER_ACCEPT|If a user answers, this event will be received. **v4.x.x is deprecated**|
|TUICallEvent.USER_ENTER|A user joined the call.|
|TUICallEvent.USER_LEAVE|A user left the call.|
|TUICallEvent.REJECT|A user declined the call.|
|TUICallEvent.NO_RESP|A user didn't respond.|
|TUICallEvent.LINE_BUSY|A user was busy.|
|TUICallEvent.USER_VIDEO_AVAILABLE|Whether a user has a video stream.|
|TUICallEvent.USER_AUDIO_AVAILABLE|Whether a user has an audio stream.|
|TUICallEvent.USER_VOICE_VOLUME|The volume levels of all users.|
|TUICallEvent.ON_CALL_BEGIN|Call connected event.|
|TUICallEvent.ON_CALL_RECEIVED|Call request event.|
|TUICallEvent.ON_CALL_NOT_CONNECTED|Call not connected event.|
|TUICallEvent.ON_CALL_END|The call ended.|
|TUICallEvent.DEVICED_UPDATED|Device list update, this event will be received.|
|TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED|All user network quality events.|

### ERROR

Error event during the call. You can capture internal errors during the call by monitoring this event.
``` javascript
let onError = function(error) {
  console.log(error.code, error.msg);
};
tuiCallEngine.on(TUICallEvent.ERROR, onError);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|code|Number|[Error Code](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/tutorial-ERROR_CODE.html)|
|msg|String|Error message|

### KICKED_OUT

The current user was kicked offline：At this time, you can prompt the user with a UI message and then invoke `login`again.
``` javascript
let handleOnKickedOut = function(event) {
  console.log(event);
};
tuiCallEngine.on(TUICallEvent.KICKED_OUT, handleOnKickedOut);
```

### USER_ACCEPT

> **Attention：**
>
> **v4.x.x is deprecated**
>

If a user answers, all other users will receive this event, where `userID` is the user who answered.
1. In a 1v1 call: when the callee answers, the caller will throw this event.

2. In group calls: if A calls B and C, and B answers, both A and C will throw this event, with the event's `userID` being B. Similarly, if C answers, both A and B will throw this event, with the event's `userID` being C.

   ``` javascript
   let handleUserAccept = function(event) {
     console.log(event.userID);
   };
   tuiCallEngine.on(TUICallEvent.USER_ACCEPT, handleUserAccept);
   ```

   The parameters are described below:

   |Parameter|Type|Meaning|
   |---------|---------|---------|
   |userID|String|Answering User ID|

### USER_ENTER

If a user enters the call, other users will throw this event, and userID is the user name who entered the call.
``` javascript
let handleUserEnter = function(event) {
  console.log(event.userID);
};
tuiCallEngine.on(TUICallEvent.USER_ENTER, handleUserEnter);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userID|String|Entering User ID|

### USER_LEAVE

When a user leaves the call, this event will be thrown by other users in the call. The userID is the name of the user who left the call.
``` javascript
let handleUserLeave = function(event) {
  console.log(event.userID);
};
tuiCallEngine.on(TUICallEvent.USER_LEAVE, handleUserLeave);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userID|String|Exiting User ID|

### REJECT

This event is thrown when the call is rejected
1. In a 1v1 call, only the calling party will receive the rejection event, and userID is the called username.

2. In a group call, when an invitee refuses the call, this event will be thrown by other people in the group call. The userID is the name of the user who refused the call.

   ``` javascript
   let handleInviteeReject = function(event) {
     console.log(event.userID);
   };
   tuiCallEngine.on(TUICallEvent.REJECT, handleInviteeReject);
   ```

   The parameters are described below:

   |Parameter|Type|Meaning|
   |---------|---------|---------|
   |userID|String|Rejecting User ID|

### NO_RESP

This event will be thrown by other calling users when the callee does not respond.
- In a 1v1 call, only the initiator will receive the event of no answer. For example, A invites B, B does not answer, A can receive this event.

- In a group call, when an invitee does not respond, this event will be thrown by everyone else in the group call. For example, if A invites B and C to join the call, but B does not respond, both A and C will throw this event.

   ``` javascript
   let handleNoResponse = function(event) {
   console.log(event.sponsor, event.userIDList);
   };
   tuiCallEngine.on(TUICallEvent.NO_RESP, handleNoResponse);
   ```

   The parameters are described below:

   |Parameter|Type|Meaning|
   |---------|---------|---------|
   |sponsor|String|Caller's User ID|
   |userIDList|Array<String>|List of Users Who Triggered Timeout Due to No Response|

### LINE_BUSY

Call busy event. For example: when B is on a call, and A calls B, A will throw an event.
``` javascript
let handleLineBusy = function(event) {
  console.log(event);
};
tuiCallEngine.on(TUICallEvent.LINE_BUSY, handleLineBusy);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userID|String|Busy User ID|

### USER_VIDEO_AVAILABLE

If a user turns on/off the camera during a video call, this event will be thrown by other users in the call. For example: A and B are on a video call, A turns on/off the camera, and B will throw this event.
``` javascript
let handleUserVideoChange = function(event) {
  console.log(event.userID, event.isVideoAvailable);
};
tuiCallEngine.on(TUICallEvent.USER_VIDEO_AVAILABLE, handleUserVideoChange);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userID|String|Remote User ID|
|isVideoAvailable|Boolean|true: Remote User turns Camera On; false: Remote User turns Camera Off|

### USER_AUDIO_AVAILABLE

If a user turns on/off the microphone during an audio or video call, this event will be thrown by other users on the call. For example: A and B are having an audio and video call, and A turns on/off the microphone, and B will throw this event.
``` javascript
let handleUserAudioChange = function(event) {
  console.log(event.userID, event.isAudioAvailable);
};
tuiCallEngine.on(TUICallEvent.USER_AUDIO_AVAILABLE, handleUserAudioChange);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userID|String|User ID to turn microphone on/off|
|isAudioAvailable|Boolean|true the user turns on the microphone; false the user turns off the microphone|

### USER_VOICE_VOLUME

When the user's volume changes during an audio or video call, this event will be thrown by other users on the call. For example: A and B are having an audio and video call, and if A's volume changes, B will throw this event.
``` javascript
let handleUserVoiceVolumeChange = function(event) {
  console.log(event.volumeMap);
};
tuiCallEngine.on(TUICallEvent.USER_VOICE_VOLUME, handleUserVoiceVolumeChange);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|volumeMap|Array<Object>|Volume meter, the corresponding volume can be obtained according to each userid, volume range: [0, 100]|

### ON_CALL_RECEIVED

Receiving a new incoming call event, the called party will be notified. By listening to this event, you can decide whether to display the call answering interface.
``` javascript
let handleOnCallReceived = function(event) {
    console.log(event);
};
tuiCallEngine.on(TUICallEvent.ON_CALL_RECEIVED, handleOnCallReceived);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|sponsor|String|Inviter|
|userIDList|Array<String>|Also Invited Persons|
|isFromGroup|Boolean|Is it a Group Call|
|inviteData|Object|Call Data|
|inviteID|String|Invitation ID, identifying one invitation|
|userData|String|Extended field: Utilized for amplifying details in the invitation signaling|
|callId|String|Unique ID for this call|
|roomID|Number|Audio-Video Room ID for this call|
|callMediaType|Number|Media Type of the call, Video Call, Voice Call|
|callRole|String|role, Enumeration Type: Caller, Called|

### ON_CALL_NOT_CONNECTED

**If the call is not established, this event will be thrown**.
``` javascript
let handleOnCallCanceled = function(event) {
  console.log(event.userID);
};
tuiCallEngine.on(TUICallEvent.ON_CALL_NOT_CONNECTED, handleOnCallCanceled);
```

The parameters are described below:
| Parameter | Type | Meaning |
| --- | --- | --- |
| userID | String | Cancelled User ID |
| callId | String | Unique ID for this call |
| roomID | Number | Audio-Video Room ID for this call |
| callMediaType | Number | Media Type of the call, Video Call, Voice Call |
| callRole | String | Role, Enumeration Type: Caller, Called |
| reason | Number | Call not established reason。<br>- 0 - Unknown<br>- 1 - Hang up<br>- 2 - Deny<br>- 3 - No response<br>- 4 - Offline<br>- 5 - Busy Line<br>- 6 - Cancel call<br>- 7 - Other device answers<br>- 8 - Other device denies<br>- 9 - Backend ends |

### ON_CALL_BEGIN

Indicates call connection. Both caller and called can receive it. You can start cloud recording, content review, etc., by listening to this event.
``` javascript
let handleOnCallBegin = function(event) {
    console.log(event);
};
tuiCallEngine.on(TUICallEvent.ON_CALL_BEGIN, handleOnCallBegin);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|callId|String|Unique ID for this call|
|roomID|Number|Audio-Video Room ID for this call|
|callMediaType|Number|Media Type of the call, Video Call, Voice Call|
|callRole|String|Role, Type: Caller, Called|

### ON_CALL_END

Indicates call termination. Both caller and called can trigger this event. You can display information such as call duration, call type, or stop the cloud recording process by listening to this event.
``` javascript
let handleCallingEnd = function(event) {
  console.log(event.userID, event.);
};
tuiCallEngine.on(TUICallEvent.ON_CALL_END, handleCallingEnd);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|roomID|Number|Audio-Video Room ID for this call, currently only supports numeric room number, future versions will support character string room numbers|
|callMediaType|Number|Media Type of the call, Video Call, Voice Call|
|callRole|String|role, Enumeration Type: Caller ('inviter'), Called ('invitee'), Unknown ('')|
|totalTime|Number|The duration of this call in seconds|
|userID|String|UserID of the call termination.|
|callId|String|The unique ID for this call.|

### DEVICED_UPDATED

Device list update, this event will be received.
``` javascript
let handleDeviceUpdated = function({ microphoneList, cameraList, currentMicrophoneID, currentCameraID }) {
  console.log(microphoneList, cameraList, currentMicrophoneID, currentCameraID)
};
tuiCallEngine.on(TUICallEvent.DEVICED_UPDATED, handleDeviceUpdated);
```

### ON_USER_NETWORK_QUALITY_CHANGED

All user network quality events
``` javascript
let handleOnUserNetworkQualityChange = function(event) {
  console.log(event.networkQualityList);
};
tuiCallEngine.on(TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED, handleOnUserNetworkQualityChange);
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|networkQualityList|Array<Object>|Network status, according to userID, you can get the current network quality of the corresponding user (only local uplink and downlink). For example: <br>`networkQualityList: [{ userId: quality }]`。<br>**Network Quality Description:**<br>quality = 0, Network state is unknown<br>quality = 1, Network state is excellent<br>quality = 2, Network state is good<br>quality = 3, Network state is average<br>quality = 4, Network state is poor<br>quality = 5, Network state is very poor<br>quality = 6, Network connection is disconnected|

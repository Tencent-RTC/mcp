TUICallEvent API is the event interface for the audio/video calling component.

> **Note:**
> - To provide better audio/video communication capabilities, the original [tuicall-engine-wx](https://www.npmjs.com/package/tuicall-engine-wx) package has been officially deprecated. Developers are advised to migrate to the new [@trtc/call-engine-lite-wx](https://www.npmjs.com/package/@trtc/call-engine-lite-wx) package.
> - The new package includes optimized API adjustments. Some legacy interfaces are no longer compatible, and cleaner, more stable new interfaces are provided.

## TUICallEvent Overview

| Event Name | Description |
|---------|---------|
| [ON_CALL_RECEIVED](#ON_CALL_RECEIVED) | Call request received event. |
| [USER_ACCEPT](#USER_ACCEPT) | User accepted the call. **Deprecated in v4.x.x.** |
| [USER_ENTER](#USER_ENTER) | User entered the call. |
| [USER_LEAVE](#USER_LEAVE) | User left the call. |
| [USER_UPDATE](#USER_UPDATE) | User updated. |
| [REJECT](#REJECT) | User rejected the call. |
| [NO_RESP](#NO_RESP) | User did not respond. |
| [LINE_BUSY](#LINE_BUSY) | User is busy. |
| [ON_CALL_NOT_CONNECTED](#ON_CALL_CANCELED) | Call was not established. All participants will receive this event. |
| [ON_CALL_BEGIN](#ON_CALL_BEGIN) | Call connected event. |
| [ON_CALL_END](#CALL_END) | Call ended. |
| [KICKED_OUT](#KICKED_OUT) | Kicked offline. |
| [ERROR](#ERROR) | Error information. |
| [ON_USER_NETWORK_QUALITY_CHANGED](#ON_USER_NETWORK_QUALITY_CHANGED) | Network quality event for all users. |
| [USER_VIDEO_AVAILABLE](#USER_VIDEO_AVAILABLE) | Event indicating whether a user has a video stream. |
| [USER_AUDIO_AVAILABLE](#USER_AUDIO_AVAILABLE) | Event indicating whether a user has an audio stream. |

## TUICallEvent Details
``` javascript
 import TUICallEngine, { TUICallEvent } from '@trtc/call-engine-lite-wx';
```

### ON_CALL_RECEIVED

A new incoming call request event. The callee receives this event. You can listen to it to decide whether to show the call answer UI.
``` javascript
let handleOnCallReceived = function(event) {
    console.log(event)
};
tuiCallEngine.on(TUICallEvent.ON_CALL_RECEIVED, handleOnCallReceived, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| sponsor | String | The inviter. |
| userIDList | Array\<String\> | Other users also being invited. |
| isFromGroup | Boolean | Whether this is a group call. |
| inviteData | Object | Call data. |
| inviteID | String | Invitation ID, identifies a single invitation. |
| userData | String | Extension field: extra information in the invitation signaling. |
| callId | String | Unique ID of this call. |
| roomID | Number | Audio/video room ID for this call. |
| callMediaType | Number | Call media type: video call or voice call. |
| callRole | String | Role, enum: caller or callee. |

### USER_ACCEPT

> **Note:**
> **This event is deprecated in v4.x.x.**
>

When a user accepts the call, other users receive this event.
``` javascript
let handleUserAccept = function(event) {
    console.log('User accepted the call')
}
tuiCallEngine.on(TUICallEvent.USER_ACCEPT, this.handleUserAccept, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| userID | String | The user ID who accepted. |
| userList | Array | Information about users who have not yet accepted **(will be deprecated)**. |

### USER_ENTER

When a user agrees to enter the call, other users receive this event.
``` javascript
let handleUserEnter = function(event) {
    console.log('User entered the call')
}
tuiCallEngine.on(TUICallEvent.USER_ENTER, this.handleUserEnter, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| userID | String | The user ID who entered the room. |
| playerList | Array | Stream information of users in the room. |

### USER_LEAVE

When a user leaves the call, other users in the call receive this event.
``` javascript
let handleUserLeave = function(event) {
    console.log('User left the call')
}
tuiCallEngine.on(TUICallEvent.USER_LEAVE, this.handleUserLeave, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| userID | String | The user ID who left the room. |
| playerList | Array | Stream information of users in the room. |

### USER_UPDATE

User updated.
``` javascript
let handleUserUpdate = function(event) {
    console.log('User updated')
}
tuiCallEngine.on(TUICallEvent.USER_UPDATE, this.handleUserUpdate, this)
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| pusher | String | Updated local push stream information. |
| playerList | Array | Updated remote users' stream information. |

### REJECT

Call rejected event. In a 1v1 call, only the caller receives the reject event. In a group call, all invitees can receive this event.
``` javascript
let handleInviteeReject = function(event) {
    console.log('User rejected the call')
}
tuiCallEngine.on(TUICallEvent.REJECT, this.handleInviteeReject, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| userID | String | The user ID who rejected the call. |
| invitee | String | The user ID who rejected the call **(will be deprecated)**. |
| inviteID | String | Invitation ID, identifies a single invitation. |
| reason | String | "reject" indicates rejection. |

### NO_RESP

Invited user did not respond.
- In a C2C call, only the initiator receives the no-response callback. For example, if A invites B and C, and B doesn't respond, A receives this callback but C does not.

- In an IM group call, all invitees can receive this callback. For example, if A invites B and C, and B doesn't respond, both A and C receive this callback.

   ``` javascript
   let handleNoResponse = function(event) {
       console.log('User did not respond')
   }
   tuiCallEngine.on(TUICallEvent.NO_RESP, this.handleNoResponse, this);
   ```

   **Parameters:**

   | Parameter | Type | Description |
   |---------|---------|---------|
   | groupID | String | Group ID, unique identifier. |
   | sponsor | String | The initiator's user ID. |
   | userIDList | Array\<String\> | List of users who timed out without responding. |
   | inviteID | String | Invitation ID, identifies a single invitation. |

### LINE_BUSY

User is busy.
``` javascript
let handleLineBusy = function(event) {
    console.log('User is busy')
}
tuiCallEngine.on(TUICallEvent.LINE_BUSY, this.handleLineBusy, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| userID | String | The busy user's ID. |
| inviteID | String | Invitation ID, identifies a single invitation. |
| reason | String | "line busy" indicates the user is busy. |

### ON_CALL_NOT_CONNECTED

**This event is thrown when the call is not established.**
``` javascript
let handleOnCallCanceled = function(event) {
  console.log(event.userID);
};
tuiCallEngine.on(TUICallEvent.ON_CALL_CANCELED, handleOnCallCanceled, this);
```

**Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| userID | String | The user ID associated with the call cancellation. |
| callId | String | Unique ID of this call. |
| roomID | Number | Audio/video room ID for this call. |
| callMediaType | Number | Call media type: video call or voice call. |
| callRole | String | Role, enum: caller or callee. |
| reason | Number | Reason the call was not established:<br>- 0 - Unknown.<br>- 1 - Hung up.<br>- 2 - Rejected.<br>- 3 - No response.<br>- 4 - Offline.<br>- 5 - Busy.<br>- 6 - Call cancelled.<br>- 7 - Accepted on another device.<br>- 8 - Rejected on another device.<br>- 9 - Ended by server. |

### ON_CALL_BEGIN

Indicates the call has been connected. Both the caller and callee can receive this event. You can listen to this event to start cloud recording, content moderation, etc.
``` javascript
let handleOnCallBegin = function(event) {
    console.log(event)
};
tuiCallEngine.on(TUICallEvent.ON_CALL_BEGIN, handleOnCallBegin, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| callId | String | Unique ID of this call. |
| roomID | Number | Audio/video room ID for this call. |
| callMediaType | Number | Call media type: video call or voice call. |
| callRole | String | Role: caller or callee. |

### ON_CALL_END

Indicates the call has ended. Both the caller and callee can receive this event. You can listen to this event to display call duration, call type, or to stop cloud recording.
``` javascript
let handleCallingEnd = function(event) {
    console.log('Call ended')
}
tuiCallEngine.on(TUICallEvent.ON_CALL_END, this.handleCallingEnd, this);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| roomID | Number | Audio/video room ID for this call. Currently only numeric room IDs are supported; string room IDs will be supported in future versions. |
| callMediaType | Number | Call media type: video call or voice call. |
| callRole | String | Role, enum: caller ('inviter'), callee ('invitee'), unknown (''). |
| totalTime | Number | Duration of this call in seconds. |
| userID | String | The userID that caused the call to end. |
| callId | String | Unique ID of this call. |

### KICKED_OUT

Kicked offline.
``` javascript
let handleKickedOut = function(event) {
    console.log('Kicked offline')
}
tuiCallEngine.on(TUICallEvent.KICKED_OUT, this.handleKickedOut, this);
```

### ERROR

Listen for SDK error information.
``` javascript
let handleError = function(event) {
    console.log('Error information')
}
tuiCallEngine.on(TUICallEvent.ERROR, this.handleError, this);
```

### ON_USER_NETWORK_QUALITY_CHANGED

Network quality event for all users.
``` javascript
let handleOnUserNetworkQualityChange = function(event) {
  console.log(event.networkQualityList);
};
tuiCallEngine.on(TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED, this.handleOnUserNetworkQualityChange, this);
```

**Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| networkQualityList | Array\<Object\> | Network status. You can get the current network quality for each user by userID. Example: `networkQualityList: [{ userId: quality }]`.<br>**Network quality levels:**<br>- quality = 0: Network status unknown.<br>- quality = 1: Excellent network.<br>- quality = 2: Good network.<br>- quality = 3: Average network.<br>- quality = 4: Poor network.<br>- quality = 5: Very poor network.<br>- quality = 6: Network disconnected. |

### USER_VIDEO_AVAILABLE

During a video call, when a user enables/disables their camera, other users in the call receive this event. For example: A and B are in a video call, when A enables/disables their camera, B receives this event.
``` javascript
let handleUserVideoChange = function(event) {
  console.log(event.userID, event.isVideoAvailable);
};
tuiCallEngine.on(TUICallEvent.USER_VIDEO_AVAILABLE, handleUserVideoChange);
```

**Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| userID | String | The user ID who enabled/disabled their camera. |
| isVideoAvailable | Boolean | - true: user enabled camera.<br>- false: user disabled camera. |

### USER_AUDIO_AVAILABLE

During an audio/video call, when a user enables/disables their microphone, other users in the call receive this event. For example: A and B are in a call, when A enables/disables their microphone, B receives this event.
``` javascript
let handleUserAudioChange = function(event) {
  console.log(event.userID, event.isAudioAvailable);
};
tuiCallEngine.on(TUICallEvent.USER_AUDIO_AVAILABLE, handleUserAudioChange);
```

**Parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| userID | String | The user ID who enabled/disabled their microphone. |
| isAudioAvailable | Boolean | - true: user enabled microphone.<br>- false: user disabled microphone. |

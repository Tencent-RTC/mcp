TUICallEngine API is the **No-UI interface** for the audio/video calling component. If TUICallKit's built-in interaction does not meet your needs, you can use this API to build a custom calling experience.

Due to mini program development limitations, you need to bindevents to `live-pusher` first. See [TUICallKit](https://cloud.tencent.com/document/product/647/78760) for details.

> **Note:**
> - To provide better audio/video communication capabilities, the original `@trtc/call-engine-lite-wx` package has been officially deprecated. Developers are advised to migrate to the new [@trtc/call-engine-lite-wx](https://www.npmjs.com/package/@trtc/call-engine-lite-wx) package.
> - The new package includes optimized API adjustments. Some legacy interfaces are no longer compatible, and cleaner, more stable new interfaces are provided.

## API Overview

### Instance Creation and Event Callbacks

| API | Description |
|---------|---------|
| [createInstance](#createInstance) | Create a TUICallEngine instance (static method) |
| [destroyInstance](#destroyInstance) | Destroy a TUICallEngine instance (static method) |
| [on](#on) | Register an event listener |
| [off](#off) | Unregister an event listener |

### Call Operation APIs

| API | Description |
|---------|---------|
| [calls](#calls) | Initiate a 1v1 call |
| [inviteUser](#inviteUser) | Invite other users to join a group call |
| [join](#join) | Actively join an ongoing group call |
| [accept](#accept) | Accept a call |
| [reject](#reject) | Reject a call |
| [hangup](#hangup) | Hang up a call |

### Device Control APIs

| API | Description |
|---------|---------|
| [openCamera](#openCamera) | Enable camera |
| [closeCamera](#closeCamera) | Disable camera |
| [switchCamera](#switchCamera) | Switch between front/rear camera |
| [openMicrophone](#openMicrophone) | Enable microphone |
| [closeMicrophone](#closeMicrophone) | Disable microphone |
| [selectAudioPlaybackDevice](#selectAudioPlaybackDevice) | Select audio playback device (earpiece/speaker) |

### Other APIs

| API | Description |
|---------|---------|
| [setSelfInfo](#setSelfInfo) | Set user avatar and nickname |
| [setLogLevel](#setLogLevel) | Set log level |
| [setBeautyLevel](#setBeautyLevel) | Set beauty filter level, supports disabling default beauty |

## API Details
``` javascript
 import TUICallEngine, { TUICallEvent } from '@trtc/call-engine-lite-wx ';
```

### createInstance

Create a TUICallEngine singleton instance.
``` javascript
 wx.$TUICallEngine = TUICallEngine.createInstance({
    tim,
    sdkAppID,
 });
```

**Parameters**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| sdkAppID | Number | The SDKAppID used by Tencent Cloud to identify customers | Yes |
| tim | ChatSDK | TIM instance | No |

### destroyInstance

Destroy the TUICallEngine singleton instance.
``` javascript
TUICallEngine.destroyInstance();
```

### on

Register an event listener to listen for all TUICallEngine events.
``` javascript
let handleNewInvitationReceived = function(event) {
    // Received an invitation
};
wx.$TUICallEngine.on(TUICallEvent.ON_CALL_RECEIVED, handleNewInvitationReceived, this);
```

**Parameters**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| eventName | TUICallEvent | Event name | Yes |
| handler | Function | Event callback function | Yes |
| context | Any | Current execution context (this) | Yes |

### off

Remove an event listener.
``` javascript
let handleNewInvitationReceived = function(event) {
    // Received an invitation
};
wx.$TUICallEngine.off(TUICallEvent.ON_CALL_RECEIVED, handleNewInvitationReceived);
```

**Parameters**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| eventName | TUICallEvent | Event name | Yes |
| handler | Function | Event callback function | Yes |

### login

Login interface.
``` javascript
const params = {
    userID: 'john', // Your user ID
    userSig: 'xxxx', // Signature
};
let promise = wx.$TUICallEngine.login(params);
promise.then(() => {
    //success
}).catch(error => {
    console.warn('login error:', error);
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| userID | String | Current user ID. String type, only allows letters (a-z, A-Z), digits (0-9), hyphens (-), and underscores (_) | Yes |
| userSig | String | Tencent Cloud security signature. See [How to Calculate UserSig](https://cloud.tencent.com/document/product/647/17275) for details. | Yes |

### logout

Logout interface.
``` javascript
let promise = wx.$TUICallEngine.logout();
promise.then(() => {
    // logout success
}).catch(error => {
    console.warn('logout error:', error);
});
```

### calls

Initiate a single or multi-party call.

> **Note**
> Offline push is only supported on mobile terminals (Android or iOS). Web and WeChat Mini Programs do not support it.
>

``` javascript
import { CallMediaType } from '@trtc/call-engine-lite-wx';
let promise = wx.$TUICallEngine.groupCall({
    userIDList: ['user1', 'user2'],
    type: CallMediaType.AUDIO,
});
promise.then(() => {
    // groupCall success
}).catch(error => {
    console.warn('groupCall error:', error);
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| userIDList | Array\<String\> | List of callee userIDs | Yes |
| type | [CallMediaType](https://cloud.tencent.com/document/product/647/78759#CallMediaType) | Call media type | Yes |
| chatGroupID | String | IM group ID when used with Chat | Yes |
| timeout | Number | Timeout in seconds | No |
| roomID | Number | Audio/video room ID for this call. Currently only numeric room IDs are supported; string room IDs will be supported in future versions | No |
| userData | String | Extension field: used to add extra information in the invitation signaling | No |

### inviteUser

Invite users to join the current group call.

Use case: When a user in an ongoing group call wants to invite others to join.
``` javascript
const userIDList = ['jack', 'john'];
const params = {
    userIDList
};
wx.$TUICallEngine.inviteUser(params).then(() => {
    // success
}).catch(error => {
    console.error('inviteUser error:', error);
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| params | Object | Invite parameters | Yes |
| params.userIDList | Array\<String\> | List of callee userIDs | Yes |

### join

Actively join an ongoing group call.
``` javascript
const params = { callId: xxx };
wx.$TUICallEngine.join(params).then(() => {
    // success
}).catch(error => {
    console.error('join error:', error);
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| params | Object | Join parameters | Yes |
| params.callId | String | Unique ID of this call | Yes |

### accept

Accept the current call. When you receive the `EVENT.ON_CALL_RECEIVED` event callback as the callee, call this method to accept the incoming call.
``` javascript
wx.$TUICallEngine.on(TUICallEvent.ON_CALL_RECEIVED, () => {
    wx.$TUICallEngine.accept().promise.then(() => {
        // accept success
    }).catch(error => {
        console.warn('accept error:', error);
    });
});
```

### reject

Reject the current call. When you receive the `EVENT.ON_CALL_RECEIVED` callback as the callee, call this method to reject the incoming call.
``` javascript
wx.$TUICallEngine.on(TUICallEvent.ON_CALL_RECEIVED, () => {
    wx.$TUICallEngine.reject().then(() => {
        // reject success
    }).catch(error => {
        console.warn('reject error:', error);
    });
});
```

### hangup

Hang up the current call. Call this method to end the call when you are in an ongoing call.
``` javascript
wx.$TUICallEngine.hangup().then(() => {
     // hangup success
 }).catch(error => {
     console.warn('hangup error:', error);
 });
```

### openCamera

Enable the camera.
``` javascript
wx.$TUICallEngine.openCamera().then(() => {
    // openCamera success
}).catch(error => {
    console.warn('openCamera error:', error);
});
```

### closeCamera

Disable the camera. Other users in the call will receive a callback notification.
``` javascript
wx.$TUICallEngine.closeCamera().then(() => {
    // closeCamera success
}).catch(error => {
    console.warn('closeCamera error:', error);
});
```

### switchCamera

Switch between front and rear cameras.
``` javascript
wx.$TUICallEngine.switchCamera().then(() => {
    // switchCamera success
}).catch(error => {
    console.warn('switchCamera error:', error);
});
```

### openMicrophone

Enable the microphone. Other users in the call will receive a callback notification.
``` javascript
wx.$TUICallEngine.openMicrophone().then(() => {
    // openMicrophone success
}).catch(error => {
    console.warn('openMicrophone error:', error);
});
```

### closeMicrophone

Disable the microphone. Other users in the call will receive a callback notification.
``` javascript
wx.$TUICallEngine.closeMicrophone().then(() => {
    // closeMicrophone success
}).catch(error => {
    console.warn('closeMicrophone error:', error);
});
```

### selectAudioPlaybackDevice

Select the audio playback device. Currently supports earpiece and speaker. In a call scenario, use this to enable/disable hands-free mode.
``` javascript
wx.$TUICallEngine.selectAudioPlaybackDevice(AUDIO_PLAYBACK_DEVICE.EAR).then(() => {
    // selectAudioPlaybackDevice success
}).catch(error => {
    console.warn('selectAudioPlaybackDevice error:', error);
});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| type | [AUDIO_PLAYBACK_DEVICE](https://cloud.tencent.com/document/product/647/78759#AUDIO_PLAYBACK_DEVICE) | Speaker: AUDIO_PLAYBACK_DEVICE.SPEAKER<br>Earpiece: AUDIO_PLAYBACK_DEVICE.EAR | Yes |

### setSelfInfo

Set user avatar and nickname.
``` javascript
wx.$TUICallEngine.setSelfInfo("nickname", "avatar URL").then(() => {
    // setSelfInfo success
}).catch(error => {
    console.warn('setSelfInfo error:', error);
});
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| nickName | String | Set nickname |
| avatar | String | Avatar URL |

### setLogLevel

Set the log level. Logs below the specified level will not be output.
``` javascript
wx.$TUICallEngine.setLogLevel(level)
```

**Parameters:**
| Parameter | Value | Description |
| --- | --- | --- |
| level | 0 | Normal level, verbose logs. Recommended during integration |
|  | 1 | Release level, SDK outputs key information only. Recommended for production |
|  | 2 | Warning level, SDK outputs only warnings and errors |
|  | 3 | Error level, SDK outputs only errors |
|  | 4 | No logs, SDK will not print any logs |

### setBeautyLevel

Set beauty filter level, supports disabling the default beauty filter.
``` javascript
const params = {
  style: 0, // 0-smooth; 1-natural
  beautyLevel: 5,
  whitenessLevel: 6,
};

wx.$TUICallEngine.setBeautyLevel(params);
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| style | number | Beauty skin smoothing mode. 0-smooth; 1-natural. Default: 0. |
| beautyLevel | number | Beauty level, range [0 - 9]. 0 means off, 1-9 higher value means stronger effect. |
| whitenessLevel | number | Whitening level, range [0 - 9]. 0 means off, 1-9 higher value means stronger effect. |

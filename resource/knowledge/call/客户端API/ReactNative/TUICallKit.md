---
sync_node_id: '162412580951224320'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "React Native"
  - "TUICallKit"
product: "call"
---
## TUICallKit API

The TUICallKit API is a **UI-inclusive interface** for the audio and video call component. By using the TUICallKit API, you can quickly implement a WeChat-like audio and video call scenario through simple interfaces. For more detailed integration steps, please .

## TUICallKit APIs
| API | Description |
| --- | --- |
| login | Login. |
| logout | Logout. |
| calls | Initiate a one-to-one or multi-person call. |
| call | To make a one-on-one call, supports custom room ID, call timeout, offline push content, and more. |
| groupCall | To make a group call, supports custom room ID, call timeout, offline push content, and more. |
| joinInGroupCall | Join a group call. |
| setCallingBell | Customize user's ringtone. |
| <a href="#1e1b351d-802a-45ec-ae9f-0a06bc1a1187">setSelfInfo</a> | Set user's avatar and nickname. |
| enableMuteMode | Set whether to turn on the mute mode. |
| enableVirtualBackground | Turn On/Off Ringtone. |
| setScreenOrientation | Set Screen Orientation. |
| on | Listen to TUICallKit events |
| off | Cancel listening to TUICallKit events |

## API Details

### login

Login. This step is crucial. Only after successful login can you use the various features provided by TUICallKit normally.
``` tsx
TUICallKit.login(
  {
    sdkAppId: 0,
    userId: '',
    userSig: '',
  },
  (res) => {
    console.log('login success');
  },
   (errCode, errMsg) => {
     console.log('login error');
   }
);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| sdkAppId | Number | The unique identifier SDKAppID for the audio and video application created in <a href="https://console.trtc.io/">Tencent RTC Console</a>. |
| userId | String | Customers define their own User ID based on their business. You can only include letters (a-z, A-Z), digits (0-9), underscores, and hyphens. |
| userSig | String | SDKSecretKey for the audio and video application created in <a href="https://console.trtc.io/">Tencent RTC Console</a>. |

### logout

Logout. After logging out, no TUICallKit events will be listened to.
``` tsx
TUICallKit.login(
  (res) => {
    console.log('login success', res);
  },
   (errCode, errMsg) => {
     console.log('login error', errCode, errMsg);
   }
);
```

### calls

Initiate a one-to-one or multi-person call.
``` tsx
TUICallKit.calls(
  {
    userIdList: userIDList,
    mediaType: MediaType.Audio,
    callParams: {
      offlinePushInfo: {
        title: '',
        desc: '',
      },
    },
  },
  () => {
    console.log('calls success');
  },
  () => {
    console.log('calls error');
  }
);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| userIdList | Array<String> | The target user IDs. |
| mediaType | MediaType | The media type of the call, such as video call, voice call.<br>- MediaType.Audio: Voice Call.<br>- MediaType.Video: Video Call. |
| callParams | callParams | call extension parameters include room number, call invitation timeout, offline push custom content, etc. |

### call

Make a phone call (1v1 call), supports custom room number, call invitation timeout, offline push content, and more.
``` tsx
TUICallKit.call(
  {
    userId: calleeID,
    mediaType: MediaType.Audio,
    callParams: {
      offlinePushInfo: {
        title: '',
        desc: '',
      },
    },
  },
  () => {
    console.log('call success');
  },
  () => {
    console.log('call error');
  }
);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| userId | String | target user's userId |
| mediaType | MediaType | The media type of the call, such as video call, voice call.<br>- MediaType.Audio: Voice Call.<br>- MediaType.Video: Video Call. |
| callParams | callParams | call extension parameters include room number, call invitation timeout, offline push custom content, etc. |

### groupCall

Initiate group communication.
``` tsx
TUICallKit.groupCall(
  {
    userIdList: userIDList,
    mediaType: MediaType.Audio,
    groupId: '',
  },
  (res) => {
    console.log('groupCall success', res);
  },
  (errCode, errMsg) => {
    console.log('groupCall error', errCode, errMsg);
  }
);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| groupId | String | The group ID. |
| userIdList | Array<String> | The target user IDs. |
| mediaType | MediaType | The media type of the call, such as video call, voice call<br>- MediaType.Audio: Voice Call.<br>- MediaType.Video: Video Call. |
| callParams | callParams | call extension parameters, for example: room number, call invitation timeout, custom content for offline push, etc. |

### joinInGroupCall

Join an existing audio-video call in a group.
``` tsx
TUICallKit.joinInGroupCall(
  {
    roomId: '',
    groupId: '',
    mediaType: '',
  }
);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| roomId | RoomId | Audio-Video Room ID for this call |
| groupId | String | Group ID associated with this group call |
| mediaType | MediaType | The media type of the call, such as video call, voice call |

### setCallingBell

Set a custom incoming call ringtone.
- The input is restricted to the local MP3 format file address. It is imperative to ensure that the application has access to this file directory.

- Use the import method to introduce the ringtone file.

- To reset the ringtone, pass in an empty string for `filePath`.

   ``` tsx
   var filePath: string = '';
   TUICallKit.setCallingBell(filePath);
   ```
| Parameter | Type | Meaning |
| --- | --- | --- |
| filePath | String | Ringtone file address |

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.
``` tsx
 var nickname: string = 'user';
 var avatar: string = '';
 TUICallKit.setSelfInfo(nickname, userAvatar,
  (res) => {
    console.log('groupCall success', res);
  },
  (errCode, errMsg) => {
    console.log('groupCall error', errCode, errMsg);
  }
 );
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| nickname | string | The target user names. |
| avatar | string | The target user avatar. |

### enableMuteMode

Enable/Disable Ringtone. After enabling, the ringtone will not play when receiving a call request.
``` tsx
Boolean enable = true
TUICallKit.enableMuteMode(enable);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| enable | Boolean | Enable/Disable Ringtone. Default is false. |

### enableVirtualBackground

Enable/disable blurry background feature. By calling the interface, you can display the blurry background feature button on the UI, and click the button to directly enable the blurry background feature.
``` tsx
Boolean enable = true
TUICallKit.enableVirtualBackground(enable);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| enable | Boolean | - enable = true Show blurry background button<br>- enable = false Do not show blurry background button |

### setScreenOrientation

Set screen display mode.
``` tsx
Number orientation = 0
TUICallKit.setScreenOrientation(orientation);
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| orientation | Number | - orientation = 0 : Portrait display.<br>- orientation = 1 : Landscape display.<br>- orientation = 2 : Automatically select the best display mode based on the current state of the device. |

### on

You can listen to TUICallKit events using the example code below. For event details, please .
``` tsx
TUICallKit.on(TUICallEvent.onCallReceived, (res: any) => {
  console.log('onUserReject userId=' + res.userId);
});
```
| Parameter | Type | Meaning |
| --- | --- | --- |
| type | String | For the events you are listening to with TUICallKit, please . |
| params | Any | Information carried by the event, please . |

### off

You can use the following sample code to cancel listening to TUICallKit events.
``` tsx
TUICallKit.off(TUICallEvent.onCallReceived);
```

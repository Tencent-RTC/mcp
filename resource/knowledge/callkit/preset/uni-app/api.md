## API Overview

### TUICallKit (with UI)

TUICallKit is the **audio/video calling component with a UI interface**. Using this API is like adding a WeChat-like audio/video calling scenario to your app.

| API | Description |
| --- | --- |
| init | Initialize TUICallKit |
| calls | Initiate 1v1 / group call |
| setSelfInfo | Set user nickname and avatar |
| setCallingBell | Set custom ringtone |
| enableMuteMode | Enable/disable mute mode |
| enableFloatWindow | Enable/disable floating window |

### TUICallEngine (No UI)

TUICallEngine is the underlying engine **without a UI interface**, suitable for custom audio/video calling scenarios.

| API | Description |
| --- | --- |
| createInstance | Create a TUICallEngine instance (static method) |
| destroyInstance | Destroy a TUICallEngine instance (static method) |
| on | Register an event listener |
| off | Unregister an event listener |
| login | Login |
| logout | Logout |
| setSelfInfo | Set user nickname and avatar |
| calls | Initiate 1v1 / group call |
| groupCall | Initiate a group call |
| accept | Accept a call |
| reject | Reject a call |
| hangup | Hang up a call |
| switchCallMediaType | Switch call media type (e.g., voice to video) |
| openCamera | Enable camera |
| closeCamera | Disable camera |
| switchCamera | Switch between front/rear camera |
| openMicrophone | Enable microphone |
| closeMicrophone | Disable microphone |
| setMicMute | Set microphone mute state |
| setVideoQuality | Set video encoding quality |

## API Details

### TUICallKit API Details

#### init

Initialize TUICallKit. This must be called before using any other TUICallKit features.

``` javascript
import TUICallKit from '../../TUICallKit/TUICallKit.vue';

// Call via ref
this.$refs.TUICallKit.init({
  sdkAppID: 0,       // Replace with your SDKAppID
  userID: 'userID',  // Replace with your userID
  userSig: 'userSig' // Replace with your userSig
})
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| sdkAppID | Number | Yes | - | SDKAppID |
| userID | String | Yes | - | User ID |
| userSig | String | Yes | - | UserSig |

#### calls

Initiate a 1v1 or group call. When `userIDList` contains a single user, it is a 1v1 call; when it contains multiple users, it is a group call.

``` javascript
this.$refs.TUICallKit.calls({
  userIDList: ['mike'],
  type: 2
})
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| userIDList | Array | Yes | - | List of callee userIDs. For 1v1 calls, pass one userID; for group calls, pass multiple userIDs |
| type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| groupID | String | No | - | IM group ID. When calling in a group chat, this field must be passed |
| timeout | Number | No | 30 | Timeout in seconds, 0 means no timeout |
| roomID | Number | No | - | Numeric room ID, range [1, 2147483647] |
| strRoomID | String | No | - | String room ID, length up to 64 bytes. `roomID` and `strRoomID` are mutually exclusive; if `strRoomID` is specified, `roomID` must be 0 |
| offlinePushInfo | Object | No | - | Custom offline push information |
| offlinePushInfo.title | String | No | - | Offline push title |
| offlinePushInfo.description | String | No | - | Offline push description |
| offlinePushInfo.androidOPPOChannelID | String | No | - | OPPO channel ID for offline push |
| offlinePushInfo.extension | String | No | - | Offline push extension field |
| data | String | No | - | Custom data passed to the callee |

#### setSelfInfo

Set user nickname and avatar.

``` javascript
this.$refs.TUICallKit.setSelfInfo({
  nickName: 'Tom',
  avatar: 'https://...'
})
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| nickName | String | No | - | User nickname |
| avatar | String | No | - | User avatar URL |

#### setCallingBell

Set a custom ringtone for incoming calls.

``` javascript
this.$refs.TUICallKit.setCallingBell(filePath)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| filePath | String | Yes | - | Path to the ringtone file. Only local file paths are accepted. The setting is device-bound and persists across user switches. Pass an empty string to restore the default ringtone. |

#### enableMuteMode

Enable/disable mute mode for incoming calls.

``` javascript
this.$refs.TUICallKit.enableMuteMode(true)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| enable | Boolean | Yes | false | true to enable mute mode (no ringtone on incoming calls), false to disable |

#### enableFloatWindow

Enable/disable the floating window feature.

``` javascript
this.$refs.TUICallKit.enableFloatWindow(true)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| enable | Boolean | Yes | false | true to enable floating window, false to disable |

### TUICallEngine API Details

#### createInstance

Create a TUICallEngine instance.

``` javascript
import { TUICallEngine } from '../../TUICallKit/TUICallService/index';
const tuiCallEngine = TUICallEngine.createInstance();
```

#### destroyInstance

Destroy the TUICallEngine instance to release resources.

``` javascript
TUICallEngine.destroyInstance();
```

#### on

Register an event listener.

``` javascript
tuiCallEngine.on(event, callback)
```

#### off

Unregister an event listener.

``` javascript
tuiCallEngine.off(event, callback)
```

#### login

Login. All features require login first.

``` javascript
tuiCallEngine.login({ SDKAppID, userID, userSig })
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| SDKAppID | Number | Yes | - | SDKAppID |
| userID | String | Yes | - | User ID |
| userSig | String | Yes | - | UserSig |

#### logout

Logout.

``` javascript
tuiCallEngine.logout()
```

#### setSelfInfo

Set user nickname and avatar.

``` javascript
tuiCallEngine.setSelfInfo({ nickName, avatar })
```

#### calls

Initiate a call (supports both 1v1 and group calls).

``` javascript
tuiCallEngine.calls({
  userIDList: ['mike'],
  type: 2
})
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| userIDList | Array | Yes | - | List of callee userIDs |
| type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| groupID | String | No | - | IM group ID |
| timeout | Number | No | 30 | Timeout in seconds |
| roomID | Number | No | - | Numeric room ID |
| strRoomID | String | No | - | String room ID |
| offlinePushInfo | Object | No | - | Offline push information |
| data | String | No | - | Custom data |

#### groupCall

Initiate a group call.

``` javascript
tuiCallEngine.groupCall({
  userIDList: ['mike', 'tom'],
  type: 2,
  groupID: 'xxx'
})
```

#### accept

Accept a call.

``` javascript
tuiCallEngine.accept()
```

#### reject

Reject a call.

``` javascript
tuiCallEngine.reject()
```

#### hangup

Hang up a call.

``` javascript
tuiCallEngine.hangup()
```

#### switchCallMediaType

Switch between voice and video call types. Only supported in 1v1 calls.

``` javascript
tuiCallEngine.switchCallMediaType({ newMediaType: 1 })
```

#### openCamera

Enable the camera.

``` javascript
tuiCallEngine.openCamera()
```

#### closeCamera

Disable the camera.

``` javascript
tuiCallEngine.closeCamera()
```

#### switchCamera

Switch between front and rear cameras.

``` javascript
tuiCallEngine.switchCamera({ cameraId: 'front' })
```

#### openMicrophone

Enable the microphone.

``` javascript
tuiCallEngine.openMicrophone()
```

#### closeMicrophone

Disable the microphone.

``` javascript
tuiCallEngine.closeMicrophone()
```

#### setMicMute

Set microphone mute state.

``` javascript
tuiCallEngine.setMicMute({ isMute: true })
```

#### setVideoQuality

Set video encoding quality.

``` javascript
tuiCallEngine.setVideoQuality(quality)
```

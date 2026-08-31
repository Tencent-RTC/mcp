## API Overview

### TUICallKit (with UI)

TUICallKit API is the **audio/video calling component that includes a UI interface**. Using this API is like adding a WeChat-like audio/video calling scenario to your app.

| API | Description |
| --- | --- |
| init | Initialize TUICallKit |
| calls | Initiate 1v1 / group call |
| joinInGroupCall | Join a group call |
| setSelfInfo | Set user nickname and avatar |
| enableFloatWindow | Enable/disable floating window |
| setLanguage | Set language |
| destroyed | Destroy TUICallKit |

### TUICallEngine (No UI)

TUICallEngine API is the underlying engine of the audio/video calling component **without a UI interface**, suitable for custom audio/video calling scenarios.

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
| joinInGroupCall | Join a group call |
| accept | Accept a call |
| reject | Reject a call |
| hangup | Hang up a call |
| switchCallMediaType | Switch call media type (e.g., voice to video) |
| setVideoQuality | Set video quality |
| openCamera | Enable camera |
| closeCamera | Disable camera |
| switchCamera | Switch between front/rear camera |
| openMicrophone | Enable microphone |
| closeMicrophone | Disable microphone |
| setMicMute | Set microphone mute state |
| setVideoRenderView | Set the video rendering view |
| getTRTCInstance | Get the TRTC instance |
| getSDKVersion | Get the SDK version |

## API Details

### TUICallKit API Details

#### init

Initialize TUICallKit.

``` javascript
TUICallKitAPI.init(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Initialization parameter object |
| params.sdkAppID | Number | Yes | - | SDKAppID |
| params.userID | String | Yes | - | User ID |
| params.userSig | String | Yes | - | UserSig |
| params.globalCallPagePath | String | Yes | - | Global call page path, used to listen for incoming calls |

#### calls

Initiate a 1v1 or group call (uni-app packaging).

``` javascript
TUICallKitAPI.calls(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Call parameter object |
| params.userIDList | Array | Yes | - | List of callee userIDs. For 1v1 calls, pass one userID; for group calls, pass multiple userIDs |
| params.type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| params.groupID | String | No | - | IM group ID. When calling in a group chat, you must pass this field |
| params.timeout | Number | No | 30 | Timeout in seconds, 0 means no timeout |
| params.roomID | Number | No | - | Numeric room ID, range [1, 2147483647] |
| params.strRoomID | String | No | - | String room ID, length up to 64 bytes. roomID and strRoomID are mutually exclusive; if strRoomID is specified, roomID must be 0 |
| params.offlinePushInfo | Object | No | - | Custom offline push information |
| params.offlinePushInfo.title | String | No | - | Offline push title |
| params.offlinePushInfo.description | String | No | - | Offline push description |
| params.offlinePushInfo.androidOPPOChannelID | String | No | - | OPPO channel ID for offline push |
| params.offlinePushInfo.extension | String | No | - | Offline push extension field |
| params.data | String | No | - | Custom data passed to the callee. The callee receives this via the [USER_ON_CALLING event's data field](https://cloud.tencent.com/document/product/647/78759#9cc96dd6-44c9-4f7f-8e1c-dab94c3cbac6) |

#### joinInGroupCall

Join a group call.

``` javascript
TUICallKitAPI.joinInGroupCall(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Join group call parameters |
| params.type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| params.groupID | String | Yes | - | Group call group ID |
| params.roomID | Number | Yes | - | Numeric room ID, range [1, 2147483647] |

#### setSelfInfo

Set user nickname and avatar.

``` javascript
TUICallKitAPI.setSelfInfo(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | User info parameters |
| params.nickName | String | No | - | User nickname |
| params.avatar | String | No | - | User avatar URL |

#### enableFloatWindow

Enable/disable the floating window feature. Supported since **v4.2.10+**, only available in video call scenarios.

``` javascript
TUICallKitAPI.enableFloatWindow(enable)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| enable | Boolean | Yes | false | true to enable floating window, false to disable |

#### setLanguage

Set the language. Currently supports Chinese (zh) and English (en).

``` javascript
TUICallKitAPI.setLanguage(language)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| language | String | Yes | 'zh' | Language to set: 'zh' for Chinese, 'en' for English |

#### destroyed

Destroy TUICallKit. Call this when you want to destroy the TUICallKit instance.

``` javascript
TUICallKitAPI.destroyed()
```

### TUICallEngine API Details

#### createInstance

Create a TUICallEngine instance. This is a **static method** and is the entry point for creating TUICallEngine.

``` javascript
import { TUICallEngine } from '../../TUICallKit/TUICallService/index';
const tuiCallEngine = TUICallEngine.createInstance();
```

#### destroyInstance

Destroy the TUICallEngine instance. This is a **static method** used to release TUICallEngine resources.

``` javascript
TUICallEngine.destroyInstance();
```

#### on

Register an event listener. Use this to listen for TUICallEngine dispatched events.

``` javascript
tuiCallEngine.on(event, callback)
```

#### off

Unregister an event listener.

``` javascript
tuiCallEngine.off(event, callback)
```

#### login

Login interface. All features can only be used normally after logging in.

``` javascript
tuiCallEngine.login(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Login parameters |
| params.SDKAppID | Number | Yes | - | SDKAppID |
| params.userID | String | Yes | - | User ID |
| params.userSig | String | Yes | - | UserSig |

#### logout

Logout interface.

``` javascript
tuiCallEngine.logout()
```

#### setSelfInfo

Set user nickname and avatar.

``` javascript
tuiCallEngine.setSelfInfo(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | User info parameters |
| params.nickName | String | No | - | User nickname |
| params.avatar | String | No | - | User avatar URL |

#### calls

Initiate a call (supports both 1v1 and group calls). The `calls` API combines the original `call` and `groupCall` capabilities.

``` javascript
tuiCallEngine.calls(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Call parameter object |
| params.userIDList | Array | Yes | - | List of callee userIDs |
| params.type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| params.groupID | String | No | - | IM group ID |
| params.timeout | Number | No | 30 | Timeout in seconds |
| params.roomID | Number | No | - | Numeric room ID |
| params.strRoomID | String | No | - | String room ID |
| params.offlinePushInfo | Object | No | - | Offline push information |
| params.data | String | No | - | Custom data |

#### groupCall

Initiate a group call.

``` javascript
tuiCallEngine.groupCall(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Group call parameters |
| params.userIDList | Array | Yes | - | List of callee userIDs |
| params.type | Number | Yes | - | Call media type: 1 for voice, 2 for video |
| params.groupID | String | Yes | - | Group call group ID |
| params.timeout | Number | No | 30 | Timeout in seconds |
| params.roomID | Number | No | - | Numeric room ID |
| params.strRoomID | String | No | - | String room ID |
| params.offlinePushInfo | Object | No | - | Offline push information |

#### joinInGroupCall

Join a group call.

``` javascript
tuiCallEngine.joinInGroupCall(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Join group call parameters |
| params.type | Number | Yes | - | Call media type |
| params.groupID | String | Yes | - | Group call group ID |
| params.roomID | Number | Yes | - | Numeric room ID |

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

Hang up a call. When in a multi-party call, calling this API just causes the user to leave the call. A multi-party call is considered ended only when all users have left.

``` javascript
tuiCallEngine.hangup()
```

#### switchCallMediaType

Switch between voice and video call types. Only supported in 1v1 calls.

``` javascript
tuiCallEngine.switchCallMediaType(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Switch type parameters |
| params.newMediaType | Number | Yes | - | Target call media type: 1 for voice, 2 for video |

#### setVideoQuality

Set video encoding resolution.

``` javascript
tuiCallEngine.setVideoQuality(quality)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| quality | String | Yes | - | Video quality preset |

#### openCamera

Enable the camera. The video stream is rendered to the specified `<live-pusher>` component.

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
tuiCallEngine.switchCamera(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Camera parameters |
| params.cameraId | String | Yes | - | Camera ID, 'front' for front camera, 'back' for rear camera |

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
tuiCallEngine.setMicMute(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Mute parameters |
| params.isMute | Boolean | Yes | - | Whether to mute the microphone |

#### setVideoRenderView

Set the video rendering view.

``` javascript
tuiCallEngine.setVideoRenderView(params)
```

Parameter details:
| Parameter | Type | Required | Default | Description |
|---------|---------|---------|---------|---------|
| params | Object | Yes | - | Rendering view parameters |
| params.userID | String | Yes | - | User ID of the video to render |
| params.video | Object | Yes | - | Native component rendering view |

#### getTRTCInstance

Get the TRTC instance. Use this to access more TRTC features.

``` javascript
const trtcInstance = tuiCallEngine.getTRTCInstance()
```

#### getSDKVersion

Get the SDK version string.

``` javascript
const version = tuiCallEngine.getSDKVersion()
```

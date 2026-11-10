---
sync_node_id: '165654454250659840'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "React Native"
  - "TUICallEngine"
product: "call"
---
## TUICallEngine APIs

`TUICallEngine` is an audio/video call component that **does not include UI elements**. If `TUICallKit` does not meet your requirements, you can use the APIs of `TUICallEngine` to customize your project.

## Overview
| API | Description |
| --- | --- |
| createInstance | Creates a <code>TUICallEngine</code> instance (singleton mode). |
| destroyInstance | Terminates a <code>TUICallEngine</code> instance (singleton mode). |
| login | Authenticates the basic audio/video call capabilities. |
| on | Registers an event listener. |
| off | Unregisters an event listener. |
| call | Makes a one-to-one call. |
| accept | Accepts a call. |
| reject | Rejects a call. |
| ignore | Ignores a call. |
| hangup | Ends a call. |
| switchCallMediaType | Changes the call type, for example, from video call to audio call. |
| startRemoteView | Subscribes to the video stream of a remote user. |
| stopRemoteView | Unsubscribes from the video stream of a remote user. |
| openCamera | Turns the camera on. |
| switchCamera | Switches between the front and rear cameras. |
| closeCamera | Turns the camera off. |
| openMicrophone | Turns the mic on. |
| closeMicrophone | Turns the mic off. |
| selectAudioPlaybackDevice | Selects the audio playback device (receiver or speaker). |
| setVideoRenderParams | Set the rendering mode of video image. |
| setVideoEncoderParams | Set the encoding parameters of video encoder. |
| setBeautyLevel | Set beauty level, support turning off default beauty. |
| setSelfInfo | Sets the alias and profile photo. |
| enableMultiDeviceAbility | Sets whether to enable multi-device login for <code>TUICallEngine</code> |

## Details

### CreateInstance

This API is used to create a TUICallEngine singleton.
``` tsx
TUICallKit.CreateInstance();
```

## destroyInstance

This API is used to terminate a TUICallEngine singleton.
``` tsx
TUICallKit.destroyInstance();
```

### login

This API is used to initialize TUICallEngine. Call it to authenticate the call service and perform other required actions before you call other APIs.
``` tsx
login(
  sdkAppId: number;
  userId: string;
  userSig: string;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| sdkAppId | Number | The unique identifier SDKAppID for the audio and video application created in <a href="https://console.trtc.io/">Tencent RTC Console</a>. |
| userId | String | Customers define their own User ID based on their business. You can only include letters (a-z, A-Z), digits (0-9), underscores, and hyphens. |
| userSig | String | SDKSecretKey for the audio and video application created in <a href="https://console.trtc.io/">Tencent RTC Console</a>. |

### on

This API is used to register an event listener to listen for TUICallEvents events.
``` tsx
on(type: TUICallEvent, listener: (params: any) => void): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| type | TUICallEvent | Registers an event listener. |

### off

This API is used to unregister an event listener.
``` tsx
off(type: TUICallEvent): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| type | TUICallEvent | Unregister an event listener. |

### call

This API is used to make a (one-to-one) call.
``` tsx
call(
  userId: string;
  mediaType: MediaType;
  callParams?: CallParams;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | string | The target user ID. |
| mediaType | MediaType | which can be video or audio. For details, please . |
| callParams | CallParams | An additional parameter, such as roomID, call timeout, offline push info,etc.For details, please

### accept

This API is used to accept a call. After receiving the onCallReceived() callback, you can call this API to accept the call.
``` tsx
accept(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### reject

This API is used to reject a call. After receiving the onCallReceived() callback, you can call this API to reject the call.
``` tsx
reject(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### ignore

This API is used to ignore a call. After receiving the onCallReceived(), you can call this API to ignore the call. The caller will receive the onUserLineBusy callback.
``` tsx
ignore(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### hangup

This API is used to end a call.
``` tsx
hangup(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### switchCallMediaType

This API is used to change the call type.
``` tsx
switchCallMediaType(mediaType: MediaType): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| mediaType | MediaType | The call type, which can be video or audio. For details, For details, please . |

### startRemoteView

This API is used to subscribe to the video stream of a remote user. For it to work, make sure you call it after setRenderView.
``` tsx
startRemoteView(
  userId: string;
  viewId: string;
  onPlaying: (params: any) => void;
  onLoading: (params: any) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | string | The target user ID. |
| viewId | string | The target view ID. |

### stopRemoteView

This API is used to unsubscribe from the video stream of a remote user.
``` tsx
stopRemoteView(userId: string;): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | string | The target user ID. |

### openCamera

This API is used to turn the camera on.
``` tsx
openCamera(  
  camera?: Camera;
  viewId: string;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| camera | Camera | This parameter is used to set the front and back cameras.<br>- Camera.Front: Front camera.<br>- Camera.Back: Rear camera. |
| viewId | string | The target view ID. We recommend that you set the view ID to the user's user ID |

### switchCamera

This API is used to switch between the front and rear cameras.
``` tsx
switchCamera(camera: Camera): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| camera | Camera | This parameter is used to set the front and back cameras.<br>- Camera.Front: Front camera.<br>- Camera.Back: Rear camera. |

### closeCamera

This API is used to turn the camera off.
``` tsx
closeCamera(): void {}
```

### openMicrophone

This API is used to turn the mic on.
``` tsx
openMicrophone(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### closeMicrophone

This API is used to turn the mic off.
``` tsx
closeMicrophone(
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```

### selectAudioPlaybackDevice

This API is used to select the audio playback device (receiver or speaker). In call scenarios, you can use this API to turn on/off hands-free mode.
``` tsx
selectAudioPlaybackDevice(
  device: AudioPlaybackDevice;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| device | AudioPlaybackDevice | This parameter is used to set the front and back cameras.<br>- AudioPlaybackDevice.Earpiece<br>- AudioPlaybackDevice.Speakerphone |

### setVideoRenderParams

Set the rendering mode of video image.
``` tsx
setVideoRenderParams(
  userId: string;
  videoRender?: {
    fillMode?: FillMode;
    rotation?: Rotation;
  };
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| userId | string | The target user ID. |
| fillMode | FillMode | the video image will be centered and scaled to fill the entire display area, where parts that exceed the area will be cropped. The displayed image may be incomplete in this mode. |
| rotation | Rotation | - Rotation.Rotation_0: No rotation<br>- Rotation.Rotation_90: Clockwise rotation by 90 degrees<br>- Rotation.Rotation_180: Clockwise rotation by 180 degrees<br>- Rotation.Rotation_270: Clockwise rotation by 0 degrees |

### setVideoEncoderParams

Set the encoding parameters of video encoder.

This setting can determine the quality of image viewed by remote users, which is also the image quality of on-cloud recording files.
``` tsx
setVideoEncoderParams(
  videoEncoder?: {
    resolution?: Resolution;
    resolutionMode?: ResolutionMode;
  };
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| resolution | Resolution | Video resolution |
| resolutionMode | ResolutionMode | Video aspect ratio mode |

### setBeautyLevel

Set beauty level, support turning off default beauty.
``` tsx
setBeautyLevel(
  level: number;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| level | number | Beauty level，range: 0 - 9, 0 means turning off the effect, 9 means the most obvious effect. |

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.
``` tsx
setSelfInfo(
  nickname: string;
  avatar?: string;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| nickname | string | The alias. |
| avatar | string | The URL of the profile photo. |

### enableMultiDeviceAbility

This API is used to set whether to enable multi-device login for TUICallEngine (supported by the Group Call package).
``` tsx
enableMultiDeviceAbility(
  enable: boolean;
  onSuccess?: (data: String) => void;
  onError?: (errCode: number, errMsg: string) => void;
): void {}
```
| Parameter | Type | Description |
| --- | --- | --- |
| enable | boolean | set whether to enable multi-device login for TUICallEngine |

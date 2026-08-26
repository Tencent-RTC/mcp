## Introduction

`DeviceStore` provides a comprehensive set of APIs to manage audio and video devices, including microphone, camera and screen sharing features.

> **Important:**
> Use **shared** singleton to get the `DeviceStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Device state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates about microphone, camera, network and other states.
>

## Features
- **Microphone Management**: Open/close microphone, set capture volume and output volume.

- **Camera Management**: Open/close camera, switch front/rear camera, set mirror and video quality.

- **Audio Route**: Switch between speaker and earpiece.

- **Screen Sharing**: Start and stop screen sharing feature.

- **Network Status**: Real-time monitoring of network quality information.

## Subscribable Data

**DeviceState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|microphoneStatus|ValueListenable<DeviceStatus>|Microphone status.|
|microphoneLastError|ValueListenable<DeviceError>|Microphone error, used to extract error information when an error occurs.|
|captureVolume|ValueListenable<int>|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|ValueListenable<int>|Current user's actual output volume.|
|outputVolume|ValueListenable<int>|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|ValueListenable<DeviceStatus>|Camera status.|
|cameraLastError|ValueListenable<DeviceError>|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|ValueListenable<bool>|Whether it's front camera.|
|localMirrorType|ValueListenable<MirrorType>|Mirror state.|
|localVideoQuality|ValueListenable<VideoQuality>|Local video quality.|
|currentAudioRoute|ValueListenable<AudioRoute>|Current audio route location.|
|screenStatus|ValueListenable<DeviceStatus>|Screen sharing status.|
|networkInfo|ValueListenable<NetworkInfo>|Network information.|
|networkType|NetworkType|Current network type.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Singleton object.|
|openLocalMicrophone|Open local microphone.|
|closeLocalMicrophone|Close local microphone.|
|setCaptureVolume|Set capture volume.|
|setOutputVolume|Set output volume.|
|setAudioRoute|Set audio route.|
|openLocalCamera|Open local camera.|
|closeLocalCamera|Close local camera.|
|switchCamera|Switch camera.|
|switchMirror|Switch mirror state.|
|updateVideoQuality|Update video quality.|
|startScreenShare|Start screen sharing.|
|stopScreenShare|Stop screen sharing.|
|reset|Reset to default state.|

### Getting Instance

#### shared

Singleton object.

### Microphone Operations

#### openLocalMicrophone

Open local microphone.
``` dart
Future<CompletionHandler> openLocalMicrophone();
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Whether operation succeeded.|

#### closeLocalMicrophone

Close local microphone.
``` dart
void closeLocalMicrophone();
```

**Version**

Supported since version 3.5.

#### setCaptureVolume

Set capture volume.
``` dart
void setCaptureVolume(int volume);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|int|Capture volume, with a value range from 0 to 100.|

#### setOutputVolume

Set maximum output volume.
``` dart
void setOutputVolume(int volume);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|int|Maximum volume, with a value range from 0 to 100.|

### Audio Route

#### setAudioRoute

Set audio route.
``` dart
void setAudioRoute(AudioRoute route);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|route|AudioRoute|Route location.|

### Camera Operations

#### openLocalCamera

Open local camera.
``` dart
Future<CompletionHandler> openLocalCamera(bool isFront);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|bool|Whether front camera.|
|completion|CompletionClosure?|Whether operation succeeded.|

#### closeLocalCamera

Close local camera.
``` dart
void closeLocalCamera();
```

**Version**

Supported since version 3.5.

#### switchCamera

Switch camera.
``` dart
void switchCamera(bool isFront);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|bool|Whether front camera.|

#### switchMirror

Switch mirror state.
``` dart
void switchMirror(MirrorType mirrorType);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|mirrorType|MirrorType|Mirror state.|

#### updateVideoQuality

Update video quality.
``` dart
void updateVideoQuality(VideoQuality quality);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|quality|VideoQuality|Video quality.|

### Screen Sharing

#### startScreenShare

Start screen sharing.
``` dart
void startScreenShare({String iOSAppGroup = ''});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|iOSAppGroup|String|Defaults to '', which is the correct value for Android (ignored on the Android platform). On iOS, the value must match the App Group string configured in the Broadcast Upload Extension, used for sharing data between the host app and the Extension, in the format group.<reverse-domain>. Passing an empty string is allowed but does not guarantee screen sharing stability; configuring it correctly is recommended.|

#### stopScreenShare

Stop screen capture.
``` dart
void stopScreenShare();
```

**Version**

Supported since version 3.5.

### Reset

#### reset

Reset to default state.
``` dart
void reset();
```

**Version**

Supported since version 3.5.

## Data Structures

### DeviceType

Device type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|microphone|0|Microphone type.|
|camera|1|Camera type.|
|screenShare|2|Screen sharing type.|

### DeviceError

Device related error codes.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|noError|0|Operation successful.|
|noDeviceDetected|1|No device detected.|
|noSystemPermission|2|No system permission.|
|notSupportCapture|3|Capture not supported.|
|occupiedError|4|Device occupied.|
|unknownError|5|Unknown error.|

### DeviceStatus

Device on/off status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|off|0|Off.|
|on|1|On.|

### AudioRoute

Audio route.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|speakerphone|0|Speaker, using speaker to play (i.e., "hands-free"), located at the bottom of the phone, louder sound, suitable for playing music out loud.|
|earpiece|1|Earpiece, using earpiece to play, located at the top of the phone, quieter sound, suitable for private call scenarios.|

### VideoQuality

Video quality level.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|quality360P|1|360P, resolution 640 x 360.|
|quality540P|2|540P, resolution 960 x 540.|
|quality720P|3|720P, resolution 1280 x 720.|
|quality1080P|4|1080P, resolution 1920 x 1080.|

### NetworkQuality

Network quality.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|unknown|0|Unknown network.|
|excellent|1|Excellent.|
|good|2|Good.|
|poor|3|Poor.|
|bad|4|Bad.|
|veryBad|5|Very bad.|
|down|6|Disconnected.|

### MirrorType

Camera mirror state.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|auto|0|Auto, front camera mirrored, rear camera not mirrored.|
|enable|1|Both front and rear cameras mirrored.|
|disable|2|Neither front nor rear camera mirrored.|

### DeviceFocusOwner

Device focus.

|**Enum Value**|**Description**|
|---------|---------|
|call|Voice call scenario.|
|live|Live streaming scenario.|
|room|Room scenario.|
|none|Not set.|

### NetworkInfo

Network information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|userID|String|User unique ID.|
|quality|NetworkQuality|Network quality.|
|upLoss|int|Uplink packet loss rate, with a value range from 0 to 100.|
|downLoss|int|Downlink packet loss rate, with a value range from 0 to 100.|
|delay|int|Latency (unit: milliseconds).|

### DeviceState

Device state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|microphoneStatus|ValueListenable<DeviceStatus>|Microphone status.|
|microphoneLastError|ValueListenable<DeviceError>|Microphone error, used to extract error information when an error occurs.|
|captureVolume|ValueListenable<int>|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|ValueListenable<int>|Current user's actual output volume.|
|outputVolume|ValueListenable<int>|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|ValueListenable<DeviceStatus>|Camera status.|
|cameraLastError|ValueListenable<DeviceError>|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|ValueListenable<bool>|Whether it's front camera.|
|localMirrorType|ValueListenable<MirrorType>|Mirror state.|
|localVideoQuality|ValueListenable<VideoQuality>|Local video quality.|
|currentAudioRoute|ValueListenable<AudioRoute>|Current audio route location.|
|screenStatus|ValueListenable<DeviceStatus>|Screen sharing status.|
|networkInfo|ValueListenable<NetworkInfo>|Network information.|
|networkType|NetworkType|Current network type.|

## Usage Example
``` dart
// Get singleton instance
let store = DeviceStore.shared
// Subscribe to state changes
store.state.subscribe { state in
    print("Microphone status: \(state.microphoneStatus)")
    print("Camera status: \(state.cameraStatus)")
    print("Network quality: \(state.networkInfo.quality)")
}
// Open microphone
store.openLocalMicrophone { code, message in
    if code == 0 {
        print("Microphone opened successfully")
    }
}
// Open front camera
store.openLocalCamera(isFront: true) { code, message in
    if code == 0 {
        print("Camera opened successfully")
    }
}
```

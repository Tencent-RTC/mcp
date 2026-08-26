## Introduction

`DeviceStore` provides a comprehensive set of APIs to manage audio and video devices, including microphone, camera and screen sharing features.

> **Important:**
> Use **DeviceStore.shared** singleton to get the `DeviceStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> Device state updates are delivered through the **deviceState** publisher. Subscribe to it to receive real-time updates about microphone, camera, network and other states.
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
|microphoneStatus|StateFlow<DeviceStatus>|Microphone status.|
|microphoneLastError|StateFlow<DeviceError>|Microphone error, used to extract error information when an error occurs.|
|captureVolume|StateFlow<Int>|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|StateFlow<Int>|Current user's actual output volume.|
|outputVolume|StateFlow<Int>|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|StateFlow<DeviceStatus>|Camera status.|
|cameraLastError|StateFlow<DeviceError>|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|StateFlow<Boolean>|Whether it's front camera.|
|localMirrorType|StateFlow<MirrorType>|Mirror state.|
|localVideoQuality|StateFlow<VideoQuality>|Local video quality.|
|currentAudioRoute|StateFlow<AudioRoute>|Current audio route location.|
|screenStatus|StateFlow<DeviceStatus>|Screen sharing status.|
|networkInfo|StateFlow<NetworkInfo>|Network information.|
|networkType|StateFlow<NetworkType>|Current network type.|

## API List

|**Function**|**Description**|
|---------|---------|
|DeviceStore.shared|Singleton object.|
|openLocalMicrophone|Open local microphone.|
|closeLocalMicrophone|Close local microphone.|
|setCaptureVolume|Set capture volume.|
|setOutputVolume|Set output volume.|
|setAudioRoute|Set audio route.|
|startCameraTest|Start camera test.|
|stopCameraTest|Stop camera test.|
|openLocalCamera|Open local camera.|
|closeLocalCamera|Close local camera.|
|switchCamera|Switch camera.|
|switchMirror|Switch mirror state.|
|updateVideoQuality|Update video quality.|
|startScreenShare|Start screen sharing.|
|stopScreenShare|Stop screen sharing.|
|reset|Reset to default state.|

### Getting Instance

#### DeviceStore.shared

Singleton object.

### Microphone Operations

#### openLocalMicrophone

Open local microphone.
``` kotlin
abstract fun openLocalMicrophone(completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Whether operation succeeded.|

#### closeLocalMicrophone

Close local microphone.
``` kotlin
abstract fun closeLocalMicrophone()
```

**Version**

Supported since version 3.5.

#### setCaptureVolume

Set capture volume.
``` kotlin
abstract fun setCaptureVolume(volume: Int)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|Int|Capture volume, with a value range from 0 to 100.|

#### setOutputVolume

Set maximum output volume.
``` kotlin
abstract fun setOutputVolume(volume: Int)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|Int|Maximum volume, with a value range from 0 to 100.|

### Audio Route

#### setAudioRoute

Set audio route.
``` kotlin
abstract fun setAudioRoute(audioRoute: AudioRoute)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|audioRoute|AudioRoute|Route location.|

### Camera Operations

#### startCameraTest

Start camera test, if camera opens successfully, the view will be rendered to the set CameraView.
``` kotlin
abstract fun startCameraTest(cameraView: CameraView, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cameraView|CameraView|Rendering view for camera capture.|
|completion|CompletionHandler?|Whether operation succeeded.|

#### stopCameraTest

Stop camera test.
``` kotlin
abstract fun stopCameraTest()
```

**Version**

Supported since version 3.5.

#### openLocalCamera

Open local camera.
``` kotlin
abstract fun openLocalCamera(isFront: Boolean, completion: CompletionHandler?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|Boolean|Whether front camera.|
|completion|CompletionHandler?|Whether operation succeeded.|

#### closeLocalCamera

Close local camera.
``` kotlin
abstract fun closeLocalCamera()
```

**Version**

Supported since version 3.5.

#### switchCamera

Switch camera.
``` kotlin
abstract fun switchCamera(isFront: Boolean)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|Boolean|Whether front camera.|

#### switchMirror

Switch mirror state.
``` kotlin
abstract fun switchMirror(mirrorType: MirrorType)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|mirrorType|MirrorType|Mirror state.|

#### updateVideoQuality

Update video quality.
``` kotlin
abstract fun updateVideoQuality(quality: VideoQuality)
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
``` kotlin
abstract fun startScreenShare()
```

**Version**

Supported since version 3.5.

#### stopScreenShare

Stop screen capture.
``` kotlin
abstract fun stopScreenShare()
```

**Version**

Supported since version 3.5.

### Reset

#### reset

Reset to default state.
``` kotlin
abstract fun reset()
```

**Version**

Supported since version 3.5.

## Data Structures

### DeviceType

Device type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|MICROPHONE|0|Microphone type.|
|CAMERA|1|Camera type.|
|SCREEN_SHARE|2|Screen sharing type.|

### DeviceError

Device related error codes.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|NO_ERROR|0|Operation successful.|
|NO_DEVICE_DETECTED|1|No device detected.|
|NO_SYSTEM_PERMISSION|2|No system permission.|
|NOT_SUPPORT_CAPTURE|3|Capture not supported.|
|OCCUPIED_ERROR|4|Device occupied.|
|UNKNOWN_ERROR|5|Unknown error.|

### DeviceStatus

Device on/off status.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|OFF|0|Off.|
|ON|1|On.|

### AudioRoute

Audio route.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|SPEAKERPHONE|0|Speaker, using speaker to play (i.e., "hands-free"), located at the bottom of the phone, louder sound, suitable for playing music out loud.|
|EARPIECE|1|Earpiece, using earpiece to play, located at the top of the phone, quieter sound, suitable for private call scenarios.|

### VideoQuality

Video quality level.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|QUALITY_360P|1|360P, resolution 640 x 360.|
|QUALITY_540P|2|540P, resolution 960 x 540.|
|QUALITY_720P|3|720P, resolution 1280 x 720.|
|QUALITY_1080P|4|1080P, resolution 1920 x 1080.|

### NetworkQuality

Network quality.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|UNKNOWN|0|Unknown network.|
|EXCELLENT|1|Excellent.|
|GOOD|2|Good.|
|POOR|3|Poor.|
|BAD|4|Bad.|
|VERY_BAD|5|Very bad.|
|DOWN|6|Disconnected.|

### MirrorType

Camera mirror state.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|AUTO|0|Auto, front camera mirrored, rear camera not mirrored.|
|ENABLE|1|Both front and rear cameras mirrored.|
|DISABLE|2|Neither front nor rear camera mirrored.|

### NetworkType

Network type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|UNKNOWN|0|Unknown or unidentified network type.|
|WIFI|1|WiFi network connection.|
|CELLULAR|2|Cellular/mobile data network connection.|

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
|upLoss|Int|Uplink packet loss rate, with a value range from 0 to 100.|
|downLoss|Int|Downlink packet loss rate, with a value range from 0 to 100.|
|delay|Int|Latency (unit: milliseconds).|

### DeviceState

Device state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|microphoneStatus|StateFlow<DeviceStatus>|Microphone status.|
|microphoneLastError|StateFlow<DeviceError>|Microphone error, used to extract error information when an error occurs.|
|captureVolume|StateFlow<Int>|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|StateFlow<Int>|Current user's actual output volume.|
|outputVolume|StateFlow<Int>|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|StateFlow<DeviceStatus>|Camera status.|
|cameraLastError|StateFlow<DeviceError>|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|StateFlow<Boolean>|Whether it's front camera.|
|localMirrorType|StateFlow<MirrorType>|Mirror state.|
|localVideoQuality|StateFlow<VideoQuality>|Local video quality.|
|currentAudioRoute|StateFlow<AudioRoute>|Current audio route location.|
|screenStatus|StateFlow<DeviceStatus>|Screen sharing status.|
|networkInfo|StateFlow<NetworkInfo>|Network information.|
|networkType|StateFlow<NetworkType>|Current network type.|

## Usage Example
``` kotlin
// Get singleton instance
val store = DeviceStore.shared()
// Subscribe to state changes
lifecycleScope.launch {
    store.deviceState.microphoneStatus.collect { status ->
        println("Microphone status: $status")
    }
}
lifecycleScope.launch {
    store.deviceState.cameraStatus.collect { status ->
        println("Camera status: $status")
    }
}
// Open microphone
store.openLocalMicrophone { code, message ->
    if (code == 0) {
        println("Microphone opened successfully")
    }
}
// Open front camera
store.openLocalCamera(isFront = true) { code, message ->
    if (code == 0) {
        println("Camera opened successfully")
    }
}
```

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
|microphoneStatus|DeviceStatus|Microphone status.|
|microphoneLastError|DeviceError|Microphone error, used to extract error information when an error occurs.|
|captureVolume|Int|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|Int|Current user's actual output volume.|
|outputVolume|Int|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|DeviceStatus|Camera status.|
|cameraLastError|DeviceError|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|Bool|Whether it's front camera.|
|localMirrorType|MirrorType|Mirror state.|
|localVideoQuality|VideoQuality|Local video quality.|
|currentAudioRoute|AudioRoute|Current audio route location.|
|screenStatus|DeviceStatus|Screen sharing status.|
|networkInfo|NetworkInfo|Network information.|
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

#### shared

Singleton object.

### Microphone Operations

#### openLocalMicrophone

Open local microphone.
``` swift
public func openLocalMicrophone(completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Whether operation succeeded.|

#### closeLocalMicrophone

Close local microphone.
``` swift
public func closeLocalMicrophone() {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

#### setCaptureVolume

Set capture volume.
``` swift
public func setCaptureVolume(volume: Int) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|volume|Int|Capture volume, with a value range from 0 to 100.|

#### setOutputVolume

Set maximum output volume.
``` swift
public func setOutputVolume(_ volume: Int) {
    fatalError("\(#function) must be overridden by subclass")
}
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
``` swift
public func setAudioRoute(_ route: AudioRoute) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|route|AudioRoute|Route location.|

### Camera Operations

#### startCameraTest

Start camera test, if camera opens successfully, the view will be rendered to the set CameraView.
``` swift
public func startCameraTest(
    cameraView: UIView,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cameraView|UIView|Rendering view for camera capture.|
|completion|CompletionClosure?|Whether operation succeeded.|

#### stopCameraTest

Stop camera test.
``` swift
public func stopCameraTest() {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

#### openLocalCamera

Open local camera.
``` swift
public func openLocalCamera(
    isFront: Bool,
    completion: CompletionClosure?
) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|Bool|Whether front camera.|
|completion|CompletionClosure?|Whether operation succeeded.|

#### closeLocalCamera

Close local camera.
``` swift
public func closeLocalCamera() {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

#### switchCamera

Switch camera.
``` swift
public func switchCamera(isFront: Bool) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isFront|Bool|Whether front camera.|

#### switchMirror

Switch mirror state.
``` swift
public func switchMirror(mirrorType: MirrorType) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|mirrorType|MirrorType|Mirror state.|

#### updateVideoQuality

Update video quality.
``` swift
public func updateVideoQuality(_ quality: VideoQuality) {
    fatalError("\(#function) must be overridden by subclass")
}
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
``` swift
public func startScreenShare(appGroup: String) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|appGroup|String|The value must match the App Group string configured in the Broadcast Upload Extension, used for sharing data between the host app and the Extension, in the format group.<reverse-domain>. Passing an empty string is allowed but does not guarantee screen sharing stability; configuring it correctly is recommended.|

#### stopScreenShare

Stop screen capture.
``` swift
public func stopScreenShare() {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

### Reset

#### reset

Reset to default state.
``` swift
public func reset() {
    fatalError("\(#function) must be overridden by subclass")
}
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

### NetworkType

Network type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|unknown|0|Unknown or unidentified network type.|
|wifi|1|WiFi network connection.|
|cellular|2|Cellular/mobile data network connection.|

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
|upLoss|UInt32|Uplink packet loss rate, with a value range from 0 to 100.|
|downLoss|UInt32|Downlink packet loss rate, with a value range from 0 to 100.|
|delay|UInt32|Latency (unit: milliseconds).|

### DeviceState

Device state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|microphoneStatus|DeviceStatus|Microphone status.|
|microphoneLastError|DeviceError|Microphone error, used to extract error information when an error occurs.|
|captureVolume|Int|Capture volume, with a value range from 0 to 100.|
|currentMicVolume|Int|Current user's actual output volume.|
|outputVolume|Int|Maximum output volume, with a value range from 0 to 100.|
|cameraStatus|DeviceStatus|Camera status.|
|cameraLastError|DeviceError|Camera error, used to extract error information when an error occurs.|
|isFrontCamera|Bool|Whether it's front camera.|
|localMirrorType|MirrorType|Mirror state.|
|localVideoQuality|VideoQuality|Local video quality.|
|currentAudioRoute|AudioRoute|Current audio route location.|
|screenStatus|DeviceStatus|Screen sharing status.|
|networkInfo|NetworkInfo|Network information.|
|networkType|NetworkType|Current network type.|

## Usage Example
``` swift
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

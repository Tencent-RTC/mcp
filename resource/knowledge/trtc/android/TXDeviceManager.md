Copyright (c) 2021 Tencent. All rights reserved.

Module: audio/video device management module

Description: manages audio/video devices such as camera, mic, and speaker.

## TXDeviceManager

|FuncList|DESC|
|---------|---------|
|isFrontCamera|Querying whether the front camera is being used.|
|switchCamera|Switching to the front/rear camera (for mobile OS).|
|getCameraZoomMaxRatio|Getting the maximum zoom ratio of the camera (for mobile OS).|
|setCameraZoomRatio|Setting the camera zoom ratio (for mobile OS).|
|isAutoFocusEnabled|Querying whether automatic face detection is supported (for mobile OS).|
|enableCameraAutoFocus|Enabling auto focus (for mobile OS).|
|setCameraFocusPosition|Adjusting the focus (for mobile OS).|
|enableCameraTorch|Enabling/Disabling flash, i.e., the torch mode (for mobile OS).|
|setAudioRoute|Setting the audio route (for mobile OS).|
|setExposureCompensation|Set the exposure parameters of the camera, ranging from - 1 to 1.|
|setCameraCapturerParam|Set camera acquisition preferences.|
|setSystemVolumeType|Setting the system volume type (for mobile OS).|

## StructType

|FuncList|DESC|
|---------|---------|
|TXCameraCaptureParam|Camera acquisition parameters.|

## EnumType

|EnumType|DESC|
|---------|---------|
|TXSystemVolumeType|System volume type.|
|TXAudioRoute|Audio route (the route via which audio is played).|
|TXCameraCaptureMode|Camera acquisition preferences.|

## isFrontCamera

**Querying whether the front camera is being used.**

## switchCamera

**Switching to the front/rear camera (for mobile OS).**

## getCameraZoomMaxRatio

**Getting the maximum zoom ratio of the camera (for mobile OS).**

## setCameraZoomRatio

**Setting the camera zoom ratio (for mobile OS).**

|Param|DESC|
|---------|---------|
|zoomRatio|Value range: [1, 5]. 1 indicates the widest angle of view (original), and 5 the narrowest angle of view (zoomed in).The maximum value is recommended to be 5. If the value exceeds 5, the video will become blurred.|

## isAutoFocusEnabled

**Querying whether automatic face detection is supported (for mobile OS).**

## enableCameraAutoFocus

**Enabling auto focus (for mobile OS).**

After auto focus is enabled, the camera will automatically detect and always focus on faces.

## setCameraFocusPosition

**Adjusting the focus (for mobile OS).**

This API can be used to achieve the following:

1. A user can tap on the camera preview.

2. A rectangle will appear where the user taps, indicating the spot the camera will focus on.

3. The user passes the coordinates of the spot to the SDK using this API, and the SDK will instruct the camera to focus as required.

|Param|DESC|
|---------|---------|
|position|The spot to focus on. Pass in the coordinates of the spot you want to focus on.|

> **Note**
> Before using this API, you must first disable auto focus using enableCameraAutoFocus.
>

**Return Desc:**

0: operation successful; negative number: operation failed.

## enableCameraTorch

**Enabling/Disabling flash, i.e., the torch mode (for mobile OS).**

## setAudioRoute

**Setting the audio route (for mobile OS).**

A mobile phone has two audio playback devices: the receiver at the top and the speaker at the bottom.

If the audio route is set to the receiver, the volume is relatively low, and audio can be heard only when the phone is put near the ear. This mode has a high level of privacy and is suitable for answering calls.

If the audio route is set to the speaker, the volume is relatively high, and there is no need to put the phone near the ear. This mode enables the "hands-free" feature.

## setExposureCompensation

**Set the exposure parameters of the camera, ranging from - 1 to 1.**

## setCameraCapturerParam

**Set camera acquisition preferences.**

## setSystemVolumeType

**Setting the system volume type (for mobile OS).**

@deprecated This API is not recommended after v9.5. Please use the  `startLocalAudio(quality)`  API in  `TRTCCloud`  instead, which param  `quality`  is used to decide audio quality.

## TXSystemVolumeType(Deprecated)

**System volume type.**

|Enum|Value|DESC|
|---------|---------|---------|
|TXSystemVolumeTypeAuto|Not Defined|Auto|
|TXSystemVolumeTypeMedia|Not Defined|Media volume|
|TXSystemVolumeTypeVOIP|Not Defined|Call volume|

## TXAudioRoute

**Audio route (the route via which audio is played).**

Audio route is the route (speaker or receiver) via which audio is played. It applies only to mobile devices such as mobile phones.

A mobile phone has two speakers: one at the top (receiver) and the other the bottom.
-  If the audio route is set to the receiver, the volume is relatively low, and audio can be heard only when the phone is put near the ear. This mode has a high level of privacy and is suitable for answering calls.

-  If the audio route is set to the speaker, the volume is relatively high, and there is no need to put the phone near the ear. This mode enables the "hands-free" feature.

|Enum|Value|DESC|
|---------|---------|---------|
|TXAudioRouteSpeakerphone|Not Defined|Speakerphone: the speaker at the bottom is used for playback (hands-free). With relatively high volume, it is used to play music out loud.|
|TXAudioRouteEarpiece|Not Defined|Earpiece: the receiver at the top is used for playback. With relatively low volume, it is suitable for call scenarios that require privacy.|

## TXCameraCaptureMode

**Camera acquisition preferences.**

This enum is used to set camera acquisition parameters.
| Enum | Value | DESC |
| --- | --- | --- |
| TXCameraResolutionStrategyAuto | Not Defined | Auto adjustment of camera capture parameters.<br>SDK selects the appropriate camera output parameters according to the actual acquisition device performance and network situation, and maintains a balance between device performance and video preview quality. |
| TXCameraResolutionStrategyPerformance | Not Defined | Give priority to equipment performance.<br>SDK selects the closest camera output parameters according to the user's encoder resolution and frame rate, so as to ensure the performance of the device. |
| TXCameraResolutionStrategyHighQuality | Not Defined | Give priority to the quality of video preview.<br>SDK selects higher camera output parameters to improve the quality of preview video. In this case, it will consume more CPU and memory to do video preprocessing. |
| TXCameraCaptureManual | Not Defined | Allows the user to set the width and height of the video captured by the local camera. |

## TXCameraCaptureParam

**Camera acquisition parameters.**

This setting determines the quality of the local preview image.

|EnumType|DESC|
|---------|---------|
|height|Field description:  height of acquired image|
|mode|Field description: camera acquisition preferences,please see TXCameraCaptureMode|
|width|Field description: width of acquired image|

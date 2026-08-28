Copyright (c) 2021 Tencent. All rights reserved.

Module: audio/video device management module

Description: manages audio/video devices such as camera, mic, and speaker.

## ITXDeviceManager

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
|getDevicesList|Getting the device list (for desktop OS).|
|setCurrentDevice|Setting the device to use (for desktop OS).|
|getCurrentDevice|Getting the device currently in use (for desktop OS).|
|setCurrentDeviceVolume|Setting the volume of the current device (for desktop OS).|
|getCurrentDeviceVolume|Getting the volume of the current device (for desktop OS).|
|setCurrentDeviceMute|Muting the current device (for desktop OS).|
|getCurrentDeviceMute|Querying whether the current device is muted (for desktop OS).|
|enableFollowingDefaultAudioDevice|Set the audio device used by SDK to follow the system default device (for desktop OS).|
|startCameraDeviceTest|Starting camera testing (for desktop OS).|
|stopCameraDeviceTest|Ending camera testing (for desktop OS).|
|startMicDeviceTest|Starting mic testing (for desktop OS).|
|startMicDeviceTest|Starting mic testing (for desktop OS).|
|stopMicDeviceTest|Ending mic testing (for desktop OS).|
|startSpeakerDeviceTest|Starting speaker testing (for desktop OS).|
|stopSpeakerDeviceTest|Ending speaker testing (for desktop OS).|
|startCameraDeviceTest|Starting camera testing (for desktop OS).|
|setApplicationPlayVolume|Setting the volume of the current process in the volume mixer (for Windows).|
|getApplicationPlayVolume|Getting the volume of the current process in the volume mixer (for Windows).|
|setApplicationMuteState|Muting the current process in the volume mixer (for Windows).|
|getApplicationMuteState|Querying whether the current process is muted in the volume mixer (for Windows).|
|setCameraCapturerParam|Set camera acquisition preferences.|
|setDeviceObserver|set onDeviceChanged callback.|
|setSystemVolumeType|Setting the system volume type (for mobile OS).|

## StructType

|FuncList|DESC|
|---------|---------|
|TXCameraCaptureParam|Camera acquisition parameters.|
|ITXDeviceInfo|Audio/Video device information (for desktop OS).|
|ITXDeviceCollection|Device information list (for desktop OS).|

## EnumType

|EnumType|DESC|
|---------|---------|
|TXSystemVolumeType|System volume type.|
|TXAudioRoute|Audio route (the route via which audio is played).|
|TXMediaDeviceType|Device type (for desktop OS).|
|TXMediaDeviceState|Device operation.|
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

## getDevicesList

**Getting the device list (for desktop OS).**

|Param|DESC|
|---------|---------|
|type|Device type. Set it to the type of device you want to get. For details, please see the definition of TXMediaDeviceType.|

> **Note**
> -  To ensure that the SDK can manage the lifecycle of the  `ITXDeviceCollection`  object, after using this API, please call the  `release`  method to release the resources.
> -  Do not use  `delete`  to release the Collection object returned as deleting the ITXDeviceCollection* pointer will cause crash.
> -  The valid values of  `type`  are  `TXMediaDeviceTypeMic` ,  `TXMediaDeviceTypeSpeaker` , and  `TXMediaDeviceTypeCamera` .
> -  This API can be used only on macOS and Windows.

## setCurrentDevice

**Setting the device to use (for desktop OS).**

|Param|DESC|
|---------|---------|
|deviceId|Device ID. You can get the ID of a device using the getDevicesList API.|
|type|Device type. For details, please see the definition of  `TXMediaDeviceType` .|
**Return Desc:**

0: operation successful; negative number: operation failed.

## getCurrentDevice

**Getting the device currently in use (for desktop OS).**

## setCurrentDeviceVolume

**Setting the volume of the current device (for desktop OS).**

This API is used to set the capturing volume of the mic or playback volume of the speaker, but not the volume of the camera.

|Param|DESC|
|---------|---------|
|volume|Volume. Value range: [0, 100]; default: 100|

## getCurrentDeviceVolume

**Getting the volume of the current device (for desktop OS).**

This API is used to get the capturing volume of the mic or playback volume of the speaker, but not the volume of the camera.

## setCurrentDeviceMute

**Muting the current device (for desktop OS).**

This API is used to mute the mic or speaker, but not the camera.

## getCurrentDeviceMute

**Querying whether the current device is muted (for desktop OS).**

This API is used to query whether the mic or speaker is muted. Camera muting is not supported.

## enableFollowingDefaultAudioDevice

**Set the audio device used by SDK to follow the system default device (for desktop OS).**

This API is used to set the microphone and speaker types. Camera following the system default device is not supported.
| Param | DESC |
| --- | --- |
| enable | Whether to follow the system default audio device.<br>-  true: following. When the default audio device of the system is changed or new audio device is plugged in, the SDK immediately switches the audio device.<br>-  false：not following. When the default audio device of the system is changed or new audio device is plugged in, the SDK doesn't switch the audio device. |
| type | Device type. For details, please see the definition of  <code>TXMediaDeviceType</code> . |

## startCameraDeviceTest

**Starting camera testing (for desktop OS).**

> **Note**
> You can use the setCurrentDevice API to switch between cameras during testing.
>

## stopCameraDeviceTest

**Ending camera testing (for desktop OS).**

## startMicDeviceTest

**Starting mic testing (for desktop OS).**

This API is used to test whether the mic functions properly. The mic volume detected (value range: [0, 100]) is returned via a callback.

|Param|DESC|
|---------|---------|
|interval|Interval of volume callbacks, in milliseconds.|

> **Note**
> When this interface is called, the sound recorded by the microphone will be played back to the speakers by default.
>

## startMicDeviceTest

**Starting mic testing (for desktop OS).**

This API is used to test whether the mic functions properly. The mic volume detected (value range: [0, 100]) is returned via a callback.

|Param|DESC|
|---------|---------|
|interval|Interval of volume callbacks, in milliseconds.|
|playback|Whether to play back the microphone sound. The user will hear his own sound when testing the microphone if  `playback`  is true.|

## stopMicDeviceTest

**Ending mic testing (for desktop OS).**

## startSpeakerDeviceTest

**Starting speaker testing (for desktop OS).**

This API is used to test whether the audio playback device functions properly by playing a specified audio file. If users can hear audio during testing, the device functions properly.

|Param|DESC|
|---------|---------|
|filePath|Path of the audio file|

## stopSpeakerDeviceTest

**Ending speaker testing (for desktop OS).**

## startCameraDeviceTest

**Starting camera testing (for desktop OS).**

This API supports custom rendering, meaning that you can use the callback API  `ITRTCVideoRenderCallback`  to get the images captured by the camera for custom rendering.

## setApplicationPlayVolume

**Setting the volume of the current process in the volume mixer (for Windows).**

## getApplicationPlayVolume

**Getting the volume of the current process in the volume mixer (for Windows).**

## setApplicationMuteState

**Muting the current process in the volume mixer (for Windows).**

## getApplicationMuteState

**Querying whether the current process is muted in the volume mixer (for Windows).**

## setCameraCapturerParam

**Set camera acquisition preferences.**

## setDeviceObserver

**set onDeviceChanged callback.**

## setSystemVolumeType

**Setting the system volume type (for mobile OS).**

@deprecated This API is not recommended after v9.5. Please use the  `startLocalAudio(quality)`  API in  `TRTCCloud`  instead, which param  `quality`  is used to decide audio quality.

## TXSystemVolumeType(Deprecated)

**System volume type.**

|Enum|Value|DESC|
|---------|---------|---------|
|TXSystemVolumeTypeAuto|0|Auto|
|TXSystemVolumeTypeMedia|1|Media volume|
|TXSystemVolumeTypeVOIP|2|Call volume|

## TXAudioRoute

**Audio route (the route via which audio is played).**

Audio route is the route (speaker or receiver) via which audio is played. It applies only to mobile devices such as mobile phones.

A mobile phone has two speakers: one at the top (receiver) and the other the bottom.
-  If the audio route is set to the receiver, the volume is relatively low, and audio can be heard only when the phone is put near the ear. This mode has a high level of privacy and is suitable for answering calls.

-  If the audio route is set to the speaker, the volume is relatively high, and there is no need to put the phone near the ear. This mode enables the "hands-free" feature.

|Enum|Value|DESC|
|---------|---------|---------|
|TXAudioRouteSpeakerphone|0|Speakerphone: the speaker at the bottom is used for playback (hands-free). With relatively high volume, it is used to play music out loud.|
|TXAudioRouteEarpiece|1|Earpiece: the receiver at the top is used for playback. With relatively low volume, it is suitable for call scenarios that require privacy.|

## TXMediaDeviceType

**Device type (for desktop OS).**

This enumerated type defines three types of audio/video devices, namely camera, mic and speaker, so that you can use the same device management API to manage three types of devices.

|Enum|Value|DESC|
|---------|---------|---------|
|TXMediaDeviceTypeUnknown|-1|undefined device type|
|TXMediaDeviceTypeMic|0|microphone|
|TXMediaDeviceTypeSpeaker|1|speaker or earpiece|
|TXMediaDeviceTypeCamera|2|camera|

## TXMediaDeviceState

**Device operation.**

This enumerated value is used to notify the status change of the local device onDeviceChanged.

|Enum|Value|DESC|
|---------|---------|---------|
|TXMediaDeviceStateAdd|0|The device has been plugged in|
|TXMediaDeviceStateRemove|1|The device has been removed|
|TXMediaDeviceStateActive|2|The device has been enabled|
|TXMediaDefaultDeviceChanged|3|system default device changed|

## TXCameraCaptureMode

**Camera acquisition preferences.**

This enum is used to set camera acquisition parameters.
| Enum | Value | DESC |
| --- | --- | --- |
| TXCameraResolutionStrategyAuto | 0 | Auto adjustment of camera capture parameters.<br>SDK selects the appropriate camera output parameters according to the actual acquisition device performance and network situation, and maintains a balance between device performance and video preview quality. |
| TXCameraResolutionStrategyPerformance | 1 | Give priority to equipment performance.<br>SDK selects the closest camera output parameters according to the user's encoder resolution and frame rate, so as to ensure the performance of the device. |
| TXCameraResolutionStrategyHighQuality | 2 | Give priority to the quality of video preview.<br>SDK selects higher camera output parameters to improve the quality of preview video. In this case, it will consume more CPU and memory to do video preprocessing. |
| TXCameraCaptureManual | 3 | Allows the user to set the width and height of the video captured by the local camera. |

## TXCameraCaptureParam

**Camera acquisition parameters.**

This setting determines the quality of the local preview image.

|EnumType|DESC|
|---------|---------|
|height|Field description:  height of acquired image|
|mode|Field description: camera acquisition preferences,please see TXCameraCaptureMode|
|width|Field description: width of acquired image|

## TXMediaDeviceInfo

**Audio/Video device information (for desktop OS).**

This structure describes key information (such as device ID and device name) of an audio/video device, so that users can choose on the UI the device to use.

|EnumType|DESC|
|---------|---------|
|getDeviceName()|device name (UTF-8)|
|getDevicePID()|device id (UTF-8)|

## ITXDeviceCollection

**Device information list (for desktop OS).**

This structure functions as std::vector<ITXDeviceInfo> does. It solves the binary compatibility issue between different versions of STL containers.
| EnumType | DESC |
| --- | --- |
| getCount() | Size of this list. return Size of this list. |
| index) | device properties (json format)<br><strong>Note</strong><br>-  examples: {"SupportedResolution":[{"width":640,"height":480},{"width":320,"height":240}]}<br>param index value in [0,getCount),return device properties formatted by json |
| release() | release function, don't use delete!!! |

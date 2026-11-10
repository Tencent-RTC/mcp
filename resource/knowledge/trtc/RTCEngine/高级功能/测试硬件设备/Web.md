---
sync_node_id: '89644535139057664'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "测试硬件设备"
  - "Web"
product: "trtc"
---
## Overview

Because it is difficult for users to detect device problems during a call, we recommend checking the browser and testing devices such as cameras and mics before starting a video call.

## Browser Environment Check

Before enterRoom, we recommend you use the [TRTC.isSupported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.isSupported) API to check whether the SDK supports the current browser first, and if not, please recommend the user to use a supported browser, refer to [Supported browsers](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html).
``` javascript
TRTC.isSupported().then(checkResult => {
  // Not supported, guide the user to use a supported browser(Chrome 56+, Edge 80+, Firefox 56+, Safari 11+).
  if (!checkResult.result) {}
  // Not support to publish video
  if (!checkResult.detail.isH264EncodeSupported) {}
  // Not support to subscribe video
  if (!checkResult.detail.isH264DecodeSupported) {}
})
```

If the check result returned by [TRTC.isSupported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.isSupported) is false, this may be because:

1. The web page uses the http protocol. Browsers do not allow http protocol sites to capture cameras and microphones, you need to deploy your page using the https protocol.

2. The current browser does not support WebRTC, you need to guide the user to use the recommended browser, refer to [Supported browsers](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html).

3. Firefox browser needs to load H264 codec dynamically after installation, so the detection result will be false for a short period of time, please wait and try again or guide to use other browsers.

## Audio/Video Device Test

To ensure that users can have a good user experience with the TRTC SDK, we recommend you check the user's device and network conditions and provide troubleshooting suggestions before the user enters a TRTC room.

You can quickly integrate the device and network check features by referring to the following methods:
- [`rtc-detect` Library](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-23-advanced-support-detection.html#h2-4)

- [React Component for Device Check](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-23-advanced-support-detection.html#h2-5)

- [TRTC Capability Check Page](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-23-advanced-support-detection.html#h2-6)

## `rtc-detect` Library

You can use [rtc-detect](https://www.npmjs.com/package/rtc-detect) to check whether the current environment is supported by the TRTC SDK and view the details of the current environment.

### Installation
``` shell
npm install rtc-detect
```

### Usage
``` javascript
import RTCDetect from 'rtc-detect';
// Initialize the detection module
const detect = new RTCDetect();
// Get the detection result of the current environment
const result = await detect.getReportAsync();
// `result` contains the current environment system information, API support, codec support, and device information
console.log('result is: ' + result);
```

### API

#### (async) isTRTCSupported()

This API is used to check whether the current environment supports TRTC.
``` javascript
const detect = new RTCDetect();
const data = await detect.isTRTCSupported();

if (data.result) {
  console.log('current browser supports TRTC.')
} else {
  console.log(`current browser does not support TRTC, reason: ${data.reason}.`)
}
```

#### getSystem()

This API is used to get the current system environment parameters.

|Item|Type|Description|
|---------|---------|---------|
|UA|string|The browser user-agent.|
|OS|string|The OS of the current device.|
|browser|object|The current browser information in the format of `{ name, version }`.|
|displayResolution|object|The current resolution in the format of `{ width, height }`.|
|getHardwareConcurrency|number|The number of CPU cores of the current device.|

``` javascript
const detect = new RTCDetect();
const result = detect.getSystem();
```

#### getAPISupported()

This API is used to get the API support of the current environment.

|Item|Type|Description|
|---------|---------|---------|
|isUserMediaSupported|boolean|Whether the user media data stream can be obtained|
|isWebRTCSupported|boolean|Whether WebRTC is supported|
|isWebSocketSupported|boolean|Whether WebSocket is supported|
|isWebAudioSupported|boolean|Whether WebAudio is supported|
|isScreenCaptureAPISupported|boolean|Whether the screen stream can be obtained|
|isCanvasCapturingSupported|boolean|Whether the data stream can be obtained from the canvas|
|isVideoCapturingSupported|boolean|Whether the data stream can be obtained from the video|
|isRTPSenderReplaceTracksSupported|boolean|Whether renegotiation with `peerConnection` can be skipped when `track` is replaced|
|isApplyConstraintsSupported|boolean|Whether the camera resolution can be changed without calling `getUserMedia` again|

``` javascript
const detect = new RTCDetect();
const result = detect.getAPISupported();
```

#### (async) getDevicesAsync()

This API is used to get the available devices in the current environment.

|Item|Type|Description|
|---------|---------|---------|
|hasWebCamPermissions|boolean|Whether the user camera data can be obtained|
|hasMicrophonePermission|boolean|Whether the user mic data can be obtained|
|cameras|array|List of user cameras, including their resolutions, maximum width, maximum height, and maximum frame rate (for certain browsers only) supported for video streams|
|microphones|array|List of mics used by users|
|speakers|array|List of speakers used by users|

**CameraItem**

|Item|Type|Description|
|---------|---------|---------|
|deviceId|string|The device ID, which is usually unique and can be used to identify devices.|
|groupId|string|The group ID. If two devices belong to the same physical device, they have the same group ID.|
|kind|string|The camera device type: 'videoinput'.|
|label|string|A tag which describes the device.|
|resolution|object|The maximum resolution width, height, and frame rate supported by the camera {maxWidth: 1280, maxHeight: 720, maxFrameRate: 30}.|

**DeviceItem**

|Item|Type|Description|
|---------|---------|---------|
|deviceId|string|The device ID, which is usually unique and can be used to identify devices.|
|groupId|string|The group ID. If two devices belong to the same physical device, they have the same group ID.|
|kind|string|The device type, such as 'audioinput' and 'audiooutput'.|
|label|string|A tag which describes the device.|

``` javascript
const detect = new RTCDetect();
const result = await detect.getDevicesAsync();
```

#### (async) getCodecAsync()

This API is used to get the codec support of the current environment.

|Item|Type|Description|
|---------|---------|---------|
|isH264EncodeSupported|boolean|Whether H.264 encoding is supported|
|isH264DecodeSupported|boolean|Whether H.264 decoding is supported|
|isVp8EncodeSupported|boolean|Whether VP8 encoding is supported|
|isVp8DecodeSupported|boolean|Whether VP8 decoding is supported|

If encoding is supported, audio/video can be published. If decoding is supported, audio/video can be pulled for playback.
``` javascript
const detect = new RTCDetect();
const result = await detect.getCodecAsync();
```

#### (async) getReportAsync()

This API is used to get the detection report of the current environment.

|Item|Type|Description|
|---------|---------|---------|
|system|object|Same as the returned value of `getSystem()`|
|APISupported|object|Same as the returned value of `getAPISupported()`|
|codecsSupported|object|Same as the returned value of `getCodecAsync()`|
|devices|object|Same as the returned value of `getDevicesAsync()`|

``` javascript
const detect = new RTCDetect();
const result = await detect.getReportAsync();
```

#### (async) isHardWareAccelerationEnabled()

This API is used to check whether hardware acceleration is enabled on the Chrome browser.

The implementation of this API depends on the native WebRTC API. We recommend you call this API for check after calling `isTRTCSupported`. The check can take up to 30 seconds as tested below:
> 
> 1. If hardware acceleration is enabled, this API will take about 2 seconds on Windows and 10 seconds on macOS.
> 2. If hardware acceleration is disabled, this API will take about 30 seconds on both Windows and macOS.

``` javascript
const detect = new RTCDetect();
const data = await detect.isTRTCSupported();

if (data.result) {
  const result = await detect.isHardWareAccelerationEnabled();
  console.log(`is hardware acceleration enabled: ${result}`);
} else {
  console.log(`current browser does not support TRTC, reason: ${data.reason}.`)
}
```

## React Component for Device Check

### Device check UI component features
1. Device connection and check logic processing

2. Network check logic processing

3. Optional network check tab

4. Support for Chinese and English

### Device check UI component links

For more information on how to use the component's npm package, see [rtc-device-detector-react](https://www.npmjs.com/package/rtc-device-detector-react).

For more information on how to debug the component's source code, see [github/rtc-device-detector](https://github.com/FTTC/rtc-device-detector).

For more information on how to import the component, see [WebRTC API Example](https://web.sdk.qcloud.com/trtc/webrtc/demo/api-sample/index.html).

### Device check UI component page

### Device and Network Detection Logic

#### (1) Device Connection

The purpose of device connection is to detect whether the user's machine has camera, microphone, and speaker devices, and whether it is in a networked state. If there are camera and microphone devices, try to obtain audio and video streams and guide the user to grant access to the camera and microphone.
- Determine whether the device has camera, microphone, and speaker devices.

   ``` javascript
   import TRTC from 'trtc-sdk-v5';
   
   const cameraList = await TRTC.getCameraList();
   const micList = await TRTC.getMicrophoneList();
   const speakerList = await TRTC.getSpeakerList();
   const hasCameraDevice = cameraList.length > 0;
   const hasMicrophoneDevice = micList.length > 0;
   const hasSpeakerDevice = speakerList.length > 0;
   ```
- Obtain access to the camera and microphone

   ``` javascript
   await trtc.startLocalVideo({ publish: false });
   await trtc.startLocalAudio({ publish: false });
   ```
- Check whether the device is connected to the network

   ``` javascript
   export function isOnline() {
     const url = 'https://web.sdk.qcloud.com/trtc/webrtc/assets/trtc-logo.png';
     return new Promise((resolve) => {
       try {
         const xhr = new XMLHttpRequest();
         xhr.onload = function () {
           resolve(true);
         };
         xhr.onerror = function () {
           resolve(false);
         };
         xhr.open('GET', url, true);
         xhr.send();
       } catch (err) {
         // console.log(err);
       }
     });
   }
   const isOnline = await isOnline();
   ```

#### （2） Camera Detection

​Detection principle: Open the camera and render the camera image on the page.
- Open the camera

   ``` javascript
   trtc.startLocalVideo({ view: 'camera-video', publish: false });
   ```
- Switch camera

   ``` javascript
   trtc.updateLocalVideo({
     option: { cameraId } 
   });
   ```
- [Device plug and unplug detection](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-25-advanced-device-change.html)

- Close the camera after the detection is complete

   ``` javascript
   trtc.stopLocalVideo();
   ```

#### 3) Microphone Detection

Detection principle: Open the microphone and obtain the microphone volume.
- Open the microphone

   ``` javascript
   trtc.startLocalAudio({ publish: false });
   ```
- Switch microphone

   ``` javascript
   trtc.updateLocalAudio({ option: { microphoneId }});
   ```
- [Device plug and unplug detection](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-25-advanced-device-change.html)

- Release microphone usage after detection is complete

   ``` javascript
   trtc.stopLocalAudio();
   ```

#### 4) Speaker Detection

Detection principle: Play an mp3 media file through the audio tag.
- Create an audio tag to remind the user to turn up the volume and play the mp3 to confirm whether the speaker device is working properly.

   ``` html
   <audio id="audio-player" src="xxxxx" controls></audio>
   ```
- Stop playing after detection is complete

   ``` javascript
   const audioPlayer = document.getElementById('audio-player');
   if (!audioPlayer.paused) {
       audioPlayer.pause();
   }
   audioPlayer.currentTime = 0;
   ```

#### 5) Network Detection

Reference: [Network Quality Detection Before Call](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-24-advanced-network-quality.html)

## TRTC Capability Detection Page

You can use the [TRTC Detection Page](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) where you are currently using the TRTC SDK to detect the current environment. You can also click the "Generate Report" button to get a report of the current environment for environment detection or troubleshooting.

## Browser Environment Check

Before calling the communication capabilities of the SDK, we recommend you use the `{@link TRTC.isSupported TRTC.isSupported}` API to check whether the SDK supports the current browser first, and if not, please recommend the user to use a supported browser(Chrome 56+, Edge 80+, Firefox 56+, Safari 11+).

```javascript
TRTC.isSupported().then(checkResult => {
  // Not supported, guide the user to use a supported browser(Chrome 56+, Edge 80+, Firefox 56+, Safari 11+).
  if (!checkResult.result) {}
  // Not support to publish video
  if (!checkResult.detail.isH264EncodeSupported) {}
  // Not support to subscribe video
  if (!checkResult.detail.isH264DecodeSupported) {}
})
```

⚠️ If the check result returned by `TRTC.isSupported` is `false`, this may be because:

1. The web page uses the http protocol. Browsers do not allow http protocol sites to capture cameras and microphones, you need to deploy your page using the https protocol.
2. The current browser does not support WebRTC, you need to guide the user to use the recommended browser {@tutorial 05-info-browser}.
3. Firefox browser needs to load H264 codec dynamically after installation, so the detection result will be false for a short period of time, please wait and try again or guide to use other browsers.

## Media Device Test

### Option 1: Use Device Detector Plugin (including default UI)

The device detector plugin is used to test the user's media device(camera, microphone, speaker) and network which is recommended to be used before the user enters the room. 

> - Support TRTC Web SDK version >= v5.8.0
> - The plugin includes a default UI. If the UI does not meet your product design requirements, you can refer to Option 2 for a custom UI implementation.

#### Usage

```javascript
import { DeviceDetector } from 'trtc-sdk-v5/plugins/device-detector';
const trtc = TRTC.create({ plugins: [DeviceDetector] });

// 1. Test Media Device Only
const result = await trtc.startPlugin('DeviceDetector');

// 2. Test Media Device & Network Quality
const options = { 
    networkDetect: { sdkAppId, userId, userSig }
}
const resultWithNetwork = await trtc.startPlugin('DeviceDetector', options);
```

#### API Description

##### trtc.startPlugin('DeviceDetector', options)

##### options

| Name            | Type   | Attributes | Description                                                  |
| --------------- | ------ | ---------- | ------------------------------------------------------------ |
| language       | 'auto' \| 'zh' \| 'en' | Optional        | Optional. Set the language of the UI, supporting Chinese and English. The default is 'auto', which means automatically judging based on the current browser language. 'zh' means using Chinese, 'en' means using English.|
| allowSkip       | boolean | Optional        | Optional. The default value is true, which will display the skip button. If false, the skip button will not be displayed, and the user must complete each step of the detection before proceeding to the next step.|
| cameraDetect    | object  | Optional        | Optional. Camera detection options, see cameraDetect options below|
| networkDetect   | object  | Optional        | Optional. Network detection options, see networkDetect options below|

###### options.mirror(optional)

Enable the mirror checkbox during camera detection

###### options.cameraDetect(optional)
| Name   | Type    | Attributes | Description                                                                                                                                    |
| ------ | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| mirror | boolean | Optional   | Optional. When true, the mirror image will be enabled during the camera detection phase, and a checkbox for the mirror image will be displayed |

###### options.networkDetect(optional)

| Name            | Type   | Attributes | Description                                                                                                                                                           |
| --------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sdkAppId        | number | required   | Your sdkAppId                                                                                                                                                         |
| userId          | string | required   | The userId for testing uplink network quality. It should be different from downlinkUserId.                                                                            |
| userSig         | string | required   | The [UserSig](https://trtc.io/document/35166) of the userId.                                                                                                          |
| downlinkUserId  | string | optional   | The userId for testing downlink network quality. It should be different from userId. Fill in downlinkUserId and downlinkUserSig will perform a downlink network test. |
| downlinkUserSig | string | optional   | The [UserSig](https://trtc.io/document/35166) of the downlinkUserId.                                                                                                  |
| roomId          | number | optional   | Optional. The default value is 8080. The value must be an integer of [1, 4294967294]                                                                                  |

##### trtc.stopPlugin('DeviceDetector')

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **camera**     | `object` | { isSuccess: boolean, device: { deviceId: string, groupId: string, kind: "videoinput", label: string }}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **microphone** | `object` | { isSuccess: boolean, device: { deviceId: string, groupId: string, kind: "audioinput", label: string }}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **speaker**    | `object` | { isSuccess: boolean, device: { deviceId: string, groupId: string, kind: "audiooutput", label: string }}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **network**    | `object` | { isSuccess: boolean, result: { quality: number , rtt: number }}<br />The quality is uplink network quality. When the downlinkUserId and downlinkUserSig passed, the quality is the worse one of the upstream and downstream network quality<br />**Network Quality Values**<br />0: The network quality is unknown, indicating that the current TRTC instance has not established a media connection<br />1:  The network quality is excellent<br />2:  The network quality is good<br />3:  The network quality is average<br />4:  The network quality is poor<br />5:  The network quality is extremely poor<br />6:  The network connection has been disconnected. |

#### Plugin Demo

<iframe allow="microphone; camera; display-capture;" height="700" style="width:100%" scrolling="no" title="Device Detector" src="https://codepen.io/TRTC/embed/eYwVVja?default-tab=" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/TRTC/pen/eYwVVja">
  Device Detector</a> by TRTC (<a href="https://codepen.io/TRTC">@TRTC</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Option 2: Implement Device Detection Based on SDK API (Custom UI)

If the default UI of the device detection plugin in Option 1 does not meet your requirements, you can choose Option 2 to customize the UI.

#### 1. Check Device Permission

Since v5.13.0+, SDK provides the `TRTC.getPermissions` interface, which is used to check, request, and listen to device permissions.

```javascript
const { camera, microphone } = await TRTC.getPermissions({
  request: true, // If true, the interface may temporarily open the camera to obtain the camera permission, and then the SDK will automatically release the capture.
  types: ['camera', 'microphone'] // The types of permission to request.
});
console.log(camera, microphone); // 'granted' | 'denied' | 'prompt' | null. null means the permission is not supported query.

// Listen to device permission changes
trtc.on(TRTC.EVENT.PERMISSION_STATE_CHANGE, event => {
  console.log(event.camera, event.microphone);
});
// Release the listener
trtc.off(TRTC.EVENT.PERMISSION_STATE_CHANGE);
```

#### 2. Device Connection

The device connection checks if the user's device has a camera, microphone, and speaker. It also verifies the network connection. If the camera and microphone are present, the system will attempt to access the audio/video streams and prompt the user to grant permission for camera and microphone access.

+ Check whether the device has a camera, microphone device

  ```javascript
  import TRTC from 'trtc-sdk-v5';
  
  const cameraList = await TRTC.getCameraList();
  const micList = await TRTC.getMicrophoneList();
  const hasCameraDevice = cameraList.some(camera => camera.deviceId !== '');
  const hasMicrophoneDevice = micList.some(mic => mic.deviceId !== '');
  // Mobile devices do not support getting speaker devices, so mobile devices can skip getting speaker devices
  const speakerList = await TRTC.getSpeakerList();
  const hasSpeakerDevice = speakerList.some(speaker => speaker.deviceId !== '');
  ```

#### 3. Camera Detection

Detection principle: Turn on the camera and render the camera image on the page. You can provide two buttons on the page to allow the user to confirm whether they can see the camera image.

+ Turn on the camera

  ```javascript
  trtc.startLocalVideo({ view: 'camera-video', publish: false });
  ```

+ Switch the camera

  ```javascript
  trtc.updateLocalVideo({ option: { cameraId } });
  ```

+ Close the camera after detection is completed

  ```javascript
  trtc.stopLocalVideo();
  ```

#### 4. Microphone Detection

Detection principle: Open the microphone and obtain the microphone volume. Listen to the microphone volume event and render the real-time volume to the page, guide the user to speak, and confirm whether they can see the volume bar change.

+ Turn on the microphone

  ```javascript
  trtc.on(TRTC.EVENT.AUDIO_VOLUME, event => {
    event.result.forEach(({ userId, volume }) => {
        const isMe = userId === '';
        if (isMe) {
            console.log(`my volume: ${volume}`);
            // Render the microphone volume to your page.
        }
    })
  });
  // 开启音量回调，并设置每 200ms 触发一次事件
  trtc.enableAudioVolumeEvaluation(200);
  trtc.startLocalAudio({ publish: false });
  ```

+ Switch the microphone

  ```javascript
  trtc.updateLocalAudio({ option: { microphoneId }});
  ```

+ Release the microphone usage after detection is completed

  ```javascript
  trtc.stopLocalAudio();
  ```

#### 5. Speaker Detection

Detection principle: Play an mp3 media file through an audio tag

+ Create an audio tag, remind the user to turn up the playback volume, play the mp3 to confirm whether the speaker device is normal.

  ```html
  <audio id="audio-player" src="xxxxx" controls></audio>
  ```

+ Stop playback after detection is completed

  ```javascript
  const audioPlayer = document.getElementById('audio-player');
  if (!audioPlayer.paused) {
      audioPlayer.pause();
  }
  audioPlayer.currentTime = 0;
  ```

#### 6. Network Detection

Reference: [Network Quality Detection before enterRoom](tutorial-24-advanced-network-quality.md)

## TRTC Capability Detection Page

You can use the [TRTC Detection Page](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) where you are currently using the TRTC SDK to detect the current environment. You can also click the "Generate Report" button to get a report of the current environment for environment detection or troubleshooting.

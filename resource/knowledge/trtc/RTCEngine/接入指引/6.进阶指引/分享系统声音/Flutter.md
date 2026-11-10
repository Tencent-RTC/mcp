---
sync_node_id: '134687913493200896'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "分享系统声音"
  - "Flutter"
product: "trtc"
---
This document primarily delineates the process of sharing system sounds. At present, TRTC defaults not to collect the audio of the local application.

## Call Guidelines

【Android】

This document primarily delineates the process of sharing system sounds. At present, TRTC defaults not to collect the audio of the local application.

> **Note:**
> Only Android 10.0 or higher supports sharing system audio.
> 

### Initiate system sound sharing

#### Step 1: Initiate Screen Sharing

Follow the steps in Enable screen sharing - Based on Android platform to turn on screen sharing.

#### Step 2: Initiate Share System Audio

By invoking the `TRTCCloud`'s [startSystemAudioLoopback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/en/trtc_cloud/TRTCCloud/startSystemAudioLoopback.html) interface, the collected system audio will be automatically mixed into the upstream.

#### Step 3: Terminate Share System Audio

Invoke the `TRTCCloud`'s [stopSystemAudioLoopback](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/en/trtc_cloud/TRTCCloud/stopSystemAudioLoopback.html) interface.

【iOS】

### Step 1: Enable the microphone

Within the App, invoke startLocalAudio to kickstart microphone collection, and it's suggested to utilize TRTCAudioQualityDefault for audio quality.

> **Note:**
> This action is indispensable; by initiating microphone collection, the App can preserve its functioning even when relegated to the background.
> 

### Step 2: Initiate screen sharing

Due to the restrictions of iOS, system sounds can only be collected during screen recording. Therefore, to implement this feature, the iOS screen sharing function must be connected first.

Follow the steps in Enable Screen Sharing - Based on iOS platform to start screen recording, and system sound will be automatically collected.

> **Note:**
> When starting screen recording, do not light up the microphone icon. Voice collection has already been started in the app.
> 
> 
> 

### Step 3: Midway open and close system sound

The system audio capture and screen recording are done concurrently, initiating automatically with the start of the recording and ceasing alongside the recording termination. It is not feasible to independently switch on or mute the system audio.

TRTCCloud proffers the [setSystemAudioLoopbackVolume](https://liteav.sdk.qcloud.com/doc/product/trtc/dart/api/en/trtc_cloud/TRTCCloud/setSystemAudioLoopbackVolume.html) method for system audio volume conditioning. When there is no desire to output the system audio, the volume can be set to 0.

This document guides you on how to use Atomicx components and the `useDeviceState` Hook to manage the state of audio/video devices (camera, microphone, speaker) in a meeting, as well as how to obtain local network quality information.

## Feature Overview
- **Device enumeration and switching:** Supports retrieving the list of available system devices in real time and switching between them seamlessly.

- **Fine-grained state control:** Provides the ability to turn devices on/off, mute capture, adjust volume, and monitor volume in real time.

- **Error diagnostics:** Provides real-time feedback on abnormal states such as hardware conflicts and missing system permissions.

- **Network quality monitoring:** Provides multi-dimensional network information including latency and packet loss rate.

## Prerequisites
- The user has completed login authentication via [useLoginState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-LoginState). For details, refer to the Integration Overview.

- If integrating within an `iframe`, you need to declare the permissions in the tag.

   ``` typescript
   <iframe allow="microphone; camera;"></iframe>
   ```

## Implementing Camera Management

You can use [useDeviceState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState) to control turning the local camera on/off, switching devices, and to listen for capture status and errors.

### Step 1: Turn the camera on/off

Control turning the camera on/off by calling the [openLocalCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#openLocalCamera) and [closeLocalCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#closeLocalCamera) methods.
``` typescript
import { useDeviceState, DeviceStatus } from 'tuikit-atomicx-vue3/room';
const { cameraStatus, openLocalCamera, closeLocalCamera } = useDeviceState();
const toggleCamera = async () => {
  if (cameraStatus.value === DeviceStatus.On) {
    await closeLocalCamera();
  } else {
    await openLocalCamera();
  }
};
```

### Step 2: Get/switch the camera device

#### Example of getting and switching the camera on desktop

You can use [cameraList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cameraList) to get all available camera devices, and use the [setCurrentCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setCurrentCamera) method to switch the currently used camera.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { cameraList, currentCamera, getCameraList, setCurrentCamera } = useDeviceState();

// Get the camera list
await getCameraList();

// Iterate and display available cameras
cameraList.value.forEach((camera) => {
  console.log(`Camera: ${camera.deviceName} (${camera.deviceId})`);
});

// Switch to the specified camera
const switchCamera = async (deviceId: string) => {
  try {
    // Switch the device (if the camera is already on, capture will automatically restart with the new device)
    await setCurrentCamera({ deviceId });
    console.log('Camera switched successfully');
  } catch (error) {
    console.error('Failed to switch camera:', error);
    // The original device will continue to be used if switching fails
  }
};

// Listen for changes to the current camera
watch(currentCamera, (camera) => {
  if (camera) {
    console.log('Currently used camera:', camera.deviceName);
  }
});
```

> When you call [setCurrentCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setCurrentCamera) to switch the device, if the camera is already on, Atomicx will automatically stop capturing from the current device and restart capturing with the new device, so the video stream switches seamlessly. If switching fails, the original device will continue to be used.
>

#### Example of switching the camera on mobile

On mobile, use [switchCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#switchCamera) to switch between the front and rear cameras.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { isFrontCamera, switchCamera } = useDeviceState();

// Determine whether the device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Switch between front and rear cameras (mobile only)
const toggleCamera = async () => {
  if (!isMobile) {
    console.warn('Switching between front and rear cameras is only supported on mobile');
    return;
  }

  // Switch to the opposite camera
  await switchCamera({ isFrontCamera: !isFrontCamera.value });
  console.log(`Switched to the ${isFrontCamera.value ? 'front' : 'rear'} camera`);
};
```

### Step 3: Handle camera capture errors

When an error occurs during camera capture, you can obtain the error information via the [cameraLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cameraLastError) property.

> Note:
>

> Common camera errors include `NoSystemPermission` (no system permission) and `OccupiedError` (device is occupied). You should display a clear error message to the user based on this property.
>

``` typescript
import { useDeviceState, DeviceError } from 'tuikit-atomicx-vue3/room';
const { cameraLastError } = useDeviceState();

// Listen for camera errors
watch(cameraLastError, (error) => {
  switch (error) {
    case DeviceError.NoSystemPermission:
      console.error('Camera permission denied. Please enable camera permission in system settings');
      break;
    case DeviceError.NoDeviceDetected:
      console.error('No camera device detected');
      break;
    case DeviceError.OccupiedError:
      console.error('The camera is occupied by another application');
      break;
    case DeviceError.NotSupportCapture:
      console.error('The current browser does not support camera capture');
      break;
    default:
      break;
  }
});
```

## Implementing Microphone Management

You can use [useDeviceState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState) to control turning the local microphone on/off, muting, adjusting volume, and displaying real-time volume, and to listen for capture status and errors.

### Step 1: Turn the microphone on/off
``` typescript
import { useDeviceState, DeviceStatus } from 'tuikit-atomicx-vue3/room';
const { microphoneStatus, openLocalMicrophone, closeLocalMicrophone } = useDeviceState();
const toggleMicrophone = async () => {
  if (microphoneStatus.value === DeviceStatus.On) {
    await closeLocalMicrophone();
  } else {
    await openLocalMicrophone();
  }
};
```

### Step 2: Get/switch the microphone device

#### Example of getting/switching the microphone in a desktop browser

You can use [microphoneList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#microphoneList) to get all available microphone devices, and use the [setCurrentMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setCurrentMicrophone) method to switch the currently used microphone.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';

const {
  microphoneList,
  currentMicrophone,
  getMicrophoneList,
  setCurrentMicrophone
} = useDeviceState();

// Get the microphone list
await getMicrophoneList();

// Iterate and display available microphones
microphoneList.value.forEach((mic) => {
  console.log(`Microphone: ${mic.deviceName} (${mic.deviceId})`);
});

// Switch to the specified microphone
const switchMicrophone = async (deviceId: string) => {
  await setCurrentMicrophone({ deviceId });
};

// Listen for changes to the current microphone
watch(currentMicrophone, (mic) => {
  if (mic) {
    console.log('Currently used microphone:', mic.deviceName);
  }
});
```

### Step 3: Set the capture volume

You can use the [setCaptureVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setCaptureVolume) method to adjust the capture volume of the local microphone.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { captureVolume, setCaptureVolume } = useDeviceState();

// Set the capture volume to 50%
await setCaptureVolume(50);

// Listen for changes to the capture volume
watch(captureVolume, (volume) => {
  console.log('Current capture volume:', volume);
});
```

### Step 4: Display real-time volume

The [currentMicVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#currentMicVolume) property updates the local microphone's capture volume in real time, and can be used for the dynamic display of a volume bar.
``` typescript
<template>
  <div class="mic-volume">
    <label>Microphone volume</label>
    <div class="volume-bar-container">
      <div
        class="volume-bar"
        :style="{ width: `${currentMicVolume}%` }"
      />
    </div>
    <span>{{ currentMicVolume }}</span>
  </div>
</template>

<script setup lang="ts">
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { currentMicVolume } = useDeviceState();
</script>

<style scoped>
.volume-bar-container {
  width: 200px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.volume-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.1s ease;
}
</style>
```

### Step 5: Handle microphone capture errors

When an error occurs during microphone capture, you can obtain the error information via the [microphoneLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#microphoneLastError) data.
``` typescript
import { useDeviceState, DeviceError } from 'tuikit-atomicx-vue3/room';
const { microphoneLastError } = useDeviceState();

// Listen for microphone errors
watch(microphoneLastError, (error) => {
  switch (error) {
    case DeviceError.NoSystemPermission:
      console.error('Microphone permission denied. Please enable microphone permission in system settings');
      break;
    case DeviceError.NoDeviceDetected:
      console.error('No microphone device detected');
      break;
    case DeviceError.OccupiedError:
      console.error('The microphone is occupied by another application');
      break;
    case DeviceError.NotSupportCapture:
      console.error('The current browser does not support microphone capture');
      break;
    default:
      break;
  }
});
```

## Implementing Speaker Management

The speaker (playback device) mainly involves switching devices and setting the playback volume.

### Step 1: Get/switch the speaker device

You can use [speakerList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#speakerList) to get all available speaker devices, and use the [setCurrentSpeaker](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setCurrentSpeaker) method to switch the currently used speaker.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const {
  speakerList,
  currentSpeaker,
  getSpeakerList,
  setCurrentSpeaker
} = useDeviceState();

// Get the speaker list
await getSpeakerList();

// Iterate and display available speakers
speakerList.value.forEach((speaker) => {
  console.log(`Speaker: ${speaker.deviceName} (${speaker.deviceId})`);
});

// Switch to the specified speaker
const switchSpeaker = async (deviceId: string) => {
  await setCurrentSpeaker({ deviceId });
};

// Listen for changes to the current speaker
watch(currentSpeaker, (speaker) => {
  if (speaker) {
    console.log('Currently used speaker:', speaker.deviceName);
  }
});
```

### Step 2: Set the playback volume

You can use the [setOutputVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setOutputVolume) method to adjust the playback volume of the speaker.
``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { outputVolume, setOutputVolume } = useDeviceState();

// Set the playback volume to 60%
await setOutputVolume(60);

// Listen for changes to the playback volume
watch(outputVolume, (volume) => {
  console.log('Current playback volume:', volume);
});
```

## Implementing Network Quality Monitoring

Using the [networkInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#networkInfo) data from [useDeviceState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState), you can monitor the local user's network quality in real time.

> Valid data can only be obtained from [networkInfo](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#networkInfo) when the local user has joined a room via [joinRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#joinRoom) and turned on the microphone or camera.
>

``` typescript
<template>
  <div class="network-indicator" @click="showDetails = !showDetails">
    <TUIIcon v-if="networkIcon" :icon="networkIcon" />
    <span class="network-text">{{ networkText }}</span>
    <div v-if="showDetails" class="network-details">
      <div>Latency: {{ networkInfo?.delay }}ms</div>
      <div>Upstream loss: {{ networkInfo?.upLoss }}%</div>
      <div>Downstream loss: {{ networkInfo?.downLoss }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IconNetworkStability,
  IconNetworkFluctuation,
  IconNetworkLag,
  IconNetworkDisconnected,
  IconArrowStrokeUp,
} from '@tencentcloud/uikit-base-component-vue3';
import { useDeviceState, NetworkQuality } from 'tuikit-atomicx-vue3/room';

const { networkInfo } = useDeviceState();
const showDetails = ref(false);

// Network quality icon
const networkIcon = computed(() => {
  if (!networkInfo.value) return '';
  switch (networkInfo.value.quality) {
    case NetworkQuality.Excellent:
    case NetworkQuality.Good:
      return IconNetworkStability;
    case NetworkQuality.Poor:
      return IconNetworkFluctuation;
    case NetworkQuality.Bad:
    case NetworkQuality.VeryBad:
      return IconNetworkLag;
    case NetworkQuality.Down:
      return IconNetworkDisconnected;
    default:
      return '';
  }
});

// Network quality text
const networkText = computed(() => {
  if (!networkInfo.value) return 'Unknown';
  switch (networkInfo.value.quality) {
    case NetworkQuality.Excellent:
      return 'Excellent';
    case NetworkQuality.Good:
      return 'Good';
    case NetworkQuality.Poor:
      return 'Fair';
    case NetworkQuality.Bad:
      return 'Poor';
    case NetworkQuality.VeryBad:
      return 'Very poor';
    case NetworkQuality.Down:
      return 'Disconnected';
    default:
      return 'Unknown';
  }
});
</script>

<style scoped>

.network-indicator {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.network-details {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 12px;
  white-space: nowrap;
  z-index: 2;
}
</style>
```

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useDeviceState**|Contains the audio/video device state, the audio/video device lists, and operation interfaces.|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState)|

## FAQ

### If a user's computer has no microphone or speaker device, can they still enter an audio/video room?

Yes, they can enter the room. Even without a microphone, speaker, or camera, a user can still successfully call the `joinRoom` interface to enter an audio/video room. However, in this state, the user will encounter the following interaction issues.

**Feature limitations:**
- **Unable to start media capture:** Because the system's underlying layer cannot drive the relevant hardware, calling the [openLocalMicrophone](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#openLocalMicrophone) or [openLocalCamera](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#openLocalCamera) interface will trigger an asynchronous error. In this case, the [microphoneLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#microphoneLastError) or [cameraLastError](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cameraLastError) property will return `DeviceError.NoDeviceDetected` (no device detected).

- **Capture side limited:** The local device cannot capture and transmit audio (requires a microphone) or video (requires a camera).

- **Playback side limited:** Because the speaker device is missing, the user will not be able to hear the audio of other participants in the room.

   **Features that can still be used:**

   View-only mode: The user can still watch video streams or screen sharing shared by remote participants.

### How do I implement device hot-plug detection?

Atomicx has a built-in device hot-plug detection feature. When a media device is plugged in or unplugged, the device list and current device data are updated automatically.

This document guides you through providing device preview and testing capabilities before a user joins a room. Using the pre-join testing APIs provided by Atomicx, you can guide users to check and adjust the status of their audio and video devices, ensuring they enter a multi-party audio/video room in the best possible state.

## Feature Overview

Device preview is a crucial step in ensuring the smooth operation of an audio/video room. Atomicx provides a dedicated set of testing APIs specifically for the pre-join scenario. Its core capabilities include:
- **Video preview**: Start the camera without publishing a stream to verify image clarity and lighting.

- **Microphone detection**: Confirm that microphone capture is working properly through real-time volume feedback.

- **Speaker calibration**: Confirm the output device and its volume settings by playing a test sound.

## Prerequisites
- The user has completed login authentication via [useLoginState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-LoginState). See the Integration Overview for details.

## Implementing Device Detection

### Step 1: Camera Test

Use the [startCameraTest](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#startCameraTest) method to start the camera test. This method is used for local preview only and does not generate any network traffic.

**Code example:**
``` typescript
<template>
  <div class="preview-container">
    <!-- Camera preview area -->
    <div id="camera-preview" class="camera-preview">
      <!-- Loading state -->
      <div v-if="isCameraTestLoading" class="loading-overlay">
        <div class="loading-spinner" />
        <span>Starting camera...</span>
      </div>
    </div>

    <!-- Camera selection -->
    <div class="camera-selector">
      <label>Select camera</label>
      <select
        :value="currentCamera?.deviceId"
        @change="handleCameraChange"
        :disabled="isCameraTestLoading"
      >
        <option
          v-for="camera in cameraList"
          :key="camera.deviceId"
          :value="camera.deviceId"
        >
          {{ camera.deviceName }}
        </option>
      </select>
    </div>

    <!-- Control buttons -->
    <div class="control-buttons">
      <button @click="getCameraList">Get camera list</button>
      <button
        @click="toggleCameraTest"
        :disabled="isCameraTestLoading"
      >
        {{ isCameraTesting ? 'Stop preview' : 'Start preview' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { IconWarning } from '@tencentcloud/uikit-base-component-vue3';
import {
  useLoginState,
  useDeviceState,
  DeviceStatus,
  DeviceError,
} from 'tuikit-atomicx-vue3/room';

const {
  isCameraTesting,
  isCameraTestLoading,
  cameraList,
  currentCamera,
  startCameraTest,
  stopCameraTest,
  getCameraList,
  setCurrentCamera
} = useDeviceState();

onUnmounted(() => {
  if (isCameraTesting.value) {
    stopCameraTest();
  }
});

const toggleCameraTest = async () => {
  if (isCameraTesting.value) {
    await stopCameraTest();
  } else {
    const previewElement = document.getElementById('camera-preview');
    if (previewElement) {
      await startCameraTest({ view: previewElement });
    }
  }
};

const handleCameraChange = async (event: Event) => {
  const deviceId = (event.target as HTMLSelectElement).value;
  try {
    await setCurrentCamera({ deviceId });
  } catch (error) {
    console.error('Failed to switch camera:', error);
  }
};
</script>

<style scoped>
.preview-container {  position: relative;  width: 100%;  max-width: 640px;  margin: 0 auto;}.camera-preview {  width: 100%;  position: relative;  aspect-ratio: 16 / 9;  background-color: #000;  border-radius: 8px;  overflow: hidden;}.loading-overlay {  position: absolute;  inset: 0;  display: flex;  flex-direction: column;  align-items: center;  justify-content: center;  gap: 12px;  background-color: rgba(0, 0, 0, 0.7);  color: white;  border-radius: 8px;}.loading-spinner {  width: 40px;  height: 40px;  border: 4px solid rgba(255, 255, 255, 0.3);  border-top-color: white;  border-radius: 50%;  animation: spin 0.8s linear infinite;}@keyframes spin {  to { transform: rotate(360deg); }}.error-message {  display: flex;  align-items: center;  gap: 8px;  padding: 12px;  margin-top: 12px;  background-color: #ffebee;  color: #c62828;  border-radius: 4px;  font-size: 14px;}.camera-selector {  margin-top: 16px;  display: flex;  align-items: center;  gap: 12px;}.camera-selector label {  font-weight: 500;  min-width: 80px;}.camera-selector select {  flex: 1;  padding: 8px 12px;  border: 1px solid #e0e0e0;  border-radius: 4px;  font-size: 14px;}.control-buttons {  margin-top: 16px;  display: flex;  gap: 12px;}.control-buttons button {  flex: 1;  padding: 12px 24px;  background-color: #1976d2;  color: white;  border: none;  border-radius: 4px;  font-size: 14px;  font-weight: 500;  cursor: pointer;  transition: background-color 0.3s;}.control-buttons button:hover:not(:disabled) {  background-color: #1565c0;}.control-buttons button:disabled {  background-color: #bdbdbd;  cursor: not-allowed;}
</style>
```

### Step 2: Microphone Test

Use [startMicrophoneTest](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#startMicrophoneTest) to start the microphone test, and use [testingMicVolume](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#testingMicVolume) to drive the real-time fluctuation of the UI volume bar.

**Code example:**
``` typescript
<template>
  <div class="microphone-test">
    <!-- Volume display -->
    <div class="volume-display">
      <div class="volume-label">Microphone volume</div>
      <div class="volume-bar-container">
        <div
          class="volume-bar"
          :style="{ width: `${testingMicVolume}%` }"
          :class="volumeClass"
        />
      </div>
      <div class="volume-value">{{ testingMicVolume }}</div>
    </div>

    <!-- Microphone selection -->
    <div class="microphone-selector">
      <label>Select microphone</label>
      <select
        :value="currentMicrophone?.deviceId"
        @change="handleMicrophoneChange"
        :disabled="isMicrophoneTesting"
      >
        <option
          v-for="mic in microphoneList"
          :key="mic.deviceId"
          :value="mic.deviceId"
        >
          {{ mic.deviceName }}
        </option>
      </select>
    </div>

    <!-- Control buttons -->
    <div class="control-buttons">
      <button
        @click="getMicrophoneList"
      >
        Get devices
      </button>
      <button
        @click="toggleMicrophoneTest"
      >
        {{ isMicrophoneTesting ? 'Stop test' : 'Start test' }}
      </button>
    </div>

    <!-- Test tip -->
    <div v-if="isMicrophoneTesting" class="test-tip">
      <span>Please speak into the microphone and observe the volume change</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  useDeviceState,
  DeviceError,
} from 'tuikit-atomicx-vue3/room';

const {
  isMicrophoneTesting,
  testingMicVolume,
  microphoneList,
  currentMicrophone,
  startMicrophoneTest,
  stopMicrophoneTest,
  getMicrophoneList,
  setCurrentMicrophone
} = useDeviceState();

// Volume bar style class
const volumeClass = computed(() => {
  const volume = testingMicVolume.value;
  if (volume === 0) return 'volume-zero';
  if (volume < 30) return 'volume-low';
  if (volume < 70) return 'volume-medium';
  return 'volume-high';
});

// Cleanup: stop the test
onUnmounted(() => {
  if (isMicrophoneTesting.value) {
    stopMicrophoneTest();
  }
});

// Toggle the microphone test
const toggleMicrophoneTest = async () => {
  if (isMicrophoneTesting.value) {
    await stopMicrophoneTest();
  } else {
    try {
      await startMicrophoneTest({ interval: 200 });
    } catch (error) {
      console.error('Failed to start microphone test:', error);
    }
  }
};

// Switch the microphone device
const handleMicrophoneChange = async (event: Event) => {
  const deviceId = (event.target as HTMLSelectElement).value;
  try {
    await setCurrentMicrophone({ deviceId });
  } catch (error) {
    console.error('Failed to switch microphone:', error);
  }
};
</script>

<style scoped>
.microphone-test {  width: 100%;  max-width: 640px;  margin: 0 auto;}.volume-display {  padding: 24px;  background-color: #f5f5f5;  border-radius: 8px;  margin-bottom: 16px;}.volume-label {  font-size: 14px;  font-weight: 500;  color: #666;  margin-bottom: 12px;}.volume-bar-container {  width: 100%;  height: 24px;  background-color: #e0e0e0;  border-radius: 12px;  overflow: hidden;  margin-bottom: 8px;}.volume-bar {  height: 100%;  transition: width 0.1s ease;  border-radius: 12px;}.volume-bar.volume-zero {  background-color: #9e9e9e;}.volume-bar.volume-low {  background-color: #ff9800;}.volume-bar.volume-medium {  background-color: #4caf50;}.volume-bar.volume-high {  background-color: #2196f3;}.volume-value {  text-align: center;  font-size: 18px;  font-weight: 600;  color: #333;}.microphone-selector {  display: flex;  align-items: center;  gap: 12px;  margin-bottom: 16px;}.microphone-selector label {  font-weight: 500;  min-width: 80px;}.microphone-selector select {  flex: 1;  padding: 8px 12px;  border: 1px solid #e0e0e0;  border-radius: 4px;  font-size: 14px;}.error-message {  display: flex;  align-items: center;  gap: 8px;  padding: 12px;  margin-bottom: 16px;  background-color: #ffebee;  color: #c62828;  border-radius: 4px;  font-size: 14px;}.control-buttons {  margin-bottom: 12px; display: flex; gap: 8px; }.control-buttons button {  flex: 1; width: 100%;  padding: 12px 24px;  background-color: #1976d2;  color: white;  border: none;  border-radius: 4px;  font-size: 14px;  font-weight: 500;  cursor: pointer;  transition: background-color 0.3s;}.control-buttons button:hover:not(:disabled) {  background-color: #1565c0;}.control-buttons button:disabled {  background-color: #bdbdbd;  cursor: not-allowed;}.test-tip {  display: flex;  align-items: center;  gap: 8px;  padding: 12px;  background-color: #e3f2fd;  color: #1565c0;  border-radius: 4px;  font-size: 13px;}
</style>
```

### Step 3: Speaker Test

Use the [startSpeakerTest](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#startSpeakerTest) method to play a specified audio file to confirm whether the speaker is working properly.

**Code example:**
``` typescript
<template>
  <div class="speaker-test">
    <!-- Speaker selection -->
    <div class="speaker-selector">
      <label>Select speaker</label>
      <select
        :value="currentSpeaker?.deviceId"
        @change="handleSpeakerChange"
        :disabled="isSpeakerTesting"
      >
        <option
          v-for="speaker in speakerList"
          :key="speaker.deviceId"
          :value="speaker.deviceId"
        >
          {{ speaker.deviceName }}
        </option>
      </select>
    </div>

    <!-- Control buttons -->
    <div class="control-buttons">
      <button @click="getSpeakerList">Get speaker list</button>
      <button
        @click="toggleSpeakerTest"
        :disabled="isSpeakerTesting"
      >
        {{ isSpeakerTesting ? 'Playing...' : 'Play test audio' }}
      </button>
      <button
        v-if="isSpeakerTesting"
        @click="stopSpeakerTest"
      >
        Stop playback
      </button>
    </div>

    <!-- Test tip -->
    <div v-if="isSpeakerTesting" class="test-tip">
      <span>Playing test audio. Please confirm whether you can hear the sound</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useDeviceState } from 'tuikit-atomicx-vue3/room';

const {
  isSpeakerTesting,
  speakerList,
  currentSpeaker,
  startSpeakerTest,
  stopSpeakerTest,
  getSpeakerList,
  setCurrentSpeaker,
} = useDeviceState();

// Test audio file path
// Note: This URL is for development and testing only. In production, please use your own audio file. A 3-5 second MP3 file is recommended.
const testAudioPath = 'https://web.sdk.qcloud.com/trtc/electron/download/resources/media/TestSpeaker.mp3';

// Cleanup: stop the test
onUnmounted(() => {
  if (isSpeakerTesting.value) {
    stopSpeakerTest();
  }
});

// Toggle the speaker test
const toggleSpeakerTest = async () => {
  if (isSpeakerTesting.value) {
    await stopSpeakerTest();
  } else {
    try {
      await startSpeakerTest({ filePath: testAudioPath });
    } catch (error) {
      console.error('Failed to start speaker test:', error);
    }
  }
};

// Switch the speaker device
const handleSpeakerChange = async (event: Event) => {
  const deviceId = (event.target as HTMLSelectElement).value;
  try {
    await setCurrentSpeaker({ deviceId });
  } catch (error) {
    console.error('Failed to switch speaker:', error);
  }
};
</script>

<style scoped>
.speaker-test {  width: 100%;  max-width: 640px;  margin: 0 auto;}.speaker-selector {  display: flex;  align-items: center;  gap: 12px;  margin-bottom: 24px;}.speaker-selector label {  font-weight: 500;  min-width: 80px;}.speaker-selector select {  flex: 1;  padding: 8px 12px;  border: 1px solid #e0e0e0;  border-radius: 4px;  font-size: 14px;}.volume-slider-container {  display: flex;  align-items: center;  gap: 12px;}.volume-slider {  flex: 1;  height: 6px;  border-radius: 3px;  background: #e0e0e0;  outline: none;  -webkit-appearance: none;}.volume-slider::-webkit-slider-thumb {  -webkit-appearance: none;  width: 18px;  height: 18px;  border-radius: 50%;  background: #1976d2;  cursor: pointer;}.volume-slider::-moz-range-thumb {  width: 18px;  height: 18px;  border-radius: 50%;  background: #1976d2;  cursor: pointer;  border: none;}.volume-value {  min-width: 50px;  text-align: right;  font-weight: 500;  color: #333;}.control-buttons {  display: flex;  gap: 12px;  margin-bottom: 12px;}button {  flex: 1;  padding: 12px 24px;  background-color: #1976d2;  color: white;  border: none;  border-radius: 4px;  font-size: 14px;  font-weight: 500;  cursor: pointer;  transition: background-color 0.3s;}.control-buttons button:hover:not(:disabled) {  background-color: #1565c0;}.control-buttons button:disabled {  background-color: #bdbdbd;  cursor: not-allowed;}.test-tip {  display: flex;  align-items: center;  gap: 8px;  padding: 12px;  background-color: #e3f2fd;  color: #1565c0;  border-radius: 4px;  font-size: 13px;}
</style>
```

## API Reference

|**State/Component**|**Description**|**API Reference**|
|---------|---------|---------|
|**useDeviceState**|Contains audio/video device status, the audio/video device list, and operation APIs.|[API Reference](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState)|

## FAQ

### Why is there no image in the camera preview?

Possible causes include:
- **Permission denied:** Check whether the browser allows camera access.

- **Device in use:** Close other applications that are using the camera.

- **Device not connected:** Check whether the camera is properly connected.

- **Browser not supported:** Use a modern browser such as Chrome or Edge.

### Why does the volume stay at 0 during the microphone test?

Possible causes include:
- **Microphone permission not granted:** Check the browser permission settings.

- **Microphone muted:** Check the system microphone settings.

- **Wrong device selected:** Switch to the correct microphone device.

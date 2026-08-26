
## Function Description

This article mainly introduces how to detect the behavior of users inserting, unplugging, and starting devices. And how to handle device collection exceptions.

> **About SDK automatic recovery collection**<br>
> The SDK will detect the insertion and removal behavior of the camera and microphone, and automatically recover the collection at the appropriate time. The specific logic is as follows:
> 1. If the currently streaming camera/microphone is unplugged, the SDK will try to use the remaining available media devices to restore the collection.
> 2. If the camera/microphone is unplugged and there are no available media devices, the SDK will detect the device insertion behavior. If a new available media device is inserted, the SDK will try to use the newly inserted media device to restore the collection and push the stream.
> 3. If the recovery fails, an error [TRTC.ERROR_CODE.DEVICE_ERROR](module-ERROR_CODE.md#.DEVICE_ERROR) will be thrown, and the extraCode will be 5308 and 5309.

## Implementation Process

### Detect device insertion, removal, and startup

```js
trtc.on(TRTC.EVENT.DEVICE_CHANGED, (event) => {
  // Device insertion
  if (event.action === 'add') {
    // Camera insertion
    if (event.type === 'camera') {}
  } else if (event.action === 'remove') {
    // Device unplugged
  } else if (event.action === 'active') {
    // Device startup
  }
  console.log(`${event.type}(${event.device.label}) ${event.action}`);
});
```

### Check if the currently used device is unplugged

```js
trtc.on(TRTC.EVENT.DEVICE_CHANGED, (event) => {
  if (event.action === 'remove') {
    if (event.type === 'camera') {
      const currentCameraId = trtc.getVideoTrack()?.getSettings()?.deviceId;
      if (event.device.deviceId === currentCameraId) {
        // The currently used camera is unplugged.
      }
    } else if (event.type === 'microphone') {
      const currentMicId = trtc.getAudioTrack()?.getSettings()?.deviceId;
      if (event.device.deviceId === currentMicId) {
        // The currently used microphone is unplugged.
      }
    }
  }
});
```

### Automatically switch to using new devices when users insert new devices.

```js
trtc.on(TRTC.EVENT.DEVICE_CHANGED, (event) => {
  if (event.action === 'add') {
    if (event.type === 'camera') {
      // After inserting the camera, automatically switch to the new camera
      trtc.updateLocalVideo({ option: { cameraId: event.device.deviceId }});
    }
  }
});
```

### Handling device collection exceptions

Listen for device collection exception events

```js
trtc.on(TRTC.EVENT.VIDEO_PLAY_STATE_CHANGED, event => {
  // Local camera collection exception, at this time the SDK will try to automatically recover the collection, you can guide the user to check whether the camera is normal.
  if (event.userId === '' && event.streamType === TRTC.TYPE.STREAM_TYPE_MAIN && (event.reason === 'mute' || event.reason === 'ended')) {}
});

trtc.on(TRTC.EVENT.AUDIO_PLAY_STATE_CHANGED, event => {
  // Local microphone collection exception, at this time the SDK will try to automatically recover the collection, you can guide the user to check whether the microphone is normal.
  if (event.userId === '' && (event.reason === 'mute' || event.reason === 'ended')) {}
});
```

Listen for SDK automatic recovery collection failure events
```js
trtc.on(TRTC.EVENT.ERROR, error => {
  if (error.code === TRTC.ERROR_CODE.DEVICE_ERROR) {
    // Camera recovery collection failed
    if (error.extraCode === 5308) {
      // After guiding the user to check the device, call updateLocalVideo and pass in cameraId to recollect.
      trtc.updateLocalVideo({ option: { cameraId: '' }});
    }

    // Microphone recovery collection failed
    if (error.extraCode === 5309) {
      // After guiding the user to check the device, call updateLocalAudio and pass in microphoneId to recollect.
      trtc.updateLocalAudio({ option: { microphoneId: '' }});
    }
  }
})
```

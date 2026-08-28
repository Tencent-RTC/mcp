This document guides you on how to use Atomicx to implement screen sharing capabilities and handle in-room interactions based on the screen sharing state.

## Prerequisites
- The user has completed login authentication via [useLoginState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-LoginState). Please refer to Integration Overview.

- The user has entered a room via [useRoomState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState). Please refer to Room Management.

- If integrating within an `iframe`, you need to declare the permissions in the tag.

   ``` typescript
   <iframe allow="display-capture; fullscreen;"></iframe>
   ```

## Implementing the Screen Sharing Feature

### Step 1: Start Screen Sharing

Use the [startScreenShare](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#startScreenShare) method to start screen sharing. In a Web environment, you will see the browser's screen picker, where you can choose to share the entire screen, an application window, or a browser tab.

``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { startScreenShare } = useDeviceState();

// Attempt to start screen sharing, and attempt to share system audio
const handleStartShare = async () => {
  try {
    await startScreenShare({ screenAudio: true });
  } catch (error) {
    // Handle errors such as the user declining or the browser not supporting it
    console.error('Failed to start screen sharing:', error);
  }
};
```

### Step 2: Share System Audio

By setting the `screenAudio: true` parameter, you can share system audio at the same time as sharing the screen. This is very useful when sharing content that includes audio, such as videos, presentations, and music.

``` typescript
import { useDeviceState } from 'tuikit-atomicx-vue3/room';
const { startScreenShare } = useDeviceState();

// Start screen sharing and share system audio
const handleStartScreenShareWithAudio = async () => {
  try {
    await startScreenShare({ screenAudio: true });
    console.log('Screen sharing (with audio) has started');
  } catch (error) {
    console.error('Failed to start screen sharing:', error);
  }
};
```

**Browser Compatibility Notes:**

|Browser|System Audio Sharing Support|Remarks|
|---------|---------|---------|
|Chrome 74+|Supported|You need to check **Share audio** in the picker|
|Edge 79+|Supported|Based on Chromium; same experience as Chrome|
|Firefox|Not supported|System audio sharing is not yet supported|
|Safari|Not supported|System audio sharing is not yet supported|

> System audio sharing requires browser support, and the user must check the **Share audio** option in the screen picker. If the browser does not support system audio sharing, the `screenAudio` parameter is ignored, but the screen sharing feature is not affected and works normally.
>

### Step 3: Stop Screen Sharing

Users can stop screen sharing in the following ways:
1. **Call the** [**stopScreenShare()**](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#stopScreenShare)** interface**

   ``` typescript
   import { useDeviceState, DeviceStatus } from 'tuikit-atomicx-vue3/room';
   const { screenStatus, stopScreenShare } = useDeviceState();

   // Stop screen sharing
   const handleStopScreenShare = async () => {
     try {
       await stopScreenShare();
       console.log('Screen sharing has stopped');
     } catch (error) {
       console.error('Failed to stop screen sharing:', error);
     }
   };
   ```
2. **Click the browser's native "Stop sharing" button**

3. **Close the shared window or tab**

   > **Note:**
   >

   > When a user stops screen sharing using any of these methods, Atomicx automatically updates the state of [screenStatus](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#screenStatus).
   >

### Step 4: Permission Control and State Listening

#### **Setting Screen Sharing Permissions**

You can control the screen management permissions within the room through the member management interfaces provided by [useRoomParticipantState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState).
``` typescript
import { useRoomParticipantState, DeviceType } from 'tuikit-atomicx-vue3/room';
const { disableAllDevices } = useRoomParticipantState();

// Restrict screen sharing to the room owner/administrator only
async function handleDisableAllScreen() {
  await disableAllDevices({
    deviceType: DeviceType.Screen,
    disable: true,
  });
}

// Allow all users in the room to start screen sharing
async function handleEnableAllScreen() {
  await disableAllDevices({
    deviceType: DeviceType.Screen,
    disable: false,
  });
}
```

#### **Automatic Layout Switching**

When it is detected that a user in the room has started screen sharing, it is recommended to switch to the sidebar layout (`RoomLayoutTemplate.SidebarLayout`), enlarging the shared view and displaying other participants' views in the sidebar.
``` typescript
<template>
  <div class="room-container">
    <RoomView :layout-template="layoutTemplate">
      <template #participantViewUI="{ participant, streamType }">
        <ParticipantViewUI
          :participant="participant"
          :stream-type="streamType"
        />
      </template>
    </RoomView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  RoomView,
  RoomLayoutTemplate,
  useRoomParticipantState
} from 'tuikit-atomicx-vue3/room';

const layoutTemplate = ref(RoomLayoutTemplate.GridLayout);
const { participantWithScreen } = useRoomParticipantState();

// Listen to the screen sharing state and switch the layout automatically
watch(participantWithScreen, (participant) => {
  if (participant) {
    // Someone is sharing their screen, switch to the sidebar layout
    layoutTemplate.value = RoomLayoutTemplate.SidebarLayout;
  } else {
    // No one is sharing their screen, switch back to the grid layout
    layoutTemplate.value = RoomLayoutTemplate.GridLayout;
  }
});
</script>
```

#### **Restricting Screen Sharing to One Person**

Only one person should be allowed to share their screen in a room. When someone is sharing, disable the sharing button for others:
``` typescript
<script setup>
import { computed } from 'vue';
import { useRoomParticipantState } from 'tuikit-atomicx-vue3/room';

const { participantWithScreen, localParticipant } = useRoomParticipantState();

const isOtherSharing = computed(() => {
  const sharer = participantWithScreen.value;
  if (!sharer) return false;
  return sharer.userId !== localParticipant.value?.userId;
});

const canStartScreenShare = computed(() => {
  return !isOtherSharing.value;
});
</script>

// Use in the template
<template>
  <button :disabled="!canStartScreenShare" @click="handleStartShare">
    Start Screen Sharing
  </button>
<template>
```

### Step 5: Handling Screen Sharing Errors

When an error occurs during screen sharing, prompt the user to take the appropriate action based on the error information.

**Code example:**
``` typescript
import { useDeviceState, DeviceError } from 'tuikit-atomicx-vue3/room';
import { TUIToast } from '@tencentcloud/uikit-base-component-vue3';

const { startScreenShare } = useDeviceState();

try {
  await startScreenShare();
} catch (error: any) {
  let message = '';
  switch (error.name) {
    case 'NotReadableError':
      message = 'The system is blocking the current browser from accessing screen content. Please enable the screen sharing permission.';
      break;
    case 'NotAllowedError':
      if (error.message.includes('Permission denied by system')) {
        message = 'The system is blocking the current browser from accessing screen content. Please enable the screen sharing permission.';
      } else {
        message = 'The user canceled screen sharing';
      }
      break;
    default:
      message = 'An unknown error occurred during screen sharing. Please try again.';
      break;
  }
  TUIToast.warning({
    message,
  });
}
```

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useDeviceState**|Contains audio/video device states, the audio/video device list, and operation interfaces.|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState)|
|**useRoomParticipantState**|Contains in-room user data and user management interfaces.|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState)|

## FAQ

### Why doesn't system audio sharing work?
- **Platform limitation:** Audio sharing is currently only supported on modern browsers such as Chrome and Edge.

- **Operation detail:** The user must manually select **Share audio** in the screen picker that pops up in the browser.

- **System limitation:** Some operating systems do not support sharing the audio of a specific **application window**. It is recommended to prioritize selecting the **entire screen** or a **browser tab**.

### How can I detect that a user has ended screen sharing by clicking the browser's "Stop sharing" button?

Atomicx automatically listens for the browser's stop-sharing event and updates the `screenStatus` state. You only need to watch for changes in `screenStatus`:
``` typescript
watch(screenStatus, (newStatus, oldStatus) => {
  if (oldStatus === DeviceStatus.On && newStatus === DeviceStatus.Off) {
    console.log('The user has stopped screen sharing.');
  }
});
```

### Do mobile browsers support screen sharing?

Only desktop browsers support screen sharing; mobile browsers do not support screen sharing capabilities.

### Why, after a user enables screen sharing audio, do other participants see that user's microphone status displayed as "on"?

This is expected system behavior, for the following reasons:

**Technical principle:** `microphoneStatus` indicates whether the current device is transmitting an audio signal outward. When screen sharing is enabled and **capture system audio** is checked, the Atomicx SDK starts an audio transmission channel. Since the remote end receives a continuous stream of audio data, the system cannot distinguish whether the audio source is the physical microphone or system playback sound, so it uniformly marks the audio capture status as `DeviceStatus.On`.

**Privacy note:** Rest assured, this does not mean your microphone is already capturing your speech. Whether the microphone sound is being pushed depends only on the microphone control interfaces (`openLocalMicrophone` and `unmuteLocalMicrophone`) and is independent of screen sharing audio capture—they are two separate channels. Even if screen sharing audio is being transmitted, as long as the microphone-related interfaces are not called, your microphone sound will not be captured or pushed.

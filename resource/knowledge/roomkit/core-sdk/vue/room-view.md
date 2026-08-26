This document guides you through using Atomicx's core view component `RoomView` to render the video display of a real-time audio/video room. By configuring layout templates and leveraging component slots, you can quickly implement video layout switching and personalized customization.

`RoomView` is the main container component in Atomicx responsible for rendering the video display. It automatically handles the subscription, rendering, and release of video streams, so you only need to focus on its layout configuration and UI enhancements.

## Core Capabilities

As the core view container for multi-party audio/video rooms, `RoomView` comes with several enterprise-grade audio/video processing capabilities built in:
- **Intelligent performance management**: Supports lazy loading of video streams within the viewport, and can automatically switch between high- and low-definition streams based on the stream area size and the number of remote streams, significantly reducing system power consumption and bandwidth usage.

- **Fine-grained sorting strategy**: The system automatically adjusts the display order based on role (host first) and media status (audio/video enabled first).

- **Interactive speaker mode**: Supports double-clicking to pin the main view, and collapsing non-core areas in sidebar or top-bar layouts to focus on the presentation content.

- **Immersive visual design**: All video windows are forced to maintain the standard `16:9` aspect ratio, and combined with an interactively displayed toolbar, provide a distraction-free multi-party audio/video room experience.

## Customizable Scope

`RoomView` focuses solely on the underlying playback of video streams, while handing over all "presentation control" of the view layer to the developer. With `RoomView`, you can freely define:
- **Layout switching**: Change the layout in real time based on the business scenario (for example, presentation mode or discussion mode).

- **Video widget UI:** Includes nickname labels, dynamic volume waveforms, role badges, and more.

## **Prerequisites**
- The user has completed login authentication via [useLoginState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-LoginState). Please refer to the Integration Overview.

- The user has entered the room via [useRoomState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState). See Room Management.

- The global `UIKitProvider` has been configured in `App.vue`. For details, see [Configuring App.vue](https://cloud.tencent.com/document/product/647/81962#ce98ee15-b0cb-43af-81da-70f51231430e).

## Implementing the Video Layout Feature

### Step 1: Import and Render the Basic Layout

In your meeting page (for example, RoomLayoutView.vue), import `RoomView` and the layout enum `RoomLayoutTemplate`.
``` typescript
<template>
  <div class="room-container">
    <RoomView />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RoomView } from 'tuikit-atomicx-vue3/room';
</script>

<style lang="scss">
.room-container {
 width: 100%;
 height: 100%;
}
</style>
```

> `RoomView` automatically fills the height and width of its parent container, so make sure its parent container has explicit dimensions.
>

### Step 2: Switch the Layout Mode

You can dynamically update the value of the `RoomView` property `layoutTemplate` based on your business logic (for example, clicking a toggle button).

|Property|Type|Default Value|Description|
|---------|---------|---------|---------|
|`layoutTemplate`|`RoomLayoutTemplate`|`RoomLayoutTemplate.GridLayout`|Video stream layout|

Explanation of the available values of `RoomLayoutTemplate`:

|Layout Mode|Enum Value|Description|
|---------|---------|---------|
|Grid layout|`RoomLayoutTemplate.GridLayout`|The default layout. All participants' videos are arranged evenly, with pagination supported when there are more than 9 participants.|
|Sidebar layout|`RoomLayoutTemplate.SidebarLayout`|The main view is prominently displayed, and the other participants' videos are arranged as a sidebar, suitable for scenarios such as presentations and reports.|
|Top-bar layout|`RoomLayoutTemplate.CinemaLayout`|The main view is prominently displayed, and the other participants' videos are arranged as a top bar, suitable for scenarios such as presentations and reports.<br>|

``` typescript
<template>
  <!-- Add layout switch buttons -->
  <div class="layout-switcher">
    <button @click="switchLayout(RoomLayoutTemplate.GridLayout)">Grid</button>
    <button @click="switchLayout(RoomLayoutTemplate.SidebarLayout)">Sidebar</button>
    <button @click="switchLayout(RoomLayoutTemplate.CinemaLayout)">Top Bar</button>
  </div>
  <div class="room-container">
    <RoomView :layoutTemplate="currentLayout" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RoomView, RoomLayoutTemplate } from 'tuikit-atomicx-vue3/room';
// Use the grid layout by default
const currentLayout = ref(RoomLayoutTemplate.GridLayout);

// Switch the layout
const switchLayout = (layout: RoomLayoutTemplate) => {
  currentLayout.value = layout;
};
</script>

<style lang="scss">
.room-container {
 width: 100%;
 height: 100%;
}
</style>
```

### Step 3: Implement Video Stream Widget Information

You can use the `participantViewUI` slot to customize the UI content displayed on the video (for example, setting the nickname or adding custom icons).

|Slot Parameter|Type|Description|
|---------|---------|---------|
|`participant`|`RoomParticipant`|The participant object corresponding to the current video stream, containing the user's real-time status information such as `userId`, `userName`, and `role`.|
|`streamType`|`VideoStreamType`|Distinguishes whether the current stream is a camera stream (Camera) or a screen sharing stream (Screen).|

#### Prepare Visual Assets

To provide complete interaction feedback, it is recommended that you prepare the following icons in advance:
- Microphone status icon: distinguishes between enabled, muted, and dynamic volume bars.

- Identity indicator icon: used to distinguish between the Owner, Admin, and regular members.

- Network signal icon: displays the real-time uplink/downlink network quality.

   > **Special note:**
   >

   > We provide royalty-free icons in the @tencentcloud/uikit-base-component-vue3 npm package of the example project, which you can import and use directly.
   >

#### Implementation Code Example
1. Add a new file `ParticipantViewUI.vue` to implement the UI rendering logic for a single video stream widget layer.

   ``` typescript
   <template>
     <div class="stream-cover-container">
       <div class="corner-user-info-container">
         <div
           v-if="showMasterIcon || showAdminIcon"
           :class="{ 'master-icon': showMasterIcon, 'admin-icon': showAdminIcon }"
         >
           <IconUser />
         </div>
         <div v-if="!isScreenStream" :class="['audio-icon-container']">
           <div class="audio-level-container">
             <div class="audio-level" :style="audioLevelStyle" />
           </div>
           <IconMicOff v-if="!isMicrophoneOn" class="audio-icon" size="20" />
           <IconMicOn v-else class="audio-icon" size="20" />
         </div>
         <span class="user-name" :title="displayName">
           {{ displayName }}
         </span>
       </div>
     </div>
   </template>

   <script setup lang="ts">
   import { computed, defineProps } from 'vue';
   import {
     IconUser,
     IconMicOff,
     IconMicOn,
   } from '@tencentcloud/uikit-base-component-vue3';
   import { RoomParticipantRole, DeviceStatus, VideoStreamType, useRoomParticipantState } from 'tuikit-atomicx-vue3/room';
   import type { RoomParticipant } from 'tuikit-atomicx-vue3/room';

   interface Props {
     participant: RoomParticipant;
     streamType: VideoStreamType;
   }
   const props = defineProps<Props>();

   const { speakingUsers } = useRoomParticipantState();
   const speakingAudioVolume = computed(() => speakingUsers.value.get(props.participant.userId) || 0);
   const audioLevelStyle = computed(() => {
     if (props.participant.microphoneStatus === DeviceStatus.Off || !speakingAudioVolume.value) {
       return '';
     }
     return `height: ${speakingAudioVolume.value * 4}%`;
   });

   const isMicrophoneOn = computed(() => props.participant.microphoneStatus === DeviceStatus.On);
   const displayName = computed(() => props.participant.nameCard || props.participant.userName || props.participant.userId);

   const showMasterIcon = computed(() => {
     const { role } = props.participant;
     return role === RoomParticipantRole.Owner && props.streamType === VideoStreamType.Camera;
   });

   const showAdminIcon = computed(() => {
     const { role } = props.participant;
     return (role === RoomParticipantRole.Admin && props.streamType === VideoStreamType.Camera);
   });
   </script>

   <style lang="scss" scoped>
   .stream-cover-container {  position: absolute;  top: 0;  left: 0;  width: 100%;  height: 100%;  border-radius: 12px;  pointer-events: none;  .corner-user-info-container {    position: absolute;    bottom: 8px;    left: 8px;    display: flex;    align-content: center;    align-items: center;    box-sizing: border-box;    min-width: 118px;    max-width: calc(100% - 24px);    padding-right: 10px;    height: 32px;    overflow: hidden;    font-size: 14px;    color: var(--uikit-color-white-1);    border-radius: 16px;    background-color: var(--uikit-color-black-5);    .master-icon,    .admin-icon {      display: flex;      flex-shrink: 0;      align-items: center;      justify-content: center;      width: 32px;      height: 32px;      margin-left: 0;      border-radius: 50%;      background-color: var(--button-color-primary-default);    }    .admin-icon {      background-color: var(--text-color-warning);    }    .audio-icon-container {      margin-left: 4px;      position: relative;      width: 20px;      height: 20px;      flex-shrink: 0;      min-width: 20px;      &:first-child {        margin-left: 8px;      }      .audio-level-container {        position: absolute;        top: 2px;        left: 6px;        display: flex;        flex-flow: column-reverse wrap;        justify-content: space-between;        width: 8px;        height: 12px;        overflow: hidden;        border-radius: 4px;        .audio-level {          width: 100%;          background-color: var(--text-color-success);          transition: height 0.2s;        }      }      .audio-icon {        position: absolute;        top: 0;        left: 0;      }    }    .user-name {      margin-left: 4px;      overflow: hidden;      text-overflow: ellipsis;      white-space: nowrap;      min-width: 0;    }    .screen-icon {      flex-shrink: 0;      min-width: 0;      color: var(--uikit-color-white-1);      margin-left: 4px;      margin-right: 2px;    }    .screen-info {      margin-left: 4px;      font-size: 12px;      color: var(--uikit-color-white-1);      flex-shrink: 0;      min-width: 0;    }  }}
   </style>
   ```
2. Configure the `RoomView` slot to render the video stream widget content on the page.

   ``` typescript
   <template>
     <div class="room-container">
       <RoomView :layout-template="currentLayout">
         <template #participantViewUI="{ participant, streamType }">
           <ParticipantViewUI :participant="participant" :stream-type="streamType" />
         </template>
       </RoomView>
     </div>
   </template>

   <script setup lang="ts">
   import { ref } from 'vue';
   import { RoomView, RoomLayoutTemplate } from 'tuikit-atomicx-vue3/room';
   // Import the newly added ParticipantViewUI.vue file
   import ParticipantViewUI from './ParticipantViewUI.vue';

   // Use the grid layout by default
   const currentLayout = ref(RoomLayoutTemplate.GridLayout);
   </script>
   ```

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useRoomParticipantState**|Contains in-room user data and user management interfaces.|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState)|

## FAQ

### **Does RoomView include rendering of screen sharing streams?**

`RoomView` has built-in rendering of remote screen sharing streams. For local screen sharing, you need to complete the placeholder UI for the local screen sharing via the `participantViewUI` slot.

### Does RoomView include UI widgets by default?

`RoomView` has no default UI widgets internally. You can refer to the [RoomView open-source usage example](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts/src/components/RoomLayoutView) to quickly build custom UI widgets.

### None of the layouts provided by RoomView meet my needs. Can more optional layouts be provided?

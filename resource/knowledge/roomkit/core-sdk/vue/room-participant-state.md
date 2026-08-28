This document guides you on how to manage participants in a room. Atomicx provides the ready-to-use list component `RoomParticipantList` for quick integration, and exposes the [useRoomParticipantState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState) Hook to help you implement custom participant control logic.

## Feature Overview

The participant management module covers a full set of capabilities for displaying user information in a room and handling permissions:
- **Real-time list display:** Dynamically presents the nickname, role, audio/video status, and volume fluctuations of all participants in the room.

- **Permission control:** Supports the room owner or administrators performing management operations such as removing participants, muting all participants, and transferring the room owner role.

- **Tiered management:** Supports differentiated permission strategies for the room owner, administrators, and regular participants.

## Prerequisites
- The user has completed login authentication via [useLoginState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-LoginState). For details, refer to the Integration Overview.

- The user has entered a room via [useRoomState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState). For details, refer to Room Management.

## Integrating the Participant Management Component

If you need to quickly build a participant list interface, we recommend using the `RoomParticipantList` component directly. `RoomParticipantList` is a ready-to-use participant list component with a complete built-in participant management UI and interactions.

Example code for integrating the `RoomParticipantList` component:
``` typescript
<template>
  <div class="room-page">
    <!-- Participant list sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>Participants ({{ currentRoom.participantCount }})</span>
        <IconClose />
      </div>

      <!-- Participant list component -->
      <RoomParticipantList />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconClose } from '@tencentcloud/uikit-base-component-vue3';
import {
  RoomView,
  RoomParticipantList,
  useRoomState,
  useRoomParticipantState
} from 'tuikit-atomicx-vue3/room';

const { currentRoom } = useRoomState();
const { participantList } = useRoomParticipantState();
</script>

<style scope>
.room-page {
  width: 100vw;
  height: 100vh;
  min-width: 1150px;
  display: flex;
  flex-direction: row;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  box-sizing: border-box;
}

.sidebar-header {
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
}
</style>
```

> **Note:**
> - `RoomParticipantList` automatically fills the height and width of its parent container, so make sure its parent container has explicit dimensions.
> - When using the `RoomParticipantList` component, make sure to configure the global `UIKitProvider` in `App.vue`. For details, refer to [Configuring App.vue](https://cloud.tencent.com/document/product/647/81962#ce98ee15-b0cb-43af-81da-70f51231430e).

## Implementing Participant Management Features

If you need to customize the participant list UI or trigger management actions in a specific business scenario, use [useRoomParticipantState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState).

### Step 1: Get the participant list

Use [getParticipantList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#getParticipantList) to get the reactive participant data [participantList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#participantList).
``` typescript
import { useRoomState, useRoomParticipantState } from 'tuikit-atomicx-vue3/room';

const { currentRoom } = useRoomState();
const { participantList, participantListCursor, getParticipantList } = useRoomParticipantState();

// Get the list of users in the room after successfully entering the room
watch(() => currentRoom.value?.roomId, async () => {
 await getParticipantList();
})

// Load more users when the list scrolls to the bottom
const handleLoadMore = async () => {
  if (participantListCursor.value) {
    await getParticipantList({ cursor: participantListCursor.value });
  }
};
```

> The data successfully fetched by the `getParticipantList` interface is automatically maintained in `participantList`. The UI only needs to render the data in `participantList`.
>

### Step 2: Render participant information

Developers can use the [participantList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#participantList) data to customize the rendering of the user information list.
``` typescript
<template>
  <div class="participant-list">
    <div class="list-header">
      <h3>Participants ({{ participantList.length }})</h3>
      <button @click="handleRefresh">
        <IconRefresh />
      </button>
    </div>
    <div class="list-content">
      <div
        v-for="participant in participantList"
        :key="participant.userId"
        class="participant-item"
      >
        <!-- Avatar -->
        <Avatar
          :user-id="participant.userId"
          :avatar-url="participant.avatarUrl"
        />

        <!-- User information -->
        <div class="user-info">
          <div class="user-name">
            <span>{{ participant.userName }}</span>
            <span v-if="participant.userId === localParticipant.userId" class="badge">Me</span>
            <span
              v-if="participant.role === RoomParticipantRole.Owner"
              class="role-badge owner"
            >
              Room owner
            </span>
            <span
              v-else-if="participant.role === RoomParticipantRole.Admin"
              class="role-badge admin"
            >
              Administrator
            </span>
          </div>
        </div>

        <!-- Device status -->
        <div class="device-status">
          <IconMicOn
            size="20"
            v-if="participant.microphoneStatus === DeviceStatus.On"
            class="icon-on"
          />
          <IconMicOff size="20" v-else class="icon-off" />
          <IconCameraOn
            size="20"
            v-if="participant.cameraStatus === DeviceStatus.On"
            class="icon-on"
          />
          <IconCameraOff size="20" v-else class="icon-off" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconRefresh, IconMicOn, IconMicOff, IconCameraOn, IconCameraOff } from '@tencentcloud/uikit-base-component-vue3';
import {
  useRoomParticipantState,
  Avatar,
  RoomParticipantRole,
  DeviceStatus
} from 'tuikit-atomicx-vue3/room';

const {
  localParticipant,
  participantList,
  getParticipantList,
  transferOwner
} = useRoomParticipantState();

const handleRefresh = async () => {
  await getParticipantList({ cursor: '' });
};
</script>

<style scoped>
.participant-list {  display: flex;  flex-direction: column;  width: 400px;  height: 100%;  background-color: white;}.list-header {  display: flex;  align-items: center;  justify-content: space-between;  padding: 16px;  border-bottom: 1px solid #e0e0e0;}.list-header h3 {  margin: 0;  font-size: 16px;  font-weight: 600;}.list-content {  flex: 1;  overflow-y: auto;  padding: 8px;}.participant-item {  display: flex;  align-items: center;  gap: 12px;  padding: 12px;  border-radius: 8px;  transition: background-color 0.2s;}.participant-item:hover {  background-color: #f5f5f5;}.participant-item.is-local {  background-color: #e3f2fd;}.user-info {  flex: 1;  min-width: 0;}.user-name {  display: flex;  align-items: center;  gap: 6px;  font-size: 14px;  font-weight: 500;}.badge {  padding: 2px 6px;  background-color: #4caf50;  color: white;  border-radius: 3px;  font-size: 12px;}.role-badge {  padding: 2px 6px;  border-radius: 3px;  font-size: 12px;}.role-badge.owner {  background-color: #ff9800;  color: white;}.role-badge.admin {  background-color: #2196f3;  color: white;}.device-status {  display: flex;  gap: 8px;}.icon-on {  color: #4caf50;}.icon-off {  color: #999;}.action-button {  padding: 4px 8px;  background: transparent;  border: none;  cursor: pointer;  border-radius: 4px;  color: #666;}.action-button:hover {  background-color: #f0f0f0;}
</style>
```

### Step 3: Set custom user information

Developers can use the [updateParticipantMetaData](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#updateParticipantMetaData) interface to set custom user data, used to **implement capabilities such as job title** and **purchase status**. After updating, the `metaData` information is maintained in the reactive data of the corresponding user in `participantList`.
``` typescript
<template>
  <div v-for="participant in participantList" :key="participant.userId">
    <span>{{ participant.userName }}</span>
    <span v-if="participant.metaData">
      {{ JSON.parse(participant.metaData).level }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconRefresh, IconMicOn, IconMicOff, IconCameraOn, IconCameraOff } from '@tencentcloud/uikit-base-component-vue3';
import {
  useRoomParticipantState,
} from 'tuikit-atomicx-vue3/room';

const {
  updateParticipantMetaData,
} = useRoomParticipantState();

await updateParticipantMetaData({
 userId: '', // Specify the user id
 metaData: JSON.stringify({ level: 1 }),   // Business custom information
})
</script>
```

### Step 4: Manage participant roles

The room owner can use the [setAdmin](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setAdmin) interface to change a user's role to administrator, and use the [revokeAdmin](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#revokeAdmin) method to revoke a user's administrator role.
``` typescript
const { setAdmin, revokeAdmin } = useRoomParticipantState();

// Set a regular user as an administrator
await setAdmin({ userId });

// Set an administrator back to a regular user
await revokeAdmin({ userId });
```

### Step 5: Manage participant media devices

The room owner and administrators can use the [closeParticipantDevice](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#closeParticipantDevice) interface to remotely control other participants' media devices, in order to keep the meeting environment quiet and orderly.
``` typescript
import { useRoomParticipantState, DeviceType } from 'tuikit-atomicx-vue3/room';
const { closeParticipantDevice } = useRoomParticipantState();

// Forcibly turn off the microphone of a specified participant
async function handleCloseUserMicrophone(userId: string) {
  await closeParticipantDevice({
    userId,
    deviceType: DeviceType.Microphone,
  });
}

// Forcibly turn off the camera of a specified participant
async function handleCloseUserCamera(userId: string) {
  await closeParticipantDevice({
    userId,
    deviceType: DeviceType.Camera,
  });
}
```

### Step 6: Enable global state management

The room owner and administrators can enable room-wide global state management via the [disableAllDevices](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#disableAllDevices) and [disableAllMessages](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#disableAllMessages) interfaces.

#### **Disable the media devices of all regular users in the room**
``` typescript
import { useRoomParticipantState, DeviceType } from 'tuikit-atomicx-vue3/room';
const { closeParticipantDevice } = useRoomParticipantState();

// Forcibly turn off the microphones of all regular participants
async function handleDisableAllMicrophone() {
  await disableAllDevices({
    deviceType: DeviceType.Microphone,
    disable: true,
  });
}

// Lift the microphone disable for all participants
async function handleEnableAllMicrophone() {
  await disableAllDevices({
    deviceType: DeviceType.Microphone,
    disable: false,
  });
}

// Forcibly turn off the cameras of all regular participants
async function handleDisableAllCamera() {
  await disableAllDevices({
    deviceType: DeviceType.Camera,
    disable: true,
  });
}

// Lift the camera disable for all participants
async function handleEnableAllCamera() {
  await disableAllDevices({
    deviceType: DeviceType.Camera,
    disable: false,
  });
}
```

#### **Disable in-meeting chat for all regular users in the room**
``` typescript
import { useRoomParticipantState, DeviceType } from 'tuikit-atomicx-vue3/room';
const { disableAllMessages } = useRoomParticipantState();

// Forcibly disable the chat capability of all regular participants
async function handleDisableAllMessage() {
  await disableAllMessages({
    disable: true,
  });
}
```

### **Step 7:** Monitor participant speaking status

Using [speakingUsers](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#speakingUsers), you can obtain in real time the users who are currently speaking in the room and their volume levels.
``` typescript
const { speakingUsers } = useRoomParticipantState();

// Determine whether a user is currently speaking
const isSpeaking = (userId: string) => speakingUsers.value.has(userId);
// Get a user's real-time volume (0-100)
const getVolume = (userId: string) => speakingUsers.value.get(userId) || 0;
```

### Step 8: Remove a participant from the room

The room owner and administrators can use the [kickParticipant](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#kickParticipant) interface to remove a user from the room.
``` typescript
const { kickParticipant } = useRoomParticipantState();

// Remove a user from the room
await kickParticipant({ userId });
```

### Step 9: Invite others to join the room

In actual business scenarios, you may need to send a call invitation to users who have not yet entered the room. Atomicx provides full support for a calling system. .

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useRoomParticipantState**|Contains the user data in the room and the user management interfaces.|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomParticipantState)|

## Development Recommendations

**Permission validation:** At the UI layer, we recommend using `participant.role` to determine the current user's operation permissions, and hiding the **Remove** or **Mute** buttons from users who do not have management permissions.
``` typescript
<script setup>
import { RoomParticipantRole } from 'tuikit-atomicx-vue3/room';

const { localParticipant } = useRoomParticipantState();

// Determine whether the current user has management permissions
const hasAdminPermission = computed(() => {
  return localParticipant.value.role === RoomParticipantRole.Owner ||
         localParticipant.value.role === RoomParticipantRole.Admin;
});
</script>

// Use in the template
<template>
<button v-if="hasAdminPermission" @click="handleKick">Remove</button>
<template>
```

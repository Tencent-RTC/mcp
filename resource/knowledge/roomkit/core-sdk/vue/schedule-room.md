The schedule room feature allows users to plan meeting time, topic, and join password in advance. With this feature, users can create future meeting plans, generate a dedicated meeting number and join link, making it easy to notify participants ahead of time.

## Use Cases
- **Recurring enterprise meetings:** Schedule weekly and monthly meetings in advance to ensure participants are notified early.

- **Online class scheduling:** Teachers can set up a full week's class schedule in advance.

- **Remote interview booking:** HR can book specific time slots for candidates and interviewers.

## Prerequisites
- **User status:** The user has completed login authentication via useLoginState (see Integration Overview) and is in the **logged-in** state, which is required to schedule rooms or view the scheduled room list.

- **Environment dependency:** The project has already imported `tuikit-atomicx-vue3`.

## Implementing the Schedule Room Feature

This feature provides two integration approaches. You can choose the one that best fits your business needs:
- **Approach 1 (Recommended):** Quick integration using UI components. Directly import the schedule room panel ([ScheduleRoomPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/blob/main/packages/tuikit-atomicx-vue3/src/components/ScheduleRoomPanel/ScheduleRoomPanel.vue)) and the scheduled room list component ([ScheduledRoomList](https://github.com/Tencent-RTC/TUIKit_Vue3/blob/main/packages/tuikit-atomicx-vue3/src/components/ScheduleRoomPanel/ScheduledRoomList.vue)) provided by `tuikit-atomicx-vue3`, which has the lowest development cost.

- **Approach 2 (Advanced):** Custom integration using low-level APIs. Implement the UI and interaction logic yourself based on the atomicx-core SDK API `useRoomState` state hook, which offers the highest flexibility.

## Approach 1: Quick Integration Using UI Components

`tuikit-atomicx-vue3` provides two core components:
- [**ScheduleRoomPanel**](https://github.com/Tencent-RTC/TUIKit_Vue3/blob/main/packages/tuikit-atomicx-vue3/src/components/ScheduleRoomPanel/ScheduleRoomPanel.vue)**:** The configuration panel for scheduling meetings, including time selection, member invitation, and more.

- [**ScheduledRoomList**](https://github.com/Tencent-RTC/TUIKit_Vue3/blob/main/packages/tuikit-atomicx-vue3/src/components/ScheduleRoomPanel/ScheduledRoomList.vue)**:** Displays the current user's scheduled meeting list, supporting click-to-join, modify, and cancel operations.

### Step 1: Import the Components
``` typescript
import { ScheduleRoomPanel, ScheduledRoomList } from 'tuikit-atomicx-vue3/room';
```

### Step 2: Use the Components

You can combine and use these two components directly in your page.
``` typescript
<template>
  <UIKitProvider theme="light" language="en-US">
    <div class="schedule-container">
      <!-- Schedule button; clicking it shows the schedule dialog -->
      <button @click="showSchedulePanel = true">
        Schedule a Meeting
      </button>

      <!-- Scheduled room list component -->
      <div class="list-container">
        <!-- Listen to the join-room event to handle join logic -->
        <ScheduledRoomList @join-room="handleJoinRoom" />
      </div>

      <!-- Schedule panel dialog -->
      <!-- It is recommended to wrap it in a Dialog or Modal component -->
      <div v-if="showSchedulePanel" class="modal-mask">
        <div class="modal-content">
          <ScheduleRoomPanel
            @confirm="handleScheduleConfirm"
            @cancel="showSchedulePanel = false"
          />
        </div>
      </div>
    </div>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { ScheduleRoomPanel, ScheduledRoomList, useRoomState } from 'tuikit-atomicx-vue3/room';

const { joinRoom } = useRoomState();

const showSchedulePanel = ref(false);

const handleScheduleConfirm = (roomId: string, options: Record<string, any>) => {
  console.log('Scheduled successfully', roomId, options);
  showSchedulePanel.value = false;
  // Optional: show the invitation dialog or copy the link
};

const handleJoinRoom = async (roomInfo: { roomId: string }) => {
  console.log('Join clicked', roomInfo.roomId);
  await joinRoom(roomInfo.roomId);
};
</script>

<style scoped>
.schedule-container{padding:24px;max-width:1000px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif}button{background-color:#006eff;color:#fff;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;font-weight:500;transition:background-color .2s;margin-bottom:24px}button:hover{background-color:#0056cc}.list-container{background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.05);padding:16px}.modal-mask{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.4);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000}.modal-content{background-color:#fff;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);padding:24px;width:100%;max-width:480px}
</style>
```

## Approach 2: Custom Integration Using Low-Level APIs

This section mainly describes how to implement the core logic of scheduling rooms through the atomicx-core SDK API [useRoomState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState) interface.

Schedule room sequence diagram

### Step 1: Create a Schedule

Use the [scheduleRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#scheduleRoom) method to create a new scheduled meeting. You need to specify information such as the meeting's start time, end time, and room name.
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { scheduleRoom } = useRoomState();

const createSchedule = async () => {
  try {
    // roomId constraints: string type, required parameter, recommended to be randomly generated
    const roomId = '123456';

    // Note: the timestamp unit must be **seconds** (Date.getTime() returns milliseconds, so divide by 1000)
    const startTime = Math.floor(new Date().getTime() / 1000) + 3600; // starts in 1 hour
    const duration = 1800; // 30 minutes

    const options = {
      roomName: 'Product Requirements Review',
      scheduleStartTime: startTime, // unit: seconds
      scheduleEndTime: startTime + duration, // unit: seconds
      scheduleAttendees: ['userA', 'userB'], // list of invited participant IDs
      password: '123', // optional: set a join password
      isAllMicrophoneDisabled: false, // optional: whether to mute all microphones
      isAllCameraDisabled: false,     // optional: whether to disable all cameras
    };

    await scheduleRoom({ roomId, options });
    console.log('Scheduled successfully', roomId);
  } catch (error) {
    console.error('Scheduling failed', error);
  }
};
```

### Step 2: Get the Scheduled Room List

Use the [getScheduledRoomList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#getScheduledRoomList) method to fetch the current user's scheduled meeting list. The list data is reactively updated into the [scheduledRoomList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#scheduledRoomList) state.
``` typescript
import { onMounted, watch } from 'vue';
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const {
  scheduledRoomList,      // reactive data: scheduled meeting list
  getScheduledRoomList    // method: fetch the list
} = useRoomState();

// Load the list on initialization
onMounted(async () => {
  // cursor indicates where to start fetching data; an empty string means start from the beginning
  // getScheduledRoomList returns a new cursor
  const { cursor } = await getScheduledRoomList({ cursor: '' });
  // If cursor is not empty, there is more data available and you can continue fetching
});

// Watch for list changes and update the UI in real time
watch(scheduledRoomList, (list) => {
  console.log('Current scheduled list:', list);
});
```

### Step 3: Modify a Schedule

If you need to adjust the time or topic of a scheduled meeting, you can use the [updateScheduledRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#updateScheduledRoom) method.
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { updateScheduledRoom } = useRoomState();

const updateRoom = async (roomId: string) => {
  try {
    const newStartTime = Math.floor(new Date().getTime() / 1000) + 7200; // postpone by 2 hours
    const options = {
      roomName: 'Product Requirements Review (Rescheduled)',
      scheduleStartTime: newStartTime,
      scheduleEndTime: newStartTime + 1800,
    };

    await updateScheduledRoom({ roomId, options });
    console.log('Modified successfully');
  } catch (error) {
    console.error('Modification failed', error);
  }
};
```

### Step 4: Cancel a Schedule

If you need to cancel a scheduled meeting, you can call the [cancelScheduledRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cancelScheduledRoom) method.
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { cancelScheduledRoom } = useRoomState();

const cancelRoom = async (roomId: string) => {
  try {
    await cancelScheduledRoom({ roomId });
    console.log('Canceled successfully');
    // After a successful cancellation, scheduledRoomList updates automatically; no manual re-fetch is needed
  } catch (error) {
    console.error('Cancellation failed', error);
  }
};
```

### Step 5: Handle the Join Password

For scheduled meetings that have a password set, when calling the [joinRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#joinRoom) interface to join, you need to catch the authentication failure error and guide the user to enter the password.
``` typescript
import { useRoomState, TUIErrorCode } from 'tuikit-atomicx-vue3/room';

const { joinRoom } = useRoomState();

const enterRoom = async (roomId: string, password?: string) => {
  try {
    await joinRoom({ roomId, password });
  } catch (error: any) {
    // Catch the specific error code, TUIErrorCode.ERR_NEED_PASSWORD (-2010)
    if (error.code === TUIErrorCode.ERR_NEED_PASSWORD) {
      console.log('This room requires a password; please guide the user to enter it');
      // 1. Pop up the password input box
      // 2. Get the password entered by the user, inputPassword
      // 3. Call enterRoom(roomId, inputPassword) again
    } else if (error.code === TUIErrorCode.ERR_WRONG_PASSWORD) {
      console.error('Incorrect password, please try again');
    } else {
      console.error('Failed to join the room', error);
    }
  }
};
```

### Step 6: Listen to Schedule Events

In addition to passively reacting to data changes, you can also listen to specific schedule events to handle business logic, such as showing a reminder when a meeting is about to start.
``` typescript
import { onMounted, onUnmounted } from 'vue';
import { useRoomState, RoomEvent } from 'tuikit-atomicx-vue3/room';

const { subscribeEvent, unsubscribeEvent } = useRoomState();

// Meeting starting soon notification (default: 5 minutes before start)
const handleRoomStartingSoon = (info: { roomInfo: any }) => {
  console.log('Meeting starting soon:', info.roomInfo.roomName);
  // You can implement a Toast reminder or system notification here
};

// Meeting canceled notification
const handleRoomCancelled = (info: { roomInfo: any; operateUser: any }) => {
  console.log(`Meeting ${info.roomInfo.roomName} has been canceled by ${info.operateUser.userName}`);
};

// New meeting invitation received notification
const handleRoomAdded = (info: { roomInfo: any }) => {
  console.log('Received a new meeting invitation:', info.roomInfo.roomName);
};

// Removed from meeting notification
const handleRemovedFromRoom = (info: { roomInfo: any; operateUser: any }) => {
  console.log(`You have been removed from meeting ${info.roomInfo.roomName} by ${info.operateUser.userName}`);
};

onMounted(() => {
  // Register event listeners
  subscribeEvent(RoomEvent.onScheduledRoomStartingSoon, handleRoomStartingSoon);
  subscribeEvent(RoomEvent.onScheduledRoomCancelled, handleRoomCancelled);
  subscribeEvent(RoomEvent.onAddedToScheduledRoom, handleRoomAdded);
  subscribeEvent(RoomEvent.onRemovedFromScheduledRoom, handleRemovedFromRoom);
});

onUnmounted(() => {
  // Remove event listeners
  unsubscribeEvent(RoomEvent.onScheduledRoomStartingSoon, handleRoomStartingSoon);
  unsubscribeEvent(RoomEvent.onScheduledRoomCancelled, handleRoomCancelled);
  unsubscribeEvent(RoomEvent.onAddedToScheduledRoom, handleRoomAdded);
  unsubscribeEvent(RoomEvent.onRemovedFromScheduledRoom, handleRemovedFromRoom);
});
```

## Development Notes
1. **Timestamp unit**: All time parameters involved in the SDK (for example, `scheduleStartTime` and `scheduleEndTime`) are in **seconds**, not the milliseconds used by default by the JavaScript `Date` object. Be sure to perform the `/ 1000` operation before passing them.

2. **Style import**: When using UI components, be sure to import `UIKitProvider`, otherwise the component styles will not render correctly.

3. **RoomID recommendation**: Although `scheduleRoom` allows the frontend to pass in a `roomId`, to avoid ID conflicts, it is recommended that this ID be generated by the business backend and be globally unique.

4. **Pagination handling**: The scheduled room list can be very long, and the `getScheduledRoomList` interface supports paginated fetching. Pay attention to the `cursor` field in the return value; if it is not empty, there is more data available.

## FAQ
1. **Scheduled successfully but the list does not update?**

   Please confirm that you are logged in and that `getScheduledRoomList` was called on the first screen (for example, `cursor: ''`). If the returned `cursor` is not empty, you need to continue fetching; the list is reactive, so the UI will sync after it updates.

2. **How should I pass the** `joinRoom` **parameters?**

   It is recommended to consistently use object arguments: `joinRoom({ roomId, password })`, to avoid passing a string directly, which can cause type mismatches or limit future extensibility.

3. **Does using milliseconds for the timestamp cause scheduling to fail?**

   All time-related parameters must be in seconds; `Date.now()` needs to be divided by 1000 (`/ 1000`), otherwise a time conflict error will be returned.

4. **How do I handle a room that has a password set?**

   Catch `TUIErrorCode.ERR_NEED_PASSWORD` / `ERR_WRONG_PASSWORD`, pop up the password input box, and call `joinRoom({ roomId, password })` again; after multiple errors, you can prompt the user to contact the room owner to reset it.

5. **roomId conflicts or duplicates?**

   It is recommended that the backend generate a globally unique roomId; if generated on the frontend, check for conflicts before scheduling and implement a proper retry strategy.

6. **How do I continue fetching with pagination?**

   When the `cursor` returned by `getScheduledRoomList` is not empty, continue passing it in; an empty value means all data has been fetched.

## **Sample Project**

Tencent Cloud provides the sample project [atomicx-vite-vue3-ts](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts) on GitHub, which you can reference to implement the complete RoomKit functionality.

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useRoomState**|Room state management (create, join, schedule, etc.)|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState)|

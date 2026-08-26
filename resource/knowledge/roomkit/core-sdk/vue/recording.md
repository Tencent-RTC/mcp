This document guides developers in implementing cloud recording in the no-UI integration solution for standard meetings. You can control the start and stop of recording through `startRecording()` / `stopRecording()` provided by `useRoomState()`, and monitor recording state changes in real time through `currentRoom.recordingInfo` and `RoomEvent`.

> **Version note:**
>
> The cloud recording interfaces (`startRecording` / `stopRecording`) are supported since **tuikit-atomicx-vue3 6.4.0** and **tuikit-atomicx-react 6.2.0**. Make sure the version you use meets the requirement.
>

## Prerequisites
- The user has completed login authentication through `useLoginState`.

- The user has entered a standard meeting room through `useRoomState`.

- Cloud recording package activation and storage configuration have been completed:

  - Purchase a Conference SDK package that includes cloud recording capability.

  - Enable the recording file storage service: Recording files can be stored in [Cloud VOD (VOD)](https://console.cloud.tencent.com/vod) or [Cloud Object Storage (COS)](https://console.cloud.tencent.com/cos). Complete the activation in the corresponding console and record the storage information.

  - [Submit a ticket](https://console.cloud.tencent.com/workorder/category), select the **Real-Time Communication** product, and apply to configure the cloud recording storage information for your SDKAppID.

## Recording effect

The Conference SDK uses **mixed-stream recording** mode by default, mixing the audio and video streams published in the room into one complete recording file. The recording layout **switches automatically** with the in-meeting state, and the recording task is not restarted during the switch:

|**In-meeting state**|**Mixed-stream layout**|**Maximum number of views**|
|---------|---------|---------|
|No screen sharing / whiteboard|Grid layout|Up to **25** video views|
|With screen sharing / whiteboard|Screen sharing layout (sharing as the main view)|Up to **1** screen sharing + **16** video views|
|Audio only|-|—|

## Interface description

Conference SDK no-UI integration provides recording control and state subscription capabilities through `useRoomState()`. The recording task is fully managed by the server, and the client is only responsible for starting and stopping it.

|**Type**|**Name**|**Description**|
|---------|---------|---------|
|Method|`startRecording(): Promise<void>`|Starts cloud recording. Only the **room owner or administrator** can call it, and it must be called after successfully entering the room.|
|Method|`stopRecording(): Promise<void>`|Stops cloud recording. Only the **room owner or administrator** can call it.|
|State|`currentRoom.recordingInfo`|The recording information of the current room, including the `status` field (`RecordingStatus.Recording` indicates recording in progress).|
|Event|`RoomEvent.onRecordingStarted`|Triggered when the recording task starts successfully. The callback parameter is `{ roomInfo, operator }`.|
|Event|`RoomEvent.onRecordingStopped`|Triggered when the recording task stops. The callback parameter is `{ roomInfo, operator, reason }`. `reason` can distinguish between active stop and abnormal interruption.|

## Step 1: Start cloud recording

### Permission requirements

Only the **room owner or administrator** can call `startRecording()`; other roles calling it will throw a permission error. Only one recording task can exist in the same room at a time, and repeated calls will also return an error.

### Sample code

【Vue3】
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { startRecording } = useRoomState();

await startRecording();
```

【React】
``` typescript
import { useRoomState } from 'tuikit-atomicx-react/room';

const { startRecording } = useRoomState();

await startRecording();
```

### Error handling

`startRecording()` throws an error when it fails. Common error cases are as follows:

|**Error code**|**Meaning**|**Suggested handling**|
|---------|---------|---------|
|`100001`|Backend system error.|Retry later; if it persists, submit a ticket for investigation.|
|`100004`|The room does not exist.|Confirm that you have successfully entered the room through `createAndJoinRoom()` or `joinRoom()` before calling the recording interface.|
|`100006`|No permission; must be the room owner or administrator.|Check the current user role; only the room owner or administrator can start recording.|
|`101072`|The recording configuration does not exist or is not enabled.|Confirm that you have completed the console package activation, ticket configuration, and value-added feature switch. .|

【Vue3】
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { startRecording } = useRoomState();

try {
  await startRecording();
} catch (error: any) {
  switch (error?.code) {
    case 100001:
      console.error('Backend system error, please retry later.');
      break;
    case 100004:
      console.error('The room does not exist, please confirm you have entered the room before starting recording.');
      break;
    case 100006:
      console.error('Insufficient permission, only the room owner or administrator can start recording.');
      break;
    case 101072:
      console.error('The recording configuration does not exist or is not enabled, please check the console activation configuration.');
      break;
    default:
      console.error('Failed to start recording:', error);
  }
}
```

【React】
``` typescript
import { useRoomState } from 'tuikit-atomicx-react/room';

const { startRecording } = useRoomState();

try {
  await startRecording();
} catch (error: any) {
  switch (error?.code) {
    case 100001:
      console.error('Backend system error, please retry later.');
      break;
    case 100002:
      console.error('Parameter error, please check the passed parameters.');
      break;
    case 100004:
      console.error('The room does not exist, please confirm you have entered the room before starting recording.');
      break;
    case 100006:
      console.error('Insufficient permission, only the room owner or administrator can start recording.');
      break;
    case 101072:
      console.error('The recording configuration does not exist or is not enabled, please check the console activation configuration.');
      break;
    default:
      console.error('Failed to start recording:', error);
  }
}
```

## Step 2: Stop cloud recording

### Preconditions

There is a recording task in progress (`RecordingStatus.Recording`) in the current room.

### Permission requirements

Only the **room owner or administrator** can call `stopRecording()`.

### Sample code

【Vue3】
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { stopRecording } = useRoomState();

try {
  await stopRecording();
} catch (error: any) {
  console.error('Failed to stop recording:', error);
}
```

【React】
``` typescript
import { useRoomState } from 'tuikit-atomicx-react/room';

const { stopRecording } = useRoomState();

try {
  await stopRecording();
} catch (error: any) {
  console.error('Failed to stop recording:', error);
}
```

## Step 3: Monitor recording state changes

### Preconditions
- You have successfully entered the room.

- It is recommended to subscribe to events **immediately** after entering the room to avoid missing recording notifications initiated by other ends (such as a mobile room owner).

### Sample code

【Vue3】
``` typescript
import { useRoomState, RecordingStatus, RecordingStopReason, RoomEvent } from 'tuikit-atomicx-vue3/room';

const { currentRoom, subscribeEvent } = useRoomState();

// Actively query the current recording state
const isRecording = currentRoom.value?.recordingInfo?.status === RecordingStatus.Recording;

// Listen for recording start
subscribeEvent(RoomEvent.onRecordingStarted, ({ operator }) => {
  console.log('Recording started, operator:', operator.userId);
});

// Listen for recording stop
subscribeEvent(RoomEvent.onRecordingStopped, ({ operator, reason }) => {
  if (reason === RecordingStopReason.StoppedByUser) {
    console.log('Recording stopped, operator:', operator.userId);
  } else if (reason === RecordingStopReason.RecorderLeftRoom) {
    console.warn('Recording interrupted abnormally, the recording robot has left the room. Restart recording if needed.');
  }
});
```

【React】
``` typescript
import { useRoomState, RecordingStatus, RecordingStopReason, RoomEvent } from 'tuikit-atomicx-react/room';

const { currentRoom, subscribeEvent } = useRoomState();

// Actively query the current recording state
const isRecording = currentRoom?.recordingInfo?.status === RecordingStatus.Recording;

// Listen for recording start
subscribeEvent(RoomEvent.onRecordingStarted, ({ operator }) => {
  console.log('Recording started, operator:', operator.userId);
});

// Listen for recording stop
subscribeEvent(RoomEvent.onRecordingStopped, ({ operator, reason }) => {
  if (reason === RecordingStopReason.StoppedByUser) {
    console.log('Recording stopped, operator:', operator.userId);
  } else if (reason === RecordingStopReason.RecorderLeftRoom) {
    console.warn('Recording interrupted abnormally, the recording robot has left the room. Restart recording if needed.');
  }
});
```

### Error cases

The `reason` field of the `onRecordingStopped` event identifies the reason the recording stopped:

|**Enum value**|**Value**|**Description**|
|---------|---------|---------|
|`RecordingStopReason.StoppedByUser`|`0`|The room owner or administrator actively called `stopRecording()` for a normal stop.|
|`RecordingStopReason.RecorderLeftRoom`|`1`|The recording robot left the room abnormally and the recording was interrupted. It is recommended to prompt the user and decide whether to restart recording based on business needs.|

> **Note:**
> - The cloud recording feature requires completing package purchase, storage service activation, and ticket configuration in advance. Confirm that you have completed all steps in the **Prerequisites** of this document.
> - Recording files are stored in the Cloud VOD (VOD) or Cloud Object Storage (COS) you configured. Go to the corresponding console to view and manage them.

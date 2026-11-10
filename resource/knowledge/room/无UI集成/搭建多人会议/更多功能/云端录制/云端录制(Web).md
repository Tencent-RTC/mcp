---
sync_node_id: '224180934139207680'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "更多功能"
  - "云端录制"
  - "云端录制（Web）"
product: "room"
---
This document provides guidance for developers on enabling cloud recording in a standard Conference SDK integration without a UI. Recording can be started and stopped using `startRecording()` and `stopRecording()` from `useRoomState()`. You can also monitor recording status in real time via `currentRoom.recordingInfo` and `RoomEvent`.

> **Version Note:**
> 
> Cloud recording APIs (`startRecording` / `stopRecording`) are supported starting from **tuikit-atomicx-vue3 6.4.0** and **tuikit-atomicx-react 6.2.0**. Please make sure your SDK version meets these requirements.
> 

## Prerequisites
- Complete login authentication using `useLoginState`. See Integration Overview.

- Enter a standard conference room with `useRoomState`. .

- Activate the cloud recording package and configure storage:

   - Purchase a video conferencing SDK package that includes cloud recording capabilities.

   - Enable file storage for recordings. Recording files can be stored in Video on Demand (VOD), Object Storage (COS), or AWS S3. Activate one of these services in the corresponding product console and record the storage details.

   - On the [Real-Time Communication Console Configuration Page](https://console.trtc.io/conference-configuration), select your target application at the top and click **Configure**.

      

      On the recording configuration page, enter the following information based on your chosen storage method:

      - **Store to VOD**: Account UIN and VOD Application AppID.

      - **Store to COS**: Bucket name, Region, AccessKey (SecretId), and SecretKey.

      - **Store to AWS S3**: Bucket name, [Region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions) (example: `ap-southeast-1`), AWS Access Key ID, and AWS Secret Access Key.

## Recording Effects

By default, the Conference SDK uses **mixed-stream recording**, merging all published audio/video streams in the room into a single recording file. The mixed-stream layout automatically adapts to the meeting status, and the recording task continues uninterrupted when the layout changes:

|**Meeting Status**|**Mixed-stream Layout**|**Maximum Number of Video Streams**|
|---------|---------|---------|
|No screen sharing / whiteboard|Grid layout|Up to **25** video streams|
|Screen sharing / whiteboard|Screen sharing layout (shared content as primary image)|Up to **1** screen share + **16** video streams|
|Audio only|-|—|

## API Description

The Conference SDK provides cloud recording control and status subscription through `useRoomState()` in UI-less integrations. The server manages the recording task, while the client is responsible for starting and stopping recording.

|**Type**|**Name**|**Description**|
|---------|---------|---------|
|Method|`startRecording(): Promise<void>`|Starts cloud recording. Only the **host or admin** can call this method, and it must be called after joining the room.|
|Method|`stopRecording(): Promise<void>`|Stops cloud recording. Only the **host or admin** can call this method.|
|State|`currentRoom.recordingInfo`|Recording details for the current room, including the `status` field (`RecordingStatus.Recording` means recording is ongoing).|
|Event|`RoomEvent.onRecordingStarted`|Emitted when the recording task begins. Callback parameters: `{ roomInfo, operator }`.|
|Event|`RoomEvent.onRecordingStopped`|Emitted when the recording task ends. Callback parameters: `{ roomInfo, operator, reason }`. The `reason` field indicates whether recording was stopped manually or due to an interruption.|

## Step 1: Start Cloud Recording

### Permission Requirements

Only the **host or admin** can call `startRecording()`. Calls from other roles will result in a permission error. Only one recording task can run in a room at a time; repeated calls will return an error.

### Sample Code

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

### Error Handling

If `startRecording()` fails, it throws an error. Common error scenarios include:

|**Error Code**|**Meaning**|**Recommended Solution**|
|---------|---------|---------|
|`100001`|Backend system error.|Retry later. If the issue persists, submit a ticket for support.|
|`100004`|Room does not exist.|Make sure you have successfully joined the room using `createAndJoinRoom()` or `joinRoom()` before calling the recording API.|
|`100006`|No permission; must be host or admin.|Check the current user role. Only the host or admin can start recording.|
|`101072`|Recording configuration missing or not enabled.|Ensure package activation, ticket configuration, and feature switches are completed. See Prerequisites above.|

【Vue3】
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { startRecording } = useRoomState();

try {
  await startRecording();
} catch (error: any) {
  switch (error?.code) {
    case 100001:
      console.error('Backend system error. Please try again later.');
      break;
    case 100004:
      console.error('Room does not exist. Please make sure you have entered the room before starting recording.');
      break;
    case 100006:
      console.error('Insufficient permissions. Only the host or admin can start recording.');
      break;
    case 101072:
      console.error('Recording configuration missing or not enabled. Please check your console setup.');
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
      console.error('Backend system error. Please try again later.');
      break;
    case 100002:
      console.error('Parameter error. Please check the input parameters.');
      break;
    case 100004:
      console.error('Room does not exist. Please make sure you have entered the room before starting recording.');
      break;
    case 100006:
      console.error('Insufficient permissions. Only the host or admin can start recording.');
      break;
    case 101072:
      console.error('Recording configuration missing or not enabled. Please check your console setup.');
      break;
    default:
      console.error('Failed to start recording:', error);
  }
}
```

## Step 2: Stop Cloud Recording

### Prerequisite

There must be an active recording task in the room (`RecordingStatus.Recording`).

### Permission Requirements

Only the **host or admin** can call `stopRecording()`.

### Sample Code

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

## Step 3: Monitor Recording Status Changes

### Prerequisite
- Successfully entered the room.

- Subscribe to events immediately after entering the room to avoid missing notifications, especially if recording is started from another client (such as a mobile host).

### Sample Code

【Vue3】
``` typescript
import { useRoomState, RecordingStatus, RecordingStopReason, RoomEvent } from 'tuikit-atomicx-vue3/room';

const { currentRoom, subscribeEvent } = useRoomState();

// Check current recording status
const isRecording = currentRoom.value?.recordingInfo?.status === RecordingStatus.Recording;

// Listen for recording start
subscribeEvent(RoomEvent.onRecordingStarted, ({ operator }) => {
  console.log('Recording started. Operator:', operator.userId);
});

// Listen for recording stop
subscribeEvent(RoomEvent.onRecordingStopped, ({ operator, reason }) => {
  if (reason === RecordingStopReason.StoppedByUser) {
    console.log('Recording stopped. Operator:', operator.userId);
  } else if (reason === RecordingStopReason.RecorderLeftRoom) {
    console.warn('Recording interrupted. The recording bot exited the room. Please restart recording if needed.');
  }
});
```

【React】
``` typescript
import { useRoomState, RecordingStatus, RecordingStopReason, RoomEvent } from 'tuikit-atomicx-react/room';

const { currentRoom, subscribeEvent } = useRoomState();

// Check current recording status
const isRecording = currentRoom?.recordingInfo?.status === RecordingStatus.Recording;

// Listen for recording start
subscribeEvent(RoomEvent.onRecordingStarted, ({ operator }) => {
  console.log('Recording started. Operator:', operator.userId);
});

// Listen for recording stop
subscribeEvent(RoomEvent.onRecordingStopped, ({ operator, reason }) => {
  if (reason === RecordingStopReason.StoppedByUser) {
    console.log('Recording stopped. Operator:', operator.userId);
  } else if (reason === RecordingStopReason.RecorderLeftRoom) {
    console.warn('Recording interrupted. The recording bot exited the room. Please restart recording if needed.');
  }
});
```

### Error Scenarios

The `reason` field in the `onRecordingStopped` event explains why recording stopped:

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|`RecordingStopReason.StoppedByUser`|`0`|Host or admin manually called `stopRecording()` to end recording.|
|`RecordingStopReason.RecorderLeftRoom`|`1`|The recording bot exited the room unexpectedly, causing the recording to stop. Notify the user and restart recording if needed.|

> **Note:**
> - Cloud recording requires package purchase, activation of storage services, and ticket configuration. Make sure all prerequisites are complete.
> - Recording files are stored in the Cloud VOD (VOD) or Object Storage (COS) you configured. Manage your recording files in the respective console.

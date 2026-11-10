---
sync_node_id: '224180896228143104'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "更多功能"
  - "云端录制"
  - "云端录制（Android）"
product: "room"
---
This document provides guidance for developers on implementing cloud recording in the standard Conference SDK without UI integration. Use the `RoomStore` methods startRecording and stopRecording to control the start and stop of cloud recording. You can monitor real-time recording status through `currentRoom.recordingInfo` and `RoomListener`.

> **Version Notes:**
> 
> Cloud recording APIs (startRecording / stopRecording) are available starting from **rtc_room_engine** and **atomicx-core version 4.2.3.74**. Please confirm your SDK version meets this requirement.
> 

## Prerequisites
- Complete user authentication with `LoginStore`. See Integration Overview.

- Enter a standard conference room using `RoomStore`. See Room Management.

- Activate the cloud recording package and configure file storage:

   - Purchase a video conference SDK package that includes cloud recording.

   - Enable file storage for recordings. Recording files can be stored in Video on Demand (VOD), Object Storage (COS), or AWS S3. Activate one of these services in the corresponding product console and record the storage details.

   - On the [Real-Time Communication Console Configuration Page](https://console.trtc.io/conference-configuration), select your target application at the top and click **Configure**.

      

      On the recording configuration page, enter the following information based on your chosen storage method:

      - **Store to VOD**: Account UIN and VOD Application AppID.

      - **Store to COS**: Bucket name, Region, AccessKey (SecretId), and SecretKey.

      - **Store to AWS S3**: Bucket name, [Region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions) (example: `ap-southeast-1`), AWS Access Key ID, and AWS Secret Access Key.

## Recording Effects

The Conference SDK uses **mixed-stream recording** by default, merging all published audio/video streams in the room into a single recording file. The mixed-stream layout automatically adapts based on the room status, and the recording task continues uninterrupted during layout changes.

|**In-room Status**|**Mixed-stream Layout**|**Maximum Video Streams**|
|---------|---------|---------|
|No screen sharing / whiteboard|Grid layout|Up to **25** video streams|
|Screen sharing / whiteboard|Screen sharing layout (shared screen as primary image)|Up to **1** screen sharing + **16** video streams|
|Audio only|-|-|

## API Description

The Conference SDK without UI provides methods to control recording and subscribe to recording status via `RoomStore`. The server manages the recording task; the client is responsible for starting and stopping recording only.

|Type|Name|Description|
|---------|---------|---------|
|Method|`startRecording()`|Starts cloud recording. Only the **room owner or administrator** can call this method, and it must be invoked after entering the room.|
|Method|`stopRecording()`|Stops cloud recording. Only the **room owner or administrator** can call this method.|
|Status|`currentRoom.recordingInfo`|Provides recording information for the current room, including the `status` field (`RecordingStatus.RECORDING` means recording is active).|
|Event|`RoomListener.onRecordingStarted`|Fired when recording starts successfully. Callback parameters: `(roomInfo, operator)`.|
|Event|`RoomListener.onRecordingStopped`|Fired when recording stops. Callback parameters: `(roomInfo, operator, reason)`, which distinguishes between manual stop and unexpected interruption.|

## Step 1: Start Cloud Recording

### Permission Requirements

Only the **room owner or administrator** can call `startRecording()`. Calls from other roles will trigger a permission error. Only one recording task is allowed per room at any time; repeated calls will result in an error.

### Sample Code
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private fun startRecording() {
    RoomStore.shared().startRecording(completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.i("TAG", "Recording started successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.i("TAG","Recording failed: code=$code, desc=$desc")
        }
    })
}
```

### Error Handling

If `startRecording()` fails, an error code is returned. Common error scenarios include:

|Error Code|Meaning|Recommended Action|
|---------|---------|---------|
|`100001`|Backend system error|Retry later; if the issue persists, submit a support ticket for troubleshooting.|
|`100004`|Room does not exist|Confirm the room was entered using `createAndJoinRoom()` or `joinRoom()` before calling the recording API.|
|`100006`|No permission, must be room owner or administrator|Check the user's role; only room owner or administrator can start recording.|
|`101072`|Recording configuration missing or not enabled|Complete package activation, ticket configuration, and enable value-added features in the console. See Prerequisites.|

``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private fun startRecording() {
    RoomStore.shared().startRecording(completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.i("TAG", "Recording started successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            when (code) {
                100001 -> Log.e("TAG", "Backend system error, please try again later.")
                100004 -> Log.e("TAG", "Room does not exist, please ensure you have entered the room before starting recording.")
                100006 -> Log.e("TAG", "Insufficient permissions, only the room owner or administrator can initiate recording.")
                101072 -> Log.e("TAG", "Recording configuration does not exist or is not enabled, please check your console configuration.")
                else -> Log.e("TAG", "Failed to start recording:")
            }
        }
    })
}
```

## Step 2: Stop Cloud Recording

### Prerequisite

A recording task must be active in the current room (`RecordingStatus.RECORDING`).

### Permission Requirements

Only the **room owner or administrator** can call `stopRecording()`.

### Sample Code
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

private fun stopRecording() {
    RoomStore.shared().stopRecording(object : CompletionHandler {
        override fun onSuccess() {
            Log.i("TAG", "Recording stopped successfully")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.i("TAG", "Failed to stop recording: code=$code, desc=$desc")
        }
    })
}
```

## Step 3: Monitor Recording Status Changes

### Prerequisite
- Enter the room successfully.

- Subscribe to events before entering the room to ensure you receive notifications for recording actions initiated by other clients (e.g., room owner on mobile).

### Sample Code
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.room.RecordingStatus
import io.trtc.tuikit.atomicxcore.api.room.RecordingStopReason
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomUser

private fun observeRecordingState() {
    val roomStore = RoomStore.shared()

    // Query current recording status
    val currentRoom = roomStore.state.currentRoom.value
    val isRecording = currentRoom?.recordingInfo?.status == RecordingStatus.RECORDING

    // Listen for recording events
    roomStore.addRoomListener(object : RoomListener() {
        override fun onRecordingStarted(roomInfo: RoomInfo, operator: RoomUser) {
            Log.i("TAG", "Recording started, operator: ${operator.userID}")
        }

        override fun onRecordingStopped(
            roomInfo: RoomInfo,
            operator: RoomUser,
            reason: RecordingStopReason
        ) {
            when (reason) {
                RecordingStopReason.STOPPED_BY_USER -> {
                    Log.i("TAG", "Recording stopped, operator: ${operator.userID}")
                }
                RecordingStopReason.RECORDER_LEFT_ROOM -> {
                    Log.w("TAG", "Recording interrupted unexpectedly. Recording Bot exited the room. Please restart recording if needed.")
                }
            }
        }
    })
}
```

### Error Scenarios

The `reason` parameter in the `onRecordingStopped` event indicates why recording stopped:

|Enum Value|Description|
|---------|---------|
|`STOPPED_BY_USER`|Room owner or administrator manually called `stopRecording()`; normal stop.|
|`RECORDER_LEFT_ROOM`|Recording Bot exited the room unexpectedly, recording was interrupted. Notify users and decide whether to restart recording based on your use case.|

> **Note:**
> - Cloud recording requires package purchase, activation of storage services, and ticket configuration. Make sure all steps in Prerequisites are completed.
> - Recording files are stored in your Cloud VOD or COS configuration. Visit the console to view and manage recorded files.

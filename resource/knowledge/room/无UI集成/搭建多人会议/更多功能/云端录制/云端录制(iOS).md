---
sync_node_id: '224180912133521408'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "更多功能"
  - "云端录制"
  - "云端录制（iOS）"
product: "room"
---
This document provides guidance for developers on enabling cloud recording in the standard Conference SDK using a UI-less integration. You can control the start and stop of recording with `RoomStore` via startRecording and stopRecording. To monitor real-time recording status changes, use `currentRoom.recordingInfo` and subscribe to `RoomEvent`.

> **Version Notice:**
> 
> The cloud recording APIs (startRecording / stopRecording) are available starting with **AtomicXCore** and **RTCRoomEngine** version **4.2.3**. Please verify your SDK version meets this requirement.
> 

## Prerequisites
- Complete login authentication using `LoginStore`. See Integration Overview.

- Enter a standard conference room via `RoomStore`. See Room Management.

- Activate the cloud recording package and configure storage:

   - Purchase a video conferencing SDK package that includes cloud recording capabilities.

   - Enable file storage for recordings. Recording files can be stored in Video on Demand (VOD), Object Storage (COS), or AWS S3. Activate one of these services in the corresponding product console and record the storage details.

   - On the [Real-Time Communication Console Configuration Page](https://console.trtc.io/conference-configuration), select your target application at the top and click **Configure**.

      

      On the recording configuration page, enter the following information based on your chosen storage method:

      - **Store to VOD**: Account UIN and VOD Application AppID.

      - **Store to COS**: Bucket name, Region, AccessKey (SecretId), and SecretKey.

      - **Store to AWS S3**: Bucket name, [Region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions) (example: `ap-southeast-1`), AWS Access Key ID, and AWS Secret Access Key.

## Recording Effects

The Conference SDK uses **mixed-stream recording** by default, which combines all published audio/video streams in the room into a single recording file. The mixed-stream layout automatically adjusts based on the meeting state, and switching layouts does not restart the recording task.

|**Meeting State**|**Mixed-stream Layout**|**Maximum Number of Video Streams**|
|---------|---------|---------|
|No screen sharing / whiteboard|Grid layout|Up to **25** video streams|
|Screen sharing / whiteboard|Screen sharing layout (shared content as Primary Image)|Up to **1** screen share + **16** video streams|
|Audio only|-|-|

## API Description

The Conference SDK UI-less integration enables recording control and status subscription through `RoomStore`. The recording task is managed entirely by the server; the client only starts or stops recording.

|Type|Name|Description|
|---------|---------|---------|
|Method|`startRecording()`|Starts cloud recording. Only the **room owner or administrator** can call this method. Must be called after successfully entering the room.|
|Method|`stopRecording()`|Stops cloud recording. Only the **room owner or administrator** can call this method.|
|State|`currentRoom.recordingInfo`|Retrieves recording information for the current room, including the `status` field (`RecordingStatus.recording` indicates recording is in progress).|
|Event|`RoomEvent.onRecordingStarted`|Triggered when recording starts successfully. Callback parameters: `(roomInfo, operator)`.|
|Event|`RoomEvent.onRecordingStopped`|Triggered when recording stops. Callback parameters: `(roomInfo, operator, reason)` to distinguish between manual stop and abnormal interruption.|

## Step 1: Start Cloud Recording

### Permission Requirements

Only the **room owner or administrator** can call `startRecording()`. Calls from other roles result in a permission error. Only one recording task can run in a room at a time; duplicate calls will return an error.

### Sample Code
``` swift
import AtomicXCore

private func startRecording() {
    RoomStore.shared.startRecording { result in
        switch result {
        case .success:
            print("Recording started successfully")
        case .failure(let error):
            print("Failed to start recording: code=\(error.code), desc=\(error.message)")
        }
    }
}
```

### Error Handling

If `startRecording()` fails, it throws an error. Common error scenarios include:

|**Error Code**|**Meaning**|**Recommended Action**|
|---------|---------|---------|
|`100001`|Backend system error|Retry later. If the issue persists, submit a support ticket for investigation.|
|`100004`|Room does not exist|Ensure you have entered the room using `createAndJoinRoom()` or `joinRoom()` before calling the API.|
|`100006`|No permission; must be room owner or administrator|Check the current user's role. Only the room owner or administrator can initiate recording.|
|`101072`|Recording configuration missing or not enabled|Ensure package activation, ticket configuration, and value-added features are enabled in the console. See Prerequisites.|

``` swift
import AtomicXCore

private func startRecording() {
    RoomStore.shared.startRecording { result in
        switch result {
        case .success:
            print("Recording started successfully")
        case .failure(let error):
            switch error.code {
            case 100001:
                print("Backend system error, please try again later.")
            case 100004:
                print("Room does not exist, please ensure you have entered the room before starting recording.")
            case 100006:
                print("Insufficient permissions, only the room owner or administrator can start recording.")
            case 101072:
                print("Recording configuration does not exist or is not enabled, please check your console settings.")
            default:
                print("Failed to start recording: \(error.message)")
            }
        }
    }
}
```

## Step 2: Stop Cloud Recording

### Prerequisite

A recording task is currently running in the room (`RecordingStatus.recording`).

### Permission Requirements

Only the **room owner or administrator** can call `stopRecording()`.

### Sample Code
``` swift
import AtomicXCore

private func stopRecording() {
    RoomStore.shared.stopRecording { result in
        switch result {
        case .success:
            print("Recording stopped successfully")
        case .failure(let error):
            print("Failed to stop recording: code=\(error.code), desc=\(error.message)")
        }
    }
}
```

## Step 3: Monitor Recording Status Changes

### Prerequisite
- You have entered the room.

- We recommend subscribing to events before entering the room to avoid missing recording notifications triggered by other clients (e.g., a mobile room owner).

### Sample Code
``` swift
import AtomicXCore
import Combine

private var cancellableSet = Set<AnyCancellable>()

private func observeRecordingState() {
    let roomStore = RoomStore.shared

    // Query current recording status
    let currentRoom = roomStore.state.value.currentRoom
    let isRecording = currentRoom?.recordingInfo.status == .recording

    // Subscribe to recording events
    roomStore.roomEventPublisher
        .sink { event in
            switch event {
            case .onRecordingStarted(let roomInfo, let operatorUser):
                print("Recording started, operator: \(operatorUser.userID)")
            case .onRecordingStopped(let roomInfo, let operatorUser, let reason):
                switch reason {
                case .stoppedByUser:
                    print("Recording stopped, operator: \(operatorUser.userID)")
                case .recorderLeftRoom:
                    print("Recording interrupted: Recording Bot has exited the room. Please restart recording if needed.")
                @unknown default:
                    break
                }
            default:
                break
            }
        }
        .store(in: &cancellableSet)
}
```

### Error Scenarios

The `reason` field in the `onRecordingStopped` event indicates why recording stopped:

|**Enum Value**|**Description**|
|---------|---------|
|`stoppedByUser`|Recording stopped manually by the room owner or administrator via `stopRecording()`.|
|`recorderLeftRoom`|Recording Bot exited the room unexpectedly, interrupting recording. Notify the user and consider restarting recording as needed.|

> **Note:**
> - Cloud recording requires package purchase, storage service activation, and ticket configuration. Make sure you have completed all steps in Prerequisites.
> - Recording files are saved in the Cloud VOD or COS you’ve configured. Visit the relevant console to view and manage your files.

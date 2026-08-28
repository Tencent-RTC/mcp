This document introduces the cloud recording feature of the Conference SDK. **The Conference SDK integrates mixed-stream room recording by default.** The room owner or administrator can start recording with one click through the client interface and the with-UI integration component, **without the customer building a backend** to call the TRTC cloud API. If the default recording capability does not meet your business needs, refer to Differences from TRTC cloud recording in this document, and refer to [TRTC cloud recording](https://cloud.tencent.com/document/product/647/76497) to integrate it yourself.

> **Note:**
> The Conference SDK cloud recording is implemented based on the [TRTC cloud recording](https://cloud.tencent.com/document/product/647/76497) capability, with typical mixed-stream recording parameters preset for meeting scenarios, helping you complete recording configuration more simply and quickly.
>

## Prerequisites

Before using Conference SDK cloud recording, confirm that you have completed the following steps:
- You have purchased a Conference SDK package that includes cloud recording capability and obtained the SDKAppID information.

- Enable the recording file storage service: Recording files can be stored in [Cloud VOD (VOD)](https://console.cloud.tencent.com/vod) or [Cloud Object Storage (COS)](https://console.cloud.tencent.com/cos). Complete the activation in the corresponding console and record the storage information.

- [Submit a ticket](https://console.cloud.tencent.com/workorder/category), select the **Real-Time Communication** product, and state that you need to configure cloud recording storage information (VOD or COS) for the Conference SDK.

## Feature description

The Conference SDK provides a **managed cloud recording** solution: The server is responsible for authentication and recording task management, and the customer only needs to configure the recording file storage address. Then, during a meeting, the room owner or administrator can start recording with one click through the client.

## Recording effect

The Conference SDK uses **mixed-stream recording** mode by default, mixing the audio and video streams published in the room into one complete recording file. The recording content includes:
- **Audio**: The voices of all participants in the room.

- **Video**: All views with the camera turned on or screen sharing.

   The recording layout **switches automatically** with the in-meeting state, and the recording task is **not restarted** during the switch:

   |In-meeting state|Mixed-stream layout|Maximum number of views|
   |---------|---------|---------|
   |No screen sharing / whiteboard|[Grid layout](https://cloud.tencent.com/document/product/647/76497#nine)|Up to **25** video views|
   |With screen sharing / whiteboard|[Screen sharing layout](https://cloud.tencent.com/document/product/647/76497#share) (sharing as the main view)|Up to **1** screen sharing / whiteboard + **16** video views|
   |Audio only|-|—|

## Obtaining files after the meeting

After recording ends, the files are stored in the VOD or COS you configured. You can obtain the recording files in the following ways:
- Go to [Real-Time Communication Console > Application Management](https://console.cloud.tencent.com/trtc/app), and view the recording files stored in Cloud VOD (VOD) under **Recording Management > Recording File Management**.

- If stored in Cloud Object Storage (COS), go to the [Cloud Object Storage (COS) console](https://console.cloud.tencent.com/cos) to view them.

- For details on finding, receiving, deleting, and playing back files, refer to [Recording file management](https://cloud.tencent.com/document/product/647/76497#file).

## Differences from TRTC cloud recording

Both Conference SDK room recording and TRTC cloud recording are based on the underlying TRTC cloud recording service. The SDK has preset mixed-stream recording parameters for meeting scenarios. If you need capabilities such as **specifying subscribed hosts, customizing the mixed-stream layout, or controlling recording start/stop from the server**, you can use TRTC cloud recording to integrate it yourself. The main differences are as follows:

|Comparison item|**Conference SDK room recording**|**TRTC cloud recording**|
|---------|---------|---------|
|Recording scope|Applicable to rooms created through the Conference SDK under the current SDKAppID.|Applicable to all TRTC rooms under the current SDKAppID (including rooms created directly by other SDKs or the TRTC SDK).|
|Start method|During a meeting, the room owner or administrator starts and stops recording with one click through the client interface / with-UI component.|Enable global auto-recording in the console, or have a self-built backend call the REST API (e.g. `CreateCloudRecording`) to control recording.|
|Recording files|By default, **mixed-stream recording** produces one mixed file; the layout switches automatically based on whether there is screen sharing / whiteboard in the meeting (grid layout up to 25 streams, screen sharing layout 1+16 streams).|Global auto-recording is **single-stream** (one file per host); the REST API method can choose single-stream or mixed-stream, and supports custom layouts and subscription lists.|
|Integration cost|Just submit a ticket to configure the storage address, **no self-built backend required**.|You need to configure a recording template in the TRTC console yourself, or integrate the REST API and callbacks.|

> **Note:**
> - The two solutions can be used at the same time, but this may produce multiple recording files and additional [costs](https://cloud.tencent.com/document/product/647/75047).
> - If you already use Conference SDK room recording, it is not recommended to also enable TRTC **global auto-recording**, to avoid recording the same room repeatedly.
> - For configuration and integration details, see [Implementing cloud recording and playback](https://cloud.tencent.com/document/product/647/76497).

## FAQs

### **Can multiple recording solutions be used at the same time?**

Multiple recording solutions do not conflict, and you can use multiple recording solutions at the same time, but this will produce multiple recording files and [costs](https://cloud.tencent.com/document/product/647/75047).

### How do I view the recording duration details?

You can view some recording duration details in [Real-Time Communication Console > Cloud Recording](https://console.cloud.tencent.com/trtc/cloudrecord):

### How do I manage recording files?

The current [recording file management](https://cloud.tencent.com/document/product/647/76497#file) mainly offers the following operations:

[Find recording files](https://cloud.tencent.com/document/product/647/76497#find_file), [Receive recording files](https://cloud.tencent.com/document/product/647/76497#receive_file), [Delete recording files](https://cloud.tencent.com/document/product/647/76497#delete_file), [Play back recording files](https://cloud.tencent.com/document/product/647/76497#record_file).

### How do I customize the recording file name?

Renaming recording files is not currently supported. Only [API recording](https://cloud.tencent.com/document/product/647/76497#API_record) supports customizing a file name prefix: When storing to Cloud VOD using [API recording](https://cloud.tencent.com/document/product/647/76497#API_record), you can customize the file name prefix through the UserDefineRecordId parameter in [TencentVod](https://cloud.tencent.com/document/api/647/44055#TencentVod). The prefix and the auto-generated recording file name are separated by `_UserDefine_u_`.

### More documentation
- [Implementing cloud recording and playback](https://cloud.tencent.com/document/product/647/76497)

- [Cloud recording server event callbacks](https://cloud.tencent.com/document/product/647/81113)

- [Cloud recording billing description](https://cloud.tencent.com/document/product/647/75047)

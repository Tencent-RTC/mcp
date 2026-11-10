---
sync_node_id: '89644531380961280'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "TRTC 云端录制说明"
product: "trtc"
---
For scenarios such as online education, live showroom, video conferencing, online medical consultation, and remote banking, it is often necessary to record entire video calls or live streaming sessions for purposes including content moderation, archiving, and playback. The on-cloud recording feature of TRTC can help meet these demands.

## Overview

The on-cloud recording feature of TRTC allows you to record an audio/video stream in real time using a RESTful API. It is flexible, light, and easy-to-use, saving you the trouble of deploying servers and recording modules.
- Recording mode: Single-stream recording records the audio and video of each user in a room separately, while mixed-stream recording records all audios and videos in a room into one result.

- Stream subscription: You can determine whose streams you receive or do not receive using an allowlist/blocklist.

- Transcoding parameters: In the mixed-stream recording mode, you can determine the output video quality by specifying transcoding parameters.

- Stream-mixing parameters: For mixed-stream recording, we offer multiple auto-arranged layout templates. You can also customize a layout template.

- File storage: Currently, you can save recording files only in Tencent Cloud COS or VOD.
(We plan to add support for storage and video-on-demand services of third-party cloud vendors in the future. To save files to third-party platforms, you will need to provide your cloud service account and the storage parameters.)

- Callback notification: By configuring a callback domain in the console, you can receive notifications about on-cloud recording events via your callback server.

### Single-stream recording

The diagram above shows the workflow of single-stream recording. In room 1234, anchor 1 and anchor 2 are publishing streams. If you subscribe to their streams and enable single-stream recording, the TRTC backend will record the audio and video data of anchor 1 and anchor 2 separately. The recording results will include:
1. An M3U8 index file of anchor 1's video

2. Multiple TS segment files of anchor 1's video

3. An M3U8 index file of anchor 1's audio

4. Multiple TS segment files of anchor 1's audio

5. An M3U8 index file of anchor 2's video

6. Multiple TS segment files of anchor 2's video

7. An M3U8 index file of anchor 2's audio

8. Multiple TS segment files of anchor 2's audio

   The backend will then upload the files to the cloud storage server you specify. You can download the files and merge/transcode them. We offer a [script for merging audio and video streams](https://intl.cloud.tencent.com/zh/document/product/647/45169#.E5.8D.95.E6.B5.81.E6.96.87.E4.BB.B6.E5.90.88.E5.B9.B6.E8.84.9A.E6.9C.AC).

### Mixed-stream recording

The above shows the workflow of mixed-stream recording. In room 1234, anchor 1 and anchor 2 are publishing streams. If you subscribe to their streams and enable mixed-stream recording, the TRTC backend will mix the streams of anchor 1 and anchor 2 according to the layout template you specify and then record them into one result, which will include:
1. An M3U8 index file of the mixed video

2. Multiple TS segment files of the mixed video

   The backend will then upload the files to the cloud storage server you specify. You can download the files and merge/transcode them. We offer a [script for merging audio and video streams](https://intl.cloud.tencent.com/zh/document/product/647/45169#.E5.8D.95.E6.B5.81.E6.96.87.E4.BB.B6.E5.90.88.E5.B9.B6.E8.84.9A.E6.9C.AC).

   > **Note:**
   > 
   > - The rate limit for the recording API is 20 calls per second.
   > - The timeout period for a query is six seconds.
   > - We allow up to 100 ongoing recording tasks at the same time. If you need to record more, please [submit a ticket](https://console.intl.cloud.tencent.com/workorder/category).
   > - In the single-stream recording mode, you can record up to 25 streams in a room at the same time.

## Auto-Recording

TencentRTC offers an auto-recording feature, eliminating the need for manual recording task management. To use this recording solution, go to  **Console**  > [Applications](https://console.trtc.io/app), select the desired application, and click  on the right side to enter the application information page. Then click  **Advanced Features** , enable on-cloud auto-recording, complete the global auto-recording template configuration, and submit it.

After it becomes effective (wait for 5-10 minutes for it to take effect), the publishing of audio and video by the anchors in the TRTC room will trigger the start of the recording task. The recording task will be triggered to stop after all the anchors have left the room and the set timeout period for resumption has been exceeded.

Before enabling the global auto-recording feature, configure the global auto-recording template. Global auto-recording supports single-stream recording (i.e., record a separate file for each anchor), and once enabled, it is only effective for newly created rooms. It does not apply to rooms created before the auto-recording feature was enabled.

Global single-stream recording supports audio and video recording, audio-only recording, and video-only recording. The recording file formats supported are MP4, HLS, and AAC (in audio-only recording format).
| Configuration Item | Description |
| --- | --- |
| Recording mode | - Single-stream recording: The video data of each anchor in the room will be saved as a separate file.<br>- To record the mixed video of multiple anchors, use Manual Merge Recording. |
| Recording type | - Audio and video: Both audio and video streams in the room are recorded, suitable for video calls and interactive live streaming scenarios.<br>- Audio-only: Only audio streams in the room are recorded. |
| File format | Supports MP4, HLS, and AAC (in audio-only format). |
| Max file duration | Specifies the segment duration of the recording file, with a range of 1-1,440 minutes. The default is 1,440 minutes. |
| Timeout period for resumption | Sets the timeout period for resuming recording in seconds. When the interruption interval does not exceed the set timeout period, a single call (or live stream) will generate only one file. However, the recording file will be received only after the timeout period for resumption expires.  <strong>The value range is 1 - 86,400 (default 30s)</strong> .<br><strong>Note: During the resumption waiting period, single-stream recording fees will be charged based on the audio duration. Please set it appropriately.</strong> |
| Storage | Supports storage to <a href="https://console.cloud.tencent.com/vod/media">Tencent Cloud Video on Demand (VOD)</a>, <a href="https://console.cloud.tencent.com/cos">Tencent Cloud Object Storage (COS)</a>, and <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions">AWS S3 Storage</a>.<br>VOD: Requires support for specifying the VOD application and the storage period of recording files in VOD, and binding VOD task flows.<br>COS & AWS: Requires completion of configuration for the corresponding bucket. Ensure you have the write permission to the bucket. |
| Callback address and callback key | The latest on-cloud recording service offers detailed recording event features. You can configure a server-side URL to receive recording callback events, and can also configure a callback key to verify the security of callback events. <a href="https://www.tencentcloud.com/zh/document/product/647/54914">More information available here</a>. |

>  **Note:**
> - In single-stream recording mode, each audio and video stream in the room will be recorded separately according to the push stream parameters, without the need of setting transcoding.
> - If the timeout period for resumption has not expired, the recording robot will continue to wait in the room for the anchor's publishing to complete the recording. The recording will not end immediately after the anchor leaves the room, so set the timeout period appropriately.
> - Single-stream recording can record the audio and video of up to 25 anchors in one room. If there are more than 25 anchors in the room, they will be sorted by the time they entered the room, and only the audio and video of the first 25 anchors will be recorded. (For single-stream recording of more than 25 anchors, see API recording).

## Manual Recording Process

### 1. Start recording

Call the RESTful API `CreateCloudRecording` from your server to start on-cloud recording. Pay attention to the following parameters:

#### TaskId

This parameter uniquely identifies a recording task. Note it as you will need to provide it for other actions on the same task later.

#### RecordMode
- Single-stream recording separately records the audios and videos of the anchors you subscribe to and uploads the recording files (including M3U8 and TS segment files) to the cloud.

- Mixed-stream recording records all the audios and videos of the anchors you subscribe to into one result and uploads the recording files (including M3U8 and TS segment files) to the cloud.

#### SubscribeStreamUserIds

By default, on-cloud recording records all the streams (max 25) you receive in a room. You can use this parameter to specify whose streams you want to record and can change its value during recording.

#### StorageParams

You can use this parameter to specify the cloud storage/video-on-demand service you want to save recording files to. Make sure you use a valid value and that the cloud storage/video-on-demand service you use is available. Below are the naming conventions of recording files:

##### Naming of recording files
- M3U8 file in the single-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>__UserId_s_<UserId>__UserId_e_<MediaId>_<Type>.m3u8

- TS segment file in the single-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>__UserId_s_<UserId>__UserId_e_<MediaId>_<Type>_<UTC>.ts

- MP4 file in the single-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>__UserId_s_<UserId>__UserId_e_<MediaId>_<Index>.mp4

- M3U8 file in the mixed-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>.m3u8

- TS segment file in the mixed-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>_<UTC>.ts

- MP4 file in the mixed-stream recording mode:
<Prefix>/<TaskId>/<SdkAppId>_<RoomId>_<Index>.mp4

- Naming of recovered files
The on-cloud recording feature has a high availability scheme that can recover recording files if the server fails. To prevent the recovered files from replacing the original files, we add a prefix `ha<1/2/3>` to the names of recovered files. The numbers indicate the times (max 3) the high availability scheme is used.

- M3U8 file in the single-stream recording mode:
<Prefix>/<TaskId>/ha<1/2/3>_<SdkAppId>_<RoomId>__UserId_s_<UserId>__UserId_e_<MediaId>_<Type>.m3u8

- TS segment file in the single-stream recording mode:
<Prefix>/<TaskId>/ha<1/2/3>_<SdkAppId>_<RoomId>__UserId_s_<UserId>__UserId_e_<MediaId>_<Type>_<UTC>.ts

- M3U8 file in the mixed-stream recording mode:
<Prefix>/<TaskId>/ha<1/2/3>_<SdkAppId>_<RoomId>.m3u8

- TS segment file in the mixed-stream recording mode:
<Prefix>/<TaskId>/ha<1/2/3>_<SdkAppId>_<RoomId>_<UTC>.ts

#### Field description

<Prefix>: The filename prefix. If this is not specified, the filename will not have a prefix.
<TaskId>: The task ID, which is unique and is returned by the start recording API.
<SdkAppId>: The application ID.
<RoomId>: The room ID.
<UserId>: The Base64-encoded ID of a user whose stream is recorded.
<MediaId>: Whether the primary stream (`main`) or substream (`aux`) is recorded.
<Type>: The type of stream that is recorded (`audio` or `video`).
<UTC>: The recording start time (UTC+0), which consists of the year, month, day, hours, minutes, seconds, and milliseconds.
<Index>: The index of a segment, which starts from 1. This field is used only if an MP4 file exceeds 2 GB or 24 hours and needs to be segmented.
ha<1/2/3>: The prefix for a file recovered by the high availability scheme. For example, if the scheme is used for the first time, the recovered file is named `<Prefix>/<TaskId>/ha1_<SdkAppId>_<RoomId>.m3u8`.

> **Note:**
>  If \<RoomId> is a string, it will be encoded into Base64. In the result, "/" is replaced with "-" and "=" is replaced with "."
<UserId> is encoded into Base64. In the result, "/" is replaced with "-" and "=" is replaced with "."
> 

#### Recording start time

Recording starts when you start receiving data from an anchor. Recording start time is the Unix time on the server when recording starts.
You can query the start time of a recording task in three ways:
- Via the `DescribeCloudRecording` API. The response parameter `BeginTimeStamp` indicates the recording start time (ms).

   Below is a response of the `DescribeCloudRecording` API, in which `BeginTimeStamp` is `1622186279144`.

   ``` json
   {
     "Response": {
       "Status": "xx",
       "StorageFileList": [
         {
           "TrackType": "xx",
           "BeginTimeStamp": 1622186279144,
           "UserId": "xx",
           "FileName": "xx"
         }
       ],
       "RequestId": "xx",
       "TaskId": "xx"
     }
   }
   ```
- Via the #EXT-X-TRTC-START-REC-TIME directive of the M3U8 file

   According to the M3U8 file below, the Unix time (ms) when recording started was 1622425551884.

   ``` m3u8
   #EXTM3U
   #EXT-X-VERSION:3
   #EXT-X-ALLOW-CACHE:NO
   #EXT-X-MEDIA-SEQUENCE:0
   #EXT-X-TARGETDURATION:70
   #EXT-X-TRTC-START-REC-TIME:1622425551884
   #EXT-X-TRTC-VIDEO-METADATA:WIDTH:1920 HEIGHT:1080
   #EXTINF:12.074
   1400123456_12345__UserId_s_MTY4NjExOQ..__UserId_e_main_video_20330531094551825.ts
   #EXTINF:11.901
   1400123456_12345__UserId_s_MTY4NjExOQ..__UserId_e_main_video_20330531094603825.ts
   #EXTINF:12.076
   1400123456_12345__UserId_s_MTY4NjExOQ..__UserId_e_main_video_20330531094615764.ts
   #EXT-X-ENDLIST
   ```
- Via a recording callback

   If you have registered recording callbacks, you will receive a callback for the generation of recording files (event type 307), in which `BeginTimeStamp` indicates the recording start time.
According to the callback below, the Unix time (ms) when recording started was 1622186279144.

   ``` json
   {
           "EventGroupId": 3,
           "EventType":    307,
           "CallbackTs":   1622186289148,
           "EventInfo":    {
                   "RoomId":       "xx",
                   "EventTs":      "1622186289",
                   "UserId":       "xx",
                   "TaskId":       "xx",
                   "Payload":      {
                           "FileName":     "xx.m3u8",
                           "UserId":       "xx",
                           "TrackType":    "audio",
                           "BeginTimeStamp":       1622186279144
                   }
           }
   }
   ```

#### MixWatermark

TRTC allows you to watermark videos during mixed-stream recording. You can add up to 25 watermarks to a video in your desired positions.

|Field|Description|
|---------|---------|
|Top|The vertical offset of the watermark to the top left corner of the video.|
|Left|The horizontal offset of the watermark to the top left corner of the video.|
|Width|The watermark width.|
|Height|The watermark height.|
|url|The URL of the watermark file.|

#### MixLayoutMode

TRTC supports the grid layout (default), floating layout, screen sharing layout, and custom layout.

##### Grid layout

The videos of anchors are scaled and positioned automatically according to the total number of anchors in a room. Each video has the same size. Up to 25 videos can be displayed.
- When there is only one video:
The video is scaled to fill the canvas.

- When there are two videos:
The width of each video is half of the canvas width.
The height of each video is the same as the canvas height.

- When there are three or four videos:
The canvas is split evenly into four windows and each video is displayed in one window.

- When there are 5-9 videos:
The canvas is split evenly into nine windows and each video is displayed in one window.

- When there are 10-16 videos:
The canvas is split evenly into 16 windows and each video is displayed in one window.

- When there are more than 16 videos:
The canvas is split evenly into 25 windows and each video is displayed in one window.

   

##### Floating layout

By default, the video of the first anchor in the room (you can also specify an anchor) is scaled to fill the screen. When other anchors enter the room, their videos appear smaller and float over the large video from left to right starting from the bottom of the canvas. If the total number of videos is 17 or less, there will be four windows in each row (4 x 4); if it is greater than 17, there will be five windows in each row (5 x 5). Up to 25 videos can be displayed. A user who publishes only audio will still be displayed in one window.
- When there are 17 or fewer videos:
 The width and height of each small video are 23.5% of the canvas width and height.
 The horizontal space and vertical space between two neighboring videos are 1.2% of the canvas width and height.
 The right and left margins are 1.2% of the canvas width and the top and bottom margins are 1.2% of the canvas height.

- When there are more than 17 videos:
 The width and height of each small video are 18.8% of the canvas width and height.
 The horizontal space and vertical space between two neighboring videos are 1% of the canvas width and height.
 The right and left margins are 1% of the canvas width and the top and bottom margins are 1% of the canvas height.

   

##### Screen sharing layout

The video of a specified anchor occupies a larger part of the canvas on the left side (if you do not specify an anchor, the left window will display the canvas background). The videos of other anchors are smaller and are positioned on the right side. If the total number of videos is 17 or less, the small videos are positioned from top to bottom in up to two columns on the right side, with eight videos per column at most. If there are more than 17 videos, the additional videos are positioned at the bottom of the canvas from left to right. Up to 24 videos can be displayed. A user who publishes only audio will still be displayed in one window.
- When there are five or fewer videos:
The size of each small video on the right is 1/5 the canvas width and 1/4 the canvas height.
The width of the large video on the left is 4/5 the canvas width, and its height is the same as the canvas height.

- When there are six or seven videos:
The size of each small video on the right are 1/7 the canvas width and 1/6 the canvas height.
The width of the large video on the left is 6/7 the canvas width, and its height is the same as the canvas height.

- When there are eight or nine videos:
The size of each small video on the right is 1/9 the canvas width and 1/8 the canvas height.
The width of the large video on the left is 8/9 the canvas width, and its height is the same as the canvas height.

- When there are 10-17 videos:
The size of each small video on the right side is 1/10 the canvas width and 1/8 the canvas height.
The width of the large video on the left side is 4/5 the canvas width, and its height is the same as the canvas height.

- When there are more than 17 videos:
The size of each small video on the right and bottom is 1/10 the canvas width and 1/8 the canvas height.
The width of the large video on the left is 4/5 the canvas width, and its height is 7/8 the canvas height.

   

##### Custom layout

You can also use `MixLayoutList` to customize a layout for anchor videos.

### 2. Query the recording task

You can use the `DescribeCloudRecording` API to query the status of an ongoing recording task. If the queried task has already ended, an error will be returned.
The file list (`StorageFile`) that is returned will include all the M3U8 files of the recording as well as the Unix time when recording started. If the task queried is a recording to VOD task, the `StorageFile` returned will be empty.

### 3. Modify recording parameters

You can use the `ModifyCloudRecording` API to modify recording parameters, including `SubscribeStreamUserIds` and `MixLayoutParams` (valid only for mixed-stream recording). Note that you need to specify all the parameters, including `MixLayoutParams` and `SubscribeStreamUserIds`, and not just the ones you want to modify. We recommend you note all the parameter values before a modification, or you will need to calculate them again.

### 4. Stop recording

You can call the `DeleteCloudRecording` API to stop recording. A recording task will also end automatically if there are no anchors (whether they are publishing data or not) in a room for longer than the specified time period (`MaxIdleTime`). We recommend you call the API to stop recording when you no longer need the service.

## Advanced Features

### Recording in MP4 format

To record in MP4 format, set `OutputFormat` to `hls+mp4` when calling the `CreateCloudRecording` API. TRTC will still record in HLS format, but once recording ends, it will download the HLS file from the COS bucket where it is saved, convert it into MP4 format, and upload the MP4 file to the COS bucket.
Please note that COS download access is required for the above to work.
An MP4 file will be segmented if one of the following conditions is met.
1. The recording duration is longer than 24 hours.

2. The MP4 file exceeds 2 GB.
The workflow is as follows:

### Recording to VOD

To record to VOD, specify the `CloudVod` parameter in `StorageParams` when calling the `CreateCloudRecording` API. After recording ends, the backend will save the file in MP4 format to VOD using the method you specify and send you a playback URL via a callback. In the single-stream recording mode, there will be a playback URL for each anchor whose stream is recorded; in the mixed-stream recording mode, there will be only one playback URL. When you record to VOD, pay attention to the following:
1. `CloudVod` and `CloudStorage` are mutually exclusive. If you specify both, the recording task will fail to start.

2. If you use `DescribeCloudRecording` to query a recording to VOD task, the `StorageFile` returned will be empty.
The figure below shows the workflow of recording to VOD. "Internal cloud storage" refers to the internal storage of the recording backend.

### Script for merging single-stream recording files

We offer a [script](https://trtc-partner-sg-1253488539.cos.ap-singapore.myqcloud.com/media-file-toolkit.zip) for merging single-stream audio and video files into MP4 files.

> **Note:**
>  If two segment files are more than 15 seconds apart, during which no audio or video data is recorded (if the substream is disabled, its data will be ignored), the two segments will be considered to belong to different sections, one being the ending segment of the previous section, and the other the starting segment of the next section.
> 

- Section-based merge (`-m 0`)
In this mode, the recording files of each user (`UserId`) are merged by section. One MP4 file is generated for each section.

- User-based merge (`-m 1`)
In this mode, the recording files of each user (`UserId`) are merged into one MP4 file. You can use the `-s` option to specify whether to fill in the blanks between sections.

#### Environment Requirements

Python 3
- Centos: sudo yum install python3

- Ubuntu: sudo apt-get install python3

   Python 3 dependency

   ``` bash
   sortedcontainers: pip3 install sortedcontainers
   ```

#### Directions

 1. Run the merge script `python3 TRTC_Merge.py [option]`.
 2. An MP4 file will be generated in the directory of the recording files.
Example: python3 TRTC_Merge.py -f /xxx/file -m 0

Below is a list of the options:
| Parameter | Description |
| --- | --- |
| -f | The directory of the recording files to be merged. If there are multiple users (<code>UserId</code>), their recording files will be merged separately. |
| -m | <code>0</code>: Section-based merge (default). In this mode, the recording files of each user (<code>UserId</code>) are merged by section. Multiple files may be generated for each user.<br><code>1</code>: User-based merge. In this mode, the recording files of each user (<code>UserId</code>) are merged into one file. |
| -s | Whether to delete the blanks between sections in the user-based merge mode. If they are deleted, the files generated will be shorter than the recording duration. |
| -a | <code>0</code>: Primary stream merge (default). The audio of a user (<code>UserId</code>) is merged with the user's primary stream, not the substream.<br><code>1</code>: Automatic merge. If a user (<code>UserId</code>) has a primary stream, the user's audio is merged with the primary stream; if not, it is merged with the substream.<br><code>2</code>: Substream merge. The audio of a user (<code>UserId</code>) is merged with the user's substream, not the primary stream. |
| -p | The frame rate (fps) of the output video, which is <code>15</code> by default. Value range: 5-120. If you enter a value smaller than <code>5</code>, <code>5</code> will be used; if you enter a value greater than <code>120</code>, <code>120</code> will be used. |
| -r | The resolution of the output video. For example, <code>-r 640 360</code> indicates that the resolution of the output video is 640 x 360. |

**File Naming**
- Audio-video file: UserId_timestamp_av.mp4

- Audio-only file: UserId_timestamp.m4a

   > **Note:**
   > 
   > `UserId` is the Base64-encoded ID of a user whose stream is recorded. For details, see the naming of recording files. `timestamp` is the starting time of the first TS segment of a section.
   > 

## Callback APIs

You can register callbacks by providing an HTTP/HTTPS gateway to receive callbacks. When an on-cloud recording event occurs, the system will send a callback notification to your callback server.

### Callback format

Callbacks are sent to your server in the form of HTTP/HTTPS POST requests.
Character encoding: UTF-8
Request: The request body is in JSON format.
Response: HTTP STATUS CODE = 200. The server ignores the content of the response packet. For protocol-friendliness, we recommend adding `JSON:` {"code":0}`` to the response.

### Parameter description

The header of a callback contains the following fields.

|Field|Description|
|---------|---------|
|Content-Type|application/json|
|Sign|The signature.|
|SdkAppId|The application ID.|

The body of a callback contains the following fields.

|Field|Type|Description|
|---------|---------|---------|
|EventGroupId|Number|The event group ID, which is `3` for on-cloud recording.|
|EventType|Number|The event type.|
|CallbackTs|Number|The Unix timestamp (ms) when the callback was sent to your server.|
|EventInfo|JSON Object|The event information.|

Event types

|Field|Type|Description|
|---------|---------|---------|
|EVENT_TYPE_CLOUD_RECORDING_RECORDER_START|301|On-cloud recording - The recording module was started.|
|EVENT_TYPE_CLOUD_RECORDING_RECORDER_STOP|302|On-cloud recording - The recording module was stopped.|
|EVENT_TYPE_CLOUD_RECORDING_UPLOAD_START|303|On-cloud recording - The upload module was started.|
|EVENT_TYPE_CLOUD_RECORDING_FILE_INFO|304|On-cloud recording - The first M3U8 file was generated and uploaded successfully.|
|EVENT_TYPE_CLOUD_RECORDING_UPLOAD_STOP|305|On-cloud recording - The files are uploaded.|
|EVENT_TYPE_CLOUD_RECORDING_FAILOVER|306|On-cloud recording - The recording task was migrated.|
|EVENT_TYPE_CLOUD_RECORDING_FILE_SLICE|307|On-cloud recording - An M3U8 file was generated (the first TS segment was generated).|
|EVENT_TYPE_CLOUD_RECORDING_UPLOAD_ERROR|308|On-cloud recording - The upload module encountered an error.|
|EVENT_TYPE_CLOUD_RECORDING_DOWNLOAD_IMAGE_ERROR|309|On-cloud recording - An error occurred when downloading the image decoding file.|
|EVENT_TYPE_CLOUD_RECORDING_MP4_STOP|310|On-cloud recording - An MP4 recording task is finished. The callback includes the name and other details of the MP4 file generated.|
|EVENT_TYPE_CLOUD_RECORDING_VOD_COMMIT|311|On-cloud recording - The recording files were uploaded to VOD.|
|EVENT_TYPE_CLOUD_RECORDING_VOD_STOP|312|On-cloud recording - A recording to VOD task is finished.|

Event information

|Field|Type|Description|
|---------|---------|---------|
|RoomId|String/Number|The room ID, which must be the same data type as the room ID on the client.|
|EventTs|Number|The Unix timestamp (seconds) when the event occurred.|
|UserId|String|The user ID of the recording robot.|
|TaskId|String|The ID of a recording task.|
|Payload|JsonObject|This parameter is defined differently for different event types.|

If the event type is `301` (EVENT_TYPE_CLOUD_RECORDING_RECORDER_START):

|Field|Type|Description|
|---------|---------|---------|
|Status|Number|`0`: The recording module was started successfully. `1`: Failed to start the recording module.|

``` json
{
        "EventGroupId": 3,
        "EventType":    301,
        "CallbackTs":   1622186275913,
        "EventInfo":    {
                "RoomId":       "xx",
                "EventTs":      "1622186275",
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0
                }
        }
}
```

If the event type is `302` (EVENT_TYPE_CLOUD_RECORDING_RECORDER_STOP):
| Field | Type | Description |
| --- | --- | --- |
| LeaveCode | Number | <code>0</code>: An API was called to stop the recording module.<br><code>1</code>: The recording robot was removed from the room.<br><code>2</code>: You closed the room.<br><code>3</code>: The server removed the recording robot from the room.<br><code>4</code>: The server closed the room.<br><code>99</code>: There were no anchors in the room, and the recording robot left after the specified time period elapsed.<br><code>100</code>: The room timed out.<br><code>101</code>: The recording robot was removed due to repeat entry by the same user. |

``` json
{
        "EventGroupId": 3,
        "EventType":    302,
        "CallbackTs":   1622186354806,
        "EventInfo":    {
                "RoomId":       "xx",
                "EventTs":      "1622186354",
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "LeaveCode":    0
                }
        }
}
```

If the event type is `303` (EVENT_TYPE_CLOUD_RECORDING_UPLOAD_START):
| Field | Type | Description |
| --- | --- | --- |
| Status | Number | <code>0</code>: The upload module was started successfully.<br><code>1</code>: Failed to start the upload module. |

``` json
{
        "EventGroupId": 3,
        "EventType":    303,
        "CallbackTs":   1622191965320,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191965,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0
                }
        }
}
```

If the event type is `304` (EVENT_TYPE_CLOUD_RECORDING_FILE_INFO):

|Field|Type|Description|
|---------|---------|---------|
|FileList|String|The name of the M3U8 file generated.|

``` json
{
        "EventGroupId": 3,
        "EventType":    304,
        "CallbackTs":   1622191965350,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191965,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "FileList":     "xx.m3u8"
                }
        }
}
```

If the event type is `305` (EVENT_TYPE_CLOUD_RECORDING_UPLOAD_STOP):
| Field | Type | Description |
| --- | --- | --- |
| Status | Number | <code>0</code>: The recording task is finished and all the files were uploaded to the specified cloud storage service.<br><code>1</code>: The recording task is finished, but at least one file is still on the server or in backup storage.<br><code>2</code>: The files on the server or in backup storage were uploaded to the specified cloud storage service. |

``` json
{
        "EventGroupId": 3,
        "EventType":    305,
        "CallbackTs":   1622191989674,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191989,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0
                }
        }
}
```

If the event type is `306` (EVENT_TYPE_CLOUD_RECORDING_FAILOVER):

|Field|Type|Description|
|---------|---------|---------|
|Status|Number|`0`: The migration was completed.|

``` json
{
        "EventGroupId": 3,
        "EventType":    306,
        "CallbackTs":   1622191989674,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191989,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0
                }
        }
}
```

If the event type is `307` (EVENT_TYPE_CLOUD_RECORDING_FILE_SLICE):

|Field|Type|Description|
|---------|---------|---------|
|FileName|String|The name of the M3U8 file.|
|UserId|String|The ID of the user whose streams were recorded.|
|TrackType|String|Valid values: `audio`, `video`, `audio_video`.|
|BeginTimeStamp|Number|The Unix timestamp (milliseconds) on the server when recording started.|

``` json
{
        "EventGroupId": 3,
        "EventType":    307,
        "CallbackTs":   1622186289148,
        "EventInfo":    {
                "RoomId":       "xx",
                "EventTs":      "1622186289",
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "FileName":     "xx.m3u8",
                        "UserId":       "xx",
                        "TrackType":    "audio",
                        "BeginTimeStamp":       1622186279144
                }
        }
}
```

If the event type is `308` (EVENT_TYPE_CLOUD_RECORDING_UPLOAD_ERROR):

|Field|Type|Description|
|---------|---------|---------|
|Code|String|The error code returned by the cloud storage service.|
|Message|String|The error message returned by the cloud storage service.|

``` json
{
  "Code": "InvalidParameter",
  "Message": "AccessKey invalid"
}

{
        "EventGroupId": 3,
        "EventType":    308,
        "CallbackTs":   1622191989674,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191989,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Code":       "xx",
                        "Message":    "xx"
                }
        }
}
```

If the event type is `309` (EVENT_TYPE_CLOUD_RECORDING_DOWNLOAD_IMAGE_ERROR):

|Field|Type|Description|
|---------|---------|---------|
|Url|String|The download URL.|

``` json
{
        "EventGroupId": 3,
        "EventType":    309,
        "CallbackTs":   1622191989674,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191989,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Url":       "http://xx",
                }
        }
}
```

If the event type is `310` (EVENT_TYPE_CLOUD_RECORDING_MP4_STOP):
| Field | Type | Description |
| --- | --- | --- |
| Status | Number | <code>0</code>: The MP4 recording task is finished and all the files were uploaded to the specified cloud storage service.<br><code>1</code>: The MP4 recording task is finished, but at least one file is still on the server or in backup storage.<br><code>2</code>: The MP4 recording task stopped due to an error (probably because the system failed to download the HLS files from COS). |
| FileList | Array | The names of the MP4 files generated. |
| FileMessage | Array | The information of the MP4 files generated. |
| FileName | String | The filename. |
| UserId | String | The user ID. In the mixed-stream recording mode, this field is empty. |
| TrackType | String | Valid values: <code>audio</code>, <code>video</code>, <code>audio_video</code>. |
| MediaId | String | Valid values: <code>main</code>, <code>aux</code>. |
| StartTimeStamp | Number | The Unix timestamp (milliseconds) when the MP4 file started. |
| EndTimeStamp | Number | The Unix timestamp (milliseconds) when the MP4 file ended. |

``` json
{
        "EventGroupId": 3,
        "EventType":    310,
        "CallbackTs":   1622191989674,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191989,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0,
                        "FileList": ["xxxx1.mp4", "xxxx2.mp4"],
                        "FileMessage": [
                                {
                                        "FileName": "xxxx1.mp4",
                                        "UserId": "xxxx",
                                        "TrackType": "audio_video",
                                        "MediaId":      "main",
                                        "StartTimeStamp": 1622186279145,
                                        "EndTimeStamp": 1622186282145
                                },
                                {
                                        "FileName": "xxxx2.mp4",
                                        "UserId": "xxxx",
                                        "TrackType": "audio_video",
                                        "MediaId":      "main",
                                        "StartTimeStamp": 1622186279153,
                                        "EndTimeStamp": 1622186282153
                                }
                        ]
                }
        }
}
```

If the event type is `311` (EVENT_TYPE_CLOUD_RECORDING_VOD_COMMIT):
| Field | Type | Description |
| --- | --- | --- |
| Status | Number | <code>0</code>: The recording file was successfully uploaded to VOD.<br><code>1</code>: The recording file is still on the server or in backup storage.<br><code>2</code>: An error occurred when uploading the recording file to VOD. |
| UserId | String | The user ID. In the mixed-stream recording mode, this field is empty. |
| TrackType | String | Valid values: <code>audio</code>, <code>video</code>, <code>audio_video</code>. |
| MediaId | String | Valid values: <code>main</code>, <code>aux</code>. |
| FileId | String | The ID of the recording file in VOD. |
| VideoUrl | String | The playback URL of the recording file in VOD. |
| CacheFile | String | The name of the MP4 file before it was uploaded to VOD. |
| Errmsg | String | The error message. This field is not empty if <code>status</code> is not <code>0</code>. |

A callback for successful upload:
``` json
{
        "EventGroupId": 3,
        "EventType":    311,
        "CallbackTs":   1622191965320,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191965,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0,
                        "TencentVod":   {
                            "UserId":       "xx",
                            "TrackType":    "audio_video",
                            "MediaId":      "main",
                            "FileId":       "xxxx",
                            "VideoUrl":     "http://xxxx"
                        }
                }
        }
}
```

A callback for failed upload:
``` json
{
        "EventGroupId": 3,
        "EventType":    311,
        "CallbackTs":   1622191965320,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191965,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       1,
                        "Errmsg":       "xxx",
                        "TencentVod":   {
                            "UserId":       "123",
                            "TrackType":    "audio_video",
                            "CacheFile":    "xxx.mp4"
                        }
                }
        }
}
```

If the event type is `312` (EVENT_TYPE_CLOUD_RECORDING_VOD_STOP):
| Field | Type | Description |
| --- | --- | --- |
| Status | Number | <code>0</code>: The recording to VOD task ended normally.<br><code>1</code>: The recording to VOD task ended due to an error. |

``` json
{
        "EventGroupId": 3,
        "EventType":    312,
        "CallbackTs":   1622191965320,
        "EventInfo":    {
                "RoomId":       "20015",
                "EventTs":      1622191965,
                "UserId":       "xx",
                "TaskId":       "xx",
                "Payload":      {
                        "Status":       0
                }
        }
}
```

## Best Practices

To ensure the high availability of the recording service, we recommend the following practices when you use the RESTful APIs:
1. Pay attention to the HTTP response after you call `CreateCloudRecording`. If your request fails, fix the problem according to the status code and try again.

   The status code consists of two parts, for example `InvalidParameter.SdkAppId`.

   - `InternalError.xxxxx` indicates that a server error occurred. You can retry until the request succeeds and `TaskId` is returned. We recommend you use the exponential backup algorithm for retry. For example, you can wait for three seconds for the first retry, six seconds for the second, 12 seconds for the third, and so on.

   - `InvalidParameter.xxxxx` indicates that a parameter value entered was invalid. Please check the parameter.

   - `FailedOperation.RestrictedConcurrency` indicates that you reached the maximum number (100 by default) of ongoing recording tasks allowed. To raise the limit, please contact technical support.

2. The `UserId` and `UserSig` you pass in when calling `CreateCloudRecording` are for the recording robot. Please make sure that they are different from those of other users in the room. In addition, the room joined by users from the TRTC client must be of the same type as the room you specify when calling the API. For example, if the room created in the TRTC SDK is a string, the room specified for on-cloud recording must also be a string.

3. You can obtain the information of a recording file in the following ways.

   - Call `DescribeCloudRecording` 15 seconds after a `CreateCloudRecording` request succeeds. If the task status is idle, it indicates that no audio or video data is available for recording. Please check whether there are anchors publishing data in the room.

   - After a `CreateCloudRecording` request succeeds, if there are anchors publishing data in the room, you can splice the names of the recording files according to the naming rules.

   - If you have registered on-cloud recording callbacks, the information of recording files will be sent to your server via callbacks.

   - You can specify a COS bucket to save recording files when calling the `CreateCloudRecording` API. After a recording task ends, you can find the recording files in the COS bucket you specify.

4. Make sure the validity period of the recording user's `UserSig` is longer than the duration of the recording task. This is to avoid cases where the high availability scheme fails to resume a recording task after a disconnection because the `UserSig` has expired.

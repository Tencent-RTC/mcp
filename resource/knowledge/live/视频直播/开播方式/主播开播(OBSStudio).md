---
sync_node_id: '176361764811608064'
nav_path:
  - "直播与语聊 SDK"
  - "视频直播"
  - "开播方式"
  - "主播开播（OBS Studio）"
product: "live"
---
This document explains how to use **OBS Studio** to stream external media sources into a LiveKit live room. This solution is ideal for scenarios such as game streaming, esports commentary, or broadcasting local video files.

## Obtain OBS Stream URL

Live offers two methods for obtaining the OBS stream URL to fit different development requirements.

### Method 1: Live Management System

This method is recommended for most production environments and development testing. Managing streams via a visual interface reduces maintenance overhead and enables rapid deployment.

#### Steps

Open the Live Management System (Vue3), create a new live room, and select "**Use OBS Streaming**" under **Streaming Method**. After the room is created, the **Server URL** and **Stream Key** will be displayed automatically.

### Method 2: Server APIs Integration

This method is suitable for highly customized live streaming scenarios where you want to implement a fully closed-loop workflow within your own system.

#### Step 1: Create Room and Bot
- Call the RESTful API to Create Room.

- Call the RESTful API to Add Bot. It is recommended to set the room owner ID as the bot's UserID.

#### Step 2: Bot Takes a Mic Seat

By default, the Live audience pulls streams from anchors. Call the RESTful API Bot Takes a Mic Seat to simulate the host taking a mic seat.

#### Step 3: Generate RTMP Stream URL

No additional API calls are needed. Assemble the stream URL directly on your server as follows:
``` html
rtmp://intl-rtmp.rtc.qq.com/push/{RoomID}?sdkappid={AppID}&userid={UserID}&usersig={UserSig}
```
- **Primary Domain**: `rtmp.rtc.qq.com`. The backup domain is `rtmp.cloud-rtc.com`. If the primary domain is unavailable, use the backup domain.

- **RoomID**: The RoomID created in Step 1.

- **UserID**: The bot UserID created in Step 2.

- **UserSig**: Must be valid. .

## Configure OBS Studio

Once you have the stream URL, configure **OBS Studio** as follows.

### Step 1: Set Server Information
- Click the **Controls** button in the bottom toolbar, then select **Settings** to open the settings panel.

- Go to **Stream** to configure server details.

   - **Service**: Choose **Custom**.

   - **Server and Stream Key**: Use the values obtained from the Obtain OBS Stream URL section.

      

### Step 2: Optimize Parameter Configuration

To deliver a low-latency, high-definition experience for your audience, adjust the following settings.

#### 1. Configure Video Parameters

Navigate to **Settings > Video**. . For game streaming, increasing the frame rate to 30 fps is recommended for smoother visuals:

|**Resolution**|**Frame Rate (fps)**|**Recommended Bitrate**|
|---------|---------|---------|
|1920x1080|24 fps|3000 kbps|
|1280x720|24 fps|2500 kbps|

#### 2. Configure Output Parameters

Go to **Settings > Output** and set **Output Mode** to **Advanced**. The RTMP backend does not support B-frame transmission. Adjust the parameters as follows:

|**Parameter**|**Recommended Value**|**Description**|
|---------|---------|---------|
|**Encoder**|`x264` or `NVIDIA NVENC`|Hardware encoding is preferred to reduce CPU usage.|
|**Keyframe Interval**|`1` or `2`|**Do NOT set to 0**; otherwise, stream pulling will be extremely slow.|
|**CPU Usage Preset**|`ultrafast`|Minimizes encoding time and reduces stuttering.|
|**Profile**|`baseline`|Removes B-frames for RTMP backend compatibility.|
|**Tune**|`zerolatency`|Optimized for live streaming, significantly reduces latency.|
|**x264 Options**|`threads=1`|Limits encoding threads to improve stream stability.|

### Step 3: Configure Advanced Options

Go to **Settings > Advanced** to ensure quick recovery during network fluctuations.
1. **Stream Delay**: Set to **Disabled**. Enabling this will greatly increase latency.

2. **Auto-Reconnect**: Enable this option.

- **Retry Delay**: Set to 2 seconds.

- **Maximum Retries**: Set to 20.

## Start OBS Live Streaming

### Start Streaming

Add a "Window Capture" or "Video Capture Device" source in the OBS Sources panel. After previewing and confirming your setup, click **Start Streaming**.

### End Streaming

**Step 1: Stop OBS Streaming**

In the main OBS Studio window, click **Stop Streaming** in the lower right corner.

**Step 2: Close the Live Room**

To promptly release room resources and stop billing, follow the operation based on your method of **Obtain OBS Stream URL**:
- **Live Management Console**: On the Live Stream List page in the console, select the live room and click **End Live**.

- **Server APIs Integration**: Call the server RESTful API to Dismiss Room.

## FAQs

### Will audience playback automatically recover if the host uses OBS third-party tools for RTMP streaming and network fluctuations cause a stream interruption?

- **Auto-Recovery Mechanism**: If network fluctuations cause a brief stream interruption, the system automatically maintains the mixed stream channel. As long as the host resumes streaming within the specified time window, the audience will seamlessly reconnect—no backend API calls required.

- **Enhanced Stability**: The new solution extends the mixed stream node's waiting threshold, resolving previous issues where interruptions longer than 2 minutes caused mixed stream breaks and prolonged black screens for viewers.

### Listening for OBS Start Streaming and End Streaming Events
- When OBS starts streaming, it enters the TRTC room and triggers the TRTC Enter Room callback event.

- When OBS stops streaming, it leaves the TRTC room and triggers the TRTC Exit Room callback event.

    Monitor Server Room Callbacks to detect OBS streaming and interruption events. Use a consistent format for the bot's UserID. When your backend receives Enter Room and Exit Room callbacks, verify if the event relates to the bot before processing your business logic.

   |**Event**|**Value**|**Description**|
   |---------|---------|---------|
   |EVENT_TYPE_ENTER_ROOM|103|Entering room|
   |EVENT_TYPE_EXIT_ROOM|104|Leaving room|

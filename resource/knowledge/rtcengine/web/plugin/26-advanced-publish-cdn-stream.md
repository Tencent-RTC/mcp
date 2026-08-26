## Feature Description

This document describes how to use the CDNStreaming plugin to implement cloud-based stream mixing, relaying streams to CDN, and pushing mixed streams back to TRTC rooms.

## Prerequisites

1. [TRTC SDK](https://www.npmjs.com/package/trtc-sdk-v5) version must be >= 5.1.
2. Enable [Tencent Cloud Live service](https://console.tencentcloud.com/live/domainmanage).
3. In the [TRTC Console - Advanced Features](https://console.trtc.io/features), click "Relay to CDN", and enable the "Enable relay to CDN" switch.
   - When the "Global auto relay" switch is enabled, all upstream audio and video streams in TRTC will be automatically relayed to Tencent Cloud CDN ("Global Auto relay" mode).
   - When the "Global auto relay" switch is disabled, you can use this plugin or the server REST API to relay specific audio and video streams to the CDN and specify the playback address ("Designated Stream relay" mode).

  <div align="center">

  </div>

## Getting Started

### Install & Register

```js
import TRTC from 'trtc-sdk-v5';
import { CDNStreaming, PublishMode } from 'trtc-sdk-v5/plugins/cdn-streaming';

const trtc = TRTC.create({ plugins: [CDNStreaming] });
```

### Plugin Modes Overview

This plugin provides four streaming modes:

| Mode | PublishMode | Description |
|------|-------------|-------------|
| A | `PublishMainStreamToCDN` | Relay camera and microphone stream to CDN |
| B | `PublishSubStreamToCDN` | Relay screen sharing stream to CDN |
| C | `PublishMixStreamToCDN` | Mix multiple streams and relay to CDN |
| D | `PublishMixStreamToRoom` | Mix multiple streams and push back to TRTC room |

For each mode, the following lifecycle applies:

- `trtc.startPlugin('CDNStreaming', options)` - Start the plugin
- `trtc.updatePlugin('CDNStreaming', options)` - Update parameters (0 or N times)
- `trtc.stopPlugin('CDNStreaming', options)` - Stop the plugin

For detailed `options` parameters, see [CDNStreamingOptions](global.md#CDNStreamingOptions).

## Relay Single Stream to CDN

Relay camera stream (Mode A) or screen sharing stream (Mode B) to Tencent Cloud CDN.

### Step 1: Select Relay Mode

In [TRTC Console - Advanced Features](https://console.trtc.io/features), select your relay mode:

**Global Auto-Relay Mode:**

Streams will be **automatically** pushed to CDN with default playback address:

`http://[playback-domain]/live/[streamId].flv`

- `[playback-domain]`: The playback domain configured in [Domain Management](https://console.tencentcloud.com/live/livestat)
- Default `[streamId]` for camera: `${sdkAppId}_${roomId}_${userId}_main`
- Default `[streamId]` for screen sharing: `${sdkAppId}_${roomId}_${userId}_aux`
- When roomId or userId contains special characters, streamId uses MD5: `${sdkAppId}_${md5(${roomId}_${userId}_main)}`

**Manual Relay Mode:**

Streams will **not** be automatically pushed. Follow Step 2 to manually enable streaming.

### Step 2: Start Relay

```javascript
// Start relaying camera stream
const options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN
  }
}
try {
  await trtc.startPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming start failed', error);
}
```

Playback address: `http://[playback-domain]/live/${sdkAppId}_${roomId}_${userId}_main.flv`

### Step 3: Update StreamId (Optional)

```javascript
// Customize the playback address
const options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN,
    streamId: 'stream001'
  }
}
try {
  await trtc.updatePlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming update failed', error);
}
```

New playback address: `http://[playback-domain]/live/stream001.flv`

### Step 4: Stop Relay

```javascript
const options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN,
  }
}
try {
  await trtc.stopPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming stop failed', error);
}
```

You can view the current stream status through the [Stream Management Interface](https://console.tencentcloud.com/live/domainmanage).

## Relay Mixed Stream to CDN

Mix multiple audio and video streams in the room into one stream and relay to CDN.

For other platform implementations, please refer to [Cloud-Based Stream Mixing and Transcoding](https://trtc.io/document/47858).

### How It Works

This plugin sends a command to Tencent Cloud's transcoding server to mix multiple streams. You can customize:
- `encoding`: Output stream quality (resolution, bitrate, framerate)
- `mix`: Layout configuration for mixed streams

### Example Workflow

1. Call `startPlugin`, the mixing layout is as shown in Figure A
2. Call `updatePlugin` to add screen sharing, the mixing layout is as shown in Figure B
3. Call `stopPlugin` when mixing is no longer needed

### Configuration Guide

1. Set `target.publishMode` to `PublishMode.PublishMixStreamToCDN`

2. Configure `encoding` for output quality: videoWidth, videoHeight, videoBitrate, videoFramerate, videoGOP, audioSampleRate, audioBitrate, audioChannels

3. Configure `mix.backgroundColor` and `mix.backgroundImage` for background
   > Background images need to be uploaded in [TRTC Console - Advanced Features](https://console.trtc.io/features) > Material management. Use the "Image ID" as string for backgroundImage (e.g., "63").
   >

4. Configure `mix.audioMixUserList` for audio mixing (empty = mix all users)

5. Configure `mix.videoLayoutList` for video layout

> Coordinate system: the origin (0, 0) is the **top-left corner** of the output canvas, in pixels. locationX/locationY is the top-left position of each stream; width/height is the layout region size. Coordinates/sizes are tied to encoding.videoWidth/videoHeight - if you change resolution, scale layout parameters accordingly to avoid misalignment.
>
> For full parameter details, see [CDNStreamingOptions](global.md#CDNStreamingOptions).

### Start Mixing

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToCDN,
    streamId: 'mix-stream',
  },
  encoding: {
    videoWidth: 1280,
    videoHeight: 720,
    videoBitrate: 1500,
    videoFramerate: 15,
  },
  mix: {
    audioMixUserList: [
      { userId: 'current_user_id' }
    ],
    videoLayoutList: [
      {
        fixedVideoUser: { userId: 'current_user_id' },
        width: 640,
        height: 480,
        locationX: 0,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_MAIN,
        zOrder: 1
      },
    ]
  }
};
try {
  await trtc.startPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming start failed', error);
}
```

Playback address: `http://[playback-domain]/live/mix-stream.flv`

### Update Layout

```javascript
// Add screen sharing to the mix
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToCDN,
    streamId: 'mix-stream',
  },
  encoding: {
    videoWidth: 1280,
    videoHeight: 720,
    videoBitrate: 1500,
    videoFramerate: 15,
  },
  mix: {
    audioMixUserList: [
      { userId: 'current_user_id' }
    ],
    videoLayoutList: [
      {
        fixedVideoUser: { userId: 'current_user_id' },
        width: 640,
        height: 480,
        locationX: 0,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_MAIN,
        zOrder: 1
      },
      {
        fixedVideoUser: { userId: 'current_user_id' },
        width: 640,
        height: 480,
        locationX: 640,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_SUB,
        zOrder: 1
      },
    ]
  }
}
try {
  await trtc.updatePlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming update failed', error);
}
```

### Stop Mixing

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToCDN,
  }
}
try {
  await trtc.stopPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming stop failed', error);
}
```

## Push to Third-party CDN

Push streams to a CDN from any cloud service provider.

### Step 1: Get CDN Push Address

Obtain a CDN stream push address (url) from your cloud service provider.

### Step 2: Get bizId and appId

In [TRTC Console - Advanced Features](https://console.trtc.io/features), find your push domain (format: `xxxxx.push.tlivecloud.com`):
- `xxxxx` is the `bizId`
- Use your SDKAppId as `appId`

<div align="center">

</div>

### Step 3: Start Publishing

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN,
    appId: 0,    // Your appId
    bizId: 0,    // Your bizId
    url: ''      // Your CDN push address
  }
};
try {
  await trtc.startPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming start customCDN failed', error);
}
```

### Stop Publishing

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMainStreamToCDN,
  }
}
try {
  await trtc.stopPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming stop customCDN failed ', error);
}
```

## Push Back to TRTC Room

Mix streams and push the mixed stream back to a specified TRTC room as a robot user.

> **Note:**
> - A stream-pulling robot with userId `mcu_robot_${roomId}_${userId}` will automatically enter the current room. Avoid userId conflicts.
> - This feature will incur transcoding fees for stream mixing.
> - When `audioMixUserList` is empty, all users are mixed by default. Pass a non-existent userId if you don't need audio mixing.
> - For full parameter details, see [CDNStreamingOptions](global.md#CDNStreamingOptions).

### Start Push Back

```javascript
// User user_123 in room 3333 initiates this task
// Mixed stream will be published as robot push_back_user_321 in room 4444
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToRoom,
    robotUser: {
      userId: 'push_back_user_321', // Recommend dynamic generation
      roomId: 4444,
    }
  },
  encoding: {
    videoWidth: 1280,
    videoHeight: 720,
    videoBitrate: 1500,
    videoFramerate: 15,
  },
  mix: {
    audioMixUserList: [
      { userId: 'user_123', roomId: 3333 }
    ],
    videoLayoutList: [
      {
        fixedVideoUser: { userId: 'user_123', roomId: 3333 },
        width: 640,
        height: 480,
        locationX: 0,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_MAIN,
        zOrder: 1
      },
      {
        fixedVideoUser: { userId: 'user_123', roomId: 3333 },
        width: 640,
        height: 480,
        locationX: 640,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_SUB,
        zOrder: 1
      },
    ]
  }
};
try {
  await trtc.startPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming start push stream to room failed', error);
}
```

### Update Layout

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToRoom
  },
  mix: {
    videoLayoutList: [
      {
        fixedVideoUser: { userId: 'user_123', roomId: 3333 },
        width: 640,
        height: 480,
        locationX: 640,
        locationY: 0,
        fixedVideoStreamType: TRTC.TYPE.STREAM_TYPE_MAIN,
        zOrder: 1
      }
    ]
  }
};
try {
  await trtc.updatePlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming update push stream to room failed', error);
}
```

### Stop Push Back

```javascript
let options = {
  target: {
    publishMode: PublishMode.PublishMixStreamToRoom,
  }
}
try {
  await trtc.stopPlugin('CDNStreaming', options);
} catch (error) {
  console.error('CDNStreaming stop push stream to room failed ', error);
}
```

## API Description

For `startPlugin('CDNStreaming', options)` and `updatePlugin('CDNStreaming', options)`, parameter types can be found in [CDNStreamingOptions](global.md#CDNStreamingOptions).

For `stopPlugin('CDNStreaming', options)`, the parameter only needs to fill in the `options.target.publishMode` field.

## Notes

1. To record mixed audio streams, please refer to [Cloud Recording](https://trtc.io/document/45169).

2. Cloud-based stream mixing and transcoding requires decoding and re-encoding the audio and video streams input to the MCU cluster, which will incur additional service costs. Therefore, TRTC will charge users who use the MCU cluster for cloud-based stream mixing and transcoding an additional value-added fee. Cloud-based stream mixing and transcoding fees are based on the **resolution of the transcoded output** and **transcoding duration**. The higher the resolution of the transcoded output and the longer the transcoding time, the higher the cost. For details, please refer to [Cloud-Based Stream Mixing and Transcoding Billing Description](https://trtc.io/document/47858).

3. For audio and video duration billing, please refer to [Billing Description](https://trtc.io/zh/document/47858).

4. After leaving the room, billing will not continue, but when re-entering the room, it will automatically continue to start. If you want to directly terminate CDN relay and mixing, please execute stopPlugin for the corresponding publishMode.

## FAQ

Q. Unable to stop streaming?

Please check if "Global Auto-Relay" is enabled in the console. In this mode, streaming cannot be stopped through the API.

Q. How to view all current streams?

You can view the current stream status through the [Stream Management Interface](https://console.tencentcloud.com/live/streammanage).

Q. Screen sharing is blurry?

The SDK uses `1080p` parameter configuration by default to capture screen sharing. Please

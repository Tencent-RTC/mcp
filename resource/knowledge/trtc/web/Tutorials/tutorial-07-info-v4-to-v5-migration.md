---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-07-info-v4-to-v5-migration.md'
nav_path:
  - "Tutorials"
product: "trtc"
---
# Migration Guide: v4 to v5

This document provides a complete migration guide for upgrading from TRTC Web SDK v4 to v5, including architecture changes, API mappings, event mappings, and migration code examples.

## Migrate with Skill

If you are using an AI-powered coding IDE (such as Claude Code, Codex, Cursor, CodeBuddy, etc.), you can leverage the **v4-to-v5-migration** Skill for automated migration. The Skill automatically scans your codebase for all v4 API patterns, generates a migration plan, and applies code changes file by file.

### Install the Skill

Run the following command in your project root directory to install the Skill:

```bash
npx skills add https://github.com/Tencent-RTC/tencent-rtc-skills/tree/main/trtc-sdk/web/v4-to-v5-migration
```

### How to Use

In an AI conversation, simply describe your migration need to trigger the Skill, for example:

- "Use skill to help me upgrade this project from trtc-js-sdk to trtc-sdk-v5"
- "Use skill to migrate the v4 code to v5"
- "Use skill to upgrade TRTC v4 to v5"

### Skill Workflow

1. **Scan**: Automatically discovers all v4 API patterns in your codebase (`TRTC.createClient`, `TRTC.createStream`, `client.join`, `stream.initialize`, etc.)
2. **Analyze**: Reads the complete API mapping table and generates a migration plan for each file
3. **Confirm**: Presents the migration plan and waits for your confirmation before proceeding
4. **Migrate**: Applies code changes file by file (package name, instance creation, room operations, local/remote media, event listeners, screen sharing, device APIs, etc.)
5. **Verify**: Re-scans after migration to ensure nothing is missed

> **Tip:** Even with Skill-assisted migration, we recommend thorough functional testing afterward.

## Overview

### Architecture Changes

The v4 SDK uses a **Client + Stream split** design:

- `TRTC.createClient()` creates the client instance, which is responsible for signaling operations such as joining/leaving a room and publishing/subscribing.
- `TRTC.createStream()` creates the audio/video stream instance, which is responsible for media operations such as capture and playback.

The v5 SDK uses a **unified TRTC instance** design:

- `TRTC.create()` creates the only instance you need. All operations, including joining/leaving a room, local capture and playback, and screen sharing, are performed through this instance.

### Benefits of Upgrading

| Aspect | v4 | v5 |
| ------ | ------ | ------ |
| API design | Client and Stream are separated, so operations are scattered | Unified instance with simpler and more intuitive APIs |
| Remote stream handling | Requires manual `subscribe` + `stream.play` | Call `startRemoteVideo` directly; subscription is handled internally |
| Screen sharing | Since v4.15+, the same Client can be reused, but you still need to create a separate screen-sharing Stream and publish it as a substream | Call `startScreenShare` directly without explicitly creating a screen-sharing Stream |
| Plugin ecosystem | No unified plugin mechanism | Unified plugin system with virtual background, AI denoiser, voice changer, and more |
| Statistics | Retrieved actively through multiple APIs | Received passively through the `STATISTICS` event with better timeliness |
| Room switching | Leave the room and join again | Supports seamless room switching with `switchRoom` |
| Long-term maintenance and feature iteration | No longer maintained | Actively updated with more features |

## Migration Index by Scenario

If you want to quickly locate differences by feature scenario first.

### Basic Tutorials

| 4.x Tutorial | 5.x Tutorial |
| --- | --- |
| [Implement Basic Audio/Video Calls (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-11-basic-video-call.html) | [Implement Basic Audio/Video Calls](tutorial-11-basic-video-call.md) |
| [Implement Interactive Live Streaming (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-12-basic-live-video.html) | [Implement Interactive Live Streaming](tutorial-12-basic-live-video.md) |
| [Switch Camera and Microphone (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-13-basic-switch-camera-mic.html) | [Switch Camera and Microphone](tutorial-13-basic-switch-camera-mic.md) |
| [Set Local Video Profile (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-14-basic-set-video-profile.html) | [Set Local Video Profile](tutorial-14-basic-set-video-profile.md) |
| [Turn Camera and Microphone On/Off Dynamically (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-15-basic-dynamic-add-video.html) | [Turn Camera and Microphone On/Off Dynamically](tutorial-15-basic-dynamic-add-video.md) |
| [Implement Screen Sharing (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-16-basic-screencast.html) | [Implement Screen Sharing](tutorial-16-basic-screencast.md) |
| [Detect Audio Volume (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-17-basic-detect-volume.html) | [Detect Audio Volume](tutorial-17-basic-detect-volume.md) |

### Advanced Tutorials

| 4.x Tutorial | 5.x Tutorial |
| --- | --- |
| [Customized Capture and Customized Rendering (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-20-advanced-customized-capture-rendering.html) | [Customized Capture and Customized Rendering](tutorial-20-advanced-customized-capture-rendering.md) |
| [Background Music and Audio Effects (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-22-advanced-audio-mixer.html) | [Background Music and Audio Effects](tutorial-22-advanced-audio-mixer.md) |
| [Environment and Device Check Before Calls (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-23-advanced-support-detection.html) | [Environment and Device Check Before Calls](tutorial-23-advanced-support-detection.md) |
| [Detect Network Quality (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-24-advanced-network-quality.html) | [Detect Network Quality](tutorial-24-advanced-network-quality.md) |
| [Detect Device Changes (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-25-advanced-device-change.html) | [Detect Device Changes](tutorial-25-advanced-device-change.md) |
| [Enable Small Stream (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-27-advanced-small-stream.html) | [Enable Small Stream](tutorial-27-advanced-small-stream.md) |
| [Enable Watermark (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-29-advanced-water-mark.html) | [Enable Watermark](tutorial-29-advanced-water-mark.md) |
| [Enable AI Denoiser (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-35-advanced-ai-denoiser.html) | [Enable AI Denoiser](tutorial-35-advanced-ai-denoiser.md) |
| [Implement Cloud Mixing (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-31-advanced-mix-transcode.html) / [Push Streams to CDN (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-26-advanced-publish-cdn-stream.html) | [Cloud Mixing and CDN Streaming](tutorial-26-advanced-publish-cdn-stream.md) |
| [Implement 3D Spatial Audio (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-36-advanced-spatial-audio.html) | Planned and coming soon |
| [Implement Voice Changer (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-37-advanced-voice-changer.html) | [Enable Voice Changer](tutorial-37-advanced-voice-changer.md) |

### Best Practices

| 4.x Tutorial | 5.x Tutorial |
| --- | --- |
| [Handling Restricted Autoplay (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-21-advanced-auto-play-policy.html) | [Handling Restricted Autoplay](tutorial-21-advanced-auto-play-policy.md) |
| [Dealing with Firewall Restrictions (v4)](https://web.sdk.qcloud.com/trtc/webrtc/v4/doc/en/tutorial-34-advanced-proxy.html) | [Dealing with Firewall Restrictions](tutorial-34-advanced-proxy.md) |

## Installation and Import

### v4

```javascript
// Install with npm
npm install trtc-js-sdk

// Import
import TRTC from 'trtc-js-sdk';
```

### v5

```javascript
// Install with npm
npm install trtc-sdk-v5

// Import
import TRTC from 'trtc-sdk-v5';
```

## Core API Mapping

### Create an Instance

**v4:** You need to create `Client` and `Stream` separately.

```javascript
const client = TRTC.createClient({
  sdkAppId,
  userId,
  userSig,
  mode: 'rtc', // or 'live'
});

const localStream = TRTC.createStream({
  userId,
  audio: true,
  video: true,
});
```

**v5:** Create a unified TRTC instance.

```javascript
const trtc = TRTC.create();
```

### Enter and Exit a Room

**v4:**

```javascript
// Enter a room
await client.join({ roomId: 1234 });

// Exit the room
await client.leave();
```

**v5:**

```javascript
// Enter a room
await trtc.enterRoom({
  sdkAppId,
  userId,
  userSig,
  roomId: 1234,
  scene: 'rtc', // corresponds to v4 mode
});

// Exit the room
await trtc.exitRoom();
```

> **Note:** In v5, parameters such as `sdkAppId`, `userId`, and `userSig` are passed to `enterRoom()` instead of `create()`. The `mode` parameter in v4 maps to the `scene` parameter in v5 (`'rtc'` or `'live'`).

### Local Audio and Video

**v4:** Initialize the `Stream` first, then publish it.

```javascript
const localStream = TRTC.createStream({
  userId,
  audio: true,
  video: true,
});

// Initialize capture
await localStream.initialize();

// Play local preview
localStream.play('local-video-container');

// Publish
await client.publish(localStream);
```

**v5:** Capture, preview, and publish are completed in one step.

```javascript
// Start local video (capture + preview + publish)
await trtc.startLocalVideo({
  view: 'local-video-container',
});

// Start local audio (capture + publish)
await trtc.startLocalAudio();
```

Stop local audio/video:

```javascript
// v4
client.unpublish(localStream);
localStream.close();

// v5
await trtc.stopLocalVideo();
await trtc.stopLocalAudio();
```

### Remote Audio and Video

**v4:** Listen for events → subscribe → play.

```javascript
client.on('stream-added', (event) => {
  const remoteStream = event.stream;
  // Subscribe to the remote stream
  client.subscribe(remoteStream);
});

client.on('stream-subscribed', (event) => {
  const remoteStream = event.stream;
  // Play the remote stream
  remoteStream.play('remote-video-container');
});

client.on('stream-removed', (event) => {
  const remoteStream = event.stream;
  remoteStream.stop();
});
```

**v5:** Listen for events → play directly.

```javascript
// A remote user enters the room
trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, (event) => {
  // userId entered the room
});

// When remote video becomes available, start playing it
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, (event) => {
  const { userId, streamType } = event;
  trtc.startRemoteVideo({
    userId,
    streamType,
    view: `remote-video-${userId}`,
  });
});

// When remote video becomes unavailable, playback stops automatically and you may remove the DOM element if needed
trtc.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, (event) => {
  // Video has been stopped automatically
});

// Remote audio is automatically subscribed to and played by default, no extra handling is required
```

> **Note:** In v5, audio is subscribed to automatically by default (`autoReceiveAudio` defaults to `true`), while video must be played explicitly by calling `startRemoteVideo()`. Starting from v5.6.0, `autoReceiveVideo` defaults to `false`, so you need to listen for `REMOTE_VIDEO_AVAILABLE` and call `startRemoteVideo()` manually.

### Screen Sharing

**v4.15+:** No extra Client is required, but you still need to create a dedicated screen-sharing Stream and publish it as a substream.

```javascript
// Reuse the primary Client that has already entered the room
const shareStream = TRTC.createStream({
  userId,
  audio: false,
  screen: true,
});

await shareStream.initialize();
await client.publish(shareStream, { isAuxiliary: true });
```

> **Note:** Before v4.15.0, if you wanted to publish both camera and screen sharing at the same time, you typically needed to create an additional Client. Starting from v4.15.0, the same Client can publish both the primary stream and the substream.

**v5:** Call the API directly.

```javascript
await trtc.startScreenShare();
```

### Switch Roles (Live Scenario)

```javascript
// v4
await client.switchRole('anchor'); // or 'audience'

// v5
await trtc.switchRole(TRTC.TYPE.ROLE_ANCHOR); // or TRTC.TYPE.ROLE_AUDIENCE
```

### Audio/Video Parameter Settings

**v4:**

```javascript
localStream.setVideoProfile('480p');
localStream.setAudioProfile('standard');
```

**v5:** Configure parameters through `option` in `startLocalVideo` / `startLocalAudio`.

```javascript
await trtc.startLocalVideo({
  view: 'local-video-container',
  option: {
    profile: '480p',
  },
});

await trtc.startLocalAudio({
  option: {
    profile: 'standard',
  },
});
```

### Device Management

**v4:**

```javascript
// Get device lists
const devices = await TRTC.getDevices();
const cameras = await TRTC.getCameras();
const microphones = await TRTC.getMicrophones();
const speakers = await TRTC.getSpeakers();

// Switch devices
await localStream.switchDevice('video', cameraId);
await localStream.switchDevice('audio', microphoneId);
```

**v5:**

```javascript
// Get device lists
const cameras = await TRTC.getCameraList();
const microphones = await TRTC.getMicrophoneList();
const speakers = await TRTC.getSpeakerList();

// Switch devices (through updateLocalVideo / updateLocalAudio)
await trtc.updateLocalVideo({ option: { cameraId: newCameraId } });
await trtc.updateLocalAudio({ option: { microphoneId: newMicId } });
```

### Audio Volume Detection

```javascript
// v4
client.enableAudioVolumeEvaluation(200);
client.on('audio-volume', (event) => {
  event.result.forEach(({ userId, audioVolume }) => {
    console.log(`User ${userId} volume: ${audioVolume}`);
  });
});

// v5
trtc.enableAudioVolumeEvaluation(200);
trtc.on(TRTC.EVENT.AUDIO_VOLUME, (event) => {
  event.result.forEach(({ userId, volume }) => {
    console.log(`User ${userId} volume: ${volume}`);
  });
});
```

### Statistics

**v4:** Retrieved actively through multiple APIs.

```javascript
const transportStats = await client.getTransportStats();
const localAudioStats = await client.getLocalAudioStats();
const localVideoStats = await client.getLocalVideoStats();
const remoteAudioStats = await client.getRemoteAudioStats();
const remoteVideoStats = await client.getRemoteVideoStats();
```

**v5:** Received passively through the `STATISTICS` event, which is triggered every 2 seconds.

```javascript
trtc.on(TRTC.EVENT.STATISTICS, (event) => {
  const {
    rtt, // round-trip time (ms)
    upLoss, // uplink packet loss rate (%)
    downLoss, // downlink packet loss rate (%)
    bytesSent, // bytes sent
    bytesReceived, // bytes received
    localStatistics, // local audio/video statistics
    remoteStatistics // array of remote audio/video statistics
  } = event;

  // Local audio statistics
  const { bitrate, audioLevel } = localStatistics.audio;

  // Local video statistics (an array that may include the main stream and the small stream)
  localStatistics.video.forEach(({ width, height, frameRate, bitrate, videoType }) => {
    console.log(`Local video: ${width}x${height} ${frameRate}fps ${bitrate}kbps`);
  });

  // Remote statistics
  remoteStatistics.forEach(({ userId, audio, video }) => {
    console.log(`Remote user ${userId}: audio bitrate ${audio.bitrate}kbps`);
    video.forEach(({ width, height, frameRate, bitrate, videoType }) => {
      console.log(`  Video: ${width}x${height} ${frameRate}fps ${bitrate}kbps`);
    });
  });
});
```

> **Note:** v5 does not provide a `getStatistics()` method. Statistics are delivered through the `STATISTICS` event.

### SEI Messages

```javascript
// v4
client.sendSEIMessage(buffer);

// v5
await trtc.sendSEIMessage(buffer);

// Receive SEI messages
trtc.on(TRTC.EVENT.SEI_MESSAGE, (event) => {
  const { userId, data } = event;
});
```

### Small Stream

```javascript
// v4
client.enableSmallStream();
client.setSmallStreamProfile({ width: 160, height: 120, bitrate: 100, frameRate: 15 });
client.setRemoteVideoStreamType(remoteStream, 'small');

// v5
// Publisher side: enable small stream through option.small in startLocalVideo / updateLocalVideo
await trtc.startLocalVideo({
  option: {
    small: { width: 160, height: 120, bitrate: 100, frameRate: 15 },
  },
});

// Subscriber side: subscribe to the small stream through option.small in startRemoteVideo / updateRemoteVideo
await trtc.startRemoteVideo({
  userId,
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  option: { small: true },
});
```

> **Note:** `TRTC.TYPE.STREAM_TYPE_SUB` represents the substream (usually used for screen sharing), not the small stream. In v5, switching between the main and small stream is controlled by `option.small`.

### Destroy the Instance

```javascript
// v4: if the client will not be used later, call destroy after leave to release resources
await client.leave();
client.destroy();

// v5: if the trtc instance will not be reused later, call destroy after exitRoom to release resources
await trtc.exitRoom();
trtc.destroy();
```

## Complete API Mapping Table

| Feature | v4 API | v5 API |
| ------ | -------- | -------- |
| Create instance | `TRTC.createClient()` + `TRTC.createStream()` | `TRTC.create()` |
| Enter room | `client.join()` | `trtc.enterRoom()` |
| Exit room | `client.leave()` | `trtc.exitRoom()` |
| Destroy instance | `client.destroy()` | `trtc.destroy()` |
| Switch room | Leave room and join again | `trtc.switchRoom()` |
| Publish | `client.publish(stream)` | `trtc.startLocalVideo()` / `trtc.startLocalAudio()` |
| Unpublish | `client.unpublish(stream)` | `trtc.stopLocalVideo()` / `trtc.stopLocalAudio()` |
| Subscribe | `client.subscribe(stream)` | Audio is auto-subscribed; video uses `trtc.startRemoteVideo()` |
| Unsubscribe | `client.unsubscribe(stream)` | `trtc.stopRemoteVideo()` / `trtc.muteRemoteAudio()` |
| Initialize stream | `stream.initialize()` | Not needed (integrated into `startLocalVideo` / `startLocalAudio`) |
| Play stream | `stream.play()` | Local: `view` in `startLocalVideo`; Remote: `view` in `startRemoteVideo` |
| Stop playback | `stream.stop()` | `trtc.stopRemoteVideo()` |
| Close stream | `stream.close()` | `trtc.stopLocalVideo()` / `trtc.stopLocalAudio()` |
| Mute/unmute local audio | `stream.muteAudio()` / `stream.unmuteAudio()` | `trtc.updateLocalAudio({ mute: true/false })` |
| Mute/unmute local video | `stream.muteVideo()` / `stream.unmuteVideo()` | `trtc.updateLocalVideo({ mute: true/false })` |
| Set video profile | `stream.setVideoProfile()` | `trtc.startLocalVideo({ option: { profile } })` |
| Set audio profile | `stream.setAudioProfile()` | `trtc.startLocalAudio({ option: { profile } })` |
| Switch devices | `stream.switchDevice()` | `trtc.updateLocalVideo()` / `trtc.updateLocalAudio()` |
| Screen sharing | `createStream({ screen: true })` + `client.publish(shareStream, { isAuxiliary: true })` | `trtc.startScreenShare()` |
| Stop screen sharing | `client.unpublish(shareStream)` + `shareStream.close()` | `trtc.stopScreenShare()` |
| Switch roles | `client.switchRole()` | `trtc.switchRole()` |
| Transport statistics | `client.getTransportStats()` | `TRTC.EVENT.STATISTICS` event |
| Local audio statistics | `client.getLocalAudioStats()` | `TRTC.EVENT.STATISTICS` event (`localStatistics.audio`) |
| Local video statistics | `client.getLocalVideoStats()` | `TRTC.EVENT.STATISTICS` event (`localStatistics.video`) |
| Remote audio statistics | `client.getRemoteAudioStats()` | `TRTC.EVENT.STATISTICS` event (`remoteStatistics[].audio`) |
| Remote video statistics | `client.getRemoteVideoStats()` | `TRTC.EVENT.STATISTICS` event (`remoteStatistics[].video`) |
| Volume evaluation | `client.enableAudioVolumeEvaluation()` | `trtc.enableAudioVolumeEvaluation()` |
| Get cameras | `TRTC.getCameras()` | `TRTC.getCameraList()` |
| Get microphones | `TRTC.getMicrophones()` | `TRTC.getMicrophoneList()` |
| Get speakers | `TRTC.getSpeakers()` | `TRTC.getSpeakerList()` |
| SEI message | `client.sendSEIMessage()` | `trtc.sendSEIMessage()` |
| Enable small stream on publish | `client.enableSmallStream()` | `trtc.startLocalVideo({ option: { small } })` / `trtc.updateLocalVideo({ option: { small } })` |
| Switch main/small stream on subscribe | `client.setRemoteVideoStreamType()` | `trtc.startRemoteVideo({ streamType: TRTC.TYPE.STREAM_TYPE_MAIN, option: { small: true/false } })` / `trtc.updateRemoteVideo({ streamType: TRTC.TYPE.STREAM_TYPE_MAIN, option: { small: true/false } })` |
| Custom message | Not available | `trtc.sendCustomMessage()` |

## Event Mapping Table

| Feature | v4 Event | v5 Event |
| ------ | --------- | --------- |
| Remote stream becomes available | `stream-added` | `TRTC.EVENT.REMOTE_VIDEO_AVAILABLE` / `TRTC.EVENT.REMOTE_AUDIO_AVAILABLE` |
| Remote stream subscribed | `stream-subscribed` | Not available (handled internally by `startRemoteVideo`) |
| Remote stream removed | `stream-removed` | `TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE` / `TRTC.EVENT.REMOTE_AUDIO_UNAVAILABLE` |
| Remote stream updated | `stream-updated` | No direct equivalent |
| Remote user enters | `peer-join` | `TRTC.EVENT.REMOTE_USER_ENTER` |
| Remote user exits | `peer-leave` | `TRTC.EVENT.REMOTE_USER_EXIT` |
| Remote audio muted | `mute-audio` | `TRTC.EVENT.REMOTE_AUDIO_UNAVAILABLE` |
| Remote audio unmuted | `unmute-audio` | `TRTC.EVENT.REMOTE_AUDIO_AVAILABLE` |
| Remote video muted | `mute-video` | `TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE` |
| Remote video unmuted | `unmute-video` | `TRTC.EVENT.REMOTE_VIDEO_AVAILABLE` |
| Kicked out of the room | `client-banned` | `TRTC.EVENT.KICKED_OUT` |
| Network quality | `network-quality` | `TRTC.EVENT.NETWORK_QUALITY` |
| Connection state | `connection-state-changed` | `TRTC.EVENT.CONNECTION_STATE_CHANGED` |
| Error event | `error` | `TRTC.EVENT.ERROR` |
| Volume event | `audio-volume` | `TRTC.EVENT.AUDIO_VOLUME` |
| Playback state | `player-state-changed` | `TRTC.EVENT.AUDIO_PLAY_STATE_CHANGED` / `TRTC.EVENT.VIDEO_PLAY_STATE_CHANGED` |

### New Events in v5

| Event | Description |
| ------ | ------ |
| `TRTC.EVENT.STATISTICS` | Audio/video statistics, triggered every 2 seconds |
| `TRTC.EVENT.AUTOPLAY_FAILED` | Autoplay failed |
| `TRTC.EVENT.SCREEN_SHARE_STOPPED` | Screen sharing stopped, for example when the user clicks the browser's "Stop sharing" button |
| `TRTC.EVENT.DEVICE_CHANGED` | Device change (plug in / unplug) |
| `TRTC.EVENT.PUBLISH_STATE_CHANGED` | Publishing state changed |
| `TRTC.EVENT.TRACK` | Track event for accessing the underlying `MediaStreamTrack` |
| `TRTC.EVENT.SEI_MESSAGE` | SEI message received |
| `TRTC.EVENT.CUSTOM_MESSAGE` | Custom message received |
| `TRTC.EVENT.FIRST_VIDEO_FRAME` | First video frame rendered |
| `TRTC.EVENT.PERMISSION_STATE_CHANGE` | Device permission state changed |
| `TRTC.EVENT.VIDEO_SIZE_CHANGED` | Video size changed |
| `TRTC.EVENT.AUDIO_FRAME` | Audio frame data |

## Migration Example: Basic Audio/Video Call

### Complete v4 Example

```javascript
import TRTC from 'trtc-js-sdk';

// 1. Create a Client
const client = TRTC.createClient({
  sdkAppId: 1400000000,
  userId: 'user_1',
  userSig: 'xxx',
  mode: 'rtc',
});

// 2. Listen for remote stream events
client.on('stream-added', (event) => {
  const remoteStream = event.stream;
  client.subscribe(remoteStream);
});

client.on('stream-subscribed', (event) => {
  const remoteStream = event.stream;
  remoteStream.play('remote-video-container');
});

client.on('stream-removed', (event) => {
  event.stream.stop();
});

client.on('peer-leave', (event) => {
  console.log(`${event.userId} left the room`);
});

// 3. Enter the room
await client.join({ roomId: 1234 });

// 4. Create and initialize the local stream
const localStream = TRTC.createStream({
  userId: 'user_1',
  audio: true,
  video: true,
});
await localStream.initialize();
localStream.play('local-video-container');

// 5. Publish the local stream
await client.publish(localStream);

// When leaving
await client.unpublish(localStream);
localStream.close();
await client.leave();
```

### Complete v5 Example

```javascript
import TRTC from 'trtc-sdk-v5';

// 1. Create a TRTC instance
const trtc = TRTC.create();

// 2. Listen for remote events
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  trtc.startRemoteVideo({ userId, streamType, view: `remote-video-${userId}` });
});

trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, ({ userId }) => {
  console.log(`${userId} left the room`);
});

// 3. Enter the room
await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'user_1',
  userSig: 'xxx',
  roomId: 1234,
  scene: 'rtc',
});

// 4. Start local audio/video (capture + preview + publish)
await trtc.startLocalVideo({ view: 'local-video-container' });
await trtc.startLocalAudio();

// When leaving
await trtc.stopLocalVideo();
await trtc.stopLocalAudio();
await trtc.exitRoom();
trtc.destroy();
```

## Migration Example: Screen Sharing

### v4.15+ Screen Sharing Example

```javascript
// Reuse the primary Client that has already entered the room and publish screen sharing as a substream
const shareStream = TRTC.createStream({
  userId,
  audio: false,
  screen: true,
});
await shareStream.initialize();
shareStream.play('screen-container');
await client.publish(shareStream, { isAuxiliary: true });

// Stop sharing
await client.unpublish(shareStream);
shareStream.close();
```

> **Note:** Before v4.15.0, if you wanted to publish both camera and screen sharing at the same time, you typically needed to create an extra Client. Starting from v4.15.0, the same Client can be reused.

### v5 Screen Sharing Example

```javascript
// One line of code
await trtc.startScreenShare();

// Listen for the screen sharing stop event
trtc.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
  console.log('Screen sharing has stopped');
});

// Stop proactively
await trtc.stopScreenShare();
```

## Migration Example: Retrieving Statistics

### v4: Timer + API polling

```javascript
setInterval(async () => {
  const transportStats = await client.getTransportStats();
  console.log(`RTT: ${transportStats.rtt}ms`);

  const localAudioStats = await client.getLocalAudioStats();
  console.log('Local audio:', localAudioStats);

  const localVideoStats = await client.getLocalVideoStats();
  console.log('Local video:', localVideoStats);

  const remoteAudioStats = await client.getRemoteAudioStats();
  console.log('Remote audio:', remoteAudioStats);

  const remoteVideoStats = await client.getRemoteVideoStats();
  console.log('Remote video:', remoteVideoStats);
}, 2000);
```

### v5: Event listener

```javascript
trtc.on(TRTC.EVENT.STATISTICS, (event) => {
  console.log(`RTT: ${event.rtt}ms, uplink loss: ${event.upLoss}%, downlink loss: ${event.downLoss}%`);

  // Local audio statistics
  console.log(`Local audio bitrate: ${event.localStatistics.audio.bitrate}kbps`);

  // Local video statistics
  event.localStatistics.video.forEach((stat) => {
    console.log(`Local video: ${stat.width}x${stat.height} ${stat.frameRate}fps ${stat.bitrate}kbps`);
  });

  // Remote statistics
  event.remoteStatistics.forEach(({ userId, audio, video }) => {
    console.log(`User ${userId} - audio bitrate: ${audio.bitrate}kbps`);
    video.forEach((stat) => {
      console.log(`  Video: ${stat.width}x${stat.height} ${stat.frameRate}fps ${stat.bitrate}kbps`);
    });
  });
});
```

## New Capabilities in v5

### Plugin System

v5 provides a unified plugin system. Plugins are managed through `startPlugin`, `updatePlugin`, and `stopPlugin`. Supported plugins include:

- **Beauty** - advanced beauty filters
- **BasicBeauty** - basic beauty filters
- **VirtualBackground** - virtual background
- **AIDenoiser** - AI denoiser
- **AudioMixer** - background music mixing
- **Watermark** - watermark
- **CDNStreaming** - CDN streaming
- **CrossRoom** - cross-room interaction
- **DeviceDetector** - device detection
- **And more...**

```javascript
import { Beauty } from 'trtc-sdk-v5/plugins/beauty';

const trtc = TRTC.create({ plugins: [new Beauty()] });

// Enable beauty
await trtc.startPlugin('Beauty', {
  beauty: 0.5,
  brightness: 0.5,
  ruddy: 0.5,
});

// Update parameters
await trtc.updatePlugin('Beauty', { beauty: 0.8 });

// Disable beauty
await trtc.stopPlugin('Beauty');
```

### switchRoom - Seamless Room Switching

```javascript
// v4 requires leaving the room first and then joining another room
await client.leave();
await client.join({ roomId: 5678 });

// v5 switches directly
await trtc.switchRoom({ roomId: 5678 });
```

### sendCustomMessage - Custom Messaging

```javascript
await trtc.sendCustomMessage({
  cmdId: 1,
  data: new Uint8Array([1, 2, 3]),
});

trtc.on(TRTC.EVENT.CUSTOM_MESSAGE, (event) => {
  const { userId, cmdId, data } = event;
});
```

## Notes

### 1. `autoReceiveVideo` Default Value Change

Starting from **v5.6.0**, the default value of `autoReceiveVideo` changed from `true` to `false`. In other words, remote video is no longer subscribed to automatically. You need to listen for `REMOTE_VIDEO_AVAILABLE` and call `startRemoteVideo()` manually to start playing remote video.

```javascript
// Recommended: always listen for REMOTE_VIDEO_AVAILABLE and play remote video there
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  trtc.startRemoteVideo({ userId, streamType, view: document.getElementById(`video-${userId}`) });
});
```

### 2. `roomId` Type

- `enterRoom` in v5 supports numeric `roomId` and string `strRoomId`; use one of them.
- The numeric `roomId` range is `[1, 4294967294]`.

### 3. Statistics Are Event-Driven

v5 does not provide `getStatistics()`. All statistics are pushed through `TRTC.EVENT.STATISTICS`. If you need statistics, listen for this event directly.

### 4. Audio Is Auto-Subscribed by Default

In v5, remote audio is automatically subscribed to and played by default. You do not need to manually `subscribe` and `play` as in v4. If you need finer control, set `autoReceiveAudio: false` when calling `enterRoom`.

### 5. Destroying the Instance

If the instance will not be reused, call `trtc.destroy()` when you are done to release resources. v4 also provides `client.destroy()` (v4.13.0+); only the object being destroyed changes from `client` to the `trtc` instance.

### 6. Simpler Screen Sharing APIs

In v4.15.0+, screen sharing can already reuse the same `client`, but you still need to manually create `shareStream` and publish it with `{ isAuxiliary: true }`. In v5, you simply call `startScreenShare()` / `stopScreenShare()` without explicitly creating a screen-sharing Stream.

### 7. Autoplay Policy

v5 provides the `AUTOPLAY_FAILED` event and the `enableAutoPlayDialog` option, which let you handle browser autoplay restrictions more gracefully.

```javascript
// Option 1: enable the built-in autoplay guidance dialog in enterRoom
await trtc.enterRoom({
  // ...
  enableAutoPlayDialog: true,
});

// Option 2: handle it manually
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, () => {
  // Show guidance and prompt the user to interact with the page to resume audio/video playback
});
```

## More References

- [TRTC Web SDK v5 API Documentation](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/index.html)
- [v5 Update and Breaking Change Guide](tutorial-00-info-update-guideline.md)
- [Demo Quick Run](tutorial-10-basic-get-started-with-demo.md)

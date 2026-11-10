---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-46-advanced-playback-quality-switcher.md'
nav_path:
  - "Tutorials"
  - "Best Practices"
product: "trtc"
---

## Function Description

In live viewing scenarios, the same content is often available in multiple quality levels, such as `1080p`, `720p`, and `480p`. When the user's network condition, device capability, or business requirement changes, you may need to switch between these levels to achieve a better balance between **clarity** and **smoothness**.

TRTC Web SDK provides the experimental API `switchPlaybackQuality` for switching playback quality across multiple live streams. The SDK handles playback transition and main-stream audio synchronization.

This article describes how to integrate multi-resolution switching for live playback and the recommended best practices.

## Applicable Scenarios

`switchPlaybackQuality` is suitable for the following scenarios:

- **Multiple playback qualities for live audiences**: The same live content is provided in multiple resolutions, and the audience can switch quality manually.
- **Weak-network playback on mobile**: When bandwidth drops, packet loss increases, or rendering becomes unstable, the SDK can switch to a lower level to prioritize playback continuity.

> This solution is more suitable for **single live playback** scenarios. For multi-user call or gallery-view scenarios, it is recommended to use [Enable Dual Stream](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-27-advanced-small-stream.html).

## Prerequisites

Before using this capability, make sure that:

1. The same live content is available in multiple quality levels, and each level can be identified by a unique `userId` (and optionally `streamType`).
2. You have already entered the room through {@link TRTC#enterRoom trtc.enterRoom()}.
3. The audience side has already started playing one of the streams in `streamList` through {@link TRTC#startRemoteVideo trtc.startRemoteVideo()}.
4. `streamList[].bitrate` is filled with the actual bitrate of each level in `kbps`, which is used for sorting and auto-switching decisions.

## API Description

Call this capability through `callExperimentalAPI`:

```typescript
await trtc.callExperimentalAPI('switchPlaybackQuality', options);

interface PlaybackQualityStream {
  name: string;
  userId: string;
  streamType?: TRTCStreamType;
  bitrate: number;
}

interface ResolutionConfig {
  userId: string;
  streamType: TRTCStreamType;
  name: string;
}

interface SwitchPlaybackQualityOptions {
  quality?: string;
  streamList?: PlaybackQualityStream[];
  onSwitched?: (from: ResolutionConfig, to: ResolutionConfig) => void;
}
```

### Parameter Description

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `quality` | string | No | Target quality name. It must exactly match `streamList[].name`. Pass `auto` to enable auto-switch mode. If omitted, the SDK only caches `streamList`. |
| `streamList` | array | No | The list of available playback qualities. If omitted, the SDK reuses the cached list from the previous call. |
| `streamList[].name` | string | Yes | Quality name, such as `1080p` or `720p`. |
| `streamList[].userId` | string | Yes | The `userId` of the stream for that quality level. |
| `streamList[].streamType` | TRTCStreamType | No | Stream type. The default is main stream. |
| `streamList[].bitrate` | number | Yes | Bitrate in `kbps`. In auto mode, the SDK sorts qualities from high to low by bitrate. |
| `onSwitched` | function | No | Callback invoked after a successful switch. It returns the previous and current quality information. |

## Manual Switch Mode

### 1. Prepare `streamList`

It is recommended to maintain a quality list in your business layer, for example:

```javascript
const streamList = [
  { name: '1080p', userId: 'anchor_1080p', bitrate: 2000 },
  { name: '720p', userId: 'anchor_720p', bitrate: 1000 },
  { name: '480p', userId: 'anchor_480p', bitrate: 500 },
];
```

### 2. Cache `streamList` after entering the room

If you only pass `streamList` without `quality`, the SDK caches the quality information and does not switch immediately.

```javascript
await trtc.callExperimentalAPI('switchPlaybackQuality', {
  streamList,
});
```

### 3. Start playing the default quality

Start playing one of the streams through {@link TRTC#startRemoteVideo trtc.startRemoteVideo()}. The currently playing stream must exist in `streamList`.

```javascript
await trtc.startRemoteVideo({
  userId: 'anchor_720p',
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  view: document.getElementById('live-player'),
});
```

### 4. Switch to the target quality

When the user selects another quality level in the UI, call `switchPlaybackQuality`:

```javascript
await trtc.callExperimentalAPI('switchPlaybackQuality', {
  quality: '1080p',
  onSwitched(from, to) {
    console.log(`playback quality switched: ${from.name} -> ${to.name}`);
  },
});
```

### 5. What happens during the switch

By default, when `switchPlaybackQuality` is executed, the SDK **keeps rendering the currently playing quality first** and **starts pulling the target quality stream asynchronously in the background**. Only after the target stream has been pulled successfully and becomes playable does the SDK stop the old video stream and complete the switch.

This means:

- **After the switch API is called, the old picture does not disappear immediately**.
- **In most cases, the business layer does not need to show a full-screen loading state immediately when the switch starts**.
- **It is recommended to update the current quality UI state in the `onSwitched` callback**, instead of proactively clearing the old picture when the switch is triggered.

### 6. Complete Example

```javascript
const streamList = [
  { name: '1080p', userId: 'anchor_1080p', bitrate: 2000 },
  { name: '720p', userId: 'anchor_720p', bitrate: 1000 },
  { name: '480p', userId: 'anchor_480p', bitrate: 500 },
];

await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'audience_123',
  userSig: 'xxx',
  roomId: 12345,
  scene: 'live',
  role: 'audience',
});

await trtc.callExperimentalAPI('switchPlaybackQuality', { streamList });

await trtc.startRemoteVideo({
  userId: 'anchor_720p',
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  view: document.getElementById('live-player'),
});

// When the user clicks the HD button
await trtc.callExperimentalAPI('switchPlaybackQuality', {
  quality: '1080p',
  onSwitched(from, to) {
    console.log(`switch success: ${from.name} -> ${to.name}`);
  },
});
```

## Auto Switch Mode

If you want the SDK to switch between quality levels automatically according to the current playback state, pass `quality: 'auto'` to enable auto mode.

### How to Enable It

```javascript
const streamList = [
  { name: '1080p', userId: 'anchor_1080p', bitrate: 2000 },
  { name: '720p', userId: 'anchor_720p', bitrate: 1000 },
  { name: '480p', userId: 'anchor_480p', bitrate: 500 },
];

await trtc.callExperimentalAPI('switchPlaybackQuality', { streamList });

await trtc.startRemoteVideo({
  userId: 'anchor_720p',
  streamType: TRTC.TYPE.STREAM_TYPE_MAIN,
  view: document.getElementById('live-player'),
});

await trtc.callExperimentalAPI('switchPlaybackQuality', {
  quality: 'auto',
  onSwitched(from, to) {
    console.log(`auto switch: ${from.name} -> ${to.name}`);
  },
});
```

### Default Strategy

In auto mode, the SDK sorts `streamList` from high to low by `streamList[].bitrate` and decides whether to switch based on current network and playback conditions.

#### Conditions for Downgrading

The SDK attempts to switch to a lower quality if any of the following conditions is met:

- **Weak network and low frame rate**: Downlink packet loss is high while the current decode frame rate is low.
- **Noticeable render freeze**: The SDK detects a relatively long rendering stall.

Default thresholds are as follows:

| Metric | Default Value |
| :--- | :--- |
| Downlink packet loss threshold | `20%` |
| Decode frame rate threshold | `5fps` |
| Render freeze duration threshold | `1500ms` |

#### Conditions for Upgrading

When network conditions recover, the SDK attempts to switch back to a higher quality if the following conditions are met:

- Downlink packet loss remains at a low level for a period of time.
- Enough time has passed since the last downgrade.
- The number of consecutive upgrade failures in the current session has not reached the limit.

Default thresholds are as follows:

| Metric | Default Value |
| :--- | :--- |
| Good packet loss threshold | `15%` |
| Upgrade cooldown time | `120s` |
| Maximum consecutive upgrade failures | `3` |

#### Decode Failure Fallback

If the current quality level encounters a video decode failure, the SDK automatically falls back to a lower level and records the highest stable quality level for the current session to avoid repeated upgrade failures.

> If you call `switchPlaybackQuality` again with a specific quality such as `quality: '720p'` while auto mode is enabled, the SDK exits auto mode and treats the operation as a manual switch.

## Difference from Dual Stream

Both `switchPlaybackQuality` and dual stream can be used to change playback quality, but they target different scenarios:

| Solution | Applicable Scenario | Characteristics |
| :--- | :--- | :--- |
| Dual stream | Multi-user calls, gallery layouts, switching between big and small stream under the same `userId` | Suitable for RTC multi-subscription optimization |
| `switchPlaybackQuality` | Single live playback, multi-resolution switching | Suitable for audience-side manual or automatic quality switching in live streaming |

If your scenario is **one anchor, multiple quality levels, and the audience only plays one of them at a time**, `switchPlaybackQuality` is the recommended solution.

## Best Practice Recommendations

If you want to balance default experience, weak-network adaptation, and explicit user selection, the following integration pattern is recommended:

1. **Use a middle quality as the default**: for example, start from `720p` for a better balance between startup experience and compatibility.
2. **Enable auto mode by default on mobile**: let the SDK downgrade automatically when weak network or render stalls are detected.
3. **Switch to a specified quality when the user makes a manual choice**: once the user selects `1080p`, `720p`, or `480p`, call `switchPlaybackQuality` with that specific `quality` to override auto mode.
4. **Use `onSwitched` to update UI state**: after a successful switch, update quality buttons, prompt text, or business metrics.

## FAQ

### 1. Why does nothing happen after calling the API?

Check the following first:

- Whether `switchPlaybackQuality({ streamList })` has been called once to cache the quality list.
- Whether the currently playing stream exists in `streamList`.
- Whether `quality` exactly matches `streamList[].name`.
- Whether the target quality is already the current one.

### 3. Why does auto mode not switch back to a higher quality?

Auto-upgrade depends not only on network recovery, but also on cooldown time, historical upgrade failures, and the recorded device capability ceiling. If a higher quality caused decode failures before, the SDK lowers the maximum target quality for later automatic upgrades.

### 4. Do I need to switch audio manually during a manual quality switch?

In main-stream switching scenarios, the SDK synchronizes audio switching automatically. In most cases, the business layer does not need to handle audio separately.

### 5. Can auto mode and manual mode be used together?

Yes. A common pattern is to enable auto mode by default and switch to a specific `quality` when the user explicitly selects one.

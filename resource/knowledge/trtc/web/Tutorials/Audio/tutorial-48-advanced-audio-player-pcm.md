---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-48-advanced-audio-player-pcm.md'
nav_path:
  - "Tutorials"
  - "Audio"
product: "trtc"
---
## Feature Description

This article describes how to use the AudioPlayer plugin to implement PCM audio playback functionality. The PCM player is suitable for scenarios such as AI conversations, speech synthesis (TTS), and real-time audio streams. It continuously inputs PCM data through the `input()` method for playback, and can mix the audio into the published stream to send to remote users.

The PCM player supports two working modes:
- **Realtime mode** (default): Suitable for low-latency scenarios like AI real-time conversations, clears buffer on pause/stop
- **Non-realtime mode**: Suitable for scenarios where audio is preloaded and played completely, preserves buffer data on pause/stop

## Experience Online Demo

<div style="margin: 20px 0;">
<details class="trtc-demo-details" style="border-radius: 10px; border: 1px solid #e5e6eb; overflow: hidden; box-shadow: 0 4px 14px rgba(0,82,217,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <summary style="padding: 14px 22px; background: linear-gradient(135deg, #006eff 0%, #0052d9 100%); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; list-style: none; user-select: none; display: flex; align-items: center; gap: 10px; transition: filter 0.2s;">
    <span class="trtc-demo-arrow" style="font-size: 14px; opacity: 0.9;">▶</span>
    <span class="trtc-demo-summary-text">Click to Run Demo</span>
  </summary>
  <div style="padding: 16px; background: #fff;">
<script>
(function(){var t=null;window.addEventListener('message',function(e){if(e.data&&e.data.type==='trtc-demo-resize'){var f=document.querySelector('.trtc-demo-iframe');if(f){f.style.height=e.data.height+'px';clearTimeout(t);t=setTimeout(function(){f.style.height=e.data.height+'px'},200)}}})})();
document.querySelectorAll('.trtc-demo-details').forEach(function(d){d.addEventListener('toggle',function(){var s=d.querySelector('.trtc-demo-summary-text'),a=d.querySelector('.trtc-demo-arrow');if(d.open){s&&(s.textContent='Click to Close Demo');a&&(a.textContent='▼')}else{s&&(s.textContent='Click to Run Demo');a&&(a.textContent='▶')}})});
</script>
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="PCM Playback Solution" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/advance-features/enable-audio-player-pcm/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Prerequisites

- TRTC version > 5.18.0
- Platforms supporting PCM audio playback:

  | Operating System | Browser Type | Minimum Browser Version |
  |:-------:|:-----------------|:---------:|
  | Mac OS  | Desktop Chrome   |    56+    |
  | Mac OS  | Desktop Safari   |    11+    |
  | Mac OS  | Desktop Firefox  |    56+    |
  | Mac OS  | Desktop Edge     |    80+    |
  | Windows | Desktop Chrome   |    56+    |
  | Windows | Desktop QQ Browser (Speed Mode) |   10.4+   |
  | Windows | Desktop Firefox  |    56+    |
  | Windows | Desktop Edge     |    80+    |
  |   iOS   | Mobile Safari    |    14+    |
  |   iOS   | WeChat Embedded Webpage |     ✔     |
  | Android | Mobile Chrome    |    81+    |
  | Android | WeChat Embedded Webpage (TBS Kernel) |     ✔     |
  | Android | Mobile QQ Browser |     ✖     |
  | HarmonyOS | Embedded Browser |     6.0+     |

## Implementation Process

### 1. Install and Register Plugin

```javascript
import TRTC from 'trtc-sdk-v5';
import AudioPlayer from 'trtc-sdk-v5/plugins/audio-player';

const trtc = TRTC.create({ plugins: [AudioPlayer] });
```

### 2. Enter Room and Enable Microphone

```javascript
await trtc.enterRoom({ roomId: 8888, sdkAppId, userId, userSig });
await trtc.startLocalAudio();
```

### 3. Create PCM Player

Use `trtc.startPlugin` to create a PCM player instance.

#### Realtime Mode (Suitable for AI Real-time Conversations)

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'ai-voice',
  sourceType: 'pcm',
  realtime: true, // Default value, can be omitted
  publish: true,  // Mix into published stream and send to remote users
  onTimeUpdate: (currentTime, duration) => {
    console.log(`Playback time: ${currentTime.toFixed(2)}s`);
  },
  onDurationChange: (duration) => {
    console.log(`Buffer duration: ${duration.toFixed(2)}s`);
  },
  onEnded: () => {
    console.log('Buffer playback completed');
  },
});
```

#### Non-realtime Mode (Suitable for Preloading Complete Playback)

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'tts-player',
  sourceType: 'pcm',
  realtime: false,
  publish: false,
  onTimeUpdate: (currentTime, duration) => {
    console.log(`${currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`);
  },
  onEnded: () => {
    console.log('Playback ended');
  },
});
```

### 4. Input PCM Data and Play

The PCM player inputs audio data through the `input()` method, supporting `Float32Array` and `Int16Array` formats, and supports any sample rate (automatically resampled to 48kHz internally).

> **Note**: After creating the player, you can immediately call `input()` to add data to the buffer, no need to wait for `start()`.

#### Realtime Mode Example

```javascript
// Start playback
await player.start();

// Continuously input PCM data (e.g., from AI speech synthesis streaming data)
player.input(float32Data, 48000);   // Float32Array, 48kHz
player.input(int16Data, 16000);     // Int16Array, 16kHz (automatically converted and resampled)

// Pause: Clear buffer
player.pause();

// Resume: Wait for new data input
player.resume();
player.input(newData, 16000);

// Stop: Clear buffer
player.stop();

// Restart new conversation
player.input(newSessionData, 16000);
await player.start();
```

#### Non-realtime Mode Example

```javascript
// First load all PCM data (can input before start)
for (const chunk of pcmChunks) {
  player.input(chunk, 16000);
}

// Start playback after data loading is complete
await player.start();

// Pause: Preserve buffer and playback position
player.pause();

// Resume: Continue from paused position
player.resume();

// Stop: Preserve buffer, reset to beginning
player.stop();

// Restart from beginning (no need to re-input)
await player.start();

// Continue adding data after stop
player.stop();
player.input(additionalData, 16000);
await player.start(); // Play all data from beginning (including newly added)
```

### 5. Multi-channel PCM Data

When input PCM data is in multi-channel interleaved format (e.g., stereo L R L R...), you need to specify the number of channels through the `channels` parameter. The plugin automatically downmixes multi-channel data to mono for playback.

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'stereo-pcm',
  sourceType: 'pcm',
  channels: 2, // Specify input data as stereo
  publish: true,
});

await player.start();
// Input stereo interleaved data [L0, R0, L1, R1, ...]
player.input(stereoInt16Data, 44100);
```

> ⚠️ **Important**: `channels` defaults to 1 (mono). If you don't specify `channels` and input multi-channel data, it will cause abnormal playback speed (e.g., stereo data played as mono will become half speed).

### 6. Destroy Player

When the player is no longer needed, call `stopPlugin` to destroy it:

```javascript
// Destroy specific player
await trtc.stopPlugin('AudioPlayer', { id: 'ai-voice' });
player = null; // Actively release reference to avoid memory leaks

// Destroy all players
await trtc.stopPlugin('AudioPlayer', { id: '*' });
```

> ⚠️ **Important**: After calling `stopPlugin` to destroy the player, be sure to set the player instance reference to `null`, otherwise the instance object cannot be garbage collected, causing memory leaks.

## API Reference

### trtc.startPlugin('AudioPlayer', options)

Create a PCM audio player instance.

#### options

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| id | `string` | ✅ | - | Player instance unique identifier |
| sourceType | `string` | ✅ | - | Audio source type, set to `'pcm'` |
| publish | `boolean` | ❌ | `false` | Whether to mix into published stream and send to remote users |
| channels | `number` | ❌ | `1` | PCM input data channel count (1~8), multi-channel data automatically downmixed to mono |
| realtime | `boolean \| object` | ❌ | `true` | Realtime mode configuration, see details below |
| onTimeUpdate | `function` | ❌ | - | Playback progress callback, parameters: `(currentTime: number, duration: number)` in seconds |
| onDurationChange | `function` | ❌ | - | Buffer duration change callback (triggered after input/clear), parameter: `(duration: number)` in seconds |
| onEnded | `function` | ❌ | - | Triggered when buffer data playback completes or stop() is called |
| onInputError | `function` | ❌ | - | Input data error callback, parameters: `(errMsg: string, inputIndex: number)` |

**Return value:** `Promise<AudioPlayerContext>` — Player instance

#### realtime Parameter Description

| Value | Description |
|------|------|
| `true` (default) | Realtime mode, clears buffer on pause/stop |
| `false` | Non-realtime mode, preserves buffer data on pause/stop |
| `{ maxDelay: number, discardAll: boolean }` | Realtime mode advanced configuration |

**Advanced Configuration:**

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `maxDelay` | `number` | `300` | Maximum delay threshold (milliseconds). When unplayed data duration in buffer exceeds this value, trigger discard strategy |
| `discardAll` | `boolean` | `false` | Discard strategy. When set to `true`, exceeding `maxDelay` will clear all buffered data; when set to `false`, no discard processing, data continues accumulating |

**`discardAll` Behavior Differences:**

| Scenario | `discardAll: true` | `discardAll: false` (default) |
|------|-------------------|---------------------------|
| Buffer < maxDelay | Normal playback | Normal playback |
| Buffer > maxDelay | Clear buffer, start playback from newly input data | No processing, data continues accumulating, delay keeps increasing |
| Data backlog after network fluctuation recovery | Discard backlog data, quickly return to realtime | All backlog data must be played before catching up to realtime |

> 💡 **Recommendation**: For latency-sensitive scenarios like AI real-time conversations, recommend setting `discardAll: true` to avoid continuous increase in playback delay due to network fluctuations or data backlog. `discardAll: false` is suitable for scenarios where no audio data loss is desired.

```javascript
// Recommended configuration for AI real-time conversations
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'ai-voice',
  sourceType: 'pcm',
  realtime: {
    maxDelay: 500,    // Maximum delay 500ms (default 300ms)
    discardAll: true, // Recommended: discard all buffered data when exceeding maxDelay to maintain low latency
  },
});
```

### Player Instance Methods

| Method | Description |
|------|------|
| `input(pcmData, sampleRate)` | Input PCM data, `pcmData` supports `Float32Array` and `Int16Array`, `sampleRate` is sample rate (e.g., 16000, 48000), automatically resampled to 48kHz internally |
| `clearInput()` | Clear all buffered data, `duration` and `currentTime` reset to 0 |
| `start()` | Start playback (from buffer beginning), returns Promise |
| `pause()` | Pause playback (realtime mode clears buffer) |
| `resume()` | Resume playback (only effective in paused state, invalid after stop, need to call start) |
| `stop()` | Stop playback (realtime mode clears buffer, non-realtime mode preserves buffer and resets playback position) |

### Player Instance Read-only Properties

| Property | Type | Description |
|------|------|------|
| `id` | `string` | Player instance ID |
| `sourceType` | `string` | Audio source type |
| `currentTime` | `number` | Current playback time (seconds) |
| `duration` | `number` | Buffer total duration (seconds) |
| `isStop` | `boolean` | Whether stopped |
| `isPause` | `boolean` | Whether paused |
| `isPlayEnd` | `boolean` | Whether playback ended (buffer playback completed) |

### Player Instance Read-write Properties

| Property | Type | Description |
|------|------|------|
| `publish` | `boolean` | Whether to mix into published stream |

### trtc.stopPlugin('AudioPlayer', options)

Destroy player instance.

#### options

| Parameter | Type | Description |
|------|------|------|
| id | `string` | Target player instance ID, pass `'*'` to destroy all instances |

**Example:**

```javascript
// Destroy specific player
await trtc.stopPlugin('AudioPlayer', { id: 'ai-voice' });

// Destroy all players
await trtc.stopPlugin('AudioPlayer', { id: '*' });

// Release player reference
player = null;
```

> ⚠️ **Important**: After calling `stopPlugin` to destroy the player, be sure to set the player instance reference to `null`, otherwise the instance object cannot be garbage collected, causing memory leaks.

## Common Issues

**1. Abnormal playback speed (slower) after inputting multi-channel PCM data**

Reason: Multi-channel interleaved data (e.g., stereo L R L R...) is treated as mono, doubling the sample count causes playback duration to double.

Solution: Specify the correct number of channels through the `channels` parameter when creating the player:

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'pcm',
  sourceType: 'pcm',
  channels: 2, // Stereo
});
```

**2. publish set to true but remote users cannot hear**

Solution: When using `publish: true`, you need to enter the room and publish audio stream first (call `trtc.startLocalAudio()`), ensure local audio is published before creating the player.

**3. Cannot play on iOS devices**

Solution: iOS browsers require audio playback to be triggered by user gestures, ensure `player.start()` is called within user click event callbacks.

**4. Data loss after pause in Realtime mode**

This is expected behavior. In Realtime mode, `pause()` clears the buffer, suitable for interrupting current responses in AI conversation scenarios. If you need to preserve buffer data, use non-realtime mode (`realtime: false`).

**5. Can I restart playback from beginning after stop in Non-realtime mode**

Yes. In non-realtime mode, `stop()` preserves buffer data and resets playback position, calling `start()` again will play from the beginning, no need to re-`input()` data.

**6. How to play multiple PCM audio simultaneously**

AudioPlayer supports multi-instance management, create multiple players with different `id`s:

```javascript
const voice1 = await trtc.startPlugin('AudioPlayer', {
  id: 'voice1',
  sourceType: 'pcm',
  publish: true,
});

const voice2 = await trtc.startPlugin('AudioPlayer', {
  id: 'voice2',
  sourceType: 'pcm',
  publish: true,
});

await voice1.start();
await voice2.start();

voice1.input(data1, 16000);
voice2.input(data2, 16000);
```

**7. PCM data sample rate mismatch with player**

The `input()` method supports input at any sample rate (e.g., 8000, 16000, 24000, 44100, 48000, etc.), the plugin automatically resamples to 48kHz internally, no manual conversion needed. Just pass the correct sample rate parameter when calling `input()`:

```javascript
// 16kHz TTS data
player.input(ttsData, 16000);

// 44.1kHz audio data
player.input(audioData, 44100);
```

**8. Increasing playback delay in Realtime mode**

Reason: When `input()` data rate exceeds playback consumption rate (e.g., large amount of data arrives at once after network fluctuation recovery), the buffer continues to accumulate, causing users to hear audio increasingly lagging behind realtime.

Solution: Enable `discardAll: true` when creating the player, automatically discard old data when buffer accumulation exceeds `maxDelay`, keeping playback delay controllable:

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'ai-voice',
  sourceType: 'pcm',
  realtime: {
    maxDelay: 300,    // Maximum allowed delay 300ms
    discardAll: true, // Discard all accumulated data when exceeding threshold
  },
});
```

> **Note**: `discardAll` defaults to `false`, meaning data is not automatically discarded. In normal AI TTS streaming output scenarios (data rate ≈ realtime playback rate), accumulation issues usually don't occur. But if latency-sensitive, recommend explicitly setting `discardAll: true`.

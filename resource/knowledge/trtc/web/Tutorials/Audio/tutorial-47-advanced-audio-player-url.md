---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-47-advanced-audio-player-url.md'
nav_path:
  - "Tutorials"
  - "Audio"
product: "trtc"
---
## Feature Description

This article describes how to use the AudioPlayer plugin to implement background music functionality during calls. The AudioPlayer plugin supports playing audio files in mp3, ogg, wav, and flac formats, and can mix the audio into the published stream to send to remote users.

Compared to the AudioMixer plugin, the AudioPlayer plugin provides a more flexible player instantiation control method, supporting more flexible playback control (start/pause/resume/stop/seek) and dynamic parameter modification.

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
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Background Music Implementation Solution" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/advance-features/enable-audio-player-bgm/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Prerequisites

- TRTC version > 5.18.0
- Platforms supporting background music during calls:

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

### 3. Create Player and Play Background Music

Use `trtc.startPlugin` to create a URL player instance, set `publish: true` to mix the audio into the published stream and send to remote users.

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'bgm',
  sourceType: 'url',
  url: 'https://example.com/music.mp3',
  loop: true,
  volume: 0.5,
  publish: true,
  onTimeUpdate: (currentTime, duration) => {
    console.log(`Playback progress: ${currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`);
  },
  onDurationChange: (duration) => {
    console.log(`Audio duration: ${duration.toFixed(2)}s`);
  },
  onEnded: () => {
    console.log('Playback ended');
  },
});

// Start playback
await player.start();
```

### 4. Control Player

Control playback through player instance methods:

```javascript
// Pause playback
player.pause();

// Resume playback
player.resume();

// Seek to specified time (seconds)
player.seek(30);

// Stop playback (reset to beginning)
player.stop();

// Restart playback
await player.start();
```

Dynamically modify parameters through instance properties:

```javascript
// Adjust volume (0~1)
player.volume = 0.8;

// Toggle loop playback
player.loop = false;

// Adjust playback rate
player.playbackRate = 1.5;

// Dynamically toggle whether to send to remote users
player.publish = false;
```

### 5. Destroy Player

When the player is no longer needed, call `stopPlugin` to destroy it:

```javascript
// Destroy specific player
await trtc.stopPlugin('AudioPlayer', { id: 'bgm' });
player = null; // Actively release reference to avoid memory leaks

// Destroy all players
await trtc.stopPlugin('AudioPlayer', { id: '*' });
```

> ⚠️ **Important**: After calling `stopPlugin` to destroy the player, be sure to set the player instance reference to `null`, otherwise the instance object cannot be garbage collected, causing memory leaks.

## API Reference

### trtc.startPlugin('AudioPlayer', options)

Create an audio player instance.

#### options

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| id | `string` | ✅ | - | Player instance unique identifier |
| sourceType | `string` | ✅ | - | Audio source type, set to `'url'` |
| url | `string` | ✅ | - | Audio file URL, supports mp3/ogg/wav/flac formats and blob/data URLs |
| publish | `boolean` | ❌ | `false` | Whether to mix into published stream and send to remote users |
| loop | `boolean` | ❌ | `false` | Whether to loop playback |
| volume | `number` | ❌ | `1` | Playback volume (0~1) |
| playbackRate | `number` | ❌ | `1` | Playback rate |
| onTimeUpdate | `function` | ❌ | - | Playback progress callback, parameters: `(currentTime: number, duration: number)` in seconds |
| onDurationChange | `function` | ❌ | - | Audio duration change callback, parameter: `(duration: number)` in seconds |
| onEnded | `function` | ❌ | - | Playback end callback (not triggered at each loop end in loop mode) |

**Return value:** `Promise<AudioPlayerContext>` — Player instance

**Example:**

```javascript
const player = await trtc.startPlugin('AudioPlayer', {
  id: 'bgm',
  sourceType: 'url',
  url: 'https://example.com/music.mp3',
  loop: true,
  volume: 0.5,
  playbackRate: 1.0,
  publish: true,
  onTimeUpdate: (currentTime, duration) => {
    console.log(`${currentTime}s / ${duration}s`);
  },
  onDurationChange: (duration) => {
    console.log(`Audio duration: ${duration}s`);
  },
  onEnded: () => {
    console.log('Playback ended');
  },
});
```

### Player Instance Methods

| Method | Description |
|------|------|
| `start()` | Start playback, returns Promise |
| `pause()` | Pause playback |
| `resume()` | Resume playback from paused position |
| `stop()` | Stop playback, reset to beginning |
| `seek(time)` | Seek to specified time (seconds) |

### Player Instance Read-only Properties

| Property | Type | Description |
|------|------|------|
| `id` | `string` | Player instance ID |
| `sourceType` | `string` | Audio source type |
| `currentTime` | `number` | Current playback time (seconds) |
| `duration` | `number` | Audio total duration (seconds) |
| `isStop` | `boolean` | Whether stopped |
| `isPause` | `boolean` | Whether paused |
| `isPlayEnd` | `boolean` | Whether playback ended |

### Player Instance Read-write Properties

| Property | Type | Description |
|------|------|------|
| `volume` | `number` | Playback volume (0~1) |
| `loop` | `boolean` | Whether to loop playback |
| `playbackRate` | `number` | Playback rate |
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
await trtc.stopPlugin('AudioPlayer', { id: 'bgm' });

// Destroy all players
await trtc.stopPlugin('AudioPlayer', { id: '*' });

// Release player reference
player = null;
```
> ⚠️ **Important**: After calling `stopPlugin` to destroy the player, be sure to set the player instance reference to `null`, otherwise the instance object cannot be garbage collected, causing memory leaks.

## Common Issues

**1. Cross-origin error occurs**

Example: Access to audio at XXX from origin XXX has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

Solution: You need to configure CORS protocol for online music files, ensuring the audio resource server allows cross-origin access.

**2. Audio format not supported**

Example: NotSupportedError: The operation is not supported.

Solution: Please use browser-supported audio formats (recommended mp3, ogg, wav, flac).

**3. publish set to true but remote users cannot hear**

Solution: When using `publish: true`, you need to enter the room and publish audio stream first (call `trtc.startLocalAudio()`), ensure local audio is published before creating the player.

**4. Cannot play on iOS devices**

Solution: iOS browsers require audio playback to be triggered by user gestures, ensure `player.start()` is called within user click event callbacks.

**5. How to play multiple background music simultaneously**

AudioPlayer supports multi-instance management, create multiple players with different `id`s:

```javascript
const bgm1 = await trtc.startPlugin('AudioPlayer', {
  id: 'bgm1',
  sourceType: 'url',
  url: 'https://example.com/music1.mp3',
  publish: true,
});

const bgm2 = await trtc.startPlugin('AudioPlayer', {
  id: 'bgm2',
  sourceType: 'url',
  url: 'https://example.com/music2.mp3',
  publish: true,
});

await bgm1.start();
await bgm2.start();
```

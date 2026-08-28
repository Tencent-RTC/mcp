## Overview

TRTC Web SDK v5 provides a plugin system that supports on-demand loading of various audio and video enhancement capabilities. Advantages of the plugin system:

- **Modular Design**: Import only what you need, reducing the main bundle size
- **Independent Upgrades**: Plugin versions are managed independently for easier iteration
- **Unified Interface**: All plugins use the same start, update, and stop APIs
- **Flexible Combination**: Use multiple plugins simultaneously to meet complex business scenarios

## Plugin List

### Video Enhancement

| Plugin Name | Description | Version Requirement | Package Requirement | Static Assets | Documentation |
|---------|---------|---------|---------|---------|---------|
| **Beauty** | Professional beauty filters with 6 parameters (smoothing, whitening, face slimming, etc.) + 10 2D stickers | ≥ 5.5.0 | Professional Edition | - | [Enable Advanced Beauty](https://trtc.io/document/67329) |
<!-- BasicBeauty is for Chinese market only, not exposed in English docs -->
| **VirtualBackground** | Virtual background with blur, image background, and face centering | ≥ 5.2.0 | Premium Edition | Required | {@tutorial 36-advanced-virtual-background} |
| **Watermark** | Video watermark with image overlay support | ≥ 5.3.2 | None | - | {@tutorial 29-advanced-water-mark} |
| **VideoMixer** | Video mixing to combine camera, screen, text, image, and video into one stream | ≥ 5.12.0 | None | - | {@tutorial 40-advanced-video-mixer} |
| **FaceDetection** | Face detection to monitor face state changes in real-time | ≥ 5.15.0 | None | Required | {@tutorial 43-advanced-face-detection} |

### Audio Enhancement

| Plugin Name | Description | Version Requirement | Package Requirement | Static Assets | Documentation |
|---------|---------|---------|---------|---------|---------|
| **AudioMixer** | Background music with support for multiple tracks, volume control, looping, and seeking | ≥ 5.1.0 | None | - | {@tutorial 22-advanced-audio-mixer} |
| **AIDenoiser** | AI noise reduction with support for far-field cancellation mode | - | Exclusive Edition | Required | {@tutorial 35-advanced-ai-denoiser} |
| **VoiceChanger** | Voice effects with 11 voice types (child, loli, uncle, etc.) | ≥ 5.10.0 | Premium Edition | - | {@tutorial 37-advanced-voice-changer} |
| **RealtimeTranscriber** | Real-time speech transcription and translation, converting audio to text with multi-language translation | ≥ 5.15.0 | None | - | {@tutorial 42-advanced-realtime-transcriber} |

### Streaming & Mixing

| Plugin Name | Description | Version Requirement | Package Requirement | Static Assets | Documentation |
|---------|---------|---------|---------|---------|---------|
| **CDNStreaming** | CDN relay with cloud mixing, CDN push, and relay back to TRTC room | ≥ 5.1.0 | None | - | {@tutorial 26-advanced-publish-cdn-stream} |
| **CrossRoom** | Cross-room connection for audio/video calls between different rooms | ≥ 5.8.0 | None | - | {@tutorial 30-advanced-cross-room-link} |

### Extensions

| Plugin Name | Description | Version Requirement | Package Requirement | Static Assets | Documentation |
|---------|---------|---------|---------|---------|---------|
| **DeviceDetector** | Device detection for camera, microphone, speaker, and network with default UI | ≥ 5.8.0 | None | - | {@tutorial 23-advanced-support-detection} |
| **Debug** | Debug mode with full log upload/export and audio/video dump | ≥ 5.8.0 | None | - | {@tutorial 18-basic-debug} |
| **SmallStreamAutoSwitcher** | Automatic dual-stream switching for smooth streaming in poor network | ≥ 5.11.0 | None | - | {@tutorial 41-advanced-small-stream-auto-switcher} |
<!-- | **CustomEncryption** | Custom encryption for end-to-end audio/video encryption with built-in or custom algorithms | - | Contact us | - | - | -->

> **Notes:**
> - **Version Requirement**: Minimum TRTC SDK version required to use the plugin
> - **Package Requirement**: TRTC monthly package edition required, see [Package Billing](https://cloud.tencent.com/document/product/647/85386)
> - **Static Assets**: Whether the plugin requires deploying the `node_modules/trtc-sdk-v5/assets` directory to CDN

## Standard Usage Flow

### 1. Import and Register Plugins

Register plugins in the `plugins` array when creating a TRTC instance:

```javascript
import TRTC from 'trtc-sdk-v5';
import { VirtualBackground } from 'trtc-sdk-v5/plugins/video-effect/virtual-background';
import { AIDenoiser } from 'trtc-sdk-v5/plugins/ai-denoiser';

const trtc = TRTC.create({
  plugins: [VirtualBackground, AIDenoiser],
  assetsPath: 'https://your-cdn/assets' // If plugins require static assets
});
```

### 2. Start Plugin

Use `trtc.startPlugin(pluginName, options)` to start a plugin:

```javascript
// Plugins with user authentication
await trtc.startPlugin('VirtualBackground', {
  sdkAppId: 123456,
  userId: 'user_123',
  userSig: 'XXXXXXXX',
  type: 'blur',
  blurLevel: 3
});
```

### 3. Update Parameters (Optional)

Use `trtc.updatePlugin(pluginName, options)` to dynamically update plugin parameters:

```javascript
await trtc.updatePlugin('VirtualBackground', {
  type: 'image',
  imageUrl: 'https://example.com/background.jpg'
});
```

### 4. Stop Plugin

Use `trtc.stopPlugin(pluginName)` to stop a plugin:

```javascript
await trtc.stopPlugin('VirtualBackground');
```

## Special Usage

### AudioMixer (Background Music) - ID-Based Grouping

AudioMixer uses a unique `id` to identify each background music track, with independent lifecycle for each id:

```javascript
// Start first background music
await trtc.startPlugin('AudioMixer', {
  id: 'bgm1',
  url: './music1.mp3',
  loop: true,
  volume: 0.5
});

// Start second background music simultaneously (different id)
await trtc.startPlugin('AudioMixer', {
  id: 'bgm2',
  url: './music2.mp3',
  volume: 0.3
});

// Update first background music
await trtc.updatePlugin('AudioMixer', {
  id: 'bgm1',
  volume: 0.8,
  operation: 'pause' // pause | resume
});

// Stop first background music
await trtc.stopPlugin('AudioMixer', {
  id: 'bgm1'
});
```

**Features:**
- ID-based grouping with independent lifecycle for each id
- Support multiple background music tracks simultaneously (different ids)
- Same id cannot be started twice consecutively, must stop first
- Support pause, resume, seek operations

### VideoMixer - Multi-Source Management

VideoMixer supports dynamically managing multiple input sources with unique `id` for each source:

```javascript
// Start mixing and get output track
const { track } = await trtc.startPlugin('VideoMixer', {
  canvasInfo: { width: 1920, height: 1080 },
  camera: [{ id: 'camera1', layout: { x: 0, y: 0, width: 640, height: 480, zIndex: 1 } }]
});

// Dynamically add screen share
await trtc.updatePlugin('VideoMixer', {
  screen: [{ id: 'screen1', layout: { x: 640, y: 0, width: 1280, height: 1080, zIndex: 0 } }]
});

// Remove camera (pass empty array)
await trtc.updatePlugin('VideoMixer', {
  camera: []
});

// Publish mixed track
await trtc.startLocalVideo({
  option: {
    videoTrack: track,
    profile: { width: 1920, height: 1080, bitrate: 2000 }
  }
});
```

**Features:**
- Support multiple start/update calls
- Returns `track` for custom publishing
- Manage multiple input sources via arrays (camera, screen, text, image, video)
- Note: PC browsers only

### TRTCVideoDecoder - Auto-Start

TRTCVideoDecoder automatically starts fallback logic on decode failure after registration, no manual `startPlugin` needed:

```javascript
import TRTCVideoDecoder from 'trtc-sdk-v5/plugins/video-decoder';

const trtc = TRTC.create({
  plugins: [TRTCVideoDecoder],
  assetsPath: 'https://your-cdn/assets'
});

// No need to manually startPlugin, plugin auto-starts on decode failure
```

### SmallStreamAutoSwitcher - No Update Support

SmallStreamAutoSwitcher runs automatically after start, does not support `updatePlugin`:

```javascript
// Use default strategy
trtc.startPlugin('SmallStreamAutoSwitcher');

// Custom strategy (only configurable at start)
trtc.startPlugin('SmallStreamAutoSwitcher', {
  maxAutoSwitchToSmallCount: 1, // Switch only once
  poorDuration: 5000,            // Switch after 5s of poor network
  goodDuration: 30000            // Switch back after 30s of good network
});
```

**Features:**
- Does not support `updatePlugin`
- Automatically switches streams based on network conditions
- Note: Requires dual-stream feature

### FaceDetection - Callback-Driven

FaceDetection uses callbacks to get detection results with smart debouncing:

```javascript
await trtc.startPlugin('FaceDetection', {
  onFaceDetectionStateChanged: (hasFace) => {
    if (hasFace) {
      console.log('Face detected');
    } else {
      console.log('Face lost'); // Delayed trigger to avoid false positives
    }
  },
  detectionInterval: 300,    // Detection interval (ms)
  minConfidence: 0.8,        // Minimum confidence
  missingTimeout: 1000       // Face loss confirmation time (ms)
});
```

**Features:**
- Smart debouncing: immediate trigger on appearance, delayed on disappearance
- Auto-syncs with video stream state (Mute/Unmute)
- Note: Camera must be started first

### DeviceDetector - Returns Detection Results

DeviceDetector provides a default UI and returns device and network detection results:

```javascript
import { DeviceDetector } from 'trtc-sdk-v5/plugins/device-detector';

const trtc = TRTC.create({ plugins: [DeviceDetector] });

// Device only
const result = await trtc.startPlugin('DeviceDetector');

// Device + Network
const resultWithNetwork = await trtc.startPlugin('DeviceDetector', {
  networkDetect: { sdkAppId, userId, userSig }
});

// Result example
// result.camera: { isSuccess: boolean, device: {...} }
// result.microphone: { isSuccess: boolean, device: {...} }
// result.speaker: { isSuccess: boolean, device: {...} }
// result.network: { isSuccess: boolean, result: { quality, rtt } }
```

**Features:**
- Provides default detection UI with i18n support
- Returns detection results for subsequent logic
- Supports device-only or device + network detection

### Debug - Auto-Start

Debug plugin for log upload/export and audio/video dump, built-in since v5.8.4:

```javascript
// v5.8.4+: No import needed, add ?trtcDebug=1 to URL to open panel

// v5.8.3 and below: Import required
import { Debug } from 'trtc-sdk-v5/plugins/debug';
const trtc = TRTC.create({ plugins: [Debug] });
// Auto-opens in dev environment, add ?trtcDebug=1 in production

// Stop debug mode
trtc.stopPlugin('Debug');
```

**Features:**
- Built-in since v5.8.4, no external import needed
- Auto-opens panel in dev environment
- Supports log upload/export, audio/video dump

## Static Assets Deployment

Some plugins require deploying static asset files (WebAssembly, model files, etc.):

### 1. Publish Asset Files

Publish the `node_modules/trtc-sdk-v5/assets` directory to CDN or static server:

```bash
# Example: Copy to public directory
cp -r node_modules/trtc-sdk-v5/assets ./public/assets

# Or upload to CDN
# https://your-cdn.com/assets/
```

### 2. Configure assetsPath

Pass the asset path when creating TRTC instance:

```javascript
const trtc = TRTC.create({
  plugins: [VirtualBackground, AIDenoiser],
  assetsPath: 'https://your-cdn.com/assets'
});
```

### 3. Notes

- Enable CORS policy if asset domain differs from app domain
- Assets must be deployed on HTTPS (HTTP blocked by browser security policy)
- SDK versions below v5.10.0 may require deploying additional files (

## Related Links

- [TRTC Web SDK API Documentation](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/index.html)
- [Package Billing](https://cloud.tencent.com/document/product/647/85386)
- [Online Demo](https://web.sdk.qcloud.com/trtc/webrtc/demo/api-sample/index.html)

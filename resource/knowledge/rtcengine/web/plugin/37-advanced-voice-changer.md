## Feature Description

This document describes how to use the Voice Changer Plugin.

## Prerequisites

- Pricing see [RTC-Engine Packages](https://trtc.io/document/56025#f10b65d1-6e8d-41e3-8686-84909b00a1a2).
- TRTC Web SDK version >= 5.10
- Supported browsers: Chrome 66+, Edge 79+, Safari 15+, Firefox 76+, Chrome for Android 126+

## Implementation Process

### 1. Import and register the plugin

```javascript
import { VoiceChanger } from 'trtc-sdk-v5/plugins/voice-changer';

let trtc = TRTC.create({ plugins: [VoiceChanger] });
```

### 2. Enable microphone

```javascript
await trtc.startLocalAudio();
```

### 3. Use the voice changer plugin

```javascript
await trtc.startPlugin('VoiceChanger', {
  voiceType: 1,
  sdkAppId: 123456,
  userId: 'user_123',
  userSig: 'XXXXXXXX'
});

// Update parameters after activation
await trtc.updatePlugin('VoiceChanger', {
  voiceType: 2,
});

// Disable the plugin before stopping microphone
await trtc.stopPlugin('VoiceChanger');
await trtc.stopLocalAudio();
```

## API Reference

### trtc.startPlugin('VoiceChanger', options)

Enable voice changing effects

#### options
| Name       | Type     | Attributes                                                     | Description |
|------------|----------|----------------------------------------------------------------|-------------|
| sdkAppId   | `number` | Current application's sdkAppId                                 |
| userId     | `string` | Current user's userId                                          |
| userSig    | `string` | Current user's userSig                                         |
| voiceType  | `number` | 1-Mischievous Kid 2-Loli 3-Uncle 4-Heavy Metal 5-Cold 6-Foreign Accent 7-Caged Beast 8-Otaku 9-Strong Current 10-Heavy Machinery 11-Ethereal |

**Example:**

```javascript
await trtc.startLocalAudio();
await trtc.startPlugin('VoiceChanger', {
  voiceType: 1,
  sdkAppId: 123456,
  userId: 'user_123',
  userSig: 'XXXXXXXX'
});
```

### trtc.updatePlugin('VoiceChanger', options)

Modify voice changing effects

#### options

| Name       | Type     | Attributes   | Description                         |
|------------|----------|--------------|-------------------------------------|
| voiceType  | `number` | 1-Mischievous Kid 2-Loli 3-Uncle 4-Heavy Metal 5-Cold 6-Foreign Accent 7-Caged Beast 8-Otaku 9-Strong Current 10-Heavy Machinery 11-Ethereal |

**Example:**

```javascript
await trtc.updatePlugin('VoiceChanger', {
  voiceType: 2,
});
```

### trtc.stopPlugin('VoiceChanger')

Disable voice changing effects
```javascript
// Disable the plugin before stopping microphone
await trtc.stopPlugin('VoiceChanger');
await trtc.stopLocalAudio();
```

## Function Description

This document details how to use the TRTC Web SDK's Face Detection plugin to monitor real-time face presence changes in camera video streams. The plugin employs intelligent debounce logic, triggering callbacks only when face appearance/disappearance states genuinely change, preventing false positives caused by lighting variations or brief obstructions.

## Prerequisites

- TRTC Web SDK version >= 5.15.0
- Camera video stream must be enabled first.

### Platform Compatibility

| Platform | Operating System | Browser Version | Notes |
| :--- | :--- | :--- | :--- |
| Web | Windows | Chrome 90+, Firefox 90+, Edge 97+ | Recommended: Latest Chrome browser (with hardware acceleration enabled) |
| Web | Mac | Chrome 98+, Firefox 96+, Safari 15+ | 2019 or newer MacBook recommended |
| Web | Android | Chrome、Firefox| Use of Chrome or Firefox is recommended |
| Web | iOS | Chrome、Safari、Firefox | Use of Chrome or Safari is recommended |

## Implementation Steps

### Deploying Static Resources

The plugin relies on static resource files. To ensure the browser can load and run these files correctly, you need to complete the following steps:

1.  Publish the `node_modules/trtc-sdk-v5/assets` directory to your CDN or static resource server.
2.  Pass your CDN address to the `assetsPath` parameter when creating the TRTC instance, e.g., `TRTC.create({ assetsPath: 'https://xxxx/assets' })`. The SDK will load the necessary resource files on demand.

> - If your SDK version is lower than `v5.10.0`, you need to download and extract https://web.sdk.qcloud.com/trtc/webrtc/v5/assets/assets.zip, then publish it to your CDN or static resource server.
> - If the Host URL of the files differs from your web application's Host URL, you need to enable CORS policy for the file domain.
> - Do not host the directory files under an HTTP service, as loading HTTP resources under an HTTPS domain will be blocked by the browser's security policy.

### Registering the Plugin

```javascript
import { FaceDetection } from 'trtc-sdk-v5/plugins/video-effect/face-detection';

const trtc = TRTC.create({
  plugins: [FaceDetection],
  assetsPath: 'https://xxxx/assets'  // Replace with your static resource address
});
```

### Starting the Local Camera

```javascript
await trtc.startLocalVideo();
```

### Enabling the Face Detection Plugin

```javascript
await trtc.startPlugin('FaceDetection', {
  onFaceDetectionStateChanged: (hasFace) => {
    if (hasFace) {
      console.log('Face detected');
      // Execute business logic for face appearance
    } else {
      console.log('Face disappeared');
      // Execute business logic for face disappearance
    }
  },
  detectionInterval: 300,    // Detection interval in ms (Optional, default: 300)
  minConfidence: 0.8,        // Minimum confidence threshold (Optional, default: 0.8)
  missingTimeout: 1000       // Disappearance confirmation time in ms (Optional, default: 1000)
});
```

### Updating Parameters as Needed

```javascript
// Update detection parameters - increase sensitivity
await trtc.updatePlugin('FaceDetection', {
  onFaceDetectionStateChanged: (hasFace) => {
    console.log('Updated detection state:', hasFace);
  },
  detectionInterval: 200,    // Shorter interval for higher real-time performance
  minConfidence: 0.7,        // Lower threshold for higher sensitivity
  missingTimeout: 1500       // Longer timeout to reduce false negatives
});
```

### Disabling Face Detection

```javascript
await trtc.stopPlugin('FaceDetection');
```

## Core Features

### Intelligent Debounce Logic

The plugin uses an **asymmetric debounce mechanism** to ensure state change accuracy:

- **Face appears (true)**: Triggered immediately for real-time response.
- **Face disappears (false)**: Triggered after a delay, requiring the `missingTimeout` condition to be met for confirmation.

This design effectively prevents false positives caused by:
- Brief head turns or looking down
- Sudden lighting changes
- Temporary obstructions

### Video Stream State Synchronization

The plugin automatically handles local video stream state changes:

| Scenario | Plugin Behavior | Callback Trigger |
| :--- | :--- | :--- |
| Video muted (Mute) | Pauses detection | Triggers once with `hasFace: false` |
| Video resumed (Unmute) | Resumes detection | Triggers callback based on actual state |

## API Documentation

### trtc.startPlugin('FaceDetection', options)

Used to start the Face Detection plugin.

#### options

| Name | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `onFaceDetectionStateChanged` | `(hasFace: boolean) => void` | **Required** | Callback function for face state changes (triggered only on genuine state change) |
| `detectionInterval` | number | Optional | Detection interval time (ms), range: 100-5000, default: 300 |
| `minConfidence` | number | Optional | Minimum face confidence threshold, range: 0-1, default: 0.8 |
| `missingTimeout` | number | Optional | Face disappearance confirmation time (ms), range: 0-5000, default: 1000 |

**Example:**

```javascript
await trtc.startPlugin('FaceDetection', {
  onFaceDetectionStateChanged: (hasFace) => {
    if (hasFace) {
      console.log('Face appeared');
    } else {
      console.log('Face disappeared');
    }
  },
  detectionInterval: 300,
  minConfidence: 0.8,
  missingTimeout: 1000
});
```

### trtc.updatePlugin('FaceDetection', options)

Used to modify face detection parameters.

#### options

| Name | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `onFaceDetectionStateChanged` | `(hasFace: boolean) => void` | Optional | Callback function for face state changes |
| `detectionInterval` | number | Optional | Detection interval time (ms), range: 100-5000 |
| `minConfidence` | number | Optional | Minimum face confidence threshold, range: 0-1 |
| `missingTimeout` | number | Optional | Face disappearance confirmation time (ms), range: 0-5000 |

**Example:**

```javascript
await trtc.updatePlugin('FaceDetection', {
  detectionInterval: 200,
  minConfidence: 0.7,
  missingTimeout: 1500
});
```

### trtc.stopPlugin('FaceDetection')

Stops the Face Detection plugin.

## FAQs

**1. How to adjust detection sensitivity?**

Adjust sensitivity by combining these parameters:
- **Increase sensitivity**: Lower `minConfidence`, shorten `detectionInterval`
- **Decrease sensitivity**: Raise `minConfidence`, lengthen `missingTimeout`

**2. Do I need to restart detection after the video stream recovers?**

No. The plugin automatically handles video stream state changes and resumes detection upon recovery.

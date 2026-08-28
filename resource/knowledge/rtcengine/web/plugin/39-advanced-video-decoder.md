## Feature Description

This document introduces how to use the TRTCVideoDecoder plugin to enable video decoder fallback capability. The plugin supports fallback to software decoding when regular decoding fails.

## Prerequisites

- TRTC Web SDK version >= 5.9.0

- Browser version: Chrome 141+, Edge 141+, and other Chromium-based browsers 141+ (Safari and Firefox are not supported)

## Implementation Steps

### Deploy Static Resources

The plugin relies on some static resource files. To ensure that the browser can load and run these files properly, you need to complete the following steps:
  1. Publish the `node_modules/trtc-sdk-v5/assets` directory to a CDN or static resource server.
  2. Pass your CDN address to the `assetsPath` parameter when creating the `trtc` instance, for example: `TRTC.create({ assetsPath: 'https://xxx/assets' })`. The SDK will load the required resource files as needed.
  > - If your version is below `v5.10.0`, you need to publish the `videodec.wasm` and `videodec_simd.wasm` files from the `node_modules/trtc-sdk-v5/plugins/video-decoder` directory to the CDN, and ensure they are in the same public directory, such as `xxx/assets`.
  > - If the host URL of the directory files is different from the host URL of the web application, you need to enable the CORS policy for the file domain.
  > - Do not place the directory files under an HTTP service, as loading HTTP resources under an HTTPS domain will be blocked by browser security policies.

### 2. Import and Register Plugin

```javascript
import TRTCVideoDecoder from 'trtc-sdk-v5/plugins/video-decoder';

const trtc = TRTC.create({ plugins: [TRTCVideoDecoder], assetsPath: 'https://example.com/assets/' });
```

## Plugin Activation

The plugin functionality will automatically activate the fallback logic when SDK regular decoding fails, using software decoding method to decode.

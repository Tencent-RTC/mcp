## Function Description

This document will describe how to implement the virtual background feature during a call.

## Prerequisites

- Pricing see [RTC-Engine Packages](https://trtc.io/document/56025).
- [TRTC SDK](https://www.npmjs.com/package/trtc-sdk-v5) version must be >= 5.5.0
- System and configuration requirements for various platforms are as follows:

| Platform | Operating System | Browser Version | FPS | Recommended Configuration | Remarks |
| --- | --- | --- | --- | --- | --- |
| Web | Windows | Chrome 90+<br>Firefox 90+<br>Edge 97+ | 30 | Memory: 16GB<br>CPU: i5-10500<br>GPU: Dedicated 2GB | It is recommended to use the latest version of Chrome browser<br><b> (Enable hardware acceleration in the browser)</b> |
| 15 | Memory: 8GB<br>CPU: i3-8300<br>GPU: Integrated Intel 1GB |  |  |  |  |
| Mac | Chrome 98+<br>Firefox 96+<br>Safari 15+ | 30 | 2019 MacBook<br>Memory: 16GB (2667MHz)<br>CPU: i7 (6-core 2.60GHz)<br>GPU: AMD Radeon 5300M |  |  |
| Android | Chrome<br>Firefox Browser

<td rowspan="1" colspan="1">30 | High-end devices (e.g., Qualcomm Snapdragon 8 Gen1) |  |  |  |
| 20 | Mid-range devices (e.g., MediaTek Dimensity 8000-MAX) |  |  |  |  |
| 10 | Low-end devices (e.g., Qualcomm Snapdragon 660) |  |  |  |  |
| iOS | Chrome<br>Safari<br>Firefox | 30 | iPhone 13 | - Requires iOS 14.4 or above<br>- It is recommended to use Chrome or Safari browsers |  |
| 20 | iPhone XR |  |  |  |  |

## Implementation Steps

### Deploying Static Resources

This plugin relies on certain static resource files. To ensure that the browser can load and run these files properly, follow these steps:
1. Publish the `node_modules/trtc-sdk-v5/assets` directory to a CDN or a static resource server.
2. Pass your CDN URL to the `assetsPath` parameter when creating the `trtc` instance, for example: `TRTC.create({ assetsPath: 'https://xxxx/assets' })`. The SDK will load the required resource files as needed.
  > - If your version is below `v5.10.0`, you need to download and extract [assets.zip](https://web.sdk.qcloud.com/trtc/webrtc/v5/assets/assets.zip), then publish it to a CDN or a static resource server.
  > - If the Host URL of the files in the directory is different from the Host URL of the web application, you need to enable the CORS policy for the file domain.
  > - Do not place the directory files under an HTTP service, as loading HTTP resources from an HTTPS domain will be blocked by browser security policies.
  > - If you are using the ​**Face Centering** feature after version `v5.11.0`, please redeploy the assets.

### Checking Browser Support (v5.8.1+)
```javascript
import { VirtualBackground } from 'trtc-sdk-v5/plugins/video-effect/virtual-background';
if (!VirtualBackground.isSupported()) {
    // Virtual background is not supported
}
```
### Registering the Plugin

```javascript
import { VirtualBackground } from 'trtc-sdk-v5/plugins/video-effect/virtual-background';

const trtc = TRTC.create({ plugins: [VirtualBackground], assetsPath: 'https://xxxx/assets' });
```

### Starting the Local Camera

```javascript
await trtc.startLocalVideo();
```

### Enabling the Virtual Background Plugin

```javascript
await trtc.startPlugin('VirtualBackground', {
  sdkAppId: 123123,
  userId: 'userId_123',
  userSig: 'your_userSig'
});
```

> Note: The first time you enable this feature, it requires loading computing resources, which has been automatically processed for you. For a more ultimate startup experience, please refer to the end of the document: [FAQ > How to speed up startup?](##-FAQ)

### Updating Parameters as Needed

```javascript
// Changing to an image background
await trtc.updatePlugin('VirtualBackground', {
  type: 'image',
  src: 'https://picsum.photos/seed/picsum/200/300'
});
```

### Disabling Virtual Background

```javascript
await trtc.stopPlugin('VirtualBackground');
```

## API Documentation

### trtc.startPlugin('VirtualBackground', options)

Used to enable the virtual background.

#### options

| Name       | Type      | Attributes | Description                             |
|------------|-----------|------------|-----------------------------------------|
| sdkAppId   | `number`  | Required   | Current application ID                   |
| userId     | `string`  | Required   | Current user ID                          |
| userSig    | `string`  | Required   | UserSig corresponding to the user ID     |
| type       | `string`  | Optional   | - `image` for image background <br> - `blur` for background blur (default) |
| enableFaceCentering    | `boolean`        | Optional | `false` (default), (Since v5.11.0), set to true to enable automatic face centering |
| enableEffectOptimization    | `boolean`        | Optional | `false` (default), experimental feature, set to true to reduce black edges and jagged edges around characters. Currently only supported on PC and since v5.13.0. |
| blurLevel | `number` | Optional | - Set the level of blur when `type` is set to `blur`. Default value is 3, with a range from 1 to 10. |
| src        | `string`  | Required if type is `image`  | Image URL, such as `https://picsum.photos/seed/picsum/200/300` |
| onAbort    | `(error) => {}`  | Optional   | Callback for errors that occur during runtime <br> Recommended solutions can be found in the Common Issues section at the end of the document.  |

**Example:**

```javascript
await trtc.startPlugin('VirtualBackground', {
  sdkAppId: 123123,
  userId: 'userId_123',
  userSig: 'your_userSig',
  type: 'image',
  src: 'https://picsum.photos/seed/picsum/200/300'
});
```

### trtc.updatePlugin('VirtualBackground', options)

Allows modification of virtual background parameters.

#### options

| Name       | Type     | Attributes | Description                             |
|------------|----------|------------|-----------------------------------------|
| type       | `string` | Required   | - `image` for image background <br> - `blur` for background blur |
| enableFaceCentering (Since v5.11.0)     | `boolean`        | Optional                   |`false`（default）
| blurLevel | `number` | Optional | - Set the level of blur when `type` is set to `blur`. Default value is 3, with a range from 1 to 10. |
| src        | `string` | Required if type is `image`  | Image URL, such as `https://picsum.photos/seed/picsum/200/300` |

**Example:**

```javascript
await trtc.updatePlugin('VirtualBackground', {
  type: 'blur',
  blurLevel: 6
});
```

### trtc.stopPlugin('VirtualBackground')

Disables the virtual background.

## FAQs

**1. When running the demo in Chrome, the video appears upside down and laggy**

This plugin uses GPU acceleration, and you need to enable hardware acceleration mode in your browser settings. You can copy and paste `chrome://settings/system` into your browser's address bar and enable hardware acceleration mode.

**2. When device performance is insufficient, causing high latency and rendering issues**

```javascript
async function onAbort(error) {
  await trtc.stopPlugin('VirtualBackground'); // Stop the plugin
  // Or lower the resolution and restart the plugin
}

await trtc.startPlugin('VirtualBackground', {
  ...// Other parameters
  onAbort,
});
```

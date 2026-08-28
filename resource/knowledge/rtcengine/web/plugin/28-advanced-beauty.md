## Function Description

This document primarily describes how to use the beauty plugin.

## Prerequisites

- Pricing see [RTC-Engine Packages](https://trtc.io/document/56025).
- [TRTC SDK](https://www.npmjs.com/package/trtc-sdk-v5) version must be >= 5.5.0
- System and configuration requirements for various platforms are as follows:

| Platform | Operating System | Browser Version | FPS | Recommended Configuration | Remarks |
| --- | --- | --- | --- | --- | --- |
| Web | Windows | Chrome 90+<br>Firefox 90+<br>Edge 97+ | 30 | Memory: 16GB<br>CPU: i5-10500<br>GPU: Dedicated 2GB | It is recommended to use the latest version of Chrome browser<br><b> (Enable hardware acceleration in the browser)</b> |
| 15 | Memory: 8GB<br>CPU: i3-8300<br>GPU: Integrated Intel 1GB |  |  |  |  |
| Mac | Chrome 98+<br>Firefox 96+<br>Safari 14+ | 30 | 2019 MacBook<br>Memory: 16GB (2667MHz)<br>CPU: i7 (6-core 2.60GHz)<br>GPU: AMD Radeon 5300M |  |  |
| Android | Chrome<br>Firefox Browser

<td rowspan="1" colspan="1">30 | High-end devices (e.g., Qualcomm Snapdragon 8 Gen1) |  |  |  |
| 20 | Mid-range devices (e.g., MediaTek Dimensity 8000-MAX) |  |  |  |  |
| 10 | Low-end devices (e.g., Qualcomm Snapdragon 660) |  |  |  |  |
| iOS | Chrome<br>Safari<br>Firefox | 30 | iPhone 13 | - Requires iOS 14.4 or above<br>- It is recommended to use Chrome or Safari browsers |  |
| 20 | iPhone XR |  |  |  |  |

## Implementation Steps

### Step 1: Register the Plugin

Before using it, you need to register the plugin. Below is an example code for registering the plugin:

```js
import TRTC from 'trtc-sdk-v5';
import { Beauty } from 'trtc-sdk-v5/plugins/video-effect/beauty';

const trtc = TRTC.create({ plugins: [Beauty] });
```

### Step 2: Start the Local Camera

```js
await trtc.startLocalVideo({
  view: 'local-video' // Fill in the div id
});
```

### Step 3: Using Beauty and built-in Effects

#### Beauty Effect

The beauty effect can be controlled using three interfaces for starting, updating, and stopping:

- `trtc.startPlugin('Beauty', options)` to enable the beauty effect.
- `trtc.updatePlugin('Beauty', options)` to update the beauty effect parameters.
- `trtc.stopPlugin('Beauty')` to stop the beauty effect.

The `options` parameter supports six beauty effect parameters:

```ts
type BeautifyOptions = {
  whiten?: number; // Whitening 0-1
  dermabrasion?: number; // Dermabrasion 0-1
  lift?: number; // Face Slimming 0-1
  shave?: number; // Jaw Shaving 0-1
  eye?: number; // Enlarged Eyes 0-1
  chin?: number; // Chin Adjustment 0-1
}
```

#### Built-in Effects

The plugin offers build-in video effects, here is the list:

| EffectId            | Name        |
|---------------------|--------------------|
| EDE5D18065451445    | Milk-Bottle-Face-Mask |
| 7A62218064EF7959    | Felt-Hairband      |
| B4D63180653948C3    | Bangs-Headband     |
| D7C6418064B90F4C    | Cute-Kitty         |
| 1D6EB18069D76A62    | Polka-Dot-Girl     |
| CBE7618065D9D76F    | Heart-Fireworks    |
| 9B86618065596018    | Cute-Piggy         |
| 428C518065369ACF    | Double-Braids      |
| B30E218064F7B397    | Vibrant-Stickers   |
| AE3C81806521B49B    | Rabbit-Sauce       |

We use `EffectId` to identify the effect which will be apply.

```ts
type EffectListOptions = {
  id: string;
  intensity?: number; // specify the strength of the effect
}
```

#### Example Code

When starting the plugin, the `options` should also include the current user's login information (sdkAppId, userId, userSig) for verification.

Here are some code examples:

```javascript
// Enable the plugin
const options = {
  sdkAppId: 0,
  userId: '',
  userSig: '',

  // BeautifyOptions
  whiten: 0.5, // Whitening 0-1
  dermabrasion: 0.5, // Dermabrasion 0-1
  lift: 0.5, // Face Slimming 0-1
  shave: 0.5, // Jaw Shaving 0-1
  eye: 0.5, // Enlarged Eyes 0-1
  chin: 0.5, // Chin Adjustment 0-1

  // EffectListOptions Array
  effect: [{
    id: '7A62218064EF7959', // the effect id
    intensity: 0.7 // specify the strength of the effect
  }]
}
try {
  await trtc.startPlugin('Beauty', options);
} catch (error) {
  console.error('Beauty start failed', error);
}
```

```javascript
// Update beauty parameters
const options = {
  whiten: 0.5, // Whitening 0-1
  dermabrasion: 0.5, // Dermabrasion 0-1
  lift: 0.5, // Face Slimming 0-1
  shave: 0.5, // Jaw Shaving 0-1
  eye: 0.5, // Enlarged Eyes 0-1
  chin: 0.5, // Chin Adjustment 0-1

  effect: [{
    id: '7A62218064EF7959', // the effect id
    intensity: 0.7, // specify the strength of the effect
  },{
    id: 'D7C6418064B90F4C', // the effect id
    intensity: 0.7, // specify the strength of the effect
  }]
}
try {
  await trtc.updatePlugin('Beauty', options);
} catch (error) {
  console.error('Beauty update failed', error);
}
```

```javascript
// Stop the beauty effect
try {
  await trtc.stopPlugin('Beauty');
} catch (error) {
  console.error('Beauty stop failed', error);
}
```

## API Documentation

### trtc.startPlugin('Beauty', options)

Enable the beauty effect.

#### options

| Name       | Type     | Attributes | Description                       |
|------------|----------|------------|-----------------------------------|
| sdkAppId   | `number` | Required   | Current application ID            |
| userId     | `string` | Required   | Current user ID                   |
| userSig    | `string` | Required   | UserSig corresponding to the user ID |
| whiten     | `number` | Optional   | Whitening, range [0,1]           |
| dermabrasion | `number` | Optional | Dermabrasion, range [0,1]        |
| lift       | `number` | Optional   | Face slimming, range [0,1]       |
| shave      | `number` | Optional   | Jaw shaving, range [0,1]         |
| eye        | `number` | Optional   | Enlarged eyes, range [0,1]       |
| chin       | `number` | Optional   | Chin adjustment, range [0,1]     |
| effect       | `Array<EffectListOptions>` | Optional   | effect list     |
| onError    | `(error) => {}`  | Optional   | Callback for errors that occur during runtime <br> - error.code=10000003 indicates high rendering latency <br> - error.code=10000006 indicates insufficient browser feature support, which may lead to lagging. Recommended solutions can be found in the Common Issues section at the end of the document.  |

EffectListOptions:

| Name       | Type     | Attributes | Description                       |
|------------|----------|------------|-----------------------------------|
| id   | `number` | Required   | The effect id          |
| intensity     | `string` | Required   | the strength of the effect                |

### trtc.updatePlugin('Beauty', options)

Allows modification of beauty parameters.

#### options

| Name       | Type     | Attributes | Description                       |
|------------|----------|------------|-----------------------------------|
| whiten     | `number` | Optional   | Whitening, range [0,1]           |
| dermabrasion | `number` | Optional | Dermabrasion, range [0,1]        |
| lift       | `number` | Optional   | Face slimming, range [0,1]       |
| shave      | `number` | Optional   | Jaw shaving, range [0,1]         |
| eye        | `number` | Optional   | Enlarged eyes, range [0,1]       |
| chin       | `number` | Optional   | Chin adjustment, range [0,1]     |
| effect       | `Array<EffectListOptions>` | Optional   | effect list     |

EffectListOptions:

| Name       | Type     | Attributes | Description                       |
|------------|----------|------------|-----------------------------------|
| id   | `number` | Required   | The effect id          |
| intensity     | `string` | Required   | the strength of the effect                |

### trtc.stopPlugin('Beauty')

Disables the beauty effect.

## Frequently Asked Questions

**1. When running the demo in Chrome, the video appears upside down and laggy**

This plugin uses GPU acceleration, and you need to enable hardware acceleration mode in your browser settings. You can copy and paste `chrome://settings/system` into your browser's address bar and enable hardware acceleration mode.

**2. When device performance is insufficient and causes high latency with long rendering times**

You can reduce video resolution or frame rate by listening to events.

```javascript
async function onError(error) {
  const { code } = error;
  if (code === 10000003 || code === 10000006) {
    // Reduce resolution and frame rate
    await trtc.updateLocalVideo({
      option: {
        profile: '480p_2'
      },
    });
    // await trtc.stopPlugin('Beauty'); // Or disable the plugin
  }
}

await trtc.startPlugin('Beauty', {
  ...// Other parameters
  onError,
});
```

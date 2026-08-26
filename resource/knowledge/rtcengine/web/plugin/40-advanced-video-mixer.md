## Overview

This document provides a detailed guide on how to use the TRTC Web SDK's VideoMixer plugin to composite multiple input sources including camera, screen sharing, text, images, and videos into a single video track for streaming with custom layouts. Developers can flexibly control the layout (position, size, layer zIndex) of each source.

## Prerequisites

- TRTC Web SDK version >= 5.12.0.

- Compatibility:

  | Browser    | Compatibility                  |
  | ---------- | ------------------------------ |
  | PC Chrome  | ✅                              |
  | PC Safari  | ✅                              |
  | PC Firefox | ✅                              |
  | PC Edge    | ✅                              |
  | Mobile     | ❌ Mixing not supported yet |

## Implementation

### 1. Import and Register Plugin

```javascript
import { VideoMixer } from 'trtc-sdk-v5/plugins/video-effect/video-mixer';

const trtc = TRTC.create({ plugins: [VideoMixer] });
```

### 2. Start Mixing

Start the mixing plugin by calling `trtc.startPlugin('VideoMixer', options)`. You must set the canvas width and height [canvasInfo](#canvasinfo) in options, all other parameters are optional.

```javascript
const options = {
  view: 'local_preview_div', // Preview
  canvasInfo: { width: 1920, height: 1080 },
  camera: [{ // Add a camera input source
      id: 'camera1',
      layout: { x: 0, y: 0, width: 640, height: 480, zIndex: 1 }
    }]
  // ...
}
const { track } = await trtc.startPlugin('VideoMixer', options);
// track is the mixed output MediaStreamTrack, which can be used for streaming
```

### 3. Publish After Mixing

The mixing plugin is only responsible for generating the mixed video track. Publishing operation is still controlled by the TRTC SDK. Pass the track returned by startPlugin as a parameter to the startLocalVideo interface to publish.

```js
await trtc.startLocalVideo({ option: {
  videoTrack: track,
  profile: { width: 1920, height: 1080, bitrate: 2000 } // Set encoding parameters
}});
```

### 4. Manage Input Sources (Update and Remove)

Dynamically add, update, or remove mixing input sources by calling `trtc.updatePlugin('VideoMixer', options)`.

**Update Rules:**

* **Input Source Description:** Input sources are divided into: `camera, screen, text, image, video`. All are arrays, each array element represents an input source, uniquely identified by the id attribute.
* **Update Input Source:** Pass the same id and modify other parameters.
* **Add Input Source:** Pass a new id object.
* **Remove Input Source:** Remove the object from the corresponding input source array.

#### Camera

Control camera capture and layout.

```javascript
// Update camera layout with id 'camera1'
await trtc.updatePlugin('VideoMixer', {
  camera: [
    {
      id: 'camera1',
      profile: { width: 640, height: 480, frameRate: 15 }, // Update camera capture parameters
      layout: { x: 100, y: 0, width: 640, height: 480, zIndex: 1, rotation: 90, mirror: true } // Update camera layout parameters
    }
  ]
});

// Remove all cameras
await trtc.updatePlugin('VideoMixer', { camera: [] });
// If you only want to temporarily hide the input source on the canvas without physically closing capture, you can set hidden: true in the layout parameter. The same applies to other input sources.
```

#### Screen Sharing

```js
// Add screen sharing
await trtc.updatePlugin('VideoMixer', {
  screen: [{
    id: 'screen1',
    profile: { width: 1920, height: 1080, frameRate: 15 }, // Screen sharing capture parameters
    layout: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      zIndex: 0,
    }
  }],
  // If the user stops screen sharing via browser button instead of SDK, you can listen through this callback
  onScreenShareStop: (id: string) => console.log(`Screen sharing stopped, id: ${id}`);
});
```

#### Text

Add text input sources by passing an object with a unique id in the `text` parameter array to represent a text source in the mix:

> Note: When text content exceeds the layout area, the overflowing part will be clipped. You need to adjust the layout width and height according to text content.

```js
await trtc.updatePlugin('VideoMixer', {
  text: [
    {
      id: 'text1',
      content: 'MultiLine\nTest',
      font: 'bold 60px SimHei',
      color: 'red',
      layout: {
        x: 200,
        y: 300,
        width: 300,
        height: 150,
        zIndex: 6,
      }
    }
  ]
});
```

#### Images and Videos

Add images (such as logos) or local video files as mixing input sources.

```js
await trtc.updatePlugin('VideoMixer', {
  image: [{
    id: 'img1',
    url: './image.png',
    layout: { x: 0, y: 500, width: 800, height: 400, zIndex: 4 }
  }],
  video: [{
    id: 'video1',
    url: './video.mp4',
    layout: { x: 0, y: 0, width: 1000, height: 500, zIndex: 5 }
  }]
});
```

### 5. Stop Mixing

Remove all input sources and stop mixing:

```javascript
await trtc.stopPlugin('VideoMixer');
```

## Error Handling

The error handling strategy of the mixing plugin is designed to ensure that errors in some input sources do not affect the mixing of other normal input sources.

| Scenario | Interface Behavior | Error Information Return Method |
| :---- | :---- | :---- |
| **Partial Success, Partial Failure** | Interface does not throw errors (try...catch cannot catch) | Failure information is notified through result.failedDetails in the return value MixParseResult |
| **All Failed or Critical Error** | Interface throws error (try...catch can catch) | Error object carries failure information, such as error?.data?.failedDetails |

Business logic example:

```ts
try {
  const { result } = await trtc.updatePlugin('VideoMixer', {
    camera: [/* ... */],
    screen: [/* ... */],
    text: [/* ... */],
    image: [/* ... */],
    video: [/* ... */],
  });
  // Scenario 1: Error handling for partial failures
  result.failedDetails.forEach(({id, error}: {id: string, error: any}) => {
    console.error(`${id} mix failed`, error);
  })
  console.log(result.successOptions) // Successfully applied options for this update
} catch (error: any) {
  // Scenario 2: Error catching for all failures (catching thrown errors)
  console.error(error);
  error?.data?.failedDetails.forEach(({ id, error }: { id: string, error: any }) => {
    console.error(`${id} mix failed`, error);
  })
}
```

**Detailed Explanation of successOptions**

This return value informs the business side of the parameters actually applied by the mixing underlying layer after this update. When some updates fail, successOptions will include the successfully updated parts and the failed parts that retain the old configuration, making it convenient for the business side to synchronize UI or data status.

## API Reference

### trtc.startPlugin('VideoMixer', options)

Used to start the mixing plugin and initialize canvas and input sources.

<a name="options"></a>**Options**

| Name              | Type                                | Required | Description                                                                                                          |
| ----------------- | ----------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| view              | string \| HTMLElement \| null | Optional     | HTMLElement instance or Id for mixed video preview. If not passed or passed as null, the mixed video will not be played.                                  |
| canvasInfo        | [CanvasInfo](#canvasinfo)           | Required     | Parameters for setting the mixing canvas                                                                                                   |
| camera            | [CameraSource](#camerasource)[]     | Optional     | Parameters for controlling camera input sources                                                                                               |
| screen            | [ScreenSource](#screensource)[]     | Optional     | Parameters for controlling screen sharing input sources                                                                                             |
| text              | [TextSource](#textsource)[]         | Optional     | Parameters for controlling text input sources                                                                                                 |
| image             | [ImageSource](#imagesource)[]       | Optional     | Parameters for controlling image input sources                                                                                                 |
| video             | [VideoSource](#videosource)[]       | Optional     | Parameters for controlling video input sources                                                                                                 |
| onScreenShareStop | (id: string) => {}                | Optional     | Callback invoked when mixed screen sharing stops. May be used when user cancels screen sharing via browser button instead of SDK. The callback parameter is the id of the stopped screen capture |

**Returns: Promise\<MixParseResult\>**

`MixParseResult`

| Name   | Type              | Description                                                                                                                                                                                                                                                                  |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| track  | [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)  | Mixed output video track                                                                                                                                                                                                                                                           |
| systemAudioTrackList  | object | This returns a list of system audio tracks. After setting the ScreenSource parameter `systemAudio:true` and successfully capturing the audio, it will return the system audio tracks. The data format is: `{key: audioTrack}`, where `key` is the ID configured in the ScreenSource, for example: `{id1: audioTrack, id2: audioTrack}`.                                                                                                                                                                                                                                                         |
| result | object            | Information about the success or failure of the parameters passed in this time, structured as follows:| Name | Type | Description |
| --- | --- | --- |
| successOptions | [Options](#options) | Successfully executed options for this update |
| failedDetails | MixFailedDetail[] | Detailed information about failed updates | |

`MixFailedDetail`

| Name  | Type     | Description         |
| ----- | -------- | ------------------- |
| id    | string | Id of the failed input source |
| error | Error  | Reason for the failure      |

### trtc.updatePlugin('VideoMixer', options)

Update mixing input sources and layout. The options structure is the same as startPlugin, canvasInfo is not required when updating.

### trtc.stopPlugin('VideoMixer')

Stop mixing.

## Core Parameter Structures

### <a name="canvasinfo"></a>CanvasInfo

| Name        | Type                                          | Required | Description                                                                                                                   |
| ----------- | --------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| canvasColor | string \| [CanvasGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient) \| [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) | Optional     | Mixing background color, refer to [canvas fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) attribute |
| width       | number                                        | Required     | Mixing canvas width                                                                                                                  |
| height      | number                                        | Required     | Mixing canvas height                                                                                                                  |
| frameRate   | number                                        | Optional     | Manually specify mixing frame rate. Generally it's best to let the mixing internally calculate the frame rate automatically, manually specifying may result in performance loss                                        |

### <a name="camerasource"></a>CameraSource

| Name       | Type                                                                                         | Required | Description                         |
| ---------- | -------------------------------------------------------------------------------------------- | -------- | ----------------------------------- |
| id         | string                                                                                       | Required     | Unique id identifying the input source                 |
| layout     | [LayerOption](#layeroption)                                                                  | Required     | Layout parameters                            |
| cameraId   | string                                                                                       | Optional     | Camera id for capture, specify which camera to capture |
| videoTrack | MediaStreamTrack                                                                             | Optional     | Custom captured videoTrack             |
| profile    | [VideoProfile](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#VideoProfile) | Optional     | Video capture parameters. Default: `480p_2`.    |

### <a name="screensource"></a>ScreenSource

| Name                 | Type                                                                                                     | Required | Description                                                                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | string                                                                                                   | Required     | Unique id identifying the input source                                                                                                                                                         |
| layout               | [LayerOption](#layeroption)                                                                              | Required     | Layout parameters                                                                                                                                                                    |
| profile              | [ScreenShareProfile](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/global.html#ScreenShareProfile) | Optional     | Screen capture parameters. Default: `1080p`.                                                                                                                                             |
| captureElement       | HTMLElement                                                                                              | Optional     | Capture a specific HTMLElement on the current page, supports Chrome 104+.                                                                                                                        |
| preferDisplaySurface | 'current-tab' \| 'tab' \| 'window' \| 'monitor'                                                          | Optional     | Controls the display priority of different types of capture in the screen sharing selection box. Default is monitor, i.e., screen capture is prioritized in the screen sharing selection box. If set to 'current-tab', the selection box will only show the current page. Supports Chrome 94+. |
| systemAudio          | boolean                                                                                                   | Optional     | Whether to capture system audio is the same as the systemAudio function for screen capture; it is not captured by default. Supported in v5.15 and later. |

### <a name="textsource"></a>TextSource

| Name    | Type                                          | Required | Description                                                                                                                 |
| ------- | --------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| id      | string                                        | Required     | Unique id identifying the input source                                                                                                         |
| layout  | [LayerOption](#layeroption)                   | Required     | Layout parameters                                                                                                                    |
| content | string                                        | Required     | Text content                                                                                                                    |
| color   | string \| [CanvasGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient) \| [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern)| Optional     | Text color, refer to [canvas fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) attribute |
| font    | string                                        | Optional     | Font, refer to [canvas font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) attribute               |

### <a name="imagesource"></a>ImageSource

| Name   | Type                        | Required | Description         |
| ------ | --------------------------- | -------- | ------------------- |
| id     | string                      | Required     | Unique id identifying the input source |
| layout | [LayerOption](#layeroption) | Required     | Layout parameters            |
| url    | string                      | Required     | Image url             |

### <a name="videosource"></a>VideoSource

| Name   | Type                        | Required | Description         |
| ------ | --------------------------- | -------- | ------------------- |
| id     | string                      | Required     | Unique id identifying the input source |
| layout | [LayerOption](#layeroption) | Required     | Layout parameters            |
| url    | string                      | Required     | Video url             |

### <a name="layeroption"></a>LayerOption

| Name     | Type                         | Required | Description                                                                                                                                               |
| -------- | ---------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| x        | number                       | Required     | Horizontal coordinate relative to the upper left corner of the canvas, can be negative                                                                                                                      |
| y        | number                       | Required     | Vertical coordinate relative to the upper left corner of the canvas, can be negative                                                                                                                      |
| width    | number                       | Required     | Layout width of input source, must be > 0                                                                                                                                |
| height   | number                       | Required     | Layout height of input source, must be > 0                                                                                                                                |
| zIndex   | number                       | Required     | Input source layer level, each input source's layer level should not be duplicated                                                                                                                      |
| fillMode | 'contain' \| 'cover' \| 'fill' | Optional     | Mode for filling the layout with the image, camera defaults to `cover`, other input sources default to `contain`, refer to [CSS object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) attribute. |
| mirror   | boolean                      | Optional     | Whether to mirror                                                                                                                                                  |
| rotation | 0 \| 90 \| 180 \| 270          | Optional     | Image rotation angle                                                                                                                                              |
| hidden   | boolean                      | Optional     | Whether to temporarily hide the input source on the canvas. Use case: don't want to physically close camera/screen, temporarily hide input source without destroying resources                                                             |

## Best Practices and FAQs

### 1. Frame Rate and Performance Optimization

* **Frame Rate Settings:**
  * **Not Recommended**: manually setting canvasInfo.frameRate.
  * **Recommended**: let the plugin automatically calculate internally: when camera or screen sharing exists, take the maximum frame rate of the two; otherwise fixed at 15 fps. Manual specification may cause performance loss.
* **Performance Considerations:**
  * The larger the canvas resolution and the more mixing input sources, the greater the rendering overhead. The business side should determine appropriate canvas parameters and number of input sources based on user device performance.

### 2. How to Set Resolution and Bitrate?

- Resolution is the canvas width and height
- Bitrate is not controlled by the mixing plugin, it's set by the business side when publishing through `startLocalVideo/updateLocalVideo`.

### 3. Why Are Input Source Parameters in Array Form? How to Update Only One Type of Input Source in the Array?

- Each type of input source is updated in full. The purpose is to support batch updates and deletions (by comparing arrays passed before and after).
- Each input source parameter is optional. For example, if you only want to update camera, only pass the camera array when calling updatePlugin, and don't pass arrays for other types of input sources, or pass them together but keep the original parameters. Example:

  ```js
  await trtc.startPlugin('VideoMixer', { // Assume camera and screen are already mixed
    camera: [/* config */],
    screen: [/* config */]
  });
  ```

  At this point, if you only want to update camera and not screen, you can pass only camera without passing screen

  ```js
  await trtc.updatePlugin('VideoMixer', {
    camera: [/* newConfig */], // Only pass camera array
  });
  ```

### 4. Given an Array, How to Update Only One Input Source?

For example, to update a camera with id = 1, only modify the parameters of the element with id = 1 in the camera array passed in. Although other elements don't need to be updated, their parameters need to be passed in as is.

### 5. Why Is the Bitrate Set When Capturing Camera and Screen Invalid?

The bitrate set when capturing camera and screen will be ignored. The uplink bitrate is set by the interface (`start/updateLocalVideo`) called when the business side publishes.

### 6. Why Doesn't Rotation Happen Around the Center?

The principle of mixing rotation is to rotate the image and then draw it while keeping the upper left corner of the image at the coordinates passed in by layout. If you want to achieve center rotation, the business side needs to adjust the coordinates accordingly.

### 7. If User Stops Screen Sharing via Browser Button Instead of SDK During Mixing Screen Sharing, How Can the Business Side Detect This?

The `onScreenShareStop` callback is provided in the parameters of startPlugin. Usage example:

```js
await trtc.startPlugin('VideoMixer', {
  // ...
  onScreenShareStop: (id: string) => {
    console.log(`screen share stop, id: ${id}`);
  }
});
```

This document introduces how to use the Atomicx API to integrate whiteboard or screen sharing annotation into your own meeting UI.

First, choose the feature you want to implement:

|Goal|Do you need to start screen sharing first|Integration order|
|---------|---------|---------|
|Whiteboard: Write on a blank canvas|No|Once the display area is ready, call `startWhiteboard`|
|Screen sharing annotation: Annotate on the screen sharing view|Yes|Call `startScreenShare` first, then call `startWhiteboard`|

> **Note:**
> **To integrate screen sharing annotation, you do not need to integrate the standalone whiteboard first.** Both features use `startWhiteboard` to create the drawing layer, but their integration flows are independent of each other. Choose one according to your business goal.
>

## Preparation

Before you start, please confirm:
- User state: The user has completed login authentication through `useLoginState` (see Integration overview) and is already in a room as the owner or a member of that room (see Room management).

- Environment dependency: The project has correctly installed and imported `tuikit-atomicx-vue3` (Vue 3), version `6.1.0` or later.

- Use the latest stable versions of Chrome and Edge on Windows or macOS desktops.

   The "display area" in the code in this document is a `<div>` on the page used to display the whiteboard or shared view. After setting its `id`, pass that `id` to the API. It determines both where the content is displayed and the display size, and you do not need to understand the internal implementation of the whiteboard.

## Integrating the whiteboard

The whiteboard does not depend on screen sharing. Prepare a display area, and when the user clicks "Open whiteboard", pass its `id` to `startWhiteboard`:
``` typescript
<template>
  <button @click="openWhiteboard">Open whiteboard</button>
  <div id="whiteboard-view" class="content-view" />
</template>

<script setup lang="ts">
import { useWhiteboardState } from 'tuikit-atomicx-vue3/room';

const { startWhiteboard } = useWhiteboardState();

async function openWhiteboard() {
  await startWhiteboard({
    view: 'whiteboard-view',
    canvasColor: '#FFFFFF',
  });
}
</script>

<style scoped>
.content-view {
  position: relative;
  width: 100%;
  height: 600px;
  background: #fff;
}
</style>
```

After the call succeeds, the current user can draw in that area, and other members in the room will see the whiteboard view in real time.

## Integrating screen sharing annotation

Screen sharing annotation adds a transparent drawing layer on top of the shared view. The whole flow has only two steps:
1. Display the screen sharing view in a `<div>` on the page.

2. Pass the `id` of the same `<div>` to `startWhiteboard` so that the strokes overlay the shared view.

   The following example provides two buttons, "Start sharing" and "Start annotation":

   ``` typescript
   <template>
     <button @click="shareScreen">Start sharing</button>
     <button @click="openAnnotation">Start annotation</button>
     <div id="screen-share-view" class="content-view" />
   </template>

   <script setup lang="ts">
   import {
     DeviceStatus,
     useDeviceState,
     useWhiteboardState,
   } from 'tuikit-atomicx-vue3/room';

   const { screenStatus, startScreenShare } = useDeviceState();
   const { startWhiteboard } = useWhiteboardState();

   async function shareScreen() {
     await startScreenShare({
       screenAudio: true,
       view: 'screen-share-view',
     });
   }

   async function openAnnotation() {
     if (screenStatus.value !== DeviceStatus.On) {
       throw new Error('Please start screen sharing first');
     }

     await startWhiteboard({
       view: 'screen-share-view',
     });
   }
   </script>

   <style scoped>
   .content-view {
     position: relative;
     width: 100%;
     height: 600px;
   }
   </style>
   ```

## Adding drawing tools

The whiteboard and screen sharing annotation use the same set of tool APIs. Just connect the methods below to your toolbar buttons:
``` typescript
import {
  useWhiteboardState,
  WhiteboardTool,
} from 'tuikit-atomicx-vue3/room';

const {
  setToolConfig,
  undo,
  redo,
  clear,
  snapshot,
} = useWhiteboardState();

// Pen
setToolConfig({
  tool: WhiteboardTool.Pen,
  color: '#006EFF',
  lineWidth: 4,
});

// Rectangle
setToolConfig({
  tool: WhiteboardTool.Shape,
  shapeType: 'rect',
  color: '#006EFF',
  lineWidth: 4,
});

await undo();           // Undo
await redo();           // Redo
await clear();          // Clear
const image = await snapshot();
```

The available tools include:

|Tool|Enum value|Purpose|
|---------|---------|---------|
|Select|`WhiteboardTool.None`|Stop drawing.|
|Pen|`WhiteboardTool.Pen`|Free-form writing.|
|Laser pointer|`WhiteboardTool.Laser`|Disappears automatically after a short stay.|
|Shape|`WhiteboardTool.Shape`|Draw a rectangle or ellipse through `shapeType`.|
|Arrow|`WhiteboardTool.Arrow`|Mark a direction or key point.|
|Eraser|`WhiteboardTool.EraserObject`|Erase graphic objects.|

When drawing a shape, set `shapeType` in the same configuration object: `rect` for a rectangle and `ellipse` for an ellipse.

## Hiding the whiteboard and annotation entries

When closing the whiteboard or annotation, call `stopWhiteboard`:
``` typescript
const { stopWhiteboard } = useWhiteboardState();

stopWhiteboard();
```

## Updating the whiteboard display area

When you need to switch the whiteboard to another display area, you can call `updateWhiteboard` and pass in the new element id.
``` typescript
const { updateWhiteboard } = useWhiteboardState();

updateWhiteboard({ view: 'whiteboard-new-view' });
```

## Scope of use
- Does not yet support mobile browsers and webinar (Webinar) rooms.

- Currently, the initiator draws while other members watch in real time; simultaneous drawing by multiple people is not yet supported.

- The whiteboard and regular screen sharing use the same sharing channel and cannot be enabled at the same time.

## FAQs

### Why is no content displayed on the page after calling `startWhiteboard`?

Please confirm that when calling it you passed the `id` of the display area through `view`, and that the corresponding `<div>` exists on the page. If the element is mounted later, call `updateWhiteboard({ view })` after the whiteboard is started.

### Can the whiteboard and regular screen sharing be enabled at the same time?

No. The whiteboard and regular screen sharing use the same sharing channel; screen sharing annotation, on the other hand, overlays a drawing layer on top of the screen sharing view, which is a supported combination.

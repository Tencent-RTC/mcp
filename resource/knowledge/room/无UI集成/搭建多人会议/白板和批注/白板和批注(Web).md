---
sync_node_id: '224180819995619328'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "白板和批注"
  - "白板和批注（Web）"
product: "room"
---
 This guide provides instructions for integrating a whiteboard or screen annotation feature into your conference interface using the Atomicx API.

First, choose which feature you want to implement:

|Feature|Requires screen sharing first?|Integration sequence|
|---------|---------|---------|
|Whiteboard: Write on a blank canvas|No|Once the display area is ready, call `startWhiteboard`|
|Screen annotation: Annotate on shared screen|Yes|Call `startScreenShare` first, then call `startWhiteboard`|

> **Note:**
> To enable screen annotation, you do not need to integrate a standalone whiteboard first. Both features use `startWhiteboard` to create the drawing layer, but their integration flows are independent. Choose the option that best fits your business requirements.
> 

## Preparation

Before you begin, make sure the following prerequisites are met:
- User status: The user has completed authentication using `useLoginState` (see Integration Overview), and is either a host or a member in a room (see Room Management).

- Environment dependencies: Your project has installed and imported `tuikit-atomicx-vue3` (Vue 3), version `6.1.0` or later.

- Browser requirements: Use the latest stable version of Chrome or Edge on Windows or macOS desktop.

   In this guide, the "display area" refers to a  element on your page that shows the whiteboard or shared screen. Assign an id to this element and pass that id to the API. The display area determines where content is rendered and its size. You do not need to understand the internal implementation of the whiteboard.

## Integrating the Whiteboard

The whiteboard feature does not require screen sharing. Set up a display area, and when the user clicks "Open Whiteboard," pass its `id` to `startWhiteboard`:
``` typescript
<template>
  <button @click="openWhiteboard">Open Whiteboard</button>
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

After a successful call, the current user can draw in this area, and other room members will see the whiteboard in real time.

## Integrating Screen Annotation

Screen annotation overlays a transparent drawing layer on the shared screen. Integration involves two steps:
1. Render the shared screen in a `<div>` on the page.

2. Pass the same id to startWhiteboard to overlay the annotation layer.

   The following example provides two buttons: "Start Sharing" and "Enable Annotation":

   ``` typescript
   <template>
     <button @click="shareScreen">Start Sharing</button>
     <button @click="openAnnotation">Enable Annotation</button>
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

## Adding Drawing Tools

Both the whiteboard and screen annotation features use the same tool API. Link the following methods to your toolbar buttons:
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

Available tools:

|Tool|Enum Value|Description|
|---------|---------|---------|
|Select|`WhiteboardTool.None`|Stops drawing.|
|Pen|`WhiteboardTool.Pen`|Freehand drawing.|
|Laser Pointer|`WhiteboardTool.Laser`|Disappears after a short pause.|
|Shape|`WhiteboardTool.Shape`|Draw rectangles or ellipses via `shapeType`.|
|Arrow|`WhiteboardTool.Arrow`|Mark directions or highlights.|
|Eraser|`WhiteboardTool.EraserObject`|Erase shape objects.|

When drawing shapes, set `shapeType` in the config object: use `rect` for rectangles, `ellipse` for ellipses.

## Hiding Whiteboard and Annotation

To close the whiteboard or annotation, call `stopWhiteboard`:
``` typescript
const { stopWhiteboard } = useWhiteboardState();

stopWhiteboard();
```

## Updating the Whiteboard Display Area

To switch the whiteboard to a different display area, call `updateWhiteboard` and provide the new element id:
``` typescript
const { updateWhiteboard } = useWhiteboardState();

updateWhiteboard({ view: 'whiteboard-new-view' });
```

## Usage Limitations
- Not supported on mobile browsers or in webinar rooms.

- Only the initiator can draw; other members can view in real time. Multi-user simultaneous drawing is not supported.

- The whiteboard and standard screen sharing use the same sharing channel and cannot be enabled at the same time.

## FAQs

### Why is there no content displayed after calling `startWhiteboard`?

Make sure you have passed the display area's `id` using the `view` parameter and that the corresponding exists on the page. If the element is mounted later, call `updateWhiteboard({ view })` after starting the whiteboard.

### Can the whiteboard and standard screen sharing be enabled at the same time?

No. The whiteboard and standard screen sharing use the same sharing channel. Screen annotation overlays the drawing layer on the shared screen, which is the supported combination.

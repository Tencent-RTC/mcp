The basic beauty feature allows users to apply smoothing, whitening, and rosy effects to their portrait during video calls or live streaming.

## Use Cases
- **Video conferencing:** Reduces skin blemishes and brightens the complexion, making participants look more professional and energetic.

- **Live streaming:** Streamers use the beauty feature to improve the visual quality of the image and attract more viewers.

- **Online education:** Teachers and students maintain a clean and natural appearance, creating a pleasant classroom atmosphere.

## Prerequisites
- **User status:** The user has completed login authentication via useLoginState, is in the **logged-in** state. See the Integration Overview.

- **Environment dependency:** The project has already imported `tuikit-atomicx-vue3`.

- **Device requirements:** An available camera device is required, and the user must have granted camera access permission. If the user denies the permission, the virtual background feature will not work.

## Implementing the Basic Beauty Feature

This feature provides two integration options. You can choose the one that best fits your business needs:
- **Option 1 (Recommended):** Quick integration using UI components. Directly import the beauty panel component provided by `tuikit-atomicx-vue3` ([FreeBeautyPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/FreeBeautyPanel)) and embed it into your application's dialog. This has the lowest development cost.

- **Option 2 (Advanced):** Custom integration using low-level APIs. Implement the UI and interaction logic yourself based on the atomicx-core SDK API [useFreeBeautyState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-FreeBeautyState) state hook. This offers the highest flexibility.

## Option 1: Quick Integration Using UI Components

`tuikit-atomicx-vue3` provides the core beauty settings panel component:
- [**FreeBeautyPanel**](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/FreeBeautyPanel)**:** The basic beauty configuration panel, including parameter adjustment for smoothing, whitening, and rosy effects.

### Step 1: Import the Component
``` typescript
import { FreeBeautyPanel } from 'tuikit-atomicx-vue3/room';
```

### Step 2: Use the Component

It is generally recommended to place `FreeBeautyPanel` inside a Dialog or Modal, and trigger its display via a button click.

**The following example shows how to implement a complete interaction where clicking a button opens the beauty settings:**

> All TUIKit components must be wrapped inside UIKitProvider; otherwise, they will not be able to obtain their context dependencies, resulting in abnormal styling.
>

``` typescript
<template>
  <UIKitProvider theme="light" language="en-US">
    <div class="toolbar-container">
      <!-- 1. Trigger button -->
      <button @click="openBeautySettings">Set Beauty</button>

      <!-- 2. Settings dialog -->
      <div v-if="showSettings" class="modal-mask">
        <div class="modal-content">
          <div class="modal-header">
            <span>Basic Beauty</span>
            <button @click="showSettings = false">Close</button>
          </div>

          <div class="modal-body">
            <!-- 3. Import the panel component -->
            <!-- @close event: triggered when the user clicks the close button inside the panel (if any) -->
            <FreeBeautyPanel @close="showSettings = false" />
          </div>
        </div>
      </div>
    </div>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { FreeBeautyPanel, useDeviceState } from 'tuikit-atomicx-vue3/room';

const showSettings = ref(false);
const { cameraList } = useDeviceState();

const openBeautySettings = () => {
  // 1. Check whether there is an available camera
  if (cameraList.value.length === 0) {
    alert('No camera detected; cannot set beauty');
    return;
  }

  // 2. Open the settings panel
  showSettings.value = true;
};
</script>

<style scoped>
.modal-mask {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content { background: white; width: 600px; border-radius: 8px; overflow: hidden; }
.modal-header { padding: 16px; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
.modal-body { padding: 16px; }
</style>
```

The internal logic of this component is as follows:
- **Show the panel:** After the user clicks the button, a dialog containing `FreeBeautyPanel` pops up.

- **Adjust parameters:** The user drags the sliders in the panel to adjust the smoothing, whitening, and rosy parameters.

- **Real-time preview:** During adjustment, the preview interface is called in real time to preview the beauty effect.

- **Save and apply:** When the panel is closed (triggering the `@close` event), the current settings are automatically saved so that they take effect for remote users.

## Option 2: Custom Integration Using Low-Level APIs

This section mainly describes how to implement basic beauty via the atomicx-core SDK API [useFreeBeautyState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-FreeBeautyState) interface.

### Step 1: Set Up the Preview

When the user adjusts the beauty parameters (for example, by dragging a slider), use [setFreeBeauty](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setFreeBeauty) for real-time preview. At this point, the effect is only visible locally and will not be transmitted to remote users.

> The value range of the parameters is 0-100.
>

``` typescript
import { useFreeBeautyState } from 'tuikit-atomicx-vue3/room';

const { setFreeBeauty, beautyConfig } = useFreeBeautyState();

// Example: adjust the beauty parameters
const updatePreview = async (beauty: number, white: number, ruddy: number) => {
  // The values in beautyConfig update automatically; this demonstrates how to set the preview manually
  await setFreeBeauty({
    beautyLevel: beauty,      // Smoothing (0-100)
    whitenessLevel: white,    // Whitening (0-100)
    ruddinessLevel: ruddy     // Rosy (0-100)
  });
};
```

### Step 2: Save and Apply

After the user confirms that they are satisfied with the preview, call [saveBeautySetting](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#saveBeautySetting) to apply the current configuration to the video stream. At this point, remote users can see the beauty effect.

> The beauty feature depends on a camera device. You can use [useDeviceState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState) to check the device status.
>
> - [cameraList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cameraList): The list of currently available camera devices. If the list is empty, it means no camera was detected or camera permission is denied.

``` typescript
import { useFreeBeautyState } from 'tuikit-atomicx-vue3/room';

const { saveBeautySetting } = useFreeBeautyState();

const applyBeauty = async () => {
  // Save the currently previewed settings so that they take effect for remote users
  await saveBeautySetting();
  console.log('Beauty has taken effect');
};
```

### Step 3: Disable the Beauty Effect

To disable beauty, simply set all parameters to 0 and save.
``` typescript
const closeBeauty = async () => {
  // 1. Set all parameters to 0 and preview
  await setFreeBeauty({
    beautyLevel: 0,
    whitenessLevel: 0,
    ruddinessLevel: 0
  });

  // 2. Save to apply
  await saveBeautySetting();
};
```

## Development Notes
- **Parameter range:** The parameters received by `setFreeBeauty` (`beautyLevel`, `whitenessLevel`, `ruddinessLevel`) all have a range of 0-100.

- **Preview and apply:** To provide a better user experience, beauty adjustment is divided into two phases: **"preview"** and **"apply"**. `setFreeBeauty` is only used for local preview; you must call `saveBeautySetting` for `trtcCloud.setBeautyStyle` to be officially invoked and applied to the published stream.

- **Device dependency:** The beauty feature depends on the video stream, so the effect can only be seen when the camera is enabled. If no camera is detected, it is recommended to disable the beauty entry.

- **Performance consumption:** Enabling beauty adds a certain amount of CPU and GPU load. It is recommended to guide users on low-end devices to use it moderately.

## FAQ

### **Why can't remote users see the effect after I adjust the beauty settings?**

Please confirm whether `saveBeautySetting()` was called. `setFreeBeauty()` is only used for local preview; only after saving will it be applied to the published video stream.

### **Can I set beauty without a camera?**

No. The beauty feature processes the video stream, so if no video image is captured, beauty cannot take effect. It is recommended to hide or disable the beauty entry when there is no camera.

### **After leaving the room or turning off the camera, do I need to reset beauty manually?**

No. `useFreeBeautyState` already implements automatic state management internally:
- Camera switching: Beauty is paused when the camera is turned off, and the last saved settings are automatically restored when it is turned back on.

- Entering/leaving rooms: All beauty parameters are automatically reset when leaving the room, with no manual cleanup required by the developer.

## **Example Project**

Tencent Cloud provides the example project [atomicx-vite-vue3-ts](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts) on GitHub, which you can refer to in order to implement the complete RoomKit functionality.

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useFreeBeautyState**|Free beauty feature management|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-FreeBeautyState)|

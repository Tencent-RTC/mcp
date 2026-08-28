The virtual background feature allows users to replace their real background with a custom image or apply a blur effect during video calls or live streaming. With this feature, users can effectively protect their privacy, hide a cluttered background, or present a corporate image through a specific background.

## Use Cases
- **Remote work/meetings:** When attending a meeting from home or a public place, use background blur or a virtual background to hide the real environment and protect personal privacy.

- **Online education:** Teachers can use a unified teaching background to create a professional classroom atmosphere.

- **Brand promotion:** Employees can use a background image with the company logo in external meetings to enhance the brand image.

- **Fun interaction:** In social scenarios, users can switch to fun background images to make interactions more enjoyable.

## Prerequisites
- **User status:** The user has completed login authentication via useLoginState, is in the **logged-in** state. See the Integration Overview.

- **Environment dependency:** The project has already imported `tuikit-atomicx-vue3`.

- **Device requirements:** An available camera device is required, and the user must have granted camera access permission. If the user denies the permission, the virtual background feature will not work.

- **Resource dependency:** The virtual background feature depends on AI model files. To ensure the browser can load and run these files properly, you need to complete the following steps.

  - Publish the `node_modules/trtc-sdk-v5/assets` directory to a CDN or static resource server. For details, see the [SDK documentation](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-36-advanced-virtual-background.html).

  - If you choose Option 1: Quick integration using UI components, when using the [VirtualBackgroundPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/VirtualBackgroundPanel) component, you need to pass the `assetsPath` static resource address via props.

  - If you choose Option 2: Custom integration using low-level APIs, when using the [initVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#initVirtualBackground) interface, you need to pass the `assetsPath` static resource address.

## Implementing the Virtual Background Feature

This feature provides two integration options. You can choose the one that best fits your business needs:
- **Option 1 (Recommended):** Quick integration using UI components. Directly import the virtual background panel component provided by `tuikit-atomicx-vue3` ([VirtualBackgroundPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/VirtualBackgroundPanel)) and embed it into your application's dialog or sidebar. This has the lowest development cost.

- **Option 2 (Advanced):** Custom integration using low-level APIs. Implement the UI and interaction logic yourself based on the atomicx-core SDK API [useVirtualBackgroundState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-VirtualBackgroundState) state hook. This offers the highest flexibility.

   Virtual Background

## Option 1: Quick Integration Using UI Components

`tuikit-atomicx-vue3` provides the core settings panel component:
- [**VirtualBackgroundPanel**](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/VirtualBackgroundPanel)**:** The configuration panel for the virtual background, including background blur, image selection, and preview features.

### Step 1: Import the Component
``` typescript
import { VirtualBackgroundPanel } from 'tuikit-atomicx-vue3/room';
```

### Step 2: Use the Component

It is generally recommended to place the [VirtualBackgroundPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/VirtualBackgroundPanel) inside a Dialog or Modal, and trigger its display via a button click.

**The following example shows how to implement a complete interaction where clicking a button opens the virtual background settings:**

> **Note:**
> - Publish the `node_modules/trtc-sdk-v5/assets` directory to a CDN or static resource server. For details, see the [SDK documentation](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-36-advanced-virtual-background.html).
> - When using the [VirtualBackgroundPanel](https://github.com/Tencent-RTC/TUIKit_Vue3/tree/main/packages/tuikit-atomicx-vue3/src/components/VirtualBackgroundPanel) component, pass the `assetsPath` static resource address via props.
> - All TUIKit components must be wrapped inside UIKitProvider; otherwise, they will not be able to obtain their context dependencies, resulting in abnormal styling.

``` typescript
<template>
  <UIKitProvider theme="light" language="en-US">
    <div class="toolbar-container">
      <!-- 1. Trigger button -->
      <button @click="openSettings">Set Virtual Background</button>

      <!-- 2. Settings dialog -->
      <div v-if="showSettings" class="modal-mask">
        <div class="modal-content">
          <div class="modal-header">
            <span>Virtual Background</span>
            <button @click="showSettings = false">Close</button>
          </div>

          <div class="modal-body">
            <!-- 3. Import the panel component -->
            <!-- @close event: triggered when the user clicks the close button inside the panel (if any) -->
            <VirtualBackgroundPanel assetsPath='https://xxxx/assets' @close="showSettings = false" />
          </div>
        </div>
      </div>
    </div>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
import { VirtualBackgroundPanel, useVirtualBackgroundState, useDeviceState } from 'tuikit-atomicx-vue3/room';

const showSettings = ref(false);
const { isSupported } = useVirtualBackgroundState();
const { cameraList } = useDeviceState();

const openSettings = () => {
  // 1. Check whether the browser supports virtual background
  if (!isSupported()) {
    alert('The current browser does not support virtual background');
    return;
  }

  // 2. Check whether there is an available camera
  if (cameraList.value.length === 0) {
    alert('No camera detected; cannot set virtual background');
    return;
  }

  // 3. Open the settings panel
  showSettings.value = true;
};
</script>

<style scoped>
.modal-mask{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000}.modal-content{background:white;width:600px;border-radius:8px;overflow:hidden}.modal-header{padding:16px;display:flex;justify-content:space-between;border-bottom:1px solid #eee}
</style>
```

## Option 2: Custom Integration Using Low-Level APIs

This section mainly describes how to implement the virtual background via the atomicx-core SDK API [**useVirtualBackgroundState**](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-VirtualBackgroundState) interface.

### Step 1: Initialization and Detection

Before invoking the virtual background feature, you must first check whether the browser supports it and initialize the resource path.

> **Note:**
> - Publish the node_modules/trtc-sdk-v5/assets directory to a CDN or static resource server. For details, see the [SDK documentation](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-36-advanced-virtual-background.html).
> - When using the [initVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#initVirtualBackground) interface, pass the assetsPath static resource address.
> - The virtual background feature depends on a camera device. You can use [useDeviceState](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-DeviceState) to check the device status.
> - [cameraList](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#cameraList): The list of currently available camera devices. If the list is empty, it means no camera was detected or camera permission is denied.

``` typescript
import { onMounted } from 'vue';
import { useVirtualBackgroundState } from 'tuikit-atomicx-vue3/room';

const { isSupported, initVirtualBackground } = useVirtualBackgroundState();

onMounted(async () => {
  // 1. Check browser compatibility
  if (!isSupported()) {
    console.warn('The current browser does not support virtual background');
    return;
  }

  // 2. Initialize resources
  try {
    await initVirtualBackground({ assetsPath: './assets' });
    console.log('Virtual background initialization completed');
  } catch (error) {
    console.error('Initialization failed', error);
  }
});
```

### Step 2: Set Up the Preview

Before the user confirms applying the background, you usually need to preview the effect first. Use the [setVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#setVirtualBackground) method to set the preview effect. At this point, it is not applied to the video stream visible to remote users.

> Calling `setVirtualBackground` only takes effect in the local preview. Remote users will not see the virtual background effect; it is synchronized to the remote video stream only after `saveVirtualBackground` is called.
>

``` typescript
import { useVirtualBackgroundState } from 'tuikit-atomicx-vue3/room';

const { setVirtualBackground } = useVirtualBackgroundState();

// Enable background blur preview
const previewBlur = async () => {
  await setVirtualBackground({
    enable: true,
    type: 'blur',
    level: 0.5 // Blur level, optional
  });
};

// Enable background image preview
const previewImage = async (imageUrl: string) => {
  await setVirtualBackground({
    enable: true,
    type: 'image',
    source: imageUrl // Image URL, supports local or network paths
  });
};
```

### Step 3: Save and Apply

After the user confirms that they are satisfied with the preview, call [saveVirtualBackground](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#saveVirtualBackground) to actually apply the configuration to the current video stream. At this point, remote users will see the effect.
``` typescript
import { useVirtualBackgroundState } from 'tuikit-atomicx-vue3/room';

const { saveVirtualBackground } = useVirtualBackgroundState();

const confirmSettings = async () => {
  try {
    await saveVirtualBackground();
    console.log('Virtual background has taken effect');
  } catch (error) {
    console.error('Save failed', error);
  }
};
```

### Step 4: Disable the Virtual Background

If you need to disable the virtual background and restore the real background, you can set its `enable` property to `false` and save.
``` typescript
import { useVirtualBackgroundState } from 'tuikit-atomicx-vue3/room';

const { setVirtualBackground, saveVirtualBackground } = useVirtualBackgroundState();

const disableVirtualBackground = async () => {
  // 1. Set to the disabled state
  await setVirtualBackground({ enable: false });
  // 2. Save to apply
  await saveVirtualBackground();
};
```

## Development Notes
- **Resource file path:** The `assetsPath` in `initVirtualBackground` must correctly point to the directory of the AI model files. An incorrect path will prevent the virtual background from starting. Please refer to the [SDK documentation](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-36-advanced-virtual-background.html) to obtain the resource file package.

- **Performance consumption:** Enabling the virtual background consumes relatively high CPU and GPU resources. On low-end devices, it may cause video frame drops or overheating. It is recommended to prompt the user to disable it when insufficient device performance is detected.

- **Browser compatibility:** Not all browsers support the virtual background (it depends on features such as WebAssembly and SIMD). Be sure to call `isSupported()` to check before rendering the UI.

- **Image format:** For custom background images, it is recommended to use `jpg` or `png` format, and the resolution should not be too large (1920x1080 or smaller is recommended) to avoid affecting loading speed and memory usage.

## FAQ

### **When running the demo in Chrome, the image is upside down and laggy?**

The virtual background plugin uses the GPU for acceleration. You need to find and enable hardware acceleration mode in your browser settings. You can copy `chrome://settings/system` into the browser address bar and enable hardware acceleration mode.

### **Why does my computer overheat severely or the fan spin at high speed after enabling the virtual background?**

The virtual background feature needs to recognize the person's outline in real time and perform image processing, which requires a certain amount of CPU and GPU computing power. It is recommended to disable this feature when it is not needed, or avoid enabling it on low-end devices.

### **What should I do if initialization fails with the error "assets load failed"?**

Please check whether the `assetsPath` passed to `initVirtualBackground` is correct. Make sure the path contains the necessary AI model files and that they can be accessed directly through the browser. If the resources are cross-origin, you need to configure the CORS policy.

### **Does the virtual background support mobile browsers?**

Due to the performance limitations of mobile browsers and the large variation in WebAssembly support, the experience may not be as stable as on desktop. It is recommended to use it primarily in mainstream desktop browsers such as Chrome (94+ recommended) and Edge, and to properly perform the compatibility check with `isSupported()`.

### **Cannot use the virtual background during local development?**

WebRTC-related features generally require running in an HTTPS environment, or on `localhost` / `127.0.0.1`. Please ensure that your development environment meets the secure context requirements.

## **Example Project**

Tencent Cloud provides the example project [atomicx-vite-vue3-ts](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts) on GitHub, which you can refer to in order to implement the complete RoomKit functionality.

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useVirtualBackgroundState**|Virtual background management|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-VirtualBackgroundState)|

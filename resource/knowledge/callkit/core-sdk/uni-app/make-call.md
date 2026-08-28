This document helps you quickly build an **app** with calling capabilities using the **AtomicXCore SDK** components **DeviceState**, **CallState**, and the core view component **CallCoreView**.

## Prerequisites

### Step 1: Activate the service

### Step 2: Import AtomicXCore into your project
1. **Install the component**: open the [AtomicXCore SDK](https://ext.dcloud.net.cn/plugin) page, click **Download plugin and import into HBuilderX**, select the target project, and click **Confirm**.

   You can also download the source code from [GitHub](https://github.com/Tencent-RTC/TUIKit_uni-app) and copy the `App/uni_modules/tuikit-atomic-x` directory into your project's `uni_modules/` folder.

2. **Configure project permissions:** in your application's `manifest.json` file, under the `app-plus > distribute` node, make sure the following required permissions are added:

  - Android platform (`Android` node): make sure the following permissions are included in the `permissions` array:

      ``` json
      "<uses-permission android:name=\"android.permission.RECORD_AUDIO\" />",
      "<uses-permission android:name=\"android.permission.CAMERA\"/>"
      ```
  - iOS platform (`iOS` node): make sure the following descriptions are included in the `privacyDescription` object:

      ``` json
      "NSCameraUsageDescription" : "The app needs access to your camera for calls",
      "NSMicrophoneUsageDescription" : "The app needs access to your microphone for calls"
      ```

      Add `audio` to the `UIBackgroundModes` array to support background audio playback.

      ``` json
      "UIBackgroundModes" : [ "audio" ]
      ```

### Step 3: Implement the login logic

Call the [login](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#login) method on LoginState in your project to sign in. **This is a mandatory prerequisite for using any feature of** `AtomicXCore`.

> We recommend calling the `login` method on `LoginState` only after your app's own user account has signed in successfully, so that the login business logic stays clean and consistent.
>

``` typescript
import { useLoginState } from "@/uni_modules/tuikit-atomic-x/state/LoginState";

const { login } = useLoginState();

const handleLogin = () => {
    login({
      sdkAppID: 1400000001,  // Replace with your SDKAppID
      userID: "test_001",    // Replace with your UserID
      userSig: "xxxxxxxxxx"  // Replace with your UserSig
    })
 }
```

**Login parameters:**
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| sdkAppID | number | Obtained from the <a href="https://console.cloud.tencent.com/trtc">Console</a>. It is typically a 10-digit integer starting with <code>140</code> or <code>160</code>. |
| userID | string | The unique ID of the current user. Only letters, digits, hyphens, and underscores are allowed. To avoid multi-endpoint login conflicts, <strong>do not use</strong> simple IDs such as <code>1</code> or <code>123</code>. |
| userSig | string | The ticket used for Tencent Cloud authentication. Please note:<br>- Development environment: you can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a userSig, or generate a temporary UserSig with the <a href="https://console.cloud.tencent.com/im/tool-usersig">UserSig helper tool</a>.<br>- Production environment: to prevent key leakage, always generate the UserSig on the server side. See <a href="https://cloud.tencent.com/document/product/647/17275">Server-side UserSig generation</a> for details.<br>For more information, see <a href="https://cloud.tencent.com/document/product/647/17275">How to compute and use UserSig</a>. |

## Make your first call

### Step 1: Create the call view

You need to create a call page that is brought to the foreground when a call is initiated. Do the following:
1. **Create a call page**: create a new page to act as the host page for the call, responsible for the navigation logic triggered by an incoming or outgoing call.

2. **Bind CallCoreView to the call page**: `CallCoreView` is the core view component of the call UI. It automatically listens to **CallState** and renders the video/audio views, and provides UI customization capabilities such as layout switching and avatar/icon configuration.

   ``` html
      <call-core-view style="height: 50px; width: 50px;"></call-core-view>
   ```

   > **Note:**
   >

   > **CallCoreView** is a native component and does not need to be **imported** separately in the file. Simply mount it on the page to use it.
   >

   **CallCoreView features:**

   |**Feature**|**Description**|**Reference**|
   |---------|---------|---------|
   |**Set the layout mode**|Freely switch between layout modes. If not set, the layout is auto-selected based on the number of participants.|Switch the layout mode|
   |**Set the avatar**|Customize the avatar for a specific user by passing in the avatar resource path.|Customize the default avatar|
   |**Set the volume indicator icon**|Configure personalized volume indicator icons for different volume levels.|Customize the volume indicator icon|
   |**Set the network indicator icon**|Configure the corresponding network indicator icon based on real-time network quality.|Customize the network indicator icon|
   |**Set the waiting animation for callees**|In multi-party call scenarios, pass in a GIF image path to show an animation for users in the "waiting to answer" state.|Customize the loading animation|

### Step 2: Add call control buttons

You can add your own buttons based on the APIs provided by **DeviceState** and **CallState**.
- **DeviceState features:** microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, and real-time device state listening. It is recommended to bind these methods to your button click events, and refresh the button UI in real time by listening to device state changes.

- **CallState features:** core call control capabilities such as answering, hanging up, and rejecting calls. It is recommended to bind these methods to your button click events, and listen to call state changes to keep the button state in sync with the current call phase.

- **Icon assets download:** you can download button icons directly from [GitHub](https://github.com/Tencent-RTC/TUIKit_uni-app/tree/main/App). These icons are designed by our designers specifically for TUICallKit and are free from copyright issues.

| <strong>Icons:</strong> |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

   The following example shows how to add a hangup button, a microphone toggle button, and a camera toggle button:

1. **Add the hangup button**: create and add a hangup button. On tap, call [hangup](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#hangup) and destroy the view.

   ``` typescript
   <template>
     <view class="btn" @tap="handleHangup">
       <image class="btn-img" :style="[style]" :src="HANGUP_SRC"></image>
       <text class="btn-text" v-if="isShowText">
         Hang up
       </text>
     </view>
   </template>

   <script setup lang="ts">
     import { computed } from "vue";
     import HANGUP_SRC from "../../../static/icon/hangup.png"; // Replace with the actual icon path in your project
     import {
       useCallState
     } from '@/uni_modules/tuikit-atomic-x/state/CallState';
     const {
       hangup
     } = useCallState()

     const props = defineProps({
       size: {
         type: Number,
         default: 60,
       },
       isShowText: {
         type: Boolean,
         default: true,
       },
     });

     const style = computed(() => ({
       width: props.size + "px",
       height: props.size + "px",
     }));

     const handleHangup = () => {
       hangup();
       // Call the hangup API in the click handler and destroy the page
     };
   </script>

   <style scoped>
     .btn {
       margin: 10px 20px;
     }

     .btn-img {
       width: 60px;
       height: 60px;
       border-radius: 140px;
     }

     .btn-text {
       font-size: 12px;
       color: #d5e0f2;
       font-weight: 400;
       text-align: center;
       margin-top: 10px;
     }
   </style>

   ```
2. **Add the microphone toggle button:** create and add a microphone toggle button. On tap, call [openLocalMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#openLocalMicrophone) or [closeLocalMicrophone](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#closeLocalMicrophone), and listen to the microphone state to update the button text in real time.

   ``` typescript
   <template>
     <view class="btn" @tap="handleMic">
       <image class="btn-img" :src="microphoneStatus === DeviceStatus.ON "></image>
       <text class="btn-text">
         {{ microphoneStatus === DeviceStatus.ON ? 'Microphone on' : 'Microphone off' }}
       </text>
     </view>
   </template>

   <script setup lang="ts">
     import MIC_ON_SRC from "../../../static/icon/mic-on.png"; // Replace with the actual icon path in your project
     import MIC_OFF_SRC from "../../../static/icon/mic-off.png"; // Replace with the actual icon path in your project
     import {
       useDeviceState,
       DeviceStatus
     } from '@/uni_modules/tuikit-atomic-x/state/DeviceState';
     const {
       microphoneStatus,
       openLocalMicrophone,
       closeLocalMicrophone,
     } = useDeviceState()

     // Toggle the microphone in the click handler
     const handleMic = () => {
       if (microphoneStatus.value === DeviceStatus.ON) {
         closeLocalMicrophone();
       } else {
         openLocalMicrophone();
       }
     };
   </script>

   <style scoped>
     .btn {
       margin: 10px 20px;
     }

     .btn-img {
       width: 60px;
       height: 60px;
       border-radius: 140px;
     }

     .btn-text {
       font-size: 12px;
       color: #d5e0f2;
       font-weight: 400;
       text-align: center;
       margin-top: 10px;
     }
   </style>
   ```
3. **Add the camera toggle button:** create and add a camera toggle button. On tap, call [openLocalCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#openLocalCamera) or [closeLocalCamera](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#closeLocalCamera), and listen to the camera state to update the button text in real time.

   ``` typescript
    <template>
     <div class="btn" @tap="handleCamera">
       <image class="btn-img" :src="cameraStatus === DeviceStatus.ON "></image>
       <text class="btn-text">
         {{cameraStatus === DeviceStatus.ON ? 'Camera on' : 'Camera off'}}
       </text>
     </div>
   </template>

   <script setup lang="ts">
     import CAMERA_ON_SRC from "../../../static/icon/camera-on.png"; // Replace with the actual icon path in your project
     import CAMERA_OFF_SRC from "../../../static/icon/camera-off.png"; // Replace with the actual icon path in your project
     import {
       useDeviceState,
       DeviceStatus
     } from '@/uni_modules/tuikit-atomic-x/state/DeviceState';
     const {
       cameraStatus,
       openLocalCamera,
       closeLocalCamera,
       isFrontCamera,
     } = useDeviceState()

     // Camera button click handler
     const handleCamera = () => {
       if (cameraStatus.value === DeviceStatus.ON) {
         closeLocalCamera()
       } else {
         openLocalCamera({ isFront: isFrontCamera.value })
       }
     };
   </script>

   <style>
     .btn {
       margin: 10px 20px;
     }

     .btn-img {
       width: 60px;
       height: 60px;
       border-radius: 140px;
     }

     .btn-text {
       font-size: 12px;
       color: #d5e0f2;
       font-weight: 400;
       text-align: center;
       margin-top: 10px;
     }
   </style>
   ```

### Step 3: Initiate a call

After the `calls` API succeeds, navigate to the call view. We also recommend enabling the microphone (and camera for video calls) automatically according to the media type for a better call experience. Implement it as follows:
1. **Initiate a call:** call [calls](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#calls) to start a call.

2. **Turn on media devices:** after the call is initiated successfully, turn on the microphone, and for video calls also turn on the camera.

3. **Show the call view:** navigate to the call view once the call is initiated successfully.

   ``` typescript
   <script setup lang="ts">
   import { ref } from 'vue';
   import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';
   import { useDeviceState } from '@/uni_modules/tuikit-atomic-x/state/DeviceState';

   const { calls } = useCallState();
   const { openLocalCamera, openLocalMicrophone } = useDeviceState();

   const calleeUserID = ref('');
   const mediaType = ref(1); // 0: audio, 1: video

   const startCall = () => {
     const userID = calleeUserID.value.trim();
     if (!userID) {
       uni.showToast({ icon: 'none', title: 'Please enter the callee user ID' });
       return;
     }

     // 1. Turn on local devices
     if (mediaType.value === 1) {
       openLocalCamera({ isFront: true });
     }
     openLocalMicrophone();

     // 2. Initiate the call
     calls({
       participantIds: [userID],
       mediaType: mediaType.value,
       success: () => {
         console.log('Call initiated successfully');
         uni.navigateTo({
           url: '/uni_modules/tuikit-atomic-x/pages/call?layoutTemplate=Float' // Example path; replace with the actual call page path you created in Step 1
         });
       },
       fail: (code: number, message: string) => {
         console.error('Failed to initiate call:', code, message);
         uni.showToast({ icon: 'none', title: `Call failed: ${message}` });
       }
     });
   };
   </script>
   ```

### Step 4: End the call

Whether you call `hangup` or the remote party ends the call, the `onCallEnded` event is triggered. We recommend listening to this event and closing the current view when it fires (i.e., when the call ends). Implement it as follows:
1. **Listen to the call-ended event**: listen to `onCallEnded`.

2. **Destroy the call view**: when `onCallEnded` fires, destroy the call view.

   ``` typescript
   import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';
   import { useDeviceState } from '@/uni_modules/tuikit-atomic-x/state/DeviceState';

   const { addCallListener } = useCallState();
   const { closeLocalCamera, closeLocalMicrophone } = useDeviceState();

   /**
    * Initialize the call service (minimal example: handle only the call-ended event and pop the page).
    * Call this during application startup.
    */
   export function initCallService() {
     addCallListener('onCallEnded', (event: string) => {
       let res: any;
       try {
         res = JSON.parse(event);
       } catch (error) {
         console.error('[CallService] onCallEnded parse error:', error);
         return;
       }

       console.log('[CallService] onCallEnded, reason:', res.reason);

       // Close local devices
       closeLocalCamera();
       closeLocalMicrophone();

       // Navigate back
       const pages = getCurrentPages();
       if (pages.length > 1) {
         uni.navigateBack({ delta: 1 });
       } else {
         uni.redirectTo({ url: '/pages/index/index' }); // Example path; adjust to your actual project path
       }
     });
   }
   ```

   **`onCallEnded` event parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | The unique identifier of this call. |
| mediaType | CallMediaType | The media type of the call, indicating whether it is an audio or video call.<br>- <code>CallMediaType.Video</code>: video call.<br>- <code>CallMediaType.Audio</code>: audio call. |
| reason | CallEndReason | The reason the call ended.<br>- <code>Unknown</code>: unknown reason.<br>- <code>Hangup</code>: normal hangup; the user actively hung up.<br>- <code>Reject</code>: the callee rejected the call.<br>- <code>Busy</code>: the callee is busy on another call.<br>- <code>Cancel</code>: the caller canceled the call before the callee answered. |
| userId | String | The user ID that triggered the end. |

### Result

After the 5 steps above, the "Make a call" flow looks as follows:

## Customize the UI

**CallCoreView** offers comprehensive UI customization, allowing you to freely replace icons such as avatars and volume indicators. **To speed up integration, you can download the assets directly from **[GitHub](https://github.com/Tencent-RTC/TUIKit_uni-app/blob/main/App/uni_modules/tuikit-atomic-x/static/icon/handsfree-on.png)**. These icons are designed by our designers specifically for TUICallKit and are free from copyright issues.**

### Customize the volume indicator icon

You can configure different volume-level indicator icons via the `volumeLevelIcons` property of the **CallCoreView** component.

Example code for the `volumeLevelIcons` property:
``` typescript
<template>
  <view class="call-view-container">
    <view :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }">
      <call-core-view
        :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }"
        :volumeLevelIcons="volumeLevelIcons"
      ></call-core-view>
    </view>
  </view>
</template>

<script setup>
  import { ref, onMounted } from 'vue';

  const systemInfo = ref({});

  /**
   * Convert a /static/ relative path to a local absolute path usable by the native layer
   */
  function toAbsolutePath(relativePath) {
    if (plus && plus.io && plus.io.convertLocalFileSystemURL) {
      return plus.io.convertLocalFileSystemURL(relativePath);
    }
    return relativePath;
  }

  /**
   * Convert all values of an icon map to absolute paths in a batch
   */
  function convertIconPaths(iconMap) {
    const result = {};
    Object.keys(iconMap).forEach(key => {
      result[key] = toAbsolutePath(iconMap[key]);
    });
    return result;
  }

  // Volume-level icons: keys are level names, values are local absolute paths of the icons
  const volumeLevelIcons = ref(convertIconPaths({
    "Mute": "/static/images/callview-self-mute.png", // Replace with the actual icon path in your project
    "Low": "/static/images/callview-network.png" // Replace with the actual icon path in your project
  }));

  onMounted(() => {
    uni.getSystemInfo({
      success: (res) => {
        systemInfo.value = res;
      }
    });
  });
</script>

<style>
  .call-view-container {
    background: rgba(15, 16, 20, 0.5);
    overflow: hidden;
  }
</style>
```

> uni-app only supports local paths for parameters passed to the native layer, so relative paths must be converted to local paths.
>

- **Property parameter details:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | [String: String] | Yes | The mapping between volume levels and icon resources. Structure:<br>- key (VolumeLevel) indicates the volume level:<br>- <code>Mute</code>: microphone is off (muted).<br>- <code>Low</code>: volume range (0-25].<br>- <code>Medium</code>: volume range (25-50].<br>- <code>High</code>: volume range (50-75].<br>- <code>Peak</code>: volume range (75-100].<br>- Value (String) is the icon resource path for the corresponding volume level. |

- **Volume indicator icons:**

| <strong>Icon</strong> | <strong>Description</strong> |
| --- | --- |
|  | [Meaning] Volume indicator icon.<br>[Recommended usage] Set this icon at the <code>Low</code> or <code>Medium</code> level; it is displayed when the user's volume is above the corresponding level. |
|  | [Meaning] Mute icon.<br>[Recommended usage] Set this icon at the <code>Mute</code> level; it is displayed when the user is muted. |

### Customize the network indicator icon

You can configure the network indicator icons for different network states via the `networkQualityIcons` property of the **CallCoreView** component.

- Example code for the `networkQualityIcons` property:

   ``` typescript

   <template>
     <view class="call-view-container">
       <view :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }">
         <call-core-view
           :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }"
           :networkQualityIcons="networkQualityIcons"
         ></call-core-view>
       </view>
     </view>
   </template>

   <script setup>
     import { ref, onMounted } from 'vue';

     const systemInfo = ref({});

     /**
      * Convert a /static/ relative path to a local absolute path usable by the native layer
      */
     function toAbsolutePath(relativePath) {
       if (plus && plus.io && plus.io.convertLocalFileSystemURL) {
         return plus.io.convertLocalFileSystemURL(relativePath);
       }
       return relativePath;
     }

     /**
      * Convert all values of an icon map to absolute paths in a batch
      */
     function convertIconPaths(iconMap) {
       const result = {};
       Object.keys(iconMap).forEach(key => {
         result[key] = toAbsolutePath(iconMap[key]);
       });
       return result;
     }

     const networkQualityIcons = ref(convertIconPaths({
       "BAD": "/static/images/callview-network-bad.png",  // Replace with the actual icon path in your project
       "VERY_BAD": "/static/images/callview-network-bad.png"  // Replace with the actual icon path in your project
     }));

     onMounted(() => {
       uni.getSystemInfo({
         success: (res) => {
           systemInfo.value = res;
         }
       });
     });
   </script>

   <style>
     .call-view-container {
       background: rgba(15, 16, 20, 0.5);
       overflow: hidden;
     }
   </style>
   ```
- `networkQualityIcons` parameter details:

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | [String: String] | Yes | The mapping between network quality and icon resources. Structure:<br>- Key (String): the network quality level:<br>- <code>UNKNOWN</code>: unknown network state.<br>- <code>EXCELLENT</code>: excellent network.<br>- <code>GOOD</code>: good network.<br>- <code>POOR</code>: poor network.<br>- <code>BAD</code>: bad network.<br>- <code>VERY_BAD</code>: very bad network.<br>- <code>DOWN</code>: network disconnected.<br>- Value (String): the icon resource path for the corresponding network state. |

- **Poor-network indicator icon:**

| <strong>Icon</strong> | <strong>Description</strong> |
| --- | --- |
|  | [Meaning] Poor-network indicator icon.<br>[Recommended usage] Set this icon at the <code>BAD</code>, <code>VERY_BAD</code>, or <code>DOWN</code> level; it is displayed when the network is poor. |

### Customize the default avatar

You can set the `participantAvatars` property of **CallCoreView** to configure user avatars. We recommend listening to the reactive `allParticipants` (all call participants): when a user's avatar is available, set and display it; if the user has no avatar or loading fails, fall back to a default avatar (placeholder).

Example code for the `participantAvatars` property:
``` typescript
<template>
  <view class="call-view-container">
    <view :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }">
      <call-core-view
        :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }"
        :participantAvatars="participantAvatars"
      ></call-core-view>
    </view>
  </view>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';

  const { allParticipants } = useCallState();

  const systemInfo = ref({});
  const participantAvatars = ref({});
  const avatarCache = {};

  const DEFAULT_AVATAR_URL = "https://liteav.sdk.qcloud.com/app/res/picture/voiceroom/avatar/user_avatar1.png";
  let defaultAvatarLocalPath = "";
  let defaultAvatarReady = false;

  /**
   * Convert a relative path to a local absolute path usable by the native layer
   */
  function toAbsolutePath(relativePath) {
    if (plus && plus.io && plus.io.convertLocalFileSystemURL) {
      return plus.io.convertLocalFileSystemURL(relativePath);
    }
    return relativePath;
  }

  /**
   * Download and cache the avatar; return the local absolute path
   */
  function downloadAvatar(url) {
    if (avatarCache[url]) {
      return Promise.resolve(avatarCache[url]);
    }
    return new Promise((resolve) => {
      uni.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            const absolutePath = toAbsolutePath(res.tempFilePath);
            avatarCache[url] = absolutePath;
            resolve(absolutePath);
          } else {
            resolve(defaultAvatarLocalPath || "");
          }
        },
        fail: () => {
          resolve(defaultAvatarLocalPath || "");
        }
      });
    });
  }

  // Pre-download the default avatar
  const defaultAvatarPromise = downloadAvatar(DEFAULT_AVATAR_URL).then(localPath => {
    defaultAvatarLocalPath = localPath;
    defaultAvatarReady = true;
    // After the default avatar is ready, refresh participant avatars once
    if (allParticipants.value && allParticipants.value.length > 0) {
      updateParticipantAvatars(allParticipants.value);
    }
  });

  /**
   * Given the participant list, download avatars and build a { userId: localPath } map
   */
  async function updateParticipantAvatars(participants) {
    if (!participants || participants.length === 0) {
      participantAvatars.value = {};
      return;
    }
    if (!defaultAvatarReady && defaultAvatarPromise) {
      await defaultAvatarPromise;
    }
    const avatarMap = {};
    const tasks = [];
    participants.forEach(participant => {
      if (participant.id && participant.avatarURL) {
        tasks.push(
          downloadAvatar(participant.avatarURL).then(localPath => {
            avatarMap[participant.id] = localPath;
          })
        );
      } else if (participant.id) {
        avatarMap[participant.id] = defaultAvatarLocalPath || "";
      }
    });
    await Promise.all(tasks);
    participantAvatars.value = avatarMap;
  }

  // Watch participant changes and update the avatar map
  watch(() => allParticipants.value, async (newVal) => {
    if (!newVal) return;
    await updateParticipantAvatars(newVal);
  }, { immediate: true, deep: true });

  onMounted(() => {
    uni.getSystemInfo({
      success: (res) => {
        systemInfo.value = res;
      }
    });
  });
</script>

<style>
  .call-view-container {
    background: rgba(15, 16, 20, 0.5);
    overflow: hidden;
  }
</style>
```
- `participantAvatars` parameter details:

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| avatars | [String: String] | Yes | The user avatar map. Structure:<br>- Key: the user's userID.<br>- Value: the absolute path of the user's avatar resource. |

- **Default avatar asset:**

| <strong>Icon</strong> | <strong>Description</strong> |
| --- | --- |
|  | [Meaning] Default avatar.<br>[Recommended usage] When a user's avatar fails to load or is not available, set this as their default avatar. |

### Customize the loading animation

You can set the `waitingAnimation` property of **CallCoreView** to configure a waiting animation for waiting users for a better experience.

- Example code for the `waitingAnimation` property:

   ``` typescript
     <template>
     <view class="call-view-container">
       <view :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }">
         <call-core-view
           :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }"
           :waitingAnimation="waitingAnimation"
         ></call-core-view>
       </view>
     </view>
   </template>

   <script setup>
     import { ref, onMounted } from 'vue';

     const systemInfo = ref({});

     /**
      * Convert a /static/ relative path to a local absolute path usable by the native layer
      */
     function toAbsolutePath(relativePath) {
       if (plus && plus.io && plus.io.convertLocalFileSystemURL) {
         return plus.io.convertLocalFileSystemURL(relativePath);
       }
       return relativePath;
     }

     // Waiting animation GIF: pass a local absolute path for the native component to render
     const waitingAnimation = ref(toAbsolutePath("/static/images/callview-loading.gif")); // Replace with the actual icon path in your project

     onMounted(() => {
       uni.getSystemInfo({
         success: (res) => {
           systemInfo.value = res;
         }
       });
     });
   </script>

   <style>
     .call-view-container {
       background: rgba(15, 16, 20, 0.5);
       overflow: hidden;
     }
   </style>
   ```
- `waitingAnimation` parameter details:

   |**Parameter**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |path|String|Yes|The absolute path of the GIF image resource.|

- **Waiting-to-answer animation:**

| <strong>Icon</strong> | <strong>Description</strong> |
| --- | --- |
|  | [Meaning] Waiting-to-answer animation for a user.<br>[Recommended usage] Animation used in group calls. Once configured, this animation is displayed when the user is in the "waiting to answer" state. |

### Add a call duration indicator

The call duration is available in real time via the `duration` field on the reactive `activeCall` data. To show the call duration in real time:

**Bind the call duration data**: bind the `activeCall.duration` field to the UI. This field is reactive and drives the UI to update automatically, so you do not need to maintain a timer manually.
``` typescript
<template>
  <view v-if="isConnected" class="call-timer">
    <text class="timer-text">{{ formattedTime }}</text>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';

  const { selfInfo, activeCall } = useCallState();

  const isConnected = computed(() => {
    return selfInfo.value?.status === 2;
  });

  const formattedTime = computed(() => {
    const duration = activeCall.value?.duration ?? 0;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  });
</script>

<style scoped>
  .call-timer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-text {
    font-size: 28rpx;
    color: #FFFFFF;
    font-weight: 400;
  }
</style>
```

## More features

### Customize the user's avatar and nickname

Before a call starts, you can set your own nickname and avatar via the `setSelfInfo` method.
- Example code for `setSelfInfo`:

   ``` typescript
   import { useLoginState } from "@/uni_modules/tuikit-atomic-x/state/LoginState";

   const { setSelfInfo } = useLoginState();

   /**
    * Set the profile (nickname, avatar, etc.) of the currently signed-in user
    */
   export const setSelfUserInfo = (userID: string, nickname: string, avatarURL: string): void => {
     setSelfInfo({
       userProfile: {
         userID,
         nickname,
         avatarURL,
       },
       success: () => {
         console.log('User profile set successfully');
       },
       fail: (errCode: number, errMsg: string) => {
         console.error('Failed to set user profile:', errCode, errMsg);
       },
     });
   };
   ```
- `setSelfInfo` parameter details:

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| userProfile | UserProfile | Yes | The user profile struct:<br>- <code>userID</code>: the user's ID.<br>- <code>avatarURL</code>: the URL of the user's avatar.<br>- <code>nickname</code>: the user's nickname.<br>For more fields, see UserProfile. |

### Switch the layout mode

**CallCoreView** provides three built-in layout modes. You can set the `layoutTemplate` property to choose the layout. If not set, **CallCoreView** auto-selects the layout based on the number of participants: `Float` is the default for 1-vs-1 scenarios, and it automatically switches to `Grid` for multi-party calls. The layout modes are described below:
| - <strong>Layout logic:</strong> during outgoing ringing, the local view is shown full-screen; after the call is connected, the remote view is shown full-screen and the local view becomes a floating small window.<br>- <strong>Interaction:</strong> supports dragging the small window; tap the small window to swap the main and small views. | - <strong>Layout logic:</strong> all participants' views are tiled in a grid layout. Suitable for calls with 2 or more participants; tap a specific view to enlarge it.<br>- <strong>Interaction:</strong> tap a specific participant's view to enlarge it. | - <strong>Layout logic:</strong> in 1-vs-1 scenarios, the remote view is always shown. In multi-party scenarios, the Active Speaker strategy is used to automatically detect and show the current speaker in full screen.<br>- <strong>Interaction:</strong> the local view is shown while waiting; after the call is connected, the call duration is also displayed. |

- Example code for the `layoutTemplate` property:

   ``` typescript
   <template>
     <view class="call-view-container">
       <view :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }">
         <call-core-view
           :style="{ height: systemInfo?.windowHeight + 'px', width: systemInfo?.safeArea?.width + 'px' }"
           :layoutTemplate="layoutTemplate"
         ></call-core-view>
       </view>
     </view>
   </template>

   <script setup>
     import { ref, watch, onMounted } from 'vue';
     import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';

     const { activeCall } = useCallState();

     const systemInfo = ref({});
     // Layout template: 'Float' for 1v1 floating layout, 'Grid' for multi-party grid layout
     const layoutTemplate = ref("Grid");

     // Automatically switch the layout based on call info: use Grid for multi-party or group chats, Float for 1v1
     watch(() => activeCall.value, (newValue) => {
       if (!newValue || !newValue.inviteeIds) {
         return;
       }
       const newTemplate = (newValue.inviteeIds.length > 1 || newValue.chatGroupId !== '') ? 'Grid' : 'Float';
       if (layoutTemplate.value !== newTemplate) {
         layoutTemplate.value = newTemplate;
       }
     }, { immediate: true, deep: true });

     onMounted(() => {
       uni.getSystemInfo({
         success: (res) => {
           systemInfo.value = res;
         }
       });
     });
   </script>

   <style>
     .call-view-container {
       background: rgba(15, 16, 20, 0.5);
       overflow: hidden;
     }
   </style>

   ```
- `layoutTemplate` parameter details:

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>layoutTemplate</code> | String | Layout mode of CallCoreView.<br>- Float:<br>- Layout logic: during outgoing ringing, the local view is shown full-screen; after the call is connected, the remote view is shown full-screen and the local view becomes a floating small window.<br>- Interaction: supports dragging the small window; tap the small window to swap the main and small views.<br>- Grid:<br>- Layout logic: all participants' views are tiled in a grid layout. Suitable for calls with 2 or more participants; tap a specific view to enlarge it.<br>- Interaction: tap a specific participant's view to enlarge it.<br>- PIP:<br>- Layout logic: in 1v1 scenarios, the remote view is always shown. In multi-party scenarios, the Active Speaker strategy is used to automatically detect and show the current speaker in full screen.<br>- Interaction: the local view is shown while waiting; after the call is connected, the call duration is also displayed. |

### Set the default call timeout

When starting a call via [calls](https://liteav.sdk.qcloud.com/doc/product/tuikit/atomic-x/uni-app/zh/v1.0/api/index.html#calls), you can specify the wait timeout via the `timeout` field of the `CallParams` configuration. Example:
``` typescript
<script setup>
import { ref } from 'vue';
import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';

const { calls } = useCallState();

const calleeUserID = ref('');
const mediaType = ref(1); // 0: audio, 1: video

const startCall = () => {
  const userID = calleeUserID.value.trim();
  if (!userID) {
    uni.showToast({ icon: 'none', title: 'Please enter the callee user ID' });
    return;
  }
  calls({
    participantIds: [userID],
    mediaType: mediaType.value,
    params: {
      timeout: 30
    },
    success: () => {
      console.log('Call initiated successfully');
      uni.navigateTo({
        url: '/uni_modules/tuikit-atomic-x/pages/call?layoutTemplate=Float' // Example path; replace with the actual call page path you created in Step 1
      });
    },
    fail: (code, message) => {
      console.error('Failed to initiate call:', code, message);
      uni.showToast({ icon: 'none', title: `Call failed: ${message}` });
    }
  });
};
</script>

```
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| participantIds | Array | Yes | The list of target userIds. |
| mediaType | CallMediaType | Yes | The media type of the call, indicating whether it is an audio or video call.<br>- <code>CallMediaType.Video</code>: video call.<br>- <code>CallMediaType.Audio</code>: audio call. |
| params | CallParams | No | Extended call parameters, such as room ID, call invitation timeout, etc.<br>- <code>roomId</code> (String): the room ID. Optional; if not specified, the server assigns one automatically.<br>- <code>timeout</code> (Int): call timeout in seconds.<br>- <code>userData</code> (String): user-defined data.<br>- <code>chatGroupId</code> (String): the Chat group ID, used for group call scenarios.<br>- <code>isEphemeralCall</code> (Boolean): whether the call is ephemeral (does not produce a call record). |

### Play the ringback tone while waiting

You can listen to your own call state, play a ringtone while waiting for the callee to answer, and stop the ringtone when the call is answered or ended.
``` typescript
import { watch } from 'vue';
import { useCallState } from '@/uni_modules/tuikit-atomic-x/state/CallState';

const { selfInfo } = useCallState();

function ensureAudioContext() {
  if (!uni.$innerAudioContext) {
    const ctx = uni.createInnerAudioContext();
    ctx.onError((err: any) => {
      console.error('[CallService] innerAudioContext onError:', err?.errCode, err?.errMsg || err);
    });
    uni.$innerAudioContext = ctx;
  }
  return uni.$innerAudioContext;
}

function playRingtone(src: string) {
  const ctx = ensureAudioContext();
  try { ctx.stop(); } catch (_e) {}
  ctx.src = src;
  ctx.loop = true;
  ctx.autoplay = true;
  setTimeout(() => {
    try { ctx.play(); } catch (e) {}
  }, 50);
}

function stopRingtone() {
  if (uni.$innerAudioContext) {
    try {
      uni.$innerAudioContext.loop = false;
      uni.$innerAudioContext.stop();
    } catch (e) {}
  }
}

export { playRingtone, stopRingtone };
// It is recommended to call this function during application initialization
export function initCallService() {
  ensureAudioContext();

  // Stop the ringtone when the call is connected (status=2) or ended (status=0)
  watch(() => selfInfo.value, (newVal) => {
    if (newVal?.status === 2 || newVal?.status === 0) {
      stopRingtone();
    }
  }, { immediate: true, deep: true });
}
```

## Next step

Congratulations, you have completed "Make a call". Next, you can .

## FAQ

### How can I keep the screen always on during a call?

uni-app provides an official API for this: [uni.setScreenBrightness](https://uniapp.dcloud.net.cn/api/system/brightness.html).

### How can I disable the system back-swipe gesture on the previous page?

On iOS, you can disable it by setting the `disableSwipeBack` property on the page. See the [official uni-app documentation](https://uniapp.dcloud.net.cn/collocation/pages.html) for details.

On Android, you can intercept both the back-swipe gesture and the physical back button via `onBackPress`. Example:

> When using this approach to intercept the system back-swipe and physical back button, make sure the page uses a [custom navigation bar](https://uniapp.dcloud.net.cn/collocation/pages.html#customnav).
>

``` typescript
<script setup>
  import { onBackPress } from '@dcloudio/uni-app'

  // Intercept the system back-swipe and physical back button to prevent accidental exit during a call
  onBackPress((option) => {
    if (option.from === 'backbutton') {
      return true; // Return true to block the default back behavior
    }
  });
</script>
```

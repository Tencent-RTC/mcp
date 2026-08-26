This document provides a comprehensive guide to the viewer page in the TUILiveKit Demo. Use this documentation to quickly integrate the pre-built viewer page into your project, or customize the page’s style, layout, and features to fit your requirements.

## Feature Overview

The viewer page includes default behaviors and styles. If the defaults don’t fully meet your needs, you can customize the UI. The numbers in the image below correspond to feature categories. Key features include live information display, video streaming area, online audience, audio/video controls, live duration, resolution switching, fullscreen functionality, chat interaction, and message list.
- **Live Video Playback**: Delivers high-definition, smooth live streaming.

- **Live Comments Interaction**: Enables real-time live comments.

- **Audience List**: Displays information about online audience.

- **Fullscreen Playback**: Provides an immersive viewing experience.

- **H5 Mobile Platform Support**: Ensures cross-platform compatibility.

## Quick Integration

### Step 1: Environment Setup and Activate Service

Before starting integration, review the Prerequisites to set up components and implement login.

### Step 2: Install Dependencies

Install dependencies using one of the following methods:

【npm】
``` bash
npm install tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue3 --save
```

【pnpm】
``` bash
pnpm add tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue3
```

【yarn】
``` bash
yarn add tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue
```

### Step 3: Integrate Viewer Page

Create a **live-player.vue** file in your project. Copy the following code to integrate the **viewer page**.

> **Note:**
> You can copy the code below directly into your project, or visit [Audience Viewing](https://github.com/Tencent-RTC/TUILiveKit/blob/main/Web/web-vite-vue3/src/TUILiveKit/component/LivePlayer/LivePlayerH5.vue) for more detailed source code.
>

``` typescript
<template>
  <UIKitProvider theme="dark">
    <div class="container">
      <!-- Core live area -->
      <section class="live">
        <header class="header">
          <IconArrowStrokeBack class="back-btn" size="20" />
          <Avatar :src="currentLive?.liveOwner.avatarUrl" :size="32" class="avatar" />
          <span class="user-name">{{ currentLive?.liveOwner.userName || currentLive?.liveOwner.userId }}</span>
        </header>
        <LiveCoreView class="player" />
      </section>

      <div class="sidebar">
        <!-- Online audience list -->
        <section class="audience">
          <header class="section-header">
            <h3>Online Audience <span>({{ audienceList.length }})</span></h3>
          </header>
          <LiveAudienceList class="list" />
        </section>

        <!-- Message list & input box -->
        <section class="barrage">
          <header class="section-header">
            <h3>Message List</h3>
          </header>
          <BarrageList class="list" />
          <BarrageInput class="input" height="48px" />
        </section>
      </div>
    </div>
  </UIKitProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { LiveAudienceList, BarrageList, BarrageInput, useLiveAudienceState, LiveCoreView, useLiveListState, Avatar, useLoginState } from 'tuikit-atomicx-vue3';
import { UIKitProvider, IconArrowStrokeBack } from '@tencentcloud/uikit-base-component-vue3';

const { audienceList } = useLiveAudienceState();
const { currentLive } = useLiveListState();
const { login, setSelfInfo } = useLoginState();

const liveId = 'live_xxxx'  // Enter the ID of the live stream you want to watch

async function initLogin() {
  try {
    await login({
      sdkAppId: 0,     // SDKAppID, refer to Step 1 for details
      userId: '',      // UserID, refer to Step 1 for details
      userSig: '',     // userSig, refer to Step 1 for details
    });
  } catch (error) {
    console.error('Login failed:', error);
  }
}

onMounted(async () => {
  await initLogin();
  await setSelfInfo({
    userName: 'My Name/Nickname',    // Username
    avatarUrl: '',                   // Avatar URL address
  });
  await joinLive({ liveId });
});

</script>

<style>html,body,#app{height:100%;width:100%;margin:0;padding:0;overflow:hidden}:global(body){font-size:15px;line-height:1.6;text-rendering:optimizeLegibility;}:global(*),:global(*::before),:global(*::after){box-sizing:border-box;margin:0;}.container{display:grid;grid-template-columns:1fr 320px;height:100%;width:100%;gap:16px;padding:16px;background:var(--bg-color-default);box-sizing:border-box;overflow:hidden;}.live{display:flex;flex-direction:column;background:var(--bg-color-operate);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px var(--shadow-color);}.header{display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid var(--stroke-color-primary);}.back-btn{cursor:pointer;color:var(--text-color-tertiary);transition:color 0.2s;}.back-btn:hover{color:var(--text-color-link-hover);}.avatar{border:1px solid var(--uikit-color-white-7);}.user-name{color:var(--text-color-primary);font-weight:500;}.player{flex:1;background:var(--uikit-color-black-1);min-height:0;}.sidebar{display:flex;flex-direction:column;gap:16px;height:100%;overflow:hidden;}.audience{display:flex;flex-direction:column;background:var(--bg-color-operate);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px var(--shadow-color);flex:1;min-height:0;}.barrage{display:flex;flex-direction:column;background:var(--bg-color-operate);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px var(--shadow-color);flex:1;min-height:0;}.section-header{padding:16px;border-bottom:1px solid var(--stroke-color-primary);background:var(--bg-color-operate);}.section-header h3{margin:0;font-size:16px;font-weight:600;color:var(--text-color-primary);}.section-header span{font-weight:400;color:var(--text-color-secondary);font-size:14px;}.list{flex:1;min-height:0;overflow-y:auto;}.input{border-top:1px solid var(--stroke-color-primary);flex-shrink:0;height:48px;}@media (max-width:1200px){.container{grid-template-columns:1fr;grid-template-rows:60% 20% 20%;gap:12px;}.sidebar{gap:12px;}.audience,.barrage{min-height:200px;}}@media (max-width:768px){.container{padding:8px;gap:8px;grid-template-rows:50% 25% 25%;}.header,.section-header{padding:12px;}.sidebar{gap:8px;}}</style>
```

#### Core API Parameter Description

##### setSelfInfo

Set user information.

|Parameter|Type|Required|Description|
|---------|---------|---------|---------|
|userName|`String`|`Yes`|User nickname, displayed in the live room and chat area.|
|avatarUrl|`String`|`No`|URL address of the user's avatar.|

### Step 4: Start Project

Open your terminal, navigate to your project directory, and run the following command to start the project. You can then watch the live stream.

> **Note:**
> After running the command, enter the local access address in your browser’s address bar (refer to your project configuration, for example `http://localhost:5173/live-player`; the actual port may vary) to view the viewer page.
>

``` bash
npm run dev
```

## Play Live Stream

### Step 1: Start Live Stream
- **Method 1 (Recommended):**

   Use the [Online Hosting Site](https://trtc.io/demo/homepage/#/detail) to start a live stream. After starting, obtain the live stream ID.

- **Method 2:**

   Integrate Host Streaming (Web Desktop Browser) to start a live stream. After starting, obtain the live stream ID.

   > **Important:**
   >
   > Use different **User IDs** for hosting and viewing. Otherwise, the device that logs in later will forcibly log out the device that logged in first (i.e., "kicked offline").
   >

### Step 2: Watch Live Stream

. Enter the corresponding `liveId` to join the live room and watch the stream:

> **Note:**
> To update your personal information, use the `setSelfInfo` method in the sample code from Step 3.
>

### Step 3: Router Configuration

To enable navigation from the live stream list (or homepage) to the live room, configure Vue Router. Create a **router** folder in your project's **src** directory and add an **index.ts** file. Import and use the router in your main file (such as **main.ts** or **index.ts**). See the [GitHub code sample](https://github.com/Tencent-RTC/TUILiveKit/blob/main/Web/web-vite-vue3/src/main.ts). For the live stream list, refer to Live Stream List.

> **Note:**
> The `live-player.vue` file in the following code sample corresponds to the sample file created in Step 3.
>

``` typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/live-player',
    component: () => import('../live-player.vue'),
  },
  // If you need the live stream list feature, add the following route. Note that the path should match your project's actual path.
  // {
    //   path: '/live-list',
    //   component: () => import('../live-list.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;

// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

## Customization

### Color Theme and Language

You can change the default theme and language by configuring parameters in `UIKitProvider` within `App.vue`.

|**UIKitProvider Parameter**|**Optional Values**|**Default Value**|
|---------|---------|---------|
|theme|"light" \| "dark"|"light"|
|language|"zh-CN" \| "en-US"|-|

``` typescript
<UIKitProvider theme="light">
  <router-view />
</UIKitProvider>

<script setup lang="ts">
import { UIKitProvider } from '@tencentcloud/uikit-base-component-vue3';
```

### Button and Icon Customization

To customize buttons, icons, or other controls, modify the relevant code in `live-player.vue`. .

You can also customize the **audience viewer page** to match your project requirements. In addition to layout adjustments, you can modify the **color theme, font, border radius, buttons, icons, input boxes, dialogs**, and more. Add, delete, or update these elements to achieve your desired UI.
| <strong>Category</strong> | <strong>Feature</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <strong>Asset Management</strong> | Custom asset management area display | Supports adjusting icon size, color, or replacing icons. |
| <strong>Live Tools</strong> | Custom live tools information display | Supports adjusting icon size, color, or replacing icons. |
| <strong>Online Audience</strong> | Custom audience information display | <strong>Supports:</strong><br>- Show/hide audience level.<br>- Customize audience information font and color.<br>- Replace with your preferred icon style. |
| <strong>Message List</strong> | Custom live comments area display | <strong>Supports:</strong><br>- Show/hide chat input area.<br>- Customize chat bubble style, audience level, and other content. |

## FAQs

### Browser Autoplay Restrictions

To improve user experience, modern browsers restrict autoplay of media with sound. Audio playback must be triggered by user interaction (such as a click or touch). This prevents websites from unexpectedly playing audio. Most browsers allow autoplay of muted videos, but in low power mode on iOS Safari or in iOS WKWebView with custom autoplay restrictions (such as iOS WeChat browser), muted video autoplay may also be blocked.

#### Autoplay Failure Manifestation

If the site's Media Engagement Index (MEI) does not meet the required threshold, autoplay attempts will fail. By default, when the SDK detects autoplay failure, a popup prompts the user to interact with the page (such as clicking the **Confirm** button). After interaction, browser policy is satisfied and audio playback resumes.

#### Custom Handling of Autoplay Failure

To customize the user experience when autoplay fails (for example, replacing the default popup UI), listen for the SDK's `onAutoplayFailed` callback. The following Vue3 code sample shows how to handle this event and display a custom dialog:
``` java
import TUIRoomEngine, { TUIRoomEvents } from '@tencentcloud/tuiroom-engine-js';
import { useUIKit, TUIMessageBox } from '@tencentcloud/uikit-base-component-vue3';
import { useRoomEngine } from 'tuikit-atomicx-vue3';

const roomEngine = useRoomEngine();

let isShowAutoPlayDialog = false;

export default function useCustomizedAutoPlayDialog() {
  const { t } = useUIKit();
  TUIRoomEngine.once('ready', () => {
    roomEngine.instance?.on(TUIRoomEvents.onAutoPlayFailed, () => {
      if (!isShowAutoPlayDialog) {
        isShowAutoPlayDialog = true;
        TUIMessageBox.alert({
          title: t('RoomCommon.Attention'),
          content: t('RoomNotifications.AudioPlaybackFailed'),
          showClose: false,
          modal: false,
          confirmText: t('Confirm'),
          callback: () => {
            isShowAutoPlayDialog = false;
          },
        });
      }
    });
  });
}

export { useCustomizedAutoPlayDialog };
```

> **Note:**
> Install the required `@tencentcloud/tuiroom-engine-js` package.
>

## Next Steps

You have successfully integrated the audience viewer. Next, you can add **Live Stream List**, **Live Monitoring** features:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|Live Stream List|Display live stream list interface and features, including live stream list and room information display.|Live Stream List (Web Vue3)|
|Live Management System|Operations platform, supports live room management.|Live Management System (Vue3)|

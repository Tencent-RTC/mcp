---
sync_node_id: '192108973293182976'
nav_path:
  - "直播与语聊 SDK"
  - "直播管理"
  - "直播管理系统"
  - "快速接入（Web 桌面浏览器 Vue 版）"
product: "live"
---
## Overview

In live streaming operations, operations management is a critical part of ensuring stable platform operation and improving user experience. The Live Streaming Management System provides one-stop live streaming operations capabilities, covering core features such as live monitoring, room management, gift configuration, and content moderation, helping you quickly build a professional live streaming operations system and achieve efficient live room operations and content governance.

You can choose one of the following two integration methods based on your business needs:

|**Integration Method**|**Applicable Scenarios**|**Integration Notes**|
|---------|---------|---------|
|Direct Use|Quick deployment without extensive customization|Deploy the Live Streaming Management System to your environment and use it directly, or embed it into your existing operations system via iframe.|
|Custom Development|Unified brand styling or custom features and pages required|Build on the open-source codebase to customize pages, menus, and features, then integrate into your existing business system.|

> **Note:**
> The Live Streaming Management System does not provide hosted backend services. You must deploy your own server to generate login credentials and interact with Tencent Cloud services. The repository includes a sample server implementation that you can deploy directly or integrate into your existing backend infrastructure.
> 

## Quick Experience

Before experiencing, you need to Activate Services, and ensure the environment setup and service activation requirements are met.

Fill in the SDKAppId and SDKSecretKey obtained after activation into the demo login form.
    <style>
      .trtc-quick-start * {
        box-sizing: border-box;
      }
      .trtc-quick-start-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 72px;
        padding: 16px;
        margin: 10px 0;
        box-shadow: 0 1px 8px 0px rgba(156, 175, 204, 0.25);
        background-color: rgba(255, 255, 255, 1);
      }
      .trtc-quick-start-item .trtc-quick-start-item-left,
      .trtc-quick-start-item .trtc-quick-start-item-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
      }
      .trtc-quick-start-item .trtc-quick-start-item-left {
        flex: 1 1 auto;
      }
      .trtc-quick-start-item .trtc-quick-start-item-right {
        flex: 0 0 auto;
        justify-content: flex-end;
      }
      .trtc-quick-start-item .platform-name {
        flex: 0 0 132px;
        width: 132px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
      }
      .trtc-quick-start-item .platform-desc {
        font-size: 12px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .trtc-quick-start-item .platform-run-app-without-dropdown {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 110px;
        height: 32px;
        line-height: 32px;
        border-radius: 24px;
        color: rgba(255, 255, 255, 1);
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        background-color: rgba(5, 163, 255, 1);
        text-decoration: none;
        user-select: none;
        cursor: pointer;
      }
      @media (max-width: 768px) and (orientation: portrait) {
        .trtc-quick-start-item .platform-desc,
        .trtc-quick-start-item .platform-name {
          display: none;
        }
      }
    </style>
    <div class="trtc-quick-start">
      <div class="trtc-quick-start-item">
        <div class="trtc-quick-start-item-left">
          <div class="platform-logo">
            
          </div>
          <div class="platform-name">Live Management System (Web)</div>
          <div class="platform-desc">
            Try live monitoring, room management, gift configuration, and content moderation directly in your browser
          </div>
        </div>
        <div class="trtc-quick-start-item-right">
          <a class="platform-run-app-without-dropdown" href="https://web.sdk.qcloud.com/trtc/livekit/monitor/demo/vue/index.html" target="_blank">
            
            <span>Try Now</span>
          </a>
        </div>
      </div>
    </div>

> **Note:**
> The quick experience only demonstrates basic features. For full functionality, please read this document and set up locally for testing, or deploy for production use.
> 

## Features
| <strong>Feature Module</strong> | <strong>Description</strong> | <strong>UI Preview</strong> |
| --- | --- | --- |
| Room List | - Pre-create live rooms in the backend with designated host IDs, allowing hosts to enter assigned rooms directly when starting streams.<br>- Generates OBS streaming URLs enabling hosts to go live with one click via OBS |  |
| Gift Configuration | Supports adding, editing, and deleting gifts and gift categories, with multi-language configuration. |  |

## System Architecture

## Quick Start

### Step 1: Environment Setup and Service Activation

Before getting started, please .

### Step 2: Download the Project

Clone from the GitHub Release page, or use git clone:
``` bash
git clone https://github.com/Tencent-RTC/TUILiveKit_Manager
cd TUILiveKit_Manager
pnpm install
```

### Step 3: Configure the Server
1. Edit `packages/server/config/.env`:

   ``` bash
   SDK_APP_ID=1400000001           # Replace with your SDKAppID
   SECRET_KEY=xxxxxxx              # Replace with your SecretKey
   USER_ID=administrator           # Replace with your admin userID
   ```

   > **Note:**
   > 
   > - For how to get SDK_APP_ID and SECRET_KEY, see Activate Services.
   > - For how to get USER_ID, see Account Management.

2. Start the server:

   ``` bash
   pnpm run start:server
   ```

   > **Note:**
   > 
   > The default port is 9000. You can modify it by setting PORT in .env, and you need to allow firewall access to this port.
   > 

### Step 4: Configure the Frontend

Edit `packages/vue3/.env`:
``` bash
VITE_API_BASE_URL=http://localhost:9000/api
```

> **Note:**
> The port in VITE_API_BASE_URL must match the port the server was started with in the previous step.
> 

### Step 5: Start the Frontend
``` bash
pnpm run dev:vue
```

## Advanced Configuration (Optional)

### Configure Image Upload

The system's gift thumbnails, gift materials, and room cover features rely on image upload and require storage configuration. **If not configured, the frontend will automatically fall back to manual URL input mode, which does not affect other features.**

Add storage configuration to `packages/server/config/.env`. The system supports three options:

#### **Option 1: Tencent Cloud COS Object Storage (Default)**

> **Note:**
> Go to the [Tencent Cloud COS Console](https://console.tencentcloud.com/cos5) to create a bucket and obtain API keys.
> 

``` bash
STORAGE_PROVIDER=cos

COS_SECRET_ID=your_secret_id        # Tencent Cloud API SecretId
COS_SECRET_KEY=your_secret_key      # Tencent Cloud API SecretKey
COS_BUCKET=your-bucket-1250000000   # COS bucket name
COS_REGION=ap-guangzhou             # Bucket region
COS_CDN_DOMAIN=web.sdk.qcloud.com   # (Optional) CDN acceleration domain; if not set, the default COS domain is used
COS_PATH_PREFIX=uploads             # (Optional) Storage path prefix; files will be stored under this directory
```

#### **Option 2: Custom HTTP Upload Endpoint**

Suitable for scenarios with an existing image upload service. The system forwards files to your upload endpoint via `multipart/form-data`.
``` bash
STORAGE_PROVIDER=custom

CUSTOM_UPLOAD_URL=https://your-api.com/upload     # Upload endpoint (required)
CUSTOM_ACCESS_DOMAIN=https://cdn.your-api.com     # (Optional) File access domain prefix
CUSTOM_UPLOAD_FIELD=file                          # (Optional) Upload file field name, default: file
CUSTOM_RESPONSE_URL_FIELD=data.url                # (Optional) JSON path for the URL field in the response, default: data.url
CUSTOM_AUTH_HEADER=Authorization: Bearer token    # (Optional) Custom auth request header
CUSTOM_PATH_PREFIX=uploads                        # (Optional) Storage path prefix
```

> **Note:**
> The custom upload endpoint should return JSON format, e.g.: `{ "code": 0, "data": { "url": "https://cdn.example.com/xxx.png" } }`.
> 

#### **Option 3: Extend Other Storage Services**

To integrate AWS S3, Aliyun OSS, etc., extend as follows:
1. Create `YourProvider.js` in `packages/server/src/services/storage/`, extending the `StorageProvider` base class.

2. Register it in `PROVIDER_MAP` in `packages/server/src/services/storage/index.js`.

3. Set `STORAGE_PROVIDER=your_key` in `.env` with the corresponding configuration items.

### Content Moderation Capabilities

Content moderation requires Tencent Cloud API capabilities, so you need to activate the corresponding features and configure the relevant keys to use them.

Edit `packages/server/config/.env`:
``` bash
# Tencent Cloud API keys (required for content moderation, violation labels, etc.)
TENCENT_CLOUD_SECRET_ID=xxxx    # Replace with your Tencent Cloud SecretId
TENCENT_CLOUD_SECRET_KEY=xxxx   # Replace with your Tencent Cloud SecretKey
```

> **Note：**
> TENCENT_CLOUD_SECRET_ID and TENCENT_CLOUD_SECRET_KEY are used to call the Tencent Cloud IM moderation API (text moderation, correction whitelist) and the TRTC moderation label query API (violation label display). For how to obtain them, see [Tencent Cloud API Key Management](https://console.tencentcloud.com/cam/capi).
> 

### Audio/Video Violation Label Display

### Live Room Comment Content Moderation (Automated Moderation)

## Custom Development

The entry project (`packages/vue3`) is fully open source; you are free to adjust the page structure, navigation menus, brand identity, and page styles. Business capabilities can be flexibly extended in the following ways:
- **Brand and Appearance Customization**: Customize the page title, logo, brand info, etc. via `live-manager.ts`.

- **Component Customization**: Render custom content by setting component properties and slots.

- **Server-side Extension**: Extend backend capabilities such as storage and authentication via the Provider mechanism in `packages/server`.

   > **Note:**
   > 
   > For higher customization needs, we provide a more flexible SDK approach for development.
   > 

### Brand and Menu Configuration

The `packages/vue3/src/live-manager.ts` file in the project is the unified configuration file. Modify this file to customize the brand, menus, slots, and all other content:
``` typescript
import type { Component } from 'vue';

import { configureLiveManager } from 'tuikit-live-manager-sdk-vue';

export default configureLiveManager({
  brand: {
    appName: 'My Live Management System',
    pageTitle: 'Live Management Console',
    logoUrl: '/assets/my-logo.png',
    primaryColor: '#0052D9',
  },
  menus: {
    hidden: [],
    rename: { 'live-list': 'Live Room Management' },
    order: ['live-list', 'live-monitor', 'gift-config'],
    extraMenus: [],
  },
  components: {},
  features: { enableGift: true },
  runtime: {
    apiBaseUrl: 'http://localhost:9000/api',
    language: 'zh-CN',
  },
});
```

> **Note:**
> The project reads environment variables from the `.env` file by default. The example above uses hardcoded values. In practice, we recommend reading from `import.meta.env.VITE_*` environment variables.
> 

### Component Slots

Preset page components provide slots at key positions. You can inject custom Vue components via `configureLiveManager` to extend page functionality:

**Layout Slots**

|Slot Name|Insert Position|Received Props|
|---------|---------|---------|
|`headerRight`|Header right area|-|
|`sidebarBottom`|Sidebar bottom area|-|

``` typescript
export default configureLiveManager({
  components: {
    layout: { headerRight: MyHeaderWidget },
  },
});
```

**LiveMonitor - Live Monitoring Page**

|Slot Name|Insert Position|Received Props|
|---------|---------|---------|
|`userActionExtraItems`|Action area of each live room card|`{ live: MonitorLiveInfo }`|

**Example: Add a custom button to monitoring cards**
``` typescript
// live-manager.ts
import MyMonitorButton from './components/MyMonitorButton.vue';

export default configureLiveManager({
  components: {
    liveMonitor: {
      userActionExtraItems: MyMonitorButton,
    },
  },
});
```

``` typescript
<!-- MyMonitorButton.vue -->
<script setup lang="ts">
import type { MonitorLiveInfo } from 'tuikit-live-manager-sdk-vue';

defineProps<{ live: MonitorLiveInfo }>();
</script>

<template>
  <t-button variant="text" size="small">
    Custom Action — {{ live.liveName }}
  </t-button>
</template>
```

**LiveList - Live Room List Page**

|Slot Name|Insert Position|Received Props|
|---------|---------|---------|
|`beforeToolbar`|Before the list page toolbar|`{ lives: MonitorLiveInfo[]; loading: boolean }`|
|`afterToolbar`|After the list page toolbar|`{ lives: MonitorLiveInfo[]; loading: boolean }`|
|`tableExtraColumns`|Table extra columns|`{ live: MonitorLiveInfo }`|
|`rowActions`|Row action button area|`{ live: MonitorLiveInfo }`|
|`liveFormExtraFields`|Create/edit live room form extra fields|`{ mode: 'create' \| 'edit'; formData: Record<string, unknown> }`|

**Example: Add custom columns to the table**
``` typescript
// live-manager.ts
import CustomColumn from './components/CustomColumn.vue';

export default configureLiveManager({
  components: {
    liveList: {
      tableExtraColumns: CustomColumn,
    },
  },
});
```

``` typescript
<!-- CustomColumn.vue -->
<script setup lang="ts">
import type { MonitorLiveInfo } from 'tuikit-live-manager-sdk-vue';

defineProps<{ live: MonitorLiveInfo }>();
</script>

<template>
  <t-tag :theme="live.isMuted ? 'warning' : 'success'" variant="light">
    {{ live.isMuted ? 'Muted' : 'Normal' }}
  </t-tag>
</template>
```

**LiveControl - Live Room Details Page**

|Slot Name|Insert Position|Received Props|
|---------|---------|---------|
|`beforeLiveInfo`|Before the live room info area|`{ liveInfo: MonitorLiveInfo \| null }`|
|`customControlPanel`|Control panel below statistics cards|`{ liveInfo: MonitorLiveInfo \| null; stats: LiveStats }`|

**Example: Add a custom statistics panel**
``` typescript
// live-manager.ts
import CustomPanel from './components/CustomPanel.vue';

export default configureLiveManager({
  components: {
    liveControl: {
      customControlPanel: CustomPanel,
    },
  },
});
```

``` typescript
<!-- CustomPanel.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { MonitorLiveInfo, LiveStats } from 'tuikit-live-manager-sdk-vue';

const props = defineProps<{
  liveInfo: MonitorLiveInfo | null;
  stats: LiveStats;
}>();

const revenueRate = computed(() => {
  if (!props.stats || props.stats.viewCount === 0) return '0';
  return ((Number(props.stats.giftUserCount ?? 0) / props.stats.viewCount) * 100).toFixed(2);
});
</script>

<template>
  <t-card title="Custom Statistics" class="custom-panel">
    <p>Gift Conversion Rate: {{ revenueRate }}%</p>
    <p>Total Likes: {{ stats.likeCount.toLocaleString() }}</p>
    <p>Total Comments: {{ stats.commentCount.toLocaleString() }}</p>
  </t-card>
</template>
```

**GiftConfig - Gift Configuration Page**

|Slot Name|Insert Position|Received Props|
|---------|---------|---------|
|`giftTableExtraColumns`|Gift table extra columns|`{ gift: GiftItem }`|
|`giftRowActions`|Gift row action button area|`{ gift: GiftItem }`|
|`giftFormExtraFields`|Create/edit gift form extra fields|`{ mode: 'create' \| 'edit'; formData: Record<string, unknown> }`|

**Example: Display category tags in the gift table**
``` typescript
// live-manager.ts
import GiftCategoryTag from './components/GiftCategoryTag.vue';

export default configureLiveManager({
  components: {
    giftConfig: {
      giftTableExtraColumns: GiftCategoryTag,
    },
  },
});
```

``` typescript
<!-- GiftCategoryTag.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { GiftItem } from 'tuikit-live-manager-sdk-vue';

const props = defineProps<{ gift: GiftItem }>();
const categories = computed(() => props.gift.categories ?? []);
</script>

<template>
  <t-space size="small">
    <t-tag v-for="cat in categories" :key="cat" size="small" variant="light">
      {{ cat }}
    </t-tag>
  </t-space>
</template>
```

## Production Deployment

> **Note:**
> - If you already have your own server, choose Option 1: Self-hosted Deployment for more flexibility and integration with your existing system.
> - If you want a quick trial or demo, choose Option 2: Cloud Functions + COS/EdgeOne Pages for faster setup without purchasing and configuring servers.

### Option 1: Self-hosted Deployment
- **Server**: After modifying the configuration, deploy `packages/server` to your server, run `pnpm install` in that directory, then run `node src/index.js` to start the server.

- **Frontend**: After modifying `VITE_API_BASE_URL`, run `pnpm run build:vue` at the root and deploy the build output to a static resource server such as Nginx. You can also place the build output in the server's `public` directory to share the port with the server. In this case, set `VITE_API_BASE_URL=/api` so the frontend uses relative paths for API requests.

### Option 2: Cloud Functions + COS / EdgeOne Pages
- **Server**: Run `npm run deploy:server` at the root, then upload `packages/server/dist/scf-deploy.zip` to Tencent [Cloud Functions](https://www.tencentcloud.com/zh/document/product/583/40688) (Web Functions, Node.js 20.19).

- **Frontend**: Create `.env.production` with the Cloud Function request URL, then run `pnpm run build:vue` at the root and upload the build output to [COS](https://www.tencentcloud.com/zh/document/product/436/32955) or [EdgeOne](https://www.tencentcloud.com/document/product/1145/54208).

   ``` bash
    VITE_API_BASE_URL=https://your-scf-url.com/api
   ```

   > **Note:**
   > 
   > Replace your-scf-url.com with your actual domain and port.
   > 

## Related Documentation
- Getting Started (Web Desktop Browser)

- Activate Services

- Account Management

- [Cloud Functions Getting Started](https://www.tencentcloud.com/zh/document/product/583/40688)

- [COS (Object Storage) Quick Start](https://www.tencentcloud.com/zh/document/product/436/32955)

- [EdgeOne (Edge Security Acceleration Platform) Pages](https://www.tencentcloud.com/document/product/1145/54208)

---
sync_node_id: '216923423718457344'
nav_path:
  - "直播与语聊 SDK"
  - "直播管理"
  - "直播管理系统"
  - "SDK 定制（Vue3）"
product: "live"
---
## Overview

This document introduces **TUILiveKit Manager Vue SDK**  core Hooks to help developers customize the live streaming management console. To quickly experience the out-of-the-box management console, see Live Management System.

For convenient upgrades, this package is released in **closed-source delivery** mode, containing only compiled artifacts and type declarations (`.js` / `.d.ts` / `.css`).

## Preparation

**Environment Requirements:**
- Node.js >= 18

- Vue 3 >= 3.2

- pnpm >= 7

- Chrome / Edge browser recommended for development

## Quick Start

### Step 1: Activate Services

See Activate TUILiveKit Services  to obtain SDK access permissions.

### Step 2: Configure and Start the Server

The SDK requires a backend service to function. Start the server first.
``` bash
pnpm run start:server
```

> **Note:**
> The default port is 9000. When initializing the HTTP client later, `baseURL` must match this port (e.g., `http://localhost:9000/api`).
> 

### Step 3: Install Dependencies

Install this SDK in your Vue 3 project. Peer dependencies will be installed automatically with pnpm:
``` bash
pnpm add tuikit-live-manager-sdk-vue
```

### Step 4: Initialize HTTP Client

**Before using any Hook, you must call** `initHttpClient` **to inject an axios instance.**The SDK has two types of initialization with different responsibilities: `initHttpClient` handles the HTTP communication layer (API requests), while `useLiveMonitorState().init()` handles business capability initialization such as the player. Both must be called.

`initHttpClient` will automatically:
- Inject the axios instance (configure baseURL, timeout, etc.);

- Register credential pass-through interceptors (automatically carrying authentication headers x-sdk-app-id / x-user-id / x-user-sig).

   ``` typescript
   // src/main.ts or app entry file
   import { initHttpClient } from 'tuikit-live-manager-sdk-vue';
   import axios from 'axios';
   
   const axiosInstance = axios.create({
     baseURL: '/api',
     timeout: 10000,
   });
   
   initHttpClient(axiosInstance);
   ```

## Core Hooks

The following three core Composables cover the main scenarios of live streaming operations management. All Composables are singletons, shared across multiple components.
- `useLiveMonitorState()`：Live room management (list, create, edit, end streams, push/pull);

- `useGiftState()`：Gift management (CRUD, categories, multi-language);

- `useRiskControlState(options)`：Risk control management (content moderation, member management, chat management).

### useLiveMonitorState()

Core Composable for live stream monitoring, singleton mode. Manages live room lists, creating/editing/ending streams, and push/pull stream operations.
``` typescript
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-vue';

const {
  init,            // Init player/business capabilities (idempotent)
  liveList,        // Live room list Ref<MonitorLiveInfo[]>
  hasMore,         // Whether more data is available Ref<boolean>
  currentLive,     // Currently selected live room Ref<MonitorLiveInfo | null>
  setCurrentLive,  // Set current room (pass liveId)
  fetchLiveList,   // Fetch room list (supports pagination)
  createLive,      // Create room → Promise<MonitorLiveInfo>
  updateLive,      // Update current room info
  endLive,         // End live (supports liveId or currentLive)
  fetchLiveDetail,  // Fetch room details (with streaming info)
  fetchLiveStats,   // Fetch room statistics
  startPlay,        // Start playback (liveId + containerId)
  stopPlay,         // Stop playback
} = useLiveMonitorState();
```

> **Warning:**
> `init(config)` Used to initialize business capabilities. Requires `ServerConfig` (including server address `baseURL`, timeout, player factory `playerFactory`, etc.). The `playerFactory` is used for playback-related capabilities such as `startPlay`/`stopPlay`. If not provided, the SDK internally creates a default implementation. The HTTP communication layer is handled by `initHttpClient`, with independent `baseURL` values.This is a singleton Composable, shared across multiple components.
> 

**Example: Custom Live Room List**
``` typescript
<script setup>
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-vue';
import { onMounted, ref } from 'vue';

const { init, liveList, fetchLiveList, createLive, setCurrentLive, fetchLiveDetail } = useLiveMonitorState();
const name = ref('');

onMounted(() => {
  init({ baseURL: 'http://localhost:9000/api' });
  fetchLiveList();
});

const handleCreate = async () => {
  const live = await createLive({ anchorId: 'anchor_001', liveName: name.value, coverUrl: '' });
  setCurrentLive(live.liveId);
  await fetchLiveDetail();
};
</script>

<template>
  <div>
    <input v-model="name" />
    <button @click="handleCreate">Create Room</button>
    <ul>
      <li v-for="live in liveList" :key="live.liveId" @click="setCurrentLive(live.liveId)">
        {{ live.liveName }} — {{ live.onlineCount }}  online
      </li>
    </ul>
  </div>
</template>
```

**Pagination Example:**
``` typescript
<script setup>
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-vue';
import { onMounted } from 'vue';

const { init, liveList, hasMore, fetchLiveList } = useLiveMonitorState();

onMounted(() => {
  init({ baseURL: 'http://localhost:9000/api' });
  fetchLiveList();
});

const loadMore = () => {
  if (hasMore.value) {
    fetchLiveList();
  }
};
</script>

<template>
  <div>
    <ul>
      <li v-for="live in liveList" :key="live.liveId">
        {{ live.liveName }} — {{ live.onlineCount }}  online
      </li>
    </ul>
    <button v-if="hasMore" @click="loadMore">Load More</button>
  </div>
</template>
```

### useGiftState()

Core Composable for gift management, singleton mode. Manages gift CRUD operations, category management, and multi-language configuration.
``` typescript
import { useGiftState } from 'tuikit-live-manager-sdk-vue';

const {
  giftList,                  // Gift list Ref<GiftItem[]>
  giftCategoryList,          // Category list Ref<GiftCategoryItem[]>
  fetchGiftList,             // Fetch gift list (also returns categories)
  createGift,                // Create Gift → Promise<string>
  updateGift,                // Update gift
  deleteGift,                // Delete gift (pass giftId)
  createGiftCategory,        // Create gift category
  updateGiftCategory,        // Update gift category
  deleteGiftCategory,        // Delete gift category
  addGiftCategoryRelations,       // Add gift-category relation
  deleteGiftCategoryRelations,    // Remove gift-category relation
  // Multi-language Management
  getGiftLanguage,                // Get gift multi-language info
  setGiftLanguage,                // Set gift multi-language info
  deleteGiftLanguage,             // Deletegift multi-language
  getGiftCategoryLanguage,        // Get category multi-language info
  setGiftCategoryLanguage,        // Set category multi-language info
  deleteGiftCategoryLanguage,     // Deletecategory multi-language info
} = useGiftState();
```

**Example: Gift Management Page**
``` typescript
<script setup>
import { useGiftState } from 'tuikit-live-manager-sdk-vue';
import { onMounted, ref } from 'vue';

const {
  giftList, giftCategoryList, fetchGiftList,
  createGift, updateGift, deleteGift,
  createGiftCategory, deleteGiftCategory,
} = useGiftState();

const newGiftName = ref('');
const selectedCategory = ref('');

onMounted(() => {
  fetchGiftList();
});

const handleCreateGift = async () => {
  await createGift({ id: `gift_${Date.now()}`, name: newGiftName.value, iconUrl: '', price: 100 });
  newGiftName.value = '';
  await fetchGiftList();
};

const handleDelete = async (giftId: string) => {
  await deleteGift(giftId);
  await fetchGiftList();
};

const handleCreateCategory = async () => {
  await createGiftCategory({ name: 'Popular Gifts' });
  await fetchGiftList();
};
</script>

<template>
  <div>
    <input v-model="newGiftName" placeholder="Gift Name" />
    <button @click="handleCreateGift">Create Gift</button>
    <button @click="handleCreateCategory">Create Category</button>

    <div v-for="cat in giftCategoryList" :key="cat.id">
      <h3>{{ cat.name }}</h3>
      <ul>
        <li v-for="gift in giftList.filter(g => g.categoryIds?.includes(cat.id))" :key="gift.id">
          {{ gift.name }} — {{ gift.price }}  coins
          <button @click="() => handleDelete(gift.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>
```

### useRiskControlState(options)

Core Composable for risk control management. Manages content moderation, member control, and chat management. Requires `liveId`**.**
``` typescript
import { useRiskControlState } from 'tuikit-live-manager-sdk-vue';

const {
  // Moderation Management
  textModerationAvailable,        // Whether moderation is available Ref<boolean>
  moderationMode,                 // Moderation mode: cloud | custom Ref<ModerationMode>
  customModerationToggleEnabled,  // Full moderation toggle (custom mode)Ref<boolean>
  updateCustomModerationToggleEnabled, // Set full moderation toggle (custom mode)
  textModerationList,             // Text moderation record list Ref<TextModerationItem[]>
  textModerationTotal,            // Total moderation records Ref<number>
  textModerationPageNum,          // Current moderation page Ref<number>
  textModerationLoading,          // Moderation list loading state Ref<boolean>
  fetchTextModerationList,        // Fetch moderation list (supports pagination)
  approveTextModerationItems,     // Batch approve moderation records
  bypassCorrectionKeyword,        // Bypass correction keyword params: { content: string; liveId?: string }
  deleteModerationItems,          // Delete moderation items ids: string[]

  // Member Management
  muteMember,                     // Mute member
  unmuteMember,                   // Unmute member
  banMember,                      // Ban member
  unbanMember,                    // Unban member
  mutedList,                      // Muted list Ref<MutedMember[]>
  bannedList,                     // Banned list Ref<BannedMember[]>
  fetchMutedList,                 // Fetch muted list
  fetchBannedList,                // Fetch banned list

  // Chat Management
  sendViolationWarning,           // Send violation warning
  sendAdminMessage,               // Send admin message content: string
} = useRiskControlState({ liveId: 'xxx', pageSize: 20 });
```

**Example: Custom Moderation List**
``` typescript
<script setup>
import { useRiskControlState } from 'tuikit-live-manager-sdk-vue';
import { onMounted } from 'vue';

const props = defineProps<{ liveId: string }>();

const { textModerationList, fetchTextModerationList, approveTextModerationItems, muteMember } =
  useRiskControlState({ liveId: props.liveId, pageSize: 20 });

onMounted(() => { fetchTextModerationList(); });
</script>

<template>
  <div v-for="item in textModerationList" :key="item.id">
    <span>{{ item.content }}</span>
    <button @click="approveTextModerationItems({ ids: [item.id] })">Approve</button>
    <button @click="muteMember({ memberAccounts: [item.userId], muteTime: 300 })">Mute 5 min</button>
  </div>
</template>
```

### tuikit-atomicx-vue3 Rendering Capabilities

Complete application development requires integration with tuikit-atomicx-vue3  for audio/video and IM rendering capabilities:

|Category|Import|Description|
|---------|---------|---------|
|Video Playback|`LiveView`|Live video rendering component.|
|Bullet Messages|`BarrageList`, `BarrageInput`|Bullet chat list display and input box.|
|Audience List|`LiveAudienceList`, `useLiveAudienceState`|Audience list component and state.|
|Live Operations|`useLiveListState`, `LiveListEvent`|Join/leave live streams, event subscriptions.|
|Login Authentication|`useLoginState`|Login and user info retrieval.|
|Player Controls|`useLivePlayerState`|Control bar visibility, player settings.|

## Related Documentation
- [TUILiveKit Manager Full Documentation](https://github.com/Tencent-RTC/TUILiveKit_Manager)

- Getting Started (Web Vue3)

- Activate TUILiveKit Services

- TUILiveKit Admin Account Management

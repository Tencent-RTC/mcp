---
sync_node_id: '216923423836946432'
nav_path:
  - "直播与语聊 SDK"
  - "直播管理"
  - "直播管理系统"
  - "SDK 定制（React）"
product: "live"
---
## Overview

This document introduces **TUILiveKit Manager React SDK**  core Hooks to help developers customize the live streaming management console. To quickly experience the out-of-the-box management console, see Live Management System, for runnable project source code.

For convenient upgrades, this package is released in **closed-source delivery** mode, containing only compiled artifacts and type declarations (`.js` / `.d.ts` / `.css`).

## Preparation

**Environment Requirements:**
- Node.js >= 18

- React >= 17

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

Install this SDK in your React project. Peer dependencies will be installed automatically with pnpm:
``` bash
pnpm add tuikit-live-manager-sdk-react
```

### Step 4: Initialize HTTP Client

**Before using any Hook, you must call** `initHttpClient` **to inject an axios instance.**The SDK has two types of initialization with different responsibilities: `initHttpClient` handles the HTTP communication layer (API requests), while `useLiveMonitorState().init()` handles business capability initialization such as the player. Both must be called.

`initHttpClient` will automatically:
- Inject the axios instance (configure baseURL, timeout, etc.)

- Register credential pass-through interceptors (automatically carrying authentication headers x-sdk-app-id / x-user-id / x-user-sig)

   ``` typescript
   // src/main.tsx or app entry file
   import { initHttpClient } from 'tuikit-live-manager-sdk-react';
   import axios from 'axios';
   
   const axiosInstance = axios.create({
     baseURL: '/api',
     timeout: 10000,
   });
   
   initHttpClient(axiosInstance);
   ```

## Core Hooks

The following three core Hooks cover the main scenarios of live streaming operations management. All Hooks are singletons, shared across multiple components.
- `useLiveMonitorState()`: Live room management (list, create, edit, end streams, push/pull);

- `useGiftState()`: Gift management (CRUD, categories, multi-language);

- `useRiskControlState(options)`: Risk control management (content moderation, member management, chat management).

### useLiveMonitorState()

Core Hook for live stream monitoring, singleton mode. Manages live room lists, creating/editing/ending streams, and push/pull stream operations.
``` typescript
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-react';

const {
  init,            // Init player/business capabilities (idempotent)
  liveList,        // Live room list MonitorLiveInfo[]
  hasMore,         // Whether more data is available
  currentLive,     // Currently selected live room
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
> `init(config)` Used to initialize business capabilities. Requires `ServerConfig` (including server address `baseURL`, timeout, player factory `playerFactory`, etc.). The `playerFactory` is used for playback-related capabilities such as `startPlay`/`stopPlay`. If not provided, the SDK internally creates a default implementation. The HTTP communication layer is handled by `initHttpClient`, with independent `baseURL` values.This is a singleton Hook, shared across multiple components.
> 

**Example: Custom Live Room List**
``` tsx
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-react';
import { useEffect, useState } from 'react';

function CustomLiveList() {
  const { init, liveList, fetchLiveList, createLive, setCurrentLive, fetchLiveDetail } = useLiveMonitorState();
  const [name, setName] = useState('');

  useEffect(() => {
    init({ baseURL: 'http://localhost:9000/api' });
    fetchLiveList();
  }, []);

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={async () => {
        const live = await createLive({ anchorId: 'anchor_001', liveName: name, coverUrl: '' });
        setCurrentLive(live.liveId);
        await fetchLiveDetail();
      }}>Create Room</button>
      <ul>
        {liveList.map(live => (
          <li key={live.liveId} onClick={() => setCurrentLive(live.liveId)}>
            {live.liveName} — {live.onlineCount}  online
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Pagination Example:**
``` tsx
import { useLiveMonitorState } from 'tuikit-live-manager-sdk-react';
import { useEffect } from 'react';

function LiveListPage() {
  const { init, liveList, hasMore, fetchLiveList } = useLiveMonitorState();

  useEffect(() => {
    init({ baseURL: 'http://localhost:9000/api' });
    fetchLiveList();
  }, []);

  return (
    <div>
      <ul>
        {liveList.map(live => (
          <li key={live.liveId}>{live.liveName} — {live.onlineCount}  online</li>
        ))}
      </ul>
      {hasMore && <button onClick={() => fetchLiveList()}>Load More</button>}
    </div>
  );
}
```

### useGiftState()

Core Hook for gift management, singleton mode. Manages gift CRUD operations, category management, and multi-language configuration.
``` typescript
import { useGiftState } from 'tuikit-live-manager-sdk-react';

const {
  giftList,                  // Gift list GiftItem[]
  giftCategoryList,          // Category list GiftCategoryItem[]
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
``` tsx
import { useGiftState } from 'tuikit-live-manager-sdk-react';
import { useEffect, useState } from 'react';

function GiftManager() {
  const {
    giftList, giftCategoryList, fetchGiftList,
    createGift, updateGift, deleteGift,
    createGiftCategory,
  } = useGiftState();

  const [newGiftName, setNewGiftName] = useState('');

  useEffect(() => { fetchGiftList(); }, []);

  const handleCreateGift = async () => {
    await createGift({ id: `gift_${Date.now()}`, name: newGiftName, iconUrl: '', price: 100 });
    setNewGiftName('');
    await fetchGiftList();
  };

  const handleDelete = async (giftId: string) => {
    await deleteGift(giftId);
    await fetchGiftList();
  };

  return (
    <div>
      <input value={newGiftName} onChange={e => setNewGiftName(e.target.value)} placeholder="Gift Name" />
      <button onClick={handleCreateGift}>Create Gift</button>
      <button onClick={() => createGiftCategory({ name: 'Popular Gifts' }).then(fetchGiftList)}>Create Category</button>

      {giftCategoryList.map(cat => (
        <div key={cat.id}>
          <h3>{cat.name}</h3>
          <ul>
            {giftList.filter(g => g.categoryIds?.includes(cat.id)).map(gift => (
              <li key={gift.id}>
                {gift.name} — {gift.price}  coins
                <button onClick={() => handleDelete(gift.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### useRiskControlState(options)

Core Hook for risk control management. Manages content moderation, member control, and chat management. **Requires** `liveId`**.**
``` typescript
import { useRiskControlState } from 'tuikit-live-manager-sdk-react';

const {
  // Moderation Management
  textModerationAvailable,        // Whether moderation is available
  moderationMode,                 // Moderation mode: cloud | custom
  customModerationToggleEnabled,  // Full moderation toggle (custom mode)
  updateCustomModerationToggleEnabled, // Set full moderation toggle (custom mode)
  textModerationList,             // Text moderation record list
  textModerationTotal,            // Total moderation records
  textModerationPageNum,          // Current moderation page
  textModerationLoading,          // Moderation list loading state
  fetchTextModerationList,        // Fetch moderation list (supports pagination)
  approveTextModerationItems,     // Batch approve moderation records
  bypassCorrectionKeyword,        // Bypass correction keyword params: { content: string; liveId?: string }
  deleteModerationItems,          // Delete moderation items ids: string[]

  // Member Management
  muteMember,                     // Mute member
  unmuteMember,                   // Unmute member
  banMember,                      // Ban member
  unbanMember,                    // Unban member
  mutedList,                      // Muted list
  bannedList,                     // Banned list
  fetchMutedList,                 // Fetch muted list
  fetchBannedList,                // Fetch banned list

  // Chat Management
  sendViolationWarning,           // Send violation warning
  sendAdminMessage,               // Send admin message content: string
} = useRiskControlState({ liveId: 'xxx', pageSize: 20 });
```

**Example: Custom Moderation List**
``` tsx
import { useRiskControlState } from 'tuikit-live-manager-sdk-react';
import { useEffect } from 'react';

function CustomRiskPanel({ liveId }: { liveId: string }) {
  const { textModerationList, fetchTextModerationList, approveTextModerationItems, muteMember } =
    useRiskControlState({ liveId, pageSize: 20 });

  useEffect(() => { fetchTextModerationList(); }, []);

  return (
    <div>
      {textModerationList.map(item => (
        <div key={item.id}>
          <span>{item.content}</span>
          <button onClick={() => approveTextModerationItems({ ids: [item.id] })}>Approve</button>
          <button onClick={() => muteMember({ memberAccounts: [item.userId], muteTime: 300 })}>Mute 5 min</button>
        </div>
      ))}
    </div>
  );
}
```

### tuikit-atomicx-react Rendering Capabilities

Complete application development requires integration with `tuikit-atomicx-react` for audio/video and IM rendering capabilities:

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

- Getting Started (Web)

- Activate TUILiveKit Services

- TUILiveKit Admin Account Management

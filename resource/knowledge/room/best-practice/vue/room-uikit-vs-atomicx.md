---
title: "Comparison of tuikit-atomicx-vue3/room vs roomkit-web-vue3（roomkit-web-vue3 vs tuikit-atomicx-vue3/room 的区别）"
product: room
frameworks: [vue, web]
scope: platform_specific
tags: [TUIRoomKit, Atomicx, UIKit, tuikit-atomicx-vue3, roomkit-web-vue3, useRoomState, conference, layer comparison, no-UI, pre-built UI, custom integration, dependency, vue3]
version_range: ">=2.0.0"
---

# Comparison of tuikit-atomicx-vue3/room vs roomkit-web-vue3

## 1. Key Takeaways

- `tuikit-atomicx-vue3/room` (Atomicx) is the **atomic capability layer**: the primary path for no-UI / highly customized integration, decomposing room, device, and member states into reactive State Hooks.
- `@tencentcloud/roomkit-web-vue3` (RoomKit / UIKit) is the **pre-built UI low-code layer**: an out-of-the-box meeting suite with page-level components.
- Dependency: **RoomKit (pre-built UI) is a productized wrapper built on top of Atomicx/Room capabilities**. From a business perspective, RoomKit reuses/interfaces with Atomicx capabilities rather than being two independent room protocols.
- API entry points: Atomicx uses `useRoomState()`, UIKit uses `conference`.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `useRoomState` | Atomicx room state entry | `createAndJoinRoom` / `joinRoom` / `leaveRoom` / `endRoom` / `currentRoom` |
| `useDeviceState` | Atomicx device state | Device toggles, screen sharing, etc. |
| `useRoomParticipantState` | Atomicx participant state | Member management, event subscriptions |
| `useLoginState` | Atomicx login state | Login capability, reusable within UIKit sessions |
| `conference` | UIKit meeting facade API | Recommended: `createAndJoinRoom` / `joinRoom` / `leaveRoom` / `endRoom` |
| `ConferenceMainView` | UIKit pre-built view | Complete meeting UI: login, join room, meeting controls, layout, seat management |

## 3. Mechanism & Sequence

### Layer Comparison

| Comparison | `tuikit-atomicx-vue3/room` (Atomicx) | `@tencentcloud/roomkit-web-vue3` (RoomKit / UIKit) |
|---|---|---|
| **Layer** | Atomicx (atomic capability layer): State Hooks + optional atomic UI components | UIKit / pre-built UI low-code layer: out-of-the-box meeting suite with page-level components |
| **Package positioning** | No-UI / highly customized integration path; decomposes room, device, and member into reactive State | Pre-built UI rapid integration path; provides complete meeting UI and `conference` facade API |
| **Core capabilities** | `useRoomState` / `useDeviceState` / `useRoomParticipantState` / `useLoginState`: create room, join meeting, device control, screen sharing, member management, event subscription; compose your own UI | `conference` + pre-built views (e.g. `ConferenceMainView`): login, join room, meeting controls, layout, seat management; supports selective component visibility / custom Widgets |
| **Use cases** | Embedding audio/video into your own business UI (telemedicine, OA, education dashboards, etc.) with 100% control over interaction and branding | Fastest path to launch a standard meeting/webinar with minimal UI coding, accepting the official meeting interaction |
| **Dependency** | Built on RoomEngine / TRTC / IM; an atomic integration approach | Pre-built UI reuses/interfaces with Atomicx capabilities (e.g. login uses `useLoginState`, in-meeting logic uses Room capabilities); RoomKit (pre-built UI) is a productized wrapper on top of Atomicx/Room |
| **API entry** | `useRoomState()`: `createAndJoinRoom` / `joinRoom` / `leaveRoom` / `endRoom`, `currentRoom`, event subscriptions, etc. | `conference`: recommended `createAndJoinRoom` / `joinRoom` / `leaveRoom` / `endRoom` |
| **UI form** | Optional pre-built atomic components + primarily self-composed custom modules | Primarily pre-built complete meeting UI, with limited customization via Widget / visibility configuration |

## 4. Standard Usage

### Atomicx Approach (no-UI, custom integration)

```javascript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { createAndJoinRoom } = useRoomState();

createAndJoinRoom({
  roomId: 'YOUR_ROOM_ID', // 必填：建议由业务后台生成的唯一标识
  options: {
    roomName: '项目进度周会',
  },
});
// 通过 useDeviceState / useRoomParticipantState 等获取响应式状态自拼 UI
```

### UIKit Approach (pre-built UI, rapid integration)

```javascript
import { conference, ConferenceMainView, ConferenceMainViewH5, RoomEvent, genTestUserSig } from '@tencentcloud/roomkit-web-vue3';
const SDKAppID = 0; // 替换为您在开通服务阶段获取的 SDKAppID
const SDKSecretKey = ''; // 替换为您在开通服务阶段获取的 SDKSecretKey
const handleEnterRoom = async () => {
  if (!SDKAppID || !SDKSecretKey) {
    return;
  }
  try {
    const { userSig } = genTestUserSig({ userId: 'test01', sdkAppId: SDKAppID, secretKey: SDKSecretKey });
    await conference.login({ sdkAppId: SDKAppID, userId: 'test01', userSig });
    await conference.setSelfInfo({ userName: 'test', avatarUrl: '' });
    await conference.createAndJoinRoom({ roomId: '123456', options: { roomName: `test01 的会议` } });
    inRoom.value = true;
  } catch (error) {
    console.error('进入会议失败:', error);
  }
};
// 使用预制 ConferenceMainView 渲染完整会议 UI
```

## 5. Expected Results

- No-UI / highly customized needs: choose Atomicx, use `useRoomState()` + State Hooks to compose your own UI.
- Fastest path to a standard meeting: choose UIKit, use `conference` + `ConferenceMainView`.
- Dependency: UIKit reuses Atomicx capabilities; they are not two independent protocols.
- API entry: Atomicx uses `useRoomState()`, UIKit uses `conference`.

## 6. Common Pitfalls

- Pitfall 1: Assuming Atomicx and UIKit are two independent room protocols (UIKit is built on top of Atomicx/Room capabilities).
- Pitfall 2: Assuming Atomicx includes a complete meeting UI (Atomicx provides State Hooks + optional atomic components; UI must be self-composed).
- Pitfall 3: Assuming UIKit cannot be customized (it supports selective component visibility / custom Widgets).
- Pitfall 4: Confusing the API entry points of the two approaches (Atomicx uses `useRoomState()`, UIKit uses `conference`).

## 7. Problem Definition (retrieval hint)

Comparing the positioning differences between two TUIRoomKit Vue3 integration approaches: `tuikit-atomicx-vue3/room` (Atomicx Core SDK, no-UI, State Hooks self-composed) vs `@tencentcloud/roomkit-web-vue3` (RoomKit UIKit, pre-built UI, conference low-code) in terms of layer, capabilities, use cases, dependency, and API entry (useRoomState vs conference).

## 8. Alternative Queries (retrieval recall)

- What is the difference between Atomicx and RoomKit?
- How to choose between `tuikit-atomicx-vue3/room` and `roomkit-web-vue3`?
- How to choose between TUIRoomKit no-UI and pre-built UI approaches?
- What is the difference between `useRoomState` and `conference`?
- Is RoomKit based on Atomicx?
- Which package for custom meeting room UI?
- Use Atomicx or UIKit for rapid meeting integration?

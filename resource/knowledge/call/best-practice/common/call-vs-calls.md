---
title: "TUICallKit Difference Between calls and call/groupCall（call、groupCall 和 calls 的区别 / 参数1和2分别代表什么）"
product: call
frameworks: [react, vue, web]
scope: platform_common
tags: [call, calls, groupCall, userIDList, TUICallKit, init, v4.x, calls-uikit, vue2, vue2.6, vue2.7, vue3, call vs calls difference, callMediaType, parameters 1 and 2, numeric literal, call type, enum constant]
version_range: ">=4.0.0"
---

# TUICallKit React/Vue: Difference Between calls and call/groupCall for Initiating Audio/Video Calls

## 1. Key Takeaways

- TUICallKit React / Vue **v4.x must use `calls`** to initiate one-on-one or group calls.
- `call` and `groupCall` are deprecated since v4.0.0.
- `init` must be completed before initiating a call; otherwise the call may fail or enter an abnormal state.
- Use the `CallMediaType` enum constant for `type`; using numeric literals (1/2) as the primary approach is not recommended.
- `userIDList` must be an array (even for one-on-one calls); pass `chatGroupID` only when linking with a Chat group.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `TUICallKitAPI` | v4.x entry object | Imported from `@trtc/calls-uikit-{react\|vue}`, replaces the legacy `TUICallKitServer` |
| `calls` | Initiate a call (v4.x) | Unified entry for one-on-one and group calls |
| `call` / `groupCall` | Initiate a call (legacy) | Used before v4.0.0, deprecated in v4.x |
| `CallMediaType` | Call media type enum | `AUDIO` for voice, `VIDEO` for video |
| `roomID` / `strRoomID` | Room ID | Mutually exclusive; choose one, do not mix |

## 3. Mechanism & Sequence

Initialize -> log in -> call `calls` to initiate a call -> wait for callee to answer -> call established -> call ends.

For new v4.x projects, start directly with `calls`. When migrating legacy projects, replace `call`/`groupCall` with `calls` and replace `TUICallKitServer` with `TUICallKitAPI`.

## 4. Standard Usage

1. Import `TUICallKitAPI` from the corresponding platform package.
2. Call `TUICallKitAPI.init({ SDKAppID, userID, userSig })` to complete initialization.
3. Call `TUICallKitAPI.calls({ userIDList, type })` to initiate a call.
4. Handle call initiation failures in the `catch` branch.

```javascript
// React: @trtc/calls-uikit-react
// Vue 3: @trtc/calls-uikit-vue
// Vue 2.7: @trtc/calls-uikit-vue2
// Vue 2.6: @trtc/calls-uikit-vue2.6  （API 一致，仅包名不同）
import { TUICallKitAPI } from "@trtc/calls-uikit-react";

// 1. 初始化
TUICallKitAPI.init({ SDKAppID, userID, userSig });

// 2. 发起通话（单聊或多人）
try {
  await TUICallKitAPI.calls({
    userIDList: ['jack', 'tom'],
    type: CallMediaType.VIDEO_CALL
  });
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call. Reason:${error}`);
}
```

`calls` parameter reference:

| Parameter | Type | Required | Description |
|---|---|---|---|
| userIDList | Array\<String\> | Yes | List of users to call |
| type | CallMediaType | Yes | Call media type (`AUDIO`/`VIDEO`) |
| chatGroupID | String | No | Chat group ID |
| roomID | Number | No | Numeric room ID, range [1, 2147483647] |
| strRoomID | String | No | String room ID. Mutually exclusive with roomID; if both are provided, roomID takes priority |
| timeout | Number | No | Call timeout in seconds, default 30s, range 10s–600s |
| userData | String | No | Custom extension field; the callee can read it from `ON_CALL_RECEIVED` |
| offlinePushInfo | Object | No | Custom offline push parameters |

CallMediaType values:

| CallMediaType | Description |
|---|---|
| `CallMediaType.AUDIO` | Voice call |
| `CallMediaType.VIDEO` | Video call |

## 5. Expected Results

- After `TUICallKitAPI.calls` succeeds, the callee receives a call invitation.
- Once the callee answers, the call is established and both parties can communicate via audio/video.
- When the call times out or the callee rejects, the `catch` branch receives a clear error message.

## 6. Common Pitfalls

- Pitfall 1: Continuing to use `call` / `groupCall` in v4.x (deprecated; no error is thrown but functionality is incomplete).
- Pitfall 2: Passing a single string via a `userID` field instead of `userIDList` (v4.x no longer supports single-string parameters).
- Pitfall 3: Mixing `roomID` and `strRoomID` (they are mutually exclusive and not interchangeable).
- Pitfall 4: Persistently using numeric literals (1/2) for `type` instead of `CallMediaType` enum constants.

## 7. Problem Definition (retrieval hint)

TUICallKit React/Vue v4.x users ask how to initiate audio/video calls and the difference between `calls` and the legacy `call`/`groupCall`, including migration steps.

## 8. Alternative Queries (retrieval recall)

- How to initiate a call with TUICallKit React/Vue?
- What is the difference between `calls` and `call`?
- How to pass the `userIDList` parameter in v4.x?
- Can `CallMediaType` and numeric values 1/2 be mixed?
- What should I watch out for when migrating from `TUICallKitServer.call` to `TUICallKitAPI.calls`?
- What do `type` parameter values 1 and 2 represent in `call`?
- What do `callMediaType` values 1 and 2 mean — voice or video?
- What do TUICallKit call type numbers 1 and 2 mean?

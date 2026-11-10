---
title: "How to get the roomID during a TUICallKit Call（获取 TUICallKit 房间号）"
product: call
frameworks: [react, vue, miniprogram, web]
scope: platform_common
tags: [TUICallKit, roomID, room ID, ON_CALL_BEGIN, ON_CALL_END, callengine, get room ID, call room ID, Roomid, onCallBegin]
version_range: ">=4.0.0"
---

# How to Get the Room ID During a TUICallKit Call

## 1. Key Takeaways

- To get the call room ID: listen to TUICallEngine events (`ON_CALL_BEGIN`, `ON_CALL_END`, etc.) and read `event.roomID`, which is the current call's room ID.
- First obtain the TUICallEngine instance via `TUICallKitAPI.getTUICallEngineInstance()`, then call `on()` to listen to events.
- The API is the same across React, Vue, and mini programs; only the package name differs.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `TUICallEvent.ON_CALL_BEGIN` | Call established event | Triggered when the call connects; carries `roomID` |
| `TUICallEvent.ON_CALL_END` | Call ended event | Triggered when the call ends; carries `roomID` |
| `TUICallKitAPI.getTUICallEngineInstance()` | Get the TUICallEngine instance | Obtains the underlying engine instance from TUICallKit |
| `engine.on(event, handler)` | Listen to engine events | Registers event callbacks via the engine instance |
| `event.roomID` | Call room ID | The room ID field in the event parameters |

## 3. Mechanism & Sequence

TUICallKit initializes -> call connects (`ON_CALL_BEGIN`) -> call in progress -> call ends (`ON_CALL_END`). Call-related events such as `ON_CALL_BEGIN` and `ON_CALL_END` all carry `roomID`; simply read it in the callback.

## 4. Standard Usage

1. Get the TUICallEngine instance via `TUICallKitAPI.getTUICallEngineInstance()`.
2. Call `engine.on()` to listen to `TUICallEvent.ON_CALL_BEGIN` or `ON_CALL_END`.
3. Read `event.roomID` in the callback to obtain the room ID.

```javascript
// Web: @trtc/call-engine-lite-js
// 小程序: @trtc/call-engine-lite-wx  （API 一致，仅包名不同）
import { TUICallEvent } from "@trtc/call-engine-lite-js";

const handleOnCallBegin = function(event) {
  // event.roomID 即为当前通话的房间号
  console.log('通话建立，房间号：', event.roomID);
};

TUICallKitAPI.getTUICallEngineInstance().on(
  TUICallEvent.ON_CALL_BEGIN,
  handleOnCallBegin
);
```

## 5. Expected Results

- After the call is established, the `ON_CALL_BEGIN` callback fires and `event.roomID` returns a valid room ID.
- After the call ends, the `ON_CALL_END` callback fires and `event.roomID` can also be read.
- The `roomID` value remains constant throughout the call.

## 6. Common Pitfalls

- Pitfall 1: Calling `getTUICallEngineInstance()` before TUICallKit initialization completes (ensure initialization is done first).
- Pitfall 2: Assuming `roomID` changes during the call (the room ID is fixed for a given call).

## 7. Problem Definition (retrieval hint)

Web TUICallKit React/Vue/mini program users need to get the current call's room ID for logging or associating with other services.

## 8. Alternative Queries (retrieval recall)

- How to get the room ID in TUICallKit?
- How to obtain the roomID when a call is established?
- How to listen to the `ON_CALL_BEGIN` event?
- How to get the call room ID in TUICallKit React?
- How to get the roomID in mini program TUICallKit?
- How to get the call room ID / Roomid?
- How to get the room ID in Web TUICallKit?
- How to obtain the call room ID?

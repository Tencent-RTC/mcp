---
title: "How to Get the TUICallEngine Instance from Web TUICallKit（TUICallKit 如何获取 TUICallengine 实例）"
product: call
frameworks: [react, vue, miniprogram, web]
scope: platform_common
tags: [TUICallKit, getTUICallEngineInstance, engine instance, underlying engine, WeChat native mini program, uniapp mini program]
version_range: ">=4.0.0"
---

# How to Get the TUICallEngine Instance from Web TUICallKit

## 1. Key Takeaways

- Use `TUICallKitAPI.getTUICallEngineInstance()` to get the underlying TUICallEngine instance.
- Once you have the engine instance, you can listen to call events (e.g., `ON_CALL_BEGIN`, `ON_CALL_RECEIVED`) via `.on()`.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `TUICallKitAPI` | TUICallKit API entry | Imported from the corresponding platform package; provides `getTUICallEngineInstance()` |
| `getTUICallEngineInstance()` | Get the TUICallEngine instance | Returns the engine instance for event listening and underlying API calls |
| `TUICallEngine` | Engine instance | Obtained via this method; used to register event callbacks |

## 3. Mechanism & Sequence

TUICallKit initialization completes -> call `TUICallKitAPI.getTUICallEngineInstance()` to get the engine instance -> use the engine instance to register event listeners or call underlying APIs.

Ensure TUICallKit initialization is complete before calling; otherwise it may return `undefined`.

## 4. Standard Usage

1. Import `TUICallKitAPI` from the corresponding platform package.
2. Call `TUICallKitAPI.getTUICallEngineInstance()` to get the engine instance.
3. Use the engine instance to register event listeners or call other underlying methods.

```javascript
// React: @trtc/calls-uikit-react
// Vue 3: @trtc/calls-uikit-vue
// Vue 2.7: @trtc/calls-uikit-vue2
// Vue 2.6: @trtc/calls-uikit-vue2.6
// uniapp 小程序: @trtc/calls-uikit-wx-uniapp
// 微信原生小程序: @trtc/calls-uikit-wx  （API 一致，仅包名不同）
import { TUICallKitAPI } from "@trtc/calls-uikit-react";

const tuiCallEngine = TUICallKitAPI.getTUICallEngineInstance();

if (tuiCallEngine) {
  // 获取成功，可监听事件或调用底层 API
  tuiCallEngine.on(TUICallEvent.ON_CALL_BEGIN, (event) => {
    console.log('通话建立', event);
  });
} else {
  console.warn('TUICallEngine 实例未就绪，请确认 TUICallKit 已完成初始化');
}
```

## 5. Expected Results

- `getTUICallEngineInstance()` returns a non-`undefined` engine instance that can be used normally.
- Event callbacks registered via the engine instance trigger correctly.
- Multiple calls return the same engine instance (singleton).

## 6. Common Pitfalls

- Pitfall 1: Calling `getTUICallEngineInstance()` before TUICallKit initialization completes (returns `undefined`).
- Pitfall 2: Assuming each call to `getTUICallEngineInstance()` creates a new engine instance (it is a singleton; multiple calls return the same instance).
- Pitfall 3: Directly creating an instance from the mini program engine package (use `TUICallKitAPI.getTUICallEngineInstance()` instead of creating one manually).

## 7. Problem Definition (retrieval hint)

TUICallKit users need to obtain the underlying TUICallEngine instance to listen to call events or invoke underlying APIs.

## 8. Alternative Queries (retrieval recall)

- How to get the TUICallEngine instance from TUICallKit?
- How to use `getTUICallEngineInstance`?
- How to get the TUICallEngine instance in TUICallKit Vue?
- How to listen to underlying TUICallEngine events in TUICallKit React?
- Can TUICallKit mini program get the TUICallEngine instance?
- What can you do after getting the engine instance from TUICallKit?

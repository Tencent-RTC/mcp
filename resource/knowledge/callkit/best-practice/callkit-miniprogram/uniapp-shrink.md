---
title: "TUICallKit Size Optimization for UniApp WeChat Mini Program Builds（uniapp 小程序 TUICallKit / 体积裁剪 / 瘦身）"
product: call
frameworks: [miniprogram]
scope: platform_specific
tags: [TUICallKit, uniapp, mini program, size optimization, plugin trimming, slimming, remove plugin, GroupCallView]
version_range: ">=4.0.0"
---

# TUICallKit Size Optimization for UniApp WeChat Mini Program Builds

## 1. Key Takeaways

- TUICallKit includes all plugins by default. The core call engine (375 KB) and 1v1 call module (111 KB) are required and cannot be removed.
- The ringtone plugin (23 KB) and group call plugin (27 KB) can be removed on demand without affecting one-on-one call functionality.
- Trimming is achieved by removing plugin registration code and the corresponding pages configuration.

## 2. Field / API Reference

| Module | Size | Required | Removal Method |
|---|---|---|---|
| Core call engine | 375 KB | Yes | — |
| 1v1 call | 111 KB | Yes | — |
| Ringtone plugin | 23 KB | Optional | Remove `this.registerPlugin(useRingPlugin())` |
| Group call plugin | 27 KB | Optional | Remove `this.registerPlugin(useGroupCallPlugin())` + the `GroupCallView` page entry in pages.json |

## 3. Mechanism & Sequence

TUICallKit registers feature plugins via `registerPlugin` during initialization -> registered plugins are bundled into the mini program code -> removing the corresponding registration code prevents that plugin from being bundled -> the mini program package size decreases accordingly.

## 4. Standard Usage

1. Locate the plugin registration section in the TUICallKit initialization code.
2. Remove `this.registerPlugin(useRingPlugin())` to remove the ringtone plugin.
3. Remove `this.registerPlugin(useGroupCallPlugin())` to remove the group call plugin, and also remove the `GroupCallView` page entry from `pages.json`.

## 5. Expected Results

- After removing the ringtone plugin, no ringtone plays during calls, but call functionality is unaffected.
- After removing the group call plugin, group calls cannot be initiated or joined, but one-on-one calls work normally.
- The mini program package size decreases by approximately 50 KB.
- Functionality verified: one-on-one calls (initiate, answer, hang up) remain fully operational.

## 6. Common Pitfalls

- Pitfall 1: Attempting to remove the core call engine or 1v1 module (these are required; removing them breaks all call functionality).
- Pitfall 2: Removing only the plugin registration code but forgetting to also remove the `GroupCallView` page entry from `pages.json`, causing compilation errors.
- Pitfall 3: Expecting group call functionality to still work after removing the group call plugin (only one-on-one calls are available after removal).

## 7. Problem Definition (retrieval hint)

When building a WeChat mini program with UniApp, TUICallKit includes too many plugins by default, resulting in a large package size. The goal is to remove unnecessary feature modules on demand.

## 8. Alternative Queries (retrieval recall)

- How to reduce TUICallKit mini program package size?
- How to remove the ringtone plugin from UniApp TUICallKit?
- How to trim the group call feature from TUICallKit?
- How to optimize TUICallKit when the WeChat mini program package is too large?
- Can group calls still work after removing `GroupCallView`?

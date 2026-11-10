---
title: "Set log Level for TUICallEngine（TUICallEngine / setLogLevel / 日志级别 / 控制台日志 / 关闭日志）"
product: call
frameworks: [web, miniprogram]
scope: platform_common
tags: [TUICallEngine, setLogLevel, log level, console log, disable log]
version_range: ">=4.0.0"
---

# Setting the Log Output Level for TUICallEngine

## 1. Key Takeaways

- TUICallEngine provides the `setLogLevel` API to control the log output level. It can be called immediately after creating an instance.
- During integration and debugging, set the level to 0 (verbose). After going live, set it to level 1 (default, key info) or higher.
- To disable all logs, set the level to 4.

## 2. Field / API Reference

| Level | Value | Description |
|---|---|---|
| Verbose | 0 | High log volume; recommended during integration and debugging |
| Key info | 1 | SDK outputs key information; **default log level** |
| Warning | 2 | SDK outputs only warning and error level logs |
| Error | 3 | SDK outputs only error level logs |
| Silent | 4 | SDK prints no logs at all |

## 3. Mechanism & Sequence

Create a `TUICallEngine` instance -> call `setLogLevel` to set the log level -> the SDK outputs logs at the specified level going forward. A single call takes effect globally; no repeated calls are needed.

## 4. Standard Usage

1. Create an engine instance via `TUICallEngine.createInstance(options)`.
2. Call `tuiCallEngine.setLogLevel(level)` to set the log level.
3. Use level 0 during integration and debugging; adjust to level 1–4 as needed after going live.

```javascript
import TUICallEngine from '@trtc/call-engine-lite-js'; // Web
// import TUICallEngine from '@trtc/call-engine-lite-wx'; // 小程序

const tuiCallEngine = TUICallEngine.createInstance({ SDKAppID: 0 });
tuiCallEngine.setLogLevel(0); // 接入调试：全量日志
```

## 5. Expected Results

- After calling `setLogLevel`, console log volume matches the target level.
- At level 4, the SDK produces no log output.
- Takes effect immediately without restarting or reinitializing.

## 6. Common Pitfalls

- Pitfall 1: Assuming `setLogLevel` can only be called after `init` (it can actually be called as soon as the instance is created).
- Pitfall 2: Setting level 4 and still expecting to receive critical warnings (level 4 disables all logs).

## 7. Problem Definition (retrieval hint)

TUICallEngine users want to control SDK log output volume: view full logs during integration, reduce logs after going live, or disable log output entirely.

## 8. Alternative Queries (retrieval recall)

- How to disable TUICallEngine logs?
- How to set the TUICallEngine log level?
- What do the `setLogLevel` values mean?
- How to view full TUICallEngine logs during integration?
- Is the TUICallEngine log level the same on mini programs and Web?

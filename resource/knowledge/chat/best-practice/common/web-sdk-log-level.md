---
title: Web Chat SDK Disabling/Adjusting Local Browser Log Output (setLogLevel)
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [setLogLevel, log, log level, disable log, local log, browser log, console log, release, production, create, initialization log]
version_range: ">=3.0.0"
---

# Web Chat SDK Disabling/Adjusting Local Browser Log Output (setLogLevel)

## 1. Key Conclusions

- Use `chat.setLogLevel(level)` to control the SDK's local log output level. Setting `level` to `4` disables all SDK log printing.
- `setLogLevel` must be called **after** the `chat` instance is created via `create`.
- `setLogLevel` only affects logs produced **after** the call succeeds; initialization logs printed before the call cannot be suppressed. This is expected behavior by design.
- For production, it is recommended to set the level to `1` (release) so that only critical information is printed, rather than setting it to `4` to disable all logs, in order to retain the diagnostic clues needed for troubleshooting.

## 2. Field/Capability Reference

| Field/Capability | Purpose | Notes |
|---|---|---|
| `chat.setLogLevel(level)` | Sets the local log level | Must be called after the instance is created via `create` |
| `level = 0` | Normal level | Verbose output; recommended during integration and debugging |
| `level = 1` | Release level | Prints only critical information; recommended for production |
| `level = 2` | Warning level | Prints only warning- and error-level logs |
| `level = 3` | Error level | Prints only error-level logs |
| `level = 4` | No-log level | Prints no logs (fully disabled) |

## 3. Mechanism/Sequence

`create` creates the `chat` instance -> the SDK prints initialization logs (these logs are not controlled by `setLogLevel`) -> call `chat.setLogLevel(level)` -> from the moment the call succeeds, log output is filtered according to the configured level.

## 4. Standard Usage

1. Call `create` to create the `chat` instance.
2. Immediately call `chat.setLogLevel(level)` with the target level (pass `4` to disable all logs; pass `1` to keep critical information in production).
3. To use different levels across environments, set the corresponding `level` after initialization based on your environment variables.

``` javascript
// Set the log level immediately after creating the instance
const chat = TencentCloudChat.create({ SDKAppID });

// Disable all local SDK logs
chat.setLogLevel(4);

// Or: keep only critical information in production
// chat.setLogLevel(1);
```

## 5. Result Verification

- After setting `level = 4`, no SDK logs appear in the browser console for output produced after the `setLogLevel` call succeeds.
- After setting `level = 1`, only critical information is printed; warning and normal logs are filtered out.
- Initialization logs between `create` and `setLogLevel` still appear. This is expected behavior.

## 6. Common Pitfalls

- Pitfall 1: Expecting `setLogLevel(4)` to also clear initialization logs (logs printed before the call cannot be suppressed).
- Pitfall 2: Calling `setLogLevel` before `create` (it only takes effect when called after the instance is created).
- Pitfall 3: Setting `4` directly in production to disable all logs, leaving no logs to investigate online issues (use `1` to retain critical information).

## 7. Problem Definition (Retrieval Aid, Minimal)

How to disable or adjust local (console) browser log output for the Web/Mini Program Chat SDK.

## 8. Synonymous Phrasing Coverage (Retrieval Recall, Minimal)

- How do I disable local browser logs in the web IM SDK?
- What does each `chat.setLogLevel` level mean?
- How should I set the IM SDK log level in production?
- Why are initialization logs still printed after I called setLogLevel?

## 9. References (Optional)

- Web Chat SDK setLogLevel API reference: `https://web.sdk.qcloud.com/im/doc/v3/en/SDK.html#setLogLevel`

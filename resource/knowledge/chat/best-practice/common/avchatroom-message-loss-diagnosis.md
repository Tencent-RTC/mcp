---
title: "Web/Mini Program Chat SDK: AVChatRoom Message Loss Diagnosis and Mitigation（直播群消息丢失）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [AVChatRoom, message loss, avchatroom, MESSAGE_RECEIVED, long polling, MsgPriority, priority, restapi, rate limit, 40 messages per second]
version_range: ">=3.0.0"
---

# Web/Mini Program Chat SDK: AVChatRoom Message Loss Diagnosis and Mitigation

## 1. Key Takeaways

- Scenario 1 (messages lost during batch sending): The root cause is incorrect consumption logic of the `MESSAGE_RECEIVED` callback on the business side. This callback may return multiple messages at once; you must read the full list `event.data`.
- Scenario 2 (important messages not received during high-frequency chat): The root cause is triggering the backend group message rate limit. The default is `40` messages/second per group; messages exceeding this limit are discarded. You can increase the retention probability of important messages by setting message priority.
- Scenario 3 (messages lost after unstable network or long background period): This is expected behavior for avchatroom. When the app resumes after more than `2` minutes in the background, it cannot pull historical messages beyond the cache window.
- Avchatroom messages are not stored in roaming. The backend caches messages for only `2` minutes with a maximum of `2000` messages by default; messages beyond the window or limit cannot be recovered via long polling.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `EVENT.MESSAGE_RECEIVED` | Message receive callback | A single callback may return multiple messages; the business must iterate over all items in `event.data` |
| `priority` (SDK) | SDK message sending priority | Can be set in `createXXXMessage`; higher priority messages are less likely to be discarded when the rate limit is exceeded |
| `MsgPriority` (REST API) | REST API message sending priority | Set priority in the message body to ensure critical notifications in high-concurrency scenarios |
| Group rate limit (default `40` msg/s) | Backend flow control threshold | Messages exceeding the threshold are discarded; long polling cannot retrieve discarded messages |
| avchatroom cache window (`2` min / `2000` msgs) | Temporary cache boundary | Messages beyond the time or count limit are purged from the cache |

## 3. Mechanism & Sequence

Business sends message (SDK/REST API) -> AVChatRoom backend applies group rate limit (default `40` msg/s) -> Client receives messages via long polling and triggers `MESSAGE_RECEIVED` -> Business consumes the callback list.
When the app resumes after a long background period (over `2` minutes): WebSocket reconnects -> long polling resumes -> only messages within the cache window (`2` minutes and at most `2000` messages) can be pulled.

## 4. Standard Usage

1. **Fix receive logic (Scenario 1)**: Iterate over all items in `event.data` within the `MESSAGE_RECEIVED` callback. Never process only `event.data[0]`.
2. **Ensure important message delivery (Scenario 2)**: Set high priority for critical messages such as lottery draws or product listing/delisting notifications.
   - SDK sending: Set `priority` in `createXXXMessage`.
   - REST API sending: Set `MsgPriority` in the message body.
3. **Control sending rate (Scenario 2)**: Implement rate limiting or message merging on the business side to avoid continuously exceeding `40` messages/second per group.
4. **Handle background recovery expectations (Scenario 3)**: Treat "possible loss of avchatroom history after a long background period" as an expected product behavior, and use business-level fallback mechanisms (e.g., critical state re-pull API) to recover.

## 5. Expected Results

- During batch message stress testing, every item in `event.data` from the `MESSAGE_RECEIVED` callback is consumed, with no "only first message received" issue.
- When the sending rate exceeds `40` msg/s, low-priority messages are discarded first, and the delivery rate of high-priority critical notifications increases.
- Both REST API and SDK sending paths have the priority field (`MsgPriority` / `priority`) configured.
- After the app resumes from more than `2` minutes in the background, the business side can recover critical state through fallback mechanisms.

## 6. Common Pitfalls

- Pitfall 1: Treating `MESSAGE_RECEIVED` as a single-message callback and only processing `event.data[0]`.
- Pitfall 2: Not setting message priority in high-concurrency avchatroom, causing critical messages to compete at the same level as spam messages.
- Pitfall 3: Using a avchatroom as if it were a roaming group, expecting all historical messages to be available after a long background period.

## 7. Problem Definition (retrieval hint)

In the Web Chat SDK AVChatRoom scenario, "message loss" is observed. The business wants to ensure that important messages such as lottery draws and product listing/delisting notifications are not lost.

## 8. Alternative Queries (retrieval recall)

- Why does AVChatRoom lose messages?
- How to ensure product delisting messages are always delivered during high-frequency chat in a avchatroom?
- How to handle multiple messages returned in a single `MESSAGE_RECEIVED` callback?
- Why can't previously sent messages be pulled after reconnecting from a long background period in a avchatroom?

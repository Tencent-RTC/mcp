---
title: "Web/Mini Program Chat SDK: Message Sending Error (80001/80004) and Content Moderation Rendering Strategy（发送消息报错 80001、80004 / 触发审核的消息渲染标识）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [sendMessage, 80001, 80004, hasRiskContent, MESSAGE_MODIFIED, cloud moderation, text moderation, image moderation, async moderation, audio message, video message]
version_range: ">=3.0.0"
---

# Web/Mini Program Chat SDK: Message Sending Error (80001/80004) and Content Moderation Rendering Strategy

## 1. Key Takeaways

- Text sending error `80001` indicates the text has hit a sensitive content moderation policy; investigate the message content and cloud-side sensitive word configuration.
- Image sending error `80004` indicates the image has hit a sensitive content moderation policy; investigate the image content and cloud-side image moderation rules.
- The standard field for determining whether a message has been flagged by moderation on the UI side is `message.hasRiskContent`.
- To receive `80001/80004` in `sendMessage`'s `catch` during synchronous moderation, you must enable "Deliver Blocking Error Code" in the IM console (Console > Cloud Moderation > Moderation Result Configuration > Deliver Blocking Error Code).

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| Error code `80001` | Text moderation blocking signal | Returned when a text message hits a sensitive policy |
| Error code `80004` | Image moderation blocking signal | Returned when an image message hits a sensitive policy |
| `message.hasRiskContent` | Risk content flag | Used by the UI to determine whether a message has been flagged by moderation |
| `EVENT.MESSAGE_MODIFIED` | Message modified notification event | After async moderation hits, the SDK delivers message field updates via this event |
| "Deliver Blocking Error Code" switch | Synchronous error return control | Must be enabled for `sendMessage.catch` to receive moderation blocking error codes |

## 3. Mechanism & Sequence

Text messages use synchronous moderation: send message -> moderation hit -> `sendMessage.catch` returns `80001`; the returned `message.hasRiskContent=true`. In the text synchronous moderation hit scenario, the `EVENT.MESSAGE_MODIFIED` event is not dispatched.
Image messages default to synchronous moderation: send message -> if moderation completes and hits within 2 seconds -> `sendMessage.catch` returns `80004`; if moderation does not complete within 2 seconds -> automatically switches to async moderation; after async moderation hits, the update is delivered via `EVENT.MESSAGE_MODIFIED`.
Audio/video messages default to async moderation: send message -> backend performs async moderation -> after moderation hits, the update is delivered via `EVENT.MESSAGE_MODIFIED`.

## 4. Standard Usage

1. Enable "Deliver Blocking Error Code" in the console to ensure `sendMessage.catch` can detect the error code during synchronous moderation hits.
2. When sending text/image messages, read the error code and the returned `message` in the `catch` branch; if `message.hasRiskContent=true`, immediately update the on-screen message status.
3. Listen to `EVENT.MESSAGE_MODIFIED`, iterate over `event.data`, and update the corresponding on-screen message when `message.hasRiskContent=true` is found.
4. When the text/image hit rate is abnormal, review the sensitive word library and image moderation rules respectively, and coordinate cloud moderation strategy adjustments.
5. Use `hasRiskContent` uniformly for UI rendering decisions; do not rely on a single error code for long-term state determination.

## 5. Expected Results

- When text hits a sensitive word, `sendMessage.catch` observes `80001` and the message status is updated to moderation-blocked.
- When an image hits a sensitive rule, it is received via the synchronous path as `80004`, or via the async path through `MESSAGE_MODIFIED` with `hasRiskContent=true` update.
- After async moderation hits for audio/video, the UI correctly updates the blocked status via `MESSAGE_MODIFIED`.
- For the same message, both synchronous and async paths ultimately render a consistent state based on `hasRiskContent`.

## 6. Common Pitfalls

- Pitfall 1: Not enabling "Deliver Blocking Error Code" but expecting `sendMessage.catch` to always return `80001/80004`.
- Pitfall 2: Only handling `sendMessage.catch` without listening to `MESSAGE_MODIFIED`, causing missed rendering for async moderation hits.
- Pitfall 3: Rendering long-term state based solely on error codes without using `hasRiskContent` as the ultimate state source.

## 7. Problem Definition (retrieval hint)

What causes the Web Chat SDK to return `80001` when sending text and `80004` when sending images? How should the UI determine whether a message has been flagged by content moderation (risk content)?

## 8. Alternative Queries (retrieval recall)

- What causes text sending failure 80001?
- What causes image sending failure 80004?
- How does the frontend identify when a message is blocked by moderation?
- When does `message.hasRiskContent` get updated?

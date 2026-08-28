---
title: "Web Chat SDK: MESSAGE_RECEIVED Event and Group Tip Message Handling（MESSAGE_RECEIVED / 群提示消息TIMGroupTipElem /  接收消息 / 自己发的消息上屏）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [MESSAGE_RECEIVED, TIMGroupTipElem, TIMGroupSystemNoticeElem, message receive, self-sent message, event.data]
version_range: ">=3.0.0"
---

# Web Chat SDK: MESSAGE_RECEIVED Event and Group Tip Message Handling

## 1. Key Takeaways

- The Web Chat SDK delivers all message notifications to the business side through the unified `MESSAGE_RECEIVED` event.
- By iterating over `event.data` in the callback, you can distinguish between normal messages, group tip messages (`TIMGroupTipElem`), and group system notices (`TIMGroupSystemNoticeElem`) using the `type` field.
- Messages sent by the current instance are not delivered back to itself via `MESSAGE_RECEIVED`; self-sent messages should be added to the on-screen message list immediately after creation.
- In multi-instance or multi-device login scenarios, messages sent by other instances can be received via `MESSAGE_RECEIVED`.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `EVENT.MESSAGE_RECEIVED` | Unified receive entry | All received messages are delivered to the business side through this event |
| `event.data` | Message list payload | A single callback may contain multiple messages; all must be iterated and processed |
| `message.type` | Message classification field | Used to identify normal messages, `TIMGroupTipElem`, and `TIMGroupSystemNoticeElem` |
| Self-sent message rendering | UI timing control | Messages sent by the current instance should be rendered on screen immediately after creation, not relying on `MESSAGE_RECEIVED` |

## 3. Mechanism & Sequence

Business subscribes to `MESSAGE_RECEIVED` -> SDK delivers message list `event.data` -> Business iterates the list and routes by `type`.
Current instance sends a message: creates message and immediately renders locally -> calls send API -> does not deliver back via `MESSAGE_RECEIVED`.
Other instances/devices send a message: current device receives it via `MESSAGE_RECEIVED` and processes by type.

## 4. Standard Usage

1. Subscribe to `EVENT.MESSAGE_RECEIVED`; read the full `event.data` list in the callback.
2. Route each message by `type`: normal messages, `TIMGroupTipElem`, and `TIMGroupSystemNoticeElem` go to different business handlers.
3. When sending a message yourself, add it to the local message list immediately after `createXXXMessage` to ensure timely on-screen display.
4. Maintain clear responsibility boundaries between send callbacks and receive callbacks: the send path handles local state, the receive path handles messages from other devices/instances.

## 5. Expected Results

- After a group tip event triggers, `TIMGroupTipElem` is correctly identified in `MESSAGE_RECEIVED` and the correct handling logic is executed.
- Group system notices are correctly identified as `TIMGroupSystemNoticeElem` in the callback and properly routed.
- When the current instance sends a message, it is rendered locally immediately without waiting for `MESSAGE_RECEIVED`.
- In multi-device login scenarios, messages sent from other devices are received normally via `MESSAGE_RECEIVED`.

## 6. Common Pitfalls

- Pitfall 1: Treating `MESSAGE_RECEIVED` as a single-message callback and only processing `event.data[0]`.
- Pitfall 2: Expecting messages sent by the current instance to be delivered back via `MESSAGE_RECEIVED` before rendering on screen.
- Pitfall 3: Not classifying by `type`, causing group tip messages and normal text messages to share the same handling logic.

## 7. Problem Definition (retrieval hint)

In the Web Chat SDK scenario, the business side needs to clarify two things:
1) How to receive and identify group tip messages `TIMGroupTipElem`;
2) Whether `MESSAGE_RECEIVED` delivers messages sent by the current instance itself.

## 8. Alternative Queries (retrieval recall)

- How does the Web SDK receive group tip messages `TIMGroupTipElem`?
- How to distinguish between normal messages and group system messages in the `MESSAGE_RECEIVED` callback?
- Why are self-sent messages not received via `MESSAGE_RECEIVED`?
- In multi-device login, can messages sent from other devices be received via `MESSAGE_RECEIVED`?

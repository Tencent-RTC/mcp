---
title: "Web Chat SDK: Conversation Read Report and Message Read Receipt (setMessageRead vs. sendMessageReadReceipt)（已读上报 setMessageRead / 已读回执 sendMessageReadReceipt）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [setMessageRead, sendMessageReadReceipt, read receipt, MESSAGE_READ_BY_PEER, MESSAGE_READ_RECEIPT_RECEIVED, needReadReceipt, group message read]
version_range: ">=3.0.0"
---

# Web Chat SDK: Conversation Read Report and Message Read Receipt (setMessageRead vs. sendMessageReadReceipt)

## 1. Key Takeaways

- The recommended flow for automatically sending message-level read receipts upon entering a conversation is: first pull roaming messages via `getMessageList`, then call `sendMessageReadReceipt` to report the corresponding messages as read.
- `setMessageRead` is a conversation-level read report: a successful call clears the unread count of the current conversation; in one-to-one chat scenarios, the peer can update message read status via `MESSAGE_READ_BY_PEER`.
- `sendMessageReadReceipt` is a message-level read receipt: it does not affect the conversation unread count, only the read/unread status of individual messages; for group messages, this capability is required to implement message-level read status.
- The message read receipt capability has usage restrictions: not available on Trial/Standard plans; `needReadReceipt=true` must be set when creating the message; group read receipts require a group size limit of `200` and the group message read receipt switch must be enabled in the console (Console > Feature Configuration > Group Configuration > Group Message Read Receipt).

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `setMessageRead` | Conversation-level read report | Clears the current conversation's unread count; in one-to-one chat, can trigger `MESSAGE_READ_BY_PEER` on the peer side |
| `sendMessageReadReceipt` | Message-level read receipt | Does not clear conversation unread count; only updates message read/unread status |
| `needReadReceipt` | Message read receipt switch | Must be set to `true` when creating a message to enable message-level receipts |
| `MESSAGE_READ_BY_PEER` | One-to-one chat peer read event | Used to update one-to-one chat message read status |
| `MESSAGE_READ_RECEIPT_RECEIVED` | Message receipt received event | Used to process received message read receipt updates |

## 3. Mechanism & Sequence

Enter conversation -> Call `getMessageList` to pull roaming messages -> Pass the message list to `sendMessageReadReceipt` (SDK internally filters and processes) -> SDK dispatches read receipt event (e.g., `MESSAGE_READ_RECEIPT_RECEIVED`) -> Business updates message read/unread display.
If `setMessageRead` is called: conversation unread count is cleared; in one-to-one chat, the peer can receive `MESSAGE_READ_BY_PEER`.

## 4. Standard Usage

1. Upon entering a conversation, first call `getMessageList` to pull the message list.
2. Pass the message list returned by `getMessageList` directly to `sendMessageReadReceipt`; the SDK internally filters and completes message-level read reporting.
3. Only call `setMessageRead` when you need to handle conversation unread count; do not use it as a substitute for group message read receipts.
4. Set `needReadReceipt = true` when creating messages that require receipts.
5. Subscribe to and handle `MESSAGE_READ_BY_PEER` and `MESSAGE_READ_RECEIPT_RECEIVED` to synchronously update message read status.

## 5. Expected Results

- After entering a group chat, pulled messages successfully trigger `sendMessageReadReceipt`.
- After calling `sendMessageReadReceipt`, the conversation unread count is not cleared, but message read status is updated.
- After calling `setMessageRead`, the conversation unread count is cleared, and the one-to-one chat peer can observe `MESSAGE_READ_BY_PEER`.
- In the group read scenario, the correct plan is activated, the console switch is enabled, and the group size does not exceed `200`.

## 6. Common Pitfalls

- Pitfall 1: Using `setMessageRead` instead of `sendMessageReadReceipt` to implement group message read status.
- Pitfall 2: Expecting to receive message-level read receipts without setting `needReadReceipt=true`.
- Pitfall 3: Going live with group read capability without activating the Premium plan or enabling the group message read receipt switch.

## 7. Problem Definition (retrieval hint)

After entering a group chat conversation on the Web, how to automatically send read receipts to message senders? What is the difference between `setMessageRead` and `sendMessageReadReceipt`?

## 8. Alternative Queries (retrieval recall)

- How to automatically report read status after entering a conversation?
- Which API should be used for group chat read/unread display?
- What is the difference between `setMessageRead` and `sendMessageReadReceipt`?
- Why does message read status not change as expected after calling `setMessageRead`?

---
title: "Web/Mini Program Chat SDK: Total Unread Message Count and C2C/Group Split Statistics（unreadCount / 未读总数 / 单聊未读 / 群聊未读）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [getTotalUnreadMessageCount, TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, unreadCount, total unread, C2C unread, group unread]
version_range: ">=3.0.0"
---

# Web/Mini Program Chat SDK: Total Unread Message Count and C2C/Group Split Statistics

## 1. Key Takeaways

- Use `getTotalUnreadMessageCount` to get the total unread message count.
- The SDK does not currently provide a direct API for "C2C-only unread total" or "group-only unread total".
- The recommended pattern is "fetch once on initialization + continuous event updates": call `getTotalUnreadMessageCount` during initialization, then maintain the total unread count via `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED`.
- `getTotalUnreadMessageCount` depends on the SDK's conversation list data; if the cloud conversation list has not finished syncing when called, the return value may be `0`.
- The SDK syncs the conversation list in pages; each sync that causes a total unread change dispatches `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED`.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `getTotalUnreadMessageCount` | Get current total unread count | Depends on the locally synced conversation list state |
| `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED` | Total unread update event | Triggered after conversation list page sync or unread count changes |
| `CONVERSATION_LIST_UPDATED` | Conversation list update event | Can be used to get all conversations and perform C2C/group split statistics |
| `conversation.type` | Conversation type identifier | Used to filter C2C or group conversations |
| `conversation.unreadCount` | Per-conversation unread count | Summed up to get C2C-dimension or group-dimension total unread count |

## 3. Mechanism & Sequence

App starts -> SDK syncs conversation list (paginated) -> Business calls `getTotalUnreadMessageCount` during initialization to get the initial value (may be 0) -> Each time a page sync causes total unread change, SDK dispatches `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED` -> Business updates total unread display in real time.
If C2C/group dimension unread is needed: listen to `CONVERSATION_LIST_UPDATED` -> get all conversations -> filter by `conversation.type` and sum `conversation.unreadCount`.

## 4. Standard Usage

1. During app initialization, call `getTotalUnreadMessageCount` to get the current available total unread initial value.
2. Listen to `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED`; use the event value as the continuous update source for total unread count.
3. Listen to `CONVERSATION_LIST_UPDATED` to get the full conversation list.
4. Filter by `conversation.type` to separate C2C and group conversations, then sum each conversation's `unreadCount` to get the C2C unread total and group unread total.
5. When initialization returns `0`, do not immediately conclude "no unread"; use the statistics result after the conversation list sync event as the authoritative value.

## 5. Expected Results

- `getTotalUnreadMessageCount` has been called during initialization, and the UI displays the initial value.
- During the conversation list page sync process, `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED` continuously drives total unread changes.
- C2C and group unread totals are stably derived from the `CONVERSATION_LIST_UPDATED + unreadCount` aggregation result.
- When `0` appears during initialization, the unread count correctly refreshes to the real value once syncing completes.

## 6. Common Pitfalls

- Pitfall 1: Assuming the SDK provides a ready-made API for "C2C unread total" or "group unread total".
- Pitfall 2: Treating the `getTotalUnreadMessageCount` result of `0` during initialization as the final result.
- Pitfall 3: Only fetching the total unread count once during initialization without listening to `TOTAL_UNREAD_MESSAGE_COUNT_UPDATED`.

## 7. Problem Definition (retrieval hint)

How does the Web Chat SDK get the total unread message count? Is there an API to get only the C2C unread total or group unread total?

## 8. Alternative Queries (retrieval recall)

- How to get the total IM unread message count?
- Is there an official API for "C2C-only unread" or "group-only unread"?
- Why does `getTotalUnreadMessageCount` return 0 during initialization?
- Should the total unread count be updated via events or by polling the API?

## 9. References

- getTotalUnreadMessageCount: `https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#getTotalUnreadMessageCount`
- TOTAL_UNREAD_MESSAGE_COUNT_UPDATED: `https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-EVENT.html#.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED`
- CONVERSATION_LIST_UPDATED: `https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-EVENT.html#.CONVERSATION_LIST_UPDATED`

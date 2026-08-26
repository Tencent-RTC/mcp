---
title: "Web/Mini Program Chat SDK: Removing Residual Conversations After Leaving or Dismissing a Group（退群 / 群组解散 / 被踢出群 / 删除会话列表中已退出的群组）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [quitGroup, dismissGroup, deleteConversation, TIMGroupSystemNoticeElem, operationType, conversation list, leave group, dismiss group]
version_range: ">=3.0.0"
---

# Web/Mini Program Chat SDK: Removing Residual Conversations After Leaving or Dismissing a Group

## 1. Key Takeaways

- The conversation remaining after `quitGroup` / `dismissGroup` is an intentional SDK UX design: while the login session is valid, the group conversation is retained so users can still view message history.
- To completely remove it from the conversation list, you must actively call `deleteConversation` after receiving the group system notice (`TIMGroupSystemNoticeElem`).
- The deletion trigger condition is determined by `message.payload.operationType`: `4` (kicked from group), `5` (group dismissed), `8` (user actively left group).
- Relying solely on the return result of `quitGroup` / `dismissGroup` does not automatically delete the conversation list entry.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `TIMGroupSystemNoticeElem` | Group system notice type | Identifies system events such as member changes, dismissal, and leaving |
| `message.payload.operationType` | Notice action code | `4` kicked out, `5` group dismissed, `8` actively left |
| `deleteConversation` | Delete conversation API | Called when the trigger condition is met to remove the corresponding group conversation from the conversation list |
| `quitGroup` / `dismissGroup` | Group management actions | Perform leave/dismiss; they do not handle conversation list cleanup |

## 3. Mechanism & Sequence

Business calls `quitGroup` or `dismissGroup` -> SDK retains the corresponding group conversation (while login session is valid) -> Receives `TIMGroupSystemNoticeElem` -> Business checks `operationType` to determine whether to trigger deletion -> When matching `4/5/8`, calls `deleteConversation` -> Conversation list removes the group conversation.

## 4. Standard Usage

1. Without UI integration: Listen to `MESSAGE_RECEIVED` directly via `chat.on` and handle group system notices in the callback.
2. With UI integration: First obtain the `chat` instance from `TUILogin.getContext()`, then listen to `MESSAGE_RECEIVED` via `chat.on` to receive system notices.
3. Filter messages of type `TIMGroupSystemNoticeElem` in the callback.
4. Read `message.payload.operationType`; only enter the deletion branch for values `4`, `5`, or `8`.
5. Call `deleteConversation` with the group conversation ID, and refresh the conversation list state after success to avoid local cache residuals.

## 5. Expected Results

- After calling `quitGroup`, the `operationType=8` notice is received and `deleteConversation` is triggered successfully.
- After calling `dismissGroup`, the `operationType=5` notice is received and the group conversation is removed successfully.
- When kicked by an admin, the `operationType=4` notice triggers automatic conversation cleanup.
- After refreshing the conversation list, the target group conversation no longer appears and is not re-displayed due to system notice echoing.

## 6. Common Pitfalls

- Pitfall 1: Assuming `quitGroup` / `dismissGroup` automatically deletes the conversation list entry.
- Pitfall 2: Ignoring the group system notice without reading `operationType`.
- Pitfall 3: Only performing local UI deletion without calling `deleteConversation`, causing the conversation to reappear.

## 7. Problem Definition (retrieval hint)

After calling `quitGroup` or `dismissGroup` in the Web Chat SDK, the group conversation still exists in the conversation list; after receiving the system message "You have left this group", the conversation reappears in the list. The business needs to completely remove the group conversation after leaving or dismissing the group.

## 8. Alternative Queries (retrieval recall)

- Why is the group conversation still in the conversation list after calling `quitGroup`?
- Why does the conversation reappear after `dismissGroup`?
- How to delete the conversation after receiving "You have left this group"?
- How to link group system notices with `deleteConversation`?

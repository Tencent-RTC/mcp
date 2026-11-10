---
title: "Why Abnormally Exited Members Still Appear in TUIRoomKit Member List and How to Clean Up（TUIRoomKit / 异常退出 / 幽灵成员 / 心跳检测 / 离线检测）"
product: room
frameworks: [react, vue, web, android, ios, flutter]
scope: platform_common
tags: [TUIRoomKit, abnormal exit, ghost member, heartbeat detection, offline detection, kick from room, kick_user_out, disconnect callback, member list, room cleanup]
version_range: ">=2.0.0"
---

# Why Abnormally Exited Members Still Appear in TUIRoomKit Member List and How to Clean Up

## 1. Key Takeaways

- When a user exits abnormally (process killed, network disconnected, page closed without calling leave), the member still appears in the remote member list. This is the expected behavior of the **video conferencing SDK backend heartbeat offline detection**.
- Current rule: the backend removes an abnormally exited user from the room approximately **5–6 minutes** after heartbeat loss. Only then do remote participants receive the leave notification and update the member list.
- **The heartbeat interval cannot be set very short by default**: short heartbeat intervals increase the risk of false kicks during network jitter, disrupting normal meeting experience.
- If your business requires faster ghost member cleanup: Option 1 (submit a ticket to shorten heartbeat to ~2 minutes) or Option 2 (use IM disconnect callback + `kick_user_out` to kick immediately).

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| Heartbeat offline detection | Detects user online status | Backend checks whether user heartbeat is lost |
| Heartbeat loss | Signal of abnormal exit | Heartbeat stops when process is killed / network disconnected / page closed without leave |
| Ghost member | Abnormally exited user still displayed | Removed from room after ~5–6 minutes |
| `kick_user_out` | Kick a room member | Business backend calls this to immediately clean up |
| `disconnect` callback | Disconnection callback | IM server detects user offline |
| Heartbeat interval adjustment | Backend configuration | Can be shortened to ~2 minutes via support ticket |

## 3. Mechanism & Sequence

User exits abnormally (process killed, network disconnected, page closed without leave) -> Backend detects heartbeat loss -> After ~5–6 minutes, removes user from room -> Remote participants receive leave notification and update member list.

The default heartbeat interval cannot be too short to avoid false kicks caused by network jitter. If the business requires faster cleanup:

- **Option 1**: Submit a support ticket to shorten the backend heartbeat detection interval to ~2 minutes.
- **Option 2**: Business backend listens for the IM `disconnect` callback to detect offline status, then calls `kick_user_out` to immediately remove the ghost member.

## 4. Standard Usage

1. **Option 1 (adjust heartbeat interval)**: Submit a support ticket to have the backend heartbeat detection interval shortened to ~2 minutes.
2. **Option 2 (server-side proactive cleanup)**:
   - Business backend listens for the IM server `disconnect` (disconnection) callback.
   - Upon receiving the offline signal, calls `kick_user_out` to kick the room member.

## 5. Expected Results

- Abnormally exited users are removed from the room after ~5–6 minutes, and remote member list updates accordingly.
- After adjusting heartbeat to ~2 minutes via support ticket, cleanup is faster.
- Option 2 using `disconnect` callback + `kick_user_out` immediately removes ghost members.
- Setting heartbeat too short increases the risk of false kicks during network jitter.

## 6. Common Pitfalls

- Pitfall 1: Expecting abnormally exited users to disappear from the member list immediately (heartbeat detection takes ~5–6 minutes).
- Pitfall 2: Assuming the heartbeat interval can be set arbitrarily short (network jitter causes false kicks, disrupting normal meetings).
- Pitfall 3: Overlooking that the business side can proactively kick members (`disconnect` callback + `kick_user_out`).

## 7. Problem Definition (retrieval hint)

Why an abnormally exited user still appears in the remote member list in TUIRoomKit, and how to clean up ghost members faster.

## 8. Alternative Queries (retrieval recall)

- What to do when an abnormally exited user still shows in the member list?
- How to clean up ghost members in TUIRoomKit?
- How long until a disconnected user is removed from the room?
- Can the heartbeat detection interval be shortened?
- Abnormally exited user keeps showing in the list?
- How to kick an offline user?

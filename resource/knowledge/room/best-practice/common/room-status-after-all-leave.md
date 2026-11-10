---
title: "TUIRoomKit Room Status and Billing After All Members Leave（TUIRoomKit / 所有人离开 / 房间销毁 / 回收房间 / 解散房间）"
product: room
frameworks: [react, vue, web, android, ios, flutter]
scope: platform_common
tags: [TUIRoomKit, all members leave, room destruction, room reclaim, dismiss room, billing, meeting end, room existence, room count]
version_range: ">=2.0.0"
---

# TUIRoomKit Room Status and Billing After All Members Leave

## 1. Key Takeaways

- A room is **not** automatically destroyed immediately when "all members leave."
- After a meeting ends, the business side should **proactively call the dismiss room API** to end the meeting.
- If not manually dismissed: the backend attempts to reclaim the room **6 hours after** the meeting end time, provided the **member count is 0**.
- Billing is based on actual push/pull stream and call consumption. After all members leave and there is no media usage, audio/video duration charges generally stop; however, the room object still occupies room count quota until dismissed or reclaimed.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| Dismiss room API | Proactively end a meeting | Business side calls after meeting ends |
| Backend reclaim | Automatic room cleanup | Attempted 6 hours after meeting end; condition: member count is 0 |
| Room member count | Room member statistics | Reclaim condition: member count is 0 |
| Audio/video duration billing | Call consumption billing | Billed by actual push/pull stream and call consumption |
| Room count occupation | Room object occupation | Still occupies room count quota until dismissed or reclaimed |

## 3. Mechanism & Sequence

All members leave room -> Room is not destroyed immediately -> Business side proactively calls dismiss room API (recommended), or waits for backend automatic reclaim -> Backend attempts reclaim 6 hours after meeting end (condition: member count is 0) -> Room is reclaimed.

Billing dimensions:

- Audio/video duration is billed by actual push/pull stream and call consumption.
- After all members leave and there is no media usage, audio/video duration charges for that room generally stop.
- The room object still occupies room count quota until dismissed or reclaimed.

## 4. Standard Usage

1. After the meeting ends, the business side proactively calls the dismiss room API to end the meeting, avoiding lingering rooms.
2. If manual dismissal is forgotten, the backend automatically reclaims the room after 6 hours (when member count is 0).
3. When evaluating room count occupation, note that undismissed and unreclaimed room objects still consume quota.

## 5. Expected Results

- After proactive dismissal, the room ends immediately.
- Without proactive dismissal, the backend reclaims the room 6 hours after meeting end when member count is 0.
- After all members leave and there is no media usage, audio/video duration charges stop.
- Undismissed and unreclaimed room objects still occupy room count quota.

## 6. Common Pitfalls

- Pitfall 1: Assuming rooms are automatically destroyed after all members leave (requires proactive dismissal or waiting 6 hours for backend reclaim).
- Pitfall 2: Assuming undismissed rooms incur no cost (room objects still occupy room count quota, potentially affecting concurrent capacity).
- Pitfall 3: Neglecting proactive dismissal by the business side (recommended to call the dismiss API rather than relying on backend reclaim).

## 7. Problem Definition (retrieval hint)

Whether a TUIRoomKit room still exists after all members leave, whether billing continues, and how to proactively dismiss a room.

## 8. Alternative Queries (retrieval recall)

- Does the room auto-destroy after everyone leaves?
- Does an empty TUIRoomKit room still incur charges?
- How to dismiss a room after a meeting ends?
- How long does room reclaim take?
- What happens when room member count is 0?
- Does the room object still occupy room count quota?

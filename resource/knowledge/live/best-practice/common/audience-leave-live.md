---
title: "Voice Room Audience Leaving and Seat State（语聊房 / 观众 / 上麦 / 下麦 / leaveLive）"
product: live
frameworks: [android, ios, flutter]
scope: platform_common
tags: [voice room, audience, take seat, leave seat, leaveLive, leaveSeat, exit, seat, re-take seat, VoiceRoom]
version_range: ">=2.0.0"
---

# Voice Room Audience Leaving and Seat State

## 1. Key Takeaways

- When a seated audience member calls `leaveLive` to exit the voice room, they are automatically removed from the seat.
- After exiting and re-entering the room, the user is **not seated** and must take a seat again.
- The method for taking a seat depends on `seatMode`:
  - `seatMode = FREE`: Call `takeSeat` directly.
  - `seatMode = APPLY`: Call `applyForSeat` to submit a seat request; the owner/admin must approve before the user is seated.
- `leaveLive` does **not require** calling `leaveSeat` first — exiting automatically removes the user from the seat.
- Behavior is consistent across all three platforms (Android/iOS/Flutter).

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `leaveLive` | Exit the voice room | Exits the room and automatically leaves the seat |
| `leaveSeat` | Manually leave a seat | Used for explicit seat departure; not required before `leaveLive` since exiting auto-leaves the seat |
| `takeSeat` | Take a seat freely (`seatMode = FREE`) | Call directly after re-entering the room in free mode |
| `applyForSeat` | Apply to take a seat (`seatMode = APPLY`) | Submit a request; owner/admin approval is required |
| `seatMode` | Seat mode | `FREE`: free seat-taking; `APPLY`: requires approval |
| Seat state | Whether the user is seated | Cleared after `leaveLive`; user must re-take a seat after re-entering |

## 3. Mechanism & Sequence

Seated audience calls `leaveLive` -> automatically leaves seat (no need to call `leaveSeat` first) -> exits room -> re-enters room -> seat state is empty, user is not seated -> choose seat-taking method based on `seatMode`:

- `seatMode = FREE`: Call `takeSeat(seatIndex)` to take a seat directly.
- `seatMode = APPLY`: Call `applyForSeat(seatIndex)` to submit a request and wait for owner/admin approval.

## 4. Standard Usage

```javascript
// API is consistent across all three platforms (Android Kotlin / iOS Swift / Flutter Dart)
// 1. 直接退出语聊房（会自动下麦，无需先 leaveSeat）
liveListStore.leaveLive();

// 2. 重新进房后，根据 seatMode 选择上麦方式
// seatMode = FREE 时：直接上麦
liveSeatStore.takeSeat(seatIndex);

// seatMode = APPLY 时：申请上麦（需房主/管理员同意）
liveSeatStore.applyForSeat(seatIndex);
```

## 5. Expected Results

- After `leaveLive`, the user is automatically removed from the seat.
- After re-entering the room, `LiveSeatStore.seatList` does not contain the user.
- `seatMode = FREE`: Calling `takeSeat` succeeds and the user is seated again.
- `seatMode = APPLY`: After calling `applyForSeat`, the user waits for approval; once approved, the user is seated again.

## 6. Common Pitfalls

- Pitfall 1: Calling `leaveSeat` before exiting (not necessary — `leaveLive` automatically leaves the seat).
- Pitfall 2: Assuming the user is still seated after re-entering the room (they must take a seat again).
- Pitfall 3: Worrying that `leaveLive` does not leave the seat, causing a stale seat entry (it auto-leaves — no stale entries).
- Pitfall 4: Calling `takeSeat` directly when `seatMode = APPLY` (use `applyForSeat` instead — otherwise it will fail or have no effect).

## 7. Problem Definition (retrieval hint)

Whether a seated audience member is automatically removed from the seat after calling `leaveLive`, whether the user is still seated after re-entering, whether `leaveLive` requires calling `leaveSeat` first, and how to re-take a seat under different `seatMode` values (FREE/APPLY) using `takeSeat` vs `applyForSeat`.

## 8. Alternative Queries (retrieval recall)

- Does a voice room audience member leave the seat after exiting?
- Do I need to take a seat again after re-entering?
- Do I need to call `leaveSeat` before `leaveLive`?
- Is the seat cleared when a voice room audience member exits?
- How to re-take a seat after entering the room?
- How to take a seat when `seatMode = APPLY`?
- When to use `takeSeat` vs `applyForSeat`?

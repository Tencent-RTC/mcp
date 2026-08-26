---
title: "Voice Room Admin Seat-Taking and Seat Locking（语聊房 / 管理员 / 上麦 / takeSeat / lockSeat）"
product: live
frameworks: [android, ios, flutter]
scope: platform_common
tags: [voice room, admin, take seat, takeSeat, lockSeat, unlockSeat, seatMode, FREE, seat, host seat, owner approval, VoiceRoom]
version_range: ">=2.0.0"
---

# Voice Room Admin Seat-Taking and Seat Locking

## 1. Key Takeaways

- An admin takes a seat by calling `takeSeat` with the seat index. There is no need to call `applyForSeat` — admins are **not restricted by `seatMode=APPLY`** and do **not need** owner approval.
- Admins are **not restricted by `lockSeat`** — they can directly `takeSeat` to any seat (including seat 0, the host seat).
- Regular users can only call `takeSeat` when `seatMode` is `FREE`, and they **are restricted by `lockSeat`**.
- The seat management API in `LiveSeatStore` is consistent across all three platforms (Android/iOS/Flutter).

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `takeSeat` | Take a seat | Pass the seat index; admins are not restricted by `seatMode`/`lockSeat`; regular users require `seatMode=FREE` and the seat must be unlocked |
| `lockSeat` | Lock a seat | After locking, regular users cannot `takeSeat`; admins are unaffected |
| `unlockSeat` | Unlock a seat | After unlocking, regular users can `takeSeat` again |
| `seatMode` | Seat-taking mode | Regular users can only `takeSeat` in `FREE` mode |
| `LiveSeatStore` | Seat management | Provides `takeSeat`/`leaveSeat`/`lockSeat`/`unlockSeat` operations |
| Owner | Room owner | Can lock/unlock seats |

## 3. Mechanism & Sequence

### Admin Taking a Seat

Admin calls `takeSeat(index)` to take a seat directly (passing the target seat index) -> not restricted by `seatMode` -> no owner approval needed -> not restricted by `lockSeat` -> seat taken successfully.

## 4. Standard Usage

1. **Admin takes a seat**: Call `takeSeat(index)` where `index` is the target seat number (e.g., seat 0 for the host seat). Not restricted by `seatMode`/`lockSeat`.
2. **Regular user takes a seat**: Confirm `seatMode=FREE` and the target seat is unlocked, then call `takeSeat(index)`.
3. **Lock a seat**: Admin/owner calls `lockSeat(index)`. After locking, regular users cannot `takeSeat`, but admins are unaffected.
4. **Unlock then take seat**: First call `unlockSeat(index)` to unlock, then the regular user can `takeSeat(index)`.

```javascript
// API is consistent across all three platforms (Android Kotlin / iOS Swift / Flutter Dart)
// 1. 管理员直接上麦（不受 seatMode / lockSeat 限制，无需房主同意）
liveSeatStore.takeSeat(0);   // 上麦到 0 号主持麦位
```

## 5. Expected Results

- Admin `takeSeat(index)` succeeds immediately, not restricted by `seatMode`, no owner approval needed.
- After `lockSeat`, an admin can still `takeSeat` on the same seat (admins are not restricted by seat locking).
- Regular users can only `takeSeat` successfully when `seatMode=FREE`; if the seat is locked, it fails — `unlockSeat` must be called first.

## 6. Common Pitfalls

- Pitfall 1: Admin calls `applyForSeat` to take a seat (admins should call `takeSeat` directly — no application needed).
- Pitfall 2: Assuming admin `takeSeat` requires owner approval (admins are not subject to this restriction).
- Pitfall 3: Assuming `lockSeat` prevents admins from calling `takeSeat` on the same seat (admins are not restricted by seat locking — only regular users are).

## 7. Problem Definition (retrieval hint)

How a voice room admin directly takes a specified seat (including seat 0, the host seat), whether admins are restricted by `seatMode`/`lockSeat`, and the `seatMode` and locking conditions for regular users to take a seat.

## 8. Alternative Queries (retrieval recall)

- How does a voice room admin take seat 0?
- Does admin `takeSeat` require owner approval?
- Is admin seat-taking restricted by `seatMode`?
- Can an admin `takeSeat` after `lockSeat`?
- When can a regular user `takeSeat`?
- Can a regular user take a seat when `seatMode=FREE`?
- How to unlock a locked seat and take it?

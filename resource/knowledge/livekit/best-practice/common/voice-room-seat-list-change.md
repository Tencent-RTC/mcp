---
title: "Voice Room Seat Microphone Status Synchronization（语聊房 / 麦位 / 麦克风状态更新同步）"
product: live
frameworks: [android, ios, flutter]
scope: platform_common
tags: [voice room, seat, microphone status, mic on, mic off, userMicrophoneStatus, SeatListChanged, muteMicrophone, unmuteMicrophone, closeMicrophone, openMicrophone, sync]
version_range: ">=2.0.0"
---

# Voice Room Seat Microphone Status Synchronization

## 1. Key Takeaways

- Both the anchor side and the audience side listen for seat microphone status (`userMicrophoneStatus`) changes via **`SeatListChanged`**.
- `userMicrophoneStatus` values: `0` = mic on; `1` = mic off (self-muted, can be re-opened by self); `2` = mic off (muted by admin, cannot be re-opened by self).
- `userMicrophoneStatus` can only be changed by **the anchor or a seated audience member** through `mute/unmute` or `close/open` APIs.
- The audience side only listens for status changes and does **not need** to call `mute/unmute` or `close/open` to modify `userMicrophoneStatus`.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `userMicrophoneStatus` | Seat microphone on/off state | `0` = mic on; `1` = mic off (self-muted, can reopen); `2` = mic off (admin-muted, cannot reopen) |
| `SeatListChanged` | Seat list change event | Both anchor and audience listen to this for `userMicrophoneStatus` changes; SDK syncs automatically |
| `muteMicrophone` / `unmuteMicrophone` | Mute / unmute | Called by anchor or seated audience; triggers `userMicrophoneStatus` change |
| `closeMicrophone` / `openMicrophone` | Close / open microphone | Called by anchor or seated audience; triggers `userMicrophoneStatus` change |
| Audience side | Read-only state | Only listens for status; does not call `mute/unmute` or `close/open` |

## 3. Mechanism & Sequence

Anchor or seated audience calls `mute/unmute` or `close/open` API -> triggers `userMicrophoneStatus` change -> SDK fires `SeatListChanged`, automatically syncing to all clients -> both anchor and audience receive the updated seat state via `SeatListChanged`.

`userMicrophoneStatus` can only be changed by the anchor or a seated audience member via `mute/unmute` or `close/open` APIs; the audience side only listens for status and does not actively modify it.

## 4. Standard Usage

Both anchor and audience listen for `SeatListChanged` and update the UI based on `userMicrophoneStatus`.
The anchor or a seated audience member changes the microphone state via `mute/unmute` or `close/open` APIs, and the SDK automatically syncs to all clients.

## 5. Expected Results

- After the anchor or seated audience calls `mute/unmute` or `close/open`, `userMicrophoneStatus` in `SeatListChanged` is updated on all clients.
- `userMicrophoneStatus = 0`: mic is on.
- `userMicrophoneStatus = 1`: mic is off (self-muted; can be re-opened by self).
- `userMicrophoneStatus = 2`: mic is off (admin-muted; cannot be re-opened by self).
- Audience side does not need to call `mute/unmute` or `close/open`; status is synced automatically by the SDK.

## 6. Common Pitfalls

- Pitfall 1: Audience calls `mute/unmute` or `close/open` to modify `userMicrophoneStatus` (not needed — status is auto-synced by SDK; audience side is read-only).
- Pitfall 2: Assuming `userMicrophoneStatus = 1` and `2` mean the same thing (`1` = self-muted and can reopen; `2` = admin-muted and cannot reopen).
- Pitfall 3: Assuming `userMicrophoneStatus` can be changed from the audience side (it can only be triggered by the anchor or a seated audience member via `mute/unmute` or `close/open`).

## 7. Problem Definition (retrieval hint)

The meaning of each `userMicrophoneStatus` value in a voice room seat, how it syncs to both anchor and audience via `SeatListChanged`, and which roles can change it through which APIs.

## 8. Alternative Queries (retrieval recall)

- Audience cannot see anchor's mic-on status in a voice room — what to do?
- What do `userMicrophoneStatus` values 0/1/2 mean?
- How does `SeatListChanged` sync seat microphone status?
- Who can change `userMicrophoneStatus`?
- Does the audience need to call `muteMicrophone` to update mic status?
- After admin mutes a user, can the user reopen their mic?

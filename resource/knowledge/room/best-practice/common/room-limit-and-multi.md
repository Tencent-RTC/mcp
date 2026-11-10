---
title: "TUIRoomKit Concurrent Room Limits and Multi-Room Support（TUIRoomKit / 并发房间 / 房间上限 / 同时进多个房间 / 单房间人数）"
product: room
frameworks: [react, vue, web, android, ios, flutter]
scope: platform_common
tags: [TUIRoomKit, concurrent rooms, room limit, joining multiple rooms, single room capacity, peak group count, TUIRoomTypeConference, useRoomState, multi-device login, mutual kick, conference, room management]
version_range: ">=2.0.0"
---

# TUIRoomKit Concurrent Room Limits and Multi-Room Support

## 1. Key Takeaways

- The number of concurrent rooms has an upper limit, determined by the **TUIRoomKit (multi-party audio/video) plan version + IM capabilities**.
- **A single client / single SDK instance cannot be in multiple conference rooms simultaneously**: for conference-type rooms, the per-device concurrent room limit is 1. Exceeding this causes the earliest joined room to be exited.
- **The same userId on multiple devices joining the same room results in mutual kick by default** (later entry kicks earlier entry). To have multi-device access to the same meeting, configure "multi-device login" according to your plan, or assign different userIds to different devices.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `TUIRoomTypeConference` | Conference-type room | Per-device concurrent room limit is 1 |
| `useRoomState` | Room state (Atomicx no-UI path) | Singleton; a user can only be in one room at a time |
| Room count limit | Room/group resource peak | Billed by natural month peak, not unlimited room creation |
| Single room capacity | Max participants per meeting | Hard limit by plan (20/50/200/300) |
| Multi-device login | Same userId on multiple devices | Only supported in higher-tier plans |

## 3. Mechanism & Sequence

### Concurrent Room Limit

After activating a TUIRoomKit (multi-party audio/video) plan, the number of concurrent meetings is constrained by **room count limit + single room capacity**:

| Capability Dimension | Trial | Basic Interactive | Advanced Interactive | Ultra-Large Room Interactive |
|---|---|---|---|---|
| **Room count limit** (billing metric) | Follows IM version | 100,000/month | 100,000/month | 100,000/month |
| **Single room participant capacity** | 20 | 50 | 200 | 300 (submit ticket for expansion) |

- Single room capacity is the hard upper limit on "max participants per meeting."
- Room count limit (peak group count) is the IM-side group/room resource peak included in the plan (billed by natural month peak), not "unlimited rooms at any moment."
- The actual number of simultaneous meetings also depends on IM plan, TRTC resources, and business architecture. Ultra-large rooms have an expansion channel.
- Multi-device login to meetings / same-platform multi-device login requires a higher-tier plan.

### Same User Joining Multiple Rooms

When a single client / single SDK instance calls `joinRoom` to enter a new room while already in a conference-type room, the earliest joined room is exited (per-device concurrent room limit is 1).

## 4. Standard Usage

When evaluating concurrent room requirements, follow these steps:

1. Confirm your TUIRoomKit plan version and check the room count limit and single room capacity in the [Features & Billing Documentation](https://cloud.tencent.com/document/product/269/104946).
2. Evaluate whether the per-meeting participant count exceeds the plan limit; submit a ticket for ultra-large room expansion.
3. When the business needs to host multiple meetings simultaneously, evaluate whether the room count limit (peak group count) is sufficient, combined with IM plan and TRTC resources.
4. When the business needs the same user on multiple devices in the same meeting, confirm the plan supports multi-device login; otherwise assign different userIds to different devices.

## 5. Expected Results

- Concurrent meeting count is constrained by plan room count limit and single room capacity.
- When a single SDK instance joins multiple conference rooms, exceeding 1 causes the earliest joined room to be exited.
- The same userId on multiple devices joining the same room results in mutual kick (later kicks earlier).
- Multi-device access to the same meeting requires plan support for multi-device login, or assigning different userIds to different devices.

## 6. Common Pitfalls

- Pitfall 1: Assuming room count limit (peak group count) means "unlimited rooms at any time" (billed by natural month peak, not unlimited concurrency).
- Pitfall 2: Assuming a single SDK instance can be in multiple conference rooms simultaneously (per-device limit is 1).
- Pitfall 3: Assuming the same userId on multiple devices can join the same room simultaneously (mutual kick by default).
- Pitfall 4: Ignoring plan version differences (multi-device login only supported in higher-tier plans).

## 7. Problem Definition (retrieval hint)

Whether TUIRoomKit has an upper limit on the number of concurrent meetings, and whether a single user can join multiple rooms simultaneously.

## 8. Alternative Queries (retrieval recall)

- What is the TUIRoomKit concurrent room limit?
- How many meetings can run simultaneously?
- Can the same user join two rooms at the same time?
- What is the maximum number of participants per room?
- Does TUIRoomKit support multi-device login?
- Will the same userId on multiple devices cause mutual kick?
- How to expand the meeting room capacity?

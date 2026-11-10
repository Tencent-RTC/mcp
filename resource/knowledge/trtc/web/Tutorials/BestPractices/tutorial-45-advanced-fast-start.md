---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-45-advanced-fast-start.md'
nav_path:
  - "Tutorials"
  - "Best Practices"
product: "trtc"
---
## Function Description

In real-time audio and video scenarios, the time to first frame (i.e., the time from when a user enters a room to when they see/hear the remote video or audio) is a key metric for user experience. The shorter the time to first frame, the less waiting time for users, and the smoother the experience.

This article introduces four solutions to optimize the time to first frame: **Preconnect**, **Quick Start**, **Switch Room**, and **Keep Alive**, helping you choose the appropriate optimization strategy based on your business scenario.

## Demo

The following video demonstrates the comparison of time to first frame before and after enabling the fast start optimization in a live feed stream scenario:

<video src="./assets/fast-start-demo.mp4" controls width="100%"></video>

> The left side shows the unoptimized normal room entry method, while the right side shows the optimized result with Quick Start + Switch Room enabled. You can clearly see that the right side renders the first frame much faster, with nearly imperceptible delay when swiping between rooms.

## Overview

| Solution | Applicable Scenarios | Optimization Principle | First Frame Improvement |
| :--- | :--- | :--- | :--- |
| Preconnect | 1v1 calls, co-hosting, and other scenarios where there is available time before entering the room | Complete part of the connection process in advance | Significant |
| Quick Start | Live streaming scenarios where audience pulls a single anchor's stream | Internal SDK optimization for stream pulling | Significant |
| Switch Room | Live feed streams and other scenarios requiring frequent room switching | Reuse existing connections to avoid reconnection | Significant |
| Keep Alive | Scenarios requiring frequent exit and re-entry | Keep connection alive after exiting room, reuse it on next entry | Significant |

> Quick Start and Switch Room can be combined to achieve end-to-end fast start optimization for live feed streams, from the first page entry to swipe switching. See [Live Feed Stream Best Practices](#live-feed-stream-best-practices).

### Preconnect

#### Prerequisites

- Before using this feature, please [submit a ticket](https://www.tencentcloud.com/contact-us) to contact us to enable it.

#### Applicable Scenarios

Preconnect is suitable for scenarios where **there is available time before entering the room**, such as:

- **1v1 Calls**: Before the user presses the "Answer" button, you can use the waiting time for an incoming call to establish a connection in advance.
- **Co-hosting**: After the user clicks "Request to Co-host" and while waiting for the anchor's approval, you can establish a connection in advance.

#### Implementation Steps

##### 1. Call Preconnect Before Entering the Room

When there is an available time window (such as receiving an incoming call invitation), call the preconnect interface:

```js
// When receiving an incoming call invitation, immediately call preconnect
await trtc.callExperimentalAPI('preconnect', {
  enable: true,
  sdkAppId: 1400000000, // Your sdkAppId
  userId: 'user_123',   // Current user's userId
  userSig: 'xxx',       // Current user's userSig
  roomId: 12345,        // Room number (numeric type)
});
```

> - When `enable` is `true`, `sdkAppId`, `userId`, and `userSig` are required.
> - Either `roomId` or `strRoomId` must be provided, consistent with the room number used when entering the room later.

##### 2. Enter the Room Normally After User Confirmation

After the user clicks "Answer" or "Agree", call `enterRoom` to enter the room:

```js
// After the user clicks answer, enter the room normally
await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'user_123',
  userSig: 'xxx',
  roomId: 12345, // Keep consistent with the room number used in preconnect
  scene: 'rtc',
});
```

The SDK will automatically reuse the connection established by preconnect, significantly reducing the time to enter the room.

##### 3. close preconnect when needed

If your business flow does not continue to enter the room, or you want to actively release the preconnect connection, call:

```js
await trtc.callExperimentalAPI('preconnect', {
  enable: false,
});
```

#### Notes

1. After a successful preconnect, the connection is valid for **60 seconds**.

### Quick Start

#### Applicable Scenarios

Quick Start is suitable for **audience to quickly pull a single anchor's stream in live streaming scenarios**:

- **Live Room**: When audience enters a live room, they can quickly see the anchor's video.
- **Live Feed Streams**: Combined with Switch Room, use `quickStart` for fast stream pulling on the first page entry, then use `switchRoom` for fast room switching when swiping.

#### Prerequisites

- Before using this feature, please [submit a ticket](https://www.tencentcloud.com/contact-us) to contact us to enable it.

#### Implementation Steps

When calling `enterRoom`, pass the `quickStart` parameter:

```js
// Listen for remote video available event before entering the room
trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
  trtc.startRemoteVideo({
    userId,
    streamType,
    view: 'video-container', // DOM element ID to play the video
  });
});

await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'audience_123',
  userSig: 'xxx',
  roomId: 12345,
  scene: 'live',
  role: 'audience',
  // Quick start parameters
  quickStart: {
    remoteUserId: 'anchor_456', // The anchor's userId to pull
  }
});
```

Listen for the {@link module:EVENT.REMOTE_VIDEO_AVAILABLE TRTC.EVENT.REMOTE_VIDEO_AVAILABLE} event before entering the room, then call {@link TRTC#startRemoteVideo trtc.startRemoteVideo()} to play the remote video stream when the event is received.

#### Parameter Description

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| remoteUserId | string | Yes | The anchor's userId to quickly pull |
| small | boolean | No | Whether to pull the small stream, default is false |
| domain | string | No | Custom stream pulling domain |

#### Example of Pulling Small Stream

If the anchor has enabled dual streams, the audience can choose to pull the small stream:

```js
await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'audience_123',
  userSig: 'xxx',
  roomId: 12345,
  scene: 'live',
  role: 'audience',
  quickStart: {
    remoteUserId: 'anchor_456',
    small: true, // Pull the small stream
  }
});
```

#### Notes

1. This feature only supports **live streaming scenarios** (`scene: 'live'`) and **audience role** (`role: 'audience'`).

### Switch Room

#### Prerequisites

- Before using this feature, please [submit a ticket](https://www.tencentcloud.com/contact-us) to contact us to enable it.

#### Applicable Scenarios

Switch Room is suitable for scenarios where **frequent room switching is required**, such as:

- **Live Feed Streams**: When users swipe up or down to switch live rooms, quickly switch to the next anchor's room.

#### Optimization Principle

The traditional way to switch rooms is to call {@link TRTC#exitRoom trtc.exitRoom()} to exit the room first, then call {@link TRTC#enterRoom trtc.enterRoom()} to enter the new room. This approach requires re-establishing connections, which takes longer.

{@link TRTC#switchRoom trtc.switchRoom()} greatly reduces room switching time by **reusing existing connections**.

#### Implementation Steps

```js
// 1. First enter the live room as an audience
await trtc.enterRoom({
  sdkAppId: 1400000000,
  userId: 'audience_123',
  userSig: 'xxx',
  roomId: 12345,
  scene: 'live',
  role: 'audience',
});

// 2. When the user swipes to the next live room, call switchRoom for quick switching
await trtc.switchRoom({
  userSig: 'xxx', // New userSig (if update is needed)
  roomId: 12346, // New room number
});
```

#### Notes

1. The room type before and after switching must be consistent (both numeric room IDs or both string room IDs).

### Keep Alive

#### Prerequisites

- Before using this feature, please [submit a ticket](https://www.tencentcloud.com/contact-us) to contact us to enable it.

#### Applicable Scenarios

Keep Alive is suitable for scenarios where **frequent exit and re-entry is required**, such as:

- **Mixed Feed Streams**: The feed stream contains both TRTC live rooms and non-TRTC live rooms. When a user swipes from a TRTC room to non-TRTC content, they need to exit the room. When they swipe back to a TRTC room, they need to re-enter.
- **Live Stream Monitoring**: Operations or management staff need to monitor multiple live rooms, frequently entering rooms to check content and then exiting before moving on to the next room. The stay time in each room is short but the entry/exit frequency is high. keepAlive significantly reduces the waiting time for each room entry.
- **Live Room List Browsing**: Users browse a live room list page, click into a live room to watch, exit back to the list to continue browsing, and click into another room when they find one they like. In this repeated "list → enter room → exit room → list → enter room" pattern, keepAlive keeps the connection alive so users can see the video faster when they click into the next room.
- **Multi-instance Switching**: When the same user uses multiple TRTC instances, the connection can be reused when switching between instances.

#### Optimization Principle

After a normal room exit, the SDK closes the connection to the server. When entering a room again, a new connection needs to be established, which introduces additional latency.

With keepAlive enabled, the SDK **keeps the connection alive after exiting the room**. When entering a room again, the existing connection is reused directly, eliminating the time needed to re-establish the connection, thereby speeding up room entry.

#### Notes

1. After exiting the room, the connection is kept alive for a period of time. If the timeout expires without re-entering a room, the connection will be automatically closed.
2. keepAlive is enabled via backend cloud control and requires submitting a ticket to contact us for configuration.
3. During the keep-alive period, if the network disconnects, the connection will be automatically closed, and a new connection will be established on the next room entry.

## Live Feed Stream Best Practices

In live feed stream scenarios, the optimization strategy differs between the first room entry and subsequent swipe switching. You can combine **Quick Start** and **Switch Room** to achieve end-to-end fast start:

- **First page entry**: Use {@link TRTC#enterRoom trtc.enterRoom()} + `quickStart` to quickly pull the anchor's stream.
- **Swipe switching (TRTC → TRTC)**: Use {@link TRTC#switchRoom trtc.switchRoom()} to reuse existing connections for fast room switching.

### Mixed Feed Stream Scenario

If the feed stream contains both TRTC live rooms and non-TRTC live rooms, different handling is required when swiping based on the target content type:

- **First entry to a TRTC room**: Call `enterRoom` with the `quickStart` parameter for fast stream pulling.
- **TRTC → TRTC**: Call `switchRoom` for fast room switching.
- **TRTC → non-TRTC**: Call `exitRoom` to leave the TRTC room.
- **non-TRTC → TRTC**: Call `enterRoom` to re-enter the room.

```js
let isInTRTCRoom = false;
let isFirstEnter = true;

// User swipes to the next feed item
async function onSlideToNext(nextItem) {
  if (nextItem.type === 'trtc') {
    if (isInTRTCRoom) {
      // TRTC → TRTC: fast room switch, reuse existing connections
      await trtc.switchRoom({
        userSig: 'xxx',
        roomId: nextItem.roomId,
      });
    } else {
      // First page entry or non-TRTC → TRTC: enter room
      const enterParams = {
        sdkAppId: 1400000000,
        userId: 'audience_123',
        userSig: 'xxx',
        roomId: nextItem.roomId,
        scene: 'live',
        role: 'audience',
      };
      // Use quickStart for fast stream pulling on first page entry
      if (isFirstEnter) {
        enterParams.quickStart = {
          remoteUserId: nextItem.anchorUserId,
        };
        isFirstEnter = false;
      }
      await trtc.enterRoom(enterParams);
      isInTRTCRoom = true;
    }
  } else {
    // TRTC → non-TRTC: exit room, release connections
    if (isInTRTCRoom) {
      await trtc.exitRoom();
      isInTRTCRoom = false;
    }
    // Join non-TRTC room
  }
}
```

> - On the first page entry to a TRTC room, add the `quickStart` parameter in {@link TRTC#enterRoom trtc.enterRoom()} to achieve faster time to first frame.
> - When switching between TRTC rooms consecutively, use {@link TRTC#switchRoom trtc.switchRoom()} to reuse connections and avoid reconnection overhead.
> - When re-entering a TRTC room from a non-TRTC room, call {@link TRTC#enterRoom trtc.enterRoom()} with keepAlive to reuse the connection. The keepAlive feature requires [submitting a ticket](https://www.tencentcloud.com/contact-us) to contact us for activation.

## Solution Selection Recommendations

| Scenario | Recommended Solution | Reason |
| :--- | :--- | :--- |
| 1v1 calls, co-hosting | Preconnect | There is clear waiting time before entering the room |
| Live viewing (first entry) | Quick Start | Optimized for live streaming scenarios, audience can quickly see the anchor's video |
| Live feed streams (TRTC only) | Quick Start + Switch Room | Use quickStart for fast stream pulling on first page entry, then switchRoom for fast switching when swiping |
| Mixed feed streams (TRTC + non-TRTC) | Quick Start + Switch Room + Keep Alive | Use switchRoom between TRTC rooms, keepAlive preserves the connection after exiting TRTC, reuse it on re-entry |
| Multi-person meetings | Preconnect | If there is waiting time before entering the room (such as meeting appointment reminders), preconnect can be used |

## FAQ

1. **Will preconnect failure affect room entry?**

   No. Preconnect is an optional optimization. Even if preconnect fails, calling `enterRoom` will still enter the room normally, just without the first frame optimization benefit.

2. **Can Quick Start and Preconnect be used together?**

   No. Quick Start is specifically designed for live streaming scenarios. Preconnect is more suitable for call scenarios.

3. **How to determine if the first frame optimization is effective?**

   You can verify the optimization effect through the SDK's first frame callback event by tracking the time difference from room entry to first frame.

4. **Do I still need to use quickStart after enabling keepAlive?**

   `quickStart` only needs to be used on the **first room entry of the page**. After enabling keepAlive, subsequent `enterRoom` calls do not need the `quickStart` parameter to benefit from keepAlive's connection reuse. The two optimize different aspects: `quickStart` optimizes the initial stream pulling speed, while `keepAlive` optimizes the connection establishment speed when re-entering a room after exiting.

5. **How do the fast start solutions compare in terms of room entry speed?**

   In terms of room entry speed: `switchRoom` > `keepAlive` + `enterRoom` > `quickStart` + `enterRoom` > `enterRoom`.

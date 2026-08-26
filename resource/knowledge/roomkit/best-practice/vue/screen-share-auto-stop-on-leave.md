---
title: Whether Screen Sharing Stops Automatically When Leaving the Room/Ending the Meeting in TUIRoomKit Vue3
product: room
frameworks: [vue, web]
scope: platform_specific
tags: [TUIRoomKit, screen share, stopScreenShare, startScreenShare, leaveRoom, endRoom, leave room, end meeting, close browser, useDeviceState, useRoomState, screenStatus, vue3, Atomicx]
version_range: ">=2.0.0"
---

# Whether Screen Sharing Stops Automatically When Leaving the Room/Ending the Meeting in TUIRoomKit Vue3

## 1. Key Conclusions

- Leaving the room (`leaveRoom`), ending the meeting (`endRoom`), and exit actions such as closing the browser or closing the web page all automatically end the current screen share. The business side does not need to manually call `stopScreenShare` again.
- Screen sharing is part of the room session: leaving the room releases the user's sharing channel, and screen sharing stops accordingly.
- No extra cleanup code is needed to "stop screen sharing when leaving the room." You only need to explicitly call `stopScreenShare` when **actively stopping** screen sharing during the meeting (without leaving the room).
- This behavior is consistent between UI-less integration (`tuikit-atomicx-vue3`) and integration with UI (`@tencentcloud/roomkit-web-vue3`).

## 2. Field/Capability Reference

| Field/Capability | Purpose | Notes |
|---|---|---|
| `startScreenShare` | Starts screen sharing | Provided by `useDeviceState()`; once started, the share is visible to other room members |
| `stopScreenShare` | Stops screen sharing | Only needs to be called explicitly when **actively stopping during the meeting without leaving the room** |
| `screenStatus` | Screen share status | Provided by `useDeviceState()`; `DeviceStatus.On` indicates sharing is active |
| `leaveRoom` | Leave the room | A member exits the room; the member's screen share ends automatically |
| `endRoom` | End the meeting | The host dismisses the room; screen sharing ends automatically |
| Close browser/web page | Abnormal/normal exit | Disconnects the room session; screen sharing ends accordingly |

## 3. Mechanism/Sequence

The user starts screen sharing during the meeting (`startScreenShare`, `screenStatus = On`) -> an exit action is triggered (`leaveRoom` / `endRoom` / closing the browser or web page) -> the room session disconnects and the user's sharing channel is released -> screen sharing stops automatically, and other room members no longer see the shared content.

## 4. Standard Usage

1. Start screen sharing during the meeting: call `startScreenShare` from `useDeviceState()`.
2. To stop sharing **without leaving the room**: explicitly call `stopScreenShare`.
3. When the user leaves the room: just call `leaveRoom` (or the host calls `endRoom`); screen sharing ends automatically, and there is no need to call `stopScreenShare` first.
4. Exit scenarios such as closing the browser / closing the web page: no extra handling is needed; screen sharing ends automatically as the room session disconnects.

## 5. Result Verification

- After calling `leaveRoom` / `endRoom`, the user's screen share stops and the shared content disappears for other room members.
- After closing the browser or web page, other room members no longer receive the user's screen-sharing stream.
- When staying in the room and calling only `stopScreenShare`, screen sharing stops while the user remains in the room.

## 6. Common Pitfalls

- Pitfall 1: Assuming you must manually call `stopScreenShare` before leaving, otherwise the screen share lingers (leaving the room ends the share automatically).
- Pitfall 2: Assuming screen sharing continues after closing the browser/web page (the share ends once the room session disconnects).
- Pitfall 3: Conflating the responsibilities of `leaveRoom`/`endRoom` with `stopScreenShare` (the former leaves the room and cleans up automatically; the latter only stops sharing without leaving the room).

## 7. Problem Definition (Retrieval Aid, Minimal)

In TUIRoomKit Vue3, whether screen sharing stops automatically when the user calls `leaveRoom`/`endRoom` or closes the browser/web page.

## 8. Synonymous Phrasing Coverage (Retrieval Recall, Minimal)

- Does `leaveRoom` / `endRoom` automatically `stopScreenShare`?
- Does screen sharing continue after leaving the room?
- Does screen sharing end automatically after closing the browser/web page?
- Do I need to manually stop screen sharing before leaving the room?

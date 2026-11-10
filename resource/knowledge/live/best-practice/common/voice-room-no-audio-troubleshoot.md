---
title: "Voice Room Audience Cannot Hear Anchor — Troubleshooting Guide（语聊房 / 观众听不到声音 / 没声音）"
product: live
frameworks: [android, ios, flutter]
scope: platform_common
tags: [voice room, no audio, no sound, troubleshoot, LiveSeatStore, DeviceStore, takeSeat, openLocalMicrophone, unmuteMicrophone, LoginStore, joinLive, seatList, microphoneStatus, LiveSeatState, DeviceState]
version_range: ">=2.0.0"
---

# Voice Room Audience Cannot Hear Anchor — Troubleshooting Guide

## 1. Key Takeaways

- When the audience cannot hear the anchor, troubleshoot in order from anchor side to audience side: room → seat → microphone → mute → login → room entry — checking state at each layer.
- Anchor side: confirm the anchor is seated (`seatList`), microphone is open (`DeviceStore.microphoneStatus`), and not muted (`userInfo.microphoneStatus`).
- Audience side: confirm login status (`loginStatus == LOGIN`), room entry (`currentLive`), and device volume is normal.
- API and state structures are consistent across all three platforms (Android/iOS/Flutter); the troubleshooting flow is universal.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `LiveSeatStore` | Seat management | Provides `seatList`; check whether anchor info is present to determine if the anchor is seated |
| `LiveSeatStore.seatList` | Seat list | Check for anchor info; the anchor item's `userInfo.microphoneStatus` indicates mute state |
| `takeSeat` | Take a seat | Called when the anchor is not seated |
| `DeviceStore` | Device management | Provides `DeviceState`; check `microphoneStatus` to determine if the microphone is open |
| `DeviceState.microphoneStatus` | Microphone on/off state | Determines whether the anchor's microphone is open |
| `openLocalMicrophone` | Open microphone | Called when the microphone is closed |
| `unmuteMicrophone` | Resume audio publishing | Called when the anchor is muted |
| `LoginStore` | Login management | Provides `loginState.loginStatus`; `LOGIN` means logged in |
| `LiveListStore` | Live room management | Provides `LiveListState.currentLive`; determines if room entry succeeded |
| `joinLive` | Enter room | Called when the audience has not entered the room |

## 3. Mechanism & Sequence

### Anchor-Side Troubleshooting (in order)

1. Is the anchor seated? Check whether `LiveSeatStore.seatList` contains anchor info; if not, call `takeSeat`.
2. Is the microphone open? Check `DeviceState.microphoneStatus`; if closed, call `openLocalMicrophone`.
3. Is the anchor muted? Check the anchor item's `userInfo.microphoneStatus` in `seatList`; if muted, call `unmuteMicrophone`.

### Audience-Side Troubleshooting (in order)

1. Is the user logged in? Check whether `loginState.loginStatus` is `LOGIN`.
2. Has the user entered the room? Check whether `LiveListState.currentLive` matches the current live room; if not, call `joinLive`.
3. Is the device volume normal? Verify the system volume is audible.

## 4. Standard Usage

Follow this flow step by step — check the state and handle accordingly:

```text
观众听不到主播说话
│
├── 主播侧排查
│   ├── 1. 是否在麦上？  → 否 → takeSeat 上麦
│   │      查看 LiveSeatStore.seatList
│   ├── 2. 麦克风是否打开？ → 否 → openLocalMicrophone
│   │      查看 DeviceState.microphoneStatus
│   └── 3. 是否静音？ → 是 → unmuteMicrophone
│          查看 seatList 主播 userInfo.microphoneStatus
│
└── 观众侧排查
    ├── 1. 是否已登录？ → 否 → 登录
    │      查看 loginState.loginStatus == LOGIN
    ├── 2. 是否进房？ → 否 → joinLive 进房
    │      查看 LiveListState.currentLive
    └── 3. 手机音量正常？ → 否 → 调整音量
```

## 5. Expected Results

- Anchor's `LiveSeatStore.seatList` contains anchor info: anchor is seated and can publish audio.
- `DeviceState.microphoneStatus` is open: microphone is capturing audio.
- `userInfo.microphoneStatus` is open: not muted, audio is being published normally.
- Audience `loginStatus == LOGIN`: logged in.
- `LiveListState.currentLive` matches the current live room: room entry succeeded.
- If all conditions above are met and the audience still cannot hear audio: check device volume or contact the development team.

## 6. Common Pitfalls

- Pitfall 1: Only troubleshooting the audience side while ignoring the anchor's seat/microphone/mute state.
- Pitfall 2: Confusing `DeviceState.microphoneStatus` (device on/off) with `userInfo.microphoneStatus` (mute state) — the former is local device capture, the latter is the remote-visible state.
- Pitfall 3: Anchor publishes audio without taking a seat (taking a seat is a prerequisite for publishing).
- Pitfall 4: Audience has not entered the room (`currentLive` is incorrect) but assumes the anchor has no audio.
- Pitfall 5: Skipping login status check and directly troubleshooting the audio pipeline.

## 7. Problem Definition (retrieval hint)

When a voice room audience member cannot hear the anchor, how to troubleshoot layer by layer on the anchor side (seat/microphone/mute) and audience side (login/room entry/volume) to locate the issue.

## 8. Alternative Queries (retrieval recall)

- What to do when voice room audience cannot hear the anchor?
- How to troubleshoot no sound from the microphone in a voice room?
- Anchor is seated but audience cannot hear audio?
- How to check if the anchor is muted using `microphoneStatus`?
- No sound after entering a voice room?
- How to determine if the anchor is seated in a voice room?
- What to check first when audience cannot hear audio?

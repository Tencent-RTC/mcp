---
title: "Voice Room Anchor Creates Room and Starts Streaming (Flutter)（语聊房 / 房主 / 开播 / createLive）"
product: live
frameworks: [flutter]
scope: platform_specific
tags: [voice room, anchor, start streaming, publish audio, createLive, openLocalMicrophone, muteMicrophone, unmuteMicrophone, LiveListStore, AudioSalon, keepOwnerOnSeat, seatMode, TakeSeatMode, Flutter, AtomicXCore]
version_range: ">=2.0.0"
---

# Voice Room Anchor Creates Room and Starts Streaming (Flutter)

## 1. Key Takeaways

- Voice room streaming flow: construct `LiveInfo` (with `liveID`, `seatTemplate`, `seatMode`, `keepOwnerOnSeat`), call `createLive` to create the room; on success, call `openLocalMicrophone` to capture and publish audio so other users in the room can hear the anchor.
- `liveID` is required; setting `keepOwnerOnSeat` to `true` makes the anchor automatically take a seat upon entering (taking a seat is a prerequisite for publishing audio — only seated users can publish audio streams in the room).
- `seatTemplate` should be set to the voice room template `AudioSalon(n)`, where n is the maximum seat count supported by the plan or a value less than it.
- `seatMode` sets the seat-taking mode (e.g., `TakeSeatMode.apply` for apply-to-take-seat).
- `muteMicrophone` pauses publishing local audio; `unmuteMicrophone` resumes publishing local audio.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `LiveInfo` | Room information | Dart constructor `LiveInfo({liveID, liveName, seatTemplate, seatMode, keepOwnerOnSeat})` |
| `liveID` | Room ID | Required parameter for `createLive` |
| `liveName` | Room name | Display name of the room |
| `seatTemplate` | Seat layout template | Use `AudioSalon(n)` for voice rooms, where n ≤ max seats in plan |
| `seatMode` | Seat-taking mode | e.g., `TakeSeatMode.apply` for apply-to-take-seat |
| `keepOwnerOnSeat` | Auto-seat the owner | Set to `true` so the anchor automatically takes a seat upon entering |
| `createLive(liveInfo)` | Create room (start streaming) | Pass `LiveInfo`, returns `Future<result>` for async handling |
| `result.isSuccess` | Success flag | `true` means creation succeeded |
| `result.message` | Error message | Returns error description on failure |
| `openLocalMicrophone` | Capture and publish audio | Opens local microphone and publishes audio stream to the room |
| `muteMicrophone` | Pause audio publishing | Pauses local audio stream while microphone remains open |
| `unmuteMicrophone` | Resume audio publishing | Resumes local audio stream while microphone remains open |

## 3. Mechanism & Sequence

Construct `LiveInfo` (`liveID` required, `seatTemplate=AudioSalon(n)`, `seatMode` as needed, `keepOwnerOnSeat=true`) -> `await createLive(liveInfo)` -> `result.isSuccess` is `true`, anchor is auto-seated -> call `openLocalMicrophone` to capture and publish audio -> other users in the room hear the anchor.

Taking a seat is a prerequisite for streaming: `keepOwnerOnSeat=true` ensures the anchor takes a seat before publishing audio. `muteMicrophone` / `unmuteMicrophone` are used to pause/resume during streaming.

## 4. Standard Usage

1. Construct `LiveInfo`: set `liveID`, `seatTemplate`, `seatMode`, `keepOwnerOnSeat`.
2. Call `await _liveListStore.createLive(liveInfo)` to start streaming.
3. Check `result.isSuccess`; on success, call `openLocalMicrophone` to capture and publish audio.
4. Call `muteMicrophone` / `unmuteMicrophone` to pause/resume streaming as needed.

```dart
class _YourAnchorPageState extends State<YourAnchorPage> {
  // ... 其他代码 ...
  final String _liveID = "test_voice_room_001";

  @override
  void initState() {
    super.initState();
    // ... 其他代码 ...

    // 开始语聊
    _startLive();
  }

  Future<void> _startLive() async {
    // 1. 准备 LiveInfo 对象
    final liveInfo = LiveInfo(
      // 2. 设置房间 id
      liveID: _liveID,
      // 3. 设置房间名称
      liveName: "test 语聊房",
      // 4. 设置语聊房布局模板（传入 9 即代表有 9 个麦位）
      seatTemplate: AudioSalon(9),
      // 5. 设置上麦模式，例如申请上麦
      seatMode: TakeSeatMode.apply,
      // 6. 设置主播开播后自动上麦
      keepOwnerOnSeat: true,
    );

    // 7. 调用 createLive 开始直播
    final result = await _liveListStore.createLive(liveInfo);

    if (result.isSuccess) {
      debugPrint("Response startLive onSuccess");
      // 8. 房主创建成功后默认自动上麦，此时调用 openLocalMicrophone 采集并发布音频
      _liveSeatStore.openLocalMicrophone();
    } else {
      debugPrint("Response startLive onError: ${result.message}");
    }
  }
}
```

## 5. Expected Results

- `result.isSuccess == true`: room created successfully, anchor is auto-seated.
- After `openLocalMicrophone`: other users in the room can hear the anchor.
- After `muteMicrophone`: local audio publishing is paused; after `unmuteMicrophone`: publishing resumes.
- If `keepOwnerOnSeat` is not set to `true`: the anchor is not auto-seated and cannot publish audio.
- `result.isSuccess == false`: streaming failed, `result.message` contains the error description.

## 6. Common Pitfalls

- Pitfall 1: Calling `openLocalMicrophone` without calling `createLive` first (cannot publish audio without creating a room).
- Pitfall 2: Not setting `keepOwnerOnSeat` to `true`, so the anchor is not seated and audio publishing does not work.
- Pitfall 3: Not setting `seatTemplate` or setting n beyond the plan's maximum seat count.
- Pitfall 4: Confusing `muteMicrophone` (pauses audio stream publishing) with closing the microphone (stops audio capture).
- Pitfall 5: Reusing `liveID` (it must be globally unique; otherwise creation fails).
- Pitfall 6: `AudioSalon(9)` is a constructor form (not an enum); `seatMode` uses `TakeSeatMode.apply` (Dart enum lowercase).

## 7. Problem Definition (retrieval hint)

A Flutter voice room anchor needs to create a room and start audio streaming in the correct order, understanding the call timing and parameter meanings of `createLive`, `openLocalMicrophone`, `muteMicrophone`, and `unmuteMicrophone`.

## 8. Alternative Queries (retrieval recall)

- How does a Flutter voice room anchor start streaming?
- What is the call order of `createLive` and `openLocalMicrophone` in Flutter?
- How does a Flutter anchor take a seat and publish audio?
- What does the `keepOwnerOnSeat` parameter do?
- How to set the `AudioSalon` template for `seatTemplate`?
- What is the difference between `muteMicrophone` and `unmuteMicrophone` in Flutter?
- How to publish audio after creating a voice room?

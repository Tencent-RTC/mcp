---
title: "Voice Room Anchor Creates Room and Starts Streaming (iOS)（语聊房 / 房主 / 开播 / createLive）"
product: live
frameworks: [ios]
scope: platform_specific
tags: [voice room, anchor, start streaming, publish audio, createLive, openLocalMicrophone, muteMicrophone, unmuteMicrophone, LiveListStore, AudioSalon, keepOwnerOnSeat, seatMode, iOS, Swift, AtomicXCore]
version_range: ">=2.0.0"
---

# Voice Room Anchor Creates Room and Starts Streaming (iOS)

## 1. Key Takeaways

- Voice room streaming flow: construct `LiveInfo` (with `liveID`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`), call `createLive` to create the room; on success, call `openLocalMicrophone` to capture and publish audio so other users in the room can hear the anchor.
- `liveID` is required; setting `keepOwnerOnSeat` to `true` makes the anchor automatically take a seat upon entering (taking a seat is a prerequisite for publishing audio — only seated users can publish audio streams in the room).
- `seatTemplate` should be set to `SeatLayoutTemplate.AudioSalon(seatCount: n)`, where n is the maximum seat count supported by the plan or a value less than it.
- `seatMode` sets the seat-taking mode (e.g., `.apply` for apply-to-take-seat).
- `muteMicrophone` pauses publishing local audio; `unmuteMicrophone` resumes publishing local audio.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `LiveInfo` | Room information | Contains `liveID`, `liveName`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`, etc. |
| `liveID` | Room ID | Required parameter for `createLive` |
| `liveName` | Room name | Display name of the room |
| `seatTemplate` | Seat layout template | Use `SeatLayoutTemplate.AudioSalon(seatCount: n)` for voice rooms, where n ≤ max seats in plan |
| `keepOwnerOnSeat` | Auto-seat the owner | Set to `true` so the anchor automatically takes a seat upon entering |
| `seatMode` | Seat-taking mode | e.g., `.apply` for apply-to-take-seat |
| `createLive(liveInfo)` | Create room (start streaming) | Pass `LiveInfo`, returns `Result` for async handling |
| `openLocalMicrophone` | Capture and publish audio | Opens local microphone and publishes audio stream to the room |
| `muteMicrophone` | Pause audio publishing | Pauses local audio stream while microphone remains open |
| `unmuteMicrophone` | Resume audio publishing | Resumes local audio stream while microphone remains open |

## 3. Mechanism & Sequence

Construct `LiveInfo` (`liveID` required, `seatTemplate=AudioSalon(n)`, `keepOwnerOnSeat=true`, `seatMode` as needed) -> call `createLive` to create the room -> `case .success` callback fires, anchor is auto-seated -> call `openLocalMicrophone` to capture and publish audio -> other users in the room hear the anchor.

Taking a seat is a prerequisite for streaming: `keepOwnerOnSeat=true` ensures the anchor takes a seat before publishing audio. `muteMicrophone` / `unmuteMicrophone` are used to pause/resume during streaming.

## 4. Standard Usage

1. Construct `LiveInfo`: set `liveID`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`.
2. Call `createLive(liveInfo)` and handle success/failure in `switch result`.
3. In `case .success`, call `openLocalMicrophone` to capture and publish audio.
4. Call `muteMicrophone` / `unmuteMicrophone` to pause/resume streaming as needed.

```swift
import UIKit
import AtomicXCore

class YourAnchorViewController: UIViewController {
    // ... 其他代码 ...
    private let liveID = "test_voice_room_001"

    override func viewDidLoad() {
        super.viewDidLoad()
        // ... 其他代码 ...

        // 开始语聊
        startLive()
    }

    private func startLive() {
        // 1. 准备 LiveInfo 对象
        var liveInfo = LiveInfo()

        // 2. 设置房间 id
        liveInfo.liveID = liveID
        // 3. 设置房间名称
        liveInfo.liveName = "test 语聊房"
        // 4. 设置语聊房布局模板（传入 9 即代表有 9 个麦位）
        liveInfo.seatTemplate = SeatLayoutTemplate.AudioSalon(seatCount: 9)

        // 5. 设置主播开播后自动上麦
        liveInfo.keepOwnerOnSeat = true

        // 6. 设置上麦模式，例如申请上麦
        liveInfo.seatMode = .apply

        // 7. 调用 createLive 开始直播
        liveListStore.createLive(liveInfo) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success(let liveInfo):
                print("Response startLive onSuccess")
                // 8. 房主创建成功后默认自动上麦，此时调用 openLocalMicrophone 采集并发布音频
                liveSeatStore.openLocalMicrophone(completion: nil)
            case .failure(let errorInfo):
                print("Response startLive onError: \(errorInfo.message)")
            }
        }
    }
}
```

## 5. Expected Results

- `case .success` callback fires: room created successfully, anchor is auto-seated.
- After `openLocalMicrophone`: other users in the room can hear the anchor.
- After `muteMicrophone`: local audio publishing is paused; after `unmuteMicrophone`: publishing resumes.
- If `keepOwnerOnSeat` is not set to `true`: the anchor is not auto-seated and cannot publish audio.
- `case .failure(let errorInfo)` callback fires: streaming failed, `errorInfo.message` contains the error description.

## 6. Common Pitfalls

- Pitfall 1: Calling `openLocalMicrophone` without calling `createLive` first (cannot publish audio without creating a room).
- Pitfall 2: Not setting `keepOwnerOnSeat` to `true`, so the anchor is not seated and audio publishing does not work.
- Pitfall 3: Not setting `seatTemplate` or setting `seatCount` beyond the plan's maximum seat count.
- Pitfall 4: Confusing `muteMicrophone` (pauses audio stream publishing) with closing the microphone (stops audio capture).
- Pitfall 5: Reusing `liveID` (it must be globally unique; otherwise creation fails).
- Pitfall 6: Forgetting `[weak self]` (to avoid retain cycles causing memory leaks); both `success` and `failure` branches of `switch result` must be handled.

## 7. Problem Definition (retrieval hint)

An iOS voice room anchor needs to create a room and start audio streaming in the correct order, understanding the call timing and parameter meanings of `createLive`, `openLocalMicrophone`, `muteMicrophone`, and `unmuteMicrophone`.

## 8. Alternative Queries (retrieval recall)

- How does an iOS voice room anchor start streaming?
- What is the call order of `createLive` and `openLocalMicrophone` on iOS?
- How does an iOS anchor take a seat and publish audio?
- What does the `keepOwnerOnSeat` parameter do?
- How to set the `AudioSalon` template for `seatTemplate`?
- What is the difference between `muteMicrophone` and `unmuteMicrophone` on iOS?
- How to publish audio after creating a voice room?

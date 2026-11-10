---
title: "Voice Room Anchor Creates Room and Starts Streaming (Android)（语聊房 / 房主 / 开播 / createLive）"
product: live
frameworks: [android]
scope: platform_specific
tags: [voice room, anchor, start streaming, publish audio, createLive, openLocalMicrophone, muteMicrophone, unmuteMicrophone, LiveListStore, AudioSalon, keepOwnerOnSeat, seatMode, TakeSeatMode, Android]
version_range: ">=2.0.0"
---

# Voice Room Anchor Creates Room and Starts Streaming (Android)

## 1. Key Takeaways

- Voice room streaming flow: construct `LiveInfo` (with `liveID`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`), call `createLive` to create the room; on success, call `openLocalMicrophone` to capture and publish audio so other users in the room can hear the anchor.
- `liveID` is required — it is the unique identifier of the live room.
- Setting `keepOwnerOnSeat` to `true` makes the anchor automatically take a seat upon entering the room (taking a seat is a prerequisite for publishing audio — only seated users can publish audio streams in the room).
- `seatTemplate` should be set to `SeatLayoutTemplate.AudioSalon(n)`, where n is the maximum seat count supported by the plan or a value less than it.
- `seatMode` sets the seat-taking mode (e.g., `TakeSeatMode.APPLY` for apply-to-take-seat).
- `muteMicrophone` pauses publishing local audio; `unmuteMicrophone` resumes publishing local audio.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `LiveInfo` | Room information | Contains `liveID`, `liveName`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`, etc. |
| `liveID` | Room ID | Required parameter for `createLive` |
| `liveName` | Room name | Display name of the room |
| `seatTemplate` | Seat layout template | Use `SeatLayoutTemplate.AudioSalon(seatCount = n)` for voice rooms, where n ≤ max seats in plan |
| `keepOwnerOnSeat` | Auto-seat the owner | Set to `true` so the anchor automatically takes a seat upon entering |
| `seatMode` | Seat-taking mode | e.g., `TakeSeatMode.APPLY` for apply-to-take-seat |
| `createLive(liveInfo, callback)` | Create room (start streaming) | Pass `LiveInfo` and `LiveInfoCompletionHandler` callback |
| `openLocalMicrophone` | Capture and publish audio | Opens local microphone and publishes audio stream to the room |
| `muteMicrophone` | Pause audio publishing | Pauses local audio stream while microphone remains open |
| `unmuteMicrophone` | Resume audio publishing | Resumes local audio stream while microphone remains open |

## 3. Mechanism & Sequence

Construct `LiveInfo` (`liveID` required, `seatTemplate=AudioSalon(n)`, `keepOwnerOnSeat=true`, `seatMode` as needed) -> call `createLive` to create the room -> `onSuccess` callback fires, anchor is auto-seated -> call `openLocalMicrophone` to capture and publish audio -> other users in the room hear the anchor.

Taking a seat is a prerequisite for streaming: `keepOwnerOnSeat=true` ensures the anchor takes a seat before publishing audio. `muteMicrophone` / `unmuteMicrophone` are used to pause/resume during streaming.

## 4. Standard Usage

1. Construct `LiveInfo`: set `liveID`, `seatTemplate`, `keepOwnerOnSeat`, `seatMode`.
2. Implement `LiveInfoCompletionHandler` and call `createLive` to start streaming.
3. In `onSuccess` callback, call `openLocalMicrophone` to capture and publish audio.
4. Call `muteMicrophone` / `unmuteMicrophone` to pause/resume streaming as needed.

```kotlin
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
import io.trtc.tuikit.atomicxcore.api.live.LiveInfoCompletionHandler
import io.trtc.tuikit.atomicxcore.api.live.TakeSeatMode

class YourAnchorActivity : AppCompatActivity() {
    // ... 其他代码 ...

    private fun startLive() {
        val liveInfo = LiveInfo().apply {
            // 1. 设置房间基础信息
            liveID = this@YourAnchorActivity.liveID
            liveName = "test 语聊房"

            // 2. 设置语聊房麦位模板，seatCount 传入所需麦位数（≤ 套餐最大麦位数）
            seatTemplate = SeatLayoutTemplate.AudioSalon(seatCount = 9)

            // 3. 主播开播后自动上麦（上麦后才能推音频流）
            keepOwnerOnSeat = true

            // 4. 设置上麦模式（例如申请上麦）
            seatMode = TakeSeatMode.APPLY
        }

        // 5. 调用 createLive 创建房间（开播）
        liveListStore.createLive(liveInfo, object : LiveInfoCompletionHandler {
            override fun onFailure(code: Int, desc: String) {
                Log.e("Live", "Response startLive onError: $desc")
            }

            override fun onSuccess(liveInfo: LiveInfo) {
                Log.d("Live", "Response startLive onSuccess")
                // 6. 房主创建成功后默认自动上麦，此时调用 openLocalMicrophone 采集并发布音频
                liveSeatStore.openLocalMicrophone(null)
            }
        })
    }
}
```

## 5. Expected Results

- `onSuccess` callback fires: room created successfully, anchor is auto-seated.
- After `openLocalMicrophone`: other users in the room can hear the anchor.
- After `muteMicrophone`: local audio publishing is paused; after `unmuteMicrophone`: publishing resumes.
- If `keepOwnerOnSeat` is not set to `true`: the anchor is not auto-seated and cannot publish audio.
- `onFailure(code, desc)` callback fires: streaming failed, `code` is the error code, `desc` is the error description.

## 6. Common Pitfalls

- Pitfall 1: Calling `openLocalMicrophone` without calling `createLive` first (cannot publish audio without creating a room).
- Pitfall 2: Not setting `keepOwnerOnSeat` to `true`, so the anchor is not seated and audio publishing does not work.
- Pitfall 3: Not setting `seatTemplate` or setting `seatCount` beyond the plan's maximum seat count.
- Pitfall 4: Confusing `muteMicrophone` (pauses audio stream publishing) with closing the microphone (stops audio capture).
- Pitfall 5: Reusing `liveID` (it must be globally unique; otherwise creation fails).
- Pitfall 6: Confusing `onSuccess` and `onFailure` callbacks (both branches require defensive handling).

## 7. Problem Definition (retrieval hint)

An Android voice room anchor needs to create a room and start audio streaming in the correct order, understanding the call timing and parameter meanings of `createLive`, `openLocalMicrophone`, `muteMicrophone`, and `unmuteMicrophone`.

## 8. Alternative Queries (retrieval recall)

- How does an Android voice room anchor start streaming?
- What is the call order of `createLive` and `openLocalMicrophone` on Android?
- How does an Android anchor take a seat and publish audio?
- What does the `keepOwnerOnSeat` parameter do?
- How to set the `AudioSalon` template for `seatTemplate`?
- What is the difference between `muteMicrophone` and `unmuteMicrophone` on Android?
- How to publish audio after creating a voice room?

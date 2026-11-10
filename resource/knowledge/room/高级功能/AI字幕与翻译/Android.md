---
sync_node_id: '221552459135492096'
nav_path:
  - "视频会议 SDK"
  - "高级功能"
  - "AI 字幕与翻译"
  - "Android"
product: "room"
---
`TUIRoomKit` integrates AI Meeting Assistant features to deliver intelligent support for online meetings. Once enabled, users can access the following core capabilities via the interface buttons:
- **AI Real-Time Subtitles:** Transcribes spoken discussion into live subtitles that are displayed on screen during the meeting, improving communication and understanding.

- **AI Real-Time Translation:** When AI Real-Time Subtitles are enabled, real-time translation is activated by default. The room owner can configure the translation language. For a list of supported languages, see the Language List.

- **AI Real-Time Meeting Minutes:** Continuously transcribes spoken content into meeting records, making post-meeting review and organization easier.

   

## Prerequisites

### 1. Purchase an AI Transcription Package

To enable AI features, your account must have an active AI Speech Duration Package.

### 2. Integrate Basic Environment

Follow the Quick Integration guide to add TUIRoomKit to your project. Ensure you are using version `≥ 4.2.0`.

## Enable AI Real-Time Subtitles

The AI subtitle UI component source code is located in the [aitranscription](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/aitranscription) directory of the TUIRoomKit open-source repository, specifically under [subtitleview](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/aitranscription/subtitleview). In Standard Room mode, AI Real-Time Subtitles are enabled by default. Click the AI Tools button at the bottom of the standard room interface and select AI Real-Time Subtitles to display subtitles in the room.
``` java
package com.trtc.uikit.roomkit.view

import android.content.Context
import android.widget.FrameLayout
import com.trtc.uikit.roomkit.aitranscription.repository.AITranscriberRepository
import com.trtc.uikit.roomkit.aitranscription.subtitleview.AISubtitleView

class RoomMainView(context: Context) : FrameLayout(context) {

    private val roomID: String = "Standard RoomID"
    private val repository: AITranscriberRepository by lazy {
        AITranscriberRepository(roomID)
    }

    private fun showAISubtitleView() {
        val subtitleView = AISubtitleView(context).apply {
            bindRepository(repository)
        }

        addView(subtitleView)
        
        val layoutParams = subtitleView.layoutParams as? FrameLayout.LayoutParams
            ?: FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                leftMargin = 16
                rightMargin = 16
                bottomMargin = 10
                gravity = android.view.Gravity.BOTTOM
            }

        subtitleView.layoutParams = layoutParams
        addView(subtitleView)
        subtitleView.visibility = VISIBLE
        repository.startTranscription()
    }
}
```

> **Note:**
> Only the room owner can enable the AI Real-Time Subtitles feature. If the room owner exits the room or transfers ownership, the AI subtitle functionality will stop.
> 

## Disable AI Real-Time Subtitles

When using the **AI Real-Time Subtitles** component, developers do not need to manually stop the AI transcription task. The component provides built-in automatic cleanup:
- **When the room owner ends the room, leaves the room, or transfers ownership:** The AI transcription task stops automatically.

- **Resource release:** Associated memory resources are cleaned up automatically.

## View AI Meeting Minutes

The AI meeting minutes UI component source code is located in the [aitranscription](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/aitranscription) directory of the `TUIRoomKit` open-source repository, specifically under [minutesview](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/aitranscription/minutesview). To view AI Real-Time Meeting Minutes, the room owner must first enable the AI Real-Time Subtitles feature. After enabling, meeting minutes can be accessed via the AI Tools entry at the bottom of the interface.
``` swift
package com.trtc.uikit.roomkit.view

import android.content.Context
import android.widget.FrameLayout
import com.trtc.uikit.roomkit.aitranscription.repository.AITranscriberRepository
import com.trtc.uikit.roomkit.aitranscription.subtitleview.AISubtitleView

class RoomMainView(context: Context) : FrameLayout(context) {
    private val roomID: String = "Standard RoomID"
    private val repository: AITranscriberRepository by lazy {
        AITranscriberRepository(roomID)
    }
    
    private fun showAIMinutesView() {
        AIMinutesActivity.bindRepository(repository)
        val intent = Intent(this, AIMinutesActivity::class.java)
        startActivity(intent)
    }
}
```

## Development Notes
- **Version Dependency:** The AI Meeting Assistant feature requires `TUIRoomKit` version `≥ 4.2.0`. Verify you have the required version installed.

- **Billing Logic:** AI features are enabled only when the room owner enters the room. Each room is billed once; additional participants do not trigger extra charges.

- **Network Requirements:** AI transcription relies on a stable uplink connection. Network instability may cause subtitle delays or loss.

## FAQs

### Are AI tools available to all members in the room?

**Feature Description:** Activation of AI Real-Time Subtitles and Meeting Minutes is controlled by the room owner. Once the room owner enters the room and enables AI subtitles, all members can use AI Real-Time Subtitles and Meeting Minutes features.

### Will AI tools incur duplicate charges?

**Billing Description:** Duplicate charges will not occur. The transcription task starts only once, initiated by the room owner, so each room is billed only once. If the room owner enters the room but does not enable AI Real-Time Subtitles, the transcription task will not start and no charges will be incurred.

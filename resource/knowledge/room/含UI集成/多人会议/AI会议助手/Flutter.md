---
sync_node_id: '214510355194241024'
nav_path:
  - "视频会议 SDK"
  - "含 UI 集成"
  - "多人会议"
  - "AI 会议助手"
  - "Flutter"
product: "room"
---
TUIRoomKit integrates AI Meeting Assistant features to deliver intelligent support for online conferences. Once enabled, users can access the following core functions from the interface:
- **AI Real-Time Subtitles:** Transcribes spoken content into text subtitles in real time during a meeting, providing on-screen captions to enhance communication and understanding.

- **AI Real-Time Translation:** When AI Real-Time Subtitles are active, real-time translation is also enabled by default. The room owner can configure the translation language. For a comprehensive list of supported languages, see the Language List.

- **AI Real-Time Meeting Minutes:** Continuously transcribes spoken content into meeting records during the session, making it easier to organize and review discussions after the meeting.

   

## Prerequisites

### 1. Purchase an AI Speech Duration Package

Before activating AI features, verify that your account includes an available AI Speech Duration Package.

> **Note:**
> For first-time use, we recommend subscribing to the **Trial Version (Free)** to evaluate the features. For production environments, select an appropriate package based on your expected usage from the [Purchase Page](https://console.trtc.io/package).
> 

### 2. Integrate Basic Environment

Follow the Quick Integration Guide to add TUIRoomKit to your project, and ensure your version is `≥ 4.1.0`.

## Implementation Steps

### Enable AI Real-Time Subtitles

The AI Subtitle UI component source code is located in the [ai_transcription](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription) directory of the TUIRoomKit open-source repository, specifically under [subtitle](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription/subtitle). In **Standard Room** mode, AI Real-Time Subtitles are enabled by default. To activate subtitles, click the AI Tools button at the bottom of the standard room and select AI Real-Time Subtitles. Subtitles will then appear within the meeting room.
``` java
import 'package:flutter/material.dart';
import 'package:tencent_conference_uikit/widget/main/ai_transcription/subtitle/ai_subtitle_widget.dart';
import 'package:tencent_conference_uikit/widget/main/ai_transcription/repository/ai_transcriber_repository.dart';

class RoomMainWidget extends StatefulWidget {
  final String roomID;
  const RoomMainWidget({super.key, required this.roomID});

  @override
  State<RoomMainWidget> createState() => _RoomMainWidgetState();
}

class _RoomMainWidgetState extends State<RoomMainWidget> {
  late AITranscriberRepository _repository;
  final ValueNotifier<bool> _visible = ValueNotifier(false);

  @override
  void initState() {
    super.initState();
    _repository = AITranscriberRepository(roomID: widget.roomID);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Expanded(child: SizedBox()),
        ValueListenableBuilder<bool>(
          valueListenable: _visible,
          builder: (context, isVisible, _) {
            if (!isVisible) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: AISubtitleWidget(repository: _repository),
            );
          },
        ),
      ],
    );
  }

  void show() {
    _visible.value = true;
    _repository.startTranscription();
  }
}
```

> **Note:**
> Only the host can enable AI Real-Time Subtitles. If the host exits the room or transfers host privileges, the AI Subtitle feature will stop automatically.
> 

### Disable AI Real-Time Subtitles

Developers do not need to manually stop the AI transcription task when using the AI Real-Time Subtitles component. The component includes an internal cleanup mechanism:
- **When exiting the room:** The AI transcription task will stop automatically.

- **Resource release:** Memory resources associated with transcription are released automatically.

### View Real-Time Meeting Minutes

The AI Meeting Minutes UI component source code is located in the [ai_transcription](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription) directory of the TUIRoomKit repository, specifically under [minutes](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription/minutes). Before you can view AI Real-Time Meeting Minutes, the host must enable AI Real-Time Subtitles. Once enabled, access real-time meeting minutes via the AI Tools button at the bottom of the interface.
``` java
import 'package:flutter/material.dart';
import 'package:tencent_conference_uikit/widget/main/ai_transcription/minutes/ai_minutes_page_widget.dart';
import 'package:tencent_conference_uikit/widget/main/ai_transcription/repository/ai_transcriber_repository.dart';

class RoomMainWidget extends StatefulWidget {
  final String roomID;
  const RoomMainWidget({super.key, required this.roomID});

  @override
  State<RoomMainWidget> createState() => _RoomMainWidgetState();
}

class _RoomMainWidgetState extends State<RoomMainWidget> {
  late AITranscriberRepository _repository;

  @override
  void initState() {
    super.initState();
    _repository = AITranscriberRepository(roomID: widget.roomID);
  }

  void showAIMinutesView() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => AIMinutesPageWidget(repository: _repository),
      ),
    );
  }
}
```

## Development Notes
- **Version Dependency:** AI Meeting Assistant features require TUIRoomKit version `≥ 4.1.0`. Check that you are using a compatible version.

- **Billing Logic:** AI features are activated only when the host enters the room. Each room is billed once. Additional members joining do not trigger extra charges.

- **Network Requirements:** AI transcription relies on a stable uplink network. Network jitter may cause subtitle delays or loss.

## FAQs

### Can all members in the room use AI features?

Activation and deactivation of AI Real-Time Subtitles and Meeting Minutes is controlled by the host. When the host enters the room and enables AI Real-Time Subtitles, all members in the room can access both AI Real-Time Subtitles and AI Real-Time Meeting Minutes.

### Will AI features incur duplicate charges?

No. The transcription task is initiated only once by the host, so each meeting room is billed a single time. If the host enters the room but does not enable AI Real-Time Subtitles, transcription does not start and no charges are incurred.

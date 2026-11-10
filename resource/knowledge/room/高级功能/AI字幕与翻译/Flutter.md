---
sync_node_id: '221552460911636480'
nav_path:
  - "视频会议 SDK"
  - "高级功能"
  - "AI 字幕与翻译"
  - "Flutter"
product: "room"
---
TUIRoomKit integrates AI Meeting Assistant features to deliver intelligent support for online meetings. When enabled, users can access the following core features directly from the UI:
- **AI Real-Time Subtitles:** Automatically transcribes speech during a meeting and displays subtitles onscreen, improving communication and accessibility.

- **AI Real-Time Translation:** When AI Real-Time subtitles are enabled, real-time translation is activated by default. The room owner can specify the translation language. For a list of supported languages, see the language list.

- **AI Real-Time Meeting Minutes:** Continuously transcribes spoken content into meeting records, making it easier to organize and review discussions after the meeting.

   

## Prerequisites

### 1. Purchase AI Transcription Package

Before enabling AI features, ensure your account has an active AI Speech Duration Package.

### 2. Project Setup

Follow the Quick Integration Guide to add TUIRoomKit to your project. Confirm that you are using version `≥ 4.1.0`.

## Enable AI Real-Time Subtitles

The AI subtitle UI component source code is located in the [ai_transcription](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription) directory under [subtitle](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription/subtitle) in the open-source TUIRoomKit repository. The **Standard Room** mode supports AI Real-Time Subtitles by default. Click the **AI Tools** at the bottom of the standard room interface and select "**Enable AI Real-Time Subtitles**." Subtitles will appear in the room.
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
> Only the room owner can enable the AI Real-Time Subtitles feature. If the room owner leaves the room or transfers ownership, the AI subtitle feature will automatically stop.
> 

## Disable AI Real-Time Subtitles

When using the **AI Real-Time Subtitles** component, you don't need to manually stop the AI transcription task. The component includes automatic cleanup:
- **On Exited Room:** The AI transcription task stops automatically.

- **Resource Release:** All associated memory resources are released automatically.

## View AI Meeting Minutes

The source code of AI meeting minutes UI component is located in the [ai_transcription](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription) directory under [minutes](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/room/lib/widget/main/ai_transcription/minutes) in the TUIRoomKit repository. To view AI Real-Time Meeting Minutes, the room owner must have previously enabled AI Real-Time Subtitles. Once enabled, access the meeting minutes through the AI tools entry at the bottom of the interface.
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
- **Version Dependency:** The AI Meeting Assistant feature requires TUIRoomKit version `≥ 4.1.0`. Verify that you have the correct version installed.

- **Billing Logic:** The AI feature is enabled only when the room owner enters the room. Each room is billed once; additional participants joining the room do not trigger extra charges.

- **Network Requirements:** AI transcription relies on a stable uplink connection. Network instability may cause subtitle delays or loss.

## FAQs

### Are AI tools available to all members in the room?

The room owner controls activation and deactivation of AI subtitles and meeting minutes. Once the room owner enters the room and enables AI subtitles, all participants in the room can use AI Real-Time Subtitles and Meeting Minutes.

### Will AI tools incur duplicate charges?

**Billing Description:** Duplicate charges do not occur. The transcription task is initiated only once by the room owner, so each meeting room is billed a single time. If the room owner enters the room but does not enable AI Real-Time Subtitles, the transcription task will not start and no related fees will be incurred.

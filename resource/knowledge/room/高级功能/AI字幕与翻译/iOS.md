---
sync_node_id: '221552457380102144'
nav_path:
  - "视频会议 SDK"
  - "高级功能"
  - "AI 字幕与翻译"
  - "iOS"
product: "room"
---
`TUIRoomKit` provides integrated AI Meeting Assistant capabilities to enhance online meetings with intelligent support. Once enabled, users can access the following core features directly from the meeting interface:
- **AI Real-Time Subtitles:** Automatically transcribes spoken content during the meeting and displays subtitles in real time, improving communication and comprehension.

- **AI Real-Time Translation:** Real-time translation is enabled by default when AI Real-Time Subtitles are active. The host can select the target translation language. For a list of supported languages, see the language list.

- **AI Real-Time Meeting Minutes:** Continuously transcribes spoken content into meeting records, making post-meeting review and organization easier.

   

## Prerequisites

### 1. Purchase AI Transcription Package

Before using AI features, make sure your account has an active AI Speech Duration Package.

### 2. Integrate TUIRoomKit

Follow the Quick Integration Guide to add `TUIRoomKit` to your project. The minimum required version is `4.2.0`.

## Enable AI Real-Time Subtitles

The AI subtitle UI component is located in the [AITranscriptionView](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room/Source/AITranscriptionView) directory of the `TUIRoomKit` open-source repository, specifically in [AISubtitleView](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room/Source/AITranscriptionView/AISubtitleView). In **Standard Room** mode, AI Real-Time Subtitles are supported by default. Click the AI tools button at the bottom of the interface and select AI Real-Time Subtitles to enable subtitle display in the meeting room.
``` swift
import UIKit
import TUIRoomKit
import SnapKit

public class RoomMainViewController: UIViewController {
    private let roomID: String = "Standard RoomID"
    private lazy var repository: AITranscriberRepository = {
        AITranscriberRepository(roomID: roomID)
    }()
    
    private func showAISubtitleView() {
        let subtitleView = AISubtitleView()
        subtitleView.bindRepository(repository)
        
        view.addSubview(subtitleView)
        subtitleView.snp.makeConstraints { make in
            make.leading.equalToSuperview().offset(16)
            make.trailing.equalToSuperview().offset(-16)
            make.bottom.equalToSuperview().offset(-10)
        }
        repository.startTranscription()
    }
}
```

> **Note:**
> Only the host can enable the AI Real-Time Subtitles feature. If the host exits the room or transfers host privileges, AI subtitles will stop automatically.
> 

## Disable AI Real-Time Subtitles

The **AI Real-Time Subtitles** component includes automatic cleanup. Developers do not need to manually stop the transcription task.
- **When the host ends the room, exits the room, or transfers host privileges:** The AI transcription task stops automatically.

- **Resource Release:** Associated memory resources are cleaned up automatically.

## View AI Meeting Minutes

The AI meeting minutes UI component is located in the [AITranscriptionView](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room/Source/AITranscriptionView) directory, specifically in [AIMinutesView](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room/Source/AITranscriptionView/AIMinutesView). To view AI Real-Time Meeting Minutes, the host must first enable AI Real-Time Subtitles. Once enabled, you can access meeting minutes from the AI tools entry at the bottom of the interface.
``` swift
import UIKit
import TUIRoomKit
import SnapKit

public class RoomMainViewController: UIViewController {
    private let roomID: String = "Standard RoomID"
    private lazy var repository: AITranscriberRepository = {
        AITranscriberRepository(roomID: roomID)
    }()
    
    private func showAIMinutesView() {
        let minutesViewController = AIMinutesViewController()
        minutesViewController.bindRepository(repository)
        self.navigationController?.pushViewController(minutesViewController, animated: true)
    }
}
```

## Development Notes
- **Version Dependency:** The AI Meeting Assistant requires `TUIRoomKit` version `4.2.0` or above. Confirm that the installed version meets this requirement.

- **Billing Logic:** AI features are activated only when the host enters the room. Each room is billed once; additional members joining do not trigger extra charges.

- **Network Requirements:** AI recognition depends on a stable upstream network. Network disruptions may cause subtitle delays or loss.

## FAQs

### Are AI tools available to all members in the room?

The activation of AI subtitles and real-time meeting minutes is controlled by the host. Once the host enters the room and enables AI subtitle functionality, all members in the room can access AI Real-Time Subtitles and Meeting Minutes.

### Will AI tools incur duplicate charges?

No. Billing only occurs once per room, triggered when the host initiates the transcription task. If the host enters the room but does not enable AI Real-Time Subtitles, no transcription task is started and no charges are incurred.

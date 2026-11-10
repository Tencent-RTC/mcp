---
sync_node_id: '194114399471173632'
nav_path:
  - "直播与语聊 SDK"
  - "视频直播"
  - "开播方式"
  - "主播开播（Flutter）"
product: "live"
---
The **TUILiveKit** Host Live Streaming Page provides a **full-featured UI** for live streaming scenarios. It supports the rapid deployment of core host capabilities, allowing you to efficiently integrate the live streaming workflow without worrying about complex UI and logic implementation.

## Feature Overview
- **Pre-stream Setup:** Supports various personalized configurations before the host goes live, including room name, background, video preview, beauty filters (beauty effects) debugging, audio effects debugging, and layout templates.

- **Co-Host Interaction:** Supports real-time interaction (co-hosting) with viewers or other hosts during the live stream.

- **Audience Interaction:** Supports rich interaction forms such as barrage (bullet screen) and gifts.

- **Live Room Management**: Supports displaying the online user list and various management operations within the room, such as muting (banning) and kicking users.

   |**Pre-stream Setup**|**Co-Host Interaction**|**Audience Interaction**|**Live Room Management**|
   |---------|---------|---------|---------|
   |||||

## Quick Start

### Step 1. Activate the Service

### Step 2. Install the TUILiveKit

### Step 3. Add Host Page

TUILiveRoomAnchorOverlay provides a full host-side UI and business logic for live streaming, including floating window support. During the broadcast, you can switch between two floating window modes: in-app and out-of-app (Picture-in-Picture). TUILiveRoomAnchorOverlay leverages the Flutter Overlay API and native Picture-in-Picture functionality. Integrate as follows:

#### 1. Enable System Picture-in-Picture in Project Settings

Follow the Project Configuration guide to enable the system Picture-in-Picture feature.

#### 2. Navigate to Floating Window Host Page

At the entry point for starting a broadcast (as determined by your business logic), use the following code to navigate to the host page:

【Direct Navigation】
``` java
import 'package:tencent_live_uikit/tencent_live_uikit.dart';

// Navigate to host page
Navigator.push(context, MaterialPageRoute(
  builder: (BuildContext context) {
      final roomId = "test_live_room_id";
     return TUILiveRoomAnchorOverlay(roomId: roomId);
}));
```

【Integrate Into Widget Tree】
``` java

// --- Select a way to integrate based on your Widget tree structure ---

// [option one] as the only child Widget (single subtree)
// Suitable for containers like Container, Padding that usually only contain one child Widget
Container(   
    child: TUILiveRoomAnchorWidget(roomId: roomId) // integrate the host page here
)

// [option two] as one of multiple child Widgets (multi-subtree)
// Suitable for layouts like Column, Row, Stack that can contain multiple child Widgets
Stack(   
    children: [     
      YourOtherWidget(), // your other child Widget     
      TUILiveRoomAnchorWidget(roomId: roomId), // integrate the host page here  
      YourOtherWidget(), // your other child Widget   
])
```

> **Note：**
> - TUILiveRoomAnchorOverlay cannot be embedded as a child widget in container widgets (such as Container, Stack, etc.). It must be used as a standalone page navigation because it manages the Overlay internally, allowing LiveKit to control floating window modes.
> - On iOS, only audience users can enter out-of-app floating window mode.

#### Floating Window Mode Effect

#### Out-of-App Floating Window Effect

## Customize UI Layout

TUILiveKit lets you tailor the go-live and live stream page features and styles to fit your business requirements.

### Live Room Layout Templates

**TUILiveKit** provides **4 layout templates**. Select your preferred style in the Layout section of the host go-live page:

#### Layout Template Overview
| Name | Dynamic Grid Layout | Floating Window Layout | Fixed Grid Layout | Fixed Window Layout |
| --- | --- | --- | --- | --- |
| Template ID | 600 | 601 | 800 | 801 |
| Description | - Default layout.<br>- Grid size automatically adjusts based on the number of co-hosts. | Co-hosts are displayed in floating windows. | Fixed number of co-hosts, each in a dedicated grid. | Fixed number of co-hosts, each in a dedicated window. |
| Preview |  |  |  |  |

### Text Customization (ARB)

TUILiveKit uses **ARB files** and the **Flutter standard internationalization (i18n) solution** to manage the UI text display. You can directly edit the ARB files in the `livekit/lib/common/language/i10n/` directory to modify the text:

- `livekit_en.arb`: English Text.

- `livekit_zh.arb`: Simplified Chinese Text.

- `livekit_zh_Hant.arb`: Traditional Chinese Text.

   After making changes, execute `flutter gen-l10n`  in the command line to regenerate the localization code.

### Icon Customization (Image Assets)

TUILiveKit’s UI image assets are stored in the `livekit/assets/images/` directory. To update icons, simply replace the PNG files in this folder.

Rebuild and run the application, and you will see the updated icon.

## Next Steps

Congratulations! You have successfully integrated the **Host Live Streaming** component. Next, you can implement features such as **audience viewing** and **live stream list**. Please
| <strong>Feature</strong> | <strong>Description</strong> | <strong>Integration Guide</strong> |
| --- | --- | --- |
| <strong>Audience Viewing</strong> | Audience can watch live streaming after entering the anchor's live streaming room, with features like audience mic connection, live room information, online audience, and bullet screen display. | Audience Viewing |
| <strong>Live Stream List</strong> | Display the live stream list interface and features, including the live stream list and room information display. | Live Stream List |

## FAQs

### No Video After Going Live?

Go to **Settings** > **App** > **Camera** and make sure camera permissions are enabled. See the examples below:

### "Not Logged In" Prompt When Starting Live Streaming?

See Complete Login to verify that login integration is complete.

### Why can’t the app enter out-of-app floating window (Picture-in-Picture) mode when in the background?

. After entering the live room, enable the Picture-in-Picture switch.

On Android, after enabling Picture-in-Picture, the app will automatically check the system setting. If Picture-in-Picture is not enabled, the app will prompt you to allow this mode in system settings:


---
sync_node_id: '197747952681340928'
nav_path:
  - "直播与语聊 SDK"
  - "语聊房"
  - "观众观看"
  - "观众观看（Flutter）"
product: "live"
---
`TUILiveKit` Voice Chat Room provides a comprehensive, ready-to-use interface for pure audio live streaming scenarios. It allows you to quickly implement essential features such as audience listening and mic interaction, eliminating the need to manage complex UI or seat management logic yourself.

## Feature Overview
- **Listen to Live Streams**: Hear the host’s real-time audio stream with clarity and low latency.

- **Co-guest**: Request to join the mic and interact with the host via audio.

- **Live Information**: View room announcements and see the list of online audience members.

- **Live Interaction**: Engage with features such as bullet comments, gifts, and likes.

## Quick Integration

### Step 1. Activate the Service

### Step 2: Integrate the Component

Follow the Preparations guide to integrate `TUILiveKit` into your project.

### Step 3: Add Audience Viewing Page

TUIVoiceRoomOverlay provides a complete audience UI and business logic for the voice room scenario, including support for floating window mode. While watching a live stream, users can switch to an in-app floating window. TUIVoiceRoomOverlay leverages Flutter's official Overlay API. To integrate, use the following code:
``` java
import 'package:tencent_live_uikit/tencent_live_uikit.dart';

// Navigate to the viewing page
Navigator.push(context, MaterialPageRoute(
  builder: (BuildContext context) {
     final roomId = "test_voice_room_id";
     return TUIVoiceRoomOverlay(roomId: roomId, behavior: RoomBehavior.join);
}));
```

> **Note:**
> - `TUIVoiceRoomOverlay` cannot be embedded as a child widget in containers (such as Container, Stack, etc.); it must be opened as a standalone page. Since it uses Overlay internally, LiveKit needs full control of the Overlay page to switch floating window modes.
> - Floating window mode is only supported inside the app for voice room scenarios.

After integration, calling this code will open the audience page and start streaming, as shown in the Listen to Live Streams image in the Feature Overview.

#### TUIVoiceRoomWidget Parameters
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>roomId</code> | <code>String</code> | Globally unique live streaming room <code>ID</code>. |
| <code>behavior</code> | <code>RoomBehavior</code> | Enter Room behavior:<br>- <code>autoCreate</code>: Automatically create a live streaming room and enter room.<br>- <code>prepareCreate</code>: Enter the pre-live preview page first, then create and enter the live room after the user clicks <strong>Start Live</strong>.<br>- <code>join</code>: Audience enters the room. |
| <code>params</code> | <code>RoomParams</code> | Host live stream parameters. See next section. This parameter is not required when the audience enters the room (<code>behavior</code> is join). |

**RoomParams parameters:**
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>maxSeatCount</code> | <code>int</code> | Maximum number of seats in the live room. |
| <code>seatMode</code> | <code>TUISeatMode</code> | Audience seat mode:<br>- <code>applyToTake</code>: Audience must apply and be approved by the host to take a seat.<br>- <code>freeToTake</code>: Audience can take a seat freely without host approval. |

#### Floating Window Mode Effect

## Custom UI Layout

**TUILiveKit** supports flexible customization of the host setup and live pages, allowing you to adjust the layout and hide/show functional modules based on your business requirements.

### Text Customization (ARB)

TUILiveKit uses **ARB files** and the **Flutter standard internationalization (i18n) solution** to manage the UI text display. You can directly edit the ARB files in the `livekit/lib/common/language/i10n/` directory to modify the text:

- `livekit_en.arb`: English Text.

- `livekit_zh.arb`: Simplified Chinese Text.

- `livekit_zh_Hant.arb`: Traditional Chinese Text.

   After editing, run `flutter gen-l10n` in your terminal to regenerate localization code. The generated files will be updated in `livekit/lib/common/language/gen/`.

### Icon Customization

TUILiveKit’s UI image assets are stored in the `livekit/assets/images/` directory. To update icons, simply replace the PNG files in this folder.

Rebuild and run the application, and you will see the updated icon.

## Next Steps

You have successfully integrated **Audience Viewing feature**. Next, you can add features like Host Live Streaming, Live Stream List, and Gift System. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Host Streaming**|Complete host live streaming workflow, including pre-live preparation and interactive features after going live.|Host Streaming|
|**Live Stream List**|Display the live room list UI and features, including room list and room information display.|Live Stream List|
|**Gift System**|Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios.|Gift System|

## FAQs

### Why can’t other audience members see live comments sent by an audience member?

There are 3 reasons you can
- Check the network connection to ensure the audience member’s device is online.

- The audience member has been muted by the host and cannot send live comments.

- The live comments contain blocked keywords. Confirm that the comment complies with room rules.

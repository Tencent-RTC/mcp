---
sync_node_id: '197747946951974912'
nav_path:
  - "直播与语聊 SDK"
  - "语聊房"
  - "主播开播"
  - "主播开播（Flutter）"
product: "live"
---
`UILiveKit` Voice Chat Room is a ready-to-use interface providing all the core functionalities for starting a live stream. It enables you to integrate a host broadcasting flow into your app with simple steps.

## Feature Overview
- **Pre-Live Preview**: Allows hosts to configure personalized settings such as room name and cover image before going live.

- **Seat Management**: Supports seat management operations including taking a seat, leaving a seat, muting, and locking seats.

- **Audience Interaction**: Enables interactive features such as live chat (bullet comments), virtual gifts, and likes.

- **Live Room Management**: Displays the online user list and provides moderation controls such as muting or removing users from the live room.

## Quick Integration

### Step 1. Activate the Service

### Step 2. Integrate the Component

Follow the Preparations guide to integrate `TUILiveKit`.Once completed, your project will successfully introduce `TUILiveKit` dependency.

### Step 3. Add Host Page

TUIVoiceRoomOverlay provides a complete UI and business logic for the host in the voice room scenario, including support for floating window mode. During streaming, you can switch to the in-app floating window mode. TUIVoiceRoomOverlay is built using Flutter's official Overlay API. Integrate it as follows:
``` java
import 'package:tencent_live_uikit/tencent_live_uikit.dart';

// Navigate to the Anchor webpage
Navigator.push(context, MaterialPageRoute(
  builder: (BuildContext context) {
     final roomId = "test_voice_room_id";
     final params = RoomParams();
     params.maxSeatCount = 10;
     params.seatMode = TUISeatMode.applyToTake;
     return TUIVoiceRoomOverlay(roomId: roomId, behavior: RoomBehavior.prepareCreate, params: params);
}));
```

> **Note:**
> - `TUIVoiceRoomOverlay` does not support embedding as a child widget into container widgets (such as Container, Stack). It can only be used as a standalone page redirect. Because it internally uses Overlay, LiveKit needs to control the entire Overlay webpage to switch the floating window mode.
> - Voice chat scenarios do not support out-of-application floating window mode.

The code above shows how to add the host page. After launching, you can see the pre-stream preview as shown in the Feature Overview section.

#### TUIVoiceRoomWidget Parameter Reference
| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>roomId</code> | <code>String</code> | Globally unique live streaming room <code>ID</code>. |
| <code>behavior</code> | <code>RoomBehavior</code> | Enter Room behavior:<br>- <code>autoCreate</code>: Automatically create a live streaming room and enter the room.<br>- <code>prepareCreate</code>: Enter the pre-live preview page first, then create and enter the live room after the user clicks <strong>Start Live</strong>.<br>- <code>join</code>: Audience members enter the room. |
| <code>params</code> | <code>RoomParams</code> | Anchor Live streaming Parameter. See <code>RoomParams</code> below. |

##### RoomParams Reference
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

   After editing, run `flutter gen-l10n` in your terminal to regenerate the localization code. Once complete, the files in `livekit/lib/common/language/gen/` will be updated.

### Icon Customization 

TUILiveKit’s UI image assets are stored in the `livekit/assets/images/` directory. To update icons, simply replace the PNG files in this folder.

Rebuild and run your app to see the updated icons.

## Next Steps

You have now successfully integrated **host live streaming**. Next, implement features such as **audience viewing**, **live stream list** and **gift system**. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Audience Viewing**|Enables users to join as audience members, listen to the host, take seats, and view live chat (bullet comments).|Audience viewing|
|**Live Stream List**|Displays a list of live rooms and their details.|Live Stream List|
|**Gift System**|Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios.|Gift System|

## FAQs

### "Not Logged In" Prompt When Starting Live Streaming?

See Complete Login to ensure login functionality is properly integrated.

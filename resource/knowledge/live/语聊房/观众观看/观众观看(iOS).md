---
sync_node_id: '194188959789010944'
nav_path:
  - "直播与语聊 SDK"
  - "语聊房"
  - "观众观看"
  - "观众观看（iOS）"
product: "live"
---
`TUILiveKit` Voice Chat Room provides a comprehensive, ready-to-use interface for pure audio live streaming scenarios. It allows you to quickly implement essential features such as audience listening and mic interaction, eliminating the need to manage complex UI or seat management logic yourself.

## Feature Overview
- **Listen to Live Streams**: Hear the host’s real-time audio stream with clarity and low latency.

- **Co-guest**: Request to join the mic and interact with the host via audio.

- **Live Information**: View room announcements and see the list of online audience members.

- **Live Interaction**: Engage with features such as bullet comments, gifts, and likes.

## Quick Integration

### Integrate the Component

Follow the Preparation guide to integrate `TUILiveKit` into your project.

### Create and Present the Voice Room View Controller

The `TUIVoiceRoomViewController` provides a complete audience-side UI and business logic for the voice room scenario. Simply instantiate and present this view controller to allow users to enter a live room. Typically, when a user taps a room in the Live Stream List, navigate to the audience view page. See the example below:
``` swift
import TUILiveKit
import UIKit

// YourLiveListViewController represents your live list view controller
class YourLiveListViewController: UIViewController {

    // Handle "Join Voice Room" action
    @objc func onJoinVoiceRoomClicked(roomId: String) {

        // 1. Instantiate the voice room controller
        //    - roomId: The ID of the live room to join
        //    - behavior: .join indicates joining as an audience member
        let voiceRoomVC = TUIVoiceRoomViewController(roomId: roomId, behavior: .join)
        voiceRoomVC.modalPresentationStyle = .fullScreen

        // 2. Present the voice room page
        present(voiceRoomVC, animated: true)
    }
}
```
- **TUIVoiceRoomViewController Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| <code>roomId</code> | <code>string</code> | Globally unique live room ID. |
| <code>behavior</code> | <code>RoomBehavior</code> | Room entry behavior:<br>- <code>autoCreate</code>: Automatically create and join the live room.<br>- <code>prepareCreate</code>: Enter a pre-live preview page. The room is created and joined after the user taps "Start Live".<br>-<code>join</code>: Join the room as an audience member. |

## Customize UI

`TUILiveKit` supports UI customization to meet a variety of business needs. You can easily modify interface text and icons.

### Text Customization (Localization)

`TUILiveKit` uses the [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog)(`.xcstrings`) format, introduced in **Xcode 15**, to manage the text displayed in the UI. You can modify the string resources using Xcode's graphical interface:

> **Note:**
> [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) (.xcstrings) is a localization format introduced in Xcode 15. It enhances how developers manage localized strings, supporting a structured format to handle plurals, device-specific variants, etc. This format is becoming the recommended way to manage localization for iOS and macOS applications.
> 

### Icon Customization (Image Assets)

`TUILiveKit` uses `TUILiveKit.xcassets` to manage the image resources for the UI. You can quickly modify the custom icons using Xcode's graphical tools.

## Next Steps

You have successfully integrated **Audience Viewing**. Next, implement additional features such as **host broadcasting**, **live stream list** and **gift system**. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Host Broadcasting**|Complete host live streaming workflow, including pre-live preparation and interactive features after going live.|Integration Guide|
|**Live Stream List**|Display the live room list UI and features, including room list and room information display.|Integration Guide|
|**Gift System**|Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios.|Integration Guide|

## FAQs

### No sound when an audience member after co-guest?

Go to your device's `Settings > App > Microphone` and ensure that microphone permissions are enabled.

### Bullet comments sent by an audience member are not visible to others in the room?

There are 3 reasons you can
- Check the network connection to ensure the audience member’s device is online.

- The audience member has been muted by the host and cannot send bullet comments.

- The bullet comment contains blocked keywords. Confirm that the comment complies with room rules.

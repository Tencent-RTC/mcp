---
sync_node_id: '194188935460769792'
nav_path:
  - "直播与语聊 SDK"
  - "语聊房"
  - "主播开播"
  - "主播开播（iOS）"
product: "live"
---
`UILiveKit` Voice Chat Room is a ready-to-use interface providing all the core functionalities for starting a live stream. It enables you to integrate a host broadcasting flow into your app with simple steps.

## Feature Overview
- **Pre-Live Preview**: Allows hosts to configure personalized settings such as room name and cover image before going live.

- **Seat Management**: Supports seat management operations including taking a seat, leaving a seat, muting, and locking seats.

- **Audience Interaction**: Enables interactive features such as live chat (bullet comments), virtual gifts, and likes.

- **Live Room Management**: Displays the online user list and provides moderation controls such as muting or removing users from the live room.

   |**Pre-Live Preview**|**Seat Management**|**Audience Interaction**|**Live Room Management**|
   |---------|---------|---------|---------|
   |||||

## Quick Integration

## Integrate the Component

Follow the Preparation guide to integrate `TUILiveKit`.

### Create and Present the Voice Room View Controller

The `TUIVoiceRoomViewController` component provides a complete host-side UI and business logic for the voice room scenario. To enable hosts to start a live session, simply create and present this view controller. We recommend triggering the following logic in your app’s "Start Live" button click handler:
``` swift
import TUILiveKit
import UIKit

// YourViewController represents the view controller from which you start the live session
class YourViewController: UIViewController {

    // Handle the "Start Live" button click event
    @objc func onStartVoiceRoomClicked() {

        // 1. Configure room parameters (RoomParams)
        var params = RoomParams()
        params.maxSeatCount = 10 // Maximum number of seats
        params.seatMode = .applyToTake // Seat mode

        // 2. Instantiate the voice room controller
        let roomId = "test_voice_room_id"
        let voiceRoomVC = TUIVoiceRoomViewController(roomId: roomId, behavior: .prepareCreate, roomParams: params)
        voiceRoomVC.modalPresentationStyle = .fullScreen

        // 3. Present the voice room page
        present(voiceRoomVC, animated: true)
    }
}
```
- **TUIVoiceRoomViewController Parameter Reference:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>roomId</code> | <code>string</code> | Globally unique ID for the live room. |
| <code>behavior</code> | <code>RoomBehavior</code> | Room entry behavior:<br>- autoCreate: Automatically create and enter the live room.<br>- prepareCreate: Enter the pre-live preview page first, then create and enter the live room after the user clicks "Start Live".<br>- join: Audience joins the room. |
| <code>roomParams</code> | <code>RoomParams?</code> | Parameters for the host to start the live session. See the table below for details. |

- **RoomParams Parameter Reference:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>maxSeatCount</code> | <code>Int</code> | Maximum number of seats in the live room. |
| <code>seatMode</code> | <code>TUISeatMode</code> | Audience seat mode:<br>- <code>applyToTake</code>: Audience must apply and be approved by the host to take a seat.<br>- <code>freeToTake</code>: Audience can take a seat freely without host approval. |

## Customize UI

`TUILiveKit` provides flexible UI customization to meet a variety of business requirements. You can select different layout templates and easily update UI text and icons.

### Live Layout Template Selection

`TUILiveKit` Voice Room offers **two layout styles**. Select your preferred style using the **"Layout" option** on the host's pre-live preview page:

#### Layout Overview:
|  | <strong>Chat Room</strong> | <strong>KTV</strong> |
| --- | --- | --- |
| <strong>Description</strong> | Default layout; displays only the seat grid. | Displays a KTV song player above the seat grid. |
| <strong>Preview</strong> |  |  |

### Text Customization (Localization)

`TUILiveKit` uses the [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog)(`.xcstrings`) format, introduced in **Xcode 15**, to manage the text displayed in the UI. You can modify the string resources using Xcode's graphical interface:

> **Note:**
> [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) (.xcstrings) is a localization format introduced in Xcode 15. It enhances how developers manage localized strings, supporting a structured format to handle plurals, device-specific variants, etc. This format is becoming the recommended way to manage localization for iOS and macOS applications.
> 

### Icon Customization (Image Assets)

TUILiveKit uses `TUILiveKit.xcassets` to manage the image resources for the UI. You can quickly modify the custom icons using Xcode's graphical tools.

## Next Steps

You have now successfully integrated **host live streaming**. Next, implement features such as **audience listening**, **live stream list** and **gift system**. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Audience Listening**|Enables users to join as audience members, listen to the host, take seats, and view live chat (bullet comments).|Integration Guide|
|**Live Stream List**|Displays a list of live rooms and their details.|Integration Guide|
|**Gift System**|Support custom gift asset configuration, billing system integration, and gift-sending in PK scenarios.|Integration Guide|

## FAQs

### No sound after going live?

Go to your device's `Settings > App > Microphone` and ensure that microphone permissions are enabled.

### Unable to go live when clicking the start button, with a "Not Logged In" prompt?

See Complete Login to ensure login functionality is properly integrated.

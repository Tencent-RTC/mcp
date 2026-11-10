---
sync_node_id: '211158268480299009'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "聊天弹幕组件"
  - "聊天弹幕组件（iOS UIKit）"
product: "live"
---
## Feature Overview

`TUILiveKit` live comments deliver a robust solution for interactive live streaming, enabling real-time engagement and entertainment within your broadcasts. This guide walks you through quickly integrating live comment features into your live room, with deep customization options to fit your business needs.

## Component Structure

|**Component Name**|**Description**|
|---------|---------|
|**Live Comment Display Component (**`BarrageStreamView`**)**|Handles real-time rendering and management of live comment streams. Supports message list rendering, time aggregation, user interaction, and responsive design.|
|**Message Sending Component (**`BarrageInputView`**)**|Provides rich text editing and message sending, including emoji picker, character limit, state management, and cross-platform support for a seamless input experience.|

## Quick Start

### Step 1: Activate the Service

### Step 2: Integrate the TUILiveKit

Follow the Preparation guide to integrate the TUILiveKit components into your project.

### Step 3: Integrate the Live Comment Sending Component

Add the live comment sending component to your app so hosts and audience members can send live comments. Use the sample code below to create the `BarrageInputView` and add it to your view hierarchy.
``` swift
// 1. Create BarrageInputView object
let roomId = "your_room_id" // Replace with your actual roomId (LiveID)
let barrageInputView = BarrageInputView(roomId: roomId)
// ...Add barrageInputView to your parent view and adjust layout here
```

> **Note:**
> 1. The live comment sending component allows switching between the system keyboard and an emoji keyboard.
> 

### Step 4: Integrate the Live Comment Display Component

Create and initialize `BarrageStreamView` where you want to present live comments. Use the `ownerId` parameter to customize the display for hosts and audience members.
``` swift
let liveID = "your_live_id"  // Replace with your actual LiveID
let ownerId = "your_owner_id"  // Replace with your actual ownerId
// 1. Create BarrageStreamView object
let barrageDisplayView = BarrageStreamView(liveID: liveID)

// 2. Add barrageDisplayView to your parent view and adjust layout here
barrageDisplayView.setOwnerId(ownerId)
```

### Step 5: Insert Local Live Comment Messages

Use `BarrageStore`'s `appendLocalTip` interface to insert custom messages (such as gift notifications or announcements) into the live comment stream. Custom styles can be used to differentiate these messages.

> **Note:**
> This action must be performed after successfully entering the room.
> 

``` swift
import TUILiveKit
import AtomicXCore
// Example: Insert a gift message into the live comment area
let barrage = Barrage()
barrage.textContent = "gift"
barrage.liveID = "your_live_id" // Replace with your actual LiveID
barrage.sender.userID = "sender.userId"
barrage.sender.userName = "sender.userName"
barrage.sender.avatarURL = "sender.avatarUrl"
barrage.timestampInSecond = Date().timeIntervalSince1970

let giftCount = 1
barrage.extensionInfo = [
    "TYPE": "GIFTMESSAGE",
    "gift_name": gift.name,
    "gift_count": "\(giftCount)",
    "gift_icon_url": gift.iconURL,
    "gift_receiver_username": userName
]

// Get BarrageStore instance
let barrageStore = BarrageStore.shared(liveID: "your_live_id") // Replace with your actual liveID
barrageStore.appendLocalTip(message: barrage)
```

## Custom Live Comment Message Styles

### Example Effect

By default, two live comment message styles are provided: standard (style 0) and custom. For additional styles, implement the `BarrageStreamViewDelegate` protocol for `BarrageStreamView`.
``` swift
import UIKit
import TUILiveKit
import AtomicXCore

class MyViewController: UIViewController, BarrageStreamViewDelegate {
    let liveID = "your_live_id"  // Replace with your actual liveID
    let barrageDisplayView = BarrageStreamView(liveID: liveID)

    override func viewDidLoad() {
        super.viewDidLoad()
        barrageDisplayView.delegate = self  // Assign delegate
        
        // ...
    }

    func onBarrageClicked(user: LiveUserInfo) {
        // Handle live comment click events here. 'user' contains sender information.
    }
    
    func barrageDisplayView(_ barrageDisplayView: BarrageStreamView, createCustomCell barrage: Barrage) -> UIView? {
        guard let type = barrage.extensionInfo?["TYPE"], type == "GIFTMESSAGE" else {
            // Return nil if no custom UI is needed
           return nil
           // If needed, you can return specific styles based on message type
           // return GiftBarrageView(barrage: barrage)
       }
        
        // Return custom message style UI
        return CustomBarrageView(barrage: barrage)
    }
}

// Custom UI
class CustomBarrageView: UIView {
    let barrage: Barrage
    init(barrage: Barrage) {
        self.barrage = barrage
        super.init(frame: .zero)
        setupUI()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    // ...Define your custom UI layout here
}
```

## FAQs

### Why can't I see live comment messages?

Please check the following:
- Ensure you have passed the correct `roomId` to `BarrageInputView` and the correct `LiveID` to `BarrageStreamView`.

- Check that your network connection is normal.

### How do I distinguish between host and audience in live comment messages?

When initializing `BarrageStreamView`, provide the `ownerId` parameter. The component automatically detects messages sent by the host based on `ownerId` and applies the appropriate style. You can also customize styles by checking the `user.userId` field in the `Barrage` object and render effects as needed.

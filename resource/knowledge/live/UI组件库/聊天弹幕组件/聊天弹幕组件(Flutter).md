---
sync_node_id: '176275013189865472'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "聊天弹幕组件"
  - "聊天弹幕组件（Flutter）"
product: "live"
---
## Feature Overview

`TUILiveKit` live comments deliver a full-featured interactive solution for live streaming, increasing engagement and entertainment for your live broadcasts. This guide walks you through integrating live comment functionality into your streaming rooms, with robust customization options to fit your business needs.

## Component Structure

|**Component Name**|**Description**|
|---------|---------|
|**Live Comment Display Component (**`BarrageDisplayWidget`**)**|Handles real-time rendering and management of the live comment stream. Provides a complete solution for displaying messages, including message list rendering, message grouping by time, audience interaction, and responsive design.|
|**Message Sending Component (**`BarrageSendWidget`**)**|Offers a rich text input experience for sending live comments, featuring emoji selection, character limitations, state management, and cross-platform support for a seamless user experience.|

## Quick Start

### Step 1: Activate the Service

### Step 2: Integrate the SDK

Follow the Preparation instructions to integrate TUILiveKit components into your project.

### Step 3: Integrate the Live Comment Sending Component

Add the live comment sending component to your application to enable hosts and audience members to send live comments easily. Use the sample code below to create a `BarrageSendWidget` and add it to your UI:
``` java
import 'package:live_uikit_barrage/live_uikit_barrage.dart';

BarrageSendController _sendController = BarrageSendController(
                roomId: "liveRoomId",             /// liveRoomId   Replace with your live room ID
                ownerId:  "liveOwnerId",          /// liveOwnerId  Replace with your host's user ID 
                selfUserId: "selfUserId",         /// selfUserId   Replace with the current logged-in user's ID
                selfName: "selfUserName");         /// selfUserName Replace with the current logged-in user's nickname
BarrageSendWidget(controller: _sendController);
```

> **Note:**
> 1. The live comment sending component allows switching between the system keyboard and an emoji keyboard.
> 

### Step 4: Integrate the Live Comment Display Component

Wherever you want to display live comments, create and initialize a `BarrageDisplayWidget` to present incoming messages. The `ownerId` parameter is used to distinguish between host and audience message display styles.
``` java
import 'package:live_uikit_barrage/live_uikit_barrage.dart';

BarrageDisplayController _displayController = BarrageDisplayController(
                roomId: "liveRoomId",             /// liveRoomId   Replace with your live room ID
                ownerId:  "liveOwnerId",          /// liveOwnerId  Replace with your host's user ID 
                selfUserId: "selfUserId",         /// selfUserId   Replace with the current logged-in user's ID
                selfName: "selfUserName");        /// selfUserName Replace with the current logged-in user's nickname
BarrageDisplayWidget(controller: _displayController);
```

### Step 5: Insert Local Live Comment Messages

`BarrageDisplayWidget` supports the `insertMessage` method for displaying custom messages (such as gift notifications, room announcements, etc.) with your own styles.

> **Note:**
> Call this method only after you have successfully entered the room.
> 

``` java
import 'package:live_uikit_barrage/live_uikit_barrage.dart';
import 'package:atomic_x_core/atomicxcore.dart';   

Barrage barrage = Barrage();
barrage.textContent = "gift";
barrage.sender.userID = "sender.userId";
barrage.sender.userName = "sender.userName";
barrage.sender.avatarURL = "sender.avatarUrl";
_displayController.insertMessage(barrage);
```

## Customize Live Comment Message Styles

#### **Sample Effect**

By default, live comments support two styles: the standard comment style (style 0) and a custom message style. For additional styles, implement the `CustomBarrageBuilder` delegate in `BarrageDisplayWidget`:
``` java
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:live_uikit_barrage/live_uikit_barrage.dart';
import 'package:atomic_x_core/atomicxcore.dart';  

// 1. Implement CustomBarrageBuilder
class MyCustomBarrageItemBuilder extends CustomBarrageBuilder {
  @override
  bool shouldCustomizeBarrageItem(Barrage barrage) {
    // Example: Only customize rendering for comments with customType=type1
    return barrage.extensionInfo['customType'] == 'type1';
  }

  @override
  Widget buildWidget(BuildContext context, Barrage barrage) {
    // Custom widget example
    final type = barrage.extensionInfo['customType'];
    if (type == 'type1') {
      return Container();
    }
    return SizedBox.shrink();
  }
}

// 2. Set custom builder
_displayController.setCustomBarrageBuilder(MyCustomBarrageItemBuilder());

// 3. Insert custom message
Barrage barrage = Barrage();
barrage.textContent = "gift";
barrage.sender.userID = "sender.userId";
barrage.sender.userName = "sender.userName";
barrage.sender.avatarURL = "sender.avatarUrl";
barrage.extensionInfo['customType'] = 'type1'; 
_displayController.insertMessage(barrage);
```

## FAQs

### Why can't I see live comment messages?

Check the following:
- Make sure both `BarrageSendWidget` and `BarrageDisplayWidget` are properly initialized and that you are passing the correct `roomId`.

- Verify your network connection is stable.

### How do I distinguish between host and audience in live comment messages?

When initializing `BarrageDisplayWidget`, provide the `ownerId` parameter. The component automatically applies different styles to live comments sent by the host, based on the `ownerId`. For custom styles, you can also check if the message sender is the host by comparing the `user.userId` in the `Barrage` message and adjust the display accordingly.

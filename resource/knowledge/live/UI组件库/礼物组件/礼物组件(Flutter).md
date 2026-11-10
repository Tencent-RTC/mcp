---
sync_node_id: '211249317580087296'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "礼物组件"
  - "礼物组件（Flutter）"
product: "live"
---
This document will guide you through the rapid integration of the TUILiveKit gift feature in your Android project.

## Component Overview

The gift functionality in TUILiveKit consists of two primary view components:

|**Component Name**|**Class Name**|**Description**|
|---------|---------|---------|
|Gift Selection Panel|`GiftSendWidget`|Displays the gift list panel when clicked, allowing users to select and send gifts.|
|Gift Playback Component|`GiftPlayWidget`|Receives gift messages and renders the corresponding animation effects (such as SVGA animations) on screen.|

### Demo Effects

## Quick Start

### Step 1: Activate the Service

### Step 2: Code Integration

See Preparation for instructions on integrating `TUILiveKit`.

### Step 3: Integrate the Gift Selection Panel

`GiftSendWidget` provides an icon button that, when clicked, opens the gift list panel for selection and sending.
``` java
import 'package:flutter/material.dart';
import 'package:live_uikit_gift/live_uikit_gift.dart';

class YourAnchorPage extends StatefulWidget {
  final String liveId;

  const YourAnchorPage({super.key, required this.liveId});

  @override
  State<YourAnchorPage> createState() => _YourAnchorPageState();
}

class _YourAnchorPageState extends State<YourAnchorPage> {
  // 1. Create GiftListController: pass the live room ID as roomId
  late final GiftListController _giftListController = GiftListController(
    roomId: widget.liveId,
    language: 'zh', // Gift name language: 'zh' / 'en', etc.
  );

  @override
  void initState() {
    super.initState();
    // 2. Listen for gift send success callback (optional)
    _giftListController.onSendGiftCallback = (gift, count) {
      debugPrint('Sent gift: ${gift.name} x$count');
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // ... Other live room elements ...

            // 3. Integrate GiftSendWidget: clicking the icon will pop up the gift panel
            Positioned(
              bottom: 12,
              right: 16,
              child: GiftSendWidget(
                controller: _giftListController,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

### Step 4: Integrate the Gift Playback Component

`GiftPlayWidget` is a transparent overlay for gift animations, typically placed above the video area and below the interactive controls.
``` java
import 'package:flutter/material.dart';
import 'package:live_uikit_gift/live_uikit_gift.dart';
import 'package:tencent_live_uikit/common/index.dart';

class YourAnchorPage extends StatefulWidget {
  final String liveId;

  const YourAnchorPage({super.key, required this.liveId});

  @override
  State<YourAnchorPage> createState() => _YourAnchorPageState();
}

class _YourAnchorPageState extends State<YourAnchorPage> {
  // 1. Create GiftPlayController: pass the live room ID as roomId
  late final GiftPlayController _giftPlayController = GiftPlayController(
    roomId: widget.liveId,
    language: 'zh', // Gift name language: 'zh' / 'en', etc.
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // ... Other live room elements ...

            // 2. Integrate GiftPlayWidget
            Positioned(
              width: 1.screenWidth,
              height: 1.screenHeight,
              child: GiftPlayWidget(
                giftPlayController: _giftPlayController,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

### Step 5: Import Default Gifts

Your newly applied application does not have any gifts configured in the gift backend by default. Therefore, your gift sending panel will be empty by default after integration. To allow you to quickly experience our gift sending and receiving effects, you can use the server-side API to import the gift materials we have pre-configured for you with one click.

## Next Steps

After completing the UI integration, your client will be able to display gifts. To implement a fully commercialized gift feature,
- **Custom Gift Configuration**: Upload custom gift icons and animation files using Server APIs, and configure pricing.

- **Gift Deduction Callback**: Set up a Callback URL to forward gift requests to your billing backend for balance verification and deduction.

- **PK Score Synchronization**: In host PK scenarios, convert gift values to PK scores in real time.

- **Data Statistics**: Retrieve records of gift sending, total values, and other operational metrics.

- **Upgrade Gift Effect SDK**: If SVGA animation does not meet your needs, integrate advanced players to support MP4/PAG and other high-definition transparent animation formats.

---
sync_node_id: '176266691404664832'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "调整视频直播挂件"
  - "调整视频直播挂件（Flutter）"
product: "live"
---
`LiveCoreWidget` is a cross-platform core component for live video streaming, delivering essential features such as hosting, audience viewing, co-hosting, and host PK. Through its widget system, this component enables real-time display of custom information within the video area—such as usernames, user levels, and PK progress bars. This guide provides step-by-step instructions for Flutter developers to quickly implement and customize dedicated video widget components using provided interfaces.

## Effect Preview

## Prerequisites

Before customizing video widgets, ensure you have completed the core live streaming workflow by following Host Start Streaming and Audience Viewing.

## Core Principle

`LiveCoreWidget` enables custom view rendering through the `VideoWidgetBuilder` delegate. When the live room state changes—for example, when a user takes a mic seat or a PK session starts—`LiveCoreWidget` automatically invokes delegate methods to determine which view to display. As a developer, you implement these interface methods and return your custom `Widget` instances.

|Callback|Description|Related Business Scenario|
|---------|---------|---------|
|`CoGuestWidgetBuilder`|Builds the widget for audience co-hosting views.|Audience co-hosting, invite to mic|
|`CoHostWidgetBuilder`|Builds the widget for cross-room co-hosting (host co-hosting) views.|Host co-hosting|
|`BattleWidgetBuilder`|Builds the widget for individual users in PK scenarios (e.g., avatar, score).|Host PK|
|`BattleContainerWidgetBuilder`|Builds the overall container for PK scenarios (e.g., background, PK score bar).|Host PK|

## Customizing Co-hosting Scene Widgets

When an audience member co-hosts with a host, or when hosts co-host across rooms, the live room interface switches from a single-user view to a multi-user layout. In these scenarios, you’ll want to display additional user information—such as nickname, user level, or mute status—to clearly distinguish each mic seat.

### Applicable Scenarios
- When a host and audience member are co-hosting via video, customize the user info displayed on each mic seat (e.g., nickname, level, mute icon).

- When hosts are co-hosting across rooms, adjust the display style for the other host (e.g., nickname, level, mute icon).

- Change the default background placeholder when there is no video stream (e.g., show a placeholder avatar).

- Customize the view shown for empty mic seats.

### View Hierarchy Illustration

### Implementation Steps

> **Note:**
> You can also refer to the [CoGuestWidgets](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/live/livekit/lib/live_stream/features/decorations/co_guest) and [CoHostWidgets](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/live/livekit/lib/live_stream/features/decorations/co_host) directories in the TUILiveKit open source project for complete implementation examples.
> 

#### Step 1. Create Custom Widget Components

Define three basic widget classes to display user information, empty mic seat prompts, and a background for when no video stream is available.

Custom user information view:
``` java
import 'package:flutter/material.dart';

class CustomInfoWidget extends StatelessWidget {
  final String name;
  final bool isMuted;

  const CustomInfoWidget({
    super.key,
    required this.name,
    required this.isMuted,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Text(name),
        if (isMuted) const Icon(Icons.mic_off),
        // Layout parameter code omitted here
      ],
    );
  }
}
```

Custom empty mic seat view:
``` java
import 'package:flutter/material.dart';

class EmptySeatWidget extends StatelessWidget {
  const EmptySeatWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: const [
        Icon(Icons.add),
        Text('Invite to co-host'),
        // Image resource loading and layout parameter code omitted here
      ],
    );
  }
}
```

Custom avatar placeholder for no video stream:
``` java
import 'package:flutter/material.dart';

class CustomAvatarWidget extends StatelessWidget {
  final String avatarURL;

  const CustomAvatarWidget({
    super.key,
    required this.avatarURL,
  });

  @override
  Widget build(BuildContext context) {
    // In production, use an image loading library (e.g., CachedNetworkImage) to load avatarURL
    return Image.network(avatarURL);
    // Layout parameter code omitted here
  }
}
```

#### Step 2. Implement VideoWidgetBuilder Logic

Create a builder class and implement the `VideoWidgetBuilder` callbacks `coGuestWidgetBuilder` (for audience co-hosting) and `coHostWidgetBuilder` (for host co-hosting), returning your custom widgets as needed.

Implement the `coGuestWidgetBuilder` callback to return the audience co-hosting video widget:
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

VideoWidgetBuilder(coGuestWidgetBuilder: (context, seatInfo, viewLayer) {
  final isUserOnSeat = seatInfo.userInfo.userID.isNotEmpty;
  if (viewLayer == ViewLayer.foreground) {
    if (isUserOnSeat) {
      // Occupied mic seat: return custom foreground widget
      return CustomInfoWidget(
        name: seatInfo.userInfo.userName,
        isMuted: seatInfo.userInfo.microphoneStatus == DeviceStatus.off
      );
    } else {
      // Empty mic seat: return custom empty seat widget
      return EmptySeatWidget();
    }
  } else {
    if (isUserOnSeat) {
      // User camera is off: display custom background widget
      return CustomAvatarWidget(avatarURL: seatInfo.userInfo.avatarURL);
    } else {
      return SizedBox.shrink();
    }
  }
})
```

Implement the `coHostWidgetBuilder` callback for host co-hosting video widgets:
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

VideoWidgetBuilder(coHostWidgetBuilder: (context, seatInfo, viewLayer) {
  final isUserOnSeat = seatInfo.userInfo.userID.isNotEmpty;
  if (viewLayer == ViewLayer.foreground) {
    if (isUserOnSeat) {
      // Return custom foreground widget; can use a style different from audience co-hosting
      return CustomInfoWidget(
        name: seatInfo.userInfo.userName,
        isMuted: seatInfo.userInfo.microphoneStatus == DeviceStatus.off
      );
    } else {
      // Return custom empty seat widget; can use a style different from audience co-hosting
      return EmptySeatWidget();
    }
  } else {
    if (isUserOnSeat) {
      // Return custom background widget (shown when camera is off); can use a style different from audience co-hosting
      return CustomAvatarWidget(avatarURL: seatInfo.userInfo.avatarURL);
    } else {
      return SizedBox.shrink();
    }
  }
})
```

#### Parameter Descriptions
| Parameter | Type | Description |
| --- | --- | --- |
| <code>seatInfo</code> | <code>SeatInfo</code> | Mic seat information object containing details about the user occupying the mic seat. |
| <code>seatInfo.userInfo.userName</code> | <code>String</code> | The nickname of the user on the mic seat. |
| <code>seatInfo.userInfo.avatarURL</code> | <code>String</code> | The avatar URL of the user on the mic seat. |
| <code>seatInfo.userInfo.microphoneStatus</code> | <code>DeviceStatus</code> | The microphone status of the user on the mic seat. |
| <code>seatInfo.userInfo.cameraStatus</code> | <code>DeviceStatus</code> | The camera status of the user on the mic seat. |
| <code>viewLayer</code> | <code>ViewLayer</code> | View layer enum.<br>- <code>.foreground</code>: The foreground widget, always displayed above the video.<br>- <code>.background</code>: The background widget, displayed below the foreground view and shown only when the user has no video stream (e.g., camera is off). Typically used to display a default avatar or placeholder image. |

## Customizing Host PK Scene Widgets

PK is the most interactive part of a live streaming session. During PK, the screen is typically divided based on the number of participants. Developers can add PK-specific UI elements—such as PK score bars, score displays above each mic seat, countdown animations, or VS effect icons—to create an engaging competitive atmosphere.

### View Hierarchy Illustration

> **Note:**
> PK functionality depends on co-hosting. You must establish host co-hosting before initiating a PK session.
> 

### Implementation Steps

#### Step 1. Create Custom UI Components

PK scenarios typically require two types of widgets:
- **Single-user widget**: Displayed above each host’s video window (e.g., score capsule).

- **Global container**: Overlays the entire video area (e.g., VS animation, countdown).

   > **Note：**
   > 
   > You can also review the [BattleWidgets](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/live/livekit/lib/live_stream/features/decorations/battle) directory in the TUILiveKit open source project for complete implementation samples.
   > 

   ``` java
   import 'package:flutter/material.dart';
   
   // Example: Single-user score bar
   class MyBattleScoreWidget extends StatelessWidget {
     const MyBattleScoreWidget({super.key});
   
     @override
     Widget build(BuildContext context) {
       // Internal score display logic
       return const Placeholder();
     }
   }
   
   // Example: Global VS panel
   class MyBattleContainer extends StatelessWidget {
     const MyBattleContainer({super.key});
   
     @override
     Widget build(BuildContext context) {
       // Internal countdown and VS animation logic
       return const Placeholder();
     }
   }
   ```

#### Step 2. Implement VideoWidgetBuilder Logic

In your `VideoWidgetBuilder`, implement the remaining PK view builder methods as follows:
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

VideoWidgetBuilder(
  // Omitted coGuestWidgetBuilder / coHostWidgetBuilder for brevity...
  // 1. Build the PK single-user info widget (displayed above each host's video)
  battleWidgetBuilder: (context, seatInfo) {
    return MyBattleScoreWidget();
  },
  // 2. Build the PK global container widget (displayed above the entire video area)
  battleContainerWidgetBuilder: (context) {
    return MyBattleContainer();
  }
)
```

## Integration and Activation

This is a crucial step: You must inject the `VideoWidgetBuilder`—with your custom delegate logic—into the core live streaming workflow.

**Host Integration:**  

Before initializing your main container, create the `LiveCoreWidget` and set the `VideoWidgetBuilder` via the `videoWidgetBuilder` parameter.
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

class AnchorWidget extends StatefulWidget {
  const AnchorWidget({super.key});

  @override
  State<AnchorWidget> createState() => _AnchorWidgetState();
}

class _AnchorWidgetState extends State<AnchorWidget> {
  // Assume liveInfo is already obtained here
  final LiveInfo liveInfo = LiveInfo();

  late final LiveCoreController _liveCoreController;

  @override
  void initState() {
    super.initState();
    // 1. Initialize the LiveCoreWidget controller
    _liveCoreController = LiveCoreController.create(CoreViewType.pushView);
    _liveCoreController.setLiveID(liveInfo.liveID);
  }

  @override
  Widget build(BuildContext context) {
    return LiveCoreWidget(
      // 2. Place the core video component in the parent widget and pass in the controller
      controller: _liveCoreController,
      // 3. Pass the VideoWidgetBuilder with your custom implementation
      videoWidgetBuilder: VideoWidgetBuilder(
        coGuestWidgetBuilder: (context, seatInfo, viewLayer) {
          // Insert your coGuestWidgetBuilder implementation here
          return Placeholder();
        },
        coHostWidgetBuilder: (context, seatInfo, viewLayer) {
          // Insert your coHostWidgetBuilder implementation here
          return Placeholder();
        },
        battleWidgetBuilder: (context, seatInfo) {
          // Insert your battleWidgetBuilder implementation here
          return Placeholder();
        },
        battleContainerWidgetBuilder: (context) {
          // Insert your battleContainerWidgetBuilder implementation here
          return Placeholder();
        }
      )
    );
  }
}
```

**Audience Integration:**  

Audience integration is similar to host integration. Just set the `CoreViewType` for `LiveCoreController` to `CoreViewType.pushView`.
``` java
import 'package:flutter/material.dart';
import 'package:atomic_x_core/atomicxcore.dart';

class AudienceWidget extends StatefulWidget {
  const AudienceWidget({super.key});

  @override
  State<AudienceWidget> createState() => _AudienceWidgetState();
}

class _AudienceWidgetState extends State<AudienceWidget> {
  // Assume liveInfo is already obtained here
  final LiveInfo liveInfo = LiveInfo();

  late final LiveCoreController _liveCoreController;

  @override
  void initState() {
    super.initState();
    // 1. Initialize the LiveCoreWidget controller
    _liveCoreController = LiveCoreController.create(CoreViewType.pushView);
    _liveCoreController.setLiveID(liveInfo.liveID);
  }

  @override
  Widget build(BuildContext context) {
    return LiveCoreWidget(
      // 2. Place the core video component in the parent widget and pass in the controller
      controller: _liveCoreController,
      // 3. Pass the VideoWidgetBuilder with your custom implementation
      videoWidgetBuilder: VideoWidgetBuilder(
        coGuestWidgetBuilder: (context, seatInfo, viewLayer) {
          // Insert your coGuestWidgetBuilder implementation here
          return Placeholder();
        },
        coHostWidgetBuilder: (context, seatInfo, viewLayer) {
          // Insert your coHostWidgetBuilder implementation here
          return Placeholder();
        },
        battleWidgetBuilder: (context, seatInfo) {
          // Insert your battleWidgetBuilder implementation here
          return Placeholder();
        },
        battleContainerWidgetBuilder: (context) {
          // Insert your battleContainerWidgetBuilder implementation here
          return Placeholder();
        }
      )
    );
  }
}
```

## Advanced: Accessing Real-time Business Data

For complex scenarios such as PK, `SeatInfo` provides only basic mic seat data. If your custom widgets require real-time business data—such as countdowns or PK scores—connect your widgets to the relevant data stores in `AtomicXCore`.

|**Store/Component**|**Function Description**|**API Documentation**|
|---------|---------|---------|
|`CoGuestStore`|Audience co-hosting data: list of co-hosted users, invitation list, application list, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/index.html)|
|`CoHostStore`|Host co-hosting data: list of co-hosted users, invitation list, application list, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_host_store/index.html)|
|`BattleStore`|PK data: current PK info, PK user list, PK score list.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_battle_store/index.html)|

## FAQs

### I only want to modify the co-hosting view, but keep the default PK view. What should I do?

Simply update the `coGuestWidgetBuilder` in your `VideoWidgetBuilder` implementation to return your custom widget, and leave the PK-related builders unchanged.

### My custom widget is displayed, but can't be clicked?

Because the foreground view (`.foreground`) is always rendered above the video layer, ensure your `CustomWidget` is assigned to the `.foreground` layer and that its parent widget does not block user interactions.

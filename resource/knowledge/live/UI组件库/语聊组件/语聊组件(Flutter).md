---
sync_node_id: '212309562219532288'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "语聊组件"
  - "语聊组件（Flutter）"
product: "live"
---
## Component Overview

The **Voice Chat Mic Seat Component** (`SeatGridWidget`) is a core UI widget designed for Voice Chat Room scenarios. It automatically syncs with mic seat status and supports displaying user information, audio volume indicators, and host badges. This documentation enables you to quickly adjust the mic seat layout or fully customize the mic seat view to meet your business needs, including multi-user social chat or gaming.

## Prerequisites

Before configuring the Voice Chat Mic Seat component, complete the main workflow setup by referring to Host Live Streaming and Audience Viewing.

## Configure Mic Seat List Layout

The component provides several built-in layout modes for different voice chat scenarios. Switch between layouts easily using the `setLayoutMode` method of `SeatGridController`—no manual position calculations required.

### Preview

### API Description
``` java
void setLayoutMode(LayoutMode layoutMode, SeatWidgetLayoutConfig? layoutConfig)
```
| Parameter | Description |
| --- | --- |
| <code>layoutMode</code> | Layout mode:<br>-  <strong>LayoutMode.grid (Grid Layout)</strong>: Distributes all mic seats evenly, suitable for multi-user voice chat.<br>-  <strong>LayoutMode.focus (Focus Layout)</strong>: Highlights the main mic seat, ideal for scenarios with a primary host.<br>-  <strong>LayoutMode.vertical (Vertical Layout)</strong>: Arranges mic seats vertically, optimized for portrait mode.<br>-  <strong>LayoutMode.free (Custom Layout)</strong>: Use for fully customized layouts. |
| <code>layoutConfig</code> | Custom row and column layout configuration. This parameter is required only when <code>layoutMode</code> is set to <code>FREE</code>. |

### Code Example

Use the following code to quickly set the mic seat list layout:
``` java
SeatGridController seatGridController = SeatGridController(liveID: 'your live id');

// Set grid layout
seatGridController.setLayoutMode(LayoutMode.grid);

// Set focus layout
seatGridController.setLayoutMode(LayoutMode.focus);

// Set vertical layout
seatGridController.setLayoutMode(LayoutMode.vertical);

// Set custom layout
// First row configuration
final rowConfig1 = SeatWidgetLayoutRowConfig(
    count: 3, // Number of seats in the first row
    seatSpacing: 10, // Horizontal spacing between seats in the first row
    seatSize: Size(50, 50), // Size of each seat view in the first row
    alignment: SeatWidgetLayoutRowAlignment.center); // Alignment for the first row

// Second row configuration
final rowConfig2 = SeatWidgetLayoutRowConfig(
    count: 3, // Number of seats in the second row
    seatSpacing: 10, // Horizontal spacing between seats in the second row
    seatSize: Size(50, 50), // Size of each seat view in the second row
    alignment: SeatWidgetLayoutRowAlignment.spaceAround); // Alignment for the second row

final layoutConfig = SeatWidgetLayoutConfig(rowConfigs: [rowConfig1, rowConfig2], rowSpacing: 10);

seatGridController.setLayoutMode(LayoutMode.free, layoutConfig: layoutConfig);
```

**Custom Layout Alignment Diagram:**

## Customizing Mic Seat UI

If the default mic seat style does not meet your business requirements, you can take full control of the rendering logic by providing a custom builder (`SeatWidgetBuilder`).

### Preview

### API Description
``` java
SeatGridController seatGridController = SeatGridController(liveID: 'your live id');
    
SeatGridWidget(
  controller: seatGridController,
  seatWidgetBuilder:
      (BuildContext context, ValueNotifier<SeatInfo> seatInfoNotifier, ValueNotifier<int> volumeNotifier) {
    return SizedBox(); // Replace with your custom mic seat view
  },
);
```

|Parameter|Description|
|---------|---------|
|`seatInfoNotifier`|Notifier for the current mic seat state.|
|`volumeNotifier`|Notifier for the current user's mic volume.|

### Code Example

``` java
SeatGridController seatGridController = SeatGridController(liveID: 'your live id');

SeatGridWidget(
  controller: seatGridController,
  seatWidgetBuilder:
      (BuildContext context, ValueNotifier<SeatInfo> seatInfoNotifier, ValueNotifier<int> volumeNotifier) {
    return TestSeatInfoWidget(seatInfo: seatInfoNotifier.value, volume: volumeNotifier.value);
  },
);

seatGridView.setSeatViewDelegate(TestSeatViewDelegate())

class TestSeatInfoWidget extends StatelessWidget {
  final SeatInfo seatInfo;
  final int volume;

  const TestSeatInfoWidget({super.key, required this.seatInfo, required this.volume});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [Text('userId:${seatInfo.userInfo.userID}'), Text('volume:$volume')],
    );
  }
}
```

## FAQs

### How do I handle mic seat click events after customizing the adapter?

Set up a click listener inside your custom Widget and handle your business logic in the callback.

### Will mic seat data be lost after switching layouts?

No. `SeatGridWidget` maintains internal state. Calling `setLayoutMode` only changes the visual arrangement and does not affect users' mic seat status.

### How can I listen for real-time changes in the mic seat list (such as users taking or leaving mic seats)?

You do not need to manually listen in the adapter. `SeatGridWidget` automatically registers mic seat listeners. When a mic seat state changes, the `seatWidgetBuilder` callback is triggered so you can update the UI accordingly.

---
sync_node_id: '212309558929195008'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "语聊组件"
  - "语聊组件（iOS）"
product: "live"
---
## Component Overview

The **Voice Chat Mic Seat Component** (**SeatGridView**) is a core UI element built for voice chat room applications. It automatically manages mic seat states and displays user details, volume waveforms, and host indicators. With this guide, you can quickly adjust the mic seat layout or fully customize the mic seat view to match your business requirements, such as multi-user social rooms or gaming environments.

## Prerequisites

Before configuring the Voice Chat Mic Seat Component, complete the main workflow setup by following Host Streaming and Audience Viewing.

## Configuring Mic Seat List Layout

The component offers several built-in layout modes for different voice chat scenarios. Switch layouts instantly using the `setLayoutMode` API—no manual position calculations required.

### Preview

### API Description

【Swift】
``` swift
func setLayoutMode(layoutMode: SGLayoutMode, layoutConfig: SGSeatViewLayoutConfig? = nil
```
| <strong>Parameter</strong> | <strong>Description</strong> |
| --- | --- |
| <code>layoutMode</code> | Layout mode:<br>- <strong>GRID (Grid Layout)</strong>: Ideal for multi-user voice chat rooms; mic seats are distributed evenly.<br>- <strong>FOCUS (Focus Layout)</strong>: Highlights the main mic seat for scenarios with a primary speaker.<br>- <strong>VERTICAL (Vertical Layout)</strong>: Arranges mic seats vertically for portrait mode.<br>- <strong>FREE (Custom Layout)</strong>: Use for fully custom layouts. |
| <code>layoutConfig</code> | Custom row and column layout settings. Required only when <code>layoutMode</code> is <code>FREE</code>. |

### Code Example

Set the mic seat list layout using the following examples.

【Swift】
``` java
// Set grid layout
seatGridView.setLayoutMode(layoutMode: .grid)

// Set focus layout
seatGridView.setLayoutMode(layoutMode: .focus)

// Set vertical layout
seatGridView.setLayoutMode(layoutMode: .vertical)

// Set custom layout
// First row configuration
let rowConfig1 = SGSeatViewLayoutRowConfig(count: 3, // Seats in the first row
                                           seatSpacing: 10, // Horizontal spacing between mic seats in the first row
                                           seatSize: CGSize(width: 50, height: 50), // Size of each mic seat in the first row
                                           alignment: .center) // Alignment for the first row
  
// Second row configuration
let rowConfig2 = SGSeatViewLayoutRowConfig(count: 3, // Seats in the second row
                                           seatSpacing: 10, // Horizontal spacing between mic seats in the second row
                                           seatSize: CGSize(width: 50, height: 50), // Size of each mic seat in the second row
                                           alignment: .spaceAround) // Alignment for the second row 
 
let layoutConfig = SGSeatViewLayoutConfig(rowConfigs: [rowConfig1, rowConfig2],
                                          rowSpacing: 10)

seatGridView.setLayoutMode(layoutMode: .free, layoutConfig: layoutConfig)

```

**Custom Layout Alignment Diagram:**

## Custom Mic Seat View UI

If the default mic seat style does not fit your requirements, you can fully control the rendering logic by setting an adapter (`Adapter/Delegate`).

### Preview

### API Description

【Swift】
``` java
@objc public protocol SGSeatViewDelegate {
    func seatGridView(_ view: SeatGridView, createSeatView seatInfo: TUISeatInfo) -> UIView?
    func seatGridView(_ view: SeatGridView, updateSeatView seatInfo: TUISeatInfo, seatView: UIView)
    func seatGridView(_ view: SeatGridView, updateUserVolume volume: Int, seatView: UIView)
}

public func setSeatViewDelegate(_ delegate: SGSeatViewDelegate)
```

|Parameter|Description|
|---------|---------|
|`view`|Current Voice Chat Mic Seat Component.|
|`seatInfo`|Current mic seat information.|
|`volume`|Current host's volume.|
|`seatView`|Your custom mic seat `view`.|
|`delegate`|Custom mic seat `delegate`.|

### Code Example

If the default UI does not fit your needs, customize the mic seat UI using the following approach.

【Swift】
``` java
class TestSeatViewDelegate: SGSeatViewDelegate {
    func seatGridView(_ view: SeatGridView, createSeatView seatInfo: TUISeatInfo) -> UIView? {
      return TestSeatInfoView(seatGridView: view, seatInfo: seatInfo)
    }
    
    func seatGridView(_ view: SeatGridView, updateSeatView seatInfo: TUISeatInfo, seatView: UIView) {
      if let seatView = seatView as? TestSeatInfoView {
        seatView.updateSeatView(seatGridView: view, seatInfo: seatInfo)
      }
    }
    
    func seatGridView(_ view: SeatGridView, updateUserVolume volume: Int, seatView: UIView) {
      if let seatView = seatView as? TestSeatInfoView {
        seatView.updateUserVolume(seatGridView: view, volume: volume)
      }
    }
}

seatGridView.setSeatViewDelegate(TestSeatViewDelegate())

class TestSeatInfoView: UIView {
    init(seatGridView: SeatGridView, seatInfo: TUISeatInfo) {
        super.init(frame: .zero)
        initView() // Initialize view
    }

    func updateSeatView(seatGridView: SeatGridView, seatInfo: TUISeatInfo) {
        updateView(seatInfo) // Update custom mic seat UI
    }

    func updateUserVolume(seatGridView: SeatGridView, volume: Int) {
        updateUserVolume(volume) // Update volume UI
    }
}

```

## FAQs

### Handling Mic Seat Click Events in Custom Adapter

Set up a click listener inside your custom `View` and implement your business logic in the callback.

### Mic Seat Data Persistence When Switching Layouts

No. `SeatGridView` preserves internal data state. Calling `setLayoutMode` only changes the visual layout and does not affect the host's status.

### Listening for Real-Time Mic Seat List Changes (e.g., hosts taking or leaving mic seats)

You do not need to manually listen in the adapter. `SeatGridView` automatically registers mic seat listeners. Whenever a mic seat state changes, it triggers the `updateSeatView` method. Simply update your UI within this method.

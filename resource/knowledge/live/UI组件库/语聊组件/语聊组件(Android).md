---
sync_node_id: '176274538324267008'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "语聊组件"
  - "语聊组件（Android）"
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

【Android(Kotlin)】
``` java
fun setLayoutMode(layoutMode: VoiceRoomDefine.LayoutMode, layoutConfig: VoiceRoomDefine.SeatViewLayoutConfig?)
```

【iOS(Swift)】
``` swift
func setLayoutMode(layoutMode: SGLayoutMode, layoutConfig: SGSeatViewLayoutConfig? = nil)
```
| <strong>Parameter</strong> | <strong>Description</strong> |
| --- | --- |
| <code>layoutMode</code> | Layout mode:<br>- <strong>GRID (Grid Layout)</strong>: Ideal for multi-user voice chat rooms; mic seats are distributed evenly.<br>- <strong>FOCUS (Focus Layout)</strong>: Highlights the main mic seat for scenarios with a primary speaker.<br>- <strong>VERTICAL (Vertical Layout)</strong>: Arranges mic seats vertically for portrait mode.<br>- <strong>FREE (Custom Layout)</strong>: Use for fully custom layouts. |
| <code>layoutConfig</code> | Custom row and column layout settings. Required only when <code>layoutMode</code> is <code>FREE</code>. |

### Code Example

Set the mic seat list layout using the following examples.

【Android (Kotlin)】
``` java
// Set grid layout
seatGridView.setLayoutMode(VoiceRoomDefine.LayoutMode.GRID, null)

// Set focus layout
seatGridView.setLayoutMode(VoiceRoomDefine.LayoutMode.FOCUS, null)

// Set vertical layout
seatGridView.setLayoutMode(VoiceRoomDefine.LayoutMode.VERTICAL, null)

// Set custom layout
val layoutConfig = VoiceRoomDefine.SeatViewLayoutConfig().apply {
     rowConfigs = ArrayList()
     rowSpacing =  dp2px(10) // Row spacing
 }
 // First row configuration
 val rowConfig1 = VoiceRoomDefine.SeatViewLayoutRowConfig().apply {
     count = 3 // Seats in the first row
     seatSize = VoiceRoomDefine.Size(dp2px(50), dp2px(50)) // Size of each mic seat in the first row
     seatSpacing = dp2px(10) // Horizontal spacing between mic seats in the first row
     alignment = VoiceRoomDefine.SeatViewLayoutRowAlignment.CENTER // Alignment for the first row
 }
 layoutConfig.rowConfigs.add(rowConfig1)
 // Second row configuration
 val rowConfig2 = VoiceRoomDefine.SeatViewLayoutRowConfig().apply {
     count = 3 // Seats in the second row
     seatSize = VoiceRoomDefine.Size(dp2px(50), dp2px(50)) // Size of each mic seat in the second row
     seatSpacing = dp2px(10) // Horizontal spacing between mic seats in the second row
     alignment = VoiceRoomDefine.SeatViewLayoutRowAlignment.SPACE_AROUND // Alignment for the second row
 }    
 layoutConfig.rowConfigs.add(rowConfig2)
 seatGridView.setLayoutMode(VoiceRoomDefine.LayoutMode.FREE, layoutConfig)

```

**Custom Layout Alignment Diagram:**

## Custom Mic Seat View UI

If the default mic seat style does not fit your requirements, you can fully control the rendering logic by setting an adapter (`Adapter/Delegate`).

### Preview

### API Description

【Kotlin】
``` java
interface SeatViewAdapter {
    fun createSeatView(seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo): View
    fun updateSeatView(seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo, seatView: View, )
    fun updateUserVolume(seatGridView: SeatGridView, volume: Int, seatView: View)
}

fun setSeatViewAdapter(adapter: VoiceRoomDefine.SeatViewAdapter?) 
```

|**Parameter**|**Description**|
|---------|---------|
|`seatGridView`|Current Voice Chat Mic Seat Component.|
|`seatInfo`|Current mic seat information.|
|`volume`|Current host's volume.|
|`seatView`|Your custom mic seat `view`.|
|`adapter`|Custom mic seat adapter.|

### Code Example

If the default UI does not fit your needs, customize the mic seat UI using the following approach.

【Android (Kotlin)】
``` java
val adapter = object : VoiceRoomDefine.SeatViewAdapter {
    override fun createSeatView(seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo): View {
        return TestSeatInfoView(context, seatGridView, seatInfo)
    }

    override fun updateSeatView(seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo, seatView: View) {
        (seatView as TestSeatInfoView).updateSeatView(seatGridView, seatInfo)
    }

    override fun updateUserVolume(seatGridView: SeatGridView, volume: Int, customSeatView: View) {
        (customSeatView as TestSeatInfoView).updateUserVolume(seatGridView, volume)
    }
}

seatGridView.setSeatViewAdapter(adapter)

class TestSeatInfoView constructor(context: Context, seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo) : FrameLayout(context) {
    init {
        initView() // Initialize view
    }

    fun updateSeatView(seatGridView: SeatGridView, seatInfo: TUIRoomDefine.SeatInfo) {
        updateView(seatInfo) // Update custom mic seat UI
    }

    fun updateUserVolume(seatGridView: SeatGridView, volume: Int) {
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

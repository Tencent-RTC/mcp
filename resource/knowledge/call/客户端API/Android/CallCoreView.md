---
sync_node_id: '215480880206958592'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "Android"
  - "CallCoreView"
product: "call"
---
## Introduction

`CallCoreView` is the main container for the call interface, providing the following core capabilities:
- **Multi-Layout Switching**: Supports switching between single-person float, multi-person grid, and picture-in-picture layouts.

- **Call Waiting Interaction**: Supports custom waiting animations before call connection.

- **Status Visualization**: Supports custom icons for different volume levels and network quality states.

- **User Personalization**: Supports setting participant avatars through User ID mapping.

   > **Note:** 
   > 
   > This view component must be used together with **CallStore** to properly display call screens and receive call state updates.
   > 

## Features
- **Multi-Layout Switching**: Supports switching between single-person float, multi-person grid, and picture-in-picture layouts.

- **Call Waiting Interaction**: Supports custom waiting animations before call connection.

- **Status Visualization**: Supports custom icons for different volume levels and network quality states.

- **User Personalization**: Supports setting participant avatars through User ID mapping.

## API List

|**Function**|**Description**|
|---------|---------|
|defaultAvatarImage|Default placeholder avatar.|
|waitingAnimationImage|Call waiting animation.|
|volumeImages|Volume status icon collection.|
|networkQualityImages|Network signal icon collection.|
|participantAvatars|Participant avatar collection.|
|setLayoutTemplate|Multi-layout switching.|
|setWaitingAnimation|Configure waiting animation.|
|setVolumeLevelIcons|Configure volume icons.|
|setNetworkQualityIcons|Configure network icons.|
|setParticipantAvatars|Configure participant avatars.|

### Static Properties

#### defaultAvatarImage

Default placeholder avatar.

#### waitingAnimationImage

Call waiting animation.

#### volumeImages

Volume status icon collection.

#### networkQualityImages

Network signal icon collection.

#### participantAvatars

Participant avatar collection.

### Configuration Methods

#### setLayoutTemplate

Switch the layout mode of the call interface.
``` kotlin
fun setLayoutTemplate(template: CallLayoutTemplate) {
    setLayoutTemplateInternal(template)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|template|CallLayoutTemplate|Target layout template.|

#### setWaitingAnimation

Configure call waiting animation.
``` kotlin
fun setWaitingAnimation(path: String) {
    setWaitingAnimationInternal(path)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|path|String|Resource path of the animation file.|

#### setVolumeLevelIcons

Customize volume level icons.
``` kotlin
fun setVolumeLevelIcons(icons: Map<VolumeLevel, String>) {
    setVolumeLevelIconsInternal(icons)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|icons|Map<VolumeLevel, String>|Mapping between volume levels and icon paths.|

#### setNetworkQualityIcons

Customize network quality icons.
``` kotlin
fun setNetworkQualityIcons(icons: Map<NetworkQuality, String>) {
    setNetworkQualityIconsInternal(icons)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|icons|Map<NetworkQuality, String>|Mapping between network quality states and icon paths.|

#### setParticipantAvatars

Set participant avatars.
``` kotlin
fun setParticipantAvatars(avatars: Map<String, String>) {
    setParticipantAvatarsInternal(avatars)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|avatars|Map<String, String>|Mapping between User IDs and avatar resource paths.|

## Data Structures

### CallLayoutTemplate

Call layout mode enum, used to define the display form of the call screen.

|**Enum Value**|**Description**|
|---------|---------|
|float|Single-person call layout.|
|grid|Multi-person call layout.|
|pip|Picture-in-picture layout.|

### VolumeLevel

Volume level enum, used to identify the current volume intensity of participants.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|Mute|0|Muted.|
|Low|1|Low volume.|
|Medium|2|Medium volume.|
|High|3|High volume.|
|Peak|4|Peak volume.|

## Usage Example
``` kotlin
import io.trtc.tuikit.atomicxcore.api.view.*
// Create call view
val callCoreView = CallCoreView(context)
addView(callCoreView)
// Set layout mode
callCoreView.setLayoutTemplate(CallLayoutTemplate.GRID)
// Set waiting animation
callCoreView.setWaitingAnimation("waiting_animation.json")
// Set volume icons
callCoreView.setVolumeLevelIcons(mapOf(
    VolumeLevel.MUTE to "volume_mute",
    VolumeLevel.LOW to "volume_low",
    VolumeLevel.MEDIUM to "volume_medium",
    VolumeLevel.HIGH to "volume_high",
    VolumeLevel.PEAK to "volume_peak"
))
// Set network quality icons
callCoreView.setNetworkQualityIcons(mapOf(
    NetworkQuality.UNKNOWN to "network_unknown",
    NetworkQuality.EXCELLENT to "network_excellent",
    NetworkQuality.GOOD to "network_good",
    NetworkQuality.POOR to "network_poor",
    NetworkQuality.BAD to "network_bad",
    NetworkQuality.VERY_BAD to "network_very_bad",
    NetworkQuality.DOWN to "network_down"
))
// Set participant avatars
callCoreView.setParticipantAvatars(mapOf(
    "user_123" to "avatar_user_123",
    "user_456" to "avatar_user_456"
))
```

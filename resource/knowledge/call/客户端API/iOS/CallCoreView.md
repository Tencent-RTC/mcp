---
sync_node_id: '215480935694229504'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "iOS"
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
``` swift
public func setLayoutTemplate(_ template: CallLayoutTemplate) {
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
``` swift
public func setWaitingAnimation(path: String) {
    setWaitingAnimationInternal(path: path)
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
``` swift
public func setVolumeLevelIcons(icons: [VolumeLevel: String]) {
    setVolumeLevelIconsInternal(icons: icons)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|icons|[VolumeLevel: String]|Mapping between volume levels and icon paths.|

#### setNetworkQualityIcons

Customize network quality icons.
``` swift
public func setNetworkQualityIcons(icons: [NetworkQuality: String]) {
    setNetworkQualityIconsInternal(icons: icons)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|icons|[NetworkQuality: String]|Mapping between network quality states and icon paths.|

#### setParticipantAvatars

Set participant avatars.
``` swift
public func setParticipantAvatars(avatars: [String: String]) {
    setParticipantAvatarsInternal(avatars: avatars)
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|avatars|[String: String]|Mapping between User IDs and avatar resource paths.|

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
|mute|0|Muted.|
|low|1|Low volume.|
|medium|2|Medium volume.|
|high|3|High volume.|
|peak|4|Peak volume.|

## Usage Example
``` swift
import AtomicXCore
// Create call view
let callCoreView = CallCoreView(frame: view.bounds)
view.addSubview(callCoreView)
// Set layout mode
callCoreView.setLayoutTemplate(.grid)
// Set waiting animation
callCoreView.setWaitingAnimation(path: "waiting_animation.json")
// Set volume icons
callCoreView.setVolumeLevelIcons(icons: [
    .mute: "volume_mute",
    .low: "volume_low",
    .medium: "volume_medium",
    .high: "volume_high",
    .peak: "volume_peak"
])
// Set network quality icons
callCoreView.setNetworkQualityIcons(icons: [
    .unknown: "network_unknown",
    .excellent: "network_excellent",
    .good: "network_good",
    .poor: "network_poor",
    .bad: "network_bad",
    .veryBad: "network_very_bad",
    .down: "network_down"
])
// Set participant avatars
callCoreView.setParticipantAvatars(avatars: [
    "user_123": "avatar_user_123",
    "user_456": "avatar_user_456"
])
```

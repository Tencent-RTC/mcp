---
sync_node_id: '215480949539790848'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "Flutter"
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
|defaultAvatar|Default placeholder avatar.|
|loadingAnimation|Call waiting animation.|
|volumeIcons|Volume status icon collection.|
|networkQualityIcons|Network signal icon collection.|
|CallCoreController.setLayoutTemplate|Multi-layout switching.|

### Static Properties

#### defaultAvatar

Default placeholder avatar.

#### loadingAnimation

Call waiting animation.

#### volumeIcons

Volume status icon collection.

**Data Structures：**VolumeLevel

#### networkQualityIcons

Network signal icon collection.

### Configuration Methods

#### CallCoreController.setLayoutTemplate

Multi-layout switching.

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

### CallCoreController

Controller for managing CallCoreView layout and state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|_currentTemplate|ValueNotifier<CallLayoutTemplate>|Current layout template notifier.|
|_zoomEnabled|bool|Video zoom gesture enabled state.|

## Usage Example
``` dart
import 'package:atomic_x_core/atomicxcore.dart';
// Create controller
final controller = CallCoreController.create();
// Create call view with configuration
CallCoreView(
  controller: controller,
  defaultAvatar: Icon(Icons.person),
  loadingAnimation: CircularProgressIndicator(),
  volumeIcons: {
    VolumeLevel.mute: Icon(Icons.volume_off),
    VolumeLevel.low: Icon(Icons.volume_down),
    VolumeLevel.medium: Icon(Icons.volume_up),
    VolumeLevel.high: Icon(Icons.volume_up),
    VolumeLevel.peak: Icon(Icons.volume_up),
  },
  networkQualityIcons: {
    NetworkQuality.unknown: Icon(Icons.signal_wifi_off),
    NetworkQuality.excellent: Icon(Icons.signal_wifi_4_bar),
    NetworkQuality.good: Icon(Icons.signal_wifi_4_bar),
    NetworkQuality.poor: Icon(Icons.network_wifi_3_bar),
    NetworkQuality.bad: Icon(Icons.network_wifi_2_bar),
    NetworkQuality.veryBad: Icon(Icons.network_wifi_1_bar),
    NetworkQuality.down: Icon(Icons.signal_wifi_off),
  },
);
// Set layout mode
controller.setLayoutTemplate(CallLayoutTemplate.grid);
```

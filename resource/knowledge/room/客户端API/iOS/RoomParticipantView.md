---
sync_node_id: '215481751132151808'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "iOS"
  - "RoomParticipantView"
product: "room"
---
## Introduction

`RoomParticipantView` is a view component specifically designed for rendering room participant video streams. It supports both camera and screen sharing video stream types, and provides fill mode settings, active state control and other features.

> **Note:** 
> Before use, you need to initialize the video stream type and participant info through **init(streamType:participant:)** method.
> 

## Features
- **Video Stream Rendering**: Supports rendering camera video streams and screen sharing video streams.

- **Fill Mode**: Supports FILL and FIT video fill modes.

- **Active State**: Supports setting the active state of the view to control video rendering.

- **Gesture Interaction**: Supports click and other gesture interactions.

## API List

|**Function**|**Description**|
|---------|---------|
|init|Create view instance.|
|updateStreamType|Update video stream type.|
|updateParticipant|Update participant info.|
|setFillMode|Set fill mode.|
|setActive|Set active state.|
|setOnClickAction|Set click callback.|

### Creating Instance

#### init

Create view instance.

### Video Stream Control

#### updateStreamType

Update video stream type.
``` swift
public func updateStreamType(streamType: VideoStreamType) {
    updateStreamTypeInternal(streamType: streamType)
}
```

Switch video stream type, for example from camera to screen sharing.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|streamType|VideoStreamType|Video stream type.|

#### updateParticipant

Update participant info.
``` swift
public func updateParticipant(participant: RoomParticipant) {
    updateParticipantInternal(participant: participant)
}
```

Update the participant rendered by the view, switch to display the new participant's video stream.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|participant|RoomParticipant|Participant info.|

### View Settings

#### setFillMode

Set fill mode.
``` swift
public func setFillMode(fillMode: FillMode) {
    setFillModeInternal(fillMode: fillMode)
}
```

Set the fill mode of the video, can choose FILL or FIT mode.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|fillMode|FillMode|Fill mode.|

#### setActive

Set active state.
``` swift
public func setActive(isActive: Bool) {
    setActiveInternal(isActive: isActive)
}
```

Set the active state of the view. When active, the view will render video; when inactive, it will stop rendering to save resources.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isActive|Bool|Whether active.|

### Interaction

#### setOnClickAction

Set click callback.
``` swift
public func setOnClickAction(action: @escaping () -> Void) {
    setOnClickActionInternal(action: action)
}
```

Set the callback closure when the view is clicked.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|action|() -> Void|Click callback closure.|

## Data Structures

### VideoStreamType

Video stream type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|camera|0|Camera video stream.|
|screen|1|Screen sharing video stream.|

### FillMode

Video fill mode.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|fill|0|Fill mode, video fills the entire view area, may crop some content.|
|fit|1|Fit mode, video displays completely, may have black borders.|

---
sync_node_id: '215481729396170752'
nav_path:
  - "视频会议 SDK"
  - "客户端 API"
  - "Android"
  - "RoomParticipantView"
product: "room"
---
## Introduction

`RoomParticipantView` is a view component specifically designed for rendering room participant video streams. It supports both camera and screen sharing video stream types, and provides fill mode settings, active state control and other features.

> **Note:** 
> Before use, you need to initialize the video stream type and participant info through **init** method.
> 

## Features
- **Video Stream Rendering**: Supports rendering camera video streams and screen sharing video streams.

- **Fill Mode**: Supports FILL and FIT video fill modes.

- **Active State**: Supports setting the active state of the view to control video rendering.

- **Gesture Interaction**: Supports click and other gesture interactions.

## API List

|**Function**|**Description**|
|---------|---------|
|RoomParticipantView|Create view instance.|
|updateStreamType|Update video stream type.|
|updateParticipant|Update participant info.|
|setFillMode|Set fill mode.|
|setActive|Set active state.|
|setOnClickListener|Set click listener.|

### Creating Instance

#### RoomParticipantView

Create view instance.

### Video Stream Control

#### updateStreamType

Update video stream type.
``` kotlin
fun updateStreamType(streamType: VideoStreamType) {
    updateStreamTypeInternal(streamType)
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
``` kotlin
fun updateParticipant(participant: RoomParticipant) {
    updateParticipantInternal(participant)
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
``` kotlin
fun setFillMode(fillMode: FillMode) {
    setFillModeInternal(fillMode)
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
``` kotlin
fun setActive(isActive: Boolean) {
    setActiveInternal(isActive)
}
```

Set the active state of the view. When active, the view will render video; when inactive, it will stop rendering to save resources.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|isActive|Boolean|Whether active.|

### Interaction

#### setOnClickListener

Set click listener.

## Data Structures

### VideoStreamType

Video stream type.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|CAMERA|0|Camera video stream.|
|SCREEN|1|Screen sharing video stream.|

### FillMode

Video fill mode.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|FILL|0|Fill mode, video fills the entire view area, may crop some content.|
|FIT|1|Fit mode, video displays completely, may have black borders.|

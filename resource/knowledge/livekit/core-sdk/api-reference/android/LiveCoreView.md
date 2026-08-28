## Introduction

`LiveCoreView` provides view container for live streaming push and playback, supporting multi-person co-guest, PK and other features. Through this component, video rendering and interaction in live rooms can be implemented.

> **Important:**
> Before using, you need to call **setLiveID** to set the live room ID first.
>

## Features
- **Video Rendering**: Provides view container for live streaming push and playback.

- **Co-guest Support**: Supports multi-person co-guest feature.

- **PK Support**: Supports anchor PK feature.

- **Preview Outside Room**: Supports previewing live stream before entering the room.

## Data Structures

### CoreViewType

Core view type.

|**Enum Value**|**Description**|
|---------|---------|
|PLAY_VIEW|Play view.|
|PUSH_VIEW|Push view.|

### ViewLayer

View layer.

|**Enum Value**|**Description**|
|---------|---------|
|FOREGROUND|Foreground layer.|
|BACKGROUND|Background layer.|

### VideoViewAdapter

Video view adapter protocol.

**Methods**

**createCoGuestView**: Create co-guest view.
``` kotlin
fun createCoGuestView(seatInfo: SeatInfo?, viewLayer: ViewLayer?): View?
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo?|Co-guest user seat information.|
|viewLayer|ViewLayer?|View layer, foreground or background.|

**createCoHostView**: Create cross-room co-host view.
``` kotlin
fun createCoHostView(seatInfo: SeatInfo?, viewLayer: ViewLayer?): View?
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo?|Cross-room co-host user seat information.|
|viewLayer|ViewLayer?|View layer, foreground or background.|

**createBattleView**: Create PK view.
``` kotlin
fun createBattleView(seatInfo: SeatInfo?): View?
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo?|PK user seat information.|

**createBattleContainerView**: Create PK container view.
``` kotlin
fun createBattleContainerView(): View?
```

## Introduction

`LiveCoreView` provides view container for live streaming push and playback, supporting multi-person co-guest, PK and other features. Through this component, video rendering and interaction in live rooms can be implemented.

> **Important:**
> Before using, you need to call **LiveCoreController.setLiveID** to set the live room ID first.
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
|playView|Play view.|
|pushView|Push view.|

### ViewLayer

View layer.

|**Enum Value**|**Description**|
|---------|---------|
|foreground|Foreground layer.|
|background|Background layer.|

### LiveCoreController

Live core widget controller protocol.

**Methods**

**create**: Create LiveCoreController.
``` dart
static LiveCoreController create(CoreViewType type) {
  return LiveCoreControllerImpl(type);
}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|type|CoreViewType|Core view type.|

**setLiveID**: Set live ID. Should set live ID before using other interfaces.
``` dart
void setLiveID(String liveID);
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|

**startPreviewLiveStream**: Preview outside room.
``` dart
void startPreviewLiveStream(String roomID, bool isMuteAudio, TUIPlayCallback? playCallback);
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Live ID.|
|isMuteAudio|bool|Whether to mute audio.|
|playCallback|TUIPlayCallback?|Play callback.|

**stopPreviewLiveStream**: Stop preview outside room.
``` dart
void stopPreviewLiveStream(String roomID);
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|roomID|String|Live ID.|

**callExperimentalAPI**: Call experimental API.
``` dart
static void callExperimentalAPI(String jsonStr) {
  LiveCoreControllerImpl.callExperimentalAPI(jsonStr);
}
```

### VideoViewAdapter

Video view adapter protocol.

**Methods**

**createCoGuestView**: Create co-guest view.
``` dart
CoGuestWidgetBuilder coGuestWidgetBuilder = (BuildContext context, SeatInfo seatInfo, ViewLayer viewPlayer) {
  return Container();
};
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo|Co-guest user seat information.|
|viewLayer|ViewLayer|View layer, foreground or background.|

**createCoHostView**: Create cross-room co-host view.
``` dart
CoHostWidgetBuilder coHostWidgetBuilder = (BuildContext context, SeatInfo seatInfo, ViewLayer viewPlayer) {
  return Container();
};
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo|Cross-room co-host user seat information.|
|viewLayer|ViewLayer|View layer, foreground or background.|

**createBattleView**: Create PK view.
``` dart
BattleWidgetBuilder battleWidgetBuilder = (BuildContext context, SeatInfo seatInfo) {
  return Container();
};
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|seatInfo|SeatInfo|PK user seat information.|

**createBattleContainerView**: Create PK container view.
``` dart
BattleContainerWidgetBuilder battleContainerWidgetBuilder = (BuildContext context) {
  return Container();
};
VideoWidgetBuilder({
  CoGuestWidgetBuilder? coGuestWidgetBuilder,
  CoHostWidgetBuilder? coHostWidgetBuilder,
  BattleWidgetBuilder? battleWidgetBuilder,
  BattleContainerWidgetBuilder? battleContainerWidgetBuilder,
}) {
  if (coGuestWidgetBuilder != null) this.coGuestWidgetBuilder = coGuestWidgetBuilder;
  if (coHostWidgetBuilder != null) this.coHostWidgetBuilder = coHostWidgetBuilder;
  if (battleWidgetBuilder != null) this.battleWidgetBuilder = battleWidgetBuilder;
  if (battleContainerWidgetBuilder != null) this.battleContainerWidgetBuilder = battleContainerWidgetBuilder;
}
```

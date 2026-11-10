---
sync_node_id: '203640173087494144'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Flutter"
  - "LiveListStore"
product: "live"
---
## Introduction

`LiveListStore` provides a complete set of live room management APIs, including starting live, joining live, leaving live, ending live and other functions. Through this class, you can manage the lifecycle of live rooms. The host calls startLive/endLive to start and dismiss a live room, while the audience calls joinLive/leaveLive to join and leave a live room.

> **Important:** 
> Use the **LiveListStore.shared** singleton object to get the `LiveListStore` instance.
> 

> **Note:** 
> Live state updates are delivered through the **liveState** publisher. Subscribe to it to receive real-time updates of live data.
> 

## Features
- **Live List**: Get and manage live room list.

- **Start Live**: Host starts broadcasting. If the live room ID is new, a new live room will be created; if the live room ID already exists on the server, the host will join and start broadcasting.

- **Live Joining**: Join existing live rooms.

- **Live Management**: Update live info, end live and other operations.

- **Event Listening**: Listen for live ended, kicked out and other events.

## Subscribable Data

**LiveListState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveList|ValueListenable<List<LiveInfo>>|Live list.|
|liveListCursor|ValueListenable<String>|Live list cursor.|
|currentLive|ValueListenable<LiveInfo>|Current live info.|

## API List

|**Function**|**Description**|
|---------|---------|
|LiveListStore.shared|Singleton object.|
|addLiveListListener|Live list event callbacks.|
|removeLiveListListener|Live list event callbacks.|
|fetchLiveList|Get live list.|
|fetchLiveInfo|Get live info.|
|startLive|Start live (Host only).|
|joinLive|Join live (Audience only).|
|leaveLive|Leave live (Audience only).|
|endLive|End live (Host only).|
|updateLiveInfo|Update live info.|
|queryMetaData|Query metadata.|
|updateLiveMetaData|Update metadata.|

### Getting Instance

#### LiveListStore.shared

Singleton object.

### Observing State and Events

#### addLiveListListener

Add live list event listener.
``` dart
void addLiveListListener(LiveListListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveListListener|Listener.|

#### removeLiveListListener

Remove live list event listener.
``` dart
void removeLiveListListener(LiveListListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveListListener|Listener.|

### Live List

#### fetchLiveList

Get live list.
``` dart
Future<CompletionHandler> fetchLiveList({
  required String cursor,
  required int count,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Cursor.|
|count|int|Count.|

#### fetchLiveInfo

Get live info.
``` dart
Future<LiveInfoCompletionHandler> fetchLiveInfo(String liveID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|
|completion|LiveInfoCompletionHandler|Completion callback.|

### Live Operations

#### startLive

Start live (Host only).
``` dart
Future<LiveInfoCompletionHandler> startLive(LiveInfo liveInfo);
```

Host starts broadcasting. If the live room ID is new, a new live room will be created; if the live room ID already exists on the server, the host will join and start broadcasting.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|

#### joinLive

Join live (Audience only).
``` dart
Future<LiveInfoCompletionHandler> joinLive(String liveID);
```

Called by the audience to join an existing live room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|

#### leaveLive

Leave live (Audience only).
``` dart
Future<CompletionHandler> leaveLive();
```

Called by the audience to leave the current live room.
If the host only needs to leave the room without dismissing it, this API can also be called.

**Version**

Supported since version 3.5.

#### endLive

End live (Host only).
``` dart
Future<StopLiveCompletionHandler> endLive();
```

Called by the host to end the current live and dismiss the room.

**Version**

Supported since version 3.5.

#### updateLiveInfo

Update live info.
``` dart
Future<CompletionHandler> updateLiveInfo({
  required LiveInfo liveInfo,
  required List<ModifyFlag> modifyFlagList,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|
|modifyFlag|List<ModifyFlag>|Modify flag.|

### Metadata Operations

#### queryMetaData

Query metadata.
``` dart
Future<MetaDataCompletionHandler> queryMetaData(List<String> keys);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keys|List<String>|Key list.|

#### updateLiveMetaData

Update live metadata.
``` dart
Future<CompletionHandler> updateLiveMetaData(Map<String, String> metaData);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|metaData|Map<String, String>|Metadata.|

## Data Structures

### LiveState

Live state.

|**Enum Value**|**Description**|
|---------|---------|
|scheduled|Scheduled.|
|running|Running.|
|suspended|Suspended.|

### TakeSeatMode

Take seat mode.

|**Enum Value**|**Description**|
|---------|---------|
|free|Free to take seat.|
|apply|Apply to take seat.|

### SeatLayoutTemplate

Seat layout template for simplifying seat configuration when creating a live room.

|**Enum Value**|**Description**|
|---------|---------|
|VideoDynamicGrid9Seats|Portrait dynamic 9-grid layout for video live streaming.|
|VideoDynamicFloat7Seats|Portrait dynamic 1v6 floating layout for video live streaming.|
|VideoLeftFocus9Seats|Portrait left focus 9-grid layout for video live streaming.|
|VideoUniformGrid9Seats|Portrait uniform 9-grid layout for video live streaming.|
|VideoFixedGrid9Seats|Portrait static 9-grid layout for video live streaming.|
|VideoFixedFloat7Seats|Portrait static 1v6 floating layout for video live streaming.|
|VideoLandscape4Seats|Landscape layout with 1 video seat and 3 audio seats for video live streaming.|
|VideoLandscape10Seats|Landscape layout with 1 video seat and 9 audio seats for video live streaming.|
|VideoPortrait10Seats|Portrait layout with 1 video seat and 9 audio seats for video live streaming.|
|Karaoke|Audio KTV layout for karaoke scenes with configurable seat count.|
|AudioSalon|Audio salon layout for voice chat scenes with configurable seat count.|

### LiveEndedReason

Live ended reason.

|**Enum Value**|**Description**|
|---------|---------|
|endedByHost|Ended by host.|
|endedByServer|Ended by server.|

### LiveKickedOutReason

Kicked out of live room reason.

|**Enum Value**|**Description**|
|---------|---------|
|byAdmin|Kicked out by admin.|
|byLoggedOnOtherDevice|Logged on other device.|
|byServer|Kicked out by server.|
|forNetworkDisconnected|Network disconnected.|
|forJoinRoomStatusInvalidDuringOffline|Join room status invalid during offline.|
|forCountOfJoinedRoomsExceedLimit|Count of joined rooms exceed limit.|

### LiveInfo

Live information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|liveName|String|Live name.|
|status|LiveState|Live status.|
|notice|String|Live notice.|
|isMessageDisable|bool|Whether message is disabled.|
|isPublicVisible|bool|Whether publicly visible.|
|keepOwnerOnSeat|bool|Whether to keep owner on seat.|
|seatMode|TakeSeatMode|Take seat mode.|
|seatTemplate|SeatLayoutTemplate|Seat layout template for simplifying seat configuration.|
|coverURL|String|Cover URL.|
|backgroundURL|String|Background URL.|
|categoryList|List<int>|Category list.|
|activityStatus|int|Activity status.|
|liveOwner|LiveUserInfo|Live owner info.|
|createTime|int|Create time.|
|totalViewerCount|int|Total viewer count.|
|isGiftEnabled|bool|Whether gift is enabled.|
|metaData|Map<String, String>|Metadata.|
|isSeatEnabled|bool|Whether seat is enabled.|
|maxSeatCount|int|Maximum seat count.|
|seatLayoutTemplateID|int|Seat layout template ID.|

### LiveListState

Live list state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveList|ValueListenable<List<LiveInfo>>|Live list.|
|liveListCursor|ValueListenable<String>|Live list cursor.|
|currentLive|ValueListenable<LiveInfo>|Current live info.|

### LiveListListener

Live list events.

**Methods**

**onLiveEnded**: Live ended event.
``` dart
void Function(String liveID, LiveEndedReason reason, String message)? onLiveEnded;
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveEndedReason|Ended reason.|
|message|String|Message.|

**onKickedOutOfLive**: Kicked out of live room event.
``` dart
void Function(String liveID, LiveKickedOutReason reason, String message)? onKickedOutOfLive;
LiveListListener({this.onLiveEnded, this.onKickedOutOfLive});
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveKickedOutReason|Kicked out reason.|
|message|String|Message.|

### LiveInfoCompletionHandler

Live info completion handler for Dart.

Completion handler for live info operations in Dart, containing the result live info.

**Properties**

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info returned on success.|

### StopLiveCompletionHandler

Stop live completion handler for Dart.

Completion handler for stop live operations in Dart, containing the live statistics data.

**Properties**

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|statisticsData|TUILiveStatisticsData|Live statistics data returned on success.|

### MetaDataCompletionHandler

Metadata completion handler for Dart.

Completion handler for metadata operations in Dart, containing the metadata result.

**Properties**

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|metaData|Map<String, String>|Metadata returned on success.|

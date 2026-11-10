---
sync_node_id: '203640146348224512'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "Android"
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
|liveList|StateFlow<List<LiveInfo>>|Live list.|
|liveListCursor|StateFlow<String>|Live list cursor.|
|currentLive|StateFlow<LiveInfo>|Current live info.|

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
``` kotlin
abstract fun addLiveListListener(listener: LiveListListener)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|LiveListListener|Listener.|

#### removeLiveListListener

Remove live list event listener.
``` kotlin
abstract fun removeLiveListListener(listener: LiveListListener)
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
``` kotlin
abstract fun fetchLiveList(
    cursor: String?,
    count: Int,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String?|Cursor.|
|count|Int|Count.|
|completion|CompletionHandler?|Completion callback.|

#### fetchLiveInfo

Get live info.
``` kotlin
abstract fun fetchLiveInfo(
    liveID: String,
    completion: LiveInfoCompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|
|completion|LiveInfoCompletionHandler?|Completion callback.|

### Live Operations

#### startLive

Start live (Host only).
``` kotlin
abstract fun startLive(
    liveInfo: LiveInfo,
    completion: LiveInfoCompletionHandler?
)
```

Host starts broadcasting. If the live room ID is new, a new live room will be created; if the live room ID already exists on the server, the host will join and start broadcasting.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|
|completion|LiveInfoCompletionHandler?|Completion callback.|

#### joinLive

Join live (Audience only).
``` kotlin
abstract fun joinLive(
    liveID: String?,
    completion: LiveInfoCompletionHandler?
)
```

Called by the audience to join an existing live room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String?|Live ID.|
|completion|LiveInfoCompletionHandler?|Completion callback.|

#### leaveLive

Leave live (Audience only).
``` kotlin
abstract fun leaveLive(completion: CompletionHandler?)
```

Called by the audience to leave the current live room.
If the host only needs to leave the room without dismissing it, this API can also be called.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionHandler?|Completion callback.|

#### endLive

End live (Host only).
``` kotlin
abstract fun endLive(completion: StopLiveCompletionHandler?)
```

Called by the host to end the current live and dismiss the room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|StopLiveCompletionHandler?|Completion callback.|

#### updateLiveInfo

Update live info.
``` kotlin
abstract fun updateLiveInfo(
    liveInfo: LiveInfo,
    modifyFlagList: List<LiveInfo.ModifyFlag>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|
|modifyFlag|List<LiveInfo.ModifyFlag>|Modify flag.|
|completion|CompletionHandler?|Completion callback.|

### Metadata Operations

#### queryMetaData

Query metadata.
``` kotlin
abstract fun queryMetaData(
    keys: List<String>,
    completion: MetaDataCompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keys|List<String>|Key list.|
|completion|MetaDataCompletionHandler?|Completion callback.|

#### updateLiveMetaData

Update live metadata.
``` kotlin
abstract fun updateLiveMetaData(
    metaData: HashMap<String, String>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|metaData|HashMap<String, String>|Metadata.|
|completion|CompletionHandler?|Completion callback.|

## Data Structures

### LiveState

Live state.

|**Enum Value**|**Description**|
|---------|---------|
|SCHEDULED|Scheduled.|
|RUNNING|Running.|
|SUSPENDED|Suspended.|

### TakeSeatMode

Take seat mode.

|**Enum Value**|**Description**|
|---------|---------|
|FREE|Free to take seat.|
|APPLY|Apply to take seat.|

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
|ENDED_BY_HOST|Ended by host.|
|ENDED_BY_SERVER|Ended by server.|

### LiveKickedOutReason

Kicked out of live room reason.

|**Enum Value**|**Description**|
|---------|---------|
|BY_ADMIN|Kicked out by admin.|
|BY_LOGGED_ON_OTHER_DEVICE|Logged on other device.|
|BY_SERVER|Kicked out by server.|
|FOR_NETWORK_DISCONNECTED|Network disconnected.|
|FOR_JOIN_ROOM_STATUS_INVALID_DURING_OFFLINE|Join room status invalid during offline.|
|FOR_COUNT_OF_JOINED_ROOMS_EXCEED_LIMIT|Count of joined rooms exceed limit.|

### LiveInfo

Live information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|liveName|String|Live name.|
|status|LiveState|Live status.|
|notice|String|Live notice.|
|isMessageDisable|Boolean|Whether message is disabled.|
|isPublicVisible|Boolean|Whether publicly visible.|
|keepOwnerOnSeat|Boolean|Whether to keep owner on seat.|
|seatMode|TakeSeatMode|Take seat mode.|
|seatTemplate|SeatLayoutTemplate|Seat layout template for simplifying seat configuration.|
|coverURL|String|Cover URL.|
|backgroundURL|String|Background URL.|
|categoryList|List<Int>|Category list.|
|activityStatus|Int|Activity status.|
|liveOwner|LiveUserInfo|Live owner info.|
|createTime|Long|Create time.|
|totalViewerCount|Int|Total viewer count.|
|isGiftEnabled|Boolean|Whether gift is enabled.|
|metaData|Map<String, String>|Metadata.|
|isSeatEnabled|Boolean|Whether seat is enabled.|
|maxSeatCount|Int|Maximum seat count.|
|seatLayoutTemplateID|Int|Seat layout template ID.|

### LiveListState

Live list state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveList|StateFlow<List<LiveInfo>>|Live list.|
|liveListCursor|StateFlow<String>|Live list cursor.|
|currentLive|StateFlow<LiveInfo>|Current live info.|

### LiveListListener

Live list events.

**Methods**

**onLiveEnded**: Live ended event.
``` kotlin
open fun onLiveEnded(liveID: String, reason: LiveEndedReason, message: String) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveEndedReason|Ended reason.|
|message|String|Message.|

**onKickedOutOfLive**: Kicked out of live room event.
``` kotlin
open fun onKickedOutOfLive(liveID: String, reason: LiveKickedOutReason, message: String) {}
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveKickedOutReason|Kicked out reason.|
|message|String|Message.|

### LiveInfoCompletionHandler

Live info completion callback interface.

**Methods**

**onSuccess**: Success callback.
``` kotlin
fun onSuccess(liveInfo: LiveInfo)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|

**onFailure**: Failure callback.
``` kotlin
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

### StopLiveCompletionHandler

Stop live completion callback interface.

**Methods**

**onSuccess**: Success callback.
``` kotlin
fun onSuccess(statisticsData: TUILiveListManager.LiveStatisticsData)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|statisticsData|TUILiveListManager.LiveStatisticsData|Live statistics data.|

**onFailure**: Failure callback.
``` kotlin
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

### MetaDataCompletionHandler

Metadata completion callback interface.

**Methods**

**onSuccess**: Success callback.
``` kotlin
fun onSuccess(metaData: HashMap<String, String>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|metaData|HashMap<String, String>|Metadata.|

**onFailure**: Failure callback.
``` kotlin
fun onFailure(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

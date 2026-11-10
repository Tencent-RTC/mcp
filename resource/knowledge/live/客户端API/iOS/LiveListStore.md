---
sync_node_id: '203640161685745664'
nav_path:
  - "直播与语聊 SDK"
  - "客户端 API"
  - "iOS"
  - "LiveListStore"
product: "live"
---
## Introduction

`LiveListStore` provides a complete set of live room management APIs, including starting live, joining live, leaving live, ending live and other functions. Through this class, you can manage the lifecycle of live rooms. The host calls startLive/endLive to start and dismiss a live room, while the audience calls joinLive/leaveLive to join and leave a live room.

> **Important:** 
> Use the **shared** singleton object to get the `LiveListStore` instance.
> 

> **Note:** 
> Live state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates of live data.
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
|liveList|[LiveInfo]|Live list.|
|liveListCursor|String|Live list cursor.|
|currentLive|LiveInfo|Current live info.|

## API List

|**Function**|**Description**|
|---------|---------|
|shared|Singleton object.|
|liveListEventPublisher|Live list event publisher.|
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

#### shared

Singleton object.

### Observing State and Events

#### liveListEventPublisher

Live list event publisher.

### Live List

#### fetchLiveList

Get live list.
``` swift
public func fetchLiveList(cursor: String,
                          count: Int,
                          completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|cursor|String|Cursor.|
|count|Int|Count.|
|completion|CompletionClosure?|Completion callback.|

#### fetchLiveInfo

Get live info.
``` swift
public func fetchLiveInfo(liveID: String,
                        completion: LiveInfoCompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|
|completion|LiveInfoCompletionClosure?|Completion callback.|

### Live Operations

#### startLive

Start live (Host only).
``` swift
public func startLive(_ liveInfo: LiveInfo,
                       completion: LiveInfoCompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

Host starts broadcasting. If the live room ID is new, a new live room will be created; if the live room ID already exists on the server, the host will join and start broadcasting.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|
|completion|LiveInfoCompletionClosure?|Completion callback.|

#### joinLive

Join live (Audience only).
``` swift
public func joinLive(liveID: String,
                     completion: LiveInfoCompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

Called by the audience to join an existing live room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|completion|LiveInfoCompletionClosure?|Completion callback.|

#### leaveLive

Leave live (Audience only).
``` swift
public func leaveLive(completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

Called by the audience to leave the current live room.
If the host only needs to leave the room without dismissing it, this API can also be called.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|CompletionClosure?|Completion callback.|

#### endLive

End live (Host only).
``` swift
public func endLive(completion: StopLiveCompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

Called by the host to end the current live and dismiss the room.

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|completion|StopLiveCompletionClosure?|Completion callback.|

#### updateLiveInfo

Update live info.
``` swift
public func updateLiveInfo(_ liveInfo: LiveInfo,
                           modifyFlag: LiveInfo.ModifyFlag,
                           completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveInfo|LiveInfo|Live info.|
|modifyFlag|LiveInfo.ModifyFlag|Modify flag.|
|completion|CompletionClosure?|Completion callback.|

### Metadata Operations

#### queryMetaData

Query metadata.
``` swift
public func queryMetaData(keys: [String], completion: MetaDataCompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|keys|[String]|Key list.|
|completion|MetaDataCompletionClosure?|Completion callback.|

#### updateLiveMetaData

Update live metadata.
``` swift
public func updateLiveMetaData(_ metaData: [String: String],
                               completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|metaData|[String: String]|Metadata.|
|completion|CompletionClosure?|Completion callback.|

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
|videoDynamicGrid9Seats|Portrait dynamic 9-grid layout for video live streaming.|
|videoDynamicFloat7Seats|Portrait dynamic 1v6 floating layout for video live streaming.|
|videoLeftFocus9Seats|Portrait left focus 9-grid layout for video live streaming.|
|videoUniformGrid9Seats|Portrait uniform 9-grid layout for video live streaming.|
|videoFixedGrid9Seats|Portrait static 9-grid layout for video live streaming.|
|videoFixedFloat7Seats|Portrait static 1v6 floating layout for video live streaming.|
|videoLandscape4Seats|Landscape layout with 1 video seat and 3 audio seats for video live streaming.|
|videoLandscape10Seats|Landscape layout with 1 video seat and 9 audio seats for video live streaming.|
|videoPortrait10Seats|Portrait layout with 1 video seat and 9 audio seats for video live streaming.|
|karaoke|Audio KTV layout for karaoke scenes with configurable seat count.|
|audioSalon|Audio salon layout for voice chat scenes with configurable seat count.|

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
|isMessageDisable|Bool|Whether message is disabled.|
|isPublicVisible|Bool|Whether publicly visible.|
|keepOwnerOnSeat|Bool|Whether to keep owner on seat.|
|seatMode|TakeSeatMode|Take seat mode.|
|seatTemplate|SeatLayoutTemplate|Seat layout template for simplifying seat configuration.|
|coverURL|String|Cover URL.|
|backgroundURL|String|Background URL.|
|categoryList|[NSNumber]|Category list.|
|activityStatus|Int|Activity status.|
|liveOwner|LiveUserInfo|Live owner info.|
|createTime|Int|Create time.|
|totalViewerCount|Int|Total viewer count.|
|isGiftEnabled|Bool|Whether gift is enabled.|
|metaData|[String: String]|Metadata.|
|isSeatEnabled|Bool|Whether seat is enabled.|
|maxSeatCount|Int|Maximum seat count.|
|seatLayoutTemplateID|UInt|Seat layout template ID.|

### LiveListState

Live list state.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|liveList|[LiveInfo]|Live list.|
|liveListCursor|String|Live list cursor.|
|currentLive|LiveInfo|Current live info.|

### LiveListListener

Live list events.

**Methods**

**onLiveEnded**: Live ended event.
``` swift
case onLiveEnded(liveID: String, reason: LiveEndedReason, message: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveEndedReason|Ended reason.|
|message|String|Message.|

**onKickedOutOfLive**: Kicked out of live room event.
``` swift
case onKickedOutOfLive(liveID: String, reason: LiveKickedOutReason, message: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live ID.|
|reason|LiveKickedOutReason|Kicked out reason.|
|message|String|Message.|

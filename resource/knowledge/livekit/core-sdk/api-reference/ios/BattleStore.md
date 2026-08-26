## Introduction

PK feature enables real-time interactive battles between hosts. `BattleStore` provides a comprehensive set of APIs to manage the entire PK lifecycle.

> **Important:**
> Always use the factory method **create(liveID:)** with a valid live room ID to create a `BattleStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> PK state updates are delivered through the **state** publisher. Subscribe to it to receive real-time updates about PK information, participating users, and scores.
>

> **Warning:**
> If a PK request does not receive a response within the specified timeout, a timeout event will be triggered. Always handle timeout scenarios in the UI.
>

## Features
- **PK Request Management**: Hosts can initiate PK requests, and invitees can accept or reject.

- **State Management**: Real-time tracking of PK information, participating users, and scores.

- **Event-Driven Architecture**: Provides complete PK event callbacks.

- **Timeout Handling**: Built-in timeout mechanism for PK requests.

## Subscribable Data

**BattleState** fields are described below:

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|currentBattleInfo|BattleInfo?|Current PK information.|
|battleUsers|[SeatUserInfo]|PK user list.|
|battleScore|[String: UInt]|PK score mapping.|

## API List

|**Function**|**Description**|
|---------|---------|
|create|Create BattleStore instance.|
|battleEventPublisher|PK event publisher.|
|requestBattle|Initiate PK request.|
|cancelBattleRequest|Cancel PK request.|
|acceptBattle|Accept PK request.|
|rejectBattle|Reject PK request.|
|exitBattle|Exit PK.|

### Creating Instance

#### create

Create BattleStore instance.
``` swift
public static func create(liveID: String) -> BattleStore {
    let store: BattleStoreImpl = StoreFactory.shared.getStore(roomID: liveID)
    return store
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|liveID|String|Live room ID.|

### Observing State and Events

#### battleEventPublisher

PK event publisher.

PK event publisher.

**Data Structures：**BattleEvent

### PK Operations

#### requestBattle

Initiate PK request.
``` swift
public func requestBattle(config: BattleConfig, userIDList: [String], timeout: TimeInterval, completion: BattleRequestClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|config|BattleConfig|PK configuration.|
|userIDList|[String]|List of user IDs to invite for PK. Please pass in the user IDs of the other hosts you wish to PK with. Note: do not include the current user's own ID in this list.|
|timeout|TimeInterval|Timeout in seconds. The maximum limit is 30 seconds.|
|completion|BattleRequestClosure?|Callback for successful request initiation.|

#### cancelBattleRequest

Cancel PK request.
``` swift
public func cancelBattleRequest(battleId: String, userIdList: [String], completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleId|String|PK ID.|
|userIdList|[String]|User ID list.|
|completion|CompletionClosure?|Callback for successful cancellation.|

#### acceptBattle

Accept PK request.
``` swift
public func acceptBattle(battleID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|completion|CompletionClosure?|Callback for successful acceptance.|

#### rejectBattle

Reject PK request.
``` swift
public func rejectBattle(battleID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|completion|CompletionClosure?|Callback for successful rejection.|

#### exitBattle

Exit PK.
``` swift
public func exitBattle(battleID: String, completion: CompletionClosure?) {
    fatalError("\(#function) must be overridden by subclass")
}
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|completion|CompletionClosure?|Callback for successful exit.|

## Data Structures

### BattleEndedReason

Reason for PK ending received by users in an ongoing PK.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|timeOver|0|PK countdown ended.|
|allMemberExit|1|All PK members exited.|

### BattleEvent

PK-related callback events received.

|**Enum Value**|**Description**|
|---------|---------|
|onBattleStarted|This callback is triggered when PK officially starts, notifying all participants that PK has begun.|
|onBattleEnded|This callback is triggered when PK ends.|
|onUserJoinBattle|This callback is triggered when a user joins PK.|
|onUserExitBattle|This callback is triggered when a user exits PK.|
|onBattleRequestReceived|This callback is triggered when a PK request is received.|
|onBattleRequestCancelled|This callback is triggered when a PK request is cancelled.|
|onBattleRequestTimeout|This callback is triggered when a PK request times out.|
|onBattleRequestAccept|This callback is triggered when a PK request is accepted.|
|onBattleRequestReject|This callback is triggered when a PK request is rejected.|

### BattleConfig

PK configuration information set when sending a PK request.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|duration|TimeInterval|PK duration (unit: seconds).|
|needResponse|Bool|Whether the invitee needs to reply with accept/reject.|
|extensionInfo|String|Extension information.|

### BattleInfo

PK information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|config|BattleConfig|PK configuration information set when sending a PK request.|
|startTime|UInt|PK start marker timestamp (unit: seconds).|
|endTime|UInt|PK end marker timestamp (unit: seconds).|

### BattleState

PK-related state data provided by BattleStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|currentBattleInfo|BattleInfo?|Current PK information.|
|battleUsers|[SeatUserInfo]|PK user list.|
|battleScore|[String: UInt]|PK score mapping.|

### BattleRequestCallback

PK request callback.

Callback interface for PK requests, used to handle success or failure results of PK requests.

**Methods**

**onSuccess**: Success callback.
``` swift
fun onSuccess(battleInfo: BattleInfo, resultMap: Map<String, Int>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleInfo|BattleInfo|PK information, containing detailed configuration and status of the PK.|
|resultMap|Map<String, Int>|Response result callback for PK request.|

**onError**: Failure callback.
``` swift
fun onError(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

## Usage Example
``` swift
// Create store instance
let store = BattleStore.create(liveID: "live_room_123")
// Subscribe to state changes
store.state.subscribe { state in
    if let battleInfo = state.currentBattleInfo {
        print("Current PK ID: \(battleInfo.battleID)")
    }
    print("PK user count: \(state.battleUsers.count)")
}
// Subscribe to PK events
store.battleEventPublisher.sink { event in
    switch event {
    case .onBattleStarted(let battleInfo, let inviter, let invitees):
        print("PK started, initiator: \(inviter.userName)")
    case .onBattleEnded(let battleInfo, let reason):
        print("PK ended, reason: \(reason)")
    default:
        break
    }
}
// Initiate PK request
let config = BattleConfig(duration: 300, needResponse: true)
store.requestBattle(config: config, userIDList: ["user_456"], timeout: 30) { result in
    switch result {
    case .success(let (battleInfo, resultMap)):
        print("PK request successful: \(battleInfo.battleID)")
    case .failure(let error):
        print("PK request failed: \(error)")
    }
}
```

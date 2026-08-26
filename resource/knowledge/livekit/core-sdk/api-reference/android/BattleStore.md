## Introduction

PK feature enables real-time interactive battles between hosts. `BattleStore` provides a comprehensive set of APIs to manage the entire PK lifecycle.

> **Important:**
> Always use the factory method **BattleStore.create** with a valid live room ID to create a `BattleStore` instance. Do not attempt to initialize directly.
>

> **Note:**
> PK state updates are delivered through the **battleState** publisher. Subscribe to it to receive real-time updates about PK information, participating users, and scores.
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
|currentBattleInfo|StateFlow<BattleInfo?>|Current PK information.|
|battleUsers|StateFlow<List<SeatUserInfo>>|PK user list.|
|battleScore|StateFlow<Map<String, Int>>|PK score mapping.|

## API List

|**Function**|**Description**|
|---------|---------|
|BattleStore.create|Create BattleStore instance.|
|addBattleListener|PK event callbacks.|
|removeBattleListener|PK event callbacks.|
|requestBattle|Initiate PK request.|
|cancelBattleRequest|Cancel PK request.|
|acceptBattle|Accept PK request.|
|rejectBattle|Reject PK request.|
|exitBattle|Exit PK.|

### Creating Instance

#### BattleStore.create

Create BattleStore instance.

### Observing State and Events

#### addBattleListener

Add PK callback listener.
``` kotlin
abstract fun addBattleListener(listener: BattleListener?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BattleListener?|Listener.|

#### removeBattleListener

Remove PK callback listener.
``` kotlin
abstract fun removeBattleListener(listener: BattleListener?)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BattleListener?|Listener.|

### PK Operations

#### requestBattle

Initiate PK request.
``` kotlin
abstract fun requestBattle(
    config: BattleConfig,
    userIDList: List<String>,
    timeout: Int,
    completion: BattleRequestCallback?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|config|BattleConfig|PK configuration.|
|userIDList|List<String>|List of user IDs to invite for PK. Please pass in the user IDs of the other hosts you wish to PK with. Note: do not include the current user's own ID in this list.|
|timeout|Int|Timeout in seconds. The maximum limit is 30 seconds.|
|completion|BattleRequestCallback?|Callback for successful request initiation.|

#### cancelBattleRequest

Cancel PK request.
``` kotlin
abstract fun cancelBattleRequest(
    battleID: String?,
    userIDList: List<String>,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String?|PK ID.|
|userIDList|List<String>|User ID list.|
|completion|CompletionHandler?|Callback for successful cancellation.|

#### acceptBattle

Accept PK request.
``` kotlin
abstract fun acceptBattle(
    battleID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String?|PK ID.|
|completion|CompletionHandler?|Callback for successful acceptance.|

#### rejectBattle

Reject PK request.
``` kotlin
abstract fun rejectBattle(
    battleID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String?|PK ID.|
|completion|CompletionHandler?|Callback for successful rejection.|

#### exitBattle

Exit PK.
``` kotlin
abstract fun exitBattle(
    battleID: String?,
    completion: CompletionHandler?
)
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String?|PK ID.|
|completion|CompletionHandler?|Callback for successful exit.|

## Data Structures

### BattleEndedReason

Reason for PK ending received by users in an ongoing PK.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|TIME_OVER|0|PK countdown ended.|
|ALL_MEMBER_EXIT|1|All PK members exited.|

### BattleListener

PK-related callback events received.

**Methods**

|**Method**|**Description**|
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
|duration|Int|PK duration (unit: seconds).|
|needResponse|Boolean|Whether the invitee needs to reply with accept/reject.|
|extensionInfo|String|Extension information.|

### BattleInfo

PK information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|config|BattleConfig|PK configuration information set when sending a PK request.|
|startTime|Long|PK start marker timestamp (unit: seconds).|
|endTime|Long|PK end marker timestamp (unit: seconds).|

### BattleState

PK-related state data provided by BattleStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|currentBattleInfo|StateFlow<BattleInfo?>|Current PK information.|
|battleUsers|StateFlow<List<SeatUserInfo>>|PK user list.|
|battleScore|StateFlow<Map<String, Int>>|PK score mapping.|

### BattleRequestCallback

PK request callback.

Callback interface for PK requests, used to handle success or failure results of PK requests.

**Methods**

**onSuccess**: Success callback.
``` kotlin
fun onSuccess(battleInfo: BattleInfo, resultMap: Map<String, Int>)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleInfo|BattleInfo|PK information, containing detailed configuration and status of the PK.|
|resultMap|Map<String, Int>|Response result callback for PK request.|

**onError**: Failure callback.
``` kotlin
fun onError(code: Int, desc: String)
```

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|code|Int|Error code.|
|desc|String|Error description.|

## Usage Example
``` kotlin
// Create store instance
val store = BattleStore.create("live_room_123")
// Subscribe to state changes
lifecycleScope.launch {
    store.battleState.currentBattleInfo.collect { battleInfo ->
        battleInfo?.let {
            println("Current PK ID: ${it.battleID}")
        }
    }
}
// Add PK event listener
store.addBattleListener(object : BattleListener() {
    override fun onBattleStarted(battleInfo: BattleInfo, inviter: SeatUserInfo, invitees: List<SeatUserInfo>) {
        println("PK started, initiator: ${inviter.userName}")
    }
    override fun onBattleEnded(battleInfo: BattleInfo, reason: BattleEndedReason?) {
        println("PK ended, reason: $reason")
    }
})
// Initiate PK request
val config = BattleConfig(duration = 300, needResponse = true)
store.requestBattle(config, listOf("user_456"), 30, object : BattleRequestCallback {
    override fun onSuccess(battleInfo: BattleInfo, resultMap: Map<String, Int>) {
        println("PK request successful: ${battleInfo.battleID}")
    }
    override fun onError(code: Int, desc: String) {
        println("PK request failed: $desc")
    }
})
```

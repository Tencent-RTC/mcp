## Introduction

PK feature enables real-time interactive battles between hosts. `BattleStore` provides a comprehensive set of APIs to manage the entire PK lifecycle.

> **Important:**
> Always use the factory method **create(liveID:)** with a valid live room ID to create a `BattleStore` instance. Do not attempt to initialize directly.
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
|currentBattleInfo|ValueListenable<BattleInfo?>|Current PK information.|
|battleUsers|ValueListenable<List<SeatUserInfo>>|PK user list.|
|battleScore|ValueListenable<Map<String, int>>|PK score mapping.|

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
``` dart
void addBattleListener(BattleListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BattleListener|Listener.|

#### removeBattleListener

Remove PK callback listener.
``` dart
void removeBattleListener(BattleListener listener);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|listener|BattleListener|Listener.|

### PK Operations

#### requestBattle

Initiate PK request.
``` dart
Future<BattleRequestCompletionHandler> requestBattle({
    required BattleConfig config,
    required List<String> userIDList,
    required int timeout,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|config|BattleConfig|PK configuration.|
|userIDList|List<String>|List of user IDs to invite for PK. Please pass in the user IDs of the other hosts you wish to PK with. Note: do not include the current user's own ID in this list.|
|timeout|int|Timeout in seconds. The maximum limit is 30 seconds.|

#### cancelBattleRequest

Cancel PK request.
``` dart
Future<CompletionHandler> cancelBattleRequest({
    required String battleID,
    required List<String> userIDList,
});
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|userIDList|List<String>|User ID list.|

#### acceptBattle

Accept PK request.
``` dart
Future<CompletionHandler> acceptBattle(String battleID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|

#### rejectBattle

Reject PK request.
``` dart
Future<CompletionHandler> rejectBattle(String battleID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|

#### exitBattle

Exit PK.
``` dart
Future<CompletionHandler> exitBattle(String battleID);
```

**Version**

Supported since version 3.5.

**Parameters**

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|

## Data Structures

### BattleEndedReason

Reason for PK ending received by users in an ongoing PK.

|**Enum Value**|**Value**|**Description**|
|---------|---------|---------|
|timeOver|0|PK countdown ended.|
|allMemberExit|1|All PK members exited.|

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
|duration|int|PK duration (unit: seconds).|
|needResponse|bool|Whether the invitee needs to reply with accept/reject.|
|extensionInfo|String|Extension information.|

### BattleInfo

PK information.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|battleID|String|PK ID.|
|config|BattleConfig|PK configuration information set when sending a PK request.|
|startTime|int|PK start marker timestamp (unit: seconds).|
|endTime|int|PK end marker timestamp (unit: seconds).|

### BattleState

PK-related state data provided by BattleStore.

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|currentBattleInfo|ValueListenable<BattleInfo?>|Current PK information.|
|battleUsers|ValueListenable<List<SeatUserInfo>>|PK user list.|
|battleScore|ValueListenable<Map<String, int>>|PK score mapping.|

### BattleRequestCompletionHandler

PK request completion handler.

Completion handler for PK requests in Dart, containing the result of the PK request.

**Properties**

|**Property**|**Type**|**Description**|
|---------|---------|---------|
|battleInfo|BattleInfo?|PK information returned on success.|
|resultMap|Map<String, int>?|Response result mapping for PK request.|

## Usage Example
``` dart
// Create store instance
final store = BattleStore.create('live_room_123');
// Define listeners
late final VoidCallback battleInfoListener = _onBattleInfoChanged;
late final VoidCallback battleUsersListener = _onBattleUsersChanged;
void _onBattleInfoChanged() {
    final battleInfo = store.battleState.currentBattleInfo.value;
    if (battleInfo != null) {
        print('Current PK ID: ${battleInfo.battleID}');
    }
}
void _onBattleUsersChanged() {
    print('PK user count: ${store.battleState.battleUsers.value.length}');
}
// Subscribe to state changes
store.battleState.currentBattleInfo.addListener(battleInfoListener);
store.battleState.battleUsers.addListener(battleUsersListener);
// Add PK event listener
final battleListener = BattleListener(
    onBattleStarted: (battleInfo, inviter, invitees) {
        print('PK started, initiator: ${inviter.userName}');
    },
    onBattleEnded: (battleInfo, reason) {
        print('PK ended, reason: $reason');
    },
);
store.addBattleListener(battleListener);
// Initiate PK request
final config = BattleConfig(duration: 300, needResponse: true);
final result = await store.requestBattle(
    config: config,
    userIDList: ['user_456'],
    timeout: 30,
);
if (result.code == 0) {
    print('PK request successful: ${result.battleInfo?.battleID}');
} else {
    print('PK request failed: ${result.message}');
}
// Unsubscribe when done
store.battleState.currentBattleInfo.removeListener(battleInfoListener);
store.battleState.battleUsers.removeListener(battleUsersListener);
store.removeBattleListener(battleListener);
```

`AtomicXCore` provides two core modules: `CoHostStore` for **cross-room connections** and `BattleStore` for **PK battles**. This guide explains how to integrate these modules to enable connection and PK features in a voice chat room application.

## Core Concepts

|**Key Concept**|**Type**|**Core Responsibilities & Description**|
|---------|---------|---------|
|**CoHostStore**|`class`|Manages the lifecycle of co-hosting between streamers, providing APIs for co-hosting (requestHostConnection, acceptHostConnection).|
|**BattleStore**|`class`|Handles signaling and state management for cross-room PK battles, including PK status.|
|**LiveListStore**|`class`|Fetches the list of live rooms (`fetchLiveList`), enabling discovery of other rooms available for co-hosting.|
|**LiveSeatStore**|`class`|Manages the status of all seats in a room (including cross-room seats during co-hosting), tracks users joining/leaving seats and microphone status.|
|**CoHostLayoutTemplate**|`enum`|Defines seat layout templates for co-hosting, such as `.hostStaticVoice6v6`.|
|**BattleConfig**|`struct`|Configures PK details, including PK duration (`duration`) and whether a response (`needResponse`) is required.|

## Prerequisites

Integrate the Quick Start and ensure you have implemented both **streamer start live** and **audience watch** features.

## Streamer Initiates a Co-hosting Session

### Step 1: Fetch Active Streamers

To initiate co-hosting or PK, fetch the current list of live rooms and select a target streamer.

**Implementation:** Call `LiveListStore.shared.fetchLiveList`.

> **Note：**
> - If the desired live room is missing from the list, verify that the isPublicVisible field in TUILiveInfo was set to true when starting the stream.
> - This API supports pagination. Use the cursor from the `Result` is `.success` callback for subsequent requests. If the returned cursor is empty, all rooms have been fetched.
> - For optimal performance, set count to 20.

``` swift
import AtomicXCore

func fetchLiveListForCoHost() {
    var cursor = "" // Initial fetch, cursor is empty
    let count = 20  // Fetch 20 items per request
    let liveListStore = LiveListStore.shared
    liveListStore.fetchLiveList(cursor: cursor, count: count, completion: { [weak self] result in
        guard let self = self else { return }
        switch result {
            case .success:
                print("Live room list fetched successfully")
                // The live room list is updated in LiveListStore.shared.state.value.liveList.
                // Update the co-host invitation panel with the recommended users.
                // inviteAdapter.submitList(LiveListStore.shared.state.value.liveList)
            case .failure(let error):
                print("Failed to fetch live room list: \(error.code), \(error.message)")
        }
    })
}
```

### Step 2: Send a Co-hosting Invitation

After selecting a target streamer, use `CoHostStore.requestHostConnection` to send a co-hosting invitation.

> **Note：**
> - AtomicXCore supports up to 9 rooms for cross-room co-hosting, with 50 users per room.
> - The API supports batch invitations. To check if an invitation to a single room was successful, you need to check if the `Result` is `.success` in the completion callback.
> - The API accepts extension fields. After the invitation is sent, this field is delivered to the target streamer via the `onCoHostRequestReceived` callback. Use it to pass custom business data, such as "start PK immediately".

``` swift
import AtomicXCore

let targetHostLiveID = "target_host_room_id"
let layoutTemplate = .hostStaticVoice6v6
let timeout: TimeInterval = 10 // Invitation timeout (seconds)
let extraInfo: String = "" // Custom business info, e.g., for direct PK

coHostStore.requestHostConnection(
    targetHost: targetHostLiveID,
    layoutTemplate: layoutTemplate,
    timeout: timeout,
    extraInfo: extraInfo,
    completion: { [weak self] result in
        guard let self = self else { return }
        switch result {
            case .success():
                print("Invitation sent successfully")
            case .failure(let error):
                print("Failed to send invitation: \(error.code), \(error.message)")
        }
    }
)
```

### Step 3: Target Streamer Receives Invitation

Once the invitation is sent, the target streamer receives the `onCoHostRequestReceived` event from `CoHostEventPublisher`. Listen for this event to display a UI prompt, such as "Streamer invites you to join co-hosting".
``` swift
var coHostStore: CoHostStore {
    return CoHostStore.create(liveID: liveID)
}

coHostStore.coHostEventPublisher
    .receive(on: RunLoop.main)
    .sink { [weak self] event in
        guard let self = self else { return }
        switch event {
            case .onCoHostRequestReceived(let inviter, let extensionInfo):
                // Handle co-hosting invitation
            default:
                break
        }
    }.store(in: &cancellableSet)
```

### Step 4: Target Streamer Accepts or Rejects Invitation

On the UI, the target streamer can accept or reject the invitation using `acceptHostConnection` or `rejectHostConnection`.
``` swift
import AtomicXCore
import Combine

private var cancellableSet: Set<AnyCancellable> = []

var coHostStore: CoHostStore {
    return CoHostStore.create(liveID: liveID)
}

coHostStore.coHostEventPublisher
    .receive(on: RunLoop.main)
    .sink { [weak self] event in
        guard let self = self else { return }
        switch event {
            case .onCoHostRequestReceived(let inviter, let extensionInfo):
                // Accept co-hosting request
                coHostStore.acceptHostConnection(fromHostLiveID: inviter.liveID) { [weak self] result in
                    guard let self = self else { return }
                    switch result {
                        case .success():
                            // Accepted
                        case .failure(let error):
                            // Handle error
                    }
                }
                // To reject:
                // coHostStore.rejectHostConnection(fromHostLiveID: inviter.liveID) { ... }
            default:
                break
        }
    }.store(in: &cancellableSet)
```

### Step 5: Render Co-hosting UI Layout

Once co-hosting is established, listen to `CoHostStore.coHostState.connected` and `LiveSeatStore.liveSeatState.seatList` to update the seat layout dynamically.
``` swift
import AtomicXCore
import Combine

private var cancellableSet: Set<AnyCancellable> = []

var liveSeatStore: LiveSeatStore {
    return LiveSeatStore.create(liveID: liveID)
}

// Listen for co-hosting state
coHostStore.state.subscribe(StatePublisherSelector(keyPath: \CoHostState.connected))
    .receive(on: RunLoop.main)
    .dropFirst()
    .sink { [weak self] connected in
        guard let self = self else { return }
        // If connected > 0, host is in co-hosting state
    }
    .store(in: &cancellableSet)

// Listen for seat info to refresh avatars, mute status, etc.
liveSeatStore.state.subscribe(StatePublisherSelector(keyPath: \LiveSeatState.seatList))
    .removeDuplicates()
    .receive(on: RunLoop.main)
    .sink { [weak self] seatList in
        guard let self = self else { return }
        // Use seatInfo.userInfo.liveID to distinguish local/remote users
        // Use seatInfo.userInfo.microphoneStatus for mute icon
    }
    .store(in: &cancellableSet)
```

### Step 6: Invite Additional Streamers During Co-hosting

You can invite more streamers to join co-hosting at any time by calling `requestHostConnection` again.
``` swift
import AtomicXCore

let targetHostLiveID = "target_host_room_id"
let layoutTemplate = .hostStaticVoice6v6
let timeout: TimeInterval = 10
let extraInfo: String = ""

coHostStore.requestHostConnection(
    targetHost: targetHostLiveID,
    layoutTemplate: layoutTemplate,
    timeout: timeout,
    extraInfo: extraInfo,
    completion: { [weak self] result in
        guard let self = self else { return }
        switch result {
            case .success():
                print("Invitation sent successfully")
            case .failure(let error):
                print("Failed to send invitation: \(error.code), \(error.message)")
        }
    }
)
```

### Step 7: Exit Co-hosting

To exit co-hosting, call `exitHostConnection`. Other streamers in the session will receive updated seat information and should change their layouts.
``` swift
func onExitButtonClicked() {
    coHostStore.exitHostConnection() { [weak self] result in
        guard let self = self else { return }
        switch result {
            case .success():
                // Exited co-hosting
            case .failure(let error):
                // Handle error
        }
    }
}
```

PK Streamer Initiates a PK BattleStreamers can start PK battles using two main flows, depending on the room state before PK begins:

|**PK Mode**|**Room State (Before PK)**|**Room State (After PK)**|
|---------|---------|---------|
|**Scenario 1: PK after co-hosting**|Both sides **already co-hosting**|Return to co-hosting state|
|**Scenario 2: Co-hosting with PK mode**|Both sides **not co-hosting**|Return to co-hosting state|

### Scenario 1: PK After Co-hosting

**AtomicXCore** enables timed PK battles between co-hosted streamers. The typical flow:
1. Send co-hosting invitation; target streamer accepts.

2. Co-hosted streamers click `PK` to start a timed battle. Winner is determined by the gifts received.

3. Target streamer receives a PK prompt and can accept or decline.

4. Upon acceptance, PK mode starts, and a progress bar displays metrics (gifts, likes, etc.).

5. When PK time ends, results are shown and a penalty phase may follow.

6. After PK, the session returns to co-hosting.

#### Step 1: Initiate PK Invitation

While co-hosting, call `BattleStore.requestBattle` to send a PK invitation. Configure PK duration, whether acceptance is required, and any extension info.

> **Note：**
> - If duration is not set, PK defaults to 5 minutes.
> - To skip target acceptance, set needResponse to false in BattleConfig. PK starts immediately.
> - If needResponse is false, set timeout to 0.
> - If a timeout is set and not accepted in time, both inviter and invitee receive onBattleRequestTimeout. Co-hosted streamers can initiate another PK.

``` swift
var battleStore: BattleStore {
    return BattleStore.create(liveID: liveID)
}
let targetUserID = ""

let config = BattleConfig(
    duration: 30, // PK duration in seconds
    needResponse: true, // Target must accept
    extensionInfo: ""
)
battleStore.requestBattle(config: config, userIDList: [targetUserID], timeout: 10) { [weak self] result in
    guard let self = self else { return }
    switch result {
        case .success(let (battleInfo, _)):
            // PK started
        case .failure(_):
            // Handle error
    }
}
```

#### Step 2: Target Streamer Receives PK Invitation

The target streamer receives the `onBattleRequestReceived` event from `BattleEventPublisher`. Use this event to prompt the target in the UI.
``` swift
battleStore.battleEventPublisher
    .receive(on: RunLoop.main)
    .sink { [weak self] event in
        guard let self = self else { return }
        switch event {
            case .onBattleRequestReceived(let battleID, let inviter, let invitee):
                // Handle PK invitation
            default:
                break
        }
    }
    .store(in: &cancellableSet)
```

#### Step 3: Enter PK State

When you receive the `onBattleStarted` event, render the PK progress bar in the UI.
- If `needResponse` is `false`, PK starts automatically after sending the invitation.

- If `needResponse` is `true`, PK starts only after all targets call `acceptBattle`.

- When a target accepts, all PK participants receive `onUserJoinBattle`.

- When PK begins, all participants receive `onBattleStarted`.

#### Step 4: End PK State

PK can end in two ways:
1. **PK Time Expires：**When the configured duration ends, all participants receive `onBattleEnded`.

2. **Manual Exit：**Any participant can call `exitBattle` to leave PK. Remaining users receive `onUserExitBattle`. If all participants exit before time ends, PK ends early.

   ``` swift
   var battleStore: BattleStore {
       return BattleStore.create(liveID: liveID)
   }
   guard let battleID = battleStore.state.value.currentBattleInfo?.battleID else { return }
   battleStore.exitBattle(battleID: battleID, completion: { [weak self] result in
       guard let self = self else { return }
       switch result {
           case .success():
               // Exited PK
           case .failure(let error):
               // Handle error
       }
   })
   ```

   After PK ends (`onBattleEnded`), display results and identify the winner/loser (see Winner Determination section).

   > **Note：**
   >
   > - After PK ends, the session returns to cross-room co-hosting.
   > - To end co-hosting after PK, call `exitHostConnection`.

### Scenario 2: Co-hosting with PK Mode

**AtomicXCore** supports direct PK initiation during a live session, without prior co-hosting. After PK ends, the session returns to the live room state.
1. Streamer clicks `PK`, opens a panel with active streamers (see Step 1 above).

2. Selects a streamer and sends a PK invitation.

3. Target streamer receives the invitation and can accept or reject.

4. Upon acceptance, PK starts automatically. Points are accumulated via gifts or likes.

5. After PK ends, the winner is determined by points.

   > **Note：**
   >
   > This flow requires both CoHostStore and BattleStore, with `BattleConfig.needResponse` set to `false`.
   >

#### Step 1: Send Co-hosting Request

Similar to previous steps, but set the`extraInfo` field in `requestHostConnection` to indicate PK should follow co-hosting. This enables custom UI prompts for the target streamer.

For example:
- `{"withPK:true"}` prompts "Streamer invites you to PK".

- `{"withPK:false"}` prompts "Streamer invites you to join cross-room co-hosting".

   ``` swift
   import AtomicXCore

   let targetHostLiveID = "target_host_room_id"
   let layoutTemplate = .hostStaticVoice6v6
   let timeout: TimeInterval = 10
   let extraInfo: String = "" // e.g., {"withPK:true"}

   coHostStore.requestHostConnection(
       targetHost: targetHostLiveID,
       layoutTemplate: layoutTemplate,
       timeout: timeout,
       extraInfo: extraInfo,
       completion: { [weak self] result in
           guard let self = self else { return }
           switch result {
               case .success():
                   print("Invitation sent successfully")
               case .failure(let error):
                   print("Failed to send invitation: \(error.code), \(error.message)")
           }
       }
   )
   ```

#### Step 2: Target Streamer Receives Request and Confirms

The target streamer receives `onCoHostRequestReceived` and can accept or reject the invitation.
``` swift
var coHostStore: CoHostStore {
    return CoHostStore.create(liveID: liveID)
}

coHostStore.coHostEventPublisher
    .receive(on: RunLoop.main)
    .sink { [weak self] event in
        guard let self = self else { return }
        switch event {
            case .onCoHostRequestReceived(let inviter, let extensionInfo):
                // Accept co-hosting request
                coHostStore.acceptHostConnection(fromHostLiveID: inviter.liveID) { [weak self] result in
                    guard let self = self else { return }
                    switch result {
                        case .success():
                            // Accepted
                        case .failure(let error):
                            // Handle error
                    }
                }
                // To reject:
                // coHostStore.rejectHostConnection(fromHostLiveID: inviter.liveID) { ... }
            default:
                break
        }
    }.store(in: &cancellableSet)
```

#### Step 3: Initiate PK Automatically

When the target streamer accepts, immediately call `BattleStore.requestBattle` with `needResponse: false` to start PK.
``` swift
import AtomicXCore

var coHostStore: CoHostStore {
    return CoHostStore.create(liveID: liveID)
}

coHostStore.coHostEventPublisher
    .receive(on: RunLoop.main)
    .sink { [weak self] event in
        guard let self = self else { return }
        switch event {
            case .onCoHostRequestAccepted(let invitee):
                let config = BattleConfig(duration: 30, needResponse: false, extensionInfo: "")
                battleStore.requestBattle(config: config, userIDList: [invitee.userID], timeout: 0) { [weak self] result in
                    guard let self = self else { return }
                    switch result {
                        case .success:
                            // PK started
                        case .failure(let error):
                            // Handle error
                    }
                }
            default:
                break
        }
    }.store(in: &cancellableSet)
```

#### Step 4: Enter PK State

This step is same as Enter PK State.

## PK Score Update and Winner Determination

### Updating PK Score via REST API

In typical **live host PK scenarios,** the value of gifts received by the host is linked to the PK score (for example, when a viewer sends a "Rocket" gift, the host's PK score increases by 500 points). You can implement real-time PK score updates using our `REST API`.

> **Note：**
> The PK score system in the LiveKit backend uses pure numeric calculation and accumulation. You must calculate the PK score according to your own business logic before calling the update API. See the following PK score calculation examples:
>

|Gift Type|Score Calculation Rule|Example|
|---------|---------|---------|
|Basic Gift|Gift value × 5|10 RMB gift → 50 points|
|Intermediate Gift|Gift value × 8|50 RMB gift → 400 points|
|Advanced Gift|Gift value × 12|100 RMB gift → 1200 points|
|Special Effect Gift|Fixed high score|520 RMB gift → 1314 points|

#### REST API Call Flow

#### Key Process Description
1. **Obtain PK Status:**

  - **Callback Configuration**: Configure PK Status Callback to have the `LiveKit` backend actively notify your system when PK starts or ends.

  - **Active Query**: Your backend can call the PK Status Query API at any time to check the current PK status.

2. **PK Score Calculation**: Your backend calculates the PK score increment based on your business rules.

3. **PK Score Update**: Your backend calls the Update PK Score API to update the PK score in the `LiveKit` backend.

4. **LiveKit Backend Syncs to Client**: The backend automatically synchronizes the updated PK score to all clients.

#### Involved REST API Endpoints

|**API**|**Function Description**|**Request Example**|
|---------|---------|---------|
|Active API - Query PK Status|Check whether the current room is in PK|Example|
|Active API - Update PK Score|Update the calculated PK score|Example|
|Callback Configuration - PK Start Callback|Receive real-time notification when PK starts|Example|
|Callback Configuration - PK End Callback|Receive real-time notification when PK ends|Example|

### Winner Determination

In PK scenarios, streamer scores are tied to gifts received. The PK module in RoomEngine supports score updates and broadcasting. Link gift events to PK scoring for real-time progress bar updates.

When your billing system detects a successful gift transaction, call the Modify PK Score REST API to update the streamer's PK score. All users in the PK rooms will see the updated `battleScore` in `BattleState`. Use this to update the PK progress bar.
``` swift
battleStore.state.subscribe(StatePublisherSelector(keyPath: \BattleState.battleScore))
    .receive(on: RunLoop.main)
    .sink { [weak self] battleScore in
        guard let self = self else { return }
        // Update PK progress bar here
    }
    .store(in: &cancellableSet)
```

## API Documentation

For complete API details, refer to the [AtomicXCore API documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore):

|**Store/Component**|**Function Description**|**API Documentation**|
|---------|---------|---------|
|**CoHostStore**|Core component for live stream display and interaction: handles video rendering, widget management, streamer live, audience mic-link, streamer co-hosting, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/cohoststore)|
|**BattleStore**|Manages the full lifecycle of live rooms: create, join, leave, destroy, query room list, modify live info, listen for live status changes.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/battlestore)|
|**LiveListStore**|Manages live room lifecycle: query room list, modify live info, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/liveliststore)|
|**LiveSeatStore**|Manages seat status: tracks all seats in the room (including cross-room seats during co-hosting), check user join/leave, microphone, seat status, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/liveseatstore)|

## FAQs

#### What are the maximum limits for co-hosted rooms and users during co-hosting or PK?

You can co-host up to 9 rooms, with up to 50 users per room.

#### How do I implement a penalty phase after PK loss?

After receiving the `onBattleEnded` callback from `battleEventPublisher`, use `battleScore` in `BattleState` to determine the winner and loser. Co-hosting continues after PK ends. Implement a custom 30-second penalty phase, then disconnect co-hosting after the countdown.

#### Why didn't the co-hosting invitation reach the other party?
- Ensure `targetHostLiveId` is correct and the target room is actively streaming.

- Check network connectivity; invitation signaling times out after 30 seconds.

#### What happens if a streamer disconnects or the app crashes during co-hosting or PK?

**CoHostStore** and **BattleStore** include heartbeat and timeout detection. If a participant exits by accident, the other party receives events such as **onCoHostUserLeft** or **onUserExitBattle**. Use these events to update the UI (e.g., "The other party has disconnected") and end the interaction.

#### Why can PK scores only be updated via REST API?

`REST API` ensures PK score **security, real-time performance, and scalability**:
- **Tamper-proof and fair**: Requires authentication and data verification; each update is traceable (e.g., gift event), prevents manual changes or cheating, and ensures fair competition.

- **Real-time multi-end sync**: Standardized formats (e.g., JSON) enable rapid integration with gift, PK, and display systems, keeping scores consistent and real-time across streamer, audience, and backend.

- **Flexible rule adaptation**: Backend configuration changes (e.g., gift-to-score mapping, bonus points) can be made without frontend updates, reducing iteration costs.

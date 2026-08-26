`LiveAudienceStore` is a module in `AtomicXCore` designed for managing audience information in live streaming rooms. With `LiveAudienceStore`, you can implement a comprehensive audience list and management system for your live streaming application.

## Core Features
- **Real-Time Audience List**: Fetch and display the list of users currently in the room.

- **Audience Statistics**: Get the real-time total viewer count.

- **Event Monitoring**: Listen for events when viewers join or leave the room.

- **Role Management**: The host can grant or revoke administrator privileges for viewers.

- **Room Management**: The host or administrator can remove specific viewers from the live room.

## Core Concepts
| <strong>Core Concept</strong> | <strong>Type</strong> | <strong>Core Responsibilities & Description</strong> |
| --- | --- | --- |
| <code>LiveUserInfo</code> | <code>class</code> | - Data model representing a viewer.<br>- Contains basic profile information such as userID, userName, and avatarURL. |
| <code>LiveAudienceState</code> | <code>struct</code> | - State container for the audience module.<br>- Exposes <code>audienceList</code> (StateFlow) for the real-time user list and <code>audienceCount</code> for the total viewer count. |
| <code>LiveAudienceEvent</code> | <code>enum</code> | - Event listener for audience changes.<br>- Provides callbacks like <code>.onAudienceJoined</code> and <code>.onAudienceLeft</code> to handle incremental list updates. |
| <code>LiveAudienceStore</code> | <code>class</code> | - Primary interface for audience management.<br>- Used to fetch list snapshots, perform admin operations (e.g., kicking users), and subscribe to real-time events. |

## Implementation

### Step 1: Component Integration
- **Video Live Streaming**: Please .

- **Voice Chat Room**: Please .

### Step 2: Initialize and Retrieve the Audience List

Get a `LiveAudienceStore` instance linked to the `liveId` and fetch the initial audience snapshot.
``` swift
import Foundation
import AtomicXCore
import Combine

class AudienceManager {
    private let liveId: String
    private let audienceStore: LiveAudienceStore
    private var cancellables = Set<AnyCancellable>()

    // Expose the [full] audience list publisher for UI layer subscription
    let audienceListPublisher = CurrentValueSubject<[LiveUserInfo], Never>([])
    // Expose the audience count publisher
    let audienceCountPublisher = PassthroughSubject<UInt, Never>()

    init(liveId: String) {
        self.liveId = liveId
        // 1. Get the LiveAudienceStore instance by liveId
        self.audienceStore = LiveAudienceStore.create(liveID: liveId)

        // 2. Subscribe to state and events
        subscribeToAudienceState()
        subscribeToAudienceEvents()

        // 3. Proactively fetch initial data for the first screen
        fetchInitialAudienceList()
    }

    /// Proactively fetch a snapshot of the audience list
    func fetchInitialAudienceList() {
        audienceStore.fetchAudienceList { [weak self] result in
            switch result {
            case .success:
                print("Successfully fetched the audience list for the first time")
                // On success, data will be automatically updated via the state subscription channel below
            case .failure(let error):
                print("Failed to fetch the audience list for the first time: \(error.localizedDescription)")
            }
        }
    }

    // ... subsequent code
}
```

### Step 3: Subscribe to State and Events

Observe the `audienceStore` state and listen for events to receive list snapshots and real-time join/leave updates
``` swift
extension AudienceManager {
    /// Subscribe to state to get audience count and list snapshot
    private func subscribeToAudienceState() {
        audienceStore.state
            .subscribe()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                // state.audienceList is a full snapshot
                self?.audienceListPublisher.send(state.audienceList)
                // state.audienceCount is the real-time total
                self?.audienceCountPublisher.send(state.audienceCount)
            }
            .store(in: &cancellables)
    }

    /// Subscribe to events to handle real-time audience join/leave
    private func subscribeToAudienceEvents() {
        audienceStore.liveAudienceEventPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] event in
                guard let self = self else { return }

                var currentList = self.audienceListPublisher.value

                switch event {
                case .onAudienceJoined(let newAudience):
                    print("Audience \(newAudience.userName) joined the live room")
                    // Incremental update: add the new audience member to the end of the current list
                    if !currentList.contains(where: { $0.userID == newAudience.userID }) {
                        currentList.append(newAudience)
                        self.audienceListPublisher.send(currentList)
                    }

                case .onAudienceLeft(let departedAudience):
                    print("Audience \(departedAudience.userName) left the live room")
                    // Incremental update: remove the departed audience member from the current list
                    currentList.removeAll { $0.userID == departedAudience.userID }
                    self.audienceListPublisher.send(currentList)
                }
            }
            .store(in: &cancellables)
    }
}
```

### Step 4: Manage Audience

As a host or administrator, you can manage viewers in the live room.

#### 4.1 Kick a Viewer Out of the Live Room

Call the `kickUserOutOfRoom` API to remove a specified user from the live room.
``` swift
extension AudienceManager {
    func kick(userId: String) {
        audienceStore.kickUserOutOfRoom(userID: userId) { result in
            switch result {
            case .success:
                print("Successfully kicked user \(userId) out of the room")
                // After a successful kick, you will receive an onAudienceLeft event
            case .failure(let error):
                print("Failed to kick user \(userId) out: \(error.localizedDescription)")
            }
        }
    }
}
```

#### 4.2 Manage Admin Roles

Use the `setAdministrator` and `revokeAdministrator` APIs to grant or revoke administrator privileges for a user.
``` swift
extension AudienceManager {
    /// Promote user to administrator
    func promoteToAdmin(userId: String) {
        audienceStore.setAdministrator(userID: userId) { result in
            if case .success = result {
                print("Successfully promoted user \(userId) to administrator")
            }
        }
    }

    /// Revoke user's administrator status
    func revokeAdmin(userId: String) {
        audienceStore.revokeAdministrator(userID: userId) { result in
            if case .success = result {
                print("Successfully revoked administrator status for user \(userId)")
            }
        }
    }
}
```

## Advanced Features

### Display Welcome Message on Entry

When a new audience member enters the live room, a welcome message is automatically displayed locally in the barrage/chat area, such as: `"Welcome [User Nickname] to the live room"`.

#### Implementation
1. Listen for Join Events: Observe the `LiveAudienceEvent.onAudienceJoined` callback in `LiveAudienceStore` to receive real-time notifications when a new user enters.

2. Insert Local Message: Upon triggering the event, extract the user's nickname and immediately call the `appendLocalTip` API in BarrageStore to insert the system message locally.

   ``` swift
   import Foundation
   import AtomicXCore
   import Combine

   class LiveRoomManager {
       private let liveId: String
       private let audienceManager: AudienceManager
       private let barrageManager: BarrageManager // Assume you have implemented BarrageManager as described in the barrage documentation
       private var cancellables = Set<AnyCancellable>()

       init(liveId: String) {
           self.liveId = liveId
           // Initialize two core managers
           self.audienceManager = AudienceManager(liveId: liveId)
           self.barrageManager = BarrageManager(liveId: liveId)

           // Set up linkage
           setupWelcomeMessageFlow()
       }

       private func setupWelcomeMessageFlow() {
           // 1. Get the LiveAudienceStore instance
           let audienceStore = LiveAudienceStore.create(liveID: self.liveId)

           // 2. Get the BarrageStore instance (thanks to internal mechanisms, this will be the same instance)
           let barrageStore = BarrageStore.create(liveID: self.liveId)

           // 3. Subscribe to audience events
           audienceStore.liveAudienceEventPublisher
               .receive(on: DispatchQueue.main)
               .sink { event in
                   // 4. Only handle audience join events
                   guard case .onAudienceJoined(let newAudience) = event else {
                       return
                   }

                   // 5. Create a local tip message
                   var welcomeTip = Barrage()
                   welcomeTip.messageType = .text
                   welcomeTip.textContent = "Welcome \(newAudience.userName) to the live room!"

                   // 6. Call BarrageStore's API to insert it into the barrage list
                   barrageStore.appendLocalTip(message: welcomeTip)
               }
               .store(in: &cancellables)
       }
   }
   ```

## API Documentation

For detailed information on all public interfaces, properties, and methods of [LiveAudienceStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/liveaudiencestore) and its related classes, refer to the official API documentation included with the [AtomicX Core](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore) framework. The relevant Stores used in this document are as follows:

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|LiveCoreView|Core view component for live video stream display and interaction: responsible for video stream rendering and view widget handling, supporting scenarios such as host streaming, audience co-hosting, and host-to-host connection.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/livecoreview)|
|LiveAudienceStore|Audience management: obtain real-time audience list (ID / name / avatar), count audience numbers, and listen for audience join/leave events.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/liveaudiencestore)|
|BarrageStore|Barrage feature: send text/custom barrage, maintain barrage list, and listen to barrage status in real time.|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/barragestore)|

## FAQs

### How is the online audience count (audienceCount) in LiveAudienceState updated? What are the timing and frequency?

The `audienceCount` is a high-precision estimate. Updates occur based on specific triggers and are subject to system frequency controls:
- **Active Entry/Exit (Immediate)**:When a user explicitly joins or leaves the room, the count updates immediately in `LiveAudienceState`.

- **Unexpected Disconnection (Delayed)**:If a user disconnects abnormally (e.g., app crash, network loss), the system uses a heartbeat mechanism to verify status. The user is marked offline only after 90 seconds of inactivity, triggering a delayed count update.

- **Frequency Control & Rate Limiting**: Audience count updates are broadcast as room messages. The system enforces a limit of 40 messages per second per room.

   > **Note：**
   >
   > During high-traffic spikes (e.g., chat floods or rapid gifting), if the message rate exceeds this threshold, the system prioritizes core messages (like chat/barrage). Consequently, audience count update messages may be dropped to maintain stability.
   >

- **What does this mean for developers?**

   Treat `audienceCount` as a metric for UI display purposes only. Do not rely on it for billing, critical statistics, or scenarios requiring 100% accuracy, as brief delays or data loss may occur during high-concurrency events.

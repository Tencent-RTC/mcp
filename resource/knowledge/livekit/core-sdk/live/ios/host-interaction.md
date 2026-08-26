Displaying PK User Score on Video View**AtomicXCore** provides two primary modules: [CoHostStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/cohoststore) and [BattleStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/battlestore), which handle cross-room co-hosting and PK battles respectively. This guide walks you through using both modules together to implement the complete workflow from co-hosting to PK in a live streaming scenario.

## Core Scenario

1. **Cross-room Co-hosting**: Two hosts connect, and both video streams are displayed in a shared view.

2. **Initiate PK**: After the connection is established, either host can start a PK challenge.

3. **PK Battle**: Both hosts compete in a PK battle, with scores updated in real time.

## Implementation

### Step 1: Component Integration

### Step 2: Implement Cross-Room Co-hosting

The goal of this step is to display the video streams of two hosts in the same view. Use [CoHostStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/cohoststore) to achieve this.

#### Inviter (Host A) Implementation
1. **Initiate Co-hosting Invitation**

   When Host A selects Host B in the UI and initiates a co-hosting request, call the `requestHostConnection` method.

   ``` swift
   import AtomicXCore
   import Combine

   // Host A's view controller
   class AnchorAViewController {
       private let liveId = "Host A's Room ID"
       private var cancellables: Set<AnyCancellable> = []
       private lazy var coHostStore: CoHostStore = {
           return CoHostStore.create(liveID: self.liveId)
       }()

       // User clicks the "Co-host" button and selects Host B
       func inviteHostB(targetHostLiveId: String) {
           let layout: CoHostLayoutTemplate = .hostDynamicGrid // Choose a layout template
           let timeout: TimeInterval = 30.0 // Invitation timeout

           coHostStore.requestHostConnection(targetHost: targetHostLiveId,
                                             layoutTemplate: layout,
                                             timeout: timeout) { result in
               switch result {
               case .success():
                   print("Co-hosting invitation sent, waiting for response...")
               case .failure(let error):
                   print("Failed to send invitation: \(error.message)")
               }
           }
       }
   }
   ```
2. **Listen for Invitation Result**

   Subscribe to `coHostEventPublisher` to receive Host B's response.

   ``` swift
   // Set up listener during AnchorAViewController initialization
   func setupListeners() {
       coHostStore.coHostEventPublisher
           .sink { [weak self] event in
               switch event {
               case .onCoHostRequestAccepted(let invitee):
                   print("Host \(invitee.userName) accepted your co-hosting invitation")
               case .onCoHostRequestRejected(let invitee):
                   print("Host \(invitee.userName) rejected your invitation")
               case .onCoHostRequestTimeout:
                   print("Invitation timed out, no response from the other party")
               default:
                   break
               }
           }
           .store(in: &cancellables)
   }
   ```

#### Invitee (Host B) Implementation
1. **Receive Co-hosting Invitation**

   Host B listens for invitations from Host A via `coHostEventPublisher`.

   ``` swift
   import AtomicXCore
   import Combine

   // Host B's view controller
   class AnchorBViewController {
       // ... coHostStore and cancellables initialization ...

       // Set up listener during initialization
       func setupListeners() {
           coHostStore.coHostEventPublisher
               .sink { [weak self] event in
                   if case let .onCoHostRequestReceived(inviter, _) = event {
                       print("Received co-hosting invitation from host \(inviter.userName)")
                       // self?.showInvitationDialog(from: inviter)
                   }
               }
               .store(in: &cancellables)
       }
   }
   ```
2. **Respond to Co-hosting Invitation**

   After Host B receives the invitation, prompt for “Accept” or “Reject” and call the appropriate method:

   ``` swift
   // Part of AnchorBViewController
   func acceptInvitation(fromHostLiveId: String) {
       coHostStore.acceptHostConnection(fromHostLiveID: fromHostLiveId, completion: nil)
   }

   func rejectInvitation(fromHostLiveId: String) {
       coHostStore.rejectHostConnection(fromHostLiveID: fromHostLiveId, completion: nil)
   }
   ```

### Step 3: Implement Host PK

After a successful co-hosting connection, either host can initiate a PK. Use [BattleStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/battlestore) for PK functionality.

#### Challenger (e.g., Host A) Implementation
1. **Initiate PK Challenge**

   When Host A clicks the "PK" button, call the `requestBattle` method.

   ``` swift
   // Part of AnchorAViewController
   private lazy var battleStore: BattleStore = BattleStore.create(liveID: self.liveId)

   func startPK(with opponentUserId: String) {
       var config = BattleConfig(duration: 300) // PK lasts 5 minutes
       battleStore.requestBattle(config: config, userIDList: [opponentUserId], timeout: 30.0, completion: nil)
   }
   ```
2. **Listen for PK Status**

   Subscribe to `battleEventPublisher` to monitor key PK events such as start and end.

   ``` swift
   // Add to AnchorAViewController's setupListeners method
   battleStore.battleEventPublisher
       .sink { [weak self] event in
           switch event {
           case .onBattleStarted:
               print("PK started")
           case .onBattleEnded:
               print("PK ended")
           default:
               break
           }
       }
       .store(in: &cancellables)
   ```

#### Opponent (Host B) Implementation
1. **Receive PK Challenge**

   Listen for PK invitations via `battleEventPublisher`.

   ``` swift
   // Add to AnchorBViewController's setupListeners method
   battleStore.battleEventPublisher
       .sink { [weak self] event in
           if case let .onBattleRequestReceived(battleId, inviter, _) = event {
               print("Received PK challenge from host \(inviter.userName)")
               // Show dialog for Host B to choose "Accept" or "Reject"
               // self?.showPKChallengeDialog(battleId: battleId)
           }
       }
       .store(in: &cancellables)
   ```
2. **Respond to PK Challenge**

   Prompt Host B for “Accept” or “Reject” and call the corresponding method:

   ``` swift
   // Part of AnchorBViewController
   // User clicks "Accept Challenge"
   func acceptPK(battleId: String) {
       battleStore.acceptBattle(battleID: battleId) { result in
           // ...
       }
   }

   // User clicks "Reject Challenge"
   func rejectPK(battleId: String) {
       battleStore.rejectBattle(battleID: battleId) { result in
           // ...
       }
   }
   ```

### Step 4: End PK and Disconnect Co-hosting

After the PK session, end the PK and disconnect co-hosting in sequence.
1. **End PK Battle**

   PK typically ends automatically when the timer expires, but hosts can also end PK early. Use `exitBattle`:

   > **Note：**After PK ends, both hosts remain connected (side-by-side video streams). Only the PK progress bar and score panel are removed.
   >

   ``` swift
   func stopPK(battleId: String) {
       battleStore.exitBattle(battleID: battleId) { result in
           switch result {
           case .success:
               print("PK ended")
               // UI receives onBattleEnded event; refresh UI in callback
           case .failure(let error):
               print("Failed to end PK: \(error.message)")
           }
       }
   }
   ```
2. **Disconnect Cross-room Co-hosting**

   To return to solo live streaming, call `exitHostConnection`:

   ``` swift
   func stopConnection() {
       coHostStore.exitHostConnection { result in
           switch result {
           case .success:
               print("Co-hosting disconnected, back to solo live")
               // UI receives onCoHostUserLeft event
           case .failure(let error):
               print("Failed to disconnect co-hosting: \(error.message)")
           }
       }
   }
   ```
3. **Listen for End Events**

   Handle UI cleanup in event listeners for consistency:

   ``` swift
   func setupAdditionalListeners() {
       // Listen for PK end event
       battleStore.battleEventPublisher
           .sink { [weak self] event in
               if case .onBattleEnded(let battleInfo, let reason) = event {
                   print("Received PK end event, reason: \(reason)")
                   // self?.removeBattleUI()
               }
           }
           .store(in: &cancellables)

       // Listen for co-host disconnect event
       coHostStore.coHostEventPublisher
           .sink { [weak self] event in
               if case .onCoHostUserLeft(let userInfo) = event {
                   print("Anchor \(userInfo.userName) has left co-hosting")
                   // self?.resetToSingleStreamLayout()
               }
           }
           .store(in: &cancellables)
   }
   ```

### Run and Test

After integrating the above features, use Host A and Host B to test the corresponding operations. The runtime effect is shown below. For UI customization, see Refine UI Details.

## Refine UI Details

Use the slot capability in the `LiveCoreView.VideoViewDelegate` interface to overlay custom views on video streams, such as nicknames, avatars, PK progress bars, or placeholder images when the host’s camera is off.

### Display Nicknames on Video Streams

#### Implementation Example

#### Implementation
- **Step 1**: Create a foreground view `CustomSeatView` to display user information above the video stream.

   > **Note：**
   >
   > You can also refer to the open-source TUILiveKit files [AnchorCoHostView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/live/Sources/Features/AnchorView/View/VideoWidgets/AnchorCoHostView.swift) and [AnchorEmptySeatView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/live/Sources/Features/AnchorView/View/VideoWidgets/AnchorEmptySeatView.swift) for complete implementation logic.
   >

   ``` swift
   import UIKit
   import SnapKit

   // Custom floating user info view (foreground)
   class CustomSeatView: UIView {
      lazy var nameLabel: UILabel = {
           let label = UILabel()
           label.textColor = .white
           label.font = .systemFont(ofSize: 14)
           return label
       }()

       override init(frame: CGRect) {
           super.init(frame: frame)
           backgroundColor = UIColor.black.withAlphaComponent(0.5)
           addSubview(nameLabel)
           nameLabel.snp.makeConstraints { make in
               make.bottom.equalToSuperview().offset(-5)
               make.leading.equalToSuperview().offset(5)
           }
       }
   }
   ```
- **Step 2**: Create a background view `CustomAvatarView` to use as a placeholder when the user has no video stream.

   ``` swift
   import UIKit
   import SnapKit

   // Custom avatar placeholder view (background)
   class CustomAvatarView: UIView {
       lazy var avatarImageView: UIImageView = {
           let imageView = UIImageView()
           imageView.tintColor = .gray
           return imageView
       }()

       override init(frame: CGRect) {
           super.init(frame: frame)
           backgroundColor = .clear
           layer.cornerRadius = 30
           addSubview(avatarImageView)
           avatarImageView.snp.makeConstraints { make in
               make.center.equalToSuperview()
               make.width.height.equalTo(60)
           }
       }
   }
   ```
- **Step 3**: Implement the `VideoViewDelegate.createCoHostView` protocol method and return the appropriate view based on `viewLayer`.

   ``` swift
   import AtomicXCore
   import RTCRoomEngine

   // 1. In your view controller, conform to the VideoViewDelegate protocol
   class YourViewController: UIViewController, VideoViewDelegate {

       // ... other code ...

       // 2. Fully implement the protocol method, handling both viewLayer types
       func createCoHostView(seatInfo: TUISeatFullInfo, viewLayer: ViewLayer) -> UIView? {
           guard let userId = seatInfo.userId, !userId.isEmpty else {
               return nil
           }
           if viewLayer == .foreground {
               let seatView = CustomSeatView()
               seatView.nameLabel.text = seatInfo.userName
               return seatView
           } else { // viewLayer == .background
               let avatarView = CustomAvatarView()
               // Optionally load the user's avatar using seatInfo.userAvatar
               return avatarView
           }
       }
   }
   ```

#### Parameter Description:
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>seatInfo</code> | <code>TUISeatFullInfo</code> | Seat information object containing user details |
| <code>seatInfo.userId</code> | <code>String?</code> | User ID on the seat |
| <code>seatInfo.userName</code> | <code>String?</code> | User nickname on the seat |
| <code>seatInfo.userAvatar</code> | <code>String?</code> | User avatar URL |
| <code>seatInfo.userMicrophoneStatus</code> | <code>TUIDeviceStatus</code> | User microphone status |
| <code>seatInfo.userCameraStatus</code> | <code>TUIDeviceStatus</code> | User camera status |
| <code>viewLayer</code> | <code>ViewLayer</code> | View layer enum<br>- <code>.foreground</code>: Foreground widget view, always displayed on top of the video<br>- <code>.background</code>: Background widget view, under the foreground view, displayed only when the user has no video stream (e.g., camera off), typically used for the user's default avatar or a placeholder image |

### Displaying PK User Score on Video View

When the host starts a PK, you can attach a custom view to the opponent's video to display gift values or other PK-related information.

#### Implementation Example

#### Implementation
- **Step 1**: Create a custom PK user view. For a complete implementation, refer to [AnchorBattleMemberInfoView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/live/Sources/Features/AnchorView/View/HostBattle/AnchorBattleMemberInfoView.swift).

   ``` swift
   import AtomicXCore
   import RTCRoomEngine
   import SnapKit

   // Custom PK user view
   class CustomBattleUserView: UIView {
       private let scoreView: UIView = {
           let view = UIView()
           view.backgroundColor = .black.withAlphaComponent(0.4)
           view.layer.cornerRadius = 12
           return view
       }()

       private lazy var scoreLabel: UILabel = {
           let label = UILabel()
           label.textColor = .white
           label.font = .systemFont(ofSize: 14, weight: .bold)
           return label
       }()

       private var userId: String
       private let battleStore: BattleStore
       private var cancellableSet: Set<AnyCancellable> = []

       init(liveId: String, battleUser: TUIBattleUser) {
           self.userId = battleUser.userId
           self.battleStore = BattleStore.create(liveID: liveId)
           super.init(frame: .zero)
           backgroundColor = .clear
           isUserInteractionEnabled = false
           setupUI()
           subscribeBattleState()
       }

       private func setupUI() {
           addSubview(scoreView)
           scoreView.addSubview(scoreLabel)
           scoreLabel.snp.makeConstraints { make in
               make.leading.trailing.equalToSuperview().inset(5)
           }
           scoreView.snp.makeConstraints { make in
               make.height.equalTo(24)
               make.bottom.equalToSuperview().offset(-5)
               make.trailing.equalToSuperview().offset(-5)
           }
       }

       // Subscribe to PK score changes
       private func subscribeBattleState() {
           battleStore.state
               .subscribe(StatePublisherSelector(keyPath: \BattleState.battleScore))
               .removeDuplicates()
               .receive(on: RunLoop.main)
               .sink { battleScore in
                   guard let score = battleScore[self.userId] else { return }
                   self.scoreLabel.text = "\(score)"
               }
               .store(in: &cancellableSet)
       }
   }
   ```
- **Step 2**: Implement the `VideoViewDelegate.createBattleView` protocol.

   ``` swift
   // 1. Let your view controller conform to the VideoViewDelegate protocol
   extension YourViewController: VideoViewDelegate {

       public func createBattleView(battleUser: TUIBattleUser) -> UIView? {
           // CustomBattleUserView is your custom PK user info view
           let customView = CustomBattleUserView(liveId: liveId, battleUser: battleUser)
           return customView
       }

   }
   ```

#### Parameter Description:

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`battleUser`|`TUIBattleUser`|PK user info object|
|`battleUser.roomId`|`String`|PK room ID|
|`battleUser.userId`|`String`|PK user ID|
|`battleUser.userName`|`String`|PK user nickname|
|`battleUser.avatarUrl`|`String`|PK user avatar URL|
|`battleUser.score`|`UInt`|PK score|

### Displaying PK Status on Video Stream

#### Implementation Example

#### Implementation
- **Step 1**: Create a custom PK global view (CustomBattleContainerView). For a complete implementation, refer to [AnchorBattleInfoView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/live/Sources/Features/AnchorView/View/HostBattle/AnchorBattleInfoView.swift).

- **Step 2**: Implement the `VideoViewDelegate.createBattleContainerView` protocol.

   ``` swift
   // Let your view controller conform to the VideoViewDelegate protocol and set the delegate
   extension YourViewController: VideoViewDelegate {
       func createBattleContainerView() -> UIView? {
           return CustomBattleContainerView()
       }
   }
   ```

## Advanced Features

### Updating PK Score via REST API

In typical **live host PK scenarios,** the value of gifts received by the host is linked to the PK score (for example, when a viewer sends a "Rocket" gift, the host's PK score increases by 500 points). You can implement real-time PK score updates using our REST API.

> Note：
>
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

3. **PK Score Update**: Your backend calls the Update PK Score API to update the PK score in the LiveKit backend.

4. **LiveKit Backend Syncs to Client**: The backend automatically synchronizes the updated PK score to all clients.

#### Involved REST API Endpoints

|**API**|**Function Description**|**Request Example**|
|---------|---------|---------|
|Active API - Query PK Status|Check whether the current room is in PK|Example|
|Active API - Update PK Score|Update the calculated PK score|Example|
|Callback Configuration - PK Start Callback|Receive real-time notification when PK starts|Example|
|Callback Configuration - PK End Callback|Receive real-time notification when PK ends|Example|

## API Documentation

For detailed information on all public interfaces, properties, and methods of [CoHostStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/cohoststore) and related classes, refer to the official API documentation included with the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore) framework. The relevant stores used in this guide are as follows:

|**Store/Component**|**Description**|**API Reference**|
|---------|---------|---------|
|`LiveCoreView`|Core view component for displaying and interacting with live video streams. Handles video rendering and view widgets, supports host streaming, audience co-hosting, host connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html)|
|`DeviceStore`|Controls audio/video devices: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, and real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|
|`CoHostStore`|Handles host cross-room connections: supports multiple layout templates (dynamic grid, etc.), initiates/accepts/rejects connections, and manages co-host interactions.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)|
|`BattleStore`|Manages host PK battles: initiate PK (set duration/opponent), manage PK status (start/end), synchronize scores, and listen for battle results.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|

## FAQs

### Why didn't the other party receive my co-hosting invitation?
- Ensure that `targetHostLiveId` is correct and that the other host's live room is broadcasting normally.

- Check network stability. The invitation signaling has a default timeout of 30 seconds.

### What happens if one host disconnects from the network or the app crashes during co-hosting or PK?

Both `CoHostStore` and `BattleStore` include built-in heartbeat and timeout detection. If one party exits abnormally, the other party is notified via events such as `onCoHostUserLeft` or `onUserExitBattle`. You can update the UI accordingly, for example, by displaying "The other party has disconnected" and ending the interaction.

### Why can PK scores only be updated via REST API?

The REST API meets the security, real-time, and scalability requirements for PK scores:
- **Tamper-proof and fair**: Requires authentication and data validation. Each update is traceable (e.g., tied to a gift action), preventing manual score changes or cheating and ensuring fair competition.

- **Real-time synchronization across multiple clients**: Uses standardized formats (such as JSON) to quickly connect gift, PK, and display systems, ensuring real-time consistency of scores among hosts, viewers, and backend.

- **Flexible rule adaptation**: Backend configuration changes (such as adjusting gift-to-score mapping or bonus points) can be made without modifying the frontend, reducing iteration costs.

### How do I manage the lifecycle and events of custom views added via `VideoViewDelegate`?

LiveCoreView automatically manages views returned by delegate methods, including adding and removing them. No manual lifecycle management is required.

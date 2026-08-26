UILiveKit's host streaming page offers a comprehensive, ready-to-use interface for live streaming scenarios. It enables rapid integration of essential features for hosts to start streaming, allowing you to efficiently build your live streaming workflow without the complexity of custom UI or business logic.

> **Note:**
> This guide covers the host start process using UI components (including a complete interactive UI). If you prefer to build your own host interface with the Core SDK, see Host Start (Core SDK).
>

## Feature Overview
- **Pre-Stream Preview:** Configure room name, background, video preview, beauty effects, audio effects, layout templates, and more before going live.

- **Co-hosting Interaction:** Engage in real-time with audience members or other hosts across different live rooms during the stream.

- **Audience Interaction:** Includes rich engagement features such as live comments and gift support.

- **Live Room Management:** View the online user list and manage participants with actions like muting or removing users from the live room.

   |**Pre-stream Setup**|**Co-Host Interaction**|**Audience Interaction**|**Live Room Management**|
   |---------|---------|---------|---------|
   ||||<br>|

## Quick Integration

### Step 1. Activate the Service

### Step 2. Integrate the SDK

### Step 3. Add the Pre-stream Preparation Page

【Swift】
``` swift
import UIKit
import Snapkit
import TUILiveKit
import AtomicXCore

// YourAnchorPrepareViewController represents the view controller for loading the host start page
class YourAnchorPrepareViewController: UIViewController {
    private let roomId = "testLiveId"

    // Lazy load AnchorPrepareView
    private lazy var prepareView: AnchorPrepareView = {
        //  Pass roomId when initializing AnchorPrepareView
        let view = AnchorPrepareView(roomId: roomId)
        return view
    }()

    public override func viewDidLoad() {
        super.viewDidLoad()
        //  Add prepareView to the view
        view.addSubview(prepareView)
        prepareView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
}
```

### Step 4. Add the Host Streaming Page

【Swift】
``` swift
import UIKit
import Snapkit
import TUILiveKit
import AtomicXCore

// YourAnchorPrepareViewController represents the view controller for loading the host start page
class YourAnchorViewController: UIViewController {
    // Core view component
    private let coreView: LiveCoreView

    //  Declare anchorView instance
    private let anchorView: AnchorView

    public init(liveInfo: LiveInfo, coreView: LiveCoreView? = nil, behavior: RoomBehavior = .createRoom) {
        if let coreView = coreView {
            self.coreView = coreView
        } else {
            self.coreView = LiveCoreView(viewType: .pushView)
        }
        //  Instantiate the host start page
        self.anchorView = AnchorView(liveInfo: liveInfo, coreView: self.coreView, behavior: behavior)
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func viewDidLoad() {
        super.viewDidLoad()
        //  Add anchorView to the view
        view.addSubview(anchorView)
        anchorView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
}
```

### Step 5. Event Callback Customization

AnchorView supports a delegate (AnchorViewDelegate) for listening to core lifecycle events such as successful live start, stream end with statistics, floating window clicks, and more. Set the delegate after creating AnchorView in Step 4:

|Method|Description|
|---------|---------|
|func onStartLiving()|Called when the host has successfully started streaming (room created/joined, streaming started).|
|func onEndLiving(state: AnchorState)|Called when the host ends the stream. state includes live statistics: totalDuration (duration), totalViewers(audience count), totalMessageSent (live comments), totalGiftCoins (gift revenue), totalGiftUniqueSenders (gifters), totalLikesReceived (likes), liveEndedReason (end reason)—useful for displaying the live summary page.|
|func onClickFloatWindow()|Called when the user clicks the floating window.|

``` swift
import UIKit
import Snapkit
import TUILiveKit
import AtomicXCore

// YourAnchorViewController handles loading the host start streaming page
class YourAnchorViewController: UIViewController {
    // Core view component
    private let coreView: LiveCoreView
    private let liveID: String
    // AnchorView instance
    private let anchorView: AnchorView

    public init(liveInfo: LiveInfo, coreView: LiveCoreView? = nil, behavior: RoomBehavior = .createRoom) {
        if let coreView = coreView {
            self.coreView = coreView
        } else {
            self.coreView = LiveCoreView(viewType: .pushView)
        }
        self.liveID = liveInfo.liveID
        // Initialize the host start streaming page
        self.anchorView = AnchorView(liveInfo: liveInfo, coreView: self.coreView, behavior: behavior)
        super.init(nibName: nil, bundle: nil)
        // Set delegate to listen for host page events
        anchorView.delegate = self
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func viewDidLoad() {
        super.viewDidLoad()
        // Add anchorView to the view
        view.addSubview(anchorView)
        anchorView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
}

// Implement AnchorViewDelegate callbacks
extension YourAnchorViewController: AnchorViewDelegate {
    // Host has successfully started streaming
    func onStartLiving() {
    }

    // Host ends the stream, display the SDK built-in live summary page
    func onEndLiving(state: AnchorState) {
        let endInfo = AnchorEndStatisticsViewInfo(roomId: liveID,
                                                  liveDuration: state.totalDuration,
                                                  viewCount: state.totalViewers,
                                                  messageCount: state.totalMessageSent,
                                                  giftTotalCoins: state.totalGiftCoins,
                                                  giftTotalUniqueSender: state.totalGiftUniqueSenders,
                                                  likeTotalUniqueSender: state.totalLikesReceived,
                                                  liveEndedReason: state.liveEndedReason)
        let anchorEndView = AnchorEndStatisticsView(endViewInfo: endInfo)
        anchorEndView.delegate = self
        view.addSubview(anchorEndView)
        anchorEndView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }

    // User clicked the floating window
    func onClickFloatWindow() {
        FloatWindow.shared.showFloatWindow(controller: self, provider: self)
    }
}

// Implement FloatWindowProvider callbacks
extension YourAnchorViewController: FloatWindowProvider {
    public func getRoomId() -> String {
        liveID
    }

    public func getOwnerId() -> String {
        LiveListStore.shared.state.value.currentLive.liveOwner.userID
    }

    public func getCoreView() -> AtomicXCore.LiveCoreView {
        coreView
    }

    public func relayoutCoreView() {
        anchorView.relayoutCoreView()
    }

    public func getIsLinking() -> Bool {
        let connectedSeats = CoGuestStore.create(liveID: liveID).state.value.connected
        let selfUserID = LoginStore.shared.state.value.loginUserInfo?.userID ?? ""
        return connectedSeats.contains(where: { $0.userID == selfUserID })
    }
}
```

### Step 6. Navigate from Preparation Page to Streaming Page

Implement the delegate methods for the `AnchorPrepareView` component, as described in Step 3, to handle navigation from the preparation page to the host streaming page. Example code:

【Swift】
``` swift
import UIKit
import TUILiveKit
import AtomicXCore

//  Set delegate when initializing AnchorPrepareView
class YourAnchorPrepareViewController: UIViewController {
    private lazy var prepareView: AnchorPrepareView = {
        let view = AnchorPrepareView(roomId: roomId)
        // Set delegate
        view.delegate = self
        return view
    }()
}

//  Implement AnchorPrepareViewDelegate callback
extension YourAnchorPrepareViewController : AnchorPrepareViewDelegate {
    // Handle start button click event
    // - state: PrepareState encapsulates camera, audio effects, and other settings for the host start page. You only need to configure as shown in the sample code below.
    public func onClickStartButton(state: PrepareState) {
        // Navigate to the host start page
        // Initialize live stream information
        var liveInfo = LiveInfo(seatTemplate: .videoDynamicGrid9Seats)
        // If you used Server APIs to pre-create the room, fill in the RoomId returned by the server here.
        liveInfo.liveID = roomId
        liveInfo.liveName = state.roomName
        liveInfo.coverURL = state.coverUrl
        liveInfo.isPublicVisible = state.privacyMode == .public
        liveInfo.backgroundURL = state.coverUrl

        // Instantiate your host start view controller
        let anchorVC = YourAnchorViewController(liveInfo: liveInfo, coreView: prepareView.getCoreView())
        anchorVC.modalPresentationStyle = .fullScreen

        // Destroy the preparation page when going live: do not stack the streaming page on top of the preparation page
        guard let presenter = presentingViewController else {
            present(anchorVC, animated: false)
            return
        }
        presenter.dismiss(animated: false) {
            presenter.present(anchorVC, animated: false)
        }
    }

    // Handle back button click event
    public func onClickBackButton() {
        if let nav = navigationController {
            nav.popViewController(animated: true)
        } else {
            dismiss(animated: true)
        }
    }
}
```

## Customize Your UI Layout

TUILiveKit provides flexible options for customizing features and styles on both the preparation and streaming pages. You can adjust layouts or hide/show feature modules based on your business requirements.

### Select Live Stream Layout Templates

TUILiveKit includes **4 live stream layout templates**. Select your preferred style from the **"Layout"** option in the host preparation page UI:

#### Layout Template Overview

|**Layout**|**Dynamic Grid Layout**|**Floating Window Layout**|**Fixed Grid Layout**|**Fixed Floating Window Layout**|
|---------|---------|---------|---------|---------|
|**Template Value**|`.videoDynamicGrid9Seats`|`.videoDynamicFloat7Seats`|`.videoFixedGrid9Seats`|`.videoFixedFloat7Seats`|
|**Description**|Default layout. The grid size adjusts dynamically based on the number of co-hosts.|Co-hosts are shown in floating windows.|The number of co-hosts is fixed. Each guest occupies a dedicated grid cell.|The number of co-hosts is fixed. Guests appear in fixed floating windows.|
|**Preview**|||||

### Customize Preparation Page

Use the API on the `prepareView` created in Step 3 to hide the entire operation area or specific features on the preparation page.

【Swift】
``` swift
import UIKit
import Snapkit
import TUILiveKit
import AtomicXCore

// YourAnchorPrepareViewController represents the view controller for loading the host start page
class YourAnchorPrepareViewController: UIViewController {
    private let roomId = "testLiveId"
    private lazy var prepareView: AnchorPrepareView = {
        let view = AnchorPrepareView(roomId: roomId)
        view.delegate = self
        return view
    }()

    public override func viewDidLoad() {
        super.viewDidLoad()
        // Add prepareView to the view
        view.addSubview(prepareView)
        prepareView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
        // Customize feature area - Example: Hide beauty feature
        prepareView.disableMenuBeauty(true)
    }
}
```

|**API**|**Description**|
|---------|---------|
|`disableFeatureMenu(true)`|Hide the entire feature area|
|`disableMenuBeauty(true)`|Hide the beauty button|
|`disableMenuAudioEffect(true)`|Hide the audio effect button|
|`disableMenuSwitchCamera(true)`|Hide the camera switch button|

### Customize Host Streaming Page UI
- For host UI customization. Modify styles and add custom business components in `AnchorView`.

- To adjust video stream widgets, see Adjust Video Stream Widgets. Update display elements such as names and avatars on video slots within `AnchorView`.

### Customize Texts

TUILiveKit manages UI text through the [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog), allowing you to visually edit copywriting with Xcode's graphical tools.

> **Note：**
> [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) (.xcstrings) is a localization format introduced in Xcode 15. It supports structured formats for plurals, device-specific variants, and more. This is now the recommended approach for managing localization in iOS and macOS apps.
>

### Customize Icons

TUILiveKit uses `TUILiveKit.xcassets` to manage UI image resources. Customize icons for your interface quickly using Xcode's graphical asset tools.

## Next Steps

Congratulations! You have successfully integrated the **host streaming** feature. Next, you can add capabilities such as **audience viewing**, **live stream list**, and **gift system**. See the table below for more information:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Audience Viewing**|Allow audience to join the host's live room and watch the stream, including audience co-hosting, live room info, online audience list, and live comments display.|Audience Viewing|
|**Live Stream List**|Show the live stream list interface and features, including live stream list and room info display.|Live Stream List|
|**Gift System**|Configure custom gift assets, integrate billing, enable PK interactions, and more.|Gift System|

## FAQs

### No video after starting the stream?

### Unable to start streaming after clicking the start button, showing "Not logged in"?

Review the Login Guide and confirm that the login feature has been integrated.

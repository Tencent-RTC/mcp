---
sync_node_id: '211157325610885120'
nav_path:
  - "直播与语聊 SDK"
  - "UI 组件库"
  - "观众列表组件"
  - "观众列表组件（iOS UIKit）"
product: "live"
---
The Audience List component (**AudienceListView**) provides both real-time audience count display and an interactive audience list popup for live streaming rooms. Easily integrate this component into your UI to enable essential audience interaction features in your live streaming environment.

## Demo

## Quick Start

### Step 1: Activate the Service

### Step 2: Integrate the SDK

Follow the steps in Preparation to integrate the TUILiveKit component.

### Step 3: Add the Audience List Component

For a host live streaming scenario, add **AudienceListView** to your host view controller. Example code:

``` swift
import TUILiveKit

class YourAnchorViewController: UIViewController {

    // 1. Define the audience list component
    private let audienceListView = AudienceListView()
    private let liveId: String
    
    // ... other code ...

    public override func viewDidLoad() {
        super.viewDidLoad()
        
        // 2. Add the component to your view and set up layout
        view.addSubview(audienceListView)
        audienceListView.snp.remakeConstraints { make in
            make.centerY.equalTo(closeButton)
            make.trailing.equalTo(closeButton.snp.leading).offset(-8)
            make.leading.greaterThanOrEqualTo(liveInfoView.snp.trailing).offset(20)
        }
        
        // 3. Associate the live room id
        audienceListView.initialize(liveId: liveId)
    }
}
```

## Customization

The **Audience List component** supports a callback interface for audience list item clicks, allowing you to implement audience management actions according to your business logic.

### Component Interface

|**Interface**|**Parameter**|**Description**|
|---------|---------|---------|
|onUserManageButtonClicked|LiveUserInfo|Callback for audience list item click.|

``` swift
public struct LiveUserInfo {

    public var userID: String           // Audience user ID
    public var userName: String         // Audience user nickname
    public var avatarURL: String        // Audience user avatar URL

    public init()
}
```

### Audience Management

By default, clicking a user in the audience list opens a management popup. You can implement the `onUserManageButtonClicked` closure and use **LiveAudienceStore** to perform actions such as removing a user from the live room:
``` swift
import UIKit
import TUILiveKit
import AtomicXCore

class YourAnchorViewController: UIViewController {
    // 1. Define the audience list component and store
    private let audienceListView = AudienceListView()
    private lazy var liveAudienceStore = LiveAudienceStore.create(liveID: self.liveId)
    private let liveId: String

    public override func viewDidLoad() {
        super.viewDidLoad()
        // ... other code ...
        
        // 2. Bind custom management events to the component
        audienceListView.onUserManageButtonClicked = { [weak self] userInfo in
            self?.showUserManagementAlert(for: userInfo)
        }
    }
    
    // 3. Show custom user management popup
    private func showUserManagementAlert(for user: LiveUserInfo) {
        let alertController = UIAlertController(title: "Audience Management", message: "What would you like to do with \(user.userName)?", preferredStyle: .actionSheet)
        
        let kickOutAction = UIAlertAction(title: "Kick Out of Live Room", style: .destructive) { [weak self] _ in
            self?.kickOutUser(user)
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel)
        
        alertController.addAction(kickOutAction)
        alertController.addAction(cancelAction)
        
        present(alertController, animated: true)
    }
    
    // 4. Call store method to remove the user
    private func kickOutUser(_ user: LiveUserInfo) {
        liveAudienceStore.kickUserOutOfRoom(userID: user.userID) { [weak self] result in
            switch result {
                case .success:
                    print("Successfully kicked out \(user.userName).")
                case .failure(let error):
                    print("Failed to kick out user, error: \(error.message)")
             }
        }
    }
}
```

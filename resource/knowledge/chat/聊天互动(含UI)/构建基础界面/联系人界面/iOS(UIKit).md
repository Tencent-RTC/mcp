---
sync_node_id: '147637868945342464'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "联系人界面"
  - "iOS（UIKit）"
product: "chat"
---
This article will guide you in building a contact interface.

## Display Effect

## Environment Requirements
- Xcode 10 or later

- iOS 9.0 or later

## Prerequisites

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated `TUIKit` or `TUIContact`.

4. Called the `TUILogin` `login` API to log in to the component.

   > **Note:**
   > 
   > 1. All components use this log in to API. Just log in once every time the application is launched.
   > 2. Please ensure a successful log in to proceed, we recommend performing the following actions in the callback for a successful log in to.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://www.tencentcloud.com/document/product/1047/60521) first, otherwise you may encounter obstacles when implementing the following features.

   If you have already completed them, please continue reading below.

## Step Instructions

To display the contacts interface, simply create a `TUIContactController` object and display it.

Sample code:

【Minimalist version】

【Swift】
``` swift
import UIKit

// ContactController is your own ViewController
class ContactController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Create TUIContactController_Minimalist
        let vc = TUIContactController_Minimalist()
        
        // Option 1: push vc.
        navigationController?.pushViewController(vc, animated: true)
        // Option 2: add vc to your own ViewController.
        // addChild(vc)
        // view.addSubview(vc.view)
    }
}
```

【Objective-C】
``` objectivec
#import "TUIContactController_Minimalist.h"

// ContactController is your own ViewController
@implementation ContactController
- (void)viewDidLoad {    
  // Create TUIContactController_Minimalist
  TUIContactController_Minimalist *vc = [[TUIContactController_Minimalist alloc] init];
  // Option 1: push vc.
  [self.navigationController pushViewController:vc animated:YES];
  // Option 2: add vc to your own ViewController.
  // [self addChildViewController:vc];
  // [self.view addSubview:vc.view];
}
@end
```

【Classic version】

【Swift】
``` swift
import UIKit

// ContactController is your own ViewController
class ContactController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Create TUIContactController
        let vc = TUIContactController()
        
        // Option 1: push vc.
        navigationController?.pushViewController(vc, animated: true)
        // Option 2: add vc to your own ViewController.
        // addChild(vc)
        // view.addSubview(vc.view)
    }
}
```

【Objective-C】
``` objectivec
#import "TUIContactController.h"

// ContactController is your own ViewController
@implementation ContactController
- (void)viewDidLoad {    
  // Create TUIContactController
  TUIContactController *vc = [[TUIContactController alloc] init];
  // Option 1: push vc.
  [self.navigationController pushViewController:vc animated:YES];
  // Option 2: add vc to your own ViewController.
  // [self addChildViewController:vc];
  // [self.view addSubview:vc.view];
}
@end
```

`TUIContact` handles click actions in this interface by default, as follows:

|Action|Effect|
|---------|---------|
|Click on `New Contacts`|Display pending friend requests|
|Click on `Group Chats`|Display all group chats for the currently logged-in account|
|Click on `Blocked List`|Display the blocklist for the currently logged-in account|
|Click on the contact's avatar|Enter the Contact Management interface|
|Click on the `+` sign at the top right of the interface|A pop-up menu with `Add to Contacts` and `Add Group`|

In it, by clicking on the contact's avatar, clicking `Add to Contacts`, and clicking on `Group Chats`, you can customize the behavior by implementing the methods in `TUIContactControllerListener`

【Minimalist version】

【Swift】
``` swift
protocol TUIContactControllerListener_Minimalist: AnyObject {
    func onSelectFriend(_ cell: TUICommonContactCell_Minimalist) -> Bool
    func onAddNewFriend(_ cell: TUICommonTableViewCell) -> Bool
    func onGroupConversation(_ cell: TUICommonTableViewCell) -> Bool
}
```

【Objective-C】
``` objectivec
@protocol TUIContactControllerListener_Minimalist <NSObject>
@optional
- (void)onSelectFriend:(TUICommonContactCell *)cell;
- (void)onAddNewFriend:(TUICommonTableViewCell *)cell;
- (void)onGroupConversation:(TUICommonTableViewCell *)cell;
@end
```

【Classic version】

【Swift】
``` swift
protocol TUIContactControllerListener: NSObjectProtocol {
    func onSelectFriend(_ cell: TUICommonContactCell) -> Bool
    func onAddNewFriend(_ cell: TUICommonTableViewCell) -> Bool
    func onGroupConversation(_ cell: TUICommonTableViewCell) -> Bool
}
```

【Objective-C】
``` objectivec
@protocol TUIContactControllerListener <NSObject>
@optional
- (void)onSelectFriend:(TUICommonContactCell *)cell;
- (void)onAddNewFriend:(TUICommonTableViewCell *)cell;
- (void)onGroupConversation:(TUICommonTableViewCell *)cell;
@end
```

## More practices

You can locally [run the TUIKitDemo source code](https://www.tencentcloud.com/document/product/1047/45913) to explore more interface implementations.

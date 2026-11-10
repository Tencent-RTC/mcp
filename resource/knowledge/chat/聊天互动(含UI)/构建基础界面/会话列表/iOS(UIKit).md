---
sync_node_id: '147637888970252288'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "会话列表"
  - "iOS（UIKit）"
product: "chat"
---
This article will guide you through the process of building a conversation list interface.

## Display Effect

The effect of the conversation list is shown below:

### 

## Environment Requirements
- Xcode 10 or later

- iOS 9.0 or later

## Preconditions

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated with `TUIKit` or `TUIConversation`.

4. Called the `login` API in `TUILogin` to log in to the component.

   > **Note:**
   > 
   > 1. All components use this API to log in. You can log in once every time you start the application.
   > 2. Please make sure that the login is successful, and we recommend that you do the following in the callback of successful login.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://www.tencentcloud.com/document/product/1047/60521) first, otherwise you may encounter obstacles when implementing the following features.

   If you have already completed them, please continue reading below.

## Step Instructions

Building a conversation list usually involves the following 3 steps:
1. Load the conversation list. The list corresponds to the `TUIConversationListController` object. After loading, `TUIConversationListController` will automatically retrieve recent conversations.

2. When a user clicks on a row in the conversation list, `TUIConversationListController` will trigger the `didSelectConversation` event.

3. Respond to the click in `didSelectConversation`, which is usually to enter the chat interface of that conversation.

   Sample code:

   

【Minimalist version】

【Swift】
``` swift
import UIKit

// ConversationController is your own ViewController
class ConversationController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // TUIConversationListController_Minimalist
        let vc = TUIConversationListController_Minimalist()
        vc.delegate = self
        
        // Option 1: push vc.
        navigationController?.pushViewController(vc, animated: true)
        // Option 2: Add TUIConversationListController_Minimalist to your own ViewController
        // addChild(vc)
        // view.addSubview(vc.view)
    }
}

extension ConversationController: TUIConversationListControllerListener {
    func conversationListController(_ conversationController: UIViewController, didSelectConversation conversation: TUIConversationCellData) -> Bool
 {
        // Conversation list click event, typically, opening the chat UI
        let conversationData = TUIChatConversationModel()
        conversationData.userID = conversation.userID
        conversationData.title = conversation.title
        conversationData.faceUrl = conversation.faceUrl
        
        // Create chatVC by groupID or userID.
        var chatVC: TUIBaseChatViewController_Minimalist?
        
        if let groupID = conversationData.groupID, !groupID.isEmpty {
            chatVC = TUIGroupChatViewController_Minimalist()
        } else if let userID = conversationData.userID, !userID.isEmpty {
            chatVC = TUIC2CChatViewController_Minimalist()
        }
        
        chatVC?.conversationData = conversationData
        
        // Option 1: push chatVC.
        navigationController?.pushViewController(chatVC!, animated: true)
        // Option 2: add chatVC to your own ViewController.
        // addChild(chatVC!)
        // view.addSubview(chatVC!.view)
    }
}
```

【Objective-C】
``` objectivec
#import "TUIConversationListController_Minimalist.h"
#import "TUIBaseChatViewController_Minimalist.h"
#import "TUIGroupChatViewController_Minimalist.h"
#import "TUIC2CChatViewController_Minimalist.h"

// ConversationController is your own ViewController
@implementation ConversationController
- (void)viewDidLoad {
    [super viewDidLoad];
    // TUIConversationListController_Minimalist
    TUIConversationListController_Minimalist *vc = [[TUIConversationListController_Minimalist alloc] init];
    vc.delegate = self;
    
    // Option 1: push vc.
    [self.navigationController pushViewController:vc animated:YES];
    // Option 2: Add TUIConversationListController_Minimalist to your own ViewController
    // [self addChildViewController:vc];
    // [self.view addSubview:vc.view];
}

- (void)conversationListController:(TUIConversationListController_Minimalist *)conversationController 
            didSelectConversation:(TUIConversationCellData *)conversation {
    // Conversation list click event, typically, opening the chat UI
    TUIChatConversationModel *conversationData = [TUIChatConversationModel new];
    conversationData.userID = conversation.userID;
    conversationData.title = conversation.title;
    conversationData.faceUrl = conversation.faceUrl;
    
    // Create chatVC by groupID or userID.
    TUIBaseChatViewController_Minimalist *chatVC = nil;
    if (conversationData.groupID.length > 0) {
        chatVC = [[TUIGroupChatViewController_Minimalist alloc] init];
    } else if (conversationData.userID.length > 0) {
        chatVC = [[TUIC2CChatViewController_Minimalist alloc] init];
    }
    chatVC.conversationData = conversationData;
    
    // Option 1: push chatVC.
    [self.navigationController pushViewController:chatVC animated:YES];
    // Option 2: add chatVC to your own ViewController.
    // [self addChildViewController:vc];
    // [self.view addSubview:vc.view];
}

@end

```

【Classic version】

【Swift】
``` swift
import UIKit

// ConversationController is your own ViewController
class ConversationController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // TUIConversationListController
        let vc = TUIConversationListController()
        vc.delegate = self
        
        // Option 1: push vc.
        navigationController?.pushViewController(vc, animated: true)
        // Option 2: Add TUIConversationListController to your own ViewController
        // addChild(vc)
        // view.addSubview(vc.view)
    }
}

extension ConversationController: TUIConversationListControllerListener {
    func conversationListController(_ conversationController: UIViewController, didSelectConversation conversation: TUIConversationCellData) -> Bool
 {
        // Conversation list click event, typically, opening the chat UI
        let conversationData = TUIChatConversationModel()
        conversationData.userID = conversation.userID
        conversationData.title = conversation.title
        conversationData.faceUrl = conversation.faceUrl
        
        // Create chatVC by groupID or userID.
        var chatVC: TUIBaseChatViewController?
        
        if let groupID = conversationData.groupID, !groupID.isEmpty {
            chatVC = TUIGroupChatViewController()
        } else if let userID = conversationData.userID, !userID.isEmpty {
            chatVC = TUIC2CChatViewController()
        }
        
        chatVC?.conversationData = conversationData
        
        // Option 1: push chatVC.
        navigationController?.pushViewController(chatVC!, animated: true)
        // Option 2: add chatVC to your own ViewController.
        // addChild(chatVC!)
        // view.addSubview(chatVC!.view)
    }
}
```

【Objective-C】
``` objectivec
#import "TUIConversationListController.h"
#import "TUIBaseChatViewController_Minimalist.h"
#import "TUIGroupChatViewController.h"
#import "TUIC2CChatViewController.h"

// ConversationController is your own ViewController
@implementation ConversationController
- (void)viewDidLoad {
    [super viewDidLoad];
    // TUIConversationListController
    TUIConversationListController *vc = [[TUIConversationListController alloc] init];
    vc.delegate = self;
    
    // Option 1: push vc.
    [self.navigationController pushViewController:vc animated:YES];
    // Option 2: Add TUIConversationListController to your own ViewController
    // [self addChildViewController:vc];
    // [self.view addSubview:vc.view];
}

- (void)conversationListController:(TUIConversationListController *)conversationController 
            didSelectConversation:(TUIConversationCellData *)conversation {
    // Conversation list click event, typically, opening the chat UI
    TUIChatConversationModel *conversationData = [TUIChatConversationModel new];
    conversationData.userID = conversation.userID;
    conversationData.title = conversation.title;
    conversationData.faceUrl = conversation.faceUrl;
    
    // Create chatVC by groupID or userID.
    TUIBaseChatViewController *chatVC = nil;
    if (conversationData.groupID.length > 0) {
        chatVC = [[TUIGroupChatViewController alloc] init];
    } else if (conversationData.userID.length > 0) {
        chatVC = [[TUIC2CChatViewControlleralloc] init];
    }
    chatVC.conversationData = conversationData;
    
    // Option 1: push chatVC.
    [self.navigationController pushViewController:chatVC animated:YES];
    // Option 2: add chatVC to your own ViewController.
    // [self addChildViewController:vc];
    // [self.view addSubview:vc.view];
}

@end
```

> **Note:**
> If you haven't sent messages to any person or group before, no conversation will be generated. In this case, loading the `TUIConversationListController` will show an empty list. For a better experience, it's recommended to send messages to some accounts first to trigger the creation of conversations. If you want to know how to send messages in the chat interface, please refer to the document: Build Chat Interface.
> 

## More practices

You can locally [run the TUIKitDemo source code](https://www.tencentcloud.com/document/product/1047/45913) to explore more interface implementations.

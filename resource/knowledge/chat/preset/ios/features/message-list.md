## Component Overview

MessageList is a SwiftUI-based component designed for displaying and managing chat messages. It supports a wide range of message types and offers flexible customization options:
- Supported message types: text, image, video, audio, file, system notification, emoji, and more.

- Message actions: Includes long-press menu actions such as copy, delete, recall, and custom actions.

- Highly customizable: Configure styles like bubble color, corner radius, font, and add custom action items.

## Component Integration

MessageList is part of TUIKit SwiftUI. To use MessageList, first integrate TUIKit SwiftUI. For detailed integration steps, see the [TUIKit SwiftUI documentation](https://www.tencentcloud.com/document/product/1047/77460).

## Component Structure

MessageList exposes only its initialization method; all other logic is encapsulated within the component.

#### Public Methods
| Method | Parameters | Description |
| --- | --- | --- |
| <code>init</code> | <code>conversationID: String</code> | Initializes the component and sets the conversation ID. |
| <code>config: MessageListConfigProtocol & MessageActionConfigProtocol = ChatMessageListConfig()</code> | Initializes the component and sets the message list style. |  |
| <code>locateMessage: MessageInfo? = nil</code> | Initializes the component and sets the located message. Typically used when navigating from the message search results page to the message page and locating the target message. |  |
| <code>onUserClick: ((String) -> Void)? = nil</code> | Initializes the component and sets the event handler for clicking on the user avatar. |  |
| <code>customActions: [MessageCustomAction] = []</code> | Initializes the component and sets custom message menu options. |  |

## Basic Usage

Initialize the MessageList component directly with a conversation ID. For best results, implement the onUserClick handler during initialization.
``` swift
import AtomicX
import SwiftUI

struct ContentView: View {
    var body: some View {
        MessageList(
            conversationID: "conversation_123",
            onUserClick: { userID in
                // Handle user avatar click event
            }
        )
    }
}
```

## Customization

You can customize both the style and actions of the message list using the following methods.

#### Custom Styles

Implement the `MessageListConfigProtocol` protocol to define a custom style:
``` swift
struct MyCustomConfig: MessageListConfigProtocol & MessageActionConfigProtocol {
    let alignment: Int = 0
    let isShowTimeMessage: Bool = true
    let isShowLeftAvatar: Bool = true
    let isShowLeftNickname: Bool = true
    let isShowRightAvatar: Bool = true
    let isShowRightNickname: Bool = true
    let isSupportCopy: Bool = false
    // ... other properties
}

// Apply custom style
MessageList(
    conversationID: "conversation_123",
    config: MyCustomConfig()
)
```

`MessageListConfigProtocol` Property Descriptions:
| Property | Type | Description | Remarks |
| --- | --- | --- | --- |
| <code>alignment</code> | <code>Int</code> | Message alignment | - 1: Left align.<br>- 2: Right align.<br>- 3: Both sides align. |
| <code>isShowTimeMessage</code> | <code>Bool</code> | Show time message | Controls whether to display message timestamps. |
| <code>isShowLeftAvatar</code> | <code>Bool</code> | Show left avatar | Controls whether to display sender avatar for received messages. |
| <code>isShowLeftNickname</code> | <code>Bool</code> | Show left nickname | Controls whether to display sender nickname for received messages. |
| <code>isShowRightAvatar</code> | <code>Bool</code> | Show right avatar | Controls whether to display your own avatar for sent messages. |
| <code>isShowRightNickname</code> | <code>Bool</code> | Show right nickname | Controls whether to display your own nickname for sent messages. |
| <code>isShowTimeInBubble</code> | <code>Bool</code> | Show time inside bubble | Controls whether the timestamp is displayed inside the message bubble. |
| <code>cellSpacing</code> | <code>CGFloat</code> | Message spacing | Controls the spacing between adjacent messages. |
| <code>isShowSystemMessage</code> | <code>Bool</code> | Show system notification | Controls whether to display system notification messages. |
| <code>isShowUnsupportMessage</code> | <code>Bool</code> | Show unsupported messages | Controls whether to display unsupported message types. |
| <code>horizontalPadding</code> | <code>CGFloat</code> | Horizontal padding | Controls the left and right padding of the message list. |
| <code>avatarSpacing</code> | <code>CGFloat</code> | Avatar spacing | Controls the spacing between the avatar and message content. |

`MessageActionConfigProtocol` Property Descriptions:
| Property Name | Type | Description |
| --- | --- | --- |
| <code>isSupportCopy</code> | <code>Bool</code> | Whether to enable copy function in the message action menu:<br>- <code>true</code>: Display the copy action.<br>- <code>false</code>: Do not display the copy action. |
| <code>isSupportDelete</code> | <code>Bool</code> | Whether to enable the delete function in the message action menu:<br>- <code>true</code>: Display the delete action.<br>- <code>false</code>: Do not display the delete action. |
| <code>isSupportRecall</code> | <code>Bool</code> | Whether to enable the recall function in the message action menu:<br>- <code>true</code>: Display the recall action.<br>- <code>false</code>: Do not display the recall action. |

### Custom Actions

You can customize the long-press message menu items using several approaches.

#### Method 1. Show Action Items Locally

Set `isSupportCopy`, `isSupportDelete`, and `isSupportRecall` in the config when initializing MessageList to control which actions are shown:
``` swift
struct CustomMessageView: View {
    var body: some View {
        MessageList(
            conversationID: "conversation_123",
            config: ChatMessageListConfig(isSupportCopy: false)
        )
    }
}
```

#### Method 2. Add Custom Action Items Locally

Pass `customActions` when initializing MessageList. Your custom actions will be appended to the default action list:
``` swift
struct CustomMessageView: View {
    var body: some View {
        MessageList(
            conversationID: "conversation_123",
            // Add custom action
            customActions: [
                MessageCustomAction(title: "Share", iconName: "forward_icon_figma", systemIconFallback: "square.and.arrow.up") { _ in
                    print("share Message")
                }
            ]
        )
    }
}
```

#### Method 3. Configure Action Items Globally

Set global configuration using `AppBuilderConfig`:
``` swift
// Configure at app launch
AppBuilderConfig.shared.messageActionList = [
    .copy,      // Enable copy
    .delete,    // Enable delete
    .recall     // Enable recall
]

// Then initialize MessageList; all MessageList instances will use this configuration
MessageList(
    conversationID: "conversation_123"
)
```

> **Note：**
> Local configuration overrides global configuration.
>

The following images show the customization effects:

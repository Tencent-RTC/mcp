## Component Overview

MessageList is a Jetpack Compose component designed to display and manage chat messages. It provides robust support for various message types and operations:
- Supported message types: text, image, video, audio, file, system notification, emoji, and more.

- Message actions: supports long-press menus for actions such as copy, delete, recall, and custom options.

- Highly customizable: configure styles (bubble color, corner radius, font, etc.) and custom action items.

## Component Integration

MessageList is part of TUIKit Compose. To use MessageList, integrate TUIKit Compose into your project. For integration instructions, see the [TUIKit Compose documentation](https://www.tencentcloud.com/document/product/1047/77459).

## Component Structure

MessageList exposes only its initialization method; all other logic is handled internally.

#### Public Methods
| Method | Parameter | Description |
| --- | --- | --- |
| <code>MessageList</code> | <code>conversationID: String</code> | Initializes the component and sets the conversation ID.<br>- For C2C Chat, use the format c2c_userID.<br>- For group chat, use group_groupID. |
| <code>modifier: Modifier</code> | Jetpack Compose modifier for setting style, layout, behavior, and appearance. |  |
| <code>config: MessageListConfigProtocol</code> | Initializes the component and applies message list styles. |  |
| <code>customActions: List</code> | Initializes the component and adds custom message menu actions. |  |
| <code>locateMessage: MessageInfo?</code> | Initializes the component and sets the message to locate. Typically used to jump from message search results to the target message. |  |
| <code>messageListViewModelFactory: MessageListViewModelFactory</code> | Factory for creating the internal MessageListViewModel. Usually, you do not need to provide this, as a default implementation is included. |  |
| <code>onUserClick: (String) -> Unit</code> | Initializes the component and sets the handler for user avatar clicks. |  |

## Basic Usage

You can initialize the MessageList component directly by providing a conversation ID. It is also recommended to implement the onUserClick handler during initialization.
``` swift
Box(modifier = Modifier.systemBarsPadding()) {
    MessageList(conversationID = conversationID) {
        // Handle user avatar click event
    }
}
```

## Customization

You can customize both the style and action items of the message list as needed.

#### Custom Styles

Implement `MessageListConfigProtocol` to define a fully customized style:
``` swift
class MyCustomConfig(
    override val alignment: MessageAlignment = MessageAlignment.TWO_SIDED,
    override val isShowTimeMessage: Boolean = true,
    override val isShowLeftAvatar: Boolean = true,
    override val isShowLeftNickname: Boolean = true,
    override val isShowRightAvatar: Boolean = true,
    override val isShowRightNickname: Boolean = true,
    // ... other required properties
) : MessageListConfigProtocol

MessageList(conversationID = conversationID, config = MyCustomConfig()) {
    // Handle user avatar click event
}
```

`MessageListConfigProtocol` Property Descriptions:
| Property | Type | Description | Remarks |
| --- | --- | --- | --- |
| <code>alignment</code> | <code>MessageAlignment</code> | Message alignment | - <code>MessageAlignment.LEFT</code>: left aligned. - <code>MessageAlignment.RIGHT</code>: right aligned. - <code>MessageAlignment.TWO_SIDED</code>: both sides aligned. |
| <code>isShowTimeMessage</code> | <code>Boolean</code> | Show message timestamps | Controls whether message timestamps are displayed. |
| <code>isShowLeftAvatar</code> | <code>Boolean</code> | Show left avatar | Controls whether the sender's avatar is shown for received messages. |
| <code>isShowLeftNickname</code> | <code>Boolean</code> | Show left nickname | Controls whether the sender's nickname is shown for received messages. |
| <code>isShowRightAvatar</code> | <code>Boolean</code> | Show right avatar | Controls whether your avatar is shown for sent messages. |
| <code>isShowRightNickname</code> | <code>Boolean</code> | Show right nickname | Controls whether your nickname is shown for sent messages. |
| <code>isShowTimeInBubble</code> | <code>Boolean</code> | Show time inside bubble | Controls whether the timestamp appears inside the message bubble. |
| <code>cellSpacing</code> | <code>Dp</code> | Message spacing | Controls the spacing between adjacent messages. |
| <code>isShowSystemMessage</code> | <code>Boolean</code> | Show system notifications | Controls whether system notification messages are displayed. |
| <code>isShowUnsupportMessage</code> | <code>Boolean</code> | Show unsupported messages | Controls whether unsupported message types are displayed. |
| <code>horizontalPadding</code> | <code>Dp</code> | Horizontal padding | Controls the left and right padding of the message list. |
| <code>avatarSpacing</code> | <code>Dp</code> | Avatar spacing | Controls the spacing between the avatar and message content. |
| <code>isSupportCopy</code> | <code>Boolean</code> | Enable copy in message menu | - <code>true</code>: Display the copy action.<br>- <code>false</code>: Do not display the copy action. |
| <code>isSupportDelete</code> | <code>Boolean</code> | Enable delete in message menu | - <code>true</code>: Display the delete action.<br>- <code>false</code>: Do not display the delete action. |
| <code>isSupportRecall</code> | <code>Boolean</code> | Enable recall in message menu | - <code>true</code>: Display the recall action.<br>- <code>false</code>: Do not display the recall action. |

### Custom Action Items

You can customize the long-press message menu in several ways.

#### Method 1. Show or Hide Action Items Locally

Set `isSupportCopy`, `isSupportDelete`, and `isSupportRecall` in the config parameter when initializing MessageList to control which actions are available:
``` swift
MessageList(
    conversationID = conversationID,
    config = ChatMessageListConfig(isSupportCopy = false)
) {
    // Handle user avatar click event
}
```

#### Method 2. Add Custom Action Items Locally

Pass a list of custom actions to the `customActions` parameter when initializing MessageList. Your custom actions will appear below the default actions:
``` swift
MessageList(
    conversationID = conversationID,
    customActions = listOf(
        MessageCustomAction(title = "Share", iconResID = R.drawable.message_list_menu_forward_icon) {
            println("Share Message")
        }
    )
)
```

#### Method 3. Configure Action Items Globally

Set global action items using `AppBuilderConfig`:
``` swift
// Configure at app startup
AppBuilderConfig.messageActionList = listOf(
    MessageAction.COPY,    // Enable copy
    MessageAction.DELETE,  // Enable delete
    MessageAction.RECALL   // Enable recall
)

// Then initialize MessageList; all instances will use the above configuration
MessageList(
    conversationID = conversationID,
)
```

> **Note：**
> Local configuration takes precedence over global configuration.
>

Customization examples:

## Component Overview

MessageList is a Flutter component designed for displaying and managing chat messages. It supports a wide range of message types, including:
- Text, image, video, voice, file, system notification, emoji messages, and more.

- Message actions via long-press menus, such as copy, delete, recall, and custom actions.

- Extensive customization: configure bubble color, corner radius, font, and add custom actions.

   MessageList is available as part of TUIKit Flutter. To integrate MessageList, add TUIKit Flutter to your project. For detailed setup instructions, refer to the [TUIKit Flutter documentation](https://www.tencentcloud.com/document/product/1047/77489).

## Component Structure

MessageList exposes only its initialization method; all other internal logic is fully encapsulated.

### Public Methods
| Method | Parameters | Description |
| --- | --- | --- |
| <code>MessageList</code> | <code>conversationID: String</code> | Initializes MessageList and sets the conversation ID.<br>- For C2C Chat, use the format <code>c2c_userID</code>.<br>- For group chat, use <code>group_groupID</code>. |
| <code>config: MessageListConfigProtocol</code> | Initializes MessageList and applies the specified message list style. |  |
| <code>customActions: List</code> | Initializes MessageList with custom long-press menu options. |  |
| <code>locateMessage: MessageInfo?</code> | Initializes MessageList and scrolls to a specific message. Useful when navigating from search results to a specific message. |  |
| <code>onUserClick: (String userID) {}</code> | Initializes MessageList and sets a handler for avatar click events. |  |

## Basic Usage

To initialize MessageList, provide a conversation ID. We recommend implementing `onUserClick` for avatar interactions.
``` swift
MessageList(
  conversationID: 'conversation_123',
  onUserClick: (String userID) {
    // Handle avatar click event
  },
),
```

## Customization

MessageList supports flexible style and action customization.

### Custom Styles

Implement `MessageListConfigProtocol` to define custom styles:
``` swift
class MyCustomConfig extends MessageListConfigProtocol {
  @override
  String get alignment => AppBuilder.MESSAGE_ALIGNMENT_TWO_SIDED;

  @override
  bool get isShowTimeMessage => true;

  @override
  bool get isShowLeftAvatar => true;

  @override
  bool get isShowLeftNickname => true;

  @override
  bool get isShowRightAvatar => true;

  @override
  bool get isShowRightNickname => true;

  // ... other required properties
}

// Apply custom style
MessageList(
  conversationID: 'conversation_123',
  config: MyCustomConfig(),
);
```

**MessageListConfigProtocol Property Reference**
| Property | Type | Description | Remarks |
| --- | --- | --- | --- |
| <code>alignment</code> | <code>String</code> | Message alignment | - <code>MessageAlignment.LEFT</code>：Left aligned.<br>- <code>MessageAlignment.RIGHT</code>：Right aligned.<br>- <code>MessageAlignment.TWO_SIDED</code>：Both sides aligned. |
| <code>isShowTimeMessage</code> | <code>bool</code> | Show timestamp messages | Controls whether message timestamps are displayed. |
| <code>isShowLeftAvatar</code> | <code>bool</code> | Show left avatar | Show sender's avatar for received messages. |
| <code>isShowLeftNickname</code> | <code>bool</code> | Show left nickname | Show sender's nickname for received messages. |
| <code>isShowRightAvatar</code> | <code>bool</code> | Show right avatar | Show your avatar for sent messages. |
| <code>isShowRightNickname</code> | <code>bool</code> | Show right nickname | Show your nickname for sent messages. |
| <code>isShowTimeInBubble</code> | <code>bool</code> | Show time inside bubble | Display timestamp inside the message bubble. |
| <code>cellSpacing</code> | <code>double</code> | Message spacing | Set the space between adjacent messages. |
| <code>isShowSystemMessage</code> | <code>bool</code> | Show system notification | Display system notification messages. |
| <code>isShowUnsupportMessage</code> | <code>bool</code> | Show unsupported messages | Display messages of unsupported types. |
| <code>horizontalPadding</code> | <code>double</code> | Horizontal padding | Set left and right padding for the message list. |
| <code>avatarSpacing</code> | <code>double</code> | Avatar spacing | Set spacing between avatar and message content. |
| <code>isSupportCopy</code> | <code>bool</code> | Enable copy action in menu | - true: Enable copy action<br>- false: Disable copy action |
| <code>isSupportDelete</code> | <code>bool</code> | Enable delete action in menu | - true: Enable delete action<br>- false: Disable delete action |
| <code>isSupportRecall</code> | <code>bool</code> | Enable recall action in menu | - true：Enable recall action<br>- false: Disable recall action |

### Custom Actions

You can customize the long-press menu actions using several approaches.

#### Option A: Locally Hide or Show Action Items

Set `isSupportCopy`, `isSupportDelete`, and `isSupportRecall` in the config to show or hide specific actions:
``` swift
MessageList(
  conversationID: 'conversation_123',
  config: ChatMessageListConfig(isSupportCopy: false),
);
```

#### Option B: Locally Add Custom Action Items

Pass custom actions to MessageList. These will be added below the default menu options:
``` swift
MessageList(
  conversationID: 'conversation_123',
  customActions: [
    MessageCustomAction(
      title: 'Share',
      systemIconFallback: Icons.share,
      action: (MessageInfo messageInfo) {
        print('share message');
      },
    )
  ],
);
```

#### Option C: Configure Action Item Globally

Configure menu actions globally using `AppBuilderConfig`:
``` swift
// Set global configuration at app startup
await AppBuilder.init();
AppBuilder.getInstance().messageListConfig = MessageListConfig(
  messageActionList: [
    AppBuilder.MESSAGE_ACTION_COPY,
    AppBuilder.MESSAGE_ACTION_DELETE,
    AppBuilder.MESSAGE_ACTION_RECALL,
  ],
  // other options
);

// All MessageList instances will inherit the global configuration
MessageList(
  conversationID: 'conversation_123',
);
```

> **Note：**
>  Local configurations override global configuration settings.
>


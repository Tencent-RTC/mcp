## Component Overview

ConversationList is a UI component that displays and manages user chat conversations. It provides a robust feature set for conversation listing—enabling users to view conversations and perform key actions directly from the list.

## Component Integration

ConversationList is part of the TUIKit Flutter package. To add ConversationList to your project, integrate TUIKit Flutter following the [TUIKit Flutter documentation](https://www.tencentcloud.com/document/product/1047/77489).

## Component Structure

ConversationList exposes only its initialization method. All other internal logic is handled within the component itself.

### Public Methods
| Method Name | Parameters | Description |
| --- | --- | --- |
| <code>ConversationList</code> | <code>onConversationClick: (ConversationInfo conversation) {}</code> | Sets the callback for conversation cell clicks. |
| <code>config: ConversationActionConfigProtocol</code> | Initializes the component and configures action menu items (optional). |  |
| <code>customActions: List</code> | Initializes the component and defines custom action options (optional). |  |

## Basic Usage

Initialize ConversationList directly, providing an `onConversationClick` callback.

|Parameter Name|Type|Description|
|---------|---------|---------|
|`onConversationClick`|`(ConversationInfo conversation) {}`|Callback that is invoked when a conversation cell is selected.|

Sample code:
``` java
Expanded(
  child: ConversationList(
    onConversationClick: (conversation) {
      // We recommend navigating to the chat page here
    },
  ),
),
```

## Customization

You can customize the actions available in the conversation list using the following methods.

### Method 1: Hide Conversation Action Items Locally

Provide a custom config when initializing ConversationList to control which menu items are visible:
``` java
Expanded(
  child: ConversationList(
    config: ChatConversationActionConfig(
      isSupportDelete: true,
      isSupportPin: true,
      isSupportClearHistory: false
    ),
    onConversationClick: (conversation) {
      // Navigate to chat page on conversation cell click
    },
  ),
),
```

**Supported Action Toggles**

|Action Type|Description|
|---------|---------|
|`isSupportDelete`|Enable or disable conversation deletion.|
|`isSupportPin`|Enable or disable Pin Conversation.|
|`isSupportClearHistory`|Enable or disable clearing chat history.|

### Method 2: Add Custom Conversation Action Items Locally

Pass `customActions` during initialization to append custom actions below the default options.

|Parameter Name|Type|Description|
|---------|---------|---------|
|`customActions`|`List`|Custom actions shown in the conversation action menu.|

Sample code:
``` swift
Expanded(
  child: ConversationList(
    customActions: [
      ConversationCustomAction(
        title: 'Share',
        action: (conversation) {
          print('Share conversation: ${conversation.title}');
        })
    ],
  ),
),
```

### Method 3: Configure Actions Globally

Set global configuration via `AppBuilder`:
``` swift
// Configure at app startup; if omitted, the feature is not supported
await AppBuilder.init();
AppBuilder.getInstance().conversationListConfig = ConversationListConfig(
    conversationActionList: [
      AppBuilder.CONVERSATION_ACTION_DELETE,
      AppBuilder.CONVERSATION_ACTION_PIN,
      AppBuilder.CONVERSATION_ACTION_CLEAR_HISTORY
    ],
    // ... other required properties
);

// Then, initialize ConversationList. All ConversationList instances will inherit the above action configuration.
Expanded(
  child: ConversationList(
    onConversationClick: (conversation) {
      // You can navigate to the chat page here
    },
  ),
),
```

> **Note：**
> Local configuration takes precedence over global configuration.
>

Below are examples of customization effects:

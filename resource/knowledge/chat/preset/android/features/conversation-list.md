## Component Overview

ConversationList is a Jetpack Compose component designed to display and manage user chat conversations. It offers a comprehensive set of features for viewing and interacting with conversations.

## Component Integration

ConversationList is part of TUIKit Compose. To use ConversationList, integrate TUIKit Compose into your project. For detailed integration steps, see the [TUIKit Compose documentation](https://www.tencentcloud.com/document/product/1047/77459).

## Component Structure

ConversationList exposes only its initialization method; all other logic is handled internally.

#### Public Methods
| Method | Parameter | Description |
| --- | --- | --- |
| <code>ConversationList</code> | <code>modifier: Modifier</code> | Sets the component's style, layout, behavior, and appearance in Jetpack Compose. |
| <code>conversationListViewModelFactory: ConversationListViewModelFactory</code> | Factory for creating the internal ConversationListViewModel. Typically, you do not need to provide this manually, as a default implementation is included. |  |
| <code>config: ConversationActionConfigProtocol</code> | Initializes the component and sets conversation action menu items. Optional. |  |
| <code>customActions: List</code> | Initializes the component and sets custom conversation action options. Optional. |  |
| <code>onConversationClick: (ConversationInfo) -> Unit</code> | Sets the conversation click webhook. |  |

## Basic Usage

Initialize the ConversationList component directly. The onConversationClick webhook is required.

|Parameter Name|Type|Description|
|---------|---------|---------|
|`onConversationClick`|`(ConversationInfo) -> Unit`|Conversation click webhook, triggered when a user taps a conversation cell.|

Example code:
``` swift
Box(
    modifier = Modifier
        .fillMaxSize()
        .systemBarsPadding()
) {
    ConversationList(onConversationClick = {
        // Recommended: Navigate to the chat page here
    })
}
```

## Customization

You can customize the conversation list action items as follows.

#### Method 1. Hide Conversation Action Items Locally

Set `actions` when initializing ConversationList to specify which action items appear in each conversation cell:
``` swift
Box {
    ConversationList(
        // Hide ClearHistory
        config = ChatConversationActionConfig(
            isSupportDelete = true,
            isSupportPin = true,
            isSupportClearHistory = false
        )
    ) {
        // Navigate on conversation cell click
    }
}
```

**Supported Action Menu Toggles**

|Action Type|Description|
|---------|---------|
|`isSupportDelete`|Enable or disable deleting conversations.|
|`isSupportPin`|Enable or disable pinning conversations.|
|`isSupportClearHistory`|Enable or disable clearing conversation history.|

#### Method 2. Add Conversation Action Items Locally

Pass `customActions` when initializing ConversationList. Custom options will be added to the end of the default action menu:

|Parameter Name|Type|Description|
|---------|---------|---------|
|`customActions`|`List`|Custom conversation actions, shown when the user opens the conversation action menu.|

Example code:
``` swift
Box {
    ConversationList(
        customActions = listOf(ConversationCustomAction(title = "Share") {
            println("Share conversation: ${it.title}")
        })
    ) {
        // Handle click events
    }
}
```

#### Method 3. Global Configuration

Configure globally using `AppBuilderConfig`:
``` swift
// Set up at app startup; if omitted, the feature is disabled
AppBuilderConfig.conversationActionList = listOf(
    ConversationAction.DELETE,           // Enable delete
    ConversationAction.PIN,              // Enable pin
    ConversationAction.CLEAR_HISTORY     // Enable clear conversation messages
)

// Then, initialize ConversationList. All ConversationList instances will use the above conversationActionList configuration.
ConversationList() {
    // Navigate to the chat page here if needed
}
```

The following images show the customization effects:

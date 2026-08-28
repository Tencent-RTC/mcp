## Component Overview

MessageInput is a Jetpack Compose component that provides a full-featured message input interface for users. It supports composing and sending various message types, including text, images, videos, files, and voice messages. Additional features include emoji selection, flexible style configuration, and extensive customization options.

## Component Integration

MessageInput is included in TUIKit Compose. To use MessageInput, integrate TUIKit Compose into your project. For detailed integration steps, see the [TUIKit Compose](https://www.tencentcloud.com/document/product/1047/77459) documentation.

## Component Structure

MessageInput consists of the main input component and a style configuration protocol, enabling message input functionality with support for customization.

#### Public Methods
| Method | Parameter | Description |
| --- | --- | --- |
| <code>MessageInput</code> | <code>conversationID: String</code> | Conversation ID that identifies the current chat session.<br>- For C2C Chat, use the format c2c_userID.<br>- For group chat, use group_groupID. |
| <code>modifier: Modifier</code> | Jetpack Compose modifier for configuring style, layout, behavior, and appearance. |  |
| <code>config: MessageInputConfigProtocol</code> | Input style configuration that controls which function buttons are displayed. |  |
| <code>messageInputViewModelFactory: MessageInputViewModelFactory</code> | Factory for creating the internal MessageInputViewModel. Typically, you do not need to provide this manually, as a default implementation is available. |  |

## Basic Usage

Initialize and use the MessageInput component by passing a conversation ID.
``` swift
Box(
    modifier = Modifier
        .fillMaxWidth()
) {
    MessageInput(
        conversationID = conversationID,
        modifier = Modifier.navigationBarsPadding()
    )
}
```

## Customization

Customize which feature buttons appear on the input bar:
``` swift
// Specify which function buttons to display
MessageInput(
    conversationID = conversationID,
    config = ChatMessageInputConfig(
        isShowAudioRecorder = false,   // Hide audio recording
        isShowPhotoTaker = true,       // Show photo capture
        isShowMore = true,             // Show more features
    )
)
```

See the customization results below:

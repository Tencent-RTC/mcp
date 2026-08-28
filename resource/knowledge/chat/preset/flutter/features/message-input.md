## Component Overview

MessageInput is a message input component that enables users to create and send messages with a full range of editing options. It supports various message types, including text, images, videos, files, and voice messages. The component also includes features such as emoji selection and offers flexible styling and customization options.

## Component Integration

MessageInput is part of TUIKit Flutter. To use MessageInput, integrate TUIKit Flutter into your project. For setup instructions, see [TUIKit Flutter documentation](https://www.tencentcloud.com/document/product/1047/77489).

## Component Descriptions

MessageInput is composed of a core input module and a style configuration protocol, allowing you to customize the input experience.

### Initialization Parameters

|Parameter Name|Type|Description|
|---------|---------|---------|
|`conversationID`|`String`|Conversation ID that identifies the current chat session.|
|`config`|`MessageInputConfigProtocol`|Style configuration that controls which function buttons appear.|

## Basic Usage

Initialize the MessageInput component with a conversation ID:
``` swift
Column(
  children: [
    MessageInput(
      conversationID: 'conversation_123',
    ),
  ],
);
```

## Customization

You can configure which feature buttons appear in the input bar:
``` swift
// Customize which feature buttons to show
MessageInput(
  conversationID: widget.conversation.conversationID,
  config: ChatMessageInputConfig(
    isShowAudioRecorder: false,  // Hide audio recording
    isShowPhotoTaker: true,      // Show photo capture
    isShowMore: true,            // Show more features
  ),
),
```

Examples of different configurations:

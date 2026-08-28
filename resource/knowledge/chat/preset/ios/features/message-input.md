## Component Overview

MessageInput is a SwiftUI-based message input component that enables users to compose and send a variety of message types, including text, images, videos, files, and voice messages. It features an integrated emoji picker, supports multiple style configurations, and offers extensive customization options.

## Component Integration

MessageInput is included in TUIKit SwiftUI. To use MessageInput, integrate TUIKit SwiftUI into your project. For detailed integration steps, see the [TUIKit SwiftUI documentation](https://www.tencentcloud.com/document/product/1047/77460).

## Component Structure

MessageInput consists of the main input component and a style configuration protocol, providing message input capabilities and supporting customization.

#### Initialization Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`conversationID`|`String`|Conversation ID used to identify the current chat session|
|`config`|`MessageInputConfigProtocol`|Input style configuration that controls which function buttons are displayed|

#### Public API

|Method|Parameters|Description|
|---------|---------|---------|
|`init`|`conversationID: String, config: MessageInputConfigProtocol`|Initializes the message input component|

## Basic Usage

To get started, initialize the MessageInput component with a conversation ID:
``` swift
import AtomicX
import SwiftUI

struct ChatView: View {
    var body: some View {
        VStack {
            Spacer()

            MessageInput(
                conversationID: "conversation_123"
            )
        }
    }
}
```

## Customization

You can control which feature buttons appear on the input bar:
``` swift
// Customize the displayed function buttons
MessageInput(
    text: $inputText,
    conversationID: conversationID,
    config: ChatMessageInputConfig(
        isShowAudioRecorder: false,  // Hide audio recording
        isShowPhotoTaker: true,      // Show photo capture
        isShowMore: true,            // Show "More" options
        isShowSendButton: true       // Show send button
    )
)
```

The following images show different customization effects:

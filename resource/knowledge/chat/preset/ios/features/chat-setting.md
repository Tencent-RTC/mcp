## Component Overview

ChatSetting is a set of chat settings components built with SwiftUI. It includes two main components: C2CChatSetting (C2C Chat Settings) and GroupChatSetting (Group Chat Settings).

These components offer robust chat session management features, such as user information management, permission controls, group management, and other essential capabilities.

## Component Integration

ChatSetting is included in TUIKit SwiftUI. To use ChatSetting, integrate TUIKit SwiftUI into your project. For detailed integration steps, see the [TUIKit SwiftUI documentation](https://www.tencentcloud.com/document/product/1047/77460).

## Component Structure

ChatSetting contains two main components: C2CChatSetting (C2C Chat Settings) and GroupChatSetting (Group Chat Settings). Each provides a variety of configuration options.

### C2C Chat Settings (C2CChatSetting)

#### Initialization Parameters

|Parameter Name|Type|Description|
|---------|---------|---------|
|`userID`|`String`|The user ID of the chat partner.|
|`onSendMessageClick`|`(() -> Void)?`|The webhook triggered when the Send Message button is clicked (optional).|
|`onContactDelete`|`(() -> Void)?` |The webhook triggered when the Delete Contact button is clicked (optional).|

#### Initialization Interface

|Method Name|Parameters|Description|
|---------|---------|---------|
|`init`|`userID: String, onSendMessageClick: (() -> Void)?, onContactDelete: (() -> Void)?`|Initializes the C2C Chat Settings component.|

### Group Chat Settings (GroupChatSetting)

#### Initialization Parameters

|Parameter Name|Type|Description|
|---------|---------|---------|
|`groupID`|`String`|The group ID used to identify the group chat.|
|`onSendMessageClick`|`(() -> Void)?`|Webhook triggered when the Send Message button is clicked (optional).|
|`onGroupDelete`|`(() -> Void)?`|Webhook triggered when the Disband Group or Leave Group button is clicked (optional).|

#### Initialization Interface

|Method Name|Parameters|Description|
|---------|---------|---------|
|`init`|`groupID: String, onSendMessageClick: (() -> Void)?, onGroupDelete: (() -> Void)?`|Initializes the Group Chat Settings component.|

## Basic Usage

``` swift
import AtomicX
import SwiftUI

struct C2CSettingView: View {
    let userID: String

    var body: some View {
        C2CChatSetting(
            userID: userID,
            onSendMessageClick: {
                // Handle send message button click
            },
            onContactDelete: {
                // Handle delete contact button click
            }
        )
    }
}
```

``` swift
import AtomicX
import SwiftUI

struct GroupSettingView: View {
    let groupID: String

    var body: some View {
        GroupChatSetting(
            groupID: groupID,
            onSendMessageClick: {
                // Handle send message button click
            },
            onGroupDelete: {
                // Handle disband or leave group button click
            }
        )
    }
}
```

## Component Overview

ChatSetting is a set of chat settings components built with Jetpack Compose. It includes two main components: C2CChatSetting (C2C Chat Settings) and GroupChatSetting (Group Chat Settings).

These components offer comprehensive chat session management features, such as user information management, permission controls, group management, and other essential capabilities.

## Component Integration

The ChatSetting component is included in TUIKit Compose. To use ChatSetting, integrate TUIKit Compose into your project. For detailed integration steps, see the [TUIKit Compose documentation](https://www.tencentcloud.com/document/product/1047/77459).

## Component Structure

ChatSetting consists of two main components: C2CChatSetting (C2C Chat Settings) and GroupChatSetting (Group Chat Settings). Each component offers a variety of configuration options.

### C2C Chat Settings (C2CChatSetting)

#### Public Methods
| Method | Parameter | Description |
| --- | --- | --- |
| <code>C2CChatSetting</code> | <code>userID: String</code> | The user ID of the other participant. Used to identify the chat target. |
| <code>modifier: Modifier</code> | Jetpack Compose modifier for setting the component's style, layout, behavior, and appearance. |  |
| <code>onSendMessageClick: () -> Unit</code> | Webhook triggered when the Send Message button is clicked. Optional parameter. |  |
| <code>onContactDelete: () -> Unit</code> | Webhook triggered when the Delete Contact button is clicked. Optional parameter. |  |
| <code>c2cChatSettingViewModelFactory: C2CChatSettingViewModelFactory</code> | Factory for creating the internal C2CChatSettingViewModel. Typically, you do not need to provide this manually, as the component supplies a default implementation. |  |

### Group Chat Settings (GroupChatSetting)

#### Public Methods
| Method | Parameter | Description |
| --- | --- | --- |
| <code>GroupChatSetting</code> | <code>groupID: String</code> | Group ID. Used to identify the group chat. |
| <code>modifier: Modifier</code> | Jetpack Compose modifier for setting the component's style, layout, behavior, and appearance. |  |
| <code>onSendMessageClick: () -> Unit</code> | Webhook triggered when the Send Message button is clicked. Optional parameter. |  |
| <code>onGroupMemberClick: (GroupMember) -> Unit</code> | Webhook triggered when a group member is clicked. Optional parameter. |  |
| <code>onGroupDelete: () -> Unit</code> | Webhook triggered when the Dissolve/Leave Group button is clicked. Optional parameter. |  |
| <code>groupChatSettingViewModelFactory: GroupChatSettingViewModelFactory</code> | Factory for creating the internal GroupChatSettingViewModel. Typically, you do not need to provide this manually, as the component supplies a default implementation. |  |

## Basic Usage

``` swift
Box {
    C2CChatSetting(
        userID = userID,
        onSendMessageClick = {
            // Handle send message click event
        },
        onContactDelete = {
            // Handle contact delete click event
        },
    )
}
```

``` swift
Box {
    GroupChatSetting(
        groupID = groupID,
        onGroupMemberClick = { groupMember ->
            // Handle group member click event
        },
        onSendMessageClick = {
            // Handle send message click event
        },
        onGroupDelete = {
            // Handle dissolve/leave group event
        },
    )
}
```

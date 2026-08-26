## Component Overview

ChatSetting is a suite of chat settings components, featuring two primary modules: C2CChatSetting for one-on-one chat settings and GroupChatSetting for group chat settings.

These components offer a complete set of tools for managing chat sessions, including user information management, permission controls, group management, and other essential features.

## Component Integration

ChatSetting is included in TUIKit Flutter. To use ChatSetting, integrate TUIKit Flutter into your project. For detailed integration instructions, see the [TUIKit Flutter](https://www.tencentcloud.com/document/product/1047/77489) documentation.

## Component Structure

ChatSetting provides two main components: C2CChatSetting for one-on-one chat settings and GroupChatSetting for group chat settings. Each module supports extensive configuration options.

### C2C Chat Settings (C2CChatSetting)

#### Initialization Parameters

|Parameter Name|Type|Description|
|---------|---------|---------|
|`userID`|`String`|The user ID of the chat partner.|
|`onSendMessageClick`|`void Function({String? userID, String? groupID})`|Callback triggered when the Send Message button is clicked. Optional.|
|`onContactDelete`|`VoidCallback`|Callback triggered when the Delete Contact button is clicked. Optional.|

### Group Chat Settings (GroupChatSetting)

#### Initialization Parameters

|Parameter Name|Type|Description|
|---------|---------|---------|
|`groupID`|`String`|Group ID, used to identify the group chat.|
|`onSendMessageClick`|`void Function({String? userID, String? groupID})`|Callback triggered when the Send Message button is clicked. Optional.|
|`onGroupDelete`|`VoidCallback`|Callback triggered when the Dissolve/Leave Group button is clicked. Optional.|

## Basic Usage

``` swift
C2CChatSetting(
  userID: userID,
  onSendMessageClick: ({String? userID, String? groupID}) {
    // Handle send message button click event
  },
  onContactDelete: () {
    // Handle delete contact button click event
  },
);
```

To display the group chat settings page, initialize GroupChatSetting as follows:
``` swift
GroupChatSetting(
  groupID: groupID,
  onGroupDelete: () {
    // Handle delete, dissolve, or leave group button click event
  },
  onSendMessageClick: ({String? userID, String? groupID}) {
    // Handle send message button click event
  },
);
```

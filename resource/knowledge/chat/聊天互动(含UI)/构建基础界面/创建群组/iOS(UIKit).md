---
sync_node_id: '147637856490532864'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "创建群组"
  - "iOS（UIKit）"
product: "chat"
---
This article will guide you through creating a group on TUIKit.

## Display Effect

After creating the group chat, you can start sending messages and interacting in the group. If you go back to the Conversation List at this time, you will find the group chat you just created:

## Environment Requirements
- Xcode 10 or later

- iOS 9.0 or later

## Preconditions

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated `TUIKit`.

4. Called the `TUILogin` `login` API to log in to the component.

   > **Note:**
   > 
   > 1. All components use this API to log in. You can log in once every time you start the application.
   > 2. Please make sure that the login is successful, and we recommend that you do the following in the callback of successful login.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://www.tencentcloud.com/document/product/1047/60521) first, otherwise you may encounter obstacles when implementing the following features.

   If you have already completed them, please continue reading below.

## Creates a group

There are two prerequisites for manually creating a group on TUIKit:
1. Loading the conversation list. Please .

2. Added some contacts. Please .

   There are 3 more steps to follow:

1. On the loaded conversation list interface, click the `+` icon in the upper right corner to pop up a submenu and select `Create Group Chat`.

2. Select several group members. These members are the contacts you have added. If you have not added any contacts before, nobody will be available to select on this screen.

3. Set the group chat name, type, avatar, etc.

   The effect is shown below:

   |Click Create Group Chat|Select group members|Group Settings|
   |---------|---------|---------|
   ||||

## More practices

You can locally [run the TUIKitDemo source code](https://www.tencentcloud.com/document/product/1047/45913) to explore more interface implementations.

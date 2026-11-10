---
sync_node_id: '147637824051666944'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "添加联系人"
  - "Android（View）"
product: "chat"
---
This article will guide you through adding contacts on TUIKit.

## Demo

## Development Environment Requirements
- Android Studio-Giraffe 

- Gradle-7.2

- Android Gradle Plugin Version-7.0.0

- kotlin-gradle-plugin-1.5.31

## Preconditions

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated `TUIKit` or `TUIContact`.

4. Called the `login` API in `TUILogin` to log in to the component.

   > **Note:**
   > 
   > 1. All components use this  login API. You can log in once every time you start the application.
   > 2. Please make sure that the login is successful, and we recommend that you do the following in the successful callback login.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://www.tencentcloud.com/document/product/1047/60520) first, otherwise you may encounter issues when implementing the following features.

   If you have already completed them, please continue reading below.

## Step Instructions

We recommend you operate directly within `TUIKit`, manually adding contacts as follows:
1. Follow the steps in Building Contact Interface to display the contact interface.

2. Click the `+` button in the top right corner of the interface, and in the submenu, select `Add to Contacts`.

3. Enter a valid userID to search for a user. You can obtain a valid userID from the `Account Management` page in the console. Page path: Applications > Your App > Chat > Users > Account Management.

4. Add the user as a contact.

   The effect is shown below:

   |Click [Add to Contacts]|Search for a user|Send a contact request|
   |---------|---------|---------|
   ||||

   Usually, after sending a friend request, the recipient will automatically accept. However, if the recipient's account has set up `Friend Request Verification`, it may behave differently. The configure path is:

   Applications > `Your App` > Chat > Users > Account Management > `Choose an account` > Edit > Friend Request Verification.

   The settings for `Friend Request Verification` are as follows:

   |Friend Request Verification Values|Meaning|
   |---------|---------|
   |Accept all friend requests|Default, accept all friend requests|
   |Manually accept or reject friend requests|The recipient must manually accept or reject the friend request.|
   |Reject all friend requests|Reject all friend requests|

## More Examples

You can [run the TUIKitDemo source code](https://www.tencentcloud.com/document/product/1047/45914) locally to explore more interface examples.

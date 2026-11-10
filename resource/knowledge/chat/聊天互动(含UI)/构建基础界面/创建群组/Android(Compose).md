---
sync_node_id: '206626110345388032'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "创建群组"
  - "Android（Compose）"
product: "chat"
---
This guide shows you how to create a Group using TUIKit Compose.

## Development Environment Requirements
- Android Studio Ladybug (2024.2.1) or later, and JDK 17.

- A physical device or emulator running Android 6.0 (API 23) or later.

## Prerequisites

Before you start building the interface, make sure you have completed the following steps:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit Compose`.

4. Call the `login` interface of `LoginStore` to authenticate the component.

   > **Note:**
   > 
   > - You only need to log in once each time the app is launched.
   > - Please make sure that login is successful. We recommend performing the following operations in the login success callback.

 If you have not completed the above steps. Otherwise, you may encounter issues when implementing the following features.

   If you have already completed these steps, proceed below.

## Creating a Group

To create a Group, you must first select contacts. Please add contacts to your account before proceeding. .

TUIKit Compose provides the `AddNewChatBottomSheet` component, which streamlines the Group creation workflow. This component combines views such as the contact picker (`UserPicker`) and Group settings (`GroupSettingsBottomSheet`) in a single flow. Once you create a Group, you can start sending messages to it.

**Note:** If you are using the sample code provided below, you must pre-populate the following parameters:
- `sdkAppID`: The sdkAppID you obtained earlier.

- `userID`: The user ID of the operator, such as user1 created in Quick Start.

- `userSig`: The userSig of the operator, which is the userSig for user1 as described in Quick Start.

   When the app starts, it will display the contact selection interface for Group creation. The sample implementation is shown below:

   ``` kotlin
   // CreateGroupActivity.kt
   import android.os.Bundle
   import androidx.activity.compose.setContent
   import androidx.appcompat.app.AppCompatActivity
   import androidx.compose.runtime.getValue
   import androidx.compose.runtime.mutableStateOf
   import androidx.compose.runtime.remember
   import androidx.compose.runtime.setValue
   import io.trtc.tuikit.chat.uikit.components.contactlist.ui.addnewchat.AddNewChatBottomSheet
   import io.trtc.tuikit.chat.uikit.components.contactlist.viewmodel.ChatType
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.login.LoginStore
   
   class CreateGroupActivity : AppCompatActivity() {
   
       private val sdkAppID: Int = 1234567890 // TODO: Fill in your sdkAppID here
       private val userID = "" // TODO: Fill in your userID here
       private val userSig = "" // TODO: Fill in your generated userSig here
   
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           login()
       }
   
       private fun login() {
           LoginStore.shared.login(this, sdkAppID, userID, userSig, object : CompletionHandler {
               override fun onSuccess() {
                   showCreateGroupPage()
               }
               override fun onFailure(code: Int, desc: String) {
                   // Handle login failure
               }
           })
       }
   
       private fun showCreateGroupPage() {
           setContent {
               var showSheet by remember { mutableStateOf(true) }
               var createdConversationID by remember { mutableStateOf<String?>(null) }
   
               if (createdConversationID != null) {
                   // Group created successfully, navigate to chat page
                   // Use createdConversationID to open ChatPage
               }
   
               if (showSheet) {
                   AddNewChatBottomSheet(
                       chatType = ChatType.GROUP,
                       onDismiss = { showSheet = false },
                       onCreateChat = { conversationId ->
                           showSheet = false
                           createdConversationID = conversationId
                       }
                   )
               }
           }
       }
   }
   ```

   At runtime, the effect is as follows:

## More Practice

You can run the Chat Demo source code locally to explore additional interface implementations.

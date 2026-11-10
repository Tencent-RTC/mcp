---
sync_node_id: '206626095296786432'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "会话列表"
  - "Android（Compose）"
product: "chat"
---
This guide will walk you through building a conversation list interface.

## Development Environment Requirements
- Android Studio Ladybug (2024.2.1) or later, and JDK 17.

- A physical device or emulator running Android 6.0 (API 23) or later.

## Prerequisites

Before you begin, make sure you have completed the following steps:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit Compose`.

4. Call the `login` method of `LoginStore` to authenticate the component.

   > **Note：**
   > 
   > - You only need to log in once each time the app is launched.
   > - Make sure the login is successful. We recommend handling subsequent operations in the login success callback.

   If you have not completed these four steps, please review the instructions in Quick Start before proceeding. Otherwise, you may encounter issues when implementing the features below.

   If you have completed these steps, continue with the instructions below.

## Step Instructions

> **Note：**
> If you have not sent any messages to users or groups, no conversations will be generated. In this case, loading the ConversationList will show an empty list. To see the conversation list in action, send messages to some accounts to trigger conversation creation. For details on sending messages in the chat interface, see Build Chat Interface.
> 

Build the conversation list interface using the ConversationList `@Composable` component. Handle conversation list item clicks via the `onConversationClick` callback.

If you use the sample code below, be sure to fill in the following parameters:
- `sdkAppID`: The value you obtained earlier.

- `userID`: The operator's userID (for example, user1 created in Quick Start).

- `userSig`: The operator's userSig (for user1, as created in Quick Start).

   The app loads the conversation list page on startup. Sample code:

   ``` swift
   // ConversationListActivity.kt
   import android.os.Bundle
   import androidx.activity.compose.setContent
   import androidx.appcompat.app.AppCompatActivity
   import androidx.compose.foundation.background
   import androidx.compose.foundation.layout.Column
   import androidx.compose.foundation.layout.Row
   import androidx.compose.foundation.layout.fillMaxSize
   import androidx.compose.foundation.layout.fillMaxWidth
   import androidx.compose.foundation.layout.height
   import androidx.compose.foundation.layout.padding
   import androidx.compose.foundation.layout.statusBarsPadding
   import androidx.compose.material3.HorizontalDivider
   import androidx.compose.material3.Text
   import androidx.compose.ui.Alignment
   import androidx.compose.ui.Modifier
   import androidx.compose.ui.text.font.FontWeight
   import androidx.compose.ui.unit.dp
   import androidx.compose.ui.unit.sp
   import io.trtc.tuikit.chat.uikit.components.theme.LocalTheme
   import io.trtc.tuikit.chat.uikit.components.conversationlist.ui.ConversationList
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.login.LoginStore
   
   class ConversationListActivity : AppCompatActivity() {
   
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
                   showConversationListPage()
               }
               override fun onFailure(code: Int, desc: String) {
                   // Handle login failure
               }
           })
       }
   
       private fun showConversationListPage() {
           setContent {
               val colors = LocalTheme.current.colors
               Column(
                   modifier = Modifier
                       .fillMaxSize()
                       .background(color = colors.bgColorOperate)
                       .statusBarsPadding()
               ) {
                   // Navigation Bar
                   Row(
                       modifier = Modifier
                           .fillMaxWidth()
                           .padding(horizontal = 16.dp)
                           .height(44.dp),
                       verticalAlignment = Alignment.CenterVertically
                   ) {
                       Text(
                           text = "Conversations",
                           fontSize = 17.sp,
                           fontWeight = FontWeight.W600,
                           color = colors.textColorPrimary
                       )
                   }
   
                   HorizontalDivider(color = colors.strokeColorPrimary)
   
                   // ConversationList
                   ConversationList(
                       onConversationClick = { conversation ->
                           // Handle conversation click, for example, navigate to ChatPage
                           // conversation.conversationID
                       }
                   )
               }
           }
       }
   }
   ```

   Sample interface:

   

## Further Practice

To explore additional interface implementations, you can run the Chat Demo source code locally.

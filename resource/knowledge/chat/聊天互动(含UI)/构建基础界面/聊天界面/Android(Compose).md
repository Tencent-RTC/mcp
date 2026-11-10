---
sync_node_id: '206626089288933376'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "聊天界面"
  - "Android（Compose）"
product: "chat"
---
This guide shows you how to build a chat interface.

## Development Environment Requirements
- Android Studio Ladybug (2024.2.1) or later, and JDK 17.

- A physical device or emulator running Android 6.0 (API 23) or later.

## Prerequisites

Before you begin building the interface, complete the following steps:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit Compose`.

4. Call the `login` method of `LoginStore` to authenticate with the component.

   > **Notice：**
   > 
   > - You only need to log in once each time the app launches.
   > - Verify that login is successful. We recommend handling all subsequent operations inside the login success callback.

   If you haven’t finished these four steps, see the relevant instructions in the Quick Start Guide before proceeding. Otherwise, you may encounter issues when implementing the features described below.

   If you have completed these steps, continue reading.

## Step-by-Step Instructions

### One-on-one Chat Interface

To navigate to the one-on-one messages interface, refer directly to the Quick Start Guide.

### Group Chat Interface

To access the group chat message interface, you need a valid groupID. Confirm that you have an existing groupID.

If you don’t have a group yet, create one in the [Console](https://console.trtc.io/chat). Go to: [Chat > Group Management](https://console.trtc.io/chat/qun-manage) > Add Group.

After creating the group, the groupID will be displayed on the page:

The group chat interface uses two `@Composable` components: `MessageList` and `MessageInput`.

**Note:** If you use the sample code below, make sure to populate the following parameters:
- `sdkAppID`: The sdkAppID you obtained earlier.

- `senderUserID`: The userID of the message sender—this is user1 you created in the Quick Start Guide.

- `senderUserSig`: The userSig for the sender—this is the userSig for user1 from the Quick Start Guide.

- `groupID`: The group ID.

   The app loads the group chat message list page on startup. Example code:

   ``` swift
   // GroupChatActivity.kt
   import android.os.Bundle
   import androidx.activity.compose.setContent
   import androidx.appcompat.app.AppCompatActivity
   import androidx.compose.foundation.background
   import androidx.compose.foundation.layout.Box
   import androidx.compose.foundation.layout.Column
   import androidx.compose.foundation.layout.Row
   import androidx.compose.foundation.layout.fillMaxSize
   import androidx.compose.foundation.layout.fillMaxWidth
   import androidx.compose.foundation.layout.height
   import androidx.compose.foundation.layout.navigationBarsPadding
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
   import io.trtc.tuikit.chat.uikit.components.messageinput.ui.MessageInput
   import io.trtc.tuikit.chat.uikit.components.messagelist.ui.MessageList
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.login.LoginStore
   
   class GroupChatActivity : AppCompatActivity() {
   
       private val sdkAppID: Int = 1234567890 // TODO: Enter your sdkAppID here
       private val senderUserID = "" // TODO: Enter your userID here
       private val senderUserSig = "" // TODO: Enter your generated userSig here
       private val groupID = "" // TODO: Enter your groupID here
   
       // C2C conversationID: "c2c_${userID}", Group conversationID: "group_${groupID}"
       private val conversationID: String get() = "group_${groupID}"
   
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           login()
       }
   
       private fun login() {
           LoginStore.shared.login(this, sdkAppID, senderUserID, senderUserSig, object : CompletionHandler {
               override fun onSuccess() {
                   showGroupChatPage()
               }
               override fun onFailure(code: Int, desc: String) {
                   // Handle login failure
               }
           })
       }
   
       private fun showGroupChatPage() {
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
                           text = groupID,
                           fontSize = 17.sp,
                           fontWeight = FontWeight.W600,
                           color = colors.textColorPrimary
                       )
                   }
   
                   HorizontalDivider(color = colors.strokeColorPrimary)
   
                   // MessageList
                   Box(modifier = Modifier.weight(1f)) {
                       MessageList(
                           conversationID = conversationID,
                           onUserClick = { userID ->
                               // Handle user avatar click
                           }
                       )
                   }
                   // MessageInput
                   MessageInput(
                       conversationID = conversationID,
                       modifier = Modifier.navigationBarsPadding()
                   )
               }
           }
       }
   }
   ```

   Sample interface:

   

## Further Practice

To explore more interface implementations, you can run the Chat Demo source code locally.

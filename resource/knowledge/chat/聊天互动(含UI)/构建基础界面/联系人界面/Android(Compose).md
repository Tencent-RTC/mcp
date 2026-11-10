---
sync_node_id: '206626100513214464'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "联系人界面"
  - "Android（Compose）"
product: "chat"
---
This guide walks you through building the Contacts interface.

## Development Environment Requirements
- Android Studio Ladybug (2024.2.1) or later, and JDK 17.

- A physical device or emulator running Android 6.0 (API 23) or later.

## Prerequisites

Before you begin implementing the Contacts interface, make sure you have completed the following steps:
1. Created an application in the console.

2. Created at least two user accounts in the console.

3. Integrated `TUIKit Compose`.

4. Called the `login` method of `LoginStore` to authenticate the component.

   > **Note:**
   > 
   > - Log in only once each time the app starts.
   > - Ensure that the login is successful. We recommend handling subsequent operations in the login success callback.

 If you have not completed these four steps. Otherwise, you may encounter issues implementing the features below.

   If you have completed the prerequisites, continue with the following instructions.

## Implementation Steps

The Contacts interface is built using the ContactList `@Composable` component.

> **Note:**
> If no contacts have been added, the Contacts interface will be empty. Once contacts are added, they will appear in the list. To add contacts using TUIKit Compose, see the documentation: Add Contacts.
> 

If you are using the sample code provided, you must pre-fill the following parameters:
- `sdkAppID`: The sdkAppID you obtained earlier.

- `userID`: The operator’s userID (e.g., user1, created during Quick Start).

- `userSig`: The userSig for user1, generated during Quick Start.

   The app will load the Contacts interface at startup. Sample implementation:

   ``` swift
   // ContactListActivity.kt
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
   import io.trtc.tuikit.chat.uikit.components.contactlist.ui.ContactList
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.login.LoginStore
   
   class ContactListActivity : AppCompatActivity() {
   
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
                   showContactListPage()
               }
               override fun onFailure(code: Int, desc: String) {
                   // Handle login failure
               }
           })
       }
   
       private fun showContactListPage() {
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
                           text = "Contacts",
                           fontSize = 17.sp,
                           fontWeight = FontWeight.W600,
                           color = colors.textColorPrimary
                       )
                   }
   
                   HorizontalDivider(color = colors.strokeColorPrimary)
   
                   // ContactList
                   ContactList(
                       onContactClick = { contact ->
                           // Handle contact click
                           // contact.userID
                       },
                       onGroupClick = { group ->
                           // Handle group click
                           // group.userID is the groupID
                       }
                   )
               }
           }
       }
   }
   ```

   The runtime interface appears as follows:

   

   ContactList provides default click handling for the following actions:

   |Action|Effect|
   |---------|---------|
   |Click **New Contacts**|Displays pending friend requests.|
   |Click **Group Notifications**|Shows the list of group join requests and group invitations.|
   |Click **My Groups**|Lists all group chats for the current account.|
   |Click **Blacklist**|Shows the blacklist for the current account.|

## Further Practice

To explore more interface implementations, run the Chat Demo source code locally.

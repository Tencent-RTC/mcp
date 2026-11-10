---
sync_node_id: '206626105732214784'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "添加联系人"
  - "Android（Compose）"
product: "chat"
---
This guide explains how to add contacts in TUIKit Compose.

## Development Environment Requirements
- Android Studio Ladybug (2024.2.1) or later, and JDK 17.

- A physical device or emulator running Android 6.0 (API 23) or later.

## Prerequisites

Before you start building the interface, make sure you have completed all four of the following steps:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit Compose`.

4. Call the `login` interface in `LoginStore` to authenticate into the component.

   > **Note:**
   > 
   > - You only need to log in once each time the app starts.
   > - Make sure the login is successful. We recommend performing subsequent operations inside the login success callback.

 If you have not completed these four steps. Otherwise, you may run into issues implementing the features described below.

   If you have completed these steps, continue with the instructions below.

## Adding Contacts

The `AddContactAndGroupBottomSheet` view within the ContactList component of TUIKit Compose provides the UI for adding contacts. Use this view to implement the workflow for adding contacts. The process includes:
1. Search for the target contact by userID.

2. Add the target contact as a friend.

3. After sending the friend request, the recipient will automatically accept it by default. However, if the recipient account is configured with the **Default Friend Verification Setting**, the behavior may change. If approval is required, the target contact can accept the friend request in the **New Contacts** section of the ContactList. For instructions on building the ContactList, see Contact Interface.

   > **Note:**
   > 
   > The **Default Friend Verification Setting** can be set in the console: [Chat](https://console.trtc.io/) > Feature Configuration > Friends & Relationship Chain > Default Friend Verification Setting.
   > 

   If you use the sample code provided below, make sure to pre-fill these parameters:

- `sdkAppID`: The sdkAppID you obtained earlier.

- `userID`: The operator’s userID, which is user1 created in Quick Start.

- `userSig`: The operator’s userSig, which is user1's userSig created in Quick Start.

   The app loads the add friend interface at startup. Sample code:

   ``` swift
   // AddContactActivity.kt
   import android.os.Bundle
   import androidx.activity.compose.setContent
   import androidx.appcompat.app.AppCompatActivity
   import androidx.compose.runtime.getValue
   import androidx.compose.runtime.mutableStateOf
   import androidx.compose.runtime.remember
   import androidx.compose.runtime.setValue
   import io.trtc.tuikit.chat.uikit.components.contactlist.ui.addfriendandgroup.AddContactAndGroupBottomSheet
   import io.trtc.tuikit.chat.uikit.components.contactlist.viewmodel.AddType
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.login.LoginStore
   
   class AddContactActivity : AppCompatActivity() {
   
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
                   showAddContactPage()
               }
               override fun onFailure(code: Int, desc: String) {
                   // Handle login failure
               }
           })
       }
   
       private fun showAddContactPage() {
           setContent {
               var showSheet by remember { mutableStateOf(true) }
   
               if (showSheet) {
                   AddContactAndGroupBottomSheet(
                       addType = AddType.CONTACT,
                       onDismiss = { showSheet = false }
                   )
               }
           }
       }
   }
   ```

   The interface at runtime appears as follows:

## Further Practice

You can run the Chat Demo source code locally to explore additional interface implementations.

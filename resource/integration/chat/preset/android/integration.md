TUIKit Compose is a Jetpack Compose component library built on top of the Chat SDK, providing a comprehensive solution for instant messaging features such as chat, conversation list, and contact management. This guide explains how to manually integrate the component and implement its core features.

## Key Concepts

TUIKit Compose offers a complete set of instant messaging UI components, built on the AtomicXCore data layer and designed to help you quickly assemble functional pages.
- Page Layer: Fully functional pages composed using TUIKit Compose components, such as ChatPage, ContactsPage, and ConversationsPage. You can use these pages directly in your app.

- TUIKit Compose (UI Component Layer): Jetpack Compose components built on AtomicXCore, which you can embed into your own app pages.

- AtomicXCore (Data Layer): Handles data management and business logic, including various Stores and Managers.

## Prerequisites
- Android Studio Ladybug | 2024.2.1 or higher

- Android 5.0 or higher

- Gradle 8.9 or higher

- Android Gradle Plugin 8.6 or higher

- JDK 17 or higher

- Kotlin 1.9.0 or higher

- A valid Tencent Cloud account and Chat application. Refer to [Enable Service](https://trtc.io/document/74511) to obtain the following information from the console:

  - SDKAppID: The unique ID of your Chat application obtained from the console

  - SDKSecretKey: The application's SecretKey

      > **Note：**
      >
      > - This project currently only supports manual integration and does not support integration via package managers such as Maven.
      > - To ensure a stable build environment, strictly follow the official compatibility requirements:
      > - For compatibility between Gradle, Android Gradle Plugin, JDK, and Android Studio, refer to the official Android documentation: [Version Notes](https://developer.android.com/build/releases/gradle-plugin#updating-gradle).
      > - For the version mapping between Kotlin, Android Gradle Plugin, and Gradle, refer to the official Kotlin documentation: [Kotlin-Gradle Plugin Compatibility](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin).
      > We recommend selecting a version combination that matches your project requirements exactly, based on the guidelines above.
      >

## Installation and Setup

### Download Source Code
1. Download the [TUIKit Compose](https://github.com/Tencent-RTC/TUIKit_android_compose) source code from GitHub:

   ``` bash
     git clone https://github.com/Tencent-RTC/TUIKit_Android_Compose.git
   ```

    The project directory structure is as follows:

   ``` bash
     atomic-x/
     ├── src/main/
     │   ├── java/io/trtc/tuikit/atomicx/     # UI component source code (required for integration)
     │       ├── messagelist/      # Message list component
     │       ├── messageinput/     # Message input component
     │       ├── conversationlist/ # Conversation list component
     │       ├── contactlist/      # Contact list component
     │       ├── basecomponent/    # Base components
     │       └── ...               # Other UI components
     │   # Resource files (required for integration)
     │   ├── res/                    # Common resources
     │   ├── res-message-list/       # Message list component resources
     │   ├── res-message-input/      # Message input component resources
     │   ├── res-conversation-list/  # Conversation list component resources
     │   └── ...                     # Other component resources
     chat/
     ├── uikit/src/main/java/io/trtc/tuikit/chat/pages    # Page components (reference implementations)
     │   ├── ChatPage.kt
     │   ├── ContactsPage.kt
     │   └── ConversationsPage.kt
     └── demo/                 # Sample application (optional reference)
   ```

### Integrate Components

2. Add the TUIKit Compose component in your settings.gradle.kts/settings.gradle file:

   > **Note：**
   >
   > TUIKit_Android_Compose can be placed anywhere, as long as the relative path is correctly set in settings.gradle.
   >

【Kotlin DSL (Recommended)】
``` java
// settings.gradle.kts
include(":atomicx")
project(":atomicx").projectDir = file("../TUIKit_Android_Compose/atomic-x")
```

【Groovy DSL】
``` java
// settings.gradle
include ':atomicx'
project(':atomicx').projectDir = new File(settingsDir, '../TUIKit_Android_Compose/atomic-x')
```

3. Add the following dependency in your app module's build.gradle.kts/build.gradle:

【Kotlin DSL (Recommended)】
``` java
// app/build.gradle.kts
dependencies {
    implementation(project(":atomicx"))

```

【Groovy DSL】
``` java
// app/build.gradle
dependencies {
    api project(':atomicx')
}
```

   > **Notice：**
   >
   > - When using the local integration approach, to upgrade, obtain the latest component code from GitHub and overwrite your local TUIKit Compose directory.
   > - If there are conflicts between your private modifications and the remote repository, you need to manually merge and resolve conflicts.

### Project Configuration
1. Locate the AndroidManifest.xml file in your app directory, and add `tools:replace="android:allowBackup"` to the `application` node to override the component's setting with your own.

   ``` java
     // app/src/main/AndroidManifest.xml
     <application
       android:name=".BaseApplication"
       android:allowBackup="false"
       android:icon="@drawable/app_ic_launcher"
       android:label="@string/app_name"
       android:largeHeap="true"
       android:theme="@style/AppTheme"
       tools:replace="android:allowBackup">
   ```
2. Configure dependencies.

   Add the following dependencies to your project's gradle/libs.versions.toml file:

   ``` python
     # gradle/libs.versions.toml
     [versions]
     agp = "8.13.0"
     kotlin = "2.0.21"
     coreKtx = "1.10.1"
     junit = "4.13.2"
     junitVersion = "1.1.5"
     espressoCore = "3.5.1"
     appcompat = "1.7.1"
     material = "1.13.0"
     runner = "1.0.2"
     espressoCoreVersion = "3.0.2"
     appcompatV7 = "28.0.0"

     tuicore = "8.6.7021"
     lifecycleRuntimeKtx = "2.8.7"
     ui = "1.8.0"
     foundation = "1.8.0"
     composeBom = "2024.09.00"
     activityCompose = "1.10.1"
     activity = "1.8.0"
     constraintlayout = "2.2.1"

     [libraries]
     androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
     junit = { group = "junit", name = "junit", version.ref = "junit" }
     androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
     androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
     androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version.ref = "appcompat" }
     material = { group = "com.google.android.material", name = "material", version.ref = "material" }
     runner = { group = "com.android.support.test", name = "runner", version.ref = "runner" }
     espresso-core = { group = "com.android.support.test.espresso", name = "espresso-core", version.ref = "espressoCoreVersion" }
     appcompat-v7 = { group = "com.android.support", name = "appcompat-v7", version.ref = "appcompatV7" }

     androidx-lifecycle-viewmodel-compose = { module = "androidx.lifecycle:lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
     androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
     androidx-compose-foundation = { group = "androidx.compose.foundation", name = "foundation", version.ref = "foundation" }
     androidx-compose-ui = { group = "androidx.compose.ui", name = "ui", version.ref = "ui" }
     androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
     androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
     androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
     androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
     androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
     androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
     androidx-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
     tuicore = { module = "com.tencent.liteav.tuikit:tuicore", version.ref = "tuicore" }
     com-tencent-mmkv = { group = "com.tencent", name = "mmkv", version = "1.3.14" }

     [plugins]
     android-application = { id = "com.android.application", version.ref = "agp" }
     kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
     android-library = { id = "com.android.library", version.ref = "agp" }

     kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
   ```
3. Enable Compose support.

    Add the following configuration to your app module's build.gradle.kts/build.gradle:

【Kotlin DSL (Recommended)】
``` java
// app/build.gradle.kts
plugins {
    // Add Compose plugin
    alias(libs.plugins.kotlin.compose)
}
android {
    // Enable Compose
    buildFeatures {
        compose = true
    }
}
```

【Groovy DSL】
``` java
// app/build.gradle
plugins {
    // Add Compose plugin
    id libs.plugins.kotlin.compose.get().pluginId
}
android {
    // Enable Compose
    buildFeatures {
        compose true
    }
}
```

4. Configure ProGuard rules.

   Add the following rules to your app/proguard-rules.pro file:

   ``` java
     -keep class com.tencent.** { *; }
   ```
5. In Android Studio, click **File > Sync Project with Gradle Files** to integrate the component.

## Implementation

### Step 1: Configure User Authentication

In the [Tencent RTC Console](https://console.trtc.io/), obtain the UserSig for your UserID. UserSig is required for authentication during login.

### Step 2: User Login

You must complete authentication before using any component features. Call the login API and pass the SDKAppID and UserSig you obtained above to authenticate. .kt`:
``` swift
// User login
LoginStore.shared.login(context, SDKAPPID, userID, userSig,
    object : CompletionHandler {
        override fun onSuccess() {
              // Login successful, you can navigate to the chat or conversation page
        }
        override fun onFailure(code: Int, desc: String) {
              // Login failed, display an error dialog
        }
    })
```

> **Warning：**
> In a production environment, generate UserSig on your server. When UserSig is needed, your app should request a dynamic UserSig from your business server for authentication. See [Server-side UserSig Generation](https://trtc.io/document/34385).
>

### Step 3: Build Conversation List Interface

Use the ConversationList component from TUIKit Compose to build a conversation list page. ConversationList provides the following built-in features:
- Displays the user's conversation list, including C2C Chat and Group conversations

- Supports user actions on individual conversations: pin, delete, clear conversation messages, and more

   You can integrate ConversationList directly into an existing app page or create a new conversation list page. Example UI effect:

 To wrap ConversationList as a conversation list page.kt`. The `ConversationsPage` mainly performs the following tasks:

1. Adds a headerView above the ConversationList.

2. Passes the conversation list cell click event.

   Core sample code:

   ``` swift
   @Composable
   fun ConversationsPage(
       onConversationClick: (ConversationInfo) -> Unit = {},
       editContent: @Composable () -> Unit = {},
   ) {
       val colors = LocalTheme.current.colors
       Column(
           modifier = Modifier
               .fillMaxSize()
               .background(Colors.Transparent)
       ) {

           PageHeader(stringResource(R.string.chat_uikit_chat)) {
               editContent()
           }

           Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
               ConversationList(modifier = Modifier.navigationBarsPadding(), onConversationClick = onConversationClick)
           }
       }
   }
   ```

### Step 4: Build Chat Interface

Use the MessageList and MessageInput components from TUIKit Compose to build a chat page.

MessageList provides the following built-in features:
- Displays C2C Chat or Group message lists

- Supports actions on individual messages: view images in full size, play video or voice messages, copy text, recall messages, delete messages, and more

   MessageInput provides the following built-in features:

- Allows users to compose and send various types of messages: text, emoji, image, voice, video, file, etc.

   You can integrate MessageList and MessageInput directly into an existing app page or create a new chat page. Example UI effect:

 To assemble MessageList and MessageInput as a chat page.kt`. The `ChatPage` mainly performs the following tasks:

1. Adds a headerView at the top to display the conversation name.

2. Arranges MessageList and MessageInput vertically for optimal mobile usability.

   Core sample code:

   ``` swift
   @Composable
   fun ChatPage(
       conversationID: String,
       locateMessage: MessageInfo? = null,
       onUserClick: (String) -> Unit,
       onChatHeaderClick: (String) -> Unit,
       onBackClick: () -> Unit,
   ) {
       ...

       val avatarUrl = conversationState.value?.avatarURL
       val displayName = conversationState.value?.title
       val colors = LocalTheme.current.colors
       Scaffold(
           modifier = Modifier
               .background(color = colors.bgColorOperate)
               .fillMaxSize()
               .wrapContentHeight(), topBar = {
               Box(
                   modifier = Modifier
                       .background(color = colors.bgColorOperate)
                       .fillMaxWidth()
                       .statusBarsPadding()
               ) {
                   ChatHeader(
                       avatarUrl = avatarUrl,
                       name = displayName ?: "",
                       onBackClick = onBackClick,
                       onAvatarClick = {
                           onChatHeaderClick(conversationID)
                       }
                   )
               }
           },
           bottomBar = {
               Box(
                   modifier = Modifier
                       .fillMaxWidth()
                       .background(color = colors.bgColorOperate)
               ) {
                   MessageInput(modifier = Modifier.navigationBarsPadding(), conversationID = conversationID)
               }

           }) { padding ->
           Box(
               modifier = Modifier
                   .padding(padding)
           ) {
               MessageList(conversationID = conversationID, locateMessage = locateMessage) {
                   onUserClick(it)
               }
           }
       }
   }
   ```

### Step 5: Build Contact Interface

Use the ContactList component from TUIKit Compose to build a contacts page. ContactList provides the following built-in features:
- View friend request list

- View joined group list

- Handle group invitations and applications

- Manage blacklist

- View friends

   You can integrate ContactList directly into your existing app or create a new contact list page. Example UI effect:

 To wrap ContactList as a contact list page.kt`. The `ContactsPage` mainly performs the following tasks:

1. Adds a headerView above the ContactList.

2. Passes the contact list cell click event.

   Core sample code:

   ``` swift
   @Composable
   fun ContactsPage(
       onContactClick: (ContactInfo) -> Unit = {},
       onGroupClick: (ContactInfo) -> Unit = {},
       editContent: @Composable () -> Unit = {},
   ) {

       val colors = LocalTheme.current.colors
       Column(
           modifier = Modifier
               .fillMaxSize()
               .background(Colors.Transparent)
       ) {
           PageHeader(stringResource(R.string.chat_uikit_contacts)) {
               editContent()
           }

           Box(
               modifier = Modifier
                   .fillMaxSize()
                   .navigationBarsPadding(), contentAlignment = Alignment.Center
           ) {
               ContactList(onGroupClick = onGroupClick, onContactClick = onContactClick)
           }
       }
   }
   ```

### Step 6: Implement Navigation Logic Between Pages

ConversationsPage, ChatPage, and ContactsPage expose several user click events. You can customize these events to implement navigation between pages:
| <strong>Page</strong> | <strong>Callback</strong> | <strong>Recommended Navigation Logic</strong> |
| --- | --- | --- |
| <strong>ConversationsPage</strong> | <code>onConversationClick: (ConversationInfo) -> Unit</code> | Triggered when a conversation in the list is clicked; recommended to navigate to the chat page (ChatPage). |
| <strong>ContactsPage</strong> | <code>onContactClick: (ContactInfo) -> Unit</code> | Triggered when a contact cell is clicked; recommended to navigate to the user info page (C2CChatSetting). |
| <code>onGroupClick: (ContactInfo) -> Unit</code> | Triggered when a group cell is clicked; recommended to navigate to the group chat page (ChatPage). |  |
| <strong>ChatPage</strong> | <code>onUserClick: (String) -> Unit</code> | Triggered when a user's avatar or nickname in a message is clicked; recommended to navigate to the user info page (C2CChatSetting). |
| <code>onChatHeaderClick: (String) -> Unit</code> | Triggered when the avatar in the navigation bar is clicked; recommended to navigate to the user info page (C2CChatSetting) or group info page (GroupChatSetting). |  |
| <code>onBackClick: () -> Unit</code> | Triggered when the back button is clicked; recommended to return to the previous page. |  |

**chat/demo/app/src/main/java/io/trtc/tuikit/chat/MainActivity.kt** and **chat/demo/app/src/main/java/io/trtc/tuikit/chat/chat/ChatActivity.kt** serve as the glue layer for the above Pages, implementing the callback events for each Page. Core sample code:
``` java
// chat/demo/app/src/main/java/io/trtc/tuikit/chat/MainActivity.kt

// Conversation list cell click navigation
ConversationsPage(onConversationClick = {
    activity?.startActivity(
        Intent(activity, ChatActivity::class.java).apply {
            putExtra("conversationID", it.conversationID)
        }
    )
})

// Contact page navigation
ContactsPage(onGroupClick = {
    ChatSettingActivity.start(context, "", it.contactID, true)
}, onContactClick = {
    ChatSettingActivity.start(context, it.contactID, "", true)
})
```

``` java
// chat/demo/app/src/main/java/io/trtc/tuikit/chat/chat/ChatActivity.kt

// Chat page navigation
ChatPage(
   conversationID = conversationID,
   locateMessage = message,
   onUserClick = {
       handleChatSettingNavigation(it)
   }, onChatHeaderClick = {
       val userID = getUserID(conversationID)
       val groupID = getGroupID(conversationID)
       handleChatSettingNavigation(userID, groupID)
   }, onBackClick = { finish() })
```

## FAQs

### **Login failed with signature error**

Check that the SDKAppID and UserSig are correct, and verify that the UserSig has not expired. You can .

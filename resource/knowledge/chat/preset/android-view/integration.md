TUIKit is a UI component library built on the Chat SDK. It enables rapid implementation of chat, conversation, search, relationship chain, group, and other features through UI components. This document describes how to quickly integrate TUIKit and implement core features.

## Key Concepts

TUIKit provides a complete set of instant messaging UI components. It depends on the **AtomicXCore data layer** and can be used to build various functional pages.
- Page layer: Complete functional pages built on TUIKit components, including ChatPageView, ContactsPageView, and ConversationsPageView. You can use them directly.

- TUIKit (UI component layer): View UI components, not Compose components, built on AtomicXCore. You can embed them into your existing app pages.

- AtomicXCore (data layer): Provides data management and business logic, including various stores and managers.

## Prerequisites
- Android Studio 2022.3.1 or later, JDK 17.

- A physical device or emulator running Android 6.0 or later.

- Your project must support Kotlin, because TUIKit is developed in Kotlin.

- minSdk >= 23.

- A valid Tencent Cloud account and Chat application. See Activate the Service to obtain the following information from the Console:

  - SDKAppID: The ID of the Chat application obtained from the Console. It is the unique identifier of the application.

  - SDKSecretKey: The application secret key.

      > **Version Compatibility Notice:**
      >
      > To ensure a stable build environment, strictly follow the official compatibility requirements:
      >
      > - For compatibility between Gradle, Android Gradle Plugin, JDK, and Android Studio, see the Android official documentation: [Release Notes](https://developer.android.com/build/releases/gradle-plugin#updating-gradle)
      > - For the mapping between Kotlin, Android Gradle Plugin, and Gradle versions, see the Kotlin official documentation: [Kotlin-Gradle Plugin Compatibility](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)
      > We recommend selecting a version combination that fully matches your project requirements according to these guidelines.
      >

## Integrate the TUIKit

### Download the Source Code

Download the source code from the GitHub repository [Tencent-RTC/TUIKit_Android](https://github.com/Tencent-RTC/TUIKit_Android). The project directory structure is as follows:
``` text
TUIKit_Android/
├── atomic_x/              # Base UI component library (required by Chat)
├── call/
│   └── tuicallkit-kt/     # Audio/video call component (required by Chat)
└── chat/
    ├── demo/              # Chat View Demo project
    └── uikit/             # Chat View UI component library
```

### Integrate Components
1. Copy the `chat`, `atomic_x`, and optionally `call` folders from the repository root to your project root directory. The directory structure after copying is as follows:

   ``` text
   YourApplication/
   ├── app/                    # Your app module
   ├── atomic_x/               # Base UI component library (required)
   ├── call/                   # Audio/video call component (optional)
   │   └── tuicallkit-kt/
   ├── chat/                   # Chat source code
   │   ├── demo/               # Demo project (for reference, optional)
   │   └── uikit/              # Chat UIKit component library (required)
   ├── settings.gradle.kts
   └── build.gradle.kts
   ```
2. Add the corresponding modules in `settings.gradle.kts`. Adjust the relative paths based on where you actually place the source code:

【Kotlin DSL】
``` kotlin
// settings.gradle.kts

// Include the Chat UIKit component library (required)
include(":uikit")
project(":uikit").projectDir = file("${settingsDir.path}/chat/uikit")

// Include the AtomicX base UI component library (required)
include(":atomic_x")
project(":atomic_x").projectDir = file("${settingsDir.path}/atomic_x")

// Include the audio/video call component (optional, required for audio/video calls)
include(":tuicallkit-kt")
project(":tuicallkit-kt").projectDir = file("${settingsDir.path}/call/tuicallkit-kt")
```

【Groovy DSL】
``` groovy
// settings.gradle

// Include the Chat UIKit component library (required)
include ':uikit'
project(':uikit').projectDir = new File(settingsDir, 'chat/uikit')

// Include the AtomicX base UI component library (required)
include ':atomic_x'
project(':atomic_x').projectDir = new File(settingsDir, 'atomic_x')

// Include the audio/video call component (optional, required for audio/video calls)
include ':tuicallkit-kt'
project(':tuicallkit-kt').projectDir = new File(settingsDir, 'call/tuicallkit-kt')
```

3. Add dependencies to the app module's `build.gradle.kts`:

【Kotlin DSL】
``` kotlin
// app/build.gradle.kts
dependencies {
    // TUIKit component library (required)
    implementation(project(":uikit"))
    implementation(project(":atomic_x"))
    // Audio/video call (optional)
    implementation(project(":tuicallkit-kt"))
}
```

【Groovy DSL】
``` groovy
// app/build.gradle
dependencies {
    // TUIKit component library (required)
    implementation project(':uikit')
    implementation project(':atomic_x')
    // Audio/video call (optional)
    implementation project(':tuicallkit-kt')
}
```

### Implementation Steps

After completing the integration above, follow these steps to quickly build core UIs such as the conversation list, chat, and contacts with only a few lines of code.

#### Step 1. Configure User Authentication

In [Console > Development Tools > UserSig Tools](https://console.trtc.io/usersig), obtain a UserSig based on the UserID. The UserSig is used for user authentication during login.

> **Description:**
>
> For more UserSig operations, see UserSig Generation & Verification.
>

#### Step 2. User Login

You must log in before using component features. Call the `login` API of `LoginStore` and pass in the sdkAppID, userID, and userSig obtained above for login authentication:
``` java
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.login.LoginStore

LoginStore.shared.login(
    context,
    sdkAppID, // Int, obtained from the Console
    userID,   // String
    userSig,  // String, generated in the Console or on your server
    object : CompletionHandler {
        override fun onSuccess() {
            // Login succeeded. You can navigate to the conversation list or chat page.
        }
        override fun onFailure(code: Int, desc: String) {
            // Login failed. You can show an error dialog.
        }
    }
)
```

> **Note:**
> In a production environment, we recommend generating UserSig on your server. When needed, your app should request a dynamic UserSig from your business server for authentication. For details, see [Generating UserSig on the Server](https://intl.cloud.tencent.com/document/product/1047/34385).
>

#### Step 3. Build the Conversation List UI

To build a conversation list, create `ConversationsPageView` and add it to your layout. It automatically reads recent conversations from local storage. When a conversation is tapped, the `onConversationClick` callback returns the conversation's `conversationID`, which you can use to navigate to the chat UI.
``` kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.chat.uikit.pages.ConversationsPageView

class ConversationActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val conversationsPage = ConversationsPageView(this)
        conversationsPage.setHeaderTitle("Messages")

        // Conversation tap callback. conversationID already includes the c2c_ or group_ prefix.
        conversationsPage.onConversationClick = { conversationID ->
            // Navigate to your chat UI and pass in conversationID. See ChatActivity in Step 4.
        }
        // Optional callbacks for search, starting one-to-one chats, and creating groups.
        conversationsPage.onSearchClick = { /* Navigate to the search page */ }
        conversationsPage.onStartChatClick = { /* Start a one-to-one chat */ }
        conversationsPage.onCreateGroupClick = { /* Create a group */ }

        // Set the conversation list as the page content.
        setContentView(conversationsPage)
    }
}
```

#### Step 4. Build the Chat UI

Use `ChatPageView` to display and send or receive messages. Pass `conversationID` through `setup`. The `conversationID` format is `c2c_<peer UserID>` for one-to-one chats and `group_<GroupID>` for group chats.
``` kotlin
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.chat.uikit.pages.ChatPageView

class ChatActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Material Components theme is required, otherwise ChatPageView may crash at runtime.
        setTheme(com.google.android.material.R.style.Theme_MaterialComponents_Light_NoActionBar)
        super.onCreate(savedInstanceState)

        // conversationID format: "c2c_<peer UserID>" for one-to-one chats, "group_<GroupID>" for group chats.
        val conversationID = intent.getStringExtra("conversationID") ?: return

        val chatPageView = ChatPageView(this)
        chatPageView.setup(conversationID = conversationID)
        setContentView(chatPageView)
    }

    companion object {
        fun start(context: Context, conversationID: String) {
            context.startActivity(Intent(context, ChatActivity::class.java).apply {
                putExtra("conversationID", conversationID)
            })
        }
    }
}
```

> **Note:**
> The Activity that hosts the chat page **must** use a Material Components theme, such as `setTheme(com.google.android.material.R.style.Theme_MaterialComponents_Light_NoActionBar)`. Otherwise, Material controls used inside `ChatPageView` may crash at runtime because required theme attributes are missing.
>

> **Description:**The Demo project provides `ChatActivity`, a chat page encapsulated based on `ChatPageView` with a title bar, unread badges, group event handling, and more. You can reuse it directly or refer to its implementation for customization: `ChatActivity.start(context, conversationID)`.
>

#### Step 5. Build the Contacts UI

Use `ContactsPageView` to display friend lists, group lists, and more. Set click callbacks through `setup`. When a contact or group is tapped, navigate to the corresponding chat UI.
``` kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.chat.uikit.pages.ContactsPageView

class ContactActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val contactsPage = ContactsPageView(this)
        contactsPage.setHeaderTitle("Contacts")
        contactsPage.setup(
            onContactClick = { contactInfo ->
                // Navigate to your chat UI. The one-to-one conversation ID is "c2c_" + contactInfo.userID.
            },
            onGroupClick = { contactInfo ->
                // Navigate to your chat UI. The group conversation ID is "group_" + contactInfo.userID.
            }
        )
        setContentView(contactsPage)
    }
}
```

#### Step 6. Theme Settings (Optional)

TUIKit uses `ThemeStore` to support primary color settings and light/dark theme switching.
``` kotlin
import io.trtc.tuikit.atomicx.theme.Theme
import io.trtc.tuikit.atomicx.theme.ThemeStore

// Set primary color.
ThemeStore.shared(context).setPrimaryColor("#1C66E5")

// Switch between light and dark themes.
ThemeStore.shared(context).setTheme(Theme.lightTheme(context))
// ThemeStore.shared(context).setTheme(Theme.darkTheme(context))
```

## FAQs

##### Using Emoji Packs

To respect emoji design copyrights, the Chat Demo/TUIKit project does not include large emoji image assets. Before commercial release, replace them with emoji packs designed by you or otherwise licensed to you. The default **smiley emoji pack shown below is copyrighted by Tencent Cloud**, and you can use it for free by upgrading to [Chat Pro Plus or Enterprise Edition](https://console.trtc.io/subscription/buy/chat).

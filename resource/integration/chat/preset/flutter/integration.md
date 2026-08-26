TUIKit Flutter is a Flutter UI component library built on the Chat SDK. It provides a complete solution for instant messaging features, including chat, conversation lists, and contact management. This guide walks you through manual integration and core feature implementation.

## Key Concepts

TUIKit offers a full suite of instant messaging UI components, built on the AtomicXCore data layer, allowing you to construct various functional pages.
- **Chat Component Layer**: Functional components built on base components and AtomicXCore, which you can embed into your existing app pages.

- **Base Component Layer**: General UI capabilities and basic interactive components, providing a stable and reusable interface foundation for the Chat Component Layer and business apps.

- **AtomicXCore (Data Layer)**: Handles data management and business logic, including various Stores and Managers.

## Prerequisites
- Flutter >= 3.29.0, Dart >= 3.7.0, Kotlin >= 1.9.

- Android Studio Ladybug | 2024.2.1 or higher, Android Gradle plugin 7.3.1 or higher, JDK 17.

- Xcode 12.0 or higher.

- A valid Tencent Cloud account and Chat application. See [Service Activation](https://trtc.io/document/chat-overview) to obtain the following from the console:

  - **SDKAppID**: The Chat application's unique identifier.

  - **SecretKey**: The application's SecretKey.

      > **Note：**
      >
      > - This project currently supports manual integration only; pub.dev integration is not available.
      > - To maintain a stable build environment, strictly follow official compatibility requirements:
      > - For compatibility between Gradle, Android Gradle Plugin, JDK, and Android Studio, refer to the official Android documentation: [Release Notes](https://developer.android.com/build/releases/gradle-plugin#updating-gradle).
      > - For version mapping between Kotlin, Android Gradle Plugin, and Gradle, refer to the official Kotlin documentation: [Kotlin-Gradle Plugin Compatibility](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin).
      > - Use JDK 17; other versions may cause build failures. See: [Switching Java Versions](https://developer.android.com/build/jdks#kts).
      > We recommend choosing a version combination that matches your project requirements according to the guidelines above.
      >

## Installation and Setup

### Download Source Code
1. Clone the [TUIKit Flutter](https://github.com/Tencent-RTC/TUIKit_Flutter) repository from GitHub:

   ``` xml
   git clone https://github.com/Tencent-RTC/TUIKit_Flutter.git
   ```

   The project directory structure is as follows:

   ``` bash
   atomic-x/
   ├── lib/                            # UI component source code (required for integration)
   │   ├── album_picker/               # Album picker
   │   ├── base_component/             # Base components
   │   └── ...                         # Other components
   ├── assets/                         # Resource files (required for integration)
   ├── ...                             # Others
   chat/
   ├── uikit/lib/src/                  # Functional components
   │   ├── messagelist/                # Message list component
   │   ├── messageinput/               # Message input component
   │   ├── conversationlist/           # Conversation list component
   │   ├── contactlist/                # Contact list component
   │   ├── pages/                      # Page components (reference implementation)
   │       ├── chat_page.dart
   │       ├── contacts_page.dart
   │       ├── conversations_page.dart
   │   └── ...                         # Other UI components
   └── demo/                           # Demo application (optional reference)
   ```

### Integrate Components
1. Copy the entire component directory into your Flutter project. For example, flutter_demo is your sample project, and TUIKit_Flutter is the component source code you downloaded:

2. Add the component to your project's `pubspec.yaml` file:

   ``` bash
     tencent_chat_uikit:
       path: ../TUIKit_Flutter/chat/uikit
   ```

   > **Note：**
   >
   > - You can modify the tuikit_atomic_x dependency in chat/uikit/pubspec.yaml to depend on the online version from pub.
   > - To upgrade, obtain the latest component code from GitHub and overwrite your local TUIKit_Flutter directory.
   > - If you make private modifications that conflict with the remote repository, manually merge and resolve conflicts.

### Project Configuration

Add the required permission configuration for iOS. Open `ios/Podfile` and add the following code at the end of the file:
``` objectivec
post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    target.build_configurations.each do |config|
          config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
          config.build_settings['ENABLE_BITCODE'] = 'NO'
          config.build_settings["ONLY_ACTIVE_ARCH"] = "NO"
        end
    target.build_configurations.each do |config|
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
            '$(inherited)',
            'PERMISSION_MICROPHONE=1',
            'PERMISSION_CAMERA=1',
            'PERMISSION_PHOTOS=1',
          ]
        end
  end
end

```
- **Clean Gradle Global Configuration (Android only):** If you have `~/.gradle/init.gradle` locally, run the following command:

   ``` bash
   # Or delete directly: rm -f ~/.gradle/init.gradle
   mv ~/.gradle/init.gradle ~/.gradle/init.gradle.backup
   ```

   > **Note：**
   >
   > If you do not have a Gradle global configuration file `~/.gradle/init.gradle`, skip this step. If it exists and contains `allprojects.repositories`, you can remove the related content or delete `~/.gradle/init.gradle` (backup recommended) to avoid runtime errors.
   >

- **Configure JDK 17 (Android only):** In your project (for example, under `chat/demo`), add `org.gradle.java.home` to `gradle.properties` to set the JDK 17 path. Replace with your actual JDK 17 full path. Example:

   ``` bash
   # Replace with your actual local JDK 17 full path
   org.gradle.java.home=xx/Java/JavaVirtualMachines/jdk-17.0.6.jdk/Contents/Home
   ```

## Implementation

### Step 1: Configure User Authentication

In the [Tencent RTC Console](https://console.trtc.io/), obtain the UserSig for a given UserID for login authentication.

### Step 2: User Login

Authenticate before using any component features. Call the login API and pass in the SDKAppID, userID, and userSig you obtained above:
``` java
final result = await LoginStore.shared.login(
      sdkAppID: SDKAPPID,
      userID: userID,
      userSig: userSig,
    );
if (result.errorCode == 0) {
    // Login successful, you can navigate to chat or conversation page
} else {
    // Login failed, show error dialog
}
```

> **Caution：**
> In production, generate UserSig on your server. When UserSig is needed, your app should request a dynamic UserSig from your business server for authentication. See [Server-side UserSig Generation](https://trtc.io/document/34385).
>

### Step 3: Build Conversation List Page

Use the ConversationList component from TUIKit Flutter to build a conversation list page. ConversationList provides:
- Displays the user's conversation list, including C2C Chat and Group conversations.

- Supports user actions on conversations: pin, delete, clear messages, and more.

   You can integrate ConversationList into an existing app page or create a new conversation list page. Example UI:

   To wrap ConversationList as a conversation list page, see `chat/uikit/lib/src/pages/conversations_page.dart`. `ConversationsPage` does the following:

1. Adds an AppBar above ConversationList.

2. Implements conversation cell click events.

3. Supports creating conversations and Groups:

  1. Taps the button in the upper right to create a new conversation or Group.

  2. Selects friends from the contact list to start a C2C Chat.

  3. Selects multiple friends to create a Group.

      ``` java
        @override
        Widget build(BuildContext context) {
          return Scaffold(
            appBar: AppBar(
              backgroundColor: colorsTheme.bgColorOperate,
              title: Text(atomicLocale.chat, style: TextStyle(fontSize: 34, fontWeight: FontWeight.w600)),
              centerTitle: false,
              scrolledUnderElevation: 0,
              actions: [],
            ),
            body: Column(
              children: [
                Expanded(
                  child: ConversationList(
                    onConversationClick: (conversation) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ChatPage(
                            conversation: conversation,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        }
      ```

### Step 4: Build a Chat Page

Use the MessageList and MessageInput components from TUIKit Flutter to build a chat page.

MessageList:
- Displays C2C Chat or Group message lists.

- Supports actions on messages: view images, play video/voice, copy text, recall, delete, and more.

   MessageInput:

- Allows users to compose and send messages: text, emoji, image, voice, video, file, etc.

   You can integrate MessageList and MessageInput into an existing app page or create a new chat page. Example UI:

   To assemble MessageList and MessageInput as a chat page, see `chat/uikit/lib/src/pages/chat_page.dart`. `ChatPage` does the following:

1. Adds an AppBar at the top to show the conversation name.

2. Arranges MessageList and MessageInput vertically for mobile user experience.

   ``` java
     @override
     Widget build(BuildContext context) {
       return Scaffold(
         appBar: AppBar(
             backgroundColor: colorsTheme.bgColorOperate,
             titleSpacing: 4.0,
             centerTitle: false,
             title: GestureDetector(
               onTap: _onTitleTap,
               child: Row(
                 mainAxisSize: MainAxisSize.min,
                 children: [
                   Padding(
                     padding: const EdgeInsets.only(right: 8.0),
                     child: Avatar.image(
                       name: widget.conversation.title,
                       url: widget.conversation.avatarURL,
                     ),
                   ),
                   Expanded(
                     child: Text(
                       widget.conversation.title ?? atomicLocale.chat,
                       style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                       overflow: TextOverflow.ellipsis,
                       maxLines: 1,
                     ),
                   ),
                 ],
               ),
             ),
             scrolledUnderElevation: 0.0,
             leading: IconButton.buttonContent(
               content: IconOnlyContent(Icon(Icons.arrow_back_ios, color: colorsTheme.buttonColorPrimaryDefault)),
               type: ButtonType.noBorder,
               size: ButtonSize.l,
               onClick: () => Navigator.of(context).pop(),
             ),
             actions: []),
         body: Column(
           children: [
             MessageList(
               conversationID: widget.conversation.conversationID,
               locateMessage: widget.message,
               onUserClick: (String userID) => _onUserClick(userID),
             ),
             MessageInput(
               conversationID: widget.conversation.conversationID,
             ),
           ],
         ),
       );
     }
   ```

### Step 5: Build a Contact Page

Use the ContactList component from TUIKit Flutter to build a contact page. ContactList allows you to:
- View friend requests.

- View joined Groups.

- Handle Group invitations and applications.

- Manage blacklist.

- View friends.

   You can integrate ContactList into your app or create a new contact list page. Example UI:

   To wrap ContactList as a contact list page, see `chat/uikit/lib/src/pages/contacts_page.dart`. `ContactsPage` does the following:

1. Adds an AppBar above ContactList.

2. Implements contact cell click events.

3. Supports adding contacts and Groups:

  1. Taps the "+" button in the upper right to add contacts or Groups.

  2. Searches for contacts by UserID.

  3. Searches for Groups by GroupID.

      ``` java
        @override
        Widget build(BuildContext context) {
          AtomicLocalizations atomicLocale = AtomicLocalizations.of(context);
          SemanticColorScheme colorsScheme = BaseThemeProvider.colorsOf(context);
          return Scaffold(
            appBar: AppBar(
              backgroundColor: colorsScheme.bgColorOperate,
              title: Text(atomicLocale.contact, style: TextStyle(fontSize: 34, fontWeight: FontWeight.w600),),
              centerTitle: false,
              scrolledUnderElevation: 0,
              actions: [],
            ),
            body: ContactList(
              onGroupClick: (ContactInfo contactInfo) {
                _onGroupClick(context, contactInfo);
              },
              onContactClick: (ContactInfo contactInfo) {
                _onContactClick(context, contactInfo);
              },
            ),
          );
        }
      ```

### Step 6: Improve Navigation Logic Between Pages

ConversationsPage, ChatPage, and ContactsPage provide default user click events. You can customize these events to control navigation between pages:

|Page|Webhook|Recommended Navigation Logic|
|---------|---------|---------|
|**ConversationsPage**|`onConversationClick: (conversation) {}`|Triggered when a conversation in the list is clicked; recommended to navigate to the chat page (ChatPage).|
|**ContactsPage**|`onContactClick: (ContactInfo contactInfo) {}`|Triggered when a contact cell is clicked; recommended to navigate to the user info page (C2CChatSetting).|
|**ContactsPage**|`onGroupClick: (ContactInfo contactInfo) {}`|Triggered when a Group cell is clicked; recommended to navigate to the Group chat page (ChatPage).|
|**ChatPage**|`onUserClick: (String userID) {}`|Triggered when a user's avatar or nickname in a message is clicked; recommended to navigate to the user info page (C2CChatSetting).|
|**ChatPage**|`onChatHeaderClick: () {}`|Triggered when the avatar in the navigation bar is clicked; recommended to navigate to the user info page (C2CChatSetting) or Group info page (GroupChatSetting).|
|**ChatPage**|`onBackClick: () {}`|Triggered when the back button is clicked; recommended to return to the previous page.|

## FAQs

### **What should I do if I encounter errors with** `theme_state` **and** `atomic_localizations` **after integrating the tuikit_atomic_x component?**

The component supports theme color and internationalization string switching. Wrap the root `widget` in your project's `main.dart` file with `ComponentTheme`, and add `AtomicLocalizations.delegate` to the `localizationsDelegates` of `MaterialApp`. See the Demo's `main.dart` file in the source code for reference.

### **What should I do if login fails with a signature error?**

Check that SDKAppID and UserSig are correct, and verify that the UserSig has not expired. .

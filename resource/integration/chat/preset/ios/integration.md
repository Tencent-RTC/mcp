TUIKit SwiftUI is a SwiftUI UI component library built on the Chat SDK, offering a complete solution for instant messaging features such as chat, conversation lists, and contact management. This guide explains how to manually integrate the components and implement core functionalities.

## Key Concepts

TUIKit SwiftUI provides a comprehensive set of instant messaging UI components, built on top of the AtomicXCore data layer, and can be used to construct various functional pages.
- Page Layer: Fully functional pages built using TUIKit SwiftUI components, including ChatPage, ContactsPage, and ConversationsPage. You can use these pages directly in your app.

- TUIKit SwiftUI (UI Component Layer): SwiftUI UI components based on AtomicXCore, which can be embedded into your existing app pages.

- AtomicXCore (Data Layer): Handles data management and business logic, including various Stores and Managers.

## Prerequisites
- Xcode 12.0 or later.

- iOS 14.0 or later.

- Swift 5 or later.

- A valid Tencent Cloud account and Chat application. See [Enable the Service](https://trtc.io/document/74511) to obtain the following information from the console:

  - SDKAppID: The unique identifier for your Chat application, available in the console.

  - SecretKey: The application's SecretKey.

      > **Note：**
      >
      > This project currently only supports manual integration. Integration via package managers such as CocoaPods or SPM is not supported.
      >

## Installation and Setup

### Download Source Code

Clone the [TUIKit SwiftUI](https://github.com/Tencent-RTC/TUIKit_iOS_SwiftUI/tree/main/atomic-x) source code from GitHub:
``` bash
git clone https://github.com/Tencent-RTC/TUIKit_iOS_SwiftUI.git
```

The project directory structure is as follows:
``` bash
atomic-x/
├── Sources/              # UI component source code (required for integration)
│   ├── MessageList/      # Message list component
│   ├── MessageInput/     # Message input component
│   ├── ConversationList/ # Conversation list component
│   ├── ContactList/      # Contact list component
│   ├── BaseComponent/    # Base components
│   └── ...               # Other UI components
├── Resources/            # Resource files (required for integration)
│   ├── assets/           # Image assets
│   └── strings/          # Localization string files
chat/
├── uikit/                # Page components (reference implementation)
│   ├── ChatPage.swift
│   ├── ContactsPage.swift
│   └── ConversationsPage.swift
└── demo/                 # Demo application (optional reference)
```

### Integrate Components

2. Update the local path for each component in your Podfile. The path should point to the location of the TUIKit_iOS_SwiftUI folder relative to your project's Podfile. Common scenarios include:

  - If the TUIKit_iOS_SwiftUI folder is in the **parent directory** of your Podfile: `pod 'AtomicX/Chat', :path => '../TUIKit_iOS_SwiftUI/atomic-x/AtomicX.podspec'`

  - If the TUIKit_iOS_SwiftUI folder is in the **current directory** of your Podfile: `pod 'AtomicX/Chat', :path => './TUIKit_iOS_SwiftUI/atomic-x/AtomicX.podspec'`

  - If the TUIKit_iOS_SwiftUI folder is in a **subdirectory** of your Podfile: `pod 'AtomicX/Chat', :path => '/TUIKit_iOS_SwiftUI/atomic-x/AtomicX.podspec'`

      For example, if your Podfile and TUIKit_iOS_SwiftUI are in the same directory, add the following to your Podfile:

      ``` json
      platform :ios, '14.0'

      target 'Demo' do
        use_frameworks! :linkage => :static

        pod 'AtomicX/Chat', :path => './TUIKit_iOS_SwiftUI/atomic-x/AtomicX.podspec'
        pod 'ChatUIKit', :path => './TUIKit_iOS_SwiftUI/chat/uikit/ChatUIKit.podspec'
        pod 'AtomicXCore', '3.4.0'

      end

      #Pods config
      post_install do |installer|
          installer.pods_project.targets.each do |target|
              target.build_configurations.each do |config|

                  config.build_settings['SWIFT_VERSION'] = '5.0'

                  #Do not strip Swift symbols
                  config.build_settings['STRIP_SWIFT_SYMBOLS'] = 'NO'
                  config.build_settings['DEBUG_INFORMATION_FORMAT'] = 'dwarf-with-dsym'

                  #Fix Xcode14 Bundle target error
                  config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ""
                  config.build_settings['CODE_SIGNING_REQUIRED'] = "NO"
                  config.build_settings['CODE_SIGNING_ALLOWED'] = "NO"
                  config.build_settings['ENABLE_BITCODE'] = "NO"
                  config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = "14.0"

              end
          end
      end

      ```

      3. After updating your Podfile, run the following command to install the local TUIKit SwiftUI components:

      ``` bash
      pod install
      ```

      The `pod install` command will automatically install all required dependencies:

      > **Notice：**
      >
      > - For local integration, to upgrade, download the latest component code from [GitHub](https://github.com/Tencent-RTC/TUIKit_iOS_SwiftUI/tree/main/atomic-x) and overwrite your local TUIKit SwiftUI directory.
      > - If you have made private modifications that conflict with the remote repository, you will need to manually merge and resolve those conflicts.

### Project Configuration
1. **Configure Build Settings**

   In your project's Build Settings, set the following:

  - Swift Language Version: Swift 5.

  - iOS Deployment Target: 14.0 or later.

2. **Configure Info.plist**

   Add the required permissions to your Info.plist:

   ``` xml
     <key>NSCameraUsageDescription</key>
     <string>The app needs access to the camera to take photos and videos</string>
     <key>NSMicrophoneUsageDescription</key>
     <string>The app needs access to the microphone to record audio</string>
     <key>NSPhotoLibraryUsageDescription</key>
     <string>The app needs access to the photo library to select images and videos</string>
   ```

## Implementation

### Step 1: Configure User Authentication

In the [Tencent RTC Console](https://console.trtc.io/), obtain the UserSig for your UserID. UserSig is required for authentication during login.

### Step 2: User Login

You must complete authentication before using any component features. Call the login API and pass the SDKAppID and UserSig you obtained above to authenticate:
``` swift
import AtomicXCore

// User login
LoginStore.shared.login(sdkAppID: sdkAppID, userID: userID, userSig: userSig, completion: { [weak self] result in
      guard let self = self else { return }
      switch result {
      case .success:
          // Login successful, you can navigate to the chat or conversation page
      case .failure(let error):
          // Login failed, you can show an error dialog
      }
  })
```

> **Warning：**
> In a production environment, generate UserSig on your server. When UserSig is needed, your app should request a dynamic UserSig from your business server for authentication. See [Server-side UserSig Generation](https://trtc.io/document/34385).
>

### Step 3: Build the Conversation List Interface

Use the ConversationList component in TUIKit SwiftUI to create a conversation list page. ConversationList includes the following features:
- Displays the user's conversation list, including C2C Chat and Group Chat.

- Supports operations on individual conversations: pin, delete, clear conversation messages, and more.

   You can embed ConversationList directly into your app pages or build a standalone conversation list page. Example UI after assembly:

 To wrap ConversationList as a conversation list page.swift`. The `ConversationsPage` does the following:

1. Adds a headerView above ConversationList.

2. Implements the conversation list cell tap event.

3. Supports creating conversations and groups:

  1. Tapping the "+" button in the top right allows you to create a new conversation or group.

  2. Select a friend from the contact list to start a C2C Chat.

  3. Select multiple friends to create a Group Chat.

      ``` swift
      import AtomicX
      import AtomicXCore
      import SwiftUI

      public struct ConversationsPage: View {
          ...

          public var body: some View {
              VStack(spacing: 0) {
                  headerView
                  ConversationList(
                      onConversationClick: { conversation in
                          // Customize onConversationClick event
                          onShowMessage?(NavigationInfo(conversation: conversation))
                      }
                  )
                  .environmentObject(themeState)
              }
              .onReceive(contactListStore.state.subscribe(StatePublisherSelector(keyPath: \ContactListState.friendList))) { friendList in
                  if self.friendList != friendList {
                      self.friendList = friendList
                  }
              }
              .onAppear {
                  contactListStore.fetchFriendList(completion: { _ in })
              }
              .overlay(
                  // Show this menu when "+" is tapped.
                  ChatsMenuOverlay(
                      showChatsMenu: $showChatsMenu,
                      showStartConversation: $showStartConversation,
                      showUserPicker: $showUserPicker
                  )
              )
              ...
          }
          ...
      }

      private var headerView: some View {
          HStack {
              Text(LocalizedChatString("TabChats"))
                  .font(.system(size: 34, weight: .semibold))
                  .tracking(0.3)
                  .foregroundColor(themeState.colors.textColorPrimary)
                  .background(themeState.colors.listColorDefault)
                  .padding(.leading, 16)
              Spacer()
              if AppBuilderConfig.shared.enableCreateConversation {
                  Button(action: {
                      showChatsMenu.toggle()
                  }) {
                      Image(systemName: "plus")
                          .font(.system(size: 20))
                          .foregroundColor(themeState.colors.buttonColorPrimaryDefault)
                          .frame(width: 28, height: 28)
                          .cornerRadius(14)
                  }
                  .padding(.trailing, 16)
              }
          }
          .padding(.top, 12)
          .padding(.bottom, 16)
      }
      ```

### Step 4: Build the Chat Interface

Use the MessageList and MessageInput components in TUIKit SwiftUI to create a chat page.
- MessageList:

  - Displays C2C Chat or Group Chat message lists.

  - Supports actions on individual messages: view images, play video or voice messages, copy text, recall messages, delete messages, and more.

- MessageInput:

  - Allows users to compose and send various message types: text, emoji, images, voice, video, files, and more.

      You can embed MessageList and MessageInput directly into your app pages or build a complete chat page. Example UI after assembly:

 To assemble MessageList and MessageInput as a chat page.swift`. The `ChatPage` does the following:

1. Adds a headerView at the top to display the conversation name.

2. Arranges MessageList and MessageInput vertically to match mobile usage patterns.

   Core sample code:

   ``` swift
   import AtomicX
   import AtomicXCore
   import SwiftUI

   public struct ChatPage: View {
       ...

       public var body: some View {
           return VStack(spacing: 0) {
               self.navigationBarView

               Divider()
                   .background(self.themeState.colors.strokeColorPrimary)

               VStack(spacing: 0) {
                   MessageList(
                       conversationID: self.conversation.id,
                       listStyle: self.listStyle,
                       locateMessage: self.locateMessage,
                       onUserClick: { userID in
                           onUserAvatarClick?(userID)
                       }
                   )

                   self.messageInputAreaView
               }
               .ignoresSafeArea(.keyboard)
           }
           .toast(toast)
       }

       // Header
       private var navigationBarView: some View {
           HStack {
               Button(action: {
                   onBack?()
               }) {
                   Image(systemName: "chevron.left")
                       .font(.system(size: 18, weight: .semibold))
                       .foregroundColor(themeState.colors.textColorLink)
               }
               .padding(.leading, 16)

               Button(action: {
                   onNavigationAvatarClick?()
               }) {
                   HStack(spacing: 12) {
                       Avatar(
                           url: conversation.avatarURL,
                           name: conversation.title ?? conversation.conversationID,
                           size: .s
                       )

                       VStack(alignment: .leading, spacing: 2) {
                           Text(conversation.title ?? conversation.conversationID)
                               .font(.system(size: 17, weight: .semibold))
                               .foregroundColor(themeState.colors.textColorPrimary)
                               .lineLimit(1)

                           if conversation.type == .group {
                               Text("Group Chat")
                                   .font(.system(size: 12))
                                   .foregroundColor(themeState.colors.textColorSecondary)
                           }
                       }
                   }
               }
               .buttonStyle(PlainButtonStyle())

               Spacer()
           }
           .frame(height: 44)
       }

       // MessageInput
       private var messageInputAreaView: some View {
           VStack(spacing: 0) {
               MessageInput(
                   text: $messageText,
                   conversationID: conversation.id,
                   style: inputStyle,
                   onHeightChange: { height in
                       self.inputAreaHeight = height
                   }
               )
               .padding(.bottom, 8)
           }
       }

       ...
   }
   ```

### Step 5: Build the Contacts Interface

Use the ContactList component in TUIKit SwiftUI to create a contacts page. ContactList includes the following features:
- View friend requests

- View joined groups

- Handle group invitations and applications

- Manage the blacklist

- View friends

   You can embed ContactList directly into your app or build a standalone contacts page. Example UI after assembly:

 To wrap ContactList as a contacts page.swift`. The `ContactsPage` does the following:

1. Adds a headerView above ContactList.

2. Implements the contact list cell tap event.

3. Supports adding contacts and groups:

  1. Tapping the "+" button in the top right allows you to add contacts or groups.

  2. Search for contacts by UserID.

  3. Search for groups by GroupID.

      ``` swift
      import AtomicX
      import AtomicXCore
      import SwiftUI

      public struct ContactsPage: View {
          ...

          public var body: some View {
              VStack(spacing: 0) {
                  headerView
                  ContactList(
                      contactStore: contactStore,
                      onShowMessage: onShowMessage,
                      onContactClick: onContactClick,
                      onGroupClick: onGroupClick,
                      onNewFriendsClick: onNewFriendsClick,
                      onGroupApplicationsClick: onGroupApplicationsClick,
                      onGroupListClick: onGroupListClick,
                      onBlackListClick: onBlackListClick
                  )
              }
              .overlay(
                  Group {
                      if showAddContactMenu {
                          VStack {
                              HStack {
                                  Spacer()
                                  AddContactPopView(
                                      onDismiss: {
                                          showAddContactMenu = false
                                      },
                                      onShowAddFriend: {
                                          showAddFriend = true
                                      },
                                      onShowJoinGroup: {
                                          showJoinGroup = true
                                      }
                                  )
                                  .padding(.trailing, 16)
                                  .padding(.top, 50)
                              }
                              Spacer()
                          }
                          .background(
                              Color.clear
                                  .contentShape(Rectangle())
                                  .onTapGesture {
                                      showAddContactMenu = false
                                  }
                          )
                          .animation(.easeInOut(duration: 0.2), value: showAddContactMenu)
                      }
                  }
              )
              .sheet(isPresented: $showAddFriend) {
                  AddFriendView(contactStore: contactStore)
              }
              .sheet(isPresented: $showJoinGroup) {
                  JoinGroupView(contactStore: contactStore)
              }
          }

          private var headerView: some View {
              HStack {
                  Text(LocalizedChatString("TabContacts"))
                      .font(.system(size: 34, weight: .semibold))
                      .tracking(0.3)
                      .foregroundColor(themeState.colors.textColorPrimary)
                      .padding(.leading, 16)
                  Spacer()
                  Button(action: {
                      showAddContactMenu = true
                  }) {
                      Image(systemName: "plus")
                          .font(.system(size: 20))
                          .foregroundColor(themeState.colors.buttonColorPrimaryDefault)
                          .frame(width: 28, height: 28)
                          .cornerRadius(14)
                  }
                  .padding(.trailing, 16)
              }
              .padding(.top, 12)
              .padding(.bottom, 16)
          }

          ...
      }
      ```

### Step 6: Refine Page Navigation Logic

ConversationsPage, ChatPage, and ContactsPage expose several user interaction events. You can customize these events to implement navigation between pages:
| Page | Webhook | Recommended Navigation Logic |
| --- | --- | --- |
| <strong>ConversationsPage</strong> | <code>onConversationClick: ((NavigationInfo) -> Void)?</code> | Triggered when a conversation is tapped in the conversation list; recommended to navigate to the chat page (ChatPage). |
| <strong>ContactPage</strong> | <code>onContactClick: ((AZOrderedListItem) -> Void)?</code> | Triggered when a contact cell is tapped; recommended to navigate to the contact detail page (C2CChatSetting). |
| <code>onGroupClick: ((AZOrderedListItem) -> Void)?</code> | Triggered when a group cell is tapped; recommended to navigate to the group chat page (ChatPage). |  |
| <strong>ChatPage</strong> | <code>onBack: (() -> Void)?</code> | Triggered when the back button is tapped; recommended to return to the previous page. |
| <code>onUserAvatarClick: ((String) -> Void)?</code> | Triggered when a user avatar is tapped in a message; recommended to navigate to the user info page (C2CChatSetting). |  |
| <code>onNavigationAvatarClick: (() -> Void)?</code> | Triggered when the avatar in the navigation bar is tapped; recommended to navigate to the user info page (C2CChatSetting) or group info page (GroupChatSetting). |  |

**chat/demo/ChatDemo/Pages/HomePage.swift** acts as the glue layer for these pages, implementing the callback events for each page.
``` swift
// Navigate when a conversation list cell is tapped
ConversationsPage(
    onShowMessage: { navigationInfo in
        showChatPage(conversation: navigationInfo.conversation, locateMessage: navigationInfo.locateMessage)
    }
)

// Navigate from the contacts page
ContactsPage(
    onContactClick: { user in
        showContactDetail(user)
    },
    onGroupClick: { group in
        let conversation = createConversationFromGroup(group)
        showChatPage(conversation: conversation)
    }
)

// ChatNavPage wraps ChatPage with a navigation bar
ChatNavPage(
    conversation: conversation,
    locateMessage: currentLocateMessage,
    onBack: {
        dismissChatPage()
    },
    onContactDelete: {
        dismissChatPage()
    },
    onGroupDelete: {
        dismissChatPage()
    },
    onNavigateToChat: { newConversation in
        // First dismiss current chat page, then navigate to the new chat
        dismissChatPage()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            showChatPage(conversation: newConversation)
        }
    }
)
```

## FAQs

### **Login failed with signature error, what should I do?**

Check that your SDKAppID and userSig are correct and that the userSig has not expired. .

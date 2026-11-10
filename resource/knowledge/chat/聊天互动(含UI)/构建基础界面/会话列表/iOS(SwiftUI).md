---
sync_node_id: '206626092524216320'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "会话列表"
  - "iOS（SwiftUI）"
product: "chat"
---
This guide walks you through building a conversation list interface.

## Development Environment Requirements
- Xcode 15 or later

- iOS 15.0 or later

## Prerequisites

Before you start building the interface, make sure you have completed the following steps:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit SwiftUI`.

4. Call the `login` method of `LoginStore` to authenticate with the component.

   > **Notice：**
   > 
   > 1. You only need to log in once each time the app launches.
   > 2. Please confirm that login is successful. We recommend performing subsequent operations in the login success callback.

 If you have not completed the steps above. Otherwise, you may encounter issues when implementing the following features.

   If you have completed these steps, continue below.

## Step Instructions

> **Notice：**
> If you have not sent messages to any users or groups in advance, no conversations will be generated, and the ConversationList will be empty when loaded. To see the effect, send messages to some accounts first to trigger conversation creation. For instructions on sending messages in the chat interface, refer to Build a Chat Interface.
> 

The conversation list interface is built using [ConversationList](https://github.com/Tencent-RTC/TUIKit_iOS_SwiftUI/blob/main/atomic-x/Sources/ConversationList/ConversationList.swift). You can handle conversation cell click events with the `onConversationClick` callback.

If you use our sample code, be sure to fill in the following parameters:
- `sdkAppID`: The sdkAppID you obtained earlier.

- `userID`: The operator's userID, which is user1 created in Quick Start.

- `userSig`: The operator's userSig, which is the userSig for user1 created in Quick Start.

   The conversation list page loads automatically when the app starts. Example code:

   ``` swift
   // ContentView.swift
   import SwiftUI
   
   struct ContentView: View {
       var body: some View {
           ConversationListPage()
       }
   }
   
   // ConversationListPage.swift
   import AtomicX
   import AtomicXCore
   import SwiftUI
   
   public struct ConversationListPage: View {
       @StateObject private var themeState = ThemeState.shared
       @State private var isLoggedIn = false
       @State private var isLoggingIn = true
       @State private var loginError: String? = nil
   
       private let sdkAppID: Int32 = 1234567890 // TODO: Fill in your sdkAppID here
       private let userID = "" // TODO: Fill in your userID here
       private let userSig = "" // TODO: Fill in your generated userSig here
   
       public var body: some View {
           Group {
               if isLoggedIn {
                   conversationListContentView
               } else if isLoggingIn {
                   ProgressView("Logging in...")
               } else {
                   VStack(spacing: 12) {
                       Image(systemName: "exclamationmark.triangle")
                           .font(.system(size: 40))
                           .foregroundColor(.orange)
                       Text(loginError ?? "Login failed")
                           .foregroundColor(.secondary)
                   }
               }
           }
           .environmentObject(themeState)
           .onAppear {
               login()
           }
       }
   
       // MARK: - Conversation List Content
   
       private var conversationListContentView: some View {
           VStack(spacing: 0) {
               navigationBarView
   
               Divider()
                   .background(.gray)
   
               ConversationList(
                   onConversationClick: { conversation in
                       print(">>>>> onConversationClick: \(conversation.conversationID)")
                   }
               )
           }
       }
   
       // MARK: - Navigation Bar
   
       private var navigationBarView: some View {
           HStack {
               Image(systemName: "bubble.left.and.bubble.right.fill")
                   .font(.system(size: 24))
                   .foregroundColor(.gray)
               Text("Conversations")
                   .font(.system(size: 17, weight: .semibold))
                   .foregroundColor(themeState.colors.textColorPrimary)
               Spacer()
           }
           .padding(.horizontal, 16)
           .frame(height: 44)
       }
   
       // MARK: - Login
   
       private func login() {
           guard !userSig.isEmpty else {
               isLoggingIn = false
               loginError = "userSig is empty. Please fill in a valid userSig."
               return
           }
           // Login is required when page appears.
           LoginStore.shared.login(sdkAppID: sdkAppID, userID: userID, userSig: userSig) { result in
               switch result {
               case .success:
                   print(">>>>> Login success, userID: \(userID)")
                   isLoggedIn = true
                   isLoggingIn = false
               case .failure(let error):
                   print(">>>>> Login failed: \(error.code), \(error.message)")
                   loginError = "Login failed: \(error.code), \(error.message)"
                   isLoggingIn = false
               }
           }
       }
   }
   ```

   Sample UI output:

   

## Further Practice

To explore additional interface implementations, you can run the ChatDemo source code locally.

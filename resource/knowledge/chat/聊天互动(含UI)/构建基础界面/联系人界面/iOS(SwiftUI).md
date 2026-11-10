---
sync_node_id: '206626098423173120'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "联系人界面"
  - "iOS（SwiftUI）"
product: "chat"
---
This guide walks you through building a Contacts interface.

## Development Environment Requirements
- Xcode 15 or later

- iOS 15.0 or later

## Prerequisites

Before you start building the interface, ensure the following steps are completed:
1. Create an application in the console.

2. Create at least two user accounts in the console.

3. Integrate `TUIKit SwiftUI`.

4. Call the `login` method of `LoginStore` to authenticate the component.

   > **Notice：**
   > 
   > 1. You only need to log in once each time the app launches.
   > 2. Verify that the login is successful. We recommend performing subsequent operations within the login success callback.

 If you have not completed these four steps. Otherwise, you may encounter issues when implementing the following features.

   If you have completed these steps, continue with the instructions below.

## Step-by-Step Instructions

The Contacts interface is built using [ContactList](https://github.com/Tencent-RTC/TUIKit_iOS_SwiftUI/blob/main/atomic-x/Sources/ContactList/ContactList.swift).

> **Notice：**
> If no contacts have been added previously, the Contacts interface will be empty. As you add contacts, they will appear in the list. For instructions on adding contacts with TUIKit SwiftUI, see Add Contacts.
> 

If you use our sample code directly, make sure to provide the following parameters:
- `sdkAppID`: The `sdkAppID` you obtained earlier.

- `userID`: The operator's `userID`, such as user1 created in Quick Start.

- `userSig`: The operator's `userSig`, which corresponds to user1 created in Quick Start.

   The Contacts interface loads automatically when the app starts. Example code is shown below:

   ``` swift
   // ContentView.swift
   import SwiftUI
   
   struct ContentView: View {
       var body: some View {
           ContactListPage()
       }
   }
   
   // ContactListPage.swift
   import AtomicX
   import AtomicXCore
   import SwiftUI
   
   public struct ContactListPage: View {
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
                   contactListContentView
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
   
       // MARK: - Contact List Content
   
       private var contactListContentView: some View {
           VStack(spacing: 0) {
               navigationBarView
   
               Divider()
                   .background(.gray)
   
               ContactList(
                   onContactClick: { contact in
                       print(">>>>> onContactClick: \(contact.id), title: \(contact.title ?? "")")
                   },
                   onGroupClick: { group in
                       print(">>>>> onGroupClick: \(group.id), title: \(group.title ?? "")")
                   }
               )
           }
       }
   
       // MARK: - Navigation Bar
   
       private var navigationBarView: some View {
           HStack {
               Image(systemName: "person.2.fill")
                   .font(.system(size: 24))
                   .foregroundColor(.gray)
               Text("Contacts")
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

   The runtime effect appears as follows:

   

   ContactList provides default click handling for actions on this interface:

   |Action|Effect|
   |---------|---------|
   |Click **New Contacts**|Shows pending friend requests.|
   |Click **Group Requests**|Shows the list of group join requests.|
   |Click **Group Chats**|Shows all group chats for the currently logged-in account.|
   |Click **Blacklist**|Shows the blacklist for the currently logged-in account.|

## More Practice

You can run the Chat Demo source code locally to explore additional interface implementations.

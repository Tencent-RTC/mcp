## Feature Overview

**TUILiveKit** is a comprehensive live-streaming component. Once integrated, it allows you to quickly implement the following key functional modules for your Android application:

## **Preparations**

### Activate Service

Before using **TUILiveKit**, please .

### Environment Requirements
- **Xcode**: Requires **Xcode 15** or a later version.

- **iOS**: Supports devices running **iOS 14.0** or a later version.

- **CocoaPods environment**: A CocoaPods environment must be installed. If you haven't installed it, please refer to the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html), or follow these steps:

  - **Install CocoaPods using gem**: execute the `sudo gem install cocoapods` command in the terminal to install.

      > **Note:**
      >
      > During the `sudo gem install cocoapods` installation process, you may be prompted to enter your computer's password. Enter the administrator password as prompted.
      >

## Code Integration

### Step 1. Import Components Via CocoaPods
1. **Add Pod dependency:**

  - **If your project already has a Podfile.**

      Add the `pod 'TUILiveKit'` dependency in your project's `Podfile` file. For example:

      ``` ruby
        target 'YourProjectTarget' do
          # Other existing Pod dependencies...
          # Add pod 'TUILiveKit' dependency
          pod 'TUILiveKit'

        end
      ```
  - **If your project does not have a Podfile.**

      Switch to your **.xcodeproj** directory using the `cd` command in the terminal, then execute pod init to create the **Podfile**. After creation, add the `pod 'TUILiveKit'` dependency to your **Podfile**. For example:

      ``` bash
      # If your project directory is /Users/yourusername/Projects/YourProject

      # 1. cd to your .xcodeproj project directory
      cd /Users/yourusername/Projects/YourProject

      # 2. Execute pod init. This command will generate a Podfile in your project directory.
      pod init

      # 3. Add pod 'TUILiveKit' dependency in the generated Podfile file
        target 'YourProjectTarget' do
          # Add pod 'TUILiveKit' dependency
          pod 'TUILiveKit'

        end
      ```
2. **Install components**:

   `cd` to the directory containing the **Podfile** in the terminal, then execute the following command to install the component.

   ``` bash
   pod install
   ```

### Step 2. Project Configuration (Device Permissions)

To use the audio/video features, your application needs to obtain permissions for the microphone and camera. Please add the following two entries to your application's `Info.plist` file, and provide corresponding usage descriptions. These descriptions will be displayed to the user when the system requests permission:
``` bash
<key>NSCameraUsageDescription</key>
<string>TUILiveKit needs camera access to enable video recording with picture</string>
<key>NSMicrophoneUsageDescription</key>
<string>TUILiveKit needs microphone permission to enable sound in recorded videos</string>
```

## Complete Login

After code integration, the next step is to complete the login. All **TUILiveKit** features require a successful login to function properly, so ensure your parameters are configured correctly.

> **Note:**
> In the example code, the login API is called directly. However, in a real-world application, it is highly recommended that you call the **TUILiveKit** login service only after your own user authentication and other internal login processes are complete. This prevents potential business logic confusion or data inconsistency caused by calling the login service too early, and it better aligns with your existing user management system.
>

【Swift】
``` swift
//
//  AppDelegate.swift
//

// 1. Import AtomicXCore
import AtomicXCore

// 2. The example code completes login in didFinishLaunchingWithOptions. Recommendation for you: call the login service after completing your own login service.
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // 3. Call the login API
    LoginStore.shared.login(sdkAppID: 1400000001,                 // replace with the SDKAppID from the service console
                            userID: "denny",                      // replace with your UserID
                            userSig: "xxxxxxxxxxx") { [weak self] result in
// You can calculate a UserSig in the console and fill it in this location
      print("login success")

        guard let self = self else { return }
        switch result {
        case .success():
            print("login success")
        case .failure(let err):
            print("login failed. code: \(err.code), error:\(err.message)")
        }
    }

    return true
}
```

**Login API Parameter Description**
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Int | Get this from <a href="https://console.trtc.io/app">TRTC console > Application management</a>. |
| UserID | String | The unique ID for the current user. Must contain only English letters, numbers, hyphens, and underscores. |
| userSig | String | A ticket for Tencent Cloud authentication. Please note:<br>- <strong>Development Environment</strong>: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a UserSig or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- <strong>Production Environment</strong>: To prevent key leakage, you must use a server-side method to generate UserSig. For details, see Generating UserSig on the Server.<br>For more information, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Handling Login Exceptions (Optional)

`LoginStore` offers login status callbacks to help you handle exceptions, including "**Kicked Offline**" and "**Signature Expired"**:
- **Kicked Offline**: If a user is kicked offline while logged in, the SDK triggers the onKickedOffline callback. Prompt the user in your UI and call LoginStore.shared.login to re-login.

- **Signature Expired:** If the onUserSigExpired callback is triggered, the user's userSig has expired. If their login state is still valid on your backend, request a new userSig and call LoginStore.shared.login to refresh their login.

【Swift】
``` java
// YourLoginService represents the business module responsible for login
class YourLoginService: NSObject {
    private var cancelableSet: Set<AnyCancellable> = []

    // Listen to login status callback
    func subscribeLoginStatus() {
        LoginStore.shared.loginEventPublisher
            .receive(on: RunLoop.main)
            .sink { [weak self] loginEvent in
                guard let self = self else { return }
                switch loginEvent {
                case .kickedOffline:   // User kicked offline callback
                     // Your business code: UI prompt user, then log in again
                    break
                case .loginExpired:    // User signature expired callback
                     // Your business code: If the current user is still logged in on your backend,
                     // you can have your app request a new userSig from your backend and call LoginStore.shared.login to renew the login status.
                   break
                default:
                    break
                }
            }
            .store(in: &self.cancelableSet)
    }
}
```

## Next Steps

Congratulations! You have successfully integrated the **TUILiveKit** component and completed the login. You can now implement features such as host streaming, viewer watching, and the live stream list. Please
| <strong>Feature</strong> | <strong>Description</strong> | <strong>Integration Guide</strong> |
| --- | --- | --- |
| <strong>Video Live Streaming</strong> | Includes a full suite of features such as host broadcasting, audience viewing, interactive co-hosting, beauty filters, gifts, and bullet chat. | - Host Broadcasting<br>- Audience Viewing |
| <strong>Voice Chat Room</strong> | Includes complete business logic such as mic seat management, background music (BGM), gift interactivity, and voice room control. | - Host Broadcasting<br>- Audience Viewing |
| <strong>Live Stream List</strong> | Display the live stream list interface and features, including the live stream list and room information display. | - Live Stream List |

## FAQs

### After executing pod install, why can't I find the latest version of TUILiveKit locally?

If you are unable to install the latest version of TUILiveKit, please follow these steps:
1. In the directory where the **Podfile** is located, delete `Podfile.lock` and `Pods`. You can choose to delete them manually or execute the following command in the terminal:

   ``` bash
   // cd to the directory where Podfile is located

   rm -rf Pods/
   rm Podfile.lock
   ```
2. In the directory where Podfile is located, execute `pod install --repo-update`

   ``` bash
   // cd to the directory where Podfile is located

   pod install --repo-update
   ```

### Do I need to call the login method every time I enter a room?

No. You usually only need to complete one `TUILogin.login` call. We recommend associating `TUILogin.login` and `TUILogin.logout` with your own application's login business logic.

### Is there a sample configuration for the Podfile that I can

You can refer to the [GitHub TUILiveKit Example](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/application/Podfile) project `Podfile` sample file.

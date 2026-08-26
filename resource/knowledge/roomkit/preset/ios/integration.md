TUIRoomKit is a comprehensive multi-party audio and video conferencing solution built on TRTC. It provides a complete set of UI components along with all the core functionality you need to get up and running quickly.

This documentation walks you through integrating TUIRoomKit into your project to enable reliable multi-party audio/video conferencing. You'll also find step-by-step guides for customizing image assets, localizing UI text, and configuring other options—everything you need to build audio/video experiences that align with your brand.

## Prerequisites

### Activate the Service

To activate TUIRoomKit and obtain your trial version, follow the instructions at Activate the Service. You will need your **SDKAppID** and **SDKSecretKey**:
- **SDKAppID**: Required application identifier. Tencent Cloud uses SDKAppID for billing and analytics.

- **SDKSecretKey**: Application secret key for initializing configuration file secret information.

### Environment Setup

Before running the demo, make sure your development environment meets the following requirements:
- **Xcode**: Version 15 or higher required.

- **iOS System**: Compatible with devices running iOS 13.0 or later.

- **CocoaPods**: CocoaPods must be installed. If not, see the [CocoaPods Official Installation Guide](https://guides.cocoapods.org/using/getting-started.html) or follow these steps:

  - **Install CocoaPods via gem**: Run `sudo gem install cocoapods` in your terminal.

      > **Tip:**
      >
      > When running `sudo gem install cocoapods`, you may be prompted for your computer's password. Enter your administrator password as requested.
      >

## Quick Integration

### Step 1: Integrate the TUIRoomKit
1. **Add the Pod Dependency:**

  - **If your project already has a Podfile:**

       Add `pod 'TUIRoomKit'` to your project's Podfile, such as:

      ``` ruby
       target 'YourProjectTarget' do
         # Other existing pod dependencies...
         # Add pod 'TUIRoomKit'
         pod 'TUIRoomKit'
       end
      ```
  - **If your project does not have a Podfile:**

       Use `cd` to navigate to your `.xcodeproj` directory in the terminal, then run `pod init` to create a Podfile. After creation, add `pod 'TUIRoomKit'` to the Podfile, for example:

      ``` bash
       // If your project directory is /Users/yourusername/Projects/YourProject

       // 1. cd to your .xcodeproj project directory
       cd /Users/yourusername/Projects/YourProject

       // 2. Run pod init to generate a Podfile
       pod init

       // 3. Add pod 'TUIRoomKit' to the generated Podfile
       target 'YourProjectTarget' do
         # Add pod 'TUIRoomKit'
         pod 'TUIRoomKit'
       end
      ```
2. **Install the Component:**

   In the terminal, `cd` to the directory containing your Podfile and run:

   ``` bash
   pod install
   ```

### Step 2: Configure the Project

To enable audio/video features, your app must request microphone and camera permissions. Add the following keys and usage descriptions to your `Info.plist` file. These descriptions will be displayed when the system prompts users for permission:
``` ruby
<key>NSCameraUsageDescription</key>
<string>TUIRoomKit requires access to your camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>TUIRoomKit requires access to your microphone</string>
```

### Step 3: Log In

After integrating the code, complete the login process. **This step is required to use TUIRoomKit.** You must log in successfully before accessing any features. Verify that all parameters are correctly configured:

> **Note:**
> In the sample code, login is handled in the `didFinishLaunchingWithOptions` method. In real-world projects, **call the AtomicXCore login service only after your own user authentication and login procedures have completed**. This prevents business logic conflicts and ensures seamless integration with your user management and permission systems.
>

``` swift
import AtomicXCore

// AppDelegate.swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    LoginStore.shared.login(sdkAppID: 1400000001,                  // Replace with your sdkAppID
                            userID: "test_001",                    // Replace with your userID
                            userSig: "xxxxxxxxxxx") { result in    // Replace with your userSig
      switch result {
        case .success(let info):
        debugPrint("login success")
        case .failure(let error):
        debugPrint("login failed code:\(error.code), message:\(error.message)")
      }
    }
    return true
}
```

**Login API Parameter Details:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | Int32 | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| <code>userID</code> | String | Unique user identifier. Use only English letters, numbers, hyphens, and underscores. Avoid using simple IDs like <code>1</code> or <code>123</code> to prevent multi-device login conflicts. |
| <code>userSig</code> | String | Authentication ticket for Tencent Cloud.<br>- For development: Use <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Assistant Tool</a> for a temporary UserSig.<br>- For production: Always generate UserSig server-side to prevent secret key leaks. See Calculating UserSig on the Server.<br>For more details, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

### Step 4: Set Avatar and Nickname

If a user logs in for the first time without avatar or nickname info, use the `setSelfInfo` API from `LoginStore` to set their profile:
``` swift
import AtomicXCore

func setSelfInfo() {
    let userProfile = UserProfile(userID: "test_001",        // Your logged-in userID
                                  nickname: "tom",           // Set nickname
                                  avatarURL: "http://xxx.png")  // Set avatar URL
    LoginStore.shared.setSelfInfo(userProfile: userProfile) { result in
      switch result {
      case .success():
        debugPrint("setSelfInfo success")
      case .failure(let error):
        debugPrint("setSelfInfo failed code:\(error.code), message:\(error.message)")
      }
    }
}
```

**setSelfInfo API Parameter Details:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>userProfile</code> | UserProfile | Yes | Main user info model:<br>- userID: User ID to set.<br>- nickname: Nickname.<br>- avatarURL: Avatar URL. |
| <code>completion</code> | CompletionClosure | No | Callback for the result of setting user info. Returns error code and message if failed. |

### Step 5: Create a Room

`RoomMainView` is the primary interface in TUIRoomKit for multi-party audio/video conferencing. The following example shows how to integrate `RoomMainView` as a room owner.

#### Implementation
1. **Conform to the Routing Navigation Protocol**: TUIRoomKit uses the `RouterContext` protocol to manage page navigation. The host view controller must implement this protocol to handle internal navigation actions such as ending a room or returning to a previous page.

2. **Lazy Load the View**: Instantiate `RoomMainView` lazily in your controller and set its `routerContext` property so it can invoke navigation methods via the protocol.

3. **Configure Room Entry Settings**: Specify whether to automatically enable audio/video devices on entering the room.

4. **Initialize the Room Main Page**: Initialize `RoomMainView` as a room owner.

5. **Add the View to Your Controller**: In `viewDidLoad`, add `RoomMainView` to your view hierarchy and use constraints to fill the controller's view.

   > **Note:**
   >
   > TUIRoomKit's internal navigation is based on standard `UINavigationController` methods (push/pop). Ensure your view controller is either the root controller of a `UINavigationController` or part of its stack. If not, SDK navigation will fail due to the absence of a valid navigation context, resulting in page switching issues.
   >

#### Sample Code
``` swift
import UIKit
import TUIRoomKit
import SnapKit
import AtomicXCore

// YourMainViewController loads the room main page

// 1. YourMainViewController must conform to RouterContext in TUIRoomKit
class YourMainViewController: UIViewController, RouterContext {

    // 2. Lazy load RoomMainView from TUIRoomKit
    private lazy var mainView: RoomMainView = {
        // 3. Configure room entry settings
        var config = ConnectConfig()
        config.autoEnableCamera = true      // Automatically enable camera
        config.autoEnableMicrophone = true  // Automatically enable microphone
        config.autoEnableSpeaker = true     // Automatically enable speaker

        // 4. Initialize room main page as owner
        var options = CreateRoomOptions()
        options.roomName = "roomName"       // Set room name

        let view = RoomMainView(roomID: "roomID", behavior: .create(options: options), config: config)
        view.routerContext = self
        return view
    }()

    public override func viewDidLoad() {
        super.viewDidLoad()
        // 5. Add RoomMainView to the view controller
        view.addSubview(mainView)
        mainView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
}
```

**RoomMainView Constructor Parameter Details:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>roomID</code> | String | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| <code>behavior</code> | RoomBehavior | Initialization source:<br>- <code>create</code>: Room owner creates the room. Requires room creation options.<br>- See CreateRoomOptions Struct Details.<br>- <code>join</code>: Participant joins the room. |
| <code>config</code> | ConnectConfig | Audio/video device control configuration after entering the room. |

**ConnectConfig Parameter Details:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>autoEnableMicrophone</code> | Bool | Automatically enable microphone on room entry.<br>- true: Enable automatically (default).<br>- false: Do not enable automatically. |
| <code>autoEnableCamera</code> | Bool | Automatically enable camera on room entry.<br>- true: Enable automatically (default).<br>- false: Do not enable automatically. |
| <code>autoEnableSpeaker</code> | Bool | Automatically enable speaker on room entry.<br>- true: Enable automatically (default).<br>- false: Do not enable automatically. |

### Step 6: Join a Room

The following example shows how to embed `RoomMainView` for joining as a participant.

#### Implementation
1. **Conform to the Routing Navigation Protocol**: Implement the `RouterContext` protocol in your controller.

2. **Lazy Load the View**: Instantiate `RoomMainView` and set its `routerContext`.

3. **Configure Room Entry Settings**: Specify audio/video device preferences.

4. **Initialize the Room Main Page**: Initialize as a participant.

5. **Add the View to Your Controller**: Add `RoomMainView` and set constraints.

#### Sample Code
``` swift
import UIKit
import TUIRoomKit
import SnapKit
import AtomicXCore
// YourMainViewController loads the room main page

// 1. YourMainViewController must conform to RouterContext in TUIRoomKit
class YourMainViewController: UIViewController, RouterContext {

    // 2. Lazy load RoomMainView from TUIRoomKit
    private lazy var mainView: RoomMainView = {
        // 3. Configure room entry settings
        var config = ConnectConfig()
        config.autoEnableCamera = true      // Automatically enable camera
        config.autoEnableMicrophone = true  // Automatically enable microphone
        config.autoEnableSpeaker = true     // Automatically enable speaker

        // 4. Initialize room main page as participant
        let view = RoomMainView(roomID: "roomID", behavior: .join, config: config)
        view.routerContext = self
        return view
    }()

    public override func viewDidLoad() {
        super.viewDidLoad()
        // 5. Add RoomMainView to the view controller
        view.addSubview(mainView)
        mainView.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
    }
}
```

For detailed parameter descriptions, see RoomMainView Constructor Parameter Details and ConnectConfig Parameter Details.

## Core Features

Once you've integrated `RoomMainView`, your application will offer a full-featured multi-party audio/video conference interface, including member management, device controls, room information display, and more. This is the central functionality of TUIRoomKit.

## Customize UI

> **Note:**
> Customizing UI elements, icons, or text requires modifying the TUIRoomKit source code. When you integrate TUIRoomKit via CocoaPods, it acts as an immutable dependency. Each time you run `pod install`, CocoaPods will:
>
> - Check the version listed in Podfile.lock.
> - Download the corresponding source code from the remote repository.
> - Overwrite files in the Pods/ directory with the original source.
> **Any manual modifications to the Pods/ directory will be lost the next time you run** `pod install`**.**
>
> **Recommended workflow:**
>
> - Fork the official [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_iOS) repository.
> - Make and commit changes to your fork.
> - Update your Podfile to reference your fork and branch:

> `pod 'TUIRoomKit', :git => 'https://github.com/your-username/TUIRoomKit.git', :branch => 'your-branch'`

The `RoomMainView` main page is highly customizable. You can modify the UI to fit your product requirements and interaction scenarios. The following overview details the view components within `RoomMainView` to help you make quick adjustments.

**Component Overview for** `RoomMainView`

|Component|Feature Description|Customization Suggestions|
|---------|---------|---------|
|[RoomMainView](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/RoomMainView.swift)|Main room container, coordinates layout and data among subcomponents.|Adjust background, safe area handling, component visibility logic.|
|[RoomTopBarView](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/Main/RoomTopBarView.swift)|Top navigation bar with room info, camera/audio controls, and exit button.|Replace icons, tweak background transparency, add custom buttons (e.g., recording, window mode).|
|[RoomView](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/Main/RoomView.swift)|Video stream area, waterfall layout for multiple users.|Change layout (rows, columns, spacing), customize page indicator, design empty state views.|
|[RoomViewVideoStreamCell](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/Main/RoomView/RoomViewCell.swift)|User video cell with screen and basic info.|Customize video rendering, user info (avatar, badge), add interactive controls (voice waveform).|
|[RoomBottomBarView](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/Main/RoomBottomBarView.swift)|Bottom toolbar for microphone, camera, and member management.|Rearrange buttons, modify styles (color, size), add business features (screen sharing, in-meeting call, beauty filter).|

## Customize Icons

After integrating TUIRoomKit, you can directly replace icon assets in the component to better match your UI and business needs.

TUIRoomKit manages UI image resources in `TUIRoomKit.xcassets`. Use Xcode's graphical tools to quickly modify custom icons.

**Common Icon Files**

|Icon|Filename|Description|
|---------|---------|---------|
||camera_close.png|Camera off icon.|
||camera_open.png|Camera on icon.|
||room_mic_off_red.png|Microphone off icon.|
||room_mic_on_big.png|Microphone on icon.|
||room_admin_tag.png|Administrator badge icon.|
||room_owner_tag.png|Room owner badge icon.|

## Customize Texts

TUIRoomKit uses the [Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) tool to manage UI text. You can easily adjust text using Xcode's visual tools.

> **Note:**
> The Apple Strings Catalog (.xcstrings) format, introduced in Xcode 15, streamlines localization management. It supports structured formats for plurals, device-specific variants, and more, and is now the recommended localization approach for iOS and macOS apps.
>

## FAQs

### Can't Find the Latest Version of TUIRoomKit After Running pod install?

If you're unable to install the latest version of TUIRoomKit, follow these steps:
1. Delete `Podfile.lock` and the `Pods` directory in your project folder. You can do this manually or run:

   ``` bash
   // cd to the directory containing your Podfile

   rm -rf Pods/
   rm Podfile.lock
   ```
2. Run `pod install --repo-update` in your project directory:

   ``` bash
   // cd to the directory containing your Podfile

   pod install --repo-update
   ```

### Do I Need to Call Login Every Time I Enter a Room?

No. You only need to call `LoginStore.shared.login` once. We recommend linking `LoginStore.shared.login` and `LoginStore.shared.logout` with your own authentication logic.

### Is There a Sample Podfile Configuration I Can Reference?

See the [GitHub TUIKit_iOS Example](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/application) project for a sample Podfile.

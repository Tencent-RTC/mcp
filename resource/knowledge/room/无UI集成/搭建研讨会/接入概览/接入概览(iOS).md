---
sync_node_id: '208869951629824000'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建研讨会"
  - "接入概览"
  - "接入概览（iOS）"
product: "room"
---
This document provides an integration guide for the core features of `AtomicXCore`, enabling developers to rapidly build essential capabilities for large-scale webinars, company-wide meetings, or online education sessions with Atomicx. You have complete flexibility to customize the UI, allowing you to focus on business logic and user experience optimization.

> **What’s the difference between a standard conference and a webinar?**
> 
> - **Standard Conference**: Ideal for small to medium collaborative environments. All participants have equal audio/video privileges, with interactive features such as screen sharing and member management.
> - **Webinar**: Designed for large-scale live presentations, supports unlimited concurrent audience entry. Audience members can use the "Raise Hand" feature to request guest access and participate in discussions. The system is optimized for high-concurrency chat, supporting tens of thousands of participants and professional presentation needs.

## Feature Overview

|**Host**|**Guest**|**Audience**|
|---------|---------|---------|
|Host can start high-definition audio/video streaming, share screens, and manage participants.|Guest can enable their microphone for real-time voice discussions and sharing.|Supports unlimited concurrent audience entry, ultra-low latency viewing, and high-frequency chat. Audience can use "Raise Hand" to request guest access.|
||||

## Core Features

`AtomicXCore` provides all the capabilities you need to build a professional webinar solution:
- **Dual-role system:** Room members are classified as **Guest** (can speak via audio/video) and **Audience** (view-only). The host can dynamically invite audience members to participate or remove guests from the stage.

- **Screen sharing:** Host can share their screen with all participants in real time to assist presentations and facilitate communication.

- **Member and permission management:** Includes guest list, audience list, admin controls, mute/video-off, and other moderation tools.

- **Large-scale message interaction:** Optimized message throttling for rooms with tens of thousands of participants, ensuring stable real-time chat and live comments.

   Core modules of `AtomicXCore` include:

- `RoomStore`: Handles room management tasks, including create, join, and lifecycle operations.

- `RoomParticipantStore`: Manages room participants, including admin settings, guest/audience management, removing participants, device control, and more.

## Preparation

### Step 1: Activate the Service

.**

> **Note:**
> Webinar functionality is built on live streaming capabilities. Make sure you have **claimed the TUILiveKit trial version or activated the official TUILiveKit version** for full functionality.
> 

### Step 2: Environment Requirements
- **Xcode:** Requires **Xcode 15** or later.

- **iOS:** Supports devices running **iOS 14.0** or later.

- **CocoaPods:** CocoaPods must be installed. If not, see [CocoaPods Official Installation Guide](https://guides.cocoapods.org/using/getting-started.html), or follow these steps:

   - **Install CocoaPods via gem:** Run `sudo gem install cocoapods` in your terminal.

      > **Tip:**
      > 
      > You may be prompted to enter your administrator password during `sudo gem install cocoapods`. Enter your password as instructed
      > 

### Step 3: Integrate **AtomicXCore SDK**
1. **Add Pod Dependency:**

   

【If you already have a Podfile】

Add `pod 'AtomicXCore'` to your project's `Podfile`:
``` ruby
target 'YourProjectTarget' do  
    # Other existing Pod dependencies...  
    # Add pod 'AtomicXCore' dependency
    pod 'AtomicXCore'
end
```

【If you do not have a Podfile】

Navigate to your `.xcodeproj` directory using `cd`, then run `pod init` to create a `Podfile`. Add `pod 'AtomicXCore'` as follows:
``` ruby
# If your project directory is /Users/yourusername/Projects/YourProject

# 1. cd to your .xcodeproj directory
cd /Users/yourusername/Projects/YourProject

# 2. Run pod init. After this command, a Podfile will be generated in your project directory.
pod init

# 3. Add pod 'AtomicXCore' dependency to the generated Podfile
target 'YourProjectTarget' do  
    # Add pod 'AtomicXCore' dependency
    pod 'AtomicXCore'
end
```

2. **Install Components:**

   In the terminal, `cd` to the directory containing your `Podfile`, then run:

   ``` bash
   pod install
   ```
3. **Configure App Permissions:** Add camera and microphone usage descriptions to your app's `Info.plist` file.

   ``` ruby
   <key>NSCameraUsageDescription</key>
   <string>TUIRoomKit requires access to your camera</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>TUIRoomKit requires access to your microphone</string>
   ```

   

### Step 4: Implement Login Logic

Call `LoginStore.shared.login` in your project to complete login. **This is required before using any features of** `AtomicXCore`**.**

> **Important:**
> Call `LoginStore.shared.login` only after your application's own user account login succeeds to ensure proper login flow.
> 

``` swift
import AtomicXCore

func login() {
    LoginStore.shared.login(sdkAppID: 1400000001,                  // Replace with your project's sdkAppID
                            userID: "test_001",                    // Replace with your project's userID
                            userSig: "xxxxxxxxxxx") { result in    // Replace with your project's userSig
      switch result {
        case .success(let info):
        debugPrint("login success")
        case .failure(let error):
        debugPrint("login failed code:\(error.code), message:\(error.message)")
      }
    }
}
```

Login API Parameter Description:
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>Int</code> | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| <code>userID</code> | <code>String</code> | Unique ID for the current user. Use only English letters, numbers, hyphens, and underscores. Avoid simple IDs like <code>1</code> or <code>123</code> to prevent multi-device login conflicts. |
| <code>userSig</code> | <code>String</code> | Authentication token for Tencent Cloud.<br>- For development, generate with <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Helper Tool</a>.<br>- For production, always generate UserSig server-side to protect your SecretKey. See Server-side UserSig Generation and <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Setting Up a Webinar Room

### Step 1: Create and Join a Webinar Room

Follow the steps below to set up a webinar room quickly.

> **Tip:**
> For sample code on creating and joining a room as host, see the [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room) open-source project, specifically [RoomMainViewController.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/RoomMainViewController.swift) and [RoomMainView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/RoomMainView.swift).
> 

#### 1. Create and Join Room

**Implementation Steps:**
   1. **Configure room parameters:** Initialize `CreateRoomOptions` to set the room name and configuration.

   2. **Create and join room:** Call `RoomStore.createAndJoinRoom` to perform the operation.

      **Sample Code:**

      ``` swift
      import UIKit
      import AtomicXCore
      
      // RoomMainViewController represents the main room view controller
      class RoomMainViewController: UIViewController {
          private var roomID = "webinar_123456"
      
          // Automatically create and join the room on initialization
          public init() {
              super.init(nibName: nil, bundle: nil)
              createAndJoinRoom(roomID: roomID, roomType: .webinar)
          }
      
          required init?(coder: NSCoder) {
              fatalError("init(coder:) has not been implemented")
          }
      
          private func createAndJoinRoom(roomID: String, roomType: RoomType) {
              // 1. Configure room parameters
              var options = CreateRoomOptions()
              options.roomName = "My Webinar"        // Display name for the room
              options.password = ""                  // Room entry password (leave empty if not needed)
      
              // 2. Set initial room permissions
              options.isAllCameraDisabled = false
              options.isAllMessageDisabled = false
              options.isAllMicrophoneDisabled = false
              options.isAllScreenShareDisabled = false
      
              // 3. Create and join the room
              RoomStore.shared.createAndJoinRoom(roomID: roomID, roomType: roomType, options: options) { [weak self] result in
                  guard let self = self else { return }
                  switch result {
                  case .success():
                      print("Successfully created and joined webinar room")
                  case .failure(let error):
                      print("Failed to create and join webinar room [Error Code: \(error.code)]: \(error.message)")
                  }
              }
          }
      }
      ```

      **createAndJoinRoom API Parameter Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- 0-48 bytes.<br>- Use numbers, English letters, underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>- <code>standard</code>: Standard room.<br>- <code>webinar</code>: Large webinar room.<br>Use <code>webinar</code> for webinar scenarios. |
| <code>options</code> | <code>CreateRoomOptions</code> | Yes | - Room configuration object.<br>- See <a href="#CreateRoomOptionsStruct">CreateRoomOptions Struct</a> documentation. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns error code and message if creation fails. |

      **CreateRoomOptions Struct:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | <code>String</code> | No | - Room name (optional, defaults to empty).<br>- 0-60 bytes.<br>- Supports English/Chinese, numbers, special characters. |
| <code>password</code> | <code>String</code> | No | - Room password (empty means no password).<br>- 0-32 bytes.<br>- Use 4-8 digit numbers for easy input. Avoid plain-text sensitive data. Passwords not supported for webinars; leave empty. |
| <code>isAllMicrophoneDisabled</code> | <code>Bool</code> | No | Disable microphones for all. Only host/admin can open mic. Guests are muted by default.<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllCameraDisabled</code> | <code>Bool</code> | No | Disable cameras for all. Only host/admin can open camera. Guests are video-off by default.<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllScreenShareDisabled</code> | <code>Bool</code> | No | Disable screen sharing for all. Only host/admin can share screen.<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllMessageDisabled</code> | <code>Bool</code> | No | Disable chat for all (mute). Members cannot send messages.<br>- true: Disabled.<br>- false: Enabled (default). |

#### 2. Host/Guest Media Device Capture

In webinar scenarios, permissions depend on role:
- Host: Can capture and stream audio/video, start screen sharing.

- Guest: Can capture and stream audio for real-time discussion.

- Audience: View-only; cannot capture media.

   After entering the room, call `DeviceStore.openLocalCamera` and `DeviceStore.openLocalMicrophone` to enable local capture. Use `startScreenShare` to begin screen sharing (camera must be off when screen sharing starts).

   ``` swift
   import UIKit
   import AtomicXCore
   
   // RoomMainViewController represents the main room view controller
   class RoomMainViewController: UIViewController {
       private let roomID: String
       private static let kAppGroup = "group.com.RPLiveStreamRelease"
   
       public init(roomID: String) {
           self.roomID = roomID
           super.init(nibName: nil, bundle: nil)
           openDevices()
       }
   
       required init?(coder: NSCoder) {
           fatalError("init(coder:) has not been implemented")
       }
   
       private func openDevices() {
           // 1. Enable front camera
           DeviceStore.shared.openLocalCamera(isFront: true, completion: nil)
           // 2. Enable microphone
           DeviceStore.shared.openLocalMicrophone(completion: nil)
           // 3. Start screen sharing (camera must be off for screen sharing)
           // DeviceStore.shared.startScreenShare(appGroup: Self.kAppGroup)
       }
   }
   ```

   > **Note:**
   > 
   > In webinar mode, mobile devices support only one upstream video stream. When the camera is enabled, screen sharing must be disabled, and vice versa.
   > 

   **openLocalCamera API Parameter Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>isFront</code> | <code>Bool</code> | Yes | Use front camera:<br>- true: Enable front camera.<br>- false: Enable rear camera . |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns error code and message if enabling fails. |

#### 3. End Room

To end the room, the host calls `RoomStore.endRoom`. All participants will receive a room end event.
``` swift
import UIKit
import AtomicXCore

// RoomMainViewController represents the main room view controller
class RoomMainViewController: UIViewController {
    private let roomID: String

    public init(roomID: String) {
        self.roomID = roomID
        super.init(nibName: nil, bundle: nil)
        endRoom()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func endRoom() {
        // endRoom permanently terminates the room.
        // Only the host (Owner) can perform this operation. All members are removed and audio/video is forcibly stopped.
        RoomStore.shared.endRoom { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success():
                print("Room ended successfully")
            case .failure(let error):
                print("Failed to end room [Error Code: \(error.code)]: \(error.message)")
            }
        }
    }
}
```

### Step 2: Join a Webinar Room

#### 1. Join Room

To join a room, call `RoomStore.joinRoom`.
``` swift
import UIKit
import AtomicXCore

// RoomMainViewController represents the main room view controller
class RoomMainViewController: UIViewController {
    private let roomID = "webinar_123456"

    public init() {
        super.init(nibName: nil, bundle: nil)
        joinRoom(roomID: roomID, roomType: .webinar)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func joinRoom(roomID: String, roomType: RoomType) {
        // 1. Prepare join parameters
        let targetRoomID = roomID    // Room ID to join
        let roomPassword = ""        // Room password; pass empty string or nil if not set

        // 2. Call RoomStore joinRoom API
        // Checks room existence, user ban, and password correctness
        RoomStore.shared.joinRoom(roomID: targetRoomID, roomType: roomType, password: roomPassword) { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success():
                print("Joined room successfully")
            case .failure(let error):
                print("Failed to join room [Error Code: \(error.code)]: \(error.message)")
            }
        }
    }
}
```

**joinRoom API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | <code>String</code> | Yes | - Unique room identifier.<br>- 0-48 bytes.<br>- Use numbers, English letters, underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | <code>RoomType</code> | Yes | Room type:<br>- <code>standard</code>: Standard room.<br>- <code>webinar</code>: Large webinar room.<br>Use <code>webinar</code> for webinar scenarios. |
| <code>password</code> | <code>String</code> | No | - Room password (empty means no password).<br>- 0-32 bytes.<br>- Use 4-8 digits for mobile input. Avoid plain-text sensitive data. Passwords not supported for webinars; leave empty. |
| <code>completion</code> | <code>CompletionClosure</code> | No | Completion callback. Returns error code and message if join fails. |

#### 2. Leave Room

To leave a room, call `RoomStore.leaveRoom`.
``` swift
import UIKit
import AtomicXCore

// RoomMainViewController represents the main room view controller
class RoomMainViewController: UIViewController {
    private let roomID: String

    public init(roomID: String) {
        self.roomID = roomID
        super.init(nibName: nil, bundle: nil)
        leaveRoom()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func leaveRoom() {
        // leaveRoom is for regular members or hosts to exit the room.
        // If the host leaves, only they exit; the room remains active.
        // Stops audio/video streaming and notifies the server to remove the user
        RoomStore.shared.leaveRoom { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .success():
                print("Left room successfully")
            case .failure(let error):
                print("Failed to leave room [Error Code: \(error.code)]: \(error.message)")
            }
        }
    }
}
```

### Step 3: Bind Video View

The `RoomView` component encapsulates webinar streaming logic. Simply render `RoomView` in your page to enable audio/video capabilities for the webinar room. Video rendering uses TUIRoomKit components.

`RoomView` built-in capabilities:
- Host: Supports video and screen sharing.

- Guest: Automatically plays host's real-time audio/video stream.

- Audience: Automatically pulls and plays ultra-low latency live streams, delivering a seamless viewing experience at scale.

   > **Tip:**
   > 
   > `RoomView` is the component for rendering room video streams. For full implementation, refer to [RoomView.swift](https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/room/Source/View/Main/RoomView.swift) in the [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_iOS/tree/main/room) open-source project.
   > 

   ``` swift
   import UIKit
   import Combine
   import AtomicXCore
   import TUIRoomKit
   
   // RoomMainViewController represents the main room view controller
   class RoomMainViewController: UIViewController {
   
       private var roomID: String    
       private var roomType: RoomType
   
       private lazy var roomView: RoomView = {
           let roomView = RoomView(roomID: roomID, roomType: roomType)
           return roomView
       }()
   
       init(roomID: String, roomType: RoomType) {
           self.roomID = roomID
           self.roomType = roomType
           super.init()
           view.addSubview(roomView)
   
           roomView.snp.makeConstraints { make in
               make.edges.equalToSuperview()
           }
       }
   
       required init?(coder: NSCoder) { fatalError() }
   }
   ```

### Step 4: Manage Guest/Audience Roles

As host or admin, call `RoomParticipantStore.promoteAudienceToParticipant` to promote an audience member to guest.

Call `RoomParticipantStore.demoteParticipantToAudience` to demote a guest back to audience.
``` swift
import Combine
import AtomicXCore

func promoteAudienceToParticipant(userID: String) {
    // Prerequisite: Must have entered the room.
    // Create RoomParticipantStore instance using roomID

    var participantStore: RoomParticipantStore = RoomParticipantStore.create(roomID: "webinar_123456")

    // Promote audience to guest (host/admin only)
    participantStore.promoteAudienceToParticipant(userID: userID) { result in
      switch result {
      case .success():
        print("Promoted to guest successfully")
      case .failure(let err):
        print("Failed to promote to guest Error Code: \(err.code), Error Message: \(err.message)")
      }
    }
}

func demoteParticipantToAudience(userID: String) {
    // Prerequisite: Must have entered the room.
    // Create RoomParticipantStore instance using roomID
    var participantStore: RoomParticipantStore = RoomParticipantStore.create(roomID: "webinar_123456")

    // Demote guest to audience (host/admin only)
    participantStore.demoteParticipantToAudience(userID: userID) { result in
      switch result {
      case .success():
        print("Demoted guest to audience successfully")
      case .failure(let err):
        print("Failed to demote guest to audience Error Code: \(err.code), Error Message: \(err.message)")
      }
    }
}
```

### Step 5: Listen to Room Events

After entering the room, call `RoomStore.addRoomListener` to subscribe to room events via `roomEventPublisher`.
``` swift
import UIKit
import Combine
import AtomicXCore

// RoomMainViewController represents the main room view controller
class RoomMainViewController: UIViewController {
    private let roomID: String

    // Store Combine subscriptions to prevent listener loss
    private var cancellableSet = Set<AnyCancellable>()

    public init(roomID: String) {
        self.roomID = roomID
        super.init(nibName: nil, bundle: nil)
        // Start event listening on initialization
        subscribeRoomEvents()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func subscribeRoomEvents() {
        // Access RoomStore's roomEventPublisher
        // Publishes events throughout the room lifecycle (call, dissolve, reminders, etc.)
        RoomStore.shared.roomEventPublisher
            .receive(on: RunLoop.main) // Ensure UI updates on main thread
            .sink { [weak self] event in
                guard let self = self else { return }

                // Business logic based on event type
                switch event {
                case .onRoomEnded(let roomInfo):
                    print("The current room has ended")
                // ... handle other RoomEvent events ...
                default: break
                }
            }
            .store(in: &cancellableSet) // Store subscription
    }
}
```

## API Documentation

|**Store/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Room lifecycle management: create/join, join, leave, end room, update/get room info, subscribe to room events (dissolution, updates)|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomstore/)|
|**RoomParticipantStore**|Room member management: set admin, transfer host, get guest list, get audience list, remove from room, guest device control|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/roomparticipantstore/)|
|**DeviceStore**|Audio/video device status and device operation APIs|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore)|
|**LoginStore**|AtomicXCore login: login and retrieve login user information|[API Documentation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/loginstore)|

## FAQ

### rsync fails to copy third-party library resources due to insufficient permissions?

When integrating SnapKit in Xcode, you may see an error like:
``` plaintext
rsync(xxxx):1:1: SnapKit.framework/SnapKit_Privacy.bundle/: mkpathat: Operation not permitted
```

#### Cause

Xcode's **script sandboxing** restricts write permissions for the `rsync` script during the build process, preventing copying of `SnapKit_Privacy.bundle` inside the framework.

#### Solution Steps
1. Disable user script sandboxing. In your Xcode project, go to **Build Settings**, search for `User Script Sandboxing` (or `ENABLE_USER_SCRIPT_SANDBOXING`), and set it from `YES` to `NO`.

2. Clean and rebuild the project: use **Product → Clean Build Folder** to clear cache, then recompile and run.

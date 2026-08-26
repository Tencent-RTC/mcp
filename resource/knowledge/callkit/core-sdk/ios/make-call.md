This guide walks you through implementing the "Make a Call" feature using the **AtomicXCore SDK**, leveraging the **DeviceStore**, **CallStore**, and the core UI component **CallCoreView**.

## Core Features

To build multi-party audio/video calling scenarios with **AtomicXCore**, you’ll use the following three core modules:

|**Module**|**Description**|
|---------|---------|
|[CallCoreView](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview)|Core call UI component. Automatically observes CallStore data and renders video streams, with support for UI customization such as layout switching, avatar and icon configuration.|
|[CallStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore)|Manages the call lifecycle: make, answer, reject, and hang up calls. Provides real-time access to participant audio/video status, call duration, call history, and more.|
|[DeviceStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore)|Controls audio/video devices: microphone (toggle/on/off, volume), camera (toggle/on/off, switch, quality), screen sharing, and real-time device status monitoring.|

## Getting Started

### Step 1: Activate the Service

Follow the Activate the service guide to obtain either a trial or paid version of the SDK.

### Step 2: Integrate the SDK
1. **Add Pod dependency:** Add `pod 'AtomicXCore'` to your project's `Podfile`.

   ``` ruby
   target 'YourProjectTarget' do
     pod 'AtomicXCore'
   end
   ```

   > **Tips：**
   >
   > If your project doesn’t have a Podfile, navigate to your `.xcodeproj` directory in the terminal and run `pod init` to create one.
   >

2. **Install the component:** In the terminal, go to the directory containing your Podfile and run:

   ``` bash
   pod install --repo-update
   ```

   > **Tips：**
   >
   > After installation, open your project using the `YourProjectName.xcworkspace` file.
   >

### Step 3: Initialize and Log In

To start the call service, initialize CallStore and log in the user in sequence. CallStore automatically syncs user information after a successful login and enters the ready state. The following flowchart and sample code illustrate the process:

``` swift
import UIKit
import AtomicXCore
import Combine

class ViewController: UIViewController {
    var cancellables = Set<AnyCancellable>()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Initialize CallStore
        let _ = CallStore.shared

        // Set up user information
        let userID = "test_001"                    // Replace with your UserID
        let sdkAppID: Int = 1400000001             // Replace with your SDKAppID from the console
        let secretKey = "**************"           // Replace with your SecretKey from the console

        // Generate UserSig (for local testing only; always generate UserSig on your server in production)
        let userSig = GenerateTestUserSig.genTestUserSig(
            userID: userID,
            sdkAppID: sdkAppID,
            secretKey: secretKey
        )

        // Log in
        LoginStore.shared.login(
            sdkAppID: sdkAppID,
            userID: userID,
            userSig: userSig
        ) { result in
            switch result {
            case .success:
                Log.info("login success")
                // Initialize TUICallEngine
                TUICallEngine.createInstance().`init`(Int32(sdkAppID), userId: userID, userSig: userSig) {
                    Log.info("TUICallEngine init success")
                } fail: { code, message in
                    Log.error("TUICallEngine init failed, code: \(code), message: \(message ?? "")")
                }

            case .failure(let error):
                Log.error("login failed, code: \(error.code), error: \(error.message)")
            }
        }
    }
}
```
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| userID | String | Unique identifier for the current user. Only letters, numbers, hyphens, and underscores are allowed. Avoid using simple IDs like 1 or 123 to prevent multi-device login conflicts. |
| sdkAppID | int | Obtain from the <a href="https://trtc.io/login?fro=gt&s_url=https%3A%2F%2Fconsole.trtc.io%2F">console</a>. |
| secretKey | String | SDKSecretKey for your audio/video application, created in the <a href="https://trtc.io/login?fro=gt&s_url=https%3A%2F%2Fconsole.trtc.io%2F">console</a>. |
| userSig | String | Authentication token for TRTC.<br>- Development: Use the local <a href="https://github.com/Tencent-RTC/TUIKit_iOS/blob/main/application/Debug/GenerateTestUserSig.swift">GenerateTestUserSig.genTestUserSig</a> function or the <a href="https://console.trtc.io/usersig">UserSig Tool</a> to generate a temporary UserSig.<br>- Production: Always generate UserSig server-side to prevent SecretKey leakage. See Server-side UserSig Generation. For more details, see How to calculate and use UserSig. |

## Implementation Steps

**Before making a call, ensure the user is logged in**—this is required for the service to function. The following five steps outline how to implement the "Make a Call" feature.

### Step 1: Create the Call Interface

You need to create a call screen that is displayed when a call is initiated.
1. **Create the call screen:** Implement a new UIViewController to serve as the call interface. This will be used for both outgoing and incoming calls.

2. **Attach** [CallCoreView](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/)**:** Add the core call view component to your call screen. CallCoreView automatically observes **CallStore** data and renders video streams, with options for customizing layout, avatars, and icons.

   ``` swift
   import UIKit
   import AtomicXCore

   class CallViewController: UIViewController {
       override func viewDidLoad() {
           super.viewDidLoad()
           view.backgroundColor = .black
           // Attach CallCoreView to the call screen
           callCoreView = CallCoreView(frame: view.bounds)
           callCoreView?.autoresizingMask = [.flexibleWidth, .flexibleHeight]
           if let callCoreView = callCoreView {
               view.addSubview(callCoreView)
           }
       }
   }
   ```

   **CallCoreView Feature Overview:**

   |**Feature**|**Description**|**Reference**|
   |---------|---------|---------|
   |Set Layout Mode|Switch between layout modes. If not set, layout adapts automatically based on participant count.|Switch Layout Mode|
   |Set Avatar|Customize avatars for specific users by providing avatar resource paths.|Customize Default Avatar|
   |Set Volume Indicator Icon|Set custom volume indicator icons for different volume levels.|Customize Volume Indicator Icon|
   |Set Network Indicator Icon|Set network status indicator icons based on real-time network quality.|Customize Network Indicator Icon|
   |Set Waiting Animation for Users|Support GIF animations for users in waiting state during multi-party calls.|Step 2: Add Call Control Buttons|

### Step 2: Add Call Control Buttons

Use the APIs from [**DeviceStore**](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore) and [**CallStore**](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore) to implement custom call control buttons.
- **DeviceStore Controls:** Microphone (toggle/on/off, volume), camera (toggle/on/off, switch, quality), screen sharing, and real-time device status monitoring. Bind button actions to the corresponding methods, and update button UI in real time by observing device status changes.

- **CallStore Controls:** Answer, hang up, reject, and other core call actions. Bind button actions to the appropriate methods and observe call status to keep the UI in sync.

- **Icon Resources:** Download button icons from [GitHub](http://github.com/Tencent-RTC/TUIKit_iOS/tree/main/call/TUICallKit_Swift/Resources/Assets.xcassets). These icons are designed for TUICallKit and are free to use.

| <strong>Icons:</strong> |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

- **Example: Adding Hang Up, Microphone, and Camera Buttons**

  1. **Add Hang Up Button:** Create and add a hang up button. When tapped, call `hangup` and close the call screen.

      ``` swift
      import UIKit
      import AtomicXCore
      import Combine

      class CallViewController: UIViewController {
          private lazy var buttonHangup: UIButton = {
              let buttonWidth: CGFloat = 80
              let buttonHeight: CGFloat = 80
              let spacing: CGFloat = 30
              let bottomMargin: CGFloat = 80

              let totalWidth = buttonWidth * 3 + spacing * 2
              let startX = (view.bounds.width - totalWidth) / 2
              let buttonY = view.bounds.height - bottomMargin - buttonHeight

              let button = createButton(
                  frame: CGRect(x: startX + (buttonWidth + spacing) * 2, y: buttonY, width: buttonWidth, height: buttonHeight),
                  title: "hangup"
              )
              button.backgroundColor = .systemRed
              button.addTarget(self, action: #selector(touchHangupButton), for: .touchUpInside)
              return button
          }()

          override func viewDidLoad() {
              super.viewDidLoad()
              // Other initialization code
              // 1. Add a hang-up button
              view.addSubview(buttonHangup)
          }

          @objc private func touchHangupButton() {
              // 2. Call the hangup API in the click event and destroy the page
              CallStore.shared.hangup(completion: nil)
          }

          private func createButton(frame: CGRect, title: String) -> UIButton {
              let button = UIButton(type: .system)
              button.frame = frame
              button.setTitle(title, for: .normal)
              button.setTitleColor(.white, for: .normal)
              button.backgroundColor = UIColor(white: 0.3, alpha: 0.8)
              button.layer.cornerRadius = frame.width / 2
              button.titleLabel?.font = UIFont.systemFont(ofSize: 14)
              return button
          }
      }
      ```
  2. **Add Microphone Toggle Button:** Create and add a microphone toggle button. When tapped, call [openLocalMicrophone](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore/openlocalmicrophone(completion:)) or [closeLocalMicrophone](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore/closelocalmicrophone()).

      ``` swift
      import UIKit
      import AtomicXCore
      import Combine

      class CallViewController: UIViewController {
          private lazy var buttonMicrophone: UIButton = {
              let buttonWidth: CGFloat = 80
              let buttonHeight: CGFloat = 80
              let spacing: CGFloat = 30
              let bottomMargin: CGFloat = 80
              let totalWidth = buttonWidth * 3 + spacing * 2
              let startX = (view.bounds.width - totalWidth) / 2
              let buttonY = view.bounds.height - bottomMargin - buttonHeight

              let button = createButton(
                  frame: CGRect(x: startX + buttonWidth + spacing, y: buttonY, width: buttonWidth, height: buttonHeight),
                  title: "Microphone"
              )
              button.addTarget(self, action: #selector(touchMicrophoneButton), for: .touchUpInside)
              return button
          }()

          override func viewDidLoad() {
              super.viewDidLoad()
              // Other initialization code
              // 1. Add a microphone toggle button
              view.addSubview(buttonMicrophone)
          }

          // 2. Toggle the microphone (on/off) in the click event
          @objc private func touchMicrophoneButton() {
              let microphoneStatus = DeviceStore.shared.state.value.microphoneStatus
              if microphoneStatus == .on {
                  DeviceStore.shared.closeLocalMicrophone()
              } else {
                  DeviceStore.shared.openLocalMicrophone(completion: nil)
              }
          }

          // Helper method to create circular buttons
          private func createButton(frame: CGRect, title: String) -> UIButton {
              let button = UIButton(type: .system)
              button.frame = frame
              button.setTitle(title, for: .normal)
              button.setTitleColor(.white, for: .normal)
              button.backgroundColor = UIColor(white: 0.3, alpha: 0.8)
              button.layer.cornerRadius = frame.width / 2
              button.titleLabel?.font = UIFont.systemFont(ofSize: 14)
              return button
          }
      }
      ```
  3. **Add Camera Toggle Button:** Add a camera toggle button to the bottom toolbar. When tapped, call [openLocalCamera](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore/openlocalcamera(isfront:completion:)) or [closeLocalCamera](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/devicestore/closelocalcamera()).

      ``` swift
      import UIKit
      import AtomicXCore
      import Combine

      class CallViewController: UIViewController {
          private lazy var buttonCamera: UIButton = {
              let buttonWidth: CGFloat = 80
              let buttonHeight: CGFloat = 80
              let spacing: CGFloat = 30
              let bottomMargin: CGFloat = 80
              let totalWidth = buttonWidth * 3 + spacing * 2
              let startX = (view.bounds.width - totalWidth) / 2
              let buttonY = view.bounds.height - bottomMargin - buttonHeight

              let button = createButton(
                  frame: CGRect(x: startX, y: buttonY, width: buttonWidth, height: buttonHeight),
                  title: "Camera" // Camera
              )
              button.addTarget(self, action: #selector(touchCameraButton), for: .touchUpInside)
              return button
          }()

          override func viewDidLoad() {
              super.viewDidLoad()
              // Other initialization code
              // 1. Add camera toggle button
              view.addSubview(buttonCamera)
          }

          // 2. Camera button click event
          @objc private func touchCameraButton() {
              let cameraStatus = DeviceStore.shared.state.value.cameraStatus
              if cameraStatus == .on {
                  DeviceStore.shared.closeLocalCamera()
              } else {
                  let isFront = DeviceStore.shared.state.value.isFrontCamera
                  DeviceStore.shared.openLocalCamera(isFront: isFront, completion: nil)
              }
          }

          // Helper method to create circular buttons
          private func createButton(frame: CGRect, title: String) -> UIButton {
              let button = UIButton(type: .system)
              button.frame = frame
              button.setTitle(title, for: .normal)
              button.setTitleColor(.white, for: .normal)
              button.backgroundColor = UIColor(white: 0.3, alpha: 0.8)
              button.layer.cornerRadius = frame.width / 2
              button.titleLabel?.font = UIFont.systemFont(ofSize: 14)
              return button
          }
      }
      ```
  4. **Update Button Labels in Real Time:** Observe microphone and camera status and update button labels accordingly.

      ``` swift
      import UIKit
      import AtomicXCore
      import Combine

      class CallViewController: UIViewController {
          private var cancellables = Set<AnyCancellable>()

          override func viewDidLoad() {
              super.viewDidLoad()
              // Other initialization code
              // 1. Observe microphone and camera status
              observeDeviceState()
          }

          private func observeDeviceState() {
              DeviceStore.shared.state.subscribe()
                  .map { $0.cameraStatus }
                  .removeDuplicates()
                  .receive(on: DispatchQueue.main)
                  .sink { [weak self] cameraStatus in
                      // 2. Update camera button text
                      let title = cameraStatus == .on ? "Turn Off Camera" : "Turn On Camera"
                      self?.buttonCamera?.setTitle(title, for: .normal)
                  }
                  .store(in: &cancellables)

              DeviceStore.shared.state.subscribe()
                  .map { $0.microphoneStatus }
                  .removeDuplicates()
                  .receive(on: DispatchQueue.main)
                  .sink { [weak self] microphoneStatus in
                      // 2. Update microphone button text
                      let title = microphoneStatus == .on ? "Turn Off Mic" : "Turn On Mic"
                      self?.buttonMicrophone?.setTitle(title, for: .normal)
                  }
                  .store(in: &cancellables)
          }
      }
      ```

### Step 3: Request Microphone/Camera Permissions

Check for audio/video permissions before starting a call. If permissions are missing, prompt the user to grant them.
1. **Declare permissions:** Add the following keys to your app’s `Info.plist` with appropriate usage descriptions. These will be shown to users when the system requests permissions:

   ``` xml
   <key>NSCameraUsageDescription</key>
   <string>Camera access is required for video calls and group video calls.</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>Microphone access is required for audio calls, group audio calls, video calls, and group video calls.</string>
   ```
2. **Request permissions dynamically:** Request audio/video permissions based on the call media type when initiating a call.

   ``` swift
   import AVFoundation
   import UIKit

   extension UIViewController {

       // Check microphone permission
       func checkMicrophonePermission(completion: @escaping (Bool) -> Void) {
           let status = AVCaptureDevice.authorizationStatus(for: .audio)

           switch status {
           case .authorized:
               completion(true)

           case .notDetermined:
               AVCaptureDevice.requestAccess(for: .audio) { granted in
                   DispatchQueue.main.async {
                       completion(granted)
                   }
               }

           case .denied, .restricted:
               completion(false)

           @unknown default:
               completion(false)
           }
       }

       // Check camera permission
       func checkCameraPermission(completion: @escaping (Bool) -> Void) {
           let status = AVCaptureDevice.authorizationStatus(for: .video)

           switch status {
           case .authorized:
               completion(true)

           case .notDetermined:
               AVCaptureDevice.requestAccess(for: .video) { granted in
                   DispatchQueue.main.async {
                       completion(granted)
                   }
               }

           case .denied, .restricted:
               completion(false)

           @unknown default:
               completion(false)
           }
       }

       // Show permission alert
       func showPermissionAlert(message: String) {
           let alert = UIAlertController(
               title: "Permission Required", // Permission Required
               message: message,
               preferredStyle: .alert
           )

           alert.addAction(UIAlertAction(title: "Settings", style: .default) { _ in // Settings
               if let url = URL(string: UIApplication.openSettingsURLString) {
                   UIApplication.shared.open(url)
               }
           })

           alert.addAction(UIAlertAction(title: "Cancel", style: .cancel)) // Cancel
           present(alert, animated: true)
       }
   }
   ```

### Step 4: Make a Call

After calling [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)), navigate to the call screen. For the best user experience, automatically enable the microphone or camera based on the media type.
1. **Initiate the call:** Call `calls` to start a call.

2. **Enable media devices:** After the call is initiated, enable the microphone. If it’s a video call, also enable the camera.

3. **Present the call screen:** On successful call initiation, present the call screen.

   ``` swift
   import UIKit
   import AtomicXCore
   import Combine

   class MainViewController: UIViewController {
       // 1. Initiate a call
       private func startCall(userIdList: [String], mediaType: CallMediaType) {
           var params = CallParams()
           params.timeout = 30  // Set call timeout to 30 seconds

           CallStore.shared.calls(
               participantIds: userIdList,
               callMediaType: mediaType,      // Call type: .audio or .video
               params: params
           ) { [weak self] result in
               switch result {
               case .success:
                   // 2. Enable media devices
                   self?.openDevices(for: mediaType)
                   // 3. Launch the call interface
                   DispatchQueue.main.async {
                       let callVC = CallViewController()
                       callVC.modalPresentationStyle = .fullScreen
                       self?.present(callVC, animated: true)
                   }

               case .failure(let error):
                   Log.error("Failed to initiate call: \(error)")
               }
           }
       }

       private func openDevices(for mediaType: CallMediaType) {
           DeviceStore.shared.openLocalMicrophone(completion: nil)
           if mediaType == .video {
               let isFront = DeviceStore.shared.state.value.isFrontCamera
               DeviceStore.shared.openLocalCamera(isFront: isFront, completion: nil)
           }
       }
   }
   ```

   **calls API Parameter Reference:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| participantIds | List<String> | Yes | A list of target user IDs. |
| callMediaType | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype">CallMediaType</a> | Yes | The media type of the call, used to specify whether to initiate an audio or video call.<br>- <code>CallMediaType.video</code> : Video call.<br>- <code>CallMediaType.audio</code> : Audio call. |
| params | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams">CallParams</a> | No | Extended call parameters, such as Room ID, call invitation timeout, etc.<br>- <code>roomId</code> (String) : Room ID. An optional parameter; if not specified, it will be automatically assigned by the server.<br>- <code>timeout</code> (Int) : Call Timeout (in seconds).<br>- <code>userData</code> (String) : Custom User Data for application-specific information.<br>- <code>chatGroupId</code> (String) : Chat Group ID, used for group call scenarios.<br>- <code>isEphemeralCall</code> (Boolean) : Ephemeral Call. If set to true, no call history record will be generated. |

### Step 5: End the Call

When you call [hangup](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/hangup(completion:)) or the remote party ends the call, the [onCallEnded](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callevent/oncallended(callid:mediatype:reason:userid:)) event is triggered. Listen for this event and close the call screen when the call ends.
1. **Listen for call end event:** Observe the `onCallEnded` event.

2. **Close the call screen:** When `onCallEnded` is triggered, dismiss the call screen.

   ``` swift
   import UIKit
   import AtomicXCore
   import Combine

   class CallViewController: UIViewController {
       override func viewDidLoad() {
           super.viewDidLoad()
           // Other initialization code

           // 1. Add call event listener
           addListener()
       }

       private func addListener() {
           CallStore.shared.callEventPublisher
               .receive(on: DispatchQueue.main)
               .sink { [weak self] event in
                   if case .onCallEnded = event {
                       // 2. Dismiss the call interface
                       self?.dismiss(animated: true)
                   }
               }
               .store(in: &cancellables)
       }
   }
   ```

   **onCallEnded Event Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Unique ID for this call. |
| mediaType | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype">CallMediaType</a> | The media type of the call:<br>- <code>CallMediaType.video</code> : Video call.<br>- <code>CallMediaType.audio</code> : Audio call. |
| reason | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callendreason">CallEndReason</a> | The reason why the call ended.<br>- <code>unknown</code> : Unable to determine the reason for termination.<br>- <code>hangup</code> : Normal termination; a user actively ended the call.<br>- <code>reject</code> : The callee declined the incoming call.<br>- <code>noResponse</code> : The callee did not answer within the timeout period.<br>- <code>offline</code> : The callee is currently offline.<br>- <code>lineBusy</code> : The callee is already in another call.<br>- <code>canceled</code> : The caller canceled the call before it was answered.<br>- <code>otherDeviceAccepted</code> : The call was answered on another logged-in device.<br>- <code>otherDeviceReject</code> : The call was declined on another logged-in device.<br>- <code>endByServer</code> : The call was forced to end by the server. |
| userId | String | The User ID of the person who triggered the call termination. |

### Demo

After completing these five steps, the "Make a Call" feature will look like this:

## Customization

**CallCoreView** provides extensive UI customization, including support for custom avatars and volume indicator icons. To speed up your integration, you can download ready-to-use icons from [GitHub](http://github.com/Tencent-RTC/TUIKit_iOS/tree/main/call/TUICallKit_Swift/Resources/Assets.xcassets). All icons are designed for TUICallKit and are free to use.

### Customizing Volume Indicator Icons

Use the **CallCoreView** [setVolumeLevelIcons](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/setvolumelevelicons(icons:)) method to assign different icons for each volume level.

``` swift
// Set volume indicator icons
let volumeLevelIcons: [VolumeLevel: String] = [
    .mute: "Path to the corresponding icon resource"
]
callCoreView.setVolumeLevelIcons(icons: volumeLevelIcons)
```
- **setVolumeLevelIcons API Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | [VolumeLevel: String] | Yes | A mapping table of volume levels to icon resources. The dictionary structure is defined as follows:<br>Key ( VolumeLevel ) Represents the volume intensity level:<br>- <code>VolumeLevel.mute</code> ：Microphone is off or muted.<br>- <code>VolumeLevel.low</code> ：Volume range (0, 25].<br>- <code>VolumeLevel.medium</code> : Volume range (25, 50].<br>- <code>VolumeLevel.high</code> : Volume range (50, 75].<br>- <code>VolumeLevel.peak</code> : Volume range (75, 100].<br>Value ( String ) The resource path or name of the icon corresponding to the volume level. |

- **Icon Configuration Guide：**

| <strong>Icons</strong> | <strong>Description</strong> |
| --- | --- |
|  | Volume Indicator Icon.<br>You can set this icon for <code>VolumeLevel.low</code> or <code>VolumeLevel.medium</code>. It will be displayed when the user's volume exceeds the specified level. |
|  | Volume Indicator Icon.<br>You can set this icon for VolumeLevel.mute. It will be displayed when the user is currently muted. |

### Customizing Network Indicator Icons

Use the **CallCoreView** [setNetworkQualityIcons](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/setnetworkqualityicons(icons:)) method to assign icons for different network states.

``` swift
// Set network quality icons
let networkQualityIcons: [NetworkQuality: String] = [
    .bad: "Path to the corresponding icon"
]
callCoreView.setNetworkQualityIcons(icons: networkQualityIcons)
```
- **setNetworkQualityIcons API Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | [NetworkQuality: String] | Yes | Network Quality Icon Mapping Table. The dictionary structure is defined as follows:<br>Key ( NetworkQuality ) : NetworkQuality<br><code>NetworkQuality.unknown</code> ：Network status is undetermined.<br><code>NetworkQuality.excellent</code>：Outstanding network connection.<br><code>NetworkQuality.good</code> : Stable and good network connection.<br><code>NetworkQuality.poor</code> : Weak network signal.<br><code>NetworkQuality.bad</code> : Very weak or unstable network.<br><code>NetworkQuality.veryBad</code> ：Extremely poor network, near disconnection.<br><code>NetworkQuality.down</code> ：Network is disconnected.<br>Value ( String ) : The absolute path or resource name of the icon corresponding to the network status. |

- **Network Warning Icon:**

| <strong>Icons</strong> | <strong>Description</strong> |
| --- | --- |
|  | Poor Network Indicator.<br>You can set this icon for <code>NetworkQuality.bad, NetworkQuality.veryBad</code> or <code>NetworkQuality.down</code> .It will be displayed when the network quality is poor. |

### Customizing Default Avatars

Use the **CallCoreView** [setParticipantAvatars](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/setparticipantavatars(avatars:)) API to set user avatars. Listen to the [allParticipants](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstate/allparticipants) reactive data: when you have a user's avatar, set and display it; if not, show the default avatar.
``` swift
// Set user avatars
var avatars: [String: String] = [:]
let userId = ""      // User ID
let avatarPath = ""  // Path to user's default avatar resource
avatars[userId] = avatarPath

callCoreView.setParticipantAvatars(avatars: avatars)
```
- **setParticipantAvatars API Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| avatars | [String: String] | Yes | User Avatar Mapping Table. The dictionary structure is described as follows：<br>- Key : The <code>userID</code> of the user.<br>- Value : The absolute path to the user's avatar resource. |

- **Default Avatar:**

| <strong>Icons</strong> | <strong>Description</strong> |
| --- | --- |
|  | Default Profile Picture.<br>You can set this as the default avatar for a user when their profile image fails to load or if no avatar is provided. |

### Customizing Waiting Animations

Use the **CallCoreView** [setWaitingAnimation](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/setwaitinganimation(path:)) API to set a waiting animation for users who are waiting to answer.

``` swift
// Set waiting animation
let waitingAnimationPath = ""  // Path to waiting animation GIF resource
callCoreView.setWaitingAnimation(path: waitingAnimationPath)
```
- **setWaitingAnimation API Parameters:**

   |**Params**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |path|String|Yes|Absolute path to a GIF format image resource.|

- **User Waiting Animation:**

| <strong>Icons</strong> | <strong>Description</strong> |
| --- | --- |
|  | User Waiting Animation<br>Animations for group calls. Once configured, this animation will be displayed when the user's status is "Waiting to Answer" (Pending). |

### Adding a Call Duration Indicator

To display the call duration in real time, subscribe to the [activeCall](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstate/activecall) `duration` field.
1. **Subscribe to the data layer:** Observe `CallStore.observerState.activeCall` for changes.

2. **Bind the duration to your UI:** The `activeCall.duration` field is reactive and will automatically update your UI.

   ``` swift
   import UIKit
   import AtomicXCore
   import Combine

   class TimerView: UILabel {
       private var cancellables = Set<AnyCancellable>()

       override init(frame: CGRect) {
           super.init(frame: frame)
           setupView()
       }

       required init?(coder: NSCoder) {
           super.init(coder: coder)
           setupView()
       }

       private func setupView() {
           textColor = .white
           textAlignment = .center
           font = .systemFont(ofSize: 16)
       }

       override func didMoveToWindow() {
           super.didMoveToWindow()
           if window != nil {
               // [Recommended Usage] Animation for group calls.
               // Once configured, this animation is displayed when the user's status is "Waiting to Answer".
               registerActiveCallObserver()
           } else {
               cancellables.removeAll()
           }
       }

       private func registerActiveCallObserver() {
           CallStore.shared.state.subscribe()
               .map { $0.activeCall }
               .removeDuplicates { $0.duration == $1.duration }
               .receive(on: DispatchQueue.main)
               .sink { [weak self] activeCall in
                   // Update call duration
                   self?.updateDurationView(activeCall: activeCall)
               }
               .store(in: &cancellables)
       }

       private func updateDurationView(activeCall: CallInfo) {
           let currentDuration = activeCall.duration
           let minutes = currentDuration / 60
           let seconds = currentDuration % 60
           text = String(format: "%02d:%02d", minutes, seconds)
       }
   }
   ```

   > **Note：**
   >
   > For more reactive call status data, see [CallState](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstate).
   >

## More Features

### Customizing User Avatar and Nickname

Before a call starts, set your own nickname and avatar using [setSelfInfo](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/loginstore/setselfinfo(userprofile:completion:)).
``` swift
var userProfile = UserProfile()
userProfile.userID = ""      // Your User ID
userProfile.avatarURL = ""   // URL of the avatar image
userProfile.nickname = ""    // The nickname to be set

LoginStore.shared.setSelfInfo(userProfile: userProfile) { result in
    switch result {
    case .success:
        // Success callback: profile updated successfully
    case .failure(let error):
        // Failure callback: handle the error
    }
}
```
- **setSelfInfo API Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| userProfile | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/userprofile">UserProfile</a> | Yes | User info struct:<br>- <code>userID</code>: User ID<br>- <code>avatarURL</code>: User avatar URL<br>- <code>nickname</code>: User nickname<br>For more field details, please refer to the <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/userprofile">UserProfile</a> class. |

### Switching Layout Modes

**CallCoreView** supports three built-in layout modes. Use [setLayoutTemplate](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callcoreview/setlayouttemplate(_:)) to set the layout. If not set, **CallCoreView** will automatically use `Float` mode for 1-on-1 calls and `Grid` mode for multi-party calls.
| - <strong>Layout:</strong> While waiting, display your own video full screen. After answering, show the remote video full screen and your own video as a floating window.<br>- <strong>Interaction:</strong> Drag the small window or tap to swap big/small video. | - <strong>Layout:</strong> All participant videos are tiled in a grid. Best for 2+ participants. Tap to enlarge a video.<br>- <strong>Interaction:</strong> Tap a participant to enlarge their video. | - <strong>Layout:</strong> In 1v1, remote video is fixed; in multi-party, the active speaker is shown full screen.<br>- <strong>Interaction:</strong> Shows your own video while waiting, displays call timer after answering. |

- **setLayoutTemplate Sample code:**

   ``` swift
   func setLayoutTemplate(_ template: CallLayoutTemplate)
   ```
- **setLayoutTemplate API Parameters:**

| <strong>Params</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| template | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/calllayouttemplate">CallLayoutTemplate</a> | CallCoreView's layout mode<br>- <code>CallLayoutTemplate.float</code> ：<br>- <strong>Layout:</strong> While waiting, display your own video full screen. After answering, show the remote video full screen and your own video as a floating window.<br>- <strong>Interaction:</strong> Drag the small window or tap to swap big/small video.<br>- <code>CallLayoutTemplate.grid</code> ：<br>- <strong>Layout:</strong> All participant videos are tiled in a grid. Best for 2+ participants. Tap to enlarge a video.<br>- <strong>Interaction:</strong> Tap a participant to enlarge their video.<br>- <code>CallLayoutTemplate.pip</code> :<br>- <strong>Layout:</strong> In 1v1, remote video is fixed; in multi-party, the active speaker is shown full screen.<br>- <strong>Interaction:</strong> Shows your own video while waiting, displays call timer after answering. |

### Setting Default Call Timeout

When making a call using [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)), set the `timeout` field in [CallParams](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams) to specify the call invitation timeout.
``` swift
var callParams = CallParams()
callParams.timeout = 30  // Set call timeout to 30 seconds.
CallStore.shared.calls(
    participantIds: userIdList,
    callMediaType: .video,
    params: callParams,
    completion: nil
)
```
| <strong>Params</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| participantIds | List<String> | Yes | A list of User IDs for the target participants. |
| callMediaType | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype">CallMediaType</a> | Yes | The media type of the call, used to specify whether to initiate an audio or video call.<br>- <code>CallMediaType.video</code> : Video Call.<br>- <code>CallMediaType.audio</code> : Audio Call. |
| params | <a href="https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams">CallParams</a> | No | Extended call parameters, such as Room ID, call invitation timeout, etc.<br>- <code>roomId</code> (String) : Room ID. An optional parameter; if not specified, it will be automatically assigned by the server.<br>- <code>timeout</code> (Int) : Call Timeout (in seconds).<br>- <code>userData</code> (String) : User Custom Data for app-specific logic.<br>- <code>chatGroupId</code> (String) : Chat Group ID, used specifically for group call scenarios.<br>- <code>isEphemeralCall</code> (Boolean) : Ephemeral Call. Whether the call is encrypted and transient (will not generate a call history record). |

### Implementing In-App Floating Window

The AtomicXCore SDK provides the `CallPipView` component to enable in-app floating windows. When the call interface is covered by another screen (e.g., the user navigates away but the call is ongoing), a floating window displays call status and lets users quickly return to the call.

**Step 1: Create the Floating Window Controller.**
``` swift
import UIKit
import AtomicXCore
import Combine

/**
 * Floating Window Controller
 * * Used to display the call in a floating window, containing a CallCoreView internally.
 */
class FloatWindowViewController: UIViewController {

    var tapGestureAction: (() -> Void)?
    private var cancellables = Set<AnyCancellable>()

    private lazy var callCoreView: CallCoreView = {
        let view = CallCoreView(frame: self.view.bounds)
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.setLayoutTemplate(.pip)  // Set to Picture-in-Picture (PIP) layout mode
        view.isUserInteractionEnabled = false  // Disable interaction to allow taps to pass through to the parent view
        return view
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(white: 0.1, alpha: 1.0)
        view.layer.cornerRadius = 10
        view.layer.masksToBounds = true

        view.addSubview(callCoreView)

        // Add tap gesture recognizer
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        view.addGestureRecognizer(tapGesture)

        // Delay status observation to prevent the window from closing immediately upon creation
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            self?.observeCallStatus()
        }
    }

    @objc private func handleTap() {
        tapGestureAction?()
    }

    /**
     * Observe call status changes
     * Automatically closes the floating window when the call ends.
     */
    private func observeCallStatus() {
        CallStore.shared.state
            .subscribe(StatePublisherSelector<CallState, CallParticipantStatus>(keyPath: \.selfInfo.status))
            .removeDuplicates()
            .receive(on: DispatchQueue.main)
            .sink { [weak self] status in
                if status == .none {
                    // Call ended, post notification to hide the floating window
                    NotificationCenter.default.post(name: NSNotification.Name("HideFloatingWindow"), object: nil)
                }
            }
            .store(in: &cancellables)
    }

    deinit {
        cancellables.removeAll()
    }
}
```

**Step 2: Implement floating window management logic in the main interface.**
``` swift
import UIKit
import AtomicXCore

class MainViewController: UIViewController {

    private var floatWindow: UIWindow?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Listen for the notification to show the floating window
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(showFloatingWindow),
            name: NSNotification.Name("ShowFloatingWindow"),
            object: nil
        )

        // Listen for the notification to hide the floating window
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(hideFloatingWindow),
            name: NSNotification.Name("HideFloatingWindow"),
            object: nil
        )
    }

    /**
     * Displays the in-app floating window.
     */
    @objc private func showFloatingWindow() {
        // Check if the call is currently active/accepted
        let selfStatus = CallStore.shared.state.value.selfInfo.status
        guard selfStatus == .accept else {
            return
        }

        // Prevent duplicate creation if the floating window already exists
        guard floatWindow == nil else { return }

        // ⚠️ CRITICAL: The current windowScene must be used to create the new window
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            return
        }

        // Define floating window dimensions (9:16 aspect ratio)
        let pipWidth: CGFloat = 100
        let pipHeight: CGFloat = pipWidth * 16 / 9
        let pipX = UIScreen.main.bounds.width - pipWidth - 20
        let pipY: CGFloat = 100

        // Create the floating window (associated with the windowScene)
        let window = UIWindow(windowScene: windowScene)
        window.windowLevel = .alert + 1 // Ensure it stays above standard UI
        window.backgroundColor = .clear
        window.frame = CGRect(x: pipX, y: pipY, width: pipWidth, height: pipHeight)

        // Initialize the floating window controller
        let floatVC = FloatWindowViewController()
        floatVC.tapGestureAction = { [weak self] in
            self?.openCallViewController()
        }

        window.rootViewController = floatVC

        self.floatWindow = window

        // Make the window visible
        window.isHidden = false
        window.makeKeyAndVisible()

        // Immediately restore the main window as the key window to maintain proper app focus
        if let mainWindow = windowScene.windows.first(where: { $0 != window }) {
            mainWindow.makeKey()
        }
    }

    /**
     * Hides the in-app floating window.
     */
    @objc private func hideFloatingWindow() {
        floatWindow?.isHidden = true
        floatWindow = nil
    }

    /**
     * Opens the call interface (triggered upon tapping the floating window).
     */
    private func openCallViewController() {
        // Dismiss the floating window first
        hideFloatingWindow()

        // Retrieve the current top-most ViewController
        guard let topVC = getTopViewController() else {
            return
        }

        let callVC = CallViewController()
        callVC.modalPresentationStyle = .fullScreen
        topVC.present(callVC, animated: true)
    }

    /**
     * Utility to retrieve the current top-most ViewController in the view hierarchy.
     */
    private func getTopViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let keyWindow = windowScene.windows.first(where: { $0.isKeyWindow }),
              let rootVC = keyWindow.rootViewController else {
            return nil
        }

        var topVC = rootVC
        while let presentedVC = topVC.presentedViewController {
            topVC = presentedVC
        }

        return topVC
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
```

**Step 3: Add the floating window trigger logic to the Call Interface.**
``` swift
import UIKit
import AtomicXCore

class CallViewController: UIViewController {

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        // When entering the call interface, post a notification to hide the floating window
        NotificationCenter.default.post(name: NSNotification.Name("HideFloatingWindow"), object: nil)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // When leaving the call interface, check if the call is still active
        let selfStatus = CallStore.shared.state.value.selfInfo.status
        if selfStatus == .accept {
            // If the call is still ongoing, post a notification to show the floating window
            NotificationCenter.default.post(name: NSNotification.Name("ShowFloatingWindow"), object: nil)
        }
    }
}
```

### Enabling System Picture-in-Picture (PiP) Outside the App

AtomicXCore SDK supports system-level PiP via the underlying TRTC engine. When your app goes to the background, the call video can float above other apps as a system PiP window, so users can continue their video call while multitasking.

> **Note：**
> 1. In Xcode, add `Background Modes` under `Signing & Capabilities` and enable `Audio, AirPlay, and Picture in Picture`.
> 2. Requires iOS 15.0 or later.

1. **Configure PiP Parameters:** You need to set parameters such as the fill mode for the PiP window, user video regions, and canvas configurations.

   ``` swift
   import Foundation
   import AtomicXCore

   // Fill Mode Enumeration
   enum PictureInPictureFillMode: Int, Codable {
       case fill = 0  // Aspect Fill (Scale to fill, may crop)
       case fit = 1   // Aspect Fit (Scale to fit, no cropping)
   }

   // User Video Region
   struct PictureInPictureRegion: Codable {
       let userId: String           // Unique User ID
       let width: Double            // Width (0.0 - 1.0, relative to canvas)
       let height: Double           // Height (0.0 - 1.0, relative to canvas)
       let x: Double                // X coordinate (0.0 - 1.0, relative to top-left of canvas)
       let y: Double                // Y coordinate (0.0 - 1.0, relative to top-left of canvas)
       let fillMode: PictureInPictureFillMode  // Rendering fill mode
       let streamType: String       // Stream type ("high" for HD or "low" for SD)
       let backgroundColor: String  // Hex background color (e.g., "#000000")
   }

   // Canvas Configuration
   struct PictureInPictureCanvas: Codable {
       let width: Int              // Canvas width in pixels
       let height: Int             // Canvas height in pixels
       let backgroundColor: String // Hex background color
   }

   // Picture-in-Picture Parameters
   struct PictureInPictureParams: Codable {
       let enable: Bool                        // Toggle PiP functionality
       let cameraBackgroundCapture: Bool?      // Whether to continue camera capture in background
       let canvas: PictureInPictureCanvas?     // Canvas settings (Optional)
       let regions: [PictureInPictureRegion]?  // List of user video regions (Optional)
   }

   // PiP API Request Object
   struct PictureInPictureRequest: Codable {
       let api: String                    // API identifier name
       let params: PictureInPictureParams // Parameter payload
   }
   ```
2. **Enable Picture-in-Picture:** You can enable or disable the PiP feature using the `configPictureInPicture` method.

   ``` swift
   let params = PictureInPictureParams(
       enable: true,
       cameraBackgroundCapture: true,
       canvas: nil,
       regions: nil
   )

   let request = PictureInPictureRequest(
       api: "configPictureInPicture",
       params: params
   )

   // Encode to JSON string and call the Experimental API
   let encoder = JSONEncoder()
   if let data = try? encoder.encode(request),
      let jsonString = String(data: data, encoding: .utf8) {
       TUICallEngine.createInstance().callExperimentalAPI(jsonObject: jsonString)
   }
   ```

### Keeping the Screen Awake During Calls

To prevent the screen from dimming or locking during a call, set `UIApplication.shared.isIdleTimerDisabled = true` when the call starts, and restore it when the call ends.
``` swift
class CallViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Disable automatic screen lock to keep the screen on
        UIApplication.shared.isIdleTimerDisabled = true
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // Restore the automatic screen lock behavior
        UIApplication.shared.isIdleTimerDisabled = false
    }
}
```

### Playing a Ringtone While Waiting for Answer

Listen to your own call status to play a ringtone while waiting for an answer, and stop the ringtone when the call is answered or ends.
``` swift
import Combine

private var cancellables = Set<AnyCancellable>()

private func observeSelfCallStatus() {
    CallStore.shared.state.subscribe()
        .map { $0.selfInfo.status }
        .removeDuplicates()
        .receive(on: DispatchQueue.main)
        .sink { [weak self] status in
            if status == .accept || status == .none {
                // Stop playing ringtone
                return
            }

            if status == .waiting {
                // Start playing ringtone
            }
        }
        .store(in: &cancellables)
}
```

### Enabling Background Audio/Video Capture

To allow your app to capture audio and video while in the background (e.g., when the user locks the screen or switches apps), configure iOS background mode permissions and set up the audio session.

**Configuration Steps:**
1. In Xcode, select your project `Target` → `Signing & Capabilities`.

2. Click `+ Capability`.

3. Add `Background Modes`.

4. Enable:

  - `Audio, AirPlay, and Picture in Picture` (for audio capture and PiP)

  - `Voice over IP` (for VoIP calls)

  - `Remote notifications` (optional, for offline push)

      Your `Info.plist` will then include:

      ``` xml
      <key>UIBackgroundModes</key>
      <array>
          <string>audio</string>
          <string>voip</string>
          <string>remote-notification</string>
      </array>
      ```
- **Configure Audio Session (AVAudioSession):**

   Set up the audio session before the call starts, ideally in the call interface’s `viewDidLoad` or before making/answering a call.

   ``` swift
   import AVFoundation

   /**
    * Configure the Audio Session to support background audio capture.
    * * Recommended to call this method in the following scenarios:
    * 1. Inside viewDidLoad of the call interface.
    * 2. Before initiating a call (calls).
    * 3. Before answering a call (accept).
    */
   private func setupAudioSession() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           // Set the audio session category to PlayAndRecord.
           // .allowBluetooth: Support for standard Bluetooth headsets.
           // .allowBluetoothA2DP: Support for high-quality Bluetooth audio (A2DP protocol).
           try audioSession.setCategory(.playAndRecord, options: [.allowBluetooth, .allowBluetoothA2DP])

           // Activate the audio session.
           try audioSession.setActive(true)
       } catch {
           // Audio session configuration failed.
           print("Failed to configure Audio Session: \(error)")
       }
   }
   ```
- **Special Handling for Ringtone Playback (Optional):**

   To play a ringtone through the speaker while waiting for an answer, temporarily switch the audio session to `.playback` mode.

   ``` swift
   /**
    * Switch the Audio Session for ringtone playback.
    * * Use Case: When using AVAudioPlayer to play the ringtone.
    */
   private func setAudioSessionForRingtone() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           // Switch to playback mode (optimizes for output only)
           try audioSession.setCategory(.playback, options: [.allowBluetooth, .allowBluetoothA2DP])

           // Force the ringtone to play through the built-in speaker
           try audioSession.overrideOutputAudioPort(.speaker)

           try audioSession.setActive(true)
       } catch {
           // Failed to configure Audio Session for ringtone
           print("Ringtone audio session error: \(error)")
       }
   }

   /**
    * Restore to Call Mode after the ringtone stops playing.
    */
   private func restoreAudioSessionForCall() {
       let audioSession = AVAudioSession.sharedInstance()
       do {
           // Restore to PlayAndRecord mode (required for two-way VoIP communication)
           try audioSession.setCategory(.playAndRecord, options: [.allowBluetooth, .allowBluetoothA2DP])

           try audioSession.setActive(true)
       } catch {
           // Failed to restore Audio Session
           print("Failed to restore call audio session: \(error)")
       }
   }
   ```

## Next Steps

Congratulations! You’ve completed the "Make a Call" feature. Next, see Answer Your First Call to implement the answer call functionality.

## FAQs

### If the callee is offline and comes online within the call invitation timeout, will they receive the incoming call event?

For one-on-one calls, if the callee comes online within the timeout, they will receive an incoming call invitation. For group calls, if the callee comes online within the timeout, up to 20 pending group messages will be retrieved. If there is a call invitation, the incoming call event will be triggered.

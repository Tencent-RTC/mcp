---
sync_node_id: '150174460382482432'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "SDK 快速开始"
  - "Mac"
product: "trtc"
---
This tutorial mainly introduces how to implement a basic audio and video call with Objective-C.

## Prerequisites
- Xcode 13.0 or later.

- A Mac computer with OS X 10.10 or later.

- A valid developer signature for your project.

## Integration guideline

### Step 1. Import TRTC SDK

【Cocoapods Integration】
1. Run the following command in a terminal window to install **CocoaPods**. If you have installed **CocoaPods**, skip this step.

``` bash
sudo gem install cocoapods
```
2. In the terminal window, go to the **project root directory** and run the following command to create the **Podfile** for your project.

``` bash
pod init
```
3. Edit and save the **Podfile** as follows.

``` ruby
platform :osx, '10.10'

# Modify the 'Your Target' to the name of your project
target 'Your Target' do
pod 'TXLiteAVSDK_TRTC_Mac', :podspec => 'https://liteav.sdk.qcloud.com/pod/liteavsdkspec/TXLiteAVSDK_TRTC_Mac.podspec'
end
```
4. In the terminal window, run the following command to update the local library files and download the **TRTC SDK**.

``` bash
pod install
```

   > **Note:**
   > 
   > After the `pod install` executed, a new **.xcworkspace** project file is generated. Double-click the **.xcworkspace** file to open it.
   > 

【Swift Package Manager Integration】
1. Using Xcode 26.4.1 as an example, open the File menu and select Add Package Dependencies.... Paste the following URL into the search field, wait for the results to load, and then click Add Package.

``` ruby
// Version 13.3 and later
git@github.com:Tencent-RTC/TRTC_Mac_SwiftPM.git
```
2. At the Choose Package Options step, select the SDK version you wish to integrate. For additional configuration details, refer to [Apple's official documentation.](https://help.apple.com/xcode/mac/current/#/devb83d64851)

> **Note：**
> Swift Package Manager integration is available starting with version 13.3. For earlier versions, use CocoaPods to integrate the SDK.
> 

### Step 2. Configure project 
1. Once the **.xcworkspace** file opened, click on the **Project Navigator** on the left in the **Xcode navigation bar**, click on your project name, and make sure you select the correct **TARGETS** in the edit area.

2. In the `General` TAB, add **TXLiteAVSDK_TRTC_Mac.xcframework** and **ScreenCaptureKit.framework** to the **Frameworks, Libraries, and Embedded Content** section.

   

3. In the `Build Settings` TAB, search for **User Script Sandboxing** and set its value to **No**, which could allow the user script access to a wider range of system resources and files.

   

4. In the `Info.plist` TAB, add the **Privacy-Microphone Usage Description** and **Privacy-Microphone Usage Description**, and fill in the target prompt words used by the **Microphone/Camera** to obtain the permission to use the microphone and camera.

   

5. In the `Signing & Capabilities` TAB, check the following in the **App Sandbox** section.

   

### Step 3. Create TRTC instance
1. Import the **TRTC SDK** in the `AppDelegate.h` file.

   ``` objectivec
   @import TXLiteAVSDK_TRTC_Mac; // Import TRTC SDK Module
   ```
2. Declare the **TRTCCloud** property in the `AppDelegate.h` file.

   ``` objectivec
   @property (nonatomic, strong) TRTCCloud *trtcCloud; // Declare the TRTCCloud property
   ```
3. After entering the `AppDelegate.m` file, call `sharedInstance` to create the TRTC instance in the `applicationDidFinishLaunching` method and set up the event listener.

   ``` objectivec
   #import <UserNotifications/UserNotifications.h> // Import the UserNotifications framework
   
   - (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
       // Create a TRTC instance and set up a listener
       _trtcCloud = [TRTCCloud sharedInstance];
       _trtcCloud.delegate = self;
   }
   
   // Listen for the 'onError' event
   - (void)onError:(TXLiteAVError)errCode
            errMsg:(nullable NSString *)errMsg
           extInfo:(nullable NSDictionary *)extInfo{
       // Handle the 'onError' event
       // Recommend to request notification permission for OnError information as followings
       
       // Create a user notification center instance
       NSString *tip = [NSString stringWithFormat:@"Error Code: %ld, Message: %@", (long)errCode, errMsg];  
       // Request notification authority
       UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
       [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound)
                                 completionHandler:^(BOOL granted, NSError * _Nullable error) {
                                     if (granted) {
                                         // Create notification content
                                         UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
                                         content.title = @"RTC Error";
                                         content.body = tip;                                   
   
                                         // Create notification trigger
                                         UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:5 repeats:NO];
                                         
                                         // Create notification request
                                         UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"RTCErrorNotification" content:content trigger:trigger];                                 
   
                                         // Add notifications to the Notification Center
                                         [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
                                             if (error != nil) {
                                                 NSLog(@"Error adding notification: %@", error);
                                             }
                                         }];
                                     }
                                 }];
   }
   ```

### Step 4. Enter the room

Set the entry parameter `TRTCParams` and call `enterRoom` to successfully enter the room, which is usually called after clicking the **Start Call** button.

|Parameter|Type|Description|
|---------|---------|---------|
|sdkAppId|number|The sdkAppId of the audio and video application you created in [TRTC Console](https://trtc.io/login).|
|userId|string|User ID specified by you.|
|userSig|string|User signature, refer to [UserSig](https://trtc.io/document/35166) .|
|roomId|number|Room ID specified by you, usually a unique room ID. |

For more detailed parameter descriptions,  please refer to the interface document [enterRoom](https://trtc.io/document/50754#011dce4d6afaa3bcd684bebb77829689) .
``` objectivec
#import "AppDelegate.h" // Import the "AppDelegate.h" file

-(void)enterRoom {
    // Modify the following parameters to your own
    TRTCParams *trtcParams = [[TRTCParams alloc] init];
    trtcParams.sdkAppId = 1400000123;
    trtcParams.userId = @"denny";
    trtcParams.userSig = @"";
    trtcParams.roomId = 123321;
    
    // For multi-party video calls, `TRTC_APP_SCENE_LIVE` is recommended
    AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
    [appDelegate.trtcCloud enterRoom:trtcParams appScene:TRTCAppSceneLIVE];
}

// Listen for the 'onEnterRoom' event
- (void)onEnterRoom:(NSInteger)result {
    // Handle the 'onEnterRoom' event
    if (result > 0) {
        [self toastTip:@"Enter room succeed!"];
    } else {
        [self toastTip:@"Enter room failed!"];
    }
}

// Implement the 'toastTip'
- (void)toastTip:(NSString *)tip {
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:tip];
    [alert runModal];
}
```

### Step 5. Turn on/off Camera
1. Declare the **NSWindow** and **NSView** properties in the `ViewController.h` file.

   ``` objectivec
   @property (nonatomic, strong) NSWindow *window; // Declare the NSWindow property
   @property (nonatomic, strong) NSView *localCameraVideoView; // Declare the NSView property
   ```
2. Initialize the **localCameraVideoView** and set the rendering parameter `setLocalRenderParams` for local preview, then call `startLocalPreview` for local preview. After successfully calling `enterRoom`, the stream push will start.

   ``` objectivec
   -(void) startLocalPreview {
       // Create a window
       self.window = [[NSWindow alloc] initWithContentRect:NSMakeRect(0, 0, 800, 600) styleMask:NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable backing:NSBackingStoreBuffered defer:NO];
       [self.window center];
       [self.window setTitle:@"TRTCDemo_Mac"];
       [self.window makeKeyAndOrderFront:nil];
       self.window.releasedWhenClosed = NO;
   
       // Initialize localCameraVideoView
       self.localCameraVideoView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 300, 300)];
       [self.window.contentView addSubview:self.localCameraVideoView];
   
       // Adjust the localCameraVideoView frame
       self.localCameraVideoView.frame = self.window.contentView.bounds;
   
       // Set local preview rendering parameters
       TRTCRenderParams *trtcRenderParams = [[TRTCRenderParams alloc] init];
       trtcRenderParams.fillMode   = TRTCVideoFillMode_Fill;
       trtcRenderParams.mirrorType = TRTCVideoMirrorTypeAuto;
   
       AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
       [appDelegate.trtcCloud setLocalRenderParams:trtcRenderParams];
   
       // Preview the collected content locally 
       [appDelegate.trtcCloud startLocalPreview:self.localCameraVideoView];
   }
   ```

   Call `stopLocalPreview` to turn off the camera preview and stop pushing local video information.

   ``` objectivec
   AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
   [appDelegate.trtcCloud stopLocalPreview];
   ```

### Step 6. Turn on/off microphone

Call the `startLocalAudio` to turn on microphone capture. **Select one of the following sound** `Quality` **parameters according to your requirements**.
``` objectivec
// Enable microphone acquisition and set the current scene to: Voice mode 
// For high noise suppression capability, strong and weak network resistance
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud startLocalAudio:TRTCAudioQualitySpeech];
```

``` objectivec
// Enable microphone acquisition, and set the current scene to: Music mode 
// For high fidelity acquisition, low sound quality loss, recommended to use with professional sound cards
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud startLocalAudio:TRTCAudioQualityMusic];
```

Call `stopLocalAudio` to turn off microphone collection and stop pushing local audio information.
``` objectivec
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud stopLocalAudio];
```

### Step 7. Play/stop video streaming
1. Listen to [onUserVideoAvailable](https://trtc.io/document/50755#36daf607f51a906ea0b48b33fc628161) before entering the room. When you receive the `onUserVideoAvailable(userId, true)` notification, it means that there are video frames available to play in the road screen.

2. Set the render parameter `setRemoteRenderParams` and call `startRemoteView` to play the video content collected by the remote side.

   ``` objectivec
   - (void)startRemotePreview {
       /// Play the remote side's video
       AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
       [appDelegate.trtcCloud startRemoteView:@"denny" streamType:TRTCVideoStreamTypeBig view:self.localCameraVideoView];
   }
   ```

   Call `stopRemoteView` to stop the remote video.

   ``` objectivec
   // Stop the video
   AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
   [appDelegate.trtcCloud stopRemoteView:@"denny"]; // Only stop denny's video
   [appDelegate.trtcCloud stopAllRemoteView]; // Stop all videos
   ```

### Step 8. Play/stop the audio stream

Call `muteRemoteAudio` to mute or unmute the remote side's sound.
``` objectivec
// Mute
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud muteRemoteAudio:@"denny" mute:YES]; // Only mute denny

[appDelegate.trtcCloud muteAllRemoteAudio:YES]; // Mute all remote users
```

``` objectivec
// Unmute
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud muteRemoteAudio:@"denny" mute:NO]; // Only unmute denny

[appDelegate.trtcCloud muteAllRemoteAudio:NO]; // Unmute all remote users
```

### Step 9. Exit the room

Call `exitRoom` to exit the current room, and the TRTC SDK will notify you after check-out via the `onExitRoom` callback event.
``` objectivec
// Exit current room
AppDelegate *appDelegate = (AppDelegate *)[[NSApplication sharedApplication] delegate];
[appDelegate.trtcCloud exitRoom];

// Listen for the onExitRoom callback to find out why you checked out
- (void)onExitRoom:(NSInteger)reason {
    if (reason == 0) {
        NSLog(@"Exit current room by calling the 'exitRoom' api of sdk ...");
    } else if (reason == 1) {
        NSLog(@"Kicked out of the current room by server through the restful api...");
    } else if (reason == 2) {
        NSLog(@"Current room is dissolved by server through the restful api...");
    }
}
```

## FAQs

API Reference at [API Reference](https://trtc.io/document/35119).

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://trtc.io/document/36058).

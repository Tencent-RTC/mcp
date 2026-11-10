---
sync_node_id: '89644534191144960'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "iOS"
product: "trtc"
---
This document describes how to import the SDK into your project.

## Environment Requirements
- Xcode 9.0 or later 

- iPhone or iPad with iOS 9.0 or later

- A valid developer signature for your project

## Step 1. Import the SDK

You can use CocoaPods or download and import the SDK manually into your project.

### Method 1. Use CocoaPods
1. **Install CocoaPods.**
Enter the following command in a terminal window (you need to install Ruby on your Mac first):

   ``` bash
   sudo gem install cocoapods
   ```
2. **Create a Podfile.**
Go to the directory of your project and enter the following command to create a Podfile in the directory.

   ``` bash
   pod init
   ```
3. **Edit the Podfile.**
Choose an appropriate edition according to your project needs and edit the Podfile:

   - **Option 1: Lite**
The installation package is the smallest but only supports two features: real-time communication (TRTC) and live player (TXLivePlayer). To choose this version, edit the Podfile as follows:

      ``` bash
       platform :ios, '8.0'
      
        target 'App' do
        pod 'TXLiteAVSDK_TRTC', :podspec => 'https://liteav.sdk.qcloud.com/pod/liteavsdkspec/TXLiteAVSDK_TRTC.podspec'
        end
      ```
   - **Option 2: Professional**
The installation package includes real-time communication (TRTC), live player (TXLivePlayer), RTMP streaming (TXLivePusher), VOD player (TXVodPlayer), short video recording and editing (UGSV), and many other features. To choose this edition, edit the Podfile as follows:

      ``` bash
       platform :ios, '8.0'
      
        target 'App' do
        pod 'TXLiteAVSDK_Professional', :podspec => 'https://liteav.sdk.qcloud.com/pod/liteavsdkspec/TXLiteAVSDK_Professional.podspec'
        end
      ```
4. **Update the local repository and install the SDK**

   - Enter the following command in a terminal window to update the local repository and install the SDK:

      ``` bash
      pod install
      ```
   - Or, run this command to update the local repository:

      ``` bash
      pod update
      ```

      An XCWORKSPACE project file integrated with the TRTC SDK will be generated. Double-click to open it.

### Method 2. Use Spm
1. Open your Xcode project and click File > Add Package Dependencies from the Xcode menu... .

2. In the dialog box that is displayed, enter the URl in the upper right corner.

3. Option 1: TRTC

   - Enter https://github.com/Tencent-RTC/TRTC_SwiftPM.git.

   - Select Dependency Rule as Branch, branch name is main, or select the version number you need, Add to Project select the current project.

                 

   - Select the target you want to join, where TXLiteAVSDK_ReplayKit is our screen recording component:

      

4. Option 2: Professional 

   - Enter [https://github.com/Tencent-RTC/Professional_SwiftPM.git](https://github.com/Tencent-RTC/Professional_SwiftPM.git).

   - Select Dependency Rule as Branch, branch name is main, or select the version number you need, Add to Project select the current project.

      

   - Select the target you want to join, where TXLiteAVSDK_ReplayKit is our screen recording component:

      

### Method 3. Download the SDK and import it manually
1. Download and decompress the [SDK package](https://intl.cloud.tencent.com/document/product/647/34615).

2. Open your Xcode project, select the target you want to run, and click **Build Phases**.

   

3. Expand **Link Binary With Libraries** and click the **+** icon at the bottom to add dependent libraries.

   

4. Add the downloaded `TXLiteAVSDK_TRTC.Framework` (or `TXLiteAVSDK_Professional.Framework`), `TXFFmpeg.xcframework`, `TXSoundTouch.xcframework`, and the frameworks they depend on: `GLKit.framework`, `AssetsLibrary.framework`, `SystemConfiguration.framework`, `libsqlite3.0.tbd`, `CoreTelephony.framework`, `AVFoundation.framework`, `OpenGLES.framework`, `Accelerate.framework`, `MetalKit.framework`, `libresolv.tbd`, `MobileCoreServices.framework`, `libc++.tbd`, `CoreMedia.framework`.

   

5. Click **General**, expand **Frameworks, Libraries, and Embedded Content**, and check if the dynamic libraries required by `TXLiteAVSDK_TRTC.framework` (**TXFFmpeg.xcframework** and **TXSoundTouch.xcframework**) have been added and set to **Embed & Sign**. If not, click **+** at the bottom to add them.

   

## Step 2. Configure app permissions
1. To use the audio/video features of the SDK, you need to grant the application mic and camera permissions. Add the two items below to `Info.plist` of your application. Their content is what users see in the mic and camera access pop-up windows.

   - **Privacy - Microphone Usage Description**. Include a statement specifying why mic access is needed.

   - **Privacy - Camera Usage Description**. Include a statement specifying why camera access is needed.

      

2. If you want the SDK to run in the background, select your project, under the **Capabilities** tab, set **Background Modes** to **ON**, and select **Audio, AirPlay, and Picture in Picture**.

   

## Step 3. Import the SDK into the project

After completing the first step of importing and the second step of granting device permissions, you can import the APIs provided by the SDK into your project.

### Using Objective-C or Swift APIs

There are two ways to use the SDK in Objective-C or Swift:
- **Import the module**: Import the SDK module in the files that will use the SDK APIs.

   ``` bash
   @import TXLiteAVSDK_TRTC;
   ```
- **Import the header file**: Import the header file in the files that will use the SDK APIs.

   ``` bash
   #import "TXLiteAVSDK_TRTC/TRTCCloud.h"
   ```

   > **Note:**
   > 
   > For more information on how to use Objective-C APIs, see [Overview](https://intl.cloud.tencent.com/document/product/647/35119).
   > 

### Using C++ APIs (optional)

If your project imports the SDK through a cross-platform framework such as Qt or Electron, import the header files in the `TXLiteAVSDK_TRTC.framework/Headers/cpp_interface` directory:
``` bash
#include "TXLiteAVSDK_TRTC/cpp_interface/ITRTCCloud.h"
```

> **Note:**
> For more information on how to use C++ APIs, see [Overview](https://intl.cloud.tencent.com/document/product/647/35131).
> 

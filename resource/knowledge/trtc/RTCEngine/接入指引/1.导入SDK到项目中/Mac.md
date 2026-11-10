---
sync_node_id: '89644533983526912'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "Mac"
product: "trtc"
---
This document describes how to quickly integrate the TRTC macOS SDK into your project.

## Environment Requirements
- Xcode 9.0 or later

- A Mac computer with OS X 10.10 or later

- A valid developer signature for your project

## Step 1. Import the SDK

You can use CocoaPods to automatically load the SDK or download and import it manually into your project.

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
There are two ways to edit the Podfile:

   - **Method 1:** Use the pod path of the LiteAV SDK

      ``` bash
      platform :osx, '10.10'
      
      target 'Your Target' do
      pod 'TXLiteAVSDK_TRTC_Mac', :podspec => 'https://liteav.sdk.qcloud.com/pod/liteavsdkspec/TXLiteAVSDK_TRTC_Mac.podspec'
      end
      ```
   - **Method 2:** Use CocoaPod's official source, which allows version selection.

      ``` bash
      platform :osx, '10.10'
      source 'https://github.com/CocoaPods/Specs.git'
      
      target 'Your Target' do
      pod 'TXLiteAVSDK_TRTC_Mac'
      end
      ```
4. **Install and update the SDK.**

   - Enter the following command in a terminal window to install the SDK.

      ``` bash
      pod install
      ```
   - Or, run this command to update the local repository:

      ``` bash
      pod update
      ```

      An XCWORKSPACE project file integrated with LiteAVSDK will be generated. Double-click to open the file.

### Method 2. Manually integrate
1. Download the [TRTC macOS SDK](https://github.com/LiteAVSDK/TRTC_Mac/tree/main/SDK).

2. Open your Xcode project and import into it the framework downloaded in step 1.

3. Select the target you want to run and click **Build Phases**.

   

4. Expand **Link Binary With Libraries** and click the **+** icon at the bottom to add dependent libraries.

   

5. Add the downloaded SDK framework and its required dependencies in sequence: `TXFFmpeg.xcframework`, `TXSoundTouch.xcframework`, `libc++.tbd`, `Accelerate.framework`, `SystemConfiguration.framework`, `MetalKit.framework`.If it is successful, you will

   

## Step 2. Configure app permissions

To use the audio/video features of the SDK, you need to grant it mic and camera permissions. Add the two items below to `Info.plist` of your application. Their content is what users see in the mic and camera access pop-up windows.
- **Privacy - Microphone Usage Description**. Include a statement specifying why mic access is needed

- **Privacy - Camera Usage Description**. Include a statement specifying why camera access is needed

   

   If **App Sandbox** or **Hardened Runtime** is enabled for your application, select `Network`, `Camera`, and `Audio Input`.

- For App Sandbox:

   

- For Hardened Runtime:

   

## Step 3. Using the SDK in your project

After completing the first step of importing and the second step of granting device permissions, you can use the APIs provided by the SDK in your project.

### Using Objective-C or Swift APIs

There are two ways to use the SDK in Objective-C or Swift:
- **Import the module**: Import the SDK module in the files that will use the SDK APIs.

   ``` bash
   @import TXLiteAVSDK_TRTC_Mac;
   ```
- **Import the header file**: Import the header file in the files that will use the SDK APIs.

   ``` bash
   #import TXLiteAVSDK_TRTC_Mac/TRTCCloud.h
   ```

### Using C++ APIs (optional)
1. **Import the header file**: If you want to use C++ APIs to develop your macOS application, import the header file in the `TXLiteAVSDK_TRTC_Mac.framework/Headers/cpp_interface` directory.

   ``` bash
   #include TXLiteAVSDK_TRTC_Mac/cpp_interface/ITRTCCloud.h
   ```
2. **Use the namespace**: The cross-platform C++ APIs and types are all defined in the TRTC namespace, which you can use directly. This method can simplify your code and is recommended.

   ``` bash
   using namespace trtc;
   ```

   > **Note:**
   > 
   > For more information on how to use C++ APIs, see [Overview](https://intl.cloud.tencent.com/document/product/647/35131).
   > 

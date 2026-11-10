---
sync_node_id: '89644533875523584'
nav_path:
  - "RTC Engine"
  - "API-Example"
  - "iOS"
product: "trtc"
---
This document describes how to quickly run the demo for the TRTC iOS SDK.

## Prerequisites
- Xcode 11.0 or later

- A valid developer signature for your project

- Qt Creator 4.13.3 (macOS) or later

## Steps To Run Demo

### Step 1. Download the Demo

Download the [iOS](https://github.com/Tencent-RTC/TRTC_iOS) sample demo code on github, or run the following command in a terminal:
``` bash
git clone 
```

We offer OC and Swift for you to choose from:
- **TRTC-API-Example-OC:**  run `pod install` in a terminal window after entering the directory of your project, and take no notice of other steps in [iOS SDK Importing](https://trtc.io/document/35092).

- **TRTC-API-Example-Swift:** download the [SDK](https://liteav.sdk.qcloud.com/download/latest/TXLiteAVSDK_TRTC_iOS_latest.zip) required for the project and move the unzipped `TXFFmpeg.xcframework`/`TXSoundTouch.xcframework`/`TXLiteAVSDK_TRTC_Mac.xcframework`/`TXLiteAVSDK_ReplayKitExt.xcframework` to **TRTC_iOS/SDK** folder.

### Step 2. Configure the Demo
1. Log in to the [TRTC Console](https://console.trtc.io/) and click **Create Application**. If you have already done so, you may skip this step.

2. And then, your own `SDKAppID` and `SDKSecretKey` of your created application can be obtained in the **Basic Information** section.

   

3. Replace the values of **SDKAPPID** and **SDKSECRETKEY** in the `GenerateTestUserSig.h`  or `GenerateTestUserSig.swift` under `TRTC-API-Example-XX/Debug` directory with the information obtained in Step 2.

   

   

   > **Note：**
   > 
   > - In the demo above, we used **SDKSecretKey** to generate **UserSig** locally in order to help you go through the demo easier. However, in the production environment, you are not supposed to generate userSig in this way, which may lead to **SDKSecretKey** leakage, thereby creating a chance for attackers to steal your TRTC traffic. **The correct way to generate UserSig is to integrate** [**Server-Side Generation of UserSig**](https://trtc.io/document/35166) **on your server.** When an user enters the room:
   > - Send a http request to your server.
   > - Generate a UserSig on your server.
   > - Return it to the user to enter the room.
   > - When you deploy your page to a production environment, you need to have your page accessed through the HTTPS(e.g. `https://domain/xxx`). For the reason, please refer to the document [Page Access Protocol Restriction Description](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html#h2-3).

4. If you select **TRTC-API-Example-OC**, go to `Build Phases`, and in the `Link Binary With Libraries` section, add `TXFFmpeg.xcframework` and `TXSoundTouch.xcframework` for your project.

   

   > **Note：**
   > 
   > If you use an emulator to build your experience, you might get an error: Building for 'iOS-simulator', but linking in object file (/Path/To/TRTC_iOS/TRTC-API-Example-OC/Pods/TXLiteAVSDK_TRTC/TXLiteAVSDK_TRTC/TXLiteAVSDK_ReplayKitExt.framework/TXLiteAVSDK_ReplayKitExt[arm64][2](TXCEncodeHelper.o)) built for 'iOS'.
   > 
   > Solution: Navigate to `Build Settings` of your project and add `Any iOS Simulator SDK` with value `arm64` inside `Excluded Architecture` for both TRTC-API-Example-OC and TXReplayKit_Screen.
   > 

### Step 3. Run the Demo
- **OCDemo:** Open the `TRTC-API-Example-OC.xcworkspace` with Xcode (11.0 or later), then compile and run the TRTC-API-Example project.

- **SwiftDemo:** Simply compile and run the TRTC-API-Example-Swift project.

### Step 4. Experience the Demo

You can choose the functions you are interested in to experience.

## FAQs
- If you encounter any problems with access and use, please refer to [FAQs](https://trtc.io/document/36058).

- If you have any requirements or feedback, you can contact: info_rtc@tencent.com.

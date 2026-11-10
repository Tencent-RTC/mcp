---
sync_node_id: '89644533730820096'
nav_path:
  - "RTC Engine"
  - "API-Example"
  - "Unity"
product: "trtc"
---
This document shows you how to integrate the TRTC SDK in Unity to enable audio/video calls in games.

The demo includes the following features:
- Room entry/exit

- Custom video rendering

- Device management and music/audio effects

   > **Note**
   > 
   > - For details about the APIs and their parameters, see [Overview](https://trtc.io/document/40139).
   > - Unity 2022.3.13f1 is recommended.
   > - Supported platforms: Android, iOS, Windows, macOS (alpha testing)
   > - Modules required: `Android Build Support`, `iOS Build Support`, `Windows Build Support`, `MacOS Build Support` .
   > - If you are developing for iOS, you also need:

- Xcode 11.0 or later

- A valid developer signature for your project

## Directions

### Step 1. Create an application
1. Log in to the [TRTC console overview page](https://console.trtc.io/), click **Create Application**.

2. In the popup page, select RTC Engine, enter the application name, and then click **Create**.

   

### Step 2. Get your SDKAppId and SecretKey

After your application created, you can get your `SDKAppID` and `SDKSecretKey` on Basic informaction. `SDKAppID` and `SDKSecretKey` is needed for running demo.  

### Step 3. Download the sample code
1. Go to [GitHub](https://github.com/LiteAVSDK/TRTC_Unity/tree/main/TRTC-Simple-Demo) to download the SDK and demo source code.

   ``` bash
     git clone https://github.com/LiteAVSDK/TRTC_Unity.git
   ```
2. The steps to import SDK can .

### Step 4. Configure the project

Open the file downloaded previously, find and open `TRTC-Simple-Demo/Assets/TRTCSDK/Demo/TRTC/Tools/GenerateTestUserSig.cs`, and set the relevant parameters in `GenerateTestUserSig.cs`:
   - `SDKAPPID`: A placeholder by default. Set it to the actual `SDKAppID`.

   - `SDKSECRETKEY`: A placeholder by default. Set it to the actual key.

      > **Note**
      > 
      > - The method for generating `UserSig` described in this document involves configuring `SDKSECRETKEY` in the client code. In this method, `SDKSECRETKEY` may be easily decompiled and reversed, and if your key is disclosed, attackers can steal your Tencent Cloud traffic. Therefore, **this method is only suitable for the local execution and debugging of TRTC-Simple-Demo**.
      > - The best practice is to integrate the calculation code of `UserSig` into your server and provide an application-oriented API. When `UserSig` is needed, your application can send a request to your server for a dynamic `UserSig`. For more information, see [How do I calculate UserSig during production](https://www.tencentcloud.com/zh/document/product/1047/34385).

### Step 5. Compile and run the demo

#### Android
1. Open Unity Editor, go to **File** > **Build Settings**, and select **Android** for **Platform**.

   

2. Connect to a real Android device and click **Build And Run** to run the demo.

3. Call `enterRoom` first and go on to test other APIs. The data display window shows whether the call is successful, and the other window displays the callback information.

#### iOS
1. Open the TRTC build and configuration tool (from the menu at the top).

2. Click **Build & Configure iOS** to generate a project.

   

3. Find the `TRTC-Simple-Demo/Builds/iOS/TRTCUnityDemo` directory, and open the project generated (`Unity-iPhone.xcodeproj`) with Xcode.

4. Configure the signature information.

5. Connect to a real iOS device to debug the project.

#### Windows
1. Open Unity Editor, go to **File** > **Build Settings**, and select **PC, Mac & Linux Standalone** for **Platform**, and **Windows** for **Target Platform**.

   

2. Click **Build And Run** to run the demo.

#### macOS
1. Open Unity Editor, go to **File** > **Build Settings**, and select **PC, Mac & Linux Standalone** for **Platform**, and **macOS** for **Target Platform**.

   

2. Click **Build And Run** to run the demo.

## Demo

The demo integrates most of the APIs launched so far, which can be used for testing and as reference for API calls. For more information about APIs, see [Client APIs > Unity > Overview](https://trtc.io/document/40139).

> **Note**
> The UI of the latest version of the demo may look different.
> 

## Directory Structure
``` bash
├─Assets
├── Editor                        // Unity Editor script
│   ├── FixAppSign.cs             // Unity iOS Signature Configuration
├── Plugins
│   ├── Android                   
│   │   ├── AndroidManifest.xml   //Android configuration file
├── StreamingAssets               // Audio/Video stream files for the Unity demo
├── TRTCSDK
    ├── Demo                      // Unity Demo
    ├── Editor
    │   ├── AppleConfigProject.cs        // Unity Build Configuration Tool for iOS
    │   ├── BuildScript.cs               // Unity navigation bar adds shortcut buttons for building different platforms
    │   └── IOSAddDylib.cs               // Unity Build TRTC library file addition and configuration for iOS platform
    ├── SDK                       // TRTC Unity SDK
        ├── Plugins               // Store library files of TRTC SDK for Unity for different platforms
        ├── Scripts               // Header files of TRTC SDK for Unity
            ├── Implement             // Implementation layer code file of TRTC SDK for Unity
            ├── Include               // Header files code file of TRTC SDK for Unity
```

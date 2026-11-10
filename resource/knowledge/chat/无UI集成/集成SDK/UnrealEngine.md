---
sync_node_id: '131316111920287744'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "Unreal Engine"
product: "chat"
---
This document describes how to quickly integrate the Chat SDK (Unreal Engine) to your projects. To configure and integrate the SDK, follow these steps.

## Environment Requirements

Unreal Engine 4.27.1 or later.
| Platform | Environment |
| --- | --- |
| Android | Android Studio 4.0 or later.<br>Visual Studio 2017 15.6 or later.<br>A real device for testing. |
| iOS & macOS | Xcode 11.0 or later.<br>OSX 10.11 or later.<br>Ensure your project has a valid developer signature. |
| Windows | OS: Windows 7 SP1 or later (64-bit based on x86-64).<br>Disk capacity: at least 1.64 GB of space after the IDE and required tools are installed.<br>Install <a href="https://visualstudio.microsoft.com/zh-hans/downloads/">Visual Studio 2019</a>. |

## Integrating the SDK
1. Download the SDK and [SDK source code](https://github.com/tencentyun/IMUnrealEngine).

2. Copy the `SDK` folder to the **Source/[project_name]** directory of your project (**[project_name]** is the name of your project).

3. Add the following function to the **[project_name].Build.cs** file in your project.

   ``` bash
   // Load the Chat underlying libraries of platforms
   private void loadTIMSDK(ReadOnlyTargetRules Target) {
    string _TIMSDKPath = Path.GetFullPath(Path.Combine(ModuleDirectory, "TIMSDK"));
    bEnableUndefinedIdentifierWarnings = false;
    PublicIncludePaths.Add(Path.Combine(_TIMSDKPath, "include"));
    if (Target.Platform == UnrealTargetPlatform.Android) {
        PrivateDependencyModuleNames.AddRange(new string[] { "Launch" });
        AdditionalPropertiesForReceipt.Add(new ReceiptProperty("AndroidPlugin", Path.Combine(ModuleDirectory, "TIMSDK", "Android", "APL_armv7.xml")));
   
        string Architecture = "armeabi-v7a";
        // string Architecture = "arm64-v8a";
        // string Architecture = "armeabi";
        PublicAdditionalLibraries.Add(Path.Combine(ModuleDirectory,"TIMSDK", "Android", Architecture, "libImSDK.so"));
    }
    else if (Target.Platform == UnrealTargetPlatform.IOS) {
        PublicAdditionalLibraries.AddRange(
            new string[] {
                "z","c++",
                "z.1.1.3",
                "sqlite3",
                "xml2"
            }
        );
    PublicFrameworks.AddRange(new string[]{
            "Security",
            "AdSupport",
            "CoreTelephony",
            "CoreGraphics",
            "UIKit"
        });
        PublicAdditionalFrameworks.Add(new UEBuildFramework("ImSDK_CPP",_TIMSDKPath+"/ios/ImSDK_CPP.framework.zip", ""));
    }
    else if(Target.Platform == UnrealTargetPlatform.Mac) {
        PublicAdditionalLibraries.AddRange(new string[] {
            "resolv",
            "z",
            "c++",
            "bz2",
            "sqlite3",
        });
    PublicFrameworks.AddRange(
            new string[] {
                "AppKit",
                "Security",
                "CFNetwork",
                "SystemConfiguration",
            });
        PublicFrameworks.Add(Path.Combine(_TIMSDKPath, "Mac", "Release","ImSDKForMac_CPP.framework"));
    }
    else if (Target.Platform == UnrealTargetPlatform.Win64) {
        PublicAdditionalLibraries.Add(Path.Combine(_TIMSDKPath, "win64", "Release","ImSDK.lib"));
        PublicDelayLoadDLLs.Add(Path.Combine(_TIMSDKPath, "win64", "Release", "ImSDK.dll"));
        RuntimeDependencies.Add("$(BinaryOutputDir)/ImSDK.dll", Path.Combine(_TIMSDKPath, "win64", "Release", "ImSDK.dll"));
    }
   }
   ```
4. Call the function in the **[project_name].Build.cs** file:

5. You have successfully integrated the Chat SDK. You can use Chat features in your CPP file via `#include "V2TIMManager.h"`.

   ``` bash
   // Get the SDK singleton object
   V2TIMManager* timInstance = V2TIMManager::GetInstance();
   // Get the SDK version number
   V2TIMString timString = timInstance->GetVersion();
   // Initialize the SDK
   V2TIMSDKConfig timConfig;
   timConfig.initPath = static_cast<V2TIMString>("D:\\");
   timConfig.logPath = static_cast<V2TIMString>("D:\\");
   bool isInit = timInstance->InitSDK(SDKAppID, timConfig);
   ```

## Packaging

【macOS】

**File** -> **Package Project** -> **Mac**

【Windows】

**File** -> **Package Project** -> **Windows** -> **Windows(64-bit)**

【iOS】

Go to **File > Package Project > iOS** to package your project

【Android】

For development and testing, see [Android Quick Start](https://docs.unrealengine.com/4.27/en/SharingAndReleasing/Mobile/Android/GettingStarted/).
For packaging, see [Packaging Android Projects](https://docs.unrealengine.com/4.27/en/SharingAndReleasing/Mobile/Android/PackagingAndroidProject/).

## API Documentation of Chat Unreal Engine

For more information on APIs, see [API Overview](https://im.sdk.qcloud.com/doc/en/md_introduction_CPP%E6%A6%82%E8%A7%88.html).

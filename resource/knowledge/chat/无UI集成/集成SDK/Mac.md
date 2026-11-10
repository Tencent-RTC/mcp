---
sync_node_id: '131316093523021824'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "Mac"
product: "chat"
---
This document describes how to quickly integrate the Chat SDK (Mac) into your projects. To configure and integrate the SDK, follow these steps.

## Development Environment Requirements
- Xcode 9.0+.

- Mac device running OS X 10.10 or later.

- The project has been configured with a valid developer signature.

## Integrating Chat SDK

You can either automatically integrate the Chat SDK by using CocoaPods, or manually download the SDK and import it to your current project.

### Automatically loading CocoaPods

#### 1. Install CocoaPods

Run the following command in a terminal window (you need to install the Ruby environment on your Mac device in advance):
``` bash
sudo gem install cocoapods
```

#### 2. Create a Podfile

Navigate to the path where the project is located and run the following command. Then, a Podfile will appear under the project path.
``` bash
pod init
```

#### 3. Edit the Podfile

Edit the Podfile as follows:
``` bash
platform :macos, '10.10'
source 'https://github.com/CocoaPods/Specs.git'

target 'mac_test' do
pod 'TXIMSDK_Mac'
end
```

#### 4. Update and install the SDK

Run the following command in a terminal window to update the local library file and install TXIMSDK_Mac:
``` bash
pod install
```

Alternatively, run the following command to update the local library version:
``` bash
pod update
```

After the pod command is executed, a project file integrated with the SDK and suffixed .xcworkspace will be generated. Double-click the file to open it.

### Manual integration

<b>1. Obtain the SDK download URL from [Github](https://github.com/tencentyun/TIMSDK):</b>
- ImSDKForMac.framework is the core dynamic library file of the SDK.

   |Pack Name|Description|ipa Increment|
   |---------|---------|---------|
   |ImSDKForMac.framework|Chat feature pack|1.4 MB|

#### 2. Create a project

**Create a project**:

**Enter a project name**:

#### 2. Integrate Chat SDK

**Add the dependent library:** select the **Target** of Demo. On the **General** panel, add the dependent library under **Embedded Binaries** and **Linked Frameworks and Libraries**.

**Add the dependent library:**
``` bash
ImSDKForMac.framework
```

> **Caution: **
> You need to add `-ObjC` in **Build Setting** > **Other Linker Flags**.
> 

## Referencing Chat SDK

Use the SDK in project code in two ways:
- Method 1: Navigate to **Xcode** > **Build Setting** > **Header Search Paths**, and set the ImSDKForMac.framework/Headers path. In files that require the SDK API, directly reference the header file "ImSDK.h".

   ``` bash
   #import "ImSDK.h"
   ```
- Method 2: in the files that require the SDK API, import the header file <ImSDKForMac/ImSDK.h>.

   ``` bash
   #import <ImSDKForMac/ImSDK.h>
   ```

---
sync_node_id: '89644533642739712'
nav_path:
  - "RTC Engine"
  - "API-Example"
  - "Electron"
product: "trtc"
---
This document shows you how to quickly run TRTC-API-Example (Electron).

## Prerequisites

You have [signed up for a Tencent Cloud account](https://trtc.io/register).

## Directions

### Step 1. Create an application
1. Log in to the [TRTC console overview page](https://console.trtc.io/), click **Create Application**.

2. In the popup page, select RTC Engine, enter the application name, and then click **Create**.

   

### Step 2. Get your SDKAppId and SecretKey

After your application created, you can get your `SDKAppID` and `SDKSecretKey` on Basic informaction. `SDKAppID` and `SDKSecretKey` is needed for running demo.

### Step 3. Download the sample code

1.Go to [GitHub](https://github.com/LiteAVSDK/TRTC_Electron) to download the sample code for your platform.
``` bash
git clone https://github.com/LiteAVSDK/TRTC_Electron.git
```

2.The steps to import SDK can refer to [Electron SDK import](https://trtc.io/document/35097).

### Step 4. Configure the project

Find and open `Electron/TRTC-API-Example/assets/debug/gen-test-user-sig.js` and set the following parameters:
- `SDKAPPID`: A placeholder by default. Set it to the actual SDKAppID.

- `SDKSECRETKEY`: A placeholder by default. Set it to the actual key.

   > **Note**
   > 
   > - The method for generating `UserSig` described in this document involves configuring `SDKSECRETKEY` in the client code. In this method, `SDKSECRETKEY` may be easily decompiled and reversed, and if your key is disclosed, attackers can steal your Tencent Cloud traffic. Therefore, **this method is only suitable for the local execution and debugging of TRTC-API-Example**.
   > - The best practice is to integrate the calculation code of `UserSig` into your server and provide an application-oriented API. When `UserSig` is needed, your application can send a request to your server for a dynamic `UserSig`. For more information, see [How do I calculate UserSig during production?](https://www.tencentcloud.com/zh/document/product/1047/34385).

## FAQs

### 1. What firewall restrictions does the SDK face?

The SDK uses the UDP protocol for audio/video transmission and therefore cannot be used in office networks that block UDP. If you encounter such a problem, refer to [Firewall Restrictions](https://trtc.io/document/35164) to troubleshoot the issue.

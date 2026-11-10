---
sync_node_id: '89644533591359488'
nav_path:
  - "RTC Engine"
  - "API-Example"
  - "Android"
product: "trtc"
---
This document provides a step-by-step guide on how to get started with TRTC Android SDK through [our sample project on Github.](https://github.com/Tencent-RTC/TRTC_Android)

## Prerequisites
- **Minimum supported**: Android 4.4 (SDK API level 19); **Recommended**: Android 5.0 (SDK API level 21) or later.

- Android Studio 4.0 or later.

- Devices with Android 4.4 or later.

## Project Setup

### Step 1. Download the project

Download our SDK and demo code from [GitHub](https://github.com/Tencent-RTC/TRTC_Android), or run the following command to clone the repository.
``` bash
git clone https://github.com/Tencent-RTC/TRTC_Android.git
```

### Step 2. Configure the project
1. Sign in to the [TRTC console](https://console.trtc.io/), click **Create Application** in the **Applications** section. You may skip this step if you already have an application.

2. Obtain your application's `SDKAppID` and `SDKSecretKey` in the **Basic Information** section.

   

3.  Replace `SDKAppID` and `SDKSecretKey` in `GenerateTestUserSig.java` under `TRTC-API-Example/Debug/src/main/java/com.tencent.trtc.debug` directory.

   

   > **Note：**
   > 
   > - In the demo above, we used **SDKSecretKey** to generate **UserSig** locally in order to help you go through the demo easier. However, in the production environment, you are not supposed to generate userSig in this way, which may lead to **SDKSecretKey** leakage, thereby creating a chance for attackers to steal your TRTC traffic. **The correct way to generate UserSig is to integrate** [**Server-Side Generation of UserSig**](https://trtc.io/document/35166) **on your server.** When an user enters the room:
   > - Send a http request to your server.
   > - Generate a UserSig on your server.
   > - Return it to the user to enter the room.
   > - When you deploy your page to a production environment, you need to have your page accessed through the HTTPS(e.g. `https://domain/xxx`). For the reason, please refer to the document [Page Access Protocol Restriction Description](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-05-info-browser.html#h2-3).

### Step 3. Run the project

Open the project root directory (`/TRTC-API-Example/`) in Android Studio, then run the project.

### Step 4. Discover TRTC features

You may select and experience the features aligned with your interests:

## Frequent Asked Questions
- For more common questions, see [Android SDK FAQs](https://trtc.io/document/36058).

- Any feedback or additional feature requirements? Feel free to contact us at **info_rtc@tencent.com**.

TUIRoomKit is a one-stop multi-person video conferencing solution provided by Tencent Cloud, integrating complete UI components and core features. Through this document, developers can quickly learn how to integrate TUIRoomKit into a project to implement multi-person video conferencing functionality. This document also explains in detail how to quickly integrate the UI project, replace image resources, and customize styles, helping developers build audio/video applications that match their brand identity.

<style>
.vsdk-survey-card * {
  box-sizing: border-box;
}

.vsdk-survey-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 22px;
  margin: 16px 0;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%);
  border: 1px solid #D7E8FF;
  box-shadow: 0 4px 16px rgba(0,110,255,.05);
  transition: all .25s ease;
}

.vsdk-survey-card::before{
  content:"";
  position:absolute;
  right:-60px;
  top:-60px;
  width:180px;
  height:180px;
  background:radial-gradient(circle,
      rgba(0,110,255,.16) 0%,
      rgba(0,110,255,.08) 45%,
      transparent 75%);
  pointer-events:none;
}

.vsdk-survey-card::after{
  content:"";
  position:absolute;
  left:-40px;
  bottom:-60px;
  width:120px;
  height:120px;
  background:radial-gradient(circle,
      rgba(76,169,255,.08),
      transparent 70%);
  pointer-events:none;
}

.vsdk-survey-card:hover{
  border-color:#006EFF;
  box-shadow:
      0 10px 28px rgba(0,110,255,.10),
      0 0 36px rgba(0,110,255,.08);
  transform:translateY(-2px);
}

.vsdk-card-left{
  display:flex;
  align-items:center;
  gap:14px;
  flex:1;
  min-width:0;
  position:relative;
  z-index:1;
}

.vsdk-ico{
  width:46px;
  height:46px;
  flex:0 0 46px;
  border-radius:12px;
  background:linear-gradient(180deg,#EDF5FF,#DCEBFF);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:22px;
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.8),
      0 6px 18px rgba(0,110,255,.12);
}

.vsdk-text{
  min-width:0;
}

.vsdk-title{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  font-size:18px;
  font-weight:600;
  color:#1F2329;
  line-height:1.4;
}

.vsdk-badge{
  padding:2px 8px;
  border-radius:999px;
  background:#EAF3FF;
  color:#006EFF;
  font-size:11px;
  font-weight:600;
}

.vsdk-desc{
  margin-top:6px;
  font-size:13px;
  line-height:1.7;
  color:#4E5969;
}

.vsdk-card-right{
  flex-shrink:0;
  position:relative;
  z-index:1;
}

.vsdk-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:112px;
  height:40px;
  padding:0 22px;
  border-radius:8px;
  background:#006EFF;
  color:#FFFFFF;
  text-decoration:none;
  font-size:14px;
  font-weight:600;
  box-shadow:0 8px 20px rgba(0,110,255,.25);
  transition:all .2s ease;
}

.vsdk-cta:hover{
  background:#0052D9;
  box-shadow:0 10px 24px rgba(0,110,255,.35);
}

@media (max-width:768px){

.vsdk-survey-card{
    flex-direction:column;
    align-items:flex-start;
}

.vsdk-card-left{
    width:100%;
    align-items:flex-start;
}

.vsdk-title{
    font-size:16px;
}

.vsdk-desc{
    font-size:12px;
}

.vsdk-card-right{
    width:100%;
    margin-top:14px;
}

.vsdk-cta{
    width:100%;
}

}
</style>

<div class="vsdk-survey-card">

<div class="vsdk-card-left">

<div class="vsdk-ico">💡</div>

<div class="vsdk-text">

<div class="vsdk-title">
Hit an integration blocker? 30-second feedback
<span class="vsdk-badge">All optional</span>
</div>

<div class="vsdk-desc">
Evaluating or getting to know the Conference SDK? If you run into any blockers with the UI, features, docs, or package activation, feel free to share your feedback.
</div>

</div>

</div>

<div class="vsdk-card-right">
<a class="vsdk-cta" href="https://wj.qq.com/s2/27395009/ac34/" target="_blank">
Submit feedback
</a>
</div>

</div>

## Prerequisites

### Enable the service

Refer to Enable Service to obtain the TUIRoomKit trial version, and get the following information on the [Application Management](https://console.cloud.tencent.com/trtc) page:
- **SDKAppID**: The application identifier (required). Tencent Cloud performs billing statistics based on the SDKAppID.

- **SDKSecretKey**: The application secret key, used for the key information in the initialization configuration file.

### Environment preparation

> **Note:**
> HBuilderX versions 4.64 and 4.65 have known compatibility issues with UTS plugin packaging. It is recommended to use version 4.66 or later.
>

- [HBuilderX](https://www.dcloud.io/hbuilderx.html): HBuilderX is the **official uni-app** integrated development environment (IDE). We need it to import, configure, and run our Demo.

- 2 mobile devices: An Android 5.0 or later device / an iOS 13.0 or later device.

## Quick integration

### **Step 1: Download the TUIRoomKit component**

#### 1. Clone the project source code
``` bash
git clone
```

#### 2. Import the atomic-x component
- Copy the entire `tuikit-atomic-x` folder under the `TUIKit_uni-app/App/uni_modules` directory in the source code into the `uni_modules` folder in the root directory of your project.

- Copy the files under `TUIKit_uni-app/App/components` in the source code into the `components` folder of your project.

- Copy the files under the `TUIKit_uni-app/App/static` directory in the source code into the folder of the same name in the root directory of your project.

#### 3. Copy the create-room, join-room, room main page, and other pages
- Copy the files under the `TUIKit_uni-app/App/pages` directory in the source code into the folder of the same name in the root directory of your project.

- Copy the `TUIKit_uni-app/App/debug` folder in the source code into the root directory of your project. This directory provides convenient functions that let you quickly generate a **UserSig** on the client.

#### 4. Merge the App.vue configuration

The **TUIKit_uni-app/App/App.vue** file contains the initialization logic for multi-person video conferencing capabilities, so you need to merge the **TUIKit_uni-app/App/App.vue** file with the **App.vue** file in your project.

   > **Note:**
   >
   > Do not directly overwrite the **App.vue** file! Open the **TUIKit_uni-app/App/App.vue** in the source code, and append the ts content in its `<script>` section into the `<script>` tag of your own project's **App.vue**.
   >

### Step 2: Project configuration
1. Configure `manifest.json`

   Open the **manifest.json** file of your project, and under the **app-plus** > **distribute** node, make sure the following required permissions are added:

  - Android platform (`android` node): In the `permissions` array, make sure the following permissions are included:

      ``` json
      "<uses-permission android:name=\"android.permission.CAMERA\"/>",
      "<uses-permission android:name=\"android.permission.RECORD_AUDIO\" />",
      "<uses-permission android:name=\"android.permission.INTERNET\"/>",
      "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>",
      "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\"/>"
      ```
  - iOS platform (ios node): In the `privacyDescription` object, make sure the following descriptions are included:

      ``` json
      "NSCameraUsageDescription" : "The app needs to access your camera for multi-person audio/video interaction",
      "NSMicrophoneUsageDescription" : "The app needs to access your microphone for multi-person audio/video interaction"
      ```

      In the `UIBackgroundModes` array, add `audio` to support background audio playback.

      ``` json
      "UIBackgroundModes" : [ "audio" ]
      ```
2. Create a custom base.

   > **Note:**
   >
   > Since TUIRoomKit contains native code (UTS plugins), you **must** create a custom debugging base to run on a real device.
   >

  1. In the HBuilderX top menu, select **Run** > **Run to phone or emulator** > **Create custom debugging base**.

  2. After it is created successfully, select **Run** > **Run to phone or emulator** again, check **Use custom debugging base** in the dialog, and run it to your phone.

      For detailed instructions, see Compile and run the Demo.

### Step 3: Login

After integration is complete, you need to complete the login. Log in where your project needs to use multi-person video conferencing capabilities. This is **a key step in using TUIRoomKit**, because only after a successful login can you use the various features of TUIRoomKit normally, so please patiently check whether the relevant parameters are configured correctly:
``` typescript
import { useLoginState } from "@/uni_modules/tuikit-atomic-x/state/LoginState";

const { login } = useLoginState();

onMounted(() => {
  login({
	sdkAppID: 1400000001,     // Please replace with the SDKAppID from the Enable Service console
	userID: "your userID",        // Please replace with your UserID
	userSig: "xxxxxxxxxxx",  // You can compute a UserSig in the console and fill it in here
  });
});

```

**Login interface parameter description**
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Number | Obtained from <a href="https://console.cloud.tencent.com/trtc">TRTC Console > Application Management</a>. |
| userID | String | The unique ID of the current user, containing only English letters, digits, hyphens, and underscores. |
| userSig | String | The ticket used for Tencent Cloud authentication. Please note:<br>- Development environment: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate UserSig, or generate a temporary UserSig through the <a href="https://console.cloud.tencent.com/im/tool-usersig">UserSig helper tool</a>.<br>- Production environment: To prevent key leakage, be sure to generate UserSig on the server side. For details, see <a href="https://cloud.tencent.com/document/product/647/17275#formal">Generating UserSig on the server</a>.<br>For more information, see <a href="https://cloud.tencent.com/document/product/647/17275">How to compute and use UserSig</a>. |

### Step 4: Register the multi-person video conferencing main page

Now, you need to tell your application in the `pages.json` file that this new page exists.

Open the `pages.json` file in the root directory of your project, and in the `"pages"` array, add the following object to register the multi-person video conferencing main page.
``` json
{
    "pages": [
        // ... other page configurations already in your project
        {
            "path": "pages/scenes/room/main/index",
            "style": {
                "navigationBarTitleText": "",
                "disableSwipeBack": true, // Disable swipe-right back to prevent accidental exit during a meeting
                "app-plus": {
                    "titleNView": false // Hide the native navigation bar and use the custom navigation inside the page
                }
            }
        }
    ]
    // ... other configurations
}
```

### Step 5: Navigate to the multi-person video conferencing main page

#### Create a room

Where you need to create a multi-person video conference (determined by your business, executed in its click event), call the `uni.navigateTo` or `uni.redirectTo` method to enter the multi-person video conferencing main page.
``` typescript
// Example: in a button's click event
function startBroadcast() {
  const roomID = '123456'; // room id
  const roomName = '123456'; // room name
  const query = [
    'mode=create',
    `roomID=${encodeURIComponent(roomID)}`,
    `roomName=${encodeURIComponent(roomName)}`,
    'autoEnableCamera=1',     // Whether to turn on the camera when entering the room (1 on, 0 off)
    'autoEnableMicrophone=1', // Whether to turn on the microphone when entering the room (1 on, 0 off)
    'autoEnableSpeaker=1',    // Whether to turn on the speaker when entering the room (1 on, 0 off)
  ].join('&');
  uni.navigateTo({ url: `/pages/scenes/room/main/index?${query}` }); // The URL corresponds to the path configured in pages.json
}
```

> **Note:**
> **navigateTo** vs. **redirectTo**
>
> - `uni.navigateTo`: Keeps the current page and navigates to the new page. The user can return from the multi-person video conferencing main page to the previous page. Suitable for scenarios where creating a room can be canceled beforehand.
> - `uni.redirectTo`: Closes the current page and navigates to the new page; the user cannot go back. Suitable for scenarios where the user enters the main flow directly, without needing to keep the previous UI. You can choose which to use according to your own business needs.

#### Join a room

Where you need to join a multi-person video conference (determined by your business, executed in its click event), call the `uni.navigateTo` or `uni.redirectTo` method to enter the multi-person video conferencing main page.
``` typescript
// Example: in a button's click event
function startBroadcast() {
  const roomID = '123456'; // room id
  const query = [
    'mode=join',
    `roomID=${encodeURIComponent(roomID)}`,
    'autoEnableCamera=1',     // Whether to turn on the camera when entering the room (1 on, 0 off)
    'autoEnableMicrophone=1', // Whether to turn on the microphone when entering the room (1 on, 0 off)
    'autoEnableSpeaker=1',    // Whether to turn on the speaker when entering the room (1 on, 0 off)
  ].join('&');
  uni.navigateTo({ url: `/pages/scenes/room/main/index?${query}` }); // The URL corresponds to the path configured in pages.json
}
```

## Customizing your UI

### Replacing the icons of the main page bottom bar, top bar, and video stream user info UI

All icons used by TUIRoomKit are stored under the `static/images` directory. Some examples are shown below. You can replace the icons in this directory according to your needs.

Top bar:

|Icon path|Detailed description|
|---------|---------|
|/static/images/room/room_switch_camera.png|Top bar switch camera icon.|
|/static/images/room/room_speakerphone.png|Top bar speaker icon.|
|/static/images/room/room_earpiece.png|Top bar earpiece icon.|

Bottom bar:

|Icon path|Detailed description|
|---------|---------|
|/static/images/room/room_member.png|Bottom bar member icon.|
|/static/images/room/room_mic_on.png|Bottom bar microphone on icon.|
|/static/images/room/room_mic_off.png|Bottom bar microphone off icon.|
|/static/images/room/room_camera_on.png|Bottom bar camera on icon.|
|/static/images/room/room_camera_off.png|Bottom bar camera off icon.|

User status info in the video stream area:

|Icon path|Detailed description|
|---------|---------|
|/static/images/room/room_video_view_mic_on.png|Video stream user microphone on icon.|
|/static/images/room/room_video_view_mic_off.png|Video stream user microphone off icon.|
|/static/images/room/room_video_view_owner.png|Video stream user host role icon.|
|/static/images/room/room_video_view_admin.png|Bottom bar administrator role icon.|

### Setting the font size / color

The uni-app official docs restrict setting the font size and color of an **nvue** page to the `text` tag only. For the text you want to modify, just modify its `css` style directly. Example below.

Take the text "Unmute" as an example:
``` typescript
<template>
  <text class="bottom-text">Unmute</text>
</template>

<style>
  .bottom-text {
    color: #FFFFFF;
    font-size: 20rpx;
    margin-top: 6rpx;
    text-overflow: ellipsis;
  }
</style>
```

Modify its css style:
``` typescript
<template>
  <text class="bottom-text">Enable audio</text>
</template>

<style>
 .bottom-text {
    color: red;
    font-size: 24rpx;
    margin-top: 6rpx;
    text-overflow: ellipsis;
  }
</style>

```

Final effect:

### Setting the button size

You can also set the button size directly by modifying the `css` properties. Example below:

Take the microphone button in the bottom bar as an example:
``` typescript
<template>
<image class="bottom-icon" src="/static/images/room/room_mic_on.png" mode="aspectFit"/>
<text class="bottom-text">Unmute</text>
</template>

<style>
  .bottom-icon {
    width: 48rpx;
    height: 48rpx;
  }
</style>
```

Set the corresponding `css` properties:
``` typescript
<template>
<image class="bottom-icon" src="/static/images/room/room_mic_off.png" mode="aspectFit"/>
<text class="bottom-text">Unmute</text>
</template>

<style>
  .bottom-icon {
    width: 70rpx;
    height: 70rpx;
  }
</style>

```

Final effect:

### Hiding a button

You can hide a button directly by commenting out the code. Example below.

Take the microphone button in the bottom bar as an example:
``` typescript
<!-- Bottom bar -->
<view class="bottom-bar">
  <MembersButton />
   <!-- <MicButton /> -->   <!-- Hide the microphone icon -->
  <CameraButton />
</view>
```

Comment it out to hide the button.

### Adding a button

Insert the corresponding button implementation where you need to add it.

Take adding a "More" button to the bottom bar as an example:
``` typescript
<template>
  ......
 <!-- Bottom bar -->
    <view class="bottom-bar">
    ......
	  <view class="action-button-item">
	    <image class="bottom-icon" src="/static/images/more.png" mode="aspectFit" />
	    <text class="bottom-text">More</text>
	  </view>
    </view>
</template>

<style>
  .bottom-icon {
    width: 48rpx;
    height: 48rpx;
  }
  .bottom-text {
    color: #FFFFFF;
    font-size: 20rpx;
    margin-top: 6rpx;
    text-overflow: ellipsis;
	text-align: center;
  }
</style>
```

## FAQs

#### **Q: Does this TUIKit plugin support compiling to H5 or WeChat Mini Program?**

A: **No.** Because the new TUIKit is developed based on the **UTS (Uni-app Type Script)** plugin architecture and deeply relies on the native capabilities of Android and iOS (such as the native rendering engine, local database, and audio/video codecs), it can only be packaged as an **App (Android/iOS)**.

#### **Q: My existing project is all** `.vue` **pages (Webview rendering). Can I integrate it directly?**

A: **You can mix them, but you need to pay attention to the page mode.**

nvue pages and vue pages can navigate to each other, but it is not recommended that a vue page's sub-component be an nvue component. TUIKit's UI components are nvue components, so the **page (pages)** where TUIKit is used must also be an nvue file.

#### **Q: Page styles are messed up and the layout collapses?**

A: **You did not strictly follow the nvue Flex layout specification.**

In nvue pages:
- The default `flex-direction` is `column` (vertical), not `row` as on the Web.

- Text must be wrapped in a `<text>` component and cannot be written directly in a `<div>` or `<view>`.

- Shorthand properties (e.g. `margin: 10px 20px`) are not supported; they must be written out fully (`margin-top`, `margin-left`, etc.).

#### **Q:** Running reports the error "uni is not defined" or a component cannot be loaded?

A: Please check whether you have created and used a **custom debugging base**.

Because the plugin contains native code (Java/Objective-C), the standard base does not include these native libraries.
- **Solution:** Please strictly follow the "Run and test - Step 2" in the documentation. In HBuilderX, click **Run** > **Run to phone or emulator** > **Create custom debugging base**. After it is created, when running, be sure to select **Run to Android/iOS base** and check "Use custom base".

#### **Q: What should I do if creating the custom base keeps failing or hanging?**

A: This is usually caused by a configuration issue in the local native compilation environment (Gradle or CocoaPods).
- **Android:** Please check whether the local JDK version is compatible, and whether the network can access the Maven/Google repositories normally.

- **iOS:** Please make sure CocoaPods is installed and up to date, and check whether the network environment can access GitHub or CDN libraries.

This guide walks you through quickly integrating the TUICallKit component into a uni-app project and running on **Android** and **iOS** platforms. You can complete the following key steps in about 10 minutes and get a fully functional audio/video calling interface.

## Prerequisites

### Development Environment Requirements
- It is recommended to use **HBuilderX 4.31** or later for development.
- iOS: iOS 13.0 or later.
- Android: Android 5.0 (SDK API Level 21) or later.
- The mini program dev tool does not support native components (i.e., `<live-pusher>` and `<live-player>` tags). You need to run and test on a **real device**.
- For running on a real device, first install the [uni-app native runtime app](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/appkey.html#%E7%AC%AC%E4%B8%80%E6%AD%A5-%E7%94%B3%E8%AF%B7appkey) base, or make a custom base.

### Activate the Service
Before using Tencent Cloud audio/video services, you need to go to the console to activate the service for your application. For detailed steps, see [Activate Service](https://cloud.tencent.com/document/product/1640/81130). After activation, note down the `SDKAppID` and `SDKSecretKey` — you will need them in the subsequent login step.

## TUICallKit Source Code Integration

### Step 1: Create a uni-app Project

Create a uni-app project in HBuilderX.
1. Open HBuilderX editor.
2. Create a project via **File** > **New** > **Project**. Set the project name, select the default template, and click Create.

### Step 2: Download and Import the TUICallKit Component
1. Download the `TUICallKit` component to your local project directory.

   ``` bash
   npm i @tencentcloud/call-uikit-uniapp
   ```

   > **Note:**
   >
   > Run the npm command in the root directory of your uni-app project.
   >

2. Copy the `TUICallKit` folder (from `node_modules/@tencentcloud/call-uikit-uniapp/`) to your project root directory.

### Step 3: Import Required Native Plugins

To use TUICallKit on Android and iOS platforms, you need to import the required native plugins.

1. In [DCloud Plugin Market](https://ext.dcloud.net.cn/), search for and purchase the following native plugins:
   - [Tencent Cloud Native Chat Plugin](https://ext.dcloud.net.cn/plugin?id=7571)
   - [Tencent Cloud Native Audio/Video Call Plugin](https://ext.dcloud.net.cn/plugin?id=7096)

2. After purchase, go to the HBuilderX project, click **manifest.json** > **App Native Plugin Configuration** > **Cloud Plugin** > **Select Cloud Plugin**, and select the two plugins purchased above.

   > **Note:**
   >
   > After purchasing native plugins, you must make a **custom debug base** to use the native plugin capabilities. The standard base does not include special native plugins.
   >

### Step 4: Fill in SDKAPPID and SECRETKEY

Modify the `SDKAPPID` and `SECRETKEY` in the `TUICallKit/debug/GenerateTestUserSig-es.js` file.

### Step 5: Use the TUICallKit Component

1. Modify the `pages.json` file to set the page to full-screen mode.

   ``` json
   {
     "pages": [
       {
         "path": "pages/index/index",
         "style": {
           "navigationStyle": "custom",
           "app-plus": {
             "titleNView": false
           }
         }
       }
     ]
   }
   ```

2. Open the `pages/index/index.vue` file and add the following code.

   ``` html
   <template>
     <view class="container">
       <TUICallKit ref="TUICallKit" />
       <view class="input-box">
         <input
           type="text"
           maxlength="20"
           :placeholder="isLogin ? 'Enter callee userID' : 'Enter login userID'"
           :value="userID"
           @input="bindInputUserID"
         />
       </view>
       <view class="btn-box">
         <button @tap="isLogin ? call() : login()">
           {{ isLogin ? 'Call' : 'Login' }}
         </button>
       </view>
     </view>
   </template>

   <script>
   import TUICallKit from '../../TUICallKit/TUICallKit.vue';
   import * as GenerateTestUserSig from '../../TUICallKit/debug/GenerateTestUserSig-es.js';

   export default {
     components: { TUICallKit },
     data() {
       return {
         userID: '',
         isLogin: false,
       };
     },
     methods: {
       bindInputUserID(e) {
         this.userID = e.detail.value;
       },
       async login() {
         const userID = this.userID;
         if (!userID) return;
         const { userSig, SDKAppID } = GenerateTestUserSig.genTestUserSig({
           userID,
         });
         try {
           await this.$refs.TUICallKit.init({
             sdkAppID: SDKAppID,
             userID,
             userSig,
           });
           uni.showToast({ title: 'Login successful' });
           this.isLogin = true;
           this.userID = '';
         } catch (error) {
           uni.showToast({ title: 'Login failed', icon: 'error' });
         }
       },
       async call() {
         try {
           await this.$refs.TUICallKit.calls({
             userIDList: [this.userID],
             type: 2,
           });
         } catch (error) {
           uni.showToast({ title: 'Call failed', icon: 'error' });
         }
       },
     },
   };
   </script>

   <style>
   .container {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     height: 100vh;
   }
   .input-box {
     width: 80%;
     margin-bottom: 20px;
   }
   .btn-box {
     width: 80%;
   }
   button {
     background-color: #006eff;
     color: white;
     border-radius: 25px;
   }
   </style>
   ```
3. You must use **Vue 2** for compilation. Currently, **Vue 3** is not supported.

### Step 6: Build and Run
1. Make a custom base (for real-device testing):
   - In HBuilderX, click **Run** > **Run to Phone or Simulator** > **Make Custom Debug Base**.
   - Wait for the build to complete and the custom base to be installed on the device.

2. Run on a real device:
   - Click **Run** > **Run to Phone or Simulator** and select your connected device.
   - Select **Use Custom Base** for debugging.

3. Expected result after quick integration.

### Step 7: Make Your First Call
- Prepare two devices. Device A logs in with user "userA" and Device B logs in with user "userB".
- Device A enters "userB" as the callee and clicks the Call button. Device B will see an incoming call UI.
- Device B clicks the accept button to start the audio/video call.

   > **Note:**
   >
   > The first time you run the app, you need to grant camera and microphone permissions.
   >

## More Features

### Set Nickname and Avatar

Call the `setSelfInfo` API to set the current user's nickname and avatar:

``` javascript
this.$refs.TUICallKit.setSelfInfo({
  nickName: 'Tom',
  avatar: 'https://...'
})
```

### Set Custom Ringtone

Call the `setCallingBell` API to set a custom incoming call ringtone:

``` javascript
this.$refs.TUICallKit.setCallingBell('/static/bell.mp3')
```

> **Note:**
> Only local file paths are accepted. The ringtone setting is device-bound and persists across user switches. Pass an empty string to restore the default ringtone.

### Enable Mute Mode

Call the `enableMuteMode` API to enable mute mode (no ringtone on incoming calls):

``` javascript
this.$refs.TUICallKit.enableMuteMode(true)
```

### Enable Floating Window

Call the `enableFloatWindow` API to enable the floating window feature:

``` javascript
this.$refs.TUICallKit.enableFloatWindow(true)
```

## FAQ

### Why does the call UI not appear after running?
1. Ensure you are running on a **real device** rather than a simulator. Native components like `<live-pusher>` and `<live-player>` are not supported in simulators.
2. Ensure you have made a **custom debug base** that includes the required native plugins.
3. Check that camera and microphone permissions have been granted.

### What should I do if the native plugin is not found?
1. Verify that you have purchased the plugins from the DCloud Plugin Market.
2. Ensure the plugins are selected in **manifest.json** > **App Native Plugin Configuration**.
3. Rebuild the custom debug base after adding plugins.

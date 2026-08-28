This document describes how to rapidly integrate the TUICallKit component. You can complete the following key steps within 10 minutes and obtain a complete audio and video call interface.

## Preparations

### **Environmental Requirements**
- [Node.js](https://nodejs.org/en/) version 16+.

- Modern browser, supporting WebRTC APIs.

## Activate the service

Before using the audio and video service provided by Tencent Cloud, go to the console to activate the service for your application. For specific steps, see activating the service. After enabling the service, record the `SDKAppID` and `SDKSecretKey`, which will be used in subsequent steps（login）.

## Implementation

### Download the TUICallKit
1. Download the [@trtc/calls-uikit-vue](https://www.npmjs.com/package/@trtc/calls-uikit-vue) component. In existing projects or empty projects created using scaffolding tools like @vue/cli or Vite, the following demonstrates an empty project created with @vue/cli.

   ``` bash
   npm install @trtc/calls-uikit-vue
   ```
2. Copy the `debug` directory to your project directory `src/debug`, it is necessary when generating userSig locally.

【MacOS】
``` bash
cp -r node_modules/@trtc/calls-uikit-vue/debug ./src
```

【Windows】
``` html
xcopy node_modules\@trtc\calls-uikit-vue\debug .\src\debug /i /e
```

### Add the TUICallKit component

You can choose to import the sample code in the `src/App.vue` file.The example code uses the `Composition API` approach.
1. Using [<TUICallKit />](https://trtc.io/document/51015#init#tuicallkit), which contains the complete UI interaction during a call.

   ``` html
   <template>
     <span> caller's ID: </span>
     <input type="text" v-model="callerUserID">
     <button @click="init"> step1. init </button> <br>
     <span> callee's ID: </span>
     <input type="text" v-model="calleeUserID">
     <button @click="call"> step2. call </button>

     <!--【1】Import the TUICallKit component: Call interface UI -->
     <TUICallKit style="width: 650px; height: 500px " />
   </template>
   ```
2. Using the [TUICallKitAPI.init](https://trtc.io/document/51015#init) API to log in to the component, you need to `fill in` `SDKAppID, SDKSecretKey` **as two parameters in the code.**

   ``` javascript
   <script setup> // lang='ts'
   import { ref } from 'vue';
   import { TUICallKit, TUICallKitAPI } from "@trtc/calls-uikit-vue";
   import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; // Refer to Step 2.3

   const SDKAppID = 0;       // TODO: Replace with your SDKAppID (Notice: SDKAppID is of type number）
   const SDKSecretKey = '';  // TODO: Replace with your SDKSecretKey

   const callerUserID = ref('');
   const calleeUserID = ref('');

   //【2】Initialize the TUICallKit component
   const init = async () => {
     const { userSig } = GenerateTestUserSig.genTestUserSig({
       userID: callerUserID.value,
       SDKAppID,
       SecretKey: SDKSecretKey
     });
     await TUICallKitAPI.init({
       userID: callerUserID.value,
       userSig,
       SDKAppID,
     });
     alert('TUICallKit init succeed');
   }
   </script>
   ```
   |**Parameter**|**Type**|**Note**|
   |---------|---------|---------|
   |userID|String|**Unique identifier of the user,** `defined by you`**,** it is allowed to contain only upper and lower case letters (a-z, A-Z), numbers (0-9), underscores, and hyphens.|
   |SDKAppID|Number|The unique identifier for the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).|
   |SDKSecretKey|String|The SDKSecretKey of the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).|
   |userSig|String|A security protection signature used for user log in authentication to confirm the user's identity and prevent malicious attackers from stealing your cloud service usage rights.|

   > **Explanation of userSig:**
   >
   > - **Development environment:** If you are running a demo locally and developing debugging, you can use the `genTestUserSig` (Refer to Step 3.2) function in the debug file to generate a `userSig`. In this method, SDKSecretKey is vulnerable to decompilation and reverse engineering. Once your key is leaked, attackers can steal your Tencent Cloud traffic.
   > - **Production environment:** If your project is going live, please use the [Server-side Generation of UserSig](https://trtc.io/document/35166) method.

### Set Nickname and Avatar （Optional）

The user logging in for the first time has no avatar and nickname information. You can set the avatar and nickname through the [setSelfInfo](https://www.tencentcloud.com/document/product/647/51015#setSelfInfo) API.
``` typescript
try {
  await TUICallKitAPI.setSelfInfo({
    nickName: "jack",
    avatar: "http://xxx",
  });
} catch (error: any) {
  alert(`[TUICallKit] Failed to call the setSelfInfo API. Reason: ${error}`);
}
```

> **Note：**
> Due to user privacy restrictions, for calls between non-friends, there might be a delay in updating the callee's nickname and avatar. This will be updated smoothly after the first successful call.
>

### Start a Call

The caller can initiate a voice or video call by calling the [calls](https://www.tencentcloud.com/document/product/647/51015#calls) function and specifying the call type and the callee's userID. The [calls](https://www.tencentcloud.com/document/product/647/51015#calls) API simultaneously supports one-to-one calls and group calls. When the userIDList contains a single userID, it is a one-to-one call; when the userIDList contains multiple userIDs, it is a group call.
1. Using the [TUICallKitAPI.calls API](https://trtc.io/document/51015#calls) to make a call.

   ``` javascript
   import { TUICallKitAPI, CallMediaType } from "@trtc/calls-uikit-vue";
   //【3】Make a 1v1 video call
   const call = async () => {
     await TUICallKitAPI.calls({
       userIDList: [calleeUserID.value],
       type: CallMediaType.VIDEO,
     });
   };
   ```
2. Run the project.

   > **Warning:**
   >
   > **For local environment, please access under** `localhost protocol`**. For public network experience, please access under HTTPS protocol. For details, see** [Description of Network Access Protocol](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-05-info-browser.html#h2-3)**.**
   >

3. Open two browser pages, **enter different userID(defined by you)** click `step1. init` to login (caller and callee).

4. **After both userID init to successfully**, click on `step2. call`to make a call. If you have a call problem, refer to [FAQs](https://trtc.io/document/51024).

### Answering a Call

After the recipient completes login, the caller can initiate a call, and the recipient will receive the call invitation with ringtone and vibration.

## More Features

### Enabling Floating Window

You can enable/disable the floating window feature by calling [enableFloatWindow](https://www.tencentcloud.com/document/product/647/51015#enableFloatWindow). Enable this feature when initializing the TUICallKit component, with the default status being Off (false). Click the floating window button in the top-left corner of the call interface to minimize the call interface into a floating window format.

Use `enableFloatWindow(enable: boolean)` to enable/disable the floating window.
``` javascript
TUICallKitAPI.enableFloatWindow(true)
```

### Setting incoming call ringtone

You can configure the default ringtone and mute mode for incoming calls using the following methods:
- **Set the default ringtone:** Use the setCallingBell interface to set the ringtone that the callee receives.

  - Only local MP3 format file addresses can be used, ensuring that the file is accessible.

  - To reset the ringtone, pass in an empty string for filePath.

  - Use the ES6 import method to import the ringtone file.

      ``` javascript
      import filePath from '../public/ring.mp3';

      try {
        await TUICallKitAPI.setCallingBell(filePath?: string);
      } catch (error: any) {
        alert(`[TUICallKit] setCallingBell API failed. Reason: ${error}`);
      }
      ```
- **Mute mode for incoming calls:** Use the enableMuteMode interface to configure it.

   ``` javascript
   try {
     await TUICallKitAPI.enableMuteMode(enable: boolean);
   } catch (error: any) {
     alert(`[TUICallKit] enableMuteMode API failed. Reason: ${error}`);
   }
   ```

## Customizing Your UI

### Replacing icons

To replace an icon, source code import is required first. Copy the component to your project (the source code is in TypeScript version).

> **Note：**
> The Interface Replacing icons Plan is suitable for `Vue3 + TypeScript` and `@trtc/calls-uikit-vue` version number is 3.2.2 or later projects. If you are using other languages or technology stacks, please use the Custom UI Implementation.
>

1. **Download Source Code**

【Vue3】
``` bash
npm install @trtc/calls-uikit-vue
```

2. **Copy the source code into your own project, taking copying into the** `src/components/` **directory as an example:**

【macOS + Vue3】
``` bash
mkdir -p ./src/components/TUICallKit && cp -r ./node_modules/@trtc/calls-uikit-vue/* ./src/components/TUICallKit
```

【Windows + Vue3】
``` plaintext
xcopy .\node_modules\@trtc\calls-uikit-vue  .\src\components\TUICallKit /i /e
```

3. **Modify Import Path**

   ``` javascript
   import { TUICallKit, TUICallKitAPI } from "./components/TUICallKit/src/index";
   ```
4. **Solve Errors That May Be Caused by Copying Source Code**

   If you encounter an error while using the TUICallKit component, please don't worry. In most cases, this is due to inconsistencies between ESLint and TSConfig configurations. You can consult the documentation and configure correctly as required. If you need help, please feel free to contact us, and we will ensure that you can successfully use this component. Here are some common issues:

【ESLint Error】

If the TUICallKit causes an error due to inconsistency with your project's code style, you can block this component directory by adding a `.eslintignore` file in the root directory of your project, for example:
``` text
# .eslintignore
src/components/TUICallKit
```

【TypeScript Error】
1. If you encounter the 'Cannot find module '../package.json'' error, it's because TUICallKit references a JSON file. You can add the related configuration in tsconfig.json, example:

``` json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

For other TSConfig issues, please refer to [TSConfig Reference](https://www.typescriptlang.org/tsconfig).
2. If you encounter the 'Uncaught SyntaxError: Invalid or unexpected token' error, it's because TUICallKit uses decorators. You can add the related configuration in tsconfig.json, example:

``` json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

5. **Modify the icon components in the TUICallKit/Components/assets folder**

   > **Note:**
   >
   > To ensure the icon color and style remain consistent throughout the application, please keep the icon file name unchanged when replacing.
   >

【Desktop】

|Serial number|Resource Path|Description|
|---------|---------|---------|
|1|/TUICallKit/Components/assets/button/camera-close.svg|Camera Off icon|
|2|/TUICallKit/Components/assets/button/microphone-open.svg|Turn on the mic icon|
|3|/TUICallKit/Components/assets/button/speaker-open.svg|Turn on the speaker icon|
|4|/TUICallKit/Components/assets/button/desktop/inviteUser.svg|Invite user icon during call|
|5|/TUICallKit/Components/assets/button/hangup.svg|Hang Up Call icon|
|6|/TUICallKit/Components/assets/button/desktop/minimize.svg|Miniaturize Icon|
|7|/TUICallKit/Components/assets/button/desktop/fullScreen.svg|Full Screen Icon|

【Mobile】

| Serial number | Resource Path | Description |
| --- | --- | --- |
| 1 | /TUICallKit/Components/assets/button/mobile/minimize.svg | Miniaturize Icon |
| 2 | /TUICallKit/Components/assets/button/hangup.svg | Hang Up Call icon |
| 3 | /TUICallKit/Components/assets/button/accept.svg | Accept icon |
| 4 | /TUICallKit/Components/assets/button/microphone-open.svg | Turn on the mic icon |
| 5 | /TUICallKit/Components/assets/button/speaker-open.svg | Turn on the speaker icon |
| 6 | /TUICallKit/Components/assets/button/camera-close.svg | Camera Off icon |
| 7 | /TUICallKit/Components/assets/button/switchCamera.svg | Switch Camera Icon |

### Button Hiding

Invoke the hideFeatureButton interface to hide buttons, currently supporting Camera, Microphone, SwitchCamera, InviteUser. .

Taking the hiding of the **Camera Button** as an example.

【Vue3】
``` javascript
import { TUICallKitAPI, FeatureButton } from "@trtc/calls-uikit-vue";

TUICallKitAPI.hideFeatureButton(FeatureButton.Camera);
```

### Custom Call Background Image

The call background image appears when the camera is turned off during a voice or video call. Modify the local user's call interface background image by calling setLocalViewBackgroundImage, and modify the remote user's call interface background image with setRemoteViewBackgroundImage.

【Vue3】
``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-vue";

TUICallKitAPI.setLocalViewBackgroundImage('http://xxx.png');
TUICallKitAPI.setRemoteViewBackgroundImage('remoteUserId', 'http://xxx.png');
```

### Set Layout

> **Note：**
> **Only available for 1V1 video calls.**
>

Use setLayoutMode to set the call interface layout, currently only supports LocalInLargeView and RemoteInLargeView, see the LayoutMode enum for details.
1. LocalInLargeView layout, with the local user in the large window:

2. RemoteInLargeView layout, with the remote user in the large window:

【Vue3】
``` javascript
import { TUICallKitAPI, LayoutMode } from "@trtc/calls-uikit-vue";

TUICallKitAPI.setLayoutMode(LayoutMode.LocalInLargeView);
```

### Set the initial state of the camera

Use setCameraDefaultState to set the initial state of the camera button, currently supports Enabled and Off.

Taking the default Off state of the camera as an example:

【Vue3】
``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-vue";

TUICallKitAPI.setCameraDefaultState(false);
```

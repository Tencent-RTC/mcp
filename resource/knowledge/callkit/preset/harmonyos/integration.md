This guide walks you through quickly integrating the TUICallKit component. You can complete the following key steps in 10 minutes and get a fully functional audio/video calling interface.

## Prerequisites

### **Environment Requirements**
- IDE: DevEco Studio 6.0.0.858 or later.

- Device OS: HarmonyOS 5.0.5 or later.

- API Version: 17 or later.

### **Activate the Service**

Before using Tencent Cloud audio/video services, you need to go to the console to activate the service for your application. For detailed steps, see Activate Service. After activation, note down the `SDKAppID` and `SDKSecretKey` — you will need them in the subsequent login step.

## Quick Integration

### Step 1: Import the Component

2. In your project's `entry/oh-package.json5` file, add the following plugin dependencies:

   ``` json
   "dependencies": {
       "@tencentcloud/atomicxcore": "^4.2.0",
       "@tencentcloud/tuicallkit": "file:../../../call",
   }
   ```

   > **Note:**
   >
   > The `call` directory can be placed anywhere, as long as the relative path is correctly set in oh-package.json5.
   >

3. After modifying **oh-package.json5**, run the following command to install the local TUIKit component:

   ``` bash
   ohpm install
   ```

   `ohpm install` will automatically install the required dependencies.

   > **Warning:**
   >
   > - When using local integration, to upgrade you need to get the latest component code from GitHub and overwrite your local project's call directory.
   > - When private modifications conflict with remote changes, you need to manually merge and resolve conflicts.

### Step 2: Project Configuration
1. Permission configuration: In your project's `entry/module.json5` module section, declare the following required permissions:

   ``` json
   "requestPermissions":[
     {
       "name" : "ohos.permission.INTERNET"
     },
     {
       "name" : "ohos.permission.USE_BLUETOOTH"
     },
     {
       "name" : "ohos.permission.GET_BUNDLE_INFO"
     },
     {
       "name" : "ohos.permission.GET_NETWORK_INFO"
     },
     {
       "name" : "ohos.permission.GET_WIFI_INFO"
     },
     {
       "name" : "ohos.permission.MODIFY_AUDIO_SETTINGS"
     },
     {
       "name" : "ohos.permission.MICROPHONE",
       "reason": "$string:module_desc",
       "usedScene": { "abilities": [ "EntryAbility" ], "when":"always" }
     },
     {
       "name" : "ohos.permission.CAMERA",
       "reason": "$string:module_desc",
       "usedScene": { "abilities": [ "EntryAbility" ], "when":"always" }
     },
     {
       "name" : "ohos.permission.KEEP_BACKGROUND_RUNNING"
     },
   ]
   ```
2. Module declaration: After integrating the source code into your existing project, declare the module in the `build-profile.json5` file:

   ``` bash
    "modules": [
       {
         "name": "entry",
         "srcPath": "./entry",
         "targets": [
           {
             "name": "default",
             "applyToProducts": [
               "default"
             ]
           }
         ]
       },
       {
         "name": "tuicallkit",
         "srcPath": "../call",  // Adjust based on actual directory
         "targets": [
           {
             "name": "default",
             "applyToProducts": [
               "default"
             ]
           }
         ]
       }
     ]
   ```
3. Bind **TUICallKit** to your application's main window (WindowStage), enabling the entire app to accept incoming calls and initiate calls globally after startup, without repeated initialization in business pages.

   ``` typescript
   // Your project's EntryAbility.ets
   import { UIAbility } from '@kit.AbilityKit';
   import { window } from '@kit.ArkUI';
   import { TUICallKit } from '@tencentcloud/tuicallkit';

   export default class EntryAbility extends UIAbility {
     async onWindowStageCreate(windowStage: window.WindowStage): Promise<void> {
       windowStage.loadContent('pages/Index');
       // Hand the call UI hosting window to TUICallKit for management, establishing incoming call listeners
       TUICallKit.createInstance(this.context).attach(windowStage);
     }

     onWindowStageDestroy(): void {
       // Unbind the window and release resources
       TUICallKit.createInstance(this.context).detach();
     }
   }
   ```
4. Declare backgroundModes. Under the UIAbility hosting the call interface (typically EntryAbility), add backgroundModes to the abilities node in module.json5:

   ``` java
   "abilities": [
     {
       "name": "EntryAbility",
       // ... other configurations remain unchanged
       "backgroundModes": [
         "audioRecording",
         "audioPlayback"
       ]
     }
   ]
   ```

### Step 3: Login

After code integration, you need to complete the login process. This is a **critical step for using TUICallKit**. TUICallKit features are only available after a successful login, so please carefully verify that the relevant parameters are correctly configured:

> **Note:**
> In the sample code, the login API is called directly. However, in real projects, it is **strongly recommended to call TUICallKit's login service after completing your own user authentication flow**. This avoids business logic confusion or data inconsistencies caused by premature login calls, and better adapts to your project's existing user management and permission control system.
>

[ArkTS]
``` typescript
import { LoginStore } from '@tencentcloud/atomicxcore'

try {
  await LoginStore.shared().login(
    1400000000,     // Replace with your SDKAPPID
    'userID',       // Replace with your UserID
    'userSig',      // Replace with your UserSig
  );
  // login success
} catch (error) {
  // login error
}
```

**Login API parameter reference:**
| Parameter | Type | Description |
| --- | --- | --- |
| `sdkAppID` | `number` | Obtained from the [console](https://console.cloud.tencent.com/trtc). Usually a 10-digit number starting with `140` or `160`. |
| `userID` | `string` | Unique ID of the current user. Only contains letters, numbers, hyphens, and underscores. To avoid multi-device login conflicts, **do not use** simple IDs like `1` or `123`. |
| `userSig` | `string` | Authentication ticket for Tencent Cloud. For more information, see How to Calculate and Use UserSig.<br>**Note:**<br>- Development: You can use the local [GenerateTestUserSig.genTestSig](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/application/entry/src/main/ets/debug/GenerateTestUserSig.ts) function or the [UserSig Tool](https://console.cloud.tencent.com/im/tool-usersig) to generate a temporary userSig.<br>- Production: To prevent key leakage, always generate userSig on the server side. See Server-side UserSig Generation for details. |

### Step 4: Set Nickname and Avatar [Optional]

First-time users have no avatar or nickname. Use the `setSelfInfo` API from `LoginStore` to set personal information:
``` typescript
import { LoginStore, UserProfile, ErrorInfo } from '@tencentcloud/atomicxcore';

try {
  await LoginStore.shared().setSelfInfo(new UserProfile('userID', 'userName', 'avatarURL'));
  console.info("setSelfInfo success");
} catch (error) {
  const err = error as ErrorInfo;
  console.error(`setSelfInfo failed [code: ${err.code}] ${err.message}`);
}
```

**setSelfInfo API parameter reference:**
| Parameter/Return | Type | Description |
| --- | --- | --- |
| `userProfile` | `UserProfile` | Core user profile model containing:<br>- userID: The user ID to set information for.<br>- nickname: Nickname.<br>- avatarURL: Avatar URL. |

### Step 5: Initiate a Call

The caller can initiate a voice or video call by calling the `calls` function and specifying the call type and callee's userID. The `calls` API supports both one-to-one and group calls. When userIDList contains one userID, it is a one-to-one call; when it contains multiple userIDs, it is a group call.
``` typescript
import { TUICallKit, CallMediaType } from '@tencentcloud/tuicallkit';
import { ErrorInfo } from '@tencentcloud/atomicxcore';

try {
  await TUICallKit.createInstance(getContext(this)).calls(['mike'], CallMediaType.audio);
  // Success handling
} catch (error) {
  const err = error as ErrorInfo;
  // Failure handling
}
```

| Parameter | Type | Description |
|---------|---------|---------|
| userIdList | string[] | List of target user IDs. |
| mediaType | CallMediaType | Call media type, e.g., video call or voice call. |
| params? | CallParams | Call extension parameters, e.g., room ID, call invitation timeout, etc. |

### Step 6: Accept a Call

After the callee completes login, when the caller initiates a call, the callee receives a call invitation accompanied by a ringtone and vibration.

## More Features

### Enable Incoming Call Banner

You can call the `enableIncomingBanner` API to enable/disable the incoming call banner display. This feature is disabled by default (`false`). When the callee receives a call, a full-screen call waiting UI is shown by default. When enabled, a banner notification is shown first, then switches to the full-screen call UI as needed.

``` typescript
import { TUICallKit } from '@tencentcloud/tuicallkit';

TUICallKit.createInstance(context).enableIncomingBanner(true);
```

**Details:** Default is `false`. After the callee receives an invitation, a full-screen call waiting UI is shown by default. When enabled, a banner is shown first, then the full-screen call UI is launched as needed.

### Group Calls

When the caller uses the `calls` method to initiate a call with more than one user in the callee list, it is automatically treated as a group call. Other members can join via the `join` method.
- **Initiate a group call:** When using `calls` with more than one user in the `userIdList`, it is automatically treated as a group call.

   ``` typescript
   import { TUICallKit, CallMediaType } from '@tencentcloud/tuicallkit';
   import { ErrorInfo } from '@tencentcloud/atomicxcore';

   try {
     await TUICallKit.createInstance(getContext(this)).calls(['mike','tate'], CallMediaType.audio);
     // Success handling
   } catch (error) {
     const err = error as ErrorInfo;
     // Failure handling
   }
   ```
- **Join a group call:** Use the `join` method to join a specified group call.

   ``` typescript
   import { TUICallKit } from '@tencentcloud/tuicallkit';

   await TUICallKit.createInstance(context).join('your_call_id');
   ```
   | Parameter | Type | Description |
   |---------|---------|---------|
   | callId | string | Unique identifier of this call. |

### Ringtone Settings

You can set the default ringtone, mute mode for incoming calls, and offline push ringtone:
- **Set default ringtone (Method 1):** If you integrated TUICallKit via source code dependency, you can replace the ringtone resource files ([dialing tone](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/call/src/main/resources/rawfile/phone_dialing.m4a), [ringing tone](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/call/src/main/resources/rawfile/phone_ringing.mp3)) to set custom default ringtones.

- **Set default ringtone (Method 2):** Use the `setCallingBell` API to set the incoming call ringtone for the callee.

   ``` typescript
   import { TUICallKit } from '@tencentcloud/tuicallkit';

   TUICallKit.createInstance(context).setCallingBell('***/callingBell.mp3');
   ```

   **Details:** Only local file paths are accepted. Ensure the file directory is accessible by the application. The ringtone setting is bound to the device — it persists even when switching users. To restore the default ringtone, pass an empty filePath.

   | Parameter | Type | Description |
   |---------|---------|---------|
   | filePath | string | Path to the ringtone file. |

- **Mute mode for incoming calls:** Use the `enableMuteMode` API to enable mute mode.

   ``` typescript
   import { TUICallKit } from '@tencentcloud/tuicallkit';

   TUICallKit.createInstance(context).enableMuteMode(true);
   ```

   **Details:** When enabled, no ringtone is played when receiving a call request.

## Customize Your UI

### Replace Icon Buttons

You can directly replace the icons in the [src/main/resources/base/media](https://github.com/Tencent-RTC/TUIKit_Harmony/tree/main/call/src/main/resources/base/media) folder to ensure consistent icon styles throughout your app. Below are the basic function buttons — replace the corresponding icons to match your business scenario.

Common icon file list:
| Icon | Filename | Description |
| --- | --- | --- |
|  | icon_dialing.png | Accept call icon |
|  | icon_hangup.png | Hang up call icon |
|  | icon_mute_on.png | Mute microphone icon |
|  | icon_handsfree.png | Disable speaker icon |
|  | icon_camera_off.png | Disable camera icon |

## FAQ

### Is there a sample oh-package.json5 configuration for reference?

You can refer to the `oh-package.json5` sample file in the GitHub TUIKit_Harmony [application](https://github.com/Tencent-RTC/TUIKit_Harmony/tree/main/application) project.

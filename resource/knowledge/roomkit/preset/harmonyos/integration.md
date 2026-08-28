TUIRoomKit is a one-stop multi-person audio/video room solution provided by Tencent Cloud, integrating complete UI components and core features. Through this document, developers can quickly learn how to integrate TUIRoomKit into a project to implement multi-person audio/video room functionality. This document also explains in detail how to quickly replace image resources, localize text, and apply other personalized configurations, helping developers build audio/video applications that match their brand identity.

## Prerequisites

### Enable the service

Refer to Enable Service to obtain the TUIRoomKit trial version, and get the following information on the [Application Management](https://console.cloud.tencent.com/trtc) page:
- **SDKAppID**: The application identifier (required). Tencent Cloud performs billing statistics based on the SDKAppID.

- **SDKSecretKey**: The application secret key, used for the key information in the initialization configuration file.

### Environment preparation
- Integrated development environment: 6.0.0.858 or later.

- Phone operating system: HarmonyOS 5.0.5 or later.

- API Version: 17 or later.

## Quick integration

### Step 1: Integrate the TUIRoomKit component

#### Download the source code

Download the [TUIKit Harmony](https://github.com/Tencent-RTC/TUIKit_Harmony) source code from GitHub:
``` bash
git clone https://github.com/Tencent-RTC/TUIKit_Harmony.git
```

#### Integrate the component

2. In the `oh-package.json5` file of your project's `entry`, add the following plugin dependencies.

   ``` json
   "dependencies": {
       "@tencentcloud/atomicxcore": "^4.1.0",
       "@tencentcloud/atomicx": "file:../../../atomic_x",
       "@tencentcloud/tuiroomkit": "file:../../../room",
   }
   ```

   > **Note:**
   >
   > room and atomic_x can be placed anywhere, as long as the relative paths are set correctly in oh-package.json5.
   >

3. After modifying **oh-package.json5**, run the following command to install the local TUIKit components. Example:

   ``` bash
   ohpm install
   ```

   ohpm install will automatically install the required dependency libraries.

   > **Note:**
   >
   > - When using the local integration solution, if you need to upgrade, you need to get the latest component code from GitHub and overwrite the atomic_x directory in your local project.
   > - When your private modifications conflict with the remote, you need to merge and resolve the conflicts manually.

### Step 2: Project configuration
1. Permission configuration: In the module section of your project's entry module.json5, declare the following required permissions:

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
2. Module declaration: After an existing project has integrated the source code, you need to declare the modules in the build-profile.json5 file:

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
         "name": "tuiroomkit",
         "srcPath": "../room",  // Adjust according to the actual directory
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
         "name": "atomic_x",
         "srcPath": "../atomic_x",  // Adjust according to the actual directory
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
3. Declare backgroundModes. Under the UIAbility hosting the meeting UI (usually EntryAbility), add backgroundModes to the abilities node of module.json5:

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

After the code integration is complete, you need to complete the login operation, which is **a key step in using TUIRoomKit**. Only after a successful login can you use the various features of TUIRoomKit normally, so please carefully check whether the relevant parameters are configured correctly:

> **Note:**
> In the sample code, the login interface is called directly. However, in an actual project, it is strongly recommended that **you call TUIRoomKit's login service after completing your own user identity verification and related login operations**. This avoids issues such as chaotic business logic or data inconsistency caused by calling the login service too early, and it also better fits the existing user management and permission control system in your project.
>

【ArkTS】
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

**Login interface parameter description:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>number</code> | Obtained from the <a href="https://console.cloud.tencent.com/trtc">console</a>, usually a 10-digit integer starting with <code>140</code> or <code>160</code>. |
| <code>userID</code> | <code>string</code> | The unique ID of the current user, containing only English letters, digits, hyphens, and underscores. To avoid multi-end login conflicts, <strong>do not use</strong> simple IDs such as <code>1</code> or <code>123</code>. |
| <code>userSig</code> | <code>string</code> | The ticket used for Tencent Cloud authentication. For more information, see How to compute and use UserSig.<br>[Notes]<br>- Development environment: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate userSig, or generate a temporary userSig through the <a href="https://console.cloud.tencent.com/im/tool-usersig">UserSig helper tool</a>.<br>- Production environment: To prevent key leakage, be sure to generate userSig on the server side. For details, see Generating UserSig on the server. |

### Step 4: Set the avatar and nickname

A user logging in for the first time has no avatar or nickname information, and needs to set personal information through the `setSelfInfo` interface of `LoginStore`:
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

**setSelfInfo interface parameter / return value description:**
| Parameter / return value | Type | Description |
| --- | --- | --- |
| <code>userProfile</code> | <code>UserProfile</code> | The core model of personal user information, including:<br>- userID: The user ID whose information is to be set.<br>- nickname: The nickname information.<br>- avatarURL: The avatar link. |

### Step 5: Create a room

In the `TUIRoomKit` component, `RoomMainPage` is the core UI that integrates the complete multi-person audio/video room functionality. The following demonstrates for developers how to embed `RoomMainPage` into an application as the room owner.

#### **Implementation approach:**
1. **Construct the room-entry configuration**: The configuration for whether to automatically turn on audio/video devices after entering the room.

2. **Configure the room creation options**: Configure information such as the room name.

3. **Initialize the room main page**: Initialize the room main page with the room owner identity.

4. **Navigate to the room page**: Push `RoomMainPage` onto the navigation stack.

   > **Note:**
   >
   > Harmony currently only supports creating standard rooms. If you need to create a large webinar room, refer to Web Quick Integration and use the Web end to create it.
   >

#### **Sample code:**
``` typescript
import {
  RoomMainPage,
  RoomBehavior,
  ConnectConfig,
  EnterRoomParams,
} from '@tencentcloud/tuiroomkit';
import { CreateRoomOptions } from '@tencentcloud/atomicxcore';

@Entry
@Component
struct YourMainPage {
  private navStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.navStack) {
      Column() {
        Button('Create room')
          .onClick(() => this.createRoom())
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
    }
    .navDestination(this.routerMap)
    .hideTitleBar(true)
  }

  private createRoom(): void {
    // 1. Construct the room-entry configuration
    const config = new ConnectConfig(
      true,   // autoEnableMicrophone: whether to automatically turn on the microphone after entering the room
      true,   // autoEnableCamera:     whether to automatically turn on the camera after entering the room
      true,   // autoEnableSpeaker:    whether to automatically turn on the speaker after entering the room
    );

    // 2. Configure the room creation options
    const options = new CreateRoomOptions();
    options.roomName = 'roomName';  // Room name

    // 3. Configure the room-entry behavior (create room)
    const behavior = RoomBehavior.create(options);

    // 4. Navigate to the room page
    const params = new EnterRoomParams('123456', behavior, config);
    this.navStack.pushPath({ name: 'RoomMain', param: params });
  }

  @Builder
  routerMap(name: string, param: Object) {
    if (name === 'RoomMain') {
      RoomMainDestination({ navStack: this.navStack, params: param as EnterRoomParams })
    }
  }
}

@Component
struct RoomMainDestination {
  navStack: NavPathStack = new NavPathStack();
  params?: EnterRoomParams;

  build() {
    NavDestination() {
      RoomMainPage({
        roomID: this.params?.roomID ?? '',
        behavior: this.params?.behavior ?? RoomBehavior.join(),
        config: this.params?.config ?? new ConnectConfig(),
        onExit: () => {
          this.navStack.pop();
        },
      })
    }
    .hideTitleBar(true)
    .width('100%')
    .height('100%')
    .onBackPressed(() => true)
  }
}
```

**Detailed description of RoomMainPage constructor parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>roomID</code> | <code>string</code> | - A string-type unique identifier of the room.<br>- The length is limited to 0-48 bytes.<br>- It is recommended to contain only digits, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid using spaces and Chinese characters. |
| <code>behavior</code> | <code>RoomBehavior</code> | - The initialization source of the room main page.<br>- Parameter meanings:<br>- create: Create a room with the room owner identity; this method requires constructing the CreateRoomOptions room creation configuration.<br>- join: Join a room as a participant. |
| <code>config</code> | <code>ConnectConfig</code> | The configuration for audio/video device control after entering the room. |

**Detailed description of ConnectConfig parameters:**
| Parameter | Type | Description |
| --- | --- | --- |
| autoEnableMicrophone | <code>boolean</code> | - Whether to automatically turn on the microphone after entering the room.<br>- Parameter meanings:<br>- true: Turn on automatically (default value).<br>- false: Do not turn on automatically. |
| autoEnableCamera | <code>boolean</code> | - Whether to automatically turn on the camera after entering the room.<br>- Parameter meanings:<br>- true: Turn on automatically (default value).<br>- false: Do not turn on automatically. |
| autoEnableSpeaker | <code>boolean</code> | - Whether to automatically turn on the speaker after entering the room.<br>- Parameter meanings:<br>- true: Turn on automatically (default value).<br>- false: Do not turn on automatically. |

### Step 6: Join a room

The following demonstrates for developers how to embed `RoomMainPage` into an application as a participant.

#### **Implementation approach:**
1. **Construct the room-entry configuration**: The configuration for whether to automatically turn on audio/video devices after entering the room.

2. **Initialize the room main page**: Initialize the room main page with the participant identity.

3. **Navigate to the room page**: Push `RoomMainPage` onto the navigation stack.

#### Sample code:
``` typescript
import {
  RoomMainPage,
  RoomBehavior,
  ConnectConfig,
  EnterRoomParams,
} from '@tencentcloud/tuiroomkit';

@Entry
@Component
struct YourMainPage {
  private navStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.navStack) {
      Column() {
        Button('Join room')
          .onClick(() => this.enterRoom())
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
    }
    .navDestination(this.routerMap)
    .hideTitleBar(true)
  }

  private enterRoom(): void {
    // 1. Construct the room-entry configuration
    const config = new ConnectConfig(
      true,   // autoEnableMicrophone: whether to automatically turn on the microphone after entering the room
      true,   // autoEnableCamera:     whether to automatically turn on the camera after entering the room
      true,   // autoEnableSpeaker:    whether to automatically turn on the speaker after entering the room
    );

    // 2. Configure the room-entry behavior (join room)
    const behavior = RoomBehavior.join();

    // 3. Navigate to the room page
    const params = new EnterRoomParams('roomID', behavior, config);
    this.navStack.pushPath({ name: 'RoomMain', param: params });
  }

  @Builder
  routerMap(name: string, param: Object) {
    if (name === 'RoomMain') {
      RoomMainDestination({ navStack: this.navStack, params: param as EnterRoomParams })
    }
  }
}

@Component
struct RoomMainDestination {
  navStack: NavPathStack = new NavPathStack();
  params?: EnterRoomParams;

  build() {
    NavDestination() {
      RoomMainPage({
        roomID: this.params?.roomID ?? '',
        behavior: this.params?.behavior ?? RoomBehavior.join(),
        config: this.params?.config ?? new ConnectConfig(),
        onExit: () => {
          this.navStack.pop();
        },
      })
    }
    .hideTitleBar(true)
    .width('100%')
    .height('100%')
    .onBackPressed(() => true)
  }
}
```

**For detailed parameter descriptions, refer to:** [Detailed description of RoomMainPage constructor parameters]( Detailed description of constructor parameters) and [Detailed description of ConnectConfig parameters]( Detailed description of parameters).

> **Note:**
> When using the TUIRoomKit component to enter a large webinar room, make sure the room ID of the webinar room created on the Web end starts with `webinar_`.
>

## Core features

After integrating the `RoomMainPage` code, developers get a complete multi-person audio/video page that internally includes member management, audio/video device control, room information display, and more. This is the core of the `TUIRoomKit` component.

## UI customization

The `RoomMainPage` room main page is feature-rich and highly customizable. Developers can customize the UI according to actual product needs to fit their business interaction scenarios. The following shows developers the view components in `RoomMainPage` in detail, making it easy for developers to modify quickly.

**Detailed description of the components in `RoomMainPage`**

|Component|Feature description|Customization suggestions|
|---------|---------|---------|
|[RoomMainPage](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/room/src/main/ets/pages/RoomMainPage.ets)|The room main view container, responsible for coordinating the layout and data flow of the sub-components.|You can adjust the overall background, safe area adaptation, and component show/hide logic.|
|[RoomTopBarView](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/room/src/main/ets/pages/main/RoomTopBarView.ets)|The top navigation bar, containing room information, camera and audio controls, and the exit-room feature entry.|You can replace icons, adjust background transparency, and add custom buttons (e.g. recording, windowing).|
|[RoomView](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/room/src/main/ets/pages/main/RoomView.ets)|The video stream display area, using a waterfall layout to manage multiple users' video views.|You can modify the layout algorithm (rows/columns, spacing), pagination indicator style, and empty-state view.|
|[ParticipantVideoItemView](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/room/src/main/ets/pages/main/room_view/ParticipantVideoItemView.ets)|A single video stream cell, carrying the user's video view and basic information.|You can customize the video rendering layer, user info panel (avatar, badge), and interactive controls (voice waveform).|
|[RoomBottomBarView](https://github.com/Tencent-RTC/TUIKit_Harmony/blob/main/room/src/main/ets/pages/main/RoomBottomBarView.ets)|The bottom toolbar, integrating the microphone, camera, and member management operation buttons.|You can rearrange the button order, modify button styles (color, size), and add business-related features (e.g. screen sharing, in-meeting calling, beauty).|

## Icon customization

After integrating the TUIRoomKit component, developers can directly replace the icon resources under the component according to actual UI interaction needs to fit their business scenarios.

TUIRoomKit uses the `src/main/resources/base/media` directory to manage the image resources required by the UI. You can directly replace the image files in this directory to customize the icons required by the UI.

**List of commonly used image files**

|Icon|File name|Description|
|---------|---------|---------|
||room_camera_off.png|Camera off icon|
||room_camera_on.png|Camera on icon|
||room_mic_off.png|Microphone off icon|
||room_mic_on_empty.png|Microphone on icon|
||room_administrator_icon.png|Administrator identity icon|
||room_owner_icon.png|Room owner identity icon|

## Text customization

TUIRoomKit uses standard HarmonyOS resource files to manage the text displayed by the UI. You can directly modify JSON resource files such as `string.json` in the corresponding language folder under the atomic_x/src/main/resources/ directory to adjust the text you need.

## FAQs

### Do I need to call login every time I enter a room?

No. Usually you only need to complete a single `LoginStore.shared.login` call. We recommend that you associate `LoginStore.shared.login` and

`LoginStore.shared.logout` with your own login business.

### Is there an example configuration for the oh-package.json5 file that I can reference?

You can refer to the `oh-package.json5` example file in the GitHub TUIKit_Harmony [application](https://github.com/Tencent-RTC/TUIKit_Harmony/tree/main/application) project.

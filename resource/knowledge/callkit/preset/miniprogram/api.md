TUICallKit is the **UI-included interface** for the audio/video calling component. Using the TUICallKit API, you can quickly implement a WeChat-like audio/video calling scenario with simple API calls. For detailed integration steps, see [Quick Integration of TUICallKit](https://cloud.tencent.com/document/product/647/78733).

> **Note:**
> - To provide better audio/video communication capabilities, the original @trtc/call-uikit-wechat package has been officially deprecated. Developers are advised to migrate to the new @trtc/calls-uikit-wx-uniapp and @trtc/calls-uikit-wx packages.
> - The new packages include optimized API adjustments. Some legacy interfaces are no longer compatible, and cleaner, more stable new interfaces are provided.

## API Overview

| API | Description |
|---------|---------|
| [\<TUICallKit /\>](#TUICallKit) | TUICallKit call UI component. |
| [init](#init) | Initialize TUICallKit |
| [calls](#calls) | Initiate a single or multi-party call. |
| [join](#join) | Actively join a call. |
| [setSelfInfo](#setSelfInfo) | Set user avatar and nickname. |
| [setCallingBell](#setCallingBell) | Set custom incoming call ringtone. |
| [setLogLevel](#setLogLevel) | Set log level. |
| [enableMuteMode](#enableMuteMode) | Enable/disable incoming call ringtone. |
| [enableFloatWindow](#enableFloatWindow) | Enable/disable floating window. |
| [hideFeatureButton](#hideFeatureButton) | Hide a feature button. |
| [setLocalViewBackgroundImage](#setLocalViewBackgroundImage) | Set local user call background image. |
| [setRemoteViewBackgroundImage](#setRemoteViewBackgroundImage) | Set remote user call background image. |
| [setLayoutMode](#setLayoutMode) | Set call interface layout mode. |
| [setCameraDefaultState](#setCameraDefaultState) | Set whether camera is on by default. |
| [destroyed](#destroyed) | Destroy TUICallKit. |
| [getTUICallEngineInstance](#getTUICallEngineInstance) | Get TUICallEngine instance. |

## API Details

[uni-app Mini Program]
``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-wx-uniapp";
```

[WeChat Mini Program]
``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-wx";
```

### init

Initialize TUICallKit.
``` javascript
TUICallKitAPI.init({
     sdkAppID: 0, // Replace with your SDKAppID
     userID: 'jane', // Enter the current userID
     userSig: 'xxxxxxxxxxxx',
     tim: null, // If you don't need a TIM instance, you can omit this
})
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| sdkAppID | Number | You can find the SDKAppID in **TRTC Console** > [Application Management](https://console.cloud.tencent.com/trtc/app) > **Application Info**. | Yes |
| userID | String | Current user ID. String type, only allows letters (a-z, A-Z), digits (0-9), hyphens (-), and underscores (_). | Yes |
| userSig | String | Tencent Cloud security signature. See [How to Calculate and Use UserSig](https://cloud.tencent.com/document/product/647/17275) for details. | Yes |
| tim | ChatSDK | TIM instance. | No |

Additional details on init parameters:
- **userSig**: Encrypt information like sdkAppID and userID using the SecretKey obtained in Step 3 to generate userSig. It is an authentication ticket for Tencent Cloud to verify whether the current user is authorized to use TRTC services. See [How to Calculate and Use UserSig](https://cloud.tencent.com/document/product/647/17275) for more.

- **tim**: You can pass an external TIM instance to CallKit via init. The tim parameter is for scenarios where a TIM instance already exists in your business, ensuring TIM instance uniqueness.

### calls

Initiate a 1v1 or multi-party call.
``` javascript
TUICallKitAPI.calls({
    userIDList: ["jane", "mike", "tommy"],
    type: 1,
})
```

**Parameters:**
| Parameter | Type | Description | Required |
| --- | --- | --- | --- |
| userIDList | Array\<String\> | Target user ID list, e.g., ["jane", "mike", "tommy"]. | Yes |
| type | CallMediaType | Call media type. See CallMediaType for parameter values. | Yes |
| chatGroupID | String | IM group ID when used with Chat. | Yes |
| roomID | Number | Numeric room ID, range [1, 2147483647]. | No |
| userData | String | Extension field: used to add extra information in the invitation signaling. | No |
| timeout | Number | Call timeout in seconds. 0 means no timeout. Range: 10s – 600s. If 0 is passed, defaults to 30s.<br>The callee must be logged in within 30s for the timeout value to take effect. See "timeout field not taking effect" for details. | No |
| [offlinePushInfo](#offlinePushInfo) | Object | Custom offline push information (optional). | No |

### join

Actively join a call.
``` javascript
TUICallKitAPI.join({callId: xx});
```

**Parameters:**

| Parameter | Type | Description | Required |
|---------|---------|---------|---------|
| callId | String | Unique ID of this call. | Yes |

### setSelfInfo

Set user avatar and nickname.

> **Note:**
> **Modifying user info during a call will not immediately update the UI. Changes will take effect in the next call.**
>

``` javascript
TUICallKitAPI.setSelfInfo({ nickName: "xxx", avatar: "http://xxx" });
```

**Parameters:**

| Parameter | Type | Description |
|---------|---------|---------|
| nickName | String | Set nickname. |
| avatar | String | Avatar URL. |

### setCallingBell

Set custom incoming call ringtone.

Only local file paths are accepted. Ensure the file directory is accessible by the application.
- Pass a local absolute path for the ringtone file.

- To restore the default ringtone, pass an empty `filePath`.

- Supported ringtone file formats:

   | Format | iOS | Android |
   |---------|---------|---------|
   | m4a | √ | √ |
   | mp3 | √ | √ |
   | wav | √ | √ |
   | aac | √ | √ |

   ``` javascript
   TUICallKitAPI.setCallingBell("filePath")
   ```

   **Parameters:**

   | Parameter | Type | Description |
   |---------|---------|---------|
   | filePath | String | Ringtone file path. |

### setLogLevel

Set the log level. Logs below the specified level will not be output.
``` javascript
TUICallKitAPI.setLogLevel(level)
```

**Parameters:**
| Parameter | Value | Description |
| --- | --- | --- |
| level | 0 | Normal level, verbose logs. Recommended during integration. |
|  | 1 | Release level, SDK outputs key information only. Recommended for production. |
|  | 2 | Warning level, SDK outputs only warnings and errors. |
|  | 3 | Error level, SDK outputs only errors. |
|  | 4 | No logs, SDK will not print any logs. |

### enableMuteMode

Enable/disable incoming call ringtone.
- Default is `false`: a ringtone plays when receiving a call request.

- If set to `true`: no ringtone plays when receiving a call request.

   ``` javascript
   try {
     await TUICallKitAPI.enableMuteMode(enable: boolean)
   } catch (error: any) {
     console.error(`[TUICallKit] Failed to call the enableMuteMode API. Reason: ${error}`);
   }
   ```

### enableFloatWindow

Enable/disable the floating window feature. Default is `false` (the floating window button in the top-left corner of the call interface is hidden). When set to `true`, the button is displayed.
``` javascript
try {
  await TUICallKitAPI.enableFloatWindow(enable: boolean)
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the enableFloatWindow API. Reason: ${error}`);
}
```

### hideFeatureButton

Hide a feature button. Currently supports hiding the camera, microphone, and front/rear camera switch buttons.
``` typescript
TUICallKitAPI.hideFeatureButton(buttonName: FeatureButton);
```

**Parameters:**

| Parameter | Type | Required | Description |
|---------|---------|---------|---------|
| buttonName | [FeatureButton](#FeatureButton) | Yes | Button name. |

### setLocalViewBackgroundImage

Set the local user's call background image.
``` typescript
TUICallKitAPI.setLocalViewBackgroundImage(url: string);
```

**Parameters:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| url | String | Yes | Image URL (supports local paths and network URLs).<br>**Note:**<br>If using a network URL, it must be added to the request valid domains. |

### setRemoteViewBackgroundImage

Set the remote user's call background image.
``` typescript
TUICallKitAPI.setRemoteViewBackgroundImage(userId: string, url: string);
```

**Parameters:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| userId | String | Yes | Remote user's userId. Set to '*' to apply to all remote users. |
| url | String | Yes | Image URL (supports local paths and network URLs).<br>**Note:**<br>If using a network URL, it must be added to the request valid domains. |

### setLayoutMode

Set the call interface layout mode.
``` javascript
import { TUICallKitAPI, LayoutMode } from "../../TUICallKit/src/index";
TUICallKitAPI.setLayoutMode(LayoutMode.LocalInLargeView);
```

**Parameters:**

| Parameter | Type | Required | Description |
|---------|---------|---------|---------|
| layoutMode | [LayoutMode](#LayoutMode) | Yes | User stream layout mode. |

### setCameraDefaultState

Set whether the camera is on by default.
``` javascript
TUICallKitAPI.setCameraDefaultState(true);
```

**Parameters:**

| Parameter | Type | Required | Description |
|---------|---------|---------|---------|
| isOpen | boolean | Yes | Whether to enable the camera. |

### destroyed

Destroy TUICallKit.
``` javascript
TUICallKitAPI.destroyed()
```

### getTUICallEngineInstance

Get the TUICallEngine instance.
``` javascript
TUICallKitAPI.getTUICallEngineInstance();
```

## TUICallKit Type Definitions

### offlinePushInfo

| Parameter | Type | Required | Description |
|---------|---------|---------|---------|
| offlinePushInfo.title | String | No | Offline push title (optional). |
| offlinePushInfo.description | String | No | Offline push content (optional). |
| offlinePushInfo.androidOPPOChannelID | String | No | OPPO channel ID for Android 8.0+ offline push (optional). |
| offlinePushInfo.extension | String | No | Offline push pass-through content (optional) (tsignaling version ≥ 0.9.0). |

### FeatureButton

| FeatureButton Type | Description |
|---------|---------|
| FeatureButton.Camera | Camera button. |
| FeatureButton.Microphone | Microphone button. |
| FeatureButton.SwitchCamera | Switch front/rear camera button. |
| FeatureButton.InviteUser | Invite user button. |

### LayoutMode

| LayoutMode Type | Description |
|---------|---------|
| LayoutMode.LocalInLargeView | Local user displayed in the large view. |
| LayoutMode.RemoteInLargeView | Remote user displayed in the large view. |

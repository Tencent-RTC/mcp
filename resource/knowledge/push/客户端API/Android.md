---
sync_node_id: '159322938124820480'
nav_path:
  - "推送服务（Push）"
  - "客户端 API"
  - "Android"
product: "push"
---
This document describes the client APIs of the TIMPush Android SDK, including `TIMPushManager`, `TIMPushListener`, `TIMPushCallback`, `TIMPushMessage`, and error codes.

## API overview

### TIMPushManager

`TIMPushManager` is the push service manager class of the TIMPush Android SDK. Use it to register the push service, manage `RegistrationID`, configure the push channel and foreground notification display, and add push listeners.

|API|Description|
|---------|---------|
|getInstance|Gets the `TIMPushManager` singleton instance.|
|registerPush|Registers the push service.|
|unRegisterPush|Unregisters and disables the offline push service.|
|getRegistrationID|Gets the unique push ID.|
|setRegistrationID|Sets a custom unique push ID.|
|addPushListener|Adds a push listener.|
|removePushListener|Removes a push listener.|
|forceUseFCMPushChannel|Forces the device to use the FCM channel for offline push.|
|disablePostNotificationInForeground|Disables notification bar pop-ups when the app is in the foreground.|

### TIMPushListener

`TIMPushListener` is an abstract push listener class. Override the following methods as needed to receive push messages, push recall events, and notification click events.

|API|Description|
|---------|---------|
|onRecvPushMessage|Called when a push message is received.|
|onRevokePushMessage|Called when a push message recall notification is received.|
|onNotificationClicked|Callback when a notification bar message is clicked.|

## Callback types

### TIMPushCallback

Abstract class for TIMPush general result callbacks. `onSuccess` is triggered on success, and `onError` is triggered on failure.

#### Declaration
``` java
public abstract class TIMPushCallback<T> {
    public void onSuccess(T data) {}

    public void onError(int errCode, String errMsg, T data) {}
}
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`data`|`T`|Data returned in the success or failure callback.|
|`errCode`|`int`|Error code in the failure callback.|
|`errMsg`|`String`|Error description in the failure callback.|

## TIMPushManager

### getInstance

Gets the `TIMPushManager` singleton instance.

#### Declaration
``` java
public static TIMPushManager getInstance();
```

#### Return value

`TIMPushManager` singleton. Call subsequent APIs through this instance.

### registerPush

Registers the push service.

#### Declaration
``` java
public abstract void registerPush(Context context, int sdkAppId, String appKey, TIMPushCallback callback);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`context`|`Context`|Android context object.|
|`sdkAppId`|`int`|SDKAppID of the Push app.|
|`appKey`|`String`|Client key of the Push app.|
|`callback`|`TIMPushCallback`|Registration result callback.|

#### Description
1. If you use the push service alone, pass valid `sdkAppId` and `appKey` values to register the push service.

2. If you have already integrated Chat, call this API after a successful Chat login and set `appKey` to `null` to enable offline push.

### unRegisterPush

Unregisters and disables the offline push service.

#### Declaration
``` java
public abstract void unRegisterPush(TIMPushCallback callback);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`callback`|`TIMPushCallback`|Unregistration result callback.|

### getRegistrationID

Gets the unique push ID.

#### Declaration
``` java
public abstract void getRegistrationID(TIMPushCallback callback);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`callback`|`TIMPushCallback`|Result callback for the get operation.|

#### Description

After the offline push service is registered successfully, use this API to get the unique push ID (`RegistrationID`). You can then push messages to a specific device by `RegistrationID`.

`RegistrationID` is the unique push ID of a device. It is generated automatically after a successful push registration by default, and can also be customized. You can push messages to a specific device by `RegistrationID`. Uninstalling and reinstalling the app changes this ID.

### setRegistrationID

Sets a custom unique push ID.

#### Declaration
``` java
public abstract void setRegistrationID(String registrationID, TIMPushCallback callback);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`registrationID`|`String`|Custom unique push ID.|
|`callback`|`TIMPushCallback`|Result callback for the set operation.|

#### Description

Sets a custom unique push ID (`RegistrationID`) for the device. Call this API before registering the push service.

`RegistrationID` is the unique push ID of a device. It is generated automatically after a successful push registration by default, and can also be customized. You can push messages to a specific device by `RegistrationID`. Uninstalling and reinstalling the app changes this ID.

### addPushListener

Adds a push listener.

#### Declaration
``` java
public abstract void addPushListener(TIMPushListener listener);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`listener`|`TIMPushListener`|Push listener object.|

### removePushListener

Removes a push listener.

#### Declaration
``` java
public abstract void removePushListener(TIMPushListener listener);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`listener`|`TIMPushListener`|Push listener object to remove.|

### forceUseFCMPushChannel

Forces the device to use the FCM channel for offline push.

#### Declaration
``` java
public abstract void forceUseFCMPushChannel(boolean enable);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`enable`|`boolean`|`true`: use the FCM channel; `false`: use the local (OEM) channel.|

#### Description

Call this API before registering the push service. Commonly used for overseas push over FCM, for example Xiaomi devices outside China using FCM.

### disablePostNotificationInForeground

Disables notification bar pop-ups when the app is in the foreground.

#### Declaration
``` java
public abstract void disablePostNotificationInForeground(boolean disable);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`disable`|`boolean`|`true`: disable; `false`: enable.|

#### Description

When the push SDK receives an online push, it automatically posts a notification to the notification bar. If you want to handle online push messages yourself, call this API to disable automatic notification pop-ups.

## TIMPushListener

`TIMPushListener` is an abstract push listener class. The base class provides empty implementations; override the following methods as needed.

The three callbacks are triggered as follows:

|Callback|Trigger timing|
|---------|---------|
|`onRecvPushMessage`|Triggered when the app is online and receives a Chat message that includes `offlinePushInfo`.|
|`onRevokePushMessage`|Triggered when the app is online and receives a message recall notification.|
|`onNotificationClicked`|Triggered when the user taps a notification bar message. This includes cases where the app is offline, the message is delivered via a manufacturer channel (Xiaomi / Huawei / OPPO / vivo / Honor / Meizu / FCM), and tapping the notification launches the app.|

### onRecvPushMessage

Triggered when the app is online and receives a Chat message that includes `offlinePushInfo`. This callback is not triggered if the app process has already exited.

#### Declaration
``` java
public void onRecvPushMessage(TIMPushMessage message);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`message`|`TIMPushMessage`|Push message object.|

### onRevokePushMessage

Triggered when the app is online and receives a message recall notification. This callback is not triggered if the app process has already exited.

#### Declaration
``` java
public void onRevokePushMessage(String messageID);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`messageID`|`String`|Unique message ID.|

### onNotificationClicked

Triggered when the user taps a notification bar message, whether the app is in the foreground, background, or has exited (and is launched by tapping the notification).

#### Declaration
``` java
public void onNotificationClicked(String ext);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`ext`|`String`|Offline message passthrough field.|

#### Description

In the console, set **Click action** for the push certificate to **Open a specified in-app page** and keep the default filled value; otherwise this callback is not triggered.

## TIMPushMessage

`TIMPushMessage` represents a push message object and implements the `Serializable` interface.

### Constructor

#### Declaration
``` java
public TIMPushMessage();
```

### Properties

|Property|Type|Description|
|---------|---------|---------|
|`title`|`String`|Offline push title.|
|`desc`|`String`|Offline push content.|
|`ext`|`String`|Offline push passthrough content.|
|`messageID`|`String`|Unique message ID.|

### Methods

|Method|Return type|Description|
|---------|---------|---------|
|`setTitle(String title)`|`void`|Sets the offline push title.|
|`getTitle()`|`String`|Gets the offline push title.|
|`setDesc(String description)`|`void`|Sets the offline push content.|
|`getDesc()`|`String`|Gets the offline push content.|
|`setExt(String ext)`|`void`|Sets the offline push passthrough content.|
|`getExt()`|`String`|Gets the offline push passthrough content.|
|`setMessageID(String messageID)`|`void`|Sets the unique message ID.|
|`getMessageID()`|`String`|Gets the unique message ID.|
|`toString()`|`String`|Returns the string representation of the message object.|

## Error codes

`TIMPushConstants` defines the business error codes of the TIMPush SDK.

|Error code|Value|Description|
|---------|---------|---------|
|`ERR_INVALID_PARAM`|`800000`|Invalid parameter.|
|`ERR_NOT_LOGINED`|`800001`|Chat account not logged in before registering push.|
|`ERR_INVALID_SDK_APPID`|`800002`|Invalid `sdkAppID` parameter for push registration.|
|`ERR_REGISTER_PUSH_INIT_FAILED`|`800003`|Failed to initialize the SDK.|
|`ERR_REGISTER_PUSH_CONNECT_FAILED`|`800004`|Failed to establish the long connection.|
|`ERR_REGISTER_PUSH_FAILED_BUILT_IN_DEVICE`|`800005`|Failed to register push on the local (OEM) channel.|
|`ERR_REGISTER_PUSH_FAILED_TRY_FCM`|`800006`|After local (OEM) channel registration failed, FCM channel registration also failed.|
|`ERR_REGISTER_PUSH_FAILED_DETECT_CHANNELS`|`800007`|Failed to detect all channels.|
|`ERR_REGISTER_PUSH_FAILED_TIMEOUT`|`800008`|Push service registration timed out.|
|`ERR_REGISTER_TOKEN_EMPTY`|`800009`|Push registration token is empty.|
|`ERR_SET_PUSH_TOKEN_FAILED`|`800010`|Failed to set the token on the SDK.|
|`ERR_DISABLE_AUTO_REGISTER_PUSH_FAILED`|`800011`|Failed to disable auto registration.|
|`ERR_DISABLE_REQUEST_POST_NOTIFICATION_PERMISSION_FAILED`|`800012`|Failed to disable the push permission request.|
|`ERR_CREATE_NOTIFICATION_CHANNEL_FAILED`|`800013`|Failed to create the notification channel.|
|`ERR_SET_PUSH_CONFIG_FAILED`|`800014`|Failed to set the push configuration.|
|`ERR_CALL_EXPERIMENTAL_API_FAILED`|`800015`|Experimental API call failed.|
|`ERR_SET_APP_LANGUAGE_FAILED`|`800016`|Failed to configure the device language.|
|`ERR_HTTPS_REQUEST_FAILED`|`800017`|HTTPS request failed.|

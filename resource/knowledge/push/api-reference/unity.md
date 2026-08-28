PushManager

public class PushManager: Push Plugin Interface Class

### API Overview

#### Register/Unregister Push Service API

|API|Description|
|---------|---------|
|RegisterPush|Register push service (The API must be called to use push service after obtaining user consent for the privacy policy).|
|UnRegisterPush|Disable push service.|
|SetRegistrationID|RegistrationID is the unique identifier of a push reception device. By default, it is automatically generated when push service registration succeeds. You can also customize settings. Based on the RegistrationID, you can push messages to specified devices. Notably, uninstalling and reinstalling the device will change the RegistrationID, so you need to call the setRegistrationID API before registering the push service.|
|GetRegistrationID|After successful push service registration, you can obtain the unique identifier ID of the push reception device, namely RegistrationID, by calling the getRegistrationID API. Based on the RegistrationID, you can push messages to specified devices.|

#### Push Global Listening Interface

|API|Description|
|---------|---------|
|AddPushListener|Add a Push Listener.|
|RemovePushListener|Remove a Push Listener.|

#### Custom Configuration API

|API|Description|
|---------|---------|
|ForceUseFCMPushChannel|Assign device offline push to use FCM channel, need to register push service before calling.|
|DisablePostNotificationInForeground|Disable pop-up notifications when the App is in the foreground.|

### API Detail

#### Member Function Description

##### abstract void RegisterPush(Context context, int sdkAppId, String appKey, PushCallback callback)

Register push service. Just transmit both sdkAppId and appKey to complete push service registration.

Parameter description:
| Parameter | Description | Access Path |
| --- | --- | --- |
| sdkAppId | The app ID assigned to you in the IM console. |  |
| appKey | The client key assigned to you in the IM console. |  |

##### abstract void UnRegisterPush(PushCallback callback)

Unregister and disable push service.

##### abstract void SetRegistrationID(String registrationID, PushCallback callback)

Set the push ID (RegistrationID) used for push service registration, which needs to be called before registering the push service.

Parameter description:

|Parameter|Description|
|---------|---------|
|registrationID|The push unique identifier ID of the device will change after uninstall reinstall.|

##### abstract void GetRegistrationID(PushCallback callback)

After successful registration of push service, obtain the push ID (RegistrationID).

##### abstract void AddPushListener(PushListener listener)

Add a Push Listener.

##### abstract void RemovePushListener(PushListener listener)

Remove a Push Listener

##### abstract void ForceUseFCMPushChannel(boolean enable)

Assign device offline push to use FCM channel, need to register push service before calling.

Parameter description:
| Parameter | Description |
| --- | --- |
| enable | - true: Use FCM channel.<br>- false: Use local machine channel. |

##### abstract void DisablePostNotificationInForeground(boolean disable)

Disable the pop-up Notification bar when the App is in the foreground. When the Push SDK receives an online push, it automatically adds a Notification to the Notification bar. If you want to handle the online push message yourself, you can call this API to disable the automatic pop-up Notification bar feature.

Parameter description:
| Parameter | Description |
| --- | --- |
| disable | - true: It is disabled.<br>- false: enable |

## PushListener

public class PushListener: Push Listener Class

### API Overview

|API|Description|
|---------|---------|
|onRecvPushMessage|Received a Push message.|
|onRevokePushMessage|Received a Push message recall notification.|
|onNotificationClicked|Click the notification bar message Webhook.|

### API Detail

#### Member Function Description

##### void onRecvPushMessage(TIMPushMessage message)

Received a Push message. Received a message.

##### void onRevokePushMessage(string messageID)

Received a Push message recall notification, messageID unique message identifier.

##### void onNotificationClicked(String ext)

Click the notification bar message Webhook.

> **Note:**
> Configure the console Push Certificate to "open specified in-app page" and use the default populated value to take effect.
>

## TIMPush - PushManager

PushManager: Push Plugin Interface class

### API Overview

#### Register/Unregister Push Service API

|API|Description|
|---------|---------|
|RegisterPush|Register push service (this API must be called to use push service only after the App user consents to the privacy policy).|
|UnRegisterPush|Disable push service.|
|SetRegistrationID|RegistrationID is the unique identifier of the push reception device. By default, it is automatically generated when push service registration succeeds, and you can also customize settings. Based on RegistrationID, you can push messages to the specified device. Notably, Uninstall and reinstall the device will change RegistrationID, so you need to call the setRegistrationID API before registering push service.|
|GetRegistrationID|After successfully registering push service, you can obtain the unique identifier ID of the push reception device, namely RegistrationID, by calling the getRegistrationID API. Based on RegistrationID, you can push messages to the specified device.|

#### Global Listening Interface for Push

|API|Description|
|---------|---------|
|AddPushListener|Add a Push Listener.|
|RemovePushListener|Remove a Push Listener.|

#### Custom Configuration API

|API|Description|
|---------|---------|
|ForceUseFCMPushChannel|Specify device offline push to use FCM channel, need to register push service before calling.|
|DisablePostNotificationInForeground|Disable pop-up notifications when the App is in the foreground.|

### API Detail

#### Static Public Member Function

static PushManager* GetInstance(): Get the PushManager manager instance.

#### Member Function Description

##### virtual void RegisterPush(int sdkAppId, const FString& appKey, PushValueCallback<FString>* callback) = 0;

To register the push service, transmit both parameters sdkAppId and appKey, and just register the push service.

Parameter description:
| Parameter | Description | Access Path |
| --- | --- | --- |
| sdkAppId | The IM console assigned the app ID to you. |  |
| appKey | The IM console assigned the client key to you. |  |

##### virtual void UnRegisterPush(PushCallback* callback) = 0;

Unregister and disable push service.

##### virtual void SetRegistrationID(const FString& registrationID, PushCallback* callback) = 0;

Set the push ID flag used for push service registration, i.e., RegistrationID, which needs to be called before registering the push service.

Parameter description:

|Parameter|Description|
|---------|---------|
|registrationID|The push unique identifier ID of the device may change after uninstall reinstall.|

##### virtual void GetRegistrationID(PushValueCallback<FString>* callback) = 0;

After successful registration of push service, obtain the push ID flag, i.e., RegistrationID.

##### virtual void AddPushListener(PushListener* listener) = 0;

Add a Push Listener

##### virtual void RemovePushListener(PushListener* listener) = 0;

Remove a Push Listener

##### virtual void ForceUseFCMPushChannel(bool enable) = 0;

Specify device offline push to use FCM channel, need to register push service before calling.

Parameter description:
| Parameter | Description |
| --- | --- |
| enable | - true: Use the FCM channel.<br>- false: Use the local machine channel. |

##### virtual void DisablePostNotificationInForeground(bool disable) = 0;

Disable pop-up notifications in the Notification bar when the App is in the foreground. When the Push SDK receives an online push, it automatically adds a Notification prompt to the Notification bar. If you want to handle online push messages yourself, you can call this API to disable the automatic pop-up Notification bar feature.

Parameter description:
| Parameter | Description |
| --- | --- |
| disable | - true: It is disabled.<br>- false: It is enabled. |

## PushListener

PushListener: Push Listener class

### API Overview

|API|Description|
|---------|---------|
|OnRecvPushMessage|Push message received.|
|OnRevokePushMessage|Push message recall notification received.|
|OnNotificationClicked|Click notification bar message Webhook.|

### API Detail

#### Member Function Description

##### virtual void OnRecvPushMessage(const PushMessage& message) {}

Push message received. Message received.

##### virtual void OnRevokePushMessage(const FString& messageID) {}

Push message recall notification received. messageID: unique message identifier.

##### virtual void OnNotificationClicked(const FString& ext) {}

Click notification bar message Webhook.

> **Note:**
> Note: Push Certificate in the console need to configure "open specified in-app page" and use populate by default to take effect.
>

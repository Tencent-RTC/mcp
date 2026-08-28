## TIMPush - TIMPushManager

@interface TIMPushManager : NSObject  :Push Plugin Interface Class.

### API overview

#### Register/Unregister Push Service Interface

|API|Description|
|---------|---------|
|registerPush|Register Push Service (Must be called after the App user has agreed to the privacy policy to use the push service).|
|unRegisterPush|Unregister and disable the push service.|
|setRegistrationID|RegistrationID is the unique identifier ID of the push receiving device. By default, this ID is automatically generated when the push service is successfully registered, but you can also customize the setting. You can push messages to the specified device based on the RegistrationID. Note that uninstalling and reinstalling the device will change the RegistrationID, so you need to call the setRegistrationID interface before registering the push service.|
|getRegistrationID|After successfully registering the push service, you can get the unique identifier ID of the push receiving device, that is, the RegistrationID, by calling the getRegistrationID interface. You can push messages to the specified device based on the RegistrationID.|

#### Push global listening interface

|API|Description|
|---------|---------|
|addPushListener|Add Push listener.|
|removePushListener|Remove Push listener.|

#### Custom Configuration Interface

Set whether to display push notifications in the foreground of the app

|API|Description|
|---------|---------|
|disablePostNotificationInForeground|Disable the notification bar when the app is in the foreground.|

### Statistics for TIMPush's Push Arrival Rate

If you need to track push arrival and click data, you need to proactively call this function in the Notification Service Extension.
| API | Description |
| --- | --- |
| handleNotificationServiceRequest:appGroupID:callback: | - Only support calling in Notification Service Extension's '- didReceiveNotificationRequest:withContentHandler:' method.<br>- The appGroup identifies the App Group shared between the main app and the Extension. It needs to be configured in the App Groups capability of the main app's capability. |

### Interface Details

#### Function description

##### + (void)registerPush:(int) sdkAppId appKey:(NSString *) appKey succ:(TIMPushSuccessCallback) successCallback fail:(TIMPushFailedCallback) failedCallback;

Register Push Service. Please correctly pass the parameters sdkAppId and appKey to register the push service.
- Parameter description:

| Parameter | Description | Get Path |
| --- | --- | --- |
| sdkAppId | The application ID assigned to you by the Chat console. |  |
| appKey | The client key assigned to you by the Chat console. |  |

- Sample code:

   ``` java
    const int sdkAppId = your sdkAppId;
    static const NSString *appKey = @"Client Key";

    [TIMPushManager registerPush:sdkAppId appKey:appKey succ:^(NSData * _Nonnull deviceToken) {
        //
     } fail:^(int code, NSString * _Nonnull desc) {
       //error
    }];
   ```

##### + (void)unRegisterPush:(TIMPushCallback) successCallback fail:(TIMPushFailedCallback) failedCallback;

Unregister and disable the push service
- Sample code:

   ``` java
    [TIMPushManager unRegisterPush:^{
         //success
       } fail:^(int code, NSString * _Nonnull desc) {
         //error
     }];
   ```

##### + (void)setRegistrationID:(NSString *)registrationID callback: (TIMPushCallback) callback;

Set the push ID identifier used for registering the push service, i.e., RegistrationID, which needs to be called before registering the push service.
- Parameter description:

   |Parameter|Description|
   |---------|---------|
   |registrationID|The device's push identifier ID will change if you uninstall and reinstall.|

##### + (void)getRegistrationID:(TIMPushValueCallback) callback;

After successfully registering the push service, obtain the push ID identifier, i.e., RegistrationID.

##### + (void)addPushListener:(id<TIMPushListener>)listener

Add Push listener.

##### + (void)removePushListener:(id<TIMPushListener>)listener

Remove Push listener.

##### + (void)disablePostNotificationInForeground:(BOOL)disable;

Disable notification bar pop-ups when the app is in the foreground. When the Push SDK receives an online Push, it will automatically add a Notification to the notification bar. If you want to handle the online Push messages yourself, you can call this interface to disable the automatic notification bar pop-up feature.
- Parameter description:

| Parameter | Description |
| --- | --- |
| disable | - true: disable<br>- false: enable |

##### + (void)handleNotificationServiceRequest:(UNNotificationRequest *)request appGroupID:(NSString *)appGroupID callback:(TIMPushNotificationExtensionCallback)callback

Statistics for TIMPush's Push Arrival Rate
1. You need to implement the `- applicationGroupID` method in the AppDelegate.m file, returning the App Group ID.

2. And call this function in the Notification Service Extension's '- didReceiveNotificationRequest:withContentHandler:' method.

   > **Note:**
   >
   > The appGroup identifies the App Group shared between the main app and the Extension. It needs to be configured in the App Groups capability of the main app's capability.
   >

- Parameter description:

| request | <a href="https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension/1648229-didreceivenotificationrequest">Parameters carried by the UNNotificationServiceExtension callback</a> |
| --- | --- |
| appGroupID | The appGroup identifies the App Group shared between the main app and the Extension. It needs to be configured in the App Groups capability of the main app's capability. |
| callback | typedef void(^TIMPushNotificationExtensionCallback)(UNNotificationContent *content) Statistics function callback, carrying content information |

- Sample code:

   ``` java

   @implementation NotificationService

   - (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
       //The appGroup identifies the App Group shared between the main app and the Extension. It needs to be configured in the App Groups capability of the main app's capability.
       //Format: group + [mainBundleID] + key
       //E.g., group.com.tencent.im.pushkey
       NSString * appGroupID = kTIMPushAppGorupKey;
       __weak typeof(self) weakSelf = self;
       [TIMPushManager handleNotificationServiceRequest:request appGroupID:appGroupID callback:^(UNNotificationContent *content) {
           weakSelf.bestAttemptContent = [content mutableCopy];
           // Modify the notification content here...
           // self.bestAttemptContent.title = [NSString stringWithFormat:@"%@ [modified]", self.bestAttemptContent.title];
           weakSelf.contentHandler(weakSelf.bestAttemptContent);
       }];
   }

   @end
   ```

## TIMPush - TIMPushListener

@protocol TIMPushListener <NSObject> :Push Listener Protocol

### API overview

|API|Description|
|---------|---------|
|onRecvPushMessage|Received Push message|
|onRevokePushMessage|Received a notification of Push message recall|
|onNotificationClicked|Notification bar message click callback|

### Interface Details

#### Member Function Description

##### - (void)onRecvPushMessage:(TIMPushMessage *)message;

Received Push message, message content.

##### - (void)onRevokePushMessage:(NSString *)messageID;

Received a notification of Push message recall, messageID uniquely identifies the message.

##### - (void)onNotificationClicked:(NSString *)ext;

Notification bar message click callback.

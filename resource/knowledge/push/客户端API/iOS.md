---
sync_node_id: '159322943543250944'
nav_path:
  - "推送服务（Push）"
  - "客户端 API"
  - "iOS"
product: "push"
---
This document describes the client APIs of the TIMPush iOS SDK, including `TIMPushManager`, `TIMPushListener`, `TIMPushDelegate`, `TIMPushMessage`, callback types, and error codes.

## API overview

### TIMPushManager

`TIMPushManager` is the push service manager class of the TIMPush iOS SDK. Use it to register the push service, manage `RegistrationID`, configure foreground notification display, add listeners, and measure push arrival in the Notification Service Extension.

|API|Description|
|---------|---------|
|registerPush:appKey:succ:fail:|Registers the push service.|
|unRegisterPush:fail:|Unregisters the push service.|
|getRegistrationID:|Gets the current push registration ID.|
|setRegistrationID:callback:|Sets a custom push registration ID.|
|disablePostNotificationInForeground:|Sets whether to show a notification when the app receives a push in the foreground.|
|addPushListener:|Adds a push listener.|
|removePushListener:|Removes a push listener.|
|handleNotificationServiceRequest:appGroupID:callback:|Handles a push request in the Notification Service Extension to measure push arrival.|

### TIMPushListener

`TIMPushListener` is the push event listener protocol. After implementing it, you can receive push messages, push recall events, and notification click events. The protocol is not marked `@optional`; implement all three methods.

|API|Description|
|---------|---------|
|onRecvPushMessage:|Called when a push message is received.|
|onRevokePushMessage:|Called when a push message recall notification is received.|
|onNotificationClicked:|Callback when a notification bar message is clicked.|

### TIMPushDelegate

`TIMPushDelegate` is the protocol for offline push certificate configuration and click-event handling. It inherits from `UIApplicationDelegate`, and all methods are optional.

|API|Description|
|---------|---------|
|businessID|Returns the offline push certificate ID.|
|applicationGroupID|Returns the App Group ID shared by the main app and the Notification Service Extension.|
|onRemoteNotificationReceived:|Custom handling for a received remote push.|
|navigateToBuiltInChatViewController:groupID:|Handles page navigation after a notification is tapped.|

## Callback types

### TIMPushCallback

General success callback with no return value.

#### Declaration
``` objectivec
typedef void(^TIMPushCallback)(void);
```

### TIMPushValueCallback

Callback that returns a string value.

#### Declaration
``` objectivec
typedef void(^TIMPushValueCallback)(NSString *value);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`value`|`NSString *`|String value returned by the callback.|

### TIMPushSuccessCallback

Callback triggered when push service registration succeeds.

#### Declaration
``` objectivec
typedef void(^TIMPushSuccessCallback)(NSData *deviceToken);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`deviceToken`|`NSData *`|Device token returned by APNs.|

### TIMPushFailedCallback

Callback triggered when an API call fails.

#### Declaration
``` objectivec
typedef void(^TIMPushFailedCallback)(int code, NSString *desc);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`code`|`int`|Error code.|
|`desc`|`NSString *`|Error description.|

### TIMPushCallExperimentalAPISucc

Callback triggered when an experimental API call succeeds.

#### Declaration
``` objectivec
typedef void(^TIMPushCallExperimentalAPISucc)(NSObject *object);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`object`|`NSObject *`|Data object returned by an experimental API. The concrete type depends on the API definition.|

### TIMPushNotificationExtensionCallback

Callback triggered after the Notification Service Extension finishes handling a push request.

#### Declaration
``` objectivec
typedef void(^TIMPushNotificationExtensionCallback)(UNNotificationContent *content);
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`content`|`UNNotificationContent *`|Processed notification content.|

#### Availability

Available on iOS 10.0 and later.

## TIMPushManager

### registerPush:appKey:succ:fail:

Registers the TIMPush push service.

#### Declaration
``` objectivec
+ (void)registerPush:(int)sdkAppId
              appKey:(NSString *)appKey
                succ:(TIMPushSuccessCallback)successCallback
                fail:(TIMPushFailedCallback)failedCallback;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`sdkAppId`|`int`|SDKAppID of the Push app.|
|`appKey`|`NSString *`|Client key of the Push app.|
|`successCallback`|`TIMPushSuccessCallback`|Registration success callback. The callback carries the `deviceToken` returned by APNs.|
|`failedCallback`|`TIMPushFailedCallback`|Registration failure callback. The callback carries the error code and error description.|

#### Description
1. If you use the push service alone, pass valid `sdkAppId` and `appKey` values to register the push service.

2. If you have already integrated Chat, call this API after a successful Chat login and set `appKey` to `nil` to enable offline push.

3. Before calling this API, make sure the user has agreed to the app privacy policy and granted notification permission. After successful registration, the SDK binds the current device to the push service.

#### Availability

This API cannot be called from an App Extension.

### unRegisterPush:fail:

Unregisters the push service.

#### Declaration
``` objectivec
+ (void)unRegisterPush:(TIMPushCallback)successCallback
                  fail:(TIMPushFailedCallback)failedCallback;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`successCallback`|`TIMPushCallback`|Unregistration success callback.|
|`failedCallback`|`TIMPushFailedCallback`|Unregistration failure callback. The callback carries the error code and error description.|

#### Description

When the user logs out, call this API to disable push for the current user or device.

If you use the `login` and `logout` capabilities provided by `TUILogin`, you do not need to call this API separately.

#### Availability

This API cannot be called from an App Extension.

### getRegistrationID:

Gets the current push registration ID.

#### Declaration
``` objectivec
+ (void)getRegistrationID:(TIMPushValueCallback)callback;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`callback`|`TIMPushValueCallback`|Get success callback. The callback returns the current push ID.|

#### Description

The callback return value depends on the integration scenario:
- Standalone Push: returns the SDK-generated `registrationID` (device ID), which may change after uninstall and reinstall.

- Chat / TUIKit: returns the currently logged-in Chat `userID`.

   Call this API after the success callback of `registerPush:appKey:succ:fail:`; otherwise you may not get a value. When sending test messages from the console or server, use the returned value to identify the device or user.

#### Availability

This API cannot be called from an App Extension.

### setRegistrationID:callback:

Sets the push registration ID.

#### Declaration
``` objectivec
+ (void)setRegistrationID:(NSString *)registrationID
                 callback:(TIMPushCallback)callback;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`registrationID`|`NSString *`|Custom push registration ID.|
|`callback`|`TIMPushCallback`|Set completion callback.|

#### Description

If your business needs a custom `RegistrationID` to push messages to a specific device, call this API before `registerPush:appKey:succ:fail:`.

#### Availability

This API cannot be called from an App Extension.

### disablePostNotificationInForeground:

Sets whether to show a notification when the app receives a push in the foreground.

#### Declaration
``` objectivec
+ (void)disablePostNotificationInForeground:(BOOL)disable;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`disable`|`BOOL`|`YES`: disable foreground notification display; `NO`: enable foreground notification display.|

#### Description

When the app is in the foreground, the SDK shows a notification by default after receiving an online push. If your business needs to handle online push messages yourself, set this parameter to `YES`.

#### Availability

This API can be called from the main app and is not restricted to App Extensions.

#### Swift name
``` swift
disablePostNotificationInForeground(disable:)
```

### addPushListener:

Adds a push listener.

#### Declaration
``` objectivec
+ (void)addPushListener:(id<TIMPushListener>)listener;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`listener`|`id<TIMPushListener>`|Push listener object.|

#### Description

After you add a listener, the SDK callbacks push messages, recall notifications, and notification click events through `TIMPushListener`.

#### Swift name
``` swift
addPushListener(listener:)
```

#### Availability

This API cannot be called from an App Extension.

### removePushListener:

Removes a push listener.

#### Declaration
``` objectivec
+ (void)removePushListener:(id<TIMPushListener>)listener;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`listener`|`id<TIMPushListener>`|Push listener object to remove.|

#### Description

When you no longer need push events, call this API to remove the listener.

#### Swift name
``` swift
removePushListener(listener:)
```

#### Availability

This API cannot be called from an App Extension.

### handleNotificationServiceRequest:appGroupID:callback:

Handles a push request in the Notification Service Extension.

#### Declaration
``` objectivec
+ (void)handleNotificationServiceRequest:(UNNotificationRequest *)request
                              appGroupID:(NSString *)appGroupID
                                callback:(TIMPushNotificationExtensionCallback)callback;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`request`|`UNNotificationRequest *`|The notification request received by `UNNotificationServiceExtension`.|
|`appGroupID`|`NSString *`|App Group ID shared by the main app and the Notification Service Extension.|
|`callback`|`TIMPushNotificationExtensionCallback`|Completion callback. The callback carries the processed notification content.|

#### Description

This API is used to measure TIMPush arrival rates. Call it only in the Notification Service Extension method `didReceiveNotificationRequest:withContentHandler:`.

Before using this API, complete the following configuration:
- Configure the App Groups capability in the main app.

- In `AppDelegate`, implement the `TIMPushDelegate` method `applicationGroupID` and return the App Group ID.

- Make sure the main app and the Notification Service Extension use the same App Group ID.

#### Swift name
``` swift
handleNotificationServiceRequest(request:appGroupID:callback:)
```

## TIMPushListener

The `TIMPushListener` protocol is not marked `@optional`. When you implement it, you must implement all three methods: `onRecvPushMessage:`, `onRevokePushMessage:`, and `onNotificationClicked:`.

The three callbacks are triggered as follows:

|Callback|Trigger timing|
|---------|---------|
|`onRecvPushMessage:`|Triggered when the app is online and receives a Chat message that includes `offlinePushInfo`.|
|`onRevokePushMessage:`|Triggered when the app is online and receives a message recall notification.|
|`onNotificationClicked:`|Triggered when the user taps a notification bar message. This includes cases where the app is offline, the message is delivered via APNs / Notification Service Extension, and tapping the notification launches the app.|

### onRecvPushMessage:

Triggered when the app is online and receives a Chat message that includes `offlinePushInfo`. This callback is not triggered if the app process has already exited.

#### Declaration
``` objectivec
- (void)onRecvPushMessage:(TIMPushMessage *)message;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`message`|`TIMPushMessage *`|Push message object.|

### onRevokePushMessage:

Triggered when the app is online and receives a message recall notification. This callback is not triggered if the app process has already exited.

#### Declaration
``` objectivec
- (void)onRevokePushMessage:(NSString *)messageID;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`messageID`|`NSString *`|Unique ID of the recalled message.|

### onNotificationClicked:

Triggered when the user taps a notification bar message, whether the app is in the foreground, background, or has exited (and is launched by tapping the notification). In the console, set **Click action** for the push certificate to **Open a specified in-app page** and keep the default filled value.

#### Declaration
``` objectivec
- (void)onNotificationClicked:(NSString *)ext;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`ext`|`NSString *`|Offline message passthrough field.|

## TIMPushDelegate

`TIMPushDelegate` is used to configure the offline push certificate and to take over remote push handling and post-click navigation. This protocol inherits from `UIApplicationDelegate`, and all methods are optional.

### businessID

Returns the offline push certificate ID.

#### Declaration
``` objectivec
- (int)businessID;
```

#### Return value

Offline push certificate ID assigned in the console.

#### Description

Implement this method in `AppDelegate` and return the offline push certificate ID assigned in the console.

The certificate ID must match the current runtime environment. The development certificate ID is for Xcode Debug. The production certificate ID is for testing or releasing an Archive Release build.

### applicationGroupID

Returns the App Group ID shared by the main app and the Notification Service Extension.

#### Declaration
``` objectivec
- (NSString *)applicationGroupID;
```

#### Return value

App Group ID shared by the main app and the Notification Service Extension.

#### Description

Implement this method in `AppDelegate`. If you need to measure push arrival rates on iOS 10 and later, implement this method and return the configured App Group ID. The value must match the `appGroupID` passed to `handleNotificationServiceRequest:appGroupID:callback:`.

### onRemoteNotificationReceived:

Custom handling for a received remote push. Triggered when the app receives a remote push online, or when the user taps a notification while the app is offline.

#### Declaration
``` objectivec
- (BOOL)onRemoteNotificationReceived:(nullable NSString *)notice;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`notice`|`NSString * _Nullable`|Remote push notification content.|

#### Description

If you need custom parsing of remote push notifications, implement this method in `AppDelegate`.

#### Return value
- Returning `YES` means your business has handled the push, and TIMPush will no longer run the built-in TUIKit offline push parsing logic.

- Returning `NO` means TIMPush continues the built-in TUIKit offline push parsing logic and continues to call `navigateToBuiltInChatViewController:groupID:`.

### navigateToBuiltInChatViewController:groupID:

Handles page navigation after a notification is tapped.

#### Declaration
``` objectivec
- (void)navigateToBuiltInChatViewController:(nullable NSString *)userID
                                    groupID:(nullable NSString *)groupID;
```

#### Parameters

|Parameter|Type|Description|
|---------|---------|---------|
|`userID`|`NSString * _Nullable`|One-to-one chat user ID.|
|`groupID`|`NSString * _Nullable`|Group chat ID.|

#### Description

TIMPush parses `userID` and `groupID` from the offline push. If `groupID` is not empty, the tap is for a group chat offline message. If `groupID` is empty and `userID` is not empty, the tap is for a one-to-one offline message.

#### Swift name
``` swift
navigateToBuiltInChatViewController(userID:groupID:)
```

## TIMPushMessage

`TIMPushMessage` represents a push message object.

### Properties

|Property|Type|Description|
|---------|---------|---------|
|`title`|`NSString *`|Offline push title.|
|`desc`|`NSString *`|Offline push content.|
|`ext`|`NSString *`|Offline push passthrough content.|
|`messageID`|`NSString *`|Unique message ID.|

## Error codes

`TIMPushErrorCode` defines the business error codes of the TIMPush SDK.

|Error code|Value|Description|
|---------|---------|---------|
|`TIMPushErrorUndefinedCode`|`-1`|Unknown error.|
|`TIMPushErrorNotLogined`|`800001`|Chat account not logged in before registering push.|
|`TIMPushErrorInvalidSdkAppId`|`800002`|Invalid `sdkAppId` parameter for push registration.|
|`TIMPushErrorRegisterPushInitFailed`|`800003`|Failed to initialize the SDK.|
|`TIMPushErrorCallExperimentalApiFailed`|`800015`|Experimental API call failed.|
|`TIMPushErrorNotificationAuthorizationDenied`|`800016`|The user denied notification permission.|
|`TIMPushErrorHttpsRequestFailed`|`800017`|HTTPS request failed.|

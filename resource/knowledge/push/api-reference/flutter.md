## TencentCloudChatPush

class TencentCloudChatPush: Push Plugin Interface Class.

## API overview

### Register/Unregister Push Service Interface

|API|Description|
|---------|---------|
|registerPush|Register Push Service, optionally override push information from interface parameter JSON.|
|unRegisterPush|Unregister Push Service.|
|setRegistrationID|RegistrationID is the unique identifier ID of the push receiving device. By default, this ID is automatically generated when the push service is successfully registered, but you can also customize the setting. You can push messages to the specified device based on the RegistrationID. Note that uninstalling and reinstalling the device will change the RegistrationID, so you need to call the setRegistrationID interface before registering the push service.|
|getRegistrationID|After successfully registering the push service, you can get the unique identifier ID of the push receiving device, that is, the RegistrationID, by calling the getRegistrationID interface. You can push messages to the specified device based on the RegistrationID.|

### Push global listening interface

|API|Description|
|---------|---------|
|addPushListener|Add Push listener.|
|removePushListener|Remove Push listener.|

### Custom Configuration Interface

|API|Description|
|---------|---------|
|forceUseFCMPushChannel|Specify offline push to use the FCM channel for the device. This needs to be called before registering the push service.|
|disablePostNotificationInForeground|Disable the notification bar when the app is in the foreground.|

## Interface Details

### Push Plugin Class

TencentCloudChatPush(): Get the TencentCloudChatPush plugin instance, which is a static singleton. Subsequent steps are performed through this singleton instance for method calls.

### Member Function Description

#### registerPush

Register Push Service, to be called after Chat account login is successful.

**Sample code:**
``` java
void _onNotificationClicked({required String ext, String? userID, String? groupID}) {
  print("_onNotificationClicked: $ext, userID: $userID, groupID: $groupID");
  /// Custom Processing
}
TencentCloudChatPush().registerPush(
    onNotificationClicked: _onNotificationClicked,
    sdkAppId: Your sdkAppId,
    appKey: "client key",
    apnsCertificateID: Your configured Certificate ID);
```

**Parameter description:**
| Parameter | Type | Description |  |
| --- | --- | --- | --- |
| onNotificationClicked | ext | String | The complete ext information carried by the message is specified by the sender. If not specified, there is a default value. You can parse this field to navigate to the corresponding page. |
| userID | String? | This parameter corresponds to userID. It automatically tries to parse the ext JSON String to obtain the userID of the other party in a single chat.<br><strong>Note:</strong><br>If you have not customized the ext field, which is specified by the SDK or UIKit by default, you can use the default parsing here. If the parsing attempt fails, it will be null. |  |
| groupID | String? | This parameter corresponds to groupID. It automatically tries to parse the ext JSON String to obtain the groupID information for group chats.<br><strong>Note:</strong><br>If you have not customized the ext field, which is specified by the SDK or UIKit by default, you can use the default parsing here. If the parsing attempt fails, it will be null. |  |
| sdkAppId | int? | The application ID assigned to you by the Chat console |  |
| appKey | String? | Client key assigned to you by the Chat console |  |
| apnsCertificateID | int? | This item can be omitted if the setApnsCertificateID method is already configured separately. |  |

#### unRegisterPush

Unregister offline push service.

**Sample code:**
``` java
TencentCloudChatPush().unRegisterPush();
```

#### setRegistrationID

Set the push ID used for registering the offline push service, that is, the RegistrationID, which needs to be called before registering the push service.

Parameter description:

|Parameter|Description|
|---------|---------|
|registrationID|Device push ID, which will change after uninstalling and reinstalling.|

**Sample code:**
``` java
TencentCloudChatPush().setRegistrationID(registrationID: registrationID);
```

#### getRegistrationID

After successfully registering for the offline push service, obtain the push ID, that is, the RegistrationID.

**Sample code:**
``` java
TencentCloudChatPush().getRegistrationID();
```

#### addPushListener

Add Push listener

**Sample code:**
``` java
TIMPushListener timPushListener = TIMPushListener(
  onRecvPushMessage: (TimPushMessage message) {
      String messageLog = message.toLogString();
      debugPrint(
          "message: $messageLog");
      },

  onRevokePushMessage: (String messageId) {
    debugPrint(
        "message: $messageId");
  },

  onNotificationClicked: (String ext) {
    debugPrint(
        "ext: $ext");
  }
);
TencentCloudChatPush.addPushListener(listener: timPushListener);
```

#### removePushListener

Remove Push listener

**Sample code:**
``` java
TIMPushListener timPushListener = TIMPushListener(
  onRecvPushMessage: (TimPushMessage message) {
      String messageLog = message.toLogString();
      debugPrint(
          "message: $messageLog");
      },

  onRevokePushMessage: (String messageId) {
    debugPrint(
        "message: $messageId");
  },

  onNotificationClicked: (String ext) {
    debugPrint(
        "ext: $ext");
  }
);
TencentCloudChatPush.removePushListener(listener: timPushListener);
```

#### forceUseFCMPushChannel

Specify offline push to use the FCM channel for the device. This needs to be called before registering the push service.

Parameter description:
| Parameter | Description |
| --- | --- |
| enable | - true: Use FCM channel.<br>- false: use the native channel. |

**Sample code:**
``` java
TencentCloudChatPush.forceUseFCMPushChannel(enable: true);
```

#### disablePostNotificationInForeground

Disable notification bar pop-ups when the app is in the foreground. When the Push SDK receives an online Push, it will automatically add a Notification to the notification bar. If you want to handle the online Push messages yourself, you can call this interface to disable the automatic notification bar pop-up feature.

Parameter description:
| Parameter | Description |
| --- | --- |
| disable | - true: disable<br>- false: enable |

**Sample code:**
``` java
TencentCloudChatPush.disablePostNotificationInForeground(disable: true);
```

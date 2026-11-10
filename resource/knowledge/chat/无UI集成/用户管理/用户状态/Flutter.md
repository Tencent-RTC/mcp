---
sync_node_id: '185417061485760512'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "用户状态"
  - "Flutter"
product: "chat"
---
## Feature Description

The SDK on v5.0 or later provides the user status management feature. Each user has two statuses:
- General status. It is preset in the SDK and cannot be modified.

- Custom status. It can be customized and modified by users. For example, it can be set to "Listening to music" or "On the call".

   The general user status is available in the following 3 types:

- Online (ONLINE): The current user has logged in and can receive and send messages.

- Offline (OFFLINE): The user didn't call `logout`to log out, and the persistent connection is disconnected. In general, the user can receive offline push messages.

- Not logged in (UNLOGINED): The user hasn't logged in since registration or has called `logout` to log out.

   Keep the following in mind in terms of the offline status:

1. An account will be in the offline status if the application is killed or the network is disconnected abnormally (such as due to 4G/Wi-Fi switch or a weak signal in an elevator) when the application is being logged in.

2. An account will be in the offline status if the application process is killed after the user logs in to the application and clicks the Home button to enter the background. An account will be in the online status if the application process is kept alive in the background.

3. Switching between the online and offline statuses relies on the TCP persistent connection between the IM SDK and the backend. If the client is in airplane mode, the network is completely disconnected, or if not supported by certain device vendors, TCP FIN or RST packets may fail to be sent, and the offline status cannot be switched to immediately. As the backend cannot receive heartbeat packets, it will set the current user status to offline 400 seconds later.

   > **Note:**
   > 
   > 1. User status is relevant to the current user but not the device. If an account is logged in on multiple devices at the same time, the status cannot be queried or set by device.
   > 2. Some of the following features are supported only by the [Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat).
   > 3. Some of the features mentioned below require enabling the [Console](https://console.trtc.io/) switch for `Set user status query and status change notification`. The switch path is: Applications > Your App > Chat > Configuration > Login and Message > Set user status query and status change notification.

## Effect

You can use this feature to display the online status and custom statuses of users in your App, as shown in the effect picture below:

## Setting Self Status

Call the `setSelfStatus` API to set a user's own custom status through the `customStatus` field.

If you have called `addIMSDKListener` to add a SDK listener, the `onUserStatusChanged` callback will be triggered after the field is set successfully.

For more information, see [Status Change Notification](#status-change-notification).

The following describes how to clear the custom status:
1. When calling the `setSelfStatus` API, you can leave the `customStatus` field empty to clear the status.

2. When the SDK notices that the current account is in the offline status, it will automatically clear the custom status and trigger the status change notification.

   > **Note**
   > 
   > 1. To call `setSelfStatus`, you don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition or enable the feature in the console.
   > 2. The `customStatus` is up to 100 bytes.
   > 3. This API can be called an unlimited number of times.

   Sample code:

   

【Dart】
``` java
V2TimCallback setRes = await TencentImSDKPlugin.v2TIMManager.setSelfStatus(status: "listening to music");
if(setRes.code == 0){
// success
}else{
// fail
}
```

## Querying the User Status

Call the `getUserStatus` API to query the status of the current user or another user. The API will return the general status and custom status of the queried user.

### Querying a User's Own Status

Users can call `getUserStatus` and set `userIDList` to their own `userID` to query their own status.

> **Note**
> 1. To allow users to query their own status, you don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition or enable the feature in the console.
> 2. This API can be called an unlimited number of times.

Sample code:

【Dart】
``` java
final result = await TencentImSDKPlugin.v2TIMManager.getLoginUser();
String loginUserID = result.data ?? '';
V2TimValueCallback<List<V2TimUserStatus>> userStatusRes = await TencentImSDKPlugin.v2TIMManager.getUserStatus(userIDList: ["loginUserID"]);
```

### Querying Other User's Status

A user can set `userIDList` to the list of the `userID` values of other users to query their statuses.

> **Note**
> 1. Querying the status of other users requires the [Purchase Pro edition、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).
> 2. To query the status of other users, you need to activate the switch `Set user status query and status change notification` in the [Console](https://console.trtc.io/) in advance. The switch path is: Applications > Your App > Chat > Configuration > Login and Message. If the switch is off, calling getUserStatus will result in an error.
> 3. By default, this API can be called 20 times every 5 seconds, and the statuses of up to 500 users can be queried at a time.

Sample code:

【Dart】
``` java
V2TimValueCallback<List<V2TimUserStatus>> userStatusRes = await TencentImSDKPlugin.v2TIMManager.getUserStatus(userIDList: ["userid1", "userid2"]);
```

## Subscribing to the User Status

Call the `subscribeUserStatus` API to subscribe to the status of the specified user. By default, the IM SDK supports subscribing to the statuses of up to 200 users. After this limit is exceeded, the earliest subscribed user statuses will be removed.

When the user status (including general status and custom status) subscribed to changes, the status change notification can be received in the `onUserStatusChanged` callback.

API features:
1. This API doesn't support subscribing to a user's own status, which can be obtained in the `onUserStatusChanged` callback. For more information, see [Status Change Notification](#status-change-notification).

2. This API supports subscribing to the status of a friend, which will occupy the quota of 200 mentioned above.

   - To get the changes in the statuses of all of a user's friends, you don't need to call this API, and you can enable automatic notifications of friends' statuses in the [Console](https://console.trtc.io/), after which a status change notification can be received in the `onUserStatusChanged` callback.

   - To get the changes in the statuses of some of a user's friends, you can only call `subscribeUserStatus` for subscription, after which a status change notification can be received in the `onUserStatusChanged` callback.

      > **Note**
      > 
      > 1. Subscribing to user status requires the [Purchase Pro edition、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).
      > 2. To subscribe to user status, you must first enable the `Set user status query and status change notification` toggle in the [Console](https://console.trtc.io/). The toggle path: Applications > Your App > Chat > Configuration > Login and Message. If the toggle is off, calling subscribeUserStatus will result in an error.
      > 3. By default, this API can be called 20 times every five seconds, and the statuses of up to 100 users can be subscribed to at a time.

      Sample code:

      

【Dart】
``` java
await TencentImSDKPlugin.v2TIMManager.subscribeUserStatus(userIDList: ["userid1","userid2"]);
```

## Unsubscribing from the User Status

To stop receiving notifications of changes in user statuses, call the `unsubscribeUserStatus` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a9254db13bd53dc48a04d05ba5f116d39) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.unsubscribeuserstatus(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a3780734bb50398ebe65155c3223542f0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a7e62b89e6ad2d164458afa24f379530c)) to unsubscribe from the user status or clear the subscription list.

If you do not manually clear your subscription list, your account's subscription relationships will automatically be cancelled after a long period of offline time (for example: if you do not log in again within 24 hours).

Restrictions for unsubscribing user status are consistent with restrictions for [subscribing user status](#subscribing-to-the-user-status).

Sample code:

【Dart】
``` java
await TencentImSDKPlugin.v2TIMManager.unsubscribeUserStatus(userIDList: ["userid1","userid2"]);
```

## Status Change Notification

Depending on the user type, status changes can be divided into three types:
1. Change in a user's own status.

2. Change in a friend's status.

3. Change in a non-friend user's status.

   Notifications on all these status changes can be called back through `onUserStatusChanged`, but different types of users trigger the notification differently.

### User's Own Status Changed

If you have called `addIMSDKListener` to add an SDK listener, after a user's own status is set successfully, when the status changes, the `onUserStatusChanged` callback will be triggered, where the user can get the latest own status.

### Friend's Status Changed
1. If you have enabled automatic notifications of friends' statuses in the [Console](https://console.trtc.io/), when the status of a user's friend changes, the `onUserStatusChanged` callback will be automatically triggered.

2. If you don't enable automatic notifications of friends' statuses and want to get friends' status changes, you need to call `subscribeUserStatus` to subscribe to friends' statuses. When a friend's status changes, the `onUserStatusChanged` callback will be automatically triggered.

   The use of `subscribeUserStatus` is limited, refer to [Subscriber Status](#subscribing-to-the-user-status) above for details.

3. If you neither enable automatic notifications of friends' statuses nor call `subscribeUserStatus` to subscribe to friends' statuses, changes in friends' statuses cannot be obtained.

### Non-friend User's Status Changed

To get the change in a non-friend user's status, you can only call `subscribeUserStatus` to subscribe to the status. When the user's status changes, the `onUserStatusChanged` callback will be triggered, where the user can get the latest status of the non-friend user.

The use of subscribeUserStatus is limited, refer to [Subscriber Status](#subscribing-to-the-user-status) above for details.

Sample code:

【Dart】
``` java
var sdkListener = V2TimSDKListener(
  onUserStatusChanged: (List<V2TimUserStatus> userStatusList) {
  
  },
);

TencentImSDKPlugin.v2TIMManager.addIMSDKListener(sdkListener);
```

### Multi-client Sync of Status Change Notifications

If you have enabled multi-client login (for more information, see [Feature Configuration](https://intl.cloud.tencent.com/document/product/1047/34419)), an account can be logged in on different clients. When the status of the user logged in on one of the clients changes, the backend will send the `onUserStatusChanged` notification to other logged-in clients.

## API Restrictions

### Plan Restrictions
- You don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `setSelfStatus` API.

- You don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `getUserStatus` API to query a user's own status.

- You need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `getUserStatus` API to query another user's status.

- You need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `subscribeUserStatus` / `unsubscribeUserStatus` API.

### API Call Frequency Limit
- The `setSelfStatus` API can be called an unlimited number of times.

- The `getUserStatus` API is used to query a user's own status and can be called an unlimited number of times.

- By default, the `getUserStatus` API can be called 20 times every five seconds if used to query the status of another user, and the statuses of up to 500 users can be queried at a time.

- By default, the `subscribeUserStatus` API can be called 20 times every five seconds, and the statuses of up to 100 users can be subscribed to at a time.

- By default, the `unsubscribeUserStatus` API can be called 20 times every five seconds, and up to 100 users can be unsubscribed from at a time.

## FAQs
- **What should I do if error code 72001 is reported when I call the subscribe/unsubscribe API?**

   Error code 72001 indicates that the feature is not enabled in the console. You need to log in to the [Console](https://console.trtc.io/) and enable the feature.

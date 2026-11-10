---
sync_node_id: '108053283899744256'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "用户状态"
  - "JavaScript"
product: "chat"
---
## Feature Overview

The JavaScript SDK provides a feature for User Status Management, where each user has two different types of status:
- Normal Status. An SDK built-in status that cannot be directly modified by clients.

- Custom Status. A client-defined status that can be modified. Using Custom Status, you can set information such as "Listening to music," "During the call," etc.

   > **Note:**
   > 
   > User status is specific to the current user and is not related to the device. If multiple devices are logged in to the same account simultaneously, querying or setting the status by device is not supported.
   > 

   There are three types of normal user status:

- Online (`TencentCloudChat.TYPES.USER_STATUS_ONLINE`): The current user has logged in and is online, can send and receive messages normally.

- Offline (`TencentCloudChat.TYPES.USER_STATUS_OFFLINE`): Web login/logout will not trigger offline status. In apps integrating Native 

- ChatSDK, offline status will be triggered.

- Unlogged in (`TencentCloudChat.TYPES.USER_STATUS_UNLOGINED`): The user has never logged in after registering an account, or the user proactively called `logout` to log out.

## UI Display

## Set your custom status

You can call the interface `setSelfStatus` to set the `customStatus` field for your custom status. Once set successfully, you will receive a notification of your status change through the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event. 

> **Note:**
> 1. Calling `setSelfStatus` does not require upgrading to the Pro edition 、Pro Plus edition or Enterprise edition, nor does it need the Console Switch to be turned on.
> 2. This interface does not perform frequency limiting control.
> 3. You can actively clear your status by setting the `customStatus` field to an empty string when calling the `setSelfStatus` interface.
> 4. After logging out for a period of time (Web), the Chat backend will automatically clear the custom status. This will also trigger a status change notification.

##### **API**

【js】
``` javascript
chat.setSelfStatus(options);
```

##### **Parameters**

The `options` parameter is of the `Object`type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|customStatus|String|User Custom Status|

##### **Return value**

`Promise` 

##### **Examples**

【js】
``` javascript
// Set customStatus to an empty string '', this will clear your custom status
let promise = chat.setSelfStatus({customStatus: 'xxx'});
promise.then(function(imResponse) {
  console.log(imResponse.data);
  const { userID, statusType, customStatus } = imResponse.data;
  // userID - User ID
  // statusType - User status. The enumerated values and descriptions are as follows:
  // TencentCloudChat.TYPES.USER_STATUS_UNKNOWN - Unknown
  // TencentCloudChat.TYPES.USER_STATUS_ONLINE - Online
  // TencentCloudChat.TYPES.USER_STATUS_OFFLINE - Offline
  // TencentCloudChat.TYPES.USER_STATUS_UNLOGINED - Not Logged In
  // customStatus - User Custom Status
}).catch(function(imError) {
  console.warn('setSelfStatus error:', imError); // Failed to set user's custom status
});
```

## Query User Status

The API will return both the normal status and the custom status of the queried users.

> **Note:**
> 1. Querying your own status does not require upgrading to the Pro edition 、Pro Plus edition or Enterprise edition or enabling the console switch.
> 2. Querying your own status is not subject to API rate limiting.
> 3. Querying the status of other users requires upgrading to the Pro edition 、Pro Plus edition or Enterprise edition, with a default interface call limit of 20 requests per 5 seconds, and a single query can include no more than 500 users.
> 4. Querying the status of other users requires enabling "Set user status query and status change notification" in the [Chat Console](https://console.trtc.io/chat/login-message) in advance. If the switch is turned off, calling `getUserStatus` will result in an error.

##### **API**

【js】
``` javascript
chat.getUserStatus(options);
```

##### **Parameters**

The `options` parameter is of the `Object`type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of userIDs to be queried. When querying yourself, you only need to pass your own userID.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Check your own user status
// userIDList includes only your own userID to query your own status
let promise = chat.getUserStatus({userIDList: [`${myUserID}`]});
promise.then(function(imResponse) {
   const { successUserList } = imResponse.data;
   successUserList.forEach((item) => {
     const { userID, statusType, customStatus } = item;
     // userID - User ID
     // statusType - User status, the enumerated values and descriptions are as follows:
     // TencentCloudChat.TYPES.USER_STATUS_UNKNOWN - Unknown
     // TencentCloudChat.TYPES.USER_STATUS_ONLINE - Online
     // TencentCloudChat.TYPES.USER_STATUS_OFFLINE - Offline
     // TencentCloudChat.TYPES.USER_STATUS_UNLOGINED - Not Logged In
     // customStatus - User Definition Status
   });
}).catch(function(imError) {
  console.warn('getUserStatus error:', imError); // Failed to obtain user status
});
```

### Check the status of others

Set `userIDList` to the userID list of others to check their status.

##### **Examples**

【js】
``` javascript
// Query the status of others
let promise = chat.getUserStatus({userIDList: ['user0', 'user1']});
promise.then(function(imResponse) {
   const { successUserList, failureUserList } = imResponse.data;
   // List of users with successful queries
   successUserList.forEach((item) => {
     const { userID, statusType, customStatus } = item;
     // userID - User ID
     // statusType - User status, the enumerated values and descriptions are as follows:
     // TencentCloudChat.TYPES.USER_STATUS_UNKNOWN - Unknown
     // TencentCloudChat.TYPES.USER_STATUS_ONLINE - Online
     // TencentCloudChat.TYPES.USER_STATUS_OFFLINE - Offline
     // TencentCloudChat.TYPES.USER_STATUS_UNLOGINED - Not Logged In
     // customStatus - User Definition Status
   });

   // List of users with failed queries
   failureUserList.forEach((item) => {
     const { userID, code, message } = item;
     // userID - User ID of the failed query
     // code - Error code of the failed query
     // message - Error message of the failed query
   });
}).catch(function(imError) {
  console.warn('getUserStatus error:', imError); // Failed to obtain user status
});
```

### Subscription user status

After successful subscription, when the status of the subscribed user changes (including normal status and custom status), you will receive a user status change notification through the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event.

> **Note:**
> 1. This API requires upgrading to the Pro edition 、Pro Plus edition or Enterprise edition.
> 2. The API is rate-limited to 20 requests per 5-second interval, and the maximum number of users per subscription cannot exceed 100.
> 3. There is a limit on the number of subscriptions in the list. Once the limit is exceeded, the earliest subscribed users will be automatically eliminated.

##### **API**

【js】
``` javascript
chat.subscribeUserStatus(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array|List of user userID, up to 100 per request.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.subscribeUserStatus({userIDList: ['user0', 'user1']});
promise.then(function(imResponse) {
  const { failureUserList } = imResponse.data;
   // List of users with failed subscriptions
   failureUserList.forEach((item) => {
     const { userID, code, message } = item;
     // userID - User ID of the failed query
     // code - Error code of the failed query
     // message - Error message of the failed query
   });
}).catch(function(imError) {
  // Error information regarding the failure to subscribe to user status
  console.warn('subscribeUserStatus error:', imError);
});
```

## Unsubscribe user status

After successful unsubscription, when the status of the user changes (including normal status and custom status), the SDK will not dispatch the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event.

> **Note:**
> The API is rate-limited to 20 requests per 5-second interval, and the maximum number of users per unsubscription cannot exceed 100.
> 

##### **API**

【js】
``` javascript
chat.unsubscribeUserStatus(options);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array \| undefined|List of user IDs, with a maximum of 100 per single request. When userIDList is an empty array or `undefined`, it cancels all current subscriptions.|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
// Unsubscribe current partial users
let promise = chat.unsubscribeUserStatus({userIDList: ['user0', 'user1']});
promise.then(function(imResponse) {
  const { failureUserList } = imResponse.data;
   // List of users with failed unsubscriptions
   failureUserList.forEach((item) => {
     const { userID, code, message } = item;
     // userID - User ID of the failed query
     // code - Error code of the failed query
     // message - Error message of the failed query
   });
}).catch(function(imError) {
  console.warn('unsubscribeUserStatus error:', imError); // Information related to the unsubscription failure
});
```

【js】
``` javascript
// Unsubscribe from all current subscriptions
let promise = chat.unsubscribeUserStatus();
promise.then(function(imResponse) {
  const { failureUserList } = imResponse.data;
   // List of users with failed unsubscriptions
   failureUserList.forEach((item) => {
     const { userID, code, message } = item;
     // userID - User ID of the failed query
     // code - Error code of the failed query
     // message - Error message of the failed query
   });
}).catch(function(imError) {
  console.warn('unsubscribeUserStatus error:', imError); // Information related to the unsubscription failure
});
```

### Notification of Own Status Change

If you have pre-registered for the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event listener, when your own status changes, the SDK will dispatch the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event, and you can get your latest status there.

### Notification of Friend's Status Change
1. If you have enabled the automatic friend status notification in the [Chat Console](https://console.trtc.io/), when a friend's status changes, the SDK will dispatch the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` event, and you can get your friend's latest status there.

2. If you have not enabled automatic friend status notifications and still want to be aware of friend status changes, you need to call `subscribeUserStatus` to actively subscribe to the friend's status. When the friend's status changes, the SDK will dispatch the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` callback.

3. If you have neither enabled automatic notification of friend status nor called `subscribeUserStatus` to actively subscribe to friend status, then when a friend's status changes, you will not be able to perceive it.

### Status Change of Regular Users (Non-friends)

If you want to be aware of regular user (non-friend) status changes, you can only call `subscribeUserStatus` to actively subscribe. When that user's status changes, the `TencentCloudChat.EVENT.USER_STATUS_UPDATED` callback will be triggered, and you can get their latest status there.

##### **Examples**

【js】
``` javascript
/**
 * Scenarios for receiving notifications:
 * 1. When a subscribed user's status changes (including online status and user-defined status), this event will be triggered
 * 2. If the Friend Status Notification Switch is enabled in the console, even if you haven't actively subscribed, this event will be triggered when a friend's status changes
 * 3. When the same account logs in to multiple devices, if one device modifies the user-defined status, all devices will receive this event
 */
let onUserStatusUpdated = function(event) {
   console.log(event.data);
   const userStatusList = event.data;
   userStatusList.forEach((item) => {
     const { userID, statusType, customStatus } = item;
     // userID - User ID
     // statusType - User status, the enumerated values and descriptions are as follows:
     // TencentCloudChat.TYPES.USER_STATUS_UNKNOWN - Unknown
     // TencentCloudChat.TYPES.USER_STATUS_ONLINE - Online
     // TencentCloudChat.TYPES.USER_STATUS_OFFLINE - Offline
     // TencentCloudChat.TYPES.USER_STATUS_UNLOGINED - Not Logged In
     // customStatus - User Definition Status
   })
};
chat.on(TencentCloudChat.EVENT.USER_STATUS_UPDATED, onUserStatusUpdated);
```

### Status Change Notification across multiple platforms, Multi-Instance Synchronization

If you have enabled multi-client or same platform multi-instance login (for details, please refer to [Multi-device or multi-instance login on the same platform](https://trtc.io/document/33515)), the same account can log in on different devices. When the self-defined status of a user logged in on one device changes, the Chat background will send a status change notification to other logged-in devices as well.

## FAQs

### When invoking the Subscription/Cancel Subscription API, the interface prompts the error code "72001"

Error code 72001 indicates that the corresponding capability has not been enabled in the console. Please log in to the [Chat Console](https://console.trtc.io/) to turn on the corresponding feature toggle.

---
sync_node_id: '108053218073776128'
nav_path:
  - "无 UI 集成"
  - "初始化"
  - "React Native"
product: "chat"
---
## Feature Description

You **must** initialize the Chat SDK before using its features.

## Initialization

You can initialize the SDK in the following steps:
1. Prepare an `SDKAppID`.

2. Call `TencentCloudChat.create` to initialize the SDK.

3. Add SDK event listeners.

   The detailed steps are as follows.

### Preparing an SDKAppID

To perform the initialization, you must have a correct `SDKAppID`.

The `SDKAppID` uniquely identifies a Tencent Cloud Chat account. We recommend you apply for a new `SDKAppID` for each application. Messages are naturally isolated and cannot communicate between different `SDKAppID` values.

In the [Chat Console](https://console.trtc.io/), you can view all your `SDKAppID` values, and you can click **Create Application** to create an `SDKAppID`.

### Calling the initialization API

After performing the above steps, you can call `TencentCloudChat.create` to initialize the SDK.

##### **API**

【js】
``` javascript
TencentCloudChat.create(options);
```

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|SDKAppID|Number|`SDKAppID` of the chat app|
|proxyServer|String \| undefined|WebSocket proxy server|
|fileUploadProxy|String \| undefined|Image, video, and file upload proxy address (the mini-program platform does not support the use of IP addresses)|
|fileDownloadProxy|String \| undefined|Image, video, and file download proxy address (the mini-program platform does not support the use of IP addresses)|

##### **Examples**

【js】
``` javascript
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';

let options = {
  SDKAppID: 0 // Replace 0 with the `SDKAppID` of your chat application when connecting.
};
// Create an SDK instance.
// The `TencentCloudChat.create()` method returns the same instance for the same `SDKAppID`.
// The SDK instance is usually represented by `chat`.
let chat = TencentCloudChat.create(options);

// Set the SDK log output level.
// 0 - Common level. We recommend you use this level during access as it covers more logs.
// 1 - Release level. We recommend you use this log level in a production environment.
chat.setLogLevel(0); 
// chat.setLogLevel(1);

// Register the Tencent Cloud Chat upload plugin.
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
```

### Listening on events

> **Note:**
> Please call this interface to listen for events before calling the login API to avoid missing events dispatched by the SDK.
> 

##### **API**

【js】
``` javascript
chat.on(eventName, handler, context);
```

|Name|Type|Description|
|---------|---------|---------|
|eventName|String|Event names. All event names are stored in the `TencentCloudChat.EVENT` variable. If you need to view them, you can use `console.log(TencentCloudChat.EVENT)` to display all the events.|
|handler|Function|The method for handling events. When an event is triggered, this handler will be called to process it.|
|context|Object \| undefined|The expected context in which the handler executes.|

##### **Examples**

【js】
``` javascript
let onMessageReceived = function(event) {
  // event.name - TencentCloudChat.EVENT.MESSAGE_RECEIVED
  // event.data - An array to store Messages - [Message]
};
chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

### Unlistening on events

##### **API**

【js】
``` javascript
chat.off(eventName, handler, context, once);
```

|Name|Type|Description|
|---------|---------|---------|
|eventName|String|Event names. All event names are stored in the `TencentCloudChat.EVENT` variable. If you need to view them, you can use `console.log(TencentCloudChat.EVENT)` to display all the events.|
|handler|Function|The method for handling events. When an event is triggered, this handler will be called to process it.|
|context|Object \| undefined|The expected context in which the handler executes.|
|once|Boolean \| undefined|Whether to unbind only once.|

##### **Examples**

【js】
``` javascript
let onMessageReceived = function(event) {
  // event.name - TencentCloudChat.EVENT.MESSAGE_RECEIVED
  // event.data - An array to store Messages - [Message]
};
chat.off(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

## List of events that the integration side needs to listen and handle

##### SDK_READY

This event is triggered when the SDK enters the `ready` status. When SDK is ready, you can call SDK APIs such as the message sending API to use various features of the SDK.
``` javascript
let onSdkReady = function(event) {
  let message = chat.createTextMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { text: 'Hello world!'
  }});
  chat.sendMessage(message);
};
chat.on(TencentCloudChat.EVENT.SDK_READY, onSdkReady);
```

##### SDK_NOT_READY

This event is triggered when the SDK enters the `not ready` status. When SDK is not ready, you cannot use SDK features such as message sending. To use them, you need to call the `login` API to drive the SDK into the `ready` status.
``` javascript
let onSdkNotReady = function(event) {
  // chat.login({userID: 'your userID', userSig: 'your userSig'});
};
chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, onSdkNotReady);
```

##### MESSAGE_RECEIVED

This event is triggered when the SDK receives a newly pushed one-to-one message, group message, group tip, or group system message. When this event occurs, you can traverse event.data to obtain the message list and render it to the UI.
``` javascript
let onMessageReceived = function(event) {
  // event.data - An array that stores Message objects - [Message]
};
chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

##### MESSAGE_MODIFIED

This event is triggered when the SDK receives a notification for message modifications. When this event occurs, the message sender can traverse event.data to obtain the message list and update the content of the message with the same ID on the UI.
``` javascript
let onMessageModified = function(event) {
  // event.data - An array that stores modified Message objects - [Message]
};
chat.on(TencentCloudChat.EVENT.MESSAGE_MODIFIED, onMessageModified);
```

##### MESSAGE_REVOKED

This event is triggered when the SDK receives a notification indicating that messages are recalled. When this event occurs, the access side can traverse event.data to obtain data of the message recall list and render the recalled messages to the UI. For example, The peer end has recalled a message can be displayed if a message is recalled during a one-to-one conversation, and "XXX has recalled a message" can be displayed if a message is recalled during a group conversation.
``` javascript
let onMessageRevoked = function(event) {
  // event.data - An array that stores Message objects - [Message]
  // The `isRevoked` attribute value of each Message object is `true`
};
chat.on(TencentCloudChat.EVENT.MESSAGE_REVOKED, onMessageRevoked);
```

##### MESSAGE_READ_BY_PEER

This event is triggered when the SDK receives a notification indicating that messages have been read by peer.
``` javascript
let onMessageReadByPeer = function(event) {
  // event.data - An array that stores Message objects - [Message]
  // The `isPeerRead` attribute value of each Message object is `true`
};
chat.on(TencentCloudChat.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer);
```

##### MESSAGE_READ_RECEIPT_RECEIVED

This event is triggered when the SDK receives message read receipts.
``` javascript
let onMessageReadReceiptReceived = function(event) {
  // event.data - An array that stores read receipts
  const readReceiptInfoList = event.data;
  readReceiptInfoList.forEach((item) => {
    const { groupID, userID, messageID, readCount, unreadCount, isPeerRead } = item;
    // messageID - message ID
    // userID - receiver ID
    // isPeerRead - whether the message is read by peer
    // groupID - group ID
    // readCount - count of members read the message
    // unreadCount - count of members do not read the message
    const message = chat.findMessage(messageID);
    if (message) {
     if (message.conversationType === TencentCloudChat.TYPES.CONV_C2C) {
       if (message.readReceiptInfo.isPeerRead === true) {
         // message read by peer
       }
     } else if (message.conversationType === TencentCloudChat.TYPES.CONV_GROUP) {
      if (message.readReceiptInfo.unreadCount === 0) {
        // message read by all group members
      } else {
        // message.readReceiptInfo.readCount
        // If you want to find out who have read the message, please call getGroupMessageReadMemberList
      }
     }
    }
  });
}
chat.on(TencentCloudChat.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, onMessageReadReceiptReceived);

```

##### MESSAGE_EXTENSIONS_UPDATED

This event is triggered when the SDK receives a notification indicating that message extensions are updated.
``` javascript
let onMessageExtensionsUpdated = function(event) {
  const { messageID, extensions } = event.data;
  // messageID - message ID
  // extensions - list of message extensions
  extensions.forEach((item) => {
   const { key, value } = item;
  });
};
chat.on(TencentCloudChat.EVENT.MESSAGE_EXTENSIONS_UPDATED, onMessageExtensionsUpdated);
```

##### MESSAGE_EXTENSIONS_DELETED

This event is triggered when the SDK receives a notification indicating that message extensions are deleted.
``` javascript
let onMessageExtensionsDeleted = function(event) {
  const { messageID, keyList } = event.data;
  // messageID - message ID
  // keyList - list of keys which are deleted
  keyList.forEach((key) => {
   // console.log(key)
  });
};
chat.on(TencentCloudChat.EVENT.MESSAGE_EXTENSIONS_DELETED, onMessageExtensionsDeleted);
```

##### CONVERSATION_LIST_UPDATED

This event is triggered when the conversation list is updated. event.data is an array that stores the Conversation objects.
``` javascript
let onConversationListUpdated = function(event) {
  console.log(event.data); // Array that stores Conversation objects - [Conversation]
};
chat.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
```

##### TOTAL_UNREAD_MESSAGE_COUNT_UPDATED

This event is triggered when the total unread message count of all conversations updated.
``` javascript
let onTotalUnreadMessageCountUpdated = function(event) {
  console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, onTotalUnreadMessageCountUpdated);
```

##### CONVERSATION_GROUP_LIST_UPDATED

This event is triggered when the conversation group list is updated.
``` javascript
let onConversationGroupListUpdated = function(event) {
  console.log(event.data);
}
chat.on(TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED, onConversationGroupListUpdated);
```

##### CONVERSATION_IN_GROUP_UPDATED

This event is triggered when the conversations in a conversation group list updated.
``` javascript
let onConversationInGroupUpdated = function(event) {
  const { groupName, conversationList }  = event.data;
}
chat.on(TencentCloudChat.EVENT.CONVERSATION_IN_GROUP_UPDATED, onConversationInGroupUpdated);
```

##### GROUP_LIST_UPDATED

This event is triggered when the SDK group list updated. The access side can traverse event.data to obtain the group list and render it to the UI.
``` javascript
let onGroupListUpdated = function(event) {
   console.log(event.data);// Array that stores Group objects - [Group]
};
chat.on(TencentCloudChat.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated);
```

##### GROUP_ATTRIBUTES_UPDATED

This event is triggered when attributes of a group updated.
``` javascript
let onGroupAttributesUpdated = function(event) {
   const groupID = event.data.groupID
   const groupAttributes = event.data.groupAttributes
   console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
```

##### GROUP_COUNTER_UPDATED

This event is triggered when counters of a group updated.
``` javascript
let onGroupCounterUpdated = function(event) {
  const { groupID, key, value } = event.data;
};
chat.on(TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
```

##### TOPIC_CREATED

This event is triggered when a topic created in a community group.
``` javascript
let onTopicCreated = function(event) {
   const groupID = event.data.groupID; // community group ID
   const topicID = event.data.topicID; // topic ID
   console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.TOPIC_CREATED, onTopicCreated);
```

##### TOPIC_DELETED

This event is triggered when a topic removed from a community group.
``` javascript
let onTopicDeleted = function(event) {
   const groupID = event.data.groupID; // community group ID
   const topicIDList = event.data.topicIDList; // topic ID
   console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.TOPIC_DELETED, onTopicDeleted);
```

##### TOPIC_UPDATED

This event is triggered when a topic updated in a community group.
``` javascript
let onTopicUpdated = function(event) {
   const groupID = event.data.groupID; // community group ID
   const topic = event.data.topic; // the lastest topic
   console.log(event.data);
};
chat.on(TencentCloudChat.EVENT.TOPIC_UPDATED, onTopicUpdated);
```

##### PROFILE_UPDATED

This event is triggered when the profile of the current user or profiles of friends are changed. `event.data` is an array that stores Profile objects.
``` javascript
let onProfileUpdated = function(event) {
  console.log(event.data); // Array that stores Profile objects
};
chat.on(TencentCloudChat.EVENT.PROFILE_UPDATED, onProfileUpdated);
```

##### USER_STATUS_UPDATED

This event is triggered when statuses of subscribed users or statuses of friends updated(Including online status and custom status).
``` javascript
let onUserStatusUpdated = function(event) {
   console.log(event.data);
   const userStatusList = event.data;
   userStatusList.forEach((item) => {
     const { userID, statusType, customStatus } = item;
     // userID
     // statusType, described as follows:
     // TencentCloudChat.TYPES.USER_STATUS_UNKNOWN
     // TencentCloudChat.TYPES.USER_STATUS_ONLINE
     // TencentCloudChat.TYPES.USER_STATUS_OFFLINE
     // TencentCloudChat.TYPES.USER_STATUS_UNLOGINED
     // customStatus
   })
};
chat.on(TencentCloudChat.EVENT.USER_STATUS_UPDATED, onUserStatusUpdated);

```

##### BLACKLIST_UPDATED

This event is triggered when the SDK blocklist is updated.
``` javascript
let onBlacklistUpdated = function(event) {
  console.log(event.data); // Your blocklist. The value is an array that stores `userID` values.
};
chat.on(TencentCloudChat.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated);
```

##### FRIEND_LIST_UPDATED

This event is triggered when the friend list is updated.
``` javascript
let onFriendListUpdated = function(event) {
  console.log(event.data);
}
chat.on(TencentCloudChat.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated);
```

##### FRIEND_GROUP_LIST_UPDATED

This event is triggered when the friend group list is updated.
``` javascript
let onFriendGroupListUpdated = function(event) {
  console.log(event.data);
}
chat.on(TencentCloudChat.EVENT.FRIEND_GROUP_LIST_UPDATED, onFriendGroupListUpdated);
```

##### FRIEND_APPLICATION_LIST_UPDATED

This event is triggered when the friend application list is updated.
``` javascript
let onFriendApplicationListUpdated = function(event) {
  // friendApplicationList - Friend request list - [FriendApplication]
  // unreadCount - Number of unread friend requests
  const { friendApplicationList, unreadCount } = event.data;
  // Friend requests received by you (friend requests that are sent to you by others)
  const applicationSentToMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TencentCloudChat.TYPES.SNS_APPLICATION_SENT_TO_ME);
  // Friend requests sent by you (friend requests that you send to others)
  const applicationSentByMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TencentCloudChat.TYPES.SNS_APPLICATION_SENT_BY_ME);
};
chat.on(TencentCloudChat.EVENT.FRIEND_APPLICATION_LIST_UPDATED, onFriendApplicationListUpdated);
```

##### KICKED_OUT

This event is triggered when the current user is kicked offline. 
``` javascript
let onKickedOut = function(event) {
  console.log(event.data.type);
  // TencentCloudChat.TYPES.KICKED_OUT_MULT_ACCOUNT
  // The user is forcibly logged out because the same account logs in from multiple webpages on the web client
  // TencentCloudChat.TYPES.KICKED_OUT_MULT_DEVICE
  // The user is forcibly logged out because the same account logs in from multiple terminals
  // TencentCloudChat.TYPES.KICKED_OUT_USERSIG_EXPIRED
 // The signature expired
  // TencentCloudChat.TYPES.KICKED_OUT_REST_API
 // The user is forcibly logged out by the RESTful API.
};
chat.on(TencentCloudChat.EVENT.KICKED_OUT, onKickedOut);
```

##### NET_STATE_CHANGE

This event is triggered when the network status changes. 
``` javascript
let onNetStateChange = function(event) {
  console.log(event.data.type);
  // TencentCloudChat.TYPES.NET_STATE_CONNECTED - Already connected to the network
  // TencentCloudChat.TYPES.NET_STATE_CONNECTING
  // Connecting. This often occurs when the SDK must reconnect due to network jitter
  // "The current network is unstable" or "Connecting..." can be displayed at the access side based on this status
  // TencentCloudChat.TYPES.NET_STATE_DISCONNECTED
  // Disconnected. "The current network is unavailable" can be displayed at the access side based on this status
  // The SDK will continue to try to reconnect. If the user network recovers, the SDK will automatically synchronize messages.
};
chat.on(TencentCloudChat.EVENT.NET_STATE_CHANGE, onNetStateChange);
```

## Deinitialization

Destroy the SDK instance. The SDK will first log out, then disconnect the WebSocket long connection, and release resources.

【js】
``` javascript
chat.destroy();
```

**Next step,** [login and logout.](https://trtc.io/document/47970)

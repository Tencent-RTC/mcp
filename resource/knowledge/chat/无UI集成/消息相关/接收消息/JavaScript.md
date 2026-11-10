---
sync_node_id: '108053272420982784'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "接收消息"
  - "JavaScript"
product: "chat"
---
## Feature Overview

To receive messages, you need to listen for the `MESSAGE_RECEIVED` event.

## Listening for an Event

> **Note:**
> Call this API to listen for events before calling the `login` API in order to avoid missing the events delivered by the SDK.
> 

**API**
``` javascript
chat.on(eventName, handler, context);
```

**Parameters**

|Name|Type|Description|
|---------|---------|---------|
|eventName|String|Event name. All event names are stored in the `TencentCloudChat.EVENT` variable. To view all the events, use `console.log(TencentCloudChat.EVENT)`.|
|handler|Function|Event handling method. When an event is triggered, this handler will be called to handle it.|
|context|* \| undefined|The context expected for handler execution|

##### **Examples**
``` javascript
let onMessageReceived = function(event) {
  // event.data - An array that stores `Message` objects - [Message]
  // For details of Message, please refer to https://www.tencentcloud.com/document/product/1047/47990
  const messageList = event.data;
  messageList.forEach((message) => {
    if (message.type === TencentCloudChat.TYPES.MSG_TEXT) {
      // Text message
    } else if (message.type === TencentCloudChat.TYPES.MSG_IMAGE) {
      // Image message
    } else if (message.type === TencentCloudChat.TYPES.MSG_AUDIO) {
      // Audio message
    } else if (message.type === TencentCloudChat.TYPES.MSG_VIDEO) {
      // Video message
    } else if (message.type === TencentCloudChat.TYPES.MSG_FILE) {
      // File message
    } else if (message.type === TencentCloudChat.TYPES.MSG_CUSTOM) {
      // Custom message
    } else if (message.type === TencentCloudChat.TYPES.MSG_MERGER) {
      // Merged message
    } else if (message.type === TencentCloudChat.TYPES.MSG_LOCATION) {
      // Geographical location message
    } else if (message.type === TencentCloudChat.TYPES.MSG_GRP_TIP) {
      // Group tip message
    } else if (message.type === TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE) {
      // Group system notification
    }
  });
};
chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

## Canceling Event Listening

**API**
``` javascript
chat.off(eventName, handler, context);
```

**Parameters**

|Name|Type|Description|
|---------|---------|---------|
|eventName|String|Event name. All event names are stored in the `TencentCloudChat.EVENT` variable. To view all the events, use `console.log(TencentCloudChat.EVENT)`.|
|handler|Function|Event handling method. When an event is triggered, this handler will be called to handle it.|
|context|* \| undefined|The context expected for handler execution|

##### **Examples**
``` javascript
let onMessageReceived = function(event) {
  // event.name - TencentCloudChat.EVENT.MESSAGE_RECEIVED
  // event.data - An array that stores `Message` objects - [Message]
};
chat.off(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

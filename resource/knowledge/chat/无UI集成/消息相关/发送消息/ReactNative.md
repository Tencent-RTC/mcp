---
sync_node_id: '108053269271060480'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "发送消息"
  - "React Native"
product: "chat"
---
### Creating a text message

This API is used to create a text message. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send a text message instance.

##### **API**

【js】
``` javascript
chat.createTextMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> (end-to-end conversation) or <code>TencentCloudChat.TYPES.CONV_GROUP</code> (group conversation) |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |
| receiverList | Array \\| undefined | List of group members for targeted message reception (not supported for community and live broadcast groups) |
| isSupportExtension | Boolean | Whether message extension is supported, true for supported, false for not supported (you need to purchase the <a href="https://console.trtc.io/subscription/buy/chat?packType=pro">Pro edition 、Pro Plus edition or Enterprise edition</a>) |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|text|String|Message text content|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
// Send text messages, same for Web and Mini Program
// 1. Create a message instance, the instance returned by the interface can be displayed
let message = chat.createTextMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  // Message priority for group chat. If the message frequency limit is exceeded in a group, the backend will prioritize high-priority messages
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    text: 'Hello world!'
  },
  // If you need read receipts for your messages, you need to purchase the flagship package and set needReadReceipt to true when creating the message
  needReadReceipt: true
  // Custom message data, saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled
  // cloudCustomData: 'your cloud custom data'
});
// 2. Send a message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

``` javascript
// Sending a Targeted Group Message
// Note: Targeted group messages are excluded from the unread count of a conversation. `receiverList` supports up to 50 recipients.
let message = chat.createTextMessage({
  to: 'group1',
  conversationType: TencentCloudChat.TYPES.CONV_GROUP,
  payload: {
    text: 'Hello world!'
  },
  // To send a targeted group message, you must purchase the Enterprise Edition Package and specify the message receivers through receiverList when creating the message
  receiverList: ['user0', 'user1']
});
// Send a message.
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating an @mention Message

TThis API is used to create a text message mentioning someone with @. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send a text message instance.

> **Notes:**
> 
> 1. This API is only for group chats, and @ALL is not supported in communities and topics under communities.
> 2. Creating group @ messages does not support specifying message recipients.

##### **API**

【js】
``` javascript
chat.createTextAtMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> (end-to-end conversation) or <code>TencentCloudChat.TYPES.CONV_GROUP</code> (group conversation) |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|text|String|Message text content|
|atUserList|Array|The list of users to @. If you need to @ALL, pass in [TencentCloudChat.TYPES.MSG_AT_ALL](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-TYPES.html#.MSG_AT_ALL). For example, if you want to @ notify both denny and lucy in this text message, and also @ everyone, pass ['denny', 'lucy', TencentCloudChat.TYPES.MSG_AT_ALL] to atUserList.|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn//Message.html)

##### **Example**

【js】
``` javascript
// Send text messages, same for Web and Mini Program
// 1. Create a message instance, the instance returned by the interface can be displayed
let message = chat.createTextAtMessage({
  to: 'group1',
  conversationType: TencentCloudChat.TYPES.CONV_GROUP,
  // Message priority for group chat
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    text: '@denny @lucy @everyone Dinner tonight, please reply 1 if received',
    // 'denny' and 'lucy' are userIDs, not nicknames
    atUserList: ['denny', 'lucy', TencentCloudChat.TYPES.MSG_AT_ALL]
  },
  // Custom message data, saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled
  // cloudCustomData: 'your cloud custom data'
});
// 2. Send a message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating an image message

The API to create an image message returns a message instance, which can be sent using the [send message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send an image message. For sending image messages in React Native, you need to integrate [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker).
``` bash
npm install react-native-image-picker --save
```

##### **API**

【js】
``` javascript
chat.createImageMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is described in the following table:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | Message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| onProgress | function | Callback function to get upload progress |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| file | HTMLInputElement \\| Object \\| File | DOM node for selecting images (Web) or File object (Web)<br>The success callback parameter of the wx.chooseImage interface. The SDK will read the data and upload the image. |

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
import {launchImageLibrary} from 'react-native-image-picker';
// 1. Select an Image
launchImageLibrary({
  mediaType: 'photo',
  selectionLimit: 1,
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createImageMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Image
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // Sending succeeded.
    console.log(imResponse);
  }).catch(function(imError) {
    // Sending fails.
    console.warn('sendMessage error:', imError);
  });
});
```

【js】
``` javascript
import {launchCamera} from 'react-native-image-picker';
// 1. Take Photo
launchCamera({
  mediaType: 'photo',
  cameraType: 'back',
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createImageMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Image
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // Sending succeeded.
    console.log(imResponse);
  }).catch(function(imError) {
    // Sending fails.
    console.warn('sendMessage error:', imError);
  });
});
```

### Creating an Audio Message

The interface for creating an audio message instance. This interface returns a message instance, which can be used to call the [Sending Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) interface when you need to send an audio message. For sending audio messages in React Native, you need to integrate [react-native-audio-recorder-player](https://www.npmjs.com/package/react-native-audio-recorder-player).
``` bash
npm install react-native-audio-recorder-player --save
```

##### **API**

【js】
``` javascript
chat.createAudioMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | Message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_GROUP</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|file|Object|Audio file obtained after recording|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
import AudioRecorderPlayer, {AVEncodingOption} from 'react-native-audio-recorder-player';
 
// Record the recording duration, unit: ms
let duration = 0;
// Record recording file path
let uri = '';

// 1. Start recording
const onStartRecord = async () => {
  await audioRecorderPlayer.startRecorder('test.aac',{
    VFormatIDKeyIOS: AVEncodingOption.aac,
  });
  audioRecorderPlayer.addRecordBackListener((e: any) => {
    duration = e.currentPosition;
  });
};
// 2. Stop recording
const onStopRecord = async () => {
  uri = await audioRecorderPlayer.stopRecorder();
  audioRecorderPlayer.removeRecordBackListener();
};
// 3. Send voice
const file = {
  uri: uri,
  duration: duration,
};
let message = chat.createAudioMessage({
  to: 'user1',
  conversationType: 'C2C',
  payload: {
    file: file,
  },
  // React Native does not support upload progress callback
  // onProgress: function(event) { console.log('file uploading:', event) }
});
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating a video message

The interface for creating a video message instance. This interface returns a message instance, which can be used to call the [Sending Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) interface when you need to send a video message. For sending video messages in React Native, you need to integrate [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker).
``` bash
npm install react-native-image-picker --save
```

##### **API**

【js】
``` javascript
chat.createVideoMessage(options);
```

**Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | Message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_GROUP</code><br>or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of payload is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|file|HTMLInputElement \| File \| Object|Data fields of custom messages|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
import {launchImageLibrary} from 'react-native-image-picker';
// 1. Select a Video
launchImageLibrary({
  mediaType: 'video',
  selectionLimit: 1,
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createVideoMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Video
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // Sending succeeded.
    console.log(imResponse);
  }).catch(function(imError) {
    // Sending fails.
    console.warn('sendMessage error:', imError);
  });
});
```

【js】
``` javascript
import {launchCamera} from 'react-native-image-picker';
// 1. Record Video
launchCamera({
  mediaType: 'video',
  cameraType: 'back',
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createVideoMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Video
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // Sending succeeded.
    console.log(imResponse);
  }).catch(function(imError) {
    // Sending fails.
    console.warn('sendMessage error:', imError);
  });
});
```

### Creating a custom message

This API is used to create a custom message instance. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send a custom message instance. When the capabilities provided by the SDK do not meet your needs, you can use custom messages for personalized customization.

##### **API**

【js】
``` javascript
chat.createCustomMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_GROUP</code><br>or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|data|String|Data fields of custom messages|
|description|String|// Field that describes the custom message|
|extension|String|// Field that extends the custom message|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
// Example: Implementing dice rolling using custom messages
// 1. Define a random function
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 2. Create a message instance. The instance returned by the interface can be displayed on the screen
let message = chat.createCustomMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  // Message priority for group chat
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_HIGH,
  payload: {
    data: 'dice', // Identifies the message as a dice type message
    description: String(random(1,6)), // Get dice points
    extension: ''
  }
});
// 3. Send a message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating an emoji message

This API is used to create an emoji message instance. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send an emoji message instance.

##### **API**

【js】
``` javascript
chat.createFaceMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|index|Number|Emoji index, user-defined|
|data|String|Extra data|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
// Send emoji messages, same for Web and Mini Program.
// 1. Create a message instance, the instance returned by the interface can be displayed
let message = chat.createFaceMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  // Message priority for group chat
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    index: 1, // Number Emoji index, user-defined
    data: 'tt00' // String Extra data
  },
  // Custom message data, saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled
  // cloudCustomData: 'your cloud custom data'
});
// 2. Send a message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating a file message

The interface for creating a file message. This interface returns a message instance, which can be used to call the [Sending Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) interface when you need to send a file message. For sending file messages in React Native, you need to integrate [react-native-document-picker](https://www.npmjs.com/package/react-native-document-picker).
``` bash
npm install react-native-document-picker --save
```

##### **API**

【js】
``` javascript
chat.createFileMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| onProgress | function | Callback function to get upload progress |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|file|HTMLInputElement \| File \| Object|The DOM node for selecting files (Web) or File object (Web) or Object (success callback parameter of the uni.chooseFile API). The SDK will read the data and upload the file.|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
import DocumentPicker from 'react-native-document-picker';
 
// 1. Select File
DocumentPicker.pick({
  type: [DocumentPicker.types.allFiles],
}).then((result) => {
 const file = result[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createFileMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send File
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // Sending succeeded.
    console.log(imResponse);
  }).catch(function(imError) {
    // Sending fails.
    console.warn('sendMessage error:', imError);
  });
});
```

### Creating a location message

This API is used to create a location message. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send a location message.

##### **API**

【js】
``` javascript
chat.createLocationMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|description|String|Location description information|
|longitude|Number|Longitude|
|latitude|Number|Latitude|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
// Send location messages, same for Web and Mini Program
// 1. Create a message instance, the instance returned by the interface can be displayed
let message = chat.createLocationMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  // Message priority for group chat
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
  payload: {
    description: 'Tencent Building, 10000 Shennan Avenue, Shenzhen',
    longitude: 113.941079, // Longitude
    latitude: 22.546103 // Latitude
  }
});
// 2. Send a message
let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

### Creating a Merged Message

This API is used to create a merged message. It returns a message instance, which can be sent by calling the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API when you need to send a merged message.

> **Notes:**
> 
> 1. Unable to merge messages that failed to be sent. If the message list contains a message that failed to be sent, the API will report an error.

##### **API**

【js】
``` javascript
chat.createMergerMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| to | String | The userID or groupID of the message recipient |
| conversationType | String | The conversation type, with values <code>TencentCloudChat.TYPES.CONV_C2C</code> or <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| priority | String | Message priority. If the message frequency limit is exceeded within the group, the backend will prioritize delivering high-priority messages. Supported enumeration values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled |

The description of `payload` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|messageList|Array|Merged message list|
|title|String|Title of merged messages, for example, "Chat History of the Talent Center in the Greater Bay Area"|
|abstractList|String|abstractList: Different message types can have different abstract information. For example, a text message can be set as: sender: text, an image message can be set as: sender: [Image], and a file message can be set as: sender: [File].|
|compatibleText|String|compatible text: If the lower version SDK does not support merged messages, a text message will be received by default. The content of the text message is ${compatibleText}, required.|

##### **Return Value**

[Message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/Message.html)

##### **Example**

【js】
``` javascript
// 1. Forward group chat messages to c2c session
// message1 message2 message3 are group chat messages
let mergerMessage = chat.createMergerMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  payload: {
    messageList: [message1, message2, message3],
    title: 'Chat records of the Greater Bay Area Front-end Talent Center',
    abstractList: ['allen: 666', 'iris: [Image]', 'linda: [File]'],
    compatibleText: 'Upgrade your Chat SDK to v2.10.1 or later to view this message.'
  },
  // Custom message data, saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled
  // cloudCustomData: 'your cloud custom data'
});

// 2. Send a message
let promise = chat.sendMessage(mergerMessage);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

## Downloading a Merged Message

This API is used to download a merged message. When the merged message sent by the sender is large in size, the SDK will store it in the cloud, and the message receiver needs to download it from the cloud before viewing it.

##### API

【js】
``` javascript
chat.downloadMergerMessage(message);
```

##### **Parameters**

|Parameters|Type|Description|
|---------|---------|---------|
|message|Message|Message instance|

##### **Return Value**

`Promise`

##### **Example**

【js】
``` javascript
// The presence of downloadKey indicates that the received merged message is stored in the cloud and needs to be downloaded first.
if (message.type === TencentCloudChat.TYPES.MSG_MERGER && message.payload.downloadKey !== '') {
  let promise = chat.downloadMergerMessage(message);
  promise.then(function(imResponse) {
    // After the download is successful, the SDK will update information such as message.payload.messageList.
    console.log(imResponse.data);
  }).catch(function(imError) {
    // Download failed
    console.warn('downloadMergerMessage error:', imError);
  });
}
```

## Forwarding Messages One by One

To forward a single message, create a message identical to the original message through the [createForwardMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createForwardMessage) API first, and then call the [sendMessage](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#sendMessage) API to send the message.

> **Notes:**
> 
> 1. It supports forwarding a single message or several messages one by one.

##### **API**

【js】
``` javascript
chat.createForwardMessage(message);
```

##### **Parameters**

|Parameters|Type|Description|
|---------|---------|---------|
|message|Message|Message instance|

##### **Example**

【js】
``` javascript
let forwardMessage = chat.createForwardMessage({
  to: 'user1',
  conversationType: TencentCloudChat.TYPES.CONV_C2C,
  // Message priority for group chat
  // priority: TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL,
  payload: message, // Message instance for the received or sent message
  // Custom message data, saved in the cloud, will be sent to the peer end, and can still be pulled after the application is uninstalled and reinstalled
  // cloudCustomData: 'your cloud custom data'
});
// 2. Send a message
let promise = chat.sendMessage(forwardMessage);
promise.then(function(imResponse) {
  // Sending succeeded.
  console.log(imResponse);
}).catch(function(imError) {
  // Sending fails.
  console.warn('sendMessage error:', imError);
});
```

## Sending Message

The API for sending messages requires you to first call the following APIs to create a message instance, and then call this API to send the message instance.
- [Create a text message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createTextMessage)

- [Create an @ message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createTextAtMessage)

- [Create an image message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createImageMessage)

- [Create an audio message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createAudioMessage)

- [Create a video message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createVideoMessage)

- [Create a custom message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createCustomMessage)

- [Create an emoji message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createFaceMessage)

- [Create a file message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createFileMessage)

- [Create a location message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createLocationMessage)

- [Create a merged message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createMergerMessage)

- [Create a forwarding message](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createForwardMessage)

   > **Notes:**
   > 
   > - To send a message instance using this interface, the SDK must be in the ready state; otherwise, the message instance cannot be sent. The SDK state can be determined by listening to the following event: `TencentCloudChat.EVENT.SDK_READY` - triggered when the SDK is in the ready state.
   > - `TencentCloudChat.EVENT.SDK_NOT_READY` - triggered when the SDK is in the not ready state.
   > - To receive new messages for single chat, group chat, group tips, and group system notifications, listen to the event [TencentCloudChat.EVENT.MESSAGE_RECEIVED](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-EVENT.html#.MESSAGE_RECEIVED).
   > - Messages sent by this instance will not trigger the event [TencentCloudChat.EVENT.MESSAGE_RECEIVED](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-EVENT.html#.MESSAGE_RECEIVED). Messages sent from the same account on other devices (or via REST API) will trigger the event [TencentCloudChat.EVENT.MESSAGE_RECEIVED](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/module-EVENT.html#.MESSAGE_RECEIVED).
   > - Offline push is only applicable to terminals (Android or iOS), Web is not supported.
   > - onlineUserOnly and messageControlInfo cannot be used simultaneously.
   > - Supports excluding unread counts for general community and topic messages.
   > - Sending messages to [system conversation] will return error code 2106.
   > - The message body size is limited to 12 KB and cannot be adjusted. Exceeding this limit will cause the message to fail to send, with error code 80002.
   > - Log in to [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Under this section, enable **Stranger Direct Message Restrictions**. When this option is activated, only friends can send messages to each other. If a user tries to send a message to someone who is not their friend, the SDK returns [error code 20009](https://intl.cloud.tencent.com/document/product/1047/34348).

   
   
   【js】
   ``` javascript
   chat.sendMessage(options);
   ```

##### **Parameters**

The `options` parameter is of the `Object` type. The attribute it contains is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|message|Message|Message instance|
|options|Object|Message sending options (message content container), optional|

The description of `options` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|onlineUserOnly|Boolean|Indicator of whether the message is sent only to online users, default value is false; if set to true, the message will neither be stored in roaming nor counted as unread, and will not be pushed offline to the recipient. Suitable for scenarios such as sending broadcast notifications or other unimportant prompt messages. This option is not supported when sending messages in AVChatRoom.|
|offlinePushInfo|Object|[Offline Push](https://www.tencentcloud.com/document/product/1047/33525) configuration|
|messageControlInfo|Object|Message control configuration|

The description of `offlinePushInfo` is as follows:

|Parameters|Type|Description|
|---------|---------|---------|
|disablePush|Boolean|true to disable offline push; false to enable offline push (default)|
|disableVoipPush|Boolean|true to disable voip push (default); false to enable voip push (enabling voip push requires offline push to be enabled)|
|title|String|Offline push title, this field is shared by iOS and Android|
|description|String|Offline push content. This field will override the offline push display text of the message instance. If a custom message is sent, this description field will override message.payload.description. If neither description nor message.payload.description is filled, the recipient will not receive the offline push of this custom message.|
|extension|String|Offline push pass-through content|
|androidInfo|Object|Android push configuration|
|apnsInfo|Object|iOS push configuration|

The description of `androidInfo` is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| sound | String | Android offline push sound settings. Only supported by Huawei, Xiaomi, and Google.<br>- For Xiaomi phones with Android 8.0 and above, you must set androidInfo.XiaoMiChannelID. Please refer to: <a href="https://dev.mi.com/console/doc/detail?pId=1278%23_3_0#_3_0">Custom ringtone for Xiaomi</a>.<br>- Google Phone FCM Push on Android 8.0 and above systems requires setting androidInfo.FCMChannelID for sound notifications.<br>- Custom ringtone requires setting the sound file path. For example: androidInfo.sound = "shake.xxx"<br>Corresponding to the uniapp "nativeResources/android/res/raw/shake.xxx" audio file.<br>Corresponding to the native application's "/res/raw/shake.xxx" audio file. |
| XiaoMiChannelID | String | Notification category (Channel) adaptation field for Xiaomi phones with MIUI 10 and above. |
| OPPOChannelID | String | NotificationChannel adaptation fields for OPPO phones with Android 8.0 and above. |
| FCMChannelID | String | Notification channel fields for Google phones with Android 8.0 and above. |
| VIVOClassification | Number | VIVO phone push message classification, 0: operational message, 1: system message, default is 1. |
| VIVOCategory | String | Used to identify message type on VIVO phones. |
| HuaWeiCategory | String | Used to identify message type on Huawei phones. |
| HuaWeiImage | String | Huawei push notification bar notification image URL, supported from v3.4.1.<br>- The protocol used must be HTTPS, example value: https://example.com/image.png<br>- Image files must be smaller than 512 KB, with recommended dimensions of 40dp x 40dp and a corner radius of 8dp. Images exceeding the recommended specifications may be compressed or not fully displayed. Recommended formats are JPG/JPEG/PNG. |
| HonorImage | String | Honor push notification bar notification image URL, supported from v3.4.1.<br>- The protocol used must be HTTPS, example value: https://example.com/image.png<br>- Icon files must be smaller than 100 KB, with recommended dimensions of 160px x 160px and a corner radius of 32px. Icons exceeding the recommended specifications may be compressed or not fully displayed. |
| GoogleImage | String | Google push notification bar notification image URL, supported from v3.4.1.<br>- The protocol used must be HTTPS, example value: https://example.com/image.png<br>- Icon files must be smaller than 1 MB. Icons exceeding the recommended specifications may be compressed or not fully displayed. |

 The description of `apnsInfo` is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| sound | String | iOS offline push sound settings.<br>- When apnsInfo.sound = TencentCloudChat.TYPES.IOS_OFFLINE_PUSH_NO_SOUND, it means no sound will be played upon receiving.<br>- When apnsInfo.sound = TencentCloudChat.TYPES.IOS_OFFLINE_PUSH_DEFAULT_SOUND, it means the system sound will be played upon receiving.<br>- Custom ringtone requires setting the sound file path. For example: apnsInfo.sound = "shake.xxx"<br>Corresponding to the uniapp "nativeResources/ios/Resources/shake.xxx" file, uniapp must be a release package.<br>Corresponding to the native Xcode project's "shake.xxx" audio file. |
| ignoreIOSBadge | Boolean | Offline push ignores badge count (effective only for iOS), default is false. When set to true, this message will not increase the app icon's unread count on the iOS receiving end. |
| disableVoipPush | Boolean | true to disable voip push (default); false to enable voip push (enabling voip push requires offline push to be enabled) |
| image | String | Identifies the APNs notification bar notification image URL. When the client receives this field, it can display the image in the popup by downloading the image resource. Supported from v3.4.1.<br>- The protocol used must be HTTPS, example value: https://example.com/image.png<br>- Supports JPEG, GIF, PNG, size not exceeding 10 MB.<br>- The mutable-content attribute needs to be enabled in the IM console to support iOS 10 Service Extension features.<br>- The key value of the resource is "image". |

The description of `messageControlInfo` is as follows:
| Parameters | Type | Description |
| --- | --- | --- |
| excludedFromUnreadCount | Boolean | true: The message does not update the conversation unreadCount (message stored in roaming), default value is false. |
| excludedFromLastMessage | Boolean | true: The message does not update the conversation lastMessage (message stored in roaming), default value is false. |
| excludedFromContentModeration | Boolean | Whether the message bypasses content moderation (cloud moderation).<br>The excludedFromContentModeration setting is only effective after enabling the [cloud moderation] feature. Set to true to bypass content moderation, set to false to pass content moderation. |

##### **Return**

`Promise`

##### **Example**

【js】
``` javascript
// If the recipient is offline, the message will be stored for roaming and an offline push will be triggered (when the recipient's app is in the background or the process is killed).
// The title and content of the offline push use default values.
// For details on offline push, please refer to https://www.tencentcloud.com/document/product/1047/33525
chat.sendMessage(message);
```

【js】
``` javascript
chat.sendMessage(message, {
  onlineUserOnly: true // If the recipient is offline, the message will not be stored for roaming and will not trigger an offline push
});
```

【js】
``` javascript
chat.sendMessage(message, {
  offlinePushInfo: {
    disablePush: true // If the recipient is offline, the message will be stored for roaming but will not trigger an offline push
  }
});
```

【js】
``` javascript
chat.sendMessage(message, {
  // If the recipient is offline, the message will be stored for roaming and an offline push will be triggered (when the recipient's app is in the background or the process is killed).
  // The access side can customize the title and content of offline push
  offlinePushInfo: {
    title: '', // Offline push title
    description: '', // Offline push content
    androidOPPOChannelID: '' // Offline push setting for OPPO phones with system 8.0 and above channel ID
  }
});
```

【js】
``` javascript
chat.sendMessage(message, {
  messageControlInfo: {
    excludedFromUnreadCount: true, // The message does not update the conversation unreadCount (message stored in roaming)
    excludedFromLastMessage: true // The message does not update the conversation lastMessage (message stored in roaming)
  }
});
```

``` javascript
// The message bypasses content moderation
chat.sendMessage(message, {
  messageControlInfo: {
    excludedFromContentModeration: true,
  }
});
```

``` javascript
// Supports VoIP push
chat.sendMessage(message, {
  offlinePushInfo: {
    disablePush: false,
    disableVoipPush: false
  }
});
```

## Getting Device Permissions

React Native requires relevant device permissions to send image, video, and file messages.

【Android】

In the android directory, find app/src/main/AndroidManifest.xml and add the following permissions:
``` bash
 <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.RECORD_AUDIO" />
```

【iOS】

In the ios directory, find Info.plist and add the following permissions:
``` bash
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your album to select photos</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to record audio</string>
```

## Interface Limitations
| Features | Restriction Item | Explanation |
| --- | --- | --- |
| One-to-one chat/Group chat | Content length | The maximum length of a single one-to-one or group chat message is 12K. |
| Sending frequency | One-to-one chat messages: No limit for client-sent messages; REST API sent messages have frequency limits.<br>Group chat messages: Limited to 40 messages per second per group (applies to all group types and all platform interfaces). Frequency limits in different groups do not affect each other. | |
| Receiving frequency | No limit for both one-to-one and group chats. |  |
| Individual File Size | When sending file messages, the SDK supports a maximum individual file size of 100 MB. |  |

> **Notes:**
> 
> - When the number of messages exceeds the limit, the backend prioritizes messages with relatively higher priority. Messages with the same priority are sorted randomly. If the number of high-priority messages sent in a second exceeds 40, high-priority messages will also be discarded.
> - A message that has been restricted by frequency control is not delivered or stored in the message history, but a success response will be returned to the sender. [Before Group Message Is Sent](https://www.tencentcloud.com/zh/document/product/1047/34374) callback is triggered, but [After a Group Message Is Sent](https://www.tencentcloud.com/zh/document/product/1047/34375) callback is not triggered.
> - The default frequency limit for calling the REST API to send group messages is 200 times/second, which is different from the aforementioned "40 messages/second per group" concept. Please distinguish between them.

For more restrictions, see the document [Limits](https://www.tencentcloud.com/zh/document/product/1047/34381).

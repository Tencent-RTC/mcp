---
sync_node_id: '159395721007230976'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "群 @ 消息"
  - "JavaScript"
product: "chat"
---
## Feature Overview

The sender listens for the characters in the input box. When the user enters @, the group member selection UI will pop up. After the target group members are selected, the message will be displayed in the input box in the format of `"@A @B @C......"`, which can be further edited before sent.
In the group chat list of the receiver's conversation UI, the identifier `"someone@me"` or `"@all"` will be displayed to remind the user that the user was mentioned by someone in the group chat.

> **Note**
>  Currently, only text @ messages are supported.
> 

## UI Display

## Sending a Group @mention Message
1. The sender listens for the text input box on the chat UI and launches the group member selection UI. After group members are selected, the ID and nickname information of the members is called back.

2. The sender calls the `createTextAtMessage` API to create a group @ message.

3. The sender calls `sendMessage`to send the created @ message object.

##### API
``` javascript
chat.createTextAtMessage(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| to | String | <code>groupID</code> of the message receiver |
| conversationType | String | Conversation type, which must be <code>TencentCloudChat.TYPES.CONV_GROUP</code> |
| payload | Object | Message content container |
| cloudCustomData | String | Custom message data, which is saved in the cloud, will be sent to the receiver, and can still be pulled after the application is uninstalled and reinstalled. |
| priority | String | Message priority. If messages in a group exceed the frequency limit, the backend will deliver high-priority messages first. Supported enumerated values:<br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_HIGH</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_NORMAL (default)</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOW</code><br>- <code>TencentCloudChat.TYPES.MSG_PRIORITY_LOWEST</code> |

The `payload` is as described below:

|Name|Type|Description|
|---------|---------|---------|
|text|String|Message text content|
|atUserList|Array.<String>|The list of users who need to be @mentioned. If you need to @ALL, please pass in `TencentCloudChat.TYPES.MSG_AT_ALL`. For example, suppose this text message wants to @mention denny and lucy, while also wanting to @mention everyone, `atUserList` would be passed as `['denny', 'lucy', TencentCloudChat.TYPES.MSG_AT_ALL]`.|

##### **Return value**

`Promise`

##### **Examples**
``` javascript
let message = chat.createTextAtMessage({
  to: 'group1',
  conversationType: TencentCloudChat.TYPES.CONV_GROUP,
  payload: {
    text: '@denny @lucy Dinner gathering tonight, reply with 1 if you are coming.',
    atUserList: ['denny', 'lucy', TencentCloudChat.TYPES.MSG_AT_ALL] // 'denny' 'lucy' are both userID
  },
  // cloudCustomData: 'your cloud custom data'
});

let promise = chat.sendMessage(message);
promise.then(function(imResponse) {
  console.log(imResponse);
}).catch(function(imError) {
  console.warn('sendMessage error:', imError);
});
```

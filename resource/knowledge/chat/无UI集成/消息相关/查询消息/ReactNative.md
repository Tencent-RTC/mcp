---
sync_node_id: '108053274251796480'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "查询消息"
  - "React Native"
product: "chat"
---
## Feature Overview

You can call `findMessages` to query a local message by `messageID`.
1. Only local messages can be queried, for example, received messages or historical messages pulled by API.

2. Audio-video group (AVChatRoom) messages cannot be queried, as they are not saved locally.

   You can call `searchCloudMessages` to search for cloud messages(recommended).

## UI Display
|  |  |
| --- | --- |

## Find A Local Message

> **Note:**
> 1. This interface queries the messages stored locally through `getMessageList`.

##### **API**

【js】
``` javascript
chat.findMessage(messageID);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|messageID|String|Message ID|

##### **Return value**

[Message](https://web.sdk.qcloud.com/im/doc/en//Message.html) or `null`.

##### **Examples**

【js】
``` javascript
let message = chat.findMessage('144115217363870632-1647417469-77069006');
if (message) {
  // Read the attributes of `message`, such as `readReceiptInfo`
}
```

### Search cloud messages

> **Note：**
> 1. This feature is a value-added service, and you need to [purchase the cloud search plugin](https://console.trtc.io/chat/plugin/TUICloudSearch).
> 2. This interface has a local rate limit of 2 times per second.
> 3. When searching for messages in [All Conversations], if the number of matching messages messageCount > 1, the interface returns an empty messageList []. You can display [`${messageCount`} ]related records on the UI. If you want to highlight the matching messages, please refer to [Specified Search] to highlight the returned messageList.
> 4. When searching for messages in [All Conversations], if the number of matching messages in a conversation = 1, then messageList is the matching message.
> 5. Community, topic, and live group chats do not support searching cloud messages.

##### **API**

【js】
``` javascript
chat.searchCloudMessages(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| keywordList | Array.<String> | Keyword list, supporting up to 5 keywords. When neither the message sender nor the message type is specified, the keyword list must not be empty; otherwise, the keyword list can be empty. |
| keywordListMatchType | String | Keyword list matching type<br>- or: "or" relationship search (default)<br>- and: "and" relationship search |
| senderUserIDList | Array.<String> | Specify messages sent by userID, supporting up to 5 IDs. |
| messageTypeList | Array.<String> | Specify the collection of message types to search for, with the default being to search all types.<br>When not provided, it indicates searching for all supported types of messages (<code>TencentCloudChat.TYPES.MSG_FACE</code>, <code>TencentCloudChat.TYPES.MSG_GRP_TIP</code>, and <code>TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE</code> are not supported).<br>For specific values when provided.TYPES</code>. |
| conversationID | String | Search "All Conversations" or "Specified Conversations". If not specified, it means all conversations. Default: All Conversations. Conversation ID composition:<br>- C2C${userID} (one-to-one chat)<br>- GROUP${groupID} (group chat) |
| timePosition | Number | The starting time point of the search. The default is 0, which means searching from now. Unit: seconds |
| timePeriod | Number | The past time range from the starting time point, in seconds. The default is 0, which means no time limit. Passing 24 * 60 * 60 represents the past day. |
| cursor | String | The starting position of each cloud search. Do not pass in the cursor for the first search; when continuing the search, fill in the value of the cursor returned by the last call to the searchCloudMessages interface.<br>Note: The cursor is valid for 2 minutes during a full search. |

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.searchCloudMessages({
   keywordList: ['hello', 'where are you'],
});
```

【js】
``` javascript
let promise = chat.searchCloudMessages({
   keywordList: ['hello', 'where are you'],
   keywordListMatchType: 'and',
});
```

【js】
``` javascript
let promise = chat.searchCloudMessages({
   keywordList: ['hello', 'where are you'],
   senderUserIDList: ['user1', 'user2'],
});
```

【js】
``` javascript
let promise = chat.searchCloudMessages({
   keywordList: ['hello', 'where are you'],
   messageTypeList: [TencentCloudChat.TYPES.MSG_TEXT, TencentCloudChat.TYPES.MSG_CUSTOM],
});
```

``` javascript
let promise = chat.searchCloudMessages({
   keywordList: ['hello', 'where are you'],
   timePosition: Number((new Date().getTime()/1000).toFixed(0)),
   timePeriod: 24 * 60 * 60,
});
promise.then(function(imResponse) {
   const { totalCount, cursor, searchResultList } = imResponse.data;
   // The total number of all conversations where messages meet the search criteria.
   console.log(totalCount);
   // The starting position for the next cloud search. If there is no next position, it indicates that the search result retrieval is complete.
   console.log(cursor);
   // Messages that meet the search criteria are grouped by conversation ID and returned in pages.
   console.log(searchResultList); 
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID);
      console.log(messageCount);。
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // Search message failed
});
```

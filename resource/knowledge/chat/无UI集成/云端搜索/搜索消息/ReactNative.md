---
sync_node_id: '164409059228512256'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索消息"
  - "React Native"
product: "chat"
---
## Feature Description

Search cloud messages to help users quickly locate and index related messages based on keywords. Through this API, users can efficiently find specific message content, improving the speed and accuracy of information retrieval.

> **Note:**
> - The cloud message search feature is only available to **Pro Plus and Enterprise** customers and can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - The cloud message search feature is supported from **v3.1.0**.
> - This API is locally limited to 2 calls per second.
> - Communities, topics, and live broadcast groups do not support cloud message search.
> - Search messages in **all conversations**:
> - If the number of matched messages messageCount > 1, the API returns messageList as []. You can display [${messageCount} relevant records] on the UI. If you want to highlight the matched messages, refer to searching in the specified conversation and highlight the messageList returned by the API.
> - If the number of matched messages in a conversation = 1, the messageList contains the matched message.

## Search cloud messages

##### API
``` javascript
chat.searchCloudMessages(options);
```

##### Parameters

The options parameter is of the Object type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| keywordList | Array \\| undefined | Keyword list, support up to 5 keywords.<br><strong>Note:</strong><br>When the message sender <code>senderUserIDList</code> and the message type <code>messageTypeList</code> are not specified, the keyword list must be non-empty; otherwise, the keyword list can be empty. |
| keywordListMatchType | String \\| undefined | Match type of the keyword list<br>- or: relational search ("or" relationship) (default)<br>- and: relational search ("and" relationship) |
| senderUserIDList | Array \\| undefined | Messages sent by specified userID, support up to 5. |
| messageTypeList | Array \\| undefined | Set of the specified message types to be searched for, default is all types.<br>- If not passed, it means searching for all supported message types (<code>TencentCloudChat.TYPES.MSG_FACE</code>, <code>TencentCloudChat.TYPES.MSG_GRP_TIP</code>, and <code>TencentCloudChat.TYPES.MSG_GRP_SYS_NOTICE</code> are not supported). |
| conversationID | String \\| undefined | Search "all conversations" or "specified conversations". If not passed, it means all conversations. Default: all conversations.<br>Conversation ID formation method:<br>- <code>C2C${userID}</code> (one-to-one chat)<br>- <code>GROUP${groupID}</code> (group chat)<br>- Communities, topics, and live broadcast groups do not support cloud message search. |
| timePosition | Number \\| undefined | The start time point for the search. The default is 0, which means searching from now, in seconds. |
| timePeriod | Number \\| undefined | The time period from the start time point, in seconds. The default is 0, which means no time limit. Passing 24 * 60 * 60 means the past day. |
| cursor | String \\| undefined | The starting position of each cloud search. Do not pass <code>cursor</code> for the first search. For subsequent searches, pass the value of <code>cursor</code> returned by the previous call to the <code>searchCloudMessages</code> API.<br><strong>Note:</strong><br>The cursor is valid for 2 minutes during full text search. |

##### **Return Value**

`Promise`
| Name | Type | Description |
| --- | --- | --- |
| totalCount | Number | - If the specified conversation is searched, the total number of messages that meet the search criteria will be returned.<br>- If all sessions are searched, the total number of sessions containing messages that meet the search criteria will be returned. |
| searchResultList | Array | Messages that meet the search criteria are grouped by conversation ID. |
| cursor | String | The cursor needed for calling the search API to continue pulling. |

 Here, `searchResultList` is a list that contains the search result objects. The parameters are as described below:
| Name | Type | Description |
| --- | --- | --- |
| conversationID | String | Conversation ID. |
| messageCount | Number | The total number of messages matching the criteria found in the current conversation. |
| messageList | Array | The list of all messages that meet the search criteria in the current conversation.<br><strong>Note:</strong><br>1. If searching for the specified conversation, <code>messageList</code> is the list of all messages in this conversation that meet the search criteria.<br>2. If all conversations are searched, the number of messages contained in <code>messageList</code> may have the following two possibilities:<br>- If the number of matched messages <code>messageCount</code> > 1, the <code>messageList</code> returned by the API will be []. You can display [${messageCount} relevant records] on the UI. If you want to highlight the matched messages, please .<br>- If the number of matched messages in a conversation = 1, then <code>messageList</code> is the matched message. |

## Searching messages in all sessions

Do not specify `conversationID`, specify keyword search.

##### Example
``` javascript
// Full text search, specify keyword
// - Search messages containing 'Hello' or 'Where are you'
let promise = chat.searchCloudMessages({
   keywordList: ['Hello', 'Where are you']
});
promise.then(function(imResponse) {
   // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of sessions containing messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Messages that meet the search criteria are grouped by conversation ID and returned by page.
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID); // Conversation ID
      console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
      // If all conversations are searched, the number of messages contained in messageList may have the following two possibilities:
      // - If the number of matching messages in a conversation is greater than 1, messageList is empty, and you can display "messageCount related records" on the UI.
      // - If the number of messages matched in a conversation is equal to 1, messageList is the matched message, and you can display it on the UI and highlight the matched keyword.
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // failed to search for messages
});
```

## Searching for the Messages in the Specified Conversation

Specify `conversationID` and search by keyword.

##### Example
``` javascript
// Specify conversation and search by keyword
// - Search for messages in the 'GROUPPublic001' conversation containing 'Hello' or 'Where are you'.
let promise = chat.searchCloudMessages({
   keywordList: ['Hello', 'Where are you'],
   conversationID: 'GROUPPublic001'
});
promise.then(function(imResponse) {
   // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Message results of the current conversation search
   if(searchResultList.length){
       const { conversationID, messageCount, messageList } = searchResultList[0];
       console.log(conversationID); // Conversation ID
       console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
       console.log(messageList); // List of all messages in this conversation that meet search criteria
   }
}).catch(function(imError){
   console.error(imError); // failed to search for messages
});
```

## Searching for a Custom Message
1. When using the `createCustomMessage` API to create a custom message, you need to put the text to be searched in the `description` parameter. It supports matching keywords with `description`.

2. Specify `messageTypeList` as `TencentCloudChat.TYPES.MSG_CUSTOM` for classified search, which will search for all custom messages.

##### Example
``` javascript
// Full text search, specify keyword and message type search
// - Search for messages of type 'custom message' where the description contains 'Hello' or 'Where are you'
let promise = chat.searchCloudMessages({
   keywordList: ['Hello', 'Where are you'],
   messageTypeList: [TencentCloudChat.TYPES.MSG_CUSTOM],
});
promise.then(function(imResponse) {
   // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of sessions containing messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Messages that meet the search criteria are grouped by conversation ID and returned by page.
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID); // Conversation ID
      console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
      // If all conversations are searched, the number of messages contained in messageList may have the following two possibilities:
      // - If the number of matching messages in a conversation is greater than 1, messageList is empty, and you can display "messageCount related records" on the UI.
      // - If the number of messages matched in a conversation is equal to 1, messageList is the matched message, and you can display it on the UI and highlight the matched keyword.
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // failed to search for messages
});
```

## Searching for a Rich Media Message

Rich media messages include file, image, audio, and video messages.
1. For a file message, the filename is usually displayed on the UI. If you pass in the `createFileMessage` parameter `fileName` when creating a file message, `fileName` will be used as the content to be searched for and match the search keyword.

2. For image, voice, and video messages, there is no name like `fileName`. The UI usually displays a thumbnail or duration, so specifying `keywordList` for search is invalid.

3. You can specify `messageTypeList` as `TencentCloudChat.TYPES.MSG_IMAGE`/`TencentCloudChat.TYPES.MSG_AUDIO`/`TencentCloudChat.TYPES.MSG_VIDEO` for classified search, which will search for all specified types of messages.

##### Example
``` javascript
// Full text search, only specify message sender and message type for search (when specifying sender and message type, the keyword list can be empty)
// - Search for messages sent by 'user1' or 'user2', and the message type is 'image message', 'voice message', or 'file message'
let promise = chat.searchCloudMessages({
   senderUserIDList: ['user1', 'user2'],
   messageTypeList: [
      TencentCloudChat.TYPES.MSG_IMAGE,
      TencentCloudChat.TYPES.MSG_AUDIO,
      TencentCloudChat.TYPES.MSG_FILE
   ],
});
promise.then(function(imResponse) {
 // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of sessions containing messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Messages that meet the search criteria are grouped by conversation ID and returned by page.
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID); // Conversation ID
      console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
      // If all conversations are searched, the number of messages contained in messageList may have the following two possibilities:
      // - If the number of matching messages in a conversation is greater than 1, messageList is empty, and you can display "messageCount related records" on the UI.
      // - If the number of messages matched in a conversation is equal to 1, messageList is the matched message, and you can display it on the UI and highlight the matched keyword.
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // failed to search for messages
});

```

## Searching Geolocation Messages
1. Support matching `latitude`, `longitude`, `description` with keywords.

2. Specify `messageTypeList` as `TencentCloudChat.TYPES.MSG_LOCATION` for classified search, which will search for all geolocation messages.

##### Example
``` javascript
// Full text search, specify keyword and message type search
// - Search for messages of type 'geolocation' where the latitude, longitude, description contains 'Hello' or 'Where are you'
let promise = chat.searchCloudMessages({
   keywordList: ['Hello', 'Where are you'],
   messageTypeList: [TencentCloudChat.TYPES.MSG_LOCATION],
});
promise.then(function(imResponse) {
 // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of sessions containing messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Messages that meet the search criteria are grouped by conversation ID and returned by page.
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID); // Conversation ID
      console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
      // If all conversations are searched, the number of messages contained in messageList may have the following two possibilities:
      // - If the number of matching messages in a conversation is greater than 1, messageList is empty, and you can display "messageCount related records" on the UI.
      // - If the number of messages matched in a conversation is equal to 1, messageList is the matched message, and you can display it on the UI and highlight the matched keyword.
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // failed to search for messages
});
```

## Searching for Merged Messages
1. When using the `createMergerMessage` API to create a merged message, you need to put the text to be searched in the `title` or `abstractList` parameter. It supports matching `title` and `abstractList` with keywords.

2. Specify `messageTypeList` as `TencentCloudChat.TYPES.MSG_MERGER` for classified search, which will search for all merged messages.

##### Example
``` javascript
// Full text search, specify keyword and message type search
// - Search for message types marked as ‘Merge Message’, and messages containing ‘hello’ or ‘Where is it?’ in their title or abstractList
let promise = chat.searchCloudMessages({
   keywordList: ['Hello', 'Where are you'],
   messageTypeList: [TencentCloudChat.TYPES.MSG_MERGER],
});
promise.then(function(imResponse) {
 // Successful search message
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of sessions containing messages that meet the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Messages that meet the search criteria are grouped by conversation ID and returned by page.
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { conversationID, messageCount, messageList } = searchResultItem;
      console.log(conversationID); // Conversation ID
      console.log(messageCount); // Total number of messages that meet the criteria in the current conversation
      // If all conversations are searched, the number of messages contained in messageList may have the following two possibilities:
      // - If the number of matching messages in a conversation is greater than 1, messageList is empty, and you can display "messageCount related records" on the UI.
      // - If the number of messages matched in a conversation is equal to 1, messageList is the matched message, and you can display it on the UI and highlight the matched keyword.
      console.log(messageList);
    }
}).catch(function(imError) {
   console.error(imError); // failed to search for messages
});
```

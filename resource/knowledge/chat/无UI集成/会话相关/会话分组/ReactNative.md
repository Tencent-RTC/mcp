---
sync_node_id: '161578233685168128'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话分组"
  - "React Native"
product: "chat"
---
## Feature Overview

In some cases, you may need to group conversations, for example, into a "Product experience" or "R&D" group, which can be implemented through the following API.

> **Note:**
> To use this feature, you need to [purchase the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/pricing/chat).
> 

## UI Display

## Creating a conversation group

Call the `createConversationGroup` API to create a conversation group. After the API is called successfully, the SDK distributes the `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` and `TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED` events.

> **Note:**
> Up to 20 conversation groups can be created. After this limit is exceeded, the `51010` error will be reported. Groups that are no longer used should be promptly deleted.
> 

##### **API**

【js】
``` javascript
chat.createConversationGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|conversationIDList|String|List of conversation IDs|
|groupName|String|Conversation group name, which can be up to 32 bytes in length|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.createConversationGroup({
  conversationIDList: ['GROUPtest', 'C2Cexample'],
  groupName: 'Suppliers',
});
promise.then(function(imResponse) {
  // Created the conversation group successfully
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  // successConversationIDList - List of IDs of the conversations that were created successfully
  // Get the conversation list
  const conversationList = chat.getConversationList(successConversationIDList);

  // failureConversationIDList - List of IDs of the conversations that failed to be created
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError){
  console.warn('createConversationGroup error:', imError);
});
```

## Deleting a conversation group

Call the `deleteConversationGroup` API to delete a conversation group. After the API is deleted successfully, the SDK distributes the `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` and `TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED` events.

> **Note:**
> If the target conversation group doesn't exist, the `51009` error will be reported.
> 

##### **API**

【js】
``` javascript
chat.deleteConversationGroup(groupName);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|groupName|String|Conversation group name, which can be up to 32 bytes in length|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = tim.deleteConversationGroup('Suppliers');
promise.then(function() {
  // Deleted successfully
}).catch(function(imError){
  console.warn('deleteConversationGroup error:', imError);
});
```

## Renaming a conversation group

Call the `renameConversationGroup` API to rename a conversation group. After the API is renamed successfully, the SDK distributes the `TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED` and `TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED` events.

##### **API**

【js】
``` javascript
chat.renameConversationGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|oldName|String|Old group name|
|newName|String|New group name, which can be up to 32 bytes in length|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.renameConversationGroup({
  oldName: 'Suppliers_old',
  newName: 'Suppliers_new'
});
promise.then(function(imResponse) {
  // Renamed successfully
}).catch(function(imError){
  console.warn('renameConversationGroup error:', imError);
});
```

## Getting the list of conversation groups

Call the `getConversationGroupList` API to get the list of conversation groups.

##### **API**

【js】
``` javascript
chat.getConversationGroupList();
```

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getConversationGroupList();
promise.then(function(imResponse) {
  const groupNameList = imResponse.data; // Conversation group name list
});
```

【js】
``` javascript
// Obtain all conversations in a specified conversation group
let promise = chat.getConversationList({ groupName: 'Suppliers' });
promise.then(function(imResponse) {
  const conversationList = imResponse.data.conversationList; // Conversation list
});
```

## Adding a conversation to a group

After creating a group, you can call the `addConversationsToGroup` API to add a conversation to the group. After the API is called successfully, the SDK distributes the `TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED` event.

##### **API**

【js】
``` javascript
chat.addConversationsToGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|conversationIDList|String|List of conversation IDs|
|groupName|String|Conversation group name, which can be up to 32 bytes in length|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.addConversationsToGroup({
  conversationIDList: ['GROUPtest', 'C2Cexample'],,
  groupName: 'Suppliers_new',
});
promise.then(function(imResponse) {
  // Added the conversation to the group successfully
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  // successConversationIDList - List of IDs of the conversations that were created successfully
  // Get the conversation list
  const conversationList = chat.getConversationList(successConversationIDList);

  // failureConversationIDList - List of IDs of the conversations that failed to be created
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError){
  console.warn('addConversationsToGroup error:', imError);
});
```

## Deleting a conversation from a group

Call the `deleteConversationsFromGroup` API to delete a conversation from a group. After the API is called successfully, the SDK distributes the `TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED` event.

##### **API**

【js】
``` javascript
chat.deleteConversationsFromGroup(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type. It contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|conversationIDList|String|List of conversation IDs|
|groupName|String|Conversation group name, which can be up to 32 bytes in length|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.deleteConversationsFromGroup({
  conversationIDList: ['GROUPtest', 'C2Cexample'],,
  groupName: 'Suppliers_new',
});
promise.then(function(imResponse) {
  // Deleted the conversation from the group successfully
  const { successConversationIDList, failureConversationIDList } = imResponse.data;
  // successConversationIDList - List of IDs of the conversations that were created successfully
  // Get the conversation list
  const conversationList = chat.getConversationList(successConversationIDList);

  // failureConversationIDList - List of IDs of the conversations that failed to be created
  failureConversationIDList.forEach((item) => {
    const { conversationID, code, message } = item;
  });
}).catch(function(imError){
  console.warn('deleteConversationsFromGroup error:', imError);
});
```

## Listening for the notification of a conversation group change

Trigger such listening in the case of a conversation group change, such as conversation group creation, deletion, and renaming.

##### **Examples**

【js】
``` javascript
let onConversationGroupListUpdated = function(event) {
  console.log(event.data); // List of all conversation groups
}
chat.on(TencentCloudChat.EVENT.CONVERSATION_GROUP_LIST_UPDATED, onConversationGroupListUpdated);
```

## Listening for the notification of a conversation change in a conversation group

Trigger such listening in the case of a conversation change in a conversation group, for example, adding a conversation to a conversation group or deleting a conversation from a conversation group.

##### **Examples**

【js】
``` javascript
let onConversationInGroupUpdated = function(event) {
  const { groupName, conversationList }  = event.data;
  // groupName - Conversation group name
  // conversationList - List of conversations in the group
}
chat.on(TencentCloudChat.EVENT.CONVERSATION_IN_GROUP_UPDATED, onConversationInGroupUpdated);
```

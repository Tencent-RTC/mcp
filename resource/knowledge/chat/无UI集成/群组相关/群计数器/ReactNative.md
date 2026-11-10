---
sync_node_id: '161578270589800448'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群计数器"
  - "React Native"
product: "chat"
---
## Feature Overview

Chat SDK provides the group counter feature, allowing a certain number of counters to be set for each group.

Unlike Group Custom Attributes, group counters are mainly used to store integer-type data. You can use group counters to store additional group-related information, such as the cumulative number of viewers, the number of views, the number of likes received by the host, and the total number of gifts given by the audience to the host in a live group.

> **Note:**
> 1. Group counters support all types of groups, excluding topic-enabled community groups.
> 2. This feature is only supported in the [Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).

Keep the following in mind for group counters:
1. A single group can support up to 20 group counters, meaning the number of keys in a single group should not exceed 20.

2. The key for a single group counter cannot exceed 128 characters, and the value must be an integer (up to 64-bit signed integers).

3. `setGroupCounters`, `increaseGroupCounter`, and `decreaseGroupCounter` APIs combine computations, with an SDK limit of 20 calls per 5 seconds per log in to user. If exceeded, the interface returns error code 2996.

4. `getGroupCounters` interface calculates independently. The SDK limits a single user to a maximum of 20 calls within 5 seconds per log in. If the limit is exceeded, the interface returns error code 2996.

## UI Display

## Setting Group Counters

After the counter is successfully set, the `TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED` event is triggered. 

> **Note:**
> 1. If the key of the counter you are about to set exists, then the value of the counter will be updated directly; if not, then a new key-value will be added.
> 2. If multiple users set the same counter at the same time, the final value of the counter will be used. It's recommended that the group owner performs counter setting operations.

##### **API**

【js】
``` javascript
chat.setGroupCounters(options);
```

##### **Parameters**

The `options` parameter is of the `Object`type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|counters|Object|Group Counter key-value|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Set the values of counters key1 and key2 to 0
let promise = chat.setGroupCounters({
  groupID: 'group1',
  counters: { key1: 0, key2: 0 }
});
promise.then(function(imResponse) { // Set successfully
  console.log(imResponse.data.counters); // Group counters set successfully
}).catch(function(imError) { // Setting failed
  console.warn('setGroupCounters error:', imError); // Error information
});
```

## Incrementing the Value of a Group Counter

After the counter is successfully set, the `TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED` event is triggered. 

> **Note:**
> 1. The value in the interface parameters is the change amount; after calling the interface, the incoming change amount will be added to the current value.
> 2. If the counter key you are about to set already exists, the system will directly increment the current value based on the incoming value; otherwise, it will add the key and increment based on the incoming value starting from a default value of 0.

##### **API**

【js】
``` javascript
chat.increaseGroupCounter(options);
```

##### **Parameters**

The options `parameter` is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|key|String|Group Counter Key|
|value|Number|Incremental Change Amount of the Group Counter Key|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Assuming the current value of counter key1 is 8. After calling the increaseGroupCounter interface and passing // the incremental change amount value of 2, the final value of key1 becomes 10.
let promise = chat.increaseGroupCounter({
  groupID: 'group1',
  key: 'key1',
  value: 2,
});
promise.then(function(imResponse) { // Increment successful
  console.log(imResponse.data);
  const { groupID, key, value } = imResponse.data;
}).catch(function(imError) { // Increment failed
  console.warn('increaseGroupCounter error:', imError);
});
```

## Decrementing the Value of a Group Counter

After the counter is successfully set, the `TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED` event is triggered. 

> **Note:**
> 1. The value in the interface parameters is a change amount; after calling the interface, the incoming change amount will be subtracted from the current value.
> 2. If the counter key you are about to set already exists, the system will directly decrement the current value based on the incoming value; otherwise, it will add the key and decrement based on the incoming value starting from a default value of 0.

##### **API**

【js】
``` javascript
chat.decreaseGroupCounter(options);
```

##### **Parameters**

The `options` parameter is of the `Object`type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|key|String|Group Counter Key|
|value|Number|Incremental Change Amount of the Group Counter Key|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Assuming the current value of the counter key1 is 8.
// After calling the decreaseGroupCounter API with a decrement value of 2
// The final value of key1 becomes 6.
let promise = chat.decreaseGroupCounter({
  groupID: 'group1',
  key: 'key1',
  value: 2
});
promise.then(function(imResponse) { // Decrement successful
  console.log(imResponse.data);
  const { groupID, key, value } = imResponse.data;
}).catch(function(imError) { // Setting failed
  console.warn('decreaseGroupCounter error:', imError);
});
```

## Getting Group Counters

> **Note:**
> If no keyList is passed, all group counters are returned.
> 

##### **API**

【js】
``` javascript
chat.getGroupCounter(options);
```

##### **Parameters**

The `options` parameter is of the `Object` type, and contains the following attribute values:

|Name|Type|Description|
|---------|---------|---------|
|groupID|String|Group ID|
|keyList|Array \| undefined|List of keys of the group counters|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// Get values of group counters key1 and key2
let promise = chat.getGroupCounters({
  groupID: 'group1',
  keyList: ['key1', 'key2']
});
promise.then(function(imResponse) { // Got successfully
  console.log(imResponse.data.counters);
}).catch(function(imError) {
  console.warn('getGroupCounters error:', imError); // Error information
});
```

【js】
``` javascript
// Get all counters of a group
let promise = chat.getGroupCounters({
  groupID: 'group1'
});
promise.then(function(imResponse) { // Got successfully
  console.log(imResponse.data.counters);
}).catch(function(imError) {
  console.warn('getGroupCounters error:', imError); // Error information
});
```

## Group Counter Change Notification

When you call the `setGroupCounters`, `increaseGroupCounter`, or `decreaseGroupCounter` interfaces to modify the group counters, the `TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED` event will be triggered and the updated value will be returned.

##### **Examples**

【js】
``` javascript
let onGroupCounterUpdated = function(event) {
  const { groupID, key, value } = event.data;
  // groupID - Group ID
  // key - Group counter key
  // value - Value corresponding to the group counter key
};
chat.on(TencentCloudChat.EVENT.GROUP_COUNTER_UPDATED, onGroupCounterUpdated);
```

---
sync_node_id: '161579577775816704'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "关注&粉丝"
  - "React Native"
product: "chat"
---
## Feature Overview
- **Following** feature allows users to follow other users they are interested in, so they can timely receive the latest news, feeds, or event information of these users. The system can provide personalized content recommendations based on the user's following list.

- **Followers** feature refers to the state of a user being followed by others. When user A follows user B, A becomes a follower of B. Users can view the count of followers, followers list, or profile of followers on their own profile page.

   Through the features, you can create an active, interconnected user network, promoting the spread of information and the building of the community.

   > **Note:**
   > 
   > This feature is only supported by the Pro, Pro-plus, and Enterprise Edition, Please [purchase the Pro, Pro-plus, or Enterprise](https://console.trtc.io/subscription/buy/chat) to use it.
   > 

## UI Display

## Following users

> **Note:**
> 1. This interface supports following up to 20 users at a time (except for oneself, any other user can be followed).
> 2. Each user has an upper limit of 5000 followers, but there is no limit to the number of fans.

**API**

【js】
``` javascript
chat.followUser(options);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array.<String>|A list of user IDs, supporting following up to 20 users at a time.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.followUser(['user1', 'user2']);
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('followUser error:', imError);
});
```

## Unfollowing users

> **Note:**
> This interface supports unfollowing up to 20 users at a time
> 

**API**

【js】
``` javascript
chat.unfollowUser(options);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array.<String>|A list of user IDs, supporting unfollowing up to 20 users at a time.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.unfollowUser(['user1', 'user2']);
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('followUser error:', imError);
});
```

## Getting my followers list

> **Note:**
> This API returns up to 500 users at a time.
> 

**API**

【js】
``` javascript
chat.getMyFollowersList(nextCursor);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|nextCursor|String \| undefined|The starting position for pagination retrieval. The default is empty for the first page pull and can be omitted. When the retrieval is successful, nextCursor is not `''`，If pagination is needed, you can pass this value again to pull until nextCursor returns `''`.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getMyFollowersList(nextCursor);
promise.then(function(imResponse) {
  const { resultList, nextCursor = '' } = imResponse.data;
  // ressultList - list of my followers
  // nextCursor - The identifier for continuing pagination pull
  if (nextCursor != '') {
    // do pagination pull
  }
}).catch(function(imError) {
  console.warn('getMyFollowersList error:', imError);
});
```

## Getting my following list

> **Note:**
> This API returns up to 500 users at a time.
> 

**API**

【js】
``` javascript
chat.getMyFollowingList(nextCursor);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|nextCursor|String \| undefined|The starting position for pagination retrieval. The default is empty for the first page pull and can be omitted. When the retrieval is successful, nextCursor is not `''`，If pagination is needed, you can pass this value again to pull until nextCursor returns `''`.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getMyFollowingList();
promise.then(function(imResponse) {
  const { resultList, nextCursor = '' } = imResponse.data;
  // ressultList - list of my following
  // nextCursor - The identifier for continuing pagination pull
  if (nextCursor != '') {
    // do pagination pull
  }
}).catch(function(imError) {
  console.warn('getMyFollowingList error:', imError);
});
```

## Getting the mutual followers list

> **Note:**
> This API returns up to 500 users at a time.
> 

**API**

【js】
``` javascript
chat.getMutualFollowersList(nextCursor);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|nextCursor|String \| undefined|The starting position for pagination retrieval. The default is empty for the first page pull and can be omitted. When the retrieval is successful, nextCursor is not `''`，If pagination is needed, you can pass this value again to pull until nextCursor returns `''`.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.getMutualFollowersList();
promise.then(function(imResponse) {
  const { resultList, nextCursor = '' } = imResponse.data;
  // ressultList - mutual follo list
  // nextCursor - The identifier for continuing pagination pull
  if (nextCursor != '') {
    // do pagination pull
  }
}).catch(function(imError) {
  console.warn('getMutualFollowersList error:', imError);
});
```

## Getting the count of following/followers/mutual followers

**API**

【js】
``` javascript
chat.getUserFollowInfo(userIDList);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array.<String>|User ID list; if userIDList is not provided, it indicates obtaining the follow info for oneself.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
// get the count of my following/followers/mutual followers
let promise = chat.getUserFollowInfo();
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getUserFollowInfo error:', imError);
});
```

``` javascript
// get the count of following/followers/mutual followers for specified users
let promise = chat.getUserFollowInfo(['user1', 'user2']);
promise.then(function(imResponse) {
  console.log(imResponse.data);
}).catch(function(imError) {
  console.warn('getUserFollowInfo error:', imError);
});
```

## Checking follow type

**API**

【js】
``` javascript
chat.checkFollowType(userIDList);
```

##### **Parameters**

|Name|Type|Description|
|---------|---------|---------|
|userIDList|Array.<String>|List of user IDs to be checked; a single request supports up to 100 user IDs.|

##### **Return value**

`Promise`

##### **Examples**

【js】
``` javascript
let promise = chat.checkFollowType(['user1', 'user2']);
promise.then(function(imResponse) {
  console.log(imResponse.data);
  imResponse.data.forEach((item) => {
    // item.userID - userID
    // item.followType - 0 - No relationship, 1 - my follower, 2 - my following, 3 - mutual followers
  });
}).catch(function(imError) {
  console.warn('checkFollowType error:', imError);
});
```

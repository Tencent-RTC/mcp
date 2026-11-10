---
sync_node_id: '164409067198697472'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索用户"
  - "JavaScript"
product: "chat"
---
## Feature Description

Search cloud users, supporting quick search by keywords. Users can quickly locate known users, such as friends or followed contacts, through this API; meanwhile, they can also use keywords for the discovery of new users, to expand social circle or find interested users.

> **Notes:**
> 
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://trtc.io/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - The cloud user search feature is supported from **v3.5.0**.
> - Search scope: fuzzy search matching for all users' nicknames based on keywords, precise search matching for all users' userID.
> - The profile in the list of users obtained is incomplete (only includes avatar, nickname, userID, gender, birthday, selfSignature, etc., which is sufficient to meet the rendering needs of user search result list, excluding custom fields). To query the detailed user profile, see: getUserProfile.
> - The maximum number of search results per time is 100.
> - This API has a cloud frequency limit of 2 times/second, and a local API call limit of 20 times/5 seconds.

## Searching for Cloud Users

##### API
``` javascript
chat.searchCloudUsers(options);
```

##### Parameters

The options parameter is of the Object type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| keywordList | Array | <code>required</code><br>Keyword list, support up to 5 keywords. |
| keywordListMatchType | String \\| undefined | Keyword List Matching Type:<br>- or: relational search ("or" relationship) (default)<br>- and: relational search ("and" relationship) |
| gender | String \\| undefined | User gender, if not provided, default search all genders. Gender representation:<br>- <code>TencentCloudChat.TYPES.GENDER_FEMALE</code> Female<br>- <code>TencentCloudChat.TYPES.GENDER_MALE</code> Male |
| miniBirthday | Number \\| undefined | User minimum birthday, e.g., 19900101. |
| maxBirthday | Number \\| undefined | User maximum birthday, when set together with <code>miniBirthday</code>, must be greater than or equal to <code>miniBirthday</code>, such as 20240101. |
| cursor | String \\| undefined | The starting position for each search of cloud users. Do not pass <code>cursor</code> for the first search. For continue search, fill in the value of <code>cursor</code> returned by the last call to the <code>searchCloudUsers</code> API. |
| count | Number \\| undefined | The number of cloud user results per search. The default value is 20, and the maximum value is 100. |

##### **Return Value**

`Promise`

|Name|Type|Description|
|---------|---------|---------|
|totalCount|Number|Total number of users meeting the search condition.|
|searchResultList|Array|List of user profiles `Profile` meeting the search condition, including only avatar `avatar`, nickname `nick`, user account `userID`, gender `gender`, birthday `birthday`, and self-signature `selfSignature`. This can meet the rendering needs of user search result list and does not include custom fields. For detailed user profile.|
|cursor|String|The cursor needed for calling the search API to continue pulling.|

##### **Example**
``` javascript
// Search specified keyword list and birth date range
// - Search users with 'test' or 'user' in their profile, and whose birth date is before 20240101
let promise = chat.searchCloudUsers({
   keywordList: ['test', 'user'],
   maxBirthday: 20240101,
});
 
promise.then(function(imResponse) {
 // User search successful
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of users meeting the search condition
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // List of users meeting the search condition, return paginated grouping results, maximum 100 per page, count set
   for (let i = 0; i < searchResultList.length; i++) {
      const profileItem = searchResultList[i];
      const { userID, nick, gender, avatar } = profileItem;
      console.log(userID); // User ID
      console.log(nick); // User nickname
      console.log(gender); // User gender
      console.log(avatar); // User avatar
    }
}).catch(function(imError) {
   console.error(imError); // search user failed
});
```

---
sync_node_id: '164409079371657216'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群组"
  - "React Native"
product: "chat"
---
## Feature Description

Search cloud groups, users can quickly locate existing groups or discover new groups through keywords. Users can quickly locate existing groups through this API, and explore interests in groups not yet joined through keywords, facilitating management and participation in social circle group activities.

> **Notes:**
> 
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://trtc.io/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - The search cloud groups feature is supported from **v3.5.0**.
> - Search scope: Perform fuzzy search matching on all group names based on keywords, and precise search matching on all group IDs.
> - The information in the group list obtained through this API is incomplete (only including group ID, group avatar, group name, group type, current member count, group introduction, group owner ID, etc.). To query detailed group information, see: getGroupProfile.
> - The maximum number of search results per time is 100.
> - Live groups (TencentCloudChat.TYPES.GRP_AVCHATROOM) are not supported for search.
> - This API has a cloud frequency limit of 2 times/second, and a local API call limit of 20 times/5 seconds.

## Searching Cloud Groups

##### API
``` javascript
chat.searchCloudGroups(options);
```

##### Parameters

The options parameter is of the Object type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| keywordList | Array | <code>required</code><br>Keyword list, support up to 5 keywords. |
| keywordListMatchType | String \\| undefined | Keyword List Matching Type:<br>- or: relational search ("or" relationship) (default)<br>- and: relational search ("and" relationship) |
| groupTypeList | Array \\| undefined | If not provided, the default search is for all types of groups (live groups not supported (<code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code>)).<br>Group Types Indicate:<br>- <code>TencentCloudChat.TYPES.GRP_WORK</code> friends work group<br>- <code>TencentCloudChat.TYPES.GRP_PUBLIC</code> stranger social group<br>- <code>TencentCloudChat.TYPES.GRP_MEETING</code> temporary meeting group<br>- <code>TencentCloudChat.TYPES.GRP_COMMUNITY</code> community |
| cursor | String \\| undefined | The starting position for each search of cloud groups. Do not pass in <code>cursor</code> for the first search. For continuing the search, fill in the value of <code>cursor</code> returned by the last call to the <code>searchCloudGroups</code> API. |
| count | Number \\| undefined | The number of results for each search of cloud groups. The default value is 20, and the maximum value is 100. |

##### **Return Value**

`Promise`

|Name|Type|Description|
|---------|---------|---------|
|totalCount|Number|The total number of groups meeting the search criteria.|
|searchResultList|Array|The list of group profiles `Group` meeting the search criteria includes only group ID `groupID`, group avatar `avatar`, group name `name`, group type `type`, current member count `memberCount`, group introduction `introduction`, and group owner ID `ownerID`, which can meet the rendering needs of the search results list. For detailed group information.|
|cursor|String|The cursor needed for calling the search API to continue pulling.|

##### **Example**
``` javascript
// List of specified keywords and group types to search
// - Search for groups where 'test' or 'user' appears in the user list, and the group type is 'stranger social group (TencentCloudChat.TYPES.GRP_PUBLIC)' or 'friends work group (TencentCloudChat.TYPES.GRP_WORK)'
let promise = chat.searchCloudGroups({
   keywordList: ['test', 'user'],
   groupTypeList: [TencentCloudChat.TYPES.GRP_PUBLIC, TencentCloudChat.TYPES.GRP_WORK],
});
 
promise.then(function(imResponse) {
   // Search group succeeded
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of groups meeting the search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // Groups meeting search criteria, return paginated grouping results, maximum return of 100 per page, based on the input count
   for (let i = 0; i < searchResultList.length; i++) {
      const groupItem = searchResultList[i];
      const { groupID, name, type, avatar, memberCount, introduction, ownerID } = groupItem;
      console.log(groupID); // Group ID
      console.log(name); // Group name
      console.log(type); // Group type
      console.log(avatar); // Group avatar
      console.log(memberCount); // Current member count
      console.log(introduction); // Group introduction
      console.log(ownerID); // Group owner userid
    }
}).catch(function(imError) {
   console.error(imError); // search user failed
});
```

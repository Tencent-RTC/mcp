---
sync_node_id: '164409131712184320'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群成员"
  - "React Native"
product: "chat"
---
## Feature Description

Search cloud group members, supporting keyword fuzzy matching. Users can quickly find group members matching the keywords in the groups they have joined, facilitating the search for specific members or group management.

> **Notes:**
> 
> - The cloud message search feature is only available to **Pro Plus and Enterprise** customers and can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - The feature to search cloud group members is supported from **v3.5.0**.
> - Search scope: Perform keyword fuzzy matching search on group member user nickname nick and group card nameCard among all groups the currently logged-in user is in.
> - The search results only include partial group information (group id groupID, group name name, group type type, group avatar avatar) and partial group member information (group member userID, group member nickname nick, group card nameCard), meeting the rendering requirements of the group member search results list. To query detailed group member information, refer to: getGroupMemberProfile.
> - The maximum number of search results per time is 100.
> - Live groups (TencentCloudChat.TYPES.GRP_AVCHATROOM) are not supported for search.
> - This API has a cloud frequency limit of 2 times/second, and a local API call limit of 20 times/5 seconds.

## Searching Cloud Group Members

##### API
``` javascript
chat.searchCloudGroupMembers(options);
```

##### Parameters

The options parameter is of the Object type, and contains the following attribute values:
| Name | Type | Description |
| --- | --- | --- |
| keywordList | Array | <code>required</code><br>Keyword list, support up to 5 keywords. |
| keywordListMatchType | String \\| undefined | Keyword List Matching Type:<br>- or: relational search ("or" relationship) (default)<br>- and: relational search ("and" relationship) |
| groupTypeList | Array \\| undefined | If not provided, it defaults to searching all types of group members (live broadcast groups <code>TencentCloudChat.TYPES.GRP_AVCHATROOM</code> are not supported for search).<br>Group Types Indicate:<br>- <code>TencentCloudChat.TYPES.GRP_WORK</code> friends work group<br>- <code>TencentCloudChat.TYPES.GRP_PUBLIC</code> stranger social group<br>- <code>TencentCloudChat.TYPES.GRP_MEETING</code> temporary meeting group<br>- <code>TencentCloudChat.TYPES.GRP_COMMUNITY</code> community |
| groupIDList | Array \\| undefined | Search specified group ID list, if not provided, it defaults to searching all groups. |
| cursor | String \\| undefined | Starting position for each cloud group member search. Do not provide <code>cursor</code> for the first search, and use the value of <code>cursor</code> returned by the previous call to the <code>searchCloudGroupMembers</code> API for continuing the search. |
| count | Number \\| undefined | Number of results for each cloud group member search, default is 20, maximum is 100. |

##### **Return Value**

`Promise`

|Name|Type|Description|
|---------|---------|---------|
|totalCount|Number|Total number of group members that meet the search criteria.|
|searchResultList|Array|The list of group members that meet the search criteria, returned grouped by `groupID`.|
|cursor|String|The cursor needed for calling the search API to continue pulling.|

 Here, `searchResultList` is a list that contains the search result objects. The parameters are as described below:
| Name | Type | Description |
| --- | --- | --- |
| groupInfo | Object | Group information, including the following group details:<br>- <code>groupID</code> Group ID.<br>- <code>name</code> Group name.<br>- <code>type</code> Group type.<br>- <code>avatar</code> Group avatar. |
| memberList | Array | List of group members meeting search criteria in the current group. Each group member in the list includes the following information:<br>- <code>userID</code> Group member user ID.<br>- <code>nick</code> Group member user nickname.<br>- <code>nameCard</code> Group name card. |

##### **Example**
``` javascript
// Search specified keyword list and group ID list
// - Search for group members in the current joined groups that contain 'test' or 'user', and the group ID is 'group1' or 'group2'
let promise = chat.searchCloudGroupMembers({
   keywordList: ['test', 'user'],
   groupIDList: ['group1', 'group2'],
});
 
promise.then(function(imResponse) {
 // Search group members successfully
   const { totalCount, cursor, searchResultList } = imResponse.data;
   console.log(totalCount); // Total number of group members meeting search criteria
   console.log(cursor); // Starting position for the next cloud search, if not present, indicates search results are fully retrieved
   console.log(searchResultList); // List of group members meeting search criteria, returned paginated grouping results, maximum return per page is 100, based on the input count
   for (let i = 0; i < searchResultList.length; i++) {
      const searchResultItem = searchResultList[i];
      const { groupInfo, memberList } = searchResultItem;
      const { groupID, name, type, avatar } = groupInfo;
      // Group ID / Group name / Group type / Group avatar
      console.log(groupID, name, type, avatar);
      console.log(memberList); // List of members meeting criteria in the group
      for (let i = 0; i < memberList.length; i++) {
        const memberItem = memberList[i];
        const { userID, nick, nameCard } = memberItem;
        console.log(userID); // Group member user ID
        console.log(nick); // Group member user nickname
        console.log(nameCard); // Group name card
      }
    }
}).catch(function(imError) {
   console.error(imError); // search group members failed
});
```

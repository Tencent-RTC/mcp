---
sync_node_id: '188323639012618240'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群成员"
  - "Unity"
product: "chat"
---
# Search Cloud Group Members

## Description

You can search for cloud group members by memberID, nickName, and nameCard information. This feature is particularly useful for quickly finding specific group members, such as quickly locating a member in a large group.

> **Note：**
> - The cloud group member search feature is supported only by version  8.6.7020 or later.
> - The cloud message search feature is only available to **Pro Plus and Enterprise** customers and can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Group Members Interface

Call the `GroupSearchCloudGroupMembers`interface to search for group member information in the cloud。

The parameters of `GroupMemberSearchParam` are as follows:
| Parameter | Meaning | Description |
| --- | --- | --- |
| group_search_member_params_keyword_list | Keyword list | It can contain up to five keywords, the keyword will automatically match the group member id 、nickname and name card. |
| group_member_search_params_keyword_list_match_type | Match type of the keyword list | You can set it to search with "OR" logic or "AND" logic. The values are <code>TIMKeywordListMatchType_Or</code> and <code>TIMKeywordListMatchType_And</code>, respectively. By default, it uses "OR" logic. |
| group_search_member_params_groupid_list | Specify group id list | - If set to null，it means searching for group members in all groups, and the returned results will be classified by <code>groupID</code>；<br>- If  set to not null, it means searching for group members in the specified group. |
| group_member_search_params_search_count | Search Count | Must be greater than 0, maximum supported is 100, default is 20. |
| group_member_search_params_search_cursor | Search Cursor | Starting position, fill in an empty character string for the first time, and fill in the <code>group_member_search_result_next_cursor</code> from the last <code>GroupMemberSearchResult</code> returned for subsequent pulls. |

### Group Member Search Result Class

The message search result class is `GroupMemberSearchResult`. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|group_member_search_result_is_finished|Is the search finished|Whether all group members that meet the search criteria have been returned.|
|group_member_search_result_total_count|Total search results|The total count of group members that meet the search criteria.|
|group_member_search_result_next_cursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|group_member_search_result_member_list|Member List|The group member list returned by the current cloud search.|

Below is the sample code:
``` csharp
GroupMemberSearchParam groupMemberSearchParam = new GroupMemberSearchParam();
groupMemberSearchParam.group_search_member_params_keyword_list = keywordList;
groupMemberSearchParam.group_search_member_params_groupid_list = groupIDs;
groupMemberSearchParam.group_member_search_params_search_count = 10;

TIMResult res = TencentIMSDK.GroupSearchCloudGroupMembers(groupMemberSearchParam, (int code, string desc, GroupMemberSearchResult result, string user_data) => {
 // Process the async logic
});
```

---
sync_node_id: '188323630741426176'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群组"
  - "Unity"
product: "chat"
---
# Search Cloud Groups

## Description

You can search for cloud groups by group ID, group name, and other information to quickly find the required group profile. This feature is particularly useful for scenarios where specific groups need to be found, such as finding interest groups to join in social settings.

> **Note：**
> - The cloud group search feature is supported only by version 8.6.7020 or later.
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Groups Interface

Call the `GroupSearchCloudGroups` interface to search for group information in the cloud.

The parameters of`GroupSearchParam` are as follows:

|Parameter|Meaning|Description|
|---------|---------|---------|
|group_search_params_keyword_list|Keyword list|It can contain up to five keywords, the keyword will automatically match the group id and group name.|
|group_search_params_keyword_list_match_type|Match type of the keyword list|You can set it to search with "OR" logic or "AND" logic. The values are `TIMKeywordListMatchType_Or` and `TIMKeywordListMatchType_And`, respectively. By default, it uses "OR" logic.|
|group_search_params_search_count|Search Count|Must be greater than 0, maximum supported is 100, default is 20.|
|group_search_params_search_cursor|Search Cursor|Starting position, fill in an empty character string for the first time, and fill in the `group_search_result_next_cursor` from the last `GroupSearchResult` returned for subsequent pulls.|

### Group Search Result Class

The message search result class is `GroupSearchResult`. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|group_search_result_is_finished|Is the search finished|Whether all groups that meet the search criteria have been returned.|
|group_search_result_total_count|Total search results|The total count of groups that meet the search criteria.|
|group_search_result_next_cursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|group_search_result_group_list|Group List|The group list returned by the current cloud search.|

Below is the sample code:
``` csharp
GroupSearchParam groupSearchParam = new GroupSearchParam();
groupSearchParam.group_search_params_keyword_list = keywordList;
groupSearchParam.group_search_params_search_count = 10;

TencentIMSDK.GroupSearchCloudGroups(groupSearchParam, (int code, string desc, GroupSearchResult result, string user_data) => {
 // Process the async logic
});
```

---
sync_node_id: '188323624900882432'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索用户"
  - "Unity"
product: "chat"
---
# Search Cloud Users

## Description

You can search for cloud users by user ID, nickname, gender, and other information to quickly find the required user profile. This feature is suitable for scenarios where specific user information needs to be found, such as finding users to add as friends in familiar social scenes or finding users to follow in stranger social scenes.

> **Note：**
> - The cloud user search feature is supported only by version 8.6.7020 or later.
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Users Interface

Call the `searchUsers` interface to search for user information in the cloud，This interface returns user information stored in the cloud, including friend and non-friend information. You can call the `FriendshipCheckFriendType` interface to determine whether a user is a friend.

The parameters of `UserSearchParam` are as follows:

|Parameter|Meaning|Description|
|---------|---------|---------|
|user_search_param_keyword_list|Keyword list|It can contain up to five keywords，keyword will automatically match the user ID and nickname.|
|user_search_param_keyword_list_match_type|Match type of the keyword list|You can set it to search with "OR" logic or "AND" logic. The values are `TIMKeywordListMatchType_Or` and `TIMKeywordListMatchType_And`, respectively. By default, it uses "OR" logic.|
|user_search_param_gender|User gender|If not set, both male and female are returned by default.|
|user_search_param_min_birthday|User’s minimum birthday|If not set, the default value is 0.|
|user_search_param_max_birthday|User's maximum birthday|If not set, all users with birthday >= minBirthday will be returned by default.|
|user_search_param_search_count|Search Count|Must be greater than 0, maximum supported is 100, default is 20.|
|user_search_param_search_cursor|Search Cursor|Starting position, fill in an empty character string for the first time, and fill in the `user_search_result_next_cursor` from the last `UserSearchResult` returned for subsequent pulls.|

### User Search Result Class

The message search result class is `UserSearchResult`. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|user_search_result_is_finished|Is the search finished|Whether all users that meet the search criteria have been returned.|
|user_search_result_total_count|Total search results|The total count of users that meet the search criteria.|
|user_search_result_next_cursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|user_search_result_user_list|User List|The user list returned by the current cloud search.|

Below is the sample code:
``` csharp
UserSearchParam userSearchParam = new UserSearchParam();
userSearchParam.user_search_param_keyword_list = keywordList;
userSearchParam.user_search_param_search_count = 10;

TencentIMSDK.SearchUsers(userSearchParam, (int code, string desc, UserSearchResult result, string user_data)=>{
 // Process the async logic
});
```

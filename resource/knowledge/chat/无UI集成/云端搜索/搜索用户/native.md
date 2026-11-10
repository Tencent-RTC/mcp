---
sync_node_id: '164834303708987392'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索用户"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
# Search Cloud Users

## Description

You can search for cloud users by user ID, nickname, gender, and other information to quickly find the required user profile. This feature is suitable for scenarios where specific user information needs to be found, such as finding users to add as friends in familiar social scenes or finding users to follow in stranger social scenes.

> **Note：**
> - The cloud user search feature is supported only by version 8.4 or later.
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Users Interface

Call the `searchUsers` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserSearchParam.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.searchusers(param:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a978df4d80011f4da38dc80f8ab217f48) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6846339829066fec9fc4d6d72e01d5a0)) interface to search for user information in the cloud，This interface returns user information stored in the cloud, including friend and non-friend information. You can call the `checkFriend` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a96bb74f3bbd1aef147ec914a81104d11) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.checkfriend(useridlist:checktype:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#aad1b09fab6523d9a36147b4ed4efac67) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a90046f679ca31dedc00bbecff065538f))   

interface to determine whether a user is a friend.

The parameters of `V2TIMUserSearchParam` are as follows:

|Parameter|Meaning|Description|
|---------|---------|---------|
|keywordList|Keyword list|It can contain up to five keywords，keyword will automatically match the user ID and nickname.|
|keywordListMatchType|Match type of the keyword list|You can set it to search with "OR" logic or "AND" logic. The values are `V2TIM_KEYWORD_LIST_MATCH_TYPE_OR` and `V2TIM_KEYWORD_LIST_MATCH_TYPE_AND`, respectively. By default, it uses "OR" logic.|
|gender|User gender|If not set, both male and female are returned by default.|
|minBirthday|User’s minimum birthday|If not set, the default value is 0.|
|maxBirthday|User's maximum birthday|If not set, all users with birthday >= minBirthday will be returned by default.|
|searchCount|Search Count|Must be greater than 0, maximum supported is 100, default is 20.|
|searchCursor|Search Cursor|Starting position, fill in an empty character string for the first time, and fill in the `searchCursor` from the last `V2TIMUserSearchResult` returned for subsequent pulls.|

### User Search Result Class

The message search result class is `V2TIMUserSearchResult`（[Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserSearchResult.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMUserSearchResult.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMUserSearchResult.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMUserSearchResult.html)）. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|isFinished|Is the search finished|Whether all users that meet the search criteria have been returned.|
|totalCount|Total search results|The total count of users that meet the search criteria.|
|nextCursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|userList|User List|The user list returned by the current cloud search.|

Below is the sample code:

【Java】
``` java
V2TIMUserSearchParam searchParam = new V2TIMUserSearchParam();
searchParam.setKeywordList(keywordList);
searchParam.setKeywordListMatchType(param.V2TIM_KEYWORD_LIST_MATCH_TYPE_OR);
searchParam.setSearchCount(20);
searchParam.setSearchCursor("");

V2TIMManager.getInstance().searchUsers(searchParam, new V2TIMValueCallback<V2TIMUserSearchResult>() {
  @Override
  public void onSuccess(V2TIMUserSearchResult userSearchResult) {
      // search users succ
  }

  @Override
  public void onError(int code, String desc) {
      // search users failed
  }
});
```

【Swift】
``` swift
let param = V2TIMUserSearchParam()
param.gender = .V2TIM_GENDER_UNKNOWN;
param.keywordList = ["keyword1", "keyword2"];
param.keywordListMatchType = .V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.searchCount = 20;
param.searchCursor = "";
V2TIMManager.shared.searchUsers(param: param) { searchResult in
    // search users succ
} fail: { code, desc in
    // search users failed
}
```

【Objective-C】
``` objectivec
V2TIMUserSearchParam *param = [[V2TIMUserSearchParam alloc] init];
param.gender = V2TIM_GENDER_UNKNOWN;
param.keywordList = @[@"keyword1", @"keyword2"];
param.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.searchCount = 20;
param.searchCursor = @"";
[[V2TIMManager sharedInstance] searchUsers:param succ:^(V2TIMUserSearchResult *searchResult) {
    // search users succ
} fail:^(int code, NSString *desc) {
    // search users failed
}];

```

【C++】
``` cpp
template <class T>
class ValueCallback final : public V2TIMValueCallback<T> {
public:
    using SuccessCallback = std::function<void(const T&)>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    ValueCallback() = default;
    ~ValueCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess(const T& value) override {
        if (success_callback_) {
            success_callback_(value);
        }
    }
    void OnError(int error_code, const V2TIMString& error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMUserSearchParam searchParam;
searchParam.keywordList = keywordList;
param.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.searchCount = 20;
param.searchCursor = "";

auto callback = new ValueCallback<V2TIMUserSearchResult>{};
callback->SetCallback(
    [=](const V2TIMUserSearchResult& userSearchResult) {
        // search users succ
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // search users failed
        delete callback;
    });

V2TIMManager::GetInstance()->SearchUsers(searchParam, callback);
```

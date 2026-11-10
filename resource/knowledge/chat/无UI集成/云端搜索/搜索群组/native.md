---
sync_node_id: '164834309450989568'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群组"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
# Search Cloud Groups

## Description

You can search for cloud groups by group ID, group name, and other information to quickly find the required group profile. This feature is particularly useful for scenarios where specific groups need to be found, such as finding interest groups to join in social settings.

> **Note：**
> - The cloud group search feature is supported only by version 8.4 or later.
> - The message translation feature is only available to customers of Pro Plus and Enterprise. It can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Groups Interface

Call the `searchCloudGroups` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a322641b6386d4698dd1611fee69891e0) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.searchcloudgroups(searchparam:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a8c3f83c844be3c8bb13fe9cec6fd658a) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#afce316958d6b3e25512b6d2e4e6a19ba)) interface to search for group information in the cloud.

The parameters of`V2TIMGroupSearchParam` are as follows:

|Parameter|Meaning|Description|
|---------|---------|---------|
|keywordList|Keyword list|It can contain up to five keywords, the keyword will automatically match the group id and group name.|
|keywordListMatchType|Match type of the keyword list|You can set it to search with "OR" logic or "AND" logic. The values are `V2TIM_KEYWORD_LIST_MATCH_TYPE_OR` and `V2TIM_KEYWORD_LIST_MATCH_TYPE_AND`, respectively. By default, it uses "OR" logic.|
|searchCount|Search Count|Must be greater than 0, maximum supported is 100, default is 20.|
|searchCursor|Search Cursor|Starting position, fill in an empty character string for the first time, and fill in the `searchCursor` from the last `V2TIMGroupSearchResult` returned for subsequent pulls.|

### Group Search Result Class

The message search result class is `V2TIMGroupSearchResult`（[Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupSearchResult.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupSearchResult.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupSearchResult.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupSearchResult.html)）. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|isFinished|Is the search finished|Whether all groups that meet the search criteria have been returned.|
|totalCount|Total search results|The total count of groups that meet the search criteria.|
|nextCursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|groupList|Group List|The group list returned by the current cloud search.|

Below is the sample code:

【Java】
``` java
V2TIMGroupSearchParam searchParam = new V2TIMGroupSearchParam();
searchParam.setKeywordList(keywordList);
searchParam.setKeywordListMatchType(param.V2TIM_KEYWORD_LIST_MATCH_TYPE_OR);
searchParam.setSearchCount(20);
searchParam.setSearchCursor("");

V2TIMManager.getGroupManager().searchCloudGroups(searchParam, new V2TIMValueCallback<V2TIMGroupSearchResult>() {
  @Override
  public void onSuccess(V2TIMGroupSearchResult groupSearchResult) {
       // search cloud groups succ
  }

  @Override
  public void onError(int code, String desc) {
      // search cloud groups succ failed
  }
});
```

【Swift】
``` swift
let param = V2TIMGroupSearchParam()
param.keywordList = ["keyword1", "keyword2"];
param.keywordListMatchType = .V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.searchCount = 20;
param.searchCursor = "";
V2TIMManager.shared.searchCloudGroups(searchParam: param) { searchResult in
    // search cloud groups succ
} fail: { code, desc in
    // search cloud groups succ failed
}
```

【Objective-C】
``` objectivec
V2TIMGroupSearchParam *param = [[V2TIMGroupSearchParam alloc] init];
param.keywordList = @[@"keyword1", @"keyword2"];
param.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.searchCount = 20;
param.searchCursor = @"";
[[V2TIMManager sharedInstance] searchCloudGroups:param succ:^(V2TIMGroupSearchResult *searchResult) {
    // search cloud groups succ
} fail:^(int code, NSString *desc) {
    // search cloud groups succ failed
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

V2TIMGroupSearchParam searchParam;
searchParam.keywordList = keywordList;
searchParam.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
searchParam.searchCount = 20;
searchParam.searchCursor = "";

auto callback = new ValueCallback<V2TIMGroupSearchResult>{};
callback->SetCallback(
    [=](const V2TIMGroupSearchResult& groupSearchResult) {
        // search cloud groups succ
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // search cloud groups succ failed
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SearchCloudGroups(searchParam, callback);
```

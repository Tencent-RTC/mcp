---
sync_node_id: '164834317299580928'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索群成员"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
# Search Cloud Group Members

## Description

You can search for cloud group members by memberID, nickName, and nameCard information. This feature is particularly useful for quickly finding specific group members, such as quickly locating a member in a large group.

> **Note：**
> - The cloud group member search feature is supported only by version 8.4 or later.
> - The cloud message search feature is only available to **Pro Plus and Enterprise** customers and can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Search Cloud Group Members Interface

Call the `searchCloudGroupMembers` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a1db4218077a0db6c623a19d66ba72b5a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.searchcloudgroupmembers(searchparam:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#ae2f92bf458c5b6ef0149d66de7a01896) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a1b162f6187a846c9ea05636c9135c59c)) interface to search for group member information in the cloud。

The parameters of `V2TIMGroupMemberSearchParam` are as follows:
| Parameter | Meaning | Description |
| --- | --- | --- |
| keywordList | Keyword list | It can contain up to five keywords, the keyword will automatically match the group member id 、nickname and name card. |
| keywordListMatchType | Match type of the keyword list | You can set it to search with "OR" logic or "AND" logic. The values are <code>V2TIM_KEYWORD_LIST_MATCH_TYPE_OR</code> and <code>V2TIM_KEYWORD_LIST_MATCH_TYPE_AND</code>, respectively. By default, it uses "OR" logic. |
| groupIDList | Specify group id list | - If <code>groupIDList</code> is set to null，it means searching for group members in all groups, and the returned results will be classified by <code>groupID</code>；<br>- If <code>groupIDList</code> is set to not null, it means searching for group members in the specified group. |
| searchCount | Search Count | Must be greater than 0, maximum supported is 100, default is 20. |
| searchCursor | Search Cursor | Starting position, fill in an empty character string for the first time, and fill in the <code>searchCursor</code> from the last <code>V2TIMGroupMemberSearchResult</code> returned for subsequent pulls. |

### Group Member Search Result Class

The message search result class is `V2TIMGroupMemberSearchResult`（[Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupMemberSearchResult.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupMemberSearchResult.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupMemberSearchResult.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupMemberSearchResult.html)）. The parameters are as described below:

|Parameter|Meaning|Description|
|---------|---------|---------|
|isFinished|Is the search finished|Whether all group members that meet the search criteria have been returned.|
|totalCount|Total search results|The total count of group members that meet the search criteria.|
|nextCursor|Continue pulling the cursor|The search cursor for the next cloud search.|
|memberList|Member List|The group member list returned by the current cloud search.|

Below is the sample code:

【Java】
``` java
V2TIMGroupMemberSearchParam searchParam = new V2TIMGroupMemberSearchParam();
searchParam.setKeywordList(keywordList);
searchParam.setKeywordListMatchType(param.V2TIM_KEYWORD_LIST_MATCH_TYPE_OR);
searchParam.setGroupIDList(groupIDList);
searchParam.setSearchCount(20);
searchParam.setSearchCursor("");

V2TIMManager.getGroupManager().searchCloudGroupMembers(searchParam, new V2TIMValueCallback<V2TIMGroupMemberSearchResult>() {
  @Override
  public void onSuccess(V2TIMGroupMemberSearchResult groupMemberSearchResult) {
      // Search Group Member succ
  }

  @Override
  public void onError(int code, String desc) {
      // Search Group Member failed
  }
});
```

【Swift】
``` swift
let param = V2TIMGroupMemberSearchParam()
param.keywordList = ["keyword1", "keyword2"];
param.keywordListMatchType = .V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.groupIDList= ["groupID"];
param.searchCount = 20;
param.searchCursor = "";
V2TIMManager.shared.searchCloudGroupMembers(searchParam: param) { searchResult in
    // Search Group Member succ
} fail: { code, desc in
    // Search Group Member failed
}

```

【Objective-C】
``` objectivec
V2TIMGroupMemberSearchParam *param = [[V2TIMGroupMemberSearchParam alloc] init];
param.keywordList = @[@"keyword1", @"keyword2"];
param.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.groupIDList= @[@"groupID"];
param.searchCount = 20;
param.searchCursor = "";
[[V2TIMManager sharedInstance] searchCloudGroupMembers:param succ:^(V2TIMGroupMemberSearchResult *searchResult) {
    // Search Group Member succ
} fail:^(int code, NSString *desc) {
    // Search Group Member failed
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

V2TIMGroupMemberSearchParam param;
param.keywordList = keywordList;
param.keywordListMatchType = V2TIM_KEYWORD_LIST_MATCH_TYPE_OR;
param.groupIDList = groupIDList;
param.searchCount = 20;
param.searchCursor = "";

auto callback = new ValueCallback<V2TIMGroupMemberSearchResult>{};
callback->SetCallback(
    [=](const V2TIMGroupMemberSearchResult& groupMemberSearchResult) {
        // Search Group Member succ
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Search Group Member failed
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SearchCloudGroupMembers(param, callback);
```

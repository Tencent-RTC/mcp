---
sync_node_id: '164834295159361536'
nav_path:
  - "无 UI 集成"
  - "云端搜索"
  - "搜索消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
# Search Cloud Messages

## Description

Cloud message search<u>,</u> a must-have feature to enhance the App user experience, enables users to directly find the desired content from complex information quickly and conveniently. It can also serve as an OPS tool, facilitating efficient and concise guidance to related content.

> **Note:**
> - The cloud message search feature is supported only by version 7.3.4358 or later.
> - The cloud message search feature is only available to **Pro Plus and Enterprise** customers and can be used after [purchasing Pro Plus and Enterprise](https://console.trtc.io/subscription/buy/chat); the Free Trial version supports a certain limit of free trial, valid for one month.
> - If this service is not activated, calling the interface will return the error code 60020.

## Message Search Class

### Message Search Parameter Class

The message search parameter class is `V2TIMMessageSearchParam` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageSearchParam.html)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMessageSearchParam.html)/[Windows](https://im.sdk.qcloud.com/doc/en/structV2TIMMessageSearchParam.html)). When searching for messages, the SDK will execute different search logics based on this object's settings.

The parameters of `V2TIMMessageSearchParam` are as follows:

|Parameter|Meaning|Description|
|---------|---------|---------|
|keywordList|Keyword list|It can contain up to five keywords. When the message sender and the message type are not specified, the keyword list must be set; in other cases, it can be left empty.|
|keywordListMatchType|Match type of the keyword list|You can set it to search with "OR" logic or "AND" logic. The values are `V2TIM_KEYWORD_LIST_MATCH_TYPE_OR` and `V2TIM_KEYWORD_LIST_MATCH_TYPE_AND`, respectively. By default, it uses "OR" logic.|
|senderUserIDList|Search for messages sent by a specified userID|Up to five are supported.|
|messageTypeList|Set of the message types to be searched for|Leaving it empty means searching for all supported types of messages (`V2TIMFaceElem` and `V2TIMGroupTipsElem` are not searchable). Refer to `V2TIMElemType` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessage.html#a00455865d1a14191b8c612252bf20a1c)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a849af0e4698e8db9f227f9c8e54215b8)/[Windows](https://im.sdk.qcloud.com/doc/en/V2TIMMessage_8h.html#a6854ecfbc6f3b65ed381d8a2e14e2377)) for other types.|
|conversationID|Search "all conversations" or "a specified conversation"|If `conversationID` is empty, search all sessions; if `conversationID` is not empty, search the specified session.|
|searchTimePosition|Start time for the search|The default is 0 (search from now). UTC Timestamp, in seconds.|
|searchTimePeriod|A past period of time starting from the start time|The default is 0 (unlimited time range). 24 x 60 x 60 represents the past day, in seconds.|
|searchCount|Number of search results|Number of searches, support up to 100.|
|searchCursor|Search cursor|Starting position, fill in an empty character string for the first time, and fill in the `searchCursor` from the last `V2TIMMessageSearchResult` returned for subsequent pulls.|

### Message Search Result Class

The message search result class is `V2TIMMessageSearchResult`([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageSearchResult.html)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMessageSearchResult.html)/[Windows](https://im.sdk.qcloud.com/doc/en/structV2TIMMessageSearchResult.html)). The parameters are as described below:
| Parameter | Meaning | Description |
| --- | --- | --- |
| totalCount | Total number of the search result items | If a specific session is searched, the total number of messages that meet the search criteria will be returned;<br>If all sessions are searched, the total number of sessions containing messages that meet the search criteria will be returned. |
| messageSearchResultItems | Search results list | If a specific session is searched, the returned result list will only include results from that session;<br>If all sessions are searched, messages that meet the search criteria will be grouped by session ID, and the grouping results will be returned paginated. |
| searchCursor | Continue pulling the cursor | Cursor required for continuation while calling the search API |

Here, `messageSearchResultItems` is a list containing `V2TIMMessageSearchResultItem`([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageSearchResultItem.html)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMessageSearchResultItem.html)/[Windows](https://im.sdk.qcloud.com/doc/en/structV2TIMMessageSearchResultItem.html)) objects, with the parameters described as follows:
| Parameter | Meaning | Description |
| --- | --- | --- |
| conversationID | Session ID | - |
| messageCount | Number of messages | The total number of messages matching the criteria found in the current session. |
| messageList | List of messages that meet the search criteria | - If a specific session is searched, <code>messageList</code> contains a list of all messages meeting the search criteria within this session.<br>- If all sessions are searched, the number of messages contained in <code>messageList</code> may have the following two possibilities:<br>- If the number of messages matched in a session is > 1, then <code>messageList</code> is empty, and you can display "{<code>messageCount</code>} relevant records" on the UI.<br>- If the number of messages matched in a session = 1, then <code>messageList</code> is the matched message, and you can display it on the UI and highlight the search keywords. |

## Searching Messages in All Sessions

When a user enters keywords in the search box to search for messages, you can call `searchCloudMessages`([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a16a4a38b3f08bf7707d949ba9674102f)/[iOS and Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#ab672a5d549893b7e22c555593be40322)/[Windows](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab01326d278755b0968ca4c0bdb98d137)) to search for messages.

If you want to search within the scope of all sessions, you just need to leave `conversationID` in `V2TIMMessageSearchParam` unset or set to empty.

Below is the sample code:

【Android】
``` java
List<String> keywordList = new ArrayList<>();
keywordList.add("abc");
keywordList.add("123");
V2TIMMessageSearchParam searchParam = new V2TIMMessageSearchParam();
// Set the keyword for the search
searchParam.setKeywordList(keywordList);
// Search for 20 data entries
searchParam.setSearchCount(20);
// Start searching from the latest session
searchParam.setSearchCursor("");
// Start searching from the current time
searchParam.setSearchTimePosition(0);
// Search for messages within 10 minutes
searchParam.setSearchTimePeriod(600);
V2TIMManager.getMessageManager().searchCloudMessages(searchParam,newV2TIMValueCallback<V2TIMMessageSearchResult>() {
    @Override
    public void onSuccess(V2TIMMessageSearchResult v2TIMMessageSearchResult) {
      // Data found successfully
    }
    
    @Override
    public void onError(int code, String desc) {
      // Failed to find the data
    }
});
```

【iOS & Mac】
``` objectivec
V2TIMMessageSearchParam *param = [[V2TIMMessageSearchParam alloc] init];
// Set the keyword for the search
param.keywordList = @[@"abc", @"123"];
param.messageTypeList = nil;
param.conversationID = nil;
param.searchTimePosition = 0;
param.searchTimePeriod = 0;
// Search for 20 data entries
param.searchCount = 20;
// Start searching from the latest session
param.searchCursor = @"";
[V2TIMManager.sharedInstance searchCloudMessages:param
succ:^(V2TIMMessageSearchResult *searchResult) {
    // The search was successful, and the search results are returned in searchResult
} fail:^(int code, NSString *desc) {
    // Failed to find the data
}];
```

【Windows】
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

V2TIMMessageSearchParam searchParam;
// Set the keyword for the search
searchParam.keywordList.PushBack("abc");
searchParam.keywordList.PushBack("123");
// Search for 20 data entries
searchParam.searchCount = 20;
// Start searching from the latest session
searchParam.searchCursor = "";

auto callback = new ValueCallback<V2TIMMessageSearchResult>{};
callback->SetCallback(
    [=](const V2TIMMessageSearchResult& messageSearchResult) {
      // Data found successfully
      delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
      // Failed to find the data
      delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SearchCloudMessages(searchParam, callback);
```

## Searching for the Messages in the Specified Session

When a user enters keywords in the search box to search for messages, you can call `searchCloudMessages` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a16a4a38b3f08bf7707d949ba9674102f)/[iOS and Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#ab672a5d549893b7e22c555593be40322)/[Windows](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab01326d278755b0968ca4c0bdb98d137)) to search for messages.

Below is the sample code:

【Android】
``` java
List<String> keywordList = new ArrayList<>();
keywordList.add("abc");
keywordList.add("123");
V2TIMMessageSearchParam searchParam = new V2TIMMessageSearchParam();
// Search for one-to-one messages with the 'user1' user
searchParam.setConversationID("c2c_user1");
// Set the keyword for the search
searchParam.setKeywordList(keywordList);
// Search for 20 data entries
searchParam.setSearchCount(20);
// Start searching from the latest session
searchParam.setSearchCursor("");
// Start searching from the current time
searchParam.setSearchTimePosition(0);
// Search for messages within 10 minutes
searchParam.setSearchTimePeriod(600);
V2TIMManager.getMessageManager().searchCloudMessages(searchParam,newV2TIMValueCallback<V2TIMMessageSearchResult>() {
    @Override
    public void onSuccess(V2TIMMessageSearchResult v2TIMMessageSearchResult) {
      // Data found successfully
    }
    
    @Override
    public void onError(int code, String desc) {
      // Failed to find the data
    }
});
```

【iOS & Mac】
``` objectivec
V2TIMMessageSearchParam *param = [[V2TIMMessageSearchParam alloc] init];
// Set the keyword for the search
param.keywordList = @[@"abc", @"123"];
param.messageTypeList = nil;
// Search for one-to-one messages with the 'user1' user
param.conversationID = @"c2c_user1";
param.searchTimePosition = 0;
param.searchTimePeriod = 0;
// Search for 20 data entries
param.searchCount = 20;
// Start searching from the latest session
param.searchCursor = @"";
[V2TIMManager.sharedInstance searchCloudMessages:param
succ:^(V2TIMMessageSearchResult *searchResult) {
    // The search was successful, and the search results are returned in searchResult
} fail:^(int code, NSString *desc) {
    // Failed to find the data
}];
```

【Windows】
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

V2TIMMessageSearchParam searchParam;
// Search for one-to-one messages with the 'user1' user
searchParam.conversationID = "c2c_user1";
// Set the keyword for the search
searchParam.keywordList.PushBack("abc");
searchParam.keywordList.PushBack("123");
// Search for 20 data entries
searchParam.searchCount = 20;
// Start searching from the latest session
searchParam.searchCursor = "";

auto callback = new ValueCallback<V2TIMMessageSearchResult>{};
callback->SetCallback(
    [=](const V2TIMMessageSearchResult& messageSearchResult) {
      // Data found successfully
      delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
      // Failed to find the data
      delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SearchCloudMessages(searchParam, callback);
```

## Typical Use Cases for the Search

In general  chat software, a search UI is usually displayed as follows:

The following describes how to implement the above use cases through Chat SDK's search APIs.

### Displaying the Latest Active Sessions

As shown in Figure 1, a list of the latest three sessions to which the messages found belong is displayed at the bottom. The implementation method is as follows:
1. Setting search parameters `V2TIMMessageSearchParam`

   - `conversationID` set to `null`, indicates searching messages from all sessions.

   - `searchCursor` set to "", indicates searching for the latest data.

   - `searchCount` set to 3, indicates returning the number of the most recent sessions, typically showing 3 entries on the UI.

2. Handling search callback results `V2TIMMessageSearchResult`

   - `totalCount` indicates the number of all sessions to which the matched messages belong.

   - The `messageSearchResultItems` list contains the last 3 sessions (as per the `searchCount` parameter). `messageCount` of `V2TIMMessageSearchResultItem` indicates the total number of messages found in the current session;

   - If the number of messages found is > 1, then `messageList` will be empty. You can display "4 related chat records" on the UI, where 4 represents the `messageCount`.

   - If the number of messages found = 1, then `messageList` is the message that matches. You can display the message content on the UI and highlight the search keyword, for example, "test" in the Typical Use Cases for the Search image.

      Below is the sample code:

      

【Android】
``` java
List<String> keywordList = new ArrayList<>();
keywordList.add("test");
V2TIMMessageSearchParam v2TIMMessageSearchParam = new V2TIMMessageSearchParam();
// Setting `conversationID` to `null` is to search for messages in all sessions and the results will be classified by session
v2TIMMessageSearchParam.setConversationID(null);
v2TIMMessageSearchParam.setKeywordList(keywordList);
v2TIMMessageSearchParam.setSearchCursor("");
v2TIMMessageSearchParam.setSearchCount(3);
V2TIMManager.getMessageManager().searchCloudMessages(v2TIMMessageSearchParam, newV2TIMValueCallback<V2TIMMessageSearchResult>() {
    @Override
    public void onSuccess(V2TIMMessageSearchResult v2TIMMessageSearchResult) {
      // Total number of matched sessions to which messages belong
      int totalCount = v2TIMMessageSearchResult.getTotalCount();
      // Last three messages classified by session
      List<V2TIMMessageSearchResultItem> resultItemList = v2TIMMessageSearchResult.getMessageSearchResultItems();
      for (V2TIMMessageSearchResultItem resultItem : resultItemList) {
        // Session ID
        String conversationID = resultItem.getConversationID();
        // Total number of messages matching the session
        int totalMessageCount = resultItem.getMessageCount();
        // Message list: If totalMessageCount > 1, this list is empty; if totalMessageCount = 1, this list Element (XML) is this message
        List<V2TIMMessage> v2TIMMessageList = resultItem.getMessageList();
      }
    }
    
    @Override
    public void onError(int code, String desc) {
    }
});
```

【iOS & Mac】
``` objectivec
V2TIMMessageSearchParam *param = [[V2TIMMessageSearchParam alloc] init];
param.keywordList = @[@"test"];
// Setting `conversationID` to `nil` is to search for messages in all sessions and the results will be classified by session
param.conversationID = nil;
param.searchCursor = @"";
param.searchCount = 3;
[V2TIMManager.sharedInstance searchCloudMessages:param succ:^(V2TIMMessageSearchResult *searchResult) {
    // Total number of matched conversations to which messages belong
    NSInteger totalCount = searchResult.totalCount;
    // Last three messages classified by session
    NSArray<V2TIMMessageSearchResultItem *> *messageSearchResultItems = searchResult.messageSearchResultItems;
    for (V2TIMMessageSearchResultItem *searchItem in messageSearchResultItems) {
      // Conversation ID
      NSString *conversationID = searchItem.conversationID;
      // Total number of messages matching the session
      NSUInteger messageCount = searchItem.messageCount;
      // Message list
      NSArray<V2TIMMessage *> *messageList = searchItem.messageList ?: @[];
    }
} fail:^(int code, NSString *desc) {
    // fail
}];
```

【Windows】
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

V2TIMMessageSearchParam searchParam;
// Setting conversationID to null searches for messages in all sessions, and results will be classified by session
searchParam.conversationID = "";
searchParam.keywordList.PushBack("test");
searchParam.searchCursor = "";
searchParam.searchCount = 3;

auto callback = new ValueCallback<V2TIMMessageSearchResult>{};
callback->SetCallback(
    [=](const V2TIMMessageSearchResult& messageSearchResult) {
      // Total number of matched sessions to which messages belong
      uint32_t totalCount = messageSearchResult.totalCount;
      // Last three messages classified by session
      V2TIMMessageSearchResultItemVector messageSearchResultItems =
      messageSearchResult.messageSearchResultItems;
      for (size_t i = 0; i < messageSearchResultItems.Size(); ++i) {
        // Session ID
        V2TIMString conversationID = messageSearchResultItems[i].conversationID;
        // Total number of messages matching the session
        uint32_t messageCount = messageSearchResultItems[i].messageCount;
        // Message list: If messageCount > 1, this list is empty; if messageCount = 1, this list Element (XML) is this message
        V2TIMMessageVector messageList = messageSearchResultItems[i].messageList;
      }
      delete callback;
      },
      [=](int error_code, const V2TIMString& error_message) {
        // Failed to find the data
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SearchCloudMessages(searchParam, callback);
```

### Displaying the list of sessions to which the messages found belong

Clicking on "More chat records" in figure 1 of the Typical Use Cases for the Search will redirect to figure 2, displaying the list of sessions to which all the found messages belong. The search parameters and results description are similar to the scenario described above.

To prevent memory bloat, we strongly recommend that you load the session list by paging. For example, load by page, displaying 10 session results per page, the search parameter `V2TIMMessageSearchParam` can be set as follows:
1. For the first call: set `searchCount` = 10, `searchCursor` = "". Call `searchCloudMessages` to obtain the message search results, parse and display them on the homepage, and obtain the total number of sessions `totalCount` and the cursor for the next request `searchCursor` from the result callback.

2. When the interface is almost scrolled to the bottom, continue to pull the next page of data based on the cursor `searchCursor` from the previous request results.

   Below is the sample code:

   

【Android】
``` java
......
// Logging the search cursor
String searchCursor = "";
......

private void searchConversation(String cursor) {
    List<String> keywordList = new ArrayList<>();
    keywordList.add("test");
    V2TIMMessageSearchParam v2TIMMessageSearchParam = new V2TIMMessageSearchParam();
    v2TIMMessageSearchParam.setConversationID(null);
    v2TIMMessageSearchParam.setKeywordList(keywordList);
    v2TIMMessageSearchParam.setSearchCount(10);
    v2TIMMessageSearchParam.setSearchCursor(cursor);
    V2TIMManager.getMessageManager().searchCloudMessages(v2TIMMessageSearchParam, newV2TIMValueCallback<V2TIMMessageSearchResult>() {
      @Override
      public void onSuccess(V2TIMMessageSearchResult v2TIMMessageSearchResult) {
        // Total number of matched sessions to which messages belong
        int totalCount = v2TIMMessageSearchResult.getTotalCount();
        // Cursor for the next page
        searchCursor = v2TIMMessageSearchResult.getSearchCursor();
        // Information of messages classified by session
        List<V2TIMMessageSearchResultItem> resultItemList = v2TIMMessageSearchResult.getMessageSearchResultItems();
        for (V2TIMMessageSearchResultItem resultItem : resultItemList) {
          // Session ID
          String conversationID = resultItem.getConversationID();
          // Total number of messages matching the session
          int totalMessageCount = resultItem.getMessageCount();
          // Message list: If totalMessageCount > 1, this list is empty; if totalMessageCount = 1, this list Element (XML) is this message
          List<V2TIMMessage> v2TIMMessageList = resultItem.getMessageList();
        }
      }
    
      @Override
      public void onError(int code, String desc) {
      }
    });
  }

// Load the next page
public void loadMore() {
    searchConversation(searchCursor);
}
```

【iOS & Mac】
``` objectivec
......
// Logging the search cursor
NSString *searchCursor = @"";
......

- (void)searchConversation:(NSString *)cursor {
    V2TIMMessageSearchParam *param = [[V2TIMMessageSearchParam alloc] init];
    param.keywordList = @[@"test"];
    param.conversationID = nil;
    param.searchCursor = cursor;
    param.searchCount = 10;
    [V2TIMManager.sharedInstance searchCloudMessages:param succ:^(V2TIMMessageSearchResult *searchResult) {
      // Total number of matched sessions to which messages belong
      NSUInteger totalCount = searchResult.totalCount;
      // Cursor for the next page
      searchCursor = searchResult.searchCursor;
      // Information of messages classified by session
      NSArray<V2TIMMessageSearchResultItem *> *messageSearchResultItems = searchResult.messageSearchResultItems;
      for (V2TIMMessageSearchResultItem *searchItem in messageSearchResultItems) {
        // Session ID
        NSString *conversationID = searchItem.conversationID;
        // Total number of messages matching the session
        NSUInteger totalMessageCount = searchItem.messageCount;
        // Message list: If totalMessageCount > 1, this list is empty; if totalMessageCount = 1, this list Element (XML) is this message
        NSArray<V2TIMMessage *> *messageList = searchItem.messageList ?: @[];
      }
    } fail:^(int code, NSString *desc) {
    // fail
    }];
}

// Load the next page
- (void)loadMore {
    [self searchConversation:searchCursor];
}
```

【Windows】
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

// Logging the search cursor
V2TIMString searchCursor = "";

void SearchConversation(V2TIMString cursor) {
    V2TIMMessageSearchParam searchParam;
    searchParam.keywordList.PushBack("test");
    searchParam.searchCursor = cursor;
    searchParam.searchCount = 10;
    
    auto callback = new ValueCallback<V2TIMMessageSearchResult>{};
      callback->SetCallback(
      [=](const V2TIMMessageSearchResult& messageSearchResult) {
        // Total number of matched sessions to which messages belong
        uint32_t totalCount = messageSearchResult.totalCount;
        // Cursor for the next page
        searchCursor = messageSearchResult.searchCursor;
        // Information of messages classified by session
        V2TIMMessageSearchResultItemVector messageSearchResultItems =
        messageSearchResult.messageSearchResultItems;
        for (size_t i = 0; i < messageSearchResultItems.Size(); ++i) {
          // Session ID
          V2TIMString conversationID = messageSearchResultItems[i].conversationID;
          // Total number of messages matching the session
          uint32_t messageCount = messageSearchResultItems[i].messageCount;
          // Message list: If messageCount > 1, this list is empty; if messageCount = 1, this list Element (XML) is this message
          V2TIMMessageVector messageList = messageSearchResultItems[i].messageList;
        }
        delete callback;
      },
      [=](int error_code, const V2TIMString& error_message) {
      // Failed to find the data
      delete callback;
    });
    
    V2TIMManager::GetInstance()->GetMessageManager()->SearchLocalMessages(searchParam, callback);
}

// Load the next page
void LoadMore() { SearchConversation(searchCursor); }
```

### Displaying the Messages of a Specified Session

Unlike the session list shown in figure 2 in the Typical Use Cases for the Search, figure 3 displays the list of messages found in a specified session. To prevent memory bloat, we strongly recommend paginating the message display. For example, paginate and show 10 message results per page:
1. Search parameter `V2TIMMessageSearchParam` settings can be referred to as follows:

   - Setting the search parameter `V2TIMMessageSearchParam`'s `conversationID` as the session ID you are searching for.

   - Initial call: Set the parameter `searchCount` = 10, `searchCursor` = "". Call `searchCloudMessages` to obtain the message search results, parse and display them on the homepage, and obtain the total number of sessions `totalCount` and the cursor for the next page `searchCursor` from the result callback.

   - Subsequent call: Update the value of `searchCursor` to the return value from the callback of the previous call.

2. Handling the search results `V2TIMMessageSearchResult`:

   - `totalCount` indicates the total number of messages matched in that session.

   - `messageSearchResultItems` list contains only the results for that session. In the list, `messageCount` of `V2TIMMessageSearchResultItem` is the number of messages on that page, and `messageList` is the list of messages on that page.

   - `searchCursor` represents the starting cursor for the next page search.

      Below is the sample code:

      

【Android】
``` java
......
//  Record the search cursor
String searchCursor = "";
......

private void searchMessage(String cursor) {
    List<String> keywordList = new ArrayList<>();
    keywordList.add("test");
    V2TIMMessageSearchParam v2TIMMessageSearchParam = new V2TIMMessageSearchParam();
    v2TIMMessageSearchParam.setConversationID(conversationID);
    v2TIMMessageSearchParam.setKeywordList(keywordList);
    v2TIMMessageSearchParam.setSearchCount(10);
    v2TIMMessageSearchParam.setSearcuCursor(cursor);
    V2TIMManager.getMessageManager().searchCloudMessages(v2TIMMessageSearchParam,newV2TIMValueCallback<V2TIMMessageSearchResult>() {
      @Override
      public void onSuccess(V2TIMMessageSearchResult v2TIMMessageSearchResult) {
      // Total number of messages matching the session
      int totalMessageCount = v2TIMMessageSearchResult.getTotalCount();
      // Cursor for the next page
      searchCursor = v2TIMMessageSearchResult.getSearchCursor();
      // Number of messages on the current page
      List<V2TIMMessageSearchResultItem> resultItemList = v2TIMMessageSearchResult.getMessageSearchResultItems();
      for (V2TIMMessageSearchResultItem resultItem : resultItemList) {
        // Session ID
        String conversationID = resultItem.getConversationID();
        // The number of messages on the current page
        int totalMessageCount = resultItem.getMessageCount();
        // List of messages on the current page
        List<V2TIMMessage> v2TIMMessageList = resultItem.getMessageList();
      }
    }
    
      @Override
      public void onError(int code, String desc) {
      }
    });
}
// Load the next page
public void loadMore() {
    searchMessage(searchCursor);
}
```

【iOS & Mac】
``` objectivec
......
//  Record the search cursor
NSString *searchCursor = @"";
......

- (void)searchMessage:(NSString *)cursor {
  V2TIMMessageSearchParam *param = [[V2TIMMessageSearchParam alloc] init];
  param.keywordList = @[@"test"];
  // conversationID is the session ID to search
  param.conversationID = conversationID;
  param.searchCursor = cursor;
  param.searchCount = 10;
  [V2TIMManager.sharedInstance searchCloudMessages:param succ:^(V2TIMMessageSearchResult *searchResult) {
    // Total number of messages matching the session
    NSUInteger totalMessageCount = searchResult.totalCount;
    // Cursor for the next page
    searchCursor = searchResult.searchCursor;
    // Messages on the current page
    NSArray<V2TIMMessageSearchResultItem *> *messageSearchResultItems = searchResult.messageSearchResultItems;
    for (V2TIMMessageSearchResultItem *searchItem in messageSearchResultItems) {
      // Session ID
      NSString *conversationID = searchItem.conversationID;
      // The number of messages on the current page
      NSUInteger totalMessageCount = searchItem.messageCount;
      // List of messages on the current page
      NSArray<V2TIMMessage *> *messageList = searchItem.messageList ?: @[];
      }
    } fail:^(int code, NSString *desc) {
      // fail
    }];
}

// Load the next page
- (void)loadMore {
    [self searchMessage:searchCursor];
}
```

【Windows】
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

// Record the search cursor
V2TIMString searchCursor = "";

void SearchConversation(V2TIMString cursor) {
    V2TIMMessageSearchParam searchParam;
    searchParam.conversationID = conversationID;
    searchParam.keywordList.PushBack("test");
    searchParam.searchCursor = cursor;
    searchParam.searchCount = 10;
    
    auto callback = new ValueCallback<V2TIMMessageSearchResult>{};
    callback->SetCallback(
      [=](const V2TIMMessageSearchResult& messageSearchResult) {
        // The number of all messages matched by the session
        uint32_t totalCount = messageSearchResult.totalCount;
        // Cursor for the next page
        searchCursor = messageSearchResult.searchCursor;
        // Messages on the current page
        V2TIMMessageSearchResultItemVector messageSearchResultItems =
        messageSearchResult.messageSearchResultItems;
        for (size_t i = 0; i < messageSearchResultItems.Size(); ++i) {
          // Session ID
          V2TIMString conversationID = messageSearchResultItems[i].conversationID;
          // Number of messages on the current page
          uint32_t messageCount = messageSearchResultItems[i].messageCount;
          // List of messages on the current page
          V2TIMMessageVector messageList = messageSearchResultItems[i].messageList;
        }
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Search failed
        delete callback;
    });
    
    V2TIMManager::GetInstance()->GetMessageManager()->SearchCloudMessages(searchParam, callback);
}

// Load the next page
void LoadMore() { SearchConversation(SearchCursor); }
```

## Searching for a Custom Message

Typically, if you use the `createCustomMessage(data)` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a5c2495d4b7ecd66e5636aeb865c17efd)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a7a38c42f63a4e0c9e89f6c56dd0da316)/[Windows](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a580ce76a38da8a0c1a6963b1e7e95cac)) API to create a custom message, the message cannot be found because the SDK saves it as a binary data stream.

If you want your custom messages to be searchable, you must use the `createCustomMessage(data, description, extension)` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a313b1ea616f082f535946c83edd2cc7f)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#aa400f14a24a0e0db70ec510b16e7d9b6)/[Windows](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3af1cc2c76c41f3e48080134502ac8d5)) API to create and send custom messages, placing the searchable text in the `description` parameter.

If you have configured the offline push feature, after setting the `description` parameter, your custom messages will also have offline push and the notification bar will display the content of that parameter. If you don't need offline push, you can control it with the `disablePush` in the `V2TIMOfflinePushInfo` parameter of the `sendMessage` ([Android](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795)/[iOS & Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21)/[Windows](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) API.

If you do not want the content displayed in the push notification bar to be the searchable text, you can use the `desc` in the `V2TIMOfflinePushInfo` parameter to set the push content differently.

## Searching for a Rich Media Message

Rich media messages include file, image, audio, and video messages.

For file messages, the interface usually displays the file name. If you pass the `fileName` parameter when calling `createFileMessage` to create a file message, `fileName` will be used as the content of the file message to be searched and matched with the search keyword. If `fileName` is not set, the SDK will automatically extract the file name from `filePath` as the search content. Both `fileName` and `filePath` information is saved to the local device and server, and can be searched after pulling relevant information on a new device.

For image, audio, and video messages, there is no such name as `fileName`, and the interface usually displays a thumbnail or duration, making the specification of `keywordList` ineffective for searches. If you wish to search for such messages, you can specify `messageTypeList` as `V2TIM_ELEM_TYPE_IMAGE`/`V2TIM_ELEM_TYPE_SOUND`/`V2TIM_ELEM_TYPE_VIDEO` for categorized searches, which will then retrieve all messages of the specified types.

## 

# Exchange and Feedback


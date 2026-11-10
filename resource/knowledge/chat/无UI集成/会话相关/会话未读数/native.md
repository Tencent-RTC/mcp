---
sync_node_id: '138858283018178560'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "会话未读数"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

Unread count refers to the number of messages that a user has not yet read in the chat app. This count is usually indicated by a red dot or numbers in the conversation list, reminding the user that there are new unread messages to view. The unread count encourages users to promptly view and reply to new messages. It can enhance users' engagement and communication efficiency, preventing important information from being ignored.

## Effect

## API Description

### Get Total Unread Message Count

In general cases, to get the total unread count of all the conversations, you can traverse the conversation list to get the `V2TIMConversation` information of each conversation and add the `unreadCount` values of all the `V2TIMConversation` objects to get the final result and display it on the UI.
The Chat SDK provides the `getTotalUnreadMessageCount` API to query the total unread count of all the conversations.
When the total unread count changes, the SDK will notify the latest total unread count through the `onTotalUnreadMessageCountChanged` callback.

> **Note: **
> 1. This feature is supported only by the SDK of the Enhanced edition on v5.3.425 or later.
> 2. This feature applies only to work groups (Work), public groups (Public), and communities (Community), but not to audio-video groups (AVChatRoom) or meeting groups (Meeting). For more information on the group types, see [Group Overview](https://intl.cloud.tencent.com/document/product/1047/48169).

Below are detailed steps.

#### Get Unread Count

Call `getTotalUnreadMessageCount` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a08bdd15d7ee2737335a01285d7f9c44a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.gettotalunreadmessagecount(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#abe76208f616713a09df582a6c1665d38) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a50e0d25b7f47c12c815e610bf5b9a048)) to get the total unread message count of all conversations and display it on the UI.

Sample code:

【Java】
``` java
V2TIMManager.getConversationManager().getTotalUnreadMessageCount(new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long aLong) {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getTotalUnreadMessageCount { totalCount in
    print("getTotalUnreadMessageCount succ, \(totalCount)")
} fail: { code, desc in
    print("getTotalUnreadMessageCount fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getTotalUnreadMessageCount:^(UInt64 totalCount) {
    // Obtained successfully. `totalCount` is the total unread message count of all conversations.
    // Update the unread count on the UI
} fail:^(int code, NSString *desc) {
    // Failed to obtain
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

auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Got the total unread count of all conversations successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to get the total unread count of all conversations
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->GetTotalUnreadMessageCount(callback);
```

#### Unread Count Changed Notification

Call `addConversationListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a806534684e5d4d01b94126cd1397fee4) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.addconversationlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a39b4f352f1740171fb56143149201cd9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#adb2c20ca824cac69d0703169f3a025a1)) to add a conversation listener to receive notifications of a change in the total unread count of all conversations (such notifications can be received only after the `getTotalUnreadMessageCount` API is called).

You can get the changed total unread count in `onTotalUnreadMessageCountChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationListener.html#a292e893a04cb092fe49c06873c1ea4b3) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMConversationListener.html#v2timconversationlistener.ontotalunreadmessagecountchanged(totalunreadcount:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMConversationListener-p.html#ab254716e0edb04a0192fb56d27b611e4) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationListener.html#ad73f5c7260833575c7d8f4c0ae508388)) of `V2TIMConversationListener`.

Sample code:

【Java】
``` java
public void onTotalUnreadMessageCountChanged(long totalUnreadCount) {
    // Received a notification of a change in the total unread count of all conversations
    Log.i("imsdk", "onTotalUnreadMessageCountChanged");
}
```

【Swift】
``` swift
V2TIMManager.shared.addConversationListener(listener: self)
 func onTotalUnreadMessageCountChanged(totalUnreadCount: UInt) {
      print("\(totalUnreadCount)")
}
```

【Objective-C】
``` objectivec
// Add a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// Received a notification of a change in the total unread count of all conversations
- (void)onTotalUnreadMessageCountChanged:(UInt64)totalUnreadCount {
    // `totalUnreadCount` is the total unread count.
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    /**
     * Notification of the change of the total unread message count of all conversations (supported by 5.3.425 or later)
     *
     * @note
     *  - The total unread message count excludes the unread message count of Do-Not-Disturb conversations (conversations whose message receiving option is
     *  V2TIM_NOT_RECEIVE_MESSAGE or V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE).
     */
    void OnTotalUnreadMessageCountChanged(uint64_t totalUnreadCount) override {
        // Received a notification of a change in the total unread count of all conversations
    }
    // Other member functions...
};

// Add a conversation event listener. Keep `conversationListener` valid before the listener is removed to ensure event callbacks are received.
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

### Get Unread Message Count by Filter

You can call `getUnreadMessageCountByFilter`, passing different `V2TIMConversationListFilter` to get the unread message count for conversations under a specific filter.

`V2TIMConversationListFilter` is explained as follows:

|Attribute|Meaning|Description|
|---------|---------|---------|
|type|Chat Type (enter 0 to not filter this item)|One-on-one or Group Chat|
|conversationGroup|Session Group Name (leaving blank means this item will not be filtered)|Not the group name, but the name of the session grouping, see document [Session Grouping](https://intl.cloud.tencent.com/document/product/1047/48854)|
|markType|Session Tag Type (enter 0 to not filter this item)|See document [Session Tag](https://intl.cloud.tencent.com/document/product/1047/48853)|
|hasUnreadCount|Number of Unread Sessions Included|true: Returns sessions with unread messages; false: Returns all sessions|
|hasGroupAtInfo|Session includes group @ messages|true: Returns sessions with group @ messages; false: Returns all sessions|

If you need to monitor changes in the total unread message count of a conversation, you can call `subscribeUnreadMessageCountByFilter` to register for notifications. When the total unread message count in the filtered conversation changes, the SDK will proactively notify you of the latest total unread count through the callback `onUnreadMessageCountChangedByFilter`.

> **Note:**
> 1. Only the enhanced version SDK 7.0.3754 and later supports getting the total unread message count of certain sessions based on filter criteria.
> 2. Applicable only to Friends Work Group (Work), Stranger Social Group (Public), and Community (Community), but not applicable to Live Broadcast Group (AVChatRoom) and Temporary Meeting Group (Meeting). For details on group types, see [Group Introduction](https://intl.cloud.tencent.com/document/product/1047/48169).

The following will list some typical cases of pulling with filters.

#### One-to-one Chat or Group Chat

Sample code:

【Java】
``` java
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setConversationType(V2TIMConversation.V2TIM_C2C); // Pull C2C Chat
// filter.setConversationType(V2TIMConversation.V2TIM_GROUP); // Pull Group Chat

V2TIMManager.getConversationManager().getUnreadMessageCountByFilter(filter, new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long totalUnreadCount) {
        tvLog.setText("getUnreadMessageCountByFilter success, totalUnreadCount:" + totalUnreadCount);
    }

    @Override
    public void onError(int code, String desc) {
        tvLog.setText("getUnreadMessageCountByFilter failed");
    }
});
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.type = .V2TIM_C2C; // Pull c2c chat
// filter.type = V2TIM_GROUP; // Pull group chat

V2TIMManager.shared.getUnreadMessageCountByFilter(filter: filter) { totalCount in
    print("getTotalUnreadMessageCount succ, \(totalCount)")
} fail: { code, desc in
    print("getTotalUnreadMessageCount fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.type = V2TIM_C2C; // Pull c2c chat
// filter.type = V2TIM_GROUP; // Pull group chat

[[V2TIMManager sharedInstance] getUnreadMessageCountByFilter:filter succ:^(UInt64 totalUnreadCount) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter success totalUnreadCount:%llu", totalUnreadCount]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter failed"]];
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

V2TIMConversationListFilter filter;
filter.type = V2TIM_C2C; // Pull c2c chat
// filter.type = V2TIM_GROUP; // Pull group chat
auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Successfully retrieved the total unread count of partial conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to retrieve the total unread count of partial conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->GetUnreadMessageCountByFilter(filter, callback);
```

#### Grouped Conversations

Sample code:

【Java】
``` java
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setConversationGroup("conversation_group");

V2TIMManager.getConversationManager().getUnreadMessageCountByFilter(filter, new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long totalUnreadCount) {
        tvLog.setText("getUnreadMessageCountByFilter success, totalUnreadCount:" + totalUnreadCount);
    }

    @Override
    public void onError(int code, String desc) {
        tvLog.setText("getUnreadMessageCountByFilter failed");
    }
});
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.conversationGroup = "swift conv group"
V2TIMManager.shared.getUnreadMessageCountByFilter(filter: filter) { totalCount in
    print("getTotalUnreadMessageCount succ, \(totalCount)")
} fail: { code, desc in
    print("getTotalUnreadMessageCount fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.conversationGroup = @"conversation_group";

[[V2TIMManager sharedInstance] getUnreadMessageCountByFilter:filter succ:^(UInt64 totalUnreadCount) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter success totalUnreadCount:%llu", totalUnreadCount]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter failed"]];
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

V2TIMConversationListFilter filter;
filter.conversationGroup = "conversation_group";
auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Successfully retrieved the total unread count of partial conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to retrieve the total unread count of partial conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->GetUnreadMessageCountByFilter(filter, callback);
```

#### Marked Conversations

Sample code:

【Java】
``` java
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setMarkType(V2TIMConversation.V2TIM_CONVERSATION_MARK_TYPE_STAR);

V2TIMManager.getConversationManager().getUnreadMessageCountByFilter(filter, new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long totalUnreadCount) {
        tvLog.setText("getUnreadMessageCountByFilter success, totalUnreadCount:" + totalUnreadCount);
    }

    @Override
    public void onError(int code, String desc) {
        tvLog.setText("getUnreadMessageCountByFilter failed");
    }
});
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.markType = .V2TIM_CONVERSATION_MARK_TYPE_STAR;
V2TIMManager.shared.getUnreadMessageCountByFilter(filter: filter) { totalCount in
    print("getTotalUnreadMessageCount succ, \(totalCount)")
} fail: { code, desc in
    print("getTotalUnreadMessageCount fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;

[[V2TIMManager sharedInstance] getUnreadMessageCountByFilter:filter succ:^(UInt64 totalUnreadCount) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter success totalUnreadCount:%llu", totalUnreadCount]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter failed"]];
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

V2TIMConversationListFilter filter;
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;
auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Successfully retrieved the total unread count of partial conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to retrieve the total unread count of partial conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->GetUnreadMessageCountByFilter(filter, callback);
```

#### Conversations with Unread Count

Sample code:

【Java】
``` java
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setHasUnreadCount(true);

V2TIMManager.getConversationManager().getUnreadMessageCountByFilter(filter, new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long totalUnreadCount) {
        tvLog.setText("getUnreadMessageCountByFilter success, totalUnreadCount:" + totalUnreadCount);
    }

    @Override
    public void onError(int code, String desc) {
        tvLog.setText("getUnreadMessageCountByFilter failed");
    }
});
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.hasUnreadCount = true
V2TIMManager.shared.getUnreadMessageCountByFilter(filter: filter) { totalCount in
    print("getUnreadMessageCountByFilter succ, \(totalCount)")
} fail: { code, desc in
    print("getUnreadMessageCountByFilter fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.hasUnreadCount = YES;

[[V2TIMManager sharedInstance] getUnreadMessageCountByFilter:filter succ:^(UInt64 totalUnreadCount) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter success totalUnreadCount:%llu", totalUnreadCount]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter failed"]];
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

V2TIMConversationListFilter filter;
filter.hasUnreadCount = true;
auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Successfully retrieved the total unread count of partial conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to retrieve the total unread count of partial conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->GetUnreadMessageCountByFilter(filter, callback);
```

#### Conversations with Group @ Messages

Sample code:

【Java】
``` java
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setHasGroupAtInfo(true);

V2TIMManager.getConversationManager().getUnreadMessageCountByFilter(filter, new V2TIMValueCallback<Long>() {
    @Override
    public void onSuccess(Long totalUnreadCount) {
        tvLog.setText("getUnreadMessageCountByFilter success, totalUnreadCount:" + totalUnreadCount);
    }

    @Override
    public void onError(int code, String desc) {
        tvLog.setText("getUnreadMessageCountByFilter failed");
    }
});
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.hasGroupAtInfo = true

V2TIMManager.shared.getUnreadMessageCountByFilter(filter: filter) { totalCount in
    print("getUnreadMessageCountByFilter succ, \(totalCount)")
} fail: { code, desc in
    print("getUnreadMessageCountByFilter fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.hasGroupAtInfo = YES;

[[V2TIMManager sharedInstance] getUnreadMessageCountByFilter:filter succ:^(UInt64 totalUnreadCount) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter success totalUnreadCount:%llu", totalUnreadCount]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"getUnreadMessageCountByFilter failed"]];
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

V2TIMConversationListFilter filter;
filter.hasGroupAtInfo = true;
auto callback = new ValueCallback<uint64_t>{};
callback->SetCallback(
    [=](const uint64_t& count) {
        // Successfully retrieved the total unread count of partial conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to retrieve the total unread count of partial conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->GetUnreadMessageCountByFilter(filter, callback);
```

### Unread Count Changed Notification

#### Subscribe Notification

Call `addConversationListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a806534684e5d4d01b94126cd1397fee4)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.addconversationlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a39b4f352f1740171fb56143149201cd9)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#adb2c20ca824cac69d0703169f3a025a1)) to add a conversation listener. Then call the `subscribeUnreadMessageCountByFilter` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a27b7c9477c5a2fb4c4f05b2e499d6f61)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.subscribeunreadmessagecountbyfilter(filter:)) /[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a123e1e578a92fa68b7087857c816fbd2)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a39feb1af6519c85b0477b0244ec15b25)) API to register the listening for the changes of the total unread message count under specified filters.

You can get the changed total unread count in `onUnreadMessageCountChangedByFilter` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationListener.html#a774a1f3ba5276aa97b67c46f530bd500) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMConversationListener.html#v2timconversationlistener.onunreadmessagecountchangedbyfilter(filter:totalunreadcount:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMConversationListener-p.html#a9145537b01df07bb0795c23e3cfa9f67) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationListener.html#a26d1c28f8d4151e9899f3e7b109e17db)) of `V2TIMConversationListener`.

You can specify multiple filters for the unread count listening. The `filter` parameter in the `onUnreadMessageCountChangedByFilter` callback lists the filters specified when `subscribeUnreadMessageCountByFilter` is called. The `filter` parameter contains the `conversationType`, `conversationGroup`, and `markType` fields. We can distinguish between different filters by checking whether all three fields are the same.

Sample code:

【Java】
``` java
// Add a conversation listener
V2TIMManager.getConversationManager().addConversationListener(conversationListener);

// Register the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setConversationType(V2TIMConversation.V2TIM_GROUP);
filter.setConversationGroup("conversation_group");
filter.setMarkType(V2TIMConversation.V2TIM_CONVERSATION_MARK_TYPE_STAR);
V2TIMManager.getConversationManager().subscribeUnreadMessageCountByFilter(filter);

// Notification on the change of the total unread message count under specified filters
public void onUnreadMessageCountChangedByFilter(V2TIMConversationListFilter filter, long totalUnreadCount) {
    // `filter` indicates the filter conditions. `totalUnreadCount` indicates the total unread message count.
    Log.i(TAG, "onUnreadMessageCountChangedByFilter:" + totalUnreadCount + "\n");
}
```

【Swift】
``` swift
// Add a conversation listener
V2TIMManager.shared.addConversationListener(listener: self)

// Register the listening for the changes of the total unread message count under specified filters
let filter = V2TIMConversationListFilter()
filter.type = .V2TIM_GROUP;
filter.conversationGroup = "swift conv group"
filter.markType = .V2TIM_CONVERSATION_MARK_TYPE_STAR;
V2TIMManager.shared.unsubscribeUnreadMessageCountByFilter(filter: filter)

// Notification on the change of the total unread message count under specified filters
func onUnreadMessageCountChangedByFilter(filter: V2TIMConversationListFilter, totalUnreadCount: UInt) {
    // `filter` indicates the filter conditions. `totalUnreadCount` indicates the total unread message count.
    print("\(filter), count:\(totalUnreadCount)")
}
```

【Objective-C】
``` objectivec
// Add a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// Register the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.type = V2TIM_GROUP;
filter.conversationGroup = @"conversation_group";
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;
[[V2TIMManager sharedInstance] subscribeUnreadMessageCountByFilter:filter];

// Notification on the change of the total unread message count under specified filters
- (void)onUnreadMessageCountChangedByFilter:(V2TIMConversationListFilter *)filter totalUnreadCount:(UInt64)totalUnreadCount {
    // `filter` indicates the filter conditions. `totalUnreadCount` indicates the total unread message count.
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
      // Notification on the change of the total unread message count under specified filters
    void OnUnreadMessageCountChangedByFilter(const V2TIMConversationListFilter &filter, uint64_t totalUnreadCount) override {
         // `filter` indicates the filter conditions. `totalUnreadCount` indicates the total unread message count.
    }
    // Other member functions...
};

// Add a conversation event listener. Keep `conversationListener` valid before the listener is removed to ensure event callbacks are received.
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);

// Register the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter filter;
filter.type = V2TIM_GROUP;
filter.conversationGroup = "conversation_group";
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;
V2TIMManager::GetInstance()->GetConversationManager()->SubscribeUnreadMessageCountByFilter(filter);
```

#### Unsubscribe Notification

Call the `unsubscribeUnreadMessageCountByFilter` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#adbf33f34fa911bbeec55cf3a4f320ba7) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.unsubscribeunreadmessagecountbyfilter(filter:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#ae87d91af763df945ed4750cbda079bf2) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a8b8bf0ed2575efdc08f0b6a7e04faafa)) API to cancel the listening for the changes of the total unread message count under specified filters.

Sample code:

【Java】
``` java
// Cancel the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter filter = new V2TIMConversationListFilter();
filter.setConversationType(V2TIMConversation.V2TIM_GROUP);
filter.setConversationGroup("conversation_group");
filter.setMarkType(V2TIMConversation.V2TIM_CONVERSATION_MARK_TYPE_STAR);
V2TIMManager.getConversationManager().unsubscribeUnreadMessageCountByFilter(filter);
```

【Swift】
``` swift
let filter = V2TIMConversationListFilter()
filter.type = .V2TIM_GROUP;
filter.conversationGroup = "swift conv group"
filter.markType = .V2TIM_CONVERSATION_MARK_TYPE_STAR;
V2TIMManager.shared.unsubscribeUnreadMessageCountByFilter(filter: filter)
```

【Objective-C】
``` objectivec
// Cancel the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter *filter = [[V2TIMConversationListFilter alloc] init];
filter.type = V2TIM_GROUP;
filter.conversationGroup = @"conversation_group";
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;
[[V2TIMManager sharedInstance] unsubscribeUnreadMessageCountByFilter:filter];
```

【C++】
``` cpp
// Cancel the listening for the changes of the total unread message count under specified filters
V2TIMConversationListFilter filter;
filter.type = V2TIM_GROUP;
filter.conversationGroup = "conversation_group";
filter.markType = V2TIM_CONVERSATION_MARK_TYPE_STAR;
V2TIMManager::GetInstance()->GetConversationManager()->UnsubscribeUnreadMessageCountByFilter(filter);
```

### Clear Unread Message Count

After the user clicks to enter a conversation and then goes back to the conversation list, the unread count needs to be cleared. Once the unread count is reset, the red dot or numeric badge in the conversation list usually needs to disappear.

You can call `cleanConversationUnreadMessageCount`([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a5887d1954d32fad68bc569e6f136770d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.cleanconversationunreadmessagecount(conversationid:cleantimestamp:cleansequence:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a820c2f598f7554428fb980df3f7357f0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a07c3643440d1ec96ede4a4e67e7b52a9)) to clear the unread message count of specific conversations. This is done by passing parameters in a certain format to differentiate between types of conversations. The specific steps are described below.

> **Note:**
> The feature to clear the unread message count of specified sessions is only supported by the Enhanced SDK version 7.1.3925 and above. 
> 

#### Specified One-to-one Chat

You can clear the unread message count of a specified one-to-one chat conversation by passing in a conversationID with the "c2c_" prefix. You can also clear the unread message count up to a certain timestamp by passing in cleanTimestamp. If the cleanTimestamp passed in is 0, the unread count for the specified private chat session will be cleared to 0.

Sample code:

【Java】
``` java
String conversationID = "c2c_userID";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 123456, 0, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.cleanConversationUnreadMessageCount(conversationID: "c2c_userID", cleanTimestamp: 123456, cleanSequence: 0, succ: {
    // Successfully cleared the unread count for the specified one-to-one chat conversation
}) { code, desc in
    // Failed to clear the unread count for the specified one-to-one chat conversation
}

```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] cleanConversationUnreadMessageCount:@"c2c_userID"
                                                    cleanTimestamp:123456
                                                     cleanSequence:0
                                                              succ:^{
    // Successfully cleared the unread count for the specified one-to-one chat conversation
} fail:^(int code, NSString *msg) {
    // Failed to clear the unread count for the specified one-to-one chat conversation
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
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

V2TIMString conversationID = u8"c2c_userID";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Successfully cleared the unread count for the specified one-to-one chat conversation
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to clear the unread count for the specified one-to-one chat conversation
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->CleanConversationUnreadMessageCount(conversationID, 123456, 0, callback);
```

When user calls `cleanConversationUnreadMessageCount` successfully, if the caller has previously added a conversation listener by calling `addConversationListener`, it will receive the `onConversationChanged` callback. This callback return the latest unread message count of the corresponding conversation and can be used to update the UI in this callback.

Sample code:

【Java】
``` java
public void onConversationChanged(List<V2TIMConversation> conversationList) {
    // The caller receives the notification of session information change
    Log.i("imsdk", "onConversationChanged");
}
```

【Swift】
``` swift
// Adding a conversation listener
V2TIMManager.shared.addConversationListener(listener: self)

// The caller receives the notification of session information change
func onConversationChanged(conversationList: Array<V2TIMConversation>) {
    // Update the corresponding UI based on V2TIMConversation in conversationList
    conversationList.forEach { item in
        print(item.description)
    }
}
```

【Objective-C】
``` objectivec
// Adding a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// The caller receives the notification of session information change
- (void)onConversationChanged:(NSArray<V2TIMConversation*> *)conversationList {
    // Update the corresponding UI based on V2TIMConversation in conversationList
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    /**
     * When key information in some conversations changes (such as changes in unread count, or the last message being updated), the conversations
     * can be re-sorted based on lastMessage -> timestamp
     *
     * @param conversationList Conversation List
     */
    void OnConversationChanged(const V2TIMConversationVector& conversationList) override {}
    // Other members...
};

// Add a session event listener. Note that you must maintain the lifespan of the conversationListener before removing the listener to ensure event callbacks are received
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

#### All One-to-one Chats

You can pass "c2c" as the conversationID to clear the unread count of all one-to-one chat conversations to zero. Please note that cleanTimestamp will not take effect in this case.

Sample code:

【Java】
``` java
String conversationID = "c2c";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 0, 0, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.cleanConversationUnreadMessageCount(conversationID: "c2c", cleanTimestamp: 0, cleanSequence: 0, succ: {
    // Successfully cleared the unread message count for all one-to-one chat conversations
    
}) { code, desc in
    // Failed to clear the unread message count for all one-to-one chat conversations
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] cleanConversationUnreadMessageCount:@"c2c"
                                                    cleanTimestamp:0
                                                     cleanSequence:0
                                                              succ:^{
    // Successfully cleared the unread message count for all one-to-one chat conversations
} fail:^(int code, NSString *msg) {
    // Failed to clear the unread message count for all one-to-one chat conversations
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
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

V2TIMString conversationID = u8"c2c";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Successfully cleared the unread message count for all private chat sessions
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to clear the unread message count for all private chat sessions
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->CleanConversationUnreadMessageCount(conversationID, 0, 0, callback);
```

When user calls `cleanConversationUnreadMessageCount` successfully, if the caller has previously added a conversation listener by calling `addConversationListener`, it will receive the `onConversationChanged` callback. This callback return the latest unread message count of the corresponding session and can be used to update the UI in this callback.

Sample code:

【Java】
``` java
public void onConversationChanged(List<V2TIMConversation> conversationList) {
    // The caller receives the notification of conversation information change
    Log.i("imsdk", "onConversationChanged");
}
```

【Swift】
``` swift
// Adding a conversation listener
V2TIMManager.shared.addConversationListener(listener: self)
// The caller receives the notification of conversation information change
func onConversationChanged(conversationList: Array<V2TIMConversation>) {
    // Update the corresponding UI based on V2TIMConversation in conversationList, such as removing the red dot from the one-to-one chat conversation cell
    conversationList.forEach { item in
        print(item.description)
    }
}
```

【Objective-C】
``` objectivec
// Adding a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// The caller receives the notification of conversation information change
- (void)onConversationChanged:(NSArray<V2TIMConversation*> *)conversationList {
    // Update the corresponding UI based on V2TIMConversation in conversationList, such as removing the red dot from the one-to-one chat conversation cell
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    /**
     * When key information in some conversations changes (such as changes in unread count, or the last message being updated), the conversations
     * can be re-sorted based on lastMessage -> timestamp
     *
     * @param conversationList Conversation List
     */
    void OnConversationChanged(const V2TIMConversationVector& conversationList) override {}
    // Other members...
};

// Add a conversation event listener. Note that you must maintain the lifespan of the conversationListener before removing the listener to ensure event callbacks are received
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

#### Specified Group Chat

You can clear the unread message count of specified group chat conversation by passing a conversationID with a "group_" prefix. You can also clear the unread message count up to a specified sequence by passing in cleanSequence. If the passed cleanSequence is 0, the unread count of the specified group chat session will be cleared to 0.

Sample code:

【Java】
``` java
String conversationID = "group_groupID";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 0, 123, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.cleanConversationUnreadMessageCount(conversationID: "group_groupID", cleanTimestamp: 123456, cleanSequence: 0, succ: {
    // Cleared the unread message count for the specified group chat conversation successfully
    }) { code, desc in
    // Failed to clear the unread message count for the specified group chat conversation
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] cleanConversationUnreadMessageCount:@"group_groupID"
                                                    cleanTimestamp:0
                                                     cleanSequence:123
                                                              succ:^{
    // Cleared the unread message count for the specified group chat conversation successfully
} fail:^(int code, NSString *msg) {
    // Failed to clear the unread message count for the specified group chat conversation
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
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

V2TIMString conversationID = u8"group_groupID";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Cleared the unread message count for the specified group chat conversation successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to clear the unread message count for the specified group chat conversation
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->CleanConversationUnreadMessageCount(conversationID, 0, 123, callback);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has previously added a conversation listener with `addConversationListener`, they will receive the `onConversationChanged` callback. This callback return the latest unread message count for the respective session and allows for UI updates.

Sample code:

【Java】
``` java
public void onConversationChanged(List<V2TIMConversation> conversationList) {
    // The caller receives the notification of conversation information change
    Log.i("imsdk", "onConversationChanged");
}
```

【Swift】
``` swift
// Adding a conversation listener
V2TIMManager.shared.addConversationListener(listener: self)

// The caller receives the notification of conversation information change
func onConversationChanged(conversationList: Array<V2TIMConversation>) {
    // Update the corresponding UI based on V2TIMConversation in conversationList
    conversationList.forEach { item in
        print(item.description)
    }
}
```

【Objective-C】
``` objectivec
// Adding a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// The caller receives the notification of conversation information change
- (void)onConversationChanged:(NSArray<V2TIMConversation*> *)conversationList {
    // Update the corresponding UI based on V2TIMConversation in conversationList
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    void OnConversationChanged(const V2TIMConversationVector& conversationList) override {}
    // The caller receives the notification of conversation information change
};

// Add a conversation event listener. Note that you must maintain the lifespan of the conversationListener before removing the listener to ensure event callbacks are received
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

### Clear the unread counts of all group chat sessions

You can pass "group" as the conversationID, which resets all group chat session unread counts to zero. Please note that cleanSequence will not take effect at this time.

[Java]

```java
String conversationID = "group";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 0, 0, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

#### All Group Chats

You can pass "group" as the conversationID, which clears all group chat conversation unread counts to zero. Please note that cleanSequence will not take effect at this time.

【Java】
``` java
String conversationID = "group";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 0, 0, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.cleanConversationUnreadMessageCount(conversationID: "group", cleanTimestamp: 0, cleanSequence: 0, succ: {
    // Successfully cleared the unread message count for all group chat sessions
}) { code, desc in
    // Failed to clear all group chat sessions' unread message counts
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] cleanConversationUnreadMessageCount:@"group"
                                                    cleanTimestamp:0
                                                     cleanSequence:0
                                                              succ:^{
    // Successfully cleared the unread message count for all group chat sessions
} fail:^(int code, NSString *msg) {
    // Failed to clear all group chat sessions' unread message counts
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
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

V2TIMString conversationID = u8"group";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Successfully cleared all group chat sessions' unread message counts
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to clear all group chat sessions' unread message counts
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->CleanConversationUnreadMessageCount(conversationID, 0, 0, callback);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has previously added a conversation listener with `addConversationListener`, they will receive the `onConversationChanged` callback. This callback return the latest unread message count for the respective session and allows for UI updates.

Sample code:

【Java】
``` java
public void onConversationChanged(List<V2TIMConversation> conversationList) {
    // The caller receives the notification of conversation information change
    Log.i("imsdk", "onConversationChanged");
}
```

【Swift】
``` swift
V2TIMManager.shared.addConversationListener(listener: self)

func onConversationChanged(conversationList: Array<V2TIMConversation>) {
    // Update the corresponding UI based on V2TIMConversation in conversationList, such as removing the red dot from the group chat conversation cell
    conversationList.forEach { item in
        print(item.description)
    }
}
```

【Objective-C】
``` objectivec
// Adding a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// The caller receives the notification of conversation information change
- (void)onConversationChanged:(NSArray<V2TIMConversation*> *)conversationList {
    // Update the corresponding UI based on V2TIMConversation in conversationList, such as removing the red dot from the group chat conversation cell
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    void OnConversationChanged(const V2TIMConversationVector& conversationList) override {}
    // The caller receives the notification of conversation information change
};

// Add a conversation event listener. Note that you must maintain the lifespan of the conversationListener before removing the listener to ensure event callbacks are received
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

#### All Conversations

You can pass an empty string "" as the conversationID to clear the unread message count of all conversations to zero. Please note that cleanTimestamp and cleanSequence will not take effect in this case.

Sample code:

【Java】
``` java
String conversationID = "";
V2TIMManager.getConversationManager().cleanConversationUnreadMessageCount(conversationID, 0, 0, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.cleanConversationUnreadMessageCount(conversationID: "", cleanTimestamp: 0, cleanSequence: 0, succ: {
    // Successfully cleared the Unread Count of All Conversations
    }) { code, desc in
    // Failed to clear the Unread Count of All Conversations
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] cleanConversationUnreadMessageCount:@""
                                                    cleanTimestamp:0
                                                     cleanSequence:0
                                                              succ:^{
    // Successfully cleared the Unread Count of All Conversations
} fail:^(int code, NSString *desc) {
    // Failed to clear the Unread Count of All Conversations
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
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

V2TIMString conversationID = u8"";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Successfully cleared the Unread Count of All Conversations
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to clear the Unread Count of All Conversations
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->CleanConversationUnreadMessageCount(conversationID, 0, 0, callback);
```

After `cleanConversationUnreadMessageCount` is called successfully, if the caller has previously added a session listener with `addConversationListener`, they will receive the `onConversationChanged` callback. This callback carries the latest unread message count for the respective session and allows for UI updates.

Below is the sample code:

【Java】
``` java
public void onConversationChanged(List<V2TIMConversation> conversationList) {
    // Received the notification of a change in the conversation information
    Log.i("imsdk", "onConversationChanged");
}
```

【Swift】
``` swift
// Adding a conversation listener
V2TIMManager.shared.addConversationListener(listener: self)

// The caller receives the notification of session information change
func onConversationChanged(conversationList: Array<V2TIMConversation>) {
    conversationList.forEach { item in
        print(item.description)
    }
}
```

【Objective-C】
``` objectivec
// Adding a conversation listener
[[V2TIMManager sharedInstance] addConversationListener:self];

// The caller receives the notification of session information change
- (void)onConversationChanged:(NSArray<V2TIMConversation*> *)conversationList {
    // Update UI, such as removing the red dot from the bottom tab of the Conversation List
}
```

【C++】
``` cpp
class ConversationListener final : public V2TIMConversationListener {
public:
    void OnConversationChanged(const V2TIMConversationVector& conversationList) override {}
    // The caller receives the notification of session information change
};

// Add a session event listener. Note that you must maintain the lifespan of the conversationListener before removing the listener to ensure event callbacks are received
ConversationListener conversationListener;
V2TIMManager::GetInstance()->GetConversationManager()->AddConversationListener(&conversationListener);
```

### Sending a Message Without Updating Unread Count 

In normal cases, both one-to-one messages and group messages that are sent will be included in the unread count. Specifically, you can get the conversation unread count through the `unreadCount` of the `V2TIMConversation` conversation object.
If you want to send messages that will not be included in the unread count, such as tips or control messages, when calling `sendMessage`, you can:
- Java: call `setExcludedFromUnreadCount` and set it to `true`.

- iOS/C++: set the message object `isExcludedFromUnreadCount` to `YES`/`true`.

   For how to use `sendMessage`, see [Sending Message](https://intl.cloud.tencent.com/document/product/1047/47994).

   > **Note: **
   > 
   >  The `setExcludedFromUnreadCount` or `isExcludedFromUnreadCount` parameter is supported only by the SDK of the Enhanced edition on v5.3.425 or later.
   > 

   Sample code:

   

【Java】
``` java
// Create the message object
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createTextMessage(content);
// Set not to update the `lastMessage` of the conversation
v2TIMMessage.setExcludedFromUnreadCount(true);

// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "userID", null, V2TIMMessage.V2TIM_PRIORITY_DEFAULT, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onSuccess(V2TIMMessage v2TIMMessage) {
        Log.i("imsdk", "success");
    }

    @Override
    public void onProgress(int progress) {
        Log.i("imsdk", "progress:" + progress);
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
if let message = V2TIMManager.shared.createTextMessage(text: "This is a signaling message") {
    // Set the identifier for excluding from the unread message count
    message.isExcludedFromUnreadCount = true
    // Send the message
    V2TIMManager.shared.sendMessage(message: message, receiver: "userA", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: true, offlinePushInfo: nil, progress: nil, succ: {
        // Message sent successfully
    }, fail: { code, msg in
        // Failed to send the message
    })
}
```

【Objective-C】
``` objectivec
// Create the message object
V2TIMMessage *message = [[V2TIMManager sharedInstance] createTextMessage:@"This is a signaling message"];

// Set the identifier for excluding from the unread message count
message.isExcludedFromUnreadCount = YES;

// Send the message
[[V2TIMManager sharedInstance] sendMessage:msg receiver:@"userA" groupID:nil
priority:V2TIM_PRIORITY_DEFAULT onlineUserOnly:YES offlinePushInfo:nil progress:^(uint32_t progress) {
} succ:^{
    // Message sent successfully
} fail:^(int code, NSString *msg) {
    // Failed to send the message
}];
```

【C++】
``` cpp
class SendCallback final : public V2TIMSendCallback {
public:
    using SuccessCallback = std::function<void(const V2TIMMessage&)>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using ProgressCallback = std::function<void(uint32_t)>;

    SendCallback() = default;
    ~SendCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     ProgressCallback progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        progress_callback_ = std::move(progress_callback);
    }

    void OnSuccess(const V2TIMMessage& message) override {
        if (success_callback_) {
            success_callback_(message);
        }
    }
    void OnError(int error_code, const V2TIMString& error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
    void OnProgress(uint32_t progress) override {
        if (progress_callback_) {
            progress_callback_(progress);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    ProgressCallback progress_callback_;
};

// Create the message object
V2TIMMessage message = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage(u8"content");
// Set not to update the `lastMessage` of the conversation
message.isExcludedFromUnreadCount = true;

auto callback = new SendCallback{};
callback->SetCallback([=](const V2TIMMessage& message) { delete callback; },
                      [=](int error_code, const V2TIMString& error_message) { delete callback; },
                      [=](uint32_t progress) {});

V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    message, u8"userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

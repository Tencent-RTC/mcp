---
sync_node_id: '108053262598971392'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "获取会话"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

The SDK provides an API for getting conversations, which can be used to get the `V2TIMConversation` object information of one or multiple specified conversations.

### Getting a specified conversation

Call `getConversation` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a619aaff2bb5664e094d2341819b95096) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.getconversation(conversationid:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#ad4b7b80fbe0cff25027371b416ede9f9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a9891f4b029e7a1fd3d17398cbe1b367c)) to get the information of a conversation, which is a `V2TIMConversation` object. The composition of `conversationID` can be referred to the [Overview](https://www.tencentcloud.com/document/product/1047/48329).

Sample code:

【Java】
``` java
String conversationID = "conversationID";
V2TIMManager.getConversationManager().getConversation(conversationID, new V2TIMValueCallback<V2TIMConversation>() {
    @Override
    public void onSuccess(V2TIMConversation v2TIMConversation) {
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
V2TIMManager.shared.getConversationList(nextSeq: 0, count: Int32.max) { list, nextSeq, isFinished in
    list.forEach { item in
        print(item.description)
    }
} fail: { code, desc in
    print("getConversationList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance getConversation:@"conversationID" // ID of the conversation to be queried
                                        succ:^(V2TIMConversation *conv) {
    // The conversation obtained successfully. The `V2TIMConversation` object was returned.
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

V2TIMString conversationID = u8"conversationID";

auto callback = new ValueCallback<V2TIMConversation>{};
callback->SetCallback(
    [=](const V2TIMConversation& conversation) {
        // Obtained the conversation successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the conversation
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->GetConversation(conversationID, callback);
```

### Getting specified conversations

Call `getConversationList` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a41ebb09032a6bbda0a78e8734c61fb93) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.getconversationlist(conversationidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#ab1f5e86e270b122cb725266d234d9dd5) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#aa1aec337ed398f603f15f14ee9023d62)) to get the list of specified conversations that stores `V2TIMConversation` objects.

Sample code:

【Java】
``` java
List<String> conversationIDList = new ArrayList<>();
conversationIDList.add("conversationID1");
conversationIDList.add("conversationID1");

V2TIMManager.getConversationManager().getConversationList(conversationIDList, new V2TIMValueCallback<List<V2TIMConversation>>() {
    @Override
    public void onSuccess(List<V2TIMConversation> conversationList) {
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
V2TIMManager.shared.getConversationList(conversationIDList: ["conversationID1", "conversationID2"]) { list in
    list.forEach { item in
        print(item.description)
    }
} fail: { code, desc in
    print("getConversationList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance getConversationList:@[@"convID1", @"convID2"] // List of IDs of the conversations to be queried
                                            succ:^(NSArray<V2TIMConversation *> *list) {
    // Conversations obtained successfully. The `list` contains `V2TIMConversation` objects.
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

V2TIMStringVector conversationIDList;
conversationIDList.PushBack(u8"conversationID1");
conversationIDList.PushBack(u8"conversationID2");

auto callback = new ValueCallback<V2TIMConversationVector>{};
callback->SetCallback(
    [=](const V2TIMConversationVector& conversationList) {
        // Obtained multiple conversations successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain multiple conversations
        delete callback;
    });

V2TIMManager::GetInstance()->GetConversationManager()->GetConversationList(conversationIDList, callback);
```

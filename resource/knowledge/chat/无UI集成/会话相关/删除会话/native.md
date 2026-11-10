---
sync_node_id: '108053260862529536'
nav_path:
  - "无 UI 集成"
  - "会话相关"
  - "删除会话"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

After a user deletes a friend or leaves a group, the SDK will not automatically delete the corresponding one-to-one or group conversation. The user can call the following API to delete the conversation.

> **Note：**
> - Multi-client sync for conversation deletion is supported only by the SDK on v5.1.1 or later.
> - Session deletion does not support multi-client sync by default. You can enable it in the [Console](https://console.trtc.io/). Toggle Path: Applications > Your App > Chat > Configuration > Login and Message > Multi-client Synchronization Settings.

## Delete a Single Conversation

Call the `deleteConversation` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a7a6e38c5a7431646bd4c0c4c66279077) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.deleteconversation(conversation:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a142f5289632f29a603937f1d770748c6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a1ada2a3c1c0ae08920bdf16ab994a1ed)) to delete a specified conversation.

> **Note：**
> When a conversation is deleted, the historical messages will be deleted from both the client and the server and cannot be recovered. If you want to keep historical messages, please [delete multiple conversations](https://www.tencentcloud.com/document/product/1047/48314).
> 

Sample code:

【Java】
``` java
String conversationID = "conversationID";
V2TIMManager.getConversationManager().deleteConversation(conversationID, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // The conversation is deleted successfully.
    }
    @Override
    public void onError(int code, String desc) {
        // Failed to delete the conversation
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.deleteConversation(conversation: "conversationID") {
    print("deleteConversation succ")
} fail: { code, desc in
    print("deleteConversation fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSString *conversationID = @"conversationID";
[[V2TIMManager sharedInstance] deleteConversation:conversationID
    succ:^{
        // The conversation is deleted successfully.
    }
    fail:^(int code, NSString *desc) {
        // Failed to delete the conversation
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

V2TIMString groupName = u8"conversationID";
auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // The conversation is deleted successfully.
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the conversation
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->DeleteConversationGroup(groupName, callback);
```

## Delete Multiple Conversations

Call the `deleteConversation` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a7a6e38c5a7431646bd4c0c4c66279077) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.deleteconversationlist(conversationidlist:clearmessage:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a142f5289632f29a603937f1d770748c6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#a1ada2a3c1c0ae08920bdf16ab994a1ed)) to delete specified conversations. When `clearMessage` is set to false, the historical messages will be retained; when set to true, client and server messages will be deleted together and cannot be restored.

> **Note：**
> - This feature is supported only by the SDK on v7.1 or later.
> - Up to 100 conversations can be deleted at a time.

Sample code:

【Java】
``` java
List<String> conversationIDList = new ArrayList<>();
conversationIDList.add("c2c_userID");
conversationIDList.add("group_groupID");
V2TIMManager.getConversationManager().deleteConversationList(
    conversationIDList, true, new V2TIMValueCallback<List<V2TIMConversationOperationResult>>() {
        @Override
        public void onSuccess(List<V2TIMConversationOperationResult> results) {
            // The conversations are deleted successfully.
            for (V2TIMConversationOperationResult result : results) {
                int code = result.getResultCode();
                String info = result.getResultInfo();
                String conversationID = result.getConversationID();
            }
        }
        @Override
        public void onError(int code, String desc) {
            // Failed to delete the conversations
        }
    });
```

【Swift】
``` swift
V2TIMManager.shared.deleteConversationList(
    conversationIDList: ["c2c_userID", "group_groupID"], clearMessage: true
) { result in
    print( "deleteConversationList succ")
} fail: { code, desc in
    print("deleteConversationList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *conversationIDList = [NSMutableArray array];
[conversationIDList addObject:@"c2c_userID"];
[conversationIDList addObject:@"group_groupID"];
[[V2TIMManager sharedInstance] deleteConversationList:conversationIDList
    clearMessage:true
    succ:^(NSArray<V2TIMConversationOperationResult *> *results) {
        // The conversations are deleted successfully.
        for (V2TIMConversationOperationResult *result in results) {
            int code = result.resultCode;
            NSString *info = result.resultInfo;
            NSString *conversationID = result.conversationID;
        }
    }
    fail:^(int code, NSString *desc) {
        // Failed to delete the conversations
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
conversationIDList.PushBack(u8"c2c_userID");
conversationIDList.PushBack(u8"group_groupID");
auto callback = new ValueCallback<V2TIMConversationOperationResultVector>{};
callback->SetCallback(
    [=](const V2TIMConversationOperationResultVector& results) {
        // The conversations are deleted successfully.
        for (size_t i = 0; i < results.Size(); ++i) {
            const V2TIMConversationOperationResult& result = results[i];
            int code = result.resultCode;
            V2TIMString info = result.resultInfo;
            V2TIMString conversationID = result.conversationID;
        }
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the conversations
        delete callback;
    });
V2TIMManager::GetInstance()->GetConversationManager()->DeleteConversationList(conversationIDList, true, callback);
```

## Conversation Deleted Notification

If you have called `addConversationListener`([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a806534684e5d4d01b94126cd1397fee4) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.addconversationlistener(listener:)) / [iOS & Mac](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a39b4f352f1740171fb56143149201cd9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMConversationManager.html#adb2c20ca824cac69d0703169f3a025a1)) to add a conversation listener, you can get the notification that the conversation is deleted in `onConversationDeleted`.

【Java】
``` java
@Override
public void onConversationDeleted(List<String> conversationIDList) {
    Log.i("imsdk", "onConversationDeleted");
}
```

【Swift】
``` swift
func onConversationDeleted(conversationIDList: Array<String>) {
        conversationIDList.forEach { item in
            print(item.description)
        }
    }
```

【Objective-C】
``` objectivec
- (void)onConversationDeleted:(NSArray<NSString *> *)conversationIDList {
    // Received the notification that the conversation is deleted
}
```

【C++】
``` cpp
void OnConversationDeleted(const V2TIMStringVector &conversationIDList) override {
    // Received the notification that the conversation is deleted
}
```

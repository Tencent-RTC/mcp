---
sync_node_id: '108053273934077952'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "查询消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

You can call the `findMessages` API to query local message details by `messageID`, including messages with status `V2TIM_MSG_STATUS_LOCAL_REVOKED` (revoked) and `V2TIM_MSG_STATUS_HAS_DELETED` (deleted).

Typically, if you want to display a message list, you can only store the messageID in memory. When you need to display the message content, or to display more information through a long press/right-click on a message, you can call the `findMessages` API to obtain the details of specific messages, instead of loading the message objects into memory from the start, which will save memory.

> **Note:**
> 1. Only local messages can be queried, for example, received messages or historical messages pulled by API.
> 2. Audio-video group (AVChatRoom) messages cannot be queried, as they are not saved locally.
> 3. You can distinguish the status of messages by the status of V2TIMMessage.

## Querying a Local Message

Call the `findMessages` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#ad0dbaec04bc389d01f815f46c550e2fd) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.findmessages(messageidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a4a0c47d706d8784656225c1e9065f6f1)/ [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ac5531e73378b8b8eadd056ba99e5427e)) to query a local message.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().findMessages(messageIDList, new V2TIMValueCallback<List<V2TIMMessage>>() {
    @Override
    public void onSuccess(List<V2TIMMessage> v2TIMMessages) {}

    @Override
    public void onError(int code, String desc) {}
});
```

【Swift】
``` swift
V2TIMManager.shared.findMessages(messageIDList: ["1", "2", "3"]) { msgs in
    msgs.forEach { item in
        print("\(item.description)")
    }
} fail: { code, desc in
    print("code: \(code), desc: \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance findMessages:messageIDList
                                        succ:^(NSArray<V2TIMMessage *> *msgs) {
    // Messages queried successfully
} fail:^(int code, NSString *desc) {
    // Failed to query the messages
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

auto callback = new ValueCallback<V2TIMMessageVector>{};
callback->SetCallback(
    [=](const V2TIMMessageVector& messageVector) {
        // Messages queried successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to query the messages
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->FindMessages(messageIDList, callback);
```

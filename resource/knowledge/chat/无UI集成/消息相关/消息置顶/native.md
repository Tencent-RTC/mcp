---
sync_node_id: '142123962240290816'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息置顶"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Description

The message pinning feature allows specific messages to be fixed at the top of the list in the Chat App, maintaining their position at the top even when new messages are received. This feature helps users easily find and access messages they consider important or frequently viewed.

> **Note：**
> - The message pinning feature is supported in the enhanced edition 7.9 and later.
> - This feature is available exclusively to Pro edition 、Pro Plus edition、Enterprise edition customers, please [purchase the Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat) first.
> - Currently, the message pinning feature is only supported for ordinary groups.

## Effect

You can use this feature to achieve the following group chat message pinning effect:

### Pinning Message

Calling the `PinGroupMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aa345a7876bf0df29491429329a10f469)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.pingroupmessage(groupid:message:ispinned:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a4bd9a32e4525e75778708bfde5b95c62)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ace35ac347c02c608f5f61ce2a76599ad)) can set a message to be pinned at the top.

Detailed explanation of the input parameters for the message pinning API is as follows:

|Attribute|Meaning|Description|
|---------|---------|---------|
|groupID|Group ID|Indicates the ID of the group chat that requires message pinning/unpinning.|
|message|Message object|The message must have been sent successfully.|
|isPinned|Pinning/Unpinning action|Specifies whether to pin or unpin group messages.|

> **Note**
> 1. A group chat supports up to 10 pinned messages.
> 2. If the number of pinned messages exceeds the limit, calling the API will result in an ERR_SVR_GROUP_PINNED_MESSAGE_COUNT_LIMIT error.

Below is the sample code:

【Java】
``` java
V2TIMManager.getMessageManager().pinGroupMessage(groupID, message, true, new V2TIMCallback() {
    @Override
    public void onSuccess() {
       // Message pinning succeeded.
    }
    @Override
    public void onError(int code, String desc) {
       // Message pinning failed.
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.pinGroupMessage(groupID: "groupID", message: message, isPinned: true) {
    print("pinGroupMessage succ")
} fail: { code, desc in
    print("pinGroupMessage fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] pinGroupMessage:self.groupID message:message isPinned:YES succ:^{
    // Message pinning succeeded.
} fail:^(int code, NSString *desc) {
    // Message pinning failed.
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString &)>;
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
    void OnError(int error_code, const V2TIMString & error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

auto *callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Message pinning succeeded.
        delete callback;
    },
    [=](int error_code, const V2TIMString & error_message) {
        // Message pinning failed.
        delete callback;
    });
V2TIMManager::GetInstance()->GetMessageManager()->PinGroupMessage(groupID, message, true, callback);
```

### Getting the pinned messages

Calling the `GetPinnedGroupMessageList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a35c28770388fa0b1c51946b314287786) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getpinnedgroupmessagelist(groupid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#afee75362418c0dbd3f2337fea5865179) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a174f9f9595661f8229975f537fd741eb)) can obtain the pinned message list.

If you need to get the pinner of a message, you can do so through the pinnerInfo field of the V2TIMMessag.

Detailed explanation of the input parameters for the message pinning API is as follows:

|Attribute|Meaning|Description|
|---------|---------|---------|
|groupID|Group ID|Indicates the ID of the group chat for which the pinned message list needs to be obtained.|

> **Note**
> This API is used to obtain the pinned message list. If the roaming of the pinned message has expired (in 7 days for trial edition and 30 days for Pro edition 、Pro Plus edition、Enterprise edition), it will not return any result.
> 

Below is the sample code:

【Java】
``` java
V2TIMManager.getMessageManager().getPinnedGroupMessageList(groupID, new V2TIMValueCallback<List<V2TIMMessage>>() {
    @Override
    public void onSuccess(List<V2TIMMessage> v2TIMMessages) {
       // Succeeded in obtaining the pinned message list.
    }
    @Override
    public void onError(int code, String desc) {
       // Failed to obtain the pinned message list.
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getPinnedGroupMessageList(groupID: "groupID") { msgs in
    msgs.forEach { item in
        print( "\(item.description)")
        if let info = item.revokerInfo {
            print( "exist, id:\(info.userID)")
        } else {
            print("not exist")
        }
    }
} fail: { code, desc in
    print("getGroupCounters fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getPinnedGroupMessageList:self.groupID succ:^(NSArray<V2TIMMessage *> *messageList) {
        // Succeeded in obtaining the pinned message list.
} fail:^(int code, NSString *desc) {
        // Failed to obtain the pinned message list.
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
    void OnError(int error_code, const V2TIMString & error_message) override {
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
        // Succeeded in obtaining the pinned message list.
        delete callback;
    },
    [=](int error_code, const V2TIMString & error_message) {
        // Failed to obtain the pinned message list.
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->GetPinnedGroupMessageList(groupID, callback);
```

### Pinned message list change notification

If you have added an advanced message event listener by calling `addAdvancedMsgListener`, you will receive the `onGroupMessagePinned` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#a69954fdd1093ee4b7c3a08c277956198)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.ongroupmessagepinned(groupid:message:ispinned:opuser:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#a0946f7c3e62d1b5c7f2157aab11cb9e8) /[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#a1b6226155e451274ad8b55b2a5157aa6)) callback when the pinned message list is updated.

> **Note**
> If the change type is unpinning, the message parameter will only contain the sender, serial number, random number, and timestamp as valid fields, without a complete message body.
> 

Below is the sample code:

【Java】
``` java
V2TIMManager.getMessageManager().addAdvancedMsgListener(new V2TIMAdvancedMsgListener() {
    @Override
    public void onGroupMessagePinned(String groupID, V2TIMMessage message, boolean isPinned, V2TIMGroupMemberInfo opUser) {
        // Receives notification of changes to the pinned message list.
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.addAdvancedMsgListener(listener: self)

func onGroupMessagePinned(groupID: String, message: V2TIMMessage, isPinned: Bool, opUser: V2TIMGroupMemberInfo) {

}

```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];
- (void)onGroupMessagePinned:(NSString *)groupID message:(V2TIMMessage *)message isPinned:(BOOL)isPinned opUser:(V2TIMGroupMemberInfo *)opUser {
      // Receives notification of changes to the pinned message list.
}
```

【C++】
``` cpp
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(this);
void OnGroupMessagePinned(const V2TIMString &groupID, const V2TIMMessage &message,
                          bool isPinned, const V2TIMGroupMemberInfo &opUser) override {
     // Receives notification of changes to the pinned message list.
}
```

---
sync_node_id: '108053268890427392'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "发送消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Basic Feature Description
- The method for sending a message is in the core classes `V2TIMManager` and `V2TIMMessageManager (Java)` / `V2TIMManager+Message (Swift and Objective-C)`.

- It supports sending text, custom, and rich media messages, and all of which belong to the `V2TIMMessage` type.

- `V2TIMMessage` can contain `V2TIMElem` sub-types to indicate different types of messages.

## API Description

The `sendMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) is one of the core APIs for message sending. It supports sending messages of all types.

> **Note**
>  The advanced message sending API mentioned below refers to `sendMessage`.
> 

The API is as described below:

【Java】
``` java
// V2TIMMessageManager
public abstract String sendMessage(
    V2TIMMessage message,
    String receiver,
    String groupID,
    int priority,
    boolean onlineUserOnly,
    V2TIMOfflinePushInfo offlinePushInfo,
    V2TIMSendCallback<V2TIMMessage> callback);
```

【Swift】
``` swift
public func sendMessage(message: V2TIMMessage,
                        receiver: String?,groupID: String?,
                        priority: V2TIMMessagePriority,
                        onlineUserOnly: Bool,
                        offlinePushInfo: V2TIMOfflinePushInfo?,
                        progress: V2TIMProgress?,
                        succ: V2TIMSucc?,
                        fail: V2TIMFail?) -> String?
```

【Objective-C】
``` objectivec
// V2TIMManager+Message.h
- (NSString *)sendMessage:(V2TIMMessage *)message
                 receiver:(NSString *)receiver
                  groupID:(NSString *)groupID
                 priority:(V2TIMMessagePriority)priority
           onlineUserOnly:(BOOL)onlineUserOnly
          offlinePushInfo:(V2TIMOfflinePushInfo *)offlinePushInfo
                 progress:(V2TIMProgress)progress
                     succ:(V2TIMSucc)succ
                     fail:(V2TIMFail)fail;
```

【C++】
``` cpp
// V2TIMMessageManager
virtual V2TIMString SendMessage(
    V2TIMMessage& message,
    const V2TIMString& receiver,
    const V2TIMString& groupID,
    V2TIMMessagePriority priority,
    bool onlineUserOnly, 
    const V2TIMOfflinePushInfo& offlinePushInfo,
    V2TIMSendCallback* callback);
    
```

Parameter description:

|Parameter      |Definition      |Valid for One-to-One Chat      |Valid for Group Chat            |Description   |
|---------|---------|---------|---------|---------|
|message|Message object|YES|YES|It needs to be created through the `createXxxMessage` API. Here, `Xxx` indicates the specific type.|
|receiver|userID of the one-to-one message receiver|YES|NO|Just specify `receiver` for sending one-to-one messages.|
|groupID|groupID of the group chat|NO|YES|Just specify `groupID` for sending group messages.|
|priority|Message priority|NO|YES|Set a higher priority for important messages (such as red packets and gifts) and a lower priority for frequent and unimportant messages (such as likes).|
|onlineUserOnly|Whether the message can be received by online users only|YES|YES|If it is set to `true`, the message cannot be pulled when a receiver pulls historical messages. This is often used to implement weak prompts, such as "The other party is typing..." and unimportant prompts in a group.|
|offlinePushInfo|Offline push message|YES|YES|The title and content carried when a message is pushed offline.|
|progress|File upload progress|YES|YES|File upload progress. It applies to sending messages that contain rich media such as images, audios, videos, and files. There is no callback for pure text, emoji, and location messages.|
|succ|Callback for successful message sending|YES|YES|-|
|fail|Callback for failed message sending|YES|YES|Callback failure error code and error description.|

> **Caution**
> If both `groupID` and `receiver` are set, targeted group messages are sent to `receiver`. For more information, see [Targeted Group Message](https://intl.cloud.tencent.com/document/product/1047/48029).
> 

## Sending a Text Message

Text messages include one-to-one messages and group messages, which are different in terms of API and parameters.

The ordinary and advanced APIs can be used to send text messages. The latter supports more sending parameters (such as priority and offline push message).
The ordinary API is as described below, while the advanced API is `sendMessage` mentioned above.

### One-to-one text message

#### Basic API

Call the `sendC2CTextMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a59a8ba6e4a973b4c40a09ae7dfdc6981) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.sendc2ctextmessage(text:to:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a50d63810093eccc0491d058d0b883618) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a55ff3770a4267e331cd31fcd9475a6e5)) to send a one-to-one text message simply by passing in the message content and receiver's `userID`.

Sample code:

【Java】
``` java
// `msgID` returned by the API for on-demand use
String msgID = V2TIMManager.getInstance().sendC2CTextMessage("One-to-one text message", "receiver_userID", new V2TIMValueCallback<V2TIMMessage>() {
    @Override
    public void onSuccess(V2TIMMessage message) {
        // The one-to-one text message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the one-to-one text message
    }
});
```

【Swift】
``` swift
// `msgID` returned by the API for on-demand use
let msgID = V2TIMManager.shared.sendC2CTextMessage(text: "this is c2c message", to: "receiver_userID") {
        print("send c2c text message succ.")
    } fail: { code, desc in
        print("send c2c text message fail, code: \(code), desc: \(desc)")
    }
```

【Objective-C】
``` objectivec
// `msgID` returned by the API for on-demand use
NSString *msgID = [[V2TIMManager sharedInstance] sendC2CTextMessage:@"One-to-one text message" 
                                                                 to:@"receiver_userID"
                                                               succ:^{
    // The one-to-one text message sent successfully
} fail:^(int code, NSString *msg) {
    // Failed to send the one-to-one text message
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

auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The one-to-one text message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the one-to-one text message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the text message.
    });
// `msgID` returned by the API for on-demand use
V2TIMString msgID =
    V2TIMManager::GetInstance()->SendC2CTextMessage("One-to-one text message", "receiver_userID", callback);
```

#### Advanced API

The advanced API can be called to send a one-to-one text message in two steps:
1. Call `createTextMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a3ea254cd12aa0bcfd004f26f759b76a0) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createtextmessage(text:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a609f4d4c374d9df3abf9974ff8112fc3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab96fac17ae7cb4d1e367dff40aa0694c)) to create a text message.

2. Call `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

   Sample code:

   

【Java】
``` java
// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createTextMessage("content");
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the text message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The text message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the text message
    }
});
```

【Swift】
``` swift
// Create a text message
let msg = V2TIMManager.shared.createTextMessage(text: "content") {
// Send the message
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority:     
        .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    } succ: {
        print("createTextMessage & send succ.")
    } fail: { code, desc in
        print("createTextMessage &send c2c text message fail, code: \(code), desc: \(desc)")
    }
}

```

【Objective-C】
``` objectivec
// Create a text message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createTextMessage:@"content"];
// Send the message
[V2TIMManager.sharedInstance sendMessage:message
                                receiver:@"userID"
                                 groupID:nil
                                priority:V2TIM_PRIORITY_NORMAL
                          onlineUserOnly:NO
                         offlinePushInfo:nil
                                progress:nil
                                succ:^{
    // The text message sent successfully
}
                                fail:^(int code, NSString *desc) {
    // Failed to send the text message
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

// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage("One-to-one text message");
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The progress is not called back for the text message.
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the text message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the text message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback); false, {}, callback);
```

### Group text message

#### Basic API

Call `sendGroupTextMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a56359fd1ce0a96f289dcd4bef522fb52) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.sendgrouptextmessage(text:to:priority:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a07788874071937fac6c7093185b145f7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a3006778f10df146968858a53cc4854ec)) to send a group message simply by passing in the message content, `groupID` of the group chat, and message priority.

For message priorities, see the `V2TIMMessagePriority` definition.

Sample code:

【Java】
``` java
// `msgID` returned by the API for on-demand use
String msgID = V2TIMManager.getInstance().sendGroupTextMessage("Group text message", "groupID", V2TIMMessage.V2TIM_PRIORITY_NORMAL, new V2TIMValueCallback<V2TIMMessage>() {
    @Override
    public void onSuccess(V2TIMMessage message) {
        // The group text message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the group text message
    }
});
```

【Swift】
``` swift
// `msgID` returned by the API for on-demand use
let msgID =  V2TIMManager.shared.sendGroupTextMessage(text: "this is group text message", to: "groupID", priority: .V2TIM_PRIORITY_DEFAULT, succ: nil, fail: nil)
```

【Objective-C】
``` objectivec
// `msgID` returned by the API for on-demand use
NSString *msgID = [[V2TIMManager sharedInstance] sendGroupTextMessage:@"Group text message" 
                                                                   to:@"groupID"  // `groupID` of the group chat
                                                             priority:V2TIM_PRIORITY_NORMAL // Message priority
                                                                 succ:^{
    // The group text message sent successfully
} fail:^(int code, NSString *msg) {
    // Failed to send the group text message
}];
```

【C++】
``` cpp
class SendGroupTextMessageCallback final : public V2TIMSendCallback {
public:
    using SuccessCallback = std::function<void(const V2TIMMessage&)>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using ProgressCallback = std::function<void(uint32_t)>;

    SendGroupTextMessageCallback() = default;
    ~SendGroupTextMessageCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     ProgressCallbackprogress_callback) {
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

auto callback = new SendGroupTextMessageCallback;
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The group text message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the group text message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the text message.
    });
// `msgID` returned by the API for on-demand use
V2TIMString msgID = V2TIMManager::GetInstance()->SendGroupTextMessage(
    "Group text message", "groupID", V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, callback);
```

#### Advanced API

The advanced API can be called to send a group text message in two steps:
1. Call `createTextMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a3ea254cd12aa0bcfd004f26f759b76a0) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createtextmessage(text:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a609f4d4c374d9df3abf9974ff8112fc3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ab96fac17ae7cb4d1e367dff40aa0694c)) to create a text message.

2. Call `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

   Sample code:

   

【Java】
``` java
// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createTextMessage("content");
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, null, "receiver_groupID", V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the text message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The group text message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the group text message
    }
});
```

【Swift】
``` swift
// Create a text message
let msg = V2TIMManager.shared.createTextMessage(text: "content") {
// Send the message
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: nil, groupID: "receiver_groupID", priority:     
        .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    } succ: {
        print("createTextMessage & send succ.")
    } fail: { code, desc in
        print("createTextMessage &send c2c text message fail, code: \(code), desc: \(desc)")
    }
}
```

【Objective-C】
``` objectivec
// Create a text message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createTextMessage:content];
// Send the message
[V2TIMManager.sharedInstance sendMessage:message
                                receiver:nil
                                 groupID:@"receiver_groupID"  // `groupID` of the group chat
                                priority:V2TIM_PRIORITY_NORMAL // Message priority
                          onlineUserOnly:NO   // For online users only
                         offlinePushInfo:nil  // Custom information for offline push
                                progress:nil
                                    succ:^{
    // The text message sent successfully
}
                                fail:^(int code, NSString *desc) {
    // Failed to send the text message
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

// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage("Group text message");
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The group text message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the group text message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the text message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, {}, "receiver_groupID", V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

## Sending a Custom Message

Custom messages include one-to-one messages and group messages, which are different in terms of APIs and parameters. The ordinary and advanced APIs can be used to send custom messages.
The advanced API is `sendMessage` mentioned above ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)), which supports more sending parameters (such as priority and offline push message) than the ordinary API.

### Custom one-to-one message

#### Basic API

Call `sendC2CCustomMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#af3e08b936df77210c6cdd0ce5c7fa87f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.sendc2ccustommessage(customdata:to:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a5fc3b87e9782e679c08926d07e486b90) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a07d2bcf26547adb609f7aef752cd8189)) to send a custom one-to-one message simply by passing in the binary content and receiver's `userID`.

Sample code:

【Java】
``` java
String msgID = V2TIMManager.getInstance().sendC2CCustomMessage("Custom one-to-one message".getBytes(), "receiver_userID", new V2TIMValueCallback<V2TIMMessage>() {
    @Override
    public void onSuccess(V2TIMMessage message) {
        // The custom one-to-one message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the custom one-to-one message
    }
});
```

【Swift】
``` swift
let msgID = V2TIMManager.shared.sendC2CCustomMessage(text: "this is c2c message", to: "receiver_userID") {
      // The custom one-to-one message sent successfully
        print("send c2c text message succ.")
    } fail: { code, desc in
        // Failed to send the custom one-to-one message
        print("send c2c text message fail, code: \(code), desc: \(desc)")
    }
```

【Objective-C】
``` objectivec
NSData *customData = [@"Custom one-to-one message"  dataUsingEncoding:NSUTF8StringEncoding];
NSString *msgID = [[V2TIMManager sharedInstance] sendC2CCustomMessage:customData
                                                                   to:@"receiver_userID"  // Receiver's `userID`
                                                                 succ:^{
    // The custom one-to-one message sent successfully
} 
                                                                fail:^(int code, NSString *msg) {
    // Failed to send the custom one-to-one message
}];
```

【C++】
``` cpp
class SendC2CCustomMessageCallback final : public V2TIMSendCallback {
public:
    using SuccessCallback = std::function<void(const V2TIMMessage&)>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using ProgressCallback = std::function<void(uint32_t)>;

    SendC2CCustomMessageCallback() = default;
    ~SendC2CCustomMessageCallback() override = default;

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

auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The custom one-to-one message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the custom one-to-one message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the custom message.
    });
V2TIMString str = u8"Custom one-to-one message";
V2TIMBuffer customData = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
V2TIMString msgID = V2TIMManager::GetInstance()->SendC2CCustomMessage(customData, "receiver_userID", callback);
```

#### Advanced API

The advanced API can be called to send a custom one-to-one message in two steps:
1. Call `createCustomMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a5c2495d4b7ecd66e5636aeb865c17efd) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createtextmessage(text:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a7a38c42f63a4e0c9e89f6c56dd0da316) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3af1cc2c76c41f3e48080134502ac8d5)) to create a custom message.

2. Call `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

   Sample code:

   

【Java】
``` java
// Create a custom message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage("Custom one-to-one message".getBytes());
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the custom message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The custom one-to-one message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the custom one-to-one message
    }
});
```

【Swift】
``` swift
if let msg = V2TIMManager.shared.createCustomMessage(data: "CustomMessage".data(using: .utf8) ?? Data()) {
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "receiver_userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    } succ: {
        // The custom one-to-one message sent successfully
    } fail: { code, desc in
        // Failed to send the custom one-to-one message
    }
}
```

【Objective-C】
``` objectivec
// Create a custom message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage("Custom one-to-one message".getBytes());
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the custom message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The custom one-to-one message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the custom one-to-one message
    }
});
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

// Create a custom message
V2TIMString str = u8"Custom one-to-one message";
V2TIMBuffer customData = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateCustomMessage(customData);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The custom one-to-one message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the custom one-to-one message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the custom message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Custom group message

#### Basic API

Call `sendGroupCustomMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#afbce8ff97be0a3a42c7dc826d316f2c2) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.sendgroupcustommessage(customdata:to:priority:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a537560a58d49aad36406f6d9db6ded65) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a9e49af2df4299a8546e19661c2792cad)) to send a custom group message simply by passing in the binary content, `groupID` of the group chat, and priority.
For message priorities, see the `V2TIMMessagePriority` definition.

Sample code:

【Java】
``` java
String msgID = V2TIMManager.getInstance().sendGroupCustomMessage("Custom group message".getBytes(), "groupID", V2TIMMessage.V2TIM_PRIORITY_NORMAL, new V2TIMValueCallback<V2TIMMessage>() {
    @Override
    public void onSuccess(V2TIMMessage message) {
        // The custom group message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the custom group message
    }
});
```

【Swift】
``` swift
let customData = "customText".data(using: .utf8) ?? Data()
let msgID = V2TIMManager.shared.sendGroupCustomMessage(customData: customData, to: "receiver_groupID",
                                                        priority: .V2TIM_PRIORITY_DEFAULT,
 succ: {
        // The custom group message sent successfully
}) { code, desc in
        // Failed to send the custom group message
}
```

【Objective-C】
``` objectivec
NSData *customData = [@"Custom group message"  dataUsingEncoding:NSUTF8StringEncoding];
NSString *msgID = [[V2TIMManager sharedInstance] sendGroupCustomMessage:customData
                                                                     to:@"receiver_groupID"  // `groupID` of the group chat
                                                               priority:V2TIM_PRIORITY_HIGH  // Message priority
                                                                   succ:^{
    // The custom group message sent successfully
} fail:^(int code, NSString *msg) {
    // Failed to send the custom group message
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

auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The custom group message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the custom group message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the custom message.
    });
V2TIMString str = u8"Custom group message";
V2TIMBuffer customData = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
V2TIMString msgID = V2TIMManager::GetInstance()->SendGroupCustomMessage(
    customData, "groupID", V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, callback);
```

#### Advanced API

The advanced API can be called to send a custom group message in two steps:
1. Call `createCustomMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a5c2495d4b7ecd66e5636aeb865c17efd) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createcustommessage(data:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a7a38c42f63a4e0c9e89f6c56dd0da316) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3af1cc2c76c41f3e48080134502ac8d5)) to create a custom message.

2. Call `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

   Sample code:

   

【Java】
``` java
// Create a custom message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage("Custom group message".getBytes());
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_groupID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the custom message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The custom group message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the custom group message
    }
});
```

【Swift】
``` swift
if let msg = V2TIMManager.shared.createCustomMessage(data: "customdata".data(using: .utf8) ?? Data()) {
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: nil, groupID: "receiver_groupID", priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    } succ: {
    // The custom group message sent successfully
    } fail: { code, desc in
    // Failed to send the custom group message
    }
}
```

【Objective-C】
``` objectivec
V2TIMMessage *message = [[V2TIMManager sharedInstance] createCustomMessage:data];
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:nil
                                   groupID:@"receiver_groupID"  // `groupID` of the group chat
                                  priority:V2TIM_PRIORITY_DEFAULT  // Message priority
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:nil
                                      succ:^{
    // The custom group message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the custom group message
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

// Create a custom message
V2TIMString str = u8"Custom group message";
V2TIMBuffer customData = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateCustomMessage(customData);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The custom group message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the custom group message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the custom message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, {}, "receiver_groupID", V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

## Sending a Rich Media Message

A rich media message can be sent in the following steps:
1. Call `createXxxMessage` to create a rich media message object of a specified type. Here, `Xxx` indicates the specific message type.

2. Call `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

3. Get the callback for message sending success or failure.

### Image message

To create an image message, you need to get the local image path first.

During message sending, the image is uploaded to the server, and the upload progress is called back. The message is sent after the image is uploaded successfully.

SDKs support a maximum image size of 28 MB for any single file to be sent. 

Sample code:

【Java】
``` java
// Create an image message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createImageMessage("/sdcard/xxx");
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // Image upload progress in the range of [0, 100]
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The image message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the image message
    }
});
```

【Swift】
``` swift
if  let path = Bundle.main.path(forResource: "test", ofType: "png"),
    // Create an image message
    let msg = V2TIMManager.shared.createImageMessage(imagePath: path) {
    // Send the message
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    // Image upload progress in the range of [0, 100]
    } succ: {
    // The image message sent successfully
    } fail: { code, desc in
    // Failed to send the image message
    }
}
```

【Objective-C】
``` objectivec
// Get the local image path
NSString *imagePath = [[NSBundle mainBundle] pathForResource:@"test" ofType:@"png"];
// Create an image message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createImageMessage:imagePath];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:^(uint32_t progress) {
    // Image upload progress in the range of [0, 100]
} succ:^{
    // The image message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the image message
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

// Create an image message
V2TIMMessage v2TIMMessage =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateImageMessage("./File/Xxx.jpg");
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The image message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the image message
        delete callback;
    },
    [=](uint32_t progress) {
        // Image upload progress in the range of [0, 100]
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Audio message

To create an audio message, you need to get the local audio file path and audio duration first, the latter of which can be used for display on the receiver UI.
During message sending, the audio is uploaded to the server, and the upload progress is called back. The message is sent after the audio is uploaded successfully.

Sample code:

【Java】
``` java
// Create an audio message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createSoundMessage("/sdcard/xxx", 5);
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // Audio upload progress in the range of [0, 100]
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The audio message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the audio message
    }
});
```

【Swift】
``` swift
// Get the local audio file path
func createSound() -> String? {
    let numberOne: Int = Int(arc4random())
    if let path = Bundle.main.path(forResource: "00", ofType: "caf"),
        let url = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first?.appending("/\(Date().timeIntervalSince1970)_\(numberOne).caf"),
        let data = try? Data(contentsOf: URL(fileURLWithPath: path)) {
        try? data.write(to: URL(fileURLWithPath: url))
        return url
    }
    
    return nil
}

func createAndSendSoundMessage() {
    if  let path = self?.createSound(),
        // Create an audio message
        let msg = V2TIMManager.shared.createSoundMessage(audioFilePath: path, duration: 30) {
        // Send the message
        _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
        // Audio upload progress in the range of [0, 100]
        } succ: {
            print("createSoundMessage & send succ")
        } fail: { code, desc in
            print("createSoundMessage &send c2c text message fail, code: \(code), desc: \(desc)")
        }
    }
}

```

【Objective-C】
``` objectivec
// Get the local audio file path
NSString *soundPath = [[NSBundle mainBundle] pathForResource:@"test" ofType:@"m4a"];
// Get the audio duration (which is only used for UI display)
AVURLAsset *asset = [AVURLAsset assetWithURL:[NSURL fileURLWithPath:soundPath]];
CMTime time = [asset duration];
int duration = ceil(time.value/time.timescale);
// Create an audio message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createSoundMessage:soundPath duration:duration];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:^(uint32_t progress) {
    // Audio upload progress in the range of [0, 100]
} succ:^{
    // The audio message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the audio message
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

// Create an audio message
V2TIMMessage v2TIMMessage =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateSoundMessage("./File/Xxx.mp3", 5);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The audio message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the audio message
        delete callback;
    },
    [=](uint32_t progress) {
        // Audio upload progress in the range of [0, 100]
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Video message

To create a video message, you need to get the local video file path, video duration, and video thumbnail first, the latter two of which can be used for display on the receiver UI.
During message sending, the video is uploaded to the server, and the upload progress is called back. The message is sent after the video is uploaded successfully.

Below is the sample code:

【Java】
``` java
// Create a video message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createVideoMessage("/sdcard/xxx", "mp4", 10, "/sdcard/xxx");
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // Video upload progress in the range of [0, 100]
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The video message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the video message
    }
});
```

【Swift】
``` swift
// Get the local video file path
if  let snappath = Bundle.main.path(forResource: "testpng", ofType: nil),
    // Get the local video thumbnail path
    let path = Bundle.main.path(forResource: "test", ofType: "mp4"),
    // Get the video duration
    let msg = V2TIMManager.shared.createVideoMessage(videoFilePath: path, type: "mp4", duration: 30, snapshotPath: snappath) {
    // Send the message
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID:nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
        
    } succ: {
        print("createVideoMessage & send succ")
    } fail: { code, desc in
        print("createVideoMessage & send fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
// Get the local video file path
NSString *videoPath = [[NSBundle mainBundle] pathForResource:@"test" ofType:@"mp4"];
// Get the local video thumbnail path
NSString *snapShotPath = [[NSBundle mainBundle] pathForResource:@"testpng" ofType:@""];
// Get the video duration
AVURLAsset *asset = [AVURLAsset assetWithURL:[NSURL fileURLWithPath:path]];
CMTime time = [asset duration];
int duration = ceil(time.value/time.timescale);
// Create a video message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createVideoMessage:videoPath  
                                                                     type:@"mp4" 
                                                                 duration:duration 
                                                             snapshotPath:snapShotPath];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:^(uint32_t progress) {
    // Video upload progress in the range of [0, 100]
} succ:^{
    // The video message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the video message
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

// Create a video message
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateVideoMessage(
    "./File/Xxx.mp4", "mp4", 10, "./File/Xxx.jpg");
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The video message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the video message
        delete callback;
    },
    [=](uint32_t progress) {
        // Video upload progress in the range of [0, 100]
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### File message

To create a file message, you need to get the local file path first.
During message sending, the file is uploaded to the server, and the upload progress is called back. The message is sent after the file is uploaded successfully.

Sample code:

【Java】
``` java
// Create a file message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createFileMessage("/sdcard/xxx", "Filename");
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // File upload progress in the range of [0, 100]
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The file message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the file message
    }
});
```

【Swift】
``` swift
if  let path = Bundle.main.path(forResource: "test", ofType: "mp4") ,
    let msg = V2TIMManager.shared.createFileMessage(filePath: path, fileName: "name") {
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
        
    } succ: {
    // The file message sent successfully
    } fail: { code, desc in
    // Failed to send the file message
    }
}
```

【Objective-C】
``` objectivec
// Get the local file path
NSString *filePath = [[NSBundle mainBundle] pathForResource:@"test" ofType:@"mp4"];
// Create a file message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createFileMessage:filePath fileName:@"Send the file message"];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:^(uint32_t progress) {
    // File upload progress in the range of [0, 100]
} succ:^{
    // The file message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the file message
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

// Create a file message
V2TIMMessage v2TIMMessage =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateFileMessage("./File/Xxx.zip", "Xxx");
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The file message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the file message
        delete callback;
    },
    [=](uint32_t progress) {
        // File upload progress in the range of [0, 100]
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Location message

Latitude and longitude information is sent in a location message, which requires a map control for display.

Sample code:

【Java】
``` java
// Create a location message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createLocationMessage("Geographical location", 0.5, 0.5);
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the location message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The location message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the location message
    }
});
```

【Swift】
``` swift
if  let msg = V2TIMManager.shared.createLocationMessage(desc: "LocationMessage text", longitude: 2020, latitude: 2020) {
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
        
    } succ: {
        print("createLocationMessage & send succ")
    } fail: { code, desc in
        print("createLocationMessage & send fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
// Create a location message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createLocationMessage:@"Send the geographical location message" longitude:0.5 latitude:0.5];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:nil
                                      succ:^{
    // The location message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the location message
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

// Create a location message
V2TIMMessage v2TIMMessage =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateLocationMessage("Location", 0.5, 0.5);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The location message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the location message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the location message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Emoji message

Emoji codes are sent in an emoji message and need to be converted into icons by the receiver.

Sample code:

【Java】
``` java
// Create an emoji message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createFaceMessage(1, "tt00".getBytes());
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back for the emoji message.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The emoji message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the emoji message
    }
});
```

【Swift】
``` swift
// Create an emoji message
if  let msg = V2TIMManager.shared.createFaceMessage(index: 0, data: nil) {
// Send the message
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
    } succ: {
    // The emoji message sent successfully
    } fail: { code, desc in
    // Failed to send the emoji message
    }
}
```

【Objective-C】
``` objectivec
// Create an emoji message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createFaceMessage:1 data:[@"tt00" dataUsingEncoding:NSUTF8StringEncoding]];
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:nil
                                      succ:^{
    // The emoji message sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the emoji message
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

// Create an emoji message
V2TIMString str = u8"tt00";
V2TIMBuffer data = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateFaceMessage(1, data);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The emoji message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the emoji message
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back for the emoji message.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

## Sending a Message Containing Multiple Element Objects

To include multiple elements in a message, create a Message object and call the `appendElem` method ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMElem.html#a5f5d86bb659d7a3775829eaa2e102866) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMElem.html#v2timelem.appendelem(element:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMElem.html#a632f3740c4c42014dc38a4c074a700c9) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMMessage.html#a22a4fa5808e17351b6d79600cebaf048)) through the element members of the Message object to add another element member.

`appendElem` only supports adding `V2TIMTextElem`, `V2TIMCustomElem`, `V2TIMFaceElem`, and `V2TIMLocationElem` after the original `V2TIMElem` (which can be any type).
Therefore, "image + text", "video + text", and "location + text" are supported, but "image + image" and "text + image" are not supported.

Sample code for "text message + custom message":

【Java】
``` java
// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createTextMessage("test");
// Create a custom element
V2TIMCustomElem customElem = new V2TIMCustomElem();
customElem.setData("Custom message".getBytes());
// Add the custom element to `message.textElem`
v2TIMMessage.getTextElem().appendElem(customElem);
// Send the message
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "receiver_userID", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onProgress(int progress) {
        // The progress is not called back.
    }

    @Override
    public void onSuccess(V2TIMMessage message) {
        // The message containing multiple elements sent successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to send the message containing multiple element objects
    }
});
```

【Swift】
``` swift
// Create a text message
guard let message = V2TIMManager.shared.createTextMessage(text: "text") else {
    print("Failed to create text message.")
    return
}
// Create a custom element
let customElem = V2TIMCustomElem()
customElem.data = "Custom message".data(using: .utf8)
// Add the custom element to `message.textElem`
message.textElem?.appendElem(element: customElem)
// Send the message
V2TIMManager.shared.sendMessage(message: message, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in

} succ: {
    // The message containing multiple elements sent successfully
    print("Custom message sent successfully.")
} fail: { code, desc in
    // Failed to send the message containing multiple element objects
    print("Failed to send custom message: \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Create a text message
V2TIMMessage *message = [[V2TIMManager sharedInstance] createTextMessage:@"text"];

// Create a custom element
V2TIMCustomElem *customElem = [[V2TIMCustomElem alloc] init];
customElem.data = [@"Custom message" dataUsingEncoding:NSUTF8StringEncoding];

// Add the custom element to `message.textElem`
[message.textElem appendElem:customElem];

// Send the message
[[V2TIMManager sharedInstance] sendMessage:message
                                  receiver:@"userID"
                                   groupID:nil
                                  priority:V2TIM_PRIORITY_DEFAULT
                            onlineUserOnly:NO
                           offlinePushInfo:nil
                                  progress:nil
                                      succ:^{
    // The message containing multiple elements sent successfully
} fail:^(int code, NSString *desc) {
    // Failed to send the message containing multiple element objects
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

// Create a text message
V2TIMMessage v2TIMMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage("test");
// Create a custom element
V2TIMCustomElem customElem;
V2TIMString str = u8"tt00";
customElem.data = {reinterpret_cast<const uint8_t*>(str.CString()), str.Size()};
// Add the custom element to `message.textElem`
v2TIMMessage.elemList.PushBack(&customElem);
// Send the message
auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The message containing multiple elements sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send the message containing multiple element objects
        delete callback;
    },
    [=](uint32_t progress) {
        // The progress is not called back.
    });
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    v2TIMMessage, "receiver_userID", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

## API-related Limits
| Feature | Limit Item | Description |
| --- | --- | --- |
| One-to-one/group message | Content length | A one-to-one or group message must be no longer than 12KB. |
| Sending frequency | One-to-one message: No limit for sending on the client; sending through the RESTful API is subject to the API frequency limit specified in the API documentation.<br>Group message: Up to 40 messages can be sent per second per group (regardless of the group type, and this limit applies to each group separately). |  |
| Receiving frequency | No limit for one-to-one messages or group messages. |  |
| Size of a single file | SDKs support a maximum file size of 100 MB for any single file to be sent. |  |

> **Note：**
> 1. When the number of sent messages exceeds the limit, the backend will first deliver higher-priority messages, and messages with the same priority will be delivered randomly. However, if the number of high-priority messages sent in a second exceeds 40, high-priority messages will also be discarded.
> 2. A message that has been restricted by frequency control is not delivered or stored in the message history, but a success response will be returned to the sender.[ Before Group Message Is Sent](https://www.tencentcloud.com/document/product/1047/34374) webhook is triggered, but [After Group Message Is Sent](https://www.tencentcloud.com/document/product/1047/34375) is not triggered.
> 3. The default rate limit for calling the RESTful API to send group messages is 200 times per second, which is a different concept from the aforementioned "limit of 40 messages per second for each group." Please distinguish it.

Please refer to [Use Limits](https://www.tencentcloud.com/document/product/1047/34381) for more limits.

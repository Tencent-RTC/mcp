---
sync_node_id: '108053273130868736'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "撤回消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

The sender can recall a successfully sent message.

By default, the sender can recall a message that is sent within 2 minutes. You can change the time limit for message recall. For detailed directions, see [Message recall settings](https://www.tencentcloud.com/document/product/1047/34419#0e85051c-048d-475c-a48b-055bf3974c4a).

Message recall can be implemented through the receiver UI code: When a message is recalled, the receiver will receive the `onRecvMessageRevoked` notification which contains the `msgID` of the recalled message. You can identify the recalled message at the UI layer based on the `msgID` and change the bubble for the message to the "Message recalled" status.

In one-to-one chats, only the sender can recall their own messages through this API. 

In group chats, not only the sender can recall their own message, but administrators or group owners can also recall messages sent by other group members through this API.

This API is available for all group types, including audio-video groups (AVChatRoom) and community groups, in 7.4 and later versions.

## Recalling a Message (by the Sender)

The sender can call `revokeMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#ad0dfce6be749165cd90a9ff67a1308b1) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.revokemessage(msg:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a972ac3fb7744458eb0d6abd96ce35126) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3f271fcb935ada0ef05709367638a1a6)) to recall a message.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().revokeMessage(v2TIMMessage, new V2TIMCallback() {
    @Override
    public void onError(int code, String desc) {
        // The message failed to be recalled
    }
    @Override
    public void onSuccess() {
        // Message recalled successfully
    }
});
```

【Swift】
``` swift
// `selectedMessage` is the message to be recalled.
V2TIMManager.shared.revokeMessage(msg: selectedMessage) {
    print("revokeMessage succ")
} fail: { code, desc in
    print("revokeMessage fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// `selectedMessage` is the message to be recalled.
[[V2TIMManager sharedInstance] revokeMessage:selectedMessage
                                        succ:^{
    // Message recalled successfully
} fail:^(int code, NSString *msg) {
    // The message failed to be recalled
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

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Message recalled successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // The message failed to be recalled
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->RevokeMessage(message, callback);
```

## Noticing a Message Recall (by the Receiver)
1. The receiver calls `addAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aaccdec10b9fbee5e43eaf908e359c823) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.addadvancedmsglistener(listener:)) /[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#acf794752cc6bfa786aea5cd7fabadfab) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a498688ee0f672f114e28d830761dfbf8)) to set the advanced message listener.

2. The receiver receives the message recall notification in `onRecvMessageRevoked` ([Java](https://im.sdk.qcloud.com/doc/zh-cn/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#ac7ca5a853276542a27b0a57783478ef6)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvmessagerevoked(msgid:operateuser:reason:)) / [Objective-C](https://im.sdk.qcloud.com/doc/zh-cn/protocolV2TIMAdvancedMsgListener-p.html#afea79b252918b586d0157fba8a8ba00e) / [C++](https://im.sdk.qcloud.com/doc/zh-cn/classV2TIMAdvancedMsgListener.html#a026f0c46fc41b8f6294f7f423d2ce771)) .

   > **Note：**
   > 
   > Starting from version 7.4, when a message is revoked, the receiver can obtain the reason for revocation and the revoker of the message through the API onRecvMessageRevoked.
   > 

   Sample code:

   

【Java】
``` java
V2TIMManager.getMessageManager().addAdvancedMsgListener(new V2TIMAdvancedMsgListener() {
    @Override
    public void onRecvMessageRevoked(String msgID, V2TIMUserFullInfo operateUser, String reason) {
      for (V2TIMMessage msg : msgList) {
        if (msg.getMsgID().equals(msgID)) {
            // You need to change the bubble status for the message on the UI after receiving the message recall notification.
        }
      }
    }
}
```

【Swift】
``` swift
// V2TIMAdvancedMsgListener
func onRecvMessageRevoked(msgID: String) {
    // You need to change the bubble status for the message on the UI after receiving the message recall notification.
}
```

【Objective-C】
``` objectivec
// V2TIMAdvancedMsgListener
- (void)onRecvMessageRevoked:(NSString *)msgID operateUser:(V2TIMUserFullInfo *)operateUser reason:(NSString *)reason {
    // You need to change the bubble status for the message on the UI after receiving the message recall notification.
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    /**
     * Received a new message
     *
     * @param message Message
     */
    /**
     * Received a message recall notification
     *
     * @param messageID Unique message ID
     */
    void OnRecvMessageRevoked(const V2TIMString& messageID, 
                              const V2TIMUserFullInfo &operateUser, 
                              const V2TIMString &reason) overrid {
        // `msgList` is the message list on the current chat interface
    }
    // Other members …
};

// Add an event listener for advanced messages. Keep `advancedMsgListener` valid before it is removed to ensure event callbacks are received.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener);
```

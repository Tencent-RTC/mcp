---
sync_node_id: '108053269869797376'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "在线消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

In certain cases, you might want a message to be received by the receiver only when online; that is, the receiver won't notice the message when offline.
You only need to set `onlineUserOnly` to `true/YES` when calling `sendMessage`. A message sent in this way differs from a general one in that:
1. It cannot be stored offline; that is, it cannot be received if the receiver is offline.

2. It cannot be roamed across devices; that is, if it is received on a device, it cannot be received on another, whether it is read or not.

3. It cannot be stored locally; that is, it cannot be pulled from local or cloud historical messages.

## Sample

### Implementing Typing Indicator

In one-to-one chats, you can use `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send a specified custom online message. After receiving the specified custom online message and determining that the sender is typing, the receiver can display "Typing..." on the UI.

Sample code:

【Java】
``` java
// Send the prompt "Typing…" to user A
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("command", "textInput");
} catch (JSONException e) {
    e.printStackTrace();
}
V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage(jsonObject.toString().getBytes());
V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, "userA", null, V2TIMMessage.V2TIM_PRIORITY_DEFAULT, true,  v2TIMOfflinePushInfo, new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onError(int code, String desc) {}
    @Override
    public void onSuccess(V2TIMMessage v2TIMMessage) {}
    @Override
    public void onProgress(int progress) {}
});
```

【Swift】
``` swift
// Send the prompt "Typing..." to user A
let customStr = "{\"command\": \"textInput\"}"
if let customData = customStr.data(using: .utf8) {
    if let message = V2TIMManager.shared.createCustomMessage(data: customData) {

        V2TIMManager.shared.sendMessage(message: message, receiver: "userID", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: true, offlinePushInfo: nil) { progress in

        } succ: {
            print("Custom message sent successfully.")
        } fail: { code, desc in
            print("Failed to send custom message: \(code), \(desc)")
        }
    }
}
```

【Objective-C】
``` objectivec
// Send the prompt "Typing..." to user A
NSString *customStr = @"{\"command\": \"textInput\"}";
NSData *customData = [customStr dataUsingEncoding:NSUTF8StringEncoding];
V2TIMMessage *msg = [[V2TIMManager sharedInstance] createCustomMessage:customData];
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

// Send the prompt "Typing…" to user A
std::string str{u8"{\"command\": \"textInput\"}"};
V2TIMBuffer data = {reinterpret_cast<const uint8_t*>(str.data()), str.size()};
V2TIMMessage message =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateCustomMessage(data, description, extension);

auto callback = new SendCallback{};
callback->SetCallback([=](const V2TIMMessage& message) { delete callback; },
                      [=](int error_code, const V2TIMString& error_message) { delete callback; },
                      [=](uint32_t progress) {});

V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    message, "userA", {}, V2TIMMessagePriority::V2TIM_PRIORITY_DEFAULT, true, {}, callback);
```

In fact, to implement a typing indicator using the SDK to send online messages is only a small part. Much more development work is required, for example:
- User Interface Monitoring and Status Update: An event listener is added to the input box for sending messages, to detect when the user starts typing. When typing begins, the client updates the user’s status, for example, "typing".

- Sending Status to the Server: At the appropriate time, the user's input status is sent to the server.

- User Interface Update: Based on the received input status, the indicator such as "Daniel is typing" is displayed on the recipient's user interface. This could be a text prompt, an icon, or an animation.

- Consider Throttling: To reduce unnecessary status updates and communication overhead, a time interval can be set. Only one input status update is sent within this interval.

   The feature effect is shown below:

   

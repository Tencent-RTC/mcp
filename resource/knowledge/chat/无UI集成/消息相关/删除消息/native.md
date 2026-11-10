---
sync_node_id: '108053266764963840'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "删除消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

Both local messages and cloud messages can be deleted.
When cloud messages are deleted, such messages will be deleted both locally and from the cloud and **cannot be recovered**.

If the last message is deleted, the `lastMessage` in the conversation will become the last but one message.
- If your SDK version is earlier than v5.5.892 and the `lastMessage` is used for sorting, the sequence in the conversation list will be affected.

- If your SDK is on v5.5.892 or later and `orderKey` is used for sorting, the sequence in the conversation list will not be affected.

   See [Conversation List](https://www.tencentcloud.com/document/product/1047/48326) for details.

### Deleting a local message

Call `deleteMessageFromLocalStorage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aa31e3b48fb666b970120fc0bc6343534) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.deletemessagefromlocalstorage(msg:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a2bb42528f4d166ac826914094655841c)) to delete a local message.

> **Note**
> 1. This API can only be used to delete a historical local message. After deleted, the message will be marked as deleted locally by the SDK and cannot be pulled through `getHistoryMessage`.
> 2. If the application is uninstalled and reinstalled, the delete marker will be lost locally, and the message can still be pulled through `getHistoryMessage`.

Sample code:

【Java】
``` java
// `selectedMsg` is the selected message to be deleted.
V2TIMManager.getMessageManager().deleteMessageFromLocalStorage(selectedMsg, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Local message deleted successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to delete the local message
  }
});
```

【Swift】
``` swift
// `selectedMsg` is the selected message to be deleted.
V2TIMManager.shared.deleteMessageFromLocalStorage(msg: selectedMessage) {
            print("deleteMessageFromLocalStorage succ")
     } fail: { code, desc in
            print("deleteMessageFromLocalStorage fail, \(code), \(desc)")
     }
```

【Objective-C】
``` objectivec
// `selectedMsg` is the selected message to be deleted.
[[V2TIMManager sharedInstance] deleteMessageFromLocalStorage:selectedMessage
                                                        succ:^{
    NSLog(@"Local message deleted successfully");
} fail:^(int code, NSString *msg) {
    NSLog(@"Failed to delete the local message, code: %d, desc: %@", code, msg);
}];
```

### Deleting a message from the cloud

Call `deleteMessages` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#adb346fede13d493e415f6574df911e9a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.deletemessages(msglist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a9e394ea720ecdc10d497b63b6f2b22c4) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ac340e09d426d983fb4b6cf48d9a7ebca)) to delete messages from the cloud.

This API deletes messages both locally and from the cloud, which cannot be recovered.

> **Note**
> 1. Up to 50 messages can be deleted per call.
> 2. Messages to be deleted per call **must** be from the same conversation.
> 3. This API can be called only once per second.
> 4. If messages have been pulled on a device by an account, they will remain on the device after the API is called to delete them from the cloud; in other words, deleted messages are not synced.

Sample code:

【Java】
``` java
// `selectedMessageList` is the list of selected messages to be deleted.
V2TIMManager.getMessageManager().deleteMessages(selectedMessageList, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Messages deleted from the cloud successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to delete the messages from the cloud
  }
});
```

【Swift】
``` swift
let selectedMessageList: [V2TIMMessage] = [selectedMessage1, selectedMessage2]
V2TIMManager.shared.deleteMessages(msgList: sendedMsgList) {
        print("deleteMessages succ")
    } fail: { code, desc in
        print("deleteMessages fail, \(code), \(desc)")
    }
```

【Objective-C】
``` objectivec
// `selectedMessageList` is the list of selected messages to be deleted.
NSArray *selectedMessageList = @[selectedMessage1, selectedMessage2];
[[V2TIMManager sharedInstance] deleteMessages:selectedMessageList
                                        succ:^{
    NSLog(@"Messages deleted from the cloud successfully");
} fail:^(int code, NSString *desc) {
    NSLog(@"Failed to delete the messages from the cloud, code: %d, desc: %@", code, desc);
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

// `messageList` is the list of selected messages to be deleted.
auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Messages deleted from the cloud successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the messages from the cloud
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->DeleteMessages(messageList, callback);
```

---
sync_node_id: '108053272580366336'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "插入消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

When a message is inserted, the message will only be inserted into the local database but not be sent to the server.
This API is used to insert tips into a conversation, such as "You have left the group" and "Keep your information secure. Do not send private information such as account, password, and verification code to the group chat". Such messages need to be displayed in the chat area, but do not need to be sent to others.

> **Caution**
> Inserted messages will be lost if the account is logged in on another mobile device or the application is uninstalled and reinstalled.
> 

### Inserting a local message into one-to-one messages

Call `insertC2CMessageToLocalStorage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a5afe4461b4a47205d2865ea94317d4aa) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.insertc2cmessagetolocalstorage(msg:to:sender:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#acc1dccd310d1965248cff0d4fd5ca45f) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#abba2adf81fa2bb457c14fffb9ae0eda4)) to insert a local message into one-to-one messages.

Sample code:

【Java】
``` java
// Create a message
V2TIMMessage msg = V2TIMManager.getMessageManager().createTextMessage("Insert a local message between one-to-one messages");
// Insert the message into the local database
V2TIMManager.getMessageManager().insertC2CMessageToLocalStorage(msg, "receiver_userID", "sender_userID", new V2TIMValueCallback<V2TIMMessage>() {
  @Override
  public void onSuccess(V2TIMMessage message) {
      // Inserted the message into one-to-one messages successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to insert the message into one-to-one messages
  }
});
```

【Swift】
``` swift
// Create a message
if let msg = V2TIMManager.shared.createTextMessage(text: "Insert a local message between C2C messages") {
// Insert the message into the local database
    V2TIMManager.shared.insertC2CMessageToLocalStorage(msg: msg, to: "receiver_userID", sender: "sender_userID", succ: {
        print("Message inserted between one-to-one messages successfully")
    }, fail: { code, msg in
        print("Failed to insert the message between one-to-one messages, code: \(code), msg: \(msg)")
    })
}
```

【Objective-C】
``` objectivec
// Create a message
V2TIMMessage *msg = [[V2TIMManager sharedInstance] createTextMessage:@"Insert a local message between C2C messages"];
// Insert the message into the local database
[[V2TIMManager sharedInstance] insertC2CMessageToLocalStorage:msg
                                                           to:@"receiver_userID"  // `userID` of the receiver
                                                       sender:@"sender_userID"  // `userID` of the sender
                                                         succ:^{
    NSLog(@"Message inserted between one-to-one messages successfully");
} fail:^(int code, NSString *msg) {
    NSLog(@"Failed to insert the message between one-to-one messages, code: %d, msg: %@", code, msg);
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

V2TIMMessage message =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage(u8"Insert a local message between one-to-one messages");
V2TIMString userID = "receiver_userID";
V2TIMString sender = "sender_userID";

auto callback = new ValueCallback<V2TIMMessage>{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // Inserted the message between one-to-one messages successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to insert the message between one-to-one messages
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->InsertGroupMessageToLocalStorage(message, userID, sender,
                                                                                   callback);
```

### Inserting a local message into group messages

Call `insertGroupMessageToLocalStorage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a04a3f6c250f9d6c0053fd71be74f047f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.insertgroupmessagetolocalstorage(msg:to:sender:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a9b312b67e4da19978b55a7b915815dfe) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a19813d01f229f5c1a413684b56c54e1b)) to insert a local message into group messages.

Sample code:

【Java】
``` java
// Create a message
V2TIMMessage msg = V2TIMManager.getMessageManager().createTextMessage("Insert a local message between group messages");
// Insert the message into the local database
V2TIMManager.getMessageManager().insertGroupMessageToLocalStorage(msg, "groupID", "sender_userID", new V2TIMValueCallback<V2TIMMessage>() {
  @Override
  public void onSuccess(V2TIMMessage message) {
      // Message inserted into group messages successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to insert the message into group messages
  }
});
```

【Swift】
``` swift
if let msg = V2TIMManager.shared.createTextMessage(text: "this is local message generated by swift api") {
    V2TIMManager.shared.insertGroupMessageToLocalStorage(msg: msg, to: "receiver_groupID", sender: "sender_userID") {
        print("insertGroupMessageToLocalStorage succ")
    } fail: { code, desc in
        print("insertGroupMessageToLocalStorage fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
// Create a message 
V2TIMMessage *msg = [[V2TIMManager sharedInstance] createTextMessage:@"Insert a local message between group messages"];
// Insert the message into the local database
[[V2TIMManager sharedInstance] insertGroupMessageToLocalStorage:msg 
                                                             to:@"groupID"  // `groupID` of the group chat
                                                         sender:@"sender_userID"  // `userID` of the sender
                                                           succ:^{
    NSLog(@"Message inserted between group messages successfully");
} fail:^(int code, NSString *msg) {
    NSLog(@"Failed to insert the message between group messages, code: %d, msg: %@", code, msg);
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

V2TIMMessage message =
    V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage(u8"Insert a local message between group messages");
V2TIMString groupID = "groupID";
V2TIMString sender = "sender_userID";

auto callback = new ValueCallback<V2TIMMessage>{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // Message inserted between group messages successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to insert the message between group messages
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->InsertGroupMessageToLocalStorage(message, groupID, sender,
                                                                                   callback);
```

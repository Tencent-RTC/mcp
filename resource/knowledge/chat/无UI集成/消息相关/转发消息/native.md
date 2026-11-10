---
sync_node_id: '108053280724656128'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "转发消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

You can combine and forward messages in the following steps: 
1. Create a combined message based on the list of original messages.

2. Send the combined message to the receiver.

3. The receiver receives the combined message and parses the list of original messages.

   |Combine and Forward|Display of Combined Message|Click Combined Message to Download Message List for Display|
   |---------|---------|---------|
   ||||

## Combining and Forwarding Messages

### Creating and sending a combined message

A combined message can be created by setting the message list along with the combined message title and digest. The process is as follows:
1. Call the `createMergerMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#acebe275789ab49cc8abe6af5e07aa3b0) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createmergermessage(messagelist:title:abstractlist:compatibletext:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a2943bb31403aeb22f8582cd9966cf13e) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#afc00a2a85b3d29ccfc472ea6544eccf3))  to create a combined message. The list of original messages as well as the combined message title and digest also need to be set.

   

   |Attribute|Description|Remarks|
   |---------|---------|---------|
   |messageList|List of original messages|List of original messages to be combined and forwarded|
   |title|Title|Title of the combined message, such as "Chat History of xixiyah and Hello" as shown above|
   |abstractList|Digest list|Digest list of the combined message as shown above. The original message digests need to be displayed for the combined message, which will be unfolded after the user clicks the cell.|
   |compatibleText|Compatibility text message|If the early SDK version does not support the combined message, the user will receive a text message with the content `compatibleText` by default.|

   Sample code:

   

【Java】
``` java
// List of messages to be forwarded, which can contain combined messages but not group tips
List<V2TIMMessage> msgs = new ArrayList<>();
msgs.add(message1);
msgs.add(message2);
// Title of the combined message
String title = "Chat History of vinson and lynx"; 
// Digest list of the combined message
List<String> abstactList = new ArrayList<>();
msgs.add("abstract1");
msgs.add("abstract2");
msgs.add("abstract3");
// Compatibility text of the combined message. If the early SDK version does not support the combined message, the user will receive a text message with the content `compatibleText` by default.
String compatibleText = "Upgrade to the latest version to check the merged message"; 
// Create a combined message
V2TIMMessage mergeMessage = V2TIMManager.getMessageManager().createMergerMessage(msgs, title, abstractList, compatibleText);
```

【Swift】
``` swift
// List of messages to be forwarded, which can contain combined messages but not group tips
let msgs: [V2TIMMessage] = [message1, message2 /* ... */]
// Title of the combined message
let title = "Chat History of vinson and lynx"
// Digest list of the combined message
let abstractList = ["abstract1", "abstract2", "abstract3"]
// Compatibility text of the combined message. If the early SDK version does not support the combined message, the user will receive a text message with the content `compatibleText` by default.
let compatibleText = "Upgrade to the latest version to check the merged message"
// Create a combined message
let mergeMessage = V2TIMManager.sharedInstance().createMergerMessage(messageList: msgs, title: title, abstractList: abstractList, compatibleText: compatibleText) {
}
```

【Objective-C】
``` objectivec
// List of messages to be forwarded, which can contain combined messages but not group tips
NSArray *msgs = @[message1,message2...];  
// Title of the combined message
NSString *title = @"Chat History of vinson and lynx";  
// Digest list of the combined message
NSArray *abstactList = @[@"abstract1",@"abstract2",@"abstract3"]; 
// Compatibility text of the combined message. If the SDK on an early version does not support the combined message, the user will receive a text message with the content `compatibleText` by default.
NSString *compatibleText = @"Upgrade to the latest version to check the merged message"; 
// Create a combined message
V2TIMMessage *mergeMessage = [[V2TIMManager sharedInstance] createMergerMessage:msgs title:title 
abstractList:abstactList compatibleText:compatibleText];
```

【C++】
``` cpp
// List of messages to be forwarded, which can contain combined messages but not group tips
V2TIMMessageVector messageList;
messageList.PushBack(message1);
messageList.PushBack(message2);
// Title of the combined message
V2TIMString title = "Chat History of vinson and lynx";
// Digest list of the combined message
V2TIMStringVector abstractList;
abstractList.PushBack("abstract1");
abstractList.PushBack("abstract2");
abstractList.PushBack("abstract3");
// Compatibility text of the combined message. If the early SDK version does not support the combined message,
// the user will receive a text message with the content `compatibleText` by default.
V2TIMString compatibleText = "Upgrade to the latest version to check the merged message";
// Create a combined message
V2TIMMessage mergerMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateMergerMessage(
messageList, title, abstractList, compatibleText);
```

2. Call the `sendMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:))  / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the combined message.

   Sample code:

   

【Java】
``` java
// Send the combined message to the user `denny`
V2TIMManager.getMessageManager().sendMessage(mergeMessage, "denny", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
  @Override
  public void onProgress(int progress) {}

  @Override
  public void onSuccess(V2TIMMessage v2TIMMessage) {}

  @Override
  public void onError(int code, String desc) {}
  })
```

【Swift】
``` swift
// Send the combined message to the user `denny`
V2TIMManager.shared.sendMessage(message: msg, receiver: "denny", groupID: nil, priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false,
                offlinePushInfo: nil) { progress in
    //
}succ: {
    print("success")

}fail: { code, desc in
    print("failure, code: \(code), desc: \(desc)")
}
```

【Objective-C】
``` objectivec
// Send the combined message to the user `denny`
[[V2TIMManager sharedInstance] sendMessage:mergeMessage receiver:@"denny"  groupID:nil
 priority:V2TIM_PRIORITY_NORMAL  onlineUserOnly:NO  offlinePushInfo:nil progress:nil succ:nil fail:nil];
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
callback->SetCallback([=](const V2TIMMessage& message) { delete callback; },
                      [=](int error_code, const V2TIMString& error_message) { delete callback; },
                      [=](uint32_t progress) {});

V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    mergerMessage, "denny", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

### Receiving a combined message

#### Adding a listener

The receiver can call `addAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aaccdec10b9fbee5e43eaf908e359c823) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.addadvancedmsglistener(listener:))  / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#acf794752cc6bfa786aea5cd7fabadfab) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a498688ee0f672f114e28d830761dfbf8)) to add the advanced message listener.
We recommend it be called early, such as after the chat page is initialized, to ensure timely message receiving in the application.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().addAdvancedMsgListener(advancedMsgListener);
```

【Swift】
``` swift
// self implements V2TIMAdvancedMsgListener protocol
V2TIMManager.shared.addAdvancedMsgListener(listener: self)
```

【Objective-C】
``` objectivec
// `self` is id<V2TIMAdvancedMsgListener>
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
    // Members ...
};

// Note that `advancedMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener);
```

#### Parsing a message

After the listener is added, the receiver will receive the combined message `V2TIMMessage` in `onRecvNewMessage`.
You can use the combined message element `V2TIMMergerElem` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMergerElem.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMMergerElem.html) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMergerElem.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMMergerElem.html)) to get the `title` and `abstractList` for UI display.
Then, when the user clicks the combined message, you can call the `downloadMergerMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMergerElem.html#af34d8228a9842875652a726f24ac3d30) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMMergerElem.html#v2timmergerelem.downloadmergermessage(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMergerElem.html#ad77abfe27eabf237aee7c951100e6755) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMMergerElem.html#ae980573283ec250c82c26b8e25a3dd59)) to download the combined message list for UI display.

Sample code:

【Java】
``` java
@Override
public void onRecvNewMessage(V2TIMMessage msg) {
  if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_MERGER) {
    // Get the elements of the combined message
    V2TIMMergerElem mergerElem = msg.getMergerElem();
    // Get the `title`
    String title = mergerElem.getTitle();
    // Get the digest list
    List<String> abstractList = mergerElem.getAbstractList();
    // Download the combined message list when the user clicks the combined message
    mergerElem.downloadMergerMessage(new V2TIMValueCallback<List<V2TIMMessage>>() {
      @Override
      public void onSuccess(List<V2TIMMessage> v2TIMMessages) {
        // Downloaded successfully. `v2TIMMessages` is the combined message list.
        for (V2TIMMessage subMsg : v2TIMMessages) {
        // If the combined message list still contains a combined message, continue to parse the message.
        if (subMsg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_MERGER) {
          V2TIMMergerElem mergerElem = subMsg.getMergerElem();
          // Get the `title`
          String title = mergerElem.getTitle();
          // Get the digest list
          List<String> abstractList = mergerElem.getAbstractList();
          // Download the combined message list when the user clicks the combined message
          ......
        }
      }
    }

    @Override
    public void onError(int code, String desc) {
    // Download failed
    }
  });
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_MERGER {
        // Get the elements of the combined message
        let mergerElem = msg.mergerElem
        // Get the `title`
        let title = mergerElem?.title
        // Get the digest list
        let abstractList = mergerElem?.abstractList
        
        // Download the combined message list when the user clicks the combined message
        mergerElem?.downloadMergerMessage { msgs in
                    // Downloaded successfully. `v2TIMMessages` is the combined message list.
            for subMsg in msgs {
                    // If the combined message list still contains a combined message, continue to parse the message.
                if subMsg.elemType == .V2TIM_ELEM_TYPE_MERGER {
                    let subMergerElem = subMsg.mergerElem
                    // Get the `title`
                    let subTitle = subMergerElem?.title
                    // Get the digest list
                    let subAbstractList = subMergerElem?.abstractList
                    
                    // Download the combined message list when the user clicks the combined message
                    subMergerElem?.downloadMergerMessage(succ: { msgs in
                        
                    }, fail: { code, desc in
                        
                    })
                }
            }
        } fail: { code, desc in
            // Download failed
        }
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_MERGER) {
        // Get the elements of the combined message
        V2TIMMergerElem *mergerElem = msg.mergerElem;
        // Get the `title`
        NSString *title = mergerElem.title;
        // Get the digest list
        NSArray *abstractList = mergerElem.abstractList;
        // Download the combined message list when the user clicks the combined message
        [msg.mergerElem downloadMergerMessage:^(NSArray<V2TIMMessage *> *msgs) {
            // Downloaded successfully. `msgs` is the combined message list.
            for (V2TIMMessage *subMsg in msgs) {
                // If the combined message list still contains a combined message, continue to parse the message.
                if (subMsg.elemType == V2TIM_ELEM_TYPE_MERGER) {
                    V2TIMMergerElem *mergerElem = subMsg.mergerElem;
                    // Get the `title`
                    NSString *title = mergerElem.title;
                    // Get the digest list
                    NSArray *abstractList = mergerElem.abstractList;
                    // Download the combined message list when the user clicks the combined message
                    [msg.mergerElem downloadMergerMessage:nil fail:nil];
                }
            }
        } fail:^(int code, NSString *desc) {
            // Download failed
        }];
    }
}
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

class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_MERGER) {
                // Get the elements of the combined message
                auto mergerElem = static_cast<V2TIMMergerElem*>(elem);
                // Get the `title`
                V2TIMString title = mergerElem->title;
                /// Get the digest list
                V2TIMStringVector abstractList = mergerElem->abstractList;

                // Download the combined message list when the user clicks the combined message
                auto callback = new ValueCallback<V2TIMMessageVector>{};
                callback->SetCallback(
                    [=](const V2TIMMessageVector& messageList) {
                        // Downloaded successfully. `v2TIMMessages` is the combined message list.
                        for (size_t i = 0; i < messageList.Size(); ++i) {
                            const V2TIMMessage& message = messageList[i];
                            if (message.elemList.Size() == 1) {
                                V2TIMElem* elem = message.elemList[0];
                                // If the combined message list still contains a combined message, continue to parse the message.
                                if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_MERGER) {
                                    // ...
                                }
                            }
                        }
                        delete callback;
                    },
                    [=](int error_code, const V2TIMString& error_message) { delete callback; });

                mergerElem->DownloadMergerMessage(callback);
            }
        }
    }
    // Other members ...
};

// Note that `advancedMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener);
```

#### Removing a listener

To stop receiving messages, the receiver can call `removeAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a44e1e9126bf5b30234330fe19259cd93) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.removeadvancedmsglistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a28aeebff4a791c9bb8f91a4f61e020e6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a7e27cbe3f0cc26e09de0bdee8b192bea)) to remove the advanced message listener.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().removeAdvancedMsgListener(advancedMsgListener);
```

【Swift】
``` swift
V2TIMManager.shared.removeAdvancedMsgListener(listener: self)
```

【Objective-C】
``` objectivec
// `self` is id<V2TIMAdvancedMsgListener>
[[V2TIMManager sharedInstance] removeAdvancedMsgListener:self];
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
    // Members ...
};

// `advancedMsgListener` is the instance of AdvancedMsgListener
V2TIMManager::GetInstance()->GetMessageManager()->RemoveAdvancedMsgListener(&advancedMsgListener);
```

## Forwarding Messages One by One

To forward a single message, create a message identical to the original message through the `createForwardMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#af8f609bfbfe99a0c65611b14159b6b4d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createforwardmessage(message:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a05d088b7d9883e18af41355cdd3f4562) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aaff05e59893cb1cfe5a806e700e1e270)) first, and then call the `sendMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the message.

Sample code:

【Java】
``` java
// Create a message with the same elements as the original message
V2TIMMessage forwardMessage = V2TIMManager.getMessageManager().createForwardMessage(originMsg);
// Send the message to the user `denny`
V2TIMManager.getMessageManager().sendMessage(forwardMessage, "denny", null, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
  @Override
  public void onProgress(int progress) {
  }

  @Override
  public void onSuccess(V2TIMMessage message) {
  }

  @Override
  public void onError(int code, String desc) {
  }
});
```

【Swift】
``` swift
// Create a message with the same elements as the original message
if  let originMsg = sendedMsgList.first,
    let msg = V2TIMManager.shared.createForwardMessage(message: originMsg) {
// Send the message to the user `denny`
    _ = V2TIMManager.shared.sendMessage(message: msg, receiver: "denny", groupID: nil , priority: .V2TIM_PRIORITY_DEFAULT, onlineUserOnly: false, offlinePushInfo: nil) { progress in
        
    } succ: {
    } fail: { code, desc in

    }
}
```

【Objective-C】
``` objectivec
// Create a message with the same elements as the original message
V2TIMMessage *forwardMessage = [[V2TIMManager sharedInstance] createForwardMessage:originMsg];
// Send the message to the user `denny`
[[V2TIMManager sharedInstance] sendMessage:forwardMessage receiver:@"denny"  groupID:nil
 priority:V2TIM_PRIORITY_NORMAL  onlineUserOnly:NO  offlinePushInfo:nil progress:nil succ:nil fail:nil];
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

// Create a message with the same elements as the original message
V2TIMMessage forwardMessage = V2TIMManager::GetInstance()->GetMessageManager()->CreateForwardMessage(originMsg);

auto callback = new SendCallback{};
callback->SetCallback([=](const V2TIMMessage& message) { delete callback; },
                      [=](int error_code, const V2TIMString& error_message) { delete callback; },
                      [=](uint32_t progress) {});

// Send the message to the user `denny`
V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    forwardMessage, "denny", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

---
sync_node_id: '108053271718436864'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "接收消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description
- The `addSimpleMsgListener` API is used to listen for and receive text and custom messages, with the callback defined in the `V2TIMSimpleMsgListener` protocol.

- The `addAdvancedMsgListener` API is used to listen for and receive all types of messages (text, custom, and rich media messages), with the callback defined in the `V2TIMAdvancedMsgListener` protocol.

## Setting a Message Listener

The SDK provides the `V2TIMSimpleMsgListener` simple message listener and the `V2TIMAdvancedMsgListener` advanced message listener.
They differ in that:
1. The simple message listener **can only** receive text and custom messages. You can use it if your business only requires these two types of messages.

2. The advanced message listener can receive **all** types of messages. You can use it if your business also requires rich media, merged, and other messages.

   > **Note:**
   > 
   > 1. `addSimpleMsgListener` and `addAdvancedMsgListener` are exclusive. **Do not use both of them**; otherwise, unpredictable logic bugs will occur.
   > 2. A message listener **must** be added first to receive the following types of messages.

### Simple message listener

#### Adding a listener

The receiver calls the `addSimpleMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#afd96fd1591e41f031421c0655d8e5d6b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.addsimplemsglistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a149cdf7924aa13746692d18d605def88) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad039bd93fe1a09cf45034697e1c1328f)) to add the simple message listener. We recommend it be called early, such as after the chat page is initialized, to ensure timely message receiving in the application.

Sample code:

【Java】
``` java
V2TIMManager.getInstance().addSimpleMsgListener(simpleMsgListener);
```

【Swift】
``` swift
V2TIMManager.shared.addSimpleMsgListener(listener: self)
```

【Objective-C】
``` objectivec
// `self` is id<V2TIMSignalingListener>
[[V2TIMManager sharedInstance] addSimpleMsgListener:self];
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
    // Members ...
};

// Note that `simpleMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SimpleMsgListener simpleMsgListener;
V2TIMManager::GetInstance()->AddSimpleMsgListener(&simpleMsgListener);
```

#### Listener callback event

After adding the simple message listener, the receiver can receive different types of messages in the callback of `V2TIMSimpleMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSimpleMsgListener.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSimpleMsgListener.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSimpleMsgListener-p.html) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSimpleMsgListener.html)), as described below:

【Java】
``` java
public abstract class V2TIMSimpleMsgListener {
    // Received the one-to-one text message
    public void onRecvC2CTextMessage(String msgID, V2TIMUserInfo sender, String text) {}

    // Received the custom one-to-one (signaling) message
    public void onRecvC2CCustomMessage(String msgID, V2TIMUserInfo sender, byte[] customData) {}

    // Received the group text message
    public void onRecvGroupTextMessage(String msgID, String groupID, V2TIMGroupMemberInfo sender, String text) {}

    // Received the custom group (signaling) message
    public void onRecvGroupCustomMessage(String msgID, String groupID, V2TIMGroupMemberInfo sender, byte[] customData) {}
}
```

【Swift】
``` swift
public protocol V2TIMSimpleMsgListener : AnyObject {
    // Received the one-to-one text message
    func onRecvC2CTextMessage(msgID: String, sender: V2TIMUserInfo, text: String?)
    // Received the custom one-to-one (signaling) message
    func onRecvC2CCustomMessage(msgID: String, sender: V2TIMUserInfo, customData: Data?)
    // Received the group text message
    func onRecvGroupTextMessage(msgID: String, groupID: String, sender: V2TIMGroupMemberInfo, text: String?)
    // Received the custom group (signaling) message
    func onRecvGroupCustomMessage(msgID: String, groupID: String, sender: V2TIMGroupMemberInfo, customData: Data?)

}

```

【Objective-C】
``` objectivec
/// Basic message callback of the IM SDK
@protocol V2TIMSimpleMsgListener <NSObject>
@optional

/// Received a one-to-one text message
- (void)onRecvC2CTextMessage:(NSString *)msgID  sender:(V2TIMUserInfo *)info text:(NSString *)text;

/// Received a custom one-to-one (signaling) message
- (void)onRecvC2CCustomMessage:(NSString *)msgID  sender:(V2TIMUserInfo *)info customData:(NSData *)data;

/// Received a group text message
- (void)onRecvGroupTextMessage:(NSString *)msgID groupID:(NSString *)groupID sender:(V2TIMGroupMemberInfo *)info text:(NSString *)text;

/// Received a custom group (signaling) message
- (void)onRecvGroupCustomMessage:(NSString *)msgID groupID:(NSString *)groupID sender:(V2TIMGroupMemberInfo *)info customData:(NSData *)data;
@end
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
public:
    SimpleMsgListener() = default;
    ~SimpleMsgListener() override = default;

    // Received the one-to-one text message
    void OnRecvC2CTextMessage(const V2TIMString& msgID, const V2TIMUserFullInfo& sender,
                              const V2TIMString& text) override {}

    // Received the custom one-to-one (signaling) message
    void OnRecvC2CCustomMessage(const V2TIMString& msgID, const V2TIMUserFullInfo& sender,
                                const V2TIMBuffer& customData) override {}

    // Received the group text message
    void OnRecvGroupTextMessage(const V2TIMString& msgID, const V2TIMString& groupID,
                                const V2TIMGroupMemberFullInfo& sender, const V2TIMString& text) override {}

    // Received the custom group (signaling) message
    void OnRecvGroupCustomMessage(const V2TIMString& msgID, const V2TIMString& groupID,
                                  const V2TIMGroupMemberFullInfo& sender,
                                  const V2TIMBuffer& customData) override {}
};
```

#### Removing a listener

To stop receiving messages, the receiver can call `removeSimpleMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a86ac462d87f652960d2600a52009849a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.removesimplemsglistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#afa3040f676105f3fb78d4835ee3c898b) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ab4355384fafb97a099d518f40dbc7654)) to remove the simple message listener.

Sample code:

【Java】
``` java
V2TIMManager.getInstance().removeSimpleMsgListener(simpleMsgListener);
```

【Swift】
``` swift
V2TIMManager.shared.removeSimpleMsgListener(listener: self)
```

【Objective-C】
``` objectivec
// `self` is id<V2TIMSignalingListener>
[[V2TIMManager sharedInstance] removeSimpleMsgListener:self];
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
    // Members ...
};

// `simpleMsgListener` is the instance of SimpleMsgListener
V2TIMManager::GetInstance()->RemoveSimpleMsgListener(&simpleMsgListener);
```

### Advanced message listener

#### Adding a listener

The receiver calls the `addAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aaccdec10b9fbee5e43eaf908e359c823) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.addadvancedmsglistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#acf794752cc6bfa786aea5cd7fabadfab) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a498688ee0f672f114e28d830761dfbf8)) to add the advanced message listener. We recommend it be called early, such as after the chat page is initialized, to ensure timely message receiving in the application.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().addAdvancedMsgListener(advancedMsgListener);
```

【Swift】
``` swift
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

#### Listener callback event

After adding the advanced message listener, the receiver can receive different types of messages in the callback of `V2TIMAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html)), as described below:

【Java】
``` java
public abstract class V2TIMAdvancedMsgListener {
    // Received a new message
    public void onRecvNewMessage(V2TIMMessage msg) {}

    // one-to-one message read notification (a notification is received when the receiver calls `markC2CMessageAsRead`)
    public void onRecvC2CReadReceipt(List<V2TIMMessageReceipt> receiptList) {}

    // Message read receipt notification (if read receipts are supported, the notification is received when the receiver calls `sendMessageReadReceipts`)
    public void onRecvMessageReadReceipts(List<V2TIMMessageReceipt> receiptList) {}

    // Received a message recall notification
    public void onRecvMessageRevoked(String msgID) {}

    // The message content is modified.
    public void onRecvMessageModified(V2TIMMessage msg) {}
}
```

【Swift】
``` swift
public protocol V2TIMAdvancedMsgListener: AnyObject {
    // Received a new message
    func onRecvNewMessage(msg: V2TIMMessage)
    
    // Message read receipt notification (if read receipts are supported, the notification is received when the receiver calls `sendMessageReadReceipts`)

    func onRecvMessageReadReceipts(receiptList: Array<V2TIMMessageReceipt>)
    
    // one-to-one message read notification (a notification is received when the receiver calls `markC2CMessageAsRead`)

    func onRecvC2CReadReceipt(receiptList: Array<V2TIMMessageReceipt>)
    
    // Received a message recall notification
    func onRecvMessageRevoked(msgID: String, operateUser: V2TIMUserInfo, reason: String?)
    
    // The message content is modified.
    func onRecvMessageModified(msg: V2TIMMessage)
}
```

【Objective-C】
``` objectivec
/// Advanced message listener
@protocol V2TIMAdvancedMsgListener <NSObject>
@optional
/// Received a new message
- (void)onRecvNewMessage:(V2TIMMessage *)msg;

/// Message read receipt notification (if read receipts are supported, the notification is received when the receiver calls `sendMessageReadReceipts`)
- (void)onRecvMessageReadReceipts:(NSArray<V2TIMMessageReceipt *> *)receiptList;

/// One-to-one message read notification (a notification is received when the receiver calls `markC2CMessageAsRead`)
- (void)onRecvC2CReadReceipt:(NSArray<V2TIMMessageReceipt *> *)receiptList;

/// Received a message recall notification
- (void)onRecvMessageRevoked:(NSString *)msgID;

/// The message content is modified
- (void)onRecvMessageModified:(V2TIMMessage *)msg;
@end
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    AdvancedMsgListener() = default;
    ~AdvancedMsgListener() override = default;

    // Received a new message
    void OnRecvNewMessage(const V2TIMMessage& message) override {}

    // one-to-one message read notification (a notification is received when the receiver calls `markC2CMessageAsRead`)
    void OnRecvC2CReadReceipt(const V2TIMMessageReceiptVector& receiptList) override {}

    // Message read receipt notification (if read receipts are supported, the notification is received when the receiver calls `sendMessageReadReceipts`)
    void OnRecvMessageReadReceipts(const V2TIMMessageReceiptVector& receiptList) override {}

    // Received a message recall notification
    void OnRecvMessageRevoked(const V2TIMString& messageID) override {}

    // The message content is modified.
    void OnRecvMessageModified(const V2TIMMessage& message) override {}
};
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

## Receiving a Text Message

### Using simple message listener

#### One-to-one text message

The receiver can receive a one-to-one text message by using the simple message listener in the following steps:
1. Call `addSimpleMsgListener` to set the event listener.

2. Listen for the `onRecvC2CTextMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSimpleMsgListener.html#a59343bacf7c68b560157cdd1417348db) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSimpleMsgListener.html#v2timsimplemsglistener.onrecvc2ctextmessage(msgid:sender:text:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSimpleMsgListener-p.html#a1b467b330291b233c6c15e7e218762b2) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSimpleMsgListener.html#ad34900d5d155474905890d53d8777edc)) to receive text messages.

3. To stop receiving messages, call `removeSimpleMsgListener` to remove the listener. This step is optional and can be performed as needed.

   Sample code:

   

【Java】
``` java
// Set the event listener
V2TIMManager.getInstance().addSimpleMsgListener(simpleMsgListener);

// Receive the one-to-one text message
/**
 * Received the one-to-one text message
 *
 * @param msgID Unique message ID
 * @param sender Sender information
 * @param text The sent content
 */
public void onRecvC2CTextMessage(String msgID, V2TIMUserInfo sender, String text) {
    // Parse the message and display it on the UI
}
```

【Swift】
``` swift
// Set the event listener
V2TIMManager.shared.addSimpleMsgListener(listener: self)

// Receive the one-to-one text message
/**
 * Received the one-to-one text message
 *
 * @param msgID Unique message ID
 * @param sender Sender information
 * @param text The sent content
 */
func onRecvC2CTextMessage(msgID: String, sender: V2TIMUserInfo, text: String?) {
    // Parse the message and display it on the UI
}

```

【Objective-C】
``` objectivec
// Set the event listener
[[V2TIMManager sharedInstance] addSimpleMsgListener:self];

/// Receive the one-to-one text message
/// @param msgID Message ID
/// @param info Sender information
/// @param text Text content
- (void)onRecvC2CTextMessage:(NSString *)msgID sender:(V2TIMUserInfo *)info text:(NSString *)text {
    // Parse the message and display it on the UI
}
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
public:
    /**
     * Receive the one-to-one text message
     *
     * @param msgID Unique message ID
     * @param sender Sender information
     * @param text The sent content
     */
    void OnRecvC2CTextMessage(const V2TIMString& msgID, const V2TIMUserFullInfo& sender,
                              const V2TIMString& text) override {
        // Parse the message and display it on the UI
        std::cout << "text:" << std::string{text.CString(), text.Size()} << std::endl;
    }
    // Other members ...
};

// Note that `simpleMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SimpleMsgListener simpleMsgListener;
V2TIMManager::GetInstance()->AddSimpleMsgListener(&simpleMsgListener);
```

#### Group text message

The receiver can receive a group text message by using the simple message listener in the following steps:
1. Call `addSimpleMsgListener` to set the event listener.

2. Listen for the `onRecvGroupTextMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSimpleMsgListener.html#a1f9eaa4fdc323a8ec375b7068df7b7d4) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSimpleMsgListener.html#v2timsimplemsglistener.onrecvgrouptextmessage(msgid:groupid:sender:text:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSimpleMsgListener-p.html#abee1960a3674e490ce1291889f366d3c) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSimpleMsgListener.html#ae4b399e439ef58089bf23b520f6f3f19)) to receive text messages.

3. To stop receiving messages, call `removeSimpleMsgListener` to remove the listener. This step is optional and can be performed as needed.

   Sample code:

   

【Java】
``` java
// Set the event listener
V2TIMManager.getInstance().addSimpleMsgListener(simpleMsgListener);

// Receive the group text message
/**
 * Received the group text message
 *
 * @param msgID Unique message ID
 * @param groupID Group ID
 * @param sender The group member information of the sender
 * @param text The sent content
 */
public void onRecvGroupTextMessage(String msgID, String groupID, V2TIMGroupMemberInfo sender, String text) {
    // Parse the message and display it on the UI
}
```

【Swift】
``` swift
// Set the event listener
V2TIMManager.shared.addSimpleMsgListener(listener: self)
// Receive the group text message
/**
 * Received the group text message
 *
 * @param msgID Unique message ID
 * @param groupID Group ID
 * @param sender The group member information of the sender
 * @param text The sent content
 */
func onRecvGroupTextMessage(msgID: String, groupID: String, sender: V2TIMGroupMemberInfo, text:String?
 {
    // Parse the message and display it on the UI
}
```

【Objective-C】
``` objectivec
// Set the event listener
[[V2TIMManager sharedInstance] addSimpleMsgListener:self];

/// Receive the group text message
/// @param msgID Message ID
/// @param groupID Group ID
/// @param info Sender information
/// @param text Text content
- (void)onRecvGroupTextMessage:(NSString *)msgID groupID:(NSString *)groupID sender:(V2TIMGroupMemberInfo *)info text:(NSString *)text {
    // Parse the message and display it on the UI
}
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
public:
    /**
     * Received the group text message
     *
     * @param msgID Unique message ID
     * @param groupID Group ID
     * @param sender The group member information of the sender
     * @param text The sent content
     */
    void OnRecvGroupTextMessage(const V2TIMString& msgID, const V2TIMString& groupID,
                                const V2TIMGroupMemberFullInfo& sender, const V2TIMString& text) override {
        // Parse the message and display it on the UI
        std::cout << "text:" << std::string{text.CString(), text.Size()} << std::endl;
    }
    // Other members ...
};

// Note that `simpleMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SimpleMsgListener simpleMsgListener;
V2TIMManager::GetInstance()->AddSimpleMsgListener(&simpleMsgListener);
```

### Using advanced message listener

The receiver can receive a one-to-one or group text message by using the advanced message listener in the following steps:
1. Call `addAdvancedMsgListener` to set the event listener.

2. Listen for the `onRecvNewMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#a6771cfa1a897e24b05c17788aba15ff6) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvnewmessage(msg:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#ae36dde0fab51c29f6d1620ab4b13d7a3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#acbd1dba3526377d88f14c2183901511c)) to receive text messages.

3. To stop receiving messages, call `removeAdvancedMsgListener` to remove the listener. This step is optional and can be performed as needed.

   Sample code:

   

【Java】
``` java
// Set the event listener
V2TIMManager.getMessageManager().addAdvancedMsgListener(advancedMsgListener);

/**
 * Received a new message
 * @param msg Message
 */
public void onRecvNewMessage(V2TIMMessage msg) {
    // Parse the `groupID` and `userID`
    String groupID = msg.getGroupID();
    String userID = msg.getUserID();

    // Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.

    // Parse the text message in `msg`
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_TEXT) {
        V2TIMTextElem textElem = msg.getTextElem();
        String text = textElem.getText();
        Log.i("onRecvNewMessage", "text:" + text);
    }
}
```

【Swift】
``` swift
// Set the event listener
V2TIMManager.shared.addAdvancedMsgListener(listener: self)

/**
 * Received a new message
 * @param msg Message
 */
func onRecvNewMessage(_ msg: V2TIMMessage) {
    // Parse the `groupID` and `userID`
    let groupID = msg.groupID
    let userID = msg.userID

   // Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.
    if !groupID.isEmpty {
        print("Received a group message in group: \(groupID)")
    } else if !userID.isEmpty {
        print("Received a one-on-one message from user: \(userID)")
    } else {
        print("Received a message with no identifiable sender.")
    }

    // Parse the text message in `msg`
    if msg.elemType == .V2TIM_ELEM_TYPE_TEXT {
        if let textElem = msg.textElem {
            let text = textElem.text
            print("onRecvNewMessage, text: \(text)")
        }
    } else {
        print("Received a non-text message.")
    }
}

```

【Objective-C】
``` objectivec
// Set the event listener
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];

/// Receive the message
/// @param msg Message object
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    // Parse the `groupID` and `userID`
    NSString *groupID = msg.groupID;
    NSString *userID = msg.userID;

    // Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.

    // Parse the text message in `msg`
    if (msg.elemType == V2TIM_ELEM_TYPE_TEXT) {
        V2TIMTextElem *textElem = msg.textElem;
        NSString *text = textElem.text;
        NSLog(@"onRecvNewMessage, text: %@", text);
    }
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
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        // Parse the `groupID` and `userID`
        V2TIMString groupID = message.groupID;
        V2TIMString userID = message.userID;

        // Determine whether it's a one-to-one chat or group chat
        // If `groupID` is not empty, the message is from a group chat;
        // if `userID` is not empty, the message is from a one-to-one chat.
    
        // Parse the text message in `message`
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_TEXT) {
                auto textElem = static_cast<V2TIMTextElem*>(elem);
                V2TIMString text = textElem->text;
                // Parse the message and display it on the UI
                std::cout << "text:" << std::string{text.CString(), text.Size()} << std::endl;
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

## Receiving a Custom Message

### Using simple message listener

#### Custom one-to-one message

The receiver can receive a custom one-to-one message by using the simple message listener in the following steps:
1. Call `addSimpleMsgListener` to set the event listener.

2. Listen for the `onRecvC2CCustomMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSimpleMsgListener.html#a13d77741c8286b011c1eb7513a9eb2c7) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSimpleMsgListener.html#v2timsimplemsglistener.onrecvc2ccustommessage(msgid:sender:customdata:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSimpleMsgListener-p.html#ae6eec84f9664f08591bc743f20f2360b) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSimpleMsgListener.html#a3b017ad440952959b8b2ff3a4d016201)) to receive custom one-to-one messages.

3. To stop receiving messages, call `removeSimpleMsgListener` to remove the listener. This step is optional and can be performed as needed.

   Sample code:

   

【Java】
``` java
/**
 * Receive the custom one-to-one message
 * @param msgID Message ID
 * @param sender Sender information
 * @param customData The sent content
 */
public void onRecvC2CCustomMessage(String msgID, V2TIMUserInfo sender, byte[] customData) {
    Log.i("onRecvC2CCustomMessage", "msgID:" + msgID + ", from:" + sender.getNickName() + ", content:" + new String(customData));
}
```

【Swift】
``` swift
/**
 * Receive the custom one-to-one message
 * @param msgID Message ID
 * @param sender Sender information
 * @param customData The sent content
 */
func onRecvC2CCustomMessage(msgID: String, sender: V2TIMUserInfo, customData: Data?) {

}

```

【Objective-C】
``` objectivec
/// Receive the custom one-to-one message
/// @param msgID Message ID
/// @param info Sender information
/// @param data The binary content of the custom message
- (void)onRecvC2CCustomMessage:(NSString *)msgID sender:(V2TIMUserInfo *)info customData:(NSData *)data {
    NSLog(@"onRecvC2CCustomMessage, msgID: %@, sender: %@, customData: %@", msgID, info, data);
}
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
public:
    /**
     * Receive the custom one-to-one message
     *
     * @param msgID Message ID
     * @param sender Sender information
     * @param customData The sent content
     */
    void OnRecvC2CCustomMessage(const V2TIMString& msgID, const V2TIMUserFullInfo& sender,
                                const V2TIMBuffer& customData) override {
        // Parse the message and display it on the UI
        std::cout << "customData:"
                  << std::string{reinterpret_cast<const char*>(customData.Data()), customData.Size()}
                  << std::endl;
    }
    // Other members ...
};

// Note that `simpleMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SimpleMsgListener simpleMsgListener;
V2TIMManager::GetInstance()->AddSimpleMsgListener(&simpleMsgListener);
```

#### Custom group message

The receiver can receive a custom group message by using the simple message listener in the following steps:
1. Call `addSimpleMsgListener` to set the event listener.

2. Listen for the `onRecvGroupCustomMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSimpleMsgListener.html#a46b48869e411b41c25a98211d951335c) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSimpleMsgListener.html#v2timsimplemsglistener.onrecvgroupcustommessage(msgid:groupid:sender:customdata:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSimpleMsgListener-p.html#abd21785aa5bfcee78ffb1a94383077d1) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSimpleMsgListener.html#a9adce62c824998c6382a0cc7ade96b1f)) to receive custom group messages.

3. To stop receiving messages, call `removeSimpleMsgListener` to remove the listener. This step is optional and can be performed as needed.

   

【Java】
``` java
/**
 * Receive the custom group message
 * @param msgID Message ID
 * @param groupID Group ID
 * @param sender The group member information of the sender
 * @param customData The sent content
 */
public void onRecvGroupCustomMessage(String msgID, String groupID, V2TIMGroupMemberInfo sender, byte[] customData) {
    Log.i("onRecvGroupCustomMessage", "msgID:" + msgID + ", groupID:" + groupID + ", from:" + sender.getNickName() + ", content:" + new String(customData));
}
```

【Swift】
``` swift
/**
 * Receive the custom group message
 * @param msgID Message ID
 * @param groupID Group ID
 * @param sender The group member information of the sender
 * @param customData The sent content
 */
func onRecvGroupCustomMessage(msgID: String, groupID: String, sender: V2TIMGroupMemberInfo, customData: Data?) {

}

```

【Objective-C】
``` objectivec
/// Receive the custom group message
/// @param msgID Message ID
/// @param groupID Group ID
/// @param info Sender information
/// @param text The binary content of the custom message
- (void)onRecvGroupCustomMessage:(NSString *)msgID groupID:(NSString *)groupID sender:(V2TIMGroupMemberInfo *)info customData:(NSData *)data {
    NSLog(@"onRecvGroupCustomMessage, msgID: %@, groupID: %@, sender: %@, customData: %@", msgID, groupID, info, data);
}
```

【C++】
``` cpp
class SimpleMsgListener final : public V2TIMSimpleMsgListener {
public:
    /**
     * Receive the custom group message
     *
     * @param msgID Message ID
     * @param groupID Group ID
     * @param sender The group member information of the sender
     * @param customData The sent content
     */
    void OnRecvGroupCustomMessage(const V2TIMString& msgID, const V2TIMString& groupID,
                                  const V2TIMGroupMemberFullInfo& sender,
                                  const V2TIMBuffer& customData) override {
        // Parse the message and display it on the UI
        std::cout << "customData:"
                  << std::string{reinterpret_cast<const char*>(customData.Data()), customData.Size()}
                  << std::endl;
    }
    // Other members ...
};

// Note that `simpleMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SimpleMsgListener simpleMsgListener;
V2TIMManager::GetInstance()->AddSimpleMsgListener(&simpleMsgListener);
```

### Using advanced message listener

The receiver can receive a custom one-to-one or group message by using the advanced message listener in the following steps:
1. Call `addAdvancedMsgListener` to set the event listener.

2. Listen for the `onRecvNewMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#a6771cfa1a897e24b05c17788aba15ff6) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvnewmessage(msg:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#ae36dde0fab51c29f6d1620ab4b13d7a3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#acbd1dba3526377d88f14c2183901511c)) to receive custom messages.

3. To stop receiving messages, call `removeAdvancedMsgListener` to remove the listener. This step is optional and can be performed as needed.

   Sample code:

   

【Java】
``` java
// Set the event listener
V2TIMManager.getMessageManager().addAdvancedMsgListener(v2TIMAdvancedMsgListener);

// Receive the message
public void onRecvNewMessage(V2TIMMessage msg) {
    // Parse the `groupID` and `userID`
    String groupID = msg.getGroupID();
    String userID = msg.getUserID();

    // Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.

    // Parse the custom message in `msg`
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_CUSTOM) {
        V2TIMCustomElem customElem = msg.getCustomElem();
        String data = new String(customElem.getData());
        Log.i("onRecvNewMessage", "customData:" + data);
    }
}
```

【Swift】
``` swift
// Set the event listener
V2TIMManager.shared.addAdvancedMsgListener(listener: self)

// Receive the message
func onRecvNewMessage(_ msg: V2TIMMessage) {
    // Parse the `groupID` and `userID`
    let groupID = msg.groupID
    let userID = msg.userID

// Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.
    if !groupID.isEmpty {
        print("Received a group message in group: \(groupID)")
    } else if !userID.isEmpty {
        print("Received a one-on-one message from user: \(userID)")
    } else {
        print("Received a message with no identifiable sender.")
    }

    // Parse the custom message in `msg`
    if msg.elemType == .V2TIM_ELEM_TYPE_TEXT {
        if let textElem = msg.textElem {
            let text = textElem.text
            print("onRecvNewMessage, text: \(text)")
        }
    } else {
        print("Received a non-text message.")
    }
}
```

【Objective-C】
``` objectivec
// Set the event listener
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];

/// Receive the message
/// @param msg Message object
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    // Parse the `groupID` and `userID`
    NSString *groupID = msg.groupID;
    NSString *userID = msg.userID;

    // Determine whether it's a one-to-one chat or group chat
    // If `groupID` is not empty, the message is from a group chat; if `userID` is not empty, the message is from a one-to-one chat.

    // Parse the custom message in `msg`
    if (msg.elemType == V2TIM_ELEM_TYPE_CUSTOM) {
        V2TIMCustomElem *customElem = msg.customElem;
        NSData *customData = customElem.data;
        NSLog(@"onRecvNewMessage, customData: %@", customData);
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    /**
     * Receive the message
     *
     * @param message Message
     */
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        // Parse the `groupID` and `userID`
        V2TIMString groupID = message.groupID;
        V2TIMString userID = message.userID;

        // Determine whether it's a one-to-one chat or group chat
        // If `groupID` is not empty, the message is from a group chat;
        // if `userID` is not empty, the message is from a one-to-one chat.

        // Parse the custom message in `message`
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_CUSTOM) {
                auto customElem = static_cast<V2TIMCustomElem*>(elem);
                V2TIMBuffer data = customElem->data;
                // Parse the message and display it on the UI
                std::cout << "data:"
                          << std::string{reinterpret_cast<const char*>(data.Data()), data.Size()}
                          << std::endl;
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

## Receiving a Rich Media Message

The receiver can receive a rich media message **only by using** the advanced message listener in the following steps:
1. Call the `addAdvancedMsgListener` API to set the advanced message listener.

2. Listen for the `onRecvNewMessage` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#a6771cfa1a897e24b05c17788aba15ff6) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvnewmessage(msg:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#ae36dde0fab51c29f6d1620ab4b13d7a3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#acbd1dba3526377d88f14c2183901511c)) to receive the `V2TIMMessage` message.

3. Parse the `elemType` attribute in the `V2TIMMessage` message and then parse the message again according to the type to get the specific content of the elements in the message.

4. To stop receiving messages, call `removeAdvancedMsgListener` to remove the listener. This step is optional and can be performed as needed.

### Image message

The image in an image message can be in three formats: original, large, and thumbnail. The latter two are automatically generated by the SDK during message sending and can be ignored.
- Large image: A large image is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 720 pixels.

- Thumbnail: A thumbnail is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 198 pixels.

   After the image message is received, we recommend you call the SDK's `downloadImage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMImageElem_1_1V2TIMImage.html#a9114c16b095bbf608027c71eb40e9025) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMImage.html#v2timimage.downloadimage(path:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMImage.html#a2ef83a4fb5c2a047acaf881ee90df58e) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMImage.html#a68989f22baa77f5c4700be434d5d7fa9)) to download the image and then render it to the UI layer.

   To avoid repeated download and save resources, we recommend you set the `uuid` attribute value of the `V2TIMImage` object to the image download path to identify the image.

   The following sample code demonstrates how to parse the image content from `V2TIMMessage`:

   

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_IMAGE) {
        // Image message
        V2TIMImageElem v2TIMImageElem = msg.getImageElem();
        // The image in an image message can be in three formats: original, large, and thumbnail. The latter two are automatically generated by the SDK during message sending and can be ignored.
        // Large image: A large image is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 720 pixels.
        // Thumbnail: A thumbnail is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 198 pixels.
        List<V2TIMImageElem.V2TIMImage> imageList = v2TIMImageElem.getImageList();
        for (V2TIMImageElem.V2TIMImage v2TIMImage : imageList) {
            // Image ID, which is an internal ID and can be used as an external cache key
            String uuid = v2TIMImage.getUUID();
            // Image types, encompassing three distinct varieties: V2TIM_IMAGE_TYPE_ORIGIN (Original), V2TIM_IMAGE_TYPE_THUMB (Thumbnail), and V2TIM_IMAGE_TYPE_LARGE (Large).
            int imageType = v2TIMImage.getType();
            // Image size (bytes)
            int size = v2TIMImage.getSize();
            // Image width
            int width = v2TIMImage.getWidth();
            // Image height
            int height = v2TIMImage.getHeight();
            // Image download url
            String url = v2TIMImage.getUrl();
            // Set the image download path `imagePath`. Here, `uuid` can be used as an identifier to avoid repeated download.
            String imagePath = "/sdcard/im/image/" + "myUserID" + uuid;
            File imageFile = new File(imagePath);
            // Determine whether there is a downloaded image file in `imagePath`
            if (!imageFile.exists()) {
                // Download the image
                v2TIMImage.downloadImage(imagePath, new V2TIMDownloadCallback() {
                    @Override
                    public void onProgress(V2TIMElem.V2ProgressInfo progressInfo) {
                        // Callback for download progress. `v2ProgressInfo.getCurrentSize()` indicates the downloaded file size, and `v2ProgressInfo.getTotalSize()` indicates the total file size.
                    }
                    @Override
                    public void onError(int code, String desc) {
                        // Download failed
                    }
                    @Override
                    public void onSuccess() {
                        // Downloaded
                    }
                });
            } else {
                // The image already exists.
            }
        }
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_IMAGE {
        guard let imageElem = msg.imageElem else { return }
        // The image in an image message can be in three formats: original, large, and thumbnail. The latter two are automatically generated by the SDK during message sending and can be ignored.
        // Large image: A large image is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 720 pixels.
        // Thumbnail: A thumbnail is an image obtained after the original image is proportionally compressed. After the compression, the height or width (whichever is shorter) is equal to 198 pixels.
        let imageList = imageElem.imageList
        for timImage in imageList {
            // Image ID, which is an internal ID and can be used as an external cache key
            let uuid = timImage.uuid
            // Image type
            let type = timImage.type
            // Image size (bytes)
            let size = timImage.size
            let width = timImage.width
            let height = timImage.height
            // Image download url
            let url = timImage.url
            // Set the image download path `imagePath`. Here, `uuid` can be used as an identifier to avoid repeated download.
            let imagePath = NSTemporaryDirectory().appending("testImage\(timImage.uuid)")
            
            // Determine whether there is a downloaded image file in `imagePath`
            if !FileManager.default.fileExists(atPath: imagePath) {
                // Download the image
                timImage.downloadImage(path: imagePath, progress: { curSize, totalSize in
                    print("Image download progress：curSize：\(curSize), totalSize: \(totalSize)")
                }, succ: {

                    print("Image download success")
                }, fail: { code, msg in
                    // Download failed
                    print("failed：code：\(code), msg: \(msg)")
                })
            } else {
                // The image already exists.
                print(" The image already exists.：\(imagePath)")
            }
            
            print("Image info：uuid: \(uuid), type: \(type.rawValue), size: \(size), width: \(width), height: \(height)")
        }
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_IMAGE) {
        V2TIMImageElem *imageElem = msg.imageElem;
        // The list of original images, large images, and thumbnails
        NSArray<V2TIMImage *> *imageList = imageElem.imageList;
        for (V2TIMImage *timImage in imageList) {
            // Image ID, which is an internal ID and can be used as an external cache key
            NSString *uuid = timImage.uuid;
            // Image type
            V2TIMImageType type = timImage.type;
            // Image size (bytes)
            int size = timImage.size;
            // Image width
            int width = timImage.width;
            // Image height
            int height = timImage.height;
            // Image download url
            NSString * url = timImage.url;
            // Set the image download path `imagePath`. Here, `uuid` can be used as an identifier to avoid repeated download.
            NSString *imagePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat: @"testImage%@", timImage.uuid]];
            // Determine whether there is a downloaded image file in `imagePath`
            if (![[NSFileManager defaultManager] fileExistsAtPath:imagePath]) {
                // Download the image
                [timImage downloadImage:imagePath progress:^(NSInteger curSize, NSInteger totalSize) {
                    // Download progress
                    NSLog(@"Image download progress: curSize: %lu,totalSize:%lu",curSize,totalSize);
                } succ:^{
                    // Downloaded successfully
                    NSLog(@"Image downloaded");
                } fail:^(int code, NSString *msg) {
                    // Download failed
                    NSLog(@"Failed to download the image: code: %d,msg:%@",code,msg);
                }];
            } else {
                // The image already exists.
            }
            NSLog(@"Image information: uuid:%@, type:%ld, size:%d, width:%d, height:%d", uuid, (long)type, size, width, height);
        }
    }
}
```

【C++】
``` cpp
class DownloadCallback final : public V2TIMDownloadCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using DownLoadProgressCallback = std::function<void(uint64_t, uint64_t)>;

    DownloadCallback() = default;
    ~DownloadCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     DownLoadProgressCallback download_progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        download_progress_callback_ = std::move(download_progress_callback);
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
    void OnDownLoadProgress(uint64_t currentSize, uint64_t totalSize) override {
        if (download_progress_callback_) {
            download_progress_callback_(currentSize, totalSize);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    DownLoadProgressCallback download_progress_callback_;
};

class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_IMAGE) {
                // Image message
                auto imageElem = static_cast<V2TIMImageElem*>(elem);
                // The image in an image message can be in three formats: original, large, and thumbnail.
                // The latter two are automatically generated by the SDK during message sending and can be ignored.
                // Large image: A large image is an image obtained after the original image is proportionally compressed.
                // After the compression, the height or width (whichever is shorter) is equal to 720 pixels.
                // Thumbnail: A thumbnail is an image obtained after the original image is proportionally compressed.
                // After the compression, the height or width (whichever is shorter) is equal to 198 pixels.
                V2TIMImageVector imageList = imageElem->imageList;
                for (size_t i = 0; i < imageList.Size(); ++i) {
                    V2TIMImage& image = imageList[i];
                    // Image ID, which is an internal ID and can be used as an external cache key
                    V2TIMString uuid = image.uuid;
                    // Image type
                    V2TIMImageType type = image.type;
                    // Image size (bytes) when type == V2TIMImageType::V2TIM_IMAGE_TYPE_ORIGIN
                    uint64_t size = image.size;
                    // Image width
                    uint32_t width = image.width;
                    // Image height
                    uint32_t height = image.height;
                     // Image download url
                    V2TIMString url = image.url;
                    // Set the image download path `imagePath`.
                    // Here, `uuid` can be used as an identifier to avoid repeated download.
                    std::filesystem::path imagePath = u8"./File/Image/"s + uuid.CString();
                    // Determine whether there is a downloaded image file in `imagePath`
                    if (!std::filesystem::exists(imagePath)) {
                        std::filesystem::create_directories(imagePath.parent_path());
                        auto callback = new DownloadCallback{};
                        callback->SetCallback(
                            [=]() {
                                // Downloaded
                                delete callback;
                            },
                            [=](int error_code, const V2TIMString& error_message) {
                                // Download failed
                                delete callback;
                            },
                            [=](uint64_t currentSize, uint64_t totalSize) {
                                // Callback for download progress.
                                // `currentSize` indicates the downloaded file size,
                                // and `totalSize` indicates the total file size.
                            });
                        image.DownloadImage(imagePath.string().c_str(), callback);
                    } else {
                        // The image already exists.
                    }
                }
            }
        }
    }
    // Other members ...
};

// Note that `advancedMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener); // Image download url
                    V2TIMString url = image.url;
```

### Video message

After a video message is received, a video preview is displayed on the chat page, and the video is played back after the user clicks the message.
Two steps are required:
1. Download the video screenshot. We recommend you call the SDK's `downloadSnapshot` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMVideoElem.html#abee852d50627376a147a98a7375dea1a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMVideoElem.html#v2timvideoelem.downloadsnapshot(path:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMVideoElem.html#a7ae717400d7a9df3f337f0759a6b3163) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMVideoElem.html#ab65190d32fab8778e4c34a405773de89)) for download.

2. Download the video. We recommend you call the SDK's `downloadVideo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMVideoElem.html#a0adbdd0bcaed5093176db51d284976ea) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMVideoElem.html#v2timvideoelem.downloadvideo(path:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMVideoElem.html#a6e83b77be6db2005e91b90d2e2ac2f6a) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMVideoElem.html#a40687ffdb34ea57dadc398ed8d1f63e9)) for download.

   To avoid repeated download and save resources, we recommend you set the `videoUUID` attribute value of the `V2TIMVideoElem` object to the video download path to identify the video.

   The following sample code demonstrates how to parse the video content from `V2TIMMessage`:

   

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_VIDEO) {
        // Video message
        V2TIMVideoElem v2TIMVideoElem = msg.getVideoElem();
        // Video screenshot ID, which is an internal ID and can be used as an external cache key
        String snapshotUUID = v2TIMVideoElem.getSnapshotUUID();
        // Video screenshot file size
        int snapshotSize = v2TIMVideoElem.getSnapshotSize();
        // Video screenshot width
        int snapshotWidth = v2TIMVideoElem.getSnapshotWidth();
        // Video screenshot height
        int snapshotHeight = v2TIMVideoElem.getSnapshotHeight();
        // Video ID, which is an internal ID and can be used as an external cache key
        String videoUUID = v2TIMVideoElem.getVideoUUID();
        // Video file size
        int videoSize = v2TIMVideoElem.getVideoSize();
        // Video duration
        int duration = v2TIMVideoElem.getDuration();
        // Set the video screenshot file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        String snapshotPath = "/sdcard/im/snapshot/" + "myUserID" + snapshotUUID;
        File snapshotFile = new File(snapshotPath);
        if (!snapshotFile.exists()) {
            v2TIMVideoElem.downloadSnapshot(snapshotPath, new V2TIMDownloadCallback() {
                @Override
                public void onProgress(V2TIMElem.V2ProgressInfo progressInfo) {
                    // Callback for download progress. `v2ProgressInfo.getCurrentSize()` indicates the downloaded file size, and `v2ProgressInfo.getTotalSize()` indicates the total file size.
                }
                @Override
                public void onError(int code, String desc) {
                    // Download failed
                }
                @Override
                public void onSuccess() {
                    // Downloaded
                }
            });
        } else {
            // The file already exists.
        }

        // Set the video file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        String videoPath = "/sdcard/im/video/" + "myUserID" + videoUUID;
        File videoFile = new File(videoPath);
        if (!videoFile.exists()) {
            v2TIMVideoElem.downloadVideo(videoPath, new V2TIMDownloadCallback() {
                @Override
                public void onProgress(V2TIMElem.V2ProgressInfo progressInfo) {
                // Callback for download progress. `v2ProgressInfo.getCurrentSize()` indicates the downloaded file size, and `v2ProgressInfo.getTotalSize()` indicates the total file size.
                }
                @Override
                public void onError(int code, String desc) {
                // Download failed
                }
                @Override
                public void onSuccess() {
                // Downloaded
                }
            });
        } else {
            // The file already exists.
        }
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_VIDEO {
        let videoElem = msg.videoElem
        
        // Video screenshot ID, which is an internal ID and can be used as an external cache key
        let snapshotUUID = videoElem?.snapshotUUID
        // Video screenshot file size
        let snapshotSize = videoElem?.snapshotSize

        let snapshotWidth = videoElem?.snapshotWidth

        let snapshotHeight = videoElem?.snapshotHeight
        // Video ID, which is an internal ID and can be used as an external cache key
        let videoUUID = videoElem?.videoUUID

        let videoSize = videoElem?.videoSize

        let duration = videoElem?.duration
        
        // Set the video screenshot file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        let snapshotPath = NSTemporaryDirectory().appending("testVideoSnapshot\(snapshotUUID)")
        
        if !FileManager.default.fileExists(atPath: snapshotPath) {
            // Download the video screenshot
            videoElem?.downloadSnapshot(path: snapshotPath, progress: { curSize, totalSize in

                print("progress：curSize：\(curSize), totalSize: \(totalSize)")
            }, succ: {
                print("succ")
            }, fail: { code, msg in

                print("failed code：\(code), msg: \(msg)")
            })
        } else {
            // The video Snapshot already exists.
        }
        
        print("video info：snapshotUUID: \(snapshotUUID), snapshotSize: \(snapshotSize), snapshotWidth: \(snapshotWidth), snapshotHeight: \(snapshotHeight), snapshotPath: \(snapshotPath)")

        // Set the video file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        let videoPath = NSTemporaryDirectory().appending("testVideo\(videoUUID)")
        
        if !FileManager.default.fileExists(atPath: videoPath) {
            // downloadVideo
            videoElem?.downloadVideo(path: videoPath, progress: { curSize, totalSize in

                print("downloadVideo progress curSize：\(curSize), totalSize: \(totalSize)")
            }, succ: {
                print("downloadVideo success")
            }, fail: { code, msg in
                print("code：\(code), msg: \(msg)")
            })
        } else {
            // The video already exists.
        }
        print("video info：videoUUID: \(videoUUID), videoSize: \(videoSize), duration: \(duration), videoPath: \(videoPath)")
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_VIDEO) {
        V2TIMVideoElem *videoElem = msg.videoElem;
        // Video screenshot ID, which is an internal ID and can be used as an external cache key
        NSString *snapshotUUID = videoElem.snapshotUUID;
        // Video screenshot file size
        int snapshotSize = videoElem.snapshotSize;
        // Video screenshot width
        int snapshotWidth = videoElem.snapshotWidth;
        // Video screenshot height
        int snapshotHeight = videoElem.snapshotHeight;
        // Video ID, which is an internal ID and can be used as an external cache key
        NSString *videoUUID = videoElem.videoUUID;
        // Video file size
        int videoSize = videoElem.videoSize;
        // Video duration
        int duration = videoElem.duration;
        // Set the video screenshot file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        NSString *snapshotPath = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat: @"testVideoSnapshot%@",snapshotUUID]];
        if (![[NSFileManager defaultManager] fileExistsAtPath:snapshotPath]) {
            // Download the video screenshot
            [videoElem downloadSnapshot:snapshotPath progress:^(NSInteger curSize, NSInteger totalSize) {
                // Download progress
                NSLog(@"%@", [NSString stringWithFormat:@"Video screenshot download progress: curSize: %lu,totalSize:%lu",curSize,totalSize]);
            } succ:^{
                // Downloaded successfully
                NSLog(@"Video screenshot downloaded");
            } fail:^(int code, NSString *msg) {
                // Download failed
                NSLog(@"%@", [NSString stringWithFormat:@"Failed to download the video screenshot: code: %d,msg:%@",code,msg]);
            }];
        } else {
            // The video screenshot already exists.
        }
        NSLog(@"Video screenshot information: snapshotUUID:%@, snapshotSize:%d, snapshotWidth:%d, snapshotWidth:%d, snapshotPath:%@", snapshotUUID, snapshotSize, snapshotWidth, snapshotHeight, snapshotPath);

        // Set the video file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        NSString *videoPath = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat: @"testVideo%@",videoUUID]];
        if (![[NSFileManager defaultManager] fileExistsAtPath:videoPath]) {
            // Download the video
            [videoElem downloadVideo:videoPath progress:^(NSInteger curSize, NSInteger totalSize) {
                // Download progress
                NSLog(@"%@", [NSString stringWithFormat:@"Video download progress: curSize: %lu,totalSize:%lu",curSize,totalSize]);
            } succ:^{
                // Downloaded successfully
                NSLog(@"Video downloaded");
            } fail:^(int code, NSString *msg) {
                // Download failed
                NSLog(@"%@", [NSString stringWithFormat:@"Failed to download the video: code: %d,msg:%@",code,msg]);
            }];
        } else {
            // The video already exists.
        }
        NSLog(@"Video information: videoUUID:%@, videoSize:%d, duration:%d, videoPath:%@", videoUUID, videoSize, duration, videoPath);
    }
}
```

【C++】
``` cpp
class DownloadCallback final : public V2TIMDownloadCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using DownLoadProgressCallback = std::function<void(uint64_t, uint64_t)>;

    DownloadCallback() = default;
    ~DownloadCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     DownLoadProgressCallback download_progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        download_progress_callback_ = std::move(download_progress_callback);
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
    void OnDownLoadProgress(uint64_t currentSize, uint64_t totalSize) override {
        if (download_progress_callback_) {
            download_progress_callback_(currentSize, totalSize);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    DownLoadProgressCallback download_progress_callback_;
};

class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_VIDEO) {
                // Video message
                auto videoElem = static_cast<V2TIMVideoElem*>(elem);
                // Video ID, which is an internal ID and can be used as an external cache key
                V2TIMString videoUUID = videoElem->videoUUID;
                // Video file size
                uint64_t videoSize = videoElem->videoSize;
                // Video type
                V2TIMString videoType = videoElem->videoType;
                // Video duration
                uint32_t duration = videoElem->duration;
                // Video screenshot ID, which is an internal ID and can be used as an external cache key
                V2TIMString snapshotUUID = videoElem->snapshotUUID;
                // Video screenshot file size
                uint64_t snapshotSize = videoElem->snapshotSize;
                // Video screenshot width
                uint32_t snapshotWidth = videoElem->snapshotWidth;
                // Video screenshot height
                uint32_t snapshotHeight = videoElem->snapshotHeight;

                // Set the video file path. Here, `uuid` can be used as an identifier to avoid repeated download.
                std::filesystem::path videoPath = u8"./File/Video/"s + videoUUID.CString();
                if (!std::filesystem::exists(videoPath)) {
                    std::filesystem::create_directories(videoPath.parent_path());
                    auto callback = new DownloadCallback{};
                    callback->SetCallback(
                        [=]() {
                            // Downloaded
                            delete callback;
                        },
                        [=](int error_code, const V2TIMString& error_message) {
                            // Download failed
                            delete callback;
                        },
                        [=](uint64_t currentSize, uint64_t totalSize) {
                            // Callback for download progress.
                            // `currentSize` indicates the downloaded file size,
                            // and `totalSize` indicates the total file size.
                        });
                    videoElem->DownloadVideo(videoPath.string().c_str(), callback);
                } else {
                    // The file already exists.
                }

                // Set the video screenshot file path. Here, `uuid` can be used as an identifier to avoid repeated download.
                std::filesystem::path snapshotPath = u8"./File/Snapshot/"s + snapshotUUID.CString();
                if (!std::filesystem::exists(snapshotPath)) {
                    std::filesystem::create_directories(snapshotPath.parent_path());
                    auto callback = new DownloadCallback{};
                    callback->SetCallback(
                        [=]() {
                            // Downloaded
                            delete callback;
                        },
                        [=](int error_code, const V2TIMString& error_message) {
                            // Download failed
                            delete callback;
                        },
                        [=](uint64_t currentSize, uint64_t totalSize) {
                            // Callback for download progress.
                            // `currentSize` indicates the downloaded file size,
                            // and `totalSize` indicates the total file size.
                        });
                    videoElem->DownloadSnapshot(snapshotPath.string().c_str(), callback);
                } else {
                    // The file already exists.
                }
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

### Audio message

After the audio message is received, we recommend you call the SDK's `downloadSound` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSoundElem.html#a24cb6b4e90687833a6de8fa62e868b3a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSoundElem.html#v2timsoundelem.downloadsound(path:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMSoundElem.html#ac06d3cc1193da9e6b10d6256dc95f2b2) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMSoundElem.html#aa191924a398088cd690a1a9531fb22fe)) to download the audio and then play it back.

To avoid repeated download and save resources, we recommend you set the `uuid` attribute value of the `V2TIMSoundElem` object to the audio download path to identify the audio.

The following sample code demonstrates how to parse the audio content from `V2TIMMessage`:

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_SOUND) {
        // Audio message
        V2TIMSoundElem v2TIMSoundElem = msg.getSoundElem();
        // Audio ID, which is an internal ID and can be used as an external cache key
        String uuid = v2TIMSoundElem.getUUID();
        // Audio file size
        int dataSize = v2TIMSoundElem.getDataSize();
        // Audio duration
        int duration = v2TIMSoundElem.getDuration();
        // Set the audio file path `soundPath`. Here, `uuid` can be used as an identifier to avoid repeated download
        String soundPath = "/sdcard/im/sound/" + "myUserID" + uuid;
        File imageFile = new File(soundPath);
        // Determine whether there is a downloaded audio file in `soundPath`
        if (!imageFile.exists()) {
            v2TIMSoundElem.downloadSound(soundPath, new V2TIMDownloadCallback() {
                @Override
                public void onProgress(V2TIMElem.V2ProgressInfo progressInfo) {
                    // Callback for download progress. `v2ProgressInfo.getCurrentSize()` indicates the downloaded file size, and `v2ProgressInfo.getTotalSize()` indicates the total file size.
                }
                @Override
                public void onError(int code, String desc) {
                    // Download failed
                }
                @Override
                public void onSuccess() {
                    // Downloaded
                }
            });
        } else {
            // The file already exists.
        }
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_SOUND {
        guard let soundElem = msg.soundElem else { return }
        // Audio ID, which is an internal ID and can be used as an external cache key
        let uuid = soundElem.uuid
        // Audio file size
        let dataSize = soundElem.dataSize
        // Audio duration
        let duration = soundElem.duration
        // Set the audio file path `soundPath`. Here, `uuid` can be used as an identifier to avoid repeated download
        let soundPath = NSTemporaryDirectory().appending("testSound\(uuid)")
        
        // Determine whether there is a downloaded audio file in `soundPath`
        if !FileManager.default.fileExists(atPath: soundPath) {
            // downloadSound
            soundElem.downloadSound(path: soundPath, progress: { curSize, totalSize in
                // Download progress
                print("Download progress：curSize：\(curSize), totalSize: \(totalSize)")
            }, succ: {
                print("Download success")
            }, fail: { code, msg in
                print("error code：\(code), msg: \(msg)")
            })
        } else {
            // The audio already exists.
            print("The audio already exists：\(soundPath)")
        }
        
        print("audio info：uuid: \(uuid), dataSize: \(dataSize), duration: \(duration), soundPath: \(soundPath)")
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_SOUND) {
        V2TIMSoundElem *soundElem = msg.soundElem;
        // Audio ID, which is an internal ID and can be used as an external cache key
        NSString *uuid = soundElem.uuid;
        // Audio file size
        int dataSize = soundElem.dataSize;
        // Audio duration
        int duration = soundElem.duration;
        // Set the audio file path `soundPath`. Here, `uuid` can be used as an identifier to avoid repeated download
        NSString *soundPath = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat: @"testSound%@",uuid]];
        // Determine whether there is a downloaded audio file in `soundPath`
        if (![[NSFileManager defaultManager] fileExistsAtPath:soundPath]) {
            // Download the audio
            [soundElem downloadSound:soundPath progress:^(NSInteger curSize, NSInteger totalSize) {
                // Download progress
                NSLog(@"Audio download progress: curSize: %lu,totalSize:%lu",curSize,totalSize);
            } succ:^{
                // Downloaded successfully
                NSLog(@"Audio downloaded");
            } fail:^(int code, NSString *msg) {
                // Download failed
                NSLog(@"Failed to download the audio: code: %d,msg:%@",code,msg);
            }];
        } else {
            // The audio already exists.
        }
        NSLog(@"Audio information: uuid:%@, dataSize:%d, duration:%d, soundPath:%@", uuid, dataSize, duration, soundPath);
    }
}
```

【C++】
``` cpp
class DownloadCallback final : public V2TIMDownloadCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using DownLoadProgressCallback = std::function<void(uint64_t, uint64_t)>;

    DownloadCallback() = default;
    ~DownloadCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     DownLoadProgressCallback download_progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        download_progress_callback_ = std::move(download_progress_callback);
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
    void OnDownLoadProgress(uint64_t currentSize, uint64_t totalSize) override {
        if (download_progress_callback_) {
            download_progress_callback_(currentSize, totalSize);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    DownLoadProgressCallback download_progress_callback_;
};

class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_SOUND) {
                // Audio message
                auto soundElem = static_cast<V2TIMSoundElem*>(elem);
                // Audio ID, which is an internal ID and can be used as an external cache key
                V2TIMString uuid = soundElem->uuid;
                // Audio file size
                uint64_t dataSize = soundElem->dataSize;
                // Audio duration（seconds）
                uint32_t duration = soundElem->duration;
                // Set the audio file path `soundPath`. Here, `uuid` can be used as an identifier to avoid repeated download
                std::filesystem::path soundPath = u8"./File/Sound/"s + uuid.CString();
                // Determine whether there is a downloaded audio file in `soundPath`
                if (!std::filesystem::exists(soundPath)) {
                    std::filesystem::create_directories(soundPath.parent_path());
                    auto callback = new DownloadCallback{};
                    callback->SetCallback(
                        [=]() {
                            // Downloaded
                            delete callback;
                        },
                        [=](int error_code, const V2TIMString& error_message) {
                            // Download failed
                            delete callback;
                        },
                        [=](uint64_t currentSize, uint64_t totalSize) {
                            // Callback for download progress.
                            // `currentSize` indicates the downloaded file size,
                            // and `totalSize` indicates the total file size.
                        });
                    soundElem->DownloadSound(soundPath.string().c_str(), callback);
                } else {
                    // The file already exists.
                }
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

### File message

After the file message is received, we recommend you call the SDK's `downloadFile` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFileElem.html#a932e3acc34504d83f0e1e94799057d5a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFileElem.html#v2timfileelem.downloadfile(path:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMFileElem.html#a6ecb2ec506745c2fce99f78bab616009) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMFileElem.html#aafe1939485f0c1793a5cdfbd85efdf2a)) to download the file and then display it.

To avoid repeated download and save resources, we recommend you set the `uuid` attribute value of the `V2TIMFileElem` object to the file download path to identify the file.

The following sample code demonstrates how to parse the file content from `V2TIMMessage`:

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_FILE) {
        // File message
        V2TIMFileElem v2TIMFileElem = msg.getFileElem();
        // File ID, which is an internal ID and can be used as an external cache key
        String uuid = v2TIMFileElem.getUUID();
        // Filename
        String fileName = v2TIMFileElem.getFileName();
        // File size
        int fileSize = v2TIMFileElem.getFileSize();
        // Set the file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        String filePath = "/sdcard/im/file/" + "myUserID" + uuid;
        File file = new File(filePath);
        if (!file.exists()) {
            v2TIMFileElem.downloadFile(filePath, new V2TIMDownloadCallback() {
                @Override
                public void onProgress(V2TIMElem.V2ProgressInfo progressInfo) {
                    // Callback for download progress. `v2ProgressInfo.getCurrentSize()` indicates the downloaded file size, and `v2ProgressInfo.getTotalSize()` indicates the total file size.
                }
                @Override
                public void onError(int code, String desc) {
                    // Download failed
                }
                @Override
                public void onSuccess() {
                    // Downloaded
                }
            });
        } else {
            // The file already exists.
        }
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_FILE {
        guard let fileElem = msg.fileElem else { return }
        // File ID, which is an internal ID and can be used as an external cache key
        let uuid = fileElem.uuid

        let filename = fileElem.filename

        let fileSize = fileElem.fileSize
        // Set the file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        let filePath = NSTemporaryDirectory().appending("testFile\(uuid)")
        
        if !FileManager.default.fileExists(atPath: filePath) {
            // downloadFile
            fileElem.downloadFile(path: filePath, progress: { curSize, totalSize in
                print("downloadFile progress：curSize：\(curSize), totalSize: \(totalSize)")
            }, succ: {

                print("downloadFile success")
            }, fail: { code, msg in
                print("error code：\(code), msg: \(msg)")
            })
        } else {
            print("file exist \(filePath)")
        }
        
        print("file info：uuid: \(uuid), filename: \(filename), fileSize: \(fileSize), filePath: \(filePath)")
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_FILE) {
        V2TIMFileElem *fileElem = msg.fileElem;
        // File ID, which is an internal ID and can be used as an external cache key
        NSString *uuid = fileElem.uuid;
        // Filename
        NSString *filename = fileElem.filename;
        // File size
        int fileSize = fileElem.fileSize;
        // Set the file path. Here, `uuid` can be used as an identifier to avoid repeated download.
        NSString *filePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat: @"testFile%@",uuid]];
        if (![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
            // Download the file
            [fileElem downloadFile:filePath progress:^(NSInteger curSize, NSInteger totalSize) {
                // Download progress
                NSLog(@"%@", [NSString stringWithFormat:@"File download progress: curSize: %lu,totalSize:%lu",curSize,totalSize]);
            } succ:^{
                // Downloaded successfully
                NSLog(@"File downloaded");
            } fail:^(int code, NSString *msg) {
                // Download failed
                NSLog(@"%@", [NSString stringWithFormat:@"Failed to download the file: code: %d,msg:%@",code,msg]);
            }];
        } else {
            // The file already exists.
        }
        NSLog(@"File information: uuid:%@, filename:%@, fileSize:%d, filePath:%@", uuid, filename, fileSize, filePath);
    }
}
```

【C++】
``` cpp
class DownloadCallback final : public V2TIMDownloadCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using DownLoadProgressCallback = std::function<void(uint64_t, uint64_t)>;

    DownloadCallback() = default;
    ~DownloadCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     DownLoadProgressCallback download_progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        download_progress_callback_ = std::move(download_progress_callback);
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
    void OnDownLoadProgress(uint64_t currentSize, uint64_t totalSize) override {
        if (download_progress_callback_) {
            download_progress_callback_(currentSize, totalSize);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    DownLoadProgressCallback download_progress_callback_;
};

class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_FILE) {
                // File message
                auto fileElem = static_cast<V2TIMFileElem*>(elem);
                // File ID, which is an internal ID and can be used as an external cache key
                V2TIMString uuid = fileElem->uuid;
                // Filename
                V2TIMString filename = fileElem->filename;
                // File size
                uint64_t fileSize = fileElem->fileSize;
                // Set the file path. Here, `uuid` can be used as an identifier to avoid repeated download.
                std::filesystem::path filePath = u8"./File/File/"s + uuid.CString();
                if (!std::filesystem::exists(filePath)) {
                    std::filesystem::create_directories(filePath.parent_path());
                    auto callback = new DownloadCallback{};
                    callback->SetCallback(
                        [=]() {
                            // Downloaded
                            delete callback;
                        },
                        [=](int error_code, const V2TIMString& error_message) {
                            // Download failed
                            delete callback;
                        },
                        [=](uint64_t currentSize, uint64_t totalSize) {
                            // Callback for download progress.
                            // `currentSize` indicates the downloaded file size,
                            // and `totalSize` indicates the total file size.
                        });
                    fileElem->DownloadFile(filePath.string().c_str(), callback);
                } else {
                    // The file already exists.
                }
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

### Location message

After receiving the location message, the receiver can parse the latitude and longitude information directly from `V2TIMLocationElem`.
The following sample code demonstrates how to parse the location content from `V2TIMMessage`:

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_LOCATION) {
        // Geographical location message
        V2TIMLocationElem v2TIMLocationElem = msg.getLocationElem();
        // Geographical location information description
        String desc = v2TIMLocationElem.getDesc();
        // Longitude
        double longitude = v2TIMLocationElem.getLongitude();
        // Latitude
        double latitude = v2TIMLocationElem.getLatitude();
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    if msg.elemType == .V2TIM_ELEM_TYPE_LOCATION {
        let locationElem = msg.locationElem
        // Geographical location information description
        let desc = locationElem?.desc
        // Longitude
        let longitude = locationElem?.longitude
        // Latitude
        let latitude = locationElem?.latitude
        print("location info：desc：\(desc), longitude:\(longitude), latitude:\(latitude)")
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_LOCATION) {
        V2TIMLocationElem *locationElem = msg.locationElem;
        // Geographical location information description
        NSString *desc = locationElem.desc;
        // Longitude
        double longitude = locationElem.longitude;
        // Latitude
        double latitude = locationElem.latitude;
        NSLog(@"Geographical location information: desc: %@, longitude:%f, latitude:%f", desc, longitude, latitude);
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_LOCATION) {
                // Geographical location message
                auto locationElem = static_cast<V2TIMLocationElem*>(elem);
                // Geographical location information description
                V2TIMString desc = locationElem->desc;
                // Longitude
                double longitude = locationElem->longitude;
                // Latitude
                double latitude = locationElem->latitude;
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

### Emoji message

The SDK provides a passthrough channel only for emoji messages. For message content fields, see the definition of `V2TIMFaceElem` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFaceElem.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFaceElem.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMFaceElem.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMFaceElem.html)). Here, `index` and `data` can be customized.

For example, the sender can set `index` to `1` and `data` to `x12345` to indicate the smile emoji.
The receiver parses the received emoji message as `1` and `x12345` and displays the message as the smile emoji according to the preset rules.

The following sample code demonstrates how to parse the emoji content from `V2TIMMessage`:

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.getElemType() == V2TIMMessage.V2TIM_ELEM_TYPE_FACE) {
        // Emoji message
        V2TIMFaceElem v2TIMFaceElem = msg.getFaceElem();
        // Emoji location
        int index = v2TIMFaceElem.getIndex();
        // Custom emoji data
        byte[] data = v2TIMFaceElem.getData();
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    guard msg.elemType == .V2TIM_ELEM_TYPE_FACE, let faceElem = msg.faceElem else {
        return
    }
    // Emoji location
    let index = faceElem.index
    // Custom emoji data
    guard let data = faceElem.data else {
        print("Emoji empty")
        return
    }
    
    print("Emoji information index: \(index), data: \(data)")
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.elemType == V2TIM_ELEM_TYPE_FACE) {
        V2TIMFaceElem *faceElem = msg.faceElem;
        // Emoji location
        int index = faceElem.index;
        // Custom emoji data
        NSData *data = faceElem.data;
        NSLog(@"Emoji information: index: %d, data: %@", index, data);
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.elemList.Size() == 1) {
            V2TIMElem* elem = message.elemList[0];
            if (elem->elemType == V2TIMElemType::V2TIM_ELEM_TYPE_FACE) {
                // Emoji message
                auto faceElem = static_cast<V2TIMFaceElem*>(elem);
                // Emoji location
                uint32_t index = faceElem->index;
                // Custom emoji data
                V2TIMBuffer data = faceElem->data;
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

## Receiving a Broadcast Message

You can only use the [Broadcast Message of Audio-Video Group](https://www.tencentcloud.com/document/product/1047/49440) to send broadcast messages to all AVChatRooms under the same AppID, and all online group members in the AVChatRooms can receive this message. The SDK cannot send broadcast messages, it can only receive messages from the REST API. The receiving of messages is still in the `onRecvNewMessage` notification mentioned earlier. After receiving a message, you can determine whether the message is a broadcast message based on the `isBroadcastMessage` property.

> **Note****：**
> 
> 1. To use this feature, you need to [purchase the Pro edition、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat).
> 2. This feature is available only in SDK enhanced edition v6.5.2803 or later.
> 3. Only AVChatRoom supports broadcast message, other types of group are temporarily not supported.

【Java】
``` java
public void onRecvNewMessage(V2TIMMessage msg) {
    if (msg.isBroadcastMessage) {
        // Received the broadcast message
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {    
    if msg.isBroadcastMessage {        
        // Received the broadcast message
     }
 }
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    if (msg.isBroadcastMessage) {
        // Received the broadcast message
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        if (message.isBroadcastMessage) {
            // Received the broadcast message
        }
    }
    // Other members ...
};

// Note that `advancedMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener);
```

## Receiving a Message Containing Multiple Elements
1. Parse the first element object through the Message object.

2. Get the next element object through the `nextElem` method of the first element object. If the next object exists, an element object instance is returned; otherwise, `nil` or `null` is returned.

   Sample code:

   

【Java】
``` java
@Override
public void onRecvNewMessage(V2TIMMessage msg) {
    // View the first element
    int elemType = msg.getElemType();
    if (elemType == V2TIMMessage.V2TIM_ELEM_TYPE_TEXT) {
        // Text message
        V2TIMTextElem v2TIMTextElem = msg.getTextElem();
        String text = v2TIMTextElem.getText();
        // Check whether `v2TIMTextElem` is followed by more elements
        V2TIMElem elem = v2TIMTextElem.getNextElem();
        while (elem != null) {
            // Identify the element type. Here, `V2TIMCustomElem` is used as an example.
            if (elem instanceof V2TIMCustomElem) {
            V2TIMCustomElem customElem = (V2TIMCustomElem) elem;
            byte[] data = customElem.getData();
        }
        // Further check whether the current element is followed by more elements
        elem = elem.getNextElem();
        }
        // If the element is `null`, all the elements have been parsed.
    }
}
```

【Swift】
``` swift
func onRecvNewMessage(_ msg: V2TIMMessage) {
    // View the first element
    if msg.elemType == .V2TIM_ELEM_TYPE_TEXT {
        let textElem = msg.textElem
        let text = textElem?.text
        print("text : \(text)")
        var elem: V2TIMElem? = textElem?.getNextElem()
        while elem != nil {
            // Identify the element type
            if let customElem = elem as? V2TIMCustomElem {
                let customData = customElem.data
                print("Custom information : \(customData)")
            }
            // Further check whether the current element is followed by more elements
            elem = elem?.getNextElem()
        }
        // If the element is `nil`, all the elements have been parsed.
    }
}
```

【Objective-C】
``` objectivec
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    // View the first element
    if (msg.elemType == V2TIM_ELEM_TYPE_TEXT) {
        V2TIMTextElem *textElem = msg.textElem;
        NSString *text = textElem.text;
        NSLog(@"Text information: %@", text);
        // Check whether `textElem` is followed by more elements
        V2TIMElem *elem = textElem.nextElem;
        while (elem != nil) {
            // Identify the element type
            if ([elem isKindOfClass:[V2TIMCustomElem class]]) {
                V2TIMCustomElem *customElem = (V2TIMCustomElem *)elem;
                NSData *customData = customElem.data;
                NSLog(@"Custom information: %@",customData);
            }
            // Further check whether the current element is followed by more elements
            elem = elem.nextElem;
        }
        // If the element is `nil`, all the elements have been parsed.
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvNewMessage(const V2TIMMessage& message) override {
        // View the first element
        for (size_t i = 0; i < message.elemList.Size(); ++i) {
            V2TIMElem* elem = message.elemList[i];
            switch (elem->elemType) {
                case V2TIMElemType::V2TIM_ELEM_TYPE_NONE: {
                    // Unknown message
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_TEXT: {
                    // Text message
                    auto textElem = static_cast<V2TIMTextElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_CUSTOM: {
                    // Custom message
                    auto customElem = static_cast<V2TIMCustomElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_IMAGE: {
                    // Image message
                    auto imageElem = static_cast<V2TIMImageElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_SOUND: {
                    // Audio message
                    auto soundElem = static_cast<V2TIMSoundElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_VIDEO: {
                    // Video message
                    auto videoElem = static_cast<V2TIMVideoElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_FILE: {
                    // File message
                    auto fileElem = static_cast<V2TIMFileElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_LOCATION: {
                    // Geographical location message
                    auto locationElem = static_cast<V2TIMLocationElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_FACE: {
                    // Emoji message
                    auto faceElem = static_cast<V2TIMFaceElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_GROUP_TIPS: {
                    // Group @ message
                    auto mergerElem = static_cast<V2TIMMergerElem*>(elem);
                } break;
                case V2TIMElemType::V2TIM_ELEM_TYPE_MERGER: {
                    // Merged message
                    auto groupTipsElem = static_cast<V2TIMGroupTipsElem*>(elem);
                } break;
                default: {
                } break;
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

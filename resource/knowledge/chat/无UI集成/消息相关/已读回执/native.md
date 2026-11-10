---
sync_node_id: '108053270811418624'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "已读回执"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

Read Receipt is used to notify the sender that "the recipient has read the sent message". When the recipient reads the message, a read message is reported, the backend system will generate a notification to inform the sender that the message has been viewed.

In instant messaging tools (WhatsApp, WeChat, etc.), when the recipient views the message, the sender will see a read receipt next to the message, such as a blue check mark or the word "read".

> **Note:**
> "Receipt" means "Reply Receipt", which represents a credential for confirming receipt. When you send a message and request a receipt, you are actually asking the other party "I want to confirm whether you have received and read my message". This confirmation is like a "receipt", proving that your message has been received.
> 

Read receipts help ensure important messages has been viewed but can also cause psychological stress and privacy issues. Therefore, we support users to turn off the read receipt feature.

> **Note：**
> - To use this feature, you need to [purchase the Pro edition、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat).
> - The group read receipts feature is limited to groups with a maximum of 200 members.
> - Read receipts for group messages are supported only by the Enhanced edition on v6.1.2155 or later.
> - Read receipts for one-to-one messages are supported only by the Enhanced edition on v6.2.2363 or later.

## Effect

You can use this feature to implement the unread and read message effects shown in the figure below:

## API Description

### Setting Read Receipts for Group Messages
- To enable read receipts for group messages, first configure the supported group type in the [Console](https://console.trtc.io/). Only the selected group types can use the read receipt feature. Configuration path: Applications > Your App > Chat > Configuration > Group Configuration > Group feature configuration > Read receipts for group messages.

- You don't need to configure read receipts to be sent for one-to-one messages in the console, as they are supported by default.

### Sending Message with Read Receipt (by the sender)

After creating a message, the sender specifies that the message requires a read receipt through the `needReadReceipt` field in `V2TIMMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessage.html#a53a9afe71275a00a54f1cb02f0e5eaaa) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMMessage.html#v2timmessage.needreadreceipt) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMMessage.html#a41267989ed78823270ff16faf2356bc9) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMMessage.html#a4e789e7041b469c2d49225b6e444badd)) and then sends the message to the conversation.

Sample code:

【Java】
``` java
V2TIMMessage message = V2TIMManager.getMessageManager().createTextMessage("Group message read receipt");
// Specify that the message requires a read receipt
message.setNeedReadReceipt(true);
// Send the message
V2TIMManager.getMessageManager().sendMessage(message, null, "groupA", V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
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
/// Sample API call
if let message = V2TIMManager.shared.createTextMessage(text: "Group message read receipt") {
    // Specify that the message requires a read receipt
    message.needReadReceipt = true
    // Send the message
    V2TIMManager.shared.sendMessage(message: message, receiver: nil, groupID: "groupA", priority: .V2TIM_PRIORITY_NORMAL, onlineUserOnly: false, offlinePushInfo: nil, progress: nil, succ: {
        print("success")
    }, fail: { code, msg in
        print("error code: \(code), msg: \(msg)")
    })
}
```

【Objective-C】
``` objectivec
/// Sample API call
V2TIMMessage *message = [[V2TIMManager sharedInstance] createTextMessage:@"Group message read receipt"];
// Specify that the message requires a read receipt
message.needReadReceipt = YES;
// Send the message
[[V2TIMManager sharedInstance] sendMessage:message receiver:nil groupID:@"groupA" priority:V2TIM_PRIORITY_NORMAL onlineUserOnly:NO offlinePushInfo:nil progress:nil succ:nil fail:nil];
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

V2TIMMessage message = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage(u8"Group message read receipt");
// Specify that the message requires a read receipt
message.setNeedReadReceipt(true);

auto callback = new SendCallback{};
callback->SetCallback([=](const V2TIMMessage& message) { delete callback; },
                      [=](int error_code, const V2TIMString& error_message) { delete callback; },
                      [=](uint32_t progress) {});

V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    message, "groupA", {}, V2TIMMessagePriority::V2TIM_PRIORITY_DEFAULT, false, {}, callback);
```

### Report Message Read (by the receiver)

After [receiving the message](https://www.tencentcloud.com/document/product/1047/47995), the receiver determines whether the message requires a read receipt based on the `needReadReceipt` field in `V2TIMMessage`. If yes, after the user reads the message, the receiver calls the `sendMessageReadReceipts` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a66ec09cb444ddca989e9518d5118275d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessagereadreceipts(messagelist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a375af7e0f3e0f0b3135ccd517de9fdd8) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#ae0a86a41d103c1722017d2f71b475cf2)) to send a message read receipt.

Sample code:

【Java】
``` java
// Suppose the user has read the `message` message
if (!message.isSelf() && message.isNeedReadReceipt()) {
  List<V2TIMMessage> messageList = new ArrayList<>();
  messageList.add(message);
  V2TIMManager.getMessageManager().sendMessageReadReceipts(messageList, new V2TIMCallback() {
    @Override
    public void onSuccess() {
      // Read receipt for the message sent successfully
    }

    @Override
    public void onError(int code, String desc) {
      // Failed to send a read receipt for the message
    }
  });
}
```

【Swift】
``` swift
/// Sample API call
/// Suppose the user has read the `msg` message
if !message.isSelf && message.needReadReceipt {
    V2TIMManager.shared.sendMessageReadReceipts(messageList: [message], succ: {
        // Read receipt for the message sent successfully
    }, fail: { code, desc in
        // Failed to send a read receipt for the message
    })
}
```

【Objective-C】
``` objectivec
/// Sample API call
/// Suppose the user has read the `msg` message
if (!msg.isSelf && msg.needReadReceipt) {
    [[V2TIMManager sharedInstance] sendMessageReadReceipts:@[msg] succ:^{
        // Read receipt for the message sent successfully
    } fail:^(int code, NSString *desc) {
        // Failed to send a read receipt for the message
    }];
}
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
        // Read receipt for the message sent successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to send a read receipt for the message
        delete callback;
    });

// Suppose the user has read the `message` message
if (!message.isSelf && message.needReadReceipt) {
    V2TIMMessageVector messageList;
    messageList.PushBack(message);
    V2TIMManager::GetInstance()->GetMessageManager()->SendMessageReadReceipts(messageList, callback);
}
```

### Listening for Read Receipt Notification (by the sender)

After the receiver sends a message read receipt, the sender will receive the read receipt notification in `onRecvMessageReadReceipts` of `V2TIMAdvancedMsgListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#a000a30bf4b1c26bd32ec9231f54ffd4d)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvmessagereadreceipts(receiptlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#ac62bcff71b2876760e179178a91b8321) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#a69ddafe374b2bf48fc2a763e7937b468)) and update the UI based on the notification to display the message as, for example, "Read by two members".

Sample code:

【Java】
``` java
V2TIMAdvancedMsgListener advancedMsgListener = new V2TIMAdvancedMsgListener() {
  @Override
  public void onRecvMessageReadReceipts(List<V2TIMMessageReceipt> receiptList) {
  for (V2TIMMessageReceipt receipt : receiptList) {
    // Message ID
    String msgID = receipt.getMsgID();
    // ID of the other party of the one-to-one message
    String userID = receipt.getUserID();
    // Read status of the other party of the one-to-one message
    boolean isPeerRead = receipt.isPeerRead();
    // Read timestamp of the other party of the one-to-one message
    long timestamp = receipt.getTimestamp();
    // Latest read count of the group message
    long readCount = receipt.getReadCount();
    // Latest unread count of the group message
    long unreadCount = receipt.getUnreadCount();
    }
  }
};
V2TIMManager.getMessageManager().addAdvancedMsgListener(advancedMsgListener);
```

【Swift】
``` swift

V2TIMManager.sharedInstance().addAdvancedMsgListener(self)

func onRecvMessageReadReceipts(_ receiptList: [V2TIMMessageReceipt]) {
    for receipt in receiptList {
        // Message ID
        let msgID = receipt.msgID
        // ID of the other party of the one-to-one message
        let userID = receipt.userID
        // Read status of the other party of the one-to-one message
        let isPeerRead = receipt.isPeerRead
        // Read timestamp of the other party of the one-to-one message
        let timestamp = receipt.timestamp
        // Group ID
        let groupID = receipt.groupID
        // Latest read count of the group message
        let readCount = receipt.readCount
        // Latest unread count of the group message
        let unreadCount = receipt.unreadCount
        
        print("Message ID: \(msgID), User ID: \(userID), Is Peer Read: \(isPeerRead), Timestamp: \(timestamp), Group ID: \(groupID), Read Count: \(readCount), Unread Count: \(unreadCount)")
    }
}
```

【Objective-C】
``` objectivec
/// Sample API call
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];
- (void)onRecvMessageReadReceipts:(NSArray<V2TIMMessageReceipt *> *)receiptList {
    for(V2TIMMessageReceipt *receipt in receiptList) {
        // Message ID
        NSString *msgID = receipt.msgID;
        // ID of the other party of the one-to-one message
        NSString * userID = receipt.userID;
        // Read status of the other party of the one-to-one message
        BOOL isPeerRead = receipt.isPeerRead;
        // Read timestamp of the other party of the one-to-one message
        time_t timestamp = receipt.timestamp;
        // Group ID
        NSString * groupID = receipt.groupID;
        // Latest read count of the group message
        uint64_t readCount = receipt.readCount;
        // Latest unread count of the group message
        uint64_t unreadCount = receipt.unreadCount;
    }
}
```

【C++】
``` cpp
class AdvancedMsgListener final : public V2TIMAdvancedMsgListener {
public:
    void OnRecvMessageReadReceipts(const V2TIMMessageReceiptVector& receiptList) override {
        for (size_t i = 0; i < receiptList.Size(); ++i) {
            const V2TIMMessageReceipt& receipt = receiptList[i];
            // Message ID
            V2TIMString msgID = receipt.msgID;
            // ID of the other party of the one-to-one message
            V2TIMString userID = receipt.userID;
            // Read status of the other party of the one-to-one message
            bool isPeerRead = receipt.isPeerRead;
            // Read timestamp of the other party of the one-to-one message
            int64_t timestamp = receipt.timestamp;
            // Group ID
            V2TIMString groupID = receipt.groupID;
            // Latest read count of the group message
            int32_t readCount = receipt.readCount;
            // Latest unread count of the group message
            int32_t unreadCount = receipt.unreadCount;
        }
    }
    // Other members ...
};

// Note that `advancedMsgListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
AdvancedMsgListener advancedMsgListener;
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(&advancedMsgListener);
```

### Pulling Read Receipt Detail (by the sender)

After entering the message list, the sender pulls historical messages first, and then calls the `getMessageReadReceipts` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a50e3bc679e196866057415a7c192abf6) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getmessagereadreceipts(messagelist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a69192bc43e551f34f5d483dae5e70410) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a73b488bb868db032a060de4282dd2547)) to pull the message read receipt information.

The `V2TIMMessageReceipt` field of the message read receipt is as described below:
| Attribute | Definition | Description |
| --- | --- | --- |
| msgID | Message ID | Unique message ID |
| userID | ID of the receiver | If the message is a one-to-one message, this field indicates the ID of the receiver. |
| isPeerRead | Whether the message is read by the receiver | If the message is a one-to-one message, this field indicates whether the message is read by the receiver. |
| timestamp | The peer read time | If msgID is empty, this parameter indicates the time when the peer user mark the conversation as read.<br>If msgID is not empty, this parameter indicates the time when the peer user send message read receipt (supported only in 8.1 and later versions). |
| groupID | Group ID | If the message is a group message, this field indicates the group ID. |
| readCount | Number of members who have read the group message | If the message is a group message, this field indicates the number of members who have read the message. |
| unreadCount | Number of members who have not read the group message | If the message is a group message, this field indicates the number of members who have not read the message. |

Sample code:

【Java】
``` java
/// Sample API call (taking a group message as an example)
V2TIMManager.getMessageManager().getGroupHistoryMessageList("groupA", 20, null, new V2TIMValueCallback<List<V2TIMMessage>>() {
  @Override
  public void onSuccess(final List<V2TIMMessage> v2TIMMessages) {
    List<V2TIMMessage> receiptMsgs = new ArrayList<>();
    // If the message sent by you requires a read receipt, the message read receipt information will need to be pulled.
    for (V2TIMMessage msg : v2TIMMessages) {
      if (msg.isSelf() && msg.isNeedReadReceipt()) {
        receiptMsgs.add(msg);
      }
    }
    V2TIMManager.getMessageManager().getMessageReadReceipts(receiptMsgs, new V2TIMValueCallback<List<V2TIMMessageReceipt>>() {
      @Override
      public void onSuccess(List<V2TIMMessageReceipt> v2TIMMessageReceipts) {
        Map<String, V2TIMMessageReceipt> messageReceiptMap = new HashMap<>();
        for (V2TIMMessageReceipt receipt : v2TIMMessageReceipts) {
          messageReceiptMap.put(receipt.getMsgID(), receipt);
        }
        for (V2TIMMessage msg : v2TIMMessages) {
          V2TIMMessageReceipt receipt = messageReceiptMap.get(msg.getMsgID());
          if (receipt != null) {
            // ID of the other party of the one-to-one message
            String userID = receipt.getUserID();
            // Read status of the other party of the one-to-one message
            boolean isPeerRead = receipt.isPeerRead();
            // Read timestamp of the other party of the one-to-one message
            long timestamp = receipt.getTimestamp();
            // Group ID
            String groupID = receipt.getGroupID();
            // Message read count. If `readCount` is `0`, no one has read the message.
            long readCount = receipt.getReadCount();
            // Message unread count. If `unreadCount` is `0`, all members have read the message.
            long unreadCount = receipt.getUnreadCount();
          }
        }
      }

      @Override
      public void onError(int code, String desc) {
        // Failed to pull the message read status
      }
    });
  }

  @Override
  public void onError(int code, String desc) {
    // Failed to pull the message
  }
});
```

【Swift】
``` swift
/// Sample API call (taking a group message as an example)
V2TIMManager.shared.getGroupHistoryMessageList(groupID: "groupA", count: 20, lastMsg: nil, succ: { msgs in
    var receiptMsgs: [V2TIMMessage] = []
    // If the message sent by you requires a read receipt, the message read receipt information will need to be pulled.
    for msg in msgs {
        if msg.isSelf && msg.needReadReceipt {
            receiptMsgs.append(msg)
        }
    }

    V2TIMManager.shared.getMessageReadReceipts(messageList: receiptMsgs, succ: { receiptList in
        var param: [String: V2TIMMessageReceipt] = [:]
        for receipt in receiptList {
            if let  msgID = receipt.msgID {
                param[msgID] = receipt
            }
        }   
        for msg in msgs {
            if let receipt = param[msg.msgID] {
                // ID of the other party of the one-to-one message
                let userID = receipt.userID
                // Read status of the other party of the one-to-one message
                let isPeerRead = receipt.isPeerRead
                // Read timestamp of the other party of the one-to-one message
                let timestamp = receipt.timestamp
                // groupID
                let groupID = receipt.groupID
                // Message read count. If `readCount` is `0`, no one has read the message.
                let readCount = receipt.readCount
                // Message unread count. If `unreadCount` is `0`, all members have read the message.
                let unreadCount = receipt.unreadCount
                

                print("Message ID: \(msg.msgID), User ID: \(userID), Is Peer Read: \(isPeerRead), Timestamp: \(timestamp), Group ID: \(groupID), Read Count: \(readCount), Unread Count: \(unreadCount)")
            }
        }
    }, fail: { code, desc in
       // Failed to pull the message read status
        print("error code: \(code), desc: \(desc)")
    })
}, fail: { code, desc in
       // Failed to pull the message
        print("error code: \(code), desc: \(desc)")
})
```

【Objective-C】
``` objectivec
/// Sample API call (taking a group message as an example)
[[V2TIMManager sharedInstance] getGroupHistoryMessageList:@"groupA" count:20 lastMsg:nil succ:^(NSArray<V2TIMMessage *> *msgs) {
    NSMutableArray *receiptMsgs = [NSMutableArray array];
    // If the message sent by you requires a read receipt, the message read receipt information will need to be pulled.
    for (V2TIMMessage *msg in msgs) {
        if (msg.isSelf && msg.needReadReceipt) {
            [receiptMsgs addObject:msg];
        }
    }
    [[V2TIMManager sharedInstance] getMessageReadReceipts:receiptMsgs succ:^(NSArray<V2TIMMessageReceipt *> *receiptList) {
       NSMutableDictionary *param = [NSMutableDictionary dictionary];
       for (V2TIMMessageReceipt *receipt in receiptList) {
           [param setObject:receipt forKey:receipt.msgID];
       }
       for (V2TIMMessage *msg in msgs) {
           V2TIMMessageReceipt *receipt = param[msg.msgID];
           // ID of the other party of the one-to-one message
           NSString * userID = receipt.userID;
           // Read status of the other party of the one-to-one message
           BOOL isPeerRead = receipt.isPeerRead;
           // Read timestamp of the other party of the one-to-one message
           time_t timestamp = receipt.timestamp;
           // Group ID
           NSString * groupID = receipt.groupID;
           // Message read count. If `readCount` is `0`, no one has read the message.
           uint64_t readCount = receipt.readCount;
           // Message unread count. If `unreadCount` is `0`, all members have read the message.
           uint64_t unreadCount = receipt.unreadCount;
       }
    } fail:^(int code, NSString *desc) {
       // Failed to pull the message read status
    }];
} fail:^(int code, NSString *desc) {
    // Failed to pull the message
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

// Sample API call (taking a group message as an example)
V2TIMMessageListGetOption option;
option.getType = V2TIMMessageGetType::V2TIM_GET_CLOUD_OLDER_MSG;
option.count = 20;
option.groupID = "groupA";

auto callback = new ValueCallback<V2TIMMessageVector>{};
callback->SetCallback(
    [=](const V2TIMMessageVector& messageList) {
        V2TIMMessageVector receiptMsgs;
        for (size_t i = 0; i < messageList.Size(); ++i) {
            const V2TIMMessage& message = messageList[0];
            // If the message sent by you requires a read receipt,
            // the message read receipt information will need to be pulled.
            if (message.isSelf && message.needReadReceipt) {
                receiptMsgs.PushBack(message);
            }
        }

        auto receipt_callback = new ValueCallback<V2TIMMessageReceiptVector>{};
        receipt_callback->SetCallback(
            [=](const V2TIMMessageReceiptVector& receiptList) {
                std::unordered_map<V2TIMString, V2TIMMessageReceipt> map;
                for (size_t i = 0; i < receiptList.Size(); ++i) {
                    const V2TIMMessageReceipt& receipt = receiptList[i];
                    map[receipt.msgID] = receipt;
                }
                for (size_t i = 0; i < messageList.Size(); ++i) {
                    const V2TIMMessage& message = messageList[0];
                    if (map.count(message.msgID)) {
                        const V2TIMMessageReceipt& receipt = map[message.msgID];
                        // ID of the other party of the one-to-one message
                        V2TIMString userID = receipt.userID;
                        // Read status of the other party of the one-to-one message
                        bool isPeerRead = receipt.isPeerRead;
                        // Read timestamp of the other party of the one-to-one message
                        int64_t timestamp = receipt.timestamp;
                        // Group ID
                        V2TIMString groupID = receipt.groupID;
                        // Message read count. If `readCount` is `0`, no one has read the message.
                        int32_t readCount = receipt.readCount;
                        // Message unread count. If `unreadCount` is `0`, all members have read the message.
                        int32_t unreadCount = receipt.unreadCount;
                    }
                    const V2TIMMessageReceipt& receipt = receiptList[i];
                }

                delete receipt_callback;
            },
            [=](int error_code, const V2TIMString& error_message) {
                // Failed to pull the message read status
                delete receipt_callback;
            });

        V2TIMManager::GetInstance()->GetMessageManager()->GetMessageReadReceipts(messageList, receipt_callback);

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to pull the message
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->GetHistoryMessageList(option, callback);
```

### Pulling the Detail of Read Members (by the sender)

To view the list of members who have or have not read a group message, the sender can call the `getGroupMessageReadMemberList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a93c48782f3e127e8a50aef1bf8829099) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getgroupmessagereadmemberlist(message:filter:nextseq:count:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#aa345a87cfa4da2983f878bb5385d0b82) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a8b6ae2c30d173b6a5a4c99ebb3aecca9)) to pull the member list by page.

【Java】
``` java
/// Sample API call
V2TIMManager.getMessageManager().getGroupMessageReadMemberList(message, V2TIMMessage.V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ, 0, 100, new V2TIMValueCallback<V2TIMGroupMessageReadMemberList>() {
  @Override
  public void onSuccess(V2TIMGroupMessageReadMemberList v2TIMGroupMessageReadMemberList) {
    // `members` is the list of members who have read the message pulled from the current page.
    List<V2TIMGroupMemberInfo> members = v2TIMGroupMessageReadMemberList.getMemberInfoList();
    // `nextSeq` indicates the cursor position for the next pull.
    long nextSeq = v2TIMGroupMessageReadMemberList.getNextSeq();
    // `isFinished` indicates whether the list of members who have read the message has been fully pulled.
    boolean isFinished = v2TIMGroupMessageReadMemberList.isFinished();
    // If the list of members who have read the message is not fully pulled, continue with the next pull (here is only the sample code. We recommend paged pull be triggered by a user click).
    if (!isFinished) {
      V2TIMManager.getMessageManager().getGroupMessageReadMemberList(message, V2TIMMessage.V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ, nextSeq, 100, new V2TIMValueCallback<V2TIMGroupMessageReadMemberList>() {
        @Override
        public void onSuccess(V2TIMGroupMessageReadMemberList v2TIMGroupMessageReadMemberList) {
            // List of members who have read the message pulled successfully
        }

        @Override
        public void onError(int code, String desc) {
            // Failed to pull the list of members who have read the message
        }
      });
    }    
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to pull the list of members who have read the message
  }
});
```

【Swift】
``` swift
/// Sample API call
V2TIMManager.shared.getGroupMessageReadMemberList(message: message, filter: .V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ, nextSeq: 0, count: 100, succ: { members, nextSeq, isFinished in
   // `members` is the list of members who have read the message pulled from the current page.
    // `nextSeq` indicates the cursor position for the next pull.
    // `isFinished` indicates whether the list of members who have read the message has been fully pulled.
    // If the list of members who have read the message is not fully pulled, continue with the next pull (here is only the sample code. We recommend paged pull be triggered by a user click).
    if !isFinished {
        V2TIMManager.shared.getGroupMessageReadMemberList(message: message, filter: .V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ, nextSeq: UInt(nextSeq), count: 100, succ: { members, nextSeq, isFinished in
            // List of members who have read the message pulled successfully
        }, fail: { code, desc in
            // Failed to pull the list of members who have read the message
        })
    }
}, fail: { code, desc in
    // Failed to pull the list of members who have read the message
})
```

【Objective-C】
``` objectivec
/// Sample API call
[[V2TIMManager sharedInstance] getGroupMessageReadMemberList:message filter:V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ nextSeq:0 count:100 succ:^(NSMutableArray<V2TIMGroupMemberInfo *> *members, uint64_t nextSeq, BOOL isFinished) {
    // `members` is the list of members who have read the message pulled from the current page.
    // `nextSeq` indicates the cursor position for the next pull.
    // `isFinished` indicates whether the list of members who have read the message has been fully pulled.
    // If the list of members who have read the message is not fully pulled, continue with the next pull (here is only the sample code. We recommend paged pull be triggered by a user click).
    if (!isFinished) {
        [[V2TIMManager sharedInstance] getGroupMessageReadMemberList:message filter:V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ nextSeq:nextSeq count:100 succ:^(NSMutableArray<V2TIMGroupMemberInfo *> *members, uint64_t nextSeq, BOOL isFinished) {
            // List of members who have read the message pulled successfully
        } fail:^(int code, NSString *desc) {
            // Failed to pull the list of members who have read the message
        }];
    }
} fail:^(int code, NSString *desc) {
    // Failed to pull the list of members who have read the message
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

auto callback = new ValueCallback<V2TIMGroupMessageReadMemberList>{};
callback->SetCallback(
    [=](const V2TIMGroupMessageReadMemberList& groupMessageReadMemberList) {
        // `members` is the list of members who have read the message pulled from the current page.
        const V2TIMGroupMemberInfoVector& members = groupMessageReadMemberList.members;
        // `nextSeq` indicates the cursor position for the next pull.
        uint64_t nextSeq = groupMessageReadMemberList.nextSeq;
        // `isFinished` indicates whether the list of members who have read the message has been fully pulled.
        bool isFinished = groupMessageReadMemberList.isFinished;
        // If the list of members who have read the message is not fully pulled,
        // continue with the next pull (here is only the sample code.
        // We recommend paged pull be triggered by a user click).
        if (!isFinished) {
            auto callback = new ValueCallback<V2TIMGroupMessageReadMemberList>{};
            callback->SetCallback(
                [=](const V2TIMGroupMessageReadMemberList& groupMessageReadMemberList) {
                    // List of members who have read the message pulled successfully
                    delete callback;
                },
                [=](int error_code, const V2TIMString& error_message) {
                    // Failed to pull the list of members who have read the message
                    delete callback;
                });
            V2TIMManager::GetInstance()->GetMessageManager()->GetGroupMessageReadMemberList(
                message, V2TIMGroupMessageReadMembersFilter::V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ,
                nextSeq, 100, callback);
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to pull the list of members who have read the message
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->GetGroupMessageReadMemberList(
    message, V2TIMGroupMessageReadMembersFilter::V2TIM_GROUP_MESSAGE_READ_MEMBERS_FILTER_READ, 0, 100,
    callback);
```

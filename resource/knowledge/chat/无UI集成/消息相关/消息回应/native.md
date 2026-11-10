---
sync_node_id: '119899958937821184'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息回应"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

The message response feature refers to interacting with a specific message, a typical scenario being emoji responses. Emoji responses are interactive responses using emoticons, and we can see the number of respondents and the list of respondents for each emoji.

> **Note：**
> - This feature is only available to Pro edition 、Pro Plus edition or Enterprise edition customers. You can use it after purchasing [the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat). 
> - This feature is supported only by the Enhanced SDK v7.4 or later

## Effect

You can achieve the following emoji response effects with this feature:

## API Description

You can implement emoji response capabilities based on SDK API:
- Call `addMessageReaction` interface to add an emoji to a message. After adding successfully, the current operating user will be stored under the emoji.

- Call `removeMessageReaction` interface to delete the added emoji. After deleting successfully, the current operating user will no longer be stored under the emoji.

- Call `getMessageReactions` interface to batch fetch the emoji list of multiple messages. Each emoji contains the total number of current users and the first N (default 10) user profiles.

- Call `getAllUserListOfMessageReaction` interface to paginate fetching the full list of user profiles using the message emoji.

- Listen to the `onRecvMessageReactionsChanged` callback to perceive the change of user profile of the emoji. The callback will carry the latest user profile of the emoji (including the total number of users and the first N user profiles).

 For specific usage instructions.

### Add message reaction

Calling the `addMessageReaction` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#af47c3e1fb1ac73f7e2ba7bf739c9452a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.addmessagereaction(message:reactionid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a425d818c392bef6c6daeddef8c9c0cc1) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3c961027e9f295e472219116a3c8f90e)) interface can add message reaction.

Add message reaction interface input parameter explanation is as follows:

|Input Parameter|Definition|Description|
|---------|---------|---------|
|message|Message object|The message must be in a Sent successfully status.|
|reactionID|Message reaction ID|In the emoticon response scenario, the reactionID is the emoticonID.|

> **Note**
> 1. A single message supports up to 10 reactions, and a single reaction supports up to 100 users.
> 2. If the total count of reactions in a single message exceeds the maximum limit, the interface will report ERR_SVR_MSG_REACTION_COUNT_LIMIT error.
> 3. If the total count of users in a single reaction exceeds the maximum limit, the interface will report ERR_SVR_MSG_REACTION_USER_COUNT_LIMIT error.
> 4. If the reaction already contains the current operating user, the interface will report ERR_SVR_MSG_REACTION_ALREADY_CONTAIN_USER error.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().addMessageReaction(message, "emoji", new V2TIMCallback() {
    @Override
    public void onSuccess() {
       // add message reaction succ
    }
    @Override
    public void onError(int code, String desc) {
       // add message reaction failed
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.addMessageReaction(message: msg, reactionID: "emoji1") {
    print("addMessageReaction succ")
} fail: { code, desc in
    print("addMessageReaction fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] addMessageReaction:message reactionID:@"emoji" succ:^{
    // add message reaction succ
} fail:^(int code, NSString *desc) {
    // add message reaction failed
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
    void OnError(int error_code, const V2TIMString &error_message) override {
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
        // add message reaction succ
        delete callback;
    },
    [=](int error_code, const V2TIMString &error_message) {
        // add message reaction failed
        delete callback;
    });
V2TIMManager::GetInstance()->GetMessageManager()->AddMessageReaction(message, "emoji", callback);
```

### Remove message reaction

Calling the `removeMessageReaction` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a8af85ef9a47c6d498c601dad1370de32) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.removemessagereaction(message:reactionid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a88d3bf59edf75dd06ef9067b08b7db00)/ [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4fa45bdf386beefc5544935eb6122649)) interface can remove message reaction.

Remove message reaction interface input parameter explanation is as follows:

|Input Parameter|Definition|Description|
|---------|---------|---------|
|message|Message object|The message must be in a Sent successfully status.|
|reactionID|Message reaction ID|In the emoticon response scenario, the reactionID is the emoticonID.|

> **Note**
> - If the reaction does not exist, the interface will report ERR_SVR_MSG_REACTION_NOT_EXISTS error.
> - If the reaction does not contain the current user, the interface will report ERR_SVR_MSG_REACTION_NOT_CONTAIN_USER error.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().removeMessageReaction(message, "emoji", new V2TIMCallback() {
    @Override
    public void onSuccess() {
       // remove message reaction succ
    }
    @Override
    public void onError(int code, String desc) {
       // remove message reaction failed
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.removeMessageReaction(message: msg, reactionID: "emoji1") {
    print("removeMessageReaction succ")
} fail: { code, desc in
    print("removeMessageReaction fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] removeMessageReaction:message reactionID:@"emoji" succ:^{
    // remove message reaction succ
} fail:^(int code, NSString *desc) {
    // remove message reaction failed
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
    void OnError(int error_code, const V2TIMString &error_message) override {
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
        // remove message reaction succ
        delete callback;
    },
    [=](int error_code, const V2TIMString &error_message) {
        // remove message reaction failed
        delete callback;
    });
V2TIMManager::GetInstance()->GetMessageManager()->RemoveMessageReaction(message, "emoji", callback);
```

### Get message reactions

Calling the `getMessageReactions` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#aa6d5f0421950c7354dd4f0de48814881) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getmessagereactions(messagelist:maxusercountperreaction:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#ab3d6d68379e25750ba1b0154d956e62c)/ [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4535e7faaba45905ec4b5d0a658935cb)) interface can get multiple message reactions.

Get message reactions interface input parameter explanation is as follows:

|Input Parameter|Definition|Description|
|---------|---------|---------|
|messageList|Message object list| Supports up to 20 messages at a time.|
|maxUserCountPerReaction|Each Reaction returns the maximum user profile quantity|The value range is 【0,10】. Every reaction only supports returning the first 10 user profile at most. If you need more user profile, you can call the `getAllUserListOfMessageReaction` interface to pull in pages.|

Get message reactions information result`V2TIMMessageReactionResult` object explanation is as follows:
| Input Parameter | Definition | Description |
| --- | --- | --- |
| resultCode | Result code | - 0：indicates success.<br>- Non-zero: indicates failure. |
| resultInfo | Result info | result info. |
| msgID | Unique ID of the message | Unique ID of the message. |
| reactionList | Message reaction list | Message reaction <code>V2TIMMessageReaction</code> object list. |

The detailed explanation of the `V2TIMMessageReaction` object is as follows:
| Input Parameter | Definition | Description |
| --- | --- | --- |
| reactionID | Message reaction id | In the emoticon response scenario, the reactionID is the emoticonID. |
| totalUserCount | Total user count | The total count of users which have added reaction with the same ID to a message. |
| partialUserList | Partial user list | The partial user list which have added reaction with the same ID to a message.<br>The count of users depends on the maxUserCountPerReaction value set when calling the <code>getMessageReactions</code> interface. |
| reactedByMyself | Whether I have used this reaction | This field returns true if I use the reaction. |

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().getMessageReactions(msgList, 5, 
    new V2TIMValueCallback<List<V2TIMMessageReactionResult>>() {
    @Override
    public void onSuccess(List<V2TIMMessageReactionResult> v2TIMMessageReactionResults) {
        // get message reactions succ
        for (V2TIMMessageReactionResult reactionResult : v2TIMMessageReactionResults) {
            int resultCode = reactionResult.getResultCode();
            String resultInfo = reactionResult.getResultInfo();
            List<V2TIMMessageReaction> reactionList = reactionResult.getReactionList();
            for (V2TIMMessageReaction reaction : reactionList) {
                String reactionID = reaction.getReactionID();
                int totalUserCount = reaction.getTotalUserCount();
                List<V2TIMUserInfo> partialUserList = reaction.getPartialUserList();
            }
        }
    }
    @Override
    public void onError(int code, String desc) {
        // get message reactions failed
    }
});
```

【Swift】
``` swift
if let msg = sendedMsgList.first {
    V2TIMManager.shared.getMessageReactions(messageList: [msg], maxUserCountPerReaction: 10) { resultList in
        for result in resultList {
            let resultCode = result.resultCode
            let reactionList = result.reactionList
            for reaction in reactionList {
                let reactionID = reaction.reactionID
                let totalUserCount = reaction.totalUserCount
                let partialUserList = reaction.partialUserList
                
                print("Reaction ID: \(reactionID), Total User Count: \(totalUserCount), Partial User List: \(partialUserList)")
            }
        }
    } fail: { code, desc in
        print("getMessageReactions fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getMessageReactions:msgList maxUserCountPerReaction:5 
    succ:^(NSArray<V2TIMMessageReactionResult *> *resultList) {
    // get message reactions succ
    for (V2TIMMessageReactionResult *result in resultList) {
        int32_t resultCode = result.resultCode;
        NSString *resultInfo = result.resultInfo;
        NSArray *reactionList = result.reactionList;
        for (V2TIMMessageReaction *reaction in reactionList) {
            NSString *reactionID = reaction.reactionID;
            uint32_t totalUserCount = reaction.totalUserCount;
            NSArray *partialUserList = reaction.partialUserList;
        }
    }
} fail:^(int code, NSString *desc) {
    // get message reactions failed
}];
```

【C++】
``` cpp
template <class T>
class ValueCallback final : public V2TIMValueCallback<T> {
public:
    using SuccessCallback = std::function<void(const T &)>;
    using ErrorCallback = std::function<void(int, const V2TIMString &)>;
    ValueCallback() = defalt;
    ~ValueCallback() override = default;
    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }
    void OnSuccess(const T &value) override {
        if (success_callback_) {
            success_callback_(value);
        }
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

auto *callback = new ValueCallback<V2TIMMessageReactionResultVector>{};
callback->SetCallback(
    [=](const V2TIMMessageReactionResultVector &messageReactionResultList) {
        // get message reactions succ
        delete callback;
    },
    [=](int error_code, const V2TIMString &error_message) {
        // get message reactions failed
        delete callback;
    });
V2TIMMessageVector message_list;
message_list.PushBack(message);
V2TIMManager::GetInstance()->GetMessageManager()->GetMessageReactions(message_list, 5, callback);
```

### Get user list of message reaction

Calling the `getAllUserListOfMessageReaction` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a6af80059a956df9948286dc3007d4c1f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getalluserlistofmessagereaction(message:reactionid:nextseq:count:succ:fail:)) /[ Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#af26823c8deb12d0b0c5dc885431da182) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3e08aab7b7c8468f7c7f1977e934f730)) interface can get all user list of message reaction.

Get all user list of message reaction interface input parameter explanation is as follows:

|Input Parameter|Definition|Description|
|---------|---------|---------|
|message|Message object|The message must be in a Sent successfully status.|
|reactionID|Message reaction ID|In the emoticon response scenario, the reactionID is the emoticonID.|
|nextSeq|The next pulling-by-page cursor|Pass 0 for the first time, and pass the nextSeq returned by succ for subsequent pagination.|
|count|The maximum count of users fetched per page|Up to 100.|

Sample code:

【Java】
``` java
int nextSeq = 0;
int count = 100;
V2TIMManager.getMessageManager().getAllUserListOfMessageReaction(message, "emoji", nextSeq, count, 
    new V2TIMValueCallback<V2TIMMessageReactionUserResult>() {
    @Override
    public void onSuccess(V2TIMMessageReactionUserResult v2TIMMessageReactionUserResult) {
        // get all user list of message reaction succ
        // nextSeq：next pull sequence
    }
    @Override
    public void onError(int code, String desc) {
        // get all user list of message reaction failed
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getAllUserListOfMessageReaction(message: msg, reactionID: "emoji1", nextSeq: 0, count: 20) { userList, nextSeq, isFinished in
    var userListDesc = "";
    userList.forEach { item in
        userListDesc += item.description
    }
    // nextSeq：next pull sequence
    print("\(userListDesc), \(nextSeq), \(isFinished)");
} fail: { code, desc in
    print("getMessageReactionUsers fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
uint32_t nextSeq = 0;
uint32_t count = 100;
[[V2TIMManager sharedInstance] getAllUserListOfMessageReaction:message reactionID:@"emoji" nextSeq:nextSeq count:count 
   succ:^(NSArray<V2TIMUserInfo *> *userList, uint32_t nextSeq, BOOL isFinished) {
    // get all user list of message reaction succ
    // nextSeq：next pull sequence
} fail:^(int code, NSString *desc) {
    // get all user list of message reaction failed
}];
```

【C++】
``` cpp
template <class T>
class ValueCallback final : public V2TIMValueCallback<T> {
public:
    using SuccessCallback = std::function<void(const T &)>;
    using ErrorCallback = std::function<void(int, const V2TIMString &)>;
    ValueCallback() = defalt;
    ~ValueCallback() override = default;
    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }
    void OnSuccess(const T &value) override {
        if (success_callback_) {
            success_callback_(value);
        }
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

auto *callback = new ValueCallback<V2TIMMessageReactionUserResult>{};
callback->SetCallback(
    [=](const V2TIMMessageReactionUserResult &messageReactionUserResult) {
        // get all user list of message reaction succ
        delete callback;
    },
    [=](int error_code, const V2TIMString &error_message) {
        // get all user list of message reaction failed
        delete callback;
    });
V2TIMManager::GetInstance()->GetMessageManager()->GetAllUserListOfMessageReaction(message, "emoji", 0, 100, callback);
```

### Message reaction changed notification

If you have added an advanced message event listener in advance by calling `addAdvancedMsgListener`, you will receive the `onRecvMessageReactionsChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html#ac586fecabcd833cb2d10a4b11600cf91) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvmessagereactionschanged(changelist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html#a28e76f71176d3413db0f4e525e2f3804) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html#abd17cfaf5262b2cda8fa6b74066e94cd)) callback when the message reaction information is updated. It should be noted that this callback is an incremental callback for message Reaction, and it will only carry the changed Reaction information. When the totalUserCount field value in the changed Reaction information is 0, it means that no users are using this Reaction, and you can remove the display of this Reaction on the UI.

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().addAdvancedMsgListener(new V2TIMAdvancedMsgListener() {
    @Override
    public void onRecvMessageReactionsChanged(List<V2TIMMessageReactionChangeInfo> changeInfos) {
       // receive message reactions changed notify
       String msgID = changeInfo.getMessageID();
       // changed reaction list
       List<V2TIMMessageReaction> reactionList = changeInfo.getReactionList();
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.addAdvancedMsgListener(listener: self)
func onRecvMessageReactionsChanged(changeList: Array<V2TIMMessageReactionChangeInfo>) {
     // receive message reactions changed notify
    for changeInfo in changeList {
        let msgID = changeInfo.msgID
        // changed reaction list
        let reactionList = changeInfo.reactionList
    }
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] addAdvancedMsgListener:self];
- (void)onRecvMessageReactionsChanged:(NSArray<V2TIMMessageReactionChangeInfo *> *)changeList {
     // receive message reactions changed notify
    for (V2TIMMessageReactionChangeInfo *changeInfo in changeList) {
        NSString *msgID = changeInfo.msgID;
        // changed reaction list
        NSArray *reactionList = changeInfo.reactionList;
    }
}
```

【C++】
``` cpp
V2TIMManager::GetInstance()->GetMessageManager()->AddAdvancedMsgListener(this);
void OnRecvMessageReactionsChanged(const V2TIMMessageReactionChangeInfoVector &changeInfos) override {
     // receive message reactions changed notify
     for (size_t i = 0; i < changeInfos.Size(); i++) {
         V2TIMMessageReactionChangeInfo reactionChangeInfo = changeInfos[i];
         V2TIMString msgID = reactionChangeInfo.msgID;
         // changed reaction list
         V2TIMMessageReactionVector reactionList = reactionChangeInfo.reactionList;
     }
 }
```

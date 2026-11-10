---
sync_node_id: '108053275613896704'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "消息免打扰"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

By setting the message receiving options for one-to-one, group chat, or all messages, you can implement a feature similar to WhatsApp where messages do not disturb.

> **Note:**
> - One-to-one and group chat message receiving options are only supported by the Enhanced SDK version 5.3.425 or later.
> - Global message receiving options are only supported by the Enhanced SDK version 7.4.4643 or later.

The SDK offers three types of message receiving options, defined in `V2TIMReceiveMessageOpt` as follows:

|Message Receiving Option|Supported Type|Description|
|---------|---------|---------|
|V2TIM_RECEIVE_MESSAGE|One-to-one Chat, Group Chat, All Messages|Receive messages normally when online, and receive offline push notifications when offline|
|V2TIM_NOT_RECEIVE_MESSAGE|One-to-one Chat, Group Chat|Do not receive messages whether online or offline|
|V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE|One-to-one Chat, Group Chat, All Messages|Receive messages normally when online, but do not receive offline push notifications when offline|
|V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE_EXCEPT_AT|Group Chat|Receive messages online, only receive `at` message pushes when offline|
|V2TIM_NOT_RECEIVE_MESSAGE_EXCEPT_AT|Topic|Only receive `at` messages when online or offline |

Setting different `V2TIMReceiveMessageOpt` options can implement different Do Not Disturb effects:
| Do Not Disturb Effect | Message Receiving Option | Description |
| --- | --- | --- |
| Do not receive any messages at all | V2TIM_NOT_RECEIVE_MESSAGE | No messages can be received, and the conversation list will not be updated. |
| Receive messages but without notifications | V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE | At this time, it is recommended to display a red dot on the conversation list (without showing the unread count):<br>1. When a new message is received and the conversation list needs to be updated, obtain the message unread count through the unreadCount in the V2TIMConversation of the conversation.<br>2. If the unread count is greater than zero, display a red dot instead of the unread number. |
| Receive messages but only alert for <code>at</code> messages | V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE_EXCEPT_AT | Within a specified time window, all messages for the logged-in account can be received online; there will be no push when offline. |
| Only receive <code>at</code> messages | V2TIM_NOT_RECEIVE_MESSAGE_EXCEPT_AT | Only receive <code>at</code> messages on a topic when online or offline |

> **Note:**
> In the above implementations, if it requires the `unreadCount` feature in `V2TIMConversation`, it applies only to work groups (Work), public groups (Public), and communities (Community), but not to audio-video groups (AVChatRoom) or meeting groups (Meeting). For more information on group types, see [Group System](https://intl.cloud.tencent.com/document/product/1047/33529).
> 

## Setting One-to-One Chat Option

Call `setC2CReceiveMessageOpt` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a6524143895cdee25fabd9aeeae73a3c5) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.setc2creceivemessageopt(useridlist:opt:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#ae628f19d856921d27081c3f40005e9d9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#adf166f08b68a5df8de19d152bcf868b3)) to set the message receiving option for a one-to-one chat.
You can use the `userIDList` parameter to specify up to 30 users at a time.

> **Note:**
>  This API can be called by a user up to 5 times every second.
> 

Sample code:

【Java】
``` java
// Set not to receive messages no matter whether the user is online or offline

List<String> userList = new ArrayList<>();
userList.add("user1");
userList.add("user2");

V2TIMManager.getMessageManager().setC2CReceiveMessageOpt(userList, V2TIMMessage.V2TIM_NOT_RECEIVE_MESSAGE, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
// Set not to receive messages no matter whether the user is online or offline
let array: [String] = ["user1", "user2"]
V2TIMManager.shared.setC2CReceiveMessageOpt(userIDList: array, opt: .V2TIM_NOT_RECEIVE_MESSAGE, succ: {
    print("success")
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})
```

【Objective-C】
``` objectivec
// Set not to receive messages no matter whether the user is online or offline

NSArray* array = [NSArray arrayWithObjects:@"user1", @"user2", nil]];
[[V2TIMManager sharedInstance] setC2CReceiveMessageOpt:array opt:V2TIM_NOT_RECEIVE_MESSAGE succ:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

V2TIMStringVector userIDList;
userIDList.PushBack("user1");
userIDList.PushBack("user2");
V2TIMReceiveMessageOpt opt = V2TIMReceiveMessageOpt::V2TIM_NOT_RECEIVE_MESSAGE;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Configured successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to configure
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SetC2CReceiveMessageOpt(userIDList, opt, callback);
```

## Getting One-to-One Chat Option

Call `getC2CReceiveMessageOpt` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a9693dd66432f931ac0a1f2168d899501) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getc2creceivemessageopt(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a1c743a6fe1d17a21dc80e584fd1de2d1) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a30a4979460e73c897b6130ba40356afa)) to get the message receiving option for a one-to-one chat.

Sample code:

【Java】
``` java
List<String> userList = new ArrayList<>();
userList.add("user1");
userList.add("user2");

V2TIMManager.getMessageManager().getC2CReceiveMessageOpt(userList, new V2TIMValueCallback<List<V2TIMReceiveMessageOptInfo>>() {
    @Override
    public void onSuccess(List<V2TIMReceiveMessageOptInfo> v2TIMReceiveMessageOptInfos) {
        for (int i = 0; i < v2TIMReceiveMessageOptInfos.size(); i++){
            V2TIMReceiveMessageOptInfo info = v2TIMReceiveMessageOptInfos.get(i);
            Log.i("imsdk", "userId: " + info.getUserID() ", receiveOpt: " + info.getC2CReceiveMessageOpt());
        }
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
let array: [String] = ["user1", "user2"]
V2TIMManager.shared.getC2CReceiveMessageOpt(userIDList: array, succ: { optList in
    for info in optList {
        print("userId: \(info.userID), receiveOpt: \(info.receiveOpt)")
    }
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})

```

【Objective-C】
``` objectivec
NSArray* array = [NSArray arrayWithObjects:@"user1", @"user2", nil]];
[[V2TIMManager sharedInstance] getC2CReceiveMessageOpt:array succ:^(NSArray<V2TIMReceiveMessageOptInfo *> *optList) {
    for (int i = 0; i < optList.count; i++) {
        V2TIMReceiveMessageOptInfo* info = optList[i];
        NSLog(@"userId: %@, receiveOpt: %@", info.userID, info.receiveOpt);
    }
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

V2TIMStringVector userIDList;
userIDList.PushBack("user1");
userIDList.PushBack("user2");

auto callback = new ValueCallback<V2TIMReceiveMessageOptInfoVector>{};
callback->SetCallback(
    [=](const V2TIMReceiveMessageOptInfoVector& receiveMessageOptInfoList) {
        for (size_t i = 0; i < receiveMessageOptInfoList.Size(); ++i) {
            const V2TIMReceiveMessageOptInfo& opt = receiveMessageOptInfoList[i];
            V2TIMString userID = opt.userID;
            V2TIMReceiveMessageOpt receiveOpt = opt.receiveOpt;
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->GetC2CReceiveMessageOpt(userIDList, callback);
```

## Setting Group Chat Option

Call `setGroupReceiveMessageOpt` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a2735427ac22485626aea278a9d465b3e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.setgroupreceivemessageopt(groupid:opt:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a379eeef926e41ec5d48287e7fb55b80a) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a866d06c28faf058f253f29be6f5b3fe2)) to set the message receiving option for a group chat.

Sample code:

【Java】
``` java
// Set not to receive messages no matter whether the user is online or offline

String groupID = "groupID";
V2TIMManager.getMessageManager().setGroupReceiveMessageOpt(groupID, V2TIMMessage.V2TIM_NOT_RECEIVE_MESSAGE, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
// Set not to receive messages no matter whether the user is online or offline
let groupID = "groupID"
V2TIMManager.shared.setGroupReceiveMessageOpt(groupID: groupID, opt: .V2TIM_NOT_RECEIVE_MESSAGE, succ: {
    print("success")
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})
```

【Objective-C】
``` objectivec
// Set not to receive messages no matter whether the user is online or offline

NSString *groupID = @"groupID";
[[V2TIMManager sharedInstance] setGroupReceiveMessageOpt:groupID opt:V2TIM_NOT_RECEIVE_MESSAGE succ:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

V2TIMString groupID = "groupID";
V2TIMReceiveMessageOpt opt = V2TIMReceiveMessageOpt::V2TIM_NOT_RECEIVE_MESSAGE;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Configured successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to configure
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SetGroupReceiveMessageOpt(groupID, opt, callback);
```

## Getting Group Chat Option

Call the `getGroupsInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ada614335043d548c11f121500e279154) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupsinfo(groupidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a9bca7e5318cfed44335566a783a6b568) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a8c98b92b45c3a2c4e57901e6c4cd3435)) to get the list of `V2TIMGroupInfo` objects in the group profile. Here, the `recvOpt` field of the object indicates the message receiving option for the group chat.

Sample code:

【Java】
``` java
List<String> groupIDList = new ArrayList<>();
groupIDList.add("groupID1");
groupIDList.add("groupID2");
V2TIMManager.getGroupManager().getGroupsInfo(groupIDList, new V2TIMValueCallback<List<V2TIMGroupInfoResult>>() {
    @Override
    public void onSuccess(List<V2TIMGroupInfoResult> v2TIMGroupProfileResults) {
        for (V2TIMGroupInfoResult result : v2TIMGroupProfileResults) {
            V2TIMGroupInfo info = result.getGroupInfo();
            Log.i("imsdk", "recvOpt: " + info.getRecvOpt());
        }
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
let array: [String] = ["groupID1", "groupID2"]
V2TIMManager.shared.getGroupsInfo(groupIDList: array, succ: { groupResultList in
    for result in groupResultList {
        let info = result.info
        print("recvOpt: \(info?.recvOpt)")
    }
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})
```

【Objective-C】
``` objectivec
NSArray* array = [NSArray arrayWithObjects:@"groupID1", @"groupID2", nil]];
[[V2TIMManager sharedInstance] getGroupsInfo:array succ:^(NSArray<V2TIMGroupInfoResult *> * groupResultList) {
    for (V2TIMGroupInfoResult *result in groupResultList){
        V2TIMGroupInfo *info = result.info;
        NSLog(@"recvOpt, %d", (int)info.recvOpt);
    }
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

V2TIMStringVector groupIDList;
groupIDList.PushBack("groupID1");
groupIDList.PushBack("groupID2");

auto callback = new ValueCallback<V2TIMGroupInfoResultVector>{};
callback->SetCallback(
    [=](const V2TIMGroupInfoResultVector& groupInfoResultList) {
        for (size_t i = 0; i < groupInfoResultList.Size(); ++i) {
            const V2TIMGroupInfo& info = groupInfoResultList[i].info;
            V2TIMReceiveMessageOpt recvOpt = info.recvOpt;
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetGroupsInfo(groupIDList, callback);
```

## Setting All Messages Option

Call the `setAllReceiveMessageOpt`([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a21424ee9df839376ad67d824f95ceb51) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.setallreceivemessageopt(opt:starthour:startminute:startsecond:duration:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a6495713ce966d3e6cc769616cdfdb846) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#aa158b82be5ef2fdc24118a28cb232aec)) to set the message receiving option for all message. Support is provided for setting daily repetition, as well as for specifying a specific time period for activation.

Sample code:

【Java】
``` java
// Set the logged-in account to receive messages normally online between 10 PM and 6 AM every day, without receiving push notifications when offline.

V2TIMManager.getMessageManager().setAllReceiveMessageOpt(V2TIMMessage.V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, 22, 0, 0, 8*60*60, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.d("imsdk", "setAllReceiveMessageOpt onSuccess");    
    }
    @Override
    public void onError(int code, String desc) {
        Log.d("imsdk", "setAllReceiveMessageOpt onError code = " + code + ", desc = " + desc);
}});

// Assuming that 10 PM UTC time tonight is 12345678
// set the logged-in account to receive messages normally online and not receive push notifications when offline for a continuous period of three days starting from 10 PM tonight (12345678 UTC time).
V2TIMManager.getMessageManager().setAllReceiveMessageOpt(V2TIMMessage.V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, 12345678, 3*24*60*60, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.d("imsdk", "setAllReceiveMessageOpt onSuccess");    
    }
    @Override
    public void onError(int code, String desc) {
        Log.d("imsdk", "setAllReceiveMessageOpt onError code = " + code + ", desc = " + desc);
}});
```

【Swift】
``` swift
// Set the logged-in account to receive messages normally online between 10 PM and 6 AM every day, without receiving push notifications when offline.
V2TIMManager.shared.setAllReceiveMessageOpt(opt: .V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, startHour: 22, startMinute: 0, startSecond: 0, duration: 8 * 60 * 60, succ: {
    print("success")
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})

// Assuming that 10 PM UTC time tonight is 12345678
// set the logged-in account to receive messages normally online and not receive push notifications when offline for a continuous period of three days starting from 10 PM tonight (12345678 UTC time).
let startTimeStamp: Int64 = 12345678 
V2TIMManager.shared.setAllReceiveMessageOpt(opt: .V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, startTimeStamp: Int(startTimeStamp), duration: 3 * 24 * 60 * 60, succ: {
    print("success")
}, fail: { code, desc in
    print("failure, code: \(code), desc: \(desc ?? "")")
})
```

【Objective-C】
``` objectivec
// Set the logged-in account to receive messages normally online between 10 PM and 6 AM every day, without receiving push notifications when offline.

[[V2TIMManager sharedInstance] setAllReceiveMessageOpt:V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE startHour:22 startMinute:0 startSecond:0 duration:8*60*60 succ:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
}];

// Assuming that 10 PM UTC time tonight is 12345678
// set the logged-in account to receive messages normally online and not receive push notifications when offline for a continuous period of three days starting from 10 PM tonight (12345678 UTC time).
[[V2TIMManager sharedInstance] setAllReceiveMessageOpt:V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE startTimeStamp:12345678 duration:3*24*60*60 succ:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

V2TIMReceiveMessageOpt opt = V2TIMReceiveMessageOpt::V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        delete callback;
    });

// Set the logged-in account to receive messages normally online between 10 PM and 6 AM every day, without receiving push notifications when offline.
V2TIMManager::GetInstance()->GetMessageManager()->SetAllReceiveMessageOpt(opt, 22, 0, 0, 8*60*60, callback);

// Assuming that 10 PM UTC time tonight is 12345678
// set the logged-in account to receive messages normally online and not receive push notifications when offline for a continuous period of three days starting from 10 PM tonight (12345678 UTC time).
V2TIMManager::GetInstance()->GetMessageManager()->SetAllReceiveMessageOpt(opt, 12345678, 3*24*60*60, callback);
```

## Getting All Messages Option

Call the `getAllReceiveMessageOpt` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a0a0f68cf02affa07963e13e388400f51) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getallreceivemessageopt(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#abca3b16a8f25149867108dad53d43ca0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#af9db931afa6ad68a077e2169cae1a1a9)) to get the message receiving option for all messages, which is V2TIMReceiveMessageOptInfo.

Sample code：

【Java】
``` java
V2TIMManager.getMessageManager().getAllReceiveMessageOpt(new V2TIMValueCallback<V2TIMReceiveMessageOptInfo>() {
    @Override
    public void onSuccess(V2TIMReceiveMessageOptInfo v2TIMReceiveMessageOptInfo) {
        String result = "startHour = " + v2TIMReceiveMessageOptInfo.getStartHour() +
                        ", startMinute = " + v2TIMReceiveMessageOptInfo.getStartMinute() +
                        ", startSecond = " + v2TIMReceiveMessageOptInfo.getStartSecond() +
                        ", startTimeStamp = " + v2TIMReceiveMessageOptInfo.getStartTimeStamp() +
                        ", duration = " + v2TIMReceiveMessageOptInfo.getDuration() +
                        ", opt = " + v2TIMReceiveMessageOptInfo.getAllReceiveMessageOpt();
        Log.d("imsdk", "getAllReceiveMessageOpt onSuccess = " + result);    
    }
    @Override
    public void onError(int code, String desc) {
        Log.d("imsdk", "getAllReceiveMessageOpt onError code = " + code + ", desc = " + desc);
}});
```

【Swift】
``` swift
V2TIMManager.shared.getAllReceiveMessageOpt { opt in
    print("getAllReceiveMessageOpt, \(opt.description)")
} fail: { code, desc in
    print("getAllReceiveMessageOpt fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance getAllReceiveMessageOpt:^(V2TIMReceiveMessageOptInfo *optInfo) {
    NSLog(@"optInfo %@", optInfo);
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
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

auto callback = new ValueCallback<V2TIMReceiveMessageOptInfo>{};
callback->SetCallback(
    [=](const V2TIMReceiveMessageOptInfo& receiveMessageOptInfo) {
    
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->GetAllReceiveMessageOpt(callback);
```

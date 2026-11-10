---
sync_node_id: '175905753664098304'
nav_path:
  - "无 UI 集成"
  - "公众号"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

An official channel can send broadcast messages to subscribed users and also engage in one-on-one chats with them.

When messages are exchanged, a one-on-one [conversation](https://trtc.io/document/48329) is generated, with the conversationID structured as c2c_officialAccountID.

For management features such as creating an official channel, refer to the [server APIs](https://www.tencentcloud.com/document/product/1047/60755). The IMSDK primarily provides functionalities such as subscribing to an official channel, unsubscribing from an official channel, and retrieving the list of official channels.

> **Note：**
> This feature is supported only by the Enhanced edition on v7.6.5011 or later.
> 

## Official channel Profile Class Introduction

|Attribute|Definition|Description|
|---------|---------|---------|
|officialAccountID|official channel ID|The ​official channel ID must be prefixed with @TOA#_, can be [customized](https://www.tencentcloud.com/document/product/1047/60813), and has a maximum length of ​48 bytes.|
|officialAccountName|official channel name|Maximum Length: 150 bytes (UTF-8 encoded, where 1 Chinese character occupies 3 bytes)|
|faceUrl|Profile photo of the official channel|Maximum Length: 500 bytes|
|organization|organization name|Maximum Length: 500 bytes (UTF-8 encoded, where 1 Chinese character occupies 3 bytes)|
|introduction|Introduction of the official channel|Maximum Length: 400 bytes (UTF-8 encoded, where 1 Chinese character occupies 3 bytes)|
|customData|custom data|Maximum Length: 3000 bytes|
|createTime|Creation time of the official channel|Unit: Seconds|
|subscriberCount|The number of subscribed users|The number of active subscribers to the official channel|
|subscribeTime|The time when the logged-in user subscribed|Unit: Seconds|

## Subscribe to an Official channel

To subscribe to an official channel, call the subscribeOfficialAccount method ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a561a3334dd1f4b75de9099d161ed7f5b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.subscribeofficialaccount(officialaccountid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a0209825847b854bafdd337aab3c43f02) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#acd9d723adfae0b7c5ce970d2bf76231f)) and pass the officialAccountID as the parameter.
1. Upon successful subscription, subscribers will receive the onOfficialAccountSubscribed callback notification  ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a868cfabd962da9d77b1661b9bf545dfa) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onofficialaccountsubscribed(officialaccountinfo:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a7ce6f5ffc00ebf19b09199e0633dac67) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#ac31dc7410a043fab22224c43e6aed6c0)) .

2. When the subscribed official channel's profile is modified via [server API](https://www.tencentcloud.com/document/product/1047/60757), subscribers will receive the onOfficialAccountInfoChanged callback notification ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#adec9ebfb6ba6aaf908e7f4b324eed68b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onofficialaccountinfochanged(officialaccountinfo:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#aa5993deb689cbd9cda330baae66320cb) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#ab4dd576cf61e4bf7df34d0b54ad8d564)) .

3. When the subscribed official channel is deleted via [server API](https://www.tencentcloud.com/document/product/1047/60756), subscribers will receive the onOfficialAccountDeleted callback notification ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a31bf690c96d8491733a5917bc955db87) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onofficialaccountdeleted(officialaccountid:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#aee2cef53651b0de3ff0b001e892825f7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a1a33ecde8cb869f320bca8e33e101229)).

   Sample code:

   

【Java】
``` java
V2TIMManager.getFriendshipManager().subscribeOfficialAccount("official_test", new V2TIMCallback() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String desc) {
        
    }
});

V2TIMManager.getFriendshipManager().addFriendListener(new V2TIMFriendshipListener() {
    @Override
    public void onOfficialAccountSubscribed(V2TIMOfficialAccountInfo officialAccountInfo) {
        
    }

    @Override
    public void onOfficialAccountDeleted(String officialAccountID) {
        
    }

    @Override
    public void onOfficialAccountInfoChanged(V2TIMOfficialAccountInfo officialAccountInfo) {
        
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.subscribeOfficialAccount(officialAccountID: "officialAccountID") {
    print("subscribeOfficialAccount succ")
} fail: { code, desc in
    print("subscribeOfficialAccount fail, \(code), \(desc)")
}
V2TIMManager.shared.addFriendListener(listener: self)

func onOfficialAccountSubscribed(officialAccountInfo: V2TIMOfficialAccountInfo) {
    print("officialAccountInfo:\(officialAccountInfo.description)");
}

func onOfficialAccountDeleted(officialAccountID: String) {
    print("officialAccountID:\(officialAccountID)");
}

func onOfficialAccountInfoChanged(officialAccountInfo: V2TIMOfficialAccountInfo) {
    print("officialAccountInfo:\(officialAccountInfo.description)");
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] subscribeOfficialAccount:@"official_test" succ:^ {
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"fail, code: %d, msg: %@", code, msg);
}];

[[V2TIMManager sharedInstance] addFriendListener:self];

- (void)onOfficialAccountSubscribed:(V2TIMOfficialAccountInfo *)officialAccountInfo {
    
}

- (void)onOfficialAccountDeleted:(NSString *)officialAccountID {
    
}

- (void)onOfficialAccountInfoChanged:(V2TIMOfficialAccountInfo *)officialAccountInfo {
    
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

auto callback = new Callback;
callback->SetCallback(
    [=]() {
      delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
      delete callback;
    });
V2TIMManager::GetInstance()->GetFriendshipManager()->SubscribeOfficialAccount(
    "official_test", callback);

class FriendshipListener final : public V2TIMFriendshipListener {
public:
    FriendshipListener() = default;
    ~FriendshipListener() override = default;
    
    void OnOfficialAccountSubscribed(const V2TIMOfficialAccountInfo &info) override {
        
    }
    
    void OnOfficialAccountDeleted(const V2TIMString &officialAccountID) override {
        
    }
    
    void OnOfficialAccountInfoChanged(const V2TIMOfficialAccountInfo &info) override {
        
    }
};

FriendshipListener friendshipListener;
V2TIMManager::GetInstance()->AddFriendshipListener(&friendshipListener);
```

## Unsubscribe from an Official channel

To unsubscribe from an official channel, call the unsubscribeOfficialAccount method  ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a561a3334dd1f4b75de9099d161ed7f5b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.unsubscribeofficialaccount(officialaccountid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a0209825847b854bafdd337aab3c43f02) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#acd9d723adfae0b7c5ce970d2bf76231f)) and pass the officialAccountID as the parameter.

After successful unsubscription, the user will receive an onOfficialAccountUnsubscribed callback notification([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a22bfc73472e69617e3f4e2a73c661a1c) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onofficialaccountunsubscribed(officialaccountid:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a3f9cca2af3fa8b97e7225ec215e06166) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a5f7e8448231d7518c1e6d74bf1d860e3)).

Sample code:

【Java】
``` java
V2TIMManager.getFriendshipManager().unsubscribeOfficialAccount("official_test", new V2TIMCallback() {
    @Override
    public void onSuccess() { 
        
    } 
 
    @Override
    public void onError(int code, String desc) {
        
    } 
});

V2TIMManager.getFriendshipManager().addFriendListener(new V2TIMFriendshipListener() {
    @Override
    public void onOfficialAccountUnsubscribed(String officialAccountID) {
        
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.unsubscribeOfficialAccount(officialAccountID: "officialAccountID") {
    print("unsubscribeOfficialAccount succ")
} fail: { code, desc in
    print("unsubscribeOfficialAccount fail, \(code), \(desc)")
}

V2TIMManager.shared.addFriendListener(listener: self)

func onOfficialAccountUnsubscribed(officialAccountID: String) {
    print("officialAccountID:\(officialAccountID)");
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] unsubscribeOfficialAccount:@"official_test" succ:^ {
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"fail, code: %d, msg: %@", code, msg);
}];

[[V2TIMManager sharedInstance] addFriendListener:self];

- (void)onOfficialAccountUnsubscribed:(V2TIMOfficialAccountInfo *)officialAccountInfo {
    
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

auto callback = new Callback;
callback->SetCallback(
    [=]() {
      delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
      delete callback;
    });
    
V2TIMManager::GetInstance()->GetFriendshipManager()->UnsubscribeOfficialAccount(
    "official_test", callback);

class FriendshipListener final : public V2TIMFriendshipListener {
public:
    FriendshipListener() = default;
    ~FriendshipListener() override = default;

    void OnOfficialAccountUnsubscribed(const V2TIMString &officialAccountID) override {
        
    }
};

FriendshipListener friendshipListener;
V2TIMManager::GetInstance()->AddFriendshipListener(&friendshipListener);        
```

## Get Official channel List

Call the getOfficialAccountsInfo interface ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a7493324aced496edd8ca7a9feac3055e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getofficialaccountsinfo(officialaccountidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#acdf22b26fe5b6d40b2d7d411a361f904) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae2e75fc190c4a2eb24e0bced5fe9e576))  to retrieve the official channel list.
- When the officialAccountIDList is empty, it returns the list of subscribed official channels.

- When specific official channel IDs are provided in officialAccountIDList, it returns information for those specified official channels.

   Sample code:

   

【Java】
``` java
List<String> officialAccountIDList = new ArrayList<>();
V2TIMManager.getFriendshipManager().getOfficialAccountsInfo(officialAccountIDList, new V2TIMValueCallback<List<V2TIMOfficialAccountInfoResult>>() {
    @Override
    public void onSuccess(List<V2TIMOfficialAccountInfoResult> v2TIMOfficialAccountInfoResults) {
        
    }

    @Override
    public void onError(int code, String desc) {
        
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getOfficialAccountsInfo(officialAccountIDList: ["officialAccountID"]) { officialAccountResultList in
    officialAccountResultList.forEach { item in
        print(item.description)
    }
    
} fail: { code, desc in
    print("getOfficialAccountsInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getOfficialAccountsInfo:nil succ:^(NSArray<V2TIMOfficialAccountInfoResult *> *resultList) {
    [self appendString:[NSString stringWithFormat:@"success：%@", resultList]];
} fail:^(int code, NSString *desc) {
    [self appendString:[NSString stringWithFormat:@"fail，code：%d msg：%@",code,desc]];
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

V2TIMStringVector officialAccountIDList;

auto callback = new ValueCallback<V2TIMTopicInfoResultVector>{};
callback->SetCallback(
    [=](const V2TIMOfficialAccountInfoResultVector& officialAccountInfoResultList) {
      delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
      delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->GetOfficialAccountsInfo(
    officialAccountIDList, callback);
```

## Official channel Messaging

official channels support two types of messages:
1. ​Broadcast messages - Sent to all subscribers.

2. ​One-to-one messages - Private conversations between the official channel and individual subscribers.

### Send Broadcast Messages

Use the [​server-side broadcast message API](https://www.tencentcloud.com/document/product/1047/60810) to send messages to all subscribers of an official channel.

### Exchange One-to-One Messages
- Subscriber → Official channel:

   Use the [IMSDK's](https://trtc.io/document/47994) sendMessage ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) /[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) with the official official channel's officialAccountID as the receiver.

- Official channel → Subscriber:

   Use the [​server-side one-to-one message API](https://www.tencentcloud.com/document/product/1047/34919), specifying:

   - From_Account: Official channel's officialAccountID

   - To_Account: Subscriber's userID

### Receive Messages

Both message types can be received via the IMSDK's ​[message listener](https://trtc.io/document/47995).

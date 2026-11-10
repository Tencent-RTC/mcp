---
sync_node_id: '108053283539034112'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "用户状态"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

The SDK on v6.3 or later provides the user status management feature. Each user has two statuses:
- General status. It is preset in the SDK and cannot be modified.

- Custom status. It can be customized and modified by users. For example, it can be set to "Listening to music" or "On the call".

   The general user status is available in the following 3 types:

- Online (ONLINE): The current user has logged in and can receive and send messages.

- Offline (OFFLINE): The user didn't call `logout` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a0398924fa1b62a8f5cc9b51673273b48) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.logout(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a20b495d7f7a231ea33507ca4a79f811f) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#abf4f7e18d22fe8f75b5212fcf82e7113)) to log out, and the persistent connection is disconnected. In general, the user can receive offline push messages.

- Not logged in (UNLOGINED): The user hasn't logged in since registration or has called `logout` to log out.

   Keep the following in mind in terms of the offline status:

1. An account will be in the offline status if the application is killed or the network is disconnected abnormally (such as due to 4G/Wi-Fi switch or a weak signal in an elevator) when the application is being logged in.

2. An account will be in the offline status if the application process is killed after the user logs in to the application and clicks the Home button to enter the background. An account will be in the online status if the application process is kept alive in the background.

3. Switching between the online and offline statuses relies on the TCP persistent connection between the IM SDK and the backend. If the client is in airplane mode, the network is completely disconnected, or if not supported by certain device vendors, TCP FIN or RST packets may fail to be sent, and the offline status cannot be switched to immediately. As the backend cannot receive heartbeat packets, it will set the current user status to offline 400 seconds later.

   > **Note:**
   > 
   > 1. User status is relevant to the current user but not the device. If an account is logged in on multiple devices at the same time, the status cannot be queried or set by device.
   > 2. Some of the following features are supported only by the [Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat).
   > 3. Some of the features mentioned below require enabling the [Console](https://console.trtc.io/) switch for `Set user status query and status change notification`. The switch path is: Applications > Your App > Chat > Configuration > Login and Message > Set user status query and status change notification.

## Effect

You can use this feature to display the online status and custom statuses of users in your App, as shown in the effect picture below:

## Setting Self Status

Call the `setSelfStatus` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a7520045679f1493c890f2b3b5eee7b84) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.setselfstatus(status:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a7d771431a61635888bdc4def438c4328) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aa93c93f1a3ce5d7802febc0e550cf743)) to set a user's own custom status through the `customStatus` field.
If you have called `addIMSDKListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a2f0297e96d365013e7923275ce2a5d4e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.addimsdklistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac569656a58908afba491710a8cb3c8d9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a1982f2c3a698176ec3fb79ef3f945ed5)) to add a SDK listener, the `onUserStatusChanged` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94251d1971d7b6692b3278ed0d42b73e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserstatuschanged(userstatuslist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a8b086c14a9505990c7f5ac053bf45cd6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a432b98566a4adb3a001ce754788b54e8)) will be triggered after the field is set successfully.

For more information, see [Status Change Notification](https://www.tencentcloud.com/document/product/1047/49562#status-change-notification).

The following describes how to clear the custom status:
1. When calling the `setSelfStatus` API, you can leave the `customStatus` field empty to clear the status.

2. When the SDK notices that the current account is in the offline status, it will automatically clear the custom status and trigger the status change notification.

   > **Note**
   > 
   > 1. To call `setSelfStatus`, you don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition or enable the feature in the console.
   > 2. The `customStatus` is up to 100 bytes.
   > 3. This API can be called an unlimited number of times.

   Sample code:

   

【Java】
``` java
V2TIMUserStatus status = new V2TIMUserStatus();
boolean clearStatus = true;
if (clearStatus) {
      status.setCustomStatus(null);
} else {
      status.setCustomStatus("listening to music");
}
V2TIMManager.getInstance().setSelfStatus(status, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i(TAG, "setSelfStatus succeed, CustomStatus is " + status.getCustomStatus());
    }

    @Override
    public void onError(int code, String desc) {
        Log.e(TAG, "setSelfStatus error code = " + code + ", desc = " + desc);
    }
});
```

【Swift】
``` swift
let status = V2TIMUserStatus()
let clearStatus = true

if clearStatus {
    status.customStatus = nil
} else {
    status.customStatus = "listening to music"
}
V2TIMManager.shared.setSelfStatus(status: status) {
    print( "setSelfStatus succ")
} fail: { code, desc in
    print( "setSelfStatus fail, \(code), \(desc)")
}

```

【Objective-C】
``` objectivec
V2TIMUserStatus *status = [[V2TIMUserStatus alloc] init];
BOOL clearStatus = YES;
if (clearStatus) {
    status.customStatus = nil;
} else {
    status.customStatus = @"listening to music";
}
[V2TIMManager.sharedInstance setSelfStatus:status
                                      succ:^{
    NSLog(@"setSelfStatus succeed, customStatus: %@", status.customStatus);
} fail:^(int code, NSString *desc) {
    NSLog(@"setSelfStatus error, code: %d, desc: %@", code, desc);
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

V2TIMUserStatus status;
bool clearStatus = true;
status.customStatus = clearStatus ? {} : "listening to music";

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Set the user's own status successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to set to the status
        delete callback;
    });

V2TIMManager::GetInstance()->SetSelfStatus(status, callback);
```

## Querying the User Status

Call the `getUserStatus` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a2428c7f87859dd85bed1730ad8d3b92a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.getuserstatus(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#abe44a4c51c686248d483674d77d71053) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a56a7968dcb6f676c8aebd52d0fffbb30)) to query the status of the current user or another user. The API will return the general status and custom status of the queried user.

### Querying a User's Own Status

Users can call `getUserStatus` and set `userIDList` to their own `userID` to query their own status.

> **Note**
> 1. To allow users to query their own status, you don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition or enable the feature in the console.
> 2. This API can be called an unlimited number of times.

Sample code:

【Java】
``` java
String loginUserID = V2TIMManager.getInstance().getLoginUser();
if (loginUserID == null || loginUserID.isEmpty()) {
    return;
}
List<String> ids = Arrays.asList(loginUserID);
V2TIMManager.getInstance().getUserStatus(ids, new V2TIMValueCallback<List<V2TIMUserStatus>>() {
    @Override
    public void onSuccess(List<V2TIMUserStatus> v2TIMUserStatuses) {
        // Queried the user's own status successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to query the user's own status
    }
});
```

【Swift】
``` swift
if let userID = V2TIMManager.shared.getLoginUser() {
    V2TIMManager.shared.getUserStatus(userIDList: [userID]) { result in
        result.forEach { item in
            print( item.description)
        }
    } fail: { code, desc in
        print( "getUserStatus fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
NSString *loginUserID = V2TIMManager.sharedInstance.getLoginUser;
if (loginUserID == nil || loginUserID.length == 0) {
    return;
}
[V2TIMManager.sharedInstance getUserStatus:@[loginUserID]
                                      succ:^(NSArray<V2TIMUserStatus *> *result) {
    // Queried the user's own status successfully
} fail:^(int code, NSString *desc) {
    // Failed to query the user's own status
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

V2TIMString loginUser = V2TIMManager::GetInstance()->GetLoginUser();
if (!loginUser.Empty()) {
    V2TIMStringVector userIDList;
    userIDList.PushBack(loginUser);

    auto callback = new ValueCallback<V2TIMUserStatusVector>{};
    callback->SetCallback(
        [=](const V2TIMUserStatusVector& userStatusList) {
            // Queried the user's own status successfully
            delete callback;
        },
        [=](int error_code, const V2TIMString& error_message) {
            // Failed to query the user's own status
            delete callback;
        });

    V2TIMManager::GetInstance()->GetUserStatus(userIDList, callback);
}
```

### Querying Other User's Status

A user can set `userIDList` to the list of the `userID` values of other users to query their statuses.

> **Note**
> 1. Querying the status of other users requires the [Purchase Pro edition、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).
> 2. To query the status of other users, you need to activate the switch `Set user status query and status change notification` in the [Console](https://console.trtc.io/) in advance. The switch path is: Applications > Your App > Chat > Configuration > Login and Message. If the switch is off, calling getUserStatus will result in an error.
> 3. By default, this API can be called 20 times every 5 seconds, and the statuses of up to 500 users can be queried at a time.

Sample code:

【Java】
``` java
List<String> ids = Arrays.asList("userid1", "userid2", "userid3");
V2TIMManager.getInstance().getUserStatus(ids, new V2TIMValueCallback<List<V2TIMUserStatus>>() {
    @Override
    public void onSuccess(List<V2TIMUserStatus> v2TIMUserStatuses) {
        // Queried the status successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to query the status
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getUserStatus(userIDList: ["userID1", "userID2", "userID3"]) { result in
    result.forEach { item in
        print(item.description)
    }
} fail: { code, desc in
    print( "getUserStatus fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance getUserStatus:@[@"userid1", @"userid2", @"userid3"] succ:^(NSArray<V2TIMUserStatus *> *result) {
    // Queried the status successfully
} fail:^(int code, NSString *desc) {
    // Failed to query the status
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
userIDList.PushBack("userid1");
userIDList.PushBack("userid2");

auto callback = new ValueCallback<V2TIMUserStatusVector>{};
callback->SetCallback(
    [=](const V2TIMUserStatusVector& userStatusList) {
        // Queried the status successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to query the status
        delete callback;
    });

V2TIMManager::GetInstance()->GetUserStatus(userIDList, callback);
```

## Subscribing to the User Status

Call the `subscribeUserStatus` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a9c6deb154d0042d5472ec55cfe0962bb) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.subscribeuserstatus(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a20e6cbe409549e0d2ff62be76914e0b3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6485ab30f0025998ffeecb78490332f5)) to subscribe to the status of the specified user. By default, the IM SDK supports subscribing to the statuses of up to 200 users. After this limit is exceeded, the earliest subscribed user statuses will be removed.
When the user status (including general status and custom status) subscribed to changes, the status change notification can be received in the `onUserStatusChanged` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94251d1971d7b6692b3278ed0d42b73e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserstatuschanged(userstatuslist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a8b086c14a9505990c7f5ac053bf45cd6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a432b98566a4adb3a001ce754788b54e8)).

API features:
1. This API doesn't support subscribing to a user's own status, which can be obtained in the `onUserStatusChanged` callback. .

2. This API supports subscribing to the status of a friend, which will occupy the quota of 200 mentioned above.

   - To get the changes in the statuses of all of a user's friends, you don't need to call this API, and you can enable automatic notifications of friends' statuses in the [Console](https://console.trtc.io/), after which a status change notification can be received in the `onUserStatusChanged` callback.

   - To get the changes in the statuses of some of a user's friends, you can only call `subscribeUserStatus` for subscription, after which a status change notification can be received in the `onUserStatusChanged` callback.

      > **Note**
      > 
      > 1. Subscribing to user status requires the [Purchase Pro edition、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).
      > 2. To subscribe to user status, you must first enable the `Set user status query and status change notification` toggle in the [Console](https://console.trtc.io/). The toggle path: Applications > Your App > Chat > Configuration > Login and Message. If the toggle is off, calling subscribeUserStatus will result in an error.
      > 3. By default, this API can be called 20 times every five seconds, and the statuses of up to 100 users can be subscribed to at a time.

      Sample code:

      

【Java】
``` java
List<String> useridList = Arrays.asList("userid1", "userid2", "userid3");
V2TIMManager.getInstance().subscribeUserStatus(useridList, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // Subscribed to the status successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to subscribe to the status
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.subscribeUserStatus(userIDList: ["userID1", "userID2", "userID3"]) {
    print( "subscribeUserStatus succ")
} fail: { code, desc in
    print( "subscribeUserStatus fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance subscribeUserStatus:@[@"userid1", @"userid2", @"userid3"] succ:^ {
        // Subscribed to the status successfully
} fail:^(int code, NSString *desc) {
        // Failed to subscribe to the status
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
userIDList.PushBack(u8"userid1");
userIDList.PushBack(u8"userid2");

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Subscribed to the status successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Subscribed to the status successfully
        delete callback;
    });

V2TIMManager::GetInstance()->SubscribeUserStatus(userIDList, callback);
```

## Unsubscribing from the User Status

To stop receiving notifications of changes in user statuses, call the `unsubscribeUserStatus` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a9254db13bd53dc48a04d05ba5f116d39) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.unsubscribeuserstatus(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a3780734bb50398ebe65155c3223542f0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a7e62b89e6ad2d164458afa24f379530c)) to unsubscribe from the user status or clear the subscription list.
If you do not manually clear your subscription list, your account's subscription relationships will automatically be cancelled after a long period of offline time (for example: if you do not log in again within 24 hours).

Restrictions for unsubscribing user status are consistent with restrictions for [subscribing user status](https://www.tencentcloud.com/document/product/1047/49562#subscribing-to-the-user-status).

【Java】
``` java
List<String> useridList = Arrays.asList("userid1", "userid2", "userid3");
V2TIMManager.getInstance().unsubscribeUserStatus(useridList, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // Unsubscribed from the status successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to unsubscribe from the status
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.unsubscribeUserStatus(userIDList: ["userID1", "userID2", "userID3"]) {
    print( "unsubscribeUserStatus succ")
} fail: { code, desc in
    print( "unsubscribeUserStatus fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance unsubscribeUserStatus:@[@"userid1", @"userid2", @"userid3"] succ:^ {
        // Unsubscribed from the status successfully
} fail:^(int code, NSString *desc) {
        // Failed to unsubscribe from the status
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
userIDList.PushBack(u8"userid1");
userIDList.PushBack(u8"userid2");

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Unsubscribed from the status successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to unsubscribe from the status
        delete callback;
    });

V2TIMManager::GetInstance()->UnsubscribeUserStatus(userIDList, callback);
```

## Status Change Notification

Depending on the user type, status changes can be divided into three types:
1. Change in a user's own status.

2. Change in a friend's status.

3. Change in a non-friend user's status.

   Notifications on all these status changes can be called back through `onUserStatusChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94251d1971d7b6692b3278ed0d42b73e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserstatuschanged(userstatuslist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a8b086c14a9505990c7f5ac053bf45cd6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a432b98566a4adb3a001ce754788b54e8)), but different types of users trigger the notification differently.

### User's Own Status Changed

If you have called `addIMSDKListener` to add an SDK listener, after a user's own status is set successfully, when the status changes, the `onUserStatusChanged` callback will be triggered, where the user can get the latest own status.

### Friend's Status Changed
1. If you have enabled automatic notifications of friends' statuses in the [Console](https://console.trtc.io/), when the status of a user's friend changes, the `onUserStatusChanged` callback will be automatically triggered.

2. If you don't enable automatic notifications of friends' statuses and want to get friends' status changes, you need to call `subscribeUserStatus` to subscribe to friends' statuses. When a friend's status changes, the `onUserStatusChanged` callback will be automatically triggered.

   The use of `subscribeUserStatus` is limited, refer to [Subscriber Status](https://www.tencentcloud.com/document/product/1047/49562#subscribing-to-the-user-status) above for details.

3. If you neither enable automatic notifications of friends' statuses nor call `subscribeUserStatus` to subscribe to friends' statuses, changes in friends' statuses cannot be obtained.

### Non-friend User's Status Changed

To get the change in a non-friend user's status, you can only call `subscribeUserStatus` to subscribe to the status. When the user's status changes, the `onUserStatusChanged` callback will be triggered, where the user can get the latest status of the non-friend user.

The use of subscribeUserStatus is limited, refer to [Subscriber Status](https://www.tencentcloud.com/document/product/1047/49562#subscribing-to-the-user-status) above for details.

Sample code:

【Java】
``` java
private void initListener() {
    V2TIMSDKListener v2TIMSDKListener = new V2TIMSDKListener() {
        @Override
        public void onUserStatusChanged(List<V2TIMUserStatus> userStatusList) {
            String myselfUserID = V2TIMManager.getInstance().getLoginUser();
            for (V2TIMUserStatus item : userStatusList) {
                if (item.getUserID().equals(myselfUserID)) {
                    // The user's own status changed.
                } else {
                    // The status of another user changed.
                }
            }
        }
    };
    V2TIMManager.getInstance().addIMSDKListener(v2TIMSDKListener);
}
```

【Swift】
``` swift
// Adding a listener
V2TIMManager.shared.addIMSDKListener(listener: self)
// Notification callback
func onUserStatusChanged(userStatusList: [V2TIMUserStatus]) {
    let myselfUserID = V2TIMManager.shared.getLoginUser()
    for userStatus in userStatusList {
        if userStatus.userID == myselfUserID {
            // The user's own status changed.
        } else {
            // The status of another user changed.
        }
    }
}
```

【Objective-C】
``` objectivec
// Adding a listener
[V2TIMManager.sharedInstance addIMSDKListener:self];

// Notification callback
- (void)onUserStatusChanged:(NSArray<V2TIMUserStatus *> *)userStatusList {
    NSString *myselfUserID = V2TIMManager.sharedInstance.getLoginUser;
    for (V2TIMUserStatus *userStatus in userStatusList) {
        if ([userStatus.userID isEqualToString:myselfUserID]) {
            // The user's own status changed.
        } else {
            // The status of another user changed.
        }
    }
}
```

【C++】
``` cpp
class SDKListener final : public V2TIMSDKListener {
public:
    SDKListener() = default;
    ~SDKListener() override = default;

    // User status change notification
    void OnUserStatusChanged(const V2TIMUserStatusVector& userStatusList) override {
        V2TIMString myselfUserID = V2TIMManager::GetInstance()->GetLoginUser();
        for (size_t i = 0; i < userStatusList.Size(); ++i) {
            if (myselfUserID == userStatusList[i].userID) {
                // The user's own status changed.
            } else {
                // The status of another user changed.
            }
        }
    }
};

// Note that `sdkListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
SDKListener sdkListener;
V2TIMManager::GetInstance()->AddSDKListener(&sdkListener);
```

### Multi-client Sync of Status Change Notifications

If you have enabled multi-client login (for more information, see [Feature Configuration](https://intl.cloud.tencent.com/document/product/1047/34419)), an account can be logged in on different clients. When the status of the user logged in on one of the clients changes, the backend will send the `onUserStatusChanged` notification ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94251d1971d7b6692b3278ed0d42b73e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserstatuschanged(userstatuslist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a8b086c14a9505990c7f5ac053bf45cd6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a432b98566a4adb3a001ce754788b54e8)) to other logged-in clients.

## API Restrictions

### Plan Restrictions
- You don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `setSelfStatus` API.

- You don't need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `getUserStatus` API to query a user's own status.

- You need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `getUserStatus` API to query another user's status.

- You need to upgrade to the Pro edition 、Pro Plus edition、Enterprise edition to use the `subscribeUserStatus` / `unsubscribeUserStatus` API.

### API Call Frequency Limit
- The `setSelfStatus` API can be called an unlimited number of times.

- The `getUserStatus` API is used to query a user's own status and can be called an unlimited number of times.

- By default, the `getUserStatus` API can be called 20 times every five seconds if used to query the status of another user, and the statuses of up to 500 users can be queried at a time.

- By default, the `subscribeUserStatus` API can be called 20 times every five seconds, and the statuses of up to 100 users can be subscribed to at a time.

- By default, the `unsubscribeUserStatus` API can be called 20 times every five seconds, and up to 100 users can be unsubscribed from at a time.

## FAQs
- **What should I do if error code 72001 is reported when I call the subscribe/unsubscribe API?**

   Error code 72001 indicates that the feature is not enabled in the console. You need to log in to the [Console](https://console.trtc.io/) and enable the feature.

---
sync_node_id: '108053284080099328'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "用户资料"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

Users can query the information of themselves, friends, and non-friend users. They can also change their nicknames, profile photos, and statuses, as well as friend remarks and list.

## Relationship Event Listener

Call `addFriendListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#af09d0d2297fe73cc81b8e8941bcd35b2) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.addfriendlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a1de011b63b3c20b1be519dc7ba124704) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ac4c542617008471fa1fe7a64ba963fbb)) to add a relationship event listener.

To stop receiving relationship events, call `removeFriendListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a6a823459f109bcd8744806f8f1b8bfea)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.removefriendlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#aed40ccbbc4e15be79154077a6d3ec085) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae21ca2737c35305ecc1f25e054265ed8)) to remove the relationship event listener.

> **Note:**
> You need to set the relationship event listener in advance to receive event notifications.
> 

Sample code:

【Java】
``` java
// Add a relationship listener
V2TIMManager.getFriendshipManager().addFriendListener(listener);
// Remove the relationship listener
V2TIMManager.getFriendshipManager().removeFriendListener(listener);
```

【Swift】
``` swift
// Add a relationship listener
V2TIMManager.shared.addFriendListener(listener: self)
// Remove the relationship listener
V2TIMManager.shared.removeFriendListener(listener: self)
```

【Objective-C】
``` objectivec
// Add a relationship listener
// `self` is id<V2TIMFriendshipListener>.
[[V2TIMManager sharedInstance] addFriendListener:self];

// Remove the relationship listener
[[V2TIMManager sharedInstance] removeFriendListener:self];
```

【C++】
``` cpp
class FriendshipListener final : public V2TIMFriendshipListener {
    // Member...
};

// Add a relationship event listener. Keep `friendshipListener` valid before the listener is removed to ensure event callbacks are received.
FriendshipListener friendshipListener;
V2TIMManager::GetInstance()->GetFriendshipManager()->AddFriendListener(&friendshipListener);

// Remove the relationship listener
V2TIMManager::GetInstance()->GetFriendshipManager()->RemoveFriendListener(&friendshipListener);
```

## Query and Modify User Profile

### Your Own Profile

Call the `getUsersInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a7ca8c0f71a9875021fc35dfcaff68d1e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.getusersinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac638c1dd6ec1e5204637e4b87129cd38) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ac7aa404aec07fc0d9823d9da5fd4e443)) and enter a user's `UserID` for the `userIDList` parameter to query the user's profile.

Sample code:

【Java】
``` java
// Obtain a user's personal profile
String loginUser = V2TIMManager.getInstance().getLoginUser();
List<String> userIDList = new ArrayList<>();
userIDList.add(loginUser);
V2TIMManager.getInstance().getUsersInfo(userIDList, new V2TIMValueCallback<List<V2TIMUserFullInfo>>() {
  @Override
  public void onSuccess(List<V2TIMUserFullInfo> profiles) {
      // User's profile obtained successfully
  }
  @Override
  public void onError(int code, String desc) {
      // Failed to obtain the user's profile
  }
});
```

【Swift】
``` swift
if let userID = V2TIMManager.shared.getLoginUser() {
    V2TIMManager.shared.getUsersInfo(userIDList: [userID]) { infoList in
        infoList.forEach { item in
            print( item.description)
        }
    } fail: { code, desc in
        print( "getUsersInfo group fail, \(code), \(desc)")
    }
}
```

【Objective-C】
``` objectivec
// Obtain a user's personal profile
NSString *loginUser = [[V2TIMManager sharedInstance] getLoginUser];
[[V2TIMManager sharedInstance] getUsersInfo:@[loginUser] succ:^(NSArray<V2TIMUserFullInfo *> *infoList) {
    // User's profile obtained successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the user's profile
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
V2TIMStringVector userIDList;
userIDList.PushBack(loginUser);

auto callback = new ValueCallback<V2TIMUserFullInfoVector>{};
callback->SetCallback(
    [=](const V2TIMUserFullInfoVector& userFullInfoList) {
        // User's profile obtained successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the user's profile
        delete callback;
    });

V2TIMManager::GetInstance()->GetUsersInfo(userIDList, callback);
```

Call the `setSelfInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#af004ab2f1d1458de354883f1995b678a) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.setselfinfo(info:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a328a0d2d07e8d34e12effb73937c3437) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#acb89663576c7f68cc4b9983733835e29)) to modify a user's profile.
A user's profile includes the user's nickname, profile photo, status, gender, birth date, and friend request approval method. For more information, see the definitions of the `V2TIMUserFullInfo` class ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserFullInfo.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMUserFullInfo.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMUserFullInfo.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMUserFullInfo.html)).
After the profile is modified successfully, you will receive the `onSelfInfoUpdated` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94852c92bb087e5aabb6cf6fe9ba77f8) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onselfinfoupdated(info:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#ab3e8543e99934530763daa7eeffbab89) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a0aa71b6e7638fddd65f3e82f7eb264c3)).

Sample code:

【Java】
``` java
// Set the user's profile
V2TIMUserFullInfo info = new V2TIMUserFullInfo();
info.setNickname("nickName");
info.setFaceUrl("faceUrl");
V2TIMManager.getInstance().setSelfInfo(info, new V2TIMCallback() {
  @Override
  public void onSuccess() {
        // User's profile set successfully
  }

  @Override
  public void onError(int code, String desc) {
        // Failed to set the user's profile
  }
});

// Listen for the callback for a user's profile change
V2TIMManager.getInstance().addIMSDKListener(new V2TIMSDKListener() {
  @Override
  public void onSelfInfoUpdated(V2TIMUserFullInfo info) {
      // Received the callback for a user's profile change
  }
});
```

【Swift】
``` swift
let info = V2TIMUserFullInfo()
info.selfSignature = "this is self signature by swift"
info.gender = .V2TIM_GENDER_FEMALE
info.role = 200
info.level = 222
info.birthday = UInt(Date().timeIntervalSince1970)
info.allowType = .V2TIM_FRIEND_ALLOW_ANY
info.nickName = "nickName"
info.faceURL = "URL"
info.customInfo = ["Str": "value1".data(using: .utf8) ?? Data()]
V2TIMManager.shared.setSelfInfo(info: info) {
    print( "setSelfInfo succ, \(info.description)")
} fail: { code, desc in
    print( "setSelfInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Set the user's profile
V2TIMUserFullInfo *info = [[V2TIMUserFullInfo alloc] init];
info.nickName = @"nickName";
info.faceURL = @"faceURL";
[[V2TIMManager sharedInstance] setSelfInfo:info succ:^{
    // User's profile set successfully
} fail:^(int code, NSString *desc) {
    // Failed to set the user's profile
}];

// Listen for the callback for a user's profile change
[[V2TIMManager sharedInstance] addIMSDKListener:self];
- (void)onSelfInfoUpdated:(V2TIMUserFullInfo *)Info {
    // Received the callback for a user's profile change
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

V2TIMUserFullInfo info;
info.nickName = u8"nickName";
info.faceURL = u8"faceUrl";
info.modifyFlag = V2TIMUserInfoModifyFlag::V2TIM_USER_INFO_MODIFY_FLAG_NICK |
                  V2TIMUserInfoModifyFlag::V2TIM_USER_INFO_MODIFY_FLAG_FACE_URL;

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // User's profile set successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to set the user's profile
        delete callback;
    });

V2TIMManager::GetInstance()->SetSelfInfo(info, callback);

// Listen for the callback for a user's profile change
class SDKListener final : public V2TIMSDKListener {
public:
    SDKListener() = default;
    ~SDKListener() override = default;

    void OnSelfInfoUpdated(const V2TIMUserFullInfo& info) override {
        // Received the callback for a user's profile change
    }
    // Other members …
};
// Add an event listener. Keep `sdkListener` valid before the listener is removed to ensure event callbacks are received.
SDKListener sdkListener;
V2TIMManager::GetInstance()->AddSDKListener(&sdkListener);
```

### Friend Profile

Call the `getFriendsInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a8c4e51e508d140e4a7ce5f4caf49c870) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getfriendsinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a39f6752da11b595e4a5b6dcb0eb6a584) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9b263f612a1e7e35ee2c745b5f36a1e3)) to query the profile of the specified friend. And you can call `setFriendInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a151b7de6219d966b4194ad7fcc8450fe) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.setfriendinfo(info:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#ac258312c000c1af69fcf51dd6898b74b) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#abe9169909b008fd0a43044356e3206a0))  to modify the profile of the specified friend.  For more information, see [Friend Management](https://www.tencentcloud.com/document/product/1047/48159#querying-and-modifying-a-friend's-profile).

### Non-friend Profile

Call the `getUsersInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a7ca8c0f71a9875021fc35dfcaff68d1e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.getusersinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac638c1dd6ec1e5204637e4b87129cd38) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ac7aa404aec07fc0d9823d9da5fd4e443)) and enter the `UserID` of a non-friend user for the `userIDList` parameter to query the profile of the non-friend user.

> **Note:**
> 1. The profile of a non-friend user cannot be modified.
> 2. When the profile of a non-friend user is updated, the backend cannot send any system notification to the SDK because there is no friend relationship, so the non-friend user's profile **will not be updated in real time** in SDK. To avoid sending a network request to the server every time the user profile is obtained and save network resources, the SDK adds a caching logic, setting a 10-minute interval between proactive pulls of the same user's profile from the server.

Sample code:

【Java】
``` java
List<String> userIDList = new ArrayList<>();
userIDList.add("userA");
V2TIMManager.getInstance().getUsersInfo(userIDList, new V2TIMValueCallback<List<V2TIMUserFullInfo>>() {
  @Override
  public void onSuccess(List<V2TIMUserFullInfo> profiles) {
      // Obtained the profile of the non-friend user successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to obtain the profile of the non-friend user
  }
});
```

【Swift】
``` swift
// Get the profile of a non-friend user
V2TIMManager.shared.getUsersInfo(userIDList: ["userID1"]) { infoList in
    infoList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "getUsersInfo group fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Get the profile of a non-friend user
[[V2TIMManager sharedInstance] getUsersInfo:@[@"userA"] succ:^(NSArray<V2TIMUserFullInfo *> *infoList) {
    // Obtained the profile of the non-friend user successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the profile of the non-friend user
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
userIDList.PushBack(u8"userA");

auto callback = new ValueCallback<V2TIMUserFullInfoVector>{};
callback->SetCallback(
    [=](const V2TIMUserFullInfoVector& userFullInfoList) {
        // Obtained the profile of the non-friend user successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the profile of the non-friend user
        delete callback;
    });

V2TIMManager::GetInstance()->GetUsersInfo(userIDList, callback);
```

## Subscribe to Non-friend Profile

You can use the `subscribeUserInfo` API  ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a4d14dda5e99d821c84dea4ae25e403af)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.subscribeuserinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac23fa2c088905352957d21789fc2b9d3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a211e335c9ea2188db1596347abec825e))  to subscribe to the profiles of non-friend users. Once successfully subscribed, the SDK will notify you of any changes to the subscribed user's profile via the `onUserInfoChanged`  ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a9d68adb99ba287374cf63e4260357b69) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserinfochanged(userinfolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a18279639e8c805cd6b7676fadbd76465) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#aa0a34bb257c759b0f9909fd46863f3a6)) callback.

By subscribing to non-friend user profiles, you can **stay informed of changes to specific non-friend user profiles in real-time**. **You do not need to subscribe** for friends' profiles or your own profile. Changes to those profiles will automatically be notified to you via the `onFriendInfoChanged` or `onSelfInfoUpdated` callback.

> **Note：**
> - This feature is only available to Pro edition 、Pro Plus edition、Enterprise edition customers. After [purchasing the Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat) and enabling "User Profile Change Subscription" in the [Console](https://console.trtc.io/), you can use this feature. The switch path is: Applications > Your App > Chat > Configuration > Login and Message > User Profile Change Subscription.
> - This feature is available only in SDK enhanced edition v7.4 or later.
> - The subscription list allows a maximum of 200 subscriptions. After the limit is exceeded, the earliest subscribed user will be automatically eliminated (subscribing to friends will also occupy these 200 places).
> - The  frequency limit defaults to a maximum of 20 requests within 5 seconds, and the maximum number of users for a single request must not exceed 100.

Sample code:

【Java】
``` java
List<String> useridList = Arrays.asList("useridA", "useridB", "useridC");
V2TIMManager.getInstance().subscribeUserInfo(useridList, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // Subscription to user profile successful.
    }

    @Override
    public void onError(int code, String desc) {
        // Subscription to user profile failed.
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.subscribeUserInfo(userIDList: ["useridA", "useridB"]) {
    print( "subscribeUserInfo succ")
} fail: { code, desc in
    print( "subscribeUserInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance subscribeUserInfo:@[@"useridA", @"useridB", @"useridC"] 
                                          succ:^ {
    // Subscription to user profile successful.
} fail:^(int code, NSString *desc) {
    // Subscription to user profile failed.
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Subscription to user profile successful.
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Subscription to user profile failed.
        delete callback;
    });

V2TIMManager::GetInstance()->SubscribeUserInfo(userIDList, callback);
```

## Unsubscribe to Non-friend Profile

If you do not want to receive notifications of changes to subscribed user profiles, you can call the `unsubscribeUserInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#af42e383f564f7d5bb9b4d39a3e00d4d9) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.unsubscribeuserinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a4875d417b0ae85ac41ac63b5ac5681a3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aa9888ebe50dc33f007da9bd40ad6c3df)) to cancel the subscription for certain users. 

When the user list in the API parameters is empty, all current subscriptions will be canceled.

> **Note：**
> - This feature is only available to Advanced edition customers. After [purchasing the Pro edition 、Pro Plus edition、Enterprise edition](https://trtc.io/buy/chat) and enabling "User Profile Change Subscription" in the [Console](https://console.trtc.io/), you can use this feature. The switch path is: Applications > Your App > Chat > Configuration > Login and Message > User Profile Change Subscription.
> - This feature is available only in SDK enhanced edition v7.4 or later.
> - The API frequency limit defaults to a maximum of 20 requests within 5 seconds, and the maximum number of users for a single request must not exceed 100.

Sample code:

【Java】
``` java
List<String> useridList = Arrays.asList("useridA", "useridB", "useridC");
V2TIMManager.getInstance().unsubscribeUserInfo(useridList, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // Unsubscription to user profile successful.
    }

    @Override
    public void onError(int code, String desc) {
        // Unsubscription to user profile failed.
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.unsubscribeUserInfo(userIDList: []) {
    print( "unsubscribeUserInfo succ")
} fail: { code, desc in
    print( "unsubscribeUserInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[V2TIMManager.sharedInstance unsubscribeUserInfo:@[@"useridA", @"useridB", @"useridC"] 
                                            succ:^ {
    // Unsubscription to user profile successful.
} fail:^(int code, NSString *desc) {
    // Unsubscription to user profile failed.
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Unsubscription to user profile successful.
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Unsubscription to user profile failed.
        delete callback;
    });

V2TIMManager::GetInstance()->UnsubscribeUserInfo(userIDList, callback);
```

## User Profile Change Notification

User profile changes can be categorized into three types based on different user types:
1. **Changes to your own profile**: Notifications are received through the `onSelfInfoUpdated` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94852c92bb087e5aabb6cf6fe9ba77f8) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onselfinfoupdated(info:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#ab3e8543e99934530763daa7eeffbab89) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a0aa71b6e7638fddd65f3e82f7eb264c3)) callback.

2. **Changes to a friend's profile**: Notifications are received through the `onFriendInfoChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a69aac3e5529bf0d71ed59f7ac2471478) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onfriendprofilechanged(infolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a8a7934bc03f3feb97089d0dd503af684) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a368230384ef78b0bcc87eaf80ed692de)) callback.

3. **Changes to a subscribed user's (non-friend) profile**: Notifications are received through the `onUserInfoChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a94852c92bb087e5aabb6cf6fe9ba77f8) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onuserinfochanged(userinfolist:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#ab3e8543e99934530763daa7eeffbab89) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#aa0a34bb257c759b0f9909fd46863f3a6))  callback.

   To set up the onSelfInfoUpdated and onUserInfoChanged callbacks, call `addIMSDKListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a2f0297e96d365013e7923275ce2a5d4e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.addimsdklistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac569656a58908afba491710a8cb3c8d9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a1982f2c3a698176ec3fb79ef3f945ed5))  to add an SDK listener. For the onFriendInfoChanged callback, call `addFriendListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#af09d0d2297fe73cc81b8e8941bcd35b2)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.addfriendlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a1de011b63b3c20b1be519dc7ba124704) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ac4c542617008471fa1fe7a64ba963fbb))  to add a relationship listener.

   > **Caution****：**
   > 
   > Profile changes will only be notified through the `onUserInfoChanged` callback if the users meet the following conditions:
   > 
   > 1. Users who have successfully subscribed using `subscribeUserInfo`.
   > 2. Users who are not friends.

   Sample code:

   

【Java】
``` java
V2TIMSDKListener v2TIMSDKListener = new V2TIMSDKListener() {
    @Override
    public void onSelfInfoUpdated(V2TIMUserFullInfo info) {
        // Receive notification of changes to your own profile
    }
    
    @Override
    public void onUserInfoChanged(List<V2TIMUserFullInfo> infoList) {
        // Receive notification of changes to subscribed user (non-friend) profiles
    }
};

// Add an SDK listener
V2TIMManager.getInstance().addIMSDKListener(v2TIMSDKListener);

V2TIMFriendshipListener v2TIMFriendshipListener = new V2TIMFriendshipListener() {
    @Override
    public void onFriendInfoChanged(List<V2TIMFriendInfo> infoList) {
        // Receive notification of changes to friend profiles
    }
};

// Add a relationship listener
V2TIMManager.getFriendshipManager().addFriendListener(v2TIMFriendshipListener);
```

【Swift】
``` swift
V2TIMManager.shared.addIMSDKListener(listener: self)

func onSelfInfoUpdated(info: V2TIMUserFullInfo) {
}
func onUserInfoChanged(userInfoList: Array<V2TIMUserFullInfo>) {
    userInfoList.forEach { item in
        print( item.description)
    }
}

V2TIMManager.shared.addFriendListener(listener: self)
func onFriendProfileChanged(infoList: Array<V2TIMFriendInfo>) {
    print( infoList)
}
```

【Objective-C】
``` objectivec
// Add an SDK listener
[[V2TIMManager sharedInstance] addIMSDKListener:self];

- (void)onSelfInfoUpdated:(V2TIMUserFullInfo *)info {
    // Receive notification of changes to your own profile
}

- (void)onUserInfoChanged:(NSArray<V2TIMUserFullInfo *> *)infoList {
    // Receive notification of changes to subscribed user (non-friend) profiles
}

// Add a relationship listener
[[V2TIMManager sharedInstance] addFriendListener:self];

- (void)onFriendProfileChanged:(NSArray<V2TIMFriendInfo *> *)infoList {
    // Receive notification of changes to friend profiles
}
```

【C++】
``` cpp
class SDKListener final : public V2TIMSDKListener {
public:
    SDKListener() = default;
    ~SDKListener() override = default;

    void OnSelfInfoUpdated(const V2TIMUserFullInfo& Info) override {
        // Receive notification of changes to your own profile
    }
    
    void OnUserInfoChanged(const  V2TIMUserFullInfoVector& InfoList) override {
        // Receive notification of changes to subscribed user (non-friend) profiles
    }
    
    // Other members ...
};

// Add an SDK event listener. Keep `sdkListener` valid before the listener is removed to ensure event callbacks are received.
SDKListener sdkListener;
V2TIMManager::GetInstance()->AddSDKListener(&sdkListener);

class FriendshipListener final : public V2TIMFriendshipListener {
public:
    FriendshipListener() = default;
    ~FriendshipListener() override = default;
    void OnFriendInfoChanged(const V2TIMFriendInfoVector& InfoList) override {
        // Receive notification of changes to friend profiles
    }
    
    // Other members ...
};

// Add a relationship event listener. Keep `friendshipListener` valid before the listener is removed to ensure event callbacks are received.
SDKListener sdkListener;
FriendshipListener friendshipListener;
V2TIMManager::GetInstance()->GetFriendshipManager()->AddFriendListener(&friendshipListener);
```

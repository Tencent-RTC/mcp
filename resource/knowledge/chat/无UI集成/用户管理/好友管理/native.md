---
sync_node_id: '108053282438029312'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "好友管理"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

The Chat SDK supports friend management, and users can add and delete friends and set to send messages only to friends.

### Getting the Friend List

The Chat SDK supports the logic for the friend relationship. You can call the `getFriendList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#ae478de55db21d42b72a6c5a6a5d16624) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getfriendlist(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a81131d76924a03ec2b593addd6e4e101) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a11bcb462e073ebec63a2586bad9757cf)) to get the contacts.

Sample code:

【Java】
``` java
V2TIMManager.getFriendshipManager().getFriendList(new V2TIMValueCallback<List<V2TIMFriendInfo>>() {
  @Override
  public void onSuccess(List<V2TIMFriendInfo> v2TIMFriendInfos) {
    // The contacts obtained successfully
  }

  @Override
  public void onError(int code, String desc) {
    // Failed to obtain the contacts
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getFriendList { infoList in
    infoList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "getFriendList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Obtain the contacts
[[V2TIMManager sharedInstance] getFriendList:^(NSArray<V2TIMFriendInfo *> *infoList) {
    // The contacts obtained successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the friend list
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

auto callback = new ValueCallback<V2TIMFriendInfoVector>{};
callback->SetCallback(
    [=](const V2TIMFriendInfoVector& friendInfoList) {
        // The contacts obtained successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the contacts
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->GetFriendList(callback);
```

### Adding Friends

Call the `addFriend` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a19d0f22aaea285e8cee85a5dd6ed9208) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.addfriend(application:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#ac1ea1c7de2bfc2b0a25e5f6b3192e304) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a47ae7c54faf0b4b0f1d0a14fe7ed27d3)) to add a friend.

Sample code:

【Java】
``` java
// Add a friend
V2TIMFriendAddApplication application = new V2TIMFriendAddApplication("userA");
application.setAddType(V2TIMFriendInfo.V2TIM_FRIEND_TYPE_BOTH);
V2TIMManager.getFriendshipManager().addFriend(application, new V2TIMValueCallback<V2TIMFriendOperationResult>() {
  @Override
  public void onSuccess(V2TIMFriendOperationResult v2TIMFriendOperationResult) {
    // Added the friend successfully
  }

  @Override
  public void onError(int code, String desc) {
    // Failed to add the friend
  }
});
```

【Swift】
``` swift
let application = V2TIMFriendAddApplication()
application.userID = "userA"
application.friendRemark = "remark swift"
application.friendGroup = "swift"
application.addWording = "this is an addwording from swift api"
application.addSource = "swift"
application.addType = .V2TIM_FRIEND_TYPE_BOTH
V2TIMManager.shared.addFriend(application: application) { result in
    print( "addFriend succ, \(result.description)")
} fail: { code, desc in
    print( "addFriend fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Add a friend
V2TIMFriendAddApplication *application = [[V2TIMFriendAddApplication alloc] init];
application.userID = @"userA";
application.addType = V2TIM_FRIEND_TYPE_BOTH;
[[V2TIMManager sharedInstance] addFriend:application succ:^(V2TIMFriendOperationResult *result) {
    // Added the friend successfully
} fail:^(int code, NSString *desc) {
    // Failed to add the friend
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

V2TIMFriendAddApplication application;
application.userID = u8"userA";
application.addType = V2TIMFriendType::V2TIM_FRIEND_TYPE_BOTH;

auto callback = new ValueCallback<V2TIMFriendOperationResult>{};
callback->SetCallback(
    [=](const V2TIMFriendOperationResult& friendOperationResult) {
        // Added the friend successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to add the friend
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->AddFriend(application, callback);
```

The process has the following variations depending on whether friend verification is required.

#### Friend Request Approval is Not Required
1. Users A and B call `setFriendListener` to set the contacts listener.

2. User B specifies that "friend request approval is not required (`V2TIM_FRIEND_ALLOW_ANY`)" through the `allowType` field ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserFullInfo.html#a80c0d66aff28d26d9aee2bd8c5f41e61) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMUserFullInfo.html#v2timuserfullinfo.allowtype) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMUserFullInfo.html#a39e2e474ee15e2a642a430baae72a787) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMUserFullInfo.html#a39e2e474ee15e2a642a430baae72a787)) in the `setSelfInfo` function.

3. User A can add user B as a friend successfully by calling `addFriend`, after which the `addType` of the `V2TIMFriendAddApplication` request parameter can be set to either value as needed:

   - If it is set to `V2TIM_FRIEND_TYPE_BOTH` (two-way friend), both users A and B will receive the `onFriendListAdded` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#adf243539e005e2f7cdaa833fa4cd221c) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onfriendlistadded(infolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a84234f0601846547f84904472ab820f8) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a9f9ef535daf007d5b3618c04ffce78f1)).

   - If it is set to `V2TIM_FRIEND_TYPE_SINGLE` (one-way friend), only user A will receive the `onFriendListAdded` callback.

#### Friend Request Approval is Required
1. Users A and B call `setFriendListener` to set the contacts listener.

2. User B specifies that "friend request approval is required (`V2TIM_FRIEND_NEED_CONFIRM`)" through the `allowType` field in the `setSelfInfo` function. 

3. User A calls `addFriend` to send friend request to user B. The `resultCode` parameter in the callback for successful API call returns `30539`, indicating that the request needs to be approved by user B. In addition, both users A and B will receive the `onFriendApplicationListAdded` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#adffb4589ee3fbeb1b7e0e95c4a80ccfa) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onfriendapplicationlistadded(applicationlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a54c7c648088b88ebf0f235d363670566) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a21d27f18f7b022a6625dc35f1d0a1500)).

4. User B will receive the `onFriendApplicationListAdded` callback. If `type` in the `V2TIMFriendApplication` parameter is `V2TIM_FRIEND_APPLICATION_COME_IN`, user B can accept or reject the request.

   - User B calls `acceptFriendApplication` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#ab69ed69330428caff6f468b7df5259fa) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.acceptfriendapplication(application:accepttype:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a51b913927028025e2e450e6e8ce848c0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9cfb992e1c1b958208f3c1b48a6b336d)) to accept the friend request. If the type is `V2TIM_FRIEND_ACCEPT_AGREE` (one-way friend):

      - User A will receive the `onFriendListAdded` callback, indicating that the one-way friend was added successfully.

      - User B will receive the `onFriendApplicationListDeleted` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a64a3bec67f85ddfee3e0d4dafb3b1e46) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onfriendapplicationlistdeleted(useridlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a143207515faa3de58c8222afc21736e6) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a0b98efa127dfd5b18cbddba2f2a5b7d5)). At this point, user B has become a friend of user A, but not vice versa.

   - User B calls `acceptFriendApplication` to accept the friend request. If the type is `V2TIM_FRIEND_ACCEPT_AGREE_AND_ADD` (two-way friend), both users A and B will receive the `onFriendListAdded` callback, indicating that they added each other as a friend successfully.

   - User B calls `refuseFriendApplication` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#af1bcbc196015de8e7a94b1575c466f89) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.refusefriendapplication(application:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a406b964a6513219cfe4803f87f0f00f8) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a333de917766b6999e819eafc0513bf6f)) to reject the friend request, and both users will receive the `onFriendApplicationListDeleted` callback.

      > **Note:**
      > 
      > You can also call getFriendApplicationList ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a2dbf4da19f3b9b170089b8e8cb210166) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getfriendapplicationlist(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#acda7968f1e9adc12261a7e533d709a1c) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aad42cc5d8f5c7abf3c2710697c29a9f9)) to retrieve unprocessed friend request lists, including sent and received friend requests. However, please note that processed friend requests cannot be retrieved again. A maximum of 100 entries can be retrieved.
      > 

### Deleting Friends

Call the `deleteFromFriendList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#af7ecf8641b58462d038a9c97bfbd4d61) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.deletefromfriendlist(useridlist:deletetype:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#af967134fb177b32d4060fedf3663ace3) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ae46d0b7f89dac1867de915b7fed3b479)) to delete a friend.

Sample code:

【Java】
``` java
List<String> friendIDList = new ArrayList<>();
friendIDList.add("userA");
V2TIMManager.getFriendshipManager().deleteFromFriendList(friendIDList, V2TIMFriendInfo.V2TIM_FRIEND_TYPE_BOTH, new V2TIMValueCallback<List<V2TIMFriendOperationResult>>() {
  @Override
  public void onSuccess(List<V2TIMFriendOperationResult> v2TIMFriendOperationResults) {
    // The friend is deleted successfully
  }

  @Override
  public void onError(int code, String desc) {
    // Failed to delete the friend
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.deleteFromFriendList(userIDList: ["userID"], deleteType: .V2TIM_FRIEND_TYPE_BOTH) { resultList in
    resultList.forEach { item in
        // V2TIMFriendOperationResult
        print( item.description)
    }
} fail: { code, desc in
    print( "deleteFromFriendList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Delete a friend
[[V2TIMManager sharedInstance] deleteFromFriendList:@[@"userA"] deleteType:V2TIM_FRIEND_TYPE_BOTH succ:^(NSArray<V2TIMFriendOperationResult *> *resultList) {
    // The friend is deleted successfully
} fail:^(int code, NSString *desc) {
    // Failed to delete the friend
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
V2TIMFriendType deleteType = V2TIMFriendType::V2TIM_FRIEND_TYPE_BOTH;

auto callback = new ValueCallback<V2TIMFriendOperationResultVector>{};
callback->SetCallback(
    [=](const V2TIMFriendOperationResultVector& friendOperationResultList) {
        // The friend deleted successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the friend
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->DeleteFromFriendList(userIDList, deleteType, callback);
```

### Check Friend Relationships

Call the `checkFriend` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a96bb74f3bbd1aef147ec914a81104d11) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.checkfriend(useridlist:checktype:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#aad1b09fab6523d9a36147b4ed4efac67) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a90046f679ca31dedc00bbecff065538f)) to check the friend relationship.

Sample code:

【Java】
``` java
V2TIMManager.getFriendshipManager().checkFriend(userIDList, V2TIMFriendInfo.V2TIM_FRIEND_TYPE_BOTH, new V2TIMValueCallback<List<V2TIMFriendCheckResult>>() {
  @Override
  public void onSuccess(List<V2TIMFriendCheckResult> v2TIMFriendCheckResults) {
    // Checked the friend relationship successfully
    for (V2TIMFriendCheckResult checkResult : v2TIMFriendCheckResults) {
      // User ID
      String userID = checkResult.getUserID();
      // Friend relationship between the two users
      int relationType = checkResult.getResultType();
    }
  }

  @Override
  public void onError(int code, String desc) {
    // Failed to check the friend relationship
  }
});
```

【Swift】
``` swift
// Check the friend relationship between `user1` and the current user
V2TIMManager.shared.checkFriend(userIDList: ["user1"], checkType: .V2TIM_FRIEND_TYPE_BOTH) { resultList in
    resultList.forEach { item in
        // V2TIMFriendCheckResult
        print( item.description)
    }
} fail: { code, desc in
    print( "checkFriend fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Check the friend relationship between `user1` and the current user
[[V2TIMManager sharedInstance] checkFriend:@[@"user1"] checkType:V2TIM_FRIEND_TYPE_BOTH succ:^(NSArray<V2TIMFriendCheckResult *> *resultList) {
    // Checked the friend relationship successfully
    for (V2TIMFriendCheckResult *result in resultList) {
        // User ID
        NSString *userID = result.userID;
        // Friend relationship between the two users
        V2TIMFriendRelationType relationType = result.relationType;
    }
} fail:^(int code, NSString *desc) {
    // Failed to check the friend relationship
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
V2TIMFriendType checkType = V2TIMFriendType::V2TIM_FRIEND_TYPE_BOTH;

auto callback = new ValueCallback<V2TIMFriendCheckResultVector>{};
callback->SetCallback(
    [=](const V2TIMFriendCheckResultVector& friendCheckResultList) {
        // Checked the friend relationship successfully
        for (size_t i = 0; i < friendCheckResultList.Size(); ++i) {
            const V2TIMFriendCheckResult& friendCheckResult = friendCheckResultList[i];
            // User ID
            V2TIMString userID = friendCheckResult.userID;
            // User ID
            V2TIMFriendRelationType relationType = friendCheckResult.relationType;
        }
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to check the friend relationship
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->CheckFriend(userIDList, checkType, callback);
```

### Query and Modify a Friend's Profile

Call the `getFriendsInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a8c4e51e508d140e4a7ce5f4caf49c870) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getfriendsinfo(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a39f6752da11b595e4a5b6dcb0eb6a584) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9b263f612a1e7e35ee2c745b5f36a1e3)) to query the profile of the specified friend.

The relationship between the user and the friend can be obtained through the `relation` field of the `V2TIMFriendInfoResult` in the callback:

|`V2TIMFriendInfoResult`.`relation`|Relationship|
|---------|---------|
|`V2TIM_FRIEND_RELATION_TYPE_NONE`|Non-friend user|
|`V2TIM_FRIEND_RELATION_TYPE_BOTH_WAY`|Two-way friend|
|`V2TIM_FRIEND_RELATION_TYPE_IN_MY_FRIEND_LIST`|User in your contacts|
|`V2TIM_FRIEND_RELATION_TYPE_IN_OTHER_FRIEND_LIST`|User who has you on their contacts|

> **Note**
> When the profile of a friend is updated, the backend proactively sends a system notification to the SDK so that the friend's profile will be updated in real time.
> 

Sample code:

【Java】
``` java
List<String> userIDList = new ArrayList<>();
userIDList.add("userA");
V2TIMManager.getFriendshipManager().getFriendsInfo(userIDList, new V2TIMValueCallback<List<V2TIMFriendInfoResult>>() {
  @Override
  public void onSuccess(List<V2TIMFriendInfoResult> v2TIMFriendInfoResults) {
      // Obtained the profile of the friend successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to obtain the profile of the friend
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getFriendsInfo(userIDList: ["userID1", "userID2"]) { resultList in
    resultList.forEach { item in
        // V2TIMFriendInfoResult
        print( item.description)
    }
} fail: { code, desc in
    print( "getFriendsInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Get the profile of a friend
[[V2TIMManager sharedInstance] getFriendsInfo:@[@"userA"] succ:^(NSArray<V2TIMFriendInfoResult *> *resultList) {
    // Obtained the profile of the friend successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the profile of the friend
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

auto callback = new ValueCallback<V2TIMFriendInfoResultVector>{};
callback->SetCallback(
    [=](const V2TIMFriendInfoResultVector& friendInfoResultList) {
        // Obtained the profile of the friend successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Obtained the profile of the friend successfully
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->GetFriendsInfo(userIDList, callback);
```

Call the `setFriendInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a151b7de6219d966b4194ad7fcc8450fe) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.setfriendinfo(info:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#ac258312c000c1af69fcf51dd6898b74b) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#abe9169909b008fd0a43044356e3206a0)) to modify a friend's profile, including the friend remarks, custom friend field, and friend list. For more information, see the definition of the `V2TIMFriendInfo` class ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendInfo.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendInfo.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMFriendInfo.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMFriendInfo.html)).

To update Custom Friend Fields, log in to the [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars), and configure the **Custom Friend Fields**.

> **Note:**
> You can set up to 20 custom friend fields, which cannot be deleted and whose name and type cannot be changed.
> 

Sample code:

【Java】
``` java
V2TIMFriendInfo friendInfo = new V2TIMFriendInfo();
// `userA` is a friend.
friendInfo.setUserID("userA");
friendInfo.setFriendRemark("friendRemark");
V2TIMManager.getFriendshipManager().setFriendInfo(friendInfo, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Set the friend's profile successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to set the friend's profile
  }
});
```

【Swift】
``` swift
let friendInfo = V2TIMFriendInfo()
friendInfo.userID = "userA"
friendInfo.friendRemark = "friendRemark"
friendInfo.friendCustomInfo = ["key1": "11".data(using: .utf8) ?? Data()]
V2TIMManager.shared.setFriendInfo(info: friendInfo) {
    print( "setFriendInfo succ")
} fail: { code, desc in
    print( "setFriendInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
// Set the friend's profile
V2TIMFriendInfo *friendInfo = [[V2TIMFriendInfo alloc] init];
friendInfo.userID = @"userA"; // `userA` is a friend.
friendInfo.friendRemark = @"friendRemark";
[[V2TIMManager sharedInstance] setFriendInfo:friendInfo succ:^{
    // Set the friend's profile successfully
} fail:^(int code, NSString *desc) {
    // Failed to set the friend's profile
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

V2TIMFriendInfo info;
info.userID = u8"userA";
info.friendRemark = u8"friendRemark";
info.modifyFlag = V2TIMFriendInfoModifyFlag::V2TIM_FRIEND_INFO_MODIFY_FLAG_REMARK;

auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        // Set the friend's profile successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to set the friend's profile
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->SetFriendInfo(info, callback);
```

### Setting to Send Messages to Friends Only

In customer service scenarios where having to friend a customer service agent before chatting is inefficient, the SDK does not check the relationship when one-to-one messages are sent by default.

To require users to add each other as friends before they can exchange messages, log in to [**Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Friends**](https://console.trtc.io/chat/friends-diy-vars). Under this section, enable **Stranger Direct Message Restrictions**. When this option is activated, only friends can send messages to each other. If a user tries to send a message to someone who is not their friend, the SDK returns [error code 20009](https://intl.cloud.tencent.com/document/product/1047/34348).

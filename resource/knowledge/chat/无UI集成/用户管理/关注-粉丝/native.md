---
sync_node_id: '147820849393238016'
nav_path:
  - "无 UI 集成"
  - "用户管理"
  - "关注&粉丝"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Description
- **Following** feature allows users to follow other users they are interested in, so they can timely receive the latest news, feeds, or event information of these users. The system can provide personalized content recommendations based on the user's following list.

- **Followers** feature refers to the state of a user being followed by others. When user A follows user B, A becomes a follower of B. Users can view the count of followers, followers list, or profile of followers on their own profile page.

   Through the features, you can create an active, interconnected user network, promoting the spread of information and the building of the community.

   > **Note:**
   > 
   > - This feature is available only in SDK enhanced edition v7.8 or later.
   > - This feature is only supported by the Pro, Pro-plus, and Enterprise Edition, Please [purchase the Pro, Pro-plus, or Enterprise](https://console.trtc.io/subscription/buy/chat) to use it.

## Display Effect

## API Description

### Follow user

You can call the `followUser` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a136b5a3e39002162738972e891c7e82d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.followuser(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a7cde546df61efd1327db38c37f905d31) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a39f35431406db3697007930b45ea4011)) to follow specified users.

Sample code:

【Java】
``` java
List<String> userIDList = Arrays.asList("useridA", "useridB");
V2TIMManager.getFriendshipManager().followUser(userIDList, new V2TIMValueCallback<List<V2TIMFollowOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMFollowOperationResult> followOperationResultList) {
        // Follow users successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to follow users
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.followUser(userIDList: ["user1", "user2"]) { resultList in
    print( "followUser succ")
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "followUser fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSArray *useridList = @[@"useridA", @"useridB"];
[[V2TIMManager sharedInstance] followUser:userIDList succ:^(NSArray<V2TIMFollowOperationResult *> *resultList) {
        // Follow users succeeded
    } fail:^(int code, NSString *desc) {
        // Failed to follow users
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new ValueCallback<V2TIMFollowOperationResultVector>{};
callback->SetCallback(
    [=](const V2TIMFollowOperationResultVector& followOperationResultList) {
        // Follow users successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to follow users
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->FollowUser(userIDList, callback);
```

> **Note:**
> - This API supports following up to 20 users at a time (excluding yourself, you can follow any other user).
> - The maximum number of followers per user is 5000, and there is no limit on the number of fan users.

### Unfollow user

You can call the `unfollowUser` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a4342b42c4cf9fc8bc2bea86d60f2d9c9) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.unfollowuser(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#ad15c2c5f7ba04f58046ddc23fa84b697) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a2a90ac9b89c3fcaab35693cfdb3dec96)) to unfollow the specified users.

Sample code:

【Java】
``` java
List<String> userIDList = Arrays.asList("useridA", "useridB");
V2TIMManager.getFriendshipManager().unfollowUser(userIDList, new V2TIMValueCallback<List<V2TIMFollowOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMFollowOperationResult> followOperationResultList) {
        // Unfollow users successfully
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to unfollow users
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.unfollowUser(userIDList: ["user1", "user2"]) { resultList in
    print( "unfollowUser succ")
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "unfollowUser fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSArray *useridList = @[@"useridA", @"useridB"];
[[V2TIMManager sharedInstance] unfollowUser:userIDList succ:^(NSArray<V2TIMFollowOperationResult *> *resultList) {
        // Unfollow users successfully
    } fail:^(int code, NSString *desc) {
        // Failed to unfollow users
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new ValueCallback<V2TIMFollowOperationResultVector>{};
callback->SetCallback(
    [=](const V2TIMFollowOperationResultVector& followOperationResultList) {
        // Unfollow users successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to unfollow users
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->UnfollowUser(userIDList, callback);
```

This API supports unfollowing up to 20 users at a time.
> 

### Get my following list

You can use the `getMyFollowingList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#aaa2fde74e3558d19bd6535e434ccf8ec) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getmyfollowinglist(nextcursor:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#aa4f6480569a8b98066e551ae2d9cf0cf) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ad48c98a81a2ecec39ac106bbc8e50f1e)) to pull the list of users you are following.

Sample code:

【Java】
``` java
{
    ...
    String nextCursor = "";
    getMyFollowingList(nextCursor);
    ...
}

public void getMyFollowingList(String nextCursor) {
    V2TIMManager.getFriendshipManager().getMyFollowingList(nextCursor, new V2TIMValueCallback<V2TIMUserInfoResult>() {
        @Override
        public void onSuccess(V2TIMUserInfoResult v2TIMUserInfoResult) {
            StringBuilder stringBuilder = new StringBuilder();
            // Continue with the paged pull
            if (v2TIMUserInfoResult.getNextCursor().length() > 0) {
                // Continue paged pull
                getMyFollowingList(v2TIMUserInfoResult.getNextCursor());
                ...
            } else {
                // Pull complete
            }
        }

        @Override
        public void onError(int code, String desc) {
            // Failed to pull
        }
    });
}
```

【Swift】
``` swift
func getMyFollowingList(cursor: String) {
    V2TIMManager.shared.getMyFollowingList(nextCursor: cursor, succ: { nextCursor, userInfoList in
        if nextCursor.count > 0 {
            // Continue with the paged pull
            self.getMyFollowingList(cursor: nextCursor)
            //...
        } else {
            // Pull complete
        }
    }, fail: { code, desc in
        // Failed to pull
    })
}
```

【Objective-C】
``` objectivec
- (void)getMyFollowingList:(NSString *)cursor {
    [[V2TIMManager sharedInstance] getMyFollowingList:cursor succ:^(NSString *nextCursor, NSArray<V2TIMUserFullInfo *> *userInfoList) {
        if (nextCursor.length > 0) {
            // Continue with the paged pull
            [self getMyFollowingList:nextCursor];
            //...
        } else {
            // Pull complete
        }
    } fail:^(int code, NSString *desc) {
        // Failed to pull
    }];
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

V2TIMString nextCursor = u8"";

void GetMyFollowingList(const V2TIMString& nextCursor) {
    auto callback = new ValueCallback<V2TIMUserInfoResult>{};
    callback->SetCallback(
        [=](const V2TIMUserInfoResult& userInfoResult) {
            if (userInfoResult.nextCursor.Length() > 0) {
                // Continue with the paged pull
                GetMyFollowingList(userInfoResult.nextCursor);
                ...
            } else {
                // Pull complete
            }

            delete callback;
        },
        [=](int error_code, const V2TIMString& error_message) {
            // Failed to pull
            delete callback;
        });

    V2TIMManager::GetInstance()->GetFriendshipManager()->GetMyFollowingList(nextCursor, callback);
}
```

> **Note:**
> - This API returns a maximum of 500 users at a time.
> - When pulling the API for the first time, you can enter the nextCursor parameter of the API as "". If the returned nextCursor is not "" after the callback is successful, you can pass this value and pull it again until nextCursor returns "", indicating that the pull is complete.

### Get my followers list

You can use the `getMyFollowersList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a614faf44b87c209825de3e65fa90ff58) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getmyfollowinglist(nextcursor:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a8cbb33fd80bfd875462166f00b00f262) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aed1be73c9989cb751a884676a6769a78)) to fetch your own list of follower users.

Sample code:

【Java】
``` java
{
    ...
    String nextCursor = "";
    getMyFollowersList(nextCursor);
    ...
}

public void getMyFollowersList(String nextCursor) {
    V2TIMManager.getFriendshipManager().getMyFollowersList(nextCursor, new V2TIMValueCallback<V2TIMUserInfoResult>() {
        @Override
        public void onSuccess(V2TIMUserInfoResult v2TIMUserInfoResult) {
            StringBuilder stringBuilder = new StringBuilder();
            if (v2TIMUserInfoResult.getNextCursor().length() > 0) {
                // Continue with the paged pull
                getMyFollowersList(v2TIMUserInfoResult.getNextCursor());
                ...
            } else {
                // Pull complete
            }
        }

        @Override
        public void onError(int code, String desc) {
            // Failed to pull
        }
    });
}
```

【Swift】
``` swift
func getMyFollowersList(cursor: String) {
    V2TIMManager.shared.getMyFollowersList(nextCursor: cursor, succ: { nextCursor, userInfoList in
        if nextCursor.count > 0 {
            // Continue with the paged pull
            self.getMyFollowersList(cursor: nextCursor)
            //...
        } else {
            // Pull complete
        }
    }, fail: { code, desc in
        // Failed to pull
    })
}
```

【Objective-C】
``` objectivec
- (void)getMyFollowersList:(NSString *)cursor {
    [[V2TIMManager sharedInstance] getMyFollowersList:cursor succ:^(NSString *nextCursor, NSArray<V2TIMUserFullInfo *> *userInfoList) {
        if (nextCursor.length > 0) {
            // Continue with the paged pull
            [self getMyFollowersList:nextCursor];
            //...
        } else {
            // Pull complete
        }
    } fail:^(int code, NSString *desc) {
        // Failed to pull
    }];
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

V2TIMString nextCursor = u8"";

void GetMyFollowersList(const V2TIMString& nextCursor) {
    auto callback = new ValueCallback<V2TIMUserInfoResult>{};
    callback->SetCallback(
        [=](const V2TIMUserInfoResult& userInfoResult) {
            if (userInfoResult.nextCursor.Length() > 0) {
                // Continue with the paged pull
                GetMyFollowersList(userInfoResult.nextCursor);
                ...
            } else {
                // Pull complete
            }

            delete callback;
        },
        [=](int error_code, const V2TIMString& error_message) {
            // Failed to pull
            delete callback;
        });

    V2TIMManager::GetInstance()->GetFriendshipManager()->GetMyFollowersList(nextCursor, callback);
}
```

> **Note:**
> - This API returns a maximum of 500 users at a time.
> - For the first fetch, you can fill the `nextCursor` parameter of the API with `""`. After a successful callback, if the returned `nextCursor` is not `""`, you can input this value to fetch again, until `nextCursor` returns `""`, indicating that the fetch is complete.

### Get mutual followers list

You can call the `getMutualFollowersList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#ac0eaedf339566bfcbd0ad5b5f2080c64) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getmutualfollowerslist(nextcursor:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#ada4fc3b4b1e9a044e73a4b2330d93100) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#aeba0bf5e71b28c6f5ca27d063243fd3a)) to pull the list of users who mutually follow each other (**Users who mutually follow can find each other in their following and followers lists**).

Sample code:

【Java】
``` java
{
    ...
    String nextCursor = "";
    getMutualFollowersList(nextCursor);
    ...
}

public void getMutualFollowersList(String nextCursor) {
    V2TIMManager.getFriendshipManager().getMutualFollowersList(nextCursor, new V2TIMValueCallback<V2TIMUserInfoResult>() {
        @Override
        public void onSuccess(V2TIMUserInfoResult v2TIMUserInfoResult) {
            StringBuilder stringBuilder = new StringBuilder();
            if (v2TIMUserInfoResult.getNextCursor().length() > 0) {
                // Continue with the paged pull
                getMutualFollowersList(v2TIMUserInfoResult.getNextCursor());
                ...
            } else {
                // Pull complete
            }
        }

        @Override
        public void onError(int code, String desc) {
            // Failed to pull
        }
    });
}
```

【Swift】
``` swift
func getMutualFollowersList(cursor: String) {
    V2TIMManager.shared.getMutualFollowersList(nextCursor: cursor, succ: { nextCursor, userInfoList in
        if nextCursor.count > 0 {
            // Continue with the paged pull
            self.getMutualFollowersList(cursor: nextCursor)
            //...
        } else {
            // Pull complete
        }
    }, fail: { code, desc in
        // Failed to pull
    })
}

```

【Objective-C】
``` objectivec
- (void)getMutualFollowersList:(NSString *)cursor {
    [[V2TIMManager sharedInstance] getMutualFollowersList:cursor succ:^(NSString *nextCursor, NSArray<V2TIMUserFullInfo *> *userInfoList) {
        if (nextCursor.length > 0) {
            // Continue with the paged pull
            [self getMutualFollowersList:nextCursor];
            //...
        } else {
            // Pull complete
        }
    } fail:^(int code, NSString *desc) {
        // Failed to pull
    }];
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

V2TIMString nextCursor = u8"";

void GetMutualFollowersList(const V2TIMString& nextCursor) {
    auto callback = new ValueCallback<V2TIMUserInfoResult>{};
    callback->SetCallback(
        [=](const V2TIMUserInfoResult& userInfoResult) {
            if (userInfoResult.nextCursor.Length() > 0) {
                // Continue with the paged pull
                GetMutualFollowersList(userInfoResult.nextCursor);
                ...
            } else {
                // Pull complete
            }

            delete callback;
        },
        [=](int error_code, const V2TIMString& error_message) {
            // Failed to pull
            delete callback;
        });

    V2TIMManager::GetInstance()->GetFriendshipManager()->GetMutualFollowersList(nextCursor, callback);
}
```

> **Note:**
> - This API returns a maximum of 500 users at a time.
> - For the first fetch, you can fill the `nextCursor` parameter of the API with `""`. After a successful callback, if the returned `nextCursor` is not `""`, you can input this value to fetch again, until `nextCursor` returns `""`, indicating that the fetch is complete.

### Get the count of following/followers/mutual followers

You can call the `getUserFollowInfo` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#a86ff97aed8e6476ff6393660c8433f5d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.getuserfollowinfo(useridlist:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a6a01145bcdfba7fe49d7882fac047b29) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#afdf4e500355abbe24c1cdb33147f3b62)) to get the count of following/followers/mutual followers for specific users.

In the successful callback, you can get the count of following, followers, and mutual followers of a specific user from `followingCount`, `followersCount`, and `mutualFollowersCount` of `V2TIMFollowInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFollowInfo.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFollowInfo.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMFollowInfo.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMFollowInfo.html)) .

Sample code:

【Java】
``` java
List<String> userIDList = Arrays.asList("useridA", "useridB");
V2TIMManager.getFriendshipManager().getUserFollowInfo(userIDList, new V2TIMValueCallback<List<V2TIMFollowInfo>>() {
    @Override
    public void onSuccess(List<V2TIMFollowInfo> followInfoList) {
        // Obtained successfully
        for (V2TIMFollowInfo followInfo : V2TIMFollowInfoList) {
            if (followInfo.getResultCode() == 0) {
                // Here, you can get the count of following/followers/mutual followers corresponding to the user, followInfo.getUserID().
                // That is, followInfo.getFollowingCount(), followInfo.getFollowersCount() and followInfo.getMutualFollowersCount().
            }
        }
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to obtain
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getUserFollowInfo(userIDList: ["user1", "user2"]) { resultList in
    print( "getUserFollowInfo succ")
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "getUserFollowInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSArray *useridList = @[@"useridA", @"useridB"];
[[V2TIMManager sharedInstance] getUserFollowInfo:userIDList succ:^(NSArray<V2TIMFollowInfo *> *resultList) {
        // Obtained successfully
        for (V2TIMFollowInfo *result in resultList) {
            if (result.resultCode == 0) {
                // Here, you can get the count of following/followers/mutual followers corresponding to the user, result.userID.
                // That is, result.followingCount, result.followersCount, and result.mutualFollowersCount.
            }
        }
    } fail:^(int code, NSString *desc) {
        // Failed to obtain
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new ValueCallback<V2TIMFollowInfoVector>{};
callback->SetCallback(
    [=](const V2TIMFollowInfoVector& followInfoList) {
        // Obtained successfully
        for (size_t i = 0; i < followInfoList.Size(); ++i) {
            if (followInfoList[i].resultCode == 0) {
                // Here, you can get the count of following/followers/mutual followers for the user, followInfoList[i].userID.
                // That is, followInfoList[i].followingCount, followInfoList[i].followersCount, and followInfoList[i].mutualFollowersCount.
            }
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->GetUserFollowInfo(userIDList, callback);
```

### Check follow type

You can call the `checkFollowType` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#aeb364a11188590a7e6093522f5bad415) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.checkfollowtype(useridlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a8ad5e8f21088dd7d0e2212127f636fc4) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#a9b401a8e3613a04cfd48f15a5c0f60be)) to check your following relationship with specified users.

In the successful callback, you can obtain your relationship with the specified user through the `followType` of  `V2TIMFollowTypeCheckResult` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFollowTypeCheckResult.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMFollowTypeCheckResult.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMFollowTypeCheckResult.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMFollowTypeCheckResult.html)):

|`V2TIMFollowTypeCheckResult.followType`|Relationship with yourself|
|---------|---------|
|`V2TIM_FOLLOW_TYPE_NONE`|No following relationship|
|`V2TIM_FOLLOW_TYPE_IN_MY_FOLLOWING_LIST`|The user is only in my following list|
|`V2TIM_FOLLOW_TYPE_IN_MY_FOLLOWERS_LIST`|The user is only in my followers list|
|`V2TIM_FOLLOW_TYPE_IN_BOTH_FOLLOWERS_LIST`|Mutually follow with the user (the user is both in my following list and in my followers list)|

Sample code:

【Java】
``` java
List<String> userIDList = Arrays.asList("useridA", "useridB");
V2TIMManager.getFriendshipManager().checkFollowType(userIDList, new V2TIMValueCallback<List<V2TIMFollowTypeCheckResult>>() {
    @Override
    public void onSuccess(List<V2TIMFollowTypeCheckResult> followTypeCheckResultList) {
        // Successfully checked the follow relationship
        for (V2TIMFollowTypeCheckResult followTypeCheckResult : followTypeCheckResultList) {
            if (followTypeCheckResult.getResultCode() == 0) {
                // Here, you can get the relationship with the user followTypeCheckResult.getUserID(), the follow type followTypeCheckResult.getFollowType()
            }
        }
    }

    @Override
    public void onError(int code, String desc) {
        // Failed to check the follow relationship
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.checkFollowType(userIDList: ["user1", "user2"]) { resultList in
    print( "checkFollowType succ")
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "checkFollowType fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSArray *useridList = @[@"useridA", @"useridB"];
[[V2TIMManager sharedInstance] checkFollowType:userIDList succ:^(NSArray<V2TIMFollowTypeCheckResult *> *resultList) {
        // Successfully checked the follow relationship
        for (V2TIMFollowTypeCheckResult *result in resultList) {
            if (result.resultCode == 0) {
                // Here, you can get the relationship with the user result.userID, the follow type result.followType
            }
        }
    } fail:^(int code, NSString *desc) {
        // Failed to check the follow relationship
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
userIDList.PushBack(u8"useridA");
userIDList.PushBack(u8"useridB");

auto callback = new ValueCallback<V2TIMFollowTypeCheckResultVector>{};
callback->SetCallback(
    [=](const V2TIMFollowTypeCheckResultVector& followTypeCheckResultList) {
        // Successfully checked the follow relationship
        for (size_t i = 0; i < followTypeCheckResultList.Size(); ++i) {
            if (followTypeCheckResultList[i].resultCode == 0) {
                // Here, you can get the relationship with the user followTypeCheckResultList[i].userID, the follow type followTypeCheckResultList[i].followType
            }
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to check the follow relationship
        delete callback;
    });

V2TIMManager::GetInstance()->GetFriendshipManager()->FollowUser(userIDList, callback);
```

> **Note:**
> The frequency limit of `checkFollowType` API is up to 20 calls within 5 seconds, and each call can support up to 100 users.
> 

### Notifications

The specific list change notifications are as follows:
| List Change Notification | Description |
| --- | --- |
| Follow List Change Notification <code>onMyFollowingListChanged</code> (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a8c08eac823fce61ccf4d3c2e937c9f4a">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onmyfollowinglistchanged(userinfolist:isadd:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#af1243a06e9c368f8b4e1ca0da3bb57ee">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#a38b25e2a5b818446a550b931439b7804">C++</a>) | - When the <code>isAdd</code> in the notification is <code>true</code>, it signifies a notification for <strong>adding a user</strong> to the list, and at this time, <strong>the complete user profile is returned</strong><br>- When the <code>isAdd</code> in the notification is <code>false</code>, it signifies a notification for <strong>deleting a user</strong> from the list, and at this time, <strong>only the user ID is included in the returned user profile</strong> |
| Followers List Change Notification <code>onMyFollowersListChanged</code> (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#aa79cc88ae14c184b4228d930ada3c8cc">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onmyfollowerslistchanged(userinfolist:isadd:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a65637819c5418338c46ffd82d0ae1afd">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#ade31ea1d6bef16359509f71138ea8667">C++</a>) |  |
| Mutual Followers List Change Notification <code>onMutualFollowersListChanged</code> (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipListener.html#a23c61fc8afddcfc53d1bd35d2a908daf">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMFriendshipListener.html#v2timfriendshiplistener.onmyfollowerslistchanged(userinfolist:isadd:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/protocolV2TIMFriendshipListener-p.html#a08ef9b8c38e1257bf2ce00a2748708d9">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipListener.html#ab199a74ed7b7c3f9fe90101fc63fab18">C++</a>) |  |

> **Note:**
> To receive notifications for the aforementioned events, please call `addFriendListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMFriendshipManager.html#af09d0d2297fe73cc81b8e8941bcd35b2) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Friendship.html#v2timmanager.addfriendlistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Friendship_08.html#a1de011b63b3c20b1be519dc7ba124704) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMFriendshipManager.html#ac4c542617008471fa1fe7a64ba963fbb))  beforehand to add a relationship event listener.
> 

### Notifications of adding users to a list

Suppose there are two users `Alice` and `Bob`. During the process of mutual following, the related list change notifications and relationship changes are as follows:
| Event | <code>Alice</code> | <code>Bob</code> |  |  |
| --- | --- | --- | --- | --- |
| Notifications received | Relationship with <code>Bob</code> | Notifications received | Relationship with <code>Alice</code> |  |
| <code>Alice</code> follows <code>Bob</code> | Notification for adding users to following list | Follow | Notification for adding users to followers list | Follower |
| <code>Bob</code> follows <code>Alice</code> | Notification for adding users to followers list<br>Notification for adding users to mutual followers list | Mutual follower | Notification for adding users to following list<br>Notification for adding users to mutual followers list | Mutual follower |

### Notifications of deleting users from a list

Assuming there are two users, `Alice` and `Bob`, who are mutual followers, during the process of mutually unfollowing, the related list change notifications and relationship changes are as follows:
| Event | <code>Alice</code> | <code>Bob</code> |  |  |
| --- | --- | --- | --- | --- |
| Notifications received | Relationship with <code>Bob</code> | Notifications received | Relationship with <code>Alice</code> |  |
| <code>Alice</code> unfollows  <code>Bob</code> | Notification for deleting users from following list<br>Notification for deleting users from mutual followers list | Follower | Notification for deleting users from followers list<br>Notification for deleting users from mutual follow list | Follow |
| <code>Bob</code> unfollows  <code>Alice</code> | Notification for deleting users from followers list | No following relationship | Notification for deleting users from following list | No following relationship |

Sample code:

【Java】
``` java
V2TIMFriendshipListener v2TIMFriendshipListener = new V2TIMFriendshipListener() {
    @Override
    public void onMyFollowingListChanged(List<V2TIMUserFullInfo> userInfoList, boolean isAdd) {
        if (isAdd) {
            // Receive notification of users added to following list
        } else {
            // Receive notification of users deleted from following list
        }
    }

    @Override
    public void onMyFollowersListChanged(List<V2TIMUserFullInfo> userInfoList, boolean isAdd) {
        if (isAdd) {
            // Receive notification of users added to followers list
        } else {
            // Receive notification of users deleted from followers list
        }
    }

    @Override
    public void onMutualFollowersListChanged(List<V2TIMUserFullInfo> userInfoList, boolean isAdd) {
        if (isAdd) {
            // Receive notification of users added to  mutual followers list
        } else {
            // Receive notification of users deleted from mutual follow list
        }
    }
};

// Add a relationship chain listener
V2TIMManager.getFriendshipManager().addFriendListener(v2TIMFriendshipListener);
```

【Swift】
``` swift
V2TIMManager.shared.addFriendListener(listener: self)
func onMyFollowingListChanged(userInfoList: Array<V2TIMUserFullInfo>, isAdd: Bool) {
    print( "isAdd: \(isAdd)|userInfoList: \(userInfoList)")
}
func onMyFollowersListChanged(userInfoList: Array<V2TIMUserFullInfo>, isAdd: Bool) {
    print( "isAdd: \(isAdd)|userInfoList: \(userInfoList)")
}
func onMutualFollowersListChanged(userInfoList: Array<V2TIMUserFullInfo>, isAdd: Bool) {
    print( "isAdd: \(isAdd)|userInfoList: \(userInfoList)")
}
```

【Objective-C】
``` objectivec
// Add a relationship event listener
[[V2TIMManager sharedInstance] addFriendListener:self];

- (void)onMyFollowingListChanged:(NSArray<V2TIMUserFullInfo *> *)userInfoList isAdd:(BOOL)isAdd {
    if (isAdd) {
        // Receive notification of users added to following list
    } else {
        // User deletion notification from following list
    }
}

- (void)onMyFollowersListChanged:(NSArray<V2TIMUserFullInfo *> *)userInfoList isAdd:(BOOL)isAdd {
    if (isAdd) {
        // Receive notification of users added to followers list
    } else {
        // Receive notification of users deleted from followers list
    }
}

- (void)onMutualFollowersListChanged:(NSArray<V2TIMUserFullInfo *> *)userInfoList isAdd:(BOOL)isAdd {
    if (isAdd) {
        // Receive notification of users added to mutual followers list
    } else {
        // Receive notification of users deleted from mutual followers list
    }
}
```

【C++】
``` cpp
class FriendshipListener final : public V2TIMFriendshipListener {
public:
    FriendshipListener() = default;
    ~FriendshipListener() override = default;

    void OnMyFollowingListChanged(const V2TIMUserFullInfoVector &userInfoList, bool isAdd) override {
        if (isAdd) {
            // Receive notification of users added to following list
        } else {
            // Receive notification of users deleted from following list
        }
    }

    void OnMyFollowersListChanged(const V2TIMUserFullInfoVector &userInfoList, bool isAdd) override {
        if (isAdd) {
            // Receive notification of users added to followers list
        } else {
            // Receive notification of users deleted from followers list
        }
    }

    void OnMutualFollowersListChanged(const V2TIMUserFullInfoVector &userInfoList, bool isAdd) override {
        if (isAdd) {
            // Receive notification of users added to mutual followers list
        } else {
            // Receive notification of users deleted from mutual followers list
        }
    }

    // Other member functions ...
};

// Add a relationship event listener. Note that the lifespan of the friendshipListener must be maintained before removing the listener to ensure event callbacks are received
FriendshipListener friendshipListener;
V2TIMManager::GetInstance()->GetFriendshipManager()->AddFriendListener(&friendshipListener);
```

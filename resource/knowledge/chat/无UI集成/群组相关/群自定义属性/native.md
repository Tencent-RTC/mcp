---
sync_node_id: '108053291798667264'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群自定义属性"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

Group Custom Attributes enable each group to have its own set of custom key-value pairs. You can use this feature to store additional information specific to the group, such as managing seats in a voice chat room, organizing group activities, setting group tags, and implementing a group points system.

Taking the management of seats in a voice chat room as an example:
- When someone takes the seat, set a group attribute to manage the user's information.

- When someone leaves the seat, delete the corresponding group attribute.

- Other group members can display and refresh the list of seats by retrieving the group attributes list and listening for updates on group attributes.

   > **Note:**
   > 
   > - On versions 6.7 and earlier, only the audio-video group (AVChatRoom) is supported.
   > - Starting from version 6.8, the audio-video group (AVChatRoom), public group (Public), meeting group (Meeting), and work group (Work) are supported.
   > - Starting from version 7.0, group attributes support all group types except topics.

## API Description

### Initializing Group Attributes

Call the `initGroupAttributes` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a17569b57abc77adb6be9356b9eb70182) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.initgroupattributes(groupid:attributes:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a1b3a56dfc345f1ef2a575cb36156e745) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a049a490d04dde4cf925491809a6df6e2)) to initialize the group attributes, and the original group attributes, if any, will be cleared first.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().initGroupAttributes("groupA", attributeMap, new V2TIMCallback() {
  @Override
  public void onSuccess() {
        // Initialized the group attributes successfully
  }

  @Override
  public void onError(int code, String desc) {
        // Failed to initialized the group attributes
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.initGroupAttributes(groupID: "groupID", attributes: ["key1":"value1", "key2":"value2"]) {
    print( "initGroupAttributes succ")
} fail: { code, desc in
    print( "initGroupAttributes fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] initGroupAttributes:@"groupA" attributes:@{@"key1" : @"value1"} succ:^{
    // Initialized the group attributes successfully
} fail:^(int code, NSString *desc) {
    // Failed to initialized the group attributes
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

V2TIMString groupID = "groupA";
V2TIMGroupAttributeMap attributes;
attributes.Insert("key1", "value1");
attributes.Insert("key2'", "value2");

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Initialized the group attributes successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to initialized the group attributes
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->InitGroupAttributes(groupID, attributes, callback);
```

### Setting Group Attributes

Call the `setGroupAttributes` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a3ec31101e4763dab7a1c99a71bc3da08)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.setgroupattributes(groupid:attributes:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a134342ddb51d1ee83f3981ed91d26885) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a35accef15afd5def586332c7397cee7b)) to set the group attributes. If a group attribute doesn't exist, it will be automatically added.

Sample code:

【Java】
``` java
HashMap<String, String> attributeMap = new HashMap<>();
attributeMap.put("key1", "value1");
attributeMap.put("key2", "value2");
V2TIMManager.getGroupManager().setGroupAttributes("groupA", attributeMap, new V2TIMCallback() {
  @Override
  public void onSuccess() {
        // Set the group attributes successfully
  }

  @Override
  public void onError(int code, String desc) {
        // Failed to set the group attributes
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.setGroupAttributes(groupID: "groupID", attributes: ["key1": "modify value1"]) {
    print( "setGroupAttributes succ")
} fail: { code, desc in
    print( "setGroupAttributes fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] setGroupAttributes:@"groupA" attributes:@{@"key1" : @"value1"} succ:^{
    // Set the group attributes successfully
} fail:^(int code, NSString *desc) {
    // Failed to set the group attributes
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

V2TIMString groupID = "groupA";
V2TIMGroupAttributeMap attributes;
attributes.Insert("key1", "value1");
attributes.Insert("key2'", "value2");

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Set the group attributes successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to set the group attributes
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SetGroupAttributes(groupID, attributes, callback);
```

### Deleting Group Attributes

Call the `deleteGroupAttributes` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a45f211bafddc58bf5e199e18a6814578) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.deletegroupattributes(groupid:keys:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#aa504ffca9492580ca27a45f78a87e2cb) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#acdbc438459cfd970bd557a3b252db768)) to delete a specified group attribute. If `keys` is set to `null`/`nil`, all the group attributes will be cleared.

Sample code:

【Java】
``` java
List<String> keyList = new ArrayList<>();
keyList.add("key1");
V2TIMManager.getGroupManager().deleteGroupAttributes("groupA", keyList, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Deleted successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to delete
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.deleteGroupAttributes(groupID: "groupID", keys: ["key1"]) {
    print( "deleteGroupAttributes succ")
} fail: { code, desc in
    print( "deleteGroupAttributes fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] deleteGroupAttributes:@"groupA" keys:@[@"key1"] succ:^{
    // Deleted successfully
} fail:^(int code, NSString *desc) {
    // Failed to delete
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

V2TIMString groupID = "groupA";
V2TIMStringVector keys;
keys.PushBack("key1");
keys.PushBack("key2");

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // The group attributes deleted successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the group attributes
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->DeleteGroupAttributes(groupID, keys, callback);
```

### Getting Group Attributes

Call the `getGroupAttributes` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ade2155fb24ed1c0b8eb976e146c14e3d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupattributes(groupid:keys:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#ac8a74db230669d1b49da47bb0895cbf9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7e719bb36c782f56849a6b46bf2afab4)) to get a specified group attribute. If `keys` is set to `null`/`nil`, all the group attributes will be obtained.

> **Note**
>  The `getGroupAttributes` API can be called by a logged-in user 20 times every five seconds in the SDK.
> 

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().getGroupAttributes("groupA", null, new V2TIMValueCallback<Map<String, String>>() {
  @Override
  public void onSuccess(Map<String, String> stringStringMap) {
      // Obtained successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to obtain
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getGroupAttributes(groupID: "groupID", keys: nil) { map in
    map.forEach { (key: String, value: String) in
        print( "\(key): \(value)")
    }
} fail: { code, desc in
    print( "getGroupAttributes fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getGroupAttributes:@"groupA" keys:nil succ:^(NSMutableDictionary<NSString *,NSString *> *groupAttributeList) {
    // Obtained successfully
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

auto callback = new ValueCallback<V2TIMGroupAttributeMap>{};
callback->SetCallback(
    [=](const V2TIMGroupAttributeMap& groupAttributeMap) {
        // The group attributes obtained successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the group attributes
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetGroupAttributes("groupID", {}, callback);
```

### Updating Group Attributes

If you have called `addGroupListener` to add a group event listener, all the group attributes will be called back through `onGroupAttributeChanged` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#aa390fa93bc73a0262bdddb540227dc45) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.ongroupattributechanged(groupid:attributes:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#a7b76343c7ef46af4a2cd09db6d51db13) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a08aae62ce4f50a3787689404c2e4899a)) when a group attribute is changed.

Sample code:

【Java】
``` java
V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
  @Override
  public void onGroupAttributeChanged(String groupID, Map<String, String> groupAttributeMap) {
      // A group attribute was changed.
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.addGroupListener(listener: self)
func onGroupAttributeChanged(groupID: String, attributes: Dictionary<String, String>) {
  print( "groupID:\(groupID), attributes:\(attributes)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onGroupAttributeChanged:(NSString *)groupID attributes:(NSMutableDictionary<NSString *,NSString *> *)attributes {
    // A group attribute was changed.
}
```

【C++】
``` cpp
class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnGroupAttributeChanged(const V2TIMString& groupID,
                                 const V2TIMGroupAttributeMap& groupAttributeMap) override {
        // A group attribute was changed.
    }
    // Other members …
};
// Add a group event listener. Keep `groupListener` valid before the listener is removed to ensure event callbacks are received.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

## API Limitations
1. You can configure up to 16 group attributes. The size of each group attribute can be up to 4 KB, and the total size of all group attributes can be up to 16 KB.

2. The `initGroupAttributes`, `setGroupAttributes`, and `deleteGroupAttributes` APIs each can be called by a logged-in user up to 10 times every 5 seconds in the SDK, and the 8511 error code will be called back if the limit is exceeded. The APIs each can be called by a logged-in user up to 5 times every second in the backend, and the 10049 error code will be called back if the limit is exceeded.

3. The `getGroupAttributes` API can be called by a logged-in user 20 times every 5 seconds in the SDK.

4. Starting from version 5.6, when you modify group attributes for the first time after the app is started, call `getGroupAttributes` to pull the latest group attributes before you initiate the modification operation.

5. Starting from version 5.6, when multiple users modify the same group attributes at the same time, only the first user can execute successfully, and other users will receive the 10056 error code. After receiving this error code, call `getGroupAttributes` to update the locally stored group attributes to the latest before you initiate the modification operation.

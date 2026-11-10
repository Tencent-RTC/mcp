---
sync_node_id: '108053293207953408'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群资料"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

The group profile refers to the information about the group, such as group ID, group type, custom group field, and the number of joined members. It is saved in the `V2TIMGroupInfo` object, which is created and returned by the IM SDK and cannot be customized.

## Getting the Group Profile

Call `getGroupsInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ada614335043d548c11f121500e279154)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupsinfo(groupidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a9bca7e5318cfed44335566a783a6b568) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a8c98b92b45c3a2c4e57901e6c4cd3435)) to get the group profile. This API supports passing in multiple `groupID` values at a time to batch get group profiles.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().getGroupsInfo(groupIDList, new V2TIMValueCallback<List<V2TIMGroupInfoResult>>() {
  @Override
  public void onSuccess(List<V2TIMGroupInfoResult> v2TIMGroupInfoResults) {
      // Obtained the group profile successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to obtain the group profile
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getGroupsInfo(groupIDList: ["groupA"]) { groupResultList in
    groupResultList.forEach { item in
        print(item.description)
    }
} fail: { code, desc in
    print("getGroupsInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getGroupsInfo:@[@"groupA"] succ:^(NSArray<V2TIMGroupInfoResult *> *groupResultList) {
    // Obtained the group profile successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the group profile
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
groupIDList.PushBack("group1");

auto callback = new ValueCallback<V2TIMGroupInfoResultVector>{};
callback->SetCallback(
    [=](const V2TIMGroupInfoResultVector& groupInfoResultList) {
        // Obtained the group profile successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the group profile
        delete callback;
    });
V2TIMManager::GetInstance()->GetGroupManager()->GetGroupsInfo(groupIDList, callback);
```

## Modifying Group Profiles

Call `setGroupInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ad4ceef92975fa00c4a5dddc8f7e1edcf) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.setgroupinfo(info:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#aa9519a479493e56d7920e40aba796144) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a10785c46e166879250c2c2ba2001b354)) to modify the group profile.

If you have called `addGroupListener` to add a group event listener, after the group profile is modified, all the group members will receive the `onGroupInfoChanged` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#ac3a88ea430c6dc35845472ed98ad049b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.ongroupinfochanged(groupid:changeinfolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#abbe2208a234d77364bff697eea503d27) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a37aa57b23295e6b295413fafba2eda07)).

Member roles that can modify the group profile vary by group type as follows:

|Group Type|Member Roles Allowed to Modify the Group Profile|
|---------|---------|
|Work group (Work)|All group members|
|Public group (Public)|Group owner and admin|
|Meeting group (Meeting)|Group owner and admin|
|Community (Community)|Group owner and admin|
|Audio-video group (AVChatRoom)|Group owner|

> **Caution**
>  Not all the fields of the group profile `V2TIMGroupInfo` can be modified, but only those writable.
> 

Sample code:

【Java】
``` java
// Sample code: Modify group profile
V2TIMGroupInfo v2TIMGroupInfo = new V2TIMGroupInfo();
v2TIMGroupInfo.setGroupID("Group ID of the group to be modified");
v2TIMGroupInfo.setFaceUrl("http://xxxx");
V2TIMManager.getGroupManager().setGroupInfo(v2TIMGroupInfo, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Modified the group profile successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to modify the group profile
  }
});
```

【Swift】
``` swift
let groupInfo = V2TIMGroupInfo()
groupInfo.groupID = "groupA"
groupInfo.faceURL = "http://xxxx"
V2TIMManager.shared.setGroupInfo(info: groupInfo) {
    LOGI(message: "setGroupInfo succ")
} fail: { code, desc in
    LOGI(message: "setGroupInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMGroupInfo *info = [[V2TIMGroupInfo alloc] init];
info.groupID = @"Group ID of the group to be modified";
info.faceURL = @"http://xxxx";
[[V2TIMManager sharedInstance] setGroupInfo:info succ:^{
    // Modified the group profile successfully
} fail:^(int code, NSString *desc) {
    // Failed to modify the group profile
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

V2TIMGroupInfo info;
info.groupID = "Group ID to be modified";
info.faceURL = "http://xxxx";
info.modifyFlag |= V2TIM_GROUP_INFO_MODIFY_FLAG_FACE_URL;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Modified the group profile successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to modify the group profile
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SetGroupInfo(info, callback);
```

## Setting a Custom Group Field

The `customInfo` attribute in the `V2TIMGroupInfo` group profile is the custom group field, which can be modified by calling the `setGroupInfo` API mentioned in the previous section.

Unlike setting other fields in `V2TIMGroupInfo`, setting the custom group field involves two steps:
1. In the [Console](https://console.trtc.io/), configure the key for the Custom Group Definition field. The key is of type string and its length should not exceed 16 bytes. If the key is not pre-configured, attempting to directly set the key-value will fail. Configuration path: Applications > Your App > Chat > Configuration > Group Configuration > Custom Group Field.

2. Call the `setGroupInfo` API to set the field with up to 512 bytes.

   > **Caution**
   > 
   > 1. You can set up to ten custom fields, which cannot be deleted and whose name and type cannot be changed.
   > 2. The custom field is mainly used to ensure compatibility with v1 and v2. If you use the API on v2, we recommend you use the `initGroupAttributes` API to set the group attribute. This allows for greater flexibility (requiring no configuration in the console) and storage (up to 16 KB). For more information, see [Custom Group Attribute](https://intl.cloud.tencent.com/document/product/1047/48175).

## Setting the Group Message Receiving Option

Any group member can call the `setGroupReceiveMessageOpt` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a2735427ac22485626aea278a9d465b3e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.setgroupreceivemessageopt(groupid:opt:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a379eeef926e41ec5d48287e7fb55b80a) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a866d06c28faf058f253f29be6f5b3fe2)) to change the group message receiving option. This setting will take effect only for the group member and will not affect the setting of other group members.

`V2TIMReceiveMessageOpt` has the following options:

|Message Receiving Option|Supported Type|Description|
|---------|---------|---------|
|V2TIM_RECEIVE_MESSAGE|One-to-one Chat, Group Chat, All Messages|Receive messages normally when online, and receive offline push notifications when offline|
|V2TIM_NOT_RECEIVE_MESSAGE|One-to-one Chat, Group Chat|Do not receive messages whether online or offline|
|V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE|One-to-one Chat, Group Chat, All Messages|Receive messages normally when online, but do not receive offline push notifications when offline|
|V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE_EXCEPT_AT|Group Chat|Receive messages online, only receive `at` message pushes when offline|
|V2TIM_NOT_RECEIVE_MESSAGE_EXCEPT_AT|Topic|Only receive `at` messages when online or offline|

Setting different `V2TIMReceiveMessageOpt` options can implement different Do Not Disturb effects:
| Do Not Disturb Effect | Message Receiving Option | Description |
| --- | --- | --- |
| Do not receive any messages at all | V2TIM_NOT_RECEIVE_MESSAGE | No messages can be received, and the conversation list will not be updated. |
| Receive messages but without notifications | V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE | At this time, it is recommended to display a red dot on the conversation list (without showing the unread count):<br>1. When a new message is received and the conversation list needs to be updated, obtain the message unread count through the unreadCount in the V2TIMConversation of the conversation.<br>2. If the unread count is greater than zero, display a red dot instead of the unread number. |
| Receive messages but only alert for <code>at</code> messages | V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE_EXCEPT_AT | Receive messages normally within the group will only remind you of <code>at</code> messages. |
| Only receive <code>at</code> messages | V2TIM_NOT_RECEIVE_MESSAGE_EXCEPT_AT | Only receive <code>at</code> messages on a topic when online or offline |

> **Note:**
> In the above implementations, if it requires the `unreadCount` feature in `V2TIMConversation`, it applies only to work groups (Work), public groups (Public), and communities (Community), but not to audio-video groups (AVChatRoom) or meeting groups (Meeting). For more information on group types, see [Group System](https://intl.cloud.tencent.com/document/product/1047/33529).
> 

Sample code:

【Java】
``` java
V2TIMManager.getMessageManager().setGroupReceiveMessageOpt("groupA", V2TIMMessage.V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Changed the group message receiving option successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to change the group message receiving option
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.setGroupReceiveMessageOpt(groupID: "groupID", opt: .V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE, succ: {
    // Changed the group message receiving option successfully
}, fail: { code, msg in
    // Failed to change the group message receiving option
})
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] setGroupReceiveMessageOpt:@"groupA" opt:V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE succ:^{
    // Changed the group message receiving option successfully
} fail:^(int code, NSString *desc) {
    // Failed to change the group message receiving option
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
V2TIMReceiveMessageOpt opt = V2TIMReceiveMessageOpt::V2TIM_RECEIVE_NOT_NOTIFY_MESSAGE;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Changed the group message receiving option successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to change the group message receiving option
        delete callback;
    });

V2TIMManager::GetInstance()->GetMessageManager()->SetGroupReceiveMessageOpt(groupID, opt, callback);
```

---
sync_node_id: '108053288998969344'
nav_path:
  - "无 UI 集成"
  - "群组相关"
  - "群成员管理"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

Group member management includes pulling the member list, muting group members, removing group members, granting permissions, and transferring the group ownership.

## Getting the Group Member List

Call the `getGroupMemberList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a69fc0831aacaa0585c1855f4c91320be)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupmemberlist(groupid:filter:nextseq:succ:fail:)) /[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a98681b9036e73acbe8f84737b5291326)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ade696bf03f06de9cdfb534570de35254)) to get the list of members in a specified group.
This list contains the profile of each group member, such as user ID (`userID`), group name card (`nameCard`), avatar (`faceUrl`), nickname (`nickName`), time of joining the group (`joinTime`), online status (`isOnline`), etc. 

As an audio-video group (AVChatRoom) has a large number of members, the feature of pulling the list of all the members is unavailable. A Pro edition 、Pro Plus edition、Enterprise edition user can call `getGroupMemberList` to pull the latest 1,000 group members.  The group member list backend data update interval is 40s. 

This feature is disabled by default. To enable it, log in to the [**Chat Console**](https://console.trtc.io) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message), select **AVChatRoom**, then enable **List of Online AVChatRoom Members**.

Detailed parameter description of the `getGroupMemberList` API is as follows.

### filter parameter

`filter` parameter's type is `V2TIMGroupMemberFilter`, means to pull a specific role list:

|Filter|Type|
|---------|---------|
|V2TIM_GROUP_MEMBER_FILTER_ALL|Pull the information list of all group members|
|V2TIM_GROUP_MEMBER_FILTER_OWNER|Pull the information list of the group owner|
|V2TIM_GROUP_MEMBER_FILTER_ADMIN|Pull the information list of the group admin|
|V2TIM_GROUP_MEMBER_FILTER_COMMON|Pull the information list of ordinary group members|

For audio-video groups, you can set `filter` to a custom group member mark other than `V2TIMGroupMemberFilter` to filter group members as needed. For more information, see [Marking Group Members](https://www.tencentcloud.com/document/product/1047/48181#marking-group-members).

### nextSeq parameter

In many cases, only the first page of the group member list, not the information of all the group members, needs to be displayed on the user UI. More group members need to be pulled only when the user clicks **Next Page** or pulls up the list page. In this case, you can use pulling by page. The pagination pull procedure is:
1. When you call `getGroupMemberList` for the first time, set `nextSeq` to `0` (indicating to pull the group member list from the beginning). Up to 500 group member objects can be pulled at a time.

   > **Note:**
   > 
   > - For version 7.2 and lower versions, an ordinary group defaults to pulling 50 group members at a time.
   > - For version 7.3 and above versions, an ordinary group defaults to pulling 500 group members at a time.

2. After the group member list is pulled successfully for the first time, the `V2TIMGroupMemberInfoResult` callback of `getGroupMemberList` will contain `nextSeq` (field for the next pull):

   - If `nextSeq` is `0`, all the group members have been pulled.

   - If `nextSeq` is greater than `0`, there are more group members that can be pulled. 

3. When the user continues to pull up the group member list, if there are more members that can be pulled, you can continue to call the `getGroupMemberList` API and pass in the `nextSeq` parameter (the value is from the `V2TIMGroupMemberInfoResult` object returned by the last pull) for the next pull.

4. Repeat [step 3] until `nextSeq` is `0`.

   Sample code:

   

【Java】
``` java
{
    ...
    long nextSeq = 0;
    getGroupMemberList(nextSeq);
    ...
}

public void getGroupMemberList(long nextSeq) {
    // Retrieve all members by specifying the 'filter' parameter.
    int filterRole = V2TIMGroupMemberFullInfo.V2TIM_GROUP_MEMBER_FILTER_ALL;
    V2TIMManager.getGroupManager().getGroupMemberList("testGroup", filterRole, nextSeq, 
        new V2TIMValueCallback<V2TIMGroupMemberInfoResult>() {
        @Override
        public void onError(int code, String desc) {
            // Messages failed to be pulled
        }

        @Override
        public void onSuccess(V2TIMGroupMemberInfoResult groupMemberInfoResult) {
            if (groupMemberInfoResult.getNextSeq() != 0) {
                // Make another pull
                getGroupMemberList(groupMemberInfoResult.getNextSeq());
                ...
            } else {
                // Pull ends
            }
        }
    });
}
```

【Swift】
``` swift
func getGroupMemberList(seq: UInt32) {
    // Retrieve all members by specifying the 'filter' parameter.
    V2TIMManager.shared.getGroupMemberList(groupID: "groupA", filter: .V2TIM_GROUP_MEMBER_FILTER_ALL, nextSeq: UInt(seq), succ: { nextSeq, memberList in
        if nextSeq != 0 {
            // Make another pull
            self.getGroupMemberList(seq: UInt32(nextSeq))
            //...
        } else {
            // Pull ends
        }
    }, fail: { code, desc in
        // Messages failed to be pulled
    })
}
```

【Objective-C】
``` objectivec
- (void)getGroupMemberList:(uint32_t)seq {
    // Retrieve all members by specifying the 'filter' parameter.
    [[V2TIMManager sharedInstance] getGroupMemberList:@"groupA" filter:V2TIM_GROUP_MEMBER_FILTER_ALL nextSeq:seq succ:^(uint64_t nextSeq, NSArray<V2TIMGroupMemberFullInfo *> *memberList) {
        if (nextSeq != 0) {
            // Make another pull
            [self getGroupMemberList:nextSeq];
            //...
        } else {
            // Pull ends
        }
    } fail:^(int code, NSString *desc) {
        // Messages failed to be pulled
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

V2TIMString groupID = "testGroup";
// Retrieve all members by specifying the 'filter' parameter.
uint32_t filter = V2TIMGroupMemberFilter::V2TIM_GROUP_MEMBER_FILTER_ALL;
uint64_t nextSeq = 0;

auto callback = new ValueCallback<V2TIMGroupMemberInfoResult>{};
callback->SetCallback(
    [=](const V2TIMGroupMemberInfoResult& groupMemberInfoResult) {
        if (groupMemberInfoResult.nextSequence != 0) {
            // Make another pull
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Messages failed to be pulled
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetGroupMemberList(groupID, filter, nextSeq, callback);
```

## Marking Group Members

The group owner can call the `markGroupMemberList` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#abdd5f157904dd50012c7a93f66f85dba) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.markgroupmemberlist(groupid:memberlist:marktype:enablemark:succ:fail:)) /[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a21238536e7cb2c3fd086797e7dc1b970)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#abda7d60a02581930b2071cac01d41cfd)) to mark or unmark members of an audio-video group. Rules are as follows:
1. This feature is supported only on audio-video groups and Community groups, and only group owners have the permission to mark or unmark group members.

2. Up to ten custom marks can be added per audio-video group.

3. Custom marks configured through Chat SDK must be of uint32_t type and greater than or equal to 1,000.

4. Up to 100 group members can be marked at a time.

5. Only online members can be marked. When a member leaves a group or goes offline, its mark information will be cleared. When the member joins the group or goes online again, you can reset a mark for the member through a third-party callback.

   After marking group members, the group owner can call [getGroupMemberList](https://www.tencentcloud.com/document/product/1047/48181#getting-the-group-member-list) to set `filter` to a configured custom group member mark to filter group members as needed. 

   > **Note**
   > 
   > 1. This feature is available only in Enhanced edition v6.6 or later.
   > 2. To use this feature, you need to [purchase the Pro edition, Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat).

## Muting Group Members

### Muting a Specified Group Member

The group owner or admin can call `muteGroupMember` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a450230c4d129611e1b0519827ec0f8b5) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.mutegroupmember(groupid:memberuserid:mutetimeseconds:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#aa8a0206f75d75400b517f7e0d80fe9ee) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ab19d433e5552205fcba61627e54f7569)) and set `muteTime` (in seconds) to mute a group member. If `muteTime` is set to `120`, the member is muted for 120 seconds.
If a group member is muted, message sending will fail, and an error code will be reported. To unmute the member, set `muteTime` to `0`.

The muting timestamp is stored in the `muteUntil` field ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupMemberFullInfo.html#a2caecbec07bdd4fa8e6b8072bc39be58) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupMemberFullInfo.html#v2timgroupmemberfullinfo.muteuntil) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupMemberFullInfo.html#a953345fe02297a7192b727abe4b772c6) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupMemberFullInfo.html#a953345fe02297a7192b727abe4b772c6)) of the group member information. Note that `muteUntil` indicates the end time for muting a group member.

After a group member is muted, all the group members (including the muted member) will receive the `onMemberInfoChanged` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#a4ac777faad07e32408ae7ef5e2e3fc86) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.onmemberinfochanged(groupid:changeinfolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#a18b147301296642e7193e4321e33fd24) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#af87ae2fa909e0e10a521074371359125)).

> **Note**
> The group owner can mute/unmute the admin and ordinary group members. The admin can mute/unmute ordinary group members.
> 

### Muting the Entire Group

The group owner or admin can also **call the** `muteAllGroupMembers` **API (**[**Java**](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ab3f057b439e976b17dcc0e2e9be5e7d1) **/** [**Swift**](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.muteallgroupmembers(groupid:ismute:succ:fail:)) **/** [**Objective-C**](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a7749c65c3adca4a48611ab4265407cf6) **/** [**C++**](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a746446022f8869942903c5e19d1a4c80)**) to mute the entire group** by setting the `isMute` field to `true`/`YES`. The entire group can be muted for an unlimited period of time.

Muting all the group members will trigger the `onAllGroupMembersMuted` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#ad982cf2f3538d940f7e9d7b6dc9eb5af)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.onallgroupmembersmuted(groupid:ismute:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#a7bdd2e8fb2025ba34f3595ca29137202)/[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a2ecb07b1904d6ac4d0e65809367fe492)).

You can configure **notification of muting all change** in the console. Go to [**Chat Console**](https://console.trtc.io/) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message) **> Select Group Type** (Work Group/Friend Group/Public Group/Meeting Group/AVChatRoom/Community) **> Notification of Group Profile Change > Notification of muting all change**, and update the relevant settings.

> **Note:**
> Only the group owner can mute the admin.
> 

Sample code:

【Java】
``` java
// Mute the `userB` group member for one minute
V2TIMManager.getGroupManager().muteGroupMember("groupA", "userB", 60, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Muted the group member successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to mute the group member
  }
});

// Mute all members
V2TIMManager.getGroupManager().muteAllGroupMembers("groupA", true, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Muted all successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to mute all
  }
});

V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
  @Override
  public void onMemberInfoChanged(String groupID, List<V2TIMGroupMemberChangeInfo> v2TIMGroupMemberChangeInfoList) {
    // Listen for the muting of a group member
    for (V2TIMGroupMemberChangeInfo memberChangeInfo : v2TIMGroupMemberChangeInfoList) {
      // ID of the muted user
      String userID = memberChangeInfo.getUserID();
      // Muting duration
      long muteTime = memberChangeInfo.getMuteTime();
    }
  }

  @Override
  public void onAllGroupMembersMuted(String groupID, boolean isMute) {
    // Listen for the muting of all
  }
});
```

【Swift】
``` swift
// Mute the group member `user1` for one minute
V2TIMManager.shared.muteGroupMember(groupID: "groupA", memberUserID: "user1", muteTimeSeconds: 60) {
    print( "muteGroupMember succ")
} fail: { code, desc in
    print( "muteGroupMember fail, \(code), \(desc)")
}

// Mute all members
V2TIMManager.shared.muteAllGroupMembers(groupID: "groupA", isMute: true) {
    print( "muteAllGroupMembers succ")
} fail: { code, desc in
    print( "muteAllGroupMembers fail, \(code), \(desc)")
}

V2TIMManager.shared.addGroupListener(listener: self)
func onMemberInfoChanged(groupID: String, changeInfoList: Array<V2TIMGroupMemberChangeInfo>) {
    print( "groupID:\(groupID), changeInfoList:\(changeInfoList)")
}

func onAllGroupMembersMuted(groupID: String, isMute: Bool) {
    print( "groupID:\(groupID), isMute:\(isMute)")
}
```

【Objective-C】
``` objectivec
// Mute the group member `user1` for one minute
[[V2TIMManager sharedInstance] muteGroupMember:@"groupA" member:@"user1" muteTime:60 succ:^{
    // Muted the group member successfully
} fail:^(int code, NSString *desc) {
    // Failed to mute the group member
}];

// Mute all members
[[V2TIMManager sharedInstance] muteAllGroupMembers:@"groupA" isMute:YES succ:^{
    // Muted all successfully
} fail:^(int code, NSString *desc) {
    // Failed to mute all
}];

[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onMemberInfoChanged:(NSString *)groupID changeInfoList:(NSArray <V2TIMGroupMemberChangeInfo *> *)changeInfoList {
    // Listen for the muting of a group member
    for (V2TIMGroupMemberChangeInfo *memberChangeInfo in changeInfoList) {
      // ID of the muted user
      NSString *userID = memberChangeInfo.userID;
      // Muting duration
        uint32_t muteTime = memberChangeInfo.muteTime;
    }
}

- (void)onAllGroupMembersMuted:(NSString *)groupID isMute:(BOOL)isMute {
    // Listen for the muting of all
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

// Mute the `userB` group member for one minute
auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Muted the group member successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to mute the group member
        delete callback;
    });
V2TIMManager::GetInstance()->GetGroupManager()->MuteGroupMember("groupA", "userB", 60, callback);

// Mute all members
V2TIMGroupInfo info;
info.groupID = "groupA";
info.allMuted = true;
info.modifyFlag = V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_SHUTUP_ALL;
auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Muted all successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to mute all
        delete callback;
    });
V2TIMManager::GetInstance()->GetGroupManager()->SetGroupInfo(info, callback);

// Listen for the muting of a group member or all
class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnMemberInfoChanged(const V2TIMString& groupID,
                             const V2TIMGroupMemberChangeInfoVector& groupMemberChangeInfoList) override {
        // Listen for the muting of a group member
        for (size_t i = 0; i < groupMemberChangeInfoList.Size(); ++i) {
            const V2TIMGroupMemberChangeInfo& groupMemberChangeInfo = groupMemberChangeInfoList[i];
            // ID of the muted user
            V2TIMString userID = groupMemberChangeInfo.userID;
            // Muting duration
            uint32_t muteTime = groupMemberChangeInfo.muteTime;
        }
    }
    void onAllGroupMembersMuted(const V2TIMString& groupID,
                                bool isMute) override {
      // Listen for the muting of all
    }
    // Other members …
};
// Add a group event listener. Keep `groupListener` valid before the listener is removed to ensure event callbacks are received.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

## Kicking Group Members

The SDK provides a basic kick API and an advanced kick API for all types of groups. The group owner or administrator can call the kick API to kick a specified group member out of the group.

### Basic API

The group owner or admin can call `kickGroupMember` <sup>①</sup> ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a6da6755c6e0c46e96cb02575074a5333)/ [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.kickgroupmember(groupid:memberlist:reason:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a0581f28fddf2ade890aa62e4318d7a97) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ad2e4f74f4e26fb0db455d8e92f774032)) to kick a specified group member out of the group. After the Group member is kicked out, all members (including the kicked user) will receive the `onMemberKicked` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#a2874b768866c2d255144c128a766c7fe) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.onmemberkicked(groupid:opuser:memberlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#a85e7f32f403d876018a26a1b37607edc) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a08eea992617b046a983ca8757414d8d5)) callback. 

Except for AVChatRoom, the kicked user can apply to join the group again or be invited to join the group after using this API. See details in Kicking group members out of a AVChatRoom.

Sample code:

【Java】
``` java
List<String> userIDList = new ArrayList<>();
userIDList.add("userB");
V2TIMManager.getGroupManager().kickGroupMember("groupA", userIDList, "", newV2TIMValueCallback<List<V2TIMGroupMemberOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMGroupMemberOperationResult> v2TIMGroupMemberOperationResults) {
      // Remove group members successfully
    }

    @Override
    public void onError(int code, String desc) {
      // Failed to remove group members successfully
    }
    }
});

V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
    @Override
    public void onMemberKicked(String groupID, V2TIMGroupMemberInfo opUser,
    List<V2TIMGroupMemberInfo> memberList) {
      // Group member kicked notification
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.kickGroupMember(groupID: "groupA", memberList: ["user1", "user2"], reason: "sd") { resultList in
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "kickGroupMember fail, \(code), \(desc)")
}

V2TIMManager.shared.addGroupListener(listener: self)

func onMemberKicked(groupID: String, opUser: V2TIMGroupMemberInfo, memberList:     
       Array<V2TIMGroupMemberInfo>) {
    // Group member kicked notification
    print( "groupID:\(groupID), opUser:\(opUser), memberList:\(memberList)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] kickGroupMember:@"groupA" memberList:@[@"user1"] reason:@"" succ:^(NSArray<V2TIMGroupMemberOperationResult *> *resultList) {
    // Remove group members successfully
} fail:^(int code, NSString *desc) {
    // Failed to remove group members successfully
}];

[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onMemberKicked:(NSString *)groupID opUser:(V2TIMGroupMemberInfo *)opUser memberList:(NSArray<V2TIMGroupMemberInfo *>*)memberList {
    // Group member kicked notification
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

V2TIMString groupID = "groupA";
V2TIMStringVector memberList;
memberList.PushBack("userB");

auto callback = new ValueCallback<V2TIMGroupMemberOperationResultVector>{};
callback->SetCallback(
[=](const V2TIMGroupMemberOperationResultVector& groupMemberOperationResultList) {
    // Remove group members successfully
    delete callback;
},
[=](int error_code, const V2TIMString& error_message) {
    // Failed to remove group members successfully
    delete callback;
});

V2TIMManager::GetInstance()->GetGroupManager()->KickGroupMember(groupID, memberList, {}, callback);

class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnMemberKicked(const V2TIMString& groupID, const V2TIMGroupMemberInfo& opUser, const V2TIMGroupMemberInfoVector& memberList) override {
        // Group member kicked notification
    }
};

// Note that `groupListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

### Advanced API

Since v7.2, the SDK has made a function upgrade to `kickGroupMember` <sup>②</sup> ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#af20bd11309ce9ba2807507d0ca66a0cf) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.kickgroupmember(groupid:memberlist:reason:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a9e937e2dfd872bdbcc675cbf7f54522e) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aca94e51e879a7fadbca24a0a991727d1)) , adding a `duration` parameter to specify the duration which the user is prohibited from reapplying to join the group after being kicked out of the group.

> **Note：**
> This API is only open to Pro, Pro Plus or Enterprise edition. When calling this API to kick out a group member, only those who have integrated IMSDK v6.6 and above (including the kicked user) will receive the `onMemberKicked` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#a2874b768866c2d255144c128a766c7fe) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.onmemberkicked(groupid:opuser:memberlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#a85e7f32f403d876018a26a1b37607edc) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a08eea992617b046a983ca8757414d8d5)) callback.
> 

Sample code:

【Java】
``` java
List<String> userIDList = new ArrayList<>();
userIDList.add("userB");
V2TIMManager.getGroupManager().kickGroupMember("groupA", userIDList, "", 100, newV2TIMValueCallback<List<V2TIMGroupMemberOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMGroupMemberOperationResult> v2TIMGroupMemberOperationResults) {
      // Remove group members successfully
    }

    @Override
    public void onError(int code, String desc) {
      // Failed to remove group members successfully
    }
});

V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
    @Override
    public void onMemberKicked(String groupID, V2TIMGroupMemberInfo opUser,
    List<V2TIMGroupMemberInfo> memberList) {
      // Group member kicked notification
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.kickGroupMember(groupID: "groupA", memberList: ["user1", "user2", "user3"], reason: "sd", duration: 10) { resultList in
    resultList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "kickGroupMember fail, \(code), \(desc)")
}

V2TIMManager.shared.addGroupListener(listener: self)

func onMemberKicked(groupID: String, opUser: V2TIMGroupMemberInfo, memberList:     
       Array<V2TIMGroupMemberInfo>) {
    // Group member kicked notification
    print( "groupID:\(groupID), opUser:\(opUser), memberList:\(memberList)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] kickGroupMember:@"groupA" memberList:@[@"user1"] reason:@"" duration:100 succ:^(NSArray<V2TIMGroupMemberOperationResult *> *resultList) {
    // Remove group members successfully
} fail:^(int code, NSString *desc) {
    // Failed to remove group members successfully
}];

[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onMemberKicked:(NSString *)groupID opUser:(V2TIMGroupMemberInfo *)opUser memberList:(NSArray<V2TIMGroupMemberInfo *>*)memberList {
    // Group member kicked notification
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

V2TIMString groupID = "groupA";
V2TIMStringVector memberList;
memberList.PushBack("userB");

auto callback = new ValueCallback<V2TIMGroupMemberOperationResultVector>{};
callback->SetCallback(
[=](const V2TIMGroupMemberOperationResultVector& groupMemberOperationResultList) {
    // Remove group members successfully
    delete callback;
},
[=](int error_code, const V2TIMString& error_message) {
    // Failed to remove group members successfully
    delete callback;
});

V2TIMManager::GetInstance()->GetGroupManager()->KickGroupMember(groupID, memberList, {}, 100, callback);

class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnMemberKicked(const V2TIMString& groupID, const V2TIMGroupMemberInfo& opUser,
    const V2TIMGroupMemberInfoVector& memberList) override {
        // Group member kicked notification
    }
};

// Note that `groupListener` should not be released before the IM SDK is uninitialized,
// otherwise the message callback cannot be called.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

### Kicking from an AVChatRoom

For an audio-video group (AVChatRoom):
1. For Enhanced version earlier than v6.6, audio-video groups do not support member removal, and you can use `muteGroupMember` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a450230c4d129611e1b0519827ec0f8b5) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.mutegroupmember(groupid:memberuserid:mutetimeseconds:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#aa8a0206f75d75400b517f7e0d80fe9ee) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ab19d433e5552205fcba61627e54f7569)) to mute a specified member to implement similar controls. For detailed directions, see [Muting](https://www.tencentcloud.com/document/product/1047/48181#muting-group-members).

2. For Enhanced version 6.6 or later, audio-video groups support member removal. You can use the [basic interface](https://www.tencentcloud.com/document/product/1047/48185) to remove group members. Once removed, members cannot rejoin the group or send messages. Only the owner of the AVChatRoom can remove members. Administrators and regular members do not have permission to remove users.

3. For v7.2 or later, the AVChatRoom can also use the [advanced API](https://www.tencentcloud.com/document/product/1047/48185) to kick out group members, and set a custom time to specify the time interval for kicked users to join the group again.

   > **Caution**
   > 
   > 1. For v6.6 or later, kicking group members out of the AVChatRoom needs to [purchase Pro, Pro Plus or Enterprise edition](https://trtc.io/buy/chat).
   > 2. If you want to kick group members from AVChatRoom, log in to the [Chat Console](https://console.trtc.io) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message), then enable **Banning Group Members**.

## Setting an Admin

The group owner calling `setGroupMemberRole` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a34ebf60528d02626834f022b4ebabfa8)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.setgroupmemberrole(groupid:memberuserid:newrole:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a0f1c341a3dc53d6a6557a438b0c64b65) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ab429c1ded6aa3ae27bb0917be6f71dd3)) can grant admin authorization to group members in stranger social groups (Public), temporary meeting groups (Meeting), and audio-video groups (AVChatRoom).

An ordinary member set as the admin has the admin permission to perform the following operations:
- Modify the basic group profile.

- Remove an ordinary member from the group

- Mute an ordinary member (prevent the member from speaking during a specified period of time)

- Approve a request to join the group

   For more information, see [Group Member Roles](https://www.tencentcloud.com/document/product/1047/33529#group-member-roles).

   Once authorized, ordinary members of audio-video groups have the same permissions as administrators, for example:

- Remove an ordinary group member from the audio-video group.

   After an ordinary member is set as the admin, all the members (including the ordinary member) will receive the `onGrantAdministrator` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#ae4e23c72489eafc882a40a24f36f1ae9) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.ongrantadministrator(groupid:opuser:memberlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#af9148b7c76b1ecc89f52be0ffc8316d2) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a97e81d2409ca8fe6d657762a314c4363)).

   After the ordinary member is unset as the admin, all the members (including the ordinary member) will receive the `onRevokeAdministrator` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#a089480ee71485b5842c75b8c1985f72f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.onrevokeadministrator(groupid:opuser:memberlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#ad82c255d1cbff590fa580f4b746e0f3e) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#aea80df2e365ad58339e1e5095c4154cf)).

   Sample code:

   

【Java】
``` java
V2TIMManager.getGroupManager().setGroupMemberRole("groupA", "userB", V2TIMGroupMemberFullInfo.V2TIM_GROUP_MEMBER_ROLE_ADMIN, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Changed the group member role successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to change the group member role
  }
});

V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
  @Override
  public void onGrantAdministrator(String groupID, V2TIMGroupMemberInfo opUser,
  List<V2TIMGroupMemberInfo> memberList) {
      // A group member was set as the admin.
  }

  @Override
  public void onRevokeAdministrator(String groupID, V2TIMGroupMemberInfo opUser,
  List<V2TIMGroupMemberInfo> memberList) {
      // A group member was unset as the admin.
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.setGroupMemberRole(groupID: "groupA", memberUserID: "user1", newRole: .V2TIM_GROUP_MEMBER_ROLE_ADMIN) {
    print( "setGroupMemberRole succ")
} fail: { code, desc in
    print( "setGroupMemberRole fail, \(code), \(desc)")
}
V2TIMManager.shared.addGroupListener(listener: self)

func onGrantAdministrator(groupID: String, opUser: V2TIMGroupMemberInfo, memberList: Array<V2TIMGroupMemberInfo>) {
        print( "groupID:\(groupID), opUser:\(opUser), memberList:\(memberList)")
    }
    
func onRevokeAdministrator(groupID: String, opUser: V2TIMGroupMemberInfo, memberList: Array<V2TIMGroupMemberInfo>) {
    print( "groupID:\(groupID), opUser:\(opUser), memberList:\(memberList)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] setGroupMemberRole:@"groupA" member:@"user1" newRole:V2TIM_GROUP_MEMBER_ROLE_ADMIN succ:^{
    // Changed the group member role successfully
} fail:^(int code, NSString *desc) {
    // Failed to change the group member role
}];

[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onGrantAdministrator:(NSString *)groupID opUser:(V2TIMGroupMemberInfo *)opUser memberList:(NSArray <V2TIMGroupMemberInfo *> *)memberList {
    // A group member was set as the admin.
}

- (void)onRevokeAdministrator:(NSString *)groupID opUser:(V2TIMGroupMemberInfo *)opUser memberList:(NSArray <V2TIMGroupMemberInfo *> *)memberList {
    // A group member was unset as the admin.
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

V2TIMString groupID = "groupA";
V2TIMString userID = "userB";
uint32_t role = V2TIMGroupMemberRole::V2TIM_GROUP_MEMBER_ROLE_ADMIN;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Changed the group member role successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to change the group member role
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SetGroupMemberRole(groupID, userID, role, callback);

// Listen for setting a user as the admin
class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnGrantAdministrator(const V2TIMString& groupID, const V2TIMGroupMemberInfo& opUser,
                              const V2TIMGroupMemberInfoVector& memberList) override {
        // A group member was set as the admin.
    }
    void OnRevokeAdministrator(const V2TIMString& groupID, const V2TIMGroupMemberInfo& opUser,
                               const V2TIMGroupMemberInfoVector& memberList) override {
        // A group member was unset as the admin.
    }
    // Other members …
};
// Add a group event listener. Keep `groupListener` valid before the listener is removed to ensure event callbacks are received.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

## Transferring Group Ownership

The group owner can call `transferGroupOwner` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ac16d66c8e293c2ee95c7b673e5ad80c4) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.transfergroupowner(groupid:memberuserid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a58a2ffae60505a43984fe21bf0bc1101) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a2fedff98e2e41e9d30f7a49f5c7adc8f)) to transfer the ownership of a group to another group member.

After the group ownership is transferred, all the group members will receive the `onGroupInfoChanged` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html#ac3a88ea430c6dc35845472ed98ad049b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupListener.html#v2timgrouplistener.ongroupinfochanged(groupid:changeinfolist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html#abbe2208a234d77364bff697eea503d27) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html#a37aa57b23295e6b295413fafba2eda07)). Here, the `type` of `V2TIMGroupChangeInfo` is `V2TIMGroupChangeInfo.V2TIM_GROUP_INFO_CHANGE_TYPE_OWNER`, and the value is the `UserID` of the new group owner.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().transferGroupOwner("groupA", "userB", new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Transferred the group ownership successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to transfer the group ownership
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.transferGroupOwner(groupID: "groupA", memberUserID: "user1") {
    print( "transferGroupOwner succ")
} fail: { code, desc in
    print( "transferGroupOwner fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] transferGroupOwner:@"groupA" member:@"user1" succ:^{
    // Transferred the group ownership successfully
} fail:^(int code, NSString *desc) {
    // Failed to transfer the group ownership
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
V2TIMString userID = "userB";

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Transferred the group ownership successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to transfer the group ownership
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->TransferGroupOwner(groupID, userID, callback);
```

## Getting the Number of Online Group Members

Call `getGroupOnlineMemberCount` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a56840105a4b3371eeab2046d8c300bce) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgrouponlinemembercount(groupid:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#ada2eadb44f6865e9848df94fb5bae4ae) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7633181ee22e54741600908ed45b3138)) to get the number of online group members.

> **Note**
> 1. This API is only supported in audio-video groups (AVChatRoom) before IMSDK 7.3 version.
> 2. You can call this API for all kinds of groups in IMSDK 7.3 and later versions.
> 3. For Work, Public, Meeting, or Community group types, this feature is disabled by default and available only for [Pro edition, Pro edition Plus, or Enterprise edition](https://console.trtc.io/subscription/buy/chat) customers. Log in to the [Chat Console](https://console.trtc.io) **> Chat > Configuration >** [**Groups**](https://console.trtc.io/chat/login-message), then enable **Group Member Online Status**.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().getGroupOnlineMemberCount("group_avchatroom", new V2TIMValueCallback<Integer>() {
  @Override
  public void onSuccess(Integer integer) {
      // Obtained the number of online members in the audio-video group (AVChatRoom) successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to obtain the number of online members in the audio-video group (AVChatRoom)
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getGroupOnlineMemberCount(groupID: "group_avchatroom") { count in
    print( "getGroupOnlineMemberCount succ, \(count)")
} fail: { code, desc in
    print( "getGroupOnlineMemberCount fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getGroupOnlineMemberCount:@"group_avchatroom" succ:^(NSInteger count) {
    // Obtained the number of online members in the audio-video group (AVChatRoom) successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the number of online members in the audio-video group (AVChatRoom)
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

V2TIMString groupID = "group_avchatroom";

auto callback = new ValueCallback<uint32_t>{};
callback->SetCallback(
    [=](const uint32_t& count) {
        // Obtained the number of online members in the audio-video group (AVChatRoom) successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the number of online members in the audio-video group (AVChatRoom)
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetGroupOnlineMemberCount(groupID, callback);
```

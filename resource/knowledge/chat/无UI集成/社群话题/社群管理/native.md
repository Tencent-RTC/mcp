---
sync_node_id: '108053288090902528'
nav_path:
  - "无 UI 集成"
  - "社群话题"
  - "社群管理"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

A community group is a large group of people brought together by common topics, and multiple topics can be created under the same community group based on different interests.
Communities are used to manage group members. All topics under the same community are shared among members, who can send and receive messages within each topic independently.
- Community and topic management APIs are in the `V2TIMGroupManager(Java)` / `V2TIMManager+Group(Objective-C、Swift)` core class.

- APIs related to messages in topics are in the `V2TIMMessageManager(Java)` / `V2TIMManager+Message(Objective-C、Swift)` core class.

   > **Note:**
   > 
   > - Supported by versions 6.2.2363 and later, using the V2TIMCommunityManager and V2TIMCommunityListener classes is recommended starting from version 7.7.5282.
   > - You must [purchase the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat), log in to the [Console](https://console.trtc.io/), and enable the community switch before you can use this feature, toggle path: Applications > Your App > Chat > Configuration > Group Configuration > Community.

## Effect

## Community Group Management

### Creating a community group

Call `createCommunity` ([Java](https://im.sdk.qcloud.com/doc/zh-cn/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#acde81364ecec194dfa20720f670d8537) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.createcommunity(info:memberlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/zh-cn/categoryV2TIMManager_07Community_08.html#afeb826964ea5882c5077bda33b8a5853) / [Windows](https://im.sdk.qcloud.com/doc/zh-cn/classV2TIMCommunityManager.html#a2187c4820a711feecfe20bf4fe141e7f)) to create a topic-supporting community.

> **Note:**
> The custom community ID prefix must be @TGS#_. (Note: Highlighted content)
> 

Below is the sample code:

【Java】
``` java
V2TIMGroupInfo v2TIMGroupInfo = new V2TIMGroupInfo();
v2TIMGroupInfo.setGroupName("This is a Community");
v2TIMGroupInfo.setGroupType(V2TIMManager.GROUP_TYPE_COMMUNITY);
V2TIMManager.getCommunityManager().createCommunity(v2TIMGroupInfo, null, new V2TIMValueCallback<String>() {
  @Override
  public void onSuccess(String groupID) {
      // Community group created successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Creation failed
  }
});
```

【Swift】
``` swift
let groupInfo = V2TIMGroupInfo()
groupInfo.groupType = "Community"
groupInfo.groupName = "CommunityForTestPermissionGroupSwift"
groupInfo.defaultPermissions = 13;
groupInfo.enablePermissionGroup = true;

V2TIMManager.shared.createGroup(info: groupInfo, memberList: nil) { groupID in
    print( "createPermissionGroupInCommunity succ, \(groupID)")
} fail: { code, desc in
    print( "createPermissionGroupInCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMGroupInfo *groupInfo = [[V2TIMGroupInfo alloc] init];;
groupInfo.groupName = @"This is a Community";
groupInfo.groupType = GroupType_Community;
[[V2TIMManager sharedInstance] createCommunity:groupInfo memberList:nil succ:^(NSString *groupID) {
    // Community group created successfully
} fail:^(int code, NSString *desc) {
    // Creation failed
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

V2TIMGroupInfo info;
info.groupType = "Community";
info.groupName = "This is a Community";

auto callback = new ValueCallback<V2TIMString>{};
callback->SetCallback(
    [=](const V2TIMString& groupID) {
        // Community group created successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Creation failed
        delete callback;
    });

V2TIMManager::GetInstance()->GetCommunityManager()->CreateCommunity(info, {}, callback);
```

### Getting the List of Community Groups Joined

You can call the `getJoinedCommunityList`([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#acb37b83f357fc7ee04905f8bcd5a5c67) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.getjoinedcommunitylist(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a17350dec83b7cd32d308a1f2b2827fdd) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#af131f5f9aa08f7ba81fd9b5632e60e0d)) API to get the list of topic supporting communities that you have joined.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().getJoinedCommunityList(new V2TIMValueCallback<List<V2TIMGroupInfo>>() {
  @Override
  public void onSuccess(List<V2TIMGroupInfo> v2TIMGroupInfos) {
      // Community group list got successfully
  }
  @Override
  public void onError(int code, String desc) {
      // Failed to get the community group list
  }
});

```

【Swift】
``` swift
V2TIMManager.shared.getJoinedCommunityList { groupList in
    groupList.forEach { item in
        print( item.description)
    }
} fail: { code, desc in
    print( "getJoinedCommunityList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getJoinedCommunityList:^(NSArray<V2TIMGroupInfo *> *groupList) {
    // Community group list got successfully
} fail:^(int code, NSString *desc) {
    // Failed to get the community group list
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

auto callback = new ValueCallback<V2TIMGroupInfoVector>{};
callback->SetCallback(
    [=](const V2TIMGroupInfoVector& groupInfoList) {
        // Community group list obtained successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to get the community group list
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetJoinedCommunityList(callback);
```

### Other Management APIs

Other features can be used in the same way as an ordinary group feature and involve the following APIs:
| Category | Feature | API |
| --- | --- | --- |
| Community group management | <a href="https://www.tencentcloud.com/document/product/1047/48466#joining-a-group">Joining a Group</a> | joinGroup (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#ad64a09bea508672d6d5a402b3455b564">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.joingroup(groupid:msg:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a4762156b7a98489eb4715de53028e12a">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#adf3dc4604f30fde1d34dceb1990b38fe">C++</a>) |
| <a href="https://www.tencentcloud.com/document/product/1047/48466#leaving-a-group">Leaving a Group</a> | quitGroup (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a6d140dbeb44906de9cb69f69c2ce5919">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.quitgroup(groupid:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac2a43b3ada447131df0c5f19e8079be5">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a43ef277f0eb49d6087d140a09152eced">C++</a>) |  |
| <a href="https://www.tencentcloud.com/document/product/1047/48466#disbanding-groups">Disbanding a Group</a> | dismissGroup (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#afd0221c0c842a6dcfa0acc657e50caeb">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.dismissgroup(groupid:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a5bd55cb04867985253949d8cc78f860e">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#abfa30c09968c3b6d07c31d8d5a741502">C++</a>) |  |
| <a href="https://www.tencentcloud.com/document/product/1047/48185#getting-the-group-profile">Getting the Group Profile</a> | getGroupsInfo (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ada614335043d548c11f121500e279154">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupsinfo(groupidlist:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a9bca7e5318cfed44335566a783a6b568">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a8c98b92b45c3a2c4e57901e6c4cd3435">C++</a>) |  |
| <a href="https://www.tencentcloud.com/document/product/1047/48185#modifying-group-profiles">Modifying the Group Profile</a> | setGroupInfo (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#ad4ceef92975fa00c4a5dddc8f7e1edcf">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.setgroupinfo(info:succ:fail:)">Swift</a> /  <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#aa9519a479493e56d7920e40aba796144">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a10785c46e166879250c2c2ba2001b354">C++</a>) |  |
| Community group member management | <a href="https://www.tencentcloud.com/document/product/1047/48181#getting-the-group-member-list">Getting the Group Member List</a> | getGroupMemberList (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a69fc0831aacaa0585c1855f4c91320be">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupmemberlist(groupid:filter:nextseq:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a98681b9036e73acbe8f84737b5291326">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#ade696bf03f06de9cdfb534570de35254">C++</a>) |
| <a href="https://www.tencentcloud.com/document/product/1047/48178#getting-the-profile-of-group-members">Getting the Profile of a Group Member</a> | getGroupMembersInfo (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#adb08e1c4fa9aff407c7b2678757f66d5">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.getgroupmembersinfo(groupid:memberlist:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a1ab284b80811bcc697d689d7b97edf04">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a6db2fcfd78bbd71003ae31584c88c672">C++</a>) |  |
| <a href="https://www.tencentcloud.com/document/product/1047/48178#modifying-group-member-profiles">Modifying the Profile of a Group Member</a> | setGroupMemberInfo (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a6f1cf8ede41348b4cd7b63b8e4caa77b">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.setgroupmemberinfo(groupid:info:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a40b97ee4b138f93e1b2073d1bdff3756">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#acd0e222e4c3d5997666aaf4126bd974e">C++</a>) |  |
| <a href="https://www.tencentcloud.com/document/product/1047/48181#removing-group-members">Removing a Group Member</a> | kickGroupMember (<a href="https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a6da6755c6e0c46e96cb02575074a5333">Java</a> / <a href="https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Group.html#v2timmanager.kickgroupmember(groupid:memberlist:reason:duration:succ:fail:)">Swift</a> / <a href="https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a0581f28fddf2ade890aa62e4318d7a97">Objective-C</a> / <a href="https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aca94e51e879a7fadbca24a0a991727d1">C++</a>) |  |

## Topic Management

Multiple topics can be created under the same community group. All the topics are shared among group members, who can send and receive messages within each topic independently.

> **Note:**
> Log in to [Console](https://console.trtc.io/) and enable the Community Switch to use this feature. Toggle path: Applications > Your App > Chat > Configuration > Group Configuration > Community.
> 

### Creating a Topic

You need to perform two steps to create a topic:
1. Create the `V2TIMTopicInfo` object ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMTopicInfo.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMTopicInfo.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMTopicInfo.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMTopicInfo.html)).

2. Call the `createTopicInCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a52eed1b07ad64a3aa3d3561d8cd147f0)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.createtopicincommunity(groupid:topicinfo:succ:fail:)) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a8cc04d04254867787060cf1cae0fc5b8) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a4461759ad1c51eae318dfe5d478575c9)) API to create a topic.

   > **Note:**
   > 
   > - The custom topic ID consists of: GroupId+@TOPIC#_+custom part. For example, if the community ID is @TGS#_123 and the custom part is TestTopic, then the topic ID is @TGS#_123@TOPIC#_TestTopic.
   > - Starting from version 8.4, the interface supports the creation of "private topics" (set the topicType of V2TIMTopicInfo to "Private"). "Private topics" has its own member list (supports up to 10,000 members), community members need to join the topic before sending message (you need to buy Enterprise Edition to use this feature).

   Sample code:

   

【Java】
``` java
V2TIMTopicInfo topicInfo = new V2TIMTopicInfo();
// Topic type, "Public": public topic; "Private": private topic
topicInfo.setTopicType(topicType);
topicInfo.setTopicName(topicName);
topicInfo.setTopicFaceUrl(topicFaceUrl);
topicInfo.setIntroduction(topicIntroduction);
topicInfo.setNotification(topicNotification);
topicInfo.setCustomString(topicCustomString);
// The following fields are only valid for private topics
topicInfo.setTopicAddOpt(V2TIMTopicInfo.V2TIM_TOPIC_ADD_AUTH);
topicInfo.setTopicApproveOpt(V2TIMTopicInfo.V2TIM_TOPIC_ADD_AUTH);
topicInfo.setMemberMaxCount(10000);
List<V2TIMCreateGroupMemberInfo> memberList = new ArrayList<>();
V2TIMCreateGroupMemberInfo memberInfo =  new V2TIMCreateGroupMemberInfo();
memberInfo.setUserID("xixi");
memberInfo.setRole(1);
memberList.add(memberInfo);
topicInfo.setMemberList(memberList);

// groupID fill in the community ID that supports the topic
V2TIMManager.getCommunityManager().createTopicInCommunity(groupID, topicInfo, new V2TIMValueCallback<String>() {
  @Override
  public void onSuccess(String topicID) {
      // create topic succ
  }

  @Override
  public void onError(int code, String desc) {
      // create topic succ
  }
});
```

【Swift】
``` swift
let topicInfo = V2TIMTopicInfo()
// Topic type, "Public": public topic; "Private": private topic
topicInfo.topicType = "Public"
topicInfo.topicName = "swift topic name"
topicInfo.topicFaceURL = "topicFaceUrl"
topicInfo.introduction = "topicIntroduction"
topicInfo.notification = "topicNotification"
topicInfo.customString = "topicCustomString"
// The following fields are only valid for private topics
topicInfo.topicAddOpt = .V2TIM_GROUP_ADD_AUTH
topicInfo.topicApproveOpt = .V2TIM_GROUP_ADD_AUTH
topicInfo.memberMaxCount = 10000
let memberInfo =  V2TIMCreateGroupMemberInfo()
memberInfo.userID = "xixi"
memberInfo.role = 1
topicInfo.memberList.append(memberInfo)

V2TIMManager.shared.createTopicInCommunity(groupID: "groupID", topicInfo: topicInfo) { topicID in
    print( "createTopicInCommunity succ, \(topicID)")
} fail: { code, desc in
    print( "createTopicInCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMTopicInfo *topicInfo = [[V2TIMTopicInfo alloc] init];
// Topic type, "Public": public topic; "Private": private topic
topicInfo.topicType = @"Public";
topicInfo.topicName = @"topicName";
topicInfo.topicFaceURL = @"topicFaceUrl";
topicInfo.introduction = @"topicIntroduction";
topicInfo.notification = @"topicNotification";
topicInfo.customString = @"topicCustomString";
// The following fields are only valid for private topics
topicInfo.topicAddOpt = V2TIM_GROUP_ADD_AUTH;
topicInfo.topicApproveOpt = V2TIM_GROUP_ADD_AUTH;
topicInfo.memberMaxCount = 10000;
V2TIMCreateGroupMemberInfo *memberInfo = [[V2TIMCreateGroupMemberInfo alloc] init];
memberInfo.userID = @"xixi";
memberInfo.role = V2TIM_GROUP_MEMBER_ROLE_MEMBER;
topicInfo.memberList = @[memberInfo];

// groupID fill in the community ID that supports the topic
[[V2TIMManager sharedInstance] createTopicInCommunity:@"groupID" topicInfo:topicInfo succ:^(NSString *topicID) {
    // create topic succ
} fail:^(int code, NSString *desc) {
    // create topic failed
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

V2TIMTopicInfo topicInfo;
// Topic type, "Public": public topic; "Private": private topic
topicInfo.topicType = "Public";
topicInfo.topicID = "topicID";
topicInfo.topicName = "topicName";
topicInfo.topicFaceURL = "topicFaceURL";
topicInfo.introduction = "introduction";
topicInfo.notification = "notification";
// groupID fill in the community ID that supports the topic
topicInfo.topicAddOpt = V2TIM_GROUP_ADD_AUTH;
topicInfo.topicApproveOpt = V2TIM_GROUP_ADD_AUTH;
topicInfo.memberMaxCount = 20;
V2TIMCreateGroupMemberInfo member;
member.userID = "xixi";
member.role = V2TIM_GROUP_MEMBER_ROLE_MEMBER;
V2TIMCreateGroupMemberInfoVector member_list;
member_list.PushBack(member);
topicInfo.memberlist = member_list;

auto callback = new ValueCallback<V2TIMString>{};
callback->SetCallback(
    [=](const V2TIMString& string) {
        // create topic succ
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // create topic failed
        delete callback;
    });

// groupID fill in the community ID that supports the topic
V2TIMManager::GetInstance()->GetCommunityManager()->CreateTopicInCommunity("groupID", topicInfo, callback);
```

### Deleting a Topic

You can call the `deleteTopicFromCommunity`([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a77c4502346e800e43c22a0f15138d699) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.deletetopicfromcommunity(groupid:topicidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a31b726136637a58b5bb246eaac41187c) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#aadbe5002f65d5202da3b1b4e6180264d)) API to delete a topic.

Sample code:

【Java】
``` java
V2TIMManager.getGroupManager().deleteTopicFromCommunity(groupID, topicIDList, new V2TIMValueCallback<List<V2TIMTopicOperationResult>>() {
  @Override
  public void onSuccess(List<V2TIMTopicOperationResult> v2TIMTopicOperationResults) {
      // Topic deleted successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to delete the topic
  }
});

```

【Swift】
``` swift
V2TIMManager.shared.deleteTopicFromCommunity(groupID: "groupID", topicIDList: ["topic1","topic2"]) { resultList in
    resultList.forEach { item in
        // V2TIMTopicOperationResult
        print( item.description)
    }
} fail: { code, desc in
    print( "deleteTopicFromCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] deleteTopicFromCommunity:@"groupID" topicIDList:@[@"topic1", @"topic2"] succ:^(NSMutableArray<V2TIMTopicOperationResult *> *resultList) {
    // Topic deleted successfully
} fail:^(int code, NSString *desc) {
    // Failed to delete the topic
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMStringVector topicIDList;
topicIDList.PushBack("topic1");
topicIDList.PushBack("topic2");

auto callback = new ValueCallback<V2TIMTopicOperationResultVector>{};
callback->SetCallback(
    [=](const V2TIMTopicOperationResultVector& topicOperationResultList) {
        // Topic deleted successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to delete the topic
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->DeleteTopicFromCommunity("groupID", topicIDList, callback);
```

### Modifying Topic Information

You need to perform two steps to modify the information of a topic:
1. Create the `V2TIMTopicInfo` object ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMTopicInfo.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMTopicInfo.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMTopicInfo.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMTopicInfo.html)) and set the fields to be modified.

2. Call the `setTopicInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#acaff2edad6eb208478be9ab06d30035d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.settopicinfo(topicinfo:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#a237e2fa6e16e55143c516c5428a23936) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a128f08ef6e675d7c8fc96a5d124e59af)) API to modify topic information.

   Sample code:

   

【Java】
``` java
V2TIMTopicInfo topicInfo = new V2TIMTopicInfo();
topicInfo.setTopicID(topicID);
topicInfo.setTopicName(topicName);
topicInfo.setTopicFaceUrl(topicFaceUrl);
topicInfo.setIntroduction(topicIntroduction);
topicInfo.setNotification(topicNotification);
topicInfo.setCustomString(topicCustomString);
topicInfo.setDraft(topicDraft);
topicInfo.setAllMute(false);
V2TIMManager.getGroupManager().setTopicInfo(topicInfo, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Topic information modified successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to modify the topic information
  }
});

```

【Swift】
``` swift
let topicInfo = V2TIMTopicInfo()
topicInfo.topicID = "topicID"
topicInfo.topicName = "swift topic name"
topicInfo.topicFaceURL = "topicFaceUrl"
topicInfo.introduction = "topicIntroduction"
topicInfo.notification = "topicNotification"
topicInfo.customString = "topicCustomString"
topicInfo.draftText =  "topicDraft"

V2TIMManager.shared.setTopicInfo(topicInfo: topicInfo) {
    print( "setTopicInfo succ, \(topicInfo.description)")
} fail: { code, desc in
    print( "setTopicInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMTopicInfo *topicInfo = [[V2TIMTopicInfo alloc] init];
topicInfo.topicID = @"topicID";
topicInfo.topicName = @"topicName";
topicInfo.topicFaceURL = @"topicFaceUrl";
topicInfo.introduction = @"topicIntroduction";
topicInfo.notification = @"topicNotification";
topicInfo.customString = @"topicCustomString";
topicInfo.draftText =  @"topicDraft";
topicInfo.isAllMuted = NO;
[[V2TIMManager sharedInstance] setTopicInfo:topicInfo succ:^{
    // Topic information modified successfully
} fail:^(int code, NSString *desc) {
    // Failed to modify the topic information
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMTopicInfo topicInfo;
topicInfo.topicID = "topicID";
topicInfo.topicName = "topicName";
topicInfo.notification = "topicFaceURL";
topicInfo.introduction = "introduction";
topicInfo.topicFaceURL = "notification";
topicInfo.customString = "customString";
topicInfo.modifyFlag = V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_GROUP_NAME |
                       V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_NOTIFICATION |
                       V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_INTRODUCTION |
                       V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_FACE_URL |
                       V2TIMGroupInfoModifyFlag::V2TIM_TOPIC_INFO_MODIFY_FLAG_CUSTOM_STRING;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Topic information modified successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to modify the topic information
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SetTopicInfo(topicInfo, callback);
```

   For how to modify other information of a topic, see [Muting Member](https://www.tencentcloud.com/document/product/1047/48181#muting-group-members) and [Changing Topic Message Receiving Option](https://www.tencentcloud.com/document/product/1047/48185#setting-the-group-message-receiving-option).

   The message receiving option of a topic can be inherited from the community or not. The interface is `setInheritMessageReceiveOptionFromCommunity`（[Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMTopicInfo.html#a43fccd5774d0d9aabef14e2117b6801f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMTopicInfo.html#v2timtopicinfo.setinheritmessagereceiveoptionfromcommunity(isinherit:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMTopicInfo.html#acb551dd3011d4e7f9f5d7a6a5cc87a2c) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMTopicInfo.html#a8115bb26210ceb955e5de9f051ba81de)）.

   Sample code:

   

【Java】
``` java
V2TIMTopicInfo topicInfo = new V2TIMTopicInfo();
topicInfo.setTopicID(topicID);
topicInfo.setInheritMessageReceiveOptionFromCommunity(true, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // success
    }

    @Override
    public void onError(int code, String desc) {
        // failed
    }
});

```

【Swift】
``` swift
let topicInfo = V2TIMTopicInfo()
topicInfo.topicID = "@TGS#_@TGS#cIIYRJIM62C6@TOPIC#_@TOPIC#cKIYRJIM62CD"
topicInfo.setInheritMessageReceiveOptionFromCommunity(isInherit: true) {
    print( "enableTopitInheritMsgFlagFromCommunity success")
} fail: { code, desc in
    print( "enableTopitInheritMsgFlagFromCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMTopicInfo *topicInfo = [[V2TIMTopicInfo alloc] init];
topicInfo.topicID = @"topicID";
[topicInfo setInheritMessageReceiveOptionFromCommunity:YES succ:^{
    // success
} fail:^(int code, NSString *desc) {
    // failed
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

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // success
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // failed
        delete callback;
    });

V2TIMTopicInfo topicInfo;
topicInfo.topicID = "topicID";
topicInfo.SetInheritMessageReceiveOptionFromCommunity(true, callback);
```

### Getting the Topic List

You can call the `getTopicInfoList` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupManager.html#a5d2b18a76cff650cb9bb2abf2ef07306) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.gettopicinfolist(groupid:topicidlist:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Group_08.html#af93ad10e0e2b21d6ae3c8ec45021b159) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupManager.html#a7b2ffb5e2e526b7d30b2c8741380d0ac)) API to get the topic list.
- If `topicIDList` is empty, the list of all topics of the community group will be got.

- If `topicIDList` is the ID of specified topics, the list of the specified topics will be got.

   Sample code:

   

【Java】
``` java
V2TIMManager.getGroupManager().getTopicInfoList(groupID, topicIDList, new V2TIMValueCallback<List<V2TIMTopicInfoResult>>() {
  @Override
  public void onSuccess(List<V2TIMTopicInfoResult> v2TIMTopicInfoResults) {
        // Topic list obtained successfully
  }

  @Override
  public void onError(int code, String desc) {
        // Failed to obtain the topic list
  }
});
```

【Swift】
``` swift
V2TIMManager.shared.getTopicInfoList(groupID: "groupID", topicIDList: ["topic1","topic2"]) { resultList in
    resultList.forEach { item in
        // V2TIMTopicInfoResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getTopicInfoList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getTopicInfoList:@"groupID" topicIDList:@[@"topic1", @"topic2"] succ:^(NSMutableArray<V2TIMTopicInfoResult *> *resultList) {
    // Topic list obtained successfully
} fail:^(int code, NSString *desc) {
    // Failed to obtain the topic list
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMStringVector topicIDList;
topicIDList.PushBack("topic1");
topicIDList.PushBack("topic2");

auto callback = new ValueCallback<V2TIMTopicInfoResultVector>{};
callback->SetCallback(
    [=](const V2TIMTopicInfoResultVector& topicInfoResultList) {
        // Topic list obtained successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to obtain the topic list
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->GetTopicInfoList("groupID", topicIDList, callback);
```

### Topic Group

The community-**group**-topic hierarchy is implemented as follows:
The `customInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupInfo.html#a56511a5bcd9efbf2853ee71c47eac2f4) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupInfo.html#v2timgroupinfo.custominfo) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupInfo.html#a47c0485212c1952ab2bafaa5421e3529) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMUserFullInfo.html#a9c8d19de15a107b7a6d18f63b28f9609)) in the community profile defines a field to store the topic group list of the community. The `customString` field ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMTopicInfo.html#aad0cc8249c21c5ccae385fdfb8ba32ea)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMTopicInfo.html#v2timtopicinfo.customstring) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMTopicInfo.html#a28b1153ccc4a0bd7b3123ea05d0e1c3e) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMTopicInfo.html#a969217a3f928638622a2cb829e8c6b79)) in the topic profile stores the topic group.
- When a community is loaded, the `customInfo` field for the topic group list in the community (group) profile is used to display the group list.

- When the topic list of a community is loaded, the `customString` in the topic profile is used to get the group name for assignment.

   > **Note:**
   > 
   > You can customize the `key` value of the `customInfo` field for the topic group list of the community (group). The following sample code names it `topic_category`.
   > 

#### Configuring the Group List for the Community

You just need to modify the `customInfo` in `groupInfo`. Here is a `Map`, and the `key` value is the name of the field for the topic group list you defined.

Sample code:

【Java】
``` java
List<String> categoryList = new ArrayList<>();
categoryList.add("Group 1");
categoryList.add("Group 2");
byte[] categoriesByteArray = gson.toJson(categoryList).getBytes();

Map<String, byte[]> customMap = new HashMap<>();
// You need to configure the custom group field `topic_category` in the console first.
customMap.put("topic_category", categoriesByteArray);

V2TIMGroupInfo modifyInfo = new V2TIMGroupInfo();
modifyInfo.setGroupID(groupID);
modifyInfo.setCustomInfo(customMap);
V2TIMManager.getGroupManager().setGroupInfo(modifyInfo, new V2TIMCallback() {
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
let info = V2TIMGroupMemberFullInfo()
info.userID = "userA"
info.nameCard = "userA_namecard"
info.customInfo = ["topic_category": "value1".data(using: .utf8) ?? Data()]
V2TIMManager.shared.setGroupMemberInfo(groupID: "groupID", info: info) {
    print( info.description)
} fail: { code, desc in
    print( "setGroupMemberInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSArray *categoryList = @[@"Group 1", @"Group 2"];
NSError *error = nil;
NSData *data = [NSJSONSerialization dataWithJSONObject:categoryList
                                                options:NSJSONWritingPrettyPrinted
                                                  error:&error];
if ([data length] > 0 && error == nil) {
    // You need to configure the custom group field `topic_category` in the console first.
    NSDictionary *customInfo = @{@"topic_category": data};

    V2TIMGroupInfo *info = [[V2TIMGroupInfo alloc] init];
    info.groupID = @"Group ID of the group to be modified";
    info.customInfo = customInfo;
    [[V2TIMManager sharedInstance] setGroupInfo:info
                                            succ:^{
        // Modified the group profile successfully
    } fail:^(int code, NSString *desc) {
        // Failed to modify the group profile
    }];
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMGroupInfo info;
info.groupID = "groupA";

V2TIMCustomInfo customInfo;
std::string str{u8"[\"Group 1\", \"Group 2\"]"};
// You need to configure the custom group field `topic_category` in the console first.
customInfo.Insert("topic_category", {reinterpret_cast<const uint8_t*>(str.data()), str.size()});
info.modifyFlag = V2TIMGroupInfoModifyFlag::V2TIM_GROUP_INFO_MODIFY_FLAG_CUSTOM_INFO;

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

#### Getting the List of Groups in the Community

Sample code:

【Java】
``` java
String groupID = "group1";
List<String> groupIDList = new ArrayList<>();
groupIDList.add(groupID);
V2TIMManager.getGroupManager().getGroupsInfo(groupIDList, new V2TIMValueCallback<List<V2TIMGroupInfoResult>>() {
    @Override
    public void onSuccess(List<V2TIMGroupInfoResult> v2TIMGroupInfos) {
        if (v2TIMGroupInfos.size() == 0) {
            return;
        }
        V2TIMGroupInfoResult v2TIMGroupInfoResult = v2TIMGroupInfos.get(0);
        if (v2TIMGroupInfoResult.getResultCode() == BaseConstants.ERR_SUCC) {
            byte[] topicCategoryBytes = v2TIMGroupInfoResult.getGroupInfo().getCustomInfo().get("topic_category");
            List<String> topicCategories = null;
            if (topicCategoryBytes != null) {
                Gson gson = new Gson();
                try {
                    // Parse the group list
                    topicCategories = gson.fromJson(new String(topicCategoryBytes), List.class);
                } catch (JsonParseException e) {
                }
            }
        }
    }

    @Override
    public void onError(int code, String desc) {

    }
});
```

【Swift】
``` swift
let groupIDList = ["group1"]

V2TIMManager.shared.getGroupsInfo(groupIDList: groupIDList, succ: { groupResultList in
    if groupResultList.isEmpty {
        return
    }
    
    let result = groupResultList.first!
    if result.resultCode != 0 {
        return
    }
    
    guard let categoryData = result.info?.customInfo?["topic_category"] as? Data else {
        return
    }
    
    var categoryList: [Any]?
    do {
        let jsonObject = try JSONSerialization.jsonObject(with: categoryData, options: .allowFragments)
        // Parse the group list
        if let jsonArray = jsonObject as? [Any] {
            categoryList = jsonArray
        }
    } catch {

    }
}, fail: { code, desc in

})
```

【Objective-C】
``` objectivec
NSArray *groupIDList = @[@"group1"];
[[V2TIMManager sharedInstance] getGroupsInfo:groupIDList
                                        succ:^(NSArray<V2TIMGroupInfoResult *> *groupResultList) {
    // Conversation profile obtained successfully
    if (groupResultList.count == 0) {
        return;
    }
    V2TIMGroupInfoResult *result = groupResultList.firstObject;
    if (result.resultCode != 0) {
        return;
    }
    NSData *categoryData = result.info.customInfo[@"topic_category"];
    if (categoryData == nil) {
        return;
    }
    NSArray *categoryList;
    NSError *error = nil;
    id jsonObject = [NSJSONSerialization JSONObjectWithData:categoryData
                                                    options:NSJSONReadingAllowFragments
                                                      error:nil];
    if (jsonObject != nil && error == nil) {
        // Parse the group list
        categoryList = (NSArray *)jsonObject;
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
    void OnError(int error_code, const V2TIMString &error_message) override {
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
        if (groupInfoResultList.Size() == 1) {
            const V2TIMGroupInfoResult& groupInfoResult = groupInfoResultList[0];
            if (groupInfoResult.resultCode == 0) {
                V2TIMGroupInfo info = groupInfoResult.info;
                V2TIMCustomInfo customInfo = info.customInfo;
                if (customInfo.Count("topic_category")) {
                    const V2TIMBuffer& topicCategory = customInfo.Get("topic_category");
                    // Parse the group list
                }
            }
        }

        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to get the community group list
        delete callback;
    });
V2TIMManager::GetInstance()->GetGroupManager()->GetGroupsInfo(groupIDList, callback);
```

#### Adding a Topic to a Group

You can save the topic group with the `customString` field of the topic.

Sample code:

【Java】
``` java
Map<String, Object> map = new HashMap<>();
map.put("category", "Group 1");
Gson gson = new Gson();
V2TIMTopicInfo topicInfo = new V2TIMTopicInfo();
topicInfo.setTopicID(topicID);
topicInfo.setCustomString(gson.toJson(map));
V2TIMManager.getGroupManager().setTopicInfo(topicInfo, new V2TIMCallback() {
  @Override
  public void onSuccess() {
      // Topic information modified successfully
  }

  @Override
  public void onError(int code, String desc) {
      // Failed to modify the topic information
  }
});

```

【Swift】
``` swift
let topicInfo = V2TIMTopicInfo()
topicInfo.topicID = "topicID"
topicInfo.topicName = "topicName swift"
topicInfo.customString = "customString"
V2TIMManager.shared.setTopicInfo(topicInfo: topicInfo) {
    print( "setTopicInfo succ, \(topicInfo.description)")
} fail: { code, desc in
    print( "setTopicInfo fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSDictionary *dict = @{@"category": @"Group 1"};
NSError *error = nil;
NSData *data = [NSJSONSerialization dataWithJSONObject:dict
                                               options:0
                                                 error:&error];
if ([data length] > 0 && error == nil) {
    NSString *dataStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    V2TIMTopicInfo *info = [[V2TIMTopicInfo alloc] init];
    info.topicID = @"ID of the topic to be set";
    info.customString = dataStr;
    [[V2TIMManager sharedInstance] setTopicInfo:info succ:^{
      // Set the topic profile successfully
    } fail:^(int code, NSString *desc) {
      // Failed to set the topic profile
    }];
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
    void OnError(int error_code, const V2TIMString &error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMTopicInfo topicInfo;
topicInfo.topicID = "topicID";
topicInfo.customString = u8"{\"category\": \"Group 1\"}}";
topicInfo.modifyFlag = V2TIMGroupInfoModifyFlag::V2TIM_TOPIC_INFO_MODIFY_FLAG_CUSTOM_STRING;

auto callback = new Callback;
callback->SetCallback(
    [=]() {
        // Topic information modified successfully
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Failed to modify the topic information
        delete callback;
    });

V2TIMManager::GetInstance()->GetGroupManager()->SetTopicInfo(topicInfo, callback);
```

#### Getting the Topic Group

Use the `customString` to parse the JSON content after [getting the topic list](#GettingtheTopicList).	

### Listening for Topic Callbacks

In `V2TIMGroupListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupListener.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMCommunityListener.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMGroupListener-p.html) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMGroupListener.html)), topic callback methods such as `onTopicCreated`, `onTopicDeleted`, and `onTopicInfoChanged` are added to listen for topic events. 

Sample code:

【Java】
``` java
V2TIMGroupListener v2TIMGroupListener = new V2TIMGroupListener() {
  @Override
  public void onTopicCreated(String groupID, String topicID) {
      // Listen for topic creation notifications
  }

  @Override
  public void onTopicDeleted(String groupID, List<String> topicIDList) {
      // Listen for topic deletion notifications
  }

  @Override
  public void onTopicInfoChanged(String groupID, V2TIMTopicInfo topicInfo) {
      // Listen for topic information update notifications
  }
};
V2TIMManager.getInstance().addGroupListener(v2TIMGroupListener);
```

【Swift】
``` swift
V2TIMManager.shared.addCommunityListener(listener: self)

func onCreateTopic(groupID: String, topicID: String) {
    print( "groupID:\(groupID), topicID:\(topicID)")
}

func onDeleteTopic(groupID: String, topicIDList: Array<String>) {
    print( "groupID:\(groupID), topicIDList:\(topicIDList)")
}

func onChangeTopicInfo(groupID: String, topicInfo: V2TIMTopicInfo) {
    print( "groupID:\(groupID), topicInfo:\(topicInfo.description), inheritMsgFlag:\(topicInfo.isInheritMessageReceiveOptionFromCommunity())")
}

func onReceiveTopicRESTCustomData(topicID: String, data: Data?) {
    print( "\(topicID), data:\(data?.description ?? "nil")")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onTopicCreated:(NSString *)groupID topicID:(NSString *)topicID {
    // Listen for topic creation notifications
}
- (void)onTopicDeleted:(NSString *)groupID topicIDList:(NSArray<NSString *> *)topicIDList {
    // Listen for topic deletion notifications
}
- (void)onTopicChanged:(NSString *)groupID topicInfo:(V2TIMTopicInfo *)topicInfo {
    // Listen for topic information update notifications
}
```

【C++】
``` cpp
class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;

    void OnTopicCreated(const V2TIMString& groupID, const V2TIMString& topicID) override {
        // Listen for topic creation notifications
    }
    void OnTopicDeleted(const V2TIMString& groupID, const V2TIMStringVector& topicIDList) override {
        // Listen for topic deletion notifications
    }
    void OnTopicChanged(const V2TIMString& groupID, const V2TIMTopicInfo& topicInfo) override {
        // Listen for topic information update notifications
    }
};

// Add a group event listener. Keep `groupListener` valid before the listener is removed to ensure event callbacks are received.
GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

## Topic Messages

Topic messages can be used in the same way as ordinary messages and involve the following APIs:

|Feature|API|Description|
|---------|---------|---------|
|[Sending messages](https://intl.cloud.tencent.com/document/product/1047/47994)|sendMessage ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61))|Set `groupID` to the topic ID.|
|[Receiving messages](https://intl.cloud.tencent.com/document/product/1047/47995)|`onRecvNewMessage` method in V2TIMAdvancedMsgListener ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMAdvancedMsgListener.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMAdvancedMsgListener.html#v2timadvancedmsglistener.onrecvnewmessage(msg:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMAdvancedMsgListener-p.html) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMAdvancedMsgListener.html))|Set `groupID` in the message to the topic ID.|
|[Marking a conversation as read](https://intl.cloud.tencent.com/document/product/1047/48320)|cleanConversationUnreadMessageCount（[Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversationManager.html#a5887d1954d32fad68bc569e6f136770d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Conversation.html#v2timmanager.cleanconversationunreadmessagecount(conversationid:cleantimestamp:cleansequence:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Conversation_08.html#a820c2f598f7554428fb980df3f7357f0) /[C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#abdf09c92dccfb71b58b8a36f42494b8d)）|Set `groupID` to the topic ID.|
|[Getting the message history](https://intl.cloud.tencent.com/document/product/1047/47998)|getGroupHistoryMessageList ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a671e8737fcea0c05dc661c753e5b3597) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.getgrouphistorymessagelist(groupid:count:lastmsg:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a9e242ba327377fe74b83e8d5572d39a0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a4bbdbdd063d5dad2d164059e1f5d7851))|Set `groupID` to the topic ID.|
|[Recalling messages](https://intl.cloud.tencent.com/document/product/1047/48016)|revokeMessage ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#ad0dfce6be749165cd90a9ff67a1308b1) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.revokemessage(msg:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a2ef856a792923811e9d16ed7a101336a) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a3f271fcb935ada0ef05709367638a1a6))|Set `groupID` to the topic ID.|

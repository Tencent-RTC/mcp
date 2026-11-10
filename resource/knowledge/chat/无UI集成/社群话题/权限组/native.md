---
sync_node_id: '139491945559113728'
nav_path:
  - "无 UI 集成"
  - "社群话题"
  - "权限组"
  - "Android&iOS&Windows&Flutter"
product: "chat"
---
## Feature Description

For permission groups, users can define permissions for groups as needed and configure different permissions and members for different permission groups, so that users can manage groups by permissions. Community groups can be managed by permission groups. Management of permission groups is more flexible than that of [admins](https://www.tencentcloud.com/document/product/1047/48181) with fixed roles, making it suitable for communities with many members and topics.

> **Note:**
> - The permission group feature is supported for version 7.8 and later.
> - To use this feature, you need to [purchase the Pro edition 、Pro Plus edition or Enterprise edition](https://trtc.io/buy/chat), log in to the [Console](https://console.trtc.io/), and enable the Community Switch. The switch path is: Applications > Your App > Chat > Configuration > Group Configuration > Community.

- To enable the permission group feature, set `enablePermissionGroup` to `true`. In this case, the permissions of [admins](https://www.tencentcloud.com/document/product/1047/48181) are disabled, making admins equivalent to ordinary group members. Conversely, setting it to `false` deactivates the permission group management feature and restores the permissions of [admins](https://www.tencentcloud.com/document/product/1047/48181).

- Default community permissions defaultPermissions and default topic permissions defaultPermissions are automatically created in the community information `V2TIMGroupInfo` and topic information `V2TIMTopicInfo`, which are effective for all group members **everyone** (excluding the group owner).

- Users can set community permissions `groupPermission` in permission groups `V2TIMPermissionGroupInfo` when creating permission groups, and then change the permissions later. Users can call the addTopicPermissionToPermissionGroup API to add topic permissions `topicPermission` to permission groups. The community permissions and topic permissions of a permission group are valid only for members in the group.

- Permissions are represented by a 64-bit value, with each bit representing a permission. A bit value of 0 indicates that the permission is disabled, while a bit value of 1 indicates that the permission is enabled. The table of bits for community and topic permissions is as follows. For example, if the community permission value of a permission group is set to 5 (101 in binary mode), the members in the permission group have the permissions to modify group information and manage permission group information.

- A group member's permission consists of the default **everyone** permission and the union of permissions from multiple permission groups that the member belongs to. That is, the group member has this permission when it is enabled anywhere.

- The group owner always has all the permissions.

| Category | Source | Description |
| --- | --- | --- |
| Default community permissions | defaultPermissions in the community information <code>V2TIMGroupInfo</code> | - Valid when the permission group feature is enabled<br>- Default permissions of all community members <strong>everyone</strong><br>- Permissions that can be modified by the group owners and members with the permission to modify group information |
| Default topic permissions | defaultPermissions in the topic information <code>V2TIMTopicInfo</code> | - Valid when the permission group feature is enabled<br>- Default permissions of all community members <strong>everyone</strong> in this topic<br>- Permissions that can be modified by the group owners and the members who previously had the topic management permission |
| Community permissions of permission groups | groupPermission of permission groups <code>V2TIMPermissionGroupInfo</code> | - Valid when the permission group feature is enabled<br>- Permissions of members in permission groups<br>- Permissions that can be modified by the group owners and the members with the permission to manage permission group information |
| Topic permissions of permission groups | Call the addTopicPermissionToPermissionGroup API to add <code>topicPermission</code> to permission groups <code>V2TIMPermissionGroupInfo</code> | - Valid when the permission group feature is enabled<br>- Permissions of members in the permission group<br>- Permissions that can be modified by the group owners and the members with the permission to manage permission group information |

   The table of bits for community and topic permissions is as follows:

| Category | Bit | Name | Meaning |
| --- | --- | --- | --- |
| Community permissions | Bit 0 | <code>V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO</code> | Permission to modify group information |
| Bit 1 | <code>V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER</code> | Group member management permission, such as deleting members, approving group joining requests, and modifying member information |  |
| Bit 2 | <code>V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_INFO</code> | Permission to manage permission group information |  |
| 3rd bit | <code>V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_MEMBER</code> | Permission to manage permission group members |  |
| Bit 4 | <code>V2TIM_COMMUNITY_PERMISSION_MANAGE_TOPIC_IN_COMMUNITY</code> | Topic management permissions, such as creating, modifying, and deleting topics |  |
| Bit 5 | <code>V2TIM_COMMUNITY_PERMISSION_MUTE_MEMBER</code> | Permission to mute a certain group member across all topics in a community |  |
| Bit 6 | <code>V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE</code> | Permission for group members to send messages about all topics in a community |  |
| Bit 7 | <code>V2TIM_COMMUNITY_PERMISSION_AT_ALL</code> | Permission to send @all messages about all topics in a community |  |
| Bit 8 | <code>V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE</code> | Permission to retrieve all topics-related historical messages sent before group joining in a community |  |
| Bit 9 | <code>V2TIM_COMMUNITY_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE</code> | Permission to recall others' messages about all topics in a community |  |
| Bit 10 | <code>V2TIM_COMMUNITY_PERMISSION_BAN_MEMBER</code> | Permission to ban community members |  |
| Topic permissions | Bit 0 | <code>V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC</code> | Permission to manage the current topic, including modifying the topic information and deleting the current topic |
| Bit 1 | <code>V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC_PERMISSION</code> | Permission to manage topic permissions for the current topic, including adding, modifying, and removing topic permissions |  |
| Bit 2 | <code>V2TIM_TOPIC_PERMISSION_MUTE_MEMBER</code> | Permission to mute members in the current topic |  |
| Bit 3 | <code>V2TIM_TOPIC_PERMISSION_SEND_MESSAGE</code> | Permission to send messages in the current topic |  |
| Bit 4 | <code>V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE</code> | Permission to retrieve historical messages sent before group joining in the current topic |  |
| Bit 5 | <code>V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE</code> | Permission to recall others' messages in the current topic |  |
| Bit 6 | <code>V2TIM_TOPIC_PERMISSION_AT_ALL</code> | Permission to send @all messages in the current topic |  |

## Examples

We use a scenario to introduce the permission group usage process. A sports community involves 3 topics, including **Important Notification, Basketball**, and **Football**. All members have the permission to retrieve historical messages sent before group joining in the **Important notification** topic, and the permission to send messages in the **Basketball** and **Football** topics. Member a has the permissions to modify community information, manage group members, and send messages in the **Important notification** topic, while members b and c have the permission to mute members in the **Basketball** and **Football** topics.

The process is as follows:
1. **This is very important:** In the community, set `enablePermissionGroup` to `true` to enable the permission group feature. This step can be the last step.

2. Set `defaultPermissions` to 0 to disable all the everyone permissions for communities, so no member has any community permissions.

3. Set the everyone permissions `defaultPermissions` to 16 (10000 in binary mode) for the **Important Notification** topic, that is, `V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE`. Set the everyone permissions defaultPermissions to 8 (1000 in binary mode) for the **Basketball** and **Football** topics, that is, `V2TIM_TOPIC_PERMISSION_SEND_MESSAGE`. In this case, all members can retrieve historical messages sent before group joining in the **Important notification** topic and send messages in the **Basketball** and **Football** topics.

4. Create a permission group named Community Management, and set the community permission `groupPermission` to 3 (11 in binary mode), which is the OR operation value specified by `V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO | V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER` for the permission. Add the messaging permission `topicPermission` in the **Important notification** topic, and set it to 8 (1000 in binary mode), that is `V2TIM_TOPIC_PERMISSION_SEND_MESSAGE`. After being added to the permission group, group member a will have permissions to modify community information, manage group members, and send messages in the **Important notification** topic.

5. Create a permission group named Topic Management, disable all community permissions, and set `groupPermission` to 0. Add the mute permission `topicPermission` in the **Basketball** and **Football** topics, and set it to 4 (100 in binary mode), that is `V2TIM_TOPIC_PERMISSION_MUTE_MEMBER`. After being added to this permission group, group members b and c will have permissions to mute members in the **Basketball** and **Football** topics.

## Community Permission Management

### Enabling/Disabling the Permission Group Feature

Groups can be managed by either admins or permission groups. When the permission group feature is enabled, the admin role is disabled, making admins equivalent to ordinary group members. When the permission group feature is disabled, the admin permissions are restored.

Set `enablePermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupInfo.html#ab4d8d679ece65113fa04ef09a4a50b70), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupInfo.html#v2timgroupinfo.enablepermissiongroup),[Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupInfo.html#af780df9d08aa6a0166d90758b251a38a), [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupInfo.html#afde788403e154c3faa211b3d20bb2544), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_info/V2TimGroupInfo/isEnablePermissionGroup.html)) to enable or disable the permission group feature. When the feature is enabled, the admin role is disabled. When the feature is disabled, the admin permissions are restored.

The sample code is as follows:

【Java】
``` java
V2TIMGroupInfo groupInfo = new V2TIMGroupInfo();
groupInfo.setGroupID("ID of the community for which the permission group feature needs to be enabled");
groupInfo.setEnablePermissionGroup(true);
V2TIMManager.getGroupManager().setGroupInfo(groupInfo, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        // The permission group feature is enabled successfully
    }
    @Override
    public void onError(int code, String desc) {
        // The permission group feature fails to be enabled
    }
});

// Group event listener
V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
    @Override
    public void onGroupInfoChanged(String groupID, List<V2TIMGroupChangeInfo> changeInfos) {
        // Group information update callback
    }
});
```

【Swift】
``` swift
let groupInfo = V2TIMGroupInfo()
groupInfo.groupID = "groupID"
groupInfo.enablePermissionGroup = true
V2TIMManager.shared.setGroupInfo(info: groupInfo) {
    print( "setGroupInfo succ")
} fail: { code, desc in
    print( "setGroupInfo fail, \(code), \(desc)")
}
V2TIMManager.shared.addGroupListener(listener: self)
func onGroupInfoChanged(groupID: String, changeInfoList: Array<V2TIMGroupChangeInfo>) {
    print( "groupID:\(groupID), changeInfoList:\(changeInfoList)")
}
```

【Objective-C】
``` objectivec
V2TIMGroupInfo *info = [[V2TIMGroupInfo alloc] init];
info.groupID = @"ID of the community for which the permission group feature needs to be enabled";
info.enablePermissionGroup = YES;

[[V2TIMManager sharedInstance] setGroupInfo:info succ:^{
    // The permission group feature is enabled successfully
} fail:^(int code, NSString *msg) {
    // The permission group feature fails to be enabled
}];

// Group event listener
[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onGroupInfoChanged:(NSString *)groupID changeInfoList:(NSArray<V2TIMGroupChangeInfo *>*)changeInfoList {
    // Group information update callback
}
```

【C++】
``` cpp
V2TIMGroupInfo info;
info.groupID = "ID of the community for which the permission group feature needs to be enabled";
info.enablePermissionGroup = true;
info.modifyFlag |= (uint32_t)V2TIM_GROUP_INFO_MODIFY_FLAG_ENABLE_PERMISSION_GROUP;

class TestCallBack : public V2TIMValueCallback<V2TIMString> {
    void OnSuccess(const V2TIMString &value)override {
        // The permission group feature is enabled successfully
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
        // The permission group feature fails to be enabled
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetGroupManager()->SetGroupInfo(info, callback);

// Group event listener
class GroupListener final : public V2TIMGroupListener {
public:
    GroupListener() = default;
    ~GroupListener() override = default;
    
    void OnGroupInfoChanged(const V2TIMString &groupID, const V2TIMGroupChangeInfoVector &changeInfos)override {
        // Group information update notification
    }
};

GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

【Dart】
``` javascript
final groupInfo = V2TimGroupInfo(
  groupID: "ID of the community for which the permission group feature needs to be enabled",
  groupType: GroupType.Community,
  isEnablePermissionGroup: true,
);
final result = await TencentImSDKPlugin.v2TIMManager
    .getGroupManager()
    .setGroupInfo(info: groupInfo);
if (result.code == 0) {
  // The permission group feature is enabled successfully
} else {
  // The permission group feature fails to be enabled
}

// Group event listener
TencentImSDKPlugin.v2TIMManager.addGroupListener(
  listener: V2TimGroupListener(
    onGroupInfoChanged: (String groupID, List<V2TimGroupChangeInfo?> changeInfos) {
      // Group information update callback
    },
  ),
);
```

### Default Community Permissions

Group owners and members with permission to modify group information can set `defaultPermissions` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupInfo.html#acb68084ffdcc522f4b8114fed65ac161), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupInfo.html#v2timgroupinfo.defaultpermissions) , [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupInfo.html#ae60e1f3a01097aa3315c68b1f0f02b1c), [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupInfo.html#ae60e1f3a01097aa3315c68b1f0f02b1c), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_info/V2TimGroupInfo/defaultPermissions.html)) in `V2TIMGroupInfo` to change the default permissions of communities. These default permissions are effective for all group members **everyone** (excluding the group owner).

The sample code is as follows:

【Java】
``` java
// Assume that it is required to allow all group members to send messages and retrieve historical messages sent before community joining in all topics by default, with other permissions disabled
long communityPermission = V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE | V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE;
V2TIMGroupInfo groupInfo = new V2TIMGroupInfo();
groupInfo.setGroupID("ID of the community to be modified");
groupInfo.setDefaultPermissions(communityPermission);
V2TIMManager.getGroupManager().setGroupInfo(groupInfo, new V2TIMCallback() {
    @Override
    public void onSuccess() {
      // Default permissions are set successfully
    }
    
    @Override public void onError(int code, String desc) {
      // Default permissions fail to be set
    }
});

// Group profile modification notification
V2TIMManager.getInstance().addGroupListener(new V2TIMGroupListener() {
    @Override
    public void onGroupInfoChanged(String groupID, List<V2TIMGroupChangeInfo> changeInfos) {
      // Group information update callback
    }
});
```

【Swift】
``` swift
let groupInfo = V2TIMGroupInfo()
groupInfo.groupID = "groupID"
groupInfo.enablePermissionGroup = true
groupInfo.defaultPermissions = V2TIMCommunityPermissionValue.V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE.rawValue | V2TIMCommunityPermissionValue.V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE.rawValue;
V2TIMManager.shared.setGroupInfo(info: groupInfo) {
    print( "setGroupInfo succ")
} fail: { code, desc in
    print( "setGroupInfo fail, \(code), \(desc)")
}

V2TIMManager.shared.addGroupListener(listener: self)
func onGroupInfoChanged(groupID: String, changeInfoList: Array<V2TIMGroupChangeInfo>) {
    print( "groupID:\(groupID), changeInfoList:\(changeInfoList)")
}
```

【Objective-C】
``` objectivec
// Assume that it is required to allow all group members to send messages and retrieve historical messages sent before community joining in all topics by default, with other permissions disabled
V2TIMGroupInfo *info = [[V2TIMGroupInfo alloc] init];
info.groupID = @"ID of the community to be modified";
info.defaultPermissions = V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE |V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE;

[[V2TIMManager sharedInstance] setGroupInfo:info succ:^{
    // Default permissions are set successfully
} fail:^(int code, NSString *msg) {
    // Default permissions fail to be set
}];

// Group event listener
[[V2TIMManager sharedInstance] addGroupListener:self];
- (void)onGroupInfoChanged:(NSString *)groupID changeInfoList:(NSArray<V2TIMGroupChangeInfo *>*)changeInfoList {
    // Group profile update callback
}
```

【C++】
``` cpp
// Assume that it is required to allow all group members to send messages and retrieve historical messages sent before community joining in all topics by default, with other permissions disabled
V2TIMGroupInfo info;
info.groupID = "ID of the community to be modified";
info.modifyFlag |= (uint32_t)V2TIM_GROUP_INFO_MODIFY_FLAG_DEFAULT_PERMISSIONS;
info.defaultPermissions = V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE |V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE;

class TestCallBack : public V2TIMValueCallback<V2TIMString> {
    void OnSuccess(const V2TIMString &value)override {
      // Default permissions are set successfully
    }
    void OnError(int error_code, const V2TIMString &error_message)override {
      // Default permissions fail to be set
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetGroupManager()->SetGroupInfo(info, callback);

// Group event listener
class GroupListener final : public V2TIMGroupListener {
    public:
    GroupListener() = default;
    ~GroupListener() override = default;
    
    void OnGroupInfoChanged(const V2TIMString &groupID, const V2TIMGroupChangeInfoVector &changeInfos)override {
      // Group profile update notification
    }
};

GroupListener groupListener;
V2TIMManager::GetInstance()->AddGroupListener(&groupListener);
```

【Dart】
``` javascript
// Assume that it is required to allow all group members to send messages and retrieve historical messages sent before community joining in all topics by default, with other permissions disabled
final int communityPermission =
    V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_SEND_MESSAGE |
        V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_GET_HISTORY_MESSAGE;

final groupInfo = V2TimGroupInfo(
  groupID: "ID of the community to be modified",
  groupType: GroupType.Community,
  defaultPermissions: communityPermission,
);

final result = await TencentImSDKPlugin.v2TIMManager
    .getGroupManager()
    .setGroupInfo(info: groupInfo);

if (result.code == 0) {
  // Default permissions are set successfully
} else {
  // Default permissions fail to be set
}

// Group profile modification notification
TencentImSDKPlugin.v2TIMManager.addGroupListener(
  listener: V2TimGroupListener(
    onGroupInfoChanged: (String groupID, List<V2TimGroupChangeInfo?> changeInfos) {
      // Group information update callback
    },
  ),
);
```

### Creating a Permission Group

Group owners and members with permission to manage group information can call `createPermissionGroupInCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a92908f8d46063504d6f8b0d0f04f3a6b),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.createpermissiongroupincommunity(permissiongroupinfo:succ:fail:)), [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a476609aac093b8d0aa3404992c4919bd), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a2707a4f2b24761c6cd48a52157ccf132),  [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/createPermissionGroupInCommunity.html)) to create up to 20 permission groups by default.

The sample code is as follows:

【Java】
``` java
V2TIMPermissionGroupInfo v2TIMPermissionGroupInfo = new V2TIMPermissionGroupInfo();
v2TIMPermissionGroupInfo.setGroupID("ID of the community for which a permission group needs to be created");
v2TIMPermissionGroupInfo.setPermissionGroupID("Permission group ID, which can be left blank or custom");
v2TIMPermissionGroupInfo.setPermissionGroupName("Permission group name");
v2TIMPermissionGroupInfo.setCustomData("Custom character string of the permission group");
// Members of this permission group have the [permission to modify group information] and [permission to manage group members] long communityPermission =V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO |V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER;
v2TIMPermissionGroupInfo.setGroupPermission(communityPermission);

V2TIMManager.getCommunityManager().createPermissionGroupInCommunity(v2TIMPermissionGroupInfo, new V2TIMValueCallback<String>() {
    @Override
    public void onSuccess(String permissionGroupID) {
      // The permission group is created successfully
    }
    
    @Override
    public void onError(int code, String desc) {
      // The permission group fails to be created
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onCreatePermissionGroup(String groupID, V2TIMPermissionGroupInfo permissionGroupInfo) {
      // Permission group creation notification
    }
});
```

【Swift】
``` swift
let permissionGroupInfo = V2TIMPermissionGroupInfo();
permissionGroupInfo.groupID = "groupID";
permissionGroupInfo.permissionGroupID = "";
permissionGroupInfo.permissionGroupName = "permissionGroupNameSwift";
permissionGroupInfo.customData = "customDataSwift";
permissionGroupInfo.groupPermission = V2TIMCommunityPermissionValue.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO.rawValue;

V2TIMManager.shared.createPermissionGroupInCommunity(permissionGroupInfo: permissionGroupInfo) { permissionGroupID in
    print( "createPermissionGroupInCommunity succ, \(permissionGroupID)")
} fail: { code, desc in
    print( "createPermissionGroupInCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
V2TIMPermissionGroupInfo *permissionGroupInfo = [[V2TIMPermissionGroupInfo alloc] init];
permissionGroupInfo.groupID = @"ID of the community for which a permission group needs to be created";
permissionGroupInfo.permissionGroupID = @"Permission group ID, which can be left blank or custom";
permissionGroupInfo.permissionGroupName = @"Permission group name";
// Members of this permission group have the [permission to modify group information] and [permission to manage group members]
permissionGroupInfo.groupPermission = V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO |V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER;
permissionGroupInfo.customData = @"Custom character string of the permission group";

[[V2TIMManager sharedInstance] createPermissionGroupInCommunity:permissionGroupInfo succ:^(NSString *permissionGroupID) {
    // The permission group is created successfully
} fail:^(int code, NSString *desc) {
    // The permission group fails to be created
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onCreatePermissionGroup:(NSString *)groupID permissionGroupInfo:(V2TIMPermissionGroupInfo *)permissionGroupInfo {
    // Permission group creation notification
}
```

【C++】
``` cpp
V2TIMPermissionGroupInfo permissionGroupInfo;
permissionGroupInfo.groupID = "ID of the community for which a permission group needs to be created";
permissionGroupInfo.permissionGroupID = "Permission group ID, which can be left blank or custom";
permissionGroupInfo.permissionGroupName = "Permission group name";
permissionGroupInfo.customData = "Custom character string of the permission group";
// Members of this permission group have the [permission to modify group information] and [permission to manage group members]
permissionGroupInfo.groupPermission = V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO |V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER;

class TestCallBack : public V2TIMValueCallback<V2TIMString> {
    void OnSuccess(const V2TIMString &value) override {
      // The permission group is created successfully
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
      // The permission group fails to be created
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->CreatePermissionGroupInCommunity(permissionGroupInfo, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnCreatePermissionGroup(const V2TIMString &groupID, const V2TIMPermissionGroupInfo &permissionGroupInfo) override {
      // Permission group creation notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
// Members of this permission group have the [permission to modify group information] and [permission to manage group members] long communityPermission =V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO |V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER;
final int communityPermission =
    V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO |
        V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER;

final info = V2TimPermissionGroupInfo(
  groupID: "ID of the community for which a permission group needs to be created",
  permissionGroupID: "Permission group ID, which can be left blank or custom",
  permissionGroupName: "Permission group name",
  customData: "Custom character string of the permission group",
  groupPermission: communityPermission,
);

final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .createPermissionGroupInCommunity(info: info);

if (result.code == 0) {
  // The permission group is created successfully
} else {
  // The permission group fails to be created
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onCreatePermissionGroup: (String groupID, V2TimPermissionGroupInfo permissionGroupInfo) {
      // Permission group creation notification
    },
  ),
);
```

### Deleting a Permission Group

Group owners and members with the permission to manage group information can call `deletePermissionGroupFromCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a74e98c5144576fca599378e672b54d1f),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.deletepermissiongroupfromcommunity(groupid:permissiongroupidlist:succ:fail:)),[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a63e60a9a9f671f176d570ce245f8ea5f), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a1fb6abe06fe71cd17186a09926d6e39c), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/deletePermissionGroupFromCommunity.html)) to delete permission groups.

The sample code is as follows:

【Java】
``` java
List<String> deleteList = new ArrayList<>();
deleteList.add("ID of permission group 1");
deleteList.add("ID of permission group 2");

V2TIMManager.getCommunityManager().deletePermissionGroupFromCommunity("ID of the community for which a permission group needs to be deleted", deleteList, new V2TIMValueCallback<List<V2TIMPermissionGroupOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMPermissionGroupOperationResult> results) {
      // Deletion is successful, and results specifies the operation results for each permission group
    }
    
    @Override public void onError(int code, String desc) {
      // Deletion fails
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onDeletePermissionGroup(String groupID, List<String> permissionGroupIDList) {
      // Permission group deletion notification
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.deletePermissionGroupFromCommunity(groupID: "groupID", permissionGroupIDList: ["permissionGroupID1","permissionGroupID2"]) { resultList in
    resultList.forEach { item in
        // V2TIMPermissionGroupOperationResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getSpecifiedPermissionGroupList fail, \(code), \(desc)")
}

V2TIMManager.shared.addCommunityListener(listener: self)

func onDeletePermissionGroup(groupID: String, permissionGroupIDList: Array<String>) {
     print( "groupID:\(groupID), permissionGroupIDList:\(permissionGroupIDList)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *deleteList = [NSMutableArray array];
[deleteList addObject:@"ID of permission group 1"];
[deleteList addObject:@"ID of permission group 2"];

[[V2TIMManager sharedInstance] deletePermissionGroupFromCommunity:@"ID of the community for which a permission group needs to be deleted" permissionGroupIDList:deleteList succ:^(NSMutableArray<V2TIMPermissionGroupOperationResult *> *resultList) {
    // Deletion is successful, and resultList specifies the operation results for each permission group
} fail:^(int code, NSString *desc) {
    // Deletion fails
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onDeletePermissionGroup:(NSString *)groupID permissionGroupIDList:(NSArray<NSString *>*)permissionGroupIDList {
    // Permission group deletion notification
}
```

【C++】
``` cpp
V2TIMStringVector permissionGroupIDList;
permissionGroupIDList.PushBack("ID of permission group 1");
permissionGroupIDList.PushBack("ID of permission group 2");

class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupOperationResultVector> {
    void OnSuccess(const V2TIMPermissionGroupOperationResultVector &value) override {
      // Deletion is successful, and results specifies the operation results for each permission group
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
      // Deletion fails
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->DeletePermissionGroupFromCommunity("ID of the community for which a permission group needs to be deleted", permissionGroupIDList, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnDeletePermissionGroup(const V2TIMString &groupID, const V2TIMStringVector &permissionGroupIDList)override {
      // Permission group deletion notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .deletePermissionGroupFromCommunity(
  groupID: "ID of the community for which a permission group needs to be deleted",
  permissionGroupIDList: ["ID of permission group 1", "ID of permission group 2"],
);

if (result.code == 0) {
  // Deletion is successful, and results specifies the operation results for each permission group
} else {
  // Deletion fails
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onDeletePermissionGroup: (String groupID, List<String> permissionGroupIDList) {
      // Permission group deletion notification
    },
  ),
);
```

### Modifying a Permission Group

Group owners and members with the permission to manage group information can call `modifyPermissionGroupInfoInCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a2a5d15a05b455c73f5e8e8c7eab7ad0d), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.modifypermissiongroupinfoincommunity(permissiongroupinfo:succ:fail:)),[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a70b591fc96714320a4e7b12212cc4211), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ac9f666ee2047b02e4e588fe44548926a), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/modifyPermissionGroupInfoInCommunity.html)) to change the name, permissions, and custom fields for a permission group.

The sample code is as follows:

【Java】
``` java
V2TIMPermissionGroupInfo v2TIMPermissionGroupInfo = new V2TIMPermissionGroupInfo();
v2TIMPermissionGroupInfo.setGroupID("ID of the community for which a permission group needs to be modified"); // Required
v2TIMPermissionGroupInfo.setPermissionGroupID("ID of the permission group to be modified"); // Required
v2TIMPermissionGroupInfo.setPermissionGroupName("Name of the permission group to be modified");
// Members in this permission group have the [permission to manage group information] and [permission to manage members in permission groups]
long communityPermission =V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_INFO |V2TIMPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_MEMBER;
v2TIMPermissionGroupInfo.setGroupPermission(communityPermission);
v2TIMPermissionGroupInfo.setCustomData("Custom character string to be modified");

V2TIMManager.getCommunityManager().modifyPermissionGroupInfoInCommunity(v2TIMPermissionGroupInfo, newV2TIMCallback() {
    @Override
    public void onSuccess() {
      // Permission group information is modified successfully
    }
    @Override
    public void onError(int code, String desc) {
      // Permission group information fails to be modified
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onChangePermissionGroupInfo(String groupID, V2TIMPermissionGroupInfo permissionGroupInfo) {
      // Permission group update notification
    }
});
```

【Swift】
``` swift
let permissionGroupInfo = V2TIMPermissionGroupInfo();
permissionGroupInfo.groupID = "groupID";
permissionGroupInfo.permissionGroupID = "@";
permissionGroupInfo.permissionGroupName = "permissionGroupNameModifiedSwift";
permissionGroupInfo.customData = "customDataiModifedSwift";
permissionGroupInfo.groupPermission = V2TIMCommunityPermissionValue.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_INFO.rawValue | V2TIMCommunityPermissionValue.V2TIM_COMMUNITY_PERMISSION_MANAGE_GROUP_MEMBER.rawValue;

V2TIMManager.shared.modifyPermissionGroupInfoInCommunity(permissionGroupInfo: permissionGroupInfo) {
    print( "modifyPermissionGroupInfoInCommunity succ, \(permissionGroupInfo.description)")
} fail: { code, desc in
    print( "modifyPermissionGroupInfoInCommunity fail, \(code), \(desc)")
}

V2TIMManager.shared.addCommunityListener(listener: self)
func onChangePermissionGroupInfo(groupID: String, permissionGroupInfo: V2TIMPermissionGroupInfo) {
    print( "groupID:\(groupID), permissionGroupInfo:\(permissionGroupInfo.description)")
}
```

【Objective-C】
``` objectivec
V2TIMPermissionGroupInfo *permissionGroupInfo = [[V2TIMPermissionGroupInfo alloc] init];
permissionGroupInfo.groupID = @"ID of the community for which a permission group needs to be modified"; // Required
permissionGroupInfo.permissionGroupID = @"ID of the permission group to be modified"; // Required
permissionGroupInfo.permissionGroupName = @"Name of the permission group to be modified";
permissionGroupInfo.customData = @"Custom character string to be modified";
// Members in this permission group have the [permission to manage group information] and [permission to manage members in permission groups]
permissionGroupInfo.groupPermission =V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_INFO |V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_MEMBER;

[[V2TIMManager sharedInstance] modifyPermissionGroupInfoInCommunity:permissionGroupInfo succ:^{
    // Permission group information is modified successfully
} fail:^(int code, NSString *desc) {
    // Permission group information fails to be modified
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onChangePermissionGroupInfo:(NSString *)groupID permissionGroupInfo:(V2TIMPermissionGroupInfo *)permissionGroupInfo {
    // Permission group update notification
}
```

【C++】
``` cpp
V2TIMPermissionGroupInfo modifyInfo;
modifyInfo.groupID = "ID of the community for which a permission group needs to be modified"; // Required
modifyInfo.permissionGroupID = "ID of the permission group to be modified"; // Required
modifyInfo.permissionGroupName = "Name of the permission group to be modified";
modifyInfo.customData = "Custom character string to be modified";
// Members in this permission group have the [permission to manage group information] and [permission to manage members in permission groups]
modifyInfo.groupPermission = V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_INFO | V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_MEMBER;
modifyInfo.modifyFlag = V2TIMPermissionGroupInfoModifyFlag::V2TIM_PERMISSION_MODIFY_FLAG_NAME
                        | V2TIMPermissionGroupInfoModifyFlag::V2TIM_PERMISSION_MODIFY_FLAG_GROUP_PERMISSION
                        | V2TIMPermissionGroupInfoModifyFlag::V2TIM_PERMISSION_MODIFY_FLAG_CUSTOM_DATA;

class TestCallBack : public V2TIMValueCallback<V2TIMString> {
    void OnSuccess(const V2TIMString &value) override {
      // Permission group information is modified successfully
    } 
    void OnError(int error_code, const V2TIMString &error_message) override { 
      // Permission group information fails to be modified
    }
}; 
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->ModifyPermissionGroupInfoInCommunity(modifyInfo, new CppAPITestImpl::Callback("ModifyPermissionGroupInfoInCommunity"));

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
    public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnChangePermissionGroupInfo(const V2TIMString &groupID, const V2TIMPermissionGroupInfo &permissionGroupInfo) override {
      // Permission group update notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
final int communityPermission =
    V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_INFO |
        V2TimPermissionGroupInfo.V2TIM_COMMUNITY_PERMISSION_MANAGE_PERMISSION_GROUP_MEMBER;

final info = V2TimPermissionGroupInfo(
  groupID: "ID of the community for which a permission group needs to be modified", // Required
  permissionGroupID: "ID of the permission group to be modified", // Required
  permissionGroupName: "Name of the permission group to be modified",
  customData: "Custom character string to be modified",
  groupPermission: communityPermission,
);

final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .modifyPermissionGroupInfoInCommunity(info: info);

if (result.code == 0) {
  // Permission group information is modified successfully
} else {
  // Permission group information fails to be modified
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onChangePermissionGroupInfo: (String groupID, V2TimPermissionGroupInfo permissionGroupInfo) {
      // Permission group update notification
    },
  ),
);
```

### Accessing a Permission Group List

#### Accessing a Permission Group List

Group members can call `getPermissionGroupListInCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a9f6e4a2c4f4380db7b7066f9c8a13379), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.getpermissiongrouplistincommunity(groupid:permissiongroupidlist:succ:fail:)) , [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a63b062f9695c3d6b0fe8129b6811b1e7), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a87a69b545b198a147ff7c97a36052989), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getPermissionGroupListInCommunity.html)) to access the permission group list. When the parameter `permissionGroupIDList` is not empty, you can access a specified permission group list. When `permissionGroupIDList` is empty, you can access all permission group lists.

The sample code is as follows:

【Java】
``` java
List<String> permissionGroupIDList = new ArrayList<>();
// When permissionGroupIDList is set to a value, you can access a specified permission group list. When permissionGroupIDList is empty, you can access all permission group lists
permissionGroupIDList.add("ID of the permission group to access");

V2TIMManager.getCommunityManager().getPermissionGroupListInCommunity("ID of the community for which the permission group list needs to be accessed", permissionGroupIDList, newV2TIMValueCallback<List<V2TIMPermissionGroupInfoResult>>() { 
    @Override 
    public voidonSuccess(List<V2TIMPermissionGroupInfoResult> resultList) { 
      // The permission group list is successfully accessed
    }
    
    @Override public void onError(int code, String desc) { 
      // The permission group list fails to be accessed
    } 
});
```

【Swift】
``` swift
V2TIMManager.shared.getPermissionGroupListInCommunity(groupID: "groupID", permissionGroupIDList: []) { resultList in
    resultList.forEach { item in
        // V2TIMPermissionGroupInfoResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getAllPermissionGroupList fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *permissionGroupIDList = [NSMutableArray array];
// When permissionGroupIDList is set to a value, you can access a specified permission group list. When permissionGroupIDList is empty, you can access all permission group lists
[permissionGroupIDList addObject:@"The ID of the permission group to access"];

[[V2TIMManager sharedInstance] getPermissionGroupListInCommunity:@"ID of the community for which the permission group list needs to be accessed" permissionGroupIDList:permissionGroupIDList succ:^(NSMutableArray<V2TIMPermissionGroupInfoResult *>*resultList) {
    // The permission group list is successfully accessed
} fail:^(int code, NSString *desc) {
    // The permission group list fails to be accessed
}];
```

【C++】
``` cpp
V2TIMStringVector permissionGroupIDList;
// When permissionGroupIDList is set to a value, you can access a specified permission group list. When permissionGroupIDList is empty, you can access all permission group lists
permissionGroupIDList.PushBack("The ID of the permission group to access"); 

class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupInfoResultVector> { 
    void OnSuccess(constV2TIMPermissionGroupInfoResultVector &value) override {
      // The permission group list is successfully accessed
    } 
    void OnError(int error_code,const V2TIMString &error_message) override {
      // The permission group list fails to be accessed
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->GetPermissionGroupListInCommunity("ID of the community for which the permission group list needs to be accessed", permissionGroupIDList, callback);
```

【Dart】
``` javascript
// When permissionGroupIDList is set to a value, you can access a specified permission group list. When permissionGroupIDList is empty, you can access all permission group lists
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .getPermissionGroupListInCommunity(
  groupID: "ID of the community for which the permission group list needs to be accessed",
  permissionGroupIDList: ["ID of the permission group to access"],
);

if (result.code == 0) {
  // The permission group list is successfully accessed
} else {
  // The permission group list fails to be accessed
}

```

### Accessing the List of Joined Permission Groups

Community members can call `getJoinedPermissionGroupListInCommunity` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#af3b2e3c995525d3f6be17fbd4f42ad2b), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.getjoinedpermissiongrouplistincommunity(groupid:succ:fail:)), [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a4cb129d433f107489f11e99354643d76), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a0718b0a530e32ebef153773a80b81890), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getJoinedPermissionGroupListInCommunity.html)) to access the list of joined permission groups.

The sample code is as follows:

【Java】
``` java
V2TIMManager.getCommunityManager().getJoinedPermissionGroupListInCommunity("ID of the community for which the permission group list needs to be accessed", new V2TIMValueCallback<List<V2TIMPermissionGroupInfoResult>>() {
    @Override public voidonSuccess(List<V2TIMPermissionGroupInfoResult> resultList) {
      // The joined permission group is successfully accessed
    }
    
    @Override public voidonError(int code, String desc) {
      // The joined permission group fails to be accessed
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getJoinedPermissionGroupListInCommunity(groupID: "groupID") { resultList in
    resultList.forEach { item in
        // V2TIMPermissionGroupInfoResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getJoinedPermissionGroupListInCommunity fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getJoinedPermissionGroupListInCommunity:@"ID of the community for which the permission group list needs to be accessed"succ:^(NSMutableArray<V2TIMPermissionGroupInfoResult *> *resultList) {
    // The joined permission group is successfully accessed
} fail:^(int code, NSString *desc) {
    // The joined permission group fails to be accessed
}];
```

【C++】
``` cpp
class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupInfoResultVector> {
    void OnSuccess(constV2TIMPermissionGroupInfoResultVector &value) override {
      // The joined permission group is successfully accessed
    }
    void OnError(interror_code, const V2TIMString &error_message) override {
      // The joined permission group fails to be accessed
    }
};
auto *callback = newTestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->GetJoinedPermissionGroupListInCommunity("ID of the community for which the permission group list needs to be accessed", callback);

```

【Dart】
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .getJoinedPermissionGroupListInCommunity(
  groupID: "ID of the community for which the permission group list needs to be accessed",
);

if (result.code == 0) {
  // The joined permission group is successfully accessed
} else {
  // The joined permission group fails to be accessed
}
```

### Adding Members to a Permission Group

Group owners and members with the permission to manage permission groups can call `addCommunityMembersToPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a79757d4803e94cdfe15deb4e7789e043), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.addcommunitymemberstopermissiongroup(groupid:permissiongroupid:memberlist:succ:fail:)),[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a581cfc8070a6c6aa37bf54c0f496a2c4), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ad398f5fe6af474dc6a8ae9c5696ee2e7), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/addCommunityMembersToPermissionGroup.html)) to add up to 20 members to a permission group at a time.

The sample code is as follows:

【Java】
``` java
List<String> memberList = new ArrayList<>();
// Up to 20 members can be added at a time
memberList.add("userID of group member 1 to add");
memberList.add("userID of group member 2 to add");

V2TIMManager.getCommunityManager().addCommunityMembersToPermissionGroup("ID of the community for which members need to be added to a permission group", "ID of the permission group where members need to be added", memberList,new V2TIMValueCallback<List<V2TIMPermissionGroupMemberOperationResult>>() {
    @Override public voidonSuccess(List<V2TIMPermissionGroupMemberOperationResult> resultList) {
      // Members are successfully added
    }

    @Override publicvoid onError(int code, String desc) {
      // Members fail to be added
    }
});

// Community event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onAddMembersToPermissionGroup(String groupID, String permissionGroupID, List<String>memberIDList){
      // Notification for adding permission group members
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.addCommunityMembersToPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", memberList: ["member1", "member2"]) { resultList in
    resultList.forEach { item in
        // V2TIMPermissionGroupOperationResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "addCommunityMembersToPermissionGroup fail, \(code), \(desc)")
}
V2TIMManager.shared.addCommunityListener(listener: self)
func onAddMembersToPermissionGroup(groupID: String, permissionGroupID: String, memberIDList: Array<String>) {
    print( "groupID:\(groupID), permissionGroupID:\(permissionGroupID), memberIDList:\(memberIDList)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *memberList = [NSMutableArray array];
[memberList addObject:@"userID of group member 1 to add"];
[memberList addObject:@"userID of group member 2 to add"];

[[V2TIMManager sharedInstance] addCommunityMembersToPermissionGroup:@"ID of the community for which members need to be added to a permission group" permissionGroupID:@"ID of the permission group where members need to be added" memberList:memberList succ:^(NSMutableArray<V2TIMPermissionGroupMemberOperationResult *>*resultList) {
    // Members are successfully added
} fail:^(int code, NSString *desc) {
    // Members fail to be added
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onAddMembersToPermissionGroup:(NSString *)groupID permissionGroupID:(NSString *)permissionGroupID memberIDList:(NSArray<NSString *> *)memberIDList {
    // Notification for adding permission group members
}
```

【C++】
``` cpp
V2TIMStringVector memberIDList;
memberIDList.PushBack("userID of group member 1 to add");
memberIDList.PushBack("userID of group member 2 to add");

class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupMemberOperationResultVector> {
    void OnSuccess(constV2TIMPermissionGroupMemberOperationResultVector &value) override {
        // Members are successfully added
    }
    void OnError(interror_code, const V2TIMString &error_message) override {
      // Members fail to be added
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityMembersToPermissionGroup("ID of the community for which members need to be added to a permission group", "ID of the permission group where members need to be added", memberIDList, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnAddMembersToPermissionGroup(const V2TIMString &groupID, const V2TIMString &permissionGroupID,const V2TIMStringVector &memberIDList) override {
      // Notification for adding permission group members
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
// Up to 20 members can be added at a time
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .addCommunityMembersToPermissionGroup(
  groupID: "ID of the community for which members need to be added to a permission group",
  permissionGroupID: "ID of the permission group where members need to be added",
  memberList: ["userID of group member 1 to add", "userID of group member 2 to add"],
);

if (result.code == 0) {
  // Members are successfully added
} else {
  // Members fail to be added
}

// Community event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onAddMembersToPermissionGroup:
        (String groupID, String permissionGroupID, List<String> memberIDList) {
      // Notification for adding permission group members
    },
  ),
);
```

### Removing Members from a Permission Group

Group owners and members with the permission to manage permission group members can call `removeCommunityMembersFromPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a5d48a2141728bd791129eefb9d88e262), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.removecommunitymembersfrompermissiongroup(groupid:permissiongroupid:memberlist:succ:fail:)) , [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a266ab0a4ca2bf77daf84b96dadea5e93), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a0c47510d2fba0f97a41ce8b52d8e3b0d), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/removeCommunityMembersFromPermissionGroup.html)) to remove members from a permission group.

The sample code is as follows:

【Java】
``` java
List<String> memberList = new ArrayList<>();
memberList.add("userID of group member 1 to remove");
memberList.add("userID of group member 2 to remove");

V2TIMManager.getCommunityManager().removeCommunityMembersFromPermissionGroup("ID of the community from which permission group members need to be removed", "ID of the permission group from which members need to be removed", memberList, new V2TIMValueCallback<List<V2TIMPermissionGroupMemberOperationResult>>() {
    @Override public void onSuccess(List<V2TIMPermissionGroupMemberOperationResult> resultList) {
      // Group members are successfully removed
    }
    
    @Override public void onError(int code, String desc) {
      // Group members fail to be removed
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onRemoveMembersFromPermissionGroup(String groupID, String permissionGroupID,List<String>memberIDList) {
      // Notification of removing members from a permission group
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.removeCommunityMembersFromPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", memberList: ["member1,member2"]) { resultList in
    resultList.forEach { item in
        // V2TIMPermissionGroupOperationResult
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "removeCommunityMembersFromPermissionGroup fail, \(code), \(desc)")
}

V2TIMManager.shared.addCommunityListener(listener: self)
func onRemoveMembersFromPermissionGroup(groupID: String, permissionGroupID: String, memberIDList: Array<String>) {
    print( "groupID:\(groupID), permissionGroupID:\(permissionGroupID), memberIDList:\(memberIDList)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *memberList = [NSMutableArray array];
[memberList addObject:@"userID of group member 1 to remove"];
[memberList addObject:@"userID of group member 2 to remove"];

[[V2TIMManager sharedInstance] removeCommunityMembersFromPermissionGroup:@"ID of the community from which permission group members need to be removed" permissionGroupID:@"ID of the permission group from which members need to be removed" memberList:memberList succ:^(NSMutableArray<V2TIMPermissionGroupMemberOperationResult *> *resultList) {
    // Group members are successfully removed
} fail:^(int code, NSString *desc) {
    // Group members fail to be removed
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onRemoveMembersFromPermissionGroup:(NSString *)groupID permissionGroupID:(NSString *)permissionGroupID memberIDList:(NSArray<NSString *> *)memberIDList {
    // Notification of removing members from a permission group
}
```

【C++】
``` cpp
V2TIMStringVector memberIDList;
memberIDList.PushBack("userID of group member 1 to remove");
memberIDList.PushBack("userID of group member 2 to remove"); class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupMemberOperationResultVector> {
    void OnSuccess(constV2TIMPermissionGroupMemberOperationResultVector &value) override {
      // Group members are successfully removed
    }
    void OnError(interror_code, const V2TIMString &error_message) override {
      // Group members fail to be removed
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->RemoveCommunityMembersFromPermissionGroup("ID of the community from which permission group members need to be removed", "ID of the permission group from which members need to be removed", memberIDList, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnRemoveMembersFromPermissionGroup(const V2TIMString &groupID, const V2TIMString &permissionGroupID, const V2TIMStringVector &memberIDList) override {
      // Notification of removing members from a permission group
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .removeCommunityMembersFromPermissionGroup(
  groupID: "ID of the community from which permission group members need to be removed",
  permissionGroupID: "ID of the permission group from which members need to be removed",
  memberList: ["userID of group member 1 to remove", "userID of group member 2 to remove"],
);

if (result.code == 0) {
  // Group members are successfully removed
} else {
  // Group members fail to be removed
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onRemoveMembersFromPermissionGroup:
        (String groupID, String permissionGroupID, List<String> memberIDList) {
      // Notification of removing members from a permission group
    },
  ),
);
```

### Accessing a Permission Group Member List

Call `getCommunityMemberListInPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a2d8f6477d76254d4dec9bd0f1a4c8051), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.getcommunitymemberlistinpermissiongroup(groupid:permissiongroupid:nextcursor:succ:fail:)) ,[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#ae9099678b494dd0c442e0075b3abab99), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#aa7802decbbed3ef6efe4d5fff137a557), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getCommunityMemberListInPermissionGroup.html)) to access the member list in a permission group, where the parameter `nextCursor` indicates the continued pulling cursor. Fill in an empty character string for the first pulling, and fill in the return value from the last call output for continued pulling.

The sample code is as follows:

【Java】
``` java
V2TIMManager.getCommunityManager().getCommunityMemberListInPermissionGroup("ID of the community for which the permission group members need to be accessed", "ID of the permission group from which members need to be accessed", "", newV2TIMValueCallback<V2TIMPermissionGroupMemberInfoResult>() {
    @Override
    public void onSuccess(V2TIMPermissionGroupMemberInfoResult result) {
      // The member list in a permission group is successfully accessed, where result.getNextCursor() returns the continued pulling cursor. Fill in the return value when re-calling this API for continued pulling
    }
    
    @Override
    public void onError(int code, String desc) {
      // The member list in a permission group fails to be accessed
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.getCommunityMemberListInPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", nextCursor: "") { nextCursor, resultList in
    resultList.forEach { item in
        // V2TIMGroupMemberFullInfo
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getCommunityMemberListInPermissionGroup fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] getCommunityMemberListInPermissionGroup:@"ID of the community for which the permission group members need to be accessed"permissionGroupID:@"ID of the permission group from which members need to be accessed" nextCursor:@"" succ:^(NSString *nextCursor,NSMutableArray<V2TIMGroupMemberFullInfo *>*resultList) {
    // The member list in a permission group is successfully accessed, where nextCursor returns the continued pulling cursor. Fill in the return value when re-calling this API for continued pulling
} fail:^(int code, NSString *desc) {
    // The member list in a permission group fails to be accessed
}];
```

【C++】
``` cpp
class TestCallBack : public V2TIMValueCallback<V2TIMPermissionGroupMemberInfoResult> {
    void OnSuccess(constV2TIMPermissionGroupMemberInfoResult &value) override {
      // The member list in a permission group is successfully accessed, where value.nextCursor returns the continued pulling cursor. Fill in the return value when re-calling the API for continued pulling
    }
    void OnError(int error_code, constV2TIMString &error_message) override {
      // The member list in a permission group fails to be accessed
    }
};
auto *callback = new TestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->GetCommunityMemberListInPermissionGroup("ID of the community for which the permission group members need to be accessed", "ID of the permission group from which members need to be accessed", "", callback);
```

【Dart】
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .getCommunityMemberListInPermissionGroup(
  groupID: "ID of the community for which the permission group members need to be accessed",
  permissionGroupID: "ID of the permission group from which members need to be accessed",
  nextCursor: "",
);

if (result.code == 0) {
  // The member list in a permission group is successfully accessed, where result.data?.nextCursor returns the continued pulling cursor. Fill in the return value when re-calling this API for continued pulling
} else {
  // The member list in a permission group fails to be accessed
}
```

## Topic Permission Management

### Default Topic Permission

Group owners and members with the topic management permission can call `setTopicInfo` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#acaff2edad6eb208478be9ab06d30035d), [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.settopicinfo(topicinfo:succ:fail:)) ,[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a237e2fa6e16e55143c516c5428a23936), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a128f08ef6e675d7c8fc96a5d124e59af), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/setTopicInfo.html)) to modify the default permission of a topic. The default permission of the topic applies to all group members (excluding the group owner).

The sample code is as follows:

【Java】
``` java
// Assume that it is required for all community members to have permissions to send messages in the current topic and retrieve historical messages sent before community joining in the topic
long topicPermission = V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_SEND_MESSAGE |V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE;
V2TIMTopicInfo topicInfo = new V2TIMTopicInfo();
topicInfo.setTopicID("ID of the topic for which the default topic permission needs to be set");
topicInfo.setDefaultPermissions(topicPermission);

V2TIMManager.getCommunityManager().setTopicInfo(topicInfo,new V2TIMCallback() {
    @Override
    public void onSuccess() {
      // The default topic permission is successfully modified
    }
    
    @Override public void onError(int code, String desc) {
      // The default topic permission fails to be modified
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onChangeTopicInfo(String groupID, V2TIMTopicInfo topicInfo) {
      // Topic information update notification
    }
});
```

【Swift】
``` swift
let topicInfo = V2TIMTopicInfo()
topicInfo.topicID = "topicID";
topicInfo.defaultPermissions = V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC.rawValue | V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC_PERMISSION.rawValue;
V2TIMManager.shared.setTopicInfo(topicInfo: topicInfo) {
    print( "modifyPermissionOfTopic succ, \(topicInfo.description)")
} fail: { code, desc in
    print( "modifyPermissionOfTopic fail, \(code), \(desc)")
}
V2TIMManager.shared.addCommunityListener(listener: self)
func onChangeTopicInfo(groupID: String, topicInfo: V2TIMTopicInfo) {
    print( "groupID:\(groupID), topicInfo:\(topicInfo.description), inheritMsgFlag:\(topicInfo.isInheritMessageReceiveOptionFromCommunity())")
}
```

【Objective-C】
``` objectivec
// Assume that it is required for all community members to have permissions to send messages in the current topic and retrieve historical messages sent before community joining in the topic
V2TIMTopicInfo *info = [[V2TIMTopicInfo alloc] init];
info.topicID = @"ID of the topic for which the default topic permission needs to be set";
info.defaultPermissions = V2TIM_TOPIC_PERMISSION_SEND_MESSAGE |V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE;

[[V2TIMManager sharedInstance] setTopicInfo:info succ:^{
    // The default topic permission is successfully modified
} fail:^(int code, NSString *desc) {
    // The default topic permission fails to be modified
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onChangeTopicInfo:(NSString *)groupID topicInfo:(V2TIMTopicInfo *)topicInfo {
    // Topic information update notification
}
```

【C++】
``` cpp
// Assume that it is required for all community members to have permissions to send messages in the current topic and retrieve historical messages sent before community joining in the topic
V2TIMTopicInfo topicInfo;
topicInfo.topicID = "ID of the topic for which the default topic permission needs to be set";
topicInfo.defaultPermissions = V2TIM_TOPIC_PERMISSION_SEND_MESSAGE |V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE;
topicInfo.modifyFlag = V2TIM_COMMUNITY_MODIFY_FLAG_DEFAULT_PERMISSIONS;

class TestCallBack : public V2TIMValueCallback<V2TIMString> {
    void OnSuccess(const V2TIMString &value)override {
      // The default topic permission is successfully modified
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
      // The default topic permission fails to be modified
    }
};
auto *callback = new TestCallBack;  V2TIMManager::GetInstance()->GetGroupManager()->SetTopicInfo(topicInfo,callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnChangeTopicInfo(const V2TIMString &groupID, const V2TIMTopicInfo &topicInfo) override {
      // Topic information update notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
// Assume that it is required for all community members to have permissions to send messages in the current topic and retrieve historical messages sent before community joining in the topic
final int topicPermission =
    V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_SEND_MESSAGE |
        V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_GET_HISTORY_MESSAGE;

final topicInfo = V2TimTopicInfo(
  topicID: "ID of the topic for which the default topic permission needs to be set",
  defaultPermissions: topicPermission,
);

final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .setTopicInfo(topicInfo: topicInfo);

if (result.code == 0) {
  // The default topic permission is successfully modified
} else {
  // The default topic permission fails to be modified
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onChangeTopicInfo: (String groupID, V2TimTopicInfo topicInfo) {
      // Topic information update notification
    },
  ),
);
```

### Adding Topic Permissions to a Permission Group

Group owners and members with the permission to manage group information can call `addTopicPermissionToPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a7e7d5b6960571ddbf61ba5a6f7390bc9),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.addtopicpermissiontopermissiongroup(groupid:permissiongroupid:topicpermissionmap:succ:fail:)),[Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a538a722d29fa2e0f2841b70cb6e050f4), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a469f912625330ccf3b0313c5a6d49603), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/addTopicPermissionToPermissionGroup.html)) to add topic permissions to a permission group. These permissions are effective for members of the permission group.

The sample code is as follows:

【Java】
``` java
// Assume that it is required for members in the permission group to have the [permission to manage topic 1], [permission to mute members in topic 1], as well as the [permission to manage topic 2] and [permission to revoke others' messages in topic 2]
long topicPermission1 = V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;
long topicPermission2 = V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE;
HashMap<String, Long> topicPermissionMap = new HashMap<>();
topicPermissionMap.put("ID of topic 1",topicPermission1);
topicPermissionMap.put("ID of topic 2", topicPermission2);

V2TIMManager.getCommunityManager().addTopicPermissionToPermissionGroup("ID of the community for which topic permissions need to be added", "ID of the permission group for which topic permissions need to be added",topicPermissionMap, new V2TIMValueCallback<List<V2TIMTopicOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMTopicOperationResult> v2TIMTopicOperationResults) {
      // Topic permissions are successfully added, with the parameter including the results of adding various topic permissions
    }
    
    @Override public void onError(int code, String desc) {
      // Topic permissions fail to be added
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onAddTopicPermission(String groupID, String permissionGroupID, HashMap<String, Long>topicPermissionMap) {
      // Topic permission adding notification
    }
});
```

【Swift】
``` swift
// Assume that it is required for members in the permission group to have the [permission to manage topic 1], [permission to mute members in topic 1], as well as the [permission to manage topic 2] and [permission to revoke others' messages in topic 2]
let topicPermission1 = V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC.rawValue | V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER.rawValue
let topicPermission2 = V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC.rawValue | V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE.rawValue

var topicPermissionMap = [String: NSNumber]()
topicPermissionMap["tipicID1"] = NSNumber(value: topicPermission1)
topicPermissionMap["tipicID2"] = NSNumber(value: topicPermission2)

V2TIMManager.shared.addTopicPermissionToPermissionGroup(groupID: "ID of the community for which topic permissions need to be added", permissionGroupID: "ID of the permission group for which topic permissions need to be added", topicPermissionMap: topicPermissionMap, succ: { resultList in
    // Topic permissions are successfully added, with the parameter including the results of adding various topic permissions
}, fail: { code, desc in
    // Topic permissions fail to be added
})

// Community event listener
V2TIMManager.shared.addCommunityListener(listener: self)

func onAddTopicPermission(groupID: String, permissionGroupID: String, topicPermissionMap: [String: NSNumber]) {
    // Topic permission adding notification
}
```

【Objective-C】
``` objectivec
// Assume that it is required for members in the permission group to have the [permission to manage topic 1], [permission to mute members in topic 1], as well as the [permission to manage topic 2] and [permission to revoke others' messages in topic 2]
uint64_t topicPermission1 = V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;
uint64_t topicPermission2 = V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE;
NSDictionary<NSString *,NSNumber *> *topicPermissionMap = [[NSMutableDictionary alloc] init];
[topicPermissionMap setValue:[NSNumber numberWithUnsignedLongLong:topicPermission1] forKey:@"ID of topic 1"];
[topicPermissionMap setValue:[NSNumber numberWithUnsignedLongLong:topicPermission2] forKey:@"ID of topic 2"];

[[V2TIMManager sharedInstance] addTopicPermissionToPermissionGroup:@"ID of the community for which topic permissions need to be added" permissionGroupID:@"ID of the permission group for which topic permissions need to be added" topicPermissionMap:topicPermissionMap succ:^(NSMutableArray<V2TIMTopicOperationResult *> *resultList){
    // Topic permissions are successfully added, with the parameter including the results of adding various topic permissions
} fail:^(int code, NSString *desc) {
    // Topic permissions fail to be added
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onAddTopicPermission:(NSString *)groupID permissionGroupID:(NSString *)permissionGroupID topicPermissionMap:(NSDictionary<NSString *,NSNumber *> *)topicPermissionMap {
    // Topic permission adding notification
}
```

【C++】
``` cpp
// Assume that it is required for members in the permission group to have the [permission to manage topic 1], [permission to mute members in topic 1], as well as the [permission to manage topic 2] and [permission to revoke others' messages in topic 2]
V2TIMStringToUint64Map topicPermissionMap;
topicPermissionMap.Insert("ID of topic 1",V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MUTE_MEMBER);
topicPermissionMap.Insert("ID of topic 2",V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE);

classTestCallBack : public V2TIMValueCallback<V2TIMTopicOperationResultVector> {
    void OnSuccess(constV2TIMTopicOperationResultVector &value) override {
      // Topic permissions are successfully added, with the parameter including the results of adding various topic permissions
    }
    void OnError(int error_code, const V2TIMString &error_message) override {
      // Topic permissions fail to be added
    }
};
auto *callback = new TestCallBack; V2TIMManager::GetInstance()->GetCommunityManager()->AddTopicPermissionToPermissionGroup("ID of the community for which topic permissions need to be added", "ID of the permission group for which topic permissions need to be added",topicPermissionMap, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnAddTopicPermission(const V2TIMString &groupID, const V2TIMString &permissionGroupID,constV2TIMStringToUint64Map &topicPermissionMap) override {
      // Topic permission adding notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
// Assume that it is required for members in the permission group to have the [permission to manage topic 1], [permission to mute members in topic 1], as well as the [permission to manage topic 2] and [permission to revoke others' messages in topic 2]
final int topicPermission1 =
    V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |
        V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;
final int topicPermission2 =
    V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |
        V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_REVOKE_OTHER_MEMBER_MESSAGE;

final Map<String, int> topicPermissionMap = {
  "ID of topic 1": topicPermission1,
  "ID of topic 2": topicPermission2,
};

final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .addTopicPermissionToPermissionGroup(
  groupID: "ID of the community for which topic permissions need to be added",
  permissionGroupID: "ID of the permission group for which topic permissions need to be added",
  topicPermissionMap: topicPermissionMap,
);

if (result.code == 0) {
  // Topic permissions are successfully added, with the parameter including the results of adding various topic permissions
} else {
  // Topic permissions fail to be added
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onAddTopicPermission:
        (String groupID, String permissionGroupID, Map<String, int> topicPermissionMap) {
      // Topic permission adding notification
    },
  ),
);
```

### Deleting Topic Permissions from a Permission Group

Group owners and members with permission to manage permission group information can call `deleteTopicPermissionFromPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#af3ee95182ef6b9520cb2d1c2729e575f),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.deletetopicpermissionfrompermissiongroup(groupid:permissiongroupid:topicidlist:succ:fail:)), [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a62e4be9f54405ddb0f16a158fb1b410f), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#ad03adcfeb7ca4733c00903e048b7b33d), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/deleteTopicPermissionFromPermissionGroup.html)) to remove topic permissions from a permission group.

The sample code is as follows:

【Java】
``` java
List<String> topicIDList = new ArrayList<>();
topicIDList.add("ID of topic 1");
topicIDList.add("ID of topic 2");

V2TIMManager.getCommunityManager().deleteTopicPermissionFromPermissionGroup("ID of the community from which topic permissions need to be deleted", "ID of the permission group from which topic permissions need to be deleted",topicIDList, new V2TIMValueCallback<List<V2TIMTopicOperationResult>>() {
    @Override
    public void onSuccess(List<V2TIMTopicOperationResult> v2TIMTopicOperationResults) {
      // Topic permissions are deleted successfully
    }
    @Override
    public void onError(int code, String desc) {
      // Topic permissions fail to be deleted
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onDeleteTopicPermission(String groupID, String permissionGroupID, List<String> topicIDList) {
      // Topic permission deletion notification
    }
});
```

【Swift】
``` swift
var topicIDList = Array<String>();
topicIDList.append("ID of topic 1");
topicIDList.append("ID of topic 2");

V2TIMManager.shared.deleteTopicPermissionFromPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", topicIDList: topicIDList, succ: { resultList in
    resultList.forEach { item in
        // V2TIMTopicOperationResult
        print( item.description)
    }
}, fail: { code, desc in
    print( "deleteTopicPermissionOfPermissionGroup fail, \(code), \(desc)")
})
          
// Community event listener
V2TIMManager.shared.addCommunityListener(listener: self)
func onDeleteTopicPermission(groupID: String, permissionGroupID: String, topicIDList: Array<String>) {
    print( "groupID:\(groupID), permissionGroupID:\(permissionGroupID), topicIDList:\(topicIDList)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *deleteTopicIDList = [NSMutableArray array];
[deleteTopicIDList addObject:@"ID of topic 1"];
[deleteTopicIDList addObject:@"ID of topic 2"];

[[V2TIMManager sharedInstance] deleteTopicPermissionFromPermissionGroup:@"ID of the community from which topic permissions need to be deleted" permissionGroupID:@"ID of the permission group from which topic permissions need to be deleted" topicIDList:deleteTopicIDList succ:^(NSMutableArray<V2TIMTopicOperationResult *> *resultList) {
    // Topic permissions are deleted successfully
} fail:^(int code, NSString *desc) {
    // Topic permissions fail to be deleted
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onDeleteTopicPermission:(NSString *)groupID permissionGroupID:(NSString *)permissionGroupID topicIDList:(NSArray<NSString *> *)topicIDList {
    // Topic permission deletion notification
}
```

【C++】
``` cpp
V2TIMStringVector topicIDList;
topicIDList.PushBack("ID of topic 1");
topicIDList.PushBack("ID of topic 2");

classTestCallBack : public V2TIMValueCallback<V2TIMTopicOperationResultVector> {
    void OnSuccess(const V2TIMTopicOperationResultVector &value) override {
      // Topic permissions are deleted successfully
    }
    void OnError(int error_code, constV2TIMString &error_message) override {
      // Topic permissions fail to be deleted
    }
};
auto *callback = new TestCallBack;V2TIMManager::GetInstance()->GetCommunityManager()->DeleteTopicPermissionFromPermissionGroup("ID of the community from which topic permissions need to be deleted","ID of the permission group from which topic permissions need to be deleted", topicIDList, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnDeleteTopicPermission(const V2TIMString &groupID, const V2TIMString &permissionGroupID,constV2TIMStringVector &topicIDList) override {
      // Topic permission deletion notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .deleteTopicPermissionFromPermissionGroup(
  groupID: "ID of the community from which topic permissions need to be deleted",
  permissionGroupID: "ID of the permission group from which topic permissions need to be deleted",
  topicIDList: ["ID of topic 1", "ID of topic 2"],
);

if (result.code == 0) {
  // Topic permissions are deleted successfully
} else {
  // Topic permissions fail to be deleted
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onDeleteTopicPermission:
        (String groupID, String permissionGroupID, List<String> topicIDList) {
      // Topic permission deletion notification
    },
  ),
);
```

### Modifying Topic Permissions of a Permission Group

Group owners and members with the permission to manage permission group information can call `modifyTopicPermissionInPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a52852fc6b1c18b6a3379d25ea4001acf),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.modifytopicpermissioninpermissiongroup(groupid:permissiongroupid:topicpermissionmap:succ:fail:)), [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#acad1c1d96c6860cf2a29643fbe8b6c7f), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a18b10f54678477153f4737de6579f042), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/modifyTopicPermissionInPermissionGroup.html)) to modify the topic permissions of a permission group.

The sample code is as follows:

【Java】
``` java
// Assume that it is required for members in a permission group to have the [permission to manage topics 1 and 2] and [permission to mute members in topics 1 and 2]
long topicPermission = V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;
HashMap<String, Long> topicPermissionMap = new HashMap<>();
topicPermissionMap.put("ID of topic 1",topicPermission);
topicPermissionMap.put("ID of topic 2", topicPermission);

V2TIMManager.getCommunityManager().modifyTopicPermissionInPermissionGroup("ID of the community where topic permissions need to be modified","ID of the permission group where topic permissions need to be modified",topicPermissionMap, new V2TIMValueCallback<List<V2TIMTopicOperationResult>>() {
    @Override
    public voidonSuccess(List<V2TIMTopicOperationResult> v2TIMTopicOperationResults) {
      // Topic permissions are successfully modified for the permission group
    }
    
    @Override
    public void onError(int code, String desc) {
      // Topic permissions fail to be modified for the permission group
    }
});

// Community group event listener
V2TIMManager.getCommunityManager().addCommunityListener(new V2TIMCommunityListener() {
    @Override
    public void onModifyTopicPermission(String groupID, String permissionGroupID, HashMap<String, Long>topicPermissionMap) {
      // Topic permission modification notification
    }
});
```

【Swift】
``` swift
// Assume that it is required for members in a permission group to have the [permission to manage topics 1 and 2] and [permission to mute members in topics 1 and 2]
var topicPermissionMap = Dictionary<String, NSNumber>()
let topicPermission = V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC.rawValue | V2TIMTopicPermissionValue.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER.rawValue
topicPermissionMap["ID of topic 1"] = NSNumber(value: topicPermission)
topicPermissionMap["ID of topic 2"] = NSNumber(value: topicPermission)

V2TIMManager.shared.modifyTopicPermissionInPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", topicPermissionMap: topicPermissionMap) { resultList in
    resultList.forEach { item in
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "modifyTopicPermissionInPermissionGroup(modify or add topic permission) fail, \(code), \(desc)")
}
// Community event listener
V2TIMManager.shared.addCommunityListener(listener: self)
func onModifyTopicPermission(groupID: String, permissionGroupID: String, topicPermissionMap: Dictionary<String, NSNumber>) {
    print( "groupID:\(groupID), permissionGroupID:\(permissionGroupID), topicPermissionMap:\(topicPermissionMap)")
}
```

【Objective-C】
``` objectivec
// Assume that it is required for members in a permission group to have the [permission to manage topics 1 and 2] and [permission to mute members in topics 1 and 2]
uint64_t topicPermission = V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;
NSDictionary<NSString *,NSNumber *> *topicPermissionMap = [[NSMutableDictionary alloc] init];
[topicPermissionMap setValue:[NSNumber numberWithUnsignedLongLong:topicPermission] forKey:@"ID of topic 1"];
[topicPermissionMap setValue:[NSNumber numberWithUnsignedLongLong:topicPermission] forKey:@"ID of topic 2"];

[[V2TIMManager sharedInstance] modifyTopicPermissionInPermissionGroup:@"ID of the community where topic permissions need to be modified" permissionGroupID:@"ID of the permission group where topic permissions need to be modified" topicPermissionMap:topicPermissionMap succ:^(NSMutableArray<V2TIMTopicOperationResult *>*resultList) {
    // Topic permissions are successfully modified for the permission group
} fail:^(int code, NSString *desc) {
    // Topic permissions fail to be modified for the permission group
}];

// Community event listener
[[V2TIMManager sharedInstance] addCommunityListener:self];
- (void)onModifyTopicPermission:(NSString *)groupID permissionGroupID:(NSString *)permissionGroupID topicPermissionMap:(NSDictionary<NSString *,NSNumber *> *)topicPermissionMap {
    // Topic permission modification notification
}
```

【C++】
``` cpp
// Assume that it is required for members in a permission group to have the [permission to manage topics 1 and 2] and [permission to mute members in topics 1 and 2]
V2TIMStringToUint64Map topicPermissionMap;
topicPermissionMap.Insert("ID of topic 1",V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MUTE_MEMBER);
topicPermissionMap.Insert("ID of topic 2",V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |V2TIMTopicPermissionValue::V2TIM_TOPIC_PERMISSION_MUTE_MEMBER);

class TestCallBack : public V2TIMValueCallback<V2TIMTopicOperationResultVector> {
    void OnSuccess(constV2TIMTopicOperationResultVector &value) override {
      // Topic permissions are successfully modified for the permission group
    }
    void OnError(int error_code,const V2TIMString &error_message) override {
      // Topic permissions fail to be modified for the permission group
    }
};
auto *callback = newTestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->ModifyTopicPermissionInPermissionGroup("ID of the community where topic permissions need to be modified", "ID of the permission group where topic permissions need to be modified",topicPermissionMap, callback);

// Community event listener
class CommunityListener final : public V2TIMCommunityListener {
public:
    CommunityListener() = default;
    ~CommunityListener() override = default;
    
    void OnModifyTopicPermission(const V2TIMString &groupID, const V2TIMString &permissionGroupID,constV2TIMStringToUint64Map &topicPermissionMap) override {
      // Topic permission modification notification
    }
};

CommunityListener communityListener;
V2TIMManager::GetInstance()->GetCommunityManager()->AddCommunityListener(&communityListener);
```

【Dart】
``` javascript
// Assume that it is required for members in a permission group to have the [permission to manage topics 1 and 2] and [permission to mute members in topics 1 and 2]
final int topicPermission =
    V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MANAGE_TOPIC |
        V2TimPermissionGroupInfo.V2TIM_TOPIC_PERMISSION_MUTE_MEMBER;

final Map<String, int> topicPermissionMap = {
  "topic1 ID": topicPermission,
  "topic2 ID": topicPermission,
};

final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .modifyTopicPermissionInPermissionGroup(
  groupID: "ID of the community where topic permissions need to be modified",
  permissionGroupID: "ID of the permission group where topic permissions need to be modified",
  topicPermissionMap: topicPermissionMap,
);

if (result.code == 0) {
  // Topic permissions are successfully modified for the permission group
} else {
  // Topic permissions fail to be modified for the permission group
}

// Community group event listener
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(
  listener: V2TimCommunityListener(
    onModifyTopicPermission:
        (String groupID, String permissionGroupID, Map<String, int> topicPermissionMap) {
      // Topic permission modification notification
    },
  ),
);
```

### Accessing Topic Permissions of a Permission Group

Group members can call `getTopicPermissionInPermissionGroup` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMCommunityManager.html#a380f75b59c0ee32911a7cba6a2a88971),[Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Community.html#v2timmanager.gettopicpermissioninpermissiongroup(groupid:permissiongroupid:topicidlist:succ:fail:)), [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Community_08.html#a7370db7c5f09c8106cd27c142d386262), [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMCommunityManager.html#a473a78a20b7025472f6d413dc6d48196), [Dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getTopicPermissionInPermissionGroup.html)) to access the list of topic permissions in a permission group. When `topicIDList` is set to a value, you can access certain topic permissions in a permission group. When `topicIDList` is empty, you can access all topic permissions in the permission group.

The sample code is as follows:

【Java】
``` java
List<String> topicIDList = new ArrayList<>();
// If topicIDList is set to a value, you can access a specific list of topic permissions. When topicIDList is empty, you can access all topic permissions lists
topicIDList.add("ID of topic 1");
topicIDList.add("ID of topic 2");
V2TIMManager.getCommunityManager().getTopicPermissionInPermissionGroup("ID of the community where topic permissions need to be accessed", "ID of the permission group where topic permissions need to be accessed", topicIDList, newV2TIMValueCallback<List<V2TIMTopicPermissionResult>>() {
    @Override
    public void onSuccess(List<V2TIMTopicPermissionResult> resultList) {
      // Topic permissions of the permission group are successfully accessed
    }
    
    @Override public void onError(int code, String desc) {
      // Topic permissions of the permission group fail to be accessed
    }
});
```

【Swift】
``` swift
var topicIDList = Array<String>();
topicIDList.append("ID of topic 1");
topicIDList.append("ID of topic 2");

V2TIMManager.shared.getTopicPermissionInPermissionGroup(groupID: "groupID", permissionGroupID: "permissionGroupID", topicIDList: topicIDList) { resultList in
    resultList.forEach { item in
        print( "\(item.description)")
    }
} fail: { code, desc in
    print( "getTopicPermissionInPermissionGroup fail, \(code), \(desc)")
}
```

【Objective-C】
``` objectivec
NSMutableArray *topicIDList = [NSMutableArray array];
// If topicIDList is set to a value, you can access a specific list of topic permissions. When topicIDList is empty, you can access all topic permissions lists
[topicIDList addObject:@"ID of topic 1"];
[topicIDList addObject:@"ID of topic 2"];

[[V2TIMManager sharedInstance] getTopicPermissionInPermissionGroup:@"ID of the community where topic permissions need to be accessed" permissionGroupID:@"ID of the permission group where topic permissions need to be accessed"topicIDList:topicIDList succ:^(NSMutableArray<V2TIMTopicPermissionResult *> *resultList) {
    // Topic permissions of the permission group are successfully accessed
} fail:^(int code, NSString *desc) {
    // Topic permissions of the permission group fail to be accessed
}];
```

【C++】
``` cpp
V2TIMStringVector topicIDList;
// If topicIDList is set to a value, you can access a specific list of topic permissions. When topicIDList is empty, you can access all topic permissions lists
topicIDList.PushBack("ID of topic 1");
topicIDList.PushBack("ID of topic 2");

class TestCallBack : public V2TIMValueCallback<V2TIMTopicPermissionResultVector> {
    void OnSuccess(constV2TIMTopicPermissionResultVector &value) override {
      // Topic permissions of the permission group are successfully accessed
    }
    void OnError(interror_code, const V2TIMString &error_message) override {
      // Topic permissions of the permission group fail to be accessed
    }
};
auto *callback = newTestCallBack;
V2TIMManager::GetInstance()->GetCommunityManager()->GetTopicPermissionInPermissionGroup("ID of the community where topic permissions need to be accessed", "ID of the permission group where topic permissions need to be accessed", topicIDList, callback);
```

【Dart】
``` javascript
// If topicIDList is set to a value, you can access a specific list of topic permissions. When topicIDList is empty, you can access all topic permissions lists
final result = await TencentImSDKPlugin.v2TIMManager
    .getCommunityManager()
    .getTopicPermissionInPermissionGroup(
  groupID: "ID of the community where topic permissions need to be accessed",
  permissionGroupID: "ID of the permission group where topic permissions need to be accessed",
  topicIDList: ["ID of topic 1", "ID of topic 2"],
);

if (result.code == 0) {
  // Topic permissions of the permission group are successfully accessed
} else {
  // Topic permissions of the permission group fail to be accessed
}
```

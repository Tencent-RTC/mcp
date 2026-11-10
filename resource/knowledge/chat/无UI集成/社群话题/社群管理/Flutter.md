---
sync_node_id: '108053288314249216'
nav_path:
  - "无 UI 集成"
  - "社群话题"
  - "社群管理"
  - "Flutter"
product: "chat"
---
## Feature Description

A community is a large group of people brought together by common topics, and multiple topics can be created under the same community based on different interests.
Community groups are used to manage group members. All topics under the same community group are shared among members, who can send and receive messages within each topic independently.
[**See use cases of community groups here.**](https://intl.cloud.tencent.com/document/product/1047/49713)
- Community and topic management APIs are in the `TencentImSDKPlugin.v2TIMManager.getGroupManager()` core class.

- Topic message APIs are in the `TencentImSDKPlugin.v2TIMManager.getMessageManager()` core class.

   > **Note: **
   > 
   >  This feature is supported by Flutter SDK v4.0.0 or later. To use it, you need to [purchase the Ultimate edition](https://www.tencentcloud.com/document/product/1047/34577), go to the [**console**](https://console.cloud.tencent.com/im/qun-setting), choose **Feature Configuration** > **Group configuration** > **Group feature configuration** > **Community**, and enable the community feature.
   > 

## Community Group Management

### Creating a community group

Call the `createCommunity` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/createCommunity.html)) API to create the community group.

Sample code:
``` dart
// Create a topic-enabled community
final info = V2TimGroupInfo(
  groupID: "",
  groupType: GroupType.Community,
  isSupportTopic: true,
  groupName: "testGroup",
);

await TencentImSDKPlugin.v2TIMManager.getCommunityManager().createCommunity(
  info: info,
  memberList: memberList,
);
```

### Getting the list of community groups joined

You can call `getJoinedCommunityList`([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getJoinedCommunityList.html)) to get the list of community groups joined.

Sample code:
``` dart
// Getting the list of community groups joined
V2TimValueCallback<List<V2TimGroupInfo>> groupList = await TencentImSDKPlugin.v2TIMManager.getCommunityManager().getJoinedCommunityList();
```

### Other management APIs

Other features can be used in the same way as an ordinary group feature and involve the following APIs:
| Category | Feature | API |
| --- | --- | --- |
| Community group management | <a href="https://intl.cloud.tencent.com/document/product/1047/48464">Joining a group</a> | joinGroup (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/joinGroup.html">dart</a>) |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48464">Leaving a group</a> | quitGroup (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/quitGroup.html">dart</a>) |  |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48464">Disbanding a group</a> | dismissGroup (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_manager/V2TIMManager/dismissGroup.html">dart</a>) |  |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48183">Getting the group profile</a> | getGroupsInfo (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupsInfo.html">dart</a>) |  |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48183">Modifying the group profile</a> | setGroupInfo (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupInfo.html">dart</a>) |  |
| Community group member management | <a href="https://intl.cloud.tencent.com/document/product/1047/48179">Getting the group member list</a> | getGroupMemberList (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMemberList.html">dart</a>) |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48176">Getting the profile of a group member</a> | getGroupMembersInfo (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/getGroupMembersInfo.html">dart</a>) |  |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48176">Modifying the profile of a group member</a> | setGroupMemberInfo (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/setGroupMemberInfo.html">dart</a>) |  |
| <a href="https://intl.cloud.tencent.com/document/product/1047/48179">Removing a group member</a> | kickGroupMember (<a href="https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_group_manager/V2TIMGroupManager/kickGroupMember.html">dart</a>) |  |

## Topic Management

Multiple topics can be created under the same community group. All the topics are shared among group members, who can send and receive messages within each topic independently.

> **Note: **
> To use the feature, you need to go to the [**console**](https://console.cloud.tencent.com/im/qun-setting), choose **Feature Configuration** > **Group configuration** > **Group feature configuration** > **Community**, enable the community feature and then enable the topic feature.
> 

### Creating a topic

You need to perform two steps to create a topic:
1. Create a `V2TIMTopicInfo` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_topic_info/V2TimTopicInfo-class.html)) object.

2. Call the `createTopicInCommunity` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/createTopicInCommunity.html)) API to create a topic.

   Sample code:

   ``` java
   // Create a topic
   communityManager.createTopicInCommunity(groupID: "groupID", topicInfo: V2TimTopicInfo.fromJson({
       "topicName":"topic"
   }));
   ```

### Deleting a topic

You can call the `deleteTopicFromCommunity`([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/deleteTopicFromCommunity.html)) API to delete a topic.

Sample code:
``` dart
// Delete a topic
communityManager.deleteTopicFromCommunity(groupID: "",topicIDList:["topicID"]);
```

### Modifying topic information

You need to perform two steps to modify the information of a topic:
1. Create a `V2TIMTopicInfo` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_topic_info/V2TimTopicInfo-class.html)) object and modify fields as needed.

2. Call the `setTopicInfo` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/setTopicInfo.html)) API to modify topic information.

   Sample code:

   ``` dart
   // Modify topic information
   communityManager.setTopicInfo(topicInfo:V2TimTopicInfo.fromJson({
       "topicName":"topicName"
   }));
   ```

### Getting the topic list

You can call the `getTopicInfoList` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_community_manager/V2TIMCommunityManager/getTopicInfoList.html)) API to get the topic list.
- If `topicIDList` is an empty array, the list of all topics of the community group will be got.

- If `topicIDList` is the ID of specified topics, the list of the specified topics will be got.

   Sample code:

   ``` dart
   // Get the topic list
   groupManager.getTopicInfoList(groupID: "",topicIDList: ['topicID']);
   ```

### Topic groups

The community is a new powerful tool for entertainment collaboration and supports the community-**group**-topic hierarchy to isolate messages.

The [`customInfo`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_info/V2TimGroupInfo/customInfo.html) of a community saves the topic group list of the community, while the [`customString`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_topic_info/V2TimTopicInfo/customString.html) field of each topic stores the topic group.
- When a community is loaded, the [`customInfo`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_info/V2TimGroupInfo/customInfo.html) field for the topic group list of the community (group) is used to display the group list. We recommend you store the field in the `List<String>` format.

- To get the topics in each group, traverse the topic list and get the group of each topic through the [`customString`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_topic_info/V2TimTopicInfo/customString.html) of [`V2TimTopicInfo`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_topic_info/V2TimTopicInfo-class.html).

   > **Note: **
   > 
   > You can customize the `key` value of the [`customInfo`](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/models_v2_tim_group_info/V2TimGroupInfo/customInfo.html) field for the topic group list of the community (group).
The following sample code names it `topic_category`.
   > 

#### Getting the list of groups in the community

Call the `getCommunityCategoryList(String groupID)` method. Sample code:
``` dart
getCommunityCategoryList(String groupID) async {
    final Map<String, String>? customInfo = await getCommunityCustomInfo(groupID);
    if(customInfo != null){
      final String? categoryListString = customInfo["topic_category"];
      if(categoryListString != null && categoryListString.isNotEmpty){
        return jsonDecode(categoryListString);
      }
    }
  }

 Future<Map<String, String>?> getCommunityCustomInfo(String groupID) async {
    V2TimValueCallback<List<V2TimGroupInfoResult>> res =
        await TencentImSDKPlugin.v2TIMManager
            .getGroupManager().getGroupsInfo(groupIDList: [groupID]);
    if(res.code != 0){
      final V2TimGroupInfoResult? groupInfo = res.data?[0];
      if(groupInfo != null){
        Map<String, String>? customInfo = groupInfo.groupInfo?.customInfo;
        return customInfo;
      }
    }
    return null;
  }
```

#### Configuring the group list for the community

You just need to modify the `customInfo` in `groupInfo`. Here is a `Map`, and the `key` value is the name of the field for the topic group list you defined.

The `getCommunityCustomInfo` method is implemented in the above section. Sample code:
``` dart
setCommunityCategoryList(String groupID, String groupType, List<String> newCategoryList) async {
    final Map<String, String>? customInfo = await getCommunityCustomInfo(groupID);
    customInfo?["topic_category"] = jsonEncode(newCategoryList);
    TencentImSDKPlugin.v2TIMManager
        .getGroupManager()
        .setGroupInfo(info: V2TimGroupInfo(
      customInfo: customInfo,
      groupID: groupID,
      groupType: groupType,
      // ...Other profiles
    ));
  }
```

#### Adding a topic to a group

It is recommended that you pass in JSON strings into `V2TimTopicInfo customString`.
For example, the recommended format for `categoryName` in the code below is `{"category":"Group 1"}`.

Sample code:
``` dart
addCategoryForTopic(String groupID, String categoryName) {
    TencentImSDKPlugin.v2TIMManager.getGroupManager().setTopicInfo(
      topicInfo: V2TimTopicInfo(
        customString: categoryName
      ),
      groupID: groupID, // Group ID of the topic
    );
  }
```

#### Getting the topic group

Use the `customString` after [getting the topic list](#getTopicList).

### Listening for topic callbacks

In `V2TIMCommunityListener` ([Details](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimCommunityListener/V2TimCommunityListener-class.html)), topic related callback methods `onCreateTopic`，`onDeleteTopic`，`onChangeTopicInfo` are added for topic event listening. 

Sample code:
``` dart
V2TIMCommunityListener v2TIMCommunityListener = new V2TIMCommunityListener() {
 onCreateTopic(String groupID, String topicID) {
      // Listen for topic creation notifications
  }

  onDeleteTopic(String groupID, List<String> topicIDList) {
      // Listen for topic deletion notifications
  }
    onChangeTopicInfo(String groupID, V2TIMTopicInfo topicInfo) {
      // Listen for topic information update notifications
  }
};
TencentImSDKPlugin.v2TIMManager.getCommunityManager().addCommunityListener(listener: v2TIMCommunityListener);
```

## Topic Messages

Topic messages can be used in the same way as ordinary messages and involve the following APIs:

|Feature|API|Description|
|---------|---------|---------|
|Sends a message|sendMessage ([dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/sendMessage.html))|Set `groupID` to the topic ID.|
|Receives a message|`onRecvNewMessage` method in `V2TIMAdvancedMsgListener` ([dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/enum_V2TimAdvancedMsgListener/V2TimAdvancedMsgListener-class.html))|Set `groupID` in the message to the topic ID.|
|Marks a message as read|cleanConversationUnreadMessageCount  ([dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_conversation_manager/V2TIMConversationManager/cleanConversationUnreadMessageCount.html))|Set `groupID` to the topic ID.|
|Gets historical messages|getGroupHistoryMessageList ([dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/getGroupHistoryMessageList.html))|Set `groupID` to the topic ID.|
|Recalls a message|revokeMessage ([dart](https://pub.dev/documentation/tencent_cloud_chat_sdk/latest/manager_v2_tim_message_manager/V2TIMMessageManager/revokeMessage.html))|Set `groupID` to the topic ID.|

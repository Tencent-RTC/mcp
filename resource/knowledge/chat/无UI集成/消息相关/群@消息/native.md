---
sync_node_id: '108053279226241024'
nav_path:
  - "无 UI 集成"
  - "消息相关"
  - "群 @ 消息"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Overview

The sender listens for the characters in the input box. When the user enters @, the group member selection UI will pop up. After the target group members are selected, the message will be displayed in the input box in the format of `"@A @B @C......"`, which can be further edited before sent.
In the group chat list of the receiver's conversation UI, the identifier `"someone@me"` or `"@ all"` will be displayed to remind the user that the user was mentioned by someone in the group chat.

## Feature Demonstration

Figure 1: When the @ character is detected in the input box on the chat UI, the user is redirected to the group member selection UI to select the target group members.
Figure 2: After selecting the target group members, the user goes back to the chat UI to edit and send the group @ message.
Figure 3: If a user is mentioned, the user receives the conversation update, and the "someone@me" information is displayed in the conversation `Cell`.

## Sending a Group @ Message
1. The sender listens for the text input box on the chat UI and launches the group member selection UI. After group members are selected, the ID and nickname information of the members is called back. The ID is used to create the `V2TIMMessage` object, while the nickname is to be displayed in the text box.

2. The sender calls the `createAtSignedGroupMessage` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a23c5c1305996f09c7ff004854b551877) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.createatsignedgroupmessage(message:atuserlist:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#adfb065794694a2061af2642f18c4aeb7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#af34abe1b5eac3df820a76e9710bc5fba)) to create a group @ message, get the `V2TIMMessage` object, and specify the target group members.

3. The sender calls `sendMessage` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMMessageManager.html#a28e01403acd422e53e999f21ec064795) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager+Message.html#v2timmanager.sendmessage(message:receiver:groupid:priority:onlineuseronly:offlinepushinfo:progress:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html#a681947465d6ab718da40f7f983740a21) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMMessageManager.html#a42db237e7ae52cd2aa7edebf4f435c61)) to send the created @ message object.

   Sample code:

   

【Java】
``` java
// Create a original text message
V2TIMMessage textMsg = V2TIMManager.getMessageManager().createTextMessage("text");
// Create a group @ message using the original text message, @ group members `user1` and `user2`
List<String> atUserList = new ArrayList<>();
atUserList.add("user1");
atUserList.add("user2");
V2TIMMessage atMsg = V2TIMManager.getMessageManager().createAtSignedGroupMessage(textMsg, atUserList);
// Send the group @ message
V2TIMManager.getMessageManager().sendMessage(atMsg, null, "toGroupID",  V2TIMMessage.V2TIM_PRIORITY_DEFAULT, false, null,  new V2TIMSendCallback<V2TIMMessage>() {
    @Override
    public void onError(int code, String desc) {
        // The group @ message failed to be sent
    }
    @Override
    public void onSuccess(V2TIMMessage v2TIMMessage) {
        // Group @ message sent successfully
    }
    @Override
    public void onProgress(int progress) {
    }
});
```

【Swift】
``` swift
// Create a original text message
if let textMsg = V2TIMManager.shared.createTextMessage(text: "text") {
// Create a group @ message using the original text message, @ group members `user1` and `user2`
    if let atMsg = V2TIMManager.shared.createAtSignedGroupMessage(message: textMsg, atUserList: ["user1", "user2"]) {
// Send the group @ message
        V2TIMManager.shared.sendMessage(message: atMsg, receiver: nil, groupID: "groupA", priority: .V2TIM_PRIORITY_NORMAL, onlineUserOnly: false, offlinePushInfo: nil, progress: nil, succ: {
            print("success")
        }, fail: { code, desc in
            print("error code: \(code), desc: \(desc)")
        })
    }
}
```

【Objective-C】
``` objectivec
// Create a original text message
V2TIMMessage *textMsg = [[V2TIMManager sharedInstance] createTextMessage:@"text"];
// Create a group @ message using the original text message, @ group members `user1` and `user2`
V2TIMMessage *atMsg = [[V2TIMManager sharedInstance] createAtSignedGroupMessage:textMsg atUserList:@[@"xixi", @"yahaha"]];
// Send the group @ message
[[V2TIMManager sharedInstance] sendMessage:atMsg receiver:nil groupID:@"groupA" priority:V2TIM_PRIORITY_NORMAL onlineUserOnly:NO offlinePushInfo:nil progress:nil succ:nil fail:nil];
```

【C++】
``` cpp
class SendCallback final : public V2TIMSendCallback {
public:
    using SuccessCallback = std::function<void(const V2TIMMessage&)>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;
    using ProgressCallback = std::function<void(uint32_t)>;

    SendCallback() = default;
    ~SendCallback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback,
                     ProgressCallback progress_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
        progress_callback_ = std::move(progress_callback);
    }

    void OnSuccess(const V2TIMMessage& message) override {
        if (success_callback_) {
            success_callback_(message);
        }
    }
    void OnError(int error_code, const V2TIMString& error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
    void OnProgress(uint32_t progress) override {
        if (progress_callback_) {
            progress_callback_(progress);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
    ProgressCallback progress_callback_;
};

V2TIMStringVector atUserList;
atUserList.PushBack("user1");
atUserList.PushBack("user2");
V2TIMMessage message = V2TIMManager::GetInstance()->GetMessageManager()->CreateTextMessage(u8"text");
V2TIMMessage at_message = V2TIMManager::GetInstance()->GetMessageManager()->CreateAtSignedGroupMessage(message, atUserList);

auto callback = new SendCallback{};
callback->SetCallback(
    [=](const V2TIMMessage& message) {
        // The group @ message failed to be sent
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        // Group @ message sent successfully
        delete callback;
    },
    [=](uint32_t progress) {});

V2TIMManager::GetInstance()->GetMessageManager()->SendMessage(
    at_message, "denny", {}, V2TIMMessagePriority::V2TIM_PRIORITY_NORMAL, false, {}, callback);
```

## Receiving a Group @ Message
1. When the conversation is loaded and updated, call the `groupAtInfolist` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMConversation.html#a54790b0fd99c2504a73b42b884fba8a9)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMConversation.html#v2timconversation.groupatinfolist) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMConversation.html#a5659c29a54304e89e61c25c2b073f8da) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMConversation.html#a297aabc46d5b475e8e5fbd2054e0a330)) of `V2TIMConversation` to get the @ data list of the conversation.

2. Call the `atType` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMGroupAtInfo.html#aebb86a00883eb70fdab2c5f4728aae5d) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMGroupAtInfo.html#v2timgroupatinfo.attype) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMGroupAtInfo.html#a1486d853fd6f8ae074714ec8059f7621) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMGroupAtInfo.html#a1486d853fd6f8ae074714ec8059f7621)) of the `V2TIMGroupAtInfo` object in the list to get the @ data type and update it to the @ information of the conversation.

   Sample code:

   

【Java】
``` java
// Obtain the group @ data list
List<V2TIMGroupAtInfo> atInfoList = conversation.getGroupAtInfoList();
// Parse the @ type (@me, @all members, @me and @all members)
boolean atMe = false;
boolean atAll = false;
String atTips = "";
for(V2TIMGroupAtInfo atInfo : atInfoList){
  if (atInfo.getAtType() == V2TIMGroupAtInfo.TIM_AT_ME){
    atMe = true;
    continue;
  }
  if (atInfo.getAtType() == V2TIMGroupAtInfo.TIM_AT_ALL){
    atAll = true;
    continue;
  }
}

// Based on the @ type, prompt:
if (atMe && !atAll) {
    atTips = "[Someone@me]";
} else if (!atMe && atAll) {
    atTips = "[@all]";
} else if (atMe && atAll) {
    atTips = "[someone@me][@all members]";
}
```

【Swift】
``` swift
// Obtain the group @ data list
if let atInfoList = conversation.groupAtInfolist {
// Parse the @ type (@me, @all members, @me and @all members)
    var atMe = false        // Whether it's @me
    var atAll = false       // Whether it's @all members
    var atTipsStr = ""
    for atInfo in atInfoList {
        switch atInfo.atType {
        case .V2TIM_AT_ME:
            atMe = true
        case .V2TIM_AT_ALL:
            atAll = true
        case .V2TIM_AT_ALL_AT_ME:
            atMe = true
            atAll = true
        default:
            break
        }
    }

    // Based on the @ type, prompt:
    if atMe && !atAll {
        atTipsStr = "[someone@me]"
    } else if !atMe && atAll {
        atTipsStr = "[@All]"
    } else if atMe && atAll {
        atTipsStr = "[someone@me][@All]"
    }

    print(atTipsStr)
}
```

【Objective-C】
``` objectivec
// Obtain the group @ data list
NSArray<V2TIMGroupAtInfo *> *atInfoList = conversation.groupAtInfolist;

// Parse the @ type (@me, @all members, @me and @all members)
BOOL atMe = NO;         // Whether it's @me
BOOL atAll = NO;        // Whether it's @all members
NSString *atTipsStr = @"";
for (V2TIMGroupAtInfo *atInfo in atInfoList) {
    switch (atInfo.atType) {
        case V2TIM_AT_ME:
            atMe = YES;
            break;
        case V2TIM_AT_ALL:
            atAll = YES;
            break;
        case V2TIM_AT_ALL_AT_ME:
            atMe = YES;
            atAll = YES;
            break;
        default:
            break;
    }
}

// Based on the @ type, prompt:
if (atMe && !atAll) {
    atTipsStr = @"[someone@me]";
}
if (!atMe && atAll) {
    atTipsStr = @"[@all members]";
}
if (atMe && atAll) {
    atTipsStr = @"[someone@me][@all members]";
}
```

【C++】
``` cpp
// Obtain the group @ data list
V2TIMGroupAtInfoVector groupAtInfolist = conversation.groupAtInfolist;
// Parse the @ type (@me, @all members, @me and @all members)
bool atMe = false;
bool atAll = false;
std::string atTips = "";

for (size_t i = 0; i < groupAtInfolist.Size(); ++i) {
    const V2TIMGroupAtInfo& atInfo = groupAtInfolist[i];
    switch (atInfo.atType) {
        case V2TIM_AT_ME:
            atMe = true;
            break;
        case V2TIM_AT_ALL:
            atAll = true;
            break;
        case V2TIM_AT_ALL_AT_ME:
            atMe = true;
            atAll = true;
            break;
        default:
            break;
    }
}

// Based on the @ type, prompt:
if (atMe && !atAll) {
    atTips = u8"[someone@me]";
} else if (!atMe && atAll) {
    atTips = u8"[@all members]";
} else if (atMe && atAll) {
    atTips = u8"[someone@me][@all members]";
}
```

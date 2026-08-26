## TUICallKit APIs

`TUICallKit` is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat. For directions on integration, see [Integrating TUICallKit](https://www.tencentcloud.com/document/product/647/50992).

## Overview

|API|Description|
|---------|---------|
|createInstance|Create a TUICallKit instance (singleton mode).|
|setSelfInfo|Set the user's profile picture and nickname.|
|calls|Initiate a one-to-one or multi-person call|
|join|Proactively join a call|
|setCallingBell|Set the ringtone.|
|enableMuteMode|Set whether to turn on the mute mode.|
|enableFloatWindow|Set whether to enable floating windows.|
|enableVirtualBackground|Set a blurred background.|
|enableIncomingBanner|Set whether to display incoming banner.|
|setScreenOrientation|Set the screen orientation.|

## Details

### createInstance

This API is used to create a `TUICallKit` singleton.
``` swift
public static func createInstance() -> TUICallKit
```

### setSelfInfo

This API is used to set the user's profile picture and nickname. The nickname cannot exceed 500 bytes, and the profile picture is specified by a URL.
``` swift
public func setSelfInfo(nickname: String, avatar: String, completion: CompletionClosure?)
```

|Parameter|Type|Description|
|---------|---------|---------|
|nickname|String|The nickname.|
|avatar|String|The profile picture.|
|completion|CompletionClosure|The result callback of the asynchronous operation.|

### calls

Initiate a call.

【Swift】
``` swift
public func calls(userIdList: [String], callMediaType: CallMediaType, params: CallParams?, completion: CompletionClosure?)
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|userIdList|[String]|Target user ID list|
|mediaType|[CallMediaType](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callmediatype)|Media type of the call, such as video call, voice call|
|params|[CallParams](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callparams)|Call extension parameters, such as room number, call invitation timeout|
|completion|CompletionClosure|Callback for the result of an asynchronous operation|

### join

Proactively join a call.

【Swift】
``` java
public func join(callId: String, completion: CompletionClosure?)
```

The parameters are described below:

|Parameter|Type|Meaning|
|---------|---------|---------|
|callId|String|The unique ID for this call|
|completion|CompletionClosure|The result callback of the asynchronous operation.|

### setCallingBell

This API is used to set the ringtone. `filePath` must be an accessible local file URL.

The ringtone set is associated with the device and does not change with user.

To reset the ringtone, pass in an empty string for `filePath`.
``` swift
public func setCallingBell(filePath: String)
```

### enableMuteMode

This API is used to turn silent mode on/off.

The default value is `false`, This API is used to set whether to play the music when user received a call.
``` swift
public func enableMuteMode(enable: Bool)
```

### enableFloatWindow

This API is used to set whether to enable floating windows.

The default value is `false`, and the floating window button in the top left corner of the call view is hidden. If it is set to `true`, the button will become visible.
``` swift
public func enableFloatWindow(enable: Bool)
```

## enableVirtualBackground

This API is used to set a blurred background.

The default value is `false`.
``` java
public func enableVirtualBackground(enable: Bool)
```

### enableIncomingBanner

The API is used to set whether show incoming banner when user received a new call invitation.

The default value is `false`, The callee will pop up a full-screen call view by default when receiving the invitation. If it is set to `true`, the callee will display a banner first.
``` swift
public func enableIncomingBanner(enable: Bool)
```

### setScreenOrientation

Set the screen orientation.

The default is portrait mode; orientation: 0-Portrait, 1-Landscape, 2-Auto.
``` swift
public func setScreenOrientation(orientation: Int, completion: CompletionClosure?)
```

## Deprecated Interface

### call

This API is used to make a (one-to-one) call.

> **Note：**
> It is recommended to use the [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)) API
>

``` swift
public func call(userId: String, callMediaType: TUICallMediaType)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|callMediaType|[TUICallMediaType](https://trtc.io/document/54902)|The call type, which can be video or audio.|

### call

This API is used to make a (one-to-one) call, support for custom room ID, call timeout, offline push content, etc.

> **Note：**
> It is recommended to use the [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)) API
>

``` swift
public func call(userId: String, callMediaType: TUICallMediaType, params: TUICallParams,
                 succ: @escaping TUICallSucc, fail: @escaping TUICallFail)
```

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|callMediaType|[TUICallMediaType](https://trtc.io/document/54902)|The call type, which can be video or audio.|
|params|[TUICallParams](https://trtc.io/document/54902)|Call extension parameters, such as roomID, call timeout, offline push info,etc.|

### groupCall

This API is used to make a group call.

> **Note:**
> - It is recommended to use the [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)) API
> - Before making a group call, you need to create a Chat group first.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/en/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/document/product/1047/50056) to integrate chat, call and other scenarios.

``` swift
public func groupCall(groupId: String, userIdList: [String], callMediaType: TUICallMediaType)
```

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|String|The group ID.|
|userIdList|Array|The target user IDs.|
|callMediaType|[TUICallMediaType](https://trtc.io/document/54902)|The call type, which can be video or audio.|

### groupCall

This API is used to make a group call, support for custom room ID, call timeout, offline push content, etc.

> **Note:**
> - It is recommended to use the [calls](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/calls(participantids:callmediatype:params:completion:)) API.
> - Before making a group call, you need to create a Chat group first.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/en/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/document/product/1047/50056) to integrate chat, call and other scenarios.

``` swift
public func groupCall(groupId: String, userIdList: [String], callMediaType: TUICallMediaType, params: TUICallParams,
                      succ: @escaping TUICallSucc, fail: @escaping TUICallFail)
```

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|String|The group ID.|
|userIdList|Array|The target user IDs.|
|callMediaType|[TUICallMediaType](https://trtc.io/document/54902)|The call type, which can be video or audio.|
|params|[TUICallParams](https://trtc.io/document/54902)|Call extension parameters, such as roomID, call timeout, offline push info, etc.|

### joinInGroupCall

This API is used to join a group call.

> **Note****:**
>
> - It is recommended to use the [join](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/callstore/join(callid:completion:)) API.
> - Before joining a group call, you need to create or join a Chat group in advance, and there are already users in the group who are in the call.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/document/product/1047/48466), or you can use [Chat UIKit](https://www.tencentcloud.com/document/product/1047/50056) to integrate chat, call and other scenarios.

``` swift
public func joinInGroupCall(roomId: TUIRoomId, groupId: String, callMediaType: TUICallMediaType)
```

|Parameter|Type|Description|
|---------|---------|---------|
|roomId|[TUIRoomId](https://trtc.io/document/54902)|The room ID.|
|groupId|String|The group ID.|
|callMediaType|[TUICallMediaType](https://trtc.io/document/54902)|The call type, which can be video or audio.|

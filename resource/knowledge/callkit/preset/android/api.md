## TUICallKit APIs

`TUICallKit` is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat. For directions on integration, see [Integrating TUICallKit](https://www.tencentcloud.com/document/product/647/50991).

## API Overview

|API|Description|
|---------|---------|
|createInstance|Creates a `TUICallKit` instance (singleton mode).|
|setSelfInfo|Sets the alias and profile photo.|
|calls|Initiates a one-to-one or multi-person call.|
|join|Proactively joins a call.|
|setCallingBell|Sets the ringtone.|
|enableMuteMode|Sets whether to turn on the mute mode.|
|enableFloatWindow|Sets whether to enable floating windows.|
|enableIncomingBanner|Sets whether to display incoming banner.|
|setScreenOrientation|Sets the screen orientation.|
|enableVirtualBackground|Sets a blurred background.|

## Details

### createInstance

This API is used to create a `TUICallKit` singleton.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun createInstance(context: Context): TUICallKit
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

TUICallKit createInstance(Context context);
```

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun setSelfInfo(nickname: String?, avatar: String?, completion: CompletionHandler?);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

TUICallKit createInstance(Context context);
```

The parameters are described below:
| Parameter | Type | Meaning |
| --- | --- | --- |
| nickname | String | The target user names. |
| avatar | String | The target user avatar. |
| completion | CompletionClosure | The result callback of the asynchronous operation. |

### calls

Initiates a one-to-one or multi-person call.

【kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit
import io.trtc.tuikit.atomicxcore.api.call.CallMediaType
import io.trtc.tuikit.atomicxcore.api.call.CallParams

fun calls(
    userIdList: List<String>, mediaType: CallMediaType,
    params: CallParams?, completion: CompletionHandler?
);
```

【Java】
``` java
 import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;
import io.trtc.tuikit.atomicxcore.api.call.CallMediaType;
import io.trtc.tuikit.atomicxcore.api.call.CallParams;

void calls(List<String> userIdList, CallMediaType mediaType, CallParams params, CompletionHandler completion);
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userIdList|List<String>|Target user ID list|
|mediaType|[CallMediaType](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html)|Media type of the call, such as video call, voice call|
|params|[CallParams](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-params/index.html)|Call extension parameters, such as room number, call invitation timeout|
|completion|CompletionClosure|Callback for the result of an asynchronous operation|

### join

Proactively joins a call.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun join(callId: String?, completion: CompletionHandler?);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void join(String callId, CompletionHandler completion);
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|callId|String|The unique ID for this call|
|completion|CompletionClosure|The result callback of the asynchronous operation.|

### setCallingBell

This API is used to set the ringtone. `filePath` must be an accessible local file URL.

The ringtone set is associated with the device and does not change with user.

To reset the ringtone, pass in an empty string for `filePath`.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun setCallingBell(filePath: String?);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void setCallingBell(String filePath);
```

### enableMuteMode

This API is used to turn silent mode on/off.

The default value is `false`, This API is used to set whether to play the music when user received a call.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun enableMuteMode(enable: Boolean);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void enableMuteMode(boolean enable);
```

### enableFloatWindow

This API is used to set whether to enable floating windows.

The default value is `false`, and the floating window button in the top left corner of the call view is hidden. If it is set to `true`, the button will become visible.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun enableFloatWindow(enable: Boolean);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void enableFloatWindow(boolean enable);
```

### enableIncomingBanner

The API is used to set whether show incoming banner when user received a new call invitation.

The default value is `false`, The callee will pop up a full-screen call view by default when receiving the invitation. If it is set to `true`, the callee will display a banner first.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun enableIncomingBanner(enable: Boolean);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void enableIncomingBanner(boolean enable);
```

### setScreenOrientation

Sets the screen orientation.

The default is portrait mode; orientation: 0-Portrait, 1-Landscape, 2-Auto.

【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun setScreenOrientation(orientation: Int);
```

【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

void setScreenOrientation(int orientation);
```

### enableVirtualBackground

This API is used to set a blurred background.

The default value is `false`.
``` java
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

fun enableVirtualBackground(enable: Boolean);
```

## Deprecated Interface

### call

This API is used to make a (one-to-one) call.

> **Note:**
> **It is recommended to use the** [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) **API.**
>

【Kotlin】
``` java
fun call(userId: String, callMediaType: TUICallDefine.MediaType)
```

【Java】
``` java
 void call(String userId, TUICallDefine.MediaType callMediaType)
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|callMediaType|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|The call type, which can be video or audio.|

### call

This API is used to make a (one-to-one) call, Support for custom room ID, call timeout, offline push content, etc.

> **Note:**
> **It is recommended to use the** [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) **API.**
>

【Kotlin】
``` java
fun call(
    userId: String, callMediaType: TUICallDefine.MediaType,
    params: CallParams?, callback: TUICommonDefine.Callback?
)
```

【Java】
``` java
 void call(String userId, TUICallDefine.MediaType callMediaType,
           TUICallDefine.CallParams params, TUICommonDefine.Callback callback)
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|userId|String|The target user ID.|
|callMediaType|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|The call type, which can be video or audio.|
|params|[TUICallDefine.CallParams](https://www.tencentcloud.com/document/product/647/54900#CallParams)|Call extension parameters, such as roomID, call timeout, offline push info,etc.|

### groupCall

This API is used to make a group call.

> **Note:**
> - It is recommended to use the [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) API.
> - Before making a group call, you need to create an Chat group first.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/en/document/product/1047/50057) to integrate chat, call and other scenarios.

【Kotlin】
``` java
fun groupCall(groupId: String, userIdList: List<String?>?, callMediaType: TUICallDefine.MediaType)
```

【Java】
``` java
void groupCall(String groupId, List<String> userIdList, TUICallDefine.MediaType callMediaType);
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|String|The group ID.|
|userIdList|List|The target user IDs.|
|callMediaType|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|The call type, which can be video or audio.|

### groupCall

This API is used to make a group call, Support for custom room ID, call timeout, offline push content, etc.

> **Note:**
> - It is recommended to use the [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) API.
> - Before making a group call, you need to create an Chat group first.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/en/document/product/1047/50057) to integrate chat, call and other scenarios.

【Kotlin】
``` java
fun groupCall(
    groupId: String, userIdList: List<String?>?,
    callMediaType: TUICallDefine.MediaType, params: CallParams?,
    callback: TUICommonDefine.Callback?
)
```

【Java】
``` java
void groupCall(String groupId, List<String> userIdList, TUICallDefine.MediaType callMediaType,
               TUICallDefine.CallParams params, TUICommonDefine.Callback callback);
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|groupId|String|The group ID.|
|userIdList|List|The target user IDs.|
|callMediaType|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|The call type, which can be video or audio.|
|params|[TUICallDefine.CallParams](https://www.tencentcloud.com/document/product/647/54900#CallParams)|Call extension parameters, such as roomID, call timeout, offline push info,etc.|

### joinInGroupCall

This API is used to join a group call.

> **Note:**
> - It is recommended to use the [join](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/join.html) API.
> - Before joining a group call, you need to create or join an Chat group in advance, and there are already users in the group who are in the call.
> - For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/en/document/product/1047/50057) to integrate chat, call and other scenarios.

【Kotlin】
``` java
fun joinInGroupCall(roomId: RoomId?, groupId: String?, callMediaType: TUICallDefine.MediaType?)
```

【Java】
``` java
void joinInGroupCall(TUICommonDefine.RoomId roomId, String groupId, TUICallDefine.MediaType callMediaType);
```

The parameters are described below:

|Parameter|Type|Description|
|---------|---------|---------|
|roomId|TUICommonDefine.RoomId|The room ID.|
|groupId|String|The group ID.|
|callMediaType|[TUICallDefine.MediaType](https://www.tencentcloud.com/document/product/647/54900#MediaType)|The call type, which can be video or audio.|

### disableControlButton

Hide the specified button.

> **Note：**
> - Currently supports hiding the following buttons:
> Camera, Microphone, Audio Device, Switch Camera, Invite User
>
> - **v3.2.+** version support.

【Kotlin】
``` java
fun disableControlButton(button: Constants.ControlButton?)
```

【Java】
``` java
void disableControlButton(Constants.ControlButton button);
```

|Parameter|Type|Description|
|---------|---------|---------|
|button|ControlButton|Hide button.|

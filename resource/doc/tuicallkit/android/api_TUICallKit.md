## TUICallKit APIs

`TUICallKit` is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat. For directions on integration, see [Integrating TUICallKit](https://www.tencentcloud.com/document/product/647/50991).

## API Overview
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[createInstance](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Creates a `TUICallKit` instance (singleton mode).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Sets the alias and profile photo.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Initiate a one-to-one or multi-person call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Proactively join a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Sets the ringtone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Sets whether to turn on the mute mode.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Sets whether to enable floating windows.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableIncomingBanner](https://write.woa.com/document/95824745037205504)</td>

<td rowspan="1" colSpan="1" >Sets whether to display incoming banner.</td>
</tr>
</table>


## Details

### createInstance

This API is used to create a `TUICallKit` singleton.




【Kotlin】
``` java
fun createInstance(context: Context): TUICallKit
```


【Java】
``` java
TUICallKit createInstance(Context context)
```

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.




【Kotlin】
``` java
fun setSelfInfo(nickname: String?, avatar: String?, callback: TUICommonDefine.Callback?)
```


【Java】
``` java
void setSelfInfo(String nickname, String avatar, TUICommonDefine.Callback callback)
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >An additional parameter. such as roomID, call timeout, offline push info,etc</td>
</tr>
</table>


### calls

Initiate a one-to-one or multi-person call.




【kotlin】
``` java
 fun calls(
     userIdList: List<String?>?, mediaType: TUICallDefine.MediaType?, 
     params: TUICallDefine.CallParams?, callback: TUICommonDefine.Callback?
)
```


【Java】
``` java
 void calls(List<String> userIdList, TUICallDefine.MediaType mediaType,
            TUICallDefine.CallParams params, TUICommonDefine.Callback callback)
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >An additional parameter. such as roomID, call timeout, offline push info,etc</td>
</tr>
</table>


### join

Proactively join a call.




【Kotlin】
``` java
 fun join(callId: String?, callback: TUICommonDefine.Callback?) 
```


【Java】
``` java
void join(String callId, TUICommonDefine.Callback callback)
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID for this call</td>
</tr>
</table>


### setCallingBell

This API is used to set the ringtone. `filePath` must be an accessible local file URL.

The ringtone set is associated with the device and does not change with user.

To reset the ringtone, pass in an empty string for `filePath`.




【Kotlin】
``` java
fun setCallingBell(filePath: String?)
```


【Java】
``` java
void setCallingBell(String filePath);
```

### enableMuteMode

This API is used to set whether to play the music when user received a call. 




【Kotlin】
``` java
fun enableMuteMode(enable: Boolean)
```


【Java】
``` java
void enableMuteMode(boolean enable);
```

### enableFloatWindow

This API is used to set whether to enable floating windows.

The default value is `false`, and the floating window button in the top left corner of the call view is hidden. If it is set to `true`, the button will become visible.




【Kotlin】
``` java
fun enableFloatWindow(enable: Boolean)
```


【Java】
``` java
void enableFloatWindow(boolean enable);
```

### enableIncomingBanner

The API is used to set whether show incoming banner when user received a new call invitation.

The default value is `false`, The callee will pop up a full-screen call view by default when receiving the invitation. If it is set to `true`, the callee will display a banner first.
``` java
fun enableIncomingBanner(enable: Boolean)
```

## Deprecated Interface

### call

This API is used to make a (one-to-one) call. **Note:  it is recommended to use the calls API.**




【Kotlin】
``` java
fun call(userId: String, callMediaType: TUICallDefine.MediaType)
```


【Java】
``` java
 void call(String userId, TUICallDefine.MediaType callMediaType)
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The target user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>
</table>


### call

This API is used to make a (one-to-one) call, Support for custom room ID, call timeout, offline push content, etc. **Note:  it is recommended to use the calls API.**




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
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The target user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Call extension parameters, such as roomID, call timeout, offline push info,etc</td>
</tr>
</table>


### groupCall

This API is used to make a group call. **Note:  it is recommended to use the calls API.**

> **Note:**
> 

> Before making a group call, you need to create an Chat group first.
> 

> For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/zh/document/product/1047/60520) to integrate chat, call and other scenarios.
> 





【Kotlin】
``` java
fun groupCall(groupId: String, userIdList: List<String?>?, callMediaType: TUICallDefine.MediaType)
```


【Java】
``` java
void groupCall(String groupId, List<String> userIdList, TUICallDefine.MediaType callMediaType);
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The group ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>
</table>


### groupCall

This API is used to make a group call, Support for custom room ID, call timeout, offline push content, etc. **Note:  it is recommended to use the calls API.**

> **Note:**
> 

> Before making a group call, you need to create an Chat group first.
> 

> For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/zh/document/product/1047/60520) to integrate chat, call and other scenarios.
> 





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
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The group ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >Call extension parameters, such as roomID, call timeout, offline push info,etc</td>
</tr>
</table>


### joinInGroupCall

This API is used to join a group call. **Note:  it is recommended to use the join API.**

> **Note:**
> 

> Before joining a group call, you need to create or join an Chat group in advance, and there are already users in the group who are in the call.
> 

> For details about how to create a group, see [Chat Group Management](https://www.tencentcloud.com/zh/document/product/1047/48466#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84), or you can use [Chat UIKit](https://www.tencentcloud.com/zh/document/product/1047/60520) to integrate chat, call and other scenarios.
> 





【Kotlin】
``` java
fun joinInGroupCall(roomId: RoomId?, groupId: String?, callMediaType: TUICallDefine.MediaType?) 
```


【Java】
``` java
void joinInGroupCall(TUICommonDefine.RoomId roomId, String groupId, TUICallDefine.MediaType callMediaType);
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUICommonDefine.RoomId](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The room ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The group ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://write.woa.com/document/114029061195374592)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>
</table>

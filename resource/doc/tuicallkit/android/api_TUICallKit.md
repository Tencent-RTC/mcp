## TUICallKit API 简介

TUICallKit API 是音视频通话组件的**含 UI 接口**，使用 TUICallKit API，您可以通过简单接口快速实现一个类微信的音视频通话场景，更详细的接入步骤，详情请参见 [快速接入TUICallKit](https://cloud.tencent.com/document/product/647/78729)。

## API 概览
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[createInstance](https://cloud.tencent.com/document/product/647/78750#createInstance)</td>

<td rowspan="1" colSpan="1" >创建 TUICallKit 实例（单例模式）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://cloud.tencent.com/document/product/647/78750#setSelfInfo)</td>

<td rowspan="1" colSpan="1" >设置用户的头像、昵称</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://cloud.tencent.com/document/product/647/78750#calls)</td>

<td rowspan="1" colSpan="1" >发起单人或多人通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://cloud.tencent.com/document/product/647/78750#join)</td>

<td rowspan="1" colSpan="1" >主动加入通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://cloud.tencent.com/document/product/647/78750#setCallingBell)</td>

<td rowspan="1" colSpan="1" >设置自定义来电铃音</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://cloud.tencent.com/document/product/647/78750#enableMuteMode)</td>

<td rowspan="1" colSpan="1" >开启/关闭静音模式</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://cloud.tencent.com/document/product/647/78750#enableFloatWindow)</td>

<td rowspan="1" colSpan="1" >开启/关闭悬浮窗功能</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableIncomingBanner](https://cloud.tencent.com/document/product/647/78750#enableIncomingBanner)</td>

<td rowspan="1" colSpan="1" >开启/关闭来电横幅显示</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setScreenOrientation](https://cloud.tencent.com/document/product/647/78750#setScreenOrientation)</td>

<td rowspan="1" colSpan="1" >设置通话界面显示方向</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableVirtualBackground](https://cloud.tencent.com/document/product/647/78750#enableVirtualBackground)</td>

<td rowspan="1" colSpan="1" >设置模糊背景</td>
</tr>
</table>


## API 详情

### createInstance

创建 TUICallKit 的单例。




【Kotlin】
``` java
fun createInstance(context: Context): TUICallKit
```


【Java】
``` java
TUICallKit createInstance(Context context)
```

### setSelfInfo

设置用户昵称、头像。用户昵称不能超过500字节，用户头像必须是 URL 格式。




【Kotlin】
``` java
fun setSelfInfo(nickname: String?, avatar: String?, callback: TUICommonDefine.Callback?)
```


【Java】
``` java
void setSelfInfo(String nickname, String avatar, TUICommonDefine.Callback callback)
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >nickname</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的昵称</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >avatar</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的头像</td>
</tr>
</table>


### calls



发起单人或多人通话。




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

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >目标用户的 userId 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://cloud.tencent.com/document/product/647/90338#CallParams)</td>

<td rowspan="1" colSpan="1" >通话扩展参数，例如：房间号、通话邀请超时时间，离线推送自定义内容等</td>
</tr>
</table>


### join



主动加入通话。




【Kotlin】
``` java
 fun join(callId: String?, callback: TUICommonDefine.Callback?) 
```


【Java】
``` java
void join(String callId, TUICommonDefine.Callback callback)
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >此次通话的唯一 ID</td>
</tr>
</table>


### setCallingBell

设置自定义来电铃音。
这里仅限传入本地文件地址，需要确保该文件目录是应用可以访问的。
- 铃声设置后与设备绑定，更换用户，铃声依旧会生效。

- 如需恢复默认铃声，`filePath`传空即可。


   


【Kotlin】
``` java
fun setCallingBell(filePath: String?)
```


【Java】
``` java
void setCallingBell(String filePath);
```


### enableMuteMode

开启/关闭静音模式。

开启后，收到通话请求，不会播放来电铃声。




【Kotlin】
``` java
fun enableMuteMode(enable: Boolean)
```


【Java】
``` java
void enableMuteMode(boolean enable);
```

### enableFloatWindow

开启/关闭悬浮窗功能。

默认为`false`，通话界面左上角的悬浮窗按钮隐藏，设置为 true 后显示。




【Kotlin】
``` java
fun enableFloatWindow(enable: Boolean)
```


【Java】
``` java
void enableFloatWindow(boolean enable);
```

### enableIncomingBanner

开启/关闭来电横幅显示。

默认为`false`，被叫端收到邀请后默认弹出全屏通话等待界面。开启后先展示一个横幅，然后根据需要拉起全屏通话界面。






【Kotlin】
``` java
fun enableIncomingBanner(enable: Boolean)
```


【Java】
``` java
void enableIncomingBanner(boolean enable);
```

### setScreenOrientation

设置通话界面显示方向。

默认为竖屏，orientation：0-Portrait、1-LandScape、2-Auto。




【Kotlin】
``` java
fun setScreenOrientation(orientation: Int) 
```


【Java】
``` java
void setScreenOrientation(int orientation);
```

### enableVirtualBackground

设置模糊背景。

默认值为：false。
``` java
fun enableVirtualBackground(enable: Boolean)
```

## 废弃接口

### call

拨打电话（1v1通话）。**注意：v2.9+版本废弃，建议使用 calls 接口。**




【Kotlin】
``` java
fun call(userId: String, mediaType: TUICallDefine.MediaType)
```


【Java】
``` java
 void call(String userId, TUICallDefine.MediaType mediaType)
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的 userId</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>
</table>


### call

拨打电话（1v1通话），支持自定义房间号、通话邀请超时时间，离线推送内容等。**注意：v2.9+版本废弃，建议使用 calls 接口。**




【Kotlin】
``` java
fun call(
    userId: String, mediaType: TUICallDefine.MediaType,
    params: CallParams?, callback: TUICommonDefine.Callback?
)
```


【Java】
``` java
 void call(String userId, TUICallDefine.MediaType mediaType, 
           TUICallDefine.CallParams params, TUICommonDefine.Callback callback)
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的 userId</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://cloud.tencent.com/document/product/647/90338#CallParams)</td>

<td rowspan="1" colSpan="1" >通话扩展参数，例如：房间号、通话邀请超时时间，离线推送自定义内容等</td>
</tr>
</table>


### groupCall

发起群组通话。**注意：v2.9+版本废弃，建议使用 calls 接口。**

> **注意：**
> 

> 使用群组通话前需要创建 IM 群组，如果已经创建，请忽略。
> 

> 群组的创建详见：[IM 群组管理](https://cloud.tencent.com/document/product/269/75394) ，或者您也可以直接使用 [IM TUIKit](https://cloud.tencent.com/document/product/269/37059)，一站式集成聊天、通话等场景。
> 





【Kotlin】
``` java
fun groupCall(groupId: String, userIdList: List<String?>?, mediaType: TUICallDefine.MediaType)
```


【Java】
``` java
void groupCall(String groupId, List<String> userIdList, TUICallDefine.MediaType mediaType);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >此次群组通话的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >目标用户的 userId 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>
</table>


### groupCall

发起群组通话，支持自定义房间号、通话邀请超时时间，离线推送内容等。**注意：v2.9+版本废弃，建议使用 calls 接口。**

> **注意：**
> 

> 使用群组通话前需要创建 IM 群组，如果已经创建，请忽略。
> 

> 群组的创建详见：[IM 群组管理](https://cloud.tencent.com/document/product/269/75394) ，或者您也可以直接使用 [IM TUIKit](https://cloud.tencent.com/document/product/269/37059)，一站式集成聊天、通话等场景。
> 





【Kotlin】
``` java
fun groupCall(
    groupId: String, userIdList: List<String?>?, mediaType: TUICallDefine.MediaType, 
    params: CallParams?, callback: TUICommonDefine.Callback?
)
```


【Java】
``` java
void groupCall(String groupId, List<String> userIdList, TUICallDefine.MediaType mediaType, 
               TUICallDefine.CallParams params, TUICommonDefine.Callback callback);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >此次群组通话的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >目标用户的 userId 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallParams](https://cloud.tencent.com/document/product/647/90338#CallParams)</td>

<td rowspan="1" colSpan="1" >通话扩展参数，例如：房间号、通话邀请超时时间，离线推送自定义内容等</td>
</tr>
</table>


### joinInGroupCall

加入群组中已有的音视频通话。**注意：v2.9+版本废弃，建议使用 join 接口。**

> **注意：**
> 

> 加入群组中已有的音视频通话前，需要提前创建或加入 IM 群组，并且群组中已有用户在通话中，如果已经创建，请忽略。
> 

> 群组的创建详见：[IM 群组管理](https://cloud.tencent.com/document/product/269/75394) ，或者您也可以直接使用 [IM TUIKit](https://cloud.tencent.com/document/product/269/37059)，一站式集成聊天、通话等场景。
> 





【Kotlin】
``` java
fun joinInGroupCall(roomId: RoomId?, groupId: String?, mediaType: TUICallDefine.MediaType?) 
```


【Java】
``` java
void joinInGroupCall(TUICommonDefine.RoomId roomId, String groupId, TUICallDefine.MediaType callMediaType);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUICommonDefine.RoomId](https://cloud.tencent.com/document/product/647/90338#RoomId)</td>

<td rowspan="1" colSpan="1" >此次通话的音视频房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >此次群组通话的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>
</table>

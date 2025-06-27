## TUICallKit API 简介

TUICallKit API 是音视频通话组件的**含 UI 接口**，使用TUICallKit API，您可以通过简单接口快速实现一个类微信的音视频通话场景，更详细的接入步骤，详情请参见 [快速接入（TUICallKit）](https://write.woa.com/document/86735801792671744)。

## API 概览
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[login](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >登录</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[logout](https://write.woa.com/#logout)</td>

<td rowspan="1" colSpan="1" >登出</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >设置用户的昵称、头像</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >发起通话。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >主动加入通话。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >开启/关闭静音模式</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >开启/关闭悬浮窗功能</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >设置自定义来电铃音</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableVirtualBackground](https://write.woa.com/document/94733520019521536)</td>

<td rowspan="1" colSpan="1" >开启/关闭虚拟背景功能</td>
</tr>
</table>


## API 详情

### login

登录。
``` cpp
Future<TUIResult> login(int sdkAppId, String userId, String userSig)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppId</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >用户 SDKAppID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >用户签名 userSig</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >返回值</td>

<td rowspan="1" colSpan="1" >[TUIResult](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >包含 code 和 message 信息：code 为空 ("") 表示调用成功；code 不为空 ("") 表示调用失败，失败原因见 message</td>
</tr>
</table>


### logout

登出。
``` cpp
Future<void> logout()
```

### setSelfInfo

设置用户昵称、头像。用户昵称不能超过500字节，用户头像必须是URL格式。
``` cpp
Future<TUIResult> setSelfInfo(String nickname, String avatar)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >nickName</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的昵称，非必填</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >avatar</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的头像，非必填</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >返回值</td>

<td rowspan="1" colSpan="1" >[TUIResult](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >包含 code 和 message 信息：code 为空 ("") 表示调用成功；code 不为空 ("") 表示调用失败，失败原因见 message</td>
</tr>
</table>


### calls

发起通话。**v2.9+ 版本支持。**
``` java
Future<TUIResult> calls(List<String> userIdList, TUICallMediaType mediaType, TUICallParams params)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >目标用户的userId 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如：`TUICallMediaType.video `或  `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallParams](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >**可选**通话扩展参数，例如：房间号、通话邀请超时时间，离线推送自定义内容等</td>
</tr>
</table>


### join

主动加入通话。**v2.9+ 版本支持。**
``` java
Future<void> join(String callId)
```
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


### enableMuteMode

开启后，收到通话请求，不会播放来电铃声。
``` javascript
Future<void> enableMuteMode(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >开启、关闭静音；true 表示开启静音</td>
</tr>
</table>


### enableFloatWindow

开启/关闭悬浮窗功能，设置为false后，通话界面左上角的悬浮窗按钮会隐藏。
``` javascript
Future<void> enableFloatWindow(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >开启、关闭悬浮窗功能；true 表示开启浮窗</td>
</tr>
</table>


### setCallingBell

自定义来电铃声：将铃声文件添加至主工程的`assets`资源中，传入资源文件名称即可。
``` javascript
Future<void> setCallingBell(String assetName)
```

### enableVirtualBackground

开启/关闭虚拟背景功能，开启虚拟背景功能后，您可以在 UI 上显示模糊背景的功能按钮，点击按钮可直接启用模糊背景功能。
``` javascript
Future<void> enableVirtualBackground(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >开启、关闭静音；true 表示开启静音</td>
</tr>
</table>


## 废弃接口

### call

拨打电话（1v1通话）。

> **注意：**
> 

> 该接口已在 v2.9+ 版本废弃，建议使用 calls 接口替代。
> 

``` cpp
Future<void> call(String userId, TUICallMediaType callMediaType, [TUICallParams? params])

```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >目标用户的 userID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如：`TUICallMediaType.video `或 `TUICallMediaType.audio`</td>
</tr>
</table>


### groupCall

发起群组通话，注意：使用群组通话前需要创建 IM 群组，如果已经创建，请忽略。

> **注意：**
> 

> 该接口已在 v2.9+ 版本废弃，建议使用 calls 接口替代。
> 

``` javascript
Future<void> groupCall(String groupId, List<String> userIdList, TUICallMediaType callMediaType,[TUICallParams? params])
```
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

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >目标用户的 userId 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如：`TUICallMediaType.video `或  `TUICallMediaType.audio`</td>
</tr>
</table>


### joinInGroupCall

加入群组中已有的音视频通话。

> **注意：**
> 

> 该接口已在 v2.9+ 版本废弃，建议使用 join 接口替代。
> 

``` javascript
Future<void> joinInGroupCall(TUIRoomId roomId, String groupId, TUICallMediaType callMediaType)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUIRoomID](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >此次通话的音视频房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >此次群组通话的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如：`TUICallMediaType.video `或 `TUICallMediaType.audio`</td>
</tr>
</table>

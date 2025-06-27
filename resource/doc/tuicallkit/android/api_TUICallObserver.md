## TUICallObserver API 简介

TUICallObserver 是 TUICallEngine 对应的回调事件类，您可以通过此回调，来监听自己感兴趣的回调事件。

## 回调事件概览
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onError](https://cloud.tencent.com/document/product/647/78751#onError)</td>

<td rowspan="1" colSpan="1" >通话过程中错误回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallReceived](https://cloud.tencent.com/document/product/647/78751#onCallReceived)</td>

<td rowspan="1" colSpan="1" >通话请求的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallBegin](https://cloud.tencent.com/document/product/647/78751#onCallBegin)</td>

<td rowspan="1" colSpan="1" >通话接通的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://cloud.tencent.com/document/product/647/78751#onCallEnd)</td>

<td rowspan="1" colSpan="1" >通话结束的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallNotConnected](https://cloud.tencent.com/document/product/647/78751#onCallNotConnected)</td>

<td rowspan="1" colSpan="1" >通话未接通的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserReject](https://cloud.tencent.com/document/product/647/78751#onUserReject)</td>

<td rowspan="1" colSpan="1" >xxxx 用户拒绝通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNoResponse](https://cloud.tencent.com/document/product/647/78751#onUserNoResponse)</td>

<td rowspan="1" colSpan="1" >xxxx 用户不响应的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLineBusy](https://cloud.tencent.com/document/product/647/78751#onUserLineBusy)</td>

<td rowspan="1" colSpan="1" >xxxx 用户忙线的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserInviting](https://cloud.tencent.com/document/product/647/78751#onUserInviting)</td>

<td rowspan="1" colSpan="1" >xxxx 用户被追加邀请加入通话时的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserJoin](https://cloud.tencent.com/document/product/647/78751#onUserJoin)</td>

<td rowspan="1" colSpan="1" >xxxx 用户加入通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLeave](https://cloud.tencent.com/document/product/647/78751#onUserLeave)</td>

<td rowspan="1" colSpan="1" >xxxx 用户离开通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVideoAvailable](https://cloud.tencent.com/document/product/647/78751#onUserVideoAvailable)</td>

<td rowspan="1" colSpan="1" >xxxx 用户是否有视频流的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://cloud.tencent.com/document/product/647/78751#onUserAudioAvailable)</td>

<td rowspan="1" colSpan="1" >xxxx 用户是否有音频流的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVoiceVolumeChanged](https://cloud.tencent.com/document/product/647/78751#onUserVoiceVolumeChanged)</td>

<td rowspan="1" colSpan="1" >所有用户音量大小的反馈回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNetworkQualityChanged](https://cloud.tencent.com/document/product/647/78751#onUserNetworkQualityChanged)</td>

<td rowspan="1" colSpan="1" >所有用户网络质量的反馈回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onKickedOffline](https://cloud.tencent.com/document/product/647/78751#onKickedOffline)</td>

<td rowspan="1" colSpan="1" >当前用户被踢下线</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserSigExpired](https://cloud.tencent.com/document/product/647/78751#onUserSigExpired)</td>

<td rowspan="1" colSpan="1" >在线时票据过期</td>
</tr>
</table>


## 回调事件详情

### onError

错误回调。

> **说明：**
> 

> SDK 不可恢复的错误，一定要监听，并分情况给用户适当的界面提示。
> 

``` java
void onError(int code, String message);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >code</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >错误码</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >message</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >错误信息</td>
</tr>
</table>


### onCallReceived

收到一个新的来电请求回调，被叫会收到，您可以通过监听这个事件，来决定是否显示通话接听界面。
``` java
void onCallReceived(String callId, String callerId, List<String> calleeIdList, 
                    TUICallDefine.MediaType mediaType, TUICallDefine.CallObserverExtraInfo info);
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

<tr>
<td rowspan="1" colSpan="1" >callerId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >主叫 ID（邀请方）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >calleeIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >被叫 ID 列表（被邀请方）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，比如视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://cloud.tencent.com/document/product/647/90338#CallObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >其他信息</td>
</tr>
</table>


### onCallBegin

表示通话接通，主叫和被叫都可以收到，您可以通过监听这个事件来开启云端录制、内容审核等流程。
``` java
void onCallBegin(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallObserverExtraInfo info);
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

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://cloud.tencent.com/document/product/647/90338#CallObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >其他信息</td>
</tr>
</table>


### onCallEnd

表示通话挂断，主叫和被叫都可以收到，您可以通过监听这个事件来显示通话时长、通话类型等信息，或者来停止云端的录制流程。
``` java
void onCallEnd(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallEndReason reason, 
               String userId, long totalTime, TUICallDefine.CallObserverExtraInfo info);
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

<td rowspan="1" colSpan="1" >此次通话的音视频房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallEndReason](https://cloud.tencent.com/document/product/647/90338#CallEndReason)</td>

<td rowspan="1" colSpan="1" >通话结束原因</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >结束通话的用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >long</td>

<td rowspan="1" colSpan="1" >此次通话的时长，单位：秒</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://cloud.tencent.com/document/product/647/90338#CallObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >其他信息</td>
</tr>
</table>


> **注意：**
> 

> 客户端的事件一般都会随着杀进程等异常事件丢失掉，如果您需要通过监听通话时长来完成计费等逻辑，建议可以使用 REST API 来完成这类流程。
> 


### onCallNotConnected

表示此次通话主叫取消、被叫超时、拒接等，涉及多个场景，您可以通过监听这个事件来实现类似未接来电、重置 UI 状态等显示逻辑。
- 主叫取消：主叫收到该回调（userId 为自己）；被叫收到该回调（userId 为**主叫的 ID）。**

- 被叫超时：主叫会同时收到 [onUserNoResponse](https://cloud.tencent.com/document/product/647/78751#onUserNoResponse) 和 onCallNotConnected 回调（userId 是自己的 ID）；被叫收到 onCallNotConnected 回调（userId 是自己的 ID）。

- 被叫拒接：主叫会同时收到 [onUserReject](https://cloud.tencent.com/document/product/647/78751#onUserReject) 和 onCallNotConnected 回调（userId 是自己的 ID）；被叫收到 onCallNotConnected 回调（userId 是自己的 ID）。

- 被叫忙线：主叫会同时收到 [onUserLineBusy](https://cloud.tencent.com/document/product/647/78751#onUserLineBusy) 和 onCallNotConnected 回调（userId 是自己的 ID）。

- 异常中断：被叫接收通话失败，收到该回调（userId 是自己的 ID）。

   ``` java
   void onCallNotConnected(String callId, TUICallDefine.MediaType mediaType, TUICallDefine.CallEndReason reason, 
                           String userId, TUICallDefine.CallObserverExtraInfo info)
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

<td rowspan="1" colSpan="1" >此次通话的音视频房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallEndReason](https://cloud.tencent.com/document/product/647/90338#CallEndReason)</td>

<td rowspan="1" colSpan="1" >通话未连接原因</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >导致通话未连接的用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.CallObserverExtraInfo](https://cloud.tencent.com/document/product/647/90338#CallObserverExtraInfo)</td>

<td rowspan="1" colSpan="1" >其他信息</td>
</tr>
</table>


### onUserReject

通话被拒绝的回调，在1v1 通话中，只有主叫方会收到拒绝回调，在群组通话中，所有被邀请者都可以收到该回调。
``` java
void onUserReject(String userId);
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

<td rowspan="1" colSpan="1" >拒绝用户的 ID</td>
</tr>
</table>


### onUserNoResponse

对方无回应的回调。
``` java
void onUserNoResponse(String userId);
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

<td rowspan="1" colSpan="1" >无响应用户的 ID</td>
</tr>
</table>


### onUserInviting

用户被追加邀请加入通话时的回调。
``` java
void onUserInviting(String userId);
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

<td rowspan="1" colSpan="1" >被追加邀请用户的 ID</td>
</tr>
</table>


### onUserLineBusy

通话忙线回调。
``` java
void onUserLineBusy(String userId);
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

<td rowspan="1" colSpan="1" >忙线用户的 ID</td>
</tr>
</table>


### onUserJoin

有用户进入此次通话的回调。
``` java
void onUserJoin(String userId);
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

<td rowspan="1" colSpan="1" >加入当前通话的用户 ID</td>
</tr>
</table>


### onUserLeave

有用户离开此次通话的回调。
``` java
void onUserLeave(String userId);
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

<td rowspan="1" colSpan="1" >离开当前通话的用户 ID</td>
</tr>
</table>


### onUserVideoAvailable

用户是否开启视频上行回调。
``` java
void onUserVideoAvailable(String userId, boolean isVideoAvailable);
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

<td rowspan="1" colSpan="1" >通话用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isVideoAvailable</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >用户视频是否可用</td>
</tr>
</table>


### onUserAudioAvailable

用户是否开启音频上行回调。
``` java
void onUserAudioAvailable(String userId, boolean isAudioAvailable);
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

<td rowspan="1" colSpan="1" >用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isAudioAvailable</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >用户音频是否可用</td>
</tr>
</table>


### onUserVoiceVolumeChanged

用户通话音量的回调。
``` java
void onUserVoiceVolumeChanged(Map<String, Integer> volumeMap);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >volumeMap</td>

<td rowspan="1" colSpan="1" >Map<String, Integer></td>

<td rowspan="1" colSpan="1" >音量表，根据每个 userId 可以获取对应用户的音量大小，音量最小值为0，音量最大值为100</td>
</tr>
</table>


### onUserNetworkQualityChanged

用户网络质量的回调。
``` java
void onUserNetworkQualityChanged(List<TUICallDefine.NetworkQualityInfo> networkQualityList);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >networkQualityList</td>

<td rowspan="1" colSpan="1" >List</td>

<td rowspan="1" colSpan="1" >网络状态，根据每个 userId 可以获取对应用户当前的网络质量</td>
</tr>
</table>


### onKickedOffline

当前用户被踢下线：此时可以 UI 提示用户，并再次重新调用初始化。
``` java
void onKickedOffline();
```

### onUserSigExpired

在线时票据过期：此时您需要生成新的 userSig，并再次重新调用初始化。
``` java
void onUserSigExpired();
```

## 废弃回调

### onCallCancelled



表示此次通话主叫取消、被叫超时、拒接等，涉及多个场景，您可以通过监听这个事件来实现类似未接来电、重置 UI 状态等显示逻辑。
- 主叫取消：主叫收到该回调（userId 为自己）；被叫收到该回调（userId 为**主叫的 ID）。**

- 被叫超时：主叫会同时收到 [onUserNoResponse](https://cloud.tencent.com/document/product/647/78751#onUserNoResponse) 和 onCallCancelled 回调（userId 是自己的 ID）；被叫收到 onCallCancelled 回调（userId 是自己的 ID）。

- 被叫拒接：主叫会同时收到 [onUserReject](https://cloud.tencent.com/document/product/647/78751#onUserReject) 和 onCallCancelled 回调（userId 是自己的 ID）；被叫收到 onCallCancelled 回调（userId 是自己的 ID）。

- 被叫忙线：主叫会同时收到 [onUserLineBusy](https://cloud.tencent.com/document/product/647/78751#onUserLineBusy) 和 onCallCancelled 回调（userId 是自己的 ID）。

- 异常中断：被叫接收通话失败，收到该回调（userId 是自己的 ID）。

   ``` java
   void onCallCancelled(String userId);
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

<td rowspan="1" colSpan="1" >用户的 ID</td>
</tr>
</table>


### onCallMediaTypeChanged



表示通话的媒体类型发生变化。
``` java
void onCallMediaTypeChanged(TUICallDefine.MediaType oldCallMediaType,TUICallDefine.MediaType newCallMediaType);
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >oldCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >旧的通话类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >newCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallDefine.MediaType](https://cloud.tencent.com/document/product/647/90338#MediaType)</td>

<td rowspan="1" colSpan="1" >新的通话类型</td>
</tr>
</table>

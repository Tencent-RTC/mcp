## TUICallObserver API 简介

TUICallObserver 是 TUICallKit 对应的回调事件类，您可以通过此回调，来监听自己感兴趣的回调事件。

## 回调事件概览
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onError](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >通话过程中错误回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserInviting](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >当用户被邀请加入通话时的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallReceived](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >通话请求的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallNotConnected](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >当前设备未接通通话。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallBegin](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >通话接通的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onCallEnd](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >通话结束的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserReject](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户拒绝通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNoResponse](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户不响应的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLineBusy](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户忙线的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserJoin](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户加入通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserLeave](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户离开通话的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVideoAvailable](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户是否有视频流的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserAudioAvailable](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >xxxx 用户是否有音频流的回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserVoiceVolumeChanged](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >所有用户音量大小的反馈回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserNetworkQualityChanged](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >所有用户网络质量的反馈回调</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onKickedOffline](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >当前用户被移下线</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[onUserSigExpired](https://write.woa.com/document/94733532341563392)</td>

<td rowspan="1" colSpan="1" >在线时票据过期</td>
</tr>
</table>


## 回调事件详情

通过 addObserver 监听Flutter插件抛出的事件。
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onError: (int code, String message) {

    },
    onUserInviting: (String userId) {

    },
    onCallReceived: (String callId, String callerId, List<String> calleeIdList,
        TUICallMediaType mediaType, CallObserverExtraInfo info) {

    },
    onCallNotConnected: (String callId, TUICallMediaType mediaType, CallEndReason reason,
        String userId, CallObserverExtraInfo info) {
      
    },
    onCallBegin: (String callId, TUICallMediaType mediaType, CallObserverExtraInfo info) {

    },
    onCallEnd: (String callId, TUICallMediaType mediaType, CallEndReason reason,
        String userId, double totalTime, CallObserverExtraInfo info) {

    },
    onCallMediaTypeChanged: (TUICallMediaType oldCallMediaType, TUICallMediaType newCallMediaType) {

    },
    onUserReject: (String userId) {

    },
    onUserNoResponse: (String userId) {

    },
    onUserLineBusy: (String onUserLineBusy) {

    },
    onUserJoin: (String userId) {

    },
    onUserLeave: (String userId) {

    },
    onUserVideoAvailable: (String userId, bool isVideoAvailable) {

    },
    onUserAudioAvailable: (String userId, bool isAudioAvailable) {

    },
    onUserNetworkQualityChanged: (List<TUINetworkQualityInfo> networkQualityList) {

    },
    onUserVoiceVolumeChanged: (Map<String, int> volumeMap) {

    },
    onKickedOffline: () {

    },
    onUserSigExpired: () {

    }
));
```

### onError

错误事件回调。

> **说明**
> 

> SDK 不可恢复的错误，一定要监听，并分情况给用户适当的界面提示。
> 

``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onError: (int code, String message) {
      // TODO    
    }
));
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


### onUserInviting

当用户被邀请加入通话时的回调
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserInviting: (String userId) {
      // TODO
    }
));
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

<td rowspan="1" colSpan="1" >被邀请的用户 ID</td>
</tr>
</table>


### onCallReceived

收到一个新的来电请求回调，被叫会收到，您可以通过监听这个事件，来决定是否显示通话接听界面。
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallReceived: (String callId, String callerId, List<String> calleeIdList, TUICallMediaType mediaType, CallObserverExtraInfo info) {
      // TODO
    }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >扩展信息</td>
</tr>
</table>


### onCallNotConnected

通话取消的回调
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
  onCallNotConnected: (String callId, TUICallMediaType mediaType, CallEndReason reason,
    String userId, CallObserverExtraInfo info) {
    // TODO
  }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[CallEndReason](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话结束的原因</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >结束通话的用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >扩展信息</td>
</tr>
</table>


### onCallBegin

表示通话接通，主叫和被叫都可以收到，您可以通过监听这个事件来开启云端录制、内容审核等流程。
``` java
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallBegin: (String callId, TUICallMediaType mediaType, CallObserverExtraInfo info) {
    // TODO
  }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >扩展信息</td>
</tr>
</table>


### onCallEnd

表示通话接通，主叫和被叫都可以收到，您可以通过监听这个事件来显示通话时长、通话类型等信息，或者来停止云端的录制流程。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallEnd: (String callId, TUICallMediaType mediaType, CallEndReason reason,
        String userId, double totalTime, CallObserverExtraInfo info) {
    // TODO
  }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reason</td>

<td rowspan="1" colSpan="1" >[CallEndReason](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话结束的原因</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >结束通话的用户 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >double</td>

<td rowspan="1" colSpan="1" >此次通话的时长，单位 ms</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >info</td>

<td rowspan="1" colSpan="1" >[CallObserverExtraInfo](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >扩展信息</td>
</tr>
</table>


> **注意：**
> 

> 客户端的事件一般都会随着杀进程等异常事件丢失掉，如果您需要通过监听通话时长来完成计费等逻辑，建议可以使用 REST API 来完成这类流程。
> 


### onUserReject

通话被拒绝的回调，在1v1 通话中，只有主叫方会收到拒绝回调，在群组通话中，所有被邀请者都可以收到该回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserReject: (String userId) {  
      //您的回调处理逻辑    
    }
));
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >res.userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >拒绝用户的 ID</td>
</tr>
</table>


### onUserNoResponse

对方无回应的回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserNoResponse: (String userId) { 
      //您的回调处理逻辑    
    }
));
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


### onUserLineBusy

通话忙线回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserLineBusy: (String onUserLineBusy) { 
      //您的回调处理逻辑    
    },
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserJoin: (String userId) {
      //您的回调处理逻辑    
    }
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserLeave: (String userId) { 
      //您的回调处理逻辑       
    }
));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserVideoAvailable: (String userId, bool isVideoAvailable) { 
      //您的回调处理逻辑       
    }
));
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

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >用户视频是否可用</td>
</tr>
</table>


### onUserAudioAvailable

用户是否开启音频上行回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserAudioAvailable: (String userId, bool isAudioAvailable) {  
      //您的回调处理逻辑       
    }
));
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

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >用户音频是否可用</td>
</tr>
</table>


### onUserVoiceVolumeChanged

用户通话音量的回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserVoiceVolumeChanged: (Map<String, int> volumeMap) {  
      //您的回调处理逻辑    
    }
));
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

<td rowspan="1" colSpan="1" >Map<String, int></td>

<td rowspan="1" colSpan="1" >音量表，根据每个 userId 可以获取对应用户的音量大小，音量最小值为0，音量最大值为100</td>
</tr>
</table>


### onUserNetworkQualityChanged

用户网络质量的回调。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserNetworkQualityChanged: (List<TUINetworkQualityInfo> networkQualityList) {
      //您的回调处理逻辑    
    }
));

//TUINetworkQualityInfo的定义如下：
class TUINetworkQualityInfo {    
    String userId;  
    TUINetworkQuality quality;  
    TUINetworkQualityInfo({required this.userId, required this.quality});
}
// TUINetworkQuality的定义如下：
enum TUINetworkQuality {  
  unknown,  
  excellent,
  good,  
  poor,  
  bad,  
  vBad,  
  down
}
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

<td rowspan="1" colSpan="1" >List<[TUINetworkQualityInfo](https://write.woa.com/document/109226385552285696)></td>

<td rowspan="1" colSpan="1" >网络状态，根据每个 userId 可以获取对应用户当前的网络质量</td>
</tr>
</table>


### onKickedOffline

当前用户被踢下线：此时可以 UI 提示用户，并再次重新调用初始化。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onKickedOffline: () { 
      //您的回调处理逻辑    
    }
));
```

### onUserSigExpired

在线时票据过期：此时您需要生成新的 userSig，并再次重新调用初始化。
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onUserSigExpired: () {  
      //您的回调处理逻辑    
    }  
));
```

## 废弃回调

### onCallCancelled

表示此次通话主叫取消、被叫超时、拒接等，涉及多个场景，您可以通过监听这个事件来实现类似未接来电、重置 UI 状态等显示逻辑。
- 主叫取消：主叫收到该回调（userId 为自己）；被叫收到该回调（userId 为**主叫的 ID）。**

- 被叫超时：主叫会同时收到 [onUserNoResponse](https://write.woa.com/document/94733532341563392) 和 onCallCancelled 回调（userId 是自己的 ID）；被叫收到 onCallCancelled 回调（userId 是自己的 ID）。

- 被叫拒接：主叫会同时收到 [onUserReject](https://write.woa.com/document/94733532341563392) 和 onCallCancelled 回调（userId 是自己的 ID）；被叫收到 onCallCancelled 回调（userId 是自己的 ID）。

- 被叫忙线：主叫会同时收到 [onUserLineBusy](https://write.woa.com/document/94733532341563392) 和 onCallCancelled 回调（userId 是自己的 ID）。

- 异常中断：被叫接收通话失败，收到该回调（userId 是自己的 ID）。

   ``` cpp
   TUICallEngine.instance.addObserver(TUICallObserver(
       onCallCancelled: (String userId) {  
         //您的回调处理逻辑    
       }
   ));
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
``` cpp
TUICallEngine.instance.addObserver(TUICallObserver(
    onCallMediaTypeChanged: (TUICallMediaType oldCallMediaType, TUICallMediaType newCallMediaType) { 
      //您的回调处理逻辑    
    }
));
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

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >newCallMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，示例：`TUICallMediaType.video` 或 `TUICallMediaType.audio`</td>
</tr>
</table>

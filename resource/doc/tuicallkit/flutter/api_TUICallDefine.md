## **常用结构**

### TUIResult

调用 API 的返回值
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >code</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >code 为空 "" 表示调用成功，code 不为空 "" 表示调用失败</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >message</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >失败原因</td>
</tr>
</table>


### TUIRoomId

房间 ID
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >intRoomId</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >数字房间号</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >strRoomId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >字符串房间号</td>
</tr>
</table>


### VideoRenderParams

视频画面的渲染参数
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >fillMode</td>

<td rowspan="1" colSpan="1" >[FillMode](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >视频画面填充模式</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >rotation</td>

<td rowspan="1" colSpan="1" >[Rotation](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >视频画面旋转方向</td>
</tr>
</table>


### VideoEncoderParams

视频编码参数
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolution</td>

<td rowspan="1" colSpan="1" >[Resolution](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >视频分辨率</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolutionMode</td>

<td rowspan="1" colSpan="1" >[ResolutionMode](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >视频宽高比模式</td>
</tr>
</table>


### TUICallParams

通话参数
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUIRoomId](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo</td>

<td rowspan="1" colSpan="1" >[TUIOfflinePushInfo](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >厂商离线推送配置信息</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >timeout</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >超时时常</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userData</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >用户自定义数据</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >chatGroupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >群组 ID</td>
</tr>
</table>


### TUIOfflinePushInfo

厂商离线推送配置信息，详情配置步骤请参考：[离线唤醒](https://write.woa.com/document/86735802183802880)。
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >title</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >离线推送展示通知栏标题</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >desc</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >离线推送展示通知栏内容</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >ignoreIOSBadge</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >离线推送忽略 badge 计数（仅对 iOS 生效）， 如果设置为 true，在 iOS 接收端，这条消息不会使 APP 的应用图标未读计数增加</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >iOSSound</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >离线推送声音设置（仅对 iOS 生效）。 当 sound = IOS_OFFLINE_PUSH_NO_SOUND，表示接收时不会播放声音。 当 sound = IOS_OFFLINE_PUSH_DEFAULT_SOUND，表示接收时播放系统声音。 如果要自定义 iOSSound，需要先把语音文件链接进 Xcode 工程，然后把语音文件名（带后缀）设置给 iOSSound</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidSound</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >离线推送声音设置（仅对 Android 生效, IMSDK 6.1 及以上版本支持）。 只有华为和谷歌手机支持设置声音提示，小米手机设置声音提示，请您参照：[小米自定义铃声](https://dev.mi.com/console/doc/detail?pId=1278%23_3_0#_3_0)。 另外，谷歌手机 FCM 推送在 Android 8.0 及以上系统设置声音提示，必须调用 setAndroidFCMChannelID 设置好 channelID，才能生效</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidOPPOChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >离线推送设置 OPPO 手机 8.0 系统及以上的渠道 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidVIVOClassification</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >VIVO 推送消息分类 (待废弃接口，VIVO 推送服务于 2023 年 4 月 3 日优化消息分类规则，推荐使用 setAndroidVIVOCategory 设置消息类别)。0：运营消息 1：系统消息，默认取值为 1</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidXiaoMiChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >小米手机 8.0 系统及以上的渠道 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidFCMChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >FCM 通道手机 8.0 系统及以上的渠道 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >androidHuaWeiCategory</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >华为推送消息分类，详见：[华为消息分类标准](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isDisablePush</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >是否关闭推送（默认开启推送）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >iOSPushType</td>

<td rowspan="1" colSpan="1" >[TUICallIOSOfflinePushType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >iOS 离线推送类型，默认：APNs</td>
</tr>
</table>


### TUICallRecords

通话记录信息
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >通话记录 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >inviter</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >邀请者 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >inviteList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >被邀请用户 ID 列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >scene</td>

<td rowspan="1" colSpan="1" >[TUICallScene](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话场景</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >mediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话媒体类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >群组 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >role</td>

<td rowspan="1" colSpan="1" >[TUICallRole](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话角色</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >result</td>

<td rowspan="1" colSpan="1" >[TUICallResultType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话结果类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >beginTime</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >开始时间</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >totalTime</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >总时间</td>
</tr>
</table>


### TUICallRecentCallsFilter

通话记录过滤条件
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >begin</td>

<td rowspan="1" colSpan="1" >double</td>

<td rowspan="1" colSpan="1" >开始时间</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >end</td>

<td rowspan="1" colSpan="1" >double</td>

<td rowspan="1" colSpan="1" >结束时间</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resultType</td>

<td rowspan="1" colSpan="1" >[TUICallResultType](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话记录类型</td>
</tr>
</table>


### CallObserverExtraInfo

回调扩展信息
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUIRoomId](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >房间 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >role</td>

<td rowspan="1" colSpan="1" >[TUICallRole](https://write.woa.com/document/109226385552285696)</td>

<td rowspan="1" colSpan="1" >通话角色</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userData</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >发起通话时自定义扩展字段，详情见 [TUICallParams](https://write.woa.com/document/109226385552285696)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >chatGroupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >群组 ID</td>
</tr>
</table>


## **枚举定义**

### TUICallMediaType

通话类型
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >none</td>

<td rowspan="1" colSpan="1" >未知类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >audio</td>

<td rowspan="1" colSpan="1" >语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >video</td>

<td rowspan="1" colSpan="1" >视频通话</td>
</tr>
</table>


### TUICallRole

通话角色
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >none</td>

<td rowspan="1" colSpan="1" >未知类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >caller</td>

<td rowspan="1" colSpan="1" >主叫（邀请方）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >called</td>

<td rowspan="1" colSpan="1" >被叫（被邀请方）</td>
</tr>
</table>


### TUICallStatus

通话状态
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >none</td>

<td rowspan="1" colSpan="1" >未知类型</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >waiting</td>

<td rowspan="1" colSpan="1" >通话等待中</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >accept</td>

<td rowspan="1" colSpan="1" >通话已接听</td>
</tr>
</table>


### TUICallScene

通话场景
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >singleCall</td>

<td rowspan="1" colSpan="1" >单人通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupCall</td>

<td rowspan="1" colSpan="1" >群组通话</td>
</tr>
</table>


### TUINetworkQuality

网络质量
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >unknown</td>

<td rowspan="1" colSpan="1" >未定义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >excellent</td>

<td rowspan="1" colSpan="1" >当前网络非常好</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >good</td>

<td rowspan="1" colSpan="1" >当前网络比较好</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >poor</td>

<td rowspan="1" colSpan="1" >当前网络一般</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >bad</td>

<td rowspan="1" colSpan="1" >当前网络较差</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >vBad</td>

<td rowspan="1" colSpan="1" >当前网络很差</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >down</td>

<td rowspan="1" colSpan="1" >当前网络不满足通话的最低要求</td>
</tr>
</table>


### FillMode

视频画面填充模式
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >fill</td>

<td rowspan="1" colSpan="1" >填充模式：即将画面内容居中等比缩放以充满整个显示区域，超出显示区域的部分将会被裁剪掉，此模式下画面可能不完整。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >fit</td>

<td rowspan="1" colSpan="1" >适应模式：即按画面长边进行缩放以适应显示区域，短边部分会被填充为黑色，此模式下图像完整但可能留有黑边。</td>
</tr>
</table>


### Rotation

视频画面旋转方向
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >rotation_0</td>

<td rowspan="1" colSpan="1" >不旋转</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >rotation_90</td>

<td rowspan="1" colSpan="1" >顺时针旋转90度</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >rotation_180</td>

<td rowspan="1" colSpan="1" >顺时针旋转180度</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >rotation_270</td>

<td rowspan="1" colSpan="1" >顺时针旋转270度</td>
</tr>
</table>


### ResolutionMode

视频宽高比模式
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >landscape</td>

<td rowspan="1" colSpan="1" >横屏分辨率，例如：Resolution.Resolution_640_360 + ResolutionMode.Landscape = 640 × 360</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >portrait</td>

<td rowspan="1" colSpan="1" >竖屏分辨率，例如：Resolution.Resolution_640_360 + ResolutionMode.Portrait = 360 × 640</td>
</tr>
</table>


### Resolution

视频分辨率
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolution_640_360</td>

<td rowspan="1" colSpan="1" >宽高比 16:9；分辨率 640x360；建议码率（VideoCall）500kbps</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolution_960_540</td>

<td rowspan="1" colSpan="1" >宽高比 16:9；分辨率 960x540；建议码率（VideoCall）850kbps</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolution_1280_720</td>

<td rowspan="1" colSpan="1" >宽高比 16:9；分辨率 1280x720；建议码率（VideoCall）1200kbps</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >resolution_1920_1080</td>

<td rowspan="1" colSpan="1" >宽高比 16:9；分辨率 1920x1080；建议码率（VideoCall）2000kbps</td>
</tr>
</table>


### TUICallIOSOfflinePushType

iOS 离线推送类型
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >APNs</td>

<td rowspan="1" colSpan="1" >普通推送</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >VoIP</td>

<td rowspan="1" colSpan="1" >VoIP 推送</td>
</tr>
</table>


### TUICamera

摄像头类型
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >front</td>

<td rowspan="1" colSpan="1" >前置摄像头</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >back</td>

<td rowspan="1" colSpan="1" >后置摄像头</td>
</tr>
</table>


### TUIAudioPlaybackDevice

音频播放路由
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >speakerphone</td>

<td rowspan="1" colSpan="1" >扬声器</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >earpiece</td>

<td rowspan="1" colSpan="1" >耳麦</td>
</tr>
</table>


### TUICallResultType

通话记录类型
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >unknown</td>

<td rowspan="1" colSpan="1" >未知</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >missed</td>

<td rowspan="1" colSpan="1" >未接</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >incoming</td>

<td rowspan="1" colSpan="1" >接入</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >outgoing</td>

<td rowspan="1" colSpan="1" >拨出</td>
</tr>
</table>


### CallEndReason

通话结束原因
<table>
<tr>
<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >unknown</td>

<td rowspan="1" colSpan="1" >未知</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >hangup</td>

<td rowspan="1" colSpan="1" >挂断</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reject</td>

<td rowspan="1" colSpan="1" >拒绝</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >noResponse</td>

<td rowspan="1" colSpan="1" >无响应</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offline</td>

<td rowspan="1" colSpan="1" >离线</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >lineBusy</td>

<td rowspan="1" colSpan="1" >忙线</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >canceled</td>

<td rowspan="1" colSpan="1" >取消通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >otherDeviceAccepted</td>

<td rowspan="1" colSpan="1" >其他设备接听</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >otherDeviceReject</td>

<td rowspan="1" colSpan="1" >其他设备拒绝</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >endByServer</td>

<td rowspan="1" colSpan="1" >后台结束</td>
</tr>
</table>

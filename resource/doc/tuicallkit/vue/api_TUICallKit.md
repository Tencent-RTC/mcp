TUICallKit 是音视频通话组件的**含 UI 接口**，使用 TUICallKit API，您可以通过简单接口快速实现一个类微信的音视频通话场景；更详细的接入步骤，详见：[快速接入 TUICallKit](https://write.woa.com/document/130513425899630592)。

> **说明：**
> 
> - 为提供更优质的音视频通信能力， TUICallKit npm 包 [@tencentcloud/call-uikit-react](https://www.npmjs.com/package/@tencentcloud/call-uikit-react)、[@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue)、[@tencentcloud/call-uikit-vue2](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2)、[@tencentcloud/call-uikit-vue2.6](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2.6) 在 4.0.0 版本进行了重大升级。
> - v4.0.0+ 对接口进行了优化调整，废弃了部分接口，同步提供更简洁、稳定的新接口方案。


## API 概览
<table>
<tr>
<td rowspan="1" colSpan="1" ><br>API</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[<TUICallKit />](https://cloud.tencent.com/document/product/647/81015#TUICallKit)</td>

<td rowspan="1" colSpan="1" >TUICallKit 通话 UI 组件。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[init](https://cloud.tencent.com/document/product/647/81015#init)</td>

<td rowspan="1" colSpan="1" >初始化 TUICallKit 组件实例。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://cloud.tencent.com/document/product/647/81015#calls)</td>

<td rowspan="1" colSpan="1" >发起单人或多人通话。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://cloud.tencent.com/document/product/647/81015#join)</td>

<td rowspan="1" colSpan="1" >主动加入通话。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://cloud.tencent.com/document/product/647/81015#setCallingBell)</td>

<td rowspan="1" colSpan="1" >设置自定义来电铃音。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://cloud.tencent.com/document/product/647/81015#setSelfInfo)</td>

<td rowspan="1" colSpan="1" >设置用户昵称和头像。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://cloud.tencent.com/document/product/647/81015#enableMuteMode)</td>

<td rowspan="1" colSpan="1" >开启/关闭来电铃声。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://cloud.tencent.com/document/product/647/81015#enableFloatWindow)</td>

<td rowspan="1" colSpan="1" >开启/关闭悬浮窗功能。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableVirtualBackground](https://cloud.tencent.com/document/product/647/81015#enableVirtualBackground)</td>

<td rowspan="1" colSpan="1" >开启/关闭模糊背景的功能按钮。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setLanguage](https://cloud.tencent.com/document/product/647/81015#setLanguage)</td>

<td rowspan="1" colSpan="1" >设置 TUICallKit 组件通话语言。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[hideFeatureButton](https://cloud.tencent.com/document/product/647/81015#hideFeatureButton)</td>

<td rowspan="1" colSpan="1" >隐藏按钮。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setLocalViewBackgroundImage](https://cloud.tencent.com/document/product/647/81015#setLocalViewBackgroundImage)</td>

<td rowspan="1" colSpan="1" >设置本地用户通话界面背景图。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setRemoteViewBackgroundImage](https://cloud.tencent.com/document/product/647/81015#setRemoteViewBackgroundImage)</td>

<td rowspan="1" colSpan="1" >设置远端用户通话界面背景图。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setLayoutMode](https://cloud.tencent.com/document/product/647/81015#setLayoutMode)</td>

<td rowspan="1" colSpan="1" >设置通话界面布局模式。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCameraDefaultState](https://cloud.tencent.com/document/product/647/81015#setCameraDefaultState)</td>

<td rowspan="1" colSpan="1" >设置摄像头是否默认打开。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[destroyed](https://cloud.tencent.com/document/product/647/81015#destroyed)</td>

<td rowspan="1" colSpan="1" >销毁 TUICallKit 组件实例。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[getTUICallEngineInstance](https://cloud.tencent.com/document/product/647/81015#getTUICallEngineInstance)</td>

<td rowspan="1" colSpan="1" >获取 TUICallEngine 实例。</td>
</tr>
</table>


## <`TUICallKit />` 组件

### 属性概览
<table>
<tr>
<td rowspan="1" colSpan="1" >属性</td>

<td rowspan="1" colSpan="1" >描述</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >默认值</td>

<td rowspan="1" colSpan="1" >支持 vue</td>

<td rowspan="1" colSpan="1" >支持 react</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >allowedMinimized</td>

<td rowspan="1" colSpan="1" >是否允许悬浮窗</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >false</td>

<td rowspan="1" colSpan="1" ><br>√<br></td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >allowedFullScreen</td>

<td rowspan="1" colSpan="1" >是否允许通话界面全屏</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >true</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[videoDisplayMode](https://cloud.tencent.com/document/product/647/81015#videoDisplayMode)</td>

<td rowspan="1" colSpan="1" >通话界面显示模式</td>

<td rowspan="1" colSpan="1" >VideoDisplayMode</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >VideoDisplayMode.COVER</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[videoResolution](https://cloud.tencent.com/document/product/647/81015#videoResolution)</td>

<td rowspan="1" colSpan="1" >通话分辨率</td>

<td rowspan="1" colSpan="1" >VideoResolution</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >VideoResolution.RESOLUTION_480P</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >beforeCalling</td>

<td rowspan="1" colSpan="1" >拨打电话前与收到通话邀请前会执行此函数</td>

<td rowspan="1" colSpan="1" >function(type, error)</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >afterCalling</td>

<td rowspan="1" colSpan="1" >结束通话后会执行此函数</td>

<td rowspan="1" colSpan="1" >function()</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" ><br>onMinimized</td>

<td rowspan="1" colSpan="1" >组件切换最小化状态时会执行此函数，[STATUS 值说明](https://cloud.tencent.com/document/product/647/81015#STATUS)</td>

<td rowspan="1" colSpan="1" >function(oldStatus, newStatus)</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >√</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" ><br>kickedOut</td>

<td rowspan="1" colSpan="1" >组件抛出的事件，当前登录用户被踢出登录时会触发该事件，通话也会自动结束</td>

<td rowspan="1" colSpan="1" >function()</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" ><br>statusChanged</td>

<td rowspan="1" colSpan="1" >组件抛出的事件，当通话状态发生变化时，会触发该事件，通话状态种类详见，[STATUS 值说明](https://cloud.tencent.com/document/product/647/81015#STATUS)</td>

<td rowspan="1" colSpan="1" >function({oldStatus, newStatus})</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>
</table>


### 示例代码




【React】
``` bash
import { TUICallKit, VideoDisplayMode, VideoResolution } from "@tencentcloud/call-uikit-react";

<TUICallKit
    videoDisplayMode={VideoDisplayMode.CONTAIN}
    videoResolution={VideoResolution.RESOLUTION_1080P}
    beforeCalling={handleBeforeCalling} 
    afterCalling={handleAfterCalling} 
/>

function handleBeforeCalling(type: string, error: any) {
  console.log("[TUICallkit Demo] handleBeforeCalling:", type, error);
}
function handleAfterCalling() {
  console.log("[TUICallkit Demo] handleAfterCalling");
}
```


【Vue3】
``` bash
<template>
   <TUICallKit
    :allowedMinimized="true"
    :allowedFullScreen="true"
    :videoDisplayMode="VideoDisplayMode.CONTAIN"
    :videoResolution="VideoResolution.RESOLUTION_1080P"
    :beforeCalling="beforeCalling"
    :afterCalling="afterCalling"
    :onMinimized="onMinimized"
    :kickedOut="handleKickedOut"
    :statusChanged="handleStatusChanged"
  />
</template>

<script lang="ts" setup>
import { TUICallKit, TUICallKitServer, VideoDisplayMode, VideoResolution, STATUS } from "@tencentcloud/call-uikit-vue";

function beforeCalling(type: string, error: any) {
  console.log("[TUICallkit Demo] beforeCalling:", type, error);
}
function afterCalling() {
  console.log("[TUICallkit Demo] afterCalling");
}
function onMinimized(oldStatus: string, newStatus: string) {
  console.log("[TUICallkit Demo] onMinimized: " + oldStatus + " -> " + newStatus);
}
function kickedOut() {
  console.log("[TUICallkit Demo] kickedOut");
}
function statusChanged(args: { oldStatus: string; newStatus: string; }) {
  const { oldStatus, newStatus } = args;
  if (newStatus === STATUS.CALLING_C2C_VIDEO) {
    console.log(`[TUICallkit Demo] statusChanged: ${oldStatus} -> ${newStatus}`);
  }
}
</script>

```


【Vue2.7】
``` javascript
<template>
   <TUICallKit
    :allowedMinimized="true"
    :allowedFullScreen="true"
    :videoDisplayMode="VideoDisplayMode.CONTAIN"
    :videoResolution="VideoResolution.RESOLUTION_1080P"
    :beforeCalling="beforeCalling"
    :afterCalling="afterCalling"
    :onMinimized="onMinimized"
    :kickedOut="handleKickedOut"
    :statusChanged="handleStatusChanged"
  />
</template>

<script lang="ts" setup>
import { TUICallKit, TUICallKitServer, VideoDisplayMode, VideoResolution, STATUS } from "@tencentcloud/call-uikit-vue2";

function beforeCalling(type: string, error: any) {
  console.log("[TUICallkit Demo] beforeCalling:", type, error);
}
function afterCalling() {
  console.log("[TUICallkit Demo] afterCalling");
}
function onMinimized(oldStatus: string, newStatus: string) {
  console.log("[TUICallkit Demo] onMinimized: " + oldStatus + " -> " + newStatus);
}
function kickedOut() {
  console.log("[TUICallkit Demo] kickedOut");
}
function statusChanged(args: { oldStatus: string; newStatus: string; }) {
  const { oldStatus, newStatus } = args;
  if (newStatus === STATUS.CALLING_C2C_VIDEO) {
    console.log(`[TUICallkit Demo] statusChanged: ${oldStatus} -> ${newStatus}`);
  }
}
</script>
```


【Vue2.6】
``` javascript
<template>
   <TUICallKit
    :allowedMinimized="true"
    :allowedFullScreen="true"
    :videoDisplayMode="VideoDisplayMode.CONTAIN"
    :videoResolution="VideoResolution.RESOLUTION_1080P"
    :beforeCalling="beforeCalling"
    :afterCalling="afterCalling"
    :onMinimized="onMinimized"
    :kickedOut="handleKickedOut"
    :statusChanged="handleStatusChanged"
  />
</template>

<script lang="ts" setup>
import { TUICallKit, TUICallKitServer, VideoDisplayMode, VideoResolution, STATUS } from "@tencentcloud/call-uikit-vue2.6";

function beforeCalling(type: string, error: any) {
  console.log("[TUICallkit Demo] beforeCalling:", type, error);
}
function afterCalling() {
  console.log("[TUICallkit Demo] afterCalling");
}
function onMinimized(oldStatus: string, newStatus: string) {
  console.log("[TUICallkit Demo] onMinimized: " + oldStatus + " -> " + newStatus);
}
function kickedOut() {
  console.log("[TUICallkit Demo] kickedOut");
}
function statusChanged(args: { oldStatus: string; newStatus: string; }) {
  const { oldStatus, newStatus } = args;
  if (newStatus === STATUS.CALLING_C2C_VIDEO) {
    console.log(`[TUICallkit Demo] statusChanged: ${oldStatus} -> ${newStatus}`);
  }
}
</script>
```

## TUICallKitServer API 详情




【React】
``` javascript
import { TUICallKitServer } from "@tencentcloud/call-uikit-react"; 
```


【Vue3】
``` javascript
import { TUICallKitServer } from "@tencentcloud/call-uikit-vue"; 
```


【Vue2.7】
``` javascript
import { TUICallKitServer } from "@tencentcloud/call-uikit-vue2"; 
```


【Vue2.6】
``` javascript
import { TUICallKitServer } from "@tencentcloud/call-uikit-vue2.6";
```

### init

初始化 TUICallKit。
``` javascript
try {
  await TUICallKitServer.init({ SDKAppID, userID, userSig });
  // If you already have a tim instance in your project, you need to pass it in here.
  // await TUICallKitServer.init({ tim, SDKAppID, userID, userSig}); 
  console.log("[TUICallKit] init succeeds.");
} catch (error: any) {
  console.error(`[TUICallKit] init failed. Reason: ${error}`);
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKAppID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >应用的 SDKAppID，您可以在实时音视频控制台中找到您的 SDKAppID。具体详见：[开通服务](https://write.woa.com/document/139743928960860160)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >即用户名，只允许包含英文字母（a-z 和 A-Z）、数字（0-9）、连词符（-）和下划线（_）。<br>**注意：**不支持同一个 userID 在两台不同的设备上同时进入同一个房间通话，否则会相互干扰。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >使用 SecretKey 对 SDKAppID、UserID 等信息进行加密，就可以得到 userSig。<br>它是一个鉴权用的票据，用于腾讯云识别当前用户是否能够使用 TRTC 的服务，获取方式请参见 [UserSig](https://cloud.tencent.com/document/product/647/17275)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >tim</td>

<td rowspan="1" colSpan="1" >TencentCloudChat</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >tim 是 [TencentCloudChat](https://www.npmjs.com/package/@tencentcloud/chat) SDK 的实例</td>
</tr>
</table>


### calls

发起单人或多人通话。

> **说明：**
> 

> **v4.0.0+ 支持。**
> 

``` javascript
try {
  await TUICallKitServer.calls({ 
    userIDList: ['jack', 'tom'], 
    type: TUICallType.VIDEO_CALL 
  });
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the groupCall API. Reason:${error}`);
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIDList</td>

<td rowspan="1" colSpan="1" >Array<String></td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >被呼叫的用户列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >type</td>

<td rowspan="1" colSpan="1" >[TUICallType](https://cloud.tencent.com/document/product/647/81015#TUICallType)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，参数值说明参见 [TUICallType 通话类型](https://cloud.tencent.com/document/product/647/81015#TUICallType)<br>兼容旧版本：语音通话(type = 1)、视频通话(type = 2)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >chatGroupID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >与 chat 结合使用时， chat 群组的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >数字房间号，范围 [1, 2147483647]</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >strRoomID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >字符串房间号。**v3.3.1+ 支持**<br>1. roomID 与 strRoomID 是互斥的，若您选用 strRoomID，则 roomID 需要填写为 0。若两者都填，SDK 将优先选用 roomID。<br>2. 不要混用 roomID 和 strRoomID，因为它们之间是不互通的，例如数字 123 和字符串 "123" 是两个完全不同的房间。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >timeout</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >通话超时时间，默认：30s，单位：秒。设置范围：10s ~ 600s。如果传入0，默认30s。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userData</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >发起通话时自定义扩展字段，被呼叫用户在 [ON_CALL_RECEIVED](https://write.woa.com/document/86735802757361664) 事件中有该参数</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[offlinePushInfo](https://cloud.tencent.com/document/product/647/81015#offlinePushInfo)</td>

<td rowspan="1" colSpan="1" >Object</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >自定义离线消息推送参数</td>
</tr>
</table>


### join

加入群组中已有的音视频通话。

> **说明：**
> 

> **v4.0.0+ 支持。**
> 

``` javascript
try {
  await TUICallKitServer.join({callId: xx});
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the join API. Reason: ${error}`);
}
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >string</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >此次通话的唯一 ID。</td>
</tr>
</table>


### setLanguage

设置语言，目前支持：中文、英文、日文。
``` javascript
TUICallKitServer.setLanguage("zh-cn"); // "en" | "zh-cn" | "ja_JP"
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >lang</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >语言类型`en`、`zh-cn` 和 `ja_JP`。</td>
</tr>
</table>


### setSelfInfo

设置当前用户昵称和头像。

> **注意：**
> 

> **v2.2.0+ 支持**。**通话中使用该接口修改用户信息，UI 不会立即更新，需要等到下次通话才能看到变化**。
> 

``` javascript
try {
  await TUICallKitServer.setSelfInfo({ nickName: "xxx", avatar: "http://xxx" });
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the setSelfInfo API. Reason: ${error}`;
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >**参数**</td>

<td rowspan="1" colSpan="1" >**类型**</td>

<td rowspan="1" colSpan="1" >**是否必填**</td>

<td rowspan="1" colSpan="1" >**含义**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >nickName</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >自己的昵称</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >avatar</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >自己头像地址</td>
</tr>
</table>


### setCallingBell
- 自定义用户的来电铃音。

- 仅限传入本地 MP3 格式的文件地址，需要确保该文件目录是应用可以访问的。

- 使用 import 方式引入铃声文件。

- 如需恢复默认铃声，`filePath` 传空即可。

   ``` javascript
   try {
     await TUICallKitServer.setCallingBell(filePath?: string)
   } catch (error: any) {
     console.error(`[TUICallKit] Failed to call the setCallingBell API. Reason: ${error}`);
   }
   ```

   参数如下表所示：

<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >filePath</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >铃声文件地址</td>
</tr>
</table>


### enableFloatWindow

开启/关闭悬浮窗功能。默认为 false，通话界面左上角的悬浮窗按钮隐藏，设置为 true 后显示。
``` javascript
try {
  await TUICallKitServer.enableFloatWindow(enable: Boolean)
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the enableFloatWindow API. Reason: ${error}`);
}
```

### enableMuteMode

开启/关闭来电铃声。开启后，收到通话请求时，不会播放来电铃声。
``` javascript
try {
  await TUICallKitServer.enableMuteMode(enable: boolean)
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the enableMuteMode API. Reason: ${error}`);
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >Boolean</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >开启/关闭来电铃声。默认 false。</td>
</tr>
</table>


### enableVirtualBackground

开启/关闭模糊背景功能。如果想设置图片背景模糊参见 [Web](https://cloud.tencent.com/document/product/647/106071)。通过调用接口，您可以在 UI 上显示模糊背景的功能按钮，点击按钮可直接启用模糊背景功能。

> **注意：**
> 

> **v3.2.4+ 支持。**
> 

``` javascript
import { TUICallKitServer } from "@tencentcloud/call-uikit-react";
const enable = true;
TUICallKitServer.enableVirtualBackground(enable);
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >- enable = true 显示模糊背景按钮<br>- enable = false 不显示模糊背景按钮</td>
</tr>
</table>


### destroyed

销毁 TUICallKit 实例。

该方法不会自动退出`tim`，需要手动退出`tim.logout();`。
``` javascript
try {
  await TUICallKitServer.destroyed();
} catch (error: any) {
  alert(`[TUICallKit] Failed to call the destroyed API. Reason: ${error}`);
}
```

### hideFeatureButton

隐藏功能按钮，目前仅支持 摄像头，麦克风和切换前后置按钮。

> **注意：**
> 

> **v3.2.9+ 支持。**
> 





【Vue】
``` javascript
import { TUICallKitServer, FeatureButton } from "@tencentcloud/call-uikit-vue";

TUICallKitServer.hideFeatureButton(FeatureButton.Camera);
```


【React】
``` javascript
import { TUICallKitServer, FeatureButton } from "@tencentcloud/call-uikit-react";

TUICallKitServer.hideFeatureButton(FeatureButton.Camera);
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >buttonName</td>

<td rowspan="1" colSpan="1" >[FeatureButton](https://cloud.tencent.com/document/product/647/81015#FeatureButton)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >按钮名称</td>
</tr>
</table>


### setLocalViewBackgroundImage

设置本地用户通话背景。

> **注意：**
> 

> **v3.2.9+ 支持。**
> 

``` typescript
TUICallKitServer.setLocalViewBackgroundImage('http://xxx.png');
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >url</td>

<td rowspan="1" colSpan="1" >string</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >图片地址（支持本地路径和网络地址）</td>
</tr>
</table>


### setRemoteViewBackgroundImage

设置远端用户通话背景。

> **注意：**
> 

> **v3.2.9+ 支持。**
> 

``` javascript
const userId = 'xxx';
const url = 'http://xxx.png';
TUICallKitServer.setRemoteViewBackgroundImage(userId, url);
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >string</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >远端用户 userId，设置为 '*' 表示对所有远端用户生效</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >url</td>

<td rowspan="1" colSpan="1" >string</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >图片地址（支持本地路径和网络地址）</td>
</tr>
</table>


### setLayoutMode

设置通话界面布局模式。

> **注意：**
> 

> **v3.3.0+ 支持。**
> 





【Vue】
``` javascript
import { TUICallKitServer, LayoutMode } from "@tencentcloud/call-uikit-vue";
TUICallKitServer.setLayoutMode(LayoutMode.LocalInLargeView);
```


【React】
``` javascript
import { TUICallKitServer, LayoutMode } from "@tencentcloud/call-uikit-react";
TUICallKitServer.setLayoutMode(LayoutMode.LocalInLargeView);
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >layoutMode</td>

<td rowspan="1" colSpan="1" >[LayoutMode](https://cloud.tencent.com/document/product/647/81015#LayoutMode)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >用户流的布局模式</td>
</tr>
</table>


### setCameraDefaultState

设置摄像头是否默认打开。

> **注意：**
> 

> **v3.3.0+ 支持。**
> 

``` javascript
TUICallKitServer.setCameraDefaultState(true);
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >isOpen</td>

<td rowspan="1" colSpan="1" >boolean</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >是否开启摄像头</td>
</tr>
</table>


### getTUICallEngineInstance

获取 TUICallEngine 实例。

> **注意：**
> 

> v2.4.3+ 支持。
> 

``` javascript
TUICallKitServer.getTUICallEngineInstance();
```

## TUICallKit 类型定义

### videoDisplayMode

画面显示模式 `videoDisplayMode` 属性有三个值：
- `VideoDisplayMode.CONTAIN`

- `VideoDisplayMode.COVER`

- `VideoDisplayMode.FILL`，默认值是`VideoDisplayMode.COVER`。

<table>
<tr>
<td rowspan="1" colSpan="1" >属性</td>

<td rowspan="1" colSpan="1" >值</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="3" colSpan="1" >videoDisplayMode</td>

<td rowspan="1" colSpan="1" >VideoDisplayMode.CONTAIN</td>

<td rowspan="1" colSpan="1" >- 优先保证视频内容全部显示。<br>- 视频尺寸等比缩放，直至视频窗口的一边与视窗边框对齐。<br>- 如果视频尺寸与显示视窗尺寸不一致，在保持长宽比的前提下，将视频进行缩放后填满视窗，缩放后的视频四周会有一圈黑边。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >VideoDisplayMode.COVER</td>

<td rowspan="1" colSpan="1" >- 优先保证视窗被填满。<br>- 视频尺寸等比缩放，直至整个视窗被视频填满。<br>- 如果视频长宽与显示窗口不同，则视频流会按照显示视窗的比例进行周边裁剪或图像拉伸后填满视窗。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >VideoDisplayMode.FILL</td>

<td rowspan="1" colSpan="1" >- 保证视窗被填满的同时保证视频内容全部显示，但是不保证视频尺寸比例不变。<br>- 视频的宽高会被拉伸至和视窗尺寸一致。</td>
</tr>
</table>


### videoResolution

分辨率 `videoResolution` 有三个值：
- `VideoResolution.RESOLUTION_480P`

- `VideoResolution.RESOLUTION_720P`

- `VideoResolution.RESOLUTION_1080P`，默认值是`VideoResolution.RESOLUTION_480P`。


   **分辨率说明：**

<table>
<tr>
<td rowspan="1" colSpan="1" >视频 Profile</td>

<td rowspan="1" colSpan="1" >分辨率（宽 × 高）</td>

<td rowspan="1" colSpan="1" >帧率（fps）</td>

<td rowspan="1" colSpan="1" >码率（kbps）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >480p</td>

<td rowspan="1" colSpan="1" >640 × 480</td>

<td rowspan="1" colSpan="1" >15</td>

<td rowspan="1" colSpan="1" >900</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >720p</td>

<td rowspan="1" colSpan="1" >1280 × 720</td>

<td rowspan="1" colSpan="1" >15</td>

<td rowspan="1" colSpan="1" >1500</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >1080p</td>

<td rowspan="1" colSpan="1" >1920 × 1080</td>

<td rowspan="1" colSpan="1" >15</td>

<td rowspan="1" colSpan="1" >2000</td>
</tr>
</table>


   **常见问题：**

- iOS 13&14不支持编码高于 720P 的视频，建议在这两个系统版本限制最高采集 720P。参见 [iOS Safari 已知问题 case 12](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-02-info-webrtc-issues.html#h2-4)。

- Firefox 不支持自定义视频帧率（默认为 30fps）。

- 受系统性能占用，摄像头采集能力和浏览器限制等因素的影响，视频分辨率、帧率、码率的实际值不一定能够完全匹配设定值，在这种情况下，浏览器会自动调整 Profile 尽可能匹配设定值。


### STATUS
<table>
<tr>
<td rowspan="1" colSpan="1" >属性值</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.IDLE</td>

<td rowspan="1" colSpan="1" >闲置状态</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.BE_INVITED</td>

<td rowspan="1" colSpan="1" >收到通话邀请</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.DIALING_C2C</td>

<td rowspan="1" colSpan="1" >正在 1v1 呼叫</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.DIALING_GROUP</td>

<td rowspan="1" colSpan="1" >正在群组呼叫</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.CALLING_C2C_AUDIO</td>

<td rowspan="1" colSpan="1" >正在 1v1 语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.CALLING_C2C_VIDEO</td>

<td rowspan="1" colSpan="1" >正在 1v1 视频通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.CALLING_GROUP_AUDIO</td>

<td rowspan="1" colSpan="1" >正在群组语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >STATUS.CALLING_GROUP_VIDEO</td>

<td rowspan="1" colSpan="1" >正在群组视频通话</td>
</tr>
</table>


### **TUICallType**
<table>
<tr>
<td rowspan="1" colSpan="1" >TUICallType 类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >TUICallType.AUDIO_CALL </td>

<td rowspan="1" colSpan="1" >语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >TUICallType.VIDEO_CALL </td>

<td rowspan="1" colSpan="1" >视频通话</td>
</tr>
</table>


### **offlinePushInfo**
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.title</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送标题（选填）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.description</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送内容（选填）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidOPPOChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送设置 OPPO 手机 8.0 系统及以上的渠道 ID（选填）</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.extension</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送透传内容，可以用于设置 Android [Notification 模式](https://cloud.tencent.com/document/product/647/81015#Android Notification) 和 [VoIP 模式](https://cloud.tencent.com/document/product/647/81015#Android VoIP)。**默认：**Notification 模式，会是系统的通知；VoIP 模式是需要传字段。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.ignoreIOSBadge</td>

<td rowspan="1" colSpan="1" >Boolean</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送忽略 badge 计数（仅对 iOS 生效）， 如果设置为 true，在 iOS 接收端，这条消息不会使 APP 的应用图标未读计数增加<br>**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.iOSSound</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送声音设置（仅对 iOS 生效）。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidSound</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >离线推送声音设置（仅对 Android 生效）。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidVIVOClassification</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >VIVO 推送消息分类。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidXiaoMiChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >小米手机 8.0 系统及以上的渠道 ID。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidFCMChannelID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >FCM 通道手机 8.0 系统及以上的渠道 ID。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.androidHuaWeiCategory</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >华为推送消息分类。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.isDisablePush</td>

<td rowspan="1" colSpan="1" >Boolean</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >是否关闭推送（默认开启推送）。**v3.3.0+ 支持**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >offlinePushInfo.iOSPushType</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >iOS 离线推送类型。0-普通推送；1-VoIP推送。默认：0。**v3.3.0+ 支持**</td>
</tr>
</table>


#### Android Notification 模式
``` javascript
const extension = {
  timPushFeatures: {        
    fcmPushType: 0, // 0, VoIP; 1, notification
  }
};
offlinePushInfo.extension = JSON.stringify(extension);
```

#### Android VoIP 模式
``` javascript
const extension = {
  timPushFeatures: {        
    fcmPushType: 0, // 0, data; 1, notification
    fcmNotificationType: 1, // 0, TIMPush implementation； 1, business implementation after transparent transmission 
  }
};
offlinePushInfo.extension = JSON.stringify(extension);
```

### FeatureButton
<table>
<tr>
<td rowspan="1" colSpan="1" >FeatureButton 类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >FeatureButton.Camera</td>

<td rowspan="1" colSpan="1" >摄像头按钮</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >FeatureButton.Microphone</td>

<td rowspan="1" colSpan="1" >麦克风按钮</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >FeatureButton.SwitchCamera</td>

<td rowspan="1" colSpan="1" >切换前后置摄像头按钮</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >FeatureButton.InviteUser</td>

<td rowspan="1" colSpan="1" >邀请他人按钮</td>
</tr>
</table>


### LayoutMode
<table>
<tr>
<td rowspan="1" colSpan="1" >LayoutMode 类型</td>

<td rowspan="1" colSpan="1" >描述</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >LayoutMode.LocalInLargeView</td>

<td rowspan="1" colSpan="1" >本地用户在大窗显示</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >LayoutMode.RemoteInLargeView</td>

<td rowspan="1" colSpan="1" >远端用户在大窗显示</td>
</tr>
</table>


# 废弃接口

### <TUICallKitMini/>

`<TUICallKitMini/>`：TUICallKit UI 通话悬浮窗，当`<TUICallKit :allowedMinimized="true"/>`时，`<TUICallKitMini/>`必须被放置在页面中。

> **说明：**
> 
> - `<TUICallKitMini/>`UI 通话悬浮窗，**≥ v2.3.2 废弃，不再提供该组件**。
> - 由`<TUICallKit/>` UI 通话组件主体，实现悬浮窗样式，减少使用复杂度。

<table>
<tr>
<td rowspan="1" colSpan="1" >属性</td>

<td rowspan="1" colSpan="1" >描述</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >默认值</td>

<td rowspan="1" colSpan="1" >支持 vue</td>

<td rowspan="1" colSpan="1" >支持 react</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" ><br>@kicked-out</td>

<td rowspan="1" colSpan="1" >**注意：**<br>**≥ v2.3.2 废弃**<br><br>组件抛出的事件，当前登录用户被踢出登录时会触发该事件，通话也会自动结束</td>

<td rowspan="1" colSpan="1" >function()</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" ><br>@status-changed</td>

<td rowspan="1" colSpan="1" >**注意：**<br>**≥ v2.3.2 废弃**<br><br>组件抛出的事件，当通话状态发生变化时，会触发该事件，通话状态种类详见，[STATUS 值说明](https://cloud.tencent.com/document/product/647/81015#STATUS)</td>

<td rowspan="1" colSpan="1" >function({oldStatus, newStatus})</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >-</td>

<td rowspan="1" colSpan="1" >√</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>
</table>


### call



拨打 1v1 通话，**建议使用 calls 接口。**
``` javascript
import { TUICallKitServer, TUICallType } from '@tencentcloud/call-uikit-react';
try {
  await TUICallKitServer.call({ 
    userID: 'mike', // username being called 
    type: TUICallType.VIDEO_CALL,
  });
} catch (error: any) {
  console.error(`[TUICallKit] Call failed. Reason: ${error}`);
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >被呼叫用户的用户名</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >type</td>

<td rowspan="1" colSpan="1" >[TUICallType](https://cloud.tencent.com/document/product/647/81015#TUICallType)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，参数值说明参见 [TUICallType 通话类型](https://write.woa.com/document/90294110881382400)<br>兼容旧版本：语音通话(type = 1)、视频通话(type = 2)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >数字房间号，范围 [1, 2147483647]</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >strRoomID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >字符串房间号。**v3.3.1+ 支持**<br>1. roomID 与 strRoomID 是互斥的，若您选用 strRoomID，则 roomID 需要填写为 0。若两者都填，SDK 将优先选用 roomID。<br>2. 不要混用 roomID 和 strRoomID，因为它们之间是不互通的，例如数字 123 和字符串 "123" 是两个完全不同的房间。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >timeout</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >通话超时时间，默认：30s，单位：秒。timeout = 0，设置为不超时</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userData</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >发起通话时自定义扩展字段，被呼叫用户在 [ON_CALL_RECEIVED](https://write.woa.com/document/86735802757361664) 事件中有该参数</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[offlinePushInfo](https://cloud.tencent.com/document/product/647/81015#offlinePushInfo)</td>

<td rowspan="1" colSpan="1" >Object</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >自定义离线消息推送参数</td>
</tr>
</table>


### groupCall



发起群组通话，**建议使用 calls 接口。**
``` javascript
try {
  await TUICallKitServer.groupCall({ 
    userIDList: ['jack', 'tom'], 
    groupID: "xxx", 
    type: TUICallType.VIDEO_CALL 
  });
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the groupCall API. Reason:${error}`);
}
```

参数如下表所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIDList</td>

<td rowspan="1" colSpan="1" >Array<String></td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >被呼叫的用户列表</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >type</td>

<td rowspan="1" colSpan="1" >[TUICallType](https://write.woa.com/document/90294110881382400)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，参数值说明参见 [TUICallType 通话类型](https://write.woa.com/document/90294110881382400)<br>兼容旧版本：语音通话(type = 1)、视频通话(type = 2)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >通话群组 ID，groupID 的创建可参见 [chat-createGroup API](https://web.sdk.qcloud.com/im/doc/v3/zh-cn/SDK.html#createGroup)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >数字房间号，范围 [1, 2147483647]</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >strRoomID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >字符串房间号。**v3.3.1+ 支持**<br>1. roomID 与 strRoomID 是互斥的，若您选用 strRoomID，则 roomID 需要填写为 0。若两者都填，SDK 将优先选用 roomID。<br>2. 不要混用 roomID 和 strRoomID，因为它们之间是不互通的，例如数字 123 和字符串 "123" 是两个完全不同的房间。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >timeout</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >通话超时时间，默认：30s，单位：秒。timeout = 0，设置为不超时</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userData</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >发起通话时自定义扩展字段，被呼叫用户在 [ON_CALL_RECEIVED](https://write.woa.com/document/86735802757361664) 事件中有该参数</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[offlinePushInfo](https://cloud.tencent.com/document/product/647/81015#offlinePushInfo)</td>

<td rowspan="1" colSpan="1" >Object</td>

<td rowspan="1" colSpan="1" >否</td>

<td rowspan="1" colSpan="1" >自定义离线消息推送参数</td>
</tr>
</table>


### joinInGroupCall



加入群组中已有的音视频通话，**建议使用 join 接口。**

> **注意：**
> 

> **v3.1.2+ 支持。**
> 


> **说明：**
> 
> - 加入群组中已有的音视频通话前，需要提前创建或加入IM 群组，并且群组中已有用户在通话中，如果已经创建，请忽略。
> - 群组的创建详见： [IM 群组管理](https://cloud.tencent.com/document/product/269/75395#.E5.88.9B.E5.BB.BA.E7.BE.A4.E7.BB.84) ，或者您也可以直接使用 [IM TUIKit](https://cloud.tencent.com/document/product/269/68493)，一站式集成聊天、通话等场景。

``` javascript
try {
  const params = {
    type: TUICallType.VIDEO_CALL,
    groupID: "xxx",
    roomID: 0,
  };
  await TUICallKitServer.joinInGroupCall(params);
} catch (error: any) {
  console.error(`[TUICallKit] Failed to call the enableMuteMode API. Reason: ${error}`);
}
```

参数列表：
<table>
<tr>
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >是否必填</td>

<td rowspan="1" colSpan="1" >含义</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >type</td>

<td rowspan="1" colSpan="1" >[TUICallType](https://cloud.tencent.com/document/product/647/81015#TUICallType)</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >通话的媒体类型，例如视频通话、语音通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >此次群组通话的群 ID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomID</td>

<td rowspan="1" colSpan="1" >number</td>

<td rowspan="1" colSpan="1" >是</td>

<td rowspan="1" colSpan="1" >此次通话的音视频房间 ID</td>
</tr>
</table>

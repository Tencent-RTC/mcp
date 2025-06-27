本文将介绍如何快速完成 TUICallKit 组件的接入，您将在10分钟内完成以下几个关键步骤，并最终得到一个包含完备 UI 界面的视频通话功能。

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/ace7b80f181f11ef9c015254002977b6.png)

## 环境准备
- React version 18+。

- [Node.js](https://nodejs.org/en/) version 16+。

- Modern browser, supporting WebRTC APIs。


## 步骤一：开通服务

请参见 [开通服务](https://write.woa.com/document/139743928960860160)，获取 `SDKAppID、SecretKey`，它们将在 [初始化 TUICallKit 组件](https://write.woa.com/document/130513425899630592) 作为**必填参数**使用。

## 步骤二：下载 TUICallKit 组件
1. 下载 [@tencentcloud/call-uikit-react](https://www.npmjs.com/package/@tencentcloud/call-uikit-react) 组件。

   
   
   【shell】
   ``` bash
   npm install @tencentcloud/call-uikit-react
   ```
2. 将`debug`目录复制到您的项目目录`src/debug`，本地生成 userSig 时需要使用。


   


【MacOS】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-react/debug ./src
```


【Windows】
``` bash
xcopy node_modules\@tencentcloud\call-uikit-react\debug .\src\debug /i /e
```


## 步骤三：初始化 TUICallKit 组件

您可以选择在 `/src/App.tsx` 文件引入示例代码。
1. 引入 call-uikit 相关 API 对象。

   ``` tsx
   import { useState } from 'react';
   import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-react";
   import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; // Refer to Step 3
   ```
2. 引入[<TUICallKit />](https://cloud.tencent.com/document/product/647/81015#tuicallkit)，该组件包含通话时的完整 UI 交互。

   ``` javascript
   return (
     <>
       <span> caller's ID: </span>
       <input type="text" placeholder='input caller userID' value={callerUserID} onChange={(event) => setCallerUserID(event.target.value)} />
       <button onClick={init}> step1. init </button> <br />
       <span> callee's ID: </span>
       <input type="text" placeholder='input callee userID' value={calleeUserID} onChange={(event) => setCalleeUserID(event.target.value)} />
       <button onClick={call}> step2. call </button>
   
       {/* 【1】Import the TUICallKit component: Call interface UI */}
       <TUICallKit />
     </>
   );
   ```
3. 调用 [TUICallKitServer.init](https://cloud.tencent.com/document/product/647/81015#init) API 登录组件，需要在代码中**填写 **`SDKAppID、SecretKey`** 两个参数。**

   ``` javascript
   const SDKAppID = 0;        // TODO: Replace with your SDKAppID (Notice: SDKAppID is of type number）
   const SDKSecretKey = '';   // TODO: Replace with your SDKSecretKey
   
   const [callerUserID, setCallerUserID] = useState('');
   const [calleeUserID, setCalleeUserID] = useState('');
   
   //【2】Initialize the TUICallKit component
   const init = async () => {
     const { userSig } = GenerateTestUserSig.genTestUserSig({ 
       userID: callerUserID,
       SDKAppID,
       SecretKey: SDKSecretKey,
     });
     await TUICallKitServer.init({
       userID: callerUserID,
       userSig,
       SDKAppID,
     });
     alert('TUICallKit init succeed');
   }
   ```
<table>
<tr>
<td rowspan="1" colSpan="1" >**参数**</td>

<td rowspan="1" colSpan="1" >**类型**</td>

<td rowspan="1" colSpan="1" >**说明**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >**用户的唯一标识符**，由您定义，只允许包含大小写英文字母(a-z A-Z)、数字(0-9)及下划线和连词符。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKAppID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >在 [Tencent RTC 控制台](https://console.cloud.tencent.com/trtc) 创建的音视频应用的唯一标识。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKSecretKey</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >在 [Tencent RTC 控制台](https://console.cloud.tencent.com/trtc) 创建的音视频应用的 SecretKey。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >一种安全保护签名，用于对用户进行登录鉴权认证，确认用户是否真实，阻止恶意攻击者盗用您的云服务使用权。</td>
</tr>
</table>
   

   > **userSig 说明：**
   > 
>   - **开发环境**：如果您正在本地跑通 Demo、开发调试，可以采用 `debug` 文件中的 `genTestUserSig`（参考步骤3.2）函数生成 userSig。该方法中 SDKSecretKey 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量。
>   - **生产环境**：如果您的项目要发布上线，请采用 [服务端生成 UserSig](https://trtc.io/document/35166) 的方式。


## 步骤四：拨打您的第一通电话
1. 调用 [TUICallKitServer.calls API](https://cloud.tencent.com/document/product/647/81015#calls) 拨打通话。

   ``` javascript
   //【3】Make a 1v1 video call
   const call = async () => {
     await TUICallKitServer.calls({
       userIDList: [calleeUserID],
       type: TUICallType.VIDEO_CALL,
     });
   };
   ```
2. 运行项目。
   

   > **警告：**
   > 

   > **本地环境请在 localhost 协议下访问，公网体验请在 HTTPS 协议下访问，具体参见 **[网络访问协议说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-3)**。**
   > 

3. 打开两个浏览器页面，输入不同的 userID(由您定义) 单击`step1. init`登录（主叫方和被叫方）。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/607e29cf2c8511efa4f552540077de32.png)

4. 两个 userID 都登录成功后，单击`step2. call `拨打通话，如果您有通话问题，参见 [常见问题](https://cloud.tencent.com/document/product/647/78769)。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/649bb2192c8511efa01d5254005235d8.png)


## 更多特性
- [设置昵称、头像](https://write.woa.com/document/140283367112228864)

- [群组通话](https://write.woa.com/document/139754159113613312)

- [悬浮窗](https://write.woa.com/document/139754324095582208)

- [自定义铃声](https://write.woa.com/document/139754575448756224)

- [监听通话状态、组件回调事件](https://write.woa.com/document/139754708026372096)

- [设置分辨率、填充模式](https://write.woa.com/document/140283358174851072)

- [界面定制](https://write.woa.com/document/90292932030300160)


## 常见问题
- 如果您的接入和使用中遇到问题，请参见 [常见问题](https://cloud.tencent.com/document/product/647/78769)。

- 了解更多详情您可 [腾讯云通信官方社群](https://zhiliao.qq.com/) 进行咨询和反馈。

# ALL

### 音视频通话功能出现了未开通的错误提示？

您可以选择体验版（7 天试用）或者购买正式版。

##### **对于体验版**

进入 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 的配置页面，并在页面的右下角找到开通腾讯实时音视频服务功能区，单击**免费体验**，选择**领取7天试用，**即可开通 TUICallKit 的 7 天免费试用服务，成为体验版。

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100028816915/64a6cbd1cf6811edb580525400088f3a.png)

##### **对于正式版**

如果您体验过 7 天体验期后，需要购买正式套餐。IM 音视频通话能力针对不同的业务需求提供了差异化的付费版本供您选择，您可以在 [IM 购买页](https://buy.cloud.tencent.com/avc) 了解包含功能并选购您适合的版本。

### 在 TUIChat + TUICallKit 融合场景下，升级 TUICallKit 版本后出现新版本呼叫旧版本，旧版本无法收到通话问题？

TUICallKit 3.1 版本起，在 TUIChat + TUICallKit 融合场景下，通过 TUIChat 中的通话按钮发起通话默认使用 calls 新接口，所以如果您的业务已经上线，您可以通过高级接口将通话接口切换为 call、groupCall，用来保持与线上版本的用户互通。

您需要在登录成功后调用一次高级接口，各个平台的具体使用为：




【iOS(Swift)】
``` swift
let jsonParams: [String: Any] = ["api": "forceUseV2API",
                                 "params": ["enable": true,],]
guard let data = try? JSONSerialization.data(withJSONObject: jsonParams, options: JSONSerialization.WritingOptions(rawValue: 0)) else { return }
guard let paramsString = NSString(data: data, encoding: String.Encoding.utf8.rawValue) as? String else { return }

TUICallKit.createInstance().callExperimentalAPI(jsonStr: paramsString)
```


【iOS(Objective-C)】
``` cpp
NSDictionary *jsonParams = @{@"api": @"forceUseV2API",    
                             @"params": @{@"enable": @YES}};
NSError *error = nil;
NSData *data = [NSJSONSerialization dataWithJSONObject:jsonParams options:0 error:&error];
if (error || !data) { return; }
NSString *paramsString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
if (!paramsString) { return;}
[[TUICallKit createInstance] callExperimentalAPIWithJsonStr:paramsString];


```


【Android(java)】
``` java
 try {
    JSONObject params = new JSONObject();
    params.put("enable", true);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("api", "forceUseV2API");
    jsonObject.put("params", params);
    TUICallKit.createInstance(context).callExperimentalAPI(jsonObject.toString());
} catch (Exception e) {
    e.printStackTrace();
}

```


【Android(kotlin)】
``` java
try {
    val params = JSONObject()
    params.put("enable", true)

    val jsonObject = JSONObject()
    jsonObject.put("api", "forceUseV2API")
    jsonObject.put("params", params)
    TUICallKit.createInstance(context).callExperimentalAPI(jsonObject.toString())
} catch (e: Exception) {
    e.printStackTrace()
}

```


【Flutter(Dart)】
``` java
final jsonParams = {'api': 'forceUseV2API',    
                 'params': {'enable': true} };  
                 
try {    
    final jsonString = json.encode(jsonParams);    
    TUICallKit.instance.callExperimentalAPI(jsonStr: jsonString);  
} catch (e) {    
    return;  
}
```


【Web&小程序】
``` javascript
const jsonObject = {
    api: "forceUseV2API",
    params: {
      enable: true,
    }
};
TUICallKitServer.getTUICallEngineInstance().callExperimentalAPI(JSON.stringfy(jsonObject));

```

### TUICalling 如何升级到 TUICallKit？

TUICallKit 是腾讯云推出一款新的音视频通话 UI 组件，**是 TUICalling 的升级版本**，支持群组通话、AI 降噪等更多功能特性、支持全平台间互通呼叫，功能更加稳定。 从 TUICalling 升级到 TUICallKit 您可以参考：
- [微信小程序升级方案](https://write.woa.com/document/95188944608952320)

- [Web 升级方案](https://write.woa.com/document/95817920823971840)

- [Android 升级方案](https://write.woa.com/document/88642641649037312)

- [iOS 升级方案](https://write.woa.com/document/88642650573402112)

- [uni-app (客户端) 升级方案](https://write.woa.com/document/93912298460639232)

- [Flutter 升级方案](https://write.woa.com/document/93912298460639232)

- [uni-app (小程序) 升级方案](https://write.woa.com/document/131423177502576640)


### 报错 inviteID 无效或邀请已处理

该 inviteID 已经被主叫方取消，或者该邀请已经被接受。由于信令发送受网络带宽等诸多因素影响，在极端情况下(accept 与 reject 接口重复调用)可能会导致 inviteID 无效的错误。

### 消息发送方或接收方 UserID 无效或不存在

您呼叫的用户还没有登录过 TIM，导致呼叫失败，请尝试呼叫已经登录成功过的用户。

### TUICallKit 是否可以不引入 IM SDK，只使用 TRTC？

**不可以**，TUIKit 全系组件都使用了腾讯云 IM SDK 作为通信的基础服务，比如通话拨打信令、通话忙线信令等核心逻辑，如果您已经购买有其他 IM 产品，也可以参照 TUICallKit 逻辑进行适配。

### 如何购买音视频通话套餐？

请参考购买链接 [音视频通话 SDK 价格总览](https://cloud.tencent.com/document/product/1640/79968)，如有其他问题，请点击页面右侧，进行售前套餐咨询；或者加入 QQ 群：**605115878**，进行咨询和反馈。

### **如何获取通话的房间号 Roomid？**

通话接通后，您可以通过 [onCallBegin](https://cloud.tencent.com/document/product/647/78751#oncallbegin) 返回 roomid 字段进行获取。

### 查询用户在线状态

TUICallKit 底层通过 IM 管理用户，可以通过 IM 查询用户的在线状态，方式有以下两种：
- **方式一：**通过 getUserStatus 高级接口查询


   详情可参考：查询用户状态（[Android&iOS&Windows&Mac](https://cloud.tencent.com/document/product/269/75511#.E6.9F.A5.E8.AF.A2.E7.94.A8.E6.88.B7.E7.8A.B6.E6.80.81)、[web&小程序&uniapp](https://cloud.tencent.com/document/product/269/78125#.E6.9F.A5.E8.AF.A2.E7.94.A8.E6.88.B7.E7.8A.B6.E6.80.81)），您可以调用不同平台的接口去查询。
   

   > **注意：**
   > 
>   - 查询其他用户状态需要升级 TUICallKit 套餐包到**群组通话版本**。
>   - 查询其他用户状态需要提前在 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 开启 “用户状态查询及状态变更通知”。不开启，调用`getUserStatus`会报错。

   > ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/55963f596cb611ee9a1c52540047987b.png)
   > 


   getUserStatus接口的返回结果有以下几种：

  - 未知（UNKNOWN）

  - 在线（ONLINE）：当前用户已登录上线，通常情况下，该用户可以正常收到通话请求。

  - 离线（OFFLINE）：用户未主动调用`logout`退出登录，但长连接中断的状态。通常情况下，若接入了离线推送，该用户可以收到离线推送的消息。

  - 未登录（UNLOGINED）：用户注册账号后从未登录过，或者用户主动调用`logout`退出登录，该用户收不到通话请求。

- **方式二：**通过 rest-api 进行查询


   详情可参考：[查询账号在线状态](https://cloud.tencent.com/document/product/269/2566)。


### **音视频通话信令里各字段常见问题？**
<table>
<tr>
<td rowspan="1" colSpan="1" >**问题**</td>

<td rowspan="1" colSpan="1" >**说明**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断 “发起通话”</td>

<td rowspan="1" colSpan="1" >actionType = 1 且 cmd = 'videoCall' 或 'audioCall'</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断 “已接听”</td>

<td rowspan="1" colSpan="1" >actionType = 3 </td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断 “通话已结束”，“通话时长是多收”</td>

<td rowspan="1" colSpan="1" >actionType = 1 且 cmd = 'hangup'，通话时长取 call_end 字段，单位：秒</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断 “取消通话”</td>

<td rowspan="1" colSpan="1" >actionType = 2</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断 “拒绝通话”</td>

<td rowspan="1" colSpan="1" >actionType = 4</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何判断对端忙线产生的 “拒绝通话”</td>

<td rowspan="1" colSpan="1" >actionType = 4 且 "line_busy" = "line_busy"</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >如何被叫判断 “超时未接听”</td>

<td rowspan="1" colSpan="1" >actionType = 5</td>
</tr>
</table>

# Web
> **说明：**
> 
> - 如果并没有解决您的问题，也欢迎您加入我们的 TUICallKit 技术交流 QQ 群： **605115878 **来进行交流讨论。
> - 我们团队即将在 Web 端丰富更多不同的组件，以满足您的开发需求。

> 希望您能抽出几分钟时间，为您自己的需求投上一票，我们将优先开发！
> 

> 问卷地址：[TUICallKit Web 问卷调查](https://wj.qq.com/s2/11263124/1556/)
> 


## 一、基础环境问题

> **说明：**
> 

> 以下问题对于 TUICallKit 与 TUICallEngine SDK 同样适用。
> 


### TUICallEngine 和 TUICallKit 分别是什么？

TUICallKit 是含 UI 音视频通话组件，底层是用 TUICallEngine SDK，目前支持 Typescript+Vue2 / Typescript+Vue3，可直接将组件放到页面中，调用简单的接口即可直接实现音视频通话，开源地址为：[TUICallKit/Web](https://github.com/tencentyun/TUICallKit/tree/main/Web)。

TUICallEngine SDK 是音视频通话组件的无 UI SDK，如果 TUICallKit 的交互并不满足您的需求，您可以使用这套接口自己封装交互。npm 地址为 [@tencentcloud/call-engine-js](https://www.npmjs.com/package/@tencentcloud/call-engine-js)。

### Web 端支持哪些浏览器？报错“获取设备权限失败”？

请先确保页面已被授权使用麦克风或摄像头，参见 [设备授权说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-5)。

对浏览器的详细支持度，请参见 [浏览器兼容信息](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-2)。

对于上述没有列出的环境，您可以在需要检测的浏览器打开 [能力测试](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) 测试是否完整的支持 WebRTC 的功能。

### 为什么本地开发测试能正常使用，但是部署到线上用 IP 访问后无法正常视频/语音通话？
- **对网站域名协议的要求**


   出于对用户安全、隐私等问题的考虑，浏览器限制网页在 HTTPS 协议下才能正常使用本文档中所对接组件的全部功能。为确保生产环境中的用户能够顺畅体验产品功能，请将您的网站部署在 `https://` 协议的域名下。更多请参见 [页面访问协议说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-3)。

- **对网络环境的要求**


   在使用 TUICallKit 时，用户可能因防火墙限制导致无法正常进行音视频通话，请参考 [应对防火墙策略](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-4) 将相应端口及域名添加至防火墙白名单中。


### 在接通过程中报："is not included in the current tim's package"？

TUICallKit（含 TUICallEngine SDK）依赖的 `tim-js-sdk` 版本需要 ≥ 2.21.2。

如果 `tim-js-sdk` 依赖包版本正确，则可能是 SDKAppID 未购买音视频套餐或套餐包不支持所调用的功能，请访问 [音视频通话功能出现了未开通的错误提示](https://cloud.tencent.com/document/product/647/84363)。

### TUICallKit（含 TUICallEngine）是否支持接收离线消息？

不支持接收离线消息。

支持离线消息推送，可以通过 call / groupCall 中的 offlinePushInfo 添加需要推送的消息。

### TUICallEngine init 未完成，需要在 init 完成后使用此API

未调用 [login](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/TUICallEngine.html#login) 接口，所有功能需要先进行登录完成后才能使用，具体参见 [TUICallEngine login](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/TUICallEngine.html#login)。

> **注意：**
> 

> [TUICallEngine login](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/TUICallEngine.html#login) 是一个异步接口，避免在 login 还未完成，直接调用 TUICallEngine 的接口。
> 


### 当前通话状态无法使用该 API 

API 与通话状态对照表：
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >idle</td>

<td rowspan="1" colSpan="1" >calling</td>

<td rowspan="1" colSpan="1" >connected</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >call</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupCall</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >accept</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >reject</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >hangup</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >✓</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >inviteUser</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >✓</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >joinInGroupCall</td>

<td rowspan="1" colSpan="1" >✓</td>

<td rowspan="1" colSpan="1" >×</td>

<td rowspan="1" colSpan="1" >×</td>
</tr>
</table>


## 二、TUICallKit 问题（含 UI）

### 1. TUICallKit Web 支持什么框架？支持 H5 吗？

TUICallKit 适用于 `Vue2.7 + Typescript` 或者 `Vue3 + Typescript` 项目，若您采用其他语言或者技术栈，请访问 [界面定制指引](https://cloud.tencent.com/document/product/647/81014)。

TUICallKit 支持 H5，通过页面 UA 自动修改适应移动端的布局，为了移动端的良好体验，推荐通过修改 CSS 在 H5 时将 `&lt;TUICallKit/&gt;` 组件放大至全屏。

### 2. TUICallKit 打包失败？

对于 Vite 项目，您需要在 `vite.config.js` 中添加 `base: "./"`。

对于 Vue-CLI 创建的 webpack 项目，您需要在 `vue.config.js` 中添加 `publicPath: "./"`。

### 3. TUICallKit 报错“获取设备权限失败”？

请先确保页面已被授权使用麦克风或摄像头，参见 [设备授权说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/tutorial-05-info-browser.html#h2-5)。

可以尝试 [Github Demo](https://write.woa.com/document/89961693240934400) 是否可以正常通话，然后在 [设备检测页面](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) 检查是否支持 webrtc。

### 4. timeout 字段设置无效原因？

该字段目前在 call / groupcall API 中会被使用到。

**目前全平台 TUICallKit 的策略是被叫登录后，仅拉取 30s 内的历史消息。**所以被叫登录后无法拉到主叫 30s 前的呼叫信息，从而导致被叫无法拉起邀请页面进行通话。

### 5. 视频通话切换大小屏出现闪屏现象？

ios 17 设备和 WebRTC 底层兼容性问题，等待后续修复。

### 6. safari 浏览器省电模式出现暂停键？

浏览器层面针对省电模式的视频播放策略，SDK 无法处理。

### 7.如何生成 UserSig？

UserSig 是腾讯云为其云服务设计的一种安全保护签名，是一种登录凭证，由 SDKAppID 与 SecretKey 等信息组合加密得到。
- **方式一：**控制台获取，参考 [获取临时 userSig](https://console.cloud.tencent.com/trtc/usersigtool)。

- **方式二：**部署临时生成脚本。
   

   > **警告：**
   > 

   > 此方式是在前端代码中配置 SecretKey，该方法中 SecretKey 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量，因此**该方法仅适合本地跑通功能调试**，生产环境请看方式三。
   > 


   为方便初期调试，userSig 可临时使用 `GenerateTestUserSig-es.js` 中 `genTestUserSig(params)` 函数来计算 ，例如：

   ``` javascript
   import { genTestUserSig } from "@tencentcloud/call-uikit-vue/debug/GenerateTestUserSig-es.js";
   const { userSig } = genTestUserSig({ userID: "Alice", SDKAppID: 0, SecretKey: "YOUT_SECRETKEY" });
   ```
- **方式三：**正式环境使用。


   正确的 UserSig 签发方式是将 UserSig 的计算代码集成到您的服务端，并提供面向项目的接口，在需要 UserSig 时由您的项目向业务服务器发起请求获取动态 UserSig。更多详情请参见 [服务端生成 UserSig](https://cloud.tencent.com/document/product/269/32688#GeneratingdynamicUserSig)。


### 8.如何创建 userID？
- 通过 userID 与 UserSig 登录过一次，会默认创建该用户。

- 通过 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 进行创建和获取，单击目标应用卡片，进入应用的账号管理页面，也可创建账号并获取 userID。![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/e0f08c8aece211ee9c425254001a1c03.png)


### 9. 

**解决源码拷贝可能导致的报错**

如果您在使 TUICallKit 组件时遇到了报错，请不要担心，大多数情况下这是由于 ESLint 和 TSConfig 配置不一致造成的。您可以查阅文档，按照要求正确配置即可。如果您需要帮助，请随时联系我们，我们将确保您能够成功地使用此组件。以下是几个常见的问题：



【ESLint 报错】

若 TUICallKit 与您项目的代码风格不一致导致报错，可将本组件目录屏蔽，如在项目根目录增加 `.eslintignore` 文件，如：
``` plaintext
# .eslintignore
src/components/TUICallKit
```

【TypeScript 报错】

如遇 `Cannot find module '../package.json'`报错，是因为 TUICallKit 内引用了 JSON 文件，可在`tsconfig.json`中添加相关配置。

其他 TSConfig 问题请参见 [TSConfig Reference](https://www.typescriptlang.org/tsconfig)。
``` json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### 10. 如何源码集成 TUICallKit？

#### 步骤一：下载 TUICallKit 组件源码及相关插件



【Vue3】
``` bash
npm install @tencentcloud/call-uikit-vue
```

【Vue2.7】
``` bash
npm install @tencentcloud/call-uikit-vue2
```

【Vue2.6】
``` plaintext
npm install @tencentcloud/call-uikit-vue2.6 @vue/composition-api 
```

源码集成需要安装 [unplugin-vue2-script-setup](https://www.npmjs.com/package/unplugin-vue2-script-setup) 插件。
``` bash
npm i -D unplugin-vue2-script-setup
```

修改构建工具配置文件。




【Vue Cli】
``` javascript
// vue.config.js
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default

module.exports = {
  parallel: false, // disable thread-loader, which is not compactible with this plugin
  configureWebpack: {
    plugins: [
      ScriptSetup({ /* options */ }),
    ],
  },
}
```


【vite】
``` javascript
// vite.config.ts
import { defineConfig } from 'vite'
import { createVuePlugin as Vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'

export default defineConfig({
  plugins: [
    Vue2(),
    ScriptSetup({ /* options */ }),
  ],
})

```


【Webpack】
``` javascript
// webpack.config.js
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default

module.exports = {
  /* ... */
  plugins: [
    ScriptSetup({ /* options */ }),
  ]
}
```

#### 步骤二：源码集成 TUICallKit 组件包

将源码拷贝到自己的项目中，以拷贝到`src/components/`目录为例：




【macOS + Vue3】
``` html
mkdir -p ./src/components/TUICallKit && cp -r ./node_modules/@tencentcloud/call-uikit-vue/* ./src/components/TUICallKit
```


【macOS + Vue2】
``` html
mkdir -p ./src/components/TUICallKit && cp -r ./node_modules/@tencentcloud/call-uikit-vue2/* ./src/components/TUICallKit
```


【Windows + Vue3】
``` html
xcopy .\node_modules\@tencentcloud\call-uikit-vue  .\src\components\TUICallKit /i /e
```


【Windows + Vue2】
``` html
xcopy .\node_modules\@tencentcloud\call-uikit-vue2  .\src\components\TUICallKit /i /e
```

#### 步骤三：修改 TUICallKit 引入路径

修改 TUICallKit 引入路径为本地文件引入。

> **注意：**
> 

> 此方法可能与您的 ESLint、TypeScript 配置冲突，若出现报错，可参见 [解决源码拷贝导致的报错](https://write.woa.com/document/86735803187277824)。
> 

``` typescript
import { TUICallKit, TUICallKitServer } from "./components/TUICallKit/src/index";
```

接下来请参见上面的步骤及说明，使用 TUICallKit 组件提供的功能。

## 三、套餐问题

### 1. 错误提示“The package you purchased does not support this ability”？

由于您当前应用的音视频通话能力包过期或未开通，请参见 [开通服务](https://cloud.tencent.com/document/product/647/104662)，领取或者开通音视频通话能力，进而继续使用 TUICallKit 组件。

### 2. 如何购买套餐？

请参考购买链接 [音视频通话 SDK 价格总览](https://cloud.tencent.com/document/product/1640/79968)，如有其他问题，请点击页面右侧，进行售前套餐咨询，或 [进入 IM 社群](https://zhiliao.qq.com/) 进行咨询和反馈。

## 四、内网代理

### 内网的环境下如何使用 callkit？
1. 通过 getTRTCCloudInstance 获取 TRTCCloud 实例。
   

   > **注意：**
   > 

   > **v3.1.3+ 支持。**
   > 

   ``` javascript
   const trtcCloud = TUICallKitServer.getTUICallEngineInstance().getTRTCCloudInstance();
   ```
2. 通过 TRTCCloud 实例调用 callExperimentalAPI 完成代理服务器的设置（注意：需要在通话前调用）。具体如下：

   ``` javascript
   trtcCloud.callExperimentalAPI(JSON.stringify({
      api: 'setNetworkProxy',
      params: {
         websocketProxy: 'wss://proxy.example.com/ws/',
         turnServer: [{
            url: '14.3.3.3:3478',
            username: 'turn',
            credential: 'turn',
         }],
         iceTransportPolicy: 'relay',
      },
   }));
   ```   

   > **注意：**
   > 

   > TRTC 应对防火墙受限参见 [设置代理服务器](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/zh-cn/tutorial-11-set_proxy_server.html)。
   > 


## 五、其它

### 1. 如何关闭美颜？
- web 端默认无美颜。

- 小程序端调用 [setBeautyLevel API](https://cloud.tencent.com/document/product/647/78761#setBeautyLevel)，传入参数为0时，会关闭默认美颜。

   ``` javascript
   TUICallKitServer.getTUICallEngineInstance().setBeautyLevel(0);
   ```


# Android
### TUICallKit 是否可以不引入 IM SDK，只使用 TRTC？

**不可以**，TUIKit 全系组件都使用了腾讯云 IM SDK 作为通信的基础服务，例如通话拨打信令、通话忙线信令等核心逻辑，如果您已经购买有其他 IM 产品，也可以参照 TUICallKit 逻辑进行适配。

### 错误提示“The package you purchased does not support this ability”？

如遇以上错误提示，是由于您当前应用的音视频通话能力包过期或未开通，请参见 [开通服务](https://write.woa.com/document/139743928960860160)，领取或者开通音视频通话能力，进而继续使用 TUICallKit 组件。

### 如何购买音视频通话套餐？

请参考购买链接 [音视频通话 SDK 价格总览](https://cloud.tencent.com/document/product/1640/79968)，如有其他问题，请点击页面右侧，进行售前套餐咨询；或者加入 QQ 群：**605115878**，进行咨询和反馈。

### TUICallKit 崩溃，崩溃日志："No implementation found for xxxx"？

堆栈信息如下：
``` java
java.lang.UnsatisfiedLinkError: No implementation found for void com.tencent.liteav.base.Log.nativeWriteLogToNative(int, java.lang.String, java.lang.String) (tried Java_com_tencent_liteav_base_Log_nativeWriteLogToNative and Java_com_tencent_liteav_base_Log_nativeWriteLogToNative__ILjava_lang_String_2Ljava_lang_String_2)
       at com.tencent.liteav.base.Log.nativeWriteLogToNative(Native Method)
       at com.tencent.liteav.base.Log.i(SourceFile:177)
       at com.tencent.liteav.basic.log.TXCLog.i(SourceFile:36)
       at com.tencent.liteav.trtccalling.model.impl.base.TRTCLogger.i(TRTCLogger.java:15)
       at com.tencent.liteav.trtccalling.model.impl.ServiceInitializer.init(ServiceInitializer.java:36)
       at com.tencent.liteav.trtccalling.model.impl.ServiceInitializer.onCreate(ServiceInitializer.java:101)
       at android.content.ContentProvider.attachInfo(ContentProvider.java:2097)
       at android.content.ContentProvider.attachInfo(ContentProvider.java:2070)
       at android.app.ActivityThread.installProvider(ActivityThread.java:8168)
       at android.app.ActivityThread.installContentProviders(ActivityThread.java:7709)
       at android.app.ActivityThread.handleBindApplication(ActivityThread.java:7573)
       at android.app.ActivityThread.access$2600(ActivityThread.java:260)
       at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2435)
       at android.os.Handler.dispatchMessage(Handler.java:110)
       at android.os.Looper.loop(Looper.java:219)
       at android.app.ActivityThread.main(ActivityThread.java:8668)
       at java.lang.reflect.Method.invoke(Native Method)
       at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:513)
       at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1109)
```

> **注意：**
> 

> 上述异常，是因为 TUICallKit 依赖的 TRTC 等 SDK 部分接口使用了 JNI 实现，Android Studio 在某些条件进行编译 APK 的时候可能并不会把 Native 的 .so 库打包进去，导致出现这类报错，重新 Clean 一下工程，卸载重装即可。
> 


### allowBackup 异常？
- **报错信息**：`Manifest merger failed : Attribute application@allowBackup value=(true) from AndroidManifest.xml`

- **问题原因**：TUICallKit 依赖的 IM SDK 中默认 allowBackup 的值为 false ，表示关闭应用的备份和恢复功能。

- **解决方法**：您可以在您工程的 `AndroidManifest.xml` 文件中删除 allowBackup 属性或将该属性改为 false，表示关闭备份和恢复功能；也可以在 `AndroidManifest.xml` 文件的 application 节点中添加 `tools:replace="android:allowBackup";` 表示覆盖 IM SDK 的设置，使用您自己的设置。


### TUICallKit 是否支持离线推送呢？

**支持**，Android 离线推送采用腾讯云的**TIMPush推送插件**以及**自集成推送**，接入方式详见：[离线唤醒](https://write.woa.com/document/86735802148151296)。

### 在通话邀请超时时间内，被邀请者如果离线再上线，能否弹出通话界面？

单人通话时，如果在超时时间内上线，会触发来电邀请；群组通话，如果在超时时间内上线，会拉起未处理的20条群消息，如果存在通话邀请，则触发来电邀请。在不同的版本上来电的显示策略有所不同（详见下方：[被叫端来电显示策略](https://write.woa.com/document/86735803114926080)）。

### 应用在后台时，不能自动将通话界面拉取到前台
1. TUICallKit 2.3 及以上版本（[Android&iOS 发布日志](https://cloud.tencent.com/document/product/647/80931)）调整了被叫端的来电显示策略，见下方：[被叫端来电显示策略](https://write.woa.com/document/86735803114926080)。

2. TUICallKit 2.3 版本之前，将应用从后台自动拉取到前台，需要检查 App 是否开启了“后台自启动”或“悬浮窗”权限。


   不同厂商、甚至同一厂商不同 Android 版本，其对于应用开放的权限以及权限名称也会存在不一致。例如，小米6只需要开启后台弹出界面权限，而红米需要同时打开后台弹出界面和显示悬浮窗权限。如何开启权限，详见下方：[相关权限开启](https://write.woa.com/document/86735803114926080)。

3. 如果遇到以下场景拉不起通话界面，原因是：应用的启动堆栈变化，导致 CallKitActivity 界面被遮挡移除了。


   场景一：接通后退到后台，点击桌面图标进入应用，原通话界面消失；


   场景二：应用在后台时，开启banner的情况下，收到通知View，不点击View，点击桌面图标进入应用，拉不起通话界面且通知消失；


   场景三：应用在后台时，收到离线推送，不点击推送通知，点击桌面图标进入应用，无法拉起通话界面或通话界面闪了一下；


   以上几种情况，需要在您自己业务的默认启动的主 Activity 中添加以下代码，每个应用默认启动的 Activity 都不一样，详见 AndroidManifest.xml 配置，以目前大部分应用的启动页 SplashActivity 为例：


   

【添加代码】
``` java
if (!isTaskRoot() && getIntent() != null && getIntent().hasCategory(Intent.CATEGORY_LAUNCHER) 
        && Intent.ACTION_MAIN.equals(getIntent().getAction())) {
    finish();
    return;
}
```

【具体添加位置】

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/ab370eb65a0711ef81cf525400d5f8ef.png)
   

   > **说明：**
   > 

   > SplashActivity 的启动模式不能是 singleTask；singleTask 模式下 isTaskRoot 是 true，上述方法不生效。
   > 

   > 如果您在开发中开启了所有权限或做了上述尝试，依然无法自动拉起通话界面到前台，请加入 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，联系我们协助处理。
   > 


### 被叫端来电显示策略

为使 TUICallKit 适应不同的业务需求，增加产品特色，提升用户的使用体验，TUICallKit **2.3 及以上版本**（[发布日志](https://cloud.tencent.com/document/product/647/80931)），优化收到来电后的通话页面显示弹出策略，详情如下所示：
<table>
<tr>
<td rowspan="1" colSpan="1" >全屏显示通话等待界面</td>

<td rowspan="1" colSpan="1" >横幅显示来电请求</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/f3bd1fb90ea111ef987c5254002977b6.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/da064db50ea111ef97985254005ac0ca.png)</td>
</tr>
</table>




【2.3.0.920版本及之后的版本】
1. 如果您想要被叫端收到邀请时，尽量去拉起全屏通话界面，那么您可以更新 [tuicallkit-kt](https://github.com/Tencent-RTC/TUICallKit/tree/main/Android/tuicallkit-kt) 代码到最新。该情况下，被叫端的来电显示策略如下：


![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/55b57ba00e8011ef814b525400f2c344.png)
2. 如果您想在被叫端收到通话的时候，先展示一个横幅，然后根据需要拉起全屏通话界面，那么您可以调用以下接口开启该功能。

``` java
  TUICallKit.createInstance(context).enableIncomingBanner(true);
```

开启后，被叫端的来电策略如下所示，只要开启**悬浮窗权限，**就能尽可能的展示来电横幅。

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/c7ce51860e7f11ef8c545254000781d8.png)

【2.3版本之前】

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/e08d1f260e7d11ef8c545254000781d8.png)

> **说明：**
> 

> 相关权限如何开启，详见下方：[相关权限开启](https://write.woa.com/document/86735803114926080)。
> 


如果没有按照上述策略显示来电界面，请过滤`onCallReceived`日志，检查是否收到通话邀请，如果没有该日志的打印，请加入我们的 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，联系我们协助处理。

### **相关权限开启**

为实现良好的通话体验，建议您在应用中开启“通知”权限、“显示在其他应用上层（悬浮窗）”以及“后台拉起界面”权限，具体方法如下：



【代码指引】
- **通知权限**：便于展示推送通知：请参见 [通知运行时权限](https://developer.android.com/develop/ui/views/notifications/notification-permission) 和 [请求运行时权限](https://developer.android.com/training/permissions/requesting#request-permission) 根据业务需求自行实现。

- **悬浮窗权限**：用于展示自定义的来电横幅，以及通话悬浮窗。

- **后台拉起界面权限**：用于当应用在后台时拉起界面（例如：vivo手机）。

``` java
fun requestPermission(context: Context?) {
    //In TUICallKit,Please open both OverlayWindows and Background pop-ups permission.
    PermissionRequester.newInstance(
         PermissionRequester.FLOAT_PERMISSION, PermissionRequester.BG_START_PERMISSION)
        .request()
}
```

【手动开启】

安装应用后，您可以长按应用图标，选择“应用信息”，然后开启“通知”权限、“显示在其他应用上层”以及“后台拉起界面”权限。或者您可以到`手机 > 系统设置 > 应用管理 > 应用`中手动开启上述权限。
<table>
<tr>
<td rowspan="1" colSpan="1" >Pixel 4a</td>

<td rowspan="1" colSpan="1" >小米</td>

<td rowspan="1" colSpan="1" >vivo</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/b13ec4c8f7b611eea1dd525400eeaf97.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/b14a4144f7b611ee95c1525400fe11be.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/1aeffd1afd7811ee9f79525400a7e516.png)</td>
</tr>
</table>


# iOS
### 错误提示“The package you purchased does not support this ability”？

如遇以上错误提示，是由于您当前应用的音视频通话能力包过期或未开通，请参见 [开通服务](https://write.woa.com/document/139743928960860160)，领取或者开通音视频通话能力，进而继续使用TUICallKit组件。

### 如何购买音视频通话套餐？

请参见购买链接 [开通正式版](https://cloud.tencent.com/document/product/647/104662#formal)，如有其他问题，请点击页面右侧，进行售前套餐咨询；也可以加入我们的 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，进行咨询和反馈。

### 如何修改 TUICallKit 源码？

使用 `CocoaPods` 导入组件，具体步骤如下：
1. 在您的工程 `Podfile` 文件同一级目录下创建 `TUICallKit` 文件夹。

2. 单击进入 [Github/TUICallKit](https://github.com/tencentyun/TUICalling) ，选择克隆/下载代码，然后将 [iOS](https://github.com/tencentyun/TUICalling/tree/main/iOS) 目录下的 [TUICallKit_Swift](https://github.com/Tencent-RTC/TUICallKit/tree/main/iOS/TUICallKit_Swift) 文件夹和 [TUICallKit_Swift.podspec](https://github.com/Tencent-RTC/TUICallKit/blob/main/iOS/TUICallKit_Swift.podspec) 文件拷贝到您在 `步骤1` 创建的 `TUICallKit` 文件夹下。

3. 在您的 `Podfile` 文件中添加以下依赖。

   ``` bash
   # :path => "指向 TUICallKit_Swift.podspec 的相对路径"
   pod 'TUICallKit_Swift', :path => "TUICallKit/TUICallKit_Swift.podspec"
   ```
4. 执行 `pod install` 命令，完成导入。
   

   > **注意：**
   > 

   > `TUICallKit_Swift`文件夹和`TUICallKit_Swift.podspec`文件必须在同一目录下。
   > 


   **TUICallKit_Swift 组件集成后效果**：


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/4fee92e91e3211efbef6525400a8a0fb.png)
   

   > **说明：**
   > 

   > TUICallKit_Swift 组件集成后支持文件夹分层显示，方便您阅读和修改源代码。
   > 


### Xcode 15 编译报错？

#### 1、出现 **Sandbox: rsync **编译报错

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/501cfdc31e3211ef90c35254006d3582.png)

可以在 **Build Settings **中把 **User Script Sandboxing **设置为 **NO：**

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/4ff5696e1e3211efa62352540003d080.png)

#### 2、出现 **SDK does not contain **编译报错

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/4ffcb4231e3211ef860b52540049c929.png)

可以在 Podfile 添加如下代码：
``` bash
# target 'xxxx' do
#  ...
#  pod 'TUICallKit_Swift'
# end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

#### 3、如果在 **M 系列电脑**上运行模拟器，可能会出现 **Linker command failed with exit code 1 (use -v to see invocation) **编译报错

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/50ee41241e3211ef91395254000a29ac.png)

可以在 Podfile 添加如下代码：
``` bash
# target 'xxxx' do
#  ...
#  pod 'TUICallKit_Swift'
# end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = "arm64"
    end
  end
end
```

### TUICallKit 和自己集成的音视频库冲突了？

腾讯云的 `音视频库` 不能同时集成，可能存在符号冲突，可以按照下面的场景处理。
1. 如果您使用了 `TXLiteAVSDK_TRTC` 库，不会发生符号冲突。可直接在 `Podfile` 文件中添加依赖，

   ``` bash
   pod 'TUICallKit_Swift'
   ```
2. 如果您使用了 `TXLiteAVSDK_Professional` 库，会产生符号冲突。您可在 `Podfile` 文件中添加依赖，

   ``` bash
   pod 'TUICallKit_Swift/Professional'
   ```
3. 如果您使用了 `TXLiteAVSDK_Enterprise` 库，会产生符号冲突。建议升级到 `TXLiteAVSDK_Professional` 后使用 TUICallKit_Swift`/Professional`。


### TUICallKit 是否可以不引入 IM SDK，只使用 TRTC？

**不可以。**`TUIKit` 全系组件都使用了腾讯云 IM SDK 作为通信的基础服务，比如通话拨打信令、通话忙线信令等核心逻辑，如果您已经购买有其他 `IM` 产品，也可以参照 `TUICallKit` 逻辑进行适配。

### TUICallKit 组件支持自定义铃声吗？

**支持**，调用 [setCallingBell](https://write.woa.com/document/86735802543452160) 即可。

### TUICallKit 是否支持后台运行？

**支持**，如需要进入后台仍然运行相关功能，可选中当前工程项目，在 **Capabilities** 下的 **Background Modes** 模块中勾选 **Audio，AirPlay and Picture in Picture** ，如下图所示：

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/f29734a51e3111ef860b52540049c929.png)

### 如何查看 TRTC 日志？

TRTC 的日志默认压缩加密，后缀为 .xlog。日志是否加密是可以通过 setLogCompressEnabled 来控制，生成的文件名里面含 C(compressed) 的就是加密压缩的，含 R(raw) 的就是明文的。

iOS：`sandbox的Documents/log`

> **说明：**
> 
> - 查看 .xlog 文件需要下载 [解密工具](https://dldir1.qq.com/hudongzhibo/log_tool/decode_mars_log_file.py)，在 Python 2.7环境中放到 xlog 文件同目录下直接使用 `python decode_mars_log_file.py` 运行即可。
> - 查看 .clog 文件（9.6 版本以后新的日志格式）需要下载 [解密工具](http://dldir1.qq.com/hudongzhibo/log_tool/decompress_clog.py)，在 Python 2.7 环境中放到 clog 文件同目录下直接使用 `python decompress_clog.py `运行即可。


# Flutter
### 同时集成 tencent_calls_uikit 和 tencent_trtc_cloud，或同时集成 tencent_calls_uikit 和 live_flutter_plugin，出现符号冲突报错，怎么解决？

问题详情：当引入 flutter ''tencent_calls_uikit'' 进我们现有的 project 后，Android 构建 APK 时出现如下报错：
``` bash
Duplicate class com.tencent.liteav.LiveSettingJni found in modules jetified-LiteAVSDK_Professional-10.7.0.13053-runtime 
(com.tencent.liteav:LiteAVSDK_Professional:10.7.0.13053) and jetified-LiteAVSDK_TRTC-10.3.0.11225-runtime 
(com.tencent.liteav:LiteAVSDK_TRTC:10.3.0.11225)
```

iOS 在执行`pod install`出现如下报错：
``` plaintext
[!] The 'Pods-Runner' target has frameworks with conflicting names: txsoundtouch.xcframework and txffmpeg.xcframework.
```

这个问题原因是您使用的 tencent_calls_uikit 和 tencent_trtc_cloud 分别依赖于 TRTC Android SDK 的专业版和精简版，这个问题我们已经在最新的版本中解决，只需要您将 [tencent_calls_uikit](https://pub.dev/packages/tencent_calls_uikit) 和 [tencent_trtc_cloud](https://pub.dev/packages/tencent_trtc_cloud)升级到最新版本即可。

### Flutter Android未添加混淆设置，怎么设置？

如果您需要编译运行在 Android 平台，由于我们在 SDK 内部使用了Java 的反射特性，需要将 SDK 中的部分类加入不混淆名单，因此需要您在 proguard-rules.pro 文件中添加如下代码：
``` html
-keep class com.tencent.** { *; }
```

### 从1.8.0以下的版本升级到1.8.0及以上的版本，导致编译报错或者拉不起页面问题如何修复？   

如果是从1.8.0以下升级到1.8.0及以上的版本，需要您检查下面几个步骤是否正常：
1. 将 navigatorObservers 添加到 MateriaApp。 目的是在收到呼叫邀请时导航到 TUICallKit 页面。示例代码如下：

   ``` plaintext
   import 'package:tencent_calls_uikit/tuicall_kit.dart';
   
   MaterialApp（
        navigatorObservers：[TUICallKit.navigatorObserver]，
        ...
   ）     
   ```
2. tencent_calls_engine 插件中的导入文件统一替换为新的。

   ``` plaintext
   import 'package:tencent_calls_engine/tuicall_engine.dart';
   import 'package:tencent_calls_engine/tuicall_observer.dart';
   import 'package:tencent_calls_engine/tuicall_define.dart';
   ```

   上图内容替换为下图所示：

   ``` plaintext
   import 'package:tencent_calls_engine/tencent_calls_engine.dart';
   ```
3. 登录 API 调整更规范，不需要再指定参数。

   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027983635/c4114c2634fb11eeaa5e5254005c1bd1.png)

4. 离线推送参数构造优化。

   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027983635/01e0fcc434fc11eeaa5e5254005c1bd1.png)


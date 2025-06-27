本文将介绍如何快速完成 TUICallKit 组件的接入，您将在10分钟内完成以下几个关键步骤，并最终得到一个包含完备 UI 界面的视频通话功能。

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/ace7b80f181f11ef9c015254002977b6.png)

## 环境准备
- [Node.js](https://nodejs.org/en/) version 16+.

- Modern browser, supporting WebRTC APIs.

- **npm 包集成**

  - Vue3 开发环境，集成 [@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue) NPM 包。

  - Vue2.7 开发环境：集成 [@tencentcloud/call-uikit-vue2](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2) NPM 包。

  - Vue2.6 开发环境：集成 [@tencentcloud/call-uikit-vue2.6](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2.6) + [@vue/composition-api](https://www.npmjs.com/package/@vue/composition-api) NPM 包。

- **源码集成**

  - Vue3 + TypeScript 开发环境：从 [@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue) NPM 包拷贝源码。

  - Vue2.7 + TypeScript 开发环境：从 [@tencentcloud/call-uikit-vue2](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2) NPM 包拷贝源码。

  - Vue2.6 + TypeScript 开发环境：从 [@tencentcloud/call-uikit-vue2.6](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2.6) NPM 包拷贝源码。

    - 需要：Vue2.6 + [unplugin-vue2-script-setup](https://www.npmjs.com/package/unplugin-vue2-script-setup) + [@vue/composition-api](https://www.npmjs.com/package/@vue/composition-api) 。
         

         > **注意：**
         > 
>       1. HBuilderX 中选择 vue2 时，使用的是 vue2.6，因此需要使用：[@tencentcloud/call-uikit-vue2.6](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue2.6)。
>       2. HBuilderX 中选择 vue3 时，使用的是 vue3，因此需要使用：[@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue)。


## 步骤一：开通服务

请参见 [开通服务](https://cloud.tencent.com/document/product/647/104662)，获取 `SDKAppID、SecretKey`，他们将在 [初始化 TUICallKit 组件](https://write.woa.com/document/86735801898577920) 作为**必填参数**使用。

## 步骤二：下载 TUICallKit 组件

推荐使用 NPM 集成，如果您需要采用源码集成，请参见 [TUICallKit 源码集成](https://cloud.tencent.com/document/product/647/81014)。

> **说明：**
> 

> 如果您的工程同时使用了 **TUIChat UIKit**，请直接移步 [TUIKit 接入音视频通话](https://cloud.tencent.com/document/product/269/79861) 进行接入。
> 

1. 下载 [@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue) 组件。


   

【Vue3】
``` bash
npm install @tencentcloud/call-uikit-vue
```

【Vue2.7】
``` bash
npm install @tencentcloud/call-uikit-vue2
```

【Vue2.6】
``` bash
npm install @tencentcloud/call-uikit-vue2.6 @vue/composition-api 
```

如果是源码集成还需要安装 [unplugin-vue2-script-setup](https://www.npmjs.com/package/unplugin-vue2-script-setup)。
``` bash
npm i -D unplugin-vue2-script-setup
```

2. 将 `debug` 目录复制到您的项目目录 `src/debug`，本地生成 userSig 时需要使用。


   

【Vue3】



【MacOS 端】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-vue/debug ./src
```

【Windows 端】
``` bash
xcopy node_modules\@tencentcloud\call-uikit-vue\debug .\src\debug /i /e
```

【Vue2.7】



【MacOS 端】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-vue2/debug ./src
```

【Windows 端】
``` bash
xcopy node_modules\@tencentcloud\call-uikit-vue2\debug .\src\debug /i /e
```



【Vue2.6】



【MacOS 端】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-vue2.6/debug ./src
```

【Windows 端】
``` bash
xcopy node_modules\@tencentcloud\call-uikit-vue2.6\debug .\src\debug /i /e
```


## 步骤三：初始化 TUICallKit 组件

> **说明：**
> 

> TUICallKit 组件需要放到一个 dom 节点里，用于控制 TUICallKit 的位置、宽高等样式。
> 

1. 引入 [<TUICallKit />](https://cloud.tencent.com/document/product/647/81015#tuicallkit)，该组件包含通话时的完整 UI 交互。

   ``` html
   <template>
     <div>
       <span> caller's ID: </span>
       <input type="text" v-model="callerUserID"> 
       <button @click="init"> step1. init </button> <br>
       <span> callee's ID: </span>
       <input type="text" v-model="calleeUserID">
       <button @click="call"> step2. call </button>
       
       <!--【1】Import the TUICallKit component: Call interface UI -->
       <TUICallKit style="width: 650px; height: 500px " />
     </div>
   </template>
   ```
2. 调用 [TUICallKitServer.init](https://cloud.tencent.com/document/product/647/81015#init) API 登录组件，需要在代码中`填写``SDKAppID、SecretKey`** 两个参数。**


   

【Vue3】

您可以选择在 `src/App.vue` 文件引入示例代码，示例代码采用的是 Vue3 `Composition API`写法。
``` javascript
import { ref } from 'vue';
import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-vue";
import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; // Refer to Step 3

const SDKAppID = 0;       // TODO: Replace with your SDKAppID (Notice: SDKAppID is of type number）
const SecretKey = 'xx';   // TODO: Replace with your SecretKey

const callerUserID = ref('');
const calleeUserID = ref('');

//【2】Initialize the TUICallKit component
const init = async () => {
  const { userSig } = GenerateTestUserSig.genTestUserSig({
    userID: callerUserID.value, 
    SDKAppID,
    SecretKey: SecretKey,
  });
  await TUICallKitServer.init({
    userID: callerUserID.value, 
    userSig, 
    SDKAppID,
    // tim: this.tim     // 如果工程中已有 tim 实例，需在此处传入
  });
  alert('TUICallKit init succeed');
}
</script>
```

【Vue2.7】
``` javascript
import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-vue2";
import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es";

export default {
  name: 'App',
  data() {
    return {
      callerUserID: '',
      calleeUserID: '',
      SDKAppID: 0,      // TODO: Replace with your SDKAppID
      SecretKey: 'xx',  // TODO: Replace with your SecretKey
    };
  },
  components: {
    TUICallKit
  },
  methods: {
    //【2】Initialize the TUICallKit component
    async init() {
      try {
        const { userSig } = GenerateTestUserSig.genTestUserSig({
          userID: this.callerUserID,
          SDKAppID: Number(this.SDKAppID),
          SecretKey: this.SecretKey,
        });
        await TUICallKitServer.init({
          SDKAppID: Number(this.SDKAppID),
          userID: this.callerUserID,
          userSig,
          // tim: this.tim     // 如果工程中已有 tim 实例，需在此处传入
        });
        alert("[TUICallKit] Initialization succeeds.");
      } catch (error) {
        alert(`[TUICallKit] Initialization failed. Reason: ${error}`);
      }
    },
  }
}

```

【Vue2.6】
1. `main.ts 文件`注册 [@vue/composition-api](https://www.npmjs.com/package/@vue/composition-api) 。





【main.ts】
``` javascript
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```
2. 将下面代码直接复制引用在 `App.vue `文件中。

``` javascript
import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-vue2.6";
import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es";

export default {
  name: 'App',
  data() {
    return {
      callerUserID: '',
      calleeUserID: '',
      SDKAppID: 0,      // TODO: Replace with your SDKAppID
      SecretKey: 'xx',  // TODO: Replace with your SecretKey
    };
  },
  components: {
    TUICallKit
  },
  methods: {
    //【2】Initialize the TUICallKit component
    async init() {
      try {
        const { userSig } = GenerateTestUserSig.genTestUserSig({
          userID: this.callerUserID,
          SDKAppID: Number(this.SDKAppID),
          SecretKey: this.SecretKey,
        });
        await TUICallKitServer.init({
          SDKAppID: Number(this.SDKAppID),
          userID: this.callerUserID,
          userSig,
          // tim: this.tim     // 如果工程中已有 tim 实例，需在此处传入
        });
        alert("[TUICallKit] Initialization succeeds.");
      } catch (error) {
        alert(`[TUICallKit] Initialization failed. Reason: ${error}`);
      }
    },
  }
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
>   - **开发环境**：如果您正在本地跑通 Demo、开发调试，可以采用 debug 文件中的 `genTestUserSig`（参考步骤3.2）函数生成 userSig。该方法中 SDKSecretKey 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量。
>   - **生产环境**：如果您的项目要发布上线，请采用 [服务端生成 UserSig](https://cloud.tencent.com/document/product/647/17275) 的方式。


## 步骤四：拨打您的第一通电话
1. 调用 [TUICallKitServer.calls API](https://cloud.tencent.com/document/product/647/81015#calls) 拨打通话。


   


【Vue3】
``` javascript
//【3】Make a 1v1 video call
const call = async () => {
  await TUICallKitServer.calls({
    userIDList: [calleeUserID.value],
    type: TUICallType.VIDEO_CALL,
  }); 
};
```


【Vue2.7】
``` javascript
//【3】Make a 1v1 video call
async call () {
  await TUICallKitServer.calls({
    userIDList: [this.calleeUserID],
    type: TUICallType.VIDEO_CALL,
  }); 
}
```


【Vue2.6】
``` javascript
//【3】Make a 1v1 video call
async call () {
  await TUICallKitServer.calls({
    userIDList: [this.calleeUserID],
    type: TUICallType.VIDEO_CALL,
  }); 
}
```

2. 运行项目。
   

   > **警告：**
   > 

   > **本地环境请在 localhost 协议下访问，公网体验请在 HTTPS 协议下访问，具体参见 **[网络访问协议说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-05-info-browser.html#h2-3)**。**
   > 

3. 打开两个浏览器页面，输入不同的 userID(由您定义) 单击 `step1. init`登录（主叫方和被叫方）。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/d6a205362c8611ef9bb3525400ab9413.png)

4. 两个 userID 都登录成功后，单击 `step2. call `拨打通话，如果您有通话问题，参见 [常见问题](https://cloud.tencent.com/document/product/647/78769)。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/e9c5b2a42c8611ef97da5254007d9c55.png)


## 更多特性
- [设置昵称、头像](https://write.woa.com/document/140283367112228864)

- [群组通话](https://write.woa.com/document/139754159113613312)

- [悬浮窗](https://write.woa.com/document/139754324095582208)

- [自定义铃声](https://write.woa.com/document/139754575448756224)

- [监听通话状态、组件回调事件](https://write.woa.com/document/139754708026372096)

- [设置分辨率、填充模式](https://write.woa.com/document/140283358174851072)

- [界面定制](https://write.woa.com/document/90292932030300160)


## 常见问题
- 如果您的接入和使用中遇到问题，请参见 [常见问题](https://write.woa.com/document/86735803187277824)。

- 了解更多详情，请到 [腾讯云通信官方社群](https://zhiliao.qq.com/) 进行咨询和反馈。

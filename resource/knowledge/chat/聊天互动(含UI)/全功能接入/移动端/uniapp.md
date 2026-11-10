---
sync_node_id: '134695107612704768'
nav_path:
  - "聊天互动（含 UI）"
  - "全功能接入"
  - "移动端"
  - "uniapp"
product: "chat"
---

## Prerequisites

### Preparing the Environment
- HBuilderX must upgrade to the latest version

- TypeScript / JavaScript (**TUIKit is developed in TypeScript and supports integration in both JavaScript and TypeScript projects**)

- Vue2 / Vue3

- sass (sass-loader version ≤ 10.1.1)

- Node.js v12 or higher

- npm (version must match node version

## Download and Import Component

Follow the steps below to send your inaugural message.

### Step 1: create a project (ignore this step if you already has project)

Launch HBuilderX, select "File-New-Project" in the menu bar, and create a uni-app project named `chat-example`.

### Step 2: Download the TUIKit component
- Since HBuilderX does not create package.json files by default, you need to proactively create one. Execute the following command in the root directory of the project:

   ``` bash
   npm init -y
   ```
- Download TUIKit and copy it to the source code:

   

【macOS】

Download the TUIKit component using the [npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue) method:
``` bash
npm i @tencentcloud/chat-uikit-uniapp unplugin-vue2-script-setup
```

For ease of subsequent extensions, we propose that you replicate the TUIKit component to the pages directory within your project. Please conduct the following command in the root directory of your own project:
``` bash
mkdir -p ./TUIKit && rsync -av --exclude={'node_modules','package.json','excluded-list.txt'} ./node_modules/@tencentcloud/chat-uikit-uniapp/ ./TUIKit
```

【Windows】

Download the TUIKit component using the [npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-vue) method:
``` bash
npm i @tencentcloud/chat-uikit-uniapp unplugin-vue2-script-setup
```

For ease of subsequent extensions, we propose that you replicate the TUIKit component to the pages directory within your project. Please conduct the following command in the root directory of your own project:
``` bash
xcopy .\node_modules\@tencentcloud\chat-uikit-uniapp .\TUIKit /i /e /exclude:.\node_modules\@tencentcloud\chat-uikit-uniapp\excluded-list.txt
```

### Step 3: Import the TUIKit Component

#### 1. Project Configuration

【Manifest.Json File】

Enable mini program subpackage `subPackages` and disable H5 `treeShaking` option in the source view of `manifest.json` file.
``` json
// weixin miniProgram
"mp-weixin" : {
    "appid" : "",
    "optimization" : {
        "subPackages" : true
    }
},
// H5: close treeshaking to solve the problem of uni[methond]() is not a function 
"h5" : {
    "optimization" : {
        "treeShaking" : {
            "enable" : false
        }
    }
},
```

> **Note:**
> Mini programs use sub-package integration by default. Do not configure the lazyCodeLoading option in `manifest.json` when packaging mini programs.
> 

【Vue.Config.Js (Can Be Ignored for Vue3 Projects)】

**Vue2 project** must create or modify vue.config.js in the root directory.
``` javascript
const ScriptSetup = require('unplugin-vue2-script-setup/webpack').default;

module.exports = {
  parallel: false,
  configureWebpack: {
    plugins: [
      ScriptSetup({
        /* options */
      }),
    ],
  },
  chainWebpack(config) {
    // disable type check and let `vue-tsc` handles it
    config.plugins.delete('fork-ts-checker');
  },
};
```

#### 2. Integrating TUIKit

Copy the following content to the corresponding file in the project.

【App Vue File】
``` javascript
<script lang="ts">
import { TUILogin } from '@tencentcloud/tui-core-lite';
import { TUIChatEngine } from '@tencentcloud/chat-uikit-engine-lite';

// #ifdef APP-PLUS || H5
import { TUIChatKit } from './TUIKit';
TUIChatKit.init();
// #endif

let vueVersion = 2;
// #ifdef VUE3
vueVersion = 3;
// #endif

// Required information
// You can get userSig from TencentCloud chat console for Testing TUIKit.
// Deploy production environment please get it from your server.
// View https://cloud.tencent.com/document/product/269/32688
uni.$SDKAppID = 0; // Your SDKAppID
uni.$userID = ''; // Your userID
uni.$userSig = ''; // Your userSig

export default {
  onLaunch: function () {
	TUILogin.login({
	  SDKAppID: uni.$SDKAppID,
	  userID: uni.$userID, 
	  userSig: uni.$userSig, 
	  framework: `vue${vueVersion}` // framework used vue2 / vue3
	})
    .then(() => {
      TUIChatEngine.isReady();
    })
    .catch(() => {});
  }
};
</script>
<style>
/* common css for page */
uni-page-body,html,body,page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
}
</style>
```

【Pages Json File】
``` json
{
  "pages": [
    {
      "path": "pages/index/index" // Your project homepage
    }
  ],
  "subPackages": [
    {
      "root": "TUIKit",
      "pages": [
        {
          "path": "components/TUIConversation/index",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM"
          }
        },
        {
          "path": "components/TUIChat/index",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM",
            "app-plus": {
              "softinputMode": "adjustResize",
              "titleNView": {
                "buttons": [
                  {
                    "type": "menu"
                  }
                ]
              }
            },
            "h5": {
              "titleNView": {
                "buttons": []
              }
            }
          }
        },
        // Integrate the chat component. This path must be configured: video playback
        {
          "path": "components/TUIChat/video-play",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM"
          }
        },
        {
          "path": "components/TUIChat/web-view",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM"
          }
        },
        {
          "path": "components/TUIContact/index",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM"
          }
        },
        {
          "path": "components/TUIGroup/index",
          "style": {
            "navigationBarTitleText": "Tencent Cloud IM"
          }
        },
        {
          "path": "components/TUISearch/index",
          "style": {
            "navigationBarTitleText": "Chat record"
          }
        }
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["TUIKit"]
    }
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  }
}
```

【Main.Js (Can Be Ignored for Vue3 Project)】

If you are a Vue2 project, please **introduce the Composition API in main.js** to prevent environment variables such as `isPC` from being unavailable.
``` javascript
// #ifndef VUE3
import VueCompositionAPI from '@vue/composition-api';
Vue.use(VueCompositionAPI);
// #endif
```

#### 3. Configuring the Portal for TUIConversation and TUIContact in the Main Package

Copy the following content to the pages/index/index.vue file.
``` javascript
<template>
  <div>
    <button @click="openConversationList">Open session list</button>
    <button @click="openContact">Open contact person</button>
  </div>
</template>
<script>
export default {
  methods: {
    Open session list
    openConversationList() {
      uni.navigateTo({ url: '/TUIKit/components/TUIConversation/index' });
    },
    Open contact person
    openContact() {
      uni.navigateTo({ url: '/TUIKit/components/TUIContact/index' });
    },
  },
};
</script>
```

### Step 4: Gain access to SDKAppID, secretKey, and userID

After obtaining the SDKAppID, userID, and userSig, fill them into the corresponding fields in `App.vue`.
``` typescript
uni.$SDKAppID = 0; // Your SDKAppID
uni.$userID = ''; // Your userID
uni.$userSig = ''; // Your userSig
```
- SDKAppID information can be obtained from the [Chat Console](https://console.trtc.io/):

   

- userID information. Click **Application name** of the target Application to enter the account management page and **create 2–3 userIDs for future reference to experience the chat feature**.

   

- userSig info, click [Chat Console > UserSig Tools](https://console.trtc.io/usersig), fill in the created userID to generate userSig.

   

## Running and Testing

### Step 1: Starting a Project
1. Using HBuilderX to start the project, click "Run > Run to Mini Program Simulator > WeChat Developer Tools".

   

2. If HBuilderX does not automatically start WeChat Developer Tools, please use WeChat Developer Tools to manually open the compiled project.

   Use WeChat Developer Tools to open the `unpackage/dist/dev/mp-weixin` in the project root directory.

3. After opening the project, in WeChat Developer Tools **Details** > **Local Settings**, check **Do not verify legal domain names, web-view (business domain), TLS version, and HTTPS certificate**.

### Step 2: Sending Your First Message

Click the **Open Session List** button, enter the userID created in [Step 4](#.E6.AD.A5.E9.AA.A43.EF.BC.9A.E8.8E.B7.E5.8F.96-sdkappid-.E3.80.81.E5.AF.86.E9.92.A5.E4.B8.8E-userid) in the search box, then click [**Done**] once selected to send your first message.

### Step 3: Preparation before Publishing & WeChat Mini Program Size Optimization

#### Delete Debug Script before Publishing

For both size and security reasons, please delete the `/TUIKit/debug` folder in the project directory before release. During development, for convenience, the project provides a script to generate UserSig locally, stored in the `TUIKit/debug` folder. However, this is not secure as the secretKey in this method can be easily decompiled and reverse engineered. Once your key is leaked, attackers can steal your Tencent Cloud traffic. **This method is only suitable for running the Demo locally and debugging features**. Therefore, please delete the debug script before project release and use the backend to generate UserSig. For specific reasons and operation steps, refer to the documentation: [Generate UserSig](https://trtc.io/zh/document/34385).

#### WeChat Mini Program Size Optimization

The official WeChat mini program has a size limit for the package upon release.
- The entire mini program's package size must not exceed 20M (30M for mobile games with virtual payment enabled).

- The size of each subpackage/main package must not exceed 2M

   Therefore, combining with business code may cause the mini program volume to exceed the limit, leading to failed release.

##### Option 1: Delete Local Debug Script

Delete the `/TUIKit/debug` folder under the project directory before release, use the backend to generate UserSig. For reason and operation steps, refer to the documentation: [generate UserSig](https://trtc.io/zh/document/34385).

##### Option 2: Using Subcontracting Strategy to Split Mini Program

Use the subcontracting strategy to split the program. . It should be noted that this document adopts the subcontracting strategy by default. During integration, subcontracting is already completed. The main package includes the chat SDK and TUICore, while subpackages contain chat-uikit-engine and all components of TUIKit. For specific subcontracting details.json file in procedure 3.

##### Solution Three: Pack Using HBuilderX Release Function before Mini Program Release

Before mini program release, use HBuilderX's release function to pack. Packing in release mode removes information such as Source Map from the code, resulting in the minimum package size. In HBuilderX's toolbar, click sequentially **Release** > **Mini Program - WeChat (applicable only to uni-app)**.

Then click **Release**, and the WeChat Mini Program Source Code will be generated in the `unpackage/dist/build/mp-weixin` folder of the project directory. Just open the folder using WeChat Developer Tools.

## More Advanced Features

### Audio-Visual Communication TUICallKit Plugin

> **Note:**
> **The TUICallKit audio/video component is not integrated by default in TUIKit,**TUICallKit primarily handles voice and video calls.
> 
> Should you need to integrate call functionalities, kindly refer to the following documents for guidelines.
> 
> - For packaging into APP, refer to: Audio/Video Calling (Client)
> - For packaging to Miniprogram, please refer to: Video Calls(Miniprogram)
> - For packaging into HTML5, please refer to the official documentation: Audio and Video Calls (HTML5)

Please stay tuned.

### TIMPush Offline Push Plugin

> **Indication**
> 
> **By default, TUIKit does not integrate the** TIMPush **offline push plugin**.TIMPush is Tencent Cloud's Instant Messaging Push Plugin. Currently, offline push supports Android and iOS platforms, and devices include: Huawei, Xiaomi, OPPO, Vivo, Meizu, and Apple phones.
> 
> Should you require the integration of offline push capabilities within your APP, kindly refer to the implementation of uni-app offline push.
> 

Please stay tuned.

### Individually integrate TUIChat component

Consider Independent Integration of TUIChat Component as a Solution

## FAQs

For additional inquiries, please .

## Reference Information

TUIKit (vue2/vue3) related
- [chat-uikit-uniapp GitHub source code](https://github.com/TencentCloud/chat-uikit-uniapp)

- [chat-uikit-uniapp npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-uniapp)

   ChatEngine related

- [ChatEngine API manual](https://web.sdk.qcloud.com/im/doc/chat-engine-lite/index.html)

- [ChatEngine Lite npm](https://www.npmjs.com/package/@tencentcloud/chat-uikit-engine-lite)

This guide walks you through quickly integrating the TUICallKit component using uni-app for packaging and running on the **WeChat Mini Program** platform. You can complete the following key steps in about 10 minutes and get a fully functional audio/video calling interface.

## Prerequisites

### Development Environment Requirements
- Before development, please read [WeChat Mini Program Development Overview](https://developers.weixin.qq.com/miniprogram/dev/framework/).
- Supported since **TUICallKit v4.2.6+**.
- WeChat App iOS minimum version: 7.0.9.
- WeChat App Android minimum version: 7.0.8.
- Mini Program base library minimum version: 2.10.0.

  > **Warning:**
  >
  > - Since mini program test accounts do not have access to `<live-pusher>` and `<live-player>`, please use an **enterprise mini program account** to apply for the required permissions for development.
  > - Since WeChat DevTools does not support native components (`<live-pusher>` and `<live-player>` tags), you need to run and test on a **real device**.
  > - **WeChat Work mini programs are not supported**.

### Activate the Service
Before using Tencent Cloud audio/video services, you need to go to the console to activate the service for your application. For detailed steps, see [Activate Service](https://cloud.tencent.com/document/product/1640/81130). After activation, note down the `SDKAppID` and `SDKSecretKey` — you will need them in the subsequent login step.

## Mini Program Development Setup

### Step 1: Register an Enterprise Mini Program

### Step 2: Enable Real-Time Audio/Video APIs in the Mini Program Console
- The live push/pull stream tag usage permission is currently only available for limited categories. [See supported categories here](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html#%E7%94%B3%E8%AF%B7%E5%BC%80%E9%80%9A).
- Mini programs that meet the category requirements need to self-enable this component permission in [WeChat Official Accounts Platform](https://mp.weixin.qq.com/) > **Development** > **Development Management** > **API Settings**.
- Log in to the mini program console to update the privacy policy, checking **Microphone** and **Camera**.

### Step 3: Configure Domains in the Mini Program Console

In [WeChat Official Accounts Platform](https://mp.weixin.qq.com/) > **Development** > **Development Management** > **Development Settings** > **Server Domains**, configure **request valid domains** and **socket valid domains**.

- Add the following domains to **socket valid domains**:

| Domain | Description | Required |
| --- | --- | --- |
| `wss://${SDKAppID}w4c.my-imcloud.com` | Since v3.4.6, the SDK supports dedicated domains for better service stability.<br>For example, if your SDKAppID is 1400xxxxxx, the dedicated domain is: `wss://1400xxxxxxw4c.my-imcloud.com` | Required |
| `wss://wss.im.qcloud.com` | Web IM service domain | Required |
| `wss://wss.tim.qq.com` | Web IM service domain | Required |
| `wss://wssv6.im.qcloud.com` | Web IM service domain | Required |

- Add the following domains to **request valid domains**:

| Domain | Description | Required |
|---------|---------|---------|
|`https://web.sdk.qcloud.com`|Web IM service domain|Required|
|`https://boce-cdn.my-imcloud.com`|Web IM service domain|Required|
|`https://api.im.qcloud.com`|Web IM service domain|Required|
|`https://events.im.qcloud.com`|Web IM service domain|Required|
|`https://webim.tim.qq.com`|Web IM service domain|Required|
|`https://wss.im.qcloud.com`|Web IM service domain|Required|
|`https://wss.tim.qq.com`|Web IM service domain|Required|

- Add the following domains to **uploadFile valid domains**:

| Domain | Description | Required |
| --- | --- | --- |
| `https://${SDKAppID}-cn.rich.my-imcloud.com` | **Since September 10, 2024, new applications are assigned dedicated COS domains by default.**<br>For example, if your SDKAppID is 1400xxxxxx, the COS dedicated domain is: `https://1400xxxxxx-cn.rich.my-imcloud.com` | Required |
| `https://cn.rich.my-imcloud.com` | File upload domain | Required |
| `https://cn.imrich.qcloud.com` | File upload domain | Required |
| `https://cos.ap-shanghai.myqcloud.com` | File upload domain | Required |
| `https://cos.ap-shanghai.tencentcos.cn` | File upload domain | Required |
| `https://cos.ap-guangzhou.myqcloud.com` | File upload domain | Required |

- Add the following domains to **downloadFile valid domains**:

| Domain | Description | Required |
| --- | --- | --- |
| `https://${SDKAppID}-cn.rich.my-imcloud.com` | **Since September 10, 2024, new applications are assigned dedicated COS domains by default.**<br>For example, if your SDKAppID is 1400xxxxxx, the COS dedicated domain is: `https://1400xxxxxx-cn.rich.my-imcloud.com` | Required |
| `https://cn.rich.my-imcloud.com` | File download domain | Required |
| `https://cn.imrich.qcloud.com` | File download domain | Required |
| `https://cos.ap-shanghai.myqcloud.com` | File download domain | Required |
| `https://cos.ap-shanghai.tencentcos.cn` | File download domain | Required |
| `https://cos.ap-guangzhou.myqcloud.com` | File download domain | Required |

## TUICallKit Source Code Integration

### Step 1: Create a uni-app Project

In HBuilderX, create a uni-app project. Select the default template.

### Step 2: Download and Import the TUICallKit Component
1. Download the `TUICallKit` component.

   ``` bash
   npm i @trtc/calls-uikit-wx
   ```

[macOS]
``` bash
mkdir -p ./TUICallKit && cp -r node_modules/@trtc/calls-uikit-wx/ ./TUICallKit
```

[Windows]
``` bash
xcopy node_modules\@trtc\calls-uikit-wx\ .\TUICallKit /i /e
```

2. Copy the `TUICallKit` folder to the root directory of your uni-app project.

### Step 3: Fill in SDKAPPID and SECRETKEY

Modify the `SDKAPPID` and `SECRETKEY` in the `TUICallKit/debug/GenerateTestUserSig-es.js` file.

### Step 4: Use the TUICallKit Component
1. Modify the `pages.json` file. Add the following code to register the global call monitoring page.

   ``` json
   {
     "pages": [
       {
         "path": "pages/index/index",
         "style": {
           "navigationStyle": "custom"
         }
       },
       {
         "path": "TUICallKit/pages/globalCall/globalCall",
         "style": {
           "navigationStyle": "custom"
         }
       }
     ],
     "globalStyle": {
       "navigationBarTextStyle": "black",
       "navigationBarTitleText": "TUICallKit",
       "navigationBarBackgroundColor": "#F8F8F8",
       "backgroundColor": "#F8F8F8"
     }
   }
   ```
2. Create a `wxcomponents` folder in the project root directory.

3. Copy the `TUICallKit/component` folder to `wxcomponents/TUICallKit`.

4. Modify `pages/index/index.vue`.

   ``` html
   <template>
     <view class="container">
       <input
         type="text"
         maxlength="20"
         :placeholder="isLogin ? 'Enter callee userID' : 'Enter login userID'"
         :value="userID"
         @input="bindInputUserID"
       />
       <button @tap="isLogin ? call() : login()">
         {{ isLogin ? 'Call' : 'Login' }}
       </button>
     </view>
   </template>

   <script>
   import { TUICallKitAPI } from '../../TUICallKit/TUICallService/index';
   import { CallManager } from '../../TUICallKit/TUICallService/serve/callManager';
   import * as GenerateTestUserSig from '../../TUICallKit/debug/GenerateTestUserSig-es.js';
   wx.CallManager = new CallManager();

   export default {
     data() {
       return {
         userID: '',
         isLogin: false,
       };
     },
     methods: {
       bindInputUserID(e) {
         this.userID = e.detail.value;
       },
       async login() {
         const userID = this.userID;
         if (!userID) return;
         const { userSig, SDKAppID } = GenerateTestUserSig.genTestUserSig({
           userID: userID,
         });
         await wx.CallManager.init({
           sdkAppID: SDKAppID,
           userID: userID,
           userSig: userSig,
           globalCallPagePath: 'TUICallKit/pages/globalCall/globalCall',
         });
         uni.showToast({ title: 'Login successful' });
         this.isLogin = true;
         this.userID = '';
       },
       async call() {
         await TUICallKitAPI.calls({
           userIDList: [this.userID],
           type: 2,
         });
       },
     },
   };
   </script>
   ```
5. You must use **Vue 2** for compilation. Currently, **Vue 3** is not supported.

### Step 5: Build and Run
1. In HBuilderX, click **Run > Run to Mini Program Simulator > WeChat DevTools**. This will automatically open WeChat DevTools.

2. In WeChat DevTools local settings, check "Do not verify valid domains, web-view (business domains), TLS version, and HTTPS certificates".

3. Click **Clear Cache > Clear All** to avoid rendering issues caused by DevTools cache.

4. Build the mini program.

5. Expected result after quick integration.

### Step 6: Make Your First Call
- Click Preview, scan the QR code, and use the mini program on a real device.

   > **Note:**
   >
   > The first time you use the mini program for calls, you need to grant camera and microphone permissions.
   >

## FAQ

### What should I do if the uni-app project imports successfully but pages are blank?
1. Due to WeChat DevTools caching, click **Clear Cache > Clear All** and rebuild.
2. Check if `wxcomponents/TUICallKit` is correctly placed and contains the component files.
3. Verify `pages.json` includes the `globalCall` page registration.

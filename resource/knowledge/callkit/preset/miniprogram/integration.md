
## Mini Program Demo Experience
- To try the audio/video calling mini program directly, [click Demo Experience](https://cloud.tencent.com/document/product/647/17021) and scan the mini program QR code.

- To run a new project from scratch, go directly to [WeChat Mini Program Demo Quick Start](https://github.com/tencentyun/TUICallKit/tree/main/MiniProgram).

## Development Environment Requirements
- WeChat App iOS minimum version: 7.0.9.

- WeChat App Android minimum version: 7.0.8.

- Mini Program base library minimum version: 2.10.0.

   > **Warning:**
   >
   > - Since mini program test accounts do not have access to `<live-pusher>` and `<live-player>`, please use an **enterprise mini program account** to apply for the required permissions for development.
   > - Since WeChat DevTools does not support native components (`<live-pusher>` and `<live-player>` tags), you need to run and test on a **real device**.
   > - **WeChat Work mini programs are not supported**.

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

### Step 1: Activate the Service

Before using Tencent Cloud audio/video services, you need to go to the console to activate the service for your application.

### Step 2: Create a Mini Program Project
1. In WeChat DevTools, create a mini program project and select **Do not use template**.

   ``` json
   {
     "pages": [
       "pages/index/index"
     ],
     "window": {
       "navigationBarTextStyle": "black",
       "navigationStyle": "custom"
     },
     "style": "v2",
     "renderer": "webview"
   }
   ```

3. Open a new terminal.

4. Run `npm init -y` to generate the `package.json` file.

   ``` javascript
   npm init -y
   ```

### Step 3: Download and Import the TUICallKit Component
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

2. After running the above commands, a `TUICallKit` folder is generated in your directory containing the TUICallKit component.

3. **Build npm.** Open **WeChat DevTools** and click **Tools > Build npm** to create the miniprogram_npm directory.

### Step 4: Fill in SDKAPPID and SECRETKEY

Modify the `SDKAPPID` and `SECRETKEY` in the `TUICallKit/debug/GenerateTestUserSig-es.js` file.

### Step 5: Use the TUICallKit Component
1. Modify the `app.json` file. Add the following code to register the global call monitoring page.

   ``` json
   {
     "pages": [
       "pages/index/index",
       "TUICallKit/pages/globalCall/globalCall"
     ],
     "window": {
       "navigationBarTextStyle": "black",
       "navigationStyle": "custom"
     },
     "style": "v2"
   }
   ```
2. Modify the files in the `pages/index` folder.

[index.wxml]
``` javascript
<view class="container">
  <view class="box">
    <view class="input-box">
      <input type="text" maxlength="20" placeholder="{{isLogin?'Enter callee userID':'Enter login userID' }}" value="{{userID}}" bindinput='bindInputUserID' placeholder-style="color:#BBBBBB;" />
    </view>
    <view class='login'>
      <button class='loginBtn' bindtap="{{isLogin?'call':'login'}}">{{isLogin?'Call':'Login'}}</button>
    </view>
  </view>
</view>
```

[index.js]
``` javascript
// Import TUICallKitAPI module to enable global call capability
import { TUICallKitAPI } from "../../TUICallKit/TUICallService/index";
// Import CallManager module to enable global incoming call monitoring
import { CallManager } from "../../TUICallKit/TUICallService/serve/callManager";
import * as GenerateTestUserSig from "../../TUICallKit/debug/GenerateTestUserSig-es.js";
wx.CallManager = new CallManager();
Page({
  data: {
    userID: "",
    isLogin: false,
  },

  bindInputUserID(e) {
    this.setData({
      userID: e.detail.value,
    });
  },

  async login() {
    const userID = this.data.userID;
    if (!userID) return;
    const { userSig, SDKAppID } = GenerateTestUserSig.genTestUserSig({
      userID: userID,
    });
    await wx.CallManager.init({
      sdkAppID: SDKAppID,
      userID: userID,
      userSig: userSig,
      globalCallPagePath: "TUICallKit/pages/globalCall/globalCall",
    });
    wx.showToast({
      title: "Login successful",
      icon: "error",
    });
    this.setData({
      isLogin: true,
      userID: "",
    });
  },

  async call() {
    await TUICallKitAPI.calls({
      userIDList: [this.data.userID],
      type: 2,
    });
  },
});
```

[index.wxss]
``` css
.container {
  width: 100vw;
  height: 100vh;
}

.box{
  flex: 1;
  width: 100vw;
  margin-top: -40px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

input{
  display: flex;
  font-size: 20px;
  width: 60vw;
}

.login {
  display: flex;
  width: 100vw;
  text-align: center;
  bottom: 5vh;
  margin: 70rpx;
}
.login button{
  width: 80%;
  background-color: #006eff;
  border-radius: 50px;
  color: white;
}
```

### Step 6: Build and Run
1. In local settings, check "Do not verify valid domains, web-view (business domains), TLS version, and HTTPS certificates".

   > **Warning:**
   >
   > **If this option is not checked, the following error will appear in the console.**
   >
   >
   >

2. Click **Clear Cache > Clear All** to avoid rendering issues caused by DevTools cache.

3. Build the mini program.

4. Expected result after quick integration.

### Step 7: Make Your First Call
- Click Preview, scan the QR code, and use the mini program on a real device.

   > **Note:**
   >
   > The first time you use the mini program for calls, you need to grant camera and microphone permissions.
   >

## More Features

### Enable Floating Window

> **Note:**
> Supported since v4.2.10+. Due to [live-player](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html#%E5%B0%8F%E7%AA%97%E7%89%B9%E6%80%A7%E8%AF%B4%E6%98%8E) limitations, this feature is only supported in video call scenarios.
>

You can call `enableFloatWindow` to enable/disable the floating window feature. Enable this feature when initializing the `TUICallKit` component. Default state is disabled (`false`). You can click the floating window button in the top-left corner of the call interface to minimize the call UI into a floating window.

Call `enableFloatWindow(enable: boolean)` API to enable/disable floating window.
``` javascript
TUICallKitAPI.enableFloatWindow(true)
```

## Introduction

Quick Demo show the basic audio and video communication capabilities with sample code:
- Set user to login TRTC platform service

- Turn on/off your camera and microphone, and send them to others

- Share your screen with others

## How to use

### 1. Create an Application

Users within an application are allowed to enter the same room for audio and video calls. `SDKAppID` and `SDKSecretKey` are the unique verification credentials for the application.
<div style="height:-10px"></div>

You can create it in the [Console](https://console.trtc.io/app), and get it's `SDKAppID` and `SDKSecretKey`. We will use those to login quick demo.

### 2. Online Demo

You can fill in the `SDKAppID` and `SDKSecretKey` obtained from the first part into the following demo, and click "Enter Room" button.

After success, an invitation link will be generated, so you can invite another person to join the call together!
<iframe src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/quick-start/index.html?lang=en" height="900" width="100%" allow="microphone;camera;display-capture;" allowfullscreen="true" frameborder="no">
  <p>您的浏览器不支持  iframe 标签。</p>
</iframe>

## More Demo

The above Demo is written in native JavaScript. You can access its [source code here](https://github.com/Tencent-RTC/TRTC_Web/tree/main/samples/basic-features/quick-start), you can also click on [this link](https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/quick-start/index.html) to access it in a separate window.
<div> </div>

We also provide demos for React, Vue2, Vue3. Here's the links:
- [React Online Demo](https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-react/index.html#/) and [React Github](https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-react)

- [Vue2 Online Demo](https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-vue2-js/index.html#/) and [Vue2 Github](https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-vue2-js)

- [Vue3 Online Demo](https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-vue3-ts/index.html#/) and [Vue3 Github](https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-vue3-ts)

<div></div>

<div></div>

   If you want to integrate it yourself, you can visit [the integration guide documentation.](https://trtc.io/document/59649)

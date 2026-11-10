---
sync_node_id: '163673134112337920'
nav_path:
  - "直播与语聊 SDK"
  - "准备工作"
  - "准备工作（Web Vue3 桌面浏览器）"
product: "live"
---
## Feature Overview

**TUILiveKit** is a comprehensive live streaming component. Once integrated, it allows you to quickly implement the following functional modules:

## Preparations

### Service Activation

Before using TUILiveKit, you need to [Activate Services](https://trtc.io/document/60033) in the Tencent Cloud console and receive a trial version or activate a paid version.

### Environmental requirements
- **Vue 3 + Composition API:** Leverage the latest Vue 3 features to build high-performance, maintainable applications.

- **TypeScript:** Improve code quality and development efficiency through static type checking.

- **SCSS Module:** Implement modular style management to effectively avoid style conflicts.

### System Requirements
- **Node.js:** ≥ 18.19.1 (Official LTS version recommended)

- **Vue**: ≥ 3.4.21

- Modern browsers: Modern browsers that support [WebRTC APIs](https://caniuse.com/).

### Code Integration

#### Step 1: Install Dependencies

You can install dependencies using any of the following methods:

【npm】
``` bash
npm install tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue3 --save
```

【pnpm】
``` bash
pnpm install tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue3
```

【yarn】
``` bash
yarn install tuikit-atomicx-vue3 @tencentcloud/uikit-base-component-vue3
```

#### Step 2: Complete login
``` javascript
import { useLoginState } from 'tuikit-atomicx-vue3';

const { login } = useLoginState();

async function initLogin() {
  try {
    await login({
      sdkAppId: 0,        // SDKAppId, refer to step 1 to obtain
      userId: '',         // UserID, refer to step 1 to obtain
      userSig: '',        // userSig, refer to step 1 to obtain
    });
  } catch (error) {
    console.error('Login Error:', error);
  }
}

```

> **Note：**
> Security Reminder: For security reasons, it is strongly recommended to implement the `userSig` calculation logic on your server-side to avoid exposing the `SecretKey` in your front-end code. You can use the console's helper tools to generate a temporary `userSig` for debugging purposes.
> 
> Login API Parameter Description:
> 

| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Int | Get this from <a href="https://console.trtc.io/app">TRTC console > Application management</a>. |
| UserID | String | Unique identifier for the current user. It can only contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_). |
| userSig | String | A ticket for TRTC authentication:<br>- <strong>Development Environment</strong>: Use <code>GenerateTestUserSig.genTestSig</code> locally or the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a> to generate temporary credentials.<br>- <strong>Production</strong>: Generate UserSig server-side to prevent key exposure. See Server-Side UserSig Generation. |

#### Step 3: Functional Experience

Congratulations! You've successfully integrated the live video component and logged in. Next, you can start broadcasting, have viewers watch, or implement other live streaming features. .
| <strong>Function</strong> | <strong>Description</strong> | <strong>Experience Link</strong> |
| --- | --- | --- |
| <strong>Host Streaming</strong> | The live streamer's entire live streaming process is supported, including pre-streaming preparation and post-streaming interactions. | Host Streaming |
| <strong>Audience Viewing</strong> | Viewers can enter the live streamer's room to watch the live stream, connect to the microphone, view live stream room information, view online viewers, and display comments. | Audience Viewing |
| <strong>Live Streaming Kit</strong> | A comprehensive set of out-of-the-box live streaming interfaces and features are provided, including video source control, microphone connection, audience interaction, live streaming in both landscape and portrait modes, and viewer management. | <a href="https://www.tencentcloud.com/document/product/647/62521">Live Streaming Kit</a> |
| <strong>Live Streaming List</strong> | The live stream list interface and features include a live stream list and room information display. | Live Streaming List |

### FAQ

If you need to deploy the project's packaged dist file, you must use an HTTPS domain name in the production environment.

> **Note:**
> **Protocol Requirements for Production:**
> 
> Due to browser security policy restrictions, using WebRTC capabilities has strict requirements for page access protocols. Please refer to the following table for application development and deployment.
> 

| <strong>Environment</strong> | <strong>Protocol</strong> | <strong>Receive Stream</strong> | <strong>Send Stream</strong> | <strong>Screen Sharing</strong> | <strong>Notes</strong> |
| --- | --- | --- | --- | --- | --- |
| <strong>Production</strong> | HTTPS | ✓ | ✓ | ✓ | Recommended |
| <strong>Production</strong> | HTTP | ✓ | ✗ | ✗ | - |
| <strong>Local Development</strong> | http://localhost | ✓ | ✓ | ✓ | Recommended |
| <strong>Local Development</strong> | http://127.0.0.1 | ✓ | ✓ | ✓ | - |
| <strong>Local Development</strong> | http://[Local IP] | ✓ | ✗ | ✗ | - |
| <strong>Local Development</strong> | file:// | ✓ | ✓ | ✓ | - |

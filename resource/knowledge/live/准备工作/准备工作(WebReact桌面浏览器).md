---
sync_node_id: '203541832434987008'
nav_path:
  - "直播与语聊 SDK"
  - "准备工作"
  - "准备工作（Web React 桌面浏览器）"
product: "live"
---
## Feature Preview

TUILiveKit React is a feature-rich web live streaming component that provides comprehensive live streaming capabilities out of the box:

## **Preparation**

### Activate the Service

Before using TUILiveKit, you'll need to activate the service first. See [Activate Services](https://trtc.io/document/60033) to get a trial version or activate the paid version.

### Environment Requirements
- **Devices**: Camera, microphone, and speakers

### Configuration Requirements
- **Node.js**: ≥ 18.19.1 (Official LTS version recommended, check your current version with `node -v` command)

- **react**: ≥ 18.2.0 and < 19.0.0

- **vite**: ≥ 5.4.0

- **typescript**: ≥ 5.8.3

- **sass**: ≥ 1.77.0

## Code Integration

### **Step 1: Install Dependencies**

Choose your preferred package manager:

【npm】
``` bash
npm install tuikit-atomicx-react @tencentcloud/uikit-base-component-react --save
```

【pnpm】
``` bash
pnpm install tuikit-atomicx-react @tencentcloud/uikit-base-component-react
```

【yarn】
``` bash
yarn install tuikit-atomicx-react @tencentcloud/uikit-base-component-react
```

### Step 2: Complete Login

Completing login is the foundation for using **TUILiveKit**. TUILiveKit features can only be used normally after successful login. Make sure all parameters are configured correctly before proceeding.

> **Note:**
> While the sample code shows direct login calls, **we strongly recommend calling TUILiveKit's login service only after completing your own user authentication flow**. This prevents business logic conflicts or data inconsistency issues and integrates better with your existing user management and permission systems.
> 

``` javascript
// Best practice: Call this login logic immediately after your authentication flow completes
import { useLoginState } from 'tuikit-atomicx-react';

const { login, logout } = useLoginState();

async function initLogin() {
  try {
    await login({
      SDKAppID: 0,        // SDKAppID - SDKAppID obtained when activating service
      userID: '',         // UserID   - User ID
      userSig: '',        // userSig  - User signature, see parameter description below for detailed instructions
    });
  } catch (error) {
    console.error('Login failed:', error);
  }
}

```

**Login API Parameter Description**
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Int | Get this from <a href="https://console.trtc.io/app">TRTC console > Application management</a>. |
| UserID | String | Unique identifier for the current user. It can only contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_). |
| userSig | String | A ticket for TRTC authentication:<br>- <strong>Development Environment</strong>: Use <code>GenerateTestUserSig.genTestSig</code> locally or the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a> to generate temporary credentials.<br>- <strong>Production</strong>: Generate UserSig server-side to prevent key exposure. See Server-Side UserSig Generation. |

## Next Steps

After completing authentication, you can integrate TUILiveKit's live streaming features. Follow the guides below to implement audience viewing, live lists, and more:
| <strong>Feature</strong> | <strong>Description</strong> | <strong>Integration Guide</strong> |
| --- | --- | --- |
| <strong>Audience Viewing</strong> | Allow viewers to watch live streams, request co-hosting, view room information, see online audience, and interact via chat. | Audience Viewing (React) |
| <strong>Live Room List</strong> | Display available live rooms with room information and status. | Live List (React) |
| <strong>Host Streaming</strong> | Enable hosts to start broadcasts with pre-stream setup and in-stream interactions | Host Streaming (Vue3)(React support coming soon) |

## FAQ

### Do I need to call login every time I enter a room?

No. You typically only need to call `login()` once. We strongly recommend integrating the `login()` and `logout()` functions returned by `useLoginState()` with your application's authentication system.

### Why is HTTPS required for production deployments?

When deploying your application to production, you must use an **HTTPS domain**. TUILiveKit relies on WebRTC technology and requires access to users' cameras, microphones, and speakers. Browsers enforce HTTPS to protect user privacy and security when accessing these sensitive devices.

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

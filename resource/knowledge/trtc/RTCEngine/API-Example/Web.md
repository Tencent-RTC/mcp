---
sync_node_id: '89644533787443200'
nav_path:
  - "RTC Engine"
  - "API-Example"
  - "Web"
product: "trtc"
---
## Introduction

Quick Demo show the basic audio and video communication capabilities with sample code:
- Set user to login TRTC platform service.

- Turn on/off your camera and microphone, and send them to others.

- Share your screen with others.

## How to use

### 1. Create an Application

Users within an application are allowed to enter the same room for audio and video calls. `SDKAppID` and `SDKSecretKey` are the unique verification credentials for the application. 
<div style="height:-10px"></div>

You can create it in the [Console](https://console.trtc.io/app), and get its `SDKAppID` and `SDKSecretKey`. We will use those to login quick demo.

### 2. Online Demo

You can fill in the `SDKAppID` and `SDKSecretKey` obtained from the first part into the following demo, and click "Enter Room" button. 

After success, an invitation link will be generated, so you can invite another person to join the call together! 
<iframe src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-js/index.html?lang=en" height="900" width="100%" allow="microphone;camera;display-capture;" allowfullscreen="true" frameborder="no">
</iframe>

## More Demo

<style>
  .tdcB-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(max(300px,46%),1fr));grid-auto-rows:1fr;gap:18px;margin:18px 0}
  .tdcB-grid a{text-decoration:none}
  .tdcB{display:flex;flex-direction:column;height:100%;box-sizing:border-box;border:1px solid #e8ecf3;border-radius:16px;background:#fff;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease}
  .tdcB:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(16,24,40,.14)}
  .tdcB-btn:hover{background:#0057cc}
  .tdcB-ghost:hover{border-color:#006eff;color:#006eff}
  @media (max-width: 640px){.tdcB-grid{grid-template-columns:1fr}}
</style>

<div class="tdcB-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(max(300px,46%),1fr));grid-auto-rows:1fr;gap:18px;margin:18px 0">

  <div class="tdcB" style="display:flex;flex-direction:column;height:100%;box-sizing:border-box;border:1px solid #e8ecf3;border-radius:16px;background:#ffffff;overflow:hidden">
    <div style="position:relative;height:84px;padding:0 22px;background:linear-gradient(135deg,#e0eeff 0%,#94c2ff 100%);display:flex;align-items:center;overflow:hidden">
      <div style="flex:0 0 auto;width:44px;height:44px;border-radius:12px;background:#ffffff;border:1px solid #9ec8ff;color:#006eff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;letter-spacing:.3px;box-shadow:0 4px 10px rgba(0,110,255,0.12)">API</div>
      <div style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:42px;font-weight:700;color:#006eff;opacity:.14;letter-spacing:-1px;font-family:SFMono-Regular,Consolas,Menlo,monospace;line-height:1;white-space:nowrap">API</div>
    </div>
    <div style="display:flex;flex-direction:column;flex:1;padding:18px 22px 20px">
      <div style="font-family:SFMono-Regular,Consolas,Menlo,monospace;font-size:15px;font-weight:600;color:#1a1f36;line-height:1.3;word-break:break-word">API-samples</div>
      <div style="margin-top:3px;font-size:12px;color:#8a94a6">Vanilla JavaScript</div>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#5a6474">Sample code for the SDK APIs, grouped by feature.</p>
      <div style="margin-top:auto;padding-top:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <a class="tdcB-btn" href="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/basic-features/quick-start/index.html?lang=en" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;background:#006eff;color:#ffffff;font-size:13px;font-weight:500;line-height:1.2;text-decoration:none">Online Demo</a>
        <a class="tdcB-ghost" href="https://github.com/Tencent-RTC/TRTC_Web/tree/main/samples/basic-features/quick-start" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;border:1px solid #d5dbe6;background:#ffffff;color:#3c4658;font-size:13px;line-height:1.2;text-decoration:none">Source Code</a>
      </div>
    </div>
  </div>

  <div class="tdcB" style="display:flex;flex-direction:column;height:100%;box-sizing:border-box;border:1px solid #e8ecf3;border-radius:16px;background:#ffffff;overflow:hidden">
    <div style="position:relative;height:84px;padding:0 22px;background:linear-gradient(135deg,#fef8e3 0%,#fbe79e 100%);display:flex;align-items:center;overflow:hidden">
      <div style="flex:0 0 auto;width:44px;height:44px;border-radius:12px;background:#ffffff;border:1px solid #fbe9a7;color:#f5c518;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;letter-spacing:.3px;box-shadow:0 4px 10px rgba(245,197,24,0.12)">JS</div>
      <div style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:42px;font-weight:700;color:#f5c518;opacity:.14;letter-spacing:-1px;font-family:SFMono-Regular,Consolas,Menlo,monospace;line-height:1;white-space:nowrap">JS</div>
    </div>
    <div style="display:flex;flex-direction:column;flex:1;padding:18px 22px 20px">
      <div style="font-family:SFMono-Regular,Consolas,Menlo,monospace;font-size:15px;font-weight:600;color:#1a1f36;line-height:1.3;word-break:break-word">quick-demo-js</div>
      <div style="margin-top:3px;font-size:12px;color:#8a94a6">Vanilla JavaScript</div>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#5a6474">Basic audio/video calls and device selection. No build step, just open <span style="white-space:nowrap">index.html</span> in a browser.</p>
      <div style="margin-top:auto;padding-top:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <a class="tdcB-btn" href="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-js/index.html?lang=en" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;background:#006eff;color:#ffffff;font-size:13px;font-weight:500;line-height:1.2;text-decoration:none">Online Demo</a>
        <a class="tdcB-ghost" href="https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-js" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;border:1px solid #d5dbe6;background:#ffffff;color:#3c4658;font-size:13px;line-height:1.2;text-decoration:none">Source Code</a>
      </div>
    </div>
  </div>

  <div class="tdcB" style="display:flex;flex-direction:column;height:100%;box-sizing:border-box;border:1px solid #e8ecf3;border-radius:16px;background:#ffffff;overflow:hidden">
    <div style="position:relative;height:84px;padding:0 22px;background:linear-gradient(135deg,#e5f3ee 0%,#a6d6c4 100%);display:flex;align-items:center;overflow:hidden">
      <div style="flex:0 0 auto;width:44px;height:44px;border-radius:12px;background:#ffffff;border:1px solid #aedac9;color:#2a9d72;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;letter-spacing:.3px;box-shadow:0 4px 10px rgba(42,157,114,0.12)">Vue</div>
      <div style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:42px;font-weight:700;color:#2a9d72;opacity:.14;letter-spacing:-1px;font-family:SFMono-Regular,Consolas,Menlo,monospace;line-height:1;white-space:nowrap">Vue</div>
    </div>
    <div style="display:flex;flex-direction:column;flex:1;padding:18px 22px 20px">
      <div style="font-family:SFMono-Regular,Consolas,Menlo,monospace;font-size:15px;font-weight:600;color:#1a1f36;line-height:1.3;word-break:break-word">quick-demo-vue3-ts</div>
      <div style="margin-top:3px;font-size:12px;color:#8a94a6">Vue 3 + TypeScript</div>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#5a6474">Vue 3 + TypeScript implementation with basic audio/video calls and screen sharing.</p>
      <div style="margin-top:auto;padding-top:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <a class="tdcB-btn" href="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-vue3-ts/index.html?lang=en" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;background:#006eff;color:#ffffff;font-size:13px;font-weight:500;line-height:1.2;text-decoration:none">Online Demo</a>
        <a class="tdcB-ghost" href="https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-vue3-ts" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;border:1px solid #d5dbe6;background:#ffffff;color:#3c4658;font-size:13px;line-height:1.2;text-decoration:none">Source Code</a>
      </div>
    </div>
  </div>

  <div class="tdcB" style="display:flex;flex-direction:column;height:100%;box-sizing:border-box;border:1px solid #e8ecf3;border-radius:16px;background:#ffffff;overflow:hidden">
    <div style="position:relative;height:84px;padding:0 22px;background:linear-gradient(135deg,#e2f0f4 0%,#99c9d8 100%);display:flex;align-items:center;overflow:hidden">
      <div style="flex:0 0 auto;width:44px;height:44px;border-radius:12px;background:#ffffff;border:1px solid #a2cedc;color:#0b7fa2;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;letter-spacing:.3px;box-shadow:0 4px 10px rgba(11,127,162,0.12)">React</div>
      <div style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:42px;font-weight:700;color:#0b7fa2;opacity:.14;letter-spacing:-1px;font-family:SFMono-Regular,Consolas,Menlo,monospace;line-height:1;white-space:nowrap">React</div>
    </div>
    <div style="display:flex;flex-direction:column;flex:1;padding:18px 22px 20px">
      <div style="font-family:SFMono-Regular,Consolas,Menlo,monospace;font-size:15px;font-weight:600;color:#1a1f36;line-height:1.3;word-break:break-word">quick-demo-react</div>
      <div style="margin-top:3px;font-size:12px;color:#8a94a6">React + TypeScript</div>
      <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#5a6474">React + TypeScript implementation with basic audio/video calls and screen sharing.</p>
      <div style="margin-top:auto;padding-top:20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <a class="tdcB-btn" href="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/quick-demo-react/index.html?lang=en" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;background:#006eff;color:#ffffff;font-size:13px;font-weight:500;line-height:1.2;text-decoration:none">Online Demo</a>
        <a class="tdcB-ghost" href="https://github.com/Tencent-RTC/TRTC_Web/tree/main/quick-demo-react" target="_blank" style="display:inline-flex;align-items:center;padding:8px 16px;border-radius:8px;border:1px solid #d5dbe6;background:#ffffff;color:#3c4658;font-size:13px;line-height:1.2;text-decoration:none">Source Code</a>
      </div>
    </div>
  </div>

</div>

<div></div>

If you want to integrate it yourself, you can visit [the integration guide documentation.](https://trtc.io/document/59649)

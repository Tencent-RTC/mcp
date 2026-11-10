---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-05-info-browser.md'
nav_path:
  - "Tutorials"
  - "Product Updates"
product: "trtc"
---
This article introduces the browser support status of the Web SDK, as well as suggestions for handling access protocol restrictions and firewall restrictions.

## Browser Compatibility Table
The compatibility table below is for reference only. The actual result is subject to the detection result of [TRTC.isSupported](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/zh-cn/TRTC.html#.isSupported). You can also use the [TRTC Detection Page](https://web.sdk.qcloud.com/trtc/webrtc/demo/detect/index.html) to quickly verify browser compatibility.

### PC

| Operating System | Browser | Minimum Browser Version | Pull Stream | Push Stream | Screen Sharing | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Windows | Chrome | 56+ | ✅ | ✅ | Chrome 72+ |  |
| Windows | Edge | 80+ | ✅ | ✅ | Edge 80+ |  |
| Windows | Firefox | 56+ | ✅ | ✅ | Firefox 66+ | |
| Windows | Other | Chromium 56+ | ✅ | ✅ | Chromium 72+ | Other browsers such as QQ Browser, Opera, are mostly developed based on the Chromium, so focusing on the Chromium version is sufficient. |
| Mac | Safari | 11+ | ✅ | ✅ | Safari 13+ | |
| Mac | Chrome | 56+ | ✅ | ✅ | Chrome 72+ |  |
| Mac | Edge | 80+ | ✅ | ✅ | Edge 80+ |  |
| Mac | Firefox | 56+ | ✅ | ✅ | Firefox 66+ | |
| ChromeOS | Chrome | - | ✅ | ✅ | Chrome 72+ | |

### Mobile

| Operating System | Browser | Minimum Browser Version | Pull Stream | Push Stream | Screen Sharing | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Android | Chrome | 85+ | ✅ | ✅ | ❌ | Versions below Chrome 85 have known issues that may cause streaming failures, it's recommended to use Chrome 85+ |
| Android | Edge | 85+ | ✅ | ✅ | ❌ |  |
| Android | Firefox | 56+ | ✅ | ✅ | ❌ | |
| Android | WeChat Embedded Browser | - | ✅ | ✅ | ❌ | |
| Android | Xiaomi Browser | - | ❌ | ❌ | ❌ |  |
| Android | Other | Chromium 85+ | ✅ | ✅ | ❌ | Other browsers such as QQ Browser, UC Browser, are mostly developed based on the Chromium, so focusing on the Chromium version is sufficient. |
| iOS | Safari | 11+ | ✅ | ✅ | ❌ | |
| iOS | Chrome | 11+ | ✅ | Supported (iOS 14.3+) | ❌ | Non-Safari browsers on iOS are implemented based on WKWebview. WKWebview supports camera and microphone capture capabilities only on iOS 14.3+. |
| HarmonyOS | Huawei Browser | - | ✅ | ✅ | ❌ |  |

### Notes

- Mac Firefox screen sharing may experience video misalignment in some areas, [Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi). This cannot be avoided for now; it is recommended to use Chrome or Safari browsers for screen sharing.
- [Known WebRTC Issues and Workarounds](tutorial-02-info-webrtc-issues.md).
- It is recommended that you update the TRTC Web SDK to the latest version in time to obtain better product stability and online support. For version upgrade precautions, please refer to: [Upgrade Guide](tutorial-00-info-update-guideline.md).

## Explanation of Page Access Protocol

For security and privacy reasons, browser vendors restrict web pages from using all the features of TRTC Web SDK (WebRTC) unless they are accessed under the https protocol. To ensure that users in production environments can smoothly access and experience all the features of TRTC Web SDK, please use the https protocol to access the audio and video application page.

Note: Local development can be accessed through the http://localhost or file:// protocol.

The URL domain name and protocol support are shown in the following table:

| Application Scenario | Protocol | Receive (Pull Stream) | Send (Push Stream) | Screen Sharing | Remarks |
| -------------------- | :------: | :------------------: | :---------------: | :-----------: | :-----: |
| Production Environment | https | Supported | Supported | Supported | Recommended |
| Production Environment | http | Supported | Not Supported | Not Supported | |
| Local Development Environment | http://localhost | Supported | Supported | Supported | Recommended |
| Local Development Environment | http://127.0.0.1 | Supported | Supported | Supported | |
| Local Development Environment | http://[Local IP] | Supported | Not Supported | Not Supported | |

> !
> - If your development environment cannot be accessed through localhost and does not have the https protocol, it is recommended that you use a reverse proxy tool to proxy access requests from a certain https domain to your development environment, such as whistle or fiddler.

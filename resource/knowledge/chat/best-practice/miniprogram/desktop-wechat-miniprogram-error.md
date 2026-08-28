---
title: IM SDK Errors When Running in Desktop WeChat Mini Program (tencent_cloud_im_csig_flutter_for_web_25F_cy is undefined / WebSocket is not a constructor) and the Upgrade Fix
product: chat
frameworks: [miniprogram]
scope: platform_specific
tags: [desktop WeChat, mac WeChat 4.x, windows WeChat 3.9.x, uniapp mini program, WeChat native mini program, WebSocket is not a constructor, tencent_cloud_im_csig, cannot read properties of undefined, tim-wx-sdk, "@tencentcloud/chat", "@tencentcloud/lite-chat", v2, v3, v4, version upgrade, compatibility]
version_range: ">=3.5.7"
---

# IM SDK Errors When Running in Desktop WeChat Mini Program (csig undefined / WebSocket is not a constructor) and the Upgrade Fix

## 1. Key Conclusions

- The root cause is that the underlying API attributes of desktop WeChat (mac 4.x / windows 3.9.x) mini programs have changed, causing the IM SDK to misidentify its runtime environment.
- The two errors are different symptoms of the same root cause: a WeChat mini program packaged with uniapp reports `cannot read properties of undefined (reading 'tencent_cloud_im_csig_flutter_for_web_25F_cy')`; a WeChat native mini program reports `TypeError: WebSocket is not a constructor`.
- This issue has been handled for compatibility in both IM SDK v3 (`3.5.7`) and v4 (`4.2.4`). Upgrading to the latest release of the corresponding major version fixes it.
- v2/v3/v4 interfaces are backward compatible and allow smooth migration, but v3 and v4 each contain breaking changes. Assess that there is no risk to your business before upgrading.

## 2. Field/Capability Reference

| Field/Capability | Purpose | Notes |
|---|---|---|
| `tim-wx-sdk` | v2 package name | Legacy version; upgrading to the latest v4 is recommended |
| `@tencentcloud/chat` | v3 package name | Issue fixed (`>=3.5.7`); v3 no longer receives new features |
| `@tencentcloud/lite-chat` | v4 package name | Issue fixed (`>=4.2.4`); recommended version |
| Missing `tencent_cloud_im_csig...` attribute | uniapp mini program error signal | Undefined due to changed underlying API attributes in desktop WeChat |
| `WebSocket is not a constructor` | Native mini program error signal | Desktop WeChat runtime misidentified; constructor unavailable |

## 3. Mechanism/Sequence

Desktop WeChat is upgraded (mac 4.x / windows 3.9.x) -> the underlying mini program API attributes change -> the IM SDK misidentifies its runtime environment -> a uniapp-packaged mini program hits undefined when reading the `tencent_cloud_im_csig...` attribute (reporting `cannot read properties of undefined`) or a native mini program fails to construct `WebSocket` (reporting `WebSocket is not a constructor`) -> after upgrading to v3 (`>=3.5.7`) or v4 (`>=4.2.4`) with compatibility handling, the SDK correctly identifies the desktop WeChat runtime and the error disappears.

## 4. Standard Usage

1. Confirm your current IM SDK version and package name: v2 (`tim-wx-sdk`) / v3 (`@tencentcloud/chat`) / v4 (`@tencentcloud/lite-chat`).
2. Choose the upgrade target based on your current version:
   - Currently v4 (`@tencentcloud/lite-chat`): upgrade to the latest v4 release.
   - Currently v3 (`@tencentcloud/chat`): upgrade to the latest v3 release (v3 no longer receives new features), or upgrade to the latest v4 release.
   - Currently v2 (`tim-wx-sdk`): upgrade to the latest v4 release.
3. Before upgrading, read the corresponding migration guide and assess the impact of breaking changes on your business:
   - v3 breaking changes: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-07-breakingchanges.html`
   - v2 to v3 guide: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-05-integration.html`
   - v4 breaking changes: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-04-comparison-v4.html`
   - v3 to v4 guide: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-03-integration-v4.html`
4. Complete the upgrade and verify via regression: rerun the uniapp mini program and the WeChat native mini program on desktop WeChat (mac 4.x / windows 3.9.x) and confirm the errors no longer occur.

## 5. Result Verification

- After upgrading to v3 (`>=3.5.7`) or v4 (`>=4.2.4`), the uniapp mini program on desktop WeChat no longer reports `cannot read properties of undefined (reading 'tencent_cloud_im_csig...')`.
- The WeChat native mini program no longer reports `TypeError: WebSocket is not a constructor`.
- The IM SDK initializes and establishes a connection normally in the desktop WeChat runtime.

## 6. Common Pitfalls

- Pitfall 1: Assuming it is a uniapp packaging configuration or business code bug (it is actually an SDK environment-identification issue caused by changed underlying desktop WeChat API attributes).
- Pitfall 2: Considering it resolved after verifying only on mobile WeChat (the issue only appears on desktop WeChat mac 4.x / windows 3.9.x).
- Pitfall 3: Upgrading across versions without reading breaking changes (v3 and v4 each have breaking changes; assess business impact first).
- Pitfall 4: Confusing package names (v3 is `@tencentcloud/chat`, v4 is `@tencentcloud/lite-chat`, v2 is `tim-wx-sdk`).

## 7. Problem Definition (Retrieval Aid, Minimal)

When running the IM SDK in a uniapp-packaged WeChat mini program or a WeChat native mini program on desktop WeChat (mac 4.x / windows 3.9.x), it reports the csig attribute as undefined or `WebSocket is not a constructor`.

## 8. Synonymous Phrasing Coverage (Retrieval Recall, Minimal)

- What should I do when the desktop WeChat mini program IM SDK reports WebSocket is not a constructor?
- Why does a uniapp mini program report tencent_cloud_im_csig undefined on mac/windows WeChat?
- IM initialization fails when running a mini program on Windows 3.9 / Mac 4.x WeChat?
- Which version should the IM SDK be upgraded to in order to fix desktop WeChat compatibility?
- How to resolve the missing native WebSocket constructor in the AppService logic layer of the PC WeChat mini program?
- On PC, tim-im app-service.js reports WebSocket is not a constructor?
- The mini program logic layer has no native WebSocket constructor / the WebSocket constructor is unavailable?

## 9. References (Optional)

- v3 breaking changes: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-07-breakingchanges.html`
- v2 to v3 guide: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-05-integration.html`
- v4 breaking changes: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-04-comparison-v4.html`
- v3 to v4 guide: `https://web.sdk.qcloud.com/im/doc/v3/en/tutorial-03-integration-v4.html`

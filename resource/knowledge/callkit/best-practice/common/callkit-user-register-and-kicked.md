---
title: "TUICallKit user registration and Multi-Instance Kick-Out Explained（TUICallKit 用户注册 / 多实例登录）"
product: call
frameworks: [react, vue, miniprogram, web]
scope: platform_common
tags: [TUICallKit, user registration, init, userSig, auto-create user, multi-instance login, kicked out, KICKED_OUT, troubleshooting, same browser, multi-instance, web multi-instance]
version_range: ">=4.0.0"
---

# TUICallKit User Registration and Multi-Instance Kick-Out Explained

## 1. Key Takeaways

### User Registration

- TUICallKit **does not have a dedicated frontend registration API**. User registration is completed through the `init` API: passing `userID` and `userSig` completes authentication and login.
- When a `userID` and `userSig` issued by the backend are used to log in to TUICallKit for the first time, the system automatically creates the user if that `userID` does not yet exist in Tencent Cloud IM.
- Alternatively, users can be batch-imported via the IM Console, and then the imported `userID` with its corresponding `userSig` can be used to log in.

### Multi-Instance Kick-Out

- When the same `userID` is logged in simultaneously across different browser tabs or devices, the earlier session is kicked offline (`KICKED_OUT`) by default, because the Chat SDK Web allows only one instance online per user by default.
- After enabling **Web Multi-Instance Login** in the Chat Console, the same `userID` can be online across multiple tabs or devices simultaneously without being kicked.
- Different `userID`s logged in within the same browser are not affected by this restriction and will not kick each other offline.

## 2. Field / API Reference

| Field / API | Purpose | Notes |
|---|---|---|
| `init` | Initialize and register a user | Pass `SDKAppID`, `userID`, `userSig` to complete authentication |
| `userID` | User identifier | Issued or defined by the business backend; auto-creates the user on first login |
| `userSig` | User signature | Issued by the business backend for authentication |
| `KICKED_OUT` | Kicked offline event | Triggered during same-account / multi-instance login |
| Web Multi-Instance Login | Console configuration | Once enabled, the same browser can have multiple sessions online simultaneously |

## 3. Mechanism & Sequence

### User Registration Flow

Backend generates `userID` + `userSig` -> frontend calls `init({ SDKAppID, userID, userSig })` -> TUICallKit logs in via the Chat SDK -> if the user does not exist, it is auto-created -> login succeeds.

### Multi-Instance Kick-Out Mechanism

Same `userID` logs in on tab A -> same browser opens tab B and logs in with the same `userID` -> Chat backend detects a multi-instance login -> kicks tab A offline -> tab A receives the `KICKED_OUT` event.

## 4. Standard Usage

### User Registration and Initialization

```javascript
// React: @trtc/calls-uikit-react
// Vue 3: @trtc/calls-uikit-vue
// Vue 2.7: @trtc/calls-uikit-vue2
// Vue 2.6: @trtc/calls-uikit-vue2.6
// uniapp 小程序: @trtc/calls-uikit-wx-uniapp
// 微信原生小程序: @trtc/calls-uikit-wx  （API 一致，仅包名不同）
import { TUICallKitAPI } from "@trtc/calls-uikit-react";

TUICallKitAPI.init({
  SDKAppID: 0,         // 控制台获取的 SDKAppID
  userID: 'user_xxx',  // 业务后端签发的用户 ID
  userSig: 'xxx',      // 业务后端签发的用户签名
});
```

### Enabling Web Multi-Instance Login (Resolving Kick-Out)

1. Log in to the Tencent Cloud IM Console.
2. Navigate to the target application's feature configuration page.
3. Enable the **Web Multi-Instance Login** toggle.
4. Save. The change takes effect immediately without restarting the client.

## 5. Expected Results

- After calling `init`, login succeeds with no errors.
- With Web Multi-Instance enabled in the console, the same `userID` can be online across multiple tabs or devices simultaneously.
- Without the feature enabled, logging in with the same `userID` on a new tab causes the old tab to receive the `KICKED_OUT` event.

## 6. Common Pitfalls

- Pitfall 1: Assuming TUICallKit has a dedicated frontend registration API (registration and login are actually done through `init`).
- Pitfall 2: Treating kick-out as a TUICallKit bug (it is actually the Chat SDK's multi-device login restriction).
- Pitfall 3: Assuming different origins also cause kick-out (different origins are treated as different instances and are unaffected).
- Pitfall 4: Assuming different `userID`s in the same browser kick each other out (the multi-instance restriction applies to the same `userID`; different `userID`s are independent).
- Pitfall 5: Thinking `KICKED_OUT` can only be resolved by closing other logins (enabling Web Multi-Instance Login avoids it).

## 7. Problem Definition (retrieval hint)

Users ask about TUICallKit Web user registration (whether there is a dedicated registration API, whether users are auto-created), and the cause and solution for multi-account kick-out within the same browser.

## 8. Alternative Queries (retrieval recall)

- What is the TUICallKit user registration API?
- Does first-time login auto-create a user?
- What to do when two accounts in the same browser get kicked out?
- How to troubleshoot `KICKED_OUT`?
- Does logging in from a different domain cause kick-out?
- How to let multiple users log in on the same page simultaneously?

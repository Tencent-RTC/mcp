---
title: "TUICallKit Limitations（TUICallKit：离线推送、支付宝、抖音、企微以及桌面版微信小程序）"
product: call
frameworks: [react, vue, miniprogram, web]
scope: platform_common
tags: [TUICallKit, limitation, unsupported, offline push, Alipay, Douyin mini program, WeCom, desktop, compatibility]
version_range: ">=2.0.0"
---

# TUICallKit Limitations

## 1. Key Takeaways

| Question | Answer |
|---|---|
| Can Web TUICallKit receive offline push messages? | No. Web TUICallKit does not support receiving offline push messages. |
| Can WeChat Mini Program TUICallKit run on Alipay or Douyin mini programs? | No. It only supports running on WeChat Mini Programs. |
| Can WeChat Mini Program TUICallKit run in WeCom (Enterprise WeChat)? | No. It only supports running on WeChat Mini Programs. |
| Can WeChat Mini Program TUICallKit run in the PC desktop WeChat client? | No. It only supports running on WeChat Mini Programs. |
| Can WeChat Mini Program TUICallKit receive offline push messages? | No. WeChat Mini Program TUICallKit does not support receiving offline push messages. |

## 3. Mechanism & Sequence

The capability boundaries of TUICallKit on each platform are determined by underlying platform restrictions. WeChat Mini Programs rely on WeChat native capabilities and cannot run cross-platform; the Web platform is limited by browser autoplay policies and offline push mechanisms.

## 7. Problem Definition (retrieval hint)

Users inquire about TUICallKit capability boundaries across different platforms and scenarios, confirming whether offline push, cross-platform execution, etc. are supported.

## 8. Alternative Queries (retrieval recall)

- Does TUICallKit support offline push?
- Can WeChat Mini Program TUICallKit run on Alipay?
- Can TUICallKit mini program run in WeCom?
- Does TUICallKit WeChat Mini Program support the PC WeChat client?
- Does TUICallKit Web have offline message notifications?
- Does TUICallKit mini program only support WeChat?

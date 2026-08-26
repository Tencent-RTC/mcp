---
title: "Mini Program: IM SDK Media Upload Failure Diagnosis and Fix (Image/Video/Audio/File)（小程序体验版和正式版偶现发送图片、视频、语音、文件失败 / 开发版正常）"
product: chat
frameworks: [miniprogram]
scope: platform_specific
tags: [upload, media, image, video, audio, file, uploadFile, domain allowlist, debug mode, COS dedicated domain]
version_range: ">=3.0.0"
---

# Mini Program: IM SDK Media Upload Failure Diagnosis and Fix (Image/Video/Audio/File)

## 1. Key Takeaways

- The primary item to check in this scenario is whether the `uploadFile` domain allowlist is fully configured in the mini program management backend.
- The validation policies differ between dev builds and preview/production builds; successful uploads in the dev build do not guarantee the allowlist is correctly configured.
- Preview builds can enable debug mode for verification: debug mode bypasses domain allowlist validation and can be used to quickly determine whether the issue is caused by the `uploadFile` domain configuration.
- Starting from 2024-09-10, newly created apps are assigned a COS dedicated domain `https://${SDKAppID}-cn.rich.my-imcloud.com` by default.
- When using the COS dedicated domain, it must be added to the mini program `uploadFile` allowed domain allowlist.

## 2. Field / API Reference

| Field / Capability | Purpose | Description |
|---|---|---|
| `uploadFile` domain allowlist | Upload channel access control | Incomplete allowlist configuration causes upload failures in preview/production builds |
| Preview build debug mode | Diagnostic tool | Bypasses domain allowlist validation; used to verify whether the allowlist is the root cause |
| `https://${SDKAppID}-cn.rich.my-imcloud.com` | COS dedicated domain | Assigned by default for new apps; must be added to the `uploadFile` allowlist |
| Media message types (image/video/audio/file) | Affected scope | All share the `uploadFile` path and are affected by allowlist configuration |

## 3. Mechanism & Sequence

Dev build uploads successfully -> Preview/production build uploads fail -> Check `uploadFile` domain allowlist in mini program management backend -> Enable debug mode in preview build and retest -> If debug mode resolves the issue, confirm it is an allowlist configuration problem.

## 4. Standard Usage

1. Log in to the mini program management backend and check whether the `uploadFile` allowed domains are fully configured. Reference: `https://cloud.tencent.com/document/product/269/117335`.
2. Verify and add the upload domains actually used by the current app, with special attention to confirming that the COS dedicated domain `https://${SDKAppID}-cn.rich.my-imcloud.com` is allowlisted.
3. Enable debug mode in the preview build and retest image/video/audio/file uploads.
4. If uploads recover after enabling debug mode, complete/correct the `uploadFile` domain configuration per allowlist specifications.
5. After disabling debug mode, verify the upload path again in both preview and production builds.

## 5. Expected Results

- Preview build can upload images/videos/audio/files successfully with debug mode disabled.
- Production build upload path is stable with no upload failures.
- The mini program backend `uploadFile` domain allowlist is fully consistent with the current connected domains.
- COS dedicated domain `https://${SDKAppID}-cn.rich.my-imcloud.com` has been added to the allowlist (applicable for new apps).

## 6. Common Pitfalls

- Pitfall 1: Assuming the domain allowlist is correctly configured just because the dev build uploads successfully.
- Pitfall 2: Only verifying in debug mode and then directly publishing to production.
- Pitfall 3: Only checking `request` or `websocket` allowlists while ignoring the `uploadFile` allowlist.
- Pitfall 4: After a new app enables the COS dedicated domain, not syncing the `uploadFile` allowlist update.

## 7. Problem Definition (retrieval hint)

When integrating IM SDK in a mini program, the dev build can upload images/videos/audio/files normally, but the preview and production builds fail to upload.

## 8. Alternative Queries (retrieval recall)

- How to fix image upload failure in a preview mini program with IM?
- Why can the dev build upload but the preview and production builds fail?
- Can a missing `uploadFile` domain allowlist entry cause IM upload failure in a mini program?
- What does it mean when uploads recover after enabling debug mode in the preview build?

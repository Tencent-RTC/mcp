---
title: "Chat SDK: Image Message URL Lifecycle (blob vs. imageUrl)（图片消息 blob 地址 / 服务端 url 更新时机 / imageInfoArray / 图片消息 url）"
product: chat
frameworks: [web, miniprogram]
scope: platform_common
tags: [sendMessage, createImageMessage, imageInfoArray, imageUrl, url, blob, https, image message, upload progress, lifecycle]
version_range: ">=3.0.0"
---

# Chat SDK: Image Message URL Lifecycle (blob vs. imageUrl)

## 1. Key Takeaways

- `imageInfoArray[x].url` is primarily used for local preview; it remains a `blob:` in-memory URL even after the message is sent successfully.
- When you need a cloud-accessible URL, read `imageInfoArray[x].imageUrl` from the successfully sent message.
- After refreshing and re-logging in, when pulling roaming messages, `imageInfoArray[x].url` is the server-side URL.
- To get upload progress, pass an `onProgress` callback when calling `createImageMessage`.

## 2. Field / API Reference

| Field / Capability | Phase | Semantics |
|---|---|---|
| `imageInfoArray[x].url` | During/after sending | Local preview address; may be `blob:`; not guaranteed to auto-update to a cloud URL |
| `imageInfoArray[x].imageUrl` | After successful send | Server-accessible address; use as the externally accessible URL |
| `onProgress` | During upload | File upload progress callback for displaying upload progress |

## 3. Mechanism & Sequence

`createImageMessage` -> `sendMessage` -> Internal upload flow -> Upload succeeds and message is sent to IM backend -> Read `imageInfoArray[x].imageUrl` from the returned message -> After refreshing and re-logging in, pulling roaming messages yields `imageInfoArray[x].url` as the server-side URL.

## 4. Standard Usage

1. Call `createImageMessage` to create an image message (pass `onProgress` if progress is needed).
2. Call `sendMessage` to send the message.
3. After successful sending, read `imageInfoArray[x].imageUrl` from the returned message as the cloud URL.
4. Correct approach for rendering images on the frontend: read `imageInfoArray[x].url` when rendering the message; using the `blob` address during sending enables faster image rendering.

## 5. Expected Results

- After sending, inspect the same message:
  - `imageInfoArray[x].url` is still `blob:`;
  - `imageInfoArray[x].imageUrl` is a server-accessible address.
- After refreshing and re-logging in, pulling history messages yields `imageInfoArray[x].url` as the server-side URL.

## 6. Common Pitfalls

- Pitfall 1: Assuming that `url` will automatically change to a cloud link after upload.

## 7. Problem Definition (retrieval hint)

After sending an image message, the user observes that `imageInfoArray[x].url` is still a `blob:` local URL and expects it to automatically become a Tencent Cloud `https` URL. The user also wants to know which field to read as the final accessible address after upload is complete.

## 8. Alternative Queries (retrieval recall)

- Why is `url` still `blob:` after sending an image message?
- Which field should I use to get the cloud `https` image URL?
- How to get the final image URL after `sendMessage` succeeds?
- What is the difference between `imageInfoArray[x].url` and `imageInfoArray[x].imageUrl`?
- Why does the image URL in history messages change after refreshing?

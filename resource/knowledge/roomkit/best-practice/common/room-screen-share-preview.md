---
title: "TUIRoomKit Screen Sharing Local Preview and Avoiding Infinite Mirroring（TUIRoomKit / 屏幕共享 / 本地预览 / 无限套娃）"
product: room
frameworks: [react, vue, web]
scope: platform_common
tags: [TUIRoomKit, screen sharing, local preview, startScreenSharing, startScreenShare, full-screen sharing, infinite mirroring, infinite recursion, window sharing, external monitor, useDeviceState, view parameter]
version_range: ">=2.0.0"
---

# TUIRoomKit Screen Sharing Local Preview and Avoiding Infinite Mirroring

## 1. Key Takeaways

- The `view` parameter enables local display of the shared content: passing a valid `view` renders the shared screen in a local container (local preview); omitting it or passing `null` skips local preview rendering.
- Full-screen sharing with local preview causes "infinite mirroring/recursion": the local preview area is within the captured full screen/current page, so the preview image re-enters the capture, creating recursive mirroring.
- **Preferred solution: share a "window" instead of the full screen**, preventing the meeting page from being captured and causing recursion.
  - **Note for sharing WPS**: typically you cannot capture the "slideshow window" independently (the slideshow window and editor window behave inconsistently in the capture list). In this case, have the user connect an **external monitor**: place the slideshow on the external screen, then share that monitor/corresponding window. The main meeting screen continues operating, and the preview is less likely to recurse.
- **Fallback solution**: when window sharing is not possible and no external monitor is available, make the local preview container as small as possible (shrink the `view` container) to significantly reduce the recursive mirroring impact; or do not pass `view` / pass `null` for local preview, using only a "sharing in progress" status indicator.

## 2. Field / API Reference

| Field / Capability | Purpose | Notes |
|---|---|---|
| `view` | Local screen share preview container | Pass a valid DOM element or id to render local preview; pass `null` to skip |
| `startScreenSharing` | Screen sharing API | TRTC Web / Room screen sharing; `view` specifies local preview |
| `startScreenShare` | Underlying screen sharing | TRTC `startScreenShare`, consistent with Atomicx |
| `useDeviceState().startScreenShare` | Atomicx no-UI path | Screen sharing entry; local preview determined by preview view/container |

## 3. Mechanism & Sequence

### Local Preview

Call screen sharing API with a valid `view` -> local container renders the shared screen (local preview) -> omitting `view` or passing `null` skips local preview rendering.

## 4. Standard Usage

### Screen Sharing with Local Preview

```javascript
// TRTC Web / Room screen sharing, view specifies local preview container (element or id)
startScreenShare({
  view: 'local-preview-container',   // 传入有效 view，本地渲染分享画面
  // 传 null 则不渲染本地预览
});
```

### Avoiding Infinite Mirroring

```javascript
// 方案 1：优先分享窗口而非整屏，从源头避免套娃
startScreenShare({ view: 'local-preview-container' });  // 选择窗口采集源

// 方案 2（兜底）：无法分享窗口时，缩小本地预览容器或本地不传 view
startScreenShare({ view: null });  // 不渲染本地预览，仅用"正在共享"状态提示
```

## 5. Expected Results

- Passing a valid `view`: local container renders the shared screen, enabling local preview.
- Omitting / passing `null`: no local preview rendering; only remote participants see the shared screen.
- Full-screen sharing + local preview: may cause infinite mirroring; switch to window sharing or shrink the preview.
- Sharing WPS slideshow: use the external monitor approach to avoid mirroring.

## 6. Common Pitfalls

- Pitfall 1: Assuming `view` is a remote rendering parameter (`view` specifies the local screen share preview).
- Pitfall 2: Giving up local preview entirely because full-screen sharing causes mirroring (switch to window sharing or shrink the preview instead).
- Pitfall 3: Assuming you can capture the WPS slideshow window independently (typically not possible; use an external monitor).
- Pitfall 4: Confusing `startScreenSharing` with `startScreenShare` (they are consistent at the underlying level; both use `view` for local preview).

## 7. Problem Definition (retrieval hint)

Whether the `view` parameter in TUIRoomKit screen sharing enables local preview of the shared content, and how to avoid infinite mirroring/recursion when sharing the full screen with local preview enabled.

## 8. Alternative Queries (retrieval recall)

- Can screen sharing show a local preview?
- What is the TUIRoomKit screen sharing startScreenShare view parameter?
- How to avoid infinite mirroring when sharing full screen?
- What to do about recursive mirroring in screen sharing?
- Is it better to share a window or the full screen?
- How to shrink the local preview window?
- How to hide local preview for screen sharing?

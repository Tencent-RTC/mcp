## Function Description

This article introduces how to use the watermark plugin to add image watermarks on camera streams.

## Run Demo

<div style="margin: 20px 0;">
<details class="trtc-demo-details" style="border-radius: 10px; border: 1px solid #e5e6eb; overflow: hidden; box-shadow: 0 4px 14px rgba(0,82,217,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <summary style="padding: 14px 22px; background: linear-gradient(135deg, #006eff 0%, #0052d9 100%); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; list-style: none; user-select: none; display: flex; align-items: center; gap: 10px; transition: filter 0.2s;">
    <span class="trtc-demo-arrow" style="font-size: 14px; opacity: 0.9;">▶</span>
    <span class="trtc-demo-summary-text">Click to Run Demo</span>
  </summary>
  <div style="padding: 16px; background: #fff;">
<script>
(function(){var t=null;window.addEventListener('message',function(e){if(e.data&&e.data.type==='trtc-demo-resize'){var f=document.querySelector('.trtc-demo-iframe');if(f){f.style.height=e.data.height+'px';clearTimeout(t);t=setTimeout(function(){f.style.height=e.data.height+'px'},200)}}})})();
document.querySelectorAll('.trtc-demo-details').forEach(function(d){d.addEventListener('toggle',function(){var s=d.querySelector('.trtc-demo-summary-text'),a=d.querySelector('.trtc-demo-arrow');if(d.open){s&&(s.textContent='Click to Close Demo');a&&(a.textContent='▼')}else{s&&(s.textContent='Click to Run Demo');a&&(a.textContent='▶')}})});
</script>
    <iframe allow="microphone; camera; display-capture;" class="trtc-demo-iframe" style="width:100%;border:none;min-height:700px" title="Enable Watermark Plugin" src="https://web.sdk.qcloud.com/trtc/webrtc/v5/demo/samples/advance-features/enable-watermark/index.html?lang=en" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>
  </div>
</details>
</div>

## Prerequisites

- TRTC Web SDK version >= 5.3.0.

## Implementation Steps

### Install Watermark Plugin

```javascript
import { Watermark } from 'trtc-sdk-v5/plugins/video-effect/watermark';

let trtc = TRTC.create({ plugins: [Watermark] });
```

### Open Camera

```javascript
await trtc.startLocalVideo({
  view: 'local-video'
  option: {
    mirror: false
  }
});
```

### Start Watermark Plugin

```javascript
await trtc.startPlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/trtc-watermark-test.png'
});
```

After testing, you can replace the test image URL with your own watermark image. It is recommended to use a transparent PNG format.

### Stop Watermark Plugin

```javascript
await trtc.stopPlugin('Watermark');
```

## API Description

### trtc.startPlugin('Watermark', options)

Start watermark plugin.

#### options

| Name      | Type                             | Attributes | Description                                                                                                                                                                                                                                                                                  |
|-----------|----------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| imageUrl  | `string`                         | Required   | Image watermark URL                                                                                                                                                                                                                                                                           |
| x         | `string`                         | Optional   | Watermark left margin                                                                                                                                                                                                                                                                         |
| y         | `string`                         | Optional   | Watermark top margin                                                                                                                                                                                                                                                                          |
| size      | `string \| number \| object`     | Optional   | When passing a string: <br> - `"cover"` scales the background image to fully cover the background area, which may cause parts of the background image to be invisible. <br> - `"contain"` scales the background image to fit entirely within the background area, possibly leaving some areas blank. <br> When passing a number: <br> - `x` scales the background image by x times, e.g., 0.5, with a valid range of `(0,1]` <br> When passing an object: <br> - You can specify manually by passing `{width: 200, height: 300}` <br> The default is `cover` |

**Example:**

```javascript
await trtc.startPlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/tv2.png',
  size: 'contain'
});
```

```javascript
await trtc.startPlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/tv2.png',
  size: 'cover'
});
```

```javascript
await trtc.startPlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/tv2.png',
  x: 0,
  y: 0,
  size: 0.5
});
```

```javascript
await trtc.startPlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/tv2.png',
  x: 0,
  y: 0,
  size: {
    width: 100,
    height: 200
  }
});
```

### trtc.updatePlugin('Watermark', options)

Update the watermark image, position, and size.

#### options

| Name      | Type                             | Attributes | Description                                                                                                                                                                                                                                                                                  |
|-----------|----------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| imageUrl  | `string`                         | Required   | Image watermark URL                                                                                                                                                                                                                                                                           |
| x         | `string`                         | Optional   | Watermark left margin                                                                                                                                                                                                                                                                         |
| y         | `string`                         | Optional   | Watermark top margin                                                                                                                                                                                                                                                                          |
| size      | `string \| number \| object`     | Optional   | When passing a string: <br> - `"cover"` scales the background image to fully cover the background area, which may cause parts of the background image to be invisible. <br> - `"contain"` scales the background image to fit entirely within the background area, possibly leaving some areas blank. <br> When passing a number: <br> - `x` scales the background image by x times, e.g., 0.5, with a valid range of `(0,1]` <br> When passing an object: <br> - You can specify manually by passing `{width: 200, height: 300}` <br> The default is `cover` |

```javascript
await trtc.updatePlugin('Watermark', {
  imageUrl: 'https://web.sdk.qcloud.com/trtc/webrtc/test/qer-test/watermark/tv2.png',
  x: 100,
  y: 200,
  size: {
    width: 50,
    height: 50
  }
});
```

### trtc.stopPlugin('Watermark')

Stop watermark plugin.

**Example:**

```javascript
await trtc.stopPlugin('Watermark');
```

## Q&A

**1. Is the watermark mirrored?**

The local preview image is enabled by default, so the watermark will also be mirrored. You can disable the local preview mirror image.

```javascript
await trtc.updateLocalVideo({
  option: {
    mirror: false
  }
});
```

**2. Why does the screen flashes black briefly after updating the watermark?**

Update SDK to v5.8.6+.

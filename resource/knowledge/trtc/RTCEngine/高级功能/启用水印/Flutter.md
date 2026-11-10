---
sync_node_id: '154327510133026816'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "启用水印"
  - "Flutter"
product: "trtc"
---
This document mainly introduces how to add a watermark to a video stream.

## Implementation Steps

### Turning on Camera
``` java
trtcCloud.startLocalPreview(isFrontCamera, viewId);
```

### Watermarking

Assuming we need to add an image with storage path imagePath as a watermark on the main screen (TRTCVideoStreamType.big):
``` java
setWatermark(String imagePath, double x, double y, double width) {
  _trtcCloud.setWatermark(imagePath, TRTCVideoStreamType.big, x, y, width);
}
```

The API requires the image path to be an accessible path on the current device.
- Android:/storage/emulated/0/Android/data/your package name/files/watermark.png

- iOS: /Library/Caches/watermark.png

   The watermark position is specified by the rect parameter, a quadruple in the format (x, y, width, height).

-  x: watermark coordinate, a floating-point number with value range 0 - 1.

-  y: watermark coordinate, a floating-point number with value range 0 - 1.

-  width: width of a watermark, a floating-point number with value range 0 - 1.

-  height: unused, the SDK automatically calculates a suitable height based on the watermark image's aspect ratio.

Parameter setting example:

If the current video's encoded resolution is 540 × 960 and the rect parameter is set to (0.1, 0.1, 0.2, 0.0),

So the top-left coordinate point of the watermark is (540 × 0.1, 960 × 0.1), exactly (54, 96). The width of the watermark is 540 × 0.2 = 108px, and the height will be automatically calculated by the SDK based on the aspect ratio of the watermark image.

> **Note:**
> - Watermark image must use **PNG with transparent background.**
> - The watermark added via the setWatermark API is invisible in local preview. To view the watermark effect, you need to retrieve the user stream with set watermark from the remote end.

### Pulling a Watermarked Video Stream

Pull the user's video stream with watermark on another device.
``` java
trtcCloud.startRemoteView("denny", TRTCVideoStreamType.big, viewId);
```

### Removing a Watermark

Enter a null value to remove the watermark from the video stream published by itself.
``` java
trtcCloud.setWatermark("", TRTCVideoStreamType.big, 0.3, 0.4, 0.4);
```

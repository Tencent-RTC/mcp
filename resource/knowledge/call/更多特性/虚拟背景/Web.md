---
sync_node_id: '145193410188582912'
nav_path:
  - "视频通话 SDK"
  - "更多特性"
  - "虚拟背景"
  - "Web"
product: "call"
---
TUICallKit has launched a new feature for virtual backgrounds, allowing users to set a blurry or image background during video calls. This hides the real calling environment, protects privacy, and makes the call more interesting. Next, this article will detail how to use this feature in the TUICallKit component.

## Integration effect

The display effect of the TUICallKit component after integrating the virtual background feature is as follows.

## Preparation Requirements

Before using the Virtual Background feature provided by Tencent Cloud, you need to visit the Console to activate Audio and Video Services for your application and purchase the `Group Call` package. For specific steps, please see Activate Service.

## Enable Blurry Background

TUICallKit's UI design supports setting a blurry background. By calling the following interface, you can display a feature button for the blurry background on the UI. Clicking the button will directly enable the blurry background feature.

> **Note：**
> H5 is not supported yet, only PC supports it.
> 

``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-vue"; 
TUICallKitAPI.enableVirtualBackground(true);
```

## Setting Image Background (Optional)

Implementing the image background requires users to save the image locally. After saving, call the following interface for setting (currently, only images with a local path are supported,  images of uri are not supported yet).
``` javascript
import { TUICallKitAPI } from "@trtc/calls-uikit-vue"; 
TUICallKitAPI.getTUICallEngineInstance().setVirtualBackground(imagePath: string)
```

## FAQs

### Enabling blurry background has no response or is delayed
- Ensure you have purchased the audio and video call `Group Call` package, see Activate Service.

- When the network is poor, the virtual background model file may not be completely downloaded, resulting in failure to open the virtual background.

### Can the virtual background be turned on if the camera is turned off?

Not available.

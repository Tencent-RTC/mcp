---
sync_node_id: '142565403105845248'
nav_path:
  - "视频通话 SDK"
  - "更多特性"
  - "虚拟背景"
  - "iOS"
product: "call"
---
TUICallKit has launched a new feature for virtual backgrounds, allowing users to set a blurry or image background during video calls. This hides the real calling environment, protects privacy, and makes the call more interesting. Next, this article will detail how to use this feature in the TUICallKit component.

## Integration effect

The display effect of the TUICallKit component after integrating the virtual background feature is as follows:

## Preparation Requirements
1. Before using the virtual background feature provided by Tencent Cloud, you need to go to the Console to activate Audio and Video Services for your application, and purchase the `Group Call` package. For detailed steps, please .

2. Download the [Virtual Background Model](https://liteav.sdk.qcloud.com/sdkres/feature/virtual_background/model/versions/2.0/person_segmention_2.0.zip) file, extract it, and drag the `LiteavSegmentModel.bundle` file into your project, ensuring it's in the `MainBundle`.

   

3. Modify the dependencies in your Podfile to replace them with the `Professional` version, and specify the version of TXLiteAVSDK_Professional as `11.8.15669`.

   ``` bash
   pod 'TUICallKit_Swift/Professional'
   pod 'TXLiteAVSDK_Professional', '11.8.15669'
   ```

   > **Note:**
   > 
   > There is a corresponding relationship between the version of the TRTC SDK and the model file, please ensure the version number matches the model, see below: Model File Matching with SDK.
   > 

## Enable Blurry Background

TUICallKit's UI design supports setting a blurry background. By calling the following interface, you can display a feature button for the blurry background on the UI. Clicking the button will directly enable the blurry background feature.
``` swift
import TUICallKit

TUICallKit.createInstance().enableVirtualBackground(enable: true)
```

## Setting Image Background (Optional)

Implementing the image background requires users to save the image locally. After saving, call the following interface for setting (currently, only images with a local path are supported, network images are not supported yet).
``` swift
import TUICallEngine

TUICallEngine.createInstance().setVirtualBackground("imagePath") { code, message in
}
```

## FAQs

### Enabling blurry background has no response or is delayed?
- Ensure you have purchased the `Group Call` package, see Activate Service for more details.

- Ensure the model file is downloaded to local.

   If a model file is not added to the local path, when enabling the blurry background feature, the SDK will then download the model file. Under normal network conditions, the download takes 1~3s; the poorer the network, the longer it will take.

- Check if the model file and SDK are a match.

### Matching model files with SDK?

TUICallKit is a video and audio call scenario implemented based on the C SDK and TRTC SDK. The virtual background is a distinctive feature provided by TRTC SDK. It's important to note that the virtual background model file needs to match the version of the TRTC SDK; otherwise, the blurry background feature may not function properly. The table below lists the relationships between the model files and the TRTC SDK versions:

|SDK Version|Virtual background model file Download address·|
|---------|---------|
|pod 'TXLiteAVSDK_Professional', '11.8.15669'|[Download version_2.0](https://liteav.sdk.qcloud.com/sdkres/feature/virtual_background/model/versions/2.0/person_segmention_2.0.zip)|
|pod 'TXLiteAVSDK_Professional', '11.7.12001'|[Download version_1.0](https://liteav.sdk.qcloud.com/sdkres/feature/virtual_background/model/versions/1.0/segmention_model_1.0.zip)|

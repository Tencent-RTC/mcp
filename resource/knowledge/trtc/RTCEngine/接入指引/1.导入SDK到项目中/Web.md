---
sync_node_id: '89644534113550336'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "Web"
product: "trtc"
---
This document describes how to import TRTC Web SDK into your project.

## Supported Platforms

The TRTC Web SDK supports all major browsers such as **Chrome, Edge, Firefox, Safari, and Opera**. For a list of browsers supported by TRTC, see [Supported Platforms](https://intl.cloud.tencent.com/document/product/647/41664#supported-platforms).

## Import SDK to your project

### By npm
1. Use npm to install [trtc-sdk-v5](https://www.npmjs.com/package/trtc-sdk-v5) package in your project.

   ``` bash
   npm install trtc-sdk-v5 --save
   ```
2. Import the module in the project script.

   ``` javascript
   import TRTC from 'trtc-sdk-v5';
   ```

### By script
1. Download SDK file trtc.js from [GitHub](https://github.com/Tencent-RTC/TRTC_Web/tree/main/SDK).

2. Add the following code to your webpage:

   ``` html
   <script src="trtc.js"></script>
   ```

## Enter Room

After import SDK to your project, you can use TRTC to enter a room, please .

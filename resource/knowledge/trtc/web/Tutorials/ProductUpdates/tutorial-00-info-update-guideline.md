---
sync_node_id: 'https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-00-info-update-guideline.md'
nav_path:
  - "Tutorials"
  - "Product Updates"
product: "trtc"
---
Please note that there are interface changes or `Breaking Changes` in the following SDK versions. 

## Version 5.12.0 @2025.07.25

- Removed built-in CDN addresses and reduced the size of the virtual background plugin resources. If you fall into any of the following scenarios, you need to redeploy the assets from the npm package and specify the path in `TRTC.create({ assetsPath })` when upgrading:
  - Using the virtual background plugin.
  - Using the AI noise reduction plugin but have not deployed the assets from the npm package before.

## Version 5.10.0 @2025.04.17

- The plugin format has been changed from `iife` to `umd`, supporting more integration environments.
  - If you import the plugin via the `import`, you can ignore this change.
  - If you load the plugin using the `<script>` tag, please note that you need to update the plugin file name during the upgrade.
- The `wasm` resource files in the npm package have been unified and moved to the `assets` directory. You can directly deploy the `assets` directory during deployment.

## Version 5.6.0 @2024.5.17

### Breaking Changed

In versions before v5.6.0, SDK will enable `autoReceiveVideo` by default, which means that SDK will receive remote video automatically when remote user video stream is published. But sometimes your business scenario is to receive the remote video stream on demand, in this case, `autoReceiveVideo` will cause additional bandwidth consumption.

In v5.6.0 and later, SDK set `autoReceiveVideo` to false by default, which means that SDK will not receive remote video automatically when remote user video stream is published. You should call [trtc.startRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/TRTC.html#startRemoteVideo) to receive and play remote video when you needed. This breaking changed can reduce unnecessary bandwidth usage.

We recommend you set `autoReceiveVideo` to true in following cases:

1. You want to see the remote video as quickly as possible. `autoReceiveVideo = true` will receive video stream ahead of time, so you can play remote video faster when you call [trtc.startRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/TRTC.html#startRemoteVideo).
2. The remote side does not publish the video stream, but publish the black frame video all the way for sending the [SEI message](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/TRTC.html#sendSEIMessage). At this point, for the receiving end, the black frame video stream does not need to be played by [trtc.startRemoteVideo](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/TRTC.html#startRemoteVideo). Therefore, you can also set `autoReceiveVideo = true` to ensure that SEI messages are received normally.

## Version 5.1.0 @2023.08.11

### Background

- The string type roomId "123" is not the same room as the numeric type roomId 123.
- Before version v5.1.0, the roomId parameter of the {@link TRTC#enterRoom trtc.enterRoom} interface supported both number and string types. It was easy to encounter situations where different roomId types caused communication issues between different platforms.

### Breaking Changed

To prevent the above situation, starting from version v5.1.0, the roomId parameter of the {@link TRTC#enterRoom trtc.enterRoom} interface is limited to the number type and no longer supports string type. If you want to use a string roomId, please use the strRoomId parameter.

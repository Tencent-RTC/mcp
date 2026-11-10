---
sync_node_id: '89644535198826496'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "测试网络质量"
  - "Web"
product: "trtc"
---
Before entering the room or during the call, you can check the user's network quality to determine the current network quality. If the user's network quality is too poor, it is recommended that the user change the network environment to ensure normal call quality.

This article mainly introduces how to implement network quality detection before the call based on the [`NETWORK_QUALITY`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.NETWORK_QUALITY) event.

## Network quality check during the call process
``` javascript
const trtc = TRTC.create();
trtc.on(TRTC.EVENT.NETWORK_QUALITY, event => {
   console.log(`network-quality, uplinkNetworkQuality:${event.uplinkNetworkQuality}, downlinkNetworkQuality: ${event.downlinkNetworkQuality}`)
   console.log(`uplink rtt:${event.uplinkRTT} loss:${event.uplinkLoss}`)
   console.log(`downlink rtt:${event.downlinkRTT} loss:${event.downlinkLoss}`)
})
```

## Network quality check before making a call

### Implementation process
1. Call [`TRTC.create()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.create) to create two TRTCs, referred to as uplinkTRTC and downlinkTRTC.

2. Both TRTCs enter the same room.

3. Use uplinkTRTC to push the stream, and listen to the [`NETWORK_QUALITY`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.NETWORK_QUALITY) event to detect the uplink network quality.

4. Use downlinkTRTC to pull the stream, and listen to the [`NETWORK_QUALITY`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.NETWORK_QUALITY) event to detect the downlink network quality.

5. The entire process lasts for about 15 seconds, and finally takes the average network quality to roughly determine the uplink and downlink network conditions.

   > **Note:**
   > 
   > The process of checking network quality incurs a small [basic service fee](https://intl.cloud.tencent.com/document/product/647/34610). If a resolution is not specified, the stream will be published at a resolution of 640 x 480.
   > 

### API Call Sequence

### Sample Code
``` js

let uplinkTRTC = null; // Used to detect uplink network quality
let downlinkTRTC = null; // Used to detect downlink network quality
let localStream = null; // Stream used for testing
let testResult = {
  // Record uplink network quality data
  uplinkNetworkQualities: [],
  // Record downlink network quality data
  downlinkNetworkQualities: [],
  average: {
    uplinkNetworkQuality: 0,
    downlinkNetworkQuality: 0
  }
}

// 1. Test uplink network quality
async function testUplinkNetworkQuality() {
  uplinkTRTC = TRTC.create();

  uplinkTRTC.enterRoom({
    roomId: 8080,
    sdkAppId: 0, // Fill in sdkAppId
    userId: 'user_uplink_test',
    userSig: '', // userSig of uplink_test
    scene: 'rtc'
  })

  uplinkTRTC.on(TRTC.EVENT.NETWORK_QUALITY, event => {
    const { uplinkNetworkQuality } = event;
    testResult.uplinkNetworkQualities.push(uplinkNetworkQuality);
  });

}

// 2. Detect downlink network quality
async function testDownlinkNetworkQuality() {
  downlinkTRTC = TRTC.create();
  downlinkTRTC.enterRoom({
    roomId: 8080,
    sdkAppId: 0, // Fill in sdkAppId
    userId: 'user_downlink_test',
    userSig: '', // userSig
    scene: 'rtc'
  });

  downlinkTRTC.on(TRTC.EVENT.NETWORK_QUALITY, event => {
      const { downlinkNetworkQuality } = event;
      testResult.downlinkNetworkQualities.push(downlinkNetworkQuality);
  })
}

// 3. Start detection
testUplinkNetworkQuality();
testDownlinkNetworkQuality();

// 4. Stop detection after 15s and calculate the average network quality
setTimeout(() => {
  // Calculate the average uplink network quality
  if (testResult.uplinkNetworkQualities.length > 0) {
    testResult.average.uplinkNetworkQuality = Math.ceil(
      testResult.uplinkNetworkQualities.reduce((value, current) => value + current, 0) / testResult.uplinkNetworkQualities.length
    );
  }

  if (testResult.downlinkNetworkQualities.length > 0) {
    // Calculate the average downlink network quality
    testResult.average.downlinkNetworkQuality = Math.ceil(
      testResult.downlinkNetworkQualities.reduce((value, current) => value + current, 0) / testResult.downlinkNetworkQualities.length
    );
  }
    
  // Detection is over, clean up related states.
  uplinkTRTC.exitRoom();
  downlinkTRTC.exitRoom();
}, 15 * 1000);
```

## Result Analysis

After the above steps, you can get the average uplink network quality and the average downlink network quality. The enumeration values of network quality are as follows:

|Value|Meaning|
|---------|---------|
|0|The network condition is unknown, indicating that the current TRTC instance has not established an uplink/downlink connection|
|1|The network condition is excellent|
|2|The network condition is good|
|3|The network condition is average|
|4|The network condition is poor|
|5|The network condition is extremely poor|
|6|The network connection has been disconnected. Note: If the downlink network quality is this value, it means that all downlink connections have been disconnected.|

> **Suggestion:**
> 
> When the network quality is greater than 3, it is recommended to guide the user to check the network and try to change the network environment, otherwise it is difficult to ensure normal audio and video communication.
> 
> You can also reduce bandwidth consumption through the following strategies:
> 
> - If the uplink network quality is greater than 3, you can reduce the bitrate through the [`TRTC.updateLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#updateLocalVideo) interface or close the video through the [`TRTC.stopLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#stopLocalVideo) method to reduce uplink bandwidth consumption.
> - If the downlink network quality is greater than 3, you can reduce the downlink bandwidth consumption by subscribing to a small stream (refer to: [Enable Small Stream Transmission](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-27-advanced-small-stream.html)) or only subscribing to audio.

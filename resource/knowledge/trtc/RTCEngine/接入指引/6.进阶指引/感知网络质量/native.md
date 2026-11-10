---
sync_node_id: '89644534679781376'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "感知网络质量"
  - "Android&iOS&Windows&Mac"
product: "trtc"
---
It is difficult for ordinary users to evaluate the network quality. Via measuring the speed before the video call and feeding back the network quality during the call can users evaluate the network quality more intuitively.

This document describes how to detect network quality.

## Detect Network Quality Before the Call

> **Note：**
> - To ensure call quality, do not run the test during a video call.
> - Speed testing consumes traffic and consequently generates a small traffic fee (almost negligible).

### How Speed Testing Works

- During speed testing, the SDK sends a batch of probe packets to the server node, measures the quality of return packets, and returns the testing result via a callback API.

- The testing result can be used to optimize the SDK's server selection policy, so you are advised to run the test before the first call, which will help the SDK select the optimal server. If the result is unsatisfactory, you can show a UI message asking users to change to a better network.

- The test result ([TRTCSpeedTestResult](https://liteav.sdk.qcloud.com/doc/api/en/group__TRTCCloudDef__ios.html#interfaceTRTCSpeedTestResult)) includes the following parameters:

   |Parameter|Type|Description|
   |---------|---------|---------|
   |success|Success result|Whether the test is successful.|
   |errMsg|Error message|Error message of bandwidth test.|
   |ip|Server address|Testing server IP|
   |[quality](https://liteav.sdk.qcloud.com/doc/api/en/group__TRTCCloudDef__ios.html#ga25f9ccb045890cb18a5f647ef3c1f974)|Network quality score|Network quality measured by the SDK. Lower packet loss and shorter RTT result in a higher network quality score.|
   |upLostRate|Upstream packet loss rate|Value range: 0-1.0. `0.3` indicates that for every 10 data packets sent to the server, 3 may be lost.|
   |downLostRate|Downstream packet loss rate|Value range: 0-1.0. `0.2` indicates that for every 10 data packets received from the server, 2 may be lost.|
   |rtt|Latency|The time it takes for data to travel from the SDK to the server and back again. The shorter the RTT, the better. The normal range of RTT is 10-100 ms.|
   |availableUpBandwidth|Upstream bandwidth|Estimated upstream bandwidth in Kbps. -1 indicates an invalid value.|
   |availableDownBandwidth|Downstream bandwidth|Estimated downstream bandwidth in Kbps. -1 indicates an invalid value.|

### How to Test Speed
- **With calling API** 

   The speed test feature can be started through the `startSpeedTest` function of `TRTCCloud`. The speed test result will be called back through the callback function.

   

【Objective-C】
``` objectivec
// Sample code for starting speed testing. `sdkAppId` and `UserSig` are required. For how to get them, see Basic Features.
// The example below starts after login.
- (void)onLogin:(NSString *)userId userSig:(NSString *)userSid 
{
    TRTCSpeedTestParams *params;
    // `sdkAppID` is the actual application ID obtained from the console.
    params.sdkAppID = sdkAppId;
    params.userID = userId;
    params.userSig = userSig;
    // Expected upstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    params.expectedUpBandwidth = 5000;
    // Expected downstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    params.expectedDownBandwidth = 5000;
    [trtcCloud startSpeedTest:params];
}
- (void)onSpeedTestResult:(TRTCSpeedTestResult *)result {
    // The speed test result will be called back after the test is completed
}
```

【Java】
``` java
// Sample code for starting speed testing. `sdkAppId` and `UserSig` are required. For how to get them, see Basic Features.
// The example below starts after login.
public void onLogin(String userId, String userSig) 
{
  TRTCCloudDef.TRTCSpeedTestParams params = new TRTCCloudDef.TRTCSpeedTestParams();
  params.sdkAppId = GenerateTestUserSig.SDKAPPID;
  params.userId = mEtUserId.getText().toString();
  params.userSig = GenerateTestUserSig.genTestUserSig(params.userId);
  params.expectedUpBandwidth = Integer.parseInt(expectUpBandwidthStr);
  params.expectedDownBandwidth = Integer.parseInt(expectDownBandwidthStr);
    // `sdkAppID` is the actual application ID obtained from the console.
    trtcCloud.startSpeedTest(params);
}

// Listen for the test result. Inherit `TRTCCloudListener` and implement the following method.
void onSpeedTestResult(TRTCCloudDef.TRTCSpeedTestResult result)
{
    // The speed test result will be called back after the test is completed
}
```

【C++】
``` cpp
// Sample code for starting speed testing. `sdkAppId` and `UserSig` are required. For how to get them, see Basic Features.
// The example below starts after login.
void onLogin(const char* userId, const char* userSig)
{
    TRTCSpeedTestParams params;
    // `sdkAppID` is the actual application ID obtained from the console.
    params.sdkAppID = sdkAppId;
    params.userId = userid;
    param.userSig = userSig;
    // Expected upstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    param.expectedUpBandwidth = 5000;
    // Expected downstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    param.expectedDownBandwidth = 5000;
    trtcCloud->startSpeedTest(params);
}

// Listen for the testing result
void TRTCCloudCallbackImpl::onSpeedTestResult(
             const TRTCSpeedTestResult& result)
{
    // The speed test result will be called back after the test is completed
}
```

【C#】
``` csharp
// Sample code for starting speed testing. `sdkAppId` and `UserSig` are required. For how to get them, see Basic Features.
// The example below starts after login.
private void onLogin(string userId, string userSig)
{
    TRTCSpeedTestParams params;
    // `sdkAppID` is the actual application ID obtained from the console.
    params.sdkAppID = sdkAppId;
    params.userId = userid;
    param.userSig = userSig;
    // Expected upstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    param.expectedUpBandwidth = 5000;
    // Expected downstream bandwidth in Kbps. Value range: 10–5000. 0 indicates not to test
    param.expectedDownBandwidth = 5000;
    mTRTCCloud.startSpeedTest(params);
}

// Listen for the testing result
public void onSpeedTestResult(TRTCSpeedTestResult result)
{
    // The speed test result will be called back after the test is completed
}
```

- **Speed Test Tool**

   If you do not want to call the interface to measure the network speed, you can use the network speed test tool for PC provided by TRTC to quickly get the network quality details. Choose the following program according to your platform to download.

   The program provides two test options: quick test and continuous test.

   [Mac](https://liteav.sdk.qcloud.com/customer/%E6%B5%8B%E8%AF%95/%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7/trtc-network-tools-latest.dmg) ｜[Windows](https://liteav.sdk.qcloud.com/customer/%E6%B5%8B%E8%AF%95/%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7/trtc-network-tools_Setup_latest.exe)

   |Metric|Description|
   |---------|---------|
   |WiFi Quality|Wi-Fi signal reception quality|
   |DNS RTT|Tencent Cloud testing domain DNS round-trip time (RTT)|
   |MTR|MTR is a network speed test tool, which can detect the packet loss rate and latency between client and TRTC node and display the details of each hop in the route|
   |UDP Loss|UDP packet loss rate between client and TRTC node|
   |UDP RTT|UDP latency between client and TRTC node|
   |Local RTT|Latency between client and local gateway|
   |Upload|Estimated upstream bandwidth|
   |Download|Estimated downstream bandwidth|

## Detect Network Quality During the Call

TRTC provides the `onNetworkQuality` callback to report the current network quality once every two seconds. It contains two parameters: `localQuality` and `remoteQuality`.
- The **localQuality** indicates your current network quality, which has six levels: Excellent, Good, Poor, Bad, VeryBad, and Down.

- The **remoteQuality** is an array indicating the network quality of remote users. In this array, each element represents the network quality of a remote user.

   |Quality|Name|Description|
   |---------|---------|---------|
   |0|Unknown|Unknown|
   |1|Excellent|The current network is excellent.|
   |2|Good|The current network is good.|
   |3|Poor|The current network is fine.|
   |4|Bad|The current network is poor, and there may be obvious stuttering and delay.|
   |5|VeryBad|The current network is very poor, and TRTC can merely sustain the connection but cannot guarantee the communication quality.|
   |6|Down|The current network cannot meet the minimum requirements of TRTC, and it is impossible to have a normal audio/video call.|

   You only need to listen for `onNetworkQuality` of TRTC and display the corresponding prompt on the UI.

   

【Android】
``` java
// Listen for the `onNetworkQuality` callback to get the change of the current network conditions
@Override
public void onNetworkQuality(TRTCCloudDef.TRTCQuality localQuality,
                             ArrayList<TRTCCloudDef.TRTCQuality> remoteQuality)
{
    // Get your local network quality
    switch(localQuality) {
        case TRTCQuality_Unknown:
            Log.d(TAG, "SDK has not yet sensed the current network quality.");
            break;
        case TRTCQuality_Excellent:
            Log.d(TAG, "The current network is very good.");
            break;
        case TRTCQuality_Good:
            Log.d(TAG, "The current network is good.");
            break;
        case TRTCQuality_Poor:
            Log.d(TAG, "The current network quality barely meets the demand.");
            break;
        case TRTCQuality_Bad:
            Log.d(TAG, "The current network is poor, and there may be significant freezes and call delays.");
            break;
        case TRTCQuality_VeryBad:
            Log.d(TAG, "The current network is very poor, the communication quality cannot be guaranteed");
            break;
        case TRTCQuality_Down:
            Log.d(TAG, "The current network does not meet the minimum requirements.");
            break;
        default:
            break;
    }
    // Get the network quality of remote users
    for (TRTCCloudDef.TRTCQuality info : arrayList) {
        Log.d(TAG, "remote user : = " + info.userId + ", quality = " + info.quality);
    }
}
```

【iOS & Mac】
``` objectivec
// Listen for the `onNetworkQuality` callback to get the change of the current network conditions
- (void)onNetworkQuality:(TRTCQualityInfo *)localQuality remoteQuality:(NSArray<TRTCQualityInfo *> *)remoteQuality {
    // Get your local network quality
    switch(localQuality.quality) {
        case TRTCQuality_Unknown:
            NSLog(@"SDK has not yet sensed the current network quality.");
            break;
        case TRTCQuality_Excellent:
            NSLog(@"The current network is very good.");
            break;
        case TRTCQuality_Good:
            NSLog(@"The current network is good.");
            break;
        case TRTCQuality_Poor:
            NSLog(@"The current network quality barely meets the demand.");
            break;
        case TRTCQuality_Bad:
            NSLog(@"The current network is poor, and there may be significant freezes and call delays.");
            break;
        case TRTCQuality_VeryBad:
           NSLog(@"The current network is very poor, the communication quality cannot be guaranteed");
            break;
        case TRTCQuality_Down:
            NSLog(@"The current network does not meet the minimum requirements.");
            break;
        default:
            break;
    }
    // Get the network quality of remote users
    for (TRTCQualityInfo *info in arrayList) {
        NSLog(@"remote user : = %@, quality = %@", info.userId, @(info.quality));
    }
}

```

【Windows】
``` cpp
// Listen for the `onNetworkQuality` callback to get the change of the current network conditions
void onNetworkQuality(liteav::TRTCQualityInfo local_quality,
    liteav::TRTCQualityInfo* remote_quality, uint32_t remote_quality_count) {
    // Get your local network quality
    switch (local_quality.quality) {
    case TRTCQuality_Unknown:
        printf("SDK has not yet sensed the current network quality.");
        break;
    case TRTCQuality_Excellent:
        printf("The current network is very good.");
        break;
    case TRTCQuality_Good:
        printf("The current network is good.");
        break;
    case TRTCQuality_Poor:
        printf("The current network quality barely meets the demand.");
        break;
    case TRTCQuality_Bad:
        printf("The current network is poor, and there may be significant freezes and call delays.");
        break;
    case TRTCQuality_Vbad:
        printf("The current network is very poor, the communication quality cannot be guaranteed");
        break;
    case TRTCQuality_Down:
        printf("The current network does not meet the minimum requirements.");
        break;
    default:
        break;
    }
    // Get the network quality of remote users
    for (int i = 0; i < remote_quality_count; ++i) {
        printf("remote user : = %s, quality = %d", remote_quality[i].userId, remote_quality[i].quality);
    }
}
```

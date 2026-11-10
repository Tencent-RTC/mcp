---
sync_node_id: '134687906906382336'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "感知网络质量"
  - "Flutter"
product: "trtc"
---
This document primarily discusses how to perceive the quality of the current network.

## Check network quality during the call

TRTC offers a callback event known as **onNetworkQuality**, which reports the current network quality to you every two seconds. Its parameters include two parts: localQuality and remoteQuality.
- **localQuality**: Represents your current network quality, divided into 6 levels, which are Excellent, Good, Poor, Bad, VeryBad, and Down.

- **remoteQuality**: Represents the network quality of remote users. This is an array, each Element (XML) in the array represents the network quality of a remote user.

   |Quality|Description|
   |---------|---------|
   |unknown|Unperceived|
   |excellent|The present network is exceedingly good|
   |good|The current network is fairly good|
   |poor|Current network is average|
   |bad|Present network quality is poor, it might cause noticeable stutters and communication delays|
   |vBad|The current network conditions are abysmal, TRTC can barely maintain a connection, yet it can't guarantee the quality of communication|
   |down|The current network does not meet the minimum requirements of TRTC, obstructing the normal audio and video conversation|

   All you need is to monitor TRTC's onNetworkQuality and make corresponding prompts on the interface:

   ``` java
   TRTCCloudListener(
       onNetworkQuality: (localQuality, remoteQuality) {
         switch(localQuality.quality) {
           case TRTCQuality.unknown:
             //TODO: Handle this case.
             break;
           case TRTCQuality.excellent:
             // TODO:Handle this case
             break;
           case TRTCQuality.good:
             // TODO: Handle this case.
             break;
           case TRTCQuality.poor:
             // TODO: Handle this case.
             break;
           case TRTCQuality.bad:
             // TODO: Handle this case.
             break;
           case TRTCQuality.vBad:
             // TODO: Handle this case.
             break;
           case TRTCQuality.down:
             // TODO: Handle this case.
             break;
         }
         
         for (TRTCQualityInfo info in remoteQuality) {
           // TODO: Handle this case.
         }
       }
   );
   ```

## 

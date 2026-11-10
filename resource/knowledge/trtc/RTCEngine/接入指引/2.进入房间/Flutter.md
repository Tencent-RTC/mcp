---
sync_node_id: '134687888671592448'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "2. 进入房间"
  - "Flutter"
product: "trtc"
---
This document describes how to enter a TRTC room. Only after entering an audio/video room can a user subscribe to the audio/video streams of other users in the room or publish his or her own audio/video streams.

## Call Guidelines

### Step 1: Import SDK and Configure App Permissions

Please refer to the document [ Import SDK into the project ](https://www.tencentcloud.com/document/product/647/35098) to complete the SDK import.

### Step 2: Create an SDK instance and set an event listener

Invoke various platform initialization interfaces to create the object instance of TRTC.
``` java
// Create a TRTCCloud singleton
trtcCloud = (await TRTCCloud.sharedInstance())!;
// Register TRTC event callback
trtcCloud.registerListener(onRtcListener);
```

### Step 3. Listen for SDK events

You can use callback APIs to listen for errors, warnings, traffic statistics, network quality, as well as various audio/video events of the SDK.
``` java
// We need to define a method to handle event callbacks, processing appropriately based on the type of the received event.
// Taking onError as an example
trtcCloud.registerListener(onRtcListener);

onRtcListener(type, param) async {
  if (type == TRTCCloudListener.onError) {
    if (param['errCode'] == -1308) {
      MeetingTool.toast('Failed to initiate screen recording', context);
    } else {
      showErrordDialog(param['errMsg']);
    }
  }
}
```

### Step 4: Prepare the TRTCParams for entering the room

When calling the enterRoom interface, two key parameters need to be filled, namely `TRTCParams` and the application scene. A detailed introduction is as follows:

#### Parameter one: scene

This parameter refers to the specific application scene, whether it be **video calls, interactive video broadcasting, audio calls**, or **interactive audio broadcasting**:
| Scenario Type | Scenario Introduction |
| --- | --- |
| TRTC_APP_SCENE_VIDEOCALL | Within the context of video calling, 720p and 1080p high-definition image quality is supported. A single room can accommodate up to 300 simultaneous online users, with a maximum of 50 users speaking at the same time. |
| TRTC_APP_SCENE_LIVE | In the context of interactive video broadcasting, the mic can be smoothly turned on/off without switching latency, with host latency as low as 300 milliseconds. Supports live streaming for hundreds of thousands of concurrent viewers, with playback delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you need to specify the current user's role using the 'role' field in TRTCParams. |
| TRTC_APP_SCENE_AUDIOCALL | In the audio call context, it supports 48 kHz duplex audio calls. A single room accommodates up to 300 concurrent online users, with a maximum of 50 people speaking at once. |
| TRTC_APP_SCENE_VOICE_CHATROOM | In the context of interactive audio live streaming, microphones can be switched on and off smoothly without delay. The host experiences a low latency of fewer than 300 milliseconds. It accommodates hundreds of thousands concurrent viewer users, with the broadcast delay reduced to 1000 milliseconds.<br><strong>Note</strong>: In this scenario, you need to specify the current user's role using the 'role' field in TRTCParams. |

#### Parameter 2: TRTCParams

TRTCParams is composed of numerous parameters, but typically, your attention could be principally directed towards filling out the following parameters:

|Parameter name<br>|Field Description<br>|Supplementary Information<br>|Data Type<br>|Example<br>|
|---------|---------|---------|---------|---------|
|sdkAppId<br>|Application ID<br>|You can locate the SDKAppID within the [Tencent Real-Time Communication console](https://console.trtc.io/), if not present, click on the "Create Application" button to institute a new application.<br>|Number<br>|1400000123<br>|
|userId<br>|User ID<br>|It can contain only letters, digits, underscores, and hyphens. In TRTC, a user cannot use the same user ID to enter the same room on two different devices at the same time.<br>|String<br>|"denny" or "123321"<br>|
|userSig<br>|The authentication ticket needed to enter a room<br>|You can calculate userSig using the SDKAppID and userId. Please refer to [ Calculating and Using UserSig](https://intl.cloud.tencent.com/document/product/647/35166) for the calculation method.<br>|String<br>|eJyrVareCeYrSy1SslI...<br>|
|roomId<br>|Room ID<br>|Numeric type 'Room ID'. Be aware, if you wish to utilize a character sequence as the Room ID, please resort to the **strRoomId** field, rather than the roomId field, as strRoomId and roomId should not be used interchangeably.<br>|Number<br>|29834<br>|
|strRoomId<br>|Room ID<br>|Room ID of string type. Note that `strRoomId` and `roomId` shouldn't be used interchangeably, as to the TRTC backend service, "123" and 123 are not the same room.<br>|String<br>|"29834"<br>|
|role<br>|Roles<br>|Divided into "Anchor" and "Audience" roles, this field only needs to be specified when the TRTCAppScene is designated as `TRTCAppSceneLIVE` or `TRTCAppSceneVoiceChatRoom`, these two live streaming scenarios.<br>|Enumeration<br>|TRTCRoleAnchor or TRTCRoleAudience<br>|

> **Note:**
> - TRTC does not support the simultaneous entry of the same userId on two different devices. Doing so could lead to interference.
> - Each endpoint in the application scenario, appScene, must be unified to prevent unpredictable issues from cropping up.

### Step 5: Enter the room (enterRoom)

After preparing the two parameters from Step 4 (application scenario and TRTCParams), you can call the enterRoom function to enter the room.
``` java
enterRoom() async {
  try {
    userInfo['userSig'] =
        await GenerateTestUserSig.genTestSig(userInfo['userId']);
    meetModel.setUserInfo(userInfo);
  } catch (err) {
    userInfo['userSig'] = '';
    print(err);
  }
  // If your scenario is "interactive video live broadcast", please set the scene to TRTC_APP_SCENE_LIVE, and set the appropriate value for the role field in TRTCParams.
  await trtcCloud.enterRoom(
      TRTCParams(
          sdkAppId: GenerateTestUserSig.sdkAppId,
          userId: userInfo['userId'],
          userSig: userInfo['userSig'],
          role: TRTCCloudDef.TRTCRoleAnchor,
          roomId: meetId!),
      TRTCCloudDef.TRTC_APP_SCENE_LIVE);
}
```

**Event Callback**
If room entry is successful, SDK will return the onEnterRoom(result) event where result is a positive number, indicating the time consumed to join the room in milliseconds (ms).
If room entry fails, SDK will also call back the onEnterRoom(result) event, but the parameter `result` will be a negative number, representing the error code of room entry failure.
``` java
//Listen for SDK's onEnterRoom event to check if room entry is successful or not
onRtcListener(type, param) async {
  if (type == TRTCCloudListener.onEnterRoom) {
    if (param > 0) {
      MeetingTool.toast('Enter room success', context);
    }
  }
}
```

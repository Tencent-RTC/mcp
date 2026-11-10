---
sync_node_id: '134687897347563520'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "4. 发布音视频流"
  - "Flutter"
product: "trtc"
---
This document describes how an anchor publishes audio/video streams. "Publishing" refers to turning on the mic and camera to make the audio heard and video seen by other users in the room.

## Call Guidelines

### Step 1. Perform prerequisite steps

Refer to the document [Import SDK into the project](https://www.tencentcloud.com/document/product/647/35098) to accomplish the import of SDK and for the configuration of App permissions.

### Step 2. Enable camera preview

You can call the **startLocalPreview** API to enable camera preview. At this point, the SDK will request usage permission from the system and the camera's capturing process will begin after user authorization.

If you wish to set the rendering parameters for the local image, you can use the **setLocalRenderParams** API. To prevent image flickering from occuring due to setting preview parameters after the preview starts, it's recommended to call this before initiating the preview.

If you want to control various camera parameters, you can use the **TXDeviceManager** API, which allows operations such as "switching between cameras", "setting focus mode","turning the flash on or off", amongst others.

If you wish to adjust the beauty filter effect and image quality, this will be detailed in Setting Image Quality.
``` java
// Set the rendering parameters of local preview: Flip the video horizontally and use the fill mode
trtcCloud.setLocalRenderParams(TRTCRenderParams(
    fillMode: TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL
    mirrorType: TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_ENABLE);
    
// Initiate preview for the local camera (`viewId` denotes the unique view identifier granted during the `onViewCreated` function call in the `TRTCCloudVideoView` creation procedure)
trtcCloud.startLocalPreview(isFrontCamera, viewId);

// Use `TXDeviceManager` to enable autofocus and turn on the flash
bool? isAutoFocusEnabled = await manager.isAutoFocusEnabled();
if (isAutoFocusEnabled ?? false) {
  manager.enableCameraAutoFocus(true);
}
manager.enableCameraTorch(true);
```

### Step 3. Enable mic capture

You may invoke **startLocalAudio** to initiate microphone acquisition, this interface requires you to establish a collection pattern via the `quality` parameter. Although named quality, it does not denote that a higher value yields superior results, different business scenarios require specific parameter selection (a more accurate name would be 'scene').
- **TRTC_AUDIO_QUALITY_SPEECH**
Under this pattern, the SDK's audio module centers on refining speech signals, strives to filter ambient noise to the highest degree possible, and the audio data will also attain optimal resistance against poor network quality. Thus, this pattern proves particularly useful for scenarios emphasizing vocal communication, such as "video conferencing" and "online meetings".

- **TRTC_AUDIO_QUALITY_MUSIC**
Under this pattern, the SDK will employ a high level of audio processing bandwidth and stereoscopic pattern, which while maximizing the collection quality will also condition the audio's DSP processing module to the weakest level, ensuring the audio quality to the fullest extent. Therefore, this pattern is suitable for "music live broadcast" scenarios, and is especially beneficial for hosts making use of professional sound cards for music live broadcasts.

- **TRTC_AUDIO_QUALITY_DEFAULT**
Under this pattern, the SDK will activate Intelligent Identification algorithm to recognise the current environment and choose the most appropriate handling pattern accordingly. However, even the best detection algorithms are not always accurate, so if you have a clear understanding of the positioning of your product, it is more recommended for you to choose between the Speech focused 'SPEECH' and the music quality focused 'MUSIC'.

   ``` java
   // Enable mic capture and set `quality` to `SPEECH` (strong in noise suppression and adapts well to poor network conditions)
   trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH );
   
   // Enable mic capture and set `quality` to `MUSIC` (high fidelity, minimum audio quality loss, recommended if a high-end sound card is used)
   trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_MUSIC);
   ```

### Step 4. Enter a TRTC room

. After successfully entering the room, the SDK will begin to publish its own audio stream to other users in the room.

> **Note:**
> Naturally, you can turn on the camera preview and microphone capture after entering the room (enterRoom). However, in live broadcast situations, we need to give the host some time to test the microphone and adjust the beauty filter. Therefore, it is more common to start the camera and the microphone before entering the room.
> 

``` java
// Create a TRTCCloud singleton
trtcCloud = (await TRTCCloud.sharedInstance())!;
// Register TRTC event callback
trtcCloud.registerListener(onRtcListener);

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

### Step 5. Switch the role

**"role" in TRTC**
- In the "Video Call" (TRTC_APP_SCENE_VIDEOCALL) and "Voice Call" (TRTC_APP_SCENE_AUDIOCALL) scenarios, there is no necessity to establish a role upon entering the room, for in these two patterns, each participant is inherently designated as an Anchor.

- In the contexts of both "Video Broadcasting" (TRTC_APP_SCENE_LIVE) and "Voice Broadcasting" (TRTC_APP_SCENE_VOICE_CHATROOM), every user needs to designate their specific "role" upon entering a room. They either become an "Anchor" or an "Audience Member".

   **Role Transition**
Within the framework of TRTC, only the "Anchor" possesses the authority to disseminate audio and video streams. The "Audience" lacks this permission.
Consequently, should you opt for the 'Audience' role upon entering the room, it necessitates an initial invocation of the **switchRole** interface to transform your role into an "Anchor", followed by the dissemination of audio and video streams, colloquially known as 'going live'.

   ``` java
   // If your current role is audience, you need to call `switchRole` first to switch to anchor
   // If your current role is 'audience', you need to call switchRole to switch to 'anchor' first
   trtcCloud.switchRole(TRTCCloudDef.TRTCRoleAnchor);
   trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT);
   trtcCloud.startLocalPreview(true, cameraVideo);
   
   // If role switch failed, the error code of the `onSwitchRole` callback is not `0`
   // If switching operation failed, the error code of the 'onSwitchRole' is not zero
   onRtcListener(type, param) async {
     if (type == TRTCCloudListener.onSwitchRole) {
       if (param['errCode'] != 0) {
         // TO DO
       }
     }
   }
   ```

   > **Note:**
   > 
   > If there are already too many hosts in the room, it can lead to a switchRole role change failure, and the error code will be called back to you through TRTC's onSwitchRole as a notification. Therefore, when you no longer need to broadcast audio and video streams (commonly referred to as "stepping down"), you need to call switchRole again and switch to "Audience".
   > 

   > **Note:**
   > 
   > You may have a query: if only the host can publish the audio-video streams, wouldn't it be possible for every user to step into the room using the host's role? The answer is certainly no. The rationale can be explored in the advanced guide What's the maximum number of simultaneous audio and video streams that can be facilitated in a single room?
   > 

## Advanced Guide

### 1. How many concurrent audio/video streams can a room have at most?

In the confines of a TRTC room, it is permissible to maintain a maximum of **50** synchronized audio-visual streams; any excess streams will be discarded based on the principle of "first come, first served".
Under the majority of scenarios, ranging from video calls between two individuals to online live broadcasts watched by tens of thousands simultaneously, the provision of 50 concurrent audio-visual streams would suffice for the needs of application scenarios. However, satisfying this precondition necessitates the proper administration of the **role management**.

"Role management" refers to how roles are assigned to users entering a room.
- Should a user hold the role of an "Anchor" in a live broadcasting scenario, a "Teacher" in an online education setting, or a "Host" in an online conference scenario, they can all be assigned the role of "Anchor".

- If a user is inherently an "audience" in a live streaming scenario, a "student" in an online education scenario, or an "observer" in an online meeting scenario, they should be delegated to the "Audience" role. Otherwise, their overwhelming number could instantaneously "overload" the limit of the host's count.

   Only when the "audience" needs to broadcast audio and video streams ("going on mic"), do they need to switch to the "anchor" role through switchRole. As soon as they no longer need to broadcast audio and video streams ("off mic"), they should immediately switch back to the audience role.

   Through adept role management, you will discover that the number of 'broadcasters' that need to concurrently transmit audio and video streams in a room typically does not exceed 50. Otherwise, the entire room would descend into a state of 'chaos', bear in mind, once the number of simultaneous voices exceeds 6, it becomes rather difficult for the common person to discern who precisely is speaking.

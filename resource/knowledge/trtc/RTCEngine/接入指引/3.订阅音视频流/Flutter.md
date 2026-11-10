---
sync_node_id: '134687893414526976'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "3. 订阅音视频流"
  - "Flutter"
product: "trtc"
---
This document primarily elucidates the process of subscribing to the audio and video streams of other users in a room, essentially illustrating how to play others' audio and video. For the sake of convenience, throughout the remainder of this document, we will collectively .

## Call Guidelines

### Step 1. Perform prerequisite steps

Refer to the document [Import SDK into the project](https://www.tencentcloud.com/document/product/647/35098) to accomplish the import of SDK and for the configuration of App permissions.

### Step 2. Set the subscription mode (optional)

You can set the subscription mode by calling **setDefaultStreamRecvMode** interface in TRTCCloud. TRTC provides two subscription modes:
- Automatic subscription: The SDK automatically plays remote users' audios. This is the default subscription mode.

- Manual subscription: The SDK does not automatically pull and play the audio of remote users. You need to manually invoke **muteRemoteAudio(userId, false)** to trigger the playback of the audio.

   > **Note:**
   > 
   > It is important to note that it's perfectly fine if you don't invoke setDefaultStreamRecvMode; by default, the SDK is set to automatic subscription. However, if manual subscription is preferred, ensure that setDefaultStreamRecvMode is invoked before entering a room as it only takes effect when done so.
   > 

### Step 3. Enter a TRTC room

Follow the instructions in Entering a Room to allow a user to enter a TRTC room. The user can only subscribe to the audio or video streams of other users after successfully entering the room.

### Step 4. Play the audio of a remote user

You have the option to mute or unmute a specified user by invoking the muteRemoteAudio interface.
``` java
// Mute user with id denny
trtcCloud.muteRemoteAudio('denny', true);
// Unmute user with id denny
trtcCloud.muteRemoteAudio('denny', false);
```

### Step 5. Play the video of a remote user

#### 1. Initiate and Terminate Playback (startRemoteView + stopRemoteView)

You are able to initiate the projection of the video image of remote users by invoking the startRemoteView API. However, the precondition is that you need to pass a view object to the SDK to serve as the rendering control for the user's video image.

The first parameter of startRemoteView is the userId of the remote user, the second is the stream type of the remote user, the third is the view object that you need to pass. Among them, the second parameter streamType has three optional values, which are:
- `TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG` : This signifies the primary stream of the user, typically used to transmit the image from the user's camera.

- `TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB` : This represents the auxiliary stream of the user, generally used to transmit the screen sharing image of the user.

- `TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL` :  Pertaining to the user's low-resolution thumbnail image, this nomenclature is relative to the primary route image. It is only after the remote user has tacitly enabled "dual-channel encoding (enableEncSmallVideoStream)", we can then render their low-resolution image. Notwithstanding, a choice must be made between the primary route image and the low-resolution thumbnail - only one can be utilized simultaneously.

   By calling the stopRemoteView interface, you can stop playing the video of a specific remote user or halt all video playbacks from remote users through the stopAllRemoteView interface.

   ``` java
   // Rendering the video output from Denny's camera (aptly referred to by us as the "primary route image")
   trtcCloud.startRemoteView('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, cameraViewId);
   // Displaying the screen that Denny shares (which we term as the "auxiliary route image")
   trtcCloud.startRemoteView('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB, screenViewId);
   // Play back the lower quality video of `denny` (The original and lower quality streams cannot be played back at the same time)
   trtcCloud.startRemoteView('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL, cameraViewId);
   // Stop playing back the camera image of `denny`
   trtcCloud.stopRemoteView('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, cameraViewId);
   // Stop the playback of all video footages
   trtcCloud.stopAllRemoteView();
   ```

#### 2. Set playback parameters (updateRemoteView + setRemoteRenderParams)

By invoking the updateRemoteView API, you can modify the view object while playing, which is very useful when switching video rendering controls.
By using setRemoteRenderParams, you can configure the screen's fill mode, rotation angle and mirror settings.
- Fill mode: You can use the fill mode or fit mode. In both modes, the original image aspect ratio is not changed. The difference is whether black bars are displayed.

- Rotation angle: You can set the rotation angle to 0, 90, 180, or 270 degrees.

- Mirror mode: Indicates whether to flip the image horizontally.

   ``` java
   // Switch the primary view of `denny` to a floating mini-window (assuming the mini-window is `miniFloatingView`)
   trtcCloud.updateRemoteView('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG,miniFloatingViewId);
   
   // Rotate the primary view of the remote user `denny` 90 degrees clockwise, set it to fill mode, and forcibly disable the mirror mode
   TRTCRenderParams params = TRTCRenderParams(
                       rotation: TRTCCloudDef.TRTC_VIDEO_ROTATION_90,
                       fillMode: TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL,
                       mirrorType: TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_DISABLE);
   trtcCloud.setRemoteRenderParams('denny', TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, params);
   ```

### Step 6. Get the audio/video status of a remote user in the room

In Steps 4 and 5, you can control the playback of audio and video from remote users, but without sufficient information, you would not ascertain:
- What users are in the current room

- Whether they have turned on their cameras and microphones?

   To solve this problem, you need to listen for the following event callbacks from the SDK:

   
**Notification of Audio Status Change(onUserAudioAvailable)**
You can monitor the status change when the remote user turns the microphone on or off by listening to onUserAudioAvailable(userId,bool).

**Notification of Video Status Change(onUserVideoAvailable)**
You can monitor the status change when the remote user activates or deactivates the camera feed by listening to onUserVideoAvailable(userId,bool).
You can likewise monitor the status change when the remote user enables or disables screen sharing by listening onUserSubStreamAvailable(userId,bool).

**Notification of User Joining and Leaving the Room(onRemoteUserEnter/onRemoteUserLeaveRoom)**
When a remote user enters the current room, you can get his/her userId through onRemoteUserEnterRoom(userId). When a remote user leaves the room, you can understand the userId of this user and his/her reasons for leaving through onRemoteUserLeaveRoom(userId, reason).

> **Note:**
> To put it precisely, onRemoteUserEnter/LeaveRoom can only perceive the notification of the entry and exit of users who are cast as anchors. Such design is purposed to prevent the so-called 'signaling storm' attack caused by the frequent entry and exit of people, particularly when the online audience inside a room is quite substantial.
> 

> **Note:**
> In Dart, we receive and process callbacks of the TRTC SDK through a method, which is categorized as ListenerValue, the parameter that needs to be inputted in registerListener. ListenerValue has two parameters, representing the callback type 'type' and 'params', the parameters of the callback returned by the SDK.
> 

With these event webhooks, you can grasp which users are in the room as well as whether they have turned on their cameras and microphones. . In this piece of exemplary code, we have employed userList, cameraUserList, and microphoneUserList to separately maintain:
- What users (anchors) are in the room

- Which users have turned on their cameras

- Which users have turned on their mics

   ``` java
   onRtcListener(type, param) async {
     if (type == TRTCCloudListener.onUserAudioAvailable) {
       String userId = param['userId'];
       bool available = param['available'];
       available ? microphoneUserList.add(userId) : microphoneUserList.remove(userId);
     }
     if (type == TRTCCloudListener.onUserVideoAvailable) {
       String userId = param['userId'];
       bool available = param['available'];
       available ? cameraUserList.add(userId) : cameraUserList.remove(userId);
     }
     if (type == TRTCCloudListener.onRemoteUserEnterRoom) {
       userList.add({
         'userId': param
       });
     }
     if (type == TRTCCloudListener.onRemoteUserLeaveRoom) {
       String userId = param['userId'];
       userList.removeWhere((user) => user['userId'] == userId);
     }
   }
   ```

## Advanced Guide

### 1. Both are "mute", what is the difference?

As your business requirements continually deepen, you will discover three distinct types of 'silence'. Although they are all termed 'silence', their counting principles are entirely distinct:
- **First method: The player stops Subscription to the audio stream**
If you call the muteRemoteAudio("denny", true) function, it indicates your desire to cease hearing the audio of remote user 'denny'. At this point, the SDK will stop fetching the data stream of denny's audio. This pattern is more bandwidth-efficient. However, should you wish to hear denny's audio again, the SDK needs to initiate the process of fetching the audio data anew. Therefore, the transition from 'mute' to 'unmute' states can be a rather slow process.

- **The second approach: adjust the playback volume to zero**
If your business scenario requires a faster response for mute switching, you can set the playback volume of the remote user 'Denny' to zero using setRemoteAudioVolume("denny", 0). Since this interface does not involve network operations, the effect is exceptionally swift.

- **The third case: the remote user turns off the microphone themselves**
All the operations introduced in this document pertain to the instruction of the playback end and their effects only apply to the current user. For instance, if you mute a remote user 'Denny' through the function muteRemoteAudio("denny", true), the voice of 'Denny' can still be heard by other users in the room.
In order to effectively "silence" Denny, it would be necessary to influence Denny's audio publishing behavior. We will discuss this in detail in our following document titled Relay of audio and video streams.

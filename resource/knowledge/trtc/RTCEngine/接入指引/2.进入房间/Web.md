---
sync_node_id: '89644534370451456'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "2. 进入房间"
  - "Web"
product: "trtc"
---
This document describes how to enter a TRTC room. Only after entering an audio/video room can a user subscribe to the audio/video streams of other users in the room or publish his or her own audio/video streams.

## SDK Usage Overview
1. Call the [`TRTC.create()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.create) method to create the [`trtc`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html) object.

2. Call the [`trtc.enterRoom()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom) method to enter the room, then other users will receive the [TRTC.EVENT.REMOTE_USER_ENTER](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_USER_ENTER) event.

3. After entering the room, you can turn on the camera and microphone and publish them to the room.

   - Call the [`TRTC.startLocalVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalVideo) method to turn on the camera and publish it to the room.

   - Call the [`TRTC.startLocalAudio()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startLocalAudio) method to turn on the microphone and publish it to the room.

4. When a remote user publishes audio and video, the SDK will automatically play the remote audio by default. You need to play the remote video by:

   - Listen for the [TRTC.EVENT.REMOTE_VIDEO_AVAILABLE](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_VIDEO_AVAILABLE) event before entering the room to receive all remote user video publishing events.

   - In the event callback function, call the [`trtc.startRemoteVideo()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startRemoteVideo) method to play the remote video.

      

## Step 1. Creating a TRTC object       

[`TRTC`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html) class, whose instance represents a local client. The object methods of TRTC provide functions such as joining a call room, previewing a local camera, publishing a local camera and microphone, and playing remote audio and video.

Create a [`TRTC`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html) object through the [`TRTC.create()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#.create) method
``` javascript
const trtc = TRTC.create();
```

> **Note:**
> If you use the Vue3 framework, it is necessary to use markRaw to mark the trtc instance in order to avoid the conversion of trtc into the Proxy object by Vue, which may cause some unexpected problems.  
> 

> `import { markRaw } from 'vue';`
> `const trtc = markRaw(TRTC.create()); `

## Step 2. Entering the room

Call the [`trtc.enterRoom()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom) method to enter the room. Usually called in the click callback of the `Start Call` button.
Key parameters:
| Name | Description | Type | Example |
| --- | --- | --- | --- |
| sdkAppId | The sdkAppId of the audio and video application you created on Tencent Cloud. | number | 1400000123 |
| userId | It is recommended to limit the length to 32 bytes, and only allow uppercase and lowercase English letters (a-zA-Z), numbers (0-9), underscores, and hyphens. | string | "mike" |
| userSig | User signature, refer to <a href="https://www.tencentcloud.com/document/product/647/35166?lang=en&pg=">UserSig</a>. | string | eJyrVareCeYrSy1SslI... |
| roomId | Numeric type roomId. The value must be an integer between 1 and 4294967294.<br>If you need to use a string type roomId, please use the <code>strRoomId</code> parameter. One of <code>roomId</code> and <code>strRoomId</code> must be passed in. If both are passed in, the roomId will be selected first. | number | 29834 |
| strRoomId | String type roomId. The length is limited to 64 bytes, and only supports the following characters:<br>- Uppercase and lowercase English letters (a-zA-Z)<br>- Numbers (0-9)<br>- Space ! # $ % & ( ) + - : ; < = . > ? @ [ ] ^ _ { } \\|<br>Note: It is recommended to use a numeric type roomId. The string type room id "123" is not the same room as the numeric type room id 123. | string | "29834" |
| scene | - <code>rtc</code>：Real-time call scene.<br>- <code>live</code>：Interactive live streaming scene | string | 'rtc' or 'live' |
| role | User role, only works for <code>live</code> scene<br>- <code>anchor</code><br>- <code>audience</code> The audience role does not have the permission to publish local audio and video, only the permission to watch remote streams.<br>If the audience wants to interact with the anchor by connecting to the microphone, please switch the role to the anchor through <a href="https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#switchRole">trtc.switchRole()</a> before publishing local audio and video. | string | 'anchor' or 'audience' |

For more detailed parameter descriptions, refer to the interface document [`trtc.enterRoom()`](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#enterRoom).
<iframe src="https://web.sdk.qcloud.com/trtc/webrtc/v5/test/qer/userSig.html" height="150" width="100%" allow="microphone;camera;">
  <p>您的浏览器不支持  iframe 标签。</p>
</iframe>

``` javascript
try {
  await trtc.enterRoom({
    roomId: 8888,
    scene:'rtc',
    sdkAppId: 20010561,
    userId: 1234,
    userSig: '5aa35a2a7c2deeef129e97efe2e4388a13125719f4156ef05d869887296b69aa'
  });
  console.log('Entered the room successfully');
} catch (error) {
  console.error('Failed to enter the room ' + error);
}
```

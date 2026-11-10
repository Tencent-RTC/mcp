---
sync_node_id: '89644534886350848'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "6. 进阶指引"
  - "开启屏幕分享"
  - "Web"
product: "trtc"
---
## Function Description

This article mainly introduces how to implement screen sharing in TRTC Web SDK.

## Implementation Process
1. Start Local Screen Sharing

   ``` javascript
   const trtcA = TRTC.create();
   await trtcA.enterRoom({
     scene: 'rtc',
     sdkAppId: 140000000, // Fill in your sdkAppId
     userId: 'userA', // Fill in your userId
     userSig: 'userA_sig', // Fill in userSig corresponding to userId
     roomId: 6969
   })
   await trtcA.startScreenShare();
   ```
2. Play Remote Screen Sharing

   ``` javascript
   const trtcB = TRTC.create();
   trtcB.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({ userId, streamType }) => {
     // Main video stream, generally the stream pushed by the camera
     if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
       // 1. Place a div tag with an id of `${userId}_main` on the page to play the main stream in the div tag. The business side can customize the id of the div tag. This is just an example.
       // 2. Play the main video stream
       trtcB.startRemoteVideo({ userId, streamType,  view: `${userId}_main` });
     } else {
       // Sub video stream, generally the stream pushed by screen sharing.
       // 1. Place a div tag with an id of `${userId}_screen` on the page to play the screen sharing in the div tag. The business side can customize the id of the div tag. This is just an example.
       // 2. Play screen sharing
       trtcB.startRemoteVideo({ userId, streamType, view: `${userId}_screen` });
     }
   });
   
   await trtcB.enterRoom({
     scene: 'rtc',
     sdkAppId: 140000000, // Fill in your sdkAppId
     userId: 'userB', // Fill in your userId
     userSig: 'userB_sig', // Fill in userSig corresponding to userId
     roomId: 6969
   })
   ```
3. Start Camera + Screen Sharing at the Same Time

   ``` javascript
    await trtcA.startLocalVideo();
    await trtcA.startScreenShare();
   ```
4. Screen Sharing + System Audio

   System audio is supported by Chrome M74+

   - On Windows and Chrome OS, the audio of the entire system can be collected.

   - On Linux and Mac, only the audio of a certain page can be collected.

   - Other Chrome versions, other systems, and other browsers are not supported.

      ``` js
       await trtcA.startScreenShare({ option: { systemAudio: true }});
      ```

      Check `Share sytem audio` in the pop-up dialog box, and the system audio will be mixed with the local microphone and published. Other users in the room will receive the [REMOTE_AUDIO_AVAILABLE](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-EVENT.html#.REMOTE_AUDIO_AVAILABLE) event.

      

5. Stop Screen Sharing.

   ``` javascript
    // Stop screen sharing collection and publishing
    await trtcA.stopScreenShare();
   
    // Other users in the room will receive the TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE event, and streamType is TRTC.TYPE.STREAM_TYPE_SUB.
    trtcB.on(TRTC.EVENT.REMOTE_VIDEO_UNAVAILABLE, ({ userId, streamType }) => {
       if (streamType === TRTC.TYPE.STREAM_TYPE_SUB) {
         
       }
    })
   ```

   In addition, users may also stop screen sharing through the browser's own button, so the screen sharing stream needs to listen for the screen sharing stop event and respond accordingly.

   

   ``` javascript
   // Listen for screen sharing stop event
   trtcA.on(TRTC.EVENT.SCREEN_SHARE_STOPPED, () => {
     console.log('screen sharing was stopped');
   });
   ```

## Precautions
1. [What is the main/sub video stream?](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/module-TYPE.html#.STREAM_TYPE_MAIN)

2. The SDK uses the `1080p` parameter configuration by default to collect screen sharing. For details, refer to the interface: [startScreenShare](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/TRTC.html#startScreenShare).

## Common Issues
1. Safari screen sharing error `getDisplayMedia must be called from a user gesture handler`

   This is because Safari restricts the `getDisplayMedia` screen capture interface, which must be called within 1 second of the callback function of the user click event.

   Reference: [webkit issue](https://bugs.webkit.org/show_bug.cgi).

   ``` javascript
   // good
   async function onClick() {
     // It is recommended to execute the collection logic first when onClick is executed
     await trtcA.startScreenShare();
     await trtcA.enterRoom({ 
       roomId: 123123,
       sdkAppId: 140000000, // Fill in your sdkAppId
       userId: 'userA', // Fill in your userId
       userSig: 'userA_sig', // Fill in userSig corresponding to userId
     });
   }
   
   // bad
   async function onClick() {
     await trtcA.enterRoom({ 
       roomId: 123123,
       sdkAppId: 140000000, // Fill in your sdkAppId
       userId: 'userA', // Fill in your userId
       userSig: 'userA_sig', // Fill in userSig corresponding to userId
     });
     // Entering the room may take more than 1s, and the collection may fail
     await trtcA.startScreenShare();
   }
   ```
2. Mac Chrome screen sharing fails with the error message "NotAllowedError: Permission denied by system" or "NotReadableError: Could not start video source" when screen recording is already authorized. [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail). Solution: Open **Settings**> Click **Security & Privacy**> Click **Privacy**> Click **Screen Recording**> Turn off Chrome screen recording authorization > Reopen Chrome screen recording authorization > Close Chrome browser > Reopen Chrome browser.

3. [WebRTC screen sharing known issues and workarounds](https://web.sdk.qcloud.com/trtc/webrtc/v5/doc/en/tutorial-02-info-webrtc-issues.html#h2-8)

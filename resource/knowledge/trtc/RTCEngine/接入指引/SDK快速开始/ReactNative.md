---
sync_node_id: '175256414683627520'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "SDK 快速开始"
  - "React Native"
product: "trtc"
---
## Environment preparations
1. React Native 0.60+  

2. Android 5.0+

3. iOS 12.0+

4. Node.js 14+  

   For more precautions on setting up a development environment, see [Set Up a Development Environment](https://reactnative.dev/docs/environment-setup)。

## Step 1. Import SDK

Install SDK via npm or yarn:
``` bash
npm install trtc-react-native --save
# or
yarn add trtc-react-native
```

## Step 2. Configure Project

【Android】
1. Open `/android/app/src/main/AndroidManifest.xml` file and add the following permissions in which:

``` java
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```
2. Create the `proguard-rules.pro file` under the `android/app` directory of the project, and add the following code in the `proguard-rules.pro file`.

``` java
-keep class com.tencent.** { *; }
```

【iOS】
1. iOS needs to add permission applications for the camera and microphone under the first-level <dict> directory in `Info.plist`:

``` swift
<key>NSCameraUsageDescription</key>
<string>Authorize camera permissions for a normal video cal</string>
<key>NSMicrophoneUsageDescription</key>
<string>Authorize microphone permissions for a normal voice call</string>
```
2. Execute `pod install` to install native dependencies (need to be executed under the `ios` directory).

> **Note：**
> If you encounter problems during the access process, please see [sample project](https://github.com/Tencent-RTC/TRTC_ReactNative/tree/main/TRTC-Simple-Demo).
> 

## Step 3. Create a TRTC Instance
``` javascript
import TRTCCloud from 'trtc-react-native';

// Create a TRTC singleton instance.
const trtcCloud = TRTCCloud.sharedInstance();
```

## Step 4. Enter a Room
``` javascript
import { TRTCParams, TRTCCloudDef } from 'trtc-react-native';

const params = new TRTCParams({
  sdkAppId: SDKAPPID,  // SDKAppID applied in the Tencent Cloud console
  userId: 'user123',   // user id
  userSig: 'xxxxxx',   // user signature (generated on the server side)
  roomId: 2366,        // room numb
});

// Enter the room in audio and video call scenarios
trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
```

> **Note：**
> you can obtain the sdkAppId of your application in the [TRTC console](https://console.trtc.io/), and see [user authentication](https://www.tencentcloud.com/document/product/647/35166) to obtain userSig.
> 

## Step 5. Turn on Microphone
``` javascript
trtcCloud.startLocalAudio(); // Start local audio capture and uplink
```

## Step 6. Play/Stop Video Stream

**Play Local Video**:  
``` jsx
import { TXVideoView } from 'trtc-react-native';

// Render local video in the component
<TXVideoView.LocalView style={{ width: 1080, height: 1080 }} />
```

**Play Remote Video**:  
``` jsx
<TXVideoView.RemoteView 
  userId={remoteUserId} 
  streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
  style={{ width: 1080, height: 1080 }}
/>
```

**Stop playback**:  
``` javascript
trtcCloud.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
```

## Step 7. Play/Stop Audio Stream

**Play Remote Audio**:  
``` javascript
trtcCloud.muteRemoteAudio(userId, false); // `false` means unmute
```

**Stop playback**:
``` javascript
trtcCloud.muteRemoteAudio(userId, true);  // `true` means mute
```

## Step 8. Leave the Room
``` javascript
trtcCloud.exitRoom(); // Exit the current room
```

## FAQs

###  **How to Handle Black Screen Issues?**  

• Check whether the camera permission is authorized.  

•  Ensure that the `TXVideoView` component is rendered correctly and its size is not zero.  

### **How to Handle Unable to Enter Room?**  

• Check whether `sdkAppId`, `userSig` and `roomId` are valid.  

• Ensure normal network connection.  

### Audio Anomaly Occurs. How to Handle It?

• Check whether the microphone permission is authorized.  

• Confirm mic status after calling `startLocalAudio()`.

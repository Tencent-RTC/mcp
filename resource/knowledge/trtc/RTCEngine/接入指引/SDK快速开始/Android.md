---
sync_node_id: '150174457336295424'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "SDK 快速开始"
  - "Android"
product: "trtc"
---
This tutorial mainly introduces how to implement a basic audio and video call.

## Prerequisites
- Android Studio 4.0 or later.

- Android 4.4 (SDK API level 19) or later.

## Integration guideline

### Step 1. Import the SDK
1. In `app/build.gradle`, add dependencies to the **TRTC SDK**.

   ``` javascript
   dependencies {
       // ...Other project dependencies
       implementation 'com.tencent.liteav:LiteAVSDK_TRTC:latest.release' // Add TRTC SDK dependencies
   }
   ```
2. In`app/build.gradle`, specify the **CPU architecture** of the project in **defaultConfig** to support devices with **armeabi-v7a/arm64-v8a** architecture.

   ``` javascript
   android {
       defaultConfig {
           // ...Other project dependencies
           ndk {
                abiFilters "armeabi-v7a", "arm64-v8a" // Support armeabi-v7a and arm64-v8a architectures
           }
       }
   }
   ```

   After the above configuration completed, click `Sync Now`, the TRTC SDK will automatically integrate into the target project.

### Step 2. Configure project
1. In `AndroidManifest.xml`, add the permissions required for the **TRTC SDK**.

   ``` xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
   <uses-permission android:name="android.permission.BLUETOOTH" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-feature android:name="android.hardware.camera.autofocus" />
   ```

   > **Note:**
   > 
   > Do not set the `android: hardwareAccelerated = "false"`. When hardware acceleration is turned off, the other party's video stream cannot be rendered.
   > 

2. In`proguard-rules.pro`, add the **TRTC SDK-related classes** to the "non-obfuscation" list.

   ``` protobuf
   -keep class com.tencent.** { *; }
   ```

### Step 3. Create TRTC instance

To use the audio and video functions, you need to request **camera and microphone** permissions. It is recommended that you create a TRTC instance after a successful request.
``` java
private TRTCCloud mCloud; // Declare member variables
 
// Create a TRTC instance and set up a listener
mCloud = TRTCCloud.sharedInstance(getApplicationContext());
mCloud.addListener(new TRTCCloudListener() {
    @Override
    public void onError(int errCode, String errMsg, Bundle extraInfo) {
        super.onError(errCode, errMsg, extraInfo);
        // Handling Error events
        String notificaiton = "Error Code: " + errCode + ", Error Message: " + errMsg + ", extraInfo: " + extraInfo;
        Toast.makeText(getApplicationContext(), notificaiton, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onEnterRoom(long result) {
        super.onEnterRoom(result);
        // Processing the result of entering the room
        if(result > 0) {
            Toast.makeText(getApplicationContext(), "Enter Room successfully！", Toast.LENGTH_LONG).show();
        } else {
            Toast.makeText(getApplicationContext(), "Enter Room Failed！", Toast.LENGTH_LONG).show();
        }
    }
});
```

### Step 4. Enter the room
1. Request **camera and microphone** permissions before entering the room.

   ``` java
   private static final int REQUEST_CAMERA_AND_MICROPHONE = 1; // Required parameter `requestCode` for `ActivityCompat.requestPermissions()`
   
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_main);
   
       // Request camera and microphone access
       requestCameraAndMicrophonePermission();
   }
   
   private void requestCameraAndMicrophonePermission() {
       String[] permissions = {android.Manifest.permission.CAMERA, android.Manifest.permission.RECORD_AUDIO};
       ActivityCompat.requestPermissions(this, permissions, REQUEST_CAMERA_AND_MICROPHONE);
   }
   
   @Override
   public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
       super.onRequestPermissionsResult(requestCode, permissions, grantResults);
       if (requestCode == REQUEST_CAMERA_AND_MICROPHONE) {
           boolean allPermissionsGranted = true;
           for (int grantResult : grantResults) {
               if (grantResult != PackageManager.PERMISSION_GRANTED) {
                   allPermissionsGranted = false;
                   break;
               }
           }
           if (allPermissionsGranted) {
               // After the device permissions successfully applied for, create a TRTC instance and use the functions supported by TRTC
           } else {
               // If the permissions failed to be applied for, a prompt could be displayed
               Toast.makeText(getApplicationContext(), "Permissions request failed！", Toast.LENGTH_LONG).show();
           }
       }
   }
   ```
2. Set the entry parameter `TRTCParams` and call `enterRoom` to successfully enter the room, which is usually called after clicking the **Start Call** button.

   |Parameter|Type|Description|
   |---------|---------|---------|
   |sdkAppId|number|The sdkAppId of the audio and video application you created in [TRTC Console](https://trtc.io/login).|
   |userId|string|User ID specified by you.|
   |userSig|string|User signature, refer to [UserSig](https://trtc.io/document/35166) 。|
   |roomId|number|Room ID specified by you, usually a unique room ID. |

   For more detailed parameter descriptions,  please refer to the interface document [enterRoom](https://trtc.io/document/50762#b379e54cd925946c111f4c5994480a3f) 。

   ``` java
   // Modify the following parameters to your own
   TRTCCloudDef.TRTCParams trtcParams = new TRTCCloudDef.TRTCParams();
   trtcParams.sdkAppId = 1400000123;
   trtcParams.userId = "denny";
   trtcParams.userSig = "xxx";
   trtcParams.roomId = 123321;
   
   // For multi-party video calls, `TRTC_APP_SCENE_LIVE` is recommended
   mCloud.enterRoom(trtcParams, TRTCCloudDef.TRTC_APP_SCENE_LIVE);  
   ```

### Step 5. Turn on/off Camera
1. Add the `TXCloudVideoView` view component to the layout file to display the video stream content.

   ``` xml
   <com.tencent.rtmp.ui.TXCloudVideoView
     android:id="@+id/txcvv_main_local"
     android:layout_width="wrap_content"
     android:layout_height="wrap_content"
     app:layout_constraintBottom_toBottomOf="parent"
     app:layout_constraintEnd_toEndOf="parent"
     app:layout_constraintStart_toStartOf="parent"
     app:layout_constraintTop_toTopOf="parent" />
   ```
2. Set the render parameter `setLocalRenderParams` for the local preview, and call `startLocalPreview` for the local preview, and start the push after successfully calling `enterRoom`.

   ``` java
   // Set the preview mode of the local screen
   TRTCCloudDef.TRTCRenderParams trtcRenderParams = new TRTCCloudDef.TRTCRenderParams();
   trtcRenderParams.fillMode   = TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL; // The render mode set as FILL
   trtcRenderParams.mirrorType = TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_AUTO; // The image type set as AUTO
   mCloud.setLocalRenderParams(trtcRenderParams);
   
   // Start a preview of the local camera
   TXCloudVideoView cameraVideo = findViewById(R.id.txcvv_main_local);
   mCloud.startLocalPreview(true, cameraVideo);
   ```

   Call `stopLocalPreview` to turn off the camera preview and stop pushing local video information.

   ``` java
   mCloud.stopLocalPreview();  
   ```
3. Perform other extended device functions such as **"Switch front and rear cameras"**, **"Set focus Mode"**, and **"Flash"**.

   ``` java
   // By default, the front camera is enabled and switch to the rear camera
   TXDeviceManager manager = mCloud.getDeviceManager();
   if(manager.isFrontCamera()) {
       manager.switchCamera(false);
   }
   
   // Switch to the front camera
   TXDeviceManager manager = mCloud.getDeviceManager();
   manager.switchCamera(true);
   ```

   ``` java
   // If the automatic face recognition supported, enable the auto focus function
   TXDeviceManager manager = mCloud.getDeviceManager();
   if (manager.isAutoFocusEnabled()) {
       manager.enableCameraAutoFocus(true); 
   }
   
   // Disable the autofocus function
   TXDeviceManager manager = mCloud.getDeviceManager();
   manager.enableCameraAutoFocus(false); 
   ```

   ``` java
   // The flash can be turned on when using the rear camera
   TXDeviceManager manager = mCloud.getDeviceManager();
   manager.enableCameraTorch(true);
   
   // Turn off the flash
   TXDeviceManager manager = mCloud.getDeviceManager();
   manager.enableCameraTorch(false);
   ```

### Step 6. Turn on/off microphone

Call the `startLocalAudio` to turn on microphone capture. **Select one of the following sound** `Quality` **parameters according to your requirements**.
``` java
// Enable microphone acquisition and set the current scene to: Voice mode 
// For high noise suppression capability, strong and weak network resistance
mCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH );
```

``` java
// Enable microphone acquisition, and set the current scene to: Music mode (
// For high fidelity acquisition, low sound quality loss, recommended to use with professional sound cards
mCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_MUSIC);
```

Call `stopLocalAudio` to turn off microphone collection and stop pushing local audio information.
``` java
mCloud.stopLocalAudio();
```

### Step 7. Play/stop video streaming
1. Listen to [onUserVideoAvailable](https://trtc.io/document/50763#448623ba3ddafa44cdb425bea100c2d8) before entering the room. When you receive the `onUserVideoAvailable(userId, true)` notification, it means that there are video frames available to play in the road screen.

2. Call `startRemoteView` to play the video content collected by the remote side.

   ``` java
   // Play the remote video
   TXCloudVideoView cameraVideo = findViewById(R.id.txcvv_main_local);
   mCloud.startRemoteView("denny", TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, cameraVideo); // Play remote capture video content with high definition large screen
   ```

   Call `stopRemoteView` to stop the remote video.

   ``` java
   // Stop the video
   mCloud.stopRemoteView("denny", TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG); // Only stop playing the denny screen
   mCloud.stopAllRemoteView(); // Stop all videos
   ```

### Step 8. Play/stop the audio stream

By default, the SDK will play remote audio automatically, so you don't need to call any apis to play it manually.

But when you don't like autoplay audio, you can call `muteRemoteAudio` to choose to play or stop the remote sound.
``` java
// Mute
mCloud.muteRemoteAudio("denny", true); // Only mute denny

mCloud.muteAllRemoteAudio(true); // Mute all remote users
```

``` java
// Unmute
mCloud.muteRemoteAudio("denny", false); // Only unmute denny

mCloud.muteAllRemoteAudio(false); // Unmute all remote users
```

### Step 9. Exit the room

Call `exitRoom` to exit the current room, and the TRTC SDK will notify you after check-out via the `onExitRoom` callback event.
``` java
// Exit current room
mCloud.exitRoom();

// Listen for the `onExitRoom` callback to get the reason for room exit
@Override
public void onExitRoom(int reason) {
    if (reason == 0) {
        Log.d(TAG, "Exit current room by calling the 'exitRoom' api of sdk ...");
    } else if (reason == 1) {
        Log.d(TAG, "Kicked out of the current room by server through the restful api...");
    } else if (reason == 2) {
        Log.d(TAG, "Current room is dissolved by server through the restful api...");
    }
}
```

## FAQs

API Reference at [API Reference](https://trtc.io/document/35125).

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://trtc.io/document/36058).

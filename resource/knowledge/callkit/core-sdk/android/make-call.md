This guide walks you through implementing the "Make a Call" feature with the **AtomicXCore SDK**. You'll use three core building blocks—**DeviceStore**, **CallStore**, and the main UI component **CallCoreView**—to build a complete calling experience.

## Core Features

**AtomicXCore** offers three essential modules for building multi-party Audio/Video Call scenarios:

|**Module**|**Feature Description**|
|---------|---------|
|[CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html)|The main call UI component. It observes CallStore data and handles video rendering automatically, and supports customization of layout, avatars, and icons.|
|[CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html)|Manages the call lifecycle (place a call, answer, reject, hang up) and exposes real-time participant audio/video status, call duration, call logs, and more.|
|[DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|Controls audio/video devices: microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, and real-time device status monitoring.|

## Preparation

### Step 1: Activate the Service

Follow the instructions in Activate the service to obtain either a trial or paid edition of the SDK.

### Step 2: Integrate the SDK

**Add dependencies:** Include `api "io.trtc.uikit:atomicx-core:latest.release"` and `api "com.tencent.imsdk:imsdk-plus:8.7.7201"` in your **build.gradle** file, then run **Gradle Sync**.
``` java
dependencies {
    api "io.trtc.uikit:atomicx-core:latest.release"
    api "com.tencent.imsdk:imsdk-plus:8.7.7201"
    // Other dependencies...
}
```

### Step 3: Initialize and Log In

To enable calling features, first initialize CallStore, then log in the user. CallStore syncs user info by listening for login success and then enters the ready state. See the flowchart and sample code below:

``` java
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Initialize CallStore
        CallStore.shared
        val sdkAppId = 1400000001   // Replace with your SDKAppID
        val userId = "test_001"     // Replace with your UserID
        val userSig = "xxxxxxxxxxx" // Replace with your UserSig
        LoginStore.shared.login(
            this,
            sdkAppId,
            userId,
            userSig,
            object : CompletionHandler {
                override fun onSuccess() {
                    // Initialize TUICallEngine
                    TUICallEngine.createInstance(this@MainActivity).init(sdkAppId, userId, userSig, null)
                    // Login successful
                    Log.d("Login", "login success");
                }
                override fun onFailure(code: Int, desc: String) {
                    // Login failed
                    Log.e("Login", "login failed, code: $code, error: $desc");
                }
            }
        )
    }
}
```
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| userId | String | Unique identifier for the current user. Only letters, numbers, hyphens, and underscores are allowed. Avoid simple IDs like 1 or 123 to prevent multi-device login conflicts. |
| sdkAppId | int | Obtain from the <a href="https://trtc.io/login?fro=gt&s_url=https%3A%2F%2Fconsole.trtc.io%2F">console</a>; typically a 10-digit integer starting with 140 or 160. |
| userSig | String | Authentication token for TRTC.<br>- Development: Use the local <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/call/tuicallkit-kt/src/main/java/com/tencent/qcloud/tuikit/tuicallkit/debug/GenerateTestUserSig.kt">GenerateTestUserSig.genTestUserSig</a> function or the <a href="https://console.trtc.io/usersig">UserSig Tool</a> to generate a temporary UserSig.<br>- Production: Always generate UserSig server-side to prevent SecretKey leakage. See Server-side UserSig Generation. For more details, see How to calculate and use UserSig. |

## Implementation

> **Note：**
> You must log in before making a call. The following steps show how to make a call.
>

### Step 1: Create Call Interface

Set up a dedicated call screen that appears when a call is initiated:
1. **Create the call screen:** Implement a new Activity to host the call UI and handle navigation when a call is received.

2. **Attach** [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html)**:** This core view component observes **CallStore** data and renders the call UI. It supports layout switching, avatar, and icon customization.

   ``` java
   class CallActivity : AppCompatActivity() {
       private var callCoreView: CallCoreView? = null
       // 1. Create call page container
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // 2. Attach CallCoreView to the call screen
           callCoreView = CallCoreView(this)
           setContentView(callCoreView)
       }
   }
   ```

   **CallCoreView Component Features:**

   |**Feature**|**Description**|**Reference**|
   |---------|---------|---------|
   |**Set Layout Mode**|Switch between different layout modes. If not specified, layout adapts automatically based on participant count.|Switch Layout Mode|
   |**Set Avatar**|Customize avatars for specific users via resource path.|Customize Default Avatar|
   |**Set Volume Indicator Icon**|Personalize volume indicator icons for different volume levels.|Customize Volume Indicator Icon|
   |**Set Network Indicator Icon**|Show network quality status with real-time indicator icons.|Customize Network Indicator Icon|
   |**Set Waiting Animation for Users**|Display GIF animations for users in the waiting state during multi-party calls.|Customize Loading Animation|

### Step 2: Add Call Controls

Use the APIs from [DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html) and [CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) to add and customize call control buttons:
- **DeviceStore:** Microphone (toggle and volume), camera (toggle, switch, quality), and screen sharing. Wire these APIs to your buttons and observe device state to update the UI in real time.

- **CallStore:** Call actions (answer, hang up, reject). Wire these to button clicks and show/hide or enable/disable buttons based on call status.

- **Icons:** You can download button icons from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/call/tuicallkit-kt/src/main/res). They are designed for TUICallKit and free for use.

   |**Icons**|||||||||
   |---------|---------|---------|---------|---------|---------|---------|---------|---------|

- **Example: Adding** **hang up, microphone, and camera buttons**

  1. **Create Bottom Bar Container:** Add a container at the bottom of the call screen to hold the hang up, microphone, and camera buttons.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.CallStore
      import io.trtc.tuikit.atomicxcore.api.view.CallCoreView
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

      class CallActivity : AppCompatActivity() {
          private var buttonContainer: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // Other initialization code
              // Create bottom bar container
              createButtonContainer()
              setContentView(buttonContainer)
          }

          private fun createButtonContainer() {
              buttonContainer = LinearLayout(this).apply {
                  orientation = LinearLayout.HORIZONTAL
                  gravity = Gravity.CENTER
                  layoutParams = FrameLayout.LayoutParams(
                      FrameLayout.LayoutParams.MATCH_PARENT,
                      FrameLayout.LayoutParams.WRAP_CONTENT
                  ).apply {
                      gravity = Gravity.BOTTOM
                      bottomMargin = dpToPx(80)
                  }
              }
          }
      }
      ```
  2. **Add Hang Up Button:** Insert a hang up button into the bottom toolbar. On click, call the [hangup](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/hangup.html) API and close the call screen.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.CallStore
      import io.trtc.tuikit.atomicxcore.api.view.CallCoreView
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

      class CallActivity : AppCompatActivity() {
          private var buttonContainer: Button? = null
          private var buttonHangup: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // Other initialization code
              // 1. Add hang up button to bottom toolbar
              addHangupButton()
              setContentView(buttonContainer)
          }

          private fun addHangupButton() {
              buttonHangup = Button(this).apply {
                  text = "Hang Up"
                  layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                      marginEnd = dpToPx(8)
                  }
                  setOnClickListener {
                      // 2. Call hangup API and close the screen
                      CallStore.shared.hangup(null)
                      finish()
                  }
              }
              buttonContainer?.addView(buttonHangup)
          }
      }
      ```
  3. **Add Microphone Toggle Button:** Add a microphone toggle button to the toolbar. On click, call [openLocalMicrophone](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/open-local-microphone.html) or [closeLocalMicrophone](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/close-local-microphone.html) as needed.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.CallStore
      import io.trtc.tuikit.atomicxcore.api.view.CallCoreView
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

      class CallActivity : AppCompatActivity() {
          private var buttonContainer: Button? = null
          private var buttonMicrophone: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
             super.onCreate(savedInstanceState)
              // Other initialization code
              // 1. Add microphone toggle to bottom toolbar
              addMicrophoneButton()
              setContentView(buttonContainer)
          }

          private fun addMicrophoneButton() {
              buttonMicrophone = Button(this).apply {
                  layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                      setMargins(16, 0, 16, 0)
                  }
                  setOnClickListener {
                      // 2. Toggle microphone on click
                      val isMicrophoneOpen = DeviceStore.shared().deviceState.microphoneStatus.value == DeviceStatus.ON
                      if (isMicrophoneOpen) {
                          DeviceStore.shared().closeLocalMicrophone()
                      } else {
                          DeviceStore.shared().openLocalMicrophone(null)
                      }
                  }
              }
              val isMicrophoneOpen = DeviceStore.shared().deviceState.microphoneStatus.value == DeviceStatus.ON
              buttonMicrophone?.text = if (isMicrophoneOpen) "Mute Microphone" else "Unmute Microphone"
              buttonContainer?.addView(buttonMicrophone)
          }
      }
      ```
  4. **Add Camera Toggle Button:** Add a camera toggle button to the toolbar. On click, call [openLocalCamera](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/open-local-camera.html) or [closeLocalCamera](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/close-local-camera.html) as needed.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.CallStore
      import io.trtc.tuikit.atomicxcore.api.view.CallCoreView
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

      class CallActivity : AppCompatActivity() {
          private var buttonContainer: Button? = null
          private var buttonCamera: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // Other initialization code
              // 1. Add camera toggle button to bottom toolbar
              addCameraButton()
              setContentView(buttonContainer)
          }

          private fun addCameraButton() {
              buttonCamera = Button(this).apply {
                  layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                      setMargins(16, 0, 16, 0)
                  }
                  setOnClickListener {
                      // 2. Toggle camera on click
                      val isCameraOpen = DeviceStore.shared().deviceState.cameraStatus.value == DeviceStatus.ON
                      if (isCameraOpen) {
                          DeviceStore.shared().closeLocalCamera()
                      } else {
                          val isFrontCamera = DeviceStore.shared().deviceState.isFrontCamera.value
                          DeviceStore.shared().openLocalCamera(isFrontCamera, null)
                      }
                  }
              }
              val isCameraOpen = DeviceStore.shared().deviceState.cameraStatus.value == DeviceStatus.ON
              buttonCamera?.text = if (isCameraOpen) "Turn Off Camera" else "Turn On Camera"
              buttonContainer?.addView(buttonCamera)
          }
      }
      ```
  5. **Update Button Text in Real Time:** Listen for microphone and camera status changes and update button text accordingly.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.*
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
      import kotlinx.coroutines.*

      class CallActivity : AppCompatActivity() {
          private var buttonCamera: Button? = null
          private var buttonMicrophone: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // Other initialization code
              // 1. Observe microphone and camera status
              observeDeviceState()
          }

          private fun observeDeviceState() {
              deviceStateJob = CoroutineScope(Dispatchers.Main).launch {
                  supervisorScope {
                      launch {
                          DeviceStore.shared().deviceState.cameraStatus.collect { status ->
                              // 2. Update camera button text
                              buttonCamera?.text = if (status == DeviceStatus.ON) "Turn Off Camera" else "Turn On Camera"
                          }
                      }
                      launch {
                          DeviceStore.shared().deviceState.microphoneStatus.collect { status ->
                              // 2. Update microphone button text
                              buttonMicrophone?.text = if (status == DeviceStatus.ON) "Mute Microphone" else "Unmute Microphone"
                          }
                      }
                  }
              }
          }
      }
      ```

### Step 3: Request Microphone and Camera Permissions

Before making a call, check for audio and video permissions. If permissions are missing, prompt the user to grant them dynamically.
1. **Declare permissions:** Add camera and microphone permissions to your `AndroidManifest.xml`.

   ``` xml
   <manifest xmlns:android="http://schemas.android.com/apk/res/android">
       <!-- Microphone permission -->
       <uses-permission android:name="android.permission.RECORD_AUDIO" />
       <!-- Camera permission -->
       <uses-permission android:name="android.permission.CAMERA" />

       <application>
           <!-- ... -->
           <activity
               android:name=".CallActivity"
               android:exported="false"
               android:screenOrientation="portrait" />
       </application>
   </manifest>
   ```
  1. **Request permissions at runtime:** Dynamically request audio and video permissions as needed when making a call.

      ``` java
      // Request permissions dynamically
      private fun requestAllCallPermissions() {
          val allPermissions = arrayOf(
              Manifest.permission.CAMERA,
              Manifest.permission.RECORD_AUDIO
          )

          if (!checkPermissions(allPermissions)) {
              ActivityCompat.requestPermissions(this, allPermissions, PERMISSION_REQUEST_CODE)
          }
      }

      // Handle permission request result
      override fun onRequestPermissionsResult(
          requestCode: Int,
          permissions: Array<out String>,
          grantResults: IntArray
      ) {
         super.onRequestPermissionsResult(requestCode, permissions, grantResults)

         if (requestCode == PERMISSION_REQUEST_CODE) {
             // Check if all permissions are granted
             var allGranted = true
             for (result in grantResults) {
                 if (result != PackageManager.PERMISSION_GRANTED) {
                     allGranted = false
                     break
                 }
             }
             if (allGranted) {
                 // Permissions granted
                 } else {
                 // Some permissions denied
             }
         }
      }
      ```

### Step 4: Make a Call

After the [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) API succeeds, navigate to the call screen. For a better experience, enable the microphone (and camera for video calls) automatically based on the media type.
1. **Initiate the call:** Use the `calls` API to start a call.

2. **Enable media devices:** Once the call is initiated, turn on the microphone; for video calls, also enable the camera.

3. **Open the call screen:** On successful call initiation, launch the call Activity.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.call.CallMediaType
   import io.trtc.tuikit.atomicxcore.api.call.CallStore

   class MainActivity : ComponentActivity() {

       // 1. Make a call
       private fun startCall(userIdList: List<String>, mediaType: CallMediaType) {
           CallStore.shared.calls(userIdList, mediaType, null, object : CompletionHandler {
               override fun onFailure(code: Int, desc: String) {
               }

               override fun onSuccess() {
                   // 2. Enable media devices
                   openDeviceForMediaType(mediaType)
                   // 3. Launch call screen
                   val intent = Intent(this@MainActivity, CallActivity::class.java)
                   startActivity(intent)
               }
           })
       }

       private fun openDeviceForMediaType(mediaType: CallMediaType?) {
           if (mediaType == null) {
               return
           }
           DeviceStore.shared().openLocalMicrophone(null)
           if (mediaType == CallMediaType.Video) {
               val isFrontCamera = DeviceStore.shared().deviceState.isFrontCamera.value
               DeviceStore.shared().openLocalCamera(isFrontCamera, null)
           }
       }
   }
   ```
- **calls API Parameter Reference:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| userIdList | List | Yes | List of target user <code>userId</code>s. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Yes | Call media type: audio or video.<br>-  <code>CallMediaType.Video</code>: Video call.<br>-  <code>CallMediaType.Audio</code>: Audio call. |
| params | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-params/index.html">CallParams</a> | No | Optional call parameters, such as room ID, call invitation timeout, etc.<br>-  <code>roomId</code> (String): Room ID, optional. If not specified, the server assigns one.<br>- <code>timeout</code> (Int): Call timeout (seconds).<br>- <code>userData</code> (String): Custom user data.<br>- <code>chatGroupId</code> (String): Chat group ID for group calls.<br>- <code>isEphemeralCall</code> (Boolean): If true, the call is encrypted and not logged. |

### Step 5: End the Call

Whether the local user hangs up via [hangup](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/hangup.html) or the remote party ends the call, the [onCallEnded](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-ended.html) callback is fired. Subscribe to it and finish the call Activity when the call ends.
1. **Listen for call end events:** Subscribe to the `onCallEnded` event.

2. **Close the call screen:** When `onCallEnded` is triggered, finish the Activity.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.call.CallEndReason
   import io.trtc.tuikit.atomicxcore.api.call.CallListener
   import io.trtc.tuikit.atomicxcore.api.call.CallMediaType
   import io.trtc.tuikit.atomicxcore.api.call.CallStore

   class CallActivity : AppCompatActivity() {

       private var callListener: CallListener? = null

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // ... Other initialization code
           // 1. Listen for call end event
           addListener()
       }

       private fun addListener() {
           callListener = object : CallListener() {
               override fun onCallEnded(callId: String, mediaType: CallMediaType, reason: CallEndReason, userId: String) {
                   // 2. Close call screen
                   finish()
               }
           }
           callListener?.let { CallStore.shared.addListener(it) }
       }
   }
   ```
- **onCallEnded Event Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Unique identifier for the call. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Call media type: audio or video.<br>- <code>CallMediaType.Video</code>: Video call.<br>- <code>CallMediaType.Audio</code>: Audio call. |
| reason | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-end-reason/index.html">CallEndReason</a> | Reason for call end.<br>- <code>Unknown</code>: Unknown reason.<br>- <code>Hangup</code>: User ended the call.<br>- <code>Reject</code>: Callee rejected the call.<br>- <code>NoResponse</code>: No answer within timeout.<br>- <code>Offline</code>: Callee is offline.<br>- <code>LineBusy</code>: Callee is busy.<br>- <code>Canceled</code>: Caller canceled before callee answered.<br>- <code>OtherDeviceAccepted</code>: Call answered on another device.<br>- <code>OtherDeviceReject</code>: Call rejected on another device.<br>- <code>EndByServer</code>: Call ended by server. |
| userId | String | ID of the user who triggered the end event. |

### Result

Once you complete these five steps, your app will look like this:

## Customization

**CallCoreView** supports rich UI customization, including avatars and volume indicators. You can download ready-to-use icons from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/call/tuicallkit-kt/src/main/res) to speed up integration; they are designed for TUICallKit and free for commercial use.

### Custom Volume Indicator Icons

Use the [setVolumeLevelIcons](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-volume-level-icons.html) method to assign custom icons for each volume level.

- **setVolumeLevelIcons Example:**

   ``` java
   private fun setIconResourcePath() {
       val volumeLevelIcons = mapOf(VolumeLevel.Mute to "path/to/icon/resource")
       val callCoreView = CallCoreView(context)
       callCoreView.setVolumeLevelIcons(volumeLevelIcons)
   }
   ```
- **setVolumeLevelIcons API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | Map | Yes | Maps each volume level to an icon resource. Key (VolumeLevel):<br>- <code>VolumeLevel.Mute</code>: Microphone muted.<br>- <code>VolumeLevel.Low</code>: Volume (0-25].<br>- <code>VolumeLevel.Medium</code>: Volume (25-50].<br>- <code>VolumeLevel.High</code>: Volume (50-75].<br>- <code>VolumeLevel.Peak</code>: Volume (75-100].<br>Value (String): Path to the icon resource for each level. |

- **Volume Indicator Icons:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Volume indicator. Use for `VolumeLevel.Low` or `VolumeLevel.Medium` when the user's volume is above the corresponding threshold.|
   ||Mute indicator. Use for `VolumeLevel.Mute` when the user is muted.|

### Custom Network Indicator Icons

Use [setNetworkQualityIcons](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-network-quality-icons.html) to set custom icons for different network statuses.

- **setNetworkQualityIcons Example:**

   ``` java
   private fun setNetworkQualityIcons() {
       val volumeLevelIcons = mapOf(NetworkQuality.BAD to "path/to/icon")
       val callCoreView = CallCoreView(context)
       callCoreView.setNetworkQualityIcons(volumeLevelIcons)
   }
   ```
- **setNetworkQualityIcons API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | Map | Yes | Maps each network quality level to an icon resource. Key (NetworkQuality):<br>- <code>NetworkQuality.UNKNOWN</code>: Unknown.<br>- <code>NetworkQuality.EXCELLENT</code>: Excellent.<br>- <code>NetworkQuality.GOOD</code>: Good.<br>- <code>NetworkQuality.POOR</code>: Poor.<br>- <code>NetworkQuality.BAD</code>: Bad.<br>- <code>NetworkQuality.VERY_BAD</code>: Very bad.<br>- <code>NetworkQuality.DOWN</code>: Disconnected.<br>Value (String): Path to the icon resource for each status. |

- **Poor Network Indicator Icon:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Poor network indicator. Use for `NetworkQuality.BAD`, `VERY_BAD`, or `DOWN` when the network is poor or disconnected.|

### Custom Default Avatar

Use [setParticipantAvatars](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-participant-avatars.html) to assign avatars to users. We recommend observing the data streams of [allParticipants](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/all-participants.html): display custom avatars when available, and fall back to the default avatar if not set or if loading fails.
- **setParticipantAvatars Example:**

   ``` java
   private fun setParticipantAvatars() {
       val avatars: MutableMap<String, String> = mutableMapOf()
       val userId = "" // User ID
       val avatarPath = "" // Path to user's default avatar resource
       avatars[userId] = avatarPath
       val callCoreView = CallCoreView(context)
       callCoreView.setParticipantAvatars(avatars)
   }
   ```
- **setParticipantAvatars API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | Map | Yes | Maps user IDs to avatar resources.<br>- Key: User's userID.<br>- Value: Absolute path to the user's avatar resource. |

- **Default Avatar Resource:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Default avatar. Use when a user's avatar is not set or fails to load.|

### Custom Loading Animation

Use [setWaitingAnimation](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-waiting-animation.html) to set a GIF animation for users in the waiting state, improving the user experience.

- **setWaitingAnimation Example:**

   ``` java
   private fun setWaitingAnimation() {
       val waitingAnimationPath = "" // Path to waiting animation GIF resource
       val callCoreView = CallCoreView(context)
       callCoreView.setWaitingAnimation(waitingAnimationPath)
   }
   ```
- **setWaitingAnimation API Parameters:**

   |**Parameter**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |path|String|Yes|Absolute path to the GIF animation resource.|

- **Waiting Animation:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Waiting-for-answer animation. Use in group calls when a participant's status is waiting.|

### Add Call Duration Display

You can display call duration in real time using the [activeCall](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/active-call.html) `duration` field.
1. **Subscribe to the data layer:** Observe `CallStore.observerState.activeCall` for updates to the current call.

2. **Bind duration data:** Bind `activeCall.duration` to a UI control. The UI updates automatically—no need to manage a timer manually.

   ``` java
   import android.content.Context
   import androidx.appcompat.widget.AppCompatTextView
   import androidx.core.content.ContextCompat
   import com.tencent.qcloud.tuicore.util.DateTimeUtil
   import io.trtc.tuikit.atomicxcore.api.call.CallStore
   import io.trtc.tuikit.atomicxcore.api.call.CallParticipantStatus
   import kotlinx.coroutines.CoroutineScope
   import kotlinx.coroutines.Dispatchers
   import kotlinx.coroutines.Job
   import kotlinx.coroutines.launch

   class TimerView(context: Context) : AppCompatTextView(context) {
       private var subscribeStateJob: Job? = null

       override fun onAttachedToWindow() {
           super.onAttachedToWindow()
           // 1. Subscribe to activeCall
           registerActiveCallObserver()
       }

       private fun registerActiveCallObserver() {
           subscribeStateJob = CoroutineScope(Dispatchers.Main).launch {
               CallStore.shared.observerState.activeCall.collect { activeCall ->
                   // 2. Bind call duration data, update timer
                   updateDurationView(activeCall)
               }
           }
       }

       private fun updateDurationView(activeCall: CallInfo) {
           val currentDuration = activeCall.duration
           text = DateTimeUtil.formatSecondsTo00(currentDuration.toInt())
       }

       override fun onDetachedFromWindow() {
           super.onDetachedFromWindow()
           subscribeStateJob?.cancel()
       }
   }
   ```

   > **Note：**
   >
   > For more reactive call status data, see [CallState](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/index.html).
   >

## More Features

### Set Avatar and Nickname

Before a call starts, use [setSelfInfo](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-login-store/set-self-info.html) to set your nickname and avatar.
- **setSelfInfo Example:**

   ``` java
   val user = UserProfile()
   user.userID = ""    // Your userId
   user.avatarURL = "" // Avatar URL
   user.nickname = ""  // Nickname to set
   LoginStore.shared.setSelfInfo(user, object : CompletionHandler {
        override fun onSuccess() {
            // Success callback
        }

        override fun onFailure(code: Int, desc: String) {
            // Failure callback
        }
   })
   ```
- **setSelfInfo API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| userProfile | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-user-profile/index.html">UserProfile</a> | Yes | User profile struct.<br>- <code>userID</code> (String): User ID.<br>- <code>avatarURL</code> (String): Avatar URL.<br>- <code>nickname</code> (String): Nickname.<br>See <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-user-profile/index.html">UserProfile</a> for more fields. |
| completion | CompletionHandler | No | Callback for the result of the operation. |

### Switch Layout Mode

Use [setLayoutTemplate](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-layout-template.html) to switch between layout modes. If not set, **CallCoreView** adapts automatically: 1v1 calls use `Float` mode by default, while multi-party calls use `Grid` mode. Layout mode descriptions:
| - <strong>Layout:</strong> Full screen self-view while waiting; after connecting, full screen remote view with self-view as a floating window.<br>- <strong>Interaction:</strong> Floating window supports drag and click-to-swap with the main view. | - <strong>Layout:</strong> Grid layout for all participants, suitable for 2+ users. Supports click-to-enlarge.<br>- <strong>Interaction:</strong> Click any participant's view to enlarge. | - <strong>Layout:</strong> 1v1 shows fixed remote view; multi-party uses active speaker strategy with full screen for the current speaker.<br>- <strong>Interaction:</strong> Waiting state shows self-view; after connecting, call duration is displayed. |

- **setLayoutTemplate Example:**

   ``` java
   private fun setLayoutTemplate() {
       val callCoreView = CallCoreView(context)
       val template = CallLayoutTemplate.Grid
       // Set layout mode
       callCoreView.setLayoutTemplate(template)
       setContentView(callCoreView)
   }
   ```
- **setLayoutTemplate API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| template | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-layout-template/index.html">CallLayoutTemplate</a> | Yes | CallCoreView layout mode.<br>- <code>CallLayoutTemplate.Float</code>: Full screen self-view while waiting; after connecting, full screen remote view with self-view as a floating window.<br>- <code>CallLayoutTemplate.Grid</code>: Grid layout for all members, suitable for 2+ participants, supports click-to-enlarge.<br>- <code>CallLayoutTemplate.Pip</code>: 1v1 fixed remote view; multi-party uses active speaker strategy. |

### Set Default Call Timeout

When making a call with [calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html), set the `timeout` field in [CallParams](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-params/index.html) to specify the waiting timeout.
``` java
val callParams = CallParams()
callParams.timeout = 30 // Set call timeout
CallStore.shared.calls(userIdList, CallMediaType.Video, callParams, null)
```
- **calls API Parameter Reference:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| userIdList | List | Yes | List of target userIds. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Yes | Call media type: audio or video.<br>- <code>CallMediaType.Video</code>: Video call.<br>- <code>CallMediaType.Audio</code>: Audio call. |
| params | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-params/index.html">CallParams</a> | No | Optional call parameters, such as room ID, call invitation timeout, etc.<br>- <code>roomId</code> (String): Room ID, optional.<br>- <code>timeout</code> (Int): Call timeout (seconds).<br>- <code>userData</code> (String): Custom user data.<br>- <code>chatGroupId</code> (String): Chat group ID for group calls.<br>- <code>isEphemeralCall</code> (Boolean): If true, the call is encrypted and not logged. |

### Implement Picture-in-Picture (PiP)

Picture-in-Picture requires Android 8.0 (API 26) or higher. For best results, switch **CallCoreView** to `Pip` layout when entering PiP mode.
- **Start PiP:** Call the system method `enterPictureInPictureMode`.

   ``` java
   private fun enterPictureInPictureModeWithBuild() {
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && hasPipModePermission()) {
           val pictureInPictureParams: PictureInPictureParams.Builder = PictureInPictureParams.Builder()
           val floatViewWidth = resources.getDimensionPixelSize(R.dimen.callkit_video_small_view_width)
           val floatViewHeight = resources.getDimensionPixelSize(R.dimen.callkit_video_small_view_height)
           val aspectRatio = Rational(floatViewWidth, floatViewHeight)
           pictureInPictureParams.setAspectRatio(aspectRatio).build()
           this.enterPictureInPictureMode(pictureInPictureParams.build())
       }
    }
   ```
- **On PiP Entered:** In `onPictureInPictureModeChanged`, set **CallCoreView** layout to **Pip** when entering PiP mode.

   ``` java
   val callCoreView = CallCoreView(context)

   override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean) {
      super.onPictureInPictureModeChanged(isInPictureInPictureMode)
      if (isInPictureInPictureMode) {
         callCoreView.setLayoutTemplate(CallLayoutTemplate.Pip)
      }
   }
   ```
- **Return from PiP:** When returning from PiP (full screen), `onResume` is triggered. Reset the layout based on participant count: use `Float` for 1v1, `Grid` for multi-party.

   ``` java
   val callCoreView = CallCoreView(context)

   override fun onResume() {
      super.onResume()
      val allParticipants = CallStore.shared.observerState.allParticipants.value
       if (allParticipants.size > 2) {
           callCoreView?.setLayoutTemplate(CallLayoutTemplate.Grid)
       } else {
           callCoreView?.setLayoutTemplate(CallLayoutTemplate.Float)
       }
   }
   ```

### Keep Screen Awake During Call

To keep the screen on during a call, use the `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON` flag. This is the recommended approach.
``` java
class CallActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or   // Show when locked
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or   // Dismiss keyguard
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or     // Keep screen on
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON        // Turn screen on
        )

        setContentView(R.layout.activity_call)
    }
}
```

### Play Waiting Ringtone

You can observe call state and play a ringtone while waiting for an answer. Stop the ringtone when the call is answered or ends.
``` java
MainScope().launch {
  CallStore.shared.observerState.selfInfo.collect { selfInfo ->
     if (selfInfo.status == CallParticipantStatus.Accept || selfInfo.status == CallParticipantStatus.None) {
        // Stop ringtone
        return@collect
     }
     if (selfInfo.status == CallParticipantStatus.Waiting) {
        // Play ringtone
     }
}
```

### Enable Background Audio/Video Capture
1. **Configure permissions and service (AndroidManifest.xml):** Starting with Android 9.0 (API 28), you must declare foreground service permissions. Android 14 (API 34) requires explicit service types (microphone and camera).

   ``` java
   <manifest xmlns:android="http://schemas.android.com/apk/res/android">

       <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
       <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
       <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

       <application>
           <service
               android:name=".CallForegroundService"
               android:enabled="true"
               android:exported="false"
               android:foregroundServiceType="camera|microphone" />
       </application>
   </manifest>
   ```
2. **Create a Foreground Service class (CallForegroundService):**

   ``` java
   import android.app.Notification
   import android.app.NotificationChannel
   import android.app.NotificationManager
   import android.app.Service
   import android.content.Context
   import android.content.Intent
   import android.os.Build
   import android.os.IBinder
   import androidx.core.app.NotificationCompat

   class CallForegroundService : Service() {
       companion object {
           private const val NOTIFICATION_ID = 1001
           private const val CHANNEL_ID = "call_foreground_channel"

           fun start(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                   context.startForegroundService(intent)
               } else {
                   context.startService(intent)
               }
           }

           fun stop(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               context.stopService(intent)
           }
       }

       override fun onCreate() {
           super.onCreate()
           createNotificationChannel()
           // Start foreground notification to ensure background capture permission
           startForeground(NOTIFICATION_ID, createNotification())
       }

       override fun onBind(intent: Intent?): IBinder? = null

       private fun createNotification(): Notification {
           return NotificationCompat.Builder(this, CHANNEL_ID)
               .setContentTitle("In Call")
               .setContentText("App is running in the background to keep the call active")
               .setSmallIcon(android.R.drawable.ic_menu_call) // Replace with your app icon
               .setPriority(NotificationCompat.PRIORITY_HIGH)
               .build()
       }

       private fun createNotificationChannel() {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               val channel = NotificationChannel(
                   CHANNEL_ID,
                   "Call Keep-Alive Service",
                   NotificationManager.IMPORTANCE_HIGH
               )
               val manager = getSystemService(NotificationManager::class.java)
               manager.createNotificationChannel(channel)
           }
       }
   }
   ```

## Next Steps

Congratulations! You've completed the "Make a Call" feature. Next, you can implement the **Answer the First Call** feature. See the table below for details:

|**Feature**|**Description**|**Integration Guide**|
|---------|---------|---------|
|**Answer the First Call**|Step-by-step guide to integrating the answer flow, including launching the call UI, and implementing answer and reject controls.|Answering Your First Call|

## FAQs

### Why does the UI show incorrectly when I open other activities after entering Picture-in-Picture?
- **Reason:** Android's PiP mode is based on the task stack. By default, all Activities share the same task stack. If you launch a new Activity during PiP, it may appear in the PiP window, causing UI issues.

- **Solution:** Declare the call Activity as a separate task stack in `AndroidManifest.xml`.

   ``` xml
    <activity
       android:name=".view.CallActivity" <!-- Your call interface -->
       android:launchMode="singleTask"
       android:taskAffinity="${applicationId}.call" />
   ```

### If the callee comes online before the call invitation times out, do they get the incoming call?

For single calls, if the callee comes online within the timeout, they will receive an incoming call invitation. For group calls, up to 20 unhandled group messages are pulled when coming online within the timeout; if a call invitation exists, the incoming call event is triggered.

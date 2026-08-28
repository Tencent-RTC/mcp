This guide walks you through implementing the "answer call" feature using the **AtomicXCore SDK**, leveraging its **DeviceStore**, **CallStore**, and the core UI component **CallCoreView**.

## Core Features

To build multi-party audio/video call features with **AtomicXCore**, you’ll use the following core modules:

|**Module**|**Description**|
|---------|---------|
|[CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html)|Core call view component. Automatically observes CallStore data and renders video, while supporting UI customization such as layout switching, avatar and icon configuration.|
|[CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html)|Manages the call lifecycle: initiate, answer, reject, hang up. Provides real-time access to participant audio/video status, call timer, call records, and more.|
|[DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|Controls audio/video devices: microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, and real-time device status monitoring.|

## Getting Started

### Step 1: Activate the Service

Go to Activate the Service to obtain either the trial or paid version of the SDK.

### Step 2: Integrate the SDK

**Install Components:** Add `api "io.trtc.uikit:atomicx-core:latest.release"` and `api "com.tencent.imsdk:imsdk-plus:8.7.7201"` to your **build.gradle** file, then run **Gradle Sync**.
``` javascript
dependencies {
    api 'io.trtc.uikit:atomicx-core:latest.release'
    api "com.tencent.imsdk:imsdk-plus:8.7.7201"
    // other dependencies...
}
```

### Step 3: Initialize and Log In

To enable the call service, initialize CallStore and log in the user in sequence. CallStore will automatically sync user information after a successful login, entering the ready state. See the flowchart and sample code below:

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
                    // Complete TUICallEngine initialization
                    TUICallEngine.createInstance(context).init(GenerateTestUserSig.SDKAPPID, userId, userSig, null)
                    // Handle login success
                    Log.d("Login", "login success");
                }

                override fun onFailure(code: Int, desc: String) {
                    // Handle login failure
                    Log.e("Login", "login failed, code: $code, error: $desc");
                }
            }
        )
    }
}
```
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| userId | String | Unique identifier for the current user. Only English letters, numbers, hyphens, and underscores are allowed. Avoid simple IDs (e.g., 1, 123) to prevent multi-device login conflicts. |
| sdkAppId | int | Obtain from the <a href="https://trtc.io/login?fro=gt&s_url=https%3A%2F%2Fconsole.trtc.io%2F">Console</a>. |
| userSig | String | Authentication token for TRTC.<br>- Development: Use <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/call/tuicallkit-kt/src/main/java/com/tencent/qcloud/tuikit/tuicallkit/debug/GenerateTestUserSig.kt">GenerateTestUserSig.genTestUserSig</a> or <a href="https://trtc.io/login?s_url=https://console.trtc.io/usersig">UserSig Tool</a> to generate a temporary UserSig.<br>- Production: Always generate UserSig server-side to prevent secret key leakage. See Server-side UserSig Generation for details. For more info, see How to Calculate and Use UserSig. |

## Implement Call Answering

**Ensure the user is logged in before answering calls**. Follow these 6 steps to answer incoming calls:

### Step 1: Create Call Page

Create a call page that launches when an incoming call is received.
1. **Create the call page:** Implement a new Activity to serve as the call interface, triggered upon incoming call.

2. **Bind the call page to** [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html)**:** The CallCoreView component automatically observes [CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) data and renders video, supporting UI customization like layout switching, avatar, and icon configuration.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.view.CallCoreView

   class CallActivity : AppCompatActivity() {
       private var callCoreView: CallCoreView? = null

       // 1. Create the call page container
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // 2. Bind CallCoreView to the call page
           callCoreView = CallCoreView(this)
           setContentView(callCoreView)
       }
   }
   ```

   **CallCoreView Component Features:**

   |**Feature**|**Description**|**Reference**|
   |---------|---------|---------|
   |**Set Layout Mode**|Switches layout modes flexibly. If not set, adapts layout automatically based on participant count.|Layout mode switching|
   |**Set Avatar**|Allows custom avatars for users by providing avatar resource paths.|Custom default avatar|
   |**Set Volume Indicator Icon**|Supports custom volume indicator icons for different volume levels.|Custom volume indicator icon|
   |**Set Network Indicator Icon**|Configures network status indicator icons based on real-time network quality.|Custom network indicator icon|
   |**Set Waiting Animation for Users**|In multi-party calls, supports GIF animations for users waiting to answer.|Custom loading animation|

### Step 2: Add Answer and Reject Buttons

Use [DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html) and [CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) APIs to customize your buttons.
- **DeviceStore:** Controls microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, and monitors device status. Bind methods to button click events and update UI in real time by observing device status changes.

- **CallStore:** Provides core call controls (answer, hang up, reject). Bind methods to button click events and observe call status to keep button visibility in sync with the call phase.

- **Icon Resources:** Download button icons from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/call/tuicallkit-kt/src/main/res). These icons are designed for TUICallKit and are copyright-free.

   |**Icons**|||||||||
   |---------|---------|---------|---------|---------|---------|---------|---------|---------|

- **Implementation for adding "Answer" and "Reject" buttons:**

  1. **Add Answer and Reject Buttons:** Create a bottom button bar container and add "Answer" and "Reject" buttons, binding their click events to the [accept](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/accept.html) and [reject](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/reject.html) methods.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
      import io.trtc.tuikit.atomicxcore.api.call.CallStore

      class CallActivity : AppCompatActivity() {
          private var buttonContainer: LinearLayout? = null
          private var buttonAccept: Button? = null
          private var buttonReject: Button? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // 1. Create the bottom button bar container
              createButtonContainer()
              // 2. Add "Answer" and "Reject" buttons
              addRejectAndAcceptButtons()

              setContentView(buttonContainer)
          }

          // Create the bottom button bar container
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

          // Add "Answer" and "Reject" buttons
          private fun addRejectAndAcceptButtons() {
              createAcceptButton()
              createRejectButton()
              buttonContainer?.addView(buttonAccept)
              buttonContainer?.addView(buttonReject)
          }

          // Create the Answer button
          private fun createAcceptButton() {
              buttonAccept = Button(this).apply {
                  text = "Answer"
                  layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                      marginEnd = dpToPx(8)
                  }
                  setOnClickListener {
                      // 3. Bind accept to Answer button click event
                      CallStore.shared.accept(null)
                  }
              }
          }

          // Create the Reject button
          private fun createRejectButton() {
              buttonReject = Button(this).apply {
                  text = "Reject"
                  layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                      marginStart = dpToPx(8)
                  }
                  setOnClickListener {
                      // 3. Bind reject to Reject button click event
                      CallStore.shared.reject(null)
                  }
              }
          }
      }
      ```
  2. **Destroy the interface when the caller cancels or you reject:** If the caller cancels or the callee rejects, the [onCallEnded](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-ended.html) event is triggered. Listen for this event to promptly close (destroy) the call interface when the call ends.

      ``` java
      import io.trtc.tuikit.atomicxcore.api.call.CallEndReason
      import io.trtc.tuikit.atomicxcore.api.call.CallListener
      import io.trtc.tuikit.atomicxcore.api.call.CallMediaType
      import io.trtc.tuikit.atomicxcore.api.call.CallStore

      class CallActivity : AppCompatActivity() {

          private var callListener: CallListener? = null

          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              // ... other initialization code

              // 1. Listen for call ended events
              addListener()
          }

          private fun addListener() {
              callListener = object : CallListener() {
                  override fun onCallEnded(callId: String, mediaType: CallMediaType, reason: CallEndReason, userId: String) {
                      // 2. Close the page when the call ends
                      finish()
                  }
              }
              callListener?.let { CallStore.shared.addListener(it) }
          }
      }
      ```

      **onCallEnded Event Parameters:**

      |**Parameter**|**Type**|**Description**|
      |---------|---------|---------|
      |callId|String|Unique identifier for this call.|
      |mediaType|[CallMediaType](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html)|Specifies whether it's an audio or video call. - `CallMediaType.Video`: Video call. - `CallMediaType.Audio`: Audio call.|
      |reason|[CallEndReason](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-end-reason/index.html)|Reason for call ending. - `Unknown`: Unknown reason. - `Hangup`: User hung up. - `Reject`: Callee rejected. - `NoResponse`: Callee did not answer in time. - `Offline`: Other party offline. - `LineBusy`: Other party busy. - `Canceled`: Caller canceled before callee answered. - `OtherDeviceAccepted`: Answered on another device. - `OtherDeviceReject`: Rejected on another device. - `EndByServer`: Ended by server.|
      |userId|String|User ID that triggered the end.|

### Step 3: Request Audio/Video Permissions

Check audio/video permissions before connecting the call. If permissions are missing, prompt the user to grant them dynamically.
1. **Declare permissions:** Add camera and microphone permissions in your `AndroidManifest.xml`.

   ``` java
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
2. **Request permissions dynamically:** Request audio/video permissions when an incoming call is received or as needed in your app logic.

   ``` java
   // Dynamically request permissions
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
              Log.d("MainActivity", "Permission granted")
          } else {
              Log.w("MainActivity", "Some permissions denied")
          }
      }
   }
   ```

### Step 4: Incoming Call Notification

Monitor the user's call status and play a ringtone or vibration when an incoming call arrives. Stop the notification after the call is answered or hung up.
1. **Subscribe to data layer:** Listen to `CallStore.observerState.selfInfo` for the current user's status.

2. **Play/stop notification:** If `SelfInfo.Status` is `CallParticipantStatus.Waiting`, play ringtone/vibration. If status is `CallParticipantStatus.Accept`, stop the notification.

   ``` java
   import kotlinx.coroutines.CoroutineScope
   import kotlinx.coroutines.Dispatchers
   import kotlinx.coroutines.Job
   import kotlinx.coroutines.launch

   class MainActivity : AppCompatActivity() {
       private var stateJob: Job? = null

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // 1. Monitor current user's call status
           observeSelfStatus()
       }

       // Monitor current user's call status
       private fun observeSelfStatus() {
           stateJob = CoroutineScope(Dispatchers.Main).launch {
               CallStore.shared.observerState.selfInfo.collect { selfInfo ->
                  // 2. Play/stop incoming call notification
                  if (selfInfo.status == CallParticipantStatus.Waiting) {
                      // Start playing incoming call notification
                  }
                  if (selfInfo.status == CallParticipantStatus.Accept) {
                      // Stop playing incoming call notification
                  }
               }
           }
       }
   }
   ```

### Step 5: Open Media Devices on Incoming Call

When an incoming call is received, use the [onCallReceived](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-received.html) event to determine the media type. For a better experience, pre-open the relevant devices when the call interface is triggered.
1. **Listen for incoming call event:** Subscribe to the `onCallReceived` event.

2. **Open devices based on media type:** For audio calls, open the microphone. For video calls, open both microphone and camera.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
   import io.trtc.tuikit.atomicxcore.api.call.CallMediaType
   import io.trtc.tuikit.atomicxcore.api.call.*

   class MainActivity : AppCompatActivity() {
       private var callListener: CallListener? = null

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // ... other initialization code

           // 1. Listen for incoming call event
           addListener()
       }

       private fun addListener() {
           callListener = object : CallListener() {
               override fun onCallReceived(callId: String, mediaType: CallMediaType, userData: String) {
                   super.onCallReceived(callId, mediaType, userData)
                   // 2. Open devices based on media type
                   openDeviceForMediaType(mediaType)
               }
           }
           callListener?.let { CallStore.shared.addListener(it) }
       }

       private fun openDeviceForMediaType(mediaType: CallMediaType?) {
           mediaType?.let {
               DeviceStore.shared().openLocalMicrophone(null)
               if (mediaType == CallMediaType.Video) {
                   val isFrontCamera = true
                   DeviceStore.shared().openLocalCamera(isFrontCamera, null)
               }
           }
       }
    }
   ```

   **onCallReceived Event Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Unique identifier for this call. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Specifies whether it's an audio or video call.<br>- <code>CallMediaType.Video</code>: Video call.<br>- <code>CallMediaType.Audio</code>: Audio call. |

   **openLocalCamera API Parameters:**

| <strong>Parameter Name</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| isFront | Boolean | Yes | Whether to open the front camera.<br>- <code>true</code>: Open front camera.<br>- <code>false</code>: Open rear camera. |
| completion | CompletionHandler | No | Callback for operation result; returns error code/message if failed. |

   **openLocalMicrophone API Parameters:**

   |**Parameter Name**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |completion|CompletionHandler|No|Callback for operation result; returns error code/message if failed.|

### Step 6: Trigger Call Interface on Incoming Call

Since you already subscribed to the [onCallReceived](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-received.html) event in Step 5, launch the call page in this event:
``` java
private fun addListener() {
   callListener = object : CallListener() {
        override fun onCallReceived(callId: String, mediaType: CallMediaType, userData: String) {
            super.onCallReceived(callId, mediaType, userData)
            // Trigger call page
            val intent = Intent(this@MainActivity, CallActivity::class.java)
            startActivity(intent)
        }
    }
    callListener?.let { CallStore.shared.addListener(it) }
}
```

### Demo Effect

After completing the above 6 steps, your app may look like this:

## Customize Pages

[CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) supports extensive UI customization, including flexible avatar and volume indicator icon replacement. Download these icons directly from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/call/tuicallkit-kt/src/main/res). All icons are designed for TUICallKit and are copyright-free.

### Custom Volume Indicator Icons

Use the [setVolumeLevelIcons](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-volume-level-icons.html) method in [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) to set custom volume indicator icons.

- **setVolumeLevelIcons Sample Code:**

   ``` java
   private fun setIconResourcePath() {
       val volumeLevelIcons = mapOf(VolumeLevel.Mute to "icon resource path")
       val callCoreView = CallCoreView(context)
       callCoreView.setVolumeLevelIcons(volumeLevelIcons)
   }
   ```
- **setVolumeLevelIcons API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | Map | Yes | Mapping of volume levels to icon resources. Key (VolumeLevel):<br>- <code>VolumeLevel.Mute</code>: Microphone muted.<br>- <code>VolumeLevel.Low</code>: Volume (0-25].<br>- <code>VolumeLevel.Medium</code>: Volume (25-50].<br>- <code>VolumeLevel.High</code>: Volume (50-75].<br>- <code>VolumeLevel.Peak</code>: Volume (75-100].<br>Value (String): Icon resource path. |

- **Volume Indicator Icons:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Volume indicator icon. Recommended for `VolumeLevel.Low` or `VolumeLevel.Medium`.|
   ||Mute icon. Recommended for `VolumeLevel.Mute`.|

### Custom Network Indicator Icons

Use the [setNetworkQualityIcons](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-network-quality-icons.html) method in [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) to set custom network status icons.

- **setNetworkQualityIcons Sample Code:**

   ``` java
   private fun setNetworkQualityIcons() {
       val volumeLevelIcons = mapOf(NetworkQuality.BAD to "icon path")
       val callCoreView = CallCoreView(context)
       callCoreView.setNetworkQualityIcons(volumeLevelIcons)
   }
   ```
- **setNetworkQualityIcons API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| icons | Map | Yes | Mapping of network quality levels to icon resources. Key (NetworkQuality):<br>- <code>NetworkQuality.UNKNOWN</code>: Unknown<br>- <code>NetworkQuality.EXCELLENT</code>: Excellent<br>- <code>NetworkQuality.GOOD</code>: Good<br>- <code>NetworkQuality.POOR</code>: Poor<br>- <code>NetworkQuality.BAD</code>: Bad<br>- <code>NetworkQuality.VERY_BAD</code>: Very bad<br>- <code>NetworkQuality.DOWN</code>: Disconnected<br>Value (String): Icon resource path. |

- **Poor Network Indicator Icon:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Poor network indicator icon. Recommended for `NetworkQuality.BAD`, `NetworkQuality.VERY_BAD`, or `NetworkQuality.DOWN`.|

### Custom Default Avatar

Use the [setParticipantAvatars](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-participant-avatars.html) method in [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) to set user avatars. Listen to [allParticipants](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/all-participants.html) in CallStore: set and display avatars when available; show the default avatar if unavailable or failed to load.
- **setParticipantAvatars Sample Code:**

   ``` java
   private fun setParticipantAvatars() {
       val avatars: MutableMap<String, ParticipantAvatarInfo> = mutableMapOf()
       val userId = "" // User ID
       val avatarPath = "" // Default avatar resource path
       avatars[userId] = avatarPath
       val callCoreView = CallCoreView(context)
       callCoreView.setParticipantAvatars(avatars)
   }
   ```
- **setParticipantAvatars API Parameters:**

   |**Parameter**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |icons|Map|Yes|Mapping of user IDs to avatar resource paths. - Key: userID. - Value: Absolute path to avatar resource.|

- **Default Avatar Resource:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Default avatar. Recommended when user avatar is missing or fails to load.|

### Custom Loading Animation

Use the [setWaitingAnimation](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-waiting-animation.html) method in [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) to set custom waiting animations for users.

- **setWaitingAnimation Sample Code:**

   ``` java
   private fun setWaitingAnimation() {
       val waitingAnimationPath = "" // Path to the waiting animation GIF resource
       val callCoreView = CallCoreView(context)
       callCoreView.setWaitingAnimation(waitingAnimationPath)
   }
   ```
- **setWaitingAnimation API Parameters:**

   |**Parameter**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |path|String|Yes|Absolute path to the GIF resource.|

- **Waiting Animation:**

   |**Icon**|**Description**|
   |---------|---------|
   ||Waiting animation for users. Recommended for group calls when user status is waiting to answer.|

### Add Call Timer

Get call duration in real time from the `duration` field in [activeCall](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/active-call.html).
1. **Subscribe to data layer:** Listen to `CallStore.observerState.activeCall` for the current active call.

2. **Bind call timer data:** Bind `activeCall.duration` to your UI control. This field updates reactively—no need to manually manage a timer.

   ``` java
   import android.content.Context
   import androidx.appcompat.widget.AppCompatTextView
   import androidx.core.content.ContextCompat
   import com.tencent.qcloud.tuicore.util.DateTimeUtil
   import io.trtc.tuikit.atomicx.R
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
           // 1. Subscribe to activeCall in the data layer
           registerActiveCallObserver()
       }

       override fun onDetachedFromWindow() {
           super.onDetachedFromWindow()
           subscribeStateJob?.cancel()
       }

       private fun registerActiveCallObserver() {
           subscribeStateJob = CoroutineScope(Dispatchers.Main).launch {
               CallStore.shared.observerState.activeCall.collect { activeCall ->
                   // 2. Bind call timer data, update call duration
                   updateDurationView(activeCall)
               }
           }
       }

       private fun updateDurationView(activeCall: CallInfo) {
           val currentDuration = activeCall.duration
           text = DateTimeUtil.formatSecondsTo00(currentDuration.toInt())
       }
   }
   ```

   > **Note：**
   >
   > For more info on reactive call state data, see [CallState](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-state/index.html).
   >

## More Features

### Set Avatar and Nickname

Before starting a call, use [setSelfInfo](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-login-store/set-self-info.html) to set your nickname and avatar.
- **setSelfInfo Sample Code:**

   ``` java
   val user = UserProfile()
   user.userID = ""    // Your userId
   user.avatarURL = "" // Avatar url
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
| userProfile | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-user-profile/index.html">UserProfile</a> | Yes | User information struct.<br>- <code>userID</code> (String): User ID.<br>- <code>avatarURL</code> (String): Avatar URL.<br>- <code>nickname</code> (String): User nickname. See <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-user-profile/index.html">UserProfile</a> for more fields. |
| completion | CompletionHandler | No | Callback for operation result. |

### Switch Layout Modes

Use [setLayoutTemplate](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/set-layout-template.html) to switch layout modes. If not set, CallCoreView adapts automatically: **Float** mode for 1v1 calls, **Grid** mode for multi-party calls.
| - <strong>Layout Logic:</strong> Full screen shows own video while waiting; after answering, full screen shows the other party's video, own video floats as a small window.<br>- <strong>Interaction:</strong> Supports dragging and swapping windows. | - <strong>Layout Logic:</strong> All participant videos are tiled in a grid. Suitable for 2+ participants; supports click-to-enlarge.<br>- <strong>Interaction:</strong> Click to enlarge a participant's video. | - <strong>Layout Logic:</strong> In 1v1, always shows the other party's video; in multi-party, uses active speaker strategy.<br>- <strong>Interaction:</strong> Shows own video while waiting, displays call timer after answering. |

- **setLayoutTemplate Sample Code:**

   ``` java
   private fun setLayoutTemplate() {
       val callCoreView = CallCoreView()
       val template = CallLayoutTemplate.Grid
       // Set layout mode
       callCoreView.setLayoutTemplate(template)
       setContentView(callCoreView)
   }
   ```
- **setLayoutTemplate API Parameters:**

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Required</strong> | <strong>Description</strong> |
| --- | --- | --- | --- |
| template | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-layout-template/index.html">CallLayoutTemplate</a> | Yes | CallCoreView's layout mode<br>- <code>CallLayoutTemplate.float</code> ：<br>- <strong>Layout:</strong> While waiting, display your own video full screen. After answering, show the remote video full screen and your own video as a floating window.<br>- <strong>Interaction:</strong> Drag the small window or tap to swap big/small video.<br>- <code>CallLayoutTemplate.grid</code> ：<br>- <strong>Layout:</strong> All participant videos are tiled in a grid. Best for 2+ participants. Tap to enlarge a video.<br>- <strong>Interaction:</strong> Tap a participant to enlarge their video.<br>- <code>CallLayoutTemplate.pip</code> :<br>- <strong>Layout:</strong> In 1v1, remote video is fixed; in multi-party, the active speaker is shown full screen.<br>- <strong>Interaction:</strong> Shows your own video while waiting, displays call timer after answering. |

### Entering Picture-in-Picture Mode

Implementing Picture-in-Picture (PiP) mode requires Android 8.0 (API level 26) or higher. For an optimal user experience, it is recommended to switch your layout to a PiP template when entering this mode.
- **Entering Picture-in-Picture Mode :** To initiate PiP, call the system method `enterPictureInPictureMode`.

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
- **Handling the PiP Transition :** When the system successfully enters PiP mode, the `onPictureInPictureModeChanged` callback is triggered. You must update the **CallCoreView** layout to `CallLayoutTemplate.Pip` at this stage.

   ``` java
   val callCoreView = CallCoreView(context)

   override fun onPictureInPictureModeChanged(isInPictureInPictureMode: Boolean) {
      super.onPictureInPictureModeChanged(isInPictureInPictureMode)
      if (isInPictureInPictureMode) {
         callCoreView.setLayoutTemplate(CallLayoutTemplate.Pip)
      }
   }
   ```
- **Restoring Full-Screen Layout :** When the user returns to the app from PiP (restoring full screen), the onResume callback will be triggered. You should reset the layout based on the current number of participants:

  - **1 v 1 Calls:** Use `CallLayoutTemplate.Float`.

  - **Group Calls:** Use `CallLayoutTemplate.Grid`.

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

### Keep the Screen Awake During Calls

Keeping the screen active during a call is a fundamental requirement for communication apps. The simplest and most recommended approach in Android is using the `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON` flags.
``` java
class CallActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Apply flags to handle screen behavior during calls
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or   // Show activity over lock screen
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or   // Dismiss non-secure keyguards
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or     // Prevent the screen from sleeping
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON        // Turn the screen on when activity starts
        )

        setContentView(R.layout.activity_call)
    }
}
```

### Enable Background Audio/Video Capture

To maintain audio and video capture when the app is in the background, you must implement a Foreground Service. Starting from Android 9.0 (API 28), foreground service permissions are required, and Android 14 (API 34) mandates declaring specific service types for the camera and microphone.
1. **Configure Permissions and Service ( AndroidManifest.xml ) :** Declare the necessary foreground service permissions and specify the service types within the <application> tag.

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
2. **Create the Foreground Service Class ( CallForegroundService ) :** The service ensures the system does not kill the app's process while it is in the background by displaying a persistent notification.

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

           /**
            * Start the foreground service to maintain call connectivity
            */
           fun start(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                   context.startForegroundService(intent)
               } else {
                   context.startService(intent)
               }
           }

           /**
            * Stop the service once the call ends
            */
           fun stop(context: Context) {
               val intent = Intent(context, CallForegroundService::class.java)
               context.stopService(intent)
           }
       }

       override fun onCreate() {
           super.onCreate()
           createNotificationChannel()
           // Start foreground with notification to secure background capture permissions
           startForeground(NOTIFICATION_ID, createNotification())
       }

       override fun onBind(intent: Intent?): IBinder? = null

       private fun createNotification(): Notification {
           return NotificationCompat.Builder(this, CHANNEL_ID)
               .setContentTitle("Call in Progress")
               .setContentText("App is running in the background to maintain the call.")
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
               manager?.createNotificationChannel(channel)
           }
       }
   }
   ```

## Next Steps

Congratulations! You have implemented the answer call feature. Next, see Make Your First Call to add call initiation to your app.

## FAQs

### Why does the UI appear distorted or show the wrong screen after navigating to another page while in PiP mode?
- **Cause :** Android's Picture-in-Picture (PiP) mode operates based on the Task Stack. By default, all Activities in an app share the same task stack. If you launch a new Activity while the app is in PiP mode, that new page is pushed onto the current stack. Consequently, the new screen incorrectly attempts to render within the tiny PiP window, leading to UI anomalies.

- **Solution :** Declare the Call Activity as a separate task with its own affinity in the AndroidManifest.xml. This ensures the call remains isolated in its own window regardless of other app navigation.

   ``` java
    <activity
       android:name=".view.CallActivity"
       android:launchMode="singleTask"
       android:taskAffinity="${applicationId}.call" />
   ```

### Can an invitee receive a call event if they go offline and then come back online within the call timeout period?

For one-on-one calls, if the callee comes online within the timeout, they will receive the incoming call invitation. For group calls, if the callee comes online within the timeout, up to 20 unprocessed group messages will be retrieved, and if there is a call invitation, the incoming call event will be triggered.

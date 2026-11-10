---
sync_node_id: '207623927851286528'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建多人会议"
  - "接入概览"
  - "接入概览（Android）"
product: "room"
---
This document provides an integration guide for the core features of `AtomicXCore`, enabling developers to quickly build multi-party audio/video conference rooms. The SDK follows a pure API architecture, giving you full control over UI customization while letting you focus on business logic and user experience.

## Key Features

**AtomicXCore** offers three essential modules for developing multi-party audio/video conference rooms:
- `RoomStore`: Centralized room management, including scheduling, creating, joining rooms, and in-room calling.

- `RoomParticipantStore`: Participant management within a room, covering admin settings, host transfer, removing participants, device control, and more.

- `RoomParticipantView`: Video view for displaying participant streams within the room.

## Prerequisites

### Step 1: Activate the Service

See Activate the Service to obtain either the trial or paid version of the SDK.

### Step 2: Environment Requirements
- Android 5.0 (SDK API level 21) or higher

- Gradle 8.0 or higher

- Devices running Android 5.0 or above

- JDK version 17, 18, or 19

### Step 3: Integrate AtomicXCore SDK

Add the following dependencies to your **build.gradle** file, then sync your Gradle project.
``` gradle
dependencies {
    implementation 'io.trtc.uikit:atomicx-core:3.6.1.66'
    api "com.tencent.imsdk:imsdk-plus:8.7.7201"
}
```

### Step 4: Implement Login Logic

Call `LoginStore.shared.login` in your project to authenticate. **This step is required before using any feature of** `AtomicXCore`**.**

> **Important:**
> We recommend calling `LoginStore.shared.login` only after your own user account login succeeds, to ensure clear and consistent login flow.
> 

``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.login.LoginStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import android.util.Log

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        LoginStore.shared.login(
            this,              // context
            1400000001,        // Replace with your project's sdkAppID
            "test_001",        // Replace with your project's userID
            "xxxxxxxxxxx",     // Replace with your project's userSig
            object : CompletionHandler {
                override fun onSuccess() {
                    // Login succeeded
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

**Login API Parameter Description:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>Int32</code> | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| <code>userID</code> | <code>String</code> | Unique user identifier. Use only English letters, numbers, hyphens, and underscores. Avoid using simple IDs like <code>1</code> or <code>123</code> to prevent multi-device login conflicts. |
| <code>userSig</code> | <code>String</code> | Authentication ticket for Tencent Cloud.<br>- For development: Use <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Assistant Tool</a> for a temporary UserSig.<br>- For production: Always generate UserSig server-side to prevent secret key leaks. See Calculating UserSig on the Server.<br>For more details, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Building a Basic Multi-User Room

### Step 1: Host Creates and Joins a Room

Follow these steps to quickly set up a multi-party room.

> **Tip：**
> For a full implementation of host room creation and joining logic, see [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room), specifically [RoomMainActivity.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/RoomMainActivity.kt) and [RoomMainView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/RoomMainView.kt).
> 

#### 1. Creating and Joining a Room

**Implementation Steps:**
   1. **Configure Room Initialization Parameters:** Use `CreateRoomOptions` to set the room name and password.

   2. **Preset Room Permissions:** Define permissions for all members, such as muting, disabling cameras, etc.

   3. **Create and Join Room:** Call `RoomStore.createAndJoinRoom` to perform the combined operation.

      **Sample Code:**

      ``` java
      import android.os.Bundle
      import android.util.Log
      import androidx.appcompat.app.AppCompatActivity
      import io.trtc.tuikit.atomicxcore.api.CompletionHandler
      import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions
      import io.trtc.tuikit.atomicxcore.api.room.RoomStore
      import io.trtc.tuikit.atomicxcore.api.room.RoomType
      
      class RoomMainActivity : AppCompatActivity() {
          private val roomID = "test_room_001"
          private val roomType = RoomType.STANDARD
      
          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              createAndJoinRoom()
          }
      
          private fun createAndJoinRoom() {
              // 1. Configure room initialization parameters
              val options = CreateRoomOptions()
              options.roomName = "My Discussion"        // Room display name
              options.password = ""                     // Room entry password (leave blank if not needed)
      
              // 2. Preset room permissions for all members (commonly used for formal meetings)
              options.isAllCameraDisabled = false
              options.isAllMessageDisabled = false
              options.isAllMicrophoneDisabled = false
              options.isAllScreenShareDisabled = false
      
              // 3. Create and join room
              // If the room does not exist, it is created and joined automatically
              RoomStore.shared().createAndJoinRoom(roomID, roomType, options, object : CompletionHandler {
                  override fun onSuccess() {
                      // Room created and joined successfully. You can now subscribe to room status or open local camera/microphone.
                      Log.d("Room", "Room created and joined successfully")
                  }
      
                  override fun onFailure(code: Int, desc: String) {
                      // Room creation/join failed (possible permission, network, or parameter errors)
                      Log.e("Room", "Failed to create and join room [Error code: $code]: $desc")
                  }
              })
          }
      }
      ```

      **createAndJoinRoom API Parameter Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0-48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>STANDARD</code>: Standard room (default).<br>- <code>WEBINAR</code>: Large seminar room.<br>Use <code>STANDARD</code> for most multi-party conferences. |
| <code>options</code> | CreateRoomOptions | Yes | - Room creation configuration object.<br>- For usage details, see <a href="#CreateRoomOptions Struct Details:">CreateRoomOptions struct</a> documentation. |
| <code>completion</code> | CompletionHandler | No | Callback for room creation/join result. Returns error code and message on failure. |

      **CreateRoomOptions Struct Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional, defaults to empty).<br>- Length: 0-60 bytes.<br>- Supports English, Chinese, numbers, special characters. |
| <code>password</code> | String | No | - Room password (empty string means no password).<br>- Length: 0-32 bytes.<br>- Recommended: 4-8 digit numbers for easy mobile input. If set, users must enter password to join. Avoid storing sensitive info in plaintext. |
| <code>isAllMicrophoneDisabled</code> | Boolean | No | Disable microphones for all members:<br>- True: disabled.<br>- False: allowed (default). |
| <code>isAllCameraDisabled</code> | Boolean | No | Disable cameras for all:<br>- True: disabled.<br>- False: allowed (default). |
| <code>isAllScreenShareDisabled</code> | Boolean | No | Disable screen sharing for all:<br>- True: disabled.<br>- False: allowed (default). |
| <code>isAllMessageDisabled</code> | Boolean | No | Mute all chat messages:<br>- True: disabled.<br>- False: allowed (default). |

#### 2. Opening Camera and Microphone

After entering the room, activate the local camera and microphone by calling `openLocalCamera` and `openLocalMicrophone` from `DeviceStore`.
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

class RoomMainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        openDevices()
    }

    private fun openDevices() {
        // Open front camera
        DeviceStore.shared().openLocalCamera(true, completion = null)
        // Open microphone
        DeviceStore.shared().openLocalMicrophone(completion = null)
    }
}
```

   > **Note:**
   > 
   > On Android 6.0 or later, you must dynamically request permissions before opening devices. See the FAQ for [details on dynamic permission requests.](#why-can't-the-remote-side-see-video-after-calling-devicestore-apis-to-open-camera.2Fmicrophone.3F)
   > 

**openLocalCamera API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>isFront</code> | Boolean | Yes | Enable the front camera.<br>- true: Front camera.<br>- false: Rear camera. |
| <code>completion</code> | CompletionHandler | No | Callback for camera open result. Returns error code and message if failed. |

#### 3. End a Room

To end the room, call `endRoom` from `RoomStore`. All participants are notified when the room ends.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

class RoomMainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        endRoom()
    }

    private fun endRoom() {
        // Permanently end the current room. Usually only the host can perform this action.
        // All members are removed and audio/video capture is stopped.
        RoomStore.shared().endRoom(object : CompletionHandler {
            override fun onSuccess() {
                Log.d("Room", "Room ended successfully")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.e("Room", "Failed to end room [Error code: $code]: $desc")
            }
        })
    }
}
```

### Step 2: Participant Joins Room

Participants can join a room in just a few steps to interact with others in real-time audio/video.

#### 1. Join a Room

Call `joinRoom` from `RoomStore` to enter a room. Other users will receive a participant join notification.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

class RoomMainActivity : AppCompatActivity() {
    private val roomID = "test_room_001"
    private val roomType = RoomType.STANDARD

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        joinRoom()
    }

    private fun joinRoom() {
        // Prepare join parameters
        val targetRoomID = this.roomID
        val roomPassword = "" // If not set, use empty string or null

        // Join an existing room. This checks room existence, ban status, and password.
        RoomStore.shared().joinRoom(targetRoomID, roomType, roomPassword, object : CompletionHandler {
            override fun onSuccess() {
                Log.d("Room", "Joined room successfully")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.e("Room", "Failed to join room [Error code: $code]: $desc")
            }
        })
    }
}
```

**joinRoom API Parameter Details:**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- Length: 0-48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>STANDARD</code>: Standard room (default).<br>- <code>WEBINAR</code>: Large seminar room.<br>Use <code>STANDARD</code> for multi-party conferences. |
| <code>password</code> | String | No | - Room password (empty string means no password).<br>- Length: 0-32 bytes.<br>- Recommended: 4-8 digit numbers for easy input. If set, users must enter the password. Avoid storing sensitive info in plaintext. |
| <code>completion</code> | CompletionHandler | No | Callback for join result. Returns error code and message if failed. |

#### 2. Open Camera and Microphone

For code samples, see the [Open Camera and Microphone](#2.-opening-camera-and-microphone) section above.

#### 3. Leave the Room

To leave the room, call `leaveRoom` from `RoomStore`. Other participants will be notified when someone leaves.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

class RoomMainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        leaveRoom()
    }

    private fun leaveRoom() {
        // leaveRoom is for regular members or the host to leave the room.
        // Unlike endRoom, calling leaveRoom as host only removes you; the room remains.
        RoomStore.shared().leaveRoom(object : CompletionHandler {
            override fun onSuccess() {
                Log.d("Room", "Left room successfully")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.e("Room", "Failed to leave room [Error code: $code]: $desc")
            }
        })
    }
}
```

### Step 3: Bind Video Views

The `RoomParticipantView` component in **AtomicXCore SDK** provides a complete solution for video rendering. It supports real-time display of both local camera feeds and remote participant streams, and is easy to integrate.

> **Tip：**
> `RoomParticipantView` is the primary view for rendering participant video streams. For more flexible layouts, see [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room), especially [RoomMainView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/RoomMainView.kt).
> 

**Implementation Steps:**
1. **Subscribe to Participant Data:** Listen to `RoomParticipantStore.state.participantList` for participant state changes.

2. **Automatic State Sync:** The participant list updates reactively as room state changes.

3. **Initialize Views:** Create `RoomParticipantView` instances based on participant data and bind video logic.

4. **Integrate with UI:** Add views to your layout and activate rendering.

   **Sample Code:**

   ``` java
   import android.os.Bundle
   import android.widget.FrameLayout
   import androidx.appcompat.app.AppCompatActivity
   import androidx.lifecycle.lifecycleScope
   import io.trtc.tuikit.atomicxcore.api.room.RoomParticipant
   import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore
   import io.trtc.tuikit.atomicxcore.api.view.RoomParticipantView
   import io.trtc.tuikit.atomicxcore.api.view.VideoStreamType
   import kotlinx.coroutines.launch
   
   class RoomMainActivity : AppCompatActivity() {
       private val roomID = "test_room_001"
       private lateinit var container: FrameLayout
       private val cellSize by lazy { resources.displayMetrics.widthPixels / 3 }
       // RoomParticipantStore must be created for each room: RoomParticipantStore.create(roomID: String)
       private val participantStore = RoomParticipantStore.create(roomID)
   
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           container = FrameLayout(this)
           setContentView(container)
           subscribeParticipantState()
           participantStore.getParticipantList("", null)
       }
   
       private fun subscribeParticipantState() {
           lifecycleScope.launch {
               participantStore.state.participantList.collect { participants ->
                   updateParticipantView(participants)
               }
           }
       }
   
       private fun updateParticipantView(list: List<RoomParticipant>) {
           container.removeAllViews()
           list.take(9).forEachIndexed { index, participant ->
               val view = RoomParticipantView(this@RoomMainActivity).apply {
                   init(VideoStreamType.CAMERA, participant)
               }
               val params = FrameLayout.LayoutParams(cellSize, cellSize).apply {
                   leftMargin = (index % 3) * cellSize
                   topMargin = (index / 3) * cellSize
               }
               view.setActive(true)
               container.addView(view, params)
           }
       }
   }
   ```

   **RoomParticipantView init() API Parameter Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>streamType</code> | VideoStreamType | Yes | Video stream type:<br>- <code>CAMERA</code>: Camera stream.<br>- <code>SCREEN</code>: Screen sharing stream. |
| <code>participant</code> | RoomParticipant | Yes | Real-time participant object, includes identity, status, device permissions.<br>See <a href="#RoomParticipant Struct Details:">RoomParticipant struct for details</a>. |

   **RoomParticipant Struct Details:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>userID</code> | String | Yes | Unique user identifier. |
| <code>userName</code> | String | No | User nickname. |
| <code>avatarURL</code> | String | No | URL of user's avatar. |
| <code>nameCard</code> | String | No | - User's name card/remark.<br>- Length: 0-32 bytes.<br>- Supports English, Chinese, numbers, special characters. |
| <code>role</code> | ParticipantRole | No | Role in room:<br>- <code>OWNER</code>: Host.<br>- <code>ADMIN</code>: Admin.<br>- <code>GENERAL_USER</code>: Regular user (default) |
| <code>roomStatus</code> | RoomParticipantStatus | No | Business status:<br>- <code>SCHEDULED</code>: Scheduled (default).<br>- <code>IN_CALLING</code>: Calling.<br>- <code>CALL_TIMEOUT</code>: Timeout.<br>- <code>CALL_REJECTED</code>: Rejected.<br>- <code>IN_ROOM</code>: In room . |
| <code>microphoneStatus</code> | DeviceStatus | No | Microphone status:<br>- OFF: Off (default).<br>- ON: On. |
| <code>cameraStatus</code> | DeviceStatus | No | Camera status:<br>- OFF: Off (default).<br>- ON: On. |
| <code>screenShareStatus</code> | DeviceStatus | No | Screen sharing status:<br>- OFF: Off (default).<br>- ON: On. |
| <code>isMessageDisabled</code> | Boolean | No | Muted status:<br>- True: disabled.<br>- False: enabled (default). |
| <code>metaData</code> | MutableMap | No | - Business custom extension data, synchronized with participant state.<br>- Limit: 0-60 bytes. Supports only JSON string. |

### Step 4: Listen to Room Events

Subscribe to room events by calling `RoomStore.addRoomListener`. Implement the `RoomListener` interface to handle events.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

class RoomMainActivity : AppCompatActivity() {

    // RoomListener receives room lifecycle events: calling, dissolution, scheduling reminders, etc.
    private val roomListener = object : RoomListener() {
        override fun onRoomEnded(roomInfo: RoomInfo) {
            Log.d("Room", "Current room has ended")
        }
        // ... handle other RoomListener events ...
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        subscribeRoomEvents()
    }

    private fun subscribeRoomEvents() {
        RoomStore.shared().addRoomListener(roomListener)
    }

    override fun onDestroy() {
        super.onDestroy()
        // Remove listener to prevent memory leaks
        RoomStore.shared().removeRoomListener(roomListener)
    }
}
```

## Demo effects

After completing the above setup, you will have a multi-party video rendering room without UI interaction.

|**Demo effect**||
|---------|---------|

## Enhance Multi-Party Room Features

To support additional requirements, **AtomicXCore SDK** provides the following features to enrich conference room scenarios.

|**Multi-User Room Feature**|**Feature Description**|**Implementation Guide**|
|---------|---------|---------|
|Update Room Information|Host can update room details, such as name and password.|Room Management|
|In-Meeting Calling|Host or admin can invite users who are not in the room to join.|In-Meeting Calling|
|Room Scheduling|Schedule rooms in advance, set start/end times, and add participants.|Room Scheduling|
|In-Room Member Management|Host can manage participants: assign admins, remove users, control individual audio/video.|Member Management|

## API Documentation

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create & join, join, leave, end room, update/get room info, scheduling, invite members, listen for room events|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|
|**RoomParticipantStore**|Participant management: assign admin, transfer host, get participant list, remove from room, control devices, apply for device access|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-store/index.html)|
|**RoomParticipantView**|Single participant video view: bind/update participant info, update stream type, set active state, etc.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-room-participant-view/index.html)|

## FAQ

### How do I resolve the allowBackup compilation error after integrating the code?

- **Cause**: Conflicts occur when multiple modules define the `allowBackup` attribute in their `AndroidManifest.xml`.

- **Solution**: Remove the `allowBackup` attribute from your project's `AndroidManifest.xml` or set it to `false` to disable backup/restore. Add `tools:replace="android:allowBackup"` to the application node to enforce your own setting. See the example below:

   

### Why does RoomParticipantView show no video even though it's bound to participant info and stream type?
- **Check** `setActive`: Make sure `RoomParticipantView` is visible and you called `RoomParticipantView.setActive(true)`.

- **Check RoomParticipant**: Verify that the `cameraStatus` of the bound `RoomParticipant` is `ON`.

- **Check Network**: Ensure the device has a stable network connection.

### Why can't the remote side see video after calling DeviceStore APIs to open camera/microphone?

**Check if you requested system camera and microphone permissions**

On Android 6.0 and above, dynamically request permissions as follows:
1. Declare permissions in AndroidManifest.xml.

   ``` xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   ```
2. Request permissions at runtime.

   ``` java
   import android.Manifest
   import android.content.pm.PackageManager
   import android.os.Bundle
   import android.util.Log
   import androidx.appcompat.app.AppCompatActivity
   import androidx.core.app.ActivityCompat
   import androidx.core.content.ContextCompat
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
   
   class RoomMainActivity : AppCompatActivity() {
   
       private val PERMISSION_REQUEST_CODE = 1001
   
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           checkAndRequestPermissions()
       }
   
       private fun checkAndRequestPermissions() {
           val permissions = arrayOf(
               Manifest.permission.CAMERA,
               Manifest.permission.RECORD_AUDIO
           )
   
           val permissionsToRequest = permissions.filter {
               ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
           }
   
           if (permissionsToRequest.isNotEmpty()) {
               ActivityCompat.requestPermissions(
                   this,
                   permissionsToRequest.toTypedArray(),
                   PERMISSION_REQUEST_CODE
               )
           } else {
               // Permissions granted, can open devices
               openDevices()
           }
       }
   
       override fun onRequestPermissionsResult(
           requestCode: Int,
           permissions: Array<out String>,
           grantResults: IntArray
       ) {
           super.onRequestPermissionsResult(requestCode, permissions, grantResults)
           if (requestCode == PERMISSION_REQUEST_CODE) {
               if (grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                   // All permissions granted, call openDevices()
                   openDevices()
               } else {
                   // Some permissions denied
                   Log.e("Permission", "Some permissions denied")
               }
           }
       }
   
       private fun openDevices() {
           // Open front camera
           DeviceStore.shared().openLocalCamera(isFront = true, completion = null)
           // Open microphone
           DeviceStore.shared().openLocalMicrophone(completion = null)
       }
   ```

### Why does audio/video capture stop after switching to background on Android 14+?

Android 14 and above require a foreground service with the proper service type to capture camera/microphone data in the background. Without this, capture will not work.
1. Declare `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_CAMERA`, and `FOREGROUND_SERVICE_MICROPHONE` permissions and service in AndroidManifest.xml.

   ``` xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
   
   <service
       android:name=".MediaCaptureService"
       android:foregroundServiceType="camera|microphone" />
   ```
2. Start the foreground service after launching your interface.

   ``` java
   import android.app.NotificationChannel
   import android.app.NotificationManager
   import android.app.Service
   import android.content.Intent
   import android.content.pm.ServiceInfo
   import android.os.Bundle
   import android.os.IBinder
   import androidx.appcompat.app.AppCompatActivity
   import androidx.core.app.NotificationCompat
   
   class MainActivity : AppCompatActivity() {
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           startForegroundService(Intent(this, MediaCaptureService::class.java))
       }
   }
   
   class MediaCaptureService : Service() {
       override fun onCreate() {
           super.onCreate()
           // Create notification channel
           val channel = NotificationChannel("media", "Media Capture", NotificationManager.IMPORTANCE_LOW)
           getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
   
           // Build notification
           val notification = NotificationCompat.Builder(this, "media")
               .setContentTitle("In Audio/Video Call")
               .setSmallIcon(android.R.drawable.ic_menu_call)
               .build()
   
           // Start foreground service and specify camera/microphone type (required for Android 14+)
           startForeground(1, notification,
               ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
       }
   
       override fun onBind(intent: Intent?): IBinder? = null
   }
   ```

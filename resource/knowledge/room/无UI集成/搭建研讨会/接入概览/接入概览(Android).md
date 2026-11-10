---
sync_node_id: '207623896615837696'
nav_path:
  - "视频会议 SDK"
  - "无 UI 集成"
  - "搭建研讨会"
  - "接入概览"
  - "接入概览（Android）"
product: "room"
---
Build participant, role, and device-control capabilities for **AtomicXCore**-powered rooms in minutes. This guide walks developers through integrating AtomicXCore’s core features for large-scale webinars, company-wide meetings, and online education. The UI is fully customizable, so you can focus on business logic and refining the end-to-end user experience.

> **What’s the difference between a standard conference and a webinar?**
> 
> - **Standard Conference**: Ideal for small to medium collaborative environments. All participants have equal audio/video privileges, with interactive features such as screen sharing and member management.
> - **Webinar**: Designed for large-scale live presentations, supports unlimited concurrent audience entry. Audience members can use the "Raise Hand" feature to request guest access and participate in discussions. The system is optimized for high-concurrency chat, supporting tens of thousands of participants and professional presentation needs.

## Feature Overview

|**Host**|**Guest**|**Audience**|
|---------|---------|---------|
|Host can start high-definition audio/video streaming, share screens, and manage participants.|Guest can enable their microphone for real-time voice discussions and sharing.|Supports unlimited concurrent audience entry, ultra-low latency viewing, and high-frequency chat. Audience can use "Raise Hand" to request guest access.|
||||

## Core Features

`AtomicXCore` provides all the capabilities you need to build a professional webinar solution:
- **Dual-role system:** Room members are classified as **Guest** (can speak via audio/video) and **Audience** (view-only). The host can dynamically invite audience members to participate or remove guests from the stage.

- **Screen sharing:** Host can share their screen with all participants in real time to assist presentations and facilitate communication.

- **Member and permission management:** Includes guest list, audience list, admin controls, mute/video-off, and other moderation tools.

- **Large-scale message interaction:** Optimized message throttling for rooms with tens of thousands of participants, ensuring stable real-time chat and live comments.

   Core modules of `AtomicXCore` include:

- `RoomStore`: Handles room management tasks, including create, join, and lifecycle operations.

- `RoomParticipantStore`: Manages room participants, including admin settings, guest/audience management, removing participants, device control, and more.

## Preparation

### Step 1: Activate the Service

.**

> **Note:**
> Webinar functionality is built on live streaming capabilities. Make sure you have **claimed the TUILiveKit trial version or activated the official TUILiveKit version** for full functionality.
> 

### Step 2: Environment Requirements
- Android 5.0 (SDK API level 21) or above

- Gradle 8.0 or above

- Devices running Android 5.0+

- Requires JDK version 17, 18, or 19

### Step 3: Integrate the AtomicXCore SDK

Add the following dependencies to your `build.gradle` file, then sync your Gradle project:
``` gradle
dependencies {
    implementation 'io.trtc.uikit:atomicx-core:4.0.6.181'
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

Login API Parameters:
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>Int</code> | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| <code>userID</code> | <code>String</code> | Unique ID for the current user. Use only English letters, numbers, hyphens, and underscores. Avoid simple IDs like <code>1</code> or <code>123</code> to prevent multi-device login conflicts. |
| <code>userSig</code> | <code>String</code> | Authentication token for Tencent Cloud.<br>- For development, generate with <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Helper Tool</a>.<br>- For production, always generate UserSig server-side to protect your SecretKey. See Server-side UserSig Generation and <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

## Setting Up a Webinar Room

### Step 1: Create and Join a Webinar Room

Follow the steps below to set up a webinar room quickly.

> **Tip:**
> For business logic related to host room creation and joining, see the open-source [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room) project. Refer to [RoomMainActivity.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/RoomMainActivity.kt) and [RoomMainView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/RoomMainView.kt) for complete implementation details.
> 

#### 1. Creating and Joining a Room

**Implementation Steps:**
   1. **Configure Room Initialization Parameters:** Create a `CreateRoomOptions` object and set room name and configuration.

   2. **Create and Join Room:** Call `RoomStore.createAndJoinRoom` to execute the operation.

      **Example:**

      ``` java
      import android.os.Bundle
      import android.util.Log
      import androidx.appcompat.app.AppCompatActivity
      import io.trtc.tuikit.atomicxcore.api.CompletionHandler
      import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions
      import io.trtc.tuikit.atomicxcore.api.room.RoomStore
      import io.trtc.tuikit.atomicxcore.api.room.RoomType
      
      class RoomMainActivity : AppCompatActivity() {
          private val roomID = "webinar_123456"
      
          override fun onCreate(savedInstanceState: Bundle?) {
              super.onCreate(savedInstanceState)
              createAndJoinRoom()
          }
      
          private fun createAndJoinRoom() {
              val options = CreateRoomOptions()
              options.roomName = "My Webinar"        // Room display name
              options.password = ""                  // Not supported for webinar rooms
      
              // Permission presets for initial room state
              options.isAllCameraDisabled = false
              options.isAllMessageDisabled = false
              options.isAllMicrophoneDisabled = false
              options.isAllScreenShareDisabled = false
      
              RoomStore.shared().createAndJoinRoom(roomID, RoomType.WEBINAR, options, object : CompletionHandler {
                  override fun onSuccess() {
                      Log.d("Room", "Successfully created and joined webinar room")
                  }
      
                  override fun onFailure(code: Int, desc: String) {
                      Log.e("Room", "Failed to create and join webinar room [Error code: $code]: $desc")
                  }
              })
          }
      }
      ```

      **createAndJoinRoom API Parameters**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- 0-48 bytes.<br>- Use numbers, English letters, underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>- <code>STANDARD</code>: Standard room.<br>- <code>WEBINAR</code>: Webinar room.<br>Use <code>WEBINAR</code> for webinar scenarios. |
| <code>options</code> | CreateRoomOptions | Yes | - Room configuration object.<br>- See <a href="#CreateRoomOptions Struct">CreateRoomOptions Struct</a> documentation. |
| <code>completion</code> | CompletionHandler | No | Callback for operation result; returns error code/message on failure. |

      **CreateRoomOptions Struct**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | - Room name (optional, defaults to empty).<br>- 0-60 bytes.<br>- Supports English/Chinese, numbers, special characters. |
| <code>password</code> | String | No | - Room password (empty means no password).<br>- 0-32 bytes.<br>- Use 4-8 digit numbers for easy input. Avoid plain-text sensitive data. Passwords not supported for webinars; leave empty. |
| <code>isAllMicrophoneDisabled</code> | Boolean | No | Disable microphones for all. Only host/admin can open mic. Guests are muted by default.<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllCameraDisabled</code> | Boolean | No | Disable cameras for all. Only host/admin can open camera. Guests are video-off by default.<br>- true: Disabled.<br>- false: Enabled (default). |
| <code>isAllScreenShareDisabled</code> | Boolean | No | Disable screen sharing for all (only host/admin can share):<br>-  <code>true</code>: Disabled.<br>-  <code>false</code>: Enabled (default). |
| <code>isAllMessageDisabled</code> | Boolean | No | Disable chat messages for all (mute):<br>-  <code>true</code>: Disabled.<br>-  <code>false</code>: Enabled (default). |

#### 2. Role-Based Media Controls

Roles have distinct media device permissions:
- Host: Can turn on the camera and microphone, publish audio/video, and share the screen.

- Guest: Can turn on the microphone and publish audio for real-time discussion.

- Audience: View-only; cannot turn on or publish audio/video.

   After entering the room, call `DeviceStore.openLocalCamera` and `DeviceStore.openLocalMicrophone` to enable local audio or video capturing. To start screen sharing, call startScreenShare (the camera must be turned off before screen sharing).

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
           // Start screen sharing (camera must be closed first)
           // DeviceStore.shared().closeLocalCamera()
           // DeviceStore.shared().startScreenShare()
       }
   }
   ```

   > **Note:**
   > 
   > In webinar mode, mobile devices support only one upstream video stream. When the camera is enabled, screen sharing must be disabled, and vice versa.
   > 

   **openLocalCamera API Parameters:**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>isFront</code> | Boolean | Yes | Use front camera:<br>- true: Enable front camera.<br>- false: Enable rear camera . |
| <code>completion</code> | CompletionHandler | No | Callback for camera activation result; returns error code/message on failure. |

#### 3. End a Room

To end the room, the host calls `RoomStore.endRoom`. All room members will receive a room ended event.
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
        // Only the host can end the room. All members are removed and audio/video capture is stopped.
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

### Step 2: Join a Webinar Room

#### 1. Join a Room

To join an existing room, call `RoomStore.joinRoom`.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomStore
import io.trtc.tuikit.atomicxcore.api.room.RoomType

class RoomMainActivity : AppCompatActivity() {
    private val roomID = "webinar_123456"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        joinRoom()
    }

    private fun joinRoom() {
        val targetRoomID = this.roomID

        RoomStore.shared().joinRoom(targetRoomID, RoomType.WEBINAR, completion = object : CompletionHandler {
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

**joinRoom API Parameters**
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomID</code> | String | Yes | - Unique room identifier.<br>- 0-48 bytes.<br>- Use numbers, English letters, underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Yes | Room type:<br>-  <code>STANDARD</code>: Standard room.<br>-  <code>WEBINAR</code>: Webinar room.<br>Use <code>WEBINAR</code> for webinar scenarios. |
| <code>password</code> | String | No | - Room password (empty means no password).<br>- 0-32 bytes.<br>- Use 4-8 digits for mobile input. Avoid plain-text sensitive data. Passwords not supported for webinars; leave empty. |
| <code>completion</code> | CompletionHandler | No | Callback for operation result; returns error code/message on failure. |

#### 2. Leave a Room

To leave a room, call `RoomStore.leaveRoom`.
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
        // leaveRoom is used by ordinary members or the host to exit the room. The room remains if the host leaves.
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

### Step 3: Bind a Video View

The `RoomView` component encapsulates streaming logic for webinars. Simply render the `RoomView` component on your page to enable webinar room audio/video features. Pair video rendering with TUIRoomKit components.

`RoomView` built-in capabilities:
- Host: Supports video and screen sharing.

- Guest: Automatically plays the host’s real-time audio/video stream.

- Audience: Automatically plays ultra-low latency live streams, providing smooth viewing even with massive concurrency..

   > **Tip:**
   > 
   > `RoomView` is a video rendering component for room streams. For full implementation details, see [RoomView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomView.kt) in the open-source [TUIRoomKit](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/room) project.
   > 

   ``` xml
   <com.trtc.uikit.roomkit.view.main.RoomView
       android:id="@+id/room_view"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       app:layout_constraintStart_toStartOf="parent"
       app:layout_constraintTop_toTopOf="parent" />
   ```

### Step 4: Manage Guest and Audience Roles

As host or admin, call `RoomParticipantStore.promoteAudienceToParticipant` to promote an audience member to guest.

To demote a guest to audience, call `RoomParticipantStore.demoteParticipantToAudience`.
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.room.RoomParticipantStore

fun promoteAudienceToParticipant(userID: String) {
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    participantStore.promoteAudienceToParticipant(userID = userID, completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Test", "Successfully promoted to guest")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to promote to guest [Error code: $code]: $desc")
        }
    })
}

fun demoteParticipantToAudience(userID: String) {
    val participantStore = RoomParticipantStore.create(roomID = "webinar_123456")

    participantStore.demoteParticipantToAudience(userID = userID, completion = object : CompletionHandler {
        override fun onSuccess() {
            Log.d("Test", "Successfully demoted to audience")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e("Test", "Failed to demote to audience [Error code: $code]: $desc")
        }
    })
}
```

### Step 5: Listen to Room Events

After joining a room, subscribe to passive room events by calling `RoomStore.addRoomListener` and handling events in `RoomListener`.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.room.RoomInfo
import io.trtc.tuikit.atomicxcore.api.room.RoomListener
import io.trtc.tuikit.atomicxcore.api.room.RoomStore

class RoomMainActivity : AppCompatActivity() {
    private val roomListener = object : RoomListener() {
        override fun onRoomEnded(roomInfo: RoomInfo) {
            Log.d("Room", "The current room has ended")
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
        RoomStore.shared().removeRoomListener(roomListener)
    }
}
```

## API Documentation

|**Store/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**RoomStore**|Complete room lifecycle management: create & join, join, leave, end room, update/get room info, and listen to passive events (such as room disband, room info update, etc.).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-store/index.html)|
|**RoomParticipantStore**|In-room member management: assign admin, transfer host, retrieve guest list, retrieve audience list, remove members, control guest devices.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.room/-room-participant-store/index.html)|

## FAQs

### Why am I seeing a compilation error about allowBackup after integrating the SDK?

- **Cause:** The `allowBackup` attribute is defined in multiple modules' `AndroidManifest.xml` files, resulting in a conflict.

- **Solution:** Remove the `allowBackup` attribute from your project's `AndroidManifest.xml` or set it to `false` to disable backup and restore. To override settings from other modules, add `tools:replace="android:allowBackup"` to your application's manifest node. Example fix:

   

### Why can't the other party see video after enabling devices via DeviceStore API?

**Check whether camera and microphone permissions have been requested**

On Android 6.0 and above, you must request permissions dynamically:
1. Declare permissions in AndroidManifest.xml:

   ``` xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   ```
2. Request permissions at runtime:

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
                   openDevices()
               } else {
                   Log.e("Permission", "Some permissions were denied")
               }
           }
       }
   
       private fun openDevices() {
           DeviceStore.shared().openLocalCamera(isFront = true, completion = null)
           DeviceStore.shared().openLocalMicrophone(completion = null)
       }
   ```

### Why is there no video/audio when capturing in the background on Android 14 and above?

On Android 14+, apps that capture camera or microphone data in the background must start a foreground service and declare the corresponding service type. Otherwise, capture will not work. Solution:
1. Declare `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_CAMERA`, and `FOREGROUND_SERVICE_MICROPHONE` permissions and the service in AndroidManifest.xml.

   ``` xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
   
   <service
       android:name=".MediaCaptureService"
       android:foregroundServiceType="camera|microphone" />
   ```
2. Start the background capture service after launching the interface.

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
           val channel = NotificationChannel("media", "Media Capture", NotificationManager.IMPORTANCE_LOW)
           getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
   
           val notification = NotificationCompat.Builder(this, "media")
               .setContentTitle("Audio/Video Call in Progress")
               .setSmallIcon(android.R.drawable.ic_menu_call)
               .build()
   
           startForeground(1, notification,
               ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
       }
   
       override fun onBind(intent: Intent?): IBinder? = null
   }
   ```

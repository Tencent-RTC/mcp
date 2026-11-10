---
sync_node_id: '207623890922070016'
nav_path:
  - "视频会议 SDK"
  - "含 UI 集成"
  - "研讨会"
  - "快速接入"
  - "Android"
product: "room"
---
This guide explains how to integrate the TUIRoomKit Webinar scenario into your application. The Webinar scenario enables real-time interaction between hosts, guests, and audiences of up to tens of thousands, delivering ultra-low latency streaming and high-throughput message handling.

> **What’s the difference between a standard conference and a webinar?**
> 
> - **Standard Conference**: Designed for small to medium-sized collaborative scenarios where all participants have equal Audio/Video permissions. Features like screen sharing and member management enable full interaction.
> - **Webinar**: Built for large-scale live presentations, supporting unlimited audience entry. Audiences can use the Raise Hand feature to apply to become a guest and join the discussion. The system is optimized for high-concurrency messaging in scenarios with tens of thousands of participants, meeting the needs of professional presentations and interactions.

## Feature Overview

|**Host**|**Guest**|**Audience**|
|---------|---------|---------|
|Host can start high-definition audio/video streaming, share screens, and manage participants.|Guest can enable their microphone for real-time voice discussions and sharing.|Supports unlimited concurrent audience entry, ultra-low latency viewing, and high-frequency chat. Audience can use "Raise Hand" to request guest access.|
||||

## Prerequisites

### Activate the Service

Follow the instructions in Activate the Service to **claim the TUILiveKit trial version or activate the official TUILiveKit version**. Then, go to [Application Management](https://console.trtc.io/app) to obtain the following information:
- **SDKAppID**: Application identifier used by TRTC for billing and statistics.

- **SDKSecretKey**: Application secret key used to initialize the configuration file.

   > **Note:**
   > 
   > The webinar scenario is built on underlying live streaming capabilities. To use webinar features, you must **claim the TUILiveKit trial version or activate the official TUILiveKit version** to ensure all related features work properly.
   > 

### Environment Setup
- Android 5.0 (SDK API level 21) or higher

- Gradle 8.0 or higher

- Devices running Android 5.0 or above

- JDK 17, 18, or 19

## Quick Integration

### Step 1: Download TUIRoomKit Component

Clone or download the code from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android). Copy the `room` and `atomic_x` subdirectories to the same directory level as your project's `app` folder.

### Step 2: Project Configuration

#### 1. Import TUIRoomKit Component

Add the following configuration to your project's root `settings.gradle.kts` or `settings.gradle` to import the `tuiroomkit` component.
``` java
include(":tuiroomkit")
project(":tuiroomkit").projectDir = File(settingsDir, "room/tuiroomkit")

include(":atomic_x")
project(":atomic_x").projectDir = File(settingsDir, "atomic_x")
```

#### 2. Add the Component Dependency

In your app's `build.gradle.kts` (or `build.gradle`), add the following dependency declaration:
``` java
dependencies {
    // Add tuiroomkit dependency
    api(project(":tuiroomkit"))
}
```

   > **Note:**
   > 
   > TUIRoomKit already includes TRTC SDK, IM SDK, and other common libraries as dependencies. No additional configuration is needed.
   > 

#### 3. Configure Proguard Rules

Because the SDK uses Java reflection, add the following rules to your `proguard-rules.pro` file to prevent obfuscation and ensure functionality.
``` java
-keep class com.tencent.** { *; }
-keep class com.tencent.beacon.** { *; }
-keep class com.tencent.cloud.iai.lib.** { *; }
-keep class com.tencent.qimei.** { *; }
-keep class com.tencent.xmagic.** { *; }
-keep class com.tcmediax.** { *; }

# Gson serialization/deserialization framework rules
-keep class com.google.gson.** { *; }
```

#### 4. Modify AndroidManifest.xml

To resolve attribute conflicts during AndroidManifest merging, add `tools:replace="android:allowBackup"` and `android:allowBackup="false"` to the ` `node in` app/src/main/AndroidManifest.xml`:
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <!-- Add this configuration to override SDK settings -->
    <application
        android:allowBackup="false"
        tools:replace="android:allowBackup" />
</manifest>
```

#### 5. Complete Project Sync

After these steps, Android Studio typically displays a **Sync Now** button. Click it to synchronize your project. If not prompted, manually click the sync button in the toolbar. Once syncing completes, the IDE finishes build configuration and indexing, and you can start using TUIRoomKit in your project.
   

### Step 3: Login

After integrating the code, you must log in before using TUIRoomKit features. Verify all parameters are correct:

> **Note:**
> The sample code demonstrates direct API calls for login. In production, always call the AtomicXCore login service **after completing your own user authentication and login logic**. This ensures proper integration with your user management and permission systems and avoids issues from premature login calls.
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

**Login API Parameter Description:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>sdkAppID</code> | <code>Int</code> | Obtain from <a href="https://console.trtc.io/app">TRTC Console > Application Management</a>. |
| <code>userID</code> | <code>String</code> | Unique identifier for the current user. Only English letters, numbers, hyphens, and underscores are allowed. To avoid multi-device login conflicts, <strong>do not use</strong> <code>1</code>, <code>123</code> <strong>or other simple IDs</strong>. |
| <code>userSig</code> | <code>String</code> | Authentication ticket for Tencent Cloud.<br>- For development: Use <code>GenerateTestUserSig.genTestSig</code> or the <a href="https://console.trtc.io/usersig">UserSig Assistant Tool</a> for a temporary UserSig.<br>- For production: Always generate UserSig server-side to prevent secret key leaks. See Calculating UserSig on the Server.<br>For more details, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

### Step 4: Set Avatar and Nickname

For first-time login, set the avatar and nickname using the `setSelfInfo` API on `LoginStore`:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.login.LoginStore
import io.trtc.tuikit.atomicxcore.api.login.UserProfile

private val TAG = "Test"

fun setSelfInfo() {
    val userProfile = UserProfile(
        userID = "test_001",        // The userID used for login
        nickname = "tom",           // Set nickname
        avatarURL = "http://xxx.png" // Set avatar URL
    )

    LoginStore.shared.setSelfInfo(userProfile, object : CompletionHandler {
        override fun onSuccess() {
            Log.d(TAG, "setSelfInfo success")
        }

        override fun onFailure(code: Int, desc: String) {
            Log.e(TAG, "setSelfInfo failed code:$code, message:$desc")
        }
    })
}
```

**setSelfInfo API Parameter Description:**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| <code>userProfile</code> | UserProfile | Yes | Core user information:<br>- userID: User ID to set.<br>- nickname: Nickname.<br>- avatarURL: Avatar URL . |
| <code>completion</code> | CompletionHandler | No | Callback for result. Returns error code and message on failure. |

### Step 5: Create a Webinar Room

The `RoomMainView` component provides the core interface for multi-party audio/video rooms. The example below shows how to embed `RoomMainView` in your app as a host.

#### Implementation Steps
1. **Load creation view:** Instantiate `RoomMainView` with lazy loading.

2. **Configure entry settings:** Set auto-enable options for audio/video devices when entering the room.

3. **Initialize main room page:** Set up the main room page as a host.

4. **Add the view to Activity:** In your `Activity`'s `onCreate` method, add `RoomMainView` and fill the layout.

#### Sample Code
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.roomkit.view.RoomMainView
import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions
import io.trtc.tuikit.atomicxcore.api.room.RoomType

// MainActivity represents the Activity where you load the main room page
class MainActivity : AppCompatActivity() {
    private val roomID = "webinar_123456"

    // 1 Load creation view
    private val roomView: RoomMainView by lazy {
        RoomMainView(this).apply {
            // 2 Configure entry settings
            val config = RoomMainView.ConnectConfig(
                autoEnableMicrophone = true, // Enable microphone on room entry
                autoEnableCamera = true,     // Enable camera on room entry
                autoEnableSpeaker = true     // Enable speaker on room entry
            )

            val options = CreateRoomOptions(roomName = "roomName") // Room name
            val behavior = RoomMainView.RoomBehavior.Create(options)
            // 3 Initialize main room page
            init(roomID, RoomType.WEBINAR, behavior, config)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 4 Add view to Activity
        setContentView(roomView)
    }
}
```

**RoomMainView init function parameter details:**
| Parameter | Type | Description |
| --- | --- | --- |
| <code>roomID</code> | String | Unique room identifier.<br>Length: 0–48 bytes.<br>Use numbers, English letters (case-sensitive), underscores (_), hyphens (-). Avoid spaces and Chinese characters. |
| <code>roomType</code> | RoomType | Room type:<br>- <code>STANDARD</code>: Standard room.<br>- <code>WEBINAR</code>: Large webinar room.<br>Use <code>WEBINAR</code> for webinar scenarios. |
| <code>behavior</code> | RoomBehavior | Initialization source.<br>- Create: Host creates room (requires creation options; see CreateRoomOptions).<br>- Join: Member joins room |
| <code>config</code> | ConnectConfig | Controls which audio/video devices are enabled on room entry. |

**ConnectConfig parameter details:**
| Parameter | Type | Description |
| --- | --- | --- |
| autoEnableMicrophone | Boolean | Enable microphone on room entry.<br>- true: enabled (default).<br>- false: disabled. |
| autoEnableCamera | Boolean | Enable camera on room entry.<br>- true: enabled (default).<br>- false: disabled. |
| autoEnableSpeaker | Boolean | Enable speaker on room entry.<br>- true: enabled (default).<br>- false: disabled. |

##### CreateRoomOptions struct details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| <code>roomName</code> | String | No | Room name (optional, defaults to empty string); 0–60 bytes; supports Chinese, English, numbers, special characters |
| <code>password</code> | String | No | Room password (empty means no password); 0–32 bytes; recommend 4–8 digits for mobile entry. Password feature not supported for webinars; leave blank. |
| <code>isAllMicrophoneDisabled</code> | Boolean | No | Disable microphone for all members. Only host/admin can enable microphone; panelists disabled by default.<br>- true: disabled.<br>- false: not disabled (default). |
| <code>isAllCameraDisabled</code> | Boolean | No | Disable camera for all members. Only host/admin can enable camera; panelists disabled by default.<br>- true: disabled.<br>- false: not disabled (default). |
| <code>isAllScreenShareDisabled</code> | Boolean | No | Disable screen sharing for all members. Only host/admin can share screen.<br>- true: disabled.<br>- false: not disabled (default). |
| <code>isAllMessageDisabled</code> | Boolean | No | Disable chat messages (mute) for all members. Regular members cannot send text messages.<br>- true: disabled.<br>- false: not disabled (default). |

### Step 6: Join a Room

The following example shows how to embed `RoomMainView` in your app for audience members.

#### Implementation Steps
1. **Load entry view:** Instantiate `RoomMainView` with lazy loading.

2. **Configure entry settings:** Set auto-enable options for audio/video devices if needed.

3. **Initialize main room page:** Set up the main room page as an audience member.

4. **Add the view to Activity:** In your `Activity`'s `onCreate` method, add `RoomMainView` and fill the layout.

   > **Note:**
   > 
   > When using TUIRoomKit to enter a large webinar room, the room ID must start with `webinar_`.
   > 

#### Sample Code
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.roomkit.view.RoomMainView
import io.trtc.tuikit.atomicxcore.api.room.RoomType

// MainActivity represents the Activity where you load the main room page
class MainActivity : AppCompatActivity() {
    private val roomID = "webinar_123456"

    // 1 Load entry view
    private val roomView: RoomMainView by lazy {
        RoomMainView(this).apply {
            // 2 Initialize main room page
            init(roomID, RoomType.WEBINAR, RoomMainView.RoomBehavior.Join)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 4 Add view to Activity
        setContentView(roomView)
    }
}
```

For parameter descriptions.

## Core Features

Once you've integrated `RoomMainView`, your app will have a complete webinar page—including member management, audio/video controls, screen sharing, live comments, video display, and room information—covering all TUIRoomKit core features.

## Customize UI

The `RoomMainView` main room page is highly customizable. You can tailor the UI to fit your product and business needs. The following overview details each view component in `RoomMainView` to help you adjust quickly.

**Component Details in RoomMainView**

|Component|Description|Customization Suggestions|
|---------|---------|---------|
|[RoomMainView](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/RoomMainView.kt)|Main room container, coordinates layout and data flow of subcomponents|Adjust background, safe area adaptation, and component visibility logic|
|[RoomTopBarView](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomTopBarView.kt)|Top navigation bar: room info, camera/audio controls, exit button|Replace icons, adjust background transparency, add custom buttons (recording, windowed mode)|
|[RoomView](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomView.kt)|Video stream display area, handles webinar streaming logic and auto-plays panelist streams|Modify layout, size, empty state view, video stream widgets|
|[RoomBottomBarView](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomBottomBarView.kt)|Bottom toolbar: microphone, camera, screen sharing, hand raise list, member management buttons|Rearrange button order and style (color, size); add business features (in-meeting call, beauty filters)|

## Customize Icons

Once TUIRoomKit is integrated, you can directly replace icon resources to match your product’s scenario and interaction requirements.

**Common Image File List**

|Icon|Filename|Description|
|---------|---------|---------|
||roomkit_ic_camera_off.png|Camera off icon|
||roomkit_ic_camera_on.png|Camera on icon|
||roomkit_ic_microphone_off.png|Microphone off icon|
||roomkit_ic_microphone_on.png|Microphone on icon|
||roomkit_icon_user_room_manager.png|Microphone on icon|
||roomkit_ic_video_seat_owner.png|Room owner icon|

## Customize Texts

TUIRoomKit manages UI text display using Android XML resource files. Modify UI strings directly in the XML file as needed:

## FAQs

### Do I need to call login every time I enter a room?

No. Typically, you only need to call `LoginStore.shared.login` once. We recommend linking both `LoginStore.shared.login` and `LoginStore.shared.logout` to your own login logic.

### Why is there no video or audio when collecting audio/video in the background on Android 14 or above?

On Android 14 and above, if your app collects camera or microphone data in the background, you must start a foreground service and declare the relevant service type. Otherwise, data collection will not work. Follow these steps:
1. In AndroidManifest.xml, declare permissions `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_CAMERA`, 

   and `FOREGROUND_SERVICE_MICROPHONE`, and define the service:

   ``` xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
   
   <service
       android:name=".MediaCaptureService"
       android:foregroundServiceType="camera|microphone" />
   ```
2. Start the foreground service after launching your interface:

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
           // 1. Create notification channel
           val channel = NotificationChannel("media", "Media Capture", NotificationManager.IMPORTANCE_LOW)
           getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
   
           // 2. Build notification
           val notification = NotificationCompat.Builder(this, "media")
               .setContentTitle("In Audio/Video Call")
               .setSmallIcon(android.R.drawable.ic_menu_call)
               .build()
   
           // 3. Start foreground service, specify camera and microphone types (Android 14+ required)
           startForeground(1, notification,
               ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
       }
   
       override fun onBind(intent: Intent?): IBinder? = null
   }
   ```

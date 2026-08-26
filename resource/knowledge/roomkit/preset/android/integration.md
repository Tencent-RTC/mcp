TUIRoomKit is a comprehensive multi-party audio and video conferencing solution built on TRTC. It provides a complete set of UI components along with all the core functionality you need to get up and running quickly.

This documentation walks you through integrating TUIRoomKit into your project to enable reliable multi-party audio/video conferencing. You'll also find step-by-step guides for customizing image assets, localizing UI text, and configuring other options—everything you need to build audio/video experiences that align with your brand.

## Prerequisites

### Activate the Service

To get started, follow [Activate the Service](https://trtc.io/zh/document/59973) to access the TUIRoomKit trial version and retrieve your **SDKAppID** and **SDKSecretKey**.
- **SDKAppID**: Required. The application identifier used by TRTC for billing and analytics.

- **SDKSecretKey**: The application secret key for initializing key information in configuration files.

### Environment Setup
- Android 5.0 (SDK API level 21) or later

- Gradle 8.0 or higher

- Devices running Android 5.0 or above

- JDK version 17, 18, or 19

## Quick Integration

### Step 1: Download the TUIRoomKit Component

Clone or download the repository from [GitHub](https://github.com/Tencent-RTC/TUIKit_Android). Copy the `room` and `atomic_x` subdirectories to the same directory level as your Android project's `app` folder.

### Step 2: Configure the Project

#### 1. Import the TUIRoomKit Component

In your project’s root directory, add the following to your `settings.gradle.kts` or `settings.gradle` file to include the `tuiroomkit` component.
``` java
include(":tuiroomkit")
project(":tuiroomkit").projectDir = File(settingsDir, "room/tuiroomkit")

include(":atomic_x")
project(":atomic_x").projectDir = File(settingsDir, "atomic_x")
```

#### 2. Add Component Dependencies

Find the `build.gradle.kts` (or `build.gradle`) file inside the `app` directory, and declare the dependency for the newly added **tuiroomkit** component.
``` java
dependencies {
    // Add tuiroomkit dependency
    api(project(":tuiroomkit"))
}
```

   > **Note****:**
   >
   > TUIRoomKit includes dependencies on TRTC SDK, IM SDK, and other common libraries by default. You do not need to configure these separately.
   >

#### 3. Configure Proguard Rules

Because the SDK uses Java reflection internally, add the following to your `proguard-rules.pro` file to prevent obfuscation of essential classes and ensure normal operation.
``` java
-keep class com.tencent.** { *; }
-keep class com.tencent.beacon.** { *; }
-keep class com.tencent.cloud.iai.lib.** { *; }
-keep class com.tencent.qimei.** { *; }
-keep class com.tencent.xmagic.** { *; }
-keep class com.tcmediax.** { *; }

# Google serialization/deserialization framework Gson library related rules
-keep class com.google.gson.** { *; }

```

#### 4. Modify AndroidManifest.xml

To prevent attribute conflicts during AndroidManifest merging at build time, add `tools:replace="android:allowBackup"` and `android:allowBackup="false"` to the ` `node in your` app/src/main/AndroidManifest.xml`, overriding settings from the component.
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <!-- Add the following configuration to override settings from dependent SDKs -->
    <application
        android:allowBackup="false"
        tools:replace="android:allowBackup" />
</manifest>
```

#### 5. Complete Project Sync

After completing the above steps, Android Studio will usually prompt you to **Sync Now**. Click this button to synchronize your project. If the sync prompt does not appear, manually click the sync button in the toolbar. Once synced, Android Studio completes project configuration and indexing, enabling you to use the TUIRoomKit component.

### Step 3: Log In

After integrating the code, complete the login process. This step is **required to use TUIRoomKit features**—you must log in successfully before accessing any functionality. Verify that all parameters are set correctly:

> **Note:**
> The sample code calls the login API directly. In production scenarios, always call AtomicXCore's login service **after** completing your own user authentication and login workflow. This ensures correct business logic flow, prevents data inconsistencies, and integrates seamlessly with your user management and permission systems.
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

**Login API Parameter Description**
| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Int | Get this from <a href="https://console.trtc.io/app">TRTC console > Application management</a>. |
| UserID | String | The unique ID for the current user. Must contain only English letters, numbers, hyphens, and underscores. |
| userSig | String | A ticket for Tencent Cloud authentication. Please note:<br>- <strong>Development Environment</strong>: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a UserSig or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- <strong>Production Environment</strong>: To prevent key leakage, you must use a server-side method to generate UserSig. For details, see Generating UserSig on the Server.<br>For more information, see <a href="https://www.tencentcloud.com/document/product/647/35166">How to Calculate and Use UserSig</a>. |

### Step 4: Set Avatar and Nickname

First-time users do not have avatar or nickname information by default. Set user profile information with the `setSelfInfo` API in `LoginStore`:
``` java
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.login.LoginStore
import io.trtc.tuikit.atomicxcore.api.login.UserProfile

private val TAG = "Test"

fun setSelfInfo() {
    val userProfile = UserProfile(
        userID = "test_001",        // The userID you have logged in with
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

**setSelfInfo API Parameter Description**
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| userProfile | UserProfile | Yes | User profile model, includes:<br>- userID: User ID to set<br>- nickname: Nickname<br>- avatarURL: Avatar URL |
| completion | CompletionHandler | No | Callback for the result of setting user profile. If failed, returns error code and message. |

### Step 5: Create a Room

In TUIRoomKit, `RoomMainView` serves as the core interface, offering complete multi-party audio/video conference functionality. The following example shows how to integrate `RoomMainView` as a room owner.

#### Implementation Steps
1. **Load Room Creation View**: Instantiate `RoomMainView` lazily.

2. **Build Room Entry Configuration**: Specify whether to auto-enable audio/video devices on entry.

3. **Initialize Room Main Page**: Set up the room main page as a room owner.

4. **Add the View to the Activity**: In your Activity’s `onCreate`, add `RoomMainView` and set it to fill the layout.

#### Sample Code
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.roomkit.view.RoomMainView
import io.trtc.tuikit.atomicxcore.api.room.CreateRoomOptions

// MainActivity represents the Activity where you load the room main page
class MainActivity : AppCompatActivity() {

    // 1 Load the room creation view
    private val roomView: RoomMainView by lazy {
        RoomMainView(this).apply {
            // 2 Build room entry configuration
            val config = RoomMainView.ConnectConfig(
                autoEnableMicrophone = true, // Automatically enable microphone upon entering
                autoEnableCamera = true,     // Automatically enable camera upon entering
                autoEnableSpeaker = true     // Automatically enable speaker upon entering
            )

            val options = CreateRoomOptions(roomName = "roomName") // Room name
            val behavior = RoomMainView.RoomBehavior.Create(options)
            // 3 Initialize the room main page
            init("roomID", behavior, config)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 4. Add the view to the Activity
        setContentView(roomView)
    }
}
```

**RoomMainView init Function Parameter Details**
| Parameter | Type | Description |
| --- | --- | --- |
| roomID | String | - Unique room identifier.<br>- Length: 0–48 bytes.<br>- Use only numbers, English letters (case-sensitive), underscores (_), and hyphens (-). Avoid spaces and Chinese characters. |
| roomType | RoomType | Room type:<br>- <code>STANDARD</code>: Standard room.<br>- <code>WEBINAR</code>: Webinar room.<br>Use <code>STANDARD</code> for regular conference rooms. |
| behavior | RoomBehavior | Initialization behavior:<br>- Create: Room owner creates the room (requires room creation configuration; see CreateRoomOptions Structure Details).<br>- Join: Participant joins the room. |
| config | ConnectConfig | Configuration for audio/video device controls upon room entry. |

**ConnectConfig Parameter Details**
| Parameter | Type | Description |
| --- | --- | --- |
| autoEnableMicrophone | Boolean | Auto-enable microphone on entry:<br>- true: Automatically enabled (default).<br>- false: Not auto-enabled. |
| autoEnableCamera | Boolean | Auto-enable camera on entry:<br>- true: Automatically enabled (default).<br>- false: Not auto-enabled. |
| autoEnableSpeaker | Boolean | Auto-enable speaker on entry:<br>- true: Automatically enabled (default).<br>- false: Not auto-enabled. |

##### CreateRoomOptions Structure Details
| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| roomName | String | No | - Room name (optional, defaults to empty string).<br>- Length: 0–60 bytes.<br>- Supports Chinese/English, numbers, special characters. |
| password | String | No | - Room password ("" means no password).<br>- Length: 0–32 bytes.<br>- Recommended: 4–8 digits for easy input. Once set, others must enter the password to join. Don’t store sensitive info in plain text. |
| isAllMicrophoneDisabled | Boolean | No | Disable microphones for all participants. Only the room owner/admin can enable microphones; others are restricted:<br>- true: Disabled.<br>- false: Not disabled (default). |
| isAllCameraDisabled | Boolean | No | Disable cameras for all participants. Only the room owner/admin can enable cameras; others are restricted:<br>- true: Disabled.<br>- false: Not disabled (default). |
| isAllScreenShareDisabled | Boolean | No | Disable screen sharing for all participants. Only the room owner/admin can share screens:<br>- true: Disabled.<br>- false: Not disabled (default). |
| isAllMessageDisabled | Boolean | No | Disable chat messages for all participants (mute) Regular participants cannot send text messages:<br>- true: Disabled.<br>- false: Not disabled (default). |

### Step 6: Join a Room

The example below demonstrates how to embed `RoomMainView` as a participant.

#### Implementation Steps
1. **Load Room Creation View**: Instantiate `RoomMainView` lazily.

2. **Build Room Entry Configuration**: Set auto-enable options for audio/video devices.

3. **Initialize Room Main Page**: Set up the room main page as a participant.

4. **Add the View to the Activity**: In your Activity’s `onCreate`, add `RoomMainView` and use layout to fill the view.

#### Sample Code
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.trtc.uikit.roomkit.view.RoomMainView

// MainActivity represents the Activity where you load the room main page
class MainActivity : AppCompatActivity() {

    // 1 Load the room creation view
    private val roomView: RoomMainView by lazy {
        RoomMainView(this).apply {
            // 2 Build room entry configuration
            val config = RoomMainView.ConnectConfig(
                autoEnableMicrophone = true, // Automatically enable microphone upon entering
                autoEnableCamera = true,     // Automatically enable camera upon entering
                autoEnableSpeaker = true     // Automatically enable speaker upon entering
            )

            val behavior = RoomMainView.RoomBehavior.Join
            // 3 Initialize the room main page
            init("roomID", behavior, config)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 4. Add the view to the Activity
        setContentView(roomView)
    }
}
```

For detailed parameter descriptions, see RoomMainView init Function Parameter Details and ConnectConfig Parameter Details.

## Core Features

After integrating `RoomMainView`, you gain a complete multi-party audio/video conference page with member management, device controls, and room information display. These are the core features provided by TUIRoomKit.

## Customize the UI

The `RoomMainView` page offers rich features and high customizability. Adjust the UI to meet your product requirements and business scenarios. Below are the main view components in `RoomMainView` to help you quickly identify areas for customization.

**RoomMainView Component Details**
| Component | Function Description | Customization Suggestions |
| --- | --- | --- |
| <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/RoomMainView.kt">RoomMainView</a> | Serves as the primary container for the room, managing layout and data flow across all child components. | Allows customization of the overall background,<br>adapts to device safe areas,<br>and controls component visibility logic. |
| <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomTopBarView.kt">RoomTopBarView</a> | Provides the top navigation bar, displaying room details, camera and audio controls, and access to Exited Room. | Customize icon sets, adjust background transparency, and add additional buttons such as recording or windowed mode. |
| <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomView.kt">RoomView</a> | Displays video streams using a waterfall layout to efficiently manage multiple user feeds. | Adjust layout logic including the number of rows and columns, spacing, page indicator styles, and empty state visuals. |
| <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/roomview/RoomVideoNameOverlayView.kt">RoomVideoNameOverlayView</a> | Renders individual video cells, showing user video feeds alongside basic user information. | Customize the video rendering layer, user info panel (such as avatar and badge), and add interactive elements like voice waveforms. |
| <a href="https://github.com/Tencent-RTC/TUIKit_Android/blob/main/room/tuiroomkit/src/main/java/com/trtc/uikit/roomkit/view/main/RoomBottomBarView.kt">RoomBottomBarView</a> | Acts as the bottom toolbar, grouping microphone, camera, and member management controls. | Rearrange button order, update button styles (color, size), and add features such as screen sharing, in-room calling, or beauty effects. |

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

No. In most cases, you only need to call `LoginStore.shared.login` once. We recommend tying `LoginStore.shared.login` and `LoginStore.shared.logout` to your own login/logout business logic.

### Why is there no video/audio when collecting audio/video in the background on Android 14 and above?

On Android 14 and above, if your app collects camera or microphone data while running in the background, you must start a foreground service and specify the correct service type. Otherwise, audio/video collection will not work. Follow these steps:
1. Declare `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_CAMERA`, and `FOREGROUND_SERVICE_MICROPHONE` permissions and services in AndroidManifest.xml.

   ``` xml
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

   <service
       android:name=".MediaCaptureService"
       android:foregroundServiceType="camera|microphone" />
   ```
2. Start the background capture service after your interface launches.

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
               .setContentTitle("In audio/video call")
               .setSmallIcon(android.R.drawable.ic_menu_call)
               .build()

           // 3. Start foreground service, specify camera and microphone types (required for Android 14+)
           startForeground(1, notification,
               ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
       }

       override fun onBind(intent: Intent?): IBinder? = null
   }

   ```

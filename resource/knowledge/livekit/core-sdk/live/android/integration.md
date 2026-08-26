This document guides you through building a basic live streaming app with host broadcasting and audience viewing capabilities using the core component [LiveCoreView](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html) from the **AtomicXCore SDK**.

### Core Features

**LiveCoreView** is a lightweight View component purpose-built for live streaming scenarios. It serves as the foundation of your live streaming implementation, encapsulating all complex streaming technologies—including stream publishing and playback, co-hosting, and audio/video rendering. Use LiveCoreView as the "canvas" for your live video, enabling you to focus on developing your custom UI and interactions.

The following view hierarchy diagram illustrates the position and role of **LiveCoreView** within the live streaming interface:

## Core Concepts
| <strong>Core Concept</strong> | <strong>Core Responsibility</strong> | <strong>Key API / Property</strong> |
| --- | --- | --- |
| LiveCoreView | Handles publishing, playing, and rendering audio/video streams. Provides adapter interfaces for integrating custom UI components (e.g., user info, PK progress bar). | - <code>viewType</code>:<br>- <code>CoreViewType.PUSH_VIEW</code> (host publishing view)<br>- <code>CoreViewType.PLAY_VIEW</code> (audience playback view)<br>- <code>setLiveId()</code>: Binds the live room ID for this view.<br>- <code>setVideoViewAdapter():</code> Adapter for custom video display UI slots. |
| LiveListStore | Manages the complete live room lifecycle (create, join, leave), synchronizes state, and listens for passive events (e.g., live ended, kicked out). | - <code>createLive()</code>: Start live stream as host.<br>- <code>endLive()</code>: End live stream as host.<br>- <code>joinLive()</code>: Audience joins live room.<br>- <code>leaveLive()</code>: Leave live room. |
| LiveInfo | Defines room parameters before going live, such as room ID, seat layout mode, max co-hosts, etc. | - <code>liveID</code>: Unique room identifier.<br>- seatTemplate: Layout template. |

## Preparation

### Step 1: Activate the Service

See Activate Service to obtain either the trial or paid version of the SDK.Then, go to [the Console](https://console.trtc.io/app) for application management, and get the following:
- `SDKAppID`: Application identifier (required). Tencent Cloud uses `SDKAppId` for billing and details.

- `SDKSecretKey`: Application secret key, used to initialize the configuration file with secret information.

### Step 2: Import AtomicXCore into Your Project

**Install the component**: Add the dependency `implementation 'com.tencent.atomicx:atomicxcore:latest`' to your `build.gradle` file, then perform a **Gradle** **Sync**.

【build.gradle.kts】
``` java
implementation("io.trtc.uikit:atomicx-core:latest.release")
api("com.tencent.imsdk:imsdk-plus:8.9.7511")
```

【build.gradle】
``` java
implementation 'io.trtc.uikit:atomicx-core:4.0.0.110'
api "com.tencent.imsdk:imsdk-plus:8.9.7511"
```

### Step 3: Implement Login Logic

Call `LoginStore.shared.login` in your project to complete login. **This is required before you can use any functionality in AtomicXCore**.

> **Note：**
> We recommend calling `LoginStore.shared.login` after your app's own user authentication is successful to ensure clear and consistent login logic.
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
            1400000001,        // Replace with your SDKAppID
            "test_001",        // Replace with your UserID
            "xxxxxxxxxxx",     // Replace with your UserSig
            object : CompletionHandler {
                override fun onSuccess() {
                    // Handle login success
                    Log.d("Login", "login success")
                }

                override fun onFailure(code: Int, desc: String) {
                    // Handle login failure
                    Log.e("Login", "login failed, code: $code, error: $desc")
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
| userSig | String | A ticket for Tencent Cloud authentication. Please note:<br>- <strong>Development Environment</strong>: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a UserSig or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- <strong>Production Environment</strong>: To prevent key leakage, you must use a server-side method to generate UserSig. For details, see Generating UserSig on the Server.<br>- For more information, see How to Calculate and Use UserSig. |

## Building a Basic Live Room

### Step 1: Implement Host Video Streaming

Follow these steps to quickly set up host video streaming:

> **Note：**
> For a complete implementation, refer to [VideoLiveAnchorActivity.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/livestream/VideoLiveAnchorActivity.kt) in the open-source TUILiveKit project.
>

1. **Initialize the Broadcaster Streaming View**

   In your host `Activity`, create a LiveCoreView instance and set viewType to `PUSH_VIEW` (publishing view).

   ``` java
   import io.trtc.tuikit.atomicxcore.api.view.CoreViewType
   import io.trtc.tuikit.atomicxcore.api.view.LiveCoreView
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import androidx.constraintlayout.widget.ConstraintLayout

   class YourAnchorActivity : AppCompatActivity() {
       private lateinit var coreView: LiveCoreView

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)

           coreView = LiveCoreView(this, viewType = CoreViewType.PUSH_VIEW)
           coreView.setLiveID("test_live_001")

           setupUI()
       }

       private fun setupUI() {
           setContentView(R.layout.activity_anchor)

           val container = findViewById<ConstraintLayout>(R.id.container)
           container.addView(coreView)

           val params = ConstraintLayout.LayoutParams(
               ConstraintLayout.LayoutParams.MATCH_PARENT,
               ConstraintLayout.LayoutParams.MATCH_PARENT
           )
           params.topMargin = 36
           params.bottomMargin = 96
           coreView.layoutParams = params
       }
   }
   ```
2. **Open Camera and Microphone**

   Call the `openLocalCamera` and `openLocalMicrophone` methods of `DeviceStore` to enable the camera and microphone. **No additional action is required—LiveCoreView will automatically preview the current camera video stream**.

   ``` java
   import androidx.appcompat.app.AppCompatActivity
   import android.os.Bundle
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

   class YourAnchorActivity : AppCompatActivity() {
       // ... other code ...

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           setupUI()
           openDevices()
       }

       private fun openDevices() {
           DeviceStore.shared().openLocalCamera(true, completion = null)
           DeviceStore.shared().openLocalMicrophone(completion = null)
       }
   }
   ```
3. **Start Live Streaming**

   Start the live stream by calling `createLive` on `LiveListStore`.

   ``` java
   import android.util.Log
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
   import io.trtc.tuikit.atomicxcore.api.live.LiveInfoCompletionHandler
   import io.trtc.tuikit.atomicxcore.api.live.LiveListStore

   class YourAnchorActivity : AppCompatActivity() {
       // ... other code ...

       private fun startLive() {
           val liveInfo = LiveInfo().apply {
               liveID = "test_live_001"
               liveName = "test live"
               seatTemplate = SeatLayoutTemplate.VideoDynamicGrid9Seats // Default: dynamic grid layout
           }
           LiveListStore.shared().createLive(liveInfo, object: LiveInfoCompletionHandler {
               override fun onFailure(code: Int, desc: String) {
                   Log.e("Live", "startLive error: $desc")
               }

               override fun onSuccess(liveInfo: LiveInfo) {
                   Log.d("Live", "startLive success")
               }
           })
       }
   }
   ```

   `LiveInfo` **Parameter Description:**

   |**Parameter Name**|**Type**|**Required**|**Description**|
   |---------|---------|---------|---------|
   |`liveID`|`String`|Yes|Unique identifier for the live room.|
   |`liveName`|`String`|No|Title of the live room.|
   |`notice`|`String`|No|Announcement message for the live room.|
   |`isMessageDisable`|`Boolean`|No|Disable chat (true = yes, false = no).|
   |`isPublicVisible`|`Boolean`|No|Room is publicly visible (true = yes, false = no).|
   |`seatMode`|[TakeSeatMode](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-take-seat-mode/index.html)|No|Seat mode (FREE: free to take seat, APPLY: apply to take seat).|
   |`seatTemplate`|SeatLayoutTemplate|Yes|Seat layout template.|
   |`coverURL`|`String`|No|Cover image URL for the live room.|
   |`backgroundURL`|`String`|No|Background image URL for the live room.|
   |`categoryList`|`List`<br>|No|List of category tags for the live room.|
   |`activityStatus`|`Int`|No|Live activity status.|
   |`isGiftEnabled`|`Boolean`|No|Whether to enable gift functionality (true: yes, false: no).|

4. **End Live Streaming**

   When the live stream ends, call the `endLive` method of `LiveListStore`. The SDK will handle stopping the stream and destroying the room.

   ``` java
   import android.util.Log
   import androidx.appcompat.app.AppCompatActivity
   import com.tencent.cloud.tuikit.engine.extension.TUILiveListManager
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
   import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
   import io.trtc.tuikit.atomicxcore.api.live.StopLiveCompletionHandler

   class YourAnchorActivity : AppCompatActivity() {
       // ... other code ...

       private fun stopLive() {
           LiveListStore.shared().endLive(object : StopLiveCompletionHandler {
               override fun onSuccess(statisticsData: TUILiveListManager.LiveStatisticsData) {
                   Log.d("Live", "endLive success, duration: ${statisticsData.liveDuration}, totalViewers: ${statisticsData.totalViewers}")
               }

               override fun onFailure(code: Int, desc: String) {
                   Log.e("Live", "endLive error: $desc")
               }
           })
       }

       override fun onDestroy() {
           super.onDestroy()
           stopLive()
           DeviceStore.shared().closeLocalCamera()
           DeviceStore.shared().closeLocalMicrophone()
           Log.d("Live", "YourAnchorActivity onDestroy")
       }
   }
   ```

### Step 2: Implement Audience Join and Watch

Follow these steps to enable audience viewing:

> **Note：**
> For a complete reference implementation of audience viewing logic, see [VideoLiveAudienceActivity.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/livestream/VideoLiveAudienceActivity.kt) in the open-source TUILiveKit project.
>

1. **Add Audience Playback View**

   In your audience `Activity`, create a `LiveCoreView` instance and set `viewType` to `PLAY_VIEW` (playback view).

   ``` java
   import io.trtc.tuikit.atomicxcore.api.view.CoreViewType
   import io.trtc.tuikit.atomicxcore.api.view.LiveCoreView
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import androidx.constraintlayout.widget.ConstraintLayout

   // YourAudienceActivity represents your audience viewing Activity
   class YourAudienceActivity : AppCompatActivity() {

       // 1. Initialize the audience playback view
       private lateinit var coreView: LiveCoreView

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)

           // 2. Initialize the view
           coreView = LiveCoreView(this, viewType = CoreViewType.PLAY_VIEW)
           coreView.setLiveId("test_live_001")

           // UI layout
           setupUI()
       }

       private fun setupUI() {
           setContentView(R.layout.activity_audience)

           // 3. Add the playback view to your layout
           val container = findViewById<ConstraintLayout>(R.id.container)
           container.addView(coreView)

           // Set layout parameters
           val params = ConstraintLayout.LayoutParams(
               ConstraintLayout.LayoutParams.MATCH_PARENT,
               ConstraintLayout.LayoutParams.MATCH_PARENT
           )
           params.topMargin = 36
           params.bottomMargin = 96
           coreView.layoutParams = params
       }
   }
   ```
2. **Join the Live Room**

   Call the `joinLive` method of `LiveListStore` to join the live stream. **No additional setup is required—LiveCoreView will automatically play the video stream.**

   ``` java
   import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
   import io.trtc.tuikit.atomicxcore.api.live.LiveInfoCompletionHandler
   import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import android.util.Log

   // YourAudienceActivity represents your audience viewing Activity
   class YourAudienceActivity : AppCompatActivity() {

       // ... other code ...

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           setupUI()
           // 1. Join the live room (liveID must match the host's)
           LiveListStore.shared().joinLive(liveID, object : LiveInfoCompletionHandler {
               override fun onFailure(code: Int, desc: String) {
                   Log.e("Live", "joinLive error: $desc")
               }

               override fun onSuccess(liveInfo: LiveInfo) {
                   Log.d("Live", "joinLive success")
               }
           })
       }
   }
   ```
3. **Exit the Live Room**

   When the audience leaves, call the `leaveLive` method of `LiveListStore`. The SDK will automatically stop playback and exit the room.

   ``` java
   import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import androidx.appcompat.app.AppCompatActivity
   import android.util.Log

   // YourAudienceActivity represents your audience viewing Activity
   class YourAudienceActivity : AppCompatActivity() {

       // ... other code ...

       // Exit the live room
       private fun leaveLive() {
           LiveListStore.shared().leaveLive(object : CompletionHandler {
               override fun onSuccess() {
                   Log.d("Live", "leaveLive success")
               }

               override fun onFailure(code: Int, desc: String) {
                   Log.e("Live", "leaveLive error: $desc")
               }
           })
       }

       // Always call leaveLive when Activity is destroyed
       override fun onDestroy() {
           super.onDestroy()
           leaveLive()
           Log.d("Live", "YourAudienceActivity onDestroy")
       }
   }
   ```

### Step 3: Listen for Live Events

After joining a live room, you should handle passive events such as the host ending the stream or the audience being removed for violations. If you do not listen for these events, the audience UI may remain in an invalid state, impacting user experience.

Implement the `LiveListListener` interface and register it with `LiveListStore`:
``` java
import io.trtc.tuikit.atomicxcore.api.live.LiveEndedReason
import io.trtc.tuikit.atomicxcore.api.live.LiveKickedOutReason
import io.trtc.tuikit.atomicxcore.api.live.LiveListListener
import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.util.Log

// YourAudienceActivity represents your audience viewing Activity
class YourAudienceActivity : AppCompatActivity() {

    // ... (coreView, liveId, setupUI, joinLive, leaveLive, etc.) ...

    // 2. Define a LiveListListener instance
    private val liveListListener = object : LiveListListener() {
        override fun onLiveEnded(liveID: String, reason: LiveEndedReason, message: String) {
            // Listen for live stream end
            Log.d("Live", "Live ended. liveID: $liveID, reason: $reason, message: $message")
            // Handle exit logic, e.g., finish()
            // finish()
        }

        override fun onKickedOutOfLive(liveID: String, reason: LiveKickedOutReason, message: String) {
            // Listen for being kicked out of the live room
            Log.d("Live", "Kicked out of live. liveID: $liveID, reason: $reason, message: $message")
            // Handle exit logic
            // finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupUI()

        // 3. Register the listener
        LiveListStore.shared().addLiveListListener(liveListListener)

        // 4. Join the live room
        joinLive()
    }

    // ... joinLive() and leaveLive() methods ...

    override fun onDestroy() {
        super.onDestroy()
        // 5. Remove the listener to prevent memory leaks
        LiveListStore.shared().removeLiveListListener(liveListListener)
        leaveLive()
        Log.d("Live", "YourAudienceActivity onDestroy")
    }
}
```

### Run and Test

After integrating `LiveCoreView`, you will have a pure video rendering view with full live streaming capabilities, but without any interactive UI. To add interactive features, see Enriching the Live Streaming Scene.
|  | Dynamic Grid Layout | Floating Window Layout | Fixed Grid Layout | Fixed Window Layout |
| --- | --- | --- | --- | --- |
| <strong>Template</strong> | VideoDynamicGrid9Seats | VideoDynamicFloat7Seats | VideoFixedGrid9Seats | VideoFixedFloat7Seats |
| <strong>Description</strong> | Default layout; grid size adjusts dynamically based on number of co-hosts. | Co-hosts are displayed as floating windows. | Fixed number of co-hosts; each occupies a fixed grid. | Fixed number of co-hosts; guests are displayed as fixed windows. |
| <strong>Example</strong> |  |  |  |  |

## Advanced Features

### Synchronizing Custom State in Live Streaming Room

In Live Streaming Room, hosts may need to synchronize custom information with all participants, such as the current room topic or background music. The `metaData` feature of `LiveListStore` supports this use case.

#### Implementation

On the host side, set custom information using the `updateLiveMetaData` API. `AtomicXCore` synchronizes these changes in real time to all participants. On the audience side, subscribe to `LiveListState.currentLive` and listen for changes in `metaData`. When a relevant key is updated, parse its value and update your business logic.

#### Example Code
``` kotlin
import io.trtc.tuikit.atomicxcore.api.LiveListStore
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import com.google.gson.Gson
import io.trtc.tuikit.atomicxcore.api.MetaDataCompletionHandler
import io.trtc.tuikit.atomicxcore.api.LiveListStore

// 1. Define a background music model (using data class)
data class MusicModel(
    val musicId: String,
    val musicName: String
)

// 2. Host side: Add a method to push background music in your Host business logic
fun updateBackgroundMusic(music: MusicModel) {
    val gson = Gson()
    val jsonString = gson.toJson(music) ?: ""

    // The metaData to be updated
    val metaData = hashMapOf("music_info" to jsonString)

    // Update metaData
    LiveListStore.shared()
        .updateLiveMetaData(
            metaData,
            object : CompletionHandler {
                override fun onSuccess() {
                    print("Background music ${music.musicName} pushed successfully")
                }

                override fun onFailure(code: Int, desc: String) {
                    print("Failed to push background music: $desc")
                }
            }
        )
}

// 3. Audience side: Add a method to listen for background music changes in your Audience business logic
private fun subscribeToDataUpdates() {
    CoroutineScope(Dispatchers.Main).launch {
        LiveListStore.shared()
            .liveState
            .currentLive
            .map { it.metaData }
            .collect {
                val musicInfo = it["music_info"]
                // Refresh business state, e.g., play new background music
            }
    }
}
```

## Enriching the Live Streaming Scene

Once the basic live streaming functionality is in place,

|**Feature**|**Description**|**Store**|**Implementation Guide**|
|---------|---------|---------|---------|
|**Enable Audience Audio/Video Co-hosting**|Audience can apply to join the host on stage for real-time video interaction.|[CoGuestStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|Implementation Guide|
|**Enable Host Cross-room PK**|Hosts from different rooms can connect for interaction or PK.|[CoHostStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)<br>[BattleStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|Implementation Guide|
|**Add Bullet Chat Feature**|Audience can send and receive real-time text messages in the live room.|[BarrageStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|Implementation Guide|
|**Build a Gift Giving System**|Audience can send virtual gifts to the host, increasing engagement and fun.|[GiftStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html)|Implementation Guide|

## API Documentation

|**Store/Component**|**Description**|**API Reference**|
|---------|---------|---------|
|LiveCoreView|Core view component for displaying and interacting with live video streams. Handles video rendering and view widgets, supports host streaming, audience co-hosting, host connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html)|
|LiveListStore|Manages the full lifecycle of live rooms: create/join/leave/destroy rooms, query room list, modify live info (name, announcement, etc.), and listen to live status events (e.g., kicked out, ended).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-list-store/index.html)|
|DeviceStore|Controls audio/video devices: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, and real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|
|CoGuestStore|Manages audience co-hosting: apply/invite/accept/reject co-host requests, member permission control (microphone/camera), and status synchronization.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|
|CoHostStore|Handles host cross-room connections: supports multiple layout templates (dynamic grid, etc.), initiates/accepts/rejects connections, and manages co-host interactions.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)|
|BattleStore|Manages host PK battles: initiate PK (set duration/opponent), manage PK status (start/end), synchronize scores, and listen for battle results.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|
|GiftStore|Handles gift interactions: get gift list, send/receive gifts, and listen for gift events (including sender and gift details).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html)|
|BarrageStore|Supports live chat: send text/custom danmaku, maintain danmaku list, and monitor danmaku status in real time.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|
|LikeStore|Handles like interactions: send likes, listen for like events, and synchronize total like count.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-like-store/index.html)|
|LiveAudienceStore|Manages audience: get real-time audience list (ID/name/avatar), count audience, and listen for join/leave events.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-audience-store/index.html)|
|AudioEffectStore|Audio effects: voice change (child/male), reverb (KTV, etc.), ear return adjustment, and real-time effect switching.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-audio-effect-store/index.html)|
|BaseBeautyStore|Basic beauty filters: adjust smoothing/whitening/rosiness (0-9), reset beauty status, and synchronize effect parameters.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-base-beauty-store/index.html)|

## FAQs

### Why is the screen black with no video after the host calls createLive or the audience calls joinLive?
- **Check setLiveID**: Ensure you have set the correct liveID for the LiveCoreView instance before calling start or join methods.

- **Check device permissions**: Ensure the app has system permissions for camera and microphone usage.

- **Check the host side**: Has the host called `DeviceStore.shared().openLocalCamera(true)`to enable the camera?

- **Check the network**: Ensure the device has a stable network connection.

### After the host enables the camera, why is there a local video preview after starting the stream, but a black screen before starting?
- **Check the host side**: Make sure the host streaming view (LiveCoreView) has its `viewType` set to `PUSH_VIEW`.

- **Check the audience side**: Make sure the audience playback view (LiveCoreView) has its `viewType` set to `PLAY_VIEW`.

### What restrictions and rules apply to `updateLiveMetaData`?

To maintain system stability and efficiency, metaData usage follows these rules:
- **Permissions**: Only hosts and administrators can call `updateLiveMetaData`. Regular audience members cannot.

- **Quantity and Size Limits:**

  - Each room supports up to **10** keys.

  - Each key can be up to **50 bytes**; each value up to **2KB**.

  - The total size of all values in a room cannot exceed **16KB**.

- **Conflict Resolution**: The update mechanism is "last write wins". If multiple administrators modify the same key in quick succession, the last change takes effect. Avoid concurrent modifications to the same key in your business logic.

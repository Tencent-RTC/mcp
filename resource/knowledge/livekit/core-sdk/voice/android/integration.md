This document guides developers through building a voice chat room application with host broadcasting and audience participation features using the **AtomicXCore** SDK's `LiveListStore` and `LiveSeatStore`.

## Core Concepts
| <strong>Core Concept</strong> | <strong>Type</strong> | <strong>Core Responsibilities & Description</strong> |
| --- | --- | --- |
| <code>LiveListStore</code> | <code>abstract class</code> | - <code>createLive()</code>: Start live stream as host.<br>- <code>endLive()</code>: End live stream as host.<br>- <code>joinLive()</code>: Audience joins live room.<br>- <code>leaveLive()</code>: Leave live room. |
| <code>LiveInfo</code> | <code>data class</code> | - <code>liveID</code>: Unique room identifier.<br>- <code>seatTemplate</code>: Layout template. |
| <code>LiveSeatStore</code> | <code>abstract class</code> | Core seat management class. Manages all seat information and seat-related operations in the room.<br>Provides a real-time seat list data stream via liveSeatState.seatList. |
| <code>LiveSeatState</code> | <code>data class</code> | Represents the current state of all seats.<br>- <code>seatList</code>: a StateFlow containing the real-time seat list.<br>- <code>speakingUsers</code>: users currently speaking and their volume. |
| <code>SeatInfo</code> | <code>data class</code> | Data model for a single seat. The seat list (seatList) emitted by LiveSeatStore is a list of SeatInfo objects.<br>Key fields:<br>- <code>index</code>: seat position.<br>- <code>isLocked</code>: whether the seat is locked.<br>- <code>userInfo</code>: user information for the seat. If the seat is empty, this field is empty. |
| <code>SeatUserInfo</code> | <code>data class</code> | Detailed data model for the user occupying a seat. When a user successfully takes a seat, the userInfo field in SeatInfo is populated.<br>Key fields:<br>- <code>userID</code>: unique user ID.<br>- <code>userName</code>: user nickname.<br>- <code>avatarURL</code>: user avatar URL.<br>- <code>microphoneStatus</code>: microphone status (on/off).<br>- <code>cameraStatus</code>: camera status (on/off). |

## Prerequisites

### Step 1: Activate the Service

See Activate Service to obtain either the trial or paid version of the SDK.Then, go to [the Console](https://console.trtc.io/app) for application management, and get the following:
- `SDKAppID`: Application identifier (required). Tencent Cloud uses `SDKAppId` for billing and details.

- `SDKSecretKey`: Application secret key, used to initialize the configuration file with secret information.

### Step 2: Import AtomicXCore into Your Project

**Install the component**: Add the dependency `implementation 'com.tencent.atomicx:atomicxcore:latest`' to your `build.gradle` file, then perform a **Gradle** **Sync**.
``` gradle
dependencies {
    implementation 'io.trtc.uikit:atomicx-core:latest.release'
    api "io.trtc.uikit:rtc_room_engine:3.4.0.1306"
    api "io.trtc.uikit:atomicx-core:3.4.0.1307"
    api "com.tencent.liteav:LiteAVSDK_Professional:12.8.0.19279"
    api "com.tencent.imsdk:imsdk-plus:8.7.7201"
    // Other dependencies...
}
```

### Step 3: Implement Login Logic

Call `LoginStore.shared.login` in your project to complete authentication. **This is required before using any functionality of AtomicXCore**.

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
| <code>sdkAppID</code> | <code>Int</code> | Get this from <a href="https://console.trtc.io/app">TRTC console > Application management</a>. |
| <code>userID</code> | <code>String</code> | The unique ID for the current user. Must contain only English letters, numbers, hyphens, and underscores. |
| <code>userSig</code> | <code>String</code> | A ticket for Tencent Cloud authentication. Please note:<br>- <strong>Development Environment</strong>: You can use the local <code>GenerateTestUserSig.genTestSig</code> function to generate a UserSig or generate a temporary UserSig via the <a href="https://console.trtc.io/usersig">UserSig Generation Tool</a>.<br>- <strong>Production Environment</strong>: To prevent key leakage, you must use a server-side method to generate UserSig. For details, see Generating UserSig on the Server.<br>- For more information, see How to Calculate and Use UserSig. |

## Building a Basic Voice Chat Room

### Step 1: Host Room Creation

Follow the steps below to quickly set up a voice chat room as the host.

#### **1. Initialize the Seat** `Store`

In your host `Activity`, create a `LiveSeatStore` instance. Observe changes in `liveSeatState.seatList` to get real-time mic seat data and update your UI.
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
import io.trtc.tuikit.atomicxcore.api.live.LiveSeatStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// YourHostActivity represents your Host Activity
class YourHostActivity : AppCompatActivity() {

    private lateinit var liveListStore: LiveListStore
    private lateinit var liveSeatStore: LiveSeatStore
    private lateinit var deviceStore: DeviceStore
    private val liveID = "test_voice_room_001"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_host) // Assume you have your own layout

        // 1. Initialize Stores
        liveListStore = LiveListStore.shared()
        liveSeatStore = LiveSeatStore.create(liveID)
        deviceStore = DeviceStore.shared()

        // 2. Listen for mic seat list changes
        observeSeatList()
    }

    private fun observeSeatList() {
         // Listen for seatList changes and update your mic seat UI
         CoroutineScope(Dispatchers.Main).launch {
             liveSeatStore.liveSeatState.seatList.collect { seatInfoList ->
                 // Render your mic seat UI here based on seatInfoList
                 // Example: updateMicSeatView(seatInfoList)
                 Log.d("HostActivity", "Seat list updated: ${seatInfoList.size} seats")
             }
         }
    }
}
```

#### **2.** Turn On Microphone

Turn On Microphone by calling the `openLocalMicrophone` method from `DeviceStore`:
``` java
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.device.DeviceStore

class YourHostActivity : AppCompatActivity() {
    // ... Other code ...

    private fun openDevices() {
        // 1. Turn on the microphone
        DeviceStore.shared().openLocalMicrophone(completion = null)
    }
}
```

#### **3. Start Voice Chat**

Start the live voice chat by calling the `createLive` method of `LiveListStore`:
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
import io.trtc.tuikit.atomicxcore.api.live.LiveInfoCompletionHandler
import io.trtc.tuikit.atomicxcore.api.live.TakeSeatMode

class YourHostActivity : AppCompatActivity() {
    // ... Other code ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ... Other code ...

        // Start voice chat
        startLive()
    }

    private fun startLive() {
        val liveInfo = LiveInfo().apply {
            // 1. Set room id
            liveID = this@YourHostActivity.liveID
            // 2. Set room name
            liveName = "test voice room"
            // 3. Set the live streaming template to the voice chat room template, with 9 seat.
            seatTemplate = SeatLayoutTemplate.AudioSalon(seatCount = 9)
            // 4. Set mic-taking mode, e.g., apply to take mic
            seatMode = TakeSeatMode.APPLY
        }

        // 8. Call createLive to start the stream
        liveListStore.createLive(liveInfo, object : LiveInfoCompletionHandler {
            override fun onFailure(code: Int, desc: String) {
                Log.e("Live", "Response startLive onError: $desc")
            }

            override fun onSuccess(liveInfo: LiveInfo) {
                Log.d("Live", "Response startLive onSuccess")
                // After successful creation, the Host is on the mic by default, now you can call unmuteMicrophone
                liveSeatStore.unmuteMicrophone(null)
            }
        })
    }
}
```

**LiveInfo Parameter Description**

|**Parameter Name**|**Type**|**Required**|**Description**|
|---------|---------|---------|---------|
|`liveID`|`String`|Required|Unique identifier for the live room|
|`liveName`|`String`|Optional|Title of the live room|
|`notice`|`String`|Optional|Announcement information for the live room|
|`isMessageDisable`|`Boolean`|Optional|Mute status (`true`: muted, `false`: not muted)|
|`isPublicVisible`|`Boolean`|Optional|Public visibility (`true`: visible, `false`: hidden)|
|`seatMode`|[TakeSeatMode](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-take-seat-mode/index.html)|Optional|Mic seat mode (`FREE`: free to take seat, `APPLY`: apply to take seat)|
|`seatTemplate`|`SeatLayoutTemplate`|Required|Mic seat layout template ID|
|`coverURL`|`String`|Optional|Cover image URL for the live room|
|`backgroundURL`|`String`|Optional|Background image URL for the live room|
|`categoryList`|`List<Int>`|Optional|Category tag list for the live room|
|`activityStatus`|`Int`|Optional|Live activity status|

#### **4. Build the Mic Seat UI**

> **Note：**
> For the complete business logic of mic seat UI effects, refer to the open-source [SeatGridView.kt](https://github.com/Tencent-RTC/TUILiveKit/blob/main/Android/tuilivekit/src/main/java/com/trtc/uikit/livekit/voiceroomcore/SeatGridView.kt) in the TUILiveKit project.
>

Use the `LiveSeatStore` instance to observe changes in `liveSeatState.seatList` and update your UI in real time. In your Activity (such as `YourAnchorActivity` or `YourAudienceActivity`), observe the data as follows:
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class YourHostActivity : AppCompatActivity() {
    // ... Other code ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ... Other code ...

        // Listen for seatList changes
        observeSeatList()
    }

    private fun observeSeatList() {
        // Listen for seatList changes and update your mic seat UI
        CoroutineScope(Dispatchers.Main).launch {
            liveSeatStore.liveSeatState.seatList.collect { seatInfoList ->
                // seatInfoList is the latest mic seat list (List<SeatInfo>), render your mic seat UI here based on seatInfoList
                Log.d("HostActivity", "Seat list updated: ${seatInfoList.size} seats")
            }
        }
    }
}
```

#### **5. End Voice Chat**

To end the voice chat, call the `endLive` method of `LiveListStore`. The SDK will handle stopping the stream and destroying the room.
``` java
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.tencent.cloud.tuikit.engine.extension.TUILiveListManager
import io.trtc.tuikit.atomicxcore.api.live.StopLiveCompletionHandler

class YourHostActivity : AppCompatActivity() {
    // ... Other code ...

    // End voice chat
    private fun stopLive() {
        liveListStore.endLive(object : StopLiveCompletionHandler {
            override fun onSuccess(statisticsData: TUILiveListManager.LiveStatisticsData) {
                Log.d("Live", "endLive success, duration: ${statisticsData.liveDuration}")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.e("Live", "endLive error: $desc")
            }
        })
    }

    // Ensure this is also called when the Activity is destroyed
    override fun onDestroy() {
        super.onDestroy()
        stopLive()
        Log.d("Live", "YourHostActivity onDestroy")
    }
}
```

### Step 2: Audience Joins the Voice Chat Room

Follow these steps to allow audience members to join the voice chat room.

#### **1. Initialize the Mic Seat Store**

In your audience `Activity`, create a `LiveSeatStore` instance and observe changes in `liveSeatState.seatList` to update the mic seat UI.
``` java
import io.trtc.tuikit.atomicxcore.api.live.LiveListStore
import io.trtc.tuikit.atomicxcore.api.live.LiveSeatStore
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import android.util.Log

// YourAudienceActivity represents your Audience Activity
class YourAudienceActivity : AppCompatActivity() {

    private lateinit var liveListStore: LiveListStore
    private lateinit var liveSeatStore: LiveSeatStore
    private val liveID = "test_voice_room_001" // Ensure liveID matches the Host's

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_audience) // Assume you have your own layout

        // 1. Initialize Stores
        liveListStore = LiveListStore.shared()
        liveSeatStore = LiveSeatStore.create(liveID)

        // 2. Listen for mic seat list changes
        observeSeatList()
    }

    private fun observeSeatList() {
         // 3. Listen for seatList changes and update your mic seat UI
         CoroutineScope(Dispatchers.Main).launch {
             liveSeatStore.liveSeatState.seatList.collect { seatInfoList ->
                 // Render your mic seat UI here based on seatInfoList
                 // Example: updateMicSeatView(seatInfoList)
                 Log.d("AudienceActivity", "Seat list updated: ${seatInfoList.size} seats")
             }
         }
    }
}
```

#### **2. Join Voice Chat Room**

Join the voice chat room by calling the `joinLive` method of `LiveListStore`:
``` java
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.util.Log
import io.trtc.tuikit.atomicxcore.api.live.LiveInfo
import io.trtc.tuikit.atomicxcore.api.live.LiveInfoCompletionHandler

// YourAudienceActivity represents your Audience Activity
class YourAudienceActivity : AppCompatActivity() {

    // ... Other code ...
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_audience) // Assume you have your own layout
        // ... Other code ...

        // Enter voice chat room
        joinLive()
    }

    private fun joinLive() {
        // 1. Call joinLive to enter the voice chat room
        liveListStore.joinLive(liveID, object : LiveInfoCompletionHandler {
            override fun onSuccess(liveInfo: LiveInfo) {
                Log.d("Live", "joinLive success")
            }
            override fun onFailure(code: Int, desc: String) {
                Log.e("Live", "joinLive error: $desc")
            }
        })
    }
}
```

#### **3. Build the Mic Seat UI**

The process for building the mic seat UI as an audience member is the same as for the host. .

#### **4. Leave the Voice Chat Room**

When an audience member leaves the voice chat room, call the `leaveLive` method of `LiveListStore`:
``` java
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.trtc.tuikit.atomicxcore.api.CompletionHandler

// YourAudienceActivity represents your Audience Activity
class YourAudienceActivity : AppCompatActivity() {
    // ... Other code ...

    private fun leaveLive() {
        liveListStore.leaveLive(object : CompletionHandler {
            override fun onSuccess() {
                Log.d("Live", "leaveLive success")
            }

            override fun onFailure(code: Int, desc: String) {
                Log.e("Live", "leaveLive error: $desc")
            }
        })
    }

    // Ensure this is also called when the Activity is destroyed
    override fun onDestroy() {
        super.onDestroy()
        leaveLive()
        Log.d("Live", "YourAudienceActivity onDestroy")
    }
}
```

### Run and Test

After completing the steps above, you will have a basic voice chat live streaming setup. For more advanced features, see the "Enrich Voice Chat Room Scenarios" section.

## Advanced Features

### **Implementing Speaking Wave Animation for Mic Seat Users**

In voice chat rooms, it is common to show a wave animation on the avatar of users who are speaking, so everyone can see who is currently talking. `LiveSeatStore` provides a `speakingUsers` data stream for this purpose.

#### Example

####

#### Implementation

> **Note：**
> For a complete implementation of the speaking wave animation, refer to [SeatGridView.kt](https://github.com/Tencent-RTC/TUILiveKit/blob/main/Android/tuilivekit/src/main/java/com/trtc/uikit/livekit/voiceroomcore/SeatGridView.kt) in the open-source TUILiveKit project.
>

In `YourAnchorActivity`, observe changes in `speakingUsers` and update the UI to reflect the speaking status:
``` java
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// In YourHostActivity or YourAudienceActivity
class YourHostActivity : AppCompatActivity() {
    // ... (omitting other code) ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ... (omitting other code) ...

        // Listen for speakingUsers changes
        observeSpeakingUsersState()
    }

    private fun observeSpeakingUsersState() {
        // Listen for speakingUsers changes and update the "currently speaking" status
        CoroutineScope(Dispatchers.Main).launch {
            liveSeatStore.liveSeatState.speakingUsers.collect { speakingUserSet ->
                // Pass the set of "currently speaking" user IDs to the UI, update UI state
                Log.d("HostActivity", "Speaking users updated: ${speakingUserSet.size} users")
            }
        }
    }
}
```

### Synchronizing Custom State in Live Streaming Room

In Live Streaming Room, hosts may need to synchronize custom information with all participants, such as the current room topic or background music. The `metaData` feature of `LiveListStore` supports this use case.

#### Implementation
1. On the host side, set custom information using the `updateLiveMetaData` API. `AtomicXCore` synchronizes these changes in real time to all participants.

2. On the audience side, subscribe to `LiveListState.currentLive` and listen for changes in `metaData`. When a relevant key is updated, parse its value and update your business logic.

#### Code Example
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

## Enrich Voice Chat Room Scenarios

After implementing the basic voice chat room, you can add more interactive features by referring to the following guides:

|**Feature**|**Feature Description**|**Feature Stores**|**Implementation Guide**|
|---------|---------|---------|---------|
|**Enable Audience to Take Mic Seat**|Audience can apply to take a mic seat and interact with the host in real time.|[CoGuestStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|Implementation|
|**Host Cross-Room Connection & PK**|Hosts from different rooms can connect for interaction or PK.|[CoHostStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)<br>[BattleStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|Implementation|
|**Add Barrage Chat**|Members in the room can send and receive real-time text messages.|[BarrageStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|Implementation|
|**Build Gift System**|Audience can send virtual gifts to hosts to increase engagement and fun.|[GiftStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html)|Implementation|

## API Documentation

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|`LiveListStore`|Manages the full lifecycle of live rooms: create, join, leave, destroy rooms; query room list; modify live info (name, announcement, etc.); listen to live status (such as being kicked out, ended).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-list-store/index.html)|
|`LiveSeatStore`|Core mic seat management: manage mic seat list, user status, seat operations (take seat, leave seat, kick, lock, toggle microphone/camera, etc.), listen to mic seat events.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-seat-store/index.html)|
|`DeviceStore`|Audio/video device control: microphone (toggle/volume), camera (toggle/switch/quality), screen sharing, real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|
|`CoGuestStore`|Audience co-host management: co-host application/invitation/approval/rejection, member permission control (microphone/camera), status synchronization.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|
|`CoHostStore`|Host cross-room connection: supports multiple layout templates (dynamic grid, etc.), initiate/accept/reject connection, manage co-host interaction.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)|
|`BattleStore`|Host PK battle: initiate PK (set duration/opponent), manage PK status (start/end), synchronize scores, listen to battle results.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|
|`GiftStore`|Gift interaction: get gift list, send/receive gifts, listen to gift events (including sender and gift details).|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.gift/-gift-store/index.html)|
|`BarrageStore`|Bullet chat feature: send text/custom barrage, maintain barrage list, real-time barrage status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.barrage/-barrage-store/index.html)|
|`LikeStore`|Like interaction: send likes, listen to like events, synchronize total like count.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-like-store/index.html)|
|`LiveAudienceStore`|Audience management: get real-time audience list (ID/name/avatar), count audience number, listen to audience join/leave events.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-audience-store/index.html)|
|`AudioEffectStore`|Audio effects: voice changer (child/male), reverb (KTV, etc.), ear monitor adjustment, real-time effect switching.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-audio-effect-store/index.html)|

## FAQs

### Why is there no sound after the audience calls joinLive?
- **Check device permissions:** Ensure the app has system permission to use the microphone.

- **Check the host:** Confirm the host has called `DeviceStore.shared().openLocalMicrophone(null)` to enable the microphone.

- **Check the network:** Ensure the device's network connection is stable.

### Why is the mic seat list not displayed or not updating?
- **Check store initialization:** Make sure you have created the `LiveSeatStore` instance with the same `liveID` before calling `createLive` or `joinLive` (`LiveSeatStore.create(liveID)`).

- **Check data observation:** Ensure you are observing the `liveSeatStore.liveSeatState.seatList` data stream.

- **Check API calls:** Confirm that `createLive` (host) or `joinLive` (audience) was successfully called (check the `onSuccess` callback).

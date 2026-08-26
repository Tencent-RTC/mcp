**AtomicXCore** provides two primary modules: [CoHostStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html) and [BattleStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html), which handle cross-room co-hosting and PK battles respectively. This guide walks you through using both modules together to implement the complete workflow from co-hosting to PK in a live streaming scenario.

## Core Scenario

1. **Cross-room Co-hosting**: Two hosts connect, and both video streams are displayed in a shared view.

2. **Initiate PK**: After the connection is established, either host can start a PK challenge.

3. **PK Battle**: Both hosts compete in a PK battle, with scores updated in real time.

## Implementation

### Step 1: Component Integration

### Step 2: Implement Cross-Room Co-hosting

The goal of this step is to display the video streams of two hosts in the same view. Use [CoHostStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html) to achieve this.

#### Inviter (Host A) Implementation
1. **Initiate Co-hosting Invitation**

   When Host A selects Host B in the UI and initiates a co-hosting request, call the `requestHostConnection` method.

   ``` kotlin
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.live.CoHostLayoutTemplate
   import io.trtc.tuikit.atomicxcore.api.live.CoHostStore

   // Host A's Activity
   class HostAActivity : AppCompatActivity() {
       private val liveId = "hostA_roomID" // Host A's Room ID
       private val coHostStore = CoHostStore.create(liveId)

       // User clicks the "Co-host" button and selects Host B
       fun inviteHostB(targetHostLiveId: String) {
           val layout = CoHostLayoutTemplate.HOST_DYNAMIC_GRID // Select a layout template
           val timeout = 30 // Invitation timeout (seconds)

           coHostStore.requestHostConnection(
               targetHostLiveID = targetHostLiveId,
               layoutTemplate = layout,
               timeout = timeout,
               extraInfo = null,
               completion = object : CompletionHandler {
                   override fun onSuccess() {
                       println("Co-hosting invitation sent, waiting for response...")
                   }

                   override fun onFailure(code: Int, desc: String) {
                       println("Invitation failed to send: $desc")
                   }
               }
           )
       }
   }
   ```
2. **Listen for Invitation Result**

   Receive Host B's response via the CoHostListener callback methods.

   ``` java
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.live.CoHostListener
   import io.trtc.tuikit.atomicxcore.api.live.CoHostStore
   import io.trtc.tuikit.atomicxcore.api.live.SeatUserInfo

   class HostAActivity : AppCompatActivity() {
       private val liveId = "hostA_roomID" // Host A's Room ID
       private val coHostStore = CoHostStore.create(liveId)
       private val coHostListener = object : CoHostListener() {
           override fun onCoHostRequestAccepted(invitee: SeatUserInfo) {
               println("Host ${invitee.userName} accepted your co-hosting invitation")
           }

           override fun onCoHostRequestRejected(invitee: SeatUserInfo) {
               println("Host ${invitee.userName} rejected your invitation")
           }

           override fun onCoHostRequestTimeout(inviter: SeatUserInfo, invitee: SeatUserInfo) {
               println("Invitation timed out, no response received")
           }
       }

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // ... initialization code ...

           // Initialize CoHostStore
           coHostStore.addCoHostListener(coHostListener)
       }
   }
   ```

#### Invitee (Host B) Implementation
1. **Receive Co-hosting Invitation**

   Host B listens for invitations from Host A via `CoHostListener`.

   ``` kotlin
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.live.CoHostListener
   import io.trtc.tuikit.atomicxcore.api.live.CoHostStore
   import io.trtc.tuikit.atomicxcore.api.live.SeatUserInfo

   // Host B's Activity
   class HostBActivity : AppCompatActivity() {
       private val liveId = "hostB_roomID" // Host B's Room ID
       private val coHostStore = CoHostStore.create(liveId)

       private val coHostListener = object : CoHostListener() {
           override fun onCoHostRequestReceived(inviter: SeatUserInfo, extensionInfo: String) {
               println("Received co-hosting invitation from Host ${inviter.userName}")
               // Display invitation dialog to respond
               // showInvitationDialog(inviter)
           }
       }
   }
   ```
2. **Respond to Co-hosting Invitation**

   After Host B receives the invitation, prompt for “Accept” or “Reject” and call the appropriate method:

   ``` kotlin
   // Part of HostBActivity
   fun acceptInvitation(fromHostLiveId: String) {
       coHostStore.acceptHostConnection(fromHostLiveID = fromHostLiveId, completion = null)
   }

   fun rejectInvitation(fromHostLiveId: String) {
       coHostStore.rejectHostConnection(fromHostLiveID = fromHostLiveId, completion = null)
   }
   ```

### Step 3: Implement Host PK

After a successful co-hosting connection, either host can initiate a PK. Use [BattleStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/battlestore) for PK functionality.

#### Challenger (e.g., Host A) Implementation
1. **Initiate PK Challenge**

   When Host A clicks the "PK" button, call the `requestBattle` method.

   ``` kotlin
   // Part of HostAActivity
   class HostAActivity : AppCompatActivity() {
       private val liveId = "hostA_roomID" // Host A's Room ID
       private val battleStore = BattleStore.create(liveId)

       fun startPK(opponentUserId: String) {
           val config = BattleConfig(duration = 300) // PK lasts 5 minutes
           battleStore.requestBattle(
               config = config,
               userIDList = listOf(opponentUserId),
               timeout = 30,
               completion = null
           )
       }
   }
   ```
2. **Listen for PK Status**

   Use `BattleListener` to monitor key events such as the start and end of PK.

   ``` java
   // Part of HostAActivity
   class HostAActivity : AppCompatActivity() {
       private val liveId = "hostA_roomID" // Host A's Room ID
       private val battleStore = BattleStore.create(liveId)

       private val battleListener = object : BattleListener() {
           override fun onBattleStarted(
               battleInfo: BattleInfo,
               inviter: SeatUserInfo,
               invitees: List<SeatUserInfo>
           ) {
               println("PK started")
           }

           override fun onBattleEnded(battleInfo: BattleInfo, reason: BattleEndedReason?) {
               println("PK ended")
           }
       }

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // ... other initialization code ...
           battleStore.addBattleListener(battleListener)
       }
   }
   ```

#### Opponent (Host B) Implementation
1. **Receive PK Challenge**

   Listen for PK invitations via `BattleListener`.

   ``` kotlin
   // Add to HostBActivity
   class HostBActivity : AppCompatActivity() {
       private val liveId = "hostB_roomID" // Host B's Room ID
       private val battleStore = BattleStore.create(liveId)

       private val battleListener = object : BattleListener() {
           override fun onBattleRequestReceived(battleID: String, inviter: SeatUserInfo, invitee: SeatUserInfo) {
               println("Received PK challenge from Host ${inviter.userName}")
               // Pop up a dialog for Host B to choose "Accept" or "Reject"
               // showPKChallengeDialog(battleID, inviter)
               }
           }

           override fun onCreate(savedInstanceState: Bundle?) {
               super.onCreate(savedInstanceState)
               // ... other initialization code ...
               battleStore.addBattleListener(battleListener)
           }
   }
   ```
2. **Respond to PK Challenge**

   Prompt Host B for “Accept” or “Reject” and call the corresponding method:

   ``` kotlin
   // Part of HostBActivity
   // User clicks "Accept Challenge"
   fun acceptPK(battleId: String) {
       battleStore.acceptBattle(battleID = battleId, completion = null)
   }

   // User clicks "Reject Challenge"
   fun rejectPK(battleId: String) {
       battleStore.rejectBattle(battleID = battleId, completion = null)
   }
   ```

### Step 4: End PK and Disconnect Co-hosting

After the PK session, end the PK and disconnect co-hosting in sequence.
1. **End PK Battle**

   PK typically ends automatically when the timer expires, but hosts can also end PK early. Use `exitBattle`:

   > **Note：**After PK ends, both hosts remain connected (side-by-side video streams). Only the PK progress bar and score panel are removed.
   >

   ``` java
   fun stopPK(battleId: String) {
       battleStore.exitBattle(battleID = battleId, completion = object : CompletionHandler {
           override fun onSuccess() {
               println("PK ended")
               // Handle UI refresh in onBattleEnded event
           }
           override fun onFailure(code: Int, desc: String) {
               println("Failed to end PK: $desc")
           }
       })
   }
   ```
2. **Disconnect Cross-room Co-hosting**

   To return to solo live streaming, call `exitHostConnection`:

   ``` java
     fun stopConnection() {
       coHostStore.exitHostConnection(completion = object : CompletionHandler {
           override fun onSuccess() {
               println("Co-hosting disconnected, back to solo live")
               // UI will receive onCoHostUserLeft event
           }
           override fun onFailure(code: Int, desc: String) {
               println("Failed to disconnect co-hosting: $desc")
           }
       })
   }
   ```
3. **Listen for End Events**

   Handle UI cleanup in event listeners for consistency:

   ``` java
     private val battleListener = object : BattleListener() {
       override fun onBattleEnded(battleInfo: BattleInfo, reason: BattleEndedReason?) {
           println("Received PK end event, reason: $reason")
           // Remove PK score view, progress bar, etc.
           // runOnUiThread { removeBattleUI() }
       }
   }

   private val coHostListener = object : CoHostListener() {
       override fun onCoHostUserLeft(userInfo: SeatUserInfo) {
           println("Host ${userInfo.userName} has left the co-hosting session")
           // Remove the other host's video view and restore solo live layout
           // runOnUiThread { resetToSingleStreamLayout() }
       }
   }
   ```

### Run and Test

After integrating the above features, use Host A and Host B to test the corresponding operations. The runtime effect is shown below. For UI customization, see Refine UI Details.

## Refine UI Details

Use the slot capability in the `VideoViewAdapter` interface to overlay custom views on video streams, such as nicknames, avatars, PK progress bars, or placeholder images when the host’s camera is off.

### Display Nicknames on Video Streams

#### Implementation Example

#### Implementation
- **Step 1**: Create a foreground view `CustomSeatView` to display user information above the video stream.

   > **Note：**
   >
   > For a complete implementation, refer to the [widgets](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/features/anchorview/view/cohost/widgets) directory in the open-source TUILiveKit project.
   >

   ``` kotlin
   import android.content.Context
   import android.graphics.Color
   import android.view.Gravity
   import android.widget.LinearLayout
   import android.widget.TextView

   // Custom user information overlay view (Foreground)
   class CustomSeatView(context: Context) : LinearLayout(context) {
       private val nameLabel: TextView

       init {
           orientation = VERTICAL
           setBackgroundColor(Color.parseColor("#80000000")) // Semi-transparent black background

           nameLabel = TextView(context).apply {
               setTextColor(Color.WHITE)
               textSize = 14f
               gravity = Gravity.CENTER
           }

           addView(nameLabel)
           val layoutParams = nameLabel.layoutParams as LayoutParams
           layoutParams.setMargins(5, 0, 5, 5)
       }

       fun setUserName(userName: String) {
           nameLabel.text = userName
       }
   }
   ```
- **Step 2**: Create a background view `CustomAvatarView` to serve as a placeholder when the user has no video stream.

   ``` kotlin
   import com.tencent.cloud.tuikit.engine.room.TUIRoomDefine
   import android.view.View
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.ViewLayer
   import io.trtc.tuikit.atomicxcore.api.VideoViewAdapter

   // 1. In your Activity, implement the VideoViewAdapter interface
   class YourActivity : AppCompatActivity(), VideoViewAdapter {

       // ... Other code ...

       // 2. Fully implement the interface method to handle both view layers
       override fun createCoHostView(coHostUser: TUIRoomDefine.SeatFullInfo?, viewLayer: ViewLayer?): View? {
           val seatInfo = coHostUser ?: return null
           val userId = seatInfo.userId
           if (userId.isNullOrEmpty()) {
               return null
           }

           return when (viewLayer) {
               ViewLayer.FOREGROUND -> {
                   val seatView = CustomSeatView(this)
                   seatView.setUserName(seatInfo.userName ?: "")
                   seatView
               }
               ViewLayer.BACKGROUND -> {
                   val avatarView = CustomAvatarView(this)
                   // You can load the user's real avatar here using seatInfo.userAvatar
                   avatarView
               }
               null -> null
           }
       }
   }
   ```
- **Step 3**: Implement the `VideoViewAdapter.createCoHostView` method, returning the appropriate view based on `viewLayer`.

   ``` kotlin
   import com.tencent.cloud.tuikit.engine.room.TUIRoomDefine
   import android.view.View
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.ViewLayer
   import io.trtc.tuikit.atomicxcore.api.VideoViewAdapter

   // 1. In your Activity, implement the VideoViewAdapter interface
   class YourActivity : AppCompatActivity(), VideoViewAdapter {

       // ... Other code ...

       // 2. Fully implement the interface method to handle both view layers
       override fun createCoHostView(coHostUser: TUIRoomDefine.SeatFullInfo?, viewLayer: ViewLayer?): View? {
           val seatInfo = coHostUser ?: return null
           val userId = seatInfo.userId
           if (userId.isNullOrEmpty()) {
               return null
           }

           return when (viewLayer) {
               ViewLayer.FOREGROUND -> {
                   val seatView = CustomSeatView(this)
                   seatView.setUserName(seatInfo.userName ?: "")
                   seatView
               }
               ViewLayer.BACKGROUND -> {
                   val avatarView = CustomAvatarView(this)
                   // You can load the user's real avatar here using seatInfo.userAvatar
                   avatarView
               }
               null -> null
           }
       }
   }
   ```

#### Parameter Description:
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>seatInfo</code> | <code>SeatFullInfo?</code> | Seat information object containing user details |
| <code>seatInfo.userId</code> | <code>String?</code> | User ID on the seat |
| <code>seatInfo.userName</code> | <code>String?</code> | User nickname on the seat |
| <code>seatInfo.userAvatar</code> | <code>String?</code> | User avatar URL |
| <code>seatInfo.userMicrophoneStatus</code> | <code>DeviceStatus</code> | User microphone status |
| <code>seatInfo.userCameraStatus</code> | <code>DeviceStatus</code> | User camera status |
| <code>viewLayer</code> | <code>ViewLayer</code> | View layer enum<br>- <code>FOREGROUND</code>: Foreground widget view, always displayed on top of the video<br>- <code>BACKGROUND</code>: Background widget view, under the foreground view, displayed only when the user has no video stream (e.g., camera off), typically used for the user's default avatar or a placeholder image |

### Displaying PK User Score on Video View

When the host starts a PK, you can attach a custom view to the opponent's video to display gift values or other PK-related information.

#### Implementation Example

#### Implementation
- **Step 1**: Create a custom PK user view. For a complete implementation, see [BattleMemberInfoView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/features/anchorview/view/battle/widgets/BattleMemberInfoView.kt)  in the open-source TUILiveKit project.

   ``` kotlin
   import android.content.Context
   import android.graphics.Color
   import android.view.Gravity
   import android.widget.LinearLayout
   import android.widget.TextView
   import com.tencent.cloud.tuikit.engine.extension.TUILiveBattleManager.BattleUser
   import io.trtc.tuikit.atomicxcore.api.BattleStore
   import kotlinx.coroutines.CoroutineScope
   import kotlinx.coroutines.Dispatchers
   import kotlinx.coroutines.launch

   // Custom PK User View
   class CustomBattleUserView(
       context: Context,
       private val liveId: String,
       private val battleUser: BattleUser
   ) : LinearLayout(context) {

       private lateinit var scoreView: LinearLayout
       private lateinit var scoreLabel: TextView
       private val battleStore: BattleStore

       init {
           orientation = VERTICAL
           gravity = Gravity.BOTTOM or Gravity.END
           setBackgroundColor(Color.TRANSPARENT)
           isClickable = false

           battleStore = BattleStore.create(liveId)

           // UI Layout
           setupUI()
           // Subscribe to score changes
           subscribeBattleState()
       }

       private fun setupUI() {
           scoreView = LinearLayout(context).apply {
               setBackgroundColor(Color.parseColor("#66000000"))
               orientation = VERTICAL
               gravity = Gravity.CENTER
           }

           scoreLabel = TextView(context).apply {
               setTextColor(Color.WHITE)
               textSize = 14f
               gravity = Gravity.CENTER
           }

           scoreView.addView(scoreLabel)
           addView(scoreView)

           val layoutParams = scoreView.layoutParams as LayoutParams
           layoutParams.width = LayoutParams.WRAP_CONTENT
           layoutParams.height = 48 // 24dp
           layoutParams.setMargins(0, 0, 10, 10)
       }

       // Subscribe to PK score changes
       private fun subscribeBattleState() {
           CoroutineScope(Dispatchers.Main).launch {
               battleStore.battleState.battleScore.collect { battleScore ->
                   val score = battleScore[battleUser.userId] ?: 0
                   // Update UI
                   scoreLabel.text = score.toString()
               }
           }
       }
   }
   ```
- **Step 2**: Implement the `VideoViewAdapter.createBattleView` method.

   ``` kotlin
   // 1. Have your Activity implement the VideoViewAdapter interface
   class YourActivity : AppCompatActivity(), VideoViewAdapter {

       override fun createBattleView(battleUser: BattleUser?): View? {
           battleUser ?: return null
           // CustomBattleUserView is your custom PK user information view
           return CustomBattleUserView(this, liveId, battleUser)
       }

   }
   ```

#### Parameter Description:

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`battleUser`|`BattleUser?`|PK user info object|
|`battleUser.roomId`|`String`|PK room ID|
|`battleUser.userId`|`String`|PK user ID|
|`battleUser.userName`|`String`|PK user nickname|
|`battleUser.avatarUrl`|`String`|PK user avatar URL|
|`battleUser.score`|`UInt`|PK score|

### Displaying PK Status on Video Stream

#### Implementation Example

#### Implementation
- **Step 1**: Create a custom PK global view (CustomBattleContainerView). For a complete implementation, see [BattleInfoView.kt](https://github.com/Tencent-RTC/TUIKit_Android/blob/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/features/anchorview/view/battle/widgets/BattleInfoView.kt)  in the open-source TUILiveKit project.

- **Step 2**: Implement the `VideoViewAdapter.createBattleContainerView` method.

   ``` kotlin
   // Have your Activity implement the VideoViewAdapter interface and set the adapter
   class YourActivity : AppCompatActivity(), VideoViewAdapter {
       override fun createBattleContainerView(): View? {
           return CustomBattleContainerView(this)
       }
   }
   ```

## Advanced Features

### Updating PK Score via REST API

In typical **live host PK scenarios,** the value of gifts received by the host is linked to the PK score (for example, when a viewer sends a "Rocket" gift, the host's PK score increases by 500 points). You can implement real-time PK score updates using our REST API.

> **Note：**
> The PK score system in the `LiveKit` backend uses pure numeric calculation and accumulation. You must calculate the PK score according to your own business logic before calling the update API. See the following PK score calculation examples:
>

|Gift Type|Score Calculation Rule|Example|
|---------|---------|---------|
|Basic Gift|Gift value × 5|10 RMB gift → 50 points|
|Intermediate Gift|Gift value × 8|50 RMB gift → 400 points|
|Advanced Gift|Gift value × 12|100 RMB gift → 1200 points|
|Special Effect Gift|Fixed high score|520 RMB gift → 1314 points|

#### REST API Call Flow

#### Key Process Description
1. **Obtain PK Status:**

  - **Callback Configuration**: Configure PK Status Callback to have the `LiveKit` backend actively notify your system when PK starts or ends.

  - **Active Query**: Your backend can call the PK Status Query API at any time to check the current PK status.

2. **PK Score Calculation**: Your backend calculates the PK score increment based on your business rules.

3. **PK Score Update**: Your backend calls the Update PK Score API to update the PK score in the LiveKit backend.

4. **LiveKit Backend Syncs to Client**: The backend automatically synchronizes the updated PK score to all clients.

#### Involved REST API Endpoints

|**API**|**Function Description**|**Request Example**|
|---------|---------|---------|
|Active API - Query PK Status|Check whether the current room is in PK|Example|
|Active API - Update PK Score|Update the calculated PK score|Example|
|Callback Configuration - PK Start Callback|Receive real-time notification when PK starts|Example|
|Callback Configuration - PK End Callback|Receive real-time notification when PK ends|Example|

## API Documentation

For detailed information on all public interfaces, properties, and methods of [CoHostStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)  and related classes, refer to the official API documentation included with the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Android/index.html) framework. The relevant stores used in this guide are as follows:

|**Store/Component**|**Description**|**API Reference**|
|---------|---------|---------|
|`LiveCoreView`|Core view component for displaying and interacting with live video streams. Handles video rendering and view widgets, supports host streaming, audience co-hosting, host connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html)|
|`DeviceStore`|Controls audio/video devices: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, and real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|
|`CoHostStore`|Handles host cross-room connections: supports multiple layout templates (dynamic grid, etc.), initiates/accepts/rejects connections, and manages co-host interactions.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-host-store/index.html)|
|`BattleStore`|Manages host PK battles: initiate PK (set duration/opponent), manage PK status (start/end), synchronize scores, and listen for battle results.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-battle-store/index.html)|

## FAQs

### Why didn't the other party receive my co-hosting invitation?
- Ensure that `targetHostLiveId` is correct and that the other host's live room is broadcasting normally.

- Check network stability. The invitation signaling has a default timeout of 30 seconds.

### What happens if one host disconnects from the network or the app crashes during co-hosting or PK?

Both `CoHostStore` and `BattleStore` include built-in heartbeat and timeout detection. If one party exits abnormally, the other party is notified via events such as `onCoHostUserLeft` or `onUserExitBattle`. You can update the UI accordingly, for example, by displaying "The other party has disconnected" and ending the interaction.

### Why can PK scores only be updated via REST API?

The REST API meets the security, real-time, and scalability requirements for PK scores:
- **Tamper-proof and fair**: Requires authentication and data validation. Each update is traceable (e.g., tied to a gift action), preventing manual score changes or cheating and ensuring fair competition.

- **Real-time synchronization across multiple clients**: Uses standardized formats (such as JSON) to quickly connect gift, PK, and display systems, ensuring real-time consistency of scores among hosts, viewers, and backend.

- **Flexible rule adaptation**: Backend configuration changes (such as adjusting gift-to-score mapping or bonus points) can be made without modifying the frontend, reducing iteration costs.

### How do I manage the lifecycle and events of custom views added via `VideoViewAdapter`?

`LiveCoreView` automatically manages views returned by delegate methods, including adding and removing them. No manual lifecycle management is required.

**AtomicXCore** provides the [CoGuestStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html) module, purpose-built to manage the complete audience co-hosting workflow. You do not need to handle complex state synchronization or signaling logic—simply call a few intuitive methods to add robust audio and video interaction between viewers and hosts in your live stream.

## Core Features

`CoGuestStore` supports the two most common co-hosting scenarios:
- **Audience Request to Join**: An audience member initiates a co-hosting request, and the host can accept or reject it.

- **Host Invites to Join**: The host can invite any audience member in the live room to co-host.

## Core Concepts
| <strong>Core Concept</strong> | <strong>Core Responsibilities</strong> | <strong>Key APIs / Properties</strong> |
| --- | --- | --- |
| <code>CoGuestStore</code> | Manages the entire signaling workflow for viewer-host interaction (Apply, Invite, Accept, Reject, Disconnect) and maintains real-time state of related user lists. | - <code>coGuestState</code>: A read-only StateFlow containing <code>connected</code> (current co-guests), <code>applicants</code> (pending applications), and <code>invitees</code> (pending invitations).<br>- <code>applyForSeat()</code>: Viewer applies to become a co-guest.<br>- <code>inviteToSeat()</code>: Host invites a viewer to take a seat.<br>- <code>acceptApplication()</code>: Host accepts a link mic application.<br>- <code>disconnect():</code> Terminates the connection. |
| <code>HostListener</code> | Used by the UI layer to respond to events such as "Received viewer application" or "Viewer accepted invitation". | - <code>onGuestApplicationReceived()</code>: Triggered when a viewer applies for a seat.<br>- <code>onHostInvitationResponded()</code>: Triggered when a viewer responds to an invitation. |
| <code>GuestListener</code> | Used by the UI layer to respond to events such as "Received host invitation", "Application approved", or "Kicked off seat". | - <code>onHostInvitationReceived()</code>: Triggered when the host sends an invitation.<br>- <code>onGuestApplicationResponded()</code>: Triggered when the host processes an application (Accept/Reject).<br>- <code>onKickedOffSeat()</code>: Triggered when kicked off the seat by the host. |

## Implementation

### Step 1: Component Integration

### Step 2: Implement Audience Request to Join

#### Audience-Side Implementation

As an audience member, your primary tasks are to **initiate a request, handle the host's response, and leave the seat when desired.**
1. **Initiate a Co-hosting Request**

   When the user taps the "Request to Join" button, call the `applyForSeat` method.

   ``` kotlin
   import io.trtc.tuikit.atomicxcore.api.live.CoGuestStore
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler

   val liveId = "Room ID"
   val guestStore = CoGuestStore.create(liveId)

   // User clicks "Request to Join"
   fun requestToConnect() {
       // timeout: Request timeout in seconds, e.g., 30
       guestStore.applyForSeat(
           seatIndex = 0,
           timeout = 30,
           extraInfo = null,
           completion = object : CompletionHandler {
               override fun onSuccess() {
                   println("Co-hosting request sent, waiting for host response...")
               }

               override fun onFailure(code: Int, desc: String) {
                   println("Failed to send request: $desc")
               }
           }
       )
   }
   ```
2. **Listen for Host Response**

   Add a `GuestListener` to receive the host's response.

   ``` kotlin
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
   import io.trtc.tuikit.atomicxcore.api.live.CoGuestStore
   import io.trtc.tuikit.atomicxcore.api.live.GuestListener
   import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo

   class YourActivity : AppCompatActivity() {
       val liveId = "Room ID"
       val guestStore = CoGuestStore.create(liveId)
       val deviceStore = DeviceStore.shared()
       private val guestListener = object : GuestListener() {
           override fun onGuestApplicationResponded(isAccept: Boolean, hostUser: LiveUserInfo) {
               if (isAccept) {
                   println("Host ${hostUser.userName} accepted your request. Preparing to join the seat.")
                   // Co-hosting request accepted; enable camera and microphone
                   DeviceStore.shared().openLocalCamera(true, completion = null)
                   DeviceStore.shared().openLocalMicrophone(completion = null)
                   // Update UI, e.g., disable request button and show co-hosting status
               } else {
                   println("Host ${hostUser.userName} rejected your request.")
                   // Show rejection notification
               }
           }
       }

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           guestStore.addGuestListener(guestListener)
       }

       override fun onDestroy() {
           super.onDestroy()
           guestStore.removeGuestListener(guestListener)
       }
   }
   ```
3. **Leave the Seat**

   When the co-hosting audience member wants to end the interaction, call `disconnect` to return to audience status.

   ``` kotlin
   // User clicks "Leave Seat"
   fun leaveSeat() {
       guestStore.disconnect(object : CompletionHandler {
           override fun onSuccess() {
               println("Successfully left the seat")
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to leave seat: $desc")
           }
       })
   }
   ```
4. **(Optional) Cancel Request**

   To withdraw a pending request before the host responds, call `cancelApplication`.

   ``` kotlin
   // User clicks "Cancel Request"
   fun cancelRequest() {
       guestStore.cancelApplication(object : CompletionHandler {
           override fun onSuccess() {
               println("Request cancelled")
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to cancel request: $desc")
           }
       })
   }
   ```

#### Host-Side Implementation

As a host, your main responsibilities are to **receive requests, display the applicant list, and process requests**.
1. **Listen for New Co-hosting Requests**

   Add a `HostListener` to be notified when a new audience request arrives.

   ``` kotlin
   import android.os.Bundle
   import androidx.appcompat.app.AppCompatActivity
   import io.trtc.tuikit.atomicxcore.api.live.CoGuestStore
   import io.trtc.tuikit.atomicxcore.api.live.HostListener
   import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo

   class YourActivity : AppCompatActivity() {
       val liveId = "Room ID"
       val guestStore = CoGuestStore.create(liveId)
       val hostListener = object : HostListener() {
           override fun onGuestApplicationReceived(guestUser: LiveUserInfo) {
               println("Received co-hosting request from ${guestUser.userName}")
               // Update UI, e.g., show a badge on the "Request List" button
           }
       }

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // Add listener
           guestStore.addHostListener(hostListener)
       }

       override fun onDestroy() {
           super.onDestroy()
           // Remove listener
           guestStore.removeHostListener(hostListener)
       }
   }
   ```
2. **Display Request List**

   `CoGuestStore` maintains the current list of applicants in real time. Subscribe to this list to update your UI.

   ``` kotlin
   class YourActivity : AppCompatActivity() {
       val liveId = "Room ID"
       val guestStore = CoGuestStore.create(liveId)

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)

           // Subscribe to applicant list updates
           lifecycleScope.launch {
               guestStore.coGuestState.applicants.collect { applicants ->
                   println("Current number of applicants: ${applicants.size}")
                   // Update your "Applicant List" UI here
                   // updateApplicantListView(applicants)
               }
           }
       }
   }
   ```
3. **Process Co-hosting Requests**

   When you select an audience member and choose "Accept" or "Reject", call the corresponding method.

   ``` kotlin
   // Host taps "Accept" for a given userId
   fun accept(userId: String) {
       guestStore.acceptApplication(userId, object : CompletionHandler {
           override fun onSuccess() {
               println("Accepted $userId's request. They are joining the stage.")
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to accept request: $desc")
           }
       })
   }

   // Host taps "Reject"
   fun reject(userId: String) {
       guestStore.rejectApplication(userId, object : CompletionHandler {
           override fun onSuccess() {
               println("Rejected $userId's request")
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to reject request: $desc")
           }
       })
   }
   ```

### Step 3: Implement Host Inviting Audience to Join the Stage

#### Host-Side Implementation
1. **Send Invitation to Audience**

   When the host selects an audience member and taps "Invite to Co-host", call the `inviteToSeat` method.

   ``` kotlin
   // Host selects an audience member and sends an invitation
   fun invite(userId: String) {
       // timeout: Invitation timeout duration in seconds
       guestStore.inviteToSeat(
           inviteeID = userId,
           seatIndex = 0,
           timeout = 30,
           extraInfo = null,
           completion = object : CompletionHandler {
               override fun onSuccess() {
                   println("Invitation sent to $userId. Waiting for response...")
               }

               override fun onFailure(code: Int, desc: String) {
                   println("Failed to send invitation: $desc")
               }
           }
       )
   }
   ```
2. **Listen for Audience Response**

   Listen for the `onHostInvitationResponded` event via `HostListener`.

   ``` kotlin
   // In HostListener implementation
   override fun onHostInvitationResponded(isAccept: Boolean, guestUser: LiveUserInfo) {
       if (isAccept) {
           println("Audience member ${guestUser.userName} accepted your invitation")
       } else {
           println("Audience member ${guestUser.userName} rejected your invitation")
       }
   }
   ```

#### Audience-Side Implementation
1. **Receive Host Invitation**

   Listen for the `onHostInvitationReceived` event via `GuestListener`.

   ``` kotlin
   // In GuestListener implementation
   override fun onHostInvitationReceived(hostUser: LiveUserInfo) {
       println("Received co-hosting invitation from host ${hostUser.userName}")
       // Show a dialog to let the user choose "Accept" or "Reject"
       // showInvitationDialog(hostUser)
   }
   ```
2. **Respond to Invitation**

   After the user makes a selection, call the corresponding method.

   ``` kotlin
   val inviterId = "Inviting Host ID" // Obtained from onHostInvitationReceived

   // User taps "Accept"
   fun accept() {
       guestStore.acceptInvitation(inviterId, object : CompletionHandler {
           override fun onSuccess() {
               // Enable camera and microphone
               DeviceStore.shared().openLocalCamera(true, completion = null)
               DeviceStore.shared().openLocalMicrophone(completion = null)
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to accept invitation: $desc")
           }
       })
   }

   // User taps "Reject"
   fun reject() {
       guestStore.rejectInvitation(inviterId, object : CompletionHandler {
           override fun onSuccess() {
               println("Invitation rejected")
           }

           override fun onFailure(code: Int, desc: String) {
               println("Failed to reject invitation: $desc")
           }
       })
   }
   ```

### Run and Test

After integrating the above features, use two audience members and a host to test co-hosting. For example, Audience A enables both camera and microphone, while Audience B enables only the microphone. The result is shown below. For UI customization, see Refining UI Details.

## Refining UI Details

Use the "slot" feature provided by the `VideoViewAdapter` interface to add custom views on top of audience co-hosting video streams. For example, display nicknames, avatars, or show a placeholder image when the camera is off to enhance the user experience.

### Displaying Nicknames on Video Streams

#### Implementation Example

#### Implementation

> **Note：**
> You can also refer to the [widgets](https://github.com/Tencent-RTC/TUIKit_Android/tree/main/live/tuilivekit/src/main/java/com/trtc/uikit/livekit/features/audienceview/view/coguest/widgets) directory in the open-source TUILiveKit project for a complete implementation.
>

- **Step 1**: Create the foreground view `CustomSeatView` to display user info above the video stream.

   ``` kotlin
   import android.content.Context
   import android.graphics.Color
   import android.view.Gravity
   import android.view.ViewGroup
   import android.widget.LinearLayout
   import android.widget.TextView

   // Custom floating user info view (foreground)
   class CustomSeatView(context: Context) : LinearLayout(context) {
       private val nameLabel: TextView

       init {
           orientation = VERTICAL
           gravity = Gravity.BOTTOM or Gravity.START
           setBackgroundColor(Color.parseColor("#80000000")) // Semi-transparent black background

           nameLabel = TextView(context).apply {
               setTextColor(Color.WHITE)
               textSize = 14f
           }

           addView(nameLabel, LayoutParams(
               ViewGroup.LayoutParams.WRAP_CONTENT,
               ViewGroup.LayoutParams.WRAP_CONTENT
           ).apply {
               setMargins(20, 0, 0, 20) // Left margin 20, bottom margin 20
           })
       }

       fun setUserName(userName: String) {
           nameLabel.text = userName
       }
   }
   ```
- **Step 2**: Create the background view `CustomAvatarView` to serve as a placeholder when the user has no video stream.

   ``` kotlin
   import android.content.Context
   import android.graphics.Color
   import android.view.Gravity
   import android.view.ViewGroup
   import android.widget.ImageView
   import android.widget.LinearLayout

   // Custom avatar placeholder view (background)
   class CustomAvatarView(context: Context) : LinearLayout(context) {
       private val avatarImageView: ImageView

       init {
           orientation = VERTICAL
           gravity = Gravity.CENTER
           setBackgroundColor(Color.TRANSPARENT)

           avatarImageView = ImageView(context).apply {
               setColorFilter(Color.GRAY)
               scaleType = ImageView.ScaleType.CENTER_CROP
           }

           addView(avatarImageView, LayoutParams(120, 120)) // 60dp * 2 = 120px
       }

       fun setUserAvatar(avatarUrl: String) {
           // Load user avatar here, e.g., using Glide
           // Glide.with(context).load(avatarUrl).into(avatarImageView)
       }
   }
   ```
- **Step 3**: Implement the `VideoViewAdapter.createCoGuestView` interface. Return the appropriate view based on the viewLayer value.

   ``` kotlin
   import android.os.Bundle
   import android.view.View
   import androidx.appcompat.app.AppCompatActivity
   import com.tencent.cloud.tuikit.engine.room.TUIRoomDefine
   import io.trtc.tuikit.atomicxcore.api.view.VideoViewAdapter
   import io.trtc.tuikit.atomicxcore.api.view.ViewLayer

   // Implement VideoViewAdapter in your Activity
   class YourActivity : AppCompatActivity(), VideoViewAdapter {

       // ... other code ...

       // Implement the interface method for both viewLayer types
       override fun createCoGuestView(userInfo: TUIRoomDefine.SeatFullInfo?, viewLayer: ViewLayer?): View? {
           userInfo ?: return null
           val userId = userInfo.userId
           if (userId.isNullOrEmpty()) return null

           return when (viewLayer) {
               ViewLayer.FOREGROUND -> {
                   // Show foreground view when camera is on
                   val seatView = CustomSeatView(this)
                   seatView.setUserName(userInfo.userName ?: "")
                   seatView
               }
               ViewLayer.BACKGROUND -> {
                   // Show background view when camera is off
                   val avatarView = CustomAvatarView(this)
                   userInfo.userAvatar?.let { avatarView.setUserAvatar(it) }
                   avatarView
               }
               else -> null
           }
       }

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // Set the adapter
           liveCoreView.setVideoViewAdapter(this)
       }
   }
   ```

#### Parameter Description:
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>seatInfo</code> | <code>SeatFullInfo?</code> | Seat information object, containing detailed information about the user on the seat |
| <code>seatInfo.userId</code> | <code>String</code> | ID of the user on the seat |
| <code>seatInfo.userName</code> | <code>String</code> | Nickname of the user on the seat |
| <code>seatInfo.userAvatar</code> | <code>String</code> | Avatar URL of the user on the seat |
| <code>seatInfo.userMicrophoneStatus</code> | <code>DeviceStatus</code> | Microphone status of the user on the seat |
| <code>seatInfo.userCameraStatus</code> | <code>DeviceStatus</code> | Camera status of the user on the seat |
| <code>viewLayer</code> | <code>ViewLayer</code> | View layer enum:<br>- <code>FOREGROUND</code>: Foreground widget view, always displayed on top of the video<br>- <code>BACKGROUND</code>: Background widget view, displayed below the foreground view, only shown when the user has no video stream (e.g., camera is off); typically used for the user's avatar or a placeholder image |

## API Documentation

For detailed information on all public interfaces, properties, and methods of [CoGuestStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html) and related classes, refer to the official API documentation included with the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Android/index.html) framework. The relevant stores used in this guide include:

|**Store/Component**|**Function Description**|**API Documentation**|
|---------|---------|---------|
|LiveCoreView|Core view component for live video stream display and interaction. Handles video rendering and widget management, supporting host streaming, audience co-hosting, host connections, and more.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-live-core-view/index.html)|
|DeviceStore|Audio and video device control: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, real-time device status monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html)|
|CoGuestStore|Audience co-hosting management: request/invite/accept/reject co-hosting, permission control (microphone/camera), state synchronization.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|

## FAQs

### How do I manage the lifecycle and events of custom views added via `VideoViewAdapter`?

LiveCoreView automatically manages the addition and removal of views returned by your adapter methods. You do not need to handle this manually. To support user interactions (such as click events) in your custom view, add the appropriate event listeners when creating the view.

### What is the purpose of the viewLayer parameter in VideoViewAdapter?

The viewLayer parameter distinguishes between foreground and background widgets:
- `FOREGROUND`: Foreground layer, always displayed on top of the video.

- `BACKGROUND`: Background layer, displayed only when the user has no video stream (e.g., camera is off); typically used to show the user's avatar or a placeholder image.

### Why is my custom view not showing up?
- **Check adapter settings**: Ensure you have called liveCoreView.setVideoViewAdapter(this) and set the adapter successfully.

- **Check implementation method**: Confirm that you have correctly implemented the relevant adapter method (such as createCoGuestView).

- **Check return value**: Make sure your adapter method returns a valid View instance at the appropriate time, not null. Add logs in the adapter method for debugging if needed.

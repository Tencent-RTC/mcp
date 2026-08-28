AtomicXCore provides the [CoGuestStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html) and [LiveSeatStore](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-seat-store/index.html) modules, which are designed to streamline the entire audience co-hosting workflow for live streaming scenarios. You do not need to manage complex state synchronization or signaling logic—simply invoke a few intuitive methods to enable seamless audio and video interactions between hosts and audience members. This guide explains how to quickly implement voice co-hosting features in your Android app using `CoGuestStore` and `LiveSeatStore`.

## Core Scenarios

`CoGuestStore` and `LiveSeatStore` support the following primary live streaming scenarios:
- **Audience Request to Join Mic**: Audience members can request to join the mic; hosts can approve or reject these requests.

- **Host Invites Audience to Mic**: The host can proactively invite any viewer in the live room to join the mic.

- **Host Manages Mic Seats**: Hosts can manage mic seat users, including removing users, muting, and locking mic seats.

## Implementation

### Step 1: Component Integration

### Step 2: Implement Audience Mic-Link Request

#### Audience Side Implementation

As an audience member, your main tasks are **initiating a request, handling the response**, and **leaving the mic proactively**.
1. **Initiate Mic-Link Request**

   When the user taps the "Request to Co-host" button, call the `applyForSeat` method:

   ``` java
   import io.trtc.tuikit.atomicxcore.api.CompletionHandler
   import io.trtc.tuikit.atomicxcore.api.live.CoGuestStore

   val liveId = "Room ID"
   val guestStore = CoGuestStore.create(liveId)

   // User taps "Request to Co-host"
   fun requestToConnect() {
       // timeout: request timeout, e.g., 30 seconds
       guestStore.applyForSeat(-1, 30, null, object : CompletionHandler {
           override fun onSuccess() {
               print("Co-hosting request sent, waiting for host to respond...")
           }

           override fun onFailure(code: Int, desc: String) {
               print("Failed to send request: $desc")
           }
       })
   }
   ```
2. **Listen for Host Response**

   Subscribe to `GuestListener` to handle the host’s approval or rejection:

   ``` java
   import io.trtc.tuikit.atomicxcore.api.device.DeviceStore
   import io.trtc.tuikit.atomicxcore.api.live.GuestListener
   import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo

   // Add listener during Activity/Fragment initialization
   fun subscribeGuestEvents() {
       val guestListener = object : GuestListener() {
           override fun onGuestApplicationResponded(isAccept: Boolean, hostUser: LiveUserInfo) {
               if (isAccept) {
                   print("Host ${hostUser.userName} approved your request. Preparing to join mic.")
                   // 1. Enable camera and microphone
                   DeviceStore.shared().openLocalCamera(true, null)
                   DeviceStore.shared().openLocalMicrophone(null)
                   // 2. Update UI, e.g., disable request button, show co-hosting status
               } else {
                   print("Host ${hostUser.userName} rejected your request.")
                   // Notify user of rejection
               }
           }
       }
       guestStore.addGuestListener(guestListener)
   }
   ```
3. **Leave Mic Proactively**

   To leave the mic seat and revert to audience status, call `disconnect`:

   ``` java
   // User taps "Leave Mic"
   fun leaveSeat() {
       guestStore.disconnect(object : CompletionHandler {
           override fun onSuccess() {
               print("Successfully left the mic")
           }

           override fun onFailure(code: Int, desc: String) {
               print("Failed to leave mic: $desc")
           }
       })
   }
   ```
4. **(Optional) Cancel Request**

   If the audience member wishes to withdraw their request before the host responds, call `cancelApplication`:

   ``` java
   // User taps "Cancel Request" while waiting
   fun cancelRequest() {
       guestStore.cancelApplication(object : CompletionHandler {
           override fun onSuccess() {
               print("Request cancelled")
           }

           override fun onFailure(code: Int, desc: String) {
               print("Failed to cancel request: $desc")
           }
       })
   }
   ```

#### Host Side Implementation

As the host, your main tasks are **receiving requests, displaying the request list**, and **handling requests**.
1. **Listen for New Mic-Link Requests**

   Subscribe to `HostListener` to receive notifications when an audience member requests to join the mic:

   ``` java
   import io.trtc.tuikit.atomicxcore.api.live.CoGuestStore
   import io.trtc.tuikit.atomicxcore.api.live.HostListener
   import io.trtc.tuikit.atomicxcore.api.live.LiveUserInfo

   val liveId = "Room ID"
   val guestStore = CoGuestStore.create(liveId)

   // Subscribe to host events
   val hostListener = object : HostListener() {
       override fun onGuestApplicationReceived(guestUser: LiveUserInfo) {
           print("Received co-hosting request from ${guestUser.userName}")
           // Update UI, e.g., show notification on "Request List" button
       }
       // ... Override other needed callback methods
   }
   guestStore.addHostListener(hostListener)
   ```
2. **Display Request List**

   Subscribe to the `applicants` property in `CoGuestStore`’s state to update the UI in real time:

   ``` java
   import kotlinx.coroutines.CoroutineScope
   import kotlinx.coroutines.Dispatchers
   import kotlinx.coroutines.launch

   // Subscribe to state changes
   fun observeApplicants() {
       CoroutineScope(Dispatchers.Main).launch {
           guestStore.coGuestState.applicants.collect { applicants ->
               print("Current number of applicants: ${applicants.size}")
               // Update "Applicant List" UI
           }
       }
   }
   ```
3. **Handle Mic-Link Requests**

   Approve or reject requests using the following methods:

   ``` java
   // Host taps "Approve"
   fun accept(userId: String) {
       guestStore.acceptApplication(
           userId,
           object : CompletionHandler {
               override fun onSuccess() {
                   print("Approved $userId's request. They are joining the mic.")
               }

               override fun onFailure(code: Int, desc: String) {
                   print("Failed to approve request: $desc")
               }
           }
       )
   }

   // Host taps "Reject"
   fun reject(userId: String) {
       guestStore.rejectApplication(
           userId,
           object : CompletionHandler {
               override fun onSuccess() {
                   print("Rejected $userId's request")
               }

               override fun onFailure(code: Int, desc: String) {
                   print("Failed to reject request: $desc")
               }
           }
       )
   }
   ```

### Step 3: Implement Host-Initiated Mic-Link Invitation

#### Host Side Implementation
1. **Invite Audience Mic**

   To invite an audience member, call `inviteToSeat`:

   ``` java
   // Host selects audience and sends invitation
   fun invite(userId: String) {
       // timeout: invitation timeout
       guestStore.inviteToSeat(userId, -1, 30, null, object : CompletionHandler {
           override fun onSuccess() {
               print("Invitation sent to $userId, waiting for response...")
           }

           override fun onFailure(code: Int, desc: String) {
               print("Failed to send invitation: $desc")
           }
       })
   }
   ```
2. **Listen for Audience Response**

   Handle the audience member’s response via `HostListener`:

   ``` java
   // Add to hostListener implementation
   override fun onHostInvitationResponded(isAccept: Boolean, guestUser: LiveUserInfo) {
       if (isAccept) {
           print("Audience ${guestUser.userName} accepted your invitation")
       } else {
           print("Audience ${guestUser.userName} rejected your invitation")
       }
   }
   ```

#### Audience Side Implementation
1. **Receive Host Invitation**

   Listen for invitations via `GuestListener`:

   ``` java
   // Add to guestListener implementation
   override fun onHostInvitationReceived(hostUser: LiveUserInfo) {
       print("Received co-hosting invitation from host ${hostUser.userName}")
       // Show dialog for user to accept or reject
   }
   ```
2. **Respond to Invitation**

   Invoke the appropriate method based on the user’s choice:

   ``` java
   val inviterId = "Host ID who sent the invitation" // From onHostInvitationReceived

   // User taps "Accept"
   fun accept() {
       guestStore.acceptInvitation(inviterId, object : CompletionHandler {
           override fun onSuccess() {
               // Enable microphone
               DeviceStore.shared().openLocalMicrophone(null)
           }

           override fun onFailure(code: Int, desc: String) {
               print("Failed to accept invitation: $desc")
           }
       })
   }

   // User taps "Reject"
   fun reject() {
       guestStore.rejectInvitation(inviterId, object : CompletionHandler {
           override fun onSuccess() {
               // ...
           }
           override fun onFailure(code: Int, desc: String) {
               // ...
           }
       })
   }
   ```

## Advanced Features

Once a user is on mic, the host may need to manage mic seats. The following features are primarily provided by `LiveSeatStore`, which functions with `CoGuestStore`.

### On-Mic Users Control Their Own Microphone

On-mic users (including the host) can control their own microphone mute status via the `LiveSeatStore` interface.

#### Implementation
- **Mute:** Call `muteMicrophone()`. This is a one-way request with no callback.

- **Unmute:** Call `unmuteMicrophone(completion)`.

#### Example Code
``` java
import io.trtc.tuikit.atomicxcore.api.live.LiveSeatStore

val seatStore = LiveSeatStore.create(liveId)

seatStore.muteMicrophone() // Mute

seatStore.unmuteMicrophone(null) // Unmute
```

#### unmuteMicrophone Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`completion`|`CompletionHandler?`|Callback after operation completes.|

### Host Remotely Controls Mic Seat User’s Microphone

Hosts can forcibly mute or invite mic seat users to unmute.

#### Implementation
1. **Force Mute (Lock):** Hosts call `closeRemoteMicrophone` to mute and lock a user’s microphone. The user receives the `onLocalMicrophoneClosedByAdmin` event in `LiveSeatListener`, and their "Unmute Microphone" button should be disabled.

2. **Invite to Unmute (Unlock):** Hosts call `openRemoteMicrophone` to unlock mic permissions. The user receives the `onLocalMicrophoneOpenedByAdmin` event and can unmute themselves.

3. **User Unmutes Themselves:** After receiving an unlock notification, the user must call `unmuteMicrophone()` to resume audio transmission.

#### Example Code

##### Host Side
``` java
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.live.DeviceControlPolicy

val targetUserId = "userD"

// 1. Force mute and lock
seatStore.closeRemoteMicrophone(targetUserId, object : CompletionHandler {
    override fun onSuccess() {
        print("$targetUserId has been muted and locked")
    }
    override fun onFailure(code: Int, desc: String) {
        print("Operation failed: $desc")
    }
})

// 2. Unlock mic permissions (userD remains muted)
seatStore.openRemoteMicrophone(targetUserId, DeviceControlPolicy.UNLOCK_ONLY, object : CompletionHandler {
    override fun onSuccess() {
        print("Invited $targetUserId to unmute (unlocked)")
    }
    override fun onFailure(code: Int, desc: String) {
        print("Operation failed: $desc")
    }
})
```

##### Audience Side
``` java
import io.trtc.tuikit.atomicxcore.api.live.DeviceControlPolicy
import io.trtc.tuikit.atomicxcore.api.live.LiveSeatListener

// userD listens for host actions
val seatListener = object : LiveSeatListener() {
    override fun onLocalMicrophoneClosedByAdmin() {
        print("Muted by host")
    }

    override fun onLocalMicrophoneOpenedByAdmin(policy: DeviceControlPolicy) {
        print("Host has unlocked mute")
    }
}
seatStore.addLiveSeatEventListener(seatListener)
```

#### closeRemoteMicrophone Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|The user ID of the target user.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

#### openRemoteMicrophone Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|The user ID of the target user.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

### Host Removes On-Mic User from the Seat

#### Implementation
1. **Remove User from Mic Seat:** Hosts call `kickUserOutOfSeat` to forcibly remove a user from a mic seat.

2. **Event Notification:** The removed user receives the `onKickedOffSeat` event in `GuestListener`.

#### Example Code
``` java
// Remove "userB" from mic seat
val targetUserId = "userB"
seatStore.kickUserOutOfSeat(targetUserId, object : CompletionHandler {
    override fun onSuccess() {
        print("$targetUserId has been removed from the mic seat")
    }
    override fun onFailure(code: Int, desc: String) {
        print("Failed to remove user: $desc")
    }
})

// "userB" receives the event in GuestListener
override fun onKickedOffSeat(seatIndex: Int, hostUser: LiveUserInfo) {
    // Show notification
}
```

#### kickUserOutOfSeat Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|The user ID of the user to remove.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

### Host Locks and Unlocks Mic Seats

Hosts can lock or unlock specific mic seats.

#### Implementation
1. **Lock Mic Seat:** Call `lockSeat` to lock a mic seat at the specified index. Locked seats cannot be occupied via `applyForSeat` or `takeSeat`.

2. **Unlock Mic Seat:** Call `unlockSeat` to make the seat available again.

#### Example Code
``` java
// Lock mic seat 2
seatStore.lockSeat(2, object : CompletionHandler {
    override fun onSuccess() {
        print("Mic seat 2 locked")
    }
    override fun onFailure(code: Int, desc: String) {
        print("Failed to lock: $desc")
    }
})

// Unlock mic seat 2
seatStore.unlockSeat(2, object : CompletionHandler {
    override fun onSuccess() {
        print("Mic seat 2 unlocked")
    }
    override fun onFailure(code: Int, desc: String) {
        print("Failed to unlock: $desc")
    }
})
```

#### lockSeat Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`seatIndex`|`Int`|Index of the mic seat to lock.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

#### unlockSeat Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`seatIndex`|`Int`|Index of the mic seat to unlock.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

### Move Mic Seats

Hosts and mic seat users can call `moveUserToSeat` to move users between mic seats.

#### Implementation
1. **Host Moves User to Mic Seat:** The host can use this API to move any user to a specified mic seat. Provide the target user's `userID`, the target seat index as `targetIndex`, and use the `policy` parameter to specify the seat movement strategy if the target seat is occupied (see parameter details below).

2. **On-Mic User Moves Themselves:** On-mic users can also call this API to move themselves. In this case, `userID` must be the user's own ID, `targetIndex` is the desired new seat index, and the `policy` parameter is ignored. If the target seat is occupied, the move fails with an error.

#### Example Code
``` java
import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.live.MoveSeatPolicy

seatStore.moveUserToSeat("userC",
    newSeatIndex,
    MoveSeatPolicy.ABORT_WHEN_OCCUPIED,
    object : CompletionHandler {
        override fun onSuccess() {
            print("Successfully moved to mic seat $newSeatIndex")
        }
        override fun onFailure(code: Int, desc: String) {
            print("Failed to switch seat, seat may be occupied: $desc")
        }
})
```

#### moveUserToSeat Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|The user ID of the user to move.|
|`targetIndex`|`Int`|Target mic seat index.|
|`policy`|`MoveSeatPolicy?`|Seat movement policy if the target seat is occupied:<br>- `abortWhenOccupied`: Abort move if seat is occupied (default)<br>- `forceReplace`: Force replace the user on the target seat; replaced user will be removed<br>- `swapPosition`: Swap positions with the user on the target seat.|
|`completion`|`CompletionHandler?`|Callback after request completes.|

## API Documentation

For detailed information about all public interfaces, properties, and methods of [CoGuestStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/cogueststore), [LiveSeatStore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore/liveseatstore), and related classes, refer to the official [AtomicXCore](https://tencent-rtc.github.io/TUIKit_iOS/documentation/atomicxcore) framework API documentation. The relevant stores used in this guide are as follows:

|**Store/Component**|**Feature Description**|**API Documentation**|
|---------|---------|---------|
|CoGuestStore|Audience co-hosting management: co-hosting requests/invitations, approval/rejection, co-host member permission control (microphone/camera), state synchronization.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-co-guest-store/index.html)|
|LiveSeatStore|Mic seat management: mute/unmute, lock/unlock mic seat, remove user from mic, remote microphone control, mic seat list state monitoring.|[API Documentation](https://tencent-rtc.github.io/TUIKit_Android/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.live/-live-seat-store/index.html)|

## FAQs

### What are the differences between voice room co-hosting and video live co-hosting?

The main differences are in business logic and UI design:
- `Video Live Streaming`**:** The video feed is central. Use `LiveCoreView` to render host and co-host video streams. The UI focuses on video layout, sizing, and overlays (such as nickname or placeholder images) via `VideoViewAdapter`. Both camera and microphone can be enabled.

- `Voice Room (Audio Chat Room)`**:** The mic seat grid is central. Do not use `LiveCoreView`; instead, build a grid UI (e.g., `RecyclerView`) based on `LiveSeatStore.state` (especially `seatList`). The UI displays each mic seat’s `SeatInfo`—occupied, muted, locked, or speaking—in real time. Only the microphone needs to be enabled.

### How do I update mic seat information (such as occupancy and mute status) in the UI in real time?

Subscribe to the `seatList` property in `LiveSeatState`, which is a reactive `List<SeatInfo>`. When the array changes, update your mic seat UI. For each seat:
- Use `seatInfo.userInfo` for user details.

- Use `seatInfo.isLocked` to check if the seat is locked.

- Use `seatInfo.userInfo.microphoneStatus` for the user’s microphone status.

### What is the difference between microphone interfaces in LiveSeatStore and DeviceStore?

`DeviceStore` manages the physical microphone device, while `LiveSeatStore` manages mic seat business logic (audio stream).

`DeviceStore:`
- `openLocalMicrophone`: Requests system permission and starts the microphone device for audio capture. This is a resource-intensive operation.

- `closeLocalMicrophone`: Stops audio capture and releases the microphone device.

   `LiveSeatStore:`

- `muteMicrophone`: Mutes the audio stream sent to remote users; the microphone device remains active.

- `unmuteMicrophone`: Unmutes the audio stream.

   **Recommended workflow:** "Open the device once, control mute/unmute while on mic"

1. **When joining mic:** When an audience member successfully joins the mic, call `openLocalMicrophone` once to start the device.

2. **While on mic:** All "mute" and "unmute" actions while on mic should use `muteMicrophone` and `unmuteMicrophone` to control the audio stream.

3. **When leaving mic:** When leaving mic (e.g., calling `disconnect`), call `closeLocalMicrophone` to release the device.

**AtomicXCore** provides [CoGuestStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/CoGuestStore-class.html) and [LiveSeatStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_live_seat_store/LiveSeatStore-class.html) modules, used to manage the complete business process of audience mic connection. You don’t need to worry about complex state synchronization or signaling interactions—simply call a few straightforward methods to add robust audio/video interaction between hosts and viewers in your live broadcast. This guide walks you through how to quickly implement voice mic-link functionality in your iOS app using `CoGuestStore` and `LiveSeatStore`.

## Core Scenarios

`CoGuestStore` and `LiveSeatStore` support the following mainstream scenarios:
- **Audience request to speak**: The audience proactively initiates a mic connection request, and the anchor can grant or reject it upon receiving the request.

- **Anchor invitation to speak**: The anchor can proactively initiate a mic connection invitation to any audience in the live streaming room.

- **Anchor seat management**: The anchor can perform operations such as forced microphone removal, muting, and locking on the user on the seat.

## Implementation Steps

### Step 1: Integrate the Components

> **Note:**
> Before enabling co-hosting features, you must obtain the `liveId` (the unique identifier for the live room) to distinguish between different live rooms. You can get it as follows:
>
> - **Host**: Specify when creating a live stream via `LiveListStore.shared.createLive(liveInfo)`.
> - **Client**: Get it from `liveInfo` in `LiveListState.liveList.value`, or obtain it by the Anchor sharing the live streaming room ID.

### Step 2: Implement Audience Co-host Application

#### Audience Implementation

As an audience member, your main tasks are **initiating a request, handling the response**, and **leaving the mic proactively**.
1. Submit a co-host application

   When the user taps the "Request Mic-Link" button in the UI, call the `applyForSeat` method.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';

   final String liveId = "room ID";
   late CoGuestStore guestStore;

   @override
   void initState() {
     super.initState();
     guestStore = CoGuestStore.create(liveId);
   }

   // User click "Apply for Mic Connection"
   Future<void> requestToConnect() async {
     // seatIndex: The seat index, starting from 0, represents the applied microphone position. 0 means the first seat. View seat status via LiveSeatState.seatList.value and select an idle seat.
     // timeout: Request timeout (seconds). The audience can call cancelApplication to cancel the request to speak within the timeout period.
     // The request will expire if it hasn't been processed after reaching the timeout period
     final result = await guestStore.applyForSeat(
       seatIndex: 0,
       timeout: 30,
       extraInfo: null,
     );
     if (result.isSuccess) {
       debugPrint('Mic connection request sent, waiting for anchor processing...');
     } else {
       debugPrint('Failed to send request: ${result.message}');
     }
   }
   ```
2. **Listen for Host Response**

   By adding `GuestListener`, you can receive the host's response

   ``` java
   late GuestListener _guestListener;

   // Subscribe to events when your Widget initializes
   void subscribeGuestEvents() {
     _guestListener = GuestListener(
       onGuestApplicationResponded: (isAccept, hostUser) {
         if (isAccept) {
           debugPrint('Anchor ${hostUser.userName} granted your request, preparing to join the mic');
           // 1. Turn on microphone
           // DeviceStore is the device management module provided by AtomicXCore, used for managing microphones, cameras and other physical devices.
           // When the host agrees to connect mic, turn on microphone to start collecting audio.
           DeviceStore.shared.openLocalMicrophone();
           // 2. Update UI herein, such as disabling the apply button and displaying the mic connection state
         } else {
           debugPrint('Anchor ${hostUser.userName} refused your request');
           // Pop-up prompts user that the application was rejected
         }
       },
     );
     guestStore.addGuestListener(_guestListener);
   }

   @override
   void dispose() {
     guestStore.removeGuestListener(_guestListener);
     super.dispose();
   }
   ```
3. **Leave Seat**

   When an audience member on mic wants to end the interaction, call `disConnect` to return to regular audience status.

   ``` java
   // User click "Disconnect" button
   Future<void> leaveSeat() async {
     final result = await guestStore.disconnect();
     if (result.isSuccess) {
       debugPrint('Disconnected successfully');
     } else {
       debugPrint('Failed to leave the seat: ${result.message}');
     }
   }
   ```
4. **(Optional) Cancel Request**

   If the audience member wants to withdraw the request before the host responds, call `cancelApplication`.

   ``` java
   // While waiting, the user clicks "Cancel Application"
   Future<void> cancelApplication() async {
     final result = await guestStore.cancelApplication();
     if (result.isSuccess) {
       debugPrint('Request canceled');
     } else {
       debugPrint('Failed to cancel request: ${result.message}');
     }
   }
   ```

#### Host Implementation

As the host, your main tasks are **receiving requests, displaying the request list**, and **handling requests**.
1. **Listen for New Co-host Applications**

   By adding `HostListener`, you can receive immediate notification when a new audience applies and prompt.

   ``` java
   import 'package:atomic_x_core/atomicxcore.dart';

   final String liveId = "room ID";
   late CoGuestStore guestStore;
   late HostListener _hostListener;

   @override
   void initState() {
     super.initState();
     guestStore = CoGuestStore.create(liveId);

     // Subscribe to anchor event
     _hostListener = HostListener(
       onGuestApplicationReceived: (guestUser) {
         debugPrint('Received mic connection request from audience ${guestUser.userName}');
         // Update the UI here, for example display a red dot on the "application list" button
       },
     );
     guestStore.addHostListener(_hostListener);
   }

   @override
   void dispose() {
     guestStore.removeHostListener(_hostListener);
     super.dispose();
   }
   ```
2. **Display Request List**

   `CoGuestStore`'s `coGuestState` maintains the current applicant list in real time. You can subscribe to it to update your UI.

   ``` java
   late final VoidCallback _applicantsListener = _onApplicantsChanged;

   // Subscribe to status change
   void subscribeApplicants() {
     guestStore.coGuestState.applicants.addListener(_applicantsListener);
   }

   void _onApplicantsChanged() {
     final applicants = guestStore.coGuestState.applicants.value;
     debugPrint('Current number of applicants: ${applicants.length}');
     // Update your "applicant list" UI here
   }

   @override
   void dispose() {
     guestStore.coGuestState.applicants.removeListener(_applicantsListener);
     super.dispose();
   }
   ```
3. **Handle Co-host Requests**

   When you select an audience member from the list and tap "Accept" or "Reject", call the corresponding method.

   ``` java
   // Anchor clicks the "Grant" button and imports the applicant's userID
   Future<void> accept(String userId) async {
     final result = await guestStore.acceptApplication(userId);
     if (result.isSuccess) {
       debugPrint('Approved $userId\'s request, the other party is joining the mic');
     }
   }

   // Anchor clicks the "Reject" button
   Future<void> reject(String userId) async {
     final result = await guestStore.rejectApplication(userId);
     if (result.isSuccess) {
       debugPrint('$userId\'s application denied');
     }
   }
   ```

### Step 3: Host Invites Audience to Co-host

#### Host Implementation
1. I**nvite audience to co-host**

   When the host selects a viewer from the audience list and taps "Invite to Mic", call the `inviteToSeat` method.

   ``` java
   // Anchor selects audience and initiates invitation
   Future<void> invite(String userId) async {
     // inviteeID: The ID of the invitee, seatIndex: The seat index, timeout: The invitation timeout duration
     final result = await guestStore.inviteToSeat(
       inviteeID: userId,
       seatIndex: 0,
       timeout: 30,
       extraInfo: null,
     );
     if (result.isSuccess) {
       debugPrint('Sent invitation to $userId, waiting for peer response...');
     }
   }
   ```
2. **Listen for Audience Response**

   Listen to the `onHostInvitationResponded` event via `HostListener`.

   ``` java
   // Add to the HostListener configuration
   _hostListener = HostListener(
     onHostInvitationResponded: (isAccept, guestUser) {
       if (isAccept) {
         debugPrint('Audience ${guestUser.userName} accepted your invitation');
       } else {
         debugPrint('Audience ${guestUser.userName} refused your invitation');
       }
     },
   );
   ```

#### Audience Implementation
1. **Receive Host Invitation**

   Listen to the `onHostInvitationReceived` event via `GuestListener`.

   ``` java
   // Add to the GuestListener configuration
   _guestListener = GuestListener(
     onHostInvitationReceived: (hostUser) {
       debugPrint('Received mic connection invitation from Anchor ${hostUser.userName}');
       // Pop up a dialog box for user selection between "Accept" or "Reject"
       // showInvitationDialog(hostUser);
     },
   );
   ```
2. **Respond to invitation**

   After the user makes a selection in the pop-up dialog box, call the method accordingly.

   ``` java
   final String inviterId = "anchor ID who initiates invitation"; // obtain from onHostInvitationReceived event

   // User clicks "Accept"
   Future<void> accept() async {
     final result = await guestStore.acceptInvitation(inviterId);
     if (result.isSuccess) {
       // Turn the mic on
       // DeviceStore is the device management module provided by AtomicXCore, used for managing microphones, cameras and other physical devices.
       // After accepting the invitation, turn on microphone to start collecting audio
       DeviceStore.shared.openLocalMicrophone();
     }
   }

   // User click "Reject"
   Future<void> reject() async {
     await guestStore.rejectInvitation(inviterId);
   }
   ```

## Advanced Features

Once a user is on mic, the host may need to manage mic seats. The following features are primarily provided by `LiveSeatStore`, which functions with `CoGuestStore`.

### Microphone Control: DeviceStore vs LiveSeatStore

When working with seat features, it’s important to understand the difference between `DeviceStore` and `LiveSeatStore` for microphone control:
- **DeviceStore**: Manage physical devices. `openLocalMicrophone` starts up the microphone device to perform audio capture. `closeLocalMicrophone` stops audio capture and releases the microphone device.

- **LiveSeatStore**: Manages seat business (i.e., audio stream). `muteMicrophone` mutes and stops sending local audio stream to the remote end, but the microphone device itself keeps running. `unmuteMicrophone` unmutes and restores sending audio stream to the remote end.

   **Recommended workflow**: You should follow the principle of "open the device only once and use the mute switch for Anchor."

1. **When going on stage**: Once the audience succeeds in going on stage, call `openLocalMicrophone` only once to start the device.

2. **When on stage**: For all "unmute" and "mute" operations on the seat, users should call `unmuteMicrophone` and `muteMicrophone` to control the upstream audio stream.

3. **When going off stage**: When a user goes off stage (such as calling `disconnect`), call `closeLocalMicrophone` to release the device.

### Microphone Mute/Unmute for Users on Seat

Users on seat (including the anchor) can mute or unmute their own microphone using methods provided by `LiveSeatStore`.

#### Implementation:
1. **Mute**: Call the `muteMicrophone()` method. This is a one-way request with no callback.

2. **Unmute**: Call the `unmuteMicrophone()` method.

#### Example:
``` java
final seatStore = LiveSeatStore.create(liveId);

seatStore.muteMicrophone(); // Mute

await seatStore.unmuteMicrophone(); // Unmute
```

### Host Remotely Controls User’s Microphone

The anchor can forcibly mute users on seat or invite them to unmute.

#### Implementation:
1. **Force Mute (Lock)**: The host calls `closeRemoteMicrophone` to forcibly mute the target user's microphone and lock their mic control. The muted user will receive the `onLocalMicrophoneClosedByAdmin` event via `liveSeatEventPublisher`, and their local "Open Microphone" button should become disabled.

2. **Invite to Unmute (Unlock)**: The host calls `openRemoteMicrophone`—this does not forcibly open the user's mic, but unlocks their mic control, allowing them to unmute themselves. The target user receives the `onLocalMicrophoneOpenedByAdmin` event, their "Open Microphone" button should become enabled, but they remain muted until they unmute themselves.

3. **User Unmutes Themselves**: After receiving the unlock notification, the user must actively call `LiveSeatStore`'s `unmuteMicrophone()` to actually unmute and be heard in the room.

#### Example:

##### Host Side:
``` java
final seatStore = LiveSeatStore.create(liveId);
final String targetUserId = "userD";

// 1. Force mute userD and lock
final result1 = await seatStore.closeRemoteMicrophone(targetUserId);
if (result1.isSuccess) {
  debugPrint('Muted and locked $targetUserId');
}

// 2. Unlock userD's microphone permission (at this point userD remains muted)
final result2 = await seatStore.openRemoteMicrophone(
  userID: targetUserId,
  policy: DeviceControlPolicy.unlockOnly,
);
if (result2.isSuccess) {
  debugPrint('Unlocked $targetUserId\'s microphone, user can unmute manually');
}
```

##### Audience Side:
``` java
late LiveSeatListener _seatListener;

// userD listens to the Anchor's operation
void subscribeSeatEvents() {
  _seatListener = LiveSeatListener(
    onLocalMicrophoneClosedByAdmin: () {
      debugPrint('Muted by anchor');
      // muteButton.isEnabled = false;
    },
    onLocalMicrophoneOpenedByAdmin: (policy) {
      debugPrint('Anchor unmuted and unlocked');
      // muteButton.isEnabled = true;
      // muteButton.text = "Turn on microphone";
    },
  );
  seatStore.addLiveSeatEventListener(_seatListener);
}

@override
void dispose() {
  seatStore.removeLiveSeatEventListener(_seatListener);
  super.dispose();
}
```

#### CloseRemoteMicrophone API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|Operating user `userID`.|

#### OpenRemoteMicrophone API Parameters

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|Operating user `userID`.|
|`policy`|`DeviceControlPolicy`|Turn on microphone policy.|

### Host Removes On-Mic User from the Seat

#### Implementation:
1. **Remove User from Mic**: The anchor can call the `kickUserOutOfSeat` method to force the specified user off the mic.

2. **Listen for Event Notification**: Users kicked off the mic will receive the `GuestListener` `onKickedOffSeat` event notification.

#### Example:
``` java
// Assume "userB" is to be kicked out
final String targetUserId = "userB";
final result = await seatStore.kickUserOutOfSeat(targetUserId);
if (result.isSuccess) {
  debugPrint('Kicked $targetUserId off the mic');
} else {
  debugPrint('Kick user failed: ${result.message}');
}

// "userB" received the kicked off the mic event
_guestListener = GuestListener(
  onKickedOffSeat: (seatIndex, hostUser) {
    // Show a toast notification
    debugPrint('You have been kicked off the mic by anchor');
  },
);
```

#### KickUserOutOfSeat API Parameter

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`userID`|`String`|The user kicked off the mic `userID`.|

### Host Locks and Unlocks Mic Seats

The host can lock or unlock a specific mic seat.

#### Implementation:
1. **Lock Seat**: The anchor can call the `lockSeat` method to lock the seat with a specified index. Once locked, audiences cannot use `applyForSeat` or `takeSeat` to occupy the seat, but the anchor can invite an audience to the locked seat via `inviteToSeat`.

2. **Unlock Seat**: Call `unlockSeat` to unlock the seat. The seat can be occupied again after unlocking.

#### Example:
``` java
// Lock seat 2
final result1 = await seatStore.lockSeat(2);
if (result1.isSuccess) {
  debugPrint('Seat 2 locked');
}

// Unlock seat 2
final result2 = await seatStore.unlockSeat(2);
if (result2.isSuccess) {
  debugPrint('Seat 2 unlocked');
}
```

#### LockSeat API Parameter

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`seatIndex`|`int`|Index of the mic to lock.|

#### UnlockSeat API Parameter

|**Parameter**|**Type**|**Description**|
|---------|---------|---------|
|`seatIndex`|`int`|Index of the mic to unlock.|

### Move User to Another Seat

Host and co-host can call `moveUserToSeat` to change seat positions.

#### Implementation:
1. **Host Moves User to Mic Seat**: The host can call this API to move any user to a specified seat. At this point, `userID` is the ID of the target user, `targetIndex` is the index of the target seat, and the `policy` parameter specifies the move strategy if the target seat is occupied. .

2. **On-Mic User Moves Themselves**: On-mic users can also call this API to move themselves. In this case, `userID` must be the user's own ID, `targetIndex` is the desired new seat index, and the `policy` parameter is ignored. If the target seat is occupied, the move fails with an error.

#### Example code:
``` java
final result = await seatStore.moveUserToSeat(
  userID: "userC",
  targetIndex: newSeatIndex,
  policy: MoveSeatPolicy.abortWhenOccupied,
);
if (result.isSuccess) {
  debugPrint('Successfully moved to seat $newSeatIndex');
} else {
  debugPrint('Seat change failed, possibly seat is occupied');
}
```

#### MoveUserToSeat API Parameters
| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| <code>userID</code> | <code>String</code> | The user who needs to move the mic <code>userID</code>. |
| <code>targetIndex</code> | <code>int</code> | Index of the target seat. |
| <code>policy</code> | <code>MoveSeatPolicy</code> | Processing policy when the target seat is occupied<br>- <code>abortWhenOccupied</code>: Abort movement when the target seat is occupied (default policy)<br>- <code>forceReplace</code>: Forcibly replace the user on the target seat. The replaced user will be kicked off the mic.<br>- <code>swapPosition</code>: Exchange with the user on the target seat. |

## API documentation

For detailed information about ALL public interfaces, attributes, and methods of [CoGuestStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/CoGuestStore-class.html), [LiveSeatStore](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_live_seat_store/LiveSeatStore-class.html), and its related classes, see the official API documentation of the [AtomicXCore](https://tencent-rtc.github.io/TUIKit_Flutter) framework. The related Store used in this guide is as follows:

|**Store/Component**|**Feature Description**|**API Reference**|
|---------|---------|---------|
|**CoGuestStore**|Audience co-broadcasting management: join microphone application/invite/consent/deny, member permission control (microphone/camera), state synchronization.|[API documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_co_guest_store/CoGuestStore-class.html)|
|**LiveSeatStore**|Seat management: mute/unmute, lock/unlock seats, remove speaker, remotely control Anchor microphone, listen to list status.|[API documentation](https://tencent-rtc.github.io/TUIKit_Flutter/api_live_live_seat_store/LiveSeatStore-class.html)|

## FAQs

### What are the differences between voice room co-hosting and video live co-hosting?

The main difference between both lies in business form and UI display:
- **Video live streaming:** The focus is on video display. Use `LiveCoreWidget` as the main component to render the anchor and guest video streams. The UI emphasizes video layout and sizing, and you can use `VideoViewDelegate` to add overlays (such as nicknames or placeholders). Both camera and microphone can be enabled.

- **Voice room (chat room):** The focus is on the seat grid. You do not use `LiveCoreWidget`, but instead build a grid UI (such as `GridView`) based on the `liveSeatState` of `LiveSeatStore` (especially seatList). The UI displays each seat’s `SeatInfo` status in real time: whether it’s occupied, muted, locked, or currently speaking. Only the microphone needs to be enabled.

### How do I update seat info in the UI in real time?

You should subscribe to the `seatList` property in `LiveSeatState`, which is a responsive data of `ValueListenable<List<SeatInfo>>` data type. It will notify you to re-render the microphone position list whenever the array changes. By traversing this array, you can:
- Get user information on the seat through `seatInfo.userInfo`.

- Check whether the seat is locked through `seatInfo.isLocked`.

- Check the mic status of the on-mic user through `seatInfo.userInfo.microphoneStatus`.

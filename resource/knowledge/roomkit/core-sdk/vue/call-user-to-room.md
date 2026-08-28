The in-room calling feature allows a user inside a meeting (the inviter) to send a real-time join invitation to other users outside the room (the invitees). This feature is implemented based on `Atomicx State Hooks` and helps developers quickly build interactive scenarios with active invitation capabilities.

## Use Cases
- **Collaborative work:** During a remote meeting, if a cross-department decision is involved, you can call in external experts with one click to quickly join the meeting, shortening the communication chain.

- **Live teaching:** If a teacher notices during a class that some students are absent, they can directly invite them to join the class.

- **Internet-based medical consultation:** During case analysis, a primary physician can use the calling feature to invite a senior physician into the virtual consultation room for a multi-party consultation, or a physician can call a patient in the waiting room for a consultation.

## Prerequisites

Before integrating the feature, make sure the following conditions are met:
- **Inviter (User A):** The user has completed login authentication via `useLoginState` (see the Integration Overview) and is already in a room as the room owner or a member (see the Room Lifecycle).

- **Invitee (User B):** The user has completed login authentication via `useLoginState` (see the Integration Overview) so that they can receive signaling events.

- **Environment dependency:** The project has correctly installed and imported `tuikit-atomicx-vue3`.

## Implementing the In-Room Calling Feature

The core flow for implementing in-room calling is as follows:

In-room calling sequence diagram

### Step 1: Initiate the Call (Inviter)

The inviter calls the [callUserToRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#callUserToRoom) interface to initiate the invitation. Make sure the inviter is currently in a room (that is, [currentRoom](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#currentRoom) is not empty); otherwise, the call cannot be initiated.
``` typescript
import { useRoomState } from 'tuikit-atomicx-vue3/room';

const { currentRoom, callUserToRoom } = useRoomState();

const inviteUser = async () => {
  // In-room calling must be associated with an existing roomId, so the user's in-room status must be verified first
  if (!currentRoom.value) {
    console.warn('Please enter a room before initiating an invitation');
    return;
  }

  try {
    const resultMap = await callUserToRoom({
      roomId: currentRoom.value.roomId, // The room ID that the invitee will join
      userIdList: ['user1', 'user2'],    // Array of target user IDs, supports single or multiple users
      timeout: 60,                        // Invitation valid duration (seconds); after timeout, both parties trigger onCallTimeout
      // extensionInfo can be used to pass custom business data, such as invitation type, additional messages, etc.
      extensionInfo: JSON.stringify({ type: 'emergency', priority: 'high' })
    });

    // resultMap returns the status corresponding to each userId, such as Success, AlreadyInRoom, or AlreadyInCalling
    console.log('Invitation sent, detailed status map:', resultMap);
  } catch (error) {
    console.error('Failed to send the call request; please check the network or login status:', error);
  }
};
```

### Step 2: Listen for Call Events (Invitee)

The invitee needs to listen for the `onCallReceived` event. It is recommended to implement this in a persistent component such as `App.vue` to ensure the user can respond no matter which page they are on.
``` typescript
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoomState, RoomEvent } from 'tuikit-atomicx-vue3/room';

const {
  subscribeEvent,
  unsubscribeEvent,
  acceptCall,
  rejectCall,
  joinRoom,
  currentRoom
} = useRoomState();

const showInviteDialog = ref(false); // Controls the visibility of the UI dialog
const currentCallInfo = ref(null);   // Caches the received invitation context

const handleCallReceived = async ({ roomInfo, call, extensionInfo }) => {
  // Conflict handling: if the user is already in a meeting, based on the business strategy you should usually reject the new invitation directly to avoid interference
  if (currentRoom.value?.roomId) {
    await rejectCall({ roomId: roomInfo.roomId });
    return;
  }

  // Record the invitation details, used to display the inviter's name or business pass-through data in the UI
  currentCallInfo.value = { roomInfo, call };
  showInviteDialog.value = true;
};

// Logic for accepting the invitation
const onUserAccept = async () => {
  if (!currentCallInfo.value) return;
  const { roomId } = currentCallInfo.value.roomInfo;

  try {
    // Key step A: Respond to the signaling. Notify the inviter that the call has been accepted so they can update the UI (for example, show "The other party has answered")
    await acceptCall({ roomId });

    // Key step B: Join the room. Only by calling joinRoom will the audio/video publish-subscribe pipeline actually be started
    await joinRoom({ roomId });
  } catch (error) {
    console.error('Failed to join the room after accepting the call:', error);
  } finally {
    closeDialog();
  }
};

// Logic for rejecting the invitation
const onUserReject = async () => {
  if (currentCallInfo.value) {
    // Notify the inviter of the rejection; the inviter will receive the onCallRejected event
    await rejectCall({ roomId: currentCallInfo.value.roomInfo.roomId });
  }
  closeDialog();
};

const closeDialog = () => {
  showInviteDialog.value = false;
  currentCallInfo.value = null;
};

// Full lifecycle event management: ensure listeners are added when the component is mounted and removed when it is destroyed, to prevent event overflow
onMounted(() => {
  subscribeEvent(RoomEvent.onCallReceived, handleCallReceived);

  // Listen for the various exception/synchronization events that end the invitation, to ensure the UI dialog can close in time
  subscribeEvent(RoomEvent.onCallCancelled, closeDialog); // The inviter cancelled the call
  subscribeEvent(RoomEvent.onCallTimeout, closeDialog);   // The call timed out without a response
  subscribeEvent(RoomEvent.onCallHandledByOtherDevice, closeDialog); // The user handled the call on another device
});

onUnmounted(() => {
  // Remove all listeners to avoid handleCallReceived continuing to run after the component is destroyed, which would cause memory leaks or errors
  unsubscribeEvent(RoomEvent.onCallReceived, handleCallReceived);
  unsubscribeEvent(RoomEvent.onCallCancelled, closeDialog);
  unsubscribeEvent(RoomEvent.onCallTimeout, closeDialog);
  unsubscribeEvent(RoomEvent.onCallHandledByOtherDevice, closeDialog);
});
```

## Practical Tutorial: Improving the Call Answer Rate

To achieve a higher call answer rate in your business, beyond implementing the basic functionality, it is recommended to

### 1. Enhance Call Awareness (Avoid Users Missing Calls)

Due to the characteristics of the Web platform, a muted browser or a page running in the background may cause the user to miss a call.
- **Visual reminder**: Use the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) to detect the page visibility state. If the page is in the background, you can implement a blinking title bar reminder by cyclically modifying `document.title` (for example: "[New Invitation] UserA is inviting you to join the meeting...") to attract the user's attention.

- **Auditory reminder**: Play a high-priority prompt ringtone when the `onCallReceived` event is triggered. Note: You must follow the browser's [autoplay policy](https://developer.mozilla.org/zh-CN/docs/Web/Media/Guides/Autoplay). Most browsers restrict automatic audio playback in the absence of user interaction (such as a click, touch, or key press).

### 2. Enrich the Invitation Context (Increase Willingness to Answer)

Invitations that lack a clear intent are easily rejected by users. It is recommended to make full use of the `extensionInfo` field to pass key business information to increase the user's willingness to answer.
- **Pass business context**: Use `extensionInfo` to pass through business fields such as `reason` (for example: "Urgent project review") and `level` (for example: "P0 incident troubleshooting") to inform the user of the urgency and importance of the call.

### 3. Multi-Channel Reach as a Fallback (Ensure Message Delivery)

Limited by the Web platform mechanism, the browser process being terminated will make it impossible to receive real-time signaling. It is recommended to adopt the following alternatives to ensure delivery:
- **Browser system notifications**: Guide the user to authorize the [Web Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification). As long as the browser process is not closed (including when minimized or in a background tab), an operating-system-level pop-up notification can be triggered to effectively remind the user.

- **Multi-channel reach**: It is recommended to combine this with your business backend logic. When the user is detected to be offline or does not respond within the timeout, send a join link through external channels such as **SMS**, **email**, or **WeCom** to achieve comprehensive reach.

### 4. Intelligent Retry Mechanism (Solving "Join Failure After Accepting the Invitation")

In a weak network or other unstable environment, the `joinRoom` call after the user clicks accept may occasionally fail.
- **Automatic retry**: It is recommended to introduce a mechanism of 2-3 automatic retries in the exception handling logic (`catch`) of `onUserAccept` (an exponential backoff strategy is recommended) to maximize the likelihood that the user successfully joins the meeting after clicking "Accept".

## Development Notes
1. **Accepting an invitation does not equal joining the room**

   `acceptCall` is only a reply at the signaling level (notifying the other party that the call has been answered). The user must call `await joinRoom({ roomId })` manually immediately after calling `acceptCall` to actually enter the audio/video room.

2. **Lifecycle management**

   Be sure to call `unsubscribeEvent` during the component destruction phase (`onUnmounted`). If the listeners are not cleaned up, when the user switches pages, the listeners from the old page will remain in memory, causing multiple windows to pop up for a single invitation or logic to be executed repeatedly.

3. **Timeout setting**

   If the `timeout` parameter is not set, in certain network exceptions or program crash scenarios, the invitation may remain in a pending state for a long time, making it impossible to call the user again. It is recommended to set it to 30-60 seconds.

## FAQ
1. **How can I include custom parameters when calling (such as "Urgent meeting from XX")?**

   Use the `extensionInfo` parameter of `callUserToRoom` to pass a JSON string. The invitee can parse this string from the `extensionInfo` field of the `onCallReceived` event to obtain the business information.

2. **If the invitee is offline, will they receive the invitation after coming online?**

   No. The invitation event is a transient signaling action, and the SDK currently does not resend call notifications received while offline.

3. **Can I cancel an invitation that has already been sent?**

   Yes. Call `cancelCall({ roomId, userIdList })` to revoke it. At this point, the invitee will receive the `onCallCancelled` event, and you need to listen for this event to close the invitee's UI dialog.

4. **What should I do if joining the room fails after accepting?**

   Check whether `TUIRoomEngine` is logged in, retry `joinRoom({ roomId })`, and catch errors to prompt the user; if necessary, provide a "Retry" button in the UI.

5. **How to indicate that the other party is busy or already in another room?**

   If `AlreadyInRoom` / `AlreadyInCalling` appears in the `resultMap` return value of `callUserToRoom`, you should prompt "The other party is busy / already in a meeting" in the inviter's UI and decide whether to retry later.

6. **The dialog does not close after a timeout/cancellation?**

   Make sure to listen for `onCallTimeout`, `onCallCancelled`, and `onCallHandledByOtherDevice`, and uniformly close the dialog and clean up the current invitation data in the callbacks.

7. **How to handle multiple devices ringing simultaneously?**

   After accepting/rejecting on any device, the other devices will receive `onCallHandledByOtherDevice`, and you need to close the dialogs on the other devices to avoid duplicate handling.

8. **How should extensionInfo be defined?**

   It is recommended to use a JSON string with agreed-upon fields (for example, `type`, `priority`, `from`), parse it in `handleCallReceived`, and display a friendly message (for example, "Urgent meeting from XX").

## **Example Project**

Tencent Cloud provides the example project [atomicx-vite-vue3-ts](https://github.com/Tencent-RTC/TUIRoomKit/tree/main/Web/example/atomicx-vite-vue3-ts) on GitHub, which you can refer to in order to implement the complete RoomKit functionality.

## API Documentation

|**State/Component**|**Description**|**API Documentation**|
|---------|---------|---------|
|**useRoomState**|Room state management (creation, joining, scheduling, etc.)|[API Documentation](https://web.sdk.qcloud.com/trtc/live/web/doc/en/index.html#module-RoomState)|

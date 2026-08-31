---
title: Android 1v1 Video Chat Dating — Quick Start (VideoChat Demo Setup & Component Integration)
product: call
frameworks: [android]
scope: platform_specific
tags: [video chat, 1v1, VideoChat, dating, video-chat-solution, TUICallKit, Android, Demo, quick start, social, beauty filter, offline push, call reachability]
---

This guide walks you through running the video calling Demo quickly. Following this document, you can get the Demo running in 10 minutes and experience a fully-featured 1v1 video chat dating app with a complete UI.

## Prerequisites

### Environment Setup
- Install [Android Studio](https://developer.android.com/studio).

- Two or more Android 5.0+ devices.

### Activate the Service

## Run the Demo

### Step 1: Download the Demo

You can download the [VideoChat Demo](https://github.com/Tencent-RTC/video-chat-solution) source code directly from GitHub, or run the following command:
``` java
 git clone https://github.com/Tencent-RTC/video-chat-solution.git
```

### Step 2: Configure the Demo
1. **Configure SDKAppID and SecretKey (required):** Open the file `video-chat-solution/blob/main/android/app/src/main/java/io/trtc/uikit/demo/debug/GenerateTestUserSig.java` and fill in the `SDKAppID` and `SDKSecretKey` obtained during service activation.

2. **Configure Beauty Filters (optional):** The Demo includes Tencent basic beauty filters by default, which require a License to take effect. Refer to the [License Guide](https://cloud.tencent.com/document/product/616/79137) to obtain the LicenseURL and LicenseKey, and fill them into `video-chat-solution/android/app/src/main/java/io/trtc/uikit/demo/debug/GenerateTestUserSig.java`.

### Step 3: Run the Demo
1. **Import recommended test users:** For a quick trial, run the script `video-chat-solution/tools/import_users_to_video_chat.py` (fill in your AppID and SecretKey). The script will automatically register 6 recommended test accounts. After logging in, you can see them in the "Dating" module.

2. **Build and run:** Select a device and run the Demo.

3. **Demo running successfully:** After logging in, the following screen is displayed.

### Step 4: Video and Chat Interaction
1. **Interact with recommended users:** You can use another device B to log in with a "recommended user" account (e.g., UserID: VideoChatlinxiaoyu) to complete 1v1 chat and video interaction.

  - **Device A:** Log in and follow the recommended user "Chen Kexin", then start chatting and video calling.

  - **Device B:** Log in and start chatting and video calling.

## Quick Integration

For fast deployment, you can directly integrate the UI components from the Demo to implement core features like 1v1 chat and calling.

### Step 1: Integrate Components
1. Download the [VideoChat Demo](https://github.com/Tencent-RTC/video-chat-solution) source code from the GitHub repository, and copy the `video-chat` and `tuikit` components to your project directory.

2. Add the following code to `settings.gradle` to complete the integration:

   ``` java
   // Import the top-level application module
   include ':app'

   // Import the 1v1 video chat dating UI module
   include ':video-chat'

   // Import the common module
   include(":atomic_x")
   project(":atomic_x").projectDir = file("./tuikit/atomic_x")

   // Import the chat module
   include ':tuichat'
   project(':tuichat').projectDir = file("./tuikit/chat")

   // Import the beauty filter module
   include ':tebeautykit'
   project(':tebeautykit').projectDir = file("./tuikit/tebeautykit")

   // Import the effects player module
   include ':tceffectplayerkit'
   project(':tceffectplayerkit').projectDir = file("./tuikit/tceffectplayerkit")
   ```

### Step 2: Complete Login

Authentication is required before using component features. Call the LoginStore `login` API with the sdkAppID, userID, and userSig obtained above:
``` java

import io.trtc.tuikit.atomicxcore.api.CompletionHandler
import io.trtc.tuikit.atomicxcore.api.login.LoginStore

LoginStore.shared.login(
    context,
    sdkAppID, // Int, obtained from the console
    userID,   // String
    userSig,  // String, generated from the console or server
    object : CompletionHandler {
        override fun onSuccess() {
            // Login successful, navigate to conversation list or chat page
        }
        override fun onFailure(code: Int, desc: String) {
            // Login failed, show error dialog
        }
    }
)
```

> **Note:**
> In production environments, it is recommended to generate UserSig on your server. The app requests a dynamic UserSig from the backend when needed. See Server-side UserSig Generation.
>

### Step 3: Build the Recommended Users List

1. **Add the page:** Add the "Recommended Users List (MeetPage)" to your project:

   ``` java
   import com.tencent.qcloud.tuikit.videochat.page.meet.MeetPage

   class MeetPageFragment : Fragment() {
     override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
           super.onViewCreated(view, savedInstanceState)
           addMeetPage()
     }

     private fun addMeetPage() {
       val meetPage = MeetPage(requireContext())
       val container = findViewById<FrameLayout>(R.id.meet_container)
       container.addView(meetPage, MATCH_PARENT, MATCH_PARENT)
     }
   }
   ```
2. **Provide data:** You can use `setPageUsers` to provide the recommended user list, and listen for pull-up refresh (`onLoadMoreRequested`) to append users and pull-down refresh (`onRefreshRequested`) to fully update the user list.

   ``` java
   import com.tencent.qcloud.tuikit.videochat.page.meet.MeetPage

   meetPage.setListener(object : MeetPage.Listener {
       // Triggered on pull-down refresh
       override fun onRefreshRequested() {
           // Full update of user list
           fetchUsers { users, hasMore ->
               // Set user list
               meetPage.setPageUsers(users, hasMore)
           }
       }

       // Triggered on pull-up refresh
       override fun onLoadMoreRequested() {
           // Append new users at the end
           fetchNextPage { users, hasMore ->
               // Set user list
               meetPage.setPageUsers(users, hasMore)
           }
       }
   })
   ```
  - **setPageUsers details:**

      ``` java
      fun setPageUsers(users: List<V2TIMUserFullInfo>, hasMore: Boolean)
      ```
| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| users | List<[V2TIMUserFullInfo](https://im.sdk.qcloud.com/doc/zh-cn/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserFullInfo.html)> | User list. [V2TIMUserFullInfo](https://im.sdk.qcloud.com/doc/zh-cn/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMUserFullInfo.html) contains user ID, nickname, avatar, gender, and other key information. |
| hasMore | Boolean | Whether there is a next page:<br>- true: more pages available, scrolling to the bottom will trigger onLoadMoreRequested()<br>- false: no more data, scrolling to the bottom will not trigger the callback |

3. **Switch layout (optional):** MeetPage provides two layout modes — "Card" and "List". You can use `setLayoutTemplate` to choose your preferred layout.

   ``` java
   import com.tencent.qcloud.tuikit.videochat.page.meet.MeetPage

   class MeetPageFragment : Fragment() {
     override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
           super.onViewCreated(view, savedInstanceState)
           addMeetPage()
     }

     private fun addMeetPage() {
       val meetPage = MeetPage(requireContext())
       // Set layout
       meetPage.setLayoutTemplate(MeetPage.Template.LIST)  // List layout (default)
       // meetPage.setLayoutTemplate(MeetPage.Template.GRID)  // Card layout
       val container = findViewById<FrameLayout>(R.id.meet_container)
       container.addView(meetPage, MATCH_PARENT, MATCH_PARENT)
     }
   }
   ```
  - **setLayoutTemplate details:**

      ``` java
      fun setLayoutTemplate(template: MeetPage.Template)
      ```
| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| template | MeetPage.Template | Layout type:<br>- MeetPage.Template.LIST: List layout.<br>- MeetPage.Template.GRID: Card layout. |

### Step 4: Build the Conversation List

The conversation list simply requires creating a `ConversationPage` object and adding it to your layout. The conversation list reads recent chat records from the database. When a user taps a chat record, `ConversationPage` navigates to the chat page by default.

- **Sample code:**

   ``` java
   val conversationPage = ConversationPage()

   // R.id.container is the FrameLayout in your layout that holds the conversation list Fragment
   supportFragmentManager.beginTransaction()
       .add(R.id.container, conversationPage)
       .commit()
   ```

### Step 5: Build the Chat Page

The chat page displays and sends messages. You can build the page as follows:

- **Sample code:**

   ``` java
   Bundle param = new Bundle();
   param.putInt(TUIConstants.TUIChat.CHAT_TYPE, V2TIMConversation.V2TIM_C2C);
   val userId = "jack" // The other party's UserId
   param.putString(TUIConstants.TUIChat.CHAT_ID, userId);
   TUICore.startActivity("TUIC2CChatActivity", param);
   ```

### Step 6: Audio/Video Calling

In social entertainment scenarios, call requirements are complex and diverse. We recommend using the [AtomicxCore SDK](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) to flexibly customize your calling scenarios. Taking the video-chat module's call page (VideoCallPage) as an example, it is built on the SDK's CallStore module and deeply integrates core UI elements such as beauty filters, follow actions, and participant info display. You can use it as source code reference or integrate it directly into your project to quickly build a custom call interface.

- **Initiate a video call — sample code:** You can use [CallStore.calls](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/calls.html) to initiate a video call and launch the call page on success.

   ``` java
   // Initiate a video call using AtomicxCore SDK's CallStore.calls
   CallStore.shared.calls(list, mediaType, params, object : CompletionHandler {
         override fun onFailure(code: Int, desc: String) {
               completion?.onFailure(code, desc)
         }

         override fun onSuccess() {
               completion?.onSuccess()
               // Call succeeded, launch VideoCallPage
               val intent = Intent(context, VideoCallPage::class.java)
               intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
               context.startActivity(intent)
         }
   })
   ```
- **AtomicxCore SDK call module — core API reference:**

   | **Module** | **Description** |
   |---------|---------|
   | [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) | Core call view component. Automatically listens to CallStore data and renders the video. Provides layout switching, avatar, and icon customization capabilities. |
   | [CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) | Call lifecycle management: make, accept, reject, and hang up calls. Real-time access to participants' audio/video status, call duration, call records, etc. |
   | [DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html) | Audio/video device control: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, real-time device status monitoring. |

## More Features

You can integrate the following features to enhance your app's competitiveness and deliver a better user experience.
| **Feature** | **Description** | **Integration Guide** |
| --- | --- | --- |
| Call Billing | We provide precise server-side call status callbacks. You can listen to call-start and call-end server callbacks to implement call billing. | - Post-call-start callback<br>- Post-call-end callback |
| Beauty Filters | We offer two beauty filter solutions: **Basic Beauty** (built-in) and **Advanced Beauty** (requires additional integration and fee). Choose based on your needs. | Integrate Beauty Filters |
| Voice Effects | TRTC audio voice-changing features and usage scenarios to help developers create rich audio interaction experiences. | Integrate Voice Effects |
| AI Real-time Translation | An essential feature for going global, helping users break language barriers. | Integrate AI Real-time Translation |
| Audio/Video Content Moderation | Essential for 1v1 social entertainment apps. Helps moderate audio/video streams and text content to prevent app removal from stores. | - [Audio/Video Content Moderation](https://cloud.tencent.com/document/product/647/77791)<br>- [Text Content Moderation](https://cloud.tencent.com/document/product/269/103732) |

## FAQ

### Why are the Demo's beauty filters not working?

The Demo includes built-in beauty filter functionality, but it requires License authentication. Please check whether the `LicenseURL` and `LicenseKey` in `video-chat-solution/android/app/src/main/java/io/trtc/uikit/demo/debug/GenerateTestUserSig.java` are correct. Refer to the [License Guide](https://cloud.tencent.com/document/product/616/79137) for details.

### How to customize the UI?

If you have extensive UI customization requirements, we recommend:
1. **Call module:** You can use the AtomicxCore SDK (see sample code: No-UI Integration) to customize the call module's interface. Core modules:

   | **Module** | **Description** |
   |---------|---------|
   | [LoginStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-login-store/index.html) | Login management class for user login, logout, and user info management. Provides a complete set of login management APIs including login, logout, and profile configuration. |
   | [CallCoreView](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.view/-call-core-view/index.html) | Core call view component. Automatically listens to CallStore data and renders the video. Provides layout switching, avatar, and icon customization capabilities. |
   | [CallStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-store/index.html) | Call lifecycle management: make, accept, reject, and hang up calls. Real-time access to participants' audio/video status, call duration, call records, etc. |
   | [DeviceStore](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/zh/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.device/-device-store/index.html) | Audio/video device control: microphone (on/off, volume), camera (on/off, switch, quality), screen sharing, real-time device status monitoring. |

2. **Chat module:** Refer to the [IM SDK No-UI Integration](https://cloud.tencent.com/document/product/269/75283).

### How to customize call status message display in chat?

When the call status changes, IM delivers a call status change message. The signaling protocol is as follows. Depending on whether you use our provided UI code, you have two solutions:

| **Question** | **Description** |
|---------|---------|
| How to identify "call initiated" | actionType = 1 and cmd = 'videoCall' or 'audioCall' |
| How to identify "call accepted" | actionType = 3 |
| How to identify "call ended" and "call duration" | actionType = 1 and cmd = 'hangup'; duration from the call_end field (unit: seconds) |
| How to identify "call cancelled" | actionType = 2 |
| How to identify "call rejected" | actionType = 4 |
| How to identify "call rejected due to busy line" | actionType = 4 and cmd = "line_busy" |
| How callee identifies "call timed out" | actionType = 5 |

- **Option 1: Modify the provided UI source code**

   Locate the source file `tuikit/TUIChat/tuichat/src/main/java/com/tencent/qcloud/tuikit/tuichat/bean/CallModel.java` and modify the `getContentForSimplifyAppearance` function to customize call status message display.

   ``` java
    /**
    * Customize 1v1 call status message display text
    *
    * Location: CallModel.java -> getContentForSimplifyAppearance()
    * Only modify the text within the participantType == CALL_PARTICIPANT_TYPE_C2C branch.
    *
    * Available fields within the method:
    * - protocolType: call protocol type (initiate/accept/reject/cancel/hangup/timeout/busy)
    * - participantRole: current user role (CALLER / CALLEE)
    * - streamMediaType: media type (VOICE / VIDEO)
    * - duration: call duration (seconds)
    */

   // =================== Example: Customize 1v1 call display text ===================

   // In the getContentForSimplifyAppearance() method,
   // find the if (participantType == CALL_PARTICIPANT_TYPE_C2C) branch and modify:

   if (participantType == CALL_PARTICIPANT_TYPE_C2C) {
       // Determine media type for text prefix
       val mediaPrefix = if (streamMediaType == CALL_STREAM_MEDIA_TYPE_VIDEO) {
           "[Video Call]" // Your custom video call text
       } else {
           "[Voice Call]" // Your custom voice call text
       }

       val isCaller = (participantRole == CALL_PARTICIPANT_ROLE_CALLER)

       // display is the call status message shown in chat
       display = when (protocolType) {
           // Call rejected (actionType = 4, excluding line_busy)
           CALL_PROTOCOL_TYPE_REJECT -> {
               if (isCaller) {
                   "$mediaPrefix Declined by the other party"
               } else {
                   "$mediaPrefix Declined"
               }
           }

           // Call cancelled (actionType = 2, caller cancelled)
           CALL_PROTOCOL_TYPE_CANCEL -> {
               if (isCaller) {
                   "$mediaPrefix Cancelled"
               } else {
                   "$mediaPrefix Cancelled by the other party"
               }
           }

           // Call ended (actionType = 1, cmd = "hangup")
           // duration field is call duration in seconds
           CALL_PROTOCOL_TYPE_HANGUP -> {
               val formattedDuration = DateTimeUtil.formatSecondsTo00(duration)
               "$mediaPrefix Duration $formattedDuration"
           }

           // Timed out (actionType = 5)
           CALL_PROTOCOL_TYPE_TIMEOUT -> {
               if (isCaller) {
                   "$mediaPrefix No answer"
               } else {
                   "$mediaPrefix Missed"
               }
           }

           // Busy line rejection (actionType = 4, top-level JSON contains "line_busy" field)
           CALL_PROTOCOL_TYPE_LINE_BUSY -> {
               if (isCaller) {
                   "$mediaPrefix The other party is busy"
               } else {
                   "$mediaPrefix Busy, missed call"
               }
           }

           // Call initiated (actionType = 1, cmd = "videoCall" or "audioCall")
           CALL_PROTOCOL_TYPE_SEND -> {
               "$mediaPrefix Call initiated"
           }

           // Call accepted (actionType = 3)
           CALL_PROTOCOL_TYPE_ACCEPT -> {
               "$mediaPrefix Accepted"
           }

           else -> {
               context.getString(R.string.invalid_command)
           }
       }
   }
   ```
- **Option 2: Implement custom call status message display**

   You can set an [IM message listener](https://cloud.tencent.com/document/product/269/75318) to implement call status message display. Sample code:

   ``` java
   // Set message listener
   V2TIMManager.getMessageManager().addAdvancedMsgListener(advancedMsgListener)

   /**
    * Receive new message
    * @param msg message
    */
   override fun onRecvNewMessage(msg: V2TIMMessage) {
       // Get signaling info; returns null for non-signaling messages
       val signalingInfo = V2TIMManager.getSignalingManager().getSignalingInfo(msg)
           ?: return

       // Only handle 1v1 private chats (empty groupID = private chat, non-empty = group chat)
       if (!signalingInfo.groupID.isNullOrEmpty()) {
           return
       }

       // Parse the signaling data field (JSON format)
       val gson = Gson()
       val jsonData: Map<String, Any> = try {
           gson.fromJson(signalingInfo.data, object : TypeToken<Map<String, Any>>() {}.type)
       } catch (e: Exception) {
           return
       }

       // Verify businessID to confirm this is a call signaling message
       val businessId = jsonData["businessID"] as? String
       if (businessId != "av_call" && businessId != "tuikit_calling") {
           return
       }

       // Extract cmd from the data sub-object
       val dataMap = jsonData["data"] as? Map<*, *>
       val cmd = dataMap?.get("cmd") as? String

       // Determine call status based on actionType
       when (signalingInfo.actionType) {

           // ========== actionType = 1: Send invitation ==========
           V2TIMSignalingInfo.SIGNALING_ACTION_TYPE_INVITE -> {
               when (cmd) {
                   // Initiate video call
                   "videoCall" -> {
                       val mediaType = "video"
                       Log.i(TAG, "Call initiated | Type: $mediaType, Caller: ${msg.sender}")
                   }
                   // Initiate voice call
                   "audioCall" -> {
                       val mediaType = "audio"
                       Log.i(TAG, "Call initiated | Type: $mediaType, Caller: ${msg.sender}")
                   }
                   // Hang up (call ended)
                   "hangup" -> {
                       // Call duration from top-level call_end field, unit: seconds
                       val duration = jsonData["call_end"]
                           ?.toString()?.toDoubleOrNull()?.toInt() ?: 0
                       Log.i(TAG, "Call ended | Duration: ${duration}s")
                   }
               }
           }

           // ========== actionType = 2: Cancel call (caller cancelled) ==========
           V2TIMSignalingInfo.SIGNALING_ACTION_TYPE_CANCEL_INVITE -> {
               Log.i(TAG, "Call cancelled | Caller: ${msg.sender}")
           }

           // ========== actionType = 3: Accept call (callee accepted) ==========
           V2TIMSignalingInfo.SIGNALING_ACTION_TYPE_ACCEPT_INVITE -> {
               Log.i(TAG, "Call accepted")
           }

           // ========== actionType = 4: Reject call (callee rejected) ==========
           V2TIMSignalingInfo.SIGNALING_ACTION_TYPE_REJECT_INVITE -> {
               // Check if it's a busy line rejection: top-level JSON contains "line_busy" field
               if (jsonData.containsKey("line_busy")) {
                   Log.i(TAG, "Rejected due to busy line")
               } else {
                   Log.i(TAG, "Call rejected")
               }
           }

           // ========== actionType = 5: Timed out ==========
           V2TIMSignalingInfo.SIGNALING_ACTION_TYPE_INVITE_TIMEOUT -> {
               Log.i(TAG, "Call timed out")
           }
       }
   }
   ```

### Improve Call Reachability
1. **Integrate offline push to improve call reachability:**

  - Mainland China: Integrate Notification

  - Overseas: Integrate FCM

2. **Provide push controls:** Based on our experience, over 90% of users who miss call notifications have manually disabled app notification permissions. To ensure call reachability, we strongly recommend:

  - **Send notifications prudently:** Avoid sending low-quality or irrelevant notifications to reduce the likelihood of users disabling notification permissions.

  - **Provide granular controls:** Following the approach of apps like WeChat, provide separate toggles in your app settings for "Notification" and "FCM Data Message", rather than directing users to system settings to disable all notifications at once.

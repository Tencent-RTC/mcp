On Android, incoming audio/video call invitations won't trigger notifications when your app is killed or running in the background. This prevents users from receiving and answering calls when the app isn't actively running.

To solve this, you need to integrate offline push notifications using FCM Data Messages. This allows critical signaling—like call invitations—to reach the device and wake up your app, even when it's completely closed, launching the call interface so users can answer incoming calls.

> **Note:**
> Offline push is not required if users are only calling always-online web agents.
>

This guide shows you how to integrate FCM Data Message push for audio/video calls.

## Activate the Service

Go to the [Chat Console > App Push > Access settings](https://console.trtc.io/chat/push-plugin-push-identifier) , and click **Purchase Now** or **Free Trial** (each app is eligible for one free trial, valid for 7 days).

> **Note:**
> When your push plugin trial or subscription expires, all push services (including offline push for regular messages, broadcast/tag push, etc.) will be automatically suspended. To ensure uninterrupted service, please [purchase](https://buy.intl.cloud.tencent.com/avc) or [renew](https://console.tencentcloud.com/expense/renewal) your subscription in advance.
>

## Integration Considerations

### Improve Call Reach Rate

Over 90% of missed call notifications are due to users manually disabling app notification permissions. To maximize call delivery, we strongly recommend:
1. **Send notifications responsibly:** Avoid sending low-quality or irrelevant notifications to reduce the risk of users disabling notification permissions due to spam.

2. **Offer granular notification controls:** Like WeChat, provide separate toggles in your app settings for **Notification** and **FCM Data Message** instead of instructing users to disable all notifications in system settings.

## Implementation Steps

### Step 1: Configure Vendor
1. Register your app on the [FCM Push Platform](https://console.firebase.google.com/u/0/) to obtain your **AppID**, **AppKey**, and the `google-services.json` file required for offline push.

2. Log in to the [Chat Console](https://console.trtc.io/chat/), go to [**App Push > Access settings**](https://console.trtc.io/chat/push-plugin-push-identifier) feature tab, select FCM, add FCM's certificate, and select **Transparent transmission(data) message**.

   |**Vendor Push Platform**|**IM Console Configuration**|
   |---------|---------|
   |||

### Step 2: Integrate the Push Plugin
1. **Add configuration files:** After completing the vendor push setup in the console, download the configuration files and add them to your project. Place the downloaded `timpush-configs.json` file in your app module's `assets` directory, and add `google-services.json` to your project's `app` directory.

   |**Download the file timpush-configs.json**|**Download file google-services.json**|**Add to your project**|
   |---------|---------|---------|
   |||<br>|

2. **Integrate the push plugin:** Add the following dependencies to your project's `app` module `build.gradle` file:

   ``` java
   implementation "com.tencent.timpush:timpush:latest.release"
   implementation "com.tencent.timpush:fcm:latest.release"
   ```

   > **Note：**
   >
   > - TIMPush requires IM SDK version **7.9.5666** or above.
   > - You can update the Chat SDK version in the `tuicallkit-kt/build.gradle` file.

### Step 3: Project Configuration
1. Add the following to the `buildscript > dependencies` section of your project-level `build.gradle` file:

   ``` java
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.3.15'
       }
   }
   ```
2. In your app module's `build.gradle` file, apply the following plugin:

   ``` java
   apply plugin: 'com.google.gms.google-services'
   ```
3. In the same `build.gradle` file, set the `applicationId` to your actual app package name:

   ``` java
   applicationId 'com.****.callkit'
   ```

## Customize Incoming Call Notifications

### Step 1: Listen for FCM Push

When FCM push wakes up your app, the TIMPush plugin sends an "app wakeup" broadcast. To display incoming call notifications correctly, follow these steps:
1. **Listen for the app wakeup broadcast**: Register a broadcast receiver to handle the wakeup event sent by TIMPush.

2. **Perform auto login:** After logging in, the call service becomes available. For login implementation, see [login](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.login/-login-store/login.html).

   ``` java
   import android.content.BroadcastReceiver
   import android.content.Context
   import android.content.Intent
   import android.content.IntentFilter
   import android.os.Bundle
   import androidx.localbroadcastmanager.content.LocalBroadcastManager

   class PushWakeupReceiver : BroadcastReceiver() {
       override fun onReceive(context: Context?, intent: Intent?) {
           if (intent?.action == "TIMPush.BROADCAST_IM_LOGIN_AFTER_APP_WAKEUP") {
               val bundle = intent.getExtras()
               // 2.Execute Auto-Login
               // autoLogin()
           }
       }
   }

   class MainActivity : AppCompatActivity() {
       private val wakeupReceiver = PushWakeupReceiver()
       private var callListener: CallListener? = null

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // 1.Listen for App Wakeup Broadcast
           observeAppWeakup()
       }

       private fun observeAppWeakup() {
           val filter = IntentFilter("TIMPush.BROADCAST_IM_LOGIN_AFTER_APP_WAKEUP")
           LocalBroadcastManager.getInstance(this).registerReceiver(wakeupReceiver, filter)
       }
   }
   ```

### Step 2: Customize Notification Style

Use the `NotificationManager` class to display a custom incoming call notification interface:
1. **Create an incoming call notification manager class** (`IncomingCallNotificationManager`): Encapsulate the logic for creating and displaying notifications.

2. **Customize the notification UI:** Use `RemoteViews` to define the notification layout. For details on configuring notifications with `NotificationCompat.Builder` (such as Channel, PendingIntent, priority, etc.), refer to the Android documentation: [NotificationCompat.Builder](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder).

   ``` java
   import android.app.Notification
   import android.app.NotificationChannel
   import android.app.NotificationManager
   import android.content.Context
   import android.content.Intent
   import android.os.Build
   import android.widget.RemoteViews
   import androidx.core.app.NotificationCompat

   class IncomingCallNotificationManager(private val context: Context) {
       private val channelId = "incoming_call_channel"
       private val channelName = "Call notification"
       private val notificationId = 1001
       private var remoteViews: RemoteViews? = null
       private val notificationManager: NotificationManager =
           context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

       init {
           // 1.Create notification channels
           createNotificationChannel()
       }

       private fun createNotificationChannel() {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               val channel = NotificationChannel(
                   channelId,                           // Channel ID (Unique Identifier)
                   "Call notification",                 // Channel Name (Visible to Users)
                   NotificationManager.IMPORTANCE_HIGH  // Importance: High priority
               ).apply {
                   description = "Display incoming call notification"  // Channel description
                   enableLights(true)          // Enable notification light
                   enableVibration(true)       // Enable vibration
                   setShowBadge(false)         // Do not display badges
               }
               notificationManager.createNotificationChannel(channel)
           }
       }

       // 2. Display custom call notification UI style
       fun showIncomingCallNotification(
           callerName: String,
           callerAvatar: Int?,
           isVideoCall: Boolean
       ) {
           // RemoteViews are used to display custom layouts in notifications.
           remoteViews = RemoteViews(context.packageName, R.layout.incoming_call_notification)
           // Set caller name
           remoteViews?.setTextViewText(R.id.tv_caller_name, callerName)
           // Set the call type description (video call or voice call).
           remoteViews?.setTextViewText(R.id.tv_call_desc, if (isVideoCall) "Video" else "Audio")
           // Set call type icon
           val callTypeIcon = if (isVideoCall) {R.drawable.ic_video_call} else {R.drawable.ic_audio_call}
           remoteViews?.setImageViewResource(R.id.img_call_type, callTypeIcon)
           // Set caller avatar
           remoteViews?.setImageViewResource(R.id.img_avatar, callerAvatar)

           // Create a notification object
           val notification = NotificationCompat.Builder(context, channelId)
               .setSmallIcon(R.drawable.ic_notification_small)  // Small icons displayed in the status bar
               .setContent(remoteViews)                         // Set custom layout
               .setCustomContentView(remoteViews)               // Standard view (when the notification bar is collapsed)
               .setCustomBigContentView(remoteViews)            // Expanded view (when the notification bar is expanded)
               .setOngoing(false)                               // Continuous notification (cannot be swiped to delete)
               .setAutoCancel(true)                             // Automatically cancel after tapping
               .setCategory(NotificationCompat.CATEGORY_CALL)   // Category as call notification
               .setVisibility(NotificationCompat.VISIBILITY_PUBLIC) // Visible on lock screen
               .setTimeoutAfter(60000)                          // Automatically cancel after 60 seconds
               .build()
           notificationManager.notify(notificationId, notification)
       }
   }
   ```
- The layout file for the above notification (`R.layout.incoming_call_notification`):

   ``` xml
   <?xml version="1.0" encoding="utf-8"?>
   <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
       android:layout_width="match_parent"
       android:layout_height="wrap_content"
       android:orientation="horizontal"
       android:padding="16dp"
       android:background="#FFFFFF"
       android:gravity="center_vertical">

       <!-- User avatar -->
       <ImageView
           android:id="@+id/img_avatar"
           android:layout_width="56dp"
           android:layout_height="56dp"
           android:layout_gravity="center_vertical"
           android:scaleType="centerCrop"
           android:src="@drawable/callview_ic_avatar"
           android:background="@drawable/avatar_background" />

       <!-- User info and description -->
       <LinearLayout
           android:layout_width="0dp"
           android:layout_height="wrap_content"
           android:layout_weight="1"
           android:layout_gravity="center_vertical"
           android:layout_marginStart="16dp"
           android:orientation="vertical">

           <TextView
               android:id="@+id/tv_caller_name"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:textSize="18sp"
               android:textStyle="bold"
               android:textColor="#212121"
               android:maxLines="1"
               android:ellipsize="end"
               android:text="Incoming Call" />

           <LinearLayout
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:layout_marginTop="6dp"
               android:orientation="horizontal"
               android:gravity="center_vertical">

               <ImageView
                   android:id="@+id/img_call_type"
                   android:layout_width="16dp"
                   android:layout_height="16dp"
                   android:src="@drawable/ic_audio_call" />

               <TextView
                   android:id="@+id/tv_call_desc"
                   android:layout_width="wrap_content"
                   android:layout_height="wrap_content"
                   android:layout_marginStart="6dp"
                   android:textSize="14sp"
                   android:textColor="#757575"
                   android:text="Audio Call" />
           </LinearLayout>
       </LinearLayout>
   </LinearLayout>
   ```

### Step 3: Display Incoming Call Notification

Listen for incoming call events. After a successful login (Step 1), if there are offline incoming call events, **CallStore** will automatically resend them. You can then display your custom notification (from Step 2) as follows:
1. **Listen for incoming call events:** Subscribe to the [onCallReceived](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-received.html) event. This event is triggered when an incoming call is received and contains key call information.

2. **Display the incoming call notification:** When the [onCallReceived](https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-listener/on-call-received.html) event is received, display the notification interface using the call information from the event. In the callback, use the event data to trigger your custom notification (see Step 2).

   ``` java
   class MainActivity : AppCompatActivity() {
       private val wakeupReceiver = PushWakeupReceiver()
       private var callListener: CallListener? = null

       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           // 1.Listening to incoming call events
           observeCallReceived()
       }

       private fun observeCallReceived() {
           callListener = object : CallListener() {
               override fun onCallReceived(callId: String, mediaType: CallMediaType, userData: String) {
                   super.onCallReceived(callId, mediaType, userData)
                   // 2.Display incoming call notification
                   showIncomingCallNotification(mediaType)
               }
           }
           callListener?.let { CallStore.shared.addListener(it) }
       }

       private fun showIncomingCallNotification(mediaType: CallMediaType) {
           try {
               val callerName = CallStore.shared.observerState.activeCall.value.inviterId
               val notificationManager = IncomingCallNotificationManager(this)
               notificationManager.showIncomingCallNotification(
                   callerName = callerName,
                   callerAvatar = R.drawable.callview_ic_avatar,
                   isVideoCall = mediaType == CallMediaType.Video
               )
           } catch (e: Exception) {
           }
       }
   }
   ```
- **onCallReceived:** Triggered when an incoming call event is received.

| <strong>Parameter</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Unique identifier for this call. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Call media type, used to specify whether to initiate an audio or video call.<br>- <code>CallMediaType.Video</code>: Video call.<br>- <code>CallMediaType.Audio</code>: Audio call. |

- **activeCall:** Contains real-time data for the active call, including call ID, inviter ID, invitee IDs, media type, duration, and other key information.

| <strong>Field</strong> | <strong>Type</strong> | <strong>Description</strong> |
| --- | --- | --- |
| callId | String | Unique identifier for this call. |
| roomId | String | Room ID for this call. |
| inviterId | String | ID of the user who initiated the call. |
| inviteeIds | LinkedHashSet | List of invitee user IDs. |
| chatGroupId | String | Group ID for this call, used in conjunction with Chat. |
| mediaType | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-media-type/index.html">CallMediaType</a> | Media type for this call.<br>- <code>CallMediaType.Video</code>: Video call.<br>- <code>CallMediaType.Audio</code>: Audio call. |
| result | <a href="https://liteav.sdk.cloudcachetci.com/doc/product/tuikit/atomic-x/android/en/-atomic-x%20-core%20-a-p-i/io.trtc.tuikit.atomicxcore.api.call/-call-direction/index.html">CallDirection</a> | Call result/direction.<br>- <code>CallDirection.Unknown</code>: Unknown call.<br>- <code>CallDirection.Missed</code>: Missed call.<br>- <code>CallDirection.Incoming</code>: Incoming call.<br>- <code>CallDirection.Outgoing</code>: Outgoing call. |
| duration | Long | Call duration. |
| startTime | Long | Call start time. |

### Demo Effect

## FAQs

### Unable to Display Incoming Call Interface After App Is Killed?
- Check if push notifications are being received. If not, verify that the IM Console certificate was uploaded correctly. .

- Ensure that FCM Data Message is selected in the console, as described in Step 2 of **Prerequisites** above.

- Confirm that data messages are being received. Filter your logs (keyword: TIMPush) and look for the following log output:

- Make sure **auto login** is implemented. Only after auto login will call requests be pulled and the incoming call interface displayed.

### How to Force FCM Channel Usage?

To force your app to always use the FCM channel, call the following method:
``` java
TIMPushManager.getInstance().forceUseFCMPushChannel(true);
```

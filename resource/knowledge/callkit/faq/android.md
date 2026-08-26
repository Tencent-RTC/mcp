### The error message "The package you purchased does not support this ability"?

If you encounter the above error message, it is because the audio and video call capability package of your current application has expired or has not been activated. You can .

### When the application is offline, Will it can pop up the call view?

During a one-to-one call, if you come online within the timeout period, an incoming call view will be triggered;  For group calls, if you come online within the timeout period, the last 20 unprocessed group messages will be pulled up, and if a call invitation exists, it will trigger an incoming call. The display strategy for incoming calls see: Incoming call display policy for the callee.

### When the application is in the background, Will it can pop up the call view?
1. TUICallKit has two different display policy for the callee.

2. Before version 2.3 of TUICallKit, to automatically bring the application from the background to the foreground, it was necessary to check whether the app had enabled the "Background self-start" or "Floating window" permission.

   Different manufacturers, or even the same manufacturer with different Android versions, offer varying permissions and permission names for applications. For instance, Xiaomi 6 requires only the "Background pop-ups" permissions , while Redmi needs both the "Background pop-ups"  and "Display over other applications" permissions.

 How to enable permissions.

3. If you encounter the following scenarios where the call interface cannot be pulled up, the reason is that changes in the application's launch stack caused the CallKitActivity interface to be obscured or removed.

   Scenario One: After accept call, if app goes to the background and then click the desktop icon to enter foreground, the CallKitActivity disappears.

   Scenario Two: If the app is in the background and when you receive a IncomingNotificationView then click the desktop icon to enter the app, the CallKitActivity didn't show and the IncomingNotificationView disappears.

   Scenario Three: When the app is in the background and an offline push notification is received, not clicking the push notification but entering the app via the desktop icon will either fail to bring up the CallKitActivity or cause the CallKitActivityto flash momentarily.

 In the above scenarios, you need to add the following code to the default Activity of your app. Each app's default Activity may differ. .xml configuration for more details. Taking the launch page SplashActivity for most applications as an example:

【Code】
``` java
if (!isTaskRoot() && getIntent() != null && getIntent().hasCategory(Intent.CATEGORY_LAUNCHER)
        && Intent.ACTION_MAIN.equals(getIntent().getAction())) {
    finish();
    return;
}
```

【Location】

### Incoming call display policy for the callee

To make TUICallKit adaptable to different business needs, add product features, and improve user experience, TUICallKit **version 2.3 and above** (Release Log) optimized the call page display pop-up strategy after receiving a call, as detailed below:

1. If you want the callee to pull up the full-screen call view when receiving a call, you can integrate the [tuicallkit-kt](https://github.com/Tencent-RTC/TUICallKit/tree/main/Android/tuicallkit-kt) code. By default, the incoming call display strategy for the callee is as follows:

2. If you prefer to show a banner when receiving a call and then pull up the full-screen  as needed, you can enable this feature by calling the following interface.

   ``` java
     TUICallKit.createInstance(context).enableIncomingBanner(true);
   ```

   > **Note:**
   >
   > For information on how to enable related permissions, see below: Relevant permissions enabled.
   >
   > If the incoming call interface doesn't display according to the above strategy, please filter the `onCallReceived` log to check if a call invitation was received.
   >

### **Relevant permissions enabled**

To ensure a good calling experience, it is recommended to enable "notification" permissions, "Display over other apps(Floating window)" and "Background pop-ups" permissions in your application. The specific methods are as follows:

【Manually Enabled】

After the application is installed, you can long-press the application Icon, select "Application Information", then enable "notification" permission, "Display over other applications" and "Background pop-ups" permissions. Alternatively, you can go to `Mobile Phone > System Settings > Application Management > Application` to manually enable these permissions.

【Code guidance】
- **Notification permissions**: For showcasing push notifications: please refer to [Notification runtime permissions](https://developer.android.com/develop/ui/views/notifications/notification-permission) and [Request runtime permissions](https://developer.android.com/training/permissions/requesting#request-permission) and implement according to business needs.

- **Floating window permission**: Used for displaying custom incoming call notifications and call floating windows.

- **Background pop-ups:** Used to pop up the interface when the application is in the background (for example: on a VIVO phone).

``` java
fun requestPermission(context: Context?) {
    //In TUICallKit,Please open both OverlayWindows and Background pop-ups permission.
    PermissionRequester.newInstance(
         PermissionRequester.FLOAT_PERMISSION, PermissionRequester.BG_START_PERMISSION)
        .request()
}
```

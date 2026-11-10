---
sync_node_id: '114105598136492032'
nav_path:
  - "视频通话 SDK"
  - "离线唤醒"
  - "iOS"
  - "VoIP（Apple CallKit）"
product: "call"
---
VoIP (Voice over IP) Push is a notification mechanism provided by Apple for responding to VoIP calls. Combining Apple's PushKit.framework and CallKit.framework can achieve system-level call effects. 

> **Note:**
> - Apple requires that VoIP Push be used in conjunction with the CallKit.framework starting with iOS 13.0; otherwise, the app will crash after running.
> - VoIP Push cannot reuse the general APNs push certificates, so a separate [VoIP Push certificate needs to be applied for](https://www.tencentcloud.com/en/document/product/647/51000#apply_ceritificate) on the Apple Developer website.

## Integration effect

## Configuring VoIP Push

To receive VoIP Push notifications, follow these steps:
1. Apply for a VoIP Push certificate.

2. Upload the certificate to the Chat console.

3. Complete the project configuration.

4. Integrate the TUICallKitVoIPExtension component.

### Step 1: Apply for a VoIP Push certificate

Before applying for a VoIP Push certificate, log in to the [Apple Developer Center](https://developer.apple.com/account/), enable your app's remote push capabilities.

Once your AppID has Push Notification capabilities, follow these steps to apply for and configure a VoIP Push certificate:
1. Log in to the [Apple Developer Center](https://developer.apple.com/account/) website, click "Certificates, IDs & Profiles" in the sidebar, and go to the "Certificates, Identifiers & Profiles" page.

   

2. Click **+** next to Certificates.

   

3. In the **Create a New Ceritificate** tab, select **VoIP Services Certificate** and click **Continue**.

4. In the **Select an App ID for your VoIP Service Certificate** tab, select your app's BundleID, and click **Continue**.

5. The system will prompt you for a Certificate Signing Request (CSR).

6. Next, create a CSR file. Open **Keychain Access** on your Mac, and in the menu, choose **Keychain Access** > **Certificate Assistant** > **Request a Certificate From a Certificate Authority**.

   

7. Enter your email address, common name (your name or company name), choose **Save to disk**, click **Continue**, and the system will generate a `*.certSigningRequest` file.

   Go back to the Apple Developer website in **Step 5** , click "Choose File" and upload the generated `*.certSigningRequest` file.

   

8. Click **Continue** to generate the certificate, and click **Download** to download the corresponding certificate to your local device.

9. Double-click the downloaded `voip_services.cer` file, and the system will import it into your keychain.

10. Open the Keychain app, under **Login** > **My Certificates**, right-click on the created VoIP Services certificate.

   > **Note:**
   > 
   > When saving the `P12` file, be sure to set a password for it.
   > 

   

### Step 2: Upload certificates to the Chat Console

[Open the Chat Console](https://console.cloud.tencent.com/im/detail), select your created Chat application, and follow the steps below to upload your certificates:
1. Choose your Chat application, click **Go new** under the **Offline Push Certificate Configuration** tab.

   

2. In the **Manufacturer configuration**, switch to **iOS**, click the **Add Certificate** button. Then upload the VoIP certificates for both the production and development environments.

   

   > **Note:**
   > 
   > - The VoIP Push Certificate itself does not distinguish between production and testing environments. Both environments use the same VoIP Push Certificate.
   > - The uploaded certificate name should be in English (especially avoiding brackets and other special characters).
   > - The uploaded certificate must have a password set, or the push notification won't be received.
   > - The certificate for publishing to the App Store needs to be set to the production environment; otherwise, the push notification won't be received.
   > - The p12 certificate you upload must be a valid and genuinely applied certificate.

3. After the upload is completed, record the certificate ID for different environments.

   

   > Note:
   > 
   > The certificate IDs for the development and production environments must be strictly distinguished and filled in according to the actual environment in Step 4: Integrate the TUICallKitVoIPExtension component.
   > 

### Step 3: Complete the project configuration

   

   

### Step 4: Integrate the TUICallKitVoIPExtension component

Use CocoaPods to import the component, following these steps:
1. Add the following dependency to your `Podfile`.

   ``` bash
   pod 'TUIVoIPExtension'
   ```

   > **Note：**
   > 
   > Please make sure to specify the same `Subspecs` for `TUICallKit_Swift` and `TUICallKitVoIPExtension` components in your `Podfile`. 
   > 

2. Execute the command below to install the component.

   ``` bash
   pod install
   ```
3. Report the Certificate ID recorded in Step 2.

   

【Swift】
``` swift
import TUIVoIPExtension

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    // Report certificate ID
    TUIVoIPExtension.setCertificateID(1234)
    
    return true
}
```

【Objective-C】
``` objectivec
#import <TUIVoIPExtension/TUIVoIPExtension.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // Report certificate ID
    [TUIVoIPExtension setCertificateID:1234];
    
    return YES;
}
```

   > **Note:**
   > 
   > If you cannot install the latest version of TUICallKit, execute the command below to update your local CocoaPods repository list.
   > 

   > `pod repo update`

## Make a VoIP call

If you need to make a VoIP call, you need to set the iOSPushType field of the OfflinePushInfo to `TUICallIOSOfflinePushTypeVoIP` when calling calls. The default value is `TUICallIOSOfflinePushTypeAPNs`.

【Swift】
``` swift
import TUICallKit_Swift
import TUICallEngine

let pushInfo: TUIOfflinePushInfo = TUIOfflinePushInfo()
pushInfo.title = ""
pushInfo.desc = "You have a new call"
pushInfo.iOSPushType = .voip
pushInfo.ignoreIOSBadge = false
pushInfo.iOSSound = "phone_ringing.mp3"
pushInfo.androidSound = "phone_ringing"
// OPPO must set a ChannelID to receive push messages. This channelID needs to be the same as the console.
pushInfo.androidOPPOChannelID = "tuikit"
// FCM channel ID, you need change PrivateConstants.java and set "fcmPushChannelId"
pushInfo.androidFCMChannelID = "fcm_push_channel"
// VIVO message type: 0-push message, 1-System message(have a higher delivery rate)
pushInfo.androidVIVOClassification = 1
// HuaWei message type: https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835
pushInfo.androidHuaWeiCategory = "IM"

let params = TUICallParams()
params.userData = "User Data"
params.timeout = 30
params.offlinePushInfo = pushInfo

TUICallKit.createInstance().calls(userIdList: ["123456"], callMediaType: .audio, params: params) {

} fail: { code, message in

}
```

【Java】
``` java
TUICallDefine.OfflinePushInfo offlinePushInfo = new TUICallDefine.OfflinePushInfo();
offlinePushInfo.setTitle("");
offlinePushInfo.setDesc("You have receive a new call");
// For OPPO, you must set the `ChannelID` to receive push messages. The `ChannelID` must be identical with that in the console.
// OPPO must set a ChannelID to receive push messages. This channelID needs to be the same as the console.
offlinePushInfo.setAndroidOPPOChannelID("tuikit");
offlinePushInfo.setIgnoreIOSBadge(false);
offlinePushInfo.setIOSSound("phone_ringing.mp3");
offlinePushInfo.setAndroidSound("phone_ringing"); //Note:don't add suffix
//VIVO message type: 0-push message, 1-System message(have a higher delivery rate)
offlinePushInfo.setAndroidVIVOClassification(1);
//FCM channel ID, you need change PrivateConstants.java and set "fcmPushChannelId"
offlinePushInfo.setAndroidFCMChannelID("fcm_push_channel");
//Huawei message type
offlinePushInfo.setAndroidHuaWeiCategory("IM");
//IOS push type: if you want user VoIP, please modify type to TUICallDefine.IOSOfflinePushType.VoIP
offlinePushInfo.setIOSPushType(TUICallDefine.IOSOfflinePushType.VoIP);

TUICallDefine.CallParams params = new TUICallDefine.CallParams();
params.offlinePushInfo = offlinePushInfo;

List<String> list = new ArrayList<>();
list.add("mike")
TUICallKit.createInstance(context).calls(list, TUICallDefine.MediaType.Video, params, null);
```

【Dart】
``` java
TUIOfflinePushInfo offlinePushInfo = TUIOfflinePushInfo();
 offlinePushInfo.title = "Flutter TUICallKit";
 offlinePushInfo.desc = "This is an incoming call from Flutter TUICallkit";
 offlinePushInfo.ignoreIOSBadge = false;
 offlinePushInfo.iOSSound = "phone_ringing.mp3";
 offlinePushInfo.androidSound = "phone_ringing";
 offlinePushInfo.androidOPPOChannelID = "Flutter TUICallKit";
 offlinePushInfo.androidVIVOClassification = 1;
 offlinePushInfo.androidFCMChannelID = "fcm_push_channel";
 offlinePushInfo.androidHuaWeiCategory = "Flutter TUICallKit";
 offlinePushInfo.iOSPushType = TUICallIOSOfflinePushType.VoIP;

 TUICallParams params = TUICallParams(offlinePushInfo: offlinePushInfo);
  
 TUICallKit.instance.calls(['vince'], TUICallMediaType.audio, params);
```

【Objective-C】
``` objectivec
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>
#import <RTCRoomEngine/TUICallEngine.h>

- (TUICallParams *)getCallParams {
    TUIOfflinePushInfo *offlinePushInfo = [self createOfflinePushInfo];
    TUICallParams *callParams = [TUICallParams new];
    callParams.offlinePushInfo = offlinePushInfo;
    callParams.timeout = 30;
    return callParams;
}

- (TUIOfflinePushInfo *)createOfflinePushInfo {
    TUIOfflinePushInfo *pushInfo = [TUIOfflinePushInfo new];
    pushInfo.title = @"";
    pushInfo.desc = @"You have a new call";
    pushInfo.iOSPushType = TUICallIOSOfflinePushTypeVoIP;
    pushInfo.ignoreIOSBadge = NO;
    pushInfo.iOSSound = @"phone_ringing.mp3";
    pushInfo.AndroidSound = @"phone_ringing";
    // For OPPO, you must set the `ChannelID` to receive push messages. The `ChannelID` must be identical with that in the console.
    // OPPO must set a ChannelID to receive push messages. This channelID needs to be the same as the console.
    pushInfo.AndroidOPPOChannelID = @"tuikit";
    // FCM channel ID, you need change PrivateConstants.java and set "fcmPushChannelId"
    pushInfo.AndroidFCMChannelID = @"fcm_push_channel";
    // VIVO message type: 0-push message, 1-System message(have a higher delivery rate)
    pushInfo.AndroidVIVOClassification = 1;
    // HuaWei message type: https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835
    pushInfo.AndroidHuaWeiCategory = @"IM";
    return pushInfo;
}

[[TUICallKit createInstance] calls:@[@"123456"]
                     callMediaType:TUICallMediaTypeAudio
                            params:[self getCallParams] succ:^{

} fail:^(int code, NSString * _Nullable errMsg) {

}];Objective-C
```

## Call from the system call log

If you want to initiate a one-on-one audio or video call directly by clicking the call record in the **System Phone **>** Recent Calls** list, you need to use the **callWith** method in the **TUICallKitVoIPExtension** component in the Application lifecycle callback function. Here's an example:

> **Note:**
> - Only supports dialing one-on-one audio and video calls directly.
> - The logged-in account must be the same account.

1. On iOS 13 (and later versions) with **SceneDelegate **support, and with a minimum compatibility version prior to iOS 13, you need to implement the following methods in **AppDelegate **and **SceneDelegate **respectively.

   

【Swift】
``` swift
import TUIVoIPExtension

/// Implementation in AppDelegate, for versions before iOS 13
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([any UIUserActivityRestoring]?) -> Void) -> Bool {
    TUIVoIPExtension.call(with: userActivity)
    return true
}

/// Implementation in SceneDelegate
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    for userActivity in connectionOptions.userActivities {
        TUIVoIPExtension.call(with: userActivity);
     }
}

func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    TUIVoIPExtension.call(with: userActivity);
}
```

【Objective-C】
``` objectivec
#import <TUIVoIPExtension/TUIVoIPExtension.h>

/// Implementation in AppDelegate, for versions before iOS 13
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    [TUIVoIPExtension callWith:userActivity];
    return YES;
}

/// Implementation in SceneDelegate
- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)sessionptions:(UISceneConnectionOptions *)connectionOptions {
    [connectionOptions.userActivities enumerateObjectsUsingBlock:^(NSUserActivity * _Nonnull userActivity, BOOL * _Nonnull stop) {
        [TUIVoIPExtension callWith:userActivity];
    }];
}

- (void)scene:(UIScene *)scene continueUserActivity:(NSUserActivity *)userActivity {
    [TUIVoIPExtension callWith:userActivity];
}
```

2. On iOS 13 (and later versions) without **SceneDelegate**, you only need to implement the following method in **AppDelegate**.

   

【Swift】
``` swift
import TUIVoIPExtension

func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([any UIUserActivityRestoring]?) -> Void) -> Bool {
    TUIVoIPExtension.call(with: userActivity)
    return true
}
```

【Objective-C】
``` objectivec
#import <TUIVoIPExtension/TUIVoIPExtension.h>

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    [TUIVoIPExtension callWith:userActivity];
    return YES;
}
```

## Frequently Asked Questions

### 1. Can't receive VoIP Push ?
1. First, check if the App's running environment and the certificate environment are consistent, and if the certificate ID matches. If they are inconsistent, you won't be able to receive push notifications.

2. Please make sure your currently logged-in account is offline: press the home key to switch to the background, or log in and then manually kill the process to exit. VoIP Push currently only supports push notifications in offline mode.

3. Check if Step 3: Complete the Project Configuration is done correctly.

4. **Try restarting the test phone to clear the system cache and memory (very important).**

### **2. How to Self-Integrate VoIP Push Functionality**

We also support you to integrate VoIP push capabilities yourself through SDK methods. The overall solution design is as follows:

Related process description:
1. .

2. Refer to [Apple PushKit](https://developer.apple.com/documentation/pushkit) to use and get device token.

3. Use IMSDK's [setVOIP](https://www.tencentcloud.com/document/product/1047/36170#offline-push-apis) interface to report device token to IM server.

4. Refer to [Apple CallKit](https://developer.apple.com/documentation/callkit) to use and display push popup.

5. .

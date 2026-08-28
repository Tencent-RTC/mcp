> **Note:**
> If you need to use products like Chat, CallKit, RoomKit, LiveKit simultaneously, please refer to [Chat Quick Integration Solution](https://www.tencentcloud.com/document/product/1047/50033).
>

### Step 1: Integrate TIMPush
1. The TIMPush component supports CocoaPods integration. You need to add the component dependencies in the Podfile.

   ``` objectivec
   target 'YourAppName' do
     # Uncommment the next line if you're using Swift or would like to use dynamic frameworks
     use_frameworks!
     use_modular_headers!

     # Pods for Example
     pod 'TXIMSDK_Plus_iOS_XCFramework'
     # The version number "VERSION" can be obtained from the .
     pod 'TIMPush', 'VERSION'
   end
   ```
2. Run the following command to install the TIMPush component.

   ``` bash
   pod install
   # If you cannot install the latest version of TUIKit, run the following command to update your local CocoaPods repository list.
   pod repo update
   ```

### Step 2: Set push parameters

2. You need to implement the `- businessID` protocol method in AppDelegate to return the certificate ID.

【Objective-C】
``` objectivec
#pragma mark - TIMPush
- (int)businessID {
    // businessID provided by the back console
    int  kBusinessID = 0;
    return kBusinessID;
}

- (NSString *)applicationGroupID {
    //AppGroup ID
    return kTIMPushAppGroupKey;
}

- (BOOL)onRemoteNotificationReceived:(NSString *)notice {
    // custom navigate
    return NO;
}
```

【Swift】
``` swift
#pragma mark - TIMPush
//Swift must carry the @objc keyword
@objc func businessID() -> Int32 {
    // Certificate ID provided by the back console
    return 0
}
@objc func applicationGroupID() -> String {
    //AppGroup ID
    return "group.com.yourcompony.pushkey"
}
@objc func onRemoteNotificationReceived(_ notice: String?) -> Bool {
    // custom navigate
    return false
}
```

### Step 3: Register for Push

 After the push registration is successful through the API call, offline push notifications can be received.

【Objective-C】
``` objectivec
 const int sdkAppId = your sdkAppId;
 static const NSString *appKey = @"Client Key";

 [TIMPushManager registerPush:sdkAppId appKey:appKey succ:^(NSData * _Nonnull deviceToken) {

   } fail:^(int code, NSString * _Nonnull desc) {

 }];
```

【Swift】
``` swift
let sdkAppId: Int = 0
let appKey: String = "Client Key"

TIMPushManager.registerPush(Int32(sdkAppId), appKey: appKey, succ: { deviceToken in
    // success
}, fail: { code, desc in
    // failed
})
```

   > **Note:**
   >
   > 1. After you log in, when you see the APNs configuration success log printed on the console, it indicates that the integration is successful.
   > 2. If your app has obtained push permissions, you can receive remote push notifications when the app is moved to the background or the process is killed.

### Step 4: Push Delivery Rate Statistics
1. If you need to collect data on push delivery and click rates, you need to implement the `- applicationGroupID` method in the `AppDelegate.m` file and get the App Group ID ([the generation method can be referred to in Vendor Configuration - Generating App Group ID](https://www.tencentcloud.com/document/product/1047/60548#ae5590eb-b974-4226-9f1b-720fb0201c85)).

2. Call the push delivery rate statistics function in the Notification Service Extension's `-didReceiveNotificationRequest:withContentHandler:` method.

【Objective-C】
``` objectivec
@implementation NotificationService
- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    //appGroup identifies the app group shared between the main app and extension. It needs to be configured in the App Groups capability of the main app.
    //Format: group + [mainBundleID] + key
    //E.g., group.com.tencent.im.pushkey
    NSString * appGroupID = kTIMPushAppGroupKey;
    __weak typeof(self) weakSelf = self;
    [TIMPushManager handleNotificationServiceRequest:request appGroupID:appGroupID callback:^(UNNotificationContent *content) {
        weakSelf.bestAttemptContent = [content mutableCopy];
        // Modify the notification content here...
        // self.bestAttemptContent.title = [NSString stringWithFormat:@"%@ [modified]", self.bestAttemptContent.title];
        weakSelf.contentHandler(weakSelf.bestAttemptContent);
    }];
}
@end
```

【Swift】
``` swift
override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    //appGroup identifies the app group shared between the main app and extension. It needs to be configured in the App Groups capability of the main app.
    //Format: group + [mainBundleID] + key
    //E.g., group.com.tencent.im.pushkey
    TIMPushManager.handleNotificationServiceRequest(request: request, appGroupID: "appGroupID") {
        [weak self] content  in
        if let bestAttemptContent = self?.bestAttemptContent {
            // Modify the notification content here...
            bestAttemptContent.title = "\(bestAttemptContent.title) [modified]"
            contentHandler(bestAttemptContent)
        }
    }
}
```

   > **Note:**
   >
   > 1. To report push delivery data, enable the mutable-content switch to support iOS 10's extension feature.
   >
   > 2. Data details can be viewed on the Push Data Page. The Push Data Page can only be used after [purchasing the Push Plugin](https://buy.cloud.tencent.com/avc).

### Step 5: **Verify Connection**

Run the App, filter logs using the keyword "TIMPush", and check the related logs:

If logs similar to the image above appear, it indicates that Push has been successfully integrated, and you can proceed to the next step.

### Step 6: Send push notifications

Detailed usage instructions can be found at: [RESTful APIs - Initiate All-staff/Tag Push](https://www.tencentcloud.com/document/product/1047/60561).

### Step 7: Click Custom Redirect after offline push

If you need to customize the parsing of received remote push notifications, you can implement it as follows:

【Custom click redirect implementation】

> **Note:**
> It is recommended to place the registration callback timing in the didFinishLaunchingWithOptions function of the AppDelegate.
>

【Objective-C】
``` objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [TIMPushManager addPushListener:self];
    return YES;
}
#pragma mark - TIMPushListener
- (void)onNotificationClicked:(NSString *)ext {
        // Getting ext for Definition redirect
}
```

【Swift】
``` swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    TIMPushManager.addPushListener(listener: self)
    return true
}

@objc func onNotificationClicked(_ ext: String) {
    //Clicked
}
@objc func onRecvPushMessage(_ message: TIMPushMessage) {
    //onRecvPushMessage
}
@objc func onRevokePushMessage(_ messageID: String) {
    //onRevokePushMessage
}
```

【Custom click redirect implementation (old solution)】

You need to implement the `- onRemoteNotificationReceived` method in the AppDelegate.m file.

【Objective-C】
``` objectivec
#pragma mark - TIMPush

- (BOOL)onRemoteNotificationReceived:(NSString *)notice {
    //- If YES is returned, TIMPush will not execute the built-in TUIKit offline push parsing logic, leaving it entirely to you to handle.
    //NSString *ext = notice;
    //OfflinePushExtInfo *info = [OfflinePushExtInfo createWithExtString:ext];
    //return YES;

    //- If NO is returned, TIMPush will continue to execute the built-in TUIKit offline push parsing logic and continue to callback - navigateToBuiltInChatViewController:groupID: method.
    return NO;
}
```

【Swift】
``` swift
@objc func onRemoteNotificationReceived(_ notice: String) -> Bool {
    //- If YES is returned, TIMPush will not execute the built-in TUIKit offline push parsing logic, leaving it entirely to you to handle.
    // let ext = notice
    // let info = OfflinePushExtInfo.create(withExtString: ext)
    // return true

    //- If false is returned, TIMPush will continue to execute the built-in TUIKit offline push parsing logic and continue to callback - navigateToBuiltInChatViewController:groupID: method.
    return false
}
```

### Regarding All-staff/Tag Push

All-staff/Tag Push supports sending specific content, and also allows for the delivery of personalized content to specific user groups based on Tag, attribute, such as Membership Activities, Regional Notifications, etc. It aids in User Acquisition, Conversion, Activation Promotion, and other operational work phases, while also supporting Push Delivery Reports, Self-service Push Troubleshooting Tool. For more details, please see [Effect Display](https://www.tencentcloud.com/document/product/1047/60541).

For more detailed content, it is recommended to refer to [All-staff/Tag Push](https://www.tencentcloud.com/document/product/1047/60561).

Congratulations on completing the integration of the Push Plugin. Please note: After the **trial or purchase expiry of the Push Plugin, push services (including regular message offline push, all-staff push, etc.) will be automatically stopped**. To avoid affecting the normal use of your business, please [purchase](https://buy.cloud.tencent.com/avc)/[renew](https://buy.cloud.tencent.com/avc) in advance.

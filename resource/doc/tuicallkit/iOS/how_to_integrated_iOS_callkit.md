This article will guide you through the quick integration of the TUICallKit component. You will complete several key steps within 10 minutes, ultimately obtaining a video call feature with a complete UI interface.
<table>
<tr>
<td rowspan="1" colSpan="1" >1v1 Video Call</td>

<td rowspan="1" colSpan="1" >Group call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/b8670a89190311ef957f525400f65c2a.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/5866a4f4190311efa1975254005ac0ca.png)</td>
</tr>
</table>


## Environment Preparations
- Xcode 13 or later.

- iOS 13.0 or later.

- CocoaPods environment installation, [Click to view](https://guides.cocoapods.org/using/getting-started.html).

- If you experience any issues with access or usage, please consult the [FAQs](https://write.woa.com/document/145196720321933312).


## Step 1. Activate the service

Refer to [Activate the Service](https://write.woa.com/document/140196392040579072) to obtain `SDKAppID, SDKSecretKey`, which will be used as **Mandatory Parameters in **[Step 4: Log in to the TUICallKit component](https://write.woa.com/document/95734398531444736)**.**

## Step 2. Import the component

Use CocoaPods to import the component. If you encounter any issues, please refer to [Environment Preparation](https://write.woa.com/document/95734398531444736) first. Detailed steps for importing the component are as follows:
1. Please add the dependency `pod 'TUICallKit_Swift'` to your `Podfile`. If you encounter any problems, please refer to the [Example](https://github.com/Tencent-RTC/TUICallKit/blob/main/iOS/Example/Podfile) project.

   ``` bash
   target 'xxxx' do
     ...
     pod 'TUICallKit_Swift/Professional'
   end
   ```   

   > **Note:**
   > 

   > If your project lacks a `Podfile`, you need to `cd` into the `xxxx.xcodeproj` directory in Terminal, and then create a `Podfile` by executing the following command:
   > 
   > `pod init`

2. In Terminal, first `cd` into the `Podfile` directory and then run the following command to install components.

   ``` bash
   pod install
   ```   

   > **Note:**
   > 

   > If you cannot install the latest version of TUICallKit, you may first delete **Podfile.lock** and **Pods**. Then run the following command to update the local CocoaPods repository list.
   > 
   > `pod repo update`

   > Then, run the following command to update the Pod version of the component library.
   > 
   > `pod update`

3. We suggest you compile and run once. If you encounter any problems, you can refer to our [FAQs](https://write.woa.com/document/145196720321933312). If the problem remains unresolved, you may try running our [Example](https://github.com/Tencent-RTC/TUICallKit/tree/main/iOS/Example) project. If you encounter any issues during integration and use, you are welcome to [provide feedback](https://github.com/Tencent-RTC/TUICallKit/issues) to us.


## Step 3: Configure the Project

To use audio and video features, you need to authorize the usage of the camera and microphone. Please set the required permissions according to the actual needs of the project.
1. In **Xcode**, select **TARGETS** > **Info** > **Custom iOS Target Properties** from the menu.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/3a48a98618fc11ef8a48525400762795.png)

2. Click the **+** button to add camera and microphone permissions.

- `Privacy - Camera Usage Description`

- `Privacy - Microphone Usage Description`


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/3a33284618fc11efa1975254005ac0ca.png)


   

## Step 4: Log in to the `TUICallKit` component


   Add the following code to your project. It works by calling the relevant interfaces in TUICore to complete the login to TUI Component. This step is very important, only after successfully logging in, you can normally use the features offered by TUICallKit.


   


【Swift】
``` swift
import TUICore
import TUICallKit_Swift

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
    let userID = "denny"       // Please replace with your UserId
    let sdkAppID: Int32 = 0    // Please replace with the SDKAppID obtained from the console in the step 1
    let secretKey = "****"     // Please replace with the SecretKey obtained from the console in the step 1

    let userSig = GenerateTestUserSig.genTestUserSig(userID: userID, sdkAppID: sdkAppID, secretKey: secretKey)

    TUILogin.login(sdkAppID, userID: userID, userSig: userSig) {
      print("login success")
    } fail: { code, message in
      print("login failed, code: \(code), error: \(message ?? "nil")")
    }

    return true
}
```


【Objective-C】
``` objectivec
#import <TUICore/TUILogin.h>
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    NSString *userID = @"denny";     // Please replace with your UserId
    int sdkAppID = 0;                // Please replace with the SDKAppID obtained from the console in the first step
    NSString *secretKey = @"****";   // Please replace with the SecretKey obtained from the console in the first step

    NSString *userSig = [GenerateTestUserSig genTestUserSigWithUserID:userID sdkAppID:sdkAppID secretKey:secretKey];

    [TUILogin login:sdkAppID
             userID:userID
            userSig:userSig
               succ:^{
        NSLog(@"login success");
    } fail:^(int code, NSString * _Nullable msg) {
        NSLog(@"login failed, code: %d, error: %@", code, msg);
    }];
    
    return YES;
}
```

<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Your own User ID based on your business. It can only include letters (a-z, A-Z), digits (0-9), underscores, and hyphens.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppID</td>

<td rowspan="1" colSpan="1" >Int32</td>

<td rowspan="1" colSpan="1" >The unique identifier SDKAppID for the audio and video application created in [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >secretKey</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >SDKSecretKey for the audio and video application created in [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >A security signature for user login to verify identity and prevent unauthorized access to cloud services.</td>
</tr>
</table>
   

   > **Note:**
   > 
>   - **Development Environment**: During local development and debugging, use the local GenerateTestUserSig.genTestSig function to create a userSig. But be careful, the SDKSecretKey can be decompiled and reverse-engineered. If leaked, it could allow theft of your Tencent Cloud traffic.
>   - **Production Environment**:  For project launch, use the [Server-side Generation of UserSig](https://www.tencentcloud.com/zh/document/product/647/35166#.E6.AD.A3.E5.BC.8F.E8.BF.90.E8.A1.8C.E9.98.B6.E6.AE.B5.E5.A6.82.E4.BD.95.E8.AE.A1.E7.AE.97-usersig.EF.BC.9F) method. 


## Step Five: Make your first call

By calling the call function of TUICallKit and specifying the calls type and callee's userId, you can initiate an audio or video call.




【Swift】
``` swift
import TUICallKit_Swift
import RTCRoomEngine

// Initiating a 1-to-1 audio call (assuming userId is mike)
TUICallKit.createInstance().calls(userIdList: ["mike"], callMediaType: .audio, params: nil) {

} fail: { code, message in

}
```


【Objective-C】
``` objectivec
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>
#import <RTCRoomEngine/TUICallEngine.h>

// Initiating a 1-to-1 audio call (assuming userId is mike)
[[TUICallKit createInstance] calls:@[@"mike"] callMediaType:TUICallMediaTypeAudio params:NULL succ:^{
} fail:^(int code, NSString * _Nullable errMsg) {
}];
```
<table>
<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/4d737a62190011efa1975254005ac0ca.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/5146bd45190011ef87e352540019e87e.png)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >Caller</td>

<td rowspan="1" colSpan="1" >Callee</td>
</tr>
</table>


## Additional Features
- [Setting Nickname, Avatar](https://write.woa.com/document/140283519901868032)

- [Customize Interface](https://write.woa.com/document/95821338112184320)

- [Offline Push](https://write.woa.com/document/95821656031932416)

- [Multiplayer Call](https://write.woa.com/document/140196498678116352)

- [Floating Window](https://write.woa.com/document/140196506800930816)

- [Custom Ringtone](https://write.woa.com/document/140196518087802880)

- [Call Status Monitoring](https://write.woa.com/document/140196527978475520)

- [Cloud Recording](https://write.woa.com/document/95824491274473472)


## FAQs

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://write.woa.com/document/145196720321933312).

## Suggestions and Feedback

If you have any suggestions or feedback, please contact info_rtc@tencent.com.

本文将介绍如何快速完成 TUICallKit 组件的接入，您将在 10 分钟内完成以下几个关键步骤，并最终得到一个包含完备 UI 界面的视频通话功能。
<table>
<tr>
<td rowspan="1" colSpan="1" >1v1 视频通话</td>

<td rowspan="1" colSpan="1" >群组通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/c57111ca182211efae48525400720cb5.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/64c04152190311ef87e352540019e87e.png)</td>
</tr>
</table>


## 环境准备
- Xcode 13 及以上。

- iOS 13.0 及以上。

- CocoaPods 环境安装，单击 [查看](https://guides.cocoapods.org/using/getting-started.html)。

- 如果您的接入和使用中遇到问题，请参见 [常见问题](https://write.woa.com/document/86735803151626240)。


## 步骤一：开通服务

请参见 [开通服务](https://write.woa.com/document/139743928960860160)，获取 `SDKAppID、SDKSecretKey`，他们将在 [步骤四：初始化 TUICallKit 组件](https://write.woa.com/document/86735801863974912) 作为**必填参数**使用。

## 步骤二：导入组件

使用 CocoaPods 导入组件，如果您遇到问题，请先参见 [环境准备](https://write.woa.com/document/86735801863974912)。导入组件具体骤如下：
1. 请在您的 `Podfile` 文件中添加 `pod 'TUICallKit_Swift'` 依赖，建议指定`Subspec`为`Professional`，如果您遇到任何问题，请参见 [Example](https://github.com/Tencent-RTC/TUICallKit/blob/main/iOS/Example/Podfile) 工程。

   ``` bash
   target 'xxxx' do
     ...
     pod 'TUICallKit_Swift/Professional'
   end
   ```   

   > **说明：**
   > 

   > 如果您的项目中缺少`Podfile` 文件，您需要在终端中`cd` 到`xxxx.xcodeproj`目录，然后，通过执行以下命令来创建`Podfile`文件：
   > 
   > `pod init`

2. 在终端中，首先`cd`到`Podfile`目录下，然后执行以下命令，安装组件。

   ``` bash
   pod install
   ```   

   > **说明：**
   > 

   > 如果无法安装 TUICallKit 最新版本，可以先删除 **Podfile.lock **和 **Pods**。然后执行以下命令更新本地的 CocoaPods 仓库列表。
   > 
   > `pod repo update`

   > 之后执行以下命令，更新组件库的 Pod 版本。
   > 
   > `pod update`

3. 建议您编译并运行一次。如果遇到问题，可以参见我们的 [常见问题](https://write.woa.com/document/86735803151626240)。如果问题仍未解决，您可以尝试运行我们的 [Example](https://github.com/Tencent-RTC/TUICallKit/tree/main/iOS/Example) 工程。在接入和使用过程中，如果遇到问题，欢迎向我们 [反馈](https://github.com/Tencent-RTC/TUICallKit/issues)。


## 步骤三：工程配置

使用音视频功能，需要授权摄像头和麦克风的使用权限，请根据实际项目需要，设置项目所需权限。
1. 在 **Xcode** 中，选择 **TARGETS** > **Info** > **Custom iOS Target Properties **菜单。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/dff319e0169e11ef9c015254002977b6.png)

2. 单击 **+**，添加摄像头和麦克风权限。

- `Privacy - Camera Usage Description`

- `Privacy - Microphone Usage Description`


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/2a4a2246169e11efa66f525400f65c2a.png)


   

## 步骤四：登录 TUI 组件


   在您的项目中添加如下代码，它的作用是通过调用 TUICore 中的相关接口完成 TUI 组件的登录。这一步骤至关重要，只有在成功登录之后，您才能正常使用 TUICallKit 提供的各项功能。


   


【Swift】
``` swift
import TUICore
import TUICallKit_Swift

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
    let userID = "denny"       // 请替换为您的 UserId
    let sdkAppID: Int32 = 0    // 请替换为第一步在控制台得到的 SDKAppID
    let secretKey = "****"     // 请替换为第一步在控制台得到的 SecretKey

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
    
    NSString *userID = @"denny";     // 请替换为您的 UserId
    int sdkAppID = 0;                // 请替换为第一步在控制台得到的 SDKAppID
    NSString *secretKey = @"****";   // 请替换为第一步在控制台得到的 SecretKey

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
<td rowspan="1" colSpan="1" >参数</td>

<td rowspan="1" colSpan="1" >类型</td>

<td rowspan="1" colSpan="1" >说明</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >客户根据自己的业务自定义用户 ID，只允许包含大小写英文字母(a-z A-Z)、数字(0-9)及下划线和连词符。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppID</td>

<td rowspan="1" colSpan="1" >Int32</td>

<td rowspan="1" colSpan="1" >在 [实时音视频 TRTC 控制台](https://console.cloud.tencent.com/trtc) 创建的音视频应用的唯一标识 SDKAppID。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >secretKey</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >在 [实时音视频 TRTC 控制台](https://console.cloud.tencent.com/trtc) 创建的音视频应用的 SDKSecretKey。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >一种安全保护签名，用于对用户进行登录鉴权认证，确认用户是否真实，阻止恶意攻击者盗用您的云服务使用权。</td>
</tr>
</table>
   

   > **注意：**
   > 
>   - **开发环境**：如果您处于本地开发调试阶段，可以使用本地 GenerateTestUserSig.genTestSig 函数生成 userSig。但请注意，该方法中的 secretKey 容易被反编译逆向破解。一旦密钥泄露，攻击者可能盗用您的腾讯云流量。
>   - **生产环境**：如果您的项目要发布上线，请采用 [服务端生成 UserSig](https://write.woa.com/document/86735811695435776) 的方式。


## 步骤五：拨打您的第一通电话

通过调用 TUICallKit 的 [calls](https://write.woa.com/document/86735802543452160) 函数并指定通话类型和被叫方的 userId，就可以发起语音或者视频通话。




【Swift】
``` swift
import TUICallKit_Swift
import RTCRoomEngine

// 发起1对1语音通话(假设 userId 为 mike)
TUICallKit.createInstance().calls(userIdList: ["mike"], callMediaType: .audio, params: nil) {

} fail: { code, message in
 
}
```


【Objective-C】
``` objectivec
#import <TUICallKit_Swift/TUICallKit_Swift-Swift.h>
#import <RTCRoomEngine/TUICallEngine.h>

// 发起1对1语音通话(假设 userId 为 mike)
[[TUICallKit createInstance] calls:@[@"mike"] callMediaType:TUICallMediaTypeAudio params:NULL succ:^{
} fail:^(int code, NSString * _Nullable errMsg) {
}];
```
<table>
<tr>
<td rowspan="1" colSpan="1" >主叫方</td>

<td rowspan="1" colSpan="1" >被叫方</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/8f167425190111efac7f5254007bbd8c.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027164818/91efdadf190111efa1975254005ac0ca.png)</td>
</tr>
</table>


## 更多特性
- [界面定制](https://write.woa.com/document/86735802112499712)

- [离线推送](https://write.woa.com/document/86735802219454464)

- [多人通话](https://write.woa.com/document/139754164343910400)

- [悬浮窗](https://write.woa.com/document/139754329641431040)

- [美颜特效](https://write.woa.com/document/116004088855900160)

- [自定义铃声](https://write.woa.com/document/139754577364488192)

- [监听通话状态](https://write.woa.com/document/139754713712799744)

- [云端录制](https://write.woa.com/document/89008877934485504)


## 常见问题

如果您的接入和使用中遇到问题，请参见 [常见问题](https://write.woa.com/document/86735803151626240)。

## 交流与反馈
- 如果您在使用过程中，有什么建议或者意见，可以在这里反馈：[TUICallKit 产品反馈问卷](https://wj.qq.com/s2/10796805/6960/)，感谢您的反馈。

- 如果您是开发者，也欢迎您加入我们的 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，进行技术交流和产品沟通。

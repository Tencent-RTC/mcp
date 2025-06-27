本文将引导您快速地完成 TUICallKit 组件的接入工作。跟随本文档，您可以在10分钟内完成接入，并最终获得一个具备完整用户界面以及音视频通话功能的应用程序。
<table>
<tr>
<td rowspan="1" colSpan="1" >视频通话</td>

<td rowspan="1" colSpan="1" >群组通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/f5820542180c11ef9c015254002977b6.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/c772c312180c11efa66f525400f65c2a.png)</td>
</tr>
</table>


## 环境准备

Flutter 3.0 及更高版本。

## 步骤一：开通服务

在使用腾讯云提供的音视频服务前，您需要前往控制台，为应用开通音视频服务，获取 `SDKAppID、SDKSecretKey`，它们将在 [步骤五](https://write.woa.com/document/94733646108913664) 中使用，具体步骤请参见 [开通服务。](https://write.woa.com/document/139743928960860160)

## 步骤二：导入 TUICallKit 组件

在工程的根目录下，通过命令行执行以下命令安装组件 [tencent_calls_uikit](https://pub.dev/packages/tencent_calls_uikit) 插件。
``` bash
flutter pub add tencent_calls_uikit
```

## 步骤三：完成工程配置



【Android】
1. 如果您需要编译运行在 Android 平台，由于我们在 SDK 内部使用了Java 的反射特性，需要将 SDK 中的部分类加入不混淆名单。

  - 首先，需要在工程的 `android/app/build.gradle` 文件中配置并开启混淆规则：

``` java
  android {
    ......
    buildTypes {  
        release {  
            ......
            minifyEnabled true  
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'  
        } 
    }
}
```
  - 在工程的 `android/app` 目录下创建 `proguard-rules.pro` 文件，并 `proguard-rules.pro` 文件中添加如下代码：

``` java
-keep class com.tencent.** { *; }
```
2. 在工程的 `android/app/build.gradle `文件中配置开启 Multidex 支持。

``` java
  android {  
    ......
    defaultConfig {
      ......
      multiDexEnabled true
    } 
}
```

【iOS】

由于 TUICallKit 会使用 iOS 的音视频功能，您需要授权麦克风和摄像头的使用权限。

授权操作方法：在您的 iOS 工程的 `Info.plist` 的第一级`<dict>`目录下添加以下两项，分别对应麦克风和摄像头在系统弹出授权对话框时的提示信息。
``` java
<key>NSCameraUsageDescription</key>
<string>CallingApp需要访问您的相机权限，开启后录制的视频才会有画面</string>
<key>NSMicrophoneUsageDescription</key>
<string>CallingApp需要访问您的麦克风权限，开启后录制的视频才会有声音</string>
```

## 步骤四：设置 navigatorObservers

在 Flutter 应用框架的 navigatorObservers 中添加 TUICallKit.navigatorObserver，以 MateriaApp 框架为例，代码如下：
``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';

 ......

class XXX extends StatelessWidget {
  const XXX({super.key});

 @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorObservers: [TUICallKit.navigatorObserver],
      ......
    );
  }
}
```

## 步骤五：登录 TUICallKit 组件

使用 [login](https://write.woa.com/document/94733520019521536) 接口完成登录，具体使用可参考如下代码：
``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
import 'package:tencent_calls_uikit/debug/generate_test_user_sig.dart';
......

final String userID    = 'xxxxx';  // 请替换为您的UserId
final int    sdkAppID  = 0;        // 请替换为第一步在控制台得到的SDKAppID
final String secretKey = 'xxxx';   // 请替换为第一步在控制台得到的SecretKey

void login() async {
    String userSig  = GenerateTestUserSig.genTestSig(userID, sdkAppID, secretKey);
    TUIResult result = await TUICallKit.instance.login(sdkAppID, userID, userSig);
    if (result.code.isEmpty) {
      print('Login success');
    } else {
      print('Login failed: ${result.code} ${result.message}');
    }
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

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >在 [实时音视频 TRTC 控制台](https://console.cloud.tencent.com/trtc) 创建的音视频应用的唯一标识。</td>
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
> - **开发环境**：如果您正在本地开发调试阶段，可以采用本地 `GenerateTestUserSig.genTestSig`函数生成 userSig。该方法中 SDKSecretKey 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量。
> - **生产环境**：如果您的项目要发布上线，请采用 [服务端生成 UserSig](https://write.woa.com/document/86735811695435776) 的方式。


## 步骤六：拨打您的第一通电话

主叫方与被叫方登录成功后，主叫方通过调用 TUICallKit 的 calls 方法并指定通话类型和被叫方的 userId，就可以发起语音或者视频通话，被叫方此时就可接受到来电邀请。
``` java
import 'package:tencent_calls_uikit/tencent_calls_uikit.dart';
......

void call() {
    List<String> userIdList = ['vince'];
    TUICallKit.instance.calls(userIdList, TUICallMediaType.audio);
}
```
<table>
<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/5bc23051ec0a11eea93552540076ba55.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/585e90f5ec0a11eeb5dc525400aa857d.png)</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >主叫方</td>

<td rowspan="1" colSpan="1" >被叫方</td>
</tr>
</table>


## 更多特性
- [界面定制](https://write.woa.com/document/119102241864011776)

- [离线推送](https://write.woa.com/document/105314040792334336)

- [群组通话](https://write.woa.com/document/139754164343910400)

- [悬浮窗](https://write.woa.com/document/139754329641431040)

- [美颜特效](https://write.woa.com/document/116004083654770688)

- [自定义铃声](https://write.woa.com/document/139754559410786304)

- [监听通话状态](https://write.woa.com/document/139754713712799744)

- [云端录制](https://write.woa.com/document/89008877934485504)


## 常见问题

如果您的接入和使用中遇到问题，请参见 [常见问题](https://write.woa.com/document/98788861869330432)。

## 交流与反馈
- 如果您在使用过程中，有什么建议或者意见，可以在这里反馈：[TUICallKit 产品反馈问卷](https://wj.qq.com/s2/10622244/b9ae)，感谢您的反馈。

- 如果您是开发者，也欢迎您加入我们的 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，进行技术交流和产品沟通。

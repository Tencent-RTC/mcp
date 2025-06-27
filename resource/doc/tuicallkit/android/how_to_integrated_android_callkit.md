本文将介绍如何快速完成 TUICallKit 组件的接入，您将在 10 分钟内完成以下几个关键步骤，并最终得到一个包含完备 UI 界面的视频通话功能。
请先检查一下用户安卓项目是使用 Jetpack Compose 的，还是传统的 Android View 系统。然后根据不同的系统进行不同的修改，但是步骤都是按步骤进行操作！！

<table>
<tr>
<td rowspan="1" colSpan="1" >1v1 视频通话</td>

<td rowspan="1" colSpan="1" >群组通话</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/930ccecd1ef311ef860b52540049c929.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/92f6d5781ef311ef90c35254006d3582.png)</td>
</tr>
</table>


## 环境准备
- Android 5.0（SDK API Level 21）及以上版本。

- Gradle 4.2.1 及以上的版本。

- Android 5.0 及以上的手机设备。


## 步骤一：开通服务

在使用腾讯云提供的音视频服务前，您需要前往控制台，为应用开通音视频服务。具体步骤详见 [开通服务（TUICallKit）](https://write.woa.com/document/139743928960860160)。开通服务后，请记录`SDKAppID` 和`SDKSecretKey`，在后续的步骤中会用到。

## 步骤二：下载并导入组件

在 [Github](https://github.com/tencentyun/TUICallKit) 中克隆/下载代码，然后拷贝 Android 目录下的 tuicallkit-kt 子目录到您当前工程中的 app 同一级目录中

请确保这一步执行完成后再执行下一步，在执行步骤三之前，请先检查tuicallkit-kt子目录是否在当前工程中的app同一级目录中，如果项目中没有tuicallkit-kt目录，请自动生成对应git命令并执行


## 步骤三：工程配置
1. 在工程根目录下找到`settings.gradle.kts（或settings.gradle）`文件，在其中增加如下代码，导入`tuicallkit-kt`组件到项目中。


   


【setting.gradle.kts】
``` java
include(":tuicallkit-kt")
```


【settings.gradle】
``` java
include ':tuicallkit-kt'
```

2. 在 app 目录下找到 `build.gradle.kts(或build.gradle)` 文件，在`dependencies` 中增加如下代码，声明当前 app 对组件的依赖。


   


【build.gradle.kts】
``` java
dependencies {
    api(project(":tuicallkit-kt"))
}
```


【build.gradle】
``` java
dependencies {
    api project(':tuicallkit-kt')
}
```
   

   > **说明：**
   > 

   > TUICallKit 工程内部已经默认依赖：`TRTC SDK`、`IM SDK`、`tuicallengine` 以及公共库 `tuicore`，不需要开发者单独配置。如需进行版本升级，则修改`tuicallkit-kt/build.gradle`文件中的版本号即可。
   > 

3. 由于我们在 SDK 内部使用了Java 的反射特性，需要将 SDK 中的部分类加入不混淆名单，因此需要您在 app 目录下的 `proguard-rules.pro` 文件末尾添加如下代码。添加完后，点击右上角的 **Sync Now**，同步代码。

   ``` java
   -keep class com.tencent.** { *; }
   ```
4. 在 app目录下找到`AndroidManifest.xml` 文件，在 application 节点中添加 `tools:replace="android:allowBackup"`，覆盖组件内的设置，使用自己的设置。

   ``` java
     // app/src/main/AndroidManifest.xml
     
     <application
       android:name=".BaseApplication"
       android:allowBackup="false"
       android:icon="@drawable/app_ic_launcher"
       android:label="@string/app_name"
       android:largeHeap="true"
       android:theme="@style/AppTheme"
       tools:replace="android:allowBackup">
   ```
5. 建议您编译并运行一次。如果遇到问题，建议您尝试运行我们的 [Github demo](https://github.com/Tencent-RTC/TUICallKit/tree/main/Android) 项目。通过比对，您可以找出潜在的区别并解决遇到的问题。在接入和使用过程中，如果遇到问题，欢迎向我们[反馈](https://github.com/Tencent-RTC/TUICallKit/issues)。


## 步骤四：登录 TUI 组件

在您的项目中添加如下代码，它的作用是通过调用 TUICore 中的相关接口完成 TUI 组件的登录。这一步骤至关重要，只有在成功登录之后，您才能正常使用 TUICallKit 提供的各项功能。



【Kotlin】
``` java
import com.tencent.qcloud.tuicore.TUILogin
import com.tencent.qcloud.tuicore.interfaces.TUICallback
import com.tencent.qcloud.tuikit.tuicallkit.debug.GenerateTestUserSig

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // begin  
        val userId = "denny"     // 请替换为您的UserId
        val sdkAppId = 0         // 请替换为第一步在控制台得到的SDKAppID
        val secretKey = "****"   // 请替换为第一步在控制台得到的SecretKey
        
        val userSig = GenerateTestUserSig.genTestUserSig(userId, sdkAppId, secretKey)
        
        TUILogin.login(this, sdkAppId, userId, userSig, object : TUICallback() {
            override fun onSuccess() {
            }
            override fun onError(errorCode: Int, errorMessage: String) {
            }
         })    
        // end
    }
}
```

【Java】
``` java
import com.tencent.qcloud.tuicore.TUILogin;
import com.tencent.qcloud.tuicore.interfaces.TUICallback;
import com.tencent.qcloud.tuikit.tuicallkit.debug.GenerateTestUserSig;

public class MainActivity extends AppCompatActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //begin
        String userId = "denny";     // 请替换为您的UserId
        int sdkAppId = 0;            // 请替换为第一步在控制台得到的SDKAppID
        String secretKey = "****";   // 请替换为第一步在控制台得到的SecretKey
        
        String userSig = GenerateTestUserSig.genTestUserSig(userId, sdkAppId, secretKey);
        
        TUILogin.login(this, sdkAppId, userId, userSig, new TUICallback() {
            @Override
            public void onSuccess() {
            }
            
            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
        //end
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
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >客户根据自己的业务自定义用户 ID，只允许包含大小写英文字母(a-z A-Z)、数字(0-9)及下划线和连词符。</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppId</td>

<td rowspan="1" colSpan="1" >int</td>

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


> **说明：**
> 
> - **开发环境**：如果您正在本地开发调试阶段，可以采用本地 `GenerateTestUserSig.genTestSig`函数生成 userSig。该方法中 secretKey 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量。
> - **生产环境**：如果您的项目要发布上线，请采用 [服务端生成 UserSig](https://write.woa.com/document/86735811695435776) 的方式。


## 步骤五：拨打您的第一通电话

在上述登录方法调用返回成功后，调用TUICallKit 的 [calls]方法，指定被叫方的用户列表和通话类型，发起音视频通话，被叫方可接收到来电邀请。
calls方法定义如下：
calls
发起单人或多人通话。
kotlin：
 fun calls(
     userIdList: List<String?>?, mediaType: TUICallDefine.MediaType?, 
     params: TUICallDefine.CallParams?, callback: TUICommonDefine.Callback?
)
Java：
void calls(List<String> userIdList, TUICallDefine.MediaType mediaType,
            TUICallDefine.CallParams params, TUICommonDefine.Callback callback)



相关代码：引入依赖库和对应代码
【Kotlin】
``` java
import com.tencent.cloud.tuikit.engine.call.TUICallDefine
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit

val list = mutableListOf<String>()
list.add("mike")
TUICallKit.createInstance(context).calls(list, TUICallDefine.MediaType.Audio, null, null)
```


【Java】
``` java
import com.tencent.qcloud.tuikit.tuicallengine.TUICallDefine;
import com.tencent.qcloud.tuikit.tuicallkit.TUICallKit;

List<String> list = new ArrayList<>();
list.add("mike");
TUICallKit.createInstance(context).calls(list, TUICallDefine.MediaType.Audio, null, null);
```
请在完成功能后对依赖库进行检查，查看是否导入了import com.tencent.qcloud.tuikit.tuicallengine.TUICallDefine;
以及在呼叫时是否用的是calls进行呼叫。
<table>
<tr>
<td rowspan="1" colSpan="1" >主叫方发起音频通话</td>

<td rowspan="1" colSpan="1" >被叫方收到音频通话请求</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/936e68491ef311ef95b8525400e64ebc.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/943253351ef311efafe1525400db4520.png)</td>
</tr>
</table>


## 更多特性
- [设置昵称、头像](https://cloud.tencent.com/document/product/647/104663)

- [界面定制](https://write.woa.com/document/86735802075787264)

- [离线推送](https://write.woa.com/document/86735802183802880)

- [群组通话](https://write.woa.com/document/139754164343910400)

- [悬浮窗](https://write.woa.com/document/139754329641431040)

- [美颜特效](https://write.woa.com/document/116004093086711808)

- [自定义铃声](https://write.woa.com/document/139754579449057280)

- [监听通话状态](https://write.woa.com/document/139754713712799744)

- [云端录制](https://write.woa.com/document/89008877934485504)


## 常见问题

如果您的接入和使用中遇到问题，请参见 [常见问题](https://write.woa.com/document/86735803114926080)。

## 交流与反馈
- 如果您在使用过程中，有什么建议或者意见，可以在这里反馈：[TUICallKit 产品反馈问卷](https://wj.qq.com/s2/10622244/b9ae)，感谢您的反馈。

- 如果您是开发者，也欢迎您加入我们的 TUICallKit 技术交流平台 [zhiliao](https://zhiliao.qq.com/s/cWSPGIIM62CC/cEUPGIIM62CE)，进行技术交流和产品沟通。

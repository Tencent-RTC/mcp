This article will guide you through the quick integration of the TUICallKit component. You will complete several key steps within 10 minutes, ultimately obtaining a video call feature with a complete UI interface.
<table>
<tr>
<td rowspan="1" colSpan="1" >1v1 Video Call</td>

<td rowspan="1" colSpan="1" >Group call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/eb424eb7190311ef8a48525400762795.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/eb45d2e8190311efa1975254005ac0ca.png)</td>
</tr>
</table>


## Environment Preparations
- Android 5.0 (SDK API level 21) or later.

- Gradle 4.2.1 or later

- Mobile phone on Android 5.0 or later.


## Step 1. Activate the service

Before using the Audio and Video Services provided by Tencent Cloud, you need to go to the Console and activate the service for your application. For detailed steps, refer to [Activate Service](https://write.woa.com/document/140196392040579072). Please record the `SDKAppID` and `SDKSecretKey`, they will be used for the following steps.

## Step 2. Download and import the component

Go to [GitHub](https://github.com/tencentyun/TUICalling), clone or download the code, and copy the `tuicallkit-kt` subdirectory in the `Android` directory to the directory at the same level as `app` in your current project, as shown below.

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/730f6f49e10a11eeb419525400ea3514.png)


## Step 3. Configure the project
1. Find the `settings.gradle.kts(or settings.gradle)` file in the project root directory and add the following code to import the `tuicallkit-kt` component.


   


【setting.gradle.kts】
``` java
include(":tuicallkit-kt")
```


【settings.gradle】
``` java
include ':tuicallkit-kt'
```

2. Find the `build.gradle.kts`(or `build.gradle`) file in the `app` directory, add the following code to its `dependencies` section. This is to declare the current app's dependency on the newly added components.


   


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
   

   > **Note:**
   > 

   > The `TUICallKit` project depends on `TRTC SDK`, `Chat SDK`, `tuicallengine`, and the `tuicore` public library internally by default. To upgrade the version, modify the version in `tuicallkit-kt/build.gradle` file.
   > 

3. Since the SDK uses Java's reflection feature internally, you need to add certain classes in the SDK to the obfuscation allowlist. Therefore, you should add the following code to the `proguard-rules.pro` file in the `app` directory. After adding, click on the upper right corner "**Sync Now**" to synchronize the code.

   ``` java
   -keep class com.tencent.** { *; }
   ```
4. In the app directory, find the `AndroidManifest.xml` file and add `tools:replace="android:allowBackup"` within the application node to override the settings inside the components, using your own settings.

   ``` java
     // app/src/main/AndroidManifest.xml
     
     <application
       android:name=".DemoApplication"
       android:allowBackup="false"
       android:icon="@drawable/app_ic_launcher"
       android:label="@string/app_name"
       android:largeHeap="true"
       android:theme="@style/AppTheme"
       tools:replace="android:allowBackup">
   ```
5. We suggest you compile and run once. If you encounter any issues, you may try our [Github demo](https://github.com/Tencent-RTC/TUICallKit/tree/main/Android). By comparison, you can identify potential differences and resolve encountered issues. During integration and use, if any issues arise, you are welcome to provide [feedback](https://github.com/Tencent-RTC/TUICallKit/issues) to us.


## Step 4. Log in to the TUICallKit component

Add the following code to your project. It works by calling the relevant interfaces in TUICore to complete the login to TUI Component. This step is very important, only after successfully logging in, you can normally use the features offered by TUICallKit.



【Kotlin】
``` java
import com.tencent.qcloud.tuicore.TUILogin
import com.tencent.qcloud.tuicore.interfaces.TUICallback
import com.tencent.qcloud.tuikit.tuicallkit.debug.GenerateTestUserSig

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // begin  
        val userID = "denny"     // Please replace with your UserId
        val sdkAppID = 0         // Please replace with the SDKAppID obtained from the console in step 1
        val secretKey = "****"   // Please replace with the SecretKey obtained from the console in step 1
        
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
        String userID = "denny";     // Please replace with your UserId
        int sdkAppID = 0;            // Please replace with the SDKAppID obtained from the console in step 1
        String secretKey = "****";   // Please replace with the SecretKey obtained from the console in step 1
        
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
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >your own User ID based on your business. It can only include letters (a-z, A-Z), digits (0-9), underscores, and hyphens.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppId</td>

<td rowspan="1" colSpan="1" >int</td>

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
> - **Development Environment**: During local development and debugging, use the local `GenerateTestUserSig.genTestSig` function to create a userSig. But be careful, the SDKSecretKey can be decompiled and reverse-engineered. If leaked, it could allow theft of your Tencent Cloud traffic.
> - **Production Environment**: If your project is going to be launched, please adopt the method of [Server-side Generation of UserSig](https://www.tencentcloud.com/document/product/647/35166).


## Step 5. Make your first phone call

After user login success,  invoke the [calls](https://write.woa.com/document/95824745037205504) method  of TUICallKit, specifying the callee's userID and the type of call, to initiate an audio/video call. The callee will receive an incoming call invitation.




【Kotlin】
``` java
import com.tencent.qcloud.tuikit.tuicallengine.TUICallDefine
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
list.add("mike")
TUICallKit.createInstance(context).calls(list, TUICallDefine.MediaType.Audio, null, null);
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Caller initiates an audio call</td>

<td rowspan="1" colSpan="1" >Callee receives an audio call request</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/078b6eea190411ef8a48525400762795.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/077a2a05190411ef88ad5254002977b6.png)</td>
</tr>
</table>


## 

## Additional Features
- [Setting Nickname, Avatar](https://write.woa.com/document/140283519901868032)

- [Customize Interface](https://write.woa.com/document/95821305653407744)

- [Offline Push](https://write.woa.com/document/95821638488313856)

- [Group Call](https://write.woa.com/document/140196498678116352)

- [Floating Window](https://write.woa.com/document/140196506800930816)

- [Custom Ringtone](https://write.woa.com/document/140196520174002176)

- [Call Status Monitoring](https://write.woa.com/document/140196527978475520)

- [Cloud Recording](https://write.woa.com/document/95824491274473472)


## FAQs

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://write.woa.com/document/145196717502525440).

## Suggestions and Feedback

If you have any suggestions or feedback, please contact `info_rtc@tencent.com`.

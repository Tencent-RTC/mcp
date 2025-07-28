This article will guide you through the process of integrating the TUICallKit component quickly. By following this documentation, you can complete the access work in just 10 minutes and ultimately obtain an application with a complete user interface as well as audio and video calling features.
<table>
<tr>
<td rowspan="1" colSpan="1" >Video Call</td>

<td rowspan="1" colSpan="1" >Group call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/1390039d18d011ef9ff4525400f65c2a.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027182394/4cd1634b18ce11efb8185254005ac0ca.png)</td>
</tr>
</table>


## Environment Preparations
- [Node.js](https://nodejs.org/en/) version 16+.

- two Mobile phone.


## Step 1. Activate the service

Refer to [Activate the Service](https://trtc.io/document/59832?platform=web&product=call) to obtain `SDKAppID, SDKSecretKey`, which will be used as **Mandatory Parameters in **[Initialize the TUICallKit](https://write.woa.com/document/133160392291844096)**.**

## Step 2. Download the TUICallKit
1. Download the [@tencentcloud/call-uikit-react-native](https://www.npmjs.com/package/@tencentcloud/call-uikit-react) component.

   
   
   【shell】
   ``` bash
   yarn add @tencentcloud/call-uikit-react-native
   ```
2. Copy the `debug` directory to your project directory `src/debug`, it is necessary when generating userSig locally.


   


【MacOS】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-react-native/src/debug ./src
```


【Windows】
``` bash
xcopy node_modules\@tencentcloud\call-uikit-react\src\debug .\src\debug /i /e
```


## Step 3. Login the TUICallKit

You can choose to import the sample code in the `/src/App.tsx` file.
1. Import the call uikit.

   ``` javascript
   import { TUICallKit, MediaType } from '@tencentcloud/call-uikit-react-native';
   import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; // Refer to Step 2.2
   ```
2. using the [TUICallKit.login](https://write.woa.com/document/162412491425603584) API to log in to the component, you need to `fill in``SDKAppID, SDKSecretKey `as two parameters in the code.

   ``` javascript
     const handleLogin = async () => {
       const userId = "denny";     // Please replace with your userId
       const SDKAppID = 0;         // Please replace with the SDKAppID obtained from step 1
       const SecretKey = "****";   // Please replace with the SDKSecretKey obtained from step 1
       
       const { userSig } = genTestUserSig({ userID: userId, SDKAppID, SecretKey });
   
       TUICallKit.login(
         {
           sdkAppId: SDKAppID,
           userId,
           userSig,
         },
         (res) => {},
         (errCode, errMsg) => {}
       );
     };
   ```
<table>
<tr>
<td rowspan="1" colSpan="1" >**Parameter**</td>

<td rowspan="1" colSpan="1" >**Type**</td>

<td rowspan="1" colSpan="1" >**Note**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >**Unique identifier of the user, **`defined by you`**, **it is allowed to contain only upper and lower case letters (a-z, A-Z), numbers (0-9), underscores, and hyphens.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKAppID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >The unique identifier for the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SecretKey</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The SDKSecretKey of the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >A security protection signature used for user log in authentication to confirm the user's identity and prevent malicious attackers from stealing your cloud service usage rights.</td>
</tr>
</table>
   

   > **Explanation of userSig:**
   > 
>   - **Development environment:** If you are running a demo locally and developing debugging, you can use the `genTestUserSig` (Refer to Step 3.2) function in the debug file to generate a `userSig`. In this method, SDKSecretKey is vulnerable to decompilation and reverse engineering. Once your key is leaked, attackers can steal your Tencent Cloud traffic.
>   - **Production environment: **If your project is going live, please use the [Server-side Generation of UserSig](https://trtc.io/document/35166) method.


## Step 4. Make your first call
1. using the [TUICallKit.call API](https://write.woa.com/document/162412580951224320) to make a call.

   ``` javascript
   //【3】Make a 1v1 video call
   const users: string[] = ["mike"];
   const call = async () => {
     await TUICallKit.calls({
       userID: users,
       mediaType: MediaType.Video,
     });
   };
   ```
2. **After both userID login to successfully**,  make a call..

<table>
<tr>
<td rowspan="1" colSpan="1" >Caller initiates an audio call</td>

<td rowspan="1" colSpan="1" >Callee receives an audio call request</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/078b6eea190411ef8a48525400762795.png)<br></td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100027119876/077a2a05190411ef88ad5254002977b6.png)</td>
</tr>
</table>


## FAQs
- If you encounter any problems with access and use, please refer to [FAQs](https://trtc.io/document/51024?platform=web&product=call).

- If you have any requirements or feedback, you can contact: info_rtc@tencent.com.

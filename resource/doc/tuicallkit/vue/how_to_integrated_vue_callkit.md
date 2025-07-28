This article will guide you through the quick integration of the TUICallKit component. You will complete several key steps within 10 minutes, ultimately obtaining a video call feature with a complete UI interface.

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/ace7b80f181f11ef9c015254002977b6.png)

## Prerequisites
- [Node.js](https://nodejs.org/en/) version 16+.

- Modern browser, supporting WebRTC APIs.


## Step 1. Activate the service

Refer to [Activate the Service](https://trtc.io/document/59832?platform=web&product=call) to obtain `SDKAppID, SDKSecretKey`, which will be used as** Mandatory Parameters in **[Initialize the TUICallKit](https://write.woa.com/document/95734407106699264).

## Step 2. Download the TUICallKit
1. Download the [@tencentcloud/call-uikit-vue](https://www.npmjs.com/package/@tencentcloud/call-uikit-vue) component.

   ``` bash
   npm install @tencentcloud/call-uikit-vue
   ```
2. Copy the `debug` directory to your project directory `src/debug`, it is necessary when generating userSig locally.


   


【MacOS】
``` bash
cp -r node_modules/@tencentcloud/call-uikit-vue/debug ./src
```


【Windows】
``` html
xcopy node_modules\@tencentcloud\call-uikit-vue\debug .\src\debug /i /e
```


## Step 3. Initialize the TUICallKit

You can choose to import the sample code in the `src/App.vue` file.The example code uses the `Composition API` approach.
1. using [<TUICallKit />](https://trtc.io/document/51015#init#tuicallkit), which contains the complete UI interaction during a call.

   ``` html
   <template>
     <span> caller's ID: </span>
     <input type="text" v-model="callerUserID"> 
     <button @click="init"> step1. init </button> <br>
     <span> callee's ID: </span>
     <input type="text" v-model="calleeUserID">
     <button @click="call"> step2. call </button>
     
     <!--【1】Import the TUICallKit component: Call interface UI -->
     <TUICallKit style="width: 650px; height: 500px " />
   </template>
   ```
2. using the [TUICallKitServer.init](https://trtc.io/document/51015#init) API to log in to the component, you need to `fill in``SDKAppID, SDKSecretKey`** as two parameters in the code.**

   ``` javascript
   <script setup> // lang='ts'
   import { ref } from 'vue';
   import { TUICallKit, TUICallKitServer, TUICallType } from "@tencentcloud/call-uikit-vue";
   import * as GenerateTestUserSig from "./debug/GenerateTestUserSig-es"; // Refer to Step 2.3
   
   const SDKAppID = 0;       // TODO: Replace with your SDKAppID (Notice: SDKAppID is of type number）
   const SDKSecretKey = '';  // TODO: Replace with your SDKSecretKey
   
   const callerUserID = ref('');
   const calleeUserID = ref('');
   
   //【2】Initialize the TUICallKit component
   const init = async () => {
     const { userSig } = GenerateTestUserSig.genTestUserSig({
       userID: callerUserID.value, 
       SDKAppID,
       SecretKey: SDKSecretKey 
     });
     await TUICallKitServer.init({
       userID: callerUserID.value, 
       userSig, 
       SDKAppID,
     });
     alert('TUICallKit init succeed');
   }
   </script>
   ```
<table>
<tr>
<td rowspan="1" colSpan="1" >**Parameter**</td>

<td rowspan="1" colSpan="1" >**Type**</td>

<td rowspan="1" colSpan="1" >**Note**</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userID</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >**Unique identifier of the user, **`defined by you`**, **it is allowed to contain only upper and lower case letters (a-z, A-Z), numbers (0-9), underscores, and hyphens.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKAppID</td>

<td rowspan="1" colSpan="1" >Number</td>

<td rowspan="1" colSpan="1" >The unique identifier for the audio and video application created in the [Tencent RTC Console](https://console.trtc.io/).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >SDKSecretKey</td>

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
1. using the [TUICallKitServer.calls API](https://trtc.io/document/51015#calls) to make a call.

   ``` javascript
   //【3】Make a 1v1 video call
   const call = async () => {
     await TUICallKitServer.calls({
       userIDList: [calleeUserID.value],
       type: TUICallType.VIDEO_CALL,
     }); 
   };
   ```
2. Run the project.
   

   > **Warning: **
   > 

   > **For local environment, please access under **`localhost protocol`**. For public network experience, please access under HTTPS protocol. For details, see **[Description of Network Access Protocol](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-05-info-browser.html#h2-3)**.**
   > 

3. Open two browser pages,** enter different userID(defined by you) **click `step1. init` to login (caller and callee).


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/601ba223668811efbd54525400f69702.png)

4. **After both userID init to successfully**, click on` step2. call`to make a call. If you have a call problem, refer to [FAQs](https://trtc.io/document/51024?platform=android&product=call#create_userID).


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/5dbee027668811efbd54525400f69702.png)


## Additional Features
- [Setting Nickname, Avatar](https://trtc.io/document/59834?platform=web&product=call)

- [Group Call](https://trtc.io/document/59838?platform=web&product=call)

- [Floating Window](https://trtc.io/document/59842?platform=web&product=call)

- [Custom Ringtone](https://trtc.io/document/59847?platform=web&product=call)

- [Call Status Monitoring, Component Callback Event](https://trtc.io/document/59852?platform=web&product=call)

- [Setting Resolution, Fill Pattern](https://trtc.io/document/59835?platform=web&product=call)

- [Customize Interface](https://trtc.io/document/50997?platform=web&product=call)


## FAQs
- If you encounter any problems with access and use, please refer to [FAQs](https://trtc.io/document/51024?platform=web&product=call).

- If you have any requirements or feedback, you can contact: info_rtc@tencent.com.

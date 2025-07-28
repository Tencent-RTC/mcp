This article will guide you on how to quickly run through the Audio and Video Call Demo. By following this document, you can have the Demo up and running in 10 minutes, and ultimately experience an Audio and Video Call feature with a complete UI interface.
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


## Environment preparations
- Xcode 13 or later.

- Two iOS 13.0 or later devices.


## Step 1: Download the Demo
1. Download the [TUICallKit Demo](https://github.com/Tencent-RTC/TUICallKit/tree/main) source code from GitHub, or directly run the following command in the command line:

   ``` bash
     git clone 
   ```
2. Enter the iOS project directory in the command line:

   ``` plaintext
     cd TUICallKit/iOS/Example
   ```
3. Load the dependency library:

   ``` plaintext
     pod install
   ```   

   > **Note:**
   > 

   > If you haven't installed CocoaPods, you can refer to [this](https://guides.cocoapods.org/using/getting-started.html) for instructions on how to install.
   > 


## Step 2: Configure the Demo
1. [Activate the audio and video services](https://write.woa.com/document/140196392040579072), to obtain the **SDKAppID** and **SDKSecretKey**.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/54ae79bd126311ef9af4525400720cb5.png)

2. Open the `/iOS/Example/Debug/GenerateTestUserSig.swift` file and enter the SDKAppID and SDKSecretKey obtained when [activating the service](https://write.woa.com/document/140196392040579072):


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/5510e016126311ef9fa952540019e87e.png)


## Step 3: Running the Demo
1. In XCode, select the device you want to run the Demo on as shown below:


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/54b99a2c126311ef9af4525400720cb5.png)

2. After selection, click run to deploy our TUICallKit iOS Demo to the target device.


## Make the first call

> **Note:**
> 

> To experience the complete audio and video calling process, please log into the Demo on two devices as two different users, with one acting as the caller and the other as the callee.
> 

1. Log in & Signup


   Please enter the ID at the `User ID`. If your current User ID has not been used before, you will be taken to the **Signup** screen, where you can set your own avatar and nickname.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/e23a537b1e6a11ef91395254000a29ac.png)
   

   > **Note:**
   > 

   > Try to avoid setting your User ID to simple strings like "1", "123", "111", as TRTC does not support the same User ID being logged into from multiple devices. Such User IDs like "1", "123", "111" are easily occupied by your colleagues during collaborative development, leading to login failures. Therefore, we recommend setting highly recognizable User IDs while debugging.
   > 

2. Make a phone call

  1. The caller should click **1V1 Call** on the interface, enter the callee's User ID in the pop-up interface, and select the desired call type.

  2. Click **Initiate Call**.


      ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/e9161c071e6a11ef860b52540049c929.png)

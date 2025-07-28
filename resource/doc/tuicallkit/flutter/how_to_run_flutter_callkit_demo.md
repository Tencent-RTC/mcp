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

### Flutter

Flutter 3.0 or later.

### Android 
- Android Studio 3.5 or above.

- Android devices with Android 4.1 or higher versions.


### iOS
- Xcode 13.0 or above.

- Please ensure your project is set up with a valid developer signature.


## Step 1: Download the Demo
1. Download the [TUICallKit Demo](https://github.com/Tencent-RTC/TUICallKit/tree/main) source code from GitHub, or directly run the following command in the command line:

   ``` bash
     git clone 
   ```
2. Open the TUICallKit Flutter example in Android Studio or VSCode. The following process will take Android Studio as an example:


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/34ec5a44126311efa2935254005ac0ca.png)


## Step 2: Configure the Demo
1. [Activate the audio and video services](https://write.woa.com/document/140196392040579072), to obtain the **SDKAppID** and **SDKSecretKey**.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/350369ae126311ef9fa952540019e87e.png)

2. Open the `Flutter/example/lib/debug/generate_test_user_sig.dart` file and fill in the SDKAppID and SDKSecretKey obtained when [Activating the Service](https://write.woa.com/document/140196392040579072):


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/a8926a892d3911ef9bb3525400ab9413.png)


## Step 3: Running the Demo
1. In the top right corner of Android Studio, select the device you want to run the Demo on as shown below:


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/6e880f462d3f11efa4f552540077de32.png)

2. After selecting, click Run to execute the TUICallKit Android Demo on the target device.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/79760e132d3f11ef97da5254007d9c55.png)


## Make the first call

> **Note:**
> 

> To experience the complete audio and video calling process, please log into the Demo on two devices as two different users, with one acting as the caller and the other as the callee.
> 

1. Log in & Signup


   Please enter the ID at the `User ID`. If your current User ID has not been used before, you will be taken to the **Signup** screen, where you can set your own avatar and nickname.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/b51ef4631e6911ef860b52540049c929.png)
   

   > **Note:**
   > 

   > Try to avoid setting your User ID to simple strings like "1", "123", "111", as TRTC does not support the same User ID being logged into from multiple devices. Such User IDs like "1", "123", "111" are easily occupied by your colleagues during collaborative development, leading to login failures. Therefore, we recommend setting highly recognizable User IDs while debugging.
   > 

2. Make a phone call

  1. The caller should click **1V1 Call** on the interface, enter the callee's User ID in the pop-up interface, and select the desired call type.

  2. Click **Initiate Call**.


      ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/ac43fa871e6a11efbef6525400a8a0fb.png)

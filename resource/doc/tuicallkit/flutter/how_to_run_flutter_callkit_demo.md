本文将为您介绍如何快速跑通音视频通话 Demo。跟随本文档，您可以在 10 分钟内跑通 Demo，并最终体验一个包含完备 UI 界面的音视频通话功能。
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

### Flutter

Flutter 3.0 及以上版本。

### Android 
- Android Studio 3.5及以上版本。

- Android 4.1 及以上版本的 Android 设备。


### iOS
- Xcode 13.0及以上版本。

- 请确保您的项目已设置有效的开发者签名。


## 步骤一 : 下载 Demo
1. 从 github 下载 [TUICallKit Demo](https://github.com/Tencent-RTC/TUICallKit/tree/main) 源码，或者直接在命令行运行以下命令：

   ``` bash
     git clone 
   ```
2. 通过 Android Studio 或 VSCode 打开 TUICallKit Flutter 的 example 。以下流程将以 Android Studio 为例：


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/756d77dd1e6c11ef91395254000a29ac.png)


## 步骤二 : 配置 Demo
1. [开通音视频服务](https://write.woa.com/document/139743928960860160)，获取 **SDKAppID** 和 **SDKSecretKey** 。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/d02a72a41e7611efbef6525400a8a0fb.png)

2. 打开`Flutter/example/lib/debug/generate_test_user_sig.dart`文件，将[开通服务](https://write.woa.com/document/139743928960860160)时获取到的对应的 SDKAppID 和 SDKSecretKey 填入其中：


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/7b8599c02d3d11efb8c45254005a8b94.png)


## 步骤三 : 跑通 Demo
1. 在 Android Studio 右上角如下图所示处选择您要将 Demo 运行的设备：


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/d5369ebd2d3e11efb0275254006c0558.png)

2. 选择完成后点击运行，将 TUICallKit Android Demo 运行到目标设备上。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/f1968bcf2d3e11ef918f52540005b090.png)


## 拨打第一个电话

> **注意：**
> 

> 为了使您可以体验完整的音视频通话流程，请将 Demo 分别在两台设备上登录两个用户，一方作为主叫，一方作为被叫。
> 

1. 登录 & 注册


   请您在 `用户ID`处输入 ID 。如果您当前的 UserID 未曾被使用过，此时会进入到**注册**界面，您可以在该界面为自己设置头像及昵称。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/754cb1341e6c11efbef6525400a8a0fb.png)
   

   > **注意：**
   > 

   > 尽量避免使您的 UserID 被设置成“1”、“123”、“111”等简单字符串，由于 TRTC 不支持同一个 UserID 多端登录，所以在多人协作开发时，形如 “1”、“123”、“111” 这样的 UserID 很容易被您的同事占用，导致登录失败，因此我们建议您在调试的时候设置一些辨识度高的 UserID。
   > 

2. 拨打电话

  1. 主叫方请点击界面上的 **1V1 通话**，在弹出的界面中输入被叫方的 UserID 并选择您想要的通话类型。

  2. 单击**发起通话**。


      ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100032451803/757339531e6c11efafe1525400db4520.png)

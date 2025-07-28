This article will guide you on how to quickly run through the Audio and Video Call Demo. By following this document, you can have the Demo up and running in 10 minutes, and ultimately experience an Audio and Video Call feature with a complete UI interface.
<table>
<tr>
<td rowspan="1" colSpan="1" >1v1 Video Call</td>

<td rowspan="1" colSpan="1" >Group call</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/cf76ae94b6d911ef916f525400f69702.png)</td>

<td rowspan="1" colSpan="1" >![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/cf6073deb6d911efbb92525400329841.png)</td>
</tr>
</table>


## Step 1: Download the demo
1. Open the terminal and clone the repository.

   ``` bash
   git clone https://github.com/Tencent-RTC/TUICallKit.git
   ```
2. Install dependencies.

   ``` bash
   cd ./TUICallKit/ReactNative
   yarn install
   ```

## Step 2: Configure the demo
1. [Go to the Activate Service page](https://trtc.io/document/59832?platform=web&product=call&menulabel=web) and get `the SDKAppID and SDKSecretKey`![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/f829ea3fb6e711ef9cb452540075b605.png)

2. Fill them in the `TUICallKit/ReactNative/src/debug/GenerateTestUserSig-es.js` file.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/1806fd5fb6db11ef9448525400fdb830.png)


## Step 3: Run the demo
``` bash
# TUICallKit/ReactNative
yarn start
```

## Step 4: Make the first call

> **Note:**
> 

> To experience the complete audio and video calling process, please log into the Demo on two devices as two different users, with one acting as the caller and the other as the callee.
> 

- log in to userID (defined by you).


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/6528eb62b6e911ef9cb452540075b605.png)

- Input the callee's userID and click all to experience your first call.


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/100d4889b6ec11ef9cb452540075b605.png)

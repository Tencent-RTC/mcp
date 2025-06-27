本文将介绍如何快速实现音视频通话演示。您将在10分钟内完成以下关键步骤，并最终获得一个具有全面用户界面的视频通话功能。

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/be8d9e591bd211efa1975254005ac0ca.png)

## 环境准备
- Node.js, 如果没有，[请点击下载。](https://nodejs.org/en)

- Modern browser, supporting WebRTC API.


## 步骤一：下载 Demo
1. 打开终端，克隆仓库。

   ``` bash
   git clone 
   ```
2. 安装依赖。


   


【React】
``` bash
 cd ./TUICallKit/Web/basic-react
```


【Vue3】
``` bash
 cd ./TUICallKit/Web/basic-vue3
```

   ``` bash
    npm install
   ```

## 步骤二：配置 Demo
1. [点击进入开通服务页面](https://trtc.io/document/59832?platform=android&product=call)，获取`SDKAppID、SecretKey`**。**

2. 填写 `SDKAPPID、SecretKey`。


   

【React】

文件路径：`TUICallKit/Web/basic-react/src/debug/GenerateTestUserSig-es.js`

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/1b9fc890668411ef989d52540055f650.png)

【Vue3】

文件路径：`TUICallKit/Web/basic-vue3/src/debug/GenerateTestUserSig-es.js`

![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/3634302a668411efbd54525400f69702.png)


## 步骤三：运行 Demo

打开终端，复制示例命令运行 Demo。




【TUICallKit/Web/basic-react】
``` bash
npm run dev
```


【TUICallKit/Web/basic-vue3】
``` bash
npm run dev
```

> **警告：**
> 

> **本地环境请在 localhost 协议下访问，公网体验请在 HTTPS 协议下访问，具体参见 **[网络访问协议说明](https://web.sdk.qcloud.com/trtc/webrtc/doc/en/tutorial-05-info-browser.html#h2-3)**。**
> 


## 步骤四：拨打您的第一通电话
1. 打开浏览器页面，输入项目运行地址，登录 userID（由您定义）。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/52631700668411ef9664525400d5f8ef.png)

2. 输入被叫方的 userID，单击 `发起通话` 体验您的第一通话。


   ![](https://write-document-release-1258344699.cos.ap-guangzhou.tencentcos.cn/100029836296/58624476668411efb0e2525400a9236a.png)

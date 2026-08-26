## Operation step

### Step 1. Register your app with vendor push platforms

Offline push requires registering your app with each vendor's push platform to obtain parameters such as AppID and AppKey to enable the offline push feature. Currently supported mobile manufacturers are: [Mi](https://dev.mi.com/console/doc/detail), [Huawei](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/service-introduction-0000001050040060), [HONOR](https://developer.hihonor.com/cn/kitdoc), [OPPO](https://open.oppomobile.com/wiki/doc#id=10195), [vivo](https://dev.vivo.com.cn/documentCenter/doc/281), [Meizu](https://open.flyme.cn/service/3), [Google FCM](https://console.firebase.google.com/u/0/).

### Step 2. Create resources in the Chat console

Log in to Tencent Cloud [Chat Console](https://console.trtc.io/chat/push-plugin-push-identifier), then in the **Push Management** > **Access Settings** feature section, add each vendor's push certificate, and configure the AppID, AppKey, AppSecret, and other parameters obtained in Step 1 to the added push certificate.

Explanation of the **Subsequent Actions** option:
- Open Application: Clicking the notification bar launches the app, by default starting the app's Launcher interface;

- Open Web Page: Clicking the notification bar will redirect to the configured web link;

- Open the specified interface within the app: clicking the notification bar will redirect the interface based on the configured self Definition, see [Custom Redirect on Click](https://www.tencentcloud.com/zh/document/product/1047/60575).

   > **Note：**
   >
   > Each vendor only supports the configuration of one certificate.
   >

【Mi】

【Huawei】
| Vendor Push Platform | Configuring in the Chat console |
| --- | --- |
|  | <strong>Note:</strong><br>Client ID corresponds to AppID, Client Secret corresponds to AppSecret. |

【OPPO】

【vivo】

For receipt configuration, please refer to: [Message Delivery Statistics Configuration - vivo](https://www.tencentcloud.com/document/product/1047/60552#daa658b0-1ac0-44a8-8a47-7ec8822ebe82).

【Meizu】

For receipt configuration, please refer to: [Message Delivery Statistics Configuration - Meizu](https://www.tencentcloud.com/document/product/1047/60552#daa658b0-1ac0-44a8-8a47-7ec8822ebe82).

【HONOR】

【Google FCM】

   > **Note:**
   >
   > Regarding **Click for Subsequent Actions** supports the Report Statistics feature:
   >
   > 1. If you choose to open an app or a web page, purchasing the plugin will by default support reporting statistics.
   > 2. If you choose to open a specified interface within the application:
   > - For new certificate status, please directly use the auto-fill default value to support click statistics reporting.
   > - If there was a certificate configured previously, continue using the old certificate and modify it to the default value to support reporting statistics, or regenerate a new certificate.

### About FCM Data Messaging

FCM provides two push methods: Notification Message and Data Messaging.
- Notification messages have a simple style and do not differentiate between devices. Once successfully integrated, offline push can be performed.

- Data Messaging, offering rich customization for specific devices, supports reach and click reporting, and requires testing on the device before going live after integration.

   The console defaults to Notification Message, and switching between modes can be done in the Chat Console:

   > **Note:**
   >
   > FCM data messaging capability only supports TIMPush version 7.8 and above on pixel phones. Other manufacturers' devices need to be tested for support.
   >

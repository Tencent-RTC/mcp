---
sync_node_id: '111137715751202816'
nav_path:
  - "产品简介"
  - "音视频通话 Call"
product: "chat"
---
Call is a UI-inclusive call component that can quickly integrate 1v1 calls, group calls, multi-endpoint calls, and other features into your application. It is a comprehensive and complete component with UI, so it can significantly reduce your development workload and help you integrate call functionality within 30 minutes.

## Features and Pricing of Call

Call takes effect for an individual ( `SDKAppID`). It is necessary to obtain the Call edition before using it. Different edition descriptions are presented in the table below.
| Item | Trial | 1-to-1 Call | Group Call |  |
| --- | --- | --- | --- | --- |
| Price | 7-day free trial | 199 USD/month<br><a href="https://buy.tencentcloud.com/avc?addRavLicense=1">Buy Now</a> | 597 USD/month<br><a href="https://buy.tencentcloud.com/avc?addRavLicense=1">Buy Now</a> |  |
| <a href="https://www.tencentcloud.com/document/product/1047/54512#note">Free resources</a> | <a href="https://www.tencentcloud.com/document/product/1047/54512#note">Free minutes</a> | 10,000 minutes/month | 10,000 minutes/month | 10,000 minutes/month |
| <a href="https://www.tencentcloud.com/document/product/1047/54512#note">Package bonus minutes</a> | - | 100,000 minutes/month | 300,000 minutes/month |  |
| <a href="https://www.tencentcloud.com/document/product/1047/54512#note">Quota of free monthly active users (MAU)</a> | 100/month | 5,000/month | 10,000/month |  |
| Pay-as-you-go upon exhaustion<br>(within the validity of the package) | Services become unavailable after exhaustion. | ✓ | ✓ |  |
| Call<br>features | Audio/Video calls | ✓ | ✓ | ✓ |
| Complete UI | ✓ | ✓ | ✓ |  |
| Call status display | ✓ | ✓ | ✓ |  |
| Call notifications and offline push<br>(If the application is not in the foreground, push notifications will be sent.) | ✓ | ✓ | ✓ |  |
| Floating window<br>(The call page can be displayed as a floating window.) | ✓ | ✓ | ✓ |  |
| Custom ringtones | ✓ | ✓ | ✓ |  |
| Make/Answer/Decline/Hang up a call | ✓ | ✓ | ✓ |  |
| Video call switch to Audio call | ✓ | ✓ | ✓ |  |
| 1-to-1 call | ✓ | ✓ | ✓ |  |
| Group call | ✓ | - | ✓ |  |
| Invite to/Join ongoing calls | ✓ | - | ✓ |  |
| Call History API<br>(Support obtaining call history data through Callback and REST API methods.) | ✓ | - | ✓ |  |
| Multi-platform call<br>(A successful connection will automatically terminate requests from other platforms.) | ✓ | - | ✓ |  |
| Multi-device call<br>(A user can be logged in to multiple devices of the same platform, such as several iOS devices. When a call is answered, the device that connects will automatically prevent other devices from accessing the call.) | ✓<br>(Utilize in conjunction with the Chat  Pro、Pro Plus、Enterprise Edition) | - | ✓ |  |
| AI noise suppression<br>(Removes background noises with the help of AI.) | ✓ | - | ✓ |  |
| Less stutter under poor network conditions<br>(Reduces stutter rate and loading time under poor network conditions.) | ✓ | - | ✓ |  |
| Supported platforms | iOS、Android、Web、Flutter | iOS、Android、Web、Flutter | iOS、Android、Web、Flutter |  |

> **Note:**
> 1. Free resources: The free resources can be used to deduct call durations and quota of free monthly active users (MAU). If you use the trial version, services will become unavailable for your application after you use up the package. If you use TRTC 1-to-1 Call or TRTC Group Call, after you use up the package, your additional usage will be charged at pay-as-you-go rates.
> 2. Free minutes: Each Tencent Cloud account will get 10,000 free minutes per usage cycle (a usage cycle is one month) after buying a TRTC Call package. The free minutes can be used to deduct call durations of TRTC Call features and on-cloud recording and mixtranscoding durations of TRTC basic features. To learn more, see [Free Minutes](https://www.tencentcloud.com/document/product/647/42735).
> 3. Package bonus minutes: The bonus minutes can be used to deduct call durations of TRTC Call features. The bonus minutes are valid for one month and will expire at the end of each usage cycle.
> 4. Quota of free monthly active users (MAU): The number of unique users that log in to the Chat app in a given month, regardless of their number of repeat visits.
> 5. TRTC basic features: In addition to TRTC Call features, you can also use TRTC's basic features, which will incur additional fees. For the billing details, see [Billing of On-Cloud Recording](https://www.tencentcloud.com/document/product/647/45176) and [Billing of MixTranscoding and Relay to CDN](https://www.tencentcloud.com/document/product/647/47631).

## Billing Rules
- The fees for Call may include: Call edition fees and overage fees.

   - Call edition fees: **A Call monthly package is necessary in order to use Call.**

   - Pay-as-you-go costs: Pay-as-you-go costs will be incurred if you exceed your Call monthly package's duration.  After your monthly package is exhausted, pay-as-you-go costs may be incurred for [quota of free monthly active users (MAU) services](https://www.tencentcloud.com/zh/document/product/1047/34350) and [TRTC audio/video durations](https://www.tencentcloud.com/document/product/647/42734). In addition, if you use a basic feature of TRTC, such as [on-cloud recording](https://www.tencentcloud.com/document/product/647/45176) and [stream mixing and relay](https://www.tencentcloud.com/document/product/647/47631), fees for the corresponding features will also be incurred. If you use the trial version, services will become unavailable for your application after you use up the package. If you use 1-to-1 Call or Group Call, your exceeding usage will be charged at pay-as-you-go rates.

- The validity period of a Call package is from the day of purchase to the same day of the following month. For example, if a package was bought on March 1, 2023, its validity period would be from March 1, 2023, to April 1, 2023.

- Call is offered at the level of the application ( `SDKAppID`), in other words, every call edition can only be used to activate one application  ( `SDKAppID`). If you have multiple applications that need to use Call features, you need to buy multiple Call packages. In addition, the Call edition takes effect immediately after purchase and does not support changing the `SDKAppID`. Please be sure to confirm the `SDKAppID` when purchasing.

- **One application can only be subscribed to one Call edition at a time**. For example, if your application is already subscribed to **1-to-1 Call**, before the package expires, you cannot upgrade to **Group Call**. If you do need to upgrade your package, please [submit a ticket](https://console.tencentcloud.com/workorder/category).

## Activate and purchase guide

You can choose the Call according to the [Features and Pricing of Call](https://www.tencentcloud.com/document/product/1047/54512), and refer to the following guidelines to activate and purchase Call.

### Free trial

In order for you to better experience the Call features, we offer a 7-day free trial version for each SDKAppID, with[ 10,000 free minutes](https://www.tencentcloud.com/document/product/647/42735) included. Each application ( `SDKAppID`) can apply TRTC Call twice, and the total number of trial opportunities for all SDKAppID under one account (UIN) is 10.

You can activate the Call free trial edition in the Chat console, with the specific operation steps as follows:
1. Log into the [Chat console](https://console.tencentcloud.com/im), and click on the target application card to enter the application's basic configuration page.

2. Locate the **Call** card, and click on **Try now.**

   

3. After confirming the content in the popup window, click on **Activate now**. Once activated, you can proceed with integration according to [integration guide](https://trtc.io/document/50991).

   

4. If your current SDKAppID has not yet expired, you can click on **. At this time, the validity period of the trial version will be extended by 7 days.

   

   

   > **Note:**
   > 
   > Extending the validity period of the trial version via  **Renew**  will consume one free trial opportunity.
   > 

### Purchase the official editions of Call

Call is one of the value-added capabilities of Chat.  **The official edition of Call can only be purchased when the Chat application is the Standard/Premium edition** . The steps to purchase the official edition are as follows:
1. Log in to the [Chat Purchase page](https://buy.tencentcloud.com/avc).

2. Select the  **Data Center**  based on your actual business needs, and select the  **SDKAppID**  to purchase audio/video calls. You can select an existing application or create a new one. Please confirm that you select the correct SDKAppID. It cannot be changed after purchase.

3. If your current Chat application is already in the Standard/Premium edition, you can skip this step; otherwise, you need to select the Chat  Plan  you need first. For the differences between Chat plans, see [Feature Comparison of Chat Monthly Package](https://trtc.io/zh/document/67650#5b606401-f55b-4562-8e26-1d6544bdc288).

   

4. Select  **Audio/Video Call** , and select the required  **Call version**  in the capability items. Select the  **Validity period** . It is recommended that you select auto-renewal. After the package expires, it will be automatically renewed for you on a monthly basis without any operation.

5. Confirm that you understand and agree to the relevant Service Level Agreement. Check the **Service terms**  and click  **Purchase Now**.

   

   > **Note:**
   > 
   > If you purchase both Chat and Call capabilities on the Chat purchase page, the selected validity period will **be used as** the validity period for both Chat and Call capabilities.
   > 

6. After the purchase is completed, you can return to the [Chat console](https://console.tencentcloud.com/im) and click the desired application card to enter the basic configuration page of the application. Check the current version in the  **Call**  card. After the activation is completed, you can refer to the [Integration Guide](https://trtc.io/document/50991) for integration.

   

### Renew the official editions of Call

Call is one of the value-added capabilities of Chat, **it can be renewed only in Standard or Premium editions.** The steps to renew the official edition are as follows:
1. Log in to the [Chat console](https://console.tencentcloud.com/im), and click the target application card to enter the basic configuration page of application.

2. Click **Renew** on the **Call** card.

   

3. In the pop-up checkout window, select the **Validity period**. Confirm that you understand and agree to the relevant Service Level Agreement. Check the **Service terms** and click **Confirm to renew**.

   

4. After the purchase is completed, you can return to the [Chat console](https://console.tencentcloud.com/im) and click the desired application card to enter the basic configuration page of the application. Check the current version in the **Call** card. After the activation is completed, you can refer to [Integration Guide](https://trtc.io/document/50991) for integration.

   

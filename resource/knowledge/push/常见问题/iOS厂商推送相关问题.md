---
sync_node_id: '212594228537700352'
nav_path:
  - "推送服务（Push）"
  - "常见问题"
  - "iOS 厂商推送相关问题"
product: "push"
---
## General Issues

### Why doesn't offline push work for common messages?
1. First, check that the app runtime environment is the same as the certificate environment. Otherwise, offline push messages will not be received.

2. Next, check if the app and the certificate environment are set to production. If they are in a development environment, applying for a deviceToken from Apple might fail. Please switch to production for testing.

### Why doesn't offline push work for custom messages?

The offline push for custom messages differs from that for regular messages. We cannot parse the content of custom messages, making it impossible to determine the push content. Therefore, custom messages are not pushed by default. If you require push, you need to set the [offlinePushInfo](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMOfflinePushInfo.html) desc field during [sendMessage](https://im.sdk.qcloud.com/doc/en/categoryV2TIMManager_07Message_08.html). The desc information will by default be displayed during push.

### How do I disable the receiving of offline push messages?

To stop receiving offline push notifications, call [unRegisterPush](https://trtc.io/document/60558).

## Concept Explanations

### What are the differences between APNs, VoIP, and Live Activities?

The differences are as follows:
- APNs: Sends notifications to alert users. Requires integration with TIMPush.

- VoIP: Used for audio and video call push notifications. Requires integration with CallKit and TUICallKitVoIPExtension.

- Live Activities: Displays real-time updates. Requires integration with ActivityKit and the IM SDK. Supported on iOS 16 and later.

## System Service Issues

### Under the iOS development environment, is the registration occasionally not returning a deviceToken or indicating a failure in requesting the token from APNs?

This problem is caused by instability of APNs. You can fix it in the following ways:
- Insert a SIM card into the phone and use the 4G network.

- Uninstall and reinstall the application, restart the application, or shut down and restart the phone.

- Use a package for the production environment.

- Use another iPhone.

### iOS Certificate Expiration

In the Chat console, click editing on the corresponding certificate and update the p12 certificate. It's important to note: do not delete the certificate and recreate it, as recreating the certificate will change the certificate ID, and an update will be required to support it.

### APNs push, manufacturer returns error code info code: 403, reason: InvalidProviderToken?

The customer used a P8 certificate, but the reported Token and certificate mismatched, causing verification failure by the manufacturer.

Pay attention to the following points:
- When the client generates the regId, the bundleId used must match the bundleId used for server push.

- Ensure teamId and keyId are filled in accurately.

- Use the correct certificate (check whether the certificate is for production environment or testing environment).

## Integration Issues

### Push notifications are not received, and the server reports a 'bad devicetoken'.

Apple's deviceToken is related to the current compilation environment, please check:
1. In the access process, check if the businessID of [Configure Push Parameters](https://trtc.io/document/60553) matches the certificate ID for the corresponding environment.

2. Console create certificate check:

   - Production Environment Certificate: The type of certificate uploaded is Apple Push Notification service SSL (Sandbox & Production), and it should be tested after creating the release package in Archive. Note: Do not test in Xcode.

   - Development Environment Certificate: You need to test after creating the release package in Archive, just select the correct certificate.

### iOS Registration Error: "ErrCode": 3000, "ErrMsg": "Entitlement String 'Aps-Environment' for the App Not Found"
- Reason 1: Push notification permission is not enabled in the Xcode project. Check Xcode configuration. Enablement method: [Add push permission in Xcode.](https://trtc.io/document/60548)

   

- Reason 2: Under the AppleID account to which the app belongs, Push Notifications is not checked to enable Remote Push Service for the corresponding application. You can check whether the description file contains "aps-environment" and whether it corresponds to the correct development/production environment. Enablement method: [Apply for APNs certificate](https://trtc.io/zh/document/60548).

   

### iOS access failed, console testing tool returns token and cert mismatch?

The iOS push certificate is divided into the official environment and test environment. The Token is also separated by environment. The Token and certificate must correspond for push to work.
1. Token is official or test depending on client packaging. Confirm whether the environment is normal:

   - Development environment (Xcode run directly), configure the uploaded certificate ID through Debug settings.

   - Production environment (packaged ipa), configure the uploaded certificate ID in release settings.（Most customers often upload production certificates to the development environment.）

2. You can choose a development/production certificate as a bundle or use a p8 cert. Upload to the Chat console and select the desired environment.

### Error: dyld: Library Not Loaded: @rpath/ImSDK_Plus.framework/ImSDK_Plus, Referenced From: /private/var/containers/Bundle/Application/52F5B9F2-435F-4BBF-BF7D-3EC3B381CE80/Demo.app/Frameworks/TIMPush.framework/TIMPush, Reason: image not found?

Caused by lack of Chat SDK. Execute first `pod 'TXIMSDK_Plus_iOS' or pod 'TXIMSDK_Plus_iOS_XCFramework'`, then rerun pod install.

## Push Statistics Issues

### iOS did not receive the delivery receipt
- To report push delivery data, enable the console switch to support iOS 10's Extension feature. For more details, please refer to [Statistics Push Arrival Rate](https://trtc.io/document/60553).

- To ensure reported data is not lost in abnormal conditions, iOS push data reporting will only occur upon the next log in, which may result in a delay. Please try to log in again.

### iOS Statistical Reporting Feature

To report push reach data, this switch must be enabled to support iOS 10's Extension feature. For more details, please refer to [Statistics Push Arrival Rate.](https://trtc.io/document/60553)

### Reach statistics with delay?

Android reach reporting is returned by the manufacturer, while iOS reach reporting is submitted by the client. Therefore, when Android reaches depends on the manufacturer and is not controlled by Chat. iOS reach reporting has a delay and will be reported the next time the client logs in.

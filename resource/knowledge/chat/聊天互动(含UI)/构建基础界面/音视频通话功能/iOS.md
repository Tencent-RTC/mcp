---
sync_node_id: '147637850810396672'
nav_path:
  - "聊天互动（含 UI）"
  - "构建基础界面"
  - "音视频通话功能"
  - "iOS"
product: "chat"
---
This article will guide you in building the audio and video call feature.

## Display Effect

## Environment Requirements
- Xcode 10 or later

- iOS 9.0 or later

## Preconditions

Before building the interface, please ensure that you have completed the following 4 things:
1. Created an application in the console.

2. Created some user accounts in the console.

3. Integrated with `TUICallKit`.

4. Called the `login` API in `TUILogin` to log in to the component.

   > **Note:**
   > 
   > 1. All components use this API to log in. You can log in once every time you start the application.
   > 2. Please make sure that the login is successful, and we recommend that you do the following in the callback of successful login.

   If you haven't completed the above 4 steps, please refer to the corresponding steps in [Getting Started](https://trtc.io/document/60520) first, otherwise you may encounter obstacles when implementing the following features.

   If you have already completed them, please continue reading below.

## Integration steps
1. log in to [Chat Console](https://console.trtc.io/) to activate the audio and video service. For detailed steps, refer to the document: [Activate Service](https://trtc.io/document/59832).

2. In the pop-up dialog to activate the TRTC `TRTC` service, click "Confirm". The system will create a TRTC application with the same SDKAppID as the current Chat application in the [TRTC console](https://trtc.io/login), allowing reuse of accounts and authentication.

3. Integrate the `TUICallKit` component. In the podfile, add the following content:

   ``` objectivec
   // Integrate the TUICallKit component
   pod 'TUICallKit_Swift'                  
   ```

   After integrating the `TUICallKit` component, "Video Call" and "Voice Call" buttons will automatically appear on the chat interface and contact profile screen. When users click on these buttons, `TUICallKit` will display the call invitation UI and send a call invitation request to the other party.

   When a user receives a call invitation online, `TUICallKit` automatically displays the call receiving UI, allowing the user to accept or reject the call.

   When a user receives a call invitation offline, offline push capabilities must be utilized to wake up the app call.

   Starting a call from the message page is shown in the figure below:

   

   Starting a call from the contacts page is shown in the figure below:

   

## Add Offline Push Notifications

For details, refer to the documentation: [Offline Push](https://trtc.io/document/54923). After configuration, when you click a received audio and video call notification pushed offline, `TUICallKit` will automatically open the audio/video call invitation interface.

## Add AI Noise Reduction

After integrating `TUIChat` and `TUICallkit` components, when you send a VMS in the chat interface, you can record VMS with AI noise reduction and automatic gain control. Below is a comparison of VMS recorded simultaneously with two phones:
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/portal/css/global-20209142343.css?max_age=31536000&amp;t=20191128" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/portal/css/global-components.css?max_age=31536000&amp;t=20180817" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/documentation/documentation-v4/css/pandect-20219091610.css" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/documentation/documentation-v4/css/import-2-markdown-20219091610.css" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/platform/documents/css/documents-202205161915.css" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/open_proj/proj_qcloud_v2/gateway/documentation/documentation-v4/css/pandect-202012171130.css" />
<link rel="stylesheet" href="//qcloudimg.tencent-cloud.cn/static/document/qcloud-document-sdk.v0.0.17.css" />
<link rel="stylesheet" href="//cloudcache.tencentcs.com/qcloud/main/components/document-feedback/document-feedback.944df9c907.css" />
<style>
* {
  font-family: 'pingfang SC','helvetica neue',arial,'hiragino sans gb','microsoft yahei ui','microsoft yahei',simsun,sans-serif;
}
</style>
 
<div class="markdown-text-box">
| Voice messages recorded by the system | Voice messages recorded by TUICallkit<br>with AI noise reduction and automatic gain |
| --- | --- |
| <audio id="audio" controls preload="none" style="display:block;margin:0 auto">
	<source id="m4a" src="https://im.sdk.cloudcachetci.com/tools/resource/rain_system_record.m4a"></source>
      </audio> | <audio id="audio" controls preload="none" style="display:block;margin:0 auto">
	<source id="m4a" src="https://im.sdk.cloudcachetci.com/tools/resource/rain_tuicallkit_record_with_agc_aidenoise.m4a"></source>
      </audio> |

</div>

> **Note:**
> 1. This feature requires the purchase of the  Pro edition 、Pro Plus edition or Enterprise edition. After the plan expires, VMS recording will switch to the system API for recording.
> 2. Only supported in SDK 7.0 and later versions.

## More practices

You can locally [run the TUIKitDemo source code](https://trtc.io/document/45913) to explore more interface implementations.

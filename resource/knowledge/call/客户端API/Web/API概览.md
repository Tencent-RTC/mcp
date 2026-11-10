---
sync_node_id: '95825253330665472'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "Web"
  - "API 概览"
product: "call"
---
## TUICallKit (Includes UI Components)

TUICallKit is an audio and video call component that **includes a UI component**. You can quickly implement a WhatsApp-like audio and video calling scenario with this component.

|API|Description|
|---------|---------|
|[init](https://www.tencentcloud.com/document/product/647/51015#init)|Initialize TUICallKit.|
|[calls](https://www.tencentcloud.com/document/product/647/51015#calls)|Initiate a one-to-one or multi-person call.|
|[join](https://www.tencentcloud.com/document/product/647/51015#join)|Proactively join a call.|
|[setCallingBell](https://www.tencentcloud.com/document/product/647/51015#setCallingBell)|Customize user's ringtone.|
|[setSelfInfo](https://www.tencentcloud.com/document/product/647/51015#setSelfInfo)|Set your own nickname and avatar.|
|[enableMuteMode](https://www.tencentcloud.com/document/product/647/51015#enableMuteMode)|Turn on/off ringtone.|
|[enableFloatWindow](https://www.tencentcloud.com/document/product/647/51015#enableFloatWindow)|Turn on/off the floating window function.|
|[enableVirtualBackground](https://www.tencentcloud.com/document/product/647/51015#enableVirtualBackground)|Turn on/off the blurred background function button.|
|[setLanguage](https://www.tencentcloud.com/document/product/647/51015#setLanguage)|Set the call language for the TUICallKit component.|
|[hideFeatureButton](https://www.tencentcloud.com/document/product/647/51015#hideFeatureButton)|Hidden Button.|
|[setLocalViewBackgroundImage](https://www.tencentcloud.com/document/product/647/51015#setLocalViewBackgroundImage)|Set the background image for the local user's call interface.|
|[setRemoteViewBackgroundImage](https://www.tencentcloud.com/document/product/647/51015#setRemoteViewBackgroundImage)|Set the background image for the remote user's call interface.|
|[setLayoutMode](https://www.tencentcloud.com/document/product/647/51015#setLayoutMode)|Set the call interface layout mode.|
|[setCameraDefaultState](https://www.tencentcloud.com/document/product/647/51015#setCameraDefaultState)|Set whether the camera is opened by default.|
|[destroyed](https://www.tencentcloud.com/document/product/647/51015#destroyed)|Destroy TUICallKit.|
|[getTUICallEngineInstance](https://www.tencentcloud.com/document/product/647/51015#getTUICallEngineInstance)|Get TUICallEngine instance.|

## TUICallEngine (No UI)

TUICallEngine API is an audio and video call component that **offers a No UI interface**. You can use this set of APIs to custom encapsulate according to your business needs.

|API|Description|
|---------|---------|
|[createInstance](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#.createInstance)|Creating a TUICallEngine Instance (Singleton Pattern)|
|[destroyInstance](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#destroyInstance)|Terminating a TUICallEngine Instance (Singleton Pattern)|
|[on](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#on)|Listening on events|
|[off](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#off)|Canceling Event Listening|
|[login](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#login)|Sign in Interface|
|[logout](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#logout)|Logout Interface|
|[setSelfInfo](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setSelfInfo)|Configure the user's nickname and profile photo|
|[calls](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#calls)|Initiate a one-on-one call|
|[join](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#join)|Proactively join a call.|
|[accept](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#accept)|Answer Calls|
|[reject](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#reject)|Decline Call|
|[hangup](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#hangup)|End Calls|
|[startRemoteView](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#startRemoteView)|Initiate Remote Screen Rendering|
|[stopRemoteView](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#stopRemoteView)|Stop Remote Screen Rendering|
|[openCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#openCamera)|Enable the camera|
|[closeCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#closeCamera)|Turn Off Camera|
|[switchCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#switchCamera)|Switch between front and rear cameras, note: only supported on mobile devices.|
|[openMicrophone](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#openMicrophone)|Enable Microphone|
|[closeMicrophone](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#closeMicrophone)|Turn off the microphone|
|[setVideoQuality](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setVideoQuality)|Set video quality|
|[getDeviceList](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#getDeviceList)|Access device list|
|[switchDevice](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#switchDevice)|Switch camera or microphone devices|
|[enableMultiDeviceAbility](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#enableMultiDeviceAbility)|Turn on/off the multi-device login mode of TUICallEngine.|
|[setBlurBackground](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setBlurBackground)|Switch/set background blur|
|[setVirtualBackground](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setVirtualBackground)|Switch/set image background blur|

## Event Types

TUICallEvent is the callback event class corresponding to TUICallEngine. Through this callback, you can listen to the callback events of interest.

|EVENT|Description|
|---------|---------|
|[TUICallEvent.ERROR](https://www.tencentcloud.com/document/product/647/51017#error)|An error occurred during the call.|
|[TUICallEvent.KICKED_OUT](https://www.tencentcloud.com/document/product/647/51017#kicked_out)|Receiving this event after a duplicate sign-in indicates that the user has been removed from the room|
|[TUICallEvent.USER_ACCEPT](https://www.tencentcloud.com/document/product/647/51017#user_accept)|If a user answers, this event will be received. **v4.x.x is deprecated**|
|[TUICallEvent.USER_ENTER](https://www.tencentcloud.com/document/product/647/51017#user_enter)|A user joined the call.|
|[TUICallEvent.USER_LEAVE](https://www.tencentcloud.com/document/product/647/51017#user_leave)|A user left the call.|
|[TUICallEvent.REJECT](https://www.tencentcloud.com/document/product/647/51017#reject)|A user declined the call.|
|[TUICallEvent.NO_RESP](https://www.tencentcloud.com/document/product/647/51017#no_resp)|A user didn't respond.|
|[TUICallEvent.LINE_BUSY](https://www.tencentcloud.com/document/product/647/51017#line_busy)|A user was busy.|
|[TUICallEvent.USER_VIDEO_AVAILABLE](https://www.tencentcloud.com/document/product/647/51017#user_video_available)|Whether a user has a video stream.|
|[TUICallEvent.USER_AUDIO_AVAILABLE](https://www.tencentcloud.com/document/product/647/51017#user_audio_available)|Whether a user has an audio stream.|
|[TUICallEvent.USER_VOICE_VOLUME](https://www.tencentcloud.com/document/product/647/51017#user_voice_volume)|The volume levels of all users.|
|TUICallEvent.ON_CALL_BEGIN|Call connected event|
|TUICallEvent.ON_CALL_RECEIVED|Call request event|
|TUICallEvent.ON_CALL_CONNECTED|Call not connected event|
|TUICallEvent.ON_CALL_END|The call ended.|
|[TUICallEvent.DEVICED_UPDATED](https://www.tencentcloud.com/document/product/647/51017#deviced_updated)|Device list update, this event will be received|
|TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED|All user network quality events|

## Document Link
- [TUICallEngine](https://www.tencentcloud.com/document/product/647/51016)

- [TUICallEvent](https://www.tencentcloud.com/document/product/647/51017)

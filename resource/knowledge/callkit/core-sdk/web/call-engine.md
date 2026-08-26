## TUICallEngine APIs

TUICallEngine API is the **No UI Interface** of the Audio and Video Call Components.

## API Overview

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
|[accept](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#accept)|Answer Calls|
|[reject](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#reject)|Decline Call|
|[hangup](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#hangup)|End Calls|
|[startRemoteView](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#startRemoteView)|Initiate Remote Screen Rendering|
|[stopRemoteView](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#stopRemoteView)|Stop Remote Screen Rendering|
|[openCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#openCamera)|Enable the camera|
|[closeCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#closeCamera)|Turn Off Camera|
|[switchCamera](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#switchCamera)|Switch between front and rear cameras, note: only supported on mobile devices|
|[openMicrophone](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#openMicrophone)|Enable Microphone|
|[closeMicrophone](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#closeMicrophone)|Turn off the microphone|
|[setVideoQuality](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setVideoQuality)|Set video quality|
|[getDeviceList](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#getDeviceList)|Access device list|
|[switchDevice](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#switchDevice)|Switch camera or microphone devices|
|[enableAIVoice](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#enableAIVoice)|Enable/disable AI noise reduction|
|[enableMultiDeviceAbility](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#enableMultiDeviceAbility)|Turn on/off the multi-device login mode of TUICallEngine|
|[setBlurBackground](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setBlurBackground)|Switch/set background blur|
|[setVirtualBackground](https://web.sdk.qcloud.com/component/trtccalling/doc/TUICallEngine/web/en/TUICallEngine.html#setVirtualBackground)|Switch/set image background blur|

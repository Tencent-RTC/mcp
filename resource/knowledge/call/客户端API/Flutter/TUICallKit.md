---
sync_node_id: '114033067004104704'
nav_path:
  - "视频通话 SDK"
  - "客户端 API"
  - "Flutter"
  - "TUICallKit"
product: "call"
---
## TUICallKit APIs

`TUICallKit` is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat. For directions on integration, see Integrating TUICallKit.

## API overview

|API|Description|
|---------|---------|
|[login](#login)|Log in.|
|[logout](#logout)|Sign out.|
|setSelfInfo|Set the user nickname and profile photo.|
|calls|Start a call.|
|join|Join the call.|
|enableMuteMode|Set whether to turn on the mute mode.|
|enableFloatWindow|Set whether to enable floating windows.|
|[enableIncomingBanner](#43f8126d-abd4-4764-a5b4-eb32f121483e)|Enable/Disable Call Banner.|

## Details

### login
``` cpp
Future<TUIResult> login(int sdkAppId, String userId, String userSig)
```
| Parameter | Type | Description |
| --- | --- | --- |
| sdkAppId | int | User SDKAppID |
| userId | String | User ID, a string type, can only include English letters (a-z and A-Z), numbers (0-9), hyphens (-), and underscores (_). |
| userSig | String | User Signature.<br>UserSig is obtained by encrypting information such as sdkAppId and userId using the SDKSecretKey(<a href="https://www.tencentcloud.com/document/product/647/35166">Signature calculation method</a>). It serves as a ticket for authentication, enabling Tencent Cloud to determine if the current user is authorized to use TRTC services. |
| return value | CompletionHandler | Contains errorCode and errorMessage information:<br>- When the errorCode is "0", it means the call is successful;<br>- When errorCode is not "0", it means the call failed; see errorMessage for the reason of failure. |

### logout
``` cpp
Future<void> logout()
```

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.
``` cpp
Future<TUIResult> setSelfInfo(String nickname, String avatar)
```
| Parameter | Type | Description |
| --- | --- | --- |
| nickName | String | The nick name. |
| avatar | String | The profile photo. |
| return value | CompletionHandler | Contains errorCode and errorMessage information:<br>- When the errorCode is "0", it means the call is successful;<br>- When errorCode is not "0", it means the call failed; see errorMessage for the reason of failure. |

### calls

Initiate a call.
``` java
Future<TUIResult> calls(List<String> userIdList, CallMediaType mediaType, CallParams params)
```
| Parameter | Type | Description |
| --- | --- | --- |
| userIdList | List<String> | The target user IDs. |
| callMediaType | CallMediaType | The call type, which can be video or audio. |
| params | CallParams | <strong>Optional</strong> Extended call parameters, such as room number, call invitation timeout, offline push of custom content, etc. |
| return value | CompletionHandler | Contains errorCode and errorMessage information:<br>- When the errorCode is "0", it means the call is successful;<br>- When errorCode is not "0", it means the call failed; see errorMessage for the reason of failure. |

### join

Actively join the call. 
``` java
Future<void> join(String callId)
```

|Parameter|Type|Description|
|---------|---------|---------|
|callId|String|Unique ID for this call.|

### enableMuteMode

This API is used to set whether to turn on the mute mode.
``` javascript
Future<void> enableMuteMode(bool enable)
```

|Parameter|Type|Description|
|---------|---------|---------|
|enable|bool|`true` means enable mute mode, `false` means disable mute mode.|

### enableFloatWindow

This API is used to set whether to enable floating windows. The default value is `false`, and the floating window button in the top left corner of the call view is hidden. If it is set to `true`, the button will become visible.
``` javascript
Future<void> enableFloatWindow(bool enable)
```

|Parameter|Type|Description|
|---------|---------|---------|
|enable|bool|`true` means enable the floating window feature, `false` means disable the floating window feature.|

## enableIncomingBanner

Enable/disable the call banner feature. When this feature is enabled, a banner display will appear at the top of the screen after receiving a call.
``` swift
Future<void> enableIncomingBanner(bool enable)
```

|Parameter|Type|Description|
|---------|---------|---------|
|enable|bool|`true` means enable the call banner feature, `false` means disable the call banner feature.|

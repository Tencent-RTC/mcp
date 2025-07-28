## TUICallKit APIs

`TUICallKit` is an audio/video call component that **includes UI elements**. You can use its APIs to quickly implement an audio/video call application similar to WeChat. For directions on integration, see [Integrating TUICallKit](https://write.woa.com/document/113558560409751552).

## API overview
<table>
<tr>
<td rowspan="1" colSpan="1" >API</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[login](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Log in</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[logout](https://write.woa.com/#logout)</td>

<td rowspan="1" colSpan="1" >Sign out</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setSelfInfo](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Sets the user nickname and profile photo.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[calls](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Start a call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[join](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Join the call.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableMuteMode](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Sets whether to turn on the mute mode.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableFloatWindow](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Sets whether to enable floating windows.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[setCallingBell](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Custom ringtone.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >[enableVirtualBackground](https://write.woa.com/document/114033067004104704)</td>

<td rowspan="1" colSpan="1" >Turn On/Off the Virtual Background feature</td>
</tr>
</table>


## Details

### login
``` cpp
Future<TUIResult> login(int sdkAppId, String userId, String userSig)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >sdkAppId</td>

<td rowspan="1" colSpan="1" >int</td>

<td rowspan="1" colSpan="1" >User SDKAppID</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >User ID, a string type, can only include English letters (a-z and A-Z), numbers (0-9), hyphens (-), and underscores (_).</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userSig</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >User Signature.<br>UserSig is obtained by encrypting information such as sdkAppId and userId using the SDKSecretKey([Signature calculation method](https://www.tencentcloud.com/document/product/647/35166)). It serves as a ticket for authentication, enabling Tencent Cloud to determine if the current user is authorized to use TRTC services.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >return value</td>

<td rowspan="1" colSpan="1" >[TUIResult](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Contains code and message information: code is empty ("") means the call is successful; code is not empty ("") means the call failed, see message for the reason of failure</td>
</tr>
</table>


### logout
``` cpp
Future<void> logout()
```

### setSelfInfo

This API is used to set the alias and profile photo. The alias cannot exceed 500 bytes, and the profile photo is specified by a URL.
``` cpp
Future<TUIResult> setSelfInfo(String nickname, String avatar)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >nickName</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The nick name.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >avatar</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The profile photo.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >return value</td>

<td rowspan="1" colSpan="1" >[TUIResult](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >Contains code and message information: code is empty ("") means the call is successful; code is not empty ("") means the call failed, see message for the reason of failure</td>
</tr>
</table>


### calls

Initiate a call. **Supported by v2.9+.**
``` java
Future<TUIResult> calls(List<String> userIdList, TUICallMediaType mediaType, TUICallParams params)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The call type, which can be video or audio.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >params</td>

<td rowspan="1" colSpan="1" >[TUICallParams](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >**Optional **Extended call parameters, such as room number, call invitation timeout, offline push of custom content, etc.</td>
</tr>
</table>


### join

Actively join the call. **Supported by v2.9+.**
``` java
Future<void> join(String callId)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >Unique ID for this call.</td>
</tr>
</table>


### enableMuteMode

This API is used to set whether to turn on the mute mode.
``` javascript
Future<void> enableMuteMode(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >Turn on and off the mute; true means to turn on the mute</td>
</tr>
</table>


### enableFloatWindow

This API is used to set whether to enable floating windows. The default value is `false`, and the floating window button in the top left corner of the call view is hidden. If it is set to `true`, the button will become visible.
``` javascript
Future<void> enableFloatWindow(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >The default value is false, and the floating window button in the top left corner of the call view is hidden. If it is set to true, the button will become visible.</td>
</tr>
</table>


### setCallingBell

Custom ringtone.
``` javascript
Future<void> setCallingBell(String assetName)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >assetName</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The path of the ringtone. The ringtone file needs to be added to the assets resource of the main project.</td>
</tr>
</table>


### enableVirtualBackground

Turn On/Off the Virtual Background feature. After enabling the Virtual Background feature, you can display the Blurry Background feature button on the UI. Clicking the button will directly enable the Blurry Background feature.
``` javascript
Future<void> enableVirtualBackground(bool enable)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Meaning</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >enable</td>

<td rowspan="1" colSpan="1" >bool</td>

<td rowspan="1" colSpan="1" >Turn on, turn off mute; true means mute is on</td>
</tr>
</table>


## Deprecated interfaces

### call

This API is used to make a (one-to-one) call.

> **Note：**
> 

> This interface has been deprecated in v2.9+. It is recommended to use the calls interface instead.
> 

``` cpp
Future<void> call(String userId, TUICallMediaType callMediaType, [TUICallParams? params])
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The target user ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >`The call type, which can be video or audio.`</td>
</tr>
</table>


### groupCall

This API is used to make a group call.

> **Note：**
> 

> This interface has been deprecated in v2.9+. It is recommended to use the calls interface instead.
> 

``` javascript
Future<void> groupCall(String groupId, List<String> userIdList, TUICallMediaType callMediaType,[TUICallParams? params])
```

The parameters are described below:
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The group ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >userIdList</td>

<td rowspan="1" colSpan="1" >List<String></td>

<td rowspan="1" colSpan="1" >The target user IDs.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >`The call type, which can be video or audio.`</td>
</tr>
</table>


### joinInGroupCall

This API is used to join a group call.Before making a group call, you need to create an IM group first.

> **Note：**
> 

> This interface has been deprecated in v2.9+. It is recommended to use the join interface instead.
> 

``` javascript
Future<void> joinInGroupCall(TUIRoomId roomId, String groupId, TUICallMediaType callMediaType)
```
<table>
<tr>
<td rowspan="1" colSpan="1" >Parameter</td>

<td rowspan="1" colSpan="1" >Type</td>

<td rowspan="1" colSpan="1" >Description</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >roomId</td>

<td rowspan="1" colSpan="1" >[TUIRoomID](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >The room ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >groupId</td>

<td rowspan="1" colSpan="1" >String</td>

<td rowspan="1" colSpan="1" >The group ID.</td>
</tr>

<tr>
<td rowspan="1" colSpan="1" >callMediaType</td>

<td rowspan="1" colSpan="1" >[TUICallMediaType](https://write.woa.com/document/114033029832187904)</td>

<td rowspan="1" colSpan="1" >`The call type, which can be video or audio.`</td>
</tr>
</table>

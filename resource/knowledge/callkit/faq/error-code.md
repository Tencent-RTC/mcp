Notify users of warnings and errors that occur during audio and video calls.

## TUICallDefine Error Code
| Definition | Value | Description |
| --- | --- | --- |
| ERROR_PACKAGE_NOT_PURCHASED | -1001 | You do not have TUICallKit package, please <a href="https://console.trtc.io/call">open the free experience</a> in the console or <a href="https://console.trtc.io/subscription/buy/call">purchase the official package</a>. |
| ERROR_PACKAGE_NOT_SUPPORTED | -1002 | The package you purchased does not support this ability. You can refer to<br>console to purchase <a href="https://console.trtc.io/subscription/buy/call">Upgrade package</a>. |
| ERROR_TIM_VERSION_OUTDATED | -1003 | The Chat SDK version is too low, please upgrade the Chat SDK version to ≥ 6.6; Find and modify in the build.gradle file.："com.tencent.imsdk:imsdk-plus:7.1.3925" |
| ERROR_PERMISSION_DENIED | -1101 | Failed to obtain permission. The audio/video permission is not authorized. Check if the device permission is enabled. |
| ERROR_GET_DEVICE_LIST_FAIL | -1102 | Failed to get the device list (only supported on web platform). |
| ERROR_INIT_FAIL | -1201 | The init method has not been called for initialization. The TUICallEngine API should be used after initialization. |
| ERROR_PARAM_INVALID | -1202 | Param is invalid. |
| ERROR_REQUEST_REFUSED | -1203 | The current status can't use this function. |
| ERROR_REQUEST_REPEATED | -1204 | The current status is waiting/accept, please do not call it repeatedly. |
| ERROR_SCENE_NOT_SUPPORTED | -1205 | The current calling scene does not support this feature. |
| ERROR_SIGNALING_SEND_FAIL | -1406 | Failed to send signaling. You can check the specific error message in the callback of the method. |

## Chat Error Code

Video and audio calls use Tencent Cloud's Chat SDK as the basic service for communication, such as the core logic of call signaling and busy signaling. Common error codes are as follows:

|Error Code|Description|
|---------|---------|
|6014|You have not logged in to the Chat SDK or have been forcibly logged out. Log in to the Chat SDK first and try again after a successful callback. To check whether you are online, use TIMManager getLoginUser.|
|6017|Invalid parameter. Check the error information to locate the invalid parameter.|
|6206|UserSig has expired. Get a new valid UserSig and log in again. For more information about how to get a UserSig, see [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385).|
|7013|The current package does not support this API. Please upgrade to the Flagship Edition package.|
|8010|The signaling request ID is invalid or has been processed.|

> **Note：**
> More Chat SDK error codes are available at：[Chat Error Code](https://www.tencentcloud.com/document/product/1047/34348)
>

## TRTC Error Code

Video and audio calls use Tencent Cloud's Chat SDK as the basic service for calling, such as the core logic of switching camera and microphone on or off. Common error codes are as follows:

|Enum|Value|Description|
|---------|---------|---------|
|ERR_CAMERA_START_FAIL|-1301|Failed to turn the camera on. This may occur when there is a problem with the camera configuration program (driver) on Windows or macOS. Disable and reenable the camera, restart the camera, or update the configuration program.|
|ERR_CAMERA_NOT_AUTHORIZED|-1314|No permission to access to the camera. This usually occurs on mobile devices and may be because the user denied access.|
|ERR_CAMERA_SET_PARAM_FAIL|-1315|Incorrect camera parameter settings (unsupported values or others).|
|ERR_CAMERA_OCCUPY|-1316|The camera is being used. Try another camera.|
|ERR_MIC_START_FAIL|-1302|Failed to turn the mic on. This may occur when there is a problem with the mic configuration program (driver) on Windows or macOS. Disable and reenable the mic, restart the mic, or update the configuration program.|
|ERR_MIC_NOT_AUTHORIZED|-1317|No permission to access to the mic. This usually occurs on mobile devices and may be because the user denied access.|
|ERR_MIC_SET_PARAM_FAIL|-1318|Failed to set mic parameters.|
|ERR_MIC_OCCUPY|-1319|The mic is being used. The mic cannot be turned on when, for example, the user is having a call on the mobile device.|
|ERR_TRTC_ENTER_ROOM_FAILED|-3301|Failed to enter the room. For the reason.|

> **Note：**
> More TRTC SDK error codes are available at：[TRTC Error Code](https://www.tencentcloud.com/document/product/647/35130)
>

## CallKit Server Error Code

New version of CallKit REST API error codes, for example, when retrieving call status and call records. Common error codes are as follows:

|Error Code|Description|
|---------|---------|
|101001|Internal server error, please try again.|
|101002|Invalid parameter, check if parameters meet requirements. .|
|101004|Call does not exist or has already ended.|
|101050|Call record does not exist.|

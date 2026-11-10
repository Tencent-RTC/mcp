---
sync_node_id: '173283200865329152'
nav_path:
  - "视频通话 SDK"
  - "服务端 API"
  - "REST API"
  - "通话记录"
  - "通过 CallId 获取记录"
product: "call"
---
## Feature Description

App admins can use this API to obtain the call record information of the specified CallId.

> **Warning:**
> If you use the deprecated interfaces`TUICallKit.call()` or `TUICallKit.groupCall()`to initiate a call, please check the **Deprecated Document** directory. If you have any questions, you can contact: info_rtc@tencent.com.
> 

## API Call Description

### Sample Request URL
``` https
https://xxxxxx/v4/call_record_http_srv/get_record_by_callid?sdkappid=88888888&identifier=admin&usersig=xxx&random=99999999&contenttype=json
```

### Request Parameters

The following table only lists the parameters involved in modification when calling this API and their descriptions. For more parameter details, please see REST API Introduction.
| Parameter | Description |
| --- | --- |
| xxxxxx | Dedicated domain name corresponding to the country/region where the SDKAppID resides:<br>- China: <code>console.tim.qq.com</code><br>- Singapore: <code>adminapisgp.im.qcloud.com</code><br>- Seoul: <code>adminapikr.im.qcloud.com</code><br>- Frankfurt: <code>adminapiger.im.qcloud.com</code><br>- Silicon Valley: <code>adminapiusa.im.qcloud.com</code><br>- Jakarta: <code>adminapiidn.im.qcloud.com</code> |
| v4/call_record_http_srv/get_record_by_callid | Request API |
| sdkappid | Assigned SDKAppID in the Chat console when creating an application |
| identifier | Must be an App administrator account. For more details, see <a href="https://trtc.io/document/33517">App Administrator</a> |
| usersig | Generated signature of the App administrator account. For specific operations, see <a href="https://trtc.io/document/34385">Generate UserSig</a> |
| random | Enter a random 32-bit unsigned integer. The value ranges from 0 to 4294967295 |
| contenttype | The request format has a fixed value of <code>json</code> |

### Maximum Calling Frequency

200 times per second.

### Sample Request Packet

**Basic form**
``` json
{
  "CallId": "04c9a0ac-8e38-4a19-be45-349c5ce7911b"
}
```

### Request Packet Fields

|Field|Type|Required|Description|
|---------|---------|---------|---------|
|CallId|String|Required|Call ID|

### Response Package Example

**Basic form**
``` json
{
	"ErrorCode": 0,
	"ErrorInfo": "",
	"ActionStatus": "OK",
	"RequestId": "Id-da9b3ee8bece466d951a9d93965c3d2c-O-Seq-324151555",
	"Response": {
		"CallRecord": {
			"CallId": "04c9a0ac-8e38-4a19-be45-349c5ce7911b",
			"Caller_Account": "user1",
			"MediaType": "Audio",
			"CallType": "MultiCall",
			"StartTime": 1739868165,
			"EndTime": 1740064224,
			"AcceptTime": 1739872743,
			"CallResult": "NormalEnd",
			"CalleeList_Account": [
				"user1",
				"user5",
				"user2"
			],
            "RoomId": "roomid-1434",
            "RoomIdType": 2
		}
	}
}
```

### Response Packet Fields
| Field | Type | Description |
| --- | --- | --- |
| ErrorCode | Integer | Error code, 0 indicates success, non-zero indicates failure |
| ErrorInfo | String | Error message |
| ActionStatus | String | Request processing result. OK: processing successful; FAIL: processing failed |
| RequestId | String | Unique request ID. It is returned for each request. RequestId is required for locating a problem |
| CallRecord | Struct | Call record information |
| CallId | String | Call ID |
| Caller_Account | String | Caller ID |
| MediaType | String | Media type:<br>- <code>Video</code> video call<br>- <code>Audio</code> audio call |
| CallType | String | Call Type:<br>- <code>SingleCall</code> one-to-one call<br>- <code>MultiCall</code> group call |
| StartTime | Integer | Call initiation timestamp (in seconds) |
| EndTime | Integer | Call end timestamp (in seconds) |
| AcceptTime | Integer | Call connection timestamp (in seconds) |
| CallResult | String | Call result<br>- <code>Cancel</code>: caller cancel the call before connecting<br>- <code>Reject</code>: recipient decline the call<br>- <code>NotAnswer</code>: recipient timeout before answering<br>- <code>NormalEnd</code>: Call connected and ended normally<br>- <code>CallBusy</code>: call busy<br>- <code>Interrupt</code>: Call interrupted due to reasons such as network issues |
| CalleeList_Account | Array | Call Member List |
| RoomId | String | TRTC Room ID |
| RoomIdType | Integer | RoomId type:<br>- <code>1</code> digit room number<br>- <code>2</code> string Room Number |

## Error Code Description

Unless a network error (for example, 502 error) occurs, the HTTP return code of this API is 200. The actual error code and error information are indicated by ErrorCode and ErrorInfo in the response packet body.

For common error codes (60000 to 79999), see the Error Code document.

The private error codes of this API are as follows:

|Error Code|Description|
|---------|---------|
|101001|Internal server error, please retry.|
|101050|The call record does not exist.|

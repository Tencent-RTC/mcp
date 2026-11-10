---
sync_node_id: '153440120232009728'
nav_path:
  - "直播与语聊 SDK"
  - "服务端 API"
  - "REST API"
  - "REST API 简介"
product: "live"
---
RESTful API is the backend HTTP management interface for the Live Streaming Room SDK. Its main purpose is to provide developers with a simple management entry point. For security, RESTful API only offers HTTPS interfaces.

## Prerequisites

To call the RESTful API, you must purchase or acquire the necessary Package bundles for LiveSdk.

## Calling method

### Request URL

The URL format of the RESTful API is as follows:
``` bash
https://xxxxxx/$ver/$servicename/$command?sdkappid=$SDKAppID&identifier=$identifier&usersig=$usersig&random=99999999&contenttype=json
```

The meanings and values of each parameter are as follows (both parameter names and their values are case-sensitive):
| Parameter | Meaning | Fetching Value |
| --- | --- | --- |
| https | Request protocol | The request protocol is HTTPS, and the request method is POST. |
| xxxxxx | Request Domain | - Others in China: <code>console.tim.qq.com</code><br>- Singapore: <code>adminapisgp.im.qcloud.com</code><br>- Silicon Valley: <code>adminapiusa.im.qcloud.com</code><br>- Jakarta: <code>adminapiidn.im.qcloud.com</code> |
| ver | Protocol Version Number | Fixed as <code>v4</code>. |
| servicename | Internal Service Name, different servicenames correspond to different service types | Example: <code>v4/live_engine_http_srv/create_room</code>, where <code>room_engine_http_srv</code> is the <code>servicename</code>. . |
| command | Command Word, used in combination with the servicename to identify a specific business feature | Example: <code>v4/live_engine_http_srv/create_room</code>, where <code>create_room</code> is the <code>command</code>.
| sdkappid | Application Identifier obtained from the Chat console | Obtained when applying for integration. |
| identifier | username, must be an App Administrator Account when calling RESTful APIs | Refer to <a href="https://www.tencentcloud.com/document/product/1047/33517">App Administrator</a>. |
| usersig | password corresponding to username | Refer to <a href="https://www.tencentcloud.com/document/product/1047/34385">Generating UserSig</a>. |
| random | Identifies the random number parameter for the current request | A 32-bit unsigned integer random number, ranging from 0 to 4294967295. |
| contenttype | Request Format | Fixed value is <code>json</code>. |

> **Note:**
> - When calling REST APIs, the App Server's identifier must be an App Administrator Account.
> - An App can generate a UserSig for the Administrator Account each time it calls a REST API, or it can generate a fixed UserSig for repeated use, but please pay special attention to the validity period of the UserSig.

### HTTP Request Body Format

REST APIs only support the POST method, and the request body is in JSON format. For the specific body format.
It's particularly important that the POST body cannot be empty. Even if a protocol doesn't require any information to be carried, an empty JSON object, namely `{}`, must be included.

### HTTP return code

Unless a network error occurs (e.g., a 502 error), the invocation result of REST APIs is always 200. The real API invocation error codes and error messages are returned in the HTTP response body.

### HTTP Response Body Format

The response body of the RESTful API is also in JSON format, and its format conforms to the following characteristics:
``` bash
{
    "ActionStatus": "OK", 
    "ErrorInfo": "", 
    "ErrorCode": 0,
    "RequestId": "Id-70e312f1de024af5a36714b7b71da224-O-Seq-63504"
    // Other response content of REST API
}
```

The response payload must contain the properties ActionStatus, ErrorInfo, ErrorCode, RequestId. Their meanings are as follows:

|Field|Type|Description|
|---------|---------|---------|
|ActionStatus|String|The result of the request processing. OK means success, FAIL means failure. If it's FAIL, ErrorInfo will provide the reason for failure.|
|ErrorInfo|String|Failure.|
|ErrorCode|Integer|Error code. 0 means success, others mean failure. You can refer to the [Error Code Table](https://www.tencentcloud.com/document/product/1047/34348) for specific reasons.|
|RequestId|String|Error code. 0 means success, others mean failure. You can refer to the [Error Code Table](https://www.tencentcloud.com/document/product/1047/34348) for specific reasons.|

## Common Error Codes for RESTful APIs

|Error code|Description|
|---------|---------|
|60002|HTTP parsing error, please check the HTTP request URL format.|
|60003|HTTP request JSON parsing error, please check the JSON format.|
|60004|Request URL or JSON payload contains an incorrect account or signature.|
|60005|Request URL or JSON payload contains an incorrect account or signature.|
|60006|SDKAppID invalid, please verify the validity of SDKAppID.|
|60007|RESTful API invocation frequency exceeds its limit, please reduce the request frequency.|
|60008|Service request timed out or HTTP request format is incorrect, please check and retry.|
|60009|Request Resource Error, please check the request URL.|
|60010|The request requires App administrator privileges.|
|60011|SDKAppID request frequency exceeds the limit, please reduce the request frequency.|
|60012|RESTful API requires SDKAppID, please check the SDKAppID in the request URL.|
|60013|HTTP response package JSON parsing error.|
|60014|Account Replacement timed out.|
|60015|The request body has the wrong account type. Please ensure the account is in string format.|
|60016|SDKAppID is disabled.|
|60017|The request is disabled.|
|60018|The request is too frequent, please try again later.|
|60019|The request is too frequent, please try again later.|
|60020|Your Professional Edition package has expired and been deactivated. Please  log in to  [ Chat  purchase page](https://buy.cloud.tencent.com/avc) to repurchase the package. Once purchased, it will take effect 5 minutes later.|
|60021|The Call Source IP for RestAPI is illegal.|

## FAQ

### Is there a chance that REST API requests timeout, receiving no response?
1. The timeout set for the Live backend REST interface is 3 seconds. The caller's timeout setting should be longer than 3 seconds.

2. `telnet console.tim.qq.com 443` to confirm if the service port can be connected.

3. Use `curl -I https://console.tim.qq.com` to simply test if the status code is 200.

4. Confirm whether the machine's DNS server configuration is an internal DNS server or a public DNS server. If it is an internal DNS server, ensure that the DNS server's network egress and the region ISP of the machine's network egress IP match.

5. It is recommended for business callers to use the "Long Connection + Connection Pool" model.

   > **Note:**
   > 
   > Due to the high time consumption of establishing HTTPS short connections, every request incurs TCP and TLS handshake overhead. Therefore, it is recommended to access REST APIs with long connections.
   > 
   > Using the standard HTTP library scenarios: HTTP 1.0 requires specifying the request header Connection: keep-alive, HTTP 1.1 supports long connections by default. In scenarios where HTTPS requests are encapsulated based on TCP, you can reuse TCP connections to send and receive requests.
   > 

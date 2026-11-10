---
sync_node_id: '173283142924849152'
nav_path:
  - "视频通话 SDK"
  - "服务端 API"
  - "REST API"
  - "REST API 简介"
product: "call"
---
REST API is the backend HTTP management API of CallKit SDK. Its main purpose is to provide developers with a simple management portal.

For security, REST API provides only HTTPS APIs.

## Prerequisites

To call REST API, you must purchase or claim the required package for CallKit Sdk.

> **Warning:**
> If you use the deprecated interfaces`TUICallKit.call()` or `TUICallKit.groupCall()`to initiate a call, please check the **Deprecated Document** directory. If you have any questions, you can contact: info_rtc@tencent.com.
> 

## Calling Method

### Request URL

The URL format of the REST API is as follows:
``` bash
https://xxxxxx/$ver/$servicename/$command?sdkappid=$SDKAppID&identifier=$identifier&usersig=$usersig&random=99999999&contenttype=json
```

The meaning and values of each parameter are as follows (parameter names and values are case-sensitive):
| Parameter | Meaning | Value |
| --- | --- | --- |
| https | Request protocol | The request protocol is HTTPS, and the request method is POST. |
| xxxxxx | Request domain | Dedicated domain name corresponding to the country/region where the SDKAppID is located:<br>- China: <code>console.tim.qq.com</code><br>- Singapore: <code>adminapisgp.im.qcloud.com</code> |
| ver | Protocol version number | Fixed as <code>v4</code> |
| servicename | Internal service name. Different service names correspond to different service types. | <code>v4/call_engine_http_srv/get_call_info</code>, where <code>call_engine_http_srv</code> is the <code>servicename</code>. . |
| command | Command word, combined with servicename to identify specific business functionality. | Example: <code>v4/call_engine_http_srv/get_call_info</code>, where <code>get_call_info</code> is the <code>command</code>. . |
| sdkappid | App obtains the application identifier in the IM console. | Obtain when applying for access. |
| identifier | username must be an App administrator account when calling REST API. | see <a href="https://trtc.io/document/33517">App admin</a> |
| usersig | The password corresponding to the username. | see <a href="https://trtc.io/document/34385">generate UserSig</a> |
| random | Random number parameter indicating the current request | 32-bit unsigned integer random number, value ranges from 0 to 4294967295 |
| contenttype | Request format | The fixed value is <code>json</code>. |

> **Note:**
> - The App Server must use an App administrator account as the identifier when calling REST API.
> - The App can generate a UserSig for the administrator account each time it calls the REST API, or reuse a fixed UserSig. Special attention should be paid to the valid period of the UserSig.

### HTTP Request Body Format
- REST API only supports POST method. Its request body is in JSON format. Please .

- It is important to note that the POST body cannot be empty. Even if a protocol packet does not need to carry any information, an empty JSON Object, i.e., `{}`, needs to be carried.

### HTTP Return Code

Unless a network error (such as 502 error) occurs, the call result of the REST API is 200. The actual API Invocation Error Code and error information are returned in the HTTP response body.

### HTTP Response Body Format

The response packet body of the REST API is also in JSON format. Its format has the following features:
``` bash
{
    "ActionStatus": "OK", 
    "ErrorInfo": "", 
    "ErrorCode": 0,
    "RequestId": "Id-70e312f1de024af5a36714b7b71da224-O-Seq-63504"
    // Other response contents of REST API
}
```

The response payload necessarily contains the attributes ActionStatus, ErrorInfo, ErrorCode, and RequestId, whose meanings are as follows:

|Field|Type|Description|
|---------|---------|---------|
|ActionStatus|String|Request processing result. OK means processing successful; FAIL means processing failed. If it is FAIL, ErrorInfo contains the failure reason.|
|ErrorInfo|String|Failure reason|
|ErrorCode|Integer|Error code: 0 means successful; any other value indicates failure. You can query the Error Code Table for specific reasons.|
|RequestId|String|Unique request ID. It is returned for each request. RequestId is required for locating a problem.|

## Calling Example

The following is an example of using the REST API to get all groups in the App.

HTTPS request
``` bash
POST /v4/group_open_http_svc/get_appid_group_list?usersig=xxx&identifier=admin&sdkappid=88888888&random=99999999&contenttype=json HTTP/1.1
Host: console.tim.qq.com
Content-Length: 22
{
    "Limit": 2
}
```

HTTPS response
``` bash
HTTP/1.1 200 OK
Server: nginx/1.7.10
Date: Fri, 09 Oct 2015 02:59:55 GMT
Content-Length: 156
Connection: keep-alive
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: X-Requested-With
Access-Control-Allow-Methods: POST

{
    "ActionStatus": "OK", 
    "ErrorCode": 0, 
    "GroupIdList": [
        {
            "GroupId": "@TGS#1YTTZEAEG"
        }, 
        {
            "GroupId": "@TGS#1KVTZEAEZ"
        }
    ], 
    "TotalCount": 58530
}
```

## REST API Common Error Code

|Error Code|Description of Meaning|
|---------|---------|
|60002|HTTP parsing error. Please check the HTTP Request URL Format.|
|60003|HTTP request JSON parsing error. Please check the JSON format.|
|60004|Error in account or signature in the request URL or JSON body.|
|60005|Error in account or signature in the request URL or JSON body.|
|60006|SDKAppID is invalid. Check the validity of the SDKAppID.|
|60007|The REST API call frequency exceeds the limit. Reduce the request frequency.|
|60008|Service request timeout or HTTP request format error. Please check and retry.|
|60009|Request resource error. Please check the request URL.|
|60010|The request requires App administrator permissions.|
|60011|The SDKAppID request frequency exceeds the limit. Reduce the request frequency.|
|60012|The RESTful API requires an SDKAppID. Please check the SDKAppID in the request URL.|
|60013|HTTP response packet JSON parsing error.|
|60014|Account switching timeout.|
|60015|Error in account type in request body. Please confirm that the account is in string format.|
|60016|SDKAppID is disabled.|
|60017|The request is disabled.|
|60018|Frequent requests. Please retry later.|
|60019|Frequent requests. Try again later.|
|60020|Your Professional Edition Package has expired and been disabled. Please log in to [Chat purchase page](https://console.trtc.io/subscription/buy/chat) to repurchase a package. It will take effect 5 minutes after purchase.|
|60021|The call source IP of the RestAPI is illegal.|

## FAQ

### REST API Request May Timeout and Fail to Receive Any Response?
1. The timeout period for the Room backend REST API settings is 3 s. The timeout period set by the caller should be longer than 3 s.

2. `telnet console.tim.qq.com 443` Confirm whether you can connect to the service port.

3. Use `curl -I https://console.tim.qq.com` for a simple test to see if the status code is 200.

4. Confirm whether the dns server configuration of the machine is an internal dns server or a public dns server. If it is an internal dns server, please ensure that the network outbound of the dns server matches the regional carrier where the network outbound IP of this machine resides.

5. Recommend that business callers use the "persistent connection + connection pool" mode.

   > **Note:**
   > 
   > Since the TCP connection duration of HTTPS non-persistent connections is relatively large and there is TCP + tls handshake overhead for each request, so it's recommended to use persistent connection access for REST APIs.
   > 

   Scenarios using the standard HTTP library: For HTTP1.0, you need to specify the request header Connection: keep-alive. HTTP1.1 supports long connection by default. In scenarios where HTTPS requests are encapsulated based on TCP, TCP connections can be reused to send and receive requests.

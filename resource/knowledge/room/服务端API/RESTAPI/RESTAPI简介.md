---
sync_node_id: '140034633377488896'
nav_path:
  - "视频会议 SDK"
  - "服务端 API"
  - "REST API"
  - "REST API 简介"
product: "room"
---
The RESTful API is a part of the TRTC Conference backend HTTP Management Interface, providing developers with a simplified management entry. 

For security reasons, the RESTful API is only available via HTTPS Interface.

## Prerequisites

To call the RESTful API, you need purchase or acquire the necessary plan for RoomSdk.

> **Warning:**
> The new version of the RESTful API has undergone significant optimization and upgrades in backend architecture, providing enhanced capabilities. Unfortunately, this means it currently cannot interoperate with the 1.x version of the SDK.
> 
> Therefore, when integrating the latest RESTful API, please ensure to use the client SDK of the latest version 2.0 or above.
> 

## Calling Method

### Request URL

The URL format of the RESTful API is as follows:
``` bash
https://console.tim.qq.com/$ver/$servicename/$command?sdkappid=$SDKAppID&identifier=$identifier&usersig=$usersig&random=99999999&contenttype=json
```

The meanings and values of each parameter are as follows (both parameter names and their values are case-sensitive):
| Parameter | Meaning | Fetching Value |
| --- | --- | --- |
| https | Request protocol | The request protocol is HTTPS, and the request method is POST |
| console.tim.qq.com | Request domain name | Fixed as <code>console.tim.qq.com</code> |
| ver | Protocol version number | Fixed as <code>v4</code> |
| servicename | Internal service name, different service names correspond to different service types | Example:<br><code>v4/room_engine_http_srv/create_room</code>, where <code>room_engine_http_srv</code> is the <code>servicename</code><br>For more details, please . |
| command | The word <code>command</code>, combined with the <code>servicename</code>, is used to indicate a specific business feature | Example:<br><code>v4/room_engine_http_srv/create_room</code>, where <code>create_room</code> is the <code>command</code><br>For more details, please . |
| sdkappid | The application identifier accessed in the Chat console | Obtained when applying for integration |
| identifier | username, must be an App Administrator Account when calling RESTful APIs | Refer to <a href="https://cloud.tencent.com/document/product/269/31999#app-.E7.AE.A1.E7.90.86.E5.91.98">App Administrator</a> |
| usersig | password corresponding to username | Refer to <a href="https://cloud.tencent.com/document/product/269/32688">Generating UserSig</a> |
| random | Identifies the random number parameter for the current request | 32-bit unsigned integer random number, ranging from 0 to 4294967295 |
| contenttype | Request format | Fixed value: <code>json</code> |

> **Note**
> - When calling RESTful APIs, the App Server's identifier must be an App Administrator Account.
> - An App can generate a UserSig for the Administrator Account each time it calls a RESTful API, or it can generate a fixed UserSig for repeated use, but please pay special attention to the validity period of the UserSig.

### HTTP Request Body Format

The RESTful API only supports the POST method, and its request body is in JSON format. For specific body formats.
It's particularly important that the POST body cannot be empty. Even if a protocol doesn't require any information to be carried, an empty JSON object, namely `{}`, must be included.

### HTTP Return Code

Unless a network error occurs (e.g., a 502 error), the call result of RESTful APIs is always 200. The actual error code and error message of the API call are returned in the HTTP response body.

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

The response body must contain four attributes: ActionStatus, ErrorInfo, ErrorCode, RequestId. Their meanings are as follows:

|Field|Type|Description|
|---------|---------|---------|
|ActionStatus|String|The result of the request processing. OK for success, FAIL for failure. If it's FAIL, ErrorInfo will provide the reason for failure.|
|ErrorInfo|String|Cause of failure|
|ErrorCode|Integer|Error code. 0 for success, others for failure. You can .|
|RequestId|String|Error code. 0 for success, others for failure. You can .|

## Sample call

Below is an example of [getting all groups in an app](https://cloud.tencent.com/document/product/269/1614) through RESTful APIs.

HTTPS Request:
``` bash
POST /v4/group_open_http_svc/get_appid_group_list?usersig=xxx&identifier=admin&sdkappid=88888888&random=99999999&contenttype=json HTTP/1.1
Host: console.tim.qq.com
Content-Length: 22
{
    "Limit": 2
}
```

HTTPS Response:
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

## Common Error Codes for RESTful APIs

|Error code|Description|
|---------|---------|
|60002|An error occurred when parsing the HTTP request. Check the format of the HTTP request URL.|
|60003|An error occurred when parsing the JSON data of the HTTP request. Check the JSON format.|
|60004|Account or signature in the request URL or JSON packet is incorrect.|
|60005|Account or signature in the request URL or JSON packet is incorrect.|
|60006|Invalid SDKAppID. Check the validity of the SDKAppID.|
|60007|The RESTful API call exceeds the frequency limit. Please reduce the request frequency.|
|60008|The service request timed out or the format of the HTTP request is incorrect. Please check and try again.|
|60009|Request resource error. Please check the request URL.|
|60010|The request requires App administrator permission.|
|60011|The SDKAppID request exceeds the frequency limit. Please reduce the request frequency.|
|60012|SDKAppID is required when calling the RESTful API. Check the SDKAppID in the request URL.|
|60013|An error occurred when parsing the JSON data in the HTTP response packet.|
|60014|Account switching timed out.|
|60015|The type of the account in the request packet is incorrect. Please ensure that the UserID is in string format.|
|60016|The SDKAppID is disabled.|
|60017|The request is disabled.|
|60018|Too many requests. Try again later.|
|60019|Too many requests. Try again later.|
|60020|Your professional edition plan has expired and been disabled, please log in to [Chat Purchase Page](https://buy.cloud.tencent.com/avc) to repurchase the plan. It will take effect 5 minutes after purchase.|
|60021|The source IP of the RESTful API call is invalid.|

## FAQs

### Is there a chance that RESTful API requests timeout, receiving no response?
1. The Room backend RESTful API's timeout setting is 3s, the caller's timeout setting should be longer than 3s.

2. `telnet console.tim.qq.com 443` to confirm if the service port can be connected.

3. Use `curl -I https://console.tim.qq.com` to simply test if the status code is 200.

4. Confirm whether the machine's DNS server configuration is an internal DNS server or a public DNS server. If it is an internal DNS server, ensure that the DNS server's network egress and the region ISP of the machine's network egress IP match.

5. It is recommended for business callers to use the **Long Connection + Connection Pool** pattern.

   > **Note**
   > 
   > Due to the high time consumption of establishing HTTPS short connections, each request incurs TCP + TLS handshake overhead, so it is advised for RESTful API to use long connections.
In the scenario of using standard HTTP libraries: For HTTP1.0, it's necessary to specify the request header Connection: keep-alive; for HTTP1.1, long connections are supported by default. In the scenario of encapsulating HTTPS requests based on TCP, the TCP connection can be reused for sending and receiving requests.
   > 

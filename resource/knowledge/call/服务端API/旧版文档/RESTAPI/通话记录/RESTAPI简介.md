---
sync_node_id: '141369010651090944'
nav_path:
  - "视频通话 SDK"
  - "服务端 API"
  - "旧版文档"
  - "REST API"
  - "通话记录"
  - "REST API 简介"
product: "call"
---
The RESTful API is a part of the TRTC Call's backend HTTP Hub Management Interface Hub, providing developers with a simplified management entry. For the RESTful APIs currently supported by the TRTC Call, please refer to [REST API List](#6536fcf5-62c7-4fb8-ad61-dcbd58737bf0).

For security reasons, the RESTful API is only available via HTTPS Interface.

## Use Conditions
- **The REST API is currently in beta**. During the beta period, applications (SDKAppId) that have enabled the **Group Call Version** of TRTC Call can use the REST API. You can also activate a free trial of the experience version. For version descriptions and activation guidelines.

- Currently, the RESTful API is available only in specific versions of TUICallKit across different platforms, as detailed in the table below:

   |Platform/Framework|Version number|
   |---------|---------|
   |Android/iOS/Flutter/uni-app (client)|≥ 1.7.1 |
   |Web|≥ 1.4.6|
   |WeChat Mini Program|≥ 1.5.1|

   > **Note:**
   > 
   > - Only after all participating platforms/frameworks are upgraded to the versions mentioned above, can the corresponding call information be peeked at in the console.
   > - During the Beta Testing Period, the RESTful API supports querying data from the past 7 days.

## RESTful API List

|Feature Overview|API|
|---------|---------|
|Access records through callId|v1/records/get_record_by_callId|
|Access records by condition|v1/records/get_records_by_filter|

## Calling method

### Request URL

The URL format of the RESTful API is as follows:
``` bash
https://xxxxxx/$version/$kind/$command?sdkappid=$SDKAppID&identifier=$identifier&usersig=$usersig&random=99999999&contenttype=json
```

 The meanings and values of each parameter are as follows (both parameter names and their values are case-sensitive):
| Parameter | Meaning | Fetching Value |
| --- | --- | --- |
| https | Request protocol | The request protocol is HTTPS, and the request method is POST |
| xxxxxx | reserved domain name | <code>callkit-intl.trtc.tencent-cloud.com</code> |
| version | Protocol Version Number | Fixed as <code>v1</code> |
| kind | Management Classification | Example:<br><code>v1/records/get_record_by_callId</code>, where `records` is a kind |
| command | The word `command`, combined with `kind`, is used to indicate a specific business feature | Example:<br><code>v1/records/get_record_by_callId</code>, where `get_record_by_callId` is a command |
| sdkappid | The application identifier accessed in the console | Obtained when applying for integration |
| identifier | username, must be an App Administrator Account when calling RESTful APIs | Using the Admin account of Chat |
| usersig | password corresponding to username |
| random | Identifies the random number parameter for the current request | 32-bit unsigned integer random number, ranging from 0 to 4294967295 |
| contenttype | Request Format | Fixed value: json |

> **Note:**
> - After obtaining or purchasing package bundles, an administrator account named `administrator` will be created in the Chat account system. Please use `administrator` for the `identifier` parameter in requests. If you cancel or delete an administrator in Chat [Account Management](https://console.cloud.tencent.com/im/account-management), please correctly specify the administrator account and corresponding UserSig.
> - Apps can either generate a UserSig for the administrator account at every RESTful API call, or generate a fixed UserSig for repeated use. However, it is crucial to pay attention to the UserSig's validity period.
> - During operations such as creating or entering a room, the system will automatically import Chat accounts into the Chat System. Please be aware.

## HTTP Request Body Format

The RESTful API only supports the POST method, and its request body is in JSON format. For specific body formats.

> **Note:**
> The POST body cannot be empty. Even if a protocol does not require any information to be carried, it must still include an empty JSON object, namely `{}`.
> 

### HTTP return code

Unless a network error occurs (e.g., 502 error), the call result of the RESTful API is always 200. The actual error code and error message of the API call are returned in the HTTP response body.

### HTTP Response Body Format

The response body of the RESTful API is also in JSON format, and its format conforms to the following characteristics:
``` json
{
    "errorCode": 0, 
    "errorMessage": "Success",
    "requestId": "1c8960ac38d61be38b6fb219db0182d1", 
    "data": {} 
}
```

The response body must contain three attributes: errorCode, errorMessage, requestId. Their meanings are as follows:

|Field|Type|Description|
|---------|---------|---------|
|errorCode|String|Error code, 0 for success, others for failure|
|errorMessage|String|Error message|
|requestId|Integer|Request Unique Identifier|

## Sample call

Below is an example of accessing call records for a specified callId through RESTful APIs.

HTTPS Request:
``` bash
POST /records/get_record_by_callId?usersig=xxx&identifier=admin&sdkappid=88888888&random=99999999&contenttype=json HTTP/2
Host: callkit-intl.trtc.tencent-cloud.com
Content-Length: 36
{
    "callId": "2ae7d549-c441-4a9b-87c0-61810fe19582"
}
```

HTTPS Response:
``` bash
HTTP/2 200 OK
Date: Fri, 21 Apr 2023 06:06:16 GMT
Content-Length: 112
Connection: keep-alive

{
    "errorCode": 0,
    "errorMessage": "Success",
    "requestId": "9f01db503f2006ad10c45f4f4609e38d",
    "data": {
        "callId": "2ae7d549-c441-4a9b-87c0-61810fe19582",
        "sdkAppId": 88888888,
        "mediaType": "video",
        "roomId": "123456",
        "startCallTs": 1688705638,
        "acceptTs": 1688705641,
        "endTs": 1688705668,
        "caller": "alice",
        "totalUserNumber": 2,
        "callType": "single", 
        "callResult": "normal_end", 
        "callees": [
            "bob1",
            "bob2"
        ]
    }
}
```

## Common Error Codes for RESTful APIs

|Error code|Description|
|---------|---------|
|0|Request succeeded|
|50001|The current application needs to purchase the TUICallKit Group Call Version Package to use|
|70001|Invalid request parameters, please check whether mandatory parameters are missing or incorrectly entered|
|70002|UserSig is invalid|
|70003|UserSig has expired|
|70004|Requesting user is not a Super Administrator|
|70005|Request frequency limited|
|70009|Error in parsing request body, please check if the request parameter type is correct|
|Unknown error code|System internal error, please [Submit a ticket](https://console.intl.cloud.tencent.com/workorder/category) to contact technical personnel|

## FAQs

### Is there a chance that REST API requests timeout, receiving no response?

You can confirm from the following aspects:
1. The backend REST interface's timeout setting is 3s, the caller's timeout setting should be longer than 3s.

2. `telnet callkit-intl.trtc.tencent-cloud.com 443` to confirm if the service port can be connected.

3. Use `curl -I https://callkit-intl.trtc.tencent-cloud.com` for a simple test to see if the status code is 200.

4. Confirm whether the machine's DNS server configuration is an internal DNS server or a public DNS server. If it is an internal DNS server, ensure that the DNS server's network egress and the region ISP of the machine's network egress IP match.

5. It is recommended for business callers to use the **long connection + connection pool** pattern.

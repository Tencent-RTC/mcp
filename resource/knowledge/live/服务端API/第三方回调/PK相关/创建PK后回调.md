---
sync_node_id: '170201563035676672'
nav_path:
  - "直播与语聊 SDK"
  - "服务端 API"
  - "第三方回调"
  - "PK 相关"
  - "创建 PK 后回调"
product: "live"
---
## Feature Description

The app server can use this webhook to view information about user-created battles in real time.

## Must-Knows
- To enable a webhook, you must configure the webhook URL and turn on the switch corresponding to this webhook protocol. For the configuration method, see Third-Party Webhook Configuration documentation.

- The direction of the webhook is that the live server initiates an HTTP POST request to the app server.

- After receiving the webhook request, the app server must verify whether the parameter SDKAppID in the request URL is its own SDKAppID.

## Scenarios That May Trigger This Webhook
- The app user successfully creates a battle through the client.

- The app admin successfully creates a battle via REST API.

## Timing Of Webhook Occurrence

After the battle is created successfully.

## API Description

### Request URL Sample:

In the following example, the webhook URL configured for the app is `https://www.example.com`.

**Example:**
``` bash
https://www.example.com?SdkAppid=$SDKAppID&CallbackCommand=$CallbackCommand&contenttype=json&ClientIP=$ClientIP&OptPlatform=$OptPlatform
```

### Description Of Request Parameters

|Parameter|Description|
|---------|---------|
|https|The request protocol is HTTPS, and the request method is POST.|
|www.example.com|Webhook URL.|
|SdkAppid|The SDKAppID assigned in the Chat console when creating an application.|
|CallbackCommand|Fixed as `Live.CallbackAfterCreateBattle`.|
|contenttype|The fixed value is `json`.|
|ClientIP|Client IP, format: `127.0.0.1`.|
|OptPlatform|Client platform. For the value, see Introduction to Third-Party Webhook for the parameter meaning of OptPlatform.|

### Request Packet Sample
``` bash
{
    "CallbackCommand": "Live.CallbackAfterCreateBattle",
    "Operator_Account": "brennanli",
    "BattleId": "4siHsNsWN/T3aub9zKraqPbSEGRX2z6gs3LDFi+d/3M=",  //battle id
    "FromRoomId": "pk-3", // Room ID of the caller initiating the battle
    "ToRoomIdList": [ // Room ID list of the callee participating in the battle
        "pk-5"
    ],
    "Timeout": 30000, // If NeedResponse is true, the maximum waiting duration for the callee to process; if the callee does not process, it indicates giving up participating in the battle
    "Duration": 60000, // Duration after the battle starts, in milliseconds
    "NeedResponse": false, // If false, start the battle directly; if true, wait for the callees to process before starting the battle
    "ExtensionInfo": "extension pk",
    "EventTime":1739954005000
}
```

### Field Description Of Request Packet

|Field|Type|Description|
|---------|---------|---------|
|CallbackCommand|String|Webhook command.|
|Operator_Account|String|User who initiates battle request.|
|BattleId|String|Battle ID.|
|FromRoomId|String|Room id of the caller initiating the battle.|
|ToRoomIdList|Array|List of callee participating in the battle.|
|Timeout|Integer|Maximum waiting duration after creating a battle, waiting for the callees to process, in milliseconds.|
|Duration|Integer|Duration of the battle in milliseconds.|
|NeedResponse|Bool|After creating a battle, is the consent of the callee's room owner required for joining.|
|ExtensionInfo|String|Extended information of the battle.|
|EventTime|Integer|Millisecond-level timestamp triggered by the event.|

### Response Packet Example

After the app synchronizes data in the background, it sends a webhook response packet.
``` bash
{
    "ActionStatus": "OK",
    "ErrorInfo": "",
    "ErrorCode": 0 // Ignore webhook result
}
```

### Response Packet Field Description

|Field|Type|Attribute|Description|
|---------|---------|---------|---------|
|ActionStatus|String|Mandatory|The result of the request process: OK indicates success; FAIL indicates failure.|
|ErrorCode|Integer|Mandatory|Error Code, here 0 means to ignore the response result.|
|ErrorInfo|String|Mandatory|Error message.|

## Reference
- Introduction to Third-Party Webhook

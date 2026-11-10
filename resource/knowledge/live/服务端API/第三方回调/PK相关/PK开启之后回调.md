---
sync_node_id: '170203265552953344'
nav_path:
  - "直播与语聊 SDK"
  - "服务端 API"
  - "第三方回调"
  - "PK 相关"
  - "PK 开启之后回调"
product: "live"
---
## Feature Description

The app server can use this webhook to monitor battle started.

## Must-Knows
- To enable the webhook, the webhook must be configured URL, and turn on the switch corresponding to this webhook protocol. For configuration methods, see Third-Party Webhook Configuration documentation.

- The direction of the webhook is that the live backend initiates an HTTP POST request to the app backend.

- After receiving the webhook request, the app backend must verify whether the parameter SDKAppID in the request URL is its own SDKAppID.

## Scenarios That May Trigger This Webhook
- After creating a battle with , it can directly enter the started state without waiting when .

- After the battle is created, once all callees have processed the battle request, as long as there is at least one room owner of the callee who agrees to join the battle, the battle officially begins.

## Timing Of Webhook Occurrence

After the battle is officially launched.

## API Description

### Request URL Sample:

In the following example, the webhook URL configured for the App is `https://www.example.com`.

**Example:**
``` bash
https://www.example.com?SdkAppid=$SDKAppID&CallbackCommand=$CallbackCommand&contenttype=json&ClientIP=$ClientIP&OptPlatform=$OptPlatform
```

### Description Of Request Parameters

|Parameter|Description|
|---------|---------|
|https|Request Protocol: HTTPS, Request Method: POST.|
|www.example.com|Webhook URL.|
|SdkAppid|The SDKAppID assigned in the Chat console when creating an application.|
|CallbackCommand|Fixed as `Live.CallbackAfterStartBattle`.|
|contenttype|The fixed value is `json`.|
|ClientIP|Client IP, format as: `127.0.0.1`.|
|OptPlatform|Client platform. For the value, see Introduction to Third-Party Webhook for the parameter meaning of OptPlatform.|

### Request Packet Sample
``` bash
{
    "CallbackCommand": "Live.CallbackAfterStartBattle",  
    "BattleId": "4siHsNsWN/T3aub9zKraqI4zZAyPRpXQhdtKv1q4HOs=", // battle id
    "Duration": 60000, // battle duration
    "CreateTime": 1739954005, // battle creation time, in seconds
    "StartTime": 1739954005, // battle start time, in seconds
    "FromRoomInfo": {  // Caller information in battle
        "RoomId": "pk-3",
        "Owner_Account": "brennan"
    },
    "ToRoomList": [ // Called party information in battle
        {
            "RoomId": "pk-5",
            "Owner_Account": "tandy"
        }
    ],
    "EventTime": 1739954005000, // Callback trigger time, in milliseconds
}
```

### Description Of Request Packet Fields

|Field|Type|Description|
|---------|---------|---------|
|CallbackCommand|String|Webhook command.|
|BattleId|String|Battle ID.|
|Duration|Integer|Battle duration in milliseconds.|
|CreateTime|Integer|Creation time of the battle, Unix time.|
|StartTime|Integer|Start time of the battle, Unix time.|
|FromRoomInfo|String|Caller information in battle.|
|ToRoomList|Array|Information of the callee participating in the battle.|
|RoomId|String|Room ID.|
|Owner_Account|String|The owner ID of room.|
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

### Description Of Response Packet Fields

|Field|Type|Attribute|Description|
|---------|---------|---------|---------|
|ActionStatus|String|Required|Result of request processing. OK indicates success and FAIL indicates failure.|
|ErrorCode|Integer|Required|Error code. Fill in 0 here to ignore the webhook result.|
|ErrorInfo|String|Required|Error message.|

## Reference
- Introduction to Third-Party Webhook

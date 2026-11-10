---
sync_node_id: '207986346363641856'
nav_path:
  - "RTC Engine"
  - "高级功能"
  - "监听服务端事件回调"
  - "AI 转录与翻译回调"
product: "trtc"
---
This document provides detailed information on Event Webhook notifications for TRTC Backend Integration with AI Transcription/Translation 2.0.

# Configuration

Configure Event Webhook notifications in the TRTC Console for Real-Time Audio/Video. Select **AI Transcription 2.0 Callback** to enable notifications. Once configured, Event Webhook notifications will be sent to your server. For detailed instructions, see Callback Configuration.

> **Note:**
> You need to prepare the following information in advance:
> 
> - **Required**: the HTTP/HTTPS server address to receive callback notifications.
> - **Optional**: the key for calculating a signature, which is a key of up to 32 characters defined by you, consisting of uppercase and lowercase letters and digits.

## Timeout and Retry

If your server does not respond within 5 seconds after receiving an Event Webhook notification, the attempt is considered failed. The system will retry immediately after the first failure. If subsequent attempts fail, retries occur every 10 seconds until the message has been retried for 1 minute. After 1 minute, no further retries will be made.

## Event Webhook Message Format

Event Webhook messages are sent to your server via HTTP/HTTPS POST requests with the following specifications:
- Character encoding: UTF-8

- Request body format: JSON

- Response: HTTP STATUS CODE = 200. The response body is ignored. For protocol compatibility, respond with JSON: {"code":0}.

- Below is an example payload for the "Start AI Transcription and Translation 2.0" event:

   ``` json
   {    
       "EventGroupId":    14, 
       "EventType": 1401, 
       "CallbackTs": 1687770730166, 
       "EventInfo": { 
           "EventMsTs": 1622186275757, 
           "TaskId": "xxx", 
           "RoomId": "1234",
           "RoomIdType": 0, 
           "RobotId": "trtc_partner_test_1",
           "Payload": {
               "Status": 0
           }
       }
   }
   ```

## Parameter Description

Event Webhook Message Parameters
- The header of the Event Webhook message contains the following fields:

   |Field Name|Description|
   |---------|---------|
   |Content-Type|application/json.|
   |Sign|Signature value.|
   |SdkAppId|SdkAppId assigned by the Console when creating the application.|

- The body of the Event Webhook message contains the following fields:

   |Field Name|Type|Description|
   |---------|---------|---------|
   |EventGroupId|Number|Event Group ID. For transcription events, this value is 14.|
   |EventType|Number|Event type for the callback notification.|
   |CallbackTs|Number|Unix timestamp (milliseconds) when the Event Webhook server sent the callback request to your server.|
   |EventInfo|JSON Object|Event Information.|

### Event Group ID

|Field Name|Value|Description|
|---------|---------|---------|
|EVENT_GROUP_CLOUD_TRANSCRIPTION|14|Transcription Event Group.|

### Event Types

|Field Name|Value|Description|
|---------|---------|---------|
|EVENT_TYPE_CLOUD_TRANSCRIPTION_START|1401|Transcription start status callback.|
|EVENT_TYPE_CLOUD_TRANSCRIPTION_STOP|1402|Transcription task end status callback.|
|EVENT_TYPE_CLOUD_TRANSCRIPTION_ASR_MSG|1403|Callback for complete STT transcription sentences.|
|EVENT_TYPE_CLOUD_TRANSCRIPTION_TRANSLATE_MSG|1404|Callback for complete transcription translation sentences.|

#### EVENT_TYPE_CLOUD_TRANSCRIPTION_START
| Field Name | Type | Description |
| --- | --- | --- |
| EventMsTs | Number | Unix timestamp (milliseconds) when the event occurred. |
| TaskId | String | Task ID. |
| RoomId | String | TRTC Room ID. |
| RoomIdType | Integer | - 0: Numeric Room ID.<br>- 1: String Room ID. |
| RobotId | String | Robot ID. |
| Payload.Status | Number | - 0: Transcription task started.<br>- 1: Failed to start transcription task. |

``` json
{    
    "EventGroupId":    14, 
    "EventType": 1401, 
    "CallbackTs": 1687770730166, 
    "EventInfo": { 
        "EventMsTs": 1622186275757, 
        "TaskId": "xxx", 
        "RoomId": "1234",
        "RoomIdType": 0, 
        "RobotId": "trtc_partner_test_1",
        "Payload": {
            "Status": 0
        }
    }
}
```

#### EVENT_TYPE_CLOUD_TRANSCRIPTION_STOP
| Field Name | Type | Description |
| --- | --- | --- |
| EventMsTs | Number | Unix timestamp (milliseconds) when the event occurred. |
| TaskId | String | Task ID. |
| RoomId | String | TRTC Room ID. |
| RoomIdType | Integer | - 0: Numeric Room ID.<br>- 1: String Room ID. |
| RobotId | String | Robot ID. |
| Payload.LeaveCode | Integer | - 0: Transcription module stopped and exited normally.<br>- 1: Transcription robot was kicked out by the customer.<br>- 2: Customer dissolved the room.<br>- 3: Server kicked out the transcription robot.<br>- 4: Server dissolved the room.<br>- 99: Only the transcription robot remained in the room; exited after a timeout.<br>- 101: Duplicate entry by the same user into the same room caused robot exit. |

``` json
{    
    "EventGroupId":    14, 
    "EventType": 1402, 
    "CallbackTs": 1687770730166, 
    "EventInfo": { 
        "EventMsTs": 1622186275757, 
        "TaskId": "xxx",
        "RoomId": "1234", 
        "RoomIdType": 0, 
        "RobotId": "trtc_partner_test_1",
        "Payload": {
            "LeaveCode": 0
        }
    }
}
```

#### EVENT_TYPE_CLOUD_TRANSCRIPTION_ASR_MSG
| Field Name | Type | Description |
| --- | --- | --- |
| EventMsTs | Number | Unix timestamp (milliseconds) when the event occurred. |
| TaskId | String | Task ID. |
| RoomId | String | TRTC Room ID. |
| RoomIdType | Integer | - 0: Numeric Room ID.<br>- 1: String Room ID. |
| RobotId | String | Robot ID. |
| Payload | JSON Object | JSON object:<br>`{`<br>`"UserId": "Trtc_User_0",`<br>` "Text": "xxxx",`<br>`  "StartTimeMs": 108,`<br>`  "EndTimeMs": 10568,`<br>`  "RoundId": "40c9e724-3268-4b66-a9ff-41ed44d8edb6",`<br>`  "StartUtcMs": 1761568438912,`<br>`  "EndUtcMs": 1761568449372`<br>`}` |

``` json
{    
    "EventGroupId":     14,
    "EventType":     1403,
    "CallbackTs":     1687770730166,
    "EventInfo": { 
        "EventMsTs": 1761568449890,
        "TaskId": "xxx",
        "RoomId": "1234",
        "RoomIdType": 0,
        "RobotId": "trtc_partner_test_1",
        "Payload": {
            "UserId": "Trtc_User_0",
            "Text": "Oh yeah? What's the ultimate predator? What's the ultimate predator? What's the enemy you harbor in your own heart? Who hates you? That's the ultimate predator.",
            "StartTimeMs": 108,
            "EndTimeMs": 10568,
            "RoundId": "40c9e724-3268-4b66-a9ff-41ed44d8edb6",
            "StartUtcMs": 1761568438912,
            "EndUtcMs": 1761568449372
        }
    }
}
```

#### EVENT_TYPE_CLOUD_TRANSCRIPTION_TRANSLATE_MSG
| Field Name | Type | Description |
| --- | --- | --- |
| EventMsTs | Number | Unix timestamp (milliseconds) when the event occurred. |
| TaskId | String | Task ID. |
| RoomId | String | TRTC Room ID. |
| RoomIdType | Integer | - 0: Numeric Room ID.<br>- 1: String Room ID. |
| RobotId | String | Robot ID. |
| Payload | JSON Object | JSON object:<br>`{`<br>`  "UserId": "Trtc_User_0",`<br>`  "Text": "Presume, was exactly the same way. ",`<br>`  "TranslateMsg": [`<br>`    {`<br>`      "Language": "fr",`<br>`      "Text": "Je suppose, c'était exactement la même chose. "`<br>`    }`<br>`  ],`<br>`  "StartTimeMs": 108,`<br>`  "EndTimeMs": 10568,`<br>`  "RoundId": "40c9e724-3268-4b66-a9ff-41ed44d8edb6",`<br>`  "StartUtcMs": 1761568438912,`<br>`  "EndUtcMs": 1761568449372`<br>`}` |

``` json
{    
    "EventGroupId":     14,
    "EventType":     1404,
    "CallbackTs":     1687770730166,
    "EventInfo": { 
        "EventMsTs": 1761568449890,
        "TaskId": "xxx",
        "RoomId": "1234",
        "RoomIdType": 0,
        "RobotId": "trtc_partner_test_1",
        "Payload": {
            "UserId": "Trtc_User_0",
            "Text": "presume, was exactly the same way. ",
            "TranslateMsg": [
                {
                    "Language": "fr",
                    "Text": "Je suppose, c'était exactement la même chose."
                }
            ],
            "StartTimeMs": 108,
            "EndTimeMs": 10568,
            "RoundId": "40c9e724-3268-4b66-a9ff-41ed44d8edb6",
            "StartUtcMs": 1761568438912,
            "EndUtcMs": 1761568449372
        }
    }
}
```

## Calculate a Signature

Signatures are calculated using the HMAC SHA256 encryption algorithm. After your event callback server receives a callback message, it calculates the signature in the same manner. If they match, it indicates that it is an event callback from TRTC and has not been forged. The signature calculation is as follows:
``` json
// In the signature calculation formula, the 'key' is the encryption key used for calculating the signature 'Sign'.
Sign = base64(hmacsha256(key, body))
```

> **Note:**
>  Body refers to the original packet body of the callback request you received; do not modify it:
> 

> `body="{\n\t\"EventGroupId\":\t1,\n\t\"EventType\":\t103,\n\t\"CallbackTs\":\t1615554923704,\n\t\"EventInfo\":\t{\n\t\t\"RoomId\":\t12345,\n\t\t\"EventTs\":\t1608441737,\n\t\t\"UserId\":\t\"test\",\n\t\t\"UniqueId\":\t1615554922656,\n\t\t\"Role\":\t20,\n\t\t\"Reason\":\t1\n\t}\n}"`

## Signature Verification Example

【Java】
``` java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
//# Feature: third-party callback signature verification
//# Parameters:
//#   key: key configured in the console
//#   body: body returned by Tencent Cloud callbacks
//#   sign: signature value returned by Tencent Cloud callbacks
//# Returned values:
//#   Status: OK indicates verification successful. FAIL indicates verification failed. Refer to Info for details.
//#   Info: success/failure information

public class checkSign {
    public static String getResultSign(String key, String body) throws Exception {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        hmacSha256.init(secret_key);
        return Base64.getEncoder().encodeToString(hmacSha256.doFinal(body.getBytes()));
    }
    public static void main(String[] args) throws Exception {
        String key = "123654";
        String body = "{\n" + "\t\"EventGroupId\":\t2,\n" + "\t\"EventType\":\t204,\n" + "\t\"CallbackTs\":\t1664209748188,\n" + "\t\"EventInfo\":\t{\n" + "\t\t\"RoomId\":\t8489,\n" + "\t\t\"EventTs\":\t1664209748,\n" + "\t\t\"EventMsTs\":\t1664209748180,\n" + "\t\t\"UserId\":\t\"user_85034614\",\n" + "\t\t\"Reason\":\t0\n" + "\t}\n" + "}";
        String Sign = "kkoFeO3Oh2ZHnjtg8tEAQhtXK16/KI05W3BQff8IvGA=";
        String resultSign = getResultSign(key, body);

        if (resultSign.equals(Sign)) {
            System.out.println("{'Status': 'OK', 'Info': 'check pass'}");
        } else {
            System.out.println("{'Status': 'FAIL', 'Info': 'check fail'}");
        }
    }
}
```

【Python】
``` python
# -*- coding: utf8 -*-
import hmac
import base64
from hashlib import sha256

# Feature: third-party callback signature verification
# Parameters:
#   key: key configured in the console
#   body: body returned by Tencent Cloud callbacks
#   sign: signature value returned by Tencent Cloud callbacks
# Returned values:
#   Status: OK indicates verification successful. FAIL indicates verification failed. Refer to Info for details.
#   Info: success/failure information

def checkSign(key, body, sign):
    temp_dict = {}
    computSign = base64.b64encode(hmac.new(key.encode('utf-8'), body.encode('utf-8'), digestmod=sha256).digest()).decode('utf-8')
    print(computSign)
    if computSign == sign:
        temp_dict['Status'] = 'OK'
        temp_dict['Info'] = 'check pass'
        return temp_dict
    else:
        temp_dict['Status'] = 'FAIL'
        temp_dict['Info'] = 'check fail'
        return temp_dict

if __name__ == '__main__':
    key = '123654'
    body = "{\n" + "\t\"EventGroupId\":\t2,\n" + "\t\"EventType\":\t204,\n" + "\t\"CallbackTs\":\t1664209748188,\n" + "\t\"EventInfo\":\t{\n" + "\t\t\"RoomId\":\t8489,\n" + "\t\t\"EventTs\":\t1664209748,\n" + "\t\t\"EventMsTs\":\t1664209748180,\n" + "\t\t\"UserId\":\t\"user_85034614\",\n" + "\t\t\"Reason\":\t0\n" + "\t}\n" + "}"
    sign = 'kkoFeO3Oh2ZHnjtg8tEAQhtXK16/KI05W3BQff8IvGA='
    result = checkSign(key, body, sign)
    print(result)

```

【PHP】
``` php
<?php

class TlsEventSig {
    
    private $key = false;
    private $body = false;
    
    public function __construct( $key, $body ) {
        $this->key = $key;
		$this->body = $body;
    }

    private function __hmacsha256() {
        $hash = hash_hmac( 'sha256', $this->body, $this->key, true );
		return base64_encode( $hash);
    }
    
    public function genEventSig() {
        return $this->__hmacsha256();
    }
}

$key="789";
$data="{\n\t\"EventGroupId\":\t1,\n\t\"EventType\":\t101,\n\t\"CallbackTs\":\t1608086882372,\n\t\"EventInfo\":\t{\n\t\t\"RoomId\":\t20222,\n\t\t\"EventTs\":\t1608086882,\n\t\t\"UserId\":\t\"222222_phone\"\n\t}\n}";

$api = new  TlsEventSig($key, $data);
echo $api->genEventSig();
```

【Golang】
``` go
package main
import "fmt"
import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
)

func main () {
    var data = "{\n\t\"EventGroupId\":\t1,\n\t\"EventType\":\t101,\n\t\"CallbackTs\":\t1608086882372,\n\t\"EventInfo\":\t{\n\t\t\"RoomId\":\t20222,\n\t\t\"EventTs\":\t1608086882,\n\t\t\"UserId\":\t\"222222_phone\"\n\t}\n}"
    var key = "789"

    //JSRUN Engine 2.0 supports running online in up to 30 languages, providing fully simulated interactive input and output.
    fmt.Println(hmacsha256(data,key))
}

func hmacsha256(data string, key string) string {
	h := hmac.New(sha256.New, []byte(key))
	h.Write([]byte(data))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}
```

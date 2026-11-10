---
sync_node_id: '201187955458207744'
nav_path:
  - "推送服务（Push）"
  - "服务端 API"
  - "公共参数（OfflinePushInfo 说明）"
product: "push"
---
## Push OfflinePushInfo Description

OfflinePushInfo is a JSON Object dedicated to notification bar push configuration, allowing you to configure whether to close the push, push title description, text description, push passthrough, and related parameters of push vendors.

### Standard Notification Push
- Marketing news push, see the OfflinePushInfo Field Description.

   ``` bash
   {
       // other parameters...
       "OfflinePushInfo": {
           "PushFlag": 0,
           "Title":"Offline Push Title",
           "Desc": "offline push content",
           "Ext": "{\"entity\":{\"key1\":\"value1\",\"key2\":\"value2\"}}",  // passthrough field, push uses string in json format
           "AndroidInfo": { 
               "Sound": "shake",  // ringtone filename, without suffix
   set
               "OPPOChannelID": "oppo_channel_id",
               "OPPOCategory": "MARKETING",   // OPPO message categorization: content and marketing
               "VIVOCategory": "MARKETING",   // VIVO message categorization: operational messages
               "HuaWeiCategory": "MARKETING", // Huawei message category: information marketing
               "HonorImportance": "LOW",      // Honor message category: information marketing
               "MeiZuNoticeMsgType": 0        // Meizu Message category: information marketing
           },
           "ApnsInfo": {
               "Sound": "apns.mp3", // ringtone filename, with suffix
               "BadgeMode": 1,
               "Title":"apns title",
               "SubTitle":"apns subtitle",
               "Image":"www.image.com",
               "MutableContent": 1
           }
       }
   }
   ```
- Private message push, see the OfflinePushInfo Field Description.

   ``` bash
   {
       // other parameters...
       "OfflinePushInfo": {
           "PushFlag": 0,
           "Title":"Offline Push Title",
           "Desc": "offline push content",
           "Ext": "{\"entity\":{\"key1\":\"value1\",\"key2\":\"value2\"}}",  // passthrough field, recommended string in json format
           "AndroidInfo": { 
               "Sound": "shake",  // ringtone filename, without suffix
               "OPPOChannelID": "oppo_channel_id",
               "VIVOCategory": "IM",                 // vivo message categorization: system message
               "HuaWeiCategory": "IM",               // Huawei message category: service and communication
               "HonorImportance": "NORMAL",          // Honor message category: service communication
               "MeiZuNoticeMsgType": 1,               // Meizu Message category: private message
   set
               "XiaoMiTemplateId": "xxxx",  //  Mi Push private message template id
               "XiaoMiTemplateParam": {     // Mi Push private message template parameters in json format
                   "keywords1": "k1",
                   ...
               },
               "OPPOCategory": "IM",               // OPPO message category: communication and service
               "OPPOPrivateMsgTemplateId": "xxxx", // OPPO private message template id
               "OPPOPrivateTitleParameters": {  // OPPO private message title template parameters in json format
                   "k1": "v1"
                   ...
               },
               "OPPOPrivateContentParameters": { // OPPO private message content template parameters in json format
                   "k1": "v1",
                   ...
               },
           },
           "ApnsInfo": {
               ...    // For details, refer to the ApnsInfo field description
           }
       }
   }
   ```

### APNs Passthrough Push
``` bash
{
    // other parameters...
    "OfflinePushInfo": {
        "Ext": "{\"entity\":{\"key1\":\"value1\",\"key2\":\"value2\"}}", // passthrough field, push uses string in json format
        "ApnsInfo": {
            "ContentAvailable": 1 // APNs Transparent Push Feature
        },
        "AndroidInfo": {
            ...    // For details, see AndroidInfo field description
        }
    }
}
```

### APNs VoIP Push
``` bash
{
    // other parameters...
    "OfflinePushInfo": {
        "Title":"Offline Push Title",  // Fallback to ordinary Notification push Title when recipient's VoIP token is not reported
        "Desc": "Offline Push Content",  // Fallback to ordinary Notification push Desc when recipient's VoIP token is not reported
        "Ext": "{\"entity\":{\"key1\":\"value1\",\"key2\":\"value2\"}}",  // passthrough field, push uses string in json format
        "ApnsInfo": {
            "IsVoipPush": 1 // APNs VoIP Push
        },
        "AndroidInfo": {  
            ...   // For details, see AndroidInfo field description
        }
    }
}
```

### APNs LiveActivity (Dynamic Island) Push
- Remote start of Live Activity: For specific fields, see the LiveActivity field descriptions. Supported on iOS 17.2 and later devices. For client-side configuration.

   ``` bash
   {
     // other parameters...
     "OfflinePushInfo": {
         "Title": "Offline Push Title",
         "Desc": "Offline push content",
         "Ext": "{\"entity\":{\"k1\":\"v1\",\"k2\":\"v2\"}}", // passthrough field, push uses string in json format
         "ApnsInfo": {
              "LiveActivity": {
                  "Event": "start",                   // start LiveActivity
                  "AttributesType": "AdventureAttrs",
                  "Attributes":{
                      "k1": "v1",
                      "k2": "k2",
                      ...
                  },
                  "ContentState": {
                      "k1": "v1",
                      "k2": "v2",
                      ...
                   }
               }
           },
           "AndroidInfo": {
               ... // For details, see AndroidInfo field description
           }
   }
   
   ```
- Update Live Activity: For specific fields, see the LiveActivity field descriptions. Supported on iOS 16.1 and later devices. For client-side configuration.

   ``` bash
   {
     // other parameters...
     "OfflinePushInfo": {
         "Title": "Offline Push Title",
         "Desc": "Offline push content",
         "Ext": "{\"entity\":{\"k1\":\"v1\",\"k2\":\"v2\"}}",  // passthrough field, push uses string in json format
         "ApnsInfo": {
              "LiveActivity": {
                  "LaId": "timpush",
                  "Event": "update", // Update LiveActivity push
                  "ContentState": {
                      "k1": "v1",
                      "k2": "v2",
                      ...
                   }
               }
           },
           "AndroidInfo": {
               ... // For details, see AndroidInfo field description
           }
     }
   }
   ```
- End Live Activity: For specific fields, see the LiveActivity field descriptions. Supported on iOS 16.1 and later devices. For client-side configuration.

   ``` bash
   {
     // other parameters...
     "OfflinePushInfo": {
         "Title": "Offline Push Title",
         "Desc": "Offline push content",
         "Ext": "{\"entity\":{\"k1\":\"v1\",\"k2\":\"v2\"}}",  // passthrough field, push uses string in json format
         "ApnsInfo": {
              "LiveActivity": {
                  "LaId": "timpush",
                  "Event": "end", // End LiveActivity push
                  "ContentState": {
                      "k1": "v1",
                      "k2": "v2",
                      ...
                   },
                  "DismissalDate": 1739502750
               }
           },
           "AndroidInfo": {
               ... // For details, see AndroidInfo field description
           }
     }
   }
   ```

### Multi-language Push
``` java
{
    // other parameters...
    "OfflinePushInfo": {
        "PushFlag": 0,
        "Title":"Offline Push Title",
        "Desc": "offline push content",
        "MultiLanguageContent":[
            {
                "Language":"ko",
                "Title":"오프라인 푸시 제목",
                "Desc":"오프라인 푸시 내용"
            },
            {
                "Language":"en",
                "Title":"Offline Push Notification Title",
                "Desc":"Offline Push Notification Desc"
            }
        ],
        "Ext": "{\"entity\":{\"key1\":\"value1\",\"key2\":\"value2\"}}",  // passthrough field, push uses string in json format
        "AndroidInfo": { 
            ... // For details, refer to the AndroidInfo field description
        },
        "ApnsInfo": {
            ... // For details, refer to the ApnsInfo field description
        }
    }
}
```

### Template-based Push
- Template preset variables (Chat message push only).

   ``` java
   {
       // Other parameters...
       "OfflinePushInfo": {
           "PushFlag": 0,
           "Title":"Offline Push Title",
           "Desc": "Offline Push Content",
           "PushTemplateId":"1400000000-1" // If the template only contains preset variables, PushTemplateParam is not required
       }
   }
   ```
- Template custom variables.

   ``` java
   {
       // Other parameters...
       "OfflinePushInfo": {
           "PushFlag": 0,
           "Title":"Offline Push Title",
           "Desc": "Offline Push Content",
           "PushTemplateId":"1400000000-2",
           "PushTemplateParam":{"UserName":"aaaa","ProductID":"bbbb"}
       }
   }
   ```

### OfflinePushInfo Field Description
| Field | Type | Attribute | Description |
| --- | --- | --- | --- |
| PushFlag | Integer | Optional | - 0: Display a notification in the notification bar when running in the background.<br>- 1: Do not display a notification in the notification bar when running in the background. |
| ForegroundShow | String | Optional | Defaults to empty, which means whether to display the notification bar message is determined by the client configuration. .<br>- "show": Display the notification bar message in the foreground. Supported only by SDK version >= `9.0.7652`.<br>- "hide": Do not display the notification bar message in the foreground. Supported only by SDK version >= `9.0.7652`.<br><strong>Note：</strong><br>This field is supported only in Push APIS, such as single push and push to all users/tags. |
| Title | String | Optional | Notification bar push title. |
| Desc | String | Optional | Notification bar push title. |
| MultiLanguageContent | Array | Optional | Multilingual push content. The backend matches the push content based on the terminal's system language. If no match is found, the default Title and Desc are used. The feature requires SDK version 8.5.6870 or higher. Example code please see Multilingual Push. |
| Language | String | Optional | Title and Desc language flags. For details, please refer to <a href="https://www.tencentcloud.com/document/product/1047/57431?lang=en&pg=#code">Multilingual Code Table</a>. |
| Ext | String | Optional | Offline Push Passthrough Content. Since domestic Android phone manufacturers have different requirements for push platforms, ensure this field is in JSON format, otherwise it may cause failed delivery for specific manufacturers' offline push. |
| AndroidInfo | JSON Object | Optional | Android message push control parameters. For specific fields, see AndroidInfo field description. |
| ApnsInfo | JSON Object | Optional | APNs message push control parameters. For specific fields, see ApnsInfo field description. |
| HarmonyInfo | JSON Object | Optional | Harmony message push control parameters. For specific fields, see HarmonyInfo field description. |
| BadgeAddNum | Integer | Optional | Sets the increment value for the badge number, adding to the current badge count.<br>- APNs Push: Value range: [1-99]. If both BadgeAddNum and BadgeSetNum are present, BadgeSetNum takes precedence. If neither is set.BadgeMode.<br>- Huawei/Honor/Harmony Push: Value range: [1-99]. If both BadgeAddNum and BadgeSetNum are present, BadgeSetNum takes precedence. If neither is set, the badge number increments by 1.<br>- For other push vendors: This field has no effect. |
| BadgeSetNum | Integer | Optional | Set badge number.<br>- For APNs push, the value range is [0~999].<br>- For Huawei/Honor/HarmonyOS push, the value range is [0~99].<br>- For other push vendors, this field will not take effect.<br>- In other cases. |
| PushTemplateId | String | Optional | Push template ID. You must create the template in <a href="https://console.trtc.io/chat/push-plugin-push-setting">Push Settings</a> in advance. Format: <code>1400000000-1</code>. If omitted, the system default push style is used.<br><strong>Note:</strong><br>If template contains preset variables, it is only supported in Chat scenarios; pure Push scenarios (for example single push) will return an error. |
| PushTemplateParam | JSON Object | Optional | Template fill parameters used to fill custom variables. Example: If template title is <code>{{UserName}} Order Notification</code>, pass <code>{"UserName":"aaaa"}</code> here.<br><strong>Note:</strong><br>The following variables are auto-filled by system and should not be provided in <code>PushTemplateParam</code>:<br>- <code>timTitle</code>: replaced by original push title.<br>- <code>timDesc</code>: replaced by original push content.<br>- <code>timSenderNick</code>: replaced by sender nickname.<br>- <code>timGroupName</code>: replaced by group name for group chat, empty string for C2C chat. |

#### AndroidInfo Field Description

> **Note:**
> The following fields support default values configured on the console certificate page: XiaoMiChannelID, OPPOChannelID, OPPOCategory, VIVOCategory, HuaWeiCategory, HuaWeiChannelID, and MeiZuNoticeMsgType. When set through the REST API or SDK, the value passed in the API request takes precedence. If the field is not passed in the request, the default value configured in the certificate will be used.
> 

| Field | Type | Attribute | Description |
| --- | --- | --- | --- |
| Sound | String | Optional | Android system notification ringtone filename, without suffix. For example, setting it to "shake" refers to the local file "/res/raw/shake.xxx" in the corresponding application. |
| PushStyle | Integer | Optional | Android notification bar style. "0" represents the default style, "1" represents the large text style. If left blank, it defaults to 0. Only applicable to Huawei, Honor, and OPPO. |
| XiaoMiChannelID | String | Optional | Mi Push notification category (Channel) adaptation fields for MIUI 10 or higher.<br>When this field is not empty, it overwrites the ChannelID value in the console push certificate configuration. |
| XiaoMiTemplateId | String | Optional | Mi Push private message template ID. This field must be provided when delivering the corresponding private message template. After setting the template ID, the XiaoMiChannelID bound to the template must also be provided. . |
| XiaoMiTemplateParam | JSON Object | Optional | Mi Push template parameters. For example: <code>{"keywords1": "k1"}</code>.<br>- The format must be consistent with the parameters preconfigured for the corresponding template.<br>- The number of parameters must be consistent with the number of parameters preconfigured for the corresponding template.<br>- Parameter value requirements: 1–128 characters in length; cannot consist only of spaces; emoji and special symbols are not supported (Unicode Other Symbol category, i.e., \p{So}); unassigned Unicode characters are not supported. |
| OPPOChannelID | String | Optional | OPPO Push notification channel adaptation fields for Android 8.0 or higher.<br>When this field is not empty, it overwrites the ChannelID value in the console push certificate configuration. |
| OPPOCategory | String | Optional | OPPO push message categorization, used to identify message type. For details, see <a href="https://open.oppomobile.com/new/developmentDoc/info?id=13189">category description</a>.<br>When this field is not empty, it overwrites the category value in the console push certificate configuration. |
| OPPOPrivateMsgTemplateId | String | Optional | OPPO push private message template id, must carry when delivering the corresponding private message template. If OPPOCategory is set to content and marketing, this field is invalid. For details, see <a href="https://open.oppomobile.com/documentation/page/info?id=12391">"OPUSH Private Message Template Verification"</a>. |
| OPPOPrivateTitleParameters | JSON Object | Optional | OPPO push private message template title parameters. Title template example is: welcome to ${city}$, ${city}$ welcomes you. The parameter content is: <code>{"city":"Beijing"}</code> |
| OPPOPrivateContentParameters | JSON Object | Optional | OPPO push private message template content parameters. Content template example is: <code>{"userName":"Tom", "city":"Shenzhen city"}</code> |
| OPPONotifyLevel | Integer | Optional | OPPO push notification bar message reminder level value definition. For details, see <a href="https://open.oppomobile.com/new/developmentDoc/info?id=11236">notify_level description</a>.<br>- 1: Notification bar<br>- 2: Notification bar + lock screen<br>- 16: Notification bar + lock screen + banner + vibration + ringtone<br>When using OPPONotifyLevel, OPPOCategory is required. |
| VIVOClassification | Integer | Optional | vivo push message categorization: "0" represents operational messages, "1" represents system messages. Default is 1 if left blank. (vivo push service optimized message classification rules on April 3, 2023. Recommended to use AndroidInfo. VIVOCategory to set message type.) |
| VIVOCategory | String | Optional | vivo push message categorization, used to identify message type. For details, see <a href="https://dev.vivo.com.cn/documentCenter/doc/359">category description</a>.<br>When this field is not empty, it overwrites the category value in the console push certificate configuration. |
| VIVONotifyType | String | Optional | Notification Type 1: None, 2: Ring, 3: Vibrate, 4: Ring and Vibrate. Default setting is 4, see <a href="https://dev.vivo.com.cn/documentCenter/doc/362">notifyType</a>. |
| HuaWeiImportance | String | Optional | Huawei push messaging reminder level, value is LOW, NORMAL. |
| HuaWeiCategory | String | Optional | Huawei push message classification, used to identify message type. For details, see <a href="https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/https-send-api-0000001050986197#section13271045101216">category description</a>.<br>When this field is not empty, it overwrites the category value in the console push certificate configuration. |
| HuaWeiImage | String | Optional | Small icon URL for Huawei push notifications in the notification bar. The URL must use HTTPS protocol. Example: <code>https://example.com/image.png</code>. The image file must be less than 512KB, with a recommended size of 40dp x 40dp and a corner radius of 8dp. Images exceeding the recommended size may be compressed or not fully displayed. Recommended image formats are JPG, JPEG, or PNG. |
| HonorImage | String | Optional | Icon URL for Honor push notifications in the notification bar. The URL must use HTTPS protocol. Example: <code>https://example.com/image.png</code>. The icon must be less than 512KB, with a recommended size of 40dp x 40dp and a corner radius of 8dp. Icons exceeding the recommended size may be compressed or not fully displayed. |
| HuaWeiChannelID | String | Optional | Huawei Push notification channel field for EMUI 10.0 or higher.<br>When this field is not empty, it overwrites the ChannelID value in the console push certificate configuration. |
| HonorImportance | String | Optional | Categorization for Honor push messages, with values LOW or NORMAL. For details, refer to <a href="https://developer.honor.com/cn/docs/11002/guides/notification-class">Honor Message Categorization</a>. |
| GoogleImage | String | Optional | Icon URL for FCM push notifications in the notification bar. The image resource must not exceed 1MB, supporting JPG, JPEG, or PNG formats. Example:  <code>https://example.com/image.png</code>. |
| GooglePriority | String | Optional | FCM Push Notification Message Priority, see <a href="https://firebase.google.com/docs/cloud-messaging/android/message-priority">priority</a>.<br>- normal: When the device is in the foreground, messages are delivered immediately. When the device is in the background or Doze mode, messages are delivered in batches with a delay.<br>- high: Regardless of the device's state (background/Doze/foreground), messages wake up the device and are delivered immediately. |
| GoogleChannelID | String | Optional | FCM Push notification channel fields for Android 8.0 or higher. |
| MeiZuNoticeMsgType | Integer | Optional | Categorization for Meizu push messages. "0" represents an official message, "1" represents a private message. For details, see <a href="https://open-res.flyme.cn/fileserver/upload/file/202504/13dc49a671b643438431b386e071f59e.pdf">Meizu Message Classification Description</a>.<br>If this field is not empty, it overrides the message categorization in the console's Meizu Push certificate configuration. |

#### ApnsInfo Field Description
| Field | Type | Attribute | Description |
| --- | --- | --- | --- |
| BadgeMode | Integer | Optional | 0 means counting is required, 1 means this message does not count, and the upper right corner icon number does not increase.<br><strong>Note:</strong><br>The default value is 0 in Chat scenarios and 1 in non-Chat scenarios (such as calling the single push API). |
| Title | String | Optional | This field is used to specify the title of APNs push. If filled, it will overwrite the top-level Title. |
| SubTitle | String | Optional | This field is used to specify the subtitle of APNs push. |
| Image | String | Optional | This field is used to specify the image address carried by APNs. When the client receives this field, the image can be displayed in the popup by downloading the image resource. |
| MutableContent | Integer | Optional | Set to 1 to enable push extension for iOS 10+. Default is 0. |
| Sound | String | Optional | iOS system notification ringtone filename, with suffix. Custom ringtone length cannot exceed 30s. The audio file must be added to the Xcode project first. Example value: <code>shake.mp3</code>. |
| InterruptionLevel | String | Optional | The notification level for iOS 15+ push notifications can only be one of active, critical, passive, or time-sensitive. For details, please refer to: <a href="https://developer.apple.com/documentation/usernotifications/unnotificationinterruptionlevel">APNs InterruptionLevel description</a>. |
| ContentAvailable | Integer | Optional | 1 indicates a silent push for iOS, with no popup in the notification banner. Apple recommends sending no more than 3 silent messages per hour. For details, please refer to: <a href="https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app">APNs Background Notification</a>. |
| IsVoipPush | Integer | Optional | 1 indicates a VoIP push for iOS. If the recipient does not provide a VoIP token, it will be automatically downgraded to a regular APNs notification push. |
| LiveActivity | JSON Object | Optional | LiveActivity push control parameters. For specific fields, see LiveActivity field description. If the LaId is invalid or the corresponding token has not been reported, it will automatically downgrade to a regular APNs Notification push. |
| NoFallback | Integer | Optional | - 0 (default): VoIP push and LiveActivity push automatically downgrade to regular push upon failure.<br>- 1: VoIP push and LiveActivity push are prohibited from automatic downgrading and will end the push upon failure. |
| Priority | Integer | Optional | APNS notification priority. If omitted, APNs defaults to 10. For more details, see <a href="https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns">APNs notification priority</a>.<br>- 10 : Send the notification immediately.<br>- 5 : Send the notification based on power considerations on the user's device.<br>- 1 : Prioritize the device's power considerations over all other factors for delivery, and prevent awakening the device.<br><strong>Note：</strong><br>Currently, only the All-user/Tag Push and Single Push APIs support setting this field. |

##### Harmony Field Description
| Field | Type | Attribute | Description |
| --- | --- | --- | --- |
| Title | String | Optional | This field is used to identify the title of Harmony push. If filled, it will overwrite the top-level Title. |
| Category | String | Optional | HarmonyOS push message categorization, used to identify message type. For details, see <a href="https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/push-scenariozed-api-request-param-V5#section17371529101117">category description</a>.<br>When not empty, this field will overwrite the category value in the console Push Certificate configuration. |
| Image | String | Optional | Notification Large Icon URL. The URL must use the HTTPS protocol. Supported image formats: PNG, JPG, JPEG, HEIF, GIF, BMP. The image dimensions (height × width) must be less than 25,000 pixels. |
| Sound | String | Optional | Custom message notification sound. The ringtone file set here must be placed in the /resources/rawfile path of the application. For example, setting it to "alert.mp3" corresponds to the local /resources/rawfile/alert.mp3 file in the application. Supported file formats include MP3, WAV, MPEG. If not set, the default system ringtone is used.<br>When the request does not carry the SoundDuration field, it is recommended that the ringtone duration cannot exceed 30 seconds. If it exceeds 30 seconds, truncate it. When the request carries the SoundDuration field. |
| SoundDuration | Integer | Optional | Custom message notification ringtone duration. Need to be used with the Sound field, effective only when the request carries both the Sound field and the SoundDuration field. Support numbers only, in seconds, in the range of [1,60].<br>The custom message notification ringtone passed in the Sound field will play until the SoundDuration field value is reached. If the duration of the custom message notification ringtone is insufficient, it will loop playback and stop when the SoundDuration field value is reached. |

##### LiveActivity Field Description

|Field|Type|Attribute|Description|
|---------|---------|---------|---------|
|Event|String|Required|Push event type for Live Activity: fill in "start" to start, "update" to update, and "end" to end. For details, refer to Implementing Live Activity (Dynamic Island) functionality. For an introduction to Live Activity in APNs, refer to the [APNs documentation](https://developer.apple.com/documentation/activitykit/updating-and-ending-your-live-activity-with-activitykit-push-notifications).|
|AttributesType|String|Optional|Required when Event is "start". The name of the Live Activity attributes type, which must exactly match the name of the attributes type struct defined on the client.|
|Attributes|JSON Object|Optional|Required when Event is "start". A custom key:value object representing the static attributes declared in the Live Activity attributes type, used to initialize the Live Activity. Must match the values of the client SDK.|
|LaId|String|Optional|Required when Event is "update" or "end". The Live Activity identifier, corresponding to the client activityID, with a length not exceeding 64 bytes.|
|ContentState|JSON Object|Required|Required when Event is "start", "update", or "end". A custom key:value object representing the dynamic attributes declared in the Live Activity attributes type. Must match the values of the client SDK.|
|DismissalDate|Integer|Optional|When Event is "end", the Unix time at which the Live Activity ends its display on the lock screen. Defaults to the current time, dismissing the lock screen activity immediately.|

> **Note:**
> - Since APNs push restrictions limit packet size to 4K, exclude other control fields and keep the sum of Desc and Ext fields under 3K.
> - If offline push is needed, strongly recommend the sender to specify OfflinePushInfo.Title and OfflinePushInfo.Desc. For C2C/group messages, if OfflinePushInfo.Title and OfflinePushInfo.Desc are not filled in, the fallback logic will attempt to convert and retrieve Title and Desc from MsgBody for offline push.

### Notification Title and Content Length Limits
| Push Platform | Title Length Limit | Content Length Limit | Over-Length Handling Rule |
| --- | --- | --- | --- |
| Huawei | 60 | 600 | When the title or content exceeds the length limit of the corresponding channel, <strong>it will be automatically truncated to the limit length with ... (ellipsis) appended at the end</strong> (occupying 3 units). That is, the actual retained content is limit length − 3 units. |
| HONOR | 50 | 400 |  |
| Mi | 50 | 128 |  |
| OPPO | 50 | 50 (128 for long text push, i.e., when AndroidInfo.PushStyle = 1) |  |
| vivo | 40 | 100 |  |
| Meizu | 32 | 100 |  |

> **Note****：**
> 
> - The length limits listed above are measured in UTF-16 code units.
> - Common characters (Chinese, English, digits, common punctuation): each character counts as 1 unit.
> - Certain special characters (such as most emoji like 😀🎉, and some rare CJK characters): each character counts as 2 units.
> - Composite emoji (such as 👋🏽, 👨‍👩‍👧, etc.): composed of multiple characters, where the total unit count is the sum of each individual character's units, and may well exceed 2 units.
